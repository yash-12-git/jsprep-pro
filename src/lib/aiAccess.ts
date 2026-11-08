/**
 * Who is calling /api/ai, what they may use, and how much of it.
 *
 * Server-only. Pro status is read from Firestore with the Admin SDK on each
 * request, because the client's copy of `isPro` can't be trusted.
 */

import crypto from "crypto";
import type { NextRequest } from "next/server";
import { decodeIdToken, getAdminDb } from "@/lib/firebaseAdmin";
import { hasActivePromo } from "@/lib/promoPro";

export type AITier = "anon" | "free" | "pro";

export interface AICaller {
  tier: AITier;
  /** Identifies this caller's daily usage counter. */
  key: string;
}

// Each AI request counts as one, including every turn of a mock interview
// (10 turns plus the scorecard).
export const DAILY_AI_LIMITS: Record<AITier, number> = {
  anon: 20,
  free: 30,
  pro: 300,
};

const USAGE_COL = "aiUsage";
const DAY_MS = 24 * 60 * 60 * 1000;

// Firestore retries quota errors with long backoffs, so without a limit an
// exhausted quota leaves every AI request hanging until the platform kills it.
const FIRESTORE_TIMEOUT_MS = 4_000;

/** Rejects if a Firestore-backed check takes too long to answer. */
export function withFirestoreTimeout<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Firestore did not respond in time")),
      FIRESTORE_TIMEOUT_MS,
    );
  });
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
}

function hasActivePro(
  user: FirebaseFirestore.DocumentData | undefined,
  entitlements: FirebaseFirestore.DocumentData | undefined,
) {
  // Free Pro earned through feedback or referrals.
  if (hasActivePromo(entitlements, user)) return true;
  if (user?.isPro !== true) return false;
  return !user.proExpiresAt || new Date(user.proExpiresAt) > new Date();
}

// Keyed so stored counters can't be reversed into IP addresses by hashing the
// small IPv4 space. The admin private key is already a required server secret.
function anonymousKey(req: NextRequest) {
  // Vercel overwrites this header, so clients can't choose their own IP here.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const hash = crypto
    .createHmac("sha256", process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "")
    .update(ip)
    .digest("hex");
  return `ip_${hash}`;
}

/**
 * Returns null when an Authorization header was sent but is invalid, so an
 * expired or forged token is rejected instead of being treated as anonymous.
 */
export async function resolveAICaller(req: NextRequest): Promise<AICaller | null> {
  const header = req.headers.get("authorization");
  if (!header) return { tier: "anon", key: anonymousKey(req) };

  const decoded = await decodeIdToken(header);
  if (!decoded) return null;

  const key = `uid_${decoded.uid}`;
  if (decoded.isAdmin === true) return { tier: "pro", key };

  const db = getAdminDb();
  const [snap, ent] = await Promise.all([
    db.collection("users").doc(decoded.uid).get(),
    db.collection("entitlements").doc(decoded.uid).get(),
  ]);
  return { tier: hasActivePro(snap.data(), ent.data()) ? "pro" : "free", key };
}

// What a free account gets of each AI feature, once, ever: a taste before
// paying, since each use is a paid model call. Counted in the `_allowances`
// doc, which never expires. Pro has no per-feature limit.
export const FREE_LIFETIME_LIMITS: Partial<Record<string, number>> = {
  evaluate: 3, // AI scoring of written answers
  qa: 3, // AI tutor
  debugcheck: 3, // AI code checker
};
const FREE_STUDY_PLAN_EVERY_MS = 7 * DAY_MS;

/**
 * - `ok`: counted.
 * - `daily`: today's total is used up.
 * - `upgrade`: the free allowance for this feature is used up.
 */
export type QuotaResult = "ok" | "daily" | "upgrade";

/**
 * Counts one request against today's limit (UTC) and, for free accounts, the
 * feature's lifetime allowance. Runs in a transaction so parallel requests can't
 * overshoot. `expiresAt` lets a Firestore TTL policy clean up daily counters;
 * the `_allowances` doc (lifetime feature uses, study plan week, mock trial)
 * is kept.
 *
 * `opensMockInterview` marks the first request of a mock interview: a free
 * account gets one interview, and later turns are only allowed once it began.
 */
export async function consumeAIQuota(
  caller: AICaller,
  type: string,
  opensMockInterview = false,
): Promise<QuotaResult> {
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const db = getAdminDb();
  const dayRef = db.collection(USAGE_COL).doc(`${caller.key}_${day}`);
  const allowRef = db.collection(USAGE_COL).doc(`${caller.key}_allowances`);
  const metered = caller.tier === "free";

  return db.runTransaction(async (tx) => {
    const [daySnap, allowSnap] = await Promise.all([
      tx.get(dayRef),
      metered ? tx.get(allowRef) : Promise.resolve(null),
    ]);
    const used = daySnap.data() ?? {};
    const count: number = used.count ?? 0;
    if (count >= DAILY_AI_LIMITS[caller.tier]) return "daily";

    const dayUpdate: Record<string, unknown> = {
      count: count + 1,
      expiresAt: new Date(now.getTime() + 2 * DAY_MS),
    };
    let allowUpdate: Record<string, unknown> | null = null;

    if (metered) {
      const allow = allowSnap?.data() ?? {};
      const featureLimit = FREE_LIFETIME_LIMITS[type];
      if (featureLimit !== undefined) {
        const field = `used_${type}`;
        const featureCount: number = allow[field] ?? 0;
        if (featureCount >= featureLimit) return "upgrade";
        allowUpdate = { [field]: featureCount + 1 };
      }
      if (type === "studyplan") {
        const last = allow.studyPlanAt ? Date.parse(allow.studyPlanAt) : 0;
        if (now.getTime() - last < FREE_STUDY_PLAN_EVERY_MS) return "upgrade";
        allowUpdate = { studyPlanAt: now.toISOString() };
      }
      if (type === "mock") {
        if (opensMockInterview) {
          if (allow.mockTrialAt) return "upgrade";
          allowUpdate = { mockTrialAt: now.toISOString() };
        } else {
          // Turns of the one trial interview, which lasts well under a day.
          const began = allow.mockTrialAt ? Date.parse(allow.mockTrialAt) : 0;
          if (now.getTime() - began > DAY_MS) return "upgrade";
        }
      }
    }

    tx.set(dayRef, dayUpdate, { merge: true });
    if (allowUpdate) tx.set(allowRef, allowUpdate, { merge: true });
    return "ok";
  });
}

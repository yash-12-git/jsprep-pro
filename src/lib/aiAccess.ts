/**
 * Who is calling /api/ai, what they may use, and how much of it.
 *
 * Server-only. Pro status is read from Firestore with the Admin SDK on each
 * request, because the client's copy of `isPro` can't be trusted.
 */

import crypto from "crypto";
import type { NextRequest } from "next/server";
import { decodeIdToken, getAdminDb } from "@/lib/firebaseAdmin";

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

function hasActivePro(user: FirebaseFirestore.DocumentData | undefined) {
  if (user?.isPro !== true) return false;
  return !user.proExpiresAt || new Date(user.proExpiresAt) > new Date();
}

// Keyed so stored counters can't be reversed into IP addresses by hashing the
// small IPv4 space. The admin private key is already a required server secret.
function anonymousKey(req: NextRequest) {
  const ip =
    req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
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

  const snap = await getAdminDb().collection("users").doc(decoded.uid).get();
  return { tier: hasActivePro(snap.data()) ? "pro" : "free", key };
}

/**
 * Counts one request against today's limit (UTC) and returns false once it's
 * used up. Runs in a transaction so parallel requests can't overshoot.
 * `expiresAt` lets a Firestore TTL policy clean up old counters.
 */
export async function consumeAIQuota(caller: AICaller): Promise<boolean> {
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const db = getAdminDb();
  const ref = db.collection(USAGE_COL).doc(`${caller.key}_${day}`);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count: number = snap.data()?.count ?? 0;
    if (count >= DAILY_AI_LIMITS[caller.tier]) return false;
    tx.set(ref, {
      count: count + 1,
      expiresAt: new Date(now.getTime() + 2 * DAY_MS),
    });
    return true;
  });
}

/**
 * GET /api/referral
 *
 * The caller's referral code (created on first request), how many referral
 * rewards they have earned, whether they've claimed the feedback week, and
 * until when earned Pro lasts. Codes map to uids in referralCodes/{code}, which
 * only the server reads, so a link never exposes anyone's uid.
 */

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import {
  MAX_REFERRAL_REWARDS,
  REWARD_DAYS,
  entitlementsRef,
  withTimeout,
  type Entitlements,
} from "@/lib/rewards";
import { hasRenewingSubscription, promoProEnd } from "@/lib/promoPro";

export const runtime = "nodejs";

// No 0/O or 1/I/L, so a code read aloud or retyped still works.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function newCode() {
  return Array.from(crypto.randomBytes(8), (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export async function GET(req: NextRequest) {
  const uid = await verifyIdToken(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const db = getAdminDb();
  try {
    const result = await withTimeout(db.runTransaction(async (tx) => {
      const [entSnap, userSnap] = await Promise.all([
        tx.get(entitlementsRef(db, uid)),
        tx.get(db.collection("users").doc(uid)),
      ]);
      const ent = entSnap.data() as Entitlements | undefined;
      const user = userSnap.data();
      const end = promoProEnd(ent, user);
      const status = {
        rewarded: ent?.referralsRewarded ?? 0,
        feedbackDone: Boolean(ent?.feedbackRewardedAt),
        // When earned Pro ends, if it is running or still to come.
        promoProUntil: end > Date.now() ? new Date(end).toISOString() : null,
        bankedProDays: ent?.bankedProDays ?? 0,
        renewing: hasRenewingSubscription(user),
      };
      if (ent?.referralCode) return { code: ent.referralCode, ...status };

      // 31^8 codes; a collision is near impossible, but check anyway.
      let code = newCode();
      for (let i = 0; i < 3 && (await tx.get(db.collection("referralCodes").doc(code))).exists; i++) {
        code = newCode();
      }
      tx.set(db.collection("referralCodes").doc(code), { uid, createdAt: new Date().toISOString() });
      tx.set(entitlementsRef(db, uid), { referralCode: code }, { merge: true });
      return { code, ...status };
    }));

    return NextResponse.json({
      ...result,
      max: MAX_REFERRAL_REWARDS,
      rewardDays: REWARD_DAYS.referral,
    });
  } catch (err) {
    console.error("[referral]", err);
    return NextResponse.json(
      { error: "We couldn't load your invite link. Try again in a moment." },
      { status: 503 },
    );
  }
}

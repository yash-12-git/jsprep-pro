/**
 * POST /api/referral/complete
 *
 * Pays out a referral once the referred account has finished a sprint in
 * which it answered something: two weeks of Pro each for the referrer (up to
 * MAX_REFERRAL_REWARDS times) and the friend. Safe to call repeatedly; it
 * does nothing unless there is an unpaid referral and a qualifying sprint.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import {
  MAX_REFERRAL_REWARDS,
  REWARD_DAYS,
  entitlementsRef,
  grantProDays,
  withTimeout,
  type Entitlements,
} from "@/lib/rewards";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const uid = await verifyIdToken(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const db = getAdminDb();
  try {
    const answered = await withTimeout(
      db.collection("users").doc(uid).collection("sprints").where("attempted", ">", 0).limit(1).get(),
    );
    if (answered.empty) return NextResponse.json({ ok: false, reason: "no_sprint" });

    const result = await withTimeout(db.runTransaction(async (tx) => {
      const ent = (await tx.get(entitlementsRef(db, uid))).data() as Entitlements | undefined;
      const referrer = ent?.referredBy;
      if (!referrer) return { reason: "not_referred" };
      if (ent?.referralRewardedAt) return { reason: "already_rewarded" };

      const [referrerEnt, referrerUser, user] = await Promise.all([
        tx.get(entitlementsRef(db, referrer)),
        tx.get(db.collection("users").doc(referrer)),
        tx.get(db.collection("users").doc(uid)),
      ]);
      const referrerData = referrerEnt.data() as Entitlements | undefined;
      const now = new Date().toISOString();

      const grant = grantProDays(
        tx,
        db,
        uid,
        REWARD_DAYS.referral,
        { entitlements: ent, user: user.data() },
        { referralRewardedAt: now },
      );
      const earned = referrerData?.referralsRewarded ?? 0;
      if (earned < MAX_REFERRAL_REWARDS) {
        grantProDays(
          tx,
          db,
          referrer,
          REWARD_DAYS.referral,
          { entitlements: referrerData, user: referrerUser.data() },
          { referralsRewarded: earned + 1 },
        );
      }
      return { grant };
    }));

    return NextResponse.json(
      "reason" in result ? { ok: false, reason: result.reason } : { ok: true, ...result.grant },
    );
  } catch (err) {
    console.error("[referral/complete]", err);
    return NextResponse.json({ error: "Could not complete the referral." }, { status: 503 });
  }
}

/**
 * POST /api/rewards/feedback
 *
 * Saves the caller's feedback and grants a week of Pro, once per account.
 * Feedback is stored at feedback/{uid}, so the doc id itself enforces "once".
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import { parseFeedback } from "@/lib/feedbackOptions";
import {
  REWARD_DAYS,
  entitlementsRef,
  grantProDays,
  withTimeout,
  type Entitlements,
} from "@/lib/rewards";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const uid = await verifyIdToken(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "Sign in to send feedback." }, { status: 401 });

  const answers = parseFeedback(await req.json().catch(() => null));
  if (typeof answers === "string") {
    return NextResponse.json({ error: answers }, { status: 400 });
  }

  const db = getAdminDb();
  try {
    const grant = await withTimeout(db.runTransaction(async (tx) => {
      const feedbackRef = db.collection("feedback").doc(uid);
      const [existing, ent, user] = await Promise.all([
        tx.get(feedbackRef),
        tx.get(entitlementsRef(db, uid)),
        tx.get(db.collection("users").doc(uid)),
      ]);
      const entitlements = ent.data() as Entitlements | undefined;
      if (existing.exists || entitlements?.feedbackRewardedAt) return null;

      const now = new Date().toISOString();
      tx.set(feedbackRef, { ...answers, uid, createdAt: now });
      return grantProDays(
        tx,
        db,
        uid,
        REWARD_DAYS.feedback,
        { entitlements, user: user.data() },
        { feedbackRewardedAt: now },
      );
    }));

    if (!grant) {
      return NextResponse.json(
        { error: "You've already sent feedback and claimed your free week." },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true, ...grant });
  } catch (err) {
    console.error("[rewards/feedback]", err);
    return NextResponse.json(
      { error: "We couldn't save your feedback. Try again in a moment." },
      { status: 503 },
    );
  }
}

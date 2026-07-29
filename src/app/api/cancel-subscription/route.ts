/**
 * POST /api/cancel-subscription
 *
 * Cancels the caller's subscription at the end of the current billing cycle,
 * so they keep the access they already paid for. Razorpay then emits
 * subscription.cancelled, and no further charge occurs — `proExpiresAt` is
 * never extended again, so Pro lapses when the paid period runs out.
 *
 * The subscription id is read from the user's own Firestore doc, never from
 * the request body, so nobody can cancel someone else's subscription.
 */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import { proExpiryFrom } from "@/lib/subscription";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const uid = await verifyIdToken(req.headers.get("authorization"));
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    const subscriptionId = snap.data()?.razorpaySubscriptionId;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // `cancel_at_cycle_end: true` — stop renewing, but don't revoke today.
    const sub = await razorpay.subscriptions.cancel(subscriptionId, true);

    const expiresAt = proExpiryFrom(sub.current_end);
    await userRef.set(
      {
        subscriptionStatus: "cancelled",
        proExpiresAt: expiresAt,
        cancelledAt: new Date().toISOString(),
      },
      { merge: true },
    );

    console.log(`❌ ${uid} cancelled ${subscriptionId}, Pro until ${expiresAt}`);
    return NextResponse.json({ ok: true, proExpiresAt: expiresAt });
  } catch (err) {
    console.error("cancel-subscription error:", err);
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}

/**
 * POST /api/verify-payment
 *
 * The ONLY client-facing path that can grant Pro. Called from the Razorpay
 * checkout `handler` callback after the first subscription charge.
 *
 * Four independent checks must all pass:
 *   1. Caller holds a valid Firebase ID token           → who they are
 *   2. razorpay_signature is a valid HMAC                → Razorpay really sent it
 *   3. The subscription was created for THIS uid         → no replaying someone else's receipt
 *   4. Razorpay says the subscription is live            → money actually moved
 *
 * The webhook (subscription.charged) does the same write independently, so a
 * user who closes the tab mid-callback still gets activated.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import { proExpiryFrom } from "@/lib/subscription";

export const runtime = "nodejs";

const ACTIVE_STATUSES = ["active", "authenticated", "pending"];

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    const uid = await verifyIdToken(req.headers.get("authorization"));
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_payment_id: paymentId,
      razorpay_subscription_id: subscriptionId,
      razorpay_signature: signature,
    } = await req.json();

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json(
        { error: "Missing payment fields" },
        { status: 400 },
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("verify-payment: RAZORPAY_KEY_SECRET not set");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // ── 2. Signature ──────────────────────────────────────────────────────
    // NOTE: subscriptions sign `payment_id|subscription_id` — the reverse of
    // the `order_id|payment_id` order used for one-time orders. Getting this
    // backwards fails every verification.
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${paymentId}|${subscriptionId}`)
      .digest("hex");

    if (!safeEqual(signature, expected)) {
      console.error(`verify-payment: bad signature for sub ${subscriptionId}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: keySecret,
    });

    // ── 3. Subscription belongs to this user ──────────────────────────────
    const sub = await razorpay.subscriptions.fetch(subscriptionId);
    const subUserId = (sub.notes as Record<string, string> | undefined)?.userId;

    if (subUserId !== uid) {
      console.error(
        `verify-payment: sub ${subscriptionId} belongs to ${subUserId}, not ${uid}`,
      );
      return NextResponse.json({ error: "Subscription mismatch" }, { status: 403 });
    }

    // ── 4. Subscription is live ───────────────────────────────────────────
    if (!ACTIVE_STATUSES.includes(sub.status)) {
      return NextResponse.json(
        { error: `Subscription not active (${sub.status})` },
        { status: 400 },
      );
    }

    // ── Grant Pro until the end of the paid period ────────────────────────
    const db = getAdminDb();
    await db.collection("users").doc(uid).set(
      {
        isPro: true,
        razorpaySubscriptionId: subscriptionId,
        razorpayPaymentId: paymentId,
        proActivatedAt: new Date().toISOString(),
        proExpiresAt: proExpiryFrom(sub.current_end),
        subscriptionStatus: "active",
      },
      { merge: true },
    );

    console.log(`✅ Pro activated for ${uid} via ${subscriptionId}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

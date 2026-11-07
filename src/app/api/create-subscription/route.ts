/**
 * POST /api/create-subscription
 *
 * Creates a recurring Razorpay Subscription for the authenticated caller and
 * returns its id for checkout. Replaces the old one-time /api/create-order.
 *
 * The uid comes from the verified ID token and the plan from the request IP —
 * never from the request body, or the caller could pick their own price.
 */

import { getPlanForCountry } from "@/lib/pricing";
import { getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

// Monthly billing cycles to authorise up front. Razorpay requires a finite
// count; 120 = 10 years, effectively "until cancelled".
const TOTAL_BILLING_CYCLES = 120;

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyIdToken(req.headers.get("authorization"));
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    const user = (await db.collection("users").doc(userId).get()).data();
    const proUntil = user?.proExpiresAt ? new Date(user.proExpiresAt) : null;
    // A cancelled plan keeps access until the paid period ends, so subscribing
    // again then would charge twice for the same days.
    if (
      user?.isPro === true &&
      user.subscriptionStatus !== "halted" &&
      (!proUntil || proUntil > new Date())
    ) {
      return NextResponse.json(
        {
          error: proUntil
            ? `You already have Pro until ${proUntil.toDateString()}.`
            : "You already have Pro.",
        },
        { status: 409 },
      );
    }

    const country =
      req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");
    const { planId, pricing } = getPlanForCountry(country);

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Reuse an unpaid subscription from an earlier attempt, so two open
    // checkouts (two tabs, a double click) can't become two paid plans.
    // Server-only collection: users can edit their own users/{uid} doc.
    const pendingRef = db.collection("pendingSubscriptions").doc(userId);
    const pendingId: string | undefined = (await pendingRef.get()).data()
      ?.subscriptionId;
    if (pendingId) {
      const existing = await razorpay.subscriptions
        .fetch(pendingId)
        .catch(() => null);
      if (
        existing?.status === "created" &&
        existing.plan_id === planId &&
        (existing.notes as Record<string, string> | undefined)?.userId === userId
      ) {
        return NextResponse.json({
          subscriptionId: existing.id,
          currency: pricing.currency,
          amount: pricing.amount,
          symbol: pricing.symbol,
          display: pricing.display,
        });
      }
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: TOTAL_BILLING_CYCLES,
      quantity: 1,
      customer_notify: 1,
      notes: { userId }, // ← checked by verify-payment and the webhook
    });
    await pendingRef.set({
      subscriptionId: subscription.id,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      currency: pricing.currency,
      amount: pricing.amount,
      symbol: pricing.symbol,
      display: pricing.display,
    });
  } catch (err) {
    console.error("create-subscription error:", err);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}

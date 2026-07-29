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
import { verifyIdToken } from "@/lib/firebaseAdmin";
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

    const country =
      req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");
    const { planId, pricing } = getPlanForCountry(country);

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: TOTAL_BILLING_CYCLES,
      quantity: 1,
      customer_notify: 1,
      notes: { userId }, // ← checked by verify-payment and the webhook
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

import { CURRENCY_PRICES, getPricingForCountry } from "@/lib/pricing";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const { userId, forceCurrency } = await req.json();
    const country =
      req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");
    const detected = getPricingForCountry(country);
    const pricing = forceCurrency
      ? (CURRENCY_PRICES[forceCurrency] ?? detected)
      : detected;

      console.log(pricing, forceCurrency, "line15");
      

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: pricing.amount,
      currency: pricing.currency,
      notes: { userId }, // ← passed to webhook via payment.notes
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      currency: pricing.currency,
      amount: pricing.amount,
      symbol: pricing.symbol,
      display: pricing.display,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

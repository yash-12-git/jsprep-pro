/**
 * POST /api/razorpay/webhook
 *
 * Server-to-server safety net. Runs independently of /api/verify-payment so a
 * user who closes the tab during checkout still gets activated.
 *
 * Requires RAZORPAY_WEBHOOK_SECRET (Razorpay Dashboard → Settings → Webhooks).
 * This is NOT the same value as RAZORPAY_KEY_SECRET.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { proExpiryFrom, graceExpiry } from "@/lib/subscription";

export const runtime = "nodejs";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function findUserBySubscription(
  db: FirebaseFirestore.Firestore,
  subscriptionId: string,
) {
  const snap = await db
    .collection("users")
    .where("razorpaySubscriptionId", "==", subscriptionId)
    .limit(1)
    .get();
  return snap.empty ? null : snap.docs[0];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    // No silent fallback to RAZORPAY_KEY_SECRET — that only ever produced
    // signature mismatches that looked like Razorpay sending bad requests.
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("webhook: RAZORPAY_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (!safeEqual(signature, expectedSig)) {
      console.error("webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const db = getAdminDb();
    const now = new Date().toISOString();

    console.log("Razorpay webhook event:", event.event);

    switch (event.event) {
      // ── First charge / every renewal → extend Pro one period ──────
      // subscription.charged fires on the initial payment AND on each
      // monthly renewal, so this single case keeps access rolling forward.
      case "subscription.charged": {
        const sub = event.payload.subscription.entity;
        const userId = sub.notes?.userId;
        const userDoc = userId ? null : await findUserBySubscription(db, sub.id);
        const ref = userId
          ? db.collection("users").doc(userId)
          : (userDoc?.ref ?? null);

        if (!ref) {
          console.warn(`webhook: no user for subscription ${sub.id}`);
          break;
        }

        await ref.set(
          {
            isPro: true,
            razorpaySubscriptionId: sub.id,
            proExpiresAt: proExpiryFrom(sub.current_end),
            subscriptionStatus: "active",
            lastRenewedAt: now,
          },
          { merge: true },
        );
        console.log(`🔄 Pro extended for ${ref.id} until ${proExpiryFrom(sub.current_end)}`);
        break;
      }

      // ── Subscription authenticated / activated ─────────────────────
      case "subscription.activated": {
        const sub = event.payload.subscription.entity;
        const userId = sub.notes?.userId;

        if (!userId) {
          console.warn(`webhook: subscription ${sub.id} has no notes.userId`);
          break;
        }

        // set+merge, not update: update() throws NOT_FOUND if the user doc
        // hasn't been created yet, which Razorpay would retry forever.
        await db
          .collection("users")
          .doc(userId)
          .set(
            {
              isPro: true,
              razorpaySubscriptionId: sub.id,
              proActivatedAt: now,
              proExpiresAt: proExpiryFrom(sub.current_end),
              subscriptionStatus: "active",
            },
            { merge: true },
          );
        console.log(`✅ Subscription activated for user ${userId}`);
        break;
      }

      // ── Renewal failed, Razorpay is retrying ───────────────────────
      case "subscription.halted": {
        const sub = event.payload.subscription.entity;
        const userDoc = await findUserBySubscription(db, sub.id);
        if (userDoc) {
          // Short grace window, then Pro lapses on its own. Never extend
          // beyond a date the user has actually paid for.
          await userDoc.ref.update({
            proExpiresAt: graceExpiry(),
            subscriptionStatus: "halted",
          });
          console.log(`⚠️ Subscription halted for ${userDoc.id}`);
        }
        break;
      }

      // ── Cancelled → keep access until the paid period ends ─────────
      case "subscription.cancelled": {
        const sub = event.payload.subscription.entity;
        const userDoc = await findUserBySubscription(db, sub.id);
        if (userDoc) {
          const expiresAt = proExpiryFrom(sub.current_end);
          await userDoc.ref.update({
            proExpiresAt: expiresAt,
            subscriptionStatus: "cancelled",
          });
          console.log(`❌ Cancelled for ${userDoc.id}, Pro until ${expiresAt}`);
        }
        break;
      }

      // ── Fully ended → revoke now ───────────────────────────────────
      case "subscription.completed":
      case "subscription.expired": {
        const sub = event.payload.subscription.entity;
        const userDoc = await findUserBySubscription(db, sub.id);
        if (userDoc) {
          await userDoc.ref.update({
            isPro: false,
            proExpiresAt: now,
            subscriptionStatus: event.event.split(".")[1],
          });
          console.log(`🔴 Pro revoked for user ${userDoc.id}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

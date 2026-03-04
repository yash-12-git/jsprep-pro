import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (server-side only)
function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  }
  return getFirestore()
}

// Find user by Razorpay subscription ID
async function findUserBySubscription(db: FirebaseFirestore.Firestore, subscriptionId: string) {
  const snap = await db.collection('users')
    .where('razorpaySubscriptionId', '==', subscriptionId)
    .limit(1)
    .get()
  if (snap.empty) return null
  return snap.docs[0]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || ''

    // Verify Razorpay signature
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSig) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const db = getAdminDb()

    console.log('Razorpay webhook event:', event.event)

    switch (event.event) {

      // ── Payment succeeded → activate Pro ──────────────────────────
      case 'payment.captured': {
        const payment = event.payload.payment.entity
        const userId = payment.notes?.userId
        const subscriptionId = payment.subscription_id

        if (userId) {
          await db.collection('users').doc(userId).update({
            isPro: true,
            razorpaySubscriptionId: subscriptionId || null,
            proActivatedAt: new Date().toISOString(),
            proExpiresAt: null, // active subscription, no expiry
          })
          console.log(`✅ Pro activated for user ${userId}`)
        }
        break
      }

      // ── Subscription activated ─────────────────────────────────────
      case 'subscription.activated': {
        const sub = event.payload.subscription.entity
        const userId = sub.notes?.userId

        if (userId) {
          await db.collection('users').doc(userId).update({
            isPro: true,
            razorpaySubscriptionId: sub.id,
            proActivatedAt: new Date().toISOString(),
            proExpiresAt: null,
          })
          console.log(`✅ Subscription activated for user ${userId}`)
        }
        break
      }

      // ── Subscription renewed (monthly charge success) ──────────────
      case 'subscription.charged': {
        const sub = event.payload.subscription.entity
        const userDoc = await findUserBySubscription(db, sub.id)
        if (userDoc) {
          await userDoc.ref.update({
            isPro: true,
            proExpiresAt: null, // renewed, still active
            lastRenewedAt: new Date().toISOString(),
          })
          console.log(`🔄 Subscription renewed for user ${userDoc.id}`)
        }
        break
      }

      // ── Subscription halted (payment failed, grace period) ─────────
      case 'subscription.halted': {
        const sub = event.payload.subscription.entity
        const userDoc = await findUserBySubscription(db, sub.id)
        if (userDoc) {
          // Give 3-day grace period before revoking
          const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          await userDoc.ref.update({
            isPro: true, // still Pro during grace period
            proExpiresAt: expiresAt,
            subscriptionStatus: 'halted',
          })
          console.log(`⚠️ Subscription halted for user ${userDoc.id}, grace until ${expiresAt}`)
        }
        break
      }

      // ── Subscription cancelled (user cancelled) ────────────────────
      case 'subscription.cancelled': {
        const sub = event.payload.subscription.entity
        const userDoc = await findUserBySubscription(db, sub.id)
        if (userDoc) {
          // Keep Pro until end of current billing period
          // Razorpay provides current_end as Unix timestamp
          const currentEnd = sub.current_end
          const expiresAt = currentEnd
            ? new Date(currentEnd * 1000).toISOString()
            : new Date().toISOString()

          await userDoc.ref.update({
            isPro: true, // still Pro until period ends
            proExpiresAt: expiresAt,
            subscriptionStatus: 'cancelled',
          })
          console.log(`❌ Subscription cancelled for user ${userDoc.id}, Pro until ${expiresAt}`)
        }
        break
      }

      // ── Subscription completed / ended ─────────────────────────────
      case 'subscription.completed':
      case 'subscription.expired': {
        const sub = event.payload.subscription.entity
        const userDoc = await findUserBySubscription(db, sub.id)
        if (userDoc) {
          await userDoc.ref.update({
            isPro: false,
            proExpiresAt: new Date().toISOString(),
            subscriptionStatus: event.event.split('.')[1], // 'completed' or 'expired'
          })
          console.log(`🔴 Pro revoked for user ${userDoc.id}`)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
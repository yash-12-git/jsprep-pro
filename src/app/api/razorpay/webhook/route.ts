import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// This route verifies Razorpay payment signatures server-side
// Configure this URL in your Razorpay Dashboard > Webhooks

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''
    const secret = process.env.RAZORPAY_KEY_SECRET || ''

    // Verify signature
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle payment captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const userId = payment.notes?.userId // Pass userId in payment notes

      if (userId) {
        // In a real app: update Firestore here via Admin SDK
        // import { getFirestore } from 'firebase-admin/firestore'
        // await db.collection('users').doc(userId).update({ isPro: true })
        console.log(`Pro activated for user ${userId}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}

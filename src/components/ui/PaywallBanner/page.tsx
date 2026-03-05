/** @jsxImportSource @emotion/react */
'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { activatePro } from '@/lib/userProgress'
import { Zap, X, CheckCircle } from 'lucide-react'
import * as S from './styles'

declare global { interface Window { Razorpay: any } }
interface Props { onClose?: () => void; reason?: string }

const features = ['Unlimited mastery tracking', 'Bookmarks for quick review', 'Timed quiz / flashcard mode', 'Progress analytics & charts', 'Daily streak tracking', 'All 6 AI features']

export default function PaywallBanner({ onClose, reason }: Props) {
  const { user, refreshProgress } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    if (!user) return
    setLoading(true)
    try {
      await new Promise<void>((resolve) => {
        if (window.Razorpay) return resolve()
        const s = document.createElement('script')
        s.src = 'https://checkout.razorpay.com/v1/checkout.js'
        s.onload = () => resolve()
        document.body.appendChild(s)
      })
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(process.env.NEXT_PUBLIC_PRO_PRICE_PAISE || 19900),
        currency: 'INR', name: 'JSPrep Pro', description: 'Monthly Pro Subscription',
        prefill: { email: user.email || '', name: user.displayName || '' },
        theme: { color: '#7c6af7' },
        handler: async (response: any) => {
          await activatePro(user.uid, response.razorpay_payment_id)
          await refreshProgress(); onClose?.()
        },
      })
      rzp.open()
    } catch (err) { console.error('Payment error:', err) }
    finally { setLoading(false) }
  }

  return (
    <div css={S.overlay}>
      <div css={S.modal}>
        {onClose && <button css={S.closeBtn} onClick={onClose}><X size={18} /></button>}
        <div css={S.iconBox}><Zap size={22} color="#7c6af7" /></div>
        <h2 css={S.title}>Unlock Pro Features</h2>
        {reason && <p css={S.reasonText}>{reason}</p>}
        <p css={S.desc}>Upgrade to Pro for unlimited question tracking, bookmarks, quiz mode, analytics, AI tools and daily streaks.</p>
        <ul css={S.featureList}>
          {features.map(f => (
            <li key={f} css={S.featureItem}>
              <CheckCircle size={14} color="#6af7c0" style={{ flexShrink: 0 }} /> {f}
            </li>
          ))}
        </ul>
        <button css={S.upgradeBtn} onClick={handleUpgrade} disabled={loading}>
          {loading ? 'Loading...' : <><Zap size={16} /> Upgrade for ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 199}/mo</>}
        </button>
        <p css={S.legal}>Secure payment via Razorpay · Cancel anytime</p>
      </div>
    </div>
  )
}
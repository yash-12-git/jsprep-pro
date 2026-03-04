'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { activatePro } from '@/lib/userProgress'
import { Zap, X } from 'lucide-react'
import { proFeatures } from '@/data/proBenefits'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface Props {
  onClose?: () => void
  reason?: string
}

export default function PaywallBanner({ onClose, reason }: Props) {
  const { user, refreshProgress } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    if (!user) return
    setLoading(true)

    try {
      // Load Razorpay script dynamically
      await new Promise<void>((resolve) => {
        if (window.Razorpay) return resolve()
        const s = document.createElement('script')
        s.src = 'https://checkout.razorpay.com/v1/checkout.js'
        s.onload = () => resolve()
        document.body.appendChild(s)
      })

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(process.env.NEXT_PUBLIC_PRO_PRICE_PAISE || 9900),
        currency: 'INR',
        name: 'JSPrep Pro',
        description: 'Monthly Pro Subscription',
        prefill: {
          email: user.email || '',
          name: user.displayName || '',
        },
        theme: { color: '#7c6af7' },
        handler: async (response: any) => {
          // In production: verify payment on your backend
          // For now, activate pro directly after payment
          await activatePro(user.uid, response.razorpay_payment_id)
          await refreshProgress()
          onClose?.()
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border-2 border-accent/50 rounded-2xl p-8 max-w-md w-full relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white">
            <X size={18} />
          </button>
        )}

        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-5">
          <Zap size={22} className="text-accent" />
        </div>

        <h2 className="text-2xl font-black mb-2">Unlock Pro Features</h2>
        {reason && <p className="text-accent3 text-sm mb-3 font-semibold">{reason}</p>}
        <p className="text-muted text-sm mb-6 leading-relaxed">
          Upgrade to Pro for unlimited question tracking, bookmarks, quiz mode, analytics, and daily streaks.
        </p>

        <ul className="space-y-2 mb-7">
          {proFeatures.map(f => (
            <li key={f} className="flex items-center gap-2 text-sm text-white">
              <span className="text-accent3">✓</span> {f}
            </li>
          ))}
        </ul>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Loading...' : (
            <>
              <Zap size={16} />
              Upgrade for ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 99}/mo
            </>
          )}
        </button>
        <p className="text-muted text-xs text-center mt-3">Secure payment via Razorpay · Cancel anytime</p>
      </div>
    </div>
  )
}

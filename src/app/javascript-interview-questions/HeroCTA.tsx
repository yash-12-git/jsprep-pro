'use client'

import { useAuth } from '@/hooks/useAuth'

export default function HeroCTA() {
  const { user, loading } = useAuth()
  const href = !loading && user ? '/dashboard' : '/auth'
  const label = !loading && user ? 'Go to Practice Dashboard →' : 'Practice All Questions Free →'

  return (
    <a
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: '#7c6af7', color: 'white',
        borderRadius: '0.875rem', fontWeight: 800,
        textDecoration: 'none', fontSize: '0.9375rem',
      }}
    >
      {label}
    </a>
  )
}
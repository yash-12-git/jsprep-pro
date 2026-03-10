'use client'

/**
 * PracticeCTA — smart per-question CTA.
 *
 * Navigation logic:
 *   questionSlug provided → always go to /q/[slug] (public question page,
 *     progress tracked if logged in but not required)
 *   no slug → fallback: logged in → /dashboard, not logged in → /auth
 *
 * Never hard-walls to /auth when we have a valid question slug, because
 * /q/[slug] is a public page where anyone can see and attempt the question.
 */

import { useAuth } from '@/hooks/useAuth'

interface Props {
  label?: string
  questionSlug?: string
  style?: React.CSSProperties
}

export default function PracticeCTA({ label = 'Practice this question →', questionSlug, style }: Props) {
  const { user, loading } = useAuth()

  // If we have a slug — always go to the question page (it's public)
  // If no slug — auth-aware fallback
  const href = questionSlug
    ? `/q/${questionSlug}`
    : !loading && user ? '/dashboard' : '/auth'

  return (
    <a
      href={href}
      style={{
        fontSize: '0.75rem',
        color: '#7c6af7',
        border: '1px solid rgba(124,106,247,0.3)',
        padding: '0.25rem 0.75rem',
        borderRadius: '0.375rem',
        textDecoration: 'none',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        ...style,
      }}
    >
      {label}
    </a>
  )
}
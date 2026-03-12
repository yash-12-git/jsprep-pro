'use client'
/**
 * SEOHeroCTA — auth-aware CTA button for SEO pages.
 * Replaces the 3 duplicate HeroCTA.tsx files across:
 *   /javascript-interview-questions, /javascript-output-questions, /javascript-tricky-questions
 *
 * Props:
 *   loggedInHref / loggedInLabel  — destination and text when user is signed in
 *   loggedOutHref / loggedOutLabel — destination and text when user is not signed in
 *   bg / color                    — button background and text colour
 *   style                         — any additional overrides
 */

import { useAuth } from '@/hooks/useAuth'

interface Props {
  loggedInHref?:    string
  loggedInLabel?:   string
  loggedOutHref?:   string
  loggedOutLabel?:  string
  bg?:              string
  color?:           string
  style?:           React.CSSProperties
}

export default function SEOHeroCTA({
  loggedInHref   = '/dashboard',
  loggedInLabel  = 'Go to Practice Dashboard →',
  loggedOutHref  = '/auth',
  loggedOutLabel = 'Practice Free →',
  bg             = '#7c6af7',
  color          = 'white',
  style,
}: Props) {
  const { user, loading } = useAuth()
  const resolved = !loading && user
  const href  = resolved ? loggedInHref  : loggedOutHref
  const label = resolved ? loggedInLabel : loggedOutLabel

  return (
    <a
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1.75rem',
        background: bg, color,
        borderRadius: '0.875rem', fontWeight: 800,
        textDecoration: 'none', fontSize: '0.9375rem',
        ...style,
      }}
    >
      {label}
    </a>
  )
}
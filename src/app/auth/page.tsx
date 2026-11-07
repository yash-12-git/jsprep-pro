/** @jsxImportSource @emotion/react */
'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Chrome } from 'lucide-react'
import Link from 'next/link'
import * as S from './styles'

export default function AuthPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (loading || !user) return
    // Only follow same-site paths, so this can't redirect to another website.
    const next = new URLSearchParams(window.location.search).get('next')
    router.push(next && /^\/(?!\/)/.test(next) ? next : '/dashboard')
  }, [user, loading, router])

  return (
    <main css={S.page}>
      <div css={S.glow} />
      <div css={S.container}>
        <div css={S.box}>
          <div css={S.logo}>JS</div>
          <h1 css={S.title}>Welcome to JSPrep Pro</h1>
          <p css={S.subtitle}>Sign in to track your progress, save bookmarks, and access quiz mode.</p>
          <button css={S.googleBtn} onClick={signInWithGoogle}>
            <Chrome size={18} /> Continue with Google
          </button>
          <p css={S.legal}>By signing in, you agree to our <Link href="/terms" style={{ textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="/privacy" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>.</p>
        </div>
      </div>
    </main>
  )
}
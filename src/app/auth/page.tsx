/** @jsxImportSource @emotion/react */
'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Chrome } from 'lucide-react'
import * as S from './styles'

export default function AuthPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && user) router.push('/dashboard') }, [user, loading, router])

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
          <p css={S.legal}>By signing in, you agree to our Terms of Service. Your progress is saved securely to your account.</p>
        </div>
      </div>
    </main>
  )
}
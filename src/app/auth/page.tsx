'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Chrome } from 'lucide-react'

export default function AuthPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl top-0 left-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-lg font-black mx-auto mb-6">JS</div>
          <h1 className="text-2xl font-black mb-2">Welcome to JSPrep Pro</h1>
          <p className="text-muted text-sm mb-8">Sign in to track your progress, save bookmarks, and access quiz mode.</p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <p className="text-muted text-xs mt-6">
            By signing in, you agree to our Terms of Service. Your progress is saved securely to your account.
          </p>
        </div>
      </div>
    </main>
  )
}

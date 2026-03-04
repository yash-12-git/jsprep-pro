'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Zap, BookOpen, Brain, BarChart2, Flame, Star, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])

  const features = [
    { icon: BookOpen, title: '21 Curated Questions', desc: 'Handpicked for 1–3 year frontend devs. Not too easy, not senior-level.' },
    { icon: Brain, title: 'Flashcard Quiz Mode', desc: 'Test yourself with timed quizzes. See your score history evolve over time.', pro: true },
    { icon: BarChart2, title: 'Progress Analytics', desc: 'Visual breakdown by category, mastery rate, and improvement streaks.', pro: true },
    { icon: Flame, title: 'Daily Streaks', desc: 'Build a study habit with streak tracking. Stay consistent before interviews.', pro: true },
    { icon: Star, title: 'Bookmarks', desc: 'Save tricky questions for quick review before your interview day.', pro: true },
    { icon: Zap, title: 'Unlimited Tracking', desc: 'Free users can mark 5 questions. Pro users track all with cloud sync.', pro: true },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background glows */}
      <div className="fixed w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl top-[-100px] left-[-100px] pointer-events-none" />
      <div className="fixed w-[400px] h-[400px] rounded-full bg-accent3/5 blur-3xl bottom-0 right-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-20 relative z-10">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
            <Zap size={12} />
            For 1–3 Year Frontend Developers
          </div>
          <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6">
            Land Your Next<br />
            <span className="text-accent">JavaScript</span> Role
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto mb-10">
            Curated JS interview questions with detailed explanations, progress tracking, quiz mode, and analytics. Built by devs, for devs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth" className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all hover:scale-105">
              Start for Free
              <ArrowRight size={18} />
            </Link>
            <div className="text-muted text-sm">No credit card required · Free forever tier</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-20">
          {[['21', 'Questions'], ['10', 'Categories'], ['₹199/mo', 'Pro Plan']].map(([n, l]) => (
            <div key={l} className="text-center bg-surface border border-border rounded-2xl p-6">
              <div className="text-3xl font-black text-accent2 mb-1">{n}</div>
              <div className="text-muted text-sm uppercase tracking-widest font-semibold">{l}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-center mb-12">Everything you need to prep smart</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, pro }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{title}</h3>
                      {pro && <span className="text-[9px] bg-accent2/15 text-accent2 px-1.5 py-0.5 rounded font-bold">PRO</span>}
                    </div>
                  </div>
                </div>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20" id="pricing">
          <h2 className="text-3xl font-black text-center mb-12">Simple, transparent pricing</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="text-xl font-black mb-1">Free</div>
              <div className="text-4xl font-black text-white mb-6">₹0 <span className="text-muted text-base font-normal">forever</span></div>
              <ul className="space-y-3 mb-8">
                {['All 21 questions viewable', 'Track up to 5 mastered', 'Google sign-in', 'Basic progress'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircle size={14} className="text-accent3 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth" className="block text-center border border-border rounded-xl py-2.5 text-sm font-bold hover:border-accent/50 transition-colors">
                Get Started
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-card border-2 border-accent rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-accent text-white text-xs font-black px-2 py-1 rounded-lg">POPULAR</div>
              <div className="text-xl font-black mb-1 text-accent">Pro</div>
              <div className="text-4xl font-black text-white mb-6">₹199 <span className="text-muted text-base font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'Unlimited mastery tracking', 'Bookmarks', 'Quiz / Flashcard mode', 'Progress analytics', 'Daily streak tracking', 'All future content'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <CheckCircle size={14} className="text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth" className="block text-center bg-accent hover:bg-accent/90 text-white rounded-xl py-2.5 text-sm font-bold transition-colors">
                Start with Pro
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-muted text-sm">
          © 2026 JSPrep Pro · Built for frontend developers
        </div>
      </div>
    </main>
  )
}

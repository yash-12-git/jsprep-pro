'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { questions, CATEGORIES } from '@/data/questions'
import { outputQuestions } from '@/data/outputQuestions'
import { debugQuestions } from '@/data/debugQuestions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { Flame, Trophy, Target, BookMarked, Code2, Bug, Brain } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default function AnalyticsPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])

  if (loading || !user || !progress) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!progress.isPro) return (
    <>
      <Navbar />
      <PaywallBanner reason="Analytics is a Pro feature. Upgrade to see your full progress breakdown!" />
    </>
  )

  // Theory questions
  const masteredCount = progress.masteredIds.length
  const masterPct = Math.round((masteredCount / questions.length) * 100)

  // Output quiz
  const solvedOutputCount = (progress.solvedOutputIds || []).length
  const outputPct = Math.round((solvedOutputCount / outputQuestions.length) * 100)

  // Debug lab
  const solvedDebugCount = (progress.solvedDebugIds || []).length
  const debugPct = Math.round((solvedDebugCount / debugQuestions.length) * 100)

  // Overall score across all modes
  const totalQuestions = questions.length + outputQuestions.length + debugQuestions.length
  const totalSolved = masteredCount + solvedOutputCount + solvedDebugCount
  const overallPct = Math.round((totalSolved / totalQuestions) * 100)

  // Per-category theory breakdown
  const catStats = CATEGORIES.map(cat => {
    const catQs = questions.filter(q => q.cat === cat)
    const mastered = catQs.filter(q => progress.masteredIds.includes(q.id)).length
    return { cat, total: catQs.length, mastered, pct: Math.round((mastered / catQs.length) * 100) }
  })

  // Output by category
  const outputCatStats = ['Event Loop & Promises', 'Closures & Scope', "'this' Binding", 'Hoisting', 'Type Coercion'].map(cat => {
    const catQs = outputQuestions.filter(q => q.cat === cat)
    const solved = catQs.filter(q => (progress.solvedOutputIds || []).includes(q.id)).length
    return { cat, total: catQs.length, solved, pct: Math.round((solved / catQs.length) * 100) }
  })

  // Debug by category
  const debugCatStats = ['Async Bugs', 'Closure Traps', 'Event Loop Traps', 'Fix the Code', "What's Wrong?"].map(cat => {
    const catQs = debugQuestions.filter(q => q.cat === cat)
    const solved = catQs.filter(q => (progress.solvedDebugIds || []).includes(q.id)).length
    return { cat, total: catQs.length, solved, pct: Math.round((solved / catQs.length) * 100) }
  })

  // Quiz history
  const quizHistory = (progress.quizScores || []).slice(-10).reverse()
  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((s, q) => s + Math.round((q.score / q.total) * 100), 0) / quizHistory.length)
    : 0

  const statCards = [
    { label: 'Day Streak', value: progress.streakDays, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Theory', value: `${masteredCount}/${questions.length}`, icon: Brain, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Output Quiz', value: `${solvedOutputCount}/${outputQuestions.length}`, icon: Code2, color: 'text-accent2', bg: 'bg-accent2/10' },
    { label: 'Debug Lab', value: `${solvedDebugCount}/${debugQuestions.length}`, icon: Bug, color: 'text-danger', bg: 'bg-danger/10' },
  ]

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-8">Your Analytics</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-5">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <div className={`text-2xl font-black ${color} mb-1`}>{value}</div>
              <div className="text-muted text-xs font-semibold uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* Overall progress across all modes */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-black">Overall Progress</h2>
              <p className="text-xs text-muted mt-0.5">Across all 3 modes · {totalSolved}/{totalQuestions} questions</p>
            </div>
            <span className="text-accent font-black text-2xl">{overallPct}%</span>
          </div>
          <div className="h-3 bg-surface rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-accent via-accent2 to-accent3 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
          </div>
          {/* 3 mode bars */}
          <div className="flex flex-col gap-3">
            {[
              { label: '📖 Theory Questions', pct: masterPct, solved: masteredCount, total: questions.length, color: '#7c6af7' },
              { label: '💻 Output Quiz', pct: outputPct, solved: solvedOutputCount, total: outputQuestions.length, color: '#f7c76a' },
              { label: '🐛 Debug Lab', pct: debugPct, solved: solvedDebugCount, total: debugQuestions.length, color: '#f76a6a' },
            ].map(({ label, pct, solved, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-semibold">{label}</span>
                  <span className="text-muted">{solved}/{total} · {pct}%</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theory category breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-black mb-1">📖 Theory — Category Breakdown</h2>
          <p className="text-xs text-muted mb-5">Which JS concepts you've mastered</p>
          <div className="flex flex-col gap-4">
            {catStats.map(({ cat, total, mastered, pct }) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{cat}</span>
                  <span className="text-muted">{mastered}/{total}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: pct >= 80 ? '#6af7c0' : pct >= 50 ? '#7c6af7' : '#f7c76a' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output quiz breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-black mb-1">💻 Output Quiz — Category Breakdown</h2>
          <p className="text-xs text-muted mb-5">Where you predict code output correctly</p>
          <div className="flex flex-col gap-4">
            {outputCatStats.map(({ cat, total, solved, pct }) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{cat}</span>
                  <span className="text-muted">{solved}/{total}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: pct >= 80 ? '#6af7c0' : pct >= 50 ? '#f7c76a' : '#f76a6a' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Debug lab breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-black mb-1">🐛 Debug Lab — Category Breakdown</h2>
          <p className="text-xs text-muted mb-5">Which bug types you can spot and fix</p>
          <div className="flex flex-col gap-4">
            {debugCatStats.map(({ cat, total, solved, pct }) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{cat}</span>
                  <span className="text-muted">{solved}/{total}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: pct >= 80 ? '#6af7c0' : pct >= 50 ? '#f7c76a' : '#f76a6a' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz history */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black">🎯 Timed Quiz History</h2>
            {avgScore > 0 && <span className="text-sm font-bold text-accent3">Avg: {avgScore}%</span>}
          </div>
          {quizHistory.length > 0 ? (
            <div className="flex flex-col gap-3">
              {quizHistory.map((q, i) => {
                const pct = Math.round((q.score / q.total) * 100)
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-muted text-xs w-24 flex-shrink-0">{format(parseISO(q.date), 'MMM d, HH:mm')}</span>
                    <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 80 ? '#6af7c0' : pct >= 50 ? '#7c6af7' : '#f76a6a' }} />
                    </div>
                    <span className="text-xs font-bold w-10 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-muted py-8">
              No quiz history yet. <a href="/quiz" className="text-accent underline">Take a timed quiz</a> to see scores here.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
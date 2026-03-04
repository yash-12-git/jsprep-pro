'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { questions, CATEGORIES } from '@/data/questions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { Flame, Trophy, Target, BookMarked } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default function AnalyticsPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  if (loading || !user || !progress) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (!progress.isPro) {
    return (
      <>
        <Navbar />
        <PaywallBanner reason="Analytics is a Pro feature. Upgrade to see your progress breakdown, quiz scores, and streaks!" />
      </>
    )
  }

  const masteredCount = progress.masteredIds.length
  const totalQ = questions.length
  const masterPct = Math.round((masteredCount / totalQ) * 100)

  // Per-category breakdown
  const catStats = CATEGORIES.map(cat => {
    const catQs = questions.filter(q => q.cat === cat)
    const mastered = catQs.filter(q => progress.masteredIds.includes(q.id)).length
    return { cat, total: catQs.length, mastered, pct: Math.round((mastered / catQs.length) * 100) }
  })

  // Quiz history
  const quizHistory = (progress.quizScores || []).slice(-10).reverse()
  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((s, q) => s + Math.round((q.score / q.total) * 100), 0) / quizHistory.length)
    : 0

  const statCards = [
    { label: 'Day Streak', value: progress.streakDays, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Mastered', value: `${masteredCount}/${totalQ}`, icon: Trophy, color: 'text-accent2', bg: 'bg-accent2/10' },
    { label: 'Avg Quiz Score', value: `${avgScore}%`, icon: Target, color: 'text-accent3', bg: 'bg-accent3/10' },
    { label: 'Bookmarks', value: progress.bookmarkedIds.length, icon: BookMarked, color: 'text-accent', bg: 'bg-accent/10' },
  ]

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-8">Your Analytics</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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

        {/* Overall progress */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black">Overall Mastery</h2>
            <span className="text-accent font-black text-xl">{masterPct}%</span>
          </div>
          <div className="h-3 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-accent3 rounded-full transition-all" style={{ width: `${masterPct}%` }} />
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-black mb-5">Category Breakdown</h2>
          <div className="flex flex-col gap-4">
            {catStats.map(({ cat, total, mastered, pct }) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{cat}</span>
                  <span className="text-muted">{mastered}/{total}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 80 ? '#6af7c0' : pct >= 50 ? '#7c6af7' : '#f7c76a'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz history */}
        {quizHistory.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-black mb-5">Recent Quiz Scores</h2>
            <div className="flex flex-col gap-3">
              {quizHistory.map((q, i) => {
                const pct = Math.round((q.score / q.total) * 100)
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-muted text-xs w-24 flex-shrink-0">
                      {format(parseISO(q.date), 'MMM d, HH:mm')}
                    </span>
                    <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 80 ? '#6af7a0' : pct >= 50 ? '#7c6af7' : '#f76a6a'
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold w-10 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {quizHistory.length === 0 && (
          <div className="text-center text-muted py-10 bg-card border border-border rounded-2xl">
            No quiz history yet. <a href="/quiz" className="text-accent underline">Take a quiz</a> to see your scores here!
          </div>
        )}
      </div>
    </>
  )
}

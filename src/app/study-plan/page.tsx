'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { questions, CATEGORIES } from '@/data/questions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { Loader2, ChevronLeft, RefreshCw, Target, Zap, AlertTriangle, CheckCircle, Calendar } from 'lucide-react'

interface StudyPlan {
  readinessScore: number
  readinessLabel: string
  summary: string
  weakSpots: { category: string; reason: string; tip: string }[]
  dailyPlan: { day: number; focus: string; tasks: string[]; timeMinutes: number }[]
  quickWins: string[]
  focusQuestions: number[]
}

export default function StudyPlanPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [generating, setGenerating] = useState(false)
  const [interviewDate, setInterviewDate] = useState('')

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])

  if (loading || !user || !progress) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!progress.isPro) return (
    <>
      <Navbar />
      <PaywallBanner reason="AI Study Plan is a Pro feature. Upgrade to get a personalized roadmap!" />
    </>
  )

  // Compute weak/strong categories
  const catStats = CATEGORIES.map(cat => {
    const catQs = questions.filter(q => q.cat === cat)
    const mastered = catQs.filter(q => progress.masteredIds.includes(q.id)).length
    return { cat, pct: Math.round((mastered / catQs.length) * 100) }
  })
  const weakCategories = catStats.filter(c => c.pct < 50).map(c => c.cat)
  const strongCategories = catStats.filter(c => c.pct >= 70).map(c => c.cat)

  async function generatePlan() {
    setGenerating(true)
    setPlan(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'studyplan',
          messages: [{ role: 'user', content: 'Generate my study plan.' }],
          context: {
            masteredIds: progress?.masteredIds,
            quizScores: progress?.quizScores,
            weakCategories,
            strongCategories,
            interviewDate: interviewDate || null,
            streakDays: progress?.streakDays,
          }
        })
      })
      const data = await res.json()
      const cleaned = data.text.replace(/```json|```/g, '').trim()
      setPlan(JSON.parse(cleaned))
    } catch (e) {
      console.error(e)
      alert('Failed to generate plan. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  const readinessColor = (score: number) =>
    score >= 80 ? 'text-accent3' : score >= 60 ? 'text-accent2' : score >= 40 ? 'text-orange-400' : 'text-danger'

  const focusQs = plan?.focusQuestions?.map(id => questions.find(q => q.id === id)).filter(Boolean) || []

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1 text-muted text-sm hover:text-white mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to Questions
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">🧠 AI Study Plan</h1>
          <p className="text-muted text-sm">Personalized based on your mastery, quiz history, and weak areas.</p>
        </div>

        {/* Setup card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <p className="text-sm font-bold mb-4">When is your interview? <span className="text-muted font-normal">(optional)</span></p>
          <input
            type="date"
            value={interviewDate}
            onChange={e => setInterviewDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 mb-4 w-full"
          />

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <div className="text-xl font-black text-accent">{progress.masteredIds.length}</div>
              <div className="text-[10px] text-muted uppercase tracking-wide">Mastered</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <div className="text-xl font-black text-danger">{weakCategories.length}</div>
              <div className="text-[10px] text-muted uppercase tracking-wide">Weak Areas</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <div className="text-xl font-black text-accent3">{progress.streakDays}d</div>
              <div className="text-[10px] text-muted uppercase tracking-wide">Streak</div>
            </div>
          </div>

          <button onClick={generatePlan} disabled={generating}
            className="w-full flex items-center justify-center gap-2 bg-accent2/20 hover:bg-accent2/30 border border-accent2/30 text-accent2 font-black py-3 rounded-xl transition-all disabled:opacity-50">
            {generating
              ? <><Loader2 size={16} className="animate-spin" /> Analyzing your data...</>
              : plan
                ? <><RefreshCw size={16} /> Regenerate Plan</>
                : <><Zap size={16} /> Generate My Study Plan</>
            }
          </button>
        </div>

        {/* Generated Plan */}
        {plan && (
          <div className="flex flex-col gap-5">
            {/* Readiness Score */}
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className={`text-6xl font-black mb-1 ${readinessColor(plan.readinessScore)}`}>
                {plan.readinessScore}%
              </div>
              <div className="text-lg font-bold text-white mb-2">{plan.readinessLabel}</div>
              <p className="text-sm text-muted leading-relaxed">{plan.summary}</p>
            </div>

            {/* Weak Spots */}
            {plan.weakSpots.length > 0 && (
              <div className="bg-card border border-danger/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-danger" />
                  <h2 className="font-black text-danger">Weak Spots Detected</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {plan.weakSpots.map((ws, i) => (
                    <div key={i} className="border-l-2 border-danger/40 pl-4">
                      <p className="text-sm font-bold text-white mb-1">{ws.category}</p>
                      <p className="text-xs text-muted mb-1">{ws.reason}</p>
                      <p className="text-xs text-accent3">💡 {ws.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Wins */}
            <div className="bg-card border border-accent3/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-accent3" />
                <h2 className="font-black text-accent3">Quick Wins</h2>
              </div>
              <ul className="flex flex-col gap-2">
                {plan.quickWins.map((win, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#c8c8d8]">
                    <CheckCircle size={14} className="text-accent3 flex-shrink-0 mt-0.5" />
                    {win}
                  </li>
                ))}
              </ul>
            </div>

            {/* Focus Questions */}
            {focusQs.length > 0 && (
              <div className="bg-card border border-accent/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={16} className="text-accent" />
                  <h2 className="font-black text-accent">Focus On These Questions</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {focusQs.map(q => q && (
                    <button key={q.id} onClick={() => router.push('/dashboard')}
                      className="text-left p-3 bg-surface border border-border rounded-xl hover:border-accent/40 transition-colors">
                      <span className="text-[10px] font-mono text-accent mr-2">Q{String(q.id + 1).padStart(2, '0')}</span>
                      <span className="text-xs text-white">{q.q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Plan */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-accent2" />
                <h2 className="font-black text-accent2">Daily Study Plan</h2>
              </div>
              <div className="flex flex-col gap-4">
                {plan.dailyPlan.map(day => (
                  <div key={day.day} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-accent2/10 border border-accent2/20 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[9px] text-muted uppercase">Day</span>
                      <span className="text-sm font-black text-accent2">{day.day}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-white">{day.focus}</p>
                        <span className="text-[10px] text-muted">{day.timeMinutes} min</span>
                      </div>
                      <ul className="flex flex-col gap-1">
                        {day.tasks.map((task, i) => (
                          <li key={i} className="text-xs text-muted flex gap-1.5">
                            <span className="text-accent2">·</span>{task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

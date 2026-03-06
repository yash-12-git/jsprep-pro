/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions, useUserProgress } from '@/hooks/useQuestions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { Loader2, ChevronLeft, RefreshCw, Target, Zap, AlertTriangle, CheckCircle, Calendar } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import type { Question } from '@/types/question'

interface StudyPlan {
  readinessScore: number; readinessLabel: string; summary: string
  weakSpots: { category: string; reason: string; tip: string }[]
  dailyPlan: { day: number; focus: string; tasks: string[]; timeMinutes: number }[]
  quickWins: string[]; focusQuestions: string[]  // string IDs (Firestore)
}

export default function StudyPlanPage() {
  const { user, progress, loading: authLoading } = useAuth()
  const router = useRouter()

  const { questions } = useQuestions({ type:'theory', track:'javascript', enabled:!!user })
  const { masteredIds, progressMap } = useUserProgress({ uid: user?.uid ?? null })

  const [plan, setPlan]               = useState<StudyPlan | null>(null)
  const [generating, setGenerating]   = useState(false)
  const [interviewDate, setInterviewDate] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth')
  }, [user, authLoading, router])

  if (authLoading || !user || !progress) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )
  if (!progress.isPro) return (
    <><Navbar /><PaywallBanner reason="AI Study Plan is a Pro feature. Upgrade to get a personalized roadmap!" /></>
  )

  // Compute category stats from Firestore progress
  const allCats = [...new Set(questions.map(q => q.category))]
  const catStats = allCats.map(cat => {
    const qs = questions.filter(q => q.category === cat)
    const m  = qs.filter(q => masteredIds.includes(q.id)).length
    return { cat, total: qs.length, mastered: m, pct: qs.length > 0 ? Math.round((m / qs.length) * 100) : 0 }
  })
  const weakCategories   = catStats.filter(c => c.pct < 50).map(c => c.cat)
  const strongCategories = catStats.filter(c => c.pct >= 70).map(c => c.cat)

  async function generatePlan() {
    setGenerating(true); setPlan(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'studyplan',
          messages: [{ role: 'user', content: 'Generate my study plan.' }],
          context: {
            masteredCount: masteredIds.length,
            totalQuestions: questions.length,
            weakCategories,
            strongCategories,
            catStats,
            interviewDate: interviewDate || null,
            streakDays: progress?.streakDays,
          },
        }),
      })
      const data = await res.json()
      setPlan(JSON.parse(data.text.replace(/```json|```/g, '').trim()))
    } catch { alert('Failed to generate plan. Try again.') }
    finally { setGenerating(false) }
  }

  const readColor = (s: number) => s >= 80 ? C.accent3 : s >= 60 ? C.accent2 : s >= 40 ? C.orange : C.danger

  // Focus questions: find by Firestore ID
  const focusQs: Question[] = (plan?.focusQuestions ?? [])
    .map(id => questions.find(q => q.id === id))
    .filter((q): q is Question => !!q)

  return (
    <>
      <Navbar />
      <div css={Shared.pageWrapper}>
        <button
          css={{ display:'flex', alignItems:'center', gap:'0.25rem', color:C.muted, fontSize:'0.875rem', background:'none', border:'none', cursor:'pointer', marginBottom:'1.5rem' }}
          onClick={() => router.push('/dashboard')}>
          <ChevronLeft size={16} /> Back to Questions
        </button>

        <div css={S.header}>
          <h1 css={S.title}>🧠 AI Study Plan</h1>
          <p css={S.subtitle}>Personalized based on your mastery, quiz history, and weak areas.</p>
        </div>

        <div css={S.inputCard}>
          <p css={[S.inputLabel, { marginBottom:'0.5rem' }]}>
            When is your interview?{' '}
            <span css={{ textTransform:'none', letterSpacing:0, color:C.muted, fontWeight:400 }}>(optional)</span>
          </p>
          <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} css={S.dateInput} />

          <div css={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', margin:'1.25rem 0' }}>
            {[
              { v: masteredIds.length,   l: 'Mastered',  c: C.accent  },
              { v: weakCategories.length, l: 'Weak Areas', c: C.danger  },
              { v: `${progress.streakDays}d`, l: 'Streak', c: C.accent3 },
            ].map(({ v, l, c }) => (
              <div key={l} css={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'0.75rem', padding:'0.75rem', textAlign:'center' }}>
                <div css={{ fontSize:'1.25rem', fontWeight:900, color:c }}>{v}</div>
                <div css={{ fontSize:'0.625rem', color:C.muted, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
              </div>
            ))}
          </div>

          <button css={Shared.primaryBtn(C.accent2)} onClick={generatePlan} disabled={generating}>
            {generating
              ? <><Loader2 size={15} css={{ animation:'spin 1s linear infinite' }} /> Analyzing...</>
              : plan
                ? <><RefreshCw size={15} /> Regenerate Plan</>
                : <><Zap size={15} /> Generate My Study Plan</>}
          </button>
        </div>

        {plan && (
          <div css={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div css={[S.section, { textAlign:'center' }]}>
              <div css={{ fontSize:'3.5rem', fontWeight:900, color:readColor(plan.readinessScore), marginBottom:'0.25rem' }}>
                {plan.readinessScore}%
              </div>
              <div css={{ fontSize:'1.125rem', fontWeight:700, marginBottom:'0.75rem' }}>{plan.readinessLabel}</div>
              <p css={{ fontSize:'0.875rem', color:C.muted, lineHeight:1.6 }}>{plan.summary}</p>
            </div>

            {plan.weakSpots.length > 0 && (
              <div css={[S.section, { borderColor:`${C.danger}33` }]}>
                <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                  <AlertTriangle size={15} color={C.danger} />
                  <h2 css={[S.sectionTitle, { color:C.danger, margin:0 }]}>Weak Spots Detected</h2>
                </div>
                {plan.weakSpots.map((ws, i) => (
                  <div key={i} css={{ borderLeft:`2px solid ${C.danger}66`, paddingLeft:'1rem', marginBottom:'1rem' }}>
                    <p css={{ fontSize:'0.875rem', fontWeight:700, marginBottom:'0.25rem' }}>{ws.category}</p>
                    <p css={{ fontSize:'0.75rem', color:C.muted, marginBottom:'0.25rem' }}>{ws.reason}</p>
                    <p css={{ fontSize:'0.75rem', color:C.accent3 }}>💡 {ws.tip}</p>
                  </div>
                ))}
              </div>
            )}

            <div css={[S.section, { borderColor:`${C.accent3}33` }]}>
              <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <Zap size={15} color={C.accent3} />
                <h2 css={[S.sectionTitle, { color:C.accent3, margin:0 }]}>Quick Wins</h2>
              </div>
              {plan.quickWins.map((win, i) => (
                <div key={i} css={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', fontSize:'0.875rem', color:C.text, marginBottom:'0.5rem' }}>
                  <CheckCircle size={14} color={C.accent3} style={{ flexShrink:0, marginTop:2 }} />{win}
                </div>
              ))}
            </div>

            {focusQs.length > 0 && (
              <div css={[S.section, { borderColor:`${C.accent}33` }]}>
                <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                  <Target size={15} color={C.accent} />
                  <h2 css={[S.sectionTitle, { color:C.accent, margin:0 }]}>Focus On These Questions</h2>
                </div>
                {focusQs.map(q => (
                  <button key={q.id} onClick={() => router.push('/dashboard')}
                    css={{ display:'block', width:'100%', textAlign:'left', padding:'0.75rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:'0.75rem', marginBottom:'0.5rem', cursor:'pointer' }}>
                    <span css={{ fontSize:'0.75rem', color:C.accent, marginRight:'0.5rem' }}>{q.category}</span>
                    <span css={{ fontSize:'0.75rem', color:'white' }}>{q.title}</span>
                  </button>
                ))}
              </div>
            )}

            <div css={S.section}>
              <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <Calendar size={15} color={C.accent2} />
                <h2 css={[S.sectionTitle, { color:C.accent2, margin:0 }]}>Daily Study Plan</h2>
              </div>
              {plan.dailyPlan.map(day => (
                <div key={day.day} css={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1rem' }}>
                  <div css={{ width:'2.5rem', height:'2.5rem', borderRadius:'0.75rem', background:`${C.accent2}1a`, border:`1px solid ${C.accent2}33`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span css={{ fontSize:'0.5rem', color:C.muted, textTransform:'uppercase' }}>Day</span>
                    <span css={{ fontSize:'0.875rem', fontWeight:900, color:C.accent2 }}>{day.day}</span>
                  </div>
                  <div css={{ flex:1 }}>
                    <div css={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                      <p css={{ fontSize:'0.875rem', fontWeight:700 }}>{day.focus}</p>
                      <span css={{ fontSize:'0.625rem', color:C.muted }}>{day.timeMinutes} min</span>
                    </div>
                    {day.tasks.map((task, i) => (
                      <div key={i} css={{ fontSize:'0.75rem', color:C.muted, marginBottom:'0.25rem', display:'flex', gap:'0.375rem' }}>
                        <span css={{ color:C.accent2 }}>·</span>{task}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
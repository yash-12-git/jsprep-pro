/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions, useCategories, useUserProgress } from '@/hooks/useQuestions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { ChevronDown, Eye, RotateCcw, Bug, Lock, Zap, CheckCircle, AlertTriangle, Loader2, XCircle } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import type { Question } from '@/types/question'

type QState = 'idle' | 'checking' | 'feedback' | 'revealed'
interface AIFeedback {
  correct: boolean; score: number; verdict: string
  whatTheyGotRight: string; remainingIssues: string
  betterApproach: string | null; hint: string; explanation: string
}
const FREE_DEBUG_LIMIT = 5

const DIFF_STYLE = {
  beginner: { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  core:     { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  advanced: { bg: `${C.accent2}1a`, color: C.accent2, border: `${C.accent2}33` },
  expert:   { bg: `${C.danger}1a`,  color: C.danger,  border: `${C.danger}33`  },
}
const DIFF_LABEL: Record<string, string> = {
  beginner: '🟢 Easy', core: '🟢 Easy', advanced: '🟡 Medium', expert: '🔴 Hard'
}

const CAT_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  'Async Bugs':       { bg: 'rgba(167,139,250,0.1)', color: '#c4b5fd', border: 'rgba(167,139,250,0.2)' },
  'Closure Traps':    { bg: 'rgba(96,165,250,0.1)',  color: '#93c5fd', border: 'rgba(96,165,250,0.2)'  },
  'Event Loop Traps': { bg: 'rgba(251,146,60,0.1)',  color: '#fdba74', border: 'rgba(251,146,60,0.2)'  },
  'Fix the Code':     { bg: `${C.accent3}1a`,        color: C.accent3, border: `${C.accent3}33`        },
  "What's Wrong?":    { bg: `${C.danger}1a`,         color: C.danger,  border: `${C.danger}33`         },
}

export default function DebugLabPage() {
  const { user, progress, loading: authLoading } = useAuth()
  const router = useRouter()

  const { questions, loading: qLoading } = useQuestions({
    type: 'debug',
    track: 'javascript',
    enabled: !!user,
  })
  const { categories } = useCategories('debug', 'javascript')
  const { isSolved, isRevealed, recordSolved, recordRevealed, solvedIds } =
    useUserProgress({ uid: user?.uid ?? null })

  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId]   = useState<string | null>(null)
  const [userCode, setUserCode]   = useState<Record<string, string>>({})
  const [states, setStates]       = useState<Record<string, QState>>({})
  const [feedback, setFeedback]   = useState<Record<string, AIFeedback>>({})
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth')
  }, [user, authLoading, router])

  if (authLoading || !user || !progress) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )

  const filtered = activeCategory === 'All'
    ? questions
    : questions.filter(q => q.category === activeCategory)

  const solvedCount = solvedIds.filter(id => questions.some(q => q.id === id)).length
  const pct = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0

  function getCode(q: Question): string {
    return userCode[q.id] !== undefined ? userCode[q.id] : (q.brokenCode || q.code || '')
  }

  function getQState(q: Question): QState {
    if (isSolved(q.id))   return 'feedback'
    if (isRevealed(q.id)) return 'revealed'
    return states[q.id] || 'idle'
  }

  async function checkWithAI(q: Question, globalIdx: number) {
    if (!progress!.isPro && globalIdx >= FREE_DEBUG_LIMIT) { setShowPaywall(true); return }
    const code = getCode(q)
    if (!code.trim() || code === (q.brokenCode || q.code)) { alert('Edit the code first!'); return }
    setStates(prev => ({ ...prev, [q.id]: 'checking' }))
    try {
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'debugcheck',
          messages: [{ role: 'user', content: code }],
          context: {
            brokenCode: q.brokenCode || q.code,
            bugDescription: q.bugDescription,
            fixedCode: q.fixedCode,
            userFix: code,
          },
        }),
      })
      const data = await res.json()
      const parsed: AIFeedback = JSON.parse(data.text.replace(/```json|```/g, '').trim())
      setFeedback(prev => ({ ...prev, [q.id]: parsed }))
      setStates(prev => ({ ...prev, [q.id]: 'feedback' }))
      if (parsed.correct) await recordSolved(q.id)
    } catch {
      setStates(prev => ({ ...prev, [q.id]: 'idle' }))
      alert('AI check failed — try again')
    }
  }

  async function reveal(q: Question) {
    await recordRevealed(q.id)
    setStates(prev => ({ ...prev, [q.id]: 'revealed' }))
  }

  function reset(q: Question) {
    setUserCode(prev => ({ ...prev, [q.id]: q.brokenCode || q.code || '' }))
    setStates(prev => ({ ...prev, [q.id]: 'idle' }))
    setFeedback(prev => { const n = { ...prev }; delete n[q.id]; return n })
  }

  return (
    <>
      <Navbar />
      {showPaywall && (
        <PaywallBanner
          reason={`Free users get ${FREE_DEBUG_LIMIT} debug challenges. Upgrade for all + AI checking!`}
          onClose={() => setShowPaywall(false)}
        />
      )}
      <div css={Shared.pageWrapper}>

        <div css={S.header}>
          <div css={S.headerTop}>
            <div css={Shared.iconBox(C.danger)}><Bug size={18} color={C.danger} /></div>
            <div>
              <h1 css={S.pageTitle}>Debug Lab</h1>
              <p css={S.pageSubtitle}>Find the bug → fix the code → AI checks your solution</p>
            </div>
          </div>
          <div css={S.progressRow}>
            <div css={Shared.progressBarTrack}>
              <div css={Shared.progressBarFill(pct, `linear-gradient(90deg, ${C.danger}, ${C.accent2})`)} />
            </div>
            <span css={S.progressCount}>{solvedCount}/{questions.length} fixed</span>
          </div>
        </div>

        <div css={Shared.categoryScroll}>
          {['All', ...categories].map(cat => (
            <button key={cat} css={Shared.categoryChip(activeCategory === cat, C.danger)}
              onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {qLoading && (
          <div css={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {[1,2,3].map(i => <div key={i} css={{ height:'5rem', borderRadius:'1rem', background:C.card }} />)}
          </div>
        )}

        {!qLoading && (
          <div css={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((q, idx) => {
              const globalIdx = questions.indexOf(q)
              const state     = getQState(q)
              const fb        = feedback[q.id]
              const isOpen    = openId === q.id
              const isSolvedQ = fb?.correct || isSolved(q.id)
              const isLocked  = !progress.isPro && globalIdx >= FREE_DEBUG_LIMIT
              const code      = getCode(q)
              const ds        = DIFF_STYLE[q.difficulty] ?? DIFF_STYLE.core
              const cs        = CAT_STYLE[q.category] ?? { bg: C.border, color: C.muted, border: C.border }

              return (
                <div key={q.id} css={S.questionCard(
                  isSolvedQ ? 'solved' : state === 'feedback' && !fb?.correct ? 'wrong' : state === 'revealed' ? 'revealed' : 'idle'
                )}>
                  <div css={S.cardHeader} onClick={() => setOpenId(isOpen ? null : q.id)}>
                    <span css={S.qNumber}>#{String(idx + 1).padStart(2, '00')}</span>
                    <div css={{ flex:1, minWidth:0 }}>
                      <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.375rem' }}>
                        <p css={{ fontWeight:700, fontSize:'0.875rem' }}>{q.title}</p>
                        {isLocked && <Lock size={12} color={C.muted} />}
                        {isSolvedQ && <CheckCircle size={14} color={C.accent3} />}
                        {state === 'feedback' && !isSolvedQ && <XCircle size={14} color={C.danger} />}
                      </div>
                      <div css={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                        <span css={{ fontSize:'0.625rem', fontWeight:700, padding:'0.125rem 0.5rem', borderRadius:'9999px', border:`1px solid ${ds.border}`, background:ds.bg, color:ds.color }}>
                          {DIFF_LABEL[q.difficulty] ?? q.difficulty}
                        </span>
                        <span css={{ fontSize:'0.625rem', fontWeight:700, padding:'0.125rem 0.5rem', borderRadius:'9999px', border:`1px solid ${cs.border}`, background:cs.bg, color:cs.color }}>
                          {q.category}
                        </span>
                      </div>
                    </div>
                    <div css={S.chevronWrapper(isOpen) as any}><ChevronDown size={16} color={C.muted} /></div>
                  </div>

                  {isOpen && (
                    <div css={S.cardBody}>
                      {q.question && (
                        <div css={S.descriptionBox}>
                          <AlertTriangle size={14} color={C.danger} style={{ flexShrink:0, marginTop:2 }} />
                          <p css={S.descriptionText}>{q.question}</p>
                        </div>
                      )}

                      {isLocked ? (
                        <div css={[S.bodyInner, { paddingTop:0 }]}>
                          <div css={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:'0.75rem' }}>
                            <Lock size={14} color={C.muted} />
                            <span css={{ fontSize:'0.875rem', color:C.muted, flex:1 }}>Pro feature — upgrade to access all debug challenges</span>
                            <button css={Shared.actionBtn(C.accent)} onClick={() => setShowPaywall(true)}>
                              <Zap size={11} /> Upgrade
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div css={S.bodyInner}>
                          <div>
                            <p css={[S.codeSectionLabel, { color: C.danger }]}>🔴 Broken Code</p>
                            <pre css={Shared.codeBlock(`${C.danger}4d`)}><code>{q.brokenCode || q.code}</code></pre>
                          </div>

                          <div>
                            <p css={S.fixLabel}>
                              ✏️ Your Fix
                              <span css={S.fixLabelNote}>— edit the broken code to fix the bug</span>
                            </p>
                            <textarea
                              value={code} spellCheck={false}
                              onChange={e => setUserCode(prev => ({ ...prev, [q.id]: e.target.value }))}
                              disabled={state === 'checking'}
                              rows={Math.max(6, code.split('\n').length + 1)}
                              css={S.codeTextarea(fb?.correct ? 'correct' : state === 'feedback' ? 'wrong' : 'idle')}
                            />
                          </div>

                          <div css={S.actionRow}>
                            <button css={Shared.primaryBtn(C.accent)}
                              onClick={() => checkWithAI(q, globalIdx)}
                              disabled={state === 'checking' || code === (q.brokenCode || q.code)}
                              style={{ flex: 1 }}>
                              {state === 'checking'
                                ? <><Loader2 size={13} css={{ animation:'spin 1s linear infinite' }} /> AI is checking...</>
                                : <><Zap size={13} /> Check with AI</>}
                            </button>
                            <button css={Shared.actionBtn(C.muted)} onClick={() => reveal(q)}>
                              <Eye size={13} /> Show Answer
                            </button>
                            {(state === 'feedback' || state === 'revealed') && (
                              <button css={Shared.ghostBtn} onClick={() => reset(q)}>
                                <RotateCcw size={13} />
                              </button>
                            )}
                          </div>

                          {state === 'feedback' && fb && (
                            <div css={S.feedbackBox(fb.correct)}>
                              <div css={S.scoreRow}>
                                <div>
                                  <span css={S.scoreNumber(fb.correct, fb.score)}>{fb.score}</span>
                                  <span css={S.scoreDenom}>/10</span>
                                </div>
                                <div css={{ flex:1 }}>
                                  <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.375rem' }}>
                                    {fb.correct ? <CheckCircle size={15} color={C.accent3} /> : <XCircle size={15} color={C.danger} />}
                                    <p css={{ fontWeight:700, fontSize:'0.875rem' }}>{fb.verdict}</p>
                                  </div>
                                  <div css={S.scoreBarTrack}>
                                    <div css={S.scoreBarFill(fb.score * 10, fb.correct ? C.accent3 : fb.score >= 5 ? C.accent2 : C.danger)} />
                                  </div>
                                </div>
                              </div>
                              <div css={S.feedbackRow(C.accent3)}>
                                <p css={S.feedbackRowTitle(C.accent3)}>✓ What you got right</p>
                                <p css={S.feedbackRowText}>{fb.whatTheyGotRight}</p>
                              </div>
                              {fb.remainingIssues !== 'None' && (
                                <div css={S.feedbackRow(C.danger)}>
                                  <p css={S.feedbackRowTitle(C.danger)}>✗ Still needs fixing</p>
                                  <p css={S.feedbackRowText}>{fb.remainingIssues}</p>
                                </div>
                              )}
                              {!fb.correct && fb.hint && (
                                <div css={S.hintBox}>
                                  <p css={{ fontSize:'0.75rem', fontWeight:700, color:C.accent2, marginBottom:'0.25rem' }}>💡 Hint</p>
                                  <p css={S.feedbackRowText}>{fb.hint}</p>
                                </div>
                              )}
                              {fb.betterApproach && (
                                <div css={S.feedbackRow(C.accent)}>
                                  <p css={S.feedbackRowTitle(C.accent)}>⚡ Better approach</p>
                                  <p css={S.feedbackRowText}>{fb.betterApproach}</p>
                                </div>
                              )}
                              <div css={S.feedbackRow(C.muted)}>
                                <p css={S.feedbackRowTitle(C.muted)}>📖 Explanation</p>
                                <p css={S.feedbackRowText}>{fb.explanation}</p>
                              </div>
                              {!fb.correct && (
                                <button css={Shared.primaryBtn(C.accent)}
                                  onClick={() => setStates(prev => ({ ...prev, [q.id]: 'idle' }))}>
                                  Try Again
                                </button>
                              )}
                            </div>
                          )}

                          {state === 'revealed' && (
                            <div css={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                              <div css={S.diffGrid}>
                                <div>
                                  <p css={S.diffLabel(C.danger)}>❌ Broken</p>
                                  <pre css={Shared.codeBlock(`${C.danger}4d`)} style={{ maxHeight:'13rem', overflow:'auto' }}>
                                    <code>{q.brokenCode || q.code}</code>
                                  </pre>
                                </div>
                                <div>
                                  <p css={S.diffLabel(C.accent3)}>✅ Fixed</p>
                                  <pre css={Shared.codeBlock(`${C.accent3}4d`)} style={{ maxHeight:'13rem', overflow:'auto' }}>
                                    <code css={{ color: C.accent3 }}>{q.fixedCode}</code>
                                  </pre>
                                </div>
                              </div>
                              <div css={S.revealCard}>
                                <p css={{ fontSize:'0.75rem', fontWeight:700, color:C.danger, marginBottom:'0.375rem' }}>🐛 The Bug</p>
                                <p css={{ fontSize:'0.75rem', color:C.text, marginBottom:'0.75rem' }}>{q.bugDescription}</p>
                                <p css={{ fontSize:'0.75rem', fontWeight:700, color:C.accent, marginBottom:'0.375rem' }}>💡 Explanation</p>
                                <p css={{ fontSize:'0.75rem', color:C.text, marginBottom:'0.75rem' }}>{q.explanation}</p>
                                <p css={{ fontSize:'0.75rem', fontWeight:700, color:C.accent2, marginBottom:'0.375rem' }}>⚡ Key Insight</p>
                                <p css={{ fontSize:'0.75rem', color:C.text }}>{q.keyInsight}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
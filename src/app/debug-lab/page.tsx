/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { debugQuestions, DEBUG_CATEGORIES } from '@/data/debugQuestions'
import { markDebugSolved, markDebugRevealed } from '@/lib/userProgress'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { ChevronDown, Eye, RotateCcw, Bug, Lock, Zap, CheckCircle, AlertTriangle, Loader2, XCircle } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'

type QState = 'idle' | 'checking' | 'feedback' | 'revealed'
interface AIFeedback {
  correct: boolean; score: number; verdict: string
  whatTheyGotRight: string; remainingIssues: string
  betterApproach: string | null; hint: string; explanation: string
}
const FREE_DEBUG_LIMIT = 5

const DIFF_STYLE = {
  easy:   { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  medium: { bg: `${C.accent2}1a`, color: C.accent2, border: `${C.accent2}33` },
  hard:   { bg: `${C.danger}1a`,  color: C.danger,  border: `${C.danger}33`  },
}
const DIFF_LABEL = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }

const CAT_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  'Async Bugs':        { bg: 'rgba(167,139,250,0.1)', color: '#c4b5fd', border: 'rgba(167,139,250,0.2)' },
  'Closure Traps':     { bg: 'rgba(96,165,250,0.1)',  color: '#93c5fd', border: 'rgba(96,165,250,0.2)'  },
  'Event Loop Traps':  { bg: 'rgba(251,146,60,0.1)',  color: '#fdba74', border: 'rgba(251,146,60,0.2)'  },
  'Fix the Code':      { bg: `${C.accent3}1a`,        color: C.accent3, border: `${C.accent3}33`        },
  "What's Wrong?":     { bg: `${C.danger}1a`,         color: C.danger,  border: `${C.danger}33`         },
}

export default function DebugLabPage() {
  const { user, progress, loading, refreshProgress } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [userCode, setUserCode] = useState<Record<number, string>>({})
  const [states, setStates] = useState<Record<number, QState>>({})
  const [feedback, setFeedback] = useState<Record<number, AIFeedback>>({})
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])
  if (loading || !user || !progress) return <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>

  const solvedIds = new Set(progress.solvedDebugIds || [])
  const revealedIds = new Set(progress.revealedDebugIds || [])
  const filtered = activeCategory === 'All' ? debugQuestions : debugQuestions.filter(q => q.cat === activeCategory)
  const solvedCount = solvedIds.size
  const pct = Math.round((solvedCount / debugQuestions.length) * 100)

  function getCode(id: number, fallback: string) {
    return userCode[id] !== undefined ? userCode[id] : fallback
  }

  async function checkWithAI(q: typeof debugQuestions[0]) {
    const code = getCode(q.id, q.brokenCode)
    if (!code.trim() || code === q.brokenCode) { alert('Edit the code first!'); return }
    setStates(prev => ({ ...prev, [q.id]: 'checking' }))
    try {
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'debugcheck', messages: [{ role: 'user', content: code }],
          context: { brokenCode: q.brokenCode, bugDescription: q.bugDescription, fixedCode: q.fixedCode, userFix: code } })
      })
      const data = await res.json()
      const parsed: AIFeedback = JSON.parse(data.text.replace(/```json|```/g, '').trim())
      setFeedback(prev => ({ ...prev, [q.id]: parsed }))
      setStates(prev => ({ ...prev, [q.id]: 'feedback' }))
      if(!user) return
      if (parsed.correct) { await markDebugSolved(user.uid, q.id); await refreshProgress() }
    } catch {
      setStates(prev => ({ ...prev, [q.id]: 'idle' }))
      alert('AI check failed — try again')
    }
  }

  async function reveal(id: number) {
    if(!user) return
    await markDebugRevealed(user.uid, id); await refreshProgress()
    setStates(prev => ({ ...prev, [id]: 'revealed' }))
  }

  function reset(id: number, fallback: string) {
    setUserCode(prev => ({ ...prev, [id]: fallback }))
    setStates(prev => ({ ...prev, [id]: 'idle' }))
    setFeedback(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  return (
    <>
      <Navbar />
      {showPaywall && (
        <PaywallBanner
          reason={`Free users get ${FREE_DEBUG_LIMIT} debug challenges. Upgrade for all ${debugQuestions.length} + AI checking!`}
          onClose={() => setShowPaywall(false)}
        />
      )}
      <div css={Shared.pageWrapper}>

        {/* Header */}
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
            <span css={S.progressCount}>{solvedCount}/{debugQuestions.length} fixed</span>
          </div>
          <div css={S.catBadgesRow}>
            {DEBUG_CATEGORIES.map(cat => {
              const cs = CAT_STYLE[cat] || { bg: `${C.border}`, color: C.muted, border: C.border }
              const count = debugQuestions.filter(q => q.cat === cat).length
              return (
                <span key={cat} css={S.catBadge(cs.bg, cs.color, cs.border)}>
                  {cat} · {count}
                </span>
              )
            })}
          </div>
        </div>

        {/* Category filter */}
        <div css={Shared.categoryScroll}>
          {['All', ...DEBUG_CATEGORIES].map(cat => (
            <button key={cat} css={Shared.categoryChip(activeCategory === cat, C.danger)} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div css={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((q, idx) => {
            const isOpen = openId === q.id
            const fb = feedback[q.id]
            const state = solvedIds.has(q.id) ? 'feedback' : revealedIds.has(q.id) ? 'revealed' : (states[q.id] || 'idle')
            const isLocked = !progress.isPro && debugQuestions.indexOf(q) >= FREE_DEBUG_LIMIT
            const code = getCode(q.id, q.brokenCode)
            const isSolved = fb?.correct || solvedIds.has(q.id)
            const ds = DIFF_STYLE[q.difficulty]
            const cs = CAT_STYLE[q.cat] || { bg: C.border, color: C.muted, border: C.border }

            return (
              <div key={q.id} css={S.questionCard(isSolved ? 'solved' : state === 'feedback' && !fb?.correct ? 'wrong' : state === 'revealed' ? 'revealed' : 'idle')}>

                {/* Card header */}
                <div css={S.cardHeader} onClick={() => setOpenId(isOpen ? null : q.id)}>
                  <span css={S.qNumber}>#{String(idx + 1).padStart(2, '0')}</span>
                  <div css={{ flex: 1, minWidth: 0 }}>
                    <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                      <p css={{ fontWeight: 700, fontSize: '0.875rem' }}>{q.title}</p>
                      {isLocked && <Lock size={12} color={C.muted} />}
                      {isSolved && <CheckCircle size={14} color={C.accent3} />}
                      {state === 'feedback' && !isSolved && <XCircle size={14} color={C.danger} />}
                    </div>
                    <div css={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${ds.border}`, background: ds.bg, color: ds.color }}>
                        {DIFF_LABEL[q.difficulty]}
                      </span>
                      <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${cs.border}`, background: cs.bg, color: cs.color }}>
                        {q.cat}
                      </span>
                    </div>
                  </div>
                  <div css={S.chevronWrapper(isOpen) as any}><ChevronDown size={16} color={C.muted} /></div>
                </div>

                {/* Card body */}
                {isOpen && (
                  <div css={S.cardBody}>
                    <div css={S.descriptionBox}>
                      <AlertTriangle size={14} color={C.danger} style={{ flexShrink: 0, marginTop: 2 }} />
                      <p css={S.descriptionText}>{q.description}</p>
                    </div>

                    {isLocked ? (
                      <div css={[S.bodyInner, { paddingTop: 0 }]}>
                        <div css={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '0.75rem' }}>
                          <Lock size={14} color={C.muted} />
                          <span css={{ fontSize: '0.875rem', color: C.muted, flex: 1 }}>Pro feature — upgrade to access all debug challenges</span>
                          <button css={Shared.actionBtn(C.accent)} onClick={() => setShowPaywall(true)}>
                            <Zap size={11} /> Upgrade
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div css={S.bodyInner}>

                        {/* Broken code */}
                        <div>
                          <p css={[S.codeSectionLabel, { color: C.danger }]}>🔴 Broken Code</p>
                          <pre css={Shared.codeBlock(`${C.danger}4d`)}><code>{q.brokenCode}</code></pre>
                        </div>

                        {/* Fix textarea */}
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

                        {/* Actions */}
                        <div css={S.actionRow}>
                          <button
                            css={Shared.primaryBtn(C.accent)}
                            onClick={() => checkWithAI(q)}
                            disabled={state === 'checking' || code === q.brokenCode}
                            style={{ flex: 1 }}
                          >
                            {state === 'checking'
                              ? <><Loader2 size={13} css={{ animation: 'spin 1s linear infinite' }} /> AI is checking...</>
                              : <><Zap size={13} /> Check with AI</>}
                          </button>
                          <button css={Shared.actionBtn(C.muted)} onClick={() => reveal(q.id)}>
                            <Eye size={13} /> Show Answer
                          </button>
                          {(state === 'feedback' || state === 'revealed') && (
                            <button css={Shared.ghostBtn} onClick={() => reset(q.id, q.brokenCode)}>
                              <RotateCcw size={13} />
                            </button>
                          )}
                        </div>

                        {/* AI Feedback */}
                        {state === 'feedback' && fb && (
                          <div css={S.feedbackBox(fb.correct)}>
                            {/* Score row */}
                            <div css={S.scoreRow}>
                              <div>
                                <span css={S.scoreNumber(fb.correct, fb.score)}>{fb.score}</span>
                                <span css={S.scoreDenom}>/10</span>
                              </div>
                              <div css={{ flex: 1 }}>
                                <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                  {fb.correct
                                    ? <CheckCircle size={15} color={C.accent3} />
                                    : <XCircle size={15} color={C.danger} />}
                                  <p css={{ fontWeight: 700, fontSize: '0.875rem' }}>{fb.verdict}</p>
                                </div>
                                <div css={S.scoreBarTrack}>
                                  <div css={S.scoreBarFill(fb.score * 10, fb.correct ? C.accent3 : fb.score >= 5 ? C.accent2 : C.danger)} />
                                </div>
                              </div>
                            </div>

                            {/* What they got right */}
                            <div css={S.feedbackRow(C.accent3)}>
                              <p css={S.feedbackRowTitle(C.accent3)}>✓ What you got right</p>
                              <p css={S.feedbackRowText}>{fb.whatTheyGotRight}</p>
                            </div>

                            {/* Remaining issues */}
                            {fb.remainingIssues !== 'None' && (
                              <div css={S.feedbackRow(C.danger)}>
                                <p css={S.feedbackRowTitle(C.danger)}>✗ Still needs fixing</p>
                                <p css={S.feedbackRowText}>{fb.remainingIssues}</p>
                              </div>
                            )}

                            {/* Hint */}
                            {!fb.correct && fb.hint && (
                              <div css={S.hintBox}>
                                <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent2, marginBottom: '0.25rem' }}>💡 Hint</p>
                                <p css={S.feedbackRowText}>{fb.hint}</p>
                              </div>
                            )}

                            {/* Better approach */}
                            {fb.betterApproach && (
                              <div css={S.feedbackRow(C.accent)}>
                                <p css={S.feedbackRowTitle(C.accent)}>⚡ Better approach</p>
                                <p css={S.feedbackRowText}>{fb.betterApproach}</p>
                              </div>
                            )}

                            {/* Explanation */}
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

                        {/* Revealed answer */}
                        {state === 'revealed' && (
                          <div css={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div css={S.diffGrid}>
                              <div>
                                <p css={S.diffLabel(C.danger)}>❌ Broken</p>
                                <pre css={Shared.codeBlock(`${C.danger}4d`)} style={{ maxHeight: '13rem', overflow: 'auto' }}><code>{q.brokenCode}</code></pre>
                              </div>
                              <div>
                                <p css={S.diffLabel(C.accent3)}>✅ Fixed</p>
                                <pre css={Shared.codeBlock(`${C.accent3}4d`)} style={{ maxHeight: '13rem', overflow: 'auto' }}><code css={{ color: C.accent3 }}>{q.fixedCode}</code></pre>
                              </div>
                            </div>
                            <div css={S.revealCard}>
                              <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.danger, marginBottom: '0.375rem' }}>🐛 The Bug</p>
                              <p css={{ fontSize: '0.75rem', color: C.text, marginBottom: '0.75rem' }}>{q.bugDescription}</p>
                              <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent, marginBottom: '0.375rem' }}>💡 Explanation</p>
                              <p css={{ fontSize: '0.75rem', color: C.text, marginBottom: '0.75rem' }}>{q.explanation}</p>
                              <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent2, marginBottom: '0.375rem' }}>⚡ Key Insight</p>
                              <p css={{ fontSize: '0.75rem', color: C.text }}>{q.keyInsight}</p>
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
      </div>
    </>
  )
}
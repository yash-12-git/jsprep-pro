/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions, useCategories, useUserProgress } from '@/hooks/useQuestions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { CheckCircle, XCircle, ChevronDown, Lightbulb, Lock, Zap, Code2, Eye } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import type { Question } from '@/types/question'

type AnswerState = 'idle' | 'correct' | 'wrong' | 'revealed'
const FREE_OUTPUT_LIMIT = 5

const DIFF_STYLE = {
  beginner: { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  core:     { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  advanced: { bg: `${C.accent2}1a`, color: C.accent2, border: `${C.accent2}33` },
  expert:   { bg: `${C.danger}1a`,  color: C.danger,  border: `${C.danger}33`  },
}
const DIFF_LABEL: Record<string, string> = {
  beginner: '🟢 Easy', core: '🟢 Easy', advanced: '🟡 Medium', expert: '🔴 Hard'
}

export default function OutputQuizPage() {
  const { user, progress, loading: authLoading } = useAuth()
  const router = useRouter()

  const { questions, loading: qLoading } = useQuestions({
    type: 'output',
    track: 'javascript',
    enabled: !!user,
  })
  const { categories } = useCategories('output', 'javascript')
  const { isSolved, isRevealed, recordSolved, recordRevealed, solvedIds } =
    useUserProgress({ uid: user?.uid ?? null })

  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [localWrong, setLocalWrong] = useState<Set<string>>(new Set())
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

  function getState(q: Question): AnswerState {
    if (isSolved(q.id))   return 'correct'
    if (isRevealed(q.id)) return 'revealed'
    if (localWrong.has(q.id)) return 'wrong'
    return 'idle'
  }

  async function checkAnswer(q: Question, globalIdx: number) {
    if (!progress!.isPro && globalIdx >= FREE_OUTPUT_LIMIT) {
      setShowPaywall(true); return
    }
    const ua = (userAnswers[q.id] || '').trim().toLowerCase().replace(/\s+/g, '\n').trim()
    // expectedOutput is stored in q.expectedOutput (Firestore field)
    const correct = (q.expectedOutput || q.answer || '').toLowerCase().trim()
    const match = ua === correct || ua.split('\n').join(',') === correct.split('\n').join(',')
    if (match) {
      await recordSolved(q.id)
      setLocalWrong(prev => { const n = new Set(prev); n.delete(q.id); return n })
    } else {
      setLocalWrong(prev => new Set(prev).add(q.id))
    }
  }

  async function reveal(q: Question) {
    if (!isSolved(q.id)) await recordRevealed(q.id)
    setLocalWrong(prev => { const n = new Set(prev); n.delete(q.id); return n })
  }

  function reset(id: string) {
    setUserAnswers(prev => ({ ...prev, [id]: '' }))
    setLocalWrong(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const solvedCount = solvedIds.filter(id => questions.some(q => q.id === id)).length
  const pct = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0

  return (
    <>
      <Navbar />
      {showPaywall && (
        <PaywallBanner
          reason={`Free users can attempt the first ${FREE_OUTPUT_LIMIT} output questions. Upgrade for all!`}
          onClose={() => setShowPaywall(false)}
        />
      )}
      <div css={Shared.pageWrapper}>

        <div css={S.header}>
          <div css={S.headerTop}>
            <div css={Shared.iconBox(C.accent2)}><Code2 size={18} color={C.accent2} /></div>
            <div css={S.titleBlock}>
              <h1 css={S.pageTitle}>What's the Output?</h1>
              <p css={S.pageSubtitle}>Read the code → predict the output → progress saved automatically</p>
            </div>
          </div>
          <div css={S.progressRow}>
            <div css={Shared.progressBarTrack}>
              <div css={Shared.progressBarFill(pct, `linear-gradient(90deg, ${C.accent2}, ${C.accent3})`)} />
            </div>
            <span css={S.progressCount}>{solvedCount}/{questions.length} solved</span>
          </div>
        </div>

        <div css={Shared.categoryScroll}>
          {['All', ...categories].map(cat => (
            <button key={cat} css={Shared.categoryChip(activeCategory === cat, C.accent2)}
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
              // global index in all questions (for paywall check)
              const globalIdx = questions.indexOf(q)
              const state = getState(q)
              const isOpen = openId === q.id
              const isLocked = !progress.isPro && globalIdx >= FREE_OUTPUT_LIMIT
              const ds = DIFF_STYLE[q.difficulty] ?? DIFF_STYLE.core
              const expectedOut = q.expectedOutput || q.answer

              return (
                <div key={q.id} css={S.questionCard(state)}>
                  <div css={S.cardHeader} onClick={() => setOpenId(isOpen ? null : q.id)}>
                    <span css={S.qNumber}>#{String(idx + 1).padStart(2, '0')}</span>
                    <div css={{ flex: 1, minWidth: 0 }}>
                      <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.375rem' }}>
                        <p css={{ fontWeight:700, fontSize:'0.875rem' }}>{q.title}</p>
                        {isLocked && <Lock size={12} color={C.muted} />}
                        {state === 'correct'  && <CheckCircle size={14} color={C.accent3} />}
                        {state === 'revealed' && <Eye size={14} color={C.accent2} />}
                        {state === 'wrong'    && <XCircle size={14} color={C.danger} />}
                      </div>
                      <div css={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                        <span css={{ fontSize:'0.625rem', fontWeight:700, padding:'0.125rem 0.5rem', borderRadius:'9999px', border:`1px solid ${ds.border}`, background:ds.bg, color:ds.color }}>
                          {DIFF_LABEL[q.difficulty] ?? q.difficulty}
                        </span>
                        <span css={{ fontSize:'0.625rem', fontWeight:700, padding:'0.125rem 0.5rem', borderRadius:'9999px', border:`1px solid ${C.accent}33`, background:`${C.accent}1a`, color:`${C.accent}cc` }}>
                          {q.category}
                        </span>
                      </div>
                    </div>
                    <div css={S.chevronWrapper(isOpen) as any}><ChevronDown size={16} color={C.muted} /></div>
                  </div>

                  {isOpen && (
                    <div css={S.cardBody}>
                      <div css={S.codeSection}>
                        <p css={S.codeSectionLabel}>Code</p>
                        <pre css={Shared.codeBlock()}><code>{q.code}</code></pre>
                      </div>

                      <div css={S.inputSection}>
                        <p css={S.textareaLabel}>
                          Your prediction{' '}
                          <span css={{ textTransform:'none', letterSpacing:0, fontWeight:400, color:C.muted }}>
                            (one output per line)
                          </span>
                        </p>

                        {isLocked ? (
                          <div css={S.lockedBox}>
                            <Lock size={14} color={C.muted} />
                            <span css={S.lockedText}>Pro feature — upgrade to attempt this question</span>
                            <button css={Shared.actionBtn(C.accent)} onClick={() => setShowPaywall(true)}>
                              <Zap size={11} /> Upgrade
                            </button>
                          </div>
                        ) : (
                          <>
                            <textarea
                              value={userAnswers[q.id] || ''}
                              onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                              disabled={state === 'correct' || state === 'revealed'}
                              placeholder={'Type the expected output...\nOne value per line'}
                              rows={Math.max(3, (expectedOut || '').split('\n').length + 1)}
                              css={Shared.textarea(state === 'wrong' ? C.danger : C.accent2)}
                              style={{ opacity: state === 'correct' || state === 'revealed' ? 0.6 : 1 }}
                            />
                            {state === 'idle' && (
                              <div css={S.actionRow}>
                                <button css={Shared.primaryBtn(C.accent2)}
                                  onClick={() => checkAnswer(q, globalIdx)}
                                  disabled={!(userAnswers[q.id] || '').trim()}>
                                  ✓ Check Answer
                                </button>
                                <button css={Shared.actionBtn(C.muted)} onClick={() => reveal(q)}>
                                  <Lightbulb size={12} /> Reveal
                                </button>
                              </div>
                            )}
                            {state === 'wrong' && (
                              <div css={S.actionRow}>
                                <button css={Shared.primaryBtn(C.danger)}
                                  onClick={() => checkAnswer(q, globalIdx)}
                                  disabled={!(userAnswers[q.id] || '').trim()}>
                                  Try Again
                                </button>
                                <button css={Shared.actionBtn(C.muted)} onClick={() => reveal(q)}>
                                  <Lightbulb size={12} /> Show Answer
                                </button>
                              </div>
                            )}
                            {(state === 'correct' || state === 'revealed') && (
                              <button css={S.resetLink} onClick={() => reset(q.id)}>Reset</button>
                            )}
                          </>
                        )}
                      </div>

                      {(state === 'correct' || state === 'wrong' || state === 'revealed') && (
                        <div css={{ padding: '0 1.25rem 1.25rem' }}>
                          <div css={S.explanationBox}>
                            <div css={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                              {state === 'correct'
                                ? <><CheckCircle size={14} color={C.accent3} /><span css={S.explanationTitle(C.accent3)}>Correct! 🎉</span></>
                                : <span css={S.explanationTitle(C.muted)}>Expected Output:</span>}
                            </div>
                            <pre css={Shared.codeBlock(`${C.accent3}33`)}>
                              <code css={{ color: C.accent3 }}>{expectedOut}</code>
                            </pre>
                          </div>
                          {q.explanation && (
                            <div css={[S.explanationBox, { marginTop: '0.75rem' }]}>
                              <p css={S.explanationTitle(C.accent)}>💡 Explanation</p>
                              <p css={S.explanationText}>{q.explanation}</p>
                              {q.keyInsight && (
                                <div css={S.insightRow}>
                                  <p css={S.explanationTitle(C.accent2)}>⚡ Key Insight</p>
                                  <p css={S.explanationText}>{q.keyInsight}</p>
                                </div>
                              )}
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
    </>
  )
}
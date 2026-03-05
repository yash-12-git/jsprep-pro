/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { outputQuestions, OUTPUT_CATEGORIES, FREE_OUTPUT_LIMIT } from '@/data/outputQuestions'
import { markOutputSolved, markOutputRevealed } from '@/lib/userProgress'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { CheckCircle, XCircle, ChevronDown, Lightbulb, Lock, Zap, Code2, Eye } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'

type AnswerState = 'idle' | 'correct' | 'wrong' | 'revealed'

const DIFF_STYLE = {
  easy:   { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  medium: { bg: `${C.accent2}1a`, color: C.accent2, border: `${C.accent2}33` },
  hard:   { bg: `${C.danger}1a`,  color: C.danger,  border: `${C.danger}33`  },
}
const DIFF_LABEL = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }

export default function OutputQuizPage() {
  const { user, progress, loading, refreshProgress } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [localWrong, setLocalWrong] = useState<Set<number>>(new Set())
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])
  if (loading || !user || !progress) return <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>

  const solvedIds = new Set(progress.solvedOutputIds || [])
  const revealedIds = new Set(progress.revealedOutputIds || [])
  const filtered = activeCategory === 'All' ? outputQuestions : outputQuestions.filter(q => q.cat === activeCategory)

  function getState(id: number): AnswerState {
    if (solvedIds.has(id)) return 'correct'
    if (revealedIds.has(id)) return 'revealed'
    if (localWrong.has(id)) return 'wrong'
    return 'idle'
  }

  async function checkAnswer(q: typeof outputQuestions[0]) {
    const idx = outputQuestions.indexOf(q)
    if (!progress?.isPro && idx >= FREE_OUTPUT_LIMIT) { setShowPaywall(true); return }
    const userAnswer = (userAnswers[q.id] || '').trim().toLowerCase().replace(/\s+/g, '\n').trim()
    const correct = q.answer.toLowerCase().trim()
     const isCorrect = userAnswer === correct ||
        userAnswer.split('\n').join(',') === correct.split('\n').join(',')
    if (isCorrect && !!user) {
      await markOutputSolved(user.uid, q.id); await refreshProgress()
      setLocalWrong(prev => { const n = new Set(prev); n.delete(q.id); return n })
    } else {
      setLocalWrong(prev => new Set(prev).add(q.id))
    }
  }

  async function reveal(q: typeof outputQuestions[0]) {
    if (!solvedIds.has(q.id) && !!user) { await markOutputRevealed(user.uid, q.id); await refreshProgress() }
    setLocalWrong(prev => { const n = new Set(prev); n.delete(q.id); return n })
  }

  function reset(id: number) {
    setUserAnswers(prev => ({ ...prev, [id]: '' }))
    setLocalWrong(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const totalSolved = solvedIds.size
  const pct = Math.round((totalSolved / outputQuestions.length) * 100)

  return (
    <>
      <Navbar />
      {showPaywall && (
        <PaywallBanner
          reason={`Free users can attempt the first ${FREE_OUTPUT_LIMIT} output questions. Upgrade for all ${outputQuestions.length}!`}
          onClose={() => setShowPaywall(false)}
        />
      )}
      <div css={Shared.pageWrapper}>

        <div css={S.header}>
          <div css={S.headerTop}>
            <div css={Shared.iconBox(C.accent2)}>
              <Code2 size={18} color={C.accent2} />
            </div>
            <div css={S.titleBlock}>
              <h1 css={S.pageTitle}>What's the Output?</h1>
              <p css={S.pageSubtitle}>Read the code → predict the output → progress saved automatically</p>
            </div>
          </div>
          <div css={S.progressRow}>
            <div css={Shared.progressBarTrack}>
              <div css={Shared.progressBarFill(pct, `linear-gradient(90deg, ${C.accent2}, ${C.accent3})`)} />
            </div>
            <span css={S.progressCount}>{totalSolved}/{outputQuestions.length} solved</span>
          </div>
          <div css={S.diffRow}>
            {(['easy', 'medium', 'hard'] as const).map(d => {
              const total = outputQuestions.filter(q => q.difficulty === d).length
              const solved = outputQuestions.filter(q => q.difficulty === d && solvedIds.has(q.id)).length
              const ds = DIFF_STYLE[d]
              return (
                <div key={d} css={S.diffItem}>
                  <span css={Shared.diffBadge(d)}>{DIFF_LABEL[d]}</span>
                  <span css={S.diffCount}>{solved}/{total}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div css={Shared.categoryScroll}>
          {['All', ...OUTPUT_CATEGORIES].map(cat => (
            <button key={cat} css={Shared.categoryChip(activeCategory === cat, C.accent2)} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div css={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((q, idx) => {
            const state = getState(q.id)
            const isOpen = openId === q.id
            const isLocked = !progress.isPro && outputQuestions.indexOf(q) >= FREE_OUTPUT_LIMIT
            const ds = DIFF_STYLE[q.difficulty]

            return (
              <div key={q.id} css={S.questionCard(state)}>
                <div css={S.cardHeader} onClick={() => setOpenId(isOpen ? null : q.id)}>
                  <span css={S.qNumber}>#{String(idx + 1).padStart(2, '0')}</span>
                  <div css={{ flex: 1, minWidth: 0 }}>
                    <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                      <p css={{ fontWeight: 700, fontSize: '0.875rem' }}>{q.title}</p>
                      {isLocked && <Lock size={12} color={C.muted} />}
                      {state === 'correct' && <CheckCircle size={14} color={C.accent3} />}
                      {state === 'revealed' && <Eye size={14} color={C.accent2} />}
                      {state === 'wrong' && <XCircle size={14} color={C.danger} />}
                    </div>
                    <div css={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${ds.border}`, background: ds.bg, color: ds.color }}>
                        {DIFF_LABEL[q.difficulty]}
                      </span>
                      <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${C.accent}33`, background: `${C.accent}1a`, color: `${C.accent}cc` }}>
                        {q.cat}
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
                      <p css={S.textareaLabel}>Your prediction <span css={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: C.muted }}>(one output per line)</span></p>

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
                            value={userAnswers[q.id] || ''} onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            disabled={state === 'correct' || state === 'revealed'}
                            placeholder={'Type the expected output...\nOne value per line'}
                            rows={Math.max(3, q.answer.split('\n').length + 1)}
                            css={Shared.textarea(state === 'wrong' ? C.danger : C.accent2)}
                            style={{ opacity: state === 'correct' || state === 'revealed' ? 0.6 : 1, cursor: state === 'correct' || state === 'revealed' ? 'not-allowed' : 'text' }}
                          />

                          {state === 'idle' && (
                            <div css={S.actionRow}>
                              <button css={Shared.primaryBtn(C.accent2)} onClick={() => checkAnswer(q)} disabled={!(userAnswers[q.id] || '').trim()}>
                                ✓ Check Answer
                              </button>
                              <button css={Shared.actionBtn(C.muted)} onClick={() => reveal(q)}>
                                <Lightbulb size={12} /> Reveal
                              </button>
                            </div>
                          )}
                          {state === 'wrong' && (
                            <div css={S.actionRow}>
                              <button css={Shared.primaryBtn(C.danger)} onClick={() => checkAnswer(q)} disabled={!(userAnswers[q.id] || '').trim()}>
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
                          <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {state === 'correct'
                              ? <><CheckCircle size={14} color={C.accent3} /><span css={S.explanationTitle(C.accent3)}>Correct! 🎉</span></>
                              : <span css={S.explanationTitle(C.muted)}>Expected Output:</span>}
                          </div>
                          <pre css={Shared.codeBlock(`${C.accent3}33`)}><code css={{ color: C.accent3 }}>{q.answer}</code></pre>
                        </div>
                        <div css={[S.explanationBox, { marginTop: '0.75rem' }]}>
                          <p css={S.explanationTitle(C.accent)}>💡 Explanation</p>
                          <p css={S.explanationText}>{q.explanation}</p>
                          <div css={S.insightRow}>
                            <p css={S.explanationTitle(C.accent2)}>⚡ Key Insight</p>
                            <p css={S.explanationText}>{q.keyInsight}</p>
                          </div>
                        </div>
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
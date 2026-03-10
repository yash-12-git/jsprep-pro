/** @jsxImportSource @emotion/react */
'use client'

import { useState } from 'react'
import {
  ChevronDown, CheckCircle, XCircle, Eye,
  RotateCcw, Lock, Zap, Loader2, AlertTriangle,
} from 'lucide-react'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import * as S from './styles'
import type { Question } from '@/types/question'

type QState = 'idle' | 'checking' | 'feedback' | 'revealed'

export interface AIFeedback {
  correct: boolean
  score: number
  verdict: string
  whatTheyGotRight: string
  remainingIssues: string
  betterApproach: string | null
  hint: string
  explanation: string
}

interface Props {
  q: Question
  index: number
  isPro: boolean
  isSolved:      (id: string) => boolean
  isRevealed:    (id: string) => boolean
  recordSolved:  (id: string) => Promise<void>
  recordRevealed:(id: string) => Promise<void>
  /** If true, locks the card behind a paywall upgrade prompt */
  isLocked?: boolean
  onPaywall?: () => void
  /** Controlled open state — provide both or neither for accordion mode */
  isOpen?: boolean
  onToggle?: () => void
}

export default function DebugCard({
  q, index, isPro,
  isSolved, isRevealed, recordSolved, recordRevealed,
  isLocked = false, onPaywall,
  isOpen: controlledOpen, onToggle,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [userCode, setUserCode]   = useState(q.brokenCode || q.code || '')
  const [qState, setQState]       = useState<QState>('idle')
  const [feedback, setFeedback]   = useState<AIFeedback | null>(null)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const toggle = onToggle ?? (() => setInternalOpen(o => !o))

  const solved   = isSolved(q.id)
  const revealed = isRevealed(q.id)

  // Derive the canonical state — persisted Firestore state wins over local
  const state: QState =
    solved   ? 'feedback' :
    revealed ? 'revealed' :
    qState

  const fb         = feedback
  const isSolvedQ  = fb?.correct || solved
  const hasEdited  = userCode.trim() !== (q.brokenCode || q.code || '').trim()

  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core
  const cs = S.CAT_STYLE[q.category]   ?? { bg: C.border, color: C.muted, border: C.border }

  // Card highlight derived from state
  const highlight: S.CardHighlight =
    isSolvedQ        ? 'correct'  :
    state === 'feedback' && !isSolvedQ ? 'wrong' :
    state === 'revealed' ? 'revealed'  : 'idle'

  async function checkWithAI() {
    if (isLocked)   { onPaywall?.(); return }
    if (!hasEdited) { alert('Edit the code to fix the bug first!'); return }
    setQState('checking')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'debugcheck',
          messages: [{ role: 'user', content: userCode }],
          context: {
            brokenCode: q.brokenCode || q.code,
            bugDescription: q.bugDescription,
            fixedCode: q.fixedCode,
            userFix: userCode,
          },
        }),
      })
      const data = await res.json()
      const parsed: AIFeedback = JSON.parse(data.text.replace(/```json|```/g, '').trim())
      setFeedback(parsed)
      setQState('feedback')
      if (parsed.correct) await recordSolved(q.id)
    } catch {
      setQState('idle')
      alert('AI check failed — try again')
    }
  }

  async function reveal() {
    if (!solved) await recordRevealed(q.id)
    setQState('revealed')
  }

  function reset() {
    setUserCode(q.brokenCode || q.code || '')
    setQState('idle')
    setFeedback(null)
  }

  const codeTextareaState =
    isSolvedQ         ? 'correct'  :
    state === 'feedback' && !isSolvedQ ? 'wrong' :
    state === 'checking' ? 'checking' : 'idle'

  return (
    <div css={S.questionCard(highlight, C.danger)}>
      <div css={S.cardHeader} onClick={toggle}>
        <span css={S.qNumber(C.danger)}>#{String(index + 1).padStart(2, '00')}</span>
        <div css={{ flex: 1, minWidth: 0 }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
            <p css={{ fontWeight: 700, fontSize: '0.875rem' }}>{q.title}</p>
            {isLocked  && <Lock size={12} color={C.muted} />}
            {isSolvedQ && <CheckCircle size={14} color={C.accent3} />}
            {state === 'feedback' && !isSolvedQ && <XCircle size={14} color={C.danger} />}
          </div>
          <div css={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${ds.border}`, background: ds.bg, color: ds.color }}>
              {S.DIFF_LABEL[q.difficulty] ?? q.difficulty}
            </span>
            <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${cs.border}`, background: cs.bg, color: cs.color }}>
              {q.category}
            </span>
          </div>
        </div>
        <div css={S.chevronWrapper(isOpen)}><ChevronDown size={16} color={C.muted} /></div>
      </div>

      {isOpen && (
        <div css={S.cardBody}>
          {/* Bug description prompt */}
          {q.question && (
            <div css={S.descriptionBox}>
              <AlertTriangle size={14} color={C.danger} style={{ flexShrink: 0, marginTop: 2 }} />
              <p css={{ fontSize: '0.875rem', color: '#e8c8c8', lineHeight: 1.6, margin: 0 }}>{q.question}</p>
            </div>
          )}

          {isLocked ? (
            <div css={[S.bodyInner, { paddingTop: 0 }]}>
              <div css={S.lockedBox}>
                <Lock size={14} color={C.muted} />
                <span css={{ fontSize: '0.875rem', color: C.muted, flex: 1 }}>Pro feature — upgrade to access all debug challenges</span>
                <button css={Shared.actionBtn(C.accent)} onClick={onPaywall}>
                  <Zap size={11} /> Upgrade
                </button>
              </div>
            </div>
          ) : (
            <div css={S.bodyInner}>
              {/* Broken code reference */}
              <div>
                <p css={S.sectionLabel(C.danger)}>🔴 Broken Code</p>
                <pre css={Shared.codeBlock(`${C.danger}4d`)}><code>{q.brokenCode || q.code}</code></pre>
              </div>

              {/* Editable fix area */}
              <div>
                <p css={S.sectionLabel(C.accent3)}>
                  ✏️ Your Fix
                  <span css={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: C.muted, marginLeft: '0.25rem' }}>
                    — edit the broken code to fix the bug
                  </span>
                </p>
                <textarea
                  value={userCode}
                  onChange={e => setUserCode(e.target.value)}
                  disabled={state === 'checking' || isSolvedQ}
                  rows={Math.max(6, userCode.split('\n').length + 1)}
                  spellCheck={false}
                  css={S.codeTextarea(codeTextareaState)}
                />
              </div>

              {/* Action row */}
              <div css={S.actionRow}>
                {isPro ? (
                  <button
                    css={Shared.primaryBtn(C.accent)}
                    onClick={checkWithAI}
                    disabled={state === 'checking' || !hasEdited || isSolvedQ}
                    style={{ flex: 1 }}
                  >
                    {state === 'checking'
                      ? <><Loader2 size={13} css={{ animation: 'spin 1s linear infinite' }} /> AI is checking...</>
                      : <><Zap size={13} /> Check with AI</>
                    }
                  </button>
                ) : (
                  <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: `${C.accent}0d`, border: `1px solid ${C.accent}26`, borderRadius: '0.75rem', fontSize: '0.8125rem', color: C.muted, flex: 1 }}>
                    <Zap size={12} color={C.accent} />
                    <span>AI checking is Pro</span>
                    <a href="/auth" css={{ color: C.accent, fontWeight: 700, textDecoration: 'none', marginLeft: 'auto' }}>Upgrade →</a>
                  </div>
                )}
                <button css={Shared.actionBtn(C.muted)} onClick={reveal}>
                  <Eye size={13} /> Show Answer
                </button>
                {(state === 'feedback' || state === 'revealed') && (
                  <button css={Shared.ghostBtn} onClick={reset}>
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>

              {/* AI Feedback */}
              {state === 'feedback' && fb && (
                <div css={S.feedbackBox(fb.correct)}>
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

                  <div css={S.feedbackRow}>
                    <p css={S.feedbackRowTitle(C.accent3)}>✓ What you got right</p>
                    <p css={S.feedbackRowText}>{fb.whatTheyGotRight}</p>
                  </div>

                  {fb.remainingIssues !== 'None' && (
                    <div css={S.feedbackRow}>
                      <p css={S.feedbackRowTitle(C.danger)}>✗ Still needs fixing</p>
                      <p css={S.feedbackRowText}>{fb.remainingIssues}</p>
                    </div>
                  )}

                  {!fb.correct && fb.hint && (
                    <div css={S.hintBox}>
                      <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent2, marginBottom: '0.25rem' }}>💡 Hint</p>
                      <p css={S.feedbackRowText}>{fb.hint}</p>
                    </div>
                  )}

                  {fb.betterApproach && (
                    <div css={S.feedbackRow}>
                      <p css={S.feedbackRowTitle(C.accent)}>⚡ Better approach</p>
                      <p css={S.feedbackRowText}>{fb.betterApproach}</p>
                    </div>
                  )}

                  <div css={S.feedbackRow}>
                    <p css={S.feedbackRowTitle(C.muted)}>📖 Explanation</p>
                    <p css={S.feedbackRowText}>{fb.explanation}</p>
                  </div>

                  {!fb.correct && (
                    <button css={Shared.primaryBtn(C.accent)} onClick={() => setQState('idle')}>
                      Try Again
                    </button>
                  )}
                </div>
              )}

              {/* Revealed: side-by-side diff */}
              {state === 'revealed' && (
                <div css={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div css={S.diffGrid}>
                    <div>
                      <p css={S.diffLabel(C.danger)}>❌ Broken</p>
                      <pre css={Shared.codeBlock(`${C.danger}4d`)} style={{ maxHeight: '13rem', overflow: 'auto' }}>
                        <code>{q.brokenCode || q.code}</code>
                      </pre>
                    </div>
                    <div>
                      <p css={S.diffLabel(C.accent3)}>✅ Fixed</p>
                      <pre css={Shared.codeBlock(`${C.accent3}4d`)} style={{ maxHeight: '13rem', overflow: 'auto' }}>
                        <code css={{ color: C.accent3 }}>{q.fixedCode}</code>
                      </pre>
                    </div>
                  </div>
                  <div css={S.revealCard}>
                    <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.danger, marginBottom: '0.375rem' }}>🐛 The Bug</p>
                    <p css={{ fontSize: '0.75rem', color: C.text, marginBottom: '0.75rem' }}>{q.bugDescription}</p>
                    <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent, marginBottom: '0.375rem' }}>💡 Explanation</p>
                    <p css={{ fontSize: '0.75rem', color: C.text, marginBottom: '0.75rem' }}>{q.explanation}</p>
                    {q.keyInsight && (
                      <>
                        <p css={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent2, marginBottom: '0.375rem' }}>⚡ Key Insight</p>
                        <p css={{ fontSize: '0.75rem', color: C.text }}>{q.keyInsight}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
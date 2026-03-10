/** @jsxImportSource @emotion/react */
'use client'

import { useState } from 'react'
import { ChevronDown, CheckCircle, XCircle, Eye, Lightbulb, Lock, Zap, RotateCcw } from 'lucide-react'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import * as S from './styles'
import type { Question } from '@/types/question'

type AnswerState = 'idle' | 'correct' | 'wrong' | 'revealed'

interface Props {
  q: Question
  index: number
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

export default function OutputCard({
  q, index,
  isSolved, isRevealed, recordSolved, recordRevealed,
  isLocked = false, onPaywall,
  isOpen: controlledOpen, onToggle,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [answer, setAnswer]     = useState('')
  const [localWrong, setLocalWrong] = useState(false)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const toggle = onToggle ?? (() => setInternalOpen(o => !o))

  const state: AnswerState =
    isSolved(q.id)   ? 'correct'  :
    isRevealed(q.id) ? 'revealed' :
    localWrong       ? 'wrong'    : 'idle'

  const expectedOut = q.expectedOutput || q.answer || ''
  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core

  async function checkAnswer() {
    if (isLocked) { onPaywall?.(); return }
    const ua      = answer.trim().toLowerCase().replace(/\s+/g, '\n').trim()
    const correct = expectedOut.toLowerCase().trim()
    const match   = ua === correct ||
      ua.split('\n').join(',') === correct.split('\n').join(',')
    if (match) { await recordSolved(q.id); setLocalWrong(false) }
    else        { setLocalWrong(true) }
  }

  async function reveal() {
    if (!isSolved(q.id)) await recordRevealed(q.id)
    setLocalWrong(false)
  }

  function reset() {
    setAnswer('')
    setLocalWrong(false)
  }

  const highlight: S.CardHighlight =
    state === 'correct'  ? 'correct'  :
    state === 'wrong'    ? 'wrong'    :
    state === 'revealed' ? 'revealed' : 'idle'

  return (
    <div css={S.questionCard(highlight, C.accent2)}>
      <div css={S.cardHeader} onClick={toggle}>
        <span css={S.qNumber(C.accent2)}>#{String(index + 1).padStart(2, '0')}</span>
        <div css={{ flex: 1, minWidth: 0 }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
            <p css={{ fontWeight: 700, fontSize: '0.875rem' }}>{q.title}</p>
            {isLocked        && <Lock size={12} color={C.muted} />}
            {state === 'correct'  && <CheckCircle size={14} color={C.accent3} />}
            {state === 'revealed' && <Eye size={14} color={C.accent2} />}
            {state === 'wrong'    && <XCircle size={14} color={C.danger} />}
          </div>
          <div css={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${ds.border}`, background: ds.bg, color: ds.color }}>
              {S.DIFF_LABEL[q.difficulty] ?? q.difficulty}
            </span>
            <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${C.accent}33`, background: `${C.accent}1a`, color: `${C.accent}cc` }}>
              {q.category}
            </span>
          </div>
        </div>
        <div css={S.chevronWrapper(isOpen)}><ChevronDown size={16} color={C.muted} /></div>
      </div>

      {isOpen && (
        <div css={S.cardBody}>
          {/* Code block */}
          <div css={{ padding: '1.25rem 1.25rem 0' }}>
            <p css={S.sectionLabel()}>Code</p>
            <pre css={Shared.codeBlock()}><code>{q.code}</code></pre>
          </div>

          <div css={S.inputSection}>
            <p css={S.sectionLabel()}>
              Your prediction{' '}
              <span css={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: C.muted }}>
                (one output per line)
              </span>
            </p>

            {isLocked ? (
              <div css={S.lockedBox}>
                <Lock size={14} color={C.muted} />
                <span css={{ fontSize: '0.875rem', color: C.muted, flex: 1 }}>Pro feature — upgrade to attempt this question</span>
                <button css={Shared.actionBtn(C.accent)} onClick={onPaywall}>
                  <Zap size={11} /> Upgrade
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  disabled={state === 'correct' || state === 'revealed'}
                  placeholder={'Type the expected output...\nOne value per line'}
                  rows={Math.max(3, expectedOut.split('\n').length + 1)}
                  css={Shared.textarea(state === 'wrong' ? C.danger : C.accent2)}
                  style={{ opacity: state === 'correct' || state === 'revealed' ? 0.6 : 1 }}
                />

                {state === 'idle' && (
                  <div css={S.actionRow}>
                    <button css={Shared.primaryBtn(C.accent2)} onClick={checkAnswer} disabled={!answer.trim()}>
                      ✓ Check Answer
                    </button>
                    <button css={Shared.actionBtn(C.muted)} onClick={reveal}>
                      <Lightbulb size={12} /> Reveal
                    </button>
                  </div>
                )}
                {state === 'wrong' && (
                  <div css={S.actionRow}>
                    <button css={Shared.primaryBtn(C.danger)} onClick={checkAnswer} disabled={!answer.trim()}>
                      Try Again
                    </button>
                    <button css={Shared.actionBtn(C.muted)} onClick={reveal}>
                      <Lightbulb size={12} /> Show Answer
                    </button>
                  </div>
                )}
                {(state === 'correct' || state === 'revealed') && (
                  <button css={S.resetLink} onClick={reset}>
                    <RotateCcw size={11} style={{ display: 'inline', marginRight: 4 }} />
                    Reset
                  </button>
                )}
              </>
            )}
          </div>

          {/* Answer + explanation — shown after any attempt */}
          {(state === 'correct' || state === 'wrong' || state === 'revealed') && (
            <div css={{ padding: '0 1.25rem 1.25rem' }}>
              <div css={S.explanationBox}>
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {state === 'correct'
                    ? <><CheckCircle size={14} color={C.accent3} /><span css={S.explanationTitle(C.accent3)}>Correct! 🎉</span></>
                    : <span css={S.explanationTitle(C.muted)}>Expected Output:</span>
                  }
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
}
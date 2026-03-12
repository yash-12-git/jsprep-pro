'use client'
/**
 * SEOPredictionCard — interactive output prediction card for SEO pages.
 *
 * Used on /javascript-output-questions and /javascript-tricky-questions.
 * Inline styles only — no Emotion, works inside RSC pages.
 * No auth / Firestore — public SEO pages don't track progress.
 *
 * Free limit: first `freeLimit` cards (by globalIndex) are interactive.
 * Beyond that: code stays visible (SEO), prediction input is locked.
 * Answers never appear in the DOM until the user checks or reveals.
 */

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, EyeOff, RotateCcw, Lock } from 'lucide-react'

export interface SEOQuestion {
  id:           string | number
  title:        string
  code?:        string
  answer:       string   // correct output — checked locally, never shown upfront
  explanation?: string
  keyInsight?:  string
  difficulty?:  string
  category?:    string
  tags?:        string[]
}

interface Props {
  q:           SEOQuestion
  globalIndex: number    // 0-based across ALL questions (for free limit gate)
  freeLimit:   number
  quizHref:    string    // where locked CTA sends the user
  accent:      string    // theme colour (accent2 for output, danger for tricky)
  badgeLabel?: string    // e.g. '#01'
}

// ─── Normalize for comparison ─────────────────────────────────────────────────
function normalizeOutput(s: string): string {
  return s.trim().toLowerCase()
    .split('\n').map(l => l.trim()).filter(Boolean).join('\n')
}

const C = {
  card:    '#111118',
  surface: '#16161f',
  border:  'rgba(255,255,255,0.07)',
  muted:   'rgba(255,255,255,0.4)',
  accent3: '#6af7c0',
  danger:  '#f76a6a',
  accent:  '#7c6af7',
  accent2: '#f7c76a',
}

const DIFF_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  easy:     { color: '#6af7c0', bg: 'rgba(106,247,192,0.08)', border: 'rgba(106,247,192,0.25)' },
  medium:   { color: '#f7c76a', bg: 'rgba(247,199,106,0.08)', border: 'rgba(247,199,106,0.25)' },
  hard:     { color: '#f76a6a', bg: 'rgba(247,106,106,0.08)', border: 'rgba(247,106,106,0.25)' },
  beginner: { color: '#6af7c0', bg: 'rgba(106,247,192,0.08)', border: 'rgba(106,247,192,0.25)' },
  core:     { color: '#6af7c0', bg: 'rgba(106,247,192,0.08)', border: 'rgba(106,247,192,0.25)' },
  advanced: { color: '#f7c76a', bg: 'rgba(247,199,106,0.08)', border: 'rgba(247,199,106,0.25)' },
  expert:   { color: '#f76a6a', bg: 'rgba(247,106,106,0.08)', border: 'rgba(247,106,106,0.25)' },
}
const DIFF_LABEL: Record<string, string> = {
  easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard',
  beginner: '🟢 Easy', core: '🟢 Easy', advanced: '🟡 Medium', expert: '🔴 Hard',
}

type State = 'idle' | 'correct' | 'wrong' | 'revealed'

export default function SEOPredictionCard({
  q, globalIndex, freeLimit, quizHref, accent, badgeLabel,
}: Props) {
  const [open,       setOpen]       = useState(false)
  const [prediction, setPrediction] = useState('')
  const [state,      setState]      = useState<State>('idle')

  const isLocked     = globalIndex >= freeLimit
  const ds           = q.difficulty ? (DIFF_STYLE[q.difficulty] ?? DIFF_STYLE.medium) : DIFF_STYLE.medium
  const expectedRows = Math.max(3, q.answer.split('\n').length + 1)

  const cardBorder =
    state === 'correct'  ? `${C.accent3}55` :
    state === 'wrong'    ? `${C.danger}44`   :
    state === 'revealed' ? 'rgba(255,255,255,0.14)' : C.border

  const cardBg = state === 'correct' ? `${C.accent3}08` : C.card

  function check() {
    setState(
      normalizeOutput(prediction) === normalizeOutput(q.answer) ? 'correct' : 'wrong'
    )
  }

  return (
    <article
      style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '1rem', overflow: 'hidden', transition: 'border-color 0.2s' }}
      itemScope itemType="https://schema.org/Question"
    >
      {/* ── Header — always visible, click to expand ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
        style={{ padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
      >
        {badgeLabel && (
          <span style={{
            fontFamily: 'monospace', fontSize: '0.625rem', fontWeight: 700,
            color: accent, background: `${accent}18`, border: `1px solid ${accent}33`,
            padding: '0.125rem 0.5rem', borderRadius: '0.25rem', flexShrink: 0, marginTop: '0.2rem',
          }}>
            {badgeLabel}
          </span>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', margin: 0 }} itemProp="name">
              {q.title}
            </p>
            {isLocked           && <Lock size={12} color={C.muted} />}
            {state === 'correct' && <CheckCircle size={13} color={C.accent3} />}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {q.difficulty && (
              <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${ds.border}`, background: ds.bg, color: ds.color }}>
                {DIFF_LABEL[q.difficulty] ?? q.difficulty}
              </span>
            )}
            {q.category && (
              <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${accent}33`, background: `${accent}12`, color: `${accent}cc` }}>
                {q.category}
              </span>
            )}
            {q.tags?.slice(0, 2).map(tag => (
              <span key={tag} style={{ fontSize: '0.625rem', color: C.muted, background: 'rgba(255,255,255,0.04)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <span style={{
          fontSize: '0.75rem', color: C.muted, flexShrink: 0, marginTop: '0.125rem',
          display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
        }}>▾</span>
      </div>

      {/* ── Body ── */}
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>

          {/* Code — always visible (SEO value, never gated) */}
          {q.code && (
            <div style={{ padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>
                Code
              </p>
              <pre style={{
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                borderRadius: '0.625rem', padding: '1rem', fontSize: '0.8125rem',
                fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0',
                overflow: 'auto', margin: 0, lineHeight: 1.7,
              }}>
                <code>{q.code}</code>
              </pre>
            </div>
          )}

          {/* LOCKED state — CTA replaces prediction box */}
          {isLocked ? (
            <div style={{ padding: '0 1.25rem 1.25rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '0.875rem', padding: '1rem 1.25rem',
              }}>
                <Lock size={14} color={C.muted} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', margin: '0 0 0.2rem' }}>
                    Practice this interactively in the quiz
                  </p>
                  <p style={{ fontSize: '0.75rem', color: C.muted, margin: 0 }}>
                    Predict the output before revealing it. That&apos;s how you actually learn it.
                  </p>
                </div>
                <Link href={quizHref} style={{
                  display: 'inline-flex', alignItems: 'center', fontSize: '0.8125rem', fontWeight: 700,
                  color: accent, background: `${accent}12`, border: `1px solid ${accent}33`,
                  padding: '0.5rem 1rem', borderRadius: '0.625rem', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  Open Interactive Quiz →
                </Link>
              </div>
            </div>
          ) : (
            /* UNLOCKED: prediction input */
            <div style={{ padding: '0 1.25rem 1.25rem' }} itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0.875rem 0 0.5rem' }}>
                Your prediction{' '}
                <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                  (one output per line)
                </span>
              </p>

              <textarea
                value={prediction}
                onChange={e => setPrediction(e.target.value)}
                disabled={state === 'correct'}
                placeholder={'Type the expected output...\nOne value per line'}
                rows={expectedRows}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#0a0a12',
                  border: `1px solid ${
                    state === 'wrong'   ? `${C.danger}66` :
                    state === 'correct' ? `${C.accent3}55` :
                                         `${accent}4d`
                  }`,
                  borderRadius: '0.625rem', padding: '0.75rem 1rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.8125rem', color: 'white',
                  outline: 'none', resize: 'none', lineHeight: 1.8,
                  opacity: state === 'correct' ? 0.6 : 1,
                }}
              />

              {/* Action row — changes by state */}
              {state === 'idle' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={check}
                    disabled={!prediction.trim()}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.5rem 1.25rem',
                      background: prediction.trim() ? accent : 'rgba(255,255,255,0.06)',
                      color: prediction.trim() ? '#0a0a10' : C.muted,
                      border: 'none', borderRadius: '0.625rem',
                      fontWeight: 700, fontSize: '0.875rem',
                      cursor: prediction.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    ✓ Check Answer
                  </button>
                  <button
                    onClick={() => setState('revealed')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.5rem 1rem', background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: C.muted, borderRadius: '0.625rem',
                      fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
                    }}
                  >
                    👁 Reveal
                  </button>
                </div>
              )}

              {state === 'wrong' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.625rem', color: C.danger, fontSize: '0.8125rem', fontWeight: 700 }}>
                    <XCircle size={14} /> Not quite — check your output
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={check} disabled={!prediction.trim()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1.25rem', background: C.danger, color: 'white', border: 'none', borderRadius: '0.625rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                      Try Again
                    </button>
                    <button onClick={() => setState('revealed')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: C.muted, borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
                      Show Answer
                    </button>
                  </div>
                </>
              )}

              {(state === 'correct' || state === 'revealed') && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
                  {state === 'revealed' && (
                    <button onClick={() => { setState('idle'); setPrediction('') }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: C.muted, borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                      <EyeOff size={11} /> Hide
                    </button>
                  )}
                  <button onClick={() => { setPrediction(''); setState('idle') }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: C.muted, borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                    <RotateCcw size={11} /> Try Again
                  </button>
                </div>
              )}

              {/* Answer + explanation — ONLY shown after check or reveal, never upfront */}
              {(state === 'correct' || state === 'revealed') && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} itemProp="text">
                  <div style={{ background: `${C.accent3}0d`, border: `1px solid ${C.accent3}33`, borderRadius: '0.625rem', padding: '0.875rem' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: state === 'correct' ? C.accent3 : C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>
                      {state === 'correct' ? '✓ Correct! 🎉' : 'Expected Output'}
                    </p>
                    <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: C.accent3, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {q.answer}
                    </pre>
                  </div>

                  {q.explanation && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: '0.625rem', padding: '0.875rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent, marginBottom: '0.375rem' }}>
                        💡 Explanation
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>
                        {q.explanation}
                      </p>
                      {q.keyInsight && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${C.border}` }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent2, marginBottom: '0.25rem' }}>
                            ⚡ Key Insight
                          </p>
                          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                            {q.keyInsight}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
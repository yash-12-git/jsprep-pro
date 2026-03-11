import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta, faqSchema, breadcrumbSchema, KEYWORDS, SITE } from '@/lib/seo/seo'
import { outputQuestions } from '@/data/outputQuestions'
import HeroCTA from './HeroCta'

export const metadata: Metadata = pageMeta({
  title: 'JavaScript Output Questions: Predict the Console.log (2026)',
  description: 'Practice 70+ JavaScript output prediction questions. See the code, predict what console.log prints — covers event loop, closures, hoisting, type coercion, and this binding.',
  path: '/javascript-output-questions',
  keywords: [
    'javascript output questions',
    'javascript predict the output',
    'javascript console log questions',
    'javascript coding interview output',
    'what does this javascript print',
    'javascript tricky output questions',
    'javascript event loop output',
    'javascript closure output questions',
    ...KEYWORDS.secondary,
  ],
})

// First N questions show full answers inline — rest link to interactive quiz.
// Keeps all code indexable while funnelling users to quiz for the real practice.
const FREE_PREVIEW_COUNT = 5

const allQuestions = [...outputQuestions]

const CATEGORIES = [
  'Event Loop & Promises',
  'Closures & Scope',
  "'this' Binding",
  'Hoisting',
  'Type Coercion',
] as const

const DIFF_LABEL: Record<string, string> = {
  easy:   '🟢 Easy',
  medium: '🟡 Medium',
  hard:   '🔴 Hard',
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Event Loop & Promises': '⚙️',
  'Closures & Scope':      '🔒',
  "'this' Binding":        '👉',
  'Hoisting':              '🚀',
  'Type Coercion':         '🔀',
}

const DIFF_COLORS: Record<string, { color: string; border: string; bg: string }> = {
  easy:   { color: '#6af7c0', border: 'rgba(106,247,192,0.3)', bg: 'rgba(106,247,192,0.08)' },
  medium: { color: '#f7c76a', border: 'rgba(247,199,106,0.3)', bg: 'rgba(247,199,106,0.08)' },
  hard:   { color: '#f76a6a', border: 'rgba(247,106,106,0.3)', bg: 'rgba(247,106,106,0.08)' },
}

function slugify(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const faqItems = [
  {
    question: 'What are JavaScript output questions?',
    answer: 'Output questions show a snippet and ask you to predict console.log output. They test scope, closures, the event loop, type coercion, hoisting, and this binding.',
  },
  {
    question: 'Why do interviewers ask output prediction questions?',
    answer: 'They cannot be guessed — you must mentally execute the code. This reveals genuine understanding vs surface knowledge.',
  },
  {
    question: 'How should I practice JavaScript output questions?',
    answer: 'Cover the output, read the code, write your prediction, then reveal. Understand why you were wrong before moving on.',
  },
]

// ─── Shared style objects (reused across many elements) ───────────────────────

const C = {
  bg:      '#0a0a10',
  card:    '#111118',
  surface: '#16161f',
  border:  'rgba(255,255,255,0.07)',
  muted:   'rgba(255,255,255,0.4)',
  text:    '#c8c8d8',
  accent:  '#7c6af7',
  accent2: '#f7c76a',
  accent3: '#6af7c0',
  danger:  '#f76a6a',
}

export default function JavaScriptOutputQuestionsPage() {
  const byCategory = CATEGORIES.map(cat => ({
    cat,
    questions: allQuestions.filter(q => q.cat === cat),
  }))

  

  const orderedAll = byCategory.flatMap(({ questions }) => questions)
  const totalCount = orderedAll.length

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'JavaScript Output Questions', path: '/javascript-output-questions' },
      ])}} />

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.25rem', color: C.text, fontFamily: 'system-ui, sans-serif' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ fontSize: '0.8125rem', color: C.muted, marginBottom: '2rem' }}>
          <Link href="/" style={{ color: C.accent, textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span>JavaScript Output Questions</span>
        </nav>

        {/* ── Hero ── */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.8125rem', fontWeight: 700, color: C.accent2,
            background: `${C.accent2}1a`, border: `1px solid ${C.accent2}33`,
            padding: '0.25rem 0.75rem', borderRadius: '9999px', marginBottom: '1rem',
          }}>
            ⚡ Predict the Output
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '1rem' }}>
            JavaScript Output Questions<br />
            <span style={{ color: C.accent2 }}>What Does This Code Print?</span>
          </h1>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '44rem' }}>
            {totalCount}+ real <strong>JavaScript output prediction questions</strong> used in frontend interviews.
            See code, predict{' '}
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.4em', borderRadius: '0.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9em' }}>console.log</code>
            {' '}output, learn the why.
            Covers closures, event loop, hoisting,{' '}
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.4em', borderRadius: '0.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9em' }}>this</code>
            {' '}binding, and type coercion.
          </p>

          <p style={{ fontSize: '0.9375rem', color: C.muted, marginBottom: '1.5rem' }}>
            ✅ {totalCount} questions &nbsp;·&nbsp;
            ✅ {CATEGORIES.length} topic areas &nbsp;·&nbsp;
            ✅ Full explanations &nbsp;·&nbsp;
            ✅ Progress tracked in quiz
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <HeroCTA />
            <a href="#questions" style={{
              display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem',
              border: '1px solid rgba(255,255,255,0.12)', color: 'white',
              borderRadius: '0.875rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem',
            }}>
              Browse Questions ↓
            </a>
          </div>
        </header>

        {/* ── How to use ── */}
        <section style={{ background: C.card, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>💡 How to use this page</h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            This page lists all questions for reference. To get the full benefit —
            predicting output <em>before</em> you see it with progress tracking — use the{' '}
            <Link href="/output-quiz" style={{ color: C.accent }}>interactive Output Quiz</Link>.
            Practicing prediction is what builds the mental model. Reading answers is not the same thing.
          </p>
        </section>

        {/* ── Table of Contents ── */}
        <nav style={{ background: C.card, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>📋 Topics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {byCategory.map(({ cat, questions }) => (
              <a key={cat} href={`#${slugify(cat)}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.625rem 0.875rem',
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                borderRadius: '0.625rem', textDecoration: 'none', color: C.text, fontSize: '0.875rem',
              }}>
                <span>{CATEGORY_EMOJI[cat]}</span>
                <span style={{ flex: 1 }}>{cat}</span>
                <span style={{
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '9999px',
                }}>{questions.length}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* ── Questions by category ── */}
        <div id="questions" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {byCategory.map(({ cat, questions }) => (
            <section key={cat} id={slugify(cat)}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: '1.5rem' }}>{CATEGORY_EMOJI[cat]}</span>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', margin: 0 }}>{cat}</h2>
                  <p style={{ fontSize: '0.8125rem', color: C.muted, margin: 0 }}>{questions.length} questions</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {questions.map((q) => {                    
                  const globalIdx  = orderedAll.indexOf(q)
                  const showAnswer = globalIdx < FREE_PREVIEW_COUNT
                  const diff       = DIFF_LABEL[q.difficulty] ?? q.difficulty
                  const dc         = DIFF_COLORS[q.difficulty] ?? DIFF_COLORS.medium

                  return (
                    <article
                      key={q.id}
                      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '1rem', overflow: 'hidden' }}
                      itemScope itemType="https://schema.org/Question"
                    >
                      {/* Card header */}
                      <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontFamily: 'monospace', fontSize: '0.625rem', fontWeight: 700,
                            color: C.accent2, background: `${C.accent2}1a`, border: `1px solid ${C.accent2}33`,
                            padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                          }}>
                            #{String(globalIdx + 1).padStart(2, '0')}
                          </span>
                          <span style={{
                            fontSize: '0.625rem', fontWeight: 700,
                            color: dc.color, background: dc.bg, border: `1px solid ${dc.border}`,
                            padding: '0.125rem 0.5rem', borderRadius: '9999px',
                          }}>
                            {diff}
                          </span>
                          {q.tags?.slice(0, 2).map(tag => (
                            <span key={tag} style={{
                              fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)',
                              background: 'rgba(255,255,255,0.04)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem',
                            }}>{tag}</span>
                          ))}
                        </div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', margin: 0 }} itemProp="name">
                          {q.title}
                        </h3>
                      </div>

                      {/* Code */}
                      <div style={{ padding: '1rem 1.25rem' }}>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                          Code
                        </p>
                        <pre style={{
                          background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                          borderRadius: '0.625rem', padding: '1rem', fontSize: '0.8125rem',
                          fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0',
                          overflow: 'auto', margin: 0, lineHeight: 1.7,
                        }}><code>{q.code}</code></pre>
                      </div>

                      {/* Answer */}
                      {showAnswer ? (
                        <div
                          style={{ padding: '0 1.25rem 1.25rem' }}
                          itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                        >
                          <details>
                            <summary style={{
                              cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700,
                              color: C.accent3, userSelect: 'none', listStyle: 'none',
                              display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0',
                            }}>
                              ▶ Show Output &amp; Explanation
                            </summary>
                            <div itemProp="text">
                              <div style={{ marginTop: '0.75rem', background: `${C.accent3}0d`, border: `1px solid ${C.accent3}33`, borderRadius: '0.625rem', padding: '0.875rem' }}>
                                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: C.accent3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Output</p>
                                <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: C.accent3, margin: 0, whiteSpace: 'pre-wrap' }}>{q.answer}</pre>
                              </div>
                              <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: '0.625rem', padding: '0.875rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent, marginBottom: '0.375rem' }}>💡 Explanation</p>
                                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{q.explanation}</p>
                              </div>
                              {q.keyInsight && (
                                <div style={{ marginTop: '0.625rem', background: `${C.accent2}08`, border: `1px solid ${C.accent2}25`, borderRadius: '0.625rem', padding: '0.75rem' }}>
                                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent2, marginBottom: '0.25rem' }}>⚡ Key Insight</p>
                                  <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{q.keyInsight}</p>
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      ) : (
                        <div style={{ padding: '0.75rem 1.25rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderTop: `1px solid ${C.border}` }}>
                          <p style={{ fontSize: '0.8125rem', color: C.muted, margin: 0, flex: 1, minWidth: '200px' }}>
                            Practice this interactively in the quiz — predict the output before revealing it.
                            That&apos;s how you actually learn it.
                          </p>
                          <Link href="/output-quiz" style={{
                            display: 'inline-flex', alignItems: 'center', fontSize: '0.8125rem', fontWeight: 700,
                            color: C.accent2, background: `${C.accent2}12`, border: `1px solid ${C.accent2}33`,
                            padding: '0.375rem 0.875rem', borderRadius: '0.5rem', textDecoration: 'none', whiteSpace: 'nowrap',
                          }}>
                            Open Interactive Quiz →
                          </Link>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <section style={{
          marginTop: '3rem', textAlign: 'center', padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(124,106,247,0.08), rgba(247,199,106,0.06))',
          border: '1px solid rgba(124,106,247,0.15)', borderRadius: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>Practice These Interactively</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', maxWidth: '32rem', marginInline: 'auto' }}>
            The Output Quiz makes you predict before revealing. Progress is tracked.
            Far more effective than reading answers.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/output-quiz" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem',
              background: C.accent2, color: '#0a0a10', borderRadius: '0.875rem',
              fontWeight: 800, textDecoration: 'none', fontSize: '0.9375rem',
            }}>
              ⚡ Open Output Quiz
            </Link>
            <Link href="/debug-lab" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem',
              border: `1px solid rgba(247,106,106,0.3)`, color: C.danger,
              borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem',
            }}>
              🐛 Also try: Debug Lab →
            </Link>
          </div>
        </section>

        {/* ── Related ── */}
        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Related Resources</h2>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9375rem', lineHeight: 2 }}>
            <li><Link href="/javascript-tricky-questions" style={{ color: C.accent }}>JavaScript Tricky Questions — [] == false, null == undefined explained</Link></li>
            <li><Link href="/javascript-interview-questions" style={{ color: C.accent }}>150+ JavaScript Interview Questions with Answers</Link></li>
            <li><Link href="/javascript-interview-cheatsheet" style={{ color: C.accent }}>JavaScript Interview Cheat Sheet (Printable)</Link></li>
          </ul>
        </section>

        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.border}`, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          © 2026 {SITE.name} · {SITE.domain}
        </footer>
      </div>
    </>
  )
}
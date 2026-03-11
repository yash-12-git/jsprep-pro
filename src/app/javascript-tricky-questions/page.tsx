/**
 * /javascript-tricky-questions — server component.
 *
 * Pulls questions tagged isTricky=true from Firestore via cachedQueries.
 * To add more: Admin → Questions → edit any output question → toggle "🤯 Mark as Tricky".
 *
 * IMPORTANT: Uses only inline style={{}} — Emotion css={} prop does NOT work in RSCs.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta, faqSchema, breadcrumbSchema, KEYWORDS, SITE } from '@/lib/seo/seo'
import { getQuestions } from '@/lib/cachedQueries'
import type { Question } from '@/types/question'
import HeroCTA from './HeroCta'

export const revalidate = 3600

export const metadata: Metadata = pageMeta({
  title: 'JavaScript Tricky Questions: Coercion, Equality & "Wat" Moments (2025)',
  description: 'The most confusing JavaScript questions explained: [] == false, null == undefined, typeof null, NaN !== NaN. Understand the rules behind the quirks — asked in real interviews.',
  path: '/javascript-tricky-questions',
  keywords: [
    'javascript tricky questions',
    'javascript weird behavior',
    'javascript type coercion questions',
    'javascript equality quirks',
    'javascript wat moments',
    'javascript null undefined equality',
    'javascript array coercion',
    'javascript interview tricky',
    'javascript typeof null',
    'javascript NaN comparison',
    ...KEYWORDS.secondary,
  ],
})

const C = {
  bg:      '#0a0a10',
  card:    '#111118',
  border:  'rgba(255,255,255,0.07)',
  muted:   'rgba(255,255,255,0.4)',
  text:    '#c8c8d8',
  accent:  '#7c6af7',
  accent2: '#f7c76a',
  accent3: '#6af7c0',
  danger:  '#f76a6a',
  purple:  '#a78bfa',
}

function catToId(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function TrickyCard({ q }: { q: Question }) {
  return (
    <article
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '1rem', overflow: 'hidden' }}
      itemScope itemType="https://schema.org/Question"
    >
      {/* Header */}
      <div style={{
        padding: '1.125rem 1.25rem 0.875rem',
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      }}>
        <span style={{ fontSize: '1.25rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>🤔</span>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', margin: 0 }} itemProp="name">
          {q.title}
        </h3>
      </div>

      {/* Code */}
      {q.code && (
        <div style={{ padding: '1rem 1.25rem' }}>
          <pre style={{
            background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
            borderRadius: '0.625rem', padding: '1rem', fontSize: '0.8125rem',
            fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0',
            overflow: 'auto', margin: 0, lineHeight: 1.7,
          }}><code>{q.code}</code></pre>
        </div>
      )}

      {/* Answer */}
      <div
        style={{ padding: '0 1.25rem 1.25rem' }}
        itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
      >
        {/* Key insight — always visible */}
        {(q.keyInsight || q.expectedOutput) && (
          <div style={{
            background: `${C.danger}0d`, border: `1px solid ${C.danger}33`,
            borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '0.75rem',
          }}>
            {q.expectedOutput && (
              <>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: C.danger, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Output
                </p>
                <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: C.danger, margin: '0 0 0.75rem', whiteSpace: 'pre-wrap' }}>
                  {q.expectedOutput}
                </pre>
              </>
            )}
            {q.keyInsight && (
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'white', margin: 0 }} itemProp="text">
                {q.keyInsight}
              </p>
            )}
          </div>
        )}

        {/* Full explanation in <details> */}
        {q.explanation && (
          <details>
            <summary style={{
              cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700,
              color: C.purple, userSelect: 'none', listStyle: 'none',
              display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0',
            }}>
              ▶ Full explanation &amp; the rule
            </summary>
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: '0.625rem', padding: '0.875rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent, marginBottom: '0.375rem' }}>💡 Why this happens</p>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{q.explanation}</p>
              </div>
            </div>
          </details>
        )}
      </div>
    </article>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)',
      borderRadius: '1rem', padding: '2.5rem', textAlign: 'center', margin: '2rem 0',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        No tricky questions tagged yet.
      </p>
      <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0 }}>
        Go to{' '}
        <Link href="/admin/questions" style={{ color: '#7c6af7' }}>Admin → Questions</Link>
        {' '}→ edit any output question → toggle{' '}
        <strong>🤯 Mark as Tricky</strong>.
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JavaScriptTrickyQuestionsPage() {
  const { questions } = await getQuestions({
    filters: { isTricky: true, status: 'published' },
    pageSize: 200,
    orderByField: 'order',
    orderDir: 'asc',
  })

  const categories = [...new Set(questions.map(q => q.category))].sort()

  const faqItems = questions.slice(0, 8).map(q => ({
    question: q.title,
    answer: q.keyInsight ?? q.explanation ?? '',
  }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'JavaScript Tricky Questions', path: '/javascript-tricky-questions' },
      ])}} />

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.25rem', color: C.text, fontFamily: 'system-ui, sans-serif' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ fontSize: '0.8125rem', color: C.muted, marginBottom: '2rem' }}>
          <Link href="/" style={{ color: C.accent, textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span>JavaScript Tricky Questions</span>
        </nav>

        {/* ── Hero ── */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.8125rem', fontWeight: 700, color: C.danger,
            background: `${C.danger}1a`, border: `1px solid ${C.danger}33`,
            padding: '0.25rem 0.75rem', borderRadius: '9999px', marginBottom: '1rem',
          }}>
            🤯 JavaScript &quot;Wat?&quot; Moments
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '1rem' }}>
            JavaScript Tricky Questions<br />
            <span style={{ color: C.danger }}>The Rules Behind the Quirks</span>
          </h1>

          <p style={{ fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '44rem' }}>
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.4em', borderRadius: '0.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9em' }}>[] == false</code>,{' '}
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.4em', borderRadius: '0.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9em' }}>null == undefined</code>,{' '}
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.4em', borderRadius: '0.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9em' }}>typeof null === &quot;object&quot;</code>,{' '}
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.4em', borderRadius: '0.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9em' }}>NaN !== NaN</code>.{' '}
            These aren&apos;t bugs — they&apos;re rules. Learn the rules and they stop being surprising.
          </p>

          <p style={{ fontSize: '0.9375rem', color: C.muted, marginBottom: '1.5rem' }}>
            ✅ {questions.length} tricky questions &nbsp;·&nbsp;
            ✅ Full explanations &nbsp;·&nbsp;
            ✅ Commonly asked in interviews
          </p>

          <HeroCTA />
        </header>

        {/* ── Why these matter ── */}
        <section style={{ background: C.card, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>🎯 Why Interviewers Love These Questions</h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            These aren&apos;t gotcha questions for their own sake. They test whether you understand
            JavaScript&apos;s type system at a fundamental level — the Abstract Equality Comparison algorithm,
            how coercion fires, how the event loop orders execution. A developer who can&apos;t explain{' '}
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1em 0.4em', borderRadius: '0.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9em' }}>[] == false</code>
            {' '}probably also writes coercion bugs in production.
          </p>
        </section>

        {/* ── Category TOC ── */}
        {categories.length > 0 && (
          <nav style={{ background: C.card, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.875rem' }}>📋 Categories</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map(cat => {
                const count = questions.filter(q => q.category === cat).length
                return (
                  <a
                    key={cat}
                    href={`#${catToId(cat)}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      fontSize: '0.8125rem', fontWeight: 700, color: C.danger,
                      background: `${C.danger}12`, border: `1px solid ${C.danger}33`,
                      padding: '0.3125rem 0.75rem', borderRadius: '9999px', textDecoration: 'none',
                    }}
                  >
                    {cat} <span style={{ opacity: 0.6, fontWeight: 400 }}>({count})</span>
                  </a>
                )
              })}
            </div>
          </nav>
        )}

        {/* ── Questions ── */}
        {questions.length === 0
          ? <EmptyState />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {categories.map(cat => {
                const catQs = questions.filter(q => q.category === cat)
                return (
                  <section key={cat} id={catToId(cat)}>
                    <h2 style={{
                      fontSize: '1.125rem', fontWeight: 900, color: 'white', marginBottom: '1.25rem',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      paddingBottom: '0.75rem', borderBottom: `1px solid ${C.border}`,
                    }}>
                      <span style={{ display: 'inline-block', width: '3px', height: '1.125rem', background: C.danger, borderRadius: '2px', flexShrink: 0 }} />
                      {cat}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {catQs.map(q => <TrickyCard key={q.id} q={q} />)}
                    </div>
                  </section>
                )
              })}
            </div>
          )
        }

        {/* ── CTA ── */}
        {questions.length > 0 && (
          <section style={{
            marginTop: '3rem', textAlign: 'center', padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(247,106,106,0.08), rgba(124,106,247,0.08))',
            border: '1px solid rgba(247,106,106,0.15)', borderRadius: '1.5rem',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>Test Your Knowledge Interactively</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', maxWidth: '32rem', marginInline: 'auto' }}>
              Reading explanations is one thing. Predicting output before you see it is how you internalize these rules.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/output-quiz" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem',
                background: C.danger, color: 'white', borderRadius: '0.875rem',
                fontWeight: 800, textDecoration: 'none', fontSize: '0.9375rem',
              }}>
                ⚡ Practice Output Quiz
              </Link>
              <Link href="/javascript-output-questions" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem',
                border: `1px solid rgba(247,199,106,0.3)`, color: C.accent2,
                borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem',
              }}>
                📋 All Output Questions →
              </Link>
            </div>
          </section>
        )}

        {/* ── Related ── */}
        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Related Resources</h2>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9375rem', lineHeight: 2 }}>
            <li><Link href="/javascript-output-questions" style={{ color: C.accent }}>JavaScript Output Questions — Predict the console.log</Link></li>
            <li><Link href="/javascript-interview-questions" style={{ color: C.accent }}>150+ JavaScript Interview Questions with Answers</Link></li>
            <li><Link href="/javascript-interview-cheatsheet" style={{ color: C.accent }}>JavaScript Interview Cheat Sheet</Link></li>
            <li><Link href="/debug-lab" style={{ color: C.accent }}>JavaScript Debug Lab — Fix Real Bugs</Link></li>
          </ul>
        </section>

        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.border}`, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          © 2026 {SITE.name} · {SITE.domain}
        </footer>
      </div>
    </>
  )
}
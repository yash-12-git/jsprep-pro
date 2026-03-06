import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { pageMeta, faqSchema, breadcrumbSchema, catToSlug, SITE } from '@/lib/seo/seo'
import { questions, CATEGORIES } from '@/data/questions'

interface Props { params: { slug: string } }

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function findBySlug(slug: string) {
  return questions.find(q => toSlug(q.q) === slug) ?? null
}

const DIFF_META: Record<string, { label: string; color: string; bg: string }> = {
  core:   { label: 'Core',     color: '#6af7c0', bg: 'rgba(106,247,192,0.1)' },
  mid:    { label: 'Mid-Level', color: '#f7c76a', bg: 'rgba(247,199,106,0.1)' },
  adv:    { label: 'Advanced', color: '#f76a6a', bg: 'rgba(247,106,106,0.1)' },
}

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return questions.map(q => ({ slug: toSlug(q.q) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = findBySlug(params.slug)
  if (!q) return {}

  const diff = q.tags.includes('adv') ? 'Advanced' : q.tags.includes('mid') ? 'Mid-Level' : 'Core'

  return pageMeta({
    title: `${q.q} — JavaScript Interview Question`,
    description: `${diff} JavaScript interview question: ${q.q} — Detailed answer with code examples, common mistakes, and interview tips. Part of the ${q.cat} category.`,
    path: `/q/${params.slug}`,
    keywords: [
      q.q.toLowerCase(),
      `${q.cat.toLowerCase()} javascript interview`,
      `javascript interview ${q.cat.toLowerCase()}`,
      'javascript interview question',
      `${params.slug.replace(/-/g, ' ')}`,
    ],
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuestionPage({ params }: Props) {
  const question = findBySlug(params.slug)
  if (!question) notFound()

  const diff = question.tags.includes('adv') ? 'adv' : question.tags.includes('mid') ? 'mid' : 'core'
  const dm = DIFF_META[diff]
  const catSlug = catToSlug(question.cat)

  // Related questions: same category, excluding current
  const related = questions
    .filter(q => q.cat === question.cat && q.id !== question.id)
    .slice(0, 4)

  // All categories for bottom nav
  const allCats = CATEGORIES.slice(0, 6)

  const jsonLd = faqSchema([{
    question: question.q,
    answer: question.answer.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 500),
  }])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'JS Interview Questions', path: '/javascript-interview-questions' },
        { name: question.cat, path: `/questions/${catSlug}` },
        { name: question.q.slice(0, 40) + '…', path: `/q/${params.slug}` },
      ])}} />

      <div style={{ maxWidth: '50rem', margin: '0 auto', padding: '2.5rem 1.25rem 5rem', color: '#c8c8d8' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#7c6af7', textDecoration: 'none' }}>JSPrep Pro</Link>
          <span>›</span>
          <Link href="/javascript-interview-questions" style={{ color: '#7c6af7', textDecoration: 'none' }}>Interview Questions</Link>
          <span>›</span>
          <Link href={`/questions/${catSlug}`} style={{ color: '#7c6af7', textDecoration: 'none' }}>{question.cat}</Link>
          <span>›</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{question.q.slice(0, 45)}…</span>
        </nav>

        {/* ── Question header ── */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.06em',
              textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20,
              background: dm.bg, color: dm.color,
              border: `1px solid ${dm.color}33`,
            }}>
              {dm.label}
            </span>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, color: '#7c6af7',
              background: 'rgba(124,106,247,0.1)', padding: '3px 10px',
              borderRadius: 20, border: '1px solid rgba(124,106,247,0.2)',
            }}>
              {question.cat}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
              JavaScript Interview Question
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.375rem, 3.5vw, 2rem)',
            fontWeight: 900, color: 'white',
            lineHeight: 1.3, marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            {question.q}
          </h1>

          {question.hint && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
              padding: '0.875rem 1rem',
              background: 'rgba(247,199,106,0.07)',
              border: '1px solid rgba(247,199,106,0.2)',
              borderRadius: '0.875rem',
            }}>
              <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0, marginTop: 1 }}>💡</span>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f7c76a', marginBottom: '0.25rem' }}>
                  Hint
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
                  {question.hint}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* ── Answer ── */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 3, height: 18, borderRadius: 2, background: '#7c6af7', display: 'inline-block' }} />
            Full Answer
          </h2>

          <div
            className="answer-body"
            dangerouslySetInnerHTML={{ __html: question.answer }}
            style={{ lineHeight: 1.75, fontSize: '0.9375rem' }}
          />
        </section>

        {/* ── Interview tips CTA ── */}
        <section style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(124,106,247,0.12), rgba(106,247,192,0.06))',
          border: '1px solid rgba(124,106,247,0.25)',
          borderRadius: '1.25rem',
          marginBottom: '3rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
                Can you explain this out loud?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.65 }}>
                Reading the answer isn't enough. Real interviews test whether you can explain it clearly under pressure.
                Practice with AI feedback — get scored on accuracy, depth, and clarity.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
              <Link href="/auth" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.625rem 1.25rem',
                background: '#7c6af7', color: 'white',
                borderRadius: '0.75rem', fontWeight: 800,
                textDecoration: 'none', fontSize: '0.875rem',
                whiteSpace: 'nowrap',
              }}>
                Practice Free →
              </Link>
              <Link href={`/questions/${catSlug}`} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.5rem 1.25rem',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem', fontWeight: 700,
                textDecoration: 'none', fontSize: '0.8125rem',
                whiteSpace: 'nowrap',
              }}>
                More {question.cat} Questions
              </Link>
            </div>
          </div>
        </section>

        {/* ── Related questions ── */}
        {related.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'white', marginBottom: '0.875rem' }}>
              More {question.cat} Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {related.map(r => {
                const rd = r.tags.includes('adv') ? 'adv' : r.tags.includes('mid') ? 'mid' : 'core'
                const rdm = DIFF_META[rd]
                return (
                  <Link
                    key={r.id}
                    href={`/q/${toSlug(r.q)}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      background: '#0e0e16',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{
                      fontSize: '0.625rem', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '2px 7px', borderRadius: 12,
                      background: rdm.bg, color: rdm.color,
                      flexShrink: 0,
                    }}>
                      {rdm.label}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', flex: 1 }}>
                      {r.q}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', flexShrink: 0 }}>→</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Browse by category ── */}
        <section>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '0.875rem' }}>
            Browse by Category
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={`/questions/${catToSlug(cat)}`}
                style={{
                  padding: '0.4rem 0.875rem',
                  background: cat === question.cat ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${cat === question.cat ? 'rgba(124,106,247,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  color: cat === question.cat ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* Answer body styles */}
      <style>{`
        .answer-body p { color: rgba(255,255,255,0.75); margin-bottom: 1rem; }
        .answer-body strong { color: white; }
        .answer-body pre {
          background: #0d0d14;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.875rem;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.25rem 0;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        .answer-body code {
          font-family: 'Fira Code', 'Cascadia Code', monospace;
          color: #a5f3fc;
        }
        .answer-body pre code { color: #c8c8d8; }
        .answer-body .tip {
          background: rgba(124,106,247,0.08);
          border-left: 3px solid #7c6af7;
          padding: 0.875rem 1rem;
          border-radius: 0 0.75rem 0.75rem 0;
          margin: 1.25rem 0;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.7);
        }
        .answer-body ul, .answer-body ol {
          padding-left: 1.5rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 1rem;
          line-height: 1.8;
        }
        .answer-body h3 { color: white; font-size: 1rem; margin: 1.5rem 0 0.5rem; }
      `}</style>
    </>
  )
}
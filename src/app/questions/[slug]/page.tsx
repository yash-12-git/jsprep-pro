import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { pageMeta, faqSchema, breadcrumbSchema, CATEGORY_SLUGS, catToSlug, SITE } from '@/lib/seo/seo'
import { questions, CATEGORIES } from '@/data/questions'

interface Props {
  params: { slug: string }
}

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return CATEGORIES.map(cat => ({ slug: catToSlug(cat) }))
}

// ─── Metadata factory ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORY_SLUGS[params.slug]
  if (!cat) return {}

  const catQuestions = questions.filter(q => q.cat === cat)
  const count = catQuestions.length

  return pageMeta({
    title: `${cat} JavaScript Interview Questions (${count} Questions With Answers)`,
    description: `${count} ${cat} interview questions with detailed answers and code examples. Master ${cat} concepts for your JavaScript frontend interview in 2025.`,
    path: `/questions/${params.slug}`,
    keywords: [
      `${cat.toLowerCase()} javascript interview`,
      `${cat.toLowerCase()} interview questions`,
      `javascript ${cat.toLowerCase()} concepts`,
    ],
  })
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function CategoryQuestionsPage({ params }: Props) {
  const cat = CATEGORY_SLUGS[params.slug]
  if (!cat) notFound()

  const catQuestions = questions.filter(q => q.cat === cat)
  const allCats = CATEGORIES.map(c => ({ cat: c, slug: catToSlug(c) }))

  const faqItems = catQuestions.map(q => ({
    question: q.q,
    answer: q.answer.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 300),
  }))

  const difficultyBadge = (tags: string[]) => {
    if (tags.includes('adv')) return { label: 'Advanced', color: '#f7c76a' }
    if (tags.includes('mid')) return { label: 'Mid-level', color: '#7c6af7' }
    return { label: 'Core', color: '#6af7c0' }
  }

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'JavaScript Interview Questions', path: '/javascript-interview-questions' },
        { name: `${cat} Questions`, path: `/questions/${params.slug}` },
      ])}} />

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.25rem', color: '#c8c8d8' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#7c6af7', textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.375rem' }}>›</span>
          <Link href="/javascript-interview-questions" style={{ color: '#7c6af7', textDecoration: 'none' }}>JS Interview Questions</Link>
          <span style={{ margin: '0 0.375rem' }}>›</span>
          <span>{cat}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.625rem' }}>
            JavaScript · {cat}
          </div>
          <h1 style={{ fontSize: 'clamp(1.625rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '0.875rem' }}>
            {cat} Interview Questions
            <br />
            <span style={{ color: '#7c6af7' }}>With Answers & Code Examples</span>
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, maxWidth: '42rem', marginBottom: '1.5rem' }}>
            {catQuestions.length} carefully curated <strong style={{ color: 'white' }}>{cat} interview questions</strong> covering everything from fundamentals to advanced concepts. Each answer includes working code examples and common interview gotchas.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Link href="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: '#7c6af7', color: 'white', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
              Practice Interactively →
            </Link>
            <Link href="/javascript-interview-questions" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← All Categories
            </Link>
          </div>
        </header>

        {/* Quick stats bar */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem 1.25rem', background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', marginBottom: '2.5rem', fontSize: '0.8125rem' }}>
          <span><strong style={{ color: 'white' }}>{catQuestions.length}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>questions</span></span>
          <span><strong style={{ color: '#6af7c0' }}>{catQuestions.filter(q => q.tags.includes('core')).length}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>core</span></span>
          <span><strong style={{ color: '#7c6af7' }}>{catQuestions.filter(q => q.tags.includes('mid')).length}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>mid-level</span></span>
          <span><strong style={{ color: '#f7c76a' }}>{catQuestions.filter(q => q.tags.includes('adv')).length}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>advanced</span></span>
        </div>

        {/* Questions */}
        <main>
          {catQuestions.map((q, i) => {
            const diff = difficultyBadge(q.tags)
            return (
              <article key={q.id} itemScope itemType="https://schema.org/Question"
                style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: i < catQuestions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.06em', background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.25)', color: '#7c6af7', padding: '0.125rem 0.5rem', borderRadius: '0.3125rem' }}>
                    Q{i + 1}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, background: diff.color + '15', border: `1px solid ${diff.color}30`, color: diff.color, padding: '0.125rem 0.5rem', borderRadius: '0.3125rem' }}>
                    {diff.label}
                  </span>
                </div>

                <h2 itemProp="name" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.4 }}>
                  {q.q}
                </h2>

                {q.hint && (
                  <div style={{ fontSize: '0.8125rem', color: '#6af7c0', background: 'rgba(106,247,192,0.06)', border: '1px solid rgba(106,247,192,0.15)', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', marginBottom: '1rem' }}>
                    💡 <strong>Hint:</strong> {q.hint}
                  </div>
                )}

                <div itemProp="suggestedAnswer" itemScope itemType="https://schema.org/Answer">
                  <div
                    itemProp="text"
                    className="answer-body"
                    dangerouslySetInnerHTML={{ __html: q.answer }}
                  />
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link href="/auth" style={{ fontSize: '0.75rem', color: '#7c6af7', border: '1px solid rgba(124,106,247,0.3)', padding: '0.3125rem 0.875rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 700 }}>
                    Practice this question →
                  </Link>
                  <Link href="/auth" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3125rem 0.875rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
                    Test with AI Evaluator
                  </Link>
                </div>
              </article>
            )
          })}
        </main>

        {/* Other categories */}
        <section style={{ marginTop: '1rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Other JavaScript Interview Topics
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {allCats.filter(c => c.cat !== cat).map(({ cat: c, slug }) => (
              <Link
                key={slug}
                href={`/questions/${slug}`}
                style={{ fontSize: '0.8125rem', color: '#7c6af7', border: '1px solid rgba(124,106,247,0.25)', padding: '0.375rem 0.875rem', borderRadius: '0.5rem', textDecoration: 'none', background: 'rgba(124,106,247,0.06)' }}
              >
                {c} →
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'white', marginBottom: '0.625rem' }}>
            Ready to practice {cat}?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            Get AI feedback on your answers, predict code output, and fix real bugs.
          </p>
          <Link href="/auth" style={{ display: 'inline-flex', padding: '0.75rem 1.75rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none' }}>
            Start Free Practice →
          </Link>
        </section>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .answer-body p { margin: 0 0 0.75rem; line-height: 1.8; font-size: 0.9375rem; }
        .answer-body pre { background: #0a0a14; border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid #7c6af7; border-radius: 0.625rem; padding: 0.875rem 1rem; overflow-x: auto; margin: 0.875rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; line-height: 1.7; color: #e2e8f0; }
        .answer-body code { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }
        .answer-body p > code, .answer-body li > code { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); padding: 0.125rem 0.35rem; border-radius: 0.25rem; color: #6af7c0; font-size: 0.8em; }
        .answer-body ul, .answer-body ol { padding-left: 1.5rem; margin: 0 0 0.875rem; }
        .answer-body li { margin-bottom: 0.375rem; line-height: 1.75; }
        .answer-body strong { color: white; }
        .answer-body .tip { background: rgba(124,106,247,0.08); border-left: 3px solid #7c6af7; border-radius: 0 0.5rem 0.5rem 0; padding: 0.5rem 0.875rem; margin: 0.75rem 0; font-size: 0.875rem; }
      `}} />
    </>
  )
}
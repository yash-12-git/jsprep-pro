import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta, faqSchema, breadcrumbSchema, catToSlug, KEYWORDS, SITE } from '@/lib/seo/seo'
import { questions, CATEGORIES } from '@/data/questions'

// ─── Static metadata (server component) ──────────────────────────────────────

export const metadata: Metadata = pageMeta({
  title: '150+ JavaScript Interview Questions With Answers (2026)',
  description: 'The most complete list of JavaScript interview questions with detailed answers, code examples, and explanations. Covers closures, event loop, promises, async/await, prototypes, and more.',
  path: '/javascript-interview-questions',
  keywords: [
    'javascript interview questions 2026',
    'js interview questions and answers',
    'javascript interview questions for experienced',
    'top javascript interview questions',
    'advanced javascript interview questions',
    ...KEYWORDS.secondary,
  ],
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 300)
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function JavaScriptInterviewQuestionsPage() {
  const questionsByCategory = CATEGORIES.map(cat => ({
    cat,
    slug: catToSlug(cat),
    questions: questions.filter(q => q.cat === cat),
  }))

  const faqItems = questions.slice(0, 20).map(q => ({
    question: q.q,
    answer: stripHtml(q.answer),
  }))

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'JavaScript Interview Questions', path: '/javascript-interview-questions' },
        ])}}
      />

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.25rem', color: '#c8c8d8', fontFamily: 'system-ui, sans-serif' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#7c6af7', textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span>JavaScript Interview Questions</span>
        </nav>

        {/* ── Hero ── */}
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '1rem' }}>
            150+ JavaScript Interview Questions<br />
            <span style={{ color: '#7c6af7' }}>With Answers & Code Examples</span>
          </h1>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '44rem' }}>
            The most comprehensive collection of <strong style={{ color: 'white' }}>JavaScript interview questions</strong> for
            frontend developers in 2025. Covers everything from basic JS concepts to advanced topics like
            the event loop, closures, promises, prototypes, and modern ES2023+ features.
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.5rem' }}>
            ✅ {questions.length} questions &nbsp;·&nbsp;
            ✅ {CATEGORIES.length} categories &nbsp;·&nbsp;
            ✅ Code examples in every answer &nbsp;·&nbsp;
            ✅ Updated 2025
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Link
              href="/auth"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9375rem' }}
            >
              Practice All Questions Free →
            </Link>
            <a
              href="#questions"
              style={{ display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: '0.875rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}
            >
              Browse Questions ↓
            </a>
          </div>
        </header>

        {/* ── Table of Contents ── */}
        <section style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            📋 Table of Contents
          </h2>
          <ol style={{ paddingLeft: '1.25rem', columns: 2, columnGap: '2rem', fontSize: '0.875rem' }}>
            {questionsByCategory.map(({ cat, slug, questions: qs }) => (
              <li key={cat} style={{ marginBottom: '0.5rem', breakInside: 'avoid' }}>
                <a href={`#${slug}`} style={{ color: '#7c6af7', textDecoration: 'none' }}>
                  {cat}
                </a>
                <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '0.375rem', fontSize: '0.75rem' }}>
                  ({qs.length})
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Intro paragraph for SEO ── */}
        <section style={{ marginBottom: '3rem', lineHeight: 1.85, fontSize: '0.9375rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.875rem' }}>
            How to Use This Guide
          </h2>
          <p style={{ marginBottom: '0.875rem' }}>
            This guide covers the most frequently asked <strong style={{ color: 'white' }}>JavaScript interview questions</strong>{' '}
            across all experience levels — from junior developers with 0–1 years of experience to senior engineers.
            Each answer includes a clear explanation, working code examples, and common gotchas that interviewers
            specifically test for.
          </p>
          <p style={{ marginBottom: '0.875rem' }}>
            The questions are organized by topic so you can focus on your weak areas first. We recommend using
            the{' '}
            <Link href="/dashboard" style={{ color: '#7c6af7' }}>interactive practice platform</Link>{' '}
            to test yourself rather than just reading — active recall improves retention by up to 50%.
          </p>
          <p>
            For each concept, we also have{' '}
            <Link href="/output-quiz" style={{ color: '#7c6af7' }}>output prediction challenges</Link>{' '}
            (predict what a code snippet logs) and a{' '}
            <Link href="/debug-lab" style={{ color: '#7c6af7' }}>debug lab</Link>{' '}
            where you fix real buggy code — the closest thing to an actual interview.
          </p>
        </section>

        {/* ── Questions by Category ── */}
        <main id="questions">
          {questionsByCategory.map(({ cat, slug, questions: catQs }) => (
            <section key={cat} id={slug} style={{ marginBottom: '4rem' }}>

              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>
                  {cat} Interview Questions
                </h2>
                <Link
                  href={`/questions/${slug}`}
                  style={{ fontSize: '0.8125rem', color: '#7c6af7', textDecoration: 'none', fontWeight: 700 }}
                >
                  Practice {cat} questions →
                </Link>
              </div>

              {/* Questions */}
              {catQs.map((q, i) => (
                <article key={q.id} style={{ marginBottom: '2.5rem' }} itemScope itemType="https://schema.org/Question">

                  <h3
                    itemProp="name"
                    style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: 1.4 }}
                    id={`q-${q.id}`}
                  >
                    <span style={{ color: '#7c6af7', marginRight: '0.5rem', fontSize: '0.875rem' }}>Q{q.id + 1}.</span>
                    {q.q}
                  </h3>

                  {q.hint && (
                    <p style={{ fontSize: '0.8125rem', color: '#6af7c0', background: 'rgba(106,247,192,0.06)', border: '1px solid rgba(106,247,192,0.15)', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', marginBottom: '0.875rem' }}>
                      💡 Hint: {q.hint}
                    </p>
                  )}

                  <div
                    itemProp="suggestedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <div
                      itemProp="text"
                      dangerouslySetInnerHTML={{ __html: q.answer }}
                      style={{ lineHeight: 1.8, fontSize: '0.9375rem' }}
                    />
                  </div>

                  <div style={{ marginTop: '0.875rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link
                      href="/auth"
                      style={{ fontSize: '0.75rem', color: '#7c6af7', border: '1px solid rgba(124,106,247,0.3)', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 700 }}
                    >
                      Practice this question →
                    </Link>
                    {i === catQs.length - 1 && (
                      <Link
                        href={`/questions/${slug}`}
                        style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}
                      >
                        More {cat} questions →
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </main>

        {/* ── Platform CTA ── */}
        <section style={{ background: 'linear-gradient(135deg, rgba(124,106,247,0.15), rgba(106,247,192,0.08))', border: '1px solid rgba(124,106,247,0.3)', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>
            Don't Just Read — Practice
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', maxWidth: '36rem', margin: '0 auto 1.5rem' }}>
            Reading answers is passive. JSPrep Pro makes you actively recall answers,
            predict code output, fix real bugs, and get evaluated by AI — just like an actual interview.
          </p>
          <Link
            href="/auth"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none', fontSize: '1rem' }}
          >
            Start Practicing Free — No Card Needed
          </Link>
        </section>

        {/* ── Related resources ── */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Related Resources
          </h2>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9375rem', lineHeight: 2 }}>
            <li><Link href="/javascript-interview-cheatsheet" style={{ color: '#7c6af7' }}>JavaScript Interview Cheat Sheet (Printable PDF)</Link></li>
            <li><Link href="/questions/core-js" style={{ color: '#7c6af7' }}>Core JavaScript Questions</Link></li>
            <li><Link href="/questions/async-js" style={{ color: '#7c6af7' }}>Async JavaScript Questions (Promises, async/await)</Link></li>
            <li><Link href="/output-quiz" style={{ color: '#7c6af7' }}>JavaScript Output Prediction Quiz</Link></li>
            <li><Link href="/debug-lab" style={{ color: '#7c6af7' }}>JavaScript Debug Lab</Link></li>
            <li><Link href="/blog/event-loop-explained" style={{ color: '#7c6af7' }}>JavaScript Event Loop Explained Visually</Link></li>
          </ul>
        </section>

        {/* ── Footer note ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          <p>
            © 2025 JSPrep Pro · Last updated January 2025 ·{' '}
            <Link href="/" style={{ color: 'rgba(124,106,247,0.7)' }}>Home</Link> ·{' '}
            <Link href="/dashboard" style={{ color: 'rgba(124,106,247,0.7)' }}>Practice Platform</Link>
          </p>
        </footer>
      </div>

      {/* Inline CSS for answer HTML content */}
      <style dangerouslySetInnerHTML={{ __html: `
        #questions p { margin: 0 0 0.75rem; }
        #questions pre {
          background: #0a0a14;
          border: 1px solid rgba(255,255,255,0.1);
          border-left: 3px solid #7c6af7;
          border-radius: 0.625rem;
          padding: 0.875rem 1rem;
          overflow-x: auto;
          margin: 0.75rem 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          line-height: 1.7;
          color: #e2e8f0;
        }
        #questions code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
        }
        #questions p > code, #questions li > code {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.125rem 0.35rem;
          border-radius: 0.25rem;
          color: #6af7c0;
          font-size: 0.8em;
        }
        #questions ul, #questions ol { padding-left: 1.5rem; margin: 0 0 0.875rem; }
        #questions li { margin-bottom: 0.375rem; line-height: 1.7; }
        #questions strong { color: white; }
        #questions .tip {
          background: rgba(124,106,247,0.1);
          border-left: 3px solid #7c6af7;
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 0.5rem 0.875rem;
          margin: 0.75rem 0;
          font-size: 0.875rem;
          color: #c8c8d8;
        }
      `}} />
    </>
  )
}
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

import { questions } from '@/data/questions'
import { TOPICS, getTopicBySlug, getRelatedTopics } from '@/data/seo/topics'
import { pageMeta, faqSchema, breadcrumbSchema, SITE } from '@/lib/seo/seo'

interface Props {
  params: { topic: string }
}

// ─── Static generation ────────────────────────────────────────────────────

export function generateStaticParams() {
  return TOPICS.map(t => ({ topic: t.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getTopicBySlug(params.topic)
  if (!topic) return {}

  return pageMeta({
    title: `${topic.title} (${topic.questionCount} Questions) | JSPrep Pro`,
    description: `${topic.description} Covers ${topic.cheatSheet.slice(0, 2).join('. ')}. Practice with AI feedback.`,
    path: `/${topic.slug}`,
    keywords: [
      `${topic.keyword} interview questions`,
      `javascript ${topic.keyword} questions`,
      `${topic.keyword} javascript interview`,
      ...(topic.extraKeywords ?? []),
    ],
  })
}

// ─── Difficulty colour map ────────────────────────────────────────────────

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ade80' },
  Intermediate: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' },
  Advanced:     { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
  Senior:       { bg: 'rgba(248, 113, 113, 0.15)', color: '#f87171' },
}

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  core: { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' },
  mid:  { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa' },
  adv:  { bg: 'rgba(251, 146, 60, 0.15)',  color: '#fb923c' },
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function TopicPage({ params }: Props) {
  const topic = getTopicBySlug(params.topic)
  if (!topic) notFound()

  // Filter questions: exact category match OR keyword/extraKeyword in question text
  const allKeywords = [topic.keyword, ...(topic.extraKeywords ?? [])]
  const related = questions.filter(q => {
    const catMatch = q.cat.toLowerCase() === topic.category.toLowerCase()
    const textMatch = allKeywords.some(kw =>
      q.q.toLowerCase().includes(kw.toLowerCase()) ||
      q.answer.toLowerCase().includes(kw.toLowerCase())
    )
    return catMatch || textMatch
  })

  if (!related.length) notFound()

  const relatedTopics = getRelatedTopics(topic)
  const diff = DIFF_STYLE[topic.difficulty]

  const faq = faqSchema(related.map(q => ({
    question: q.q,
    answer: q.answer.replace(/<[^>]*>?/gm, '').slice(0, 500),
  })))

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Topics', path: '/topics' },
    { name: topic.title, path: `/${topic.slug}` },
  ])

  return (
    <>
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faq }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />

      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '32px 24px 80px',
        color: '#c8c8d8',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 28, fontSize: 13, color: '#6b7280' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/topics" style={{ color: '#6b7280', textDecoration: 'none' }}>Topics</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#a78bfa' }}>{topic.title}</span>
        </nav>

        {/* ── Header ── */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: diff.bg,
              color: diff.color,
            }}>
              {topic.difficulty}
            </span>
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              {topic.questionCount} questions typically asked
            </span>
          </div>

          <h1 style={{
            color: '#f1f0ff',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 14,
            letterSpacing: '-0.02em',
          }}>
            {topic.title}
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#a0a0b8', maxWidth: 680 }}>
            {topic.description}
          </p>
        </header>

        {/* ── Interview Cheat Sheet ── */}
        <div style={{
          background: 'rgba(124, 106, 247, 0.08)',
          border: '1px solid rgba(124, 106, 247, 0.25)',
          borderRadius: 14,
          padding: '24px 28px',
          marginBottom: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <h2 style={{ color: '#c4b5fd', fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Interview Cheat Sheet
            </h2>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topic.cheatSheet.map((point, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.6 }}>
                <span style={{ color: '#7c6af7', flexShrink: 0, marginTop: 1 }}>✦</span>
                <span style={{ color: '#d4d0e8' }}>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Interview Tips ── */}
        <div style={{
          background: 'rgba(251, 191, 36, 0.06)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 44,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <h2 style={{ color: '#fcd34d', fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              How to Answer in an Interview
            </h2>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topic.interviewTips.map((tip, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.65, color: '#c8b87a' }}>
                <span style={{ color: '#fbbf24', flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Questions ── */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
            <h2 style={{ color: '#f1f0ff', fontSize: 22, fontWeight: 700, margin: 0 }}>
              Questions & Answers
            </h2>
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              {related.length} question{related.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {related.map((q, i) => {
              const tagStyle = TAG_STYLE[q.tags[0]] ?? TAG_STYLE.core
              return (
                <article
                  key={q.id}
                  id={`q${i + 1}`}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: 32,
                  }}
                >
                  {/* Question header */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                    <span style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(124, 106, 247, 0.18)',
                      color: '#a78bfa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      marginTop: 2,
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                        <h3 style={{
                          color: '#e8e6f8',
                          fontSize: 17,
                          fontWeight: 700,
                          margin: 0,
                          lineHeight: 1.4,
                        }}>
                          {q.q}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '2px 9px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase',
                          background: tagStyle.bg,
                          color: tagStyle.color,
                        }}>
                          {q.tags[0] === 'core' ? 'Foundational' : q.tags[0] === 'mid' ? 'Mid Level' : 'Advanced'}
                        </span>
                        {q.hint && (
                          <span style={{
                            padding: '2px 9px',
                            borderRadius: 12,
                            fontSize: 11,
                            color: '#6b7280',
                            background: 'rgba(255,255,255,0.04)',
                          }}>
                            💡 {q.hint}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  <div
                    style={{ paddingLeft: 40 }}
                    className="answer-body"
                    dangerouslySetInnerHTML={{ __html: q.answer }}
                  />
                </article>
              )
            })}
          </div>
        </div>

        {/* ── Related Topics ── */}
        {relatedTopics.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ color: '#f1f0ff', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              Related Topics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {relatedTopics.map(t => {
                const d = DIFF_STYLE[t.difficulty]
                return (
                  <Link
                    key={t.slug}
                    href={`/${t.slug}`}
                    style={{
                      display: 'block',
                      padding: '16px 20px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ color: '#e8e6f8', fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{t.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: d.color, fontWeight: 600 }}>{t.difficulty}</span>
                      <span style={{ color: '#4b5563', fontSize: 10 }}>·</span>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{t.questionCount} Qs</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(124, 106, 247, 0.12) 0%, rgba(96, 165, 250, 0.08) 100%)',
          border: '1px solid rgba(124, 106, 247, 0.3)',
          borderRadius: 16,
          padding: '36px 32px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
          <h3 style={{ color: '#f1f0ff', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>
            Can you answer these under pressure?
          </h3>
          <p style={{ color: '#9090a8', fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            Reading answers is not the same as knowing them. Practice saying them out loud
            with AI feedback — that's what builds real interview confidence.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/auth"
              style={{
                padding: '12px 28px',
                background: '#7c6af7',
                color: 'white',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-block',
              }}
            >
              Practice Free →
            </Link>
            <Link
              href="/output-quiz"
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.06)',
                color: '#c4b5fd',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 15,
                border: '1px solid rgba(124, 106, 247, 0.3)',
                display: 'inline-block',
              }}
            >
              Try Output Quiz
            </Link>
          </div>
        </section>

      </div>

      {/* ── Answer body styles ── */}
      <style>{`
        .answer-body p { margin: 0 0 12px; line-height: 1.75; font-size: 15px; color: #b0aec8; }
        .answer-body pre { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px 20px; overflow-x: auto; margin: 14px 0; }
        .answer-body code { font-family: 'Fira Code', 'Cascadia Code', monospace; font-size: 13px; color: #e2e0f0; }
        .answer-body p code { background: rgba(124,106,247,0.15); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #c4b5fd; }
        .answer-body ul, .answer-body ol { padding-left: 24px; margin: 0 0 14px; }
        .answer-body li { margin-bottom: 6px; font-size: 15px; line-height: 1.7; color: #b0aec8; }
        .answer-body strong { color: #e8e6f8; font-weight: 700; }
        .answer-body h3, .answer-body h4 { color: #e8e6f8; margin: 20px 0 8px; font-size: 15px; }
        .answer-body .tip { background: rgba(124,106,247,0.1); border-left: 3px solid #7c6af7; padding: 10px 14px; border-radius: 0 8px 8px 0; margin: 14px 0; font-size: 14px; color: #c4b5fd; line-height: 1.65; }
        .answer-body table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 14px 0; }
        .answer-body th { text-align: left; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.12); color: #a78bfa; font-weight: 700; }
        .answer-body td { padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #b0aec8; }
        @media (max-width: 600px) {
          .answer-body pre { padding: 14px; font-size: 12px; }
          .answer-body p { font-size: 14px; }
        }
      `}</style>
    </>
  )
}
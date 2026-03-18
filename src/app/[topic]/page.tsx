import { notFound } from 'next/navigation'
import { getBlogPostsForTopic, getQuestions, getRelatedTopics, getTopicBySlug, getTopicSlugs } from '@/lib/cachedQueries'
import type { Metadata } from 'next'
import Link from 'next/link'

import { pageMeta, faqSchema, breadcrumbSchema } from '@/lib/seo/seo'
import { getTopicFaqs } from '@/data/seo/topicFaqs'
import TopicQuestionList from './TopicQuestionList'
import { TOPIC_DIFF_BG, TOPIC_DIFF_COLOR } from '@/styles/tokens'

export const revalidate = 3600

interface Props { params: { topic: string } }

export async function generateStaticParams() {
  try {
    const slugs = await getTopicSlugs()
    return slugs.map(topic => ({ topic }))
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await getTopicBySlug(params.topic)
  if (!topic) return {}
  const hasConceptHub = !!(topic.mentalModel || topic.deepDive)
  return pageMeta({
    title: hasConceptHub
      ? `${topic.title} — Explained Interview Questions`
      : `${topic.title}`,
    description: hasConceptHub
      ? `${(topic.mentalModel ?? topic.description).slice(0, 120)} — with code examples, common mistakes, and ${topic.questionCount} practice interview questions.`
      : `${topic.description} Covers ${topic.cheatSheet.slice(0, 2).join('. ')}. Practice with AI feedback.`,
    path: `/${topic.slug}`,
    keywords: [
      `${topic.keyword} javascript`,
      `how does ${topic.keyword} work`,
      `${topic.keyword} explained`,
      `${topic.keyword} interview questions`,
      `javascript ${topic.keyword} questions`,
      ...(topic.extraKeywords ?? []),
    ],
  })
}


function Anchor({ id }: { id: string }) {
  return <div id={id} style={{ marginTop: -80, paddingTop: 80 }} />
}

export default async function TopicPage({ params }: Props) {
  const topic = await getTopicBySlug(params.topic)
  if (!topic) notFound()

  // Only show questions explicitly tagged to this topic via topicSlug.
  // No category fallback — that pulls in unrelated questions from the same broad category.
  // Tag questions to topics in /admin/questions by setting the "Topic Page" field.
  // Filter by topicSlug in Firestore — avoids fetching all 200 questions and filtering in JS.
  // Requires composite index: status ASC + topicSlug ASC + order ASC (already in required indexes list)
  const { questions } = await getQuestions({
    filters: { status: 'published', topicSlug: topic.slug },
    pageSize: 50,
    orderByField: 'order',
    orderDir: 'asc',
  })

  const [relatedTopics, relatedPosts] = await Promise.all([
    getRelatedTopics(topic.related ?? []),
    getBlogPostsForTopic(topic.slug),
  ])

  const diffColor = TOPIC_DIFF_COLOR[topic.difficulty] ?? TOPIC_DIFF_COLOR["Intermediate"]
  const diffBg = TOPIC_DIFF_BG[topic.difficulty] ?? TOPIC_DIFF_BG["Intermediate"]
  const hasConceptHub = !!(topic.mentalModel || topic.deepDive)

  const dedicatedFaqs = getTopicFaqs(topic.slug)
  const faqItems = dedicatedFaqs.length > 0
    ? dedicatedFaqs
    : questions.slice(0, 8).map(q => ({
        question: q.title,
        answer: (q.answer ?? '').replace(/<[^>]*>?/gm, '').slice(0, 400),
      }))
  const faq = faqSchema(faqItems)
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home',   path: '/' },
    { name: 'Topics', path: '/topics' },
    { name: topic.title, path: `/${topic.slug}` },
  ])

  const tocItems = [
    hasConceptHub && topic.mentalModel       && { id: 'concept',         label: 'The Mental Model' },
    hasConceptHub && topic.deepDive          && { id: 'explanation',     label: 'Deep Explanation' },
    topic.misconceptions?.length             && { id: 'misconceptions',  label: 'Common Mistakes' },
    topic.realWorldExamples?.length          && { id: 'real-world',      label: 'Real-World Usage' },
                                                { id: 'cheatsheet',     label: 'Cheat Sheet' },
                                                { id: 'interview-tips', label: 'Interview Tips' },
    relatedPosts.length                      && { id: 'articles',        label: 'Deep Dives' },
                                                { id: 'questions',      label: questions.length > 0 ? `${questions.length} Questions` : 'Questions' },
    relatedTopics.length                     && { id: 'related',         label: 'Related Topics' },
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <>
      {/* {faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faq }}
        />
      )} */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px 100px', color: '#c8c8d8', fontFamily: "'DM Sans',system-ui,sans-serif" }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 28, fontSize: 13, color: '#6b7280' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/topics" style={{ color: '#6b7280', textDecoration: 'none' }}>Topics</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#a78bfa' }}>{topic.title}</span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: diffBg, color: diffColor }}>
              {topic.difficulty}
            </span>
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </span>
            {hasConceptHub && (
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'rgba(106,247,192,0.1)', color: '#6af7c0', border: '1px solid rgba(106,247,192,0.2)' }}>
                Full Guide
              </span>
            )}
          </div>
          <h1 style={{ color: '#f1f0ff', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.02em' }}>
            {topic.title}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#a0a0b8', maxWidth: 680 }}>{topic.description}</p>
        </header>

        {/* Table of Contents */}
        {tocItems.length > 3 && (
          <nav style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: 12 }}>On this page</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
              {tocItems.map((item, i) => (
                <a key={item.id} href={`#${item.id}`} style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none' }}>
                  <span style={{ color: '#4b5563', fontSize: 11, marginRight: 4 }}>{i + 1}.</span>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* ━━━━━ CONCEPT HUB LAYER ━━━━━ */}

        {topic.mentalModel && (
          <section style={{ marginBottom: 40 }}>
            <Anchor id="concept" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#6af7c0', display: 'inline-block', flexShrink: 0 }} />
              <h2 style={{ color: '#f1f0ff', fontSize: 18, fontWeight: 700, margin: 0 }}>The Mental Model</h2>
            </div>
            <div style={{ background: 'rgba(106,247,192,0.05)', border: '1px solid rgba(106,247,192,0.18)', borderRadius: 14, padding: '24px 28px' }}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: '#d4f5e8', margin: 0, fontStyle: 'italic' }}>
                {topic.mentalModel}
              </p>
            </div>
          </section>
        )}

        {topic.deepDive && (
          <section style={{ marginBottom: 40 }}>
            <Anchor id="explanation" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#7c6af7', display: 'inline-block', flexShrink: 0 }} />
              <h2 style={{ color: '#f1f0ff', fontSize: 18, fontWeight: 700, margin: 0 }}>The Explanation</h2>
            </div>
            <div className="concept-body" dangerouslySetInnerHTML={{ __html: topic.deepDive }} />
          </section>
        )}

        {topic.misconceptions && topic.misconceptions.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <Anchor id="misconceptions" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#f87171', display: 'inline-block', flexShrink: 0 }} />
              <h2 style={{ color: '#f1f0ff', fontSize: 18, fontWeight: 700, margin: 0 }}>Common Misconceptions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topic.misconceptions.map((item, i) => (
                <div key={i} style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.18)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14 }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#f5c6c6', margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {topic.realWorldExamples && topic.realWorldExamples.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <Anchor id="real-world" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ width: 3, height: 20, borderRadius: 2, background: '#60a5fa', display: 'inline-block', flexShrink: 0 }} />
              <h2 style={{ color: '#f1f0ff', fontSize: 18, fontWeight: 700, margin: 0 }}>Where You'll See This in Real Code</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topic.realWorldExamples.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: 10 }}>
                  <span style={{ color: '#60a5fa', flexShrink: 0, fontWeight: 700, fontSize: 13, marginTop: 2 }}>→</span>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#b8d4f8', margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ━━━━━ INTERVIEW PREP LAYER ━━━━━ */}

        <section style={{ marginBottom: 28 }}>
          <Anchor id="cheatsheet" />
          <div style={{ background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.25)', borderRadius: 14, padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <h2 style={{ color: '#c4b5fd', fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Interview Cheat Sheet</h2>
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
        </section>

        <section style={{ marginBottom: relatedPosts.length ? 32 : 44 }}>
          <Anchor id="interview-tips" />
          <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <h2 style={{ color: '#fcd34d', fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>How to Answer in an Interview</h2>
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
        </section>

        {relatedPosts.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <Anchor id="articles" />
            <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 14, padding: '18px 22px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.07em' }}>📖 Deep Dive Articles</div>
              {relatedPosts.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, textDecoration: 'none', padding: '8px 0', borderBottom: i < relatedPosts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontSize: 14, color: '#d4d0e8', fontWeight: 600 }}>{post.title}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>{post.readTime}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 60 }}>
          <Anchor id="questions" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
            <h2 style={{ color: '#f1f0ff', fontSize: 22, fontWeight: 700, margin: 0 }}>Practice Questions</h2>
            {questions.length > 0 && (
              <span style={{ color: '#6b7280', fontSize: 13 }}>{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          <TopicQuestionList questions={questions} topicSlug={topic.slug} />
        </section>

        {relatedTopics.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <Anchor id="related" />
            <h2 style={{ color: '#f1f0ff', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Related Topics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
              {relatedTopics.map(t => {
                const d = TOPIC_DIFF_COLOR[t.difficulty] ?? TOPIC_DIFF_COLOR["Intermediate"]
                return (
                  <Link key={t.slug} href={`/${t.slug}`} style={{ display: 'block', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, textDecoration: 'none' }}>
                    <div style={{ color: '#e8e6f8', fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{t.title}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: d, fontWeight: 600 }}>{t.difficulty}</span>
                      <span style={{ color: '#4b5563', fontSize: 10 }}>·</span>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{t.questionCount} Qs</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <section style={{ background: 'linear-gradient(135deg,rgba(124,106,247,0.12) 0%,rgba(96,165,250,0.08) 100%)', border: '1px solid rgba(124,106,247,0.3)', borderRadius: 16, padding: '36px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
          <h3 style={{ color: '#f1f0ff', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Can you answer these under pressure?</h3>
          <p style={{ color: '#9090a8', fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            Reading answers is not the same as knowing them. Practice saying them out loud with AI feedback — that's what builds real interview confidence.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth" style={{ padding: '12px 28px', background: '#7c6af7', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>Practice Free →</Link>
            <Link href="/output-quiz" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', color: '#c4b5fd', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15, border: '1px solid rgba(124,106,247,0.3)' }}>Try Output Quiz</Link>
          </div>
        </section>

      </div>

      <style>{`
        .answer-body p { margin: 0 0 12px; line-height: 1.75; font-size: 15px; color: #b0aec8; }
        .answer-body pre { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px 20px; overflow-x: auto; margin: 14px 0; }
        .answer-body code { font-family: 'Fira Code','Cascadia Code',monospace; font-size: 13px; color: #e2e0f0; }
        .answer-body p code { background: rgba(124,106,247,0.15); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #c4b5fd; }
        .answer-body ul,.answer-body ol { padding-left: 24px; margin: 0 0 14px; }
        .answer-body li { margin-bottom: 6px; font-size: 15px; line-height: 1.7; color: #b0aec8; }
        .answer-body strong { color: #e8e6f8; font-weight: 700; }
        .answer-body h3,.answer-body h4 { color: #e8e6f8; margin: 20px 0 8px; font-size: 15px; }
        .answer-body table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 14px 0; }
        .answer-body th { text-align: left; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.12); color: #a78bfa; font-weight: 700; }
        .answer-body td { padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #b0aec8; }

        .concept-body p { margin: 0 0 16px; line-height: 1.85; font-size: 16px; color: #b8b6d0; }
        .concept-body pre { background: #0d0c18; border: 1px solid rgba(124,106,247,0.2); border-left: 3px solid #7c6af7; border-radius: 10px; padding: 20px 24px; overflow-x: auto; margin: 20px 0; }
        .concept-body code { font-family: 'Fira Code','Cascadia Code',monospace; font-size: 13.5px; color: #e2e0f0; }
        .concept-body p code,.concept-body li code { background: rgba(124,106,247,0.15); padding: 2px 7px; border-radius: 4px; font-size: 13px; color: #c4b5fd; }
        .concept-body pre code { background: none; padding: 0; color: #c8c8d8; }
        .concept-body h3 { color: #f1f0ff; font-size: 17px; font-weight: 700; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .concept-body h4 { color: #e8e6f8; font-size: 15px; font-weight: 700; margin: 24px 0 8px; }
        .concept-body ul,.concept-body ol { padding-left: 24px; margin: 0 0 16px; }
        .concept-body li { margin-bottom: 8px; font-size: 15px; line-height: 1.75; color: #b8b6d0; }
        .concept-body strong { color: #f1f0ff; font-weight: 700; }
        .concept-body blockquote { border-left: 3px solid #7c6af7; margin: 20px 0; padding: 12px 20px; background: rgba(124,106,247,0.07); border-radius: 0 8px 8px 0; font-style: italic; color: #c4b5fd; }
      `}</style>
    </>
  )
}
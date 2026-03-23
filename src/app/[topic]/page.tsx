import { notFound } from "next/navigation";
import {
  getBlogPostsForTopic,
  getQuestions,
  getRelatedTopics,
  getTopicBySlug,
  getTopicSlugs,
} from "@/lib/cachedQueries";
import type { Metadata } from "next";
import Link from "next/link";

import { pageMeta, faqSchema, breadcrumbSchema } from "@/lib/seo/seo";
import { TOPIC_FAQS } from "@/data/seo/topicFaqs";
import TopicQuestionList from "./TopicQuestionList";
import { C, TOPIC_DIFF_BG, TOPIC_DIFF_COLOR } from "@/styles/tokens";

export const revalidate = 3600;

interface Props {
  params: { topic: string };
}

export async function generateStaticParams() {
  try {
    const slugs = await getTopicSlugs();
    return slugs.map((topic) => ({ topic }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await getTopicBySlug(params.topic);
  if (!topic) return {};
  const hasConceptHub = !!(topic.mentalModel || topic.deepDive);
  return pageMeta({
    title: `${topic.title}`,
    description: hasConceptHub
      ? `${(topic.mentalModel ?? topic.description).slice(0, 120)} — with code examples, common mistakes, and ${topic.questionCount} practice interview questions.`
      : `${topic.description} Covers ${topic.cheatSheet.slice(0, 2).join(". ")}. Practice with AI feedback.`,
    path: `/${topic.slug}`,
    keywords: [
      `${topic.keyword} javascript`,
      `how does ${topic.keyword} work`,
      `${topic.keyword} explained`,
      `${topic.keyword} interview questions`,
      `javascript ${topic.keyword} questions`,
      ...(topic.extraKeywords ?? []),
    ],
  });
}

function Anchor({ id }: { id: string }) {
  return <div id={id} style={{ marginTop: -80, paddingTop: 80 }} />;
}

// ─── Section heading with left rule ──────────────────────────────────────────
function SectionHeading({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
      }}
    >
      <span
        style={{
          width: 3,
          height: 20,
          borderRadius: 2,
          background: color,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          color: C.text,
          fontSize: 17,
          fontWeight: 600,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

export default async function TopicPage({ params }: Props) {
  const topic = await getTopicBySlug(params.topic);
  if (!topic) notFound();

  const { questions } = await getQuestions({
    filters: { status: "published", topicSlug: topic.slug },
    pageSize: 50,
    orderByField: "order",
    orderDir: "asc",
  });

  const [relatedTopics, relatedPosts] = await Promise.all([
    getRelatedTopics(topic.related ?? []),
    getBlogPostsForTopic(topic.slug),
  ]);

  const diffColor =
    TOPIC_DIFF_COLOR[topic.difficulty] ?? TOPIC_DIFF_COLOR["Intermediate"];
  const diffBg =
    TOPIC_DIFF_BG[topic.difficulty] ?? TOPIC_DIFF_BG["Intermediate"];
  const hasConceptHub = !!(topic.mentalModel || topic.deepDive);

  const dedicatedFaqs = TOPIC_FAQS[topic.slug] ?? [];
  const faqItems = dedicatedFaqs.length > 0 ? faqSchema(dedicatedFaqs) : null;

  const tocItems = [
    hasConceptHub &&
      topic.mentalModel && { id: "concept", label: "The Mental Model" },
    hasConceptHub &&
      topic.deepDive && { id: "explanation", label: "Deep Explanation" },
    topic.misconceptions?.length && {
      id: "misconceptions",
      label: "Common Mistakes",
    },
    topic.realWorldExamples?.length && {
      id: "real-world",
      label: "Real-World Usage",
    },
    { id: "cheatsheet", label: "Cheat Sheet" },
    { id: "interview-tips", label: "Interview Tips" },
    relatedPosts.length && { id: "articles", label: "Deep Dives" },
    {
      id: "questions",
      label:
        questions.length > 0 ? `${questions.length} Questions` : "Questions",
    },
    relatedTopics.length && { id: "related", label: "Related Topics" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div
      style={{
        backgroundColor: C.bg,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Topics", path: "/topics" },
            { name: topic.title, path: `/${topic.slug}` },
          ]),
        }}
      />
      {faqItems && (
        <script
          key="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqItems }}
        />
      )}

      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "32px 24px 100px",
          color: C.text,
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ marginBottom: 28, fontSize: 13, color: C.muted }}
        >
          <Link href="/" style={{ color: C.muted, textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px", color: C.borderStrong }}>›</span>
          <Link
            href="/topics"
            style={{ color: C.muted, textDecoration: "none" }}
          >
            Topics
          </Link>
          <span style={{ margin: "0 8px", color: C.borderStrong }}>›</span>
          <span style={{ color: C.text }}>{topic.title}</span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {/* Difficulty badge */}
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                background: diffBg,
                color: diffColor,
                border: `1px solid ${diffColor}30`,
              }}
            >
              {topic.difficulty}
            </span>
            <span style={{ color: C.muted, fontSize: 13 }}>
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </span>
            {hasConceptHub && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: C.greenSubtle,
                  color: C.green,
                  border: `1px solid ${C.greenBorder}`,
                }}
              >
                Full Guide
              </span>
            )}
          </div>

          <h1
            style={{
              color: C.text,
              fontSize: "clamp(1.6rem,4vw,2.4rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 14,
              letterSpacing: "-0.025em",
            }}
          >
            {topic.title}
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: C.muted,
              maxWidth: 680,
              margin: 0,
            }}
          >
            {topic.description}
          </p>
        </header>

        {/* Table of Contents */}
        {tocItems.length > 3 && (
          <nav
            style={{
              background: C.bgSubtle,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 44,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: C.muted,
                marginBottom: 10,
              }}
            >
              On this page
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
              {tocItems.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    fontSize: 13,
                    color: C.accent,
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      color: C.placeholder,
                      fontSize: 11,
                      marginRight: 4,
                    }}
                  >
                    {i + 1}.
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* ━━━━━ CONCEPT HUB ━━━━━ */}

        {topic.mentalModel && (
          <section style={{ marginBottom: 40 }}>
            <Anchor id="concept" />
            <SectionHeading color={C.green}>The Mental Model</SectionHeading>
            <div
              style={{
                background: C.greenSubtle,
                border: `1px solid ${C.greenBorder}`,
                borderRadius: 12,
                padding: "20px 24px",
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: C.text,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {topic.mentalModel}
              </p>
            </div>
          </section>
        )}

        {topic.deepDive && (
          <section style={{ marginBottom: 40 }}>
            <Anchor id="explanation" />
            <SectionHeading color={C.accent}>The Explanation</SectionHeading>
            <div
              className="concept-body"
              dangerouslySetInnerHTML={{ __html: topic.deepDive }}
            />
          </section>
        )}

        {topic.misconceptions && topic.misconceptions.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <Anchor id="misconceptions" />
            <SectionHeading color={C.red}>Common Misconceptions</SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topic.misconceptions.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: C.redSubtle,
                    border: `1px solid ${C.redBorder}`,
                    borderRadius: 10,
                    padding: "14px 18px",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    ⚠️
                  </span>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: C.text,
                      margin: 0,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {topic.realWorldExamples && topic.realWorldExamples.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <Anchor id="real-world" />
            <SectionHeading color={C.accent}>
              Where You'll See This in Real Code
            </SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topic.realWorldExamples.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: "11px 16px",
                    background: C.accentSubtle,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      color: C.accent,
                      flexShrink: 0,
                      fontWeight: 600,
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    →
                  </span>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: C.text,
                      margin: 0,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ━━━━━ INTERVIEW PREP ━━━━━ */}

        <section style={{ marginBottom: 28 }}>
          <Anchor id="cheatsheet" />
          <div
            style={{
              background: C.accentSubtle,
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${C.accent}`,
              borderRadius: 10,
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 18 }}>⚡</span>
              <h2
                style={{
                  color: C.accentText,
                  fontSize: 13,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Interview Cheat Sheet
              </h2>
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 9,
              }}
            >
              {topic.cheatSheet.map((point, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 14,
                    lineHeight: 1.65,
                  }}
                >
                  <span
                    style={{ color: C.accent, flexShrink: 0, marginTop: 1 }}
                  >
                    ✦
                  </span>
                  <span style={{ color: C.text }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: relatedPosts.length ? 32 : 44 }}>
          <Anchor id="interview-tips" />
          <div
            style={{
              background: C.amberSubtle,
              border: `1px solid ${C.amberBorder}`,
              borderLeft: `3px solid ${C.amber}`,
              borderRadius: 10,
              padding: "18px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 16 }}>💡</span>
              <h2
                style={{
                  color: C.amber,
                  fontSize: 13,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                How to Answer in an Interview
              </h2>
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {topic.interviewTips.map((tip, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: C.text,
                  }}
                >
                  <span
                    style={{
                      color: C.amber,
                      flexShrink: 0,
                      fontWeight: 700,
                      minWidth: "1rem",
                    }}
                  >
                    {i + 1}.
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <Anchor id="articles" />
            <div
              style={{
                background: C.bgSubtle,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                📖 Deep Dive Articles
              </div>
              {relatedPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    textDecoration: "none",
                    padding: "8px 0",
                    borderBottom:
                      i < relatedPosts.length - 1
                        ? `1px solid ${C.border}`
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: C.text,
                      fontWeight: 500,
                    }}
                  >
                    {post.title}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Practice questions */}
        <section style={{ marginBottom: 60 }}>
          <Anchor id="questions" />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <h2
              style={{
                color: C.text,
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Practice Questions
            </h2>
            {questions.length > 0 && (
              <span style={{ color: C.muted, fontSize: 13 }}>
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <TopicQuestionList questions={questions} topicSlug={topic.slug} />
        </section>

        {/* Related topics */}
        {relatedTopics.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <Anchor id="related" />
            <h2
              style={{
                color: C.text,
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Related Topics
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 10,
              }}
            >
              {relatedTopics.map((t) => {
                const d =
                  TOPIC_DIFF_COLOR[t.difficulty] ??
                  TOPIC_DIFF_COLOR["Intermediate"];
                return (
                  <Link
                    key={t.slug}
                    href={`/${t.slug}`}
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        color: C.text,
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: 1.4,
                        marginBottom: 6,
                      }}
                    >
                      {t.title}
                    </div>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      <span style={{ fontSize: 11, color: d, fontWeight: 500 }}>
                        {t.difficulty}
                      </span>
                      <span style={{ color: C.borderStrong, fontSize: 10 }}>
                        ·
                      </span>
                      <span style={{ fontSize: 11, color: C.muted }}>
                        {t.questionCount} Qs
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: "36px 32px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
          <h3
            style={{
              color: C.text,
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 10,
              letterSpacing: "-0.02em",
            }}
          >
            Can you answer these under pressure?
          </h3>
          <p
            style={{
              color: C.muted,
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 24,
              maxWidth: 480,
              margin: "0 auto 24px",
            }}
          >
            Reading answers is not the same as knowing them. Practice saying
            them out loud with AI feedback — that's what builds real interview
            confidence.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/auth"
              style={{
                padding: "11px 26px",
                background: C.accent,
                color: "#ffffff",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Practice Free →
            </Link>
            <Link
              href="/output-quiz"
              style={{
                padding: "11px 22px",
                background: C.bg,
                color: C.muted,
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 500,
                fontSize: 15,
                border: `1px solid ${C.border}`,
              }}
            >
              Try Output Quiz
            </Link>
          </div>
        </section>
      </div>

      {/* ─── Injected prose styles — light theme ─────────────────────────────── */}
      <style>{`
        /* Answer body (AI explanation prose) */
        .answer-body p {
          margin: 0 0 12px;
          line-height: 1.75;
          font-size: 15px;
          color: ${C.text};
        }
        .answer-body pre {
          background: ${C.codeBg};
          border: 1px solid ${C.border};
          border-radius: 8px;
          padding: 16px 18px;
          overflow-x: auto;
          margin: 14px 0;
        }
        .answer-body code {
          font-family: 'JetBrains Mono','Fira Code',monospace;
          font-size: 13px;
          color: ${C.codeText};
        }
        .answer-body p code {
          background: ${C.codeInlineBg};
          border: 1px solid ${C.border};
          padding: 2px 5px;
          border-radius: 4px;
          font-size: 12.5px;
          color: ${C.codeText};
        }
        .answer-body ul, .answer-body ol {
          padding-left: 22px;
          margin: 0 0 14px;
        }
        .answer-body li {
          margin-bottom: 6px;
          font-size: 15px;
          line-height: 1.7;
          color: ${C.text};
        }
        .answer-body strong {
          color: ${C.text};
          font-weight: 600;
        }
        .answer-body h3, .answer-body h4 {
          color: ${C.text};
          margin: 20px 0 8px;
          font-size: 15px;
          font-weight: 600;
        }
        .answer-body table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin: 14px 0;
        }
        .answer-body th {
          text-align: left;
          padding: 8px 12px;
          border-bottom: 1px solid ${C.border};
          color: ${C.text};
          font-weight: 600;
          background: ${C.bgSubtle};
        }
        .answer-body td {
          padding: 8px 12px;
          border-bottom: 1px solid ${C.border};
          color: ${C.muted};
        }

        /* Concept body (deep-dive explanation prose) */
        .concept-body p {
          margin: 0 0 16px;
          line-height: 1.85;
          font-size: 16px;
          color: ${C.text};
        }
        .concept-body pre {
          background: ${C.codeBg};
          border: 1px solid ${C.border};
          border-left: 3px solid ${C.accent};
          border-radius: 8px;
          padding: 18px 22px;
          overflow-x: auto;
          margin: 20px 0;
        }
        .concept-body code {
          font-family: 'JetBrains Mono','Fira Code',monospace;
          font-size: 13.5px;
          color: ${C.codeText};
        }
        .concept-body p code, .concept-body li code {
          background: ${C.codeInlineBg};
          border: 1px solid ${C.border};
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          color: ${C.codeText};
        }
        .concept-body pre code {
          background: none;
          border: none;
          padding: 0;
          color: ${C.codeText};
        }
        .concept-body h3 {
          color: ${C.text};
          font-size: 16px;
          font-weight: 600;
          margin: 28px 0 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid ${C.border};
          letter-spacing: -0.01em;
        }
        .concept-body h4 {
          color: ${C.text};
          font-size: 15px;
          font-weight: 600;
          margin: 22px 0 8px;
        }
        .concept-body ul, .concept-body ol {
          padding-left: 22px;
          margin: 0 0 16px;
        }
        .concept-body li {
          margin-bottom: 8px;
          font-size: 15px;
          line-height: 1.75;
          color: ${C.text};
        }
        .concept-body strong {
          color: ${C.text};
          font-weight: 600;
        }
        .concept-body blockquote {
          border-left: 3px solid ${C.accent};
          margin: 18px 0;
          padding: 10px 18px;
          background: ${C.accentSubtle};
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: ${C.accentText};
        }
      `}</style>
    </div>
  );
}

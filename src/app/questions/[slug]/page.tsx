import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuestions } from "@/lib/cachedQueries";
import Link from "next/link";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  catToSlug,
  SITE,
} from "@/lib/seo/seo";
import type { Question } from "@/types/question";
import InlineEvaluator from "@/components/ui/InlineEvaluater";
import { C, RADIUS } from "@/styles/tokens";

interface Props {
  params: { slug: string };
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const { questions } = await getQuestions({
    filters: { status: "published", type: "theory" },
    pageSize: 300,
  }).catch(() => ({ questions: [] }));
  const cats = [...new Set(questions.map((q: any) => q.category))];
  return cats.map((cat: string) => ({ slug: catToSlug(cat) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { questions: qs } = await getQuestions({
    filters: { status: "published", type: "theory" },
    pageSize: 300,
  }).catch(() => ({ questions: [] }));
  const cats = [...new Set(qs.map((q: any) => q.category))];
  const cat = cats.find((c: string) => catToSlug(c) === params.slug);
  if (!cat) return {};
  return pageMeta({
    title: `${cat} JavaScript Interview Questions (Questions With Answers)`,
    description: `${cat} interview questions with detailed answers and code examples. Master ${cat} concepts for your JavaScript frontend interview.`,
    path: `/questions/${params.slug}`,
    keywords: [
      `${cat.toLowerCase()} javascript interview`,
      `${cat.toLowerCase()} interview questions`,
    ],
  });
}

export default async function CategoryQuestionsPage({ params }: Props) {
  const { questions: allTheory } = await getQuestions({
    filters: { status: "published", type: "theory" },
    pageSize: 300,
  }).catch(() => ({ questions: [] }));

  const theoryCats = [...new Set(allTheory.map((q: any) => q.category))];
  const cat = theoryCats.find((c: string) => catToSlug(c) === params.slug);
  if (!cat) notFound();

  const catQuestions = allTheory.filter((q: any) => q.category === cat);
  const allCats = theoryCats.map((c: string) => ({
    cat: c,
    slug: catToSlug(c),
  }));

  const faqItems = catQuestions.map((q) => ({
    question: q.title,
    answer: (q.answer ?? "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300),
  }));

  // Semantic diff badge — uses C tokens
  const diffBadge = (difficulty: string) => {
    if (difficulty === "advanced" || difficulty === "expert")
      return {
        label: "Advanced",
        color: C.amber,
        bg: C.amberSubtle,
        border: C.amberBorder,
      };
    if (difficulty === "core")
      return {
        label: "Core",
        color: C.accent,
        bg: C.accentSubtle,
        border: C.border,
      };
    return {
      label: "Beginner",
      color: C.green,
      bg: C.greenSubtle,
      border: C.greenBorder,
    };
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: "JavaScript Interview Questions",
              path: "/javascript-interview-questions",
            },
            { name: `${cat} Questions`, path: `/questions/${params.slug}` },
          ]),
        }}
      />

      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem",
          color: C.text,
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: "0.8125rem",
            color: C.muted,
            marginBottom: "2rem",
          }}
        >
          <Link href="/" style={{ color: C.accent, textDecoration: "none" }}>
            JSPrep Pro
          </Link>
          <span style={{ margin: "0 0.375rem", color: C.borderStrong }}>›</span>
          <Link
            href="/javascript-interview-questions"
            style={{ color: C.accent, textDecoration: "none" }}
          >
            JS Interview Questions
          </Link>
          <span style={{ margin: "0 0.375rem", color: C.borderStrong }}>›</span>
          <span style={{ color: C.muted }}>{cat}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.accentText,
              marginBottom: "0.625rem",
            }}
          >
            JavaScript · {cat}
          </div>
          <h1
            style={{
              fontSize: "clamp(1.625rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.2,
              marginBottom: "0.875rem",
              letterSpacing: "-0.025em",
            }}
          >
            {cat} Interview Questions
            <br />
            <span style={{ color: C.accent }}>
              With Answers & Code Examples
            </span>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              maxWidth: "42rem",
              color: C.muted,
              marginBottom: "1.5rem",
            }}
          >
            {catQuestions.length} carefully curated{" "}
            <strong style={{ color: C.text }}>{cat} interview questions</strong>{" "}
            with working code examples and real interview gotchas.
          </p>
          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <Link
              href="/auth"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5625rem 1.125rem",
                background: C.accent,
                color: "#ffffff",
                borderRadius: "0.625rem",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Practice Interactively →
            </Link>
            <Link
              href="/javascript-interview-questions"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5625rem 1.125rem",
                border: `1px solid ${C.border}`,
                color: C.muted,
                borderRadius: "0.625rem",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              ← All Categories
            </Link>
          </div>
        </header>

        {/* Difficulty summary row */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            padding: "0.875rem 1.125rem",
            background: C.bgSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.75rem",
            marginBottom: "2.5rem",
            fontSize: "0.8125rem",
          }}
        >
          <span>
            <strong style={{ color: C.text }}>{catQuestions.length}</strong>{" "}
            <span style={{ color: C.muted }}>questions</span>
          </span>
          <span>
            <strong style={{ color: C.green }}>
              {catQuestions.filter((q) => q.difficulty === "beginner").length}
            </strong>{" "}
            <span style={{ color: C.muted }}>beginner</span>
          </span>
          <span>
            <strong style={{ color: C.accent }}>
              {catQuestions.filter((q) => q.difficulty === "core").length}
            </strong>{" "}
            <span style={{ color: C.muted }}>core</span>
          </span>
          <span>
            <strong style={{ color: C.amber }}>
              {
                catQuestions.filter(
                  (q: Question) =>
                    q.difficulty === "advanced" || q.difficulty === "expert",
                ).length
              }
            </strong>{" "}
            <span style={{ color: C.muted }}>advanced</span>
          </span>
        </div>

        {/* Questions */}
        <main>
          {catQuestions.map((q: Question, i: number) => {
            const diff = diffBadge(q.difficulty);
            const plainAnswer = (q.answer ?? "")
              .replace(/<[^>]*>/g, "")
              .replace(/\s+/g, " ")
              .trim();

            return (
              <article
                key={q.id}
                itemScope
                itemType="https://schema.org/Question"
                style={{
                  marginBottom: "3rem",
                  paddingBottom: "3rem",
                  borderBottom:
                    i < catQuestions.length - 1
                      ? `1px solid ${C.border}`
                      : "none",
                }}
              >
                {/* Badge row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    marginBottom: "0.875rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      background: C.accentSubtle,
                      border: `1px solid ${C.border}`,
                      color: C.accentText,
                      padding: "0.125rem 0.5rem",
                      borderRadius: "0.3125rem",
                    }}
                  >
                    Q{i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      background: diff.bg,
                      border: `1px solid ${diff.border}`,
                      color: diff.color,
                      padding: "0.125rem 0.5rem",
                      borderRadius: "0.3125rem",
                    }}
                  >
                    {diff.label}
                  </span>
                </div>

                <h2
                  itemProp="name"
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: "1rem",
                    lineHeight: 1.4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {q.title}
                </h2>

                {q.hint && (
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: C.green,
                      background: C.greenSubtle,
                      border: `1px solid ${C.greenBorder}`,
                      borderRadius: "0.5rem",
                      padding: "0.5rem 0.875rem",
                      marginBottom: "1rem",
                    }}
                  >
                    💡 <strong>Hint:</strong> {q.hint}
                  </div>
                )}

                <div
                  itemProp="suggestedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <div
                    itemProp="text"
                    className="answer-body"
                    dangerouslySetInnerHTML={{ __html: q.answer ?? "" }}
                  />
                </div>

                {/* Practice link */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href={`/q/${q.slug}`}
                    style={{
                      fontSize: "0.75rem",
                      color: C.accent,
                      border: `1px solid ${C.border}`,
                      padding: "0.3125rem 0.875rem",
                      borderRadius: "0.375rem",
                      textDecoration: "none",
                      fontWeight: 500,
                      background: C.accentSubtle,
                    }}
                  >
                    Practice this question →
                  </Link>
                </div>

                <InlineEvaluator
                  question={q.title}
                  idealAnswer={plainAnswer}
                  label="Evaluate with AI"
                />
              </article>
            );
          })}
        </main>

        {/* Related topics */}
        <section style={{ marginTop: "1rem", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.0625rem",
              fontWeight: 600,
              color: C.text,
              marginBottom: "1rem",
              letterSpacing: "-0.01em",
              paddingBottom: "0.75rem",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            Other JavaScript Interview Topics
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {allCats
              .filter((c) => c.cat !== cat)
              .map(({ cat: c, slug }) => (
                <Link
                  key={slug}
                  href={`/questions/${slug}`}
                  style={{
                    fontSize: "0.8125rem",
                    color: C.accent,
                    border: `1px solid ${C.border}`,
                    padding: "0.375rem 0.875rem",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    background: C.accentSubtle,
                  }}
                >
                  {c} →
                </Link>
              ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "2rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.625rem",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to practice {cat}?
          </h2>
          <p
            style={{
              color: C.muted,
              marginBottom: "1.25rem",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
            }}
          >
            Get AI feedback on your answers, predict code output, and fix real
            bugs.
          </p>
          <Link
            href="/auth"
            style={{
              display: "inline-flex",
              padding: "0.625rem 1.625rem",
              background: C.accent,
              color: "#ffffff",
              borderRadius: "0.625rem",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.9375rem",
            }}
          >
            Start Free Practice →
          </Link>
        </section>
      </div>

      {/* ─── Answer body prose — light theme ─────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .answer-body p {
          margin: 0 0 0.75rem;
          line-height: 1.8;
          font-size: 0.9375rem;
          color: ${C.text};
        }
        .answer-body pre {
          background: ${C.codeBg};
          border: 1px solid ${C.border};
          border-left: 3px solid ${C.accent};
          border-radius: 0.625rem;
          padding: 0.875rem 1rem;
          overflow-x: auto;
          margin: 0.875rem 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          line-height: 1.7;
          color: ${C.codeText};
        }
        .answer-body code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
        }
        .answer-body p > code,
        .answer-body li > code {
          background: ${C.codeInlineBg};
          border: 1px solid ${C.border};
          padding: 0.125rem 0.35rem;
          border-radius: 0.25rem;
          color: ${C.codeText};
          font-size: 0.8em;
        }
        .answer-body ul, .answer-body ol {
          padding-left: 1.5rem;
          margin: 0 0 0.875rem;
        }
        .answer-body li {
          margin-bottom: 0.375rem;
          line-height: 1.75;
          color: ${C.text};
        }
        .answer-body strong {
          color: ${C.text};
          font-weight: 600;
        }
        .answer-body .tip {
          background: ${C.accentSubtle};
          border-left: 3px solid ${C.accent};
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 0.5rem 0.875rem;
          margin: 0.75rem 0;
          font-size: 0.875rem;
          color: ${C.accentText};
        }
      `,
        }}
      />
    </>
  );
}

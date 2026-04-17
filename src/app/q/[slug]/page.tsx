import type { Metadata } from "next";
import { DIFF_STYLE, DIFF_LABEL } from "@/styles/tokens";
import { notFound } from "next/navigation";
import {
  getPublishedQuestionSlugs,
  getQuestionBySlug,
  getQuestions,
} from "@/lib/cachedQueries";
import Link from "next/link";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  catToSlug,
  SITE,
} from "@/lib/seo/seo";
import InlineEvaluator from "@/components/ui/InlineEvaluater";
import { C } from "@/styles/tokens";
import { getServerTrack } from "@/lib/getServerTrack";

interface Props {
  params: { slug: string };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPublishedQuestionSlugs().catch(() => [] as string[]);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = await getQuestionBySlug(params.slug);
  const track = await getServerTrack();
  if (!q) return {};
  const diff = DIFF_LABEL[q.difficulty] ?? "Core";
  const typeLabel =
    q.type === "output"
      ? "Output Question"
      : q.type === "debug"
        ? "Debug Challenge"
        : "Interview Question";
  return pageMeta({
    title: `${q.title} — ${track} ${typeLabel}`,
    description: `${diff} ${track} ${typeLabel.toLowerCase()}: ${q.title} — Detailed answer with code examples and interview tips. Part of the ${q.category} category.`,
    path: `/q/${params.slug}`,
    keywords: [
      q.title.toLowerCase(),
      `${q.category.toLowerCase()} ${track}`,
      `${track.toLowerCase()} interview question`,
      `${params.slug.replace(/-/g, " ")}`,
    ],
  });
}

function markdownToHtml(text: string): string {
  if (!text) return "";
  if (text.trim().startsWith("<")) return text;
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      p.startsWith("<pre") ? p : `<p>${p.replace(/\n/g, "<br/>")}</p>`,
    )
    .join("\n");
}

export default async function QuestionPage({ params }: Props) {
  const question = await getQuestionBySlug(params.slug);
  const track = await getServerTrack();
  if (!question) notFound();
  const dm = DIFF_STYLE[question.difficulty] ?? DIFF_STYLE.core;
  const catSlug = catToSlug(question.category);
  const isOutput = question.type === "output";
  const isDebug = question.type === "debug";
  const isTheory = question.type === "theory";

  const { questions: allTypeQs } = await getQuestions({
    filters: { track, status: "published", type: question.type },
    pageSize: 300,
  });
  const related = allTypeQs
    .filter((q) => q.id !== question.id && q.category === question.category)
    .slice(0, 4);

  const answerHtml = markdownToHtml(question.answer ?? "");
  const plainAnswer = (question.answer ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const jsonLd = faqSchema([
    { question: question.title, answer: plainAnswer.slice(0, 500) },
  ]);

  const typeLabel = isOutput
    ? "💻 Output Question"
    : isDebug
      ? "🐛 Debug Challenge"
      : "📖 Theory Question";
  const categoryPath = isTheory
    ? `/questions/${catSlug}`
    : isOutput
      ? `/${track.toLowerCase()}-output-questions`
      : "/debug-lab";
  const categoryLabel = isTheory
    ? question.category
    : isOutput
      ? "Output Quiz"
      : "Debug Lab";

  // Vertical accent bar colour per question type
  const accentBar = (colour: string) => ({
    width: 3,
    height: 18,
    borderRadius: 2,
    background: colour,
    display: "inline-block" as const,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: `${track} Interview Questions`,
              path: `/${track.toLowerCase()}-interview-questions`,
            },
            { name: categoryLabel, path: categoryPath },
            {
              name: question.title.slice(0, 40) + "…",
              path: `/q/${params.slug}`,
            },
          ]),
        }}
      />

      <div
        style={{
          maxWidth: "50rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 5rem",
          color: C.text,
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: "0.8rem",
            color: C.muted,
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={{ color: C.accent, textDecoration: "none" }}>
            JSPrep Pro
          </Link>
          <span style={{ color: C.borderStrong }}>›</span>
          <Link
            href={categoryPath}
            style={{ color: C.accent, textDecoration: "none" }}
          >
            {categoryLabel}
          </Link>
          <span style={{ color: C.borderStrong }}>›</span>
          <span style={{ color: C.muted }}>{question.title.slice(0, 45)}…</span>
        </nav>

        {/* Question header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            {/* Diff badge — dm tokens already come from DIFF_STYLE (semantic) */}
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 20,
                background: dm.bg,
                color: dm.color,
                border: `1px solid ${dm.border}`,
              }}
            >
              {DIFF_LABEL[question.difficulty] ?? "Core"}
            </span>
            {/* Category badge */}
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 500,
                color: C.accentText,
                background: C.accentSubtle,
                padding: "3px 10px",
                borderRadius: 20,
                border: `1px solid ${C.border}`,
              }}
            >
              {question.category}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                color: C.muted,
                marginLeft: "auto",
              }}
            >
              {typeLabel}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.375rem, 3.5vw, 2rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.3,
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            {question.title}
          </h1>

          {question.hint && !isDebug && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
                padding: "0.875rem 1rem",
                background: C.amberSubtle,
                border: `1px solid ${C.amberBorder}`,
                borderRadius: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>
                💡
              </span>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: C.amber,
                    marginBottom: "0.25rem",
                  }}
                >
                  Hint
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: C.muted,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {question.hint}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Code block (output + debug) */}
        {(isOutput || isDebug) && question.code && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: C.text,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={accentBar(isOutput ? C.amber : C.red)} />
              {isDebug
                ? "Buggy Code — Can you spot the issue?"
                : "What does this output?"}
            </h2>
            <pre
              style={{
                background: C.codeBg,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${isOutput ? C.amber : C.red}`,
                borderRadius: "0.75rem",
                padding: "1.125rem 1.375rem",
                overflowX: "auto",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: C.codeText,
                margin: 0,
              }}
            >
              <code
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                {question.code}
              </code>
            </pre>
          </section>
        )}

        {/* Expected output (output only) */}
        {isOutput && question.expectedOutput && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: C.text,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={accentBar(C.green)} />
              Correct Output
            </h2>
            <pre
              style={{
                background: C.greenSubtle,
                border: `1px solid ${C.greenBorder}`,
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
                fontSize: "0.9375rem",
                fontFamily: "'JetBrains Mono', monospace",
                color: C.green,
                margin: 0,
              }}
            >
              {question.expectedOutput}
            </pre>
          </section>
        )}

        {/* Fixed code (debug only) */}
        {isDebug && question.fixedCode && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: C.text,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={accentBar(C.green)} />
              Fixed Code
            </h2>
            <pre
              style={{
                background: C.greenSubtle,
                border: `1px solid ${C.greenBorder}`,
                borderLeft: `3px solid ${C.green}`,
                borderRadius: "0.75rem",
                padding: "1.125rem 1.375rem",
                overflowX: "auto",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: C.codeText,
                margin: 0,
              }}
            >
              <code
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                {question.fixedCode}
              </code>
            </pre>
          </section>
        )}

        {/* Answer / Explanation */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={accentBar(C.accent)} />
            {isDebug
              ? "Bug Explained"
              : isOutput
                ? "Why this output?"
                : "Full Answer"}
          </h2>
          <div
            className="answer-body"
            dangerouslySetInnerHTML={{ __html: answerHtml }}
            style={{ lineHeight: 1.75, fontSize: "0.9375rem" }}
          />
        </section>

        {/* Inline AI evaluator (theory only) */}
        {isTheory && (
          <InlineEvaluator
            question={question.title}
            idealAnswer={plainAnswer}
            label="Can you explain this out loud?"
          />
        )}

        {/* Related questions */}
        {related.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: C.text,
                marginBottom: "0.875rem",
                paddingBottom: "0.625rem",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              More {question.category}{" "}
              {isOutput
                ? "Output Questions"
                : isDebug
                  ? "Debug Challenges"
                  : "Questions"}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {related.map((r) => {
                const rdm = DIFF_STYLE[r.difficulty] ?? DIFF_STYLE.core;
                return (
                  <Link
                    key={r.id}
                    href={`/q/${r.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      background: C.bgSubtle,
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.75rem",
                      textDecoration: "none",
                      transition: "border-color 0.12s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "2px 7px",
                        borderRadius: 12,
                        background: rdm.bg,
                        color: rdm.color,
                        border: `1px solid ${rdm.border}`,
                        flexShrink: 0,
                      }}
                    >
                      {DIFF_LABEL[r.difficulty] ?? "Core"}
                    </span>
                    <span
                      style={{ fontSize: "0.875rem", color: C.text, flex: 1 }}
                    >
                      {r.title}
                    </span>
                    <span style={{ color: C.muted, flexShrink: 0 }}>→</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div
          style={{
            padding: "1.375rem",
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: C.text,
              marginBottom: "0.5rem",
            }}
          >
            {isOutput
              ? "Practice predicting output live →"
              : isDebug
                ? "Practice spotting bugs live →"
                : "Practice this in a timed sprint →"}
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: C.muted,
              marginBottom: "1rem",
            }}
          >
            {isOutput
              ? "66 output questions with instant feedback"
              : isDebug
                ? "38 debug challenges with AI hints"
                : "5 free questions, no signup required"}
          </p>
          <Link
            href={
              isOutput
                ? `/${track.toLowerCase()}-output-questions`
                : isDebug
                  ? "/debug-lab"
                  : "/sprint"
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5625rem 1.125rem",
              background: C.accent,
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "0.625rem",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {isOutput
              ? "💻 Try Output Quiz"
              : isDebug
                ? "🐛 Try Debug Lab"
                : "⚡ Start Sprint"}
          </Link>
        </div>
      </div>

      {/* ─── Answer body prose — light theme ─────────────────────────────────── */}
      <style>{`
        .answer-body p { color: ${C.text}; margin-bottom: 1rem; line-height: 1.8; }
        .answer-body strong { color: ${C.text}; font-weight: 600; }
        .answer-body pre {
          background: ${C.codeBg};
          border: 1px solid ${C.border};
          border-left: 3px solid ${C.accent};
          border-radius: 0.75rem;
          padding: 1.125rem 1.375rem;
          overflow-x: auto;
          margin: 1.25rem 0;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        .answer-body code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: ${C.codeText};
        }
        .answer-body :not(pre) > code {
          background: ${C.codeInlineBg};
          border: 1px solid ${C.border};
          padding: 0.125rem 0.35rem;
          border-radius: 0.25rem;
          font-size: 0.85em;
        }
        .answer-body pre code { color: ${C.codeText}; background: none; border: none; padding: 0; }
        .answer-body .tip {
          background: ${C.accentSubtle};
          border-left: 3px solid ${C.accent};
          padding: 0.875rem 1rem;
          border-radius: 0 0.75rem 0.75rem 0;
          margin: 1.25rem 0;
          font-size: 0.875rem;
          color: ${C.accentText};
        }
        .answer-body ul, .answer-body ol {
          padding-left: 1.5rem;
          color: ${C.muted};
          margin-bottom: 1rem;
          line-height: 1.8;
        }
        .answer-body li { color: ${C.text}; }
        .answer-body h3 { color: ${C.text}; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
      `}</style>
    </>
  );
}

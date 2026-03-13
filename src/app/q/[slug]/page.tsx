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

interface Props {
  params: { slug: string };
}

export const revalidate = 3600;

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getPublishedQuestionSlugs().catch(() => [] as string[]);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = await getQuestionBySlug(params.slug);
  if (!q) return {};

  const diff = DIFF_LABEL[q.difficulty] ?? "Core";
  const typeLabel =
    q.type === "output"
      ? "Output Question"
      : q.type === "debug"
        ? "Debug Challenge"
        : "Interview Question";

  return pageMeta({
    title: `${q.title} — JavaScript ${typeLabel}`,
    description: `${diff} JavaScript ${typeLabel.toLowerCase()}: ${q.title} — Detailed answer with code examples and interview tips. Part of the ${q.category} category.`,
    path: `/q/${params.slug}`,
    keywords: [
      q.title.toLowerCase(),
      `${q.category.toLowerCase()} javascript`,
      "javascript interview question",
      `${params.slug.replace(/-/g, " ")}`,
    ],
  });
}

// ─── Simple markdown → HTML (no external dep) ────────────────────────────────
// Handles the answer format used by output/debug questions:
// "**Explanation:** ...\n\n**Key Insight:** ..."

function markdownToHtml(text: string): string {
  if (!text) return "";
  // Already HTML (theory questions have <p>, <pre> etc)
  if (text.trim().startsWith("<")) return text;

  return (
    text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Code blocks
      .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      // Double newline → paragraph break
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) =>
        p.startsWith("<pre") ? p : `<p>${p.replace(/\n/g, "<br/>")}</p>`,
      )
      .join("\n")
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function QuestionPage({ params }: Props) {
  const question = await getQuestionBySlug(params.slug);
  if (!question) notFound();

  const dm = DIFF_STYLE[question.difficulty] ?? DIFF_STYLE.core;
  const catSlug = catToSlug(question.category);
  const isOutput = question.type === "output";
  const isDebug = question.type === "debug";
  const isTheory = question.type === "theory";

  // Related questions: fetch by type (uses existing index), filter category in JS
  // Avoids needing a 4-field composite index (status+type+category+order)
  const { questions: allTypeQs } = await getQuestions({
    filters: { status: "published", type: question.type },
    pageSize: 100,
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
    {
      question: question.title,
      answer: plainAnswer.slice(0, 500),
    },
  ]);

  const typeLabel = isOutput
    ? "💻 Output Question"
    : isDebug
      ? "🐛 Debug Challenge"
      : "📖 Theory Question";
  const categoryPath = isTheory
    ? `/questions/${catSlug}`
    : isOutput
      ? "/javascript-output-questions"
      : "/debug-lab";
  const categoryLabel = isTheory
    ? question.category
    : isOutput
      ? "Output Quiz"
      : "Debug Lab";

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
              name: "JS Interview Questions",
              path: "/javascript-interview-questions",
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
          color: "#c8c8d8",
        }}
      >
        {/* ── Breadcrumb ── */}
        <nav
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={{ color: "#7c6af7", textDecoration: "none" }}>
            JSPrep Pro
          </Link>
          <span>›</span>
          <Link
            href={categoryPath}
            style={{ color: "#7c6af7", textDecoration: "none" }}
          >
            {categoryLabel}
          </Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>
            {question.title.slice(0, 45)}…
          </span>
        </nav>

        {/* ── Question header ── */}
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
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 20,
                background: dm.bg,
                color: dm.color,
                border: `1px solid ${dm.color}33`,
              }}
            >
              {DIFF_LABEL[question.difficulty] ?? "Core"}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "#7c6af7",
                background: "rgba(124,106,247,0.1)",
                padding: "3px 10px",
                borderRadius: 20,
                border: "1px solid rgba(124,106,247,0.2)",
              }}
            >
              {question.category}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                color: "rgba(255,255,255,0.3)",
                marginLeft: "auto",
              }}
            >
              {typeLabel}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.375rem, 3.5vw, 2rem)",
              fontWeight: 900,
              color: "white",
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
                background: "rgba(247,199,106,0.07)",
                border: "1px solid rgba(247,199,106,0.2)",
                borderRadius: "0.875rem",
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>
                💡
              </span>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#f7c76a",
                    marginBottom: "0.25rem",
                  }}
                >
                  Hint
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.6)",
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

        {/* ── Code block (output + debug questions) ── */}
        {(isOutput || isDebug) && question.code && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 18,
                  borderRadius: 2,
                  background: isOutput ? "#f7c76a" : "#f76a6a",
                  display: "inline-block",
                }}
              />
              {isDebug
                ? "Buggy Code — Can you spot the issue?"
                : "What does this output?"}
            </h2>
            <pre
              style={{
                background: "#0d0d14",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.875rem",
                padding: "1.25rem 1.5rem",
                overflowX: "auto",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "#c8c8d8",
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

        {/* ── Expected output (output questions only) ── */}
        {isOutput && question.expectedOutput && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 18,
                  borderRadius: 2,
                  background: "#6af7c0",
                  display: "inline-block",
                }}
              />
              Correct Output
            </h2>
            <pre
              style={{
                background: "rgba(106,247,192,0.05)",
                border: "1px solid rgba(106,247,192,0.2)",
                borderRadius: "0.875rem",
                padding: "1rem 1.25rem",
                fontSize: "0.9375rem",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#6af7c0",
                margin: 0,
              }}
            >
              {question.expectedOutput}
            </pre>
          </section>
        )}

        {/* ── Fixed code (debug questions only) ── */}
        {isDebug && question.fixedCode && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 18,
                  borderRadius: 2,
                  background: "#6af7c0",
                  display: "inline-block",
                }}
              />
              Fixed Code
            </h2>
            <pre
              style={{
                background: "rgba(106,247,192,0.04)",
                border: "1px solid rgba(106,247,192,0.15)",
                borderRadius: "0.875rem",
                padding: "1.25rem 1.5rem",
                overflowX: "auto",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "#c8c8d8",
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

        {/* ── Answer / Explanation ── */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "white",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: 3,
                height: 18,
                borderRadius: 2,
                background: "#7c6af7",
                display: "inline-block",
              }}
            />
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

        {/* ── AI Evaluator (theory only — makes sense for open-ended answers) ── */}
        {isTheory && (
          <InlineEvaluator
            question={question.title}
            idealAnswer={plainAnswer}
            label="Can you explain this out loud?"
          />
        )}

        {/* ── Related questions ── */}
        {related.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "0.9375rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "0.875rem",
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
                      padding: "0.875rem 1rem",
                      background: "#0e0e16",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "0.875rem",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.625rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "2px 7px",
                        borderRadius: 12,
                        background: rdm.bg,
                        color: rdm.color,
                        flexShrink: 0,
                      }}
                    >
                      {DIFF_LABEL[r.difficulty] ?? "Core"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.75)",
                        flex: 1,
                      }}
                    >
                      {r.title}
                    </span>
                    <span
                      style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Bottom CTA ── */}
        <div
          style={{
            padding: "1.5rem",
            background: "rgba(124,106,247,0.06)",
            border: "1px solid rgba(124,106,247,0.15)",
            borderRadius: "1rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "white",
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
              color: "rgba(255,255,255,0.45)",
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
                ? "/javascript-output-questions"
                : isDebug
                  ? "/debug-lab"
                  : "/sprint"
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.25rem",
              background: "linear-gradient(135deg, #7c6af7, #a78bfa)",
              color: "white",
              textDecoration: "none",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: 700,
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
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
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
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  KEYWORDS,
  SITE,
} from "@/lib/seo/seo";
import { getQuestions } from "@/lib/cachedQueries";
import SEOPredictionCard from "@/components/seo/SEOPredictionCard";
import SEOHeroCTA from "../dashboard/components/SeoHeroCta";
import { C } from "@/styles/tokens";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title:
    'JavaScript Tricky Questions: Coercion, Equality & "Wat" Moments (2025)',
  description:
    "The most confusing JavaScript questions explained: [] == false, null == undefined, typeof null, NaN !== NaN. Understand the rules behind the quirks — asked in real interviews.",
  path: "/javascript-tricky-questions",
  keywords: [
    "javascript tricky questions",
    "javascript weird behavior",
    "javascript type coercion questions",
    "javascript equality quirks",
    "javascript wat moments",
    "javascript null undefined equality",
    "javascript array coercion",
    "javascript interview tricky",
    "javascript typeof null",
    "javascript NaN comparison",
    ...KEYWORDS.secondary,
  ],
});

const FREE_PREVIEW = 5;

function catToId(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ─── Inline code chip helper ──────────────────────────────────────────────────
const chip: React.CSSProperties = {
  background: C.codeInlineBg,
  border: `1px solid ${C.border}`,
  padding: "0.1em 0.4em",
  borderRadius: "0.25rem",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.9em",
  color: C.codeText,
};

function EmptyState() {
  return (
    <div
      style={{
        background: C.bgSubtle,
        border: `1px dashed ${C.border}`,
        borderRadius: "0.875rem",
        padding: "2.5rem",
        textAlign: "center",
        margin: "2rem 0",
      }}
    >
      <p
        style={{
          color: C.text,
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
        }}
      >
        No tricky questions tagged yet.
      </p>
      <p
        style={{
          fontSize: "0.9375rem",
          color: C.muted,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        Go to{" "}
        <Link href="/admin/questions" style={{ color: C.accent }}>
          Admin → Questions
        </Link>{" "}
        → edit any output question → toggle <strong>🤯 Mark as Tricky</strong>.
      </p>
    </div>
  );
}

export default async function JavaScriptTrickyQuestionsPage() {
  const { questions } = await getQuestions({
    filters: { isTricky: true, status: "published" },
    pageSize: 200,
    orderByField: "order",
    orderDir: "asc",
  });

  const categories = [...new Set(questions.map((q) => q.category))].sort();
  const totalCount = questions.length;

  const faqItems = questions.slice(0, 8).map((q) => ({
    question: q.title,
    answer: q.keyInsight ?? q.explanation ?? "",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        key="faq-schema-tricky-questions"
        dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }}
      />
      <script
        type="application/ld+json"
        key="breadcrumb-schema-tricky-questions"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: "JavaScript Tricky Questions",
              path: "/javascript-tricky-questions",
            },
          ]),
        }}
      />

      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem",
          color: C.text,
          fontFamily: "system-ui, sans-serif",
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
          <span style={{ margin: "0 0.5rem", color: C.borderStrong }}>›</span>
          <span style={{ color: C.muted }}>JavaScript Tricky Questions</span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: C.red,
              background: C.redSubtle,
              border: `1px solid ${C.redBorder}`,
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              marginBottom: "1rem",
            }}
          >
            🤯 JavaScript &quot;Wat?&quot; Moments
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.15,
              marginBottom: "1rem",
              letterSpacing: "-0.025em",
            }}
          >
            JavaScript Tricky Questions
            <br />
            <span style={{ color: C.red }}>The Rules Behind the Quirks</span>
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.75,
              marginBottom: "1rem",
              maxWidth: "44rem",
              color: C.text,
            }}
          >
            <code style={chip}>[] == false</code>,{" "}
            <code style={chip}>null == undefined</code>,{" "}
            <code style={chip}>typeof null === &quot;object&quot;</code>. These
            aren&apos;t bugs — they&apos;re rules. Learn the rules and they stop
            being surprising.
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              color: C.muted,
              marginBottom: "1.5rem",
            }}
          >
            ✅ {totalCount} tricky questions &nbsp;·&nbsp; ✅ First{" "}
            {FREE_PREVIEW} interactive free &nbsp;·&nbsp; ✅ Commonly asked in
            interviews
          </p>
          <SEOHeroCTA />
        </header>

        {/* How to use */}
        <section
          style={{
            background: C.bgSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "1.125rem 1.375rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: C.text,
              marginBottom: "0.5rem",
            }}
          >
            🎯 How to use this page
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.75,
              color: C.muted,
              margin: 0,
            }}
          >
            <strong style={{ color: C.text }}>
              Try the first {FREE_PREVIEW} questions here
            </strong>{" "}
            — click a question, type your prediction, see if you got it right.
            The rest are in the{" "}
            <Link href="/output-quiz" style={{ color: C.red }}>
              interactive quiz
            </Link>
            . These questions are designed to expose blind spots — you need to{" "}
            <em>predict</em>, not read.
          </p>
        </section>

        {/* Why interviewers love these */}
        <section
          style={{
            background: C.bgSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "1.125rem 1.375rem",
            marginBottom: "2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: C.text,
              marginBottom: "0.5rem",
            }}
          >
            🎯 Why interviewers love these questions
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.75,
              color: C.muted,
              margin: 0,
            }}
          >
            They test your mental model of JavaScript&apos;s type system — the
            Abstract Equality Comparison algorithm, how coercion fires, how the
            event loop orders execution. A developer who can&apos;t explain{" "}
            <code style={chip}>[] == false</code> probably also writes coercion
            bugs in production.
          </p>
        </section>

        {/* Category TOC */}
        {categories.length > 0 && (
          <nav
            style={{
              background: C.bgSubtle,
              border: `1px solid ${C.border}`,
              borderRadius: "0.875rem",
              padding: "1.375rem",
              marginBottom: "2.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: C.text,
                marginBottom: "0.875rem",
              }}
            >
              📋 Categories
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {categories.map((cat) => {
                const count = questions.filter(
                  (q) => q.category === cat,
                ).length;
                return (
                  <a
                    key={cat}
                    href={`#${catToId(cat)}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: C.red,
                      background: C.redSubtle,
                      border: `1px solid ${C.redBorder}`,
                      padding: "0.3125rem 0.75rem",
                      borderRadius: "9999px",
                      textDecoration: "none",
                    }}
                  >
                    {cat}{" "}
                    <span style={{ opacity: 0.7, fontWeight: 400 }}>
                      ({count})
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>
        )}

        {/* Questions */}
        {questions.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
          >
            {categories.map((cat) => {
              const catQs = questions.filter((q) => q.category === cat);
              return (
                <section key={cat} id={catToId(cat)}>
                  <h2
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      paddingBottom: "0.75rem",
                      borderBottom: `1px solid ${C.border}`,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "3px",
                        height: "1.125rem",
                        background: C.red,
                        borderRadius: "2px",
                        flexShrink: 0,
                      }}
                    />
                    {cat}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.875rem",
                    }}
                  >
                    {catQs.map((q) => {
                      const globalIndex = questions.indexOf(q);
                      return (
                        <SEOPredictionCard
                          key={q.id}
                          q={{
                            id: q.id,
                            title: q.title,
                            code: q.code,
                            answer: q.expectedOutput || q.answer || "",
                            explanation: q.explanation,
                            keyInsight: q.keyInsight,
                            difficulty: q.difficulty,
                            category: q.category,
                          }}
                          globalIndex={globalIndex}
                          freeLimit={FREE_PREVIEW}
                          quizHref="/output-quiz"
                          accent={C.red}
                          badgeLabel={`#${String(globalIndex + 1).padStart(2, "0")}`}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Upgrade CTA */}
        {questions.length > FREE_PREVIEW && (
          <section
            style={{
              marginTop: "3rem",
              padding: "2rem 2.5rem",
              textAlign: "center",
              background: C.redSubtle,
              border: `1px solid ${C.redBorder}`,
              borderRadius: "0.875rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔒</div>
            <h2
              style={{
                fontSize: "1.375rem",
                fontWeight: 700,
                color: C.text,
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              {totalCount - FREE_PREVIEW} more tricky questions in the quiz
            </h2>
            <p
              style={{
                color: C.muted,
                marginBottom: "1.5rem",
                maxWidth: "30rem",
                marginInline: "auto",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
              }}
            >
              Free accounts get 5 questions. Pro unlocks everything — all output
              questions, debug lab, theory mastery, and the leaderboard.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.875rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/output-quiz"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.625rem",
                  background: C.red,
                  color: "#ffffff",
                  borderRadius: "0.625rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "0.9375rem",
                }}
              >
                ⚡ Start Free — 5 Questions
              </Link>
              <Link
                href="/#pricing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.625rem",
                  border: `1px solid ${C.border}`,
                  color: C.accent,
                  borderRadius: "0.625rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  fontSize: "0.9375rem",
                }}
              >
                View Pro — $9/mo →
              </Link>
            </div>
          </section>
        )}

        {/* Related */}
        <section style={{ marginTop: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: `1px solid ${C.border}`,
              letterSpacing: "-0.01em",
            }}
          >
            Related Resources
          </h2>
          <ul
            style={{
              paddingLeft: "1.25rem",
              fontSize: "0.9375rem",
              lineHeight: 2,
            }}
          >
            <li style={{ color: C.muted }}>
              <Link
                href="/javascript-output-questions"
                style={{ color: C.accent }}
              >
                JavaScript Output Questions — Predict the console.log
              </Link>
            </li>
            <li style={{ color: C.muted }}>
              <Link
                href="/javascript-interview-questions"
                style={{ color: C.accent }}
              >
                150+ JavaScript Interview Questions with Answers
              </Link>
            </li>
            <li style={{ color: C.muted }}>
              <Link
                href="/javascript-interview-cheatsheet"
                style={{ color: C.accent }}
              >
                JavaScript Interview Cheat Sheet
              </Link>
            </li>
            <li style={{ color: C.muted }}>
              <Link href="/debug-lab" style={{ color: C.accent }}>
                JavaScript Debug Lab — Fix Real Bugs
              </Link>
            </li>
          </ul>
        </section>

        <footer
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: `1px solid ${C.border}`,
            fontSize: "0.8125rem",
            color: C.muted,
            textAlign: "center",
          }}
        >
          © 2026 {SITE.name} · {SITE.domain}
        </footer>
      </div>
    </>
  );
}

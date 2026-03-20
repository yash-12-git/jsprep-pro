import type { Metadata } from "next";
import Link from "next/link";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  KEYWORDS,
  SITE,
} from "@/lib/seo/seo";
import { outputQuestions } from "@/data/outputQuestions";
import SEOPredictionCard from "@/components/seo/SEOPredictionCard";
import SEOHeroCTA from "../dashboard/components/SeoHeroCta";
import { C } from "@/styles/tokens";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Output Questions: Predict the Console.log (2025)",
  description:
    "Practice 70+ JavaScript output prediction questions. See the code, predict what console.log prints — covers event loop, closures, hoisting, type coercion, and this binding.",
  path: "/javascript-output-questions",
  keywords: [
    "javascript output questions",
    "javascript predict the output",
    "javascript console log questions",
    "javascript coding interview output",
    "what does this javascript print",
    "javascript tricky output questions",
    "javascript event loop output",
    "javascript closure output questions",
    ...KEYWORDS.secondary,
  ],
});

const FREE_PREVIEW = 5;
const allQuestions = [...outputQuestions];

const CATEGORIES = [
  "Event Loop & Promises",
  "Closures & Scope",
  "'this' Binding",
  "Hoisting",
  "Type Coercion",
] as const;

const CATEGORY_EMOJI: Record<string, string> = {
  "Event Loop & Promises": "⚙️",
  "Closures & Scope": "🔒",
  "'this' Binding": "👉",
  Hoisting: "🚀",
  "Type Coercion": "🔀",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const faqItems = [
  {
    question: "What are JavaScript output questions?",
    answer:
      "Output questions show a snippet and ask you to predict console.log output. They test scope, closures, the event loop, type coercion, hoisting, and this binding.",
  },
  {
    question: "Why do interviewers ask output prediction questions?",
    answer:
      "They cannot be guessed — you must mentally execute the code. This reveals genuine understanding vs surface knowledge.",
  },
  {
    question: "How should I practice JavaScript output questions?",
    answer:
      "Cover the output, read the code, write your prediction, then reveal. Understand why you were wrong before moving on.",
  },
];

export default function JavaScriptOutputQuestionsPage() {
  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    questions: allQuestions.filter((q) => q.cat === cat),
  }));
  const orderedAll = byCategory.flatMap(({ questions }) => questions);
  const totalCount = orderedAll.length;

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
              name: "JavaScript Output Questions",
              path: "/javascript-output-questions",
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
          <span style={{ color: C.muted }}>JavaScript Output Questions</span>
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
              color: C.amber,
              background: C.amberSubtle,
              border: `1px solid ${C.amberBorder}`,
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              marginBottom: "1rem",
            }}
          >
            ⚡ Predict the Output
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
            JavaScript Output Questions
            <br />
            <span style={{ color: C.amber }}>What Does This Code Print?</span>
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
            {totalCount}+ real{" "}
            <strong>JavaScript output prediction questions</strong> from
            frontend interviews. Read code → predict{" "}
            <code
              style={{
                background: C.codeInlineBg,
                border: `1px solid ${C.border}`,
                padding: "0.1em 0.4em",
                borderRadius: "0.25rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.9em",
                color: C.codeText,
              }}
            >
              console.log
            </code>{" "}
            → learn why.
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              color: C.muted,
              marginBottom: "1.5rem",
            }}
          >
            ✅ {totalCount} questions &nbsp;·&nbsp; ✅ First {FREE_PREVIEW}{" "}
            interactive free &nbsp;·&nbsp; ✅ Progress saved in quiz
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.875rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <SEOHeroCTA />
            <a
              href="#questions"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.5625rem 1.25rem",
                border: `1px solid ${C.border}`,
                color: C.muted,
                borderRadius: "0.625rem",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "0.9375rem",
              }}
            >
              Browse Questions ↓
            </a>
          </div>
        </header>

        {/* How it works */}
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
            ⚡ How to use this page
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
            — click a question, type your prediction, check it. No account
            needed. The rest are in the{" "}
            <Link href="/output-quiz" style={{ color: C.amber }}>
              interactive quiz
            </Link>{" "}
            where progress is tracked. Reading answers ≠ predicting them.
          </p>
        </section>

        {/* TOC */}
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
              marginBottom: "1rem",
            }}
          >
            📋 Topics
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {byCategory.map(({ cat, questions }) => (
              <a
                key={cat}
                href={`#${slugify(cat)}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.5625rem 0.875rem",
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  color: C.text,
                  fontSize: "0.875rem",
                }}
              >
                <span>{CATEGORY_EMOJI[cat]}</span>
                <span style={{ flex: 1 }}>{cat}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    background: C.bgActive,
                    padding: "0.1rem 0.5rem",
                    borderRadius: "9999px",
                  }}
                >
                  {questions.length}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* Questions */}
        <div
          id="questions"
          style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
        >
          {byCategory.map(({ cat, questions }) => (
            <section key={cat} id={slugify(cat)}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  paddingBottom: "0.875rem",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>
                  {CATEGORY_EMOJI[cat]}
                </span>
                <div>
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: C.text,
                      margin: 0,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {cat}
                  </h2>
                  <p
                    style={{ fontSize: "0.8125rem", color: C.muted, margin: 0 }}
                  >
                    {questions.length} questions
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                {questions.map((q) => {
                  const globalIndex = orderedAll.indexOf(q);
                  return (
                    <SEOPredictionCard
                      key={q.id}
                      q={{
                        id: q.id,
                        title: q.title,
                        code: q.code,
                        answer: q.answer,
                        explanation: q.explanation,
                        keyInsight: q.keyInsight,
                        difficulty: q.difficulty,
                        category: q.cat,
                        tags: q.tags,
                      }}
                      globalIndex={globalIndex}
                      freeLimit={FREE_PREVIEW}
                      quizHref="/output-quiz"
                      accent={C.amber}
                      badgeLabel={`#${String(globalIndex + 1).padStart(2, "0")}`}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Upgrade CTA */}
        <section
          style={{
            marginTop: "3rem",
            padding: "2rem 2.5rem",
            textAlign: "center",
            background: C.amberSubtle,
            border: `1px solid ${C.amberBorder}`,
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
            {totalCount - FREE_PREVIEW} more questions with progress tracking
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
            Free accounts get 5 tracked questions. Pro unlocks all {totalCount}+
            output questions, debug lab, theory mastery, and the leaderboard.
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
                background: C.amber,
                color: C.text,
                borderRadius: "0.625rem",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.9375rem",
              }}
            >
              ⚡ Start Free — 5 Questions
            </Link>
            <Link
              href="/pricing"
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
                href="/javascript-tricky-questions"
                style={{ color: C.accent }}
              >
                JavaScript Tricky Questions — [] == false, null == undefined
                explained
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
                JavaScript Interview Cheat Sheet (Printable)
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

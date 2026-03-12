/**
 * /javascript-tricky-questions — RSC, reads isTricky questions from Firestore.
 *
 * CONVERSION FUNNEL — same as output-questions:
 * • First 5 questions: fully interactive (predict → check locally, no AI)
 * • Questions 6+: code visible for SEO, prediction box replaced with quiz CTA
 * • Answers/explanations NEVER appear until user checks or clicks Reveal
 *
 * Inline styles only — Emotion css={} does NOT work in RSCs.
 */

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
import type { Question } from "@/types/question";
import SEOPredictionCard from "@/components/seo/SEOPredictionCard";
import HeroCTA from "./HeroCta";

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

const C = {
  card: "#111118",
  border: "rgba(255,255,255,0.07)",
  muted: "rgba(255,255,255,0.4)",
  text: "#c8c8d8",
  accent: "#7c6af7",
  accent2: "#f7c76a",
  accent3: "#6af7c0",
  danger: "#f76a6a",
  purple: "#a78bfa",
};

function catToId(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function EmptyState() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.1)",
        borderRadius: "1rem",
        padding: "2.5rem",
        textAlign: "center",
        margin: "2rem 0",
      }}
    >
      <p
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}
      >
        No tricky questions tagged yet.
      </p>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "rgba(255,255,255,0.4)",
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
        dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }}
      />
      <script
        type="application/ld+json"
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
          <span style={{ margin: "0 0.5rem" }}>›</span>
          <span>JavaScript Tricky Questions</span>
        </nav>

        {/* ── Hero ── */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: C.danger,
              background: `${C.danger}1a`,
              border: `1px solid ${C.danger}33`,
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
              fontWeight: 900,
              color: "white",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            JavaScript Tricky Questions
            <br />
            <span style={{ color: C.danger }}>The Rules Behind the Quirks</span>
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.75,
              marginBottom: "1rem",
              maxWidth: "44rem",
            }}
          >
            <code
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "0.1em 0.4em",
                borderRadius: "0.25rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.9em",
              }}
            >
              [] == false
            </code>
            ,{" "}
            <code
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "0.1em 0.4em",
                borderRadius: "0.25rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.9em",
              }}
            >
              null == undefined
            </code>
            ,{" "}
            <code
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "0.1em 0.4em",
                borderRadius: "0.25rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.9em",
              }}
            >
              typeof null === &quot;object&quot;
            </code>
            . These aren&apos;t bugs — they&apos;re rules. Learn the rules and
            they stop being surprising.
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
          <HeroCTA />
        </header>

        {/* ── Why these matter ── */}
        <section
          style={{
            background: C.card,
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: "1rem",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.9375rem",
              fontWeight: 800,
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            🎯 How to use this page
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}
          >
            <strong style={{ color: "white" }}>
              Try the first {FREE_PREVIEW} questions here
            </strong>{" "}
            — click a question, type your prediction, see if you got it right.
            The rest are in the{" "}
            <Link href="/output-quiz" style={{ color: C.danger }}>
              interactive quiz
            </Link>
            . These questions are designed to expose blind spots — you need to{" "}
            <em>predict</em>, not read.
          </p>
        </section>

        {/* ── Why interviewers love these ── */}
        <section
          style={{
            background: C.card,
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: "1rem",
            padding: "1.25rem 1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.9375rem",
              fontWeight: 800,
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            🎯 Why interviewers love these questions
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}
          >
            They test your mental model of JavaScript&apos;s type system — the
            Abstract Equality Comparison algorithm, how coercion fires, how the
            event loop orders execution. A developer who can&apos;t explain{" "}
            <code
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "0.1em 0.3em",
                borderRadius: "0.25rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.875em",
              }}
            >
              [] == false
            </code>{" "}
            probably also writes coercion bugs in production.
          </p>
        </section>

        {/* ── Category TOC ── */}
        {categories.length > 0 && (
          <nav
            style={{
              background: C.card,
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "white",
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
                      fontWeight: 700,
                      color: C.danger,
                      background: `${C.danger}12`,
                      border: `1px solid ${C.danger}33`,
                      padding: "0.3125rem 0.75rem",
                      borderRadius: "9999px",
                      textDecoration: "none",
                    }}
                  >
                    {cat}{" "}
                    <span style={{ opacity: 0.6, fontWeight: 400 }}>
                      ({count})
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>
        )}

        {/* ── Questions ── */}
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
                      fontWeight: 900,
                      color: "white",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      paddingBottom: "0.75rem",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "3px",
                        height: "1.125rem",
                        background: C.danger,
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
                      gap: "1rem",
                    }}
                  >
                    {catQs.map((q) => {
                      const globalIndex = questions.indexOf(q);
                      // Map Firestore Question → SEOQuestion shape
                      const answer = q.expectedOutput || q.answer || "";
                      return (
                        <SEOPredictionCard
                          key={q.id}
                          q={{
                            id: q.id,
                            title: q.title,
                            code: q.code,
                            answer,
                            explanation: q.explanation,
                            keyInsight: q.keyInsight,
                            difficulty: q.difficulty,
                            category: q.category,
                          }}
                          globalIndex={globalIndex}
                          freeLimit={FREE_PREVIEW}
                          quizHref="/output-quiz"
                          accent={C.danger}
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

        {/* ── Upgrade CTA ── */}
        {questions.length > FREE_PREVIEW && (
          <section
            style={{
              marginTop: "3rem",
              padding: "2rem 2.5rem",
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(247,106,106,0.09), rgba(124,106,247,0.07))",
              border: "1px solid rgba(247,106,106,0.2)",
              borderRadius: "1.5rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔒</div>
            <h2
              style={{
                fontSize: "1.375rem",
                fontWeight: 900,
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              {totalCount - FREE_PREVIEW} more tricky questions in the quiz
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                marginBottom: "1.5rem",
                maxWidth: "30rem",
                marginInline: "auto",
                fontSize: "0.9375rem",
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
                  padding: "0.875rem 1.75rem",
                  background: C.danger,
                  color: "white",
                  borderRadius: "0.875rem",
                  fontWeight: 800,
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
                  padding: "0.875rem 1.75rem",
                  border: `1px solid ${C.accent}55`,
                  color: C.accent,
                  borderRadius: "0.875rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "0.9375rem",
                }}
              >
                View Pro — $9/mo →
              </Link>
            </div>
          </section>
        )}

        {/* ── Related ── */}
        <section style={{ marginTop: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "white",
              marginBottom: "1rem",
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
            <li>
              <Link
                href="/javascript-output-questions"
                style={{ color: C.accent }}
              >
                JavaScript Output Questions — Predict the console.log
              </Link>
            </li>
            <li>
              <Link
                href="/javascript-interview-questions"
                style={{ color: C.accent }}
              >
                150+ JavaScript Interview Questions with Answers
              </Link>
            </li>
            <li>
              <Link
                href="/javascript-interview-cheatsheet"
                style={{ color: C.accent }}
              >
                JavaScript Interview Cheat Sheet
              </Link>
            </li>
            <li>
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
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
          }}
        >
          © 2026 {SITE.name} · {SITE.domain}
        </footer>
      </div>
    </>
  );
}

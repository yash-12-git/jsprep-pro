import type { Metadata } from "next";
import Link from "next/link";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  catToSlug,
  KEYWORDS,
} from "@/lib/seo/seo";
import PracticeCTA from "./PracticeCTA";
import HeroCTA from "./HeroCTA";
import { getPublishedCategories, getQuestions } from "@/lib/cachedQueries";
import { C } from "@/styles/tokens";

export const metadata: Metadata = pageMeta({
  title: "150+ JavaScript Interview Questions With Answers (2025)",
  description:
    "The most complete list of JavaScript interview questions with detailed answers, code examples, and explanations. Covers closures, event loop, promises, async/await, prototypes, and more.",
  path: "/javascript-interview-questions",
  keywords: [
    "javascript interview questions 2026",
    "js interview questions and answers",
    "javascript interview questions for experienced",
    "top javascript interview questions",
    "advanced javascript interview questions",
    ...KEYWORDS.secondary,
  ],
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

export const revalidate = 3600;

export default async function JavaScriptInterviewQuestionsPage() {
  const { questions: allQuestions } = await getQuestions({
    filters: { status: "published", type: "theory" },
    pageSize: 500,
  });
  const categories = await getPublishedCategories();

  const questionsByCategory = categories.map((cat) => ({
    cat,
    slug: catToSlug(cat),
    questions: allQuestions.filter((q) => q.category === cat),
  }));

  const faqItems = allQuestions.slice(0, 20).map((q) => ({
    question: q.title,
    answer: stripHtml(q.answer ?? ""),
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
              name: "JavaScript Interview Questions",
              path: "/javascript-interview-questions",
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
          <span style={{ color: C.muted }}>JavaScript Interview Questions</span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: "2.5rem" }}>
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
            150+ JavaScript Interview Questions
            <br />
            <span style={{ color: C.accent }}>
              With Answers & Code Examples
            </span>
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
            The most comprehensive collection of{" "}
            <strong style={{ color: C.text }}>
              JavaScript interview questions
            </strong>{" "}
            for frontend developers in 2025. Covers everything from basic JS
            concepts to advanced topics like the event loop, closures, promises,
            prototypes, and modern ES2023+ features.
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              color: C.muted,
              marginBottom: "1.5rem",
            }}
          >
            ✅ {allQuestions.length} questions &nbsp;·&nbsp; ✅{" "}
            {categories.length} categories &nbsp;·&nbsp; ✅ Code examples in
            every answer &nbsp;·&nbsp; ✅ Updated 2025
          </p>
          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <HeroCTA />
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

        {/* Table of Contents */}
        <section
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
            📋 Table of Contents
          </h2>
          <ol
            style={{
              paddingLeft: "1.25rem",
              columns: 2,
              columnGap: "2rem",
              fontSize: "0.875rem",
            }}
          >
            {questionsByCategory.map(({ cat, slug, questions: qs }) => (
              <li
                key={cat}
                style={{ marginBottom: "0.5rem", breakInside: "avoid" }}
              >
                <a
                  href={`#${slug}`}
                  style={{ color: C.accent, textDecoration: "none" }}
                >
                  {cat}
                </a>
                <span
                  style={{
                    color: C.muted,
                    marginLeft: "0.375rem",
                    fontSize: "0.75rem",
                  }}
                >
                  ({qs.length})
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Intro */}
        <section
          style={{
            marginBottom: "3rem",
            lineHeight: 1.85,
            fontSize: "0.9375rem",
            color: C.text,
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.875rem",
              letterSpacing: "-0.015em",
            }}
          >
            How to Use This Guide
          </h2>
          <p style={{ marginBottom: "0.875rem", color: C.text }}>
            This guide covers the most frequently asked{" "}
            <strong>JavaScript interview questions</strong> across all
            experience levels — from junior developers with 0–1 years of
            experience to senior engineers. Each answer includes a clear
            explanation, working code examples, and common gotchas that
            interviewers specifically test for.
          </p>
          <p style={{ marginBottom: "0.875rem", color: C.text }}>
            The questions are organized by topic so you can focus on your weak
            areas first. We recommend using the{" "}
            <Link href="/dashboard" style={{ color: C.accent }}>
              interactive practice platform
            </Link>{" "}
            to test yourself rather than just reading — active recall improves
            retention by up to 50%.
          </p>
          <p style={{ color: C.text }}>
            For each concept, we also have{" "}
            <Link href="/output-quiz" style={{ color: C.accent }}>
              output prediction challenges
            </Link>{" "}
            (predict what a code snippet logs) and a{" "}
            <Link href="/debug-lab" style={{ color: C.accent }}>
              debug lab
            </Link>{" "}
            where you fix real buggy code — the closest thing to an actual
            interview.
          </p>
        </section>

        {/* Questions by category */}
        <main id="questions">
          {questionsByCategory.map(({ cat, slug, questions: catQs }) => (
            <section key={cat} id={slug} style={{ marginBottom: "4rem" }}>
              {/* Category header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <h2
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 700,
                    color: C.text,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {cat} Interview Questions
                </h2>
                <Link
                  href={`/questions/${slug}`}
                  style={{
                    fontSize: "0.8125rem",
                    color: C.accent,
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Practice {cat} questions →
                </Link>
              </div>

              {catQs.map((q, i) => (
                <article
                  key={q.id}
                  style={{ marginBottom: "2.5rem" }}
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <h3
                    itemProp="name"
                    id={`q-${q.id ?? q.slug}`}
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: "1rem",
                      lineHeight: 1.4,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span
                      style={{
                        color: C.accent,
                        marginRight: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    ></span>
                    {q.title}
                  </h3>

                  {q.hint && (
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: C.green,
                        background: C.greenSubtle,
                        border: `1px solid ${C.greenBorder}`,
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.875rem",
                        marginBottom: "0.875rem",
                      }}
                    >
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
                      dangerouslySetInnerHTML={{ __html: q.answer ?? "" }}
                      style={{ lineHeight: 1.8, fontSize: "0.9375rem" }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "0.875rem",
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <PracticeCTA />
                    {i === catQs.length - 1 && (
                      <Link
                        href={`/questions/${slug}`}
                        style={{
                          fontSize: "0.75rem",
                          color: C.muted,
                          border: `1px solid ${C.border}`,
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.375rem",
                          textDecoration: "none",
                        }}
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

        {/* Platform CTA */}
        <section
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "2.5rem",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.625rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Don't Just Read — Practice
          </h2>
          <p
            style={{
              color: C.muted,
              maxWidth: "36rem",
              margin: "0 auto 1.5rem",
              lineHeight: 1.7,
            }}
          >
            Reading answers is passive. JSPrep Pro makes you actively recall
            answers, predict code output, fix real bugs, and get evaluated by AI
            — just like an actual interview.
          </p>
          <HeroCTA />
        </section>

        {/* Related resources */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "1rem",
              letterSpacing: "-0.01em",
              paddingBottom: "0.75rem",
              borderBottom: `1px solid ${C.border}`,
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
            {[
              {
                href: "/javascript-interview-cheatsheet",
                text: "JavaScript Interview Cheat Sheet (Printable PDF)",
              },
              { href: "/questions/core-js", text: "Core JavaScript Questions" },
              {
                href: "/questions/async-js",
                text: "Async JavaScript Questions (Promises, async/await)",
              },
              {
                href: "/output-quiz",
                text: "JavaScript Output Prediction Quiz",
              },
              { href: "/debug-lab", text: "JavaScript Debug Lab" },
              {
                href: "/blog/event-loop-explained",
                text: "JavaScript Event Loop Explained Visually",
              },
            ].map(({ href, text }) => (
              <li key={href} style={{ color: C.muted }}>
                <Link
                  href={href}
                  style={{ color: C.accent, textDecoration: "none" }}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: "1.5rem",
            fontSize: "0.8125rem",
            color: C.muted,
            textAlign: "center",
          }}
        >
          <p>
            © 2025 JSPrep Pro · Last updated January 2025 ·{" "}
            <Link href="/" style={{ color: C.accentText }}>
              Home
            </Link>{" "}
            ·{" "}
            <Link href="/dashboard" style={{ color: C.accentText }}>
              Practice Platform
            </Link>
          </p>
        </footer>
      </div>

      {/* ─── Answer prose — light theme ──────────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #questions p { margin: 0 0 0.75rem; color: ${C.text}; }
        #questions pre {
          background: ${C.codeBg};
          border: 1px solid ${C.border};
          border-left: 3px solid ${C.accent};
          border-radius: 0.625rem;
          padding: 0.875rem 1rem;
          overflow-x: auto;
          margin: 0.75rem 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          line-height: 1.7;
          color: ${C.codeText};
        }
        #questions code { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }
        #questions p > code, #questions li > code {
          background: ${C.codeInlineBg};
          border: 1px solid ${C.border};
          padding: 0.125rem 0.35rem;
          border-radius: 0.25rem;
          color: ${C.codeText};
          font-size: 0.8em;
        }
        #questions ul, #questions ol { padding-left: 1.5rem; margin: 0 0 0.875rem; }
        #questions li { margin-bottom: 0.375rem; line-height: 1.7; color: ${C.text}; }
        #questions strong { color: ${C.text}; font-weight: 600; }
        #questions .tip {
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

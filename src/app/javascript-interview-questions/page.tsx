import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo/seo";
import QuestionList from "./QuestionList";
import { C } from "@/styles/tokens";
import { getServerTrack } from "@/lib/getServerTrack";

// ─── Static metadata ──────────────────────────────────────────────────────────

export const metadata: Metadata = pageMeta({
  title: "150+ JavaScript Interview Questions With Answers (2025)",
  description:
    "The most complete list of JavaScript interview questions with detailed answers and code examples. Covers closures, event loop, promises, async/await, prototypes, this keyword, type coercion and more. Asked at Razorpay, Flipkart, Google, Atlassian.",
  path: "/javascript-interview-questions",
});

// ─── FAQ schema (static, does not need Firestore) ────────────────────────────

const STATIC_FAQS = [
  {
    q: "What is a closure in JavaScript?",
    a: "A closure is a function that retains access to its outer scope even after the outer function has returned. It captures the variable binding, not the value at definition time.",
  },
  {
    q: "What is the difference between var, let, and const?",
    a: "var is function-scoped and hoisted as undefined. let and const are block-scoped and not accessible before declaration (TDZ). const additionally prevents reassignment.",
  },
  {
    q: "What is the event loop in JavaScript?",
    a: "The event loop processes tasks from the call stack and queues. Synchronous code runs first, then microtasks (Promise.then, queueMicrotask), then macrotasks (setTimeout, setInterval).",
  },
  {
    q: "What is the difference between == and === in JavaScript?",
    a: "== performs type coercion before comparison. === compares both value and type without coercion. null == undefined is true but null === undefined is false.",
  },
  {
    q: "How does prototypal inheritance work in JavaScript?",
    a: "Objects inherit properties from their prototype chain. When accessing a property, JavaScript walks up the chain until it finds the property or reaches null. Object.create() sets the prototype directly.",
  },
  {
    q: "What is async/await in JavaScript?",
    a: "async/await is syntactic sugar over Promises. An async function always returns a Promise. await pauses execution inside the async function until the Promise settles, then resumes as a microtask.",
  },
  {
    q: "What is the difference between null and undefined?",
    a: 'undefined means a variable has been declared but not assigned. null is an explicit assignment meaning "no value". typeof null returns "object" — a historic JavaScript bug.',
  },
  {
    q: "How does hoisting work in JavaScript?",
    a: "var declarations are moved to the top of their function scope at compile time, initialized as undefined. Function declarations are fully hoisted. let and const are hoisted but stay in the TDZ until the declaration is reached.",
  },
];

// ─── Static topic sections (shown while QuestionList loads / as SEO content) ─

const TOPIC_SECTIONS = [
  {
    title: "Closures & Scope",
    href: "/javascript-closure-interview-questions",
  },
  {
    title: "Event Loop & Async",
    href: "/javascript-event-loop-interview-questions",
  },
  {
    title: "Execution Context",
    href: "/javascript-execution-context-interview-questions",
  },
  {
    title: "Prototypes & Inheritance",
    href: "/javascript-prototype-interview-questions",
  },
  {
    title: "Type Coercion",
    href: "/javascript-type-coercion-interview-questions",
  },
  {
    title: "Hoisting & TDZ",
    href: "/javascript-hoisting-interview-questions",
  },
];

const PREP_TIPS = [
  {
    emoji: "🧠",
    title: "Understand, don't memorize",
    desc: "Focus on why JavaScript behaves the way it does — coercion rules, event loop mechanics, closure semantics. Interviewers can tell the difference.",
  },
  {
    emoji: "💻",
    title: "Predict output before running",
    desc: "Use output quiz questions to train your mental model. If you can predict what code logs, you truly understand the concept.",
  },
  {
    emoji: "🐛",
    title: "Debug real bugs",
    desc: "Practice with buggy code that produces wrong output silently — not syntax errors. Real interview bugs are always logical, not typos.",
  },
  {
    emoji: "📐",
    title: "Master the big 8 concepts",
    desc: "Closures, this binding, event loop, prototypes, async/await, type coercion, hoisting, and ES6+ features cover 90% of JavaScript interviews.",
  },
  {
    emoji: "🏢",
    title: "Company patterns vary",
    desc: "Razorpay loves event loop. Flipkart tests closures heavily. Google digs into prototypes and generators. Know which concepts each company emphasizes.",
  },
  {
    emoji: "⏱️",
    title: "Practice under time pressure",
    desc: "Use the Sprint feature — 10 questions in 15 minutes. Interview pressure is real and you can train for it.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JSInterviewQuestionsPage() {

  const track = await getServerTrack();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STATIC_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        key="faq-schema-interview-questions-page"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
        }}
      >
        {/* ── Hero ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-accent)",
              marginBottom: "0.75rem",
            }}
          >
            JavaScript Interview Prep
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "var(--color-text)",
              marginBottom: "1rem",
            }}
          >
            200+ JavaScript Interview Questions
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-muted)",
              lineHeight: 1.7,
              maxWidth: "48rem",
              marginBottom: "1.5rem",
            }}
          >
            Comprehensive JavaScript interview prep covering closures, event
            loop, promises, async/await, prototypes,{" "}
            <code style={inlineCode}>this</code> keyword, type coercion and
            more. Questions asked at{" "}
            <strong>Razorpay, Flipkart, Google, Atlassian, Swiggy, CRED</strong>{" "}
            and other top tech companies.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                ...btn,
                background: "var(--color-accent)",
                color: "white",
                border: "none",
              }}
            >
              🚀 Practice Now — It's Free
            </Link>
            <Link
              href="/output-quiz"
              style={{
                ...btn,
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              💻 Output Quiz
            </Link>
            <Link
              href="/debug-lab"
              style={{
                ...btn,
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              🐛 Debug Lab
            </Link>
          </div>
        </div>

        {/* ── Live question list (client component, loads from Firestore) ── */}
        {/* Shows stats, company banner, and categorized question list */}
        {/* Falls back silently to static sections below if not loaded */}
        <Suspense
          fallback={
            <div
              style={{
                color: "var(--color-muted)",
                fontSize: "0.875rem",
                padding: "1rem 0",
              }}
            >
              Loading questions…
            </div>
          }
        >
          <QuestionList />
        </Suspense>

        {/* ── Static topic overview (always visible, good for SEO + fallback) ── */}
        <div style={{ marginBottom: "3rem", marginTop: "1rem" }}>
          <h2 style={h2}>Core JavaScript Topics</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.625rem",
              marginBottom: "2rem",
            }}
          >
            {TOPIC_SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} style={topicCard}>
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontSize: "0.875rem",
                  }}
                >
                  {s.title}
                </span>
              </Link>
            ))}
            <Link
              href={`/topics/${track}`}
              style={{
                ...topicCard,
                gridColumn: "span 1",
                justifyContent: "center",
                background: "var(--color-accent)",
                color: "white",
                border: "none",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "inherit",
                  fontSize: "0.875rem",
                }}
              >
                Browse All Topics →
              </span>
            </Link>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={h2}>Frequently Asked Interview Questions</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {STATIC_FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: "1.25rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Prep tips ── */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={h2}>How to Prepare for JavaScript Interviews</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {PREP_TIPS.map((tip, i) => (
              <div
                key={i}
                style={{
                  padding: "1.125rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                }}
              >
                <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  {tip.emoji}
                </div>
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.375rem",
                  }}
                >
                  {tip.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

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
              { href: "/debug-lab", text: "JavaScript Debug Lab" }
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

        {/* ── Bottom CTA ── */}
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 1.5rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            Ready to practice?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-muted)",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Interactive questions with instant feedback. Predict outputs, find
            bugs, and master JavaScript.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                ...btn,
                background: "var(--color-accent)",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                fontSize: "1rem",
              }}
            >
              Start Practicing Free →
            </Link>
            <Link
              href="/sprint"
              style={{
                ...btn,
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                padding: "0.75rem 1.5rem",
              }}
            >
              ⚡ Daily Sprint
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles (static, no CSS-in-JS needed for server component) ───────────────

function diffBg(d: string) {
  return d === "beginner"
    ? "#f0fff4"
    : d === "core"
      ? "#e8f4fd"
      : d === "advanced"
        ? "#fffbeb"
        : "#fff5f5";
}
function diffColor(d: string) {
  return d === "beginner"
    ? "#2d7a4f"
    : d === "core"
      ? "#2383e2"
      : d === "advanced"
        ? "#d97706"
        : "#c53030";
}

const inlineCode: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: "0.875em",
  background: "var(--color-bg-subtle)",
  padding: "0.1rem 0.35rem",
  borderRadius: "0.25rem",
};

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.625rem 1.25rem",
  borderRadius: "0.625rem",
  fontWeight: 700,
  fontSize: "0.9375rem",
  textDecoration: "none",
  cursor: "pointer",
};

const h2: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 900,
  color: "var(--color-text)",
  marginBottom: "1.25rem",
  paddingBottom: "0.625rem",
  borderBottom: "1px solid var(--color-border)",
};

const topicCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  padding: "0.875rem 1rem",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.625rem",
  textDecoration: "none",
};

const staticRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  padding: "0.5rem 0.875rem",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.5rem",
  textDecoration: "none",
};

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo/seo";
import { C } from "@/styles/tokens";
import { getServerTrack } from "@/lib/getServerTrack";
import InterviewQuestionList from "../javascript-interview-questions/QuestionList";

// ─── Static metadata ──────────────────────────────────────────────────────────

export const metadata: Metadata = pageMeta({
  title: "150+ React Interview Questions With Answers (2026)",
  description:
    "The most complete list of React interview questions with detailed answers and code examples. Covers components, hooks, state management, lifecycle methods, context, and more. Asked at Razorpay, Flipkart, Google, Atlassian.",
  path: "/react-interview-questions",
});

// ─── FAQ schema (static, does not need Firestore) ────────────────────────────

const REACT_STATIC_FAQS = [
  {
    q: "What is React?",
    a: "React is a JavaScript library for building user interfaces using a component-based architecture. It allows developers to create reusable UI components and efficiently update the DOM using a Virtual DOM.",
  },
  {
    q: "What is the Virtual DOM?",
    a: "The Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to compare previous and current UI states and update only the changed parts in the real DOM for better performance.",
  },
  {
    q: "What triggers a re-render in React?",
    a: "A re-render is triggered when state changes, props change, or context updates. A parent re-render can also cause child components to re-render unless optimizations like React.memo are used.",
  },
  {
    q: "What is reconciliation in React?",
    a: "Reconciliation is the process of comparing the old Virtual DOM with the new one to determine what has changed. React uses an optimized diffing algorithm to update only the necessary parts of the DOM.",
  },
  {
    q: "What is the difference between useEffect and useLayoutEffect?",
    a: "useEffect runs asynchronously after the browser paints, making it suitable for side effects like API calls. useLayoutEffect runs synchronously after DOM updates but before paint, useful for measuring layout or synchronizing UI changes.",
  },
  {
    q: "What are controlled and uncontrolled components?",
    a: "Controlled components manage form input values through React state, while uncontrolled components store their own state in the DOM and are accessed using refs. Controlled components provide better control and validation.",
  },
  {
    q: "What is React.memo?",
    a: "React.memo is a higher-order component that prevents unnecessary re-renders by memoizing a component. It performs a shallow comparison of props and skips rendering if props have not changed.",
  },
  {
    q: "What are keys in React and why are they important?",
    a: "Keys are unique identifiers used in lists to help React track elements during reconciliation. Stable keys allow React to update only changed items, improving performance and preventing UI bugs.",
  },
  {
    q: "What is batching in React?",
    a: "Batching is the process of grouping multiple state updates into a single render for performance optimization. React automatically batches updates in event handlers and async operations in modern versions.",
  },
  {
    q: "What is React Fiber?",
    a: "React Fiber is the internal reconciliation engine introduced in React 16. It enables interruptible rendering, prioritization of updates, and smoother UI by breaking work into smaller units.",
  },
];

// ─── Static topic sections (shown while QuestionList loads / as SEO content) ─

const TOPIC_SECTIONS = [
  {
    title: "Rendering & Performance",
    href: "/react-rendering-performance-interview-questions",
  },
  {
    title: "React useEffect Hook",
    href: "/react-useeffect-interview-questions",
  },
  {
    title: "React useContext Hook",
    href: "/react-usecontext-interview-questions",
  },
  {
    title: "Concurrent Rendering (React 18)",
    href: "/react-concurrent-rendering-react-18-interview-questions",
  },
  {
    title: "React useState Hook",
    href: "/react-usestate-interview-questions",
  },
  {
    title: "React Fiber Architecture",
    href: "/react-fiber-interview-questions",
  },
];

const PREP_TIPS = [
  {
    emoji: "🧠",
    title: "Understand, don't memorize",
    desc: "Focus on why React behaves the way it does — rendering patterns, state management, hooks behavior. Interviewers can tell the difference.",
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
    title: "Master the core concepts",
    desc: "Async & Effects, Component Logic, Event Loop & Batching, async/await and features cover 90% of React interviews.",
  },
  {
    emoji: "⏱️",
    title: "Practice under time pressure",
    desc: "Use the Sprint feature — 10 questions in 15 minutes. Interview pressure is real and you can train for it.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReactInterviewQuestionsPage() {

  const track = await getServerTrack();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: REACT_STATIC_FAQS.map((f) => ({
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
            React Interview Prep
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
            200+ React Interview Questions
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
            Comprehensive React interview prep covering components, hooks, state management, lifecycle methods, context, and more. Questions asked at{" "}
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
          <InterviewQuestionList />
        </Suspense>

        {/* ── Static topic overview (always visible, good for SEO + fallback) ── */}
        <div style={{ marginBottom: "3rem", marginTop: "1rem" }}>
          <h2 style={h2}>Core {track.charAt(0).toUpperCase() + track.slice(1)} Topics</h2>
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
            {REACT_STATIC_FAQS.map((faq, i) => (
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
          <h2 style={h2}>How to Prepare for React Interviews</h2>
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
                href: "/react-interview-cheatsheet",
                text: "React Interview Cheat Sheet (Printable PDF)",
              },
              { href: "/questions/hooks", text: "React Hooks Questions" },
              {
                href: "/questions/react-fundamentals",
                text: "React Fundamentals Questions",
              },
              {
                href: "/output-quiz",
                text: "React Output Prediction Quiz",
              },
              { href: "/debug-lab", text: "React Debug Lab" }
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
            bugs, and master {track.charAt(0).toUpperCase() + track.slice(1)}.
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

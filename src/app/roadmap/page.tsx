// app/roadmap/page.tsx — SERVER COMPONENT
// Full SSR for SEO: crawlers index all 16 weeks + FAQ without running JS.
// RoadmapClient handles all interactive progress tracking client-side.

import type { Metadata } from "next";
import { RoadmapClient } from "./RoadmapClient";
import { ROADMAP, TOTAL_DAYS, TOTAL_WEEKS } from "@/data/roadmap/roadmapData";

// ─── Canonical URL (update if domain changes) ────────────────────────────────
const CANONICAL = "https://jsprep.pro/roadmap";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Frontend Developer Roadmap 2026 — JavaScript, React & DSA | JSPrep",
  description:
    "The complete frontend developer roadmap for 2026. A 16-week, 112-day structured plan covering JavaScript, React, system design, machine coding, and DSA to crack ₹25+ LPA interviews at Zepto, Razorpay, CRED, and top startups.",
  keywords: [
    "frontend roadmap",
    "frontend developer roadmap 2026",
    "javascript roadmap",
    "react roadmap",
    "frontend interview preparation",
    "javascript interview roadmap",
    "react interview roadmap",
    "how to become frontend developer",
    "frontend developer learning path",
    "web developer roadmap 2026",
    "frontend roadmap india",
    "javascript learning path",
    "react learning path",
    "frontend developer skills",
    "frontend interview checklist",
  ].join(", "),
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    url: CANONICAL,
    title: "Frontend Developer Roadmap 2026 — JavaScript, React & DSA | JSPrep",
    description:
      "16-week structured roadmap: JavaScript internals → React deep dive → machine coding → DSA → system design. 112 daily tasks with progress tracking. Used by 5,000+ frontend developers.",
    siteName: "JSPrep Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Developer Roadmap 2026 | JSPrep",
    description:
      "16-week plan: JS → React → Machine Coding → DSA → System Design. 112 daily tasks, progress tracked in browser.",
  },
};

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────

function articleSchema() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Frontend Developer Roadmap 2026 — JavaScript, React, DSA & System Design",
    description:
      "A 16-week, 112-day structured execution plan for frontend developers targeting ₹25+ LPA roles. Covers JavaScript internals, React deep dive, machine coding, data structures, and system design.",
    url: CANONICAL,
    author: {
      "@type": "Organization",
      name: "JSPrep Pro",
      url: "https://jsprep.pro",
    },
    publisher: {
      "@type": "Organization",
      name: "JSPrep Pro",
      url: "https://jsprep.pro",
      logo: { "@type": "ImageObject", url: "https://jsprep.pro/og-image.png" },
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    keywords:
      "frontend roadmap, javascript roadmap, react roadmap, frontend developer 2026",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
  });
}

function howToSchema() {
  // Build steps from roadmap months
  const steps = ROADMAP.map((month) => ({
    "@type": "HowToStep",
    name: `Month ${month.month}: ${month.title}`,
    text: month.weeks
      .map(
        (w) =>
          `Week ${w.week} — ${w.title}: ${w.days
            .flatMap((d) => d.tasks.map((t) => t.text))
            .slice(0, 3)
            .join("; ")}.`,
      )
      .join(" "),
    url: `${CANONICAL}#month-${month.month}`,
  }));

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Become a Frontend Developer in 16 Weeks (2026 Roadmap)",
    description:
      "A step-by-step 16-week roadmap for frontend developers to go from fundamentals to interview-ready, covering JavaScript, React, machine coding, DSA, and system design.",
    totalTime: "P112D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
    url: CANONICAL,
    step: steps,
    tool: [
      { "@type": "HowToTool", name: "JavaScript (ES6+)" },
      { "@type": "HowToTool", name: "React 18" },
      { "@type": "HowToTool", name: "Next.js" },
      { "@type": "HowToTool", name: "TypeScript" },
    ],
  });
}

function faqSchema() {
  const faqs = [
    {
      q: "What is the best frontend developer roadmap for 2026?",
      a: "The best frontend roadmap for 2026 covers: JavaScript internals (closures, event loop, prototypes), React deep dive (hooks, rendering, performance), machine coding practice (30+ UI components), DSA for frontend interviews, and system design. This 16-week, 112-day roadmap on JSPrep covers all of these in a structured daily plan.",
    },
    {
      q: "How long does it take to learn frontend development?",
      a: "With 2–3 hours per weekday and 5–6 hours on weekends, you can become interview-ready in 16 weeks (about 4 months). This roadmap is structured for exactly that timeline — 112 daily tasks spanning JavaScript, React, machine coding, data structures, and system design.",
    },
    {
      q: "What should I learn first as a frontend developer — JavaScript or React?",
      a: "Always learn JavaScript deeply before React. React is built on JavaScript, so concepts like closures, the event loop, prototypes, and async/await must be solid before React makes sense. This roadmap dedicates the first 4 weeks (28 days) to JavaScript mastery before introducing React in Month 2.",
    },
    {
      q: "Do frontend developers need to know DSA (data structures and algorithms)?",
      a: "Yes — most senior frontend interviews at top startups include DSA rounds. You don't need competitive programming depth, but you must be comfortable with arrays, linked lists, trees, graphs, dynamic programming, and the sliding window pattern. This roadmap integrates DSA practice throughout.",
    },
    {
      q: "What is machine coding in frontend interviews?",
      a: "Machine coding rounds ask you to build a complete UI component (like an autocomplete, infinite scroll, drag-and-drop kanban, or data table) from scratch within 45–60 minutes. They test component design, state management, edge-case handling, and accessibility. Month 3 of this roadmap dedicates two full weeks to machine coding practice.",
    },
    {
      q: "What are the best companies to target for frontend developer roles in India?",
      a: "Top frontend companies in India include Zepto, Meesho, PhonePe, Razorpay, CRED, Groww, Flipkart, Swiggy, and Atlassian. This roadmap specifically prepares you for interviews at these companies by covering the topics they most commonly test.",
    },
    {
      q: "What is the JavaScript roadmap for frontend developers?",
      a: "The JavaScript roadmap for frontend developers covers: execution context and call stack, scope and closures, this keyword and binding, event loop and async patterns, prototypes and inheritance, ES6+ features, memory management, and polyfills. Weeks 1–4 of this roadmap cover all of these in depth.",
    },
    {
      q: "What is the React roadmap for frontend developers?",
      a: "The React roadmap covers: JSX and Fiber architecture, reconciliation and rendering phases, all core hooks (useState, useEffect, useMemo, useCallback, useRef, useContext, useReducer), custom hooks, performance optimization (React.memo, code splitting, virtualization), and advanced patterns like portals, error boundaries, and React 18 features.",
    },
  ];

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  });
}

function learningResourceSchema() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Frontend Developer Roadmap 2026",
    description:
      "16-week structured learning path for frontend developers: JavaScript, React, machine coding, DSA, and system design.",
    url: CANONICAL,
    learningResourceType: "Learning Path",
    educationalLevel: "Intermediate to Advanced",
    teaches: [
      "JavaScript",
      "React",
      "TypeScript",
      "Data Structures",
      "System Design",
      "Machine Coding",
    ],
    timeRequired: "P16W",
    inLanguage: "en",
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: "JSPrep Pro",
      url: "https://jsprep.pro",
    },
  });
}

// ─── SSR-Rendered Roadmap Outline (for crawlers) ──────────────────────────────
// This is the critical SEO unlock: all 16 weeks are in the initial HTML,
// meaning Google can index every task without executing JavaScript.

function RoadmapOutline() {
  return (
    <section
      aria-label="Roadmap overview — all 16 weeks"
      // Visually hidden but fully accessible to crawlers and screen readers.
      // We do NOT use display:none or visibility:hidden (those hide from crawlers too).
      // We render it at 0 height with overflow hidden — Google indexes it fine.
      style={{
        height: 0,
        overflow: "hidden",
        position: "absolute",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <h2>Frontend Developer Roadmap — All 16 Weeks</h2>
      {ROADMAP.map((month) => (
        <div key={month.month} id={`month-${month.month}`}>
          <h3>
            Month {month.month}: {month.title} — Frontend Roadmap
          </h3>
          {month.weeks.map((week) => (
            <div key={week.week}>
              <h4>
                Week {week.week}: {week.title}
              </h4>
              <ul>
                {week.days.map((day) => (
                  <li key={day.day}>
                    <strong>Day {day.day}:</strong>
                    <ul>
                      {day.tasks.map((task, i) => (
                        <li key={i}>{task.text}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

// ─── SSR FAQ (for crawlers + FAQ rich results) ────────────────────────────────
function RoadmapFAQ() {
  const faqs = [
    {
      q: "What is the best frontend developer roadmap for 2026?",
      a: "The best frontend roadmap for 2026 covers JavaScript internals, React deep dive, machine coding practice, DSA, and system design. This 16-week plan covers all of these with 112 daily structured tasks.",
    },
    {
      q: "How long does it take to become a frontend developer?",
      a: "With 2–3 hours per weekday and 5–6 hours on weekends, you can become interview-ready in 16 weeks. This roadmap is structured for exactly that timeline.",
    },
    {
      q: "Should I learn JavaScript or React first?",
      a: "JavaScript first — always. React is built on JavaScript, so closures, the event loop, and async/await must be solid before React makes sense. This roadmap spends the first 4 weeks on JavaScript mastery.",
    },
    {
      q: "Do frontend developers need DSA?",
      a: "Yes. Most senior frontend interviews include DSA rounds covering arrays, linked lists, trees, graphs, and dynamic programming. This roadmap integrates DSA throughout.",
    },
    {
      q: "What is machine coding in frontend interviews?",
      a: "Machine coding asks you to build a complete UI component (autocomplete, infinite scroll, drag-and-drop kanban) from scratch in 45–60 minutes. Month 3 of this roadmap dedicates two full weeks to machine coding practice.",
    },
    {
      q: "What is the JavaScript roadmap for 2026?",
      a: "The 2026 JavaScript roadmap covers: execution context, closures, event loop, async/await, prototypes, ES6+ features, memory management, and polyfills.",
    },
    {
      q: "What is the React roadmap for 2026?",
      a: "The 2026 React roadmap covers: Fiber architecture, reconciliation, all hooks, custom hooks, performance optimization, portals, error boundaries, and React 18 concurrent features.",
    },
  ];

  return (
    <section
      style={{
        height: 0,
        overflow: "hidden",
        position: "absolute",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <h2>Frontend Roadmap — Frequently Asked Questions</h2>
      {faqs.map(({ q, a }) => (
        <div key={q}>
          <h3>{q}</h3>
          <p>{a}</p>
        </div>
      ))}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  return (
    <>
      {/* ── JSON-LD schemas injected in <head> — crawlers read these immediately ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleSchema() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: howToSchema() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: learningResourceSchema() }}
      />

      {/* ── SSR content — Google indexes this, user sees RoadmapClient ── */}
      <RoadmapOutline />
      <RoadmapFAQ />

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
        }}
      >
        {/* ── Semantic page header — H1 is critical for rankings ── */}
        <header
          style={{
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "6px",
            }}
          >
            {/*
              H1 targets the primary keyword cluster:
              "frontend developer roadmap 2026"
              Secondary: "javascript roadmap" + "react roadmap" appear in
              the page body and schema descriptions.
            */}
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Frontend Developer Roadmap 2026 — {TOTAL_WEEKS} Weeks,{" "}
              {TOTAL_DAYS} Days
            </h1>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                padding: "3px 10px",
                borderRadius: "20px",
                background: "var(--color-amber-subtle)",
                color: "var(--color-amber)",
                border: "1px solid var(--color-amber-border)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              🔥 Roadmap
            </span>
          </div>

          {/* Subtitle — naturally embeds secondary keywords */}
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-muted)",
              fontFamily: "var(--font-mono, monospace)",
              margin: "0 0 4px",
            }}
          >
            JavaScript → React → Machine Coding → DSA → System Design
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-muted)",
              fontFamily: "var(--font-mono, monospace)",
              margin: 0,
            }}
          >
            2–3 hrs weekdays · 5–6 hrs weekends · Progress auto-saved to browser
          </p>
        </header>

        {/* ── Interactive roadmap (client-side, progress tracked in localStorage) ── */}
        <RoadmapClient />

        {/* ── Visible FAQ section — good for long-tail rankings & FAQ rich results ── */}
        <section
          style={{
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--color-text)",
              marginBottom: "1.25rem",
            }}
          >
            Frontend Roadmap — Common Questions
          </h2>

          {[
            {
              q: "What does this frontend roadmap cover?",
              a: `${TOTAL_WEEKS} weeks and ${TOTAL_DAYS} days across four phases: Month 1 (JavaScript & browser internals), Month 2 (React deep dive), Month 3 (machine coding + projects), and Month 4 (interview mode — mocks, system design, and offer negotiation).`,
            },
            {
              q: "Should I learn JavaScript or React first?",
              a: "JavaScript first — always. React is built on JavaScript, so closures, event loop, prototypes, and async patterns must be solid before React makes sense. This roadmap dedicates the entire first month to JavaScript mastery.",
            },
            {
              q: "Do I need DSA as a frontend developer?",
              a: "Yes. Most senior frontend interviews at Razorpay, CRED, Groww, and Flipkart include a DSA round. This roadmap integrates focused DSA sprints in Weeks 4, 12, and 14 — covering arrays, trees, graphs, and dynamic programming.",
            },
            {
              q: "What is machine coding and why does this roadmap spend two weeks on it?",
              a: "Machine coding rounds ask you to build a full UI component (autocomplete, drag-and-drop kanban, data table) within 45–60 minutes. They test component design, state handling, edge cases, and accessibility. Two dedicated weeks (Weeks 9–10) + one project week (Week 11) gives you the reps needed to build any component confidently under pressure.",
            },
            {
              q: "How is this different from roadmap.sh?",
              a: "roadmap.sh shows you what to learn. This roadmap tells you what to do each day, gives you practice tasks, machine coding builds, and DSA problems — all ordered to build interview-ready skill, not just knowledge. It's an execution plan, not a topic map.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              style={{
                borderBottom: "1px solid var(--color-border)",
                padding: "0.875rem 0",
              }}
            >
              <summary
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--color-text)",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {q}
                <span
                  style={{
                    fontSize: "16px",
                    color: "var(--color-muted)",
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </summary>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-muted)",
                  lineHeight: 1.6,
                  marginTop: "0.625rem",
                  marginBottom: 0,
                }}
              >
                {a}
              </p>
            </details>
          ))}
        </section>

        {/* ── Internal links — help Google understand site structure ── */}
        <nav
          aria-label="Related resources"
          style={{
            marginTop: "2rem",
            padding: "1rem 1.25rem",
            background: "var(--color-bg-subtle)",
            borderRadius: "10px",
            border: "1px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-muted)",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: "0.625rem",
            }}
          >
            Practice alongside this roadmap →
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              { label: "JavaScript Questions", href: "/topics/javascript" },
              { label: "React Questions", href: "/topics/react" },
              { label: "Polyfill Lab", href: "/polyfill-lab" },
              { label: "Interview Sprint", href: "/sprint" },
              {
                label: "JS Closures",
                href: "/javascript-closure-interview-questions",
              },
              {
                label: "React Hooks",
                href: "/react-usestate-interview-questions",
              },
              {
                label: "Event Loop",
                href: "/javascript-event-loop-interview-questions",
              },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: "12px",
                  color: "var(--color-accent)",
                  textDecoration: "none",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo/seo";
import QuestionList from "./QuestionList";
import {
  DocClose,
  DocHero,
  DocSection,
  FaqRows,
  LinkGrid,
  RelatedLinks,
  TipSteps,
} from "@/components/seo/DocParts";

// ─── Static metadata ──────────────────────────────────────────────────────────

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Questions With Answers (2026)",
  description:
    "JavaScript interview questions with detailed answers and code examples. Covers closures, event loop, promises, async/await, prototypes, this keyword, type coercion and more.",
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
    a: 'undefined means a variable has been declared but not assigned. null is an explicit assignment meaning "no value". typeof null returns "object", a historic JavaScript bug.',
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
    title: "Understand, don't memorize",
    desc: "Focus on why JavaScript behaves the way it does: coercion rules, event loop mechanics, closure semantics. Interviewers can tell the difference.",
  },
  {
    title: "Predict output before running",
    desc: "Use output quiz questions to train your mental model. If you can predict what code logs, you truly understand the concept.",
  },
  {
    title: "Debug real bugs",
    desc: "Practice with buggy code that produces wrong output silently, not syntax errors. Real interview bugs are always logical, not typos.",
  },
  {
    title: "Master the big 8 concepts",
    desc: "Closures, this binding, event loop, prototypes, async/await, type coercion, hoisting, and ES6+ features cover 90% of JavaScript interviews.",
  },
  {
    title: "Formats vary by company",
    desc: "Rounds and emphasis differ between companies. Ask your recruiter what to expect, and look for recent interview reports from candidates at that company.",
  },
  {
    title: "Practice under time pressure",
    desc: "Use the Sprint feature: 10 questions in 15 minutes. Interview pressure is real and you can train for it.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JSInterviewQuestionsPage() {
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

      <main className="doc">
        <DocHero
          title="JavaScript Interview Questions"
          lede={
            <>
              Comprehensive JavaScript interview prep covering closures, event
              loop, promises, async/await, prototypes, <code>this</code> keyword,
              type coercion and more.
            </>
          }
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Practice now, it’s free
              </Link>
              <Link href="/output-quiz" className="btn">
                Output Quiz
              </Link>
              <Link href="/debug-lab" className="btn">
                Debug Lab
              </Link>
            </>
          }
        />

        {/* ── Live question list (client component, loads from Firestore) ── */}
        <Suspense fallback={<p className="doc-line">Loading questions…</p>}>
          <QuestionList />
        </Suspense>

        {/* ── Static topic overview (always visible, good for SEO + fallback) ── */}
        <DocSection title="Core JavaScript Topics">
          <LinkGrid
            items={[
              ...TOPIC_SECTIONS,
              { title: "Browse All Topics", href: "/topics/javascript" },
            ]}
          />
        </DocSection>

        <DocSection title="Frequently Asked Interview Questions">
          <FaqRows items={STATIC_FAQS} />
        </DocSection>

        <DocSection title="How to Prepare for JavaScript Interviews">
          <TipSteps items={PREP_TIPS} />
        </DocSection>

        <DocSection title="Related Resources">
          <RelatedLinks
            items={[
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
            ]}
          />
        </DocSection>

        <DocClose
          title="Ready to practice?"
          line="Interactive questions with instant feedback. Predict outputs, find bugs, and master JavaScript."
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Start practicing free
              </Link>
              <Link href="/sprint" className="btn">
                Daily Sprint
              </Link>
            </>
          }
        />
      </main>
    </>
  );
}

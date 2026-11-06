import type { Metadata } from "next";
import Link from "next/link";
import {
  DocClose,
  DocHero,
  DocSection,
  FaqRows,
  LinkGrid,
  RelatedLinks,
  TipSteps,
} from "@/components/seo/DocParts";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo/seo";
import InterviewQuestionList from "../javascript-interview-questions/QuestionList";

// ─── Static metadata ──────────────────────────────────────────────────────────

export const metadata: Metadata = pageMeta({
  title: "React Interview Questions With Answers (2026)",
  description:
    "React interview questions with detailed answers and code examples. Covers components, hooks, state management, lifecycle methods, context, and more.",
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
    title: "Understand, don't memorize",
    desc: "Focus on why React behaves the way it does, rendering patterns, state management, hooks behavior. Interviewers can tell the difference.",
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
    title: "Master the core concepts",
    desc: "Async & Effects, Component Logic, Event Loop & Batching, async/await and features cover 90% of React interviews.",
  },
  {
    title: "Practice under time pressure",
    desc: "Use the Sprint feature, 10 questions in 15 minutes. Interview pressure is real and you can train for it.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReactInterviewQuestionsPage() {

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

      <main className="doc">
        <DocHero
          title="React Interview Questions"
          lede={
            <>
              Comprehensive React interview prep covering components, hooks, state management, lifecycle methods, context, and more.
            </>
          }
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Practice Now, It’s Free
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
          <InterviewQuestionList forcedTrack="react" />
        </Suspense>

        {/* ── Static topic overview (always visible, good for SEO + fallback) ── */}
        <DocSection title="Core React Topics">
          <LinkGrid
            items={[
              ...TOPIC_SECTIONS,
              { title: "Browse All Topics", href: `/topics/react` },
            ]}
          />
        </DocSection>

        <DocSection title="Frequently Asked Interview Questions">
          <FaqRows items={REACT_STATIC_FAQS} />
        </DocSection>

        <DocSection title="How to Prepare for React Interviews">
          <TipSteps items={PREP_TIPS} />
        </DocSection>

        <DocSection title="Related Resources">
          <RelatedLinks
            items={[
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
            ]}
          />
        </DocSection>

        <DocClose
          title="Ready to practice?"
          line="Interactive questions with instant feedback. Predict outputs, find bugs, and master React."
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Start Practicing Free
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

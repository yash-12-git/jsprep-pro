// app/page.tsx — SERVER COMPONENT
// Emotion cannot run in server components (uses createContext internally).
// This file is a pure server shell that:
//   1. Fetches track-specific data server-side
//   2. Injects JSON-LD schema tags (crawlers see this in initial HTML)
//   3. Renders <HomePageClient> which handles all Emotion / client logic

import { courseSchema, faqSchema } from "@/lib/seo/seo";
import HomePageClient from "./HomePageClient";
import { getServerTrack } from "@/lib/getServerTrack";
import {
  getPublishedBlogPosts,
  getPublishedTopics,
  getQuestions,
} from "@/lib/cachedQueries";
import type { FAQItem } from "@/lib/seo/seo";
import { Track } from "@/lib/tracks";

// ─── Track-aware FAQ builder ──────────────────────────────────────────────────

const TRACK_FAQ: Record<Track, FAQItem[]> = {
  javascript: [
    {
      question: "What JavaScript interview topics does JSPrep Pro cover?",
      answer:
        "JSPrep Pro covers 40 JavaScript topics including Closures, Event Loop, Promises, async/await, Hoisting, Prototypes, the `this` keyword, Type Coercion, Scope, and more — with theory questions, output prediction, debug challenges, and polyfill exercises.",
    },
    {
      question: "What are JavaScript output prediction questions?",
      answer:
        "Output prediction questions show you a snippet of JavaScript and ask what the console prints. They test real knowledge of coercion, hoisting, closures, and async behaviour — exactly how top companies like Razorpay, Atlassian, and Flipkart interview.",
    },
    {
      question: "What is a JavaScript polyfill interview question?",
      answer:
        "Polyfill questions ask you to implement native JavaScript methods from scratch — like Array.prototype.map, Function.prototype.bind, or Promise.all. These are common in senior frontend interviews and tested in JSPrep Pro's Polyfill Lab.",
    },
  ],
  react: [
    {
      question: "What React interview topics does JSPrep Pro cover?",
      answer:
        "JSPrep Pro covers React hooks (useState, useEffect, useMemo, useCallback, useRef), component lifecycle, state management, rendering behaviour, performance optimisation, Context API, and design patterns like compound components.",
    },
    {
      question: "How does JSPrep Pro help with React hook interview questions?",
      answer:
        "Beyond theory, JSPrep Pro includes output prediction questions where you predict what renders or logs given specific hook behaviour — re-render traps, stale closures, batching, and more. AI grades your written explanations like a senior engineer would.",
    },
    {
      question: "Does JSPrep Pro cover React performance interview questions?",
      answer:
        "Yes. JSPrep Pro covers React.memo, useMemo, useCallback, lazy loading, code splitting, reconciliation, and virtual DOM diffing — with AI-scored written answers so you learn to explain these concepts clearly, not just recognise them.",
    },
  ],
  typescript: [
    {
      question: "What TypeScript interview topics does JSPrep Pro cover?",
      answer:
        "JSPrep Pro covers TypeScript types and interfaces, generics, utility types (Partial, Pick, Omit, Required, ReturnType), type narrowing, conditional types, mapped types, template literal types, and TypeScript with React.",
    },
    {
      question: "Are TypeScript generics commonly asked in interviews?",
      answer:
        "Yes — TypeScript generics are one of the most frequently asked topics in senior frontend interviews. JSPrep Pro includes written questions where you explain generics, debug generic type errors, and implement utility types from scratch.",
    },
    {
      question:
        "What is the difference between `interface` and `type` in TypeScript?",
      answer:
        "An interface is primarily for object shapes and supports declaration merging and extension. A type alias is more flexible — it can represent primitives, unions, intersections, and tuples, but cannot be re-opened. Both can extend each other. JSPrep Pro covers this and dozens of similar TypeScript interview questions in depth.",
    },
  ],
  "system-design": [
    {
      question: "What frontend system design topics does JSPrep Pro cover?",
      answer:
        "JSPrep Pro covers frontend architecture patterns, micro-frontends (module federation), API design (REST vs GraphQL vs tRPC), CDN and caching strategies, real-time systems (WebSockets, SSE), Core Web Vitals, lazy loading, and designing scalable SPAs.",
    },
    {
      question: "Is system design asked in frontend interviews?",
      answer:
        "Yes — especially for senior roles. Companies like Google, Meta, and top Indian startups ask frontend system design questions like 'design a real-time chat UI', 'design an infinite scroll feed', or 'how would you architect a micro-frontend at scale'. JSPrep Pro prepares you for all of these.",
    },
    {
      question: "How does JSPrep Pro teach frontend system design?",
      answer:
        "JSPrep Pro uses open-ended written questions graded by AI, like a mock interview. You explain your approach, and AI evaluates your answer for completeness, trade-off awareness, and senior-level thinking — then gives specific feedback on what you missed.",
    },
  ],
};

// Shared FAQ items shown on every track
const SHARED_FAQ: FAQItem[] = [
  {
    question: "What is JSPrep Pro?",
    answer:
      "JSPrep Pro is a frontend interview preparation platform with 600+ questions covering JavaScript, React, TypeScript, and System Design. It includes AI-scored written answers, output prediction, debug challenges, Interview Sprint, and 40+ topic deep-dives — all tailored for frontend developers.",
  },
  {
    question: "Is JSPrep Pro free to use?",
    answer:
      "Yes. JSPrep Pro offers 200+ theory questions completely free across JavaScript, React, TypeScript, and System Design — forever, no credit card required. The Pro plan unlocks all 900+ questions, unlimited Interview Sprints, AI tools, Study Plan, Cheat Sheet, and more.",
  },
  {
    question: "What is the Interview Sprint?",
    answer:
      "The Interview Sprint is a timed mixed-question challenge combining theory, output prediction, and debugging questions. AI scores your open-ended answers 1–10, and you get a final score card showing your strengths and areas to improve — exactly like a real technical screen.",
  },
  {
    question: "How is JSPrep Pro different from other interview prep sites?",
    answer:
      "Most prep sites only offer MCQ theory questions. JSPrep Pro adds output prediction questions (predict what prints), debug challenges (find and fix bugs), and polyfill exercises (implement from scratch). It also uses AI to score open-ended written answers, giving specific feedback — not just 'correct' or 'wrong'.",
  },
  {
    question: "Which tracks does JSPrep Pro support?",
    answer:
      "JSPrep Pro currently supports JavaScript (200+ questions), React (150+ questions), and TypeScript and System Design (coming soon with early access). Switch between tracks from the top navigation.",
  },
];

function buildFaq(): FAQItem[] {
  // Track-specific questions first, then shared platform questions
  return [
    ...TRACK_FAQ.javascript,
    ...TRACK_FAQ.react,
    ...TRACK_FAQ.typescript,
    ...TRACK_FAQ["system-design"],
    ...SHARED_FAQ,
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const track = await getServerTrack();

  const [theory, output, debug, polyfill, topics, blogs] = await Promise.all([
    getQuestions({
      filters: { track, status: "published", type: "theory" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "output" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "debug" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getQuestions({
      filters: { track, status: "published", type: "polyfill" },
      pageSize: 300,
    }).catch(() => ({ questions: [] })),
    getPublishedTopics({ track }),
    getPublishedBlogPosts({ track }),
  ]);

  return (
    <>
      {/* Schema injected server-side — crawlers see this immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: courseSchema(track) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema(buildFaq()) }}
      />
      <HomePageClient
        track={track}
        theory={theory.questions?.length ?? 0}
        debug={debug.questions?.length ?? 0}
        output={output.questions?.length ?? 0}
        polyfill={polyfill.questions?.length ?? 0}
        topics={topics}
        blogs={blogs}
      />
    </>
  );
}

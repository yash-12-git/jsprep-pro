import { Track } from "@/lib/tracks";
import { C } from "@/styles/tokens";
import { Brain, Bug, FileText, Mic, Sparkles, Target } from "lucide-react";

export const TESTIMONIALS = [
  {
    name: "Yogita Munjal",
    role: "Backend Dev → EasyEcom",
    av: "YM",
    c: "#7c6af7",
    quote:
      "The questions I practiced were almost identical to what was asked in my interview — something I wouldn’t have prepared on my own. Great platform for targeted prep.",
  },
  {
    name: "Yash Maheshwari",
    role: "React Dev → Bajaj Finserv Health",
    av: "YM",
    c: "#6af7c0",
    quote:
      "The AI evaluator is the real thing. It told me I was hand-waving through closures. Fixed it, aced the Bajaj Finser Health round. Worth every rupee.",
  },
  {
    name: "Smridhi Soni",
    role: "2 YOE → Atlassian",
    av: "SS",
    c: "#f7c76a",
    quote:
      "Failed my first Atlassian screen because of the event loop. Spent a week here, went back for round 2, passed. Completely different outcome.",
  },
];

export const TRACK_HERO: Record<
  Track,
  {
    badge: string;
    title: string;
    accent: string;
    sub: string;
    freeLine: string;
  }
> = {
  javascript: {
    badge: "Train for Real JavaScript Interviews",
    title: "JavaScript Interview",
    accent: "Questions & Practice.",
    sub: "Practice real JavaScript interview questions, take timed Interview Sprint and know exactly if you're ready.",
    freeLine: "core JavaScript questions — free, forever.",
  },
  react: {
    badge: "Train for Real React Interviews",
    title: "React Interview",
    accent: "Questions & Practice.",
    sub: "Master React hooks, state management, and component patterns. AI-scored answers, not just multiple choice.",
    freeLine: "core React questions — free, forever.",
  },
  typescript: {
    badge: "Train for Real TypeScript Interviews",
    title: "TypeScript Interview",
    accent: "Questions & Practice.",
    sub: "Level up with TypeScript types, generics, and utility types. Real interview questions with AI-graded answers.",
    freeLine: "core TypeScript questions — free, forever.",
  },
  "system-design": {
    badge: "Train for Frontend System Design",
    title: "System Design Interview",
    accent: "Questions & Practice.",
    sub: "Master frontend architecture, scalability patterns, and system design for senior engineering roles.",
    freeLine: "system design questions — free, forever.",
  },
};

export const TRACK_WHY: Record<
  Track,
  Array<{ emoji: string; label: string; before: string; after: string }>
> = {
  javascript: [
    {
      emoji: "📖",
      label: "Theory",
      before: "Read definitions on MDN",
      after: "Understand with AI + code examples",
    },
    {
      emoji: "💻",
      label: "Output Questions",
      before: "Get surprised in interviews",
      after: "Predict output confidently",
    },
    {
      emoji: "🐛",
      label: "Debug Challenges",
      before: "Never practiced bug fixing",
      after: "AI-scored real bug fixing practice",
    },
    {
      emoji: "🧪",
      label: "Polyfill Lab",
      before: "Skipped polyfills entirely",
      after: "Write reduce, bind, Promise.all with test feedback",
    },
  ],
  react: [
    {
      emoji: "🪝",
      label: "Hooks",
      before: "Memorised hook rules blindly",
      after: "Understand closure traps & dependency arrays",
    },
    {
      emoji: "🔄",
      label: "State & Rendering",
      before: "Guessed why re-renders happen",
      after: "Predict render behaviour with confidence",
    },
    {
      emoji: "🧩",
      label: "Patterns",
      before: "Copy-paste HOCs without understanding",
      after: "Explain compound, render-prop & context patterns",
    },
    {
      emoji: "⚡",
      label: "Performance",
      before: "Added memo() everywhere hoping for the best",
      after: "Know exactly when useMemo & useCallback help",
    },
  ],
  typescript: [
    {
      emoji: "🔷",
      label: "Types & Interfaces",
      before: "Used `any` to silence errors",
      after: "Write precise types that catch bugs at compile time",
    },
    {
      emoji: "🧬",
      label: "Generics",
      before: "Avoided generics — too complex",
      after: "Write reusable, type-safe generic functions",
    },
    {
      emoji: "🛠️",
      label: "Utility Types",
      before: "Re-wrote types from scratch every time",
      after: "Use Partial, Pick, Omit & infer with ease",
    },
    {
      emoji: "📐",
      label: "Type Narrowing",
      before: "Relied on type assertions everywhere",
      after: "Narrow types safely with guards & discriminated unions",
    },
  ],
  "system-design": [
    {
      emoji: "🏗️",
      label: "Architecture",
      before: "No structured way to think about scale",
      after: "Apply proven frontend architecture patterns",
    },
    {
      emoji: "🌐",
      label: "APIs & Data",
      before: "Vague answers about REST vs GraphQL",
      after: "Explain trade-offs with concrete examples",
    },
    {
      emoji: "📦",
      label: "Micro-frontends",
      before: "Never heard of module federation",
      after: "Design scalable MFE systems confidently",
    },
    {
      emoji: "⚡",
      label: "Performance at Scale",
      before: "Said 'use CDN' and hoped for the best",
      after: "Discuss caching, lazy loading & Core Web Vitals strategically",
    },
  ],
};

export const TRACK_MODES: Record<
  Track,
  Array<{
    label: string;
    emoji: string;
    href: string;
    c: string;
    free?: boolean;
    desc: string;
    tags: string[];
  }>
> = {
  javascript: [
    {
      label: "Concepts",
      emoji: "📖",
      href: "/theory",
      c: C.accent,
      free: true,
      desc: "Core JS theory with AI-graded written answers. Not MCQ — you explain it.",
      tags: ["Closures", "Scope", "Prototypes", "Event Loop"],
    },
    {
      label: "Output Quiz",
      emoji: "💻",
      href: "/output-quiz",
      c: C.amber,
      free: true,
      desc: "Predict what the console prints. The most common real interview format.",
      tags: ["Coercion", "Hoisting", "Async", "this"],
    },
    {
      label: "Debug Lab",
      emoji: "🐛",
      href: "/debug-lab",
      c: C.red,
      desc: "Find and fix real bugs. AI tells you exactly what you missed.",
      tags: ["Async bugs", "Scope issues", "Logic errors"],
    },
    {
      label: "Polyfill Lab",
      emoji: "🧪",
      href: "/polyfill-lab",
      c: C.green,
      desc: "Write Array.map, Promise.all and bind from scratch with test feedback.",
      tags: ["Array methods", "Promises", "bind / call"],
    },
  ],
  react: [
    {
      label: "Concepts",
      emoji: "📖",
      href: "/theory",
      c: C.accent,
      free: true,
      desc: "React theory with AI-graded written answers. Explain hooks, lifecycle, and patterns.",
      tags: ["Hooks", "Lifecycle", "Context", "Rendering"],
    },
    {
      label: "Output Quiz",
      emoji: "💻",
      href: "/output-quiz",
      c: C.amber,
      free: false,
      desc: "Predict what renders. Re-render traps, stale closures, batching — all covered.",
      tags: ["Re-renders", "Batching", "Stale state", "Refs"],
    },
    {
      label: "Debug Lab",
      emoji: "🐛",
      href: "/debug-lab",
      c: C.red,
      desc: "Find bugs in real React code. Infinite loops, missing deps, stale closures.",
      tags: ["useEffect bugs", "Missing deps", "Key issues"],
    },
    {
      label: "Polyfill Lab",
      emoji: "🧪",
      href: "/polyfill-lab",
      c: C.green,
      desc: "Build custom hooks and utility functions from scratch with test feedback.",
      tags: ["Custom hooks", "useReducer", "Composition"],
    },
  ],
  typescript: [
    {
      label: "Concepts",
      emoji: "📖",
      href: "/theory",
      c: C.accent,
      free: true,
      desc: "TypeScript theory — explain types, interfaces, generics and type narrowing in your own words.",
      tags: ["Types", "Generics", "Narrowing", "Inference"],
    },
    {
      label: "Output Quiz",
      emoji: "💻",
      href: "/output-quiz",
      c: C.amber,
      free: true,
      desc: "Predict TypeScript's compile-time output. What type does this expression produce?",
      tags: ["Type inference", "Conditional types", "Mapped types"],
    },
    {
      label: "Debug Lab",
      emoji: "🐛",
      href: "/debug-lab",
      c: C.red,
      desc: "Fix real TypeScript errors. Beyond red squiggles — understand why they happen.",
      tags: ["Type errors", "Strict mode", "Assertion bugs"],
    },
    {
      label: "Polyfill Lab",
      emoji: "🧪",
      href: "/polyfill-lab",
      c: C.green,
      desc: "Implement utility types from scratch: Partial, Required, DeepReadonly and more.",
      tags: ["Utility types", "Mapped types", "infer"],
    },
  ],
  "system-design": [
    {
      label: "Concepts",
      emoji: "📖",
      href: "/theory",
      c: C.accent,
      free: true,
      desc: "Explain frontend architecture decisions — CDNs, caching, MFEs — like a senior engineer.",
      tags: ["Architecture", "Scalability", "Trade-offs"],
    },
    {
      label: "Output Quiz",
      emoji: "💻",
      href: "/output-quiz",
      c: C.amber,
      free: true,
      desc: "Identify bottlenecks and failure points in given system diagrams.",
      tags: ["Bottlenecks", "SPOFs", "Load patterns"],
    },
    {
      label: "Debug Lab",
      emoji: "🐛",
      href: "/debug-lab",
      c: C.red,
      desc: "Diagnose real production issues — slow TTFBs, layout shifts, memory leaks.",
      tags: ["Core Web Vitals", "Memory", "Network"],
    },
    {
      label: "Polyfill Lab",
      emoji: "🧪",
      href: "/polyfill-lab",
      c: C.green,
      desc: "Design systems from scratch: file upload service, infinite scroll, real-time chat.",
      tags: ["Design exercises", "API design", "State sync"],
    },
  ],
};

export const AI_TOOLS = [
  {
    icon: Target,
    label: "Answer Evaluator",
    desc: "Type your answer, get scored 1–10 with specific gaps",
    c: "#7c6af7",
  },
  {
    icon: Sparkles,
    label: "AI Tutor",
    desc: "Ask follow-ups on any question, get real examples",
    c: "#6af7c0",
  },
  {
    icon: Bug,
    label: "Code Checker",
    desc: "AI validates your fix and suggests a cleaner approach",
    c: "#f76a6a",
  },
  {
    icon: Mic,
    label: "Mock Interviewer",
    desc: "Full back-and-forth with an AI senior engineer",
    c: "#f7c76a",
  },
  {
    icon: Brain,
    label: "Study Plan",
    desc: "Personalized day-by-day prep from your weak spots",
    c: "#a78bfa",
  },
  {
    icon: FileText,
    label: "Cheat Sheet",
    desc: "36-topic revision cards, printable PDF",
    c: "#6af7c0",
  },
];

export const LEADERS = [
  {
    name: "Yash Maheshwari",
    xp: 380,
    av: "Y",
    medal: "🥇",
    bg: "rgba(247,199,106,0.08)",
  },
  { name: "Susnata Das", xp: 290, av: "S", medal: "🥈", bg: "transparent" },
  {
    name: "Shiv Malhar Dixit",
    xp: 215,
    av: "S",
    medal: "🥉",
    bg: "transparent",
  },
];

export const proFeatures = [
  "Everything in Free",
  "Interview Sprint — unlimited",
  "All output, debug, polyfill questions",
  "Unlimited mastery tracking",
  "Bookmarks + cloud sync",
  "Timed quiz / flashcard mode",
  "AI Tutor on every question",
  "AI Answer Evaluator",
  "AI Code Checker",
  "AI Mock Interviewer",
  "AI Study Plan generator",
  "Daily streak tracking",
  "All future content",
];

export const FREE_F = [
  "All theory questions",
  "Interview Sprint — 5-question warmup",
  "Daily Question of the Day + AI eval",
  "First 5 output + 5 debug questions",
  "First 5 polyfill challenges",
  "Weekly XP leaderboard",
  "Interview Cheat Sheet",
  "Deep Dives (in-depth concept explanations)",
];

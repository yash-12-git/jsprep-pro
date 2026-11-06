import { Track } from "@/lib/tracks";
import { Brain, Bug, FileText, Mic, Sparkles, Target } from "lucide-react";

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
    freeLine: "core JavaScript questions free.",
  },
  react: {
    badge: "Train for Real React Interviews",
    title: "React Interview",
    accent: "Questions & Practice.",
    sub: "Master React hooks, state management, and component patterns. AI-scored answers, not just multiple choice.",
    freeLine: "core React questions free.",
  },
  typescript: {
    badge: "Train for Real TypeScript Interviews",
    title: "TypeScript Interview",
    accent: "Questions & Practice.",
    sub: "Level up with TypeScript types, generics, and utility types. Real interview questions with AI-graded answers.",
    freeLine: "core TypeScript questions free.",
  },
  "system-design": {
    badge: "Train for Frontend System Design",
    title: "System Design Interview",
    accent: "Questions & Practice.",
    sub: "Master frontend architecture, scalability patterns, and system design for senior engineering roles.",
    freeLine: "system design questions free.",
  },
};

export const TRACK_WHY: Record<
  Track,
  Array<{ label: string; before: string; after: string }>
> = {
  javascript: [
    {
      label: "Theory",
      before: "Read definitions on MDN",
      after: "Understand with AI + code examples",
    },
    {
      label: "Output Questions",
      before: "Get surprised in interviews",
      after: "Predict output confidently",
    },
    {
      label: "Debug Challenges",
      before: "Never practiced bug fixing",
      after: "AI-scored real bug fixing practice",
    },
    {
      label: "Polyfill Lab",
      before: "Skipped polyfills entirely",
      after: "Write reduce, bind, Promise.all with test feedback",
    },
  ],
  react: [
    {
      label: "Hooks",
      before: "Memorised hook rules blindly",
      after: "Understand closure traps & dependency arrays",
    },
    {
      label: "State & Rendering",
      before: "Guessed why re-renders happen",
      after: "Predict render behaviour with confidence",
    },
    {
      label: "Patterns",
      before: "Copy-paste HOCs without understanding",
      after: "Explain compound, render-prop & context patterns",
    },
    {
      label: "Performance",
      before: "Added memo() everywhere hoping for the best",
      after: "Know exactly when useMemo & useCallback help",
    },
  ],
  typescript: [
    {
      label: "Types & Interfaces",
      before: "Used `any` to silence errors",
      after: "Write precise types that catch bugs at compile time",
    },
    {
      label: "Generics",
      before: "Avoided generics, too complex",
      after: "Write reusable, type-safe generic functions",
    },
    {
      label: "Utility Types",
      before: "Re-wrote types from scratch every time",
      after: "Use Partial, Pick, Omit & infer with ease",
    },
    {
      label: "Type Narrowing",
      before: "Relied on type assertions everywhere",
      after: "Narrow types safely with guards & discriminated unions",
    },
  ],
  "system-design": [
    {
      label: "Architecture",
      before: "No structured way to think about scale",
      after: "Apply proven frontend architecture patterns",
    },
    {
      label: "APIs & Data",
      before: "Vague answers about REST vs GraphQL",
      after: "Explain trade-offs with concrete examples",
    },
    {
      label: "Micro-frontends",
      before: "Never heard of module federation",
      after: "Design scalable MFE systems confidently",
    },
    {
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
    href: string;
    free?: boolean;
    desc: string;
    tags: string[];
  }>
> = {
  javascript: [
    {
      label: "Concepts",
      href: "/theory",
      free: true,
      desc: "Core JS theory with AI-graded written answers. Not MCQ, you explain it.",
      tags: ["Closures", "Scope", "Prototypes", "Event Loop"],
    },
    {
      label: "Output Quiz",
      href: "/output-quiz",
      free: true,
      desc: "Predict what the console prints. The most common real interview format.",
      tags: ["Coercion", "Hoisting", "Async", "this"],
    },
    {
      label: "Debug Lab",
      href: "/debug-lab",
      desc: "Find and fix real bugs. AI tells you exactly what you missed.",
      tags: ["Async bugs", "Scope issues", "Logic errors"],
    },
    {
      label: "Polyfill Lab",
      href: "/polyfill-lab",
      desc: "Write Array.map, Promise.all and bind from scratch with test feedback.",
      tags: ["Array methods", "Promises", "bind / call"],
    },
  ],
  react: [
    {
      label: "Concepts",
      href: "/theory",
      free: true,
      desc: "React theory with AI-graded written answers. Explain hooks, lifecycle, and patterns.",
      tags: ["Hooks", "Lifecycle", "Context", "Rendering"],
    },
    {
      label: "Output Quiz",
      href: "/output-quiz",
      free: false,
      desc: "Predict what renders. Re-render traps, stale closures, batching, all covered.",
      tags: ["Re-renders", "Batching", "Stale state", "Refs"],
    },
    {
      label: "Debug Lab",
      href: "/debug-lab",
      desc: "Find bugs in real React code. Infinite loops, missing deps, stale closures.",
      tags: ["useEffect bugs", "Missing deps", "Key issues"],
    },
    {
      label: "Polyfill Lab",
      href: "/polyfill-lab",
      desc: "Build custom hooks and utility functions from scratch with test feedback.",
      tags: ["Custom hooks", "useReducer", "Composition"],
    },
  ],
  typescript: [
    {
      label: "Concepts",
      href: "/theory",
      free: true,
      desc: "TypeScript theory: explain types, interfaces, generics and type narrowing in your own words.",
      tags: ["Types", "Generics", "Narrowing", "Inference"],
    },
    {
      label: "Output Quiz",
      href: "/output-quiz",
      free: true,
      desc: "Predict TypeScript's compile-time output. What type does this expression produce?",
      tags: ["Type inference", "Conditional types", "Mapped types"],
    },
    {
      label: "Debug Lab",
      href: "/debug-lab",
      desc: "Fix real TypeScript errors. Beyond red squiggles, understand why they happen.",
      tags: ["Type errors", "Strict mode", "Assertion bugs"],
    },
    {
      label: "Polyfill Lab",
      href: "/polyfill-lab",
      desc: "Implement utility types from scratch: Partial, Required, DeepReadonly and more.",
      tags: ["Utility types", "Mapped types", "infer"],
    },
  ],
  "system-design": [
    {
      label: "Concepts",
      href: "/theory",
      free: true,
      desc: "Explain frontend architecture decisions (CDNs, caching, MFEs) like a senior engineer.",
      tags: ["Architecture", "Scalability", "Trade-offs"],
    },
    {
      label: "Output Quiz",
      href: "/output-quiz",
      free: true,
      desc: "Identify bottlenecks and failure points in given system diagrams.",
      tags: ["Bottlenecks", "SPOFs", "Load patterns"],
    },
    {
      label: "Debug Lab",
      href: "/debug-lab",
      desc: "Diagnose real production issues: slow TTFBs, layout shifts, memory leaks.",
      tags: ["Core Web Vitals", "Memory", "Network"],
    },
    {
      label: "Polyfill Lab",
      href: "/polyfill-lab",
      desc: "Design systems from scratch: file upload service, infinite scroll, real-time chat.",
      tags: ["Design exercises", "API design", "State sync"],
    },
  ],
};

export const AI_TOOLS = [
  {
    icon: Target,
    label: "Answer Evaluator",
    desc: "Type your answer, get scored 1 to 10 with specific gaps",
  },
  {
    icon: Sparkles,
    label: "AI Tutor",
    desc: "Ask follow-ups on any question, get real examples",
  },
  {
    icon: Bug,
    label: "Code Checker",
    desc: "AI validates your fix and suggests a cleaner approach",
  },
  {
    icon: Mic,
    label: "Mock Interviewer",
    desc: "Full back-and-forth with an AI senior engineer",
  },
  {
    icon: Brain,
    label: "Study Plan",
    desc: "Personalized day-by-day prep from your weak spots",
  },
  {
    icon: FileText,
    label: "Revision Cards",
    desc: "36-topic revision cards, printable PDF",
  },
];

export const proFeatures = [
  "Everything in Free",
  "Interview Sprint, unlimited",
  "Interactive practice on all output, debug and polyfill questions",
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
  "Interview Sprint, 5-question warmup",
  "Daily Question of the Day + AI eval",
  "Interactive practice on the first 5 output + 5 debug questions",
  "Interactive practice on the first 5 polyfill challenges",
  "JavaScript and React cheat sheets",
  "Deep Dives (in-depth concept explanations)",
];

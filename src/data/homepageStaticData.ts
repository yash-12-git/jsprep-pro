import { Brain, Bug, FileText, Mic, Sparkles, Target } from "lucide-react";

export const TOPICS = [
  {
    label: "Closures",
    slug: "javascript-closure-interview-questions",
    diff: "Core",
    qs: 12,
    c: "#7c6af7",
  },
  {
    label: "Event Loop",
    slug: "javascript-event-loop-interview-questions",
    diff: "Advanced",
    qs: 9,
    c: "#f7c76a",
  },
  {
    label: "Promises",
    slug: "javascript-promises-interview-questions",
    diff: "Core",
    qs: 11,
    c: "#6af7c0",
  },
  {
    label: "Hoisting",
    slug: "javascript-hoisting-interview-questions",
    diff: "Beginner",
    qs: 8,
    c: "#7c6af7",
  },
  {
    label: "this Keyword",
    slug: "javascript-this-keyword-interview-questions",
    diff: "Core",
    qs: 10,
    c: "#f76a6a",
  },
  {
    label: "async/await",
    slug: "javascript-async-await-interview-questions",
    diff: "Core",
    qs: 9,
    c: "#6af7c0",
  },
];

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

export const MODES = [
  {
    emoji: "📖",
    label: "Theory",
    c: "#7c6af7",
    n: "90+",
    free: true,
    href: "/theory",
    desc: "Deep explanations, code examples, hints, and AI follow-up on every question.",
    tags: ["Closures", "Prototypes", "Event Loop", "Promises"],
  },
  {
    emoji: "💻",
    label: "Output Quiz",
    c: "#6af7c0",
    n: "100+",
    free: false,
    href: "/output-quiz",
    desc: "Predict the exact output of real JS snippets. Catches what theory never does.",
    tags: ["Type coercion", "Hoisting traps", "Async order", "Closure bugs"],
  },
  {
    emoji: "🐛",
    label: "Debug Lab",
    c: "#f76a6a",
    n: "25+",
    free: false,
    href: "/debug-lab",
    desc: "Find and fix real bugs. AI scores your fix 1–10 and shows the cleaner approach.",
    tags: ["Async bugs", "Stale closures", "Promise chains", "React hooks"],
  },
  {
    emoji: "⚡",
    label: "Polyfill Lab",
    c: "#f7c76a",
    n: "20+",
    free: false,
    href: "/polyfill-lab",
    desc: "Write the implementation of common JS methods from scratch, then test and debug it in our custom test runner.",
    tags: [
      "Array Methods",
      "Function Methods",
      "Promise Methods",
      "Object Methods",
      "Utility Functions",
    ],
  },
];

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
  { name: "Shiv Malhar Dixit", xp: 215, av: "S", medal: "🥉", bg: "transparent" },
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
  "All 91 theory questions",
  "Interview Sprint — 5-question warmup",
  "Daily Question of the Day + AI eval",
  "First 5 output + 5 debug questions",
  "First 5 polyfill challenges",
  "Weekly XP leaderboard",
  "Interview Cheat Sheet (36 topics)",
  "JavaScript Deep Dives (in-depth concept explanations)",
];

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
    name: "Aarav Mehta",
    role: "Frontend Dev → Razorpay",
    av: "AM",
    c: "#7c6af7",
    quote:
      "Got an offer from Razorpay after 3 weeks on JSPrep. The output questions were exactly what they asked — I'd never have practiced those on my own.",
  },
  {
    name: "Yash Maheshwari",
    role: "React Dev → Bajaj Finser Health",
    av: "YM",
    c: "#6af7c0",
    quote:
      "The AI evaluator is the real thing. It told me I was hand-waving through closures. Fixed it, aced the Bajaj Finser Health round. Worth every rupee.",
  },
  {
    name: "Karan Joshi",
    role: "2 YOE → Atlassian",
    av: "KJ",
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
    n: "91",
    free: true,
    desc: "Deep explanations, code examples, hints, and AI follow-up on every question.",
    tags: ["Closures", "Prototypes", "Event Loop", "Promises"],
  },
  {
    emoji: "💻",
    label: "Output Quiz",
    c: "#6af7c0",
    n: "66",
    free: false,
    desc: "Predict the exact output of real JS snippets. Catches what theory never does.",
    tags: ["Type coercion", "Hoisting traps", "Async order", "Closure bugs"],
  },
  {
    emoji: "🐛",
    label: "Debug Lab",
    c: "#f76a6a",
    n: "38",
    free: false,
    desc: "Find and fix real bugs. AI scores your fix 1–10 and shows the cleaner approach.",
    tags: ["Async bugs", "Stale closures", "Promise chains", "React hooks"],
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
    name: "Arjun M.",
    xp: 380,
    av: "A",
    medal: "🥇",
    bg: "rgba(247,199,106,0.08)",
  },
  { name: "Priya K.", xp: 290, av: "P", medal: "🥈", bg: "transparent" },
  { name: "Rahul S.", xp: 215, av: "R", medal: "🥉", bg: "transparent" },
];

export const FREE_F = [
  "All 91 theory questions",
  "Daily Question of the Day + AI eval",
  "First 5 output + 5 debug questions",
  "Weekly XP leaderboard",
  "Interview Cheat Sheet (36 topics)",
  "JavaScript Deep Dives (in-depth concept explanations)",
];


export const proFeatures = [
  "Everything in Free",
  "All output questions",
  "All debug challenges",
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
/** @jsxImportSource @emotion/react */
"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { css, keyframes } from "@emotion/react";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Trophy,
  Flame,
  Star,
  Bug,
  Sparkles,
  Target,
  Mic,
  Brain,
  FileText,
  Calendar,
} from "lucide-react";
import { BP } from "@/styles/tokens";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOPICS = [
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

const TESTIMONIALS = [
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

const MODES = [
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

const AI_TOOLS = [
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

const LEADERS = [
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

const FREE_F = [
  "All 91 theory questions",
  "Daily Question of the Day + AI eval",
  "First 5 output + 5 debug questions",
  "Weekly XP leaderboard",
];
const PRO_F = [
  "Everything in Free",
  "All 66 output questions",
  "All 38 debug challenges",
  "Unlimited mastery tracking",
  "AI Tutor on every question",
  "AI Answer Evaluator",
  "AI Code Checker",
  "AI Mock Interviewer",
  "AI Study Plan generator",
  "Interview Cheat Sheet (36 topics)",
  "Daily streak + analytics",
  "All future content",
];

// ─── Animations ───────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px) }
  to   { opacity:1; transform:translateY(0) }
`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = css`
  position: relative;
  background: #07070e;
  min-height: 100vh;
  /* Dot grid */
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.045) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
`;
const purpleGlow = css`
  position: fixed;
  inset: -200px -300px auto auto;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(124, 106, 247, 0.12) 0%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 0;
`;
const greenGlow = css`
  position: fixed;
  bottom: -100px;
  left: -100px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(106, 247, 192, 0.07) 0%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 0;
`;
const wrap = css`
  max-width: 68rem;
  margin: 0 auto;
  padding: 0 1.25rem 5rem;
  position: relative;
  z-index: 1;
  @media (min-width: ${BP.sm}) {
    padding: 0 2rem 6rem;
  }
`;

/* ─ Hero */
const hero = css`
  text-align: center;
  padding: 4rem 0 3rem;
  animation: ${fadeUp} 0.6s ease both;
  @media (min-width: ${BP.sm}) {
    padding: 5.5rem 0 4rem;
  }
`;
const badge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a78bfa;
  background: rgba(124, 106, 247, 0.1);
  border: 1px solid rgba(124, 106, 247, 0.2);
  padding: 0.375rem 0.9375rem;
  border-radius: 100px;
  margin-bottom: 1.75rem;
`;
const h1 = css`
  font-family: "Syne", sans-serif;
  font-size: clamp(2.75rem, 8vw, 5.25rem);
  font-weight: 800;
  line-height: 1.07;
  letter-spacing: -0.04em;
  color: white;
  margin-bottom: 1.375rem;
`;
const grad = css`
  background: linear-gradient(
    130deg,
    #7c6af7 0%,
    #a78bfa 35%,
    #6af7c0 65%,
    #7c6af7 100%
  );
  background-size: 200% auto;
  animation: ${shimmer} 5s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
const sub = css`
  font-size: clamp(1rem, 1.75vw, 1.125rem);
  color: rgba(255, 255, 255, 0.48);
  max-width: 34rem;
  margin: 0 auto 2.25rem;
  line-height: 1.75;
`;
const ctas = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  @media (min-width: ${BP.sm}) {
    flex-direction: row;
    justify-content: center;
  }
`;
const btnP = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9375rem 2.25rem;
  background: #7c6af7;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 8px 36px rgba(124, 106, 247, 0.42);
  transition: all 0.18s;
  &:hover {
    background: #6b59e8;
    transform: translateY(-2px);
    box-shadow: 0 12px 44px rgba(124, 106, 247, 0.52);
  }
`;
const btnO = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.9375rem 1.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.11);
  transition: all 0.18s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
    color: white;
  }
`;

/* ─ Free banner */
const freeBanner = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  background: rgba(106, 247, 192, 0.06);
  border: 1px solid rgba(106, 247, 192, 0.15);
  border-radius: 14px;
  padding: 0.9375rem 1.75rem;
  margin: 0 auto 4rem;
  max-width: 42rem;
  animation: ${fadeUp} 0.6s 0.1s ease both;
`;

/* ─ Stats */
const statsRow = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 4.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
const statCell = css`
  text-align: center;
  padding: 1.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  &:last-child {
    border-right: none;
  }
  &:nth-child(2) {
    border-right: none;
  }
  @media (min-width: ${BP.sm}) {
    &:nth-child(2) {
      border-right: 1px solid rgba(255, 255, 255, 0.07);
    }
  }
`;
const statN = css`
  font-family: "Syne", sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 0.375rem;
`;
const statL = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
`;

/* ─ Section */
const sec = css`
  margin-bottom: 5rem;
`;
const eye = (c: string) => css`
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${c};
  text-align: center;
  margin-bottom: 0.875rem;
`;
const sh2 = css`
  font-family: "Syne", sans-serif;
  font-size: clamp(1.875rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
  color: white;
  margin-bottom: 0.75rem;
`;
const ssub = css`
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9375rem;
  max-width: 30rem;
  margin: 0 auto 2.75rem;
  line-height: 1.75;
`;

/* ─ AI Demo */
const demoShell = css`
  background: #0c0c17;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  max-width: 52rem;
  margin: 0 auto;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(124, 106, 247, 0.08);
`;
const demoBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: rgba(255, 255, 255, 0.025);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;
const dd = (c: string) => css`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${c};
`;
const demoTitle = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.22);
  margin-left: 0.5rem;
  flex: 1;
  text-align: center;
`;
const demoInner = css`
  padding: 1.75rem;
  @media (min-width: ${BP.sm}) {
    padding: 2.25rem;
  }
`;
const demoQL = css`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
`;
const demoPill = css`
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7c6af7;
  background: rgba(124, 106, 247, 0.1);
  border: 1px solid rgba(124, 106, 247, 0.18);
  padding: 2px 9px;
  border-radius: 100px;
`;
const demoQ = css`
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: white;
  font-weight: 700;
  line-height: 1.45;
  margin-bottom: 1.5rem;
`;
const demoAns = css`
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1.125rem;
  margin-bottom: 1.25rem;
`;
const demoAnsL = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255, 255, 255, 0.22);
  margin-bottom: 0.5rem;
`;
const demoAnsT = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.7;
`;
const demoResult = css`
  background: rgba(106, 247, 192, 0.05);
  border: 1px solid rgba(106, 247, 192, 0.16);
  border-radius: 14px;
  padding: 1.375rem;
`;
const demoScoreRow = css`
  display: flex;
  align-items: center;
  gap: 1.125rem;
  margin-bottom: 1rem;
`;
const demoScore = css`
  font-family: "Syne", sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #6af7c0;
  line-height: 1;
  white-space: nowrap;
`;
const demoDenom = css`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.2);
`;
const demoBarWrap = css`
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  overflow: hidden;
`;
const demoBarFill = css`
  height: 100%;
  width: 70%;
  background: linear-gradient(90deg, #6af7c0, #7c6af7);
  border-radius: 3px;
`;
const demoFb = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.8;
`;

/* ─ Modes */
const modesG = css`
  display: grid;
  gap: 1.125rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const modeCard = (c: string) => css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 1.875rem;
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    border-color: ${c}35;
    transform: translateY(-3px);
    box-shadow:
      0 16px 48px rgba(0, 0, 0, 0.3),
      0 0 0 1px ${c}12;
  }
`;
const modeE = css`
  font-size: 2.25rem;
  display: block;
  margin-bottom: 1.125rem;
`;
const modeFree = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.1);
  border: 1px solid rgba(106, 247, 192, 0.18);
  padding: 2px 8px;
  border-radius: 4px;
`;
const modeL = css`
  font-family: "Syne", sans-serif;
  font-size: 1.1875rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.375rem;
`;
const modeC = (c: string) => css`
  font-size: 0.8125rem;
  color: ${c};
  font-weight: 700;
  margin-bottom: 0.875rem;
`;
const modeD = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.75;
  margin-bottom: 1.25rem;
`;
const modeTagRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;
const modeT = (c: string) => css`
  font-size: 0.6875rem;
  padding: 3px 10px;
  border-radius: 100px;
  background: ${c}10;
  border: 1px solid ${c}1f;
  color: ${c};
  font-weight: 600;
`;

/* ─ 2-col layout */
const twoCol = css`
  display: grid;
  gap: 1.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* ─ QOTD card */
const qotdCard = css`
  background: linear-gradient(
    135deg,
    rgba(124, 106, 247, 0.1),
    rgba(106, 247, 192, 0.06)
  );
  border: 1px solid rgba(124, 106, 247, 0.2);
  border-radius: 20px;
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
`;
const qotdBadge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #c4b5fd;
  background: rgba(124, 106, 247, 0.15);
  padding: 3px 10px;
  border-radius: 100px;
`;
const qotdTitle = css`
  font-size: 1.125rem;
  font-weight: 800;
  color: white;
  line-height: 1.45;
  margin-bottom: 0.5rem;
`;
const qotdSub = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.42);
  line-height: 1.65;
`;
const qotdBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.625rem 1.25rem;
  background: #7c6af7;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(124, 106, 247, 0.35);
  transition: all 0.15s;
  align-self: flex-start;
  &:hover {
    background: #6b59e8;
    transform: translateY(-1px);
  }
`;

/* ─ Leaderboard */
const lbCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  overflow: hidden;
`;
const lbHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.375rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;
const lbHeadT = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 800;
  color: white;
`;
const lbReset = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.28);
`;
const lbRow = (bg: string) => css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.375rem;
  background: ${bg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;
const lbAv = css`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(124, 106, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #c4b5fd;
`;
const lbName = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  flex: 1;
`;
const lbXp = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 800;
  color: #f7c76a;
`;
const lbCta = css`
  display: block;
  text-align: center;
  padding: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #7c6af7;
  text-decoration: none;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
  &:hover {
    background: rgba(124, 106, 247, 0.05);
  }
`;

/* ─ Why switch (before/after) */
const whyCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 1.875rem 2rem;
`;
const whyG = css`
  display: grid;
  gap: 1.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const whyItem = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const whyEmoji = css`
  font-size: 1.5rem;
  margin-bottom: 0.375rem;
`;
const whyLabel = css`
  font-size: 0.6rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 0.125rem;
`;
const whyBefore = css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
`;
const whyAfter = css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.75);
`;

/* ─ Testimonials */
const tGrid = css`
  display: grid;
  gap: 1.125rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const tCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
`;
const tStars = css`
  display: flex;
  gap: 3px;
  margin-bottom: 0.625rem;
`;
const tQuote = css`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.8;
  flex: 1;
`;
const tMark = css`
  font-family: "Syne", sans-serif;
  font-size: 3.5rem;
  color: rgba(124, 106, 247, 0.22);
  line-height: 0.5;
  display: block;
  margin-bottom: 0.75rem;
`;
const tAuthor = css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;
const tAv = (c: string) => css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${c}18;
  border: 1.5px solid ${c}35;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: ${c};
`;
const tName = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.125rem;
`;
const tRole = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
`;

/* ─ Topics */
const tpGrid = css`
  display: grid;
  gap: 0.875rem;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const tpCard = (c: string) => css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem;
  text-decoration: none;
  display: block;
  transition: all 0.2s;
  &:hover {
    border-color: ${c}35;
    background: ${c}07;
    transform: translateY(-2px);
  }
`;
const tpDot = (c: string) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${c};
  box-shadow: 0 0 8px ${c}80;
  margin-bottom: 0.875rem;
`;
const tpName = css`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;
const tpMeta = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const tpDiff = (c: string) => css`
  font-size: 0.6875rem;
  color: ${c};
  font-weight: 700;
`;
const tpQs = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.25);
`;

/* ─ AI tools */
const aiG = css`
  display: grid;
  gap: 0.875rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const aiCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem 1.375rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: border-color 0.2s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }
`;
const aiIco = (c: string) => css`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  background: ${c}14;
  border: 1px solid ${c}22;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const aiLab = css`
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const aiBdg = css`
  font-size: 0.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #f7c76a;
  background: rgba(247, 199, 106, 0.1);
  border: 1px solid rgba(247, 199, 106, 0.2);
  padding: 1px 5px;
  border-radius: 4px;
`;
const aiDsc = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.65;
`;

/* ─ Pricing */
const priceG = css`
  display: grid;
  gap: 1.125rem;
  max-width: 48rem;
  margin: 0 auto;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;
const priceC = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;
const priceCPro = css`
  background: rgba(124, 106, 247, 0.07);
  border: 1.5px solid rgba(124, 106, 247, 0.35);
  border-radius: 22px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #7c6af7, #6af7c0, #7c6af7);
  }
`;
const popularTag = css`
  position: absolute;
  top: 1.125rem;
  right: 1.125rem;
  font-size: 0.5625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
  background: #7c6af7;
  padding: 3px 9px;
  border-radius: 6px;
`;
const pTier = css`
  font-family: "Syne", sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.42);
  margin-bottom: 0.5rem;
`;
const pPrice = css`
  font-family: "Syne", sans-serif;
  font-size: 2.75rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 0.25rem;
`;
const pPer = css`
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
`;
const pNote = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1.75rem;
`;
const pFeats = css`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  margin-bottom: 1.875rem;
`;
const pFeat = css`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
`;
const pBtnF = css`
  display: block;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.9375rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: all 0.15s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.04);
  }
`;
const pBtnP = css`
  display: block;
  text-align: center;
  background: #7c6af7;
  border-radius: 12px;
  padding: 0.9375rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(124, 106, 247, 0.32);
  transition: all 0.18s;
  &:hover {
    background: #6b59e8;
    transform: translateY(-1px);
  }
`;

/* ─ Bottom CTA */
const btmCta = css`
  text-align: center;
  padding: 4.5rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(124, 106, 247, 0.45),
      transparent
    );
  }
`;
const btmH = css`
  font-family: "Syne", sans-serif;
  font-size: clamp(1.875rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: white;
  margin-bottom: 0.875rem;
`;
const btmD = css`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2.25rem;
  line-height: 1.7;
`;
const foot = css`
  text-align: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.8125rem;
  padding-bottom: 2rem;
`;
const hr = css`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin: 0 0 5rem;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/auth";
  const ctaLabel = user ? "Go to Dashboard" : "Start Free — No Card Needed";

  return (
    <main css={page}>
      <div css={purpleGlow} />
      <div css={greenGlow} />
      <div css={wrap}>
        {/* ── HERO ─────────────────────────────────── */}
        <div css={hero} id="features">
          <div css={badge}>
            <Zap size={10} /> For 1–3 Year Frontend Developers
          </div>
          <h1 css={h1}>
            Land your next
            <br />
            <span css={grad}>JavaScript role.</span>
          </h1>
          <p css={sub}>
            200+ questions across theory, output prediction, and debugging —
            with 6 AI tools that score your answers like a real senior engineer
            would.
          </p>
          <div css={ctas}>
            <Link href={ctaHref} css={btnP}>
              {ctaLabel} <ArrowRight size={16} />
            </Link>
            <a href="#pricing" css={btnO}>
              See pricing
            </a>
          </div>
        </div>

        {/* ── FREE CALLOUT ─────────────────────────── */}
        <div css={freeBanner}>
          <CheckCircle size={15} color="#6af7c0" style={{ flexShrink: 0 }} />
          <span
            style={{ fontSize: "0.9375rem", color: "#6af7c0", fontWeight: 700 }}
          >
            91 theory questions — completely free, forever.
          </span>
          <span
            style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.32)" }}
          >
            No card. No trial. No paywall.
          </span>
        </div>

        {/* ── STATS ────────────────────────────────── */}
        <div css={statsRow}>
          {[
            { n: "200+", l: "Questions" },
            { n: "3", l: "Practice modes" },
            { n: "36", l: "Topic guides" },
            { n: "6", l: "AI tools" },
          ].map(({ n, l }) => (
            <div key={l} css={statCell}>
              <div css={statN}>{n}</div>
              <div css={statL}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── AI DEMO ──────────────────────────────── */}
        <div css={sec}>
          <p css={eye("#7c6af7")}>AI Answer Evaluator</p>
          <h2 css={sh2}>Know exactly where you stand</h2>
          <p css={ssub}>
            Type your answer. Get scored 1–10 with specific gaps, not "great
            job".
          </p>

          <div css={demoShell}>
            <div css={demoBar}>
              <div css={dd("#f76a6a")} />
              <div css={dd("#f7c76a")} />
              <div css={dd("#6af7c0")} />
              <span css={demoTitle}>JSPrep Pro · Answer Evaluator</span>
            </div>
            <div css={demoInner}>
              <div css={demoQL}>
                <span css={demoPill}>Closures</span>
                <span css={demoPill}>Core</span>
              </div>
              <div css={demoQ}>
                What is a closure in JavaScript, and why is it useful?
              </div>
              <div css={demoAns}>
                <div css={demoAnsL}>Your answer</div>
                <div css={demoAnsT}>
                  A closure is when a function has access to variables from its
                  outer scope, even after the outer function has returned. It's
                  useful for data privacy and keeping state in counters.
                </div>
              </div>
              <div css={demoResult}>
                <div css={demoScoreRow}>
                  <div css={demoScore}>
                    7<span css={demoDenom}>/10</span>
                  </div>
                  <div css={demoBarWrap}>
                    <div css={demoBarFill} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Good — room to grow
                  </span>
                </div>
                <div css={demoFb}>
                  <span style={{ color: "#6af7c0", fontWeight: 700 }}>
                    ✓ Correct on scope retention and persistence.
                  </span>{" "}
                  But you're missing the key mechanic — closures work because of{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    lexical scoping
                  </span>
                  . The function retains a{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    reference
                  </span>{" "}
                  to variables (not a copy), which is why the var-in-loop bug
                  exists. A senior answer would also mention the{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    module pattern
                  </span>{" "}
                  or{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    React hooks
                  </span>{" "}
                  as real-world usage.
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr css={hr} />

        {/* ── 3 MODES ──────────────────────────────── */}
        <div css={sec} id="practice">
          <p css={eye("#6af7c0")}>Three Practice Modes</p>
          <h2 css={sh2}>How real interviews test you</h2>
          <p css={ssub}>
            Most prep sites are theory-only. Real JS interviews use all three.
          </p>
          <div css={modesG}>
            {MODES.map((m) => (
              <div key={m.label} css={modeCard(m.c)}>
                <span css={modeE}>{m.emoji}</span>
                {m.free && <div css={modeFree}>✓ Free</div>}
                <div css={modeL}>{m.label}</div>
                <div css={modeC(m.c)}>{m.n} questions</div>
                <p css={modeD}>{m.desc}</p>
                <div css={modeTagRow}>
                  {m.tags.map((t) => (
                    <span key={t} css={modeT(m.c)}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEYOND QUESTIONS (QOTD + LB + WHY) ──── */}
        <div css={sec}>
          <p css={eye("#f7c76a")}>Beyond Questions</p>
          <h2 css={sh2}>A full interview prep ecosystem</h2>
          <p css={ssub}>
            Not just a list of Q&As — habits, accountability, and depth.
          </p>

          {/* QOTD + Leaderboard side by side */}
          <div css={[twoCol, { marginBottom: "1.5rem" }]}>
            {/* QOTD */}
            <div css={qotdCard}>
              <div>
                <div css={qotdBadge}>
                  <Flame size={10} /> Question of the Day — Free
                </div>
                <div css={qotdTitle}>
                  One question a day. Answer it. Get AI feedback. Stay ready.
                </div>
                <p css={qotdSub}>
                  Builds the daily prep habit without overwhelm. Free for
                  everyone — no Pro needed. Track your streak.
                </p>
              </div>
              <Link href={ctaHref} css={qotdBtn}>
                <Calendar size={14} /> Try today's question
              </Link>
            </div>

            {/* Leaderboard */}
            <div css={lbCard}>
              <div css={lbHead}>
                <div css={lbHeadT}>
                  <Trophy size={14} color="#f7c76a" /> Top Learners This Week
                </div>
                <span css={lbReset}>Resets Monday</span>
              </div>
              {LEADERS.map((l, i) => (
                <div key={l.name} css={lbRow(l.bg)}>
                  <span
                    style={{
                      fontSize: i < 3 ? "1rem" : "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    {l.medal}
                  </span>
                  <div css={lbAv}>{l.av}</div>
                  <div css={lbName}>{l.name}</div>
                  <div css={lbXp}>
                    <Zap size={11} /> {l.xp} XP
                  </div>
                </div>
              ))}
              <Link href={ctaHref} css={lbCta}>
                Join the leaderboard — earn XP →
              </Link>
            </div>
          </div>

          {/* Why devs switch */}
          <div css={whyCard}>
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "1.375rem",
                textAlign: "center",
              }}
            >
              Why devs switch to JSPrep Pro
            </p>
            <div css={whyG}>
              {[
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
              ].map(({ emoji, label, before, after }) => (
                <div key={label} css={whyItem}>
                  <div css={whyEmoji}>{emoji}</div>
                  <div css={whyLabel}>{label}</div>
                  <div css={whyBefore}>
                    <span style={{ color: "#f76a6a", flexShrink: 0 }}>✗</span>
                    {before}
                  </div>
                  <div css={whyAfter}>
                    <span style={{ color: "#6af7c0", flexShrink: 0 }}>✓</span>
                    {after}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr css={hr} />

        {/* ── TESTIMONIALS ─────────────────────────── */}
        <div css={sec}>
          <p css={eye("#f7c76a")}>Real developers. Real offers.</p>
          <h2 css={sh2}>They prepped here. They got in.</h2>
          <p css={ssub}>
            Not "I liked the UI." — Developers, interviews, outcomes.
          </p>
          <div css={tGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} css={tCard}>
                <div>
                  <div css={tStars}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f7c76a" color="#f7c76a" />
                    ))}
                  </div>
                  <span css={tMark}>"</span>
                  <p css={tQuote}>{t.quote}</p>
                </div>
                <div css={tAuthor}>
                  <div css={tAv(t.c)}>{t.av}</div>
                  <div>
                    <div css={tName}>{t.name}</div>
                    <div css={tRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOPIC CARDS ──────────────────────────── */}
        <div css={sec}>
          <p css={eye("#a78bfa")}>36 Topic Deep-Dives</p>
          <h2 css={sh2}>Every concept, interview-ready</h2>
          <p css={ssub}>
            Each topic has a mental model, full explanation, cheat sheet, and
            practice questions. Not just a Q&A list.
          </p>
          <div css={tpGrid}>
            {TOPICS.map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} css={tpCard(t.c)}>
                <div css={tpDot(t.c)} />
                <div css={tpName}>{t.label}</div>
                <div css={tpMeta}>
                  <span css={tpDiff(t.c)}>{t.diff}</span>
                  <span css={tpQs}>{t.qs} questions</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
            <Link href="/topics" css={btnO}>
              See all 36 topics <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── AI TOOLS ─────────────────────────────── */}
        <div css={sec}>
          <p css={eye("#7c6af7")}>6 AI Features</p>
          <h2 css={sh2}>Your AI interview coach</h2>
          <p css={ssub}>
            Not a chatbot you switch to. AI is inside every question, every
            answer, every debug.
          </p>
          <div css={aiG}>
            {AI_TOOLS.map(({ icon: Icon, label, desc, c }) => (
              <div key={label} css={aiCard}>
                <div css={aiIco(c)}>
                  <Icon size={16} color={c} />
                </div>
                <div>
                  <div css={aiLab}>
                    {label}
                    <span css={aiBdg}>PRO</span>
                  </div>
                  <p css={aiDsc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRICING ──────────────────────────────── */}
        <div css={sec} id="pricing">
          <p css={eye("#6af7c0")}>Pricing</p>
          <h2 css={sh2}>Simple. Transparent.</h2>
          <p css={ssub}>
            Start free with 91 real questions and AI feedback from day one.
          </p>
          <div css={priceG}>
            <div css={priceC}>
              <div css={pTier}>Free</div>
              <div css={pPrice}>₹0</div>
              <div css={pNote}>Forever free — no card needed</div>
              <ul css={pFeats}>
                {FREE_F.map((f) => (
                  <li key={f} css={pFeat}>
                    <CheckCircle
                      size={13}
                      color="#6af7c0"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} css={pBtnF}>
                {user ? "Go to Dashboard" : "Get Started Free"}
              </Link>
            </div>
            <div css={priceCPro}>
              <div css={popularTag}>POPULAR</div>
              <div css={[pTier, { color: "#c4b5fd" }]}>Pro</div>
              <div css={pPrice}>
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 99}
                <span css={pPer}>/month</span>
              </div>
              <div css={pNote}>Less than a coffee. Cancel anytime.</div>
              <ul css={pFeats}>
                {PRO_F.map((f) => (
                  <li key={f} css={pFeat}>
                    <CheckCircle
                      size={13}
                      color="#7c6af7"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} css={pBtnP}>
                {user ? "Upgrade to Pro →" : "Start with Pro →"}
              </Link>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ───────────────────────────── */}
        <div css={btmCta}>
          <h2 css={btmH}>Ready to prep smarter?</h2>
          <p css={btmD}>
            91 questions free. AI feedback from question one. No card needed.
          </p>
          <Link href={ctaHref} css={btnP} style={{ display: "inline-flex" }}>
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>

        <div css={foot}>
          © 2026 JSPrep Pro · jsprep.pro · Built for frontend developers
        </div>
      </div>
    </main>
  );
}

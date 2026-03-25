/** @jsxImportSource @emotion/react */
// app/mock-interview/MockInterviewClient.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageGuard from "@/components/ui/PageGuard";
import { css, keyframes } from "@emotion/react";
import { ChevronLeft, Send, Clock, AlertCircle } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import InterviewResult from "./InterviewResult";
import type { TopicRef } from "./page";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Message {
  role: "user" | "assistant";
  content: string;
  lockedAt?: number;
}
type Phase = "setup" | "interview" | "result";

export interface SetupConfig {
  role: string;
  experience: string;
  company: string;
  focus: string;
}

export interface ScoreBreakdown {
  overall: number;
  concepts: number;
  problemSolving: number;
  communication: number;
  depth: number;
  verdict: "Ready" | "Almost Ready" | "Not Ready";
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  rawFeedback: string;
}

interface Props {
  topics: TopicRef[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_TURNS = 10;
const INTERVIEW_SECS = 25 * 60;

const ROLES = [
  "Frontend Developer",
  "Full Stack Developer",
  "JavaScript Engineer",
  "React Developer",
  "Node.js Developer",
];
const LEVELS = [
  { value: "junior", label: "Junior (0–2 yrs)" },
  { value: "mid", label: "Mid-level (2–4 yrs)" },
  { value: "senior", label: "Senior (4–7 yrs)" },
  { value: "lead", label: "Tech Lead (7+ yrs)" },
];
const COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Flipkart",
  "Razorpay",
  "Atlassian",
  "Swiggy",
  "CRED",
  "Zepto",
  "Meesho",
  "Shopify",
  "Stripe",
  "Zomato",
  "PhonePe",
  "General",
];
const FOCUS_AREAS = [
  "Core JavaScript",
  "Async & Promises",
  "Closures & Scope",
  "System Design (Frontend)",
  "React & State Management",
  "Performance Optimisation",
  "Mixed (all topics)",
];

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}`;
const dotPulse = keyframes`0%,100%{opacity:0.3}50%{opacity:1}`;
const timerPulse = keyframes`0%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}70%{box-shadow:0 0 0 5px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = css`
  min-height: 100vh;
  background: ${C.bg};
`;
const backBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: ${C.muted};
  font-weight: 500;
  transition: color 0.12s;
  &:hover {
    color: ${C.text};
  }
`;

// Setup
const setupWrap = css`
  max-width: 34rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
`;
const setupTitle = css`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: ${C.text};
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.5rem;
`;
const setupSub = css`
  font-size: 0.9375rem;
  color: ${C.muted};
  line-height: 1.6;
  margin-bottom: 2rem;
`;
const fieldLabel = css`
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  margin-bottom: 0.5rem;
`;
const chipGrid = (n: number) => css`
  display: grid;
  grid-template-columns: repeat(${n}, 1fr);
  gap: 0.375rem;
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const chip = (a: boolean) => css`
  padding: 0.5rem 0.75rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${a ? C.accent : C.border};
  background: ${a ? C.accentSubtle : "transparent"};
  color: ${a ? C.accentText : C.muted};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: all 0.12s;
  white-space: nowrap;
  &:hover {
    border-color: ${C.accent};
    color: ${C.accentText};
  }
`;
const startBtn = css`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: ${RADIUS.lg};
  background: ${C.text};
  color: ${C.bg};
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: opacity 0.12s;
  margin-top: 2rem;
  &:hover {
    opacity: 0.88;
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
const warnBanner = css`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-radius: ${RADIUS.md};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  font-size: 0.8125rem;
  color: ${C.amber};
  line-height: 1.5;
  margin-top: 1.5rem;
`;

// Interview
const ivWrap = css`
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 3.5rem);
`;
const topBar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 0.75rem;
  flex-shrink: 0;
`;
const ivTitle = css`
  font-size: 1rem;
  font-weight: 700;
  color: ${C.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const coTag = css`
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: ${RADIUS.sm};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  color: ${C.muted};
`;
const topRight = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const turnPill = css`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.muted};
  font-variant-numeric: tabular-nums;
`;
const timerNorm = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 4px 10px;
  border-radius: ${RADIUS.md};
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  border: 1px solid ${C.border};
  background: ${C.bgSubtle};
  color: ${C.muted};
  transition: all 0.3s;
`;
const timerWarn = css`
  ${timerNorm};
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
  animation: ${timerPulse} 1.5s ease-in-out infinite;
`;
const pgTrack = css`
  height: 2px;
  background: ${C.border};
  flex-shrink: 0;
  border-radius: 9999px;
  overflow: hidden;
`;
const pgFill = (p: number) => css`
  height: 100%;
  width: ${p}%;
  background: ${C.accent};
  transition: width 0.4s ease;
`;
const msgs = css`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${C.border};
    border-radius: 9999px;
  }
`;
const msgRow = (u: boolean) => css`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  flex-direction: ${u ? "row-reverse" : "row"};
  animation: ${fadeUp} 0.2s ease;
`;
const ava = (u: boolean) => css`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: ${RADIUS.sm};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  ${u
    ? `background:${C.bgSubtle};border:1px solid ${C.border};color:${C.muted};`
    : `background:${C.accent};color:#fff;`}
`;
const bubble = (u: boolean) => css`
  max-width: 75%;
  padding: 0.875rem 1rem;
  border-radius: ${u
    ? `${RADIUS.lg} ${RADIUS.sm} ${RADIUS.lg} ${RADIUS.lg}`
    : `${RADIUS.sm} ${RADIUS.lg} ${RADIUS.lg} ${RADIUS.lg}`};
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${C.text};
  ${u
    ? `background:${C.bgSubtle};border:1px solid ${C.border};`
    : `background:${C.bg};border:1px solid ${C.borderStrong};`}white-space:pre-wrap;
  word-break: break-word;
`;
const typingWrap = css`
  max-width: 5rem;
  padding: 0.875rem 1rem;
  border-radius: ${RADIUS.sm} ${RADIUS.lg} ${RADIUS.lg} ${RADIUS.lg};
  background: ${C.bg};
  border: 1px solid ${C.borderStrong};
  display: flex;
  align-items: center;
  gap: 5px;
`;
const dot = (d: string) => css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${C.muted};
  animation: ${dotPulse} 1.2s ease-in-out infinite;
  animation-delay: ${d};
`;
const inputRow = css`
  flex-shrink: 0;
  padding: 0.75rem 0 0;
  border-top: 1px solid ${C.border};
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;
const inputBox = (dis: boolean) => css`
  flex: 1;
  background: ${C.bg};
  border: 1px solid ${dis ? C.border : C.borderStrong};
  border-radius: ${RADIUS.lg};
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: ${C.text};
  font-family: inherit;
  line-height: 1.6;
  resize: none;
  outline: none;
  min-height: 3rem;
  max-height: 10rem;
  transition: border-color 0.12s;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${C.accent};
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
const sendBtn = (a: boolean) => css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${RADIUS.md};
  flex-shrink: 0;
  border: none;
  cursor: ${a ? "pointer" : "default"};
  background: ${a ? C.accent : C.bgSubtle};
  color: ${a ? "#fff" : C.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
  align-self: flex-end;
  &:hover {
    opacity: ${a ? 0.88 : 1};
  }
`;
const lockNote = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  text-align: center;
  padding: 0.375rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

const evalOverlay = css`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  background: ${C.bg};
`;
const evalSpinner = keyframes`to{transform:rotate(360deg)}`;
const evalDisk = css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid ${C.border};
  border-top-color: ${C.accent};
  animation: ${evalSpinner} 0.8s linear infinite;
`;
const evalTitle = css`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
`;
const evalSub = css`
  font-size: 0.875rem;
  color: ${C.muted};
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(s: number) {
  const m = Math.floor(s / 60),
    sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/**
 * Build the system prompt with:
 * - Company/role/level/focus config
 * - Strict interviewer rules + 10-turn scorecard structure
 * - Internal topic links (never suggest external platforms)
 */

// ─── Company-specific question banks ─────────────────────────────────────────
// These are injected into the system prompt so the AI knows what THIS company asks.

const COMPANY_DATA: Record<
  string,
  {
    profile: string;
    hardTopics: string[];
    openingTopics: string[]; // what to ask on turn 1 for this company
  }
> = {
  Google: {
    profile: `Google JavaScript interviews are extremely rigorous. They focus on V8 engine internals, memory management, garbage collection, and performance profiling. Event loop complexity with nested microtasks/macrotasks is standard. They ask about Web Workers, SharedArrayBuffer, Atomics, and browser rendering pipeline (layout/paint/composite). System design for large-scale frontend is expected at senior+. They expect you to reason about algorithmic complexity of JavaScript operations.`,
    hardTopics: [
      "V8 engine optimization and JIT compilation",
      "event loop with nested Promise.then chains",
      "WeakRef and FinalizationRegistry",
      "SharedArrayBuffer and Atomics",
      "browser rendering pipeline and frame budget",
      "Web Workers and OffscreenCanvas",
      "memory leak detection and heap profiling",
      "structural cloning algorithm",
    ],
    openingTopics: [
      "Explain how V8 optimizes JavaScript execution. What triggers deoptimization?",
      "What happens in the browser between when JavaScript calls document.createElement and when the user sees the new element on screen?",
      "Walk me through what happens when you call Promise.resolve().then().then() — what exactly executes and when?",
    ],
  },

  Amazon: {
    profile: `Amazon focuses on practical resilience and defensive programming. They heavily test async error handling, retry logic with exponential backoff, race conditions, and handling partial failures. Leadership Principles manifest as "tell me about a time you..." questions mapped to JavaScript scenarios. Polyfill implementation (Promise.all, Array.prototype.flat, debounce with cancel) is common. They value developers who think about failure modes.`,
    hardTopics: [
      "async error handling and retry with exponential backoff",
      "Promise.allSettled vs Promise.all failure semantics",
      "cancellable debounce/throttle implementations",
      "handling race conditions in concurrent requests",
      "AbortController and request cancellation",
      "implementing Promise.any from scratch",
      "defensive programming patterns",
    ],
    openingTopics: [
      "You're fetching user data on every keystroke. How do you prevent stale responses from arriving out of order?",
      "Implement a function that retries a failed Promise up to 3 times with exponential backoff.",
      "What's the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any — when would you use each?",
    ],
  },

  Microsoft: {
    profile: `Microsoft interviews deeply on TypeScript, type system internals, and how JavaScript's prototype system maps to TypeScript's structural typing. They ask about module system internals (ES modules vs CommonJS, circular dependencies, tree shaking). Accessibility and how the DOM accessibility tree works is frequently tested. They ask about class inheritance vs prototypal delegation and when each is appropriate.`,
    hardTopics: [
      "prototype chain and Object.create vs class syntax",
      "ES module circular dependency resolution",
      "TypeScript mapped types and conditional types",
      "WeakMap for private encapsulation",
      "Symbol.iterator and custom iterables",
      "generator functions for lazy sequences",
      "the DOM accessibility tree and ARIA",
    ],
    openingTopics: [
      "Explain the difference between Object.create(null) and {} — when would you use each?",
      "How does JavaScript resolve a circular import between module A and module B?",
      "What's the difference between interface and type in TypeScript, and when does it actually matter at the JavaScript level?",
    ],
  },

  Flipkart: {
    profile: `Flipkart focuses on practical output questions and browser performance at scale. Event delegation, virtual scrolling, image lazy loading, and efficiently rendering large lists are core topics. They ask polyfill questions: Array.prototype.map, Function.prototype.bind, custom EventEmitter. Output prediction questions with coercion traps and closure loops are standard for all levels. Performance optimization for e-commerce UIs is a key theme.`,
    hardTopics: [
      "event delegation with closest() for nested elements",
      "implementing virtual scroll from scratch",
      "Array.prototype.map and filter polyfills",
      "Function.prototype.bind polyfill",
      "closure variable capture in loops",
      "output prediction with type coercion",
      "debounce for search inputs",
    ],
    openingTopics: [
      "What does this print and why?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}",
      "Implement Function.prototype.bind from scratch without using bind itself.",
      "You have a list of 10,000 product cards to render. How do you make it perform well?",
    ],
  },

  Razorpay: {
    profile: `Razorpay interviews are security-focused. XSS prevention, iframe security, postMessage origin validation, Content Security Policy, and secure payment flow design are core. They ask about closures for data encapsulation, the module pattern, and IIFE usage. Async error handling in payment flows and Promise chaining edge cases appear in every interview. They want developers who think defensively.`,
    hardTopics: [
      "XSS attack vectors and prevention",
      "iframe postMessage origin validation",
      "Content Security Policy directives",
      "closure-based encapsulation for sensitive data",
      "IIFE and the module pattern",
      "async error propagation in Promise chains",
      "structuredClone vs JSON.parse for payment data",
    ],
    openingTopics: [
      "You're building a payment checkout iframe. How do you securely communicate between the parent page and the iframe?",
      "Explain how you would prevent XSS in a React application that renders user-generated content.",
      "What's wrong with using localStorage to store a payment token? What's the secure alternative?",
    ],
  },

  Atlassian: {
    profile: `Atlassian interviews are significantly harder than average. They focus on collaborative editing concepts, operational transforms, conflict resolution, and real-time synchronization. Functional programming patterns (pure functions, immutability, compose/pipe) are expected. They ask about custom event systems, deep prototype chain questions, and how JavaScript engines handle memory. Observable patterns and reactive programming concepts appear at senior level.`,
    hardTopics: [
      "operational transform and conflict resolution concepts",
      "functional programming: compose, pipe, partial application",
      "custom EventEmitter implementation with once() and removeListener()",
      "deep prototype chain and descriptor-level property manipulation",
      "Object.defineProperty and property descriptors",
      "generator-based async control flow",
      "immutability patterns and structural sharing",
    ],
    openingTopics: [
      "Implement a full EventEmitter class with on, off, emit, and once methods. Handle edge cases.",
      "You have two users editing the same document simultaneously. How do you handle conflicting changes in the client?",
      "What's the difference between deep equality and reference equality in JavaScript? How does React use this distinction?",
    ],
  },

  Swiggy: {
    profile: `Swiggy focuses on performance under poor network conditions: progressive loading, service workers for offline support, optimistic UI updates, and handling race conditions in concurrent fetch requests. Real-time order tracking (WebSocket vs polling tradeoffs), geolocation APIs, and building countdown timers are tested. They ask about handling connection drops gracefully.`,
    hardTopics: [
      "service worker caching strategies",
      "WebSocket vs long-polling vs Server-Sent Events",
      "optimistic UI updates with rollback",
      "handling race conditions in real-time data",
      "geolocation API and accuracy tradeoffs",
      "offline-first design with IndexedDB",
      "AbortController for cancelling stale requests",
    ],
    openingTopics: [
      "You're showing a live order tracker that updates every 2 seconds. The user goes offline mid-delivery. How do you handle this?",
      "What's the difference between a Service Worker and a Web Worker? When would you use each?",
      "Implement an optimistic UI update for a like button that rolls back if the API call fails.",
    ],
  },

  CRED: {
    profile: `CRED focuses on animation performance, micro-interactions, and building premium UI experiences. They ask about requestAnimationFrame, CSS transitions vs JavaScript animations, and the browser rendering pipeline in depth. They want developers who understand the difference between layout-triggering and composite-only properties. Performance profiling and identifying jank are expected at senior level.`,
    hardTopics: [
      "requestAnimationFrame and 60fps animation loops",
      "layout thrashing and forced synchronous layout",
      "composite-only CSS properties vs layout-triggering",
      "will-change and its performance implications",
      "JavaScript animation vs CSS animation tradeoffs",
      "Intersection Observer for scroll animations",
      "the FLIP animation technique",
    ],
    openingTopics: [
      "What's the difference between transform and position: absolute for animation performance? Why?",
      "Implement a smooth scroll animation using requestAnimationFrame without using CSS scroll-behavior.",
      "What causes layout thrashing? Show me a code example and how to fix it.",
    ],
  },

  Zepto: {
    profile: `Zepto focuses on mobile web performance: touch event handling, passive event listeners, reducing main thread blocking, and building fast checkout flows. They ask about localStorage vs IndexedDB tradeoffs, service worker caching, and offline-first design. Input latency reduction and scroll performance are key themes for their mobile-first product.`,
    hardTopics: [
      "passive event listeners and scroll performance",
      "touch events vs pointer events",
      "input latency and main thread blocking",
      "IndexedDB for offline cart persistence",
      "service worker background sync",
      "reducing Time to Interactive",
      "code splitting and lazy loading strategies",
    ],
    openingTopics: [
      "What is a passive event listener and why does it matter for mobile scroll performance?",
      "Your checkout page has a 4-second Time to Interactive on mobile. Where do you start investigating?",
      "What's the difference between localStorage, sessionStorage, and IndexedDB? When would you use each?",
    ],
  },

  Meesho: {
    profile: `Meesho tests knowledge of large product catalog handling: virtual scrolling, image lazy loading, Intersection Observer patterns, and building reusable component systems. React performance patterns (memo, useMemo, useCallback, React profiler) are asked at every level. They value practical knowledge over theoretical — expect questions about things you'd actually encounter building a large-scale shopping app.`,
    hardTopics: [
      "Intersection Observer for image lazy loading",
      "React.memo and when it prevents re-renders",
      "useCallback reference stability with closures",
      "virtual scrolling implementation",
      "CSS containment for performance",
      "network-aware image loading",
      "web vitals optimization (LCP, FID, CLS)",
    ],
    openingTopics: [
      "Implement a custom hook that lazy-loads an image when it enters the viewport using Intersection Observer.",
      "Why does passing an arrow function directly to onClick in JSX cause unnecessary re-renders?",
      "You have a product grid with 1,000 items. The user can filter by category. What's the fastest way to implement this?",
    ],
  },

  Shopify: {
    profile: `Shopify focuses on Web Components, custom elements, and shadow DOM. They ask about headless commerce patterns, custom HTML elements, and the intersection of JavaScript with server-rendered HTML. Functional programming patterns are valued. They test knowledge of ES module patterns, how module bundlers work internally, and tree shaking. Building framework-agnostic components is a key theme.`,
    hardTopics: [
      "custom elements and Web Components API",
      "shadow DOM and style encapsulation",
      "ES module dynamic imports and code splitting",
      "building framework-agnostic components",
      "functional programming: pure functions, immutability",
      "how bundlers perform tree shaking",
      "the Temporal API and date handling",
    ],
    openingTopics: [
      "What is shadow DOM and how does it achieve style encapsulation? What are its limitations?",
      "Implement a reusable accordion component as a native Web Component — no framework.",
      "What's the difference between named exports and default exports for tree shaking? Which should you prefer?",
    ],
  },

  Stripe: {
    profile: `Stripe values correctness and reliability above all. They ask about floating-point arithmetic (0.1 + 0.2), precision issues with currency, and why you should never store money as floats. Iframe security for payment flows, structured clone algorithm, and deep understanding of JavaScript's number system are expected. They probe error handling depth — how errors propagate, how to recover from partial failures, and how to build idempotent operations.`,
    hardTopics: [
      "floating-point precision and currency arithmetic",
      "iframe security and cross-origin communication",
      "structuredClone algorithm and what it cannot clone",
      "number system: MAX_SAFE_INTEGER, BigInt",
      "idempotent API design patterns",
      "error propagation across Promise chains",
      "the structured concurrency model",
    ],
    openingTopics: [
      "Why does 0.1 + 0.2 !== 0.3 in JavaScript? How do you handle money calculations correctly?",
      "You're processing a payment that partially succeeds — the charge happened but the database write failed. How do you handle this idempotently?",
      "What can structuredClone handle that JSON.parse(JSON.stringify()) cannot? What can neither handle?",
    ],
  },

  Zomato: {
    profile: `Zomato asks about real-time order tracking, WebSocket implementation, and handling connection drops. Search-as-you-type with debouncing and concurrent request cancellation is standard. They focus on React state management patterns for complex UIs, form validation at scale, and building OTP/phone authentication flows.`,
    hardTopics: [
      "WebSocket connection management and reconnection",
      "search debouncing with request cancellation",
      "complex form state management",
      "OTP countdown timer with cleanup",
      "handling offline states in real-time apps",
      "concurrent request management with AbortController",
      "React context vs external state management",
    ],
    openingTopics: [
      "Implement a search input that fires an API call 300ms after the user stops typing and cancels the previous request if a new one starts.",
      "You're building a real-time order tracker over WebSocket. The connection drops. How do you handle reconnection and missed updates?",
      "What's the output of this code?\n\nconst arr = [1, 2, 3]\narr.forEach(async (n) => {\n  await delay(n * 100)\n  console.log(n)\n})\nconsole.log('done')",
    ],
  },

  PhonePe: {
    profile: `PhonePe focuses on security, UX under poor connectivity, and transaction reliability. Expect questions about cryptographic operations in the Web Crypto API, secure storage patterns, and preventing common payment security vulnerabilities. They test deep UX knowledge for progressive disclosure and error states. JavaScript performance on low-end Android devices is a practical constraint they ask about.`,
    hardTopics: [
      "Web Crypto API for client-side hashing",
      "Content Security Policy implementation",
      "preventing clickjacking and CSRF in payment flows",
      "progressive web app installation flow",
      "background sync for failed transactions",
      "performance budget on low-end devices",
      "secure token storage strategies",
    ],
    openingTopics: [
      "What are the security risks of storing a JWT in localStorage vs an httpOnly cookie? Which would you use for a payment app and why?",
      "How does the Web Crypto API differ from using a JavaScript crypto library? When would you prefer each?",
      "You're building a UPI payment flow. The user submits payment but the network drops mid-request. How do you handle this?",
    ],
  },

  General: {
    profile: `Conduct a balanced technical interview covering core JavaScript concepts. Adapt difficulty to the candidate's level. Ask practical questions that test real understanding, not memorization.`,
    hardTopics: [
      "closures and the scope chain",
      "prototype chain and inheritance",
      "event loop and task queue ordering",
      "async/await error handling",
      "this binding rules",
      "functional programming patterns",
      "performance optimization",
    ],
    openingTopics: [
      "Explain what happens when JavaScript executes: const fn = (() => { let count = 0; return () => ++count; })(); fn(); fn(); fn();",
      "What is the difference between call, apply, and bind? When would you use each?",
      "What does this print and why?\nconsole.log(typeof null)\nconsole.log(null instanceof Object)\nconsole.log(null == undefined)\nconsole.log(null === undefined)",
    ],
  },
};

// ─── Level descriptions for the prompt ───────────────────────────────────────

const LEVEL_DESC: Record<string, string> = {
  junior:
    "JUNIOR (0-2 yrs): Test fundamentals — scope, basic closures, simple Promises, typeof/instanceof, DOM manipulation. Probe for understanding. Do not ask about advanced patterns. Expect incomplete answers.",
  mid: "MID-LEVEL (2-4 yrs): Core concepts + practical application. Test closure traps, event loop ordering, output prediction, polyfill implementations. Expect solid fundamentals. Probe for production experience.",
  senior:
    "SENIOR (4-7 yrs): Deep internals + architecture. Test memory management, complex async patterns, performance optimization, design patterns. Correct answers should immediately trigger harder follow-ups.",
  lead: "TECH LEAD (7+ yrs): Architecture, tradeoffs, team decisions. Test system design, performance budgets, mentorship tradeoffs, designing JavaScript APIs. Expect excellence. Probe philosophical depth.",
};

// ─── Banned opening questions ─────────────────────────────────────────────────

const BANNED_OPENERS = `NEVER ask these as your opening question — they are overused and every candidate has rehearsed them:
- "What is the difference between null and undefined?"
- "What is the difference between var, let, and const?"
- "What is a closure?" (too basic — ask a closure TRAP instead)
- "What is hoisting?" (only acceptable for junior warm-up)
- "What is the event loop?" (too generic — ask a specific output question instead)
- "What is async/await?" (too generic)
- "Explain promises" (too generic)
These questions do not distinguish candidates. Use the company-specific opening topics provided.`;

// ─── The updated buildPrompt ──────────────────────────────────────────────────

export function buildPrompt(
  cfg: { role: string; experience: string; company: string; focus: string },
  topics: Array<{ title: string; slug: string }>,
): string {
  const co = COMPANY_DATA[cfg.company] ?? COMPANY_DATA["General"];
  const level = LEVEL_DESC[cfg.experience] ?? LEVEL_DESC["mid"];

  // Random entropy — ensures no two calls produce the same opening even with same config
  const entropy = Math.random().toString(36).slice(2, 10);
  const tsNow = Date.now();

  // Pick a random opening topic for this company
  const openingIdx = tsNow % co.openingTopics.length;
  const suggestedOpen = co.openingTopics[openingIdx];

  const topicLinks = topics
    .map((t) => `${t.title} → https://jsprep.pro/${t.slug}`)
    .join("\n");

  return `[INTERVIEW SESSION: ${entropy} | ${tsNow}]

You are a SENIOR JAVASCRIPT INTERVIEWER at ${cfg.company === "General" ? "a top-tier product company" : cfg.company}.
You are conducting a REAL technical interview. NOT a tutorial. NOT a chatbot. An interview.

══════════════════════════════════════════════
CANDIDATE PROFILE
══════════════════════════════════════════════
Role: ${cfg.role}
Level: ${level}
Focus Area: ${cfg.focus}

══════════════════════════════════════════════
${cfg.company.toUpperCase()} INTERVIEW STYLE
══════════════════════════════════════════════
${co.profile}

Topics this company is KNOWN to ask about:
${co.hardTopics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

YOUR OPENING QUESTION for this session (turn 1) — ask this or a close variant:
"${suggestedOpen}"

══════════════════════════════════════════════
MANDATORY RULES — FOLLOW EXACTLY
══════════════════════════════════════════════
1. ONE question per response. EXACTLY one. NEVER two questions.
2. NEVER explain, hint at the answer, or teach. You EVALUATE. You do not HELP.
3. React to every answer:
   - Vague or surface-level → "Can you be more specific?" or "What exactly happens when..."
   - Wrong → "Are you sure about that?" or "Walk me through why."
   - Partially correct → dig for the missing piece: "What about edge cases?"
   - Strong and complete → immediately escalate difficulty
4. Use REAL interviewer language: "What if...?", "Why not just...?", "How would this behave when...?"
5. NEVER say: "Great answer!", "Good point!", "Exactly right!", "That's correct!" — NEVER praise.
6. Tone: direct, professional, slightly uncomfortable. Like an Atlassian or Google interviewer.

${BANNED_OPENERS}

══════════════════════════════════════════════
INTERVIEW STRUCTURE
══════════════════════════════════════════════
Turn 1:  The opening question provided above — ask it exactly or a close variant
Turns 2–4: Core concept deep-dives based on the company's known topics. Follow the thread — if they struggle on closures, stay on closures.
Turns 5–7: ONE practical problem — output prediction, debug a snippet, implement a polyfill, or solve a real-world scenario relevant to ${cfg.company}'s product
Turns 8–9: Target their specific weak spots identified from earlier answers. Maximum pressure.
Turn 10:  One final question — ask it as plain text. NO JSON. Wait for their answer.

══════════════════════════════════════════════
SCORECARD — READ CAREFULLY
══════════════════════════════════════════════
You NEVER output JSON spontaneously. EVER.
You ONLY output JSON when you receive the exact string: "GENERATE_SCORECARD"

When triggered, respond with ONLY raw JSON. No intro text. No markdown. No fences. Nothing else:
{"type":"scorecard","overall":<0-100>,"concepts":<0-100>,"problemSolving":<0-100>,"communication":<0-100>,"depth":<0-100>,"verdict":"<Ready|Almost Ready|Not Ready>","strengths":["<cite a specific thing they said or did well>","<another specific observation>"],"weaknesses":["<specific gap with example from their actual answers>","<another specific gap>"],"suggestions":["<actionable recommendation with https://jsprep.pro/ link>","<another recommendation with link>"],"summary":"<2-3 honest sentences referencing specific moments from the interview>"}

For suggestions, use ONLY these JSPrep resources:
${topicLinks}

NEVER mention LeetCode, HackerRank, YouTube, Udemy, or any competitor platform.

══════════════════════════════════════════════
FINAL INSTRUCTION
══════════════════════════════════════════════
Session: ${entropy}. This is a UNIQUE interview for a ${cfg.experience}-level ${cfg.role} targeting ${cfg.company}.
Start with the exact opening question above. Make this interview feel specific to ${cfg.company} — not generic JavaScript questions.
The candidate should leave feeling like they just talked to a real ${cfg.company} engineer.`;
}

/**
 * parseCard — handles three formats Groq/llama may return:
 *   1. Pure JSON object: {...}
 *   2. Fenced: ```json {...} ```
 *   3. Text then JSON on its own line (shouldn't happen with new prompt but belt+braces)
 */
function parseCard(text: string): ScoreBreakdown | null {
  try {
    // 1. Fenced block
    const fenced = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (fenced) return tryParse(fenced[1].trim());

    // 2. Pure JSON — entire trimmed response is an object
    const trimmed = text.trim();
    if (trimmed.startsWith("{")) return tryParse(trimmed);

    // 3. JSON embedded anywhere in the text — find the first { … } span
    const start = text.indexOf('{"type":"scorecard"');
    if (start !== -1) {
      const end = text.lastIndexOf("}");
      if (end > start) return tryParse(text.slice(start, end + 1));
    }

    return null;
  } catch {
    return null;
  }
}

function tryParse(raw: string): ScoreBreakdown | null {
  try {
    const d = JSON.parse(raw);
    if (d.type !== "scorecard") return null;
    return {
      overall: d.overall ?? 0,
      concepts: d.concepts ?? 0,
      problemSolving: d.problemSolving ?? 0,
      communication: d.communication ?? 0,
      depth: d.depth ?? 0,
      verdict: d.verdict ?? "Not Ready",
      strengths: d.strengths ?? [],
      weaknesses: d.weaknesses ?? [],
      suggestions: d.suggestions ?? [],
      rawFeedback: d.summary ?? "",
    };
  } catch {
    return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MockInterviewClient({ topics }: Props) {
  const { user, progress, loading } = useAuth();
  const router = useRouter();

  const [cfg, setCfg] = useState<SetupConfig>({
    role: "Frontend Developer",
    experience: "mid",
    company: "General",
    focus: "Mixed (all topics)",
  });
  const [phase, setPhase] = useState<Phase>("setup");
  const [evaluating, setEvaluating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [turns, setTurns] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_SECS);
  const [isTyping, setIsTyping] = useState(false);
  const [scorecard, setScorecard] = useState<ScoreBreakdown | null>(null);
  const [saving, setSaving] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (phase !== "interview") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          endInterview();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  function endInterview() {
    setPhase("result");
    if (!scorecard)
      setScorecard({
        overall: 0,
        concepts: 0,
        problemSolving: 0,
        communication: 0,
        depth: 0,
        verdict: "Not Ready",
        strengths: [],
        weaknesses: ["Interview timed out"],
        suggestions: ["Complete within 25 minutes"],
        rawFeedback: "Interview was not completed within the allotted time.",
      });
  }

  function handleTA(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  }

  async function startInterview() {
    setPhase("interview");
    setMessages([]);
    setTurns(0);
    setTimeLeft(INTERVIEW_SECS);
    setIsTyping(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mock",
          system: buildPrompt(cfg, topics),
          messages: [{ role: "user", content: "Begin the interview." }],
          context: { ...cfg },
        }),
      });
      const data = await res.json();
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
      setIsTyping(false);
      setMessages([{ role: "assistant", content: data.text }]);
    } catch {
      setIsTyping(false);
      setMessages([
        {
          role: "assistant",
          content: "Connection error. Please refresh and try again.",
        },
      ]);
    }
  }

  async function sendAnswer() {
    if (!input.trim() || aiLoading || isTyping) return;
    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      lockedAt: Date.now(),
    };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    const newTurns = turns + 1;
    setTurns(newTurns);
    const isFinal = newTurns >= TOTAL_TURNS;
    setIsTyping(true);
    setAiLoading(true);
    if (isFinal) setEvaluating(true);
    const apiMsgs = newMsgs.map((m) => ({ role: m.role, content: m.content }));
    if (isFinal) apiMsgs.push({ role: "user", content: "GENERATE_SCORECARD" });
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mock",
          system: buildPrompt(cfg, topics),
          messages: apiMsgs,
          context: { ...cfg, isFinal },
        }),
      });
      const data = await res.json();
      const delay = 1200 + Math.min(data.text.length * 1.5, 2800);
      await new Promise((r) => setTimeout(r, delay));
      setIsTyping(false);
      const card = parseCard(data.text);
      if (card) {
        setEvaluating(false);
        setScorecard(card);
        clearInterval(timerRef.current!);
        await saveHistory(newMsgs, card);
        setPhase("result");
      } else {
        setEvaluating(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch {
      setIsTyping(false);
      setEvaluating(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection error. Your answer was recorded. Please try again.",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  async function saveHistory(msgs: Message[], card: ScoreBreakdown) {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "interviews"), {
        config: cfg,
        messages: msgs,
        scorecard: card,
        duration: INTERVIEW_SECS - timeLeft,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("[MockInterview]", e);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    clearInterval(timerRef.current!);
    setPhase("setup");
    setMessages([]);
    setTurns(0);
    setTimeLeft(INTERVIEW_SECS);
    setScorecard(null);
    setInput("");
    setIsTyping(false);
    setAiLoading(false);
    setEvaluating(false);
  }

  const isWarn = timeLeft <= 5 * 60 && phase === "interview";
  const canSend = !!input.trim() && !aiLoading && !isTyping;

  return (
    <PageGuard
      loading={loading || !user || !progress}
      ready={!!progress}
      isPro={progress?.isPro}
      proReason="AI Mock Interview is a Pro feature. Upgrade to practice with a real AI interviewer."
    >
      <div css={page}>
        {/* ── SETUP ── */}
        {phase === "setup" && (
          <div css={setupWrap}>
            <button css={backBtn} onClick={() => router.push("/home")}>
              <ChevronLeft size={15} />
              Back
            </button>
            <h1 css={setupTitle}>Mock Interview</h1>
            <p css={setupSub}>
              Configure your session. Questions are calibrated to your role,
              level, and target company.
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Role</label>
              <div css={chipGrid(3)}>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    css={chip(cfg.role === r)}
                    onClick={() => setCfg((c) => ({ ...c, role: r }))}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Experience Level</label>
              <div css={chipGrid(4)}>
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    css={chip(cfg.experience === l.value)}
                    onClick={() =>
                      setCfg((c) => ({ ...c, experience: l.value }))
                    }
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Target Company</label>
              <div css={chipGrid(5)}>
                {COMPANIES.map((co) => (
                  <button
                    key={co}
                    css={chip(cfg.company === co)}
                    onClick={() => setCfg((c) => ({ ...c, company: co }))}
                  >
                    {co}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label css={fieldLabel}>Focus Area</label>
              <div css={chipGrid(3)}>
                {FOCUS_AREAS.map((f) => (
                  <button
                    key={f}
                    css={chip(cfg.focus === f)}
                    onClick={() => setCfg((c) => ({ ...c, focus: f }))}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div css={warnBanner}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                <strong>Answers lock on submit.</strong> No editing once sent —
                exactly like a real interview. 25 min limit · {TOTAL_TURNS}{" "}
                exchanges.
              </span>
            </div>

            <button css={startBtn} onClick={startInterview}>
              Begin Interview →
            </button>
          </div>
        )}

        {/* ── INTERVIEW ── */}
        {phase === "interview" && (
          <div css={ivWrap}>
            <div css={topBar}>
              <div css={ivTitle}>
                Interview <span css={coTag}>{cfg.company}</span>
              </div>
              <div css={topRight}>
                <span css={turnPill}>
                  {turns}/{TOTAL_TURNS} turns
                </span>
                <div css={isWarn ? timerWarn : timerNorm}>
                  <Clock size={11} />
                  {fmt(timeLeft)}
                </div>
              </div>
            </div>

            <div css={pgTrack}>
              <div css={pgFill((turns / TOTAL_TURNS) * 100)} />
            </div>

            <div css={msgs}>
              {messages.map((m, i) => (
                <div key={i} css={msgRow(m.role === "user")}>
                  <div css={ava(m.role === "user")}>
                    {m.role === "assistant" ? "AI" : "YOU"}
                  </div>
                  <div css={bubble(m.role === "user")}>{m.content}</div>
                </div>
              ))}
              {isTyping && (
                <div css={msgRow(false)}>
                  <div css={ava(false)}>AI</div>
                  <div css={typingWrap}>
                    <span css={dot("0s")} />
                    <span css={dot(".2s")} />
                    <span css={dot(".4s")} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div>
              <div css={inputRow}>
                <textarea
                  ref={taRef}
                  value={input}
                  onChange={handleTA}
                  disabled={aiLoading || isTyping}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendAnswer();
                    }
                  }}
                  rows={2}
                  placeholder={
                    isTyping
                      ? "Interviewer is typing…"
                      : "Type your answer… (Enter to send, Shift+Enter for new line)"
                  }
                  css={inputBox(aiLoading || isTyping)}
                />
                <button
                  css={sendBtn(canSend)}
                  onClick={sendAnswer}
                  disabled={!canSend}
                >
                  <Send size={14} />
                </button>
              </div>
              <p css={lockNote}>
                <AlertCircle size={9} />
                Answers lock on submit — no editing
              </p>
            </div>
          </div>
        )}

        {/* ── EVALUATING overlay ── */}
        {evaluating && (
          <div css={evalOverlay}>
            <div css={evalDisk} />
            <div css={evalTitle}>Evaluating your performance…</div>
            <div css={evalSub}>Generating your scorecard</div>
          </div>
        )}

        {/* ── RESULT — delegated to InterviewResult ── */}
        {phase === "result" && scorecard && (
          <InterviewResult
            scorecard={scorecard}
            config={cfg}
            topics={topics}
            saving={saving}
            onRetake={reset}
          />
        )}
      </div>
    </PageGuard>
  );
}

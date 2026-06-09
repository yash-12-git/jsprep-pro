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
  "Machine Coding Round",
  "Product Scenario Round",
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

// ─── Company-specific question banks ─────────────────────────────────────────

const COMPANY_DATA: Record<
  string,
  {
    profile: string;
    hardTopics: string[];
    openingTopics: string[];
    productScenarios: string[];
    machineCodingTasks: string[];
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
    productScenarios: [
      "You're a frontend engineer on Google Search. The team wants to add a 'People also ask' accordion that loads answers lazily on expansion. How do you architect this — component structure, lazy fetching, accessibility, and preventing layout shifts?",
      "Design the frontend for Google Docs' real-time collaborative cursor system. Multiple users edit simultaneously — how do you render their cursors and selections without causing constant re-renders or visual jank?",
      "You're building a virtualized inbox for Gmail containing 10,000 emails. Rows have variable heights depending on subject length. Describe your implementation — windowing strategy, scroll anchoring, and how you measure performance.",
    ],
    machineCodingTasks: [
      "Build an autocomplete search input. It debounces API calls by 300ms, shows a loading spinner, displays results in a dropdown list, supports keyboard navigation (ArrowUp/ArrowDown, Enter to select, Escape to close), and handles fetch errors with a retry message.",
      "Build a virtualized list that renders only visible rows. Given an array of items and a fixed row height of 48px, render only the rows in a 400px-tall scrollable container. Maintain a buffer of 3 rows above/below the visible window to prevent flicker.",
      "Build a tag input: users type a tag and press Enter or comma to add it, click × to remove, the input prevents duplicates and trims whitespace. It emits an onChange with the current string[] array and accepts a maxTags prop.",
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
    productScenarios: [
      "You're building the Amazon checkout page. After a user clicks 'Place Order', the payment API returns a 500. Design the entire frontend error handling flow — retry logic, idempotency key, user messaging, and recovery without double charging.",
      "Design the 'Recently viewed items' carousel for Amazon's homepage. It reads from localStorage, syncs to a server, deduplicates, must work offline, and limits to 10 items. How do you design the data layer and sync strategy?",
      "You're building the product review section showing 10,000 reviews with filter by star rating, sort by helpfulness, and pagination. The page must be usable on 3G. How do you architect the data fetching, rendering, and state?",
    ],
    machineCodingTasks: [
      "Build a star rating component: display 1–5 stars with hover preview, lock rating on click, support half-stars, show the numeric average alongside the stars, and emit onRate(value). Make it keyboard accessible — Tab to focus, arrow keys to change rating.",
      "Build a countdown timer for a flash deal. It counts down from a given Unix end-timestamp (not a duration), displays HH:MM:SS, turns red below 5 minutes, shows 'Deal ended' at zero, and cleans up its interval on unmount.",
      "Build a debounced search component: fires an async searchProducts(query) 300ms after the user stops typing, shows a spinner during fetch, renders results as a list, allows clicking a result to call onSelect(item), and cancels the in-flight request if a new search starts before it resolves.",
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
    productScenarios: [
      "You're building the Azure portal's resource list. It shows hundreds of resources with type icons, status badges, and action menus. Users can search, filter, and bulk-select. How do you design the component architecture for performance and accessibility?",
      "Design the @mention system for Microsoft Teams. As a user types '@' followed by characters, show a typeahead of team members. Sent mentions appear styled differently and are clickable. How do you implement the input handling, search, and rendering?",
      "You're building the Microsoft 365 app launcher grid. Tiles have different sizes, users can drag to reorder, and the layout persists across sessions. How do you implement the grid, drag-and-drop, and persistence without a library?",
    ],
    machineCodingTasks: [
      "Build a typeahead mention component. When the user types '@' in a textarea followed by characters, show a dropdown of matching usernames from a mock array. Selecting a username replaces '@partial' with '@username '. Handle keyboard navigation and click selection.",
      "Build an accessible modal dialog. It traps focus inside while open, returns focus to the trigger on close, closes on Escape and backdrop click, and has correct ARIA attributes (role='dialog', aria-modal, aria-labelledby). The animation should use CSS transitions.",
      "Build a multi-select filter dropdown: a trigger button showing '3 selected' (or 'All' when none), a dropdown list of checkboxes, a 'Clear all' button, and an onChange callback with the selected string[]. It closes when clicking outside.",
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
    productScenarios: [
      "You're building Flipkart's product listing page. It shows a grid of products with a filter sidebar. When a filter is applied, the URL updates and products re-fetch without a full reload. Filters combine (AND logic). How do you design state management and URL sync?",
      "Design the Flipkart 'Big Billion Day' flash sale countdown page. At T-0, hundreds of thousands of users click 'Buy Now' simultaneously. The frontend must handle success, out-of-stock, and rate-limit responses gracefully without showing stale data. How do you design this?",
      "You're building the 'Add to compare' feature: users add up to 4 products, a sticky comparison bar appears at the bottom, clicking 'Compare' shows a side-by-side spec table. Design the state management and component architecture.",
    ],
    machineCodingTasks: [
      "Build a product image gallery: a large main image with a thumbnail strip below. Clicking a thumbnail updates the main image with a fade transition. Arrow keys navigate between images. The component receives an array of image URLs as a prop.",
      "Build a dual-handle price range slider (min/max). Dragging either handle updates the range displayed above. The handles cannot cross. The component emits onChange({ min, max }) and accepts initialMin, initialMax, min, and max props.",
      "Build an infinite scroll product grid. Use a mock fetchProducts(page) async function. Render products in a CSS grid. Load the next page when the user scrolls within 200px of the bottom. Show a loading spinner at the bottom during fetch and an 'All products loaded' message when done.",
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
    productScenarios: [
      "You're building Razorpay's checkout modal — an iframe embedded in a merchant's page. It collects card details, sends them to Razorpay's server, and posts the payment result back to the parent. Walk through the complete security architecture: iframe isolation, postMessage validation, CSP, and token handling.",
      "Design Razorpay's merchant dashboard transaction history. It shows thousands of transactions with live updates, filter by date/status/amount, and CSV export. The table must handle rapid real-time updates without flicker. How do you architect the data layer and rendering?",
      "You're building the Razorpay payment link generator. Merchants fill in amount, description, and expiry. They can preview the link, copy it, and share via WhatsApp. The link must encode tamper-proof data. Design the frontend end-to-end including the security model.",
    ],
    machineCodingTasks: [
      "Build an OTP input with 6 individual digit boxes. Auto-advance to the next box on valid input, go back on Backspace, support pasting a full 6-digit OTP (distribute digits across boxes), and show an error state when the submitted OTP is incorrect. Clean, accessible markup.",
      "Build a credit card input with real-time formatting (groups of 4 digits separated by spaces), card type detection (Visa/Mastercard/Amex based on the first digits) showing a corresponding icon, and Luhn algorithm validation that shows an error on blur if the number is invalid.",
      "Build a payment amount input formatted in Indian notation (₹1,00,000). It restricts to 2 decimal places, clears formatting on focus so the user can type raw digits, re-applies formatting on blur, and shows a 'Maximum ₹10,00,000' error for values that exceed the limit.",
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
    productScenarios: [
      "You're building Jira's sprint board — a kanban view with To Do, In Progress, and Done columns. Cards can be dragged between columns. Column totals update instantly. Multiple users may move cards simultaneously and see each other's moves in real time. Design the frontend architecture.",
      "Design the Confluence @mention and /command palette system. As the user types '@' or '/', show a fuzzy-search palette. Selecting an option inserts a React component (not plain text) into the editor — for example, a person chip or a macro block. How do you implement this?",
      "You're building Jira's issue dependency graph — a visual DAG showing which issues block which. Nodes are issues, edges are dependencies. Users can add/remove dependencies by clicking and dragging. Design the rendering model, interaction layer, and cycle detection.",
    ],
    machineCodingTasks: [
      "Build a drag-and-drop kanban board with 3 columns. Cards can be dragged between columns using native HTML5 drag events or pointer events (no library). Show a drop zone highlight during drag and animate the card into its new position on drop.",
      "Build a rich text toolbar: Bold, Italic, Underline, and a Heading dropdown (H1/H2/H3). Clicking a button wraps the current selection in the appropriate tag. The active state of each button reflects the format at the current cursor position. No external editor library.",
      "Build an undo/redo system for a text input. Maintain a history stack. Ctrl+Z undoes, Ctrl+Y or Ctrl+Shift+Z redoes. Cap history at 50 states. Debounce captures so rapid typing is grouped into one undo step rather than one character at a time.",
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
    productScenarios: [
      "You're building Swiggy's real-time order tracker. After placing an order, the user sees live updates pushed via WebSocket: 'Confirmed → Preparing → Picked up → Arriving'. The user may go offline mid-delivery and reopen the app 10 minutes later. Design the complete frontend including offline state recovery.",
      "Design Swiggy Instamart's product listing page — 5,000 products across 60 categories. Users browse by category or search. The page must be usable on 2G. How do you architect category navigation, lazy loading, skeleton screens, and search with debounce?",
      "You're building the Swiggy cart with customizable add-ons. Tapping 'Add' on a pizza opens a bottom sheet with customization options (size, crust, toppings). Selections update the price in real time. Multiple items with different customizations can be in the cart. Design the state model.",
    ],
    machineCodingTasks: [
      "Build a restaurant card with a skeleton loading state. The card shows name, cuisine tags, rating, delivery time, and a discount badge. While data is loading, show an animated shimmer skeleton. Transition smoothly to real content with a fade. No external skeleton library.",
      "Build a delivery countdown timer. It accepts a Unix end-timestamp and displays the remaining time as 'X min Y sec'. It updates every second, turns red and pulses below 3 minutes, and shows 'Arriving now!' at zero. It cleans up its interval on unmount.",
      "Build a cart summary panel: line items with name, quantity, and price; subtotal, delivery fee, and total — all computed from props. Include + and − buttons per item (minimum quantity 1). If cart is empty, show an empty state. The component emits onQuantityChange(itemId, newQty).",
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
    productScenarios: [
      "You're building CRED's credit card bill payment flow. The user selects a card, sees the bill amount, chooses full/minimum/custom payment, and pays via UPI. Every transition between steps has a premium micro-animation. Design the component architecture, state machine, and animation strategy.",
      "Design CRED's scratch card reward: after a successful payment, an animated scratch card appears. The user drags their finger to scratch and reveal a reward. Implement the scratch reveal using Canvas — track pointer movement, erase the overlay, and detect when enough area has been scratched to auto-reveal.",
      "You're building CRED's credit score dashboard — a radial gauge from 300–900, an animated trend graph over 12 months, and recommended actions with projected score improvements. Each element animates on mount. Design the data flow and animation choreography.",
    ],
    machineCodingTasks: [
      "Build a credit card flip component. It displays card number (masked), cardholder name, expiry, and card type logo on the front. On hover/tap, it flips 180° to show the CVV on the back. Implement the 3D flip using CSS transforms only — no JavaScript animation libraries.",
      "Build an animated radial gauge for a credit score (300–900). The gauge arc fills smoothly from 0 to the target value on mount using requestAnimationFrame. Color transitions: red below 580, amber 580–720, green above 720. Display the numeric score at the center.",
      "Build a swipeable bottom sheet. It can be dragged up to full-screen and down to dismiss. Implement using pointer events (not a library) — track pointermove, calculate drag distance, animate with transform: translateY, snap to open/closed on release based on velocity.",
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
    productScenarios: [
      "You're building Zepto's product search experience. As the user types, results appear in under 200ms grouped by category. Users apply filters (price, brand, in-stock). On mobile, the keyboard must not cause layout shifts. The search must work partially offline. Design this end to end.",
      "Design Zepto's 10-minute delivery checkout flow. User confirms cart, selects delivery slot, pays, and sees a confirmation — all optimized for a budget Android device on 4G. How do you minimize TTI, reduce JS bundle size, and handle payment failures gracefully?",
      "You're building Zepto's category browsing page. The horizontal category strip is sticky. Tapping a category scrolls the product list to that section. Products load lazily as the user scrolls. There are 50 categories and 3,000 products. Design the implementation.",
    ],
    machineCodingTasks: [
      "Build a product search with debounced API calls (300ms). Show a loading spinner while fetching. Render results in a dropdown with product name, price, and an 'Add' button per result. The dropdown closes when the user clicks outside. Cancel the previous request if a new one starts.",
      "Build a cart item row with a quantity stepper (+/−). Minimum quantity is 1 — at 1, the − button becomes a trash icon that calls onRemove. Animate the quantity number changing (slide up/down). Emit onQuantityChange(id, qty) and onRemove(id).",
      "Build a horizontal category strip with scroll snap. Categories are pills in a scrollable row. The active category is highlighted with a colored border. Clicking scrolls it into view if off-screen. Show left/right fade-gradient indicators when more items exist off screen.",
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
    productScenarios: [
      "You're building Meesho's reseller product catalog. A reseller browses products, sets their margin, and shares a product link with a custom price. Design the product browsing page, margin calculator, shareable link generation, and the share flow (WhatsApp deep link, copy).",
      "Design Meesho's product listing page with 50,000+ products, infinite scroll, and multiple filter combinations. On a budget 4G device, the page must load in under 3 seconds and LCP must be under 2.5s. How do you optimize images, JS bundles, and rendering?",
      "You're building Meesho's social share image generator. A reseller taps 'Share' and gets a product photo with their business name and custom price overlaid, ready for WhatsApp. Implement this using Canvas — overlay text on an image and trigger a download or Web Share API.",
    ],
    machineCodingTasks: [
      "Build a lazy-loading image grid for a product catalog using Intersection Observer. Show a shimmer placeholder while the image loads. Handle load errors with a fallback placeholder image. Disconnect the observer once the image has loaded.",
      "Build a product card 'Share' button: clicking it copies '${productName} at ₹${price} — meesho.com/...' to the clipboard using the Clipboard API, shows a 'Copied!' checkmark for 2 seconds, then reverts. Fall back to the Web Share API on mobile if available.",
      "Build a margin calculator. Given a supplierPrice prop, the reseller types a margin percentage. Display in real time: supplier price, margin amount (₹), reseller price, and profit per unit. Validate that the margin is 0–200% and show an inline error outside that range.",
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
    productScenarios: [
      "You're building a Shopify theme component as a native Web Component — no framework allowed. It's a product card with image, title, price, and 'Add to cart' button that dispatches a custom event. The merchant can drop it into any Liquid template. Design the API and implementation.",
      "Design a headless Shopify storefront's product listing page. It fetches from the Storefront API via GraphQL, supports infinite scroll, filtering by tag, and a cart that persists across sessions using localStorage. How do you design the data layer and state without a UI framework?",
      "You're building Shopify's checkout address autocomplete. As the user types, suggestions come from a mock Places API. Selecting fills address fields. The component must work in any Shopify theme without React or Vue. How do you implement this as framework-agnostic JS?",
    ],
    machineCodingTasks: [
      "Build a native Web Component FAQ accordion (no React/Vue). Use the Custom Elements API and shadow DOM for style encapsulation. Clicking a question expands the answer (only one open at a time). Dispatch a custom 'accordion-toggle' event with the open item's index. Support keyboard access.",
      "Build a quantity picker custom element with + and − buttons. Support min and max HTML attributes. When the value changes, dispatch a 'quantity-change' CustomEvent with the new value. It should be keyboard accessible and reflect its value as a property and attribute.",
      "Build a 'Recently viewed products' widget using localStorage. On mount, load the last 5 product IDs. On each simulated product view (via a mock viewProduct(id) call), prepend to the list, deduplicate, and persist. Render as a horizontal scrollable strip of product cards.",
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
    productScenarios: [
      "You're building Stripe's Payment Element — an embeddable iframe on a merchant's site. It collects card details, validates them, communicates securely with Stripe's server, and posts the result back to the parent page. Walk through the complete technical architecture: iframe isolation, postMessage protocol, token exchange, and error surface.",
      "Design Stripe's dashboard transaction list: thousands of transactions updating in real time via webhooks, each row expandable, with search, filter, and export. The list must handle rapid updates without flickering or losing scroll position. How do you architect data management and rendering?",
      "You're building Stripe Radar's fraud review feed — a real-time feed of potentially fraudulent charges refreshing every 5 seconds. Each charge can be approved or blocked (optimistic update). Design the frontend including conflict handling if two reviewers act on the same charge simultaneously.",
    ],
    machineCodingTasks: [
      "Build a currency amount input for a payment form. As the user types, format the value as currency (e.g., '1234' → '$12.34'). Support USD, EUR, and JPY (which has no decimal places). Show an error if the amount is below the minimum ($0.50 for USD). Use integer arithmetic internally — never floats.",
      "Build a copy-to-clipboard button. Clicking copies the provided text prop, shows a checkmark and 'Copied!' for 2 seconds, then reverts. Use the Clipboard API. Fall back gracefully if it's unavailable (show a tooltip with the text to copy manually).",
      "Build a sortable data table. Given an array of objects and a column config array (key, label, type), render a table. Clicking a header sorts ascending; clicking again sorts descending. Show a ↑↓ indicator. The component should be generic and not assume any specific data shape.",
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
    productScenarios: [
      "You're building Zomato's restaurant search. As the user types, suggestions appear with restaurant name, cuisine, and rating. Pressing Enter shows full results. If they select a suggestion, navigate to the restaurant page. Design the debounced search, keyboard navigation, and result rendering.",
      "Design the Zomato order tracking page using Server-Sent Events (SSE). The backend pushes status events: placed → accepted → preparing → out for delivery → delivered. If the user closes the tab and reopens it mid-order, the page must recover state. How do you implement this?",
      "You're building Zomato's subscription landing page (Zomato Gold). It has a 3-tier pricing comparison table, a FAQ accordion, and a sticky CTA. Core Web Vitals must be in the green zone. LCP under 2.5s, CLS near 0. What optimizations do you make?",
    ],
    machineCodingTasks: [
      "Build a restaurant rating widget: show an overall average with a star display (half-star support), an interactive rating picker (hover preview + click to rate), and a 'You rated X stars' confirmation. When a new rating is submitted, update the average optimistically before the API responds.",
      "Build a complete OTP verification flow: phone number input → 'Send OTP' button (triggers mock async fn) → 6-digit OTP input with auto-advance → 60-second resend countdown → success or error state. Manage all state locally with React hooks.",
      "Build a food category tab bar. Categories are fetched async — show a skeleton loader while loading. The active tab has a sliding underline indicator that animates on tab change. Clicking a tab calls a mock filterByCategory(id) function and scrolls the tab into view if it's off-screen.",
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
    productScenarios: [
      "You're building PhonePe's UPI payment screen. The user enters an amount, selects a recipient (from contacts or by UPI ID), reviews a summary, and taps 'Pay'. If the payment times out, show a 'Checking status…' flow rather than a failure. If it truly fails, show a retry. Design the complete state machine and UI.",
      "Design PhonePe's transaction history with smart date grouping (Today, Yesterday, This Week, This Month, Older). Each row shows merchant icon, name, amount (red debit / green credit), and time. The list has 500+ transactions and must render smoothly on a budget Android device. Design for performance.",
      "You're building PhonePe's offline-first bill payment queue. The user adds bills when online or offline. Queued payments process via Service Worker background sync when connectivity returns. Design the service worker strategy, IndexedDB schema, and UI feedback for each queue state.",
    ],
    machineCodingTasks: [
      "Build a PIN entry keypad (12 keys: 0–9, backspace, confirm). The PIN display shows filled dots for entered digits. Each keypress animates with a brief scale pulse. Support a configurable PIN length (4 or 6 digits via prop). Auto-submit when the last digit is entered. Emit onComplete(pin).",
      "Build a contacts picker for money transfer. Given a mock array of 50 contacts (name, phone), render a searchable list. The search filters by name or phone number. Selecting a contact calls onSelect(contact). The list should use windowing (only render visible items) to handle large contact lists.",
      "Build a transaction status badge component. It accepts status: 'pending' | 'processing' | 'success' | 'failed'. 'Processing' shows a CSS spin animation. 'Success' shows a checkmark that draws itself via stroke-dashoffset animation. 'Failed' shows a pulsing red dot. 'Pending' shows a muted grey dot.",
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
    productScenarios: [
      "You're the first frontend engineer at a fintech startup. Your task: build a dashboard showing portfolio value over time (chart), recent transactions list, and a quick-transfer widget. Describe your approach — tech choices, component architecture, data fetching strategy, and what you'd defer to v2.",
      "Design a collaborative todo app: multiple users see each other's changes in real time. Users can add, edit, check off, and delete items. Design the frontend from scratch — state management, real-time sync, conflict handling when two users edit the same item simultaneously.",
      "You're building a notification centre for a SaaS app: a bell icon with unread badge, a dropdown list of in-app notifications (new mentions, task assignments), and real-time updates. Design the full implementation — data model, real-time transport choice, UI, and mark-as-read optimistic update.",
    ],
    machineCodingTasks: [
      "Build an accordion component. Given an array of { title, content } items, render them as an expandable list. Only one item can be open at a time. Include a smooth CSS expand/collapse animation (max-height or grid-rows trick). Make it keyboard accessible: Tab to focus, Enter/Space to toggle.",
      "Build a form with real-time validation: name (required, min 2 chars), email (valid format), password (min 8 chars, at least 1 number), confirm password (must match). Errors appear on blur for each field. The submit button is disabled until all fields are valid. Show a success message on submit.",
      "Build a toast notification system. Expose a showToast(message, type: 'success' | 'error' | 'info') function. Toasts stack in the top-right corner, auto-dismiss after 3 seconds, support manual dismiss on click, and animate in/out. Multiple toasts should not overlap — stack with a gap.",
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

// ─── buildPrompt ──────────────────────────────────────────────────────────────

export function buildPrompt(
  cfg: { role: string; experience: string; company: string; focus: string },
  topics: Array<{ title: string; slug: string }>,
): string {
  const co = COMPANY_DATA[cfg.company] ?? COMPANY_DATA["General"];
  const level = LEVEL_DESC[cfg.experience] ?? LEVEL_DESC["mid"];
  const isMachineCoding = cfg.focus === "Machine Coding Round";
  const isProductRound = cfg.focus === "Product Scenario Round";

  const entropy = Math.random().toString(36).slice(2, 10);
  const tsNow = Date.now();

  const topicLinks = topics
    .map((t) => `${t.title} → https://jsprep.pro/${t.slug}`)
    .join("\n");

  const SCORECARD_BLOCK = `══════════════════════════════════════════════
SCORECARD — READ CAREFULLY
══════════════════════════════════════════════
You NEVER output JSON spontaneously. EVER.
You ONLY output JSON when you receive the exact string: "GENERATE_SCORECARD"

When triggered, respond with ONLY raw JSON. No intro text. No markdown. No fences. Nothing else:
{"type":"scorecard","overall":<0-100>,"concepts":<0-100>,"problemSolving":<0-100>,"communication":<0-100>,"depth":<0-100>,"verdict":"<Ready|Almost Ready|Not Ready>","strengths":["<cite a specific thing they said or did well>","<another specific observation>"],"weaknesses":["<specific gap with example from their actual answers>","<another specific gap>"],"suggestions":["<actionable recommendation with https://jsprep.pro/ link>","<another recommendation with link>"],"summary":"<2-3 honest sentences referencing specific moments from the interview>"}

For suggestions, use ONLY these JSPrep resources:
${topicLinks}

NEVER mention LeetCode, HackerRank, YouTube, Udemy, or any competitor platform.`;

  // ── Machine Coding Round ──────────────────────────────────────────────────
  if (isMachineCoding) {
    const idx = tsNow % co.machineCodingTasks.length;
    const task = co.machineCodingTasks[idx];

    return `[MACHINE CODING SESSION: ${entropy} | ${tsNow}]

You are a SENIOR FRONTEND ENGINEER at ${cfg.company === "General" ? "a top-tier product company" : cfg.company} conducting a MACHINE CODING interview round.
This is NOT a theory quiz. The candidate is designing and building a real UI component in front of you.

══════════════════════════════════════════════
CANDIDATE PROFILE
══════════════════════════════════════════════
Role: ${cfg.role}
Level: ${level}

══════════════════════════════════════════════
THE PROBLEM — PRESENT THIS ON TURN 1 VERBATIM
══════════════════════════════════════════════
${task}

══════════════════════════════════════════════
YOUR ROLE
══════════════════════════════════════════════
You are the interviewer reviewing their live decisions. You do NOT write code. You do NOT give hints.
You ask questions about what they would build and why, then probe deeper.

══════════════════════════════════════════════
MANDATORY RULES
══════════════════════════════════════════════
1. ONE question per response. EXACTLY one. NEVER two.
2. NEVER write code, suggest solutions, or hint at the correct approach.
3. React to their answers:
   - Vague → "What exactly would your component state look like? Show me the shape."
   - Missing edge case → "What happens when the user [specific scenario: paste, backspace, offline, rapid click]?"
   - Good answer → immediately escalate: "Now what if you had to support [harder constraint]?"
   - Performance gap → "How many re-renders does this trigger? How would you verify that?"
4. NEVER say "Great!", "Exactly!", "Perfect!", "Good point!" — NEVER praise.
5. Tone: direct, senior engineer pairing with a candidate under observation. Slightly uncomfortable.

══════════════════════════════════════════════
INTERVIEW STRUCTURE (10 turns)
══════════════════════════════════════════════
Turn 1:  State the problem above word for word. End with: "How would you approach this? What's the first thing you'd build?"
Turns 2–3: Probe component structure and state design. "What does your state look like?" "Why that shape vs [alternative]?"
Turns 4–5: Edge cases and error states. Push on: paste behaviour, keyboard-only navigation, empty state, loading state, error recovery, rapid interaction.
Turns 6–7: Accessibility. "How does a screen reader user interact with this?" "Keyboard-only user?" "ARIA attributes needed?" "Mobile keyboard behaviour?"
Turns 8–9: Performance. "What causes unnecessary re-renders here?" "How would you measure it?" "How does this scale if there are 500 instances on the page?"
Turn 10:  "Looking back at your design, what would you change with another 30 minutes?"

${SCORECARD_BLOCK}

Session: ${entropy}. Make this feel like a real machine coding round at ${cfg.company === "General" ? "a top-tier product company" : cfg.company}.`;
  }

  // ── Product Scenario Round ────────────────────────────────────────────────
  if (isProductRound) {
    const idx = tsNow % co.productScenarios.length;
    const scenario = co.productScenarios[idx];

    return `[PRODUCT SCENARIO SESSION: ${entropy} | ${tsNow}]

You are a SENIOR ENGINEER at ${cfg.company === "General" ? "a top-tier product company" : cfg.company} conducting a PRODUCT + SYSTEM DESIGN interview.
You are evaluating how this candidate thinks about building real product features end-to-end — not just JavaScript theory.

══════════════════════════════════════════════
CANDIDATE PROFILE
══════════════════════════════════════════════
Role: ${cfg.role}
Level: ${level}

══════════════════════════════════════════════
THE SCENARIO — PRESENT THIS ON TURN 1
══════════════════════════════════════════════
${scenario}

══════════════════════════════════════════════
MANDATORY RULES
══════════════════════════════════════════════
1. ONE question per response. EXACTLY one.
2. NEVER lecture. NEVER suggest the answer. You listen and probe relentlessly.
3. React to their answers:
   - High-level without depth → "Be specific. What API, what data structure, what component?"
   - Missing constraint → "What happens when the user has a slow 2G connection?" or "What if the API fails mid-flow?"
   - Good answer → immediately escalate to the next hard constraint
   - Wrong technical choice → "Why not [alternative]? Walk me through the tradeoff."
4. NEVER say "Great!", "Exactly!", "Perfect!". NEVER praise.
5. Tone: direct, product-obsessed senior engineer. You care about what ships, not theory.

══════════════════════════════════════════════
INTERVIEW STRUCTURE (10 turns)
══════════════════════════════════════════════
Turn 1:  Present the scenario above. End with: "Walk me through how you'd approach this. Where do you start?"
Turns 2–3: Architecture deep dive. Component breakdown, data model, API contract. "What does the API response look like?" "How is state structured?" "Why React context vs Zustand vs something else?"
Turns 4–5: Failure modes. "What if the WebSocket drops?" "What if two users conflict?" "What does the user see during a 5-second network error?" "How do you handle partial failure without losing data?"
Turns 6–7: Performance at scale. "This runs on a ₹7,000 Android phone on 2G in rural India. What breaks?" "What would you instrument to know if it's fast enough?" "What are your Core Web Vitals targets?"
Turns 8–9: Product decisions. "What's in v1 vs v2?" "If you had to cut one feature to ship in 2 weeks, what goes?" "What did you trade off and why?"
Turn 10:  "If you were starting this over with everything you've learned, what would you design differently?"

${SCORECARD_BLOCK}

Session: ${entropy}. Make this feel like a real product design interview at ${cfg.company === "General" ? "a top-tier product company" : cfg.company}.`;
  }

  // ── Standard JS / Concepts Round ─────────────────────────────────────────
  const openingIdx = tsNow % co.openingTopics.length;
  const suggestedOpen = co.openingTopics[openingIdx];

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

${SCORECARD_BLOCK}

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

  // Pre-fill from roadmap "Start mock interview" links (?focus=...&company=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const focus = params.get("focus");
    const company = params.get("company");
    if (!focus && !company) return;
    setCfg((prev) => ({
      ...prev,
      ...(focus && FOCUS_AREAS.includes(focus) ? { focus } : {}),
      ...(company && COMPANIES.includes(company) ? { company } : {}),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

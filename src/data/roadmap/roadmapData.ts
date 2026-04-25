import type { RoadmapMonth } from "./types";

/**
 * 16-week frontend roadmap targeting ₹25+ LPA roles.
 *
 * Each task with a `topicSlug` links to /[topicSlug] — the existing
 * Next.js [topic] dynamic route in src/app/[topic]/page.tsx.
 *
 * Add / remove topic slugs as your Firestore topics collection grows.
 * Topics without a matching slug simply render as plain text (no link).
 */
export const ROADMAP: RoadmapMonth[] = [
  {
    month: 1,
    title: "JS + Browser Mastery",
    accent: "green",
    weeks: [
      {
        week: 1,
        title: "JS Foundations (Deep)",
        days: [
          {
            day: 1,
            tasks: [
              {
                text: "Execution Context — global & function-level",
                topicSlug: "javascript-execution-context-interview-questions",
              },
              {
                text: "Call stack internals & visualization",
              },
              {
                text: "Practice: Implement your own call stack simulator in JS",
              },
            ],
          },
          {
            day: 2,
            tasks: [
              {
                text: "Scope & Lexical Environment deep dive",
                topicSlug: "javascript-scope-interview-questions",
              },
              {
                text: "var / let / const — all edge cases (TDZ, closures)",
                topicSlug: "javascript-var-let-const-interview-questions",
              },
              {
                text: "Hoisting: Predict output",
                topicSlug: "javascript-hoisting-interview-questions",
              },
              {
                text: "Practice: 10 tricky scope output questions",
                topicSlug: "javascript-tricky-questions",
              },
            ],
          },
          {
            day: 3,
            tasks: [
              {
                text: "Closures — CRITICAL for interviews",
                topicSlug: "javascript-closure-interview-questions",
              },
              {
                text: "Real use cases: memoization, private variables, factory functions",
                topicSlug: "javascript-memoization-interview-questions",
              },
              {
                text: "Practice: Build a counter, memoize, and private module using closures",
              },
            ],
          },
          {
            day: 4,
            tasks: [
              {
                text: "this keyword — all 4 binding rules (implicit, explicit, new, default)",
                topicSlug: "javascript-this-keyword-interview-questions",
              },
              {
                text: "Arrow functions vs regular functions — this behavior",
                topicSlug: "javascript-arrow-function-interview-questions",
              },
              {
                text: "Practice: Predict output for 15 this-keyword questions",
              },
            ],
          },
          {
            day: 5,
            tasks: [
              {
                text: "bind / call / apply — differences & use cases",
              },
              { text: "Implement polyfill for bind from scratch" },
              { text: "polyfill-lab" },
            ],
          },
          {
            day: 6,
            tasks: [
              {
                text: "Event loop — microtask vs macrotask queue (deep)",
                topicSlug: "javascript-event-loop-interview-questions",
              },
              {
                text: "Promise chaining & execution order",
                topicSlug: "javascript-promise-interview-questions",
              },
              {
                text: "Practice: 20 event loop output prediction questions",
              },
            ],
          },
          {
            day: 7,
            tasks: [
              { text: "Build: Custom setTimeout using Date.now loop" },
              { text: "Build: Basic Promise polyfill" },
              { text: "Revise Week 1 notes — flashcard all concepts" },
            ],
          },
        ],
      },
      {
        week: 2,
        title: "Advanced JavaScript",
        days: [
          {
            day: 8,
            tasks: [
              {
                text: "Prototypes & prototype chain",
                topicSlug: "javascript-prototype-interview-questions",
              },
              {
                text: "Inheritance patterns: classical vs prototypal",
                topicSlug: "javascript-prototype-interview-questions",
              },
              {
                text: "Practice: Implement Object.create and instanceof from scratch",
              },
            ],
          },
          {
            day: 9,
            tasks: [
              {
                text: "ES6+ deep dive: spread/rest edge cases, destructuring tricks",
                topicSlug: "javascript-spread-rest-interview-questions",
              },
              {
                text: "Optional chaining, nullish coalescing, logical assignment",
                topicSlug: "javascript-optional-chaining-interview-questions",
              },
              { text: "Practice: 12 ES6 output questions" },
            ],
          },
          {
            day: 10,
            tasks: [
              {
                text: "Async/await internals — how it desugars to generators",
                topicSlug: "javascript-async-await-interview-questions",
              },
              {
                text: "Error handling with async — try/catch patterns",
                topicSlug: "javascript-error-handling-interview-questions",
              },
              {
                text: "Parallel vs sequential async patterns (Promise.all, race, allSettled)",
                topicSlug:
                  "blog/javascript/promise-all-vs-allsettled-vs-race-vs-any-the-complete-comparison",
              },
            ],
          },
          {
            day: 11,
            tasks: [
              {
                text: "Error handling patterns — custom Error classes",
                topicSlug: "javascript-error-handling-interview-questions",
              },
              {
                text: "Retry logic, exponential backoff implementation",
              },
              {
                text: "Practice: Build retry wrapper with exponential backoff",
              },
            ],
          },
          {
            day: 12,
            tasks: [
              {
                text: "Memory management — heap vs stack",
                topicSlug: "javascript-memory-management-interview-questions",
              },
              {
                text: "Garbage collection — mark & sweep",
                topicSlug: "javascript-memory-management-interview-questions",
              },
              {
                text: "Memory leaks in React & how to detect them (DevTools)",
              },
            ],
          },
          {
            day: 13,
            tasks: [
              {
                text: "Implement debounce from scratch (with leading/trailing options)",
                topicSlug: "polyfill-lab",
              },
              {
                text: "Implement throttle from scratch",
                topicSlug: "polyfill-lab",
              },
              { text: "Practice: Build debounced search input" },
            ],
          },
          {
            day: 14,
            tasks: [
              {
                text: "Polyfills: Array.map, Array.reduce, Array.filter, Array.flat",
                topicSlug: "polyfill-lab",
              },
              {
                text: "Polyfills: Promise.all, Promise.race, Promise.allSettled",
                topicSlug: "polyfill-lab",
              },
              {
                text: "Revise Week 2 — write all polyfills from memory",
              },
            ],
          },
        ],
      },
      {
        week: 3,
        title: "Browser & Web Internals",
        days: [
          {
            day: 15,
            tasks: [
              {
                text: "Browser rendering pipeline: parsing → DOM → CSSOM → Render tree → Layout → Paint → Composite",
                topicSlug: "javascript-dom-interview-questions",
              },
              {
                text: "Critical rendering path optimization",
                topicSlug: "javascript-dom-interview-questions",
              },
              {
                text: "Practice: Identify bottlenecks in a given HTML/CSS setup",
              },
            ],
          },
          {
            day: 16,
            tasks: [
              {
                text: "Reflow vs Repaint — what triggers each",
              },
              { text: "GPU compositing — when and why" },
              {
                text: "Practice: List 10 CSS properties that trigger reflow vs repaint",
              },
            ],
          },
          {
            day: 17,
            tasks: [
              {
                text: "HTTP 1.1 vs HTTP/2 vs HTTP/3 — key differences",
              },
              {
                text: "Caching: Cache-Control, ETags, max-age, stale-while-revalidate",
              },
              { text: "CDN internals — edge caching, cache invalidation" },
            ],
          },
          {
            day: 18,
            tasks: [
              {
                text: "Cookies vs localStorage vs sessionStorage — security & scope",
              },
              { text: "IndexedDB — when to use it", topicSlug: "indexeddb" },
              {
                text: "Service Workers & offline caching basics",
              },
            ],
          },
          {
            day: 19,
            tasks: [
              { text: "CORS — preflight, origins, headers to set" },
              {
                text: "XSS — types (stored, reflected, DOM) & prevention",
              },
              {
                text: "CSRF — token pattern, SameSite cookies",
              },
            ],
          },
          {
            day: 20,
            tasks: [
              {
                text: "Weekend Build Day 1: Debounced search UI with real API",
              },
              {
                text: "Implement client-side caching layer for API responses",
              },
              {
                text: "Add loading/error states with skeleton screens",
              },
            ],
          },
          {
            day: 21,
            tasks: [
              { text: "Weekend Build Day 2: Add URL-synced search state" },
              {
                text: "Implement AbortController to cancel stale requests",
              },
              { text: "Revise Weeks 1–3: full flashcard pass" },
            ],
          },
        ],
      },
      {
        week: 4,
        title: "DSA — Frontend Focus",
        days: [
          {
            day: 22,
            tasks: [
              { text: "Arrays: two pointers pattern" },
              { text: "Strings: sliding window" },
              {
                text: "Solve 3 LeetCode: Two Sum, Valid Palindrome, Container With Most Water",
              },
            ],
          },
          {
            day: 23,
            tasks: [
              { text: "Hashing: frequency maps, anagram detection" },
              {
                text: "Solve 3 problems: Group Anagrams, Top K Frequent, Longest Consecutive Sequence",
              },
            ],
          },
          {
            day: 24,
            tasks: [
              {
                text: "Linked List: reversal, cycle detection (Floyd's)",
              },
              {
                text: "Solve 3 problems: Reverse List, Detect Cycle, Merge Two Sorted Lists",
              },
            ],
          },
          {
            day: 25,
            tasks: [
              {
                text: "Stack & Queue patterns",
              },
              { text: "Monotonic stack (Next Greater Element)" },
              {
                text: "Solve 3 problems: Valid Parentheses, Daily Temperatures, Largest Rectangle in Histogram",
              },
            ],
          },
          {
            day: 26,
            tasks: [
              {
                text: "Binary Search: search in rotated, find first/last position",
              },
              {
                text: "Solve 3 problems: Binary Search, Search Rotated Array, Find Peak Element",
              },
            ],
          },
          {
            day: 27,
            tasks: [
              {
                text: "Weekend: Solve 8 mixed problems (arrays, strings, hashing)",
              },
              { text: "Time yourself — target under 20 mins each" },
              { text: "Review any failed approaches" },
            ],
          },
          {
            day: 28,
            tasks: [
              { text: "Weekend: Full JS Month 1 revision" },
              { text: "Write all polyfills from memory" },
              {
                text: "Mock output-prediction quiz: 30 questions in 20 min",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    month: 2,
    title: "React Deep Dive",
    accent: "blue",
    weeks: [
      {
        week: 5,
        title: "React Core Internals",
        days: [
          {
            day: 29,
            tasks: [
              {
                text: "How React works internally — JSX compilation",
              },
              {
                text: "Fiber architecture overview",
                topicSlug: "react-fiber-interview-questions",
              },
              {
                text: "React element vs component vs instance distinction",
              },
            ],
          },
          {
            day: 30,
            tasks: [
              {
                text: "Virtual DOM — what it actually is (not a real DOM)",
              },
              {
                text: "Reconciliation algorithm — diffing rules (key, type)",
                topicSlug: "react-rendering-reconciliation-interview-questions",
              },
              { text: "When React bails out of rendering" },
            ],
          },
          {
            day: 31,
            tasks: [
              {
                text: "Rendering phases: render phase vs commit phase",
                topicSlug: "react-rendering-reconciliation-interview-questions",
              },
              {
                text: "Concurrent mode concepts — time slicing",
                topicSlug:
                  "react-concurrent-rendering-react-18-interview-questions",
              },
              {
                text: "StrictMode double-invocation — why it exists",
              },
            ],
          },
          {
            day: 32,
            tasks: [
              {
                text: "State updates — auto-batching in React 18",
              },
              {
                text: "setState batching inside timeouts, promises (React 18 vs 17 difference)",
              },
              {
                text: "Practice: Predict render counts for given update sequences",
              },
            ],
          },
          {
            day: 33,
            tasks: [
              {
                text: "Controlled vs uncontrolled components — trade-offs",
              },
              {
                text: "Lifting state vs composition patterns",
              },
              {
                text: "Practice: Build a form with controlled inputs + validation",
              },
            ],
          },
          {
            day: 34,
            tasks: [
              {
                text: "Weekend Build: Reusable form system with validation",
              },
              { text: "Compound component pattern for form fields" },
              {
                text: "Add accessible error messages & ARIA attributes",
              },
            ],
          },
          {
            day: 35,
            tasks: [
              {
                text: "Weekend: Review React core — write 10 interview Q&A from memory",
              },
              {
                text: "Mock Q: Explain reconciliation in 2 mins",
              },
              {
                text: "Mock Q: What happens when a component's key changes?",
              },
            ],
          },
        ],
      },
      {
        week: 6,
        title: "Hooks Mastery",
        days: [
          {
            day: 36,
            tasks: [
              {
                text: "useState — lazy initializer, functional update form",
                topicSlug: "react-usestate-interview-questions",
              },
              {
                text: "State as snapshot — why closures cause stale state",
                topicSlug: "stale-closures",
              },
              { text: "Practice: 10 useState edge case questions" },
            ],
          },
          {
            day: 37,
            tasks: [
              {
                text: "useEffect — dependency array rules, exhaustive-deps lint rule",
                topicSlug: "react-useeffect-interview-questions",
              },
              {
                text: "Cleanup function — subscriptions, timers, abort controllers",
              },
              { text: "Practice: Debug 5 broken useEffect patterns" },
            ],
          },
          {
            day: 38,
            tasks: [
              {
                text: "useRef — mutable container vs DOM ref",
                topicSlug: "react-useref-interview-questions",
              },
              {
                text: "Preserving values across renders without re-render",
              },
              {
                text: "Practice: Build a stopwatch using useRef + useEffect",
              },
            ],
          },
          {
            day: 39,
            tasks: [
              {
                text: "useMemo — when it helps vs when it's premature optimization",
                topicSlug: "react-usememo-interview-questions",
              },
              {
                text: "Referential equality and why it matters for memoization",
              },
              {
                text: "Practice: Identify which values in a component need useMemo",
              },
            ],
          },
          {
            day: 40,
            tasks: [
              {
                text: "useCallback — stabilizing function references",
                topicSlug: "react-usecallback-interview-questions",
              },
              { text: "useCallback + useMemo combined patterns" },
              {
                text: "Practice: Fix unnecessary child re-renders using useCallback",
              },
            ],
          },
          {
            day: 41,
            tasks: [
              {
                text: "Weekend Build: Custom hooks library",
                topicSlug: "react-custom-hook-interview-questions",
              },
              {
                text: "Implement: useDebounce, useLocalStorage, usePrevious, useWindowSize, useOnClickOutside",
              },
            ],
          },
          {
            day: 42,
            tasks: [
              {
                text: "Weekend: useContext deep dive — Context API pitfalls",
                topicSlug: "react-usecontext-interview-questions",
              },
              {
                text: "useReducer — when to prefer over useState",
                topicSlug: "react-usereducer-interview-questions",
              },
              {
                text: "Build: Theme switcher using Context + useReducer",
              },
            ],
          },
        ],
      },
      {
        week: 7,
        title: "Performance + Patterns",
        days: [
          {
            day: 43,
            tasks: [
              {
                text: "React.memo — shallow comparison, custom comparator",
              },
              {
                text: "When NOT to use React.memo (cost of comparison)",
              },
              {
                text: "Practice: Profile a component tree, identify memo candidates",
              },
            ],
          },
          {
            day: 44,
            tasks: [
              {
                text: "Code splitting — React.lazy + Suspense",
              },
              {
                text: "Route-based vs component-based splitting",
              },
              {
                text: "Implement: Lazy-loaded modal, lazy-loaded route",
              },
            ],
          },
          {
            day: 45,
            tasks: [
              {
                text: "Virtualization — react-window / react-virtual concepts",
              },
              { text: "Implement basic virtual list from scratch" },
              {
                text: "When to use: 100+ items in a scrollable list",
              },
            ],
          },
          {
            day: 46,
            tasks: [
              {
                text: "Context API performance pitfalls — re-renders from context",
              },
              { text: "Split context pattern — separate state from dispatch" },
              {
                text: "Practice: Refactor a slow context to split pattern",
              },
            ],
          },
          {
            day: 47,
            tasks: [
              {
                text: "Image optimization — lazy loading, WebP, srcSet",
              },
              { text: "Font loading strategies — font-display: swap" },
              {
                text: "Practice: Audit a page using Lighthouse, fix 3 issues",
              },
            ],
          },
          {
            day: 48,
            tasks: [
              {
                text: "Weekend: Take a slow React app, profile in DevTools",
              },
              {
                text: "Identify: wasted renders, expensive computations, large bundles",
              },
              {
                text: "Apply fixes: memo, lazy, split context",
              },
            ],
          },
          {
            day: 49,
            tasks: [
              {
                text: "Weekend: HOC pattern, Render Props — when each fits",
              },
              {
                text: "Compound components pattern — real example (Tabs UI)",
              },
              { text: "Revise Weeks 5–7 concepts" },
            ],
          },
        ],
      },
      {
        week: 8,
        title: "Advanced React",
        days: [
          {
            day: 50,
            tasks: [
              {
                text: "Error boundaries — class component requirement, why no hook",
              },
              {
                text: "Error boundary patterns: per-route, per-section",
              },
              {
                text: "Implement: Error boundary with retry button",
              },
            ],
          },
          {
            day: 51,
            tasks: [
              {
                text: "Portals — when to use (modals, tooltips)",
              },
              {
                text: "Implement: Modal system using React.createPortal",
              },
              {
                text: "Handle focus trapping inside portal modal",
              },
            ],
          },
          {
            day: 52,
            tasks: [
              {
                text: "React 18 features: useTransition, useDeferredValue",
              },
              { text: "Concurrent rendering practical use cases" },
              {
                text: "Practice: Add smooth search with useDeferredValue",
                topicSlug: "usedeferred-value",
              },
            ],
          },
          {
            day: 53,
            tasks: [
              { text: "Forms deep dive: React Hook Form (basics)" },
              { text: "Validation schemas: Zod integration pattern" },
              {
                text: "Build: Multi-step form with validation at each step",
              },
            ],
          },
          {
            day: 54,
            tasks: [
              {
                text: "State management: Zustand vs Redux Toolkit — trade-offs",
              },
              { text: "Zustand basics — store, selectors, actions" },
              { text: "Build: Cart state using Zustand" },
            ],
          },
          {
            day: 55,
            tasks: [
              { text: "Weekend Build: Complex dashboard UI" },
              {
                text: "Features: filters, sorting, pagination, debounced search",
              },
              { text: "All client-side — no external state library" },
            ],
          },
          {
            day: 56,
            tasks: [
              {
                text: "Weekend: Revise all React — write 20 interview Q&A from memory",
              },
              {
                text: "Mock Q: How does React reconcile list items?",
              },
              {
                text: "Mock Q: Explain the difference between useMemo and useCallback",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    month: 3,
    title: "Machine Coding + Projects",
    accent: "amber",
    weeks: [
      {
        week: 9,
        title: "Machine Coding — Core Components",
        days: [
          {
            day: 57,
            tasks: [
              {
                text: "Machine code: Todo app — add, complete, delete, filter (all/active/completed)",
              },
              { text: "Persist state (localStorage)" },
              { text: "Add edit-in-place functionality" },
            ],
          },
          {
            day: 58,
            tasks: [
              {
                text: "Machine code: Autocomplete / typeahead component",
              },
              {
                text: "Debounced API calls, keyboard navigation (↑↓ Enter Esc)",
              },
              {
                text: "Handle loading & error states, no flicker on fast typing",
              },
            ],
          },
          {
            day: 59,
            tasks: [
              {
                text: "Machine code: Infinite scroll feed",
              },
              { text: "IntersectionObserver API for trigger" },
              {
                text: "Handle: first load, loading skeleton, error + retry, end of feed",
              },
            ],
          },
          {
            day: 60,
            tasks: [
              { text: "Machine code: Star rating component" },
              { text: "Hover preview, click to set, keyboard accessible" },
              { text: "Half-star support variant" },
            ],
          },
          {
            day: 61,
            tasks: [
              { text: "Machine code: Accordion / FAQ component" },
              { text: "Multiple open vs single open modes" },
              {
                text: "Smooth CSS animation, ARIA expanded attributes",
              },
            ],
          },
          {
            day: 62,
            tasks: [
              {
                text: "Weekend: Tabs component with route sync (URL hash)",
              },
              { text: "Lazy-load tab content on first activation" },
              { text: "Animate tab indicator (CSS transform)" },
            ],
          },
          {
            day: 63,
            tasks: [
              {
                text: "Weekend: Modal system — open/close, backdrop click, Escape key",
              },
              { text: "Stack multiple modals" },
              {
                text: "Focus trap inside modal (Tab cycles through focusable elements)",
              },
            ],
          },
        ],
      },
      {
        week: 10,
        title: "Machine Coding — Complex UIs",
        days: [
          {
            day: 64,
            tasks: [
              { text: "Machine code: File explorer tree" },
              { text: "Nested expand/collapse, lazy load children" },
              {
                text: "Keyboard navigation, multi-select with Shift+click",
              },
            ],
          },
          {
            day: 65,
            tasks: [
              {
                text: "Machine code: Drag & drop sortable list",
              },
              { text: "Native HTML5 drag API (no library)" },
              { text: "Smooth drop animation using CSS transform" },
            ],
          },
          {
            day: 66,
            tasks: [
              { text: "Machine code: Kanban board" },
              { text: "Drag cards between columns" },
              {
                text: "Optimistic UI updates, column limit enforcement",
              },
            ],
          },
          {
            day: 67,
            tasks: [
              {
                text: "Machine code: Data table with column sorting",
              },
              {
                text: "Pagination, row selection with checkbox, bulk actions",
              },
              { text: "Multi-column sort support" },
            ],
          },
          {
            day: 68,
            tasks: [
              { text: "Machine code: Image carousel" },
              { text: "Touch swipe support, keyboard navigation" },
              {
                text: "Lazy load off-screen images, dot indicators",
              },
            ],
          },
          {
            day: 69,
            tasks: [
              { text: "Weekend: Calendar date picker component" },
              { text: "Month navigation, range selection" },
              { text: "Disabled dates, min/max date constraints" },
            ],
          },
          {
            day: 70,
            tasks: [
              { text: "Weekend: Stopwatch + Countdown timer" },
              { text: "Start/pause/reset, laps for stopwatch" },
              { text: "useRef for accurate timing (no drift)" },
            ],
          },
        ],
      },
      {
        week: 11,
        title: "Project 1 — Scalable Dashboard",
        days: [
          {
            day: 71,
            tasks: [
              {
                text: "Setup: Next.js App Router + TypeScript + Tailwind",
              },
              {
                text: "Design system: shared components, color tokens",
              },
              {
                text: "Plan features: charts, filters, date range, data table",
              },
            ],
          },
          {
            day: 72,
            tasks: [
              {
                text: "Build: Sidebar navigation with active route highlighting",
              },
              { text: "Responsive: collapses to drawer on mobile" },
              { text: "Keyboard shortcut to toggle sidebar" },
            ],
          },
          {
            day: 73,
            tasks: [
              {
                text: "Build: KPI metric cards with trend indicators",
              },
              { text: "Animated number count-up on mount" },
              { text: "Skeleton loading states" },
            ],
          },
          {
            day: 74,
            tasks: [
              { text: "Build: Bar + Line chart (Recharts)" },
              { text: "Date range filter syncs all charts" },
              {
                text: "Charts re-render smoothly on filter change",
              },
            ],
          },
          {
            day: 75,
            tasks: [
              {
                text: "Build: Filterable, sortable data table with pagination",
              },
              { text: "Column visibility toggle" },
              { text: "Export to CSV functionality" },
            ],
          },
          {
            day: 76,
            tasks: [
              {
                text: "Weekend: URL state sync — all filters in search params",
              },
              {
                text: "Add: Global search across table data with highlight",
              },
              { text: "Debounced search, highlight matched text" },
            ],
          },
          {
            day: 77,
            tasks: [
              { text: "Weekend: Polish & performance audit" },
              {
                text: "Add error boundaries, loading states everywhere",
              },
              { text: "Lighthouse audit — fix top 3 issues" },
            ],
          },
        ],
      },
      {
        week: 12,
        title: "Project 2 + DSA Sprint",
        days: [
          {
            day: 78,
            tasks: [
              {
                text: "Project 2: Real-time chat UI — message list, input, send",
              },
              { text: "Group messages by date separator" },
              {
                text: "Virtualize message list for 1000+ messages",
              },
            ],
          },
          {
            day: 79,
            tasks: [
              {
                text: "Project 2: Add emoji picker, file attachment preview",
              },
              { text: "Read receipts, typing indicator animation" },
              { text: "Unread message count badge" },
            ],
          },
          {
            day: 80,
            tasks: [
              {
                text: "DSA: Trees — DFS, BFS, level order traversal",
              },
              {
                text: "Solve: Max Depth, Path Sum, LCA, Serialize/Deserialize",
              },
            ],
          },
          {
            day: 81,
            tasks: [
              {
                text: "DSA: Dynamic Programming — top-down memoization",
              },
              {
                text: "Solve: Climbing Stairs, Coin Change, Longest Common Subsequence",
              },
            ],
          },
          {
            day: 82,
            tasks: [
              {
                text: "DSA: Graphs — adjacency list, BFS, DFS",
              },
              {
                text: "Solve: Number of Islands, Clone Graph, Course Schedule",
              },
            ],
          },
          {
            day: 83,
            tasks: [
              {
                text: "Weekend: DSA mock — 3 medium problems in 90 min",
              },
              { text: "Self-review: time/space complexity analysis" },
              { text: "Watch 2 JS interview walkthroughs" },
            ],
          },
          {
            day: 84,
            tasks: [
              {
                text: "Weekend: Push both projects to GitHub with READMEs",
              },
              {
                text: "Write README for each (problem, solution, tech stack)",
              },
              { text: "Record a 2-min screen demo of your project" },
            ],
          },
        ],
      },
    ],
  },
  {
    month: 4,
    title: "Interview Mode",
    accent: "coral",
    weeks: [
      {
        week: 13,
        title: "Behavioral + System Design",
        days: [
          {
            day: 85,
            tasks: [
              {
                text: "System design basics: scalability, load balancing, CDN, caching",
              },
              {
                text: "Frontend system design: state architecture for large apps",
              },
              {
                text: "Design: News feed (infinite scroll, caching, real-time updates)",
              },
            ],
          },
          {
            day: 86,
            tasks: [
              { text: "STAR method for behavioral questions" },
              {
                text: "Prepare 8 stories: impact, conflict, failure, leadership, ownership",
              },
              {
                text: "Practice: 'Tell me about a time you improved performance'",
              },
            ],
          },
          {
            day: 87,
            tasks: [
              {
                text: "JS interview deep session: 30 questions in 60 min",
              },
              {
                text: "Focus: closures, event loop, prototype, this, async",
              },
              {
                text: "Target: answer each under 90 seconds",
              },
            ],
          },
          {
            day: 88,
            tasks: [
              {
                text: "React interview deep session: 20 questions in 60 min",
              },
              {
                text: "Focus: hooks, rendering, reconciliation, performance",
              },
              {
                text: "Include architectural questions (when to split components)",
              },
            ],
          },
          {
            day: 89,
            tasks: [
              {
                text: "Machine coding mock: Build autocomplete in 45 min solo",
              },
              { text: "No help — timer running" },
              {
                text: "Review: completeness, edge cases, code clarity",
              },
            ],
          },
          {
            day: 90,
            tasks: [
              {
                text: "Apply to 20 companies — target: Zepto, Meesho, PhonePe, Razorpay, CRED, Groww, Flipkart, Swiggy",
              },
              {
                text: "Craft tailored cover note for each (3 sentences max)",
              },
              {
                text: "Track in spreadsheet: company, date, status, next step",
              },
            ],
          },
          {
            day: 91,
            tasks: [
              {
                text: "Weekend: Full mock interview (self-record)",
              },
              { text: "Round 1: JS + React Q&A (30 min)" },
              { text: "Round 2: Machine coding — Data table (45 min)" },
            ],
          },
        ],
      },
      {
        week: 14,
        title: "Mock Interviews + Gap Fixing",
        days: [
          {
            day: 92,
            tasks: [
              {
                text: "Identify Week 13 mock gaps — top 3 weak areas",
              },
              {
                text: "Deep dive on gap 1 with examples and practice",
              },
              { text: "Write 5 Q&A on gap 1 from memory" },
            ],
          },
          {
            day: 93,
            tasks: [
              {
                text: "Deep dive on gap 2 with examples and practice",
              },
              {
                text: "Machine code: Build the component type you struggled with",
              },
              { text: "Time yourself again — compare to Day 89" },
            ],
          },
          {
            day: 94,
            tasks: [
              { text: "Deep dive on gap 3" },
              {
                text: "System design: Design search-as-you-type at scale",
              },
              {
                text: "Cover: debounce, caching, CDN, server-side vs client-side suggestions",
              },
            ],
          },
          {
            day: 95,
            tasks: [
              { text: "DSA sprint: 5 medium problems in 2 hours" },
              { text: "Focus: areas that came up in mock" },
              { text: "Track pass rate — aim for 4/5" },
            ],
          },
          {
            day: 96,
            tasks: [
              {
                text: "Review all applied JDs — extract repeated tech keywords",
              },
              {
                text: "Ensure portfolio covers: Next.js SSR, TypeScript, performance, testing",
              },
              {
                text: "Add any missing tech demo to projects",
              },
            ],
          },
          {
            day: 97,
            tasks: [
              { text: "Apply to 15 more companies" },
              {
                text: "Follow up on Week 13 applications (email or LinkedIn)",
              },
              {
                text: "Prepare 3 smart questions to ask interviewers",
              },
            ],
          },
          {
            day: 98,
            tasks: [
              {
                text: "Weekend: Full-length mock interview simulation",
              },
              {
                text: "Include: intro (2 min), JS (20 min), React (20 min), machine coding (45 min), Q&A",
              },
              { text: "Score yourself 1–10 on each section" },
            ],
          },
        ],
      },
      {
        week: 15,
        title: "Real Interviews + Iteration",
        days: [
          {
            day: 99,
            tasks: [
              {
                text: "Pre-interview ritual: review key concepts 30 min before",
              },
              {
                text: "Print mental checklist: intro → clarify → plan → code → test → optimize",
              },
            ],
          },
          {
            day: 100,
            tasks: [
              {
                text: "After each interview: write down every question asked (within 1 hour)",
              },
              { text: "Score yourself on each section" },
              {
                text: "Identify 1 gap to fix before next interview",
              },
            ],
          },
          {
            day: 101,
            tasks: [
              {
                text: "Machine coding: revisit any component type that came up in interview",
              },
              {
                text: "Improve time: target 35 min for medium complexity UI",
              },
              {
                text: "Add to portfolio if it's a clean implementation",
              },
            ],
          },
          {
            day: 102,
            tasks: [
              {
                text: "JS deep revision: anything that caught you off guard",
              },
              {
                text: "Add to personal cheat sheet (for memorizing)",
              },
            ],
          },
          {
            day: 103,
            tasks: [
              {
                text: "React deep revision: any hook or pattern you fumbled",
              },
              { text: "Build a mini-app demonstrating the concept" },
              { text: "Push to GitHub" },
            ],
          },
          {
            day: 104,
            tasks: [
              {
                text: "Apply to 15 more companies — referrals priority",
              },
              {
                text: "LinkedIn: post about a technical insight (visibility)",
              },
              {
                text: "Reach out to 3 connections at target companies for referral",
              },
            ],
          },
          {
            day: 105,
            tasks: [
              { text: "Weekend: Full system design mock" },
              {
                text: "Design: Booking system at scale",
              },
              {
                text: "Cover: search, availability, real-time updates, payments integration",
              },
            ],
          },
        ],
      },
      {
        week: 16,
        title: "Final Push + Offer Negotiation",
        days: [
          {
            day: 106,
            tasks: [
              {
                text: "Negotiate: Research market rates (Glassdoor, Levels.fyi, LinkedIn Salary)",
              },
              {
                text: "Know your: current CTC, expected, minimum, stretch ask",
              },
              {
                text: "Script: 'Based on my research and the impact I've delivered...'",
              },
            ],
          },
          {
            day: 107,
            tasks: [
              {
                text: "Competing offer strategy — inform other companies if you get one offer",
              },
              {
                text: "Timeline management — ask for 5–7 days to evaluate",
              },
              {
                text: "Negotiate beyond salary: ESOPs, joining bonus, WFH, notice period buyout",
              },
            ],
          },
          {
            day: 108,
            tasks: [
              {
                text: "JS final mock: 25 hardest questions — zero reference",
              },
              { text: "Score yourself — target 22/25" },
              { text: "Fix the 3 misses same day" },
            ],
          },
          {
            day: 109,
            tasks: [
              { text: "React final mock: 20 hardest questions" },
              {
                text: "Machine code: redo your hardest component from scratch in 30 min",
              },
            ],
          },
          {
            day: 110,
            tasks: [
              { text: "DSA final: 4 medium problems in 2 hours" },
              {
                text: "Focus: trees, DP, sliding window — most common in frontend DSA rounds",
              },
            ],
          },
          {
            day: 111,
            tasks: [
              {
                text: "Portfolio final review: GitHub, projects, LinkedIn, resume",
              },
              {
                text: "Ensure all projects have live links, READMEs, and recent commits",
              },
              {
                text: "Resume: quantify everything — use real impact numbers",
              },
            ],
          },
          {
            day: 112,
            tasks: [
              {
                text: "Final reflection: What did you learn? What would you do differently?",
              },
              {
                text: "Update JSPrep with interview questions you encountered",
              },
              { text: "Celebrate — and keep shipping 🚀" },
            ],
          },
        ],
      },
    ],
  },
];

export const TOTAL_DAYS = 112;
export const TOTAL_WEEKS = 16;

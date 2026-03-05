export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  accentColor: string
  readTime: string
  publishedAt: string
  modifiedAt: string
  keywords: string[]
  content: string // HTML/Markdown content
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'javascript-event-loop-explained',
    title: 'JavaScript Event Loop Explained Visually (With Output Examples)',
    excerpt: 'The event loop is the most common JavaScript interview topic. Here\'s a visual, step-by-step breakdown of how the call stack, microtask queue, and macrotask queue work together.',
    category: 'Deep Dive',
    accentColor: '#6af7c0',
    readTime: '8 min read',
    publishedAt: '2025-01-15',
    modifiedAt: '2025-01-15',
    keywords: ['javascript event loop', 'call stack javascript', 'microtask queue', 'macrotask queue', 'promise vs settimeout order'],
    content: `
# JavaScript Event Loop Explained Visually

The event loop is **the most tested JavaScript concept** in frontend interviews. Yet most developers have a fuzzy mental model of it.

This guide gives you a precise, visual understanding — the kind that lets you predict output questions correctly every time.

## The Core Model

JavaScript is single-threaded. It has one **call stack**. It can only do one thing at a time.

But JavaScript feels asynchronous because of three things working together:
1. **Call stack** — where synchronous code runs
2. **Microtask queue** — where Promise callbacks wait
3. **Macrotask queue** — where setTimeout/setInterval callbacks wait

The event loop rule is simple:
> **After each task completes: drain ALL microtasks, then take ONE macrotask, then drain ALL microtasks again.**

\`\`\`js
console.log('1');                              // sync → call stack
setTimeout(() => console.log('2'), 0);        // → macrotask queue
Promise.resolve().then(() => console.log('3')); // → microtask queue
console.log('4');                              // sync → call stack

// Output: 1 → 4 → 3 → 2
\`\`\`

## Step-by-Step Walkthrough

**Step 1:** \`console.log('1')\` — sync, runs immediately → prints **1**

**Step 2:** \`setTimeout(..., 0)\` — callback sent to macrotask queue (not call stack!)

**Step 3:** \`Promise.resolve().then(...)\` — callback sent to microtask queue

**Step 4:** \`console.log('4')\` — sync, runs immediately → prints **4**

**Step 5:** Call stack empty. Check microtask queue. Run \`console.log('3')\` → prints **3**

**Step 6:** Microtask queue empty. Take next macrotask. Run \`console.log('2')\` → prints **2**

## What Goes Where?

### Microtasks
- \`Promise.then/catch/finally\`
- \`async/await\` (await resumes as microtask)
- \`queueMicrotask()\`
- \`MutationObserver\`

### Macrotasks
- \`setTimeout\`
- \`setInterval\`
- \`setImmediate\` (Node.js)
- I/O callbacks
- UI rendering events

## The Nesting Trap

This is where most developers get confused:

\`\`\`js
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
    setTimeout(() => console.log('timeout inside promise'), 0);
  })
  .then(() => console.log('promise 2'));

console.log('end');
\`\`\`

**Output:**
\`\`\`
start
end
promise 1
promise 2
timeout 1
promise inside timeout
timeout inside promise
\`\`\`

**Why?**
1. Sync: "start", "end"
2. Microtasks drain: "promise 1" (queues a timeout), "promise 2"
3. Macrotask: "timeout 1" → runs, then drains microtasks → "promise inside timeout"
4. Macrotask: "timeout inside promise"

## Interview Tips

💡 **The golden rule:** Microtasks always run before the next macrotask — even if they're added while microtasks are running.

💡 **Trick question:** \`await\` splits a function at the await point. Code after await runs as a microtask.

\`\`\`js
async function run() {
  console.log('A');     // sync
  await Promise.resolve();
  console.log('B');     // microtask
}
run();
console.log('C');       // sync

// Output: A → C → B
\`\`\`
    `,
  },
  {
    slug: 'javascript-closures-interview',
    title: 'JavaScript Closures: Interview Questions, Examples & Gotchas',
    excerpt: 'Closures are asked in almost every JavaScript interview. Master the concept, understand the classic loop gotcha, and learn the real-world use cases interviewers expect you to know.',
    category: 'Interview Prep',
    accentColor: '#7c6af7',
    readTime: '6 min read',
    publishedAt: '2025-01-12',
    modifiedAt: '2025-01-12',
    keywords: ['javascript closures interview', 'closure examples', 'closure loop problem', 'practical closure uses'],
    content: `
# JavaScript Closures: The Complete Interview Guide

Closures appear in **over 80% of JavaScript interviews**. Not because they're hard — but because they reveal how deeply you understand JavaScript's execution model.

## What Is a Closure?

A closure is a function that **retains access to its outer scope** even after the outer function has returned.

\`\`\`js
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}
const increment = outer();
increment(); // 1
increment(); // 2
increment(); // 3
\`\`\`

\`inner\` is a closure. It "closes over" \`count\` — retaining a live reference to it even after \`outer\` has finished executing.

## The Classic Loop Problem

This is the most common closure interview question:

\`\`\`js
// ❌ Bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3

// ✅ Fix 1: use let (block-scoped — each iteration gets own i)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2

// ✅ Fix 2: IIFE to capture i
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
\`\`\`

**Why does var fail?** All three closures share the same \`i\` binding. By the time the timeouts fire, the loop has finished and \`i\` is 3.

## Real-World Uses

**1. Data encapsulation (module pattern)**
\`\`\`js
function createBankAccount(initial) {
  let balance = initial; // private!
  return {
    deposit: (n) => (balance += n),
    withdraw: (n) => (balance -= n),
    getBalance: () => balance,
  };
}
\`\`\`

**2. Memoization**
\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`

**3. Partial application**
\`\`\`js
function multiply(a) {
  return (b) => a * b;
}
const double = multiply(2);
double(5); // 10
\`\`\`
    `,
  },
  {
    slug: 'top-50-javascript-interview-questions',
    title: 'Top 50 JavaScript Interview Questions Asked in 2025',
    excerpt: 'The definitive list of the 50 most common JavaScript interview questions for frontend developers, with concise answers. Covers everything from basics to advanced topics.',
    category: 'Interview Prep',
    accentColor: '#f7c76a',
    readTime: '15 min read',
    publishedAt: '2025-01-10',
    modifiedAt: '2025-01-10',
    keywords: ['top javascript interview questions', 'most common js interview questions', 'javascript interview 2025', 'javascript interview questions list'],
    content: '', // Would be populated fully
  },
  {
    slug: 'javascript-promises-async-await',
    title: 'Promises vs async/await: JavaScript Interview Deep Dive',
    excerpt: 'A complete guide to JavaScript Promises and async/await. Understand the states, combinators, error handling patterns, and parallel vs sequential patterns interviewers test.',
    category: 'Deep Dive',
    accentColor: '#f76a6a',
    readTime: '10 min read',
    publishedAt: '2025-01-08',
    modifiedAt: '2025-01-08',
    keywords: ['javascript promises interview', 'async await interview questions', 'promise.all vs promise.race', 'javascript async error handling'],
    content: '',
  },
  {
    slug: 'javascript-output-questions',
    title: 'Hard JavaScript Output Questions (With Explanations)',
    excerpt: 'The trickiest JavaScript output prediction questions that appear in FAANG and product company interviews. Each includes a step-by-step explanation of the answer.',
    category: 'Practice',
    accentColor: '#a78bfa',
    readTime: '12 min read',
    publishedAt: '2025-01-05',
    modifiedAt: '2025-01-05',
    keywords: ['javascript output questions', 'javascript tricky questions', 'js code output prediction', 'javascript interview puzzles'],
    content: '',
  },
]
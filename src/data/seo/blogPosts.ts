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
  content: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'javascript-event-loop-explained',
    title: 'JavaScript Event Loop Explained Visually (With Output Examples)',
    excerpt: "The event loop is the most common JavaScript interview topic. Here's a visual, step-by-step breakdown of how the call stack, microtask queue, and macrotask queue work together.",
    category: 'Deep Dive',
    accentColor: '#6af7c0',
    readTime: '8 min read',
    publishedAt: '2025-01-15',
    modifiedAt: '2025-06-01',
    keywords: ['javascript event loop', 'call stack javascript', 'microtask queue', 'macrotask queue', 'promise vs settimeout order'],
    content: `
# JavaScript Event Loop Explained Visually

The event loop is **the most tested JavaScript concept** in frontend interviews. Yet most developers have a fuzzy mental model of it.

## The Core Problem: JavaScript is Single-Threaded

JavaScript runs on a single thread — it can only do one thing at a time. But websites need to fetch data, handle clicks, run timers simultaneously. The **event loop** creates the illusion of concurrency using a carefully ordered queue system.

## The Three Components

**1. The Call Stack** — LIFO stack tracking what function is currently executing. When empty, the event loop checks the queues.

**2. The Microtask Queue (High Priority)** — runs immediately after current task completes, before any render or macrotask.
- Promise .then/.catch/.finally callbacks
- queueMicrotask()
- MutationObserver callbacks

**3. The Macrotask Queue (Low Priority)** — runs one at a time; browser can render between them.
- setTimeout / setInterval callbacks
- User events (click, keypress)
- I/O callbacks

## The Event Loop Algorithm

\`\`\`
while (true) {
  1. Execute current synchronous code (drain call stack)
  2. Drain the ENTIRE microtask queue
  3. [Render phase — browser repaints if needed]
  4. Pick ONE macrotask and execute it
  5. Go to step 2
}
\`\`\`

> Key insight: ALL microtasks drain before ANY macrotask runs.

## The Classic Output Question

\`\`\`javascript
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
// Output: 1, 4, 3, 2
\`\`\`

Trace: sync (1, 4) → drain microtask (3) → macrotask (2).

## Nested Promises: Why Order Surprises You

\`\`\`javascript
Promise.resolve()
  .then(() => {
    console.log('A')
    return Promise.resolve('B') // extra microtask tick to unwrap
  })
  .then(val => console.log(val))

Promise.resolve().then(() => console.log('C'))
// Output: A, C, B
\`\`\`

Returning a nested Promise.resolve() schedules an extra microtask — so C gets in before B.

## The Render Phase

Heavy synchronous code blocks the render phase — the browser can't paint while the call stack is busy. Use requestAnimationFrame or setTimeout to yield:

\`\`\`javascript
status.textContent = 'Loading...'
setTimeout(() => heavyWork(), 0) // yields to render before heavy work
\`\`\`

| What | Queue | Priority |
|------|-------|----------|
| Promise callbacks | Microtask | HIGH |
| queueMicrotask | Microtask | HIGH |
| setTimeout(fn, 0) | Macrotask | LOW |
| User events | Macrotask | LOW |

Practice output questions at [JSPrep Pro Output Quiz](/output-quiz).
    `,
  },
  {
    slug: 'javascript-closures-interview',
    title: 'JavaScript Closures: The Complete Interview Guide',
    excerpt: "Closures are JavaScript's most frequently tested concept. Learn what they are, the classic loop bug, and how to explain them confidently in any interview.",
    category: 'Deep Dive',
    accentColor: '#7c6af7',
    readTime: '9 min read',
    publishedAt: '2025-01-12',
    modifiedAt: '2025-06-01',
    keywords: ['javascript closures interview', 'closure explained', 'closure loop bug', 'javascript closure examples'],
    content: `
# JavaScript Closures: The Complete Interview Guide

Closures come up in **every** JavaScript interview — theory, output questions, and implementation tasks.

## What is a Closure?

A closure is a function that **retains access to its outer scope's variables** even after the outer function has returned.

\`\`\`javascript
function outer() {
  let count = 0
  return function inner() {
    count++
    return count
  }
}

const counter = outer() // outer() has returned...
counter() // 1 — but count is still accessible!
counter() // 2
\`\`\`

The key: \`inner\` holds a reference to \`outer\`'s scope, preventing garbage collection. That retained scope is the closure.

## The Mental Model: The Backpack

Every function carries a "backpack" of variables from the scope where it was created. Wherever the function goes, the backpack comes with it.

\`\`\`javascript
const x = 'global'
function factory() {
  const x = 'factory'
  return function() { return x } // backpack contains factory's x
}
factory()() // 'factory' — not 'global'
\`\`\`

This is **lexical scoping**: scope is determined where code is *written*, not where it's *called*.

## The Classic Closure Bug (Asked Constantly)

\`\`\`javascript
// ❌ All callbacks share the same 'i' (var is function-scoped)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// Output: 3, 3, 3

// ✅ Fix 1: use let (block-scoped — new i each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// Output: 0, 1, 2

// ✅ Fix 2: IIFE (creates a new scope, captures current value)
for (var i = 0; i < 3; i++) {
  ;(function(j) { setTimeout(() => console.log(j), 0) })(i)
}
\`\`\`

## Real-World Closure Patterns

**Module Pattern (Private State):**
\`\`\`javascript
const counter = (() => {
  let _count = 0
  return {
    inc() { return ++_count },
    val() { return _count },
  }
})()
counter.inc() // 1
counter._count // undefined — truly private
\`\`\`

**Memoization:**
\`\`\`javascript
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}
\`\`\`

**Debounce:**
\`\`\`javascript
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
\`\`\`

## The Interview Answer

1. **Definition:** "A closure is a function that retains access to its outer scope's variables after the outer function returns."
2. **Why:** "Because of lexical scoping — functions capture the environment where they're defined."
3. **Real use:** "I use them in debounce, memoization, the module pattern, and React's useState relies on closures internally."

Practice at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-this-keyword-explained',
    title: 'JavaScript "this" Keyword: 4 Rules Every Developer Must Know',
    excerpt: 'The "this" keyword is the most confusing part of JavaScript. Learn the 4 binding rules, arrow function behaviour, and how to predict this in any context.',
    category: 'Deep Dive',
    accentColor: '#f59e0b',
    readTime: '7 min read',
    publishedAt: '2025-02-01',
    modifiedAt: '2025-06-01',
    keywords: ['javascript this keyword', 'this binding rules', 'arrow function this', 'call apply bind javascript'],
    content: `
# JavaScript "this" Keyword: 4 Rules Every Developer Must Know

Every \`this\` question can be answered by asking: *"How was this function called?"*

## Rule 1: Default Binding (Standalone Call)
\`\`\`javascript
function fn() { console.log(this) }
fn() // window (sloppy) or undefined (strict mode)
\`\`\`

## Rule 2: Implicit Binding (Method Call)
\`\`\`javascript
const user = { name: 'Alice', greet() { return this.name } }
user.greet() // 'Alice' — this = user (object before the dot)

// The lost binding trap:
const fn = user.greet  // extracted from object
fn() // undefined — no object before dot, default binding applies
\`\`\`

## Rule 3: Explicit Binding (call/apply/bind)
\`\`\`javascript
function greet(msg) { return msg + ', ' + this.name }
greet.call({ name: 'Bob' }, 'Hello')    // 'Hello, Bob'
greet.apply({ name: 'Carol' }, ['Hi']) // 'Hi, Carol'
const bound = greet.bind({ name: 'Dave' })
bound('Hey') // 'Hey, Dave' — permanently bound
\`\`\`

## Rule 4: new Binding (Constructor)
\`\`\`javascript
function Person(name) { this.name = name }
const alice = new Person('Alice')
// new: 1) creates {} 2) links prototype 3) this = {} 4) returns this
\`\`\`

## Priority: new > explicit > implicit > default

## Arrow Functions: No Own this

Arrow functions inherit \`this\` from the lexical (enclosing) scope — none of the 4 rules apply.

\`\`\`javascript
class Timer {
  start() {
    // Arrow captures Timer instance as 'this'
    setInterval(() => this.tick(), 1000) // ✓
    // Regular function would lose 'this':
    setInterval(function() { this.tick() }, 1000) // ✗ TypeError
  }
}
\`\`\`

**Interview answer flow:**
1. State the 4 rules and priority
2. Explain arrows as exception (lexical this)
3. Show the lost binding bug — proves real understanding

Practice at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-prototypes-explained',
    title: 'JavaScript Prototypes & Inheritance: What Every Dev Needs to Know',
    excerpt: 'Prototypal inheritance is the foundation of JavaScript\'s object system. Understand prototype chains, Object.create, and how ES6 classes map to prototypes under the hood.',
    category: 'Deep Dive',
    accentColor: '#34d399',
    readTime: '8 min read',
    publishedAt: '2025-02-08',
    modifiedAt: '2025-06-01',
    keywords: ['javascript prototypes', 'prototypal inheritance javascript', 'prototype chain', 'javascript class vs prototype'],
    content: `
# JavaScript Prototypes & Inheritance

ES6 classes are syntactic sugar over prototypes. Understanding the underlying system is what senior interviews test.

## What is a Prototype?

Every JavaScript object has \`[[Prototype]]\` — a link to another object. When you access a property not found on the object, JS walks this chain.

\`\`\`javascript
const animal = { breathe() { return 'breathing' } }
const dog = Object.create(animal)  // dog's [[Prototype]] = animal
dog.bark = function() { return 'woof' }

dog.bark()    // found on dog
dog.breathe() // not on dog → found on animal (prototype chain)
dog.fly       // not anywhere → undefined
\`\`\`

Chain: \`dog → animal → Object.prototype → null\`

## Functions Have a prototype Property

\`\`\`javascript
function Dog(name) { this.name = name }
Dog.prototype.bark = function() { return this.name + ' says woof' }

const rex = new Dog('Rex')
rex.bark() // 'Rex says woof'

// rex's chain: rex → Dog.prototype → Object.prototype → null
rex.__proto__ === Dog.prototype // true
\`\`\`

Putting \`bark\` on \`prototype\` = all instances share one function reference (memory efficient).

## ES6 Classes = Prototype Sugar

\`\`\`javascript
class Animal {
  constructor(name) { this.name = name }
  speak() { return this.name + ' makes a sound' }
}

class Dog extends Animal {
  speak() { return this.name + ' barks' }
}

// Exactly equivalent to:
function Animal(name) { this.name = name }
Animal.prototype.speak = function() { return this.name + ' makes a sound' }
function Dog(name) { Animal.call(this, name) }
Object.setPrototypeOf(Dog.prototype, Animal.prototype)
Dog.prototype.speak = function() { return this.name + ' barks' }
\`\`\`

## Own vs Inherited Properties

\`\`\`javascript
const parent = { inherited: true }
const child = Object.create(parent)
child.own = true

Object.keys(child)          // ['own'] — own enumerable only
for (const k in child) ...  // 'own', 'inherited' — includes inherited

child.hasOwnProperty('inherited') // false
Object.hasOwn(child, 'own')       // true (ES2022 preferred)
\`\`\`

## instanceof

Checks if Constructor.prototype is anywhere in the prototype chain:
\`\`\`javascript
rex instanceof Dog    // true
rex instanceof Animal // true
rex instanceof Object // always true for objects
\`\`\`

Practice prototype questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-promises-async-await',
    title: 'Promises vs async/await: JavaScript Interview Deep Dive',
    excerpt: 'A complete guide to JavaScript Promises and async/await. States, combinators, error handling, and the parallel vs sequential performance trap.',
    category: 'Deep Dive',
    accentColor: '#f76a6a',
    readTime: '10 min read',
    publishedAt: '2025-01-08',
    modifiedAt: '2025-06-01',
    keywords: ['javascript promises interview', 'async await interview questions', 'promise.all vs promise.race', 'javascript async error handling'],
    content: `
# Promises vs async/await: JavaScript Interview Deep Dive

## Promise States

A Promise has three states: **pending** → **fulfilled** (resolve) or **rejected** (reject). Transitions are permanent.

\`\`\`javascript
const p = new Promise((resolve, reject) => {
  fetch('/api').then(res => resolve(res.json())).catch(reject)
})
p.then(data => render(data)).catch(err => showError(err)).finally(() => hideSpinner())
\`\`\`

## The 4 Promise Combinators

\`\`\`javascript
// Promise.all — all must succeed; any reject → immediate rejection
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()])

// Promise.allSettled — always resolves; never rejects
const results = await Promise.allSettled([a(), b(), c()])
results.forEach(r => r.status === 'fulfilled' ? use(r.value) : log(r.reason))

// Promise.race — first settled (resolve OR reject) wins
const data = await Promise.race([fetch(url), timeout(5000)])

// Promise.any — first RESOLVED wins; rejects only if ALL reject
const fastest = await Promise.any([mirror1(), mirror2(), mirror3()])
\`\`\`

## async/await

\`async\` functions always return a Promise. \`await\` suspends the async function (not the thread).

\`\`\`javascript
async function fetchUser(id) {
  const res = await fetch('/api/users/' + id)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}

// Error handling
try {
  const user = await fetchUser(1)
} catch (err) {
  handleError(err)
}
\`\`\`

## The Most Common Performance Mistake

\`\`\`javascript
// ❌ Sequential — 2× slower for independent operations
const user  = await fetchUser()   // 200ms
const posts = await fetchPosts()  // then 200ms = 400ms total

// ✅ Parallel — run simultaneously
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()])
// 200ms total (just the max)
\`\`\`

Only use sequential awaits when the second operation **depends** on the first.

## Fetch Error Handling (Most Missed Gotcha)

\`\`\`javascript
// ❌ fetch() only rejects on NETWORK failure — not HTTP errors!
const data = await fetch('/api').then(r => r.json()) // 404 = no error!

// ✅ Always check response.ok
const res = await fetch('/api')
if (!res.ok) throw new Error('HTTP ' + res.status)
const data = await res.json()
\`\`\`

Practice async questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-hoisting-explained',
    title: 'JavaScript Hoisting Explained: var, let, const, and Functions',
    excerpt: 'Hoisting is one of the most misunderstood JavaScript concepts. Learn exactly what gets hoisted, what the Temporal Dead Zone really means, and how to answer interview questions.',
    category: 'Core Concepts',
    accentColor: '#60a5fa',
    readTime: '6 min read',
    publishedAt: '2025-02-15',
    modifiedAt: '2025-06-01',
    keywords: ['javascript hoisting', 'var hoisting', 'temporal dead zone', 'function declaration hoisting'],
    content: `
# JavaScript Hoisting Explained

## What Hoisting Actually Is

During the creation phase, JavaScript scans the scope for declarations before executing any code. It "hoists" declarations — but NOT initializations.

## var Hoisting
\`\`\`javascript
console.log(x) // undefined (hoisted as undefined)
var x = 5
console.log(x) // 5
\`\`\`

## Function Declaration Hoisting (Fully Hoisted)
\`\`\`javascript
greet() // Works! Function declarations are fully hoisted

function greet() { return 'Hello' }

// BUT function expressions are NOT:
sayHi() // TypeError — sayHi is undefined (var hoisting only)
var sayHi = function() { return 'Hi' }
\`\`\`

## let and const: Hoisted but in the TDZ

\`let\` and \`const\` ARE hoisted, but placed in the **Temporal Dead Zone** — accessing them before declaration throws ReferenceError.

\`\`\`javascript
console.log(x) // ReferenceError (TDZ)
let x = 5      // TDZ ends here

// Tricky: local let shadows global, creating TDZ from block START
let y = 'global'
function test() {
  console.log(y) // ReferenceError (local y is in TDZ, global y is shadowed)
  let y = 'local'
}
\`\`\`

## Hoisting Comparison

| | Hoisted? | Initialized? | Accessible before? |
|--|--|--|--|
| var | Yes | undefined | Yes (undefined) |
| let/const | Yes | No (TDZ) | No (ReferenceError) |
| function decl | Yes | Yes (full body) | Yes |
| function expr | Yes (as var) | undefined | No (TypeError) |
| class | Yes | No (TDZ) | No (ReferenceError) |

Practice hoisting questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-scope-explained',
    title: 'JavaScript Scope, Lexical Scope & the Scope Chain',
    excerpt: 'Scope determines where variables are accessible. Learn global scope, function scope, block scope, and how the scope chain enables closures.',
    category: 'Core Concepts',
    accentColor: '#a78bfa',
    readTime: '6 min read',
    publishedAt: '2025-02-22',
    modifiedAt: '2025-06-01',
    keywords: ['javascript scope', 'lexical scope', 'scope chain javascript', 'block scope vs function scope'],
    content: `
# JavaScript Scope, Lexical Scope & the Scope Chain

## Three Types of Scope

**Global scope:** Variables declared outside any function/block. Accessible everywhere.

**Function scope:** \`var\` inside a function — only accessible inside that function.

**Block scope:** \`let\`/\`const\` inside \`{}\` — only accessible in that block.

\`\`\`javascript
{
  var leaked = 'leaks out'  // var ignores blocks
  let blocked = 'stays in'  // let is block-scoped
}
console.log(leaked)   // 'leaks out'
console.log(blocked)  // ReferenceError
\`\`\`

## Lexical Scope

Scope is determined at **write time** — where code is defined, not where it's called.

\`\`\`javascript
const x = 'global'
function outer() {
  const x = 'outer'
  function inner() {
    console.log(x) // 'outer' — looks at where inner was DEFINED
  }
  return inner
}
outer()() // 'outer' — even called from global scope
\`\`\`

This is the foundation of closures.

## The Scope Chain

Variable lookup order: current scope → enclosing scope → ... → global → ReferenceError.

\`\`\`javascript
const a = 1  // global
function outer() {
  const b = 2
  function inner() {
    const c = 3
    console.log(a, b, c) // walks chain: c=own, b=outer, a=global
    console.log(d)        // ReferenceError — not in chain
  }
  inner()
}
\`\`\`

Chain goes outward only — outer scopes cannot see inner variables.

## Scope vs Context

Common interview confusion:
- **Scope** = which variables are accessible (write-time)
- **Context** = the value of \`this\` (call-time)

Practice at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-output-questions',
    title: 'Hard JavaScript Output Questions (With Step-by-Step Explanations)',
    excerpt: 'The trickiest JavaScript output prediction questions from real interviews — covering closures, event loop, type coercion, hoisting, and prototypes.',
    category: 'Practice',
    accentColor: '#a78bfa',
    readTime: '12 min read',
    publishedAt: '2025-01-05',
    modifiedAt: '2025-06-01',
    keywords: ['javascript output questions', 'javascript tricky questions', 'js code output prediction', 'javascript interview puzzles'],
    content: `
# Hard JavaScript Output Questions

## Hoisting
\`\`\`javascript
console.log(typeof foo)
console.log(typeof bar)
var foo = 'hello'
let bar = 'world'
\`\`\`
**Answer:** "undefined" then ReferenceError. var is hoisted as undefined; let is in TDZ.

---

## var in Loops
\`\`\`javascript
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) }
\`\`\`
**Answer:** 3, 3, 3. All callbacks share the same var i. Loop finishes (i=3) before any fires.

---

## Event Loop
\`\`\`javascript
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
\`\`\`
**Answer:** 1, 4, 3, 2. Sync → microtask → macrotask.

---

## Nested Promises
\`\`\`javascript
Promise.resolve()
  .then(() => { console.log('A'); return Promise.resolve('B') })
  .then(v => console.log(v))
Promise.resolve().then(() => console.log('C'))
\`\`\`
**Answer:** A, C, B. Returning a nested Promise adds an extra microtask tick — C gets in first.

---

## async/await Order
\`\`\`javascript
async function a() { console.log(1); await b(); console.log(2) }
async function b() { console.log(3) }
console.log(4); a(); console.log(5)
\`\`\`
**Answer:** 4, 1, 3, 5, 2. Sync (4, 1, 3, 5) then microtask resumes a() for 2.

---

## this + Arrows
\`\`\`javascript
const obj = {
  name: 'Obj',
  regular() { return this.name },
  arrow: () => this.name,
  nested() { return () => this.name }
}
console.log(obj.regular())   // 'Obj' (implicit binding)
console.log(obj.arrow())     // undefined (lexical this = global)
console.log(obj.nested()())  // 'Obj' (arrow captures outer method's this)
\`\`\`

---

## Type Coercion
\`\`\`javascript
console.log([] + [])    // ""
console.log([] + {})    // "[object Object]"
console.log(+[])        // 0
console.log(+{})        // NaN
\`\`\`

Practice 90+ output questions at [JSPrep Pro Output Quiz](/output-quiz).
    `,
  },
  {
    slug: 'top-50-javascript-interview-questions',
    title: 'Top 50 JavaScript Interview Questions (2025 Edition)',
    excerpt: 'The definitive list of the 50 most common JavaScript interview questions for frontend developers, with concise answers covering basics to advanced topics.',
    category: 'Interview Prep',
    accentColor: '#f7c76a',
    readTime: '15 min read',
    publishedAt: '2025-01-10',
    modifiedAt: '2025-06-01',
    keywords: ['top javascript interview questions', 'most common js interview questions', 'javascript interview 2025', 'js interview prep'],
    content: `
# Top 50 JavaScript Interview Questions (2025)

## Core JavaScript (1–15)

**1. var vs let vs const?**
var: function-scoped, hoisted as undefined. let/const: block-scoped, TDZ. const can't be reassigned (but object contents can change).

**2. What is hoisting?**
Declarations processed before execution. var → undefined; function decls → fully hoisted; let/const → TDZ.

**3. What is the Temporal Dead Zone?**
The period between block entry and the let/const declaration. Accessing in TDZ throws ReferenceError.

**4. Explain closures.**
Function retaining access to outer scope variables after the outer function has returned. Enables memoization, module pattern, partial application.

**5. What is the scope chain?**
Outward lookup through enclosing scopes to global. Determined at write time (lexical scoping).

**6. == vs ===?**
=== is strict (no coercion). == uses coercion. Use === always; exception: x == null checks both null and undefined.

**7. How does the event loop work?**
Sync code → drain ALL microtasks → [render] → ONE macrotask → repeat.

**8. Microtasks vs macrotasks?**
Microtasks (Promise callbacks, queueMicrotask) run before next macrotask (setTimeout, events). ALL microtasks drain first.

**9. What is prototypal inheritance?**
Objects inherit via [[Prototype]] chain. Property lookup walks upward. class is syntactic sugar.

**10. How does this work?**
4 rules: default (global/undefined), implicit (obj.method()), explicit (call/apply/bind), new (fresh object). Priority: new > explicit > implicit > default. Arrow functions inherit lexical this.

**11. call vs apply vs bind?**
call: invoke immediately, spread args. apply: invoke immediately, array args. bind: returns new bound function.

**12. null vs undefined?**
undefined: no value assigned. null: explicit empty value. typeof null === "object" (historical bug).

**13. Type coercion?**
Automatic conversion when operators encounter different types. Causes: "3" - 1 = 2, [] + {} = "[object Object]".

**14. Truthy/falsy values?**
Falsy: false, 0, "", null, undefined, NaN, 0n. Everything else is truthy.

**15. Strict mode?**
"use strict" prevents: implicit globals, this=undefined standalone, duplicate params. ES modules always strict.

## Functions (16–25)

**16. Higher-order functions?**
Takes a function as arg OR returns one. map, filter, reduce, setTimeout, debounce are HOFs.

**17. Arrow vs regular functions?**
Arrows: no own this, no arguments object, can't be constructors, no prototype. Implicit return for single expressions.

**18. Currying?**
f(a,b,c) → f(a)(b)(c). Each call takes one arg, returns function for next. Enables partial application.

**19. Memoization?**
Cache function results by args. Return cached result on repeated calls. Only for pure functions.

**20. IIFE?**
Immediately Invoked Function Expression. Creates isolated scope. Used for module-like private state.

**21. Rest params vs arguments?**
Rest (...args): real Array with array methods. arguments: array-like object, unavailable in arrows.

**22. Function composition?**
compose(f, g)(x) = f(g(x)). pipe(f, g)(x) = g(f(x)). Left vs right application order.

**23. Debounce vs throttle?**
Debounce: once after period of silence. Throttle: at most once per interval. Both use closures.

**24. Partial application?**
Pre-fill some args. bind() is built-in: fn.bind(null, arg1) creates function with arg1 fixed.

**25. What causes a stack overflow?**
Too many function calls on the call stack. Missing base case in recursion or infinite recursion.

## Objects & Prototypes (26–33)

**26. Shallow vs deep copy?**
Shallow: top-level only, nested objects shared. Deep: all levels independent. structuredClone() for deep.

**27. Object.freeze() vs Object.seal()?**
freeze(): no add/delete/change (shallow). seal(): no add/delete, values can change.

**28. Property descriptors?**
writable, enumerable, configurable flags per property. Set with Object.defineProperty().

**29. instanceof?**
Checks if Constructor.prototype is in object's prototype chain. Use Array.isArray() for arrays (realm-safe).

**30. Object.create()?**
Creates object with specified prototype. Object.create(null) = pure dictionary, no inherited methods.

**31. Getters and setters?**
get prop() {} — runs code on read. set prop(val) {} — runs on write. Look like properties, behave like functions.

**32. Mixin pattern?**
Copy methods from one source to another. Object.assign(Target.prototype, mixin). Avoids single-inheritance limits.

**33. WeakMap and WeakSet?**
Weakly-referenced collections — objects can be GC'd even if in the collection. No iteration. Use for per-object metadata.

## Async JavaScript (34–42)

**34. Promise states?**
Pending → Fulfilled (resolve) or Rejected (reject). Permanent once settled.

**35. Promise.all vs allSettled?**
all: rejects immediately if any reject. allSettled: always resolves with all results, never rejects itself.

**36. What does async/await compile to?**
Syntactic sugar over Promises. async fn always returns Promise. await schedules rest as microtask.

**37. Parallel async operations?**
Promise.all([op1(), op2()]). Sequential awaits multiply latency for independent operations.

**38. Error handling async/await?**
try/catch inside async fn, or .catch() on call site. Unhandled rejections crash Node 15+.

**39. queueMicrotask()?**
Schedule in microtask queue — runs after current sync, before next macrotask. More explicit than Promise.resolve().then().

**40. How generators work?**
function* — yield pauses, returns value. next() resumes. next(val) sends value into generator. Returns {value, done}.

**41. Async generators?**
async function* — use both await and yield. Consume with for await...of. For paginated APIs, streams.

**42. async vs defer scripts?**
Both download in parallel with HTML parse. defer: runs after parse, in order. async: runs ASAP, any order.

## Modern JavaScript (43–50)

**43. Destructuring?**
Arrays: position-based const [a,b]=arr. Objects: name-based const {name}=obj. Supports defaults, renaming, rest, nesting.

**44. Symbols?**
Unique primitives. Use as object keys to avoid collisions. Well-known Symbols customize built-in behaviour.

**45. Map vs object?**
Map: any key type, insertion order, .size, iterable. Object: string/symbol keys, prototype methods present.

**46. Proxy?**
Wraps object, intercepts operations via handler traps. Always use Reflect inside traps. Powers Vue 3 reactivity.

**47. ESM vs CommonJS?**
ESM: static (tree-shakeable), live bindings, always strict, top-level await. CJS: dynamic require(), copied values.

**48. Dynamic import()?**
Returns a Promise resolving to the module. Enables code splitting. Basis of React.lazy().

**49. Class declaration hoisting?**
Hoisted but in TDZ — like let. Accessing before declaration throws ReferenceError.

**50. Object.keys vs for...in?**
Object.keys: own enumerable only. for...in: own + inherited + enumerable. Use Object.keys(); for...in is rarely right.

---

Practice all 50 with AI feedback at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-performance-optimization',
    title: 'JavaScript Performance: Debounce, Throttle, Memory Leaks & the Render Pipeline',
    excerpt: 'Performance questions test real engineering judgment. Implement debounce/throttle, identify memory leaks, avoid layout thrashing, and understand the browser rendering pipeline.',
    category: 'Deep Dive',
    accentColor: '#fb923c',
    readTime: '9 min read',
    publishedAt: '2025-03-01',
    modifiedAt: '2025-06-01',
    keywords: ['javascript performance', 'debounce throttle javascript', 'memory leak javascript', 'layout thrashing'],
    content: `
# JavaScript Performance Optimization

## Debounce — Implement from Scratch
\`\`\`javascript
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Usage: search input autocomplete
const search = debounce((query) => fetchResults(query), 300)
input.addEventListener('input', e => search(e.target.value))
\`\`\`
Fires ONCE after user stops typing for 300ms.

## Throttle — Implement from Scratch
\`\`\`javascript
function throttle(fn, interval) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// Usage: scroll event handler
window.addEventListener('scroll', throttle(updateNav, 100))
\`\`\`
Fires at most once per 100ms regardless of scroll speed.

## Memory Leaks

**Forgotten intervals:**
\`\`\`javascript
const id = setInterval(() => update(), 1000)
// When done: clearInterval(id)
\`\`\`

**Detached DOM nodes:**
\`\`\`javascript
let ref = document.createElement('div')
document.body.appendChild(ref)
document.body.removeChild(ref)
// ref still holds the node in memory!
ref = null // fix: release the reference
\`\`\`

**Closures over large objects:**
\`\`\`javascript
function leaky() {
  const bigData = new Array(1_000_000).fill('*')
  return () => bigData[0] // keeps ALL of bigData alive!
}
function fixed() {
  const bigData = new Array(1_000_000).fill('*')
  const first = bigData[0]
  return () => first // only keeps 'first'
}
\`\`\`

## Reflow vs Repaint

Repaint: visual change only (color). Cheaper.
Reflow: geometry change (width, height, position). Cascades — expensive.

\`\`\`javascript
// ❌ Layout thrashing (alternating read/write = N reflows)
for (let i = 0; i < 100; i++) {
  const h = el.offsetHeight   // READ — forces layout
  el.style.height = h + 1 + 'px'  // WRITE — invalidates layout
}

// ✅ Batch reads then writes (1 reflow)
const h = el.offsetHeight
for (let i = 0; i < 100; i++) {
  el.style.height = (h + i) + 'px'
}

// ✅ Best: CSS transforms — composited on GPU (no reflow at all)
el.style.transform = 'translateY(10px)'
\`\`\`

Practice performance questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-error-handling-guide',
    title: 'JavaScript Error Handling: try/catch, Custom Errors & Async Patterns',
    excerpt: 'Robust error handling separates production code from toy projects. Learn try/catch/finally, custom error classes, async error propagation, and when to rethrow.',
    category: 'Best Practices',
    accentColor: '#f87171',
    readTime: '7 min read',
    publishedAt: '2025-03-10',
    modifiedAt: '2025-06-01',
    keywords: ['javascript error handling', 'try catch javascript', 'custom error class javascript', 'async error handling'],
    content: `
# JavaScript Error Handling

## try/catch/finally
\`\`\`javascript
try {
  const data = JSON.parse(invalidJSON)
} catch (err) {
  console.error(err.name, err.message) // SyntaxError, ...
} finally {
  cleanup() // ALWAYS runs — even if there's a return in try/catch
}
\`\`\`

## Custom Error Classes
\`\`\`javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message)      // sets .message and .stack
    this.name = 'ValidationError'  // always override this.name
    this.field = field
  }
}

try {
  throw new ValidationError('Required', 'email')
} catch (err) {
  if (err instanceof ValidationError) {
    showFieldError(err.field, err.message)
  } else {
    throw err  // rethrow unknown errors — never swallow
  }
}
\`\`\`

## Error Propagation Rules

1. Only catch what you can handle
2. Rethrow everything else
3. Never silently swallow errors (empty catch)
4. Add context when rethrowing

\`\`\`javascript
// ❌ Anti-pattern
try { await doSomething() } catch (err) {}  // hides all bugs!

// ✅ Correct
try {
  const res = await fetch('/api')
  if (!res.ok) throw new NetworkError('Failed', res.status)
  return await res.json()
} catch (err) {
  if (err instanceof NetworkError && err.statusCode === 404) return null
  throw err  // unknown error — propagate up
}
\`\`\`

## Fetch: The Most Missed Gotcha
\`\`\`javascript
// ❌ fetch() only rejects on network failure — HTTP 404/500 do NOT reject!
const data = await fetch('/api').then(r => r.json())

// ✅ Always check res.ok
const res = await fetch('/api')
if (!res.ok) throw new Error('HTTP ' + res.status)
const data = await res.json()
\`\`\`

## Global Error Handlers (Last Resort)
\`\`\`javascript
window.addEventListener('unhandledrejection', event => {
  Sentry.captureException(event.reason)
})
process.on('unhandledRejection', (reason) => {
  logger.error(reason); process.exit(1)
})
\`\`\`

Practice at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'javascript-modern-es6-features',
    title: 'Modern JavaScript: ES6+ Features Every Developer Must Know',
    excerpt: 'A practical guide to ES6+ features that come up in every modern JavaScript interview — destructuring, spread, Map/Set, Proxy, optional chaining, and more.',
    category: 'Modern JS',
    accentColor: '#f472b6',
    readTime: '10 min read',
    publishedAt: '2025-03-20',
    modifiedAt: '2025-06-01',
    keywords: ['es6 features javascript', 'modern javascript interview', 'javascript destructuring spread', 'optional chaining nullish coalescing'],
    content: `
# Modern JavaScript: ES6+ Features

## Destructuring
\`\`\`javascript
// Array: position-based
const [first, , third, fourth = 'default'] = [1, 2, 3]
const [head, ...tail] = [1, 2, 3, 4]  // tail = [2,3,4]
let a = 1, b = 2; [a, b] = [b, a]    // swap

// Object: name-based
const { name, age = 18, address: { city } } = user
const { name: userName = 'Anon' } = {}  // rename + default

// Function parameters
function render({ title, body, author = 'Unknown' }) { ... }
\`\`\`

## Spread & Rest
\`\`\`javascript
const copy = [...arr1, ...arr2]         // merge arrays
const config = { ...defaults, ...overrides }  // later wins
Math.max(...nums)                        // spread as args

function log(first, ...rest) { ... }    // rest: real Array
\`\`\`
Spread creates SHALLOW copies — nested objects are shared.

## Optional Chaining & Nullish Coalescing
\`\`\`javascript
const city = user?.address?.city     // undefined, not TypeError
const result = fn?.()                // call only if fn is callable

// ?? vs ||
const name = user.name ?? 'Anon'    // only for null/undefined
const score = user.score ?? 0       // 0 stays as 0 (!! differs from ||)
const score2 = user.score || 0      // 0 is replaced by 0 — same here but
                                    // false, "", 0 are replaced — usually wrong
\`\`\`

## Map and Set
\`\`\`javascript
const map = new Map()
map.set({ id: 1 }, 'object key')   // any type as key!
[...new Set([1, 2, 2, 3])]         // [1, 2, 3] — remove duplicates
\`\`\`

## Proxy
\`\`\`javascript
const validated = new Proxy({}, {
  set(target, prop, value, receiver) {
    if (prop === 'age' && value < 0) throw new RangeError('age must be >= 0')
    return Reflect.set(target, prop, value, receiver)  // always use Reflect!
  }
})
\`\`\`

## Symbols
\`\`\`javascript
const _id = Symbol('id')
const user = { [_id]: 42, name: 'Alice' }
Object.keys(user)    // ['name'] — symbol keys hidden from enumeration
user[_id]           // 42 — direct access works

// Well-known: customize built-in behaviour
class Range {
  [Symbol.iterator]() { /* return iterator */ }
}
for (const n of new Range(1, 5)) ...
\`\`\`

Practice at [JSPrep Pro](/auth).
    `,
  },
]
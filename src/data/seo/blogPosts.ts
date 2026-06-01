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
  track: 'javascript' | 'react' | 'typescript'
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'javascript-event-loop-explained',
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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
    track: 'javascript',
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

export const REACT_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'top-50-react-interview-questions',
    track: 'react',
    title: 'Top 50 React Interview Questions (2025 Edition)',
    excerpt: 'The definitive list of the 50 most common React interview questions for frontend developers, with concise answers covering hooks, state, performance, and advanced patterns.',
    category: 'Interview Prep',
    accentColor: '#61dafb',
    readTime: '15 min read',
    publishedAt: '2025-04-01',
    modifiedAt: '2025-06-01',
    keywords: ['react interview questions 2025', 'react hooks interview questions', 'top react interview questions', 'react interview preparation'],
    content: `
# Top 50 React Interview Questions (2025)

## React Fundamentals (1–10)

**1. What is React and what problem does it solve?**
React is a declarative UI library that keeps the DOM in sync with application state. Instead of manually updating the DOM on every state change, you describe what the UI should look like, and React figures out the minimum number of changes needed.

**2. What is JSX?**
JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. Babel transforms it to \`React.createElement()\` calls. It's not required but makes component structure visually clear.

**3. What is the Virtual DOM?**
A lightweight JavaScript object tree that mirrors the real DOM. React diffs the new Virtual DOM against the previous one (reconciliation) and only applies the minimum required changes to the real DOM.

**4. What is a React component?**
A function (or class) that accepts props and returns JSX describing a piece of UI. Function components are the modern standard. Components must return a single root element (or a Fragment).

**5. What are props?**
Read-only inputs passed from parent to child. They make components reusable and parameterized. You cannot modify props inside a component — they are immutable from the child's perspective.

**6. What is state?**
State is data that belongs to a component and can change over time. When state changes, React re-renders the component. Use \`useState\` for local state in function components.

**7. What is one-way data flow?**
Data flows from parent to child via props. Children cannot directly modify parent state — they must call callback functions provided as props. This makes data flow predictable and easy to debug.

**8. What is the difference between a controlled and uncontrolled component?**
Controlled: form input value is driven by React state (\`value + onChange\`). Uncontrolled: form input manages its own value via the DOM, accessed with a ref. Controlled components are preferred for validation and dynamic behavior.

**9. What is a key prop and why is it required in lists?**
A key is a stable identity hint React uses to match list items across re-renders. Without keys, React can't determine which items were added, removed, or reordered — causing incorrect state association and missed DOM updates.

**10. What is reconciliation?**
The process React uses to determine what changed between renders. React compares component types (same type = update, different type = rebuild) and then keys within lists to produce a minimal set of DOM mutations.

## React Hooks (11–30)

**11. What are hooks and why were they introduced?**
Hooks are functions that let function components use state and lifecycle features. Before hooks, function components were stateless; you had to use class components for anything stateful. Hooks removed that need.

**12. What are the Rules of Hooks?**
1) Only call hooks at the top level — never inside loops, conditions, or nested functions. 2) Only call hooks from React function components or custom hooks. These rules ensure hooks run in the same order every render, preserving state integrity.

**13. What does useState return?**
A tuple: \`[currentValue, setterFunction]\`. The setter triggers a re-render with the new value. Passing a function to the setter (functional update) ensures you operate on the latest state, not a stale closure.

\`\`\`javascript
const [count, setCount] = useState(0)
setCount(c => c + 1)  // safe: always increments latest count
\`\`\`

**14. What is useState's lazy initializer?**
Passing a function to useState(\`() => expensiveCalc()\`) means the initializer runs only on the first render. Passing the result (\`useState(expensiveCalc())\`) runs it on every render — which defeats the purpose.

**15. What does useEffect do?**
Lets you perform side effects after render: data fetching, subscriptions, DOM mutations, timers. It runs after the browser paints by default.

**16. What are the three forms of useEffect's dependency array?**
- No array: runs after every render
- Empty array \`[]\`: runs once after mount
- \`[dep1, dep2]\`: runs when any listed dependency changes

**17. What is the useEffect cleanup function?**
The function returned from useEffect. It runs before the next effect fires (cleanup of previous) and when the component unmounts. Use it to cancel timers, abort fetches, and remove event listeners.

\`\`\`javascript
useEffect(() => {
  const id = setInterval(() => tick(), 1000)
  return () => clearInterval(id)  // cleanup
}, [])
\`\`\`

**18. What is useRef?**
Returns a mutable \`{ current: value }\` object that persists across renders without causing re-renders when changed. Two uses: 1) DOM node references (\`ref={myRef}\`), 2) storing any mutable value that shouldn't trigger re-renders (e.g., a timer ID).

**19. What is useMemo?**
Memoizes the result of an expensive computation and only recomputes when its dependencies change. Useful for expensive derived values to avoid recalculation on every render.

\`\`\`javascript
const filtered = useMemo(() => items.filter(i => i.active), [items])
\`\`\`

**20. What is useCallback?**
Memoizes a function reference so it remains stable across renders. Needed when passing callbacks to memoized child components — a new function reference on every render would break React.memo's equality check.

**21. What is the difference between useMemo and useCallback?**
\`useMemo(fn, deps)\` returns fn's *return value*. \`useCallback(fn, deps)\` returns fn itself. \`useCallback(fn, deps)\` is equivalent to \`useMemo(() => fn, deps)\`.

**22. What is useReducer?**
An alternative to useState for complex state logic. Takes a \`(state, action) => newState\` reducer and an initial state. Returns \`[state, dispatch]\`. Best when next state depends on previous state or when state has multiple sub-values.

**23. What is useContext?**
Consumes the nearest value from a React Context. Avoids prop drilling. Any component calling \`useContext(MyContext)\` will re-render whenever the context value changes.

**24. What are custom hooks?**
Functions that start with \`use\` and call other hooks. They let you extract and reuse stateful logic between components without changing component hierarchy. \`useFetch\`, \`useLocalStorage\`, \`useDebounce\` are common examples.

**25. What is useLayoutEffect vs useEffect?**
Both take the same arguments. \`useEffect\` fires asynchronously after the browser paints. \`useLayoutEffect\` fires synchronously before paint — use it for DOM measurements that must happen before the user sees anything (prevents flicker). Default to useEffect.

**26. What is useId?**
Generates a stable, unique ID per component instance, safe for server-side rendering. Use for linking labels to inputs (\`htmlFor\`/\`id\`) when the same component is rendered multiple times.

**27. What is useDeferredValue?**
Accepts a value and returns a deferred version that "lags behind" when the app is busy. Use to keep the UI responsive during expensive re-renders triggered by user input.

**28. What is useTransition?**
Returns \`[isPending, startTransition]\`. Marks a state update as non-urgent — React can interrupt it to handle more urgent updates (like user input). Shows a loading indicator via \`isPending\`.

**29. What is useImperativeHandle?**
Used with \`forwardRef\` to customize the ref exposed to the parent. Instead of exposing the whole DOM node, you expose only specific methods (e.g., \`{ focus, reset }\`).

**30. What does the React Profiler do?**
The React DevTools Profiler measures render timing and identifies which components re-render and why. Use it to find unnecessary re-renders and validate memoization strategies.

## State & Performance (31–40)

**31. Why must you not mutate state directly?**
React uses reference equality to detect state changes. Mutating an existing object/array keeps the same reference — React won't see the change and won't re-render. Always return a new reference.

**32. What is React.memo?**
A higher-order component that wraps a function component and skips re-rendering if props haven't changed (shallow comparison). Requires the parent to pass stable prop references — otherwise React.memo has no effect.

**33. What is batching in React 18?**
React 18 batches all state updates — including those in timeouts, promises, and native event handlers — into a single re-render. Pre-18, only updates inside React event handlers were batched.

**34. What is the Reconciler (Fiber)?**
The internal engine (rewritten in React 16) that implements reconciliation as a pausable, resumable linked-list traversal. Fiber enables time-slicing and concurrent features.

**35. What is key prop instability?**
Using index as key causes React to reuse component instances incorrectly when the list order changes. This mismatches DOM state (input values, focus) with the wrong item. Use a stable unique ID as key.

**36. What is prop drilling?**
Passing props through multiple component layers just to reach a deeply nested child. Solutions: React Context (small-medium scale), state management library (large scale), or component composition.

**37. What is the Context re-render problem?**
When a Context value object is created inline (\`value={{ user, setUser }}\`), a new object reference is created on every parent render — making ALL consumers re-render even when the data hasn't changed. Fix: memoize the value with useMemo.

**38. When should you use useReducer over useState?**
When: 1) next state depends on previous, 2) multiple state fields update together, 3) state transitions are complex enough to need named actions, or 4) you want to colocate update logic outside the component.

**39. What is server state vs client state?**
Server state (remote data from APIs) is asynchronous, can go stale, and needs caching/invalidation. React Query and SWR manage it. Client state (UI flags, form values) is synchronous and can stay in useState/Context.

**40. What is code splitting in React?**
Lazily loading parts of your bundle on demand using \`React.lazy\` + dynamic \`import()\`. Reduces initial bundle size so the app loads faster. Wrap lazy components in \`<Suspense fallback={<Spinner />}>\`.

## Patterns & Advanced (41–50)

**41. What is a Higher-Order Component (HOC)?**
A function that takes a component and returns a new component with enhanced behavior. HOCs share cross-cutting concerns (auth, logging, theming). Convention: forward props, set displayName, forward refs.

**42. What is the render props pattern?**
Passing a function as a prop to a component, which that component calls to determine what to render. The function receives internal state as its argument. Custom hooks have largely replaced render props.

**43. What is a React Portal?**
\`ReactDOM.createPortal(children, domNode)\` renders children into a different DOM node (like \`document.body\`) while keeping them in the React tree. Events bubble up through the React tree, not the DOM tree. Used for modals and tooltips.

**44. What is an Error Boundary?**
A class component that catches JavaScript errors in its subtree and displays a fallback UI instead of crashing the whole app. Implements \`getDerivedStateFromError\` (render phase) and/or \`componentDidCatch\` (commit phase, safe for side effects).

**45. What is the Compound Component pattern?**
Components that share implicit state through Context — like \`<Select>\` and \`<Option>\` — designed to work together. The parent manages shared state; children read from it via context.

**46. What are React Server Components (RSC)?**
Components that run exclusively on the server. They can directly access databases, have zero client bundle cost, and use async/await in the component body. They can't use hooks or browser APIs. Client components opt in with \`'use client'\`.

**47. What are Server Actions?**
Functions marked with \`'use server'\` that run on the server but can be called from client components. They enable form submissions and mutations without an explicit API route.

**48. What is Suspense?**
A React mechanism for declaratively specifying loading states. When a child component suspends (throws a Promise — as React.lazy and data-fetching libraries do), the nearest Suspense boundary shows its fallback until the Promise resolves.

**49. What is Concurrent Mode (React 18)?**
React's ability to prepare multiple versions of the UI simultaneously and interrupt low-priority renders. Enabled by the \`createRoot\` API. Powers useTransition, useDeferredValue, and Suspense for data fetching.

**50. What is React's StrictMode?**
A development-mode wrapper that intentionally double-invokes render functions and effects to help surface side effects and state bugs. Components inside StrictMode render twice in dev to expose non-idempotent rendering.

---

Practice all 50 with AI feedback at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-hooks-explained',
    track: 'react',
    title: 'React Hooks Explained: useState, useEffect, useRef & the Rules',
    excerpt: 'A complete guide to React Hooks — why they exist, the rules that govern them, and how useState, useEffect, and useRef work under the hood.',
    category: 'Core Concepts',
    accentColor: '#a78bfa',
    readTime: '10 min read',
    publishedAt: '2025-04-05',
    modifiedAt: '2025-06-01',
    keywords: ['react hooks explained', 'usestate useeffect explained', 'react hooks rules', 'react hooks interview'],
    content: `
# React Hooks Explained

Hooks are the most tested React topic in frontend interviews. Every React interview includes at least one hook question.

## Why Hooks Were Introduced

Before React 16.8, stateful logic required class components. The problems:

1. **No way to reuse stateful logic** — HOCs and render props added component nesting just to share state
2. **Complex components** — lifecycle methods forced unrelated logic to coexist (\`componentDidMount\` doing three different things)
3. **Class confusion** — \`this\` binding bugs, no equivalent in non-JS languages

Hooks solve all three: stateful logic in functions, logic grouped by concern, no classes required.

## The Two Rules of Hooks

These are non-negotiable — React's hook ordering mechanism depends on them:

**Rule 1: Only call hooks at the top level**
\`\`\`javascript
// ❌ Hook inside a condition — breaks ordering
if (isLoggedIn) {
  const [user, setUser] = useState(null)
}

// ✅ Always at top level
const [user, setUser] = useState(null)
if (!isLoggedIn) return <Login />
\`\`\`

**Rule 2: Only call hooks from React function components or custom hooks**
Not from regular JavaScript functions, class methods, or event handlers.

**Why these rules exist:** React tracks hooks by their call order, not by name. If the order changes between renders (e.g., a conditional hook), React maps state to the wrong hook.

## useState: Reactive State

\`useState(initialValue)\` returns \`[currentValue, setter]\`. Calling the setter schedules a re-render with the new value.

\`\`\`javascript
const [count, setCount] = useState(0)

// Direct update
setCount(5)

// Functional update — always receives latest state
setCount(prev => prev + 1)  // use this when new state depends on old
\`\`\`

**Critical: never mutate state directly**
\`\`\`javascript
// ❌ Mutation — same reference, no re-render
state.name = 'Alice'
setState(state)

// ✅ New reference — triggers re-render
setState({ ...state, name: 'Alice' })
\`\`\`

**Lazy initializer:** Pass a function when initial value is expensive to compute:
\`\`\`javascript
// ❌ Runs on EVERY render
const [data, setData] = useState(parseHeavyJSON(rawData))

// ✅ Runs only ONCE (on mount)
const [data, setData] = useState(() => parseHeavyJSON(rawData))
\`\`\`

**React 18 batching:** Multiple setState calls inside a single event handler are batched into one re-render. In React 18, this also applies inside setTimeout and Promise callbacks.

## useEffect: Synchronizing with the Outside World

useEffect lets you "step outside" React to interact with the DOM, APIs, timers, or subscriptions — things that aren't part of React's pure render cycle.

\`\`\`javascript
useEffect(() => {
  // side effect runs here (after render)
  document.title = 'Page: ' + count

  return () => {
    // cleanup runs before NEXT effect fires, and on unmount
    document.title = 'App'
  }
}, [count])  // only re-run when count changes
\`\`\`

**The three dependency array forms:**

| Form | When it runs |
|------|-------------|
| No array | After every render |
| \`[]\` | Once, after mount |
| \`[a, b]\` | After mount + whenever a or b changes |

**The most common useEffect bug — stale closure:**
\`\`\`javascript
// ❌ count is captured at 0, never updates
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000)
  return () => clearInterval(id)
}, [])  // missing count in deps!

// ✅ Include all values used inside the effect
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000)
  return () => clearInterval(id)
}, [count])
\`\`\`

## useRef: Mutable Values That Don't Cause Re-renders

\`useRef(initialValue)\` returns \`{ current: initialValue }\`. Mutating \`.current\` doesn't trigger a re-render.

**Use 1: DOM references**
\`\`\`javascript
const inputRef = useRef(null)
// attach: <input ref={inputRef} />
function focusInput() {
  inputRef.current.focus()  // direct DOM access
}
\`\`\`

**Use 2: Storing values across renders without re-rendering**
\`\`\`javascript
const timerRef = useRef(null)
function start() {
  timerRef.current = setTimeout(() => ..., 1000)
}
function stop() {
  clearTimeout(timerRef.current)
}
\`\`\`

**The key distinction:** \`useState\` for values that affect the UI. \`useRef\` for values that need to persist but don't need to be rendered.

## Custom Hooks: Extracting Reusable Logic

Any function starting with \`use\` that calls hooks is a custom hook. They let you share stateful logic between components.

\`\`\`javascript
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return width
}

// Used in any component — no hierarchy changes needed
function Header() {
  const width = useWindowWidth()
  return <nav>{width > 768 ? <DesktopNav /> : <MobileNav />}</nav>
}
\`\`\`

Practice hooks questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-useeffect-complete-guide',
    track: 'react',
    title: 'React useEffect: The Complete Guide (Deps, Cleanup & Common Bugs)',
    excerpt: 'Master useEffect once and for all. Understand dependency arrays, cleanup functions, data fetching patterns, and the 5 bugs that appear in every React interview.',
    category: 'Deep Dive',
    accentColor: '#6af7c0',
    readTime: '9 min read',
    publishedAt: '2025-04-10',
    modifiedAt: '2025-06-01',
    keywords: ['react useeffect guide', 'useeffect cleanup', 'useeffect dependency array', 'useeffect bugs interview'],
    content: `
# React useEffect: The Complete Guide

useEffect is both the most useful and most misused hook in React. It's also one of the most tested in interviews.

## What useEffect Actually Does

useEffect schedules a function to run *after* React has painted the DOM. It's not a lifecycle hook — it's a synchronization mechanism: "keep this side effect in sync with these values."

\`\`\`javascript
useEffect(() => {
  // This runs after every render where deps changed
  subscribeToStream(userId)

  return () => {
    // This runs before the next effect fires, and on unmount
    unsubscribeFromStream(userId)
  }
}, [userId])
\`\`\`

Mental model: "When userId changes, unsubscribe from old stream, subscribe to new one."

## The Three Dependency Array Forms

\`\`\`javascript
// Form 1: No array — runs after EVERY render
useEffect(() => {
  document.title = 'Count: ' + count
})

// Form 2: Empty array — runs ONCE after mount
useEffect(() => {
  fetchInitialData()
}, [])

// Form 3: With dependencies — runs when deps change
useEffect(() => {
  fetchUser(userId)
}, [userId])
\`\`\`

**The rule:** Every reactive value (state, props, context) used inside the effect must be in the deps array. The ESLint rule \`exhaustive-deps\` enforces this automatically.

## Cleanup: The Function You Should Always Return

The cleanup function prevents memory leaks and stale updates. Return it whenever your effect sets up something that needs teardown.

\`\`\`javascript
// Timer cleanup
useEffect(() => {
  const id = setInterval(() => setTime(new Date()), 1000)
  return () => clearInterval(id)
}, [])

// Event listener cleanup
useEffect(() => {
  window.addEventListener('keydown', handleKey)
  return () => window.removeEventListener('keydown', handleKey)
}, [handleKey])

// Subscription cleanup
useEffect(() => {
  const sub = store.subscribe(update => setState(update))
  return () => sub.unsubscribe()
}, [])
\`\`\`

**When cleanup runs:**
1. Before the next effect fires (when deps changed)
2. When the component unmounts

## Data Fetching Pattern (With AbortController)

\`\`\`javascript
useEffect(() => {
  const controller = new AbortController()
  let cancelled = false

  async function loadUser() {
    try {
      const res = await fetch('/api/users/' + userId, {
        signal: controller.signal
      })
      if (res.ok && !cancelled) {
        const data = await res.json()
        setUser(data)
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    }
  }

  loadUser()

  return () => {
    cancelled = true
    controller.abort()  // cancels in-flight fetch when userId changes
  }
}, [userId])
\`\`\`

The AbortController ensures that if userId changes before the fetch completes, the stale response is ignored.

## The 5 Most Common useEffect Bugs

**Bug 1: Missing dependencies (stale closure)**
\`\`\`javascript
// ❌ onMessage is captured at mount — never updates
useEffect(() => {
  socket.on('message', onMessage)
  return () => socket.off('message', onMessage)
}, [])  // should include [onMessage]

// ✅ Wrap callback in useCallback or include in deps
\`\`\`

**Bug 2: Object/array as dependency (infinite loop)**
\`\`\`javascript
// ❌ options = {} is new reference every render → infinite loop
useEffect(() => {
  fetch('/api', options)
}, [options])

// ✅ Either destructure to primitives or memoize the object
useEffect(() => {
  fetch('/api', { page, size })  // primitives are stable
}, [page, size])
\`\`\`

**Bug 3: Forgetting to handle async properly**
\`\`\`javascript
// ❌ useEffect callback cannot be async directly
useEffect(async () => {  // returns a Promise, not cleanup fn!
  const data = await fetch('...')
}, [])

// ✅ Define async function inside and call it
useEffect(() => {
  async function load() { ... }
  load()
}, [])
\`\`\`

**Bug 4: Setting state after unmount**
\`\`\`javascript
// ❌ If component unmounts during fetch, setState throws warning
useEffect(() => {
  fetch('/api/data').then(res => res.json()).then(data => setData(data))
}, [])

// ✅ Use cleanup flag or AbortController
useEffect(() => {
  let alive = true
  fetch('/api/data').then(r => r.json()).then(d => { if (alive) setData(d) })
  return () => { alive = false }
}, [])
\`\`\`

**Bug 5: Effects that should be events**
Not everything belongs in useEffect. Avoid effects that react to user actions:
\`\`\`javascript
// ❌ Responding to a button click — this is an event, not an effect
useEffect(() => {
  if (submitted) sendForm(formData)
}, [submitted])

// ✅ Run side effects directly in event handlers
function handleSubmit() {
  sendForm(formData)
}
\`\`\`

## Lifecycle Method Equivalents

| Class lifecycle | Hook equivalent |
|----------------|-----------------|
| componentDidMount | \`useEffect(fn, [])\` |
| componentDidUpdate | \`useEffect(fn, [deps])\` |
| componentWillUnmount | \`useEffect(() => { return cleanup }, [])\` |
| getDerivedStateFromProps | setState + early return in render |

Practice useEffect questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-usememo-usecallback-performance',
    track: 'react',
    title: 'React Performance: useMemo, useCallback & React.memo Explained',
    excerpt: 'Learn when and why to use React.memo, useMemo, and useCallback. Understand referential equality, spot unnecessary re-renders, and avoid the over-memoization trap.',
    category: 'Performance',
    accentColor: '#fb923c',
    readTime: '8 min read',
    publishedAt: '2025-04-15',
    modifiedAt: '2025-06-01',
    keywords: ['react usememo usecallback', 'react performance optimization', 'react memo explained', 'react referential equality'],
    content: `
# React Performance: useMemo, useCallback & React.memo

Three tools, one root problem: **referential equality**.

## The Root Problem: JavaScript Equality

\`\`\`javascript
const a = { x: 1 }
const b = { x: 1 }
a === b  // false — different objects in memory

// Same for functions:
(() => {}) === (() => {})  // false — two different function objects
\`\`\`

Every render in React creates new function and object literals. When passed as props, they look "new" to a child component even if the values are identical — causing unnecessary re-renders.

## React.memo: Skip Re-rendering Unchanged Components

\`React.memo(Component)\` wraps a component. React will skip re-rendering it if props haven't changed (shallow comparison).

\`\`\`javascript
const ExpensiveList = React.memo(function List({ items, onSelect }) {
  return items.map(item => (
    <ListItem key={item.id} item={item} onSelect={onSelect} />
  ))
})

function Parent() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([...])

  // ❌ New function reference on every render — memo is useless
  return <ExpensiveList items={items} onSelect={(id) => select(id)} />
}
\`\`\`

React.memo only helps if the parent passes stable prop references. For objects and functions, that requires useMemo and useCallback.

## useCallback: Stable Function References

\`useCallback(fn, deps)\` returns the same function reference between renders, only creating a new one when deps change.

\`\`\`javascript
function Parent() {
  const [items, setItems] = useState([...])

  // ✅ Same function reference unless items changes
  const handleSelect = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])  // no deps — uses functional update, doesn't need items in closure

  return <ExpensiveList items={items} onSelect={handleSelect} />
}
\`\`\`

Without useCallback, ExpensiveList re-renders on every parent render despite React.memo.

## useMemo: Memoize Expensive Computed Values

\`useMemo(() => computation(), deps)\` caches the result of an expensive computation.

\`\`\`javascript
function ProductList({ products, filterText }) {
  // ✅ Only recalculates when products or filterText changes
  const filtered = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(filterText)),
    [products, filterText]
  )

  return filtered.map(p => <Product key={p.id} product={p} />)
}
\`\`\`

Also use useMemo to stabilize object references passed as props or context values:
\`\`\`javascript
// ❌ New object on every render — breaks all consumers' memoization
<UserContext.Provider value={{ user, setUser }}>

// ✅ Stable reference — only changes when user or setUser changes
const value = useMemo(() => ({ user, setUser }), [user, setUser])
<UserContext.Provider value={value}>
\`\`\`

## When to Actually Use Them

Most components don't need memoization. React is fast by default.

**Use React.memo when:**
- Component renders often AND its parent re-renders for unrelated reasons
- Component is visually complex or has expensive child trees

**Use useMemo when:**
- The computation is genuinely expensive (filter/sort thousands of items)
- You need a stable object/array reference for another hook's deps or child props

**Use useCallback when:**
- You're passing a function to a React.memo'd child
- A function is in a useEffect's dependency array

**Do NOT use them for:**
- Simple computations — memoization has overhead too
- Every component by default — profile first
- Primitive values — \`===\` already works correctly for numbers and strings

## The Complete Pattern

\`\`\`javascript
const ExpensiveList = React.memo(({ items, onSelect }) => {
  return items.map(item => <Item key={item.id} item={item} onSelect={onSelect} />)
})

function Dashboard({ data }) {
  const [query, setQuery] = useState('')

  // Memoized computation
  const filtered = useMemo(
    () => data.filter(d => d.name.includes(query)),
    [data, query]
  )

  // Stable function reference for memo'd child
  const handleSelect = useCallback((id) => {
    console.log('selected', id)
  }, [])

  return (
    <>
      <input onChange={e => setQuery(e.target.value)} />
      <ExpensiveList items={filtered} onSelect={handleSelect} />
    </>
  )
}
\`\`\`

> Interview tip: always say "profile first, optimize second." Reaching for useMemo before identifying a problem signals premature optimization.

Practice performance questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-component-lifecycle-hooks',
    track: 'react',
    title: 'React Component Lifecycle: From Class Methods to Hooks',
    excerpt: 'Understand the three phases of a React component lifecycle — mounting, updating, and unmounting — and how each class lifecycle method maps to hooks.',
    category: 'Deep Dive',
    accentColor: '#f59e0b',
    readTime: '8 min read',
    publishedAt: '2025-04-18',
    modifiedAt: '2025-06-01',
    keywords: ['react component lifecycle', 'react lifecycle hooks', 'componentdidmount hooks equivalent', 'react lifecycle interview'],
    content: `
# React Component Lifecycle: From Class Methods to Hooks

Every React component has a lifecycle — it mounts, updates, and unmounts. Understanding this is foundational for any React interview.

## The Three Phases

**Mounting** — component is created and inserted into the DOM for the first time.

**Updating** — component re-renders because props or state changed.

**Unmounting** — component is removed from the DOM.

## Class Component Lifecycle Methods

\`\`\`javascript
class Timer extends React.Component {
  // 1. MOUNTING
  constructor(props) {
    super(props)
    this.state = { seconds: 0 }
    // initialize state, bind methods — no side effects here
  }

  static getDerivedStateFromProps(props, state) {
    // runs before every render — return state update or null
    // rarely needed; usually a sign of over-engineering
    return null
  }

  componentDidMount() {
    // fires ONCE after first DOM insertion
    // safe for: data fetching, subscriptions, DOM manipulation
    this.interval = setInterval(() => this.setState(s => ({ seconds: s.seconds + 1 })), 1000)
  }

  // 2. UPDATING
  shouldComponentUpdate(nextProps, nextState) {
    // optimization: return false to skip re-render
    // React.PureComponent does shallow compare automatically
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    // fires after every update (not first render)
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser(this.props.userId)  // guard required — no infinite loop
    }
  }

  // 3. UNMOUNTING
  componentWillUnmount() {
    // cleanup before removal — timers, subscriptions, listeners
    clearInterval(this.interval)
  }

  render() {
    return <div>{this.state.seconds}s</div>
  }
}
\`\`\`

## Hooks Equivalents

\`\`\`javascript
function Timer() {
  const [seconds, setSeconds] = useState(0)

  // componentDidMount — empty deps array = runs once after mount
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)

    // componentWillUnmount — cleanup function
    return () => clearInterval(id)
  }, [])

  // componentDidUpdate — non-empty deps array
  useEffect(() => {
    document.title = 'Timer: ' + seconds
  }, [seconds])

  return <div>{seconds}s</div>
}
\`\`\`

## Lifecycle → Hook Mapping Table

| Class Method | Hook Equivalent | Notes |
|---|---|---|
| constructor | useState initializer | Lazy init: \`useState(() => fn())\` |
| componentDidMount | \`useEffect(fn, [])\` | Empty array = once after mount |
| componentDidUpdate | \`useEffect(fn, [deps])\` | Runs on mount too — add guard if needed |
| componentWillUnmount | \`useEffect(() => cleanup, [])\` | Cleanup fn = unmount |
| getDerivedStateFromProps | useState + useMemo | Compute derived state during render |
| shouldComponentUpdate | React.memo | Wrap component for shallow prop compare |
| getSnapshotBeforeUpdate | useRef | Store value before paint in a ref |
| componentDidCatch | No hooks equivalent | Error boundaries are class-only |

## Error Boundaries (Class Only)

Error boundaries catch errors in their child tree and display fallback UI. There is no hooks equivalent — they must be class components.

\`\`\`javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    // render phase — must be pure, update state only
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // commit phase — safe for logging, analytics
    Sentry.captureException(error, { extra: info })
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>
    return this.props.children
  }
}
\`\`\`

## The UNSAFE_ Methods (Deprecated)

Three lifecycle methods were renamed with \`UNSAFE_\` prefix in React 16.3:
- \`UNSAFE_componentWillMount\`
- \`UNSAFE_componentWillReceiveProps\`
- \`UNSAFE_componentWillUpdate\`

They were deprecated because React's concurrent rendering can pause and restart renders — these methods could fire multiple times before a commit, making them unsafe for side effects or subscriptions.

**Interview answer:** "These methods caused bugs with async rendering. The UNSAFE_ prefix signals they'll be removed. componentWillMount → useEffect(fn, []). componentWillReceiveProps → getDerivedStateFromProps or useEffect with deps."

## The useLayoutEffect Edge Case

\`useLayoutEffect\` fires synchronously after all DOM mutations but before the browser paints. Use it only for DOM measurements that must happen before the user sees the result:

\`\`\`javascript
// Measure a DOM node before paint to avoid flicker
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setPosition(rect)
}, [])
\`\`\`

Default to \`useEffect\`. Switch to \`useLayoutEffect\` only if you see visual flicker.

Practice lifecycle questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-state-management-2025',
    track: 'react',
    title: 'React State Management in 2025: useState, useReducer, Context & Beyond',
    excerpt: 'A practical breakdown of every React state management option — when to use useState, when useReducer wins, how Context scales, and when to reach for an external store.',
    category: 'Deep Dive',
    accentColor: '#7c6af7',
    readTime: '10 min read',
    publishedAt: '2025-04-22',
    modifiedAt: '2025-06-01',
    keywords: ['react state management 2025', 'useState vs useReducer', 'react context vs redux', 'zustand react'],
    content: `
# React State Management in 2025

The most common senior React interview question: "How do you manage state in a large application?" Here's the complete answer.

## The Four Layers of State

Before choosing a tool, identify what type of state you're dealing with:

| Layer | What | Tool |
|---|---|---|
| Local UI state | Form inputs, toggles, accordion open/closed | useState |
| Lifted state | Shared between 2-3 siblings | useState in common ancestor |
| Global app state | Current user, theme, cart | Context or external store |
| Server/remote state | API data, loading, errors | React Query / SWR |

Most applications are simpler than developers think — start with useState, lift when needed.

## Layer 1: useState — Your Default Choice

Use it for anything a single component needs to track.

\`\`\`javascript
function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // When multiple fields update together, consider useReducer
  async function search(q) {
    setLoading(true)
    const data = await fetchResults(q)
    setResults(data)
    setLoading(false)
  }

  return <input value={query} onChange={e => { setQuery(e.target.value); search(e.target.value) }} />
}
\`\`\`

## Layer 2: useReducer — Predictable Complex State

Switch from useState to useReducer when:
1. Multiple state fields update together based on the same action
2. Next state depends on the current state and action type
3. State logic is complex enough to test independently

\`\`\`javascript
const initialState = { count: 0, step: 1, history: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count]
      }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+{state.step}</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  )
}
\`\`\`

useReducer is especially valuable when state transitions are complex — the reducer is a pure function you can unit test without React.

## Layer 3: Context API — Global State Without Prop Drilling

Context broadcasts a value to any descendant component that subscribes.

\`\`\`javascript
const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  // Memoize the value object — prevents all consumers from re-rendering
  // when the Provider's parent re-renders for unrelated reasons
  const value = useMemo(() => ({ user, setUser }), [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside UserProvider')
  return ctx
}

// Any descendant can now use it:
function Avatar() {
  const { user } = useUser()
  return <img src={user?.avatar} />
}
\`\`\`

**The Context re-render problem:** Every component that calls useContext re-renders when the context value changes. If you put too much in a single Context (user + cart + theme), a theme change re-renders every component subscribed to the context — including those that only need the user.

**Solution:** Split context by update frequency. One context per domain.

## Layer 4: External Stores (Zustand, Redux Toolkit)

Reach for an external store when:
- Multiple teams or many developers need shared state
- State has complex interdependencies or many slices
- You need time-travel debugging, Redux DevTools
- Server and client state need a clear boundary

**Zustand — minimal boilerplate:**
\`\`\`javascript
import { create } from 'zustand'

const useCartStore = create((set) => ({
  items: [],
  add: (item) => set(state => ({ items: [...state.items, item] })),
  remove: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
}))

function Cart() {
  const { items, remove } = useCartStore()
  return items.map(item => <CartItem key={item.id} item={item} onRemove={() => remove(item.id)} />)
}
\`\`\`

Components subscribe to slices of the store — only re-render when the specific slice they use changes.

**Redux Toolkit — structured, mature ecosystem:**
Best for large teams, existing Redux codebases, or when you need the full tooling (DevTools, middleware, normalization).

## Server State: React Query

API data is fundamentally different from client state — it goes stale, needs caching, loading states, and background refetching. useState is the wrong tool.

\`\`\`javascript
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch('/api/users/' + userId).then(r => r.json()),
    staleTime: 5 * 60 * 1000,  // fresh for 5 minutes
  })

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />
  return <Profile user={user} />
}
\`\`\`

React Query handles: caching, deduplication, background updates, pagination, and optimistic updates — in about 10 lines.

## Decision Tree

1. **Is it only needed by one component?** → useState
2. **Needed by a few siblings?** → Lift state to common parent
3. **Needed across many components?** → Context (small app) or external store (large app)
4. **Is it data from an API?** → React Query or SWR, not useState

The right answer to "how do you manage state" isn't a single tool — it's using the right layer for each type of state.

Practice state management questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-virtual-dom-reconciliation',
    track: 'react',
    title: 'React Virtual DOM & Reconciliation: How React Decides What to Render',
    excerpt: "Understand exactly how React's Virtual DOM, diffing algorithm, and Fiber reconciler work — and why keys are the most important prop you can give a list item.",
    category: 'Core Concepts',
    accentColor: '#34d399',
    readTime: '8 min read',
    publishedAt: '2025-04-25',
    modifiedAt: '2025-06-01',
    keywords: ['react virtual dom', 'react reconciliation explained', 'react fiber reconciler', 'react keys interview'],
    content: `
# React Virtual DOM & Reconciliation

## What is the Virtual DOM?

The Virtual DOM is a lightweight JavaScript object tree that mirrors the structure of the real DOM. React keeps two versions: the current tree and the work-in-progress tree.

\`\`\`javascript
// JSX like this:
<div className="card">
  <h1>{title}</h1>
  <p>{body}</p>
</div>

// Becomes a plain JS object:
{
  type: 'div',
  props: { className: 'card' },
  children: [
    { type: 'h1', props: {}, children: [title] },
    { type: 'p', props: {}, children: [body] }
  ]
}
\`\`\`

The Virtual DOM's value: comparing two JS objects is orders of magnitude faster than querying and updating the real DOM. React diffs the objects, then surgically updates only what changed.

## Reconciliation: React's Diffing Algorithm

When state or props change, React creates a new Virtual DOM tree and diffs it against the previous one. The diffing uses two heuristics to keep it O(n) instead of O(n³):

**Heuristic 1: Different component types produce different trees**

\`\`\`javascript
// Before:
<div><Counter /></div>

// After:
<span><Counter /></span>
\`\`\`

Different type (\`div\` → \`span\`) = destroy the old tree entirely, build a new one from scratch — even if children are identical. React never tries to "convert" one element type to another.

**Heuristic 2: Keys identify list items across renders**

\`\`\`javascript
// Before:
<li key="a">Alice</li>
<li key="b">Bob</li>

// After (item inserted at top):
<li key="c">Carol</li>  // React: new key "c" → INSERT
<li key="a">Alice</li>  // React: key "a" unchanged → MOVE
<li key="b">Bob</li>   // React: key "b" unchanged → MOVE
\`\`\`

With keys, React performs 1 insert + 2 moves. Without keys, it would update every item's text and add one at the end — O(n) DOM mutations instead of the minimum needed.

## The Key Bug (Most Common Interview Question)

\`\`\`javascript
// ❌ Using index as key — wrong when list order can change
{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}

// If you delete item at index 0:
// - React sees: key=0 now has different data
// - It UPDATES all items instead of removing the first one
// - Input fields, focus, and animations break

// ✅ Use stable, unique IDs
{todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} />
))}
\`\`\`

Index as key is only safe when the list is static and never reordered, filtered, or sorted.

## Render Phase vs Commit Phase

Reconciliation has two distinct phases:

**Render Phase (pure, interruptible)**
- React calls your component functions
- Diffs the Virtual DOM trees
- Computes the list of changes (effect list)
- Can be interrupted, paused, and restarted (with concurrent features)
- No DOM mutations happen here

**Commit Phase (synchronous, uninterruptible)**
- React applies the computed changes to the real DOM
- Runs refs and layout effects (\`useLayoutEffect\`)
- Browser paints the screen
- Runs passive effects (\`useEffect\`)

This separation is why \`getDerivedStateFromError\` (render phase) must be pure while \`componentDidCatch\` (commit phase) can have side effects.

## Fiber: The Modern Reconciler

React Fiber (introduced in React 16) reimplemented the reconciler as a singly-linked list of work units called fibers. Each fiber represents one component.

Old reconciler: recursive, couldn't be paused. If a large component tree took 50ms to reconcile, the main thread was blocked for 50ms — causing dropped frames.

Fiber reconciler: breaks work into small units. React can process one fiber, check if the browser needs to handle input, and pause reconciliation to stay responsive. This enables:
- **useTransition** — mark updates as interruptible
- **useDeferredValue** — delay expensive re-renders
- **Suspense** — pause rendering while data loads

## Why shouldComponentUpdate and React.memo Exist

React re-renders a component whenever its parent re-renders, even if the component's props haven't changed. \`React.memo\` and \`shouldComponentUpdate\` short-circuit reconciliation: if props are shallowly equal, skip the render and use the previous Virtual DOM tree.

\`\`\`javascript
// Without memo: renders every time parent renders
function StaticWidget({ label }) {
  return <div>{label}</div>
}

// With memo: only renders when label changes
const StaticWidget = React.memo(function({ label }) {
  return <div>{label}</div>
})
\`\`\`

Practice Virtual DOM and reconciliation questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-context-api-vs-redux',
    track: 'react',
    title: 'React Context API vs Redux: When to Use Which in 2025',
    excerpt: "Context API is built in. Redux has devtools and middleware. Understanding when each is the right tool is one of the most common senior React interview questions.",
    category: 'Best Practices',
    accentColor: '#f76a6a',
    readTime: '7 min read',
    publishedAt: '2025-05-01',
    modifiedAt: '2025-06-01',
    keywords: ['react context vs redux', 'when to use redux', 'context api limitations', 'zustand vs redux react'],
    content: `
# React Context API vs Redux: When to Use Which

## Context API: What It Does Well

Context is React's built-in solution for sharing state without prop drilling. It's a broadcast channel — set a value at the top, consume it anywhere below.

\`\`\`javascript
// 1. Create the context
const ThemeContext = createContext('light')

// 2. Provide at the top
function App() {
  const [theme, setTheme] = useState('light')
  const value = useMemo(() => ({ theme, setTheme }), [theme])
  return (
    <ThemeContext.Provider value={value}>
      <Layout />
    </ThemeContext.Provider>
  )
}

// 3. Consume anywhere below — no prop drilling
function Button() {
  const { theme } = useContext(ThemeContext)
  return <button className={theme}>Click</button>
}
\`\`\`

Context is ideal for: current user, theme, locale, feature flags — values that change infrequently and are needed across many components.

## Context's Limitations

**The re-render problem:** Every component that calls \`useContext(MyContext)\` re-renders when the context value changes — not just the parts of the value they actually use.

\`\`\`javascript
// ❌ One big context — a cart change re-renders Avatar and Settings
const AppContext = createContext({ user, cart, theme, setCart, setTheme })

// ✅ Split by domain and update frequency
const UserContext = createContext({ user })           // rarely changes
const CartContext = createContext({ cart, setCart })  // changes often
const ThemeContext = createContext({ theme })          // changes rarely
\`\`\`

**No middleware:** Context has no built-in support for async actions, logging, or side effects. You handle these manually.

**No DevTools:** No time-travel debugging or action history.

**Verdict on Context:** Great for 1-3 pieces of global state in small-to-medium apps. Starts hurting when you have many unrelated values that change at different frequencies.

## Redux Toolkit: Structured State for Large Apps

Modern Redux uses Redux Toolkit (RTK) — the official, opinionated setup. Gone are the days of hand-written action types and reducers.

\`\`\`javascript
import { createSlice, configureStore } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload)  // Immer makes mutations safe
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
  },
})

export const { addItem, removeItem } = cartSlice.actions
const store = configureStore({ reducer: { cart: cartSlice.reducer } })
\`\`\`

\`\`\`javascript
// In components:
function Cart() {
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </li>
      ))}
    </ul>
  )
}
\`\`\`

**What Redux gives you that Context doesn't:**
- Redux DevTools with time-travel debugging and action replays
- Fine-grained subscriptions via selectors — component only re-renders when its slice changes
- Middleware for async (Redux Thunk), logging, and analytics
- Predictable, normalized state structure
- Works outside React (useful for Web Workers, SSR hydration)

## Modern Alternatives

**Zustand** — minimal API, no boilerplate, subscriptions out of the box:
\`\`\`javascript
const useStore = create(set => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
}))

// Component only re-renders when count changes
const count = useStore(s => s.count)
\`\`\`

**Jotai / Recoil** — atomic state model. Components subscribe to individual atoms, not a global store. Each atom re-renders only its subscribers.

## Decision Matrix

| Situation | Use |
|---|---|
| 1-3 pieces of global state (theme, user) | Context |
| Complex state with many slices | Redux Toolkit or Zustand |
| Need DevTools, time-travel debugging | Redux Toolkit |
| Small/medium app, minimal boilerplate | Zustand |
| Atomic state with isolated subscriptions | Jotai |
| Async server data (API responses) | React Query or SWR |

## The Interview Answer

"Context is the right choice for simple global state — current user, theme — in small to medium apps. Redux Toolkit is better for large apps with many state slices, teams needing DevTools, or complex async flows. Zustand is a lightweight middle ground with Redux-like subscriptions but without the boilerplate. For server data, I'd use React Query rather than putting API responses into either."

Practice at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-common-mistakes',
    track: 'react',
    title: 'React Common Mistakes: 8 Bugs That Catch Developers Off Guard',
    excerpt: 'The bugs that appear in React code reviews and interviews. Missing keys, stale closures, direct state mutation, components inside render, and more — with fixes.',
    category: 'Best Practices',
    accentColor: '#f472b6',
    readTime: '9 min read',
    publishedAt: '2025-05-05',
    modifiedAt: '2025-06-01',
    keywords: ['react common mistakes', 'react bugs to avoid', 'react anti-patterns', 'react interview mistakes'],
    content: `
# React Common Mistakes: 8 Bugs That Catch Developers Off Guard

## 1. Defining Components Inside Another Component

\`\`\`javascript
// ❌ ComponentB is re-created as a NEW function on every render of Parent
function Parent() {
  function ComponentB() {  // new identity every render
    return <div>B</div>
  }
  return <ComponentB />
}

// What happens: React sees a different component type each render →
// unmounts old ComponentB, mounts a new one → state is destroyed every time
\`\`\`

\`\`\`javascript
// ✅ Define components at module scope
function ComponentB() {
  return <div>B</div>
}

function Parent() {
  return <ComponentB />
}
\`\`\`

This is one of the most common React performance and correctness bugs. It causes components to lose their state on every parent render.

## 2. Mutating State Directly

\`\`\`javascript
const [user, setUser] = useState({ name: 'Alice', scores: [] })

// ❌ Same object reference — React doesn't detect the change
user.name = 'Bob'
setUser(user)

// ❌ Same array reference — React thinks nothing changed
user.scores.push(100)
setUser(user)
\`\`\`

\`\`\`javascript
// ✅ New objects/arrays for new state
setUser({ ...user, name: 'Bob' })
setUser(prev => ({ ...prev, scores: [...prev.scores, 100] }))
\`\`\`

Rule: never modify the existing state object. Always return a new reference.

## 3. Using Array Index as List Key

\`\`\`javascript
// ❌ Index as key breaks when list is filtered, sorted, or reordered
{items.map((item, i) => <Card key={i} item={item} />)}

// What breaks:
// - React maps state (input values, focus) to position, not item
// - Filtering items[0] out causes all subsequent items to get re-rendered
// - Input values in position 0 get "transferred" to the new position 0
\`\`\`

\`\`\`javascript
// ✅ Use stable unique IDs
{items.map(item => <Card key={item.id} item={item} />)}
\`\`\`

Index keys are only safe for static, never-reordered lists with no stateful children.

## 4. Missing useEffect Cleanup

\`\`\`javascript
// ❌ Subscription grows on every userId change; old subscriptions never removed
useEffect(() => {
  const socket = openConnection(userId)
  socket.on('message', handleMessage)
  // no cleanup!
}, [userId])

// What happens: Every userId change adds a NEW socket and listener.
// After 5 userId changes you have 5 active subscriptions.
\`\`\`

\`\`\`javascript
// ✅ Return cleanup function
useEffect(() => {
  const socket = openConnection(userId)
  socket.on('message', handleMessage)
  return () => {
    socket.off('message', handleMessage)
    socket.close()
  }
}, [userId])
\`\`\`

## 5. Stale Closure in useEffect

\`\`\`javascript
const [count, setCount] = useState(0)

// ❌ count is captured as 0 at mount — forever stale
useEffect(() => {
  const id = setInterval(() => {
    console.log(count)  // always prints 0
    setCount(count + 1) // always sets to 1!
  }, 1000)
  return () => clearInterval(id)
}, [])  // missing [count]
\`\`\`

\`\`\`javascript
// ✅ Option A: functional update (no need to read count from closure)
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1)  // always gets latest count
  }, 1000)
  return () => clearInterval(id)
}, [])

// ✅ Option B: include count in deps (effect re-subscribes when count changes)
useEffect(() => {
  const id = setInterval(() => { setCount(count + 1) }, 1000)
  return () => clearInterval(id)
}, [count])
\`\`\`

## 6. Calling Hooks Conditionally

\`\`\`javascript
// ❌ Hook order changes between renders — React throws an error
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState('')  // hook #1 sometimes, sometimes not
  }
  const [age, setAge] = useState(0)  // sometimes hook #1, sometimes hook #2
}
\`\`\`

\`\`\`javascript
// ✅ Hooks always at top level; conditionally USE their values
function Component({ isLoggedIn }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)

  if (!isLoggedIn) return <Login />
  return <Profile name={name} age={age} />
}
\`\`\`

## 7. Storing Derived State in useState

\`\`\`javascript
// ❌ Derived state — two sources of truth get out of sync
const [items, setItems] = useState([...])
const [filteredItems, setFilteredItems] = useState(items)  // redundant

useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])  // easy to forget, causes a render lag
\`\`\`

\`\`\`javascript
// ✅ Compute derived values during render (free, always in sync)
const [items, setItems] = useState([...])
const filteredItems = items.filter(i => i.active)  // computed every render

// ✅ Or memoize if the computation is expensive
const filteredItems = useMemo(() => items.filter(i => i.active), [items])
\`\`\`

## 8. Forgetting that setState is Asynchronous

\`\`\`javascript
// ❌ Reading state immediately after setting it gets the stale value
const [count, setCount] = useState(0)

function handleClick() {
  setCount(count + 1)
  console.log(count)  // still 0! state updates are scheduled, not immediate
  setCount(count + 1) // also adds 1 to the ORIGINAL 0 → count becomes 1, not 2!
}
\`\`\`

\`\`\`javascript
// ✅ Use functional updates for multiple sequential updates
function handleClick() {
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)  // this correctly uses the updated value → +2
}
\`\`\`

Practice at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'react-output-questions',
    track: 'react',
    title: 'Hard React Output & Behaviour Questions (With Step-by-Step Explanations)',
    excerpt: "The trickiest React behaviour questions from real interviews — useState batching, stale closures, re-render triggers, key resets, and useEffect timing.",
    category: 'Practice',
    accentColor: '#60a5fa',
    readTime: '12 min read',
    publishedAt: '2025-05-10',
    modifiedAt: '2025-06-01',
    keywords: ['react output questions', 'react tricky interview questions', 'react behavior questions', 'react hooks interview puzzles'],
    content: `
# Hard React Output & Behaviour Questions

## Question 1: useState — What's the Output?

\`\`\`javascript
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return <button onClick={handleClick}>{count}</button>
}
\`\`\`

**Q: After clicking once, what is the count?**

**Answer: 1**

All three \`setCount(count + 1)\` calls read the same \`count = 0\` from the closure. All three schedule "set to 0+1 = 1". React batches them into one re-render with count = 1.

**Fix: functional updates**
\`\`\`javascript
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
// Result: 3 — each update builds on the previous
\`\`\`

---

## Question 2: useEffect Timing

\`\`\`javascript
function App() {
  const [val, setVal] = useState(0)

  console.log('render', val)

  useEffect(() => {
    console.log('effect', val)
  })

  return <button onClick={() => setVal(v => v + 1)}>Click</button>
}
\`\`\`

**Q: What's the console output on initial load, then after one click?**

**Answer:**

Initial load:
\`\`\`
render 0
effect 0
\`\`\`

After click:
\`\`\`
render 1
effect 1
\`\`\`

useEffect runs *after* render and paint. The console.log in the component body runs *during* render. No dependency array → runs after every render.

---

## Question 3: Stale Closure

\`\`\`javascript
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <div>{count}</div>
}
\`\`\`

**Q: What happens after 5 seconds?**

**Answer: count stays at 1 forever**

The effect runs once (empty deps). The interval callback captures \`count = 0\` in its closure. It will always call \`setCount(0 + 1)\` — setting count to 1 on every tick.

**Fix:**
\`\`\`javascript
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1)  // functional update — no closure needed
  }, 1000)
  return () => clearInterval(id)
}, [])
\`\`\`

---

## Question 4: Key as Reset

\`\`\`javascript
function App() {
  const [version, setVersion] = useState(0)
  return (
    <>
      <Form key={version} />
      <button onClick={() => setVersion(v => v + 1)}>Reset Form</button>
    </>
  )
}

function Form() {
  const [input, setInput] = useState('')
  return <input value={input} onChange={e => setInput(e.target.value)} />
}
\`\`\`

**Q: What happens when the Reset button is clicked?**

**Answer: Form completely resets to empty string**

Changing the key makes React treat \`<Form>\` as a completely different component. It unmounts the old Form (destroying its state) and mounts a brand new one with \`input = ''\`.

This is the intentional use of key to reset a component without lifting state up.

---

## Question 5: Re-render Triggers

\`\`\`javascript
const Parent = () => {
  const [count, setCount] = useState(0)
  console.log('Parent rendered')
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <Child />
    </div>
  )
}

const Child = () => {
  console.log('Child rendered')
  return <p>I am a child</p>
}
\`\`\`

**Q: What logs on every button click?**

**Answer: Both "Parent rendered" and "Child rendered"**

React re-renders Parent when count changes. Child is a child of Parent, so React re-renders Child too — even though Child receives no props at all. Children re-render with their parent by default.

**Fix: React.memo**
\`\`\`javascript
const Child = React.memo(() => {
  console.log('Child rendered')  // only logs once — on mount
  return <p>I am a child</p>
})
\`\`\`

---

## Question 6: useEffect Dependency Bug

\`\`\`javascript
function Search({ query }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    fetch('/api/search?q=' + query)
      .then(r => r.json())
      .then(data => setResults(data))
  }, [])  // ← empty deps

  return results.map(r => <div key={r.id}>{r.name}</div>)
}
\`\`\`

**Q: What's wrong with this component?**

**Answer: query is stale — the effect only runs on mount**

When the \`query\` prop changes (parent types a new search term), the component re-renders but the effect doesn't re-run. The displayed results are from the initial query forever.

**Fix:** Add query to the dependency array:
\`\`\`javascript
useEffect(() => {
  let cancelled = false
  fetch('/api/search?q=' + query)
    .then(r => r.json())
    .then(data => { if (!cancelled) setResults(data) })
  return () => { cancelled = true }
}, [query])  // re-fetch whenever query changes
\`\`\`

---

## Question 7: Context Re-render

\`\`\`javascript
const Ctx = createContext(null)

function Provider() {
  const [count, setCount] = useState(0)
  return (
    <Ctx.Provider value={{ count, setCount }}>
      <Consumer />
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </Ctx.Provider>
  )
}

function Consumer() {
  const { setCount } = useContext(Ctx)
  console.log('Consumer rendered')
  return <button onClick={() => setCount(0)}>Reset</button>
}
\`\`\`

**Q: Does Consumer re-render when count changes?**

**Answer: Yes — on every count change**

\`{ count, setCount }\` is a new object reference every render. useContext performs reference equality: different object = all consumers re-render, even if Consumer only reads \`setCount\`.

**Fix: memoize the value**
\`\`\`javascript
const value = useMemo(() => ({ count, setCount }), [count])
<Ctx.Provider value={value}>
\`\`\`

Now Consumer only re-renders when count actually changes (which it does in this case — but with more fields, only the relevant consumers would re-render).

---

## Question 8: The Async State Update

\`\`\`javascript
function App() {
  const [data, setData] = useState(null)

  async function fetchData() {
    const result = await fetch('/api/data').then(r => r.json())
    setData(result)
    console.log(data)  // null or result?
  }

  return <button onClick={fetchData}>Fetch</button>
}
\`\`\`

**Q: What does console.log(data) print after the await?**

**Answer: null (the old value)**

\`data\` in the closure is captured at the time \`fetchData\` was created — when \`data = null\`. \`setData(result)\` schedules a state update (re-render), but the closure's \`data\` variable is not updated. The new value is only available in the *next* render's closure.

Practice React behavior questions at [JSPrep Pro](/auth).
    `,
  },
]

export const TYPESCRIPT_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'top-50-typescript-interview-questions',
    track: 'typescript',
    title: 'Top 50 TypeScript Interview Questions (2025)',
    excerpt: 'The definitive list of the 50 most common TypeScript interview questions for frontend developers, with concise answers covering types, generics, utility types, and advanced patterns.',
    category: 'Interview Prep',
    accentColor: '#3178c6',
    readTime: '15 min read',
    publishedAt: '2025-05-01',
    modifiedAt: '2025-06-01',
    keywords: ['typescript interview questions 2025', 'top typescript interview questions', 'typescript interview prep', 'typescript types generics interview'],
    content: `
# Top 50 TypeScript Interview Questions (2025)

## TypeScript Fundamentals (1–15)

**1. What is TypeScript and why use it?**
TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It catches type errors at compile time instead of runtime, improves IDE tooling (autocomplete, refactoring), and makes large codebases easier to maintain and reason about.

**2. What is the difference between type and interface?**
Both describe object shapes. interface supports declaration merging and is better for object/class contracts. type supports unions, intersections, mapped types, and conditional types — making it more versatile. Prefer interface for public API shapes; type for complex compositions.

**3. What is type inference in TypeScript?**
TypeScript automatically deduces the type of a value from its initializer, return expression, or context. const x = 5 infers number. Inference reduces annotation noise while retaining full type safety.

**4. What is the any type and why is it dangerous?**
any opts a variable out of type checking completely. It disables autocomplete, silences errors, and removes all benefits of TypeScript. Use unknown instead — it forces you to narrow the type before using the value.

**5. What is the difference between any and unknown?**
unknown is the type-safe alternative to any. You can assign anything to unknown, but you cannot use it without first narrowing it (typeof, instanceof, a type guard). any bypasses all checks entirely.

**6. What is a union type?**
A union type (A | B) means a value can be one of the listed types. TypeScript narrows unions through type guards, discriminated unions, or control flow analysis.

**7. What is an intersection type?**
An intersection type (A & B) combines multiple types into one — the result must satisfy all of them. Commonly used to merge interfaces or mix in behaviours.

**8. What are generics in TypeScript?**
Generics are type parameters that make components reusable over many types while preserving type safety. function identity<T>(x: T): T returns the same type it receives — the caller specifies T.

**9. What are TypeScript utility types?**
Built-in generic types that transform other types. Partial<T>, Required<T>, Readonly<T>, Record<K,V>, Pick<T,K>, Omit<T,K>, Exclude<T,U>, Extract<T,U>, NonNullable<T>, ReturnType<T> are the most common.

**10. What is a type guard?**
A runtime check that narrows a union type. typeof x === 'string', instanceof MyClass, or a custom x is MyType predicate function are all type guards.

**11. What is a discriminated union?**
A union where each member has a common literal property (the discriminant). switch/if on the discriminant narrows to the exact member: type Result = { ok: true; value: T } | { ok: false; error: string }.

**12. What is the never type?**
never represents values that can never exist. Exhaustive switch statements use never as a default — if TypeScript allows assigning to never, you've handled all cases. Functions that always throw or loop forever have return type never.

**13. What is readonly in TypeScript?**
readonly prevents a property from being reassigned after initialization. Readonly<T> makes all properties readonly. This is shallower than Object.freeze — nested objects can still be mutated.

**14. What is a tuple type?**
A fixed-length array where each position has a specific type: [string, number] is a two-element array of a string then a number. Useful for function return types and structured data pairs.

**15. What is the satisfies operator (TypeScript 4.9)?**
satisfies validates that an expression matches a type without widening its inferred type. const palette = { red: [255,0,0], blue: '#0000ff' } satisfies Record<string, string | number[]> — palette.blue retains string type rather than string | number[].

## Generics (16–25)

**16. How do you constrain a generic?**
Use extends: function getLength<T extends { length: number }>(x: T): number. T must have a length property; you get no access to anything else on T.

**17. What is a conditional type?**
T extends U ? X : Y — if T is assignable to U, the type is X, else Y. Used in utility types: NonNullable<T> = T extends null | undefined ? never : T.

**18. What are mapped types?**
Transform every property of an existing type: { [K in keyof T]: NewType }. Built-in examples are Readonly<T>, Partial<T>, and Record<K,V>.

**19. What is keyof?**
keyof T produces a union of all property names of T as string | number | symbol literal types. function get<T, K extends keyof T>(obj: T, key: K): T[K] is a fully type-safe property accessor.

**20. What is typeof in type position?**
At the type level, typeof variable extracts the type of a value. type Config = typeof defaultConfig. Useful when you have a const object and want to derive its type without manually writing it.

**21. What is a template literal type?**
Constructs new string literal types via template syntax: type EventName = \`on\${Capitalize<string>}\` matches 'onClick', 'onChange', etc.

**22. What is infer in conditional types?**
infer introduces a type variable inside a conditional type: type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never extracts the return type of any function.

**23. What is a recursive type?**
A type that references itself. type NestedArray<T> = T | NestedArray<T>[] or type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }.

**24. What is function overloading in TypeScript?**
Multiple function signatures followed by one implementation signature. TypeScript shows callers only the overload signatures — the implementation signature is internal. Useful for functions with multiple call patterns returning different types.

**25. What is a generic default?**
Type parameters can have defaults: function makeState<T = string>() — callers can omit T and get string. Similar to default function parameters.

## Classes and Access Modifiers (26–35)

**26. What are access modifiers in TypeScript?**
public (default), protected (class + subclasses), private (class only), and readonly. TypeScript's private is erased at runtime — use # (ES private fields) for runtime enforcement.

**27. What is the difference between abstract class and interface?**
Abstract classes can have implementation (method bodies, constructors, instance fields) and use access modifiers. interfaces are purely structural. A class can implement many interfaces but extend only one abstract class.

**28. What is parameter property shorthand?**
constructor(private name: string) simultaneously declares and assigns the name field, removing boilerplate. Equivalent to declaring the field and assigning in the constructor body.

**29. What are decorators in TypeScript?**
Annotations (@) applied to classes, methods, properties, or parameters that can add metadata or modify behaviour. Used extensively in Angular and NestJS. The official decorators proposal (Stage 3) is enabled with --experimentalDecorators.

**30. What is the override keyword?**
Added in TypeScript 4.3. Marking a method override ensures it actually overrides a parent method — TypeScript errors if the parent method doesn't exist or has a different signature. Prevents silent drift when parent methods are renamed.

## Types vs Interfaces Advanced (31–40)

**31. What is declaration merging with interface?**
Declaring the same interface name twice merges their members. Used to extend third-party types: declare module 'express' { interface Request { user?: User } }. type does not support merging.

**32. What are index signatures?**
{ [key: string]: number } allows any string key with number values. Useful for dynamic objects. Use Record<string, number> as a cleaner equivalent.

**33. What is Exclude and Extract?**
Exclude<T, U> removes types from T that are assignable to U. Extract<T, U> keeps only types assignable to U. Exclude<'a'|'b'|'c', 'a'> = 'b'|'c'.

**34. What is ReturnType<T>?**
Extracts the return type of a function type using infer. type R = ReturnType<typeof myFn> gives the return type without manually writing it.

**35. What is Parameters<T>?**
Extracts function parameter types as a tuple. type P = Parameters<typeof fn>. Used to forward arguments or validate them.

## Advanced TypeScript Patterns (36–50)

**36. What is a branded type?**
A nominal type created by intersecting a base type with a unique marker: type UserId = string & { __brand: 'UserId' }. Prevents accidentally mixing IDs of different kinds even though both are strings.

**37. What is the Builder pattern with TypeScript?**
Chaining methods that each return this (or a narrowed subtype) to build an object incrementally with full type safety at each step.

**38. What is variance in TypeScript generics?**
Covariance means you can use a subtype where a supertype is expected. Contravariance means the reverse. TypeScript uses structural typing so variance is inferred — function parameters are contravariant, return types are covariant.

**39. What are assertion functions?**
function assertIsString(val: unknown): asserts val is string — TypeScript narrows val to string for the rest of the scope after calling this function, similar to type guards but for void functions that throw on failure.

**40. What is declaration files (.d.ts)?**
Type-only files that describe the shape of JavaScript modules without implementation. Published as part of a library (or via @types/... on DefinitelyTyped) so TypeScript knows a module's API even if the source is plain JS.

**41. What is strict mode in TypeScript?**
The --strict flag enables: noImplicitAny, strictNullChecks, strictFunctionTypes, strictPropertyInitialization, noImplicitThis, and alwaysStrict. strictNullChecks is the most impactful — null and undefined are not assignable to other types, eliminating null reference errors.

**42. What is strictNullChecks?**
With strictNullChecks, null and undefined are their own types and not assignable to anything else. The non-null assertion operator (!) overrides the check: value! tells TypeScript you're sure it's not null.

**43. What is the as keyword?**
Type assertion: tells TypeScript to treat a value as a specific type, overriding inference. Use sparingly — as unknown as T is a double assertion that bypasses all safety. Prefer type narrowing when possible.

**44. What is module augmentation?**
Extending types of external modules without modifying their source: declare module 'lodash' { interface LoDashStatic { myFn(): void } }. Merged into the original module's types.

**45. What is the difference between type widening and narrowing?**
Widening is TypeScript broadening an inferred type (let x = 'hello' → string). Narrowing is TypeScript restricting a type based on runtime checks (typeof, instanceof). as const prevents widening.

**46. What is const assertion?**
as const makes all inferred types as narrow as possible: const dirs = ['north','south'] as const — type is readonly ['north', 'south'] not string[]. Essential for discriminated unions with literal types.

**47. What is a type predicate?**
function isString(x: unknown): x is string — the x is string part tells TypeScript to narrow x to string in the true branch when this function is used as a condition.

**48. What is the TypeScript project references feature?**
Splits a large project into independently compiled sub-projects. Each subproject has its own tsconfig with references to its dependencies. Enables incremental compilation — only changed subprojects recompile.

**49. What is the difference between interface extending and type intersecting an interface?**
interface B extends A copies A's shape into B's scope with inheritance semantics (conflict detection, proper error messages). type B = A & { extra: string } is purely structural and can combine types in more flexible ways without inheritance.

**50. What is the TypeScript compiler API?**
A programmatic API to parse, type-check, and transform TypeScript code. Used by build tools, linters, code generators, and codemods. ts.createProgram() creates a program; diagnostics give compiler errors; the type checker resolves types.

---

Practice all 50 with AI feedback at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-types-vs-interfaces',
    track: 'typescript',
    title: 'TypeScript Types vs Interfaces: The Definitive Guide',
    excerpt: 'A clear, complete comparison of type aliases and interfaces in TypeScript — when to use each, the key differences, and the scenarios where only one works.',
    category: 'Core Concepts',
    accentColor: '#a78bfa',
    readTime: '9 min read',
    publishedAt: '2025-05-03',
    modifiedAt: '2025-06-01',
    keywords: ['typescript type vs interface', 'interface vs type alias typescript', 'when to use type or interface', 'typescript interface declaration merging'],
    content: `
# TypeScript Types vs Interfaces: The Definitive Guide

The single most common TypeScript interview question. Here's everything you need to know.

## What They Have In Common

Both describe the shape of objects and are structurally equivalent for most everyday use:

\`\`\`typescript
// These are identical in usage:
type UserType = { id: number; name: string }
interface UserInterface { id: number; name: string }

function greet(user: UserType) { /* works */ }
function greet(user: UserInterface) { /* also works */ }
\`\`\`

Both can be extended, both appear in IDE tooltips, both enforce structural compatibility.

## Key Differences

### 1. Declaration Merging — Interface Only

\`\`\`typescript
interface Window {
  myCustomProperty: string
}
interface Window {
  anotherProperty: number
}
// Window now has both properties — merged!

type Config = { debug: boolean }
type Config = { verbose: boolean } // ❌ Error: duplicate identifier
\`\`\`

This is the killer feature for extending third-party types:
\`\`\`typescript
// In your express app:
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser
  }
}
// Now req.user is typed everywhere
\`\`\`

### 2. Union and Intersection — Type Only

\`\`\`typescript
type StringOrNumber = string | number           // union
type AdminUser = User & { permissions: string[] } // intersection
type Callback = (err: Error | null) => void    // function type
type Pair<T> = [T, T]                          // tuple
\`\`\`

Interfaces cannot express any of these directly.

### 3. Computed / Mapped Types — Type Only

\`\`\`typescript
type Keys = keyof User              // 'id' | 'name' | 'email'
type Optional = Partial<User>       // all fields optional
type OnlyIds = Record<string, number>

// Interface cannot do this:
type EventHandlers = {
  [K in keyof Events as \`on\${Capitalize<K>}\`]: (e: Events[K]) => void
}
\`\`\`

### 4. Extends vs Intersection

Both can compose types, but differently:

\`\`\`typescript
// Interface extends — property conflicts are caught as errors
interface Animal { name: string }
interface Dog extends Animal { breed: string }

// Type intersection — conflicting properties become never
type Animal = { name: string; sound: string }
type Cat = Animal & { sound: 'meow' }
// Cat.sound is 'meow' (intersection narrows it)
\`\`\`

## Practical Decision Guide

**Use interface when:**
- Defining the shape of an object or class contract
- You need declaration merging (extending third-party modules)
- Writing a library where consumers may extend types
- Defining class implements signatures

**Use type when:**
- Working with unions or intersections
- Using mapped types, conditional types, or template literals
- Defining function signatures (type Fn = (x: string) => void)
- Creating tuple types
- Aliasing primitives or utility type results

## The Recommended Default

Most style guides say: **prefer interface for object shapes, use type for everything else.**

The TypeScript team's own guidance: use interface when possible; use type when you need features only type provides.

\`\`\`typescript
// Good: interface for object/class shapes
interface Repository<T> {
  findById(id: string): Promise<T>
  save(entity: T): Promise<T>
  delete(id: string): Promise<void>
}

// Good: type for union and complex compositions
type Result<T, E extends Error = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
\`\`\`

## One Practical Tip

When in doubt about which to use, start with interface. If TypeScript complains about something interface can't do (unions, mapped types), switch to type. This matches how most TypeScript teams operate in practice.

Practice TypeScript questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-generics-complete-guide',
    track: 'typescript',
    title: 'TypeScript Generics: Complete Guide with Examples',
    excerpt: 'Master TypeScript generics from basic type parameters to constraints, conditional types, and infer. Includes real-world patterns used in libraries and production code.',
    category: 'Deep Dive',
    accentColor: '#6af7c0',
    readTime: '10 min read',
    publishedAt: '2025-05-06',
    modifiedAt: '2025-06-01',
    keywords: ['typescript generics explained', 'typescript generic constraints', 'typescript infer type', 'generic types typescript examples'],
    content: `
# TypeScript Generics: Complete Guide with Examples

Generics are TypeScript's most powerful feature and the topic most developers find difficult. This guide builds your understanding from first principles.

## Why Generics Exist

Without generics, you must choose between safety and reusability:

\`\`\`typescript
// Too restrictive — only works for number[]
function first(arr: number[]): number { return arr[0] }

// Too permissive — loses type information
function first(arr: any[]): any { return arr[0] }

// Just right — generic
function first<T>(arr: T[]): T { return arr[0] }
const n = first([1, 2, 3])  // n: number ✓
const s = first(['a', 'b']) // s: string ✓
\`\`\`

The type parameter T is inferred from the argument — no manual annotation needed.

## Generic Constraints (extends)

Without constraints, generic T is too wide — you can only use it as unknown.

\`\`\`typescript
// ❌ TypeScript can't assume T has .length
function logLength<T>(x: T) {
  console.log(x.length) // Error: Property 'length' does not exist on type 'T'
}

// ✅ Constrain T to objects with a length property
function logLength<T extends { length: number }>(x: T) {
  console.log(x.length) // works: string, array, typed arrays, NodeList...
}

// Real example: type-safe property getter
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { id: 1, name: 'Alice', email: 'a@b.com' }
const name = getProperty(user, 'name')  // string ✓
const id   = getProperty(user, 'id')    // number ✓
getProperty(user, 'missing')            // ❌ Error: not a key of user
\`\`\`

## Generic Interfaces and Classes

\`\`\`typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: Omit<T, 'id'>): Promise<T>
  delete(id: string): Promise<void>
}

class UserRepository implements Repository<User> {
  async findById(id: string) { /* ... */ }
  // TypeScript enforces all four methods match the interface
}

// Generic class — type parameter used throughout
class Stack<T> {
  private items: T[] = []
  push(item: T): void { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
  peek(): T | undefined { return this.items[this.items.length - 1] }
  get size(): number { return this.items.length }
}

const numStack = new Stack<number>()
numStack.push(1)
numStack.push('a') // ❌ Error: Argument of type 'string' is not assignable to 'number'
\`\`\`

## Multiple Type Parameters

\`\`\`typescript
function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return a.map((item, i) => [item, b[i]])
}

const pairs = zip([1,2,3], ['a','b','c'])
// type: [number, string][]

// Generic with default type
function useState<T = string>(initial: T): [T, (val: T) => void] {
  let value = initial
  return [value, (val) => { value = val }]
}
const [name, setName] = useState() // T defaults to string
\`\`\`

## The infer Keyword

\`infer\` introduces a type variable inside a conditional type to extract a type from another:

\`\`\`typescript
// Extract the return type of any function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type A = ReturnType<() => string>     // string
type B = ReturnType<(x: number) => boolean> // boolean

// Extract the type inside a Promise
type Awaited<T> = T extends Promise<infer V> ? V : T
type C = Awaited<Promise<User>>  // User
type D = Awaited<string>         // string

// Extract element type from array
type ArrayItem<T> = T extends (infer Item)[] ? Item : never
type E = ArrayItem<User[]>  // User
\`\`\`

## Mapped Types with Generics

\`\`\`typescript
// Make all properties optional
type Partial<T> = { [K in keyof T]?: T[K] }

// Make all properties required
type Required<T> = { [K in keyof T]-?: T[K] }

// Pick a subset of keys
type Pick<T, K extends keyof T> = { [P in K]: T[P] }

// Real-world example: form state derived from model
type FormValues<T> = {
  [K in keyof T]: T[K] extends object ? string : T[K]
}
\`\`\`

## Common Generic Patterns in Practice

\`\`\`typescript
// Type-safe event emitter
class TypedEventEmitter<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void { /* ... */ }
  emit<K extends keyof Events>(event: K, data: Events[K]): void { /* ... */ }
}

type AppEvents = {
  login: { userId: string }
  logout: { userId: string }
  error: Error
}

const emitter = new TypedEventEmitter<AppEvents>()
emitter.on('login', ({ userId }) => console.log(userId)) // userId: string ✓
emitter.emit('error', new Error('oops'))                  // correct type ✓
emitter.emit('login', 'wrong')                            // ❌ Type error
\`\`\`

Practice TypeScript questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-utility-types-cheatsheet',
    track: 'typescript',
    title: 'TypeScript Utility Types: The Complete Cheatsheet',
    excerpt: 'A complete reference for all TypeScript built-in utility types — Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, and more — with real examples.',
    category: 'Reference',
    accentColor: '#fb923c',
    readTime: '8 min read',
    publishedAt: '2025-05-09',
    modifiedAt: '2025-06-01',
    keywords: ['typescript utility types', 'partial required readonly typescript', 'pick omit typescript', 'typescript record exclude extract'],
    content: `
# TypeScript Utility Types: The Complete Cheatsheet

TypeScript ships with powerful generic utilities that transform types. Knowing them saves hundreds of lines of manual type definitions.

## Object Modification Utilities

### Partial<T> — Make All Properties Optional
\`\`\`typescript
interface User { id: number; name: string; email: string }

type UserUpdate = Partial<User>
// { id?: number; name?: string; email?: string }

function updateUser(id: number, changes: Partial<User>) {
  // changes can contain any subset of User fields
}
updateUser(1, { name: 'Alice' })  // valid — only name
updateUser(1, { email: 'a@b.com', name: 'Alice' }) // also valid
\`\`\`

### Required<T> — Make All Properties Required
\`\`\`typescript
interface Config {
  debug?: boolean
  timeout?: number
  retries?: number
}

type FinalConfig = Required<Config>
// { debug: boolean; timeout: number; retries: number }
\`\`\`

### Readonly<T> — Prevent Mutation
\`\`\`typescript
type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name: string; readonly email: string }

const user: ReadonlyUser = { id: 1, name: 'Alice', email: 'a@b.com' }
user.name = 'Bob' // ❌ Error: Cannot assign to 'name' because it is read-only
\`\`\`

### Record<K, V> — Map Keys to Values
\`\`\`typescript
type StatusMap = Record<'active' | 'inactive' | 'banned', { count: number }>
// { active: { count: number }; inactive: { count: number }; banned: { count: number } }

const statusCounts: Record<string, number> = {}
statusCounts['active'] = 42 // safe
\`\`\`

## Key Selection Utilities

### Pick<T, K> — Select Specific Properties
\`\`\`typescript
interface User { id: number; name: string; email: string; password: string }

type PublicUser = Pick<User, 'id' | 'name' | 'email'>
// { id: number; name: string; email: string }
// password is excluded — safe to send to client
\`\`\`

### Omit<T, K> — Exclude Specific Properties
\`\`\`typescript
type UserWithoutPassword = Omit<User, 'password'>
// { id: number; name: string; email: string }

// Common pattern: omit id when creating new entities
type CreateUserInput = Omit<User, 'id'>
\`\`\`

### Pick vs Omit — When to Use Which
- Use Pick when you know the small set of properties you WANT
- Use Omit when you know the small set of properties you DON'T WANT
- If the type has 20 fields and you want 18, Omit is cleaner than Pick

## Union Type Utilities

### Exclude<T, U> — Remove Types from Union
\`\`\`typescript
type Status = 'active' | 'inactive' | 'banned' | 'pending'
type LiveStatus = Exclude<Status, 'banned' | 'pending'>
// 'active' | 'inactive'

type NonNullableId = Exclude<string | null | undefined, null | undefined>
// string
\`\`\`

### Extract<T, U> — Keep Only Matching Types
\`\`\`typescript
type StringOrNum = string | number | boolean
type OnlyStrings = Extract<StringOrNum, string>
// string

// Useful for narrowing unions:
type StringEvents = Extract<DOMEvent, MouseEvent | KeyboardEvent>
\`\`\`

### NonNullable<T> — Remove null and undefined
\`\`\`typescript
type MaybeUser = User | null | undefined
type DefiniteUser = NonNullable<MaybeUser>
// User

function processUser(user: NonNullable<typeof maybeUser>) {
  // TypeScript knows user is defined here
}
\`\`\`

## Function Type Utilities

### ReturnType<T> — Extract Function Return Type
\`\`\`typescript
function createUser(name: string, email: string) {
  return { id: Math.random(), name, email, createdAt: new Date() }
}

type User = ReturnType<typeof createUser>
// { id: number; name: string; email: string; createdAt: Date }
// No need to manually define User!
\`\`\`

### Parameters<T> — Extract Function Parameter Types
\`\`\`typescript
function fetchData(url: string, options: RequestInit, timeout: number) { /* */ }

type FetchParams = Parameters<typeof fetchData>
// [url: string, options: RequestInit, timeout: number]

// Forward exact same parameters to a wrapper
function cachedFetch(...args: Parameters<typeof fetchData>) {
  return fetchData(...args)
}
\`\`\`

### Awaited<T> — Unwrap Promise Type
\`\`\`typescript
async function getUser(): Promise<User> { /* */ }

type UserResult = Awaited<ReturnType<typeof getUser>>
// User (Promise is unwrapped)
\`\`\`

## Combining Utilities

The real power comes from composing utilities:

\`\`\`typescript
// Patch endpoint: all fields optional except id (which is required)
type UserPatch = Required<Pick<User, 'id'>> & Partial<Omit<User, 'id'>>

// Read-only computed state
type AppState = Readonly<{
  user: NonNullable<User>
  settings: Required<Settings>
  cache: Record<string, unknown>
}>
\`\`\`

Practice TypeScript utility type questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-type-guards-narrowing',
    track: 'typescript',
    title: 'TypeScript Type Guards & Narrowing Explained',
    excerpt: 'Learn every TypeScript narrowing technique: typeof, instanceof, in, discriminated unions, assertion functions, and custom type predicates — with practical examples.',
    category: 'Core Concepts',
    accentColor: '#34d399',
    readTime: '7 min read',
    publishedAt: '2025-05-12',
    modifiedAt: '2025-06-01',
    keywords: ['typescript type guards', 'typescript narrowing', 'type predicate typescript', 'discriminated union typescript'],
    content: `
# TypeScript Type Guards & Narrowing Explained

Narrowing is TypeScript's ability to refine a broader type to a more specific one based on runtime checks. It's what makes union types practical.

## typeof Narrowing

\`\`\`typescript
function format(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value.toUpperCase()  // value: string ✓
  }
  if (typeof value === 'number') {
    return value.toFixed(2)     // value: number ✓
  }
  return String(value)          // value: boolean ✓
}
\`\`\`

typeof works for: 'string', 'number', 'boolean', 'bigint', 'symbol', 'undefined', 'function', 'object'.

## instanceof Narrowing

\`\`\`typescript
function handleEvent(event: MouseEvent | KeyboardEvent) {
  if (event instanceof MouseEvent) {
    console.log(event.clientX, event.clientY) // MouseEvent properties ✓
  } else {
    console.log(event.key) // KeyboardEvent properties ✓
  }
}

// Works with custom classes too:
class ApiError extends Error { constructor(public statusCode: number, message: string) { super(message) } }
class NetworkError extends Error { constructor(public retryable: boolean, message: string) { super(message) } }

function handleError(err: ApiError | NetworkError) {
  if (err instanceof ApiError) {
    console.log(err.statusCode) // ✓
  } else {
    console.log(err.retryable)  // ✓
  }
}
\`\`\`

## in Operator Narrowing

\`\`\`typescript
type Cat = { meow(): void; purr(): void }
type Dog = { bark(): void; fetch(): void }

function speak(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow()  // animal: Cat ✓
  } else {
    animal.bark()  // animal: Dog ✓
  }
}
\`\`\`

## Discriminated Unions (Best Practice)

The most robust narrowing pattern — add a literal discriminant field:

\`\`\`typescript
type Success<T> = { status: 'success'; data: T }
type Failure = { status: 'failure'; error: string }
type Loading = { status: 'loading' }

type AsyncResult<T> = Success<T> | Failure | Loading

function render<T>(result: AsyncResult<T>) {
  switch (result.status) {
    case 'loading':  return <Spinner />              // result: Loading ✓
    case 'success':  return <Data value={result.data} />  // result: Success<T> ✓
    case 'failure':  return <Error msg={result.error} />  // result: Failure ✓
  }
}
\`\`\`

The discriminant (status) must be a literal type, not just string.

## Custom Type Predicates

\`\`\`typescript
// Standard approach — TypeScript doesn't learn the type after this:
function isUser(value: unknown) {
  return typeof value === 'object' && value !== null && 'id' in value
}

// Type predicate — TypeScript narrows in the true branch:
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as any).id === 'number'
  )
}

const data: unknown = fetchFromAPI()
if (isUser(data)) {
  console.log(data.id)    // data: User ✓
  console.log(data.name)  // ✓
}
\`\`\`

## Assertion Functions (Throw or Narrow)

\`\`\`typescript
function assertDefined<T>(val: T | null | undefined, msg: string): asserts val is T {
  if (val == null) throw new Error(msg)
}

const user = getUser(id)  // User | null
assertDefined(user, 'User must exist')
console.log(user.name) // user: User ✓ (TypeScript knows it's non-null after assertion)
\`\`\`

## Truthiness Narrowing

\`\`\`typescript
function process(input: string | null | undefined | 0 | false) {
  if (input) {
    // input: string (all falsy values are excluded)
    console.log(input.toUpperCase())
  }
}
// Careful: '' (empty string) is also falsy — may not be what you want
// Use input != null for null/undefined only
\`\`\`

## Exhaustiveness Checking with never

\`\`\`typescript
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2
    case 'square': return shape.side ** 2
    default:
      const _exhaustive: never = shape  // ❌ Error if a new Shape is added without handling it
      throw new Error('Unhandled shape: ' + _exhaustive)
  }
}
\`\`\`

Practice TypeScript narrowing questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-with-react-best-practices',
    track: 'typescript',
    title: 'TypeScript with React: Best Practices for 2025',
    excerpt: 'How to use TypeScript effectively in React projects — typing props, hooks, events, context, and refs correctly, with common mistakes and how to avoid them.',
    category: 'Best Practices',
    accentColor: '#f59e0b',
    readTime: '9 min read',
    publishedAt: '2025-05-15',
    modifiedAt: '2025-06-01',
    keywords: ['typescript react best practices', 'typing react components typescript', 'react typescript hooks', 'typescript react events'],
    content: `
# TypeScript with React: Best Practices for 2025

## Typing Component Props

\`\`\`typescript
// Interface for object shapes (recommended)
interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  children?: React.ReactNode
}

// FC type — use sparingly; it always includes children
const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => (
  <button className={variant} onClick={onClick}>{label}</button>
)

// Preferred: plain function (better for generics, no implicit children)
function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{label}</button>
}
\`\`\`

## Typing useState

\`\`\`typescript
// TypeScript infers from initial value
const [count, setCount] = useState(0)        // number
const [name, setName] = useState('')          // string

// Explicit generic when initial value doesn't reflect full type
const [user, setUser] = useState<User | null>(null)  // User | null, not just null

// For complex state, define the type explicitly
interface FormState {
  email: string
  password: string
  errors: Record<string, string>
}
const [form, setForm] = useState<FormState>({ email: '', password: '', errors: {} })
\`\`\`

## Typing useRef

\`\`\`typescript
// DOM ref — starts null, TypeScript knows it after mount
const inputRef = useRef<HTMLInputElement>(null)

function focusInput() {
  inputRef.current?.focus()  // optional chain handles null safely
  // or: inputRef.current!.focus() if you're certain it's mounted
}

// Mutable value ref — no null, no DOM
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
timerRef.current = setTimeout(() => {}, 1000)
\`\`\`

## Typing useReducer

\`\`\`typescript
type CartItem = { id: string; name: string; quantity: number }

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD':    return { ...state, items: [...state.items, action.item] }
    case 'REMOVE': return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'CLEAR':  return { items: [], total: 0 }
  }
}

const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 })
dispatch({ type: 'ADD', item: { id: '1', name: 'Hat', quantity: 1 } }) // ✓
dispatch({ type: 'REMOVE', id: '1' })  // ✓
dispatch({ type: 'REMOVE' })           // ❌ Error: missing 'id'
\`\`\`

## Typing Context

\`\`\`typescript
interface AuthContextType {
  user: User | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Don't use undefined as default — makes every consumer check for it
const AuthContext = React.createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx  // return type is AuthContextType, not null — no more ! assertions
}
\`\`\`

## Typing Event Handlers

\`\`\`typescript
// Input events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value)
}

// Form submit
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  // process form
}

// Generic event (when you don't need event details)
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  e.stopPropagation()
}

// Keyboard event
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') submitForm()
}
\`\`\`

## Typing Children Patterns

\`\`\`typescript
// Most flexible — accepts anything React can render
interface Props {
  children: React.ReactNode
}

// Enforce a single React element
interface Props {
  children: React.ReactElement
}

// Render prop pattern
interface DataTableProps<T> {
  data: T[]
  renderRow: (item: T, index: number) => React.ReactNode
}

function DataTable<T>({ data, renderRow }: DataTableProps<T>) {
  return <table>{data.map(renderRow)}</table>
}
\`\`\`

## Common Mistakes to Avoid

\`\`\`typescript
// ❌ Don't use React.FC — it implicitly adds children and breaks with generics
const MyList: React.FC = () => <ul />

// ✅ Plain function
function MyList() { return <ul /> }

// ❌ Don't use any for event handlers
const handle = (e: any) => e.target.value

// ✅ Use specific event type
const handle = (e: React.ChangeEvent<HTMLInputElement>) => e.target.value

// ❌ Don't assert ! when useRef might be null
const el = ref.current!.getBoundingClientRect()

// ✅ Check in useEffect after mount
useEffect(() => {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect()
  }
}, [])
\`\`\`

Practice TypeScript + React questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-advanced-patterns',
    track: 'typescript',
    title: 'Advanced TypeScript Patterns Every Senior Dev Should Know',
    excerpt: 'Deep dive into advanced TypeScript: branded types, template literal types, recursive types, builder pattern, variance, and type-level programming techniques used in real libraries.',
    category: 'Deep Dive',
    accentColor: '#7c6af7',
    readTime: '11 min read',
    publishedAt: '2025-05-18',
    modifiedAt: '2025-06-01',
    keywords: ['advanced typescript patterns', 'typescript branded types', 'typescript template literal types', 'typescript conditional types advanced'],
    content: `
# Advanced TypeScript Patterns Every Senior Dev Should Know

## 1. Branded Types (Nominal Typing)

TypeScript uses structural typing — two types with the same shape are interchangeable. Branded types add nominal safety:

\`\`\`typescript
type UserId   = string & { readonly __brand: 'UserId' }
type ProductId = string & { readonly __brand: 'ProductId' }

function createUserId(id: string): UserId { return id as UserId }
function createProductId(id: string): ProductId { return id as ProductId }

function getUser(id: UserId): User { /* ... */ }

const userId = createUserId('user-123')
const productId = createProductId('prod-456')

getUser(userId)    // ✓
getUser(productId) // ❌ Error: ProductId is not assignable to UserId
getUser('user-123') // ❌ Error: string is not branded UserId
\`\`\`

Useful for IDs, validated strings, monetary values, and CSS pixel values.

## 2. Template Literal Types

\`\`\`typescript
type Alignment = 'left' | 'center' | 'right'
type Direction = 'horizontal' | 'vertical'

type ClassName = \`align-\${Alignment}\` // 'align-left' | 'align-center' | 'align-right'

// Build event handler types
type EventName<T extends string> = \`on\${Capitalize<T>}\`
type ClickHandler = EventName<'click'> // 'onClick'

// CSS property builder
type CSSProperty = 'margin' | 'padding'
type CSSEdge = 'Top' | 'Bottom' | 'Left' | 'Right'
type CSSEdgeProperty = \`\${CSSProperty}\${CSSEdge}\`
// 'marginTop' | 'marginBottom' | ... | 'paddingRight' (8 combinations)
\`\`\`

## 3. Recursive Types

\`\`\`typescript
// JSON value — any valid JSON
type JSONValue =
  | string | number | boolean | null
  | JSONValue[]
  | { [key: string]: JSONValue }

// Deep partial — every nested object's properties are optional
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// File system tree
type FileTree = {
  name: string
  children?: FileTree[]  // recursive reference
}
\`\`\`

## 4. Distributive Conditional Types

\`\`\`typescript
// When T is a union, conditional types are distributed over each member
type IsString<T> = T extends string ? true : false
type A = IsString<string | number>  // boolean (true | false) — distributed!

// Prevent distribution with brackets
type IsStringExact<T> = [T] extends [string] ? true : false
type B = IsStringExact<string | number>  // false — not distributed

// Use distribution to filter unions:
type FilterStrings<T> = T extends string ? T : never
type OnlyStrings = FilterStrings<string | number | boolean>  // string
\`\`\`

## 5. Variadic Tuple Types

\`\`\`typescript
// Spread in tuple positions
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B]
type C = Concat<[1,2], [3,4]>  // [1, 2, 3, 4]

// Type-safe curry
type Curry<F extends (...args: any) => any> =
  F extends (first: infer A, ...rest: infer R) => infer T
    ? (first: A) => R extends [] ? T : Curry<(...args: R) => T>
    : never
\`\`\`

## 6. Assertion Functions

\`\`\`typescript
// Narrows type for rest of scope when the function doesn't throw
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function assertIsUser(val: unknown): asserts val is User {
  if (!val || typeof val !== 'object' || !('id' in val)) {
    throw new Error('Not a user')
  }
}

const data: unknown = parseJSON(response)
assertIsUser(data)
console.log(data.id)  // data: User ✓ — TypeScript narrows after the assertion
\`\`\`

## 7. Const Type Parameters (TypeScript 5.0+)

\`\`\`typescript
// Without const — TypeScript widens the type
function makeArray<T>(items: T[]) { return items }
const arr = makeArray(['a', 'b', 'c'])  // string[]

// With const — infers literal types
function makeArray<const T>(items: T[]) { return items }
const arr2 = makeArray(['a', 'b', 'c'])  // readonly ['a', 'b', 'c']
\`\`\`

## 8. Satisfies Operator (TypeScript 4.9+)

\`\`\`typescript
const palette = {
  red:  [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Record<string, string | number[]>

// Without satisfies — TypeScript widens to Record<string, string | number[]>
// palette.red would be string | number[], losing the specific type

// With satisfies — validates shape AND preserves narrower inferred types
palette.red.map(c => c * 2)  // number[] ✓ — preserved as number[]
palette.green.toUpperCase()  // string ✓ — preserved as string
\`\`\`

Practice advanced TypeScript at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-enums-explained',
    track: 'typescript',
    title: 'TypeScript Enums Explained: Numeric, String & Const Enums',
    excerpt: 'A complete guide to TypeScript enums — numeric enums, string enums, const enums, and why many TypeScript experts recommend union types instead.',
    category: 'Core Concepts',
    accentColor: '#60a5fa',
    readTime: '7 min read',
    publishedAt: '2025-05-21',
    modifiedAt: '2025-06-01',
    keywords: ['typescript enums', 'typescript string enum', 'const enum typescript', 'typescript enum vs union type'],
    content: `
# TypeScript Enums Explained

## Numeric Enums

\`\`\`typescript
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}

console.log(Direction.Up)    // 0
console.log(Direction[0])    // 'Up' — reverse mapping exists!

enum Status {
  Draft = 1,    // manual start value
  Published,    // 2
  Archived,     // 3
}
\`\`\`

Numeric enums generate both forward (Name → value) and reverse (value → Name) mappings in the compiled output.

## String Enums

\`\`\`typescript
enum Color {
  Red   = 'RED',
  Green = 'GREEN',
  Blue  = 'BLUE',
}

console.log(Color.Red)   // 'RED'
console.log(Color['RED']) // ❌ No reverse mapping — string enums don't have it
\`\`\`

String enums are more debuggable (readable values in logs) and don't have the reverse mapping issue of numeric enums. They are more widely recommended.

## Const Enums

\`\`\`typescript
const enum Weekday {
  Mon = 1, Tue, Wed, Thu, Fri, Sat, Sun
}

const today = Weekday.Mon
// Compiles to: const today = 1  — enum is fully inlined, no object emitted
\`\`\`

Const enums are erased entirely at compile time — values are inlined wherever they're used. This reduces bundle size but means the enum doesn't exist at runtime. Avoid them in library code where consumers may use the enum by name.

## Heterogeneous Enums (Avoid)

\`\`\`typescript
// ❌ Don't do this — mixing types is confusing
enum Mixed {
  No = 0,
  Yes = 'YES',
}
\`\`\`

## The Case Against Enums

Many TypeScript experts recommend using union types instead:

\`\`\`typescript
// ❌ Enum approach
enum Direction { Up = 'UP', Down = 'DOWN', Left = 'LEFT', Right = 'RIGHT' }
function move(dir: Direction) { /* */ }
move(Direction.Up)

// ✅ Union type — simpler, no runtime artifact, more flexible
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
function move(dir: Direction) { /* */ }
move('UP')  // direct string — no enum import needed

// ✅ Object with as const — best of both worlds
const Direction = {
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT',
} as const

type Direction = typeof Direction[keyof typeof Direction]  // 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
move(Direction.Up)  // 'UP' — dot notation like enum
move('UP')          // also valid — string literals work too
\`\`\`

## When to Use Each

| Approach | Use When |
|---|---|
| Numeric enum | Interop with C# or legacy code, database flags |
| String enum | Debuggable runtime values needed, team is familiar with enums |
| Const enum | Bundle size critical, no library consumers, no reverse mapping needed |
| Union type | New TypeScript code, no runtime artifact needed, simple cases |
| const object + typeof | Need dot notation AND string literals to work, maximum flexibility |

The TypeScript team itself uses const objects with as const extensively in their own codebase.

Practice TypeScript questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-mapped-conditional-types',
    track: 'typescript',
    title: 'TypeScript Mapped & Conditional Types: Deep Dive',
    excerpt: 'Master TypeScript mapped types and conditional types — the building blocks of all utility types. Understand keyof, in, infer, and how to write your own type transformations.',
    category: 'Deep Dive',
    accentColor: '#f76a6a',
    readTime: '10 min read',
    publishedAt: '2025-05-24',
    modifiedAt: '2025-06-01',
    keywords: ['typescript mapped types', 'typescript conditional types', 'typescript keyof in', 'typescript infer keyword'],
    content: `
# TypeScript Mapped & Conditional Types: Deep Dive

These are the building blocks that all built-in utility types are constructed from.

## Mapped Types Fundamentals

A mapped type iterates over the keys of another type:

\`\`\`typescript
type User = { id: number; name: string; email: string }

// The shape of Partial<T>
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}
type PartialUser = MyPartial<User>
// { id?: number; name?: string; email?: string }

// Readonly<T>
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Map over a union of string literals
type Flags = 'debug' | 'verbose' | 'strict'
type FlagConfig = { [K in Flags]: boolean }
// { debug: boolean; verbose: boolean; strict: boolean }
\`\`\`

## Modifier Tokens (+ and -)

Add or remove the optional (?) and readonly modifiers:

\`\`\`typescript
// -? removes optionality (Required<T>)
type Required<T> = { [K in keyof T]-?: T[K] }

// -readonly removes readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

type ReadonlyUser = Readonly<User>
type MutableUser = Mutable<ReadonlyUser>  // all readonly removed
\`\`\`

## Key Remapping with as (TypeScript 4.1+)

Rename keys in a mapped type using template literals:

\`\`\`typescript
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

type UserGetters = Getters<User>
// { getId: () => number; getName: () => string; getEmail: () => string }

// Filter keys using never:
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
type StringFields = OnlyStrings<{ id: number; name: string; active: boolean }>
// { name: string }
\`\`\`

## Conditional Types

\`\`\`typescript
// Basic form: T extends U ? X : Y
type IsArray<T> = T extends any[] ? true : false
type A = IsArray<number[]>  // true
type B = IsArray<string>    // false

// NonNullable<T>
type NonNullable<T> = T extends null | undefined ? never : T
type C = NonNullable<string | null | undefined>  // string

// Extract element type
type ElementType<T> = T extends (infer E)[] ? E : T
type D = ElementType<User[]>  // User
type E = ElementType<string>  // string (no array — falls through)
\`\`\`

## Distributive Conditional Types

When T is a union, conditional types are distributed over each member:

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never

type Result = ToArray<string | number>
// string[] | number[]  — distributed!
// Not (string | number)[] — that would be non-distributive

// Prevent distribution with tuple wrapping:
type ToArrayND<T> = [T] extends [any] ? T[] : never
type Result2 = ToArrayND<string | number>
// (string | number)[]  — non-distributive
\`\`\`

## The infer Keyword

\`infer\` captures a type from within a conditional type:

\`\`\`typescript
// Extract the return type of a function
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type R1 = MyReturnType<() => string>          // string
type R2 = MyReturnType<(x: number) => User>   // User
type R3 = MyReturnType<string>                // never (not a function)

// Extract first argument type
type FirstArg<T> = T extends (first: infer A, ...rest: any[]) => any ? A : never
type F = FirstArg<(x: string, y: number) => void>  // string

// Unwrap a Promise
type UnPromise<T> = T extends Promise<infer V> ? V : T
type U = UnPromise<Promise<User[]>>  // User[]

// Extract object value types
type ValueOf<T> = T extends Record<string, infer V> ? V : never
type V = ValueOf<{ a: number; b: string; c: boolean }>  // number | string | boolean
\`\`\`

## Building Custom Utility Types

\`\`\`typescript
// DeepPartial — every nested object's properties are optional
type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T

// PickByValue — pick keys whose values match a type
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}
type StringFields = PickByValue<User & { active: boolean }, string>
// { name: string; email: string }

// Merge two types (second overrides first)
type Merge<A, B> = Omit<A, keyof B> & B
\`\`\`

Practice TypeScript questions at [JSPrep Pro](/auth).
    `,
  },
  {
    slug: 'typescript-common-mistakes',
    track: 'typescript',
    title: '10 Common TypeScript Mistakes (And How to Fix Them)',
    excerpt: 'The TypeScript mistakes that trip up even experienced developers — overusing any, incorrect type assertions, structural typing pitfalls, and broken generic inference.',
    category: 'Best Practices',
    accentColor: '#f472b6',
    readTime: '9 min read',
    publishedAt: '2025-05-27',
    modifiedAt: '2025-06-01',
    keywords: ['typescript common mistakes', 'typescript anti-patterns', 'typescript any mistakes', 'typescript type assertion mistakes'],
    content: `
# 10 Common TypeScript Mistakes (And How to Fix Them)

## 1. Using any Instead of unknown

\`\`\`typescript
// ❌ any disables all type checking — defeats the purpose
function parse(data: any) {
  return data.name.toUpperCase()  // no error, but crashes if name is missing
}

// ✅ unknown forces you to check before using
function parse(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name.toUpperCase()  // safe
  }
  throw new Error('Invalid data shape')
}
\`\`\`

## 2. Incorrect Type Assertions

\`\`\`typescript
// ❌ Lying to TypeScript — runtime crash if response doesn't match User
const user = response as User

// ❌ Double assertion bypasses all safety
const user = response as unknown as User

// ✅ Use a type guard to validate the shape
function isUser(val: unknown): val is User {
  return typeof val === 'object' && val !== null && 'id' in val && 'name' in val
}
if (isUser(response)) {
  user.name  // ✓ actually safe
}
\`\`\`

## 3. Not Enabling strictNullChecks

Without strictNullChecks, null and undefined are assignable to everything — eliminating half the value of TypeScript. Always add "strict": true to tsconfig.json.

\`\`\`typescript
// Without strictNullChecks — no error:
const user: User = null  // TypeScript allows this
user.name                 // runtime crash

// With strictNullChecks — correctly catches it:
const user: User | null = null
user.name                 // ❌ Error: user is possibly null
user?.name                // ✅ safe
\`\`\`

## 4. Object Literal Excess Property Checking Confusion

\`\`\`typescript
interface Point { x: number; y: number }

// ❌ TypeScript catches excess properties on direct assignment
const p: Point = { x: 1, y: 2, z: 3 }  // Error: z doesn't exist on Point

// But NOT through a variable (structural compatibility, not exact match):
const obj = { x: 1, y: 2, z: 3 }
const p2: Point = obj  // ✓ No error — obj is structurally compatible
\`\`\`

This is by design — structural typing means extra properties are fine as long as required ones are present.

## 5. Missing Generic Constraints

\`\`\`typescript
// ❌ T is unknown — you can only use T as unknown inside
function getValue<T>(obj: T, key: string) {
  return obj[key]  // Error: Element implicitly has 'any' type
}

// ✅ Constrain properly
function getValue<T extends Record<string, unknown>, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
\`\`\`

## 6. Misusing Non-Null Assertion (!)

\`\`\`typescript
// ❌ Using ! everywhere is "runtime TypeScript" — you lose all protection
const el = document.getElementById('root')!
const user = getUser(id)!
const value = map.get(key)!

// ✅ Actually check for null
const el = document.getElementById('root')
if (!el) throw new Error('#root element not found')
el.innerHTML = app  // TypeScript knows el is non-null here
\`\`\`

## 7. Ignoring TypeScript Errors with @ts-ignore

\`\`\`typescript
// ❌ Silences the error without fixing it
// @ts-ignore
user.nonExistentMethod()

// ✅ Use @ts-expect-error — fails if the error goes away (ensuring the comment stays intentional)
// @ts-expect-error — legacy API, types not yet updated
legacyLib.oldMethod()

// ✅ Or fix the root cause
\`\`\`

## 8. Using Object as a Type

\`\`\`typescript
// ❌ Object and object are nearly useless
let data: Object = 5  // allows primitives!
let obj: object = { a: 1 }  // can't access any properties

// ✅ Use Record, specific interface, or unknown
let config: Record<string, unknown> = {}
let user: User = { id: 1, name: 'Alice' }
\`\`\`

## 9. Mutating Readonly Properties

\`\`\`typescript
interface Config { readonly apiKey: string }
const config: Config = { apiKey: 'secret' }

config.apiKey = 'other'  // ❌ TypeScript error — readonly

// But: Readonly is SHALLOW
interface State { readonly user: { name: string } }
const state: State = { user: { name: 'Alice' } }
state.user = { name: 'Bob' }  // ❌ Error — user is readonly
state.user.name = 'Bob'       // ✓ No error — nested object is mutable
// Use DeepReadonly<T> for deep immutability
\`\`\`

## 10. Not Using Discriminated Unions

\`\`\`typescript
// ❌ All optional — TypeScript can't help narrow
interface ApiResponse {
  data?: User
  error?: string
  loading?: boolean
}

// ✅ Discriminated union — exactly one state is possible at a time
type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function render(state: ApiState<User>) {
  if (state.status === 'success') {
    state.data.name  // ✓ TypeScript knows data exists here
  }
  if (state.status === 'error') {
    state.error.toUpperCase()  // ✓ TypeScript knows error exists here
  }
}
\`\`\`

Practice TypeScript at [JSPrep Pro](/auth).
    `,
  },
]
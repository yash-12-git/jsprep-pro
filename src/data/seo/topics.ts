export interface Topic {
  slug: string
  title: string
  /** Matches a CATEGORIES value in questions.ts — used to filter questions */
  category: string
  /** Short keyword for subtitle + SEO description */
  keyword: string
  /** One-line description shown under the H1 */
  description: string
  /** Comma-separated extra tags searched in q.q and q.answer */
  extraKeywords?: string[]
  /** Interview difficulty level — shown as badge */
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior'
  /** Estimated # questions interviewers typically ask */
  questionCount: string
  /** Quick "what you need to know" bullets — shown in the cheat-sheet box */
  cheatSheet: string[]
  /** Interview tips specific to this topic */
  interviewTips: string[]
  /** Slugs of related topic pages to cross-link */
  related: string[]
}

export const TOPICS: Topic[] = [

  // ─── CORE JS ─────────────────────────────────────────────────────────────

  {
    slug: 'javascript-closure-interview-questions',
    title: 'JavaScript Closure Interview Questions',
    category: 'Functions',
    keyword: 'closure',
    description: 'Closures are the most frequently tested JavaScript concept. Master them with real interview questions, answers, and code examples.',
    extraKeywords: ['lexical scope', 'IIFE', 'closure in loop', 'private variable'],
    difficulty: 'Intermediate',
    questionCount: '8–12',
    cheatSheet: [
      'A closure is a function that retains access to its outer scope even after the outer function returns',
      'Closures are created every time a function is created — at function creation time',
      'Classic trap: var in a for-loop closure captures the final value (use let or IIFE to fix)',
      'Used in: module pattern, memoization, factory functions, partial application',
      'Every function in JS is a closure (it closes over its lexical environment)',
    ],
    interviewTips: [
      'Always draw a mental stack frame diagram when explaining closures',
      'Be ready to fix the classic "print 0-9 in loop" bug — it\'s asked at 80% of mid-level interviews',
      'Connect closures to real patterns you\'ve used: debounce, memoization, React\'s useState',
      'Distinguish closure (concept) from IIFE (pattern that uses closures)',
    ],
    related: [
      'javascript-scope-interview-questions',
      'javascript-hoisting-interview-questions',
      'javascript-this-keyword-interview-questions',
    ],
  },

  {
    slug: 'javascript-hoisting-interview-questions',
    title: 'JavaScript Hoisting Interview Questions',
    category: 'Core JS',
    keyword: 'hoisting',
    description: 'Hoisting is a top-10 JavaScript interview topic. Learn how var, let, const, and function declarations are handled at parse time.',
    extraKeywords: ['temporal dead zone', 'TDZ', 'var hoisting', 'function hoisting'],
    difficulty: 'Intermediate',
    questionCount: '4–8',
    cheatSheet: [
      'var declarations are hoisted and initialized to undefined',
      'let and const are hoisted but stay in the Temporal Dead Zone (TDZ) until declaration',
      'Function declarations are fully hoisted (name + body)',
      'Function expressions and arrow functions are NOT hoisted as functions',
      'Accessing a let/const before declaration throws ReferenceError, not undefined',
    ],
    interviewTips: [
      'Always distinguish "hoisted" (all declarations) from "initialized" (only var and function decls)',
      'TDZ is the follow-up question to every hoisting question — mention it proactively',
      'Prove understanding by predicting output of code with mixed var/let declarations',
      'Explain WHY: hoisting happens during the Creation Phase of the Execution Context',
    ],
    related: [
      'javascript-scope-interview-questions',
      'javascript-execution-context-interview-questions',
      'javascript-var-let-const-interview-questions',
    ],
  },

  {
    slug: 'javascript-scope-interview-questions',
    title: 'JavaScript Scope Interview Questions',
    category: 'Core JS',
    keyword: 'scope',
    description: 'Scope determines where variables are accessible. Master global, function, block scope and the scope chain for JavaScript interviews.',
    extraKeywords: ['lexical scope', 'block scope', 'scope chain', 'variable shadowing'],
    difficulty: 'Beginner',
    questionCount: '4–6',
    cheatSheet: [
      'Global scope: accessible everywhere; function scope: inside function only; block scope: inside {} with let/const',
      'var is function-scoped; let and const are block-scoped',
      'The scope chain: JS looks outward from current scope until it finds the variable or reaches global',
      'Lexical scope: scope is determined at write-time (where code is written), not runtime',
      'Variable shadowing: inner scope variable hides outer scope variable with the same name',
    ],
    interviewTips: [
      'Draw the nested scope boxes visually when explaining — interviewers appreciate the mental model',
      'Distinguish scope (variable accessibility) from context (the value of this)',
      'Be ready to trace a scope chain lookup step-by-step for a code snippet',
    ],
    related: [
      'javascript-closure-interview-questions',
      'javascript-hoisting-interview-questions',
      'javascript-var-let-const-interview-questions',
    ],
  },

  {
    slug: 'javascript-var-let-const-interview-questions',
    title: 'JavaScript var, let, and const Interview Questions',
    category: 'Core JS',
    keyword: 'var let const',
    description: 'Understanding the differences between var, let, and const is a JavaScript interview staple. Learn scope, hoisting, and reassignment rules.',
    extraKeywords: ['variable declaration', 'block scope', 'const object', 'reassignment'],
    difficulty: 'Beginner',
    questionCount: '3–5',
    cheatSheet: [
      'var: function-scoped, hoisted as undefined, can be re-declared and reassigned',
      'let: block-scoped, TDZ, cannot be re-declared in same scope, can be reassigned',
      'const: block-scoped, TDZ, cannot be re-declared or reassigned — but object contents can change',
      'const obj.x = 1 is allowed; obj = {} is not — const locks the binding, not the value',
      'Prefer const by default; use let only when you need to reassign; avoid var in modern code',
    ],
    interviewTips: [
      'The const + object mutation gotcha is a favourite trick question — always mention it',
      'For every var question, connect it back to why let/const fix it',
      'Be ready to explain TDZ with a concrete code example that throws ReferenceError',
    ],
    related: [
      'javascript-hoisting-interview-questions',
      'javascript-scope-interview-questions',
    ],
  },

  {
    slug: 'javascript-execution-context-interview-questions',
    title: 'JavaScript Execution Context Interview Questions',
    category: 'Core JS',
    keyword: 'execution context',
    description: 'Execution Contexts underpin hoisting, this, and the call stack. Essential for senior JavaScript interviews.',
    extraKeywords: ['call stack', 'creation phase', 'execution phase', 'global execution context', 'environment record'],
    difficulty: 'Advanced',
    questionCount: '3–6',
    cheatSheet: [
      'Every function call creates a new Execution Context pushed onto the call stack',
      'Creation phase: hoisting, this binding, scope chain setup',
      'Execution phase: runs code line by line, assigns actual values',
      'Global EC creates window/globalThis and binds this = global object',
      'Environment Records are the underlying data structure storing variable bindings',
    ],
    interviewTips: [
      'This is a "depth" question — interviewers use it to find senior candidates from mid-level',
      'Connect execution context → call stack → event loop for a complete mental model',
      'Mention Environment Records (modern spec term) instead of the older "Activation Object"',
    ],
    related: [
      'javascript-hoisting-interview-questions',
      'javascript-event-loop-interview-questions',
      'javascript-this-keyword-interview-questions',
    ],
  },

  {
    slug: 'javascript-type-coercion-interview-questions',
    title: 'JavaScript Type Coercion Interview Questions',
    category: 'Core JS',
    keyword: 'type coercion',
    description: 'Type coercion is behind many JavaScript gotchas. Learn == vs ===, implicit conversion rules, and how to answer tricky output questions.',
    extraKeywords: ['equality', 'implicit conversion', 'truthy falsy', 'abstract equality'],
    difficulty: 'Intermediate',
    questionCount: '4–8',
    cheatSheet: [
      '== uses abstract equality with type coercion; === uses strict equality without conversion',
      'Falsy values: false, 0, "", null, undefined, NaN, 0n — everything else is truthy',
      'When comparing with ==: null == undefined is true; null == 0 is false',
      'String + number: number converts to string ("1" + 2 = "12")',
      'String - number: string converts to number ("3" - 1 = 2)',
    ],
    interviewTips: [
      'Output prediction questions love coercion — practice [] + {}, {} + [], typeof null',
      'Always use === in production; explain WHY: predictable, no surprise coercion',
      'Mention Symbol.toPrimitive for custom coercion at senior level',
    ],
    related: [
      'javascript-equality-interview-questions',
      'javascript-closure-interview-questions',
    ],
  },

  {
    slug: 'javascript-equality-interview-questions',
    title: 'JavaScript == vs === Interview Questions',
    category: 'Core JS',
    keyword: '== vs ===',
    description: 'The difference between == and === is one of the most asked JavaScript interview questions. Learn the coercion rules and common gotchas.',
    extraKeywords: ['strict equality', 'loose equality', 'abstract equality', 'NaN comparison'],
    difficulty: 'Beginner',
    questionCount: '3–5',
    cheatSheet: [
      '=== checks value AND type — no conversion; always prefer this',
      '== checks value after type coercion — many surprise results',
      'NaN === NaN is false — use Number.isNaN() or Object.is(NaN, NaN)',
      'null == undefined is true; null === undefined is false',
      'Object.is() is the most precise equality — handles NaN and -0 correctly',
    ],
    interviewTips: [
      'Always recommend === and explain the one exception: x == null catches both null AND undefined',
      'Know the coercion table by heart: ToNumber, ToString, ToPrimitive rules',
    ],
    related: [
      'javascript-type-coercion-interview-questions',
    ],
  },

  // ─── FUNCTIONS ────────────────────────────────────────────────────────────

  {
    slug: 'javascript-this-keyword-interview-questions',
    title: 'JavaScript "this" Keyword Interview Questions',
    category: "'this' Keyword",
    keyword: 'this keyword',
    description: 'The "this" keyword is notoriously confusing and frequently tested. Master the 4 binding rules and arrow function behaviour.',
    extraKeywords: ['call apply bind', 'arrow function this', 'implicit binding', 'explicit binding', 'new binding'],
    difficulty: 'Intermediate',
    questionCount: '6–10',
    cheatSheet: [
      'Four rules (priority order): new > explicit (call/apply/bind) > implicit (object.method()) > default (global/undefined)',
      'Arrow functions have NO own this — they inherit lexical this from where they are defined',
      'Implicit binding is lost when you assign a method to a variable: const fn = obj.method; fn()',
      'In strict mode, default this is undefined (not global)',
      'bind() returns a new permanently-bound function; call() and apply() invoke immediately',
    ],
    interviewTips: [
      'The "lost binding" trap (extracting a method) is asked at almost every interview',
      'For every code snippet: ask "How was this function CALLED?" — that determines this',
      'Arrow function this: ask "Where was this function DEFINED?" — look at enclosing scope',
      'Know call vs apply vs bind: call(thisArg, ...args), apply(thisArg, [args]), bind returns fn',
    ],
    related: [
      'javascript-closure-interview-questions',
      'javascript-arrow-function-interview-questions',
      'javascript-prototype-interview-questions',
    ],
  },

  {
    slug: 'javascript-arrow-function-interview-questions',
    title: 'JavaScript Arrow Function Interview Questions',
    category: 'Functions',
    keyword: 'arrow function',
    description: 'Arrow functions are ES6 syntax with key differences from regular functions. Learn the this behaviour, missing arguments object, and when NOT to use them.',
    extraKeywords: ['arrow vs regular', 'no arguments', 'no prototype', 'implicit return'],
    difficulty: 'Intermediate',
    questionCount: '4–7',
    cheatSheet: [
      'Arrow functions have no own this — inherits from lexical (surrounding) scope',
      'No arguments object — use rest parameters (...args) instead',
      'Cannot be used as constructors — no new keyword',
      'No prototype property',
      'Implicit return: (x) => x * 2 is valid; no {} needed for single expression',
    ],
    interviewTips: [
      'Classic trap: using arrow as object method breaks this — obj.method() arrow → this = outer scope',
      'Know when NOT to use arrows: object methods, event handlers where you need this = element',
      'Arrow functions are perfect for: callbacks, array methods, preserving this in class methods',
    ],
    related: [
      'javascript-this-keyword-interview-questions',
      'javascript-closure-interview-questions',
    ],
  },

  {
    slug: 'javascript-currying-interview-questions',
    title: 'JavaScript Currying & Partial Application Interview Questions',
    category: 'Functions',
    keyword: 'currying',
    description: 'Currying and partial application are common functional programming questions at senior JavaScript interviews. Learn with implementations.',
    extraKeywords: ['partial application', 'function composition', 'higher order functions', 'functional programming'],
    difficulty: 'Advanced',
    questionCount: '3–5',
    cheatSheet: [
      'Currying: transform f(a,b,c) into f(a)(b)(c) — each call takes exactly ONE argument',
      'Partial application: pre-fill SOME arguments and return a function for the rest',
      'Generic curry: check if args.length >= fn.length, otherwise return accumulator function',
      'Compose: right-to-left application; Pipe: left-to-right (more readable)',
      'bind() is built-in partial application: fn.bind(null, arg1) pre-fills arg1',
    ],
    interviewTips: [
      'Be ready to implement a generic curry() function from scratch',
      'Distinguish currying from partial application — interviewers often conflate them',
      'Connect to real use cases: event handlers, React callbacks, reusable utility fns',
    ],
    related: [
      'javascript-closure-interview-questions',
      'javascript-higher-order-functions-interview-questions',
    ],
  },

  {
    slug: 'javascript-higher-order-functions-interview-questions',
    title: 'JavaScript Higher-Order Functions Interview Questions',
    category: 'Functions',
    keyword: 'higher order functions',
    description: 'Higher-order functions are the foundation of JavaScript\'s functional style. Master map, filter, reduce, and how to implement your own.',
    extraKeywords: ['map filter reduce', 'callback', 'functional programming', 'first class functions'],
    difficulty: 'Intermediate',
    questionCount: '5–8',
    cheatSheet: [
      'HOF: a function that takes a function as argument OR returns a function as result',
      'map: transforms each element, returns new array of same length',
      'filter: tests each element, returns new array with only passing elements',
      'reduce: accumulates values into a single result; most versatile',
      'Functions are first-class in JS — treated as values (assignable, passable, returnable)',
    ],
    interviewTips: [
      'Be ready to implement map/filter/reduce from scratch — it\'s a very common ask',
      'Explain the difference between map (transforms) and forEach (side effects, returns undefined)',
      'Connect to immutability: map/filter/reduce return NEW arrays — never mutate the original',
    ],
    related: [
      'javascript-array-interview-questions',
      'javascript-currying-interview-questions',
      'javascript-closure-interview-questions',
    ],
  },

  {
    slug: 'javascript-generators-interview-questions',
    title: 'JavaScript Generators Interview Questions',
    category: 'Modern JS',
    keyword: 'generators',
    description: 'Generator functions are advanced JavaScript with real-world uses in async iteration and lazy evaluation. Learn for senior-level interviews.',
    extraKeywords: ['yield', 'iterator', 'async generator', 'for await of', 'lazy evaluation'],
    difficulty: 'Advanced',
    questionCount: '3–5',
    cheatSheet: [
      'Generators (function*) pause at yield and resume on next() call — lazy evaluation',
      'next(value) sends a value INTO the generator — two-way communication',
      'Generators implement the iterator protocol: { value, done }',
      'Async generators (async function*) yield Promises — consume with for await...of',
      'Use case: paginated APIs, infinite sequences, controlling async flow',
    ],
    interviewTips: [
      'Walk through execution step-by-step: gen() creates iterator, first next() runs to first yield',
      'The two-way communication (passing value into yield) often surprises interviewers',
      'Mention real use case: Redux Saga uses generators for async flow control',
    ],
    related: [
      'javascript-iterator-interview-questions',
      'javascript-async-await-interview-questions',
    ],
  },

  // ─── ASYNC ────────────────────────────────────────────────────────────────

  {
    slug: 'javascript-event-loop-interview-questions',
    title: 'JavaScript Event Loop Interview Questions',
    category: 'Async JS',
    keyword: 'event loop',
    description: 'The event loop is the #1 most tested JavaScript concept at senior interviews. Master call stack, microtask queue, and macrotask queue.',
    extraKeywords: ['call stack', 'microtask queue', 'macrotask queue', 'task queue', 'microtask vs macrotask'],
    difficulty: 'Advanced',
    questionCount: '6–10',
    cheatSheet: [
      'Order: sync code → drain all microtasks → one macrotask → repeat',
      'Microtasks (high priority): Promise callbacks, queueMicrotask, MutationObserver',
      'Macrotasks (low priority): setTimeout, setInterval, I/O, UI events',
      'The event loop is what makes JS non-blocking despite being single-threaded',
      'Render phase runs BETWEEN macrotasks — sync code blocks the browser from painting',
    ],
    interviewTips: [
      'The output prediction format is universal — always practice tracing execution order',
      'Mention that setTimeout(fn, 0) is a macrotask — it runs AFTER all microtasks drain',
      'Senior question: explain why microtasks starve the rendering phase (infinite microtask loop)',
      'Draw the event loop diagram — it immediately signals deep understanding',
    ],
    related: [
      'javascript-promise-interview-questions',
      'javascript-async-await-interview-questions',
      'javascript-settimeout-interview-questions',
    ],
  },

  {
    slug: 'javascript-promise-interview-questions',
    title: 'JavaScript Promise Interview Questions',
    category: 'Async JS',
    keyword: 'promises',
    description: 'Promises are core to modern JavaScript async. Master states, chaining, error handling, and Promise combinators for your interview.',
    extraKeywords: ['promise chain', 'promise.all', 'promise combinators', 'async', 'microtask'],
    difficulty: 'Intermediate',
    questionCount: '7–12',
    cheatSheet: [
      'Three states: pending → fulfilled (resolve) or rejected (reject) — transitions are permanent',
      'then(onFulfilled, onRejected) — catch(fn) is shorthand for then(null, fn)',
      'Promise.all: all resolve → array of results; any reject → immediately reject',
      'Promise.allSettled: always resolves with array of {status, value/reason} — never rejects',
      'Promise.race: first settled (resolve OR reject) wins; Promise.any: first resolved wins',
    ],
    interviewTips: [
      'Know all 4 combinators cold — all vs allSettled vs race vs any is a favourite',
      'Unhandled rejections crash Node.js 15+ — always explain the process.on("unhandledRejection") handler',
      'Promise chains return new Promises — connect this to how .catch() at the end catches everything above',
      'Contrast promises with callbacks — less nesting, better error propagation, composable',
    ],
    related: [
      'javascript-async-await-interview-questions',
      'javascript-event-loop-interview-questions',
      'javascript-callback-interview-questions',
    ],
  },

  {
    slug: 'javascript-async-await-interview-questions',
    title: 'JavaScript async/await Interview Questions',
    category: 'Async JS',
    keyword: 'async await',
    description: 'async/await is the modern way to write async JavaScript. Master the syntax, error handling patterns, and common pitfalls.',
    extraKeywords: ['async function', 'await expression', 'try catch async', 'parallel await'],
    difficulty: 'Intermediate',
    questionCount: '5–8',
    cheatSheet: [
      'async functions always return a Promise — even if you return a plain value',
      'await pauses execution inside the async function but does NOT block the call stack',
      'await on a rejected promise throws — always wrap in try/catch',
      'Pitfall: sequential awaits multiply latency — use Promise.all for independent operations',
      'Top-level await works in ES modules; in scripts, wrap in an async IIFE',
    ],
    interviewTips: [
      'Classic question: rewrite callback/promise chain using async/await',
      'Performance trap: const a = await fn1(); const b = await fn2(); is sequential → 2× slower',
      'Fix: const [a, b] = await Promise.all([fn1(), fn2()]) — runs in parallel',
      'Explain that async/await is syntactic sugar over Promises — same microtask queue',
    ],
    related: [
      'javascript-promise-interview-questions',
      'javascript-event-loop-interview-questions',
      'javascript-error-handling-interview-questions',
    ],
  },

  {
    slug: 'javascript-callback-interview-questions',
    title: 'JavaScript Callback Interview Questions',
    category: 'Async JS',
    keyword: 'callbacks',
    description: 'Callbacks are the foundation of JavaScript async. Learn callback hell, inversion of control, and how Promises solve these problems.',
    extraKeywords: ['callback hell', 'inversion of control', 'async callback', 'error-first callback'],
    difficulty: 'Beginner',
    questionCount: '3–5',
    cheatSheet: [
      'A callback is a function passed as an argument to be called at a later time',
      'Callback hell: deeply nested callbacks, hard to read and error-prone',
      'Error-first convention (Node.js): callback(err, result) — first param is always the error',
      'Inversion of control: you hand responsibility to execute your callback to a third party',
      'Promises and async/await solve callback hell by flattening the nesting',
    ],
    interviewTips: [
      'Show callback hell visually (pyramid of doom), then show the Promise equivalent',
      'Explain IOC risk: what if the callback is called twice, never, or with wrong args?',
    ],
    related: [
      'javascript-promise-interview-questions',
      'javascript-async-await-interview-questions',
    ],
  },

  {
    slug: 'javascript-settimeout-interview-questions',
    title: 'JavaScript setTimeout & setInterval Interview Questions',
    category: 'Async JS',
    keyword: 'setTimeout',
    description: 'setTimeout and setInterval behaviour is frequently tested in output questions. Learn why setTimeout(fn,0) doesn\'t run immediately.',
    extraKeywords: ['setInterval', 'timer', 'macrotask', 'setTimeout 0', 'clearTimeout'],
    difficulty: 'Intermediate',
    questionCount: '4–7',
    cheatSheet: [
      'setTimeout(fn, 0) is a MACROTASK — runs after all sync code and microtasks drain',
      'The delay is a MINIMUM — not guaranteed; depends on call stack and queue state',
      'setInterval can drift over time; recursive setTimeout gives more predictable timing',
      'Always clear intervals: const id = setInterval(...); clearInterval(id)',
      'Nested setTimeout(fn, 0) inside Promise.then: inner microtask runs before outer setTimeout',
    ],
    interviewTips: [
      '"Why doesn\'t setTimeout(fn, 0) run immediately?" — must know event loop to answer correctly',
      'Practice output questions: mix setTimeout with Promises — predict the order',
      'Know the 4ms minimum clamping for nested timers in browsers',
    ],
    related: [
      'javascript-event-loop-interview-questions',
      'javascript-promise-interview-questions',
    ],
  },

  // ─── OBJECTS & PROTOTYPES ─────────────────────────────────────────────────

  {
    slug: 'javascript-prototype-interview-questions',
    title: 'JavaScript Prototype & Prototypal Inheritance Interview Questions',
    category: 'Objects',
    keyword: 'prototype',
    description: 'Prototypal inheritance is JavaScript\'s core object system. Learn prototype chains, Object.create, and how class syntax maps to prototypes.',
    extraKeywords: ['prototype chain', '__proto__', 'Object.create', 'prototypal inheritance', 'class vs prototype'],
    difficulty: 'Advanced',
    questionCount: '6–10',
    cheatSheet: [
      '__proto__ (or [[Prototype]]) is the reference to the prototype of an object',
      'Property lookup: own → prototype → prototype.prototype → ... → Object.prototype → null',
      'Object.create(proto) creates an object with proto as its [[Prototype]]',
      'class syntax is syntactic sugar over prototype-based inheritance',
      'hasOwnProperty / Object.hasOwn() checks only own properties, not inherited',
    ],
    interviewTips: [
      'Draw the prototype chain diagram — it shows you understand it conceptually',
      'Connect class to prototype: class Dog extends Animal is equivalent to Dog.prototype being linked to Animal.prototype',
      'Senior question: difference between __proto__ (getter), Object.getPrototypeOf(), and prototype (function property)',
    ],
    related: [
      'javascript-object-interview-questions',
      'javascript-this-keyword-interview-questions',
      'javascript-class-interview-questions',
    ],
  },

  {
    slug: 'javascript-object-interview-questions',
    title: 'JavaScript Object Interview Questions',
    category: 'Objects',
    keyword: 'objects',
    description: 'Objects are the building blocks of JavaScript. Master property descriptors, copying, iteration, and prototype-based patterns.',
    extraKeywords: ['object methods', 'property descriptor', 'shallow copy', 'deep copy', 'Object.assign', 'structuredClone'],
    difficulty: 'Intermediate',
    questionCount: '8–12',
    cheatSheet: [
      'Object.assign() shallow-copies own enumerable properties; nested objects are shared references',
      'structuredClone() is the modern deep clone API — handles nested objects and arrays',
      'Property descriptor flags: writable, enumerable, configurable',
      'Object.freeze() prevents all changes (shallow); Object.seal() prevents add/delete but allows value changes',
      'Object.keys/values/entries — own + enumerable; for...in — own + inherited + enumerable',
    ],
    interviewTips: [
      'Shallow vs deep copy is asked constantly — have structuredClone, JSON.parse(JSON.stringify()), and recursive solutions ready',
      'Demonstrate Object.defineProperty knowledge — it signals seniority',
      'Know the surprising for...in behaviour with inherited properties',
    ],
    related: [
      'javascript-prototype-interview-questions',
      'javascript-class-interview-questions',
      'javascript-array-interview-questions',
    ],
  },

  {
    slug: 'javascript-class-interview-questions',
    title: 'JavaScript Class Interview Questions',
    category: 'Objects',
    keyword: 'classes',
    description: 'ES6 classes are syntactic sugar over prototypes. Learn constructor, inheritance, private fields, static methods, and common patterns.',
    extraKeywords: ['class inheritance', 'extends', 'super', 'private fields', 'static methods', 'getter setter'],
    difficulty: 'Intermediate',
    questionCount: '5–8',
    cheatSheet: [
      'class is syntactic sugar — methods go on prototype, not instance',
      'super() must be called first in a subclass constructor before accessing this',
      'Private fields (#field) are truly private — not accessible outside the class body',
      'Static methods belong to the class, not instances — called as Class.method()',
      'Getters/setters: get prop() {} and set prop(val) {} — look like properties, behave like functions',
    ],
    interviewTips: [
      'Be ready to rewrite a class using prototype syntax — shows deep understanding',
      'Class declarations are hoisted but stay in TDZ — unlike function declarations',
      'Private fields (#) vs convention (_): # is enforced by engine; _ is just a naming convention',
    ],
    related: [
      'javascript-prototype-interview-questions',
      'javascript-this-keyword-interview-questions',
    ],
  },

  // ─── ARRAYS ───────────────────────────────────────────────────────────────

  {
    slug: 'javascript-array-interview-questions',
    title: 'JavaScript Array Interview Questions',
    category: 'Arrays',
    keyword: 'arrays',
    description: 'Array methods are asked in every JavaScript interview. Master map, filter, reduce, destructuring, and the new ES2023 immutable methods.',
    extraKeywords: ['map filter reduce', 'array destructuring', 'flat flatMap', 'array methods', 'toSorted'],
    difficulty: 'Intermediate',
    questionCount: '8–12',
    cheatSheet: [
      'Mutating: push, pop, shift, unshift, sort, reverse, splice — modify original array',
      'Non-mutating: map, filter, slice, concat, flat, flatMap — return new array',
      'ES2023: toSorted(), toReversed(), toSpliced(), with() — immutable versions',
      'reduce is the most powerful — can implement map and filter with it',
      'flat(Infinity) fully flattens; flatMap = map + flat(1) in one pass',
    ],
    interviewTips: [
      'Implement map/filter/reduce from scratch — it\'s asked at 60%+ of mid-level interviews',
      'Array.isArray() is the correct type check — typeof [] === "object" is a trap',
      'Know the difference between forEach (side effects) and map (transform + return)',
      'Shallow copy with [...arr] or arr.slice(); deep copy with structuredClone()',
    ],
    related: [
      'javascript-higher-order-functions-interview-questions',
      'javascript-destructuring-interview-questions',
      'javascript-immutability-interview-questions',
    ],
  },

  // ─── MODERN JS ────────────────────────────────────────────────────────────

  {
    slug: 'javascript-destructuring-interview-questions',
    title: 'JavaScript Destructuring Interview Questions',
    category: 'Modern JS',
    keyword: 'destructuring',
    description: 'Destructuring is essential modern JavaScript syntax used in every codebase. Master arrays, objects, defaults, renaming, and nested patterns.',
    extraKeywords: ['object destructuring', 'array destructuring', 'default values', 'rest', 'spread'],
    difficulty: 'Beginner',
    questionCount: '4–6',
    cheatSheet: [
      'Array destructuring: position-based — const [a, b] = arr',
      'Object destructuring: name-based — const { name, age } = obj',
      'Rename: const { name: userName } = obj — userName is the new variable name',
      'Default: const { city = "NYC" } = obj — used when value is undefined',
      'Rest: const { a, ...rest } = obj — rest collects remaining properties',
    ],
    interviewTips: [
      'Classic use: destructure function parameters for clean, self-documenting APIs',
      'Common gotcha: undefined triggers default, null does NOT',
      'Variable swap using array destructuring: [a, b] = [b, a]',
    ],
    related: [
      'javascript-spread-rest-interview-questions',
      'javascript-array-interview-questions',
    ],
  },

  {
    slug: 'javascript-spread-rest-interview-questions',
    title: 'JavaScript Spread & Rest Operator Interview Questions',
    category: 'Modern JS',
    keyword: 'spread rest',
    description: 'The ... operator has two uses: spread (expand) and rest (collect). Learn how each works and the common interview traps.',
    extraKeywords: ['spread operator', 'rest parameters', 'arguments object', 'object spread'],
    difficulty: 'Beginner',
    questionCount: '3–5',
    cheatSheet: [
      'Spread (in expression): expands iterable into individual elements — [...arr], fn(...args)',
      'Rest (in parameter): collects remaining arguments into a real Array — function fn(...args)',
      'Object spread (ES2018): {...obj1, ...obj2} — later properties win',
      'Spread creates SHALLOW copies — nested objects are still shared references',
      'Rest parameters are a real Array; the arguments object is array-like (no .map, .filter)',
    ],
    interviewTips: [
      '"Shallow copy" gotcha — spread does NOT deep copy nested objects',
      'Arrow functions have no arguments object — must use rest parameters instead',
      'Object spread order matters: {...defaults, ...overrides} — overrides win',
    ],
    related: [
      'javascript-destructuring-interview-questions',
      'javascript-array-interview-questions',
    ],
  },

  {
    slug: 'javascript-map-set-interview-questions',
    title: 'JavaScript Map & Set Interview Questions',
    category: 'Modern JS',
    keyword: 'Map and Set',
    description: 'Map and Set are modern alternatives to objects and arrays with key advantages. Learn when and why to use them in interviews.',
    extraKeywords: ['WeakMap', 'WeakSet', 'Map vs Object', 'Set deduplication'],
    difficulty: 'Intermediate',
    questionCount: '4–6',
    cheatSheet: [
      'Map: key-value store with ANY key type, maintains insertion order, has .size',
      'Set: unique-value collection with O(1) has(), perfect for deduplication',
      'WeakMap: object keys only, weak reference (GC can collect key), no iteration — for private metadata',
      'WeakSet: same weak reference rules, only for tracking object identity',
      'Classic Set use: [...new Set(arr)] removes duplicates from an array',
    ],
    interviewTips: [
      'Explain WHY Map > object: non-string keys, guaranteed insertion order, no prototype pollution',
      'WeakMap use case: per-object cache that doesn\'t prevent GC — shows memory awareness',
      'Set intersection/union using spread and has() is a common implementation question',
    ],
    related: [
      'javascript-object-interview-questions',
      'javascript-array-interview-questions',
    ],
  },

  {
    slug: 'javascript-proxy-reflect-interview-questions',
    title: 'JavaScript Proxy & Reflect Interview Questions',
    category: 'Modern JS',
    keyword: 'Proxy',
    description: 'Proxy and Reflect enable JavaScript metaprogramming. A senior-level topic that shows deep language knowledge.',
    extraKeywords: ['proxy traps', 'reflect', 'metaprogramming', 'vue reactivity'],
    difficulty: 'Senior',
    questionCount: '3–5',
    cheatSheet: [
      'Proxy wraps an object and intercepts operations via trap handlers (get, set, has, deleteProperty…)',
      'Always use Reflect inside traps — it handles prototype chains and receivers correctly',
      'Vue 3 uses Proxy for its reactive state system — real-world connection',
      'Reflect mirrors all Proxy trap names and signatures exactly',
      'Proxy cannot be detected — the wrapped object is indistinguishable from the proxy to consumers',
    ],
    interviewTips: [
      'Implement a validation proxy that throws on wrong types — a common implementation ask',
      'Explain the receiver parameter in get/set traps — it matters for inherited getters',
      'Negative array indexing with Proxy is a classic creative question: arr[-1] → last element',
    ],
    related: [
      'javascript-object-interview-questions',
      'javascript-generators-interview-questions',
    ],
  },

  {
    slug: 'javascript-modules-interview-questions',
    title: 'JavaScript ES Modules Interview Questions',
    category: 'Modern JS',
    keyword: 'ES modules',
    description: 'ES Modules are the official JavaScript module system. Learn import/export, dynamic imports, and how they differ from CommonJS.',
    extraKeywords: ['import export', 'CommonJS require', 'dynamic import', 'tree shaking', 'named exports'],
    difficulty: 'Intermediate',
    questionCount: '4–6',
    cheatSheet: [
      'ESM: static analysis at parse time → enables tree shaking',
      'CJS require() is dynamic (runtime) → bundlers can\'t eliminate dead code',
      'ESM bindings are LIVE — the importer sees changes; CJS copies value at require time',
      'ESM modules are always strict mode; CJS is not by default',
      'Dynamic import(): returns a Promise, enables code splitting and lazy loading',
    ],
    interviewTips: [
      'Tree shaking only works with ESM — key point for performance-focused questions',
      'Top-level await works in ESM but not CJS',
      'Dynamic imports + React.lazy = code splitting — connect to real-world performance',
    ],
    related: [
      'javascript-performance-interview-questions',
      'javascript-async-await-interview-questions',
    ],
  },

  {
    slug: 'javascript-iterator-interview-questions',
    title: 'JavaScript Iterator & Iterable Interview Questions',
    category: 'Modern JS',
    keyword: 'iterators',
    description: 'Iterators and iterables are the protocol behind for...of, spread, and destructuring. Learn to implement custom iterables.',
    extraKeywords: ['Symbol.iterator', 'iterator protocol', 'for of', 'iterable protocol'],
    difficulty: 'Advanced',
    questionCount: '3–5',
    cheatSheet: [
      'Iterable: has [Symbol.iterator]() that returns an iterator',
      'Iterator: has next() that returns { value, done }',
      'for...of, spread, and destructuring all require iterables',
      'Built-in iterables: Array, String, Map, Set, NodeList, arguments',
      '[Symbol.iterator] must return a FRESH iterator each call to be reusable',
    ],
    interviewTips: [
      'Implement a custom range iterable from scratch — common implementation question',
      'Explain why [Symbol.iterator] and the returned iterator are separate objects',
      'Connection to generators: generators automatically implement the iterator protocol',
    ],
    related: [
      'javascript-generators-interview-questions',
      'javascript-array-interview-questions',
    ],
  },

  // ─── ASYNC APIS ───────────────────────────────────────────────────────────

  {
    slug: 'javascript-error-handling-interview-questions',
    title: 'JavaScript Error Handling Interview Questions',
    category: 'Error Handling',
    keyword: 'error handling',
    description: 'Robust error handling is what separates production code from toy projects. Master try/catch, custom errors, and async error patterns.',
    extraKeywords: ['try catch finally', 'custom error', 'error propagation', 'async error'],
    difficulty: 'Intermediate',
    questionCount: '5–8',
    cheatSheet: [
      'Custom errors: class AppError extends Error — always call super(message), set this.name',
      'Re-throw: catch what you can handle; throw everything else up the stack',
      'finally always runs — use for cleanup (close connections, clear timers)',
      'async/await: throw inside async function → rejects the returned Promise',
      'Global handlers (last resort): window.addEventListener("unhandledrejection")',
    ],
    interviewTips: [
      '"Silently swallowing errors" (empty catch) is a code smell — always explain why it\'s bad',
      'Show the instanceof instanceof pattern for catching specific error types',
      'Connect error handling to logging/monitoring: Sentry, Datadog need error context',
    ],
    related: [
      'javascript-async-await-interview-questions',
      'javascript-promise-interview-questions',
    ],
  },

  // ─── PERFORMANCE ─────────────────────────────────────────────────────────

  {
    slug: 'javascript-performance-interview-questions',
    title: 'JavaScript Performance Interview Questions',
    category: 'Performance',
    keyword: 'performance',
    description: 'Performance questions test real-world engineering judgment. Learn debounce, throttle, memory leaks, and browser rendering.',
    extraKeywords: ['debounce', 'throttle', 'memory leak', 'reflow repaint', 'code splitting'],
    difficulty: 'Advanced',
    questionCount: '6–10',
    cheatSheet: [
      'Debounce: execute ONCE after a period of inactivity — search input, resize events',
      'Throttle: execute at most ONCE per interval — scroll events, button mashing',
      'Memory leaks: forgotten intervals, detached DOM nodes, closures over large objects',
      'Reflow (layout) is expensive; repaint is cheaper; CSS transforms skip both (GPU)',
      'Layout thrashing: alternating DOM reads + writes in a loop — batch reads then writes',
    ],
    interviewTips: [
      'Implement debounce and throttle from scratch — asked at 40%+ of senior interviews',
      'Describe a real memory leak you\'ve encountered or investigated',
      'Connect reflow/repaint to requestAnimationFrame and why it\'s better than setTimeout for animation',
    ],
    related: [
      'javascript-dom-interview-questions',
      'javascript-event-loop-interview-questions',
      'javascript-memory-management-interview-questions',
    ],
  },

  {
    slug: 'javascript-debounce-throttle-interview-questions',
    title: 'JavaScript Debounce & Throttle Interview Questions',
    category: 'Performance',
    keyword: 'debounce throttle',
    description: 'Debounce and throttle are the most common JavaScript performance implementation questions. Learn the difference and build both from scratch.',
    extraKeywords: ['rate limiting', 'performance optimization', 'scroll events', 'resize events'],
    difficulty: 'Intermediate',
    questionCount: '3–4',
    cheatSheet: [
      'Debounce: delays execution; resets the timer on every call — fires ONCE after silence',
      'Throttle: rate-limits execution — fires at most ONCE per interval during continuous calls',
      'Debounce: search box autocomplete, window resize callback',
      'Throttle: scroll event handlers, mousemove tracking, API rate limiting',
      'Leading edge option: fire immediately on first call, then debounce/throttle subsequent',
    ],
    interviewTips: [
      'This is almost always an implementation question — practice writing both without looking',
      'Explain the cleanup: debounce clears the previous timer; throttle stores last call time',
      'Distinguish: throttle guarantees calls at regular intervals; debounce waits for silence',
    ],
    related: [
      'javascript-performance-interview-questions',
      'javascript-closure-interview-questions',
    ],
  },

  {
    slug: 'javascript-memory-management-interview-questions',
    title: 'JavaScript Memory Management Interview Questions',
    category: 'Performance',
    keyword: 'memory management',
    description: 'Memory leaks are a senior-level interview topic. Learn garbage collection, how leaks happen, and how to detect them.',
    extraKeywords: ['garbage collection', 'memory leak', 'WeakRef', 'WeakMap', 'detached DOM'],
    difficulty: 'Senior',
    questionCount: '3–5',
    cheatSheet: [
      'Mark-and-sweep GC: marks all reachable objects from roots (globals + call stack), sweeps the rest',
      'Leak sources: forgotten setInterval, detached DOM nodes, closures over large objects, event listeners not removed',
      'WeakMap/WeakRef: hold objects without preventing GC — perfect for caches',
      'Chrome DevTools: Memory → Heap Snapshot → look for "Detached" nodes',
      'Circular references are NOT a problem for modern GC (mark-and-sweep handles it)',
    ],
    interviewTips: [
      'Describe a concrete leak scenario with code, then explain the fix',
      'WeakMap as a cache that auto-cleans when the key object is GC\'d — strong signal of seniority',
      'Connect to React: useEffect cleanup functions prevent memory leaks from listeners/timers',
    ],
    related: [
      'javascript-performance-interview-questions',
      'javascript-closure-interview-questions',
    ],
  },

  // ─── DOM & EVENTS ─────────────────────────────────────────────────────────

  {
    slug: 'javascript-dom-interview-questions',
    title: 'JavaScript DOM Interview Questions',
    category: 'DOM & Events',
    keyword: 'DOM',
    description: 'DOM manipulation is tested at every frontend interview. Master event delegation, observers, and the render pipeline.',
    extraKeywords: ['event delegation', 'querySelector', 'DOM mutation', 'MutationObserver', 'IntersectionObserver'],
    difficulty: 'Intermediate',
    questionCount: '6–10',
    cheatSheet: [
      'Event delegation: attach one listener to the parent; use e.target to identify source',
      'MutationObserver: watch DOM changes asynchronously — replaced deprecated Mutation Events',
      'IntersectionObserver: detect element visibility — for lazy loading, infinite scroll',
      'Reflow triggers: offsetWidth/Height, getBoundingClientRect, getComputedStyle',
      'script loading: defer = parallel download, execute after parse; async = parallel, execute ASAP',
    ],
    interviewTips: [
      'Event delegation is asked constantly — explain bubbling, show the parent listener pattern',
      'Senior question: how would you lazy-load 100 images efficiently? IntersectionObserver',
      'Explain why setTimeout(fn, 0) can help paint "Loading..." before heavy work starts',
    ],
    related: [
      'javascript-event-loop-interview-questions',
      'javascript-performance-interview-questions',
      'javascript-browser-apis-interview-questions',
    ],
  },

  {
    slug: 'javascript-browser-apis-interview-questions',
    title: 'JavaScript Browser API Interview Questions',
    category: 'Browser APIs',
    keyword: 'browser APIs',
    description: 'Browser APIs like Fetch, Web Workers, and Service Workers are key for modern frontend interviews. Learn them with practical examples.',
    extraKeywords: ['fetch api', 'web workers', 'service workers', 'localstorage', 'indexeddb'],
    difficulty: 'Intermediate',
    questionCount: '5–8',
    cheatSheet: [
      'Fetch only rejects on NETWORK failure — HTTP 404/500 must be caught via response.ok',
      'localStorage: same origin, all tabs, persistent; sessionStorage: tab only, cleared on close',
      'Web Workers: background JS thread — no DOM access, communicate via postMessage',
      'Service Workers: network proxy — enables offline, caching, push notifications (PWA)',
      'AbortController: cancel fetch requests — pair with timeout to prevent hanging',
    ],
    interviewTips: [
      'fetch() .ok check is the #1 most missed thing — always mention it when discussing fetch',
      'Never store auth tokens in localStorage — XSS can steal them; use HttpOnly cookies',
      'Service Worker caching strategy (cache-first vs network-first) is a senior question',
    ],
    related: [
      'javascript-promise-interview-questions',
      'javascript-dom-interview-questions',
    ],
  },

  {
    slug: 'javascript-immutability-interview-questions',
    title: 'JavaScript Immutability Interview Questions',
    category: 'Modern JS',
    keyword: 'immutability',
    description: 'Immutability is essential for React, Redux, and functional programming. Learn how to work with data without mutation.',
    extraKeywords: ['Object.freeze', 'immutable operations', 'spread copy', 'structuredClone', 'redux immutability'],
    difficulty: 'Intermediate',
    questionCount: '3–5',
    cheatSheet: [
      'Immutable update: { ...state, count: state.count + 1 } — never state.count++',
      'Object.freeze() is shallow — nested objects can still be mutated',
      'Array methods: sort, reverse, splice mutate; map, filter, slice, concat do not',
      'ES2023 toSorted(), toReversed(), with() — built-in immutable alternatives',
      'structuredClone() for true deep immutable copies of complex structures',
    ],
    interviewTips: [
      'React/Redux context: mutating state directly won\'t trigger re-renders — explain why',
      'Show the spread pattern for nested immutable updates: { ...state, user: { ...state.user, name: "new" } }',
    ],
    related: [
      'javascript-array-interview-questions',
      'javascript-object-interview-questions',
    ],
  },

  {
    slug: 'javascript-regex-interview-questions',
    title: 'JavaScript Regular Expressions Interview Questions',
    category: 'Modern JS',
    keyword: 'regular expressions',
    description: 'Regex is frequently tested in JavaScript interviews. Learn pattern syntax, flags, lookahead/lookbehind, and common pitfalls.',
    extraKeywords: ['regex patterns', 'lookahead lookbehind', 'greedy lazy', 'capturing groups', 'global flag'],
    difficulty: 'Advanced',
    questionCount: '3–5',
    cheatSheet: [
      'Flags: g (global all matches), i (case-insensitive), m (multiline), s (dotAll)',
      'Lookahead: /\\d+(?= dollars)/ — match digits followed by " dollars" (not captured)',
      'Lookbehind: /(?<=\\$)\\d+/ — match digits preceded by $ (not captured)',
      'Greedy vs lazy: .* is greedy (max match); .*? is lazy (min match)',
      'Stateful gotcha: /regex/g with .test() advances lastIndex — reset with regex.lastIndex = 0',
    ],
    interviewTips: [
      'The global flag + .test() alternating bug is a classic gotcha question',
      'Email validation regex is a classic implementation request — have a solid one ready',
      'Named capture groups: /(?<year>\\d{4})/ → match.groups.year — shows modern knowledge',
    ],
    related: [
      'javascript-type-coercion-interview-questions',
    ],
  },
]

// ─── Quick lookup helpers ─────────────────────────────────────────────────

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find(t => t.slug === slug)
}

export function getRelatedTopics(topic: Topic): Topic[] {
  return topic.related
    .map(slug => getTopicBySlug(slug))
    .filter((t): t is Topic => t !== undefined)
    .slice(0, 3)
}

export function getTopicsByCategory(category: string): Topic[] {
  return TOPICS.filter(t => t.category === category)
}
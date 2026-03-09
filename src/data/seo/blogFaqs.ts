/**
 * blogFaqs.ts
 * FAQPage schema data for blog posts.
 * These questions mirror exactly what developers ask AI tools and Google
 * about these topics — making JSPrep the cited source in AI answers.
 */

import type { FAQItem } from './topicFaqs'

export const BLOG_FAQS: Record<string, FAQItem[]> = {

  'top-50-javascript-interview-questions': [
    {
      question: 'What are the most common JavaScript interview questions?',
      answer: 'The most commonly asked JavaScript interview questions cover closures, the event loop, prototypal inheritance, the this keyword, promises and async/await, var/let/const differences, hoisting, type coercion, and ES6+ features like destructuring and arrow functions. Most interviews focus on understanding fundamentals deeply rather than API memorization.',
    },
    {
      question: 'How do I prepare for a JavaScript technical interview?',
      answer: 'Focus on core concepts rather than syntax memorization: understand closures, execution context, the prototype chain, the event loop, and async JavaScript deeply. Practice output prediction questions to build a mental execution model. Be able to implement common patterns like debounce, deep clone, and Promise.all from scratch.',
    },
    {
      question: 'What is the difference between == and === in JavaScript?',
      answer: 'Strict equality (===) compares both type and value without any conversion. Loose equality (==) performs type coercion before comparison. 0 == false is true, null == undefined is true, but 0 === false is false. Always use === in production code to avoid unexpected coercion behavior.',
    },
    {
      question: 'What is a closure in JavaScript and why is it asked in interviews?',
      answer: 'A closure is a function that retains access to variables from its outer scope after the outer function has returned. It is heavily tested because it is the mechanism behind private state, memoization, function factories, and event handlers that remember context. Understanding closures reveals whether a candidate truly understands JavaScript\'s execution model.',
    },
    {
      question: 'What JavaScript topics do FAANG companies focus on?',
      answer: 'FAANG and top-tier tech interviews typically focus on async JavaScript (promises, event loop, async/await), closures and scope, prototypal inheritance, the this keyword, performance optimization, and practical implementations like debounce, throttle, deep clone, and custom event emitters.',
    },
  ],

  'javascript-promises-async-await': [
    {
      question: 'What is the difference between Promises and async/await?',
      answer: 'They are the same mechanism — async/await is syntactic sugar over Promises. An async function always returns a Promise. await pauses the async function until a Promise settles. The difference is readability: async/await reads like synchronous code while Promise chains use .then()/.catch(). Both compile to the same microtask-based execution.',
    },
    {
      question: 'Why does a Promise callback run before setTimeout?',
      answer: 'Promise callbacks are microtasks and setTimeout callbacks are macrotasks. After any task completes, the event loop drains the entire microtask queue before running any macrotask. So even setTimeout(fn, 0) always fires after all pending Promise callbacks, regardless of when they were created.',
    },
    {
      question: 'What is Promise.all and when should you use it?',
      answer: 'Promise.all takes an array of Promises, runs them in parallel, and resolves with an array of their values in input order. It rejects immediately if any Promise rejects. Use it when you have multiple independent async operations that should all complete before proceeding — like fetching users, posts, and settings simultaneously.',
    },
    {
      question: 'How do you handle errors in async/await?',
      answer: 'Use try/catch blocks around await expressions. A rejected Promise inside an async function throws like a synchronous error and is caught by the enclosing catch block. Always catch at the level where you can meaningfully respond — do not wrap every function in try/catch, let errors propagate to where they can be handled.',
    },
    {
      question: 'What is sequential vs parallel await and why does it matter?',
      answer: 'Sequential await executes one operation at a time: total time equals the sum of all operations. Parallel await uses Promise.all to start all operations simultaneously: total time equals the slowest single operation. For three 300ms operations, sequential takes 900ms while parallel takes 300ms — a 3x difference with one code change.',
    },
  ],

  'javascript-output-questions': [
    {
      question: 'What are JavaScript output questions?',
      answer: 'Output questions ask you to predict what a code snippet will log to the console. They test whether you have an accurate mental model of JavaScript execution — covering hoisting, closures, the this keyword, async execution order, type coercion, and prototype lookup. They are standard in frontend interviews because they reveal depth of understanding, not just syntax knowledge.',
    },
    {
      question: 'What does the var loop closure bug output?',
      answer: 'for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) } outputs 3, 3, 3. All callbacks share the same var i because var is function-scoped. By the time any callback fires, the loop has completed and i is 3. Using let instead outputs 0, 1, 2 because let creates a new binding per iteration.',
    },
    {
      question: 'What is the output of mixing Promise and setTimeout?',
      answer: 'console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4) outputs 1, 4, 3, 2. Sync code runs first (1, 4), then microtasks (Promise → 3), then macrotasks (setTimeout → 2). Knowing this requires understanding the event loop\'s microtask-before-macrotask rule.',
    },
    {
      question: 'Why does [1,2,3].map(parseInt) return [1, NaN, NaN]?',
      answer: 'Array.map passes three arguments to its callback: value, index, and array. parseInt accepts two: string and radix. So the calls become parseInt(1,0), parseInt(2,1), parseInt(3,2). Radix 0 is treated as 10 (returns 1). Radix 1 is invalid (returns NaN). "3" in base 2 only allows digits 0 and 1, so "3" is invalid (returns NaN).',
    },
  ],

  'javascript-closures-interview': [
    {
      question: 'What is a closure in JavaScript?',
      answer: 'A closure is a function bundled with a reference to its lexical environment — the variables that were in scope when the function was created. The function retains access to those variables even after the outer function has returned and its call stack frame is gone. This happens automatically whenever an inner function references a variable from an enclosing scope.',
    },
    {
      question: 'What is the difference between closure and scope?',
      answer: 'Scope is the set of variables accessible at a given point in code at execution time. A closure is the mechanism by which a function preserves its scope — carrying a reference to the environment it was defined in. Scope describes what is visible; a closure is a function that keeps its scope alive beyond the lifetime of the function that created it.',
    },
    {
      question: 'How are closures used for private state in JavaScript?',
      answer: 'By defining variables in an outer function and returning inner functions that access them, you create genuinely private state. The inner functions can read and modify the variables, but outside code has no access — there is no property to access, no prototype chain to walk. This is the foundation of the module pattern and factory functions.',
    },
    {
      question: 'Do closures cause memory leaks?',
      answer: 'Closures cause memory leaks only when they reference large objects and the closure itself is kept alive longer than needed — attached to event listeners, global variables, or long-lived caches. The fix is to extract only the values the closure needs rather than closing over entire objects, and to remove closure-holding references when done.',
    },
  ],

  'javascript-event-loop-explained': [
    {
      question: 'What is the JavaScript event loop?',
      answer: 'The event loop is the mechanism that enables asynchronous behavior in single-threaded JavaScript. It continuously monitors the call stack and task queues. When the call stack empties, it first drains all microtasks (Promise callbacks), then executes one macrotask (setTimeout callback, I/O event), then checks for rendering, then repeats.',
    },
    {
      question: 'What is the difference between the microtask queue and macrotask queue?',
      answer: 'The microtask queue holds high-priority callbacks from Promises, queueMicrotask(), and MutationObserver. The macrotask queue holds lower-priority callbacks from setTimeout, setInterval, I/O events, and user interactions. After each task, the entire microtask queue is fully drained before any macrotask runs. This means all Promise callbacks execute before any setTimeout callback.',
    },
    {
      question: 'How does JavaScript handle asynchronous code if it is single-threaded?',
      answer: 'JavaScript offloads async operations to the browser or Node.js runtime — network requests, timers, and I/O run in separate system threads outside JavaScript. When they complete, their callbacks are placed in the appropriate queue. The event loop picks up these callbacks only when the call stack is empty, creating the appearance of concurrent execution on one thread.',
    },
    {
      question: 'What happens when you block the event loop?',
      answer: 'If synchronous JavaScript runs for too long, the call stack stays occupied and the event loop cannot process any callbacks, events, or render frames. In a browser this freezes the UI completely. In Node.js it prevents handling incoming requests. Long tasks should be broken into chunks using setTimeout(fn, 0) to yield between chunks, or moved to a Web Worker.',
    },
  ],

  'javascript-hoisting-explained': [
    {
      question: 'What is hoisting in JavaScript?',
      answer: 'Hoisting is the behavior where JavaScript processes all declarations in a scope before executing any code. var declarations are initialized to undefined. Function declarations are fully available. let and const are registered but placed in the Temporal Dead Zone until their declaration line. No code actually moves — the engine simply sets up the environment first.',
    },
    {
      question: 'What is the Temporal Dead Zone?',
      answer: 'The Temporal Dead Zone (TDZ) is the period from the start of a block scope to the let or const declaration line. During this period, the variable is registered but cannot be read or written — accessing it throws a ReferenceError. The TDZ makes use-before-declaration bugs immediately visible rather than silently returning undefined as var does.',
    },
    {
      question: 'Are function expressions hoisted in JavaScript?',
      answer: 'Function expressions are not fully hoisted. Only the variable declaration is hoisted (as undefined for var, or in the TDZ for let/const). The function assignment does not happen until that line executes. This is why calling a function expression before its assignment throws a TypeError (not a function) rather than working like a function declaration.',
    },
  ],

  'javascript-scope-explained': [
    {
      question: 'What is scope in JavaScript?',
      answer: 'Scope is the context that determines which variables are accessible at any point in your code. JavaScript uses lexical scope — a function\'s accessible variables are determined by where it was written in the source code, not where it is called from. Variables are looked up through a chain of nested scopes from innermost to the global scope.',
    },
    {
      question: 'What is the difference between global, function, and block scope?',
      answer: 'Global scope contains variables accessible everywhere. Function scope contains variables declared inside a function with var, accessible throughout that function. Block scope contains variables declared with let or const, accessible only within the nearest curly braces. var ignores blocks; let and const respect them.',
    },
    {
      question: 'What is variable shadowing in JavaScript?',
      answer: 'Variable shadowing occurs when an inner scope declares a variable with the same name as an outer scope variable. Within the inner scope, the inner variable takes precedence and the outer one is inaccessible. The outer variable is not modified — it still exists and is accessible in scopes where the inner declaration does not exist.',
    },
  ],

  'javascript-modern-es6-features': [
    {
      question: 'What are the most important ES6 features in JavaScript?',
      answer: 'The most impactful ES6 features are let/const (block scope), arrow functions (lexical this), destructuring, template literals, spread/rest operators, classes, Promises, and ES modules. Post-ES6 additions that are equally important: async/await (ES2017), optional chaining and nullish coalescing (ES2020), and private class fields (ES2022).',
    },
    {
      question: 'What is the difference between let, const, and var?',
      answer: 'var is function-scoped and hoisted with undefined. let is block-scoped and in the TDZ until declaration. const is block-scoped like let but cannot be reassigned. const does not prevent mutation of object or array contents — only reassignment of the binding. Use const by default, let when reassignment is needed, never var in new code.',
    },
    {
      question: 'What are optional chaining and nullish coalescing?',
      answer: 'Optional chaining (?.) safely navigates nested properties, returning undefined instead of throwing if any step is null or undefined. Nullish coalescing (??) provides a default value only when the left side is null or undefined — unlike || which triggers on any falsy value including 0 and empty string. Both were introduced in ES2020.',
    },
    {
      question: 'What is the difference between ES modules and CommonJS?',
      answer: 'ES modules (import/export) are the standardized module format — statically analyzed, supporting tree shaking, and loading asynchronously. CommonJS (require/module.exports) is Node.js\'s original module system — dynamic, synchronous, and not statically analyzable. Modern Node.js supports both, but ES modules are preferred in new code.',
    },
  ],

  'javascript-error-handling-guide': [
    {
      question: 'How do you handle errors properly in JavaScript?',
      answer: 'Use custom error classes extending Error for different error categories, catch errors only where you can meaningfully respond, always re-throw errors you cannot handle, never silently swallow exceptions, and use global error handlers as a safety net. For async code, use try/catch with await or .catch() on Promise chains.',
    },
    {
      question: 'What is the difference between throwing an Error object vs a string?',
      answer: 'Throwing an Error object (throw new Error("message")) automatically captures a stack trace, which is essential for debugging. Throwing a string (throw "message") gives you nothing but the string — no file, no line number, no call chain. Always throw Error objects or classes that extend Error.',
    },
    {
      question: 'How does error handling work with async/await?',
      answer: 'Inside async functions, rejected Promises behave like thrown errors. Wrap await expressions in try/catch to catch rejections. The catch block receives the rejection reason as the error. Without try/catch, rejected Promises propagate to the caller. Use Promise.allSettled when you want to handle independent operations that can partially fail.',
    },
    {
      question: 'What is the error cause pattern in JavaScript?',
      answer: 'ES2022 added the cause option to Error: throw new Error("Operation failed", { cause: originalError }). This chains errors while preserving the original, enabling you to add context at each level without losing the root cause. Access it via err.cause. It is the standard way to wrap errors as they propagate through layers.',
    },
  ],

  'javascript-performance-optimization': [
    {
      question: 'How do you optimize JavaScript performance?',
      answer: 'Start by measuring with Chrome DevTools Performance tab to identify actual bottlenecks. Key optimizations: break long synchronous tasks into chunks, batch DOM reads before writes to avoid layout thrashing, use debounce/throttle for high-frequency events, memoize expensive pure functions, implement code splitting to reduce initial bundle size, and use Web Workers for CPU-intensive work.',
    },
    {
      question: 'What is layout thrashing in JavaScript?',
      answer: 'Layout thrashing is repeatedly alternating between reading layout properties (offsetWidth, getBoundingClientRect) that force synchronous layout calculations and writing to the DOM that invalidates those calculations. Each read-after-write forces a full recalculation. Fix by batching all reads first, then all writes, or use requestAnimationFrame to schedule DOM work.',
    },
    {
      question: 'What is the difference between debounce and throttle?',
      answer: 'Debounce waits until N milliseconds of silence after the last call — ideal for search inputs and resize events where you only care about the final state. Throttle limits execution to once per N milliseconds regardless of call rate — ideal for scroll handlers and real-time updates where you want regular periodic execution.',
    },
    {
      question: 'How do Web Workers improve JavaScript performance?',
      answer: 'Web Workers run JavaScript on a separate background thread, completely separate from the main thread. This allows CPU-intensive work — data processing, image manipulation, complex calculations — to run without blocking the UI. Communication between the main thread and workers uses postMessage/onmessage with structured clone for data transfer.',
    },
  ],

  'javascript-prototypes-explained': [
    {
      question: 'How does prototypal inheritance work in JavaScript?',
      answer: 'Every JavaScript object has an internal [[Prototype]] link to another object. When you access a property that does not exist on the object, JavaScript follows this link to the prototype and looks there, continuing up the chain until the property is found or null is reached. Methods like array.push() exist on Array.prototype and are found through this lookup, not copied to each array.',
    },
    {
      question: 'What is the difference between prototypal and classical inheritance?',
      answer: 'Classical inheritance (Java, C++) has classes as blueprints that create copies of their behavior in each instance. Prototypal inheritance (JavaScript) has objects that delegate to other objects through a live chain — no copying, just lookup at access time. ES6 classes are syntax over prototypal inheritance, not a new system.',
    },
    {
      question: 'What does instanceof check in JavaScript?',
      answer: 'instanceof checks whether the constructor\'s prototype property appears anywhere in the object\'s prototype chain. new Dog() instanceof Animal is true if Animal.prototype is anywhere in the Dog instance\'s prototype chain — not just if Animal directly constructed the object. It does not check the constructor function itself.',
    },
    {
      question: 'What is Object.create() used for?',
      answer: 'Object.create(proto) creates a new object with proto as its [[Prototype]] without needing a constructor function. Object.create(null) creates an object with no prototype at all — safe for use as a pure dictionary since there are no inherited properties to collide with data keys.',
    },
  ],

  'javascript-this-keyword-explained': [
    {
      question: 'How does the this keyword work in JavaScript?',
      answer: 'this is determined by how a function is called, not where it is defined. Five rules apply in priority order: new binding (this is the new object), explicit binding via call/apply/bind (this is the argument), implicit binding on method calls (this is the object before the dot), arrow functions (this inherited from lexical scope), and default binding (undefined in strict mode, global in sloppy).',
    },
    {
      question: 'Why does this become undefined inside a callback?',
      answer: 'When a method is passed as a callback or assigned to a variable, it loses its implicit binding to the object. The function is called standalone, triggering default binding — undefined in strict mode. Fix with an arrow function wrapper (() => obj.method()), .bind(obj), or by calling as a method directly.',
    },
    {
      question: 'What is the difference between call, apply, and bind?',
      answer: 'All three explicitly set this. call(ctx, arg1, arg2) invokes immediately with individual arguments. apply(ctx, [arg1, arg2]) invokes immediately with an arguments array. bind(ctx) returns a new permanently-bound function without invoking it. Use call/apply for one-off invocations with custom this, bind for callbacks that need stable this.',
    },
    {
      question: 'Why do arrow functions not work as object methods?',
      answer: 'Arrow functions inherit this from the lexical scope where they are defined — for object literals, that is the surrounding scope (often global or undefined in strict mode), not the object itself. An arrow method cannot refer to the object through this. Use regular function syntax for object methods that need to access the object via this.',
    },
  ],

}
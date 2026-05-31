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

export const REACT_BLOG_FAQS: Record<string, FAQItem[]> = {

  'top-50-react-interview-questions': [
    {
      question: 'What are the most common React interview questions?',
      answer: 'The most frequently asked React interview questions cover hooks (useState, useEffect, useMemo, useCallback), the Virtual DOM and reconciliation, component lifecycle, controlled vs uncontrolled components, Context API vs Redux, performance optimization with React.memo, error boundaries, code splitting with React.lazy, and React Server Components. Most interviewers prioritize depth of understanding over memorizing every API.',
    },
    {
      question: 'What React hooks questions are asked in frontend interviews?',
      answer: 'Interviewers commonly ask the difference between useMemo and useCallback, when to use useReducer over useState, why hooks cannot be called conditionally, how to avoid stale closures in useEffect, and what the cleanup function does. Senior-level interviews add questions about useTransition, useDeferredValue, and useImperativeHandle.',
    },
    {
      question: 'What is the difference between React class and function components?',
      answer: 'Function components are plain JavaScript functions that accept props and return JSX. Class components extend React.Component, use this.state and this.setState, and implement lifecycle methods. Since hooks were introduced in React 16.8, function components can do everything class components can — and are the modern standard. New code should always use function components.',
    },
    {
      question: 'How do I prepare for a React technical interview?',
      answer: 'Focus on hooks deeply — especially useEffect dependency arrays, stale closures, and cleanup functions. Understand the reconciliation process well enough to explain why keys matter. Practice memoization trade-offs (when React.memo helps vs hurts). Be able to discuss state management choices — useState vs useReducer vs Context vs Zustand. Then practice output and behavior questions to build your mental execution model.',
    },
    {
      question: 'What React topics do top tech companies focus on?',
      answer: 'Senior React interviews at product companies focus on performance optimization (rendering behavior, memoization, code splitting), state management architecture (Context, Redux, React Query), concurrent features (Suspense, useTransition), and design patterns (HOCs, compound components, render props vs custom hooks). Foundational hook questions are almost always included at every level.',
    },
  ],

  'react-hooks-explained': [
    {
      question: 'What are React hooks and why were they introduced?',
      answer: 'React hooks are functions (useState, useEffect, etc.) that let function components manage state and lifecycle behavior. They were introduced in React 16.8 to solve three problems with class components: no way to reuse stateful logic between components, lifecycle methods that forced unrelated code together, and class syntax confusing this binding. Hooks enable stateful logic in plain functions without any class boilerplate.',
    },
    {
      question: 'What are the rules of hooks in React?',
      answer: 'There are two rules: first, only call hooks at the top level of a function — never inside loops, conditions, or nested functions. Second, only call hooks from React function components or custom hooks. These rules exist because React tracks hooks by their call order, not by name. If a hook runs conditionally, the order changes between renders and React maps state to the wrong hook.',
    },
    {
      question: 'What is the difference between useState and useRef in React?',
      answer: 'useState holds a value and causes a re-render whenever the setter is called. useRef holds a value in a mutable .current property and does not cause re-renders when changed. Use useState for anything that affects what the UI displays. Use useRef for values that need to persist across renders without triggering re-renders — like timer IDs, previous values, or direct DOM node references.',
    },
    {
      question: 'Can you call hooks inside a condition in React?',
      answer: 'No. Hooks must always be called in the same order on every render. Placing a hook inside an if statement means it may not run on some renders, changing the order of all subsequent hooks. React will misassociate state with the wrong hook and throw an error. Instead, call all hooks unconditionally and handle the condition inside the hook or after the call.',
    },
    {
      question: 'What are custom hooks in React?',
      answer: 'Custom hooks are functions whose names start with "use" and that call other hooks internally. They let you extract and share stateful logic between components without changing component hierarchy — no wrapper components needed. Examples include useFetch (data fetching logic), useDebounce (delayed value updates), and useLocalStorage (syncing state with localStorage). Any reusable logic that uses hooks belongs in a custom hook.',
    },
  ],

  'react-useeffect-complete-guide': [
    {
      question: 'What does useEffect do in React?',
      answer: 'useEffect lets you synchronize a component with external systems — running code after React has painted the DOM. Common uses include data fetching, setting up subscriptions, adding event listeners, and updating document.title. It runs after render by default. The dependency array controls when it re-runs, and the optional cleanup function handles teardown when the component unmounts or before the next effect fires.',
    },
    {
      question: 'What is the useEffect dependency array and how does it work?',
      answer: 'The dependency array is the second argument to useEffect. With no array, the effect runs after every render. With an empty array [], it runs once after the initial mount. With [dep1, dep2], it runs after mount and then re-runs whenever dep1 or dep2 changes. Every reactive value used inside the effect (state, props, context) must be included in the array — the ESLint exhaustive-deps rule enforces this.',
    },
    {
      question: 'Why does my useEffect cause an infinite loop?',
      answer: 'An infinite loop happens when a dependency changes inside the effect, triggering the effect to re-run. The most common cause is an object or array dependency: {} === {} is false, so a new object literal in the dependency array is "different" on every render, causing the effect to fire forever. Fix by destructuring to primitive values, memoizing the object with useMemo, or restructuring the state.',
    },
    {
      question: 'What is the useEffect cleanup function and when does it run?',
      answer: 'The cleanup function is the function returned from useEffect. It runs in two situations: before the component unmounts, and before the next effect fires when dependencies change. Use it to cancel timers, abort fetch requests, remove event listeners, and close subscriptions. Forgetting cleanup is the primary cause of memory leaks and stale callbacks in React components.',
    },
    {
      question: 'How do you fetch data with useEffect correctly?',
      answer: 'Create an AbortController inside the effect, pass its signal to fetch, and abort it in the cleanup function. Also track a "cancelled" boolean to ignore responses that arrive after a dependency change. Always check if the component is still mounted before calling setState. For anything beyond basic fetching, use React Query or SWR — they handle caching, deduplication, and race conditions automatically.',
    },
  ],

  'react-usememo-usecallback-performance': [
    {
      question: 'What is the difference between useMemo and useCallback in React?',
      answer: 'useMemo(fn, deps) memoizes the return value of fn — use it to avoid recomputing expensive derived data. useCallback(fn, deps) memoizes the fn itself — use it to stabilize function references passed to memoized child components. useCallback(fn, deps) is exactly equivalent to useMemo(() => fn, deps). Both only help when the child receiving the value is wrapped with React.memo.',
    },
    {
      question: 'What is referential equality and why does it matter in React?',
      answer: 'Referential equality means two values are the same object in memory, not just structurally identical. In JavaScript, {} === {} is false — two objects with identical contents are different references. React uses referential equality for prop comparison in React.memo and for dependency checking in hooks. Every render creates new function and object literals, which look "new" to React even if the data inside is identical.',
    },
    {
      question: 'When should you use React.memo?',
      answer: 'Use React.memo when a component re-renders often, its parent re-renders frequently for unrelated reasons, and the component is expensive to render. For React.memo to work, all props must be passed as stable references — primitive values are fine, but objects and functions need useMemo and useCallback respectively. Profile with React DevTools before adding memo — premature memoization adds overhead.',
    },
    {
      question: 'Should every component use useMemo and useCallback?',
      answer: 'No. Adding memoization everywhere is a common over-optimization that actually slows down small, simple components by adding comparison overhead on every render. The correct approach is to profile first with React DevTools Profiler, identify which components actually re-render unnecessarily and cause visible lag, and only then apply React.memo, useMemo, and useCallback where the profiler shows measurable benefit.',
    },
  ],

  'react-component-lifecycle-hooks': [
    {
      question: 'What are the three phases of a React component lifecycle?',
      answer: 'Mounting is when the component is created and inserted into the DOM for the first time. Updating happens when props or state change, causing a re-render. Unmounting is when the component is removed from the DOM. Every React component — whether class or function — goes through these same three phases. The phases determine which lifecycle methods or hook equivalents apply.',
    },
    {
      question: 'What is the hooks equivalent of componentDidMount?',
      answer: 'useEffect with an empty dependency array — useEffect(() => { ... }, []) — runs exactly once after the component is inserted into the DOM, equivalent to componentDidMount. The cleanup function returned from this effect runs on unmount, equivalent to componentWillUnmount. useEffect(() => { ... }, [dep]) with dependencies is equivalent to componentDidUpdate filtered to specific values.',
    },
    {
      question: 'Why were componentWillMount, componentWillReceiveProps, and componentWillUpdate deprecated?',
      answer: 'These methods were renamed with the UNSAFE_ prefix because React\'s concurrent rendering can pause, restart, and run a render multiple times before committing. Any side effect in these methods — data fetching, subscriptions, setState calls — would fire multiple times unintentionally. The safe alternatives are: componentDidMount for initial setup, getDerivedStateFromProps for state derived from props, and useEffect for side effects after render.',
    },
    {
      question: 'What is the difference between useEffect and useLayoutEffect?',
      answer: 'useEffect fires asynchronously after the browser has painted the screen — it does not block the visual update. useLayoutEffect fires synchronously after all DOM mutations but before the browser paints. Use useLayoutEffect only when you need to measure a DOM node or make DOM changes that must be visible without a flash — for example, reading element height before an animation. Default to useEffect in all other cases.',
    },
  ],

  'react-state-management-2025': [
    {
      question: 'When should you use useReducer instead of useState in React?',
      answer: 'Switch to useReducer when: the next state depends on the current state and an action type, multiple state fields always update together, state transitions are complex enough that naming the action type clarifies intent, or you want to unit-test update logic separately from the component. For simple, independent values like a toggle or input, useState is cleaner and sufficient.',
    },
    {
      question: 'What is the difference between Context API and Redux in React?',
      answer: 'Context is built into React and broadcasts a single value to all consuming components — simple, zero-dependency, best for low-frequency global state like current user and theme. Redux provides a normalized store with fine-grained subscriptions (components only re-render when their specific slice changes), middleware support, and time-travel DevTools — best for large apps with many developers and complex state interactions.',
    },
    {
      question: 'What is the Context re-render problem in React?',
      answer: 'Every component that calls useContext re-renders when the context value changes, regardless of which part of the value they use. If the Provider creates the value object inline (value={{ user, setUser }}), a new object reference is made on every parent render — causing all consumers to re-render unnecessarily. Fix by wrapping the value in useMemo and splitting one large context into multiple smaller contexts organized by update frequency.',
    },
    {
      question: 'What is React Query used for?',
      answer: 'React Query manages server state — data that lives on a remote server and must be fetched, cached, synchronized, and potentially refreshed. It handles loading and error states, deduplicates in-flight requests, caches responses with a configurable stale time, and automatically refreshes stale data when the window regains focus. It replaces useState + useEffect data fetching patterns with a declarative, cache-aware approach.',
    },
    {
      question: 'What is Zustand and when should you use it?',
      answer: 'Zustand is a minimal React state management library — a global store with component-level subscriptions and no boilerplate. Components subscribe to slices of the store and only re-render when their subscribed slice changes, which solves the Context re-render problem. Use it when Context becomes unwieldy but Redux feels over-engineered — medium-to-large apps that want external state management without Redux\'s ceremony.',
    },
  ],

  'react-virtual-dom-reconciliation': [
    {
      question: 'What is the Virtual DOM in React?',
      answer: 'The Virtual DOM is a lightweight JavaScript object tree representing the UI structure. React maintains a current tree and a work-in-progress tree. When state changes, React builds a new tree and diffs it against the current one to find the minimum set of changes needed. Only those changes are applied to the real DOM. Comparing JS objects is far faster than querying and modifying the actual DOM.',
    },
    {
      question: 'How does React\'s reconciliation algorithm work?',
      answer: 'React uses two heuristics to keep reconciliation O(n). First, if two elements have different types, React destroys the old tree entirely and builds a new one. Second, elements in lists with stable keys are matched across renders by key, not position. React then recursively diffs matched elements\' props and updates only what changed. The Fiber reconciler makes this work interruptible for concurrent features.',
    },
    {
      question: 'Why should you not use array index as a React key?',
      answer: 'When a list is reordered, filtered, or has items removed, the item at index 0 changes — but React sees key=0 and assumes it\'s the same item. This causes React to incorrectly update existing components instead of moving them, resulting in mismatched input values, lost focus, and broken animations. Use a stable unique ID from the data — never the position in the array.',
    },
    {
      question: 'What is React Fiber?',
      answer: 'React Fiber is the reconciler engine introduced in React 16 that reimplements reconciliation as a linked list of small work units called fibers, one per component. Unlike the previous recursive algorithm that couldn\'t be interrupted, Fiber allows React to pause reconciliation, prioritize urgent updates (user input), and resume lower-priority work later. Fiber is what enables useTransition, useDeferredValue, and Suspense for data fetching.',
    },
  ],

  'react-context-api-vs-redux': [
    {
      question: 'Should I use Context API or Redux for React state management?',
      answer: 'Use Context for simple global state that changes infrequently — current user, theme, locale, feature flags. Use Redux Toolkit when you have many interconnected state slices, need time-travel debugging via DevTools, need middleware for async flows, or work in a large team that benefits from strict conventions. Zustand is a good middle ground: Redux-like subscriptions without the boilerplate.',
    },
    {
      question: 'What are the limitations of React Context for state management?',
      answer: 'Context has three main limitations. First, every useContext consumer re-renders when the value changes — even if the component only uses a part of the value. Second, there is no built-in middleware or async handling; you manage all side effects manually. Third, there are no DevTools for inspecting Context state or replaying updates. These limitations make Context unsuitable as a general-purpose state management solution in large apps.',
    },
    {
      question: 'What is Redux Toolkit and how is it different from original Redux?',
      answer: 'Redux Toolkit (RTK) is the official recommended way to write Redux in 2025. It eliminates the main pain points of original Redux: no need for hand-written action type constants, reducers now use Immer so you can write mutations directly, configureStore sets up middleware automatically, and createAsyncThunk handles async operations cleanly. RTK reduces Redux boilerplate by roughly 70% compared to original Redux patterns.',
    },
    {
      question: 'What are Zustand and Jotai?',
      answer: 'Zustand is a lightweight store where components subscribe to specific slices — only re-rendering when that slice changes. It has minimal API and no Provider required. Jotai uses an atomic model: state is divided into tiny independent atoms, and components subscribe to individual atoms. Both solve the Context re-render problem with less ceremony than Redux. Zustand is better for global stores; Jotai is better for loosely related independent values.',
    },
  ],

  'react-common-mistakes': [
    {
      question: 'What is the most common React performance mistake?',
      answer: 'Defining components inside another component\'s render function is one of the most damaging mistakes. Every parent render creates a completely new function reference for the inner component, so React treats it as a different component type on each render — unmounting the old instance and mounting a new one from scratch. All state inside the inner component is destroyed on every parent re-render. Always define components at module scope.',
    },
    {
      question: 'Why must you not mutate state directly in React?',
      answer: 'React detects state changes using reference equality — it compares the new state reference with the previous one. If you mutate the existing object or array and pass the same reference back to setState, React sees no change and does not re-render the component. The UI shows stale data. Always return a new array or object — use spread syntax, Array.map, or Array.filter to produce new references.',
    },
    {
      question: 'What causes an infinite loop in a React component?',
      answer: 'The most common causes are: calling setState unconditionally inside useEffect without a dependency array (state change → re-render → effect fires → setState → repeat), using an object or array as a useEffect dependency (new reference every render triggers the effect every render), or calling setState inside componentDidUpdate without comparing prevProps or prevState. Fix by checking dependencies carefully and using functional state updates.',
    },
    {
      question: 'What is the stale closure problem in React hooks?',
      answer: 'A stale closure happens when a hook\'s callback captures a variable from an earlier render and that variable has since changed. The most common case: useEffect with an empty dependency array captures the initial value of a state variable, and the interval or event handler inside always operates on that initial value. Fix with functional state updates (setCount(prev => prev + 1)) or by including the variable in the dependency array.',
    },
    {
      question: 'What is the problem with using derived state in useState?',
      answer: 'Storing derived data — values that can be computed from existing state or props — in a separate useState creates two sources of truth that can get out of sync. Any time the source data changes, you must remember to update the derived state too, usually via a useEffect, which adds a render cycle lag. The fix is to compute derived values directly during render: const filtered = items.filter(i => i.active). Use useMemo if the computation is expensive.',
    },
  ],

  'react-output-questions': [
    {
      question: 'Why does calling setState multiple times in one handler not increment correctly?',
      answer: 'Multiple calls like setCount(count + 1) all read the same stale count from the current render\'s closure. All three schedule "set to count + 1" with the same original value — resulting in only a +1 increment, not +3. Fix with functional updates: setCount(prev => prev + 1) on each call. The functional form receives the latest queued value as its argument, so three calls correctly produce +3.',
    },
    {
      question: 'Why does useEffect not see the latest state value?',
      answer: 'When useEffect has an empty or incomplete dependency array, the closure inside the effect captures state values from the render in which it was created. As state updates over time, the closure holds a stale copy. This is the stale closure problem. Fix by including the state variable in the dependency array, or use a functional update (setState(prev => ...)) so the effect does not need to read the current value at all.',
    },
    {
      question: 'When does a React child component re-render?',
      answer: 'A child component re-renders whenever its parent re-renders — regardless of whether the child\'s props actually changed. React re-renders the entire subtree by default. To prevent this, wrap the child in React.memo, which performs a shallow prop comparison and skips re-rendering if nothing changed. For React.memo to be effective, props passed from the parent must be stable — primitives are fine; objects and functions need useMemo and useCallback.',
    },
    {
      question: 'What happens when you change a React key prop?',
      answer: 'Changing the key prop tells React that this is a completely different component instance. React unmounts the old component (destroying all its state, refs, and effects) and mounts a brand new one. This is intentionally used to reset a component — for example, passing key={userId} to a form component to reset it whenever the user changes, without needing to lift all the form state up to the parent.',
    },
  ],

}
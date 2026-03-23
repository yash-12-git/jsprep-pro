/**
 * topicFaqs.ts
 * Rich FAQ data for every topic page — used to inject FAQPage schema.
 * These are the exact questions developers ask ChatGPT, Perplexity, and Google.
 * Each answer is 2-4 sentences: direct, correct, and citable by AI.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export const TOPIC_FAQS: Record<string, FAQItem[]> = {
  "javascript-closure-interview-questions": [
    {
      question: "What is a closure in JavaScript?",
      answer:
        'A closure is a function that retains access to the variables from its outer lexical scope even after the outer function has returned. The inner function "closes over" those variables, keeping them alive in memory as long as the closure itself exists. Closures are used for data privacy, function factories, memoization, and event handlers that need to remember state.',
    },
    {
      question: "How do closures work in JavaScript?",
      answer:
        "When a function is created, it captures a reference to the scope it was defined in. If that function accesses a variable from the enclosing scope, JavaScript keeps that variable in memory even after the enclosing function returns. The variable persists as long as the closure function itself is reachable.",
    },
    {
      question: "What is the classic closure loop bug in JavaScript?",
      answer:
        "When using var in a for loop with asynchronous callbacks like setTimeout, all callbacks share the same var variable. By the time the callbacks fire, the loop has finished and the variable holds its final value. The fix is to use let, which creates a new binding per iteration, or to use an IIFE to capture the current value.",
    },
    {
      question: "What is the difference between a closure and a scope?",
      answer:
        "Scope is the set of variables accessible at a given point in code at runtime. A closure is a function that preserves access to its defining scope even after that scope has finished executing. Scope describes visibility rules; a closure is a function that carries its scope with it.",
    },
    {
      question: "Can closures cause memory leaks in JavaScript?",
      answer:
        "Yes. If a closure references a large object and the closure itself is long-lived — attached to an event listener, a global variable, or a module-level cache — the referenced objects are never garbage collected. The fix is to extract only the data the closure needs, and to remove closure-holding references (like event listeners) when they are no longer needed.",
    },
    {
      question: "What are practical use cases for closures?",
      answer:
        "Closures are used for private state encapsulation (counter factories, bank accounts), memoization (caching function results), partial application and currying, event handlers that need to remember context, and the module pattern where private variables are shared only with exported functions.",
    },
  ],

  "javascript-hoisting-interview-questions": [
    {
      question: "What is hoisting in JavaScript?",
      answer:
        "Hoisting is the behavior where JavaScript processes declarations before executing code. var declarations are registered and initialized to undefined before any code runs. Function declarations are fully hoisted with their body. let and const are hoisted but remain in the Temporal Dead Zone until their declaration line is reached. Nothing in the source code physically moves.",
    },
    {
      question: "What is the Temporal Dead Zone in JavaScript?",
      answer:
        "The Temporal Dead Zone (TDZ) is the period between the start of a block scope and the declaration line of a let or const variable. During this period, the variable exists but cannot be read or written — accessing it throws a ReferenceError. The TDZ exists to surface use-before-declaration bugs that var silently hides with undefined.",
    },
    {
      question: "What is the difference between var, let, and const hoisting?",
      answer:
        "var is hoisted and initialized to undefined, so reading it before assignment returns undefined instead of throwing. let and const are hoisted but not initialized — reading them before their declaration throws a ReferenceError due to the Temporal Dead Zone. Function declarations are fully hoisted with their entire body.",
    },
    {
      question: "Are function declarations hoisted in JavaScript?",
      answer:
        "Yes, function declarations are fully hoisted — both the name and the function body. You can call a function declared with the function keyword before its position in the source code. However, function expressions (const fn = function() {}) are not hoisted — only the variable declaration is, not the assignment.",
    },
    {
      question: "What does undefined output before a var variable mean?",
      answer:
        "When you access a var variable before its assignment line, you get undefined because var declarations are hoisted and initialized to undefined during the setup phase. The assignment stays where it is in the code. This is different from let/const, which throw a ReferenceError when accessed before their declaration.",
    },
  ],

  "javascript-scope-interview-questions": [
    {
      question: "What is scope in JavaScript?",
      answer:
        "Scope is the set of rules that determines which variables are accessible at any given point in a program. JavaScript uses lexical scope, meaning a function's accessible variables are determined by where the function is written in the source code, not where it is called from.",
    },
    {
      question:
        "What is the difference between function scope and block scope?",
      answer:
        "Function scope means a variable is accessible throughout the entire function it was declared in, including any nested functions. Block scope means a variable is only accessible within the nearest enclosing curly braces. var is function-scoped and ignores block boundaries. let and const are block-scoped.",
    },
    {
      question: "What is the scope chain in JavaScript?",
      answer:
        "The scope chain is the ordered sequence of scopes JavaScript searches when resolving a variable. Starting from the current scope, it moves outward through each enclosing scope until either the variable is found or the global scope is reached without finding it, which produces a ReferenceError.",
    },
    {
      question: "What is lexical scope in JavaScript?",
      answer:
        "Lexical scope means a function's scope is determined at write time by where the function appears in the source code, not at call time by where it is invoked. A function defined inside another function can always access the outer function's variables, regardless of where the inner function is later called from.",
    },
    {
      question: "What is module scope in JavaScript?",
      answer:
        "Module scope is the scope of ES6 modules (files using import/export). Variables declared at the top level of a module are not added to the global scope — they are private to the module. To share them, they must be explicitly exported. This prevents the global namespace pollution that was common in script-tag-based code.",
    },
  ],

  "javascript-var-let-const-interview-questions": [
    {
      question:
        "What is the difference between var, let, and const in JavaScript?",
      answer:
        "var is function-scoped and hoisted with undefined initialization, meaning it ignores block boundaries and can be accessed before declaration. let is block-scoped and in the Temporal Dead Zone until declared, preventing accidental use before assignment. const is block-scoped like let but cannot be reassigned after declaration, though object and array contents can still be mutated.",
    },
    {
      question: "Why should you avoid using var in modern JavaScript?",
      answer:
        "var has two dangerous behaviors: it is function-scoped so it leaks out of if/for blocks, and it is initialized to undefined before its assignment so accessing it early gives a silent wrong value instead of an error. Both let and const fix both problems with block scope and the Temporal Dead Zone.",
    },
    {
      question: "Can you change a const variable in JavaScript?",
      answer:
        'You cannot reassign a const binding — the variable cannot point to a different value. But if the value is an object or array, its contents can still be mutated: const user = {}; user.name = "Alice" works fine. To prevent mutation of the value itself, use Object.freeze().',
    },
    {
      question: "When should you use let vs const?",
      answer:
        "Use const by default for any value that does not need reassignment — which is the majority of variables. Use let only when you specifically need to reassign the variable, such as loop counters, accumulated totals, or state that changes. Defaulting to const makes intention clear and prevents accidental reassignment.",
    },
  ],

  "javascript-execution-context-interview-questions": [
    {
      question: "What is an execution context in JavaScript?",
      answer:
        "An execution context is the environment in which JavaScript code is evaluated and executed. It contains the variable environment (all declared variables), the scope chain (references to outer environments), and the value of this. There is one global execution context and a new function execution context is created every time a function is called.",
    },
    {
      question: "What is the call stack in JavaScript?",
      answer:
        "The call stack is a LIFO data structure that tracks which execution context is currently running. When a function is called, its execution context is pushed onto the stack. When it returns, its context is popped off. JavaScript can only run the context at the top of the stack — which is why it is single-threaded.",
    },
    {
      question: "What are the two phases of an execution context?",
      answer:
        "Every execution context has a creation phase and an execution phase. In the creation phase, variable declarations are set up (var to undefined, let/const in TDZ, functions fully hoisted), the scope chain is established, and this is determined. In the execution phase, code runs line by line and assignments happen.",
    },
    {
      question:
        "What is the difference between global and function execution context?",
      answer:
        "The global execution context is created once when the script starts, sets up global variables, and sets this to the global object. A function execution context is created every time a function is invoked — it has its own variable environment, its own this value, and a reference to its outer scope via the scope chain.",
    },
  ],

  "javascript-this-keyword-interview-questions": [
    {
      question: "What does the this keyword refer to in JavaScript?",
      answer:
        "this refers to the execution context of a function call — it is determined by how the function is called, not where it is defined. There are five rules in priority order: new binding, explicit binding (call/apply/bind), implicit binding (method call), arrow function (lexical inheritance), and default binding (global or undefined in strict mode).",
    },
    {
      question:
        "What is the difference between call, apply, and bind in JavaScript?",
      answer:
        "All three set this explicitly. call(context, arg1, arg2) invokes the function immediately with individual arguments. apply(context, [arg1, arg2]) invokes immediately with an array of arguments. bind(context) returns a new function with this permanently set to context — it does not invoke the function immediately.",
    },
    {
      question: "Why does this become undefined inside a callback?",
      answer:
        "When a method is extracted from an object and called as a standalone function or passed as a callback, it loses its implicit binding to the object. In strict mode, this becomes undefined. The fix is to use an arrow function (which inherits this lexically), bind the method to the object, or call it as a method: obj.method().",
    },
    {
      question: "How does this work in arrow functions?",
      answer:
        "Arrow functions do not have their own this binding. Instead, they inherit this from the lexical scope where they were defined — the surrounding function or global context at the time the arrow function was created. Calling an arrow function with call, apply, or bind does not change its this.",
    },
    {
      question: "What is the value of this in a class constructor?",
      answer:
        "Inside a class constructor, this refers to the newly created instance being constructed. Methods defined in the class body also have this set to the instance when called as obj.method(). However, if a class method is extracted and called standalone, it loses the instance as this — using arrow function class fields or bind in the constructor fixes this.",
    },
  ],

  "javascript-event-loop-interview-questions": [
    {
      question: "How does the JavaScript event loop work?",
      answer:
        "The event loop continuously monitors the call stack and task queues. After each synchronous task completes and the call stack empties, it first drains the entire microtask queue (Promise callbacks, queueMicrotask), then picks one macrotask (setTimeout, setInterval, I/O callback) and executes it. This cycle repeats indefinitely, enabling async behavior on a single thread.",
    },
    {
      question: "What is the difference between microtasks and macrotasks?",
      answer:
        "Microtasks are high-priority callbacks scheduled by Promises (.then, .catch, .finally), queueMicrotask(), and MutationObserver. Macrotasks are lower-priority callbacks from setTimeout, setInterval, I/O events, and user interaction events. After every task, the entire microtask queue is drained before any single macrotask runs.",
    },
    {
      question: "Why does a Promise callback run before a setTimeout with 0ms?",
      answer:
        "Promise callbacks are microtasks. setTimeout callbacks are macrotasks. After synchronous code finishes, the event loop drains all microtasks before running any macrotask. Even with a 0ms delay, setTimeout is still a macrotask and will always run after all pending Promise callbacks.",
    },
    {
      question: "What happens when the call stack is blocked in JavaScript?",
      answer:
        "If synchronous JavaScript runs for too long, it blocks the call stack and the event loop cannot process any microtasks, macrotasks, or rendering. In a browser this freezes the UI — no clicks, no animations, no repaints. The fix is to break long tasks into chunks using setTimeout(fn, 0) or scheduler.yield(), or to move heavy computation to a Web Worker.",
    },
    {
      question:
        "What is the output order of console.log with setTimeout and Promise?",
      answer:
        "Synchronous code runs first, then all microtasks (Promises), then macrotasks (setTimeout). For example: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4); — outputs 1, 4, 3, 2. The synchronous logs run first, then the Promise microtask, then the setTimeout macrotask.",
    },
  ],

  "javascript-promise-interview-questions": [
    {
      question: "What is a Promise in JavaScript?",
      answer:
        "A Promise is an object representing a value that may not be available yet but will be resolved at some point in the future. It has three states: pending (initial), fulfilled (resolved with a value), and rejected (failed with a reason). State transitions are permanent — a settled Promise never changes state.",
    },
    {
      question:
        "What is the difference between Promise.all and Promise.allSettled?",
      answer:
        "Promise.all takes an array of Promises and resolves when all resolve, returning an array of values in input order. It rejects immediately if any Promise rejects. Promise.allSettled waits for all Promises to settle regardless of outcome, returning an array of objects with status and value/reason for each. Use allSettled when partial failure is acceptable.",
    },
    {
      question: "What does Promise.race do?",
      answer:
        "Promise.race resolves or rejects with the outcome of whichever Promise settles first — fulfilled or rejected. It is commonly used to implement timeouts: race the actual operation against a setTimeout-based rejection Promise, so if the operation takes too long, the timeout rejects first.",
    },
    {
      question: "How does Promise chaining work?",
      answer:
        "Every .then() call returns a new Promise. The returned Promise resolves to whatever the .then() handler returns — a plain value, another Promise, or throws. If the handler throws, the chain jumps to the nearest .catch(). This allows sequential async operations to be expressed as a flat chain rather than nested callbacks.",
    },
    {
      question: "What is the Promise constructor antipattern?",
      answer:
        "The Promise constructor antipattern is wrapping a function that already returns a Promise inside new Promise(). This is redundant: new Promise((resolve, reject) => { fetch(url).then(resolve).catch(reject) }) can simply be written as fetch(url). Only use the Promise constructor when converting genuinely callback-based APIs.",
    },
  ],

  "javascript-async-await-interview-questions": [
    {
      question: "What is async/await in JavaScript?",
      answer:
        "async/await is syntactic sugar over Promises. An async function always returns a Promise. The await keyword pauses execution of the async function until the awaited Promise settles, then resumes with the resolved value. The thread is never actually blocked — other code continues running while the async function is suspended.",
    },
    {
      question: "What is the difference between sequential and parallel await?",
      answer:
        "Sequential await executes one operation at a time: const a = await fetchA(); const b = await fetchB(); — total time equals the sum of both. Parallel await starts all operations simultaneously: const [a, b] = await Promise.all([fetchA(), fetchB()]); — total time equals the slowest operation. Accidentally using sequential await is one of the most common performance mistakes in async JavaScript.",
    },
    {
      question: "How do you handle errors with async/await?",
      answer:
        "Use try/catch around await expressions. A rejected Promise inside an async function behaves like a thrown error and is caught by the enclosing catch block. For independent operations that can partially fail, use Promise.allSettled instead of wrapping everything in one try/catch.",
    },
    {
      question: "Why does async forEach not work as expected?",
      answer:
        "Array.forEach ignores the Promise returned by each async callback. The loop fires all callbacks and completes synchronously before any await inside them resolves. Use for...of with await for sequential async iteration, or Promise.all with .map() for parallel async iteration.",
    },
    {
      question: "What does an async function return if you do not await it?",
      answer:
        "Calling an async function without await returns a Promise object, not the resolved value. To get the value, you must either await the call or chain .then() on it. This is a common mistake when calling async functions inside non-async functions.",
    },
  ],

  "javascript-prototype-interview-questions": [
    {
      question: "What is the prototype chain in JavaScript?",
      answer:
        "The prototype chain is the sequence of objects JavaScript searches when looking up a property. Every object has an internal [[Prototype]] link to another object. When a property is not found on the object itself, JavaScript follows this link and searches the next object, continuing until the property is found or null is reached at the end of the chain.",
    },
    {
      question: "What does the new keyword do in JavaScript?",
      answer:
        "The new keyword does four things: creates a new empty object, sets its [[Prototype]] to the constructor function's prototype property, calls the constructor with this set to the new object, and returns the new object (unless the constructor explicitly returns a different object).",
    },
    {
      question: "What is the difference between prototype and __proto__?",
      answer:
        "prototype is a property on functions — it becomes the [[Prototype]] of objects created with new ThatFunction(). __proto__ is an accessor on objects that exposes the [[Prototype]] slot. __proto__ is deprecated; use Object.getPrototypeOf() to read and Object.setPrototypeOf() to set the prototype instead.",
    },
    {
      question: "How do ES6 classes relate to prototypes?",
      answer:
        'ES6 classes are syntactic sugar over the constructor function and prototype pattern. A class creates a function, and all methods defined in the class body are placed on that function\'s prototype. extends sets up the prototype chain. The runtime behavior is identical to pre-class prototype-based inheritance — typeof MyClass === "function" confirms this.',
    },
    {
      question: "What is prototypal inheritance in JavaScript?",
      answer:
        "Prototypal inheritance is JavaScript's object model where objects inherit directly from other objects through the prototype chain. Unlike classical inheritance where classes are blueprints that produce copies, prototypal inheritance uses live delegation — properties are looked up along the chain at access time, not copied to each instance.",
    },
  ],

  "javascript-object-interview-questions": [
    {
      question:
        "What is the difference between shallow copy and deep copy in JavaScript?",
      answer:
        "A shallow copy duplicates only the top-level properties — nested objects are still shared references. Object spread ({ ...obj }) and Object.assign() both produce shallow copies. A deep copy recursively duplicates all levels so the copy is completely independent. Use structuredClone() for deep cloning in modern JavaScript.",
    },
    {
      question: "What does Object.freeze() do in JavaScript?",
      answer:
        "Object.freeze() prevents adding, deleting, or modifying properties on an object. However, it is shallow — nested objects are not frozen and can still be mutated. For true deep immutability, you must recursively freeze all nested objects or use a library like Immer.",
    },
    {
      question: "What is optional chaining in JavaScript?",
      answer:
        "Optional chaining (?.) safely accesses nested object properties without throwing if an intermediate value is null or undefined. It short-circuits and returns undefined instead of throwing a TypeError. For example, user?.address?.city returns undefined rather than throwing if address is null.",
    },
    {
      question:
        "What is the difference between null and undefined in JavaScript?",
      answer:
        'undefined means a variable was declared but never assigned a value — the JavaScript engine set it. null means intentionally empty — a developer explicitly set it to indicate no value. typeof undefined is "undefined", typeof null is "object" (a historical bug). undefined == null is true, but undefined === null is false.',
    },
  ],

  "javascript-array-interview-questions": [
    {
      question:
        "What is the difference between map, filter, and reduce in JavaScript?",
      answer:
        "map transforms every element and returns a new array of the same length. filter returns a new array containing only elements where the callback returned true. reduce accumulates all elements into a single value of any type. All three are non-mutating and return new arrays or values without modifying the original.",
    },
    {
      question: "Why is Array.sort() dangerous with numbers?",
      answer:
        'Array.sort() converts elements to strings and sorts lexicographically by default. This means [10, 9, 2, 1, 100].sort() returns [1, 10, 100, 2, 9] because "10" comes before "2" alphabetically. Always pass a comparator for numbers: .sort((a, b) => a - b) for ascending order.',
    },
    {
      question:
        "What is the difference between slice and splice in JavaScript?",
      answer:
        "slice(start, end) returns a new array containing the extracted elements without modifying the original. splice(start, deleteCount, ...items) modifies the original array by removing, replacing, or inserting elements and returns the removed elements. Remember: splic-e edits, slic-e copies.",
    },
    {
      question: "What does Array.flat() do?",
      answer:
        "Array.flat(depth) returns a new array with sub-arrays flattened to the specified depth. The default depth is 1. flat(Infinity) flattens completely regardless of nesting level. flatMap(fn) maps each element and flattens one level in a single pass, more efficiently than .map().flat().",
    },
  ],

  "javascript-class-interview-questions": [
    {
      question: "What are JavaScript classes?",
      answer:
        "JavaScript classes are syntactic sugar over the existing prototype-based inheritance system. A class declaration creates a constructor function, places methods on its prototype, and sets up the prototype chain for inheritance. The underlying mechanism is identical to pre-ES6 constructor functions and prototypes — classes do not introduce a new object model.",
    },
    {
      question: "What are private class fields in JavaScript?",
      answer:
        "Private class fields use the # prefix and are enforced at the language level — they cannot be accessed outside the class body at all, even with bracket notation. This is genuine privacy, not just a naming convention. const obj = new MyClass(); obj.#field throws a SyntaxError caught at parse time.",
    },
    {
      question: "What does super() do in a JavaScript class?",
      answer:
        "In a subclass constructor, super() calls the parent class constructor. It must be called before accessing this — this is because the parent constructor creates the object that this refers to. super.method() calls a specific method from the parent class, useful when overriding a method but still needing the parent behavior.",
    },
    {
      question: "What is the difference between static and instance methods?",
      answer:
        "Instance methods are defined on the prototype and called on instances: obj.method(). They have access to instance data through this. Static methods are defined on the class itself and called on the class: MyClass.method(). They do not have access to instance data and are typically used for utility functions.",
    },
  ],

  "javascript-destructuring-interview-questions": [
    {
      question: "What is destructuring in JavaScript?",
      answer:
        'Destructuring is a syntax that extracts values from arrays or properties from objects into distinct variables in a single expression. It supports renaming (const { name: firstName } = user), default values (const { role = "user" } = data), nested extraction, and rest collection. It makes working with function return values and API responses significantly cleaner.',
    },
    {
      question:
        "What is the difference between array and object destructuring?",
      answer:
        "Array destructuring extracts values by position: const [first, second] = array. The variable names can be anything. Object destructuring extracts by property name: const { name, age } = object. The variable names must match the property keys (or be renamed with :).",
    },
    {
      question: "When does a destructuring default value trigger?",
      answer:
        'A destructuring default value only triggers when the value is undefined — not when it is null, 0, false, or an empty string. const { role = "user" } = { role: null } — role will be null, not "user", because null is not undefined.',
    },
  ],

  "javascript-spread-rest-interview-questions": [
    {
      question: "What is the difference between spread and rest in JavaScript?",
      answer:
        "Spread (...) expands an iterable into individual elements — used in function calls, array literals, and object literals. Rest (...) collects multiple elements into a single array — used in function parameters to capture remaining arguments. Same syntax, opposite operations: spread expands, rest collects.",
    },
    {
      question: "How do you merge objects with spread in JavaScript?",
      answer:
        "Object spread creates a new object by copying properties from multiple sources: const merged = { ...obj1, ...obj2 }. Properties from right-side objects overwrite same-named properties from left-side objects. It is commonly used for immutable object updates in React state: setState({ ...prevState, count: prevState.count + 1 }).",
    },
    {
      question:
        "What is the difference between rest parameters and the arguments object?",
      answer:
        "Rest parameters (...args) create a real Array containing the remaining function arguments. The arguments object is array-like but not a real Array — it lacks .map(), .filter(), and other Array methods. Rest parameters also work in arrow functions, while arguments does not exist in arrow functions at all.",
    },
  ],

  "javascript-map-set-interview-questions": [
    {
      question: "What is the difference between Map and Object in JavaScript?",
      answer:
        "Map accepts any value as a key including objects, functions, and primitives. Object only accepts strings and symbols as keys. Map preserves insertion order for all keys. Map has a .size property. Map has no prototype chain, so there are no inherited key conflicts. Use Map when keys are dynamic or non-string values.",
    },
    {
      question: "What is a Set in JavaScript and when should you use it?",
      answer:
        "A Set is a collection of unique values — duplicates are automatically ignored. It maintains insertion order and provides O(1) has() lookup. Use Set for deduplicating arrays ([...new Set(array)]), tracking seen values efficiently, and implementing mathematical set operations (union, intersection, difference).",
    },
    {
      question: "What is the difference between WeakMap and Map?",
      answer:
        "WeakMap holds weak references to its keys, meaning it does not prevent keys from being garbage collected. When a key object is collected, its WeakMap entry disappears automatically. WeakMap is ideal for associating metadata with DOM elements or objects without creating memory leaks. Map holds strong references and prevents GC of its keys.",
    },
  ],

  "javascript-generators-interview-questions": [
    {
      question: "What is a generator function in JavaScript?",
      answer:
        "A generator function (function*) can pause its execution at any yield expression and resume from that point on the next .next() call. Each .next() returns { value, done } where done is false until the function returns. Generators produce values lazily — only when requested — making them efficient for large or infinite sequences.",
    },
    {
      question:
        "What is the difference between a generator and a regular function?",
      answer:
        "A regular function runs to completion in one call and returns one value. A generator function can be paused at yield expressions, returning a value each time, and resumed with .next(). Generators maintain their execution state between calls, making them stateful in a controlled way.",
    },
    {
      question: "What are practical use cases for generators?",
      answer:
        "Generators are used for infinite sequences (IDs, pagination), custom iterables for data structures, async control flow (Redux-Saga uses generators for side effect management), and lazy data pipelines that process items on demand without loading everything into memory at once.",
    },
  ],

  "javascript-arrow-function-interview-questions": [
    {
      question:
        "What is the difference between arrow functions and regular functions?",
      answer:
        "Arrow functions do not have their own this, arguments, super, or new.target — they inherit these from the enclosing lexical scope. Regular functions have their own this determined by the call site. Arrow functions cannot be used as constructors (no new), do not have a prototype property, and provide shorter syntax.",
    },
    {
      question: "When should you not use arrow functions?",
      answer:
        "Avoid arrow functions for object methods (this will not refer to the object), prototype methods (same reason), constructors (cannot be used with new), and event handler methods that need their own this. Arrow functions are best for callbacks, array method arguments, and any place where you need to preserve the outer this.",
    },
  ],

  "javascript-higher-order-functions-interview-questions": [
    {
      question: "What is a higher-order function in JavaScript?",
      answer:
        "A higher-order function is a function that takes another function as an argument, returns a function, or both. Array methods like map, filter, and reduce are higher-order functions. Function factories, decorators, and middleware patterns all use higher-order functions.",
    },
    {
      question: "What is function composition?",
      answer:
        "Function composition combines two or more functions so that the output of one becomes the input of the next. const compose = (f, g) => x => f(g(x)) creates a composed function. Composition is a core pattern in functional programming and is used in middleware chains, data transformation pipelines, and React HOCs.",
    },
  ],

  "javascript-currying-interview-questions": [
    {
      question: "What is currying in JavaScript?",
      answer:
        "Currying transforms a function that takes multiple arguments into a sequence of functions each taking a single argument. add(1, 2) becomes add(1)(2). It enables partial application — creating specialized functions by pre-filling some arguments — and is fundamental to functional programming patterns.",
    },
    {
      question:
        "What is the difference between currying and partial application?",
      answer:
        "Currying transforms a function into a chain of unary (single-argument) functions. Partial application pre-applies some arguments to a function, returning a new function that takes the remaining arguments. Partial application does not require fixing one argument at a time.",
    },
  ],

  "javascript-type-coercion-interview-questions": [
    {
      question: "What is type coercion in JavaScript?",
      answer:
        "Type coercion is the automatic conversion of a value from one type to another by the JavaScript engine. It happens implicitly in operations with mismatched types — adding a string to a number, using == for comparison, or using a value in a boolean context. Explicit coercion uses Number(), String(), or Boolean() intentionally.",
    },
    {
      question:
        "What is the difference between implicit and explicit coercion?",
      answer:
        'Implicit coercion is automatic and happens when operators receive mismatched types: "5" - 2 = 3 (string coerced to number), "5" + 2 = "52" (number coerced to string). Explicit coercion is intentional: Number("5") = 5. Relying on implicit coercion makes code harder to reason about; explicit conversion communicates intent.',
    },
    {
      question: "What are truthy and falsy values in JavaScript?",
      answer:
        'Falsy values are values that coerce to false in a boolean context: false, 0, -0, 0n, "" (empty string), null, undefined, and NaN. Every other value is truthy, including empty arrays [], empty objects {}, and the string "false". Understanding this is essential for conditional expressions and default value patterns.',
    },
  ],

  "javascript-equality-interview-questions": [
    {
      question: "What is the difference between == and === in JavaScript?",
      answer:
        "Strict equality (===) compares type AND value with no conversion — different types always return false. Loose equality (==) performs type coercion before comparing, following complex rules. 0 == false is true, null == undefined is true, [] == false is true. Use === in all production code.",
    },
    {
      question: "What does Object.is() do?",
      answer:
        "Object.is() is like === but handles two edge cases correctly: Object.is(NaN, NaN) is true (=== returns false for NaN), and Object.is(-0, 0) is false (=== treats them as equal). React uses Object.is() for state comparison.",
    },
  ],

  "javascript-error-handling-interview-questions": [
    {
      question: "What are the built-in error types in JavaScript?",
      answer:
        "JavaScript has seven built-in Error types: Error (base class), TypeError (wrong type, accessing null properties), ReferenceError (variable not found), SyntaxError (invalid syntax, JSON.parse failures), RangeError (value out of bounds), URIError (malformed URI), and EvalError (legacy). Each captures a stack trace automatically.",
    },
    {
      question: "How do you create custom error classes in JavaScript?",
      answer:
        "Extend the Error class: class CustomError extends Error { constructor(message) { super(message); this.name = this.constructor.name; } }. Setting this.name to the constructor name ensures the error type appears in stack traces and instanceof checks work correctly.",
    },
    {
      question: "How does try/catch work with async/await?",
      answer:
        "Inside async functions, a rejected Promise behaves like a thrown error. Wrapping await expressions in try/catch catches those rejections. The catch block receives the rejection reason. Without try/catch, rejected Promises propagate up as unhandled rejections.",
    },
  ],

  "javascript-performance-interview-questions": [
    {
      question: "What is layout thrashing in JavaScript?",
      answer:
        "Layout thrashing is alternating between DOM reads that force synchronous layout (offsetWidth, getBoundingClientRect) and DOM writes that invalidate the layout in a loop. Each read forces the browser to recalculate styles and positions. Fix by batching all reads first, then all writes.",
    },
    {
      question: "What is memoization in JavaScript?",
      answer:
        "Memoization is caching the return value of a pure function based on its input arguments. Subsequent calls with the same arguments return the cached result without recomputation. It is only valid for pure functions where the same inputs always produce the same output.",
    },
    {
      question: "What is event delegation in JavaScript?",
      answer:
        "Event delegation uses a single event listener on a parent element rather than individual listeners on each child. The listener uses event.target to determine which child was interacted with. It reduces memory usage, works for dynamically added children, and simplifies listener management.",
    },
  ],

  "javascript-debounce-throttle-interview-questions": [
    {
      question: "What is the difference between debounce and throttle?",
      answer:
        "Debounce delays function execution until N milliseconds after the last call — if called repeatedly, only the final call fires after the pause. Use for search inputs and resize handlers. Throttle limits execution to at most once per N milliseconds regardless of call frequency. Use for scroll listeners and real-time updates that should fire regularly.",
    },
    {
      question: "How do you implement debounce in JavaScript?",
      answer:
        "Debounce uses clearTimeout and setTimeout: each new call cancels the previous timer and sets a new one. Only the final call after the user stops triggers the timeout. function debounce(fn, delay) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); }; }",
    },
  ],

  "javascript-memory-management-interview-questions": [
    {
      question: "How does garbage collection work in JavaScript?",
      answer:
        "JavaScript uses mark-and-sweep garbage collection. Starting from root references (global scope, call stack), the engine marks all reachable objects. Everything not marked is swept and the memory reclaimed. Objects are collected only when they become completely unreachable — no live reference anywhere in the program points to them.",
    },
    {
      question: "What causes memory leaks in JavaScript?",
      answer:
        "The four main causes are: forgotten event listeners that hold closure references, closures that capture large objects unnecessarily, detached DOM nodes referenced in JavaScript variables, and unbounded caches (plain objects or Maps) that grow without eviction. All prevent garbage collection by maintaining references to otherwise unused objects.",
    },
    {
      question:
        "What is the difference between WeakMap and Map regarding memory?",
      answer:
        "Map holds strong references to its keys, preventing garbage collection as long as the Map exists. WeakMap holds weak references — if the key object has no other strong references, it can be garbage collected, and its WeakMap entry disappears automatically. WeakMap is the correct tool for caching data associated with objects without causing memory leaks.",
    },
  ],

  "javascript-modules-interview-questions": [
    {
      question: "What is the difference between ES modules and CommonJS?",
      answer:
        "ES modules (import/export) are statically analyzed at parse time, enabling tree shaking, and load asynchronously. CommonJS (require/module.exports) is evaluated at runtime, synchronous, and does not support static analysis. ES modules are the standard for modern JavaScript; CommonJS is primarily used in older Node.js code.",
    },
    {
      question: "What is tree shaking?",
      answer:
        "Tree shaking is a bundler optimization that removes unused exports from the final bundle. It only works with ES module syntax because import/export are statically analyzable. Bundlers like webpack and Rollup can determine which exports are actually used and exclude the rest from the output.",
    },
    {
      question: "What is dynamic import in JavaScript?",
      answer:
        'Dynamic import (import("./module")) returns a Promise and loads the module asynchronously at runtime rather than at parse time. It enables code splitting — loading modules only when needed — which reduces initial bundle size. It is the standard approach for lazy-loading routes, components, and heavy libraries.',
    },
  ],

  "javascript-iterator-interview-questions": [
    {
      question: "What is the iterator protocol in JavaScript?",
      answer:
        "The iterator protocol requires an object to implement a next() method that returns { value, done }. value is the current value, done is true when iteration is complete. Any object with this interface can be used with for...of, spread, and destructuring.",
    },
    {
      question: "What is Symbol.iterator?",
      answer:
        "Symbol.iterator is a well-known Symbol that objects implement to become iterable. When for...of is used, JavaScript calls obj[Symbol.iterator]() to get the iterator. Arrays, strings, Maps, Sets, and generators implement Symbol.iterator by default. Custom objects can implement it to support for...of iteration.",
    },
  ],

  "javascript-proxy-reflect-interview-questions": [
    {
      question: "What is a JavaScript Proxy?",
      answer:
        "A Proxy wraps an object and intercepts fundamental operations on it through handler traps. The 13 traps cover property read (get), write (set), deletion (deleteProperty), function calls (apply), and more. Proxies enable validation, reactivity, logging, access control, and meta-programming without modifying the original object.",
    },
    {
      question: "What is the Reflect API and why is it used with Proxy?",
      answer:
        "Reflect provides static methods corresponding to each Proxy trap, implementing the default behavior for each operation. Using Reflect inside Proxy traps ensures correct behavior — particularly for the receiver argument in get/set traps, which correctly handles inherited getters/setters. Reflect.set also returns a boolean instead of throwing, making trap code more predictable.",
    },
  ],

  "javascript-dom-interview-questions": [
    {
      question: "What is the DOM in JavaScript?",
      answer:
        "The DOM (Document Object Model) is the browser's live, tree-structured representation of an HTML document. JavaScript can query, modify, add, and remove nodes in this tree, and all changes are immediately reflected on screen. The DOM is not your HTML file — it is a separate, mutable structure the browser creates from the HTML.",
    },
    {
      question: "What is event delegation?",
      answer:
        "Event delegation attaches a single event listener to a parent element instead of one per child. When an event fires, it bubbles up to the parent where the listener checks event.target to determine which child was interacted with. This reduces memory usage, automatically handles dynamically added children, and simplifies cleanup.",
    },
    {
      question:
        "What is the difference between querySelector and getElementById?",
      answer:
        "getElementById returns a single element by its id attribute and is the fastest DOM query method. querySelector accepts any CSS selector string and returns the first matching element, and querySelectorAll returns all matches as a NodeList. getElementById is faster for id lookups; querySelector is more flexible for complex selectors.",
    },
  ],

  "javascript-browser-apis-interview-questions": [
    {
      question:
        "What is the difference between localStorage and sessionStorage?",
      answer:
        "Both store string key-value pairs synchronously with a ~5MB limit per origin. localStorage persists until explicitly cleared — it survives tab closes and browser restarts. sessionStorage is cleared when the tab or window is closed. Neither is suitable for sensitive data.",
    },
    {
      question: "What is a Web Worker?",
      answer:
        "A Web Worker runs JavaScript in a background thread, separate from the main thread. It can perform CPU-intensive operations without blocking the UI. Workers communicate with the main thread via postMessage/onmessage. They cannot access the DOM directly.",
    },
    {
      question: "How does the Fetch API work?",
      answer:
        "fetch(url) returns a Promise that resolves when the response headers arrive — not when the body is read. A 404 or 500 status still resolves (it does not reject). You must check response.ok manually, then call response.json() or response.text() which returns a second Promise for the body.",
    },
  ],

  "javascript-immutability-interview-questions": [
    {
      question: "What is immutability in JavaScript?",
      answer:
        "Immutability means producing new values instead of modifying existing ones. Instead of mutating an object, you create a new object with the changes applied. This makes changes explicit and traceable, enables reference equality checks for change detection, and prevents bugs from shared mutable state.",
    },
    {
      question: "Why does React require immutable state updates?",
      answer:
        "React uses reference equality (Object.is) to determine if state changed. If you mutate an existing object and pass the same reference, React sees no change and skips re-rendering. Creating a new object with the changes ensures React detects the update and renders correctly.",
    },
  ],

  "javascript-regex-interview-questions": [
    {
      question: "What is a regular expression in JavaScript?",
      answer:
        "A regular expression (regex) is a pattern used to match, search, and replace text. JavaScript regex literals use /pattern/flags syntax. Common flags: g (global — find all matches), i (case insensitive), m (multiline), s (dotAll — . matches newlines). Regex is used for validation, string parsing, and text transformation.",
    },
    {
      question:
        "What is the difference between test() and match() in JavaScript regex?",
      answer:
        "regex.test(string) returns a boolean — true if the pattern is found. string.match(regex) returns an array of matched substrings (or null). With the g flag, match() returns all matches. Without g, it returns the first match with capture groups. Use test() for validation, match() for extraction.",
    },
    {
      question: "What is the global flag gotcha in JavaScript regex?",
      answer:
        "When a regex has the g flag, it maintains a lastIndex property between calls. Calling .test() or .exec() repeatedly on the same regex object advances lastIndex, causing alternating true/false results on the same string. Either create a new regex each call, or use string.match() which resets correctly.",
    },
  ],

  "javascript-settimeout-interview-questions": [
    {
      question: "What does setTimeout with 0ms delay actually do?",
      answer:
        "setTimeout(fn, 0) does not run the callback immediately. It schedules it as a macrotask, which runs after all synchronous code and all pending microtasks (Promise callbacks) have completed. It is used to defer work until after the current call stack clears, such as after a UI update has rendered.",
    },
    {
      question: "What is the difference between setTimeout and setInterval?",
      answer:
        "setTimeout fires once after the specified delay. setInterval fires repeatedly at the specified interval. setInterval does not wait for the callback to complete — if the callback takes longer than the interval, calls pile up. Recursive setTimeout (scheduling the next call at the end of the callback) is safer for async recurring work.",
    },
  ],
  "javascript-event-propagation-interview-questions": [
    {
      question: "What is event propagation in JavaScript?",
      answer:
        "Event propagation describes how a DOM event travels through the element tree after it is fired. Every event passes through three phases in order: capturing (from the document root down to the target element), the target phase (the event fires on the element itself), and bubbling (back up from the target to the document root). Listeners run at whichever phase they were registered for.",
    },
    {
      question:
        "What is the difference between event bubbling and event capturing?",
      answer:
        "Capturing travels from the document root down to the target element — it runs first. Bubbling travels from the target element back up to the root — it runs second. addEventListener registers bubble-phase listeners by default. Passing true as the third argument registers a capture-phase listener. Most real-world listeners use bubbling; capturing is primarily used when you need to intercept an event before it reaches the target.",
    },
    {
      question:
        "What is the difference between event.target and event.currentTarget?",
      answer:
        "event.target is the element the user actually interacted with — the origin of the event. It does not change as the event travels through the DOM. event.currentTarget is the element whose event listener is currently executing — it changes at each step of propagation. In a delegated listener on a parent, event.target is the child that was clicked and event.currentTarget is the parent where the listener lives.",
    },
    {
      question:
        "What is the difference between stopPropagation and preventDefault?",
      answer:
        "They are completely independent methods. stopPropagation halts the event from travelling further through the DOM — ancestor listeners above the current element will not fire. preventDefault cancels the browser's built-in response to the event, such as navigation for links or form submission. Calling one has no effect on the other.",
    },
    {
      question: "What is event delegation in JavaScript?",
      answer:
        "Event delegation places a single listener on a parent element instead of attaching individual listeners to each child. When a child fires an event, it bubbles up to the parent where the listener uses event.target — or event.target.closest() — to identify the originating child and respond accordingly. Delegation works for elements added to the DOM after the listener was attached and significantly reduces memory usage in large lists.",
    },
    {
      question: "Which JavaScript events do not bubble?",
      answer:
        "focus, blur, load, unload, scroll, mouseenter, and mouseleave do not bubble. This means they cannot be intercepted on a parent element with a standard listener. The bubbling equivalents are focusin and focusout (for focus/blur) and mouseover and mouseout (for mouseenter/mouseleave) — use these when you need to delegate these event types.",
    },
  ],
  "javascript-memoization-interview-questions": [
    {
      question: "What is memoization in JavaScript?",
      answer:
        "Memoization is an optimization technique that caches the return value of a function based on its input arguments. On the first call with a given set of arguments, the function executes normally and the result is stored in a cache. On every subsequent call with the same arguments, the cached result is returned without executing the function body. It is only valid for pure functions — functions that always return the same output for the same input with no side effects.",
    },
    {
      question: "How do you implement a memoize function in JavaScript?",
      answer:
        "A memoize function uses a closure to maintain a cache between calls. It wraps the original function, serializes the arguments into a cache key using JSON.stringify, checks if that key exists in the cache, and returns the stored result if it does. If not, it calls the original function, stores the result under that key, and returns it. The cache is a plain object or Map that persists in the closure across all invocations of the memoized function.",
    },
    {
      question:
        "What is the problem with using JSON.stringify as a memoization cache key?",
      answer:
        "JSON.stringify has three significant failures as a cache key: it silently drops function and Symbol properties so two different function arguments can produce the same key, it treats object property order as significant so the same logical object with different key order produces different keys, and it throws a TypeError on circular references. For functions receiving complex objects, a custom key resolver or WeakMap-based cache is required.",
    },
    {
      question: "What is the difference between memoization and caching?",
      answer:
        "Memoization is a specific type of caching that operates automatically on function return values keyed by input arguments. General caching is broader — it can store anything by any key and requires explicit management. Memoization is function-level and automatic: you wrap a function once and the caching happens transparently on every call. General caching is explicit: you decide what to store, when to store it, and when to invalidate it.",
    },
    {
      question: "What is an LRU cache and why is it used with memoization?",
      answer:
        "An LRU (Least Recently Used) cache is a bounded cache that evicts the entry accessed least recently when it reaches its size limit. It is used with memoization because an unbounded cache is a memory leak — every unique set of arguments permanently occupies cache space that is never freed. In JavaScript, LRU cache is elegantly implemented using Map, which preserves insertion order, by deleting and reinserting an entry on access to move it to the most-recently-used position.",
    },
    {
      question:
        "What is the difference between useMemo and useCallback in React?",
      answer:
        "useMemo caches a computed value — it runs the provided function and stores its return value, recomputing only when specified dependencies change. useCallback caches a function reference — it returns the same function object between renders, rerunning only when dependencies change. useMemo is for expensive computations; useCallback is for preventing memoized child components from receiving a new function reference prop and re-rendering unnecessarily.",
    },
  ],
  'javascript-design-pattern-interview-questions': [
  {
    question: 'What is the Observer pattern in JavaScript?',
    answer: 'The Observer pattern defines a one-to-many relationship between a subject and its observers. The subject maintains a list of observer functions and notifies all of them when its state changes. Observers subscribe and unsubscribe independently. The subject never needs to know the implementation of any observer. It is the pattern behind addEventListener, Node.js EventEmitter, Vue emit, and Redux store.subscribe.',
  },
  {
    question: 'What is the difference between Observer and Pub/Sub pattern?',
    answer: 'In the Observer pattern, the subject holds direct references to its observers — both sides know each other exist, creating tighter coupling. In Pub/Sub, publishers and subscribers both interact only with a central message broker and never reference each other directly. Observer is simpler and suitable for direct event relationships. Pub/Sub enables complete decoupling, making it appropriate for application-wide event buses and micro-frontend communication.',
  },
  {
    question: 'What is the Singleton pattern and when is it dangerous in JavaScript?',
    answer: 'The Singleton ensures only one instance of a class exists and provides a global access point to it. It is useful for shared resources like database connections and configuration stores. It is dangerous because it introduces hidden global state — any code anywhere can read or modify it, making behavior hard to predict. It makes testing difficult because state from one test leaks into the next. Dependency injection, passing the instance as a parameter rather than accessing it globally, is the preferred alternative.',
  },
  {
    question: 'What is the Module pattern in JavaScript?',
    answer: 'The Module pattern uses an IIFE and closure to create a private scope. Variables declared inside the IIFE are private — inaccessible from outside. The IIFE returns a plain object containing only the functions and values meant to be public. This creates encapsulation: the public API works correctly, but implementation details are hidden. ES6 modules provide the same encapsulation natively — variables not exported are private to the module file.',
  },
  {
    question: 'What is the Factory pattern in JavaScript?',
    answer: 'The Factory pattern provides a function or method that creates and returns objects without the caller needing to use a specific constructor or know the exact class being instantiated. The factory determines which type to create based on its parameters and returns it through a consistent interface. This decouples the caller from implementation details — adding a new type does not require changing any calling code. React.createElement is a factory: you pass a type and it creates the appropriate element.',
  },
  {
    question: 'What is the Decorator pattern in JavaScript?',
    answer: 'The Decorator pattern wraps a function or object with a new function that adds behaviour without modifying the original. The wrapper maintains the same interface as the original. Decorators can be stacked — each wraps the previous, building a pipeline of added behaviours. In JavaScript, function decorators are higher-order functions: withLogging(withCache(fn)) adds logging and caching to fn without touching fn itself. React Higher-Order Components are the Decorator pattern applied to components.',
  },
]
};

/**
 * Get FAQs for a topic slug.
 * Falls back to an empty array if the topic has no dedicated FAQs.
 */
export function getTopicFaqs(slug: string): FAQItem[] {
  return TOPIC_FAQS[slug] ?? [];
}

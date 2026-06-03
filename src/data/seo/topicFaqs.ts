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
  "javascript-design-pattern-interview-questions": [
    {
      question: "What is the Observer pattern in JavaScript?",
      answer:
        "The Observer pattern defines a one-to-many relationship between a subject and its observers. The subject maintains a list of observer functions and notifies all of them when its state changes. Observers subscribe and unsubscribe independently. The subject never needs to know the implementation of any observer. It is the pattern behind addEventListener, Node.js EventEmitter, Vue emit, and Redux store.subscribe.",
    },
    {
      question: "What is the difference between Observer and Pub/Sub pattern?",
      answer:
        "In the Observer pattern, the subject holds direct references to its observers — both sides know each other exist, creating tighter coupling. In Pub/Sub, publishers and subscribers both interact only with a central message broker and never reference each other directly. Observer is simpler and suitable for direct event relationships. Pub/Sub enables complete decoupling, making it appropriate for application-wide event buses and micro-frontend communication.",
    },
    {
      question:
        "What is the Singleton pattern and when is it dangerous in JavaScript?",
      answer:
        "The Singleton ensures only one instance of a class exists and provides a global access point to it. It is useful for shared resources like database connections and configuration stores. It is dangerous because it introduces hidden global state — any code anywhere can read or modify it, making behavior hard to predict. It makes testing difficult because state from one test leaks into the next. Dependency injection, passing the instance as a parameter rather than accessing it globally, is the preferred alternative.",
    },
    {
      question: "What is the Module pattern in JavaScript?",
      answer:
        "The Module pattern uses an IIFE and closure to create a private scope. Variables declared inside the IIFE are private — inaccessible from outside. The IIFE returns a plain object containing only the functions and values meant to be public. This creates encapsulation: the public API works correctly, but implementation details are hidden. ES6 modules provide the same encapsulation natively — variables not exported are private to the module file.",
    },
    {
      question: "What is the Factory pattern in JavaScript?",
      answer:
        "The Factory pattern provides a function or method that creates and returns objects without the caller needing to use a specific constructor or know the exact class being instantiated. The factory determines which type to create based on its parameters and returns it through a consistent interface. This decouples the caller from implementation details — adding a new type does not require changing any calling code. React.createElement is a factory: you pass a type and it creates the appropriate element.",
    },
    {
      question: "What is the Decorator pattern in JavaScript?",
      answer:
        "The Decorator pattern wraps a function or object with a new function that adds behaviour without modifying the original. The wrapper maintains the same interface as the original. Decorators can be stacked — each wraps the previous, building a pipeline of added behaviours. In JavaScript, function decorators are higher-order functions: withLogging(withCache(fn)) adds logging and caching to fn without touching fn itself. React Higher-Order Components are the Decorator pattern applied to components.",
    },
  ],
  "javascript-deep-vs-shallow-clone-interview-questions": [
    {
      question:
        "What is the difference between shallow copy and deep copy in JavaScript?",
      answer:
        "A shallow copy creates a new top-level object but all nested objects and arrays inside it are still shared references with the original. Changing a top-level primitive on the copy does not affect the original, but mutating a nested object does. A deep copy recursively duplicates every level so no part of the copy shares memory with the original — changes at any depth are completely independent.",
    },
    {
      question:
        "Why does Object.assign and spread operator only create a shallow copy?",
      answer:
        "Object.assign and spread copy property values directly. For primitive values like strings and numbers, the value itself is copied. For nested objects and arrays, the value stored in the property is a reference (a memory address), and that reference is what gets copied. Both the original and the copy now hold the same reference, so they point to the same nested object in memory.",
    },
    {
      question:
        "What are the limitations of JSON.parse(JSON.stringify()) for deep cloning?",
      answer:
        "Five significant limitations: functions and Symbol-keyed properties are silently dropped from the output, undefined values are dropped, Date objects are converted to ISO strings and lose their Date type, Infinity and NaN become null, and circular references throw a TypeError immediately. It is only safe for plain data objects containing strings, numbers, booleans, arrays, and nested plain objects.",
    },
    {
      question:
        "What is structuredClone() and how does it differ from JSON.parse(JSON.stringify())?",
      answer:
        "structuredClone() is a native browser and Node.js API (available since 2022) that uses the Structured Clone Algorithm. It correctly handles Dates (preserving them as Date objects), RegExp, Map, Set, typed arrays, and circular references. Unlike the JSON approach, it does not silently corrupt data. It cannot clone functions or DOM nodes (throws DataCloneError) and loses prototype chains on class instances.",
    },
    {
      question:
        "How do you implement a deep clone function that handles circular references?",
      answer:
        "Use a WeakMap to track every object that has been seen during the recursion. Before recursing into an object, check if it already exists in the WeakMap and return the previously created clone if so. If not, create the new clone object, register it in the WeakMap immediately before recursing into its properties, then recursively clone each property. The WeakMap registration before recursion is what breaks the circular chain.",
    },
    {
      question:
        "Why use WeakMap instead of Map for tracking seen objects in deep clone?",
      answer:
        "WeakMap holds weak references to its keys, meaning it does not prevent the objects from being garbage collected after the clone operation completes. Using a regular Map would keep every object alive in memory for the lifetime of the Map. Since the seen-objects tracker is only needed during the clone call, WeakMap is the correct choice — the memory is released as soon as the cloned objects are no longer referenced elsewhere.",
    },
  ],
  "javascript-optional-chaining-interview-questions": [
    {
      question:
        "What does the optional chaining operator (?.) do in JavaScript?",
      answer:
        "The optional chaining operator (?.) evaluates the expression to its left and checks if it is null or undefined. If it is, the entire expression short-circuits and returns undefined without evaluating the rest. If the left side has a value, evaluation continues normally. It prevents TypeError crashes when accessing properties on potentially null or undefined values in nested object chains.",
    },
    {
      question: "What is the difference between ?? and || in JavaScript?",
      answer:
        "Both return their right-hand side as a fallback, but they differ in what triggers the fallback. The nullish coalescing operator (??) only falls back when the left side is null or undefined. The logical OR operator (||) falls back for any falsy value including 0, false, empty string, and NaN. This means port ?? 3000 correctly keeps port 0, while port || 3000 incorrectly replaces port 0 with 3000 because 0 is falsy.",
    },
    {
      question: "Why does user?.getName() still throw if getName is null?",
      answer:
        "The ?. in user?.getName() only checks if user is null or undefined. If user has a value, evaluation continues and attempts to call getName() as a function. If getName is null, calling null as a function throws a TypeError. To guard against getName itself not being a function, use user?.getName?.() — two optional chaining operators, one checking the object and one checking the method before calling it.",
    },
    {
      question: "What are the logical assignment operators ??=, ||=, and &&=?",
      answer:
        "These are shorthand assignment operators. ??= assigns the right side only when the left side is null or undefined — it is equivalent to a = a ?? b. ||= assigns when the left is any falsy value — equivalent to a = a || b. &&= assigns when the left is truthy — equivalent to a = a && b. All three are lazy: the right side is never evaluated if the assignment will not happen.",
    },
    {
      question:
        "Does optional chaining prevent side effects in the bypassed expression?",
      answer:
        "Yes. Optional chaining short-circuits completely — when the left side is null or undefined, nothing to the right of the ?. is evaluated at all. If the right side contains a function call or an increment operation, it does not execute. For example, obj?.method(count++) will not increment count if obj is null or undefined, because the entire right side including the argument is never evaluated.",
    },
  ],
};

export const REACT_TOPIC_FAQS: Record<string, FAQItem[]> = {
  "react-usestate-interview-questions": [
    {
      question: "What is the useState hook in React?",
      answer:
        "useState gives a component a slot in React's memory that persists across renders. It returns a pair — the current state value (a snapshot of this render) and a setter function. Calling the setter does not change the variable immediately; it schedules a re-render. During that next render, React hands back the updated value. Every read of state within one render sees exactly the same snapshot.",
    },
    {
      question: "Why do multiple setState calls in one handler not add up?",
      answer:
        "State variables are snapshots — they hold the value from the current render and never change within it. Calling setCount(count + 1) three times in one handler schedules count + 1 three times using the same stale value of count, so the net result is an increment of 1, not 3. The fix is the functional update form: setCount(prev => prev + 1), which reads from React's pending state queue rather than the snapshot, correctly producing an increment of 3.",
    },
    {
      question: "What is lazy initialisation in useState?",
      answer:
        "If you pass a value directly to useState, the expression is evaluated on every render even though React ignores the result after the first. For expensive computations, pass a function instead: useState(() => expensiveSetup()). React calls it once on mount and uses the return value as the initial state. This avoids running costly logic — like parsing localStorage or building a large matrix — on every re-render.",
    },
    {
      question:
        "Why must object and array state be updated immutably in React?",
      answer:
        "React uses Object.is comparison to decide whether to re-render. If you mutate an existing object and pass the same reference back to the setter, React sees no change and silently skips the re-render — the UI does not update. You must always produce a new reference: use spread for objects (setUser(prev => ({ ...prev, name: 'Bob' }))), and non-mutating array methods like map, filter, and spread for arrays.",
    },
    {
      question:
        "What is derived state and why should it not be stored in useState?",
      answer:
        "Derived state is any value that can be computed from existing props or state. Storing it in useState and syncing it with useEffect causes an unnecessary extra render, introduces a period where the value is stale, and creates a useEffect that can be forgotten or incorrectly updated. Instead, compute the value directly during render — or wrap it in useMemo if the computation is expensive.",
    },
    {
      question:
        "What is the key prop reset pattern for resetting component state?",
      answer:
        "Changing a key prop tells React to destroy the existing component instance and create a completely new one — all state resets to initial values, effects are cleaned up, and the DOM element is replaced. It is the cleanest way to reset a child's state from a parent: give the child a key tied to the relevant identifier (e.g., key={userId}), and React handles the full remount automatically with no useEffect needed.",
    },
  ],

  "react-useeffect-interview-questions": [
    {
      question:
        "What is useEffect and what is the correct mental model for it?",
      answer:
        "useEffect is a synchronisation tool, not a lifecycle method. Its job is to keep an external system — a DOM API, fetch request, timer, or subscription — in sync with React state. The dependency array declares what values the effect uses. After every render where those values changed, React runs the cleanup from the previous effect and then runs the new effect. Thinking in 'run on mount / update / unmount' leads to dependency array mistakes; thinking in 'what external thing needs to stay in sync' leads to correct code.",
    },
    {
      question: "What does each dependency array signature mean in useEffect?",
      answer:
        "No dependency array means the effect runs after every render. An empty array [] means the effect has no dependencies — it runs once after mount and its cleanup runs on unmount. An array with values means the effect re-runs whenever any of those values change between renders. The array is a declaration of what the effect reads from the component's scope, not an optimisation hint — omitting a dependency creates a stale closure bug.",
    },
    {
      question: "What is the stale closure problem in useEffect?",
      answer:
        "A stale closure is when an effect captures a value at the time it runs, that value later changes, but the effect never re-runs so it still uses the old value. The classic example is a setInterval with an empty dependency array that reads count — count is permanently captured as its initial value. Fixes include: adding the variable to the dependency array, using a functional state update (prev => prev + 1) to avoid reading the variable at all, or storing the latest value in a ref updated via useEffect.",
    },
    {
      question: "When does the cleanup function in useEffect run?",
      answer:
        "The cleanup function runs in two situations: before the next effect execution (to tear down the previous setup), and when the component unmounts. It does not only run on unmount. If a useEffect with [userId] fires five times as userId changes, the cleanup runs four times — once before each new execution. This means cleanup must correctly undo whatever the previous effect set up, every single time, not just at the end.",
    },
    {
      question: "How do you handle race conditions in useEffect data fetching?",
      answer:
        "Race conditions occur when a dependency (like userId) changes rapidly — earlier requests can resolve after later ones, overwriting fresh data with stale data. The correct fix is an AbortController: create one at the start of the effect, pass its signal to fetch, and call controller.abort() in the cleanup. This cancels the in-flight request when the effect re-runs, ensuring only the latest request's result is applied.",
    },
    {
      question: "What is the difference between useEffect and useLayoutEffect?",
      answer:
        "useEffect runs asynchronously after the browser has already painted the updated UI — it is the right choice for data fetching, subscriptions, and analytics. useLayoutEffect runs synchronously after React updates the DOM but before the browser paints. Use it when you need to read DOM layout (getBoundingClientRect, offsetHeight) and apply changes before the user sees the screen — for example, positioning a tooltip to prevent a visible flicker.",
    },
  ],

  "react-useref-interview-questions": [
    {
      question:
        "What does useRef return and what makes it different from useState?",
      answer:
        "useRef(initialValue) returns a plain object { current: initialValue } that is created once on mount and returned as the same object on every subsequent render. Mutating ref.current is completely invisible to React — it does not trigger a re-render. This is the fundamental difference from useState: use state when the UI must update when the value changes, use a ref when the value needs to persist across renders silently.",
    },
    {
      question: "What are the two main use cases for useRef?",
      answer:
        "The first is DOM access: attach the ref to a JSX element's ref attribute, and React writes the actual DOM node into ref.current after mount — allowing imperative calls like focus(), play(), or getBoundingClientRect(). The second is storing mutable instance variables that should not trigger re-renders: timer IDs, WebSocket connections, previous render values, abort controllers, and mounted/cancelled flags.",
    },
    {
      question: "Why is ref.current null during render?",
      answer:
        "React sets ref.current to the DOM node after the component mounts and commits to the DOM. During the render phase itself, the DOM element does not yet exist (or has been unmounted), so ref.current is null. Only access DOM refs inside useEffect, useLayoutEffect, or event handlers — never read ref.current in the render body expecting a DOM node to be there.",
    },
    {
      question: "How does useRef break stale closures in effects?",
      answer:
        "Store the latest value in a ref and update it after every render with a simple useEffect: useEffect(() => { valueRef.current = value }). Closures inside setInterval, WebSocket callbacks, or other long-lived functions can then read ref.current instead of a captured snapshot — they always get the current value without needing to list it as a dependency and without causing the effect to restart.",
    },
    {
      question: "What is forwardRef and when is it needed?",
      answer:
        "By default, you cannot attach a ref from a parent to a DOM element inside a child functional component — ref.current will be null. React.forwardRef wraps the child and gives it a second argument (the forwarded ref) that it can attach to any DOM element inside. It is used when building reusable input, button, or modal components where the consuming parent needs imperative control like focusing or measuring. React 19 removes the need for forwardRef — refs become regular props.",
    },
  ],

  "react-usememo-interview-questions": [
    {
      question: "What does useMemo do and what are its two use cases?",
      answer:
        "useMemo memoizes the result of a computation and returns the cached result on subsequent renders until its dependencies change. Its first use case is avoiding expensive recomputation — sorting large arrays, filtering datasets, building complex data structures. Its second, equally important use case is referential stability: returning the same object or array reference when inputs have not changed, which is what makes React.memo comparisons and useEffect dependency checks work correctly for non-primitive values.",
    },
    {
      question: "Does useMemo always improve performance?",
      answer:
        "No. useMemo has its own overhead on every render: it allocates memory for the cache, runs the dependency comparison, and retains the previous value. For trivial computations like string concatenation or simple arithmetic, the memoization cost exceeds the computation cost — useMemo makes things slower. It is only beneficial when the computation cost clearly exceeds the comparison overhead, which requires profiling with React DevTools to confirm.",
    },
    {
      question: "How does useMemo help React.memo work correctly?",
      answer:
        "React.memo does a shallow prop comparison. If you pass an object or array created inline as a prop, it is a new reference every render — React.memo can never skip. Wrapping the object in useMemo returns the same reference when the inputs have not changed, allowing React.memo to correctly detect no change and bail out of re-rendering the child. The pattern requires both useMemo on the parent and React.memo on the child.",
    },
    {
      question: "What is the difference between useMemo and useCallback?",
      answer:
        "useMemo memoizes the result of calling a function — it runs the function and caches its return value (a computed object, array, or primitive). useCallback memoizes the function itself — it returns a stable function reference without calling it. They are implemented identically under the hood: useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). The distinction is intent: useMemo for computed values, useCallback for stable function references.",
    },
    {
      question: "How does the React Compiler change the need for useMemo?",
      answer:
        "The React Compiler, shipping in React 19, automatically inserts memoization where it would be beneficial by statically analysing component code. It applies the equivalent of useMemo and useCallback calls without you writing them manually. The recommended practice is to write clean, unmemoised code first, then add manual useMemo only where profiling confirms a real bottleneck — the compiler handles the common cases automatically.",
    },
  ],

  "react-usecallback-interview-questions": [
    {
      question:
        "What does useCallback do and why does it not make functions faster?",
      answer:
        "useCallback returns the same function reference across renders until its dependencies change. It does nothing to the function's execution speed — the function body runs identically with or without useCallback. Its sole purpose is referential stability: ensuring the function reference does not change between renders so that downstream comparisons (React.memo prop checks, useEffect dependency arrays) see no change when nothing meaningful has changed.",
    },
    {
      question: "When does useCallback actually prevent a re-render?",
      answer:
        "useCallback alone never prevents a child re-render. The child must also be wrapped in React.memo. React.memo does a shallow comparison of props — if the function prop is a new reference every render, the comparison always fails and the child always re-renders. useCallback provides the stable reference; React.memo uses it to skip the render. Without React.memo on the child, useCallback adds comparison overhead with zero benefit.",
    },
    {
      question: "What is the stale callback problem with useCallback?",
      answer:
        "If a callback closes over state or props but does not list them as dependencies, the callback is created once and captures the values from that first render — they are stale for all future renders. The fix is to add the captured values to the dependency array. The alternative is the stable-callback pattern: store the latest function in a ref updated via useEffect, and expose a stable useCallback wrapper that calls ref.current — giving a stable reference that always invokes the latest version.",
    },
    {
      question: "Why should custom hooks always return memoised functions?",
      answer:
        "When a custom hook returns a function, the hook author does not know how consumers will use it. If the function is returned without useCallback, any consumer that puts it in a useEffect dependency array will have that effect re-run on every render — because the hook recreates the function every time. Wrapping returned functions in useCallback is a contract that the hook will not cause inadvertent infinite loops or excessive re-renders in consuming components.",
    },
    {
      question: "How is useCallback related to useMemo?",
      answer:
        "They are the same mechanism: useCallback(fn, deps) is exactly equivalent to useMemo(() => fn, deps). Both memoize based on dependencies — useMemo runs the function and caches its return value, while useCallback caches the function reference itself without calling it. The distinction is readability of intent, not any underlying difference in how React implements them.",
    },
  ],

  "react-usereducer-interview-questions": [
    {
      question: "What is useReducer and how is it different from useState?",
      answer:
        "useReducer manages state through a pure reducer function: (state, action) => newState. Instead of calling a setter with the new value directly (setState(42)), you dispatch a named action (dispatch({ type: 'INCREMENT' })) that describes what happened, and the reducer decides what changes. This separates 'what event occurred' from 'what state changes as a result', making complex state transitions explicit, named, and independently testable.",
    },
    {
      question: "When should you use useReducer instead of useState?",
      answer:
        "Reach for useReducer when multiple state fields update together based on the same event, when the next state depends on the previous in non-trivial ways, or when you want named transitions that serve as documentation. The clearest signal is finding yourself calling three or more state setters in a single event handler — those coordinated updates belong in a single reducer action that transitions the entire state atomically.",
    },
    {
      question: "Why must a reducer be a pure function?",
      answer:
        "React may call the reducer more than once for the same action (in Strict Mode during development). A pure reducer — no fetch calls, no localStorage writes, no console.log side effects — produces the same output for the same input regardless of how many times it is called. Side effects belong in the event handlers that dispatch actions or in useEffect that reacts to state changes. The reducer only handles state transitions.",
    },
    {
      question: "What is the lazy initialisation pattern in useReducer?",
      answer:
        "useReducer accepts an optional third argument: an init function. React calls init(initialArg) once on mount and uses the result as the initial state, avoiding re-running expensive setup on every render. The same init function can be reused inside the reducer for reset actions — dispatch({ type: 'RESET', payload: initialArg }) returns init(action.payload) — eliminating duplicated initial state construction logic.",
    },
    {
      question: "How does the useReducer + useContext pattern replace Redux?",
      answer:
        "Pair useReducer with two separate contexts: one for state and one for dispatch. Because useReducer's dispatch function is always a stable reference, components that only dispatch actions (buttons, forms) can consume the dispatch context and never re-render when state changes. Components that read state consume the state context and re-render when it updates. This gives a global state architecture — actions, reducer, single source of truth — without any external library.",
    },
    {
      question: "What is the key advantage of testing reducers separately?",
      answer:
        "A reducer is a pure JavaScript function — no React imports, no rendering, no async. You can import it directly and call it with different state and action combinations in plain unit tests: const next = cartReducer(state, { type: 'ADD', item }). This lets you cover every state transition exhaustively without mounting components, without act(), and without async overhead. Testing state logic in isolation is faster and catches edge cases that integration tests often miss.",
    },
  ],

  "react-usecontext-interview-questions": [
    {
      question: "What is React Context and what is it not?",
      answer:
        "Context is a transmission mechanism: it takes whatever value you give a Provider and makes it available to any component in that subtree that calls useContext, regardless of nesting depth. Context is not state management — it does not decide when or how state changes. useState and useReducer manage state; Context distributes it. Conflating the two leads to architectural mistakes like putting all application state in a single context object.",
    },
    {
      question: "What is the re-render trap with useContext?",
      answer:
        "Every component that calls useContext re-renders whenever the Provider's value prop reference changes — regardless of which fields the component actually reads. A component reading only user.name still re-renders when theme changes if both are in the same context object. This is the most important performance characteristic of Context and the reason large, frequently changing values should never go into a single shared context.",
    },
    {
      question: "How do you fix unnecessary re-renders caused by Context?",
      answer:
        "Split contexts by update frequency: theme changes infrequently (one context), notifications change constantly (another context). This way a component reading theme does not re-render when a notification arrives. A second technique is separating state from dispatch — useReducer's dispatch is always a stable reference, so components that only dispatch can read a dispatch-only context and never re-render when state changes.",
    },
    {
      question: "What is the custom hook wrapper pattern for Context?",
      answer:
        "Instead of calling useContext directly in components, export a custom hook that calls useContext internally and throws a clear error if the context is null: if (!ctx) throw new Error('useAuth must be inside AuthProvider'). This converts a silent undefined crash at runtime into an immediate, descriptive error during development. It also lets you add selectors, memoisation, or derived values in one place without changing consuming components.",
    },
    {
      question:
        "When should you use Context versus a dedicated state management library?",
      answer:
        "Context is appropriate for infrequently changing global values — authentication state, theme, locale, and feature flags that change once or twice per session. For values that update frequently (cart items on every interaction, search results on every keystroke, real-time data on every WebSocket message), use Zustand, Jotai, or Redux. These libraries have subscription optimisation that only re-renders components subscribed to the specific slice that changed — something Context cannot do.",
    },
  ],

  "react-custom-hook-interview-questions": [
    {
      question: "What is a custom hook in React?",
      answer:
        "A custom hook is a function whose name starts with 'use' and that calls other hooks inside it. It extracts a stateful behaviour — logic that spans multiple renders — and gives it a descriptive name. Custom hooks share logic, not state: two components using the same hook each get completely independent copies of all the hook's state and effects. To share state between components, you still need Context, a global store, or lifting state to a common ancestor.",
    },
    {
      question: "Why does the 'use' prefix matter beyond naming convention?",
      answer:
        "The 'use' prefix tells the React linter to enforce Rules of Hooks on that function — specifically the exhaustive-deps and rules-of-hooks checks. A function named fetchData that calls useState inside it silently loses all linting protection. The prefix is also what React DevTools uses to identify and display hook state. Omitting it does not just violate a convention — it causes real bugs that are hard to trace.",
    },
    {
      question: "What is the correct return shape for a custom hook?",
      answer:
        "Return an array (like useState) when the hook returns at most two values that consumers will typically rename — const [value, setValue] = useLocalStorage('key', 'default'). Return an object when the hook returns three or more values or when the names carry meaning that should not be lost — const { data, loading, error, refetch } = useFetch(url). Mixing the two or returning inconsistently makes hooks harder to use and document.",
    },
    {
      question: "How do you implement useFetch correctly?",
      answer:
        "A correct useFetch manages three state variables (data, loading, error), runs a fetch inside useEffect keyed to the URL, handles both loading and error states, guards against setting state after the component unmounts using a cancelled flag, and cancels in-flight requests using AbortController in the cleanup function. The cleanup aborts the request when the URL changes or the component unmounts, preventing race conditions and the 'state update on unmounted component' warning.",
    },
    {
      question: "Can custom hooks call other custom hooks?",
      answer:
        "Yes, and this composability is the key to a layered hook architecture. You can build domain-level hooks (useUserProfile, useCartItem) by composing infrastructure-level hooks (useFetch, useLocalStorage), which themselves compose primitive React hooks (useState, useEffect). Each layer hides the complexity of the layer below it. The consuming component calls a single domain hook and gets a clean API — all the fetch, caching, and storage logic is encapsulated inside.",
    },
    {
      question: "How do you test custom hooks?",
      answer:
        "Use renderHook from @testing-library/react. It creates a minimal host component specifically for running the hook inside React's runtime. Read the current values from result.current and wrap any calls that trigger state updates in act() to flush React's state queue. Test each returned value and function independently, and test cleanup by unmounting the renderHook result and verifying subscriptions or timers were correctly torn down.",
    },
  ],
  "react-rendering-performance-interview-questions": [
    {
      question: "What is rendering in React?",
      answer:
        "Rendering in React is the process of calling a component function to produce JSX, which is then converted into a Virtual DOM representation. On initial render, React builds the DOM from scratch. On updates, React re-renders components to compute the new Virtual DOM and then efficiently updates only the changed parts in the real DOM.",
    },
    {
      question: "What is reconciliation in React?",
      answer:
        "Reconciliation is the process React uses to compare the previous Virtual DOM with the new Virtual DOM after a re-render. It identifies what has changed and updates only those parts in the real DOM. React uses an optimized O(n) diffing algorithm based on assumptions like stable element types and the use of keys for list items.",
    },
    {
      question: "Why does React re-render components?",
      answer:
        "React re-renders a component when its state changes, its props change, or when a parent component re-renders. Context updates can also trigger re-renders. Importantly, a re-render does not always mean a DOM update — React first compares the new output with the previous one and only applies actual DOM changes if needed.",
    },
    {
      question: "What is the difference between render phase and commit phase?",
      answer:
        "The render phase is where React calculates what changes are needed by building and diffing the Virtual DOM. This phase can be paused or interrupted in concurrent mode. The commit phase is where React applies those changes to the real DOM and runs lifecycle methods or effects. The commit phase is synchronous and cannot be interrupted.",
    },
    {
      question: "How do keys improve performance in lists?",
      answer:
        "Keys help React uniquely identify elements in a list during reconciliation. When keys are stable, React can match elements between renders and update only the changed ones. Without proper keys or when using array indices, React may re-render or recreate unnecessary elements, leading to performance issues and UI bugs.",
    },
    {
      question: "What causes unnecessary re-renders in React?",
      answer:
        "Unnecessary re-renders are commonly caused by parent re-renders propagating to children, changing function or object references on every render, improper use of context, and missing memoization. Inline functions, new object literals, and unstable dependencies in hooks often trigger avoidable re-renders.",
    },
    {
      question: "How does React.memo help with performance?",
      answer:
        "React.memo is a higher-order component that prevents a functional component from re-rendering if its props have not changed. It performs a shallow comparison of props and skips rendering if they are equal. It is useful for optimizing pure components but should be used carefully to avoid unnecessary complexity.",
    },
    {
      question: "When should you use useMemo and useCallback?",
      answer:
        "useMemo is used to memoize expensive computations so they are only recalculated when dependencies change. useCallback is used to memoize function references to prevent unnecessary re-renders of child components. Both should be used only when there is a measurable performance issue, as overusing them can add complexity without real benefits.",
    },
    {
      question: "What is batching in React?",
      answer:
        "Batching is the process of grouping multiple state updates into a single re-render for performance optimization. In modern React, updates inside event handlers, timeouts, promises, and other async operations are automatically batched, reducing the number of renders and improving efficiency.",
    },
    {
      question: "What is concurrent rendering in React?",
      answer:
        "Concurrent rendering is a feature introduced in React 18 that allows React to interrupt, pause, and resume rendering work. It enables prioritization of updates, making the UI more responsive. Features like startTransition and useDeferredValue help mark non-urgent updates so React can handle them more efficiently.",
    },
    {
      question: "How can you optimize large lists in React?",
      answer:
        "Large lists can be optimized using techniques like virtualization (react-window or react-virtualized), pagination, and lazy loading. Virtualization renders only the visible portion of the list, significantly reducing DOM nodes and improving performance.",
    },
    {
      question: "Does React always update the DOM after re-render?",
      answer:
        "No, React does not always update the DOM after a re-render. It first compares the new Virtual DOM with the previous one using reconciliation. If there are no differences, React skips DOM updates entirely, making rendering efficient.",
    },
  ],
  "react-rendering-reconciliation-interview-questions": [
    {
      question: "What is rendering in React?",
      answer:
        "Rendering in React is the process of executing a component function to produce JSX, which is then converted into a Virtual DOM. React performs rendering whenever state, props, or context changes. The result is used to determine what updates are needed in the UI.",
    },
    {
      question: "What is reconciliation in React?",
      answer:
        "Reconciliation is the process where React compares the previous Virtual DOM with the new Virtual DOM after a re-render. It determines the minimal set of changes required and updates only those parts in the real DOM, making updates efficient.",
    },
    {
      question: "How does React's diffing algorithm work?",
      answer:
        "React uses an O(n) diffing algorithm based on two assumptions: elements of different types produce different trees, and keys help identify elements in lists. It compares elements at the same level and updates only what has changed instead of re-rendering the entire DOM.",
    },
    {
      question: "What triggers a re-render in React?",
      answer:
        "A re-render is triggered when a component's state changes, its props change, or when context values update. Additionally, when a parent component re-renders, child components may also re-render unless optimized using memoization.",
    },
    {
      question: "What is the difference between render phase and commit phase?",
      answer:
        "The render phase is where React calculates changes by creating and comparing Virtual DOM trees. This phase can be paused in concurrent mode. The commit phase is where React applies those changes to the real DOM and runs side effects like useEffect. This phase is synchronous and cannot be interrupted.",
    },
    {
      question: "Why are keys important in React lists?",
      answer:
        "Keys help React uniquely identify elements in a list during reconciliation. Stable keys allow React to efficiently update only changed elements. Without proper keys, React may re-render entire lists or cause unexpected UI bugs.",
    },
    {
      question: "Does React re-render the entire DOM on every update?",
      answer:
        "No, React re-renders the Virtual DOM but does not update the entire real DOM. It compares the new Virtual DOM with the previous one and updates only the parts that have changed, making it efficient.",
    },
    {
      question: "What is Virtual DOM and why is it used?",
      answer:
        "Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to efficiently compute differences between UI states and minimize direct DOM manipulations, which are expensive operations.",
    },
    {
      question: "How can you prevent unnecessary re-renders?",
      answer:
        "Unnecessary re-renders can be avoided using React.memo, useMemo, and useCallback. Maintaining stable references for props, avoiding inline object creation, and properly structuring state also help improve performance.",
    },
    {
      question: "What happens if keys are not used or are unstable?",
      answer:
        "If keys are missing or unstable (like using array index), React cannot correctly match elements during reconciliation. This can lead to unnecessary re-renders, performance issues, and bugs like incorrect state being preserved.",
    },
  ],
  "react-fiber-interview-questions": [
    {
      question: "What is React Fiber architecture?",
      answer:
        "React Fiber is the reconciliation engine introduced in React 16 that re-implemented how React updates the UI. It allows React to break rendering work into small units, pause and resume tasks, and prioritize updates, enabling smoother and more responsive user interfaces.",
    },
    {
      question: "Why was React Fiber introduced?",
      answer:
        "React Fiber was introduced to solve limitations of the previous stack reconciler, which was synchronous and blocked the main thread during large updates. Fiber enables incremental rendering, prioritization of updates, and interruption of low-priority work to improve performance and user experience.",
    },
    {
      question: "What are the render and commit phases in Fiber?",
      answer:
        "In Fiber, the render phase builds the new Fiber tree and performs reconciliation. This phase can be paused, aborted, or restarted. The commit phase applies the calculated changes to the real DOM and runs lifecycle methods or effects. The commit phase is synchronous and cannot be interrupted.",
    },
    {
      question: "What is a Fiber node in React?",
      answer:
        "A Fiber node is a JavaScript object that represents a unit of work in React's internal tree. It stores information about the component type, props, state, and relationships like parent, child, and sibling. Fiber nodes allow React to efficiently traverse and update the component tree.",
    },
    {
      question: "How does React Fiber improve performance?",
      answer:
        "React Fiber improves performance by enabling time slicing, prioritizing urgent updates, and breaking rendering into smaller chunks. This prevents long blocking operations on the main thread and allows React to keep the UI responsive even during complex updates.",
    },
  ],
  "react-concurrent-rendering-react-18-interview-questions": [
    {
      question: "What is concurrent rendering in React 18?",
      answer:
        "Concurrent rendering is a feature in React 18 that allows React to interrupt, pause, and resume rendering work. It enables React to prioritize important updates, making the UI more responsive by preventing long blocking renders on the main thread.",
    },
    {
      question:
        "How is concurrent rendering different from traditional rendering?",
      answer:
        "In traditional rendering, React processes updates synchronously and blocks the main thread until completion. In concurrent rendering, React can split work into smaller chunks, pause low-priority updates, and continue them later, improving responsiveness and user experience.",
    },
    {
      question: "What is startTransition in React?",
      answer:
        "startTransition is a React 18 API that allows you to mark certain state updates as non-urgent. React prioritizes urgent updates like user input over transitions, ensuring smoother interactions while deferring less critical UI updates.",
    },
    {
      question: "What is useDeferredValue and when should you use it?",
      answer:
        "useDeferredValue lets you defer updating a value until higher-priority updates are completed. It is useful for scenarios like search inputs or filtering large lists, where you want immediate input responsiveness while delaying expensive UI updates.",
    },
    {
      question:
        "Does concurrent rendering mean React runs everything in parallel?",
      answer:
        "No, concurrent rendering does not mean parallel execution. JavaScript is still single-threaded. Instead, React breaks rendering into smaller tasks and schedules them intelligently, allowing interruption and prioritization without blocking the main thread.",
    },
  ],

  "react-component-lifecycle-interview-questions": [
    {
      question: "What are the three phases of a React component's lifecycle?",
      answer:
        "Every React component passes through three phases: mounting (created and inserted into the DOM for the first time), updating (re-rendered because props or state changed), and unmounting (removed from the DOM). Class components expose explicit methods for each phase; functional components express the same phases through useEffect hooks.",
    },
    {
      question: "What is componentDidMount used for in React?",
      answer:
        "componentDidMount fires once after the component is first inserted into the DOM. It is the safe place to start data fetching, add event listeners, access DOM nodes via refs, and initialise third-party libraries that require the DOM to exist. The hooks equivalent is useEffect(fn, []) — an empty dependency array.",
    },
    {
      question: "What is the hooks equivalent of the class component lifecycle?",
      answer:
        "componentDidMount maps to useEffect(fn, []), componentDidUpdate maps to useEffect(fn, [deps]), and componentWillUnmount maps to the cleanup function returned from useEffect. shouldComponentUpdate maps to React.memo. There is no hooks equivalent for getSnapshotBeforeUpdate (approximate with useLayoutEffect + ref) or for getDerivedStateFromError and componentDidCatch (must use a class component).",
    },
    {
      question:
        "Why must you guard setState calls inside componentDidUpdate with a condition?",
      answer:
        "componentDidUpdate fires after every re-render. Calling setState inside it without comparing prevProps or prevState causes an infinite loop: setState triggers a re-render, which triggers componentDidUpdate, which calls setState again. The guard — if (prevProps.userId !== this.props.userId) — ensures setState only fires when a specific, meaningful change occurred.",
    },
    {
      question:
        "Why were componentWillMount, componentWillReceiveProps, and componentWillUpdate deprecated?",
      answer:
        "React's concurrent rendering can start a render, pause it, and restart — causing these methods to fire multiple times before anything is committed to the DOM. Any side effects inside them (data fetching, subscriptions, setState) would run multiple times unexpectedly. They were renamed with the UNSAFE_ prefix to signal this danger and are scheduled for full removal in a future React version.",
    },
    {
      question:
        "What is the difference between getDerivedStateFromError and componentDidCatch?",
      answer:
        "getDerivedStateFromError runs during the render phase when a child throws — its only job is to return a state update that triggers a fallback UI render. It must be pure with no side effects. componentDidCatch runs after the commit phase once the fallback is visible — it is the correct place to log errors to an external service like Sentry, because side effects are safe there.",
    },
  ],

  "react-virtual-dom-interview-questions": [
    {
      question: "What is the Virtual DOM in React?",
      answer:
        "The Virtual DOM is a lightweight JavaScript object tree that mirrors the structure of the real DOM and lives entirely in memory. React creates a new Virtual DOM tree after every render and compares it against the previous snapshot. Only the differences found during this comparison are written to the real DOM, which avoids expensive full-page repaints.",
    },
    {
      question: "How does React's diffing algorithm achieve O(n) complexity?",
      answer:
        "React reduces the theoretical O(n³) tree comparison to O(n) using two heuristics: when two elements have different types React destroys the old subtree and rebuilds it from scratch rather than comparing children; and for lists, React uses keys to match items by identity across renders instead of comparing every item at every position.",
    },
    {
      question:
        "What happens when you change the element type of a wrapper component?",
      answer:
        "React's diffing algorithm treats different element types as completely different trees. Changing a wrapper from div to section causes React to unmount the entire old subtree — destroying all state inside every child — and mount a brand new subtree. This is a common cause of unexpected state resets.",
    },
    {
      question: "Why is using array index as a key dangerous?",
      answer:
        "When items are filtered, sorted, or inserted, array indices shift. React uses the key to match a DOM node to a list item across renders. With index as key, index 0 after a filter maps to a different item than before, so React reuses the DOM node (and its state) from the old item in the new item's position — causing incorrect state preservation and missed updates.",
    },
    {
      question: "What is the difference between the render phase and commit phase?",
      answer:
        "The render phase runs component functions and diffs the new Virtual DOM against the previous one to produce a list of changes — it is pure computation with no DOM writes, and in concurrent mode it can be paused or restarted. The commit phase applies that change list to the real DOM synchronously in one uninterruptible pass, then fires layout effects and paint effects.",
    },
    {
      question: "Is the Virtual DOM always faster than direct DOM manipulation?",
      answer:
        "No. For a single isolated update, directly writing to the DOM is faster because the Virtual DOM adds diffing overhead. React's performance advantage comes from batching many state changes into a single reconciliation pass on complex UIs — the diffing cost is smaller than the cost of individual DOM operations that would otherwise fire separately.",
    },
  ],

  "react-controlled-uncontrolled-components-interview-questions": [
    {
      question: "What is a controlled component in React?",
      answer:
        "A controlled component is a form element whose value is driven entirely by React state. Every change the user makes fires an onChange handler that updates state, which triggers a re-render that sets the input's value. React state is the single source of truth — the DOM never independently holds the current value.",
    },
    {
      question: "What is an uncontrolled component in React?",
      answer:
        "An uncontrolled component manages its own value inside the DOM. You set the initial value with defaultValue (not value) and read the current value via a ref only when you need it — typically on form submit. React is unaware of the value between reads, which means no re-renders occur on each keystroke.",
    },
    {
      question:
        "What bug occurs when you pass undefined as a controlled input's value?",
      answer:
        "React determines whether an input is controlled or uncontrolled on the first render based on whether a value prop is present. Passing value={user?.name} when user is null initially means no value prop (uncontrolled), then a string value later (controlled). React warns about this switch and the input behaves unpredictably. Always provide a fallback: value={user?.name ?? ''}.",
    },
    {
      question: "Why are file inputs always uncontrolled in React?",
      answer:
        "File inputs are always uncontrolled because the browser enforces a security restriction that prevents JavaScript from programmatically setting a file input's value — a page cannot silently pre-select files. You must always read the selected file via a ref (fileRef.current.files[0]) or the event object.",
    },
    {
      question:
        "Why does React Hook Form outperform Formik on large forms?",
      answer:
        "React Hook Form uses uncontrolled inputs by default — inputs register with the form via refs, and values are read only on submit. Zero re-renders occur per keystroke. Formik uses controlled inputs where every field value lives in state, triggering a re-render of all subscribed components on every keystroke. The difference is negligible on small forms but significant on forms with 50+ fields.",
    },
  ],

  "react-error-boundaries-interview-questions": [
    {
      question: "What is a React Error Boundary?",
      answer:
        "An Error Boundary is a class component that catches JavaScript errors thrown during the rendering of its child component tree, shows a fallback UI instead of a blank screen, and keeps the rest of the application running. Without Error Boundaries, any unhandled render error propagates to the root and unmounts the entire app.",
    },
    {
      question:
        "What is the difference between getDerivedStateFromError and componentDidCatch?",
      answer:
        "getDerivedStateFromError fires during the render phase and must be a pure function — its only job is to return a state object that triggers the fallback render. componentDidCatch fires in the commit phase after the fallback is already visible — it is the right place to log errors to monitoring services because side effects are safe there.",
    },
    {
      question: "What types of errors do Error Boundaries not catch?",
      answer:
        "Error Boundaries only catch errors thrown during rendering, in lifecycle methods, and in constructors of children. They do not catch: errors inside event handlers (use try/catch there), errors in async code like setTimeout or fetch callbacks, errors in the Error Boundary component itself, or errors during server-side rendering.",
    },
    {
      question: "Why must Error Boundaries be class components?",
      answer:
        "Error Boundaries require getDerivedStateFromError and componentDidCatch — two lifecycle methods with no hooks equivalents. React has not shipped a useErrorBoundary hook. The react-error-boundary library provides a ready-made class component so you don't have to write one from scratch, and it also exposes a useErrorBoundary hook for triggering boundaries from functional components.",
    },
    {
      question: "How should Error Boundaries be placed for maximum resilience?",
      answer:
        "Place Error Boundaries at two granularities: route level so each page is isolated (a crash in /settings doesn't break /dashboard), and widget level around risky features like charts, maps, and third-party embeds. One root-level boundary is a last-resort safety net — not a strategy — because it makes the entire visible UI show the fallback on any error.",
    },
  ],

  "react-context-api-interview-questions": [
    {
      question: "What problem does the React Context API solve?",
      answer:
        "Context solves prop drilling — the pattern of passing data through intermediate components that don't use it just to reach a deeply nested component that does. With Context, a Provider broadcasts a value at any level and any descendant component can read it directly with useContext, without any intermediate component being aware of the data.",
    },
    {
      question: "How does changing a Context value trigger re-renders?",
      answer:
        "Every component that calls useContext(MyContext) re-renders whenever the Provider's value changes — React uses Object.is to compare the previous and new value. If the value is an object created inline in the Provider, it is a new reference on every parent render, causing all consumers to re-render even if the underlying data is identical. Fix this with useMemo on the value object.",
    },
    {
      question: "What is the createContext default value used for?",
      answer:
        "The default value passed to createContext(defaultValue) is used only when a component calls useContext but has no matching Provider above it in the tree. It is not the initial value of the Provider — the Provider's value prop controls what consumers receive. The default value primarily serves as a fallback for isolated testing and as a TypeScript type anchor.",
    },
    {
      question: "When should you use Context instead of Redux or Zustand?",
      answer:
        "Use Context for stable, infrequently changing ambient data that many components need to read: current user, theme, locale, and feature flags. Context has no selector system — every consumer re-renders on any value change — so it is a poor fit for frequently updating state. Redux and Zustand provide selective subscriptions, meaning a component watching cart.total doesn't re-render when user.name changes.",
    },
    {
      question: "How do you prevent unnecessary re-renders caused by Context?",
      answer:
        "Split one large context into multiple smaller contexts by update frequency. A ThemeContext and a UserContext are better than one AppContext — a button reading theme doesn't re-render when the user logs out. Additionally, separate state from dispatch: useReducer's dispatch is always a stable reference, so components that only dispatch can consume a dispatch-only context and never re-render when state changes.",
    },
  ],

  "react-higher-order-components-interview-questions": [
    {
      question: "What is a Higher Order Component (HOC) in React?",
      answer:
        "A Higher Order Component is a function that takes a component as an argument and returns a new, enhanced component. It adds cross-cutting behaviour — authentication checks, loading states, analytics tracking, error logging — without modifying the original component. The naming convention is to prefix with 'with': withAuth(Dashboard) returns a new component that checks auth before rendering Dashboard.",
    },
    {
      question: "What are the three conventions every HOC must follow?",
      answer:
        "First, always spread props through: return <WrappedComponent {...props} /> — never swallow props or the wrapped component won't receive what its parent passed. Second, set displayName so React DevTools shows withAuth(Dashboard) instead of a generic function name. Third, use React.forwardRef if the HOC might receive a ref — HOCs break ref forwarding by default because the ref attaches to the wrapper, not the underlying component.",
    },
    {
      question: "Why do HOCs break ref forwarding?",
      answer:
        "HOCs return a new component that wraps the original. When a parent attaches a ref to the HOC-wrapped component, the ref points to the HOC's function component — not to the underlying DOM node or class instance. The fix is to wrap the HOC's inner component with React.forwardRef and pass the forwarded ref through as the ref prop to WrappedComponent.",
    },
    {
      question: "When should you prefer a custom hook over a HOC?",
      answer:
        "Prefer a custom hook whenever the shared logic does not need to render any JSX around the component. Custom hooks add no component tree depth, can't collide on prop names with the wrapped component's own props, don't require forwardRef, and are visible in the component's own code. HOCs are still the right choice for class components (which can't use hooks) and for React.memo.",
    },
    {
      question: "What is the danger of defining a HOC inside another component's render?",
      answer:
        "Defining a HOC inside render creates a new component type on every render. React identifies components by referential identity — seeing a new type at the same position in the tree makes it unmount the old component and mount a fresh one, resetting all state. HOCs must always be defined at module scope, outside of any component function.",
    },
  ],

  "react-portals-interview-questions": [
    {
      question: "What is a React Portal and what problem does it solve?",
      answer:
        "A React Portal renders a component's DOM output into a different DOM node than its parent — typically document.body — while keeping it inside the React component tree. It solves the CSS stacking context problem: a modal rendered inside a component with overflow:hidden or a low z-index will be clipped or hidden. Portalling the modal to document.body places it outside any constraining ancestor.",
    },
    {
      question: "How do you create a Portal in React?",
      answer:
        "Use ReactDOM.createPortal(children, domNode). The first argument is the React children to render — any valid JSX. The second is the target DOM node to render into, such as document.body or document.getElementById('modal-root'). The component renders into the target DOM node while remaining a child of the component that called createPortal in the React tree.",
    },
    {
      question: "Do events inside a Portal bubble through the React tree or the DOM tree?",
      answer:
        "Events bubble through the React component tree, not the DOM tree. Even though a portal's DOM nodes are in document.body, a click inside the portal bubbles up through the React ancestors of the component that rendered the portal — not through body's DOM ancestors. This means React parent handlers will fire for events inside the portal, which can cause unexpected double-handling if not handled with stopPropagation.",
    },
    {
      question: "What accessibility requirements come with using Portals for modals?",
      answer:
        "Portalling a modal into body does not automatically make it accessible. You must: move keyboard focus into the modal when it opens and restore focus to the trigger element when it closes; trap focus so keyboard users cannot tab into background content (use focus-trap-react); add role='dialog' and aria-modal='true' to the modal container; and provide an accessible title with aria-labelledby.",
    },
    {
      question: "When should you NOT use a Portal?",
      answer:
        "Avoid portals when the parent component has no overflow:hidden, no CSS transform, and a sufficient z-index. In that case, a simple position:fixed with a high z-index works just as well without the added complexity of managing a separate DOM container, event propagation nuances, and accessibility plumbing. Only reach for portals when you're actually fighting a CSS stacking context.",
    },
  ],

  "react-code-splitting-interview-questions": [
    {
      question: "What is code splitting and why does it matter?",
      answer:
        "Code splitting breaks the JavaScript bundle into smaller chunks that load on demand instead of all at once. Without it, every user downloads the entire application — including code for pages they may never visit — on first load. Splitting at route boundaries means a user visiting /home never downloads /admin code, reducing initial load time and improving Time to Interactive.",
    },
    {
      question: "How does React.lazy work?",
      answer:
        "React.lazy accepts a function that calls dynamic import() and returns a Promise resolving to a module with a default export. React treats the wrapped component as lazily loaded — its JavaScript chunk is not fetched until the component is first rendered. While the chunk is downloading, the nearest Suspense ancestor shows its fallback UI.",
    },
    {
      question: "What is the role of Suspense in lazy loading?",
      answer:
        "Suspense is the loading boundary that shows a fallback UI while a lazy component's chunk is downloading. It can wrap one or many lazy components — it shows its fallback if any child is still loading. Nested Suspense boundaries give different sections their own independent loading states and skeletons.",
    },
    {
      question: "Why must React.lazy be paired with an Error Boundary?",
      answer:
        "Lazy loading can fail — the network may be unreliable, a deployment may have changed the chunk filename, or the user may be offline. Without an Error Boundary, a failed chunk load throws an unhandled error that crashes the entire app. An Error Boundary wrapping the Suspense catches the load failure and shows a retry UI instead.",
    },
    {
      question: "Why does React.lazy only work with default exports?",
      answer:
        "React.lazy expects a Promise that resolves to a module object with a default property — it calls module.default to get the component. Named exports have no default. The workaround is either exporting the component as default in a dedicated file, or using the .then() pattern: React.lazy(() => import('./file').then(m => ({ default: m.NamedExport }))).",
    },
  ],

  "react-server-components-interview-questions": [
    {
      question: "What are React Server Components?",
      answer:
        "React Server Components (RSC) are components that run exclusively on the server and never ship their JavaScript to the browser. They can fetch data directly, access secrets and databases, and import heavy server-only libraries — all with zero bundle size impact. They return a serialized React tree (not HTML) that the client uses to update the UI.",
    },
    {
      question: "What is the difference between RSC and Server-Side Rendering?",
      answer:
        "SSR (Server-Side Rendering) runs React on the server, converts the component tree to HTML, sends it to the client, then ships the same JavaScript bundle so the client can hydrate and make the page interactive. RSC components run only on the server — their JavaScript is never sent to the client at all. You can combine both: use RSC for data fetching (zero bundle cost) and SSR to generate the initial HTML for fast first paint.",
    },
    {
      question: "What does the 'use client' directive do?",
      answer:
        "'use client' at the top of a file marks it — and everything imported by it — as a Client Component. In the Next.js App Router, every component is a Server Component by default. 'use client' creates a boundary: code above it stays on the server; code below runs on the client. It does not mean the component only renders on the client — Client Components are still server-rendered to HTML on first load in Next.js.",
    },
    {
      question: "What can you NOT do in a React Server Component?",
      answer:
        "Server Components cannot use useState, useReducer, useEffect, or any other hook that requires the React runtime on the client. They cannot attach event handlers (onClick, onChange), use browser APIs (window, document, localStorage), or consume Context with useContext. Any component that needs interactivity or browser access must be marked 'use client'.",
    },
    {
      question: "How does data fetching work in Server Components?",
      answer:
        "Server Components are async functions — you can use async/await directly in the component body. No useEffect, no useState for loading/error, no API route needed. async function ProductList() { const products = await db.product.findMany(); return <ul>...</ul>; } — the data is fetched on the server before the component's output is sent to the client.",
    },
    {
      question: "What are Server Actions in React?",
      answer:
        "Server Actions are async functions marked with 'use server' that run on the server but can be called from Client Components — like an RPC call without a manual API route. They are used for mutations: creating, updating, or deleting data. After a Server Action completes, you can call revalidatePath() or revalidateTag() to clear the cache and trigger a fresh server render of affected pages.",
    },
  ],

  "react-props-interview-questions": [
    {
      question: "What are props in React?",
      answer:
        "Props are a component's function arguments — read-only data passed from a parent component to a child. A component must never modify the props it receives. If the displayed value needs to change, the parent must pass different props. Props can be any JavaScript value: strings, numbers, objects, arrays, functions, and JSX.",
    },
    {
      question: "What is one-way data flow in React?",
      answer:
        "One-way data flow means data moves in one direction: from parent to child via props. A child component cannot directly change its parent's state. This makes data flow predictable — you always know where a value comes from and that only one thing controls it. To send changes back up, a parent passes a callback function as a prop and the child calls it.",
    },
    {
      question: "How does a child component communicate changes to its parent?",
      answer:
        "The parent passes a callback function as a prop. The child calls this callback when something happens, passing the new value as an argument. The parent's callback updates state, which causes a re-render, passing the updated value back down as a prop. Data flows down; events flow up through function calls.",
    },
    {
      question: "What is prop drilling and how do you solve it?",
      answer:
        "Prop drilling is when a value is passed through intermediate components that don't need it — just to reach a deeply nested component that does. The first solution to try is component composition: restructure so the component that needs the data is rendered higher up and passed as children. If many disconnected components across the tree need the same value, React Context is the right solution.",
    },
    {
      question: "What is the children prop in React?",
      answer:
        "children is a regular prop whose value is whatever JSX you place between a component's opening and closing tags. function Card({ children }) { return <div className='card'>{children}</div>; } — anything inside <Card>...</Card> becomes the children prop. This enables composable layout components that don't need to know what they're rendering.",
    },
    {
      question: "When should a value be a prop versus state?",
      answer:
        "If the data is passed in from outside the component, it is a prop. If the component creates and controls the data itself, it is state. If two sibling components need to share the same value, lift it to their closest common ancestor as state and distribute it as props. If many unrelated components across the tree need it, use Context or an external store.",
    },
  ],

  "react-state-management-interview-questions": [
    {
      question: "What are the different layers of state management in React?",
      answer:
        "React state management exists on a spectrum: useState for local state owned by a single component, lifting state up for state shared between siblings, Context API for ambient data many components read infrequently, and external stores (Zustand, Redux) for frequently changing global state with selective subscriptions. Server state — data fetched from an API — is best managed by a dedicated library like React Query.",
    },
    {
      question: "When should you use Context instead of Zustand or Redux?",
      answer:
        "Use Context for stable, infrequently changing global values: the current user, theme, locale, or feature flags. Context has no selector system — all consumers re-render when the value changes — making it a poor fit for frequently updating state. Zustand and Redux provide selective subscriptions so a component watching cart.total doesn't re-render when user.name changes.",
    },
    {
      question: "What is server state and how is it different from UI state?",
      answer:
        "Server state is data that lives on a remote server and is fetched into the client — user profiles, product lists, orders. It has unique challenges: it can become stale, needs caching, deduplication, and background refresh. UI state is local and always current — form values, selected tabs, modal open/closed. React Query (TanStack Query) is purpose-built for server state; useState and useReducer handle UI state.",
    },
    {
      question: "When should you choose useReducer over useState?",
      answer:
        "Switch to useReducer when multiple state fields must update together based on the same event, when state transitions are complex enough to deserve named actions, or when you want to test state logic independently. The clearest signal is calling three or more state setters inside a single event handler — those coordinated updates belong in a single reducer action that transitions the entire state atomically.",
    },
    {
      question: "What is URL state and when should you use it?",
      answer:
        "URL state stores values in the URL's query parameters or path segments — search queries, active filters, pagination, and selected tabs. It persists across page refreshes, is shareable via link, and works with the browser back button. Use useSearchParams (React Router) or Next.js's router to read and write URL state instead of putting these values in component state where they'd be lost on refresh.",
    },
    {
      question: "What is the core rule for deciding where state should live?",
      answer:
        "Keep state as local as possible and only promote it up the tree when you have a concrete reason. If one component needs it, use useState locally. If siblings need to share it, lift it to their nearest common ancestor. If many disconnected components need it and it changes rarely, use Context. If it changes frequently across many components, use an external store. Never add a state management library before identifying a concrete problem it solves.",
    },
  ],

};

export const TYPESCRIPT_TOPIC_FAQS: Record<string, FAQItem[]> = {
  "typescript-types-vs-interfaces-interview-questions": [
    {
      question: "What is the difference between type and interface in TypeScript?",
      answer:
        "Both describe object shapes and are mostly interchangeable for that purpose. Interfaces support declaration merging — declaring the same interface name twice merges both definitions. Type aliases support unions, intersections, conditional types, mapped types, and template literal types. The TypeScript team recommends interface for object/class contracts and type for complex compositions involving union or transformation.",
    },
    {
      question: "Can an interface extend a type alias in TypeScript?",
      answer:
        "Yes, an interface can extend a type alias using the extends keyword, as long as the type alias resolves to an object type. Conversely, a type alias can include an interface via intersection: type Admin = User & { role: string }. Both approaches produce structurally equivalent results, though interface extension provides better error messages for property conflicts.",
    },
    {
      question: "What is declaration merging and why does it matter?",
      answer:
        "Declaration merging allows you to declare the same interface name multiple times and TypeScript merges all declarations into a single type. This is the mechanism behind module augmentation — extending third-party library types by declaring the module and adding properties to existing interfaces. Type aliases cannot be merged; attempting to declare the same type name twice is an error.",
    },
    {
      question: "When does TypeScript infer a type as an interface vs a type alias?",
      answer:
        "TypeScript does not distinguish between the two at the structural level — a value satisfying one can be used where the other is expected. The distinction matters only for declaration merging (interface only), mapped and conditional transformations (type only), and error message quality. In hover tooltips and error messages, interfaces often show the name while complex type aliases expand to their full definition.",
    },
    {
      question: "Is there a performance difference between type and interface in TypeScript?",
      answer:
        "For simple object shapes, interfaces are slightly more efficient because they are cached by name in the type checker, while complex type aliases may be re-evaluated. For most real-world code the difference is negligible. The TypeScript team's advice is to prefer interface for objects used across large type hierarchies, but this is a micro-optimization that should not drive everyday decisions.",
    },
    {
      question: "Which should you default to: type or interface?",
      answer:
        "Default to interface for object types, classes, and public API contracts — it reads naturally as a contract and supports merging. Default to type for unions, intersections, utility type derivations, function signatures, and tuple types — things interface cannot express. If you start with interface and hit a limitation, switching to type is always an option.",
    },
  ],

  "typescript-generics-interview-questions": [
    {
      question: "What are TypeScript generics and why are they useful?",
      answer:
        "Generics are type parameters that make components work over many types while preserving type safety. Without generics you must choose between too-restrictive (works only for number[]) or too-permissive (accepts any[] and loses type information). A generic like first<T>(arr: T[]): T works for any array and the compiler tracks exactly which type flows through — giving full autocomplete and error detection.",
    },
    {
      question: "How do you constrain a generic type parameter in TypeScript?",
      answer:
        "Use the extends keyword: function getLength<T extends { length: number }>(x: T). This means T must structurally satisfy the constraint — it must have a length property of type number. TypeScript will reject any type argument that does not satisfy the constraint. Multiple constraints can be combined with intersection: T extends Serializable & Validatable.",
    },
    {
      question: "What is the difference between a generic constraint and a generic default?",
      answer:
        "A constraint (T extends U) limits what types can be used as T — all callers must provide a type that satisfies the constraint. A default (T = U) provides a fallback type when the caller does not explicitly provide one — TypeScript infers or uses the default. Both can be combined: T extends string = string means T must be a string type, defaulting to the base string if not specified.",
    },
    {
      question: "What is the infer keyword in TypeScript generics?",
      answer:
        "infer is used inside conditional types to capture a type extracted from another type. type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never — infer R captures the return type of T if T is a function. Without infer, you could not write utility types that extract inner types. infer is the mechanism behind ReturnType, Parameters, InstanceType, and Awaited.",
    },
    {
      question: "How does TypeScript infer generic type parameters?",
      answer:
        "TypeScript infers type parameters from function arguments at the call site. When you call identity(42), TypeScript infers T = number from the argument. When inference is ambiguous or insufficient, you can provide explicit type arguments: identity<number>(42). TypeScript also infers from return type context and assignment targets in some cases.",
    },
    {
      question: "What is a higher-kinded type and does TypeScript support it?",
      answer:
        "Higher-kinded types (HKTs) are type constructors that abstract over other type constructors — essentially generics over generics. TypeScript does not natively support HKTs. Common workarounds include encoding them through interface merging (as in fp-ts), using conditional types to simulate them, or restructuring the problem to avoid needing them. Libraries like Effect and fp-ts use advanced encoding patterns to approximate HKTs.",
    },
  ],

  "typescript-utility-types-interview-questions": [
    {
      question: "What are TypeScript utility types?",
      answer:
        "Utility types are built-in generic types that transform other types. They are implemented using mapped types, conditional types, and keyof internally — you could write them yourself, but TypeScript ships them in the standard library. The most commonly used are Partial<T>, Required<T>, Readonly<T>, Pick<T,K>, Omit<T,K>, Record<K,V>, Exclude<T,U>, Extract<T,U>, NonNullable<T>, ReturnType<T>, and Parameters<T>.",
    },
    {
      question: "What is the difference between Partial and Required?",
      answer:
        "Partial<T> makes every property in T optional by adding ? to each key. Required<T> does the opposite — it removes the optional marker from every property, making all of them required. Both are shallow — they only affect the top level of the type. For deep optionality or deep required, you need a recursive custom utility type like DeepPartial<T>.",
    },
    {
      question: "When would you use Record over an index signature?",
      answer:
        "Record<K, V> is preferred when the set of keys is a known union of literals — Record<'active'|'inactive', number> ensures all specified keys are present and have the right type. An index signature { [key: string]: V } allows any string key and makes no guarantee about presence. Record produces a more precise type when you know the exact keys upfront.",
    },
    {
      question: "How do you combine multiple utility types?",
      answer:
        "Utility types compose naturally since they all produce types. type Patch = Required<Pick<User, 'id'>> & Partial<Omit<User, 'id'>> creates a patch type where id is required and all other fields are optional. Combining Awaited with ReturnType extracts the resolved value type of async functions. Complex transformations can be broken into named intermediate types for readability.",
    },
    {
      question: "What does NonNullable<T> do and when do you need it?",
      answer:
        "NonNullable<T> removes null and undefined from T, producing the non-nullable version. NonNullable<string | null | undefined> is string. It is useful when you receive a potentially null value (from an optional prop, a database query, or a Map lookup) and need to pass it to a function that expects a definite value. With strictNullChecks enabled, TypeScript enforces these distinctions.",
    },
  ],

  "typescript-type-guards-narrowing-interview-questions": [
    {
      question: "What is type narrowing in TypeScript?",
      answer:
        "Type narrowing is the process by which TypeScript refines the type of a variable within a conditional block based on runtime checks. After if (typeof x === 'string'), TypeScript knows x is string inside the block. Narrowing techniques include typeof, instanceof, the in operator, equality checks against literal values, discriminated union switches, and custom type predicates.",
    },
    {
      question: "What is the difference between a type guard and a type assertion?",
      answer:
        "A type guard is a runtime check that TypeScript recognizes and uses to narrow the type — typeof, instanceof, and type predicate functions. A type assertion (as Type) is a compile-time instruction that overrides TypeScript's type checking without any runtime validation. Type guards are safe; assertions can lie to the compiler and cause runtime errors if the actual value does not match.",
    },
    {
      question: "How do you write a custom type predicate function in TypeScript?",
      answer:
        "Annotate the return type as parameterName is Type: function isUser(val: unknown): val is User { return typeof val === 'object' && val !== null && 'id' in val && 'name' in val }. When this function returns true, TypeScript narrows the parameter to User in the calling scope. The runtime checks inside the function are your responsibility — TypeScript trusts the predicate annotation.",
    },
    {
      question: "What is a discriminated union and how does it help with narrowing?",
      answer:
        "A discriminated union has a shared literal property (the discriminant) across all union members. TypeScript uses this property to narrow the type in switch or if statements. type Result = { status: 'ok'; data: User } | { status: 'error'; message: string } — checking result.status === 'ok' narrows result to the first member, giving type-safe access to data.",
    },
    {
      question: "What does the never type tell you about exhaustiveness?",
      answer:
        "After narrowing through all members of a discriminated union, the remaining type is never. Assigning to a variable typed as never in the default case acts as an exhaustiveness check — if you add a new union member without handling it, TypeScript cannot assign the new member to never and reports an error. This pattern ensures switch statements are always kept up to date with the union definition.",
    },
    {
      question: "What is an assertion function in TypeScript?",
      answer:
        "An assertion function has the return type annotation asserts condition or asserts parameterName is Type. It throws if the condition is false and TypeScript narrows the type for all code after the call. function assertDefined<T>(val: T | null): asserts val is T — after calling assertDefined(user), TypeScript knows user is T for the rest of the scope, without needing an explicit if block.",
    },
  ],

  "typescript-union-intersection-types-interview-questions": [
    {
      question: "What is a union type in TypeScript?",
      answer:
        "A union type (A | B) means a value can be one of the listed types. TypeScript only allows operations that are valid for every member of the union — accessing a property only on one member requires narrowing first. Unions are the foundation of discriminated unions, optional function parameters, and function overloads that return different types based on input.",
    },
    {
      question: "What is an intersection type in TypeScript?",
      answer:
        "An intersection type (A & B) combines multiple types into one that must satisfy all of them simultaneously. type Admin = User & { permissions: string[] } creates a type with all User properties plus the permissions array. Intersection is used to mix in behaviors, merge configurations, and create composite types without inheritance.",
    },
    {
      question: "What happens when you intersect two types that have conflicting properties?",
      answer:
        "If two intersected types have the same property name but different types, the intersection of that property becomes the intersection of both types. For primitive types like string and number, the result is never — no value can be both. For object types, the properties merge. This is why type intersection sometimes silently creates never properties that cause confusing errors downstream.",
    },
    {
      question: "What is the difference between union narrowing and intersection?",
      answer:
        "A union expands the set of possible types — a variable can be any one of the listed options. Narrowing reduces that set at a point in code based on a runtime check. An intersection contracts the required type — the value must satisfy all constraints simultaneously. Union is about OR; intersection is about AND; narrowing is about progressively proving which branch of a union you are in.",
    },
    {
      question: "How do you discriminate a union in TypeScript?",
      answer:
        "Add a shared literal property with a unique value to each union member. TypeScript uses this discriminant property to narrow the union in conditional blocks. The discriminant must be a literal type (a specific string, number, or boolean value), not just any string. Using a switch statement on the discriminant is the idiomatic TypeScript pattern for processing discriminated unions.",
    },
  ],

  "typescript-classes-access-modifiers-interview-questions": [
    {
      question: "What are the access modifiers in TypeScript?",
      answer:
        "TypeScript has four access modifiers: public (accessible everywhere, the default), private (accessible only within the class body), protected (accessible within the class and all subclasses), and readonly (prevents reassignment after initialization, can be combined with any access modifier). TypeScript's private is erased at compile time. The ECMAScript # private fields syntax provides genuine runtime privacy.",
    },
    {
      question: "What is the difference between TypeScript private and JavaScript # private?",
      answer:
        "TypeScript's private keyword is a compile-time check only — at runtime the property is fully accessible via JavaScript. The # prefix (ES private fields) is enforced by the JavaScript engine: accessing a # field outside the class body throws a TypeError at runtime. Use # when genuine runtime privacy is required, such as in libraries where consumers may bypass TypeScript.",
    },
    {
      question: "What is an abstract class in TypeScript?",
      answer:
        "An abstract class cannot be instantiated directly — it serves as a base class that subclasses must extend. Abstract methods declared inside it (with the abstract keyword and no body) must be implemented by all concrete subclasses. Abstract classes can contain both abstract methods and concrete implementations with shared logic, which is not possible with interfaces.",
    },
    {
      question: "What is the parameter property shorthand in TypeScript?",
      answer:
        "Parameter properties let you declare and initialize class fields directly in the constructor signature: constructor(private name: string, readonly id: number) declares both fields and assigns them from the arguments in one line. Without this shorthand, you would need to declare the field, add the constructor parameter, and write the assignment separately — three steps reduced to one.",
    },
    {
      question: "What does the override keyword do in TypeScript?",
      answer:
        "The override keyword, introduced in TypeScript 4.3, marks a method as intentionally overriding a parent class method. TypeScript errors if the parent class does not have a method with that name or if the signature is incompatible. This prevents silent bugs when a parent method is renamed — without override, the child method becomes an unrelated new method rather than an override.",
    },
    {
      question: "What is the difference between an abstract class and an interface?",
      answer:
        "An abstract class can contain implemented methods, constructors, instance fields, and access modifiers — it is a partial implementation. An interface is purely structural and contains no implementation. A class can implement multiple interfaces but extend only one abstract class. Use an interface when defining a contract; use an abstract class when sharing implementation across subclasses.",
    },
  ],

  "typescript-enums-interview-questions": [
    {
      question: "What is a TypeScript enum?",
      answer:
        "An enum is a named set of related constants that can be numeric or string-based. Numeric enums auto-increment from 0 by default and support reverse mapping (looking up the name by value). String enums require an explicit value for each member and do not have reverse mapping. Enums compile to JavaScript objects that exist at runtime, unlike most TypeScript constructs.",
    },
    {
      question: "What is the problem with numeric enums in TypeScript?",
      answer:
        "Numeric enums are not type-safe: TypeScript accepts any number where a numeric enum is expected, not just the declared members. Direction.Up is 0, but TypeScript also accepts 99 as a Direction. This is a known design decision but surprises developers expecting strict enum safety. String enums do not have this problem — only declared string members are accepted.",
    },
    {
      question: "What is a const enum and when should you avoid it?",
      answer:
        "A const enum is fully erased at compile time — every usage is replaced with the literal value and no JavaScript object is emitted. This reduces bundle size but prevents any runtime access to the enum. Const enums should be avoided in library code published to consumers, because isolatedModules compilation (used by Babel, esbuild, and Vite) cannot inline const enums from external declaration files.",
    },
    {
      question: "What is the recommended alternative to TypeScript enums?",
      answer:
        "The most versatile alternative is a const object with as const combined with a derived union type: const Status = { Active: 'ACTIVE', Inactive: 'INACTIVE' } as const; type Status = typeof Status[keyof typeof Status]. This provides dot-notation access, string literal union type safety, no runtime overhead beyond the object, no reverse mapping surprises, and compatibility with string literals directly.",
    },
    {
      question: "Can you add methods to a TypeScript enum?",
      answer:
        "Standard TypeScript enums cannot have methods. If you need behavior associated with enumerated values, use a class with static readonly members, a const object combined with helper functions, or a discriminated union. For rich enum-like patterns with methods, some developers use a class with a private constructor and static instances — the Value Object pattern.",
    },
  ],

  "typescript-mapped-types-interview-questions": [
    {
      question: "What is a mapped type in TypeScript?",
      answer:
        "A mapped type creates a new type by iterating over the keys of an existing type: { [K in keyof T]: NewType }. K takes on each key of T in turn and the expression defines the type for that key in the output. Mapped types are the foundation of Partial, Required, Readonly, and Record — all four are implemented as mapped types in TypeScript's standard library.",
    },
    {
      question: "How do you add or remove the optional modifier in a mapped type?",
      answer:
        "Use +? to add optionality and -? to remove it. The + is implicit by default. type Required<T> = { [K in keyof T]-?: T[K] } removes the optional flag from every property. type Partial<T> = { [K in keyof T]?: T[K] } adds it. Similarly, +readonly and -readonly control the readonly modifier.",
    },
    {
      question: "What is key remapping in TypeScript mapped types?",
      answer:
        "Key remapping uses the as clause to transform key names: { [K in keyof T as NewKeyType]: T[K] }. Combined with template literal types, it can generate getter/setter names from property names. Using never as the remapped key filters that key from the output entirely — enabling a PickByValue pattern that keeps only keys whose values match a condition.",
    },
    {
      question: "How do mapped types enable homomorphic transformations?",
      answer:
        "A mapped type is homomorphic when it maps over keyof T — it preserves the optionality and readonly modifiers of the original type's properties unless explicitly overridden. Partial<T>, Readonly<T>, and Required<T> are all homomorphic. A mapped type that maps over a hard-coded union like { [K in 'a'|'b']: number } is not homomorphic and always produces required, mutable properties.",
    },
    {
      question: "What is the difference between a mapped type and an index signature?",
      answer:
        "An index signature { [key: string]: V } allows any string key and makes no guarantees about which specific keys exist. A mapped type { [K in keyof T]: NewType } iterates over exactly the known keys of T, preserving their names and modifiers. Mapped types are precise and closed; index signatures are open and dynamic. TypeScript treats them differently in narrowing, compatibility checking, and error messages.",
    },
  ],

  "typescript-conditional-types-interview-questions": [
    {
      question: "What are conditional types in TypeScript?",
      answer:
        "Conditional types use the form T extends U ? X : Y — if type T is assignable to U, the result is X, otherwise Y. They enable type-level computation and are the mechanism behind utility types like NonNullable<T>, ReturnType<T>, Awaited<T>, and Exclude<T,U>. Conditional types are lazily resolved — TypeScript defers evaluation when the type argument is not yet fully known.",
    },
    {
      question: "What is distributive behavior in conditional types?",
      answer:
        "When a conditional type has a naked type parameter (T, not [T]), TypeScript distributes the condition over each member of a union. type ToArray<T> = T extends any ? T[] : never — applying this to string | number produces string[] | number[]. To prevent distribution and treat the union as a whole, wrap both sides in brackets: [T] extends [any] ? T[] : never.",
    },
    {
      question: "How does infer work in conditional types?",
      answer:
        "infer declares a new type variable inside the extends clause of a conditional type and captures the type at that position. type FirstArg<T> = T extends (first: infer A, ...args: any[]) => any ? A : never captures the first parameter's type. infer can appear multiple times in a single conditional to extract multiple types simultaneously.",
    },
    {
      question: "How do you use conditional types to filter a union?",
      answer:
        "Define a conditional type that returns never for members you want to remove and the member itself for those you want to keep. type OnlyStrings<T> = T extends string ? T : never — apply to a union to keep only string members. Since never is dropped from unions, the result contains only the members that satisfied the condition. This is exactly how Exclude and Extract are implemented.",
    },
    {
      question: "What does deferred conditional type resolution mean?",
      answer:
        "When a conditional type depends on a generic type parameter that is not yet resolved, TypeScript defers the evaluation rather than immediately computing it. Inside a generic function body, T extends string ? A : B remains unevaluated. TypeScript only resolves it when the function is called with a concrete type. This can cause unexpected behavior when you try to assign a deferred conditional type to a specific type.",
    },
  ],

  "typescript-decorators-interview-questions": [
    {
      question: "What are decorators in TypeScript?",
      answer:
        "Decorators are functions prefixed with @ that can be applied to classes, methods, properties, accessors, and parameters to add metadata or modify behavior at runtime. They are heavily used in Angular and NestJS for dependency injection, routing, and validation. TypeScript's experimental decorators (--experimentalDecorators) follow a legacy proposal; the finalized ECMAScript Stage 3 decorator proposal is also supported in newer TypeScript versions.",
    },
    {
      question: "What is the difference between experimental decorators and Stage 3 decorators?",
      answer:
        "Experimental decorators (enabled by --experimentalDecorators) implement an older TC39 proposal that was never standardized. They work differently — particularly around class fields — and emit reflect-metadata calls. Stage 3 decorators (the standardized proposal, supported in TypeScript 5.0+) have a different execution model and API. The two systems are not compatible, and existing frameworks like Angular and NestJS still use the experimental decorator API.",
    },
    {
      question: "How does a class decorator work in TypeScript?",
      answer:
        "A class decorator is a function called with the constructor as its argument. It can return a new constructor to replace the original class, add properties to the prototype, or register the class in a registry. function Singleton<T extends new (...args: any[]) => object>(Base: T) { /* ... */ } — applied with @Singleton, this modifies the class at decoration time, before any instances are created.",
    },
    {
      question: "What is reflect-metadata and why is it used with decorators?",
      answer:
        "reflect-metadata is a polyfill for the Reflect.metadata API that lets decorators attach and read metadata on class constructors, methods, and properties. It is required by Angular and NestJS for dependency injection — decorators use it to record the constructor parameter types so the DI container can resolve them automatically. Without reflect-metadata, the type information emitted by TypeScript's emitDecoratorMetadata compiler option has no API to read it.",
    },
    {
      question: "Are TypeScript decorators ready for production use in 2025?",
      answer:
        "Experimental decorators are production-ready in the context of Angular and NestJS, which have used them stably for years with well-established conventions. For greenfield code, the Stage 3 decorator standard is the future-proof choice and is supported in TypeScript 5.0+. Libraries are gradually migrating. Avoid experimental decorators outside established frameworks unless you accept the migration cost when the ecosystem finalizes on Stage 3.",
    },
  ],
};

export const SYSTEM_DESIGN_TOPIC_FAQS: Record<string, FAQItem[]> = {
  "system-design-rendering-strategies-interview-questions": [
    {
      question: "What is the difference between SSR, CSR, SSG, and ISR?",
      answer:
        "CSR (Client-Side Rendering) renders in the browser after downloading a JS bundle — great for dashboards, bad for SEO. SSR (Server-Side Rendering) generates HTML per request on the server — great for SEO and personalized content, costs TTFB. SSG (Static Site Generation) pre-builds HTML at deploy time and serves from a CDN — fastest for static content, requires rebuild for data changes. ISR (Incremental Static Regeneration) is SSG with background revalidation — stale-while-revalidate for pages.",
    },
    {
      question: "When would you use SSR over SSG in a Next.js application?",
      answer:
        "Use SSR when the page content depends on request-time data that cannot be known at build time — authenticated user data, real-time stock prices, personalized feeds, or pages that need request cookies or headers. Use SSG for content that changes infrequently and is the same for all users — documentation, marketing pages, blog posts. Use ISR as a middle ground when data changes but not so often that every request needs a fresh render.",
    },
    {
      question: "What is Streaming SSR and how does it improve performance?",
      answer:
        "Streaming SSR (React 18 via renderToPipeableStream and Next.js App Router) sends HTML to the browser in chunks as components finish rendering, instead of waiting for the entire tree. The browser starts parsing and rendering immediately, improving TTFB and FCP. Suspense boundaries define which parts stream progressively — a slow database query does not block the rest of the page from loading.",
    },
    {
      question: "How does rendering strategy affect Core Web Vitals?",
      answer:
        "SSG and ISR produce the best LCP because HTML is served instantly from a CDN with no server computation. SSR improves LCP compared to CSR but adds TTFB latency. CSR has the worst LCP and FCP because the page is blank until JavaScript downloads and runs. CLS is most affected by images without dimensions and dynamic content insertion — independent of rendering strategy.",
    },
    {
      question: "What is the difference between hydration and server-side rendering?",
      answer:
        "Server-side rendering generates the initial HTML so users see content immediately. Hydration is the subsequent step where React runs on the client, attaches event listeners to the existing HTML, and makes the page interactive without re-rendering. If hydration mismatches the server HTML, React must re-render from scratch causing a flash. React 18's selective hydration defers hydrating off-screen components.",
    },
  ],

  "system-design-microfrontends-interview-questions": [
    {
      question: "What are microfrontends and when should you use them?",
      answer:
        "Microfrontends split a large frontend application into independently deployable pieces, each owned by a separate team. Use them when multiple teams work on different domains (checkout, catalog, search) that need to deploy independently, or when different parts of the app have different release cadences. Avoid for small teams — the operational overhead (shared dependencies, cross-app routing, auth) outweighs the benefits.",
    },
    {
      question: "What is Webpack Module Federation and how does it enable microfrontends?",
      answer:
        "Module Federation is a Webpack 5 plugin that lets one application expose modules that other applications consume at runtime without a build-time dependency. A host app dynamically loads remotes deployed independently. Shared dependencies (React, ReactDOM) are declared with singleton:true so only one instance loads across all apps. Each remote is a fully independent deployment — updating it does not require rebuilding or redeploying the host.",
    },
    {
      question: "What is the difference between Single-SPA and Module Federation?",
      answer:
        "Single-SPA is a framework-agnostic orchestrator that manages the lifecycle (mount, unmount, update) of multiple microfrontend applications on a single page, handling routing and lazy loading of apps. Module Federation is a bundler-level mechanism for sharing code between applications at runtime. They solve different problems: Single-SPA orchestrates independent apps; Module Federation shares dependencies and modules. They are commonly used together.",
    },
    {
      question: "How do microfrontends share state and communicate?",
      answer:
        "Microfrontends should be loosely coupled. Best communication patterns: URL/query parameters for shared navigation state, custom DOM events for parent-to-child signals, a shared event bus (pub/sub) for cross-app messaging, and Module Federation for tightly coupled shared stores. Avoid direct imports between microfrontends — they create build-time coupling. Authentication state is typically shared via cookies or a global auth token that all apps read.",
    },
    {
      question: "What are the main challenges of microfrontend architecture?",
      answer:
        "The main challenges are: shared dependency management (ensuring React is not loaded twice), consistent styling (each app brings its own CSS, risking conflicts — CSS-in-JS or Shadow DOM help), authentication across apps, cross-app navigation and routing complexity, performance (more network requests, more JavaScript to coordinate), and team coordination overhead for shared design systems and APIs.",
    },
  ],

  "system-design-monorepo-interview-questions": [
    {
      question: "What is a monorepo and why do teams use it?",
      answer:
        "A monorepo stores multiple projects — apps, libraries, packages — in a single git repository. Teams use it to share code easily without publishing to npm, enable atomic cross-project changes in one commit, enforce consistent tooling and linting across all projects, and make cross-package refactoring straightforward. The cost is repository size and tooling complexity that scales with the number of packages.",
    },
    {
      question: "What is the difference between Turborepo and Nx?",
      answer:
        "Turborepo focuses on build pipeline caching — it hashes task inputs and skips tasks whose inputs have not changed. Configuration is minimal (turbo.json). Nx provides a full developer platform with a project graph, affected commands that run tasks only for changed projects, code generators, module boundary enforcement, and first-class plugins for React, Next.js, Node. Turborepo is simpler to adopt; Nx provides more structure for large teams.",
    },
    {
      question: "What is the pnpm workspace:* protocol?",
      answer:
        "In a pnpm monorepo, workspace:* in a package.json dependency means 'use the local version of this package from the monorepo workspace rather than downloading from npm.' During development, changes in a shared library are immediately reflected in consuming apps without publishing. On publish, pnpm replaces workspace:* with the resolved version number.",
    },
    {
      question: "What is Turborepo's remote cache?",
      answer:
        "Turborepo's remote cache stores task outputs (build artifacts, test results) in shared storage. When any developer or CI machine runs a task, Turborepo checks if a matching cache entry exists for that exact input hash. If yes, it restores the output without running the task. On a team of 10, if one person already built a package, everyone else gets the result instantly from cache.",
    },
    {
      question: "What is the difference between monorepo and polyrepo?",
      answer:
        "A polyrepo stores each project in its own git repository, published to npm independently. It provides clear team ownership and isolated CI pipelines. A monorepo stores everything together, enabling easier code sharing and atomic refactors but requiring more sophisticated tooling. Most large-scale frontend organizations (Google, Meta, Vercel) prefer monorepos for core products; smaller teams with independent services often prefer polyrepos.",
    },
  ],

  "system-design-bundle-optimization-interview-questions": [
    {
      question: "What is tree shaking and what is required for it to work?",
      answer:
        "Tree shaking removes unused exports from the final JavaScript bundle. It requires ES module syntax (import/export) because ESM is statically analyzable — bundlers can determine at build time which exports are used. CommonJS (require) cannot be tree shaken because requires are dynamic. Packages must also set sideEffects: false in package.json to tell bundlers it is safe to skip files that are imported but whose exports are unused.",
    },
    {
      question: "What is code splitting and how is it implemented in React?",
      answer:
        "Code splitting divides the bundle into smaller chunks loaded on demand. React.lazy(() => import('./Page')) with Suspense creates a separate chunk for each lazy component, loaded only when that route is visited. Next.js does route-based splitting automatically. Component-level splitting — lazy-loading heavy modals, charts, or maps — further reduces the initial bundle. The goal is to serve only the code needed for the current route.",
    },
    {
      question: "What are vendor chunks and why do they improve caching?",
      answer:
        "A vendor chunk separates third-party library code (React, lodash) from application code. Since libraries change far less frequently, the vendor chunk gets a stable content hash and browsers cache it across deployments. Without this separation, every code change invalidates the combined hash and forces users to re-download all dependencies on every deploy.",
    },
    {
      question: "How do you analyze and reduce bundle size in a React application?",
      answer:
        "Use webpack-bundle-analyzer or Vite's rollup-plugin-visualizer to generate a visual treemap of the bundle. Common findings: lodash imported as a whole (use lodash-es with tree shaking), moment.js (replace with date-fns), icon libraries imported entirely (import only used icons), duplicate packages (two versions of the same library), and polyfills for modern environments.",
    },
    {
      question: "What is dynamic import() and when should you use it?",
      answer:
        "Dynamic import() returns a Promise that resolves to a module, loaded asynchronously at runtime. Use it to delay loading heavy chart libraries until visible, admin-only components until needed, or modals until opened. In Next.js, next/dynamic wraps dynamic import with SSR options and loading states. Dynamic imports are the mechanism behind all code splitting.",
    },
  ],

  "system-design-caching-strategies-interview-questions": [
    {
      question: "What is the difference between Cache-Control no-cache and no-store?",
      answer:
        "no-store means never store the response anywhere — always make a fresh request. Use for sensitive data like banking pages. no-cache means store the response but always revalidate with the server before using it — the browser sends a conditional request and the server returns 304 Not Modified if unchanged, saving bandwidth. no-cache is often misunderstood as 'don't cache' but it actually caches with mandatory revalidation.",
    },
    {
      question: "What is stale-while-revalidate and why is it powerful?",
      answer:
        "stale-while-revalidate is a Cache-Control extension: serve the cached response immediately (even if stale), then fetch a fresh version in the background for next time. Cache-Control: max-age=60, stale-while-revalidate=600 means serve from cache for 60 seconds, then serve stale for up to 10 minutes while silently refreshing. This gives instant response times with fresh data on next visit.",
    },
    {
      question: "What is content hashing and why is it important for caching?",
      answer:
        "Content hashing adds a fingerprint of file contents to the filename (main.a3f8c2.js). When the file changes, the hash changes and busts the cache automatically. Files with content hashes can be served with long max-age (Cache-Control: max-age=31536000, immutable) because the URL uniquely represents one specific version. Without content hashing, you must use short cache times or risk users getting stale files after deployment.",
    },
    {
      question: "What is a service worker and how does it enable offline caching?",
      answer:
        "A service worker runs in a background thread and intercepts all network requests from the page. It can respond from its own cache when offline, serve stale content while fetching fresh, and precache critical assets on install. The Cache API provides explicit control over what is cached. Workbox provides pre-built caching strategies: CacheFirst for assets, NetworkFirst for API responses, and StaleWhileRevalidate for frequently updated content.",
    },
    {
      question: "What is the difference between HTTP caching and application-level caching?",
      answer:
        "HTTP caching is controlled via response headers (Cache-Control, ETag) and handled by browsers and CDNs transparently. Application-level caching stores computed data in memory (React Query's cache or Redis on the server) to avoid redundant computations or API calls. Use HTTP caching for static assets and cacheable API responses. Use application-level caching for expensive computations, database query results, and deduplicating in-flight requests.",
    },
  ],

  "system-design-authentication-interview-questions": [
    {
      question: "What is the safest way to store authentication tokens in a browser?",
      answer:
        "Store tokens in HttpOnly cookies, not localStorage. HttpOnly cookies are inaccessible to JavaScript — XSS attacks that inject malicious scripts cannot read them. localStorage is accessible to any script on the page and is a common target for token theft. Add SameSite=Strict or Lax to prevent CSRF, and Secure to ensure HTTPS-only transmission. The tradeoff is that cookies require CSRF protection for state-changing requests.",
    },
    {
      question: "What is refresh token rotation and why is it needed?",
      answer:
        "Access tokens should be short-lived (15 minutes) to limit theft damage. Refresh tokens are long-lived and stored in HttpOnly cookies to obtain new access tokens without re-login. Rotation means each use produces a new refresh token and invalidates the old one. If a stolen refresh token is detected (same token used twice), the server revokes the entire session. Without rotation, a stolen refresh token grants indefinite access.",
    },
    {
      question: "What is the difference between session-based and JWT-based authentication?",
      answer:
        "Session-based auth stores session data on the server and sends a session ID in a cookie. Each request requires a database lookup. This enables immediate revocation but requires server state. JWT-based auth encodes claims in a signed token validated cryptographically without a database lookup — stateless and horizontally scalable. JWTs cannot be revoked without a blocklist. Most modern apps use short-lived JWTs in HttpOnly cookies with refresh token rotation.",
    },
    {
      question: "What is OAuth PKCE and when should you use it?",
      answer:
        "PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks in OAuth 2.0. The client generates a code verifier, hashes it to a challenge, and sends the challenge with the authorization request. On token exchange, the server verifies the hash matches. Use PKCE for public clients (SPAs, mobile apps) that cannot store a client secret — without PKCE, an intercepted authorization code could be exchanged by an attacker.",
    },
    {
      question: "What is SSO and how is it implemented on the frontend?",
      answer:
        "Single Sign-On allows users to authenticate once and access multiple applications. Implementations include SAML (enterprise IdPs like Okta), OAuth/OpenID Connect (Google, GitHub), and shared session cookies on a parent domain. On the frontend, SSO redirects to a central identity provider, receives a token or session, then redirects back. Libraries like Auth0 SDK and NextAuth.js handle this flow.",
    },
  ],

  "system-design-frontend-security-interview-questions": [
    {
      question: "What is XSS and how do you prevent it in a web application?",
      answer:
        "Cross-Site Scripting (XSS) injects malicious scripts into web pages viewed by other users. Prevention: use textContent instead of innerHTML for dynamic content, sanitize HTML with DOMPurify when you must render HTML, implement a Content Security Policy that blocks inline scripts and unauthorized sources, store tokens in HttpOnly cookies, and use React (which escapes JSX values by default).",
    },
    {
      question: "What is CSRF and how does the SameSite cookie attribute prevent it?",
      answer:
        "CSRF tricks a logged-in user's browser into making unauthorized requests to a target site by exploiting automatic cookie inclusion. SameSite=Strict prevents the cookie from being sent on any cross-origin request. SameSite=Lax allows cookies on top-level navigations but blocks cross-origin form submissions and AJAX. CSRF tokens provide an additional layer by requiring a secret in the request body that attackers cannot read.",
    },
    {
      question: "What is Content Security Policy and how do you configure it?",
      answer:
        "CSP is an HTTP header that tells browsers which sources of scripts, styles, and other resources are trusted. script-src 'self' 'nonce-{random}' prevents inline scripts and only allows scripts from your origin or with a matching nonce. This blocks most XSS attacks even if injection occurs — injected scripts have no valid nonce. Use report-only mode first to identify violations without breaking functionality.",
    },
    {
      question: "What is clickjacking and how do you prevent it?",
      answer:
        "Clickjacking embeds your site in a transparent iframe on a malicious page, tricking users into clicking your UI while thinking they're clicking elsewhere. Prevention: add X-Frame-Options: DENY or SAMEORIGIN, or use the CSP frame-ancestors directive (frame-ancestors 'self') which supersedes X-Frame-Options in modern browsers and provides finer control.",
    },
    {
      question: "What is the difference between authentication and authorization in frontend security?",
      answer:
        "Authentication verifies who the user is — login, JWT validation, session checks. Authorization verifies what the user is allowed to do — role checks, permission flags. Frontend authorization (hiding UI elements) is a UX concern only — it is always bypassable. Real authorization must happen on the server, rejecting unauthorized API requests regardless of what the frontend shows.",
    },
  ],

  "system-design-state-management-interview-questions": [
    {
      question: "What is the difference between server state and client state?",
      answer:
        "Server state is data that lives on a remote server — user profiles, product lists, orders. It must be fetched, cached, synchronized, and can become stale. React Query and SWR are purpose-built for server state. Client state is local, ephemeral UI state — modal open/closed, selected tab, form values. Managing server state in Redux/Zustand with manual loading/error/caching is the most common architecture mistake in React applications.",
    },
    {
      question: "When should you use Zustand instead of React Context?",
      answer:
        "Use Zustand when state changes frequently and many components depend on it. Context re-renders all consumers when the value changes — there is no selector system. Zustand supports subscriptions: a component using useStore(s => s.count) only re-renders when count changes, not when other store fields change. Use Context for stable global values (current user, theme) that change rarely.",
    },
    {
      question: "What is React Query and what problem does it solve?",
      answer:
        "React Query provides automatic caching, deduplication, background refetching, loading/error state, and stale-time configuration for API calls. It replaces useState + useEffect + manual loading/error handling with useQuery. Multiple components calling useQuery with the same key share one request and one cached result. The cache is invalidated on window focus, network reconnect, or manual invalidation.",
    },
    {
      question: "What is URL state and when should you use it?",
      answer:
        "URL state stores values in query parameters or path segments — search queries, filter selections, pagination, active tabs. URL state persists across refreshes, is shareable, and works with browser back/forward. Use useSearchParams (React Router) or Next.js router for URL state. Any state that a user might want to bookmark, share, or return to after navigating belongs in the URL, not in component state.",
    },
    {
      question: "What is the atomic state model used by Jotai and Recoil?",
      answer:
        "Atomic state decomposes global state into tiny independent atoms. Components subscribe to individual atoms and only re-render when their specific atom changes, solving the Context re-render problem at fine granularity. Derived atoms (selectors) compute from other atoms and are memoized. The model works well for loosely related independent values that happen to be global — like multiple filter values on a search page.",
    },
  ],

  "system-design-network-optimization-interview-questions": [
    {
      question: "What is the difference between prefetch, preload, and preconnect?",
      answer:
        "preload (<link rel='preload'>) fetches a resource needed for the current page at high priority — use for critical fonts, LCP images, and above-the-fold CSS. prefetch (<link rel='prefetch'>) fetches a resource likely needed for the next navigation at low priority during idle time. preconnect (<link rel='preconnect'>) establishes a connection (DNS + TCP + TLS) to an origin without fetching content — use for third-party CDNs to eliminate connection latency.",
    },
    {
      question: "How do you optimize images for web performance?",
      answer:
        "Use modern formats: WebP reduces file size 25-35% vs JPEG; AVIF reduces it 50%+ but has less browser support. Serve responsive images with srcset and sizes. Lazy load below-the-fold images with loading='lazy'. Use a CDN with image optimization (Cloudinary, Imgix, Next.js Image) that resizes, converts, and compresses on demand. Always specify width and height to prevent CLS.",
    },
    {
      question: "What is HTTP/2 multiplexing and how does it change frontend optimization?",
      answer:
        "HTTP/2 multiplexes multiple requests over a single TCP connection simultaneously, eliminating HTTP/1.1's 6-connection-per-domain limit. This makes domain sharding (splitting assets across subdomains) counterproductive. Inlining small files is less necessary since each request has minimal overhead. HTTP/2 also enables server push for preemptive asset delivery.",
    },
    {
      question: "What is lazy loading and what are its SEO implications?",
      answer:
        "Lazy loading defers loading off-screen resources until needed. Use native loading='lazy' for images and dynamic import() for JavaScript. The SEO implication: Googlebot may not scroll far enough to trigger lazy loading of below-the-fold images, potentially missing indexable content. For SEO-critical images, ensure they are not lazy loaded or use IntersectionObserver to reliably trigger loading.",
    },
    {
      question: "What is a CDN and how does it improve performance?",
      answer:
        "A CDN distributes static assets across servers in multiple geographic regions. Requests are routed to the closest server, reducing latency from hundreds to tens of milliseconds. CDNs cache content at edge nodes, reducing origin server load. For SSG pages, CDNs serve the entire HTML response from cache. Edge computing (Vercel Edge, Cloudflare Workers) moves dynamic computation to the CDN edge.",
    },
  ],

  "system-design-core-web-vitals-interview-questions": [
    {
      question: "What are the Core Web Vitals and their passing thresholds?",
      answer:
        "Core Web Vitals are Google's UX quality signals used in search ranking. LCP (Largest Contentful Paint) measures loading speed — good is under 2.5s. INP (Interaction to Next Paint) measures responsiveness — good is under 200ms. CLS (Cumulative Layout Shift) measures visual stability — good is under 0.1. All three are measured at the 75th percentile of real user sessions from the Chrome UX Report.",
    },
    {
      question: "How do you improve LCP (Largest Contentful Paint)?",
      answer:
        "LCP is typically a hero image or large text block. To improve it: preload the LCP image with <link rel='preload'>, serve it from a CDN, use WebP/AVIF format, ensure it is not lazy loaded, eliminate render-blocking resources, reduce TTFB (use SSG or ISR instead of SSR), and set explicit dimensions to prevent layout recalculation. For text-based LCP, reduce web font blocking with font-display: swap.",
    },
    {
      question: "How do you improve INP (Interaction to Next Paint)?",
      answer:
        "INP measures the time from user interaction to the next frame painted. To improve it: break long tasks (>50ms) into chunks with scheduler.yield() or setTimeout(fn, 0), defer non-critical JavaScript with async/defer, use web workers for heavy computation, avoid synchronous layout in event handlers, use React's startTransition for non-urgent state updates, and profile with Chrome DevTools Performance tab.",
    },
    {
      question: "What causes CLS (Cumulative Layout Shift) and how do you fix it?",
      answer:
        "CLS is caused by elements moving after the page loads. Main causes: images and videos without explicit width/height (browser can't reserve space), ads and embeds with unknown dimensions, web fonts causing FOUT (use font-display: optional), and dynamically injected content above existing content. Fix by always setting size attributes on media, reserving space for dynamic content, and using transform/opacity for animations instead of layout-affecting properties.",
    },
    {
      question: "How do you measure Core Web Vitals in production?",
      answer:
        "Use the web-vitals JavaScript library (from Google) to capture real user measurements: import { onLCP, onINP, onCLS } from 'web-vitals'. These use PerformanceObserver to collect values from real users. Send them to your analytics backend — Google Analytics 4 captures them automatically. Google Search Console shows field data aggregated over 28 days. Use Lighthouse for lab data (synthetic measurements) to find issues before production.",
    },
  ],
};

/**
 * Get FAQs for a topic slug.
 * Falls back to an empty array if the topic has no dedicated FAQs.
 */
export function getTopicFaqs(slug: string, track = "javascript"): FAQItem[] {
  switch (track) {
    case "javascript":
      return TOPIC_FAQS[slug] ?? [];
    case "react":
      return REACT_TOPIC_FAQS[slug] ?? [];
    case "typescript":
      return TYPESCRIPT_TOPIC_FAQS[slug] ?? [];
    case "system-design":
      return SYSTEM_DESIGN_TOPIC_FAQS[slug] ?? [];
    default:
      return [];
  }
}

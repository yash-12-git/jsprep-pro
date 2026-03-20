/**
 * src/data/outputQuestions.ts
 *
 * 100 JavaScript output prediction questions for jsprep.pro
 *
 * CONTRACT:
 *  ✅ Pure JS — no fetch, DOM, React, Node.js APIs
 *  ✅ All output via console.log
 *  ✅ Deterministic — same result every run
 *  ✅ answer = exact console.log output (one value per line)
 *  ✅ Tests concepts asked at top MNCs (Razorpay, Flipkart, Atlassian, Google, etc.)
 */

export interface OutputQuestion {
  id: number;
  cat:
    | "Closures & Scope"
    | "'this' Binding"
    | "Event Loop & Promises"
    | "Type Coercion"
    | "Hoisting"
    | "Prototypes & Inheritance"
    | "Array Methods"
    | "Modern JS"
    | "Generators & Iterators";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  code: string;
  answer: string; // exact console.log output — one value per line
  explanation: string;
  keyInsight: string;
  tags: string[];
  companies: string[]; // companies known to ask this topic in interviews
}

export const OUTPUT_CATEGORIES = [
  "Closures & Scope",
  "'this' Binding",
  "Event Loop & Promises",
  "Type Coercion",
  "Hoisting",
  "Prototypes & Inheritance",
  "Array Methods",
  "Modern JS",
  "Generators & Iterators",
] as const;

export const outputQuestions: OutputQuestion[] = [
  // ─── CLOSURES & SCOPE (12) ───────────────────────────────────────────────

  {
    id: 1,
    cat: "Closures & Scope",
    difficulty: "easy",
    title: "Classic var in loop with setTimeout",
    tags: ["closure", "var", "loop", "settimeout"],
    companies: ["Flipkart", "Razorpay", "Zomato", "Amazon"],
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    answer: "3\n3\n3",
    explanation:
      "var is function-scoped — all three callbacks close over the same i. By the time they run, the loop has finished and i is 3.",
    keyInsight:
      "var in loops creates one shared binding. Every closure captures the same variable, not its value at that iteration.",
  },

  {
    id: 2,
    cat: "Closures & Scope",
    difficulty: "easy",
    title: "let in loop — each iteration gets own binding",
    tags: ["closure", "let", "loop", "settimeout"],
    companies: ["Flipkart", "Razorpay", "Swiggy", "CRED"],
    code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    answer: "0\n1\n2",
    explanation:
      "let creates a new binding per loop iteration. Each callback closes over its own independent i.",
    keyInsight:
      "let creates a fresh binding per loop iteration — the solution to the classic var closure bug.",
  },

  {
    id: 3,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "IIFE captures loop variable",
    tags: ["closure", "iife", "var", "loop"],
    companies: ["Razorpay", "Google", "CRED"],
    code: `const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push((function(j) {
    return () => j;
  })(i));
}
console.log(fns[0]());
console.log(fns[2]());`,
    answer: "0\n2",
    explanation:
      "The IIFE captures i as parameter j at call time. j is a fresh binding per IIFE invocation — not shared like var i.",
    keyInsight:
      "IIFE was the pre-let solution: capture the current value as a function argument to create a new binding.",
  },

  {
    id: 4,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "Closure mutation persists across calls",
    tags: ["closure", "mutation", "factory"],
    companies: ["Razorpay", "Flipkart", "ShareChat"],
    code: `function outer() {
  let x = 10;
  return function inner() {
    x++;
    return x;
  };
}
const fn = outer();
console.log(fn());
console.log(fn());
console.log(fn());`,
    answer: "11\n12\n13",
    explanation:
      "inner closes over x. Each call increments the same x — closures capture the live variable binding, not a snapshot.",
    keyInsight:
      "Closures share a live variable binding. Mutations persist and are visible on every subsequent call.",
  },

  {
    id: 5,
    cat: "Closures & Scope",
    difficulty: "easy",
    title: "let block scope — inner does not leak",
    tags: ["let", "block-scope"],
    companies: ["Paytm", "Meesho"],
    code: `let x = 'outer';
{
  let x = 'inner';
  console.log(x);
}
console.log(x);`,
    answer: "inner\nouter",
    explanation:
      "let is block-scoped. The inner x exists only inside the block. The outer x is completely unaffected.",
    keyInsight:
      "let creates a new binding per block. Inner and outer x are independent — no leaking.",
  },

  {
    id: 6,
    cat: "Closures & Scope",
    difficulty: "easy",
    title: "var leaks out of block, let does not",
    tags: ["var", "let", "block-scope", "typeof"],
    companies: ["Flipkart", "Zomato", "Paytm"],
    code: `{
  var a = 1;
  let b = 2;
}
console.log(a);
console.log(typeof b);`,
    answer: "1\nundefined",
    explanation:
      'var is function-scoped (or global here) — it escapes the block. let is block-scoped — b is inaccessible. typeof returns "undefined" safely without throwing.',
    keyInsight:
      'var ignores block scope. typeof on a non-existent variable returns "undefined" instead of throwing.',
  },

  {
    id: 7,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "Independent counter factory instances",
    tags: ["closure", "factory", "independent"],
    companies: ["Razorpay", "CRED", "Google"],
    code: `function makeCounter() {
  let count = 0;
  return {
    inc() { count++; },
    get() { return count; },
  };
}
const a = makeCounter();
const b = makeCounter();
a.inc(); a.inc();
b.inc();
console.log(a.get());
console.log(b.get());`,
    answer: "2\n1",
    explanation:
      "Each makeCounter() call creates a fresh closure scope with its own count. a and b are completely independent.",
    keyInsight:
      "Each factory call creates a new lexical environment. This is the module pattern for private state.",
  },

  {
    id: 8,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "Closure captures binding not snapshot",
    tags: ["closure", "reference", "binding"],
    companies: ["ShareChat", "Meesho"],
    code: `let value = 1;
const fn = () => value;
value = 2;
console.log(fn());
value = 3;
console.log(fn());`,
    answer: "2\n3",
    explanation:
      "fn closes over the variable value, not the value 1 at definition time. It always reads the current value of the binding.",
    keyInsight:
      "Closures capture variable bindings (references), not values. The latest assignment is always visible.",
  },

  {
    id: 9,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "var inside function shadows outer",
    tags: ["var", "hoisting", "shadowing", "function-scope"],
    companies: ["Flipkart", "Zomato", "Amazon"],
    code: `var x = 'global';
function test() {
  console.log(x);
  var x = 'local';
  console.log(x);
}
test();`,
    answer: "undefined\nlocal",
    explanation:
      "var x inside test() is hoisted to the top of the function. First log sees the hoisted-but-uninitialized x (undefined), not the outer global.",
    keyInsight:
      "A local var declaration shadows the outer variable from the start of the function — not from where it appears.",
  },

  {
    id: 10,
    cat: "Closures & Scope",
    difficulty: "medium",
    title: "Curried closure",
    tags: ["closure", "currying", "factory"],
    companies: ["Razorpay", "CRED", "Atlassian"],
    code: `function multiplier(x) {
  return (y) => x * y;
}
const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5));
console.log(triple(double(2)));`,
    answer: "10\n12",
    explanation:
      "double(5) = 2*5 = 10. double(2) = 4, then triple(4) = 3*4 = 12.",
    keyInsight:
      "Currying returns a function that closes over the first argument. Each call creates a fresh closure.",
  },

  {
    id: 11,
    cat: "Closures & Scope",
    difficulty: "hard",
    title: "Shared closure state across methods",
    tags: ["closure", "object", "shared-state"],
    companies: ["Google", "CRED", "Atlassian"],
    code: `function createObj() {
  let val = 0;
  return {
    inc()   { val++; },
    dec()   { val--; },
    reset() { val = 0; },
    get()   { return val; },
  };
}
const obj = createObj();
obj.inc(); obj.inc(); obj.inc(); obj.dec();
console.log(obj.get());
obj.reset();
console.log(obj.get());`,
    answer: "2\n0",
    explanation:
      "All four methods close over the same val variable. They share and mutate the same binding.",
    keyInsight:
      "All methods from a factory share one closure scope — one private variable, multiple public operations.",
  },

  {
    id: 12,
    cat: "Closures & Scope",
    difficulty: "hard",
    title: "for...in includes inherited properties, for...of does not",
    tags: ["for-in", "for-of", "array", "prototype"],
    companies: ["Razorpay", "Flipkart"],
    code: `const arr = [10, 20, 30];
arr.custom = 'extra';
const forIn = [], forOf = [];
for (const k in arr)  forIn.push(k);
for (const v of arr)  forOf.push(v);
console.log(forIn.join(','));
console.log(forOf.join(','));`,
    answer: "0,1,2,custom\n10,20,30",
    explanation:
      "for...in iterates all enumerable keys including custom properties. for...of uses the iterator and only yields the array elements.",
    keyInsight:
      "Never use for...in on arrays — it includes non-index properties. Use for...of for values.",
  },

  // ─── THIS BINDING (10) ───────────────────────────────────────────────────

  {
    id: 13,
    cat: "'this' Binding",
    difficulty: "easy",
    title: "Method call — this is the calling object",
    tags: ["this", "method"],
    companies: ["Razorpay", "Flipkart", "Zomato"],
    code: `const obj = {
  name: 'Alice',
  greet() { return 'Hello, ' + this.name; },
};
console.log(obj.greet());`,
    answer: "Hello, Alice",
    explanation:
      "When called as obj.greet(), this is set to obj — the object to the left of the dot.",
    keyInsight:
      "Method calls: this = the object before the final dot at the call site.",
  },

  {
    id: 14,
    cat: "'this' Binding",
    difficulty: "easy",
    title: "Arrow function has no own this — inherits lexically",
    tags: ["this", "arrow", "lexical"],
    companies: ["Razorpay", "Swiggy", "CRED", "Microsoft"],
    code: `const obj = {
  name: 'JSPrep',
  arrow: () => typeof this,
  regular() { return typeof this; },
};
console.log(obj.arrow());
console.log(obj.regular());`,
    answer: "undefined\nobject",
    explanation:
      "Arrow functions inherit this from the enclosing lexical scope. At module level this is undefined. Regular methods get this set to the calling object.",
    keyInsight:
      "Arrow functions do not have their own this. Never use them as object methods.",
  },

  {
    id: 15,
    cat: "'this' Binding",
    difficulty: "medium",
    title: "bind permanently fixes this — call cannot override it",
    tags: ["this", "bind", "call"],
    companies: ["Razorpay", "Google", "Atlassian"],
    code: `function getName() { return this.name; }
const alice = { name: 'Alice' };
const bob   = { name: 'Bob' };
const boundAlice = getName.bind(alice);
console.log(boundAlice());
console.log(boundAlice.call(bob));`,
    answer: "Alice\nAlice",
    explanation:
      "bind creates a permanently bound function. Even .call(bob) cannot override the bound this.",
    keyInsight:
      "bind() wins over call/apply. A bound function's this is permanent and cannot be overridden.",
  },

  {
    id: 16,
    cat: "'this' Binding",
    difficulty: "medium",
    title: "call vs apply — same result, different syntax",
    tags: ["this", "call", "apply"],
    companies: ["Flipkart", "Amazon", "Microsoft"],
    code: `function greet(greeting) {
  return greeting + ', ' + this.name + '!';
}
const user = { name: 'Bob' };
console.log(greet.call(user, 'Hello'));
console.log(greet.apply(user, ['Hi']));`,
    answer: "Hello, Bob!\nHi, Bob!",
    explanation:
      "call and apply both set this explicitly. call takes arguments individually; apply takes an array.",
    keyInsight:
      "call(thisArg, ...args) vs apply(thisArg, [args]) — same result, different argument style.",
  },

  {
    id: 17,
    cat: "'this' Binding",
    difficulty: "medium",
    title: "Arrow callback inside method preserves this",
    tags: ["this", "arrow", "callback"],
    companies: ["Razorpay", "Swiggy", "PhonePe"],
    code: `const timer = {
  seconds: 0,
  start() {
    const tick = () => ++this.seconds;
    tick(); tick(); tick();
    return this.seconds;
  }
};
console.log(timer.start());`,
    answer: "3",
    explanation:
      "Arrow function tick inherits this from start's context (timer). Each tick() increments timer.seconds.",
    keyInsight:
      "Arrow callbacks inside methods inherit the method's this — solving the classic callback this-loss problem.",
  },

  {
    id: 18,
    cat: "'this' Binding",
    difficulty: "medium",
    title: "Method chaining — return this",
    tags: ["this", "chaining", "builder"],
    companies: ["CRED", "Atlassian"],
    code: `class Builder {
  constructor() { this.parts = []; }
  add(part) { this.parts.push(part); return this; }
  build()   { return this.parts.join(' + '); }
}
console.log(new Builder().add('A').add('B').add('C').build());`,
    answer: "A + B + C",
    explanation:
      "add() returns this, enabling chaining. build() collects all parts.",
    keyInsight:
      "Returning this from methods enables fluent interfaces and method chaining.",
  },

  {
    id: 19,
    cat: "'this' Binding",
    difficulty: "medium",
    title: "this in nested object — direct parent wins",
    tags: ["this", "nested", "object"],
    companies: ["Flipkart", "ShareChat"],
    code: `const outer = {
  name: 'outer',
  inner: {
    name: 'inner',
    greet() { return this.name; },
  },
};
console.log(outer.inner.greet());
const fn = outer.inner.greet;
console.log(fn?.call(outer));`,
    answer: "inner\nouter",
    explanation:
      "outer.inner.greet() — this is inner (the direct calling object). fn.call(outer) explicitly sets this to outer.",
    keyInsight:
      "this is always the object immediately before the final dot — not a parent object.",
  },

  {
    id: 20,
    cat: "'this' Binding",
    difficulty: "hard",
    title: "bind with partial application",
    tags: ["this", "bind", "partial-application"],
    companies: ["Google", "Razorpay", "Atlassian"],
    code: `function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);
console.log(double(5));
console.log(triple(4));
console.log(double(triple(2)));`,
    answer: "10\n12\n12",
    explanation:
      "bind(null, 2) pre-fills a=2. double(5)=10. triple(2)=6. double(6)=12.",
    keyInsight:
      "bind can partially apply arguments. The first call fills early arguments — remaining ones come from later calls.",
  },

  {
    id: 21,
    cat: "'this' Binding",
    difficulty: "hard",
    title: "Class method loses this when destructured",
    tags: ["this", "class", "destructuring"],
    companies: ["Flipkart", "Zomato"],
    code: `class Greeter {
  constructor(name) { this.name = name; }
  greet() { return 'Hi, ' + this.name; }
}
const g = new Greeter('Alice');
console.log(g.greet());
const { greet } = g;
console.log(greet?.call(g));`,
    answer: "Hi, Alice\nHi, Alice",
    explanation:
      "g.greet() has this = g (correct). Destructuring detaches the method but .call(g) explicitly provides the context.",
    keyInsight:
      "Destructuring methods detaches them from their object. Always bind or use .call() when passing methods as callbacks.",
  },

  {
    id: 22,
    cat: "'this' Binding",
    difficulty: "hard",
    title: "new vs plain call — different returns",
    tags: ["this", "new", "constructor"],
    companies: ["Razorpay", "Google", "CRED"],
    code: `function Person(name) { this.name = name; }
const p1 = new Person('Alice');
const p2 = Person.call({}, 'Bob');
console.log(p1.name);
console.log(p2);`,
    answer: "Alice\nundefined",
    explanation:
      'new creates an object and returns it. Person.call({}, "Bob") sets this on the passed object but since the function returns nothing, call returns undefined.',
    keyInsight:
      "new returns the constructed object. A plain call returns the function's explicit return value — undefined if nothing.",
  },

  // ─── EVENT LOOP & PROMISES (15) ──────────────────────────────────────────

  {
    id: 23,
    cat: "Event Loop & Promises",
    difficulty: "easy",
    title: "Synchronous code runs before setTimeout",
    tags: ["event-loop", "settimeout", "synchronous"],
    companies: ["Razorpay", "Flipkart", "Swiggy", "Zomato", "Google"],
    code: `console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');`,
    answer: "1\n3\n2",
    explanation:
      "Synchronous code runs first (1, 3). setTimeout callbacks are macrotasks — they run after all synchronous code.",
    keyInsight:
      "All sync code finishes before any macrotask (setTimeout) runs — even with 0ms delay.",
  },

  {
    id: 24,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Promise microtask before setTimeout macrotask",
    tags: ["event-loop", "promise", "settimeout", "microtask"],
    companies: ["Razorpay", "Swiggy", "PhonePe", "Atlassian"],
    code: `console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');`,
    answer: "start\nend\npromise\ntimeout",
    explanation:
      "Sync runs first (start, end). Then microtask queue drains (promise). Then macrotask queue (timeout).",
    keyInsight:
      "Order: sync → microtasks (Promise.then) → macrotasks (setTimeout). Microtasks always run before the next macrotask.",
  },

  {
    id: 25,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Promise chain passes values",
    tags: ["promise", "chain", "then"],
    companies: ["Razorpay", "Flipkart", "ShareChat"],
    code: `Promise.resolve(2)
  .then(v => v * 3)
  .then(v => v + 4)
  .then(v => console.log(v));`,
    answer: "10",
    explanation:
      "Each .then receives the return value of the previous. 2*3=6, 6+4=10.",
    keyInsight:
      "Promise chains pass return values downstream. Each .then transforms the value.",
  },

  {
    id: 26,
    cat: "Event Loop & Promises",
    difficulty: "hard",
    title: "Two Promise chains interleave in microtask queue",
    tags: ["promise", "microtask", "interleaving", "queue"],
    companies: ["Razorpay", "Atlassian", "CRED", "Google"],
    code: `Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2));

Promise.resolve()
  .then(() => console.log(3))
  .then(() => console.log(4));`,
    answer: "1\n3\n2\n4",
    explanation:
      "After sync code, both first .then callbacks are queued (1 and 3). After 1 runs, 2 is queued. Then 3 runs, queueing 4. Then 2, then 4.",
    keyInsight:
      "Multiple Promise chains interleave by round-robin. Each .then schedules the NEXT .then — they don't all run back-to-back.",
  },

  {
    id: 27,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "await suspends function — caller continues",
    tags: ["async", "await", "event-loop", "order"],
    companies: ["Razorpay", "Swiggy", "PhonePe"],
    code: `console.log('1');
async function main() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}
main();
console.log('4');`,
    answer: "1\n2\n4\n3",
    explanation:
      "1 logs. main() starts, logs 2. await suspends main (schedules resume as microtask). 4 logs. Then microtask runs: 3 logs.",
    keyInsight:
      "await suspends the async function. The caller continues synchronously. The resumed code runs as a microtask.",
  },

  {
    id: 28,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "setTimeout fires in delay order",
    tags: ["settimeout", "order", "delay"],
    companies: ["Flipkart", "Meesho"],
    code: `setTimeout(() => console.log('c'), 100);
setTimeout(() => console.log('a'), 0);
setTimeout(() => console.log('b'), 50);`,
    answer: "a\nb\nc",
    explanation:
      "Timers fire after their delay expires. 0ms → a, 50ms → b, 100ms → c.",
    keyInsight:
      "setTimeout fires after AT LEAST the specified delay, ordered by when they expire.",
  },

  {
    id: 29,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Promise executor runs synchronously",
    tags: ["promise", "executor", "synchronous"],
    companies: ["Razorpay", "Google", "CRED"],
    code: `console.log('a');
new Promise(resolve => {
  console.log('b');
  resolve();
}).then(() => console.log('c'));
console.log('d');`,
    answer: "a\nb\nd\nc",
    explanation:
      "The executor function runs synchronously (b logs immediately). resolve() schedules .then as a microtask. d logs sync. Then microtask: c.",
    keyInsight:
      "The Promise constructor executor is synchronous. Only .then callbacks are asynchronous.",
  },

  {
    id: 30,
    cat: "Event Loop & Promises",
    difficulty: "hard",
    title: "Nested setTimeout creates new macrotask",
    tags: ["settimeout", "nested", "macrotask"],
    companies: ["Razorpay", "Atlassian"],
    code: `setTimeout(() => {
  console.log('outer');
  setTimeout(() => console.log('inner'), 0);
}, 0);
console.log('sync');`,
    answer: "sync\nouter\ninner",
    explanation:
      "sync runs first. outer fires in macrotask 1. Inside it, inner is registered as a new macrotask. inner runs in macrotask 2.",
    keyInsight:
      "A setTimeout inside a setTimeout callback schedules a new macrotask — runs in a future event loop iteration.",
  },

  {
    id: 31,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Promise.then is always async — even when resolved",
    tags: ["promise", "microtask", "always-async"],
    companies: ["Razorpay", "Swiggy", "CRED"],
    code: `let x = 0;
Promise.resolve().then(() => { x = 1; });
console.log(x);`,
    answer: "0",
    explanation:
      "Even though Promise.resolve() is already resolved, .then is always async (microtask). x is still 0 when synchronously logged.",
    keyInsight:
      "Promise .then callbacks are ALWAYS asynchronous — guaranteed by the spec, even for already-resolved promises.",
  },

  {
    id: 32,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "async function always returns a Promise",
    tags: ["async", "promise", "instanceof"],
    companies: ["Flipkart", "Swiggy", "Zomato"],
    code: `async function getValue() { return 42; }
const result = getValue();
console.log(result instanceof Promise);
result.then(v => console.log(v));`,
    answer: "true\n42",
    explanation:
      "async functions always return a Promise. result is a Promise, not 42. .then unwraps the value.",
    keyInsight:
      "async functions always return a Promise wrapping their return value.",
  },

  {
    id: 33,
    cat: "Event Loop & Promises",
    difficulty: "hard",
    title: "Multiple awaits — each is a microtask suspension",
    tags: ["async", "await", "multiple", "order"],
    companies: ["Razorpay", "Atlassian", "Google"],
    code: `async function run() {
  console.log('A');
  await null;
  console.log('B');
  await null;
  console.log('C');
}
run();
console.log('D');`,
    answer: "A\nD\nB\nC",
    explanation:
      "A logs sync. First await suspends. D logs sync. Microtask resumes: B. Second await suspends. Microtask resumes: C.",
    keyInsight:
      "Each await is a suspension point. Code between awaits runs as separate microtasks.",
  },

  {
    id: 34,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Promise.reject caught by .catch — chain continues",
    tags: ["promise", "catch", "reject", "chain"],
    companies: ["Flipkart", "PhonePe"],
    code: `Promise.reject(42)
  .catch(v => v + 1)
  .then(v => console.log(v));`,
    answer: "43",
    explanation:
      ".catch handles the rejection (v=42), returns 43. The chain continues — next .then receives 43.",
    keyInsight:
      ".catch can return a value to convert rejection back to fulfillment and continue the chain.",
  },

  {
    id: 35,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "Promise.all preserves order",
    tags: ["promise", "promise-all", "order"],
    companies: ["Razorpay", "Swiggy", "Amazon"],
    code: `Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(values => console.log(values.join(',')));`,
    answer: "1,2,3",
    explanation:
      "Promise.all waits for all and resolves with an array of values in the original order.",
    keyInsight:
      "Promise.all preserves input order in results regardless of which promise resolves first.",
  },

  {
    id: 36,
    cat: "Event Loop & Promises",
    difficulty: "medium",
    title: "queueMicrotask runs before setTimeout",
    tags: ["queueMicrotask", "microtask", "settimeout"],
    companies: ["Razorpay", "CRED", "Google"],
    code: `console.log('1');
setTimeout(() => console.log('2'), 0);
queueMicrotask(() => console.log('3'));
console.log('4');`,
    answer: "1\n4\n3\n2",
    explanation:
      "Sync (1, 4). Microtask: queueMicrotask callback (3). Macrotask: setTimeout (2).",
    keyInsight:
      "queueMicrotask schedules a microtask — same queue as Promise.then, runs before any macrotask.",
  },

  {
    id: 37,
    cat: "Event Loop & Promises",
    difficulty: "hard",
    title: "throw inside .then becomes rejection, caught by .catch",
    tags: ["promise", "throw", "catch", "error"],
    companies: ["Razorpay", "Atlassian", "CRED"],
    code: `Promise.resolve('ok')
  .then(() => { throw new Error('oops'); })
  .catch(e => e.message)
  .then(msg => console.log(msg));`,
    answer: "oops",
    explanation:
      'throw inside .then converts to rejected Promise. .catch handles it and returns e.message. Next .then receives "oops".',
    keyInsight:
      "throw inside .then = return Promise.reject(). Errors propagate down the chain until a .catch handles them.",
  },

  // ─── TYPE COERCION (12) ──────────────────────────────────────────────────

  {
    id: 38,
    cat: "Type Coercion",
    difficulty: "easy",
    title: "Plus operator: string concat vs numeric add",
    tags: ["coercion", "plus", "string", "number"],
    companies: ["Flipkart", "Razorpay", "Zomato", "Paytm"],
    code: `console.log(1 + '2');
console.log('3' - 1);
console.log(true + false);
console.log(null + 1);`,
    answer: "12\n2\n1\n1",
    explanation:
      '1+"2": + with string → "12". "3"-1: - forces numeric → 2. true+false: 1+0=1. null+1: null→0, 0+1=1.',
    keyInsight:
      "+ prefers string concatenation when either side is a string. - always forces numeric conversion.",
  },

  {
    id: 39,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "Loose equality edge cases with null",
    tags: ["coercion", "equality", "null", "undefined"],
    companies: ["Flipkart", "Razorpay", "Paytm", "Zomato"],
    code: `console.log(0 == false);
console.log('' == false);
console.log(null == undefined);
console.log(null == false);`,
    answer: "true\ntrue\ntrue\nfalse",
    explanation:
      '0==false: both→0. ""==false: both→0. null==undefined: spec rule. null==false: null only equals null or undefined.',
    keyInsight:
      'null is only == to null and undefined — NOT to 0, false, or "".',
  },

  {
    id: 40,
    cat: "Type Coercion",
    difficulty: "easy",
    title: "typeof for common values",
    tags: ["typeof", "primitives"],
    companies: ["Razorpay", "Flipkart", "Amazon", "Microsoft"],
    code: `console.log(typeof null);
console.log(typeof undefined);
console.log(typeof []);
console.log(typeof function(){});`,
    answer: "object\nundefined\nobject\nfunction",
    explanation:
      'typeof null = "object" is a famous JS bug. typeof [] = "object" (arrays are objects). Functions have their own typeof result.',
    keyInsight:
      'typeof null = "object" is a historic bug. Use Array.isArray() for arrays.',
  },

  {
    id: 41,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "Truthy and falsy — empty array and object are truthy",
    tags: ["boolean", "truthy", "falsy"],
    companies: ["Flipkart", "Zomato", "Paytm", "Meesho"],
    code: `console.log(Boolean(0));
console.log(Boolean(''));
console.log(Boolean(null));
console.log(Boolean([]));
console.log(Boolean({}));`,
    answer: "false\nfalse\nfalse\ntrue\ntrue",
    explanation:
      'Falsy: 0, "", null, undefined, NaN, false. Everything else is truthy — including empty arrays and objects.',
    keyInsight:
      "Empty arrays [] and objects {} are TRUTHY. This surprises many developers.",
  },

  {
    id: 42,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "Unary plus converts to number",
    tags: ["coercion", "unary-plus", "number"],
    companies: ["Razorpay", "Flipkart"],
    code: `console.log(+'');
console.log(+null);
console.log(+undefined);
console.log(+true);
console.log(+'3.14');`,
    answer: "0\n0\nNaN\n1\n3.14",
    explanation:
      '+"" → 0. +null → 0. +undefined → NaN. +true → 1. +"3.14" → 3.14.',
    keyInsight:
      "Unary + is the shortest coercion to number. undefined and non-numeric strings produce NaN.",
  },

  {
    id: 43,
    cat: "Type Coercion",
    difficulty: "hard",
    title: "null comparison inconsistency",
    tags: ["coercion", "comparison", "null", "quirk"],
    companies: ["Razorpay", "CRED", "Google"],
    code: `console.log(null > 0);
console.log(null == 0);
console.log(null >= 0);`,
    answer: "false\nfalse\ntrue",
    explanation:
      "null>0: null→0, 0>0=false. null==0: false (null only equals undefined). null>=0: null→0, 0>=0=true. Famous inconsistency!",
    keyInsight:
      "null coerces to 0 for relational ops (>, <, >=, <=) but NOT for ==. This creates the famous null>=0 && !(null==0) quirk.",
  },

  {
    id: 44,
    cat: "Type Coercion",
    difficulty: "easy",
    title: "Short circuit: || vs ?? difference",
    tags: ["short-circuit", "or", "nullish", "??"],
    companies: ["Razorpay", "Swiggy", "Flipkart", "CRED"],
    code: `console.log(0 || 'default');
console.log(1 && 'value');
console.log(null ?? 'fallback');
console.log(0 ?? 'not this');`,
    answer: "default\nvalue\nfallback\n0",
    explanation:
      "||: first truthy or last. &&: first falsy or last. ??: right only if left is null/undefined. 0 is not null, so ?? keeps 0.",
    keyInsight:
      '?? only triggers on null/undefined. || also triggers on 0, "", false. Use ?? when 0 or "" are valid values.',
  },

  {
    id: 45,
    cat: "Type Coercion",
    difficulty: "hard",
    title: "Object valueOf for arithmetic, toString for template",
    tags: ["coercion", "valueOf", "toString", "primitive"],
    companies: ["Google", "CRED", "Atlassian"],
    code: `const obj = {
  valueOf()  { return 42; },
  toString() { return 'obj'; },
};
console.log(obj + 1);
console.log(\`\${obj}\`);
console.log(String(obj));`,
    answer: "43\nobj\nobj",
    explanation:
      'obj+1: + with number prefers valueOf (42+1=43). Template literal prefers toString ("obj"). String() calls toString ("obj").',
    keyInsight:
      "For arithmetic +: valueOf is preferred. For template literals and String(): toString is preferred.",
  },

  {
    id: 46,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "parseInt stops at first invalid character",
    tags: ["parseInt", "radix", "NaN"],
    companies: ["Flipkart", "Zomato", "Paytm"],
    code: `console.log(parseInt('10px'));
console.log(parseInt('0x1F'));
console.log(parseInt('10', 2));
console.log(parseInt('hello'));`,
    answer: "10\n31\n2\nNaN",
    explanation:
      '"10px"→10 (stops at p). "0x1F" is hex=31. Base 2: "10"=2. "hello"→NaN (no valid digits).',
    keyInsight:
      "parseInt stops at the first non-parseable character. Always specify the radix to avoid ambiguity.",
  },

  {
    id: 47,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "String comparison is lexicographic",
    tags: ["coercion", "comparison", "string", "lexicographic"],
    companies: ["Flipkart", "Paytm", "ShareChat"],
    code: `console.log('5' > 3);
console.log('5' > '30');
console.log('10' > '9');`,
    answer: "true\ntrue\nfalse",
    explanation:
      '"5">3: coerces to numbers, 5>3=true. "5">"30": string compare, "5" char > "3" char=true. "10">"9": "1"<"9"=false.',
    keyInsight:
      "Number vs string uses numeric comparison. String vs string uses char codes (lexicographic).",
  },

  {
    id: 48,
    cat: "Type Coercion",
    difficulty: "hard",
    title: "Array coercion with plus operator",
    tags: ["coercion", "array", "plus", "toString"],
    companies: ["Razorpay", "Google", "CRED"],
    code: `console.log([] + []);
console.log([] + {});
console.log(+[]);
console.log(+[42]);`,
    answer: "\n[object Object]\n0\n42",
    explanation:
      '[]+[]: ""+"" = "". []+{}: ""+"[object Object]". +[]: []→""→0. +[42]: "42"→42.',
    keyInsight:
      'Arrays convert to their string representation for coercion: [] → "", [1,2] → "1,2".',
  },

  {
    id: 49,
    cat: "Type Coercion",
    difficulty: "easy",
    title: "NaN is not equal to anything including itself",
    tags: ["nan", "equality", "Number.isNaN"],
    companies: ["Razorpay", "Flipkart", "Amazon"],
    code: `console.log(NaN === NaN);
console.log(NaN == NaN);
console.log(isNaN('hello'));
console.log(Number.isNaN('hello'));`,
    answer: "false\nfalse\ntrue\nfalse",
    explanation:
      'NaN is the only value not equal to itself. isNaN("hello") coerces to NaN first (true). Number.isNaN doesn\'t coerce — "hello" is not NaN (false).',
    keyInsight:
      "NaN !== NaN always. Number.isNaN() is strict (no coercion). isNaN() converts first.",
  },

  {
    id: 50,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "Object equality is reference-based",
    tags: ["equality", "reference", "object"],
    companies: ["Flipkart", "Zomato", "Amazon", "Microsoft"],
    code: `const a = { x: 1 };
const b = { x: 1 };
const c = a;
console.log(a == b);
console.log(a === b);
console.log(a === c);
console.log(a.x === c.x);`,
    answer: "false\nfalse\ntrue\ntrue",
    explanation:
      "a and b are different objects — same content but different references. c = a copies the reference, so a===c is true.",
    keyInsight:
      "Object equality compares references, not content. Two objects with identical properties are NOT equal unless same reference.",
  },

  // ─── HOISTING (7) ────────────────────────────────────────────────────────

  {
    id: 51,
    cat: "Hoisting",
    difficulty: "easy",
    title: "var declaration hoisted as undefined",
    tags: ["hoisting", "var", "undefined"],
    companies: ["Flipkart", "Zomato", "Paytm", "Amazon"],
    code: `console.log(x);
var x = 5;
console.log(x);`,
    answer: "undefined\n5",
    explanation:
      "var declarations are hoisted (moved up) but not their assignments. First log sees the hoisted-but-uninitialized x.",
    keyInsight:
      "var hoisting: declaration moves to the top, assignment stays. Value is undefined before assignment.",
  },

  {
    id: 52,
    cat: "Hoisting",
    difficulty: "easy",
    title: "Function declaration fully hoisted",
    tags: ["hoisting", "function-declaration"],
    companies: ["Razorpay", "Flipkart", "ShareChat"],
    code: `console.log(greet('Alice'));
function greet(name) { return 'Hello, ' + name; }`,
    answer: "Hello, Alice",
    explanation:
      "Function declarations are fully hoisted — name and body both. You can call them before they appear in source.",
    keyInsight:
      "Function declarations hoist completely. Function expressions do not.",
  },

  {
    id: 53,
    cat: "Hoisting",
    difficulty: "easy",
    title: "Function expression not hoisted",
    tags: ["hoisting", "function-expression", "typeof"],
    companies: ["Razorpay", "Flipkart", "Paytm"],
    code: `console.log(typeof greet);
var greet = function() { return 'hello'; };
console.log(typeof greet);`,
    answer: "undefined\nfunction",
    explanation:
      "var greet is hoisted as undefined. The assignment happens at runtime. Before it, greet is undefined.",
    keyInsight:
      "Function expressions (var fn = function(){}) — only the var declaration is hoisted, as undefined.",
  },

  {
    id: 54,
    cat: "Hoisting",
    difficulty: "medium",
    title: "Local var shadows outer — from start of function",
    tags: ["hoisting", "var", "shadowing"],
    companies: ["Razorpay", "Flipkart", "Zomato"],
    code: `var a = 1;
function test() {
  console.log(a);
  var a = 2;
  console.log(a);
}
test();
console.log(a);`,
    answer: "undefined\n2\n1",
    explanation:
      "var a inside test() is hoisted — it shadows the global a from the start. First log: hoisted undefined. Then assigned 2. Global a stays 1.",
    keyInsight:
      "Local var declarations shadow the outer variable from the BEGINNING of the function — not just from where they appear.",
  },

  {
    id: 55,
    cat: "Hoisting",
    difficulty: "medium",
    title: "Function declaration takes priority over var in hoisting",
    tags: ["hoisting", "function-declaration", "var"],
    companies: ["Razorpay", "CRED", "Google"],
    code: `console.log(typeof foo);
var foo = 1;
function foo() { return 2; }
console.log(typeof foo);`,
    answer: "function\nnumber",
    explanation:
      "Function declarations win over var during hoisting phase. At start, foo is the function. Then var foo=1 executes at runtime — overwriting with a number.",
    keyInsight:
      "Function declarations beat var declarations in the hoisting phase. But var assignments at runtime overwrite them.",
  },

  {
    id: 56,
    cat: "Hoisting",
    difficulty: "medium",
    title: "Last function declaration wins",
    tags: ["hoisting", "function-declaration", "overriding"],
    companies: ["Razorpay", "Flipkart"],
    code: `console.log(fn());
function fn() { return 1; }
function fn() { return 2; }`,
    answer: "2",
    explanation:
      "Both function declarations are hoisted. The second overwrites the first. Only the last one remains.",
    keyInsight:
      "Multiple function declarations with the same name: the last one wins.",
  },

  {
    id: 57,
    cat: "Hoisting",
    difficulty: "hard",
    title: "var escapes block, let does not",
    tags: ["hoisting", "var", "let", "block"],
    companies: ["Razorpay", "Flipkart", "Zomato"],
    code: `function test() {
  if (true) {
    var x = 10;
    let y = 20;
  }
  console.log(x);
  console.log(typeof y);
}
test();`,
    answer: "10\nundefined",
    explanation:
      'var x escapes the if block (function-scoped). let y is block-scoped — inaccessible outside. typeof y returns "undefined" safely.',
    keyInsight:
      'var escapes blocks. let/const are block-scoped. typeof on a block-scoped variable outside its block returns "undefined".',
  },

  // ─── PROTOTYPES & INHERITANCE (8) ────────────────────────────────────────

  {
    id: 58,
    cat: "Prototypes & Inheritance",
    difficulty: "easy",
    title: "instanceof traverses the prototype chain",
    tags: ["instanceof", "prototype", "chain"],
    companies: ["Google", "Amazon", "Microsoft", "Flipkart"],
    code: `console.log([] instanceof Array);
console.log([] instanceof Object);
console.log({} instanceof Array);`,
    answer: "true\ntrue\nfalse",
    explanation:
      "Arrays inherit from Array.prototype AND Object.prototype. [] instanceof Object is true. {} does not inherit from Array.",
    keyInsight:
      "instanceof traverses the full prototype chain. All objects are ultimately instanceof Object.",
  },

  {
    id: 59,
    cat: "Prototypes & Inheritance",
    difficulty: "medium",
    title: "hasOwnProperty vs in operator",
    tags: ["prototype", "hasOwnProperty", "in"],
    companies: ["Razorpay", "Google", "Flipkart"],
    code: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };
const dog = new Animal('Rex');
console.log(dog.hasOwnProperty('name'));
console.log(dog.hasOwnProperty('speak'));
console.log('speak' in dog);`,
    answer: "true\nfalse\ntrue",
    explanation:
      "name is own. speak is on the prototype — hasOwnProperty is false. in checks the whole chain — true.",
    keyInsight:
      "hasOwnProperty = own only. in = entire chain. Use hasOwnProperty to distinguish instance vs inherited.",
  },

  {
    id: 60,
    cat: "Prototypes & Inheritance",
    difficulty: "medium",
    title: "Class method override and instanceof",
    tags: ["class", "extends", "override", "instanceof"],
    companies: ["Flipkart", "Amazon", "Microsoft"],
    code: `class Animal {
  speak() { return 'generic'; }
}
class Dog extends Animal {
  speak() { return 'woof'; }
}
const d = new Dog();
console.log(d.speak());
console.log(d instanceof Dog);
console.log(d instanceof Animal);`,
    answer: "woof\ntrue\ntrue",
    explanation:
      "Dog.speak() overrides Animal.speak(). d is instanceof both since Dog extends Animal.",
    keyInsight:
      "Subclass instances are instanceof both the subclass and all parent classes.",
  },

  {
    id: 61,
    cat: "Prototypes & Inheritance",
    difficulty: "medium",
    title: "super calls the parent method",
    tags: ["class", "super", "override"],
    companies: ["Google", "Microsoft", "CRED"],
    code: `class Shape {
  describe() { return 'shape'; }
}
class Circle extends Shape {
  describe() { return super.describe() + ' (circle)'; }
}
console.log(new Circle().describe());`,
    answer: "shape (circle)",
    explanation:
      "super.describe() calls the parent's version. The result is concatenated in the subclass.",
    keyInsight:
      "super.method() calls the parent class implementation — enabling extension rather than full replacement.",
  },

  {
    id: 62,
    cat: "Prototypes & Inheritance",
    difficulty: "medium",
    title: "Object.create sets prototype directly",
    tags: ["prototype", "Object.create", "getPrototypeOf"],
    companies: ["Google", "Atlassian", "CRED"],
    code: `const proto = {
  greet() { return 'Hello, ' + this.name; }
};
const obj = Object.create(proto);
obj.name = 'Alice';
console.log(obj.greet());
console.log(Object.getPrototypeOf(obj) === proto);`,
    answer: "Hello, Alice\ntrue",
    explanation:
      "Object.create(proto) creates a new object with proto as its prototype. greet() is found via chain.",
    keyInsight:
      "Object.create(proto) is the direct way to set up prototype inheritance without classes.",
  },

  {
    id: 63,
    cat: "Prototypes & Inheritance",
    difficulty: "medium",
    title: "Own property shadows prototype property",
    tags: ["prototype", "shadowing", "lookup"],
    companies: ["Razorpay", "Google", "Flipkart"],
    code: `const proto = { x: 1, y: 2 };
const obj = Object.create(proto);
obj.x = 10;
console.log(obj.x);
console.log(obj.y);
console.log(obj.hasOwnProperty('y'));`,
    answer: "10\n2\nfalse",
    explanation:
      'obj.x=10 shadows proto.x=1. y is not on obj, found on proto. hasOwnProperty("y") is false.',
    keyInsight:
      "Own properties shadow prototype properties. The prototype is consulted only for missing own properties.",
  },

  {
    id: 64,
    cat: "Prototypes & Inheritance",
    difficulty: "hard",
    title: "Prototype changes visible to existing instances",
    tags: ["prototype", "dynamic", "mutation"],
    companies: ["Google", "CRED", "Atlassian"],
    code: `function Vehicle(type) { this.type = type; }
const car = new Vehicle('car');
Vehicle.prototype.describe = function() {
  return 'I am a ' + this.type;
};
console.log(car.describe());`,
    answer: "I am a car",
    explanation:
      "Adding to the prototype AFTER creating instances still works — prototype lookup is dynamic, not a snapshot at creation time.",
    keyInsight:
      "Prototype changes are immediately reflected in all existing instances — the chain is looked up dynamically at call time.",
  },

  {
    id: 65,
    cat: "Prototypes & Inheritance",
    difficulty: "hard",
    title: "Constructor property points back to the class",
    tags: ["prototype", "constructor", "class"],
    companies: ["Google", "Microsoft", "Atlassian"],
    code: `class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
const p = new Point(1, 2);
console.log(p.constructor === Point);
console.log(p.constructor === Object);
console.log(p instanceof Point);`,
    answer: "true\nfalse\ntrue",
    explanation:
      "p.constructor is inherited from Point.prototype and points to Point. It is not Object.",
    keyInsight:
      "constructor property is inherited from the class prototype — it's useful for identifying an object's constructor.",
  },

  // ─── ARRAY METHODS (10) ──────────────────────────────────────────────────

  {
    id: 66,
    cat: "Array Methods",
    difficulty: "easy",
    title: "map transforms each element",
    tags: ["array", "map"],
    companies: ["Flipkart", "Amazon", "Meesho"],
    code: `const nums = [1, 2, 3, 4, 5];
console.log(nums.map(n => n * n).join(','));`,
    answer: "1,4,9,16,25",
    explanation:
      "map creates a new array by applying the callback to each element.",
    keyInsight:
      "map always returns a new array of the same length. It transforms without mutating.",
  },

  {
    id: 67,
    cat: "Array Methods",
    difficulty: "medium",
    title: "filter then map chain",
    tags: ["array", "filter", "map", "chain"],
    companies: ["Flipkart", "Swiggy", "Amazon"],
    code: `const result = [1, 2, 3, 4, 5, 6]
  .filter(n => n % 2 === 0)
  .map(n => n * 3);
console.log(result.join(','));`,
    answer: "6,12,18",
    explanation: "filter keeps evens [2,4,6], map multiplies each by 3.",
    keyInsight:
      "Array methods chain fluently — each returns a new array for the next method.",
  },

  {
    id: 68,
    cat: "Array Methods",
    difficulty: "medium",
    title: "reduce accumulates to a single value",
    tags: ["array", "reduce"],
    companies: ["Razorpay", "Flipkart", "Amazon", "CRED"],
    code: `const items = ['hello', 'world', 'foo'];
const total = items.reduce((acc, w) => acc + w.length, 0);
console.log(total);`,
    answer: "13",
    explanation: "5+5+3=13. reduce folds the array into one value.",
    keyInsight:
      "reduce is the most powerful array method — it can produce any output type.",
  },

  {
    id: 69,
    cat: "Array Methods",
    difficulty: "medium",
    title: "find returns first match; filter returns all",
    tags: ["array", "find", "filter"],
    companies: ["Flipkart", "Swiggy", "Meesho"],
    code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Alice' },
];
const first = users.find(u => u.name === 'Alice');
const all   = users.filter(u => u.name === 'Alice');
console.log(first.id);
console.log(all.length);`,
    answer: "1\n2",
    explanation:
      "find returns the first Alice (id=1). filter returns all Alices — 2 results.",
    keyInsight:
      "find = first match (or undefined). filter = all matches (always an array).",
  },

  {
    id: 70,
    cat: "Array Methods",
    difficulty: "medium",
    title: "reduce to build a frequency object",
    tags: ["array", "reduce", "object", "frequency"],
    companies: ["Razorpay", "Flipkart", "Amazon"],
    code: `const chars = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = chars.reduce((acc, c) => {
  acc[c] = (acc[c] || 0) + 1;
  return acc;
}, {});
console.log(counts.a);
console.log(counts.b);`,
    answer: "3\n2",
    explanation: "reduce builds a frequency map. a=3, b=2.",
    keyInsight:
      "reduce can build any shape — objects, maps, nested structures, not just numbers.",
  },

  {
    id: 71,
    cat: "Array Methods",
    difficulty: "easy",
    title: "some and every — one fail vs all pass",
    tags: ["array", "some", "every"],
    companies: ["Flipkart", "Meesho", "Amazon"],
    code: `const nums = [2, 4, 6, 7, 8];
console.log(nums.every(n => n % 2 === 0));
console.log(nums.some(n => n % 2 !== 0));
console.log(nums.every(n => n > 0));`,
    answer: "false\ntrue\ntrue",
    explanation:
      "every: 7 fails even check. some: 7 is odd (at least one). every positive: all > 0.",
    keyInsight: "every = all must pass. some = at least one must pass.",
  },

  {
    id: 72,
    cat: "Array Methods",
    difficulty: "medium",
    title: "flatMap — map then flatten one level",
    tags: ["array", "flatMap"],
    companies: ["Flipkart", "CRED", "Swiggy"],
    code: `const sentences = ['hello world', 'foo bar'];
const words = sentences.flatMap(s => s.split(' '));
console.log(words.length);
console.log(words[1]);`,
    answer: "4\nworld",
    explanation:
      'flatMap maps to arrays then flattens one level. ["hello","world"] + ["foo","bar"] → 4 words.',
    keyInsight:
      "flatMap = map + flat(1). Perfect when each element produces multiple values.",
  },

  {
    id: 73,
    cat: "Array Methods",
    difficulty: "medium",
    title: "Default sort is lexicographic — not numeric",
    tags: ["array", "sort", "lexicographic", "comparator"],
    companies: ["Razorpay", "Flipkart", "Amazon", "Zomato"],
    code: `const nums = [10, 9, 2, 1, 100];
console.log([...nums].sort().join(','));
console.log([...nums].sort((a, b) => a - b).join(','));`,
    answer: "1,10,100,2,9\n1,2,9,10,100",
    explanation:
      'Default sort converts to strings: "10" < "2" because "1"<"2". With comparator (a-b): numeric sort works.',
    keyInsight:
      "Default Array.sort() is lexicographic. Always pass (a,b) => a-b for numeric sorting.",
  },

  {
    id: 74,
    cat: "Array Methods",
    difficulty: "medium",
    title: "Array destructuring with skip and rest",
    tags: ["array", "destructuring", "rest", "skip"],
    companies: ["Flipkart", "CRED", "Swiggy"],
    code: `const [first, , third, ...rest] = [1, 2, 3, 4, 5];
console.log(first);
console.log(third);
console.log(rest.join(','));`,
    answer: "1\n3\n4,5",
    explanation: "first=1, second skipped, third=3, rest=[4,5].",
    keyInsight:
      "Destructuring supports skipping (empty comma) and rest to collect remaining elements.",
  },

  {
    id: 75,
    cat: "Array Methods",
    difficulty: "medium",
    title: "Spread copy before sort preserves original",
    tags: ["array", "spread", "sort", "immutability"],
    companies: ["Razorpay", "Flipkart", "Amazon"],
    code: `const original = [3, 1, 2];
const sorted = [...original].sort();
console.log(original.join(','));
console.log(sorted.join(','));`,
    answer: "3,1,2\n1,2,3",
    explanation:
      "[...original] creates an independent copy. sort() mutates sorted, not original.",
    keyInsight:
      "sort() mutates in place. Always spread first to avoid mutating the source.",
  },

  // ─── MODERN JS (12) ──────────────────────────────────────────────────────

  {
    id: 76,
    cat: "Modern JS",
    difficulty: "easy",
    title: "Destructuring defaults apply only for undefined",
    tags: ["destructuring", "default", "null"],
    companies: ["Razorpay", "Flipkart", "CRED"],
    code: `const { a = 1, b = 2, c = 3 } = { a: 10, b: null };
console.log(a);
console.log(b);
console.log(c);`,
    answer: "10\nnull\n3",
    explanation:
      "a=10 (provided). b=null — null is not undefined, so default 2 does not apply. c missing → default 3.",
    keyInsight:
      'Destructuring defaults only trigger on undefined. null, 0, "" all suppress the default.',
  },

  {
    id: 77,
    cat: "Modern JS",
    difficulty: "easy",
    title: "Object spread — later properties win",
    tags: ["spread", "object", "merge", "override"],
    companies: ["Razorpay", "Swiggy", "Flipkart"],
    code: `const base     = { x: 1, y: 2 };
const override = { y: 20, z: 3 };
const merged   = { ...base, ...override };
console.log(merged.x);
console.log(merged.y);
console.log(merged.z);`,
    answer: "1\n20\n3",
    explanation:
      "override.y=20 overwrites base.y=2. x and z are unique to their source.",
    keyInsight:
      "In object spread, later properties override earlier ones. Order matters.",
  },

  {
    id: 78,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Optional chaining prevents TypeError on missing properties",
    tags: ["optional-chaining", "null", "undefined"],
    companies: ["Razorpay", "Swiggy", "PhonePe", "CRED"],
    code: `const user = { profile: { city: 'NY' } };
console.log(user?.profile?.city);
console.log(user?.settings?.theme);`,
    answer: "NY\nundefined",
    explanation:
      'user?.profile?.city: chain exists, returns "NY". user?.settings returns undefined, ?.theme short-circuits to undefined — no TypeError.',
    keyInsight:
      "?. returns undefined instead of throwing when a link in the chain is null/undefined.",
  },

  {
    id: 79,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Nullish coalescing ?? vs OR ||",
    tags: ["nullish-coalescing", "or", "falsy", "zero"],
    companies: ["Razorpay", "Flipkart", "Swiggy"],
    code: `const config = { timeout: 0, debug: null };
console.log(config.timeout  ?? 1000);
console.log(config.timeout  || 1000);
console.log(config.debug    ?? true);`,
    answer: "0\n1000\ntrue",
    explanation:
      "timeout=0: ?? keeps 0 (not null/undefined). || treats 0 as falsy → 1000. debug=null: ?? triggers → true.",
    keyInsight:
      "?? only triggers on null/undefined. || triggers on any falsy value including 0.",
  },

  {
    id: 80,
    cat: "Modern JS",
    difficulty: "easy",
    title: "Template literal expressions",
    tags: ["template-literal", "expression"],
    companies: ["Flipkart", "Meesho", "ShareChat"],
    code: `const a = 5, b = 10;
console.log(\`\${a} + \${b} = \${a + b}\`);
console.log(\`\${a > b ? 'a wins' : 'b wins'}\`);`,
    answer: "5 + 10 = 15\nb wins",
    explanation:
      'Template literals evaluate any expression inside ${}. a+b=15. a>b is false → "b wins".',
    keyInsight:
      "Template literals evaluate any JS expression inside ${} — not just variables.",
  },

  {
    id: 81,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Computed property names with expressions",
    tags: ["computed-property", "object", "dynamic"],
    companies: ["Razorpay", "CRED", "Google"],
    code: `const key = 'name';
const obj = {
  [key]: 'Alice',
  [\`get\${key[0].toUpperCase() + key.slice(1)}\`]() {
    return this[key];
  }
};
console.log(obj.name);
console.log(obj.getName());`,
    answer: "Alice\nAlice",
    explanation:
      '[key] = "name". The computed method name evaluates to "getName".',
    keyInsight:
      "Computed property names [expr] let you use dynamic keys and method names in object literals.",
  },

  {
    id: 82,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Symbol keys hidden from Object.keys",
    tags: ["symbol", "key", "Object.keys", "enumerable"],
    companies: ["Google", "Atlassian", "CRED"],
    code: `const id = Symbol('id');
const user = { name: 'Alice', [id]: 42 };
console.log(user.name);
console.log(user[id]);
console.log(Object.keys(user).length);`,
    answer: "Alice\n42\n1",
    explanation:
      "Symbol keys must be accessed directly with [id]. Object.keys only returns string keys — length is 1.",
    keyInsight:
      "Symbol keys are non-enumerable by default — hidden from Object.keys, for...in, and JSON.stringify.",
  },

  {
    id: 83,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Getter and setter intercept access",
    tags: ["getter", "setter", "computed"],
    companies: ["Google", "CRED", "Atlassian"],
    code: `const obj = {
  _name: 'alice',
  get name()  { return this._name.toUpperCase(); },
  set name(v) { this._name = v.trim().toLowerCase(); }
};
console.log(obj.name);
obj.name = '  Bob  ';
console.log(obj.name);`,
    answer: "ALICE\nBOB",
    explanation:
      "Getter transforms to uppercase. Setter trims and lowercases. Both used with property syntax.",
    keyInsight:
      "Getters/setters intercept property access and assignment. They look like properties but run code.",
  },

  {
    id: 84,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Logical assignment operators",
    tags: ["logical-assignment", "??=", "||=", "&&="],
    companies: ["Razorpay", "CRED", "Swiggy"],
    code: `let a = null;
let b = 0;
let c = 'existing';
a ??= 'default';
b ||= 'fallback';
c &&= 'updated';
console.log(a);
console.log(b);
console.log(c);`,
    answer: "default\nfallback\nupdated",
    explanation:
      "a??=: null, so assign. b||=: 0 is falsy, so assign. c&&=: truthy, so assign.",
    keyInsight:
      "??= assigns only if null/undefined. ||= if falsy. &&= only if truthy. They short-circuit.",
  },

  {
    id: 85,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Object.freeze prevents mutation silently",
    tags: ["Object.freeze", "immutability", "silent-fail"],
    companies: ["Razorpay", "CRED", "Google"],
    code: `const obj = Object.freeze({ x: 1, y: 2 });
obj.x = 99;
obj.z = 3;
console.log(obj.x);
console.log(obj.z);`,
    answer: "1\nundefined",
    explanation:
      "Object.freeze makes all properties non-writable. Assignments silently fail in non-strict mode.",
    keyInsight:
      "Object.freeze: mutations silently fail (non-strict mode). Frozen objects cannot be changed.",
  },

  {
    id: 86,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Map accepts any key type",
    tags: ["Map", "key", "size", "get"],
    companies: ["Razorpay", "Flipkart", "Atlassian"],
    code: `const map = new Map();
map.set('name', 'Alice');
map.set(42, 'answer');
map.set(true, 'yes');
console.log(map.size);
console.log(map.get(42));
console.log(map.has('missing'));`,
    answer: "3\nanswer\nfalse",
    explanation:
      'Map keys can be any type. size=3. get(42) retrieves by number key. has("missing") is false.',
    keyInsight:
      "Map accepts any value as key. Object keys are always coerced to strings.",
  },

  {
    id: 87,
    cat: "Modern JS",
    difficulty: "easy",
    title: "Set deduplicates and preserves insertion order",
    tags: ["Set", "dedup", "size", "spread"],
    companies: ["Flipkart", "Swiggy", "Amazon"],
    code: `const set = new Set([1, 2, 3, 2, 1, 3, 4]);
console.log(set.size);
set.add(5); set.add(1);
console.log(set.size);
console.log([...set][0]);`,
    answer: "4\n5\n1",
    explanation:
      "Duplicates removed: {1,2,3,4}=size 4. add(5)→5. add(1) already exists, no change. First element=1.",
    keyInsight:
      "Set stores unique values in insertion order. Adding a duplicate is silently ignored.",
  },

  // ─── GENERATORS & ITERATORS (6) ──────────────────────────────────────────

  {
    id: 88,
    cat: "Generators & Iterators",
    difficulty: "medium",
    title: "Generator pauses at yield, done true at end",
    tags: ["generator", "yield", "next", "done"],
    companies: ["Google", "Atlassian", "CRED"],
    code: `function* gen() {
  yield 1;
  yield 2;
}
const g = gen();
console.log(g.next().value);
console.log(g.next().value);
console.log(g.next().done);`,
    answer: "1\n2\ntrue",
    explanation:
      "First next(): value=1, done=false. Second: value=2, done=false. Third: function ends, done=true.",
    keyInsight:
      "Generators pause at yield. When the function completes, done becomes true.",
  },

  {
    id: 89,
    cat: "Generators & Iterators",
    difficulty: "medium",
    title: "return in generator — spread ignores return value",
    tags: ["generator", "return", "spread", "done"],
    companies: ["Google", "Atlassian"],
    code: `function* gen() {
  yield 1;
  return 99;
  yield 2;
}
const values = [...gen()];
console.log(values.length);
console.log(values.join(','));`,
    answer: "1\n1",
    explanation:
      "Spread stops at done:true. return gives {value:99, done:true} — spread ignores it. yield 2 unreachable.",
    keyInsight:
      "return in a generator terminates it. Spread/for...of ignores the return value — only yields are collected.",
  },

  {
    id: 90,
    cat: "Generators & Iterators",
    difficulty: "medium",
    title: "yield* delegates to another iterable",
    tags: ["generator", "yield*", "delegation"],
    companies: ["Google", "Atlassian", "CRED"],
    code: `function* inner() { yield 'a'; yield 'b'; }
function* outer() {
  yield 1;
  yield* inner();
  yield 2;
}
console.log([...outer()].join(','));`,
    answer: "1,a,b,2",
    explanation:
      "yield* delegates to inner(). outer yields 1, then all of inner (a, b), then 2.",
    keyInsight:
      "yield* delegates iteration to any iterable — another generator, array, string, etc.",
  },

  {
    id: 91,
    cat: "Generators & Iterators",
    difficulty: "easy",
    title: "Generator as lazy range",
    tags: ["generator", "range", "lazy", "spread"],
    companies: ["Atlassian", "CRED"],
    code: `function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
const sum = [...range(1, 5)].reduce((a, b) => a + b, 0);
console.log(sum);`,
    answer: "15",
    explanation:
      "range(1,5) yields 1,2,3,4,5. Spread collects them. reduce sums: 15.",
    keyInsight:
      "Generators produce values lazily — perfect for ranges, sequences, and infinite streams.",
  },

  {
    id: 92,
    cat: "Generators & Iterators",
    difficulty: "medium",
    title: "Custom iterable with Symbol.iterator",
    tags: ["iterator", "Symbol.iterator", "spread"],
    companies: ["Google", "Atlassian"],
    code: `const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let cur = this.from;
    const last = this.to;
    return {
      next() {
        return cur <= last
          ? { value: cur++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};
console.log([...range].join(','));`,
    answer: "1,2,3",
    explanation:
      "[Symbol.iterator]() returns a fresh iterator. Spread calls it and collects until done.",
    keyInsight:
      "Any object with [Symbol.iterator]() is iterable. It must return an object with a next() method.",
  },

  {
    id: 93,
    cat: "Generators & Iterators",
    difficulty: "hard",
    title: "next() argument becomes the value of the previous yield",
    tags: ["generator", "next", "two-way", "communication"],
    companies: ["Google", "Atlassian", "CRED"],
    code: `function* dialog() {
  const name = yield 'What is your name?';
  yield 'Hello, ' + name;
}
const g = dialog();
console.log(g.next().value);
console.log(g.next('Alice').value);`,
    answer: "What is your name?\nHello, Alice",
    explanation:
      'First next() starts the generator, returns "What is your name?". next("Alice") resumes — "Alice" becomes the result of the yield expression.',
    keyInsight:
      "next(val) injects val as the resolved value of the previous yield. The first next() argument is always ignored.",
  },

  // ─── BONUS QUESTIONS (7 more diverse topics) ─────────────────────────────

  {
    id: 94,
    cat: "Modern JS",
    difficulty: "hard",
    title: "Promise.allSettled handles mixed results",
    tags: ["promise", "allSettled", "status"],
    companies: ["Razorpay", "Swiggy", "PhonePe"],
    code: `Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('err'),
  Promise.resolve(3),
]).then(results => {
  console.log(results[0].status);
  console.log(results[1].status);
  console.log(results[1].reason);
});`,
    answer: "fulfilled\nrejected\nerr",
    explanation:
      "allSettled never rejects. Each result has status + value (fulfilled) or reason (rejected).",
    keyInsight:
      "Promise.allSettled waits for ALL regardless of outcome. Promise.all fails fast on first rejection.",
  },

  {
    id: 95,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Proxy intercepts property access",
    tags: ["proxy", "get", "trap", "reflect"],
    companies: ["Google", "Atlassian", "CRED"],
    code: `const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : prop + ' not found';
  }
};
const obj = new Proxy({ x: 1, y: 2 }, handler);
console.log(obj.x);
console.log(obj.z);`,
    answer: "1\nz not found",
    explanation:
      'The get trap intercepts ALL property access. x exists → returns 1. z missing → returns "z not found".',
    keyInsight:
      "Proxy get trap intercepts all property reads. Use it for default values, validation, or virtual properties.",
  },

  {
    id: 96,
    cat: "Array Methods",
    difficulty: "hard",
    title: "reduce to group and aggregate",
    tags: ["array", "reduce", "group", "aggregate"],
    companies: ["Razorpay", "Flipkart", "Amazon"],
    code: `const orders = [
  { cat: 'A', val: 10 },
  { cat: 'B', val: 20 },
  { cat: 'A', val: 30 },
];
const totals = orders.reduce((acc, o) => {
  acc[o.cat] = (acc[o.cat] || 0) + o.val;
  return acc;
}, {});
console.log(totals.A);
console.log(totals.B);`,
    answer: "40\n20",
    explanation: "reduce builds a totals map. A: 10+30=40. B: 20.",
    keyInsight:
      "reduce is ideal for grouping and aggregating — a single pass over an array to build any shape of output.",
  },

  {
    id: 97,
    cat: "Modern JS",
    difficulty: "medium",
    title: "Array.from with mapping function as range factory",
    tags: ["Array.from", "length", "mapping"],
    companies: ["Flipkart", "CRED", "Swiggy"],
    code: `const zeros = Array.from({ length: 3 }, () => 0);
const range = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(zeros.join(','));
console.log(range.join(','));`,
    answer: "0,0,0\n1,2,3,4,5",
    explanation:
      "Array.from with a length property creates an array. The second argument maps each element — _ is the value (undefined), i is the index.",
    keyInsight:
      "Array.from({length:n}, (_, i) => expr) is the idiomatic way to create filled arrays of specific length.",
  },

  {
    id: 98,
    cat: "Type Coercion",
    difficulty: "medium",
    title: "String spread — unicode-safe character split",
    tags: ["spread", "string", "iterable", "characters"],
    companies: ["Razorpay", "CRED", "Google"],
    code: `const str = 'hello';
const chars = [...str];
console.log(chars.length);
console.log(chars.reverse().join(''));`,
    answer: "5\nolleh",
    explanation:
      "Strings are iterable — spread gives an array of characters. reverse() and join() produce the reversed string.",
    keyInsight:
      '[...str] splits a string into characters correctly, even for multi-byte Unicode (unlike split("")).',
  },

  {
    id: 99,
    cat: "Event Loop & Promises",
    difficulty: "hard",
    title: "async try/catch catches awaited rejection",
    tags: ["async", "try-catch", "error", "rejection"],
    companies: ["Razorpay", "Swiggy", "PhonePe", "Atlassian"],
    code: `async function failingTask() {
  throw new Error('task failed');
}
async function main() {
  try {
    await failingTask();
    console.log('success');
  } catch (e) {
    console.log('caught: ' + e.message);
  }
}
main();`,
    answer: "caught: task failed",
    explanation:
      "async functions wrap throws in rejected Promises. await converts rejection back to a thrown error that try/catch handles.",
    keyInsight:
      "await unwraps Promise rejections into thrown errors. try/catch works naturally with async/await.",
  },

  {
    id: 100,
    cat: "Closures & Scope",
    difficulty: "hard",
    title: "Function is called with arguments object",
    tags: ["arguments", "rest", "function"],
    companies: ["Flipkart", "Razorpay", "Zomato"],
    code: `function sum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}
const sumRest = (...args) => args.reduce((a, b) => a + b, 0);
console.log(sum(1, 2, 3, 4));
console.log(sumRest(1, 2, 3, 4));`,
    answer: "10\n10",
    explanation:
      "arguments is available in regular functions (not arrows). Rest params (...args) work in both and are more explicit. Both produce the same sum.",
    keyInsight:
      "arguments is only available in regular functions. Rest params (...args) work everywhere and are the modern replacement.",
  },
];

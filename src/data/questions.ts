export interface Question {
  id: number
  cat: string
  q: string
  tags: ('core' | 'mid' | 'adv')[]
  answer: string
  hint?: string
}

export const CATEGORIES = [
  'Core JS', 'Functions', 'Async JS', 'Objects', 'Arrays',
  "'this' Keyword", 'Error Handling', 'Modern JS', 'Performance', 'DOM & Events',
  'Browser APIs'
]

export const questions: Question[] = [
  {
    id: 0, cat: 'Core JS', tags: ['core'],
    q: 'What is the difference between var, let, and const?',
    hint: 'Think about scope, hoisting, and reassignment',
    answer: `<p><strong>var</strong> is function-scoped and hoisted (initialized as <code>undefined</code>). <strong>let</strong> and <strong>const</strong> are block-scoped and in a Temporal Dead Zone before declaration.</p>
<pre><code>var x = 1;
let y = 2;    // block-scoped, reassignable
const z = 3;  // block-scoped, binding locked

if (true) {
  var a = 'leaks out';
  let b = 'stays in';
}
console.log(a); // 'leaks out'
console.log(b); // ReferenceError</code></pre>
<p><strong>const</strong> doesn't make values immutable — objects/arrays can still be mutated. The binding is locked, not the value.</p>
<div class="tip">💡 Default to const, use let only when reassignment is needed. Avoid var.</div>`
  },
  {
    id: 1, cat: 'Core JS', tags: ['core'],
    q: 'Explain closures with a practical example.',
    hint: 'A function that remembers its outer scope after the outer function returns',
    answer: `<p>A <strong>closure</strong> is a function that retains access to its lexical scope even after the outer function has returned.</p>
<pre><code>function makeCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count
  };
}
const counter = makeCounter();
counter.increment(); // 1
counter.increment(); // 2</code></pre>
<p><strong>Real-world uses:</strong> data encapsulation, factory functions, event handlers with state, memoization, partial application.</p>
<div class="tip">💡 Classic gotcha: var in a for-loop closure — all callbacks share the same variable. Fix with let or IIFE.</div>`
  },
  {
    id: 2, cat: 'Core JS', tags: ['core'],
    q: 'What is hoisting in JavaScript?',
    hint: 'Declarations are moved to top of scope before execution',
    answer: `<p>Hoisting moves <em>declarations</em> to the top of their scope during compilation — before execution. Initializations are NOT hoisted.</p>
<pre><code>console.log(a); // undefined (not ReferenceError)
var a = 5;

greet(); // Works! Function declarations fully hoisted
function greet() { console.log('hello'); }

sayHi(); // TypeError
var sayHi = () => console.log('hi');</code></pre>
<p>let/const are hoisted but live in a <strong>Temporal Dead Zone</strong> — accessing them before declaration throws a ReferenceError.</p>`
  },
  {
    id: 3, cat: 'Core JS', tags: ['mid'],
    q: 'Explain the event loop, call stack, and microtask queue.',
    hint: 'Synchronous → Microtasks (all) → Next Macrotask',
    answer: `<p>JS is single-threaded. The <strong>call stack</strong> runs sync code. Async callbacks go into task queues. The <strong>event loop</strong> picks tasks when the stack is empty.</p>
<p><strong>Microtasks</strong> (Promises, queueMicrotask) drain completely after each task before the next macrotask runs.</p>
<pre><code>console.log('1');
setTimeout(() => console.log('2'), 0); // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('4');
// Output: 1 → 4 → 3 → 2</code></pre>
<div class="tip">💡 Order: Sync → All Microtasks → Next Macrotask → All Microtasks → ...</div>`
  },
  {
    id: 4, cat: 'Core JS', tags: ['core'],
    q: 'What is the difference between == and ===?',
    hint: 'Type coercion vs strict type + value check',
    answer: `<p><code>==</code> performs type coercion. <code>===</code> checks value AND type — no coercion.</p>
<pre><code>0 == ''          // true  (both coerce to falsy)
0 == '0'         // true
0 === '0'        // false
null == undefined  // true (special case)
null === undefined // false
NaN == NaN       // false (NaN never equals itself)</code></pre>
<p>Always use <code>===</code>. Use <code>Number.isNaN()</code> to check for NaN.</p>`
  },
  {
    id: 5, cat: 'Functions', tags: ['mid'],
    q: 'What is the difference between call, apply, and bind?',
    hint: 'All set "this" — call=comma, apply=array, bind=returns new fn',
    answer: `<p>All three explicitly set <code>this</code>:</p>
<ul><li><strong>call(thisArg, arg1, arg2)</strong> — invoke immediately, args individually</li>
<li><strong>apply(thisArg, [args])</strong> — invoke immediately, args as array</li>
<li><strong>bind(thisArg, arg1)</strong> — returns new permanently-bound function</li></ul>
<pre><code>function greet(greeting, punct) {
  return \`\${greeting}, \${this.name}\${punct}\`;
}
const user = { name: 'Priya' };
greet.call(user, 'Hello', '!');     // "Hello, Priya!"
greet.apply(user, ['Hi', '.']);     // "Hi, Priya."
const fn = greet.bind(user, 'Hey');
fn('?');                            // "Hey, Priya?"</code></pre>
<div class="tip">💡 Call=Comma, Apply=Array, Bind=returns Bound fn</div>`
  },
  {
    id: 6, cat: 'Functions', tags: ['core'],
    q: 'How do arrow functions differ from regular functions?',
    hint: 'No own this, no arguments object, no new, no prototype',
    answer: `<p>Arrow functions are not just shorter syntax — key behavioral differences:</p>
<ul><li><strong>No own this</strong> — inherits lexical this from outer scope</li>
<li><strong>No arguments object</strong> — use rest params (...args)</li>
<li><strong>Cannot be constructors</strong> — new throws TypeError</li>
<li><strong>No prototype property</strong></li></ul>
<pre><code>const obj = {
  name: 'Dev',
  regular() { console.log(this.name); },  // 'Dev'
  arrow: () => console.log(this.name),    // undefined
};</code></pre>
<div class="tip">💡 Use arrow fns for callbacks (inherit this). Use regular fns for methods and constructors.</div>`
  },
  {
    id: 7, cat: 'Functions', tags: ['mid'],
    q: 'What is a pure function and why does it matter?',
    hint: 'Same input → same output, no side effects',
    answer: `<p>A <strong>pure function</strong>: (1) always returns the same output for same inputs, (2) has zero side effects.</p>
<pre><code>// Pure ✅
const add = (a, b) => a + b;

// Impure ❌ — modifies external state
let total = 0;
const addToTotal = (n) => { total += n; return total; };</code></pre>
<p>Pure functions are <strong>predictable, testable, and cacheable</strong>. React expects components and reducers to be pure.</p>`
  },
  {
    id: 8, cat: 'Async JS', tags: ['core'],
    q: 'Explain Promises — states, chaining, and error handling.',
    hint: 'pending → fulfilled/rejected; .then chains; .catch handles errors',
    answer: `<p>A Promise is a value that may be available now or later. States: <strong>pending → fulfilled / rejected</strong>. Once settled, immutable.</p>
<pre><code>fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => setLoading(false));</code></pre>
<p><strong>Combinators:</strong> Promise.all (all must resolve), Promise.allSettled (wait all), Promise.race (first settles), Promise.any (first resolves).</p>`
  },
  {
    id: 9, cat: 'Async JS', tags: ['mid'],
    q: 'How does async/await work under the hood?',
    hint: 'Syntactic sugar over Promises; await pauses the function, not the thread',
    answer: `<p>async/await is syntactic sugar over Promises. An async function always returns a Promise. await pauses only that function's execution.</p>
<pre><code>async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}</code></pre>
<div class="tip">💡 Parallel fetching: use Promise.all([fetch(a), fetch(b)]) instead of sequential awaits — ~2x faster.</div>`
  },
  {
    id: 10, cat: 'Async JS', tags: ['core'],
    q: 'What is callback hell and how do you avoid it?',
    hint: 'Pyramid of doom — nested callbacks; solve with Promises/async-await',
    answer: `<p>Deeply nested callbacks make code hard to read, debug, and maintain.</p>
<pre><code>// ❌ Callback hell
getUser(id, (user) => {
  getPosts(user, (posts) => {
    getComments(posts[0], (comments) => { ... });
  });
});

// ✅ Async/await
const user = await getUser(id);
const posts = await getPosts(user);
const comments = await getComments(posts[0]);</code></pre>`
  },
  {
    id: 11, cat: 'Objects', tags: ['mid'],
    q: 'How does prototypal inheritance work in JavaScript?',
    hint: 'Every object has a [[Prototype]] link — property lookup walks the chain',
    answer: `<p>Every JS object has an internal [[Prototype]] link. Property lookup walks up the chain until found or null.</p>
<pre><code>const animal = { speak() { return '...'; } };
const dog = Object.create(animal); // dog's proto = animal
dog.name = 'Rex';
dog.speak(); // Found on chain → '...'

// ES6 class is sugar over this
class Dog extends Animal {
  speak() { return 'Woof!'; }
}</code></pre>
<div class="tip">💡 Use hasOwnProperty() to check if a property is directly on the object vs inherited.</div>`
  },
  {
    id: 12, cat: 'Objects', tags: ['core'],
    q: 'What is the difference between shallow copy and deep copy?',
    hint: 'Shallow copies references; deep copies recursively',
    answer: `<p><strong>Shallow copy</strong>: top-level properties only — nested objects are still shared references. <strong>Deep copy</strong>: recursively copies everything.</p>
<pre><code>const orig = { a: 1, nested: { b: 2 } };

// Shallow — spread, Object.assign
const shallow = { ...orig };
shallow.nested.b = 99;
console.log(orig.nested.b); // 99 — orig mutated!

// Deep copy
const deep = structuredClone(orig); // ✅ modern recommended
// JSON.parse(JSON.stringify()) — simple but lossy (no undefined/Dates)</code></pre>`
  },
  {
    id: 13, cat: 'Arrays', tags: ['core'],
    q: 'When would you use map vs forEach vs reduce vs filter?',
    hint: 'map=transform, filter=subset, reduce=accumulate, forEach=side effects',
    answer: `<ul>
<li><strong>map</strong> — transform each element, returns new array of same length</li>
<li><strong>filter</strong> — keep matching elements, returns smaller array</li>
<li><strong>reduce</strong> — accumulate into single value (any type)</li>
<li><strong>forEach</strong> — side effects only, returns undefined, not chainable</li>
</ul>
<pre><code>const nums = [1,2,3,4,5];
nums.map(n => n * 2);                // [2,4,6,8,10]
nums.filter(n => n % 2 === 0);       // [2,4]
nums.reduce((sum, n) => sum + n, 0); // 15

// Chaining
nums.filter(n => n > 2).map(n => n ** 2); // [9,16,25]</code></pre>`
  },
  {
    id: 14, cat: "'this' Keyword", tags: ['mid'],
    q: "How does 'this' work in different contexts?",
    hint: 'Determined by how a function is called, not where it is defined',
    answer: `<p>this is determined by <strong>how a function is called</strong>:</p>
<ul>
<li><strong>Global</strong> → window / undefined (strict)</li>
<li><strong>Method call</strong> → the object before the dot</li>
<li><strong>new</strong> → the newly created object</li>
<li><strong>call/apply/bind</strong> → whatever you pass</li>
<li><strong>Arrow function</strong> → outer lexical scope</li>
<li><strong>Event listener</strong> → the element that fired</li>
</ul>
<pre><code>const obj = { val: 42, getVal() { return this.val; } };
const fn = obj.getVal;
fn();          // undefined — lost context!
fn.call(obj);  // 42 — restored</code></pre>`
  },
  {
    id: 15, cat: 'Error Handling', tags: ['mid'],
    q: 'How do you handle errors in async/await properly?',
    hint: 'try/catch, re-throw unexpected errors, never swallow silently',
    answer: `<pre><code>// Option 1: try/catch (most common)
async function fetchData() {
  try {
    const data = await api.get('/users');
    return data;
  } catch (err) {
    if (err.status === 404) handleNotFound();
    else throw err; // re-throw unexpected errors
  }
}

// Option 2: .catch() at call site
const data = await fetchData().catch(err => null);

// Option 3: go/to helper
const to = p => p.then(d => [null, d]).catch(e => [e, null]);
const [err, data2] = await to(fetchData());</code></pre>
<div class="tip">💡 Always handle promise rejections — unhandled ones crash Node.js.</div>`
  },
  {
    id: 16, cat: 'Modern JS', tags: ['adv'],
    q: 'What are generators and when would you use them?',
    hint: 'function* that can yield values lazily; returns an iterator',
    answer: `<p>Generators (function*) can pause execution and yield values one at a time.</p>
<pre><code>function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
for (const num of range(1, 5)) console.log(num); // 1,2,3,4,5

// Infinite lazy sequence
function* naturals() {
  let n = 0;
  while (true) yield n++;
}</code></pre>
<p><strong>Use cases:</strong> lazy/infinite sequences, custom iterators, Redux-Saga uses generators for async flows.</p>`
  },
  {
    id: 17, cat: 'Modern JS', tags: ['core'],
    q: 'What is optional chaining (?.) and nullish coalescing (??)?',
    hint: '?. short-circuits on null/undefined; ?? fallbacks only for null/undefined',
    answer: `<pre><code>// Optional chaining
const city = user?.address?.city;
const name = users?.[0]?.name;
const val = obj?.method?.();

// Nullish coalescing — fallback for null/undefined ONLY
const count = user.count ?? 0;
// if count=0, result is 0 (correct!)
// vs OR operator:
const bad = user.count || 0;
// if count=0, bad=0 but for wrong reason (0 is falsy)</code></pre>
<div class="tip">💡 Use ?? when 0, '', false are valid values. Use || for general falsy fallbacks.</div>`
  },
  {
    id: 18, cat: 'Performance', tags: ['mid'],
    q: 'What are debounce and throttle? When do you use each?',
    hint: 'Debounce=wait for pause; throttle=limit rate',
    answer: `<ul>
<li><strong>Debounce</strong> — fires AFTER user stops triggering. Best for: search input, resize, form validation</li>
<li><strong>Throttle</strong> — fires at most once per interval. Best for: scroll, mouse move</li>
</ul>
<pre><code>function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const onSearch = debounce((q) => fetchResults(q), 300);</code></pre>
<div class="tip">💡 Debounce = waits for storm to pass. Throttle = steady drip.</div>`
  },
  {
    id: 19, cat: 'DOM & Events', tags: ['mid'],
    q: 'Explain event delegation and why it is useful.',
    hint: 'One listener on parent; use event.target to identify the child',
    answer: `<p>Attach ONE listener to a parent instead of many listeners on children. Works because events bubble up the DOM.</p>
<pre><code>// ❌ Inefficient
document.querySelectorAll('li').forEach(li =>
  li.addEventListener('click', handleClick)
);

// ✅ Event delegation
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.matches('li')) handleClick(e.target);
});</code></pre>
<p><strong>Benefits:</strong> fewer listeners = less memory, works for dynamically added elements, cleaner teardown.</p>`
  },
  {
    id: 20, cat: 'DOM & Events', tags: ['core'],
    q: 'What is the difference between event.stopPropagation() and event.preventDefault()?',
    hint: 'stopPropagation=stop bubbling; preventDefault=cancel browser default action',
    answer: `<ul>
<li><strong>stopPropagation()</strong> — stops event from bubbling to parent elements</li>
<li><strong>preventDefault()</strong> — cancels browser default (link navigation, form submit) but still bubbles</li>
<li><strong>stopImmediatePropagation()</strong> — stops bubbling + prevents other listeners on same element</li>
</ul>
<pre><code>link.addEventListener('click', (e) => {
  e.preventDefault();    // don't navigate
  e.stopPropagation();   // don't bubble up
  doSomething();
});</code></pre>`
  },

  // ─── SCOPE & CONTEXT ──────────────────────────────────────────────────────
  {
    id: 21, cat: 'Core JS', tags: ['core'],
    q: 'What are the different types of scope in JavaScript?',
    hint: 'Global, function (local), and block scope — each has different variable rules',
    answer: `<p>JavaScript has three types of scope:</p>
<ul>
<li><strong>Global scope</strong> — Variables declared outside any function or block. Accessible everywhere. In browsers, becomes a property of <code>window</code>.</li>
<li><strong>Function scope</strong> — Variables declared with <code>var</code> inside a function are only accessible inside that function.</li>
<li><strong>Block scope</strong> — Variables declared with <code>let</code> or <code>const</code> inside <code>{}</code> are scoped to that block.</li>
</ul>
<pre><code>var globalVar = 'everywhere';

function fn() {
  var funcVar = 'function only';
  if (true) {
    let blockVar = 'block only';
    var leaky = 'leaks to fn scope'; // var ignores blocks!
  }
  console.log(leaky);    // ✓ 'leaks to fn scope'
  console.log(blockVar); // ✗ ReferenceError
}

console.log(funcVar); // ✗ ReferenceError</code></pre>
<p><strong>The scope chain:</strong> When a variable isn't found in the current scope, JS looks up to the outer scope — all the way to global. Inner scopes access outer variables; outer scopes cannot access inner.</p>
<div class="tip">💡 Prefer const/let over var — they're block-scoped and avoid the leaky behavior of var.</div>`
  },
  {
    id: 22, cat: 'Core JS', tags: ['mid'],
    q: 'What is lexical scope and how does it affect closures?',
    hint: 'Scope is determined where code is written, not where it is called',
    answer: `<p><strong>Lexical scope</strong> (static scope) means a function's scope is determined by <em>where it is written</em> in the code — at author time — not by where it is called at runtime.</p>
<pre><code>const x = 'global';

function outer() {
  const x = 'outer-fn';
  function inner() {
    console.log(x); // 'outer-fn' — closes over WHERE inner is DEFINED
  }
  return inner;
}

const fn = outer();
fn(); // logs 'outer-fn', NOT 'global'
// Even though fn() is called at global level, it remembers outer-fn's scope</code></pre>
<p>This is what makes closures possible — a function carries its scope from where it was <em>created</em>, not from where it's <em>invoked</em>.</p>
<div class="tip">💡 Contrast with dynamic scope (Bash, Perl): if JS were dynamic, fn() would print 'global' because it's called there. Lexical scope is more predictable and is the reason closures work.</div>`
  },
  {
    id: 23, cat: 'Core JS', tags: ['adv'],
    q: 'What is an Execution Context and what are its two phases?',
    hint: 'Creation phase (hoisting, this binding) then execution phase — pushed onto the call stack',
    answer: `<p>An <strong>Execution Context (EC)</strong> is the environment in which JavaScript code evaluates and executes. Every function call creates a new EC pushed onto the call stack.</p>
<p><strong>Phase 1 — Creation Phase:</strong></p>
<ul>
<li>Scans for <code>var</code> declarations → hoisted and set to <code>undefined</code></li>
<li>Scans for <code>let</code>/<code>const</code> → hoisted but placed in <strong>Temporal Dead Zone</strong></li>
<li>Scans for function declarations → fully hoisted (name + body)</li>
<li>Determines the value of <code>this</code></li>
<li>Sets up the scope chain (reference to outer environment)</li>
</ul>
<p><strong>Phase 2 — Execution Phase:</strong> runs code line by line, assigns actual values.</p>
<pre><code>function example() {
  // Creation phase saw: var a → undefined, fn fully hoisted
  console.log(a);   // undefined (var hoisted)
  console.log(fn()); // 'works!' (function declaration hoisted)
  var a = 1;
  function fn() { return 'works!'; }
  console.log(a);   // 1 (now assigned)
}</code></pre>
<p><strong>Types of EC:</strong> Global EC (one per program), Function EC (one per call), Eval EC (avoid).</p>
<div class="tip">💡 The Global EC creates the global object (window/globalThis) and binds this = global object in its creation phase.</div>`
  },
  {
    id: 24, cat: 'Core JS', tags: ['mid'],
    q: 'What is the Temporal Dead Zone (TDZ)?',
    hint: 'let/const are hoisted but not initialized — accessing them before declaration throws',
    answer: `<p>The <strong>Temporal Dead Zone</strong> is the period between when a <code>let</code>/<code>const</code> variable is hoisted (block start) and when it is initialized (the declaration line). Accessing it in this window throws a <code>ReferenceError</code>.</p>
<pre><code>{
  // ← TDZ for 'a' starts here (block start)
  console.log(a); // ❌ ReferenceError: Cannot access 'a' before initialization
  let a = 5;      // ← TDZ ends, a is initialized to 5
  console.log(a); // 5
}

// typeof does NOT protect you in TDZ
console.log(typeof undeclared); // "undefined" — safe (never declared)
console.log(typeof a);          // ReferenceError if 'a' is in TDZ!</code></pre>
<p><strong>Why TDZ exists:</strong> Intentional design to catch bugs where you accidentally use a variable before its meaningful initialization. <code>var</code> silently returns <code>undefined</code>, masking errors.</p>
<div class="tip">💡 TDZ applies to let, const, and class declarations. Function declarations are fully hoisted with no TDZ.</div>`
  },
  {
    id: 25, cat: 'Core JS', tags: ['mid'],
    q: 'What does "use strict" do and why should you use it?',
    hint: 'Opt-in to stricter parsing — catches silent errors, changes some behaviors',
    answer: `<p><strong>Strict mode</strong> activates a restricted variant of JavaScript that converts silent errors into thrown errors and disables some confusing/dangerous features.</p>
<p><strong>What it prevents:</strong></p>
<ul>
<li>Implicit globals — <code>x = 5</code> throws <code>ReferenceError</code> (not window.x)</li>
<li>Duplicate parameter names — <code>function fn(a, a) {}</code> throws</li>
<li>Writing to read-only properties — throws instead of silently failing</li>
<li><code>this</code> in standalone functions is <code>undefined</code> (not <code>window</code>)</li>
<li><code>delete</code> on variables/functions — throws</li>
<li>Octal literals (<code>0777</code>) — throws</li>
</ul>
<pre><code>'use strict';

x = 5;             // ReferenceError — no more accidental globals
function fn(a, a) {} // SyntaxError

function test() {
  console.log(this); // undefined (not window)
}
test();</code></pre>
<p><strong>Good news:</strong> ES6 modules and classes are <em>always</em> in strict mode automatically. In modern code you rarely need to write <code>'use strict'</code> explicitly.</p>
<div class="tip">💡 Enable strict mode per file or per function with the string 'use strict' at the top. Helps catch bugs early and enables engine optimizations.</div>`
  },
  {
    id: 26, cat: 'Core JS', tags: ['adv'],
    q: 'How does garbage collection work in JavaScript?',
    hint: 'Mark-and-sweep — unreachable objects are collected; common leak sources',
    answer: `<p>JavaScript uses <strong>automatic garbage collection</strong> — memory is freed when objects become unreachable from the "roots" (globals + active call stack).</p>
<p><strong>Mark-and-Sweep algorithm:</strong></p>
<ol>
<li>Start from roots (global scope + call stack)</li>
<li><strong>Mark</strong> every reachable object</li>
<li><strong>Sweep</strong> — free everything NOT marked</li>
</ol>
<pre><code>let user = { name: 'Alice' }; // reachable via 'user'
user = null;                  // reference dropped → unreachable → GC'd

// Circular reference — NOT a problem for modern mark-and-sweep
let a = {}; let b = {};
a.ref = b; b.ref = a; // circular — but if a and b lose all external refs, both are GC'd</code></pre>
<p><strong>Common memory leak sources:</strong></p>
<ul>
<li>Forgotten <code>setInterval</code> holding references to DOM elements</li>
<li>Detached DOM nodes still referenced in JS variables</li>
<li>Event listeners never removed (<code>removeEventListener</code>)</li>
<li>Closures unintentionally capturing large objects</li>
<li>Unbounded caches / global arrays that grow forever</li>
</ul>
<div class="tip">💡 Use WeakMap/WeakRef to associate data with objects without preventing GC. DevTools Memory tab → Heap Snapshot to hunt leaks.</div>`
  },
  {
    id: 27, cat: 'Core JS', tags: ['core'],
    q: 'What is the difference between primitive and reference types?',
    hint: 'Primitives copy by value; objects copy by reference (the memory address)',
    answer: `<p><strong>Primitive types</strong> (string, number, boolean, null, undefined, symbol, bigint) are stored and copied by value.</p>
<p><strong>Reference types</strong> (objects, arrays, functions) are stored as pointers. Variables hold a reference — assigning copies the reference, not the object.</p>
<pre><code>// Primitives — copy by value
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — completely independent

// Objects — copy by reference
let obj1 = { x: 1 };
let obj2 = obj1;    // both point to THE SAME object in memory
obj2.x = 99;
console.log(obj1.x); // 99 — obj1 was mutated!

// Reference equality
console.log([] === []);   // false — different objects
console.log({} === {});   // false — different objects

// Functions receive references
function mutate(arr) { arr.push(1); }
const myArr = [];
mutate(myArr);
console.log(myArr); // [1] — original was mutated</code></pre>
<div class="tip">💡 "Pass by value" in JS — always. But for objects, the VALUE being passed is the reference (memory address). So you can mutate the object, but you can't make the caller's variable point to a new object.</div>`
  },

  // ─── FUNCTIONS ────────────────────────────────────────────────────────────
  {
    id: 28, cat: 'Functions', tags: ['core'],
    q: 'What are Higher-Order Functions (HOF)?',
    hint: 'Functions that take other functions as arguments, or return functions as results',
    answer: `<p>A <strong>Higher-Order Function</strong> is a function that either:</p>
<ul>
<li>Accepts a function as an argument, OR</li>
<li>Returns a function as its result (or both)</li>
</ul>
<pre><code>// Takes a function as argument
[1, 2, 3].map(x => x * 2);        // map is HOF — takes callback
[1, 2, 3].filter(x => x > 1);     // filter is HOF
setTimeout(() => console.log('hi'), 1000); // HOF

// Returns a function
function multiplier(factor) {
  return (n) => n * factor; // returns a new function
}
const double = multiplier(2);
const triple = multiplier(3);
double(5); // 10
triple(5); // 15

// Does both (debounce)
function debounce(fn, delay) {
  let timer;
  return (...args) => {          // returns function
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay); // takes fn
  };
}</code></pre>
<p>HOFs are foundational to functional programming, enabling code reuse, composition, and abstractions without mutation.</p>
<div class="tip">💡 map, filter, reduce, forEach, addEventListener, setTimeout — all HOFs you use every day without realizing it.</div>`
  },
  {
    id: 29, cat: 'Functions', tags: ['mid'],
    q: 'What is an IIFE (Immediately Invoked Function Expression) and when do you use it?',
    hint: 'Defined and called immediately — creates a private scope',
    answer: `<p>An <strong>IIFE</strong> is a function that is both defined and invoked immediately. It creates an isolated scope.</p>
<pre><code>// Classic IIFE syntax
(function() {
  const private = 'inaccessible outside';
  console.log(private);
})();

// Arrow IIFE
(() => {
  // isolated scope
})();

// IIFE with parameters
(function(global) {
  global.myLib = {};
})(window);

// IIFE returning a value
const result = (() => {
  const x = computeExpensiveThing();
  return x * 2;
})();</code></pre>
<p><strong>Use cases:</strong></p>
<ul>
<li>Avoid polluting global scope (classic library pattern)</li>
<li>Create truly private variables (module pattern)</li>
<li>Capture loop variables (pre-<code>let</code> closure fix)</li>
<li>One-time initialization logic</li>
</ul>
<div class="tip">💡 In modern JS, ES modules and block-scoped let/const make IIFEs less necessary. But they're heavily used in legacy code and still valid for specific patterns.</div>`
  },
  {
    id: 30, cat: 'Functions', tags: ['core'],
    q: 'What does it mean that functions are "first-class citizens" in JavaScript?',
    hint: 'Functions are values — assignable, passable, returnable, storable',
    answer: `<p>Functions are <strong>first-class citizens</strong> — they're treated as values just like strings or numbers. This means:</p>
<ul>
<li>Assign to variables</li>
<li>Pass as arguments</li>
<li>Return from functions</li>
<li>Store in arrays/objects</li>
<li>Have properties and methods attached</li>
</ul>
<pre><code>// Assigned to variable
const greet = (name) => 'Hello, ' + name;

// Passed as argument (callback)
[1, 2, 3].forEach(function(n) { console.log(n); });

// Returned from function
function makeAdder(x) {
  return (y) => x + y; // ← function as return value
}
const add5 = makeAdder(5);
add5(3); // 8

// Stored in object
const math = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
};

// Has properties
function fn() {}
fn.version = '1.0';
console.log(fn.name);   // 'fn'
console.log(fn.length); // 0 (param count)</code></pre>
<div class="tip">💡 First-class functions are what enable HOFs, callbacks, closures, and all functional programming patterns in JS.</div>`
  },
  {
    id: 31, cat: 'Functions', tags: ['adv'],
    q: 'What is currying and how do you implement a generic curry function?',
    hint: 'Transform f(a,b,c) into f(a)(b)(c) — each call returns a new function waiting for more args',
    answer: `<p><strong>Currying</strong> transforms a multi-argument function into a chain of unary functions, each waiting for one argument at a time.</p>
<pre><code>// Manual curried function
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6
const add1 = add(1);     // partially applied — waits for b and c
const add1and2 = add1(2); // waits for c
add1and2(3);              // 6

// Generic curry utility
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) { // enough args collected?
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6 — also works (partial application hybrid)</code></pre>
<p><strong>Currying enables:</strong> partial application, point-free style, composable specialized functions.</p>
<div class="tip">💡 Currying vs Partial Application: currying always breaks a function into unary steps. Partial application pre-fills SOME arguments and returns a function waiting for the rest.</div>`
  },
  {
    id: 32, cat: 'Functions', tags: ['adv'],
    q: 'What is memoization and how do you implement it?',
    hint: 'Cache results keyed by arguments — avoid recomputing for the same inputs',
    answer: `<p><strong>Memoization</strong> is an optimization where a function caches its results. Calling with the same inputs returns the cached result instead of recomputing.</p>
<pre><code>function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // cache hit
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Fibonacci without memoization: O(2^n)
// With memoization: O(n)
const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // self-referencing
});

fib(40); // instant — 40 cache entries
fib(40); // instant again — cache hit</code></pre>
<p><strong>When to use:</strong> Pure functions with expensive computation and repeated same-argument calls. React's <code>useMemo</code> and <code>useCallback</code> implement this concept.</p>
<div class="tip">💡 Only memoize PURE functions — same input must always give same output. Don't memoize time-dependent or side-effectful functions.</div>`
  },
  {
    id: 33, cat: 'Functions', tags: ['adv'],
    q: 'What is function composition and how do compose() and pipe() differ?',
    hint: 'Chain functions: output of one becomes input of next — compose=right-to-left, pipe=left-to-right',
    answer: `<p><strong>Function composition</strong> combines multiple functions where the output of one becomes the input of the next, building complex operations from simple pieces.</p>
<pre><code>// compose — right to left (mathematical convention)
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// pipe — left to right (more readable)
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const trim      = str => str.trim();
const lowercase = str => str.toLowerCase();
const addBang   = str => str + '!';

// compose: addBang(lowercase(trim(x)))
const processC = compose(addBang, lowercase, trim);

// pipe: trim → lowercase → addBang
const processP = pipe(trim, lowercase, addBang);

processP('  Hello World  '); // 'hello world!'
processC('  Hello World  '); // 'hello world!'

// Without composition (harder to read as chain grows)
const manual = str => addBang(lowercase(trim(str)));</code></pre>
<div class="tip">💡 compose() mirrors mathematical f∘g notation. pipe() reads like a Unix pipeline — more natural for most developers. Both are equivalent, just different argument order.</div>`
  },
  {
    id: 34, cat: 'Functions', tags: ['mid'],
    q: 'What are rest parameters and how do they differ from the arguments object?',
    hint: 'Rest (...args) is a real Array; arguments is array-like, no arrow support, no Array methods',
    answer: `<p><strong>Rest parameters</strong> (<code>...args</code>) collect remaining function arguments into a real Array.</p>
<pre><code>// Rest parameters — modern
function sum(first, ...rest) {
  console.log(first);   // 1
  console.log(rest);    // [2, 3, 4] — real Array!
  return rest.reduce((a, b) => a + b, first);
}
sum(1, 2, 3, 4); // 10
rest.map(x => x * 2); // ✅ has Array methods

// arguments — legacy
function old() {
  console.log(arguments);        // { 0:1, 1:2, ... } — array-LIKE
  console.log(arguments.map);    // undefined — NOT a real Array
  const arr = Array.from(arguments); // convert needed
}

// Arrow functions have NO arguments object
const arrow = () => {
  console.log(arguments); // ReferenceError!
  // Use rest: (...args) => { console.log(args) }
};</code></pre>
<p><strong>Key differences:</strong></p>
<ul>
<li>Rest is a real Array → has all array methods</li>
<li>arguments is array-like → no map/filter/etc</li>
<li>Arrow functions don't have arguments</li>
<li>Rest collects only the <em>remaining</em> args after named params</li>
</ul>
<div class="tip">💡 Always use rest parameters in modern code. arguments is legacy and has quirks that trip people up.</div>`
  },
  {
    id: 35, cat: 'Functions', tags: ['mid'],
    q: 'What is recursion and what causes a stack overflow?',
    hint: 'Function calling itself — needs a base case; too many calls = call stack exhausted',
    answer: `<p><strong>Recursion</strong> is when a function calls itself. Every recursive function needs:</p>
<ol>
<li>A <strong>base case</strong> — a stopping condition</li>
<li>A <strong>recursive case</strong> — that moves toward the base case</li>
</ol>
<pre><code>// Factorial
function factorial(n) {
  if (n <= 1) return 1;         // base case
  return n * factorial(n - 1); // recursive case
}
factorial(5); // 120

// Flatten nested array
function flatten(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item)
      ? acc.concat(flatten(item)) // recurse
      : acc.concat(item),
  []);
}
flatten([1, [2, [3]]]); // [1, 2, 3]</code></pre>
<p><strong>Stack overflow:</strong> Each recursive call adds a stack frame. Without a base case (or with very deep recursion), the call stack fills up:</p>
<pre><code>function infinite(n) {
  return infinite(n + 1); // no base case!
}
infinite(1); // RangeError: Maximum call stack size exceeded</code></pre>
<div class="tip">💡 Tail Call Optimization (TCO) can theoretically prevent stack overflow for tail-recursive calls, but TCO is only reliably supported in Safari. For deep recursion, use iteration or trampolining.</div>`
  },
  {
    id: 36, cat: 'Functions', tags: ['adv'],
    q: 'What is a Named Function Expression (NFE)?',
    hint: 'A function expression with an internal name — visible inside the body only',
    answer: `<p>A <strong>Named Function Expression</strong> has a name after <code>function</code>, but unlike a declaration, the name is only visible inside the function body — not outside.</p>
<pre><code>// Anonymous function expression — self-reference is fragile
const factorial = function(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // relies on outer var 'factorial'
};
// If factorial is reassigned, self-reference breaks!

// Named function expression — safe self-reference
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // 'fact' is always THIS function
};

console.log(factorial.name); // 'fact'
console.log(typeof fact);    // 'undefined' — not accessible outside!

// If outer var is reassigned, NFE still works
const f = factorial;
factorial = null;
f(5); // 120 — 'fact' still refers to itself correctly</code></pre>
<div class="tip">💡 Use NFEs for recursive function expressions. Better stack traces (shows 'fact' not 'anonymous') and reliable self-reference even if the outer variable changes.</div>`
  },

  // ─── OBJECTS & PROTOTYPES ─────────────────────────────────────────────────
  {
    id: 37, cat: 'Objects', tags: ['adv'],
    q: 'What are property descriptors and property flags (writable, enumerable, configurable)?',
    hint: 'Every property has a descriptor controlling whether it can be changed, seen, or deleted',
    answer: `<p>Every object property has a <strong>descriptor</strong> with 3 flags:</p>
<ul>
<li><strong>writable</strong> — can the value be changed?</li>
<li><strong>enumerable</strong> — does it show up in <code>for...in</code> / <code>Object.keys()</code>?</li>
<li><strong>configurable</strong> — can the descriptor be changed? Can the property be deleted?</li>
</ul>
<pre><code>const obj = {};

Object.defineProperty(obj, 'ID', {
  value: 42,
  writable: false,    // read-only
  enumerable: false,  // hidden from loops
  configurable: false // can't redefine or delete
});

obj.ID = 99;              // silently fails (TypeError in strict)
console.log(obj.ID);      // 42

Object.keys(obj);         // [] — ID is non-enumerable
delete obj.ID;            // false — non-configurable

// View a property's descriptor
Object.getOwnPropertyDescriptor(obj, 'ID');
// { value: 42, writable: false, enumerable: false, configurable: false }

// Regular property defaults:
// { value: ..., writable: true, enumerable: true, configurable: true }</code></pre>
<div class="tip">💡 Object.freeze() sets writable + configurable to false for all props. Object.seal() sets configurable to false but keeps writable. Both use property descriptors under the hood.</div>`
  },
  {
    id: 38, cat: 'Objects', tags: ['mid'],
    q: 'What are getters and setters in JavaScript?',
    hint: 'Accessor properties — run a function on read (get) or write (set)',
    answer: `<p><strong>Getters</strong> and <strong>setters</strong> are special methods that execute code when a property is read or written — they look like properties but behave like functions.</p>
<pre><code>const user = {
  firstName: 'John',
  lastName: 'Doe',

  get fullName() {
    return \`\${this.firstName} \${this.lastName}\`; // computed on read
  },

  set fullName(val) {
    [this.firstName, this.lastName] = val.split(' '); // validated on write
  }
};

console.log(user.fullName); // 'John Doe' — runs getter
user.fullName = 'Jane Smith'; // runs setter
console.log(user.firstName); // 'Jane'

// In a class
class Temperature {
  constructor(celsius) { this._c = celsius; }

  get fahrenheit() { return this._c * 9/5 + 32; }
  set fahrenheit(f) { this._c = (f - 32) * 5/9; }
}

const t = new Temperature(0);
console.log(t.fahrenheit); // 32
t.fahrenheit = 212;
console.log(t._c);         // 100</code></pre>
<div class="tip">💡 Use getters for derived/computed values. Use setters for validation. Avoid getter/setter pairs that call each other — infinite loops!</div>`
  },
  {
    id: 39, cat: 'Objects', tags: ['mid'],
    q: 'What is the difference between Object.freeze() and Object.seal()?',
    hint: 'freeze = truly immutable; seal = no add/delete but values can change',
    answer: `<p>Both prevent structural changes but differ in degree:</p>
<ul>
<li><strong>Object.freeze()</strong> — no add, no delete, no value change. Completely locked.</li>
<li><strong>Object.seal()</strong> — no add, no delete, but existing values CAN be changed.</li>
</ul>
<pre><code>// freeze
const config = Object.freeze({ host: 'localhost', port: 3000 });
config.port = 9999;     // silently fails (TypeError in strict)
config.debug = true;    // silently fails
delete config.host;     // false
console.log(config.port); // 3000 — unchanged

// seal
const sealed = Object.seal({ x: 1, y: 2 });
sealed.x = 99;          // ✅ allowed — value change is OK
sealed.z = 3;           // ❌ silently fails — no new props
delete sealed.x;        // ❌ fails — no delete

// Critical gotcha: BOTH are SHALLOW
const frozen = Object.freeze({ nested: { a: 1 } });
frozen.nested.a = 99;   // ⚠️ WORKS — nested object is not frozen!

// Deep freeze (recursive)
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    if (typeof obj[name] === 'object' && obj[name] !== null) {
      deepFreeze(obj[name]);
    }
  });
  return Object.freeze(obj);
}</code></pre>
<div class="tip">💡 Use freeze() for config constants and action type objects in Redux. Remember it's shallow — deep freeze recursively if needed.</div>`
  },
  {
    id: 40, cat: 'Objects', tags: ['mid'],
    q: 'What are the different ways to enumerate object properties?',
    hint: 'for...in, Object.keys, Object.values, Object.entries — differ in own vs inherited, enumerable vs all',
    answer: `<p>Each enumeration method has different behavior around own properties, inherited properties, and enumerability:</p>
<pre><code>const parent = { inherited: true };
const obj = Object.create(parent); // obj's prototype is parent
obj.a = 1;
obj.b = 2;
Object.defineProperty(obj, 'hidden', { value: 3, enumerable: false });

// for...in — own + inherited, enumerable only
for (const k in obj) console.log(k); // 'a', 'b', 'inherited'

// Object.keys — own properties, enumerable only ← most common
Object.keys(obj);    // ['a', 'b']

// Object.values — own, enumerable, values
Object.values(obj);  // [1, 2]

// Object.entries — own, enumerable, [key, value] pairs
Object.entries(obj); // [['a', 1], ['b', 2]]

// Object.getOwnPropertyNames — own, ALL (including non-enumerable)
Object.getOwnPropertyNames(obj); // ['a', 'b', 'hidden']

// Check if own property
obj.hasOwnProperty('a');         // true
obj.hasOwnProperty('inherited'); // false
Object.hasOwn(obj, 'a');         // ES2022 — preferred over hasOwnProperty</code></pre>
<div class="tip">💡 Use Object.keys/values/entries in modern code — they only return own enumerable properties. Use for...in only if you explicitly need inherited properties (rare).</div>`
  },
  {
    id: 41, cat: 'Objects', tags: ['adv'],
    q: 'How does instanceof work and what are its limitations?',
    hint: 'Walks the prototype chain looking for constructor.prototype — can be fooled',
    answer: `<p><code>instanceof</code> checks if a constructor's <code>prototype</code> appears anywhere in an object's prototype chain.</p>
<pre><code>class Animal {}
class Dog extends Animal {}

const dog = new Dog();
dog instanceof Dog;    // true — Dog.prototype in chain
dog instanceof Animal; // true — Animal.prototype in chain too
dog instanceof Object; // true — everything inherits from Object

// How it works internally:
// dog.__proto__ === Dog.prototype ✓ → true

// Limitation 1: Can be fooled by setPrototypeOf
const fake = Object.create(Dog.prototype);
fake instanceof Dog; // true — but Dog() was never called!

// Limitation 2: Cross-realm failure
// Arrays from iframes: arr instanceof Array → false!
// Use Array.isArray() — realm-safe

// Limitation 3: Primitives always fail
'hello' instanceof String;     // false (primitive, not object)
new String('hello') instanceof String; // true (wrapped object)

// Better type checking alternatives:
Array.isArray([]);                          // ✅ realm-safe
typeof 'hello';                             // 'string'
Object.prototype.toString.call([]);         // '[object Array]'</code></pre>
<div class="tip">💡 instanceof tests the prototype chain, not the constructor. For safe type checks use Array.isArray(), typeof, or Object.prototype.toString.call().</div>`
  },
  {
    id: 42, cat: 'Objects', tags: ['adv'],
    q: 'What are mixins in JavaScript and why are they used?',
    hint: 'Copy methods from multiple sources into a class — avoids single-inheritance limits',
    answer: `<p>A <strong>mixin</strong> is a pattern to copy methods from one object into another class or prototype, enabling code reuse without inheritance chains.</p>
<pre><code>// Mixin objects (plain objects with methods)
const Serializable = {
  serialize() { return JSON.stringify(this); },
};

const Validatable = {
  validate() {
    return Object.values(this).every(v => v !== null && v !== undefined);
  }
};

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Apply mixins — copy methods onto the class prototype
Object.assign(User.prototype, Serializable, Validatable);

const u = new User('Alice', 'a@b.com');
u.serialize(); // '{"name":"Alice","email":"a@b.com"}'
u.validate();  // true

// More modern approach: mixin factory functions
const withLogging = (Base) => class extends Base {
  log(msg) { console.log(\`[\${this.constructor.name}] \${msg}\`); }
};

class LoggableUser extends withLogging(User) {}</code></pre>
<p>Mixins solve the diamond problem of multiple inheritance — compose behavior from multiple independent sources.</p>
<div class="tip">💡 React class component mixins were deprecated in favour of Hooks. Hooks are the modern mixin equivalent — reusable stateful logic without inheritance.</div>`
  },

  // ─── ARRAYS ───────────────────────────────────────────────────────────────
  {
    id: 43, cat: 'Arrays', tags: ['core'],
    q: 'How do Array.find(), findIndex(), some(), and every() work?',
    hint: 'find=first match value, findIndex=first match index, some=any passes, every=all pass',
    answer: `<ul>
<li><strong>find()</strong> — returns the first element where callback returns true, or <code>undefined</code></li>
<li><strong>findIndex()</strong> — returns the index of first match, or <code>-1</code></li>
<li><strong>some()</strong> — returns <code>true</code> if at least one element passes (short-circuits)</li>
<li><strong>every()</strong> — returns <code>true</code> only if ALL elements pass (short-circuits)</li>
</ul>
<pre><code>const users = [
  { id: 1, name: 'Alice', active: true  },
  { id: 2, name: 'Bob',   active: false },
  { id: 3, name: 'Carol', active: true  },
];

users.find(u => u.id === 2);       // { id: 2, name: 'Bob', active: false }
users.findIndex(u => u.id === 2);  // 1
users.find(u => u.id === 99);      // undefined (not found)

users.some(u => u.active);  // true  (stops at Alice)
users.every(u => u.active); // false (stops at Bob)

// Short-circuit saves work
users.some(u => {
  console.log('checking', u.name);
  return u.name === 'Alice'; // only checks Alice — stops immediately
});</code></pre>
<div class="tip">💡 some() is like logical OR across the array; every() is like AND. Use find() when you need the value, findIndex() when you need the position.</div>`
  },
  {
    id: 44, cat: 'Arrays', tags: ['mid'],
    q: 'How do Array.flat() and Array.flatMap() work?',
    hint: 'flat() flattens nested arrays; flatMap() maps then flattens one level — more efficient',
    answer: `<pre><code>const nested = [1, [2, [3, [4]]]];

nested.flat();         // [1, 2, [3, [4]]] — default depth 1
nested.flat(2);        // [1, 2, 3, [4]]
nested.flat(Infinity); // [1, 2, 3, 4] — fully flat

// flatMap = map + flat(1) — more efficient than separate calls
const sentences = ['Hello World', 'Foo Bar'];
sentences.flatMap(s => s.split(' ')); // ['Hello', 'World', 'Foo', 'Bar']

// vs two-step (less efficient)
sentences.map(s => s.split(' ')).flat(); // same result

// flatMap can filter + transform in one pass
const nums = [1, 2, 3, 4, 5];
nums.flatMap(n => n % 2 === 0 ? [n, n * 10] : []);
// [2, 20, 4, 40] — odds removed, evens doubled
// Return [] to skip, [val] to keep, [a, b] to expand one item into two</code></pre>
<div class="tip">💡 flatMap is more efficient than map+flat because it only iterates once. Use it as a combined filter+map by returning [] to skip items.</div>`
  },
  {
    id: 45, cat: 'Arrays', tags: ['mid'],
    q: 'What are immutable array operations and the new ES2023 methods?',
    hint: 'toSorted, toReversed, toSpliced, with — immutable versions of mutating methods',
    answer: `<p>Many array methods mutate the original. Always be aware of which do and which don't:</p>
<p><strong>Mutating (change original):</strong> sort, reverse, splice, push, pop, shift, unshift, fill</p>
<p><strong>Non-mutating (return new):</strong> map, filter, slice, concat, flat, flatMap, reduce</p>
<pre><code>const arr = [3, 1, 2];

// Old pattern — copy first to avoid mutation
const sorted = [...arr].sort((a, b) => a - b); // arr unchanged

// ES2023 — built-in immutable versions
arr.toSorted((a, b) => a - b);  // [1, 2, 3] — arr still [3, 1, 2]
arr.toReversed();               // [2, 1, 3] — arr still [3, 1, 2]
arr.toSpliced(1, 1, 9);         // [3, 9, 2] — arr still [3, 1, 2]
arr.with(1, 99);                // [3, 99, 2] — replace index 1

// All 4 return NEW arrays without touching the original
console.log(arr); // [3, 1, 2] ✓</code></pre>
<div class="tip">💡 Immutable operations are essential in React/Redux where you must not mutate state. Prefer [...arr].sort() or arr.toSorted() over arr.sort().</div>`
  },

  // ─── ASYNC ────────────────────────────────────────────────────────────────
  {
    id: 46, cat: 'Async JS', tags: ['mid'],
    q: 'What are Promise combinators and when do you use each?',
    hint: 'all=all resolve, allSettled=wait all, race=first settles, any=first resolves',
    answer: `<ul>
<li><strong>Promise.all()</strong> — waits for ALL to resolve. Rejects immediately if ANY rejects. Use when all must succeed.</li>
<li><strong>Promise.allSettled()</strong> — waits for ALL to settle (resolve OR reject). Never rejects itself. Use when you need all results regardless of failure.</li>
<li><strong>Promise.race()</strong> — settles with the FIRST settled promise (resolve or reject). Use for timeout patterns.</li>
<li><strong>Promise.any()</strong> — resolves with the FIRST resolved promise. Rejects only if ALL reject. Use for fallback/redundancy.</li>
</ul>
<pre><code>const fast = fetch('/fast');   // 100ms
const slow = fetch('/slow');   // 500ms
const bad  = fetch('/broken'); // 200ms, rejects

await Promise.all([fast, slow]);    // ✅ 500ms (waits for both)
await Promise.all([fast, bad]);     // ❌ rejects at 200ms

const results = await Promise.allSettled([fast, slow, bad]);
// [{status:'fulfilled', value:...}, ..., {status:'rejected', reason:...}]

await Promise.race([fast, slow]);   // resolves at 100ms with fast result

await Promise.any([bad, fast]);     // resolves at 100ms (ignores bad)

// Timeout pattern with race:
const withTimeout = (p, ms) => Promise.race([
  p,
  new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), ms))
]);</code></pre>
<div class="tip">💡 allSettled is your safety net — it always resolves, making it great for "fire multiple requests, report all results" patterns.</div>`
  },
  {
    id: 47, cat: 'Async JS', tags: ['mid'],
    q: 'What is queueMicrotask() and when should you use it?',
    hint: 'Schedule a function in the microtask queue — runs after current sync, before next macrotask',
    answer: `<p><code>queueMicrotask(fn)</code> adds a callback directly to the microtask queue — the same queue that Promise callbacks use.</p>
<pre><code>// Functionally equivalent:
Promise.resolve().then(() => console.log('A'));
queueMicrotask(() => console.log('B'));
// A, B — FIFO within the microtask queue

console.log('sync');
queueMicrotask(() => console.log('microtask'));
setTimeout(() => console.log('macrotask'), 0);
console.log('sync end');
// Order: sync → sync end → microtask → macrotask</code></pre>
<p><strong>Advantages over Promise.resolve().then():</strong></p>
<ul>
<li>No Promise overhead — slightly more performant</li>
<li>More explicit — clearly states "schedule as microtask"</li>
<li>Doesn't create a Promise chain</li>
</ul>
<pre><code>// Real use case: batch state updates
let pending = false;
function scheduleRender() {
  if (pending) return;
  pending = true;
  queueMicrotask(() => {
    pending = false;
    renderDOM(); // runs once after all sync mutations
  });
}</code></pre>
<div class="tip">💡 Use queueMicrotask when you want something to run "ASAP but async" — after current sync code finishes, before any I/O or timers fire.</div>`
  },
  {
    id: 48, cat: 'Async JS', tags: ['mid'],
    q: 'How do you handle unhandled Promise rejections?',
    hint: 'They crash Node.js 15+ — always attach .catch() or try/catch; use global handlers as last resort',
    answer: `<p>An <strong>unhandled rejection</strong> occurs when a Promise rejects with no <code>.catch()</code> or <code>try/catch</code> handler.</p>
<pre><code>// ❌ Unhandled
const p = Promise.reject(new Error('oops'));
// Browser: warning in console; Node.js 15+: crashes process

// ✅ Always handle
async function fetchData() {
  try {
    return await fetch('/api');
  } catch (err) {
    if (err.status === 404) return null; // handle known
    throw err;                           // re-throw unknown
  }
}

// ✅ At call site
fetchData().catch(err => console.error(err));

// Global handlers (last resort / monitoring)
// Browser
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled:', event.reason);
  event.preventDefault(); // suppress browser logging
});

// Node.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1); // recommended in production
});</code></pre>
<div class="tip">💡 Never rely on global handlers for correctness — they're for logging/monitoring. Fix the root cause by ensuring every async operation is wrapped in try/catch or has .catch().</div>`
  },

  // ─── DOM & EVENTS ─────────────────────────────────────────────────────────
  {
    id: 49, cat: 'DOM & Events', tags: ['mid'],
    q: 'What is the difference between event bubbling and event capturing?',
    hint: '3 phases: capture (down), target, bubble (up) — addEventListener default is bubble',
    answer: `<p>When an event fires, it passes through 3 phases in the DOM tree:</p>
<ol>
<li><strong>Capture phase</strong> — event travels DOWN: window → document → ... → target</li>
<li><strong>Target phase</strong> — event is at the element that was clicked/triggered</li>
<li><strong>Bubble phase</strong> — event travels UP: target → ... → document → window</li>
</ol>
<pre><code>// Capture phase listener (3rd arg = true, or { capture: true })
document.body.addEventListener('click', () => console.log('body capture'), true);

// Bubble phase listener (default)
document.body.addEventListener('click', () => console.log('body bubble'));
button.addEventListener('click', () => console.log('button'));

// Click the button:
// body capture (capturing, going down)
// button       (at target)
// body bubble  (bubbling, going up)

// Stop bubbling
button.addEventListener('click', (e) => {
  e.stopPropagation(); // stops bubble — body bubble won't fire
  // e.stopImmediatePropagation() — also blocks same-element listeners
});</code></pre>
<p><strong>Events that don't bubble:</strong> focus, blur, scroll, mouseenter, mouseleave — use focusin/focusout for delegation instead.</p>
<div class="tip">💡 Event delegation relies on bubbling — one listener on the parent handles events from all children. This is more efficient than attaching listeners to each child.</div>`
  },
  {
    id: 50, cat: 'DOM & Events', tags: ['mid'],
    q: 'How do you create and dispatch Custom Events?',
    hint: 'new CustomEvent(name, { detail, bubbles }) — dispatch with element.dispatchEvent()',
    answer: `<p>Custom Events let you create your own event types for loosely-coupled component communication.</p>
<pre><code>// Create
const loginEvent = new CustomEvent('user:login', {
  detail: { userId: 42, name: 'Alice' }, // payload — any data
  bubbles: true,     // will bubble up the DOM
  cancelable: true   // can be preventDefault'd
});

// Dispatch
document.dispatchEvent(loginEvent);
// or: specificElement.dispatchEvent(loginEvent);

// Listen
document.addEventListener('user:login', (e) => {
  console.log(e.detail.name); // 'Alice'
  console.log(e.type);        // 'user:login'
});

// Real-world: decoupled component communication
class Cart {
  addItem(item) {
    this.items.push(item);
    window.dispatchEvent(new CustomEvent('cart:updated', {
      detail: { items: this.items, count: this.items.length }
    }));
  }
}

// Navbar listens independently
window.addEventListener('cart:updated', ({ detail }) => {
  cartBadge.textContent = detail.count;
});</code></pre>
<div class="tip">💡 Namespace your events with colons (user:login, cart:updated) to avoid collisions with native events. This is a lightweight pub/sub without a library.</div>`
  },
  {
    id: 51, cat: 'DOM & Events', tags: ['adv'],
    q: 'What is MutationObserver and when do you use it?',
    hint: 'Watch for DOM changes asynchronously — replaces deprecated Mutation Events',
    answer: `<p><strong>MutationObserver</strong> watches for changes to the DOM tree and fires a callback when changes occur — batched and asynchronous.</p>
<pre><code>const observer = new MutationObserver((mutations, obs) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      console.log('Added:', mutation.addedNodes);
      console.log('Removed:', mutation.removedNodes);
    }
    if (mutation.type === 'attributes') {
      console.log('Attr changed:', mutation.attributeName, 'on', mutation.target);
    }
    if (mutation.type === 'characterData') {
      console.log('Text changed');
    }
  });
});

observer.observe(document.getElementById('app'), {
  childList: true,     // watch add/remove of child nodes
  attributes: true,    // watch attribute changes
  characterData: true, // watch text content changes
  subtree: true,       // observe all descendants too
});

observer.disconnect(); // stop observing</code></pre>
<p><strong>Use cases:</strong> Lazy loading, detecting when third-party code modifies the DOM, building virtual DOM diffing, accessibility announcements.</p>
<div class="tip">💡 MutationObserver replaced deprecated synchronous Mutation Events (DOMNodeInserted etc.) which were slow and could cause infinite loops. MutationObserver batches changes for performance.</div>`
  },
  {
    id: 52, cat: 'DOM & Events', tags: ['adv'],
    q: 'What is IntersectionObserver and how do you use it for lazy loading?',
    hint: 'Detect when elements enter the viewport — no scroll listener, no layout thrashing',
    answer: `<pre><code>// Lazy loading images
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // load real image
      obs.unobserve(img);        // stop watching this one
    }
  });
}, {
  root: null,          // null = viewport
  rootMargin: '200px', // trigger 200px BEFORE element is visible
  threshold: 0.1       // fire when 10% of element is visible
});

// Watch all lazy images
document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});

// Infinite scroll
const sentinel = document.querySelector('.load-more');
new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) loadNextPage();
}).observe(sentinel);

// entry properties:
// entry.isIntersecting — true/false
// entry.intersectionRatio — 0 to 1
// entry.boundingClientRect — element position
// entry.target — the observed element</code></pre>
<div class="tip">💡 IntersectionObserver is async and non-blocking — no layout thrashing from getBoundingClientRect() in scroll handlers. Far more performant than scroll events.</div>`
  },

  // ─── PERFORMANCE ──────────────────────────────────────────────────────────
  {
    id: 53, cat: 'Performance', tags: ['mid'],
    q: 'What causes memory leaks in JavaScript and how do you detect them?',
    hint: 'Unintentional references prevent GC: forgotten timers, closures, detached DOM nodes',
    answer: `<p>Memory leaks occur when objects are no longer needed but are still referenced, preventing garbage collection.</p>
<p><strong>Common causes:</strong></p>
<pre><code>// 1. Forgotten intervals
const el = document.getElementById('status');
const id = setInterval(() => { el.innerHTML = Date.now(); }, 1000);
// If el is removed from DOM but interval isn't cleared → leak
// Fix: clearInterval(id) when done

// 2. Detached DOM nodes
let detached;
function create() {
  detached = document.createElement('div'); // global reference
  document.body.appendChild(detached);
  document.body.removeChild(detached); // removed from DOM...
  // but 'detached' variable still holds it → leak
}

// 3. Closures capturing large objects
function leaky() {
  const bigData = new Array(1_000_000).fill('*');
  return () => bigData[0]; // ALL of bigData kept alive!
}

// 4. Event listeners not removed
window.addEventListener('resize', heavyHandler);
// Fix: window.removeEventListener('resize', heavyHandler) on cleanup

// 5. Growing caches without eviction
const cache = {};
function store(key, val) { cache[key] = val; } // never cleared!</code></pre>
<p><strong>Detection:</strong> Chrome DevTools → Memory → Heap Snapshot → look for "Detached" DOM nodes, or compare snapshots over time for growing retained size.</p>
<div class="tip">💡 Use WeakMap for object-keyed caches — entries are automatically released when the key object is GC'd. Perfect for per-element data storage.</div>`
  },
  {
    id: 54, cat: 'Performance', tags: ['mid'],
    q: 'What is the difference between reflow and repaint, and how do you avoid layout thrashing?',
    hint: 'Reflow=recalculate layout (expensive cascade); repaint=visual update only; batch DOM reads/writes',
    answer: `<p><strong>Repaint</strong> — visual property change (color, background, visibility) without affecting layout. Less expensive.</p>
<p><strong>Reflow (Layout)</strong> — geometry change (width, height, position, padding, margin). Expensive: cascades through the document.</p>
<pre><code>// Layout thrashing — alternating reads and writes force reflow each iteration
for (let i = 0; i < 100; i++) {
  const h = el.offsetHeight;       // READ — forces layout (reflow)
  el.style.height = h + 1 + 'px'; // WRITE — invalidates layout
}
// Browser must reflow 100 times! ❌

// Fix: batch all reads, then all writes
const h = el.offsetHeight; // single read
for (let i = 0; i < 100; i++) {
  el.style.height = (h + i) + 'px'; // writes only
}

// Best fix: CSS transforms — composited on GPU, NO reflow
el.style.transform = 'translateY(10px)'; // skip layout entirely!

// Properties that DON'T trigger reflow (GPU composited):
// transform, opacity, filter, will-change</code></pre>
<p><strong>What triggers reflow:</strong> offsetWidth/Height, getBoundingClientRect(), scrollTop, getComputedStyle(), adding/removing DOM nodes, font changes.</p>
<div class="tip">💡 Use requestAnimationFrame to batch DOM reads and writes in the correct phase. Libraries like FastDOM enforce this pattern.</div>`
  },

  // ─── MODERN JS ────────────────────────────────────────────────────────────
  {
    id: 55, cat: 'Modern JS', tags: ['core'],
    q: 'What are tagged template literals and what are they used for?',
    hint: 'A function that processes the template — receives string parts and interpolated values separately',
    answer: `<p>A <strong>tagged template</strong> is a function placed before a template literal — it receives the string parts and interpolated values separately, allowing custom processing.</p>
<pre><code>function highlight(strings, ...values) {
  // strings: ['User ', ' scored ', '%']
  // values:  ['Alice', 95]
  return strings.reduce((result, str, i) =>
    result + str + (values[i] !== undefined
      ? \`<mark>\${values[i]}</mark>\`
      : ''), '');
}

const user = 'Alice', score = 95;
highlight\`User \${user} scored \${score}%\`;
// 'User <mark>Alice</mark> scored <mark>95</mark>%'

// Real-world uses:
// 1. styled-components
const Button = styled.div\`
  background: \${props => props.primary ? 'blue' : 'white'};
\`;

// 2. SQL sanitization (prevents injection!)
const result = sql\`SELECT * FROM users WHERE id = \${userId}\`;
// tag function escapes userId before inserting

// 3. GraphQL queries
const query = gql\`
  query GetUser { user(id: \${id}) { name } }
\`;</code></pre>
<div class="tip">💡 Tagged templates are how styled-components and sql template libraries work. The tag function is called before string interpolation, enabling sanitization and custom processing.</div>`
  },
  {
    id: 56, cat: 'Modern JS', tags: ['core'],
    q: 'Explain destructuring for objects and arrays — including defaults, renaming, rest, and nesting.',
    hint: 'Extract values into variables with concise syntax — works in params, assignments, loops',
    answer: `<pre><code>// ── Array destructuring (position-based) ─────
const [a, b, c] = [1, 2, 3];
const [first, , third] = [1, 2, 3];    // skip index 1
const [x, ...rest] = [1, 2, 3, 4];     // x=1, rest=[2,3,4]
const [p = 10, q = 20] = [1];          // p=1, q=20 (default)

// ── Object destructuring (name-based) ────────
const { name, age } = { name: 'Alice', age: 25 };
const { name: userName } = { name: 'Alice' };  // rename to userName
const { city = 'NYC' } = {};                    // default if undefined

// ── Nested ────────────────────────────────────
const { address: { city: town } } = { address: { city: 'Paris' } };
// town = 'Paris'

// ── In function parameters ────────────────────
function greet({ name, age = 18, role = 'user' }) {
  return \`\${name} (age:\${age}, \${role})\`;
}

// ── Swap variables ────────────────────────────
let m = 1, n = 2;
[m, n] = [n, m]; // m=2, n=1

// ── In loops ─────────────────────────────────
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}</code></pre>
<div class="tip">💡 Destructuring doesn't mutate the original — it creates new bindings. Combine default params + destructuring for clean, self-documenting function signatures.</div>`
  },
  {
    id: 57, cat: 'Modern JS', tags: ['mid'],
    q: 'What are Symbols and what are their main use cases?',
    hint: 'Unique, non-string property keys — used for collision-free metadata and well-known protocols',
    answer: `<p>A <strong>Symbol</strong> is a primitive that is guaranteed globally unique. Used mainly as object property keys to avoid name collisions.</p>
<pre><code>const id = Symbol('id');
const id2 = Symbol('id');
id === id2; // false — always unique even with same description

const user = {};
user[id] = 42; // Symbol as property key

// Symbols are invisible to normal enumeration
Object.keys(user);                          // []
JSON.stringify(user);                       // '{}' — symbols excluded
Object.getOwnPropertySymbols(user);         // [Symbol(id)] — explicit access

// Well-known Symbols — customize built-in behavior
class MyIterable {
  [Symbol.iterator]() {      // makes instances work in for...of
    let n = 0;
    return { next: () => n < 3
      ? { value: n++, done: false }
      : { done: true } };
  }
}

for (const v of new MyIterable()) console.log(v); // 0, 1, 2

// Other well-known Symbols:
// Symbol.toPrimitive — control type coercion
// Symbol.hasInstance — customize instanceof
// Symbol.toStringTag — customize Object.prototype.toString output</code></pre>
<div class="tip">💡 Use Symbols as property keys when extending objects you don't own — impossible to accidentally collide with existing or future string keys.</div>`
  },
  {
    id: 58, cat: 'Modern JS', tags: ['mid'],
    q: 'What are Map and Set and how do they compare to objects and arrays?',
    hint: 'Map=ordered key-value with any key type; Set=unique-value collection; both iterable',
    answer: `<p><strong>Map</strong> vs plain object: keys can be any type, maintains insertion order, has .size, is directly iterable, better performance for frequent add/delete.</p>
<p><strong>Set</strong> vs array: values must be unique, has O(1) lookup with .has(), no index access.</p>
<pre><code>// Map
const map = new Map();
map.set('string', 1);
map.set(42, 'number key');     // any type as key!
map.set({}, 'object key');
map.get('string');  // 1
map.has(42);        // true
map.size;           // 3
map.delete(42);

// Iterate
for (const [k, v] of map) console.log(k, v);
[...map.keys()]; [...map.values()]; [...map.entries()];

// Convert to/from object
const obj = Object.fromEntries(map);
new Map(Object.entries(obj));

// Set
const set = new Set([1, 2, 2, 3, 3]); // {1, 2, 3} — duplicates removed
set.add(4);
set.has(2);   // true — O(1)
set.size;     // 4

// Remove duplicates from array (classic use)
const unique = [...new Set([1,2,2,3,3,3])]; // [1, 2, 3]

// Set operations
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const union        = new Set([...a, ...b]);      // {1,2,3,4}
const intersection = new Set([...a].filter(x => b.has(x))); // {2,3}</code></pre>
<div class="tip">💡 Use Map over objects when keys are non-strings, when insertion order matters, or when keys are frequently added/removed. Use Set for unique-value tracking.</div>`
  },
  {
    id: 59, cat: 'Modern JS', tags: ['adv'],
    q: 'What are WeakMap and WeakSet and when do you use them?',
    hint: 'Keys are weakly held — objects can be GC\'d; no iteration, no size — use for private metadata',
    answer: `<p>WeakMap/WeakSet hold <strong>weak references</strong> to their keys/entries. The garbage collector can collect the referenced object — the entry is automatically removed. Keys must be objects.</p>
<pre><code>// WeakMap — per-object cache that doesn't prevent GC
const cache = new WeakMap();

function process(user) {
  if (cache.has(user)) return cache.get(user); // cache hit
  const result = expensiveCompute(user);
  cache.set(user, result);
  return result;
}
// When user object is GC'd → cache entry vanishes automatically
// No manual cleanup needed!

// WeakSet — track objects without preventing GC
const processing = new WeakSet();
async function handleOnce(obj) {
  if (processing.has(obj)) return; // already running
  processing.add(obj);
  await doWork(obj);
  processing.delete(obj);
}

// WeakMap for private class fields (pre-#private syntax)
const _private = new WeakMap();
class Secure {
  constructor() { _private.set(this, { secret: 42 }); }
  getSecret() { return _private.get(this).secret; }
}</code></pre>
<p><strong>Key limitation:</strong> No .size, no iteration, no .keys()/.values(). You can't see what's in them — only access by key.</p>
<div class="tip">💡 WeakMap is perfect for: memoization caches keyed by object identity, private object metadata, DOM element data. The key insight: it doesn't extend the lifetime of the key object.</div>`
  },
  {
    id: 60, cat: 'Modern JS', tags: ['adv'],
    q: 'What is Proxy and how does it enable metaprogramming?',
    hint: 'Intercept fundamental object operations (get, set, has, deleteProperty) with handler traps',
    answer: `<p>A <strong>Proxy</strong> wraps an object and intercepts fundamental operations using "trap" handler methods.</p>
<pre><code>const handler = {
  get(target, prop, receiver) {
    console.log(\`Getting: \${prop}\`);
    return Reflect.get(target, prop, receiver); // ← always use Reflect
  },
  set(target, prop, value, receiver) {
    if (typeof value !== 'number') throw new TypeError('Numbers only');
    return Reflect.set(target, prop, value, receiver);
  },
  has(target, prop) {
    return prop in target; // intercepts 'in' operator
  },
  deleteProperty(target, prop) {
    if (prop.startsWith('_')) throw new Error('Cannot delete private');
    return Reflect.deleteProperty(target, prop);
  }
};

const obj = new Proxy({}, handler);
obj.x = 42;
obj.x;         // logs "Getting: x" → 42
'x' in obj;    // calls has trap
obj.y = 'str'; // TypeError

// Real-world use cases:
// 1. Validation
// 2. Reactive state (Vue 3 uses Proxy for reactivity!)
// 3. Default property values
// 4. Logging / debugging
// 5. Negative array indexing
const arr = new Proxy([], {
  get: (t, p) => t[p < 0 ? t.length + +p : p]
});
arr[-1]; // last element</code></pre>
<div class="tip">💡 Always use Reflect inside Proxy traps — it handles edge cases with prototype chains and getters/setters correctly. Reflect methods mirror Proxy trap signatures exactly.</div>`
  },
  {
    id: 61, cat: 'Modern JS', tags: ['mid'],
    q: 'What are Iterators and Iterables in JavaScript?',
    hint: 'Iterator has next() → {value, done}. Iterable has [Symbol.iterator](). Used by for...of, spread, destructuring.',
    answer: `<p>The <strong>iteration protocol</strong> standardizes how values are produced sequentially.</p>
<ul>
<li><strong>Iterator</strong>: an object with <code>next()</code> that returns <code>{ value, done }</code></li>
<li><strong>Iterable</strong>: an object with <code>[Symbol.iterator]()</code> that returns an iterator</li>
</ul>
<pre><code>// Custom iterable range object
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) console.log(n); // 1, 2, 3, 4, 5
[...range];   // [1, 2, 3, 4, 5]
const [a, b] = range; // destructuring works too

// Built-in iterables: Array, String, Map, Set, NodeList, arguments
for (const char of 'hello') console.log(char); // h, e, l, l, o

// Manual iteration
const iter = [1, 2][Symbol.iterator]();
iter.next(); // { value: 1, done: false }
iter.next(); // { value: 2, done: false }
iter.next(); // { value: undefined, done: true }</code></pre>
<div class="tip">💡 Anything that works with for...of, spread (...), or destructuring must be iterable. Implement [Symbol.iterator] to make your custom classes work with all these.</div>`
  },
  {
    id: 62, cat: 'Modern JS', tags: ['adv'],
    q: 'What are ES Modules and how do they differ from CommonJS?',
    hint: 'ESM: static import/export, live bindings, always strict; CJS: require(), dynamic, copied values',
    answer: `<pre><code>// ── ES Modules (ESM) ─────────────────────────────
// math.js
export const PI = 3.14;
export function add(a, b) { return a + b; }
export default class App {}

// main.js
import { PI, add } from './math.js';   // named imports
import App from './App.js';             // default import
import * as Math from './math.js';      // namespace

// ── CommonJS (CJS) ─────────────────────────────
module.exports = { PI, add };
const { PI, add } = require('./math');

// ── Key Differences ────────────────────────────</code></pre>
<table style="width:100%;font-size:0.8rem;border-collapse:collapse">
<tr><th style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.2)">Feature</th><th>ESM</th><th>CommonJS</th></tr>
<tr><td>Analysis</td><td>Static (parse time)</td><td>Dynamic (runtime)</td></tr>
<tr><td>Binding</td><td>Live (tracks changes)</td><td>Copied (snapshot)</td></tr>
<tr><td>Strict mode</td><td>Always</td><td>Opt-in</td></tr>
<tr><td>Top-level await</td><td>✅</td><td>❌</td></tr>
<tr><td>Browser</td><td>type="module"</td><td>Bundler needed</td></tr>
<tr><td>Tree shaking</td><td>✅ (static)</td><td>❌ (dynamic)</td></tr>
</table>
<div class="tip">💡 Tree-shaking only works with ESM because imports are static — bundlers can analyze what's used. CJS require() is dynamic so bundlers can't eliminate dead code.</div>`
  },
  {
    id: 63, cat: 'Modern JS', tags: ['mid'],
    q: 'What are dynamic imports and why are they useful?',
    hint: 'import() returns a Promise — enables code splitting, conditional loading, lazy loading',
    answer: `<p><strong>Dynamic imports</strong> (<code>import()</code>) load modules on demand, returning a Promise. Enables code splitting.</p>
<pre><code>// Static — always loads at startup
import { parse } from 'csv-parser';

// Dynamic — loads only when needed
async function handleUpload(file) {
  if (file.type === 'text/csv') {
    const { parse } = await import('csv-parser'); // loaded now
    return parse(file);
  }
}

// React code splitting
const Chart = React.lazy(() => import('./HeavyChart'));

// Conditional loading
const lang = navigator.language;
const { messages } = await import(\`./i18n/\${lang}.js\`); // dynamic path

// User-triggered loading
button.onclick = async () => {
  const { default: Editor } = await import('./editor.js');
  new Editor(container);
};

// Access default + named exports
const mod = await import('./math.js');
mod.default; // default export
mod.add;     // named export</code></pre>
<p><strong>Benefits:</strong> Smaller initial bundle, faster page load, load features only when needed.</p>
<div class="tip">💡 Webpack and Vite automatically create separate JS chunks for each dynamic import. Use loading states while the chunk loads.</div>`
  },
  {
    id: 64, cat: 'Modern JS', tags: ['adv'],
    q: 'What are WeakRef and FinalizationRegistry?',
    hint: 'WeakRef: hold object without preventing GC; FinalizationRegistry: callback when object is collected',
    answer: `<p>Advanced memory management APIs — use sparingly and only for performance optimizations.</p>
<pre><code>// WeakRef — holds a weak reference (doesn't prevent GC)
let bigObject = { data: new Array(1_000_000).fill('*') };
const ref = new WeakRef(bigObject);

bigObject = null; // release strong reference → GC can now collect it

// Access via .deref() — returns undefined if already collected
const obj = ref.deref();
if (obj) {
  console.log('Still alive:', obj.data.length);
} else {
  console.log('Was garbage collected');
}

// FinalizationRegistry — callback when a registered object is collected
const registry = new FinalizationRegistry((heldValue) => {
  console.log('Collected! Clean up:', heldValue);
  cleanupResources(heldValue);
});

let target = { name: 'Alice' };
registry.register(target, 'alice-cleanup-token');
// target can now be GC'd — callback fires sometime after</code></pre>
<p><strong>Important:</strong> GC timing is non-deterministic. Don't use these for program correctness — only for optional caching or cleanup of non-critical resources.</p>
<div class="tip">💡 WeakRef + FinalizationRegistry are for library authors building caches that should automatically clean up. App code rarely needs these — use WeakMap instead.</div>`
  },
  {
    id: 65, cat: 'Modern JS', tags: ['adv'],
    q: 'What are Async Generators and Async Iterators?',
    hint: 'function* + async = yield Promises lazily; consumed with for await...of',
    answer: `<p><strong>Async generators</strong> combine generator syntax with async/await — they yield values asynchronously and are consumed with <code>for await...of</code>.</p>
<pre><code>// Async generator — paginated API fetcher
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page++}\`);
    const { items, hasMore } = await res.json();
    yield items; // pause, give back items, resume on next iteration
    if (!hasMore) return; // done
  }
}

// Consume with for await...of
async function loadAll() {
  const allItems = [];
  for await (const items of fetchPages('/api/data')) {
    allItems.push(...items);
    if (allItems.length >= 100) break; // can stop early!
  }
  return allItems;
}

// Streaming data (Fetch Streams API)
async function* streamLines(url) {
  const reader = (await fetch(url)).body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) { if (buffer) yield buffer; return; }
    buffer += decoder.decode(value);
    const lines = buffer.split('\\n');
    buffer = lines.pop();
    for (const line of lines) yield line;
  }
}</code></pre>
<div class="tip">💡 Async generators are perfect for paginated APIs, event streams, or any sequence of values that arrive asynchronously over time.</div>`
  },
  {
    id: 66, cat: 'Modern JS', tags: ['adv'],
    q: 'What is Reflect and how does it relate to Proxy?',
    hint: 'Reflect mirrors Proxy trap methods — use Reflect inside traps for correct default behavior',
    answer: `<p><strong>Reflect</strong> is a built-in object with static methods mirroring Proxy traps — same names, same signatures.</p>
<pre><code>// Reflect mirrors operations but with better API design:
Reflect.get(target, prop, receiver);    // target[prop]
Reflect.set(target, prop, value, recv); // target[prop] = value
Reflect.has(target, prop);              // prop in target
Reflect.deleteProperty(target, prop);  // delete target[prop]
Reflect.ownKeys(target);               // all own keys (strings + symbols)
Reflect.apply(fn, thisArg, args);      // fn.apply(thisArg, args)
Reflect.construct(Cls, args);          // new Cls(...args)

// Why Reflect inside Proxy traps?
const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    log(prop);
    // Use Reflect.get (not target[prop]) to:
    // 1. Correctly pass receiver (preserves 'this' for getters)
    // 2. Return consistent boolean values
    return Reflect.get(target, prop, receiver); // ✅
    // return target[prop]; // ❌ breaks for inherited getters
  }
});

// Reflect.set returns true/false instead of throwing
const success = Reflect.set(obj, 'x', 5);
if (!success) console.log('Could not set');</code></pre>
<div class="tip">💡 Rule: always use Reflect inside Proxy traps. It handles prototype chain, getters/setters, and non-writable properties correctly. Never do target[prop] directly in get trap.</div>`
  },

  // ─── ERROR HANDLING ───────────────────────────────────────────────────────
  {
    id: 67, cat: 'Error Handling', tags: ['mid'],
    q: 'How do you create custom Error types in JavaScript?',
    hint: 'Extend Error class — set this.name, call super(message); enables instanceof checks',
    answer: `<pre><code>class ValidationError extends Error {
  constructor(message, field) {
    super(message);                    // sets .message and .stack
    this.name = 'ValidationError';     // override — default is 'Error'
    this.field = field;                // custom property
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// Usage — instanceof lets you catch specific types
function validate(user) {
  if (!user.name)  throw new ValidationError('Name required',  'name');
  if (!user.email) throw new ValidationError('Email required', 'email');
}

try {
  validate({ name: '' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(\`Field "\${err.field}": \${err.message}\`);
  } else if (err instanceof NetworkError) {
    console.log(\`HTTP \${err.statusCode}: \${err.message}\`);
  } else {
    throw err; // re-throw unknown errors — don't swallow them
  }
}</code></pre>
<div class="tip">💡 Always call super(message) — this sets .message and .stack correctly. Always set this.name — otherwise err.name shows 'Error' not 'ValidationError'.</div>`
  },
  {
    id: 68, cat: 'Error Handling', tags: ['mid'],
    q: 'What is error propagation and when should you re-throw an error?',
    hint: 'Catch what you can handle; re-throw everything else; never silently swallow errors',
    answer: `<p><strong>Error propagation</strong> means letting errors bubble up the call stack until something can meaningfully handle them.</p>
<pre><code>// ❌ Anti-pattern: silently swallowing errors
try {
  await doSomething();
} catch (err) {} // hides all bugs — never do this!

// ❌ Anti-pattern: catching all errors at every level
async function fetchUser(id) {
  try { return await fetch(...); }
  catch (err) {
    console.log('error!'); // useless — caller doesn't know what happened
  }
}

// ✅ Correct pattern: handle what you can, re-throw the rest
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new NetworkError('Not found', res.status);
    return await res.json();
  } catch (err) {
    if (err instanceof NetworkError && err.statusCode === 404) {
      return null; // 404 is expected — handle it
    }
    throw err; // unexpected error — propagate up
  }
}

// ✅ Top-level handler
async function main() {
  try {
    const user = await fetchUser(1);
    render(user);
  } catch (err) {
    logToErrorService(err); // catch everything remaining
    showErrorMessage();
  }
}</code></pre>
<div class="tip">💡 Rule: only catch what you can meaningfully recover from. If you can't handle it, re-throw. Handle everything else at the top of your app boundary.</div>`
  },

  // ─── BROWSER APIS ─────────────────────────────────────────────────────────
  {
    id: 69, cat: 'Browser APIs', tags: ['mid'],
    q: 'What is the Fetch API and how do you handle errors correctly?',
    hint: 'fetch() only rejects on network failure — HTTP 4xx/5xx must be checked via response.ok',
    answer: `<p>The key gotcha: <strong>fetch() only rejects on network failure</strong> (no connection, DNS fail). HTTP errors like 404 or 500 are "successful" responses!</p>
<pre><code>// ❌ Wrong — HTTP errors silently "succeed"
const data = await fetch('/api').then(r => r.json());
// 404 or 500 still "resolves" — you get error HTML as data

// ✅ Correct — check response.ok
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
  }
  return res.json();
}

// POST with JSON
await apiFetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
});

// With timeout (AbortController)
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  } finally {
    clearTimeout(id);
  }
}</code></pre>
<div class="tip">💡 Always check response.ok. Create a reusable fetch wrapper that throws on non-2xx responses so every call site doesn't have to remember.</div>`
  },
  {
    id: 70, cat: 'Browser APIs', tags: ['mid'],
    q: 'What is the difference between localStorage, sessionStorage, and cookies?',
    hint: 'Differ in persistence, scope, size, and whether auto-sent to server',
    answer: `<table style="width:100%;font-size:0.8rem;border-collapse:collapse">
<tr><th style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.2)">Feature</th><th>localStorage</th><th>sessionStorage</th><th>Cookie</th></tr>
<tr><td>Lifetime</td><td>Persistent (until cleared)</td><td>Tab session only</td><td>Expiry date / session</td></tr>
<tr><td>Scope</td><td>Same origin, all tabs</td><td>Same tab only</td><td>Domain + path</td></tr>
<tr><td>Size limit</td><td>~5-10 MB</td><td>~5-10 MB</td><td>~4 KB</td></tr>
<tr><td>Sent to server</td><td>No</td><td>No</td><td>Yes (every request)</td></tr>
<tr><td>JS access</td><td>Yes</td><td>Yes</td><td>Yes (unless HttpOnly)</td></tr>
</table>
<pre><code>// localStorage / sessionStorage — same API
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');    // 'dark'
localStorage.removeItem('theme');
localStorage.clear();

// Must stringify objects
localStorage.setItem('user', JSON.stringify({ name: 'Alice', id: 1 }));
const user = JSON.parse(localStorage.getItem('user'));</code></pre>
<div class="tip">💡 Never store auth tokens or sensitive data in localStorage/sessionStorage — XSS attacks can steal it. Use HttpOnly cookies for auth tokens — they're inaccessible to JavaScript.</div>`
  },
  {
    id: 71, cat: 'Browser APIs', tags: ['adv'],
    q: 'What are Web Workers and when should you use them?',
    hint: 'Run JS in a background thread — no DOM access; use postMessage to communicate',
    answer: `<p><strong>Web Workers</strong> run JavaScript in a separate background thread — preventing heavy computation from blocking the main thread (UI freezing).</p>
<pre><code>// main.js
const worker = new Worker('worker.js');

// Send data to worker (structured clone — copies data)
worker.postMessage({ array: bigArray, threshold: 50 });

// Receive results
worker.onmessage = (e) => {
  console.log('Result:', e.data.result);
  worker.terminate(); // clean up
};

worker.onerror = (e) => console.error('Worker error:', e.message);

// worker.js — completely separate context
self.onmessage = (e) => {
  const { array, threshold } = e.data;
  // Heavy computation — won't block UI
  const result = array.filter(x => x > threshold).reduce((a,b) => a+b, 0);
  self.postMessage({ result });
};</code></pre>
<p><strong>Limitations:</strong> No access to DOM, window, document. Communication only via postMessage. Data is copied (structured clone), not shared (except SharedArrayBuffer).</p>
<p><strong>Use cases:</strong> Image/video processing, data parsing, crypto, ML inference, large sort/filter operations.</p>
<div class="tip">💡 Use the Comlink library to make Worker APIs feel like regular async function calls — wraps postMessage/onmessage into an async function interface.</div>`
  },

  // ─── LANGUAGE INTERNALS ───────────────────────────────────────────────────
  {
    id: 72, cat: 'Core JS', tags: ['adv'],
    q: 'What is Automatic Semicolon Insertion (ASI) and what are its gotchas?',
    hint: 'JS inserts ; in specific places — return on its own line is the classic trap',
    answer: `<p>JavaScript automatically inserts semicolons in certain places during parsing to handle missing semicolons.</p>
<p><strong>ASI rules (simplified):</strong> JS inserts ; when the next token would make the code invalid, and at the end of file.</p>
<pre><code>// Classic trap: return on its own line
function getObj() {
  return    // ← ASI inserts ; HERE
  {
    data: 1  // unreachable!
  }
}
getObj(); // undefined! NOT the object

// Fix: opening brace on SAME line as return
function getObj() {
  return {
    data: 1
  };
}

// Trap 2: lines starting with (, [, /, +, -
const a = 1
const b = 2
[a, b].forEach(x => console.log(x)) // PARSED AS: 2[a,b].forEach(...)
// TypeError: Cannot read properties of undefined

// Fix: add semicolon to previous line, OR start with ;
const b = 2;
;[a, b].forEach(x => console.log(x)) // safe defensive semicolon</code></pre>
<div class="tip">💡 Safest rule: always put return values on the same line as return. If not using semicolons, use defensive semicolons before lines starting with [, (, or /.</div>`
  },
  {
    id: 73, cat: 'Core JS', tags: ['mid'],
    q: 'What is BigInt and when do you need it?',
    hint: 'Arbitrary-precision integers — for values beyond Number.MAX_SAFE_INTEGER (2^53 - 1)',
    answer: `<p>JavaScript's <code>Number</code> type (64-bit float) can only safely represent integers up to <code>2^53 - 1</code> = 9,007,199,254,740,991. <strong>BigInt</strong> handles arbitrarily large integers.</p>
<pre><code>// Problem: precision loss with large integers
9007199254740993 === 9007199254740992; // true! — lost a bit

// BigInt — suffix with n
9007199254740993n === 9007199254740992n; // false ✓

const big = 99999999999999999999999999n;
const sum = big + 1n; // works perfectly

// Can't mix BigInt and Number directly
1n + 1; // TypeError: Cannot mix BigInt and other types
Number(1n) + 1; // 2 — explicit conversion
BigInt(5) + 3n; // 8n — explicit conversion

// Comparison with Number (ok with ==, not ===)
1n == 1;  // true (loose equality)
1n === 1; // false (strict, different types)

// No decimal support
10n / 3n; // 3n — truncates toward zero

// Math methods don't support BigInt
Math.max(1n, 2n); // TypeError</code></pre>
<div class="tip">💡 Use BigInt for: large database IDs (64-bit integers from other languages), financial amounts where precision matters, cryptography, and any integer computation beyond 2^53.</div>`
  },
  {
    id: 74, cat: 'DOM & Events', tags: ['mid'],
    q: 'What is the difference between async and defer for script loading?',
    hint: 'Both avoid blocking HTML parsing — async executes ASAP, defer after full parse',
    answer: `<p>By default, <code>&lt;script&gt;</code> blocks HTML parsing while downloading and executing.</p>
<table style="width:100%;font-size:0.8rem;border-collapse:collapse">
<tr><th style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.2)">Attribute</th><th>Download</th><th>Executes when</th><th>Order</th></tr>
<tr><td>None (default)</td><td>Blocks HTML</td><td>Immediately, blocks</td><td>In order</td></tr>
<tr><td>async</td><td>Parallel</td><td>As soon as downloaded</td><td>NOT guaranteed</td></tr>
<tr><td>defer</td><td>Parallel</td><td>After HTML fully parsed</td><td>In document order</td></tr>
</table>
<pre><code>&lt;!-- Blocks parsing ❌ (put in &lt;head&gt;) --&gt;
&lt;script src="app.js"&gt;&lt;/script&gt;

&lt;!-- Parallel download, executes ASAP when downloaded --&gt;
&lt;!-- ORDER NOT GUARANTEED — analytics.js might run before vendor.js --&gt;
&lt;script async src="analytics.js"&gt;&lt;/script&gt;

&lt;!-- Parallel download, runs after HTML parsed, IN ORDER ✅ --&gt;
&lt;script defer src="vendor.js"&gt;&lt;/script&gt;
&lt;script defer src="app.js"&gt;&lt;/script&gt;
&lt;!-- app.js always runs after vendor.js --&gt;</code></pre>
<p><strong>When to use:</strong></p>
<ul>
<li><strong>defer</strong> — most app scripts (DOM-dependent, order-dependent)</li>
<li><strong>async</strong> — completely independent scripts (analytics, ads)</li>
</ul>
<div class="tip">💡 type="module" scripts are deferred by default. In modern apps using bundlers, you usually put one deferred script tag pointing at the bundle.</div>`
  },
  {
    id: 75, cat: 'Functions', tags: ['adv'],
    q: 'What are the Module Pattern and the Revealing Module Pattern?',
    hint:  `IIFE + closure = private scope; expose only public API; revealing = explicitly name what's public`,
    answer: `<p>Pre-ES-modules patterns for creating encapsulated, private state in JavaScript.</p>
<pre><code>// Module Pattern
const counter = (function() {
  let _count = 0; // private — inaccessible from outside

  return {
    increment() { _count++; },
    decrement() { _count--; },
    getCount()  { return _count; }
  };
})();

counter.increment();
counter.getCount(); // 1
counter._count;     // undefined — truly private ✓

// Revealing Module Pattern
// Define everything privately, then reveal selectively
const bankAccount = (function() {
  let _balance = 1000;
  let _transactions = [];

  function _log(type, amount) {
    _transactions.push({ type, amount, date: Date.now() });
  }

  function deposit(amount) {
    if (amount > 0) { _balance += amount; _log('deposit', amount); }
  }

  function withdraw(amount) {
    if (amount > 0 && amount <= _balance) {
      _balance -= amount; _log('withdrawal', amount);
    }
  }

  function getBalance() { return _balance; }
  function getHistory() { return [..._transactions]; }

  // Explicitly reveal the public interface
  return { deposit, withdraw, getBalance, getHistory };
})();</code></pre>
<div class="tip">💡 Before ES modules, this was THE pattern for encapsulation. jQuery, Lodash, and most pre-2015 JS libraries used this. Today, use ES modules instead.</div>`
  },
  {
    id: 76, cat: 'Functions', tags: ['adv'],
    q: 'What is partial application and how does it differ from currying?',
    hint: 'Partial application = pre-fill some args, return function waiting for the rest; currying = always one arg at a time',
    answer: `<p>Both techniques create specialized functions from general ones — but differ in how arguments are collected.</p>
<pre><code>// Partial Application — pre-fill SOME args
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const add = (a, b, c) => a + b + c;
const add10 = partial(add, 10);         // pre-fill first arg
const add10and20 = partial(add, 10, 20); // pre-fill two args

add10(5, 3);     // 18 — takes remaining 2 args AT ONCE
add10and20(7);   // 37 — takes remaining 1 arg

// Currying — always ONE arg at a time
const curriedAdd = a => b => c => a + b + c;
curriedAdd(1)(2)(3); // 6 — strictly one at a time

// Practical partial application with bind()
function greet(greeting, punct, name) {
  return \`\${greeting}, \${name}\${punct}\`;
}
const hello = greet.bind(null, 'Hello', '!'); // partial via bind
hello('Alice'); // 'Hello, Alice!'
hello('Bob');   // 'Hello, Bob!'</code></pre>
<p><strong>Summary:</strong></p>
<ul>
<li>Currying: f(a, b, c) → f(a)(b)(c) — each call takes exactly ONE argument</li>
<li>Partial application: f(a, b, c) → f(a, b)(c) — pre-fill any number of args</li>
</ul>
<div class="tip">💡 In practice, curried functions support partial application too (you can call with multiple args and they accumulate). The distinction is mostly theoretical.</div>`
  },

  // ─── REMAINING MISSING TOPICS ─────────────────────────────────────────────
  {
    id: 77, cat: 'Functions', tags: ['core'],
    q: 'What is the difference between function declarations and function expressions?',
    hint: 'Declarations are hoisted fully; expressions are not — and expression form gives more control',
    answer: `<p>Both create functions but behave differently with hoisting and syntax.</p>
<pre><code>// Function Declaration — hoisted completely (name + body)
greet(); // ✅ works BEFORE the declaration
function greet() { return 'hello'; }

// Function Expression — NOT hoisted as a function
sayHi(); // ❌ TypeError: sayHi is not a function (var hoisted as undefined)
var sayHi = function() { return 'hi'; };

// Arrow function expression
const add = (a, b) => a + b;

// Named function expression (NFE) — name only visible inside
const fact = function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1); // factorial = self
};
console.log(typeof factorial); // undefined — not accessible outside</code></pre>
<p><strong>When to prefer each:</strong></p>
<ul>
<li><strong>Declaration</strong> — top-level utility functions, when you want full hoisting</li>
<li><strong>Expression</strong> — callbacks, conditional function creation, storing in variables, passing as args</li>
</ul>
<div class="tip">💡 Most style guides prefer expressions (especially arrow) for callbacks and class methods. Declarations are fine for named utility functions at module scope.</div>`
  },
  {
    id: 78, cat: 'Functions', tags: ['core'],
    q: 'What is the spread operator (...) and what are its use cases?',
    hint: 'Expand iterable into individual elements — arrays, function args, object spreading',
    answer: `<pre><code>// 1. Spread in function calls — expand array as arguments
const nums = [1, 5, 3, 2, 4];
Math.max(...nums); // 5 — same as Math.max(1,5,3,2,4)

// 2. Copy and combine arrays (immutable operations)
const a = [1, 2, 3];
const b = [4, 5, 6];
const copy    = [...a];          // [1,2,3] — shallow copy
const merged  = [...a, ...b];    // [1,2,3,4,5,6]
const prepend = [0, ...a];       // [0,1,2,3]

// 3. Spread in object literals (ES2018)
const base = { a: 1, b: 2 };
const extended = { ...base, c: 3 };        // { a:1, b:2, c:3 }
const override = { ...base, b: 99 };       // { a:1, b:99 } — later wins

// 4. Convert iterable to array
const set = new Set([1,2,3]);
[...set]; // [1,2,3]
[...'hello']; // ['h','e','l','l','o']
[...document.querySelectorAll('p')]; // NodeList → Array

// 5. Clone + update (immutable pattern)
const state = { user: 'Alice', count: 0 };
const newState = { ...state, count: state.count + 1 };</code></pre>
<div class="tip">💡 Spread creates SHALLOW copies — nested objects are still shared references. Use structuredClone() for deep copies. Spread in objects is order-sensitive: later properties win.</div>`
  },
  {
    id: 79, cat: 'Functions', tags: ['core'],
    q: 'What are default parameters and how do they work?',
    hint: 'Evaluated at call time, only when arg is undefined — can reference earlier params and outer scope',
    answer: `<pre><code>// Basic default parameters
function greet(name = 'World', greeting = 'Hello') {
  return \`\${greeting}, \${name}!\`;
}
greet();              // 'Hello, World!'
greet('Alice');       // 'Hello, Alice!'
greet('Bob', 'Hi');   // 'Hi, Bob!'
greet(undefined, 'Hey'); // 'Hey, World!' — undefined triggers default
greet(null, 'Hey');   // 'Hey, null!' — null does NOT trigger default

// Defaults can reference earlier parameters
function range(start = 0, end = start + 10) {
  return { start, end };
}
range();     // { start: 0, end: 10 }
range(5);    // { start: 5, end: 15 }

// Defaults can be expressions / function calls
let count = 0;
function makeId(id = ++count) { return id; } // evaluated each call
makeId(); // 1
makeId(); // 2
makeId(99); // 99 (provided, so default not evaluated)

// Defaults + destructuring (very common pattern)
function createUser({ name = 'Anonymous', role = 'user', active = true } = {}) {
  return { name, role, active };
}
createUser({ name: 'Alice' }); // { name:'Alice', role:'user', active:true }
createUser();                  // {} → uses = {} → all defaults apply</code></pre>
<div class="tip">💡 Default params replaced the old pattern: name = name || 'World'. The old way was buggy (falsy values like 0 or '' triggered the default). New defaults only trigger for undefined.</div>`
  },
  {
    id: 80, cat: "'this' Keyword", tags: ['mid'],
    q: 'Explain the four rules of this binding: default, implicit, explicit, and new.',
    hint: 'Priority: new > explicit (bind/call/apply) > implicit (method) > default (global/undefined)',
    answer: `<p>Four rules determine <code>this</code>, with this priority order: <strong>new > explicit > implicit > default</strong></p>
<pre><code>// 1. Default binding — standalone function call
function fn() { console.log(this); }
fn(); // global object (window) in sloppy mode, undefined in strict

// 2. Implicit binding — method call (object before the dot)
const obj = { name: 'Alice', fn() { return this.name; } };
obj.fn(); // 'Alice' — this = obj

// ⚠️ Implicit binding LOST on assignment
const fn2 = obj.fn;
fn2(); // undefined — no object before dot

// 3. Explicit binding — call, apply, bind
function greet(greeting) { return \`\${greeting}, \${this.name}\`; }
greet.call({ name: 'Bob' }, 'Hello');    // 'Hello, Bob'
greet.apply({ name: 'Carol' }, ['Hi']); // 'Hi, Carol'
const bound = greet.bind({ name: 'Dave' });
bound('Hey'); // 'Hey, Dave' — permanently bound

// 4. new binding — constructor call
function Person(name) { this.name = name; }
const p = new Person('Eve');
p.name; // 'Eve' — this = freshly created object

// new: 1) creates {} 2) links prototype 3) binds this 4) returns it

// Arrow functions: LEXICAL this — none of the 4 rules apply
const obj2 = {
  name: 'Zara',
  fn: () => this.name, // this = outer scope (NOT obj2)
  method() { return () => this.name; } // nested arrow captures method's this
};
obj2.fn();            // undefined — arrow ignores implicit binding
obj2.method()();      // 'Zara' — arrow captured method's this</code></pre>
<div class="tip">💡 Interview rule: ask "How was the function called?" Default → standalone call. Implicit → object.method(). Explicit → call/apply/bind. new → constructor. Arrow → look where it was DEFINED.</div>`
  },
  {
    id: 81, cat: 'Objects', tags: ['adv'],
    q: 'What are native prototypes and how can you safely extend them?',
    hint: 'Array.prototype, String.prototype etc — extending them affects ALL instances; almost always a bad idea',
    answer: `<p>All built-in types (Array, String, Object, Function…) have prototypes with their methods. Every array shares <code>Array.prototype</code>.</p>
<pre><code>// How it works — built-in prototype chain
const arr = [1, 2, 3];
// arr.__proto__ === Array.prototype ✓
// Array.prototype.__proto__ === Object.prototype ✓

// All arrays share Array.prototype methods
arr.map === Array.prototype.map;   // true — same reference

// Checking native prototype
Array.prototype.includes;   // function — built-in
String.prototype.padStart;  // function — built-in

// ❌ Bad: extending native prototypes (prototype pollution risk)
Array.prototype.last = function() { return this[this.length - 1]; };
// Now EVERY array in ALL your code + libraries has .last — collisions!

// ❌ Famous historical mistake: Prototype.js library
// It extended Array.prototype and broke all for...in loops on arrays

// ✅ If you must extend (only in polyfills — check first)
if (!Array.prototype.myMethod) { // always guard with existence check
  Array.prototype.myMethod = function() { ... };
}

// ✅ Better: use utility functions or subclassing
class SuperArray extends Array {
  last() { return this[this.length - 1]; }
}
const sa = new SuperArray(1, 2, 3);
sa.last(); // 3 — only SuperArray instances affected</code></pre>
<div class="tip">💡 Rule: never extend native prototypes in application code or libraries. Exception: polyfills (always check for existence first). It's the JS equivalent of monkey-patching — dangerous at scale.</div>`
  },
  {
    id: 82, cat: 'Core JS', tags: ['adv'],
    q: 'What is the rendering phase of the browser event loop?',
    hint: 'Between macrotasks: style → layout → paint → compositing — sync code blocks it',
    answer: `<p>The browser event loop interleaves JS execution with rendering. Understanding this explains why sync code freezes the UI.</p>
<pre><code>// Browser event loop order:
// 1. Pick one macrotask from the queue (e.g., setTimeout callback)
// 2. Execute it to completion
// 3. Drain ALL microtasks (Promises, queueMicrotask)
// 4. ← RENDER PHASE (if needed):
//      a. requestAnimationFrame callbacks
//      b. Style recalculation
//      c. Layout (reflow)
//      d. Paint
//      e. Composite
// 5. Repeat

// Why sync code freezes UI:
button.onclick = () => {
  // Render phase is BLOCKED until this finishes
  for (let i = 0; i < 1_000_000_000; i++) {} // 1 second of CPU
  updateDOM(); // user sees nothing during the loop
};

// requestAnimationFrame runs IN the render phase — perfect for animation
function animate() {
  element.style.left = (x++) + 'px'; // guaranteed to paint every frame
  requestAnimationFrame(animate);    // schedule for NEXT render phase
}
requestAnimationFrame(animate);

// setTimeout(0) yields to render, rAF aligns WITH render
button.onclick = () => {
  status.textContent = 'Loading...';
  setTimeout(() => heavyWork(), 0); // allows repaint of 'Loading...' first
};</code></pre>
<div class="tip">💡 Use requestAnimationFrame for visual updates — it runs just before the browser paints, ensuring 60fps synchronization. setTimeout(0) lets the browser render but has no frame alignment.</div>`
  },
  {
    id: 83, cat: 'Browser APIs', tags: ['adv'],
    q: 'What are Service Workers and what problems do they solve?',
    hint: 'Background JS proxy between app and network — enables offline support, push notifications, caching',
    answer: `<p>A <strong>Service Worker</strong> is a script that runs in the background, separate from the page — acting as a network proxy. Enables progressive web app features.</p>
<pre><code>// Registration (main thread)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg.scope))
    .catch(err => console.error('SW failed:', err));
}

// sw.js — the service worker itself
const CACHE = 'v1';
const ASSETS = ['/index.html', '/styles.css', '/app.js'];

// Install — pre-cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

// Fetch — intercept ALL network requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request); // cache-first strategy
    })
  );
});</code></pre>
<p><strong>Capabilities:</strong> Offline caching, background sync, push notifications, intercepting requests, URL routing.</p>
<div class="tip">💡 Service Workers only run on HTTPS (or localhost). They have no DOM access. They're the foundation of Progressive Web Apps (PWAs). Use Workbox library to simplify service worker code.</div>`
  },
  {
    id: 84, cat: 'Browser APIs', tags: ['adv'],
    q: 'What is the Same-Origin Policy and how does CORS work?',
    hint: 'Browser blocks cross-origin requests by default; server opts in via CORS headers',
    answer: `<p>The <strong>Same-Origin Policy (SOP)</strong> blocks web pages from reading resources from a different origin (protocol + domain + port combination).</p>
<pre><code>// Same origin — all identical: protocol, domain, port
// https://app.com/page can read from https://app.com/api ✅
// https://app.com/page CANNOT read from https://api.other.com ❌

// CORS (Cross-Origin Resource Sharing):
// Server opts in by sending response headers

// Server response headers to allow access:
Access-Control-Allow-Origin: https://app.com  // or * for all
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true // if sending cookies

// Simple requests (GET, POST with basic headers) — no preflight
fetch('https://api.other.com/data');

// Preflighted requests — browser sends OPTIONS first
fetch('https://api.other.com/data', {
  method: 'DELETE',           // non-simple method
  headers: { 'X-Custom': '1' } // non-simple header
});
// Browser sends: OPTIONS https://api.other.com/data
// → checks server allows it before actual request

// CORS does NOT apply to:
// - Server-to-server (Node.js fetch, cURL)
// - &lt;img&gt;, &lt;script&gt;, &lt;link&gt; tags (but limited access)
// - Same origin</code></pre>
<div class="tip">💡 CORS is enforced by the BROWSER only — it's not a server-side security measure. Server-to-server calls bypass it entirely. The browser is protecting users from malicious scripts, not the server from requests.</div>`
  },
  {
    id: 85, cat: 'Modern JS', tags: ['adv'],
    q: 'What are the basics of regular expressions in JavaScript?',
    hint: 'Pattern matching: literal chars, character classes, quantifiers, groups, flags (g, i, m)',
    answer: `<pre><code>// Creating regex
const r1 = /hello/;           // literal
const r2 = new RegExp('hello'); // dynamic pattern

// Test & match
/hello/.test('say hello');  // true
'hello world'.match(/\\w+/g); // ['hello', 'world']
'hello world'.match(/(\\w+)\\s(\\w+)/); // with groups

// Character classes
/[aeiou]/     // any vowel
/[^aeiou]/    // NOT a vowel
/[a-z]/       // lowercase letter
/\\d/          // digit [0-9]
/\\w/          // word char [a-zA-Z0-9_]
/\\s/          // whitespace
/./           // any char except newline

// Quantifiers
/a+/          // one or more
/a*/          // zero or more
/a?/          // zero or one
/a{3}/        // exactly 3
/a{2,5}/      // 2 to 5

// Anchors
/^hello/      // starts with
/world$/      // ends with

// Groups
/(\\d{4})-(\\d{2})-(\\d{2})/.exec('2024-01-15');
// groups: ['2024', '01', '15']
/(?&lt;year&gt;\\d{4})-(?&lt;month&gt;\\d{2})/.exec('2024-01');
// Named: match.groups.year, match.groups.month

// Lookahead / lookbehind
/\\d+(?= dollars)/   // digits followed by " dollars"
/(?&lt;=\\$)\\d+/        // digits preceded by $
/\\d+(?! dollars)/   // digits NOT followed by " dollars"

// Flags
/pattern/g   // global — find all matches
/pattern/i   // case insensitive
/pattern/m   // multiline — ^ and $ match line starts/ends
/pattern/s   // dotAll — . matches newline too

// Common operations
'a1b2'.replace(/\\d/g, '#');    // 'a#b#'
'a,b,,c'.split(/,+/);          // ['a','b','c']
'hello'.search(/e/);            // 1 (index)</code></pre>
<div class="tip">💡 Greedy vs lazy: /a.*b/ greedily matches as MUCH as possible; /a.*?b/ lazily matches as LITTLE as possible. Add ? after quantifiers for lazy: +?, *?, {n,m}?</div>`
  },
  {
    id: 86, cat: 'Core JS', tags: ['adv'],
    q: 'What are Environment Records and how do they underpin scope?',
    hint: 'The data structure that stores variable bindings in each scope — the "real" scope implementation',
    answer: `<p>An <strong>Environment Record</strong> is the actual data structure that stores identifier (variable) bindings for a scope. When the spec says "scope," it means Environment Records under the hood.</p>
<pre><code>// Each scope = one Environment Record created at runtime
// Environment Record stores { variable: value } mappings

function outer() {
  let x = 1;     // x stored in outer's Environment Record
  function inner() {
    let y = 2;   // y stored in inner's Environment Record
    console.log(x); // looks up outer's Environment Record via [[OuterEnv]]
  }
  inner();
}
// Call stack at inner():
// inner's ER: { y: 2, [[OuterEnv]] → outer's ER }
// outer's ER: { x: 1, inner: fn, [[OuterEnv]] → global ER }
// global ER:  { outer: fn, ... }

// Types of Environment Records:
// - Declarative ER: let, const, function declarations, parameters
// - Object ER: var declarations and global code (backed by an object)
// - Global ER: combination of both (global scope)
// - Module ER: ES module scope
// - Function ER: function body scope

// Closures = an inner function holding a reference to
// the outer function's Environment Record AFTER it has returned
const fn = outer(); // outer's ER stays alive because inner references it</code></pre>
<div class="tip">💡 Environment Records replaced the older "Activation Object" spec term. Understanding them demystifies closures completely: a closure is just a function holding a reference to an outer Environment Record.</div>`
  },
  {
    id: 87, cat: 'Browser APIs', tags: ['adv'],
    q: 'What is Shadow DOM and when do you use it?',
    hint: 'Encapsulated DOM subtree — styles and JS don\'t leak in or out; foundation of Web Components',
    answer: `<pre><code>// Attach a shadow root to any element
const host = document.getElementById('my-widget');
const shadow = host.attachShadow({ mode: 'open' }); // or 'closed'

// Add content — fully encapsulated
shadow.innerHTML = \`
  &lt;style&gt;
    /* This CSS is SCOPED to shadow DOM only */
    p { color: red; font-size: 1.5rem; }
    :host { display: block; border: 1px solid blue; }
  &lt;/style&gt;
  &lt;p&gt;I'm in shadow DOM&lt;/p&gt;
  &lt;slot&gt;&lt;/slot&gt;  &lt;!-- slot: renders host element's children --&gt;
\`;

// 'open' mode: accessible via element.shadowRoot
host.shadowRoot.querySelector('p'); // works
// 'closed' mode: host.shadowRoot = null (truly private)

// &lt;slot&gt; — project host children into shadow DOM
// &lt;my-card&gt;&lt;h2&gt;Title&lt;/h2&gt;&lt;/my-card&gt;
// The &lt;h2&gt; is rendered where &lt;slot&gt; is placed

// Web Component using Shadow DOM
class MyButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
      &lt;style&gt;button { background: purple; color: white; }&lt;/style&gt;
      &lt;button&gt;&lt;slot&gt;Click me&lt;/slot&gt;&lt;/button&gt;
    \`;
  }
}
customElements.define('my-button', MyButton);</code></pre>
<div class="tip">💡 Shadow DOM = CSS encapsulation + DOM encapsulation. Styles from the outside can't penetrate in (except CSS custom properties / variables), and internal styles can't leak out. This is how browser built-ins like &lt;video&gt; and &lt;input type="date"&gt; hide their internal structure.</div>`
  },
  {
    id: 88, cat: 'Core JS', tags: ['adv'],
    q: 'What is the new Function() constructor and when is it used?',
    hint: 'Create functions from strings at runtime — dynamic but slower, eval-like risks, no closure',
    answer: `<pre><code>// Syntax: new Function([...params], functionBody)
const add = new Function('a', 'b', 'return a + b');
add(2, 3); // 5

const greet = new Function('name', 'return "Hello, " + name');
greet('Alice'); // 'Hello, Alice'

// Key characteristic: no closure — runs in GLOBAL scope
const x = 10;
function test() {
  const x = 20; // local x
  const fn = new Function('return x'); // does NOT close over local x
  return fn();
}
test(); // 10 (global x) — NOT 20!

// Use cases (rare):
// 1. Dynamic code from server (CMS, user-defined formulas)
const formula = new Function('a', 'b', serverSideFormula);

// 2. Template engines (pre-compile to JS)

// 3. Sandboxed evaluation (safer than eval)
const fn = new Function('data', 'with(data) { return x + y }');
fn({ x: 1, y: 2 }); // 3 (limited scope)</code></pre>
<p><strong>Risks and drawbacks:</strong> Cannot access local scope (can't make closures). Security risk if body comes from user input. Blocks V8 optimization. Slower than regular functions.</p>
<div class="tip">💡 Think of new Function() as eval() for function bodies. Only use for dynamic code execution from trusted sources. In CSP-hardened apps, new Function() is blocked along with eval.</div>`
  },
  {
    id: 89, cat: 'Performance', tags: ['adv'],
    q: 'What is lazy loading and code splitting?',
    hint: 'Lazy loading: load resources only when needed; code splitting: divide bundle into smaller chunks',
    answer: `<p><strong>Lazy loading</strong> defers loading of non-critical resources until they're actually needed.</p>
<p><strong>Code splitting</strong> breaks your JS bundle into smaller chunks loaded on demand.</p>
<pre><code>// ─── Native Lazy Loading (images, iframes) ─────────────────
&lt;img src="hero.jpg" loading="eager" /&gt;   // load immediately
&lt;img src="below-fold.jpg" loading="lazy" /&gt; // load when near viewport

// ─── JS Code Splitting (Webpack/Vite) ─────────────────────
// Static import — included in main bundle
import { utils } from './utils.js';

// Dynamic import — separate chunk, loaded on demand
async function loadChart() {
  const { Chart } = await import('./HeavyChart.js'); // separate bundle
  new Chart(element, data);
}

// Route-based splitting (React Router)
const Dashboard = React.lazy(() => import('./Dashboard'));
const Settings  = React.lazy(() => import('./Settings'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;Routes&gt;
        &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
        &lt;Route path="/settings"  element={&lt;Settings /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/Suspense&gt;
  );
}

// ─── IntersectionObserver lazy loading ────────────────────
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    observer.unobserve(entry.target);
  }
});
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));</code></pre>
<div class="tip">💡 Impact: code splitting cuts initial bundle by 30–70% for most apps. Rule of thumb: everything not needed for the landing page view should be lazily loaded.</div>`
  },
  {
    id: 90, cat: 'Functions', tags: ['adv'],
    q: 'What is tail call optimization (TCO) and how does it prevent stack overflow?',
    hint: 'A tail call is the last operation in a function — engine can reuse the stack frame instead of adding a new one',
    answer: `<p>A <strong>tail call</strong> is when the last action of a function is calling another function. If the engine applies TCO, it reuses the current stack frame instead of pushing a new one — preventing stack overflow for deep recursion.</p>
<pre><code>// Regular recursion — O(n) stack frames
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // NOT tail call — must multiply AFTER return
}
factorial(100000); // Stack overflow!

// Tail-recursive version — last op is the call
function factTail(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factTail(n - 1, n * accumulator); // tail call — nothing after it
}
// With TCO, this would run in O(1) stack space

// Current reality:
// TCO is in the ES6 spec BUT only Safari implements it fully
// V8 (Node/Chrome) removed their TCO implementation
// So tail recursion is NOT safe in Node.js / Chrome!

// Practical alternatives:
// 1. Iteration (always safe)
function factIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// 2. Trampolining — simulates TCO in user space
const trampoline = fn => (...args) => {
  let result = fn(...args);
  while (typeof result === 'function') result = result();
  return result;
};

const factTramp = trampoline(function fact(n, acc = 1) {
  return n <= 1 ? acc : () => fact(n - 1, n * acc); // return fn instead of calling
});
factTramp(100000); // works!</code></pre>
<div class="tip">💡 Know the theory for interviews but use iteration in production. Trampolining is the practical way to handle very deep recursion in JS without relying on TCO.</div>`
  },
]

export const FREE_LIMIT = 5 // free users can track up to 5 mastered questions
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
  "'this' Keyword", 'Error Handling', 'Modern JS', 'Performance', 'DOM & Events'
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
]

export const FREE_LIMIT = 5 // free users can track up to 5 mastered questions

export interface DebugQuestion {
  id: number
  cat: 'Async Bugs' | 'Closure Traps' | 'Event Loop Traps' | 'Fix the Code' | 'What\'s Wrong?'
  difficulty: 'easy' | 'medium' | 'hard'
  title: string
  description: string
  brokenCode: string
  bugDescription: string
  fixedCode: string
  explanation: string
  keyInsight: string
  tags: string[]
}

export const DEBUG_CATEGORIES = [
  'Async Bugs',
  'Closure Traps',
  'Event Loop Traps',
  'Fix the Code',
  "What's Wrong?",
] as const

export const debugQuestions: DebugQuestion[] = [

  // ─── ASYNC BUGS ──────────────────────────────────────────────────────
  {
    id: 600, cat: 'Async Bugs', difficulty: 'easy',
    title: 'Missing await causes wrong result',
    tags: ['async', 'await', 'promise'],
    description: 'This function is supposed to return the user data, but it always logs "[object Promise]". Fix it.',
    brokenCode: `async function getUser(id) {
  const user = fetch(\`/api/users/\${id}\`)
    .then(r => r.json());
  console.log(user);
  return user;
}`,
    bugDescription: 'fetch() returns a Promise. Without await, user is a Promise object, not the resolved data.',
    fixedCode: `async function getUser(id) {
  const user = await fetch(\`/api/users/\${id}\`)
    .then(r => r.json());
  console.log(user);
  return user;
}`,
    explanation: 'Without await, user holds the Promise itself. Adding await pauses execution until the Promise resolves and gives you the actual data.',
    keyInsight: 'Always await async operations inside async functions. A missing await is one of the most common async bugs.'
  },
  {
    id: 601, cat: 'Async Bugs', difficulty: 'medium',
    title: 'Sequential awaits killing performance',
    tags: ['async', 'await', 'parallel', 'performance'],
    description: 'This works correctly but is 2x slower than it needs to be. The two API calls are independent. Fix it to run them in parallel.',
    brokenCode: `async function getDashboard(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(userId);
  return { user, posts };
}`,
    bugDescription: 'The two fetches run sequentially. fetchPosts waits for fetchUser to finish even though they\'re independent.',
    fixedCode: `async function getDashboard(userId) {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId)
  ]);
  return { user, posts };
}`,
    explanation: 'Promise.all fires both requests simultaneously. If each takes 500ms, sequential = 1000ms, parallel = 500ms. Always parallelize independent async operations.',
    keyInsight: 'Sequential awaits for independent operations is a performance bug. Use Promise.all for parallel execution.'
  },
  {
    id: 602, cat: 'Async Bugs', difficulty: 'medium',
    title: 'Swallowed error in async function',
    tags: ['async', 'error-handling', 'try-catch'],
    description: 'Errors from this function are silently swallowed. The caller never knows if something went wrong. Fix the error handling.',
    brokenCode: `async function saveData(data) {
  try {
    const result = await api.post('/save', data);
    return result;
  } catch (err) {
    console.log('Error:', err);
  }
}

// Caller
const result = await saveData(data);
if (result) updateUI(result); // silently fails on error`,
    bugDescription: 'The catch block logs but doesn\'t re-throw. The function returns undefined on error. Caller can\'t distinguish success from failure.',
    fixedCode: `async function saveData(data) {
  try {
    const result = await api.post('/save', data);
    return result;
  } catch (err) {
    console.error('Error saving data:', err);
    throw err; // re-throw so caller can handle it
  }
}

// Caller
try {
  const result = await saveData(data);
  updateUI(result);
} catch (err) {
  showErrorMessage(err);
}`,
    explanation: 'Catching an error and not re-throwing it silently swallows it. The function returns undefined and callers can\'t tell what happened. Always re-throw or return an error indicator.',
    keyInsight: 'If you catch an error and don\'t re-throw it, callers are flying blind. Only catch if you can truly handle it.'
  },
  {
    id: 603, cat: 'Async Bugs', difficulty: 'hard',
    title: 'Async function in forEach',
    tags: ['async', 'foreach', 'promise', 'array'],
    description: 'This is supposed to save all users and then log "All saved!", but "All saved!" prints before the saves complete. Fix it.',
    brokenCode: `async function saveAllUsers(users) {
  users.forEach(async (user) => {
    await saveUser(user);
    console.log(\`Saved \${user.name}\`);
  });
  console.log('All saved!');
}`,
    bugDescription: 'forEach doesn\'t await async callbacks. It fires all async functions and immediately moves on. "All saved!" logs before any save completes.',
    fixedCode: `async function saveAllUsers(users) {
  // Option 1: Sequential (one at a time)
  for (const user of users) {
    await saveUser(user);
    console.log(\`Saved \${user.name}\`);
  }

  // Option 2: Parallel (all at once, faster)
  // await Promise.all(users.map(user => saveUser(user)));

  console.log('All saved!');
}`,
    explanation: 'forEach ignores the Promise returned by async callbacks. Use for...of with await for sequential, or Promise.all(array.map(...)) for parallel.',
    keyInsight: 'forEach + async = fire and forget. Use for...of or Promise.all(map()) when you need to await async operations on arrays.'
  },
  {
    id: 604, cat: 'Async Bugs', difficulty: 'hard',
    title: 'Race condition in state update',
    tags: ['async', 'race-condition', 'state'],
    description: 'A search input fires API requests on each keystroke. Fast typing causes old results to overwrite new ones. Fix the race condition.',
    brokenCode: `async function handleSearch(query) {
  setLoading(true);
  const results = await searchAPI(query);
  setResults(results);
  setLoading(false);
}

input.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});`,
    bugDescription: 'If user types "react" quickly, 5 requests fire. Whichever resolves LAST wins — could be an earlier query returning stale results.',
    fixedCode: `let currentQuery = '';

async function handleSearch(query) {
  currentQuery = query;
  setLoading(true);

  const results = await searchAPI(query);

  // Discard stale results
  if (query !== currentQuery) return;

  setResults(results);
  setLoading(false);
}

// Better: also debounce the input
const debouncedSearch = debounce(handleSearch, 300);
input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});`,
    explanation: 'Track the latest query. When a response arrives, check if it\'s still the current query. If not, discard it. Also use debounce to reduce requests.',
    keyInsight: 'Race conditions in search: always validate that the response matches the latest request. AbortController is the modern approach.'
  },
  {
    id: 605, cat: 'Async Bugs', difficulty: 'medium',
    title: 'Promise constructor anti-pattern',
    tags: ['async', 'promise', 'anti-pattern'],
    description: 'This unnecessarily wraps an already-async function in a new Promise. Simplify it.',
    brokenCode: `function loadData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(r => r.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}`,
    bugDescription: 'fetch() already returns a Promise. Wrapping it in new Promise is the "explicit Promise constructor anti-pattern" — verbose and error-prone.',
    fixedCode: `function loadData(url) {
  return fetch(url).then(r => r.json());
}

// Or with async/await:
async function loadData(url) {
  const r = await fetch(url);
  return r.json();
}`,
    explanation: 'If you\'re already working with Promises, just return/chain them directly. The new Promise constructor is only needed when working with callbacks.',
    keyInsight: 'Never wrap a Promise in new Promise. This is called the explicit constructor anti-pattern.'
  },

  // ─── CLOSURE TRAPS ───────────────────────────────────────────────────
  {
    id: 700, cat: 'Closure Traps', difficulty: 'easy',
    title: 'var in loop — buttons all say last value',
    tags: ['closure', 'var', 'loop', 'dom'],
    description: 'All 5 buttons alert "Button 5" instead of their own number. Fix it.',
    brokenCode: `for (var i = 1; i <= 5; i++) {
  const btn = document.createElement('button');
  btn.textContent = \`Button \${i}\`;
  btn.onclick = function() {
    alert(\`Button \${i}\`);
  };
  document.body.appendChild(btn);
}`,
    bugDescription: 'var i is shared across all closures. By the time any button is clicked, i = 6 (loop finished).',
    fixedCode: `// Fix 1: Use let (creates new binding per iteration)
for (let i = 1; i <= 5; i++) {
  const btn = document.createElement('button');
  btn.textContent = \`Button \${i}\`;
  btn.onclick = function() {
    alert(\`Button \${i}\`);
  };
  document.body.appendChild(btn);
}

// Fix 2: Use data attribute
for (var i = 1; i <= 5; i++) {
  const btn = document.createElement('button');
  btn.textContent = \`Button \${i}\`;
  btn.dataset.num = i;
  btn.onclick = function() {
    alert(\`Button \${this.dataset.num}\`);
  };
  document.body.appendChild(btn);
}`,
    explanation: 'The simplest fix is let instead of var. let creates a new binding for each loop iteration, so each closure captures its own i.',
    keyInsight: 'This is the #1 most common closure bug in interviews. The fix: use let, or capture value in a data attribute.'
  },
  {
    id: 701, cat: 'Closure Traps', difficulty: 'medium',
    title: 'Stale closure in React useEffect',
    tags: ['closure', 'react', 'stale', 'useeffect'],
    description: 'The counter always logs 0 even after being incremented. This is a stale closure bug. Fix it.',
    brokenCode: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count); // always logs 0!
      setCount(count + 1); // always sets to 1!
    }, 1000);
    return () => clearInterval(interval);
  }, []); // empty deps — closes over initial count=0

  return <div>{count}</div>;
}`,
    bugDescription: 'The effect captures count=0 at mount. The empty dep array means it never re-runs. The interval always uses the stale count=0.',
    fixedCode: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fix 1: Use functional update (doesn't need count from closure)
      setCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []); // safe now — no stale closure

  // Fix 2 (if you need to read count): add to deps
  // useEffect(() => { ... }, [count]); — but this restarts interval each update

  return <div>{count}</div>;
}`,
    explanation: 'Functional updates (setCount(prev => prev + 1)) don\'t need to read the current state from closure — React provides the latest value as the argument.',
    keyInsight: 'Stale closures in React: use functional state updates or add the variable to useEffect dependencies.'
  },
  {
    id: 702, cat: 'Closure Traps', difficulty: 'hard',
    title: 'Memoization closure caching wrong scope',
    tags: ['closure', 'memoization', 'cache'],
    description: 'This memoize function has a bug — all memoized functions share the same cache. Fix it.',
    brokenCode: `const cache = {};

function memoize(fn) {
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const double = memoize(x => x * 2);
const triple = memoize(x => x * 3);

console.log(double(5)); // 10
console.log(triple(5)); // should be 15, but gets 10 from shared cache!`,
    bugDescription: 'cache is declared outside memoize — all memoized functions share one global cache. double(5)=10 gets cached, triple(5) finds cache[5]=10 and returns it.',
    fixedCode: `function memoize(fn) {
  const cache = {}; // each memoized fn gets its OWN cache

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const double = memoize(x => x * 2);
const triple = memoize(x => x * 3);

console.log(double(5)); // 10 ✓
console.log(triple(5)); // 15 ✓`,
    explanation: 'Moving cache inside memoize creates a fresh cache per call via closure. Each memoized function closes over its own private cache object.',
    keyInsight: 'Closures for encapsulation: state declared inside a factory function belongs exclusively to each returned function.'
  },
  {
    id: 703, cat: 'Closure Traps', difficulty: 'medium',
    title: 'Private variable accidentally exposed',
    tags: ['closure', 'encapsulation', 'module'],
    description: 'The _balance variable is supposed to be private but can be accessed directly. Fix the encapsulation.',
    brokenCode: `function createWallet(initial) {
  let _balance = initial;

  return {
    _balance,  // accidentally exposed!
    deposit(amount) { _balance += amount; },
    withdraw(amount) { _balance -= amount; },
    getBalance() { return _balance; }
  };
}

const w = createWallet(100);
w.deposit(50);
console.log(w._balance); // 100 — stale! Not 150
console.log(w.getBalance()); // 150`,
    bugDescription: 'return { _balance } copies the VALUE of _balance at creation time into the object. It\'s not a live reference — it\'s just a public property set to 100.',
    fixedCode: `function createWallet(initial) {
  let _balance = initial; // truly private

  return {
    // Don't expose _balance at all
    deposit(amount) { _balance += amount; },
    withdraw(amount) { _balance -= amount; },
    getBalance() { return _balance; } // controlled access
  };
}

const w = createWallet(100);
w.deposit(50);
console.log(w._balance);   // undefined — truly private ✓
console.log(w.getBalance()); // 150 ✓`,
    explanation: 'Returning { _balance } copies the primitive value, creating a stale snapshot. The fix is to simply not expose it — only expose methods that access it via closure.',
    keyInsight: 'Closures provide true privacy. To keep a variable private, don\'t include it in the returned object — only expose methods that read/write it.'
  },

  // ─── EVENT LOOP TRAPS ────────────────────────────────────────────────
  {
    id: 800, cat: 'Event Loop Traps', difficulty: 'medium',
    title: 'UI update blocked by sync code',
    tags: ['event-loop', 'blocking', 'ui', 'performance'],
    description: 'The "Loading..." text never appears — the UI freezes until processing is done. Fix it without Web Workers.',
    brokenCode: `button.onclick = function() {
  status.textContent = 'Loading...';

  // Heavy synchronous computation
  const result = processMillionItems(data);

  status.textContent = 'Done: ' + result;
};`,
    bugDescription: 'The browser can\'t repaint between the textContent assignments because JS is single-threaded. The sync computation blocks the event loop — the UI freezes.',
    fixedCode: `button.onclick = function() {
  status.textContent = 'Loading...';

  // Yield to browser with setTimeout(0) to allow repaint
  setTimeout(() => {
    const result = processMillionItems(data);
    status.textContent = 'Done: ' + result;
  }, 0);
};

// Better for truly heavy work: use Web Worker
// const worker = new Worker('worker.js');
// worker.postMessage(data);
// worker.onmessage = e => status.textContent = 'Done: ' + e.data;`,
    explanation: 'setTimeout(0) yields control back to the browser event loop, allowing it to repaint ("Loading...") before resuming the heavy computation.',
    keyInsight: 'setTimeout(0) yields to the browser for repaints. For genuinely heavy computation, use Web Workers to avoid blocking the main thread entirely.'
  },
  {
    id: 801, cat: 'Event Loop Traps', difficulty: 'hard',
    title: 'Microtask starvation — UI never updates',
    tags: ['event-loop', 'microtask', 'starvation'],
    description: 'This recursive Promise chain starves the event loop. The UI never updates. Explain why and fix it.',
    brokenCode: `function infiniteLoop() {
  return Promise.resolve().then(() => infiniteLoop());
}

infiniteLoop();
// The UI is now completely frozen`,
    bugDescription: 'Microtasks drain completely before any macrotask (including repaints). A self-perpetuating Promise chain fills the microtask queue infinitely — the browser never gets to paint.',
    fixedCode: `// Fix: Use setTimeout to yield to macrotask queue
function loop() {
  setTimeout(() => {
    doSomeWork();
    loop(); // re-schedule as macrotask, not microtask
  }, 0);
}

loop();
// Browser can now repaint between iterations

// Even better: requestAnimationFrame for visual updates
function animationLoop() {
  doVisualUpdate();
  requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);`,
    explanation: 'Recursive Promises create an infinite microtask chain. Since microtasks drain before repaints, the browser is stuck. setTimeout re-schedules as a macrotask, letting the browser breathe.',
    keyInsight: 'Infinite microtask chains starve the browser. Use setTimeout/rAF for loops that should yield to the renderer.'
  },
  {
    id: 802, cat: 'Event Loop Traps', difficulty: 'medium',
    title: 'setTimeout inside a loop — all fire at once',
    tags: ['event-loop', 'settimeout', 'loop', 'timing'],
    description: 'Supposed to log 1, 2, 3 with 1 second between each. Instead all three log at nearly the same time after 1 second. Fix it.',
    brokenCode: `for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 1000);
}`,
    bugDescription: 'All three timeouts are scheduled at the same time with the same 1000ms delay. They all fire together after 1 second.',
    fixedCode: `// Fix: multiply delay by iteration index
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), i * 1000);
}
// Logs: 1 at 1s, 2 at 2s, 3 at 3s

// Alternative: async/await with a sleep helper
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function logSequentially() {
  for (let i = 1; i <= 3; i++) {
    await sleep(1000);
    console.log(i);
  }
}`,
    explanation: 'Multiplying the delay (i * 1000) staggers the timers: 1000ms, 2000ms, 3000ms. The async/await version is cleaner and easier to read.',
    keyInsight: 'setTimeout delay is relative to when it\'s scheduled, not the previous timer. Stagger delays manually or use async/await with a sleep helper.'
  },

  // ─── FIX THE CODE ────────────────────────────────────────────────────
  {
    id: 900, cat: 'Fix the Code', difficulty: 'easy',
    title: 'Deep clone breaks with JSON.stringify',
    tags: ['clone', 'json', 'date', 'undefined'],
    description: 'This deep clone function loses Date objects, undefined values, and functions. Fix it.',
    brokenCode: `function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const original = {
  name: 'Alice',
  born: new Date('1990-01-01'),
  score: undefined,
  greet: () => 'hello'
};

const clone = deepClone(original);
console.log(clone.born instanceof Date); // false! It's a string
console.log('score' in clone);           // false! undefined dropped
console.log(clone.greet);               // undefined! function dropped`,
    bugDescription: 'JSON.stringify drops undefined and functions, converts Dates to strings. The clone is incomplete.',
    fixedCode: `// Fix: Use structuredClone (modern, handles most types)
function deepClone(obj) {
  return structuredClone(obj);
}

// structuredClone handles: Dates, Arrays, Maps, Sets, Blobs
// Still doesn't handle: functions, class instances, DOM nodes

// For functions too — use a recursive approach or lodash cloneDeep:
// import cloneDeep from 'lodash/cloneDeep';`,
    explanation: 'structuredClone is the modern built-in that handles Dates, Maps, Sets, etc. It still doesn\'t clone functions (they\'re not serializable) but handles most real-world cases.',
    keyInsight: 'JSON.parse/stringify is lossy. Use structuredClone() for modern deep cloning. Use lodash cloneDeep if you need to handle edge cases like functions.'
  },
  {
    id: 901, cat: 'Fix the Code', difficulty: 'medium',
    title: 'this lost in event listener',
    tags: ['this', 'event-listener', 'class', 'bind'],
    description: 'The click handler logs undefined for this.name. Fix it so it correctly references the class instance.',
    brokenCode: `class Modal {
  constructor(name) {
    this.name = name;
    document.getElementById('close')
      .addEventListener('click', this.close);
  }

  close() {
    console.log(\`Closing \${this.name}\`); // this.name is undefined!
    this.remove();
  }
}`,
    bugDescription: 'addEventListener calls close as a plain function, losing the Modal instance as this. this becomes the button element (or undefined in strict mode).',
    fixedCode: `class Modal {
  constructor(name) {
    this.name = name;
    // Fix 1: bind in constructor
    document.getElementById('close')
      .addEventListener('click', this.close.bind(this));
  }

  close() {
    console.log(\`Closing \${this.name}\`); // works ✓
    this.remove();
  }
}

// Fix 2: Arrow function class field (auto-binds)
class Modal {
  constructor(name) { this.name = name; }

  close = () => {  // arrow class field
    console.log(\`Closing \${this.name}\`); // always correct this ✓
  }
}`,
    explanation: '.bind(this) creates a new function with this permanently set. Arrow class fields (close = () => {}) are auto-bound to the instance and are the modern preferred approach.',
    keyInsight: 'Event listener callbacks lose this. Fix: .bind(this) in constructor, or arrow function class fields (the modern way).'
  },
  {
    id: 902, cat: 'Fix the Code', difficulty: 'medium',
    title: 'Object mutation in array map',
    tags: ['mutation', 'map', 'shallow-copy', 'immutability'],
    description: 'This update function mutates the original array. Fix it to return a new array without mutating.',
    brokenCode: `function updateUserAge(users, userId, newAge) {
  return users.map(user => {
    if (user.id === userId) {
      user.age = newAge; // MUTATES the original!
      return user;
    }
    return user;
  });
}

const users = [{ id: 1, name: 'Alice', age: 25 }];
const updated = updateUserAge(users, 1, 26);
console.log(users[0].age); // 26 — original mutated!`,
    bugDescription: 'user.age = newAge directly mutates the original object. Even though map returns a new array, the objects inside are still references to the originals.',
    fixedCode: `function updateUserAge(users, userId, newAge) {
  return users.map(user => {
    if (user.id === userId) {
      return { ...user, age: newAge }; // new object, not mutation
    }
    return user;
  });
}

const users = [{ id: 1, name: 'Alice', age: 25 }];
const updated = updateUserAge(users, 1, 26);
console.log(users[0].age);   // 25 — original unchanged ✓
console.log(updated[0].age); // 26 — new array updated ✓`,
    explanation: 'Spread { ...user, age: newAge } creates a new object. map returns a new array. Neither the original array nor its objects are touched.',
    keyInsight: 'map creates a new array but doesn\'t deep-clone the elements. Always spread to create new objects when updating: { ...obj, changedProp: newVal }.'
  },
  {
    id: 903, cat: 'Fix the Code', difficulty: 'hard',
    title: 'Prototype pollution vulnerability',
    tags: ['prototype', 'security', 'merge'],
    description: 'This merge function has a prototype pollution vulnerability. An attacker can inject properties into Object.prototype. Fix it.',
    brokenCode: `function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Attack:
merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
console.log({}.isAdmin); // true — every object is now an admin!`,
    bugDescription: '__proto__ is a special property. Setting target["__proto__"] doesn\'t create an own property — it modifies Object.prototype, polluting all objects.',
    fixedCode: `function merge(target, source) {
  for (const key of Object.keys(source)) { // own keys only
    // Block dangerous keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Or use structuredClone + Object.assign for safe merging`,
    explanation: 'Block __proto__, constructor, and prototype keys explicitly. Use Object.keys() instead of for...in to iterate own properties only.',
    keyInsight: 'Prototype pollution: __proto__ assignment modifies Object.prototype. Always sanitize keys when merging user-controlled objects.'
  },

  // ─── WHAT'S WRONG? ───────────────────────────────────────────────────
  {
    id: 1000, cat: "What's Wrong?", difficulty: 'easy',
    title: 'Accidental global variable',
    tags: ['scope', 'strict-mode', 'global'],
    description: 'This function accidentally creates a global variable. What\'s wrong and how do you fix it?',
    brokenCode: `function calculateTotal(items) {
  total = 0; // forgot let/const/var!
  items.forEach(item => {
    total += item.price;
  });
  return total;
}

calculateTotal([{ price: 10 }, { price: 20 }]);
console.log(window.total); // 30 — leaked to global!`,
    bugDescription: 'Assigning to total without declaring it creates an implicit global variable (window.total in browsers). This can cause bugs if called multiple times or in parallel.',
    fixedCode: `function calculateTotal(items) {
  let total = 0; // properly declared
  items.forEach(item => {
    total += item.price;
  });
  return total;
}

// Better: use reduce
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Enable strict mode to catch this at runtime:
// 'use strict'; — throws ReferenceError on undeclared assignment`,
    explanation: 'Always declare variables. "use strict" makes implicit globals throw a ReferenceError, catching this at runtime. ESLint catches it statically.',
    keyInsight: 'Forgot let/const/var = implicit global. "use strict" turns this into a ReferenceError. Always use a linter.'
  },
  {
    id: 1001, cat: "What's Wrong?", difficulty: 'medium',
    title: 'Wrong comparison with NaN',
    tags: ['nan', 'isnan', 'comparison'],
    description: 'The isInvalid function never returns true for NaN inputs. What\'s wrong?',
    brokenCode: `function isInvalid(value) {
  if (value === NaN || value === undefined || value === null) {
    return true;
  }
  return false;
}

console.log(isInvalid(NaN));       // false — BUG!
console.log(isInvalid(undefined)); // true
console.log(isInvalid(null));      // true`,
    bugDescription: 'NaN is the only value in JS not equal to itself. value === NaN is ALWAYS false, for any value including NaN itself.',
    fixedCode: `function isInvalid(value) {
  if (Number.isNaN(value) || value === undefined || value === null) {
    return true;
  }
  return false;
}

// Cleaner version:
const isInvalid = (value) =>
  value == null || Number.isNaN(value);
// value == null catches both null and undefined (loose equality)

console.log(isInvalid(NaN));       // true ✓
console.log(isInvalid(undefined)); // true ✓
console.log(isInvalid(null));      // true ✓`,
    explanation: 'Use Number.isNaN() to check for NaN — it\'s the only reliable method. value == null (loose equality) catches both null and undefined at once.',
    keyInsight: 'NaN !== NaN always. Use Number.isNaN(). And value == null catches both null AND undefined.'
  },
  {
    id: 1002, cat: "What's Wrong?", difficulty: 'hard',
    title: 'Infinite re-render in React useEffect',
    tags: ['react', 'useeffect', 'deps', 'infinite-loop'],
    description: 'This React component causes an infinite loop of re-renders. What\'s wrong?',
    brokenCode: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const options = { include: 'posts' }; // new object every render!

  useEffect(() => {
    fetchUser(userId, options).then(setUser);
  }, [userId, options]); // options changes every render!

  return <div>{user?.name}</div>;
}`,
    bugDescription: 'options is a new object on every render. useEffect sees a new options reference each time, triggers the effect, which sets state, which re-renders, which creates a new options... infinite loop.',
    fixedCode: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // Fix 1: Move constant outside component
  // const options = { include: 'posts' }; // outside component

  // Fix 2: useMemo to stabilize the reference
  const options = useMemo(() => ({ include: 'posts' }), []);

  // Fix 3: Just inline the values (often simplest)
  useEffect(() => {
    fetchUser(userId, { include: 'posts' }).then(setUser);
  }, [userId]); // stable deps only

  return <div>{user?.name}</div>;
}`,
    explanation: 'Objects/arrays created inside components get new references on each render. useEffect compares deps by reference. Inline the primitive values, use useMemo for objects, or move constants outside the component.',
    keyInsight: 'Objects in useEffect deps = infinite loops. useEffect uses Object.is (reference equality). Stabilize with useMemo or move outside component.'
  },
  {
    id: 1003, cat: "What's Wrong?", difficulty: 'medium',
    title: 'Array sort mutates original',
    tags: ['array', 'sort', 'mutation', 'immutability'],
    description: 'The getSorted function is supposed to return a sorted copy without modifying the original. But it mutates it. Fix it.',
    brokenCode: `function getSorted(arr) {
  return arr.sort((a, b) => a - b);
}

const nums = [3, 1, 4, 1, 5];
const sorted = getSorted(nums);
console.log(nums);   // [1, 1, 3, 4, 5] — mutated!
console.log(sorted); // [1, 1, 3, 4, 5]`,
    bugDescription: 'Array.prototype.sort() sorts IN PLACE and returns the same array reference. It doesn\'t create a copy.',
    fixedCode: `function getSorted(arr) {
  return [...arr].sort((a, b) => a - b); // spread to copy first
}

// Or with toSorted() (ES2023, immutable):
function getSorted(arr) {
  return arr.toSorted((a, b) => a - b);
}

const nums = [3, 1, 4, 1, 5];
const sorted = getSorted(nums);
console.log(nums);   // [3, 1, 4, 1, 5] — unchanged ✓
console.log(sorted); // [1, 1, 3, 4, 5] ✓`,
    explanation: 'Always copy before sorting: [...arr].sort() or arr.slice().sort(). ES2023 adds toSorted() as an immutable alternative built-in.',
    keyInsight: 'sort() mutates in place. Always [...arr].sort() to avoid mutation. toSorted() is the new immutable version (ES2023).'
  },
]

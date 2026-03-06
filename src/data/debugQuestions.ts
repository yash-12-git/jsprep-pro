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

  // ─── ASYNC BUGS ──────────────────────────────────────────────────────────
  {
    id: 1100, cat: 'Async Bugs', difficulty: 'medium',
    title: 'Not handling fetch HTTP errors',
    tags: ['fetch', 'response-ok', 'error-handling'],
    description: 'This function always logs the data even on 404s or 500s. It should throw on non-OK responses. Fix it.',
    brokenCode: `async function getUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    const data = await res.json();
    console.log('Got user:', data);
    return data;
  } catch (err) {
    console.error('Network error:', err);
    return null;
  }
}`,
    bugDescription: 'fetch() only rejects on network failure. HTTP 404/500 responses are "successful" — res.json() returns the error body and the catch never runs.',
    fixedCode: `async function getUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    }
    const data = await res.json();
    console.log('Got user:', data);
    return data;
  } catch (err) {
    console.error('Request failed:', err);
    return null;
  }
}`,
    explanation: 'Always check res.ok after fetch. It\'s false for 4xx and 5xx responses. Throw a meaningful error so the catch block handles all failures — network AND HTTP errors.',
    keyInsight: 'fetch() resolves for ANY HTTP response. Only network failures (no connection, DNS fail) cause rejection. Always check res.ok.'
  },
  {
    id: 1101, cat: 'Async Bugs', difficulty: 'hard',
    title: 'Async iterator not properly cleaned up',
    tags: ['async-generator', 'return', 'cleanup'],
    description: 'This paginator leaks an open request if the consumer breaks early. Fix it to handle early termination.',
    brokenCode: `async function* paginate(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page++}\`);
    const { items, hasMore } = await res.json();
    for (const item of items) yield item;
    if (!hasMore) return;
  }
}

// Consumer breaks early
async function getFirst5(url) {
  const results = [];
  for await (const item of paginate(url)) {
    results.push(item);
    if (results.length === 5) break; // early break — generator may not clean up
  }
  return results;
}`,
    bugDescription: 'When for...of breaks early, the generator\'s return() method is called. Without try/finally, in-flight fetches or open connections aren\'t cancelled.',
    fixedCode: `async function* paginate(url) {
  const controller = new AbortController();
  let page = 1;

  try {
    while (true) {
      const res = await fetch(\`\${url}?page=\${page++}\`, {
        signal: controller.signal
      });
      const { items, hasMore } = await res.json();
      for (const item of items) yield item;
      if (!hasMore) return;
    }
  } finally {
    // Runs on break, return, or throw — cancels in-flight request
    controller.abort();
    console.log('Paginator cleaned up');
  }
}`,
    explanation: 'When for...of breaks early, the generator\'s return() is called, which runs the finally block. Using AbortController with the signal allows cancellation of in-flight fetch requests.',
    keyInsight: 'try/finally in generators is the cleanup mechanism. Always pair long-running async generators with finally to close connections, cancel requests, or release resources.'
  },
  {
    id: 1102, cat: 'Async Bugs', difficulty: 'medium',
    title: 'setInterval accumulates — not cleared on re-render',
    tags: ['setinterval', 'memory-leak', 'cleanup'],
    description: 'Every time startPolling() is called, a new interval is created but old ones are never cleared. Fix the leak.',
    brokenCode: `class DataPoller {
  constructor(url) {
    this.url = url;
    this.data = null;
  }

  startPolling(interval = 1000) {
    setInterval(async () => {
      const res = await fetch(this.url);
      this.data = await res.json();
      console.log('Updated:', this.data);
    }, interval);
  }

  stopPolling() {
    // ??? — no way to stop it
  }
}

const poller = new DataPoller('/api/status');
poller.startPolling(); // interval #1
poller.startPolling(); // interval #2 — #1 still running!`,
    bugDescription: 'setInterval returns an ID needed for clearInterval. Without storing it, you can never cancel the interval. Each startPolling() call piles up another interval.',
    fixedCode: `class DataPoller {
  constructor(url) {
    this.url = url;
    this.data = null;
    this._intervalId = null;
  }

  startPolling(interval = 1000) {
    this.stopPolling(); // clear any existing interval first
    this._intervalId = setInterval(async () => {
      const res = await fetch(this.url);
      this.data = await res.json();
      console.log('Updated:', this.data);
    }, interval);
  }

  stopPolling() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }
}`,
    explanation: 'Store the interval ID and clear it before creating a new one. stopPolling() uses the stored ID to call clearInterval. Guards with !== null for safety.',
    keyInsight: 'Every setInterval must have a corresponding clearInterval. Always store the ID. Clear before re-creating to avoid accumulating intervals.'
  },

  // ─── CLOSURE TRAPS ───────────────────────────────────────────────────────
  {
    id: 1103, cat: 'Closure Traps', difficulty: 'medium',
    title: 'Generator losing this context',
    tags: ['generator', 'this', 'method'],
    description: 'The generator method loses its class instance as "this". Fix it.',
    brokenCode: `class NumberRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  }
}

const range = new NumberRange(1, 5);
const iter = range[Symbol.iterator];  // extracted — no object
const standalone = iter.bind(range);  // attempting to bind

// Calling as method works:
console.log([...range].join(', '));

// But this fails:
try {
  iter(); // called without 'range' as this
} catch(e) {
  console.log(e.constructor.name);
}`,
    bugDescription: 'Generator methods lose "this" when extracted. iter() is called without the range object, so this.start and this.end are undefined.',
    fixedCode: `class NumberRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  *[Symbol.iterator]() {
    // Capture this in the outer scope for safety
    const { start, end } = this;
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }
}

// ✅ Correct usage: iterate through the object, not the extracted method
const range = new NumberRange(1, 5);
console.log([...range].join(', ')); // 1, 2, 3, 4, 5

// If you need to pass the iterator around:
const boundIter = range[Symbol.iterator].bind(range);
// or: () => range[Symbol.iterator]()`,
    explanation: 'Generator methods have the same "this" rules as regular methods. Destructuring {start, end} from this early makes the generator body independent of this binding.',
    keyInsight: 'Generator methods lose "this" when extracted from their object. Destructure needed properties at the start of the generator to avoid this dependency.'
  },
  {
    id: 1104, cat: 'Closure Traps', difficulty: 'hard',
    title: 'Default parameter function creates new closure each call',
    tags: ['default-params', 'closure', 'identity'],
    description: 'The cache check never hits because the default callback is a new function reference every call. Fix it.',
    brokenCode: `const cache = new WeakMap();

function process(data, transform = (x) => x * 2) {
  if (cache.has(transform)) {
    console.log('cache hit');
    return cache.get(transform)(data);
  }
  console.log('cache miss');
  cache.set(transform, transform);
  return transform(data);
}

process(5); // cache miss
process(5); // cache miss again — different transform reference!
process(5); // always miss`,
    bugDescription: 'Default parameter (x) => x * 2 creates a NEW function object every time process() is called without a transform. Each call has a unique reference — WeakMap never finds it.',
    fixedCode: `// Define the default OUTSIDE the function — same reference always
const defaultTransform = (x) => x * 2;
const cache = new WeakMap();

function process(data, transform = defaultTransform) {
  if (cache.has(transform)) {
    console.log('cache hit');
    return cache.get(transform)(data);
  }
  console.log('cache miss');
  cache.set(transform, transform);
  return transform(data);
}

process(5); // cache miss
process(5); // cache hit — same defaultTransform reference
process(5, x => x * 3); // cache miss (new function provided)`,
    explanation: 'Default parameter expressions are evaluated fresh on each call — each evaluation creates a new function object with a new reference. Moving the default outside ensures a stable reference across calls.',
    keyInsight: 'Default parameter expressions are re-evaluated on every call. If identity (===) matters (for caching, WeakMap keys, memoization), define constants outside the function.'
  },
  {
    id: 1105, cat: 'Closure Traps', difficulty: 'medium',
    title: 'Incorrect mutable default object in parameter',
    tags: ['default-params', 'mutation', 'reference'],
    description: 'Adding to the default tags array affects ALL subsequent calls without a tags argument. Fix it.',
    brokenCode: `// Anti-pattern inherited from Python thinking
const DEFAULT_CONFIG = { tags: [] };

function createPost(title, config = DEFAULT_CONFIG) {
  config.tags.push('auto-tagged');
  return { title, ...config };
}

const p1 = createPost('Hello');
const p2 = createPost('World');

console.log(p1.tags);
console.log(p2.tags);`,
    bugDescription: 'DEFAULT_CONFIG is a shared mutable object. config.tags.push() mutates the shared tags array. p2 inherits all mutations from p1\'s call.',
    fixedCode: `function createPost(title, config = {}) {
  // Create a new config by merging defaults with provided config
  const finalConfig = {
    tags: [],
    category: 'uncategorized',
    ...config,
    tags: [...(config.tags || [])] // shallow copy of tags array
  };
  finalConfig.tags.push('auto-tagged');
  return { title, ...finalConfig };
}

// Or even simpler with destructuring defaults:
function createPost(title, { tags = [], category = 'uncategorized' } = {}) {
  return { title, tags: [...tags, 'auto-tagged'], category };
}`,
    explanation: 'Using a shared mutable object as a default value causes state to accumulate across calls. Use {} as the default and create fresh arrays/objects inside the function using spread.',
    keyInsight: 'Never use mutable objects/arrays as default parameter values if you mutate them. The default is evaluated once and shared — use {} and create new objects inside.'
  },

  // ─── EVENT LOOP TRAPS ────────────────────────────────────────────────────
  {
    id: 1106, cat: 'Event Loop Traps', difficulty: 'hard',
    title: 'Generator function called synchronously inside Promise',
    tags: ['generator', 'promise', 'async-iteration'],
    description: 'This tries to use a generator as if it were async but the results are Promises, not values. Fix it.',
    brokenCode: `function* fetchUsers(ids) {
  for (const id of ids) {
    yield fetch(\`/api/users/\${id}\`).then(r => r.json());
    // ^^^ yields a Promise, not the resolved value
  }
}

async function getAll(ids) {
  const users = [];
  for (const result of fetchUsers(ids)) {
    users.push(result); // result is a Promise, not a user!
  }
  return users; // array of Promises ❌
}`,
    bugDescription: 'Regular generators can\'t await — yield hands back whatever you give it, including unresolved Promises. The consumer receives Promises, not user data.',
    fixedCode: `// Fix 1: async generator (use for await...of)
async function* fetchUsers(ids) {
  for (const id of ids) {
    const user = await fetch(\`/api/users/\${id}\`).then(r => r.json());
    yield user; // yield resolved value
  }
}

async function getAll(ids) {
  const users = [];
  for await (const user of fetchUsers(ids)) {
    users.push(user); // ✅ actual user objects
  }
  return users;
}

// Fix 2: parallel (faster)
async function getAllParallel(ids) {
  return Promise.all(ids.map(id =>
    fetch(\`/api/users/\${id}\`).then(r => r.json())
  ));
}`,
    explanation: 'Regular generators are synchronous. To yield resolved async values, you need an async generator (async function*), consumed with for await...of.',
    keyInsight: 'Regular generator + async work = yields Promises. Async generator = yields resolved values. Always use async function* with for await...of for async iteration.'
  },
  {
    id: 1107, cat: 'Event Loop Traps', difficulty: 'medium',
    title: 'Mixing microtasks and DOM updates',
    tags: ['microtask', 'dom', 'rendering', 'settimeout'],
    description: '"Loading..." never visually appears — the DOM update and heavy work both happen before the browser can paint. Fix it.',
    brokenCode: `async function processData(data) {
  statusEl.textContent = 'Loading...'; // DOM write

  // Immediately await a microtask — still blocks render!
  await Promise.resolve();

  const result = heavyComputation(data); // blocks for 2 seconds
  statusEl.textContent = 'Done: ' + result;
}`,
    bugDescription: 'Promise.resolve() is a microtask — it runs before the browser has a chance to render. The repaint is still blocked by the heavy computation that runs right after.',
    fixedCode: `async function processData(data) {
  statusEl.textContent = 'Loading...';

  // setTimeout(0) = macrotask — yields to the browser's render phase
  await new Promise(resolve => setTimeout(resolve, 0));

  // Now the browser has had a chance to paint "Loading..."
  const result = heavyComputation(data);
  statusEl.textContent = 'Done: ' + result;
}

// Even better: use requestAnimationFrame to align with render
async function processDataRaf(data) {
  statusEl.textContent = 'Loading...';
  await new Promise(resolve => requestAnimationFrame(resolve));
  const result = heavyComputation(data);
  statusEl.textContent = 'Done: ' + result;
}`,
    explanation: 'Microtasks (Promise.resolve) run before the browser paint. To yield for rendering, use setTimeout(0) which is a macrotask — the browser gets a render frame between macrotasks.',
    keyInsight: 'To yield to the browser render phase, use setTimeout(0) or requestAnimationFrame — NOT Promise.resolve(). Microtasks drain before any painting occurs.'
  },

  // ─── FIX THE CODE ────────────────────────────────────────────────────────
  {
    id: 1108, cat: 'Fix the Code', difficulty: 'medium',
    title: 'Proxy trap modifies original object directly',
    tags: ['proxy', 'reflect', 'trap'],
    description: 'The validation proxy directly modifies the target instead of using Reflect, breaking getters and prototype methods. Fix it.',
    brokenCode: `function createValidated(obj, schema) {
  return new Proxy(obj, {
    set(target, prop, value) {
      if (schema[prop] && typeof value !== schema[prop]) {
        throw new TypeError(\`\${prop} must be \${schema[prop]}\`);
      }
      target[prop] = value; // directly writing — misses setters!
      return true;
    },
    get(target, prop) {
      return target[prop]; // directly reading — misses getters!
    }
  });
}

class User {
  get displayName() { return 'User: ' + this._name; }
  set name(v) { this._name = v.trim(); }
}

const u = new User();
const validated = createValidated(u, { _name: 'string' });
validated.name = '  Alice  '; // setter should trim — but doesn't!`,
    bugDescription: 'target[prop] = value bypasses setter methods on the prototype. target[prop] for get bypasses getter methods. Always use Reflect inside Proxy traps.',
    fixedCode: `function createValidated(obj, schema) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      if (schema[prop] && typeof value !== schema[prop]) {
        throw new TypeError(\`\${prop} must be \${schema[prop]}\`);
      }
      // Reflect.set correctly handles prototype setters and receiver
      return Reflect.set(target, prop, value, receiver);
    },
    get(target, prop, receiver) {
      // Reflect.get correctly handles prototype getters and receiver
      return Reflect.get(target, prop, receiver);
    }
  });
}

const u = new User();
const validated = createValidated(u, { _name: 'string' });
validated.name = '  Alice  '; // setter trims: _name = 'Alice' ✓
console.log(validated.displayName); // 'User: Alice' ✓`,
    explanation: 'Reflect methods are designed to work correctly with prototype chains, getters/setters, and the receiver (this). Using target[prop] directly bypasses the prototype.',
    keyInsight: 'Always use Reflect.get/set/has/deleteProperty inside Proxy traps. They handle the receiver correctly, making getters and setters work as expected.'
  },
  {
    id: 1109, cat: 'Fix the Code', difficulty: 'hard',
    title: 'WeakMap key stored as primitive — cannot be set',
    tags: ['weakmap', 'primitive', 'key'],
    description: 'The per-user cache uses user IDs (numbers) as WeakMap keys, which throws. Fix the data structure choice.',
    brokenCode: `const userCache = new WeakMap();

function cacheUserData(userId, data) {
  // userId is a number — WeakMap keys must be objects!
  userCache.set(userId, data); // TypeError!
  return data;
}

function getUserData(userId) {
  return userCache.get(userId);
}

cacheUserData(42, { name: 'Alice' });`,
    bugDescription: 'WeakMap only accepts objects (or registered symbols) as keys. Primitives like numbers, strings, booleans throw TypeError.',
    fixedCode: `// Option 1: Use a regular Map (if userId is a primitive)
const userCache = new Map();

function cacheUserData(userId, data) {
  userCache.set(userId, data); // ✅ Map accepts any key type
  return data;
}

// Option 2: Use WeakMap keyed by the user OBJECT (not its ID)
const userObjCache = new WeakMap();

function cacheUser(userObj, computedData) {
  userObjCache.set(userObj, computedData); // userObj is an object ✓
  return computedData;
}

// Option 3: If you need number IDs and auto-cleanup, wrap in an object
const keyRegistry = new Map(); // id → wrapper object
function getKey(id) {
  if (!keyRegistry.has(id)) keyRegistry.set(id, { id });
  return keyRegistry.get(id);
}
const cache = new WeakMap();
cache.set(getKey(42), { name: 'Alice' });`,
    explanation: 'WeakMap requires object keys so it can hold weak references (GC can collect them). Primitives are not GC\'d — they don\'t need weak references. Use Map for primitive keys.',
    keyInsight: 'WeakMap keys must be objects. For primitive keys (string, number), use a regular Map. Use WeakMap when the key is an object and you want automatic cleanup when the object is GC\'d.'
  },
  {
    id: 1110, cat: 'Fix the Code', difficulty: 'medium',
    title: 'Custom error loses stack trace',
    tags: ['custom-error', 'extends', 'stack-trace'],
    description: 'The custom error\'s stack trace points to the Error constructor, not the throw site. Fix the class.',
    brokenCode: `class AppError {
  constructor(message, code) {
    this.message = message;
    this.code = code;
    this.name = 'AppError';
    // NOT extending Error — no stack trace, no instanceof Error!
  }
}

try {
  throw new AppError('Something broke', 500);
} catch (e) {
  console.log(e instanceof Error);  // false!
  console.log(e.stack);             // undefined!
  console.log(e.name);              // 'AppError'
}`,
    bugDescription: 'AppError doesn\'t extend Error, so it has no stack property, fails instanceof Error checks, and won\'t be caught by catch clauses that check instanceof Error.',
    fixedCode: `class AppError extends Error {
  constructor(message, code) {
    super(message);              // ✅ sets .message and .stack
    this.name = 'AppError';      // ✅ override default 'Error'
    this.code = code;

    // V8-specific: captures stack from HERE not from Error constructor
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Specific subtypes
class NotFoundError extends AppError {
  constructor(resource) {
    super(\`\${resource} not found\`, 404);
    this.name = 'NotFoundError';
  }
}

try {
  throw new NotFoundError('User');
} catch (e) {
  console.log(e instanceof Error);     // true ✓
  console.log(e instanceof AppError);  // true ✓
  console.log(e.name);                 // 'NotFoundError'
  console.log(e.message);              // 'User not found'
  console.log(typeof e.stack);         // 'string' ✓
}`,
    explanation: 'Always extend Error for custom errors. super(message) sets .message and .stack. Set this.name manually because it defaults to "Error". Error.captureStackTrace makes the stack start at the throw site.',
    keyInsight: 'Custom errors MUST extend Error to: get a stack trace, work with instanceof Error, integrate with error monitoring tools, and behave as real errors in try/catch.'
  },
  {
    id: 1111, cat: "What's Wrong?", difficulty: 'medium',
    title: 'Spread only shallow-copies nested arrays',
    tags: ['spread', 'shallow-copy', 'mutation', 'nested'],
    description: 'Sorting a copy of the matrix also sorts the original rows. What\'s wrong and how do you fix it?',
    brokenCode: `function sortMatrixRows(matrix) {
  const copy = [...matrix]; // copy of the outer array
  copy.forEach(row => row.sort((a, b) => a - b));
  return copy;
}

const grid = [[3,1,2],[6,4,5],[9,7,8]];
const sorted = sortMatrixRows(grid);

console.log(sorted[0]); // [1, 2, 3] ✓
console.log(grid[0]);   // [1, 2, 3] — MUTATED! Expected [3, 1, 2]`,
    bugDescription: '[...matrix] creates a new outer array but the inner row arrays are the SAME references. Sorting a row sorts the original row in grid.',
    fixedCode: `function sortMatrixRows(matrix) {
  // Deep copy: spread outer array AND each inner row
  return matrix.map(row => [...row].sort((a, b) => a - b));
}

// Alternative: use structuredClone for any depth
function sortMatrixRowsDeep(matrix) {
  const copy = structuredClone(matrix);
  copy.forEach(row => row.sort((a, b) => a - b));
  return copy;
}

const grid = [[3,1,2],[6,4,5],[9,7,8]];
const sorted = sortMatrixRows(grid);

console.log(sorted[0]); // [1, 2, 3] ✓
console.log(grid[0]);   // [3, 1, 2] ✓ unchanged`,
    explanation: 'Spread is shallow — inner arrays are not copied, just their references. Sort mutates in place, affecting the original. Copy each row individually with [...row] or use structuredClone().',
    keyInsight: 'Spread creates a shallow copy of the TOP-LEVEL container. Nested arrays/objects are still shared references. Deep copy nested structures before mutating them.'
  },
  {
    id: 1112, cat: "What's Wrong?", difficulty: 'hard',
    title: 'Symbol.iterator not returning a fresh iterator',
    tags: ['iterator', 'reusable', 'symbol-iterator'],
    description: 'The iterable can only be iterated once. The second for...of produces nothing. Fix it.',
    brokenCode: `const myIterable = {
  data: [1, 2, 3, 4, 5],
  index: 0, // shared state — BUG!
  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.index < this.data.length) {
          return { value: this.data[this.index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const n of myIterable) console.log(n); // 1 2 3 4 5
for (const n of myIterable) console.log(n); // nothing! index is already 5`,
    bugDescription: 'index is stored on the iterable itself — shared across all iterations. After first loop finishes, index = 5. Second loop starts with index = 5 — immediately returns done.',
    fixedCode: `const myIterable = {
  data: [1, 2, 3, 4, 5],
  [Symbol.iterator]() {
    let index = 0; // fresh state per call — captured in closure
    const data = this.data;
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const n of myIterable) console.log(n); // 1 2 3 4 5
for (const n of myIterable) console.log(n); // 1 2 3 4 5 ✓`,
    explanation: 'Each call to [Symbol.iterator]() must return a FRESH iterator with its own state. Storing index on the iterable object makes all iterations share state. Closure keeps index local per iterator.',
    keyInsight: 'An iterable is reusable; an iterator is single-use. [Symbol.iterator]() must create a new state (closure or object) each time — never shared state on the iterable itself.'
  },
  {
    id: 1113, cat: 'Fix the Code', difficulty: 'hard',
    title: 'Async generator — missing error forwarding',
    tags: ['async-generator', 'throw', 'error-handling'],
    description: 'Errors thrown into the generator via .throw() are not handled. The generator abruptly stops and caller gets unhandled. Fix it.',
    brokenCode: `async function* dataStream() {
  for (let i = 1; i <= 5; i++) {
    await new Promise(r => setTimeout(r, 100));
    yield i;
  }
}

async function consume() {
  const gen = dataStream();
  console.log((await gen.next()).value); // 1
  console.log((await gen.next()).value); // 2

  // Simulate error from consumer side:
  await gen.throw(new Error('Consumer cancelled'));
  // Generator has no try/catch — error propagates to consume()
  // No cleanup happens in the generator
}`,
    bugDescription: 'When gen.throw() is called, the error appears inside the generator at the yield point. Without try/finally in the generator, no cleanup runs.',
    fixedCode: `async function* dataStream() {
  try {
    for (let i = 1; i <= 5; i++) {
      await new Promise(r => setTimeout(r, 100));
      yield i;
    }
  } catch (err) {
    console.log('Generator caught:', err.message);
    // Handle gracefully, or rethrow
  } finally {
    console.log('Generator cleaning up resources');
    // Always runs: close DB connections, unsubscribe, etc.
  }
}

async function consume() {
  const gen = dataStream();
  console.log((await gen.next()).value); // 1
  console.log((await gen.next()).value); // 2

  // throw() sends error into generator at the current yield
  await gen.throw(new Error('Consumer cancelled'));
}`,
    explanation: 'gen.throw(err) sends an error into the generator at its current suspension point. try/catch inside the generator catches it. try/finally ensures cleanup whether the error is caught or not.',
    keyInsight: 'Generators can receive errors via .throw(). Always wrap async generator bodies in try/finally to ensure cleanup when errors are thrown in from outside.'
  },
  {
    id: 1114, cat: "What's Wrong?", difficulty: 'medium',
    title: 'RegExp stateful lastIndex trap with global flag',
    tags: ['regex', 'lastindex', 'global-flag', 'stateful'],
    description: 'This validator alternately returns true and false for the SAME string. What\'s wrong?',
    brokenCode: `const emailRegex = /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/gi;

function isValidEmail(email) {
  return emailRegex.test(email);
}

console.log(isValidEmail('user@example.com')); // true
console.log(isValidEmail('user@example.com')); // false?!
console.log(isValidEmail('user@example.com')); // true again`,
    bugDescription: 'With the g (global) flag, RegExp.test() advances lastIndex after each match. Next call starts from that position — not from 0 — causing it to "fail" and reset lastIndex to 0.',
    fixedCode: `// Fix 1: Remove global flag (not needed for simple test)
const emailRegex = /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i;

function isValidEmail(email) {
  return emailRegex.test(email);
}

// Fix 2: Reset lastIndex before each call
const emailRegexG = /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/gi;
function isValidEmailSafe(email) {
  emailRegexG.lastIndex = 0; // reset before use
  return emailRegexG.test(email);
}

// Fix 3: Create a new regex each call (safest, slight perf cost)
function isValidEmailNew(email) {
  return /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i.test(email);
}

console.log(isValidEmail('user@example.com')); // true
console.log(isValidEmail('user@example.com')); // true ✓`,
    explanation: 'The global (g) flag makes regex stateful via lastIndex. After a successful test(), lastIndex = end of match. Next test() starts there — fails at end of string — resets lastIndex to 0. Alternating true/false.',
    keyInsight: 'Never use the g flag on a shared regex unless using exec() in a loop. For test() and match() with simple checks, omit g or reset lastIndex = 0 before each call.'
  },
  {
    id: 1115, cat: "What's Wrong?", difficulty: 'hard',
    title: 'Service worker not updating — old cache version',
    tags: ['service-worker', 'cache', 'versioning'],
    description: 'After deploying new assets, users still see the old version. The service worker never updates its cache. Fix the caching strategy.',
    brokenCode: `// sw.js
const CACHE_NAME = 'my-cache'; // never changes!

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/index.html', '/app.js', '/styles.css'])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request)
    )
  );
});
// No activate handler — old caches never cleaned up!`,
    bugDescription: 'CACHE_NAME never changes so the install event finds the existing cache — no update. No activate handler means old service workers keep serving stale assets.',
    fixedCode: `// sw.js
const VERSION = 'v2'; // increment on each deploy!
const CACHE_NAME = \`my-cache-\${VERSION}\`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/index.html', '/app.js', '/styles.css'])
    ).then(() => self.skipWaiting()) // activate immediately
  );
});

// Delete old caches on activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME))
      .then(oldKeys => Promise.all(oldKeys.map(key => caches.delete(key))))
      .then(() => self.clients.claim()) // take control of open pages
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});`,
    explanation: 'Version the cache name — new SW gets a new cache. activate handler deletes old caches. skipWaiting + clients.claim ensure the new SW takes over immediately.',
    keyInsight: 'Service worker caching: version your cache name, clean old caches in activate, call skipWaiting() in install and clients.claim() in activate for immediate takeover.'
  },
  {
    id: 1116, cat: 'Fix the Code', difficulty: 'medium',
    title: 'Shadow DOM styles leaking via CSS custom properties',
    tags: ['shadow-dom', 'css-variables', 'encapsulation'],
    description: 'The component author wants to prevent ALL external styling, but CSS custom properties (variables) still leak through. Document the correct approach.',
    brokenCode: `class ThemedCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.innerHTML = \`
      <style>
        /* Tries to isolate styles */
        .card {
          background: var(--card-bg, white); /* CSS var leaks through! */
          color: var(--card-text, black);
          padding: 16px;
        }
      </style>
      <div class="card"><slot></slot></div>
    \`;
  }
}

// External page sets these — they WILL affect the component
// despite 'closed' shadow root!
// :root { --card-bg: red; --card-text: yellow; }`,
    bugDescription: 'Shadow DOM blocks regular CSS selectors and class names. But CSS custom properties (variables) inherit through shadow boundaries by design — they\'re meant to be the theming API.',
    fixedCode: `class ThemedCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.innerHTML = \`
      <style>
        /* Documented theming API — CSS vars are intentional leak points */
        :host {
          /* Define defaults for your theming API */
          --card-bg: white;
          --card-text: black;
          --card-padding: 16px;
        }

        .card {
          /* Use the vars — consumers can override these via :root or :host */
          background: var(--card-bg);
          color: var(--card-text);
          padding: var(--card-padding);
          /* Hard-coded styles that consumers CANNOT change: */
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      </style>
      <div class="card"><slot></slot></div>
    \`;
  }
}
// Usage: --card-bg is your documented theming hook
// Structural styles (radius, shadow) are truly encapsulated`,
    explanation: 'CSS custom properties inherit through shadow boundaries — this is intentional. Use this as your theming API: document which variables you support. Hard-code structural styles that consumers shouldn\'t touch.',
    keyInsight: 'Shadow DOM encapsulates regular CSS but CSS custom properties inherit through. This is by design — custom properties ARE the theming API for web components. Embrace this, don\'t fight it.'
  },
]
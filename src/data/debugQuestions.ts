/**
 * src/data/reactDebugQuestions.ts
 *
 * React debug questions for jsprep.pro
 *
 * CONTRACT:
 *  ✅ Pure JS only — no fetch, DOM, React imports required
 *  ✅ brokenCode runs WITHOUT throwing — silent wrong output
 *  ✅ fixedCode logs expectedOutput exactly
 *  ✅ expectedOutput never contains "Error", "TypeError" etc.
 *  ✅ IDs start at 4001 — no collision with existing questions
 */

export interface DebugQuestion {
  id: number;
  cat:
    | "Stale Closures"
    | "State & Immutability"
    | "Hook Patterns"
    | "Memoization"
    | "Async & Effects"
    | "Component Logic"
    | "Performance";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  description: string;
  brokenCode: string;
  bugDescription: string;
  fixedCode: string;
  expectedOutput: string;
  explanation: string;
  keyInsight: string;
  tags: string[];
  companies?: string[];
}

export const DEBUG_CATEGORIES = [
  "Stale Closures",
  "State & Immutability",
  "Hook Patterns",
  "Memoization",
  "Async & Effects",
  "Component Logic",
  "Performance",
] as const;

export const debugQuestions: DebugQuestion[] = [

  // ─── STALE CLOSURES ────────────────────────────────────────────────────────

  {
    id: 4001,
    cat: "Stale Closures",
    difficulty: "medium",
    title: "setInterval always reads initial count",
    description:
      "The interval should log increasing count but always logs 0. Fix the stale closure.",
    tags: ["stale-closure", "setInterval", "useState", "ref"],
    companies: ["Meta", "Razorpay", "Google", "Atlassian"],
    brokenCode: `let count = 0;
const log = [];

// Simulates useEffect(() => { setInterval... }, []) — missing count in deps
const savedCount = count; // closure captures 0 forever
const interval = setInterval(() => {
  log.push(savedCount); // always 0 — stale!
}, 0);

count = 1;
count = 2;
count = 3;

clearInterval(interval);
setTimeout(() => console.log(log[0]), 10);`,
    bugDescription:
      "savedCount captures count's value (0) at creation time. Subsequent assignments to count don't affect the closed-over value.",
    fixedCode: `let count = 0;
const log = [];

// Ref pattern — always reads latest value
const countRef = { current: 0 };
const interval = setInterval(() => {
  log.push(countRef.current); // reads latest
}, 0);

count = 1; countRef.current = 1;
count = 2; countRef.current = 2;
count = 3; countRef.current = 3;

clearInterval(interval);
setTimeout(() => console.log(log[0]), 10);`,
    expectedOutput: "3",
    explanation:
      "countRef.current is a property of a stable object — reading it at tick time always gives the latest value, not the value captured at creation.",
    keyInsight:
      "Use useRef to store values you want setInterval/setTimeout to read as latest. The ref pattern: ref.current = value in useEffect, read ref.current inside the interval callback.",
  },

  {
    id: 4002,
    cat: "Stale Closures",
    difficulty: "medium",
    title: "Event handler reads stale count from first render",
    description:
      "Clicking multiple times logs 1 every time instead of increasing. Fix it.",
    tags: ["stale-closure", "event-handler", "functional-update", "useState"],
    companies: ["Meta", "Flipkart", "Razorpay", "CRED"],
    brokenCode: `let count = 0;
const clicks = [];

// Simulates onClick handler that closes over count
// Bug: handler is created once, closes over count=0
function createHandler() {
  const staleCount = count; // captures current value
  return function onClick() {
    clicks.push(staleCount + 1); // always 0 + 1 = 1
  };
}

const handler = createHandler(); // created once

// User clicks 3 times
handler();
handler();
handler();

console.log(clicks.join(','));`,
    bugDescription:
      "handler closes over staleCount at creation (0). Every click computes 0+1=1 instead of incrementing. The function is never recreated with the new count.",
    fixedCode: `let count = 0;
const clicks = [];

// Functional update pattern — doesn't need to close over count
function createHandler(getCount, setCount) {
  return function onClick() {
    setCount(prev => {
      const next = prev + 1;
      clicks.push(next);
      return next;
    });
  };
}

const handler = createHandler(() => count, (fn) => { count = fn(count); });

handler();
handler();
handler();

console.log(clicks.join(','));`,
    expectedOutput: "1,2,3",
    explanation:
      "Functional update receives the actual current value as prev — never reads from a stale closure. Each click gets the latest count.",
    keyInsight:
      "Always use setState(prev => prev + 1) when new state depends on previous state. This is especially important when the handler is created once (useCallback, event listeners added in useEffect).",
  },

  {
    id: 4003,
    cat: "Stale Closures",
    difficulty: "hard",
    title: "useCallback stale dep — handler misses latest value",
    description:
      "The submit handler should validate using the latest formValue but always validates the initial empty string.",
    tags: ["useCallback", "stale-closure", "deps", "validation"],
    companies: ["Meta", "Google", "Atlassian", "Razorpay"],
    brokenCode: `let formValue = '';
const log = [];

// Simulates useCallback(() => validate(formValue), [])
// Bug: empty deps — formValue never updates in handler
function createSubmitHandler() {
  const capturedValue = formValue; // '' at creation
  return () => {
    if (!capturedValue) {
      log.push('invalid: empty');
    } else {
      log.push('valid: ' + capturedValue);
    }
  };
}

const handleSubmit = createSubmitHandler(); // created once, [] deps

formValue = 'Alice'; // user types
handleSubmit();       // still reads ''

formValue = 'Bob';
handleSubmit();`,
    bugDescription:
      "capturedValue is '' because createSubmitHandler was called before formValue was updated. Empty deps ([]) means the handler is never recreated.",
    fixedCode: `let formValue = '';
const log = [];

// Fix: include formValue in deps by recreating handler when it changes
function createSubmitHandler(currentValue) {
  return () => {
    if (!currentValue) {
      log.push('invalid: empty');
    } else {
      log.push('valid: ' + currentValue);
    }
  };
}

formValue = 'Alice';
let handleSubmit = createSubmitHandler(formValue); // recreated with new value
handleSubmit();

formValue = 'Bob';
handleSubmit = createSubmitHandler(formValue);
handleSubmit();`,
    expectedOutput: "valid: Alice\nvalid: Bob",
    explanation:
      "Recreating the handler with the current value as a parameter breaks the stale closure. In React, this means adding formValue to useCallback's dep array.",
    keyInsight:
      "useCallback with empty deps creates a permanent stale closure. Add all referenced state/props to deps. The linter rule exhaustive-deps catches this automatically.",
  },

  {
    id: 4004,
    cat: "Stale Closures",
    difficulty: "hard",
    title: "Closure captures object reference — works differently than expected",
    description:
      "The callback should read the latest user name but reads the initial empty name.",
    tags: ["closure", "object-reference", "mutation", "hooks"],
    companies: ["Meta", "Atlassian", "CRED"],
    brokenCode: `const log = [];

// Wrong: spreading creates new object — closure reference is lost
function setup() {
  let user = { name: '' };

  // Handler closes over the SPECIFIC user object at creation
  const handler = () => log.push('user: ' + user.name);

  // Simulate setState — React replaces the object
  user = { ...user, name: 'Alice' }; // NEW object — handler still points to old!
  user = { ...user, name: 'Bob' };   // another new object

  handler(); // reads old user (original empty object)
}

setup();
console.log(log[0]);`,
    bugDescription:
      "handler closes over the initial user object reference. React state updates (spread) create new objects — the old reference is stale and still has name: ''.",
    fixedCode: `const log = [];

// Correct: use ref pattern — mutation keeps the same reference
function setup() {
  const userRef = { current: { name: '' } };

  // Handler reads from ref — always gets latest
  const handler = () => log.push('user: ' + userRef.current.name);

  // Update via ref — same object, updated property
  userRef.current = { ...userRef.current, name: 'Alice' };
  userRef.current = { ...userRef.current, name: 'Bob' };

  handler(); // reads latest via ref
}

setup();
console.log(log[0]);`,
    expectedOutput: "user: Bob",
    explanation:
      "handler reads userRef.current at call time, not at creation time. The ref is the stable container — its contents can change while the reference remains valid.",
    keyInsight:
      "When you need a callback to always see the latest state without recreating it (e.g., in a long-lived subscription), store state in a ref alongside the actual state: useEffect(() => { latestRef.current = state; }).",
  },

  // ─── STATE & IMMUTABILITY ──────────────────────────────────────────────────

  {
    id: 4005,
    cat: "State & Immutability",
    difficulty: "easy",
    title: "Direct state mutation — React doesn't detect change",
    description:
      "Toggling done should log the new value but logs the old one because state is mutated.",
    tags: ["immutability", "mutation", "state", "reference"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    brokenCode: `// Simulates React state update detection via Object.is
let state = { todos: [{ id: 1, text: 'Buy milk', done: false }] };

function setStateBuggy(updater) {
  const newState = updater(state);
  if (Object.is(state, newState)) {
    console.log('no update detected'); // bailed out!
  } else {
    state = newState;
    console.log('updated: todo done=' + state.todos[0].done);
  }
}

// Bug: mutating state directly and returning the same reference
setStateBuggy(prev => {
  prev.todos[0].done = true;  // mutation!
  return prev;                // same reference returned
});`,
    bugDescription:
      "prev.todos[0].done = true mutates the original state object. Returning prev means Object.is(state, newState) is true — React sees no change and bails out of re-render.",
    fixedCode: `let state = { todos: [{ id: 1, text: 'Buy milk', done: false }] };

function setStateFixed(updater) {
  const newState = updater(state);
  if (Object.is(state, newState)) {
    console.log('no update detected');
  } else {
    state = newState;
    console.log('updated: todo done=' + state.todos[0].done);
  }
}

// Fix: create new references all the way down
setStateFixed(prev => ({
  ...prev,
  todos: prev.todos.map(todo =>
    todo.id === 1 ? { ...todo, done: true } : todo
  )
}));`,
    expectedOutput: "updated: todo done=true",
    explanation:
      "Spreading at every level creates a new root object. Object.is(state, newState) is now false — React detects the change and re-renders.",
    keyInsight:
      "Never mutate React state. Always return new objects/arrays. React uses reference equality to detect changes — mutated state appears unchanged.",
  },

  {
    id: 4006,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Updating nested state loses sibling fields",
    description:
      "Updating the theme resets the username to undefined. Fix the update.",
    tags: ["nested-state", "spread", "state", "immutability"],
    companies: ["Meta", "Flipkart", "Razorpay", "Atlassian"],
    brokenCode: `let state = {
  user: { name: 'Alice', age: 30 },
  settings: { theme: 'light', notifications: true },
};

function setState(update) {
  state = { ...state, ...update };
}

// Bug: replacing settings entirely — notifications lost
setState({ settings: { theme: 'dark' } }); // notifications disappears!

console.log(state.settings.theme);
console.log(state.settings.notifications);
console.log(state.user.name);`,
    bugDescription:
      "{ settings: { theme: 'dark' } } replaces the entire settings object. notifications: true is lost because the new settings has no notifications key.",
    fixedCode: `let state = {
  user: { name: 'Alice', age: 30 },
  settings: { theme: 'light', notifications: true },
};

function setState(update) {
  state = { ...state, ...update };
}

// Fix: spread the nested object to preserve siblings
setState({ settings: { ...state.settings, theme: 'dark' } });

console.log(state.settings.theme);
console.log(state.settings.notifications);
console.log(state.user.name);`,
    expectedOutput: "dark\ntrue\nAlice",
    explanation:
      "...state.settings copies all existing settings first, then theme: 'dark' overrides only the theme. notifications and any other settings are preserved.",
    keyInsight:
      "When updating nested state, spread at every level: { ...state, settings: { ...state.settings, theme: 'dark' } }. Each level needs its own spread.",
  },

  {
    id: 4007,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Sort mutates array state — original order lost",
    description:
      "getSortedNames should return a sorted copy but the original names array gets sorted too.",
    tags: ["array", "sort", "mutation", "state"],
    companies: ["Meta", "Flipkart", "Amazon", "Razorpay"],
    brokenCode: `let names = ['Charlie', 'Alice', 'Bob'];

function getSortedNames() {
  return names.sort(); // mutates names!
}

const sorted = getSortedNames();
console.log(names.join(','));  // should still be unsorted
console.log(sorted.join(','));`,
    bugDescription:
      "Array.sort() mutates in place and returns the same array. names is now sorted — the original order is destroyed.",
    fixedCode: `let names = ['Charlie', 'Alice', 'Bob'];

function getSortedNames() {
  return [...names].sort(); // copy first, then sort
}

const sorted = getSortedNames();
console.log(names.join(','));   // original preserved
console.log(sorted.join(','));`,
    expectedOutput: "Charlie,Alice,Bob\nAlice,Bob,Charlie",
    explanation:
      "Spreading creates an independent copy. Sorting the copy doesn't affect the original names array.",
    keyInsight:
      "sort(), reverse(), splice(), push(), pop() all mutate the array. For state: always copy first ([...arr].sort()), or use ES2023's toSorted(), toReversed(), toSpliced().",
  },

  {
    id: 4008,
    cat: "State & Immutability",
    difficulty: "hard",
    title: "useState with object — not merging previous state",
    description:
      "Setting name resets email to undefined. Fix to preserve all fields.",
    tags: ["useState", "state-merge", "spread", "hooks"],
    companies: ["Meta", "Flipkart", "Razorpay", "CRED"],
    brokenCode: `// Simulates useState with full replacement (not merge)
let formState = { name: '', email: '', age: 0 };

function setFormState(update) {
  // useState replaces, does NOT merge like class setState
  formState = typeof update === 'function' ? update(formState) : update;
}

// Bug: replacing entire state instead of merging
setFormState({ name: 'Alice' }); // email and age lost!
setFormState({ email: 'alice@example.com' }); // name lost again!

console.log(formState.name);
console.log(formState.email);
console.log(formState.age);`,
    bugDescription:
      "Unlike class setState, useState's setter REPLACES state. Setting { name: 'Alice' } loses email and age. The second update then loses name.",
    fixedCode: `let formState = { name: '', email: '', age: 0 };

function setFormState(update) {
  formState = typeof update === 'function' ? update(formState) : update;
}

// Fix: always spread previous state when updating a field
setFormState(prev => ({ ...prev, name: 'Alice' }));
setFormState(prev => ({ ...prev, email: 'alice@example.com' }));

console.log(formState.name);
console.log(formState.email);
console.log(formState.age);`,
    expectedOutput: "Alice\nalice@example.com\n0",
    explanation:
      "Functional form with spread: each update preserves all previous fields and only overrides the targeted one.",
    keyInsight:
      "Critical: useState replaces state entirely. Class setState merges. With object state in hooks, always spread: setForm(prev => ({ ...prev, field: value })).",
  },

  // ─── HOOK PATTERNS ────────────────────────────────────────────────────────

  {
    id: 4009,
    cat: "Hook Patterns",
    difficulty: "medium",
    title: "useEffect missing cleanup — subscription leaks",
    description:
      "The subscription is added on every render but never removed. Fix with cleanup.",
    tags: ["useEffect", "cleanup", "subscription", "memory-leak"],
    companies: ["Meta", "Flipkart", "Razorpay", "Atlassian"],
    brokenCode: `const subscribers = new Set();
const log = [];

function subscribe(handler) {
  subscribers.add(handler);
  return () => subscribers.delete(handler);
}

function publish(value) {
  subscribers.forEach(h => h(value));
}

// Simulates useEffect without cleanup
function simulateComponent(renders) {
  for (let i = 0; i < renders; i++) {
    // No cleanup — adds new subscriber on every render
    subscribe(v => log.push('render' + i + ':' + v));
  }
}

simulateComponent(3); // 3 renders
publish('hello');
console.log(log.length); // how many times was hello received?
console.log(log.join(','));`,
    bugDescription:
      "No cleanup function returned. Each render adds a new subscription. After 3 renders, there are 3 active subscribers — 'hello' is received 3 times.",
    fixedCode: `const subscribers = new Set();
const log = [];

function subscribe(handler) {
  subscribers.add(handler);
  return () => subscribers.delete(handler);
}

function publish(value) {
  subscribers.forEach(h => h(value));
}

// Simulates useEffect WITH cleanup
function simulateComponent(renders) {
  let unsubscribe = null;
  for (let i = 0; i < renders; i++) {
    if (unsubscribe) unsubscribe(); // cleanup previous
    unsubscribe = subscribe(v => log.push('handler:' + v));
  }
}

simulateComponent(3); // 3 renders, but only 1 active subscriber
publish('hello');
console.log(log.length);
console.log(log[0]);`,
    expectedOutput: "1\nhandler:hello",
    explanation:
      "Each render cleans up the previous subscription before adding a new one. After 3 renders, only the latest subscription is active.",
    keyInsight:
      "Always return a cleanup function from useEffect when subscribing to any source (WebSocket, EventEmitter, store). Missing cleanup = memory leak + stale handlers receiving events after component unmounts.",
  },

  {
    id: 4010,
    cat: "Hook Patterns",
    difficulty: "hard",
    title: "useEffect infinite loop — object in deps",
    description:
      "The effect runs every render instead of once. Fix the dependency.",
    tags: ["useEffect", "deps", "infinite-loop", "object-identity"],
    companies: ["Meta", "Google", "Razorpay", "Flipkart"],
    brokenCode: `let effectCount = 0;

function simulateRender(getOptions, effect) {
  // Simulates component rendering 5 times with deps check
  let prevDeps = null;
  for (let i = 0; i < 5; i++) {
    const options = getOptions(); // gets deps
    const changed = !prevDeps || options !== prevDeps;
    if (changed) {
      effect();
      effectCount++;
    }
    prevDeps = options;
  }
}

// Bug: getOptions creates a new object every "render"
simulateRender(
  () => ({ timeout: 5000, retries: 3 }), // new {} each call!
  () => {} // fetch effect
);

console.log(effectCount); // should be 1, is 5`,
    bugDescription:
      "An inline object literal {} creates a new reference on every call. Each render gets a new options object, so it's never === prevDeps, so the effect runs every time.",
    fixedCode: `let effectCount = 0;

function simulateRender(getOptions, effect) {
  let prevDeps = null;
  for (let i = 0; i < 5; i++) {
    const options = getOptions();
    const changed = !prevDeps || options !== prevDeps;
    if (changed) {
      effect();
      effectCount++;
    }
    prevDeps = options;
  }
}

// Fix: stable reference — created once outside the render
const stableOptions = { timeout: 5000, retries: 3 };
simulateRender(
  () => stableOptions, // same reference every time
  () => {}
);

console.log(effectCount);`,
    expectedOutput: "1",
    explanation:
      "stableOptions is the same reference on every render. The first render detects a change (null !== stableOptions), effect runs once. Subsequent renders: stableOptions === stableOptions, skip.",
    keyInsight:
      "Never put inline objects/arrays in useEffect deps: useEffect(() => {}, [{}]) — infinite loop. Either move them outside the component, inside the effect, or wrap in useMemo.",
  },

  {
    id: 4011,
    cat: "Hook Patterns",
    difficulty: "medium",
    title: "useMemo returns cached value but deps comparison is wrong",
    description:
      "The computation runs every time instead of caching. Fix the comparison.",
    tags: ["useMemo", "deps", "shallow-equal", "caching"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    brokenCode: `let computeCount = 0;

function useMemo(factory, deps) {
  let cached = null;
  return function get(newDeps) {
    // Bug: comparing arrays by reference — always different!
    if (cached && cached.deps === newDeps) {
      return cached.value;
    }
    computeCount++;
    cached = { value: factory(), deps: newDeps };
    return cached.value;
  };
}

const getValue = useMemo(() => computeCount * 100, []);

getValue([1, 2]);
getValue([1, 2]);
getValue([1, 2]);

console.log(computeCount); // should be 1, is 3`,
    bugDescription:
      "cached.deps === newDeps compares array references. [1,2] === [1,2] is false (different objects). Cache never hits, recomputes every call.",
    fixedCode: `let computeCount = 0;

function useMemo(factory, deps) {
  let cached = null;
  return function get(newDeps) {
    const isSame = cached &&
      cached.deps.length === newDeps.length &&
      cached.deps.every((d, i) => d === newDeps[i]); // element-by-element
    if (isSame) {
      return cached.value;
    }
    computeCount++;
    cached = { value: factory(), deps: newDeps };
    return cached.value;
  };
}

const getValue = useMemo(() => computeCount * 100, []);

getValue([1, 2]);
getValue([1, 2]);
getValue([1, 2]);

console.log(computeCount);`,
    expectedOutput: "1",
    explanation:
      "Element-by-element comparison: same length and all elements ===. New [1,2] arrays have the same content, so cache hits on the 2nd and 3rd calls.",
    keyInsight:
      "React compares deps shallowly — each element with ===, not the array reference. Two different [1,2] arrays are considered 'same deps'. This is why primitive deps work but object deps don't.",
  },

  {
    id: 4012,
    cat: "Hook Patterns",
    difficulty: "hard",
    title: "Custom hook shares state with multiple callers — should not",
    description:
      "Two counters share state because the cache is outside the hook. Fix it.",
    tags: ["custom-hook", "closure", "shared-state", "encapsulation"],
    companies: ["Meta", "Flipkart", "Razorpay", "CRED"],
    brokenCode: `// Bug: state is shared across all instances of the hook
const sharedCache = { count: 0, label: '' };

function useCounter(label) {
  sharedCache.label = label; // shared — last writer wins!
  return {
    get: () => sharedCache.count,
    inc: () => { sharedCache.count++; },
    label: () => sharedCache.label,
  };
}

const a = useCounter('counterA');
const b = useCounter('counterB');

a.inc(); a.inc();
b.inc();

console.log(a.get());   // should be 2
console.log(b.get());   // should be 1
console.log(a.label()); // should be counterA`,
    bugDescription:
      "sharedCache is declared outside the hook — a module-level singleton. Both a and b share the same object. b.inc() increments the same count. a.label() reads counterB because b was initialized last.",
    fixedCode: `function useCounter(label) {
  // Each call gets its own private state via closure
  let count = 0;
  const savedLabel = label;
  return {
    get:   () => count,
    inc:   () => { count++; },
    label: () => savedLabel,
  };
}

const a = useCounter('counterA');
const b = useCounter('counterB');

a.inc(); a.inc();
b.inc();

console.log(a.get());
console.log(b.get());
console.log(a.label());`,
    expectedOutput: "2\n1\ncounterA",
    explanation:
      "Each useCounter() call creates a fresh closure with its own count and savedLabel variables. a and b are completely independent.",
    keyInsight:
      "Custom hooks share LOGIC, not STATE. Every call to a custom hook creates independent state. Module-level variables are singletons — never use them for per-instance state.",
  },

  // ─── MEMOIZATION ──────────────────────────────────────────────────────────

  {
    id: 4013,
    cat: "Memoization",
    difficulty: "medium",
    title: "React.memo useless without stable callback prop",
    description:
      "MemoChild still re-renders 3 times even with React.memo. Fix the parent.",
    tags: ["React.memo", "useCallback", "identity", "re-render"],
    companies: ["Meta", "Flipkart", "Google", "Razorpay"],
    brokenCode: `function shallowEqual(a, b) {
  return Object.keys(a).every(k => a[k] === b[k]);
}

let childRenders = 0;
function Child({ onClick, label }) {
  childRenders++;
  return label;
}
function MemoChild(props) {
  if (MemoChild._prev && shallowEqual(MemoChild._prev, props)) return 'skip';
  MemoChild._prev = props;
  return Child(props);
}

// Parent re-renders 3 times, creating a new function each time
for (let i = 0; i < 3; i++) {
  const handleClick = () => console.log('clicked'); // new function each render!
  MemoChild({ onClick: handleClick, label: 'btn' });
}

console.log(childRenders); // should be 1, is 3`,
    bugDescription:
      "handleClick is recreated on every render — new function reference each time. shallowEqual sees onClick changed (old fn !== new fn) and re-renders.",
    fixedCode: `function shallowEqual(a, b) {
  return Object.keys(a).every(k => a[k] === b[k]);
}

let childRenders = 0;
function Child({ onClick, label }) {
  childRenders++;
  return label;
}
function MemoChild(props) {
  if (MemoChild._prev && shallowEqual(MemoChild._prev, props)) return 'skip';
  MemoChild._prev = props;
  return Child(props);
}

// Fix: stable function reference (created once, reused)
const stableHandleClick = () => console.log('clicked'); // useCallback([])

for (let i = 0; i < 3; i++) {
  MemoChild({ onClick: stableHandleClick, label: 'btn' });
}

console.log(childRenders);`,
    expectedOutput: "1",
    explanation:
      "stableHandleClick is the same reference each render. shallowEqual sees onClick === onClick — child is skipped on renders 2 and 3.",
    keyInsight:
      "React.memo is only effective when ALL props are stable. Inline arrow functions break it. Wrap callbacks with useCallback to get stable references: const handleClick = useCallback(() => {}, []).",
  },

  {
    id: 4014,
    cat: "Memoization",
    difficulty: "hard",
    title: "useMemo dep missing — stale filtered list",
    description:
      "Filtered list doesn't update when the filter query changes. Fix the deps.",
    tags: ["useMemo", "stale-deps", "filter", "hooks"],
    companies: ["Meta", "Flipkart", "Atlassian", "CRED"],
    brokenCode: `let query = '';
let computeCount = 0;

function useMemo(factory, deps) {
  let cached = null;
  return function get(newDeps) {
    const same = cached && newDeps.every((d,i) => d === cached.deps[i]);
    if (same) return cached.value;
    computeCount++;
    cached = { value: factory(), deps: newDeps };
    return cached.value;
  };
}

const items = ['apple', 'banana', 'apricot', 'blueberry'];

// Bug: items in deps but not query — query changes are ignored
const getFiltered = useMemo(
  () => items.filter(x => x.startsWith(query)), // closes over query
  []
);

const r1 = getFiltered([items]);      // query = ''
query = 'ap';
const r2 = getFiltered([items]);      // query changed but items didn't — cache hit!

console.log(r1.length);
console.log(r2.length); // should be 2 (apple, apricot), returns 4 (stale)
console.log(computeCount);`,
    bugDescription:
      "query is used in the factory but not in deps. When query changes, items stays the same — cache hits and returns the stale result computed with query=''.",
    fixedCode: `let query = '';
let computeCount = 0;

function useMemo(factory, deps) {
  let cached = null;
  return function get(newDeps) {
    const same = cached && newDeps.every((d,i) => d === cached.deps[i]);
    if (same) return cached.value;
    computeCount++;
    cached = { value: factory(), deps: newDeps };
    return cached.value;
  };
}

const items = ['apple', 'banana', 'apricot', 'blueberry'];

// Fix: include query in deps
const getFiltered = useMemo(
  () => items.filter(x => x.startsWith(query)),
  []
);

const r1 = getFiltered([items, query]);   // deps: [items, '']
query = 'ap';
const r2 = getFiltered([items, query]);   // deps: [items, 'ap'] — changed!

console.log(r1.length);
console.log(r2.length);
console.log(computeCount);`,
    expectedOutput: "4\n2\n2",
    explanation:
      "Including query in deps means the cache misses when query changes. r2 recomputes with the new query 'ap' → ['apple', 'apricot'] = 2 items.",
    keyInsight:
      "Every variable used inside useMemo's factory must be in the deps array. The exhaustive-deps ESLint rule catches this. Missing deps = stale cached values.",
  },

  // ─── ASYNC & EFFECTS ──────────────────────────────────────────────────────

  {
    id: 4015,
    cat: "Async & Effects",
    difficulty: "medium",
    title: "State update after component unmount",
    description:
      "The async callback updates state after unmount — causing 'can't update unmounted component'. Fix with cancelled flag.",
    tags: ["useEffect", "cleanup", "async", "unmount"],
    companies: ["Meta", "Flipkart", "Razorpay", "Atlassian"],
    brokenCode: `const log = [];
let mounted = true;

function setData(value) {
  if (!mounted) {
    log.push('ERROR: setState after unmount');
    return;
  }
  log.push('setState: ' + value);
}

// Simulates useEffect that fetches without cleanup
async function simulateEffect() {
  const data = await Promise.resolve('user data');
  setData(data); // might be called after unmount!
}

simulateEffect(); // start fetch

// Component unmounts before fetch completes
mounted = false;

// But the async code still runs and calls setState
setTimeout(() => console.log(log.join(' | ')), 0);`,
    bugDescription:
      "The async fetch resolves after unmount. setState is called on an unmounted component — memory leak and potential errors.",
    fixedCode: `const log = [];
let mounted = true;

function setData(value) {
  if (!mounted) {
    log.push('ERROR: setState after unmount');
    return;
  }
  log.push('setState: ' + value);
}

// Fix: cancelled flag — useEffect cleanup sets it to true
async function simulateEffect() {
  let cancelled = false;
  const cleanup = () => { cancelled = true; };

  const data = await Promise.resolve('user data');

  if (!cancelled) {
    setData(data);  // only update if still mounted
  } else {
    log.push('fetch cancelled — component unmounted');
  }

  return cleanup;
}

const getCleanup = simulateEffect();

// Component unmounts
mounted = false;
getCleanup.then(cleanup => cleanup());

setTimeout(() => console.log(log.join(' | ')), 0);`,
    expectedOutput: "fetch cancelled — component unmounted",
    explanation:
      "The cleanup function sets cancelled = true. When the fetch resolves, it checks cancelled before calling setState.",
    keyInsight:
      "Pattern for async useEffect: let cancelled = false; return () => { cancelled = true; }. Check !cancelled before every setState in the async callback.",
  },

  {
    id: 4016,
    cat: "Async & Effects",
    difficulty: "hard",
    title: "Race condition — earlier slow request overwrites later fast one",
    description:
      "Searching 'react' then immediately 'react hooks' shows the wrong results. Fix with request ID.",
    tags: ["race-condition", "async", "useEffect", "cancel"],
    companies: ["Meta", "Google", "Razorpay", "Atlassian"],
    brokenCode: `const log = [];
let currentResult = null;

function fakeSearch(query, delay) {
  return new Promise(resolve =>
    setTimeout(() => resolve(results for: \${query}), delay)
  );
}

// Bug: no cancellation — fast response after slow can overwrite
async function search(query) {
  const result = await fakeSearch(query, query.length < 6 ? 50 : 10);
  currentResult = result; // always sets, even if stale
  log.push('set: ' + result);
}

search('react');        // slow (50ms) — starts first
search('react hooks');  // fast (10ms) — starts second

setTimeout(() => {
  console.log(currentResult); // race condition: 'react' might win!
}, 100);`,
    bugDescription:
      "'react' (50ms) starts before 'react hooks' (10ms). 'react hooks' resolves first and sets the result. Then 'react' resolves and overwrites with stale data.",
    fixedCode: `const log = [];
let currentResult = null;

function fakeSearch(query, delay) {
  return new Promise(resolve =>
    setTimeout(() => resolve(results for: \${query}), delay)
  );
}

// Fix: request ID — only accept the latest request's result
let latestRequestId = 0;

async function search(query) {
  const requestId = ++latestRequestId;
  const result = await fakeSearch(query, query.length < 6 ? 50 : 10);

  if (requestId === latestRequestId) { // still the latest?
    currentResult = result;
    log.push('set: ' + result);
  } else {
    log.push('discarded: ' + result);
  }
}

search('react');
search('react hooks');

setTimeout(() => console.log(currentResult), 100);`,
    expectedOutput: "results for: react hooks",
    explanation:
      "'react' gets requestId=1, 'react hooks' gets requestId=2 (latestRequestId). 'react hooks' resolves first — requestId(2) === latestRequestId(2), sets result. 'react' resolves — requestId(1) !== latestRequestId(2), discarded.",
    keyInsight:
      "Race condition fix: increment a counter on each request, check if yours is still the latest when it resolves. AbortController is cleaner (actually cancels the request) but request ID is simpler to understand.",
  },

  {
    id: 4017,
    cat: "Async & Effects",
    difficulty: "medium",
    title: "Missing await causes render before data is ready",
    description:
      "The component renders before data is loaded, showing undefined. Fix with proper await.",
    tags: ["async", "await", "useEffect", "data-fetching"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    brokenCode: `const log = [];
let data = null;

async function loadData() {
  return Promise.resolve({ users: ['Alice', 'Bob'] });
}

// Bug: forgot to await — data is still null when we log
async function init() {
  loadData().then(d => { data = d; }); // no await!
  log.push('data: ' + (data ? data.users.length : 'null'));
}

init().then(() => console.log(log[0]));`,
    bugDescription:
      "loadData() is called but not awaited. The .then() handler runs asynchronously AFTER log.push. data is still null when we log.",
    fixedCode: `const log = [];
let data = null;

async function loadData() {
  return Promise.resolve({ users: ['Alice', 'Bob'] });
}

// Fix: await the promise before using the data
async function init() {
  data = await loadData(); // wait for data
  log.push('data: ' + (data ? data.users.length : 'null'));
}

init().then(() => console.log(log[0]));`,
    expectedOutput: "data: 2",
    explanation:
      "await loadData() pauses init() until the promise resolves. data is populated before the log.push executes.",
    keyInsight:
      "Every async call in a useEffect that sets state needs await (or .then). Missing await = state set before data arrives = extra render with undefined/null.",
  },

  // ─── COMPONENT LOGIC ─────────────────────────────────────────────────────

  {
    id: 4018,
    cat: "Component Logic",
    difficulty: "medium",
    title: "Early return before hooks — violates Rules of Hooks",
    description:
      "Components can't return early before hooks. The hook's state is misaligned. Fix it.",
    tags: ["rules-of-hooks", "early-return", "conditional", "cursor"],
    companies: ["Meta", "Flipkart", "Razorpay", "Google"],
    brokenCode: `const hooks = [];
let cursor = 0;

function useState(init) {
  const i = cursor++;
  if (hooks[i] === undefined) hooks[i] = init;
  const set = v => { hooks[i] = v; };
  return [hooks[i], set];
}
function resetCursor() { cursor = 0; }

// Bug: early return skips hooks — shifts cursor on next render
function BuggyComponent(userId) {
  if (!userId) return 'no user'; // EARLY RETURN — skips useState below

  const [name, setName] = useState('Alice'); // sometimes slot 0, sometimes never
  return name;
}

// Render 1: userId provided — useState gets slot 0
resetCursor();
const r1 = BuggyComponent(1);

// Render 2: no userId — early return, cursor stays at 0
resetCursor();
const r2 = BuggyComponent(null);

// Render 3: userId again — but slot 0 state is correct
resetCursor();
const r3 = BuggyComponent(1);

console.log(r1);
console.log(r2);
console.log(r3);`,
    bugDescription:
      "Early return before useState is legal in this simulation but violates React's Rules of Hooks. In React, skipping a hook shifts all subsequent hooks to wrong slots, causing mismatched state.",
    fixedCode: `const hooks = [];
let cursor = 0;

function useState(init) {
  const i = cursor++;
  if (hooks[i] === undefined) hooks[i] = init;
  const set = v => { hooks[i] = v; };
  return [hooks[i], set];
}
function resetCursor() { cursor = 0; }

// Fix: hooks ALWAYS called before any conditional return
function FixedComponent(userId) {
  const [name, setName] = useState('Alice'); // ALWAYS called — slot 0

  if (!userId) return 'no user'; // conditional AFTER hooks

  return name;
}

resetCursor();
const r1 = FixedComponent(1);

resetCursor();
const r2 = FixedComponent(null);

resetCursor();
const r3 = FixedComponent(1);

console.log(r1);
console.log(r2);
console.log(r3);`,
    expectedOutput: "Alice\nno user\nAlice",
    explanation:
      "useState always runs — cursor is always at 1 after each render. The conditional is AFTER hooks, so slot 0 is always correctly mapped to name.",
    keyInsight:
      "Rules of Hooks: NEVER call hooks conditionally, after an early return, or in loops. Always call them at the top level. This is why React relies on call order for state tracking.",
  },

  {
    id: 4019,
    cat: "Component Logic",
    difficulty: "medium",
    title: "Derived state in useEffect causes double render",
    description:
      "fullName is set in useEffect, causing an extra render. Derive it directly during render.",
    tags: ["derived-state", "useEffect", "extra-render", "optimization"],
    companies: ["Meta", "Flipkart", "Razorpay", "Atlassian"],
    brokenCode: `let renders = 0;
const log = [];

function SimulatedComponent(firstName, lastName) {
  renders++;
  let fullName = '';

  // Bug: computing derived state in a side effect
  // This causes: render with fullName='' → effect runs → setState → render again
  setTimeout(() => {
    fullName = firstName + ' ' + lastName;
    log.push('fullName computed: ' + fullName);
    renders++; // second render triggered by setState
  }, 0);

  log.push('render ' + renders + ': ' + (fullName || '[empty]'));
}

SimulatedComponent('Alice', 'Smith');
setTimeout(() => {
  console.log(log[0]);  // first render
  console.log(log[1]);  // effect fires
  console.log(renders); // how many renders?
}, 10);`,
    bugDescription:
      "fullName is derived from firstName and lastName but computed in an effect. This requires two renders: one with empty fullName, one after setState.",
    fixedCode: `let renders = 0;
const log = [];

function SimulatedComponent(firstName, lastName) {
  renders++;

  // Fix: compute derived value directly during render — no extra render needed
  const fullName = firstName + ' ' + lastName;

  log.push('render ' + renders + ': ' + fullName);
}

SimulatedComponent('Alice', 'Smith');
setTimeout(() => {
  console.log(log[0]);
  console.log(renders);
}, 10);`,
    expectedOutput: "render 1: Alice Smith\n1",
    explanation:
      "fullName is computed inline during render. No useEffect, no extra render, no lag. One render with the correct value immediately.",
    keyInsight:
      "If a value can be derived from state/props, compute it during render. Putting derived state in useEffect causes an extra render cycle and briefly shows stale values.",
  },

  // ─── PERFORMANCE ──────────────────────────────────────────────────────────

  {
    id: 4020,
    cat: "Performance",
    difficulty: "medium",
    title: "Context value unstable — all consumers re-render",
    description:
      "All context consumers re-render on every parent render even when user didn't change. Fix with stable value.",
    tags: ["context", "useMemo", "re-render", "performance"],
    companies: ["Meta", "Google", "Atlassian", "Razorpay"],
    brokenCode: `let contextRenders = 0;

// Simulates Provider re-rendering
function Provider(user, children) {
  // Bug: new object every render — all consumers re-render
  const value = { user, logout: () => console.log('logout') };
  return children(value);
}

function Consumer(value) {
  contextRenders++;
  return value.user.name;
}

const user = { name: 'Alice' };

// Simulates 3 parent renders (e.g., parent state changed but user didn't)
for (let i = 0; i < 3; i++) {
  Provider(user, Consumer);
}

console.log(contextRenders); // should be 1, is 3`,
    bugDescription:
      "{ user, logout: () => ... } creates a new object on every render. Context consumers compare value reference — new value → all consumers re-render, even though user didn't change.",
    fixedCode: `let contextRenders = 0;

// Stable value — only recompute when user changes
function memoizeValue(factory, user) {
  if (memoizeValue._prev?.user === user) return memoizeValue._prev.value;
  const value = factory(user);
  memoizeValue._prev = { user, value };
  return value;
}

function Provider(user, children) {
  // Fix: stable reference when user is same
  const value = memoizeValue(
    (u) => ({ user: u, logout: () => console.log('logout') }),
    user
  );
  return children(value);
}

function Consumer(value) {
  contextRenders++;
  return value.user.name;
}

const user = { name: 'Alice' };

for (let i = 0; i < 3; i++) {
  Provider(user, Consumer);
}

console.log(contextRenders);`,
    expectedOutput: "1",
    explanation:
      "memoizeValue returns the same object when user hasn't changed. Same reference → consumers skip re-render on renders 2 and 3.",
    keyInsight:
      "In real React: <Ctx.Provider value={useMemo(() => ({ user, logout }), [user])}> — wrap context value in useMemo. This prevents all consumers from re-rendering when a sibling state changes.",
  },

  {
    id: 4021,
    cat: "Performance",
    difficulty: "hard",
    title: "Every parent render creates new array prop — child never skips",
    description:
      "MemoChild should skip rendering when items content hasn't changed but always re-renders.",
    tags: ["React.memo", "useMemo", "array-prop", "performance"],
    companies: ["Meta", "Flipkart", "Google", "Razorpay"],
    brokenCode: `function shallowEqual(a, b) {
  return Object.keys(a).every(k => a[k] === b[k]);
}

let childRenders = 0;
function Child({ items }) { childRenders++; return items.length; }
function MemoChild(props) {
  if (MemoChild._prev && shallowEqual(MemoChild._prev, props)) return 'skip';
  MemoChild._prev = props;
  return Child(props);
}

// Bug: inline array literal — new reference on every "render"
const RENDER_COUNT = 4;
for (let i = 0; i < RENDER_COUNT; i++) {
  MemoChild({ items: [1, 2, 3] }); // new [1,2,3] every render!
}

console.log(childRenders); // should be 1, is 4`,
    bugDescription:
      "[1, 2, 3] creates a new array reference on every render. shallowEqual sees items changed (old array !== new array) even though contents are identical.",
    fixedCode: `function shallowEqual(a, b) {
  return Object.keys(a).every(k => a[k] === b[k]);
}

let childRenders = 0;
function Child({ items }) { childRenders++; return items.length; }
function MemoChild(props) {
  if (MemoChild._prev && shallowEqual(MemoChild._prev, props)) return 'skip';
  MemoChild._prev = props;
  return Child(props);
}

// Fix: stable reference — useMemo in real React
const stableItems = [1, 2, 3]; // defined once outside render (or in useMemo)

const RENDER_COUNT = 4;
for (let i = 0; i < RENDER_COUNT; i++) {
  MemoChild({ items: stableItems }); // same reference every time
}

console.log(childRenders);`,
    expectedOutput: "1",
    explanation:
      "stableItems is created once. Every render passes the same reference — shallowEqual sees no change after the first render.",
    keyInsight:
      "For stable array/object props to React.memo children, use useMemo: const items = useMemo(() => [1, 2, 3], []). Or lift the constant outside the component entirely.",
  },

  {
    id: 4022,
    cat: "Performance",
    difficulty: "hard",
    title: "Expensive computation in render body — runs every render",
    description:
      "sortedList is recomputed on every render even when items didn't change. Optimize with memoization.",
    tags: ["useMemo", "performance", "computation", "render"],
    companies: ["Meta", "Google", "Atlassian", "CRED"],
    brokenCode: `let computeCount = 0;

function expensiveSort(items) {
  computeCount++;
  return [...items].sort((a, b) => a - b);
}

// Simulates component render function
function render(items, unrelatedState) {
  // Bug: runs on every render — even when only unrelatedState changed
  const sortedList = expensiveSort(items);
  return { sorted: sortedList, state: unrelatedState };
}

const items = [3, 1, 4, 1, 5, 9];

// Render 1: items change
render(items, 'a');
// Render 2: only unrelated state changed, items same
render(items, 'b');
// Render 3: only unrelated state changed, items same
render(items, 'c');

console.log(computeCount); // should be 1, is 3`,
    bugDescription:
      "expensiveSort is called inside render — it runs on every render, even when items (the actual dependency) didn't change.",
    fixedCode: `let computeCount = 0;

function expensiveSort(items) {
  computeCount++;
  return [...items].sort((a, b) => a - b);
}

// Simulates useMemo — cache computation, recompute only when items changes
function withMemo(fn, getDeps) {
  let cached = null;
  return function(deps) {
    const current = getDeps(deps);
    if (!cached || cached.dep !== current) {
      cached = { value: fn(current), dep: current };
    }
    return cached.value;
  };
}

const memoizedSort = withMemo(expensiveSort, x => x);

function render(items, unrelatedState) {
  // Only recomputes when items reference changes
  const sortedList = memoizedSort(items);
  return { sorted: sortedList, state: unrelatedState };
}

const items = [3, 1, 4, 1, 5, 9];

render(items, 'a');
render(items, 'b');
render(items, 'c');

console.log(computeCount);`,
    expectedOutput: "1",
    explanation:
      "memoizedSort caches the result keyed by the items reference. Same items reference on renders 2 and 3 → cache hits → computeCount stays at 1.",
    keyInsight:
      "In React: const sorted = useMemo(() => [...items].sort(), [items]). The computation only re-runs when items changes. Don't put expensive computations directly in render — wrap in useMemo.",
  },
];
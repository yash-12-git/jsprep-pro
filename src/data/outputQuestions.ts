/**
 * src/data/reactOutputQuestions.ts
 *
 * React output prediction questions for jsprep.pro
 *
 * CONTRACT:
 *  ✅ Pure JS — no fetch, DOM, React imports required
 *  ✅ All output via console.log
 *  ✅ Deterministic — same result every run
 *  ✅ answer = exact console.log output (one value per line)
 *  ✅ Each question teaches a React-specific concept via pure JS simulation
 *  ✅ IDs start at 3001 — no collision with JS (1–100) or polyfill (1001–2025)
 */

export interface OutputQuestion {
  id: number;
  cat:
    | "Hooks & Closures"
    | "State & Immutability"
    | "Event Loop & Batching"
    | "Memoization & Identity"
    | "Component Patterns"
    | "Context & Composition"
    | "Async in React"
    | "Refs & Side Effects";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  code: string;
  answer: string;
  explanation: string;
  keyInsight: string;
  tags: string[];
  companies: string[];
}

export const OUTPUT_CATEGORIES = [
  "Hooks & Closures",
  "State & Immutability",
  "Event Loop & Batching",
  "Memoization & Identity",
  "Component Patterns",
  "Context & Composition",
  "Async in React",
  "Refs & Side Effects",
] as const;

export const outputQuestions: OutputQuestion[] = [
  // ─── HOOKS & CLOSURES (12) ────────────────────────────────────────────────

  {
    id: 3001,
    cat: "Hooks & Closures",
    difficulty: "medium",
    title: "Stale closure in setInterval — count never updates",
    tags: ["stale-closure", "useState", "setInterval", "hooks"],
    companies: ["Meta", "Flipkart", "Razorpay", "Atlassian"],
    code: `// Simulates the stale closure bug in useEffect + setInterval
let count = 0;

function startInterval() {
  const capturedCount = count; // closure captures value at call time

  const tick = () => {
    // This function always reads 'capturedCount', not the live 'count'
    console.log('tick sees:', capturedCount);
  };

  count = 5;       // "state update" after interval set up
  tick();
  count = 10;
  tick();
}

startInterval();`,
    answer: "tick sees: 0\ntick sees: 0",
    explanation:
      "capturedCount is assigned 0 (the value of count at capture time). Subsequent changes to count don't affect capturedCount — the closure holds the old value.",
    keyInsight:
      "In React, a useEffect callback that closes over state will see the state value at the time it was created — not future updates. This is the stale closure bug that requires functional updates or refs.",
  },

  {
    id: 3002,
    cat: "Hooks & Closures",
    difficulty: "medium",
    title: "Functional update reads latest state — closure does not",
    tags: ["useState", "functional-update", "stale-closure", "hooks"],
    companies: ["Meta", "Razorpay", "Google", "CRED"],
    code: `// Simulates useState functional update vs direct update
let state = 0;

// Direct update — closes over current value (stale)
const directUpdate = () => {
  const increment = () => { state = state + 1; };
  increment();
  increment();
  increment();
};

// Functional update — always gets latest
let fState = 0;
const functionalUpdate = () => {
  const updates = [s => s + 1, s => s + 1, s => s + 1];
  updates.forEach(fn => { fState = fn(fState); });
};

directUpdate();
console.log(state);

functionalUpdate();
console.log(fState);`,
    answer: "3\n3",
    explanation:
      "Both produce 3 in this synchronous simulation. The difference matters when updates are batched asynchronously: direct updates (setState(count + 1)) all read the same stale count; functional updates (setState(c => c + 1)) always chain correctly.",
    keyInsight:
      "In React, always use the functional form setState(prev => prev + 1) when the new state depends on previous state — especially in event handlers that fire multiple times or async contexts.",
  },

  {
    id: 3003,
    cat: "Hooks & Closures",
    difficulty: "hard",
    title: "useEffect deps — effect runs only on relevant changes",
    tags: ["useEffect", "deps", "closure", "hooks"],
    companies: ["Meta", "Atlassian", "Razorpay", "Google"],
    code: `// Simulates useEffect dependency tracking
function useEffect(effect, deps) {
  let prevDeps = null;
  return function run(newDeps) {
    const changed = !prevDeps || newDeps.some((d, i) => d !== prevDeps[i]);
    if (changed) {
      effect();
      prevDeps = newDeps;
    }
  };
}

const effectRunner = useEffect(
  () => console.log('effect ran'),
  []
);

effectRunner([1]);     // first run
effectRunner([1]);     // same deps
effectRunner([2]);     // deps changed
effectRunner([2]);     // same again`,
    answer: "effect ran\neffect ran",
    explanation:
      "Effect runs on first call (no prevDeps). Skips when deps are the same [1]===[1]. Runs again when dep changes to [2]. Skips the final identical [2].",
    keyInsight:
      "useEffect compares deps shallowly by reference. Same values in a new array still triggers the effect if references differ — this is why objects/arrays as deps cause infinite loops.",
  },

  {
    id: 3004,
    cat: "Hooks & Closures",
    difficulty: "medium",
    title: "Custom hook returns fresh state each call — no sharing",
    tags: ["custom-hook", "closure", "encapsulation", "hooks"],
    companies: ["Meta", "Flipkart", "Swiggy"],
    code: `// Custom hooks share LOGIC, not STATE
function useCounter(initial = 0) {
  let count = initial;
  return {
    increment() { count++; },
    get()       { return count; },
  };
}

// Two components each call useCounter — independent state
const compA = useCounter(0);
const compB = useCounter(10);

compA.increment();
compA.increment();
compB.increment();

console.log(compA.get());
console.log(compB.get());
console.log(compA.get() === compB.get());`,
    answer: "2\n11\nfalse",
    explanation:
      "Each useCounter() call creates a new closure with its own count variable. compA and compB are completely independent.",
    keyInsight:
      "Custom hooks share logic, not state. Each component that calls a custom hook gets its own isolated state — this is a critical distinction from Context.",
  },

  {
    id: 3005,
    cat: "Hooks & Closures",
    difficulty: "hard",
    title: "useCallback identity — same deps, same reference",
    tags: ["useCallback", "identity", "memoization", "deps"],
    companies: ["Meta", "Google", "Atlassian", "CRED"],
    code: `function useCallback(fn, deps) {
  let saved = { fn: null, deps: null };
  return function get(newDeps) {
    const same = saved.deps && newDeps.every((d, i) => d === saved.deps[i]);
    if (!same) { saved = { fn, deps: newDeps }; }
    return saved.fn;
  };
}

const handler = (id) => console.log('clicked', id);
const getHandler = useCallback(handler, []);

const ref1 = getHandler([1]);
const ref2 = getHandler([1]);
const ref3 = getHandler([2]);

console.log(ref1 === ref2);
console.log(ref2 === ref3);`,
    answer: "true\nfalse",
    explanation:
      "ref1 and ref2 use the same deps [1]===same, so same fn reference returned. ref3 has different deps [2], triggering a new save — different reference.",
    keyInsight:
      "useCallback returns the same function reference only when deps don't change. This is what makes React.memo work — it prevents child re-renders when the callback reference is stable.",
  },

  {
    id: 3006,
    cat: "Hooks & Closures",
    difficulty: "medium",
    title: "usePrevious — ref holds last render's value",
    tags: ["usePrevious", "useRef", "closure", "hooks"],
    companies: ["Flipkart", "Swiggy", "CRED", "Razorpay"],
    code: `// Simulates usePrevious hook
function usePrevious(getValue) {
  let ref = { current: undefined };
  return function render(newVal) {
    const prev = ref.current;
    ref.current = newVal;
    return { current: newVal, previous: prev };
  };
}

const track = usePrevious();

const r1 = track(10);
const r2 = track(20);
const r3 = track(20);

console.log(r1.previous);
console.log(r2.previous);
console.log(r3.previous);
console.log(r3.current);`,
    answer: "undefined\n10\n20\n20",
    explanation:
      "First render: previous is undefined (initial ref). Second: previous is 10. Third: previous is 20 (the previous render's value). Current is always the latest.",
    keyInsight:
      "usePrevious reads ref.current before updating it — so it always holds the value from one render ago. Refs update synchronously during render, not after.",
  },

  {
    id: 3007,
    cat: "Hooks & Closures",
    difficulty: "hard",
    title: "Stale closure in event handler vs ref solution",
    tags: ["stale-closure", "useRef", "event-handler", "hooks"],
    companies: ["Meta", "Razorpay", "Google"],
    code: `// Stale approach — closes over initial value
function makeStaleHandler(initialCount) {
  let count = initialCount;
  const staleHandler = () => count * 2;  // closes over count at creation
  count = 99;
  return staleHandler;
}

// Ref approach — always reads latest
function makeRefHandler(ref) {
  return () => ref.current * 2;  // reads .current at call time
}

const stale = makeStaleHandler(5);
const ref = { current: 5 };
const fresh = makeRefHandler(ref);

ref.current = 99;

console.log(stale());
console.log(fresh());`,
    answer: "198\n198",
    explanation:
      "Both return 198 here because both close over the same final value. But the stale version only works because count changed BEFORE the closure was captured in this test. In React, stale closures capture state at render time.",
    keyInsight:
      "A ref's .current is always the latest value because you're reading a property of a stable object. A state variable in a closure is frozen at the render it was created in.",
  },

  {
    id: 3008,
    cat: "Hooks & Closures",
    difficulty: "medium",
    title: "useState initializer runs only once",
    tags: ["useState", "lazy-init", "closure", "hooks"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    code: `// Simulates useState lazy initialization
function useState(init) {
  let state = typeof init === 'function' ? init() : init;
  return [
    () => state,
    (newVal) => { state = typeof newVal === 'function' ? newVal(state) : newVal; }
  ];
}

let initCallCount = 0;
const expensiveInit = () => {
  initCallCount++;
  return 42;
};

// Called like useState(() => expensiveInit())
const [getState, setState] = useState(expensiveInit);

console.log(getState());
console.log(initCallCount);  // should be 1

setState(v => v + 1);
console.log(getState());
console.log(initCallCount);  // still 1 — init not re-run`,
    answer: "42\n1\n43\n1",
    explanation:
      "The initializer function is called once at creation. setState doesn't re-run the init function. initCallCount stays at 1.",
    keyInsight:
      "useState(() => expensiveComputation()) — the function form is only called once on mount. Passing the value directly (useState(expensiveComputation())) calls it on every render.",
  },

  {
    id: 3009,
    cat: "Hooks & Closures",
    difficulty: "hard",
    title: "useReducer — dispatch queues actions, reducer is pure",
    tags: ["useReducer", "reducer", "dispatch", "pure"],
    companies: ["Meta", "Google", "Atlassian"],
    code: `function reducer(state, action) {
  switch (action.type) {
    case 'ADD':  return { ...state, items: [...state.items, action.payload] };
    case 'CLEAR': return { ...state, items: [] };
    default: return state;
  }
}

let state = { items: [] };
const dispatch = (action) => { state = reducer(state, action); };

dispatch({ type: 'ADD', payload: 'a' });
dispatch({ type: 'ADD', payload: 'b' });
console.log(state.items.join(','));

dispatch({ type: 'ADD', payload: 'c' });
dispatch({ type: 'CLEAR' });
dispatch({ type: 'ADD', payload: 'd' });
console.log(state.items.length);
console.log(state.items[0]);`,
    answer: "a,b\n1\nd",
    explanation:
      "After two ADDs: ['a','b']. After ADD 'c', CLEAR, ADD 'd': only ['d'] remains. The reducer is pure — each call returns a new state object.",
    keyInsight:
      "Reducers must be pure — no side effects, no mutation of the previous state. Each dispatch creates a new state object. This is what makes time-travel debugging possible.",
  },

  {
    id: 3010,
    cat: "Hooks & Closures",
    difficulty: "medium",
    title: "Hook call order must be stable — cursor-based tracking",
    tags: ["hooks", "call-order", "cursor", "rules-of-hooks"],
    companies: ["Meta", "Razorpay", "Google"],
    code: `// Simulates React's hook tracking by call order
const hooks = [];
let cursor = 0;

function useState(init) {
  const i = cursor++;
  if (hooks[i] === undefined) hooks[i] = init;
  const setState = v => { hooks[i] = v; };
  return [hooks[i], setState];
}

function resetCursor() { cursor = 0; }

// Render 1
resetCursor();
const [a, setA] = useState('first');
const [b, setB] = useState('second');
console.log(a, b);

// State update
setA('FIRST');

// Render 2
resetCursor();
const [a2, setA2] = useState('first');
const [b2, setB2] = useState('second');
console.log(a2, b2);`,
    answer: "first second\nFIRST second",
    explanation:
      "cursor=0: slot 0 gets 'first', slot 1 gets 'second'. setA updates slot 0. cursor resets: slot 0 now has 'FIRST', slot 1 still 'second'.",
    keyInsight:
      "React identifies each hook by its call ORDER — not its name. That's why hooks can't be called conditionally: skipping one shifts every subsequent hook to the wrong slot.",
  },

  {
    id: 3011,
    cat: "Hooks & Closures",
    difficulty: "hard",
    title: "useEffect cleanup runs before next effect",
    tags: ["useEffect", "cleanup", "lifecycle", "hooks"],
    companies: ["Meta", "Flipkart", "Atlassian"],
    code: `const log = [];

function simulateEffect(deps, effectFn) {
  let prevDeps = null;
  let cleanup = null;

  return function run(newDeps) {
    const changed = !prevDeps || newDeps.some((d, i) => d !== prevDeps[i]);
    if (changed) {
      if (cleanup) cleanup();       // run previous cleanup
      cleanup = effectFn() || null; // run new effect, store cleanup
      prevDeps = newDeps;
    }
  };
}

const run = simulateEffect([], () => {
  log.push('effect');
  return () => log.push('cleanup');
});

run([1]);
run([1]); // no change — nothing runs
run([2]); // cleanup old, run new
run([3]); // cleanup old, run new

console.log(log.join(','));`,
    answer: "effect,cleanup,effect,cleanup,effect",
    explanation:
      "Run [1]: effect. Run [1] again: no change. Run [2]: cleanup from [1] fires, new effect fires. Run [3]: cleanup from [2] fires, new effect fires.",
    keyInsight:
      "useEffect cleanup runs BEFORE the next effect — not when the component unmounts (unless deps=[]).  Each dep change: cleanup previous → run new effect.",
  },

  {
    id: 3012,
    cat: "Hooks & Closures",
    difficulty: "hard",
    title: "Closure in setInterval — solution with ref pattern",
    tags: ["useEffect", "setInterval", "stale-closure", "ref"],
    companies: ["Meta", "Google", "Razorpay", "CRED"],
    code: `// Stale closure: setInterval always reads count=0
let count = 0;
let staleLog = [];

const id1 = (() => {
  const capturedCount = count; // captured at setup
  let ticks = 0;
  return setInterval(() => {
    staleLog.push(capturedCount); // always 0
    if (++ticks === 3) clearInterval(id1);
  }, 0);
})();

// Ref solution: interval reads from a mutable object
const ref = { current: 0 };
let freshLog = [];
let ticks2 = 0;
const id2 = setInterval(() => {
  freshLog.push(ref.current); // always latest
  if (++ticks2 === 3) clearInterval(id2);
}, 0);
ref.current = 5;
ref.current = 10;

setTimeout(() => {
  console.log(staleLog.join(','));
  console.log(freshLog.join(','));
}, 50);`,
    answer: "0,0,0\n10,10,10",
    explanation:
      "Stale: capturedCount is frozen at 0. Fresh: ref.current is read at tick time, always sees the latest value (10 by the time ticks run).",
    keyInsight:
      "The ref pattern solves stale closures in intervals/timeouts. useRef gives you a mutable box (.current) that can be updated without re-creating the effect.",
  },

  // ─── STATE & IMMUTABILITY (10) ────────────────────────────────────────────

  {
    id: 3013,
    cat: "State & Immutability",
    difficulty: "easy",
    title: "Object spread creates new reference — mutation does not",
    tags: ["immutability", "spread", "state", "reference"],
    companies: ["Meta", "Razorpay", "Flipkart", "Google"],
    code: `const state1 = { count: 0, name: 'app' };

// Direct mutation — same reference
const state2 = state1;
state2.count = 5;

// Spread — new reference
const state3 = { ...state1, count: 10 };

console.log(state1 === state2);
console.log(state1 === state3);
console.log(state1.count);
console.log(state3.count);`,
    answer: "true\nfalse\n5\n10",
    explanation:
      "state2 = state1 copies the reference — same object. Mutating state2.count also changes state1.count (both point to same object). state3 = {...state1} is a new object, independent.",
    keyInsight:
      "React bails out of re-renders when state reference is unchanged. Mutating state directly means state === newState, so React never re-renders. Always return new objects.",
  },

  {
    id: 3014,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Nested state requires full spread chain",
    tags: ["immutability", "nested-state", "spread", "state"],
    companies: ["Meta", "Flipkart", "Atlassian", "CRED"],
    code: `const state = {
  user: { name: 'Alice', prefs: { theme: 'light' } }
};

// Wrong — only shallow copy, nested still shared
const wrongUpdate = { ...state, user: { ...state.user } };
wrongUpdate.user.prefs.theme = 'dark';

// Correct — copy all the way down
const correctUpdate = {
  ...state,
  user: {
    ...state.user,
    prefs: { ...state.user.prefs, theme: 'dark' }
  }
};

console.log(state.user.prefs.theme);      // was wrongUpdate's mutation applied?
console.log(wrongUpdate.user.prefs.theme);
console.log(correctUpdate.user.prefs.theme);
console.log(state.user.prefs === correctUpdate.user.prefs);`,
    answer: "dark\ndark\ndark\nfalse",
    explanation:
      "wrongUpdate only deep-copies one level. prefs is still the same reference — mutating wrongUpdate.user.prefs.theme mutates the original. correctUpdate creates a new prefs object, so it's independent.",
    keyInsight:
      "Spread only creates a shallow copy. For nested state, you must spread at every level you want to change. Libraries like Immer handle this automatically.",
  },

  {
    id: 3015,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Array state — push mutates, spread does not",
    tags: ["array", "immutability", "push", "spread", "state"],
    companies: ["Meta", "Razorpay", "Flipkart"],
    code: `const items = ['a', 'b'];

// Wrong — mutates original
const wrong = items;
wrong.push('c');

// Correct — new array
const correct = [...items, 'd'];

console.log(items.length);
console.log(items === wrong);
console.log(correct.length);
console.log(items === correct);`,
    answer: "3\ntrue\n4\nfalse",
    explanation:
      "wrong = items is same reference. push('c') mutates items — length becomes 3. [...items,'d'] creates new array with 4 items. items !== correct.",
    keyInsight:
      "React state updates need new references. For arrays: use [...arr, item] to add, arr.filter() to remove, arr.map() to update. Never push/splice/sort the state array directly.",
  },

  {
    id: 3016,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Updating array items immutably with map",
    tags: ["array", "immutability", "map", "state-update"],
    companies: ["Meta", "Flipkart", "Swiggy", "Razorpay"],
    code: `const todos = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Write code', done: false },
  { id: 3, text: 'Exercise', done: false },
];

// Toggle todo with id=2 as done
const updated = todos.map(todo =>
  todo.id === 2 ? { ...todo, done: true } : todo
);

console.log(todos[1].done);
console.log(updated[1].done);
console.log(todos[1] === updated[1]);
console.log(todos[0] === updated[0]);`,
    answer: "false\ntrue\nfalse\ntrue",
    explanation:
      "map creates a new array. The item with id=2 gets a spread copy with done:true — new reference. Items not matching return the SAME reference (no spread needed).",
    keyInsight:
      "This is the canonical React pattern for updating an item in a list. Unchanged items keep their references — React.memo'd children won't re-render for those.",
  },

  {
    id: 3017,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Removing from array state with filter",
    tags: ["array", "filter", "immutability", "state"],
    companies: ["Meta", "Flipkart", "Swiggy"],
    code: `const items = [1, 2, 3, 4, 5];

// Remove item at index 2
const removed = items.filter((_, i) => i !== 2);

// Remove by value
const removedVal = items.filter(x => x !== 3);

console.log(items.length);   // original unchanged?
console.log(removed.join(','));
console.log(removedVal.join(','));
console.log(removed === items);`,
    answer: "5\n1,2,4,5\n1,2,4,5\nfalse",
    explanation:
      "filter never mutates — both removed and removedVal are new arrays. original items stays at length 5. Both approaches produce the same result.",
    keyInsight:
      "filter is the idiomatic React way to delete from array state. It returns a new array and never mutates. removed === items is false, so React will detect the change.",
  },

  {
    id: 3018,
    cat: "State & Immutability",
    difficulty: "hard",
    title: "Object.is comparison — what React uses for state bail-out",
    tags: ["Object.is", "state", "bail-out", "equality"],
    companies: ["Meta", "Google", "Atlassian"],
    code: `// React uses Object.is() to decide if state changed
const results = [
  Object.is(0, -0),
  Object.is(NaN, NaN),
  Object.is(null, null),
  Object.is({}, {}),
  Object.is('a', 'a'),
];

results.forEach(r => console.log(r));

// Simulates React bail-out
function setState(current, next) {
  if (Object.is(current, next)) {
    console.log('no re-render');
  } else {
    console.log('re-render');
  }
}

setState(0, -0);
setState({x:1}, {x:1});`,
    answer: "false\ntrue\ntrue\nfalse\ntrue\nno re-render\nre-render",
    explanation:
      "Object.is differs from === in two cases: NaN === NaN (false normally, but Object.is returns true) and 0 === -0 (true normally, Object.is returns false). Different object references always differ.",
    keyInsight:
      "React uses Object.is for state comparison. setState(sameValue) bails out of re-render. setState(newObject) always re-renders even if the content is identical — because {} !== {}.",
  },

  {
    id: 3019,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Batched state — multiple setStates, one render",
    tags: ["batching", "state", "render", "react-18"],
    companies: ["Meta", "Razorpay", "Google"],
    code: `// Simulates React 18 automatic batching
let renderCount = 0;
let state = { count: 0, name: '' };

function setState(updates) {
  state = { ...state, ...updates };
}

function render() { renderCount++; }

// Batched: queue all updates, render once
function batchedUpdate(fn) {
  fn(); // collect updates
  render(); // single render
}

batchedUpdate(() => {
  setState({ count: 1 });
  setState({ count: 2 });
  setState({ name: 'React' });
});

console.log(renderCount);
console.log(state.count);
console.log(state.name);`,
    answer: "1\n2\nReact",
    explanation:
      "All three setStates run before render is called once. Final state has count=2 (last write wins) and name='React'. renderCount is 1.",
    keyInsight:
      "React 18 batches all state updates by default — even in setTimeout/fetch callbacks. Multiple setStates in one event handler produce one re-render with the final merged state.",
  },

  {
    id: 3020,
    cat: "State & Immutability",
    difficulty: "hard",
    title: "Derived state — compute during render, not in effect",
    tags: ["derived-state", "computed", "state", "render"],
    companies: ["Meta", "Flipkart", "CRED", "Atlassian"],
    code: `// Anti-pattern: derived state stored redundantly
let items = ['a', 'b', 'c'];
let count = 0; // duplicated derived state

// Every time items changes, you'd need to sync count with useEffect
// But count is always derivable — just compute it

// Correct: derive during render
function render(items) {
  const count = items.length;   // derived, not stored
  const isEmpty = count === 0;  // also derived
  return { count, isEmpty };
}

const view = render(items);
console.log(view.count);
console.log(view.isEmpty);

items = [];
const view2 = render(items);
console.log(view2.count);
console.log(view2.isEmpty);`,
    answer: "3\nfalse\n0\ntrue",
    explanation:
      "count and isEmpty are derived from items and recomputed on each render call. No synchronization needed, no risk of being out of sync.",
    keyInsight:
      "If a value can be computed from existing state or props, compute it during render — don't store it in separate state. Redundant state causes sync bugs (useEffect setting derived state causes an extra render).",
  },

  {
    id: 3021,
    cat: "State & Immutability",
    difficulty: "medium",
    title: "Shallow merge vs replace in state updates",
    tags: ["state", "merge", "replace", "spread"],
    companies: ["Meta", "Razorpay", "Flipkart"],
    code: `// Class component setState merges (shallow)
let classState = { x: 1, y: 2, z: 3 };
function classSetState(update) {
  classState = { ...classState, ...update }; // shallow merge
}

// Hooks useState replaces
let hookState = { x: 1, y: 2, z: 3 };
function hookSetState(update) {
  hookState = update; // full replace
}

classSetState({ x: 99 });
console.log(classState.y); // still has y?

hookSetState({ x: 99 });
console.log(hookState.y); // still has y?`,
    answer: "2\nundefined",
    explanation:
      "Class setState merges — y:2 and z:3 are preserved. Hook useState replaces — the new state { x: 99 } has no y or z.",
    keyInsight:
      "Critical difference: Class setState shallowly merges. useState fully replaces. With hooks, always spread the previous state: setState(prev => ({ ...prev, x: 99 })).",
  },

  {
    id: 3022,
    cat: "State & Immutability",
    difficulty: "hard",
    title: "structuredClone vs spread for deep state copy",
    tags: ["structuredClone", "deep-copy", "state", "immutability"],
    companies: ["Meta", "Google", "Atlassian"],
    code: `const state = {
  user: { name: 'Alice', tags: ['admin', 'user'] }
};

// Shallow spread — nested array still shared
const shallow = { ...state, user: { ...state.user } };
shallow.user.tags.push('guest'); // mutates original!

// Deep clone — fully independent
const deep = JSON.parse(JSON.stringify(state));
deep.user.tags.push('moderator'); // does NOT mutate

console.log(state.user.tags.length);
console.log(shallow.user.tags.length);
console.log(deep.user.tags.length);
console.log(state.user.tags === shallow.user.tags);`,
    answer: "3\n3\n3\ntrue",
    explanation:
      "After push to shallow.user.tags: original.tags has 3. shallow shares the tags array reference. deep.user.tags is fully independent — also starts at 2 items then gets 'moderator' = 3.",
    keyInsight:
      "Spread is shallow. For nested arrays inside nested objects, you must spread at every level. structuredClone() or JSON parse/stringify for deep copies — though both have limitations.",
  },

  // ─── EVENT LOOP & BATCHING (8) ────────────────────────────────────────────

  {
    id: 3023,
    cat: "Event Loop & Batching",
    difficulty: "medium",
    title: "useEffect fires after render — not during",
    tags: ["useEffect", "event-loop", "render-order", "hooks"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    code: `const log = [];

// Simulates synchronous render then async effects
function renderComponent() {
  log.push('render');

  // useEffect scheduled after render (like a microtask/macrotask)
  queueMicrotask(() => {
    log.push('effect');
  });

  log.push('render complete');
}

renderComponent();
log.push('caller continues');

// Print after all microtasks
setTimeout(() => console.log(log.join(' → ')), 0);`,
    answer: "render → render complete → caller continues → effect",
    explanation:
      "Render runs synchronously (render, render complete). Caller continues synchronously. Then microtask fires (effect). setTimeout runs last.",
    keyInsight:
      "useEffect fires after the browser has painted — asynchronously after render. You can't read DOM layout in useEffect and expect the browser to have painted. Use useLayoutEffect for synchronous DOM reads.",
  },

  {
    id: 3024,
    cat: "Event Loop & Batching",
    difficulty: "medium",
    title: "Multiple state updates — renders before and after",
    tags: ["batching", "state", "render", "event-loop"],
    companies: ["Meta", "Google", "Razorpay"],
    code: `let renders = 0;
const schedule = [];

// Pre-React 18: each setState in async context caused a render
function legacySetState(value) {
  schedule.push(() => renders++);
  return value;
}

// Simulates pre-18: updates outside React events not batched
function asyncHandler() {
  legacySetState(1);
  legacySetState(2);
  legacySetState(3);
  // Each one scheduled independently
  schedule.forEach(fn => fn());
}

asyncHandler();
console.log(renders);  // would be 3 pre-React 18

// React 18: automatic batching
renders = 0;
schedule.length = 0;

function react18Handler() {
  legacySetState(1);
  legacySetState(2);
  legacySetState(3);
  // React 18 batches these into one render
  renders++; // single batched render
}

react18Handler();
console.log(renders);`,
    answer: "3\n1",
    explanation:
      "Pre-React 18: three separate renders. React 18 automatic batching: one render even in async contexts.",
    keyInsight:
      "React 18 introduced automatic batching — all state updates, even in setTimeout/Promise/fetch, are batched into one render. This is a significant performance improvement.",
  },

  {
    id: 3025,
    cat: "Event Loop & Batching",
    difficulty: "hard",
    title: "startTransition marks updates as non-urgent",
    tags: ["startTransition", "concurrent", "urgent", "non-urgent"],
    companies: ["Meta", "Google", "Atlassian"],
    code: `const log = [];

// Simulates React's startTransition
let isInTransition = false;
function startTransition(fn) {
  isInTransition = true;
  fn();
  isInTransition = false;
}

function setState(value, label) {
  if (isInTransition) {
    // Non-urgent: can be interrupted
    log.push([transition] \${label}=\${value});
  } else {
    // Urgent: runs immediately
    log.push([urgent] \${label}=\${value});
  }
}

// Urgent update (typing in input)
setState('a', 'query');

// Non-urgent update (filtering 10k items)
startTransition(() => {
  setState([1, 2, 3], 'results');
});

// Another urgent update interrupts
setState('ab', 'query');

console.log(log[0]);
console.log(log[1]);
console.log(log[2]);`,
    answer: "[urgent] query=a\n[transition] results=1,2,3\n[urgent] query=ab",
    explanation:
      "Urgent updates (plain setState) run immediately. Transition updates are marked non-urgent — React can pause and discard them if urgent updates come in.",
    keyInsight:
      "startTransition tells React: this update can be interrupted. Use it for expensive non-urgent updates (search results, filtering) so the UI stays responsive during typing.",
  },

  {
    id: 3026,
    cat: "Event Loop & Batching",
    difficulty: "medium",
    title: "Promise chain order inside useEffect",
    tags: ["useEffect", "promise", "async", "order"],
    companies: ["Meta", "Razorpay", "Swiggy"],
    code: `const log = [];

// Simulates an async useEffect
function simulateEffect() {
  log.push('effect start');

  Promise.resolve('data')
    .then(data => {
      log.push('data received: ' + data);
      return data.toUpperCase();
    })
    .then(upper => {
      log.push('set state: ' + upper);
    });

  log.push('effect end (sync part)');
}

simulateEffect();
log.push('after effect setup');

setTimeout(() => console.log(log.join(' | ')), 10);`,
    answer:
      "effect start | effect end (sync part) | after effect setup | data received: data | set state: DATA",
    explanation:
      "The synchronous parts run first (effect start, effect end, after effect). Promise .then callbacks run as microtasks — after sync but before setTimeout.",
    keyInsight:
      "In useEffect with async code, the synchronous part runs immediately after render. Promise resolutions run as microtasks. State updates from async code still trigger re-renders.",
  },

  {
    id: 3027,
    cat: "Event Loop & Batching",
    difficulty: "hard",
    title: "Race condition — last request wins with cancelled flag",
    tags: ["race-condition", "async", "cancel", "useEffect"],
    companies: ["Meta", "Google", "Razorpay", "Atlassian"],
    code: `function fetchWithCancel(id, delay) {
  let cancelled = false;
  const promise = new Promise(resolve =>
    setTimeout(() => resolve({ id, data: result-\${id} }), delay)
  );
  return {
    result: promise.then(r => cancelled ? null : r),
    cancel: () => { cancelled = true; }
  };
}

let activeResult = null;

// Simulate rapid userId changes (like fast typing)
let cleanup = null;
[1, 2, 3].forEach((id, i) => {
  setTimeout(() => {
    if (cleanup) cleanup(); // cancel previous

    const { result, cancel } = fetchWithCancel(id, 20);
    cleanup = cancel;

    result.then(r => {
      if (r) {
        activeResult = r.data;
      }
    });
  }, i * 5); // each request starts 5ms apart, takes 20ms
});

setTimeout(() => console.log(activeResult), 100);`,
    answer: "result-3",
    explanation:
      "Request 1 starts at 0ms, request 2 at 5ms (cancels 1), request 3 at 10ms (cancels 2). Only request 3 is not cancelled. It resolves after 30ms with 'result-3'.",
    keyInsight:
      "This is the canonical useEffect cleanup pattern for async data fetching. Return a cleanup that sets `cancelled = true` to ignore stale responses when the component re-renders or unmounts.",
  },

  {
    id: 3028,
    cat: "Event Loop & Batching",
    difficulty: "medium",
    title: "useLayoutEffect vs useEffect timing",
    tags: ["useLayoutEffect", "useEffect", "timing", "synchronous"],
    companies: ["Meta", "Flipkart", "Google"],
    code: `const log = [];

// useLayoutEffect fires synchronously after DOM mutations but before paint
function simulateLayoutEffect(fn) {
  log.push('DOM mutation');
  fn(); // synchronous — blocking
  log.push('browser paints here');
}

// useEffect fires after paint
function simulateEffect(fn) {
  log.push('browser paints here');
  queueMicrotask(fn); // async — after paint
}

// Scenario 1: useLayoutEffect
log.push('render');
simulateLayoutEffect(() => log.push('layout effect'));

// Scenario 2: useEffect
log.push('---');
log.push('render2');
simulateEffect(() => log.push('effect'));

setTimeout(() => console.log(log.join(' | ')), 10);`,
    answer:
      "render | DOM mutation | layout effect | browser paints here | --- | render2 | browser paints here | effect",
    explanation:
      "useLayoutEffect: fires synchronously after DOM update, BEFORE browser paints. useEffect: fires after paint. Layout effect can update DOM without the user seeing a flicker.",
    keyInsight:
      "Use useLayoutEffect only when you need to read DOM measurements and update state/DOM before the user sees anything (avoid flicker). For everything else, use useEffect.",
  },

  {
    id: 3029,
    cat: "Event Loop & Batching",
    difficulty: "hard",
    title: "Suspense — component throws Promise, boundary catches it",
    tags: ["Suspense", "promise", "throw", "concurrent"],
    companies: ["Meta", "Google", "Atlassian"],
    code: `// Simplified Suspense simulation
const cache = new Map();

function fetchData(key) {
  if (cache.has(key)) return cache.get(key); // resolved — return value
  const promise = new Promise(resolve =>
    setTimeout(() => { cache.set(key, 'data:' + key); resolve(); }, 10)
  );
  throw promise; // not resolved — throw Promise
}

function trySuspend(key) {
  try {
    const data = fetchData(key);
    return data;
  } catch (e) {
    if (e instanceof Promise) return 'loading...';
    throw e;
  }
}

console.log(trySuspend('users'));  // cache miss

// Simulate promise resolving
setTimeout(() => {
  console.log(trySuspend('users')); // cache hit
}, 20);`,
    answer: "loading...\ndata:users",
    explanation:
      "First call: cache miss, fetchData throws a Promise, caught and returns 'loading...'. After timeout, cache is populated. Second call: cache hit, returns 'data:users'.",
    keyInsight:
      "Suspense works because components CAN throw Promises. React catches the thrown Promise, shows the fallback, and re-renders when it resolves. This is the 'throw to suspend' protocol.",
  },

  {
    id: 3030,
    cat: "Event Loop & Batching",
    difficulty: "medium",
    title: "Concurrent rendering — work can be interrupted",
    tags: ["concurrent", "startTransition", "interruptible", "rendering"],
    companies: ["Meta", "Google"],
    code: `const log = [];
let interrupted = false;

// Simulates concurrent rendering — work can be interrupted
function doWork(items, onItem) {
  for (const item of items) {
    if (interrupted) {
      log.push('interrupted at ' + item);
      return false; // work abandoned
    }
    onItem(item);
  }
  return true; // completed
}

// Low priority work
const lowPriWork = [1, 2, 3, 4, 5];
let lowPriDone = false;

// Urgent work interrupts
setTimeout(() => {
  interrupted = true;
  log.push('urgent work runs');
  interrupted = false;
  // Low pri work would restart here in real React
}, 0);

const completed = doWork(lowPriWork, (n) => {
  log.push('processed ' + n);
  if (n === 3) interrupted = true; // simulate interrupt after item 3
});

console.log(completed);
console.log(log.join(' | '));`,
    answer: "false\nprocessed 1 | processed 2 | processed 3 | interrupted at 4",
    explanation:
      "Work processes items 1,2,3 then gets interrupted at 4. doWork returns false (not completed). In real Concurrent React, work is abandoned and restarted from scratch.",
    keyInsight:
      "Concurrent React can interrupt slow renders. This is why render functions must be pure — React may call them multiple times or discard partial results.",
  },

  // ─── MEMOIZATION & IDENTITY (6) ───────────────────────────────────────────

  {
    id: 3031,
    cat: "Memoization & Identity",
    difficulty: "medium",
    title: "React.memo — skips when props shallowly equal",
    tags: ["React.memo", "shallow-equal", "re-render", "identity"],
    companies: ["Meta", "Flipkart", "Razorpay", "Google"],
    code: `function shallowEqual(a, b) {
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(k => a[k] === b[k]);
}

let renderCount = 0;
function memo(Component) {
  let prevProps = null;
  return (props) => {
    if (prevProps && shallowEqual(prevProps, props)) return 'skipped';
    prevProps = props;
    renderCount++;
    return Component(props);
  };
}

const Child = ({ x, y }) => 'rendered:' + x + ',' + y;
const MemoChild = memo(Child);

console.log(MemoChild({ x: 1, y: 2 })); // first render
console.log(MemoChild({ x: 1, y: 2 })); // same props
console.log(MemoChild({ x: 1, y: 3 })); // y changed
console.log(renderCount);`,
    answer: "rendered:1,2\nskipped\nrendered:1,3\n2",
    explanation:
      "First render: no prevProps, renders. Second: same props (shallowEqual true), skipped. Third: y changed (3≠2), re-renders. Total renders: 2.",
    keyInsight:
      "React.memo does shallow prop comparison. If a parent passes a new object/function reference each render (even with same content), memo will NOT skip. Combine with useMemo/useCallback.",
  },

  {
    id: 3032,
    cat: "Memoization & Identity",
    difficulty: "medium",
    title: "useMemo — recomputes only on dep change",
    tags: ["useMemo", "computation", "deps", "memoization"],
    companies: ["Meta", "Flipkart", "Atlassian"],
    code: `let computeCount = 0;

function useMemo(factory, deps) {
  let cached = null;
  return function get(newDeps) {
    if (cached && newDeps.every((d, i) => d === cached.deps[i])) {
      return cached.value;
    }
    computeCount++;
    cached = { value: factory(...newDeps), deps: newDeps };
    return cached.value;
  };
}

const getFiltered = useMemo(
  (items, query) => items.filter(x => x.includes(query)),
  []
);

const items = ['apple', 'banana', 'apricot'];

const r1 = getFiltered([items, 'ap']);
const r2 = getFiltered([items, 'ap']);  // same deps
const r3 = getFiltered([items, 'ban']); // query changed

console.log(computeCount);
console.log(r1.join(','));
console.log(r2.join(','));
console.log(r3.join(','));`,
    answer: "2\napple,apricot\napple,apricot\nbanana",
    explanation:
      "computeCount=2 (initial + when query changed to 'ban'). r1 and r2 are the same computation. r3 recomputes with new query.",
    keyInsight:
      "useMemo prevents expensive recomputation when inputs haven't changed. The result reference is also stable — good for passing to React.memo children as props.",
  },

  {
    id: 3033,
    cat: "Memoization & Identity",
    difficulty: "hard",
    title: "New object prop bypasses React.memo",
    tags: ["React.memo", "identity", "object-prop", "re-render"],
    companies: ["Meta", "Flipkart", "Razorpay", "CRED"],
    code: `function shallowEqual(a, b) {
  return Object.keys(a).every(k => a[k] === b[k]) &&
         Object.keys(b).every(k => b[k] === a[k]);
}

let renders = 0;
function memo(Component) {
  let prev = null;
  return (props) => {
    if (prev && shallowEqual(prev, props)) { return 'skipped'; }
    prev = props;
    renders++;
    return Component(props);
  };
}

const List = ({ items }) => 'list:' + items.join(',');
const MemoList = memo(List);

const stableItems = [1, 2, 3]; // defined outside

console.log(MemoList({ items: stableItems }));  // render
console.log(MemoList({ items: stableItems }));  // skip — same ref
console.log(MemoList({ items: [1, 2, 3] }));    // render — new array!
console.log(renders);`,
    answer: "list:1,2,3\nskipped\nlist:1,2,3\n2",
    explanation:
      "stableItems is the same reference both times — skip. [1,2,3] literal creates a new array each call — different reference → re-renders despite same content.",
    keyInsight:
      "This is the most common React.memo pitfall. Inline object/array literals in JSX (<List items={[1,2,3]} />) create new references every parent render, defeating memo.",
  },

  {
    id: 3034,
    cat: "Memoization & Identity",
    difficulty: "medium",
    title: "useCallback vs inline function — identity difference",
    tags: ["useCallback", "identity", "function", "memo"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    code: `function useCallback(fn, deps) {
  let saved = null;
  return function get(newDeps) {
    if (saved && newDeps.every((d,i) => d === saved.deps[i])) return saved.fn;
    saved = { fn, deps: newDeps };
    return saved.fn;
  };
}

// Inline function: new reference every call
const a1 = (x) => x * 2;
const a2 = (x) => x * 2;

// useCallback: same reference when deps unchanged
const getId = useCallback((id) => id, []);
const ref1 = getId([]);
const ref2 = getId([]);

console.log(a1 === a2);     // different inline functions
console.log(ref1 === ref2); // same stable reference
console.log(typeof ref1);`,
    answer: "false\ntrue\nfunction",
    explanation:
      "a1 and a2 are defined separately — different objects even with same source code. useCallback returns the SAME function reference when deps don't change.",
    keyInsight:
      "Every render creates new function instances for inline arrow functions. useCallback solves this by returning a cached reference. This is crucial when passing callbacks to React.memo children.",
  },

  {
    id: 3035,
    cat: "Memoization & Identity",
    difficulty: "hard",
    title: "Context re-render — every consumer re-renders on value change",
    tags: ["context", "re-render", "value-reference", "optimization"],
    companies: ["Meta", "Google", "Razorpay", "Atlassian"],
    code: `let renders = { A: 0, B: 0, C: 0 };

// Simulates context provider with value
function createProvider(value) {
  return {
    subscribe(component, selector) {
      return {
        render() {
          renders[component]++;
          return selector(value);
        }
      };
    }
  };
}

// Round 1: provider with { user, theme }
const v1 = { user: 'Alice', theme: 'dark' };
const p1 = createProvider(v1);
const subA = p1.subscribe('A', v => v.user);
const subB = p1.subscribe('B', v => v.theme);

subA.render(); subB.render();

// Round 2: only theme changed, but ALL consumers re-render (no selectors in Context)
const v2 = { user: 'Alice', theme: 'light' }; // new object, user unchanged
const p2 = createProvider(v2);
const subC = p2.subscribe('C', v => v.user); // same user

subC.render(); // re-renders even though user didn't change

console.log(renders.A);
console.log(renders.B);
console.log(renders.C);`,
    answer: "1\n1\n1",
    explanation:
      "All three subscriptions render once each. In real React Context, ALL consumers re-render when the context value changes, regardless of which field they use.",
    keyInsight:
      "React Context has no built-in selector optimization. When any context value changes, ALL consumers re-render. Use separate contexts per concern, or state management tools like Zustand that have subscription-based selectors.",
  },

  {
    id: 3036,
    cat: "Memoization & Identity",
    difficulty: "hard",
    title: "Stable context value with useMemo prevents cascading re-renders",
    tags: ["context", "useMemo", "stable-reference", "optimization"],
    companies: ["Meta", "Google", "Atlassian", "CRED"],
    code: `let ctxRenders = 0;

function simulate(getContextValue, numRenders) {
  let prevValue = null;
  for (let i = 0; i < numRenders; i++) {
    const newValue = getContextValue();
    if (newValue !== prevValue) {
      ctxRenders++;
    }
    prevValue = newValue;
  }
}

let user = { name: 'Alice' };

// Unstable: new object every render
simulate(() => ({ user, login: () => {} }), 5);
console.log(ctxRenders); // 5 re-renders (new obj every time)

// Stable: memoized — same reference if user unchanged
ctxRenders = 0;
const stableValue = { user, login: () => {} }; // created once
simulate(() => stableValue, 5);
console.log(ctxRenders); // 1 (only first render)`,
    answer: "5\n1",
    explanation:
      "Unstable: {} creates new object each call → 5 different references → 5 re-renders. Stable: same reference every time → only the first render differs from null.",
    keyInsight:
      "In a Provider, wrap the value in useMemo: <Ctx.Provider value={useMemo(() => ({user, login}), [user])}> — this prevents all consumers from re-rendering on every parent render.",
  },

  // ─── COMPONENT PATTERNS (6) ───────────────────────────────────────────────

  {
    id: 3037,
    cat: "Component Patterns",
    difficulty: "medium",
    title: "Children prop — components as data",
    tags: ["children", "composition", "props", "patterns"],
    companies: ["Meta", "Flipkart", "Atlassian"],
    code: `// Simulates React's children prop pattern
function Card({ title, children }) {
  return [Card: \${title}] \${children};
}

function Button({ onClick, children }) {
  return [Btn: \${children}];
}

// Composition — Card wraps Button
const result = Card({
  title: 'Actions',
  children: Button({ children: 'Submit' }) + ' ' + Button({ children: 'Cancel' })
});

console.log(result);

// HOC composes by wrapping
function withBorder(Component) {
  return (props) => |\${Component(props)}|;
}

const BorderedCard = withBorder(Card);
console.log(BorderedCard({ title: 'Box', children: 'content' }));`,
    answer:
      "[Card: Actions] [Btn: Submit] [Btn: Cancel]\n|[Card: Box] content|",
    explanation:
      "children prop passes rendered JSX as data. HOC wraps the component, adding decoration around the output.",
    keyInsight:
      "React's composition model: components accept children as props and render them wherever they want. This is more flexible than inheritance and avoids prop drilling.",
  },

  {
    id: 3038,
    cat: "Component Patterns",
    difficulty: "hard",
    title: "Render props — caller controls rendering",
    tags: ["render-props", "children", "patterns", "inversion"],
    companies: ["Meta", "Atlassian", "CRED", "Google"],
    code: `// DataFetcher exposes data via render prop
function DataFetcher(url, render) {
  // Simulated data
  const data = { users: ['Alice', 'Bob'], count: 2 };
  return render(data);
}

// Different rendering strategies for same data
const list = DataFetcher('/api/users', ({ users }) =>
  'List: ' + users.join(', ')
);

const count = DataFetcher('/api/users', ({ count }) =>
  'Count: ' + count
);

const table = DataFetcher('/api/users', ({ users }) =>
  'Table rows: ' + users.length
);

console.log(list);
console.log(count);
console.log(table);`,
    answer: "List: Alice, Bob\nCount: 2\nTable rows: 2",
    explanation:
      "DataFetcher provides the data; the caller decides how to render it. Three different callers produce three different outputs from the same data.",
    keyInsight:
      "Render props invert control: the component owns STATE/behavior, the caller owns RENDERING. This is how libraries like react-table and Downshift work.",
  },

  {
    id: 3039,
    cat: "Component Patterns",
    difficulty: "medium",
    title: "Controlled vs uncontrolled — who owns the value?",
    tags: ["controlled", "uncontrolled", "state", "patterns"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    code: `// Controlled: parent owns value, child just displays
function ControlledInput(value, onChange) {
  // The value comes from outside — child can't change it directly
  return {
    value,
    type: 'controlled',
    handleChange(newVal) {
      onChange(newVal); // notify parent — parent decides if value changes
    }
  };
}

// Uncontrolled: component owns value internally
function UncontrolledInput(defaultValue) {
  let internalValue = defaultValue;
  return {
    value: internalValue,
    type: 'uncontrolled',
    handleChange(newVal) {
      internalValue = newVal; // self-managed, no parent needed
    }
  };
}

let parentValue = 'hello';
const controlled = ControlledInput(parentValue, v => { parentValue = v; });
const uncontrolled = UncontrolledInput('world');

controlled.handleChange('new');
uncontrolled.handleChange('updated');

console.log(parentValue);
console.log(uncontrolled.value);
console.log(controlled.type);`,
    answer: "new\nworld\ncontrolled",
    explanation:
      "Controlled: onChange updates parentValue, which would flow back as the new value prop. Uncontrolled: internalValue updates but the value property captured the initial 'world'.",
    keyInsight:
      "Controlled = React state is truth. Uncontrolled = DOM is truth. Controlled components are preferred because you can validate, transform, and react to every change.",
  },

  {
    id: 3040,
    cat: "Component Patterns",
    difficulty: "hard",
    title: "Compound components — shared context without props",
    tags: ["compound-components", "context", "composition", "patterns"],
    companies: ["Meta", "Atlassian", "CRED", "Google"],
    code: `// Simulates compound component pattern
function createTabs() {
  let activeTab = null;
  const state = { active: null };

  return {
    Root(defaultTab, render) {
      state.active = defaultTab;
      return render(state);
    },
    Tab(id, label) {
      return {
        id, label,
        isActive: () => state.active === id,
        activate: () => { state.active = id; }
      };
    },
  };
}

const Tabs = createTabs();

const tab1 = Tabs.Tab('home', 'Home');
const tab2 = Tabs.Tab('settings', 'Settings');

Tabs.Root('home', () => null); // set default

console.log(tab1.isActive()); // home is active
console.log(tab2.isActive());

tab2.activate();
console.log(tab1.isActive()); // home no longer active
console.log(tab2.isActive());`,
    answer: "true\nfalse\nfalse\ntrue",
    explanation:
      "Shared state.active acts like context. Both Tab instances read from the same state object. Activating tab2 changes state.active — tab1.isActive() now returns false.",
    keyInsight:
      "Compound components share state through context implicitly. Users compose them freely (<Tabs><Tab id='home'/></Tabs>) without managing the active state themselves.",
  },

  // ─── ASYNC IN REACT (4) ───────────────────────────────────────────────────

  {
    id: 3041,
    cat: "Async in React",
    difficulty: "hard",
    title: "AbortController — cancel fetch on unmount",
    tags: ["AbortController", "cleanup", "useEffect", "cancel"],
    companies: ["Meta", "Razorpay", "Atlassian", "Google"],
    code: `// Simulates useEffect cleanup with AbortController
function makeFetch(signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new Error('AbortError'));
      } else {
        resolve('data loaded');
      }
    }, 10);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('AbortError'));
    });
  });
}

const controller = new AbortController();
let result = null;

makeFetch(controller.signal)
  .then(data => { result = data; })
  .catch(e => { result = 'cancelled: ' + e.message; });

// Component "unmounts" before fetch completes
controller.abort();

setTimeout(() => console.log(result), 20);`,
    answer: "cancelled: AbortError",
    explanation:
      "abort() fires before the 10ms fetch completes. The abort event listener rejects the promise. .catch captures it as 'cancelled: AbortError'.",
    keyInsight:
      "This is the correct useEffect cleanup for fetch: return () => controller.abort(). When the component unmounts or deps change, the pending request is cancelled — preventing state updates on unmounted components.",
  },

  {
    id: 3042,
    cat: "Async in React",
    difficulty: "medium",
    title: "Promise.all in useEffect — parallel fetch, single state update",
    tags: ["Promise.all", "parallel", "useEffect", "data-fetching"],
    companies: ["Meta", "Razorpay", "Swiggy", "Flipkart"],
    code: `const log = [];

async function fetchDashboard() {
  log.push('fetching...');

  const [user, posts, notifications] = await Promise.all([
    Promise.resolve({ name: 'Alice' }),
    Promise.resolve(['Post1', 'Post2']),
    Promise.resolve(3),
  ]);

  // Single state update after all data is ready
  log.push(user: \${user.name});
  log.push(posts: \${posts.length});
  log.push(notifs: \${notifications});
  log.push('setState called once');
}

fetchDashboard().then(() => console.log(log.join(' | ')));`,
    answer:
      "fetching... | user: Alice | posts: 2 | notifs: 3 | setState called once",
    explanation:
      "All three fetches run in parallel. When all resolve, setState is called once with all data. No intermediate loading states for each piece.",
    keyInsight:
      "Promise.all for parallel independent fetches in useEffect avoids multiple setState calls (and re-renders) per load. One await, all data, one state update.",
  },

  {
    id: 3043,
    cat: "Async in React",
    difficulty: "hard",
    title: "Optimistic update — immediate UI, rollback on failure",
    tags: ["optimistic-update", "rollback", "state", "async"],
    companies: ["Meta", "Flipkart", "Swiggy", "Razorpay"],
    code: `async function toggleLike(id, liked, updateUI, revertUI, saveToServer) {
  // Optimistic: update UI immediately
  updateUI(!liked);

  try {
    await saveToServer(id, !liked);
    // Success: UI already correct
  } catch {
    // Failure: revert to original state
    revertUI(liked);
  }
}

let uiState = false;
let serverSaveFails = true;

const log = [];

toggleLike(
  1,
  false,
  val => { uiState = val; log.push('ui→' + val); },
  val => { uiState = val; log.push('revert→' + val); },
  () => serverSaveFails ? Promise.reject() : Promise.resolve()
).then(() => console.log(log.join(' | ')));`,
    answer: "ui→true | revert→false",
    explanation:
      "UI immediately shows liked=true (optimistic). Server save fails. Revert sets UI back to liked=false. User sees instant feedback, then the rollback.",
    keyInsight:
      "Optimistic updates give instant UI feedback. Always store the previous state before the optimistic update so you can revert on failure. React Query's useMutation handles this pattern automatically.",
  },

  {
    id: 3044,
    cat: "Async in React",
    difficulty: "medium",
    title: "Debounced search — only fires after typing stops",
    tags: ["debounce", "search", "performance", "async"],
    companies: ["Flipkart", "Swiggy", "Razorpay", "CRED"],
    code: `function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const searchLog = [];
let searchCallCount = 0;

const search = debounce((query) => {
  searchCallCount++;
  searchLog.push('search:' + query);
}, 50);

// Simulate fast typing
['r', 're', 'rea', 'reac', 'react'].forEach((q, i) => {
  setTimeout(() => search(q), i * 10); // 10ms apart, debounce is 50ms
});

// After all typing stops (5 * 10 = 50ms) + 50ms debounce = 100ms
setTimeout(() => {
  console.log(searchCallCount);
  console.log(searchLog[0]);
}, 150);`,
    answer: "1\nsearch:react",
    explanation:
      "Each keystroke resets the 50ms timer. Only the last keystroke ('react' at 40ms) fires — its timer completes at 90ms with no further input.",
    keyInsight:
      "Debouncing in React: useEffect with a setTimeout + cleanup. The cleanup clears the pending timeout when the value changes, so only the final value triggers the actual search.",
  },

  // ─── REFS & SIDE EFFECTS (4) ──────────────────────────────────────────────

  {
    id: 3045,
    cat: "Refs & Side Effects",
    difficulty: "medium",
    title: "Ref vs state — ref doesn't cause re-render",
    tags: ["useRef", "state", "re-render", "mutable"],
    companies: ["Meta", "Flipkart", "Razorpay"],
    code: `let stateRenders = 0;
let refRenders = 0;

// Simulates useState — update triggers re-render
function withState() {
  let count = 0;
  function setState(v) {
    count = v;
    stateRenders++; // re-render
  }
  return { getCount: () => count, setState };
}

// Simulates useRef — update does NOT trigger re-render
function withRef() {
  const ref = { current: 0 };
  function setRef(v) {
    ref.current = v;
    // NO re-render
  }
  return { getRef: () => ref.current, setRef };
}

const s = withState();
const r = withRef();

s.setState(1); s.setState(2); s.setState(3);
r.setRef(1);   r.setRef(2);   r.setRef(3);

console.log(stateRenders);
console.log(refRenders);
console.log(s.getCount());
console.log(r.getRef());`,
    answer: "3\n0\n3\n3",
    explanation:
      "Each setState triggers a re-render (3 total). Ref mutations never trigger re-renders (0). Both hold the latest value (3).",
    keyInsight:
      "Use ref when you need a mutable value that doesn't affect rendering (previous value, interval ID, abort controller). Use state when the value affects what's displayed.",
  },

  {
    id: 3046,
    cat: "Refs & Side Effects",
    difficulty: "medium",
    title: "forwardRef — parent accesses child's DOM node",
    tags: ["forwardRef", "ref", "DOM", "imperative"],
    companies: ["Meta", "Atlassian", "Flipkart"],
    code: `// Simulates forwardRef pattern
function FancyInput(props, ref) {
  const input = {
    focus() { console.log('focused'); },
    value: props.defaultValue || '',
  };
  if (ref) ref.current = input;
  return input;
}

function withForwardRef(Component) {
  return (props) => {
    const ref = props._ref; // simulated forwardRef
    return Component(props, ref);
  };
}

const ForwardedInput = withForwardRef(FancyInput);

// Parent creates ref and passes it
const inputRef = { current: null };
ForwardedInput({ defaultValue: 'hello', _ref: inputRef });

console.log(inputRef.current !== null);
console.log(typeof inputRef.current.focus);
inputRef.current.focus();
console.log(inputRef.current.value);`,
    answer: "true\nfunction\nfocused\nhello",
    explanation:
      "forwardRef passes the ref from parent to the internal DOM node. Parent can then call imperative methods like focus().",
    keyInsight:
      "forwardRef is the mechanism for parent components to call DOM methods on a child's internal elements. Pair with useImperativeHandle to expose a controlled API instead of raw DOM.",
  },

  {
    id: 3047,
    cat: "Refs & Side Effects",
    difficulty: "hard",
    title: "useImperativeHandle — expose limited API via ref",
    tags: ["useImperativeHandle", "forwardRef", "ref", "encapsulation"],
    companies: ["Meta", "Google", "Atlassian"],
    code: `// Simulates useImperativeHandle
function createImperativeHandle(ref, factory) {
  ref.current = factory();
}

// Child exposes ONLY what it wants
function VideoPlayer(ref) {
  const internal = {
    play()  { return 'playing'; },
    pause() { return 'paused'; },
    seek(t) { return 'seeked to ' + t; },
    _internalState: 'hidden', // should NOT be exposed
  };

  createImperativeHandle(ref, () => ({
    play:  () => internal.play(),
    pause: () => internal.pause(),
    // seek and _internalState NOT exposed
  }));
}

const playerRef = { current: null };
VideoPlayer(playerRef);

console.log(typeof playerRef.current.play);
console.log(typeof playerRef.current.seek);
console.log(playerRef.current._internalState);
console.log(playerRef.current.play());`,
    answer: "function\nundefined\nundefined\nplaying",
    explanation:
      "useImperativeHandle replaces ref.current with a custom object. Only play and pause are exposed. seek and _internalState are hidden.",
    keyInsight:
      "useImperativeHandle prevents parents from directly accessing internal DOM nodes or state. Expose only the API you want to maintain — it's the ref equivalent of keeping implementation details private.",
  },

  {
    id: 3048,
    cat: "Refs & Side Effects",
    difficulty: "hard",
    title: "Ref callback — fires on mount and unmount",
    tags: ["ref-callback", "DOM", "lifecycle", "mount"],
    companies: ["Meta", "Google", "Flipkart"],
    code: `const log = [];

// Ref callback: called with element on mount, null on unmount
function useRefCallback(callback) {
  return function refFn(element) {
    if (element !== null) {
      callback(element);  // mounted
    } else {
      callback(null);     // unmounted
    }
  };
}

// Simulate component lifecycle
function simulateMount(refFn) {
  const element = { tag: 'div', id: 'app' };
  refFn(element); // mount
  return element;
}

function simulateUnmount(refFn) {
  refFn(null); // unmount
}

const refFn = useRefCallback(el => {
  if (el) log.push('mounted: ' + el.tag);
  else log.push('unmounted');
});

const el = simulateMount(refFn);
console.log(log.length);

simulateUnmount(refFn);
console.log(log.join(' | '));`,
    answer: "1\nmounted: div | unmounted",
    explanation:
      "Ref callback fires with the DOM element on mount, then null on unmount. This gives you exact mount/unmount timing without useEffect.",
    keyInsight:
      "Ref callbacks are an alternative to useRef + useEffect for DOM setup. They fire synchronously during commit phase and automatically clean up. Useful for measuring DOM on mount.",
  },
];

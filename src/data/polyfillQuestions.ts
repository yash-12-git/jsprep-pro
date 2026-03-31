/**
 * src/data/reactPolyfillQuestions.ts
 * 25 React implementation questions — pure JS, runnable in iframe sandbox.
 * Each question implements a React concept from scratch without React.
 * Sandbox contract: stubCode + testCode concatenated → runs in iframe
 * testCode logs "PASS: X" or "FAIL: X — reason" only
 */

export interface PolyfillQuestion {
  id: number;
  cat:
    | "Hooks Implementation"
    | "State Management"
    | "Component Patterns"
    | "React Utilities"
    | "Virtual DOM";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  description: string;
  stubCode: string;
  testCode: string;
  solutionCode: string;
  expectedOutput: string;
  explanation: string;
  keyInsight: string;
  companies: string[];
  tags: string[];
  answer?: string;
}

export const POLYFILL_CATEGORIES = [
  "Hooks Implementation",
  "State Management",
  "Component Patterns",
  "React Utilities",
  "Virtual DOM",
] as const;

export const polyfillQuestions: PolyfillQuestion[] = [

  // ─── HOOKS IMPLEMENTATION ──────────────────────────────────────────────────

  {
    id: 2001,
    cat: "Hooks Implementation",
    difficulty: "medium",
    title: "Implement useState",
    tags: ["useState", "hooks", "closure", "state"],
    companies: ["Meta", "Google", "Razorpay", "Flipkart", "Microsoft"],
    description:
      "Implement a standalone useState(initialValue) that returns [value, setter]. The setter should accept either a new value or an updater function. Simulate React's hook call-order tracking using a module-level cursor.",
    stubCode:
      `let hooks = [];
let cursor = 0;

function useState(initialValue) {
  // Use the cursor to store state in hooks[]
  // Return [currentValue, setter]
  // Setter should accept value OR updater function
}

function resetCursor() { cursor = 0; }`,
    solutionCode:
      `let hooks = [];
let cursor = 0;

function useState(initialValue) {
  const idx = cursor++;
  if (hooks[idx] === undefined) {
    hooks[idx] = typeof initialValue === 'function' ? initialValue() : initialValue;
  }
  const setState = (newVal) => {
    hooks[idx] = typeof newVal === 'function' ? newVal(hooks[idx]) : newVal;
  };
  return [hooks[idx], setState];
}

function resetCursor() { cursor = 0; }`,
    testCode:
      `(function() {
  try {
    resetCursor();
    const [val, setVal] = useState(0);
    console.log(val === 0 ? 'PASS: initial value' : 'FAIL: initial value — got ' + val);

    setVal(5);
    resetCursor();
    const [val2] = useState(0);
    console.log(val2 === 5 ? 'PASS: setter works' : 'FAIL: setter works — got ' + val2);

    setVal(v => v + 10);
    resetCursor();
    const [val3] = useState(0);
    console.log(val3 === 15 ? 'PASS: updater fn' : 'FAIL: updater fn — got ' + val3);

    resetCursor();
    const [a] = useState(100);
    const [b] = useState(200);
    console.log(a === 15 && b === 200 ? 'PASS: cursor isolation' : 'FAIL: cursor isolation — ' + a + ',' + b);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial value\nPASS: setter works\nPASS: updater fn\nPASS: cursor isolation",
    explanation:
      "Each useState call gets a slot in the hooks array indexed by cursor. The cursor must be reset before re-rendering (calling hooks again). This is exactly how React tracks hook state internally.",
    keyInsight:
      "React tracks hooks by call ORDER, not by name. The cursor (index) into a flat array is the entire tracking mechanism.",
  },

  {
    id: 2002,
    cat: "Hooks Implementation",
    difficulty: "hard",
    title: "Implement useReducer",
    tags: ["useReducer", "hooks", "reducer", "dispatch"],
    companies: ["Meta", "Google", "Atlassian", "Razorpay"],
    description:
      "Implement useReducer(reducer, initialState). Returns [state, dispatch]. dispatch(action) should call reducer(currentState, action) and store the result. Support lazy initializer (third argument: initFn).",
    stubCode:
      `let hooks = [];
let cursor = 0;

function useReducer(reducer, initialState, initFn) {
  // initFn(initialState) is called if initFn is provided
  // dispatch(action) → newState = reducer(currentState, action)
}

function resetCursor() { cursor = 0; }`,
    solutionCode:
      `let hooks = [];
let cursor = 0;

function useReducer(reducer, initialState, initFn) {
  const idx = cursor++;
  if (hooks[idx] === undefined) {
    hooks[idx] = initFn ? initFn(initialState) : initialState;
  }
  const dispatch = (action) => {
    hooks[idx] = reducer(hooks[idx], action);
  };
  return [hooks[idx], dispatch];
}

function resetCursor() { cursor = 0; }`,
    testCode:
      `(function() {
  try {
    function counterReducer(state, action) {
      switch(action.type) {
        case 'INC': return { count: state.count + 1 };
        case 'DEC': return { count: state.count - 1 };
        case 'ADD': return { count: state.count + action.payload };
        default: return state;
      }
    }

    resetCursor();
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });
    console.log(state.count === 0 ? 'PASS: initial state' : 'FAIL: initial state — got ' + state.count);

    dispatch({ type: 'INC' });
    dispatch({ type: 'INC' });
    dispatch({ type: 'ADD', payload: 8 });
    resetCursor();
    const [state2] = useReducer(counterReducer, { count: 0 });
    console.log(state2.count === 10 ? 'PASS: dispatch updates' : 'FAIL: dispatch updates — got ' + state2.count);

    dispatch({ type: 'DEC' });
    resetCursor();
    const [state3] = useReducer(counterReducer, { count: 0 });
    console.log(state3.count === 9 ? 'PASS: dec works' : 'FAIL: dec works — got ' + state3.count);

    hooks = []; cursor = 0;
    const [ls] = useReducer((s,a) => s, null, (init) => ({ value: init * 2 }), 5);
    resetCursor();
    const [ls2] = useReducer((s,a) => s, 5, (init) => ({ value: init * 2 }));
    console.log(ls2.value === 10 ? 'PASS: lazy init' : 'FAIL: lazy init — got ' + JSON.stringify(ls2));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial state\nPASS: dispatch updates\nPASS: dec works\nPASS: lazy init",
    explanation:
      "useReducer stores state at cursor index. dispatch computes the next state by calling reducer(currentState, action) and stores it. The lazy initializer pattern avoids expensive computation on every render.",
    keyInsight:
      "useReducer = useState + externalized transition logic. dispatch is a stable function — reducer is the pure function that describes HOW state changes.",
  },

  {
    id: 2003,
    cat: "Hooks Implementation",
    difficulty: "medium",
    title: "Implement useRef",
    tags: ["useRef", "hooks", "mutable", "ref"],
    companies: ["Meta", "Flipkart", "Swiggy", "Microsoft"],
    description:
      "Implement useRef(initialValue). Returns a stable object { current: initialValue }. The SAME object must be returned on every call (same cursor slot). Mutating .current must NOT re-render (just store the value).",
    stubCode:
      `let hooks = [];
let cursor = 0;

function useRef(initialValue) {
  // Return the SAME {current} object every time for this cursor slot
}

function resetCursor() { cursor = 0; }`,
    solutionCode:
      `let hooks = [];
let cursor = 0;

function useRef(initialValue) {
  const idx = cursor++;
  if (hooks[idx] === undefined) {
    hooks[idx] = { current: initialValue };
  }
  return hooks[idx];
}

function resetCursor() { cursor = 0; }`,
    testCode:
      `(function() {
  try {
    resetCursor();
    const ref = useRef(0);
    console.log(ref.current === 0 ? 'PASS: initial value' : 'FAIL: initial value — got ' + ref.current);

    ref.current = 42;
    resetCursor();
    const ref2 = useRef(0);
    console.log(ref2.current === 42 ? 'PASS: mutation persists' : 'FAIL: mutation persists — got ' + ref2.current);

    const refA = ref2;
    resetCursor();
    const ref3 = useRef(0);
    console.log(ref3 === refA ? 'PASS: same object reference' : 'FAIL: same object reference');

    resetCursor();
    const r1 = useRef('a');
    const r2 = useRef('b');
    console.log(r1.current === 42 && r2.current === 'b' ? 'PASS: cursor isolation' : 'FAIL: cursor isolation — ' + r1.current + ',' + r2.current);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial value\nPASS: mutation persists\nPASS: same object reference\nPASS: cursor isolation",
    explanation:
      "useRef creates the ref object once and returns the exact same object on every render. This is why refs are stable — you're always reading/writing to the same box in memory, not a new one each render.",
    keyInsight:
      "useRef = a box (object) that persists for the lifetime of the component. Same identity every render. Mutating .current doesn't trigger re-render — no setState involved.",
  },

  {
    id: 2004,
    cat: "Hooks Implementation",
    difficulty: "hard",
    title: "Implement useMemo",
    tags: ["useMemo", "hooks", "memoization", "deps"],
    companies: ["Meta", "Google", "Atlassian", "CRED"],
    description:
      "Implement useMemo(factory, deps). Recomputes only when deps change (shallow comparison). Returns cached value otherwise. On first call always compute.",
    stubCode:
      `let hooks = [];
let cursor = 0;

function useMemo(factory, deps) {
  // Store { value, deps } at cursor slot
  // Recompute only if deps changed (shallow array compare)
}

function resetCursor() { cursor = 0; }`,
    solutionCode:
      `let hooks = [];
let cursor = 0;

function shallowEqualDeps(a, b) {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((dep, i) => dep === b[i]);
}

function useMemo(factory, deps) {
  const idx = cursor++;
  const prev = hooks[idx];
  if (!prev || !shallowEqualDeps(prev.deps, deps)) {
    hooks[idx] = { value: factory(), deps };
  }
  return hooks[idx].value;
}

function resetCursor() { cursor = 0; }`,
    testCode:
      `(function() {
  try {
    let computeCount = 0;
    const expensive = (n) => { computeCount++; return n * 2; };

    resetCursor();
    const v1 = useMemo(() => expensive(5), [5]);
    console.log(v1 === 10 ? 'PASS: initial compute' : 'FAIL: initial compute — got ' + v1);
    console.log(computeCount === 1 ? 'PASS: computed once' : 'FAIL: computed once — count=' + computeCount);

    resetCursor();
    const v2 = useMemo(() => expensive(5), [5]);
    console.log(computeCount === 1 ? 'PASS: cached on same deps' : 'FAIL: cached — count=' + computeCount);
    console.log(v2 === 10 ? 'PASS: returns cached value' : 'FAIL: returns cached — got ' + v2);

    resetCursor();
    const v3 = useMemo(() => expensive(7), [7]);
    console.log(computeCount === 2 ? 'PASS: recomputes on dep change' : 'FAIL: recomputes — count=' + computeCount);
    console.log(v3 === 14 ? 'PASS: new value' : 'FAIL: new value — got ' + v3);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial compute\nPASS: computed once\nPASS: cached on same deps\nPASS: returns cached value\nPASS: recomputes on dep change\nPASS: new value",
    explanation:
      "Store both the computed value and the deps array. On subsequent calls, compare old deps to new deps element-by-element. Only recompute if any dep changed.",
    keyInsight:
      "Deps comparison is SHALLOW and by reference — [5] !== [5] as new array instances but the dep VALUES (5===5) match. Compare element-by-element with ===, not the array itself.",
  },

  {
    id: 2005,
    cat: "Hooks Implementation",
    difficulty: "hard",
    title: "Implement useCallback",
    tags: ["useCallback", "hooks", "memoization", "function"],
    companies: ["Meta", "Google", "Flipkart", "Razorpay"],
    description:
      "Implement useCallback(fn, deps). Returns the same function reference if deps haven't changed. This is identical to useMemo(() => fn, deps) under the hood.",
    stubCode:
      `let hooks = [];
let cursor = 0;

function shallowEqualDeps(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((dep, i) => dep === b[i]);
}

function useCallback(fn, deps) {
  // Hint: this is just useMemo returning fn instead of fn()
}

function resetCursor() { cursor = 0; }`,
    solutionCode:
      `let hooks = [];
let cursor = 0;

function shallowEqualDeps(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((dep, i) => dep === b[i]);
}

function useCallback(fn, deps) {
  const idx = cursor++;
  const prev = hooks[idx];
  if (!prev || !shallowEqualDeps(prev.deps, deps)) {
    hooks[idx] = { fn, deps };
  }
  return hooks[idx].fn;
}

function resetCursor() { cursor = 0; }`,
    testCode:
      `(function() {
  try {
    const handler = (x) => x * 2;

    resetCursor();
    const cb1 = useCallback(handler, [1]);
    console.log(typeof cb1 === 'function' ? 'PASS: returns function' : 'FAIL: returns function');
    console.log(cb1(5) === 10 ? 'PASS: function works' : 'FAIL: function works — got ' + cb1(5));

    resetCursor();
    const cb2 = useCallback(handler, [1]);
    console.log(cb1 === cb2 ? 'PASS: same ref on same deps' : 'FAIL: same ref on same deps');

    resetCursor();
    const handler2 = (x) => x * 3;
    const cb3 = useCallback(handler2, [2]);
    console.log(cb3 !== cb1 ? 'PASS: new ref on dep change' : 'FAIL: new ref on dep change');
    console.log(cb3(5) === 15 ? 'PASS: new fn works' : 'FAIL: new fn works — got ' + cb3(5));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: returns function\nPASS: function works\nPASS: same ref on same deps\nPASS: new ref on dep change\nPASS: new fn works",
    explanation:
      "useCallback stores the function reference alongside deps. Returns the stored function if deps match. useCallback(fn, deps) is literally useMemo(() => fn, deps) — the only difference is we store fn directly, not fn().",
    keyInsight:
      "useCallback(fn, deps) === useMemo(() => fn, deps). React's source code implements useCallback this way. The function identity (===) is what React.memo and useEffect dep arrays check.",
  },

  {
    id: 2006,
    cat: "Hooks Implementation",
    difficulty: "hard",
    title: "Implement useEffect with cleanup",
    tags: ["useEffect", "hooks", "lifecycle", "cleanup", "deps"],
    companies: ["Meta", "Google", "Atlassian", "Razorpay"],
    description:
      "Implement useEffect(effect, deps). Run the effect when deps change. If the effect returns a function, call it as cleanup BEFORE the next effect runs. Support three modes: no deps array (every run), empty array (once), and dep array.",
    stubCode:
      `let hooks = [];
let cursor = 0;

function useEffect(effect, deps) {
  // Store { deps, cleanup } at cursor slot
  // Run cleanup from previous effect before running new one
  // deps === undefined → always run
  // deps === [] → run once
  // deps changed → run
}

function resetCursor() { cursor = 0; }
function runEffects() {
  // In real React, effects run after paint. Here, call this manually.
  // This function does NOT need implementation — effects run inline above.
}`,
    solutionCode:
      `let hooks = [];
let cursor = 0;

function shallowEqualDeps(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((dep, i) => dep === b[i]);
}

function useEffect(effect, deps) {
  const idx = cursor++;
  const prev = hooks[idx];
  const shouldRun = !prev || deps === undefined || !shallowEqualDeps(prev.deps, deps);

  if (shouldRun) {
    if (prev && typeof prev.cleanup === 'function') {
      prev.cleanup();
    }
    const cleanup = effect();
    hooks[idx] = { deps, cleanup: typeof cleanup === 'function' ? cleanup : null };
  }
}

function resetCursor() { cursor = 0; }`,
    testCode:
      `(function() {
  try {
    let log = [];

    // Test 1: runs on first call
    resetCursor();
    useEffect(() => { log.push('run1'); }, [1]);
    console.log(log[log.length-1] === 'run1' ? 'PASS: runs initially' : 'FAIL: runs initially');

    // Test 2: skips when deps unchanged
    resetCursor();
    useEffect(() => { log.push('run2'); }, [1]);
    console.log(log.length === 1 ? 'PASS: skips same deps' : 'FAIL: skips same deps — length=' + log.length);

    // Test 3: runs when deps change
    resetCursor();
    useEffect(() => { log.push('run3'); }, [2]);
    console.log(log[log.length-1] === 'run3' ? 'PASS: runs on dep change' : 'FAIL: runs on dep change');

    // Test 4: cleanup called before re-run
    let cleanupCount = 0;
    hooks = []; cursor = 0;
    resetCursor();
    useEffect(() => { return () => cleanupCount++; }, ['a']);
    resetCursor();
    useEffect(() => { return () => cleanupCount++; }, ['b']);
    console.log(cleanupCount === 1 ? 'PASS: cleanup on dep change' : 'FAIL: cleanup on dep change — count=' + cleanupCount);

    // Test 5: no deps = always run
    let alwaysCount = 0;
    hooks = []; cursor = 0;
    resetCursor(); useEffect(() => { alwaysCount++; });
    resetCursor(); useEffect(() => { alwaysCount++; });
    resetCursor(); useEffect(() => { alwaysCount++; });
    console.log(alwaysCount === 3 ? 'PASS: no deps runs always' : 'FAIL: no deps — count=' + alwaysCount);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: runs initially\nPASS: skips same deps\nPASS: runs on dep change\nPASS: cleanup on dep change\nPASS: no deps runs always",
    explanation:
      "Each slot stores the previous deps and cleanup function. Before running a new effect, check if deps changed. If so, call the old cleanup first, then run the new effect and store its cleanup.",
    keyInsight:
      "Cleanup runs BEFORE the next effect, not after. This is why cleanup order matters — it tears down the previous subscription before setting up the new one.",
  },

  {
    id: 2007,
    cat: "Hooks Implementation",
    difficulty: "medium",
    title: "Implement usePrevious custom hook",
    tags: ["usePrevious", "useRef", "custom-hook", "hooks"],
    companies: ["Flipkart", "Swiggy", "CRED", "Razorpay"],
    description:
      "Implement usePrevious(value) using useRef. Returns the value from the PREVIOUS call. On first call returns undefined. The ref should update AFTER returning the previous value (simulating useEffect timing).",
    stubCode:
      `let hooks = [];
let cursor = 0;

function useRef(initialValue) {
  const idx = cursor++;
  if (hooks[idx] === undefined) hooks[idx] = { current: initialValue };
  return hooks[idx];
}

function usePrevious(value) {
  // Use useRef to track the previous value
  // Return previous, then update the ref
}

function resetCursor() { cursor = 0; }`,
    solutionCode:
      `let hooks = [];
let cursor = 0;

function useRef(initialValue) {
  const idx = cursor++;
  if (hooks[idx] === undefined) hooks[idx] = { current: initialValue };
  return hooks[idx];
}

function usePrevious(value) {
  const ref = useRef(undefined);
  const prev = ref.current;
  ref.current = value;
  return prev;
}

function resetCursor() { cursor = 0; }`,
    testCode:
      `(function() {
  try {
    resetCursor();
    const p1 = usePrevious(10);
    console.log(p1 === undefined ? 'PASS: first call undefined' : 'FAIL: first call — got ' + p1);

    resetCursor();
    const p2 = usePrevious(20);
    console.log(p2 === 10 ? 'PASS: returns previous' : 'FAIL: returns previous — got ' + p2);

    resetCursor();
    const p3 = usePrevious(30);
    console.log(p3 === 20 ? 'PASS: tracks updates' : 'FAIL: tracks updates — got ' + p3);

    resetCursor();
    const p4 = usePrevious(30);
    console.log(p4 === 30 ? 'PASS: same value tracked' : 'FAIL: same value — got ' + p4);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: first call undefined\nPASS: returns previous\nPASS: tracks updates\nPASS: same value tracked",
    explanation:
      "Store the current value in a ref. On each call, read the ref (previous value), then update the ref to the new value. Return what you read — not what you just stored.",
    keyInsight:
      "usePrevious = read first, write second. This is a common interview question that tests understanding of ref timing: ref.current = value updates AFTER the return.",
  },

  // ─── STATE MANAGEMENT ─────────────────────────────────────────────────────

  {
    id: 2008,
    cat: "State Management",
    difficulty: "medium",
    title: "Implement a Redux-like createStore",
    tags: ["redux", "createStore", "store", "subscribe"],
    companies: ["Meta", "Google", "Flipkart", "Amazon", "Razorpay"],
    description:
      "Implement createStore(reducer, initialState). The store must have: getState(), dispatch(action), and subscribe(listener). subscribe returns an unsubscribe function. Listeners are called after every dispatch.",
    stubCode:
      `function createStore(reducer, initialState) {
  // Return { getState, dispatch, subscribe }
  // subscribe(listener) → returns unsubscribe fn
  // All listeners called after each dispatch
}`,
    solutionCode:
      `function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(l => l());
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // Dispatch init action to populate state if reducer has defaults
  dispatch({ type: '@@INIT' });

  return { getState, dispatch, subscribe };
}`,
    testCode:
      `(function() {
  try {
    function counterReducer(state = { count: 0 }, action) {
      switch(action.type) {
        case 'INC': return { count: state.count + 1 };
        case 'DEC': return { count: state.count - 1 };
        default: return state;
      }
    }

    const store = createStore(counterReducer);
    console.log(store.getState().count === 0 ? 'PASS: initial state' : 'FAIL: initial state — ' + store.getState().count);

    store.dispatch({ type: 'INC' });
    store.dispatch({ type: 'INC' });
    console.log(store.getState().count === 2 ? 'PASS: dispatch updates' : 'FAIL: dispatch — got ' + store.getState().count);

    let notified = 0;
    const unsub = store.subscribe(() => notified++);
    store.dispatch({ type: 'INC' });
    console.log(notified === 1 ? 'PASS: subscriber notified' : 'FAIL: subscriber — count=' + notified);

    unsub();
    store.dispatch({ type: 'INC' });
    console.log(notified === 1 ? 'PASS: unsubscribe works' : 'FAIL: unsubscribe — count=' + notified);

    console.log(store.getState().count === 4 ? 'PASS: state still updates after unsub' : 'FAIL: state — got ' + store.getState().count);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial state\nPASS: dispatch updates\nPASS: subscriber notified\nPASS: unsubscribe works\nPASS: state still updates after unsub",
    explanation:
      "Store holds state, a Set of listeners, and exposes three methods. dispatch runs the reducer then notifies all subscribers. subscribe adds to the Set and returns a closure that removes from it.",
    keyInsight:
      "Using a Set for listeners prevents duplicate subscriptions and makes unsubscribe O(1). The @@INIT dispatch initializes the reducer's default state.",
  },

  {
    id: 2009,
    cat: "State Management",
    difficulty: "hard",
    title: "Implement Redux applyMiddleware",
    tags: ["redux", "middleware", "applyMiddleware", "compose"],
    companies: ["Meta", "Google", "Atlassian", "CRED"],
    description:
      "Implement applyMiddleware(...middlewares). Each middleware receives { getState, dispatch } and returns next => action => result. The middleware chain wraps the store's dispatch. Implement compose helper too.",
    stubCode:
      `function compose(...fns) {
  // Right-to-left composition: compose(f,g,h)(x) = f(g(h(x)))
}

function applyMiddleware(...middlewares) {
  // Returns a store enhancer: (createStore) => (reducer, initialState) => store
  // Each middleware: ({ getState, dispatch }) => next => action => result
}`,
    solutionCode:
      `function compose(...fns) {
  if (fns.length === 0) return x => x;
  if (fns.length === 1) return fns[0];
  return fns.reduce((a, b) => (...args) => a(b(...args)));
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    let dispatch = store.dispatch;
    const api = { getState: store.getState, dispatch: (...args) => dispatch(...args) };
    const chain = middlewares.map(m => m(api));
    dispatch = compose(...chain)(store.dispatch);
    return { ...store, dispatch };
  };
}`,
    testCode:
      `(function() {
  try {
    function createStore(reducer, initialState) {
      let state = typeof initialState !== 'undefined' ? initialState : reducer(undefined, {type:'@@INIT'});
      const listeners = new Set();
      return {
        getState: () => state,
        dispatch: (action) => { state = reducer(state, action); listeners.forEach(l=>l()); return action; },
        subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); }
      };
    }

    const log = [];
    const loggerMiddleware = ({ getState }) => next => action => {
      log.push('before:' + action.type);
      const result = next(action);
      log.push('after:' + action.type);
      return result;
    };

    const thunkMiddleware = ({ dispatch, getState }) => next => action => {
      if (typeof action === 'function') return action(dispatch, getState);
      return next(action);
    };

    function reducer(state = 0, action) {
      return action.type === 'INC' ? state + 1 : state;
    }

    const enhancedCreate = applyMiddleware(thunkMiddleware, loggerMiddleware);
    const store = enhancedCreate(createStore)(reducer);

    store.dispatch({ type: 'INC' });
    console.log(store.getState() === 1 ? 'PASS: basic dispatch' : 'FAIL: basic dispatch — ' + store.getState());
    console.log(log.includes('before:INC') && log.includes('after:INC') ? 'PASS: middleware runs' : 'FAIL: middleware — ' + JSON.stringify(log));

    // Thunk dispatch
    store.dispatch((dispatch, getState) => {
      dispatch({ type: 'INC' });
      dispatch({ type: 'INC' });
    });
    console.log(store.getState() === 3 ? 'PASS: thunk works' : 'FAIL: thunk — got ' + store.getState());
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: basic dispatch\nPASS: middleware runs\nPASS: thunk works",
    explanation:
      "Each middleware receives the api (getState, dispatch) and returns a function that wraps 'next' (the next dispatch in the chain). compose chains them right-to-left so the first middleware runs first.",
    keyInsight:
      "Middleware signature: store => next => action => result. 'next' is the next middleware's dispatch. The final 'next' is the real store.dispatch. Compose chains them: each middleware wraps the one after it.",
  },

  {
    id: 2010,
    cat: "State Management",
    difficulty: "medium",
    title: "Implement a Zustand-like createStore",
    tags: ["zustand", "createStore", "subscribe", "selector"],
    companies: ["Vercel", "Atlassian", "CRED", "Razorpay"],
    description:
      "Implement create(setupFn) where setupFn receives set and get. Returns a hook-like function that accepts an optional selector. Subscriptions only fire when the selected value changes.",
    stubCode:
      `function create(setup) {
  // setup receives (set, get) → returns initial state object
  // set(partial) merges partial into state
  // The returned 'useStore' accepts optional selector fn
  // Subscribers receive (newState, oldState)
}`,
    solutionCode:
      `function create(setup) {
  let state;
  const listeners = new Set();

  function set(partial) {
    const prev = state;
    state = typeof partial === 'function'
      ? { ...state, ...partial(state) }
      : { ...state, ...partial };
    listeners.forEach(l => l(state, prev));
  }

  function get() { return state; }

  state = setup(set, get);

  function useStore(selector) {
    if (!selector) return state;
    return selector(state);
  }

  useStore.getState = get;
  useStore.setState = set;
  useStore.subscribe = (listener, selector) => {
    if (!selector) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
    let prev = selector(state);
    const wrapped = (newState) => {
      const next = selector(newState);
      if (next !== prev) { listener(next, prev); prev = next; }
    };
    listeners.add(wrapped);
    return () => listeners.delete(wrapped);
  };

  return useStore;
}`,
    testCode:
      `(function() {
  try {
    const useCount = create((set) => ({
      count: 0,
      increment: () => set(s => ({ count: s.count + 1 })),
      decrement: () => set(s => ({ count: s.count - 1 })),
    }));

    console.log(useCount(s => s.count) === 0 ? 'PASS: initial state' : 'FAIL: initial state');

    useCount.getState().increment();
    useCount.getState().increment();
    console.log(useCount(s => s.count) === 2 ? 'PASS: increment' : 'FAIL: increment — got ' + useCount(s=>s.count));

    let notified = 0;
    const unsub = useCount.subscribe((count) => notified++, s => s.count);
    useCount.getState().increment();
    useCount.getState().decrement();
    console.log(notified === 2 ? 'PASS: selector subscription' : 'FAIL: selector sub — count=' + notified);

    unsub();
    useCount.getState().increment();
    console.log(notified === 2 ? 'PASS: unsubscribe works' : 'FAIL: unsub — count=' + notified);
    console.log(useCount(s => s.count) === 3 ? 'PASS: state correct after unsub' : 'FAIL: state — got ' + useCount(s=>s.count));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial state\nPASS: increment\nPASS: selector subscription\nPASS: unsubscribe works\nPASS: state correct after unsub",
    explanation:
      "State is a plain object. set() merges partial updates (or applies an updater function). Subscriptions with selectors only fire when the selected slice changes — this is the key to Zustand's performance.",
    keyInsight:
      "Zustand's performance secret: subscriptions run selector(newState) and only notify the listener if the result changed (prev !== next). Components only re-render for the slices they care about.",
  },

  {
    id: 2011,
    cat: "State Management",
    difficulty: "medium",
    title: "Implement createContext and useContext",
    tags: ["createContext", "useContext", "context", "provider"],
    companies: ["Meta", "Google", "Flipkart", "Razorpay"],
    description:
      "Implement createContext(defaultValue) and useContext(context). The context object should have a Provider function that sets a value accessible by useContext within that scope. Use a stack to support nested providers.",
    stubCode:
      `function createContext(defaultValue) {
  // Return a context object with Provider and a way to read it
}

function useContext(context) {
  // Return the current value from the nearest Provider
}`,
    solutionCode:
      `function createContext(defaultValue) {
  const context = {
    _stack: [defaultValue],
    Provider(value, fn) {
      context._stack.push(value);
      try { fn(); }
      finally { context._stack.pop(); }
    },
    get _currentValue() {
      return context._stack[context._stack.length - 1];
    }
  };
  return context;
}

function useContext(context) {
  return context._currentValue;
}`,
    testCode:
      `(function() {
  try {
    const ThemeCtx = createContext('light');

    console.log(useContext(ThemeCtx) === 'light' ? 'PASS: default value' : 'FAIL: default — got ' + useContext(ThemeCtx));

    ThemeCtx.Provider('dark', () => {
      console.log(useContext(ThemeCtx) === 'dark' ? 'PASS: provider value' : 'FAIL: provider — got ' + useContext(ThemeCtx));

      ThemeCtx.Provider('high-contrast', () => {
        console.log(useContext(ThemeCtx) === 'high-contrast' ? 'PASS: nested provider' : 'FAIL: nested — got ' + useContext(ThemeCtx));
      });

      console.log(useContext(ThemeCtx) === 'dark' ? 'PASS: restored after nested' : 'FAIL: restore — got ' + useContext(ThemeCtx));
    });

    console.log(useContext(ThemeCtx) === 'light' ? 'PASS: default restored' : 'FAIL: default restore — got ' + useContext(ThemeCtx));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: default value\nPASS: provider value\nPASS: nested provider\nPASS: restored after nested\nPASS: default restored",
    explanation:
      "A stack models nested providers naturally. Provider pushes the value, runs the subtree function, then pops. useContext always reads the top of the stack — the nearest ancestor's value.",
    keyInsight:
      "Context is a stack, not a single value. Provider pushes, useContext peeks at top, Provider's finally block pops. This is why nested providers work — the innermost one wins.",
  },

  // ─── COMPONENT PATTERNS ───────────────────────────────────────────────────

  {
    id: 2012,
    cat: "Component Patterns",
    difficulty: "medium",
    title: "Implement a Higher-Order Component (HOC)",
    tags: ["HOC", "higher-order-component", "withLoading", "patterns"],
    companies: ["Meta", "Flipkart", "Swiggy", "Amazon"],
    description:
      "Implement withLoading(Component). Returns a new function that, when called with { isLoading, ...rest }, renders a loading indicator if isLoading is true, otherwise calls Component with the remaining props.",
    stubCode:
      `function withLoading(Component) {
  // Return a new function (wrapped component)
  // If props.isLoading is true → return 'Loading...'
  // Otherwise → call Component with remaining props
}`,
    solutionCode:
      `function withLoading(Component) {
  return function WithLoadingComponent(props) {
    const { isLoading, ...rest } = props;
    if (isLoading) return 'Loading...';
    return Component(rest);
  };
}`,
    testCode:
      `(function() {
  try {
    function UserCard({ name, age }) {
      return 'User: ' + name + ', ' + age;
    }

    const UserCardWithLoading = withLoading(UserCard);

    const r1 = UserCardWithLoading({ isLoading: true, name: 'Alice', age: 30 });
    console.log(r1 === 'Loading...' ? 'PASS: shows loading' : 'FAIL: shows loading — got ' + r1);

    const r2 = UserCardWithLoading({ isLoading: false, name: 'Alice', age: 30 });
    console.log(r2 === 'User: Alice, 30' ? 'PASS: renders component' : 'FAIL: renders — got ' + r2);

    const r3 = UserCardWithLoading({ name: 'Bob', age: 25 });
    console.log(r3 === 'User: Bob, 25' ? 'PASS: default not loading' : 'FAIL: default — got ' + r3);

    // isLoading not passed to wrapped component
    const spy = (props) => JSON.stringify(props);
    const WrappedSpy = withLoading(spy);
    const r4 = JSON.parse(WrappedSpy({ isLoading: false, x: 1 }));
    console.log(!('isLoading' in r4) ? 'PASS: isLoading not forwarded' : 'FAIL: isLoading forwarded — got ' + JSON.stringify(r4));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: shows loading\nPASS: renders component\nPASS: default not loading\nPASS: isLoading not forwarded",
    explanation:
      "An HOC is a function that takes a component and returns a new component with additional behavior. Destructure the HOC-specific props (isLoading) before spreading the rest to the wrapped component.",
    keyInsight:
      "HOC convention: HOC-specific props should NOT leak into the wrapped component. Always destructure them out before forwarding — the wrapped component shouldn't know about the HOC's concerns.",
  },

  {
    id: 2013,
    cat: "Component Patterns",
    difficulty: "hard",
    title: "Implement withErrorBoundary HOC",
    tags: ["error-boundary", "HOC", "try-catch", "patterns"],
    companies: ["Meta", "Atlassian", "CRED", "Google"],
    description:
      "Implement withErrorBoundary(Component, FallbackComponent). The wrapper should catch any errors thrown by Component during render. If an error is caught, render FallbackComponent with the error as a prop instead.",
    stubCode:
      `function withErrorBoundary(Component, FallbackComponent) {
  // Return a wrapped function component
  // If Component() throws, render FallbackComponent({ error })
  // If no error, render Component normally
}`,
    solutionCode:
      `function withErrorBoundary(Component, FallbackComponent) {
  return function ErrorBoundaryWrapper(props) {
    try {
      return Component(props);
    } catch (error) {
      return FallbackComponent({ error });
    }
  };
}`,
    testCode:
      `(function() {
  try {
    function BrokenComponent({ shouldThrow }) {
      if (shouldThrow) throw new Error('Something broke');
      return 'All good';
    }

    function ErrorFallback({ error }) {
      return 'Error: ' + error.message;
    }

    const SafeComponent = withErrorBoundary(BrokenComponent, ErrorFallback);

    const r1 = SafeComponent({ shouldThrow: false });
    console.log(r1 === 'All good' ? 'PASS: renders normally' : 'FAIL: renders normally — got ' + r1);

    const r2 = SafeComponent({ shouldThrow: true });
    console.log(r2 === 'Error: Something broke' ? 'PASS: catches error' : 'FAIL: catches error — got ' + r2);

    // Error propagates the actual error object
    function DetailedFallback({ error }) {
      return error instanceof Error ? 'proper Error' : 'wrong type';
    }
    const Safe2 = withErrorBoundary(BrokenComponent, DetailedFallback);
    const r3 = Safe2({ shouldThrow: true });
    console.log(r3 === 'proper Error' ? 'PASS: error is Error instance' : 'FAIL: error type — got ' + r3);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: renders normally\nPASS: catches error\nPASS: error is Error instance",
    explanation:
      "Wrap the component call in try/catch. On success, return its result. On error, return the fallback rendered with the error. This is the functional equivalent of React's getDerivedStateFromError.",
    keyInsight:
      "React's class-based Error Boundary is necessary in production because hooks can't catch render errors. This functional version shows the concept — in real React you still need the class component.",
  },

  {
    id: 2014,
    cat: "Component Patterns",
    difficulty: "medium",
    title: "Implement memoize for components (React.memo equivalent)",
    tags: ["React.memo", "memo", "shallow-equal", "performance"],
    companies: ["Meta", "Google", "Flipkart", "Razorpay"],
    description:
      "Implement memo(Component, areEqual?). Returns a new component that only re-renders (re-calls) when props change. Default comparison is shallow equality. Accept an optional custom areEqual(prevProps, nextProps) function.",
    stubCode:
      `function shallowEqual(obj1, obj2) {
  // Shallow comparison of two objects
}

function memo(Component, areEqual) {
  // areEqual defaults to shallowEqual
  // Return a memoized component function
}`,
    solutionCode:
      `function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every(k => obj1[k] === obj2[k]);
}

function memo(Component, areEqual = shallowEqual) {
  let prevProps = null;
  let prevResult = null;

  return function MemoizedComponent(props) {
    if (prevProps !== null && areEqual(prevProps, props)) {
      return prevResult;
    }
    prevProps = props;
    prevResult = Component(props);
    return prevResult;
  };
}`,
    testCode:
      `(function() {
  try {
    let renderCount = 0;
    function Greeting({ name }) {
      renderCount++;
      return 'Hello ' + name;
    }

    const MemoGreeting = memo(Greeting);

    MemoGreeting({ name: 'Alice' });
    console.log(renderCount === 1 ? 'PASS: initial render' : 'FAIL: initial — count=' + renderCount);

    MemoGreeting({ name: 'Alice' });
    console.log(renderCount === 1 ? 'PASS: skips same props' : 'FAIL: skips — count=' + renderCount);

    MemoGreeting({ name: 'Bob' });
    console.log(renderCount === 2 ? 'PASS: re-renders on change' : 'FAIL: re-render — count=' + renderCount);

    // Custom areEqual
    let customCount = 0;
    function Item({ id, version }) { customCount++; return id; }
    const MemoItem = memo(Item, (prev, next) => prev.id === next.id);

    MemoItem({ id: 1, version: 1 });
    MemoItem({ id: 1, version: 2 }); // same id → skip (custom says equal)
    console.log(customCount === 1 ? 'PASS: custom areEqual' : 'FAIL: custom — count=' + customCount);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial render\nPASS: skips same props\nPASS: re-renders on change\nPASS: custom areEqual",
    explanation:
      "Store prevProps and prevResult. On each call, compare new props with prevProps using areEqual. If equal, return the cached result. If different, re-render and update both cached values.",
    keyInsight:
      "React.memo uses shallow prop comparison by default. Note the direction: areEqual returns TRUE to SKIP re-render (opposite of shouldComponentUpdate which returns true to re-render).",
  },

  // ─── REACT UTILITIES ──────────────────────────────────────────────────────

  {
    id: 2015,
    cat: "React Utilities",
    difficulty: "medium",
    title: "Implement cloneElement",
    tags: ["cloneElement", "React", "props", "children"],
    companies: ["Meta", "Atlassian", "Flipkart", "Google"],
    description:
      "Implement cloneElement(element, newProps, ...children). Clone a React-like element object, merging newProps over the element's existing props. If children are provided as arguments, override element.props.children.",
    stubCode:
      `function cloneElement(element, newProps, ...newChildren) {
  // Clone element, merge newProps, optionally override children
  // element shape: { type, props: { children?, ...rest } }
}`,
    solutionCode:
      `function cloneElement(element, newProps, ...newChildren) {
  const mergedProps = { ...element.props, ...newProps };
  if (newChildren.length === 1) {
    mergedProps.children = newChildren[0];
  } else if (newChildren.length > 1) {
    mergedProps.children = newChildren;
  }
  return { ...element, props: mergedProps };
}`,
    testCode:
      `(function() {
  try {
    const el = { type: 'button', props: { className: 'btn', children: 'Click' } };

    const cloned = cloneElement(el, { id: 'submit' });
    console.log(cloned.props.className === 'btn' && cloned.props.id === 'submit' ? 'PASS: merges props' : 'FAIL: merges — ' + JSON.stringify(cloned.props));

    console.log(cloned !== el ? 'PASS: new object' : 'FAIL: new object');
    console.log(cloned.type === 'button' ? 'PASS: preserves type' : 'FAIL: type — got ' + cloned.type);

    const withNewChild = cloneElement(el, {}, 'New Text');
    console.log(withNewChild.props.children === 'New Text' ? 'PASS: overrides children' : 'FAIL: children — got ' + withNewChild.props.children);

    const withOverride = cloneElement(el, { className: 'btn-primary' });
    console.log(withOverride.props.className === 'btn-primary' ? 'PASS: overrides props' : 'FAIL: override — got ' + withOverride.props.className);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: merges props\nPASS: new object\nPASS: preserves type\nPASS: overrides children\nPASS: overrides props",
    explanation:
      "Spread element, then spread props with new props overriding old ones. Children from arguments take priority over children in newProps. Return a new object — never mutate the original element.",
    keyInsight:
      "cloneElement = { ...element, props: { ...element.props, ...newProps, children } }. New props win. It's used in patterns where a parent adds behavior to children without knowing their type.",
  },

  {
    id: 2016,
    cat: "React Utilities",
    difficulty: "easy",
    title: "Implement createElement (JSX transform)",
    tags: ["createElement", "JSX", "virtual-dom", "React"],
    companies: ["Meta", "Google", "Atlassian", "Flipkart"],
    description:
      "Implement createElement(type, props, ...children). Returns a React element object: { type, props: { ...props, children } }. Single child is stored directly; multiple children as an array. Null/undefined children are filtered out.",
    stubCode:
      `function createElement(type, props, ...children) {
  // Return { type, props } where props includes children
  // Single child → children (not wrapped in array)
  // Multiple children → array
  // null/undefined children → filtered out
}`,
    solutionCode:
      `function createElement(type, props, ...children) {
  const filteredChildren = children.flat().filter(c => c != null);
  const childrenProp =
    filteredChildren.length === 0 ? undefined :
    filteredChildren.length === 1 ? filteredChildren[0] :
    filteredChildren;

  return {
    type,
    props: {
      ...props,
      ...(childrenProp !== undefined ? { children: childrenProp } : {}),
    }
  };
}`,
    testCode:
      `(function() {
  try {
    const el = createElement('div', { className: 'box' }, 'Hello');
    console.log(el.type === 'div' && el.props.className === 'box' ? 'PASS: type and props' : 'FAIL: type/props');
    console.log(el.props.children === 'Hello' ? 'PASS: single child' : 'FAIL: single child — got ' + JSON.stringify(el.props.children));

    const multi = createElement('ul', null, 'a', 'b', 'c');
    console.log(Array.isArray(multi.props.children) && multi.props.children.length === 3 ? 'PASS: multiple children' : 'FAIL: multiple — got ' + JSON.stringify(multi.props.children));

    const noChild = createElement('br', null);
    console.log(noChild.props.children === undefined ? 'PASS: no children' : 'FAIL: no children — got ' + noChild.props.children);

    const withNull = createElement('div', null, 'a', null, 'b', undefined);
    console.log(Array.isArray(withNull.props.children) && withNull.props.children.length === 2 ? 'PASS: filters null' : 'FAIL: filters null — got ' + JSON.stringify(withNull.props.children));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: type and props\nPASS: single child\nPASS: multiple children\nPASS: no children\nPASS: filters null",
    explanation:
      "createElement produces the plain JS objects that JSX compiles to. Children handling: 0 = omit, 1 = scalar, 2+ = array. Filtering null/undefined children mirrors React's behavior with conditional rendering.",
    keyInsight:
      "JSX is just createElement calls. <div className='x'>Hello</div> compiles to createElement('div', {className:'x'}, 'Hello'). Understanding this makes JSX behavior predictable.",
  },

  {
    id: 2017,
    cat: "React Utilities",
    difficulty: "medium",
    title: "Implement a useDebounce hook",
    tags: ["useDebounce", "debounce", "custom-hook", "hooks"],
    companies: ["Flipkart", "Swiggy", "Razorpay", "CRED"],
    description:
      "Implement useDebounce(value, delay). Returns a debounced version of the value that only updates after the value has stopped changing for 'delay' milliseconds. Simulate with a clock you control.",
    stubCode:
      `function useDebounce(getValue, delay, clock) {
  // getValue() returns current value
  // clock.setTimeout / clock.clearTimeout for testability
  // Returns an object with: { getDebounced(), flush() }
  // flush() immediately resolves the pending timeout
}`,
    solutionCode:
      `function useDebounce(getValue, delay, clock = { setTimeout, clearTimeout }) {
  let timer = null;
  let debounced = getValue();

  function update() {
    clock.clearTimeout(timer);
    timer = clock.setTimeout(() => {
      debounced = getValue();
      timer = null;
    }, delay);
  }

  function flush() {
    if (timer !== null) {
      clock.clearTimeout(timer);
      debounced = getValue();
      timer = null;
    }
  }

  function getDebounced() { return debounced; }

  return { update, getDebounced, flush };
}`,
    testCode:
      `(function() {
  try {
    let currentValue = 'a';
    let flushed = [];

    const { update, getDebounced, flush } = useDebounce(() => currentValue, 300);

    console.log(getDebounced() === 'a' ? 'PASS: initial value' : 'FAIL: initial — got ' + getDebounced());

    currentValue = 'b'; update();
    currentValue = 'c'; update();
    currentValue = 'd'; update();

    // Value not yet updated (timer pending)
    console.log(getDebounced() === 'a' ? 'PASS: not yet updated' : 'FAIL: not yet — got ' + getDebounced());

    // Flush simulates timer firing
    flush();
    console.log(getDebounced() === 'd' ? 'PASS: flush gets latest' : 'FAIL: flush — got ' + getDebounced());

    // After flush, rapid changes don't update until next flush
    currentValue = 'e'; update();
    currentValue = 'f'; update();
    console.log(getDebounced() === 'd' ? 'PASS: pending after new updates' : 'FAIL: pending — got ' + getDebounced());

    flush();
    console.log(getDebounced() === 'f' ? 'PASS: second flush correct' : 'FAIL: second flush — got ' + getDebounced());
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial value\nPASS: not yet updated\nPASS: flush gets latest\nPASS: pending after new updates\nPASS: second flush correct",
    explanation:
      "The hook holds a pending timer and the last debounced value separately. Multiple rapid calls cancel the previous timer. flush() simulates the timer firing immediately — essential for testing debounced behavior.",
    keyInsight:
      "In real useDebounce, the 'flush' is replaced by useEffect with a setTimeout + cleanup. The pattern is identical: clearTimeout(prev), setTimeout(update, delay), return () => clearTimeout(timer).",
  },

  {
    id: 2018,
    cat: "React Utilities",
    difficulty: "hard",
    title: "Implement batch updates",
    tags: ["batch", "unstable_batchedUpdates", "performance", "state"],
    companies: ["Meta", "Google", "Atlassian"],
    description:
      "Implement batch(fn). All state setter calls inside fn should be collected and applied together, triggering only ONE notification to subscribers — not one per setState call.",
    stubCode:
      `let isBatching = false;
let pendingUpdates = [];
let listeners = new Set();
let state = { count: 0, name: '' };

function setState(key, value) {
  // If batching, queue the update
  // If not batching, apply immediately and notify
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function batch(fn) {
  // Set batching flag, run fn, apply all queued updates at once, notify once
}`,
    solutionCode:
      `let isBatching = false;
let pendingUpdates = [];
let listeners = new Set();
let state = { count: 0, name: '' };

function notify() { listeners.forEach(l => l({ ...state })); }

function setState(key, value) {
  if (isBatching) {
    pendingUpdates.push({ key, value });
  } else {
    state = { ...state, [key]: value };
    notify();
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function batch(fn) {
  isBatching = true;
  pendingUpdates = [];
  try {
    fn();
  } finally {
    isBatching = false;
    if (pendingUpdates.length > 0) {
      const updates = Object.fromEntries(pendingUpdates.map(u => [u.key, u.value]));
      state = { ...state, ...updates };
      notify();
    }
  }
}`,
    testCode:
      `(function() {
  try {
    let notifyCount = 0;
    subscribe(() => notifyCount++);

    // Without batch — 3 separate notifications
    setState('count', 1);
    setState('count', 2);
    setState('count', 3);
    console.log(notifyCount === 3 ? 'PASS: unbatched notifies each' : 'FAIL: unbatched — count=' + notifyCount);

    // Reset
    notifyCount = 0; state = { count: 0, name: '' };

    // With batch — only 1 notification
    batch(() => {
      setState('count', 10);
      setState('name', 'Alice');
      setState('count', 20);
    });
    console.log(notifyCount === 1 ? 'PASS: batch notifies once' : 'FAIL: batch notify — count=' + notifyCount);
    console.log(state.count === 20 && state.name === 'Alice' ? 'PASS: all updates applied' : 'FAIL: updates — ' + JSON.stringify(state));

    // Nested batch still notifies once
    notifyCount = 0;
    batch(() => {
      setState('count', 99);
      batch(() => { setState('name', 'Bob'); });
    });
    console.log(notifyCount === 1 ? 'PASS: nested batch once' : 'FAIL: nested — count=' + notifyCount);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: unbatched notifies each\nPASS: batch notifies once\nPASS: all updates applied\nPASS: nested batch once",
    explanation:
      "A flag switches between immediate and queued mode. Inside batch(), updates accumulate in an array. After fn() completes, all updates are merged and a single notification fires. React 18 does this automatically for all updates.",
    keyInsight:
      "React 18's automatic batching works exactly this way — a batching flag wraps event handlers and async callbacks. Pre-18, only React event handlers were batched; setTimeout/fetch updates were not.",
  },

  // ─── VIRTUAL DOM ──────────────────────────────────────────────────────────

  {
    id: 2019,
    cat: "Virtual DOM",
    difficulty: "hard",
    title: "Implement a Virtual DOM differ (basic reconciler)",
    tags: ["virtual-dom", "reconciler", "diff", "patch"],
    companies: ["Meta", "Google", "Atlassian", "Razorpay"],
    description:
      "Implement diff(oldVNode, newVNode) that returns a patch array describing changes. Patches types: REPLACE, UPDATE_PROPS, REMOVE, ADD. VNodes are { type, props, children? } objects or string primitives.",
    stubCode:
      `const PATCH_TYPES = { REPLACE: 'REPLACE', UPDATE_PROPS: 'UPDATE_PROPS', REMOVE: 'REMOVE', ADD: 'ADD' };

function diff(oldNode, newNode, patches = [], path = '0') {
  // Compare old and new VNodes
  // Push patch objects to patches array: { type, path, ...payload }
  // Return patches
}`,
    solutionCode:
      `const PATCH_TYPES = { REPLACE: 'REPLACE', UPDATE_PROPS: 'UPDATE_PROPS', REMOVE: 'REMOVE', ADD: 'ADD' };

function diff(oldNode, newNode, patches = [], path = '0') {
  if (newNode === undefined || newNode === null) {
    patches.push({ type: PATCH_TYPES.REMOVE, path });
    return patches;
  }

  if (oldNode === undefined || oldNode === null) {
    patches.push({ type: PATCH_TYPES.ADD, path, node: newNode });
    return patches;
  }

  if (typeof oldNode !== typeof newNode || oldNode.type !== newNode.type) {
    patches.push({ type: PATCH_TYPES.REPLACE, path, node: newNode });
    return patches;
  }

  if (typeof newNode === 'string' || typeof newNode === 'number') {
    if (oldNode !== newNode) patches.push({ type: PATCH_TYPES.REPLACE, path, node: newNode });
    return patches;
  }

  // Same type — check props
  const propChanges = {};
  const allKeys = new Set([...Object.keys(oldNode.props || {}), ...Object.keys(newNode.props || {})]);
  allKeys.forEach(k => {
    if ((oldNode.props || {})[k] !== (newNode.props || {})[k]) {
      propChanges[k] = (newNode.props || {})[k];
    }
  });
  if (Object.keys(propChanges).length > 0) {
    patches.push({ type: PATCH_TYPES.UPDATE_PROPS, path, props: propChanges });
  }

  // Diff children
  const oldChildren = oldNode.children || [];
  const newChildren = newNode.children || [];
  const max = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < max; i++) {
    diff(oldChildren[i], newChildren[i], patches, path + '.' + i);
  }

  return patches;
}`,
    testCode:
      `(function() {
  try {
    const old1 = { type: 'div', props: { id: 'app' }, children: ['Hello'] };
    const new1 = { type: 'div', props: { id: 'app' }, children: ['World'] };
    const p1 = diff(old1, new1);
    const textPatch = p1.find(p => p.type === 'REPLACE' && p.node === 'World');
    console.log(textPatch ? 'PASS: text change detected' : 'FAIL: text change — ' + JSON.stringify(p1));

    const old2 = { type: 'div', props: { className: 'old' }, children: [] };
    const new2 = { type: 'div', props: { className: 'new' }, children: [] };
    const p2 = diff(old2, new2);
    const propPatch = p2.find(p => p.type === 'UPDATE_PROPS' && p.props.className === 'new');
    console.log(propPatch ? 'PASS: prop change detected' : 'FAIL: prop change — ' + JSON.stringify(p2));

    const old3 = { type: 'div', props: {}, children: [] };
    const new3 = { type: 'span', props: {}, children: [] };
    const p3 = diff(old3, new3);
    const replacePatch = p3.find(p => p.type === 'REPLACE');
    console.log(replacePatch ? 'PASS: type change = replace' : 'FAIL: type change — ' + JSON.stringify(p3));

    const old4 = { type: 'ul', props: {}, children: [{ type: 'li', props: {}, children: ['A'] }] };
    const new4 = { type: 'ul', props: {}, children: [{ type: 'li', props: {}, children: ['A'] }, { type: 'li', props: {}, children: ['B'] }] };
    const p4 = diff(old4, new4);
    const addPatch = p4.find(p => p.type === 'ADD');
    console.log(addPatch ? 'PASS: new child detected' : 'FAIL: new child — ' + JSON.stringify(p4));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: text change detected\nPASS: prop change detected\nPASS: type change = replace\nPASS: new child detected",
    explanation:
      "Walk both trees simultaneously. If types differ, emit REPLACE (tear down and rebuild). Same type: diff props, then recurse into children by index. Missing children on new side = REMOVE; extra children on new side = ADD.",
    keyInsight:
      "React's diff heuristic: different types = REPLACE (O(n) instead of O(n³)). Keys enable matching children by identity across reorders. Without keys, index-based comparison misidentifies moved elements.",
  },

  {
    id: 2020,
    cat: "Virtual DOM",
    difficulty: "hard",
    title: "Implement a simple reconciler render function",
    tags: ["reconciler", "render", "virtual-dom", "DOM"],
    companies: ["Meta", "Google", "Atlassian"],
    description:
      "Implement render(vnode, container). Takes a virtual DOM node { type, props, children } and returns a real DOM-like node (plain objects simulating DOM: { tag, attrs, children, text }). Handle text nodes, element nodes, and null children.",
    stubCode:
      `function render(vnode) {
  // vnode is: string/number (text) OR { type, props, children[] }
  // Return a DOM-like object: { tag, attrs, children } or { text }
  // null/undefined vnodes → return null
}`,
    solutionCode:
      `function render(vnode) {
  if (vnode == null) return null;

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return { text: String(vnode) };
  }

  const { type, props = {}, children = [] } = vnode;
  const { children: _ignore, ...attrs } = props;

  const domNode = {
    tag: type,
    attrs,
    children: children.map(child => render(child)).filter(c => c !== null),
  };

  return domNode;
}`,
    testCode:
      `(function() {
  try {
    const vdom = {
      type: 'div', props: { className: 'app' },
      children: [
        { type: 'h1', props: {}, children: ['Hello World'] },
        { type: 'p', props: { id: 'desc' }, children: ['Some text', null] },
      ]
    };

    const result = render(vdom);
    console.log(result.tag === 'div' && result.attrs.className === 'app' ? 'PASS: root element' : 'FAIL: root — ' + JSON.stringify(result));
    console.log(result.children.length === 2 ? 'PASS: two children' : 'FAIL: children count — ' + result.children.length);

    const h1 = result.children[0];
    console.log(h1.tag === 'h1' && h1.children[0].text === 'Hello World' ? 'PASS: nested element' : 'FAIL: nested — ' + JSON.stringify(h1));

    const p = result.children[1];
    console.log(p.attrs.id === 'desc' ? 'PASS: props preserved' : 'FAIL: props — ' + JSON.stringify(p.attrs));
    console.log(p.children.length === 1 ? 'PASS: null filtered' : 'FAIL: null filter — children=' + p.children.length);

    const textNode = render('Hello');
    console.log(textNode.text === 'Hello' ? 'PASS: text node' : 'FAIL: text — got ' + JSON.stringify(textNode));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: root element\nPASS: two children\nPASS: nested element\nPASS: props preserved\nPASS: null filter\nPASS: text node",
    explanation:
      "Walk the VNode tree recursively. Text nodes become { text } objects. Element nodes become { tag, attrs, children }. Null children are filtered after mapping — they result from conditional rendering.",
    keyInsight:
      "This is the heart of React's render phase. Every component returns a VNode tree. render() walks it once to produce DOM operations. React then batches those operations in the commit phase.",
  },

  {
    id: 2021,
    cat: "React Utilities",
    difficulty: "medium",
    title: "Implement a simple React Query-like useFetch",
    tags: ["useFetch", "react-query", "cache", "async", "hooks"],
    companies: ["Vercel", "Atlassian", "Razorpay", "Flipkart"],
    description:
      "Implement a cache-backed fetchResource(url, fetcher) function. First call fetches and caches the result. Subsequent calls with the same URL return the cached value immediately. Expose invalidate(url) to clear a cache entry.",
    stubCode:
      `const cache = new Map();

function fetchResource(url, fetcher) {
  // Return Promise<{ data, fromCache }>
  // On cache hit: resolve immediately with { data, fromCache: true }
  // On cache miss: call fetcher(url), cache result, resolve with { data, fromCache: false }
}

function invalidate(url) {
  // Remove url from cache
}`,
    solutionCode:
      `const cache = new Map();

function fetchResource(url, fetcher) {
  if (cache.has(url)) {
    return Promise.resolve({ data: cache.get(url), fromCache: true });
  }
  return fetcher(url).then(data => {
    cache.set(url, data);
    return { data, fromCache: false };
  });
}

function invalidate(url) {
  cache.delete(url);
}`,
    testCode:
      `(function() {
  let fetchCount = 0;
  const mockFetcher = (url) => {
    fetchCount++;
    return Promise.resolve({ id: 1, url });
  };

  fetchResource('/api/user', mockFetcher).then(({ data, fromCache }) => {
    console.log(!fromCache && data.url === '/api/user' ? 'PASS: fetches on miss' : 'FAIL: fetch — from cache=' + fromCache);
    console.log(fetchCount === 1 ? 'PASS: fetcher called once' : 'FAIL: fetcher count=' + fetchCount);

    return fetchResource('/api/user', mockFetcher);
  }).then(({ data, fromCache }) => {
    console.log(fromCache ? 'PASS: uses cache on hit' : 'FAIL: cache hit — fromCache=' + fromCache);
    console.log(fetchCount === 1 ? 'PASS: fetcher not called again' : 'FAIL: fetcher count=' + fetchCount);

    invalidate('/api/user');
    return fetchResource('/api/user', mockFetcher);
  }).then(({ fromCache }) => {
    console.log(!fromCache ? 'PASS: refetches after invalidate' : 'FAIL: invalidate — fromCache=' + fromCache);
    console.log(fetchCount === 2 ? 'PASS: fetcher called again' : 'FAIL: post-invalidate count=' + fetchCount);
  });
})();`,
    expectedOutput: "PASS: fetches on miss\nPASS: fetcher called once\nPASS: uses cache on hit\nPASS: fetcher not called again\nPASS: refetches after invalidate\nPASS: fetcher called again",
    explanation:
      "The cache is a Map from URL to resolved data. Cache hit = immediate Promise.resolve. Cache miss = call fetcher, cache the result, resolve. Invalidate removes the entry so the next call re-fetches.",
    keyInsight:
      "React Query uses this exact pattern — queryKey maps to cached data. staleTime determines when fromCache = true is still acceptable. invalidateQueries() = cache.delete(key).",
  },

  {
    id: 2022,
    cat: "React Utilities",
    difficulty: "medium",
    title: "Implement useLocalStorage hook",
    tags: ["useLocalStorage", "localStorage", "custom-hook", "persistence"],
    companies: ["Flipkart", "Swiggy", "CRED", "Razorpay"],
    description:
      "Implement useLocalStorage(key, initialValue, storage). Returns [value, setValue, removeValue]. setValue persists to storage. Reading initializes from storage if the key exists. Use storage.getItem/setItem/removeItem for testability.",
    stubCode:
      `function useLocalStorage(key, initialValue, storage = localStorage) {
  // Read initial value from storage (parse JSON), fallback to initialValue
  // setValue: update state AND persist to storage
  // removeValue: remove from storage and reset to initialValue
}`,
    solutionCode:
      `function useLocalStorage(key, initialValue, storage = localStorage) {
  function read() {
    try {
      const item = storage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }

  let value = read();

  function setValue(newValue) {
    value = typeof newValue === 'function' ? newValue(value) : newValue;
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function removeValue() {
    value = initialValue;
    storage.removeItem(key);
  }

  function getValue() { return value; }

  return [getValue, setValue, removeValue];
}`,
    testCode:
      `(function() {
  try {
    // Mock storage
    const mockStorage = (() => {
      const store = {};
      return {
        getItem: k => store[k] ?? null,
        setItem: (k, v) => { store[k] = v; },
        removeItem: k => { delete store[k]; },
      };
    })();

    const [getCount, setCount, removeCount] = useLocalStorage('count', 0, mockStorage);

    console.log(getCount() === 0 ? 'PASS: initial value' : 'FAIL: initial — got ' + getCount());

    setCount(5);
    console.log(getCount() === 5 ? 'PASS: setValue updates' : 'FAIL: setValue — got ' + getCount());
    console.log(mockStorage.getItem('count') === '5' ? 'PASS: persisted to storage' : 'FAIL: persist — got ' + mockStorage.getItem('count'));

    // New instance reads persisted value
    const [getCount2] = useLocalStorage('count', 0, mockStorage);
    console.log(getCount2() === 5 ? 'PASS: reads from storage' : 'FAIL: reads storage — got ' + getCount2());

    // Updater function
    setCount(c => c + 10);
    console.log(getCount() === 15 ? 'PASS: updater fn' : 'FAIL: updater — got ' + getCount());

    removeCount();
    console.log(getCount() === 0 && mockStorage.getItem('count') === null ? 'PASS: removeValue' : 'FAIL: remove — got ' + getCount());
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial value\nPASS: setValue updates\nPASS: persisted to storage\nPASS: reads from storage\nPASS: updater fn\nPASS: removeValue",
    explanation:
      "Read from storage on initialization, falling back to initialValue. Every setValue serializes with JSON.stringify. removeValue clears storage and resets to initialValue. Injectable storage enables testing without real localStorage.",
    keyInsight:
      "Always JSON.parse/stringify for localStorage — it only stores strings. Inject storage as a dependency for testability. In real hooks, trigger re-render by wrapping value in useState and calling setStoredValue.",
  },

  {
    id: 2023,
    cat: "State Management",
    difficulty: "hard",
    title: "Implement a simple pub/sub (useSubscription pattern)",
    tags: ["pub-sub", "subscription", "observer", "hooks"],
    companies: ["Meta", "Google", "Flipkart", "Atlassian"],
    description:
      "Implement createSubscription() returning a { publish, subscribe, getSnapshot } object. subscribe(listener) calls listener whenever publish(value) is called. getSnapshot() returns the last published value. Listeners receive the new value and previous value.",
    stubCode:
      `function createSubscription(initialValue) {
  // Return { publish, subscribe, getSnapshot }
  // subscribe(listener) → returns unsubscribe fn
  // listener called with (newValue, prevValue) on every publish
  // getSnapshot() → returns latest value
}`,
    solutionCode:
      `function createSubscription(initialValue) {
  let current = initialValue;
  const listeners = new Set();

  function publish(value) {
    const prev = current;
    current = value;
    listeners.forEach(l => l(value, prev));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot() {
    return current;
  }

  return { publish, subscribe, getSnapshot };
}`,
    testCode:
      `(function() {
  try {
    const sub = createSubscription(0);

    console.log(sub.getSnapshot() === 0 ? 'PASS: initial snapshot' : 'FAIL: initial — got ' + sub.getSnapshot());

    sub.publish(42);
    console.log(sub.getSnapshot() === 42 ? 'PASS: snapshot updates' : 'FAIL: snapshot — got ' + sub.getSnapshot());

    const received = [];
    const unsub = sub.subscribe((newVal, prevVal) => received.push({ newVal, prevVal }));

    sub.publish(100);
    sub.publish(200);

    console.log(received.length === 2 ? 'PASS: listener called' : 'FAIL: listener count=' + received.length);
    console.log(received[0].newVal === 100 && received[0].prevVal === 42 ? 'PASS: receives new and prev' : 'FAIL: values — ' + JSON.stringify(received[0]));
    console.log(received[1].newVal === 200 && received[1].prevVal === 100 ? 'PASS: prev tracks correctly' : 'FAIL: prev — ' + JSON.stringify(received[1]));

    unsub();
    sub.publish(999);
    console.log(received.length === 2 ? 'PASS: unsubscribed' : 'FAIL: unsub — length=' + received.length);
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: initial snapshot\nPASS: snapshot updates\nPASS: listener called\nPASS: receives new and prev\nPASS: prev tracks correctly\nPASS: unsubscribed",
    explanation:
      "A publish/subscribe system with value storage. publish updates the current value and notifies all listeners with both new and previous values. getSnapshot enables React's useSyncExternalStore integration.",
    keyInsight:
      "This is the pattern behind useSyncExternalStore. React calls getSnapshot() to check if the value changed and subscribe() to register for future changes. External stores (Zustand, Redux) all implement this interface.",
  },

  {
    id: 2024,
    cat: "Component Patterns",
    difficulty: "hard",
    title: "Implement a render prop pattern (renderChildren)",
    tags: ["render-props", "children-as-function", "patterns", "compound"],
    companies: ["Meta", "Flipkart", "Atlassian", "Google"],
    description:
      "Implement DataProvider(data, children). children is a function: (data, { filter, sort }) => result. The provider exposes filter(fn) and sort(fn) utilities that operate on data and pass the processed result to children.",
    stubCode:
      `function DataProvider(data, children) {
  // children is a function: (processedData, utils) => any
  // utils = { filter(fn), sort(fn) }
  // Each util returns a NEW processed version without mutating data
}`,
    solutionCode:
      `function DataProvider(data, children) {
  const utils = {
    filter(fn) {
      return data.filter(fn);
    },
    sort(fn) {
      return [...data].sort(fn);
    },
  };
  return children(data, utils);
}`,
    testCode:
      `(function() {
  try {
    const items = [3, 1, 4, 1, 5, 9, 2, 6];

    const result1 = DataProvider(items, (data) => data.length);
    console.log(result1 === 8 ? 'PASS: passes data to children' : 'FAIL: passes data — got ' + result1);

    const filtered = DataProvider(items, (data, { filter }) => filter(x => x > 4));
    console.log(JSON.stringify(filtered) === '[5,9,6]' ? 'PASS: filter util works' : 'FAIL: filter — got ' + JSON.stringify(filtered));

    const sorted = DataProvider(items, (data, { sort }) => sort((a, b) => a - b));
    console.log(JSON.stringify(sorted) === '[1,1,2,3,4,5,6,9]' ? 'PASS: sort util works' : 'FAIL: sort — got ' + JSON.stringify(sorted));

    // Original data must not be mutated
    console.log(JSON.stringify(items) === '[3,1,4,1,5,9,2,6]' ? 'PASS: original not mutated' : 'FAIL: mutated — ' + JSON.stringify(items));

    // Chained usage
    const result = DataProvider(items, (data, { filter, sort }) => sort((a,b) => a-b).filter ? 'has filter' : 'missing');
    // filter and sort return arrays, so chaining is natural
    const chained = DataProvider(items, (_, { sort }) => {
      const s = sort((a, b) => a - b);
      return s.filter(x => x > 3);
    });
    console.log(JSON.stringify(chained) === '[4,5,6,9]' ? 'PASS: utils chainable' : 'FAIL: chain — got ' + JSON.stringify(chained));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: passes data to children\nPASS: filter util works\nPASS: sort util works\nPASS: original not mutated\nPASS: utils chainable",
    explanation:
      "The provider calls children as a function, passing data and a utilities object. Each utility returns a new array — never mutating the original. The caller decides what to do with the result, keeping the provider flexible.",
    keyInsight:
      "Render props invert control: the component provides STATE and BEHAVIOR, the caller provides RENDERING. This is why libraries like Downshift and React Table expose render props — consumers control the UI while the library controls the logic.",
  },

  {
    id: 2025,
    cat: "Component Patterns",
    difficulty: "medium",
    title: "Implement pipe for React component transforms",
    tags: ["pipe", "HOC", "composition", "patterns"],
    companies: ["Meta", "Google", "Atlassian", "Razorpay"],
    description:
      "Implement pipeHOCs(...hocs). Returns a function that applies multiple HOCs left-to-right to a component. pipeHOCs(withLogging, withAuth, withTheme)(MyComponent) should be equivalent to withTheme(withAuth(withLogging(MyComponent))).",
    stubCode:
      `function pipeHOCs(...hocs) {
  // Apply HOCs left-to-right: first HOC wraps innermost
  // pipeHOCs(A, B, C)(Comp) = C(B(A(Comp)))
}`,
    solutionCode:
      `function pipeHOCs(...hocs) {
  return (Component) => hocs.reduce((wrapped, hoc) => hoc(wrapped), Component);
}`,
    testCode:
      `(function() {
  try {
    const withPrefix = (prefix) => (Component) => (props) => prefix + ':' + Component(props);
    const withSuffix = (suffix) => (Component) => (props) => Component(props) + ':' + suffix;

    const base = (props) => props.text;

    // pipeHOCs applies left-to-right, each wraps the previous
    // withPrefix('A')(withPrefix('B')(base)) = A:B:text
    const enhanced1 = pipeHOCs(withPrefix('B'), withPrefix('A'))(base);
    console.log(enhanced1({ text: 'hello' }) === 'A:B:hello' ? 'PASS: left-to-right' : 'FAIL: order — got ' + enhanced1({ text: 'hello' }));

    // Single HOC
    const enhanced2 = pipeHOCs(withSuffix('!'))(base);
    console.log(enhanced2({ text: 'hi' }) === 'hi:!' ? 'PASS: single HOC' : 'FAIL: single — got ' + enhanced2({ text: 'hi' }));

    // No HOCs → identity
    const enhanced3 = pipeHOCs()(base);
    console.log(enhanced3({ text: 'plain' }) === 'plain' ? 'PASS: no HOCs = identity' : 'FAIL: identity — got ' + enhanced3({ text: 'plain' }));

    // Three HOCs
    const enhanced4 = pipeHOCs(withPrefix('X'), withPrefix('Y'), withSuffix('Z'))(base);
    console.log(enhanced4({ text: 'val' }) === 'Y:X:val:Z' ? 'PASS: three HOCs' : 'FAIL: three — got ' + enhanced4({ text: 'val' }));
  } catch(e) { console.log('FAIL: threw — ' + e.message); }
})();`,
    expectedOutput: "PASS: left-to-right\nPASS: single HOC\nPASS: no HOCs = identity\nPASS: three HOCs",
    explanation:
      "reduce applies each HOC to the accumulator (previously wrapped component) starting with the base component. Left-to-right means the first HOC is innermost — its output feeds the second HOC.",
    keyInsight:
      "pipeHOCs = left-to-right HOC composition via reduce. It's identical to the pipe() function for values, but applied to HOC transforms. This is how Redux's connect() was composed before hooks.",
  },
];
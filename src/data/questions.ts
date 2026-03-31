export interface Question {
  id: number
  cat: string
  q: string
  tags: ('core' | 'mid' | 'adv')[]
  answer: string
  hint?: string
}

export const CATEGORIES = [
  'React Fundamentals',
  'Hooks',
  'State Management',
  'Component Patterns',
  'Performance',
  'React Router',
  'Forms',
  'Advanced Patterns',
  'Concurrent React',
  'Server Components',
  'Testing',
  'Ecosystem',
];

export const questions: Question[] = [

  // ─── REACT FUNDAMENTALS ───────────────────────────────────────────────────

  {
    id: 1000, cat: 'React Fundamentals', tags: ['core'],
    q: 'What is React and what problem does it solve?',
    hint: 'Declarative UI library — describe what the UI should look like, not how to update it',
    answer: `<p><strong>React</strong> is a JavaScript library for building user interfaces. It solves the problem of keeping the UI in sync with application state.</p>
<p><strong>Core ideas:</strong></p>
<ul>
<li><strong>Declarative</strong> — you describe the desired UI for a given state; React figures out DOM updates</li>
<li><strong>Component-based</strong> — split UI into reusable, self-contained pieces</li>
<li><strong>Virtual DOM</strong> — React maintains a lightweight copy of the DOM, diffs it on state change, and batches minimal real DOM updates</li>
<li><strong>Unidirectional data flow</strong> — data flows down (props), events flow up (callbacks)</li>
</ul>
<pre><code>// Imperative (jQuery style) — how to update
const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  const count = parseInt(btn.textContent) + 1;
  btn.textContent = count;
});

// Declarative (React style) — what it should look like
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}</code></pre>
<div class="tip">💡 React's real innovation was making UI a pure function of state: UI = f(state). Any time state changes, React re-runs the function and reconciles the difference.</div>`
  },

  {
    id: 1001, cat: 'React Fundamentals', tags: ['core'],
    q: 'What is JSX and how does it work under the hood?',
    hint: 'JSX is syntactic sugar — Babel transforms it into React.createElement() calls',
    answer: `<p><strong>JSX</strong> is a syntax extension that looks like HTML inside JavaScript. It is NOT valid JS — it gets compiled by Babel into <code>React.createElement()</code> calls.</p>
<pre><code>// What you write
const el = <h1 className="title">Hello {name}</h1>;

// What Babel compiles it to
const el = React.createElement('h1', { className: 'title' }, 'Hello ', name);

// React 17+ — new JSX transform (no need to import React)
import { jsx as _jsx } from 'react/jsx-runtime';
const el = _jsx('h1', { className: 'title', children: ['Hello ', name] });</code></pre>
<p><strong>Key rules:</strong></p>
<ul>
<li>Single root element required (use <code>&lt;&gt;&lt;/&gt;</code> Fragment if needed)</li>
<li>Use <code>className</code> not <code>class</code>, <code>htmlFor</code> not <code>for</code></li>
<li>Expressions in <code>{}</code> — not statements (<code>if</code>, <code>for</code>)</li>
<li>Self-close empty tags: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code></li>
<li>camelCase for attributes: <code>onClick</code>, <code>onChange</code></li>
</ul>
<div class="tip">💡 JSX returns plain JS objects (React elements). They're just descriptions — cheap to create. React uses these to build and diff the Virtual DOM.</div>`
  },

  {
    id: 1002, cat: 'React Fundamentals', tags: ['core'],
    q: 'What is the Virtual DOM and how does reconciliation work?',
    hint: 'Lightweight JS copy of the DOM — React diffs old vs new tree, applies minimal patches',
    answer: `<p>The <strong>Virtual DOM</strong> is a JavaScript object tree that mirrors the real DOM. It's cheap to create and manipulate.</p>
<p><strong>Reconciliation process:</strong></p>
<ol>
<li>State/props change triggers a re-render — React calls your component function</li>
<li>React builds a new Virtual DOM tree</li>
<li><strong>Diffing</strong> — React compares (diffs) new tree with the previous tree</li>
<li><strong>Committing</strong> — React applies only the changed nodes to the real DOM</li>
</ol>
<p><strong>Diffing heuristics (O(n) instead of O(n³)):</strong></p>
<ul>
<li>Elements of different types → tear down and rebuild the whole subtree</li>
<li>Same type → update only changed attributes</li>
<li>Lists → use <code>key</code> prop to match old and new items</li>
</ul>
<pre><code>// React sees these as DIFFERENT types → full rebuild
<div>...</div>  →  <span>...</span>  // destroys div, creates span

// Same type → just updates className attribute
<div className="old" />  →  <div className="new" /></code></pre>
<div class="tip">💡 Reconciliation is why key matters so much in lists. Without a stable key, React might reuse the wrong DOM node, causing subtle bugs like input state being wrong item.</div>`
  },

  {
    id: 1003, cat: 'React Fundamentals', tags: ['core'],
    q: 'What is the difference between a controlled and uncontrolled component?',
    hint: 'Controlled = React owns the value; uncontrolled = DOM owns it (accessed via ref)',
    answer: `<p><strong>Controlled component</strong> — React state is the single source of truth. Every change goes through <code>setState</code>.</p>
<p><strong>Uncontrolled component</strong> — the DOM stores the value. You pull it with a ref when needed.</p>
<pre><code>// Controlled — React owns the value
function Controlled() {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

// Uncontrolled — DOM owns the value
function Uncontrolled() {
  const inputRef = useRef(null);
  function handleSubmit() {
    console.log(inputRef.current.value); // pull on demand
  }
  return <input ref={inputRef} defaultValue="initial" />;
}</code></pre>
<p><strong>When to use each:</strong></p>
<ul>
<li><strong>Controlled</strong> — instant validation, conditional disabling, dynamic inputs, format-on-type</li>
<li><strong>Uncontrolled</strong> — file inputs (always uncontrolled), integrating with non-React code, simple one-off forms where you only need value on submit</li>
</ul>
<div class="tip">💡 React recommends controlled components for most cases. File inputs (<code>&lt;input type="file"&gt;</code>) are always uncontrolled — you can't set their value programmatically for security reasons.</div>`
  },

  {
    id: 1004, cat: 'React Fundamentals', tags: ['core'],
    q: 'What are props and how is prop drilling a problem?',
    hint: 'Props pass data down; drilling = passing through many layers just to reach a deeply nested child',
    answer: `<p><strong>Props</strong> are the inputs to a component — passed from parent to child. They are read-only (immutable from the child's perspective).</p>
<pre><code>function Button({ label, onClick, disabled = false }) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// Usage
<Button label="Save" onClick={handleSave} disabled={isLoading} /></code></pre>
<p><strong>Prop drilling</strong> — passing props through intermediate components that don't need them, just so a deep child can access them:</p>
<pre><code>// ❌ Drilling — Middle doesn't need user, just passes it down
function App() {
  const user = { name: 'Alice' };
  return <Middle user={user} />;
}
function Middle({ user }) {
  return <Deep user={user} />;
}
function Deep({ user }) {
  return <p>{user.name}</p>;
}</code></pre>
<p><strong>Solutions to prop drilling:</strong></p>
<ul>
<li><strong>Context API</strong> — broadcast value to any descendant</li>
<li><strong>Component composition</strong> — lift rendering up, pass JSX as children or slots</li>
<li><strong>State management</strong> — Zustand, Redux, Jotai for global state</li>
</ul>
<div class="tip">💡 Before reaching for Context, try composition first. Pass <code>children</code> or render props — often eliminates drilling without the overhead of a context.</div>`
  },

  {
    id: 1005, cat: 'React Fundamentals', tags: ['mid'],
    q: 'What is the key prop and why is it critical in lists?',
    hint: 'Key lets React identify which item changed, was added, or removed — must be stable and unique',
    answer: `<p>The <code>key</code> prop is React's mechanism to identify list items across renders. Without stable keys, React can't efficiently reconcile list changes.</p>
<pre><code>// ❌ Using index as key — problematic when list reorders or items are inserted
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}

// ✅ Use a stable unique ID from the data
{items.map(item => (
  <ListItem key={item.id} item={item} />
))}</code></pre>
<p><strong>Why index keys fail:</strong></p>
<pre><code>// Initial:  [A(key=0), B(key=1), C(key=2)]
// Delete A: [B(key=0), C(key=1)]
// React sees key=0 CHANGED (not deleted) → updates B in place
// Key=2 REMOVED → destroys C
// Result: input state, focus, animations on wrong elements</code></pre>
<p><strong>When index keys are safe:</strong></p>
<ul>
<li>The list never reorders</li>
<li>Items are never inserted or deleted from the middle</li>
<li>Items have no state (text-only renders)</li>
</ul>
<div class="tip">💡 Keys must be unique among siblings, not globally. Keys don't get passed as props — if you need the ID in the component, pass it explicitly as a separate prop.</div>`
  },

  {
    id: 1006, cat: 'React Fundamentals', tags: ['mid'],
    q: 'What are React Fragments and when do you need them?',
    hint: '<></> lets you return multiple elements without adding an extra DOM node',
    answer: `<p><strong>Fragments</strong> let you group multiple elements without adding an extra DOM wrapper node.</p>
<pre><code>// ❌ Extra div pollutes the DOM
function TableRow() {
  return (
    <div>         {/* invalid inside <tbody> */}
      <td>Name</td>
      <td>Age</td>
    </div>
  );
}

// ✅ Fragment — no DOM node added
function TableRow() {
  return (
    <>
      <td>Name</td>
      <td>Age</td>
    </>
  );
}

// Keyed fragments — use the long form syntax (shorthand doesn't support key)
function List({ items }) {
  return items.map(item => (
    <React.Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </React.Fragment>
  ));
}</code></pre>
<div class="tip">💡 Fragments matter most in table structures (tr/td/th must be direct children) and flexbox/grid layouts where an extra wrapper breaks the CSS.</div>`
  },

  {
    id: 1007, cat: 'React Fundamentals', tags: ['mid'],
    q: 'What is the component lifecycle and how do hooks map to it?',
    hint: 'Mount → Update → Unmount — useEffect covers all three phases',
    answer: `<p>Class components had explicit lifecycle methods. Hooks cover the same phases:</p>
<table>
<tr><th>Class method</th><th>Hook equivalent</th></tr>
<tr><td>componentDidMount</td><td>useEffect(() => { ... }, [])</td></tr>
<tr><td>componentDidUpdate</td><td>useEffect(() => { ... }, [deps])</td></tr>
<tr><td>componentWillUnmount</td><td>useEffect(() => { return () => cleanup() }, [])</td></tr>
<tr><td>shouldComponentUpdate</td><td>React.memo + useMemo</td></tr>
<tr><td>getDerivedStateFromProps</td><td>Compute during render (no hook needed)</td></tr>
<tr><td>getSnapshotBeforeUpdate</td><td>useLayoutEffect return value (rare)</td></tr>
</table>
<pre><code>useEffect(() => {
  // componentDidMount — runs after first render
  const sub = subscribe(userId);

  // componentWillUnmount — cleanup function
  return () => sub.unsubscribe();
}, []); // [] = run once

useEffect(() => {
  // componentDidUpdate for userId — runs when userId changes
  fetchUser(userId);
}, [userId]);</code></pre>
<div class="tip">💡 useEffect runs AFTER the browser paints. For DOM measurements that need to run synchronously before paint (to avoid flicker), use useLayoutEffect instead.</div>`
  },

  {
    id: 1008, cat: 'React Fundamentals', tags: ['core'],
    q: 'What is the difference between state and props?',
    hint: 'Props = external inputs (immutable); state = internal memory (mutable via setState)',
    answer: `<ul>
<li><strong>Props</strong> — passed in from outside, owned by the parent, read-only inside the component</li>
<li><strong>State</strong> — owned and managed by the component itself, mutable via <code>setState</code>/<code>useState</code>, triggers re-render when changed</li>
</ul>
<pre><code>function Counter({ initialCount, step = 1 }) {
  //              ↑ props — given from parent, read-only here

  const [count, setCount] = useState(initialCount);
  //     ↑ state — owned by this component

  return (
    <button onClick={() => setCount(c => c + step)}>
      Count: {count}
    </button>
  );
}</code></pre>
<p><strong>When state changes:</strong> React re-renders the component and all its children.</p>
<p><strong>When props change:</strong> the parent re-renders, passing new props, which causes the child to re-render.</p>
<div class="tip">💡 A common mistake: trying to sync state with props using useEffect. Instead, derive values during render if possible. If a prop controls the initial value, use it only in useState's initializer — not as a useEffect dep.</div>`
  },

  // ─── HOOKS ────────────────────────────────────────────────────────────────

  {
    id: 1009, cat: 'Hooks', tags: ['core'],
    q: 'What are the Rules of Hooks and why do they exist?',
    hint: 'Only call at top level, only in React functions — React relies on call order to track state',
    answer: `<p>Two rules enforced by the <code>eslint-plugin-react-hooks</code> linter:</p>
<ol>
<li><strong>Only call hooks at the top level</strong> — never inside loops, conditions, or nested functions</li>
<li><strong>Only call hooks in React function components or custom hooks</strong> — not in regular JS functions</li>
</ol>
<p><strong>Why?</strong> React tracks hook state by <em>call order</em>. It uses an internal linked list — hook #1, hook #2, etc. If you call hooks conditionally, the order changes between renders and React's state gets mismatched:</p>
<pre><code>// ❌ WRONG — conditional hook breaks the call order
function Profile({ userId }) {
  if (!userId) return null; // return before hook!
  const [user, setUser] = useState(null); // hook #1 sometimes skipped
}

// ✅ CORRECT — always call hooks, handle condition inside
function Profile({ userId }) {
  const [user, setUser] = useState(null); // hook #1 always
  if (!userId) return null;               // condition after hooks
}</code></pre>
<div class="tip">💡 If you find yourself wanting a conditional hook, extract the conditional logic into a custom hook where you can return early after the hooks are already called.</div>`
  },

  {
    id: 1010, cat: 'Hooks', tags: ['core'],
    q: 'Explain useState — batching, functional updates, and lazy initialization.',
    hint: 'State updates are batched; use functional form for updates based on previous state; pass a function to useState for expensive initial computation',
    answer: `<pre><code>const [state, setState] = useState(initialValue);</code></pre>
<p><strong>Functional updates</strong> — use when next state depends on current state:</p>
<pre><code>// ❌ Potentially stale closure
setCount(count + 1);
setCount(count + 1); // both read the same stale 'count'

// ✅ Always gets the latest value
setCount(c => c + 1);
setCount(c => c + 1); // correctly increments twice</code></pre>
<p><strong>Batching</strong> — React 18 batches all state updates (even in setTimeout, fetch callbacks) into a single re-render:</p>
<pre><code>// React 18: both updates batched into ONE re-render
setTimeout(() => {
  setCount(c => c + 1);
  setName('Alice');
}, 0);</code></pre>
<p><strong>Lazy initialization</strong> — pass a function to avoid re-running expensive setup on every render:</p>
<pre><code>// ❌ computeExpensive() runs every render (result discarded after mount)
const [state, setState] = useState(computeExpensive());

// ✅ Only runs on mount
const [state, setState] = useState(() => computeExpensive());</code></pre>
<div class="tip">💡 State updates are asynchronous — you won't see the new value immediately after calling setState. React schedules a re-render; the new value appears in the next render's closure.</div>`
  },

  {
    id: 1011, cat: 'Hooks', tags: ['core'],
    q: 'How does useEffect work? What are its dependency array behaviors?',
    hint: 'No array = every render; [] = mount only; [dep] = when dep changes; cleanup = before next effect + unmount',
    answer: `<pre><code>useEffect(() => {
  // effect logic
  return () => { /* cleanup */ };
}, [dependencies]);</code></pre>
<p><strong>Three dependency modes:</strong></p>
<pre><code>// 1. No array — runs after EVERY render
useEffect(() => { document.title = 'Re-ran'; });

// 2. Empty array — runs ONCE after mount
useEffect(() => {
  const ws = new WebSocket(url);
  return () => ws.close(); // cleanup on unmount
}, []);

// 3. With deps — runs when any dep changes
useEffect(() => {
  fetchUser(userId); // re-fetches whenever userId changes
}, [userId]);</code></pre>
<p><strong>Cleanup timing:</strong></p>
<ul>
<li>Runs before the next effect fires (when deps change)</li>
<li>Runs on component unmount</li>
</ul>
<pre><code>useEffect(() => {
  const id = setInterval(() => tick(), 1000);
  return () => clearInterval(id); // cleans up before next effect
}, [tick]);</code></pre>
<div class="tip">💡 Missing deps are a common bug source. The linter rule <code>exhaustive-deps</code> catches these. If adding a dep causes an infinite loop, you likely need useCallback or to restructure the effect.</div>`
  },

  {
    id: 1012, cat: 'Hooks', tags: ['mid'],
    q: 'What is the difference between useEffect and useLayoutEffect?',
    hint: 'useEffect fires after paint; useLayoutEffect fires synchronously before paint — use for DOM measurements',
    answer: `<p>Both run after render but at different times:</p>
<ul>
<li><strong>useEffect</strong> — fires <em>after</em> the browser paints. Non-blocking. Use for most side effects (data fetching, subscriptions).</li>
<li><strong>useLayoutEffect</strong> — fires <em>synchronously after DOM mutations but before paint</em>. Blocking. Use for reading layout to prevent visual flicker.</li>
</ul>
<pre><code>// useEffect — paint happens first, then effect
// Causes flicker if you update DOM based on measurement
useEffect(() => {
  const height = ref.current.offsetHeight; // reads layout
  setHeight(height); // triggers second render → visible flicker!
}, []);

// useLayoutEffect — DOM updated, effect runs, THEN paint
// No flicker because browser hasn't painted yet
useLayoutEffect(() => {
  const height = ref.current.offsetHeight;
  setHeight(height); // only one paint with correct height
}, []);</code></pre>
<p><strong>Sequence:</strong></p>
<pre><code>render → DOM mutations → useLayoutEffect → browser paint → useEffect</code></pre>
<div class="tip">💡 Prefer useEffect by default — it doesn't block the browser. Only switch to useLayoutEffect if you see visual flickers from DOM measurement/mutation. Also note: useLayoutEffect is skipped during SSR.</div>`
  },

  {
    id: 1013, cat: 'Hooks', tags: ['mid'],
    q: 'What is useRef and what are its two main use cases?',
    hint: 'Mutable box (.current) that persists across renders without causing re-renders — DOM access and storing mutable values',
    answer: `<p><code>useRef</code> returns a mutable object <code>{ current: initialValue }</code>. Changing <code>.current</code> does NOT trigger a re-render.</p>
<p><strong>Use case 1: DOM access</strong></p>
<pre><code>function TextInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // direct DOM access
  }, []);

  return <input ref={inputRef} />;
}</code></pre>
<p><strong>Use case 2: Storing mutable values (instance variables)</strong></p>
<pre><code>function Timer() {
  const intervalRef = useRef(null);
  const renderCount = useRef(0);

  renderCount.current++; // doesn't trigger re-render

  function start() {
    intervalRef.current = setInterval(tick, 1000);
  }
  function stop() {
    clearInterval(intervalRef.current); // access latest value, no stale closure
  }
}</code></pre>
<p><strong>useRef vs useState for mutable values:</strong></p>
<ul>
<li>Need re-render when it changes? → <strong>useState</strong></li>
<li>Just need to store/read without re-rendering? → <strong>useRef</strong></li>
</ul>
<div class="tip">💡 useRef solves the "stale closure" problem in event handlers or setInterval. Since .current is a stable object reference, you always read the latest value even from old closures.</div>`
  },

  {
    id: 1014, cat: 'Hooks', tags: ['mid'],
    q: 'What is useContext and when should you avoid it?',
    hint: 'Subscribe to context value — every consumer re-renders when context value changes',
    answer: `<pre><code>// 1. Create context
const ThemeContext = createContext('light');

// 2. Provide value
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. Consume anywhere in the tree
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}</code></pre>
<p><strong>When to avoid:</strong></p>
<ul>
<li><strong>High-frequency updates</strong> — every consumer re-renders on every context change. Putting frequently-changing state (mouse position, scroll) in context is expensive.</li>
<li><strong>Unrelated values in one context</strong> — split into separate contexts so consumers only re-render for changes they care about.</li>
</ul>
<pre><code>// ❌ One fat context — Button re-renders when user changes even if only needs theme
const AppContext = createContext({ theme, user, cart });

// ✅ Split contexts — each consumer only subscribes to what it needs
const ThemeContext = createContext(theme);
const UserContext  = createContext(user);</code></pre>
<div class="tip">💡 Context is not a replacement for state management — it's a way to avoid prop drilling. For high-frequency global state, use Zustand or Jotai which use subscription-based updates.</div>`
  },

  {
    id: 1015, cat: 'Hooks', tags: ['mid'],
    q: 'What is useReducer and when should you use it over useState?',
    hint: 'Complex state logic with multiple sub-values or when next state depends on action type — like Redux at component level',
    answer: `<pre><code>const [state, dispatch] = useReducer(reducer, initialState);</code></pre>
<pre><code>const initialState = { count: 0, loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':   return { ...state, count: state.count + 1 };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR':   return { ...state, error: action.payload };
    case 'RESET':       return initialState;
    default:            return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      {state.count}
    </button>
  );
}</code></pre>
<p><strong>Choose useReducer when:</strong></p>
<ul>
<li>Multiple related state values that change together</li>
<li>Next state depends on action type, not just a single value</li>
<li>Complex state transition logic you want to test independently</li>
<li>State transitions need to be auditable (dispatch history)</li>
</ul>
<div class="tip">💡 useReducer + useContext is a lightweight Redux alternative. Put dispatch in context — it's stable (never changes) so context consumers won't re-render unnecessarily when state changes.</div>`
  },

  {
    id: 1016, cat: 'Hooks', tags: ['mid'],
    q: 'What is useCallback and when does it actually help?',
    hint: 'Memoizes a function reference — only helps when the function is a dep of useEffect or a prop to React.memo children',
    answer: `<p><code>useCallback(fn, deps)</code> returns a memoized function that only changes if deps change.</p>
<pre><code>const handleClick = useCallback(() => {
  doSomething(id);
}, [id]); // only creates a new function when id changes</code></pre>
<p><strong>It only helps in two scenarios:</strong></p>
<p>1. Passed to a <code>React.memo</code> child (prevents unnecessary re-renders):</p>
<pre><code>const MemoChild = React.memo(({ onClick }) => <button onClick={onClick}>Click</button>);

// Without useCallback — new function ref every render → MemoChild always re-renders
// With useCallback — same ref if deps unchanged → MemoChild skips re-render
const handleClick = useCallback(() => doWork(id), [id]);</code></pre>
<p>2. Used as a useEffect dependency:</p>
<pre><code>const fetchData = useCallback(() => {
  api.get(url).then(setData);
}, [url]);

useEffect(() => { fetchData(); }, [fetchData]); // won't re-run unless url changes</code></pre>
<p><strong>When it does NOT help:</strong></p>
<ul>
<li>Functions passed to native DOM elements (<code>div</code>, <code>button</code>) — they don't check reference equality</li>
<li>Without <code>React.memo</code> on the child — the child re-renders regardless</li>
</ul>
<div class="tip">💡 useCallback has a cost — it runs on every render to check deps. Don't add it everywhere "just in case". Profile first, optimize second.</div>`
  },

  {
    id: 1017, cat: 'Hooks', tags: ['mid'],
    q: 'What is useMemo and how is it different from useCallback?',
    hint: 'useMemo caches a computed VALUE; useCallback caches a FUNCTION reference — both memoize based on deps',
    answer: `<pre><code>// useMemo — memoizes the RETURN VALUE of a function
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // only re-sorts when items changes

// useCallback — memoizes the FUNCTION ITSELF
const handleSort = useCallback(() => {
  setSortedList([...items].sort(...));
}, [items]);</code></pre>
<p><strong>Use useMemo for:</strong></p>
<ul>
<li>Expensive computations (filtering 10k items, building complex data structures)</li>
<li>Stable object/array references passed as props to React.memo children</li>
<li>Values used as useEffect dependencies that would otherwise change every render</li>
</ul>
<pre><code>// ❌ New object every render → useEffect re-runs every render
const options = { timeout: 5000, retries: 3 };
useEffect(() => fetchData(options), [options]);

// ✅ Stable reference
const options = useMemo(() => ({ timeout: 5000, retries: 3 }), []);
useEffect(() => fetchData(options), [options]);</code></pre>
<div class="tip">💡 useMemo(fn, deps) is equivalent to useCallback(fn, deps) when you think about it: useCallback(fn, deps) = useMemo(() => fn, deps). They're the same mechanism, different sugar.</div>`
  },

  {
    id: 1018, cat: 'Hooks', tags: ['adv'],
    q: 'What are custom hooks and what are the patterns for building them?',
    hint: 'Functions starting with "use" that call other hooks — extract reusable stateful logic',
    answer: `<p>Custom hooks extract stateful logic from components into reusable functions. They must start with <code>use</code>.</p>
<pre><code>// Custom hook — useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; }; // cleanup race condition
  }, [url]);

  return { data, loading, error };
}

// Usage — clean component
function UserProfile({ id }) {
  const { data: user, loading } = useFetch(\`/api/users/\${id}\`);
  if (loading) return <Spinner />;
  return <p>{user.name}</p>;
}</code></pre>
<p><strong>Common custom hook patterns:</strong></p>
<ul>
<li><code>useLocalStorage(key, initial)</code> — sync state with localStorage</li>
<li><code>useDebounce(value, delay)</code> — debounce a value</li>
<li><code>useOnClickOutside(ref, handler)</code> — close dropdowns</li>
<li><code>usePrevious(value)</code> — track previous render's value</li>
<li><code>useIntersectionObserver(ref)</code> — lazy loading / infinite scroll</li>
</ul>
<div class="tip">💡 Custom hooks don't share STATE — they share LOGIC. Each component that calls a custom hook gets its own isolated state. Think of them as reusable useState + useEffect combos.</div>`
  },

  {
    id: 1019, cat: 'Hooks', tags: ['adv'],
    q: 'What is useId and when do you need it?',
    hint: 'Generates stable unique IDs that are consistent between server and client — for accessibility attributes',
    answer: `<p><code>useId</code> generates a stable, unique ID that is consistent across server-side rendering and client-side hydration.</p>
<pre><code>// ❌ Problem — random or Math.random IDs cause SSR hydration mismatch
function Field({ label }) {
  const id = Math.random(); // different value on server vs client → hydration error!
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}

// ✅ useId — stable, unique, SSR-safe
function Field({ label }) {
  const id = useId(); // e.g. ":r0:", ":r1:" — consistent server + client
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}

// Multiple IDs from one useId call — append suffixes
function ComboField() {
  const id = useId();
  return (
    <>
      <label htmlFor={\`\${id}-input\`}>Name</label>
      <input id={\`\${id}-input\`} aria-describedby={\`\${id}-hint\`} />
      <p id={\`\${id}-hint\`}>Your full name</p>
    </>
  );
}</code></pre>
<div class="tip">💡 useId is purely for accessibility attributes (id, htmlFor, aria-*). Don't use it as a key prop in lists — use your data's actual IDs for those.</div>`
  },

  {
    id: 1020, cat: 'Hooks', tags: ['adv'],
    q: 'What are useImperativeHandle and forwardRef?',
    hint: 'forwardRef passes ref through to a child; useImperativeHandle customizes what the parent sees on that ref',
    answer: `<p><strong>forwardRef</strong> — lets a parent component pass a ref to a DOM node or component instance inside a child.</p>
<p><strong>useImperativeHandle</strong> — customizes what a parent receives via that ref, exposing only a controlled API instead of the raw DOM node.</p>
<pre><code>// Without forwardRef — parent can't reach inner input
function Input(props) {
  return <input {...props} />;
}

// ✅ With forwardRef — parent can call .focus(), etc.
const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});

// Parent
function Form() {
  const inputRef = useRef(null);
  return (
    <>
      <Input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}

// ─── useImperativeHandle — expose limited API ──────────────────────────────
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
    // Parent can NOT access inputRef.current directly — only these two methods
  }));

  return <input ref={inputRef} {...props} />;
});

const ref = useRef();
ref.current.focus(); // ✅
ref.current.value;   // ❌ undefined — not exposed</code></pre>
<div class="tip">💡 Use forwardRef sparingly — it tightly couples parent to child internals. Most of the time you can solve the problem with a controlled component pattern instead. Use it mainly for UI library components (inputs, modals).</div>`
  },

  // ─── STATE MANAGEMENT ─────────────────────────────────────────────────────

  {
    id: 1021, cat: 'State Management', tags: ['core'],
    q: 'What are the different state management options in React and when do you use each?',
    hint: 'Local state → Context → Zustand/Jotai → Redux — choose based on scope and update frequency',
    answer: `<p>Choose based on <strong>scope</strong> (who needs the state) and <strong>update frequency</strong>:</p>
<ul>
<li><strong>useState / useReducer</strong> — component-local state. First choice always.</li>
<li><strong>Lifting state up</strong> — share between sibling components via common ancestor.</li>
<li><strong>Context + useReducer</strong> — low-frequency global state (theme, auth, locale). Don't put rapidly-changing state here.</li>
<li><strong>Zustand / Jotai / Recoil</strong> — global state with fine-grained subscriptions. Components only re-render when their slice changes.</li>
<li><strong>Redux Toolkit</strong> — large teams, complex state, need time-travel debugging, strict patterns.</li>
<li><strong>React Query / SWR</strong> — server state (fetched data). Cache, invalidation, background refresh. NOT the same as UI state.</li>
</ul>
<pre><code>// Server state — always React Query or SWR, not useState
const { data, loading, error } = useQuery(['user', id], () => fetchUser(id));

// Global UI state (e.g. sidebar open) — Zustand
const useSidebar = create(set => ({
  open: false,
  toggle: () => set(s => ({ open: !s.open })),
}));

// Form state — react-hook-form or local useState</code></pre>
<div class="tip">💡 80% of "state management" problems are actually server state problems. React Query eliminates huge amounts of boilerplate (loading, error, refetch, caching) that people used to put in Redux.</div>`
  },

  {
    id: 1022, cat: 'State Management', tags: ['mid'],
    q: 'What is server state vs client state and why does the distinction matter?',
    hint: 'Server state lives on the backend (stale, async, shared); client state is local UI state — they need different tools',
    answer: `<p>Two fundamentally different problems often lumped together:</p>
<p><strong>Client state</strong> — UI-only data: is the modal open? which tab is selected? filter selections. Lives in the browser, synchronous, you own it completely.</p>
<p><strong>Server state</strong> — data fetched from an API: user profile, products, orders. Lives on the server, asynchronous, can be stale, multiple components may need the same data, can change externally.</p>
<pre><code>// ❌ Treating server state like client state
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/users')
    .then(r => r.json())
    .then(setUsers)
    .catch(setError)
    .finally(() => setLoading(false));
}, []); // No caching, no refetch, no deduplication

// ✅ React Query handles all of it
const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(r => r.json()),
  staleTime: 5 * 60 * 1000, // cache for 5 minutes
});</code></pre>
<div class="tip">💡 Separating these two concerns simplifies your state management enormously. Use React Query/SWR for everything async. Use Zustand/Context for UI state. You likely don't need Redux at all.</div>`
  },

  // ─── COMPONENT PATTERNS ───────────────────────────────────────────────────

  {
    id: 1023, cat: 'Component Patterns', tags: ['mid'],
    q: 'What is the Compound Component pattern?',
    hint: 'Related components share implicit state via context — like <select> and <option> in HTML',
    answer: `<p>Compound components work together, sharing state implicitly through context. The parent manages state; children access it without explicit prop passing.</p>
<pre><code>const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={active === id}
      onClick={() => setActive(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext);
  return active === id ? <div role="tabpanel">{children}</div> : null;
}

// Usage — clean, flexible, no prop drilling
<Tabs defaultTab="profile">
  <TabList>
    <Tab id="profile">Profile</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>
  <TabPanel id="profile"><ProfileView /></TabPanel>
  <TabPanel id="settings"><SettingsView /></TabPanel>
</Tabs></code></pre>
<div class="tip">💡 Good examples: Tabs, Accordion, Dropdown, Form with Field/Label/Error subcomponents. The key insight — the developer using the component controls the structure; the component controls the behavior.</div>`
  },

  {
    id: 1024, cat: 'Component Patterns', tags: ['mid'],
    q: 'What is the Render Props pattern and when would you still use it?',
    hint: 'Pass a function as a prop that returns JSX — the component calls it with its internal state',
    answer: `<pre><code>// Render props — component shares state by calling a function prop
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)} {/* caller decides what to render */}
    </div>
  );
}

// Usage
<MouseTracker render={({ x, y }) => (
  <p>Mouse at {x}, {y}</p>
)} />

// children as a function (same pattern)
<MouseTracker>
  {({ x, y }) => <Circle x={x} y={y} />}
</MouseTracker></code></pre>
<p><strong>Render props vs custom hooks:</strong></p>
<ul>
<li>Custom hooks replaced most render prop use cases (simpler, less nesting)</li>
<li>Render props still shine when you need to inject JSX into a specific DOM location managed by the component</li>
<li>Libraries like React Table, Downshift, and Formik use render props for maximum flexibility</li>
</ul>
<div class="tip">💡 If the render prop is just sharing state logic, refactor to a custom hook. If it's about rendering into a specific slot (like a virtualized list rendering each row), render props are still the right tool.</div>`
  },

  {
    id: 1025, cat: 'Component Patterns', tags: ['adv'],
    q: 'What is the Provider pattern and how do you build a scalable context architecture?',
    hint: 'Separate state logic from context provision — custom hook for consumers, provider component for setup',
    answer: `<pre><code>// ─── auth-context.tsx ───────────────────────────────────────────────────────
type AuthContextValue = {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Provider encapsulates all auth logic
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (creds) => {
    const user = await api.login(creds);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — type-safe, error if used outside provider
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── app layout ──────────────────────────────────────────────────────────────
<AuthProvider>
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ThemeProvider>
</AuthProvider></code></pre>
<div class="tip">💡 The null-check in useAuth() is critical for DX — it gives a clear error message instead of a cryptic "cannot read property of undefined" when someone forgets the provider.</div>`
  },

  {
    id: 1026, cat: 'Component Patterns', tags: ['adv'],
    q: 'What is the Container/Presentational pattern? Is it still relevant?',
    hint: 'Smart vs dumb components — data fetching separated from rendering; largely replaced by hooks but the principle remains',
    answer: `<p>The pattern separates <strong>data concerns</strong> (fetching, state) from <strong>UI concerns</strong> (rendering, styling):</p>
<pre><code>// ❌ Old way — explicit Container component
function UserListContainer() {
  const [users, setUsers] = useState([]);
  useEffect(() => { fetchUsers().then(setUsers); }, []);
  return <UserList users={users} />; // pass data down
}

function UserList({ users }) {
  return users.map(u => <UserCard key={u.id} user={u} />);
}

// ✅ Modern way — custom hook achieves the same separation
function useUsers() {
  return useQuery(['users'], fetchUsers);
}

// Presentational component stays the same
function UserList({ users }) {
  return users.map(u => <UserCard key={u.id} user={u} />);
}

// Consuming component — much simpler
function UsersPage() {
  const { data: users } = useUsers();
  return <UserList users={users ?? []} />;
}</code></pre>
<p><strong>Still relevant principles:</strong></p>
<ul>
<li>Keep components that render UI free of data-fetching — easier to test, reuse in Storybook</li>
<li>The separation now lives in custom hooks, not wrapper components</li>
</ul>
<div class="tip">💡 The pattern's goal (separation of concerns) is still correct; the implementation changed. Hooks achieve it more elegantly without extra component nesting.</div>`
  },

  // ─── PERFORMANCE ──────────────────────────────────────────────────────────

  {
    id: 1027, cat: 'Performance', tags: ['mid'],
    q: 'What is React.memo and when does it actually prevent re-renders?',
    hint: 'Shallow prop comparison — skips re-render if props are shallowly equal. Useless without stable prop references.',
    answer: `<p><code>React.memo</code> wraps a component and shallowly compares old and new props. Skips the re-render if props haven't changed.</p>
<pre><code>const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  // Only re-renders if items or onSelect reference changes
  return items.map(item => <Item key={item.id} item={item} onClick={onSelect} />);
});

// ─── For memo to work, props must be stable references ────────────────────
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New array reference every render → memo useless
  const items = [{ id: 1 }, { id: 2 }];
  const onSelect = (id) => console.log(id);

  // ✅ Stable references
  const items = useMemo(() => [{ id: 1 }, { id: 2 }], []);
  const onSelect = useCallback((id) => console.log(id), []);

  return <ExpensiveList items={items} onSelect={onSelect} />;
}</code></pre>
<p><strong>Custom comparison:</strong></p>
<pre><code>const List = React.memo(Component, (prev, next) => {
  return prev.items.length === next.items.length; // custom equality
});</code></pre>
<div class="tip">💡 React.memo is not free — it adds a comparison on every render. Only add it to components that are measurably slow or render very frequently. Profile with React DevTools Profiler first.</div>`
  },

  {
    id: 1028, cat: 'Performance', tags: ['mid'],
    q: 'What is code splitting and lazy loading in React?',
    hint: 'React.lazy + Suspense — load component code only when needed, reduces initial bundle',
    answer: `<pre><code>import { lazy, Suspense } from 'react';

// ❌ Eager import — bundled in the main chunk even if rarely used
import HeavyChart from './HeavyChart';

// ✅ Lazy — loaded only when rendered for the first time
const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminPanel = lazy(() => import('./AdminPanel'));

// Suspense shows fallback while the chunk loads
function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  );
}

// Route-based code splitting — most impactful
const Home    = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin   = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin"   element={<Admin />} />
      </Routes>
    </Suspense>
  );
}</code></pre>
<div class="tip">💡 Route-level splitting is the highest-impact optimization. Admin panels, dashboards, and settings pages are perfect candidates — users on the landing page never need that code.</div>`
  },

  {
    id: 1029, cat: 'Performance', tags: ['adv'],
    q: 'What is virtualization (windowing) and when do you need it?',
    hint: 'Render only visible items in a long list — react-window / react-virtual renders a DOM window into a large dataset',
    answer: `<p>Virtualization renders only the items visible in the viewport instead of the entire list. For 10,000 items, you might only render 20 DOM nodes at a time.</p>
<pre><code>import { FixedSizeList } from 'react-window';

// ❌ Renders all 10,000 DOM nodes immediately
function NaiveList({ items }) {
  return items.map(item => <Row key={item.id} item={item} />);
}

// ✅ Renders ~20 DOM nodes, recycles them as you scroll
function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}> {/* style positions the row */}
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}      // viewport height
      itemCount={items.length}
      itemSize={50}     // each row height
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}</code></pre>
<p><strong>When to virtualize:</strong></p>
<ul>
<li>Lists with 100+ items where each item has significant DOM</li>
<li>Visible performance issues (jank, slow initial render)</li>
<li>Tables, feeds, chat history, autocomplete dropdowns</li>
</ul>
<p><strong>Libraries:</strong> react-window (smaller), react-virtual (TanStack, headless), react-virtuoso (variable heights)</p>
<div class="tip">💡 Pagination or infinite scroll at ~50 items is often enough and simpler. Reach for virtualization when you genuinely have 500+ items that must all be available without pagination.</div>`
  },

  {
    id: 1030, cat: 'Performance', tags: ['adv'],
    q: 'What causes unnecessary re-renders and how do you diagnose them?',
    hint: 'Parent renders, new object/function props, context value changes — diagnose with React DevTools Profiler',
    answer: `<p><strong>Common causes:</strong></p>
<ul>
<li>Parent re-renders → all children re-render (even with same props, unless memoized)</li>
<li>New object/array/function created inline → reference changes → memo fails</li>
<li>Context value is a new object reference → all consumers re-render</li>
<li>State updates that produce the same value (React bails out after first redundant render)</li>
</ul>
<pre><code>// ❌ New object every render — breaks memo
<Component style={{ color: 'red' }} />  // new {} each time
<Component onClick={() => doWork()} />  // new fn each time
<Component items={[1, 2, 3]} />         // new [] each time

// ❌ Context providing unstable reference
function Provider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <Ctx.Provider value={{ user, setUser }}>  {/* new object every render! */}
      {children}
    </Ctx.Provider>
  );
}

// ✅ Stable context value
const value = useMemo(() => ({ user, setUser }), [user]);</code></pre>
<p><strong>Diagnosis tools:</strong></p>
<ul>
<li>React DevTools → Profiler → record interaction → see what rendered and why</li>
<li>React DevTools → Components → highlight updates checkbox</li>
<li><code>why-did-you-render</code> library — logs unnecessary renders with reasons</li>
</ul>
<div class="tip">💡 Re-renders are not always a problem — React is fast. Optimize only when you measure a real performance issue. Premature memoization adds complexity and can introduce bugs.</div>`
  },

  // ─── REACT ROUTER ─────────────────────────────────────────────────────────

  {
    id: 1031, cat: 'React Router', tags: ['core'],
    q: 'How does React Router v6 work and what are the key hooks?',
    hint: 'Nested Routes with Outlet, useNavigate instead of useHistory, useParams, useSearchParams',
    answer: `<pre><code>import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Route definition — v6 syntax
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Layout component — Outlet renders matched child route
function Layout() {
  return (
    <div>
      <Nav />
      <main><Outlet /></main>
    </div>
  );
}</code></pre>
<p><strong>Key hooks:</strong></p>
<pre><code>// Navigate programmatically
const navigate = useNavigate();
navigate('/users/123');
navigate(-1); // go back

// Route params — /users/:id
const { id } = useParams();

// Query string — /users?tab=active
const [searchParams, setSearchParams] = useSearchParams();
const tab = searchParams.get('tab');

// Current location
const location = useLocation();
console.log(location.pathname, location.search, location.state);</code></pre>
<div class="tip">💡 v6 removed useHistory (now useNavigate), Switch (now Routes), exact prop (now default), and Redirect (now Navigate component). Nested routes no longer need full paths — relative routing is the default.</div>`
  },

  {
    id: 1032, cat: 'React Router', tags: ['mid'],
    q: 'How do you implement protected routes in React Router?',
    hint: 'Wrapper component that checks auth state and redirects — compose with Outlet for nested protection',
    answer: `<pre><code>// ─── Option 1: Wrapper component ─────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, save the page they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// ─── Option 2: Layout route (cleaner for many protected routes) ───────────────
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // render the matched child
}

// Wrap all protected routes under one parent
<Routes>
  <Route path="/login" element={<Login />} />
  <Route element={<RequireAuth />}>          {/* no path — just a guard */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
</Routes>

// After login — redirect to original destination
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  async function handleLogin(creds) {
    await login(creds);
    navigate(from, { replace: true }); // replace so back button works
  }
}</code></pre>
<div class="tip">💡 Always use replace when redirecting after login — so the user's back button goes to where they originally wanted to go, not to a login loop.</div>`
  },

  // ─── FORMS ────────────────────────────────────────────────────────────────

  {
    id: 1033, cat: 'Forms', tags: ['mid'],
    q: 'What is react-hook-form and why is it better than manual controlled forms?',
    hint: 'Uncontrolled inputs with ref-based validation — zero re-renders per keystroke, minimal boilerplate',
    answer: `<p>Manual controlled forms re-render on every keystroke for every field. react-hook-form uses uncontrolled inputs and only triggers re-renders on validation state changes.</p>
<pre><code>import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await api.login(data); // data is fully typed and validated
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <button disabled={isSubmitting}>Login</button>
    </form>
  );
}</code></pre>
<p><strong>Why it's better:</strong></p>
<ul>
<li>Zero re-renders while typing (uncontrolled under the hood)</li>
<li>Schema-based validation with Zod/Yup integration</li>
<li>Tiny bundle (9kb), no dependencies</li>
<li>Works with any UI library (MUI, Chakra, Radix)</li>
</ul>
<div class="tip">💡 react-hook-form's register() returns { name, ref, onChange, onBlur }. The ref tracks the DOM input value. React never "knows" about each keystroke — validation only fires on blur/submit.</div>`
  },

  // ─── ADVANCED PATTERNS ────────────────────────────────────────────────────

  {
    id: 1034, cat: 'Advanced Patterns', tags: ['adv'],
    q: 'What is Error Boundary and how do you implement one?',
    hint: 'Class component wrapping the tree — catches render errors and shows fallback UI instead of blank screen',
    answer: `<p>Error Boundaries catch JavaScript errors during rendering, in lifecycle methods, and in constructors of child components. They must be <strong>class components</strong> (no hook equivalent yet).</p>
<pre><code>class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Render phase — update state to show fallback
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Commit phase — log error to monitoring service
  componentDidCatch(error, info) {
    logErrorToSentry(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

// Usage — wrap features, not the entire app
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <ErrorBoundary fallback={<WidgetError />}>
        <SomeWidget />
      </ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
}

// react-error-boundary library — hook-friendly wrapper
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={logError}
  onReset={resetApp}
>
  <App />
</ErrorBoundary></code></pre>
<div class="tip">💡 Error boundaries do NOT catch errors in event handlers, async code (setTimeout, fetch), or SSR. Use try/catch for those. Place boundaries at feature level, not component level — granular boundaries give better UX.</div>`
  },

  {
    id: 1035, cat: 'Advanced Patterns', tags: ['adv'],
    q: 'What is the Suspense pattern and data fetching with it?',
    hint: 'Suspend rendering while async work completes — component throws a Promise; Suspense catches it and shows fallback',
    answer: `<p>Suspense lets components "wait" for something before rendering. The component throws a Promise; React catches it and shows the fallback.</p>
<pre><code>// React.lazy — built-in Suspense integration
const Chart = lazy(() => import('./Chart'));

// React Query with Suspense mode
function UserProfile({ id }) {
  // This will suspend (throw) if data isn't ready yet
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });

  return <p>{user.name}</p>; // Only renders when data is ready
}

// Wrapping with Suspense
function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <UserProfile id={1} />
    </Suspense>
  );
}

// Nested Suspense — granular loading states
function Dashboard() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <UserProfile />
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />  {/* loads independently */}
      </Suspense>
    </Suspense>
  );
}</code></pre>
<div class="tip">💡 Suspense eliminates the isLoading + early return pattern. The component is always in a "ready" state — Suspense handles the loading state above it. Combine with Error Boundaries for complete coverage.</div>`
  },

  {
    id: 1036, cat: 'Advanced Patterns', tags: ['adv'],
    q: 'What is prop spreading and when is it an anti-pattern?',
    hint: '{...props} forwards all props — useful for wrapper components but can pass wrong props to DOM elements',
    answer: `<pre><code>// ✅ Legitimate use — forwarding unknown props to underlying element
function Button({ variant, className, ...rest }) {
  return (
    <button
      className={\`btn btn-\${variant} \${className}\`}
      {...rest}  // forwards onClick, disabled, type, aria-*, etc.
    />
  );
}

// ❌ Anti-pattern 1 — unknown DOM attributes cause React warnings
function Box({ color, ...rest }) {
  return <div {...rest} />; // if 'color' is in rest, "Unknown prop 'color'" warning
}

// ✅ Fix — destructure all custom props, only spread standard ones
function Box({ color, size, children, ...htmlProps }) {
  return <div style={{ color }} {...htmlProps}>{children}</div>;
}

// ❌ Anti-pattern 2 — spreading all parent props down
function Parent(props) {
  return <Child {...props} />; // leaks parent-specific props to child
}

// ❌ Anti-pattern 3 — security risk with user-provided data
// If attackers control the props object, they could inject onClick etc.
const userConfig = JSON.parse(untrustedInput);
<Component {...userConfig} /> // dangerous!</code></pre>
<div class="tip">💡 Always destructure custom props before spreading. "Rest" in a component should only contain valid HTML attributes for the element it spreads onto.</div>`
  },

  // ─── CONCURRENT REACT ─────────────────────────────────────────────────────

  {
    id: 1037, cat: 'Concurrent React', tags: ['adv'],
    q: 'What is Concurrent Mode and what problems does it solve?',
    hint: 'React can pause, resume, and abandon renders — keeps the UI responsive during expensive updates',
    answer: `<p><strong>Concurrent React</strong> (enabled by default in React 18 with <code>createRoot</code>) lets React pause work in progress when something more urgent arrives, then resume it later.</p>
<p><strong>Problems it solves:</strong></p>
<ul>
<li><strong>Blocking renders</strong> — expensive renders blocked the main thread, causing input lag. Now React can interrupt a slow render to handle a keypress.</li>
<li><strong>Tearing</strong> — reading from an external store during a render could give inconsistent UI. Concurrent React prevents this with useSyncExternalStore.</li>
<li><strong>Waterfall loading</strong> — with Suspense + concurrent features, React can start rendering before all data is ready.</li>
</ul>
<pre><code>// React 18 — opt in to concurrent features
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(<App />);

// Now transitions, Suspense, startTransition all work correctly</code></pre>
<p><strong>New APIs enabled by concurrency:</strong></p>
<ul>
<li><code>startTransition</code> / <code>useTransition</code> — mark updates as non-urgent</li>
<li><code>useDeferredValue</code> — defer a value until the browser is idle</li>
<li><code>Suspense</code> for data fetching — show fallbacks while data loads</li>
<li><code>useId</code> — stable IDs for SSR</li>
</ul>
<div class="tip">💡 Your render functions must be pure (no side effects) for concurrent mode to work correctly — React may call them multiple times or discard partial results.</div>`
  },

  {
    id: 1038, cat: 'Concurrent React', tags: ['adv'],
    q: 'What are useTransition and useDeferredValue?',
    hint: 'Mark state updates as non-urgent so React can keep the UI responsive — show stale content while new content loads',
    answer: `<p>Both allow non-urgent updates to be deferred so urgent updates (typing, clicking) stay responsive.</p>
<p><strong>useTransition</strong> — marks a state update as a transition:</p>
<pre><code>function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // urgent — update input immediately

    startTransition(() => {
      // non-urgent — can be interrupted if user keeps typing
      setResults(expensiveFilter(e.target.value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultsList results={results} />}
    </>
  );
}</code></pre>
<p><strong>useDeferredValue</strong> — defer a value you receive (useful when you don't own the state setter):</p>
<pre><code>function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query); // lags behind query
  const results = expensiveFilter(deferredQuery); // uses stale value during typing
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      {results.map(r => <Result key={r.id} result={r} />)}
    </div>
  );
}</code></pre>
<div class="tip">💡 useTransition is for when you own the state update. useDeferredValue is for when you receive a value as a prop. Both achieve the same goal — responsive typing + deferred expensive render.</div>`
  },

  // ─── SERVER COMPONENTS ────────────────────────────────────────────────────

  {
    id: 1039, cat: 'Server Components', tags: ['adv'],
    q: 'What are React Server Components (RSC) and how do they differ from SSR?',
    hint: 'RSC run exclusively on the server, never ship to client, can be async — SSR renders client components on the server too',
    answer: `<p><strong>Server Components</strong> run ONLY on the server. Their code is never sent to the browser. They can be async, access databases directly, and use server-only secrets.</p>
<p><strong>Key differences from SSR:</strong></p>
<ul>
<li><strong>SSR</strong> — renders the same client components on the server to generate initial HTML, then ships JS to "hydrate" them. Bundle still goes to client.</li>
<li><strong>RSC</strong> — runs on server, sends a serialized component tree (not HTML) to the client. The component's code is never in the bundle.</li>
</ul>
<pre><code>// ✅ Server Component — async, DB access, no useState
// app/users/page.tsx (in Next.js App Router)
async function UsersPage() {
  const users = await db.query('SELECT * FROM users'); // direct DB, no API needed
  return <UserList users={users} />;
}

// ✅ Client Component — interactive, uses hooks
'use client';
function UserList({ users }) {
  const [filter, setFilter] = useState('');
  return (
    <>
      <input onChange={e => setFilter(e.target.value)} />
      {users.filter(u => u.name.includes(filter)).map(u => <div>{u.name}</div>)}
    </>
  );
}

// Composing — Server component renders Client component (passes serializable props)
// ❌ Client component CANNOT import Server component
// ✅ Server component can import Client component</code></pre>
<div class="tip">💡 RSC are not a React feature you opt into — they're a framework feature (Next.js App Router, Remix). The mental model: RSC = zero-bundle backend rendering. Client components = interactive islands.</div>`
  },

  {
    id: 1040, cat: 'Server Components', tags: ['adv'],
    q: 'What is hydration and what causes hydration errors?',
    hint: 'Attaching React event listeners to server-rendered HTML — mismatch between server and client render causes errors',
    answer: `<p><strong>Hydration</strong> is the process of React attaching event listeners and state to server-rendered HTML. React "expects" the client render to produce identical HTML to what the server sent.</p>
<p><strong>Common causes of hydration mismatch:</strong></p>
<pre><code>// ❌ Browser-only APIs in render
function Component() {
  return <div>{window.innerWidth}</div>; // window doesn't exist on server!
}

// ❌ Rendering different content for logged-in users
function Greeting() {
  return <p>Hello {localStorage.getItem('name')}</p>; // localStorage = server-undefined
}

// ❌ Time/random values
function Card() {
  return <p>Generated at: {new Date().toISOString()}</p>; // different each render
}
function Avatar() {
  return <img src={\`https://api/avatar?\${Math.random()}\`} />; // different random
}</code></pre>
<p><strong>Fixes:</strong></p>
<pre><code>// ✅ useEffect for browser-only values (runs client-side only)
function Component() {
  const [width, setWidth] = useState(0);
  useEffect(() => { setWidth(window.innerWidth); }, []);
  return <div>{width}</div>;
}

// ✅ suppressHydrationWarning for expected mismatches (timestamps)
<time suppressHydrationWarning>{new Date().toISOString()}</time></code></pre>
<div class="tip">💡 The suppressHydrationWarning prop should be used sparingly — it hides real errors. Fix the root cause wherever possible.</div>`
  },

  // ─── TESTING ──────────────────────────────────────────────────────────────

  {
    id: 1041, cat: 'Testing', tags: ['mid'],
    q: 'What is React Testing Library and what is its testing philosophy?',
    hint: 'Test behavior from the user\'s perspective — query by role/label/text, not by class or test ID',
    answer: `<p>React Testing Library (RTL) is built around one guiding principle: <em>"The more your tests resemble the way your software is used, the more confidence they can give you."</em></p>
<p><strong>Query priority (use in this order):</strong></p>
<ol>
<li><code>getByRole</code> — best, mirrors what screen readers see</li>
<li><code>getByLabelText</code> — form inputs by their label</li>
<li><code>getByText</code> — visible text content</li>
<li><code>getByTestId</code> — last resort only</li>
</ol>
<pre><code>import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments counter when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  // Query by role — accessible, matches what users see
  const button = screen.getByRole('button', { name: /increment/i });
  const count  = screen.getByText('0');

  await user.click(button);

  expect(screen.getByText('1')).toBeInTheDocument();
});

test('shows error for invalid email', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/email/i), 'not-an-email');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});</code></pre>
<div class="tip">💡 Avoid testing implementation details (state values, method calls). If you refactor the internals but the behavior is the same, tests should still pass. RTL forces you toward this naturally.</div>`
  },

  {
    id: 1042, cat: 'Testing', tags: ['mid'],
    q: 'How do you test custom hooks?',
    hint: 'renderHook from @testing-library/react — wraps the hook in a minimal component',
    answer: `<pre><code>import { renderHook, act } from '@testing-library/react';

// Hook under test
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount(c => c + 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, reset };
}

// Test
test('useCounter increments and resets', () => {
  const { result } = renderHook(() => useCounter(5));

  expect(result.current.count).toBe(5);

  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(6);

  act(() => { result.current.reset(); });
  expect(result.current.count).toBe(5);
});

// Hook with context dependency — provide the context wrapper
test('useAuth returns user from context', () => {
  const wrapper = ({ children }) => (
    <AuthProvider initialUser={mockUser}>{children}</AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.user).toEqual(mockUser);
});</code></pre>
<div class="tip">💡 Always wrap state updates in act(). RTL's userEvent does this automatically, but direct calls to hook functions need act() to flush React's update queue.</div>`
  },

  {
    id: 1043, cat: 'Testing', tags: ['adv'],
    q: 'How do you mock API calls in React tests?',
    hint: 'MSW (Mock Service Worker) intercepts network requests at the service worker level — no mocking of fetch/axios',
    answer: `<pre><code>// ─── Using MSW (recommended) ──────────────────────────────────────────────────
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'Alice' }]);
  }),
  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    if (body.password === 'wrong') {
      return HttpResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
    return HttpResponse.json({ token: 'abc123' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays users from API', async () => {
  render(<UserList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await screen.findByText('Alice'); // waits for async render
});

// Override for a specific test
test('shows error on failed login', async () => {
  server.use(
    http.post('/api/login', () => {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    })
  );
  render(<LoginForm />);
  // ... assert error state
});</code></pre>
<div class="tip">💡 MSW is the gold standard because it intercepts at the network level — your code uses the real fetch, so you test the actual data-fetching logic, not a mock of fetch. Works in both tests and browser for development.</div>`
  },

  // ─── ECOSYSTEM ────────────────────────────────────────────────────────────

  {
    id: 1044, cat: 'Ecosystem', tags: ['mid'],
    q: 'What is the difference between Next.js Pages Router and App Router?',
    hint: 'Pages Router = getServerSideProps/getStaticProps; App Router = RSC by default, layouts, streaming',
    answer: `<p>Next.js 13+ introduced the App Router as a complete architectural shift:</p>
<table>
<tr><th>Feature</th><th>Pages Router</th><th>App Router</th></tr>
<tr><td>Default component type</td><td>Client component</td><td>Server component</td></tr>
<tr><td>Data fetching</td><td>getServerSideProps, getStaticProps</td><td>async/await in component</td></tr>
<tr><td>Layouts</td><td>_app.tsx + manual</td><td>layout.tsx nesting</td></tr>
<tr><td>Loading states</td><td>Manual</td><td>loading.tsx (Suspense)</td></tr>
<tr><td>Error handling</td><td>Manual</td><td>error.tsx (Error Boundary)</td></tr>
<tr><td>Streaming</td><td>❌</td><td>✅ built-in</td></tr>
</table>
<pre><code>// App Router — data fetching is just async/await
// app/users/page.tsx
async function UsersPage() {
  const users = await fetch('/api/users').then(r => r.json());
  return <UserList users={users} />;
}

// Pages Router equivalent
export async function getServerSideProps() {
  const users = await fetch('/api/users').then(r => r.json());
  return { props: { users } };
}
export default function UsersPage({ users }) {
  return <UserList users={users} />;
}</code></pre>
<div class="tip">💡 The App Router is the future of Next.js. New projects should use it. The Pages Router is in maintenance mode — it won't be removed but new features land in App Router only.</div>`
  },

  {
    id: 1045, cat: 'Ecosystem', tags: ['mid'],
    q: 'What is TanStack Query (React Query) and what does it solve?',
    hint: 'Async state manager for server data — caching, background refetch, stale-while-revalidate, mutations',
    answer: `<p>React Query manages server state with automatic caching, background updates, and synchronization — things you'd have to build manually with useEffect.</p>
<pre><code>import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ─── Query — fetch and cache ──────────────────────────────────────────────────
function UserProfile({ id }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],      // cache key — same key = same cache
    queryFn: () => api.getUser(id),
    staleTime: 5 * 60 * 1000,   // treat as fresh for 5 minutes
    gcTime: 10 * 60 * 1000,     // keep in cache for 10 minutes
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  return <p>{user.name}</p>;
}

// ─── Mutation — update and invalidate ────────────────────────────────────────
function UpdateUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => api.updateUser(data),
    onSuccess: (data) => {
      // Invalidate cache → triggers refetch of all user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // OR optimistic update
      queryClient.setQueryData(['user', data.id], data);
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ id: 1, name: 'Bob' })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Saving...' : 'Save'}
    </button>
  );
}</code></pre>
<div class="tip">💡 React Query eliminates ~80% of what people used Redux for — loading states, error states, cached server data, and refetch logic. Use Redux or Zustand only for genuine UI state (modals, sidebars, form wizards).</div>`
  },

  {
    id: 1046, cat: 'Ecosystem', tags: ['mid'],
    q: 'What is Zustand and how does it compare to Context?',
    hint: 'Store-based state with subscription model — only components subscribing to a specific slice re-render',
    answer: `<pre><code>import { create } from 'zustand';

// Define the store
const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (item) => set(state => ({
    items: [...state.items, item],
    total: state.total + item.price,
  })),

  removeItem: (id) => set(state => {
    const item = state.items.find(i => i.id === id);
    return {
      items: state.items.filter(i => i.id !== id),
      total: state.total - (item?.price ?? 0),
    };
  }),

  clearCart: () => set({ items: [], total: 0 }),
}));

// Consume — component only re-renders when items changes
function CartBadge() {
  const items = useCartStore(state => state.items); // subscribe to slice
  return <span>{items.length}</span>;
}

// Another component — only subscribes to total
function CartTotal() {
  const total = useCartStore(state => state.total);
  return <span>\${total}</span>;
}</code></pre>
<p><strong>Zustand vs Context:</strong></p>
<ul>
<li><strong>Context</strong> — all consumers re-render on any context change. Fine for low-frequency updates (theme, auth).</li>
<li><strong>Zustand</strong> — subscription-based. Component re-renders only when its specific slice changes. Better for frequent updates and large stores.</li>
<li><strong>No Provider needed</strong> — Zustand store is a module. Import and use anywhere.</li>
</ul>
<div class="tip">💡 Zustand is intentionally minimal. For derived state, just compute it in the component. Use <code>subscribeWithSelector</code> middleware for more granular subscriptions.</div>`
  },

  {
    id: 1047, cat: 'Ecosystem', tags: ['adv'],
    q: 'What are the key differences between Vite and Create React App?',
    hint: 'Vite uses native ES modules in dev — instant server start vs CRA\'s webpack bundle',
    answer: `<p>CRA (Create React App) is largely deprecated. Vite is the modern standard for React projects.</p>
<table>
<tr><th></th><th>Create React App</th><th>Vite</th></tr>
<tr><td>Dev server start</td><td>30-60s (bundles everything)</td><td>&lt;300ms (no bundling)</td></tr>
<tr><td>HMR (hot reload)</td><td>Slow (rebundles)</td><td>Instant (native ESM)</td></tr>
<tr><td>Build tool</td><td>webpack</td><td>Rollup (prod), esbuild (dev)</td></tr>
<tr><td>Config</td><td>Ejection required</td><td>vite.config.ts</td></tr>
<tr><td>Maintenance</td><td>Unmaintained</td><td>Actively maintained</td></tr>
</table>
<pre><code>// Vite dev — serves files directly as ES modules
// Browser requests /src/App.tsx → Vite transforms just that file → instant

// CRA dev — bundles ALL files on start, then watches
// Every change → re-bundle affected module graph → slow

// Starting a new project
npm create vite@latest my-app -- --template react-ts
# vs
npx create-react-app my-app --template typescript  # avoid</code></pre>
<p><strong>Alternatives for production apps:</strong></p>
<ul>
<li><strong>Next.js</strong> — SSR, SSG, RSC, file-based routing</li>
<li><strong>Remix</strong> — full-stack, nested routing, web standards</li>
<li><strong>Vite + React Router</strong> — SPA with full control</li>
</ul>
<div class="tip">💡 The React team no longer recommends CRA. Their official docs point to Next.js, Remix, or Vite as starting points depending on your needs.</div>`
  },

  {
    id: 1048, cat: 'React Fundamentals', tags: ['adv'],
    q: 'What is StrictMode and what does it do in development?',
    hint: 'Intentionally double-invokes render, effects to expose impure code and side effects — dev only, no production cost',
    answer: `<p><code>React.StrictMode</code> is a development tool that helps you find bugs by intentionally stressing your components.</p>
<p><strong>What it does (dev only):</strong></p>
<ul>
<li><strong>Double-invokes render functions</strong> — component function called twice to detect impure renders</li>
<li><strong>Double-invokes effects</strong> — mounts, unmounts, and remounts every component to surface missing cleanup</li>
<li><strong>Warns about deprecated APIs</strong> — componentWillMount, findDOMNode, etc.</li>
</ul>
<pre><code>// StrictMode reveals this bug:
function BadComponent() {
  const items = []; // 💥 rendered twice, items reset each time — detected!
  items.push('item'); // pure render must not have side effects
  return <div>{items}</div>;
}

// StrictMode reveals missing cleanup:
useEffect(() => {
  const ws = new WebSocket(url); // mount #1 — created
  // StrictMode: unmount → cleanup should close ws
  //             mount #2 — second connection opened
  // If no cleanup, you'd have two connections — StrictMode exposes this
  return () => ws.close(); // ✅ proper cleanup
}, [url]);

// Usage
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);</code></pre>
<div class="tip">💡 In React 18, StrictMode's double-effect firing is intentional preparation for a future feature (Offscreen). If your effect fires twice and causes a bug, you have a missing cleanup function — fix that, don't remove StrictMode.</div>`
  },

  {
    id: 1049, cat: 'Hooks', tags: ['adv'],
    q: 'What is the stale closure problem in React hooks and how do you fix it?',
    hint: 'A closure captures variables at creation time — if state changes but the closure isn\'t recreated, it reads old values',
    answer: `<p>A <strong>stale closure</strong> occurs when a function captures a value from a previous render and never gets updated to see the new value.</p>
<pre><code>// ❌ Classic example — setInterval with stale count
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // always logs 0 — stale closure!
      setCount(count + 1); // always sets to 1 — bug!
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps — closure captures count=0 forever
}

// ✅ Fix 1 — functional update (doesn't need to close over count)
setCount(c => c + 1); // always gets the latest count

// ✅ Fix 2 — add count to deps (effect re-runs on every count change)
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id); // cleans up old interval
}, [count]);

// ✅ Fix 3 — useRef stores mutable value, not affected by closures
const countRef = useRef(count);
useEffect(() => { countRef.current = count; }, [count]);

useEffect(() => {
  const id = setInterval(() => {
    setCount(countRef.current + 1); // always reads latest
  }, 1000);
  return () => clearInterval(id);
}, []);</code></pre>
<div class="tip">💡 The eslint-plugin-react-hooks exhaustive-deps rule catches most stale closure issues at lint time. When you're tempted to suppress it, think about whether a functional update or ref would solve the problem instead.</div>`
  },

  {
    id: 1050, cat: 'Performance', tags: ['adv'],
    q: 'What is the React Profiler and how do you use it to diagnose performance issues?',
    hint: 'React DevTools Profiler records renders — shows which component rendered, why, and how long it took',
    answer: `<p>The React DevTools Profiler helps identify slow renders and unnecessary re-renders.</p>
<p><strong>Using React DevTools Profiler:</strong></p>
<ol>
<li>Open DevTools → Profiler tab</li>
<li>Click Record, interact with the app, stop recording</li>
<li>See flame chart showing each render by component and duration</li>
<li>Click a bar to see <strong>why it rendered</strong>: props changed, hook changed, parent rendered</li>
</ol>
<p><strong>The Profiler API for automated performance testing:</strong></p>
<pre><code>import { Profiler } from 'react';

function onRenderCallback(
  id,           // tree id (prop)
  phase,        // "mount" | "update" | "nested-update"
  actualDuration, // time spent rendering committed update
  baseDuration,   // estimated time without memoization
  startTime,
  commitTime
) {
  if (actualDuration > 16) { // over one 60fps frame
    console.warn(\`Slow render in \${id}: \${actualDuration}ms\`);
  }
}

function App() {
  return (
    <Profiler id="NavigationBar" onRender={onRenderCallback}>
      <NavigationBar />
    </Profiler>
  );
}</code></pre>
<p><strong>What to look for:</strong></p>
<ul>
<li>Components that render when they shouldn't (add React.memo)</li>
<li>baseDuration >> actualDuration → memoization is working</li>
<li>actualDuration consistently high → expensive render, consider useMemo</li>
</ul>
<div class="tip">💡 Profile before you optimize. Adding useMemo/useCallback everywhere without profiling first adds complexity and can actually slow things down by running extra comparisons.</div>`
  },

];

export const FREE_LIMIT = 5;
// ─── React Topics Static Data ────────────────────────────────────────────────
// Full "Concept Hub" content for each topic:
//   mentalModel     — 2–3 sentence analogy (plain text, italic box)
//   deepDive        — Full HTML explanation (h3, p, pre>code, ul, blockquote)
//   misconceptions  — Array: "Many devs think X — actually Y"
//   realWorldExamples — Array: where this appears in real production code
//   cheatSheet      — Quick-reference bullets
//   interviewTips   — Numbered tips for the interview room
//
// Add one topic, verify it looks right at /[slug], then add the rest.
// ─────────────────────────────────────────────────────────────────────────────

export interface ReactTopic {
  slug: string;
  title: string;
  category: string;
  keyword: string;
  description: string;
  extraKeywords?: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Senior";
  questionCount: string;
  track: "react";
  status: "published";
  order: number;
  // Concept Hub
  mentalModel: string;
  deepDive: string;
  misconceptions: string[];
  realWorldExamples: string[];
  // Interview prep
  cheatSheet: string[];
  interviewTips: string[];
  related: string[];
  relatedBlogSlugs: string[];
}

export const REACT_TOPICS: ReactTopic[] = [

  // ─── 1. Component Lifecycle ───────────────────────────────────────────────────

//   {
//     slug: "react-component-lifecycle-interview-questions",
//     title: "React Component Lifecycle — Complete Interview Guide",
//     category: "Core",
//     keyword: "React Component Lifecycle",
//     description:
//       "Master every phase of the React component lifecycle — mounting, updating, and unmounting. Covers class component methods, their exact hooks equivalents, error boundaries, and the deprecated methods every interviewer still asks about.",
//     extraKeywords: [
//       "react lifecycle methods",
//       "componentDidMount vs useEffect",
//       "componentWillUnmount hooks",
//       "react mounting updating unmounting",
//       "getDerivedStateFromProps",
//       "shouldComponentUpdate",
//       "react error boundary",
//       "class component vs functional component lifecycle",
//     ],
//     difficulty: "Intermediate",
//     questionCount: "10–15",
//     track: "react",
//     status: "published",
//     order: 1,

//     mentalModel:
//       "Think of a React component's lifecycle like a theatre performance. Mounting is when the actor walks on stage — the component is born, setup happens, the audience sees it for the first time. Updating is the performance itself — the actor reacts to new cues (props or state changes) and adapts. Unmounting is the curtain call — the actor exits and everything brought on stage must be cleared away. Class components gave you named hooks for each moment in that performance; the functional component model unified everything into effects, but the same three-act structure runs underneath.",

//     deepDive: `
// <h3>The Three Lifecycle Phases</h3>
// <p>Every React component, whether a class or a function, goes through three phases:</p>
// <ol>
//   <li><strong>Mounting</strong> — the component is created and inserted into the DOM for the first time</li>
//   <li><strong>Updating</strong> — the component re-renders because props or state changed</li>
//   <li><strong>Unmounting</strong> — the component is removed from the DOM</li>
// </ol>
// <p>Class components expose <strong>explicit lifecycle methods</strong> for each phase. Functional components achieve the same result through <strong>hooks</strong> — primarily <code>useEffect</code>, <code>useState</code>, and <code>useRef</code>. Both models produce identical behaviour; the syntax is just different.</p>

// <h3>Mounting Phase — Class Component</h3>
// <p>Four methods fire in this order when a class component first appears in the DOM:</p>
// <pre><code>class UserProfile extends React.Component {
//   constructor(props) {
//     super(props);
//     // 1. FIRST — initialise state and bind methods
//     // Do NOT call setState() or trigger side effects here
//     this.state = { user: null, loading: true };
//   }

//   static getDerivedStateFromProps(props, state) {
//     // 2. Called before EVERY render (mount and update)
//     // Return an object to merge into state, or null to change nothing
//     // Almost always the wrong tool — see Common Mistakes
//     return null;
//   }

//   render() {
//     // 3. The only required method — must return JSX
//     // Must be PURE — no side effects, no setState calls
//     const { user, loading } = this.state;
//     if (loading) return &lt;Spinner /&gt;;
//     return &lt;div&gt;{user.name}&lt;/div&gt;;
//   }

//   componentDidMount() {
//     // 4. LAST — fires after the component is in the DOM
//     // Safe to: fetch data, add event listeners, access DOM nodes via refs
//     fetch(\`/api/users/\${this.props.userId}\`)
//       .then(res => res.json())
//       .then(user => this.setState({ user, loading: false }));
//   }
// }</code></pre>

// <h3>Updating Phase — Class Component</h3>
// <p>When props or state change, this sequence fires:</p>
// <pre><code>  shouldComponentUpdate(nextProps, nextState) {
//     // Called before re-render — return false to bail out and skip the render
//     // React.PureComponent does a shallow prop/state comparison automatically
//     // Only use this for measurable performance bottlenecks
//     return nextProps.userId !== this.props.userId;
//   }

//   // render() fires again here

//   getSnapshotBeforeUpdate(prevProps, prevState) {
//     // Called right BEFORE the DOM is mutated (after render, before commit)
//     // Whatever you return here is passed as the 3rd argument to componentDidUpdate
//     // Classic use case: capture scroll position before a list grows
//     if (prevProps.messages.length < this.props.messages.length) {
//       return this.listRef.current.scrollHeight;
//     }
//     return null;
//   }

//   componentDidUpdate(prevProps, prevState, snapshot) {
//     // Called after every re-render and DOM update
//     // ALWAYS guard setState calls with a condition — otherwise infinite loop
//     if (prevProps.userId !== this.props.userId) {
//       this.fetchUser(this.props.userId);
//     }
//     // snapshot is the value returned from getSnapshotBeforeUpdate
//     if (snapshot !== null) {
//       this.listRef.current.scrollTop =
//         this.listRef.current.scrollHeight - snapshot;
//     }
//   }</code></pre>

// <h3>Unmounting Phase — Class Component</h3>
// <pre><code>  componentWillUnmount() {
//     // Called just before the component is removed from the DOM
//     // CLEAN UP everything: subscriptions, timers, event listeners, pending fetches
//     // Do NOT call setState here — the component is being destroyed
//     clearInterval(this.timerID);
//     this.socket.close();
//     window.removeEventListener('resize', this.handleResize);
//   }</code></pre>

// <h3>The Complete Class-to-Hooks Mapping</h3>
// <p>Functional components don't have lifecycle methods — they have effects. Every class lifecycle method maps directly to a hooks pattern:</p>

// <h4>constructor → useState / useRef initialisation</h4>
// <pre><code>// Class
// constructor(props) {
//   super(props);
//   this.state = { count: 0 };
// }

// // Hooks
// const [count, setCount] = useState(0);</code></pre>

// <h4>componentDidMount → useEffect with []</h4>
// <pre><code>// Class
// componentDidMount() {
//   this.fetchUser(this.props.userId);
// }

// // Hooks — empty array = run once on mount
// useEffect(() => {
//   fetchUser(userId);
// }, []);</code></pre>

// <h4>componentDidUpdate → useEffect with deps</h4>
// <pre><code>// Class
// componentDidUpdate(prevProps) {
//   if (prevProps.userId !== this.props.userId) {
//     this.fetchUser(this.props.userId);
//   }
// }

// // Hooks — the dependency array handles the comparison automatically
// useEffect(() => {
//   fetchUser(userId);
// }, [userId]); // Re-runs whenever userId changes</code></pre>

// <h4>componentWillUnmount → useEffect cleanup function</h4>
// <pre><code>// Class
// componentWillUnmount() {
//   this.subscription.unsubscribe();
// }

// // Hooks — the returned function is the cleanup
// useEffect(() => {
//   const sub = subscribe(userId);
//   return () => sub.unsubscribe(); // this IS componentWillUnmount
// }, []);</code></pre>

// <h4>shouldComponentUpdate → React.memo</h4>
// <pre><code>// Class
// shouldComponentUpdate(nextProps) {
//   return nextProps.id !== this.props.id; // return false to skip re-render
// }

// // Hooks — React.memo wraps the component, comparator returns true to SKIP render
// // (Note: the boolean is INVERTED compared to shouldComponentUpdate)
// const UserCard = React.memo(({ id, name }) => {
//   return &lt;div&gt;{name}&lt;/div&gt;;
// }, (prevProps, nextProps) => {
//   return prevProps.id === nextProps.id; // true = props are equal, skip render
// });</code></pre>
// <blockquote>The comparator in React.memo returns <code>true</code> to <em>skip</em> re-render (props are equal). <code>shouldComponentUpdate</code> returns <code>true</code> to <em>allow</em> re-render. The logic is inverted — this trips up many candidates.</blockquote>

// <h4>getSnapshotBeforeUpdate → useLayoutEffect + ref</h4>
// <pre><code>// Hooks approximation — useLayoutEffect fires synchronously before paint
// const scrollRef = useRef(null);
// const prevLengthRef = useRef(messages.length);

// useLayoutEffect(() => {
//   if (messages.length > prevLengthRef.current) {
//     // Restore scroll position after new messages are added
//     scrollRef.current.scrollTop = scrollRef.current.scrollHeight - snapshot;
//   }
//   prevLengthRef.current = messages.length;
// });</code></pre>

// <h3>Error Lifecycle — The Only Reason to Still Write Class Components</h3>
// <p>Two lifecycle methods exist for catching errors thrown during rendering in child components. There is <strong>no hooks equivalent</strong> — you must write a class component as an Error Boundary:</p>
// <pre><code>class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     // Called during the render phase when a child throws
//     // Return state update to show the fallback UI
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, info) {
//     // Called in the commit phase after the fallback UI renders
//     // Safe to log errors to an external service
//     logToSentry(error, info.componentStack);
//   }

//   render() {
//     if (this.state.hasError) {
//       return &lt;div&gt;Something went wrong: {this.state.error.message}&lt;/div&gt;;
//     }
//     return this.props.children;
//   }
// }

// // Usage — wraps any subtree
// &lt;ErrorBoundary&gt;
//   &lt;MyComplexFeature /&gt;
// &lt;/ErrorBoundary&gt;</code></pre>
// <blockquote>Error Boundaries only catch errors in child components during rendering, lifecycle methods, and constructors. They do NOT catch errors in event handlers (use try/catch there) or async code.</blockquote>

// <h3>The Deprecated Lifecycle Methods</h3>
// <p>Three methods were deprecated in React 16.3 and prefixed with <code>UNSAFE_</code>. They still work today but are removed in future React versions. Know them for interviews — many legacy codebases still use them:</p>
// <ul>
//   <li><code>UNSAFE_componentWillMount</code> — ran before mount; replace with <code>constructor</code> or <code>useEffect(fn, [])</code></li>
//   <li><code>UNSAFE_componentWillReceiveProps</code> — ran when new props arrived; replace with <code>getDerivedStateFromProps</code> or <code>useEffect(fn, [prop])</code></li>
//   <li><code>UNSAFE_componentWillUpdate</code> — ran before re-render; replace with <code>getSnapshotBeforeUpdate</code></li>
// </ul>
// <p><strong>Why deprecated?</strong> React's concurrent rendering can start a render, pause it, and restart — running these methods multiple times before committing anything to the DOM. Any side effects inside them (data fetching, subscriptions) would fire multiple times unexpectedly, causing subtle bugs.</p>

// <h3>Functional Component Lifecycle — The Real Mental Model</h3>
// <p>Functional components don't technically have a "lifecycle" — every render is just a function call that returns JSX. The lifecycle emerges from effects and how React schedules them:</p>
// <ol>
//   <li><strong>Mount</strong>: function runs → DOM updated → browser paints → <code>useEffect(fn, [])</code> fires</li>
//   <li><strong>Update</strong>: function runs again → DOM updated → browser paints → <code>useEffect(fn, [dep])</code> fires if <code>dep</code> changed → cleanup of previous effect runs first</li>
//   <li><strong>Unmount</strong>: cleanup functions of all active effects run, in the order they were declared</li>
// </ol>
// <p>If you have multiple <code>useEffect</code> calls in one component, they run <strong>top to bottom</strong> in the order they appear in the code.</p>
//     `.trim(),

//     misconceptions: [
//       "Many developers think functional components don't have a lifecycle — they do. Mounting, updating, and unmounting all happen exactly the same way; the difference is that hooks express lifecycle as synchronisation effects rather than named callback methods.",
//       "Many developers treat componentDidMount and useEffect(fn, []) as identical — they're almost the same, with one difference: in React 18 StrictMode, useEffect fires twice on mount (mount → unmount → mount) to test cleanup. componentDidMount fires once even in StrictMode.",
//       "Many developers reach for getDerivedStateFromProps when props change and they want to update state — this is almost always wrong. If you can compute a value from props, compute it inline during render: const derivedValue = computeFrom(props). getDerivedStateFromProps was added to handle rare edge cases like a controlled animation component that resets on prop change.",
//       "Many developers call setState in componentDidUpdate without a condition — this creates an infinite loop: update → componentDidUpdate → setState → update → componentDidUpdate. Always wrap setState in a condition that compares prevProps or prevState.",
//       "Many developers think React.memo's comparator works the same as shouldComponentUpdate — the boolean is inverted. shouldComponentUpdate returns true to ALLOW a render. React.memo's comparator returns true to SKIP a render (meaning props are equal). Mixing this up is a very common interview mistake.",
//       "Many developers think Error Boundaries catch all errors — they only catch errors thrown during rendering, in lifecycle methods, and in constructors of child components. They do not catch errors in event handlers, async code (setTimeout, fetch), or server-side rendering.",
//     ],

//     realWorldExamples: [
//       "Data fetching on mount: every user profile page, dashboard, and product detail page uses componentDidMount (class) or useEffect(fn, [id]) (hooks) to fetch data when the component first appears or when a route param changes.",
//       "Subscription teardown: real-time features (WebSocket feeds, Firestore listeners, Redux store subscriptions) set up in componentDidMount and torn down in componentWillUnmount — or in useEffect's cleanup function — to prevent memory leaks and duplicate listeners.",
//       "Scroll position restoration: chat applications use getSnapshotBeforeUpdate to capture the scroll height before new messages are appended, then adjust scrollTop in componentDidUpdate so the view doesn't jump — the only lifecycle method that has a clean hooks equivalent requiring useLayoutEffect.",
//       "Error Boundaries in production apps: every serious React application wraps feature sections in an ErrorBoundary so a crash in one widget (a chart, a media player) doesn't take down the whole page. Libraries like react-error-boundary provide a ready-made wrapper.",
//       "Performance optimisation with shouldComponentUpdate: heavy list items (complex cards, table rows) in class components use shouldComponentUpdate or extend React.PureComponent to skip re-renders when props haven't changed — the hooks equivalent is wrapping with React.memo.",
//       "Third-party library teardown: map libraries (Mapbox, Leaflet), rich text editors (Quill, TipTap), and charting libraries (D3, Chart.js) initialise in componentDidMount and call their destroy/remove methods in componentWillUnmount to free GPU memory and detach DOM nodes.",
//     ],

//     cheatSheet: [
//       "Mounting order: constructor → getDerivedStateFromProps → render → componentDidMount",
//       "Updating order: getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate",
//       "Unmounting: componentWillUnmount (clean up everything — timers, listeners, subscriptions)",
//       "componentDidMount → useEffect(fn, [])  |  componentDidUpdate → useEffect(fn, [deps])  |  componentWillUnmount → return fn from useEffect",
//       "shouldComponentUpdate → React.memo — but the comparator boolean is INVERTED (true = skip render in memo, true = allow render in shouldComponentUpdate)",
//       "getDerivedStateFromProps: almost always wrong — compute derived values directly in the render body instead",
//       "getSnapshotBeforeUpdate: no clean hooks equivalent — approximate with useLayoutEffect + ref",
//       "Error Boundaries require a class component — no hooks equivalent exists (use react-error-boundary library)",
//       "Deprecated (UNSAFE_): componentWillMount, componentWillReceiveProps, componentWillUpdate — deprecated because concurrent mode can run them multiple times before committing",
//       "Multiple useEffect calls run top-to-bottom; cleanup of the previous effect runs before the next effect fires",
//     ],

//     interviewTips: [
//       "Lead with the three phases — mounting, updating, unmounting — before naming any methods. Interviewers want to see a mental model, not just method memorisation. Say: 'React components go through three phases: mounting when first added to the DOM, updating when props or state change, and unmounting when removed.'",
//       "Know the class → hooks mapping cold: componentDidMount = useEffect(fn, []), componentDidUpdate = useEffect(fn, [deps]), componentWillUnmount = return fn from useEffect. Being able to rewrite a class lifecycle in hooks (or vice versa) is a standard mid-level question.",
//       "The getDerivedStateFromProps answer: 'It's called before every render and lets you derive state from props — but in practice it's almost always the wrong tool. If you can compute a value from props, compute it directly in the render body and avoid the extra complexity.'",
//       "Error Boundaries are the one place you must still write a class component in modern React — there is no hooks equivalent. Lead with this when asked about class components: 'I use functional components for everything except Error Boundaries, which require getDerivedStateFromError and componentDidCatch.'",
//       "The React.memo comparator gotcha is a classic interview trap: it returns true to SKIP a render, opposite of shouldComponentUpdate which returns true to ALLOW a render. State this clearly if asked to compare them.",
//       "If asked about the deprecated lifecycle methods, explain WHY they were deprecated: 'React's concurrent mode can pause and restart renders, so those methods could fire multiple times before a commit. Any side effects inside them would run multiple times, causing bugs. They were renamed UNSAFE_ to signal this.'",
//     ],

//     related: [
//       "react-useeffect-interview-questions",
//       "react-rendering-reconciliation-interview-questions",
//       "react-usestate-interview-questions",
//       "react-fiber-interview-questions",
//     ],

//     relatedBlogSlugs: [],
//   },

  // ─── 2. Virtual DOM & Diffing ─────────────────────────────────────────────────

  {
    slug: "react-virtual-dom-interview-questions",
    title: "React Virtual DOM & Diffing Algorithm — Complete Interview Guide",
    category: "Core",
    keyword: "React Virtual DOM",
    description:
      "Understand exactly how React's Virtual DOM works, how the diffing algorithm finds changes in O(n), why keys are critical for list performance, and where React Fiber fits in — with every answer an interviewer could want.",
    extraKeywords: [
      "react virtual dom explained",
      "react diffing algorithm",
      "reconciliation in react",
      "virtual dom vs real dom",
      "react keys in list",
      "react fiber reconciliation",
      "react render phase commit phase",
    ],
    difficulty: "Intermediate",
    questionCount: "8–12",
    track: "react",
    status: "published",
    order: 2,

    mentalModel:
      "The Virtual DOM is React's scratchpad — a lightweight JavaScript object tree that mirrors the real DOM and lives entirely in memory. Before touching the actual browser DOM (which triggers expensive style recalculations and repaints), React first applies your changes to this in-memory copy, then runs a diffing algorithm to find the minimum set of real DOM changes needed. Think of it as planning a room rearrangement on paper before moving any furniture — figure out the optimal moves first, then execute them all at once.",

    deepDive: `
<h3>Why Direct DOM Manipulation Is Slow</h3>
<p>Every time you modify a DOM element, the browser runs some or all of this rendering pipeline:</p>
<ol>
  <li><strong>Style calculation</strong> — which CSS rules apply after this change?</li>
  <li><strong>Layout (reflow)</strong> — where does every element now sit on the page?</li>
  <li><strong>Paint</strong> — fill in the pixels for changed areas</li>
  <li><strong>Composite</strong> — merge layers and display the final frame</li>
</ol>
<p>Changing 50 elements one by one can trigger this pipeline 50 times. Batching them into a single DOM update collapses it to one pass — and that's exactly what the Virtual DOM enables.</p>

<h3>What the Virtual DOM Actually Is</h3>
<p>The Virtual DOM is a tree of plain JavaScript objects describing what the UI should look like. JSX compiles to <code>React.createElement()</code> calls that produce these objects:</p>
<pre><code>// JSX
&lt;div className="card" id="u1"&gt;
  &lt;h2&gt;Alice&lt;/h2&gt;
  &lt;p&gt;Engineer&lt;/p&gt;
&lt;/div&gt;

// The plain object React creates (simplified):
{
  type: 'div',
  props: { className: 'card', id: 'u1' },
  children: [
    { type: 'h2', props: {}, children: ['Alice'] },
    { type: 'p',  props: {}, children: ['Engineer'] }
  ]
}</code></pre>
<p>Creating this object is instantaneous — no browser APIs, no layout, no paint. React keeps two snapshots: the tree from the previous render and the new tree from the latest render. Comparing them is <strong>diffing</strong>, and the result is a minimal list of real DOM operations to apply.</p>

<h3>The Diffing Algorithm — From O(n³) to O(n)</h3>
<p>Fully comparing two arbitrary trees is an O(n³) problem — a 1,000-node tree would require a billion comparisons. React reduces this to O(n) using two pragmatic rules:</p>

<h4>Rule 1: Different element types → destroy and rebuild</h4>
<p>If the root element type changes (e.g. <code>div</code> → <code>section</code>), React tears down the entire old subtree and builds a fresh one from scratch. It never tries to reconcile children across a type boundary.</p>
<pre><code>// Before — Counter has local state (count = 5)
&lt;div&gt;&lt;Counter /&gt;&lt;/div&gt;

// After — div changed to section: React destroys the subtree
// Counter remounts from zero — all local state is lost
&lt;section&gt;&lt;Counter /&gt;&lt;/section&gt;</code></pre>
<blockquote>Accidentally changing a wrapper element type is a classic cause of "why did my component lose its state?"</blockquote>

<h4>Rule 2: Same element type → update in place</h4>
<p>When the element type stays the same, React keeps the underlying DOM node and only updates the changed attributes:</p>
<pre><code>// Before
&lt;input type="text" className="idle" placeholder="Search..." /&gt;

// After — only className changed; React updates one attribute, reuses the DOM node
&lt;input type="text" className="active" placeholder="Search..." /&gt;</code></pre>
<p>For component elements (not DOM elements), React keeps the component instance alive and calls the function with new props. Local state and refs survive because the instance is reused — only the output changes.</p>

<h3>Keys: Stable Identity for List Items</h3>
<p>Lists break the position-based heuristic. Without keys, React assumes the item at index 0 is the same item on every render. Insert one item at the top of a 100-item list and React thinks all 100 moved — it re-renders every one. With keys, React tracks each item by identity regardless of position:</p>
<pre><code>// Without keys — React matches by index: one insert = re-render all 100
{items.map(item =&gt; &lt;Row data={item} /&gt;)}

// With stable keys — React matches by identity: one insert = render only that item
{items.map(item =&gt; &lt;Row key={item.id} data={item} /&gt;)}</code></pre>

<h4>Why Index as Key Causes Bugs</h4>
<p>If you filter or sort the list, the index no longer uniquely identifies the same item across renders. React sees that index 0 now points to a different item but reuses the DOM node (and its state) from the previous index 0. The result: component state appears in the wrong item, input values show up in the wrong row, animations fire on the wrong element.</p>
<pre><code>// Only safe for lists that are static, append-only, and never filtered
{staticTabs.map((tab, i) =&gt; &lt;Tab key={i} label={tab.label} /&gt;)} // OK

// Dangerous — sorting or filtering this will corrupt state
{sortedUsers.map((u, i) =&gt; &lt;UserRow key={i} user={u} /&gt;)} // Bug waiting to happen</code></pre>

<h3>Render Phase vs Commit Phase</h3>
<p>React splits its work into two distinct phases:</p>
<ul>
  <li><strong>Render phase</strong> — runs component functions, builds the new Virtual DOM, diffs against the previous snapshot, produces a list of changes. This is <em>pure computation</em> — no DOM writes, no side effects. In concurrent mode, React can pause and resume this phase.</li>
  <li><strong>Commit phase</strong> — applies the diff list to the real DOM. Always synchronous and uninterruptible. React will never pause halfway through writing to the DOM.</li>
</ul>
<p>This separation explains why <code>useLayoutEffect</code> fires synchronously after the commit (DOM updated, browser hasn't painted yet) and <code>useEffect</code> fires after the browser paint.</p>

<h3>Where React Fiber Fits In</h3>
<p>React Fiber (React 16) rewrote the reconciler — the scheduler that decides when to diff and commit. It did <em>not</em> replace the Virtual DOM object tree. What Fiber added:</p>
<ul>
  <li>The render phase became <strong>interruptible</strong> — React can pause diffing to handle urgent work (a user click)</li>
  <li><strong>Priority levels</strong> — urgent updates (typing, clicking) jump ahead of background work (data loading)</li>
  <li>The foundation for React 18's concurrent features: <code>startTransition</code>, <code>useDeferredValue</code>, streaming SSR</li>
</ul>
<blockquote>Fiber = the scheduler that processes the Virtual DOM. The Virtual DOM (the JS object tree) still exists; Fiber decides when and how to compare trees and apply changes.</blockquote>
    `.trim(),

    misconceptions: [
      "Many developers say 'Virtual DOM makes React fast' as a blanket statement — for a single isolated DOM update, directly writing to the DOM is actually faster because Virtual DOM adds diffing overhead. React's advantage comes from complex UIs with frequent updates where batching many changes into one DOM pass saves more than the diffing costs.",
      "Many developers think React re-renders the entire real DOM on every state change — React re-runs component functions and diffs the virtual trees (both cheap operations), then writes only the specific DOM nodes that actually changed. The real DOM change is always minimal.",
      "Many developers think Virtual DOM is React's invention — Vue, Preact, Inferno, and Snabbdom all use Virtual DOM diffing. React popularised it, but it's not a React-exclusive concept.",
      "Many developers think keys need to be globally unique across the entire app — keys only need to be unique among siblings within the same list. The same key value can exist in completely different lists without conflict.",
      "Many developers use array index as key assuming 'my list doesn't reorder' — filtering removes items and shifts indexes, which maps the same index to a different item. React then preserves the wrong component state. Only use index for truly static, append-only, never-filtered lists.",
      "Many developers think React Fiber replaced the Virtual DOM — Fiber is the reconciler (the scheduler), not the data structure. The Virtual DOM JavaScript object tree still exists exactly as before; Fiber is the engine that decides when to compare and commit those trees.",
    ],

    realWorldExamples: [
      "Long product lists and comment feeds: stable database IDs as keys ensure React inserts or removes one item without re-rendering the entire list — critical for performance in e-commerce grids and infinite scroll feeds.",
      "Optimistic UI updates: when a user likes a post, React immediately re-renders with the new like count via a Virtual DOM patch. If the server request fails, React reverts with another patch — all as minimal DOM updates, never a full re-render.",
      "Animation libraries: Framer Motion and React Transition Group hook into React's render cycle to animate only the specific DOM nodes that changed, made possible by React's diffing telling them exactly which nodes are entering, updating, or leaving.",
      "Chat applications with new messages: proper message ID keys ensure only the new message renders when it arrives — existing messages remain untouched, preserving scroll position and any in-progress reply state.",
      "React DevTools Profiler: the profiler can highlight exactly which components re-rendered and why across a recording — only possible because React tracks Virtual DOM snapshots and the diffs between consecutive renders.",
      "SSR hydration: React renders a Virtual DOM on the server and sends HTML to the client, then reconciles it with the client-side Virtual DOM to attach event listeners — without re-rendering or flickering any visible content.",
    ],

    cheatSheet: [
      "Virtual DOM = plain JavaScript object tree describing the UI — zero browser APIs, zero layout cost to create",
      "React keeps two VDOM snapshots: previous render + new render. Diffing finds the delta between them",
      "Diffing rule 1: different element type → tear down old subtree, build new one (state resets)",
      "Diffing rule 2: same element type → update attributes in place, reuse DOM node (state survives)",
      "Keys in lists: stable unique ID = identity-based matching; no key / index = position-based matching",
      "Index-as-key is only safe for static, append-only, never-filtered lists",
      "Render phase: runs functions + diffing — interruptible in concurrent mode, no DOM writes",
      "Commit phase: writes diff to real DOM — synchronous, never interrupted",
      "Fiber = the reconciler/scheduler; made render phase interruptible; did not replace the VDOM data structure",
    ],

    interviewTips: [
      "When asked 'what is the Virtual DOM?', answer in two layers: (1) what it IS — a plain JavaScript object tree representing the UI; (2) what it DOES — enables batched, minimal DOM updates by comparing old and new trees before touching the real DOM. Saying just 'it's faster' or 'it's a copy of the DOM' is too shallow.",
      "The O(n) explanation is a strong signal of depth. Name the two rules explicitly: different element types trigger a full subtree rebuild; keys give list items stable identity across renders. You don't need to know every detail of the algorithm, just the reasoning behind it.",
      "The keys answer has three parts: (1) what keys DO — give items stable identity independent of position; (2) why index-as-key is dangerous — filter/sort maps the same index to a different item, corrupting state; (3) what a good key IS — a stable, unique identifier like a database ID.",
      "Know the render phase vs commit phase split — it shows you understand concurrent mode. 'The render phase is interruptible — React can pause diffing to handle urgent work. The commit phase is synchronous — React never stops mid-write to the DOM.'",
      "When asked about Fiber: 'Fiber is the reconciler that made the render phase interruptible, enabling concurrent features. The Virtual DOM (the JS object tree) still exists; Fiber is the scheduler that processes it and decides when to commit changes.'",
      "'Is Virtual DOM always faster?' has a nuanced answer that impresses interviewers: 'Not always — for simple isolated updates, direct DOM manipulation is faster because Virtual DOM adds diffing overhead. React wins in complex UIs with many frequent updates where batching multiple state changes into one DOM pass saves more time than the diffing costs.'",
    ],

    related: [
      "react-rendering-reconciliation-interview-questions",
      "react-fiber-interview-questions",
      "react-rendering-performance-interview-questions",
      "react-component-lifecycle-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 3. Controlled vs Uncontrolled Components ────────────────────────────────

  {
    slug: "react-controlled-uncontrolled-components-interview-questions",
    title: "React Controlled vs Uncontrolled Components — Complete Interview Guide",
    category: "Forms",
    keyword: "Controlled vs Uncontrolled Components",
    description:
      "Master the difference between controlled and uncontrolled form components — when React owns the value vs when the DOM does, how to avoid the most common switching bug, and why top form libraries make opposite choices.",
    extraKeywords: [
      "controlled component react",
      "uncontrolled component react",
      "react form value onChange",
      "react useRef form",
      "react hook form vs formik",
      "react defaultValue vs value",
      "react file input uncontrolled",
    ],
    difficulty: "Beginner",
    questionCount: "6–10",
    track: "react",
    status: "published",
    order: 3,

    mentalModel:
      "A controlled component is like a puppet — React holds every string. Every keystroke flows through an onChange handler into React state, and the input always shows exactly what React says it should. An uncontrolled component is like a free actor — it holds its own state inside the DOM, and you only ask what it's doing when you actually need to know, using a ref. The core question is: who is the single source of truth for the input's value — React state (controlled) or the DOM itself (uncontrolled)?",

    deepDive: `
<h3>Controlled Components — React Owns the Value</h3>
<p>A controlled input has two required pieces: a <code>value</code> prop tied to React state, and an <code>onChange</code> handler that updates that state. Every keystroke the user makes flows through the handler, updates state, triggers a re-render, and the input displays the new state value. The DOM never independently holds the current value — React state is always the source of truth.</p>
<pre><code>function ControlledSearch() {
  const [query, setQuery] = useState('');

  return (
    &lt;input
      type="text"
      value={query}                         // React state drives the displayed value
      onChange={e =&gt; setQuery(e.target.value)} // every keystroke updates state
    /&gt;
  );
}</code></pre>
<p>Because React state is always current, you can read <code>query</code> at any moment without touching the DOM. This makes instant validation, character counters, conditional UI, and programmatic resets straightforward.</p>

<h3>Uncontrolled Components — The DOM Owns the Value</h3>
<p>An uncontrolled input manages its own value inside the DOM — React doesn't know the current value unless it explicitly reads it via a ref. You set the starting value with <code>defaultValue</code> (not <code>value</code>), and the DOM takes over from there.</p>
<pre><code>function UncontrolledForm() {
  const nameRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(nameRef.current.value); // read on demand
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input
        type="text"
        ref={nameRef}
        defaultValue="Alice"  // sets initial DOM value; DOM controls it after that
      /&gt;
      &lt;button type="submit"&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Uncontrolled inputs don't re-render on every keystroke because React is completely unaware of the changes. This makes them significantly faster for large forms with many fields.</p>

<h3>The Critical Rule: Never Switch Between the Two</h3>
<p>React tracks whether an input is controlled (has a <code>value</code> prop) or uncontrolled (no <code>value</code> prop) from the first render. Switching between them — by passing <code>undefined</code> as the value — causes a React warning and unpredictable behaviour:</p>
<pre><code>// ❌ Bug: undefined on first render (uncontrolled), string later (controlled)
&lt;input value={user?.name} /&gt;

// ✅ Fix: always provide a string — controlled from the first render onwards
&lt;input value={user?.name ?? ''} /&gt;</code></pre>
<blockquote>If value can ever be undefined or null, always provide a fallback empty string. This is the most common controlled-component bug in real codebases.</blockquote>

<h3>textarea and select — Same Pattern, Different Look</h3>
<p>React normalises <code>&lt;textarea&gt;</code> and <code>&lt;select&gt;</code> to follow the same controlled/uncontrolled API as <code>&lt;input&gt;</code>:</p>
<pre><code>// Controlled textarea
&lt;textarea value={bio} onChange={e =&gt; setBio(e.target.value)} /&gt;

// Controlled select — value on the &lt;select&gt;, not on &lt;option&gt;
&lt;select value={country} onChange={e =&gt; setCountry(e.target.value)}&gt;
  &lt;option value="in"&gt;India&lt;/option&gt;
  &lt;option value="us"&gt;USA&lt;/option&gt;
&lt;/select&gt;</code></pre>

<h3>File Inputs — Always Uncontrolled</h3>
<p>File inputs are always uncontrolled — this is a browser security restriction, not a React limitation. The browser will never allow JavaScript to programmatically set a file input's value. Read the selected file through a ref or the event object:</p>
<pre><code>// ❌ React will warn — file inputs cannot have a value prop
&lt;input type="file" value={file} /&gt;

// ✅ Always read via ref or event
const fileRef = useRef(null);

function handleUpload() {
  const file = fileRef.current.files[0];
  upload(file);
}

&lt;input type="file" ref={fileRef} /&gt;</code></pre>

<h3>When to Use Each</h3>
<p>Use <strong>controlled</strong> when you need:</p>
<ul>
  <li>Instant validation or feedback as the user types</li>
  <li>Conditional UI that depends on the current input value (character counter, submit button state)</li>
  <li>Programmatically setting, clearing, or resetting the value</li>
  <li>Syncing the input value with another part of the UI</li>
</ul>
<p>Use <strong>uncontrolled</strong> when:</p>
<ul>
  <li>You have a large form (50+ fields) and keystroke re-renders are a measurable bottleneck</li>
  <li>You only need the values at submit time, not during typing</li>
  <li>Integrating with non-React code or third-party libraries that manage their own input state</li>
</ul>

<h3>How Form Libraries Choose</h3>
<p><strong>React Hook Form</strong> is built on uncontrolled inputs — fields register via refs, values are read on submit, and only fields with errors re-render. This makes it extremely fast for large forms. <strong>Formik</strong> uses controlled inputs — every field value lives in Formik's state, enabling per-field validation and easy cross-field logic at the cost of per-keystroke re-renders.</p>
    `.trim(),

    misconceptions: [
      "Many developers think uncontrolled inputs are the inferior, 'wrong' way — they're a deliberate trade-off. React Hook Form, one of the most widely used React libraries, is built entirely on uncontrolled inputs because they avoid per-keystroke re-renders across the entire form.",
      "Many developers use value={someUndefinedValue} thinking this makes the input uncontrolled — React treats an initial value of undefined as 'no value prop' (uncontrolled), but if value later becomes a string the input switches to controlled mid-lifecycle. Always use value={someValue ?? ''} to stay consistently controlled.",
      "Many developers try to set a file input's value prop — file inputs are always uncontrolled by browser security design. The browser prevents scripts from setting file input values so a webpage can't silently pre-select files. Read files via ref or event.target.files, always.",
      "Many developers think defaultValue and value are just different names for the same thing — defaultValue sets the DOM value once on mount and hands control to the DOM (uncontrolled). value sets the DOM value from React state on every render (controlled). Confusing them is why inputs appear to 'forget' what the user typed.",
      "Many developers think controlled inputs always cause performance problems — the performance difference is negligible for forms with fewer than ~20 fields. Only optimise with uncontrolled inputs when you've actually measured a keystroke-render bottleneck, not as a premature optimisation.",
      "Many developers add onChange to an input without a value prop thinking that makes it controlled — an input without a value prop is uncontrolled regardless of how many event handlers it has. The value prop is what makes it controlled, nothing else.",
    ],

    realWorldExamples: [
      "Search-as-you-type: a search bar that filters results on every keystroke needs a controlled input — React reads query from state on every keystroke to call the filter function or debounced API.",
      "Character counter: 'You have X characters remaining' requires a controlled input to know the current length on every keystroke without querying the DOM.",
      "Multi-step form wizard: each step passes values to the next via React state — controlled inputs make this natural since values already live in state and can be freely read, validated, and reset.",
      "React Hook Form at scale: a checkout form with 30+ fields (shipping, billing, card details) uses uncontrolled inputs via register() so zero re-renders occur on keystroke — only the field with a validation error re-renders.",
      "File upload UI: drag-and-drop upload components use an uncontrolled file input (required by the browser) alongside a separate useState for the selected file preview — the input is uncontrolled, the preview state is React-controlled.",
      "Autofill edge cases: browser autofill and password managers set input values by directly writing to the DOM, bypassing React's onChange. Controlled inputs handle this via a synthetic 'input' event that React re-raises; some form libraries add specific autofill workarounds.",
    ],

    cheatSheet: [
      "Controlled: value={state} + onChange={setState} — React state is source of truth, re-renders on keystroke",
      "Uncontrolled: defaultValue={initial} + ref={ref} — DOM is source of truth, read via ref.current.value",
      "Never switch between controlled and uncontrolled — always provide value={someState ?? ''} to avoid undefined",
      "textarea: same API — value + onChange for controlled, defaultValue + ref for uncontrolled",
      "select: value prop goes on &lt;select&gt;, not on &lt;option&gt;",
      "File input: always uncontrolled — browser security prevents setting value programmatically",
      "Controlled use cases: instant validation, character count, programmatic reset, conditional UI",
      "Uncontrolled use cases: large forms, submit-only reads, non-React integration",
      "React Hook Form = uncontrolled (performant); Formik = controlled (simple validation)",
      "Resetting controlled form: setState(initialValues); Resetting uncontrolled: form.reset() or change the component's key",
    ],

    interviewTips: [
      "Lead with the source-of-truth framing: 'In a controlled component, React state is the single source of truth — every change goes through state. In an uncontrolled component, the DOM holds the value and you read it via a ref when needed.' This is the conceptual answer; implementation details can follow.",
      "Mention the undefined-switching bug proactively — it signals real-world experience: 'A very common bug is value={user?.name} where user is null on first render. The input starts uncontrolled (undefined = no value prop) then becomes controlled when user loads. React warns and behaves unpredictably. Always fall back to an empty string.'",
      "File inputs are always uncontrolled — stating this unprompted shows you know browser constraints, not just React: 'File inputs are a special case — the browser won't allow programmatic value setting for security reasons, so they're always uncontrolled regardless of what you do in React.'",
      "Connect form libraries to the concept: 'React Hook Form is fast because it uses uncontrolled inputs — zero re-renders on keystroke, values read only at submit. Formik uses controlled inputs — more re-renders, but easier cross-field validation. Understanding controlled vs uncontrolled is why you can reason about why one is faster.'",
      "If asked how to reset a form: 'For controlled forms, reset state to initial values with setState. For uncontrolled forms, call form.reset() on the DOM form element. Another option for both is to change the form component's key — forcing React to remount it from scratch.'",
      "Don't over-engineer: 'For most forms under 20 fields, I use controlled inputs — the re-render cost is negligible and the simplicity of having values in state is worth it. I only reach for uncontrolled or React Hook Form when I've actually measured a performance problem.'",
    ],

    related: [
      "react-usestate-interview-questions",
      "react-useref-interview-questions",
      "react-rendering-performance-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 4. Error Boundaries ──────────────────────────────────────────────────────

  {
    slug: "react-error-boundaries-interview-questions",
    title: "React Error Boundaries — Complete Interview Guide",
    category: "Core",
    keyword: "React Error Boundaries",
    description:
      "Master React Error Boundaries — how they catch render errors, the difference between getDerivedStateFromError and componentDidCatch, what they do and don't catch, and how to build resilient UIs that survive component crashes.",
    extraKeywords: [
      "react error boundary",
      "getDerivedStateFromError",
      "componentDidCatch",
      "react error handling",
      "react fallback UI",
      "react-error-boundary library",
      "react catch render error",
    ],
    difficulty: "Intermediate",
    questionCount: "6–10",
    track: "react",
    status: "published",
    order: 4,

    mentalModel:
      "An Error Boundary is React's circuit breaker. Without one, a JavaScript error thrown during rendering propagates up through every parent component and unmounts the entire application — the screen goes blank. An Error Boundary wraps a subtree and intercepts errors before they escape, showing a fallback UI while keeping the rest of the app alive. Think of it as blast containment: one widget crashes, the page survives.",

    deepDive: `
<h3>The Problem Without Error Boundaries</h3>
<p>React's default behaviour when a component throws during rendering: the error propagates up the tree, React unwinds every parent component, and the entire application unmounts. Your users see a blank white screen with nothing in the console except a stack trace.</p>
<p>This is intentional — React would rather show nothing than a broken, half-rendered UI. But "nothing" is a terrible user experience. Error Boundaries let you replace "nothing" with a graceful fallback for just the broken section, while the rest of the app keeps running.</p>

<h3>The Two Lifecycle Methods</h3>
<p>Error Boundaries use two lifecycle methods that have <strong>no hooks equivalent</strong> — this is the one case in modern React where you must write a class component:</p>

<h4>static getDerivedStateFromError(error)</h4>
<p>Called during the <strong>render phase</strong> when a child throws. Its job is purely to update state so the next render shows the fallback UI. It must be a pure function — no side effects.</p>
<pre><code>static getDerivedStateFromError(error) {
  // Return a state update — this triggers a re-render with the fallback
  return { hasError: true, error };
}</code></pre>

<h4>componentDidCatch(error, info)</h4>
<p>Called during the <strong>commit phase</strong> after the fallback UI has rendered. This is where you log the error to an external service. Unlike <code>getDerivedStateFromError</code>, side effects are safe here.</p>
<pre><code>componentDidCatch(error, info) {
  // info.componentStack shows the component tree that led to the error
  logErrorToSentry(error, { componentStack: info.componentStack });
}</code></pre>

<h3>A Complete Error Boundary</h3>
<pre><code>class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logToErrorService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? &lt;div&gt;Something went wrong.&lt;/div&gt;;
    }
    return this.props.children;
  }
}</code></pre>

<h3>What Error Boundaries Catch</h3>
<p>Error Boundaries catch errors that happen in:</p>
<ul>
  <li>The <strong>render method</strong> of a child component</li>
  <li><strong>Lifecycle methods</strong> (componentDidMount, componentDidUpdate, etc.)</li>
  <li><strong>Constructors</strong> of child class components</li>
</ul>

<h3>What Error Boundaries Do NOT Catch</h3>
<p>Error Boundaries cannot catch errors from:</p>
<ul>
  <li><strong>Event handlers</strong> — use try/catch inside your handler instead</li>
  <li><strong>Async code</strong> — setTimeout, fetch, Promises that reject after the render phase</li>
  <li><strong>Server-side rendering</strong></li>
  <li><strong>Errors inside the Error Boundary itself</strong> — only errors in its children</li>
</ul>
<pre><code>// ❌ Error Boundary WON'T catch this
function Button() {
  function handleClick() {
    throw new Error("oops"); // event handler — use try/catch here
  }
  return &lt;button onClick={handleClick}&gt;Click&lt;/button&gt;;
}

// ✅ Handle event handler errors with try/catch
function Button() {
  function handleClick() {
    try {
      riskyOperation();
    } catch (err) {
      setError(err.message);
    }
  }
  return &lt;button onClick={handleClick}&gt;Click&lt;/button&gt;;
}</code></pre>

<h3>Granularity — Where to Place Error Boundaries</h3>
<p>Place Error Boundaries at the <em>right</em> level of granularity. Too high (one at the app root) and a broken widget takes down everything visible. Too low (one on every component) and you add unnecessary overhead.</p>
<pre><code>// Route-level: each page is isolated — one page crashing doesn't affect others
&lt;ErrorBoundary fallback={&lt;ErrorPage /&gt;}&gt;
  &lt;Routes /&gt;
&lt;/ErrorBoundary&gt;

// Widget-level: a broken chart doesn't break the whole dashboard
&lt;ErrorBoundary fallback={&lt;p&gt;Chart unavailable&lt;/p&gt;}&gt;
  &lt;RevenueChart /&gt;
&lt;/ErrorBoundary&gt;</code></pre>

<h3>Error Recovery — Resetting the Boundary</h3>
<p>After an error, you can offer the user a way to retry by resetting the error state. The standard pattern is a "Try again" button that clears <code>hasError</code>:</p>
<pre><code>render() {
  if (this.state.hasError) {
    return (
      &lt;div&gt;
        &lt;p&gt;Something went wrong.&lt;/p&gt;
        &lt;button onClick={() =&gt; this.setState({ hasError: false, error: null })}&gt;
          Try again
        &lt;/button&gt;
      &lt;/div&gt;
    );
  }
  return this.props.children;
}</code></pre>

<h3>The react-error-boundary Library</h3>
<p>Writing Error Boundary classes is boilerplate. The <code>react-error-boundary</code> library provides a ready-made <code>&lt;ErrorBoundary&gt;</code> component and a <code>useErrorBoundary()</code> hook that lets you programmatically trigger the boundary from inside a functional component (e.g. after a failed async operation):</p>
<pre><code>import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

// Wrap any subtree
&lt;ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) =&gt; (
    &lt;div&gt;
      &lt;p&gt;{error.message}&lt;/p&gt;
      &lt;button onClick={resetErrorBoundary}&gt;Try again&lt;/button&gt;
    &lt;/div&gt;
  )}
  onError={(error, info) =&gt; logToSentry(error, info)}
  onReset={() =&gt; refetch()} // called when resetErrorBoundary fires
&gt;
  &lt;MyFeature /&gt;
&lt;/ErrorBoundary&gt;</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think Error Boundaries catch all React errors — they only catch errors thrown during rendering, lifecycle methods, and constructors of child components. Errors in event handlers, async callbacks, and setTimeout are invisible to Error Boundaries and need try/catch.",
      "Many developers think you can implement Error Boundaries with hooks — there is no hooks equivalent for getDerivedStateFromError and componentDidCatch. Error Boundaries must be class components. This is the last remaining use case that requires a class component in modern React.",
      "Many developers place one Error Boundary at the app root and consider it done — a root-level boundary only prevents the blank screen; it doesn't provide meaningful isolation. Widget-level boundaries ensure a broken chart doesn't kill a dashboard, a broken sidebar doesn't kill a page.",
      "Many developers think getDerivedStateFromError and componentDidCatch do the same thing — getDerivedStateFromError runs during the render phase and must be pure (its only job is to update state). componentDidCatch runs after the commit phase and is the right place for side effects like logging.",
      "Many developers try to log errors in getDerivedStateFromError — logging is a side effect and getDerivedStateFromError runs in the render phase where side effects are unsafe (React may call it multiple times in concurrent mode). Always log in componentDidCatch.",
      "Many developers think Error Boundaries make async errors safe — a fetch() that rejects after the render phase is not caught by an Error Boundary. For async error handling inside functional components, use the useErrorBoundary() hook from react-error-boundary to programmatically throw errors into the boundary.",
    ],

    realWorldExamples: [
      "Route-level boundaries in SPAs: wrapping each route with an Error Boundary means a crash in the /settings page doesn't break the /dashboard page — users can navigate away and keep working.",
      "Widget isolation in dashboards: analytics dashboards wrap each chart or data card in an Error Boundary so a broken third-party chart library doesn't crash the entire reporting page.",
      "Error logging with Sentry/Datadog: componentDidCatch is the standard integration point for error monitoring services — it receives the full error object and component stack trace for remote logging without the user seeing a broken UI.",
      "React Query integration: when a query throws during rendering, wrapping the component in an Error Boundary with throwOnError: true provides clean fallback UI without manually checking error state in every component.",
      "React Suspense pairing: Error Boundaries and Suspense are always used together when using React.lazy — Suspense handles the loading state, ErrorBoundary handles the failed load (network error, chunk failed to parse).",
      "Retry buttons in production UIs: the reset pattern (clearing hasError on button click, plus calling the onReset callback) lets users recover from transient errors like network blips without a full page reload.",
    ],

    cheatSheet: [
      "Error Boundaries catch: render errors, lifecycle errors, constructor errors in child components",
      "Error Boundaries do NOT catch: event handler errors, async errors (setTimeout, fetch), errors in the boundary itself",
      "Must be a class component — no hooks equivalent exists for getDerivedStateFromError / componentDidCatch",
      "getDerivedStateFromError: render phase, return state update to show fallback, NO side effects",
      "componentDidCatch: commit phase, safe for side effects like logging to Sentry/Datadog",
      "Event handler errors: use try/catch inside the handler, set error state manually",
      "Granularity: route-level for page isolation, widget-level for dashboard/feature isolation",
      "Recovery: reset hasError state on button click; use onReset callback to refetch/retry",
      "react-error-boundary library: provides ready-made component + useErrorBoundary() hook for programmatic errors",
    ],

    interviewTips: [
      "Lead with the problem they solve: 'Without an Error Boundary, any render error propagates to the root and unmounts the entire app — the user sees a blank screen. Error Boundaries intercept the error and show a fallback UI so the rest of the app keeps running.'",
      "The 'why must it be a class component?' question is common — answer directly: 'getDerivedStateFromError and componentDidCatch have no hooks equivalent. React hasn't provided a hooks API for them yet. Error Boundaries are the last remaining use case that requires a class component in modern React.'",
      "Always name what Error Boundaries do NOT catch — it shows you've used them in production: 'Error Boundaries only catch render-phase errors. Event handler errors need try/catch inside the handler, and async errors from fetch or setTimeout need a try/catch that then calls a function to trigger the boundary — or use react-error-boundary's useErrorBoundary hook.'",
      "Explain the two methods separately with different purposes: 'getDerivedStateFromError runs during the render phase — its only job is to return a state update that triggers the fallback render. componentDidCatch runs after commit — that's where you log because it's safe for side effects. They're two separate concerns: update UI vs notify monitoring service.'",
      "Mention granularity — it shows senior-level thinking: 'I place Error Boundaries at route level so page crashes are isolated, and at widget level for complex features like charts or third-party embeds that are more likely to throw. One root-level boundary is a safety net, not a strategy.'",
      "The react-error-boundary library is worth mentioning: 'Writing a class ErrorBoundary is boilerplate — in production I use the react-error-boundary library. It provides a declarative component with a fallbackRender prop and an onReset callback, plus a useErrorBoundary hook that lets functional components throw errors into the nearest boundary programmatically.'",
    ],

    related: [
      "react-component-lifecycle-interview-questions",
      "react-concurrent-rendering-react-18-interview-questions",
      "react-code-splitting-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 5. Context API ───────────────────────────────────────────────────────────

  {
    slug: "react-context-api-interview-questions",
    title: "React Context API — Complete Interview Guide",
    category: "State",
    keyword: "React Context API",
    description:
      "Master the React Context API — how to avoid prop drilling, when context re-renders every consumer, the performance optimization pattern, and the honest answer to 'Context vs Redux' that interviewers want to hear.",
    extraKeywords: [
      "react context api",
      "createContext react",
      "useContext hook",
      "prop drilling solution react",
      "react context vs redux",
      "react context performance",
      "react provider consumer",
    ],
    difficulty: "Intermediate",
    questionCount: "8–12",
    track: "react",
    status: "published",
    order: 5,

    mentalModel:
      "React Context is a broadcast channel inside your component tree. Any component that subscribes to a context receives its current value directly — without props being manually threaded down through every intermediate layer. The Provider is the transmitter; useContext is the receiver. Change the broadcasted value and every subscriber re-renders automatically. Context is designed for 'ambient' data — the current user, theme, locale, or feature flags that many components need but shouldn't have to receive as props.",

    deepDive: `
<h3>The Problem: Prop Drilling</h3>
<p>Prop drilling happens when a piece of data needs to reach a deeply nested component, so you pass it as a prop through every layer in between — even layers that don't use it at all:</p>
<pre><code>// App passes 'user' down through Layout → Sidebar → UserMenu
// Layout and Sidebar don't need user — they just relay it
function App() {
  const user = useAuth();
  return &lt;Layout user={user} /&gt;;
}
function Layout({ user }) {
  return &lt;Sidebar user={user} /&gt;;
}
function Sidebar({ user }) {
  return &lt;UserMenu user={user} /&gt;;
}
function UserMenu({ user }) {
  return &lt;span&gt;{user.name}&lt;/span&gt;; // finally used here
}</code></pre>
<p>This is fragile — every intermediate component must be aware of data it doesn't care about. Context eliminates the middlemen.</p>

<h3>Creating and Providing Context</h3>
<pre><code>// 1. Create the context — the argument is the default value
// (used only when a component has no Provider above it)
const UserContext = React.createContext(null);

// 2. Provide the value — any descendant can now read it
function App() {
  const user = useAuth();
  return (
    &lt;UserContext.Provider value={user}&gt;
      &lt;Layout /&gt;    {/* no prop drilling — Layout doesn't receive user */}
    &lt;/UserContext.Provider&gt;
  );
}</code></pre>

<h3>Consuming Context with useContext</h3>
<pre><code>// 3. Any descendant reads it directly
function UserMenu() {
  const user = useContext(UserContext); // zero props passed down
  return &lt;span&gt;{user.name}&lt;/span&gt;;
}</code></pre>
<p>The component subscribes to the context. Whenever the Provider's <code>value</code> changes, <code>UserMenu</code> re-renders automatically.</p>

<h3>The Re-render Behaviour — The Most Important Thing to Understand</h3>
<p>This is the most common source of performance bugs with Context. <strong>Every component that calls <code>useContext(MyContext)</code> re-renders whenever the context value changes</strong> — even if the specific data it uses didn't change.</p>
<pre><code>// ❌ Performance trap: a new object is created on every App render
// Every consumer re-renders even if user and theme haven't changed
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  return (
    &lt;AppContext.Provider value={{ user, theme, setUser, setTheme }}&gt;
      &lt;Everything /&gt;
    &lt;/AppContext.Provider&gt;
  );
}</code></pre>
<p>The <code>value</code> prop creates a new object every render, so every consumer thinks the context changed — even if <code>user</code> and <code>theme</code> are identical. React uses <code>Object.is</code> to compare context values.</p>

<h4>Fix: Memoize the context value</h4>
<pre><code>// ✅ Stable object reference — consumers only re-render when user or theme changes
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ user, theme, setUser, setTheme }), [user, theme]);
  return (
    &lt;AppContext.Provider value={value}&gt;
      &lt;Everything /&gt;
    &lt;/AppContext.Provider&gt;
  );
}</code></pre>

<h4>Better fix: Split contexts by update frequency</h4>
<pre><code>// Split frequently-changing from rarely-changing values
// Components that only need theme don't re-render when user changes
&lt;UserContext.Provider value={user}&gt;
  &lt;ThemeContext.Provider value={theme}&gt;
    &lt;Everything /&gt;
  &lt;/ThemeContext.Provider&gt;
&lt;/UserContext.Provider&gt;</code></pre>

<h3>Context vs Redux / Zustand — When to Use Each</h3>
<p>Context is often misused as a replacement for a state management library. They serve different purposes:</p>
<ul>
  <li><strong>Context</strong> — great for <em>stable, rarely-changing</em> ambient data that many components read: current user, theme, locale, feature flags. Every consumer re-renders on any change, so frequent updates hurt performance.</li>
  <li><strong>Redux / Zustand</strong> — great for <em>frequently-changing, complex</em> global state. External stores allow components to subscribe to specific slices — a component watching <code>cart.total</code> doesn't re-render when <code>user.preferences</code> changes. They also come with devtools, time-travel debugging, and middleware.</li>
</ul>
<blockquote>Context is not a state management library — it's a dependency injection mechanism. The question is not "Context or Redux?" but "how often does this value change and how many components subscribe to it?"</blockquote>

<h3>The Default Value Trap</h3>
<p>The default value passed to <code>createContext(defaultValue)</code> is used only when a component calls <code>useContext</code> with <em>no matching Provider above it</em> in the tree. It is not the initial value of the Provider. This trips up many developers:</p>
<pre><code>const ThemeContext = React.createContext('light'); // default = 'light'

// This component uses 'light' because there's no Provider above it
function Orphan() {
  const theme = useContext(ThemeContext); // 'light'
  return &lt;div&gt;{theme}&lt;/div&gt;;
}

// But this gets 'dark' from the Provider — the createContext default is ignored
function App() {
  return (
    &lt;ThemeContext.Provider value="dark"&gt;
      &lt;Orphan /&gt; {/* gets 'dark', not 'light' */}
    &lt;/ThemeContext.Provider&gt;
  );
}</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers treat Context as a drop-in replacement for Redux — Context is a dependency injection mechanism, not a state management library. It has no selector system, so every subscriber re-renders on any value change. For frequently-changing global state, an external store like Zustand or Redux is the right tool.",
      "Many developers pass a new object literal directly to the value prop — this creates a new object reference on every render, triggering re-renders in all consumers even when the underlying data hasn't changed. Always memoize the value object with useMemo.",
      "Many developers think the createContext default value is like an initial state — the default value is only used when useContext is called without a matching Provider anywhere above it in the tree. It's a fallback for orphaned consumers, not the starting value of the Provider.",
      "Many developers wrap the entire app in a single all-purpose context with everything in it — this maximises re-renders because every change (user, theme, language, permissions) causes every consumer to re-render. Split contexts by update frequency so consumers only re-render for the values they actually care about.",
      "Many developers think Consumer components are required for reading context — useContext() makes Consumer render-prop components completely unnecessary in functional components. useContext is simpler, more readable, and should always be preferred in functional components.",
      "Many developers think Context solves all prop drilling problems — Context is the right tool when many unrelated components need the same data. When two siblings need to share state, lifting state to their common parent is simpler and more explicit than adding a Context.",
    ],

    realWorldExamples: [
      "Authentication: the current user and auth state are read by dozens of components (nav, profile, permissions checks). A UserContext at the app root eliminates passing user as a prop through every layout and page component.",
      "Theming: a ThemeContext holding 'light' or 'dark' mode is consumed by every styled component and UI library wrapper. The theme rarely changes, making Context ideal — consumers re-render only on explicit theme toggle.",
      "Internationalisation (i18n): the current locale and translation function live in a context so any component can call t('key') without receiving the translator as a prop.",
      "Feature flags: a FeatureFlagContext holds the current user's enabled features, consumed by any component that needs to show or hide UI — without every intermediate component knowing about feature flags.",
      "Compound component patterns: libraries like Radix UI and Headless UI use Context internally to share state between parent and child components (e.g. Tabs.Root shares selected tab state with Tabs.Trigger and Tabs.Content) without exposing it as props.",
      "React Router: the router uses Context internally to share the current location, params, and navigation function — that's why useLocation() and useNavigate() work from any depth in the tree without prop threading.",
    ],

    cheatSheet: [
      "createContext(defaultValue) — defaultValue used ONLY when no Provider exists above the consumer",
      "Provider: &lt;MyContext.Provider value={...}&gt; — all descendants can read this value",
      "Consumer: const value = useContext(MyContext) — subscribes; re-renders when value changes",
      "Re-render rule: ALL consumers re-render whenever the Provider's value changes (Object.is comparison)",
      "Performance fix 1: memoize value object — useMemo(() => ({ a, b }), [a, b])",
      "Performance fix 2: split contexts — separate UserContext and ThemeContext so consumers only re-render for their slice",
      "Context use cases: stable ambient data — current user, theme, locale, feature flags",
      "Not a good fit: frequently updating state (counters, filters) — use Zustand/Redux for those",
      "No useContext needed for write-only access — pass setState functions directly as props instead of via context",
    ],

    interviewTips: [
      "Lead with the problem it solves: 'Context solves prop drilling — passing data through intermediate components that don't use it. Instead of threading a prop through 5 layers, you broadcast the value from a Provider and any descendant reads it directly with useContext.'",
      "The re-render behaviour is the depth question: 'Every component that calls useContext re-renders when the context value changes — even if the specific field it reads hasn't changed. This is why passing a plain object as value causes all consumers to re-render on every App render. The fix is useMemo on the value object, or splitting into separate contexts by update frequency.'",
      "The Context vs Redux answer interviewers want: 'Context is dependency injection, not state management. It has no selector system — every consumer re-renders on any change. I use Context for stable ambient data (user, theme, locale) and Zustand/Redux for frequently-changing global state where selective subscriptions matter.'",
      "Mention the default value trap: 'The argument to createContext is a fallback used only when there's no Provider above the consumer in the tree — not an initial value. Most developers never intentionally trigger it; it mainly exists to make TypeScript happy and catch missing Providers.'",
      "Splitting contexts shows senior thinking: 'I split contexts by update frequency — a ThemeContext and UserContext instead of one AppContext. A button that reads theme doesn't re-render when the user logs out. This is the simplest way to control which consumers are affected by which state changes.'",
      "Connect to React Router and libraries: 'Context is the mechanism behind useLocation(), useNavigate(), and most React library hooks — they all use a hidden Provider at the top of the tree and useContext in the hook. Understanding Context is understanding how most of the React ecosystem works.'",
    ],

    related: [
      "react-usecontext-interview-questions",
      "react-usestate-interview-questions",
      "react-rendering-performance-interview-questions",
      "react-custom-hook-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 6. Higher Order Components ───────────────────────────────────────────────

  {
    slug: "react-higher-order-components-interview-questions",
    title: "React Higher Order Components (HOC) — Complete Interview Guide",
    category: "Patterns",
    keyword: "Higher Order Components",
    description:
      "Master Higher Order Components — how they work, the conventions that prevent hard-to-debug bugs, why hooks largely replaced them, and the cases where HOCs are still the right choice.",
    extraKeywords: [
      "react higher order component",
      "HOC react",
      "react withAuth HOC",
      "react forwardRef HOC",
      "HOC vs custom hooks",
      "react component composition",
      "react connect redux HOC",
    ],
    difficulty: "Intermediate",
    questionCount: "6–10",
    track: "react",
    status: "published",
    order: 6,

    mentalModel:
      "A Higher Order Component is a function that takes a component and returns a new, enhanced component. Think of it as a component factory with an extra layer of behaviour baked in — authentication checking, loading states, analytics tracking, or feature flags — without the original component knowing anything about it. The wrapped component just receives props and renders; the HOC handles the cross-cutting concern around it.",

    deepDive: `
<h3>The Pattern</h3>
<p>A HOC is a function: it accepts a component as an argument and returns a new component that wraps it with additional logic. The naming convention is to prefix with <code>with</code>:</p>
<pre><code>// HOC that redirects unauthenticated users
function withAuth(WrappedComponent) {
  return function AuthGuard(props) {
    const { user, loading } = useAuth();

    if (loading) return &lt;Spinner /&gt;;
    if (!user)   return &lt;Navigate to="/login" /&gt;;

    return &lt;WrappedComponent {...props} /&gt;;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);

// ProtectedDashboard behaves exactly like Dashboard, but checks auth first
&lt;ProtectedDashboard userId={123} /&gt;</code></pre>

<h3>The Three Conventions You Must Follow</h3>

<h4>1. Pass through all props</h4>
<pre><code>// ❌ Breaks the wrapped component — props are swallowed
return &lt;WrappedComponent /&gt;;

// ✅ Always spread props through so the wrapped component gets everything
return &lt;WrappedComponent {...props} /&gt;;</code></pre>

<h4>2. Set a displayName for debugging</h4>
<pre><code>function withAuth(WrappedComponent) {
  function AuthGuard(props) { ... }

  // React DevTools will show "withAuth(Dashboard)" instead of "AuthGuard"
  AuthGuard.displayName = \`withAuth(\${WrappedComponent.displayName ?? WrappedComponent.name})\`;

  return AuthGuard;
}</code></pre>

<h4>3. Forward refs</h4>
<p>HOCs break ref forwarding by default — a ref on a HOC-wrapped component points to the HOC wrapper, not to the underlying component's DOM node. Fix this with <code>React.forwardRef</code>:</p>
<pre><code>function withLogging(WrappedComponent) {
  const WithLogging = React.forwardRef((props, ref) =&gt; {
    logRender(WrappedComponent.name);
    return &lt;WrappedComponent {...props} ref={ref} /&gt;;
  });
  WithLogging.displayName = \`withLogging(\${WrappedComponent.name})\`;
  return WithLogging;
}</code></pre>

<h3>Composing Multiple HOCs</h3>
<p>HOCs compose by nesting function calls — but deep nesting creates "wrapper hell" and makes debugging painful:</p>
<pre><code>// Hard to read and debug — which HOC caused the bug?
const EnhancedComponent = withRouter(withAuth(withAnalytics(withTheme(Dashboard))));

// Use a compose utility (from Redux or Ramda) to flatten the nesting
const enhance = compose(withRouter, withAuth, withAnalytics, withTheme);
const EnhancedComponent = enhance(Dashboard);</code></pre>
<p>Even with compose, HOC-wrapped components are hard to see in React DevTools because each HOC adds a layer to the component tree.</p>

<h3>The Problems With HOCs</h3>
<ul>
  <li><strong>Prop naming collisions</strong> — if two HOCs inject a prop with the same name, one silently overwrites the other. Debugging this is painful.</li>
  <li><strong>Wrapper hell</strong> — composing 4–5 HOCs produces deeply nested DevTools trees that hide the component you actually care about.</li>
  <li><strong>Opaque data flow</strong> — it's not clear from the component definition which props came from HOCs vs were passed by the parent.</li>
  <li><strong>Ref forwarding complexity</strong> — every HOC must explicitly forward refs or they get lost, and this is easy to forget.</li>
</ul>

<h3>HOC vs Custom Hook — The Modern Choice</h3>
<p>Custom hooks solve most of what HOCs were used for — without the component nesting, prop collision, or ref forwarding complexity:</p>
<pre><code>// HOC approach — adds a component layer, injects props
const ProtectedDashboard = withAuth(Dashboard);

// Custom hook approach — logic lives inside the component, no wrapping
function Dashboard() {
  const { user, loading } = useAuth(); // same logic, no wrapper
  if (loading) return &lt;Spinner /&gt;;
  if (!user) return &lt;Navigate to="/login" /&gt;;
  return &lt;DashboardContent /&gt;;
}</code></pre>
<p>Hooks compose naturally, don't add tree depth, can't collide on prop names, and are visible in the component's own code. For new code, prefer custom hooks over HOCs.</p>

<h3>When HOCs Are Still the Right Choice</h3>
<ul>
  <li><strong>Class components</strong> — hooks don't work in class components. HOCs remain the only way to inject hook-based logic into a class component you can't convert.</li>
  <li><strong>Existing HOC-heavy codebases</strong> — if your codebase heavily uses <code>connect()</code> from Redux v4, <code>withRouter</code>, etc., HOCs are already the established pattern.</li>
  <li><strong>Third-party library APIs</strong> — some libraries still export HOCs as their primary API. Understanding HOCs is required to use them correctly.</li>
  <li><strong>React.memo</strong> — technically a HOC; wrapping a component in React.memo to control re-renders is a HOC usage that still makes sense.</li>
</ul>
    `.trim(),

    misconceptions: [
      "Many developers think HOCs are deprecated or wrong — they're a valid pattern, especially when working with class components or HOC-based libraries like Redux v4's connect(). React.memo is itself a HOC. They're less necessary in modern functional-component codebases, but not deprecated.",
      "Many developers forget to spread props in a HOC and wonder why the wrapped component isn't receiving its props — the most basic HOC mistake is returning <WrappedComponent /> without {...props}. The HOC swallows everything and the wrapped component gets nothing.",
      "Many developers don't set displayName and then can't debug their apps — React DevTools shows 'Component' or a random function name instead of 'withAuth(Dashboard)'. Always set displayName explicitly; it takes one line and saves hours of debugging.",
      "Many developers don't realise HOCs break refs by default — a ref attached to a HOC-wrapped component points to the HOC's function component, not the underlying DOM node or class instance. Every HOC that might have a ref applied to it must use React.forwardRef.",
      "Many developers use HOCs when a custom hook would be simpler — if the logic doesn't need to render anything (auth check, data fetching, event listeners), a custom hook expresses it more clearly with no component nesting, no prop injection, and no ref forwarding complexity.",
      "Many developers define HOCs inside another component's render — defining a HOC inside render creates a new component type on every render, which makes React unmount and remount the wrapped component on every parent re-render. Always define HOCs at the module level, outside of any component.",
    ],

    realWorldExamples: [
      "Redux connect(): the classic HOC — connect(mapStateToProps, mapDispatchToProps)(MyComponent) wraps a component to inject Redux store state and dispatch as props. Still present in millions of React codebases.",
      "Route protection: withAuth(Dashboard) is a ubiquitous pattern in older Next.js and React Router codebases — check authentication, redirect if not logged in, render the page if authenticated.",
      "React.memo: React.memo(ExpensiveComponent) is a built-in HOC — it wraps the component and skips re-renders when props haven't changed. The fact that a standard React API is a HOC shows the pattern is still valid.",
      "Error tracking HOCs: some error monitoring SDKs provide a withErrorTracking(Component) HOC that wraps any component to automatically report errors thrown during its render lifecycle.",
      "A/B testing: a withVariant(Component, 'experiment-name') HOC injects the current experiment variant as a prop, letting components render variant-specific UI without managing experiment state themselves.",
      "Storybook decorators: Storybook's story decorators are essentially HOCs applied to stories — they wrap each story in a provider (theme, router, Redux store) so each story has the context it needs to render.",
    ],

    cheatSheet: [
      "HOC = function that takes a component, returns a new component: function withX(Wrapped) { return function Enhanced(props) { ... } }",
      "Always spread props: &lt;WrappedComponent {...props} /&gt; — never swallow them",
      "Always set displayName: Enhanced.displayName = `withX(${Wrapped.displayName ?? Wrapped.name})`",
      "Always forward refs: wrap with React.forwardRef if the HOC might receive a ref",
      "Naming convention: prefix with 'with' — withAuth, withTheme, withAnalytics",
      "Composing multiple HOCs: use compose() utility to avoid deep nesting",
      "Don't define HOCs inside render — creates a new component type every render, causing constant unmounts",
      "HOC vs custom hook: if no JSX wrapping needed, custom hook is simpler with no tree depth added",
      "Still valid for: class components, React.memo, legacy codebases, Redux connect()",
    ],

    interviewTips: [
      "Define it cleanly: 'A HOC is a function that takes a component and returns a new component with added behaviour. It's the decorator pattern in React — you enhance a component without modifying it.'",
      "The three conventions show you've used HOCs in production: '(1) always spread props through with {...props}; (2) set displayName so DevTools shows withAuth(Dashboard) not AuthGuard; (3) use React.forwardRef if refs might be passed — HOCs break ref forwarding by default.'",
      "The 'HOC vs custom hook' question is almost always asked — give the nuanced answer: 'Custom hooks replaced most HOC use cases because they add no component nesting, can't collide on prop names, and don't need forwardRef. But HOCs are still correct for class components (hooks don't work there), React.memo, and existing HOC-based library APIs like Redux connect().'",
      "The 'never define HOCs inside render' rule is a strong signal: 'Defining a HOC inside render creates a new component type on every render cycle, causing React to unmount and remount the wrapped component every time the parent renders. HOCs must be defined at module scope.'",
      "React.memo as a HOC example shows breadth: 'React.memo(Component) is a built-in HOC — it wraps a component to skip re-renders when props are unchanged. That a standard React API is implemented as a HOC shows the pattern isn't going away.'",
      "Close with when you'd personally choose each: 'In new functional-component code, I default to custom hooks — less complexity, no wrapping. I reach for HOCs when working with class components, using HOC-based library APIs, or applying React.memo.'",
    ],

    related: [
      "react-custom-hook-interview-questions",
      "react-rendering-performance-interview-questions",
      "react-useref-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 7. React Portals ────────────────────────────────────────────────────────

  {
    slug: "react-portals-interview-questions",
    title: "React Portals — Complete Interview Guide",
    category: "Core",
    keyword: "React Portals",
    description:
      "Understand React Portals — how createPortal teleports DOM output outside the component's parent while keeping it inside the React tree, why this solves stacking context problems, and how events still bubble correctly.",
    extraKeywords: [
      "react portal",
      "createPortal react",
      "react modal portal",
      "react z-index overflow hidden",
      "react portal event bubbling",
      "react render outside parent",
      "react tooltip portal",
    ],
    difficulty: "Intermediate",
    questionCount: "5–8",
    track: "react",
    status: "published",
    order: 7,

    mentalModel:
      "A React Portal teleports a component's DOM output to a different node — typically document.body — while keeping it fully inside the React component tree. The component still belongs to its parent in React's world: events bubble up through React ancestors normally, Context still works, and the component's lifecycle is tied to its React parent. But the actual DOM nodes materialise somewhere else entirely. This solves the z-index and overflow stacking context problems that make modals, dropdowns, and tooltips so painful to build.",

    deepDive: `
<h3>The Stacking Context Problem</h3>
<p>The classic scenario: you build a modal inside a component that has <code>overflow: hidden</code> or a low <code>z-index</code>. No matter how high you set the modal's <code>z-index</code>, the browser clips it because it's constrained by its parent's stacking context. The modal appears behind other elements or gets cut off.</p>
<pre><code>/* Parent has overflow: hidden — modal gets clipped regardless of z-index */
.card {
  overflow: hidden;
  position: relative;
}

/* This modal is trapped inside .card even with z-index: 9999 */
.modal {
  position: absolute;
  z-index: 9999;
}</code></pre>
<p>The fundamental fix is to render the modal's DOM outside the constrained parent — in <code>document.body</code>, where it's unrestricted. That's exactly what Portals do.</p>

<h3>createPortal — The API</h3>
<pre><code>import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  // Renders children into document.body — outside the current DOM subtree
  return createPortal(
    &lt;div className="modal-overlay" onClick={onClose}&gt;
      &lt;div className="modal-content" onClick={e =&gt; e.stopPropagation()}&gt;
        {children}
      &lt;/div&gt;
    &lt;/div&gt;,
    document.body  // ← the target DOM node; can be any existing DOM element
  );
}</code></pre>
<p><code>createPortal</code> takes two arguments: the React children to render, and the target DOM node to render them into. The children are normal React — JSX, components, event handlers, the works.</p>

<h3>Setting Up the Portal Target</h3>
<p>For modals and overlays, <code>document.body</code> works fine. For more structured apps, add a dedicated container in your HTML to keep things organised:</p>
<pre><code>&lt;!-- public/index.html --&gt;
&lt;body&gt;
  &lt;div id="root"&gt;&lt;/div&gt;
  &lt;div id="modal-root"&gt;&lt;/div&gt;  &lt;!-- portal target --&gt;
&lt;/body&gt;</code></pre>
<pre><code>// Use it in any component
return createPortal(
  &lt;ModalContent /&gt;,
  document.getElementById('modal-root')
);</code></pre>

<h3>Event Bubbling — The Counterintuitive Part</h3>
<p>Even though the modal's DOM nodes live in <code>document.body</code>, events fired inside the portal bubble through the <strong>React component tree</strong> — not the DOM tree. This means:</p>
<pre><code>function Parent() {
  function handleClick() {
    console.log('Parent caught the click!'); // This DOES fire even though
  }                                           // modal is outside Parent in the DOM

  return (
    &lt;div onClick={handleClick}&gt;
      &lt;p&gt;I am Parent&lt;/p&gt;
      &lt;Modal /&gt; {/* portal renders in document.body, but events bubble to Parent */}
    &lt;/div&gt;
  );
}</code></pre>
<blockquote>Portal events bubble through the React tree, not the DOM tree. This is usually what you want — a modal that's a child of a form component can still bubble submit events up to the form.</blockquote>

<h3>Accessibility Considerations</h3>
<p>Portals require explicit accessibility work that normal components don't:</p>
<ul>
  <li><strong>Focus trap</strong>: when a modal opens, keyboard focus must be moved inside the modal. When it closes, focus must return to the trigger element. Use a library like <code>focus-trap-react</code> rather than implementing this manually.</li>
  <li><strong>aria-modal="true"</strong>: tells screen readers to treat the modal as a separate UI layer, hiding the background content.</li>
  <li><strong>Role</strong>: the modal container should have <code>role="dialog"</code> and an accessible title via <code>aria-labelledby</code>.</li>
</ul>
<pre><code>&lt;div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
&gt;
  &lt;h2 id="modal-title"&gt;Confirm Delete&lt;/h2&gt;
  ...
&lt;/div&gt;</code></pre>

<h3>Cleanup with useEffect</h3>
<p>If you dynamically create the portal target (rather than using a pre-existing DOM node), clean it up when the component unmounts:</p>
<pre><code>function Modal({ children }) {
  const [container] = useState(() =&gt; {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
  });

  useEffect(() =&gt; {
    return () =&gt; document.body.removeChild(container); // cleanup on unmount
  }, [container]);

  return createPortal(children, container);
}</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think portals break the React component tree — portals only change where the DOM nodes appear. In React's tree, a portal's children are still children of the component that rendered the portal. Context, error boundaries, and event bubbling all work through the React tree, not the DOM position.",
      "Many developers think events inside a portal don't bubble to ancestors — events bubble through the React component tree regardless of DOM position. A click inside a portal modal WILL bubble to the React ancestor that rendered the portal, which can cause unexpected double-handling if you don't stopPropagation.",
      "Many developers think portals are only for modals — any UI that needs to escape a parent's stacking context benefits from portals: tooltips, dropdowns, popovers, toasts, context menus, and date pickers all commonly use them.",
      "Many developers forget accessibility when using portals — rendering a modal in document.body doesn't automatically move keyboard focus or trap it. Without explicit focus management (focus-trap-react), screen reader and keyboard users can tab out of the modal into the background content.",
      "Many developers think portals cause memory leaks if the target is created dynamically — only if you forget the useEffect cleanup. If you use document.getElementById on a pre-existing node (like a #modal-root div in index.html), no cleanup is needed.",
      "Many developers think they need portals for every modal — if the parent component has no overflow:hidden, no transform, no filter, and a high enough z-index, a normal absolutely-positioned component works fine. Only reach for portals when you're actually fighting a stacking context.",
    ],

    realWorldExamples: [
      "Modals and dialogs: every modal library (Radix UI Dialog, Headless UI Dialog, MUI Modal) uses portals internally to render the overlay and dialog into document.body, escaping any parent overflow:hidden or z-index constraints.",
      "Tooltips and popovers: tooltip libraries use portals so a tooltip on a button inside a table cell isn't clipped by the table's overflow:hidden. The tooltip renders in body at the calculated screen position.",
      "Dropdown menus: select boxes and autocomplete dropdowns render their options list via portal so it overflows any parent container and appears above other UI elements regardless of the component's position in the DOM.",
      "Toast notifications: notification systems (React-Toastify, Sonner) render all toasts in a fixed container portalled into body, independent of where the notification was triggered in the component tree.",
      "Drag-and-drop: drag previews (the ghost element that follows your cursor) are portalled into body so they render above everything and aren't clipped by any parent container.",
      "Nested modals: a confirmation modal that appears on top of a main modal — both portalled into body — avoids stacking context issues between the two modal layers.",
    ],

    cheatSheet: [
      "createPortal(children, domNode) — renders children into domNode outside the current DOM subtree",
      "React tree is unchanged — context, error boundaries, and event bubbling still flow through the React parent",
      "Event bubbling goes through the React tree (not the DOM tree) — clicks inside a portal bubble to React ancestors",
      "Use document.body or a dedicated #modal-root div as the target",
      "Dynamically created target nodes: append in useState initialiser, remove in useEffect cleanup",
      "Accessibility: role='dialog', aria-modal='true', aria-labelledby, and a focus trap on open",
      "Use case: any UI that needs to escape overflow:hidden, transform, or low z-index stacking contexts",
      "React.createPortal is stable — no special dependencies, works in React 16+",
    ],

    interviewTips: [
      "Lead with the problem, not the API: 'Portals solve the stacking context problem — when you have a modal inside a component with overflow:hidden or a low z-index, the modal gets clipped regardless of its z-index value. A portal teleports the modal's DOM nodes to document.body where it's unrestricted.'",
      "The event bubbling answer is the depth question: 'Even though portal DOM nodes are in document.body, events still bubble through the React component tree — not the DOM tree. A click inside a portal modal bubbles up to the React component that rendered the portal, not to body's React ancestors. This is usually the right behaviour, but you need to be aware of it to avoid double-handling.'",
      "Mention accessibility proactively — it shows production experience: 'Portals require explicit accessibility work: moving focus into the modal on open, trapping focus so keyboard users can't escape to the background, and using role=dialog plus aria-modal=true. I use focus-trap-react rather than implementing the trap manually.'",
      "Know when NOT to use them: 'I only reach for portals when I'm actually fighting a stacking context. If the parent component has no overflow:hidden or transform, a simple position:fixed with a high z-index is simpler and avoids the complexity of portals.'",
      "Connect to real libraries: 'Radix UI, Headless UI, MUI, and React-Toastify all use portals internally for modals, dropdowns, and toasts. Understanding portals helps you reason about why these libraries work the way they do, even if you rarely write raw createPortal yourself.'",
      "The React tree vs DOM tree distinction is the key conceptual point — state it clearly in one sentence: 'A portal changes where DOM nodes appear but not where the component sits in React's tree — context and event bubbling still use the React tree.'",
    ],

    related: [
      "react-rendering-reconciliation-interview-questions",
      "react-useref-interview-questions",
      "react-error-boundaries-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 8. Code Splitting & Lazy Loading ────────────────────────────────────────

  {
    slug: "react-code-splitting-interview-questions",
    title: "React Code Splitting & Lazy Loading — Complete Interview Guide",
    category: "Performance",
    keyword: "React Code Splitting",
    description:
      "Master React code splitting — how React.lazy and Suspense work together, why route-based splitting gives the biggest wins, how to handle failed lazy loads, and what named exports require.",
    extraKeywords: [
      "react code splitting",
      "react lazy loading",
      "react lazy suspense",
      "dynamic import react",
      "react bundle size",
      "react lazy route splitting",
      "react suspense fallback",
    ],
    difficulty: "Intermediate",
    questionCount: "6–10",
    track: "react",
    status: "published",
    order: 8,

    mentalModel:
      "Code splitting breaks your JavaScript bundle into smaller chunks that load on demand. Instead of forcing every user to download your entire application upfront, you deliver the minimum code needed for the current page and fetch additional chunks only when the user navigates or triggers a feature. React.lazy wraps the dynamic import — it's the lazy loader. Suspense provides the loading boundary — it shows a fallback while the chunk downloads. Together they give you on-demand loading with almost no boilerplate.",

    deepDive: `
<h3>The Bundle Problem</h3>
<p>Without code splitting, your bundler (webpack, Vite) combines every JavaScript file in your app into one large file. Every user downloads this bundle on their first visit — even if they only use 10% of the features. A user landing on the login page downloads all the code for the admin panel, the user profile, the analytics dashboard, and every other page they haven't visited yet.</p>
<p>Code splitting solves this by creating separate JavaScript chunks for different parts of the app, loaded on demand.</p>

<h3>Dynamic import() — The Foundation</h3>
<p>Before React.lazy, bundlers introduced <code>import()</code> as a dynamic version of the static <code>import</code> statement. It returns a Promise that resolves to the module:</p>
<pre><code>// Static import — loaded immediately, part of the main bundle
import Dashboard from './Dashboard';

// Dynamic import — loaded on demand, creates a separate chunk
import('./Dashboard').then(module =&gt; {
  const Dashboard = module.default;
  render(&lt;Dashboard /&gt;);
});</code></pre>
<p>Bundlers automatically create a separate JavaScript file (chunk) for every dynamic import target. The chunk is only fetched when the <code>import()</code> call executes.</p>

<h3>React.lazy — Declarative Lazy Loading</h3>
<p><code>React.lazy</code> wraps a dynamic import so you can use the lazily-loaded component just like any other React component. It must receive a function that returns a Promise resolving to a module with a <strong>default export</strong>:</p>
<pre><code>// Without lazy — AdminPanel is in the main bundle
import AdminPanel from './AdminPanel';

// With lazy — AdminPanel becomes a separate chunk, loaded on demand
const AdminPanel = React.lazy(() =&gt; import('./AdminPanel'));

// Usage is identical — React handles the loading
function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;AdminPanel /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
<blockquote>React.lazy only works with <strong>default exports</strong>. If the component is a named export, create an intermediate module that re-exports it as default, or use the workaround below.</blockquote>

<h3>Suspense — The Loading Boundary</h3>
<p><code>Suspense</code> is the boundary component that shows a fallback UI while a lazy component's chunk is downloading. It can wrap one or many lazy components — it shows the fallback if <em>any</em> child is still loading:</p>
<pre><code>// One Suspense, multiple lazy children — fallback shows until ALL are ready
&lt;Suspense fallback={&lt;PageSkeleton /&gt;}&gt;
  &lt;LazyHeader /&gt;
  &lt;LazyContent /&gt;
  &lt;LazyFooter /&gt;
&lt;/Suspense&gt;

// Nested Suspense — each section has its own loading state
&lt;Suspense fallback={&lt;HeaderSkeleton /&gt;}&gt;
  &lt;LazyHeader /&gt;
  &lt;Suspense fallback={&lt;ContentSkeleton /&gt;}&gt;
    &lt;LazyContent /&gt;
  &lt;/Suspense&gt;
&lt;/Suspense&gt;</code></pre>

<h3>Route-Based Splitting — Biggest Impact</h3>
<p>The highest-ROI code splitting strategy is to split at the route level — each page becomes its own chunk. A user visiting <code>/dashboard</code> never downloads the code for <code>/settings</code>:</p>
<pre><code>const Home      = React.lazy(() =&gt; import('./pages/Home'));
const Dashboard = React.lazy(() =&gt; import('./pages/Dashboard'));
const Settings  = React.lazy(() =&gt; import('./pages/Settings'));

function App() {
  return (
    &lt;Suspense fallback={&lt;PageLoader /&gt;}&gt;
      &lt;Routes&gt;
        &lt;Route path="/"          element={&lt;Home /&gt;} /&gt;
        &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
        &lt;Route path="/settings"  element={&lt;Settings /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>

<h3>Error Boundaries + Lazy = Required Pairing</h3>
<p>Lazy loading can fail — the network is unreliable, a deployment changed the chunk filename, or the user's browser is offline. Without an Error Boundary, a failed lazy load crashes the entire app. Always pair Suspense with an Error Boundary:</p>
<pre><code>&lt;ErrorBoundary fallback={&lt;p&gt;Failed to load. &lt;button onClick={retry}&gt;Retry&lt;/button&gt;&lt;/p&gt;}&gt;
  &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
    &lt;LazyComponent /&gt;
  &lt;/Suspense&gt;
&lt;/ErrorBoundary&gt;</code></pre>

<h3>Named Exports Workaround</h3>
<p>React.lazy requires a default export. For components exported as named exports, create a re-export:</p>
<pre><code>// ❌ Won't work — lazy requires default export
const { UserCard } = React.lazy(() =&gt; import('./components'));

// ✅ Option 1: Re-export as default in a wrapper file
// LazyUserCard.js
export { UserCard as default } from './components';

// Then use it
const UserCard = React.lazy(() =&gt; import('./LazyUserCard'));

// ✅ Option 2: Inline re-export in the lazy call
const UserCard = React.lazy(() =&gt;
  import('./components').then(module =&gt; ({ default: module.UserCard }))
);</code></pre>

<h3>Preloading for Instant Feels</h3>
<p>You can trigger a lazy component's chunk download before the user needs it — on hover, on route transition start, or after the initial page loads — so the chunk is already cached when it's needed:</p>
<pre><code>const Dashboard = React.lazy(() =&gt; import('./Dashboard'));

// Preload on hover — by the time the user clicks, the chunk is cached
function NavLink() {
  function handleMouseEnter() {
    import('./Dashboard'); // triggers the download, React.lazy will use the cached result
  }
  return (
    &lt;a href="/dashboard" onMouseEnter={handleMouseEnter}&gt;Dashboard&lt;/a&gt;
  );
}</code></pre>
    `.trim(),

    misconceptions: [
      "Many developers think code splitting automatically improves performance — if all your split chunks are loaded immediately on page load (e.g. all route chunks eagerly fetched), splitting adds overhead (more HTTP requests) with no benefit. Code splitting only helps when chunks are genuinely deferred until needed.",
      "Many developers think React.lazy works with named exports — it requires a Promise that resolves to a module with a default export. For named exports, you must either re-export as default or use the .then(module => ({ default: module.Named })) pattern.",
      "Many developers forget Error Boundaries alongside Suspense for lazy loading — a failed chunk load (network error, deployment mismatch) will crash the app if there's no Error Boundary catching the load failure. Suspense + ErrorBoundary is always a pair.",
      "Many developers split every component into its own chunk — over-splitting creates hundreds of tiny HTTP requests that hurt performance more than the large bundle did. The right granularity is route-level for SPAs and large feature modules for component libraries.",
      "Many developers think Suspense is only for lazy loading — Suspense is a general loading boundary. React Query, Relay, and React 18's use() hook all integrate with Suspense for data fetching. Understanding Suspense as a 'loading boundary' (not a 'lazy boundary') is the complete mental model.",
      "Many developers think dynamic import() is a React feature — it's a JavaScript/bundler feature (webpack, Vite, Rollup). React.lazy is just a React wrapper around dynamic import(). The chunk creation happens at the bundler level, not in React.",
    ],

    realWorldExamples: [
      "Multi-page SPAs: React Router apps split each page route into its own chunk — the /checkout page code isn't downloaded until the user navigates to it, cutting initial bundle size by 60-80% for large apps.",
      "Heavy feature modules: a rich text editor (TipTap, Quill) or data visualisation library (D3, Recharts) is only loaded when the user opens the feature that needs it, not on every page load.",
      "Admin panels: admin features are lazily loaded because most users never access them — splitting /admin routes means regular users never pay the download cost for admin-only code.",
      "Internationalisation: instead of bundling all locale files upfront, lazy-load the specific locale module when the user selects their language.",
      "Map integrations: a Mapbox or Google Maps component is expensive to load. Lazy-loading it means the map chunk is only downloaded when a map-containing page is visited.",
      "Next.js App Router: Next.js performs automatic code splitting per page and layout by default. Understanding React.lazy and Suspense helps you reason about how Next.js's automatic splitting works and how to add component-level splits on top of it.",
    ],

    cheatSheet: [
      "React.lazy(() => import('./Comp')) — creates a lazily loaded component from a dynamic import",
      "React.lazy requires a default export — use .then(m => ({ default: m.Named })) for named exports",
      "Suspense fallback={<Spinner />} — shows fallback while lazy component chunk is downloading",
      "Always pair with ErrorBoundary — a failed chunk load crashes the app without it",
      "Route-level splitting = biggest performance win for SPAs",
      "Nested Suspense = granular loading states (each section has its own skeleton)",
      "Preloading: call import('./Comp') on hover/focus before the user navigates — chunk is cached when needed",
      "Over-splitting hurts: aim for route-level + large feature modules, not every component",
    ],

    interviewTips: [
      "Lead with the problem: 'Without code splitting, every user downloads the entire app bundle on first load — including code for pages they may never visit. Code splitting creates separate chunks that load on demand, reducing initial load time.'",
      "Explain the React.lazy + Suspense pairing as two separate roles: 'React.lazy wraps the dynamic import — it's the loader. Suspense is the boundary that shows a fallback while the chunk downloads — it's the UI gate. They always work together.'",
      "The Error Boundary + Suspense point impresses: 'Lazy loading can fail — network issues, deployment mismatches. Without an Error Boundary, a failed load crashes the whole app. I always wrap lazy-loaded sections in both: ErrorBoundary → Suspense → LazyComponent. The ErrorBoundary catches load failures; Suspense handles the loading state.'",
      "The named export limitation is a common gotcha: 'React.lazy only accepts a Promise resolving to a module with a default export. For named exports, I use the .then trick: React.lazy(() => import(\"./file\").then(m => ({ default: m.Named })))'",
      "Route-level splitting first, always: 'The highest ROI split is at the route level — each page becomes its own chunk. Users visiting /dashboard never download /settings code. I add component-level splits only when bundle analysis shows a specific heavy component worth isolating.'",
      "Connect to Next.js/modern frameworks: 'Next.js does route-based code splitting automatically. Understanding React.lazy and Suspense helps you reason about what Next.js is doing and how to add component-level splits on top — for example, lazily loading a heavy chart library only on the analytics page.'",
    ],

    related: [
      "react-error-boundaries-interview-questions",
      "react-concurrent-rendering-react-18-interview-questions",
      "react-rendering-performance-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 9. React Server Components ──────────────────────────────────────────────

  {
    slug: "react-server-components-interview-questions",
    title: "React Server Components (RSC) — Complete Interview Guide",
    category: "Advanced",
    keyword: "React Server Components",
    description:
      "Master React Server Components — the critical RSC vs SSR distinction, what 'use client' means, what you can and cannot do in Server Components, how data fetching changes, and how Next.js App Router implements RSC.",
    extraKeywords: [
      "react server components",
      "RSC react",
      "use client directive",
      "next.js app router server components",
      "react server components vs SSR",
      "server actions react",
      "react server components data fetching",
    ],
    difficulty: "Advanced",
    questionCount: "8–12",
    track: "react",
    status: "published",
    order: 9,

    mentalModel:
      "React Server Components run exclusively on the server and never ship their JavaScript to the browser — zero bundle size. Think of the component tree as two worlds: the server world (RSC) handles data fetching, database calls, and markup generation with no client cost; the client world (marked 'use client') handles interactivity and browser APIs. The boundary is explicit — you decide where the server layer ends and the client layer begins. RSC is NOT the same as SSR: SSR converts React to HTML strings; RSC are actual React components that live permanently on the server.",

    deepDive: `
<h3>The Critical Distinction: RSC vs SSR</h3>
<p>This is the most common point of confusion, and interviewers will test it directly.</p>
<ul>
  <li><strong>SSR (Server-Side Rendering)</strong> — runs React on the server, converts the component tree to an HTML string, sends HTML to the browser, then the client downloads the JS bundle and <em>hydrates</em> the HTML (attaches event listeners). Both server and client run the same component code.</li>
  <li><strong>RSC (React Server Components)</strong> — Server Components run <em>only</em> on the server, never on the client. They return a serialized React tree (not HTML) to the client. Their JavaScript is <em>never sent to the browser</em> — they have zero bundle size.</li>
</ul>
<p>You can use both together: Next.js App Router uses RSC for data fetching (zero bundle cost) combined with SSR to generate HTML for fast first paints.</p>

<h3>The 'use client' Directive</h3>
<p>By default in the App Router, every component is a Server Component. The <code>'use client'</code> directive at the top of a file marks it — and everything it imports — as a Client Component:</p>
<pre><code>'use client'; // ← This file and its imports are Client Components

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0); // state only works in Client Components
  return (
    &lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;
      Count: {count}
    &lt;/button&gt;
  );
}</code></pre>
<p>The directive marks a <strong>boundary</strong> in the module graph — everything above it (imported by a Server Component) is server-only; everything below (imported by a Client Component) runs on the client.</p>

<h3>What Server Components CAN Do</h3>
<ul>
  <li><strong>Async/await directly</strong> — Server Components are async functions. You can await database calls, file reads, and API calls directly in the component body.</li>
  <li><strong>Direct database access</strong> — call your ORM (Prisma, Drizzle) or query builder directly; no API layer needed.</li>
  <li><strong>Access secrets</strong> — environment variables with API keys, database credentials — these never reach the browser.</li>
  <li><strong>Import large server-only libraries</strong> — heavy data processing libraries that would bloat the bundle can be used freely on the server.</li>
  <li><strong>Render Client Components as children</strong> — a Server Component can render Client Components; it just can't pass functions or non-serializable values as props.</li>
</ul>
<pre><code>// Server Component — async, direct DB call, no 'use client'
async function UserProfile({ userId }) {
  const user = await db.user.findUnique({ where: { id: userId } }); // direct DB query

  return (
    &lt;div&gt;
      &lt;h1&gt;{user.name}&lt;/h1&gt;
      &lt;LikeButton postId={user.featuredPostId} /&gt; {/* Client Component child is fine */}
    &lt;/div&gt;
  );
}</code></pre>

<h3>What Server Components CANNOT Do</h3>
<ul>
  <li><strong>useState, useReducer</strong> — no state in Server Components</li>
  <li><strong>useEffect, useLayoutEffect</strong> — no lifecycle effects</li>
  <li><strong>Event handlers</strong> — onClick, onChange, etc.</li>
  <li><strong>Browser APIs</strong> — window, document, localStorage</li>
  <li><strong>Context consumers</strong> — useContext does not work in Server Components</li>
  <li><strong>Pass functions as props to Client Components</strong> — functions aren't serializable across the server/client boundary</li>
</ul>
<blockquote>Rule of thumb: if it needs the browser or interactivity → 'use client'. If it's data fetching and markup → Server Component.</blockquote>

<h3>Data Fetching — No More useEffect</h3>
<p>In Server Components, you fetch data directly in the component body with async/await. No useEffect, no useState for loading/error, no API route needed:</p>
<pre><code>// Old pattern — Client Component with useEffect
'use client';
function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() =&gt; {
    fetch('/api/products').then(r =&gt; r.json()).then(setProducts);
  }, []);
  return &lt;ul&gt;{products.map(p =&gt; &lt;li key={p.id}&gt;{p.name}&lt;/li&gt;)}&lt;/ul&gt;;
}

// New RSC pattern — Server Component, zero client JS
async function ProductList() {
  const products = await db.product.findMany(); // direct DB, no API route
  return &lt;ul&gt;{products.map(p =&gt; &lt;li key={p.id}&gt;{p.name}&lt;/li&gt;)}&lt;/ul&gt;;
}</code></pre>

<h3>Server Actions — Mutations from the Server</h3>
<p>Server Actions (marked with <code>'use server'</code>) are async functions that run on the server but can be called from Client Components — like an RPC call. They're the RSC equivalent of an API endpoint, but with less boilerplate:</p>
<pre><code>'use server';

export async function createPost(formData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  revalidatePath('/posts'); // clear the cache for the posts page
}

// Used directly in a Client Component form — no /api/posts route needed
&lt;form action={createPost}&gt;
  &lt;input name="title" /&gt;
  &lt;button type="submit"&gt;Create&lt;/button&gt;
&lt;/form&gt;</code></pre>

<h3>Bundle Size Impact</h3>
<p>A Server Component that imports a 500KB data processing library adds zero bytes to the client bundle. The same import in a Client Component adds 500KB. This is the core bundle-size advantage of RSC — move heavy logic to the server, ship less JavaScript to the browser.</p>
    `.trim(),

    misconceptions: [
      "Many developers think RSC and SSR are the same thing — SSR converts React to an HTML string on the server; every component still runs on the client for hydration. RSC components run ONLY on the server and their JavaScript is never sent to the browser. They're complementary, not the same.",
      "Many developers think 'use client' makes a component only render on the client — 'use client' means the component is a Client Component, but Client Components are still server-rendered (as HTML) on first load in Next.js. 'use client' marks the boundary where server-only React ends and interactive React begins.",
      "Many developers think Server Components are faster because they run on the server — the performance win is reduced JavaScript bundle size and eliminated client-side data fetching waterfalls, not server execution speed. A Server Component eliminates the need for an API route, a fetch call, useState for loading state, and error handling.",
      "Many developers try to use useState or useEffect in Server Components — these APIs require the React runtime on the client and don't exist on the server. Any component using hooks must be a Client Component (marked 'use client').",
      "Many developers think you can't pass data from Server to Client Components — you can pass serializable data (strings, numbers, objects, arrays) as props from Server to Client Components. You cannot pass functions, Dates, or class instances because they aren't serializable across the network boundary.",
      "Many developers think RSC requires Next.js — RSC is a React feature, but Next.js App Router is currently the most mature and production-ready implementation. Other frameworks (Remix, Waku, Parcel) are adding RSC support, but Next.js App Router is the primary context where RSC interviews are asked about.",
    ],

    realWorldExamples: [
      "Dashboard pages in Next.js App Router: the page component is a Server Component that fetches user data directly from the database, renders the layout and non-interactive parts, and passes data down to Client Components (charts, interactive filters) as serialized props.",
      "E-commerce product pages: the product details, SEO metadata, and static content are Server Components (fast, no JS shipped); the Add-to-cart button, quantity selector, and reviews tabs are Client Components (interactive, need state).",
      "Authentication-aware layouts: a Server Component reads the session cookie directly (no API call), fetches the user from the database, and conditionally renders different navigation — zero client JS needed for this auth check.",
      "Heavy data transformations: a report component that processes megabytes of data and renders a table uses a Server Component with a server-side data library (Papa Parse, sql.js) — the heavy library never reaches the browser.",
      "Server Actions for mutations: a blog editor uses a Server Action for 'publish post' — no /api/publish route, no client-side fetch, the action runs on the server and revalidates the post cache.",
      "Streaming with Suspense: long-running server data fetches are wrapped in Suspense, allowing React to stream the page HTML progressively — the shell renders immediately, slow data sections stream in as they resolve, all server-side.",
    ],

    cheatSheet: [
      "RSC ≠ SSR: RSC = components run only on server, zero JS sent to client. SSR = components render to HTML on server, same JS hydrates on client",
      "Default in Next.js App Router: every component is a Server Component unless marked 'use client'",
      "'use client' at top of file → marks boundary; file and its imports become Client Components",
      "Server Components CAN: async/await, direct DB calls, access secrets, import heavy server libraries",
      "Server Components CANNOT: useState, useEffect, event handlers, browser APIs, useContext",
      "Data fetching: async function Component() { const data = await db.query(); return <JSX /> }",
      "Server Actions: 'use server' functions callable from Client Components — RPC without API routes",
      "Props across boundary: serializable data only (strings, numbers, objects) — no functions",
      "Bundle size: Server Component imports = zero client JS; Client Component imports = added to bundle",
    ],

    interviewTips: [
      "Lead with the RSC vs SSR distinction — it's the first thing interviewers test: 'SSR renders React to HTML on the server; the same JS still ships to the client for hydration. RSC components run only on the server — their JavaScript is never sent to the browser. They're complementary: Next.js uses both.'",
      "Explain 'use client' as a boundary, not a switch: 'use client marks the module graph boundary between server-only React and interactive React. It doesn't mean the component only renders on the client — Client Components are still server-rendered to HTML in Next.js. It means the component needs the React runtime (hooks, events) on the client.'",
      "The data fetching improvement is the strongest practical argument: 'In the old model: Client Component → useEffect → fetch /api/products → useState for loading/error. In RSC: async Server Component → await db.product.findMany() → render. No API route, no loading state, no error state, and zero client JS for the data fetching logic.'",
      "Be clear about what you can't do: 'Server Components can't use state, effects, event handlers, or browser APIs. Any interactive piece needs to be a Client Component. The art is identifying the boundary — push as much as possible to the server, keep 'use client' boundaries as low in the tree as possible.'",
      "Server Actions show you understand the full RSC model: 'Server Actions are async functions marked use server that run on the server but can be called from Client Components. They're like typed RPC endpoints — you call a function, the network request happens automatically, no /api routes needed.'",
      "Connect to real frameworks: 'RSC is a React feature, but Next.js App Router is the most mature implementation and the primary context you'd encounter it in production today. Understanding RSC helps you reason about Next.js 13+ App Router architecture — why some components are async, why some files need use client, and how the streaming model works.'",
    ],

    related: [
      "react-code-splitting-interview-questions",
      "react-concurrent-rendering-react-18-interview-questions",
      "react-rendering-performance-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 10. Props & One-Way Data Flow ────────────────────────────────────────────

  {
    slug: "react-props-interview-questions",
    title: "React Props & One-Way Data Flow — Complete Interview Guide",
    category: "Core",
    keyword: "React Props",
    description:
      "Master React props — immutability, one-way data flow, lifting state up, the children prop, prop drilling, and the TypeScript patterns for typing props correctly in every interview scenario.",
    extraKeywords: [
      "react props",
      "react one way data flow",
      "react prop drilling",
      "lifting state up react",
      "react children prop",
      "react props vs state",
      "react parent child communication",
    ],
    difficulty: "Beginner",
    questionCount: "8–12",
    track: "react",
    status: "published",
    order: 10,

    mentalModel:
      "Props are a component's function arguments — read-only data that flow from parent to child. State is a component's private memory — data it owns and can change. React enforces one-directional data flow: data only moves down through props; changes move back up through callback functions passed as props. This one-way street is what makes React apps predictable — you always know where data lives, and there is exactly one way it can change.",

    deepDive: `
<h3>Props Are Function Arguments</h3>
<p>A React component is a function. Props are its arguments. Just as you can't modify a function argument inside the function body without side effects, a component must never modify its props:</p>
<pre><code>// Component receives props like function arguments
function Greeting({ name, age }) {
  // ❌ Never do this — props are read-only
  name = 'Bob'; // this is a local mutation, doesn't affect the parent anyway

  return &lt;p&gt;Hello, {name}. You are {age} years old.&lt;/p&gt;;
}

// Parent controls what props the child receives
&lt;Greeting name="Alice" age={30} /&gt;</code></pre>
<p>If a component receives an incorrect prop, the fix is to change what the parent passes — not to modify the prop inside the child.</p>

<h3>One-Way Data Flow</h3>
<p>Data in React flows in one direction: <strong>parent → child via props</strong>. A child component cannot directly change its parent's state. This makes the data flow predictable:</p>
<pre><code>function Parent() {
  const [count, setCount] = useState(0);

  // Data flows DOWN via props
  return &lt;Child count={count} onIncrement={() =&gt; setCount(c =&gt; c + 1)} /&gt;;
}

function Child({ count, onIncrement }) {
  // Child reads data from props — cannot directly change parent state
  // Changes move UP via callback props
  return &lt;button onClick={onIncrement}&gt;Count: {count}&lt;/button&gt;;
}</code></pre>
<p>To send data "up" the tree, a parent passes a callback function as a prop. The child calls the callback with the new value; the parent updates its state; React re-renders both with the new value. This is the only correct way for a child to influence its parent.</p>

<h3>Lifting State Up</h3>
<p>When two sibling components need to share state, the state must live in their closest common ancestor — this is "lifting state up":</p>
<pre><code>// ❌ Each component has its own state — they can't share it
function TempInput() { const [val, setVal] = useState(0); ... }
function TempDisplay() { const [val, setVal] = useState(0); ... } // separate, can't sync

// ✅ State lifted to the parent — both siblings share the same source of truth
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);

  return (
    &lt;&gt;
      &lt;CelsiusInput  value={celsius}     onChange={setCelsius} /&gt;
      &lt;FahrenheitDisplay celsius={celsius} /&gt;
    &lt;/&gt;
  );
}</code></pre>

<h3>The children Prop</h3>
<p>Any JSX you nest between a component's opening and closing tags becomes its <code>children</code> prop. This is how composable layout components are built:</p>
<pre><code>function Card({ title, children }) {
  return (
    &lt;div className="card"&gt;
      &lt;h2&gt;{title}&lt;/h2&gt;
      &lt;div className="card-body"&gt;{children}&lt;/div&gt;
    &lt;/div&gt;
  );
}

// Anything between &lt;Card&gt; tags becomes children
&lt;Card title="User Profile"&gt;
  &lt;Avatar src={user.avatarUrl} /&gt;
  &lt;p&gt;{user.bio}&lt;/p&gt;
&lt;/Card&gt;</code></pre>

<h3>Prop Drilling — The Problem, Not the Solution</h3>
<p>Prop drilling is when a prop is passed through multiple intermediate components that don't use it — they just relay it to a deeper child. It becomes a maintenance problem when the prop needs to reach many levels deep:</p>
<pre><code>// Prop drilling — userId passes through App → Layout → Sidebar → UserMenu
// Layout and Sidebar don't need userId at all
function App() {
  return &lt;Layout userId={user.id} /&gt;;
}
function Layout({ userId }) {
  return &lt;Sidebar userId={userId} /&gt;;
}
function Sidebar({ userId }) {
  return &lt;UserMenu userId={userId} /&gt;;
}
function UserMenu({ userId }) {
  return &lt;a href={\`/users/\${userId}\`}&gt;Profile&lt;/a&gt;;
}</code></pre>
<p>Solutions: React Context (for ambient data read by many components), component composition (pass the rendered element as a prop instead of the data), or state management libraries for complex cases.</p>

<h3>TypeScript Prop Typing</h3>
<p>Always type props explicitly — it serves as documentation and catches mistakes at compile time:</p>
<pre><code>// Inline type — good for simple components
function Button({ label, onClick, disabled = false }: {
  label: string;
  onClick: () =&gt; void;
  disabled?: boolean;  // optional prop — ? makes it optional, with default
}) {
  return &lt;button onClick={onClick} disabled={disabled}&gt;{label}&lt;/button&gt;;
}

// Interface — good for larger or reused prop shapes
interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;  // optional
  };
  onSelect: (id: string) =&gt; void;
  className?: string;
}

function UserCard({ user, onSelect, className }: UserCardProps) {
  return (
    &lt;div className={className} onClick={() =&gt; onSelect(user.id)}&gt;
      {user.name}
    &lt;/div&gt;
  );
}</code></pre>

<h3>Props vs State — The Decision Rule</h3>
<p>A simple framework for deciding where data should live:</p>
<ul>
  <li>If the data comes from outside the component (passed by a parent) → it's a prop</li>
  <li>If the component owns and controls the data → it's state</li>
  <li>If multiple components need the same data → lift it to the closest common ancestor</li>
  <li>If many disconnected components need it → Context or external state management</li>
</ul>
    `.trim(),

    misconceptions: [
      "Many developers think they can mutate props to update the UI — props are read-only in the component that receives them. Mutating a prop changes a local reference; it doesn't update the parent's state or trigger a re-render. To change what a child displays, the parent must pass different props.",
      "Many developers confuse one-way data flow with 'children can never affect parents' — children CAN affect parents through callback props. The data (state) lives in the parent; the child calls the callback to request a change; the parent decides whether and how to update its state. Data still flows down; control flows up through function calls.",
      "Many developers think prop drilling is unavoidable and immediately reach for Context or Redux — often the right fix for prop drilling is composition: instead of drilling userId down through Layout, have App render UserMenu directly inside Layout via children. Restructuring the component tree often eliminates drilling without adding Context.",
      "Many developers think the children prop is special React magic — children is just a regular prop whose value is whatever JSX you put between the component's open and closing tags. It works identically to any other prop; you can even rename it: function Modal({ content }) { ... } and pass it as <Modal content={<p>hi</p>} />.",
      "Many developers add defaultProps to functional components — defaultProps is deprecated for function components (and removed in React 19 for function components). Use JavaScript default parameter values instead: function Btn({ label = 'Click me' }). This is simpler, works with TypeScript, and is the current standard.",
      "Many developers think passing too many props (10+) always means the component needs refactoring — sometimes a complex component genuinely needs many inputs. The issue is when props are structurally tangled (a prop only makes sense in combination with another). Group related props into an object, or break the component into smaller pieces, but don't refactor just because the prop count is high.",
    ],

    realWorldExamples: [
      "Design system components: a Button component has props for variant, size, disabled, onClick, and children. Its strict prop interface means every consumer is forced to use the component the intended way — no rogue inline styles.",
      "Form field components: a controlled TextField takes value, onChange, label, error, and helperText as props. The parent form owns the state; the TextField is purely presentational — it receives data and emits changes via callbacks.",
      "List items in a data table: a TableRow receives the row data object as a prop and an onSelect callback. The parent Table manages which row is selected; the TableRow calls onSelect when clicked, lifting the selection event up.",
      "Compound components: a Tabs component passes the selected tab index and an onChange callback to TabList and TabPanel children via the children prop pattern — the parent Tabs owns the state, the children are controlled.",
      "React Router Link: the to prop controls where the link navigates. This is a standard controlled-via-props pattern — the Link component has no opinion about destination; the parent tells it where to go.",
      "Next.js page components: page components receive params (route params), searchParams (query string), and no other React props — Next.js passes route information as props, demonstrating how framework data flows into components via the standard props mechanism.",
    ],

    cheatSheet: [
      "Props = function arguments — read-only, flow from parent to child only",
      "State = component's private memory — owned and mutable by the component itself",
      "One-way data flow: data moves DOWN via props, changes move UP via callback props",
      "To change parent state from a child: parent passes a callback as prop, child calls it",
      "Lifting state up: when siblings need shared state, move it to their closest common ancestor",
      "children prop: JSX between a component's open and close tags — a regular prop with special JSX syntax",
      "Prop drilling: when props pass through components that don't use them — solve with Context or composition",
      "TypeScript: use interface or inline type for props; use ? for optional props; use default params for defaults",
      "defaultProps is deprecated for function components in React 19 — use default parameter values",
    ],

    interviewTips: [
      "State the one-way flow rule clearly up front: 'React enforces one-directional data flow — data moves down from parent to child via props. To send changes back up, a child calls a callback function that the parent passed as a prop. The parent controls the state; the child just requests changes.'",
      "The lifting state up explanation shows you understand the core React mental model: 'When two siblings need to share state, the state belongs in their closest common ancestor. The ancestor owns the state and passes both the value and the setter down as props to both siblings. This keeps one source of truth.'",
      "For prop drilling, give a two-solution answer: 'Prop drilling happens when data passes through intermediaries that don't use it. The first fix I try is component composition — restructure so the component that needs the data is rendered higher up and passed via children. If the data is truly ambient (many unrelated components need it), then Context is the right tool.'",
      "The props vs state decision framework shows senior thinking: 'I ask: who owns this data? If it comes from outside, it's a prop. If the component creates and controls it, it's state. If multiple sibling components need the same value, I lift it to their common parent. If disconnected components across the tree need it, I use Context or an external store.'",
      "TypeScript props are worth mentioning: 'I always type props explicitly with an interface or inline type. It serves as documentation for how the component should be used, catches misuse at compile time, and shows up in IDE autocomplete for everyone who uses the component.'",
      "The children prop insight separates candidates: 'children is just a regular prop — nothing magic about it. You can rename it, pass it explicitly as a prop attribute, or accept multiple named slots. Understanding this unlocks composition patterns like compound components where you pass rendered elements as props.'",
    ],

    related: [
      "react-usestate-interview-questions",
      "react-context-api-interview-questions",
      "react-rendering-reconciliation-interview-questions",
      "react-component-lifecycle-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

  // ─── 11. State Management Patterns ────────────────────────────────────────────

  {
    slug: "react-state-management-interview-questions",
    title: "React State Management Patterns — Complete Interview Guide",
    category: "State",
    keyword: "React State Management",
    description:
      "Master React state management — when to use local state, when to lift state, when Context is the right tool, and when to reach for Zustand or Redux. Plus server state (React Query) and URL state.",
    extraKeywords: [
      "react state management",
      "react zustand vs redux",
      "react context vs redux",
      "react query server state",
      "react global state",
      "react useState vs useReducer",
      "react local state vs global state",
    ],
    difficulty: "Intermediate",
    questionCount: "8–12",
    track: "react",
    status: "published",
    order: 11,

    mentalModel:
      "React state management is a spectrum, not a single decision. At one end is useState for state owned by a single component. Next comes lifting state up for siblings that share it. Then Context for ambient data many components read. Then external stores (Redux, Zustand) for global, frequently-changing state with selective subscriptions. At the far end is server state (React Query) for data that lives on the server. The rule: keep state as local as possible, and only promote it up the chain when you have a concrete reason to.",

    deepDive: `
<h3>The Four Layers of React State</h3>
<p>Before choosing a tool, identify which category the state belongs to:</p>
<ol>
  <li><strong>Local state</strong> — owned by one component, no other component needs it</li>
  <li><strong>Shared state</strong> — two or more related components need the same value</li>
  <li><strong>Global ambient state</strong> — many disconnected components read it; changes are infrequent</li>
  <li><strong>Global dynamic state</strong> — many components read and write; changes are frequent</li>
</ol>

<h3>Layer 1: Local State — useState and useReducer</h3>
<p>Use <code>useState</code> for simple values (a string, boolean, or number) and <code>useReducer</code> when the next state depends on the previous state or multiple values must change together:</p>
<pre><code>// useState — simple toggle
const [isOpen, setIsOpen] = useState(false);

// useReducer — multiple related state transitions
const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

dispatch({ type: 'ADD_ITEM', payload: product });
dispatch({ type: 'REMOVE_ITEM', payload: productId });</code></pre>
<p><strong>Rule:</strong> if state only matters to one component (a dropdown open/close, an active tab, a form field value), keep it local. Moving state out is premature complexity.</p>

<h3>Layer 2: Shared State — Lifting Up</h3>
<p>When two sibling components need to share state, lift it to their closest common ancestor. The ancestor owns the state and distributes it as props:</p>
<pre><code>// Parent owns the state — both children are controlled
function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    &lt;&gt;
      &lt;SearchInput value={query} onChange={setQuery} /&gt;
      &lt;SearchResults query={query} /&gt;
    &lt;/&gt;
  );
}</code></pre>
<p>This is the correct solution for most shared state situations — no library needed.</p>

<h3>Layer 3: Global Ambient State — Context</h3>
<p>Context is right for data that is:</p>
<ul>
  <li>Read by many disconnected components across the tree</li>
  <li>Infrequently updated (changes don't happen on every user action)</li>
  <li>Essentially configuration: current user, theme, locale, feature flags</li>
</ul>
<pre><code>const ThemeContext = React.createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;AppContent /&gt;
      &lt;button onClick={() =&gt; setTheme(t =&gt; t === 'light' ? 'dark' : 'light')}&gt;
        Toggle Theme
      &lt;/button&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}</code></pre>
<blockquote>Context's weakness: all consumers re-render when the value changes — even if only one field in a large context object changed. For frequently-updated state, this is a performance bottleneck.</blockquote>

<h3>Layer 4: Global Dynamic State — Zustand / Redux</h3>
<p>External stores solve Context's re-render problem with <strong>selective subscriptions</strong> — a component subscribes to only the slice of state it needs:</p>
<pre><code>// Zustand store — simple to write, selective subscriptions built in
import { create } from 'zustand';

const useCartStore = create((set) =&gt; ({
  items: [],
  total: 0,
  addItem: (product) =&gt; set((state) =&gt; ({
    items: [...state.items, product],
    total: state.total + product.price,
  })),
}));

// Component subscribes only to 'total' — doesn't re-render when items change
function CartBadge() {
  const total = useCartStore(state =&gt; state.total); // selector
  return &lt;span&gt;{total}&lt;/span&gt;;
}

// Different component subscribes only to 'items'
function CartList() {
  const items = useCartStore(state =&gt; state.items);
  return &lt;ul&gt;{items.map(i =&gt; &lt;li key={i.id}&gt;{i.name}&lt;/li&gt;)}&lt;/ul&gt;;
}</code></pre>
<p><strong>Zustand vs Redux:</strong> Zustand has minimal boilerplate (no actions/reducers/selectors setup), integrates seamlessly with TypeScript, and is easier to learn. Redux Toolkit is more structured, has excellent DevTools with time-travel debugging, and suits large teams where the extra convention helps. For most new projects, Zustand is the right default.</p>

<h3>Server State — React Query / TanStack Query</h3>
<p>A major insight: most of what developers store in global state is actually <strong>server data</strong> — data fetched from an API that lives on the server. Managing this in Redux or useState means manually handling loading, error, caching, invalidation, and re-fetching. React Query (TanStack Query) handles all of this:</p>
<pre><code>// Without React Query — manual boilerplate
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() =&gt; {
  fetch('/api/users').then(r =&gt; r.json()).then(setUsers).catch(setError).finally(() =&gt; setLoading(false));
}, []);

// With React Query — caching, deduplication, background refetch, built in
const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () =&gt; fetch('/api/users').then(r =&gt; r.json()),
});</code></pre>
<p>The query key is a cache key. If multiple components call <code>useQuery({ queryKey: ['users'] })</code>, only one request fires. The result is cached and shared automatically.</p>

<h3>URL State — Underused but Powerful</h3>
<p>Some state belongs in the URL — filters, search queries, pagination, selected tabs. URL state persists across page refreshes, is shareable via link, and is accessible via the back button:</p>
<pre><code>// Storing filter state in URL query params (React Router)
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get('category') ?? 'all';

function handleFilter(value) {
  setSearchParams({ category: value }); // survives page refresh, shareable link
}</code></pre>

<h3>Choosing the Right Layer — Quick Reference</h3>
<ul>
  <li>One component → <strong>useState / useReducer</strong></li>
  <li>Sibling components → <strong>lift state up</strong></li>
  <li>Many components, rarely changes → <strong>Context</strong></li>
  <li>Many components, frequently changes → <strong>Zustand / Redux</strong></li>
  <li>Data from an API → <strong>React Query</strong></li>
  <li>Should survive refresh / be shareable → <strong>URL state</strong></li>
</ul>
    `.trim(),

    misconceptions: [
      "Many developers reach for Redux or Context immediately when state needs to be 'shared' — before adding any library, try lifting state to the nearest common ancestor. It's the simplest solution and handles most sharing requirements without any added complexity.",
      "Many developers put all application state in Redux or Zustand — this includes server data (fetched from APIs), which is better managed by React Query. Server state has different characteristics: it needs caching, deduplication, background refresh, and invalidation — none of which Redux provides out of the box.",
      "Many developers treat Context and Redux/Zustand as equivalent alternatives — they solve different problems. Context has no selector system; all consumers re-render on any value change. Zustand/Redux have selective subscriptions; a component watching cart.total doesn't re-render when user.name changes. Context is injection, Redux/Zustand is state management.",
      "Many developers think useState is always simpler than useReducer for everything — for state with multiple related transitions (a shopping cart with add/remove/clear operations, a form wizard with next/back/submit) useReducer is cleaner. It centralises the transition logic and makes it testable in isolation.",
      "Many developers store loading and error states manually alongside server data in useState — React Query eliminates this entirely. isLoading, isError, data, and isFetching are all returned automatically, along with caching, background refetch, and cache invalidation. Most 'global state' in Redux is actually server state that belongs in React Query.",
      "Many developers think Zustand is a toy and Redux is for 'serious' apps — Redux Toolkit and Zustand are both production-ready and widely used. The choice is about tradeoffs: Redux adds structure (useful for large teams), Zustand is minimal (useful for moving fast). Choosing based on team size and convention needs, not on perceived seriousness.",
    ],

    realWorldExamples: [
      "E-commerce cart: cart state lives in Zustand — multiple components (CartIcon, CartPage, CheckoutSummary) subscribe to different slices. Adding to cart only re-renders CartIcon (badge count) and not the entire page. Server cart state synced via React Query mutations.",
      "User authentication: the current user object lives in a UserContext — it's read by dozens of components (nav, profile, permissions), rarely changes, and infrequent updates don't cause performance issues.",
      "Data tables with filtering: filter state (search query, sort column, page number) lives in URL params — the filtered view is shareable via link, persists on page refresh, and works with the browser back button.",
      "Dashboard with multiple data sources: React Query manages all server data — useQuery for user data, useQuery for analytics data, useQuery for notifications. Each query has its own cache key, loading state, and background refresh interval.",
      "Form state in a multi-step wizard: useReducer manages the wizard state — each step dispatches actions that update step data and advance the wizard. The centralised reducer makes it easy to validate, navigate, and submit.",
      "Real-time collaborative app: Zustand holds the local document state; WebSocket messages dispatch updates that merge into the Zustand store; React Query handles saving to the server with optimistic updates and rollback on failure.",
    ],

    cheatSheet: [
      "Local (1 component): useState for simple values; useReducer for multiple related transitions",
      "Shared (siblings): lift state to nearest common ancestor — no library needed",
      "Global ambient (many readers, rare updates): Context — theme, user, locale, feature flags",
      "Global dynamic (many readers+writers, frequent updates): Zustand or Redux Toolkit",
      "Server data (API): React Query — handles caching, loading, error, deduplication, background refetch",
      "URL state (shareable, persists on refresh): useSearchParams (React Router) or next/navigation",
      "Context limitation: all consumers re-render on any value change — no selector system",
      "Zustand selector: useStore(state => state.count) — component only re-renders when count changes",
      "Rule: keep state as local as possible; promote up the chain only when you have a concrete reason",
    ],

    interviewTips: [
      "Frame it as a spectrum, not a choice: 'I think of state management as layers. Before reaching for any library I ask: can this stay local (useState)? If siblings need it, I lift it. If many disconnected components need it rarely, Context. If it changes frequently across many components, Zustand. If it's server data, React Query.' This structured answer impresses senior interviewers.",
      "The Context vs Zustand distinction is the depth question: 'Context is dependency injection — it has no selector system, so every consumer re-renders when the value changes. Zustand has selective subscriptions — a component watching cart.total doesn't re-render when user.name changes. For frequently-updating global state, Context has a performance problem that Zustand solves.'",
      "Server state insight separates candidates: 'A lot of what ends up in Redux is actually server data — data fetched from an API with loading and error states. React Query is a better home for it: it handles caching, deduplication, background refresh, and stale data — things you'd have to implement yourself in Redux.'",
      "useState vs useReducer — give the when-to-switch answer: 'I use useState for simple values. I switch to useReducer when state transitions involve multiple fields that change together, or when the next state depends on the previous state in complex ways. The main benefit is that the reducer is a pure function that's easy to test independently.'",
      "URL state is often overlooked — mentioning it impresses: 'Some state belongs in the URL — search queries, filters, pagination, selected tabs. URL state persists across refreshes, is shareable by link, and works with the browser back button. I use useSearchParams for this instead of putting it in component state.'",
      "Close with your personal default: 'For new projects I default to useState/useReducer locally, React Query for server data, and Zustand if I genuinely need cross-component dynamic state. I add Context for truly ambient config (theme, user). I'd use Redux Toolkit on a large team that benefits from the structure — not as a default.'",
    ],

    related: [
      "react-usestate-interview-questions",
      "react-usereducer-interview-questions",
      "react-context-api-interview-questions",
      "react-rendering-performance-interview-questions",
    ],

    relatedBlogSlugs: [],
  },

];

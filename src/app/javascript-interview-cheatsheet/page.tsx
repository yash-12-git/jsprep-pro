import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta, faqSchema, breadcrumbSchema, SITE } from '@/lib/seo/seo'

export const metadata: Metadata = pageMeta({
  title: 'JavaScript Interview Cheat Sheet 2025 (Printable PDF)',
  description: 'The ultimate JavaScript interview cheat sheet. Covers closures, event loop, promises, async/await, this keyword, prototypes, array methods, and more. Free printable PDF.',
  path: '/javascript-interview-cheatsheet',
  keywords: [
    'javascript cheat sheet',
    'javascript interview cheatsheet',
    'javascript interview pdf',
    'js interview quick reference',
    'javascript concepts cheatsheet',
    'printable javascript cheatsheet',
    'javascript interview preparation pdf',
  ],
})

const SECTIONS = [
  {
    title: 'Closures',
    color: '#7c6af7',
    points: [
      'A closure is a function that retains access to its outer scope after the outer function returns.',
      'Created every time a function is created, at function creation time.',
      'Key use cases: data encapsulation, factory functions, memoization, event handlers with state.',
      'Classic gotcha: <code>var</code> in for-loops shares the binding. Fix with <code>let</code> or IIFE.',
    ],
    code: `function counter() {
  let n = 0;
  return {
    inc: () => ++n,
    val: () => n,
  };
}
const c = counter();
c.inc(); c.inc();
c.val(); // 2`,
  },
  {
    title: 'Event Loop',
    color: '#6af7c0',
    points: [
      'JavaScript is single-threaded with a non-blocking event loop.',
      'Call stack → Microtasks (all) → Next macrotask → Microtasks → ...',
      'Microtasks: Promise callbacks, queueMicrotask, MutationObserver.',
      'Macrotasks: setTimeout, setInterval, I/O, UI rendering.',
    ],
    code: `console.log('1');
setTimeout(() => console.log('2'), 0); // macro
Promise.resolve().then(() => console.log('3')); // micro
console.log('4');
// Output: 1 → 4 → 3 → 2`,
  },
  {
    title: 'Promises & async/await',
    color: '#f7c76a',
    points: [
      'Promise states: pending → fulfilled / rejected. Immutable once settled.',
      'Combinators: Promise.all (all resolve), .race (first settles), .allSettled (all done), .any (first resolves).',
      'async function always returns a Promise. await pauses execution of that function only.',
      'Always handle rejections — unhandled rejections crash Node.js.',
    ],
    code: `// Sequential (slow)
const a = await fetchA();
const b = await fetchB();

// Parallel (fast ~2x)
const [a, b] = await Promise.all([
  fetchA(),
  fetchB(),
]);`,
  },
  {
    title: 'this Keyword',
    color: '#f76a6a',
    points: [
      'this is determined by HOW a function is called, not where defined.',
      'Global: window (browser) or undefined (strict mode).',
      'Method call: the object before the dot.',
      'new: the new object. call/apply/bind: explicit. Arrow: lexical outer scope.',
    ],
    code: `const obj = {
  val: 42,
  regular() { return this.val; },
  arrow: () => this.val, // undefined
};
const fn = obj.regular;
fn();         // undefined (lost context)
fn.call(obj); // 42`,
  },
  {
    title: 'Prototypal Inheritance',
    color: '#a78bfa',
    points: [
      'Every object has [[Prototype]]. Lookup walks chain until null.',
      'Object.create(proto) — creates object with proto as prototype.',
      'class syntax is syntactic sugar over prototypes.',
      'Use hasOwnProperty() to check own vs inherited properties.',
    ],
    code: `const animal = {
  speak() { return '...'; }
};
const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // walks chain → '...'`,
  },
  {
    title: 'var / let / const',
    color: '#6af7c0',
    points: [
      'var: function-scoped, hoisted (initialized as undefined), redeclarable.',
      'let: block-scoped, hoisted but in Temporal Dead Zone, not redeclarable.',
      'const: block-scoped, binding is immutable (value can still mutate if object).',
      'Default to const. Use let only when reassignment is needed. Avoid var.',
    ],
    code: `var x = 1; // function scope, leaks
let y = 2; // block scope
const z = []; // binding locked
z.push(1); // ✅ value mutable
z = []; // ❌ TypeError`,
  },
  {
    title: 'Array Methods',
    color: '#f7c76a',
    points: [
      'map — transform each element, returns new array of same length.',
      'filter — keep matching elements, returns smaller array.',
      'reduce — accumulate into any value.',
      'find / findIndex — first match. flat / flatMap — flatten. every / some — boolean tests.',
    ],
    code: `const nums = [1,2,3,4,5];
nums.map(n => n * 2);      // [2,4,6,8,10]
nums.filter(n => n > 2);   // [3,4,5]
nums.reduce((s,n) => s+n, 0); // 15
nums.find(n => n > 3);     // 4`,
  },
  {
    title: 'Hoisting',
    color: '#f76a6a',
    points: [
      'function declarations: fully hoisted (callable before declaration).',
      'var declarations: hoisted, initialized as undefined.',
      'let/const: hoisted but in Temporal Dead Zone until declaration line.',
      'function expressions and arrow functions: NOT hoisted (follow var/let/const rules).',
    ],
    code: `greet(); // ✅ works
function greet() { ... }

sayHi(); // ❌ TypeError
var sayHi = () => {};

log(x); // ❌ ReferenceError (TDZ)
let x = 5;`,
  },
  {
    title: 'Destructuring & Spread',
    color: '#7c6af7',
    points: [
      'Array destructuring: const [a, b] = [1, 2];',
      'Object destructuring: const { name, age = 0 } = person;',
      'Rest: const { x, ...rest } = obj; — collects remaining props.',
      'Spread: merging objects, cloning arrays, passing args.',
    ],
    code: `// Rename + default
const { name: n, age = 18 } = user;

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];

// Merge objects
const merged = { ...defaults, ...overrides };`,
  },
  {
    title: 'Debounce vs Throttle',
    color: '#f97316',
    points: [
      'Debounce: fires AFTER the user stops triggering. Best for: search, resize, form validation.',
      'Throttle: fires at most once per interval. Best for: scroll, mousemove.',
      'Mnemonic: Debounce = waits for storm to pass. Throttle = steady drip.',
    ],
    code: `function debounce(fn, delay) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), delay);
  };
}
const onSearch = debounce(fetch, 300);`,
  },
]

export default function CheatsheetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'JS Cheat Sheet', path: '/javascript-interview-cheatsheet' },
      ])}} />

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2.5rem 1.25rem', color: '#c8c8d8' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#7c6af7', textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.375rem' }}>›</span>
          <span>JavaScript Interview Cheat Sheet</span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.625rem' }}>
            Free Resource
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '0.875rem' }}>
            JavaScript Interview<br />
            <span style={{ color: '#7c6af7' }}>Cheat Sheet 2025</span>
          </h1>
          <p style={{ fontSize: '1rem', maxWidth: '40rem', margin: '0 auto 1.5rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.6)' }}>
            A complete quick-reference for every JavaScript concept you need to know before your frontend interview.
            Printable, bookmarkable, shareable.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none' }}>
              Practice with AI →
            </Link>
          </div>
        </header>

        {/* Topics covered */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {SECTIONS.map(s => (
            <a key={s.title} href={`#${s.title.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.875rem', borderRadius: '9999px', border: `1px solid ${s.color}33`, background: s.color + '0f', color: s.color, textDecoration: 'none', fontWeight: 700 }}>
              {s.title}
            </a>
          ))}
        </div>

        {/* Cheatsheet grid */}
        <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 30rem), 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {SECTIONS.map(section => (
            <section
              key={section.title}
              id={section.title.toLowerCase().replace(/\s+/g, '-')}
              style={{ background: '#111118', border: `1px solid ${section.color}22`, borderTop: `3px solid ${section.color}`, borderRadius: '1rem', padding: '1.5rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}
            >
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 900, color: section.color, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {section.title}
              </h2>

              <ul style={{ paddingLeft: '1.125rem', marginBottom: '1rem', fontSize: '0.8125rem', lineHeight: 1.75 }}>
                {section.points.map((point, i) => (
                  <li key={i} style={{ marginBottom: '0.375rem' }} dangerouslySetInnerHTML={{ __html: point }} />
                ))}
              </ul>

              <pre style={{ background: '#080810', border: `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${section.color}66`, borderRadius: '0.625rem', padding: '0.875rem', overflowX: 'auto', fontSize: '0.725rem', lineHeight: 1.7, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>
                <code>{section.code}</code>
              </pre>
            </section>
          ))}
        </main>

        {/* More to study */}
        <section style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '2rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>What's Not Covered Here</h2>
          <p style={{ fontSize: '0.9375rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
            This cheat sheet covers the concepts most frequently tested in interviews. For deeper practice, check:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9375rem', lineHeight: 2 }}>
            {[
              { href: '/javascript-interview-questions', text: '150+ full JavaScript interview questions with answers' },
              { href: '/output-quiz', text: 'Output prediction quiz (40 tricky code snippets)' },
              { href: '/debug-lab', text: 'Debug lab (20 real bugs to fix with AI feedback)' },
              { href: '/questions/async-js', text: 'Advanced Async JS questions' },
              { href: '/questions/this-keyword', text: 'All "this" keyword interview questions' },
            ].map(({ href, text }) => (
              <li key={href}><Link href={href} style={{ color: '#7c6af7', textDecoration: 'none' }}>{text}</Link></li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, rgba(124,106,247,0.15), rgba(106,247,192,0.08))', border: '1px solid rgba(124,106,247,0.25)', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>
            Ready to Test Yourself?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1.5rem', maxWidth: '36rem', margin: '0 auto 1.5rem', fontSize: '0.9375rem' }}>
            This cheat sheet gives you the concepts. JSPrep Pro makes you practice them actively —
            with output prediction, AI-evaluated answers, and mock interviews.
          </p>
          <Link href="/auth" style={{ display: 'inline-flex', padding: '0.875rem 2rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none', fontSize: '1rem' }}>
            Start Practicing Free →
          </Link>
        </section>

      </div>

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, header > div:last-child, section:last-child, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          main { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
          section { border: 1px solid #ddd !important; border-top: 3px solid #666 !important; break-inside: avoid; }
          h1, h2 { color: black !important; }
          pre { background: #f5f5f5 !important; color: black !important; border: 1px solid #ddd !important; }
          ul li { color: black !important; }
          code { color: #333 !important; }
        }
        code { font-family: 'JetBrains Mono', monospace; }
      `}} />
    </>
  )
}
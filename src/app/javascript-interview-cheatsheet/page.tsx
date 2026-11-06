import type { Metadata } from "next";
import Link from "next/link";
import { C } from "@/styles/tokens";
import { DocClose, DocHero, DocSection, RelatedLinks } from "@/components/seo/DocParts";
import { pageMeta, breadcrumbSchema } from "@/lib/seo/seo";
import DownloadPDFButton from "./DownloadPdfButton";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Cheat Sheet 2026 (Printable PDF)",
  description:
    "The ultimate JavaScript interview cheat sheet. Covers closures, event loop, promises, async/await, this keyword, prototypes, array methods, and more. Free printable PDF.",
  path: "/javascript-interview-cheatsheet",
  keywords: [
    "javascript cheat sheet",
    "javascript interview cheatsheet",
    "javascript interview pdf",
    "js interview quick reference",
    "javascript concepts cheatsheet",
    "printable javascript cheatsheet",
    "javascript interview preparation pdf",
  ],
});

// ─── Section accent colours — semantic tokens ─────────────────────────────────
// Each section keeps a distinct hue for visual hierarchy; we use the full
// Notion-safe token set so there are no raw neon values in the file.
const SECTIONS = [
  {
    title: "Closures",
    color: C.accent,
    bg: C.accentSubtle,
    border: C.border,
    points: [
      "A closure is a function that retains access to its outer scope after the outer function returns.",
      "Created every time a function is created, at function creation time.",
      "Key use cases: data encapsulation, factory functions, memoization, event handlers with state.",
      "Classic gotcha: <code>var</code> in for-loops shares the binding. Fix with <code>let</code> or IIFE.",
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
    title: "Event Loop",
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    points: [
      "JavaScript is single-threaded with a non-blocking event loop.",
      "Call stack → Microtasks (all) → Next macrotask → Microtasks → ...",
      "Microtasks: Promise callbacks, queueMicrotask, MutationObserver.",
      "Macrotasks: setTimeout, setInterval, I/O, UI rendering.",
    ],
    code: `console.log('1');
setTimeout(() => console.log('2'), 0); // macro
Promise.resolve().then(() => console.log('3')); // micro
console.log('4');
// Output: 1 → 4 → 3 → 2`,
  },
  {
    title: "Promises & async/await",
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    points: [
      "Promise states: pending → fulfilled / rejected. Immutable once settled.",
      "Combinators: Promise.all (all resolve), .race (first settles), .allSettled (all done), .any (first resolves).",
      "async function always returns a Promise. await pauses execution of that function only.",
      "Always handle rejections — unhandled rejections crash Node.js.",
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
    title: "this Keyword",
    color: C.red,
    bg: C.redSubtle,
    border: C.redBorder,
    points: [
      "this is determined by HOW a function is called, not where defined.",
      "Global: window (browser) or undefined (strict mode).",
      "Method call: the object before the dot.",
      "new: the new object. call/apply/bind: explicit. Arrow: lexical outer scope.",
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
    title: "Prototypal Inheritance",
    color: C.accentText,
    bg: C.accentSubtle,
    border: C.border,
    points: [
      "Every object has [[Prototype]]. Lookup walks chain until null.",
      "Object.create(proto) — creates object with proto as prototype.",
      "class syntax is syntactic sugar over prototypes.",
      "Use hasOwnProperty() to check own vs inherited properties.",
    ],
    code: `const animal = {
  speak() { return '...'; }
};
const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // walks chain → '...'`,
  },
  {
    title: "var / let / const",
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    points: [
      "var: function-scoped, hoisted (initialized as undefined), redeclarable.",
      "let: block-scoped, hoisted but in Temporal Dead Zone, not redeclarable.",
      "const: block-scoped, binding is immutable (value can still mutate if object).",
      "Default to const. Use let only when reassignment is needed. Avoid var.",
    ],
    code: `var x = 1; // function scope, leaks
let y = 2; // block scope
const z = []; // binding locked
z.push(1); // ✅ value mutable
z = []; // ❌ TypeError`,
  },
  {
    title: "Array Methods",
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    points: [
      "map — transform each element, returns new array of same length.",
      "filter — keep matching elements, returns smaller array.",
      "reduce — accumulate into any value.",
      "find / findIndex — first match. flat / flatMap — flatten. every / some — boolean tests.",
    ],
    code: `const nums = [1,2,3,4,5];
nums.map(n => n * 2);      // [2,4,6,8,10]
nums.filter(n => n > 2);   // [3,4,5]
nums.reduce((s,n) => s+n, 0); // 15
nums.find(n => n > 3);     // 4`,
  },
  {
    title: "Hoisting",
    color: C.red,
    bg: C.redSubtle,
    border: C.redBorder,
    points: [
      "function declarations: fully hoisted (callable before declaration).",
      "var declarations: hoisted, initialized as undefined.",
      "let/const: hoisted but in Temporal Dead Zone until declaration line.",
      "function expressions and arrow functions: NOT hoisted (follow var/let/const rules).",
    ],
    code: `greet(); // ✅ works
function greet() { ... }

sayHi(); // ❌ TypeError
var sayHi = () => {};

log(x); // ❌ ReferenceError (TDZ)
let x = 5;`,
  },
  {
    title: "Destructuring & Spread",
    color: C.accent,
    bg: C.accentSubtle,
    border: C.border,
    points: [
      "Array destructuring: const [a, b] = [1, 2];",
      "Object destructuring: const { name, age = 0 } = person;",
      "Rest: const { x, ...rest } = obj; — collects remaining props.",
      "Spread: merging objects, cloning arrays, passing args.",
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
    title: "Debounce vs Throttle",
    color: C.orange,
    bg: C.amberSubtle,
    border: C.amberBorder,
    points: [
      "Debounce: fires AFTER the user stops triggering. Best for: search, resize, form validation.",
      "Throttle: fires at most once per interval. Best for: scroll, mousemove.",
      "Mnemonic: Debounce = waits for storm to pass. Throttle = steady drip.",
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
];

export default function CheatsheetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        key="breadcrumb-schema-cheatsheet-page"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: "JS Cheat Sheet",
              path: "/javascript-interview-cheatsheet",
            },
          ]),
        }}
      />

      <div className="doc">
        <DocHero
          crumbs={
            <>
              <Link href="/">JSPrep Pro</Link>
              <span>/</span>
              <span>JavaScript Interview Cheat Sheet</span>
            </>
          }
          title={
            <>
              JavaScript Interview
              <br />
              Cheat Sheet 2025
            </>
          }
          lede="A complete quick-reference for every JavaScript concept you need to know before your frontend interview. Printable, bookmarkable, shareable."
          actions={
            <>
              <DownloadPDFButton />
              <Link href="/auth" className="btn">
                Or practice these concepts interactively
              </Link>
            </>
          }
        />

        {/* Topic anchors */}
        <div className="chip-links no-print">
          {SECTIONS.map((s) => (
            <a
              key={s.title}
              href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="chip"
            >
              {s.title}
            </a>
          ))}
        </div>

        {/* Cheatsheet grid */}
        <main className="sheet">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              id={section.title.toLowerCase().replace(/\s+/g, "-")}
              className="doc-panel sheet__item"
            >
              <h2 className="doc-h3">{section.title}</h2>
              <ul>
                {section.points.map((point, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
                ))}
              </ul>
              <pre>
                <code>{section.code}</code>
              </pre>
            </section>
          ))}
        </main>

        <div className="no-print">
          <DocSection title="What’s Not Covered Here" line="This cheat sheet covers the concepts most frequently tested in interviews. For deeper practice, check:">
            <RelatedLinks
              items={[
              {
                href: "/javascript-interview-questions",
                text: "Full JavaScript interview questions with answers",
              },
              {
                href: "/output-quiz",
                text: "Output prediction quiz (tricky code snippets)",
              },
              {
                href: "/debug-lab",
                text: "Debug lab (real bugs to fix with AI feedback)",
              },
              {
                href: "/questions/async-js",
                text: "Advanced Async JS questions",
              },
              {
                href: "/questions/this-keyword",
                text: 'All "this" keyword interview questions',
              },
            ]}
            />
          </DocSection>

          <DocClose
            title="Ready to Test Yourself?"
            line="This cheat sheet gives you the concepts. JSPrep Pro makes you practice them actively: with output prediction, AI-evaluated answers, and mock interviews."
            actions={
              <Link href="/auth" className="btn btn--primary">
                Start Practicing Free
              </Link>
            }
          />
        </div>
      </div>

      {/* ─── Print / PDF styles ────────────────────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        code { font-family: var(--font-outlier); }

        @media print {
          .no-print, nav, header, footer,
          [class*="navbar"], [class*="Navbar"] { display: none !important; }

          @page { size: A4; margin: 1.5cm 1.4cm; }

          html, body {
            background: white !important;
            color: #111 !important;
            font-size: 10pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body > * > main,
          .doc {
            display: block !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          main {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
            margin: 0 !important;
          }

          section {
            background: white !important;
            border: 1.5px solid #ddd !important;
            border-top: 3px solid #2383e2 !important;
            border-radius: 6px !important;
            padding: 0.7rem !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin: 0 !important;
          }

          h1 { font-size: 20pt !important; color: #111 !important; text-align: center; margin-bottom: 0.25rem !important; }
          h2 {
            font-size: 10pt !important; color: #2383e2 !important;
            margin: 0 0 0.4rem !important; padding-bottom: 0.25rem;
            border-bottom: 1px solid #eee;
            text-transform: uppercase; letter-spacing: 0.04em;
          }
          p { color: #37352f !important; font-size: 9pt !important; line-height: 1.5; margin: 0 0 0.25rem; }
          ul { padding-left: 1rem; margin: 0 0 0.4rem; }
          li { color: #37352f !important; font-size: 8.5pt !important; line-height: 1.5; margin-bottom: 2px; }

          pre {
            background: #f7f7f5 !important;
            border: 1px solid #e9e9e7 !important;
            border-radius: 4px !important;
            padding: 0.4rem 0.6rem !important;
            font-size: 7.5pt !important;
            color: #37352f !important;
            overflow: visible !important;
            white-space: pre-wrap !important;
            margin: 0.25rem 0 !important;
          }
          code {
            background: #efefee !important; color: #37352f !important;
            padding: 1px 3px !important; border-radius: 2px !important; font-size: 7.5pt !important;
          }
          pre code { background: none !important; color: #37352f !important; padding: 0 !important; }

          span[style*="border-radius: 9999px"],
          span[style*="borderRadius: 9999px"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body::after {
            content: "jsprep.pro — JavaScript Interview Cheat Sheet 2025";
            display: block; text-align: center;
            font-size: 7pt; color: #787774;
            margin-top: 1rem; border-top: 1px solid #e9e9e7; padding-top: 0.5rem;
          }

          section:last-of-type, header,
          nav[aria-label],
          [data-print-hide="true"] { display: none !important; }
        }
      `,
        }}
      />
    </>
  );
}

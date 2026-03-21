import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta, breadcrumbSchema } from "@/lib/seo/seo";
import DownloadPDFButton from "./DownloadPdfButton";
import { C } from "@/styles/tokens";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Cheat Sheet 2025 (Printable PDF)",
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

      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem",
          color: C.text,
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: "0.8125rem",
            color: C.muted,
            marginBottom: "2rem",
          }}
        >
          <Link href="/" style={{ color: C.accent, textDecoration: "none" }}>
            JSPrep Pro
          </Link>
          <span style={{ margin: "0 0.375rem", color: C.borderStrong }}>›</span>
          <span style={{ color: C.muted }}>
            JavaScript Interview Cheat Sheet
          </span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.accentText,
              marginBottom: "0.625rem",
            }}
          >
            Free Resource
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.15,
              marginBottom: "0.875rem",
              letterSpacing: "-0.025em",
            }}
          >
            JavaScript Interview
            <br />
            <span style={{ color: C.accent }}>Cheat Sheet 2025</span>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              maxWidth: "40rem",
              margin: "0 auto 1.5rem",
              lineHeight: 1.75,
              color: C.muted,
            }}
          >
            A complete quick-reference for every JavaScript concept you need to
            know before your frontend interview. Printable, bookmarkable,
            shareable.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.875rem",
            }}
          >
            <DownloadPDFButton />
            <Link
              href="/auth"
              style={{
                fontSize: "0.875rem",
                color: C.accentText,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Or practice these concepts interactively →
            </Link>
          </div>
        </header>

        {/* Topic anchor chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {SECTIONS.map((s) => (
            <a
              key={s.title}
              href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.875rem",
                borderRadius: "9999px",
                border: `1px solid ${s.border}`,
                background: s.bg,
                color: s.color,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {s.title}
            </a>
          ))}
        </div>

        {/* Cheatsheet grid */}
        <main
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 30rem), 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
        >
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              id={section.title.toLowerCase().replace(/\s+/g, "-")}
              style={{
                background: C.bg,
                border: `1px solid ${section.border}`,
                borderTop: `3px solid ${section.color}`,
                borderRadius: "0.75rem",
                padding: "1.375rem",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: section.color,
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {section.title}
              </h2>

              <ul
                style={{
                  paddingLeft: "1.125rem",
                  marginBottom: "1rem",
                  fontSize: "0.8125rem",
                  lineHeight: 1.75,
                }}
              >
                {section.points.map((point, i) => (
                  <li
                    key={i}
                    style={{ marginBottom: "0.375rem", color: C.text }}
                    dangerouslySetInnerHTML={{ __html: point }}
                  />
                ))}
              </ul>

              <pre
                style={{
                  background: C.codeBg,
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: "0.5rem",
                  padding: "0.875rem",
                  overflowX: "auto",
                  fontSize: "0.725rem",
                  lineHeight: 1.7,
                  color: C.codeText,
                  fontFamily: "'JetBrains Mono', monospace",
                  margin: 0,
                }}
              >
                <code>{section.code}</code>
              </pre>
            </section>
          ))}
        </main>

        {/* What's not covered */}
        <section
          style={{
            background: C.bgSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "1rem",
              letterSpacing: "-0.01em",
            }}
          >
            What's Not Covered Here
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              marginBottom: "1rem",
              color: C.muted,
              lineHeight: 1.75,
            }}
          >
            This cheat sheet covers the concepts most frequently tested in
            interviews. For deeper practice, check:
          </p>
          <ul
            style={{
              paddingLeft: "1.25rem",
              fontSize: "0.9375rem",
              lineHeight: 2,
            }}
          >
            {[
              {
                href: "/javascript-interview-questions",
                text: "200+ full JavaScript interview questions with answers",
              },
              {
                href: "/output-quiz",
                text: "Output prediction quiz ( tricky code snippets)",
              },
              {
                href: "/debug-lab",
                text: "Debug lab ( real bugs to fix with AI feedback)",
              },
              {
                href: "/questions/async-js",
                text: "Advanced Async JS questions",
              },
              {
                href: "/questions/this-keyword",
                text: 'All "this" keyword interview questions',
              },
            ].map(({ href, text }) => (
              <li key={href} style={{ color: C.muted }}>
                <Link
                  href={href}
                  style={{ color: C.accent, textDecoration: "none" }}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom CTA */}
        <section
          style={{
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "1rem",
            padding: "2.5rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Test Yourself?
          </h2>
          <p
            style={{
              color: C.muted,
              maxWidth: "36rem",
              margin: "0 auto 1.5rem",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
            }}
          >
            This cheat sheet gives you the concepts. JSPrep Pro makes you
            practice them actively — with output prediction, AI-evaluated
            answers, and mock interviews.
          </p>
          <Link
            href="/auth"
            style={{
              display: "inline-flex",
              padding: "0.75rem 1.875rem",
              background: C.accent,
              color: "#ffffff",
              borderRadius: "0.625rem",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "1rem",
            }}
          >
            Start Practicing Free →
          </Link>
        </section>
      </div>

      {/* ─── Print / PDF styles ────────────────────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        code { font-family: 'JetBrains Mono', 'Courier New', monospace; }

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
          div[style*="max-width"] {
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

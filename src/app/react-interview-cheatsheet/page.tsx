import type { Metadata } from "next";
import Link from "next/link";
import { C } from "@/styles/tokens";
import { DocClose, DocHero, DocSection, RelatedLinks } from "@/components/seo/DocParts";
import { pageMeta, breadcrumbSchema } from "@/lib/seo/seo";
import DownloadPDFButton from "../javascript-interview-cheatsheet/DownloadPdfButton";

export const metadata: Metadata = pageMeta({
  title: "React Interview Cheat Sheet 2026 (Printable PDF)",
  description:
    "The ultimate React interview cheat sheet. Covers hooks, state management, lifecycle methods, context, and more. Free printable PDF.",
  path: "/react-interview-cheatsheet",
  keywords: [
    "react cheat sheet",
    "react interview cheatsheet",
    "react interview pdf",
    "react interview quick reference",
    "react concepts cheatsheet",
    "printable react cheatsheet",
    "react interview preparation pdf",
  ],
});

// ─── Section accent colours — semantic tokens ─────────────────────────────────
// Each section keeps a distinct hue for visual hierarchy; we use the full
// Notion-safe token set so there are no raw neon values in the file.
const SECTIONS = [
  {
    title: "Rendering & Reconciliation",
    color: C.accent,
    bg: C.accentSubtle,
    border: C.border,
    points: [
      "Rendering = calling component functions to produce JSX (Virtual DOM).",
      "Reconciliation = diffing old vs new Virtual DOM to find minimal changes.",
      "React uses O(n) heuristic diffing (same type → update, different → replace).",
      "Re-render ≠ DOM update. DOM updates happen only if diff detects changes.",
    ],
    code: `function App() {
  const [count, setCount] = React.useState(0);
  return <h1>{count}</h1>;
}
// setCount triggers re-render → diff → minimal DOM update`,
  },
  {
    title: "Virtual DOM",
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    points: [
      "Virtual DOM is a lightweight JS representation of real DOM.",
      "React compares previous and next Virtual DOM trees.",
      "Avoids expensive direct DOM manipulation.",
      "Core idea: compute changes in JS, then apply minimal DOM updates.",
    ],
    code: `const vdom = {
  type: "h1",
  props: { children: "Hello" }
};`,
  },
  {
    title: "Fiber Architecture",
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    points: [
      "Fiber is React’s reconciliation engine (React 16+).",
      "Breaks rendering into small units of work.",
      "Enables pause, resume, and prioritization.",
      "Foundation for concurrent rendering and smooth UI.",
    ],
    code: `// Conceptual:
// work → pause → resume → commit`,
  },
  {
    title: "Render vs Commit Phase",
    color: C.red,
    bg: C.redSubtle,
    border: C.redBorder,
    points: [
      "Render phase: builds new tree, runs diffing (can be interrupted).",
      "Commit phase: applies changes to DOM (always synchronous).",
      "Effects (useEffect) run after commit.",
      "Never cause side effects during render phase.",
    ],
    code: `useEffect(() => {
  console.log("runs after commit");
}, []);`,
  },
  {
    title: "State & Re-renders",
    color: C.accentText,
    bg: C.accentSubtle,
    border: C.border,
    points: [
      "State updates trigger re-renders.",
      "React batches multiple state updates into one render.",
      "State is async and may be stale if not handled properly.",
      "Use functional updates when relying on previous state.",
    ],
    code: `setCount(c => c + 1); // safe
setCount(count + 1); // may be stale`,
  },
  {
    title: "useEffect",
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    points: [
      "Runs after render commit (side effects only).",
      "Dependency array controls execution.",
      "Cleanup function runs before next effect or unmount.",
      "Common bugs: missing deps, infinite loops.",
    ],
    code: `useEffect(() => {
  const id = setInterval(() => {}, 1000);
  return () => clearInterval(id);
}, []);`,
  },
  {
    title: "useMemo vs useCallback",
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    points: [
      "useMemo memoizes values (expensive computations).",
      "useCallback memoizes functions (stable references).",
      "Helps prevent unnecessary re-renders.",
      "Overuse can harm readability without real benefit.",
    ],
    code: `const value = useMemo(() => compute(a), [a]);
const fn = useCallback(() => doSomething(a), [a]);`,
  },
  {
    title: "React.memo",
    color: C.red,
    bg: C.redSubtle,
    border: C.redBorder,
    points: [
      "Prevents re-render if props are shallowly equal.",
      "Useful for pure functional components.",
      "Works well with useCallback/useMemo.",
      "Not useful if props always change.",
    ],
    code: `const Child = React.memo(({ value }) => {
  return <div>{value}</div>;
});`,
  },
  {
    title: "Keys in Lists",
    color: C.accent,
    bg: C.accentSubtle,
    border: C.border,
    points: [
      "Keys uniquely identify list items during reconciliation.",
      "Stable keys prevent unnecessary re-renders.",
      "Never use index as key for dynamic lists.",
      "Bad keys can cause UI bugs and state mismatch.",
    ],
    code: `{items.map(item => (
  <Row key={item.id} />
))}`,
  },
  {
    title: "Controlled vs Uncontrolled",
    color: C.green,
    bg: C.greenSubtle,
    border: C.greenBorder,
    points: [
      "Controlled: form state managed by React.",
      "Uncontrolled: form state managed by DOM (refs).",
      "Controlled gives better validation and control.",
      "Uncontrolled useful for simple or performance-heavy forms.",
    ],
    code: `// Controlled
<input value={val} onChange={e => setVal(e.target.value)} />

// Uncontrolled
<input ref={ref} />`,
  },
  {
    title: "Context API",
    color: C.amber,
    bg: C.amberSubtle,
    border: C.amberBorder,
    points: [
      "Used to share state globally without prop drilling.",
      "Triggers re-render for all consumers on change.",
      "Can cause performance issues if overused.",
      "Optimize using multiple contexts or selectors.",
    ],
    code: `const ThemeContext = React.createContext();
const value = useContext(ThemeContext);`,
  },
  {
    title: "Concurrent Rendering (React 18)",
    color: C.red,
    bg: C.redSubtle,
    border: C.redBorder,
    points: [
      "Allows interruptible and prioritized rendering.",
      "Improves UI responsiveness.",
      "startTransition marks low-priority updates.",
      "Does not mean multi-threading — still single-threaded JS.",
    ],
    code: `startTransition(() => {
  setSearchQuery(input);
});`,
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
              name: "React Cheat Sheet",
              path: "/react-interview-cheatsheet",
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
              <span>React Interview Cheat Sheet</span>
            </>
          }
          title={
            <>
              React Interview
              <br />
              Cheat Sheet 2025
            </>
          }
          lede="A complete quick-reference for every React concept you need to know before your frontend interview. Printable, bookmarkable, shareable."
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
                href: "/react-interview-questions",
                text: "200+ full React interview questions with answers",
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
                href: "/questions/hooks",
                text: "Advanced Hooks questions",
              },
              {
                href: "/questions/performance",
                text: "Advanced Performance questions",
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
            content: "jsprep.pro — React Interview Cheat Sheet 2025";
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

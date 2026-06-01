import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo/seo";
import { C } from "@/styles/tokens";
import InterviewQuestionList from "../javascript-interview-questions/QuestionList";

export const metadata: Metadata = pageMeta({
  title: "100+ TypeScript Interview Questions With Answers (2026)",
  description:
    "The most complete list of TypeScript interview questions with detailed answers and code examples. Covers types vs interfaces, generics, utility types, type guards, mapped types, decorators, and more. Asked at top tech companies.",
  path: "/typescript-interview-questions",
});

const TS_STATIC_FAQS = [
  {
    q: "What is TypeScript and why should you use it?",
    a: "TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional type annotations, interfaces, generics, and advanced type features that catch errors at compile time rather than runtime. Teams use it to improve code maintainability, enable better IDE tooling, and make large codebases easier to refactor safely.",
  },
  {
    q: "What is the difference between type and interface in TypeScript?",
    a: "Both type aliases and interfaces can describe object shapes, but they have key differences. Interfaces support declaration merging (multiple declarations merge into one) and are generally preferred for defining object shapes and class contracts. Type aliases are more flexible — they can represent primitives, unions, intersections, tuples, and mapped types. In most cases, prefer interface for objects and type for everything else.",
  },
  {
    q: "What are TypeScript generics and when do you use them?",
    a: "Generics are type variables that let you write reusable code that works with multiple types while maintaining type safety. You use them when a function or class should operate on different types but the types are related (e.g., a function that returns the same type it receives). Without generics you'd have to use any and lose type safety.",
  },
  {
    q: "What is the difference between any, unknown, and never in TypeScript?",
    a: "any disables type checking entirely — you can assign anything to it and do anything with it. unknown is the safe alternative — you can assign anything to it but must narrow the type before using it. never represents a type that can never occur — used as the return type of functions that always throw or never return, and appears in exhaustive checks.",
  },
  {
    q: "What are TypeScript utility types?",
    a: "Utility types are built-in generic types that transform existing types. Common ones: Partial<T> makes all properties optional, Required<T> makes all required, Readonly<T> prevents mutations, Pick<T, K> selects a subset of keys, Omit<T, K> removes keys, Record<K, V> creates an object type, ReturnType<F> extracts a function's return type, and Awaited<T> unwraps a Promise type.",
  },
  {
    q: "What is type narrowing in TypeScript?",
    a: "Type narrowing is the process of refining a broad type to a more specific one within a conditional block. TypeScript recognizes typeof, instanceof, in operator checks, equality checks, and truthiness checks as narrowing constructs. You can also write custom type guard functions using the 'is' syntax (value is Type) to narrow types in reusable ways.",
  },
  {
    q: "What are TypeScript decorators?",
    a: "Decorators are a stage-3 JavaScript proposal (enabled in TypeScript with experimentalDecorators) that let you annotate and modify classes, methods, properties, and parameters. They are functions that receive the target they decorate and can modify its behavior. Common uses include dependency injection frameworks (NestJS, Angular), ORMs (TypeORM), and validation libraries.",
  },
  {
    q: "What is the difference between extends and implements in TypeScript?",
    a: "extends is used for inheritance — a class that extends another inherits its implementation. implements is used to declare that a class satisfies a contract (interface or type) without inheriting any implementation. A class can implement multiple interfaces but can only extend one class. Interfaces can also extend other interfaces.",
  },
  {
    q: "What are mapped types in TypeScript?",
    a: "Mapped types transform all properties of an existing type by iterating over its keys. They use the syntax { [K in keyof T]: ... } and are the mechanism behind utility types like Partial, Required, and Readonly. You can also add or remove modifiers (+?, -?, +readonly, -readonly) and remap keys using the as clause.",
  },
  {
    q: "What are conditional types in TypeScript?",
    a: "Conditional types follow the syntax T extends U ? X : Y — if T is assignable to U, the type resolves to X, otherwise Y. They enable type-level logic for extracting, filtering, and transforming types. Built-in utility types like NonNullable, ReturnType, and Awaited are all implemented with conditional types.",
  },
];

const TOPIC_SECTIONS = [
  {
    title: "Types vs Interfaces",
    href: "/typescript-types-vs-interfaces-interview-questions",
  },
  {
    title: "Generics",
    href: "/typescript-generics-interview-questions",
  },
  {
    title: "Utility Types",
    href: "/typescript-utility-types-interview-questions",
  },
  {
    title: "Type Guards & Narrowing",
    href: "/typescript-type-guards-narrowing-interview-questions",
  },
  {
    title: "Mapped Types",
    href: "/typescript-mapped-types-interview-questions",
  },
  {
    title: "Conditional Types",
    href: "/typescript-conditional-types-interview-questions",
  },
];

const PREP_TIPS = [
  {
    emoji: "🧠",
    title: "Understand the type system",
    desc: "Focus on why TypeScript's structural typing works the way it does — assignability, narrowing, and distribution. Interviewers can tell when you've only memorized syntax.",
  },
  {
    emoji: "💻",
    title: "Practice type inference",
    desc: "Use output prediction questions to train your mental model of what TypeScript infers. If you can predict what a type resolves to, you truly understand it.",
  },
  {
    emoji: "🐛",
    title: "Debug type errors",
    desc: "Practice with code that has type errors — constraint violations, incompatible assignments, missing properties. Real interview questions are always logical, not syntax mistakes.",
  },
  {
    emoji: "📐",
    title: "Master the fundamentals first",
    desc: "Types vs interfaces, generics, utility types, and type guards cover 80% of TypeScript interviews. Get those solid before advanced topics.",
  },
  {
    emoji: "⏱️",
    title: "Write TypeScript daily",
    desc: "The fastest way to learn TypeScript is to use it in a real project — type props in React, add generics to utility functions, and let the compiler guide you.",
  },
];

export default async function TypeScriptInterviewQuestionsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TS_STATIC_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        key="faq-schema-ts-interview-questions"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
        }}
      >
        {/* ── Hero ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#3178c6",
              marginBottom: "0.75rem",
            }}
          >
            TypeScript Interview Prep
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "var(--color-text)",
              marginBottom: "1rem",
            }}
          >
            100+ TypeScript Interview Questions
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-muted)",
              lineHeight: 1.7,
              maxWidth: "48rem",
              marginBottom: "1.5rem",
            }}
          >
            Complete TypeScript interview prep covering types vs interfaces, generics, utility types, type guards, mapped types, decorators, and more. Questions asked at{" "}
            <strong>Google, Microsoft, Atlassian, Razorpay, Flipkart</strong> and other top tech companies.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                ...btn,
                background: "#3178c6",
                color: "white",
                border: "none",
              }}
            >
              🚀 Practice Now — It's Free
            </Link>
            <Link
              href="/topics/typescript"
              style={{
                ...btn,
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              📚 TypeScript Topics
            </Link>
            <Link
              href="/blog/typescript"
              style={{
                ...btn,
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              ✍️ TS Blog
            </Link>
          </div>
        </div>

        {/* ── Live question list ── */}
        <Suspense
          fallback={
            <div
              style={{
                color: "var(--color-muted)",
                fontSize: "0.875rem",
                padding: "1rem 0",
              }}
            >
              Loading questions…
            </div>
          }
        >
          <InterviewQuestionList forcedTrack="typescript" />
        </Suspense>

        {/* ── Static topic overview ── */}
        <div style={{ marginBottom: "3rem", marginTop: "1rem" }}>
          <h2 style={h2}>Core TypeScript Topics</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.625rem",
              marginBottom: "2rem",
            }}
          >
            {TOPIC_SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} style={topicCard}>
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontSize: "0.875rem",
                  }}
                >
                  {s.title}
                </span>
              </Link>
            ))}
            <Link
              href="/topics/typescript"
              style={{
                ...topicCard,
                justifyContent: "center",
                background: "#3178c6",
                color: "white",
                border: "none",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "inherit",
                  fontSize: "0.875rem",
                }}
              >
                Browse All Topics →
              </span>
            </Link>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={h2}>Frequently Asked TypeScript Interview Questions</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {TS_STATIC_FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: "1.25rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Prep tips ── */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={h2}>How to Prepare for TypeScript Interviews</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {PREP_TIPS.map((tip, i) => (
              <div
                key={i}
                style={{
                  padding: "1.125rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                }}
              >
                <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  {tip.emoji}
                </div>
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.375rem",
                  }}
                >
                  {tip.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "1rem",
              letterSpacing: "-0.01em",
              paddingBottom: "0.75rem",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            Related Resources
          </h2>
          <ul
            style={{
              paddingLeft: "1.25rem",
              fontSize: "0.9375rem",
              lineHeight: 2,
            }}
          >
            {[
              { href: "/topics/typescript", text: "TypeScript Interview Topics" },
              { href: "/blog/typescript", text: "TypeScript Interview Blog" },
              { href: "/javascript-interview-questions", text: "JavaScript Interview Questions" },
              { href: "/react-interview-questions", text: "React Interview Questions" },
              { href: "/roadmap", text: "Frontend Interview Roadmap" },
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

        {/* ── Bottom CTA ── */}
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 1.5rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            Ready to practice?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-muted)",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Interactive TypeScript questions with instant feedback. Predict type
            outputs, find bugs, and master TypeScript.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                ...btn,
                background: "#3178c6",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                fontSize: "1rem",
              }}
            >
              Start Practicing Free →
            </Link>
            <Link
              href="/sprint"
              style={{
                ...btn,
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                padding: "0.75rem 1.5rem",
              }}
            >
              ⚡ Daily Sprint
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.625rem 1.25rem",
  borderRadius: "0.625rem",
  fontWeight: 700,
  fontSize: "0.9375rem",
  textDecoration: "none",
  cursor: "pointer",
};

const h2: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 900,
  color: "var(--color-text)",
  marginBottom: "1.25rem",
  paddingBottom: "0.625rem",
  borderBottom: "1px solid var(--color-border)",
};

const topicCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  padding: "0.875rem 1rem",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.625rem",
  textDecoration: "none",
};

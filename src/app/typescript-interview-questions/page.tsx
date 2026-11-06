import type { Metadata } from "next";
import Link from "next/link";
import {
  DocClose,
  DocHero,
  DocSection,
  FaqRows,
  LinkGrid,
  RelatedLinks,
  TipSteps,
} from "@/components/seo/DocParts";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo/seo";
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
    a: "Both type aliases and interfaces can describe object shapes, but they have key differences. Interfaces support declaration merging (multiple declarations merge into one) and are generally preferred for defining object shapes and class contracts. Type aliases are more flexible, they can represent primitives, unions, intersections, tuples, and mapped types. In most cases, prefer interface for objects and type for everything else.",
  },
  {
    q: "What are TypeScript generics and when do you use them?",
    a: "Generics are type variables that let you write reusable code that works with multiple types while maintaining type safety. You use them when a function or class should operate on different types but the types are related (e.g., a function that returns the same type it receives). Without generics you'd have to use any and lose type safety.",
  },
  {
    q: "What is the difference between any, unknown, and never in TypeScript?",
    a: "any disables type checking entirely, you can assign anything to it and do anything with it. unknown is the safe alternative, you can assign anything to it but must narrow the type before using it. never represents a type that can never occur, used as the return type of functions that always throw or never return, and appears in exhaustive checks.",
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
    a: "extends is used for inheritance, a class that extends another inherits its implementation. implements is used to declare that a class satisfies a contract (interface or type) without inheriting any implementation. A class can implement multiple interfaces but can only extend one class. Interfaces can also extend other interfaces.",
  },
  {
    q: "What are mapped types in TypeScript?",
    a: "Mapped types transform all properties of an existing type by iterating over its keys. They use the syntax { [K in keyof T]: ... } and are the mechanism behind utility types like Partial, Required, and Readonly. You can also add or remove modifiers (+?, -?, +readonly, -readonly) and remap keys using the as clause.",
  },
  {
    q: "What are conditional types in TypeScript?",
    a: "Conditional types follow the syntax T extends U ? X : Y, if T is assignable to U, the type resolves to X, otherwise Y. They enable type-level logic for extracting, filtering, and transforming types. Built-in utility types like NonNullable, ReturnType, and Awaited are all implemented with conditional types.",
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
    title: "Understand the type system",
    desc: "Focus on why TypeScript's structural typing works the way it does, assignability, narrowing, and distribution. Interviewers can tell when you've only memorized syntax.",
  },
  {
    title: "Practice type inference",
    desc: "Use output prediction questions to train your mental model of what TypeScript infers. If you can predict what a type resolves to, you truly understand it.",
  },
  {
    title: "Debug type errors",
    desc: "Practice with code that has type errors, constraint violations, incompatible assignments, missing properties. Real interview questions are always logical, not syntax mistakes.",
  },
  {
    title: "Master the fundamentals first",
    desc: "Types vs interfaces, generics, utility types, and type guards cover 80% of TypeScript interviews. Get those solid before advanced topics.",
  },
  {
    title: "Write TypeScript daily",
    desc: "The fastest way to learn TypeScript is to use it in a real project, type props in React, add generics to utility functions, and let the compiler guide you.",
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

      <main className="doc">
        <DocHero
          title="100+ TypeScript Interview Questions"
          lede={
            <>
              Complete TypeScript interview prep covering types vs interfaces, generics, utility types, type guards, mapped types, decorators, and more. Questions asked at{" "}
            <strong>Google, Microsoft, Atlassian, Razorpay, Flipkart</strong> and other top tech companies.
            </>
          }
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Practice Now, It’s Free
              </Link>
              <Link href="/topics/typescript" className="btn">
                TypeScript Topics
              </Link>
              <Link href="/blog/typescript" className="btn">
                TS Blog
              </Link>
            </>
          }
        />

        {/* ── Live question list (client component, loads from Firestore) ── */}
        <Suspense fallback={<p className="doc-line">Loading questions…</p>}>
          <InterviewQuestionList forcedTrack="typescript" />
        </Suspense>

        {/* ── Static topic overview (always visible, good for SEO + fallback) ── */}
        <DocSection title="Core TypeScript Topics">
          <LinkGrid
            items={[
              ...TOPIC_SECTIONS,
              { title: "Browse All Topics", href: `/topics/typescript` },
            ]}
          />
        </DocSection>

        <DocSection title="Frequently Asked TypeScript Interview Questions">
          <FaqRows items={TS_STATIC_FAQS} />
        </DocSection>

        <DocSection title="How to Prepare for TypeScript Interviews">
          <TipSteps items={PREP_TIPS} />
        </DocSection>

        <DocSection title="Related Resources">
          <RelatedLinks
            items={[
              { href: "/topics/typescript", text: "TypeScript Interview Topics" },
              { href: "/blog/typescript", text: "TypeScript Interview Blog" },
              { href: "/javascript-interview-questions", text: "JavaScript Interview Questions" },
              { href: "/react-interview-questions", text: "React Interview Questions" },
              { href: "/roadmap", text: "Frontend Interview Roadmap" },
            ]}
          />
        </DocSection>

        <DocClose
          title="Ready to practice?"
          line="Interactive TypeScript questions with instant feedback. Predict type outputs, find bugs, and master TypeScript."
          actions={
            <>
              <Link href="/dashboard" className="btn btn--primary">
                Start Practicing Free
              </Link>
              <Link href="/sprint" className="btn">
                Daily Sprint
              </Link>
            </>
          }
        />
      </main>
    </>
  );
}

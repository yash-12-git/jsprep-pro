import type { Metadata } from "next";
import Link from "next/link";
import {
  DocClose,
  DocHero,
  DocSection,
  LinkGrid,
  RelatedLinks,
} from "@/components/seo/DocParts";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  KEYWORDS,
} from "@/lib/seo/seo";
import SEOPredictionCard from "@/components/seo/SEOPredictionCard";
import SEOHeroCTA from "../dashboard/components/SeoHeroCta";
import { C } from "@/styles/tokens";
import { getQuestions } from "@/lib/cachedQueries";
import { headers } from "next/headers";
import { getBilledPricing } from "@/lib/pricing";

export const metadata: Metadata = pageMeta({
  title: "JavaScript Output Questions: Predict the Console.log (2026)",
  description:
    "Practice JavaScript output prediction questions. See the code, predict what console.log prints — covers event loop, closures, hoisting, type coercion, and this binding.",
  path: "/javascript-output-questions",
  keywords: [
    "javascript output questions",
    "javascript predict the output",
    "javascript console log questions",
    "javascript coding interview output",
    "what does this javascript print",
    "javascript tricky output questions",
    "javascript event loop output",
    "javascript closure output questions",
    ...KEYWORDS.secondary,
  ],
});

const FREE_PREVIEW = 5;
const CATEGORIES = [
  "Event Loop & Promises",
  "Closures & Scope",
  "'this' Binding",
  "Hoisting",
  "Type Coercion",
  "Array Methods",
  "Modern JS",
  "Generators & Iterators",
  "Prototypes & Inheritance"
] as const;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const faqItems = [
  {
    question: "What are JavaScript output questions?",
    answer:
      "Output questions show a snippet and ask you to predict console.log output. They test scope, closures, the event loop, type coercion, hoisting, and this binding.",
  },
  {
    question: "Why do interviewers ask output prediction questions?",
    answer:
      "They cannot be guessed — you must mentally execute the code. This reveals genuine understanding vs surface knowledge.",
  },
  {
    question: "How should I practice JavaScript output questions?",
    answer:
      "Cover the output, read the code, write your prediction, then reveal. Understand why you were wrong before moving on.",
  },
];

export default async function JavaScriptOutputQuestionsPage() {
  const country = (await headers()).get("x-vercel-ip-country");
  const pricing = getBilledPricing(country);
  const outputQuestions = await getQuestions({
    filters: { "track": "javascript", status: "published", type: "output" },
    pageSize: 300,
  }).catch(() => ({ questions: [] }));

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    questions: outputQuestions.questions.filter((q) => q.category === cat),
  }));
  const orderedAll = byCategory.flatMap(({ questions }) => questions);
  const totalCount = orderedAll.length;

  return (
    <>
      <script
        type="application/ld+json"
        key="faq-schema-output-questions"
        dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }}
      />
      <script
        type="application/ld+json"
        key="breadcrumb-schema-output-questions"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: "JavaScript Output Questions",
              path: "/javascript-output-questions",
            },
          ]),
        }}
      />

      <main className="doc">
        <DocHero
          crumbs={
            <>
              <Link href="/">JSPrep Pro</Link>
              <span>/</span>
              <span>JavaScript Output Questions</span>
            </>
          }
          title={
            <>
              JavaScript Output Questions
              <br />
              What Does This Code Print?
            </>
          }
          lede={
            <>
              {totalCount}+ real{" "}
              <strong>JavaScript output prediction questions</strong> from
              frontend interviews. Read code, predict <code>console.log</code>,
              learn why.
            </>
          }
          meta={
            <>
              <span>{totalCount} questions</span>
              <span>First {FREE_PREVIEW} interactive free</span>
              <span>Progress saved in quiz</span>
            </>
          }
          actions={
            <>
              <SEOHeroCTA />
              <a href="#questions" className="btn">
                Browse Questions
              </a>
            </>
          }
        />

        <DocSection
          title="How to use this page"
          line={
            <>
              <strong>Try the first {FREE_PREVIEW} questions here</strong>: click
              a question, type your prediction, check it. No account needed. The
              rest are in the{" "}
              <Link href="/output-quiz" className="link">
                interactive quiz
              </Link>{" "}
              where progress is tracked. Reading answers ≠ predicting them.
            </>
          }
        >
          <LinkGrid
            items={byCategory.map(({ cat, questions }) => ({
              href: `#${slugify(cat)}`,
              title: cat,
              note: `${questions.length} questions`,
            }))}
          />
        </DocSection>

        {/* Questions */}
        <div id="questions">
          {byCategory.map(({ cat, questions }) => (
            <DocSection
              key={cat}
              id={slugify(cat)}
              title={cat}
              line={`${questions.length} questions`}
            >
              <div className="doc-cards">
                {questions.map((q) => {
                  const globalIndex = orderedAll.indexOf(q);
                  return (
                    <SEOPredictionCard
                      key={q.id}
                      q={{
                        id: q.id,
                        title: q.title,
                        code: q.code,
                        answer: q.answer,
                        explanation: q.explanation,
                        keyInsight: q.keyInsight,
                        difficulty: q.difficulty,
                        category: q.category,
                        tags: q.tags,
                      }}
                      globalIndex={globalIndex}
                      freeLimit={FREE_PREVIEW}
                      quizHref="/output-quiz"
                      accent={C.cool}
                      badgeLabel={`#${String(globalIndex + 1).padStart(2, "0")}`}
                    />
                  );
                })}
              </div>
            </DocSection>
          ))}
        </div>

        <DocClose
          title={`${totalCount - FREE_PREVIEW} more questions with progress tracking`}
          line={`Free accounts get 5 tracked questions. Pro adds interactive practice on all ${totalCount} output questions, debug lab, and theory mastery.`}
          actions={
            <>
              <Link href="/output-quiz" className="btn btn--primary">
                Start free, 5 questions
              </Link>
              <Link href="/#pricing" className="btn">
                View Pro, {pricing.symbol}
                {pricing.display}/mo
              </Link>
            </>
          }
        />

        <DocSection title="Related Resources">
          <RelatedLinks
            items={[
              {
                href: "/javascript-tricky-questions",
                text: "JavaScript Tricky Questions: [] == false, null == undefined explained",
              },
              {
                href: "/javascript-interview-questions",
                text: "JavaScript Interview Questions with Answers",
              },
              {
                href: "/javascript-interview-cheatsheet",
                text: "JavaScript Interview Cheat Sheet (Printable)",
              },
            ]}
          />
        </DocSection>

      </main>
    </>
  );
}

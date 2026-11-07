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
  SITE,
} from "@/lib/seo/seo";
import { getQuestions } from "@/lib/cachedQueries";
import SEOPredictionCard from "@/components/seo/SEOPredictionCard";
import SEOHeroCTA from "../dashboard/components/SeoHeroCta";
import { C } from "@/styles/tokens";
import { headers } from "next/headers";
import { getPricingForCountry } from "@/lib/pricing";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title:
    'JavaScript Tricky Questions: Coercion, Equality & "Wat" Moments (2025)',
  description:
    "The most confusing JavaScript questions explained: [] == false, null == undefined, typeof null, NaN !== NaN. Understand the rules behind the quirks — asked in real interviews.",
  path: "/javascript-tricky-questions",
  keywords: [
    "javascript tricky questions",
    "javascript weird behavior",
    "javascript type coercion questions",
    "javascript equality quirks",
    "javascript wat moments",
    "javascript null undefined equality",
    "javascript array coercion",
    "javascript interview tricky",
    "javascript typeof null",
    "javascript NaN comparison",
    ...KEYWORDS.secondary,
  ],
});

const FREE_PREVIEW = 5;

function catToId(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ─── Inline code chip helper ──────────────────────────────────────────────────
const chip: React.CSSProperties = {
  background: C.codeInlineBg,
  border: `1px solid ${C.border}`,
  padding: "0.1em 0.4em",
  borderRadius: "0.25rem",
  fontFamily: "var(--font-outlier)",
  fontSize: "0.9em",
  color: C.codeText,
};

function EmptyState() {
  return (
    <div
      style={{
        background: C.bgSubtle,
        border: `1px dashed ${C.border}`,
        borderRadius: "0.875rem",
        padding: "2.5rem",
        textAlign: "center",
        margin: "2rem 0",
      }}
    >
      <p
        style={{
          color: C.text,
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
        }}
      >
        No tricky questions tagged yet.
      </p>
      <p
        style={{
          fontSize: "0.9375rem",
          color: C.muted,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        Go to{" "}
        <Link href="/admin/questions" style={{ color: C.accent }}>
          Admin, Questions
        </Link>{" "}
        , edit any output question, then toggle <strong>Mark as Tricky</strong>.
      </p>
    </div>
  );
}

export default async function JavaScriptTrickyQuestionsPage() {
  const country = (await headers()).get("x-vercel-ip-country");
  const pricing = getPricingForCountry(country);
  const { questions } = await getQuestions({
    filters: { track: "javascript", isTricky: true, status: "published" },
    pageSize: 300,
  });

  const categories = [...new Set(questions.map((q) => q.category))].sort();
  const totalCount = questions.length;

  const faqItems = questions.slice(0, 8).map((q) => ({
    question: q.title,
    answer: q.keyInsight ?? q.explanation ?? "",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        key="faq-schema-tricky-questions"
        dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }}
      />
      <script
        type="application/ld+json"
        key="breadcrumb-schema-tricky-questions"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: "JavaScript Tricky Questions",
              path: "/javascript-tricky-questions",
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
              <span>JavaScript Tricky Questions</span>
            </>
          }
          title={
            <>
              JavaScript Tricky Questions
              <br />
              The Rules Behind the Quirks
            </>
          }
          lede={
            <>
              <code>[] == false</code>, <code>null == undefined</code>,{" "}
              <code>typeof null === &quot;object&quot;</code>. These aren’t bugs,
              they’re rules. Learn the rules and they stop being surprising.
            </>
          }
          meta={
            <>
              <span>{totalCount} tricky questions</span>
              <span>First {FREE_PREVIEW} interactive free</span>
              <span>Commonly asked in interviews</span>
            </>
          }
          actions={<SEOHeroCTA />}
        />

        <DocSection
          title="How to use this page"
          line={
            <>
              <strong>Try the first {FREE_PREVIEW} questions here</strong>: click
              a question, type your prediction, see if you got it right. The rest
              are in the{" "}
              <Link href="/output-quiz" className="link">
                interactive quiz
              </Link>
              . These questions are designed to expose blind spots: you need to{" "}
              <em>predict</em>, not read.
            </>
          }
        >
          {categories.length > 0 && (
            <LinkGrid
              items={categories.map((cat) => ({
                href: `#${catToId(cat)}`,
                title: cat,
                note: `${questions.filter((q) => q.category === cat).length} questions`,
              }))}
            />
          )}
        </DocSection>

        <section className="doc-section">
          <div className="doc-close" style={{ border: 0, padding: 0 }}>
            <h2 className="doc-h2">Why interviewers love these questions</h2>
            <p>
              They test your mental model of JavaScript’s type system: the
              Abstract Equality Comparison algorithm, how coercion fires, how the
              event loop orders execution. A developer who can’t explain{" "}
              <code>[] == false</code> probably also writes coercion bugs in
              production.
            </p>
          </div>
        </section>

        {/* Questions */}
        {questions.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {categories.map((cat) => {
              const catQs = questions.filter((q) => q.category === cat);
              return (
                <DocSection key={cat} id={catToId(cat)} title={cat}>
                  <div className="doc-cards">
                    {catQs.map((q) => {
                      const globalIndex = questions.indexOf(q);
                      return (
                        <SEOPredictionCard
                          key={q.id}
                          q={{
                            id: q.id,
                            title: q.title,
                            code: q.code,
                            answer: q.expectedOutput || q.answer || "",
                            explanation: q.explanation,
                            keyInsight: q.keyInsight,
                            difficulty: q.difficulty,
                            category: q.category,
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
              );
            })}
          </div>
        )}

        {questions.length > FREE_PREVIEW && (
          <DocClose
            title={`${totalCount - FREE_PREVIEW} more tricky questions in the quiz`}
            line="Free accounts get interactive practice on 5 questions. Pro adds all output questions, debug lab, and theory mastery."
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
        )}

        <DocSection title="Related Resources">
          <RelatedLinks
            items={[
              {
                href: "/javascript-output-questions",
                text: "JavaScript Output Questions: Predict the console.log",
              },
              {
                href: "/javascript-interview-questions",
                text: "JavaScript Interview Questions with Answers",
              },
              {
                href: "/javascript-interview-cheatsheet",
                text: "JavaScript Interview Cheat Sheet",
              },
              { href: "/debug-lab", text: "JavaScript Debug Lab: Fix Real Bugs" },
            ]}
          />
        </DocSection>

        <footer className="doc-foot">
          © 2026 {SITE.name}, {SITE.domain}
        </footer>
      </main>
    </>
  );
}

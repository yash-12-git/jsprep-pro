import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuestions } from "@/lib/cachedQueries";
import Link from "next/link";
import { DocClose, DocHero, DocSection, LinkGrid } from "@/components/seo/DocParts";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  catToSlug,
  SITE,
} from "@/lib/seo/seo";
import type { Question } from "@/types/question";
import InlineEvaluator from "@/components/ui/InlineEvaluater";
import { C, RADIUS } from "@/styles/tokens";

interface Props {
  params: { slug: string };
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const { questions } = await getQuestions({
    filters: { status: "published", type: "theory" },
    pageSize: 300,
  }).catch(() => ({ questions: [] }));
  const cats = [...new Set(questions.map((q: any) => q.category))];
  return cats.map((cat: string) => ({ slug: catToSlug(cat) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { questions: qs } = await getQuestions({
    filters: { status: "published", type: "theory" },
    pageSize: 300,
  }).catch(() => ({ questions: [] }));
  const cats = [...new Set(qs.map((q: any) => q.category))];
  const cat = cats.find((c: string) => catToSlug(c) === params.slug);
  if (!cat) return {};
  const track = (qs.find((q: any) => q.category === cat)?.track as string) ?? "javascript";
  return pageMeta({
    title: `${cat} Interview Questions (With Answers)`,
    description: `${cat} interview questions with detailed answers and code examples. Master ${cat} concepts for your frontend interview.`,
    path: `/questions/${params.slug}`,
    keywords: [
      `${cat.toLowerCase()} interview questions`,
      `${cat.toLowerCase()} ${track} interview`,
    ],
  });
}

export default async function CategoryQuestionsPage({ params }: Props) {
  const { questions: allTheory } = await getQuestions({
    filters: { status: "published", type: "theory" },
    pageSize: 300,
  }).catch(() => ({ questions: [] }));

  const theoryCats = [...new Set(allTheory.map((q: any) => q.category))];
  const cat = theoryCats.find((c: string) => catToSlug(c) === params.slug);
  if (!cat) notFound();

  const catQuestions = allTheory.filter((q: any) => q.category === cat);
  const track = (catQuestions[0]?.track as string) ?? "javascript";
  const allCats = theoryCats.map((c: string) => ({
    cat: c,
    slug: catToSlug(c),
  }));

  const faqItems = catQuestions.map((q) => ({
    question: q.title,
    answer: (q.answer ?? "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300),
  }));

  // Semantic diff badge — uses C tokens
  const diffBadge = (difficulty: string) => {
    if (difficulty === "advanced" || difficulty === "expert")
      return {
        label: "Advanced",
        color: C.amber,
        bg: C.amberSubtle,
        border: C.amberBorder,
      };
    if (difficulty === "core")
      return {
        label: "Core",
        color: C.accent,
        bg: C.accentSubtle,
        border: C.border,
      };
    return {
      label: "Beginner",
      color: C.green,
      bg: C.greenSubtle,
      border: C.greenBorder,
    };
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema(faqItems) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: `${track} Interview Questions`,
              path: `/${track}-interview-questions`,
            },
            { name: `${cat} Questions`, path: `/questions/${params.slug}` },
          ]),
        }}
      />

      <main className="doc">
        <DocHero
          crumbs={
            <>
              <Link href="/">JSPrep Pro</Link>
              <span>/</span>
              <Link href={`/${track}-interview-questions`}>
                {track.charAt(0).toUpperCase() + track.slice(1)} Interview Questions
              </Link>
              <span>/</span>
              <span>{cat}</span>
            </>
          }
          title={
            <>
              {cat} Interview Questions
              <br />
              With Answers & Code Examples
            </>
          }
          lede={
            <>
              {catQuestions.length} carefully curated{" "}
              <strong>{cat} interview questions</strong> with working code
              examples and real interview gotchas.
            </>
          }
          actions={
            <>
              <Link href="/auth" className="btn btn--primary">
                Practice Interactively
              </Link>
              <Link href={`/${track}-interview-questions`} className="btn">
                All Categories
              </Link>
            </>
          }
        />

        {/* Difficulty summary row */}
        <div className="doc-figures">
          {[
            { n: catQuestions.length, label: "questions" },
            {
              n: catQuestions.filter((q) => q.difficulty === "beginner").length,
              label: "beginner",
            },
            {
              n: catQuestions.filter((q) => q.difficulty === "core").length,
              label: "core",
            },
            {
              n: catQuestions.filter(
                (q: Question) =>
                  q.difficulty === "advanced" || q.difficulty === "expert",
              ).length,
              label: "advanced",
            },
          ].map(({ n, label }) => (
            <div key={label}>
              <b>{n}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="q-articles">
          {catQuestions.map((q: Question, i: number) => {
            const diff = diffBadge(q.difficulty);
            const plainAnswer = (q.answer ?? "")
              .replace(/<[^>]*>/g, "")
              .replace(/\s+/g, " ")
              .trim();
            return (
              <article
                key={q.id}
                className="q-article"
                itemScope
                itemType="https://schema.org/Question"
              >
                <h2 className="q-article__title" itemProp="name">
                  {q.title}
                </h2>
                <div className="doc-meta" style={{ margin: "0 0 var(--space-md)" }}>
                  <span className="measured">Question {i + 1}</span>
                  <span className="chip">{diff.label}</span>
                </div>
                {q.hint && (
                  <p className="doc-line">
                    <strong>Hint:</strong> {q.hint}
                  </p>
                )}
                <div
                  itemProp="suggestedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <div
                    itemProp="text"
                    className="answer-body"
                    dangerouslySetInnerHTML={{ __html: q.answer ?? "" }}
                  />
                </div>
                <div className="doc-actions" style={{ marginTop: "var(--space-md)" }}>
                  <Link href={`/q/${q.slug}`} className="btn btn--small">
                    Practice this question
                  </Link>
                </div>
                <InlineEvaluator
                  question={q.title}
                  idealAnswer={plainAnswer}
                  label="Evaluate with AI"
                />
              </article>
            );
          })}
        </div>

        <DocSection
          title={`Other ${track.charAt(0).toUpperCase() + track.slice(1)} Interview Topics`}
        >
          <LinkGrid
            items={allCats
              .filter((c) => c.cat !== cat)
              .map(({ cat: c, slug }) => ({
                href: `/questions/${slug}`,
                title: c,
              }))}
          />
        </DocSection>

        <DocClose
          title={`Ready to practice ${cat}?`}
          line="Get AI feedback on your answers, predict code output, and fix real bugs."
          actions={
            <Link href="/auth" className="btn btn--primary">
              Start Free Practice
            </Link>
          }
        />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import { DIFF_STYLE, DIFF_LABEL } from "@/styles/tokens";
import { notFound } from "next/navigation";
import {
  getPublishedQuestionSlugs,
  getQuestionBySlug,
  getQuestions,
} from "@/lib/cachedQueries";
import Link from "next/link";
import { DocClose, DocHero } from "@/components/seo/DocParts";
import {
  pageMeta,
  breadcrumbSchema,
  catToSlug,
  demoteH1,
} from "@/lib/seo/seo";
import InlineEvaluator from "@/components/ui/InlineEvaluater";
import { escapeCodeTags } from "@/lib/escapeCodeTags";
import { C } from "@/styles/tokens";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPublishedQuestionSlugs().catch(() => [] as string[]);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const q = await getQuestionBySlug(slug);
  if (!q) return {};
  const track = q.track;
  const diff = DIFF_LABEL[q.difficulty] ?? "Core";
  const typeLabel =
    q.type === "output"
      ? "Output Question"
      : q.type === "debug"
        ? "Debug Challenge"
        : "Interview Question";
  return pageMeta({
    title: `${q.title} — ${track} ${typeLabel}`,
    description: `${diff} ${track} ${typeLabel.toLowerCase()}: ${q.title.slice(0, 70)} — answer with code examples.`,
    path: `/q/${slug}`,
    // Every answer here is also on its category page, so that page is the one
    // to rank. Links stay followed so they still pass equity (see sitemap.ts).
    noindex: true,
    keywords: [
      q.title.toLowerCase(),
      `${q.category.toLowerCase()} ${track}`,
      `${track.toLowerCase()} interview question`,
      `${slug.replace(/-/g, " ")}`,
    ],
  });
}

function markdownToHtml(text: string): string {
  if (!text) return "";
  if (text.trim().startsWith("<")) return text;
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      p.startsWith("<pre") ? p : `<p>${p.replace(/\n/g, "<br/>")}</p>`,
    )
    .join("\n");
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const question = await getQuestionBySlug(slug);
  if (!question) notFound();
  const track = question.track;
  const catSlug = catToSlug(question.category);
  const isOutput = question.type === "output";
  const isDebug = question.type === "debug";
  const isTheory = question.type === "theory";

  const { questions: allTypeQs } = await getQuestions({
    filters: { track, status: "published", type: question.type },
    pageSize: 300,
  });
  const related = allTypeQs
    .filter((q) => q.id !== question.id && q.category === question.category)
    .slice(0, 4);

  const answerHtml = escapeCodeTags(
    demoteH1(markdownToHtml(question.answer ?? "")),
  );
  const plainAnswer = (question.answer ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const typeLabel = isOutput
    ? "Output Question"
    : isDebug
      ? "Debug Challenge"
      : "Theory Question";
  // Only JavaScript has a dedicated output questions page.
  const outputPath =
    track === "javascript" ? "/javascript-output-questions" : "/output-quiz";
  const categoryPath = isTheory
    ? `/questions/${catSlug}`
    : isOutput
      ? outputPath
      : "/debug-lab";
  const categoryLabel = isTheory
    ? question.category
    : isOutput
      ? "Output Quiz"
      : "Debug Lab";


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: `${track} Interview Questions`,
              path: `/${track.toLowerCase()}-interview-questions`,
            },
            { name: categoryLabel, path: categoryPath },
            {
              name: question.title.slice(0, 40) + "…",
              path: `/q/${slug}`,
            },
          ]),
        }}
      />

      <main className="doc doc--narrow">
        <DocHero
          crumbs={
            <>
              <Link href="/">JSPrep Pro</Link>
              <span>/</span>
              <Link href={categoryPath}>{categoryLabel}</Link>
              <span>/</span>
              <span>{question.title.slice(0, 45)}…</span>
            </>
          }
          title={question.title}
          meta={
            <>
              <span className="chip">
                {DIFF_LABEL[question.difficulty] ?? "Core"}
              </span>
              <span className="chip">{question.category}</span>
              <span className="chip chip--cool">{typeLabel}</span>
            </>
          }
        />

        {question.hint && !isDebug && (
          <div className="doc-panel doc-panel__body" style={{ marginBottom: "var(--space-xl)" }}>
            <h2 className="doc-h3">Hint</h2>
            <p className="doc-line">{question.hint}</p>
          </div>
        )}

        {/* Code block (output + debug) */}
        {(isOutput || isDebug) && question.code && (
          <section className="doc-block doc-prose">
            <h2>
              {isDebug
                ? "Buggy Code: can you spot the issue?"
                : "What does this output?"}
            </h2>
            <pre>
              <code>{question.code}</code>
            </pre>
          </section>
        )}

        {/* Expected output (output only) */}
        {isOutput && question.expectedOutput && (
          <section className="doc-block doc-prose">
            <h2>Correct Output</h2>
            <pre>{question.expectedOutput}</pre>
          </section>
        )}

        {/* Fixed code (debug only) */}
        {isDebug && question.fixedCode && (
          <section className="doc-block doc-prose">
            <h2>Fixed Code</h2>
            <pre>
              <code>{question.fixedCode}</code>
            </pre>
          </section>
        )}

        {/* Answer / Explanation */}
        <section className="doc-block">
          <h2 className="doc-h2">
            {isDebug
              ? "Bug Explained"
              : isOutput
                ? "Why this output?"
                : "Full Answer"}
          </h2>
          <div
            className="answer-body"
            dangerouslySetInnerHTML={{ __html: answerHtml }}
          />
        </section>

        {/* Inline AI evaluator (theory only) */}
        {isTheory && (
          <InlineEvaluator
            question={question.title}
            idealAnswer={plainAnswer}
            label="Can you explain this out loud?"
          />
        )}

        {/* Related questions */}
        {related.length > 0 && (
          <section className="doc-section">
            <div className="doc-head">
              <h2 className="doc-h2">
                More {question.category}{" "}
                {isOutput
                  ? "Output Questions"
                  : isDebug
                    ? "Debug Challenges"
                    : "Questions"}
              </h2>
            </div>
            <div className="q-list">
              {related.map((r) => (
                <Link key={r.id} href={`/q/${r.slug}`} className="q-row">
                  <span className="chip">
                    {DIFF_LABEL[r.difficulty] ?? "Core"}
                  </span>
                  <span className="q-row__title">{r.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <DocClose
          title={
            isOutput
              ? "Practice predicting output live"
              : isDebug
                ? "Practice spotting bugs live"
                : "Practice this in a timed sprint"
          }
          line={
            isOutput
              ? "66 output questions with instant feedback"
              : isDebug
                ? "38 debug challenges with AI hints"
                : "5 free questions, no signup required"
          }
          actions={
            <Link
              href={
                isOutput
                  ? outputPath
                  : isDebug
                    ? "/debug-lab"
                    : "/sprint"
              }
              className="btn btn--primary"
            >
              {isOutput
                ? "Try Output Quiz"
                : isDebug
                  ? "Try Debug Lab"
                  : "Start Sprint"}
            </Link>
          }
        />
      </main>
    </>
  );
}

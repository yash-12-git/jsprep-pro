import { notFound } from "next/navigation";
import {
  getBlogPostsForTopic,
  getQuestions,
  getRelatedTopics,
  getTopicBySlug,
  getTopicSlugs,
} from "@/lib/cachedQueries";
import type { Metadata } from "next";
import Link from "next/link";

import { pageMeta, faqSchema, breadcrumbSchema } from "@/lib/seo/seo";
import { getTopicFaqs, TOPIC_FAQS } from "@/data/seo/topicFaqs";
import TopicQuestionList from "./TopicQuestionList";
import { DocClose, DocHero, LinkGrid } from "@/components/seo/DocParts";
import { trackFromSlug } from "@/lib/getServerTrack";
import type { Track } from "@/lib/tracks";

export const revalidate = 3600;

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getTopicSlugs();
    return slugs?.map((topic) => ({ topic }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return {};
  const hasConceptHub = !!(topic.mentalModel || topic.deepDive);
  return pageMeta({
    title: `${topic.title}`,
    description: hasConceptHub
      ? `${(topic.mentalModel ?? topic.description).slice(0, 85)} — code examples, common mistakes, and ${topic.questionCount} interview Q&As.`
      : `${topic.description.slice(0, 110)} Practice with AI feedback on ${topic.questionCount} questions.`,
    path: `/${topic.slug}`,
    keywords: [
      `${topic.keyword} interview questions`,
      `how does ${topic.keyword} work`,
      `${topic.keyword} explained`,
      `${topic.keyword} interview questions`,
      `${topic.keyword} questions`,
      ...(topic.extraKeywords ?? []),
    ],
  });
}

export default async function TopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();
  const track: Track = (topic.track as Track | undefined) ?? trackFromSlug(slug);
  const { questions } = await getQuestions({
    filters: { track, status: "published", topicSlug: topic.slug },
    pageSize: 50,
    orderByField: "order",
    orderDir: "asc",
  });

  const [relatedTopics, relatedPosts] = await Promise.all([
    getRelatedTopics(topic.related ?? []),
    getBlogPostsForTopic(topic.slug),
  ]);

  const hasConceptHub = !!(topic.mentalModel || topic.deepDive);

  const dedicatedFaqs = getTopicFaqs(topic.slug, topic.track) ?? [];
  const faqItems = dedicatedFaqs.length > 0 ? faqSchema(dedicatedFaqs) : null;

  const tocItems = [
    hasConceptHub &&
      topic.mentalModel && { id: "concept", label: "The Mental Model" },
    hasConceptHub &&
      topic.deepDive && { id: "explanation", label: "Deep Explanation" },
    topic.misconceptions?.length && {
      id: "misconceptions",
      label: "Common Mistakes",
    },
    topic.realWorldExamples?.length && {
      id: "real-world",
      label: "Real-World Usage",
    },
    { id: "cheatsheet", label: "Cheat Sheet" },
    { id: "interview-tips", label: "Interview Tips" },
    relatedPosts.length && { id: "articles", label: "Deep Dives" },
    {
      id: "questions",
      label:
        questions.length > 0 ? `${questions.length} Questions` : "Questions",
    },
    relatedTopics.length && { id: "related", label: "Related Topics" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Topics", path: `/topics/${track}` },
            { name: topic.title, path: `/${topic.slug}` },
          ]),
        }}
      />
      {faqItems && (
        <script
          key="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqItems }}
        />
      )}

      <main className="doc">
        <DocHero
          crumbs={
            <>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href={`/topics/${track}`}>Topics</Link>
              <span>/</span>
              <span>{topic.title}</span>
            </>
          }
          title={topic.title}
          lede={topic.description}
          meta={
            <>
              <span className="chip chip--cool">{topic.difficulty}</span>
              <span className="measured">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </span>
              {hasConceptHub && <span className="chip">Full Guide</span>}
            </>
          }
        />

        <div className={tocItems.length > 3 ? "doc-split" : undefined}>
          {/* Table of Contents */}
          {tocItems.length > 3 && (
            <nav className="doc-rail" aria-label="On this page">
              <div className="doc-rail__title">On this page</div>
              <ol>
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="doc-split__main">
            {/* ━━━━━ CONCEPT HUB ━━━━━ */}
            {topic.mentalModel && (
              <section className="doc-block" id="concept">
                <h2 className="doc-h2">The Mental Model</h2>
                <p className="doc-statement">{topic.mentalModel}</p>
              </section>
            )}

            {topic.deepDive && (
              <section className="doc-block" id="explanation">
                <h2 className="doc-h2">The Explanation</h2>
                <div
                  className="concept-body"
                  dangerouslySetInnerHTML={{ __html: topic.deepDive }}
                />
              </section>
            )}

            {topic.misconceptions && topic.misconceptions.length > 0 && (
              <section className="doc-block" id="misconceptions">
                <h2 className="doc-h2">Common Misconceptions</h2>
                <ul className="doc-marks">
                  {topic.misconceptions.map((item, i) => (
                    <li key={i} className="doc-mark doc-mark--bad">
                      <span aria-hidden="true">−</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {topic.realWorldExamples && topic.realWorldExamples.length > 0 && (
              <section className="doc-block" id="real-world">
                <h2 className="doc-h2">Where You’ll See This in Real Code</h2>
                <ul className="doc-marks">
                  {topic.realWorldExamples.map((item, i) => (
                    <li key={i} className="doc-mark">
                      <span aria-hidden="true">+</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ━━━━━ INTERVIEW PREP ━━━━━ */}
            <section className="doc-block" id="cheatsheet">
              <h2 className="doc-h2">Interview Cheat Sheet</h2>
              <ul className="doc-marks">
                {topic.cheatSheet.map((point, i) => (
                  <li key={i} className="doc-mark">
                    <span aria-hidden="true">+</span>
                    <p>{point}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="doc-block" id="interview-tips">
              <h2 className="doc-h2">How to Answer in an Interview</h2>
              <ol className="doc-steps doc-steps--one">
                {topic.interviewTips.map((tip, i) => (
                  <li key={i}>
                    <p>{tip}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Related articles */}
            {relatedPosts.length > 0 && (
              <section className="doc-block" id="articles">
                <h2 className="doc-h2">Deep Dive Articles</h2>
                <div className="q-list">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.track ?? "javascript"}/${post.slug}`}
                      className="q-row"
                    >
                      <span className="q-row__title">{post.title}</span>
                      <span className="measured">{post.readTime}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Practice questions */}
            <section className="doc-block" id="questions">
              <div className="q-group__head">
                <h2 className="doc-h2">Practice Questions</h2>
                {questions.length > 0 && (
                  <span className="measured">
                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <TopicQuestionList questions={questions} topicSlug={topic.slug} />
            </section>

            {/* Related topics */}
            {relatedTopics.length > 0 && (
              <section className="doc-block" id="related">
                <h2 className="doc-h2">Related Topics</h2>
                <LinkGrid
                  items={relatedTopics.map((t) => ({
                    href: `/${t.slug}`,
                    title: t.title,
                    note: `${t.difficulty}, ${t.questionCount} Qs`,
                  }))}
                />
              </section>
            )}
          </div>
        </div>

        <DocClose
          title="Can you answer these under pressure?"
          line="Reading answers is not the same as knowing them. Practice saying them out loud with AI feedback: that’s what builds real interview confidence."
          actions={
            <>
              <Link href="/auth" className="btn btn--primary">
                Practice Free
              </Link>
              <Link href="/output-quiz" className="btn">
                Try Output Quiz
              </Link>
            </>
          }
        />
      </main>
    </div>
  );
}

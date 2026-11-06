// app/topics/[track]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { TRACKS, TRACK_MAP } from "@/lib/tracks"; // ← from shared file
import type { Track } from "@/lib/tracks";
import { TRACK_META } from "@/lib/seo/trackMeta";
import { getPublishedTopics, getQuestions } from "@/lib/cachedQueries";
import { breadcrumbSchema, pageMeta } from "@/lib/seo/seo";
import { DocClose, DocHero } from "@/components/seo/DocParts";
import type { Topic } from "@/types/topic";

export const revalidate = 3600;

export async function generateStaticParams() {
  return TRACKS.filter((t) => t.available).map((t) => ({ track: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: Track }>;
}): Promise<Metadata> {
  const { track } = await params;
  if (!TRACK_MAP[track]?.available) return {};
  const meta = TRACK_META[track];
  return pageMeta({
    title: meta.topicsTitle,
    description: meta.topicsDescription,
    path: `/topics/${track}`,
    keywords: meta.topicsKeywords,
  });
}

function groupTopics(topics: Topic[], categories: string[]) {
  const groups: Record<string, Topic[]> = {};
  for (const cat of categories) groups[cat] = [];
  for (const topic of topics) {
    if (groups[topic.category]) groups[topic.category].push(topic);
    else groups[topic.category] = [topic];
  }
  return groups;
}

export default async function TopicsPage({
  params,
}: {
  params: Promise<{ track: Track }>;
}) {
  const { track } = await params;
  if (!TRACK_MAP[track]?.available) notFound();

  const meta = TRACK_META[track];
  const [topics, { questions }] = await Promise.all([
    getPublishedTopics({ track }),
    getQuestions({ filters: { track, status: "published" }, pageSize: 1000 }),
  ]);

  const categories = Array.from(new Set(topics.map((q) => q.category)));
  const groups = groupTopics(topics, categories);

  return (
    <div>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Topics", path: `/topics/${track}` },
          ]),
        }}
      />
      <main className="doc">
        <DocHero
          crumbs={
            <>
              <Link href="/">JSPrep Pro</Link>
              <span>/</span>
              <Link href={`/topics/${track}`}>Topics</Link>
            </>
          }
          title={`${meta.label} Interview Topics`}
          lede={`${topics.length} topics across every core ${meta.label} concept: ${meta.heroTagline}.`}
        />

        <div className="doc-figures">
          {[
            { n: topics.length, label: "Topics" },
            { n: questions.length, label: "Questions" },
            { n: categories.length, label: "Categories" },
          ].map(({ n, label }) => (
            <div key={label}>
              <b>{n}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {topics.length === 0 && (
          <div className="doc-panel doc-panel__body">
            <p className="doc-h3">No topics yet for {meta.label}.</p>
            <p className="doc-line">Check back soon, we’re adding content.</p>
          </div>
        )}

        {/* Topic sections */}
        {categories.map((cat) => {
          const catTopics = groups[cat];
          if (!catTopics?.length) return null;
          return (
            <section key={cat} className="topic-group">
              <div className="q-group__head" style={{ marginBottom: "var(--space-md)" }}>
                <h2 className="doc-h2">{cat}</h2>
                <span className="measured">
                  {catTopics.length} topic{catTopics.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="q-list">
                {catTopics.map((topic) => (
                  <Link key={topic.slug} href={`/${topic.slug}`} className="topic-row">
                    <h3 className="doc-h3">
                      {topic.title
                        .replace(`${meta.label} `, "")
                        .replace(" Interview Questions", "")}
                    </h3>
                    <p>{topic.description.split(".")[0]}.</p>
                    <span className="topic-row__facts">
                      <span className="chip">{topic.difficulty}</span>
                      <span className="measured">{topic.questionCount} Qs</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <DocClose
          title="Reading isn’t enough"
          line="The gap between knowing the answer and saying it under pressure is where interviews are won or lost."
          actions={
            <>
              <Link href="/auth" className="btn btn--primary">
                Start Practicing Free
              </Link>
              <Link href={`/blog/${track}`} className="btn">
                Read the Blog
              </Link>
            </>
          }
        />
      </main>
    </div>
  );
}

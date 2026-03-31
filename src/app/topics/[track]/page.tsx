// app/topics/[track]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { TRACKS, TRACK_MAP } from "@/lib/tracks"; // ← from shared file
import type { Track } from "@/lib/tracks";
import { TRACK_META } from "@/lib/seo/trackMeta";
import { getPublishedTopics, getQuestions } from "@/lib/cachedQueries";
import { breadcrumbSchema, pageMeta } from "@/lib/seo/seo";
import { C, TOPIC_DIFF_COLOR } from "@/styles/tokens";
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
    <div style={{ backgroundColor: C.bg }}>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Topics", path: `/topics/${track}` },
          ]),
        }}
      />
      <div
        style={{
          maxWidth: "58rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 5rem",
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
          <Link
            href={`/topics/${track}`}
            style={{ color: C.accent, textDecoration: "none" }}
          >
            Topics
          </Link>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: C.accentText,
              marginBottom: "0.625rem",
            }}
          >
            Interview Preparation
          </p>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.875rem",
              letterSpacing: "-0.025em",
            }}
          >
            {meta.label} Interview Topics
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: C.muted,
              lineHeight: 1.75,
              maxWidth: "42rem",
              marginBottom: "1.75rem",
            }}
          >
            {topics.length} topics across every core {meta.label} concept —{" "}
            {meta.heroTagline}.
          </p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { n: topics.length, label: "Topics" },
              { n: questions.length, label: "Questions" },
              { n: categories.length, label: "Categories" },
            ].map(({ n, label }) => (
              <div
                key={label}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: C.text,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {n}
                </span>
                <span
                  style={{ fontSize: "0.75rem", color: C.muted, marginTop: 3 }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* Empty state */}
        {topics.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "4rem 0", color: C.muted }}
          >
            <p style={{ fontSize: "1rem" }}>No topics yet for {meta.label}.</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Check back soon — we're adding content.
            </p>
          </div>
        )}

        {/* Level legend */}
        {topics.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
              padding: "0.75rem 1.125rem",
              background: C.bgSubtle,
              border: `1px solid ${C.border}`,
              borderRadius: "0.75rem",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.6875rem",
                color: C.muted,
                fontWeight: 600,
                marginRight: 4,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Level:
            </span>
            {Object.entries(TOPIC_DIFF_COLOR).map(([diff, color]) => (
              <span
                key={diff}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.8125rem",
                  color: C.muted,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: color,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {diff}
              </span>
            ))}
          </div>
        )}

        {/* Topic sections */}
        <main style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {categories.map((cat) => {
            const catTopics = groups[cat];
            if (!catTopics?.length) return null;
            return (
              <section key={cat}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    marginBottom: "1.125rem",
                    paddingBottom: "0.875rem",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: C.bgSubtle,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    📌
                  </span>
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        color: C.text,
                        fontSize: "1rem",
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {cat}
                    </h2>
                  </div>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      color: C.accent,
                      background: C.bgSubtle,
                      border: `1px solid ${C.border}`,
                      padding: "3px 10px",
                      borderRadius: 20,
                      flexShrink: 0,
                    }}
                  >
                    {catTopics.length} topic{catTopics.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(255px, 1fr))",
                    gap: "0.625rem",
                  }}
                >
                  {catTopics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/${topic.slug}`}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          background: C.bg,
                          border: `1px solid ${C.border}`,
                          borderRadius: "0.75rem",
                          padding: "1rem 1.125rem",
                          height: "100%",
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <h3
                          style={{
                            color: C.text,
                            fontSize: "0.9375rem",
                            fontWeight: 600,
                            margin: 0,
                            lineHeight: 1.4,
                          }}
                        >
                          {topic.title
                            .replace(`${meta.label} `, "")
                            .replace(" Interview Questions", "")}
                        </h3>
                        <p
                          style={{
                            color: C.muted,
                            fontSize: "0.8125rem",
                            margin: 0,
                            lineHeight: 1.55,
                            flex: 1,
                          }}
                        >
                          {topic.description.split(".")[0]}.
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "auto",
                            paddingTop: "0.5rem",
                            borderTop: `1px solid ${C.border}`,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background:
                                TOPIC_DIFF_COLOR[topic.difficulty] ?? C.accent,
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              fontWeight: 500,
                              color:
                                TOPIC_DIFF_COLOR[topic.difficulty] ?? C.accent,
                            }}
                          >
                            {topic.difficulty}
                          </span>
                          <span
                            style={{
                              color: C.borderStrong,
                              fontSize: "0.625rem",
                            }}
                          >
                            ·
                          </span>
                          <span
                            style={{ fontSize: "0.6875rem", color: C.muted }}
                          >
                            {topic.questionCount} Qs
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: "0.875rem",
                              color: C.accent,
                            }}
                          >
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        {/* Bottom CTA */}
        <section
          style={{
            marginTop: "3.5rem",
            background: C.accentSubtle,
            border: `1px solid ${C.border}`,
            borderRadius: "1rem",
            padding: "2.25rem 2rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Reading isn't enough
          </h2>
          <p
            style={{
              color: C.muted,
              marginBottom: "1.5rem",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
            }}
          >
            The gap between knowing the answer and saying it under pressure is
            where interviews are won or lost.
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
              href="/auth"
              style={{
                padding: "0.6875rem 1.625rem",
                background: C.accent,
                color: "#ffffff",
                borderRadius: "0.625rem",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.9375rem",
              }}
            >
              Start Practicing Free →
            </Link>
            <Link
              href={`/blog/${track}`}
              style={{
                padding: "0.6875rem 1.5rem",
                background: C.bg,
                color: C.muted,
                border: `1px solid ${C.border}`,
                borderRadius: "0.625rem",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "0.9375rem",
              }}
            >
              Read the Blog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

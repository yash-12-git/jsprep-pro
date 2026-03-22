import Link from "next/link";
import { Layers, Newspaper, ArrowRight, Clock } from "lucide-react";
import { C, TOPIC_DIFF_COLOR } from "@/styles/tokens";
import { getPublishedBlogPosts, getPublishedTopics } from "@/lib/cachedQueries";

export default async function LearnSection() {
  const topics = await getPublishedTopics();
  const blogs = await getPublishedBlogPosts();

  const FEATURED_SLUGS = [
    "javascript-closure-interview-questions",
    "javascript-hoisting-interview-questions",
    "javascript-event-loop-interview-questions",
    "javascript-prototype-interview-questions",
    "javascript-this-keyword-interview-questions",
    "javascript-promise-interview-questions",
  ];

  const featuredTopics = topics
    .filter((t) => FEATURED_SLUGS.includes(t.slug))
    .slice(0, 4);

  const featuredPosts = blogs.slice(0, 3);

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* ── Topics ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.875rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 600,
            }}
          >
            <Layers size={15} color={C.green} />
            Interview Topics
          </div>

          <Link href="/topics" style={{ fontSize: "0.75rem", color: C.muted }}>
            All topics →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "0.5rem",
          }}
        >
          {featuredTopics.map((topic) => {
            const color = TOPIC_DIFF_COLOR[topic.difficulty] ?? C.amber;
            const shortTitle = topic.title
              .replace("JavaScript ", "")
              .replace(" Interview Questions", "");

            return (
              <Link
                key={topic.slug}
                href={`/${topic.slug}`}
                style={{
                  padding: "0.875rem",
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  textDecoration: "none",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: C.text }}>
                  {shortTitle}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    fontSize: "0.7rem",
                    marginTop: "4px",
                  }}
                >
                  <span style={{ color }}>{topic.difficulty}</span>
                  <span>·</span>
                  <span style={{ color: C.muted }}>
                    {topic.questionCount} Qs
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Blog ── */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.875rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 600,
            }}
          >
            <Newspaper size={15} color={C.accent} />
            From the Blog
          </div>

          <Link href="/blog" style={{ fontSize: "0.75rem", color: C.muted }}>
            All posts →
          </Link>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "3px",
                  height: "24px",
                  background: post.accentColor,
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", color: C.text }}>
                  {post.title}
                </div>

                <div
                  style={{
                    fontSize: "0.7rem",
                    color: C.muted,
                    marginTop: "2px",
                  }}
                >
                  <Clock size={10} /> {post.readTime} · {post.category}
                </div>
              </div>

              <ArrowRight size={13} color={C.muted} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

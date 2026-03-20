import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta, breadcrumbSchema } from "@/lib/seo/seo";

import type { Topic } from "@/types/topic";
import { C, TOPIC_DIFF_COLOR } from "@/styles/tokens";
import { getPublishedTopics } from "@/lib/cachedQueries";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "JavaScript Interview Topics — Practice by Concept | JSPrep Pro",
  description:
    "Browse all JavaScript interview topics organised by concept. Closures, event loop, promises, prototypes, and 30+ more — each with cheat sheets, interview tips, and practice questions.",
  path: "/topics",
  keywords: [
    "javascript interview topics",
    "javascript concepts interview",
    "js interview practice by topic",
    "javascript interview preparation guide",
  ],
});

// ─── Category accent colours ──────────────────────────────────────────────────
// Uses Notion's own category colour palette — calm, distinguishable, AA-contrast
// safe on a white background.
const CATEGORY_META: Record<
  string,
  { emoji: string; accent: string; description: string }
> = {
  "Core JS": {
    emoji: "🧱",
    accent: C.accent, // blue
    description: "Scope, hoisting, execution context, type coercion",
  },
  Functions: {
    emoji: "⚙️",
    accent: "#9065b0", // muted grape
    description: "Closures, arrow functions, currying, HOFs",
  },
  "Async JS": {
    emoji: "⚡",
    accent: C.green, // teal-green
    description: "Event loop, promises, async/await, timers",
  },
  Objects: {
    emoji: "🔷",
    accent: C.amber, // warm amber
    description: "Prototypes, classes, property descriptors",
  },
  Arrays: {
    emoji: "📋",
    accent: "#0d7377", // teal
    description: "map, filter, reduce, destructuring, immutability",
  },
  "Modern JS": {
    emoji: "✨",
    accent: "#ad1a72", // Notion pink/magenta
    description: "ES6+, modules, generators, proxy, Map/Set",
  },
  Performance: {
    emoji: "🚀",
    accent: C.orange, // orange-amber
    description: "Debounce, throttle, memory leaks, rendering",
  },
  "DOM & Events": {
    emoji: "🖥️",
    accent: "#2383e2", // blue (same as accent)
    description: "Event delegation, observers, rendering pipeline",
  },
  "Error Handling": {
    emoji: "🛡️",
    accent: C.red, // muted red
    description: "try/catch, custom errors, async error patterns",
  },
  "Browser APIs": {
    emoji: "🌐",
    accent: "#9065b0", // muted grape
    description: "Fetch, Web Workers, Service Workers, storage",
  },
};

const CATEGORY_ORDER = [
  "Core JS",
  "Functions",
  "Async JS",
  "Objects",
  "Arrays",
  "Modern JS",
  "Performance",
  "DOM & Events",
  "Error Handling",
  "Browser APIs",
];

function groupTopics(topics: Topic[]) {
  const groups: Record<string, Topic[]> = {};
  for (const cat of CATEGORY_ORDER) groups[cat] = [];
  for (const topic of topics) {
    if (groups[topic.category]) groups[topic.category].push(topic);
    else groups[topic.category] = [topic];
  }
  return groups;
}

export default async function TopicsPage() {
  const topics = await getPublishedTopics();
  const groups = groupTopics(topics);
  const totalTopics = topics.length;

  return (
    <div
      style={{
        backgroundColor: C.bg,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Topics", path: "/topics" },
          ]),
        }}
      />

      <div
        style={{
          maxWidth: "58rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 5rem",
          color: C.text
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
          <span style={{ color: C.muted }}>Topics</span>
        </nav>

        {/* Page header */}
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
            JavaScript Interview Topics
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
            {totalTopics} topics across every core JavaScript concept — each
            page includes a cheat sheet, interview tips you won't find on MDN,
            and practice questions.
          </p>

          {/* Stat row */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { n: totalTopics, label: "Topics" },
              { n: "90+", label: "Questions" },
              { n: Object.keys(CATEGORY_META).length, label: "Categories" },
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
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginTop: 3,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* Level legend */}
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

        {/* Topic sections */}
        <main style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {CATEGORY_ORDER.map((cat) => {
            const catTopics = groups[cat];
            if (!catTopics?.length) return null;
            const meta = CATEGORY_META[cat] ?? {
              emoji: "📌",
              accent: C.accent,
              description: "",
            };
            return (
              <section key={cat}>
                {/* Category header */}
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
                    {meta.emoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        color: C.text,
                        fontSize: "1rem",
                        fontWeight: 600,
                        margin: 0,
                        marginBottom: 2,
                      }}
                    >
                      {cat}
                    </h2>
                    <p
                      style={{
                        color: C.muted,
                        fontSize: "0.8125rem",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {meta.description}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      color: meta.accent,
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

                {/* Topic cards grid */}
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
                          transition: "border-color 0.15s ease",
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
                            .replace("JavaScript ", "")
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
                            style={{
                              fontSize: "0.6875rem",
                              color: C.muted,
                            }}
                          >
                            {topic.questionCount} Qs
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: "0.875rem",
                              color: meta.accent,
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
                display: "inline-block",
              }}
            >
              Start Practicing Free →
            </Link>
            <Link
              href="/blog"
              style={{
                padding: "0.6875rem 1.5rem",
                background: C.bg,
                color: C.muted,
                border: `1px solid ${C.border}`,
                borderRadius: "0.625rem",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "0.9375rem",
                display: "inline-block",
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

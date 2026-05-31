/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { css } from "@emotion/react";
import {
  Layers,
  Newspaper,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Database,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { C, RADIUS } from "@/styles/tokens";
import { seedTopicsFromArray } from "@/lib/topics";
import { seedBlogPostsFromArray } from "@/lib/blogPosts";

// ── Import static data ────────────────────────────────────────────────────────
import { TOPICS as STATIC_TOPICS } from "@/data/seo/topics";
import { BLOG_POSTS as STATIC_POSTS, REACT_BLOG_POSTS } from "@/data/seo/blogPosts";
import { REACT_TOPICS } from "@/data/seo/reactTopics";
import { revalidateTopics } from "@/lib/adminRevalidate";

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: css`
    max-width: 48rem;
  `,

  heading: css`
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 0.375rem;
  `,

  sub: css`
    color: ${C.muted};
    font-size: 0.875rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 38rem;
  `,

  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  `,

  card: (color: string, done: boolean) => css`
    background: ${C.card};
    border: 1px solid ${done ? color + "55" : C.border};
    border-radius: ${RADIUS.xl};
    padding: 1.25rem;
    position: relative;
    transition: border-color 0.2s;
  `,

  cardIcon: (color: string) => css`
    width: 2.25rem;
    height: 2.25rem;
    background: ${color}14;
    border: 1px solid ${color}30;
    border-radius: ${RADIUS.md};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  `,

  cardTitle: css`
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  `,

  cardCount: (color: string) => css`
    font-size: 1.875rem;
    font-weight: 900;
    color: ${color};
    line-height: 1;
    margin-bottom: 0.25rem;
  `,

  cardMeta: css`
    font-size: 0.75rem;
    color: ${C.muted};
  `,

  doneBadge: css`
    position: absolute;
    top: 0.875rem;
    right: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.5625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${C.accent3};
    background: ${C.accent3}14;
    border: 1px solid ${C.accent3}33;
    padding: 0.1875rem 0.5rem;
    border-radius: 0.25rem;
  `,

  warningBox: css`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: ${C.accent2}0d;
    border: 1px solid ${C.accent2}33;
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-size: 0.8125rem;
    color: ${C.accent2};
    line-height: 1.65;
    margin-bottom: 1.5rem;
  `,

  successBox: css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: ${C.accent3}0d;
    border: 1px solid ${C.accent3}33;
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: ${C.accent3};
    margin-bottom: 1.5rem;
  `,

  errorBox: css`
    background: ${C.danger}0d;
    border: 1px solid ${C.danger}33;
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-size: 0.8125rem;
    color: ${C.danger};
    margin-bottom: 1.5rem;
  `,

  sectionTitle: css`
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${C.muted};
    margin-bottom: 0.875rem;
  `,

  migrateBtn: (loading: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    background: ${loading ? C.accent + "80" : C.accent};
    border: none;
    border-radius: ${RADIUS.xl};
    color: white;
    font-weight: 800;
    font-size: 0.9375rem;
    cursor: ${loading ? "not-allowed" : "pointer"};
    transition: all 0.15s ease;
    &:hover {
      background: ${loading ? "" : C.accent + "ee"};
    }
  `,

  log: css`
    margin-top: 1.5rem;
    background: #0a0a10;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 1rem 1.25rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    line-height: 1.9;
    max-height: 16rem;
    overflow-y: auto;
  `,

  logLine: (type: "info" | "success" | "warn" | "error") => css`
    color: ${type === "success"
      ? C.accent3
      : type === "warn"
        ? C.accent2
        : type === "error"
          ? C.danger
          : C.muted};
  `,

  divider: css`
    border: none;
    border-top: 1px solid ${C.border};
    margin: 2rem 0;
  `,

  indexBox: css`
    background: #0a0a10;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.875rem 1rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    line-height: 1.9;
    color: ${C.text};
    overflow-x: auto;
    margin-top: 0.5rem;
  `,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogEntry {
  type: "info" | "success" | "warn" | "error";
  text: string;
}
interface DoneState {
  jsTopics?: boolean;
  blogs?: boolean;
  reactTopics?: boolean;
  reactBlogs?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MigratePage() {
  const { user } = useAuth();

  // Separate loading + log state for each section
  const [migratingJs, setMigratingJs] = useState(false);
  const [migratingReact, setMigratingReact] = useState(false);
  const [migratingReactBlogs, setMigratingReactBlogs] = useState(false);
  const [done, setDone] = useState<DoneState>({});
  const [jsLog, setJsLog] = useState<LogEntry[]>([]);
  const [reactLog, setReactLog] = useState<LogEntry[]>([]);
  const [reactBlogsLog, setReactBlogsLog] = useState<LogEntry[]>([]);

  function addJsLog(type: LogEntry["type"], text: string) {
    setJsLog((prev) => [...prev, { type, text }]);
  }
  function addReactLog(type: LogEntry["type"], text: string) {
    setReactLog((prev) => [...prev, { type, text }]);
  }
  function addReactBlogsLog(type: LogEntry["type"], text: string) {
    setReactBlogsLog((prev) => [...prev, { type, text }]);
  }

  // ── Section A: JS topics + blog posts (legacy, run once) ─────────────────
  async function handleMigrateJs() {
    if (!user) return;
    setMigratingJs(true);
    setJsLog([]);

    try {
      addJsLog("info", `── Migrating ${STATIC_TOPICS.length} JS topics ──────────────────────`);

      const topicsToSeed = STATIC_TOPICS.map((t, i) => ({
        ...t,
        track: "javascript" as const,
        status: "published" as const,
        order: i,
        relatedBlogSlugs: [] as string[],
      }));

      const { created: topicsCreated, errors: topicErrors } =
        await seedTopicsFromArray(topicsToSeed, user.uid);
      topicErrors.forEach((e) => addJsLog("error", `  ✗ ${e}`));
      addJsLog("success", `  ✓ ${topicsCreated} JS topics written to Firestore`);
      setDone((prev) => ({ ...prev, jsTopics: true }));

      addJsLog("info", `── Migrating ${STATIC_POSTS.length} blog posts ─────────────────`);

      const postsToSeed = STATIC_POSTS.map((p) => ({
        ...p,
        status: "published" as const,
        topicSlug: "",
        relatedTopicSlugs: [] as string[],
        questionCategories: [] as string[],
      }));

      const { created: postsCreated, errors: postErrors } =
        await seedBlogPostsFromArray(postsToSeed, user.uid);
      postErrors.forEach((e) => addJsLog("error", `  ✗ ${e}`));
      addJsLog("success", `  ✓ ${postsCreated} blog posts written to Firestore`);
      setDone((prev) => ({ ...prev, blogs: true }));

      addJsLog("info", "─────────────────────────────────────────────────");
      addJsLog("success", `🎉 Done! ${topicsCreated} topics + ${postsCreated} posts in Firestore.`);
      addJsLog("warn", "Next: open /admin/blog and set topicSlug on each post.");
    } catch (e: any) {
      addJsLog("error", `❌ ${e.message}`);
    } finally {
      setMigratingJs(false);
    }
  }

  // ── Section B: React topics (new full-content topics, safe to run per batch) ─
  async function handleMigrateReact() {
    if (!user) return;
    setMigratingReact(true);
    setReactLog([]);

    try {
      addReactLog("info", `── Migrating ${REACT_TOPICS.length} React topics ──────────────────`);
      REACT_TOPICS.forEach((t) => addReactLog("info", `  · ${t.slug}`));

      const { created, errors } = await seedTopicsFromArray(REACT_TOPICS, user.uid);
      errors.forEach((e) => addReactLog("error", `  ✗ ${e}`));
      addReactLog("success", `  ✓ ${created} React topics written to Firestore`);
      setDone((prev) => ({ ...prev, reactTopics: true }));
      await revalidateTopics()
      addReactLog("info", "─────────────────────────────────────────────────");
      addReactLog("success", "🎉 Done! Verify at /topics/react");
      addReactLog("warn", "If a shell topic already existed for this slug, delete the old one in Firebase Console → Firestore → topics.");
    } catch (e: any) {
      addReactLog("error", `❌ ${e.message}`);
    } finally {
      setMigratingReact(false);
    }
  }

  // ── Section C: React blog posts ───────────────────────────────────────────
  async function handleMigrateReactBlogs() {
    if (!user) return;
    setMigratingReactBlogs(true);
    setReactBlogsLog([]);

    try {
      addReactBlogsLog("info", `── Migrating ${REACT_BLOG_POSTS.length} React blog posts ──────────────`);
      REACT_BLOG_POSTS.forEach((p) => addReactBlogsLog("info", `  · ${p.slug}`));

      const postsToSeed = REACT_BLOG_POSTS.map((p) => ({
        ...p,
        status: "published" as const,
        topicSlug: "",
        relatedTopicSlugs: [] as string[],
        questionCategories: [] as string[],
      }));

      const { created, errors } = await seedBlogPostsFromArray(postsToSeed, user.uid);
      errors.forEach((e) => addReactBlogsLog("error", `  ✗ ${e}`));
      addReactBlogsLog("success", `  ✓ ${created} React blog posts written to Firestore`);
      setDone((prev) => ({ ...prev, reactBlogs: true }));
      addReactBlogsLog("info", "─────────────────────────────────────────────────");
      addReactBlogsLog("success", "🎉 Done! Verify at /blog/react");
      addReactBlogsLog("warn", "Next: open /admin/blog and set topicSlug on each post.");
    } catch (e: any) {
      addReactBlogsLog("error", `❌ ${e.message}`);
    } finally {
      setMigratingReactBlogs(false);
    }
  }

  return (
    <div css={S.page}>
      <h1 css={S.heading}>Migrate Content to Firestore</h1>
      <p css={S.sub}>
        Seed static <code style={{ color: C.accent3 }}>.ts</code> data files into
        Firestore. Each section is independent — run only the ones you need.
        Running a section twice creates duplicates; delete the old docs in Firebase
        Console first if you need to re-run.
      </p>

      {/* ── SECTION A: JS Topics + Blog Posts ──────────────────────────────── */}
      <div css={S.sectionTitle}>Section A — JavaScript Topics + Blog Posts</div>
      <p style={{ fontSize: "0.8125rem", color: C.muted, marginBottom: "1rem", lineHeight: 1.6 }}>
        Legacy migration. Run once. These are the 37 core JS topics and 12 blog posts
        from the original static data. If these are already in Firestore, skip this section.
      </p>

      <div css={S.grid}>
        {[
          {
            key: "jsTopics",
            label: "JS Topics",
            count: STATIC_TOPICS.length,
            Icon: Layers,
            color: C.accent,
            desc: "Core JS interview topics with cheat sheets",
          },
          {
            key: "blogs",
            label: "Blog Posts",
            count: STATIC_POSTS.length,
            Icon: Newspaper,
            color: C.purple,
            desc: "JavaScript deep-dive blog articles",
          },
        ].map(({ key, label, count, Icon, color, desc }) => (
          <div key={key} css={S.card(color, !!done[key as keyof DoneState])}>
            <div css={S.cardIcon(color)}>
              <Icon size={16} color={color} />
            </div>
            <div css={S.cardTitle}>{label}</div>
            <div css={S.cardCount(color)}>{count}</div>
            <div css={S.cardMeta}>{desc}</div>
            {done[key as keyof DoneState] && (
              <div css={S.doneBadge}>
                <CheckCircle2 size={9} /> Migrated
              </div>
            )}
          </div>
        ))}
      </div>

      <div css={S.warningBox}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Run once only.</strong> If JS topics are already in Firestore,
          skip this. Re-running creates duplicate docs.
        </span>
      </div>

      <button
        css={S.migrateBtn(migratingJs)}
        onClick={handleMigrateJs}
        disabled={migratingJs}
      >
        {migratingJs ? (
          <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Migrating JS…</>
        ) : (
          <><Database size={16} /> Migrate {STATIC_TOPICS.length + STATIC_POSTS.length} JS items</>
        )}
      </button>

      {jsLog.length > 0 && (
        <div css={S.log}>
          {jsLog.map((entry, i) => (
            <div key={i} css={S.logLine(entry.type)}>{entry.text}</div>
          ))}
          {migratingJs && (
            <div css={S.logLine("info")}>
              <Loader2 size={11} style={{ display: "inline", animation: "spin 1s linear infinite", marginRight: "0.25rem" }} />
              running…
            </div>
          )}
        </div>
      )}

      <hr css={S.divider} />

      {/* ── SECTION B: React Topics ─────────────────────────────────────────── */}
      <div css={S.sectionTitle}>Section B — React Topics (Full Concept Hub)</div>
      <p style={{ fontSize: "0.8125rem", color: C.muted, marginBottom: "1rem", lineHeight: 1.6 }}>
        New React topics written with all 8 sections: Mental Model, Deep Explanation,
        Common Mistakes, Real-World Usage, Cheat Sheet, Interview Tips, Questions, and
        Related Topics. Add topics to <code style={{ color: C.accent3 }}>src/data/seo/reactTopics.ts</code>,
        then run this to seed them. Each run only seeds the topics currently in the file.
      </p>

      <div css={S.grid}>
        <div css={S.card(C.accent3, !!done.reactTopics)}>
          <div css={S.cardIcon(C.accent3)}>
            <Layers size={16} color={C.accent3} />
          </div>
          <div css={S.cardTitle}>React Topics</div>
          <div css={S.cardCount(C.accent3)}>{REACT_TOPICS.length}</div>
          <div css={S.cardMeta}>
            {REACT_TOPICS.map((t) => t.keyword).join(", ")}
          </div>
          {done.reactTopics && (
            <div css={S.doneBadge}>
              <CheckCircle2 size={9} /> Migrated
            </div>
          )}
        </div>
      </div>

      <div css={S.warningBox}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Check for existing shells first.</strong> If a topic with this slug
          already exists in Firestore as a shell (created via admin panel), delete it
          in Firebase Console → Firestore → topics before running — otherwise you will
          have two docs for the same slug.
        </span>
      </div>

      {done.reactTopics && (
        <div css={S.successBox}>
          <CheckCircle2 size={18} />
          React topics seeded! Verify at{" "}
          <a href="/topics/react" style={{ color: C.accent3 }}>
            /topics/react
          </a>
        </div>
      )}

      <button
        css={S.migrateBtn(migratingReact)}
        onClick={handleMigrateReact}
        disabled={migratingReact}
      >
        {migratingReact ? (
          <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Seeding React Topics…</>
        ) : (
          <><Database size={16} /> Seed {REACT_TOPICS.length} React Topic{REACT_TOPICS.length !== 1 ? "s" : ""}</>
        )}
      </button>

      {reactLog.length > 0 && (
        <div css={S.log}>
          {reactLog.map((entry, i) => (
            <div key={i} css={S.logLine(entry.type)}>{entry.text}</div>
          ))}
          {migratingReact && (
            <div css={S.logLine("info")}>
              <Loader2 size={11} style={{ display: "inline", animation: "spin 1s linear infinite", marginRight: "0.25rem" }} />
              running…
            </div>
          )}
        </div>
      )}

      <hr css={S.divider} />

      {/* ── SECTION C: React Blog Posts ─────────────────────────────────────── */}
      <div css={S.sectionTitle}>Section C — React Blog Posts</div>
      <p style={{ fontSize: "0.8125rem", color: C.muted, marginBottom: "1rem", lineHeight: 1.6 }}>
        10 React interview blog posts (track: react). Seeded to <code style={{ color: C.accent3 }}>blog_posts</code> collection.
        After seeding, set <code style={{ color: C.accent3 }}>topicSlug</code> on each post via Admin → Blog.
      </p>

      <div css={S.grid}>
        <div css={S.card(C.purple, !!done.reactBlogs)}>
          <div css={S.cardIcon(C.purple)}>
            <Newspaper size={16} color={C.purple} />
          </div>
          <div css={S.cardTitle}>React Blog Posts</div>
          <div css={S.cardCount(C.purple)}>{REACT_BLOG_POSTS.length}</div>
          <div css={S.cardMeta}>
            {REACT_BLOG_POSTS.map((p) => p.slug).join(", ")}
          </div>
          {done.reactBlogs && (
            <div css={S.doneBadge}>
              <CheckCircle2 size={9} /> Migrated
            </div>
          )}
        </div>
      </div>

      <div css={S.warningBox}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Run once only.</strong> Re-running creates duplicate blog post docs. Check{" "}
          <code style={{ color: C.accent2 }}>blog_posts</code> in Firebase Console first.
        </span>
      </div>

      {done.reactBlogs && (
        <div css={S.successBox}>
          <CheckCircle2 size={18} />
          React blog posts seeded! Verify at{" "}
          <a href="/blog/react" style={{ color: C.accent3 }}>/blog/react</a>
        </div>
      )}

      <button
        css={S.migrateBtn(migratingReactBlogs)}
        onClick={handleMigrateReactBlogs}
        disabled={migratingReactBlogs}
      >
        {migratingReactBlogs ? (
          <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Seeding React Blogs…</>
        ) : (
          <><Database size={16} /> Seed {REACT_BLOG_POSTS.length} React Blog Posts</>
        )}
      </button>

      {reactBlogsLog.length > 0 && (
        <div css={S.log}>
          {reactBlogsLog.map((entry, i) => (
            <div key={i} css={S.logLine(entry.type)}>{entry.text}</div>
          ))}
          {migratingReactBlogs && (
            <div css={S.logLine("info")}>
              <Loader2 size={11} style={{ display: "inline", animation: "spin 1s linear infinite", marginRight: "0.25rem" }} />
              running…
            </div>
          )}
        </div>
      )}

      <hr css={S.divider} />

      {/* ── After migration notes ─────────────────────────────────────────── */}
      <div css={S.sectionTitle}>After seeding React topics</div>
      <ol style={{ paddingLeft: "1.25rem", fontSize: "0.875rem", lineHeight: 2.2, color: C.text }}>
        <li>
          Visit{" "}
          <a href="/react-useeffect-interview-questions" style={{ color: C.accent }}>
            /react-useeffect-interview-questions
          </a>{" "}
          to verify the Mental Model, Deep Explanation, Cheat Sheet, and all sections render correctly.
        </li>
        <li>
          Go to{" "}
          <a href="/admin/topics" style={{ color: C.accent }}>Admin → Topics</a>{" "}
          and confirm the new topic appears. If an old shell exists for the same slug, delete it.
        </li>
        <li>
          To add the next React topic: write the data in{" "}
          <code style={{ color: C.accent3 }}>src/data/seo/reactTopics.ts</code>,
          add it to the <code style={{ color: C.accent3 }}>REACT_TOPICS</code> array,
          then re-run Section B (only new slugs need seeding — check Firestore first to avoid duplicates).
        </li>
        <li>
          Firestore composite indexes required (if not already created):
          <pre css={S.indexBox}>
            {`Collection: topics
Index 1:  status ASC + order ASC
Index 2:  status ASC + track ASC + order ASC`}
          </pre>
        </li>
      </ol>
    </div>
  );
}

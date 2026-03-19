/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { C, RADIUS } from "@/styles/tokens";
import {
  PlusCircle,
  BookOpen,
  TrendingUp,
  Users,
  Eye,
  CheckCircle2,
  List,
  Layers,
  Newspaper,
  RefreshCw,
  Zap,
} from "lucide-react";

const S = {
  heading: css`
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 0.375rem;
  `,
  sub: css`
    color: ${C.muted};
    font-size: 0.875rem;
    margin-bottom: 2rem;
  `,

  statsGrid: css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2.5rem;
    @media (min-width: 640px) {
      grid-template-columns: repeat(4, 1fr);
    }
  `,

  statCard: css`
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 1.25rem;
  `,

  statIcon: (color: string) => css`
    width: 2rem;
    height: 2rem;
    background: ${color}14;
    border: 1px solid ${color}30;
    border-radius: ${RADIUS.md};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  `,

  statValue: (color: string) => css`
    font-size: 1.875rem;
    font-weight: 900;
    color: ${color};
  `,

  statLabel: css`
    font-size: 0.6875rem;
    font-weight: 700;
    color: ${C.muted};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.125rem;
  `,

  actionsGrid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
    }
  `,

  actionCard: (color: string) => css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    background: ${C.card};
    border: 1px solid ${color}33;
    border-radius: ${RADIUS.xl};
    text-decoration: none;
    color: white;
    transition: all 0.15s ease;
    &:hover {
      background: ${color}0d;
      border-color: ${color}55;
      transform: translateY(-1px);
    }
  `,

  actionTitle: css`
    font-size: 0.875rem;
    font-weight: 700;
  `,
  actionDesc: css`
    font-size: 0.75rem;
    color: ${C.muted};
  `,

  sectionTitle: css`
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 1rem;
  `,
};

interface Stats {
  total: number;
  published: number;
  draft: number;
  theory: number;
  output: number;
  debug: number;
  topics: number;
  blogPosts: number;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    draft: 0,
    theory: 0,
    output: 0,
    debug: 0,
    topics: 0,
    blogPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Load each collection independently — one missing/denied collection
      // should never zero out the others.
      const safeCount = async (
        col: string,
        filters?: Record<string, string>,
      ) => {
        try {
          const constraints = filters
            ? Object.entries(filters).map(([k, v]) => where(k, "==", v))
            : [];
          const snap = await getDocs(
            constraints.length
              ? query(collection(db, col), ...constraints)
              : collection(db, col),
          );
          return snap.docs.length;
        } catch (e: any) {
          console.warn(`[admin stats] ${col}:`, e.message);
          return -1; // -1 = failed to load (shown as "—" in UI)
        }
      };

      const [
        total,
        published,
        draft,
        theory,
        output,
        debug,
        topics,
        blogPosts,
      ] = await Promise.all([
        safeCount("questions"),
        safeCount("questions", { status: "published" }),
        safeCount("questions", { status: "draft" }),
        safeCount("questions", { type: "theory" }),
        safeCount("questions", { type: "output" }),
        safeCount("questions", { type: "debug" }),
        safeCount("topics"),
        safeCount("blog_posts"),
      ]);

      setStats({
        total,
        published,
        draft,
        theory,
        output,
        debug,
        topics,
        blogPosts,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 css={S.heading}>Admin Overview</h1>
      <p css={S.sub}>Manage all questions, tracks, and content from here.</p>

      {/* Stats */}
      <div css={S.statsGrid}>
        {[
          {
            label: "Total Questions",
            value: stats.total,
            icon: BookOpen,
            color: C.accent,
          },
          {
            label: "Published",
            value: stats.published,
            icon: CheckCircle2,
            color: C.accent3,
          },
          {
            label: "Topics",
            value: stats.topics,
            icon: Layers,
            color: C.purple,
          },
          {
            label: "Blog Posts",
            value: stats.blogPosts,
            icon: Newspaper,
            color: C.accent2,
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} css={S.statCard}>
            <div css={S.statIcon(color)}>
              <Icon size={15} color={color} />
            </div>
            <div css={S.statValue(color)}>
              {loading ? "…" : value < 0 ? "—" : value}
            </div>
            <div css={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 css={S.sectionTitle}>Quick Actions</h2>
      <div css={S.actionsGrid}>
        <Link href="/admin/questions/new" css={S.actionCard(C.accent)}>
          <PlusCircle size={20} color={C.accent} />
          <div css={S.actionTitle}>Add Question</div>
          <div css={S.actionDesc}>
            Create a theory, output, or debug question
          </div>
        </Link>
        <Link href="/admin/topics" css={S.actionCard(C.purple)}>
          <Layers size={20} color={C.purple} />
          <div css={S.actionTitle}>Manage Topics</div>
          <div css={S.actionDesc}>
            Edit topic pages, cheat sheets, interview tips
          </div>
        </Link>
        <Link href="/admin/blog" css={S.actionCard(C.accent2)}>
          <Newspaper size={20} color={C.accent2} />
          <div css={S.actionTitle}>Manage Blog</div>
          <div css={S.actionDesc}>Write posts, link them to topic pages</div>
        </Link>
        <Link href="/admin/migrate" css={S.actionCard(C.accent3)}>
          <RefreshCw size={20} color={C.accent3} />
          <div css={S.actionTitle}>Migrate Content</div>
          <div css={S.actionDesc}>
            Import static .ts topics + blog posts to Firestore
          </div>
        </Link>
        <Link href="/admin/questions" css={S.actionCard(C.muted)}>
          <List size={20} color={C.muted} />
          <div css={S.actionTitle}>All Questions</div>
          <div css={S.actionDesc}>Edit, delete, publish, archive questions</div>
        </Link>
        <Link href="/admin/seed" css={S.actionCard("rgba(255,255,255,0.2)")}>
          <Users size={20} color="rgba(255,255,255,0.4)" />
          <div css={S.actionTitle}>Seed Questions</div>
          <div css={S.actionDesc}>Migrate question .ts files to Firestore</div>
        </Link>
        <Link href="/admin/generate">
          {/* same card styling as existing cards */}
          <Zap size={20} color="#f7c76a" />
          <div>
            <p>Generate Questions</p>
            <p>
              AI pipeline · dedup check · approve to publish. Also shows the
              cron pending queue.
            </p>
          </div>
        </Link>
      </div>

      {/* Track stats */}
      <h2 css={S.sectionTitle}>Question Breakdown</h2>
      <div css={S.statsGrid}>
        {[
          { label: "Theory", value: stats.theory, color: C.accent },
          { label: "Output", value: stats.output, color: C.accent2 },
          { label: "Debug", value: stats.debug, color: C.danger },
          { label: "Coding", value: 0, color: C.purple },
        ].map(({ label, value, color }) => (
          <div key={label} css={S.statCard}>
            <div css={S.statValue(color)}>
              {loading ? "…" : value < 0 ? "—" : value}
            </div>
            <div css={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

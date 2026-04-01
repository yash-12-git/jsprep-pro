/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  getBlogPosts,
  deleteBlogPost,
  publishBlogPost,
  archiveBlogPost,
} from "@/lib/blogPosts";
import type { BlogPost } from "@/types/blogPost";
import { useTrack } from "@/contexts/TrackContext";

const S = {
  topRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  `,
  heading: css`
    font-size: 1.5rem;
    font-weight: 900;
  `,
  addBtn: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: ${C.accent};
    border: none;
    border-radius: ${RADIUS.xl};
    color: white;
    font-weight: 800;
    font-size: 0.875rem;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  `,
  searchBar: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 0.5rem 0.875rem;
    margin-bottom: 1rem;
    &:focus-within {
      border-color: ${C.accent}55;
    }
  `,
  searchInput: css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: white;
    &::placeholder {
      color: ${C.muted};
    }
  `,
  meta: css`
    font-size: 0.75rem;
    color: ${C.muted};
    margin-bottom: 0.875rem;
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
  `,
  th: css`
    text-align: left;
    font-size: 0.6875rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: ${C.muted};
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid ${C.border};
  `,
  tr: css`
    border-bottom: 1px solid ${C.border};
    &:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
  `,
  td: css`
    padding: 0.75rem;
    font-size: 0.8125rem;
    vertical-align: middle;
  `,
  badge: (color: string) => css`
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.5625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: ${color}14;
    border: 1px solid ${color}33;
    color: ${color};
  `,
  dot: (color: string) => css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${color};
    display: inline-block;
    margin-right: 0.375rem;
  `,
  actions: css`
    display: flex;
    gap: 0.375rem;
    align-items: center;
  `,
  iconBtn: (color: string) => css`
    display: flex;
    align-items: center;
    padding: 0.375rem;
    border-radius: ${RADIUS.sm};
    background: transparent;
    border: 1px solid ${color}33;
    color: ${color};
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      background: ${color}14;
    }
  `,
  empty: css`
    text-align: center;
    padding: 3rem;
    color: ${C.muted};
  `,
  linkWarn: css`
    font-size: 0.6875rem;
    color: ${C.accent2};
    background: ${C.accent2}0d;
    border: 1px solid ${C.accent2}25;
    border-radius: 0.25rem;
    padding: 0.1rem 0.5rem;
    margin-left: 0.375rem;
  `,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { track } = useTrack();

  async function load() {
    setLoading(true);
    try {
      const all = await getBlogPosts({ track });
      setPosts(all);
      setFiltered(all);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [track]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? posts.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              (p.topicSlug ?? "").toLowerCase().includes(q),
          )
        : posts,
    );
  }, [search, posts]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await deleteBlogPost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleToggleStatus(post: BlogPost) {
    if (post.status === "published") {
      await archiveBlogPost(post.id);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: "archived" } : p)),
      );
    } else {
      await publishBlogPost(post.id);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: "published" } : p)),
      );
    }
  }

  // Count posts that don't have a topicSlug (need linking)
  const unlinked = posts.filter(
    (p) => !p.topicSlug && p.status === "published",
  ).length;

  return (
    <div>
      <div css={S.topRow}>
        <div>
          <h1 css={S.heading}>Blog Posts</h1>
          {unlinked > 0 && (
            <p
              style={{
                fontSize: "0.75rem",
                color: C.accent2,
                marginTop: "0.25rem",
              }}
            >
              ⚠ {unlinked} published post{unlinked !== 1 ? "s" : ""} not linked
              to a topic — edit them to set topicSlug.
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={load}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 0.875rem",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: RADIUS.xl,
              color: C.muted,
              cursor: "pointer",
              fontSize: "0.8125rem",
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <Link href="/admin/blog/new" css={S.addBtn}>
            <PlusCircle size={15} /> New Post
          </Link>
        </div>
      </div>

      <div css={S.searchBar}>
        <Search size={15} color={C.muted} />
        <input
          css={S.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
        />
      </div>

      <div css={S.meta}>
        {loading ? "Loading…" : `${filtered.length} of ${posts.length} posts`}
      </div>

      {!loading && filtered.length === 0 ? (
        <div css={S.empty}>
          {posts.length === 0 ? (
            <>
              No posts yet.{" "}
              <Link href="/admin/migrate" style={{ color: C.accent }}>
                Run migration
              </Link>{" "}
              to import from static files.
            </>
          ) : (
            "No posts match your search."
          )}
        </div>
      ) : (
        <table css={S.table}>
          <thead>
            <tr>
              <th css={S.th}>Title</th>
              <th css={S.th}>Category</th>
              <th css={S.th}>Topic Link</th>
              <th css={S.th}>Status</th>
              <th css={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} css={S.tr}>
                <td css={S.td}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "white",
                      marginBottom: "0.1875rem",
                    }}
                  >
                    {p.title}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: C.muted }}>
                    {p.readTime} · {p.publishedAt}
                  </div>
                </td>
                <td css={S.td}>
                  <span css={S.badge(p.accentColor ?? C.accent)}>
                    {p.category}
                  </span>
                </td>
                <td css={S.td}>
                  {p.topicSlug ? (
                    <span css={S.badge(C.accent3)}>
                      {p.topicSlug
                        .replace("javascript-", "")
                        .replace("-interview-questions", "")}
                    </span>
                  ) : (
                    <span css={S.badge(C.muted)}>not linked</span>
                  )}
                  {p.relatedTopicSlugs?.length > 0 && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: C.muted,
                        marginLeft: "0.375rem",
                      }}
                    >
                      +{p.relatedTopicSlugs.length}
                    </span>
                  )}
                </td>
                <td css={S.td}>
                  <span
                    css={S.badge(
                      p.status === "published"
                        ? C.accent3
                        : p.status === "draft"
                          ? C.muted
                          : C.danger,
                    )}
                  >
                    {p.status}
                  </span>
                </td>
                <td css={S.td}>
                  <div css={S.actions}>
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      css={S.iconBtn(C.accent)}
                      title="View live"
                    >
                      <ExternalLink size={13} />
                    </Link>
                    <Link
                      href={`/admin/blog/${p.id}`}
                      css={S.iconBtn(C.accent2)}
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </Link>
                    <button
                      css={S.iconBtn(
                        p.status === "published" ? C.muted : C.accent3,
                      )}
                      onClick={() => handleToggleStatus(p)}
                      title={p.status === "published" ? "Unpublish" : "Publish"}
                    >
                      {p.status === "published" ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                    </button>
                    <button
                      css={S.iconBtn(C.danger)}
                      onClick={() => handleDelete(p.id, p.title)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

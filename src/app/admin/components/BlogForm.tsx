/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Save, Loader2, Trash2, CheckCircle, X, Plus } from "lucide-react";
import { C, RADIUS, BP } from "@/styles/tokens";
import MarkdownEditor from "@/components/md/MarkdownEditor";
import type { BlogPost, BlogPostInput, BlogStatus } from "@/types/blogPost";
import type { Topic } from "@/types/topic";
import { getPublishedTopics } from "@/lib/topics";

export type FormMode = "create" | "edit";

interface Props {
  mode: FormMode;
  initial?: Partial<BlogPost>;
  onSubmit: (data: BlogPostInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  wrap: css`
    max-width: 52rem;
  `,

  row: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
    @media (min-width: ${BP.sm}) {
      grid-template-columns: 1fr 1fr;
    }
  `,

  row3: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
    @media (min-width: ${BP.sm}) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  `,

  field: css`
    margin-bottom: 1.25rem;
  `,

  label: css`
    display: block;
    font-size: 0.6875rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: ${C.muted};
    margin-bottom: 0.375rem;
  `,

  labelNote: css`
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    color: ${C.muted};
    margin-left: 0.5rem;
  `,

  required: css`
    color: ${C.danger};
    margin-left: 0.125rem;
  `,

  input: css`
    width: 100%;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: white;
    outline: none;
    transition: border-color 0.15s ease;
    &:focus {
      border-color: ${C.accent}55;
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.2);
    }
  `,

  select: css`
    width: 100%;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: white;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='rgba(255,255,255,0.4)' stroke-width='1.5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.875rem center;
    &:focus {
      border-color: ${C.accent}55;
    }
    option {
      background: ${C.card};
    }
  `,

  textarea: css`
    width: 100%;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: white;
    outline: none;
    resize: vertical;
    &:focus {
      border-color: ${C.accent}55;
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.2);
    }
  `,

  divider: css`
    border: none;
    border-top: 1px solid ${C.border};
    margin: 1.5rem 0;
  `,

  sectionLabel: css`
    font-size: 0.6875rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${C.muted};
    margin-bottom: 1rem;
  `,

  // Multi-select topics list
  topicsGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
    gap: 0.5rem;
  `,

  topicChip: (selected: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: ${selected ? C.accent + "18" : "transparent"};
    border: 1px solid ${selected ? C.accent + "55" : C.border};
    border-radius: ${RADIUS.md};
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover {
      border-color: ${C.accent + "44"};
    }
  `,

  topicChipText: css`
    font-size: 0.8125rem;
    color: white;
  `,
  topicChipMeta: css`
    font-size: 0.6875rem;
    color: ${C.muted};
  `,

  // Tags input for question categories
  tagsInput: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.5rem 0.75rem;
    &:focus-within {
      border-color: ${C.accent}55;
    }
  `,

  tag: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: ${C.accent}18;
    border: 1px solid ${C.accent}33;
    color: ${C.accent};
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    &:hover {
      background: ${C.danger}18;
      border-color: ${C.danger}33;
      color: ${C.danger};
    }
  `,

  tagInput: css`
    flex: 1;
    min-width: 8rem;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: white;
    &::placeholder {
      color: rgba(255, 255, 255, 0.2);
    }
  `,

  toggle: (active: boolean, color: string) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    border-radius: ${RADIUS.md};
    font-size: 0.75rem;
    font-weight: 700;
    border: 1px solid ${active ? color + "55" : C.border};
    background: ${active ? color + "14" : "transparent"};
    color: ${active ? color : C.muted};
    cursor: pointer;
    transition: all 0.15s ease;
  `,

  footer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${C.border};
    margin-top: 1.5rem;
  `,

  submitBtn: (loading: boolean) => css`
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
    &:hover {
      background: ${loading ? "" : C.accent + "ee"};
    }
  `,

  deleteBtn: css`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.625rem 1rem;
    background: transparent;
    border: 1px solid ${C.danger}44;
    border-radius: ${RADIUS.xl};
    color: ${C.danger};
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      background: ${C.danger}12;
    }
  `,

  success: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    background: ${C.accent3}12;
    border: 1px solid ${C.accent3}33;
    border-radius: ${RADIUS.xl};
    color: ${C.accent3};
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  `,

  error: css`
    padding: 0.875rem 1.25rem;
    background: ${C.danger}12;
    border: 1px solid ${C.danger}33;
    border-radius: ${RADIUS.xl};
    color: ${C.danger};
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  `,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY: BlogPostInput = {
  slug: "",
  title: "",
  excerpt: "",
  category: "Deep Dive",
  accentColor: "#7c6af7",
  readTime: "5 min read",
  publishedAt: new Date().toISOString().slice(0, 10),
  modifiedAt: new Date().toISOString().slice(0, 10),
  keywords: [],
  content: "",
  topicSlug: "",
  relatedTopicSlugs: [],
  questionCategories: [],
  status: "draft",
};

const ACCENT_PRESETS = [
  "#7c6af7",
  "#6af7c0",
  "#f7c76a",
  "#f76a6a",
  "#60a5fa",
  "#a78bfa",
];

const CATEGORIES = [
  "Deep Dive",
  "Interview Prep",
  "Core Concepts",
  "Modern JS",
  "Best Practices",
  "Practice",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlogForm({
  mode,
  initial = {},
  onSubmit,
  onDelete,
}: Props) {
  const [form, setForm] = useState<BlogPostInput>({ ...EMPTY, ...initial });
  const [catInput, setCatInput] = useState("");
  const [kwInput, setKwInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    getPublishedTopics()
      .then(setTopics)
      .catch(() => {});
  }, []);

  function set<K extends keyof BlogPostInput>(key: K, val: BlogPostInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === "title" && mode === "create") {
        next.slug = slugify(val as string);
      }
      return next;
    });
  }

  function toggleRelatedTopic(slug: string) {
    const current = form.relatedTopicSlugs;
    set(
      "relatedTopicSlugs",
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug],
    );
  }

  function addCat(cat: string) {
    const c = cat.trim();
    if (c && !form.questionCategories.includes(c)) {
      set("questionCategories", [...form.questionCategories, c]);
    }
    setCatInput("");
  }

  function removeCat(c: string) {
    set(
      "questionCategories",
      form.questionCategories.filter((x) => x !== c),
    );
  }

  function addKeyword(kw: string) {
    const k = kw.trim().toLowerCase();
    if (k && !form.keywords.includes(k)) set("keywords", [...form.keywords, k]);
    setKwInput("");
  }

  function removeKeyword(k: string) {
    set(
      "keywords",
      form.keywords.filter((x) => x !== k),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.excerpt.trim()) {
      setError("Excerpt is required");
      return;
    }
    if (!form.content.trim()) {
      setError("Content is required");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Auto-sync: ensure primary topic is always in relatedTopicSlugs.
      // getBlogPostsForTopic queries relatedTopicSlugs — primary topic alone does nothing.
      const syncedRelated =
        form.topicSlug && !form.relatedTopicSlugs.includes(form.topicSlug)
          ? [form.topicSlug, ...form.relatedTopicSlugs]
          : form.relatedTopicSlugs;
      await onSubmit({ ...form, relatedTopicSlugs: syncedRelated });
      setSuccess(true);
      if (mode === "create") setForm(EMPTY);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || !showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    setDeleting(true);
    try {
      await onDelete();
    } catch (e: any) {
      setError(e.message);
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} css={S.wrap}>
      {success && (
        <div css={S.success}>
          <CheckCircle size={16} />{" "}
          {mode === "create" ? "Post created!" : "Changes saved!"}
        </div>
      )}
      {error && <div css={S.error}>{error}</div>}

      {/* ── Identity ── */}
      <div css={S.sectionLabel}>Identity</div>

      <div css={S.field}>
        <label css={S.label}>
          Title <span css={S.required}>*</span>
        </label>
        <input
          css={S.input}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="JavaScript Event Loop Explained Visually"
        />
      </div>

      <div css={S.row}>
        <div>
          <label css={S.label}>Slug (URL)</label>
          <input
            css={S.input}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-generated from title"
          />
        </div>
        <div>
          <label css={S.label}>Category</label>
          <select
            css={S.select}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div css={S.field}>
        <label css={S.label}>
          Excerpt <span css={S.required}>*</span>
        </label>
        <textarea
          css={S.textarea}
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          placeholder="One or two sentences shown on listing pages and used as meta description."
        />
      </div>

      <div css={S.row3}>
        <div>
          <label css={S.label}>Read Time</label>
          <input
            css={S.input}
            value={form.readTime}
            onChange={(e) => set("readTime", e.target.value)}
            placeholder="8 min read"
          />
        </div>
        <div>
          <label css={S.label}>Published</label>
          <input
            css={S.input}
            type="date"
            value={form.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
          />
        </div>
        <div>
          <label css={S.label}>Last Modified</label>
          <input
            css={S.input}
            type="date"
            value={form.modifiedAt}
            onChange={(e) => set("modifiedAt", e.target.value)}
          />
        </div>
      </div>

      {/* Accent color */}
      <div css={S.field}>
        <label css={S.label}>Accent Color</label>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("accentColor", c)}
              style={{
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "50%",
                background: c,
                border:
                  form.accentColor === c
                    ? `3px solid white`
                    : `2px solid transparent`,
                cursor: "pointer",
                transition: "border 0.1s",
              }}
            />
          ))}
          <input
            css={[S.input, { width: "7rem" }]}
            value={form.accentColor}
            onChange={(e) => set("accentColor", e.target.value)}
            placeholder="#7c6af7"
          />
        </div>
      </div>

      {/* Status */}
      <div css={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          css={S.toggle(form.status === "published", C.accent3)}
          onClick={() =>
            set("status", form.status === "published" ? "draft" : "published")
          }
        >
          {form.status === "published" ? "✓ Published" : "○ Draft"}
        </button>
        <select
          css={[
            S.select,
            { width: "auto", padding: "0.375rem 2rem 0.375rem 0.75rem" },
          ]}
          value={form.status}
          onChange={(e) => set("status", e.target.value as BlogStatus)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <hr css={S.divider} />

      {/* ── Linking (the key new section) ── */}
      <div css={S.sectionLabel}>
        Topic Linking — connects this post to topic pages
      </div>

      {/* Primary topic */}
      <div css={S.field}>
        <label css={S.label}>
          Primary Topic
          <span css={S.labelNote}>
            — shown as "Read More" on this topic's page
          </span>
        </label>
        <select
          css={S.select}
          value={form.topicSlug ?? ""}
          onChange={(e) => set("topicSlug", e.target.value)}
        >
          <option value="">No primary topic</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.keyword} — {t.category}
            </option>
          ))}
        </select>
      </div>

      {/* Related topics multi-select */}
      <div css={S.field}>
        <label css={S.label}>
          Related Topics
          <span css={S.labelNote}>
            — shown in "Practice These Topics" sidebar
          </span>
        </label>
        {topics.length === 0 ? (
          <p style={{ fontSize: "0.8125rem", color: C.muted }}>
            No topics found.{" "}
            <a href="/admin/migrate" style={{ color: C.accent }}>
              Run migration
            </a>{" "}
            first.
          </p>
        ) : (
          <div css={S.topicsGrid}>
            {topics.map((t) => {
              const selected = form.relatedTopicSlugs.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  css={S.topicChip(selected)}
                  onClick={() => toggleRelatedTopic(t.slug)}
                >
                  <div>
                    <div css={S.topicChipText}>{t.keyword}</div>
                    <div css={S.topicChipMeta}>{t.category}</div>
                  </div>
                  {selected && (
                    <X
                      size={12}
                      style={{
                        marginLeft: "auto",
                        color: C.accent,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Question categories — for future sidebar question linking */}
      <div css={S.field}>
        <label css={S.label}>
          Question Categories
          <span css={S.labelNote}>— pull related questions into sidebar</span>
        </label>
        <div css={S.tagsInput}>
          {form.questionCategories.map((c) => (
            <span key={c} css={S.tag} onClick={() => removeCat(c)}>
              {c} ×
            </span>
          ))}
          <input
            css={S.tagInput}
            value={catInput}
            onChange={(e) => setCatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addCat(catInput);
              }
            }}
            placeholder="Functions, Async JS… (Enter to add)"
          />
        </div>
      </div>

      <hr css={S.divider} />

      {/* ── Content ── */}
      <div css={S.sectionLabel}>Content</div>

      <div css={S.field}>
        <MarkdownEditor
          label="Article Content (Markdown)"
          value={form.content}
          onChange={(v) => set("content", v)}
          rows={20}
          placeholder={`# Your Article Title\n\nIntro paragraph…\n\n## Section 1\n\nContent…\n\n\`\`\`js\nconst example = 'code'\n\`\`\``}
        />
      </div>

      {/* SEO Keywords */}
      <div css={S.field}>
        <label css={S.label}>SEO Keywords</label>
        <div css={S.tagsInput}>
          {form.keywords.map((k) => (
            <span key={k} css={S.tag} onClick={() => removeKeyword(k)}>
              {k} ×
            </span>
          ))}
          <input
            css={S.tagInput}
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addKeyword(kwInput);
              }
              if (e.key === "Backspace" && !kwInput && form.keywords.length)
                removeKeyword(form.keywords[form.keywords.length - 1]);
            }}
            placeholder="javascript event loop, call stack… (Enter to add)"
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div css={S.footer}>
        <div css={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {onDelete && (
            <button
              type="button"
              css={S.deleteBtn}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Trash2 size={14} />
              )}
              {showDeleteConfirm ? "Confirm delete?" : "Delete"}
            </button>
          )}
          {showDeleteConfirm && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                fontSize: "0.75rem",
                color: C.muted,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <button type="submit" css={S.submitBtn(saving)} disabled={saving}>
          {saving ? (
            <>
              <Loader2
                size={16}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />{" "}
              {mode === "create" ? "Create Post" : "Save Changes"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { css } from "@emotion/react";
import { Save, Loader2, Trash2, CheckCircle, Plus, X } from "lucide-react";
import { C, RADIUS, BP } from "@/styles/tokens";
import type {
  Topic,
  TopicInput,
  TopicDifficulty,
  TopicStatus,
} from "@/types/topic";
import { useTrack } from "@/contexts/TrackContext";

export type FormMode = "create" | "edit";

interface Props {
  mode: FormMode;
  initial?: Partial<Topic>;
  onSubmit: (data: TopicInput) => Promise<void>;
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

  // Array field — bullets editor
  arrayField: css`
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.625rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    &:focus-within {
      border-color: ${C.accent}55;
    }
  `,

  arrayItem: css`
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  `,

  arrayInput: css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.8125rem;
    color: white;
    padding: 0.25rem 0;
    resize: none;
    line-height: 1.5;
    &::placeholder {
      color: rgba(255, 255, 255, 0.2);
    }
  `,

  removeBtn: css`
    flex-shrink: 0;
    padding: 0.1875rem;
    margin-top: 0.25rem;
    background: none;
    border: none;
    color: ${C.muted};
    cursor: pointer;
    border-radius: 0.25rem;
    transition: color 0.15s;
    &:hover {
      color: ${C.danger};
    }
  `,

  addItemBtn: css`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.5rem;
    padding: 0.3125rem 0.625rem;
    background: none;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: ${RADIUS.sm};
    color: ${C.muted};
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      border-color: ${C.accent}55;
      color: ${C.accent};
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

const EMPTY: TopicInput = {
  slug: "",
  title: "",
  category: "",
  keyword: "",
  description: "",
  extraKeywords: [],
  difficulty: "Intermediate",
  questionCount: "4–8",
  cheatSheet: [""],
  interviewTips: [""],
  related: [],
  relatedBlogSlugs: [],
  status: "draft",
  order: 0,
  mentalModel: "",
  deepDive: "",
  misconceptions: [],
  realWorldExamples: [],
  track: "javascript",
};

// ─── Array editor — reusable for cheatSheet, interviewTips, related, etc ───────

function ArrayEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  function update(i: number, v: string) {
    const next = [...values];
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...values, ""]);
  }

  return (
    <div css={S.field}>
      <label css={S.label}>{label}</label>
      <div css={S.arrayField}>
        {values.map((v, i) => (
          <div key={i} css={S.arrayItem}>
            <textarea
              css={S.arrayInput}
              rows={1}
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder ?? "Enter text…"}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }}
            />
            <button type="button" css={S.removeBtn} onClick={() => remove(i)}>
              <X size={13} />
            </button>
          </div>
        ))}
        <button type="button" css={S.addItemBtn} onClick={add}>
          <Plus size={12} /> Add item
        </button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TopicForm({
  mode,
  initial = {},
  onSubmit,
  onDelete,
}: Props) {
  const [form, setForm] = useState<TopicInput>({ ...EMPTY, ...initial });
  const { track } = useTrack();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function set<K extends keyof TopicInput>(key: K, val: TopicInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === "keyword" && mode === "create") {
        next.slug = `${track}-${slugify(val as string)}-interview-questions`;
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required");
      return;
    }
    if (!form.keyword.trim()) {
      setError("Keyword is required");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSubmit({
        ...form,
        // Remove empty strings from arrays
        cheatSheet: form.cheatSheet.filter((s) => s.trim()),
        interviewTips: form.interviewTips.filter((s) => s.trim()),
        related: form.related.filter((s) => s.trim()),
        relatedBlogSlugs: (form.relatedBlogSlugs ?? []).filter((s) => s.trim()),
        extraKeywords: (form.extraKeywords ?? []).filter((s) => s.trim()),
        track: track,
      });
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
          {mode === "create" ? "Topic created!" : "Changes saved!"}
        </div>
      )}
      {error && <div css={S.error}>{error}</div>}

      {/* ── Identity ── */}
      <div css={S.sectionLabel}>Identity</div>

      <div css={S.row}>
        <div>
          <label css={S.label}>
            Keyword <span css={S.required}>*</span>
            <span css={S.labelNote}>e.g. closure, hoisting</span>
          </label>
          <input
            css={S.input}
            value={form.keyword}
            onChange={(e) => set("keyword", e.target.value)}
            placeholder="closure"
          />
        </div>
        <div>
          <label css={S.label}>
            Category <span css={S.required}>*</span>
            <span css={S.labelNote}>matches Question.category</span>
          </label>
          <input
            css={S.input}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Functions"
          />
        </div>
      </div>

      <div css={S.field}>
        <label css={S.label}>
          Title <span css={S.required}>*</span>
        </label>
        <input
          css={S.input}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="JavaScript Closure Interview Questions"
        />
      </div>

      <div css={S.row}>
        <div>
          <label css={S.label}>Slug (URL)</label>
          <input
            css={S.input}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-generated from keyword"
          />
        </div>
        <div>
          <label css={S.label}>
            Question Count<span css={S.labelNote}>display only</span>
          </label>
          <input
            css={S.input}
            value={form.questionCount}
            onChange={(e) => set("questionCount", e.target.value)}
            placeholder="8–12"
          />
        </div>
      </div>

      <div css={S.field}>
        <label css={S.label}>
          Description <span css={S.required}>*</span>
        </label>
        <textarea
          css={S.textarea}
          rows={2}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="One-line description shown under the H1 + used in meta."
        />
      </div>

      <div css={S.row3}>
        <div>
          <label css={S.label}>Difficulty</label>
          <select
            css={S.select}
            value={form.difficulty}
            onChange={(e) =>
              set("difficulty", e.target.value as TopicDifficulty)
            }
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
        <div>
          <label css={S.label}>Status</label>
          <select
            css={S.select}
            value={form.status}
            onChange={(e) => set("status", e.target.value as TopicStatus)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label css={S.label}>Sort Order</label>
          <input
            css={S.input}
            type="number"
            min={0}
            value={form.order ?? 0}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </div>
      </div>

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
      </div>

      <hr css={S.divider} />

      {/* ── Content ── */}
      <div css={S.sectionLabel}>Content</div>

      <ArrayEditor
        label="Cheat Sheet Bullets *"
        values={form.cheatSheet}
        onChange={(v) => set("cheatSheet", v)}
        placeholder="Key fact or concept to know for this topic…"
      />

      <ArrayEditor
        label="Interview Tips *"
        values={form.interviewTips}
        onChange={(v) => set("interviewTips", v)}
        placeholder="How to explain this well in an interview…"
      />

      <hr css={S.divider} />

      {/* ── Concept Hub (optional — the "best explanation on the internet" layer) ── */}
      <div css={S.sectionLabel}>
        Concept Hub{" "}
        <span style={{ fontWeight: 400, fontSize: "0.75rem", opacity: 0.5 }}>
          (optional — fills in the deep explanation sections)
        </span>
      </div>

      <div>
        <label css={S.label}>
          Mental Model
          <span css={S.labelNote}>
            One analogy that makes the concept instantly click. e.g. "A closure
            is like a backpack…"
          </span>
        </label>
        <textarea
          css={S.textarea}
          rows={3}
          value={form.mentalModel ?? ""}
          onChange={(e) => set("mentalModel", e.target.value)}
          placeholder="When you create a function inside another function, JavaScript gives it a backpack. It packs up every variable it can see and carries it everywhere, even after the outer function is gone."
        />
      </div>

      <div>
        <label css={S.label}>
          Deep Explanation (HTML)
          <span css={S.labelNote}>
            Full explanation with code examples. Use &lt;h3&gt;, &lt;p&gt;,
            &lt;pre&gt;&lt;code&gt; tags.
          </span>
        </label>
        <textarea
          css={S.textarea}
          rows={12}
          value={form.deepDive ?? ""}
          onChange={(e) => set("deepDive", e.target.value)}
          placeholder="<h3>Why closures exist</h3><p>JavaScript uses lexical scoping…</p><pre><code>function outer() { … }</code></pre>"
        />
      </div>

      <ArrayEditor
        label="Common Misconceptions"
        values={form.misconceptions ?? []}
        onChange={(v) => set("misconceptions", v)}
        placeholder="Many devs think closures copy the variable value — but they hold a reference. If the variable changes, the closure sees the new value."
      />

      <ArrayEditor
        label="Real-World Examples"
        values={form.realWorldExamples ?? []}
        onChange={(v) => set("realWorldExamples", v)}
        placeholder="React's useState hook — the updater function closes over the current state value, which is why stale closures happen in useEffect."
      />

      <hr css={S.divider} />

      {/* ── Linking ── */}
      <div css={S.sectionLabel}>Linking</div>

      <ArrayEditor
        label="Related Topic Slugs"
        values={form.related}
        onChange={(v) => set("related", v)}
        placeholder="javascript-scope-interview-questions"
      />

      <ArrayEditor
        label="Extra Keywords (SEO)"
        values={form.extraKeywords ?? []}
        onChange={(v) => set("extraKeywords", v)}
        placeholder="lexical scope, IIFE, closure in loop"
      />

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
              {mode === "create" ? "Create Topic" : "Save Changes"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

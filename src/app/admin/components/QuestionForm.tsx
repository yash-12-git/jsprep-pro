/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import {
  Save,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  CheckCircle,
  Building2,
} from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import MarkdownEditor from "@/components/md/MarkdownEditor";
import MarkdownRenderer from "@/components/md/MarkdownRenderer";
import type {
  Question,
  QuestionInput,
  QuestionType,
  Difficulty,
  Track,
  QuestionStatus,
} from "@/types/question";
import { getPublishedTopics } from "@/lib/topics";
import type { Topic } from "@/types/topic";

export type FormMode = "create" | "edit";

interface Props {
  mode: FormMode;
  initial?: Partial<Question>;
  onSubmit: (data: QuestionInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const ALL_COMPANIES = [
  "Razorpay",
  "Flipkart",
  "Swiggy",
  "Zomato",
  "CRED",
  "PhonePe",
  "Google",
  "Atlassian",
  "Amazon",
  "Microsoft",
  "Meesho",
  "Paytm",
  "ShareChat",
  "Uber",
];

const EMPTY: QuestionInput = {
  slug: "",
  type: "theory",
  track: "javascript",
  title: "",
  question: "",
  answer: "",
  hint: "",
  explanation: "",
  keyInsight: "",
  code: "",
  category: "",
  tags: [],
  companies: [],
  difficulty: "core",
  expectedOutput: "",
  brokenCode: "",
  fixedCode: "",
  bugDescription: "",
  status: "draft",
  isPro: false,
  order: 0,
  topicSlug: "",
  relatedBlogSlugs: [],
};

const S = {
  wrap: css`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 56rem;
  `,
  success: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    background: ${C.greenSubtle};
    border: 1px solid ${C.greenBorder};
    border-radius: ${RADIUS.lg};
    color: ${C.green};
    font-size: 0.875rem;
    font-weight: 600;
  `,
  error: css`
    padding: 0.875rem 1rem;
    background: ${C.redSubtle};
    border: 1px solid ${C.redBorder};
    border-radius: ${RADIUS.lg};
    color: ${C.red};
    font-size: 0.875rem;
  `,
  sectionLabel: css`
    font-size: 0.6875rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${C.muted};
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${C.border};
  `,
  field: css`
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  `,
  label: css`
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${C.text};
  `,
  required: css`
    color: ${C.red};
    margin-left: 2px;
  `,
  labelHint: css`
    font-size: 0.75rem;
    color: ${C.muted};
    line-height: 1.5;
  `,
  row: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  `,
  input: css`
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    background: ${C.surface};
    color: ${C.text};
    font-size: 0.875rem;
    font-family: inherit;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: ${C.accent};
    }
  `,
  select: css`
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    background: ${C.surface};
    color: ${C.text};
    font-size: 0.875rem;
    cursor: pointer;
    &:focus {
      outline: none;
      border-color: ${C.accent};
    }
  `,
  textarea: css`
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    background: ${C.surface};
    color: ${C.text};
    font-size: 0.875rem;
    font-family: "JetBrains Mono", monospace;
    resize: vertical;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: ${C.accent};
    }
  `,
  tagsInput: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.5rem 0.75rem;
    min-height: 2.5rem;
    align-items: center;
    &:focus-within {
      border-color: ${C.accent};
    }
  `,
  tag: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background: ${C.bgSubtle};
    border: 1px solid ${C.border};
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${C.text};
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  `,
  tagInput: css`
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.8125rem;
    color: ${C.text};
    flex: 1;
    min-width: 8rem;
    font-family: inherit;
  `,
  companiesGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.5rem;
  `,
  companyBtn: (active: boolean) => css`
    padding: 0.375rem 0.625rem;
    border-radius: ${RADIUS.md};
    border: 1px solid ${active ? C.accent : C.border};
    background: ${active ? C.accent + "14" : C.surface};
    color: ${active ? C.accent : C.muted};
    font-size: 0.75rem;
    font-weight: ${active ? "600" : "400"};
    cursor: pointer;
    text-align: left;
    transition: all 0.1s;
    &:hover {
      border-color: ${C.accent};
      color: ${C.accent};
    }
  `,
  sandboxNote: css`
    padding: 0.75rem 1rem;
    background: ${C.amberSubtle};
    border: 1px solid ${C.amberBorder};
    border-radius: ${RADIUS.md};
    font-size: 0.8125rem;
    color: ${C.amber};
    line-height: 1.6;
  `,
  divider: css`
    border: none;
    border-top: 1px solid ${C.border};
    margin: 0;
  `,
  actions: css`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    align-items: center;
  `,
  saveBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.5rem;
    background: ${C.accent};
    border: none;
    border-radius: ${RADIUS.xl};
    color: white;
    font-weight: 700;
    font-size: 0.9375rem;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  delBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border: 1px solid ${C.redBorder};
    border-radius: ${RADIUS.xl};
    background: transparent;
    color: ${C.red};
    font-size: 0.875rem;
    cursor: pointer;
    margin-left: auto;
    &:hover {
      background: ${C.redSubtle};
    }
  `,
  previewToggle: css`
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    background: transparent;
    color: ${C.muted};
    font-size: 0.8125rem;
    cursor: pointer;
    &:hover {
      border-color: ${C.accent};
      color: ${C.accent};
    }
  `,
  proBtn: (active: boolean) => css`
    padding: 0.5rem 1rem;
    border-radius: ${RADIUS.xl};
    border: 1px solid ${active ? C.accent : C.border};
    background: ${active ? C.accent + "14" : "transparent"};
    color: ${active ? C.accent : C.muted};
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
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
    transition: all 0.1s;
    &:hover {
      border-color: ${color};
      color: ${color};
    }
  `,
};

export default function QuestionForm({
  mode,
  initial,
  onSubmit,
  onDelete,
}: Props) {
  const [form, setForm] = useState<QuestionInput>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    getPublishedTopics()
      .then(setTopics)
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (initial) setForm((f) => ({ ...f, ...initial }));
  }, [initial]);

  function set<K extends keyof QuestionInput>(key: K, val: QuestionInput[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setSuccess(false);
  }

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  }
  function removeTag(tag: string) {
    set(
      "tags",
      form.tags.filter((t) => t !== tag),
    );
  }

  const selectedCompanies: string[] = (form as any).companies ?? [];
  function toggleCompany(c: string) {
    const next = selectedCompanies.includes(c)
      ? selectedCompanies.filter((x) => x !== c)
      : [...selectedCompanies, c];
    set("companies" as any, next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.answer.trim()) {
      setError("Answer is required");
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required");
      return;
    }
    if (!form.slug.trim()) {
      form.slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
      setSuccess(true);
      if (mode === "create") setForm({ ...EMPTY });
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || !confirm("Delete this question? This cannot be undone."))
      return;
    setDeleting(true);
    try {
      await onDelete();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  const isOutputOrDebug = form.type === "output" || form.type === "debug";

  return (
    <form onSubmit={handleSubmit} css={S.wrap}>
      {success && (
        <div css={S.success}>
          <CheckCircle size={16} />{" "}
          {mode === "create" ? "Question created!" : "Changes saved!"}
        </div>
      )}
      {error && <div css={S.error}>{error}</div>}

      {/* ── Identity ── */}
      <div css={S.sectionLabel}>Identity</div>
      <div css={S.row}>
        <div css={S.field}>
          <label css={S.label}>
            Type <span css={S.required}>*</span>
          </label>
          <select
            css={S.select}
            value={form.type}
            onChange={(e) => set("type", e.target.value as QuestionType)}
          >
            <option value="theory">📖 Theory</option>
            <option value="output">💻 Output (What prints?)</option>
            <option value="debug">🐛 Debug (Find the bug)</option>
          </select>
        </div>
        <div css={S.field}>
          <label css={S.label}>
            Difficulty <span css={S.required}>*</span>
          </label>
          <select
            css={S.select}
            value={form.difficulty}
            onChange={(e) => set("difficulty", e.target.value as Difficulty)}
          >
            <option value="beginner">Beginner</option>
            <option value="core">Core</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        <div css={S.field}>
          <label css={S.label}>Status</label>
          <select
            css={S.select}
            value={form.status}
            onChange={(e) => set("status", e.target.value as QuestionStatus)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div css={S.field}>
          <label css={S.label}>Track</label>
          <select
            css={S.select}
            value={form.track}
            onChange={(e) => set("track", e.target.value as Track)}
          >
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>
      </div>

      <div css={[S.field, { gridColumn: "1 / -1" }]}>
        <label css={S.label}>
          Title <span css={S.required}>*</span>
        </label>
        <input
          css={S.input}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="What is a closure in JavaScript?"
        />
      </div>

      <div css={S.row}>
        <div css={S.field}>
          <label css={S.label}>
            Category <span css={S.required}>*</span>
          </label>
          <input
            css={S.input}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder={isOutputOrDebug ? "Closures & Scope" : "Async JS"}
          />
        </div>
        <div css={S.field}>
          <label css={S.label}>Slug</label>
          <input
            css={S.input}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-generated from title"
          />
        </div>
        <div css={S.field}>
          <label css={S.label}>Order</label>
          <input
            css={S.input}
            type="number"
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </div>
      </div>

      {topics.length > 0 && (
        <div css={S.field}>
          <label css={S.label}>Topic</label>
          <select
            css={S.select}
            value={form.topicSlug ?? ""}
            onChange={(e) => set("topicSlug", e.target.value)}
          >
            <option value="">— none —</option>
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── Tags ── */}
      <div css={S.field}>
        <label css={S.label}>Tags</label>
        <div css={S.tagsInput}>
          {form.tags.map((t) => (
            <span key={t} css={S.tag} onClick={() => removeTag(t)}>
              {t} ×
            </span>
          ))}
          <input
            css={S.tagInput}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(tagInput);
              }
              if (e.key === "Backspace" && !tagInput && form.tags.length)
                removeTag(form.tags[form.tags.length - 1]);
            }}
            placeholder="Add tags (Enter to add)"
          />
        </div>
        <span css={S.labelHint}>
          e.g. closure, async, promise — used for search and filtering
        </span>
      </div>

      {/* ── Companies (output + debug only) ── */}
      {isOutputOrDebug && (
        <div css={S.field}>
          <label css={S.label}>
            <Building2
              size={13}
              style={{
                display: "inline",
                marginRight: 5,
                verticalAlign: "middle",
              }}
            />
            Companies that ask this in interviews
            {selectedCompanies.length > 0 && (
              <span
                css={S.labelHint}
                style={{ marginLeft: 8, display: "inline" }}
              >
                — {selectedCompanies.join(", ")}
              </span>
            )}
          </label>
          <div css={S.companiesGrid}>
            {ALL_COMPANIES.map((c) => (
              <button
                key={c}
                type="button"
                css={S.companyBtn(selectedCompanies.includes(c))}
                onClick={() => toggleCompany(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <span css={S.labelHint}>
            Select companies known to ask questions on this JS concept.
          </span>
        </div>
      )}

      <hr css={S.divider} />

      {/* ── Sandbox contract notice ── */}
      {isOutputOrDebug && (
        <div css={S.sandboxNote}>
          <strong>⚡ Sandbox contract</strong>
          {" — "}
          {form.type === "output"
            ? "Pure JS only (no fetch/DOM/React). All output via console.log. expectedOutput = exact logs, never an error string."
            : 'brokenCode must run without throwing — it produces WRONG output silently. fixedCode produces expectedOutput. Never put "Error" in expectedOutput.'}
        </div>
      )}

      {/* ── Output fields ── */}
      {form.type === "output" && (
        <>
          <div css={S.field}>
            <label css={S.label}>
              Code <span css={S.required}>*</span>
            </label>
            <textarea
              css={S.textarea}
              rows={8}
              value={form.code ?? ""}
              onChange={(e) => set("code", e.target.value)}
              placeholder={
                "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}"
              }
            />
          </div>
          <div css={S.field}>
            <label css={S.label}>
              Expected Output <span css={S.required}>*</span>
            </label>
            <textarea
              css={S.textarea}
              rows={3}
              value={form.expectedOutput ?? ""}
              onChange={(e) => set("expectedOutput", e.target.value)}
              placeholder={"3\n3\n3"}
            />
            <span css={S.labelHint}>
              Exact console.log output — one value per line. Never include error
              strings.
            </span>
          </div>
        </>
      )}

      {/* ── Debug fields ── */}
      {form.type === "debug" && (
        <>
          <div css={S.field}>
            <label css={S.label}>
              Broken Code <span css={S.required}>*</span>
            </label>
            <textarea
              css={S.textarea}
              rows={8}
              value={form.brokenCode ?? ""}
              onChange={(e) => set("brokenCode", e.target.value)}
              placeholder="// Runs without throwing — produces wrong output"
            />
          </div>
          <div css={S.field}>
            <label css={S.label}>
              Fixed Code <span css={S.required}>*</span>
            </label>
            <textarea
              css={S.textarea}
              rows={8}
              value={form.fixedCode ?? ""}
              onChange={(e) => set("fixedCode", e.target.value)}
              placeholder="// Produces the correct expectedOutput"
            />
          </div>
          <div css={S.field}>
            <label css={S.label}>
              Expected Output (what fixedCode logs){" "}
              <span css={S.required}>*</span>
            </label>
            <textarea
              css={S.textarea}
              rows={3}
              value={form.expectedOutput ?? ""}
              onChange={(e) => set("expectedOutput", e.target.value)}
              placeholder={"0\n1\n2"}
            />
            <span css={S.labelHint}>
              Never an error string — must be actual console.log values.
            </span>
          </div>
          <div css={S.field}>
            <label css={S.label}>Bug Description</label>
            <input
              css={S.input}
              value={form.bugDescription ?? ""}
              onChange={(e) => set("bugDescription", e.target.value)}
              placeholder="var is function-scoped — all closures share the same i"
            />
          </div>
        </>
      )}

      <hr css={S.divider} />

      {/* ── Answer / Explanation ── */}
      <div css={S.sectionLabel}>Answer &amp; Explanation</div>

      <div css={S.field}>
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label css={S.label}>
            Answer (Markdown) <span css={S.required}>*</span>
          </label>
          <button
            type="button"
            css={S.previewToggle}
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? (
              <>
                <EyeOff size={13} /> Edit
              </>
            ) : (
              <>
                <Eye size={13} /> Preview
              </>
            )}
          </button>
        </div>
        {preview ? (
          <div
            css={{
              padding: "0.75rem 1rem",
              border: `1px solid ${C.border}`,
              borderRadius: RADIUS.md,
              background: C.surface,
              minHeight: "8rem",
            }}
          >
            <MarkdownRenderer content={form.answer} />
          </div>
        ) : (
          <MarkdownEditor
            value={form.answer}
            onChange={(v) => set("answer", v)}
          />
        )}
      </div>

      <div css={S.field}>
        <label css={S.label}>Key Insight</label>
        <input
          css={S.input}
          value={form.keyInsight ?? ""}
          onChange={(e) => set("keyInsight", e.target.value)}
          placeholder="The single most important takeaway for interviews"
        />
      </div>
      <div css={S.field}>
        <label css={S.label}>Explanation</label>
        <textarea
          css={S.textarea}
          rows={3}
          value={form.explanation ?? ""}
          onChange={(e) => set("explanation", e.target.value)}
          placeholder="Plain-text step-by-step explanation (shown after reveal)"
        />
      </div>
      <div css={S.field}>
        <label css={S.label}>Hint</label>
        <input
          css={S.input}
          value={form.hint ?? ""}
          onChange={(e) => set("hint", e.target.value)}
          placeholder="A subtle nudge without giving the answer away"
        />
      </div>

      <hr css={S.divider} />

      {/* ── Visibility ── */}
      <div css={S.sectionLabel}>Visibility</div>
      <div css={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          css={S.toggle(form.isPro, C.accent)}
          onClick={() => set("isPro", !form.isPro)}
        >
          {form.isPro ? "⭐ Pro Only" : "🆓 Free"}
        </button>
        <button
          type="button"
          css={S.toggle(!!(form as any).isTricky, C.red)}
          onClick={() => set("isTricky" as any, !(form as any).isTricky)}
        >
          {(form as any).isTricky ? "🤯 Tricky ✓" : "🤯 Mark as Tricky"}
        </button>
        <button
          type="button"
          css={S.toggle(form.status === "published", C.green)}
          onClick={() =>
            set("status", form.status === "published" ? "draft" : "published")
          }
        >
          {form.status === "published" ? "✓ Published" : "○ Draft"}
        </button>
      </div>

      <hr css={S.divider} />

      {/* ── Actions ── */}
      <div css={S.actions}>
        <button type="submit" css={S.saveBtn} disabled={saving}>
          {saving ? (
            <>
              <Loader2
                size={15}
                css={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Saving…
            </>
          ) : (
            <>
              <Save size={15} />{" "}
              {mode === "create" ? "Create Question" : "Save Changes"}
            </>
          )}
        </button>
        {onDelete && (
          <button
            type="button"
            css={S.delBtn}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2
                size={14}
                css={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Trash2 size={14} />
            )}
            Delete
          </button>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

/** @jsxImportSource @emotion/react */
'use client'

import { useState } from 'react'
import { css } from '@emotion/react'
import { Save, Eye, EyeOff, Loader2, Trash2, CheckCircle } from 'lucide-react'
import { C, RADIUS, BP } from '@/styles/tokens'
import MarkdownEditor from '@/components/md/MarkdownEditor'
import MarkdownRenderer from '@/components/md/MarkdownRenderer'
import type { Question, QuestionInput, QuestionType, Difficulty, Track, QuestionStatus } from '@/types/question'
import { CATEGORIES } from '@/data/questions'

export type FormMode = 'create' | 'edit'

interface Props {
  mode: FormMode
  initial?: Partial<Question>
  onSubmit: (data: QuestionInput) => Promise<void>
  onDelete?: () => Promise<void>
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  wrap: css`max-width: 52rem;`,

  row: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
    @media (min-width: ${BP.sm}) { grid-template-columns: 1fr 1fr; }
  `,

  row3: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
    @media (min-width: ${BP.sm}) { grid-template-columns: 1fr 1fr 1fr; }
  `,

  field: css`margin-bottom: 1.25rem;`,

  label: css`
    display: block;
    font-size: 0.6875rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: ${C.muted};
    margin-bottom: 0.375rem;
  `,

  required: css`color: ${C.danger}; margin-left: 0.125rem;`,

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
    &:focus { border-color: ${C.accent}55; }
    &::placeholder { color: rgba(255,255,255,0.2); }
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
    &:focus { border-color: ${C.accent}55; }
    option { background: ${C.card}; }
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
    font-family: 'JetBrains Mono', monospace;
    &:focus { border-color: ${C.accent}55; }
    &::placeholder { color: rgba(255,255,255,0.2); }
  `,

  toggle: (active: boolean, color: string) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    border-radius: ${RADIUS.md};
    font-size: 0.75rem;
    font-weight: 700;
    border: 1px solid ${active ? color + '55' : C.border};
    background: ${active ? color + '14' : 'transparent'};
    color: ${active ? color : C.muted};
    cursor: pointer;
    transition: all 0.15s ease;
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
    background: ${loading ? C.accent + '80' : C.accent};
    border: none;
    border-radius: ${RADIUS.xl};
    color: white;
    font-weight: 800;
    font-size: 0.9375rem;
    cursor: ${loading ? 'not-allowed' : 'pointer'};
    transition: all 0.15s ease;
    &:hover { background: ${loading ? '' : C.accent + 'ee'}; }
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
    transition: all 0.15s ease;
    &:hover { background: ${C.danger}12; }
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

  preview: css`
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 1.25rem;
    margin-top: 0.5rem;
  `,

  tagsInput: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.5rem 0.75rem;
    &:focus-within { border-color: ${C.accent}55; }
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
    &:hover { background: ${C.danger}18; border-color: ${C.danger}33; color: ${C.danger}; }
  `,

  tagInput: css`
    flex: 1;
    min-width: 8rem;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: white;
    &::placeholder { color: rgba(255,255,255,0.2); }
  `,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const EMPTY: QuestionInput = {
  slug: '', type: 'theory', track: 'javascript',
  title: '', question: '', answer: '',
  hint: '', explanation: '', keyInsight: '', code: '',
  category: '', tags: [], difficulty: 'core',
  expectedOutput: '', brokenCode: '', fixedCode: '', bugDescription: '',
  status: 'draft', isPro: false, order: 0,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuestionForm({ mode, initial = {}, onSubmit, onDelete }: Props) {
  const [form, setForm] = useState<QuestionInput>({ ...EMPTY, ...initial })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function set<K extends keyof QuestionInput>(key: K, val: QuestionInput[K]) {
    setForm(f => {
      const next = { ...f, [key]: val }
      // Auto-generate slug from title when creating
      if (key === 'title' && mode === 'create') {
        next.slug = slugify(val as string)
      }
      return next
    })
  }

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase()
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }

  function removeTag(tag: string) {
    set('tags', form.tags.filter(t => t !== tag))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.answer.trim()) { setError('Answer is required'); return }
    if (!form.category.trim()) { setError('Category is required'); return }
    setSaving(true); setError(null); setSuccess(false)
    try {
      await onSubmit(form)
      setSuccess(true)
      if (mode === 'create') setForm(EMPTY)
      setTimeout(() => setSuccess(false), 4000)
    } catch (e: any) {
      setError(e.message ?? 'Save failed')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!onDelete || !showDeleteConfirm) { setShowDeleteConfirm(true); return }
    setDeleting(true)
    try { await onDelete() }
    catch (e: any) { setError(e.message); setDeleting(false) }
  }

  const isOutputOrDebug = form.type === 'output' || form.type === 'debug'

  const categories = CATEGORIES.map(c => <option key={c} value={c}>{c.toLowerCase()}</option>)

  return (
    <form onSubmit={handleSubmit} css={S.wrap}>
      {success && (
        <div css={S.success}>
          <CheckCircle size={16} /> {mode === 'create' ? 'Question created!' : 'Changes saved!'}
        </div>
      )}
      {error && <div css={S.error}>{error}</div>}

      {/* ── Core metadata ── */}
      <div css={S.sectionLabel}>Identity</div>
      <div css={S.row}>
        <div>
          <label css={S.label}>Type <span css={S.required}>*</span></label>
          <select css={S.select} value={form.type} onChange={e => set('type', e.target.value as QuestionType)}>
            <option value="theory">📖 Theory</option>
            <option value="output">💻 Output (What prints?)</option>
            <option value="debug">🐛 Debug (Fix the bug)</option>
            <option value="coding">⌨️ Coding (Write code)</option>
            <option value="system">🏗️ System Design</option>
            <option value="behavioral">🗣️ Behavioral</option>
          </select>
        </div>
        <div>
          <label css={S.label}>Track <span css={S.required}>*</span></label>
          <select css={S.select} value={form.track} onChange={e => set('track', e.target.value as Track)}>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="typescript">TypeScript</option>
            <option value="system-design">System Design</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>
      </div>

      <div css={S.field}>
        <label css={S.label}>Title (shown in the list) <span css={S.required}>*</span></label>
        <input
          css={S.input} type="text" value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. What is closure? / What does this code print?"
        />
      </div>

      <div css={S.row}>
        <div>
          <label css={S.label}>Category <span css={S.required}>*</span></label>
          <select css={S.select} value={form.category} onChange={e => set('category', e.target.value)}>
            {categories}
          </select>
        </div>
        <div>
          <label css={S.label}>Slug (URL)</label>
          <input
            css={S.input} value={form.slug}
            onChange={e => set('slug', e.target.value)}
            placeholder="auto-generated from title"
          />
        </div>
      </div>

      <div css={S.row3}>
        <div>
          <label css={S.label}>Difficulty</label>
          <select css={S.select} value={form.difficulty} onChange={e => set('difficulty', e.target.value as Difficulty)}>
            <option value="beginner">🟢 Beginner</option>
            <option value="core">🔵 Core</option>
            <option value="advanced">🟡 Advanced</option>
            <option value="expert">🔴 Expert</option>
          </select>
        </div>
        <div>
          <label css={S.label}>Status</label>
          <select css={S.select} value={form.status} onChange={e => set('status', e.target.value as QuestionStatus)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label css={S.label}>Sort Order</label>
          <input
            css={S.input} type="number" min={0} value={form.order}
            onChange={e => set('order', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Tags */}
      <div css={S.field}>
        <label css={S.label}>Tags</label>
        <div css={S.tagsInput}>
          {form.tags.map(t => (
            <span key={t} css={S.tag} onClick={() => removeTag(t)}>{t} ×</span>
          ))}
          <input
            css={S.tagInput}
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
              if (e.key === 'Backspace' && !tagInput && form.tags.length) removeTag(form.tags[form.tags.length - 1])
            }}
            placeholder="Add tags (Enter to add)"
          />
        </div>
      </div>

      {/* Toggles */}
      <div css={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button type="button" css={S.toggle(form.isPro, C.accent2)} onClick={() => set('isPro', !form.isPro)}>
          {form.isPro ? '⭐ Pro Only' : '🆓 Free'}
        </button>
        <button type="button" css={S.toggle(form.status === 'published', C.accent3)}
          onClick={() => set('status', form.status === 'published' ? 'draft' : 'published')}>
          {form.status === 'published' ? '✓ Published' : '○ Draft'}
        </button>
      </div>

      <hr css={S.divider} />

      {/* ── Question text ── */}
      <div css={S.sectionLabel}>Question Content</div>

      <div css={S.field}>
        <MarkdownEditor
          label="Full Question Text (Markdown)"
          value={form.question}
          onChange={v => set('question', v)}
          rows={5}
          placeholder="Write the full question prompt here. Supports **Markdown** and \`code\`."
        />
      </div>

      {/* Code block for output/debug */}
      {isOutputOrDebug && (
        <div css={S.field}>
          <label css={S.label}>Code Snippet</label>
          <textarea
            css={S.textarea} rows={8} value={form.code ?? ''}
            onChange={e => set('code', e.target.value)}
            placeholder="const x = ...&#10;console.log(x)"
          />
        </div>
      )}

      {/* Expected output for output type */}
      {form.type === 'output' && (
        <div css={S.field}>
          <label css={S.label}>Expected Output <span css={S.required}>*</span></label>
          <textarea
            css={S.textarea} rows={3} value={form.expectedOutput ?? ''}
            onChange={e => set('expectedOutput', e.target.value)}
            placeholder="1&#10;2&#10;undefined"
          />
        </div>
      )}

      {/* Debug-specific fields */}
      {form.type === 'debug' && (
        <>
          <div css={S.field}>
            <label css={S.label}>Broken Code <span css={S.required}>*</span></label>
            <textarea css={S.textarea} rows={8} value={form.brokenCode ?? ''}
              onChange={e => set('brokenCode', e.target.value)} />
          </div>
          <div css={S.field}>
            <label css={S.label}>Fixed Code <span css={S.required}>*</span></label>
            <textarea css={S.textarea} rows={8} value={form.fixedCode ?? ''}
              onChange={e => set('fixedCode', e.target.value)} />
          </div>
          <div css={S.field}>
            <label css={S.label}>Bug Description</label>
            <input css={S.input} value={form.bugDescription ?? ''}
              onChange={e => set('bugDescription', e.target.value)}
              placeholder="Missing await on the fetch call" />
          </div>
        </>
      )}

      <hr css={S.divider} />

      {/* ── Answer / Explanation ── */}
      <div css={S.sectionLabel}>Answer &amp; Explanation</div>

      <div css={S.field}>
        <MarkdownEditor
          label="Answer (Markdown — supports code blocks)"
          value={form.answer}
          onChange={v => set('answer', v)}
          rows={12}
          placeholder={`**Closure** is a function that retains access to its outer scope.\n\n\`\`\`js\nfunction counter() {\n  let n = 0\n  return () => ++n\n}\n\`\`\``}
        />
      </div>

      <div css={S.field}>
        <label css={S.label}>Hint (shown before answer)</label>
        <input css={S.input} value={form.hint ?? ''}
          onChange={e => set('hint', e.target.value)}
          placeholder="Think about scope and what the function can 'see'" />
      </div>

      <div css={S.row}>
        <div>
          <label css={S.label}>Explanation</label>
          <textarea css={S.textarea} rows={3} value={form.explanation ?? ''}
            onChange={e => set('explanation', e.target.value)}
            placeholder="Used for output/debug detailed breakdown" />
        </div>
        <div>
          <label css={S.label}>Key Insight</label>
          <textarea css={S.textarea} rows={3} value={form.keyInsight ?? ''}
            onChange={e => set('keyInsight', e.target.value)}
            placeholder="One sentence takeaway that sticks" />
        </div>
      </div>

      {/* ── Footer ── */}
      <div css={S.footer}>
        <div css={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {onDelete && (
            <button type="button" css={S.deleteBtn} onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 size={14} css={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
              {showDeleteConfirm ? 'Confirm delete?' : 'Delete'}
            </button>
          )}
          {showDeleteConfirm && (
            <button type="button" onClick={() => setShowDeleteConfirm(false)}
              css={{ fontSize: '0.75rem', color: C.muted, background: 'none', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>

        <button type="submit" css={S.submitBtn(saving)} disabled={saving}>
          {saving
            ? <><Loader2 size={16} css={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
            : <><Save size={16} /> {mode === 'create' ? 'Create Question' : 'Save Changes'}</>}
        </button>
      </div>
    </form>
  )
}
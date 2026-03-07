/** @jsxImportSource @emotion/react */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, Search, RefreshCw } from 'lucide-react'
import { getTopics, deleteTopic, publishTopic, archiveTopic } from '@/lib/topics'
import type { Topic } from '@/types/topic'

const DIFF_COLOR: Record<string, string> = {
  Beginner: C.accent3, Intermediate: C.accent2, Advanced: C.orange, Senior: C.danger,
}

const S = {
  topRow: css`display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;`,
  heading: css`font-size:1.5rem;font-weight:900;`,
  addBtn: css`display:flex;align-items:center;gap:0.5rem;padding:0.625rem 1.25rem;background:${C.accent};border:none;border-radius:${RADIUS.xl};color:white;font-weight:800;font-size:0.875rem;text-decoration:none;cursor:pointer;&:hover{opacity:0.9;}`,
  searchBar: css`display:flex;align-items:center;gap:0.5rem;background:${C.surface};border:1px solid ${C.border};border-radius:${RADIUS.xl};padding:0.5rem 0.875rem;margin-bottom:1rem;&:focus-within{border-color:${C.accent}55;}`,
  searchInput: css`flex:1;background:transparent;border:none;outline:none;font-size:0.875rem;color:white;&::placeholder{color:${C.muted};}`,
  meta: css`font-size:0.75rem;color:${C.muted};margin-bottom:0.875rem;`,
  table: css`width:100%;border-collapse:collapse;`,
  th: css`text-align:left;font-size:0.6875rem;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;color:${C.muted};padding:0.5rem 0.75rem;border-bottom:1px solid ${C.border};`,
  tr: css`border-bottom:1px solid ${C.border};&:hover td{background:rgba(255,255,255,0.02);}`,
  td: css`padding:0.75rem;font-size:0.8125rem;vertical-align:middle;`,
  badge: (color: string) => css`display:inline-flex;align-items:center;padding:0.125rem 0.5rem;border-radius:0.25rem;font-size:0.5625rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;background:${color}14;border:1px solid ${color}33;color:${color};`,
  actions: css`display:flex;gap:0.375rem;align-items:center;`,
  iconBtn: (color: string) => css`display:flex;align-items:center;padding:0.375rem;border-radius:${RADIUS.sm};background:transparent;border:1px solid ${color}33;color:${color};cursor:pointer;transition:all 0.15s;&:hover{background:${color}14;}`,
  empty: css`text-align:center;padding:3rem;color:${C.muted};`,
}

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [filtered, setFiltered] = useState<Topic[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const all = await getTopics()
      setTopics(all)
      setFiltered(all)
    } catch (e: any) {
      console.error(e)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(q ? topics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keyword.toLowerCase().includes(q)
    ) : topics)
  }, [search, topics])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await deleteTopic(id)
    setTopics(prev => prev.filter(t => t.id !== id))
  }

  async function handleToggleStatus(topic: Topic) {
    if (topic.status === 'published') {
      await archiveTopic(topic.id)
      setTopics(prev => prev.map(t => t.id === topic.id ? { ...t, status: 'archived' } : t))
    } else {
      await publishTopic(topic.id)
      setTopics(prev => prev.map(t => t.id === topic.id ? { ...t, status: 'published' } : t))
    }
  }

  return (
    <div>
      <div css={S.topRow}>
        <h1 css={S.heading}>Topics</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, color: C.muted, cursor: 'pointer', fontSize: '0.8125rem' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <Link href="/admin/topics/new" css={S.addBtn}>
            <PlusCircle size={15} /> New Topic
          </Link>
        </div>
      </div>

      <div css={S.searchBar}>
        <Search size={15} color={C.muted} />
        <input css={S.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics…" />
      </div>

      <div css={S.meta}>{loading ? 'Loading…' : `${filtered.length} of ${topics.length} topics`}</div>

      {!loading && filtered.length === 0 ? (
        <div css={S.empty}>
          {topics.length === 0
            ? <>No topics yet. <Link href="/admin/migrate" style={{ color: C.accent }}>Run migration</Link> to import from static files.</>
            : 'No topics match your search.'
          }
        </div>
      ) : (
        <table css={S.table}>
          <thead>
            <tr>
              <th css={S.th}>Topic</th>
              <th css={S.th}>Category</th>
              <th css={S.th}>Difficulty</th>
              <th css={S.th}>Status</th>
              <th css={S.th}>Qs</th>
              <th css={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} css={S.tr}>
                <td css={S.td}>
                  <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.1875rem' }}>{t.keyword}</div>
                  <div style={{ fontSize: '0.6875rem', color: C.muted }}>{t.slug}</div>
                </td>
                <td css={S.td}>
                  <span css={S.badge(C.accent)}>{t.category}</span>
                </td>
                <td css={S.td}>
                  <span css={S.badge(DIFF_COLOR[t.difficulty] ?? C.accent2)}>{t.difficulty}</span>
                </td>
                <td css={S.td}>
                  <span css={S.badge(t.status === 'published' ? C.accent3 : t.status === 'draft' ? C.muted : C.danger)}>
                    {t.status}
                  </span>
                </td>
                <td css={S.td} style={{ color: C.muted }}>{t.questionCount}</td>
                <td css={S.td}>
                  <div css={S.actions}>
                    <Link href={`/${t.slug}`} target="_blank" css={S.iconBtn(C.accent)} title="View live page">
                      <Eye size={13} />
                    </Link>
                    <Link href={`/admin/topics/${t.id}`} css={S.iconBtn(C.accent2)} title="Edit">
                      <Edit2 size={13} />
                    </Link>
                    <button css={S.iconBtn(t.status === 'published' ? C.muted : C.accent3)}
                      onClick={() => handleToggleStatus(t)}
                      title={t.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {t.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button css={S.iconBtn(C.danger)} onClick={() => handleDelete(t.id, t.title)} title="Delete">
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
  )
}
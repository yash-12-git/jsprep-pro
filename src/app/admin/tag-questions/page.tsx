/** @jsxImportSource @emotion/react */
'use client'

import { useEffect, useState, useMemo } from 'react'
import { css } from '@emotion/react'
import { useAuth } from '@/hooks/useAuth'
import { getQuestions, updateQuestion } from '@/lib/questions'
import { getPublishedTopics } from '@/lib/topics'
import type { Question } from '@/types/question'
import type { Topic } from '@/types/topic'
import { C, RADIUS } from '@/styles/tokens'
import { Tag, CheckCircle2, Search, Filter, Loader2, AlertTriangle, X } from 'lucide-react'
import { useTrack } from '@/contexts/TrackContext'

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: css`padding: 2rem; max-width: 1100px;`,

  heading: css`font-size: 1.5rem; font-weight: 900; color: white; margin-bottom: 0.25rem;`,
  sub: css`color: ${C.muted}; font-size: 0.875rem; margin-bottom: 2rem;`,

  toolbar: css`
    display: flex; gap: 0.75rem; flex-wrap: wrap;
    align-items: center; margin-bottom: 1.5rem;
  `,

  searchWrap: css`
    position: relative; flex: 1; min-width: 200px;
  `,
  searchIcon: css`
    position: absolute; left: 0.75rem; top: 50%;
    transform: translateY(-50%); color: ${C.muted};
    pointer-events: none;
  `,
  search: css`
    width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: ${RADIUS.lg}; color: white; font-size: 0.875rem;
    &:focus { outline: none; border-color: ${C.accent}; }
    &::placeholder { color: ${C.muted}; }
  `,

  select: css`
    padding: 0.5rem 0.75rem;
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: ${RADIUS.lg}; color: white; font-size: 0.875rem;
    cursor: pointer; min-width: 160px;
    &:focus { outline: none; border-color: ${C.accent}; }
  `,

  stats: css`
    display: flex; gap: 1rem; margin-bottom: 1.5rem;
    flex-wrap: wrap;
  `,
  statChip: (color: string) => css`
    padding: 0.375rem 0.875rem;
    background: ${color}18; border: 1px solid ${color}30;
    border-radius: 100px; font-size: 0.75rem; font-weight: 700;
    color: ${color};
  `,

  table: css`
    width: 100%; border-collapse: collapse;
    background: ${C.card}; border-radius: ${RADIUS.xl};
    overflow: hidden; border: 1px solid ${C.border};
  `,
  th: css`
    padding: 0.75rem 1rem; text-align: left;
    font-size: 0.6875rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
    color: ${C.muted}; background: rgba(255,255,255,0.03);
    border-bottom: 1px solid ${C.border};
  `,
  tr: (saving: boolean) => css`
    border-bottom: 1px solid ${C.border};
    transition: background 0.15s;
    opacity: ${saving ? 0.6 : 1};
    &:last-child { border-bottom: none; }
    &:hover { background: rgba(255,255,255,0.02); }
  `,
  td: css`padding: 0.75rem 1rem; vertical-align: middle;`,

  qTitle: css`
    font-size: 0.875rem; color: white; font-weight: 500;
    line-height: 1.4;
  `,
  qMeta: css`
    font-size: 0.6875rem; color: ${C.muted}; margin-top: 3px;
    display: flex; gap: 0.5rem; align-items: center;
  `,
  tag: (color: string) => css`
    padding: 1px 7px; border-radius: 100px;
    font-size: 0.625rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
    background: ${color}18; color: ${color};
  `,

  topicSelect: (hasValue: boolean) => css`
    padding: 0.375rem 0.625rem;
    background: ${hasValue ? 'rgba(124,106,247,0.1)' : C.surface};
    border: 1px solid ${hasValue ? 'rgba(124,106,247,0.3)' : C.border};
    border-radius: ${RADIUS.md}; color: ${hasValue ? '#c4b5fd' : C.muted};
    font-size: 0.8125rem; cursor: pointer; width: 100%;
    &:focus { outline: none; border-color: ${C.accent}; }
  `,

  savedBadge: css`
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.6875rem; color: #6af7c0; font-weight: 600;
  `,
  savingBadge: css`
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.6875rem; color: ${C.muted};
  `,

  untaggedBanner: css`
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.875rem 1.125rem;
    background: rgba(251,191,36,0.07); border: 1px solid rgba(251,191,36,0.2);
    border-radius: ${RADIUS.lg}; margin-bottom: 1.5rem;
    font-size: 0.875rem; color: #fcd34d;
  `,

  empty: css`
    padding: 3rem; text-align: center; color: ${C.muted};
    font-size: 0.9375rem;
  `,
}

type SaveState = 'idle' | 'saving' | 'saved'

// ─── Component ────────────────────────────────────────────────────────────────
export default function TagQuestionsPage() {
  const { user } = useAuth()
  const {track} = useTrack()
  const [questions, setQuestions] = useState<Question[]>([])
  const [topics, setTopics]       = useState<Topic[]>([])
  const [loading, setLoading]     = useState(true)

  const [search,      setSearch]      = useState('')
  const [filterTopic, setFilterTopic] = useState('all')   // 'all' | 'untagged' | slug
  const [filterType,  setFilterType]  = useState('all')   // 'all' | 'theory' | 'output' | 'debug'
  const [filterCat,   setFilterCat]   = useState('all')

  // Per-row save state
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({})

  // Local overrides so UI updates instantly without refetch
  const [localTopicSlugs, setLocalTopicSlugs] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([
      getQuestions({ filters: { status: 'published', track }, pageSize: 500 }),
      getPublishedTopics({ track }),
    ]).then(([qResult, topicList]) => {
      setQuestions(qResult.questions)
      setTopics(topicList)
    }).finally(() => setLoading(false)).catch(e => {
    }).catch((e) => {
      console.error(e);
    })
  }, [track])

  const categories = useMemo(() =>
    [...new Set(questions.map(q => q.category))].sort(),
  [questions])

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const effectiveTopicSlug = localTopicSlugs[q.id] ?? q.topicSlug ?? ''
      if (filterTopic === 'untagged' && effectiveTopicSlug) return false
      if (filterTopic !== 'all' && filterTopic !== 'untagged' && effectiveTopicSlug !== filterTopic) return false
      if (filterType !== 'all' && q.type !== filterType) return false
      if (filterCat  !== 'all' && q.category !== filterCat) return false
      if (search) {
        const s = search.toLowerCase()
        if (!q.title.toLowerCase().includes(s) && !q.category.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [questions, search, filterTopic, filterType, filterCat, localTopicSlugs])

  const untaggedCount = useMemo(() =>
    questions.filter(q => !(localTopicSlugs[q.id] ?? q.topicSlug)).length,
  [questions, localTopicSlugs])

  async function handleTopicChange(questionId: string, newTopicSlug: string) {
    // Optimistic update
    setLocalTopicSlugs(prev => ({ ...prev, [questionId]: newTopicSlug }))
    setSaveStates(prev => ({ ...prev, [questionId]: 'saving' }))
    try {
      await updateQuestion(questionId, { topicSlug: newTopicSlug || undefined })
      setSaveStates(prev => ({ ...prev, [questionId]: 'saved' }))
      setTimeout(() => setSaveStates(prev => ({ ...prev, [questionId]: 'idle' })), 2000)
    } catch {
      // Revert on error
      setLocalTopicSlugs(prev => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
      setSaveStates(prev => ({ ...prev, [questionId]: 'idle' }))
    }
  }

  if (loading) return (
    <div css={S.page}>
      <h1 css={S.heading}>Tag Questions</h1>
      <div style={{ color: C.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
        Loading questions and topics…
      </div>
    </div>
  )

  return (
    <div css={S.page}>
      <h1 css={S.heading}>Tag Questions to Topics</h1>
      <p css={S.sub}>
        Assign each question to its topic page. Tagged questions appear on the corresponding
        <code style={{ background: C.surface, padding: '1px 5px', borderRadius: 4, fontSize: '0.8125rem', color: C.accent3 }}>/[topic-slug]</code> page.
        The question's own URL never changes.
      </p>

      {/* Stats */}
      <div css={S.stats}>
        <span css={S.statChip('#a78bfa')}>{questions.length} total questions</span>
        <span css={S.statChip('#6af7c0')}>{questions.length - untaggedCount} tagged</span>
        {untaggedCount > 0 && <span css={S.statChip('#fbbf24')}>{untaggedCount} untagged</span>}
        <span css={S.statChip('#60a5fa')}>{topics.length} topics</span>
      </div>

      {/* Untagged warning */}
      {untaggedCount > 0 && (
        <div css={S.untaggedBanner}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>{untaggedCount} questions</strong> have no topic assigned — they won't appear on any topic page.
            Use the <strong>Untagged</strong> filter to find them quickly.
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div css={S.toolbar}>
        <div css={S.searchWrap}>
          <Search size={14} css={S.searchIcon} />
          <input
            css={S.search}
            placeholder="Search questions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select css={S.select} value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
          <option value="all">All topics</option>
          <option value="untagged">⚠ Untagged only</option>
          <optgroup label="Tagged to topic">
            {topics.map(t => (
              <option key={t.slug} value={t.slug}>
                {t.keyword.charAt(0).toUpperCase() + t.keyword.slice(1)}
              </option>
            ))}
          </optgroup>
        </select>

        <select css={S.select} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select css={S.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All types</option>
          <option value="theory">Theory</option>
          <option value="output">Output</option>
          <option value="debug">Debug</option>
        </select>

        {(search || filterTopic !== 'all' || filterType !== 'all' || filterCat !== 'all') && (
          <button
            onClick={() => { setSearch(''); setFilterTopic('all'); setFilterType('all'); setFilterCat('all') }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.5rem 0.75rem', background: 'none', border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, color: C.muted, cursor: 'pointer', fontSize: '0.8125rem' }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Showing count */}
      <div style={{ fontSize: '0.75rem', color: C.muted, marginBottom: '0.75rem' }}>
        Showing {filtered.length} of {questions.length} questions
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div css={S.empty}>No questions match your filters.</div>
      ) : (
        <table css={S.table}>
          <thead>
            <tr>
              <th css={S.th} style={{ width: '45%' }}>Question</th>
              <th css={S.th} style={{ width: '15%' }}>Category</th>
              <th css={S.th} style={{ width: '10%' }}>Type</th>
              <th css={S.th} style={{ width: '25%' }}>Topic Page</th>
              <th css={S.th} style={{ width: '5%' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => {
              const effectiveSlug = localTopicSlugs[q.id] ?? q.topicSlug ?? ''
              const saveState = saveStates[q.id] ?? 'idle'
              return (
                <tr key={q.id} css={S.tr(saveState === 'saving')}>
                  <td css={S.td}>
                    <div css={S.qTitle}>{q.title}</div>
                    <div css={S.qMeta}>
                      <span>{q.difficulty}</span>
                      {q.hint && <><span>·</span><span style={{ fontStyle: 'italic' }}>💡 {q.hint.slice(0, 40)}…</span></>}
                    </div>
                  </td>
                  <td css={S.td}>
                    <span css={S.tag('#60a5fa')}>{q.category}</span>
                  </td>
                  <td css={S.td}>
                    <span css={S.tag(
                      q.type === 'output' ? '#fbbf24' :
                      q.type === 'debug'  ? '#f87171' : '#a78bfa'
                    )}>
                      {q.type}
                    </span>
                  </td>
                  <td css={S.td}>
                    <select
                      css={S.topicSelect(!!effectiveSlug)}
                      value={effectiveSlug}
                      onChange={e => handleTopicChange(q.id, e.target.value)}
                      disabled={saveState === 'saving'}
                    >
                      <option value="">— unassigned —</option>
                      {topics.map(t => (
                        <option key={t.slug} value={t.slug}>
                          {t.keyword.charAt(0).toUpperCase() + t.keyword.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td css={S.td}>
                    {saveState === 'saving' && (
                      <span css={S.savingBadge}>
                        <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
                      </span>
                    )}
                    {saveState === 'saved' && (
                      <span css={S.savedBadge}>
                        <CheckCircle2 size={13} /> Saved
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { C, RADIUS } from '@/styles/tokens'
import type { Difficulty, Track, QuestionType } from '@/types/question'

export interface FilterState {
  search: string
  category: string
  difficulty: Difficulty | 'all'
  type: QuestionType | 'all'
}

interface Props {
  categories: string[]
  filters: FilterState
  onChange: (f: FilterState) => void
  totalShown: number
  totalAll: number
  loading?: boolean
}

const DIFF_LABELS: Record<string, string> = {
  all: 'All Levels',
  beginner: '🟢 Beginner',
  core: '🔵 Core',
  advanced: '🟡 Advanced',
  expert: '🔴 Expert',
}

const DIFF_COLORS: Record<string, string> = {
  beginner: C.accent3,
  core: C.accent,
  advanced: C.accent2,
  expert: C.danger,
}

const TYPE_LABELS: Record<string, string> = {
  all: 'All Types',
  theory: '📖 Theory',
  output: '💻 Output',
  debug: '🐛 Debug',
  coding: '⌨️ Coding',
  system: '🏗️ System',
  behavioral: '🗣️ Behavioral',
}

const S = {
  wrap: css`margin-bottom: 1.25rem;`,

  searchBar: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.xl};
    padding: 0.5rem 0.875rem;
    margin-bottom: 0.75rem;
    transition: border-color 0.15s ease;
    &:focus-within { border-color: ${C.accent}55; }
  `,

  searchInput: css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: white;
    &::placeholder { color: ${C.muted}; }
  `,

  clearBtn: css`
    color: ${C.muted};
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    &:hover { color: white; }
  `,

  row: css`
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    margin-bottom: 0.5rem;
    &::-webkit-scrollbar { display: none; }
  `,

  chip: (active: boolean, activeColor: string) => css`
    flex-shrink: 0;
    padding: 0.25rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 700;
    border: 1px solid ${active ? activeColor + '77' : C.border};
    background: ${active ? activeColor + '1a' : 'transparent'};
    color: ${active ? activeColor : C.muted};
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    &:hover { border-color: ${activeColor + '55'}; color: ${active ? activeColor : 'white'}; }
  `,

  resultCount: css`
    font-size: 0.6875rem;
    color: ${C.muted};
    margin-bottom: 0.875rem;
  `,

  activeCount: css`color: ${C.accent}; font-weight: 700;`,
}

export function defaultFilters(): FilterState {
  return { search: '', category: 'All', difficulty: 'all', type: 'all' }
}

export default function CategoryFilter({
  categories, filters, onChange, totalShown, totalAll, loading
}: Props) {
  function set(partial: Partial<FilterState>) {
    onChange({ ...filters, ...partial })
  }

  const hasActiveFilter = filters.search || filters.category !== 'All' ||
    filters.difficulty !== 'all' || filters.type !== 'all'

  return (
    <div css={S.wrap}>
      {/* Search */}
      <div css={S.searchBar}>
        <Search size={15} color={C.muted} />
        <input
          css={S.searchInput}
          value={filters.search}
          onChange={e => set({ search: e.target.value })}
          placeholder="Search questions…"
        />
        {filters.search && (
          <button css={S.clearBtn} onClick={() => set({ search: '' })}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div css={S.row}>
        {['All', ...categories].map(cat => (
          <button
            key={cat}
            css={S.chip(filters.category === cat, C.accent)}
            onClick={() => set({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty chips */}
      <div css={S.row}>
        {Object.entries(DIFF_LABELS).map(([val, label]) => (
          <button
            key={val}
            css={S.chip(filters.difficulty === val, DIFF_COLORS[val] ?? C.accent)}
            onClick={() => set({ difficulty: val as FilterState['difficulty'] })}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Result count + clear all */}
      <div css={S.resultCount}>
        {loading ? (
          'Loading…'
        ) : (
          <>
            Showing <span css={S.activeCount}>{totalShown}</span> of {totalAll} questions
            {hasActiveFilter && (
              <button
                css={[S.clearBtn, { display: 'inline-flex', marginLeft: '0.625rem', fontSize: '0.6875rem', color: C.accent }]}
                onClick={() => onChange(defaultFilters())}
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
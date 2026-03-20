/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { Search, X, Bookmark } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { Difficulty, QuestionType } from "@/types/question";

export interface FilterState {
  search: string;
  category: string;
  difficulty: Difficulty | "all";
  type: QuestionType | "all";
  showBookmarked: boolean;
}

interface Props {
  categories: string[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalShown: number;
  totalAll: number;
  bookmarkCount: number;
  loading?: boolean;
}

const DIFF_LABELS: Record<string, string> = {
  all: "All Levels",
  beginner: "Beginner",
  core: "Core",
  advanced: "Advanced",
  expert: "Expert",
};

const DIFF_COLORS: Record<string, string> = {
  beginner: C.green,
  core: C.accent,
  advanced: C.amber,
  expert: C.red,
};

const S = {
  wrap: css`
    margin-bottom: 1.125rem;
  `,

  searchBar: css`
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: ${C.bg};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.lg};
    padding: 0.5rem 0.875rem;
    margin-bottom: 0.875rem;
    transition:
      border-color 0.12s ease,
      box-shadow 0.12s ease;
    &:focus-within {
      border-color: ${C.accent};
      box-shadow: 0 0 0 2px ${C.accentSubtle};
    }
  `,

  searchInput: css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: ${C.text};
    &::placeholder {
      color: ${C.placeholder};
    }
  `,

  clearBtn: css`
    color: ${C.muted};
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    transition: color 0.12s ease;
    &:hover {
      color: ${C.text};
    }
  `,

  row: css`
    display: flex;
    gap: 0.375rem;
    overflow-x: auto;
    scrollbar-width: none;
    margin-bottom: 0.5rem;
    padding-bottom: 0.125rem;
    &::-webkit-scrollbar {
      display: none;
    }
    -webkit-overflow-scrolling: touch;
  `,

  chip: (active: boolean, activeColor: string) => css`
    flex-shrink: 0;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.6875rem;
    font-weight: 500;
    border: 1px solid ${active ? activeColor : C.border};
    background: ${active ? C.accentSubtle : "transparent"};
    color: ${active ? activeColor : C.muted};
    cursor: pointer;
    transition: all 0.12s ease;
    white-space: nowrap;
    &:hover {
      border-color: ${activeColor};
      color: ${activeColor};
      background: ${C.accentSubtle};
    }
  `,

  bookmarkChip: (active: boolean) => css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.6875rem;
    font-weight: 500;
    border: 1px solid ${active ? C.amber : C.border};
    background: ${active ? C.amberSubtle : "transparent"};
    color: ${active ? C.amber : C.muted};
    cursor: pointer;
    transition: all 0.12s ease;
    white-space: nowrap;
    &:hover {
      border-color: ${C.amber};
      color: ${C.amber};
      background: ${C.amberSubtle};
    }
  `,

  resultCount: css`
    font-size: 0.6875rem;
    color: ${C.muted};
    margin-bottom: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  `,

  activeCount: css`
    color: ${C.text};
    font-weight: 600;
  `,
};

export function defaultFilters(): FilterState {
  return {
    search: "",
    category: "All",
    difficulty: "all",
    type: "all",
    showBookmarked: false,
  };
}

export default function CategoryFilter({
  categories,
  filters,
  onChange,
  totalShown,
  totalAll,
  bookmarkCount,
  loading,
}: Props) {
  function set(partial: Partial<FilterState>) {
    onChange({ ...filters, ...partial });
  }

  const hasActiveFilter =
    filters.search ||
    filters.category !== "All" ||
    filters.difficulty !== "all" ||
    filters.type !== "all" ||
    filters.showBookmarked;

  return (
    <div css={S.wrap}>
      {/* Search */}
      <div css={S.searchBar}>
        <Search size={15} color={C.muted} />
        <input
          css={S.searchInput}
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search questions…"
        />
        {filters.search && (
          <button css={S.clearBtn} onClick={() => set({ search: "" })}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Bookmark + Category row */}
      <div css={S.row}>
        <button
          css={S.bookmarkChip(filters.showBookmarked)}
          onClick={() => set({ showBookmarked: !filters.showBookmarked })}
          title="Show only bookmarked questions"
        >
          <Bookmark size={10} />
          Saved{bookmarkCount > 0 ? ` (${bookmarkCount})` : ""}
        </button>
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            css={S.chip(
              filters.category === cat && !filters.showBookmarked,
              C.accent,
            )}
            onClick={() => set({ category: cat, showBookmarked: false })}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty row — emoji removed, plain text labels */}
      <div css={S.row}>
        {Object.entries(DIFF_LABELS).map(([val, label]) => (
          <button
            key={val}
            css={S.chip(
              filters.difficulty === val,
              DIFF_COLORS[val] ?? C.accent,
            )}
            onClick={() =>
              set({ difficulty: val as FilterState["difficulty"] })
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Result count + clear */}
      <div css={S.resultCount}>
        {loading ? (
          <span>Loading…</span>
        ) : (
          <>
            {filters.showBookmarked ? (
              <>
                <span css={S.activeCount}>{totalShown}</span>
                &nbsp;saved question{totalShown !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                Showing&nbsp;<span css={S.activeCount}>{totalShown}</span>
                &nbsp;of {totalAll} questions
              </>
            )}
            {hasActiveFilter && (
              <button
                css={[
                  S.clearBtn,
                  css`
                    display: inline-flex;
                    align-items: center;
                    gap: 0.2rem;
                    margin-left: 0.5rem;
                    font-size: 0.6875rem;
                    color: ${C.accent};
                    &:hover {
                      color: ${C.accentHover};
                    }
                  `,
                ]}
                onClick={() => onChange(defaultFilters())}
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

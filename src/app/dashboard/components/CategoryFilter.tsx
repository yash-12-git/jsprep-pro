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
  showBookmarked: boolean; // when true, only show bookmarked questions
}

interface Props {
  categories: string[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalShown: number;
  totalAll: number;
  bookmarkCount: number; // how many questions are currently bookmarked
  loading?: boolean;
}

const DIFF_LABELS: Record<string, string> = {
  all: "All Levels",
  beginner: "🟢 Beginner",
  core: "🔵 Core",
  advanced: "🟡 Advanced",
  expert: "🔴 Expert",
};

const DIFF_COLORS: Record<string, string> = {
  beginner: C.accent3,
  core: C.accent,
  advanced: C.accent2,
  expert: C.danger,
};

const S = {
  wrap: css`
    margin-bottom: 1.125rem;
  `,

  searchBar: css`
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    padding: 0.625rem 1rem;
    margin-bottom: 0.875rem;
    transition:
      border-color 0.18s ease,
      background 0.18s ease;
    &:focus-within {
      border-color: rgba(124, 106, 247, 0.4);
      background: rgba(124, 106, 247, 0.04);
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
      color: rgba(255, 255, 255, 0.28);
    }
  `,

  clearBtn: css`
    color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    transition: color 0.15s;
    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  `,

  row: css`
    display: flex;
    gap: 0.4375rem;
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
    padding: 0.3125rem 0.875rem;
    border-radius: 100px;
    font-size: 0.6875rem;
    font-weight: 700;
    border: 1px solid ${active ? activeColor + "66" : "rgba(255,255,255,0.08)"};
    background: ${active ? activeColor + "18" : "transparent"};
    color: ${active ? activeColor : "rgba(255,255,255,0.38)"};
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    &:hover {
      border-color: ${activeColor + "55"};
      color: ${active ? activeColor : "rgba(255,255,255,0.75)"};
    }
  `,

  bookmarkChip: (active: boolean) => css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3125rem 0.875rem;
    border-radius: 100px;
    font-size: 0.6875rem;
    font-weight: 700;
    border: 1px solid ${active ? C.accent2 + "66" : "rgba(255,255,255,0.08)"};
    background: ${active ? C.accent2 + "18" : "transparent"};
    color: ${active ? C.accent2 : "rgba(255,255,255,0.38)"};
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    &:hover {
      border-color: ${C.accent2 + "55"};
      color: ${C.accent2};
    }
  `,

  resultCount: css`
    font-size: 0.6875rem;
    color: rgba(255, 255, 255, 0.28);
    margin-bottom: 0.875rem;
  `,

  activeCount: css`
    color: ${C.accent};
    font-weight: 700;
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

      {/* Top row: Bookmark filter + Category chips */}
      <div css={S.row}>
        {/* Bookmark filter — shows count badge when there are bookmarks */}
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

      {/* Difficulty chips */}
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

      {/* Result count + clear all */}
      <div css={S.resultCount}>
        {loading ? (
          "Loading…"
        ) : (
          <>
            {filters.showBookmarked ? (
              <>
                <span css={S.activeCount}>{totalShown}</span> saved question
                {totalShown !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                Showing <span css={S.activeCount}>{totalShown}</span> of{" "}
                {totalAll} questions
              </>
            )}
            {hasActiveFilter && (
              <button
                css={[
                  S.clearBtn,
                  {
                    display: "inline-flex",
                    marginLeft: "0.625rem",
                    fontSize: "0.6875rem",
                    color: C.accent,
                  },
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

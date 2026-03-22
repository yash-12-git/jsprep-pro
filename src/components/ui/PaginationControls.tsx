/** @jsxImportSource @emotion/react */
"use client";

/**
 * components/ui/PaginationControls.tsx
 *
 * Wraps a paginated list with a header row and an optional footer row.
 *
 * Layout:
 *   ┌─ header ────────────────────────────────────────┐
 *   │  "91 questions"                   Page 2 / 7    │
 *   └─────────────────────────────────────────────────┘
 *   {children}   ← question cards rendered here
 *   ┌─ footer (only when totalPages > 1) ─────────────┐
 *   │  ← Prev   1  2  [3]  4  …  7   Next →          │
 *   └─────────────────────────────────────────────────┘
 *
 * Callers no longer need to render the cards separately or duplicate
 * the controls — everything is in one place.
 *
 * Usage:
 *   <PaginationControls page={page} totalPages={totalPages}
 *     totalItems={filtered.length} onPage={goPage}>
 *     {paginated.map(q => <Card key={q.id} ... />)}
 *   </PaginationControls>
 */

import { type ReactNode } from "react";
import { css } from "@emotion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import { buildPages } from "@/hooks/usePagination";

interface Props {
  page: number;
  totalPages: number;
  totalItems: number;
  itemLabel?: string; // singular — "question" | "challenge". Defaults to "question"
  onPage: (n: number) => void;
  children: ReactNode;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const headerRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: ${C.muted};
  padding: 0 0.125rem;
  margin-bottom: 0.75rem;
`;

const headerCount = css`
  font-weight: 600;
  color: ${C.text};
`;

const footerRow = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const prevNextBtn = (enabled: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${C.border};
  background: transparent;
  color: ${enabled ? C.text : C.muted};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: ${enabled ? "pointer" : "default"};
  opacity: ${enabled ? 1 : 0.45};
  transition:
    background 0.12s,
    border-color 0.12s;
  &:hover:not(:disabled) {
    background: ${C.bgHover};
    border-color: ${C.borderStrong};
  }
`;

const pageNumBtn = (active: boolean) => css`
  width: 2rem;
  height: 2rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${active ? C.accent : C.border};
  background: ${active ? C.accentSubtle : "transparent"};
  color: ${active ? C.accentText : C.muted};
  font-size: 0.8125rem;
  font-weight: ${active ? 700 : 500};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.12s,
    border-color 0.12s,
    color 0.12s;
  &:hover {
    background: ${active ? C.accentSubtle : C.bgHover};
    border-color: ${active ? C.accent : C.borderStrong};
    color: ${active ? C.accentText : C.text};
  }
`;

const ellipsis = css`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: ${C.muted};
  pointer-events: none;
`;

const pageNumsRow = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaginationControls({
  page,
  totalPages,
  totalItems,
  itemLabel = "question",
  onPage,
  children,
}: Props) {
  const pages = buildPages(page, totalPages);
  const plural = totalItems !== 1 ? `${itemLabel}s` : itemLabel;

  return (
    <>
      {/* ── Header: count + page indicator ── */}
      <div css={headerRow}>
        <span>
          <span css={headerCount}>{totalItems}</span> {plural}
        </span>
        {totalPages > 1 && (
          <span>
            Page {page} / {totalPages}
          </span>
        )}
      </div>

      {/* ── Children: the actual list items ── */}
      {children}

      {/* ── Footer: only when there is more than one page ── */}
      {totalPages > 1 && (
        <div css={footerRow}>
          <button
            css={prevNextBtn(page > 1)}
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            <ChevronLeft size={14} /> Prev
          </button>

          <div css={pageNumsRow}>
            {pages.map((p, i) =>
              p === "gap" ? (
                <span key={`gap-${i}`} css={ellipsis}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  css={pageNumBtn(p === page)}
                  onClick={() => onPage(p as number)}
                >
                  {p}
                </button>
              ),
            )}
          </div>

          <button
            css={prevNextBtn(page < totalPages)}
            disabled={page >= totalPages}
            onClick={() => onPage(page + 1)}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </>
  );
}

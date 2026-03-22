/**
 * hooks/usePagination.ts
 *
 * Generic pagination hook. Extracted from QuestionList so Output, Debug,
 * and Polyfill pages can reuse the exact same logic without duplication.
 *
 * Usage:
 *   const { page, totalPages, paginated, goPage, buildPages } =
 *     usePagination(filteredQuestions, PAGE_SIZE);
 */

import { useState, useEffect } from "react";

// Re-exported so PaginationControls can use the same type
export type PageItem = number | "gap";

/** Builds the page number list with "gap" placeholders for ellipsis. */
export function buildPages(current: number, total: number): PageItem[] {
  if (total <= 1) return [];

  const visible = new Set<number>();
  visible.add(1);
  visible.add(total);
  for (let d = -1; d <= 1; d++) {
    const p = current + d;
    if (p >= 1 && p <= total) visible.add(p);
  }

  const sorted = [...visible].sort((a, b) => a - b);
  const pages: PageItem[] = [];

  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) pages.push("gap");
    pages.push(p);
  });

  return pages;
}

interface UsePaginationResult<T> {
  page:       number;
  totalPages: number;
  paginated:  T[];
  goPage:     (n: number) => void;
  buildPages: (current: number, total: number) => PageItem[];
}

export function usePagination<T>(
  items:    T[],
  pageSize: number,
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);

  // When the source array changes (e.g. filter applied), snap back to page 1
  useEffect(() => { setPage(1); }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = items.slice((safePage - 1) * pageSize, safePage * pageSize);

  function goPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { page: safePage, totalPages, paginated, goPage, buildPages };
}
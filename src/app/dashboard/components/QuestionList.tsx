/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as S from "@/app/dashboard/styles";
import { TheoryCard } from "@/components/ui/QuestionCards";
import type { Question } from "@/types/question";

interface ProgressIds {
  mastered: Set<string>;
  bookmarked: Set<string>;
  solved: Set<string>;
}

interface Props {
  questions: Question[];
  loading: boolean;
  error: string | null;
  progressIds: ProgressIds;
  onMastered: (id: string) => void;
  onBookmark: (id: string) => void;
}

const PAGE_SIZE = 15;

function buildPages(current: number, total: number): (number | "gap")[] {
  const pages: (number | "gap")[] = [];
  const visible = new Set<number>();
  visible.add(1);
  visible.add(total);
  for (let d = -1; d <= 1; d++) {
    const p = current + d;
    if (p >= 1 && p <= total) visible.add(p);
  }
  const sorted = [...visible].sort((a, b) => a - b);
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) pages.push("gap");
    pages.push(p);
  });
  return pages;
}

export default function QuestionList({
  questions,
  loading,
  error,
  progressIds,
  onMastered,
  onBookmark,
}: Props) {
  const [page, setPage] = useState(1);

  if (loading)
    return (
      <div css={S.list}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} css={S.skeleton} />
        ))}
      </div>
    );

  if (error)
    return (
      <div css={S.errorBox}>
        Failed to load questions: {error}. Check your Firestore connection.
      </div>
    );

  if (questions.length === 0)
    return (
      <div css={S.emptyState}>
        <p css={S.emptyTitle}>No questions match your filters</p>
        <p>Try adjusting the category or difficulty.</p>
      </div>
    );

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const paginated = questions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function goPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div css={S.listHeader}>
        <span>
          <span css={S.listHeaderCount}>{questions.length}</span> question
          {questions.length !== 1 ? "s" : ""}
        </span>
        {totalPages > 1 && (
          <span>
            Page {safePage} / {totalPages}
          </span>
        )}
      </div>

      <div css={S.list}>
        {paginated.map((q, i) => (
          <TheoryCard
            key={q.id}
            q={q}
            index={(safePage - 1) * PAGE_SIZE + i}
            isMastered={progressIds.mastered.has(q.id)}
            isBookmarked={progressIds.bookmarked.has(q.id)}
            isSolved={progressIds.solved.has(q.id)}
            onMastered={() => onMastered(q.id)}
            onBookmark={() => onBookmark(q.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div css={S.pagination}>
          <button
            css={S.pageBtn(safePage > 1)}
            disabled={safePage <= 1}
            onClick={() => goPage(safePage - 1)}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <div css={S.pageDots}>
            {buildPages(safePage, totalPages).map((p, i) =>
              p === "gap" ? (
                <span key={`gap-${i}`} css={S.pageEllipsis}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  css={S.pageNum(p === safePage)}
                  onClick={() => goPage(p)}
                >
                  {p}
                </button>
              ),
            )}
          </div>
          <button
            css={S.pageBtn(safePage < totalPages)}
            disabled={safePage >= totalPages}
            onClick={() => goPage(safePage + 1)}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

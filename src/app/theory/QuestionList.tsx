/** @jsxImportSource @emotion/react */
"use client";

import * as S from "@/app/dashboard/styles";
import { TheoryCard } from "@/components/ui/QuestionCards";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls";
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

const PAGE_SIZE = 10;

export default function QuestionList({
  questions,
  loading,
  error,
  progressIds,
  onMastered,
  onBookmark,
}: Props) {
  const { page, totalPages, paginated, goPage } = usePagination(
    questions,
    PAGE_SIZE,
  );

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

  return (
    <PaginationControls
      page={page}
      totalPages={totalPages}
      totalItems={questions.length}
      itemLabel="question"
      onPage={goPage}
    >
      <div css={S.list}>
        {paginated.map((q, i) => (
          <TheoryCard
            key={q.id}
            q={q}
            index={(page - 1) * PAGE_SIZE + i}
            isMastered={progressIds.mastered.has(q.id)}
            isBookmarked={progressIds.bookmarked.has(q.id)}
            isSolved={progressIds.solved.has(q.id)}
            onMastered={() => onMastered(q.id)}
            onBookmark={() => onBookmark(q.id)}
          />
        ))}
      </div>
    </PaginationControls>
  );
}

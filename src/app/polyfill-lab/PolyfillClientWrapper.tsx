/** @jsxImportSource @emotion/react */
"use client";

import SignInPrompt from "@/components/ui/SignInPrompt";
import { useState, useEffect, useMemo } from "react";
import { css } from "@emotion/react";
import { FlaskConical } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import * as Shared from "@/styles/shared";
import { useAuth } from "@/hooks/useAuth";
import PolyfillCard from "@/components/ui/QuestionCards/PolyfillCard";
import { useUserProgress } from "@/hooks/useQuestions";
import PageGuard from "@/components/ui/PageGuard";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls";
import CategoryFilter, {
  defaultFilters,
  type FilterState,
} from "@/app/theory/CategoryFilter";
import { Question } from "@/types/question";

const PAGE_SIZE = 10;

export default function PolyfillLabClientPage({
  categories,
  questions,
}: {
  categories: string[];
  questions: Question[];
}) {
  const { user, progress, loading: authLoading } = useAuth();

  const {
    isSolved,
    isRevealed,
    recordSolved,
    recordRevealed,
    solvedIds,
    bookmarkIds,
  } = useUserProgress({ uid: user?.uid ?? null });

  const [filters, setFilters] = useState<FilterState>(defaultFilters());

  const bookmarkedSet = useMemo(
    () => new Set(bookmarkIds ?? []),
    [bookmarkIds],
  );

  const filtered = useMemo(() => {
    let qs = questions;

    if (filters.showBookmarked) {
      return qs.filter((q) => bookmarkedSet.has(q.id));
    }
    if (filters.category !== "All") {
      qs = qs.filter((q) => q.category === filters.category);
    }
    if (filters.difficulty !== "all") {
      qs = qs.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      qs = qs.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.category.toLowerCase().includes(term) ||
          (q.tags ?? []).some((t) => t.toLowerCase().includes(term)),
      );
    }
    return qs;
  }, [questions, filters, bookmarkedSet]);

  const { page, totalPages, paginated, goPage } = usePagination(
    filtered,
    PAGE_SIZE,
  );

  const isPro = progress?.isPro ?? false;
  const solvedCount = solvedIds.filter((id) =>
    questions.some((q) => q.id === id),
  ).length;
  const pct =
    questions.length > 0
      ? Math.round((solvedCount / questions.length) * 100)
      : 0;

  return (
    <PageGuard loading={authLoading || (!!user && !progress)} ready>
      <>
        <div css={Shared.pageWrapper}>
          <div css={Shared.pageHeader}>
            <div css={Shared.pageHeaderTop}>
              <div css={Shared.iconBox(C.green)}>
                <FlaskConical size={18} color={C.green} />
              </div>
              <div>
                <h1 css={Shared.pageTitleText}>Polyfill Lab</h1>
                <p css={Shared.pageSubtitleText}>
                  Implement JavaScript built-ins from scratch:{" "}
                  {questions.length} challenges. Array.map, Function.bind,
                  Promise.all, debounce, curry, EventEmitter and more.
                </p>
              </div>
            </div>
            <div css={Shared.pageProgressRow}>
              <div css={Shared.progressBarTrack}>
                <div css={Shared.progressBarFill(pct)} />
              </div>
              <span css={Shared.pageProgressCount(C.green)}>
                {solvedCount}/{questions.length} solved
              </span>
            </div>
          </div>

          <SignInPrompt message="Every polyfill challenge is free. Sign in to save your progress and keep a streak." />

          <CategoryFilter
            categories={categories}
            filters={filters}
            onChange={setFilters}
            totalShown={filtered.length}
            totalAll={questions.length}
            bookmarkCount={bookmarkIds?.length ?? 0}
            loading={false}
          />

          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemLabel="challenge"
            onPage={goPage}
          >
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {paginated.map((q) => {
                const globalIdx = questions.indexOf(q);
                return (
                  <PolyfillCard
                    key={q.id}
                    q={q}
                    index={globalIdx}
                    isSolved={isSolved}
                    isRevealed={isRevealed}
                    recordSolved={recordSolved}
                    recordRevealed={recordRevealed}
                    isPro={isPro}
                  />
                );
              })}
            </div>
          </PaginationControls>
        </div>
      </>
    </PageGuard>
  );
}

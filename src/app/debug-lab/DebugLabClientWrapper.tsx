/** @jsxImportSource @emotion/react */
"use client";

import SignInPrompt from "@/components/ui/SignInPrompt";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useQuestions";
import PageGuard from "@/components/ui/PageGuard";
import { Bug } from "lucide-react";
import { DebugCard } from "@/components/ui/QuestionCards";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls";
import CategoryFilter, {
  defaultFilters,
  type FilterState,
} from "@/app/theory/CategoryFilter";
import { Question } from "@/types/question";

const PAGE_SIZE = 10;

export default function DebugLabClientPage({
  debugQuestions: questions,
  categories,
}: {
  debugQuestions: Question[];
  categories: string[];
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
  const [showPaywall, setShowPaywall] = useState(false);


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
        {showPaywall && (
          <PaywallBanner
            reason="You've used today's 5 free AI code checks. Pro has no daily cap."
            onClose={() => setShowPaywall(false)}
          />
        )}

        <div css={Shared.pageWrapper}>
          <div css={Shared.pageHeader}>
            <div css={Shared.pageHeaderTop}>
              <div css={Shared.iconBox(C.red)}>
                <Bug size={18} color={C.red} />
              </div>
              <div>
                <h1 css={Shared.pageTitleText}>Debug Lab</h1>
                <p css={Shared.pageSubtitleText}>
                  Find the bug → fix the code → AI checks your solution
                </p>
              </div>
            </div>
            <div css={Shared.pageProgressRow}>
              <div css={Shared.progressBarTrack}>
                <div css={Shared.progressBarFill(pct)} />
              </div>
              <span css={Shared.pageProgressCount(C.red)}>
                {solvedCount}/{questions.length} fixed
              </span>
            </div>
          </div>

          <SignInPrompt message="Every debug challenge is free. Sign in to get AI checks on your fixes and save your progress." />

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
                  <DebugCard
                    key={q.id}
                    q={q}
                    index={globalIdx}
                    isPro={!!progress?.isPro}
                    isLoggedIn={!!user}
                    isSolved={isSolved}
                    isRevealed={isRevealed}
                    recordSolved={recordSolved}
                    recordRevealed={recordRevealed}
                    onPaywall={() => setShowPaywall(true)}
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

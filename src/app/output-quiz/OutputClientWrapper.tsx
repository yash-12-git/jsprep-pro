/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useQuestions";
import PageGuard from "@/components/ui/PageGuard";
import { Code2 } from "lucide-react";
import { OutputCard } from "@/components/ui/QuestionCards";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls";
import CategoryFilter, {
  defaultFilters,
  type FilterState,
} from "@/app/theory/CategoryFilter";
import { useTrack } from "@/contexts/TrackContext";
import { Question } from "@/types/question";

const FREE_OUTPUT_LIMIT = 5;
const PAGE_SIZE = 10;

export default function OutputQuizClientPage({
  outputQuestions: questions,
  categories,
}: {
  categories: string[];
  outputQuestions: Question[];
}) {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

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

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const bookmarkedSet = useMemo(
    () => new Set(bookmarkIds ?? []),
    [bookmarkIds],
  );

  // Full filter logic — mirrors DashboardPage
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
    <PageGuard loading={authLoading || !user || !progress} ready={!!progress}>
      <>
        {showPaywall && (
          <PaywallBanner
            reason={`Free users can attempt the first ${FREE_OUTPUT_LIMIT} output questions. Upgrade for all!`}
            onClose={() => setShowPaywall(false)}
          />
        )}

        <div css={Shared.pageWrapper}>
          <div css={Shared.pageHeader}>
            <div css={Shared.pageHeaderTop}>
              <div css={Shared.iconBox(C.amber)}>
                <Code2 size={18} color={C.amber} />
              </div>
              <div>
                <h1 css={Shared.pageTitleText}>What&apos;s the Output?</h1>
                <p css={Shared.pageSubtitleText}>
                  Read the code → predict the output → progress saved
                  automatically
                </p>
              </div>
            </div>
            <div css={Shared.pageProgressRow}>
              <div css={Shared.progressBarTrack}>
                <div css={Shared.progressBarFill(pct)} />
              </div>
              <span css={Shared.pageProgressCount(C.amber)}>
                {solvedCount}/{questions.length} solved
              </span>
            </div>
          </div>

          {/* Full filter — same component as theory page */}
          <CategoryFilter
            categories={categories}
            filters={filters}
            onChange={(f) => {
              setFilters(f);
            }}
            totalShown={filtered.length}
            totalAll={questions.length}
            bookmarkCount={bookmarkIds?.length ?? 0}
            loading={false}
          />

          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemLabel="question"
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
                  <OutputCard
                    key={q.id}
                    q={q}
                    index={globalIdx}
                    isSolved={isSolved}
                    isRevealed={isRevealed}
                    recordSolved={recordSolved}
                    recordRevealed={recordRevealed}
                    isLocked={
                      !progress?.isPro && globalIdx >= FREE_OUTPUT_LIMIT
                    }
                    isPro={!!progress?.isPro}
                    onPaywall={() => setShowPaywall(true)}
                  />
                );
              })}
            </div>
          </PaginationControls>

          {!progress?.isPro && (
            <div css={Shared.proNudge}>
              <span>
                🔒 First {FREE_OUTPUT_LIMIT} challenges free —{" "}
                {questions.length - FREE_OUTPUT_LIMIT} more with Pro
              </span>
              <button
                css={Shared.upgradeBtn}
                onClick={() => setShowPaywall(true)}
              >
                Unlock All {questions.length} →
              </button>
            </div>
          )}
        </div>
      </>
    </PageGuard>
  );
}

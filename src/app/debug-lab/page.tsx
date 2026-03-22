/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCategories, useUserProgress } from "@/hooks/useQuestions";
import { useAllQuestions } from "@/contexts/QuestionsContext";
import PageGuard from "@/components/ui/PageGuard";
import { Bug } from "lucide-react";
import { DebugCard } from "@/components/ui/QuestionCards";
import * as Shared from "@/styles/shared";
import { C, RADIUS } from "@/styles/tokens";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls";
import CategoryFilter, {
  defaultFilters,
  type FilterState,
} from "@/app/theory/CategoryFilter";

const FREE_DEBUG_LIMIT = 5;
const PAGE_SIZE = 10;

export default function DebugLabPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  const { debugQs: questions, loading: qLoading } = useAllQuestions();
  const { categories } = useCategories("debug", "javascript");
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
            reason={`Free users get ${FREE_DEBUG_LIMIT} debug challenges. Upgrade for all + AI checking!`}
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

          <CategoryFilter
            categories={categories}
            filters={filters}
            onChange={setFilters}
            totalShown={filtered.length}
            totalAll={questions.length}
            bookmarkCount={bookmarkIds?.length ?? 0}
            loading={qLoading}
          />

          {qLoading && (
            <div
              css={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  css={{
                    height: "5rem",
                    borderRadius: RADIUS.lg,
                    background: C.bgSubtle,
                    border: `1px solid ${C.border}`,
                  }}
                />
              ))}
            </div>
          )}

          {!qLoading && (
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
                      isLocked={
                        !progress?.isPro && globalIdx >= FREE_DEBUG_LIMIT
                      }
                      onPaywall={() => setShowPaywall(true)}
                    />
                  );
                })}
              </div>
            </PaginationControls>
          )}

          {!progress?.isPro && (
            <div css={Shared.proNudge}>
              <span>
                🔒 First {FREE_DEBUG_LIMIT} challenges free —{" "}
                {questions.length - FREE_DEBUG_LIMIT} more with Pro
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

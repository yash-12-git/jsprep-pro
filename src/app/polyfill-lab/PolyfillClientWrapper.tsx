/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { css } from "@emotion/react";
import { FlaskConical } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import * as Shared from "@/styles/shared";
import { useAuth } from "@/hooks/useAuth";
import PolyfillCard from "@/components/ui/QuestionCards/PolyfillCard";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { useUserProgress } from "@/hooks/useQuestions";
import PageGuard from "@/components/ui/PageGuard";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls";
import CategoryFilter, {
  defaultFilters,
  type FilterState,
} from "@/app/theory/CategoryFilter";
import { Question } from "@/types/question";

const FREE_LIMIT = 5;
const PAGE_SIZE = 10;

const COMPANIES = [
  "Razorpay",
  "Flipkart",
  "Google",
  "Amazon",
  "Atlassian",
  "Microsoft",
  "CRED",
  "Swiggy",
];

const companyStrip = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`;
const coBadge = css`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: 9999px;
  color: ${C.text};
`;

export default function PolyfillLabClientPage({
  categories,
  questions,
}: {
  categories: string[];
  questions: Question[];
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
    <PageGuard loading={authLoading || !user || !progress} ready={!!progress}>
      <>
        {showPaywall && (
          <PaywallBanner
            reason={`Free users can attempt the first ${FREE_LIMIT} polyfill questions. Upgrade for all!`}
            onClose={() => setShowPaywall(false)}
          />
        )}

        <div css={Shared.pageWrapper}>
          <div css={Shared.pageHeader}>
            <div css={Shared.pageHeaderTop}>
              <div css={Shared.iconBox(C.green)}>
                <FlaskConical size={18} color={C.green} />
              </div>
              <div>
                <h1 css={Shared.pageTitleText}>Polyfill Lab</h1>
                <p css={Shared.pageSubtitleText}>
                  Implement JavaScript built-ins from scratch —{" "}
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

          {/* Company strip — unique to Polyfill */}
          <div css={companyStrip}>
            <span
              css={{
                fontSize: "0.75rem",
                color: C.muted,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              🏢 Asked at:
            </span>
            {COMPANIES.map((c) => (
              <span key={c} css={coBadge}>
                {c}
              </span>
            ))}
          </div>

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
                    isLocked={!isPro && globalIdx >= FREE_LIMIT}
                    isPro={isPro}
                    onPaywall={() => setShowPaywall(true)}
                  />
                );
              })}
            </div>
          </PaginationControls>

          {!isPro && (
            <div css={Shared.proNudge}>
              <span>
                🔒 First {FREE_LIMIT} challenges free —{" "}
                {questions.length - FREE_LIMIT} more with Pro
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

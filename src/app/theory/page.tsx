/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCategories, useUserProgress } from "@/hooks/useQuestions";
import { useAllQuestions } from "@/contexts/QuestionsContext";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import QuestionList from "./QuestionList";
import CategoryFilter, {
  defaultFilters,
  type FilterState,
} from "./CategoryFilter";

export default function DashboardPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  const { theoryQs: questions, loading: qLoading } = useAllQuestions();
  const { categories } = useCategories("theory", "javascript");
  const {
    loading: pLoading,
    masteredIds,
    bookmarkIds,
    solvedIds,
    toggleMastered,
    toggleBookmark,
  } = useUserProgress({ uid: user?.uid ?? null });

  const [filters, setFilters] = useState<FilterState>(defaultFilters());

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const masteredCount = masteredIds.length;
  const totalQ = questions.length;
  const pct = totalQ > 0 ? Math.round((masteredCount / totalQ) * 100) : 0;

  const progressIds = useMemo(
    () => ({
      mastered: new Set(masteredIds),
      bookmarked: new Set(bookmarkIds),
      solved: new Set(solvedIds),
    }),
    [masteredIds, bookmarkIds, solvedIds],
  );

  const filtered = useMemo(() => {
    let qs = questions;
    if (filters.showBookmarked)
      return qs.filter((q) => progressIds.bookmarked.has(q.id));
    if (filters.category !== "All")
      qs = qs.filter((q) => q.category === filters.category);
    if (filters.difficulty !== "all")
      qs = qs.filter((q) => q.difficulty === filters.difficulty);
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      qs = qs.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.category.toLowerCase().includes(term) ||
          q.tags.some((t) => t.toLowerCase().includes(term)),
      );
    }
    return qs;
  }, [questions, filters, progressIds.bookmarked]);

  const handleMastered = useCallback(
    (id: string) => toggleMastered(id),
    [toggleMastered],
  );
  const handleBookmark = useCallback(
    (id: string) => toggleBookmark(id),
    [toggleBookmark],
  );

  if (authLoading || !user || !progress) {
    return (
      <div css={Shared.spinner}>
        <div css={Shared.spinnerDot} />
      </div>
    );
  }

  return (
    <div css={Shared.pageWrapper}>
      <div css={Shared.pageHeader}>
        <div css={Shared.pageHeaderTop}>
          <div css={Shared.iconBox(C.accent)}>
            <span style={{ fontSize: "1.125rem" }}>📖</span>
          </div>
          <div>
            <h1 css={Shared.pageTitleText}>Theory Questions</h1>
            <p css={Shared.pageSubtitleText}>
              Master JS concepts · answers + AI evaluation
            </p>
          </div>
        </div>
        <div css={Shared.pageProgressRow}>
          <div css={Shared.progressBarTrack}>
            <div css={Shared.progressBarFill(pct)} />
          </div>
          <span css={Shared.pageProgressCount(C.accent)}>
            {masteredCount}/{totalQ} mastered
          </span>
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        filters={filters}
        onChange={setFilters}
        totalShown={filtered.length}
        totalAll={questions.length}
        bookmarkCount={bookmarkIds.length}
        loading={qLoading || pLoading}
      />

      <QuestionList
        key={`${filters.category}|${filters.difficulty}|${filters.search}|${filters.showBookmarked}`}
        questions={filtered}
        loading={qLoading || pLoading}
        error={null}
        progressIds={progressIds}
        onMastered={handleMastered}
        onBookmark={handleBookmark}
      />
    </div>
  );
}

/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  useQuestions,
  useCategories,
  useUserProgress,
} from "@/hooks/useQuestions";
import {
  BookOpen,
  Home,
  Layers,
  Trophy
} from "lucide-react";
import * as ST from "./tab.styles";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import DashboardHeader from "./components/DashboardHeader";
import QuestionList from "./components/QuestionList";
import CategoryFilter, {
  defaultFilters,
  type FilterState,
} from "./components/CategoryFilter";
import LearnSection from "./components/LearnSection";
import QuestionOfTheDay from "./components/QuestionOfTheDay";
import Leaderboard from "./components/Leaderboard";

// ─── Constants ────────────────────────────────────────────────────────────────

type Tab = "home" | "practice" | "learn" | "community";

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "practice", label: "Practice", Icon: BookOpen },
  { id: "learn", label: "Learn", Icon: Layers },
  { id: "community", label: "Community", Icon: Trophy },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    questions,
    loading: qLoading,
    error: qError,
  } = useQuestions({
    type: "theory",
    track: "javascript",
    enabled: !!user,
  });
  const { categories } = useCategories("theory", "javascript");
  const {
    loading: pLoading,
    masteredIds,
    bookmarkIds,
    solvedIds,
    toggleMastered,
    toggleBookmark,
  } = useUserProgress({ uid: user?.uid ?? null });

  const [tab, setTab] = useState<Tab>("home");
  const [filters, setFilters] = useState<FilterState>(defaultFilters());

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  // Reset filters + scroll to top on tab change
  const switchTab = useCallback((t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (t !== "practice") setFilters(defaultFilters());
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const masteredCount = masteredIds.length;
  const isNewUser = masteredCount === 0 && !qLoading;

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
    // Bookmark filter takes priority over all others — shows only saved questions
    if (filters.showBookmarked) {
      return qs.filter((q) => progressIds.bookmarked.has(q.id));
    }
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

  // ── Progress handlers — Pro check is inside TheoryCard, not here ─────────
  async function handleMastered(questionId: string) {
    await toggleMastered(questionId);
  }

  async function handleBookmark(questionId: string) {
    await toggleBookmark(questionId);
  }

    if (authLoading || !user || !progress) {
    return (
      <div css={Shared.spinner}>
        <div css={Shared.spinnerDot} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div css={ST.pageShell}>
      {/* Ambient glows */}
      <div css={ST.purpleGlow} />
      <div css={ST.greenGlow} />

      <div css={ST.content}>
        {/* ── Header ── */}
        <DashboardHeader
          user={user}
          progress={progress}
          totalQuestions={questions.length}
          masteredCount={masteredCount}
        />

        {/* ── Desktop tab nav (hidden on mobile) ── */}
        <div css={ST.desktopNav}>
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              css={[ST.desktopBtn, tab === id && ST.desktopBtnActive]}
              onClick={() => switchTab(id)}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ══════════ HOME ══════════ */}
        {tab === "home" && (
          <div>
            <QuestionOfTheDay isPro={progress.isPro} />

            {/* Stats row */}
            {!isNewUser && (
              <div css={ST.statsRow}>
                <div css={ST.statCell}>
                  <div css={ST.statNumber(C.accent3)}>{masteredCount}</div>
                  <div css={ST.statLabel}>Mastered</div>
                </div>
                <div css={ST.statCell}>
                  <div css={ST.statNumber(C.accent2)}>
                    {progress.streakDays}
                  </div>
                  <div css={ST.statLabel}>Day Streak</div>
                </div>
                <div css={ST.statCell}>
                  <div css={ST.statNumber(C.muted)}>
                    {Math.max(0, questions.length - masteredCount)}
                  </div>
                  <div css={ST.statLabel}>Remaining</div>
                </div>
              </div>
            )}

            <button css={ST.jumpBtn} onClick={() => switchTab("practice")}>
              <BookOpen size={15} />
              {masteredCount > 0
                ? "Continue practising →"
                : "Start practising →"}
            </button>
          </div>
        )}

        {/* ══════════ PRACTICE ══════════ */}
        {tab === "practice" && (
          <div>
            <CategoryFilter
              categories={categories}
              filters={filters}
              onChange={(f) => setFilters(f)}
              totalShown={filtered.length}
              totalAll={questions.length}
              bookmarkCount={bookmarkIds.length}
              loading={qLoading || pLoading}
            />
            <QuestionList
              key={`${filters.category}|${filters.difficulty}|${filters.search}`}
              questions={filtered}
              loading={qLoading || pLoading}
              error={qError}
              progressIds={progressIds}
              onMastered={handleMastered}
              onBookmark={handleBookmark}
            />
          </div>
        )}

        {/* ══════════ LEARN ══════════ */}
        {tab === "learn" && <LearnSection />}

        {/* ══════════ COMMUNITY ══════════ */}
        {tab === "community" && <Leaderboard currentUid={user.uid} />}
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav css={ST.mobileNav}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            css={[ST.mobileNavBtn, tab === id && ST.mobileNavBtnActive]}
            onClick={() => switchTab(id)}
          >
            {tab === id && <span css={ST.mobileNavDot} />}
            <Icon size={20} />
            <span css={ST.mobileNavLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

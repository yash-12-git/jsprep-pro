/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
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

const FREE_DEBUG_LIMIT = 5;

export default function DebugLabPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  const { debugQs: questions, loading: qLoading } = useAllQuestions();
  const { categories } = useCategories("debug", "javascript");
  const { isSolved, isRevealed, recordSolved, recordRevealed, solvedIds } =
    useUserProgress({ uid: user?.uid ?? null });

  const [activeCategory, setActiveCategory] = useState("All");
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const filtered =
    activeCategory === "All"
      ? questions
      : questions.filter((q) => q.category === activeCategory);

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
              {/* C.danger → C.red */}
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

          {/* Category chips */}
          <div css={Shared.categoryScroll}>
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                css={Shared.categoryChip(activeCategory === cat, C.red)}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skeletons — visible on white */}
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
            <div
              css={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              {filtered.map((q, idx) => {
                const globalIdx = questions.indexOf(q);
                const isLocked =
                  !progress?.isPro && globalIdx >= FREE_DEBUG_LIMIT;
                return (
                  <DebugCard
                    key={q.id}
                    q={q}
                    index={idx}
                    isPro={!!progress?.isPro}
                    isLoggedIn={!!user}
                    isSolved={isSolved}
                    isRevealed={isRevealed}
                    recordSolved={recordSolved}
                    recordRevealed={recordRevealed}
                    isLocked={isLocked}
                    onPaywall={() => setShowPaywall(true)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </>
    </PageGuard>
  );
}

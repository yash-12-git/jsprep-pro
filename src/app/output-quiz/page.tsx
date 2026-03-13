/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCategories, useUserProgress } from "@/hooks/useQuestions";
import { useAllQuestions } from "@/contexts/QuestionsContext";
import PageGuard from "@/components/ui/PageGuard";
import { Code2 } from "lucide-react";
import { OutputCard } from "@/components/ui/QuestionCards";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import PaywallBanner from "@/components/ui/PaywallBanner/page";

const FREE_OUTPUT_LIMIT = 5;

export default function OutputQuizPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  const { outputQs: questions, loading: qLoading } = useAllQuestions();
  const { categories } = useCategories("output", "javascript");
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
            reason={`Free users can attempt the first ${FREE_OUTPUT_LIMIT} output questions. Upgrade for all!`}
            onClose={() => setShowPaywall(false)}
          />
        )}
        <div css={Shared.pageWrapper}>
          <div css={Shared.pageHeader}>
            <div css={Shared.pageHeaderTop}>
              <div css={Shared.iconBox(C.accent2)}>
                <Code2 size={18} color={C.accent2} />
              </div>
              <div css={{}}>
                <h1 css={Shared.pageTitleText}>What's the Output?</h1>
                <p css={Shared.pageSubtitleText}>
                  Read the code → predict the output → progress saved
                  automatically
                </p>
              </div>
            </div>
            <div css={Shared.pageProgressRow}>
              <div css={Shared.progressBarTrack}>
                <div
                  css={Shared.progressBarFill(
                    pct,
                    `linear-gradient(90deg, ${C.accent2}, ${C.accent3})`,
                  )}
                />
              </div>
              <span css={Shared.pageProgressCount(C.accent2)}>
                {solvedCount}/{questions.length} solved
              </span>
            </div>
          </div>

          <div css={Shared.categoryScroll}>
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                css={Shared.categoryChip(activeCategory === cat, C.accent2)}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {qLoading && (
            <div
              css={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  css={{
                    height: "5rem",
                    borderRadius: "1rem",
                    background: C.card,
                  }}
                />
              ))}
            </div>
          )}

          {!qLoading && (
            <div
              css={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {filtered.map((q, idx) => {
                const globalIdx = questions.indexOf(q);
                const isLocked =
                  !progress?.isPro && globalIdx >= FREE_OUTPUT_LIMIT;
                return (
                  <OutputCard
                    key={q.id}
                    q={q}
                    index={idx}
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

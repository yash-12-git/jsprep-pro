/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  useQuestions,
  useCategories,
  useUserProgress,
} from "@/hooks/useQuestions";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import { Bug } from "lucide-react";
import { DebugCard } from "@/components/ui/QuestionCards";
import * as S from "./styles";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";

const FREE_DEBUG_LIMIT = 5;

export default function DebugLabPage() {
  const { user, progress, loading: authLoading } = useAuth();
  const router = useRouter();

  const { questions, loading: qLoading } = useQuestions({
    type: "debug",
    track: "javascript",
    enabled: !!user,
  });
  const { categories } = useCategories("debug", "javascript");
  const { isSolved, isRevealed, recordSolved, recordRevealed, solvedIds } =
    useUserProgress({ uid: user?.uid ?? null });

  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  if (authLoading || !user || !progress)
    return (
      <div css={Shared.spinner}>
        <div css={Shared.spinnerDot} />
      </div>
    );

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
    <>
      {showPaywall && (
        <PaywallBanner
          reason={`Free users get ${FREE_DEBUG_LIMIT} debug challenges. Upgrade for all + AI checking!`}
          onClose={() => setShowPaywall(false)}
        />
      )}
      <div css={Shared.pageWrapper}>
        <div css={S.header}>
          <div css={S.headerTop}>
            <div css={Shared.iconBox(C.danger)}>
              <Bug size={18} color={C.danger} />
            </div>
            <div>
              <h1 css={S.pageTitle}>Debug Lab</h1>
              <p css={S.pageSubtitle}>
                Find the bug → fix the code → AI checks your solution
              </p>
            </div>
          </div>
          <div css={S.progressRow}>
            <div css={Shared.progressBarTrack}>
              <div
                css={Shared.progressBarFill(
                  pct,
                  `linear-gradient(90deg, ${C.danger}, ${C.accent2})`,
                )}
              />
            </div>
            <span css={S.progressCount}>
              {solvedCount}/{questions.length} fixed
            </span>
          </div>
        </div>

        <div css={Shared.categoryScroll}>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              css={Shared.categoryChip(activeCategory === cat, C.danger)}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {qLoading && (
          <div css={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
          <div css={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map((q, idx) => {
              const globalIdx = questions.indexOf(q);
              const isLocked = !progress.isPro && globalIdx >= FREE_DEBUG_LIMIT;
              return (
                <DebugCard
                  key={q.id}
                  q={q}
                  index={idx}
                  isPro={progress.isPro}
                  isSolved={isSolved}
                  isRevealed={isRevealed}
                  recordSolved={recordSolved}
                  recordRevealed={recordRevealed}
                  isLocked={isLocked}
                  onPaywall={() => setShowPaywall(true)}
                  isOpen={openId === q.id}
                  onToggle={() => setOpenId(openId === q.id ? null : q.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

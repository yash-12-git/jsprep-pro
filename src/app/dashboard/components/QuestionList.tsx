/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as S from "@/app/dashboard/styles";
import { TheoryCard } from "@/components/ui/QuestionCards";
import AIChat from "@/components/ui/AIChat/page";
import AnswerEvaluator from "@/components/ui/AnswerEvaluator/page";
import type { Question } from "@/types/question";
import type { UserProgress } from "@/lib/userProgress";

interface ProgressIds {
  mastered: Set<string>;
  bookmarked: Set<string>;
  solved: Set<string>;
}

interface Props {
  questions: Question[];
  loading: boolean;
  error: string | null;
  progress: UserProgress;
  progressIds: ProgressIds;
  onMastered: (id: string) => void;
  onBookmark: (id: string) => void;
  onNeedsPro: (reason: string) => void;
}

const PAGE_SIZE = 15;

function buildPages(current: number, total: number): (number | "gap")[] {
  const pages: (number | "gap")[] = [];
  const visible = new Set<number>();
  visible.add(1);
  visible.add(total);
  for (let d = -1; d <= 1; d++) {
    const p = current + d;
    if (p >= 1 && p <= total) visible.add(p);
  }
  const sorted = [...visible].sort((a, b) => a - b);
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) pages.push("gap");
    pages.push(p);
  });
  return pages;
}

export default function QuestionList({
  questions,
  loading,
  error,
  progress,
  progressIds,
  onMastered,
  onBookmark,
  onNeedsPro,
}: Props) {
  const [page, setPage] = useState(1);
  // Per-card AI panel state — keyed by question id
  const [aiPanels, setAIPanels] = useState<
    Record<string, "chat" | "eval" | null>
  >({});

  function togglePanel(qid: string, panel: "chat" | "eval") {
    setAIPanels((prev) => ({
      ...prev,
      [qid]: prev[qid] === panel ? null : panel,
    }));
  }

  if (loading) {
    return (
      <div css={S.list}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} css={S.skeleton} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div css={S.errorBox}>
        Failed to load questions: {error}. Check your Firestore connection.
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div css={S.emptyState}>
        <p css={S.emptyTitle}>No questions match your filters</p>
        <p>Try adjusting the category or difficulty.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const paginated = questions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function goPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageList = buildPages(safePage, totalPages);

  return (
    <div>
      {/* Meta row */}
      <div css={S.listHeader}>
        <span>
          <span css={S.listHeaderCount}>{questions.length}</span> question
          {questions.length !== 1 ? "s" : ""}
        </span>
        {totalPages > 1 && (
          <span>
            Page {safePage} / {totalPages}
          </span>
        )}
      </div>

      {/* Cards */}
      <div css={S.list}>
        {paginated.map((q, i) => {
          const globalIndex = (safePage - 1) * PAGE_SIZE + i;
          const activePanel = aiPanels[q.id] ?? null;
          return (
            <TheoryCard
              key={q.id}
              q={q}
              index={globalIndex}
              isPro={progress.isPro}
              isLoggedIn={true} // dashboard requires auth — always logged in
              isMastered={progressIds.mastered.has(q.id)}
              isBookmarked={progressIds.bookmarked.has(q.id)}
              isSolved={progressIds.solved.has(q.id)}
              onMastered={() => onMastered(q.id)}
              onBookmark={() => onBookmark(q.id)}
              onPaywall={() =>
                onNeedsPro(
                  "AI features are Pro only. Upgrade for AI tutoring, answer evaluation, and more.",
                )
              }
              activePanel={activePanel}
              onAITutor={() => togglePanel(q.id, "chat")}
              onEvaluate={() => togglePanel(q.id, "eval")}
              aiPanelNode={
                activePanel === "chat" ? (
                  <AIChat
                    question={q.question ?? q.title}
                    answer={q.answer ?? ""}
                    onClose={() =>
                      setAIPanels((prev) => ({ ...prev, [q.id]: null }))
                    }
                  />
                ) : activePanel === "eval" ? (
                  <AnswerEvaluator
                    question={q.question ?? q.title}
                    idealAnswer={q.answer ?? ""}
                    onClose={() =>
                      setAIPanels((prev) => ({ ...prev, [q.id]: null }))
                    }
                  />
                ) : null
              }
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div css={S.pagination}>
          <button
            css={S.pageBtn(safePage > 1)}
            disabled={safePage <= 1}
            onClick={() => goPage(safePage - 1)}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <div css={S.pageDots}>
            {pageList.map((p, i) =>
              p === "gap" ? (
                <span key={`gap-${i}`} css={S.pageEllipsis}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  css={S.pageNum(p === safePage)}
                  onClick={() => goPage(p)}
                >
                  {p}
                </button>
              ),
            )}
          </div>
          <button
            css={S.pageBtn(safePage < totalPages)}
            disabled={safePage >= totalPages}
            onClick={() => goPage(safePage + 1)}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

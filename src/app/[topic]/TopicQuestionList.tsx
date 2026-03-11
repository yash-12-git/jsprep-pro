/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useQuestions";
import {
  TheoryCard,
  OutputCard,
  DebugCard,
} from "@/components/ui/QuestionCards";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import * as S from "./styles";
import type { Question } from "@/types/question";

interface Props {
  questions: Question[];
  topicSlug: string;
}

export default function TopicQuestionList({ questions, topicSlug }: Props) {
  const { user, progress } = useAuth();
  const uid = user?.uid ?? null;
  const isPro = progress?.isPro ?? false;

  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState("");

  const { isSolved, isRevealed, recordSolved, recordRevealed } =
    useUserProgress({ uid });

  function openPaywall(reason: string) {
    setPaywallReason(reason);
    setShowPaywall(true);
  }

  if (questions.length === 0) {
    return (
      <div css={S.emptyState}>
        <p css={S.emptyText}>No questions tagged to this topic yet.</p>
        <p css={S.emptyHint}>
          Tag questions in{" "}
          <a href="/admin/questions" css={S.adminLink}>
            Admin → Questions
          </a>{" "}
          by setting the "Topic Page" field to{" "}
          <code css={S.emptyCode}>{topicSlug}</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      {showPaywall && (
        <PaywallBanner
          reason={paywallReason}
          onClose={() => setShowPaywall(false)}
        />
      )}

      <div css={S.list}>
        {questions.map((q, i) => {
          if (q.type === "output")
            return (
              <OutputCard
                key={q.id}
                q={q}
                index={i}
                isSolved={isSolved}
                isRevealed={isRevealed}
                recordSolved={recordSolved}
                recordRevealed={recordRevealed}
                onPaywall={() =>
                  openPaywall("Upgrade to Pro to unlock all output questions.")
                }
              />
            );

          if (q.type === "debug")
            return (
              <DebugCard
                key={q.id}
                q={q}
                index={i}
                isPro={isPro}
                isLoggedIn={!!user}
                isSolved={isSolved}
                isRevealed={isRevealed}
                recordSolved={recordSolved}
                recordRevealed={recordRevealed}
                onPaywall={() =>
                  openPaywall(
                    "AI fix checking is a Pro feature. Upgrade for instant AI feedback.",
                  )
                }
              />
            );

          // Theory — auth state and PaywallBanner are owned by TheoryCard itself.
          // No auth props needed here.
          return <TheoryCard key={q.id} q={q} index={i} />;
        })}
      </div>
    </>
  );
}

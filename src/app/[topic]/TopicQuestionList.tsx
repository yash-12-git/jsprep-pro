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
import type { Question } from "@/types/question";

interface Props {
  questions: Question[];
  topicSlug: string;
}

export default function TopicQuestionList({ questions, topicSlug }: Props) {
  const { user, progress, loading: authLoading } = useAuth();
  const uid = user?.uid ?? null;
  const isPro = progress?.isPro ?? false;
  const isLoggedIn = !!user;

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
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 8px" }}>
          No questions tagged to this topic yet.
        </p>
        <p style={{ color: "#4b5563", fontSize: 13, margin: 0 }}>
          Tag questions in{" "}
          <a
            href="/admin/questions"
            style={{ color: "#7c6af7", textDecoration: "none" }}
          >
            Admin → Questions
          </a>{" "}
          by setting the "Topic Page" field to{" "}
          <code
            style={{
              background: "rgba(124,106,247,0.15)",
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: 12,
              color: "#c4b5fd",
            }}
          >
            {topicSlug}
          </code>
          .
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

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                isLoggedIn={isLoggedIn}
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

          // theory — AI panel state lives inside TheoryCard
          return (
            <TheoryCard
              key={q.id}
              q={q}
              index={i}
              isPro={isPro}
              isLoggedIn={isLoggedIn}
              authLoading={authLoading}
              onPaywall={() =>
                openPaywall(
                  "AI Tutor and Evaluate Me are Pro features. Upgrade for AI-powered coaching.",
                )
              }
            />
          );
        })}
      </div>
    </>
  );
}

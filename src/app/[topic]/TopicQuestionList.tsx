/** @jsxImportSource @emotion/react */
"use client";

/**
 * TopicQuestionList — renders questions on public topic hub pages.
 *
 * Passes full auth/Pro context to every card type so:
 *   - Theory cards show AI features (Tutor, Evaluate Me) with Pro lock icons for free users
 *   - Output cards can be attempted by anyone, progress tracked if logged in
 *   - Debug cards show AI checking as Pro, sign-in prompt for logged-out users
 *   - PaywallBanner appears inline when free user clicks a Pro feature
 *
 * No hard paywalls on topic pages — these are public SEO pages.
 * Pro features are visible but gated, driving upgrade intent.
 */

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
  const { user, progress } = useAuth();
  const uid = user?.uid ?? null;
  const isPro = progress?.isPro ?? false;
  const isLoggedIn = !!user;

  const [showPaywall, setShowPaywall] = useState(false);

  const { isSolved, isRevealed, recordSolved, recordRevealed } =
    useUserProgress({ uid });

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
          reason="Upgrade to Pro to unlock AI Tutor, answer evaluation, and unlimited progress tracking."
          onClose={() => setShowPaywall(false)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questions.map((q, i) => {
          const progressProps = {
            isSolved,
            isRevealed,
            recordSolved,
            recordRevealed,
          };
          const paywallProps = {
            isPro,
            isLoggedIn,
            onPaywall: () => setShowPaywall(true),
          };

          if (q.type === "output") {
            return (
              <OutputCard
                key={q.id}
                q={q}
                index={i}
                {...progressProps}
                onPaywall={paywallProps.onPaywall}
              />
            );
          }

          if (q.type === "debug") {
            return (
              <DebugCard
                key={q.id}
                q={q}
                index={i}
                {...progressProps}
                isPro={isPro}
                isLoggedIn={isLoggedIn}
                onPaywall={paywallProps.onPaywall}
              />
            );
          }
          // Default: theory
          return (
            <TheoryCard
              key={q.id}
              q={q}
              index={i}
              isPro={isPro}
              isLoggedIn={isLoggedIn}
              onPaywall={() => setShowPaywall(true)}
            />
          );
        })}
      </div>
    </>
  );
}

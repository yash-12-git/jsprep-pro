/** @jsxImportSource @emotion/react */
"use client";

/**
 * TopicQuestionList — renders questions on topic hub pages.
 *
 * Uses the shared QuestionCards components — no duplicated card logic here.
 * Each card manages its own open state (uncontrolled, not accordion mode).
 * No paywall: topic pages are public, all questions fully accessible.
 * Debug AI check still requires Pro — the card handles that itself.
 */

import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useQuestions";
import {
  TheoryCard,
  OutputCard,
  DebugCard,
} from "@/components/ui/QuestionCards";
import type { Question } from "@/types/question";

interface Props {
  questions: Question[];
  topicSlug: string;
}

export default function TopicQuestionList({ questions, topicSlug }: Props) {
  const { user, progress } = useAuth();
  const uid = user?.uid ?? null;
  const isPro = progress?.isPro ?? false;

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
          by setting the &ldquo;Topic Page&rdquo; field to{" "}
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {questions.map((q, i) => {
        const shared = {
          key: q.id,
          q,
          index: i,
          isSolved,
          isRevealed,
          recordSolved,
          recordRevealed,
        };

        if (q.type === "output") return <OutputCard {...shared} />;
        if (q.type === "debug") return <DebugCard {...shared} isPro={isPro} />;
        return <TheoryCard key={q.id} q={q} index={i} />;
      })}
    </div>
  );
}

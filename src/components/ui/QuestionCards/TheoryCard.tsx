/** @jsxImportSource @emotion/react */
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  Sparkles,
  Target,
  Bookmark,
  Zap,
  Star,
} from "lucide-react";
import { C } from "@/styles/tokens";
import { useAuth } from "@/hooks/useAuth";
import MarkdownRenderer from "@/components/md/MarkdownRenderer";
import AIChat from "@/components/ui/AIChat/page";
import AnswerEvaluator from "@/components/ui/AnswerEvaluator/page";
import * as S from "./styles";
import type { Question } from "@/types/question";
import { track } from "@/lib/analytics";

type ActivePanel = "chat" | "eval" | null;

interface Props {
  q: Question;
  index: number;
  isOpen?: boolean;
  onToggle?: () => void;
  isMastered?: boolean;
  isBookmarked?: boolean;
  isSolved?: boolean;
  onMastered?: () => void;
  onBookmark?: () => void;
}

export default function TheoryCard({
  q,
  index,
  isOpen: controlledOpen,
  onToggle,
  isMastered = false,
  isBookmarked = false,
  isSolved = false,
  onMastered,
  onBookmark,
}: Props) {
  const { user, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  const [internalOpen, setInternalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen((o) => !o));
  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;

  // Everything on the card is free with an account. The AI tutor's daily
  // allowance is enforced by /api/ai, which explains it when it runs out.
  function requireSignIn(action: () => void) {
    if (authLoading) return;
    if (!isLoggedIn) {
      window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    action();
  }

  function handleMastered() {
    requireSignIn(() => {
      if (!isMastered)
        track("practice_answered", {
          question_type: "theory",
          track: q.track,
          correct: true,
        });
      onMastered?.();
    });
  }
  function handleBookmark() {
    requireSignIn(() => onBookmark?.());
  }
  function handleAIPanel(panel: "chat" | "eval") {
    requireSignIn(() =>
      setActivePanel((prev) => (prev === panel ? null : panel)),
    );
  }

  return (
    <>
      <div css={S.questionCard(isMastered ? "correct" : "idle", C.accent)}>
        {/* Header */}
        <div css={S.cardHeader} onClick={toggle}>
          <span css={S.qNumber(C.accent)}>
            #{String(index + 1).padStart(2, "0")}
          </span>

          <div css={S.titleMeta}>
            <p css={S.titleRow}>
              {isMastered && <span css={S.masteredCheck(C.green)}>✓</span>}
              {q.title}
            </p>
            <div css={S.badgeRow}>
              <span css={S.diffBadge(ds)}>
                {S.DIFF_LABEL[q.difficulty] ?? q.difficulty}
              </span>
              <span css={S.catBadge(C.accent)}>{q.category}</span>
              {q.hint && <span css={S.hintChip}>{q.hint}</span>}
            </div>
          </div>

          <div css={S.chevronWrapper(isOpen)}>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Body */}
        {isOpen && (
          <div css={S.cardBody}>
            {isMastered && (
              <div css={S.masteredBanner(C.green)}>
                <Star size={12} fill={C.green} color={C.green} /> Marked as
                mastered
              </div>
            )}
            {q.hint && <div css={S.hintBanner(C.green)}>Hint: {q.hint}</div>}

            <div css={S.answerPad}>
              <MarkdownRenderer content={q.answer} />
            </div>

            {/* Action row */}
            <div css={S.actionRowTheory}>
              {onMastered && (
                <button
                  css={S.actionChip(isMastered ? C.green : C.muted, isMastered)}
                  onClick={handleMastered}
                  disabled={authLoading}
                >
                  <CheckCircle size={12} />
                  {isMastered ? "Mastered" : "Mark mastered"}
                </button>
              )}
              {onBookmark && (
                <button
                  css={S.actionChip(
                    isBookmarked ? C.amber : C.muted,
                    isBookmarked,
                  )}
                  onClick={handleBookmark}
                  disabled={authLoading}
                >
                  <Bookmark size={12} />
                  {isBookmarked ? "Saved" : "Bookmark"}
                </button>
              )}
              <button
                css={S.actionChip(
                  activePanel === "chat" ? C.accent : C.muted,
                  activePanel === "chat",
                )}
                onClick={() => handleAIPanel("chat")}
                disabled={authLoading}
              >
                <Sparkles size={12} />
                AI Tutor
              </button>
              <button
                css={S.actionChip(
                  activePanel === "eval" ? C.accentText : C.muted,
                  activePanel === "eval",
                )}
                onClick={() => handleAIPanel("eval")}
                disabled={authLoading}
              >
                <Target size={12} />
                Evaluate Me
              </button>
              {!isLoggedIn && !authLoading && (
                <Link
                  href="/auth"
                  css={[S.actionChip(C.amber, false), S.noUnderline]}
                >
                  <Zap size={11} /> Sign in for AI features
                </Link>
              )}
            </div>

            {activePanel === "chat" && (
              <AIChat
                question={q.question ?? q.title}
                answer={q.answer ?? ""}
                onClose={() => setActivePanel(null)}
              />
            )}
            {activePanel === "eval" && (
              <AnswerEvaluator
                question={q.question ?? q.title}
                idealAnswer={q.answer ?? ""}
                onClose={() => setActivePanel(null)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

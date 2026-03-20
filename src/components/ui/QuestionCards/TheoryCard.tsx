/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  Sparkles,
  Target,
  Bookmark,
  Lock,
  Zap,
  Star,
} from "lucide-react";
import { C } from "@/styles/tokens";
import { useAuth } from "@/hooks/useAuth";
import MarkdownRenderer from "@/components/md/MarkdownRenderer";
import AIChat from "@/components/ui/AIChat/page";
import AnswerEvaluator from "@/components/ui/AnswerEvaluator/page";
import PaywallBanner from "@/components/ui/PaywallBanner/page";
import * as S from "./styles";
import type { Question } from "@/types/question";

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
  const { user, progress, loading: authLoading } = useAuth();
  const isPro = progress?.isPro ?? false;
  const isLoggedIn = !!user;

  const [internalOpen, setInternalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [paywallReason, setPaywallReason] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen((o) => !o));
  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;

  function requirePro(reason: string, action: () => void) {
    if (authLoading) return;
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }
    if (!isPro) {
      setPaywallReason(reason);
      setShowPaywall(true);
      return;
    }
    action();
  }

  function handleMastered() {
    requirePro(
      "Progress tracking is a Pro feature. Upgrade to mark questions as mastered.",
      () => onMastered?.(),
    );
  }
  function handleBookmark() {
    requirePro(
      "Bookmarks are a Pro feature. Upgrade to save questions for quick review.",
      () => onBookmark?.(),
    );
  }
  function handleAIPanel(panel: "chat" | "eval") {
    requirePro(
      panel === "chat"
        ? "AI Tutor is a Pro feature. Upgrade for AI-powered follow-up on any question."
        : "Evaluate Me is a Pro feature. Upgrade to get AI-scored feedback on your answers.",
      () => setActivePanel((prev) => (prev === panel ? null : panel)),
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
              {q.isPro && !isPro && (
                <span css={S.proBadge}>
                  <Zap size={7} /> PRO
                </span>
              )}
              {q.hint && <span css={S.hintChip}>💡 {q.hint}</span>}
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
            {q.hint && <div css={S.hintBanner(C.green)}>💡 Hint: {q.hint}</div>}

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
                  {!authLoading && !isPro && isLoggedIn ? (
                    <Lock size={10} />
                  ) : (
                    <CheckCircle size={12} />
                  )}
                  {isMastered ? "Mastered ✓" : "Mark mastered"}
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
                  {!authLoading && !isPro && isLoggedIn ? (
                    <Lock size={10} />
                  ) : (
                    <Bookmark size={12} />
                  )}
                  {isBookmarked ? "Saved ✓" : "Bookmark"}
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
                {!authLoading && !isPro && isLoggedIn && <Lock size={10} />}
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
                {!authLoading && !isPro && isLoggedIn && <Lock size={10} />}
                Evaluate Me
              </button>
              {!isLoggedIn && !authLoading && (
                <a
                  href="/auth"
                  css={[S.actionChip(C.amber, false), S.noUnderline]}
                >
                  <Zap size={11} /> Sign in for AI features
                </a>
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

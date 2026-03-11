/** @jsxImportSource @emotion/react */
"use client";

/**
 * TheoryCard — unified card for dashboard AND topic pages.
 *
 * Auth state (isPro, isLoggedIn, loading) is read from useAuth() INSIDE this
 * component. Parents never thread auth props down.
 *
 * DESIGN:
 *   Mastered  = "I know this topic." Pro-only. Shows paywall for free/logged-out.
 *               onMastered omitted → button hidden (topic pages).
 *
 *   Bookmark  = "I want to revisit this." Pro-only. Independent of mastered —
 *               a question CAN be both mastered AND bookmarked simultaneously.
 *               onBookmark omitted → button hidden (topic pages).
 *
 *   AI panel  = Pro-only. State lives entirely inside this card.
 *
 * Parent props:
 *   Dashboard : q, index, isMastered, isBookmarked, onMastered, onBookmark
 *   Topic page: q, index  (+ isOpen/onToggle for controlled accordion)
 */

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

  // ── Auth gate — used for every Pro action ─────────────────────────────────
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
      "Progress tracking is a Pro feature. Upgrade to mark questions as mastered and measure your growth.",
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

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {showPaywall && (
        <PaywallBanner
          reason={paywallReason}
          onClose={() => setShowPaywall(false)}
        />
      )}

      <div css={S.questionCard(isMastered ? "correct" : "idle", C.accent)}>
        {/* ── Header ── */}
        <div css={S.cardHeader} onClick={toggle}>
          <span css={S.qNumber(C.accent)}>
            #{String(index + 1).padStart(2, "0")}
          </span>

          <div css={S.titleMeta}>
            <p css={S.titleRow}>
              {isMastered && <span css={S.masteredCheck(C.accent3)}>✓</span>}
              {q.title}
            </p>
            <div css={S.badgeRow}>
              <span css={S.diffBadge(ds)}>
                {S.DIFF_LABEL[q.difficulty] ?? q.difficulty}
              </span>
              <span css={S.catBadge(C.accent)}>{q.category}</span>
              {q.isPro && !isPro && (
                <span css={S.proBadge(C.accent2)}>
                  <Zap size={7} /> PRO
                </span>
              )}
              {q.hint && <span css={S.hintChip}>💡 {q.hint}</span>}
            </div>
          </div>

          <div css={S.chevronWrapper(isOpen)}>
            <ChevronDown size={16} color={C.muted} />
          </div>
        </div>

        {/* ── Body ── */}
        {isOpen && (
          <div css={S.cardBody}>
            {isMastered && (
              <div css={S.masteredBanner(C.accent3)}>
                <Star size={12} fill={C.accent3} /> Marked as mastered
              </div>
            )}

            {q.hint && (
              <div css={S.hintBanner(C.accent3)}>💡 Hint: {q.hint}</div>
            )}

            <div css={S.answerPad}>
              <MarkdownRenderer content={q.answer} />
            </div>

            {/* ── Action row ── */}
            <div css={S.actionRowTheory}>
              {/* Mastered — Pro only, hidden when parent omits onMastered */}
              {onMastered && (
                <button
                  css={S.actionChip(
                    isMastered ? C.accent3 : C.muted,
                    isMastered,
                  )}
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

              {/* Bookmark — Pro only, hidden when parent omits onBookmark.
                  INDEPENDENT of mastered — both can be active at the same time. */}
              {onBookmark && (
                <button
                  css={S.actionChip(
                    isBookmarked ? C.accent2 : C.muted,
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

              {/* AI Tutor — Pro only */}
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

              {/* Evaluate Me — Pro only */}
              <button
                css={S.actionChip(
                  activePanel === "eval" ? C.purple : C.muted,
                  activePanel === "eval",
                )}
                onClick={() => handleAIPanel("eval")}
                disabled={authLoading}
              >
                <Target size={12} />
                {!authLoading && !isPro && isLoggedIn && <Lock size={10} />}
                Evaluate Me
              </button>

              {/* Sign-in nudge — logged-out visitors only */}
              {!isLoggedIn && !authLoading && (
                <a
                  href="/auth"
                  css={[S.actionChip(C.accent2, false), S.noUnderline]}
                >
                  <Zap size={11} /> Sign in for AI features
                </a>
              )}
            </div>

            {/* ── AI panels ── */}
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

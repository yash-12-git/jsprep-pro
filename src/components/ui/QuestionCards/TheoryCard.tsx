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
import MarkdownRenderer from "@/components/md/MarkdownRenderer";
import AIChat from "@/components/ui/AIChat/page";
import AnswerEvaluator from "@/components/ui/AnswerEvaluator/page";
import * as S from "./styles";
import type { Question } from "@/types/question";

/**
 * Unified TheoryCard — used on dashboard AND topic pages.
 *
 * AI panel state lives INSIDE this component. The parent does not coordinate
 * which panel is open — the card is self-contained. This avoids prop-threading
 * bugs where parent re-renders race with local card state.
 *
 * Usage:
 *   Dashboard: pass isMastered, isBookmarked, onMastered, onBookmark
 *   Topic page: omit mastered/bookmark props (buttons auto-hide)
 *   Both: pass isPro, isLoggedIn, authLoading, onPaywall
 */

type ActivePanel = "chat" | "eval" | null;

interface Props {
  q: Question;
  index: number;
  // Controlled open state (accordion mode) — omit for self-managed
  isOpen?: boolean;
  onToggle?: () => void;
  // Progress — dashboard only
  isMastered?: boolean;
  isBookmarked?: boolean;
  isSolved?: boolean;
  onMastered?: () => void;
  onBookmark?: () => void;
  // Auth
  isPro?: boolean;
  isLoggedIn?: boolean;
  authLoading?: boolean;
  onPaywall?: () => void;
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
  isPro = false,
  isLoggedIn = false,
  authLoading = false,
  onPaywall,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  // AI panel state lives HERE — no parent coordination needed
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen((o) => !o));
  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;

  function togglePanel(panel: "chat" | "eval") {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  function handleAIAction(panel: "chat" | "eval") {
    if (authLoading) return;
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }
    if (!isPro) {
      onPaywall?.();
      return;
    }
    togglePanel(panel);
  }

  function handleBookmark() {
    if (authLoading) return;
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }
    if (!isPro) {
      onPaywall?.();
      return;
    }
    onBookmark?.();
  }

  return (
    <div css={S.questionCard(isMastered ? "correct" : "idle", C.accent)}>
      {/* ── Header ── */}
      <div css={S.cardHeader} onClick={toggle}>
        <span css={S.qNumber(C.accent)}>
          #{String(index + 1).padStart(2, "0")}
        </span>
        <div css={{ flex: 1, minWidth: 0 }}>
          <p
            css={{
              fontWeight: 700,
              fontSize: "0.875rem",
              marginBottom: "0.375rem",
              lineHeight: 1.4,
            }}
          >
            {isMastered && (
              <span style={{ color: C.accent3, marginRight: "0.3rem" }}>✓</span>
            )}
            {q.title}
          </p>
          <div css={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              css={{
                fontSize: "0.625rem",
                fontWeight: 700,
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                border: `1px solid ${ds.border}`,
                background: ds.bg,
                color: ds.color,
              }}
            >
              {S.DIFF_LABEL[q.difficulty] ?? q.difficulty}
            </span>
            <span
              css={{
                fontSize: "0.625rem",
                fontWeight: 700,
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
                border: `1px solid ${C.accent}33`,
                background: `${C.accent}1a`,
                color: `${C.accent}cc`,
              }}
            >
              {q.category}
            </span>
            {q.isPro && !isPro && (
              <span
                css={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  fontSize: "0.5625rem",
                  fontWeight: 900,
                  padding: "0.125rem 0.4rem",
                  borderRadius: "0.25rem",
                  background: `${C.accent2}18`,
                  border: `1px solid ${C.accent2}44`,
                  color: C.accent2,
                }}
              >
                <Zap size={7} /> PRO
              </span>
            )}
            {q.hint && (
              <span
                css={{
                  fontSize: "0.625rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.04)",
                  color: C.muted,
                }}
              >
                💡 {q.hint}
              </span>
            )}
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
            <div
              css={{
                margin: "0.875rem 1.25rem 0",
                padding: "0.375rem 0.75rem",
                background: `${C.accent3}0f`,
                border: `1px solid ${C.accent3}25`,
                borderRadius: "0.5rem",
                fontSize: "0.6875rem",
                color: C.accent3,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <Star size={12} fill={C.accent3} /> Marked as mastered
            </div>
          )}

          {q.hint && (
            <div
              css={{
                margin: "0.875rem 1.25rem 0",
                padding: "0.5rem 0.875rem",
                background: `${C.accent3}0f`,
                border: `1px solid ${C.accent3}30`,
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                color: C.accent3,
                lineHeight: 1.5,
              }}
            >
              💡 Hint: {q.hint}
            </div>
          )}

          <div css={{ padding: "0.875rem 1.25rem 0.25rem" }}>
            <MarkdownRenderer content={q.answer} />
          </div>

          {/* ── Action row ── */}
          <div
            css={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              padding: "0.75rem 1.25rem 1rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Mark mastered — free, dashboard only */}
            {onMastered && (
              <button
                css={S.actionChip(isMastered ? C.accent3 : C.muted, isMastered)}
                onClick={onMastered}
              >
                <CheckCircle size={12} />
                {isMastered ? "Mastered ✓" : "Mark mastered"}
              </button>
            )}

            {/* Bookmark — Pro, dashboard only */}
            {(onBookmark !== undefined || !isPro) &&
              isLoggedIn &&
              !authLoading && (
                <button
                  css={S.actionChip(
                    isBookmarked ? C.accent2 : C.muted,
                    isBookmarked,
                  )}
                  onClick={handleBookmark}
                >
                  {!isPro ? <Lock size={10} /> : <Bookmark size={12} />}
                  {isBookmarked ? "Saved" : "Bookmark"}
                </button>
              )}

            {/* AI Tutor */}
            <button
              css={S.actionChip(
                activePanel === "chat" ? C.accent : C.muted,
                activePanel === "chat",
              )}
              onClick={() => handleAIAction("chat")}
              disabled={authLoading}
              style={authLoading ? { opacity: 0.4 } : undefined}
            >
              <Sparkles size={12} />
              {!authLoading && !isPro && isLoggedIn && <Lock size={10} />}
              AI Tutor
            </button>

            {/* Evaluate Me */}
            <button
              css={S.actionChip(
                activePanel === "eval" ? "#a78bfa" : C.muted,
                activePanel === "eval",
              )}
              onClick={() => handleAIAction("eval")}
              disabled={authLoading}
              style={authLoading ? { opacity: 0.4 } : undefined}
            >
              <Target size={12} />
              {!authLoading && !isPro && isLoggedIn && <Lock size={10} />}
              Evaluate Me
            </button>

            {/* Upgrade nudge for logged-in free users */}
            {!isPro && isLoggedIn && !authLoading && (
              <button css={S.actionChip(C.accent2, false)} onClick={onPaywall}>
                <Zap size={11} /> Unlock AI features
              </button>
            )}

            {/* Sign in nudge for visitors */}
            {!isLoggedIn && !authLoading && (
              <a
                href="/auth"
                css={[
                  S.actionChip(C.accent2, false),
                  { textDecoration: "none" },
                ]}
              >
                <Zap size={11} /> Sign in for AI features
              </a>
            )}
          </div>

          {/* ── AI panels — rendered inline, state owned here ── */}
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
  );
}

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
import * as S from "./styles";
import type { Question } from "@/types/question";

/**
 * Unified TheoryCard used on BOTH dashboard and topic pages.
 *
 * Dashboard context: pass isMastered, isBookmarked, isPro, onMastered, onBookmark,
 *   onPanel — AI Tutor and Evaluate Me work fully.
 *
 * Topic page context: pass isPro + onPaywall — Pro feature buttons show with lock
 *   icon for free users, driving upgrades. No mastered/bookmark tracking needed
 *   on public pages.
 *
 * Both contexts show the same card shell — consistent brand experience.
 */

interface Props {
  q: Question;
  index: number;
  /** Optional: controlled open state for accordion mode */
  isOpen?: boolean;
  onToggle?: () => void;

  // Progress (optional — dashboard only)
  isMastered?: boolean;
  isBookmarked?: boolean;
  isSolved?: boolean;
  onMastered?: () => void;
  onBookmark?: () => void;

  // Auth / pro state
  isPro?: boolean;
  isLoggedIn?: boolean;
  onPaywall?: () => void;

  // AI panels (dashboard only — renders inline)
  onAITutor?: () => void;
  onEvaluate?: () => void;
  activePanel?: "chat" | "eval" | null;
  aiPanelNode?: React.ReactNode; // rendered by parent (AIChat / AnswerEvaluator)
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
  onPaywall,
  onAITutor,
  onEvaluate,
  activePanel,
  aiPanelNode,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const toggle = onToggle ?? (() => setInternalOpen((o) => !o));

  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core;

  // Pro action handlers — gate for non-pro users
  function handleAITutor() {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }
    if (!isPro) {
      onPaywall?.();
      return;
    }
    onAITutor?.();
  }

  function handleEvaluate() {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }
    if (!isPro) {
      onPaywall?.();
      return;
    }
    onEvaluate?.();
  }

  function handleBookmark() {
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

  const showActionsRow = isLoggedIn !== undefined; // always show actions for CTAs

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

          {/* ── Pro feature action row — always shown, gated for non-pro ── */}
          <div
            css={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              padding: "0.75rem 1.25rem 1rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Mark mastered — free feature if logged in */}
            {onMastered && (
              <button
                css={S.actionChip(isMastered ? C.accent3 : C.muted, isMastered)}
                onClick={onMastered}
              >
                <CheckCircle size={12} />
                {isMastered ? "Mastered ✓" : "Mark mastered"}
              </button>
            )}

            {/* Bookmark — Pro */}
            {(onBookmark || !isPro) && (
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

            {/* AI Tutor — Pro */}
            <button
              css={S.actionChip(
                activePanel === "chat" ? C.accent : C.muted,
                activePanel === "chat",
              )}
              onClick={handleAITutor}
            >
              <Sparkles size={12} />
              {!isPro && <Lock size={10} />}
              AI Tutor
            </button>

            {/* Evaluate Me — Pro */}
            <button
              css={S.actionChip(
                activePanel === "eval" ? C.purple : C.muted,
                activePanel === "eval",
              )}
              onClick={handleEvaluate}
            >
              <Target size={12} />
              {!isPro && <Lock size={10} />}
              Evaluate Me
            </button>

            {/* If not pro: subtle upgrade nudge */}
            {!isPro && isLoggedIn && (
              <button css={S.actionChip(C.accent2, false)} onClick={onPaywall}>
                <Zap size={11} />
                Unlock AI features
              </button>
            )}
            {!isLoggedIn && (
              <a
                href="/auth"
                css={[
                  S.actionChip(C.accent2, false),
                  { textDecoration: "none" },
                ]}
              >
                <Zap size={11} />
                Sign in for AI features
              </a>
            )}
          </div>

          {/* AI panels rendered here when provided by parent */}
          {aiPanelNode}
        </div>
      )}
    </div>
  );
}

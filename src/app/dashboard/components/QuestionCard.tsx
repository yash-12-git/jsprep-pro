/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { css } from "@emotion/react";
import { ChevronDown, Eye, Star, Zap } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import MarkdownRenderer from "@/components/md/MarkdownRenderer";
import AIChat from "@/components/ui/AIChat/page";
import AnswerEvaluator from "@/components/ui/AnswerEvaluator/page";
import QuestionActions, { type ActivePanel } from "./QuestionActions";
import type { Question } from "@/types/question";

interface Props {
  question: Question;
  index: number;
  isMastered: boolean;
  isBookmarked: boolean;
  isSolved: boolean;
  isPro: boolean;
  onMastered: () => void;
  onBookmark: () => void;
  onNeedsPro: (reason: string) => void;
}

const DIFF_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  beginner: { bg: C.greenSubtle, color: C.green, border: C.greenBorder },
  core: { bg: C.accentSubtle, color: C.accent, border: C.border },
  advanced: { bg: C.amberSubtle, color: C.amber, border: C.amberBorder },
  expert: { bg: C.redSubtle, color: C.red, border: C.redBorder },
};

const S = {
  card: (mastered: boolean, open: boolean) => css`
    background: ${C.bg};
    border: 1px solid ${mastered ? C.greenBorder : C.border};
    border-left: 3px solid
      ${mastered ? C.green : open ? C.accent : "transparent"};
    border-radius: ${RADIUS.lg};
    overflow: hidden;
    transition:
      border-color 0.15s ease,
      border-left-color 0.15s ease;
    &:hover {
      border-color: ${mastered ? C.greenBorder : C.borderStrong};
    }
  `,

  summary: css`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    cursor: pointer;
    user-select: none;
    transition: background 0.12s ease;
    &:hover {
      background: ${C.bgHover};
    }
  `,

  qNum: css`
    font-family: "JetBrains Mono", monospace;
    font-size: 0.625rem;
    font-weight: 600;
    color: ${C.accentText};
    background: ${C.accentSubtle};
    border: 1px solid ${C.border};
    padding: 0.125rem 0.5rem;
    border-radius: ${RADIUS.sm};
    flex-shrink: 0;
    margin-top: 0.1875rem;
    letter-spacing: 0.03em;
  `,

  meta: css`
    flex: 1;
    min-width: 0;
  `,

  title: css`
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.45;
    color: ${C.text};
    margin-bottom: 0.4375rem;
  `,

  tags: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.3125rem;
  `,

  tag: (bg: string, color: string, border: string) => css`
    font-size: 0.5625rem;
    font-weight: 600;
    padding: 0.125rem 0.4375rem;
    border-radius: ${RADIUS.sm};
    background: ${bg};
    color: ${color};
    border: 1px solid ${border};
    letter-spacing: 0.02em;
  `,

  chevron: (open: boolean) => css`
    flex-shrink: 0;
    color: ${C.muted};
    transition: transform 0.22s ease;
    transform: rotate(${open ? "180deg" : "0deg"});
    margin-top: 0.1875rem;
  `,

  body: css`
    border-top: 1px solid ${C.border};
  `,

  hintBox: css`
    margin: 0.875rem 1rem 0;
    padding: 0.5rem 0.875rem;
    background: ${C.greenSubtle};
    border: 1px solid ${C.greenBorder};
    border-radius: ${RADIUS.md};
    font-size: 0.75rem;
    color: ${C.green};
    line-height: 1.5;
  `,

  answerWrap: css`
    padding: 0.875rem 1rem 0.25rem;
  `,

  proLabel: css`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    color: ${C.muted};
  `,

  proBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: ${C.amberSubtle};
    border: 1px solid ${C.amberBorder};
    color: ${C.amber};
    font-size: 0.5625rem;
    font-weight: 700;
    padding: 0.125rem 0.4rem;
    border-radius: ${RADIUS.sm};
    letter-spacing: 0.05em;
    flex-shrink: 0;
  `,

  masteredBanner: css`
    margin: 0 1rem 0.625rem;
    padding: 0.375rem 0.75rem;
    background: ${C.greenSubtle};
    border: 1px solid ${C.greenBorder};
    border-radius: ${RADIUS.md};
    font-size: 0.6875rem;
    color: ${C.green};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  `,
};

export default function QuestionCard({
  question,
  index,
  isMastered,
  isBookmarked,
  isSolved,
  isPro,
  onMastered,
  onBookmark,
  onNeedsPro,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const diffStyle = DIFF_COLORS[question.difficulty] ?? DIFF_COLORS.core;

  function handlePanel(p: "chat" | "eval") {
    if (!isPro) {
      onNeedsPro(
        "AI features are Pro only. Upgrade for AI tutoring, answer evaluation, and more.",
      );
      return;
    }
    setActivePanel((prev) => (prev === p ? null : p));
  }

  function handleBookmark() {
    if (!isPro) {
      onNeedsPro(
        "Bookmarks are a Pro feature. Upgrade to save questions for quick review.",
      );
      return;
    }
    onBookmark();
  }

  return (
    <div css={S.card(isMastered, open)}>
      {/* ── Summary row ── */}
      <div css={S.summary} onClick={() => setOpen((o) => !o)}>
        <span css={S.qNum}>#{String(index + 1).padStart(2, "0")}</span>

        <div css={S.meta}>
          <p css={S.title}>
            {isMastered && (
              <span style={{ color: C.green, marginRight: "0.3rem" }}>✓</span>
            )}
            {question.title}
          </p>
          <div css={S.tags}>
            <span css={S.tag(diffStyle.bg, diffStyle.color, diffStyle.border)}>
              {question.difficulty}
            </span>
            <span css={S.tag(C.bgSubtle, C.muted, C.border)}>
              {question.category}
            </span>
            {question.isPro && !isPro && (
              <span css={S.proBadge}>
                <Zap size={8} /> PRO
              </span>
            )}
          </div>
        </div>

        <div css={S.chevron(open)}>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* ── Expanded body ── */}
      {open && (
        <div css={S.body}>
          {isMastered && (
            <div css={S.masteredBanner}>
              <Star size={12} fill={C.green} color={C.green} />
              Marked as mastered
            </div>
          )}

          {(question.isPro || question.tags.length > 0) && (
            <div css={[S.tags, { padding: "0.5rem 1rem 0", flexWrap: "wrap" }]}>
              {question.isPro && (
                <span css={S.proBadge}>
                  <Zap size={8} /> PRO
                </span>
              )}
              {question.tags.slice(0, 3).map((t) => (
                <span key={t} css={S.tag(C.bgSubtle, C.muted, C.border)}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {question.hint && <div css={S.hintBox}>💡 Hint: {question.hint}</div>}

          <div css={S.answerWrap}>
            <MarkdownRenderer content={question.answer} />
          </div>

          <QuestionActions
            questionId={question.id}
            isMastered={isMastered}
            isBookmarked={isBookmarked}
            isPro={isPro}
            activePanel={activePanel}
            onMastered={onMastered}
            onBookmark={handleBookmark}
            onPanel={handlePanel}
          />

          {activePanel === "chat" && (
            <AIChat
              question={question.question}
              answer={question.answer}
              onClose={() => setActivePanel(null)}
            />
          )}
          {activePanel === "eval" && (
            <AnswerEvaluator
              question={question.question}
              idealAnswer={question.answer}
              onClose={() => setActivePanel(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

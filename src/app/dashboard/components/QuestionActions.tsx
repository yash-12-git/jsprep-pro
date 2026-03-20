/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { Bookmark, CheckCircle, Sparkles, Target, Lock } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";

export type ActivePanel = "chat" | "eval" | null;

interface Props {
  questionId: string;
  isMastered: boolean;
  isBookmarked: boolean;
  isPro: boolean;
  activePanel: ActivePanel;
  onMastered: () => void;
  onBookmark: () => void;
  onPanel: (p: "chat" | "eval") => void;
}

const S = {
  row: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    padding: 0.625rem 1rem 0.875rem;
    border-top: 1px solid ${C.border};
  `,

  btn: (color: string, active: boolean) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3125rem 0.75rem;
    border-radius: ${RADIUS.md};
    font-size: 0.6875rem;
    font-weight: 500;
    border: 1px solid ${active ? color : C.border};
    background: ${active ? C.accentSubtle : "transparent"};
    color: ${active ? color : C.muted};
    cursor: pointer;
    transition: all 0.12s ease;
    &:hover {
      border-color: ${color};
      color: ${color};
      background: ${C.accentSubtle};
    }
  `,
};

export default function QuestionActions({
  questionId,
  isMastered,
  isBookmarked,
  isPro,
  activePanel,
  onMastered,
  onBookmark,
  onPanel,
}: Props) {
  return (
    <div css={S.row}>
      <button css={S.btn(C.green, isMastered)} onClick={onMastered}>
        <CheckCircle size={12} />
        {isMastered ? "Mastered ✓" : "Mark mastered"}
      </button>

      <button css={S.btn(C.amber, isBookmarked)} onClick={onBookmark}>
        {!isPro ? <Lock size={11} /> : <Bookmark size={12} />}
        {isBookmarked ? "Saved" : "Bookmark"}
      </button>

      <button
        css={S.btn(C.accent, activePanel === "chat")}
        onClick={() => onPanel("chat")}
      >
        <Sparkles size={12} />
        {!isPro && <Lock size={10} />}
        AI Tutor
      </button>

      <button
        css={S.btn(C.accentText, activePanel === "eval")}
        onClick={() => onPanel("eval")}
      >
        <Target size={12} />
        {!isPro && <Lock size={10} />}
        Evaluate Me
      </button>
    </div>
  );
}

import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

// ─── Card shell ───────────────────────────────────────────────────────────────

export type CardHighlight = "idle" | "correct" | "wrong" | "revealed";

export const questionCard = (
  highlight: CardHighlight,
  hoverAccent: string = C.accent,
) => {
  const border = {
    idle: C.border,
    correct: C.greenBorder,
    wrong: C.redBorder,
    revealed: C.border,
  }[highlight];

  const bg = highlight === "correct" ? C.greenSubtle : C.bg;

  return css`
    background: ${bg};
    border: 1px solid ${border};
    border-left: 3px solid
      ${highlight === "correct"
        ? C.green
        : highlight === "wrong"
          ? C.red
          : "transparent"};
    border-radius: ${RADIUS.lg};
    overflow: hidden;
    transition: border-color 0.15s ease;
    &:hover {
      border-color: ${highlight === "idle" ? hoverAccent : border};
    }
  `;
};

export const cardHeader = css`
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
`;

export const chevronWrapper = (open: boolean) => css`
  flex-shrink: 0;
  margin-top: 0.25rem;
  transform: rotate(${open ? "180deg" : "0deg"});
  transition: transform 0.2s ease;
  color: ${C.muted};
`;

export const cardBody = css`
  border-top: 1px solid ${C.border};
`;

export const bodyInner = css`
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// ─── Number badge ─────────────────────────────────────────────────────────────

export const qNumber = (accentColor: string) => css`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: ${accentColor};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  padding: 0.125rem 0.5rem;
  border-radius: ${RADIUS.sm};
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

// ─── Section labels ───────────────────────────────────────────────────────────

export const sectionLabel = (color: string = C.muted) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  text-transform: uppercase;
  letter-spacing: 0.09em;
  margin-bottom: 0.5rem;
`;

// ─── Output card ──────────────────────────────────────────────────────────────

export const inputSection = css`
  padding: 1rem;
`;

export const actionRow = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

export const resetLink = css`
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.5rem;
  padding: 0;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

// ─── Explanation / info boxes ─────────────────────────────────────────────────

export const explanationBox = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
`;

export const explanationTitle = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.5rem;
`;

export const explanationText = css`
  font-size: 0.75rem;
  color: ${C.muted};
  line-height: 1.7;
  white-space: pre-line;
`;

export const insightRow = css`
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  border-top: 1px solid ${C.border};
`;

// ─── Locked / paywall ─────────────────────────────────────────────────────────

export const lockedBox = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
`;

// ─── Debug card ───────────────────────────────────────────────────────────────

export const descriptionBox = css`
  margin: 1rem 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem 1rem;
`;

export const codeTextarea = (
  state: "idle" | "checking" | "correct" | "wrong",
) => {
  const border = {
    idle: C.border,
    checking: C.border,
    correct: C.greenBorder,
    wrong: C.redBorder,
  }[state];

  return css`
    width: 100%;
    background: ${C.bg};
    border: 1px solid ${border};
    border-radius: ${RADIUS.lg};
    padding: 0.75rem 1rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    color: ${C.text};
    outline: none;
    resize: none;
    line-height: 1.8;
    transition:
      border-color 0.12s ease,
      box-shadow 0.12s ease;
    &:focus {
      border-color: ${C.accent};
      box-shadow: 0 0 0 2px ${C.accentSubtle};
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
};

// ─── AI feedback (debug) ──────────────────────────────────────────────────────

export const feedbackBox = (correct: boolean) => css`
  border: 1px solid ${correct ? C.greenBorder : C.redBorder};
  background: ${correct ? C.greenSubtle : C.redSubtle};
  border-radius: ${RADIUS.lg};
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const scoreRow = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const scoreNumber = (correct: boolean, score: number) => css`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${correct ? C.green : score >= 5 ? C.amber : C.red};
`;

export const scoreDenom = css`
  font-size: 1rem;
  color: ${C.muted};
`;

export const scoreBarTrack = css`
  height: 3px;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.25rem;
`;

export const scoreBarFill = (pct: number, color: string) => css`
  height: 100%;
  width: ${pct}%;
  background: ${color};
  border-radius: 9999px;
  transition: width 0.5s ease;
`;

export const feedbackRow = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.75rem;
`;

export const feedbackRowTitle = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.25rem;
`;

export const feedbackRowText = css`
  font-size: 0.75rem;
  color: ${C.muted};
  line-height: 1.6;
`;

export const hintBox = css`
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  border-radius: ${RADIUS.md};
  padding: 0.75rem;
`;

export const diffGrid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

export const diffLabel = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.5rem;
`;

export const revealCard = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
`;

// ─── Theory card action chips ─────────────────────────────────────────────────

export const actionChip = (color: string, active: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  border-radius: ${RADIUS.sm};
  border: 1px solid ${active ? color : C.border};
  background: ${active ? C.accentSubtle : "transparent"};
  color: ${active ? color : C.muted};
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
  text-decoration: none;
  &:hover {
    border-color: ${color};
    background: ${C.accentSubtle};
    color: ${color};
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

// ─── Diff badge helpers ───────────────────────────────────────────────────────

export const DIFF_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  beginner: { bg: C.greenSubtle, color: C.green, border: C.greenBorder },
  core: { bg: C.greenSubtle, color: C.green, border: C.greenBorder },
  advanced: { bg: C.amberSubtle, color: C.amber, border: C.amberBorder },
  expert: { bg: C.redSubtle, color: C.red, border: C.redBorder },
};

export const DIFF_LABEL: Record<string, string> = {
  beginner: "Easy",
  core: "Easy",
  advanced: "Medium",
  expert: "Hard",
};

export const CAT_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  "Async Bugs": { bg: C.accentSubtle, color: C.accentText, border: C.border },
  "Closure Traps": { bg: C.accentSubtle, color: C.accent, border: C.border },
  "Event Loop Traps": {
    bg: C.amberSubtle,
    color: C.amber,
    border: C.amberBorder,
  },
  "Fix the Code": { bg: C.greenSubtle, color: C.green, border: C.greenBorder },
  "What's Wrong?": { bg: C.redSubtle, color: C.red, border: C.redBorder },
};

// ─── Theory card tokens ───────────────────────────────────────────────────────

export const titleRow = css`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${C.text};
  margin-bottom: 0.375rem;
  line-height: 1.4;
`;

export const badgeRow = css`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const diffBadge = (style: {
  bg: string;
  color: string;
  border: string;
}) => css`
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid ${style.border};
  background: ${style.bg};
  color: ${style.color};
`;

export const catBadge = (_accent: string) => css`
  font-size: 0.625rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid ${C.border};
  background: ${C.bgSubtle};
  color: ${C.muted};
`;

export const proBadge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.5625rem;
  font-weight: 700;
  padding: 0.125rem 0.4rem;
  border-radius: ${RADIUS.sm};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  color: ${C.amber};
`;

export const hintChip = css`
  font-size: 0.625rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  color: ${C.muted};
`;

export const masteredBanner = (_accent3: string) => css`
  margin: 0.75rem 1rem 0;
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
`;

export const hintBanner = (_accent3: string) => css`
  margin: 0.75rem 1rem 0;
  padding: 0.5rem 0.875rem;
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  border-radius: ${RADIUS.md};
  font-size: 0.75rem;
  color: ${C.green};
  line-height: 1.5;
`;

export const answerPad = css`
  padding: 0.875rem 1rem 0.25rem;
`;

export const actionRowTheory = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0.625rem 1rem 0.875rem;
  border-top: 1px solid ${C.border};
`;

export const titleMeta = css`
  flex: 1;
  min-width: 0;
`;

export const masteredCheck = (_accent3: string) => css`
  color: ${C.green};
  margin-right: 0.3rem;
`;

export const noUnderline = css`
  text-decoration: none;
`;

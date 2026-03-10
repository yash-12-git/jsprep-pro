import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

// ─── Card shell ───────────────────────────────────────────────────────────────

export type CardHighlight = "idle" | "correct" | "wrong" | "revealed";

export const questionCard = (
  highlight: CardHighlight,
  hoverAccent = C.accent,
) => {
  const border = {
    idle: C.border,
    correct: C.accent3 + "66",
    wrong: C.danger + "4d",
    revealed: C.border,
  }[highlight];

  const bg = highlight === "correct" ? C.accent3 + "0d" : C.card;

  return css`
    background: ${bg};
    border: 1px solid ${border};
    border-radius: ${RADIUS.xxl};
    overflow: hidden;
    transition: border-color 0.2s ease;
    &:hover {
      border-color: ${highlight === "idle" ? hoverAccent + "4d" : border};
    }
  `;
};

export const cardHeader = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  user-select: none;
`;

export const chevronWrapper = (open: boolean) => css`
  flex-shrink: 0;
  margin-top: 0.25rem;
  transform: rotate(${open ? "180deg" : "0deg"});
  transition: transform 0.2s;
`;

export const cardBody = css`
  border-top: 1px solid ${C.border};
`;

export const bodyInner = css`
  padding: 0 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// ─── Number badge — accent differs per type ───────────────────────────────────

export const qNumber = (accentColor: string) => css`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: ${accentColor};
  background: ${accentColor}1a;
  border: 1px solid ${accentColor}33;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

// ─── Section labels ───────────────────────────────────────────────────────────

export const sectionLabel = (color = C.muted) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

// ─── Output answer area ───────────────────────────────────────────────────────

export const inputSection = css`
  padding: 1rem 1.25rem;
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
  &:hover {
    color: white;
  }
`;

// ─── Explanation / info boxes ─────────────────────────────────────────────────

export const explanationBox = css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
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
  color: ${C.text};
  line-height: 1.7;
  white-space: pre-line;
`;

export const insightRow = css`
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  border-top: 1px solid ${C.border};
`;

// ─── Locked / paywall box ─────────────────────────────────────────────────────

export const lockedBox = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
`;

// ─── Debug-specific ───────────────────────────────────────────────────────────

export const descriptionBox = css`
  margin: 1.25rem 1.25rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: ${C.danger}1a;
  border: 1px solid ${C.danger}33;
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`;

export const codeTextarea = (
  state: "idle" | "checking" | "correct" | "wrong",
) => {
  const border = {
    idle: C.accent3 + "4d",
    checking: C.border,
    correct: C.accent3 + "80",
    wrong: C.danger + "66",
  }[state];

  return css`
    width: 100%;
    background: #0a0a12;
    border: 1px solid ${border};
    border-radius: ${RADIUS.xl};
    padding: 0.75rem 1rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    color: white;
    outline: none;
    resize: none;
    line-height: 1.8;
    transition: border-color 0.15s ease;
    &:focus {
      border-color: ${C.accent3}80;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
};

// ─── AI feedback (debug) ──────────────────────────────────────────────────────

export const feedbackBox = (correct: boolean) => css`
  border: 1px solid ${correct ? C.accent3 + "4d" : C.danger + "33"};
  background: ${correct ? C.accent3 + "0d" : C.danger + "0d"};
  border-radius: ${RADIUS.xxl};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const scoreRow = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const scoreNumber = (correct: boolean, score: number) => css`
  font-size: 2rem;
  font-weight: 900;
  color: ${correct ? C.accent3 : score >= 5 ? C.accent2 : C.danger};
`;

export const scoreDenom = css`
  font-size: 1.125rem;
  color: ${C.muted};
`;

export const scoreBarTrack = css`
  height: 0.375rem;
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
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
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
  color: ${C.text};
`;

export const hintBox = css`
  background: ${C.accent2}1a;
  border: 1px solid ${C.accent2}33;
  border-radius: ${RADIUS.xl};
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
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`;

// ─── Action chip (theory card actions row) ────────────────────────────────────

export const actionChip = (color: string, active: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3125rem 0.75rem;
  border-radius: ${RADIUS.md};
  font-size: 0.6875rem;
  font-weight: 700;
  border: 1px solid ${active ? color + "66" : "rgba(255,255,255,0.08)"};
  background: ${active ? color + "18" : "transparent"};
  color: ${active ? color : C.muted};
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${color + "55"};
    color: ${active ? color : "white"};
    background: ${active ? color + "22" : color + "0d"};
  }
`;

// ─── Diff badge helpers ───────────────────────────────────────────────────────

export const DIFF_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  beginner: {
    bg: `${C.accent3}1a`,
    color: C.accent3,
    border: `${C.accent3}33`,
  },
  core: { bg: `${C.accent3}1a`, color: C.accent3, border: `${C.accent3}33` },
  advanced: {
    bg: `${C.accent2}1a`,
    color: C.accent2,
    border: `${C.accent2}33`,
  },
  expert: { bg: `${C.danger}1a`, color: C.danger, border: `${C.danger}33` },
};

export const DIFF_LABEL: Record<string, string> = {
  beginner: "🟢 Easy",
  core: "🟢 Easy",
  advanced: "🟡 Medium",
  expert: "🔴 Hard",
};

export const CAT_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  "Async Bugs": {
    bg: "rgba(167,139,250,0.1)",
    color: "#c4b5fd",
    border: "rgba(167,139,250,0.2)",
  },
  "Closure Traps": {
    bg: "rgba(96,165,250,0.1)",
    color: "#93c5fd",
    border: "rgba(96,165,250,0.2)",
  },
  "Event Loop Traps": {
    bg: "rgba(251,146,60,0.1)",
    color: "#fdba74",
    border: "rgba(251,146,60,0.2)",
  },
  "Fix the Code": {
    bg: `${C.accent3}1a`,
    color: C.accent3,
    border: `${C.accent3}33`,
  },
  "What's Wrong?": {
    bg: `${C.danger}1a`,
    color: C.danger,
    border: `${C.danger}33`,
  },
};

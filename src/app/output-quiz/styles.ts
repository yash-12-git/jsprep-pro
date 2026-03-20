import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const header = css`
  margin-bottom: 2rem;
`;

export const headerTop = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const titleBlock = css``;

export const pageTitle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
`;

export const pageSubtitle = css`
  color: ${C.muted};
  font-size: 0.75rem;
  line-height: 1.5;
`;

export const progressRow = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const progressCount = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.amber};
  white-space: nowrap;
`;

export const diffRow = css`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

export const diffItem = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
`;

export const diffCount = css`
  color: ${C.muted};
`;

// ─── Question card ────────────────────────────────────────────────────────────

export const questionCard = (
  state: "idle" | "correct" | "wrong" | "revealed",
) => {
  const borders = {
    idle: C.border,
    correct: C.greenBorder,
    wrong: C.redBorder,
    revealed: C.border,
  };
  const bgs = {
    idle: C.bg,
    correct: C.greenSubtle,
    wrong: C.bg,
    revealed: C.bg,
  };
  return css`
    background: ${bgs[state]};
    border: 1px solid ${borders[state]};
    border-left: 3px solid
      ${state === "correct"
        ? C.green
        : state === "wrong"
          ? C.red
          : "transparent"};
    border-radius: ${RADIUS.lg};
    overflow: hidden;
    transition: border-color 0.15s ease;
    &:hover {
      border-color: ${state === "idle" ? C.amber : borders[state]};
    }
  `;
};

export const cardHeader = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: background 0.12s ease;
  &:hover {
    background: ${C.bgHover};
  }
`;

export const qNumber = css`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: ${C.amber};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  padding: 0.125rem 0.5rem;
  border-radius: ${RADIUS.sm};
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const cardBody = css`
  border-top: 1px solid ${C.border};
`;

export const codeSection = css`
  padding: 1rem 1rem 0;
`;

export const codeSectionLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.muted};
  text-transform: uppercase;
  letter-spacing: 0.09em;
  margin-bottom: 0.5rem;
`;

export const inputSection = css`
  padding: 1rem;
`;

export const textareaLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.muted};
  text-transform: uppercase;
  letter-spacing: 0.09em;
  margin-bottom: 0.5rem;
`;

export const actionRow = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const correctOutput = css`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: ${C.green};
`;

export const explanationBox = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  margin-top: 0.75rem;
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

export const lockedBox = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
`;

export const lockedText = css`
  font-size: 0.875rem;
  color: ${C.muted};
  flex: 1;
`;

export const resetLink = css`
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.75rem;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

export const chevronWrapper = (open: boolean) => css`
  flex-shrink: 0;
  transition: transform 0.2s ease;
  transform: rotate(${open ? "180deg" : "0deg"});
  color: ${C.muted};
`;

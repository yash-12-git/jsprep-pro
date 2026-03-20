import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const wrapper = css`
  border-top: 1px solid ${C.border};
  background: ${C.bgSubtle};
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1.125rem;
  border-bottom: 1px solid ${C.border};
`;

export const headerLeft = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const headerIcon = css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const headerTitle = css`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.amber};
`;

export const headerSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
`;

export const closeBtn = css`
  background: none;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  padding: 0.125rem;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

export const body = css`
  padding: 1rem 1.125rem;
`;

export const prompt = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

export const evalBtn = css`
  margin-top: 0.75rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  color: ${C.accentText};
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.5625rem;
  border-radius: ${RADIUS.lg};
  cursor: pointer;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.accent};
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const resultArea = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const scoreCard = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
`;

export const scoreLeft = css`
  text-align: center;
  flex-shrink: 0;
`;

export const scoreNum = (score: number) => css`
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: ${score >= 8
    ? C.green
    : score >= 6
      ? C.amber
      : score >= 4
        ? C.orange
        : C.red};
`;

export const scoreDenom = css`
  font-size: 1rem;
  color: ${C.muted};
`;

export const gradeText = (grade: string) => css`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${["A", "B"].includes(grade)
    ? C.green
    : grade === "C"
      ? C.amber
      : C.red};
`;

export const scoreRight = css`
  flex: 1;
`;

export const verdict = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.text};
`;

export const barTrack = css`
  height: 4px;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

export const barFill = (score: number) => css`
  height: 100%;
  width: ${score * 10}%;
  border-radius: 9999px;
  background: ${score >= 8
    ? C.green
    : score >= 6
      ? C.amber
      : score >= 4
        ? C.orange
        : C.red};
  transition: width 0.5s ease;
`;

export const listSection = (_color: string) => css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const listTitle = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.25rem;
`;

export const listItem = css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${C.text};
  line-height: 1.5;
`;

export const toggleBtn = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.4375rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.accent};
  }
`;

export const betterAnswerBox = css`
  font-size: 0.75rem;
  color: ${C.muted};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.75rem;
  line-height: 1.7;
`;

export const tryAgainBtn = css`
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.12s ease;
  &:hover {
    color: ${C.text};
  }
`;

import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const title = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
`;

export const statsGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// Icon box uses a neutral subtle bg — colour comes from the icon itself
export const statIconBox = (_bg: string) => css`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${RADIUS.md};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
`;

export const section = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.375rem;
  margin-bottom: 1.25rem;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
  }
`;

export const sectionTitle = css`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.25rem;
`;

export const sectionSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

export const overallRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const overallPct = css`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${C.accent};
  letter-spacing: -0.02em;
`;

export const categoryRow = css`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const categoryItem = css`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
`;

export const categoryLabelRow = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
`;

export const categoryName = css`
  font-weight: 500;
  color: ${C.text};
`;

export const categoryCount = css`
  color: ${C.muted};
  font-variant-numeric: tabular-nums;
`;

export const barFill = (pct: number, color: string) => css`
  height: 0.375rem;
  width: ${pct}%;
  background: ${color};
  border-radius: 9999px;
  transition: width 0.5s ease;
`;

export const barTrack = css`
  height: 0.375rem;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
`;

export const emptyState = css`
  text-align: center;
  color: ${C.muted};
  font-size: 0.875rem;
  padding: 2rem;
  line-height: 1.6;
`;

// ─── Sprint history ───────────────────────────────────────────────────────────

export const sprintRow = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
  }
`;

export const sprintRowTop = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const sprintDate = css`
  font-size: 0.75rem;
  color: ${C.muted};
  flex-shrink: 0;
  min-width: 6.5rem;
  font-variant-numeric: tabular-nums;
`;

export const sprintScoreBlock = css`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const sprintScoreNum = css`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
`;

export const sprintScoreMax = css`
  font-size: 0.75rem;
  color: ${C.muted};
`;

export const sprintAccuracy = (pct: number) => css`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${pct >= 80 ? C.green : pct >= 50 ? C.accent : C.amber};
  background: ${pct >= 80
    ? C.greenSubtle
    : pct >= 50
      ? C.accentSubtle
      : C.amberSubtle};
  border: 1px solid
    ${pct >= 80 ? C.greenBorder : pct >= 50 ? C.border : C.amberBorder};
  padding: 1px 7px;
  border-radius: 10px;
`;

export const sprintQCount = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-left: auto;
`;

export const sprintTagRow = css`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

export const sprintTag = (variant: "strength" | "weak") => css`
  font-size: 0.6rem;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 10px;
  ${variant === "strength"
    ? `color: ${C.green};  background: ${C.greenSubtle};  border: 1px solid ${C.greenBorder};`
    : `color: ${C.amber};  background: ${C.amberSubtle};  border: 1px solid ${C.amberBorder};`}
`;

export const sprintSummaryRow = css`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const sprintSummaryItem = css`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const sprintSummaryLabel = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
`;

export const sprintSummaryValue = css`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
`;

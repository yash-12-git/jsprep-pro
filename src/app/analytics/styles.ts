import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const title = css`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 2rem;
`;

export const statsGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const statIconBox = (bg: string) => css`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: ${bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
`;

export const section = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const sectionTitle = css`
  font-weight: 900;
  margin-bottom: 0.25rem;
`;

export const sectionSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 1.25rem;
`;

export const overallRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const overallPct = css`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${C.accent};
`;

export const categoryRow = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const categoryItem = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const categoryLabelRow = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
`;

export const categoryName = css`
  font-weight: 600;
  color: white;
`;

export const categoryCount = css`
  color: ${C.muted};
`;

export const barFill = (pct: number, color: string) => css`
  height: 0.5rem;
  width: ${pct}%;
  background: ${color};
  border-radius: 9999px;
  transition: width 0.5s ease;
`;

export const barTrack = css`
  height: 0.5rem;
  background: ${C.surface};
  border-radius: 9999px;
  overflow: hidden;
`;

export const emptyState = css`
  text-align: center;
  color: ${C.muted};
  padding: 2rem;
`;

// ─── Sprint History ───────────────────────────────────────────────────────────

export const sprintRow = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
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
`;

export const sprintScoreBlock = css`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const sprintScoreNum = css`
  font-size: 1.125rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.02em;
`;

export const sprintScoreMax = css`
  font-size: 0.75rem;
  color: ${C.muted};
`;

export const sprintAccuracy = (pct: number) => css`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${pct >= 80 ? C.accent3 : pct >= 50 ? C.accent : C.accent2};
  background: ${pct >= 80
    ? `${C.accent3}18`
    : pct >= 50
      ? `${C.accent}18`
      : `${C.accent2}18`};
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
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 10px;
  ${variant === "strength"
    ? `color: ${C.accent3}; background: ${C.accent3}18;`
    : `color: ${C.accent2}; background: ${C.accent2}18;`}
`;

export const sprintSummaryRow = css`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background: rgba(124, 106, 247, 0.06);
  border: 1px solid rgba(124, 106, 247, 0.15);
  border-radius: 0.75rem;
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
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
`;

export const sprintSummaryValue = css`
  font-size: 1.125rem;
  font-weight: 900;
  color: white;
`;

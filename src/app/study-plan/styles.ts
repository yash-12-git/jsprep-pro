import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const header = css`
  text-align: center;
  margin-bottom: 2rem;
`;

export const title = css`
  font-size: 1.625rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

export const subtitle = css`
  color: ${C.muted};
  font-size: 0.875rem;
  line-height: 1.6;
`;

export const inputCard = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const inputLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
`;

export const dateInput = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.5625rem 0.875rem;
  font-size: 0.875rem;
  color: ${C.text};
  outline: none;
  width: 100%;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &:focus {
    border-color: ${C.accent};
    box-shadow: 0 0 0 2px ${C.accentSubtle};
  }
`;

export const readinessCard = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const readinessCircle = css`
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background: ${C.amberSubtle};
  border: 2px solid ${C.amberBorder};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const readinessPct = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${C.amber};
  line-height: 1;
  letter-spacing: -0.02em;
`;

export const readinessLabel = css`
  font-size: 0.5rem;
  color: ${C.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const section = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.375rem;
  margin-bottom: 1.25rem;
`;

export const sectionTitle = css`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 1rem;
`;

export const weakSpotItem = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  margin-bottom: 0.625rem;
`;

export const weakSpotHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const weakSpotName = css`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${C.text};
`;

export const weakSpotPct = css`
  font-size: 0.75rem;
  color: ${C.red};
  font-weight: 600;
`;

export const weakSpotTip = css`
  font-size: 0.75rem;
  color: ${C.muted};
  line-height: 1.55;
`;

export const dayCard = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  margin-bottom: 0.625rem;
`;

export const dayLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.accent};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

export const dayTask = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  line-height: 1.55;
  margin-bottom: 0.25rem;
`;

export const quickWinBadge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: ${C.green};
  font-weight: 500;
  margin: 0.25rem;
`;

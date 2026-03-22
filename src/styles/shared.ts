import { css } from "@emotion/react";
import { C, BP, RADIUS } from "./tokens";

// ─── Reusable atoms used across multiple pages ────────────────────────────────

export const pageWrapper = css`
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: ${BP.sm}) {
    padding: 2.5rem 1.5rem;
  }
`;

export const pageWrapperWide = css`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: ${BP.sm}) {
    padding: 2.5rem 1.5rem;
  }
`;

export const spinner = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const spinnerDot = css`
  width: 2rem;
  height: 2rem;
  border: 2px solid ${C.border};
  border-top-color: ${C.accent};
  border-radius: 9999px;
  animation: spin 0.7s linear infinite;
`;

export const card = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
`;

export const progressBarTrack = css`
  height: 0.375rem;
  background: ${C.surface};
  border-radius: 9999px;
  overflow: hidden;
  flex: 1;
`;

export const progressBarFill = (pct: number, color = C.accent) => css`
  height: 100%;
  width: ${pct}%;
  background: ${color};
  border-radius: 9999px;
  transition: width 0.4s ease;
`;

export const categoryScroll = css`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const categoryChip = (
  active: boolean,
  activeColor: string = C.accent,
) => css`
  flex-shrink: 0;
  padding: 0.3125rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid ${active ? activeColor : C.border};
  background: ${active ? C.accentSubtle : "transparent"};
  color: ${active ? activeColor : C.muted};
  cursor: pointer;
  transition: all 0.12s ease;
  &:hover {
    border-color: ${activeColor};
    color: ${activeColor};
    background: ${C.accentSubtle};
  }
`;

export const diffBadge = (level: "easy" | "medium" | "hard") => {
  const map = {
    easy: {
      bg: C.greenSubtle,
      color: C.green,
      border: C.greenBorder,
    },
    medium: {
      bg: C.amberSubtle,
      color: C.amber,
      border: C.amberBorder,
    },
    hard: {
      bg: C.redSubtle,
      color: C.red,
      border: C.redBorder,
    },
  };
  const t = map[level];
  return css`
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    border: 1px solid ${t.border};
    background: ${t.bg};
    color: ${t.color};
    letter-spacing: 0.02em;
  `;
};

export const proBadgeSmall = css`
  font-size: 0.5rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: ${C.amberSubtle};
  color: ${C.amber};
  border: 1px solid ${C.amberBorder};
  letter-spacing: 0.04em;
`;

export const iconBox = (color: string, size = "2.25rem") => css`
  width: ${size};
  height: ${size};
  border-radius: ${RADIUS.lg};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${color};
`;

export const infoBox = (color: string) => css`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-left: 3px solid ${color};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem 1rem;
`;

export const sectionLabel = (color = C.accent) => css`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${color};
`;

export const actionBtn = (color: string, active = false) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.75rem;
  border-radius: ${RADIUS.md};
  font-size: 0.75rem;
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
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const primaryBtn = (color: string = C.accent) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
  font-weight: 500;
  background: ${color};
  border: 1px solid ${color};
  color: #ffffff;
  cursor: pointer;
  transition:
    opacity 0.12s ease,
    background 0.12s ease;
  &:hover {
    opacity: 0.88;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const ghostBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid ${C.border};
  color: ${C.muted};
  background: transparent;
  cursor: pointer;
  transition: all 0.12s ease;
  &:hover {
    color: ${C.text};
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

export const textarea = (focusColor: string = C.accent) => css`
  width: 100%;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.75rem 1rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
  color: ${C.text};
  outline: none;
  resize: none;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  line-height: 1.75;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${focusColor};
    box-shadow: 0 0 0 2px ${C.accentSubtle};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${C.bgSubtle};
  }
`;

export const codeBlock = (borderColor: string = C.border) => css`
  margin: 0;
  background: ${C.codeBg};
  border: 1px solid ${borderColor};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.6875rem;
  color: ${C.codeText};
  overflow: auto;
  line-height: 1.75;
`;

export const divider = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0.5rem 0;
`;

// ─── Page header ──────────────────────────────────────────────────────────────
export const pageHeader = css`
  margin-bottom: 2rem;
`;

export const pageHeaderTop = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const pageTitleText = css`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
`;

export const pageSubtitleText = css`
  color: ${C.muted};
  font-size: 0.8125rem;
  line-height: 1.6;
`;

export const pageProgressRow = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const pageProgressCount = (color: string = C.accent) => css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${color};
  white-space: nowrap;
`;

// ─── Stat cards ───────────────────────────────────────────────────────────────
export const statCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1.25rem;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
  }
`;

export const statNum = (color: string) => css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
`;

export const statLabel = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const proNudge = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 1.25rem;
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: ${C.amber};
  font-weight: 600;
  flex-wrap: wrap;
`;
export const upgradeBtn = css`
  padding: 0.5rem 1.125rem;
  background: ${C.accent};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    opacity: 0.9;
  }
`;

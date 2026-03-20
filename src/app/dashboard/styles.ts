import { css } from "@emotion/react";
import { C, RADIUS, BP } from "@/styles/tokens";

// ─── DashboardHeader ──────────────────────────────────────────────────────────

export const header = css`
  margin-bottom: 2rem;
`;

export const headerRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

export const greeting = css`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.02em;
`;

export const subStats = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const statChip = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${color};
`;

export const progressRow = css`
  display: flex;
  justify-content: space-between;
  margin-top: 0.375rem;
`;

export const progressLabel = css`
  color: ${C.muted};
  font-size: 0.75rem;
`;

export const freeLabel = css`
  color: ${C.amber};
  font-size: 0.75rem;
  font-weight: 500;
`;

export const shortcutsGrid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
  margin-top: 1.25rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

export const shortcutBtn = (border: string) => css`
  background: ${C.bg};
  border: 1px solid ${border};
  border-radius: ${RADIUS.lg};
  padding: 0.75rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.12s ease,
    transform 0.12s ease;
  &:hover {
    transform: translateY(-1px);
    background: ${C.bgSubtle};
  }
  &:active {
    transform: scale(0.97);
  }
`;

export const shortcutEmoji = css`
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`;

export const shortcutLabel = css`
  font-size: 0.625rem;
  font-weight: 600;
  color: ${C.text};
`;

// ─── CategoryFilter ───────────────────────────────────────────────────────────

export const filterBar = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const filterGroup = css`
  display: flex;
  gap: 0.375rem;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  flex-wrap: wrap;
`;

export const filterLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  white-space: nowrap;
  padding-top: 0.375rem;
`;

export const chip = (active: boolean, color: string) => css`
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 500;
  border: 1px solid ${active ? color : C.border};
  background: ${active ? C.accentSubtle : "transparent"};
  color: ${active ? color : C.muted};
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
  &:hover {
    border-color: ${color};
    color: ${color};
    background: ${C.accentSubtle};
  }
`;

export const diffChip = (active: boolean, diff: string) => {
  const COLOR_MAP: Record<string, string> = {
    beginner: C.green,
    core: C.accent,
    advanced: C.amber,
    expert: C.red,
  };
  const color = COLOR_MAP[diff] ?? C.accent;
  return chip(active, color);
};

export const searchBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.375rem 0.75rem;
  margin-bottom: 1rem;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &:focus-within {
    border-color: ${C.accent};
    box-shadow: 0 0 0 2px ${C.accentSubtle};
  }
`;

export const searchInput = css`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: ${C.text};
  &::placeholder {
    color: ${C.placeholder};
  }
`;

export const resultCount = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  padding: 0 0.25rem;
  margin-bottom: 1rem;
`;

// ─── QuestionList ─────────────────────────────────────────────────────────────

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const emptyState = css`
  text-align: center;
  padding: 4rem 1rem;
  color: ${C.muted};
`;

export const emptyTitle = css`
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.5rem;
`;

export const skeleton = css`
  height: 4.5rem;
  border-radius: ${RADIUS.lg};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  background-image: linear-gradient(
    90deg,
    ${C.bgSubtle} 0px,
    ${C.bgHover} 80px,
    ${C.bgSubtle} 160px
  );
  background-size: 400px 100%;
  animation: shimmer 1.4s linear infinite;
  @keyframes shimmer {
    0% {
      background-position: -400px 0;
    }
    100% {
      background-position: 400px 0;
    }
  }
`;

export const errorBox = css`
  padding: 1.25rem;
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  border-radius: ${RADIUS.lg};
  color: ${C.red};
  font-size: 0.875rem;
  text-align: center;
`;

export const loadMoreBtn = css`
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.6875rem;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  background: transparent;
  color: ${C.muted};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.12s ease;
  &:hover {
    color: ${C.text};
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

// ─── QuestionCard ─────────────────────────────────────────────────────────────

export const card = (mastered: boolean, open: boolean) => css`
  background: ${C.bg};
  border: 1px solid ${mastered ? C.greenBorder : open ? C.border : C.border};
  border-left: 3px solid ${mastered ? C.green : open ? C.accent : "transparent"};
  border-radius: ${RADIUS.lg};
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    border-left-color 0.15s ease;
  &:hover {
    border-color: ${mastered ? C.greenBorder : C.borderStrong};
  }
`;

export const cardSummary = css`
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

export const qNum = css`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.625rem;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 0.125rem 0.5rem;
  border-radius: ${RADIUS.sm};
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const qMeta = css`
  flex: 1;
  min-width: 0;
`;

export const qTitle = css`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.45;
  margin-bottom: 0.5rem;
  color: ${C.text};
`;

export const tagsRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const tag = (bg: string, color: string, border: string) => css`
  font-size: 0.5625rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: ${RADIUS.sm};
  background: ${bg};
  color: ${color};
  border: 1px solid ${border};
`;

export const chevron = (open: boolean) => css`
  flex-shrink: 0;
  color: ${C.muted};
  transition: transform 0.2s ease;
  transform: rotate(${open ? "180deg" : "0deg"});
`;

export const body = css`
  border-top: 1px solid ${C.border};
`;

export const hint = css`
  margin: 0.875rem 1rem 0;
  font-size: 0.75rem;
  color: ${C.green};
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  border-radius: ${RADIUS.md};
  padding: 0.5rem 0.75rem;
`;

export const answerArea = css`
  padding: 1rem 1.125rem;
  font-size: 0.8125rem;
  line-height: 1.8;
  color: ${C.text};

  h1,
  h2,
  h3 {
    font-weight: 700;
    margin: 1rem 0 0.5rem;
    color: ${C.text};
    letter-spacing: -0.01em;
  }
  h1 {
    font-size: 1.0625rem;
  }
  h2 {
    font-size: 0.9375rem;
  }
  h3 {
    font-size: 0.875rem;
  }
  p {
    margin: 0 0 0.75rem;
    color: ${C.text};
  }
  ul,
  ol {
    padding-left: 1.25rem;
    margin: 0 0 0.75rem;
  }
  li {
    margin-bottom: 0.25rem;
    color: ${C.text};
  }
  strong {
    color: ${C.text};
    font-weight: 600;
  }
  em {
    color: ${C.amber};
    font-style: italic;
  }
  a {
    color: ${C.accent};
    text-decoration: underline;
  }
  blockquote {
    border-left: 3px solid ${C.accent};
    padding: 0.25rem 0.75rem;
    margin: 0.75rem 0;
    color: ${C.accentText};
    background: ${C.accentSubtle};
    border-radius: 0 ${RADIUS.sm} ${RADIUS.sm} 0;
  }
  pre {
    background: ${C.codeBg};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.md};
    padding: 0.875rem 1rem;
    overflow-x: auto;
    margin: 0.75rem 0;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    line-height: 1.7;
    color: ${C.codeText};
  }
  code {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
  }
  p > code,
  li > code {
    background: ${C.codeInlineBg};
    border: 1px solid ${C.border};
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    color: ${C.codeText};
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75rem 0;
    font-size: 0.75rem;
  }
  th,
  td {
    border: 1px solid ${C.border};
    padding: 0.5rem 0.75rem;
    text-align: left;
  }
  th {
    background: ${C.bgSubtle};
    font-weight: 600;
    color: ${C.text};
  }
  td {
    color: ${C.muted};
  }
`;

// ─── QuestionList — pagination ────────────────────────────────────────────────

export const listHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.875rem;
`;

export const listHeaderCount = css`
  font-weight: 600;
  color: ${C.text};
`;

export const pagination = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid ${C.border};
`;

export const pageBtn = (enabled: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid ${C.border};
  background: ${C.bg};
  color: ${enabled ? C.text : C.muted};
  cursor: ${enabled ? "pointer" : "default"};
  transition:
    border-color 0.12s ease,
    background 0.12s ease;
  &:hover {
    border-color: ${enabled ? C.borderStrong : C.border};
    background: ${enabled ? C.bgHover : C.bg};
  }
`;

export const pageDots = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const pageNum = (active: boolean) => css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${RADIUS.sm};
  font-size: 0.75rem;
  font-weight: ${active ? "600" : "400"};
  border: 1px solid ${active ? C.accent : C.border};
  background: ${active ? C.accentSubtle : "transparent"};
  color: ${active ? C.accentText : C.muted};
  cursor: pointer;
  transition: all 0.12s ease;
  &:hover {
    background: ${C.accentSubtle};
    border-color: ${C.accent};
    color: ${C.accentText};
  }
`;

export const pageEllipsis = css`
  color: ${C.muted};
  font-size: 0.75rem;
  padding: 0 0.125rem;
  pointer-events: none;
`;

export const actionsRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1rem 0.875rem;
`;

export const actionBtn = (color: string, active: boolean) => css`
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
`;

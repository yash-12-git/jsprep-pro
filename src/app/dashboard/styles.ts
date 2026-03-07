import { css } from '@emotion/react'
import { C, RADIUS, BP } from '@/styles/tokens'

// ─── DashboardHeader ──────────────────────────────────────────────────────────

export const header = css`
  margin-bottom: 2rem;
`
export const headerRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`
export const greeting = css`
  font-size: 1.5rem;
  font-weight: 900;
`
export const subStats = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`
export const statChip = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
`
export const progressRow = css`
  display: flex;
  justify-content: space-between;
  margin-top: 0.375rem;
`
export const progressLabel = css`
  color: ${C.muted};
  font-size: 0.75rem;
`
export const freeLabel = css`
  color: rgba(251, 191, 36, 0.7);
  font-size: 0.75rem;
`
export const shortcutsGrid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1.25rem;
  @media (min-width: ${BP.sm}) { grid-template-columns: repeat(6, 1fr); }
`
export const shortcutBtn = (border: string) => css`
  background: ${C.card};
  border: 1px solid ${border};
  border-radius: ${RADIUS.xl};
  padding: 0.75rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
  &:hover { transform: translateY(-1px); }
  &:active { transform: scale(0.97); }
`
export const shortcutEmoji = css`
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`
export const shortcutLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
`

// ─── CategoryFilter ───────────────────────────────────────────────────────────

export const filterBar = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`
export const filterGroup = css`
  display: flex;
  gap: 0.375rem;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  flex-wrap: wrap;
`
export const filterLabel = css`
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  white-space: nowrap;
  padding-top: 0.375rem;
`
export const chip = (active: boolean, color: string) => css`
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  border: 1px solid ${active ? color + '80' : C.border};
  background: ${active ? color + '1a' : 'transparent'};
  color: ${active ? color : C.muted};
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  &:hover { border-color: ${color + '66'}; color: ${active ? color : 'white'}; }
`
export const diffChip = (active: boolean, diff: string) => {
  const COLOR_MAP: Record<string, string> = {
    beginner: C.accent3, core: C.accent, advanced: C.accent2, expert: C.danger
  }
  const color = COLOR_MAP[diff] ?? C.accent
  return chip(active, color)
}
export const searchBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 0.375rem 0.75rem;
  margin-bottom: 1rem;
  transition: border-color 0.15s ease;
  &:focus-within { border-color: ${C.accent}66; }
`
export const searchInput = css`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: white;
  &::placeholder { color: ${C.muted}; }
`
export const resultCount = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  padding: 0 0.25rem;
  margin-bottom: 1rem;
`

// ─── QuestionList ─────────────────────────────────────────────────────────────

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`
export const emptyState = css`
  text-align: center;
  padding: 4rem 1rem;
  color: ${C.muted};
`
export const emptyTitle = css`
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`
export const skeleton = css`
  height: 4.5rem;
  border-radius: ${RADIUS.xxl};
  background: ${C.card};
  border: 1px solid rgba(255,255,255,0.06);
  background-image: linear-gradient(
    90deg,
    rgba(255,255,255,0.02) 0px,
    rgba(255,255,255,0.05) 80px,
    rgba(255,255,255,0.02) 160px
  );
  background-size: 400px 100%;
  animation: shimmer 1.4s linear infinite;
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
`

export const errorBox = css`
  padding: 1.25rem;
  background: ${C.danger}12;
  border: 1px solid ${C.danger}33;
  border-radius: ${RADIUS.xl};
  color: ${C.danger};
  font-size: 0.875rem;
  text-align: center;
`

export const loadMoreBtn = css`
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  background: transparent;
  color: ${C.muted};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { color: white; border-color: ${C.accent}66; }
`

// ─── QuestionCard ─────────────────────────────────────────────────────────────

export const card = (mastered: boolean, open: boolean) => css`
  background: ${C.card};
  border: 1px solid ${mastered ? C.accent3 + '4d' : open ? C.accent + '33' : C.border};
  border-radius: ${RADIUS.xxl};
  overflow: hidden;
  transition: border-color 0.2s ease;
  &:hover { border-color: ${mastered ? C.accent3 + '80' : C.accent + '4d'}; }
`
export const cardSummary = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  user-select: none;
`
export const qNum = css`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  color: ${C.accent};
  background: ${C.accent}1a;
  border: 1px solid ${C.accent}33;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`
export const qMeta = css`
  flex: 1;
  min-width: 0;
`
export const qTitle = css`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: white;
`
export const tagsRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`
export const tag = (bg: string, color: string, border: string) => css`
  font-size: 0.5625rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background: ${bg};
  color: ${color};
  border: 1px solid ${border};
`
export const chevron = (open: boolean) => css`
  flex-shrink: 0;
  color: ${C.muted};
  transition: transform 0.3s ease;
  transform: rotate(${open ? '180deg' : '0deg'});
`
export const body = css`
  border-top: 1px solid ${C.border};
`
export const hint = css`
  margin: 1rem 1.25rem 0;
  font-size: 0.75rem;
  color: ${C.accent3};
  background: ${C.accent3}1a;
  border: 1px solid ${C.accent3}33;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
`
export const answerArea = css`
  padding: 1rem 1.25rem;
  font-size: 0.8125rem;
  line-height: 1.8;
  color: ${C.text};

  /* Markdown styles */
  h1, h2, h3 { font-weight: 800; margin: 1rem 0 0.5rem; color: white; }
  h1 { font-size: 1.125rem; }
  h2 { font-size: 1rem; }
  h3 { font-size: 0.9375rem; }
  p  { margin: 0 0 0.75rem; }
  ul, ol { padding-left: 1.25rem; margin: 0 0 0.75rem; }
  li { margin-bottom: 0.25rem; }
  strong { color: white; font-weight: 700; }
  em { color: ${C.accent2}; font-style: italic; }
  a  { color: ${C.accent}; text-decoration: underline; }
  blockquote {
    border-left: 3px solid ${C.accent};
    padding: 0.25rem 0.75rem;
    margin: 0.75rem 0;
    color: ${C.muted};
    background: ${C.surface};
    border-radius: 0 0.5rem 0.5rem 0;
  }
  pre {
    background: #0a0a14;
    border: 1px solid ${C.border};
    border-radius: 0.75rem;
    padding: 0.875rem 1rem;
    overflow-x: auto;
    margin: 0.75rem 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    line-height: 1.7;
  }
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
  }
  p > code, li > code {
    background: ${C.surface};
    border: 1px solid ${C.border};
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    color: ${C.accent3};
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75rem 0;
    font-size: 0.75rem;
  }
  th, td {
    border: 1px solid ${C.border};
    padding: 0.5rem 0.75rem;
    text-align: left;
  }
  th { background: ${C.surface}; font-weight: 700; color: white; }
`

// ─── QuestionList — pagination ────────────────────────────────────────────────

export const listHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.875rem;
`

export const listHeaderCount = css`font-weight: 700; color: white;`

export const pagination = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
`

export const pageBtn = (enabled: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: ${enabled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'};
  cursor: ${enabled ? 'pointer' : 'default'};
  transition: background 0.15s ease;
  &:hover { background: ${enabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}; }
`

export const pageDots = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const pageNum = (active: boolean) => css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.4375rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${active ? 'rgba(124,106,247,0.45)' : 'rgba(255,255,255,0.07)'};
  background: ${active ? 'rgba(124,106,247,0.18)' : 'transparent'};
  color: ${active ? '#c4b5fd' : 'rgba(255,255,255,0.4)'};
  cursor: pointer;
  transition: all 0.12s ease;
  &:hover { background: rgba(124,106,247,0.1); color: rgba(255,255,255,0.75); }
`

export const pageEllipsis = css`
  color: ${C.muted};
  font-size: 0.75rem;
  padding: 0 0.125rem;
  pointer-events: none;
`


export const actionsRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.25rem 1rem;
`
export const actionBtn = (color: string, active: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${active ? color + '66' : C.border};
  background: ${active ? color + '1a' : 'transparent'};
  color: ${active ? color : C.muted};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { border-color: ${color + '66'}; color: ${active ? color : 'white'}; }
`
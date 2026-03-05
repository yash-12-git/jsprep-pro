import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const header = css`
  margin-bottom: 2rem;
`

export const headerTop = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`

export const pageTitle = css`
  font-size: 1.5rem;
  font-weight: 900;
`

export const pageSubtitle = css`
  color: ${C.muted};
  font-size: 0.75rem;
`

export const progressRow = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
`

export const progressCount = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${C.danger};
  white-space: nowrap;
`

export const catBadgesRow = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`

export const catBadge = (bg: string, color: string, border: string) => css`
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: ${bg};
  color: ${color};
  border: 1px solid ${border};
`

// ─── Question card ────────────────────────────────────────────────────────────

export const questionCard = (state: 'idle' | 'solved' | 'wrong' | 'revealed') => {
  const borders = {
    idle: C.border,
    solved: C.accent3 + '66',
    wrong: C.danger + '4d',
    revealed: C.border,
  }
  return css`
    background: ${C.card};
    border: 1px solid ${borders[state]};
    border-radius: ${RADIUS.xxl};
    overflow: hidden;
    transition: border-color 0.2s ease;
    &:hover { border-color: ${state === 'idle' ? C.danger + '4d' : borders[state]}; }
  `
}

export const cardHeader = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
`

export const qNumber = css`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: ${C.danger};
  background: ${C.danger}1a;
  border: 1px solid ${C.danger}33;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`

export const cardBody = css`
  border-top: 1px solid ${C.border};
`

export const descriptionBox = css`
  margin: 1.25rem 1.25rem 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: ${C.danger}1a;
  border: 1px solid ${C.danger}33;
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`

export const descriptionText = css`
  font-size: 0.875rem;
  color: #e8c8c8;
  line-height: 1.6;
`

export const bodyInner = css`
  padding: 0 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const codeSectionLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`

export const fixLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.accent3};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`

export const fixLabelNote = css`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${C.muted};
  text-transform: none;
  letter-spacing: 0;
  margin-left: 0.25rem;
`

export const codeTextarea = (state: 'idle' | 'checking' | 'correct' | 'wrong') => {
  const borders = {
    idle: C.accent3 + '4d',
    checking: C.border,
    correct: C.accent3 + '80',
    wrong: C.danger + '66',
  }
  return css`
    width: 100%;
    background: #0a0a12;
    border: 1px solid ${borders[state]};
    border-radius: ${RADIUS.xl};
    padding: 0.75rem 1rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: white;
    outline: none;
    resize: none;
    line-height: 1.8;
    transition: border-color 0.15s ease;
    &:focus { border-color: ${C.accent3}80; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  `
}

export const actionRow = css`
  display: flex;
  gap: 0.75rem;
`

// ─── AI Feedback ──────────────────────────────────────────────────────────────

export const feedbackBox = (correct: boolean) => css`
  border: 1px solid ${correct ? C.accent3 + '4d' : C.danger + '33'};
  background: ${correct ? C.accent3 + '0d' : C.danger + '0d'};
  border-radius: ${RADIUS.xxl};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const scoreRow = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const scoreNumber = (correct: boolean, score: number) => css`
  font-size: 2rem;
  font-weight: 900;
  color: ${correct ? C.accent3 : score >= 5 ? C.accent2 : C.danger};
`

export const scoreDenom = css`
  font-size: 1.125rem;
  color: ${C.muted};
`

export const scoreBarTrack = css`
  height: 0.375rem;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.25rem;
`

export const scoreBarFill = (pct: number, color: string) => css`
  height: 100%;
  width: ${pct}%;
  background: ${color};
  border-radius: 9999px;
  transition: width 0.5s ease;
`

export const feedbackRow = (color: string) => css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 0.75rem;
`

export const feedbackRowTitle = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.25rem;
`

export const feedbackRowText = css`
  font-size: 0.75rem;
  color: ${C.text};
`

export const hintBox = css`
  background: ${C.accent2}1a;
  border: 1px solid ${C.accent2}33;
  border-radius: ${RADIUS.xl};
  padding: 0.75rem;
`

// ─── Revealed answer ──────────────────────────────────────────────────────────

export const diffGrid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`

export const diffLabel = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.5rem;
`

export const revealCard = css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`

export const chevronWrapper = (open: boolean) => css`
  flex-shrink: 0;
  transition: transform 0.3s ease;
  transform: rotate(${open ? '180deg' : '0deg'});
  color: ${C.muted};
`
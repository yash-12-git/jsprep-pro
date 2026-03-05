import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

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

export const masteredCount = css`
  color: ${C.muted};
  font-size: 0.875rem;
`

export const progressRow = css`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
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
  margin-bottom: 1.5rem;
`

export const shortcutBtn = (borderColor: string) => css`
  background: ${C.card};
  border: 1px solid ${borderColor};
  border-radius: ${RADIUS.xl};
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease;
  &:hover { border-color: ${borderColor.replace('30', '60')}; }
`

export const shortcutIcon = css`
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`

export const shortcutLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
`

// ─── Question card ────────────────────────────────────────────────────────────

export const questionCard = (mastered: boolean) => css`
  background: ${C.card};
  border: 1px solid ${mastered ? C.accent3 + '4d' : C.border};
  border-radius: ${RADIUS.xxl};
  overflow: hidden;
  transition: border-color 0.2s ease;
  &:hover { border-color: ${mastered ? C.accent3 + '80' : C.accent + '4d'}; }
`

export const questionHeader = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
`

export const qNumber = css`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: ${C.accent};
  background: ${C.accent}1a;
  border: 1px solid ${C.accent}33;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`

export const questionText = css`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  flex: 1;
  min-width: 0;
`

export const tagsRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

export const tag = (bg: string, color: string, border: string) => css`
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background: ${bg};
  color: ${color};
  border: 1px solid ${border};
`

export const chevronWrapper = (open: boolean) => css`
  flex-shrink: 0;
  transition: transform 0.3s ease;
  transform: rotate(${open ? '180deg' : '0deg'});
  color: ${C.muted};
`

export const questionBody = css`
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

export const answerBody = css`
  padding: 1rem 1.25rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: ${C.text};
`

export const actionRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.25rem 1rem;
`
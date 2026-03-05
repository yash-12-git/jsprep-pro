import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const title = css`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 2rem;
`

export const statsGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
`

export const statCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.25rem;
`

export const statIconBox = (bg: string) => css`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: ${bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
`

export const statValue = (color: string) => css`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${color};
  margin-bottom: 0.25rem;
`

export const statLabel = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const section = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

export const sectionTitle = css`
  font-weight: 900;
  margin-bottom: 0.25rem;
`

export const sectionSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 1.25rem;
`

export const overallRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const overallPct = css`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${C.accent};
`

export const categoryRow = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const categoryItem = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const categoryLabelRow = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
`

export const categoryName = css`
  font-weight: 600;
  color: white;
`

export const categoryCount = css`
  color: ${C.muted};
`

export const barFill = (pct: number, color: string) => css`
  height: 0.5rem;
  width: ${pct}%;
  background: ${color};
  border-radius: 9999px;
  transition: width 0.5s ease;
`

export const barTrack = css`
  height: 0.5rem;
  background: ${C.surface};
  border-radius: 9999px;
  overflow: hidden;
`

export const quizHistoryRow = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const quizDate = css`
  color: ${C.muted};
  font-size: 0.75rem;
  width: 6rem;
  flex-shrink: 0;
`

export const quizPct = css`
  font-size: 0.75rem;
  font-weight: 700;
  width: 2.5rem;
  text-align: right;
`

export const emptyState = css`
  text-align: center;
  color: ${C.muted};
  padding: 2rem;
`
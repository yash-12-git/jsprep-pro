import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`

export const timerBox = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
`

export const timerText = (urgent: boolean) => css`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${urgent ? C.danger : C.accent2};
`

export const questionCounter = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
`

export const questionText = css`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`

export const optionsGrid = css`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

export const option = (state: 'default' | 'selected' | 'correct' | 'wrong') => {
  const map = {
    default: { bg: C.surface, border: C.border, color: 'white' },
    selected: { bg: `${C.accent}1a`, border: `${C.accent}66`, color: C.accent },
    correct: { bg: `${C.accent3}1a`, border: `${C.accent3}66`, color: C.accent3 },
    wrong: { bg: `${C.danger}1a`, border: `${C.danger}66`, color: C.danger },
  }
  const t = map[state]
  return css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: ${RADIUS.xl};
    background: ${t.bg};
    border: 1px solid ${t.border};
    color: ${t.color};
    font-weight: 600;
    font-size: 0.875rem;
    cursor: ${state === 'default' ? 'pointer' : 'default'};
    transition: all 0.15s ease;
    &:hover { border-color: ${state === 'default' ? C.accent + '80' : t.border}; }
  `
}

export const explanation = css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  font-size: 0.8125rem;
  color: ${C.text};
  line-height: 1.7;
  margin-bottom: 1rem;
`

export const resultsCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 2.5rem;
  text-align: center;
`

export const bigScore = css`
  font-size: 4rem;
  font-weight: 900;
  color: ${C.accent};
  line-height: 1;
  margin-bottom: 0.5rem;
`

export const resultLabel = css`
  color: ${C.muted};
  font-size: 0.875rem;
  margin-bottom: 2rem;
`

export const statsRow = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`

export const statBox = css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`

export const statNum = (color: string) => css`
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
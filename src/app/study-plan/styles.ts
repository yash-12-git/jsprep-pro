import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const header = css`
  text-align: center;
  margin-bottom: 2rem;
`

export const title = css`
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`

export const subtitle = css`
  color: ${C.muted};
  font-size: 0.875rem;
`

export const inputCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

export const inputLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`

export const dateInput = css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: white;
  outline: none;
  width: 100%;
  transition: border-color 0.15s ease;
  &:focus { border-color: ${C.accent2}80; }
`

export const readinessCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

export const readinessCircle = css`
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background: ${C.accent2}1a;
  border: 2px solid ${C.accent2}66;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const readinessPct = css`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${C.accent2};
  line-height: 1;
`

export const readinessLabel = css`
  font-size: 0.5rem;
  color: ${C.muted};
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
  font-size: 1rem;
  font-weight: 900;
  margin-bottom: 1rem;
`

export const weakSpotItem = css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  margin-bottom: 0.75rem;
`

export const weakSpotHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`

export const weakSpotName = css`
  font-weight: 700;
  font-size: 0.875rem;
`

export const weakSpotPct = css`
  font-size: 0.75rem;
  color: ${C.danger};
  font-weight: 700;
`

export const weakSpotTip = css`
  font-size: 0.75rem;
  color: ${C.text};
  line-height: 1.5;
`

export const dayCard = css`
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  margin-bottom: 0.75rem;
`

export const dayLabel = css`
  font-size: 0.75rem;
  font-weight: 900;
  color: ${C.accent};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`

export const dayTask = css`
  font-size: 0.8125rem;
  color: ${C.text};
  line-height: 1.5;
  margin-bottom: 0.25rem;
`

export const quickWinBadge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: ${C.accent3}1a;
  border: 1px solid ${C.accent3}33;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: ${C.accent3};
  font-weight: 600;
  margin: 0.25rem;
`
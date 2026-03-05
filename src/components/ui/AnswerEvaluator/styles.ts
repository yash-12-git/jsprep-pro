import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const wrapper = css`
  border-top: 1px solid ${C.border};
  background: #0d0d16;
`

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid ${C.border};
`

export const headerLeft = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const headerIcon = css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: ${C.accent2}1a;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const headerTitle = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.accent2};
`

export const headerSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
`

export const closeBtn = css`
  background: none;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  padding: 0.125rem;
  transition: color 0.15s ease;
  &:hover { color: white; }
`

export const body = css`
  padding: 1rem 1.25rem;
`

export const prompt = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.75rem;
`

export const evalBtn = css`
  margin-top: 0.75rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${C.accent2}1a;
  border: 1px solid ${C.accent2}4d;
  color: ${C.accent2};
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.625rem;
  border-radius: ${RADIUS.xl};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { background: ${C.accent2}33; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const resultArea = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const scoreCard = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`

export const scoreLeft = css`
  text-align: center;
`

export const scoreNum = (score: number) => css`
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  color: ${score >= 8 ? C.accent3 : score >= 6 ? C.accent2 : score >= 4 ? C.orange : C.danger};
`

export const scoreDenom = css`
  font-size: 1.125rem;
  color: ${C.muted};
`

export const gradeText = (grade: string) => css`
  font-size: 1.125rem;
  font-weight: 900;
  color: ${['A','B'].includes(grade) ? C.accent3 : grade === 'C' ? C.accent2 : C.danger};
`

export const scoreRight = css`
  flex: 1;
`

export const verdict = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
`

export const barTrack = css`
  height: 0.5rem;
  background: ${C.border};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.5rem;
`

export const barFill = (score: number) => css`
  height: 100%;
  width: ${score * 10}%;
  border-radius: 9999px;
  background: ${score >= 8 ? C.accent3 : score >= 6 ? C.accent2 : score >= 4 ? C.orange : C.danger};
  transition: width 0.5s ease;
`

export const listSection = (color: string) => css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const listTitle = (color: string) => css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${color};
  margin-bottom: 0.25rem;
`

export const listItem = (bullet: string) => css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${C.text};
  &::before {
    content: '${bullet}';
    flex-shrink: 0;
  }
`

export const toggleBtn = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.accent};
  background: ${C.accent}1a;
  border: 1px solid ${C.accent}33;
  border-radius: ${RADIUS.xl};
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: ${C.accent}33; }
`

export const betterAnswerBox = css`
  font-size: 0.75rem;
  color: ${C.text};
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 0.75rem;
  line-height: 1.7;
`

export const tryAgainBtn = css`
  font-size: 0.75rem;
  color: ${C.muted};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  &:hover { color: white; }
`
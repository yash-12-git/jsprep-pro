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

export const printBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${RADIUS.xl};
  background: ${C.accent}1a;
  border: 1px solid ${C.accent}33;
  color: ${C.accent};
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: ${C.accent}33; }
  @media print { display: none; }
`

export const categorySection = css`
  margin-bottom: 2rem;
  @media print { break-inside: avoid; margin-bottom: 1.5rem; }
`

export const categoryTitle = css`
  font-size: 1.125rem;
  font-weight: 900;
  color: ${C.accent};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${C.border};
  @media print { color: #4f46e5; border-color: #e5e7eb; }
`

export const questionItem = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  margin-bottom: 0.75rem;
  @media print {
    background: white;
    border-color: #e5e7eb;
    break-inside: avoid;
    -webkit-print-color-adjust: exact;
  }
`

export const questionText = css`
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
  margin-bottom: 0.625rem;
  @media print { color: #111; }
`

export const answerText = css`
  font-size: 0.8125rem;
  color: ${C.text};
  line-height: 1.7;
  @media print { color: #374151; }
  p { margin: 0; }
  code {
    font-family: 'JetBrains Mono', monospace;
    background: ${C.surface};
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    @media print { background: #f3f4f6; color: #111; }
  }
`

export const emptyState = css`
  text-align: center;
  padding: 4rem 1rem;
  color: ${C.muted};
`

export const emptyTitle = css`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
`

export const emptyText = css`
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`
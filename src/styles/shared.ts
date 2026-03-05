import { css } from '@emotion/react'
import { C, BP, RADIUS } from './tokens'

// ─── Reusable atoms used across multiple pages ────────────────────────────────

export const pageWrapper = css`
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: ${BP.sm}) { padding: 2.5rem 1.5rem; }
`

export const pageWrapperWide = css`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: ${BP.sm}) { padding: 2.5rem 1.5rem; }
`

export const spinner = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const spinnerDot = css`
  width: 2rem;
  height: 2rem;
  border: 2px solid ${C.accent};
  border-top-color: transparent;
  border-radius: 9999px;
  animation: spin 0.7s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`

export const card = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
`

export const progressBarTrack = css`
  height: 0.5rem;
  background: ${C.surface};
  border-radius: 9999px;
  overflow: hidden;
  flex: 1;
`

export const progressBarFill = (pct: number, gradient = `linear-gradient(90deg, ${C.accent}, ${C.accent3})`) => css`
  height: 100%;
  width: ${pct}%;
  background: ${gradient};
  border-radius: 9999px;
  transition: width 0.5s ease;
`

export const categoryScroll = css`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

export const categoryChip = (active: boolean, activeColor = C.accent) => css`
  flex-shrink: 0;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${active ? activeColor : C.border};
  background: ${active ? activeColor : 'transparent'};
  color: ${active ? 'white' : C.muted};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { border-color: ${activeColor}; color: white; }
`

export const diffBadge = (level: 'easy' | 'medium' | 'hard') => {
  const map = {
    easy:   { bg: `rgba(106, 247, 192, 0.1)`, color: C.accent3, border: `rgba(106, 247, 192, 0.2)` },
    medium: { bg: `rgba(247, 199, 106, 0.1)`, color: C.accent2, border: `rgba(247, 199, 106, 0.2)` },
    hard:   { bg: `rgba(247, 106, 106, 0.1)`, color: C.danger,  border: `rgba(247, 106, 106, 0.2)` },
  }
  const t = map[level]
  return css`
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    border: 1px solid ${t.border};
    background: ${t.bg};
    color: ${t.color};
  `
}

export const proBadgeSmall = css`
  font-size: 0.5rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: rgba(247, 199, 106, 0.15);
  color: ${C.accent2};
`

export const iconBox = (color: string, size = '2.25rem') => css`
  width: ${size};
  height: ${size};
  border-radius: ${RADIUS.lg};
  background: ${color}1a;
  border: 1px solid ${color}33;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const infoBox = (color: string) => css`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: ${color}1a;
  border: 1px solid ${color}33;
  border-radius: ${RADIUS.xl};
  padding: 1rem;
`

export const sectionLabel = (color = C.accent) => css`
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${color};
`

export const actionBtn = (color: string, active = false) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${active ? color + '66' : C.border};
  background: ${active ? color + '33' : 'transparent'};
  color: ${active ? color : C.muted};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { border-color: ${color + '80'}; color: ${active ? color : 'white'}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const primaryBtn = (color = C.accent) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: ${RADIUS.xl};
  font-size: 0.75rem;
  font-weight: 700;
  background: ${color}33;
  border: 1px solid ${color}4d;
  color: ${color};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { background: ${color}4d; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const ghostBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  border-radius: ${RADIUS.xl};
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${C.border};
  color: ${C.muted};
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { color: white; border-color: rgba(255,255,255,0.2); }
`

export const textarea = (focusColor = C.accent) => css`
  width: 100%;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 0.75rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: white;
  outline: none;
  resize: none;
  transition: border-color 0.15s ease;
  line-height: 1.8;
  &::placeholder { color: ${C.muted}; }
  &:focus { border-color: ${focusColor}80; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

export const codeBlock = (borderColor = C.border) => css`
  margin: 0;
  background: #0d0d14;
  border: 1px solid ${borderColor};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  overflow: auto;
  line-height: 1.7;
`

export const divider = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0.5rem 0;
`

export const glow = (color: string) => css`
  position: fixed;
  border-radius: 9999px;
  background: ${color};
  filter: blur(80px);
  pointer-events: none;
`
import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const page = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

export const glow = css`
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 9999px;
  background: color-mix(in oklab, ${C.accent} 5%, transparent);
  filter: blur(80px);
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
`

export const container = css`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 24rem;
`

export const box = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 2rem;
  text-align: center;
`

export const logo = css`
  width: 3rem;
  height: 3rem;
  border-radius: ${RADIUS.lg};
  background: ${C.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 500;
  color: ${C.accentInk};
  margin: 0 auto 1.5rem;
`

export const title = css`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

export const subtitle = css`
  color: ${C.muted};
  font-size: 0.875rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`

export const googleBtn = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${C.bgSubtle};
  color: ${C.text};
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: ${RADIUS.lg};
  border: 1px solid ${C.borderStrong};
  cursor: pointer;
  transition: background-color var(--dur-short) var(--ease-out);
  &:hover { background: ${C.bgHover}; }
`

export const legal = css`
  color: ${C.muted};
  font-size: 0.75rem;
  margin-top: 1.5rem;
  line-height: 1.5;
`
export const inviteNote = css`
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  text-align: left;
  padding: 0.75rem 0.875rem;
  margin-bottom: 1rem;
  border-radius: ${RADIUS.lg};
  background: ${C.accentSubtle};
  color: ${C.accent};
  font-size: 0.8125rem;
  line-height: 1.5;
  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  p {
    margin: 0;
    color: ${C.text};
  }
`

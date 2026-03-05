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
  background: ${C.accent}0d;
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
  font-weight: 900;
  color: white;
  margin: 0 auto 1.5rem;
`

export const title = css`
  font-size: 1.5rem;
  font-weight: 900;
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
  background: white;
  color: #111;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: ${RADIUS.lg};
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: #f5f5f5; }
`

export const legal = css`
  color: ${C.muted};
  font-size: 0.75rem;
  margin-top: 1.5rem;
  line-height: 1.5;
`
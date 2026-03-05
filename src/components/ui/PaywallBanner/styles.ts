import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const overlay = css`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
`

export const modal = css`
  background: ${C.card};
  border: 2px solid ${C.accent}80;
  border-radius: ${RADIUS.xxl};
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  position: relative;
`

export const closeBtn = css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  padding: 0.25rem;
  transition: color 0.15s ease;
  &:hover { color: white; }
`

export const iconBox = css`
  width: 3rem;
  height: 3rem;
  background: ${C.accent}1a;
  border-radius: ${RADIUS.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`

export const title = css`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`

export const reasonText = css`
  color: ${C.accent3};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`

export const desc = css`
  color: ${C.muted};
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

export const featureList = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  list-style: none;
  padding: 0;
`

export const featureItem = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: white;
`

export const upgradeBtn = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${C.accent};
  color: white;
  font-weight: 900;
  font-size: 0.875rem;
  padding: 0.875rem;
  border-radius: ${RADIUS.xl};
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: ${C.accent}e6; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

export const legal = css`
  color: ${C.muted};
  font-size: 0.75rem;
  text-align: center;
  margin-top: 0.75rem;
`
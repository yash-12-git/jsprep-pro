import { css, keyframes } from '@emotion/react'
import { C, BP } from '@/styles/tokens'

// ─── Page shell ───────────────────────────────────────────────────────────────

export const pageShell = css`
  position: relative;
  min-height: 100vh;
  background: #07070e;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 28px 28px;
`

export const purpleGlow = css`
  position: fixed; top: -160px; right: -160px;
  width: 540px; height: 540px; border-radius: 50%;
  background: radial-gradient(circle, rgba(124,106,247,0.1) 0%, transparent 65%);
  pointer-events: none; z-index: 0;
`

export const greenGlow = css`
  position: fixed; bottom: -80px; left: -80px;
  width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, rgba(106,247,192,0.06) 0%, transparent 65%);
  pointer-events: none; z-index: 0;
`

export const content = css`
  position: relative; z-index: 1;
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1rem 6rem;
  @media (min-width: ${BP.sm}) {
    padding: 2rem 1.5rem 2.5rem;
  }
`

// ─── Desktop tab nav ──────────────────────────────────────────────────────────

export const desktopNav = css`
  display: none;
  @media (min-width: ${BP.md}) {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 1rem;
    padding: 0.3125rem;
  }
`

export const desktopBtn = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4375rem;
  padding: 0.625rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(255,255,255,0.38);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
  &:hover { color: rgba(255,255,255,0.7); }
`

export const desktopBtnActive = css`
  background: rgba(124,106,247,0.18);
  color: #c4b5fd;
  box-shadow: 0 1px 12px rgba(124,106,247,0.12);
`

// ─── Mobile bottom nav ────────────────────────────────────────────────────────

export const mobileNav = css`
  display: flex;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(7,7,14,0.94);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  @media (min-width: ${BP.md}) { display: none; }
`

export const mobileNavBtn = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 0.25rem 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.28);
  transition: color 0.15s;
  position: relative;
  -webkit-tap-highlight-color: transparent;
`

export const mobileNavBtnActive = css`
  color: #c4b5fd;
`

export const mobileNavDot = css`
  position: absolute;
  top: 0.3125rem;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #7c6af7;
  box-shadow: 0 0 6px rgba(124,106,247,0.8);
`

export const mobileNavLabel = css`
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`

// ─── Stats row ────────────────────────────────────────────────────────────────

export const statsRow = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 1.25rem;
  overflow: hidden;
  margin-bottom: 1.25rem;
  background: rgba(255,255,255,0.015);
`

export const statCell = css`
  text-align: center;
  padding: 1.25rem 0.5rem;
  border-right: 1px solid rgba(255,255,255,0.07);
  &:last-child { border-right: none; }
`

export const statNumber = (color: string) => css`
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: ${color};
  line-height: 1;
  margin-bottom: 0.3125rem;
`

export const statLabel = css`
  font-size: 0.5625rem;
  color: rgba(255,255,255,0.3);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
`

// ─── Jump button ──────────────────────────────────────────────────────────────

export const jumpBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: rgba(124,106,247,0.1);
  border: 1px solid rgba(124,106,247,0.2);
  color: #c4b5fd;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: rgba(124,106,247,0.18);
    border-color: rgba(124,106,247,0.35);
  }
`

// ─── Section header ───────────────────────────────────────────────────────────

export const sectionHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
`

export const sectionTitle = css`
  font-size: 0.9375rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

// ─── List / pagination ────────────────────────────────────────────────────────

export const listMeta = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.875rem;
`

export const pagination = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
`

export const pageBtn = (enabled: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: ${enabled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'};
  cursor: ${enabled ? 'pointer' : 'default'};
  transition: background 0.15s;
  &:hover { background: ${enabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}; }
`

export const pageDots = css`display: flex; align-items: center; gap: 0.25rem;`

export const pageNum = (active: boolean) => css`
  width: 1.75rem; height: 1.75rem;
  border-radius: 0.4375rem;
  font-size: 0.75rem; font-weight: 700;
  border: 1px solid ${active ? 'rgba(124,106,247,0.4)' : 'rgba(255,255,255,0.07)'};
  background: ${active ? 'rgba(124,106,247,0.2)' : 'transparent'};
  color: ${active ? '#c4b5fd' : 'rgba(255,255,255,0.4)'};
  cursor: pointer; transition: all 0.12s;
  &:hover { background: rgba(124,106,247,0.1); color: rgba(255,255,255,0.75); }
`

// ─── Skeleton shimmer ─────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% { opacity: 1 }
  50% { opacity: 0.4 }
`

export const skeletonBlock = (h = '3.5rem') => css`
  height: ${h};
  border-radius: 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  animation: ${pulse} 1.8s ease-in-out infinite;
`
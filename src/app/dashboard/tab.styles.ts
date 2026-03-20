import { css, keyframes } from "@emotion/react";
import { C, BP, RADIUS } from "@/styles/tokens";

// ─── Page shell ───────────────────────────────────────────────────────────────

export const pageShell = css`
  position: relative;
  min-height: 100vh;
  background: ${C.bg};
`;

// Kept as named exports — renders nothing on light theme
export const purpleGlow = css`
  display: none;
`;
export const greenGlow = css`
  display: none;
`;

export const content = css`
  position: relative;
  z-index: 1;
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1rem 6rem;
  @media (min-width: ${BP.sm}) {
    padding: 2rem 1.5rem 2.5rem;
  }
`;

// ─── Desktop tab nav ──────────────────────────────────────────────────────────

export const desktopNav = css`
  display: none;
  @media (min-width: ${BP.md}) {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1.75rem;
    background: ${C.bgSubtle};
    border: 1px solid ${C.border};
    border-radius: ${RADIUS.lg};
    padding: 0.3125rem;
  }
`;

export const desktopBtn = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4375rem;
  padding: 0.5625rem 0.5rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.muted};
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    color 0.12s ease,
    background 0.12s ease;
  white-space: nowrap;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const desktopBtnActive = css`
  background: ${C.bg};
  color: ${C.text};
  border: 1px solid ${C.border};
  font-weight: 600;
`;

// ─── Mobile bottom nav ────────────────────────────────────────────────────────

export const mobileNav = css`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid ${C.border};
  padding-bottom: env(safe-area-inset-bottom, 0px);
  @media (min-width: ${BP.md}) {
    display: none;
  }
`;

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
  color: ${C.muted};
  transition: color 0.12s ease;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  &:hover {
    color: ${C.text};
  }
`;

export const mobileNavBtnActive = css`
  color: ${C.accent};
`;

export const mobileNavDot = css`
  position: absolute;
  top: 0.3125rem;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${C.accent};
`;

export const mobileNavLabel = css`
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: inherit;
`;

// ─── Stats row ────────────────────────────────────────────────────────────────

export const statsRow = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  overflow: hidden;
  margin-bottom: 1.25rem;
  background: ${C.bg};
`;

export const statCell = css`
  text-align: center;
  padding: 1.25rem 0.5rem;
  border-right: 1px solid ${C.border};
  &:last-child {
    border-right: none;
  }
`;

export const statNumber = (color: string) => css`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${color};
  line-height: 1;
  margin-bottom: 0.3125rem;
  letter-spacing: -0.03em;
`;

export const statLabel = css`
  font-size: 0.5625rem;
  color: ${C.muted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

// ─── Jump button ──────────────────────────────────────────────────────────────

export const jumpBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8125rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  color: ${C.accentText};
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.12s ease,
    background 0.12s ease;
  &:hover {
    background: ${C.accentSubtle};
    border-color: ${C.accent};
  }
`;

// ─── Section header ───────────────────────────────────────────────────────────

export const sectionHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
`;

export const sectionTitle = css`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// ─── List / pagination ────────────────────────────────────────────────────────

export const listMeta = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.875rem;
`;

export const pagination = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid ${C.border};
`;

export const pageBtn = (enabled: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid ${C.border};
  background: ${C.bg};
  color: ${enabled ? C.text : C.muted};
  cursor: ${enabled ? "pointer" : "default"};
  transition:
    border-color 0.12s ease,
    background 0.12s ease;
  &:hover {
    border-color: ${enabled ? C.borderStrong : C.border};
    background: ${enabled ? C.bgHover : C.bg};
  }
`;

export const pageDots = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const pageNum = (active: boolean) => css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${RADIUS.sm};
  font-size: 0.75rem;
  font-weight: ${active ? "600" : "400"};
  border: 1px solid ${active ? C.accent : C.border};
  background: ${active ? C.accentSubtle : "transparent"};
  color: ${active ? C.accentText : C.muted};
  cursor: pointer;
  transition: all 0.12s ease;
  &:hover {
    background: ${C.accentSubtle};
    border-color: ${C.accent};
    color: ${C.accentText};
  }
`;

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% { opacity: 1 }
  50%       { opacity: 0.45 }
`;

export const skeletonBlock = (h = "3.5rem") => css`
  height: ${h};
  border-radius: ${RADIUS.lg};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

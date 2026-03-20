import { css } from "@emotion/react";
import { C, BP, RADIUS } from "@/styles/tokens";

// ─── Nav shell ────────────────────────────────────────────────────────────────

export const nav = css`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid ${C.border};
  background: ${C.bg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    0 4px 6px rgba(55, 53, 47, 0.04),
    0 12px 32px rgba(55, 53, 47, 0.1);
`;

export const navInner = css`
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────

export const logoLink = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  color: ${C.text};
  flex-shrink: 0;
`;

export const logoBadge = css`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: ${RADIUS.md};
  background: ${C.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.02em;
`;

export const logoText = css`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${C.text};
  @media (max-width: ${BP.sm}) {
    display: none;
  }
`;

export const logoAccent = css`
  color: ${C.accent};
`;

// ─── Marketing nav (logged-out) ───────────────────────────────────────────────

export const marketingLinks = css`
  display: none;
  align-items: center;
  gap: 0.25rem;
  @media (min-width: ${BP.md}) {
    display: flex;
  }
`;

export const marketingLink = css`
  padding: 0.375rem 0.75rem;
  border-radius: ${RADIUS.md};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.muted};
  text-decoration: none;
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const authCtas = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const getStartedBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: ${C.accent};
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.4375rem 0.875rem;
  border-radius: ${RADIUS.md};
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.88;
  }
  @media (max-width: ${BP.sm}) {
    display: none;
  }
`;

// ─── Desktop nav links ────────────────────────────────────────────────────────

export const desktopLinks = css`
  display: none;
  align-items: center;
  gap: 0.125rem;
  flex: 1;
  justify-content: center;
  @media (min-width: ${BP.md}) {
    display: flex;
  }
`;

export const navLink = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.muted};
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const navLinkActive = css`
  color: ${C.accent};
  background: ${C.accentSubtle};
  &:hover {
    color: ${C.accent};
    background: ${C.accentSubtle};
  }
`;

export const navLinkAiActive = css`
  color: ${C.accentText};
  background: ${C.accentSubtle};
  &:hover {
    color: ${C.accentText};
    background: ${C.accentSubtle};
  }
`;

export const navLinkHighlight = css`
  color: ${C.amber};
  &:hover {
    color: ${C.amber};
    background: ${C.amberSubtle};
  }
`;

export const newBadge = css`
  font-size: 0.5rem;
  background: ${C.amberSubtle};
  color: ${C.amber};
  border: 1px solid ${C.amberBorder};
  padding: 0.125rem 0.3125rem;
  border-radius: ${RADIUS.sm};
  font-weight: 700;
  letter-spacing: 0.04em;
`;

// ─── AI Tools dropdown ────────────────────────────────────────────────────────

export const aiDropdownWrapper = css`
  position: relative;
`;

export const aiDropdownTrigger = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
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
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const chevron = (open: boolean) => css`
  transition: transform 0.18s ease;
  transform: rotate(${open ? "180deg" : "0deg"});
`;

export const aiDropdownMenu = css`
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  width: 13.5rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  box-shadow:
    0 4px 6px rgba(55, 53, 47, 0.04),
    0 12px 32px rgba(55, 53, 47, 0.1);
  overflow: hidden;
  z-index: 50;
`;

export const aiDropdownItem = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: ${C.text};
  transition: background 0.12s ease;
  &:hover {
    background: ${C.bgHover};
  }
`;

export const aiDropdownItemActive = css`
  background: ${C.bgSubtle};
`;

export const aiIconBadge = css`
  width: 1.75rem;
  height: 1.75rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
  color: ${C.accentText};
`;

export const aiDropdownLabel = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.text};
`;

export const aiDropdownDesc = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  margin-top: 0.125rem;
  line-height: 1.5;
`;

// ─── Right side (avatar, streak, etc.) ───────────────────────────────────────

export const rightSide = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

export const proPill = css`
  display: none;
  align-items: center;
  gap: 0.25rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  @media (min-width: ${BP.sm}) {
    display: flex;
  }
`;

export const proPillText = css`
  font-size: 0.625rem;
  font-weight: 700;
  color: ${C.accentText};
  letter-spacing: 0.04em;
`;

export const streakPill = css`
  display: none;
  align-items: center;
  gap: 0.25rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  @media (min-width: ${BP.sm}) {
    display: flex;
  }
`;

export const streakText = css`
  font-size: 0.625rem;
  font-weight: 600;
  color: ${C.text};
`;

export const avatar = css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  flex-shrink: 0;
  border: 1.5px solid ${C.border};
`;

export const logoutBtn = css`
  display: none;
  padding: 0.375rem;
  border-radius: ${RADIUS.md};
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.red};
    background: ${C.redSubtle};
  }
  @media (min-width: ${BP.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const proBadge = css`
  margin-left: auto;
  font-size: 0.625rem;
  background: ${C.amberSubtle};
  color: ${C.amber};
  border: 1px solid ${C.amberBorder};
  padding: 0.125rem 0.375rem;
  border-radius: ${RADIUS.sm};
  font-weight: 700;
  letter-spacing: 0.04em;
`;

export const hamburgerBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  border-radius: ${RADIUS.md};
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
  @media (min-width: ${BP.md}) {
    display: none;
  }
`;

export const signInBtn = css`
  background: transparent;
  color: ${C.muted};
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.4375rem 0.875rem;
  border-radius: ${RADIUS.md};
  text-decoration: none;
  border: 1px solid ${C.border};
  transition: all 0.12s ease;
  &:hover {
    color: ${C.text};
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

// ─── Mobile slide-down menu ───────────────────────────────────────────────────

export const mobileMenu = css`
  position: fixed;
  inset: 3.5rem 0 0 0;
  z-index: 40;
  background: ${C.bg};
  border-bottom: 1px solid ${C.border};
  box-shadow: 0 8px 24px rgba(55, 53, 47, 0.08);
  overflow-y: auto;
  @media (min-width: ${BP.md}) {
    display: none;
  }
`;

export const mobileMenuInner = css`
  max-width: 32rem;
  margin: 0 auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const mobileNavLink = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.muted};
  text-decoration: none;
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const mobileNavLinkActive = css`
  color: ${C.accent};
  background: ${C.accentSubtle};
`;

export const mobileNavLinkAiActive = css`
  color: ${C.accentText};
  background: ${C.accentSubtle};
`;

export const mobileDivider = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0.375rem 0;
`;

export const mobileSectionLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  padding: 0 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
`;

export const mobileAiItemIcon = css`
  width: 1.75rem;
  height: 1.75rem;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${C.accentText};
`;

export const mobileNavItemContent = css`
  display: flex;
  flex-direction: column;
`;

export const mobileNavItemDesc = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 400;
  margin-top: 0.0625rem;
  line-height: 1.4;
`;

export const mobileProBadge = css`
  margin-left: auto;
  font-size: 0.5625rem;
  background: ${C.amberSubtle};
  color: ${C.amber};
  border: 1px solid ${C.amberBorder};
  padding: 0.125rem 0.375rem;
  border-radius: ${RADIUS.sm};
  font-weight: 700;
`;

export const mobileLogoutBtn = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.muted};
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.red};
    background: ${C.redSubtle};
  }
`;

// ─── Learn dropdown ───────────────────────────────────────────────────────────

export const learnDropdownWrapper = css`
  position: relative;
`;

export const learnDropdownTrigger = css`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.375rem 0.625rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.muted};
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const learnDropdownMenu = css`
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  width: 13.5rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.375rem;
  box-shadow:
    0 4px 6px rgba(55, 53, 47, 0.04),
    0 12px 32px rgba(55, 53, 47, 0.1);
  z-index: 100;
`;

export const learnDropdownItem = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5625rem 0.75rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.muted};
  text-decoration: none;
  transition:
    background 0.12s ease,
    color 0.12s ease;
  &:hover {
    background: ${C.bgHover};
    color: ${C.text};
  }
`;

export const learnDropdownItemActive = css`
  background: ${C.accentSubtle};
  color: ${C.accentText};
`;

export const learnIconBadge = css`
  width: 1.625rem;
  height: 1.625rem;
  border-radius: ${RADIUS.sm};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const learnDropdownLabel = css`
  font-size: 0.8125rem;
  font-weight: 500;
  color: inherit;
  display: block;
`;

export const learnDropdownDesc = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  display: block;
  margin-top: 1px;
  line-height: 1.4;
`;

export const learnNavLinkActive = css`
  color: ${C.green};
  background: ${C.greenSubtle};
`;

import { css } from "@emotion/react";
import { C, BP, RADIUS } from "@/styles/tokens";

// ─── Nav Shell ────────────────────────────────────────────────────────────────

export const nav = css`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid ${C.border};
  background: ${C.bg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 1px 0 0 ${C.border},
    0 4px 16px rgba(0, 0, 0, 0.04);
`;

export const navInner = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;

  /* On mobile, we have bottom nav — give content some room */
  @media (max-width: 767px) {
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

// ─── Groups ────────────────────────────────────────────────────────────────────

export const leftGroup = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

export const rightSide = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
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
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.02em;
  flex-shrink: 0;
`;

export const logoText = css`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: ${C.text};
  @media (max-width: ${BP.sm}) {
    display: none;
  }
`;

export const logoAccent = css`
  color: ${C.accent};
`;

// ─── Desktop Center Nav ────────────────────────────────────────────────────────

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

export const sep = css`
  width: 1px;
  height: 14px;
  background: ${C.border};
  flex-shrink: 0;
  margin: 0 0.25rem;
`;

// ─── Shared nav link (anchor + button) ───────────────────────────────────────

const navLinkBase = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.muted};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.12s ease,
    background 0.12s ease;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const navLink = css`
  ${navLinkBase};
`;

export const navLinkBtn = css`
  ${navLinkBase};
  border: none;
  background: transparent;
`;

export const navLinkActive = css`
  color: ${C.accent} !important;
  background: ${C.accentSubtle} !important;
`;

// Sprint link — amber highlight
export const sprintLink = css`
  color: ${C.amber};
  &:hover {
    color: ${C.amber};
    background: ${C.amberSubtle};
  }
`;

export const sprintLinkActive = css`
  color: ${C.amber} !important;
  background: ${C.amberSubtle} !important;
`;

// ─── Chevron ──────────────────────────────────────────────────────────────────

export const chevron = (isOpen: boolean) => css`
  transition: transform 0.18s ease;
  transform: rotate(${isOpen ? "180deg" : "0deg"});
  opacity: 0.6;
`;

// ─── Generic Dropdown ─────────────────────────────────────────────────────────

export const dropdownWrapper = css`
  position: relative;
`;

export const dropdownMenu = css`
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  min-width: 14rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.375rem;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 16px 40px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

export const dropdownSectionLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  padding: 0.25rem 0.75rem 0.375rem;
  margin: 0;
`;

export const dropdownItem = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  color: ${C.text};
  text-decoration: none;
  transition: background 0.1s ease;
  &:hover {
    background: ${C.bgHover};
  }
`;

export const dropdownItemActive = css`
  background: ${C.bgSubtle};
`;

export const dropdownIconBadge = (color: string) => css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${RADIUS.md};
  background: ${color}14;
  border: 1px solid ${color}28;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const dropdownLabel = css`
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.text};
  line-height: 1.3;
`;

export const dropdownDesc = css`
  display: block;
  font-size: 0.6875rem;
  color: ${C.muted};
  margin-top: 1px;
  line-height: 1.4;
`;

// ─── AI Coach CTA Button ───────────────────────────────────────────────────────

export const aiCoachBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.75rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  &:hover {
    background: ${C.accentSubtle};
    border-color: ${C.accent}55;
    box-shadow: 0 0 0 3px ${C.accent}18;
  }
`;

export const aiCoachBtnActive = css`
  background: ${C.accent};
  color: #fff;
  border-color: ${C.accent};
  &:hover {
    background: ${C.accent};
    border-color: ${C.accent};
  }
`;

export const aiDropdownMenu = css`
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 50%;
  transform: translateX(-50%);
  min-width: 15rem;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.375rem;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 16px 40px rgba(0, 0, 0, 0.12),
    0 0 0 1px ${C.accent}18;
  z-index: 100;
`;

// ─── Badges ───────────────────────────────────────────────────────────────────

export const proBadge = css`
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: ${C.amberSubtle};
  color: ${C.amber};
  border: 1px solid ${C.amberBorder};
  padding: 0.125rem 0.375rem;
  border-radius: ${RADIUS.sm};
`;

export const proPill = css`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  flex-shrink: 0;

  @media (max-width: 767px) {
    display: inline-flex;
  }
`;

export const streakChip = css`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  color: ${C.amber};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
`;

// ─── Theme Button ─────────────────────────────────────────────────────────────

export const themeBtn = (isDark: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${isDark ? "rgba(255,255,255,0.1)" : C.border};
  background: transparent;
  color: ${isDark ? "rgba(255,255,255,0.45)" : C.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.12s,
    border-color 0.12s,
    color 0.12s;
  &:hover {
    background: ${isDark ? "rgba(255,255,255,0.08)" : C.bgHover};
    border-color: ${isDark ? "rgba(255,255,255,0.2)" : C.borderStrong};
    color: ${isDark ? "#fff" : C.text};
  }
`;

// ─── Hamburger ────────────────────────────────────────────────────────────────

export const hamburgerBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${RADIUS.md};
  background: transparent;
  border: 1px solid ${C.border};
  cursor: pointer;
  color: ${C.muted};
  flex-shrink: 0;
  transition:
    color 0.12s,
    background 0.12s,
    border-color 0.12s;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
    border-color: ${C.borderStrong};
  }
  @media (min-width: ${BP.md}) {
    display: none;
  }
`;

// ─── Avatar ───────────────────────────────────────────────────────────────────

export const avatarBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 9999px;
  border: 1.5px solid ${C.border};
  background: ${C.bgSubtle};
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  transition: border-color 0.12s;
  &:hover {
    border-color: ${C.accent};
  }
`;

export const avatarInitials = css`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${C.muted};
`;

// ─── Account Panel ────────────────────────────────────────────────────────────

export const accountPanel = css`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.04),
    0 16px 32px rgba(0, 0, 0, 0.1);
  z-index: 200;
  overflow: hidden;
`;

export const accountPanelHeader = css`
  padding: 0.875rem 1rem;
  border-bottom: 1px solid ${C.border};
`;

export const accountName = css`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${C.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const accountEmail = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

export const panelItem = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.text};
  text-decoration: none;
  cursor: pointer;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  transition: background 0.1s;
  &:hover {
    background: ${C.bgHover};
  }
`;

export const panelDivider = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0;
`;

// ─── Auth CTAs ────────────────────────────────────────────────────────────────

export const marketingLinks = css`
  display: none;
  align-items: center;
  gap: 0.125rem;
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
    color 0.12s,
    background 0.12s;
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

export const signInBtn = css`
  background: transparent;
  color: ${C.muted};
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: ${RADIUS.md};
  text-decoration: none;
  border: 1px solid ${C.border};
  transition: all 0.12s;
  &:hover {
    color: ${C.text};
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

export const getStartedBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: ${C.accent};
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: ${RADIUS.md};
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.12s;
  &:hover {
    opacity: 0.88;
  }
  @media (max-width: ${BP.sm}) {
    display: none;
  }
`;

// ─── Mobile Slide-down Sheet ──────────────────────────────────────────────────

export const mobileSheet = css`
  position: fixed;
  inset: 3.25rem 0 0 0;
  z-index: 40;
  background: ${C.bg};
  overflow-y: auto;
  /* Soft shadow below the nav */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  @media (min-width: ${BP.md}) {
    display: none;
  }
`;

export const mobileSheetInner = css`
  max-width: 32rem;
  margin: 0 auto;
  padding: 0.75rem 0.75rem calc(0.75rem + 64px); /* extra bottom for tab bar */
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

export const mobileUserHeader = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem 1rem;
  border-bottom: 1px solid ${C.border};
  margin-bottom: 0.5rem;
`;

export const mobileAvatar = css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 1.5px solid ${C.border};
  background: ${C.bgSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

export const mobileAvatarInitials = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${C.muted};
`;

export const mobileUserName = css`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
`;

export const mobileUserBadges = css`
  display: flex;
  gap: 5px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

export const mobileSectionLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  padding: 0.375rem 0.875rem 0.25rem;
  margin: 0;
`;

export const mobileNavLink = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5625rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.muted};
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.12s,
    background 0.12s;
  &:hover {
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

export const mobileNavLinkActive = css`
  color: ${C.accent};
  background: ${C.accentSubtle};
`;

export const mobileNavLinkLearnActive = css`
  color: ${C.green};
  background: ${C.greenSubtle};
`;

export const mobileNavLinkAiActive = css`
  color: ${C.accentText};
  background: ${C.accentSubtle};
`;

export const mobileSprintLink = css`
  color: ${C.amber};
  &:hover {
    color: ${C.amber};
    background: ${C.amberSubtle};
  }
`;

export const mobileSprintActive = css`
  background: ${C.amberSubtle} !important;
`;

export const mobileDivider = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0.375rem 0;
`;

export const mobileIconBadge = (color: string) => css`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: ${RADIUS.md};
  background: ${color}14;
  border: 1px solid ${color}28;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const mobileItemContent = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const mobileItemDesc = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 400;
  margin-top: 1px;
  line-height: 1.4;
`;

export const mobileProBadge = css`
  margin-left: auto;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: ${C.amberSubtle};
  color: ${C.amber};
  border: 1px solid ${C.amberBorder};
  padding: 0.125rem 0.375rem;
  border-radius: ${RADIUS.sm};
  flex-shrink: 0;
`;

export const mobileLogoutBtn = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5625rem 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.red};
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.12s;
  &:hover {
    background: ${C.redSubtle};
  }
`;

// ─── Mobile Bottom Tab Bar ────────────────────────────────────────────────────

export const mobileBottomNav = css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${C.bg};
  border-top: 1px solid ${C.border};
  /* Subtle frosted blur */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: stretch;
  z-index: 60;
  /* Safe area for iOS home bar */
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow:
    0 -1px 0 ${C.border},
    0 -4px 16px rgba(0, 0, 0, 0.04);

  @media (min-width: ${BP.md}) {
    display: none;
  }
`;

export const mobileTabItem = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: ${C.muted};
  padding: 0.375rem 0 0.25rem;
  transition: color 0.15s ease;
  position: relative;

  &:hover {
    color: ${C.text};
  }

  /* Active indicator bar at top */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: ${C.accent};
    border-radius: 0 0 2px 2px;
    transition: width 0.2s ease;
  }
`;

export const mobileTabItemActive = css`
  color: ${C.accent};
  &::before {
    width: 24px;
  }
`;

export const mobileTabAi = css`
  color: ${C.accentText};
  &:hover {
    color: ${C.accent};
  }
`;

export const mobileTabAiActive = css`
  color: ${C.accent};
  &::before {
    width: 24px;
    background: ${C.accent};
  }
`;

export const mobileTabLabel = css`
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
`;

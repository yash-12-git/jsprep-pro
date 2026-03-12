import { css } from "@emotion/react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
// Keep colours in one place so a theme change is a one-line edit
const C = {
  accent: "#7c6af7",
  accent2: "#f7c76a",
  accent3: "#6af7c0",
  danger: "#f76a6a",
  purple: "#a78bfa",
  bg: "#0a0a10",
  card: "#111118",
  surface: "#16161f",
  border: "rgba(255,255,255,0.07)",
  muted: "rgba(255,255,255,0.45)",
};

const BREAKPOINTS = {
  md: "768px",
  sm: "640px",
};

// ─── Nav shell ────────────────────────────────────────────────────────────────

export const nav = css`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(7, 7, 14, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
`;

export const navInner = css`
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────

export const logoLink = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  color: white;
  flex-shrink: 0;
`;

export const logoBadge = css`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #7c6af7 0%, #6b59e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 900;
  color: white;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 12px rgba(124, 106, 247, 0.4);
`;

export const logoText = css`
  font-family: "Syne", sans-serif;
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  @media (max-width: ${BREAKPOINTS.sm}) {
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
  @media (min-width: ${BREAKPOINTS.md}) {
    display: flex;
  }
`;

export const marketingLink = css`
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition:
    color 0.15s ease,
    background 0.15s ease;
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.06);
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
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(124, 106, 247, 0.35);
  transition: all 0.15s ease;
  white-space: nowrap;
  &:hover {
    background: #6b59e8;
    box-shadow: 0 6px 18px rgba(124, 106, 247, 0.45);
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
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

  @media (min-width: ${BREAKPOINTS.md}) {
    display: flex;
  }
`;

export const navLink = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.muted};
  text-decoration: none;
  transition:
    color 0.15s ease,
    background 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: white;
    background: ${C.surface};
  }
`;

export const navLinkActive = css`
  color: ${C.accent};
  background: rgba(124, 106, 247, 0.15);

  &:hover {
    color: ${C.accent};
    background: rgba(124, 106, 247, 0.2);
  }
`;

export const navLinkAiActive = css`
  color: ${C.purple};
  background: rgba(167, 139, 250, 0.15);

  &:hover {
    color: ${C.purple};
  }
`;

export const navLinkHighlight = css`
  color: ${C.accent2};
  &:hover {
    color: ${C.accent2};
    background: rgba(247, 199, 106, 0.08);
  }
`;

export const newBadge = css`
  font-size: 0.5rem;
  background: rgba(247, 199, 106, 0.15);
  color: ${C.accent2};
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 700;
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
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.muted};
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: white;
    background: ${C.surface};
  }
`;

export const chevron = (open: boolean) => css`
  transition: transform 0.2s ease;
  transform: rotate(${open ? "180deg" : "0deg"});
`;

export const aiDropdownMenu = css`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 13rem;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 50;
`;

export const aiDropdownItem = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: white;
  transition: background 0.15s ease;

  &:hover {
    background: ${C.surface};
  }
`;

export const aiDropdownItemActive = css`
  background: ${C.surface};
`;

export const aiIconBadge = css`
  width: 1.75rem;
  height: 1.75rem;
  background: rgba(167, 139, 250, 0.12);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const aiDropdownLabel = css`
  font-size: 0.875rem;
  font-weight: 700;
`;

export const aiDropdownDesc = css`
  font-size: 0.6875rem;
  color: ${C.muted};
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
  background: rgba(124, 106, 247, 0.12);
  border: 1px solid rgba(124, 106, 247, 0.25);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;

  @media (min-width: ${BREAKPOINTS.sm}) {
    display: flex;
  }
`;

export const proPillText = css`
  font-size: 0.625rem;
  font-weight: 700;
  color: ${C.accent};
`;

export const streakPill = css`
  display: none;
  align-items: center;
  gap: 0.25rem;
  background: ${C.surface};
  border: 1px solid ${C.border};
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;

  @media (min-width: ${BREAKPOINTS.sm}) {
    display: flex;
  }
`;

export const streakText = css`
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
`;

export const avatar = css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  flex-shrink: 0;
`;

export const logoutBtn = css`
  display: none;
  padding: 0.375rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  transition: color 0.15s ease;

  &:hover {
    color: ${C.danger};
  }

  @media (min-width: ${BREAKPOINTS.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const proBadge = css`
  margin-left: auto;
  font-size: 0.625rem;
  background: rgba(247, 199, 106, 0.15);
  color: ${C.accent2};
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 700;
`;

export const hamburgerBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  transition: color 0.15s ease;

  &:hover {
    color: white;
  }

  @media (min-width: ${BREAKPOINTS.md}) {
    display: none;
  }
`;

export const signInBtn = css`
  background: ${C.accent};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(124, 106, 247, 0.85);
  }
`;

// ─── Mobile slide-down menu ───────────────────────────────────────────────────

export const mobileMenu = css`
  position: fixed;
  inset: 3.5rem 0 0 0;
  z-index: 40;
  background: rgba(10, 10, 16, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid ${C.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  overflow-y: auto;

  @media (min-width: ${BREAKPOINTS.md}) {
    display: none;
  }
`;

export const mobileMenuInner = css`
  max-width: 32rem;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const mobileNavLink = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.muted};
  text-decoration: none;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: white;
    background: ${C.surface};
  }
`;

export const mobileNavLinkActive = css`
  color: ${C.accent};
  background: rgba(124, 106, 247, 0.15);
`;

export const mobileNavLinkAiActive = css`
  color: ${C.purple};
  background: rgba(167, 139, 250, 0.15);
`;

export const mobileDivider = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0.5rem 0;
`;

export const mobileSectionLabel = css`
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.muted};
  padding: 0 1rem;
  margin-bottom: 0.25rem;
`;

export const mobileAiItemIcon = css`
  width: 1.75rem;
  height: 1.75rem;
  background: rgba(167, 139, 250, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const mobileNavItemContent = css`
  display: flex;
  flex-direction: column;
`;

export const mobileNavItemDesc = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 400;
`;

export const mobileProBadge = css`
  margin-left: auto;
  font-size: 0.5625rem;
  background: rgba(247, 199, 106, 0.15);
  color: ${C.accent2};
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 700;
`;

export const mobileLogoutBtn = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.muted};
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: color 0.15s ease;

  &:hover {
    color: ${C.danger};
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
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${C.muted};
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const learnDropdownMenu = css`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 13rem;
  background: #13131c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.875rem;
  padding: 0.5rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

export const learnDropdownItem = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition:
    background 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }
`;

export const learnDropdownItemActive = css`
  background: rgba(124, 106, 247, 0.12);
  color: #c4b5fd;
`;

export const learnIconBadge = css`
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 0.4375rem;
  background: rgba(124, 106, 247, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const learnDropdownLabel = css`
  font-size: 0.8125rem;
  font-weight: 600;
  color: inherit;
  display: block;
`;

export const learnDropdownDesc = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
  display: block;
  margin-top: 1px;
`;

export const learnNavLinkActive = css`
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.08);
`;

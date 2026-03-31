/** @jsxImportSource @emotion/react */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { css } from "@emotion/react";
import {
  Zap,
  BookOpen,
  LogOut,
  Mic,
  Map,
  FileDown,
  ChevronDown,
  Code2,
  Bug,
  Newspaper,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  Code,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import * as S from "./styles";
import { useTheme } from "@/contexts/ThemeContext";
import { C, RADIUS } from "@/styles/tokens";
import TrackSwitcher from "../ui/TrackSwitcher";
import { useTrack } from "@/contexts/TrackContext";

// ─── Local-only styles (not in styles.ts) ─────────────────────────────────────

// Thin vertical separator between nav groups
const sep = css`
  width: 1px;
  height: 14px;
  background: ${C.border};
  flex-shrink: 0;
  margin: 0 0.125rem;
`;

// PRO badge — always visible in right rail, not hidden in dropdown
const proBadgeRight = css`
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
`;

// Theme toggle button
const themeBtn = (isDark: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${RADIUS.md};
  border: 1px solid ${isDark ? "rgba(255,255,255,0.1)" : C.border};
  background: transparent;
  color: ${isDark ? "rgba(255,255,255,0.5)" : C.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.12s,
    border-color 0.12s,
    color 0.12s;
  &:hover {
    background: ${isDark ? "rgba(255,255,255,0.08)" : C.bgHover};
    border-color: ${isDark ? "rgba(255,255,255,0.18)" : C.borderStrong};
    color: ${isDark ? "#fff" : C.text};
  }
`;

// Circular avatar button
const avatarBtnStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: 1px solid ${C.border};
  background: ${C.bgSubtle};
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  transition: border-color 0.12s;
  &:hover {
    border-color: ${C.accent};
  }
`;

// Account dropdown panel
const panel = css`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 216px;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  box-shadow:
    0 4px 6px rgba(55, 53, 47, 0.04),
    0 12px 24px rgba(55, 53, 47, 0.09);
  z-index: 200;
  overflow: hidden;
`;
const pHeader = css`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${C.border};
`;
const pName = css`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${C.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const pEmail = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
`;
const pItem = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
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
const pDivider = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0;
`;

const streakChip = css`
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const MARKETING_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#practice", label: "Practice" },
  { href: "/topics", label: "Topics" },
  { href: "/blog", label: "Blog" },
  { href: "/#pricing", label: "Pricing" },
];

const QUESTION_LINKS = [
  {
    href: "/theory",
    label: "Theory",
    icon: BookOpen,
    activeColor: C.accent,
  },
  { href: "/output-quiz", label: "Output", icon: Code2, activeColor: C.amber },
  { href: "/debug-lab", label: "Debug", icon: Bug, activeColor: C.red },
  {
    href: "/polyfill-lab",
    label: "Polyfill",
    icon: Code,
    activeColor: C.green,
  },
];

const AI_LINKS = [
  {
    href: "/mock-interview",
    label: "Mock Interview",
    icon: Mic,
    desc: "AI interviewer",
  },
  {
    href: "/study-plan",
    label: "Study Plan",
    icon: Map,
    desc: "Personalized roadmap",
  },
  {
    href: "/cheatsheet",
    label: "Cheat Sheet",
    icon: FileDown,
    desc: "Printable PDF",
  },
];

const LEARN_LINKS = (track: string) => [
  {
    href: `/topics/${track}`,
    label: "Interview Topics",
    icon: Layers,
    desc: "36 concept pages",
  },
  ...(track === "javascript"
    ? [
        {
          href: "/javascript-output-questions",
          label: "Output Questions",
          icon: Code2,
          desc: "Predict the console.log",
        },
      ]
    : []),
  ...(track === "javascript"
    ? [
        {
          href: "/javascript-tricky-questions",
          label: "Tricky Questions",
          icon: Zap,
          desc: "[] == false explained",
        },
      ]
    : []),
  {
    href: `/blog/${track}`,
    label: "Blog",
    icon: Newspaper,
    desc: "Deep dives & guides",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, progress, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { track } = useTrack();
  const path = usePathname();

  // Desktop dropdowns
  const [open, setOpen] = useState<"ai" | "learn" | "user" | null>(null);
  // Mobile side sheet
  const [mobileOpen, setMobileOpen] = useState(false);

  const aiRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (
        !aiRef.current?.contains(t) &&
        !learnRef.current?.contains(t) &&
        !userRef.current?.contains(t)
      )
        setOpen(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [path]);

  const toggle = (menu: typeof open) =>
    setOpen((prev) => (prev === menu ? null : menu));

  const isAiActive = AI_LINKS.some((l) => path === l.href);
  const isLearnActive = LEARN_LINKS(track).some((l) => path.startsWith(l.href));

  const learnColor = isDark ? "#22a08a" : C.green;
  const aiColor = isDark ? "#4ea1f3" : C.accentText;

  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "Account";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <nav css={S.nav}>
        {/* S.navInner = flex + space-between. We place three groups inside:
            left (logo+learn), center (S.desktopLinks, hidden on mobile),
            right (PRO+theme+hamburger/avatar) */}
        <div css={S.navInner}>
          {/* ── LEFT: Logo + Learn ── */}
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 0.25rem;
              flex-shrink: 0;
            `}
          >
            <Link href="/" css={S.logoLink}>
              <div css={S.logoBadge}>JS</div>
              <span css={S.logoText}>
                Prep<span css={S.logoAccent}>Pro</span>
              </span>
            </Link>

            <TrackSwitcher />

            {/* Learn ▾ — always visible */}
            <div css={S.learnDropdownWrapper} ref={learnRef}>
              <button
                css={[
                  S.learnDropdownTrigger,
                  isLearnActive && S.learnNavLinkActive,
                ]}
                onClick={() => toggle("learn")}
              >
                <Layers size={13} /> Learn
                <ChevronDown size={11} css={S.chevron(open === "learn")} />
              </button>
              {open === "learn" && (
                <div css={S.learnDropdownMenu}>
                  {LEARN_LINKS(track).map(
                    ({ href, label, icon: Icon, desc }) => (
                      <Link
                        key={href}
                        href={href}
                        css={[
                          S.learnDropdownItem,
                          path.startsWith(href) && S.learnDropdownItemActive,
                        ]}
                        onClick={() => setOpen(null)}
                      >
                        <div css={S.learnIconBadge}>
                          <Icon size={13} color={learnColor} />
                        </div>
                        <div>
                          <span css={S.learnDropdownLabel}>{label}</span>
                          <span css={S.learnDropdownDesc}>{desc}</span>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Marketing links — logged-out visitors, desktop only */}
            {!user && (
              <div css={S.marketingLinks}>
                {MARKETING_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} css={S.marketingLink}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── CENTER: Home | modes | Sprint | AI — desktop only (hidden on mobile via S.desktopLinks) ── */}
          {user && (
            <div
              css={[
                S.desktopLinks,
                css`
                  gap: 0.125rem;
                `,
              ]}
            >
              {/* Home */}
              <Link
                href="/dashboard"
                css={[S.navLink, path === "/dashboard" && S.navLinkActive]}
              >
                <LayoutDashboard size={13} /> Home
              </Link>

              <span css={sep} />

              {/* Theory · Output · Debug · Polyfill */}
              {QUESTION_LINKS.map(
                ({ href, label, icon: Icon, activeColor }) => {
                  const isActive = path.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      css={[S.navLink, isActive && S.navLinkActive]}
                      style={isActive ? { color: activeColor } : undefined}
                    >
                      <Icon
                        size={13}
                        color={isActive ? activeColor : undefined}
                      />
                      {label}
                    </Link>
                  );
                },
              )}

              <span css={sep} />

              {/* Sprint */}
              <Link
                href="/sprint"
                css={[
                  S.navLink,
                  path === "/sprint" && S.navLinkActive,
                  S.navLinkHighlight,
                ]}
              >
                <Zap size={13} /> Sprint
              </Link>

              <span css={sep} />

              {/* AI ▾ */}
              <div css={S.aiDropdownWrapper} ref={aiRef}>
                <button
                  css={[S.aiDropdownTrigger, isAiActive && S.navLinkAiActive]}
                  onClick={() => toggle("ai")}
                >
                  <Zap size={13} /> AI
                  {!progress?.isPro && <span css={S.proBadge}>PRO</span>}
                  <ChevronDown size={11} css={S.chevron(open === "ai")} />
                </button>
                {open === "ai" && (
                  <div css={S.aiDropdownMenu}>
                    {AI_LINKS.map(({ href, label, icon: Icon, desc }) => (
                      <Link
                        key={href}
                        href={href}
                        css={[
                          S.aiDropdownItem,
                          path === href && S.aiDropdownItemActive,
                        ]}
                        onClick={() => setOpen(null)}
                      >
                        <div css={S.aiIconBadge}>
                          <Icon size={13} color={aiColor} />
                        </div>
                        <div>
                          <div css={S.aiDropdownLabel}>{label}</div>
                          <div css={S.aiDropdownDesc}>{desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── RIGHT: PRO · theme · hamburger (mobile) · avatar (desktop) ── */}
          <div css={S.rightSide}>
            {/* PRO badge — desktop only, persistent */}
            {user && progress?.isPro && (
              <span
                css={[
                  proBadgeRight,
                  css`
                    @media (max-width: 767px) {
                      display: none;
                    }
                  `,
                ]}
              >
                <Zap size={9} /> PRO
              </span>
            )}

            {/* Theme toggle */}
            <button
              css={themeBtn(isDark)}
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {user ? (
              <>
                {/* ── Hamburger — mobile only ── */}
                <button
                  css={S.hamburgerBtn}
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* ── Avatar dropdown — desktop only ── */}
                <div
                  ref={userRef}
                  css={css`
                    position: relative;
                    @media (max-width: 767px) {
                      display: none;
                    }
                  `}
                >
                  <button
                    css={avatarBtnStyle}
                    onClick={() => toggle("user")}
                    aria-label="Account"
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt=""
                        width={28}
                        height={28}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <span
                        css={css`
                          font-size: 0.6875rem;
                          font-weight: 700;
                          color: ${C.muted};
                        `}
                      >
                        {initials}
                      </span>
                    )}
                  </button>

                  {open === "user" && (
                    <div css={panel}>
                      <div css={pHeader}>
                        <div css={pName}>{displayName}</div>
                        {user.email && <div css={pEmail}>{user.email}</div>}
                        {(progress?.streakDays ?? 0) > 0 && (
                          <span
                            css={[
                              streakChip,
                              css`
                                margin-top: 7px;
                                display: inline-flex;
                              `,
                            ]}
                          >
                            🔥 {progress!.streakDays}d streak
                          </span>
                        )}
                      </div>
                      <Link
                        href="/analytics"
                        css={pItem}
                        onClick={() => setOpen(null)}
                      >
                        📊 Analytics
                        {!progress?.isPro && (
                          <span css={S.proBadge} style={{ marginLeft: "auto" }}>
                            PRO
                          </span>
                        )}
                      </Link>
                      <hr css={pDivider} />
                      <button
                        css={pItem}
                        onClick={() => {
                          toggleTheme();
                          setOpen(null);
                        }}
                      >
                        {isDark ? (
                          <Sun size={14} color={C.muted} />
                        ) : (
                          <Moon size={14} color={C.muted} />
                        )}
                        {isDark ? "Light mode" : "Dark mode"}
                      </button>
                      <hr css={pDivider} />
                      <button
                        css={[
                          pItem,
                          css`
                            color: ${C.red};
                          `,
                        ]}
                        onClick={() => {
                          logout();
                          setOpen(null);
                        }}
                      >
                        <LogOut size={14} color={C.red} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div css={S.authCtas}>
                <Link href="/auth" css={S.signInBtn}>
                  Log in
                </Link>
                <Link href="/auth" css={S.getStartedBtn}>
                  Get started <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile menu (slide-down sheet) ── */}
      {user && mobileOpen && (
        <div css={S.mobileMenu}>
          <div css={S.mobileMenuInner}>
            {/* User header */}
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 0.875rem 0.875rem;
                border-bottom: 1px solid ${C.border};
                margin-bottom: 0.25rem;
              `}
            >
              <div
                css={css`
                  width: 2.25rem;
                  height: 2.25rem;
                  border-radius: 9999px;
                  border: 1px solid ${C.border};
                  background: ${C.bgSubtle};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  flex-shrink: 0;
                `}
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt=""
                    width={36}
                    height={36}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <span
                    css={css`
                      font-size: 0.75rem;
                      font-weight: 700;
                      color: ${C.muted};
                    `}
                  >
                    {initials}
                  </span>
                )}
              </div>
              <div>
                <div
                  css={css`
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: ${C.text};
                  `}
                >
                  {displayName}
                </div>
                <div
                  css={css`
                    display: flex;
                    gap: 5px;
                    margin-top: 3px;
                  `}
                >
                  {progress?.isPro && (
                    <span
                      css={css`
                        display: inline-flex;
                        align-items: center;
                        gap: 3px;
                        padding: 2px 7px;
                        border-radius: 9999px;
                        font-size: 0.625rem;
                        font-weight: 600;
                        color: ${C.accentText};
                        background: ${C.accentSubtle};
                        border: 1px solid ${C.border};
                      `}
                    >
                      <Zap size={9} /> PRO
                    </span>
                  )}
                  {(progress?.streakDays ?? 0) > 0 && (
                    <span css={streakChip}>🔥 {progress!.streakDays}d</span>
                  )}
                </div>
              </div>
            </div>

            {/* Main nav */}
            <Link
              href="/dashboard"
              css={[
                S.mobileNavLink,
                path === "/dashboard" && S.mobileNavLinkActive,
              ]}
            >
              <LayoutDashboard size={16} /> Home
            </Link>

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>Practice</p>

            {QUESTION_LINKS.map(({ href, label, icon: Icon, activeColor }) => {
              const isActive = path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  css={[S.mobileNavLink, isActive && S.mobileNavLinkActive]}
                  style={isActive ? { color: activeColor } : undefined}
                >
                  <Icon size={16} color={isActive ? activeColor : undefined} />{" "}
                  {label}
                </Link>
              );
            })}

            <Link
              href="/sprint"
              css={[
                S.mobileNavLink,
                path === "/sprint" && S.mobileNavLinkActive,
              ]}
              style={{ color: path === "/sprint" ? C.amber : undefined }}
            >
              <Zap size={16} color={path === "/sprint" ? C.amber : undefined} />{" "}
              Sprint ✨
            </Link>

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>Learn</p>

            {LEARN_LINKS(track).map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                css={[
                  S.mobileNavLink,
                  path.startsWith(href) && S.learnNavLinkActive,
                ]}
              >
                <div css={S.mobileAiItemIcon}>
                  <Icon size={14} color={learnColor} />
                </div>
                <div css={S.mobileNavItemContent}>
                  <span>{label}</span>
                  <span css={S.mobileNavItemDesc}>{desc}</span>
                </div>
              </Link>
            ))}

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>AI Tools</p>

            {AI_LINKS.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                css={[
                  S.mobileNavLink,
                  path === href && S.mobileNavLinkAiActive,
                ]}
              >
                <div css={S.mobileAiItemIcon}>
                  <Icon size={14} color={aiColor} />
                </div>
                <div css={S.mobileNavItemContent}>
                  <span>{label}</span>
                  <span css={S.mobileNavItemDesc}>{desc}</span>
                </div>
                {!progress?.isPro && <span css={S.mobileProBadge}>PRO</span>}
              </Link>
            ))}

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>Account</p>

            <Link href="/analytics" css={S.mobileNavLink}>
              📊 Analytics
              {!progress?.isPro && <span css={S.mobileProBadge}>PRO</span>}
            </Link>

            <hr css={S.mobileDivider} />

            <button
              css={S.mobileNavLink}
              style={{ width: "100%", border: "none", cursor: "pointer" }}
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? "Light mode" : "Dark mode"}
            </button>

            <hr css={S.mobileDivider} />

            <button
              css={S.mobileLogoutBtn}
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

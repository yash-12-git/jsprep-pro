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
  BarChart2,
  LogOut,
  Mic,
  Map,
  FileDown,
  ChevronDown,
  Code2,
  Bug,
  Menu,
  X,
  Newspaper,
  Layers,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import * as S from "./styles";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Theme toggle button ──────────────────────────────────────────────────────
// Defined outside Navbar so Emotion doesn't recreate the css`` on every render.
const themeToggleBtn = (isDark: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e9e9e7"};
  background: ${isDark ? "rgba(255,255,255,0.05)" : "transparent"};
  color: ${isDark ? "rgba(255,255,255,0.55)" : "#787774"};
  cursor: pointer;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;
  flex-shrink: 0;
  &:hover {
    background: ${isDark ? "rgba(255,255,255,0.1)" : "#f1f1ef"};
    border-color: ${isDark ? "rgba(255,255,255,0.2)" : "#d3d3cf"};
    color: ${isDark ? "#ffffff" : "#37352f"};
  }
`;

// Marketing nav links for logged-out visitors
const MARKETING_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#practice", label: "Practice" },
  { href: "/topics", label: "Topics" },
  { href: "/blog", label: "Blog" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Navbar() {
  const { user, progress, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const path = usePathname();

  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [learnMenuOpen, setLearnMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setAiMenuOpen(false);
      if (learnRef.current && !learnRef.current.contains(e.target as Node))
        setLearnMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const mainLinks = [
    { href: "/dashboard", label: "Questions", icon: BookOpen },
    { href: "/sprint", label: "Sprint", icon: Zap, highlight: true },
    { href: "/output-quiz", label: "Output", icon: Code2 },
    { href: "/debug-lab", label: "Debug", icon: Bug },
    { href: "/analytics", label: "Analytics", icon: BarChart2, pro: true },
  ];

  const aiLinks = [
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
      desc: "Weak spot detection",
    },
    {
      href: "/cheatsheet",
      label: "Cheat Sheet",
      icon: FileDown,
      desc: "Printable PDF",
    },
  ];

  const learnLinks = [
    {
      href: "/topics",
      label: "Interview Topics",
      icon: Layers,
      desc: "36 concept pages",
    },
    {
      href: "/javascript-output-questions",
      label: "Output Questions",
      icon: Code2,
      desc: "Predict the console.log",
    },
    {
      href: "/javascript-tricky-questions",
      label: "Tricky Questions",
      icon: Zap,
      desc: "[] == false explained",
    },
    {
      href: "/blog",
      label: "Blog",
      icon: Newspaper,
      desc: "Deep dives & guides",
    },
  ];

  const isLearnActive = learnLinks.some((l) => path.startsWith(l.href));
  const isAiActive = aiLinks.some((l) => path === l.href);

  // Icon colours that look right on both themes
  const learnIconColor = isDark ? "#22a08a" : "#0f7b6c";
  const aiIconColor = isDark ? "#4ea1f3" : "#1a6fc4";

  return (
    <>
      <nav css={S.nav}>
        <div css={S.navInner}>
          {/* Logo */}
          <Link href="/" css={S.logoLink}>
            <div css={S.logoBadge}>JS</div>
            <span css={S.logoText}>
              Prep<span css={S.logoAccent}>Pro</span>
            </span>
          </Link>

          {/* Learn dropdown — always visible */}
          <div css={S.learnDropdownWrapper} ref={learnRef}>
            <button
              css={[
                S.learnDropdownTrigger,
                isLearnActive && S.learnNavLinkActive,
              ]}
              onClick={() => setLearnMenuOpen((v) => !v)}
            >
              <Layers size={13} />
              Learn
              <ChevronDown size={11} css={S.chevron(learnMenuOpen)} />
            </button>

            {learnMenuOpen && (
              <div css={S.learnDropdownMenu}>
                {learnLinks.map(({ href, label, icon: Icon, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    css={[
                      S.learnDropdownItem,
                      path.startsWith(href) && S.learnDropdownItemActive,
                    ]}
                    onClick={() => setLearnMenuOpen(false)}
                  >
                    <div css={S.learnIconBadge}>
                      <Icon size={13} color={learnIconColor} />
                    </div>
                    <div>
                      <div css={S.learnDropdownLabel}>{label}</div>
                      <div css={S.learnDropdownDesc}>{desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Auth main links */}
          {user && (
            <div css={S.desktopLinks}>
              {mainLinks.map(
                ({
                  href,
                  label,
                  icon: Icon,
                  pro,
                  highlight,
                }: {
                  href: string;
                  label: string;
                  icon: any;
                  pro?: boolean;
                  highlight?: boolean;
                }) => (
                  <Link
                    key={href}
                    href={href}
                    css={[
                      S.navLink,
                      path === href && S.navLinkActive,
                      highlight && S.navLinkHighlight,
                    ]}
                  >
                    <Icon size={13} />
                    {label}
                    {pro && !progress?.isPro && (
                      <span css={S.proBadge}>PRO</span>
                    )}
                    {highlight && <span css={S.newBadge}>✨</span>}
                  </Link>
                ),
              )}

              {/* AI Tools dropdown */}
              <div css={S.aiDropdownWrapper} ref={menuRef}>
                <button
                  css={[S.aiDropdownTrigger, isAiActive && S.navLinkAiActive]}
                  onClick={() => setAiMenuOpen((v) => !v)}
                >
                  <Zap size={13} />
                  AI Tools
                  {!progress?.isPro && <span css={S.proBadge}>PRO</span>}
                  <ChevronDown size={11} css={S.chevron(aiMenuOpen)} />
                </button>

                {aiMenuOpen && (
                  <div css={S.aiDropdownMenu}>
                    {aiLinks.map(({ href, label, icon: Icon, desc }) => (
                      <Link
                        key={href}
                        href={href}
                        css={[
                          S.aiDropdownItem,
                          path === href && S.aiDropdownItemActive,
                        ]}
                        onClick={() => setAiMenuOpen(false)}
                      >
                        <div css={S.aiIconBadge}>
                          <Icon size={13} color={aiIconColor} />
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

          {/* Marketing links — logged-out only */}
          {!user && (
            <div css={S.marketingLinks}>
              {MARKETING_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} css={S.marketingLink}>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div css={S.rightSide}>
            {/* ── Theme toggle ──────────────────────────────────────────────── */}
            <button
              css={themeToggleBtn(isDark)}
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {user ? (
              <>
                {progress?.isPro && (
                  <div css={S.proPill}>
                    <Zap size={11} />
                    <span css={S.proPillText}>PRO</span>
                  </div>
                )}
                {progress && (
                  <div css={S.streakPill}>
                    <span>🔥</span>
                    <span css={S.streakText}>{progress.streakDays}d</span>
                  </div>
                )}
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt=""
                    width={28}
                    height={28}
                    css={S.avatar}
                  />
                )}
                <button
                  css={S.hamburgerBtn}
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                <button css={S.logoutBtn} onClick={logout} title="Sign out">
                  <LogOut size={15} />
                </button>
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

      {/* Mobile menu */}
      {user && mobileOpen && (
        <div css={S.mobileMenu}>
          <div css={S.mobileMenuInner}>
            {mainLinks.map(
              ({
                href,
                label,
                icon: Icon,
                pro,
                highlight,
              }: {
                href: string;
                label: string;
                icon: any;
                pro?: boolean;
                highlight?: boolean;
              }) => (
                <Link
                  key={href}
                  href={href}
                  css={[
                    S.mobileNavLink,
                    path === href && S.mobileNavLinkActive,
                  ]}
                >
                  <Icon size={16} />
                  {label}
                  {pro && !progress?.isPro && (
                    <span css={S.mobileProBadge}>PRO</span>
                  )}
                  {highlight && <span css={S.mobileProBadge}>NEW</span>}
                </Link>
              ),
            )}

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>Learn</p>
            {learnLinks.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                css={[
                  S.mobileNavLink,
                  path.startsWith(href) && S.learnNavLinkActive,
                ]}
              >
                <div css={S.mobileAiItemIcon}>
                  <Icon size={14} color={learnIconColor} />
                </div>
                <div css={S.mobileNavItemContent}>
                  <span>{label}</span>
                  <span css={S.mobileNavItemDesc}>{desc}</span>
                </div>
              </Link>
            ))}

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>AI Tools</p>
            {aiLinks.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                css={[
                  S.mobileNavLink,
                  path === href && S.mobileNavLinkAiActive,
                ]}
              >
                <div css={S.mobileAiItemIcon}>
                  <Icon size={14} color={aiIconColor} />
                </div>
                <div css={S.mobileNavItemContent}>
                  <span>{label}</span>
                  <span css={S.mobileNavItemDesc}>{desc}</span>
                </div>
                {!progress?.isPro && <span css={S.mobileProBadge}>PRO</span>}
              </Link>
            ))}

            <hr css={S.mobileDivider} />

            {/* Mobile theme toggle row */}
            <button
              css={[
                S.mobileNavLink,
                css`
                  justify-content: flex-start;
                  gap: 0.75rem;
                `,
              ]}
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              style={{ width: "100%", border: "none", cursor: "pointer" }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
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

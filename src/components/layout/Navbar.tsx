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
  Sparkles,
  FlaskConical,
  BookMarked,
  BarChart2,
  User,
  Route,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import * as S from "./styles";
import { useTheme } from "@/contexts/ThemeContext";
import { C, RADIUS } from "@/styles/tokens";
import TrackSwitcher from "../ui/TrackSwitcher";
import { useTrack } from "@/contexts/TrackContext";

// ─── Navigation Data ───────────────────────────────────────────────────────────

const PRACTICE_LINKS = [
  {
    href: "/theory",
    label: "Concepts",
    icon: BookOpen,
    desc: "Core JS theory",
    color: C.accent,
  },
  {
    href: "/output-quiz",
    label: "Output",
    icon: Code2,
    desc: "Predict the output",
    color: C.amber,
  },
  {
    href: "/debug-lab",
    label: "Debugging",
    icon: Bug,
    desc: "Find & fix bugs",
    color: C.red,
  },
  {
    href: "/polyfill-lab",
    label: "Polyfills",
    icon: Code,
    desc: "Build from scratch",
    color: C.green,
  },
];

const AI_LINKS = [
  {
    href: "/mock-interview",
    label: "Mock Interview",
    icon: Mic,
    desc: "Real interview simulation",
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
  {
    href: `/${track}-interview-questions`,
    label: `${track.charAt(0).toUpperCase() + track.slice(1)} Interview Questions`,
    icon: Code2,
    desc: "Predict the console.log",
  },
  ...(track === "javascript"
    ? [
        {
          href: "/javascript-tricky-questions",
          label: "Tricky Questions",
          icon: Zap,
          desc: "Deep-dive edge cases",
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

  const [open, setOpen] = useState<"learn" | "practice" | "ai" | "user" | null>(
    null,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const learnRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (
        !learnRef.current?.contains(t) &&
        !practiceRef.current?.contains(t) &&
        !aiRef.current?.contains(t) &&
        !userRef.current?.contains(t)
      )
        setOpen(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [path]);

  const toggle = (menu: typeof open) =>
    setOpen((prev) => (prev === menu ? null : menu));

  const isLearnActive = LEARN_LINKS(track).some((l) => path.startsWith(l.href));
  const isPracticeActive = PRACTICE_LINKS.some((l) => path.startsWith(l.href));
  const isAiActive = AI_LINKS.some((l) => path === l.href);

  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "Account";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav css={S.nav}>
        <div css={S.navInner}>
          {/* LEFT: Logo + Track */}
          <div css={S.leftGroup}>
            <Link href="/" css={S.logoLink}>
              <div css={S.logoBadge}>JS</div>
              <span css={S.logoText}>
                Prep<span css={S.logoAccent}>Pro</span>
              </span>
            </Link>
            <TrackSwitcher />
          </div>

          {/* CENTER: Primary navigation — desktop only */}
          {user ? (
            <div css={S.desktopLinks}>
              {/* Home */}
              <Link
                href="/dashboard"
                css={[S.navLink, path === "/dashboard" && S.navLinkActive]}
              >
                <LayoutDashboard size={13} /> Home
              </Link>

              <span css={S.sep} />

              {/* Learn ▾ */}
              <div css={S.dropdownWrapper} ref={learnRef}>
                <button
                  css={[S.navLinkBtn, isLearnActive && S.navLinkActive]}
                  onClick={() => toggle("learn")}
                >
                  <BookMarked size={13} /> Learn
                  <ChevronDown size={11} css={S.chevron(open === "learn")} />
                </button>
                {open === "learn" && (
                  <div css={S.dropdownMenu}>
                    <p css={S.dropdownSectionLabel}>Resources</p>
                    {LEARN_LINKS(track).map(
                      ({ href, label, icon: Icon, desc }) => (
                        <Link
                          key={href}
                          href={href}
                          css={[
                            S.dropdownItem,
                            path.startsWith(href) && S.dropdownItemActive,
                          ]}
                          onClick={() => setOpen(null)}
                        >
                          <div css={S.dropdownIconBadge(C.green)}>
                            <Icon size={13} color={C.green} />
                          </div>
                          <div>
                            <span css={S.dropdownLabel}>{label}</span>
                            <span css={S.dropdownDesc}>{desc}</span>
                          </div>
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Practice ▾ */}
              <div css={S.dropdownWrapper} ref={practiceRef}>
                <button
                  css={[S.navLinkBtn, isPracticeActive && S.navLinkActive]}
                  onClick={() => toggle("practice")}
                >
                  <FlaskConical size={13} /> Practice
                  <ChevronDown size={11} css={S.chevron(open === "practice")} />
                </button>
                {open === "practice" && (
                  <div css={S.dropdownMenu}>
                    <p css={S.dropdownSectionLabel}>Question Types</p>
                    {PRACTICE_LINKS.map(
                      ({ href, label, icon: Icon, desc, color }) => {
                        const isActive = path.startsWith(href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            css={[
                              S.dropdownItem,
                              isActive && S.dropdownItemActive,
                            ]}
                            onClick={() => setOpen(null)}
                          >
                            <div css={S.dropdownIconBadge(color)}>
                              <Icon size={13} color={color} />
                            </div>
                            <div>
                              <span css={S.dropdownLabel}>{label}</span>
                              <span css={S.dropdownDesc}>{desc}</span>
                            </div>
                          </Link>
                        );
                      },
                    )}
                  </div>
                )}
              </div>

              {/* Roadmap — promoted top-level */}
              <Link
                href="/roadmap"
                css={[S.navLink, path === "/roadmap" && S.navLinkActive]}
              >
                <Route size={13} /> Roadmap
              </Link>

              <span css={S.sep} />

              {/* ✨ AI Coach — highlighted CTA */}
              <div css={S.dropdownWrapper} ref={aiRef}>
                <button
                  css={[S.aiCoachBtn, isAiActive && S.aiCoachBtnActive]}
                  onClick={() => toggle("ai")}
                >
                  <Sparkles size={12} />
                  AI Coach
                  {!progress?.isPro && <span css={S.proBadge}>PRO</span>}
                  <ChevronDown size={10} css={S.chevron(open === "ai")} />
                </button>
                {open === "ai" && (
                  <div css={S.aiDropdownMenu}>
                    <p css={S.dropdownSectionLabel}>AI-Powered Tools</p>
                    {AI_LINKS.map(({ href, label, icon: Icon, desc }) => (
                      <Link
                        key={href}
                        href={href}
                        css={[
                          S.dropdownItem,
                          path === href && S.dropdownItemActive,
                        ]}
                        onClick={() => setOpen(null)}
                      >
                        <div css={S.dropdownIconBadge(C.accent)}>
                          <Icon size={13} color={C.accentText} />
                        </div>
                        <div>
                          <div css={S.dropdownLabel}>{label}</div>
                          <div css={S.dropdownDesc}>{desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ⚡ Sprint — end CTA */}
              <Link
                href="/sprint"
                css={[
                  S.navLink,
                  S.sprintLink,
                  path === "/sprint" && S.sprintLinkActive,
                ]}
              >
                <Zap size={13} /> Sprint
              </Link>
            </div>
          ) : (
            /* Marketing links — logged-out visitors */
            <div css={S.marketingLinks}>
              {[
                { href: "/#features", label: "Features" },
                { href: "/#practice", label: "Practice" },
                { href: "/topics", label: "Topics" },
                {href: "/#roadmap", label: "Roadmap" },
                { href: "/blog", label: "Blog" },
                { href: "/#pricing", label: "Pricing" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} css={S.marketingLink}>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* RIGHT: PRO · Theme · Hamburger / Avatar */}
          <div css={S.rightSide}>
            {user && progress?.isPro && (
              <span css={S.proPill}>
                <Zap size={9} /> PRO
              </span>
            )}

            <button
              css={S.themeBtn(isDark)}
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {user ? (
              <>
                {/* Hamburger — mobile only */}
                <button
                  css={S.hamburgerBtn}
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* Avatar dropdown — desktop only */}
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
                    css={S.avatarBtn}
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
                      <span css={S.avatarInitials}>{initials}</span>
                    )}
                  </button>

                  {open === "user" && (
                    <div css={S.accountPanel}>
                      <div css={S.accountPanelHeader}>
                        <div css={S.accountName}>{displayName}</div>
                        {user.email && (
                          <div css={S.accountEmail}>{user.email}</div>
                        )}
                        {(progress?.streakDays ?? 0) > 0 && (
                          <span css={S.streakChip}>
                            🔥 {progress!.streakDays}d streak
                          </span>
                        )}
                      </div>
                      <Link
                        href="/dashboard"
                        css={S.panelItem}
                        onClick={() => setOpen(null)}
                      >
                        <LayoutDashboard size={14} color={C.muted} /> Dashboard
                      </Link>
                      <Link
                        href="/analytics"
                        css={S.panelItem}
                        onClick={() => setOpen(null)}
                      >
                        <BarChart2 size={14} color={C.muted} /> Analytics
                        {!progress?.isPro && (
                          <span css={S.proBadge} style={{ marginLeft: "auto" }}>
                            PRO
                          </span>
                        )}
                      </Link>
                      <hr css={S.panelDivider} />
                      <button
                        css={S.panelItem}
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
                      <hr css={S.panelDivider} />
                      <button
                        css={[
                          S.panelItem,
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

      {/* ── Mobile Slide-down Sheet ── */}
      {user && mobileOpen && (
        <div css={S.mobileSheet}>
          <div css={S.mobileSheetInner}>
            {/* User header */}
            <div css={S.mobileUserHeader}>
              <div css={S.mobileAvatar}>
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
                  <span css={S.mobileAvatarInitials}>{initials}</span>
                )}
              </div>
              <div>
                <div css={S.mobileUserName}>{displayName}</div>
                <div css={S.mobileUserBadges}>
                  {progress?.isPro && (
                    <span css={S.proPill}>
                      <Zap size={9} /> PRO
                    </span>
                  )}
                  {(progress?.streakDays ?? 0) > 0 && (
                    <span css={S.streakChip}>🔥 {progress!.streakDays}d</span>
                  )}
                </div>
              </div>
            </div>

            {/* Learn section */}
            <p css={S.mobileSectionLabel}>Learn</p>
            {LEARN_LINKS(track).map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                css={[
                  S.mobileNavLink,
                  path.startsWith(href) && S.mobileNavLinkLearnActive,
                ]}
              >
                <div css={S.mobileIconBadge(C.green)}>
                  <Icon size={14} color={C.green} />
                </div>
                <div css={S.mobileItemContent}>
                  <span>{label}</span>
                  <span css={S.mobileItemDesc}>{desc}</span>
                </div>
              </Link>
            ))}

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>Practice</p>

            {PRACTICE_LINKS.map(({ href, label, icon: Icon, desc, color }) => {
              const isActive = path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  css={[S.mobileNavLink, isActive && S.mobileNavLinkActive]}
                  style={isActive ? { color } : undefined}
                >
                  <div css={S.mobileIconBadge(color)}>
                    <Icon size={14} color={color} />
                  </div>
                  <div css={S.mobileItemContent}>
                    <span>{label}</span>
                    <span css={S.mobileItemDesc}>{desc}</span>
                  </div>
                </Link>
              );
            })}

            <Link
              href="/sprint"
              css={[
                S.mobileNavLink,
                S.mobileSprintLink,
                path === "/sprint" && S.mobileSprintActive,
              ]}
            >
              <div css={S.mobileIconBadge(C.amber)}>
                <Zap size={14} color={C.amber} />
              </div>
              <div css={S.mobileItemContent}>
                <span>Sprint Mode</span>
                <span css={S.mobileItemDesc}>Timed challenge</span>
              </div>
            </Link>

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
                <div css={S.mobileIconBadge(C.accent)}>
                  <Icon size={14} color={C.accentText} />
                </div>
                <div css={S.mobileItemContent}>
                  <span>{label}</span>
                  <span css={S.mobileItemDesc}>{desc}</span>
                </div>
                {!progress?.isPro && <span css={S.mobileProBadge}>PRO</span>}
              </Link>
            ))}

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>Account</p>

            <Link href="/analytics" css={S.mobileNavLink}>
              <BarChart2 size={16} color={C.muted} /> Analytics
              {!progress?.isPro && <span css={S.mobileProBadge}>PRO</span>}
            </Link>

            <button
              css={S.mobileNavLink}
              style={{
                width: "100%",
                border: "none",
                cursor: "pointer",
                background: "transparent",
              }}
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
            >
              {isDark ? (
                <Sun size={16} color={C.muted} />
              ) : (
                <Moon size={16} color={C.muted} />
              )}
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

      {/* ── Mobile Bottom Tab Bar ── */}
      {user && (
        <div css={S.mobileBottomNav}>
          {/* Home */}
          {(() => {
            const isActive = path === "/dashboard";
            return (
              <Link
                href="/dashboard"
                css={[S.mobileTabItem, isActive && S.mobileTabItemActive]}
              >
                <LayoutDashboard size={20} />
                <span css={S.mobileTabLabel}>Home</span>
              </Link>
            );
          })()}

          {/* Practice — matches any practice page */}
          {(() => {
            const isActive = PRACTICE_LINKS.some((l) =>
              path.startsWith(l.href),
            );
            return (
              <Link
                href="/theory"
                css={[S.mobileTabItem, isActive && S.mobileTabItemActive]}
              >
                <FlaskConical size={20} />
                <span css={S.mobileTabLabel}>Practice</span>
              </Link>
            );
          })()}

          {/* Roadmap */}
          {(() => {
            const isActive = path === "/roadmap";
            return (
              <Link
                href="/roadmap"
                css={[S.mobileTabItem, isActive && S.mobileTabItemActive]}
              >
                <Route size={20} />
                <span css={S.mobileTabLabel}>Roadmap</span>
              </Link>
            );
          })()}

          {/* AI Coach */}
          {(() => {
            const isActive = AI_LINKS.some((l) => path === l.href);
            return (
              <Link
                href="/study-plan"
                css={[
                  S.mobileTabItem,
                  S.mobileTabAi,
                  isActive && S.mobileTabAiActive,
                ]}
              >
                <Sparkles size={20} />
                <span css={S.mobileTabLabel}>AI</span>
              </Link>
            );
          })()}

          {/* Profile */}
          {(() => {
            const isActive = path === "/analytics";
            return (
              <Link
                href="/analytics"
                css={[S.mobileTabItem, isActive && S.mobileTabItemActive]}
              >
                <User size={20} />
                <span css={S.mobileTabLabel}>Profile</span>
              </Link>
            );
          })()}
        </div>
      )}
    </>
  );
}

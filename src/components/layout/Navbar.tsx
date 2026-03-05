/** @jsxImportSource @emotion/react */
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  Zap, BookOpen, BarChart2, Brain, LogOut, Mic, Map,
  FileDown, ChevronDown, Code2, Bug, Menu, X
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as S from './styles'

export default function Navbar() {
  const { user, progress, logout } = useAuth()
  const path = usePathname()
  const [aiMenuOpen, setAiMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAiMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [path])

  const mainLinks = [
    { href: '/dashboard', label: 'Questions', icon: BookOpen },
    { href: '/output-quiz', label: 'Output', icon: Code2 },
    { href: '/debug-lab', label: 'Debug', icon: Bug },
    { href: '/quiz', label: 'Quiz', icon: Brain, pro: true },
    { href: '/analytics', label: 'Analytics', icon: BarChart2, pro: true },
  ]

  const aiLinks = [
    { href: '/mock-interview', label: 'Mock Interview', icon: Mic, desc: 'AI interviewer' },
    { href: '/study-plan', label: 'Study Plan', icon: Map, desc: 'Weak spot detection' },
    { href: '/cheatsheet', label: 'Cheat Sheet', icon: FileDown, desc: 'Printable PDF' },
  ]

  const isAiActive = aiLinks.some(l => path === l.href)

  return (
    <>
      <nav css={S.nav}>
        <div css={S.navInner}>

          <Link href="/" css={S.logoLink}>
            <div css={S.logoBadge}>JS</div>
            <span css={S.logoText}>
              Prep<span css={S.logoAccent}>Pro</span>
            </span>
          </Link>

          {user && (
            <div css={S.desktopLinks}>
              {mainLinks.map(({ href, label, icon: Icon, pro }) => (
                <Link
                  key={href}
                  href={href}
                  css={[S.navLink, path === href && S.navLinkActive]}
                >
                  <Icon size={13} />
                  {label}
                  {pro && !progress?.isPro && <span css={S.proBadge}>PRO</span>}
                </Link>
              ))}

              <div css={S.aiDropdownWrapper} ref={menuRef}>
                <button
                  css={[S.aiDropdownTrigger, isAiActive && S.navLinkAiActive]}
                  onClick={() => setAiMenuOpen(v => !v)}
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
                        css={[S.aiDropdownItem, path === href && S.aiDropdownItemActive]}
                        onClick={() => setAiMenuOpen(false)}
                      >
                        <div css={S.aiIconBadge}>
                          <Icon size={13} color="#a78bfa" />
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

          <div css={S.rightSide}>
            {user ? (
              <>
                {progress?.isPro && (
                  <div css={S.proPill}>
                    <Zap size={11} color="#7c6af7" />
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
                  <Image src={user.photoURL} alt="" width={28} height={28} css={S.avatar} />
                )}
                <button css={S.hamburgerBtn} onClick={() => setMobileOpen(v => !v)}>
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                <button css={S.logoutBtn} onClick={logout} title="Sign out">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link href="/auth" css={S.signInBtn}>Sign in</Link>
            )}
          </div>

        </div>
      </nav>

      {user && mobileOpen && (
        <div css={S.mobileMenu}>
          <div css={S.mobileMenuInner}>
            {mainLinks.map(({ href, label, icon: Icon, pro }) => (
              <Link
                key={href}
                href={href}
                css={[S.mobileNavLink, path === href && S.mobileNavLinkActive]}
              >
                <Icon size={16} />
                {label}
                {pro && !progress?.isPro && <span css={S.mobileProBadge}>PRO</span>}
              </Link>
            ))}

            <hr css={S.mobileDivider} />
            <p css={S.mobileSectionLabel}>AI Tools</p>

            {aiLinks.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                css={[S.mobileNavLink, path === href && S.mobileNavLinkAiActive]}
              >
                <div css={S.mobileAiItemIcon}>
                  <Icon size={14} color="#a78bfa" />
                </div>
                <div css={S.mobileNavItemContent}>
                  <span>{label}</span>
                  <span css={S.mobileNavItemDesc}>{desc}</span>
                </div>
                {!progress?.isPro && <span css={S.mobileProBadge}>PRO</span>}
              </Link>
            ))}

            <hr css={S.mobileDivider} />

            <button css={S.mobileLogoutBtn} onClick={() => { logout(); setMobileOpen(false) }}>
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  Zap, BookOpen, BarChart2, Brain, LogOut, Mic, Map,
  FileDown, ChevronDown, Code2, Bug, Menu, X
} from 'lucide-react'
import clsx from 'clsx'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { user, progress, logout } = useAuth()
  const path = usePathname()
  const [aiMenuOpen, setAiMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setAiMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
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
    { href: '/cheat-sheet', label: 'Cheat Sheet', icon: FileDown, desc: 'Printable PDF' },
  ]

  const isAiActive = aiLinks.some(l => path === l.href)

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-base flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-xs font-black text-white">JS</div>
            <span className="hidden sm:inline font-black">Prep<span className="text-accent">Pro</span></span>
          </Link>

          {/* Desktop nav — hidden on mobile */}
          {user && (
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {mainLinks.map(({ href, label, icon: Icon, pro }) => (
                <Link key={href} href={href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                    path === href ? 'bg-accent/20 text-accent' : 'text-muted hover:text-white hover:bg-surface'
                  )}>
                  <Icon size={13} />{label}
                  {pro && !progress?.isPro && <span className="text-[8px] bg-accent2/20 text-accent2 px-1 rounded font-bold">PRO</span>}
                </Link>
              ))}

              {/* AI Tools dropdown */}
              <div className="relative" ref={menuRef}>
                <button onClick={() => setAiMenuOpen(v => !v)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    isAiActive ? 'bg-purple-500/20 text-purple-400' : 'text-muted hover:text-white hover:bg-surface'
                  )}>
                  <Zap size={13} />AI Tools
                  {!progress?.isPro && <span className="text-[8px] bg-accent2/20 text-accent2 px-1 rounded font-bold">PRO</span>}
                  <ChevronDown size={11} className={clsx('transition-transform', aiMenuOpen && 'rotate-180')} />
                </button>

                {aiMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    {aiLinks.map(({ href, label, icon: Icon, desc }) => (
                      <Link key={href} href={href} onClick={() => setAiMenuOpen(false)}
                        className={clsx('flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors', path === href && 'bg-surface')}>
                        <div className="w-7 h-7 bg-purple-500/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon size={13} className="text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{label}</div>
                          <div className="text-xs text-muted">{desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <>
                {progress?.isPro && (
                  <div className="hidden sm:flex items-center gap-1 bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full">
                    <Zap size={11} className="text-accent" />
                    <span className="text-accent text-[10px] font-bold">PRO</span>
                  </div>
                )}
                {progress && (
                  <div className="hidden sm:flex items-center gap-1 bg-surface border border-border px-2 py-0.5 rounded-full">
                    <span className="text-sm">🔥</span>
                    <span className="text-[10px] font-bold">{progress.streakDays}d</span>
                  </div>
                )}
                {user.photoURL && (
                  <Image src={user.photoURL} alt="" width={28} height={28} className="rounded-full flex-shrink-0" />
                )}
                {/* Mobile hamburger */}
                <button onClick={() => setMobileOpen(v => !v)}
                  className="md:hidden p-1.5 rounded-lg text-muted hover:text-white transition-colors">
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                {/* Desktop logout */}
                <button onClick={logout}
                  className="hidden md:flex p-1.5 rounded-lg text-muted hover:text-danger transition-colors" title="Sign out">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link href="/auth"
                className="bg-accent hover:bg-accent/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {user && mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 bg-bg/95 backdrop-blur-xl border-b border-border shadow-2xl">
          <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-1">
            {mainLinks.map(({ href, label, icon: Icon, pro }) => (
              <Link key={href} href={href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                  path === href ? 'bg-accent/20 text-accent' : 'text-muted hover:text-white hover:bg-surface'
                )}>
                <Icon size={16} className="flex-shrink-0" />
                {label}
                {pro && !progress?.isPro && <span className="text-[9px] bg-accent2/20 text-accent2 px-1.5 py-0.5 rounded font-bold ml-auto">PRO</span>}
              </Link>
            ))}

            <div className="border-t border-border my-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted px-4 mb-1">AI Tools</p>

            {aiLinks.map(({ href, label, icon: Icon, desc }) => (
              <Link key={href} href={href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                  path === href ? 'bg-purple-500/20 text-purple-400' : 'text-muted hover:text-white hover:bg-surface'
                )}>
                <div className="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-purple-400" />
                </div>
                <div>
                  <div>{label}</div>
                  <div className="text-[11px] text-muted font-normal">{desc}</div>
                </div>
                {!progress?.isPro && <span className="text-[9px] bg-accent2/20 text-accent2 px-1.5 py-0.5 rounded font-bold ml-auto">PRO</span>}
              </Link>
            ))}

            <div className="border-t border-border my-2" />
            <button onClick={() => { logout(); setMobileOpen(false) }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted hover:text-danger transition-colors">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
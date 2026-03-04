'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Zap, BookOpen, BarChart2, Brain, LogOut, Mic, Map, FileDown, ChevronDown, Bug, Code2 } from 'lucide-react'
import clsx from 'clsx'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { user, progress, logout } = useAuth()
  const path = usePathname()
  const [aiMenuOpen, setAiMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setAiMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const mainLinks = [
    { href: '/dashboard', label: 'Questions', icon: BookOpen },
    { href: '/output-quiz', label: 'Output Quiz', icon: Code2, pro: false },
    { href: '/debug-lab', label: 'Debug Lab', icon: Bug, pro: false },
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
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-syne font-bold text-lg flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-xs font-black">JS</div>
          <span className="hidden sm:inline">Prep<span className="text-accent">Pro</span></span>
        </Link>

        {user && (
          <div className="flex items-center gap-1" style={{scrollbarWidth:'none'}}>
            {mainLinks.map(({ href, label, icon: Icon, pro }) => (
              <Link key={href} href={href}
                className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0',
                  path === href ? 'bg-accent/20 text-accent' : 'text-muted hover:text-white hover:bg-surface'
                )}>
                <Icon size={14} />{label}
                {pro && !progress?.isPro && <span className="text-[9px] bg-accent2/20 text-accent2 px-1 rounded font-bold">PRO</span>}
              </Link>
            ))}

            <div className="relative flex-shrink-0" ref={menuRef}>
              <button onClick={() => setAiMenuOpen(v => !v)}
                className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
                  isAiActive ? 'bg-purple-500/20 text-purple-400' : 'text-muted hover:text-white hover:bg-surface'
                )}>
                <Zap size={14} />AI Tools
                {!progress?.isPro && <span className="text-[9px] bg-accent2/20 text-accent2 px-1 rounded font-bold">PRO</span>}
                <ChevronDown size={12} className={clsx('transition-transform', aiMenuOpen && 'rotate-180')} />
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
                        <div className="text-sm font-bold text-white">{label}</div>
                        <div className="text-xs text-muted">{desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              {progress?.isPro && (
                <div className="hidden sm:flex items-center gap-1 bg-accent/15 border border-accent/30 px-2.5 py-1 rounded-full">
                  <Zap size={12} className="text-accent" /><span className="text-accent text-xs font-bold">PRO</span>
                </div>
              )}
              {progress && (
                <div className="hidden sm:flex items-center gap-1 bg-surface border border-border px-2.5 py-1 rounded-full">
                  <span className="text-sm">🔥</span><span className="text-xs font-bold text-white">{progress.streakDays}d</span>
                </div>
              )}
              {user.photoURL && <Image src={user.photoURL} alt={user.displayName || ''} width={30} height={30} className="rounded-full" />}
              <button onClick={logout} className="p-1.5 rounded-lg text-muted hover:text-danger transition-colors" title="Sign out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link href="/auth" className="bg-accent hover:bg-accent/90 text-white text-sm font-bold px-4 py-1.5 rounded-lg transition-colors">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

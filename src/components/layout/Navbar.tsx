'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Zap, BookOpen, BarChart2, Brain, LogOut } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar() {
  const { user, progress, logout } = useAuth()
  const path = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Questions', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: Brain, pro: true },
    { href: '/analytics', label: 'Analytics', icon: BarChart2, pro: true },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-syne font-bold text-lg">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-xs font-black">JS</div>
          <span>Prep<span className="text-accent">Pro</span></span>
        </Link>

        {/* Nav links */}
        {user && (
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon, pro }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
                  path === href
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted hover:text-white hover:bg-surface'
                )}
              >
                <Icon size={14} />
                {label}
                {pro && !progress?.isPro && (
                  <span className="text-[9px] bg-accent2/20 text-accent2 px-1 rounded font-bold">PRO</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* User area */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {progress?.isPro && (
                <div className="flex items-center gap-1 bg-accent/15 border border-accent/30 px-2.5 py-1 rounded-full">
                  <Zap size={12} className="text-accent" />
                  <span className="text-accent text-xs font-bold">PRO</span>
                </div>
              )}
              {progress && (
                <div className="hidden sm:flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 rounded-full">
                  <span className="text-accent3 text-sm">🔥</span>
                  <span className="text-xs font-bold text-white">{progress.streakDays}d</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <Image src={user.photoURL} alt={user.displayName || ''} width={30} height={30} className="rounded-full" />
                )}
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-muted hover:text-danger transition-colors"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-accent hover:bg-accent/90 text-white text-sm font-bold px-4 py-1.5 rounded-lg transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

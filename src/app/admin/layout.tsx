/** @jsxImportSource @emotion/react */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { isAdmin } from '@/lib/admin'
import { css } from '@emotion/react'
import { C, RADIUS, BP } from '@/styles/tokens'
import { LayoutDashboard, PlusCircle, List, Database, LogOut, ShieldAlert, BookOpen } from 'lucide-react'
import * as Shared from '@/styles/shared'

const S = {
  shell: css`
    min-height: 100vh;
    display: flex;
  `,

  sidebar: css`
    width: 14rem;
    background: ${C.card};
    border-right: 1px solid ${C.border};
    display: flex;
    flex-direction: column;
    padding: 1.25rem 0;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 40;
    @media (max-width: ${BP.md}) { display: none; }
  `,

  logo: css`
    padding: 0 1.25rem 1.25rem;
    border-bottom: 1px solid ${C.border};
    margin-bottom: 0.75rem;
  `,

  logoText: css`
    font-size: 0.875rem;
    font-weight: 900;
    color: white;
  `,

  adminBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.5625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${C.accent2};
    background: ${C.accent2}14;
    border: 1px solid ${C.accent2}33;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    margin-top: 0.25rem;
  `,

  nav: css`flex: 1; padding: 0 0.75rem;`,

  navSection: css`
    font-size: 0.5625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.25);
    padding: 0.75rem 0.5rem 0.375rem;
  `,

  navLink: (active: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: ${RADIUS.md};
    font-size: 0.8125rem;
    font-weight: ${active ? 700 : 500};
    color: ${active ? 'white' : C.muted};
    background: ${active ? C.accent + '18' : 'transparent'};
    border: 1px solid ${active ? C.accent + '33' : 'transparent'};
    text-decoration: none;
    transition: all 0.15s ease;
    margin-bottom: 0.125rem;
    &:hover { color: white; background: rgba(255,255,255,0.05); }
  `,

  content: css`
    margin-left: 14rem;
    flex: 1;
    padding: 2rem;
    min-height: 100vh;
    @media (max-width: ${BP.md}) { margin-left: 0; padding: 1rem; }
  `,

  topBar: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${C.border};
  `,

  breadcrumb: css`
    font-size: 0.8125rem;
    color: ${C.muted};
    display: flex;
    align-items: center;
    gap: 0.375rem;
  `,

  forbiddenWrap: css`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    padding: 2rem;
  `,
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/questions', label: 'All Questions', icon: List },
  { href: '/admin/questions/new', label: 'Add Question', icon: PlusCircle },
  { href: '/admin/seed', label: 'Seed / Import', icon: Database },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [adminChecked, setAdminChecked] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/auth'); return }
    isAdmin(user.uid).then(result => {
      setIsAdminUser(result)
      setAdminChecked(true)
    })
  }, [user, loading, router])

  if (loading || !adminChecked) {
    return <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  }

  if (!isAdminUser) {
    return (
      <div css={S.forbiddenWrap}>
        <ShieldAlert size={48} color={C.danger} />
        <h1 css={{ fontSize: '1.5rem', fontWeight: 900 }}>Access Denied</h1>
        <p css={{ color: C.muted, maxWidth: '24rem' }}>
          This area is restricted to admins. Set <code css={{ color: C.accent3, background: C.surface, padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>isAdmin: true</code> on your user document in Firestore.
        </p>
        <Link href="/dashboard" css={{ color: C.accent, textDecoration: 'underline', fontSize: '0.875rem' }}>
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div css={S.shell}>
      {/* Sidebar */}
      <aside css={S.sidebar}>
        <div css={S.logo}>
          <div css={S.logoText}>JSPrep Pro</div>
          <div css={S.adminBadge}><ShieldAlert size={9} /> Admin Panel</div>
        </div>

        <nav css={S.nav}>
          <div css={S.navSection}>Content</div>
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin'
            return (
              <Link key={href} href={href} css={S.navLink(!!(active || (exact && pathname === href)))}>
                <Icon size={15} /> {label}
              </Link>
            )
          })}

          <div css={S.navSection}>Platform</div>
          <Link href="/dashboard" css={S.navLink(false)}>
            <BookOpen size={15} /> View Site
          </Link>
          <button
            onClick={logout}
            css={[S.navLink(false), { width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }]}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main css={S.content}>
        {children}
      </main>
    </div>
  )
}
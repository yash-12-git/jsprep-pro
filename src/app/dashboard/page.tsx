/** @jsxImportSource @emotion/react */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions, useCategories, useUserProgress } from '@/hooks/useQuestions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { BookOpen, Home, Layers, Trophy } from 'lucide-react'
import * as ST from './tab.styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import DashboardHeader from './components/DashboardHeader'
import QuestionList from './components/QuestionList'
import CategoryFilter, { defaultFilters, type FilterState } from './components/CategoryFilter'
import LearnSection from './components/LearnSection'
import QuestionOfTheDay from './components/QuestionOfTheDay'
import Leaderboard from './components/Leaderboard'

// ─── Constants ────────────────────────────────────────────────────────────────

type Tab = 'home' | 'practice' | 'learn' | 'community'
const FREE_MASTER_LIMIT = 5

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: 'home',      label: 'Home',      Icon: Home     },
  { id: 'practice',  label: 'Practice',  Icon: BookOpen },
  { id: 'learn',     label: 'Learn',     Icon: Layers   },
  { id: 'community', label: 'Community', Icon: Trophy   },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, progress, loading: authLoading } = useAuth()
  const router = useRouter()

  const { questions, loading: qLoading, error: qError } = useQuestions({
    type: 'theory', track: 'javascript', enabled: !!user,
  })
  const { categories } = useCategories('theory', 'javascript')
  const {
    loading: pLoading,
    masteredIds, bookmarkIds, solvedIds,
    toggleMastered, toggleBookmark,
  } = useUserProgress({ uid: user?.uid ?? null })

  const [tab,      setTab]      = useState<Tab>('home')
  const [filters,  setFilters]  = useState<FilterState>(defaultFilters())
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallReason, setPaywallReason] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth')
  }, [user, authLoading, router])

  // Reset filters when leaving practice tab so state is clean on return
  useEffect(() => {
    if (tab !== 'practice') setFilters(defaultFilters())
  }, [tab])

  // ── Derived data ──────────────────────────────────────────────────────────
  const masteredCount = masteredIds.length

  // Build Sets once — stable references prevent unnecessary QuestionCard re-renders
  const progressIds = useMemo(() => ({
    mastered:   new Set(masteredIds),
    bookmarked: new Set(bookmarkIds),
    solved:     new Set(solvedIds),
  }), [masteredIds, bookmarkIds, solvedIds])

  // Client-side filtering (questions already fetched from Firestore)
  const filtered = useMemo(() => {
    let qs = questions
    if (filters.category !== 'All')   qs = qs.filter(q => q.category  === filters.category)
    if (filters.difficulty !== 'all') qs = qs.filter(q => q.difficulty === filters.difficulty)
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase()
      qs = qs.filter(q =>
        q.title.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term) ||
        q.tags.some(t => t.toLowerCase().includes(term))
      )
    }
    return qs
  }, [questions, filters])

  // ── Paywall helper ────────────────────────────────────────────────────────
  function gatePaywall(reason: string) {
    setPaywallReason(reason)
    setShowPaywall(true)
  }

  // ── Progress handlers ─────────────────────────────────────────────────────
  async function handleMastered(questionId: string) {
    if (!progressIds.mastered.has(questionId) && !progress?.isPro && masteredCount >= FREE_MASTER_LIMIT) {
      gatePaywall(`Free plan is limited to ${FREE_MASTER_LIMIT} mastered questions. Upgrade to track all!`)
      return
    }
    await toggleMastered(questionId)
  }

  async function handleBookmark(questionId: string) {
    if (!progress?.isPro) {
      gatePaywall('Bookmarks are a Pro feature. Upgrade to save questions for quick review.')
      return
    }
    await toggleBookmark(questionId)
  }


  if (authLoading || !user || !progress) {
    return <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {showPaywall && (
        <PaywallBanner reason={paywallReason} onClose={() => setShowPaywall(false)} />
      )}

      <div css={Shared.pageWrapper}>

        {/* ── Header ── */}
        <DashboardHeader
          user={user}
          progress={progress}
          totalQuestions={questions.length}
          masteredCount={masteredCount}
        />

        {/* ── Tab nav ── */}
        <div css={ST.nav}>
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              css={[ST.btn, tab === id && ST.btnActive]}
              onClick={() => setTab(id)}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ══════════ HOME ══════════ */}
        {tab === 'home' && (
          <div>
            <QuestionOfTheDay isPro={progress.isPro} />

            <div css={ST.statsRow}>
              {[
                { n: masteredCount,                    label: 'Mastered',   color: C.accent3 },
                { n: progress.streakDays,              label: 'Day streak', color: C.accent2 },
                { n: questions.length - masteredCount, label: 'Remaining',  color: C.muted   },
              ].map(({ n, label, color }) => (
                <div key={label} css={ST.statCard}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: '0.6875rem', color: C.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <button css={ST.jumpBtn} onClick={() => setTab('practice')}>
              <BookOpen size={14} /> Practice today's questions →
            </button>
          </div>
        )}

        {/* ══════════ PRACTICE ══════════ */}
        {tab === 'practice' && (
          <div>
            {/* Filter bar — owns search, category, difficulty */}
            <CategoryFilter
              categories={categories}
              filters={filters}
              onChange={f => setFilters(f)}
              totalShown={filtered.length}
              totalAll={questions.length}
              loading={qLoading || pLoading}
            />

            {/* QuestionList owns pagination internally.
                key=filterKey forces a page-1 reset whenever filters change. */}
            <QuestionList
              key={`${filters.category}|${filters.difficulty}|${filters.search}`}
              questions={filtered}
              loading={qLoading || pLoading}
              error={qError}
              progress={progress}
              progressIds={progressIds}
              onMastered={handleMastered}
              onBookmark={handleBookmark}
              onNeedsPro={gatePaywall}
            />
          </div>
        )}

        {/* ══════════ LEARN ══════════ */}
        {tab === 'learn' && <LearnSection />}

        {/* ══════════ COMMUNITY ══════════ */}
        {tab === 'community' && <Leaderboard setTab={setTab} currentUid={user.uid} />}

      </div>
    </>
  )
}
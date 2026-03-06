/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions, useCategories, useUserProgress } from '@/hooks/useQuestions'
import Navbar from '@/components/layout/Navbar'
import {
  BookmarkIcon, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
  Lock, Sparkles, Target, Home, BookOpen, Layers, Trophy,
} from 'lucide-react'
import * as S from './styles'
import * as ST from './tab.styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import LearnSection from './components/LearnSection'
import QuestionOfTheDay from './components/QuestionOfTheDay'
import Leaderboard from './components/Leaderboard'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import AnswerEvaluator from '@/components/ui/AnswerEvaluator/page'
import AIChat from '@/components/ui/AIChat/page'

type ActivePanel = 'chat' | 'eval' | null
type Tab = 'home' | 'practice' | 'learn' | 'community'
const FREE_MASTER_LIMIT = 5
const PAGE_SIZE = 15

const DIFF_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  beginner: { bg: 'rgba(106,247,192,0.08)', color: '#6af7c0', border: 'rgba(106,247,192,0.2)' },
  core:     { bg: 'rgba(251,191,36,0.08)',  color: '#fde68a', border: 'rgba(251,191,36,0.2)'  },
  advanced: { bg: 'rgba(45,212,191,0.08)',  color: '#99f6e4', border: 'rgba(45,212,191,0.2)'  },
  expert:   { bg: 'rgba(248,113,113,0.08)', color: '#fca5a5', border: 'rgba(248,113,113,0.2)' },
}
const DIFF_LABEL: Record<string, string> = {
  beginner: 'Beginner', core: 'Core', advanced: 'Advanced', expert: 'Expert',
}

export default function DashboardPage() {
  const { user, progress, loading: authLoading } = useAuth()
  const router = useRouter()

  const { questions, loading: qLoading } = useQuestions({
    type: 'theory', track: 'javascript', enabled: !!user,
  })
  const { categories } = useCategories('theory', 'javascript')
  const {
    loading: pLoading, isMastered, isBookmarked,
    toggleMastered, toggleBookmark, masteredIds,
  } = useUserProgress({ uid: user?.uid ?? null })

  const [tab, setTab]                     = useState<Tab>('home')
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage]                   = useState(1)
  const [openId, setOpenId]               = useState<string | null>(null)
  const [activePanel, setActivePanel]     = useState<Record<string, ActivePanel>>({})
  const [showPaywall, setShowPaywall]     = useState(false)
  const [paywallReason, setPaywallReason] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth')
  }, [user, authLoading, router])

  useEffect(() => { setPage(1); setOpenId(null) }, [activeCategory])
  useEffect(() => { if (tab !== 'practice') setOpenId(null) }, [tab])

  if (authLoading || !user || !progress) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )

  const filtered      = activeCategory === 'All' ? questions : questions.filter(q => q.category === activeCategory)
  const totalPages    = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated     = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const masteredCount = masteredIds.length
  const pct           = questions.length > 0 ? Math.round((masteredCount / questions.length) * 100) : 0

  async function handleMastered(questionId: string) {
    if (!isMastered(questionId) && !progress!.isPro && masteredCount >= FREE_MASTER_LIMIT) {
      setPaywallReason(`Free plan is limited to ${FREE_MASTER_LIMIT} mastered questions. Upgrade to track all!`)
      setShowPaywall(true); return
    }
    await toggleMastered(questionId)
  }

  async function handleBookmark(questionId: string) {
    if (!progress!.isPro) {
      setPaywallReason('Bookmarks are a Pro feature. Upgrade to save questions for quick review.')
      setShowPaywall(true); return
    }
    await toggleBookmark(questionId)
  }

  function handlePanel(questionId: string, panel: 'chat' | 'eval') {
    if (!progress!.isPro) {
      setPaywallReason('AI features are Pro only. Upgrade to get AI tutoring and answer evaluation!')
      setShowPaywall(true); return
    }
    setActivePanel(prev => ({ ...prev, [questionId]: prev[questionId] === panel ? null : panel }))
  }

  function goPage(n: number) {
    setPage(n); setOpenId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
    { id: 'home',      label: 'Home',      Icon: Home     },
    { id: 'practice',  label: 'Practice',  Icon: BookOpen },
    { id: 'learn',     label: 'Learn',     Icon: Layers   },
    { id: 'community', label: 'Community', Icon: Trophy   },
  ]

  return (
    <>
      <Navbar />
      {showPaywall && <PaywallBanner reason={paywallReason} onClose={() => setShowPaywall(false)} />}

      <div css={Shared.pageWrapper}>

        {/* ── Progress header ── */}
        <div css={S.header}>
          <div css={S.headerRow}>
            <div>
              <h1 css={S.greeting}>Hey {user.displayName?.split(' ')[0]} 👋</h1>
              <p style={{ fontSize: '0.8125rem', color: C.muted, margin: '0.125rem 0 0' }}>
                {masteredCount}/{questions.length} mastered · {progress.streakDays}🔥 streak
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: '0.6875rem', color: C.muted }}>complete</div>
            </div>
          </div>
          <div css={[Shared.progressBarTrack, { marginTop: '0.75rem' }]}>
            <div css={Shared.progressBarFill(pct)} />
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div css={ST.nav}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} css={[ST.btn, tab === id && ST.btnActive]} onClick={() => setTab(id)}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ══════════ HOME ══════════ */}
        {tab === 'home' && (
          <div>
            {progress.isPro && (
              <div css={S.shortcutsGrid}>
                {[
                  { href: '/mock-interview', icon: '🎤', label: 'Mock Interview', border: `${C.accent}4d`  },
                  { href: '/study-plan',     icon: '🧠', label: 'AI Study Plan',  border: `${C.accent2}4d` },
                  { href: '/cheatsheet',     icon: '📄', label: 'Cheat Sheet',    border: `${C.accent3}4d` },
                ].map(({ href, icon, label, border }) => (
                  <button key={href} css={S.shortcutBtn(border)} onClick={() => router.push(href)}>
                    <div css={S.shortcutIcon}>{icon}</div>
                    <div css={S.shortcutLabel}>{label}</div>
                  </button>
                ))}
              </div>
            )}

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
            <div css={Shared.categoryScroll}>
              {['All', ...categories].map(cat => (
                <button key={cat} css={Shared.categoryChip(activeCategory === cat)}
                  onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {!qLoading && !pLoading && (
              <div css={ST.listMeta}>
                <span>{filtered.length} question{filtered.length !== 1 ? 's' : ''}</span>
                {totalPages > 1 && <span>Page {page} / {totalPages}</span>}
              </div>
            )}

            {(qLoading || pLoading) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    height: '4.5rem', borderRadius: '1rem', background: C.card,
                    animation: 'shimmer 1.4s infinite',
                    backgroundImage: `linear-gradient(90deg,${C.card} 25%,${C.surface} 50%,${C.card} 75%)`,
                    backgroundSize: '200% 100%',
                  }} />
                ))}
                <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
              </div>
            )}

            {!qLoading && !pLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {paginated.map((q, idx) => {
                  const mastered   = isMastered(q.id)
                  const bookmarked = isBookmarked(q.id)
                  const isOpen     = openId === q.id
                  const panel      = activePanel[q.id] ?? null
                  const ds         = DIFF_STYLES[q.difficulty] ?? DIFF_STYLES.core
                  const globalIdx  = (page - 1) * PAGE_SIZE + idx + 1

                  return (
                    <div key={q.id} css={S.questionCard(mastered)}>
                      <div css={S.questionHeader} onClick={() => setOpenId(isOpen ? null : q.id)}>
                        <span css={S.qNumber}>Q{String(globalIdx).padStart(2, '0')}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p css={S.questionText}>{q.title}</p>
                          <div css={S.tagsRow}>
                            <span css={S.tag(ds.bg, ds.color, ds.border)}>
                              {DIFF_LABEL[q.difficulty] ?? q.difficulty}
                            </span>
                            <span css={S.tag(`${C.accent}1a`, `${C.accent}cc`, `${C.accent}33`)}>
                              {q.category}
                            </span>
                            {q.isPro && !progress.isPro && (
                              <span css={S.tag(`${C.accent2}1a`, C.accent2, `${C.accent2}33`)}>
                                <Lock size={9} style={{ display:'inline', marginRight:2 }} />Pro
                              </span>
                            )}
                          </div>
                        </div>
                        <div css={S.chevronWrapper(isOpen)}><ChevronDown size={16} /></div>
                      </div>

                      {isOpen && (
                        <div css={S.questionBody}>
                          {q.hint && <div css={S.hint}>💡 Hint: {q.hint}</div>}
                          <div css={S.answerBody} dangerouslySetInnerHTML={{ __html: q.answer }} />
                          <div css={S.actionRow}>
                            <button css={Shared.actionBtn(C.accent3, mastered)} onClick={() => handleMastered(q.id)}>
                              <CheckCircle size={13} />{mastered ? 'Mastered ✓' : 'Mark mastered'}
                            </button>
                            <button css={Shared.actionBtn(C.accent2, bookmarked)} onClick={() => handleBookmark(q.id)}>
                              {!progress.isPro ? <Lock size={12} /> : <BookmarkIcon size={12} />}
                              {bookmarked ? 'Saved' : 'Bookmark'}
                            </button>
                            <button css={Shared.actionBtn(C.accent, panel === 'chat')} onClick={() => handlePanel(q.id, 'chat')}>
                              <Sparkles size={12} />{!progress.isPro && <Lock size={11} />} AI Tutor
                            </button>
                            <button css={Shared.actionBtn(C.accent2, panel === 'eval')} onClick={() => handlePanel(q.id, 'eval')}>
                              <Target size={12} />{!progress.isPro && <Lock size={11} />} Evaluate Me
                            </button>
                          </div>
                          {panel === 'chat' && (
                            <AIChat question={q.title} answer={q.answer}
                              onClose={() => setActivePanel(prev => ({ ...prev, [q.id]: null }))} />
                          )}
                          {panel === 'eval' && (
                            <AnswerEvaluator question={q.title} idealAnswer={q.answer}
                              onClose={() => setActivePanel(prev => ({ ...prev, [q.id]: null }))} />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {filtered.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: C.muted }}>
                    No questions in this category yet.
                  </div>
                )}

                {totalPages > 1 && (
                  <div css={ST.pagination}>
                    <button css={ST.pageBtn(page > 1)} disabled={page <= 1}
                      onClick={() => goPage(page - 1)}>
                      <ChevronLeft size={14} /> Prev
                    </button>

                    <div css={ST.pageDots}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | 'gap')[]>((acc, p, i, arr) => {
                          if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('gap')
                          acc.push(p)
                          return acc
                        }, [])
                        .map((p, i) =>
                          p === 'gap'
                            ? <span key={`g${i}`} style={{ color: C.muted, fontSize: '0.75rem' }}>…</span>
                            : <button key={p} css={ST.pageNum(p === page)} onClick={() => goPage(p as number)}>{p}</button>
                        )
                      }
                    </div>

                    <button css={ST.pageBtn(page < totalPages)} disabled={page >= totalPages}
                      onClick={() => goPage(page + 1)}>
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
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
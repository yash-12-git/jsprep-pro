/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions, useCategories, useUserProgress } from '@/hooks/useQuestions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import AIChat from '@/components/ui/AIChat/page'
import AnswerEvaluator from '@/components/ui/AnswerEvaluator/page'
import { BookmarkIcon, CheckCircle, ChevronDown, Lock, Sparkles, Target } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import LearnSection from './components/LearnSection'

type ActivePanel = 'chat' | 'eval' | null
const FREE_MASTER_LIMIT = 5

const DIFF_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  beginner: { bg: 'rgba(106,247,192,0.08)', color: '#6af7c0', border: 'rgba(106,247,192,0.2)' },
  core:     { bg: 'rgba(251,191,36,0.08)',  color: '#fde68a', border: 'rgba(251,191,36,0.2)' },
  advanced: { bg: 'rgba(45,212,191,0.08)',  color: '#99f6e4', border: 'rgba(45,212,191,0.2)' },
  expert:   { bg: 'rgba(248,113,113,0.08)', color: '#fca5a5', border: 'rgba(248,113,113,0.2)' },
}
const DIFF_LABEL: Record<string, string> = {
  beginner: 'Beginner', core: 'Core', advanced: 'Advanced', expert: 'Expert'
}

export default function DashboardPage() {
  const { user, progress, loading: authLoading } = useAuth()
  const router = useRouter()

  const { questions, loading: qLoading } = useQuestions({
    type: 'theory',
    track: 'javascript',
    enabled: !!user,
  })
  const { categories } = useCategories('theory', 'javascript')
  const {
    loading: pLoading,
    isMastered, isBookmarked,
    toggleMastered, toggleBookmark,
    masteredIds,
  } = useUserProgress({ uid: user?.uid ?? null })

  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<Record<string, ActivePanel>>({})
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallReason, setPaywallReason] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth')
  }, [user, authLoading, router])

  if (authLoading || !user || !progress) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )

  const filtered = activeCategory === 'All'
    ? questions
    : questions.filter(q => q.category === activeCategory)

  const masteredCount = masteredIds.length
  const pct = questions.length > 0 ? Math.round((masteredCount / questions.length) * 100) : 0

  async function handleMastered(questionId: string) {
    const alreadyMastered = isMastered(questionId)
    if (!alreadyMastered && !progress!.isPro && masteredCount >= FREE_MASTER_LIMIT) {
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

  return (
    <>
      <Navbar />
      {showPaywall && <PaywallBanner reason={paywallReason} onClose={() => setShowPaywall(false)} />}
      <div css={Shared.pageWrapper}>

        <div css={S.header}>
          <div css={S.headerRow}>
            <h1 css={S.greeting}>Hey {user.displayName?.split(' ')[0]} 👋</h1>
            <span css={S.masteredCount}>{masteredCount}/{questions.length} mastered</span>
          </div>
          <div css={[Shared.progressBarTrack, { marginTop: '0.75rem' }]}>
            <div css={Shared.progressBarFill(pct)} />
          </div>
          <div css={S.progressRow}>
            <span css={S.progressLabel}>{pct}% complete</span>
            {!progress.isPro && (
              <span css={S.freeLabel}>
                {FREE_MASTER_LIMIT - Math.min(masteredCount, FREE_MASTER_LIMIT)} free marks remaining
              </span>
            )}
          </div>
        </div>

        {progress.isPro && (
          <div css={S.shortcutsGrid}>
            {[
              { href: '/mock-interview', icon: '🎤', label: 'Mock Interview', border: `${C.accent}4d` },
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

        {/* ── Learn: Topics + Blog entry point ── */}
        <LearnSection />

        <div css={Shared.categoryScroll}>
          {['All', ...categories].map(cat => (
            <button key={cat} css={Shared.categoryChip(activeCategory === cat)}
              onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {(qLoading || pLoading) && (
          <div css={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} css={{ height: '4.5rem', borderRadius: '1rem', background: C.card,
                animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%',
                backgroundImage: `linear-gradient(90deg,${C.card} 25%,${C.surface} 50%,${C.card} 75%)` }} />
            ))}
            <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
          </div>
        )}

        {!qLoading && !pLoading && (
          <div css={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((q, idx) => {
              const mastered   = isMastered(q.id)
              const bookmarked = isBookmarked(q.id)
              const isOpen     = openId === q.id
              const panel      = activePanel[q.id] ?? null
              const ds         = DIFF_STYLES[q.difficulty] ?? DIFF_STYLES.core

              return (
                <div key={q.id} css={S.questionCard(mastered)}>
                  <div css={S.questionHeader} onClick={() => setOpenId(isOpen ? null : q.id)}>
                    <span css={S.qNumber}>Q{String(idx + 1).padStart(2, '0')}</span>
                    <div css={{ flex: 1, minWidth: 0 }}>
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
                          <CheckCircle size={13} />{mastered ? 'Mastered ✓' : 'Mark as mastered'}
                        </button>
                        <button css={Shared.actionBtn(C.accent2, bookmarked)} onClick={() => handleBookmark(q.id)}>
                          {!progress.isPro ? <Lock size={12} /> : <BookmarkIcon size={12} />}
                          {bookmarked ? 'Bookmarked' : 'Bookmark'}
                        </button>
                        <button css={Shared.actionBtn(C.accent, panel === 'chat')} onClick={() => handlePanel(q.id, 'chat')}>
                          <Sparkles size={12} />{!progress.isPro && <Lock size={11} />}AI Tutor
                        </button>
                        <button css={Shared.actionBtn(C.accent2, panel === 'eval')} onClick={() => handlePanel(q.id, 'eval')}>
                          <Target size={12} />{!progress.isPro && <Lock size={11} />}Evaluate Me
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
              <div css={{ textAlign: 'center', padding: '3rem 1rem', color: C.muted }}>
                No questions found for this category.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
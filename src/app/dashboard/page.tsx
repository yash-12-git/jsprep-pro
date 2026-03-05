/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { markMastered, toggleBookmark } from '@/lib/userProgress'
import { questions, CATEGORIES, FREE_LIMIT } from '@/data/questions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import AIChat from '@/components/ui/AIChat/page'
import AnswerEvaluator from '@/components/ui/AnswerEvaluator/page'
import { BookmarkIcon, CheckCircle, ChevronDown, Lock, Sparkles, Target } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'

type ActivePanel = 'chat' | 'eval' | null

const TAG_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  core: { bg: 'rgba(251,191,36,0.08)', color: '#fde68a', border: 'rgba(251,191,36,0.2)' },
  mid:  { bg: 'rgba(45,212,191,0.08)', color: '#99f6e4', border: 'rgba(45,212,191,0.2)' },
  adv:  { bg: 'rgba(248,113,113,0.08)', color: '#fca5a5', border: 'rgba(248,113,113,0.2)' },
}
const TAG_LABEL: Record<string, string> = { core: 'Core', mid: 'Mid', adv: 'Advanced' }

export default function DashboardPage() {
  const { user, progress, loading, refreshProgress } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [activePanel, setActivePanel] = useState<Record<number, ActivePanel>>({})
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallReason, setPaywallReason] = useState('')

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])

  if (loading || !user || !progress) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )

  const filtered = activeCategory === 'All' ? questions : questions.filter(q => q.cat === activeCategory)
  const masteredCount = progress.masteredIds.length
  const pct = Math.round((masteredCount / questions.length) * 100)

  async function handleMastered(id: number, val: boolean) {
    if (!user || !progress) return
    if (val && !progress.isPro && progress.masteredIds.length >= FREE_LIMIT) {
      setPaywallReason(`Free plan is limited to ${FREE_LIMIT} mastered questions. Upgrade to track all!`)
      setShowPaywall(true); return
    }
    await markMastered(user.uid, id, val); await refreshProgress()
  }

  async function handleBookmark(id: number, val: boolean) {
    if (!user || !progress) return
    if (!progress.isPro) {
      setPaywallReason('Bookmarks are a Pro feature. Upgrade to save questions for quick review.')
      setShowPaywall(true); return
    }
    await toggleBookmark(user.uid, id, val); await refreshProgress()
  }

  function togglePanel(id: number, panel: 'chat' | 'eval') {
    if (!progress?.isPro) {
      setPaywallReason('AI features are Pro only. Upgrade to get AI tutoring and answer evaluation!')
      setShowPaywall(true); return
    }
    setActivePanel(prev => ({ ...prev, [id]: prev[id] === panel ? null : panel }))
  }

  return (
    <>
      <Navbar />
      {showPaywall && <PaywallBanner reason={paywallReason} onClose={() => setShowPaywall(false)} />}
      <div css={Shared.pageWrapper}>

        {/* Header */}
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
              <span css={S.freeLabel}>{FREE_LIMIT - Math.min(masteredCount, FREE_LIMIT)} free marks remaining</span>
            )}
          </div>
        </div>

        {/* Pro shortcuts */}
        {progress.isPro && (
          <div css={S.shortcutsGrid}>
            {[
              { href: '/mock-interview', icon: '🎤', label: 'Mock Interview', border: `${C.accent}4d` },
              { href: '/study-plan', icon: '🧠', label: 'AI Study Plan', border: `${C.accent2}4d` },
              { href: '/cheatsheet', icon: '📄', label: 'Cheat Sheet', border: `${C.accent3}4d` },
            ].map(({ href, icon, label, border }) => (
              <button key={href} css={S.shortcutBtn(border)} onClick={() => router.push(href)}>
                <div css={S.shortcutIcon}>{icon}</div>
                <div css={S.shortcutLabel}>{label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Category filter */}
        <div css={Shared.categoryScroll}>
          {['All', ...CATEGORIES].map(cat => (
            <button key={cat} css={Shared.categoryChip(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div css={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((q) => {
            const isMastered = progress.masteredIds.includes(q.id)
            const isBookmarked = progress.bookmarkedIds.includes(q.id)
            const isOpen = openId === q.id
            const panel = activePanel[q.id] || null

            return (
              <div key={q.id} css={S.questionCard(isMastered)}>
                <div css={S.questionHeader} onClick={() => setOpenId(isOpen ? null : q.id)}>
                  <span css={S.qNumber}>Q{String(q.id + 1).padStart(2, '0')}</span>
                  <div css={{ flex: 1, minWidth: 0 }}>
                    <p css={S.questionText}>{q.q}</p>
                    <div css={S.tagsRow}>
                      {q.tags.map(t => {
                        const ts = TAG_STYLES[t]
                        return <span key={t} css={S.tag(ts.bg, ts.color, ts.border)}>{TAG_LABEL[t]}</span>
                      })}
                      <span css={S.tag(`${C.accent}1a`, `${C.accent}cc`, `${C.accent}33`)}>{q.cat}</span>
                    </div>
                  </div>
                  <div css={S.chevronWrapper(isOpen)}><ChevronDown size={16} /></div>
                </div>

                {isOpen && (
                  <div css={S.questionBody}>
                    {q.hint && <div css={S.hint}>💡 Hint: {q.hint}</div>}
                    <div css={S.answerBody} dangerouslySetInnerHTML={{ __html: q.answer }} />
                    <div css={S.actionRow}>
                      <button css={Shared.actionBtn(C.accent3, isMastered)} onClick={() => handleMastered(q.id, !isMastered)}>
                        <CheckCircle size={13} />{isMastered ? 'Mastered ✓' : 'Mark as mastered'}
                      </button>
                      <button css={Shared.actionBtn(C.accent2, isBookmarked)} onClick={() => handleBookmark(q.id, !isBookmarked)}>
                        {!progress.isPro ? <Lock size={12} /> : <BookmarkIcon size={12} />}
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </button>
                      <button css={Shared.actionBtn(C.accent, panel === 'chat')} onClick={() => togglePanel(q.id, 'chat')}>
                        <Sparkles size={12} />{!progress.isPro && <Lock size={11} />}AI Tutor
                      </button>
                      <button css={Shared.actionBtn(C.accent2, panel === 'eval')} onClick={() => togglePanel(q.id, 'eval')}>
                        <Target size={12} />{!progress.isPro && <Lock size={11} />}Evaluate Me
                      </button>
                    </div>
                    {panel === 'chat' && (
                      <AIChat question={q.q} answer={q.answer} onClose={() => setActivePanel(prev => ({ ...prev, [q.id]: null }))} />
                    )}
                    {panel === 'eval' && (
                      <AnswerEvaluator question={q.q} idealAnswer={q.answer} onClose={() => setActivePanel(prev => ({ ...prev, [q.id]: null }))} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
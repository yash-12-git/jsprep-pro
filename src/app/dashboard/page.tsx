'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { markMastered, toggleBookmark } from '@/lib/userProgress'
import { questions, CATEGORIES, FREE_LIMIT } from '@/data/questions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import AIChat from '@/components/ui/AIChat'
import AnswerEvaluator from '@/components/ui/AnswerEvaluator'
import { BookmarkIcon, CheckCircle, ChevronDown, Lock, Sparkles, Target } from 'lucide-react'
import clsx from 'clsx'

type ActivePanel = 'chat' | 'eval' | null

export default function DashboardPage() {
  const { user, progress, loading, refreshProgress } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [activePanel, setActivePanel] = useState<Record<number, ActivePanel>>({})
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallReason, setPaywallReason] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  if (loading || !user || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filtered = activeCategory === 'All' ? questions : questions.filter(q => q.cat === activeCategory)

  async function handleMastered(id: number, val: boolean) {
    if (!user || !progress) return
    if (val && !progress.isPro && progress.masteredIds.length >= FREE_LIMIT) {
      setPaywallReason('Free plan is limited to ' + FREE_LIMIT + ' mastered questions. Upgrade to track all!')
      setShowPaywall(true)
      return
    }
    await markMastered(user.uid, id, val)
    await refreshProgress()
  }

  async function handleBookmark(id: number, val: boolean) {
    if (!user || !progress) return
    if (!progress.isPro) {
      setPaywallReason('Bookmarks are a Pro feature. Upgrade to save questions for quick review.')
      setShowPaywall(true)
      return
    }
    await toggleBookmark(user.uid, id, val)
    await refreshProgress()
  }

  function togglePanel(id: number, panel: 'chat' | 'eval') {
    if (!progress || !progress.isPro) {
      setPaywallReason('AI features are Pro only. Upgrade to get AI tutoring and answer evaluation!')
      setShowPaywall(true)
      return
    }
    setActivePanel(prev => ({ ...prev, [id]: prev[id] === panel ? null : panel }))
  }

  const tagStyle: Record<string, string> = {
    core: 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20',
    mid: 'bg-teal-400/10 text-teal-300 border border-teal-400/20',
    adv: 'bg-red-400/10 text-red-300 border border-red-400/20',
  }
  const tagLabel: Record<string, string> = { core: 'Core', mid: 'Mid', adv: 'Advanced' }
  const masteredCount = progress.masteredIds.length
  const pct = Math.round((masteredCount / questions.length) * 100)

  return (
    <>
      <Navbar />
      {showPaywall && <PaywallBanner reason={paywallReason} onClose={() => setShowPaywall(false)} />}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-black">Hey {user.displayName?.split(' ')[0]} 👋</h1>
            <span className="text-muted text-sm">{masteredCount}/{questions.length} mastered</span>
          </div>
          <div className="h-2 bg-surface rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-accent3 rounded-full transition-all duration-500" style={{ width: pct + '%' }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted text-xs">{pct}% complete</span>
            {!progress.isPro && <span className="text-yellow-400/70 text-xs">{FREE_LIMIT - Math.min(masteredCount, FREE_LIMIT)} free marks remaining</span>}
          </div>
        </div>

        {progress.isPro && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { href: '/mock-interview', icon: '🎤', label: 'Mock Interview', color: 'border-accent/30 hover:border-accent/60' },
              { href: '/study-plan', icon: '🧠', label: 'AI Study Plan', color: 'border-accent2/30 hover:border-accent2/60' },
              { href: '/cheat-sheet', icon: '📄', label: 'Cheat Sheet', color: 'border-accent3/30 hover:border-accent3/60' },
            ].map(({ href, icon, label, color }) => (
              <button key={href} onClick={() => router.push(href)}
                className={'bg-card border rounded-xl p-3 text-center transition-all ' + color}>
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-xs font-bold text-white">{label}</div>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {['All', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ' +
                (activeCategory === cat ? 'bg-accent border-accent text-white' : 'border-border text-muted hover:border-accent/50 hover:text-white')}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((q) => {
            const isMastered = progress.masteredIds.includes(q.id)
            const isBookmarked = progress.bookmarkedIds.includes(q.id)
            const isOpen = openId === q.id
            const panel = activePanel[q.id] || null

            return (
              <div key={q.id} className={'bg-card border rounded-2xl overflow-hidden transition-all duration-200 ' +
                (isMastered ? 'border-accent3/30' : 'border-border hover:border-accent/30')}>

                <div className="flex items-start gap-3 p-5 cursor-pointer" onClick={() => setOpenId(isOpen ? null : q.id)}>
                  <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                    Q{String(q.id + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug mb-2">{q.q}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {q.tags.map(t => (
                        <span key={t} className={'text-[10px] font-bold px-2 py-0.5 rounded-md ' + tagStyle[t]}>{tagLabel[t]}</span>
                      ))}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/10 text-accent/80 border border-accent/20">{q.cat}</span>
                    </div>
                  </div>
                  <div className={'flex-shrink-0 transition-transform duration-300 ' + (isOpen ? 'rotate-180' : '')}>
                    <ChevronDown size={16} className="text-muted" />
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-border">
                    {q.hint && (
                      <div className="px-5 pt-4 pb-0">
                        <div className="text-xs text-accent3 bg-accent3/10 border border-accent3/20 rounded-lg px-3 py-2">
                          💡 Hint: {q.hint}
                        </div>
                      </div>
                    )}
                    <div className="answer px-5 py-4" dangerouslySetInnerHTML={{ __html: q.answer }} />

                    <div className="flex flex-wrap gap-2 px-5 pb-4">
                      <button onClick={() => handleMastered(q.id, !isMastered)}
                        className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ' +
                          (isMastered ? 'bg-accent3/20 border-accent3/40 text-accent3' : 'border-border text-muted hover:border-accent3/50 hover:text-white')}>
                        <CheckCircle size={13} />
                        {isMastered ? 'Mastered ✓' : 'Mark as mastered'}
                      </button>

                      <button onClick={() => handleBookmark(q.id, !isBookmarked)}
                        className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ' +
                          (isBookmarked ? 'bg-accent2/20 border-accent2/40 text-accent2' : 'border-border text-muted hover:border-accent2/50 hover:text-white')}>
                        {!progress.isPro ? <Lock size={12} /> : <BookmarkIcon size={12} />}
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </button>

                      <button onClick={() => togglePanel(q.id, 'chat')}
                        className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ' +
                          (panel === 'chat' ? 'bg-accent/20 border-accent/40 text-accent' : 'border-border text-muted hover:border-accent/50 hover:text-white')}>
                        <Sparkles size={12} />
                        {!progress.isPro && <Lock size={11} />}
                        AI Tutor
                      </button>

                      <button onClick={() => togglePanel(q.id, 'eval')}
                        className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ' +
                          (panel === 'eval' ? 'bg-accent2/20 border-accent2/40 text-accent2' : 'border-border text-muted hover:border-accent2/50 hover:text-white')}>
                        <Target size={12} />
                        {!progress.isPro && <Lock size={11} />}
                        Evaluate Me
                      </button>
                    </div>

                    {panel === 'chat' && (
                      <AIChat question={q.q} answer={q.answer}
                        onClose={() => setActivePanel(prev => ({ ...prev, [q.id]: null }))} />
                    )}
                    {panel === 'eval' && (
                      <AnswerEvaluator question={q.q} idealAnswer={q.answer}
                        onClose={() => setActivePanel(prev => ({ ...prev, [q.id]: null }))} />
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

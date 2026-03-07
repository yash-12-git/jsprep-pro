/** @jsxImportSource @emotion/react */
'use client'
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getPublishedTopics } from '@/lib/topics'
import type { Topic } from '@/types/topic'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { ChevronLeft, ChevronDown, ChevronUp, Printer, Target, Lightbulb, BookOpen } from 'lucide-react'
import * as Shared from '@/styles/shared'
import { C, RADIUS } from '@/styles/tokens'

// ─── Group topics by category ─────────────────────────────────────────────────
type CategoryMap = Record<string, Topic[]>
function groupByCategory(topics: Topic[]): CategoryMap {
  return topics.reduce<CategoryMap>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})
}

const DIFF_COLOR: Record<string, { color: string; bg: string }> = {
  'Beginner':     { color: '#6af7c0', bg: 'rgba(106,247,192,0.1)' },
  'Intermediate': { color: '#f7c76a', bg: 'rgba(247,199,106,0.1)' },
  'Advanced':     { color: '#f76a6a', bg: 'rgba(247,106,106,0.1)' },
  'Senior':       { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Core JS':       '⚡',
  'Functions':     '🔧',
  'Async JS':      '⏳',
  "Promises":      '🔗',
  'Objects':       '🧱',
  'Arrays':        '📦',
  "'this' Keyword":'🎯',
  'Error Handling':'🛡️',
  'Modern JS':     '✨',
  'Performance':   '🚀',
  'DOM & Events':  '🌐',
  'Browser APIs':  '🔌',
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const pageWrap = css`
  max-width: 52rem; margin: 0 auto; padding: 2rem 1rem 5rem;
`
const topRow = css`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;
`
const backBtn = css`
  display: flex; align-items: center; gap: 0.25rem;
  color: ${C.muted}; font-size: 0.875rem; background: none; border: none; cursor: pointer;
  &:hover { color: white; }
`
const printBtn = css`
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.125rem; border-radius: ${RADIUS.lg};
  background: rgba(124,106,247,0.1); border: 1px solid rgba(124,106,247,0.25);
  color: #c4b5fd; font-weight: 700; font-size: 0.8125rem; cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(124,106,247,0.2); }
  @media print { display: none; }
`
const pageHeader = css`
  margin-bottom: 1.75rem;
`
const pageTitle = css`
  font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900; color: white;
  letter-spacing: -0.02em; margin-bottom: 0.375rem;
`
const pageSubtitle = css`
  font-size: 0.875rem; color: ${C.muted}; line-height: 1.6;
`

// Filter tabs
const filterRow = css`
  display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;
  @media print { display: none; }
`
const filterChip = (active: boolean) => css`
  padding: 0.3125rem 0.875rem; border-radius: 9999px;
  font-size: 0.75rem; font-weight: 700; cursor: pointer;
  background: ${active ? 'rgba(124,106,247,0.2)' : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${active ? 'rgba(124,106,247,0.4)' : 'rgba(255,255,255,0.07)'};
  color: ${active ? '#c4b5fd' : C.muted};
  transition: all 0.12s;
  &:hover { border-color: rgba(124,106,247,0.3); color: rgba(255,255,255,0.75); }
`

// Category section
const catSection = css`
  margin-bottom: 2rem;
  @media print { break-inside: avoid; margin-bottom: 1.5rem; }
`
const catHeader = css`
  display: flex; align-items: center; gap: 0.625rem;
  margin-bottom: 0.875rem;
`
const catEmoji = css`font-size: 1.125rem; line-height: 1;`
const catName = css`
  font-size: 0.875rem; font-weight: 800; color: white;
  text-transform: uppercase; letter-spacing: 0.06em;
`
const catCount = css`
  font-size: 0.6875rem; color: ${C.muted}; font-weight: 600;
  background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 9999px;
`

// Topic card
const topicCard = css`
  background: ${C.card}; border: 1px solid rgba(255,255,255,0.07);
  border-radius: ${RADIUS.xl}; overflow: hidden; margin-bottom: 0.625rem;
  transition: border-color 0.15s;
  &:hover { border-color: rgba(124,106,247,0.2); }
  @media print { break-inside: avoid; }
`
const topicCardHeader = css`
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.875rem 1rem; cursor: pointer;
  @media print { cursor: default; }
`
const topicKeyword = css`
  font-size: 0.875rem; font-weight: 800; color: white; flex: 1; text-transform: capitalize;
`
const diffPill = (color: string, bg: string) => css`
  font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
  color: ${color}; background: ${bg}; padding: 2px 8px; border-radius: 10px;
  flex-shrink: 0;
`
const chevron = (open: boolean) => css`
  color: ${C.muted}; transition: transform 0.2s; flex-shrink: 0;
  transform: rotate(${open ? '180deg' : '0deg'});
  @media print { display: none; }
`

// Body
const topicBody = css`
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 1rem;
  @media print { padding-top: 0.75rem; }
`
const sectionLabel = (color: string) => css`
  display: flex; align-items: center; gap: 0.375rem;
  font-size: 0.6875rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.07em; color: ${color}; margin-bottom: 0.5rem;
`
const bullet = css`
  display: flex; gap: 0.5rem; align-items: flex-start;
  font-size: 0.8125rem; color: rgba(255,255,255,0.68); line-height: 1.55;
  margin-bottom: 0.375rem;
`
const bulletDot = (color: string) => css`
  font-size: 0.75rem; color: ${color}; flex-shrink: 0; margin-top: 0.125rem;
`
const divider = css`
  height: 1px; background: rgba(255,255,255,0.05); margin: 0.875rem 0;
`

// Pro gate
const proGate = css`
  text-align: center; padding: 5rem 2rem;
`
const proGateIcon = css`font-size: 2.5rem; margin-bottom: 1rem;`
const proGateTitle = css`font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem;`
const proGateText = css`font-size: 0.875rem; color: ${C.muted}; max-width: 28rem; margin: 0 auto 1.5rem;`

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheatSheetPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()

  const [topics, setTopics] = useState<Topic[]>([])
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  useEffect(() => {
  async function load() {
    const data = await getPublishedTopics()
    setTopics(data)
    setTopicsLoading(false)
  }
  load()
}, [])

  if (loading || !user || !progress || topicsLoading) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )

  if (!progress.isPro) return (
    <>
      <Navbar />
      <div css={[pageWrap, proGate]}>
        <div css={proGateIcon}>📄</div>
        <h2 css={proGateTitle}>Cheat Sheet is Pro</h2>
        <p css={proGateText}>
          Get instant access to crisp topic-by-topic revision cards covering every concept
          you need to know before your JavaScript interview.
        </p>
        <button css={Shared.primaryBtn(C.accent)}
          style={{ width: 'auto', padding: '0.75rem 1.75rem', margin: '0 auto', display: 'inline-flex' }}
          onClick={() => router.push('/dashboard')}>
          Upgrade to Pro →
        </button>
      </div>
    </>
  )

  // Categories for filter
  const allCategories = [...new Set(topics.map(t => t.category))]
  const filtered = activeFilter === 'All'
    ? topics
    : topics.filter(t => t.category === activeFilter)

  const grouped = groupByCategory(filtered)

  function toggleTopic(slug: string) {
    setOpenTopics(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  function expandAll() { setOpenTopics(new Set(filtered.map((t: Topic) => t.slug))) }
  function collapseAll() { setOpenTopics(new Set()) }

  const totalTopics = filtered.length
  const openCount = [...openTopics].filter(s => filtered.some(t => t.slug === s)).length

  return (
    <>
      <div className="print-hide">
        <Navbar />
      </div>

      <div css={pageWrap}>
        <style>{`
          @media print {
            .print-hide { display: none !important; }
            @page { size: A4; margin: 12mm; }
            body { background: white !important; color: #111 !important; }
          }
        `}</style>

        {/* Top row */}
        <div css={topRow} className="print-hide">
          <button css={backBtn} onClick={() => router.push('/dashboard')}>
            <ChevronLeft size={16} /> Dashboard
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button css={[printBtn, { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: C.muted }]}
              onClick={openCount === totalTopics ? collapseAll : expandAll}>
              {openCount === totalTopics ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {openCount === totalTopics ? 'Collapse all' : 'Expand all'}
            </button>
            <button css={printBtn} onClick={() => { expandAll(); setTimeout(() => window.print(), 300) }}>
              <Printer size={14} /> Print / PDF
            </button>
          </div>
        </div>

        {/* Header */}
        <div css={pageHeader}>
          <h1 css={pageTitle}>JavaScript Interview Cheat Sheet</h1>
          <p css={pageSubtitle}>
            {totalTopics} topics · crisp bullet points for every concept you need to know.
            Use this the night before your interview.
          </p>
        </div>

        {/* Category filter */}
        <div css={filterRow}>
          {['All', ...allCategories].map(cat => (
            <button key={cat} css={filterChip(activeFilter === cat)}
              onClick={() => { setActiveFilter(cat); setOpenTopics(new Set()) }}>
              {cat === 'All' ? 'All Topics' : `${CATEGORY_EMOJI[cat] ?? ''} ${cat}`.trim()}
            </button>
          ))}
        </div>

        {/* Topic cards grouped by category */}
        {Object.entries(grouped).map(([cat, topics]) => (
          <div key={cat} css={catSection}>
            <div css={catHeader}>
              <span css={catEmoji}>{CATEGORY_EMOJI[cat] ?? '📌'}</span>
              <span css={catName}>{cat}</span>
              <span css={catCount}>{topics.length} topics</span>
            </div>

            {topics.map(topic => {
              const isOpen = openTopics.has(topic.slug)
              const dm = DIFF_COLOR[topic.difficulty] ?? DIFF_COLOR['Intermediate']

              return (
                <div key={topic.slug} css={topicCard}>
                  {/* Card header */}
                  <div css={topicCardHeader} onClick={() => toggleTopic(topic.slug)}>
                    <span css={topicKeyword}>{topic.keyword}</span>
                    <span css={diffPill(dm.color, dm.bg)}>{topic.difficulty}</span>
                    <div css={chevron(isOpen)}>
                      <ChevronDown size={15} />
                    </div>
                  </div>

                  {/* Card body — visible when expanded OR when printing */}
                  {(isOpen) && (
                    <div css={topicBody} className="topic-body">
                      {/* What to know */}
                      <div css={sectionLabel('#6af7c0')}>
                        <BookOpen size={11} /> Key points
                      </div>
                      {topic.cheatSheet.map((pt, i) => (
                        <div key={i} css={bullet}>
                          <span css={bulletDot('#6af7c0')}>▸</span>
                          {pt}
                        </div>
                      ))}

                      <div css={divider} />

                      {/* Interview tips */}
                      <div css={sectionLabel('#f7c76a')}>
                        <Target size={11} /> Interview tips
                      </div>
                      {topic.interviewTips.map((tip, i) => (
                        <div key={i} css={bullet}>
                          <span css={bulletDot('#f7c76a')}>▸</span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* Print footer */}
        <div style={{ marginTop: '2rem', borderTop: `1px solid ${C.border}`, paddingTop: '1rem', textAlign: 'center' }} className="print-hide">
          <p style={{ fontSize: '0.75rem', color: C.muted }}>
            jsprep.pro · JavaScript Interview Prep · Good luck! 🚀
          </p>
        </div>
      </div>
    </>
  )
}
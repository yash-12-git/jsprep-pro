/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { questions } from '@/data/questions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { ChevronLeft, Printer } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'

export default function CheatSheetPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])

  if (loading || !user || !progress) return <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  if (!progress.isPro) return <><Navbar /><PaywallBanner reason="Cheat Sheet Generator is a Pro feature. Upgrade to generate your personalized PDF!" /></>

  const masteredQuestions = questions.filter(q => progress.masteredIds.includes(q.id))

  if (masteredQuestions.length === 0) return (
    <>
      <Navbar />
      <div css={[Shared.pageWrapper, { textAlign: 'center', paddingTop: '4rem' }]}>
        <div css={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
        <h2 css={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>No mastered questions yet</h2>
        <p css={{ color: C.muted, marginBottom: '1.5rem' }}>Mark questions as mastered in the dashboard — your cheat sheet will auto-generate from them.</p>
        <button css={Shared.primaryBtn(C.accent)} style={{ width: 'auto', padding: '0.75rem 1.5rem', margin: '0 auto' }}
          onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </>
  )

  const byCategory: Record<string, typeof masteredQuestions> = {}
  masteredQuestions.forEach(q => { if (!byCategory[q.cat]) byCategory[q.cat] = []; byCategory[q.cat].push(q) })

  return (
    <>
      <div className="print:hidden">
        <Navbar />
        <div css={[Shared.pageWrapperWide, { paddingBottom: '1rem' }]}>
          <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <button css={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: C.muted, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => router.push('/dashboard')}>
              <ChevronLeft size={16} /> Back
            </button>
            <button css={S.printBtn} onClick={() => window.print()}>
              <Printer size={15} /> Print / Save PDF
            </button>
          </div>
          <div css={Shared.infoBox(C.accent)}>
            <span css={{ fontSize: '1.5rem' }}>💡</span>
            <div>
              <p css={{ fontSize: '0.875rem', fontWeight: 700 }}>Your personalized cheat sheet</p>
              <p css={{ fontSize: '0.75rem', color: C.muted }}>Shows your {masteredQuestions.length} mastered questions. Click "Print / Save PDF" → choose "Save as PDF".</p>
            </div>
          </div>
        </div>
      </div>

      <div css={Shared.pageWrapperWide}>
        <style>{`
          @media print {
            @page { size: A4; margin: 15mm; }
            body { background: white !important; color: black !important; }
            .print\\:hidden { display: none !important; }
          }
        `}</style>

        <div css={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: `2px solid ${C.accent}` }}>
          <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 css={{ fontSize: '1.875rem', fontWeight: 900 }}>JavaScript Interview</h1>
              <h2 css={{ fontSize: '1.25rem', fontWeight: 700, color: C.accent }}>Cheat Sheet</h2>
            </div>
            <div css={{ textAlign: 'right' }}>
              <p css={{ fontSize: '0.875rem', color: C.muted }}>{user.displayName}</p>
              <p css={{ fontSize: '0.75rem', color: C.muted }}>{masteredQuestions.length} mastered concepts</p>
              <p css={{ fontSize: '0.75rem', color: C.muted }}>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div css={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {Object.entries(byCategory).map(([cat, qs]) => (
            <div key={cat} css={[Shared.card, { padding: '0.75rem' }]}>
              <div css={{ fontSize: '1.25rem', fontWeight: 900, color: C.accent }}>{qs.length}</div>
              <div css={{ fontSize: '0.625rem', color: C.muted, lineHeight: 1.4 }}>{cat}</div>
            </div>
          ))}
        </div>

        {Object.entries(byCategory).map(([cat, qs]) => (
          <div key={cat} css={S.categorySection}>
            <h3 css={S.categoryTitle}>{cat}</h3>
            {qs.map((q, i) => (
              <div key={q.id} css={[S.questionItem, i < qs.length - 1 ? { marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${C.border}` } : {}]}>
                <div css={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span css={{ fontFamily: 'monospace', fontSize: '0.75rem', color: C.accent, background: `${C.accent}1a`, border: `1px solid ${C.accent}33`, padding: '0.125rem 0.5rem', borderRadius: '0.375rem', flexShrink: 0 }}>
                    Q{String(q.id + 1).padStart(2, '0')}
                  </span>
                  <p css={S.questionText}>{q.q}</p>
                </div>
                <div css={[S.answerText, { marginLeft: '2.5rem' }]} dangerouslySetInnerHTML={{ __html: q.answer }} />
              </div>
            ))}
          </div>
        ))}

        <div css={{ marginTop: '2.5rem', paddingTop: '1rem', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          <p css={{ fontSize: '0.75rem', color: C.muted }}>Generated by JSPrep Pro · jsprep-pro.vercel.app · Good luck! 🚀</p>
        </div>
      </div>
    </>
  )
}
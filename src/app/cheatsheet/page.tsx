'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { questions } from '@/data/questions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { ChevronLeft, Printer, Download } from 'lucide-react'

export default function CheatSheetPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])

  if (loading || !user || !progress) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!progress.isPro) return (
    <>
      <Navbar />
      <PaywallBanner reason="Cheat Sheet Generator is a Pro feature. Upgrade to generate your personalized PDF!" />
    </>
  )

  const masteredQuestions = questions.filter(q => progress.masteredIds.includes(q.id))

  function handlePrint() {
    window.print()
  }

  if (masteredQuestions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-2xl font-black mb-3">No mastered questions yet</h2>
          <p className="text-muted mb-6">Go mark some questions as mastered in the dashboard first — your cheat sheet will auto-generate from them.</p>
          <button onClick={() => router.push('/dashboard')}
            className="bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Go to Dashboard
          </button>
        </div>
      </>
    )
  }

  // Group by category
  const byCategory: Record<string, typeof masteredQuestions> = {}
  masteredQuestions.forEach(q => {
    if (!byCategory[q.cat]) byCategory[q.cat] = []
    byCategory[q.cat].push(q)
  })

  return (
    <>
      {/* Screen nav - hidden on print */}
      <div className="print:hidden">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1 text-muted text-sm hover:text-white transition-colors">
              <ChevronLeft size={16} /> Back
            </button>
            <div className="flex gap-3">
              <button onClick={handlePrint}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                <Printer size={15} /> Print / Save PDF
              </button>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold">Your personalized cheat sheet</p>
              <p className="text-xs text-muted">Shows only your {masteredQuestions.length} mastered questions. Click "Print / Save PDF" → choose "Save as PDF" in the print dialog.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Printable cheat sheet */}
      <div ref={printRef} className="max-w-4xl mx-auto px-4 pb-10 print:px-0 print:py-0 print:max-w-none">
        <style>{`
          @media print {
            @page { size: A4; margin: 15mm; }
            body { background: white !important; color: black !important; }
            .print\\:hidden { display: none !important; }
            pre { background: #f5f5f5 !important; border: 1px solid #ddd !important; color: #333 !important; font-size: 11px !important; }
            code { font-size: 11px !important; }
            .answer p, .answer li { color: #333 !important; font-size: 12px !important; }
            .answer strong { color: #000 !important; }
            .tip { background: #f0eeff !important; border-left: 3px solid #7c6af7 !important; color: #444 !important; }
          }
        `}</style>

        {/* Header */}
        <div className="mb-8 pb-4 border-b-2 border-accent print:border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black print:text-black">JavaScript Interview</h1>
              <h2 className="text-xl font-bold text-accent print:text-purple-700">Cheat Sheet</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted print:text-gray-500">{user.displayName}</p>
              <p className="text-xs text-muted print:text-gray-400">{masteredQuestions.length} mastered concepts</p>
              <p className="text-xs text-muted print:text-gray-400">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Mastery overview */}
        <div className="grid grid-cols-4 gap-3 mb-8 print:gap-2">
          {Object.entries(byCategory).map(([cat, qs]) => (
            <div key={cat} className="bg-card border border-border rounded-xl p-3 print:bg-gray-50 print:border-gray-200">
              <div className="text-lg font-black text-accent print:text-purple-700">{qs.length}</div>
              <div className="text-[10px] text-muted print:text-gray-500 leading-tight">{cat}</div>
            </div>
          ))}
        </div>

        {/* Questions by category */}
        {Object.entries(byCategory).map(([cat, qs]) => (
          <div key={cat} className="mb-8 print:mb-6">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border print:border-gray-300">
              <h3 className="text-lg font-black text-accent print:text-purple-700">{cat}</h3>
              <span className="text-xs text-muted print:text-gray-400">{qs.length} question{qs.length > 1 ? 's' : ''}</span>
            </div>
            {qs.map((q, i) => (
              <div key={q.id} className={'mb-6 print:mb-4 ' + (i < qs.length - 1 ? 'pb-6 border-b border-border/50 print:border-gray-200' : '')}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md flex-shrink-0 print:bg-purple-50 print:border-purple-200 print:text-purple-700">
                    Q{String(q.id + 1).padStart(2, '0')}
                  </span>
                  <p className="font-bold text-sm text-white print:text-black">{q.q}</p>
                </div>
                <div className="ml-10 answer text-sm" dangerouslySetInnerHTML={{ __html: q.answer }} />
              </div>
            ))}
          </div>
        ))}

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-border print:border-gray-300 text-center">
          <p className="text-xs text-muted print:text-gray-400">Generated by JSPrep Pro · jsprep-pro.vercel.app · Good luck! 🚀</p>
        </div>
      </div>
    </>
  )
}

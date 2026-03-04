'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { debugQuestions, DEBUG_CATEGORIES } from '@/data/debugQuestions'
import { markDebugSolved, markDebugRevealed } from '@/lib/userProgress'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { ChevronDown, Eye, RotateCcw, Bug, Lock, Zap, CheckCircle, AlertTriangle, Loader2, XCircle } from 'lucide-react'

type QuestionState = 'idle' | 'checking' | 'feedback' | 'revealed'

interface AIFeedback {
  correct: boolean
  score: number
  verdict: string
  whatTheyGotRight: string
  remainingIssues: string
  betterApproach: string | null
  hint: string
  explanation: string
}

const FREE_DEBUG_LIMIT = 5

const diffColor = {
  easy: 'bg-accent3/10 text-accent3 border-accent3/20',
  medium: 'bg-accent2/10 text-accent2 border-accent2/20',
  hard: 'bg-danger/10 text-danger border-danger/20',
}
const diffLabel = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }

const catColor: Record<string, string> = {
  'Async Bugs': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'Closure Traps': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'Event Loop Traps': 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  'Fix the Code': 'bg-accent3/10 text-accent3 border-accent3/20',
  "What's Wrong?": 'bg-danger/10 text-danger border-danger/20',
}

export default function DebugLabPage() {
  const { user, progress, loading, refreshProgress } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [userCode, setUserCode] = useState<Record<number, string>>({})
  const [states, setStates] = useState<Record<number, QuestionState>>({})
  const [feedback, setFeedback] = useState<Record<number, AIFeedback>>({})
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])

  if (loading || !user || !progress) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const solvedIds = new Set(progress.solvedDebugIds || [])
  const revealedIds = new Set(progress.revealedDebugIds || [])

  const filtered = activeCategory === 'All'
    ? debugQuestions
    : debugQuestions.filter(q => q.cat === activeCategory)

  const solvedCount = solvedIds.size
  const pct = Math.round((solvedIds.size / debugQuestions.length) * 100)

  function getCode(id: number, fallback: string) {
    return userCode[id] !== undefined ? userCode[id] : fallback
  }

  async function checkWithAI(q: typeof debugQuestions[0]) {
    const code = getCode(q.id, q.brokenCode)
    if (!code.trim() || code === q.brokenCode) {
      alert("Edit the code first before submitting!")
      return
    }
    setStates(prev => ({ ...prev, [q.id]: 'checking' }))
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'debugcheck',
          messages: [{ role: 'user', content: code }],
          context: {
            brokenCode: q.brokenCode,
            bugDescription: q.bugDescription,
            fixedCode: q.fixedCode,
            userFix: code,
          }
        })
      })
      const data = await res.json()
      const cleaned = data.text.replace(/```json|```/g, '').trim()
      const parsed: AIFeedback = JSON.parse(cleaned)
      setFeedback(prev => ({ ...prev, [q.id]: parsed }))
      setStates(prev => ({ ...prev, [q.id]: 'feedback' }))
      // Persist to Firestore
      if (parsed.correct && !!user) {
        await markDebugSolved(user.uid, q.id)
        await refreshProgress()
      }
    } catch (e) {
      console.error(e)
      setStates(prev => ({ ...prev, [q.id]: 'idle' }))
      alert('AI check failed — try again')
    }
  }

  async function reveal(id: number) {
    if (!user) return
    await markDebugRevealed(user.uid, id)
    await refreshProgress()
    setStates(prev => ({ ...prev, [id]: 'revealed' }))
  }

  function reset(id: number, fallback: string) {
    setUserCode(prev => ({ ...prev, [id]: fallback }))
    setStates(prev => ({ ...prev, [id]: 'idle' }))
    setFeedback(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  return (
    <>
      <Navbar />
      {showPaywall && (
        <PaywallBanner
          reason={`Free users get ${FREE_DEBUG_LIMIT} debug challenges. Upgrade for all ${debugQuestions.length} + AI checking!`}
          onClose={() => setShowPaywall(false)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-danger/20 border border-danger/30 flex items-center justify-center">
              <Bug size={18} className="text-danger" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Debug Lab</h1>
              <p className="text-muted text-xs">Find the bug → fix the code → AI checks your solution</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-danger to-accent2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-bold text-danger whitespace-nowrap">{solvedCount}/{debugQuestions.length} fixed</span>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {DEBUG_CATEGORIES.map(cat => {
              const count = debugQuestions.filter(q => q.cat === cat).length
              return (
                <span key={cat} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor[cat]}`}>
                  {cat} · {count}
                </span>
              )
            })}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {['All', ...DEBUG_CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ' +
                (activeCategory === cat ? 'bg-danger border-danger text-white' : 'border-border text-muted hover:border-danger/50 hover:text-white')}>
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-4">
          {filtered.map((q, idx) => {
            const isOpen = openId === q.id
            const state = solvedIds.has(q.id) ? 'feedback' : revealedIds.has(q.id) ? 'revealed' : (states[q.id] || 'idle')
            const fb = feedback[q.id]
            const isLocked = !progress.isPro && debugQuestions.indexOf(q) >= FREE_DEBUG_LIMIT
            const code = getCode(q.id, q.brokenCode)

            const borderClass = solvedIds.has(q.id) ? 'border-accent3/40' : state === 'feedback' ? 'border-danger/30' : 'border-border hover:border-danger/30'

            return (
              <div key={q.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${borderClass}`}>
                {/* Header */}
                <div className="flex items-start gap-3 p-5 cursor-pointer" onClick={() => setOpenId(isOpen ? null : q.id)}>
                  <span className="font-mono text-xs text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <p className="font-bold text-sm">{q.title}</p>
                      {isLocked && <Lock size={12} className="text-muted" />}
                      {(fb?.correct || solvedIds.has(q.id)) && <CheckCircle size={14} className="text-accent3" />}
                      {state === 'feedback' && !fb?.correct && <XCircle size={14} className="text-danger" />}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>{diffLabel[q.difficulty]}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor[q.cat]}`}>{q.cat}</span>
                      {q.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={'flex-shrink-0 transition-transform duration-300 ' + (isOpen ? 'rotate-180' : '')}>
                    <ChevronDown size={16} className="text-muted" />
                  </div>
                </div>

                {/* Body */}
                {isOpen && (
                  <div className="border-t border-border">
                    <div className="px-5 pt-5 pb-3">
                      <div className="flex items-start gap-2 bg-danger/10 border border-danger/20 rounded-xl p-4">
                        <AlertTriangle size={14} className="text-danger flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#e8c8c8] leading-relaxed">{q.description}</p>
                      </div>
                    </div>

                    {isLocked ? (
                      <div className="px-5 pb-5">
                        <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl">
                          <Lock size={14} className="text-muted" />
                          <span className="text-sm text-muted flex-1">Pro feature — upgrade to access all debug challenges</span>
                          <button onClick={() => setShowPaywall(true)}
                            className="text-xs font-bold text-accent border border-accent/30 px-3 py-1 rounded-lg hover:bg-accent/10 transition-colors flex items-center gap-1">
                            <Zap size={11} /> Upgrade
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="px-5 pb-5 flex flex-col gap-4">
                        {/* Broken code */}
                        <div>
                          <p className="text-xs font-bold text-danger uppercase tracking-widest mb-2">🔴 Broken Code</p>
                          <pre className="!mt-0 !border-danger/30 text-[11px] overflow-auto max-h-52"><code>{q.brokenCode}</code></pre>
                        </div>

                        {/* Editable fix area */}
                        <div>
                          <p className="text-xs font-bold text-accent3 uppercase tracking-widest mb-2">
                            ✏️ Your Fix <span className="normal-case font-normal text-muted">— edit the broken code to fix the bug</span>
                          </p>
                          <textarea
                            value={code}
                            onChange={e => setUserCode(prev => ({ ...prev, [q.id]: e.target.value }))}
                            disabled={state === 'checking'}
                            rows={Math.max(6, code.split('\n').length + 1)}
                            spellCheck={false}
                            className={'w-full bg-[#0a0a12] border rounded-xl px-4 py-3 font-mono text-xs text-white outline-none resize-none transition-colors ' +
                              (fb?.correct ? 'border-accent3/50' : state === 'feedback' ? 'border-danger/40' : 'border-accent3/30 focus:border-accent3/60')}
                            style={{ lineHeight: '1.8' }}
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => checkWithAI(q)}
                            disabled={state === 'checking' || code === q.brokenCode}
                            className="flex-1 flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-40"
                          >
                            {state === 'checking'
                              ? <><Loader2 size={13} className="animate-spin" /> AI is checking...</>
                              : <><Zap size={13} /> Check with AI</>
                            }
                          </button>
                          <button onClick={() => reveal(q.id)}
                            className="px-4 border border-border text-muted hover:text-white hover:border-accent/30 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5">
                            <Eye size={13} /> Show Answer
                          </button>
                          {(state === 'feedback' || state === 'revealed') && (
                            <button onClick={() => reset(q.id, q.brokenCode)}
                              className="px-3 border border-border text-muted hover:text-white rounded-xl text-xs transition-all">
                              <RotateCcw size={13} />
                            </button>
                          )}
                        </div>

                        {/* AI Feedback */}
                        {state === 'feedback' && fb && (
                          <div className={'border rounded-2xl p-5 flex flex-col gap-4 ' + (fb.correct ? 'border-accent3/30 bg-accent3/5' : 'border-danger/20 bg-danger/5')}>
                            {/* Score header */}
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className={'text-3xl font-black ' + (fb.correct ? 'text-accent3' : fb.score >= 5 ? 'text-accent2' : 'text-danger')}>
                                  {fb.score}<span className="text-lg text-muted">/10</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className={'flex items-center gap-2 mb-1'}>
                                  {fb.correct
                                    ? <CheckCircle size={15} className="text-accent3" />
                                    : <XCircle size={15} className="text-danger" />}
                                  <p className="font-bold text-sm">{fb.verdict}</p>
                                </div>
                                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all"
                                    style={{ width: `${fb.score * 10}%`, background: fb.correct ? '#6af7c0' : fb.score >= 5 ? '#f7c76a' : '#f76a6a' }} />
                                </div>
                              </div>
                            </div>

                            {/* What they got right */}
                            <div className="bg-surface border border-border rounded-xl p-3">
                              <p className="text-xs font-bold text-accent3 mb-1">✓ What you got right</p>
                              <p className="text-xs text-[#c8c8d8]">{fb.whatTheyGotRight}</p>
                            </div>

                            {/* Remaining issues */}
                            {fb.remainingIssues !== 'None' && (
                              <div className="bg-surface border border-border rounded-xl p-3">
                                <p className="text-xs font-bold text-danger mb-1">✗ Still needs fixing</p>
                                <p className="text-xs text-[#c8c8d8]">{fb.remainingIssues}</p>
                              </div>
                            )}

                            {/* Hint if wrong */}
                            {!fb.correct && fb.hint && (
                              <div className="bg-accent2/10 border border-accent2/20 rounded-xl p-3">
                                <p className="text-xs font-bold text-accent2 mb-1">💡 Hint</p>
                                <p className="text-xs text-[#c8c8d8]">{fb.hint}</p>
                              </div>
                            )}

                            {/* Better approach */}
                            {fb.betterApproach && (
                              <div className="bg-surface border border-border rounded-xl p-3">
                                <p className="text-xs font-bold text-accent mb-1">⚡ Better approach</p>
                                <p className="text-xs text-[#c8c8d8]">{fb.betterApproach}</p>
                              </div>
                            )}

                            {/* Explanation */}
                            <div className="bg-surface border border-border rounded-xl p-3">
                              <p className="text-xs font-bold text-muted mb-1">📖 Explanation</p>
                              <p className="text-xs text-[#c8c8d8] leading-relaxed">{fb.explanation}</p>
                            </div>

                            {/* Try again if wrong */}
                            {!fb.correct && (
                              <button
                                onClick={() => setStates(prev => ({ ...prev, [q.id]: 'idle' }))}
                                className="w-full bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent font-bold py-2 rounded-xl text-xs transition-all">
                                Try Again
                              </button>
                            )}
                          </div>
                        )}

                        {/* Revealed answer */}
                        {state === 'revealed' && (
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-bold text-danger mb-2">❌ Broken</p>
                                <pre className="!mt-0 text-[11px] h-52 overflow-auto"><code>{q.brokenCode}</code></pre>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-accent3 mb-2">✅ Fixed</p>
                                <pre className="!mt-0 text-[11px] h-52 overflow-auto !border-accent3/30"><code className="text-accent3">{q.fixedCode}</code></pre>
                              </div>
                            </div>
                            <div className="bg-surface border border-border rounded-xl p-4">
                              <p className="text-xs font-bold text-danger mb-2">🐛 The Bug</p>
                              <p className="text-xs text-[#c8c8d8] mb-3">{q.bugDescription}</p>
                              <p className="text-xs font-bold text-accent mb-2">💡 Explanation</p>
                              <p className="text-xs text-[#c8c8d8] mb-3">{q.explanation}</p>
                              <p className="text-xs font-bold text-accent2 mb-1">⚡ Key Insight</p>
                              <p className="text-xs text-[#c8c8d8]">{q.keyInsight}</p>
                            </div>
                          </div>
                        )}
                      </div>
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
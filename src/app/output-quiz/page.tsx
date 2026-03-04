'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { outputQuestions, OUTPUT_CATEGORIES, FREE_OUTPUT_LIMIT } from '@/data/outputQuestions'
import { markOutputSolved, markOutputRevealed } from '@/lib/userProgress'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { CheckCircle, XCircle, ChevronDown, Lightbulb, Lock, Zap, Code2, Eye } from 'lucide-react'

type AnswerState = 'idle' | 'correct' | 'wrong' | 'revealed'

const diffColor = {
  easy: 'bg-accent3/10 text-accent3 border-accent3/20',
  medium: 'bg-accent2/10 text-accent2 border-accent2/20',
  hard: 'bg-danger/10 text-danger border-danger/20',
}
const diffLabel = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }

export default function OutputQuizPage() {
  const { user, progress, loading, refreshProgress } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [localWrong, setLocalWrong] = useState<Set<number>>(new Set())
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])

  if (loading || !user || !progress) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const solvedIds = new Set(progress.solvedOutputIds || [])
  const revealedIds = new Set(progress.revealedOutputIds || [])

  const filtered = activeCategory === 'All'
    ? outputQuestions
    : outputQuestions.filter(q => q.cat === activeCategory)

  function getState(id: number): AnswerState {
    if (solvedIds.has(id)) return 'correct'
    if (revealedIds.has(id)) return 'revealed'
    if (localWrong.has(id)) return 'wrong'
    return 'idle'
  }

  async function checkAnswer(q: typeof outputQuestions[0]) {
    const idx = outputQuestions.indexOf(q)
    if (!progress?.isPro && idx >= FREE_OUTPUT_LIMIT) { setShowPaywall(true); return }
    const userAnswer = (userAnswers[q.id] || '').trim().toLowerCase().replace(/\s+/g, '\n').trim()
    const correct = q.answer.toLowerCase().trim()
      const isCorrect = userAnswer === correct ||
        userAnswer.split('\n').join(',') === correct.split('\n').join(',')

    if (isCorrect && !!user) {
      await markOutputSolved(user.uid, q.id)
      await refreshProgress()
      setLocalWrong(prev => { const n = new Set(prev); n.delete(q.id); return n })
    } else {
      setLocalWrong(prev => new Set(prev).add(q.id))
    }
  }

  async function reveal(q: typeof outputQuestions[0]) {
    if (!solvedIds.has(q.id) && !!user) {
      await markOutputRevealed(user.uid, q.id)
      await refreshProgress()
    }
    setLocalWrong(prev => { const n = new Set(prev); n.delete(q.id); return n })
  }

  function reset(id: number) {
    setUserAnswers(prev => ({ ...prev, [id]: '' }))
    setLocalWrong(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const totalSolved = solvedIds.size
  const pct = Math.round((totalSolved / outputQuestions.length) * 100)

  return (
    <>
      <Navbar />
      {showPaywall && (
        <PaywallBanner
          reason={`Free users can attempt the first ${FREE_OUTPUT_LIMIT} output questions. Upgrade for all ${outputQuestions.length}!`}
          onClose={() => setShowPaywall(false)}
        />
      )}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent2/20 border border-accent2/30 flex items-center justify-center">
              <Code2 size={18} className="text-accent2" />
            </div>
            <div>
              <h1 className="text-2xl font-black">What's the Output?</h1>
              <p className="text-muted text-xs">Read the code → predict the output → progress saved automatically</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent2 to-accent3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-bold text-accent2 whitespace-nowrap">{totalSolved}/{outputQuestions.length} solved</span>
          </div>
          <div className="flex gap-3 mt-3">
            {(['easy', 'medium', 'hard'] as const).map(d => {
              const total = outputQuestions.filter(q => q.difficulty === d).length
              const solved = outputQuestions.filter(q => q.difficulty === d && solvedIds.has(q.id)).length
              return (
                <div key={d} className="flex items-center gap-1.5 text-xs">
                  <span className={`px-2 py-0.5 rounded-full border font-bold ${diffColor[d]}`}>{diffLabel[d]}</span>
                  <span className="text-muted">{solved}/{total}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {['All', ...OUTPUT_CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ' +
                (activeCategory === cat ? 'bg-accent2 border-accent2 text-white' : 'border-border text-muted hover:border-accent2/50 hover:text-white')}>
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-4">
          {filtered.map((q, idx) => {
            const state = getState(q.id)
            const isOpen = openId === q.id
            const isLocked = !progress.isPro && outputQuestions.indexOf(q) >= FREE_OUTPUT_LIMIT
            const bgClass = state === 'correct' ? 'border-accent3/40 bg-accent3/5' : state === 'wrong' ? 'border-danger/30' : 'border-border hover:border-accent2/30'

            return (
              <div key={q.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${bgClass}`}>
                <div className="flex items-start gap-3 p-5 cursor-pointer" onClick={() => setOpenId(isOpen ? null : q.id)}>
                  <span className="font-mono text-xs text-accent2 bg-accent2/10 border border-accent2/20 px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm">{q.title}</p>
                      {isLocked && <Lock size={12} className="text-muted" />}
                      {state === 'correct' && <CheckCircle size={14} className="text-accent3" />}
                      {state === 'revealed' && <Eye size={14} className="text-accent2" />}
                      {state === 'wrong' && <XCircle size={14} className="text-danger" />}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>{diffLabel[q.difficulty]}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent/20 bg-accent/10 text-accent/80">{q.cat}</span>
                      {q.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted">{t}</span>)}
                    </div>
                  </div>
                  <div className={'flex-shrink-0 transition-transform duration-300 ' + (isOpen ? 'rotate-180' : '')}>
                    <ChevronDown size={16} className="text-muted" />
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-border">
                    <div className="px-5 pt-5">
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Code</p>
                      <pre className="!mt-0 !mb-0 overflow-auto text-xs"><code>{q.code}</code></pre>
                    </div>

                    <div className="px-5 py-4">
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
                        Your prediction <span className="normal-case font-normal">(one output per line)</span>
                      </p>

                      {isLocked ? (
                        <div className="flex items-center gap-2 p-4 bg-surface border border-border rounded-xl">
                          <Lock size={14} className="text-muted" />
                          <span className="text-sm text-muted">Pro feature — upgrade to attempt this question</span>
                          <button onClick={() => setShowPaywall(true)}
                            className="ml-auto text-xs font-bold text-accent border border-accent/30 px-3 py-1 rounded-lg hover:bg-accent/10 transition-colors flex items-center gap-1">
                            <Zap size={11} /> Upgrade
                          </button>
                        </div>
                      ) : (
                        <>
                          <textarea
                            value={userAnswers[q.id] || ''}
                            onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            disabled={state === 'correct' || state === 'revealed'}
                            placeholder={'Type the expected output...\nOne value per line'}
                            rows={Math.max(3, q.answer.split('\n').length + 1)}
                            className={'w-full bg-surface border rounded-xl px-4 py-3 font-mono text-sm text-white placeholder:text-muted outline-none resize-none transition-colors ' +
                              (state === 'correct' ? 'border-accent3/50 cursor-not-allowed opacity-60' :
                                state === 'wrong' ? 'border-danger/50' :
                                  state === 'revealed' ? 'border-border cursor-not-allowed opacity-60' :
                                    'border-border focus:border-accent2/50')}
                          />

                          {state === 'idle' && (
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => checkAnswer(q)} disabled={!(userAnswers[q.id] || '').trim()}
                                className="flex-1 bg-accent2/20 hover:bg-accent2/30 border border-accent2/30 text-accent2 font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-40">
                                ✓ Check Answer
                              </button>
                              <button onClick={() => reveal(q)}
                                className="px-4 border border-border text-muted hover:text-white hover:border-accent/30 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center gap-1">
                                <Lightbulb size={12} /> Reveal
                              </button>
                            </div>
                          )}
                          {state === 'wrong' && (
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => checkAnswer(q)} disabled={!(userAnswers[q.id] || '').trim()}
                                className="flex-1 bg-danger/20 hover:bg-danger/30 border border-danger/30 text-danger font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-40">
                                Try Again
                              </button>
                              <button onClick={() => reveal(q)}
                                className="px-4 border border-border text-muted hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center gap-1">
                                <Lightbulb size={12} /> Show Answer
                              </button>
                            </div>
                          )}
                          {(state === 'correct' || state === 'revealed') && (
                            <button onClick={() => reset(q.id)} className="mt-3 text-xs text-muted hover:text-white underline transition-colors">
                              Reset
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {(state === 'correct' || state === 'wrong' || state === 'revealed') && (
                      <div className="px-5 pb-5">
                        <div className={'rounded-xl p-4 mb-3 border ' + (state === 'correct' ? 'bg-accent3/10 border-accent3/30' : 'bg-surface border-border')}>
                          <div className="flex items-center gap-2 mb-2">
                            {state === 'correct'
                              ? <><CheckCircle size={14} className="text-accent3" /><span className="text-xs font-bold text-accent3">Correct! 🎉</span></>
                              : <span className="text-xs font-bold text-muted">Expected Output:</span>}
                          </div>
                          <pre className="!mt-0 !mb-0 !bg-transparent !border-0 !p-0 font-mono text-xs text-accent3"><code>{q.answer}</code></pre>
                        </div>
                        <div className="bg-surface border border-border rounded-xl p-4">
                          <p className="text-xs font-bold text-accent mb-2">💡 Explanation</p>
                          <p className="text-xs text-[#c8c8d8] leading-relaxed whitespace-pre-line">{q.explanation}</p>
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs font-bold text-accent2 mb-1">⚡ Key Insight</p>
                            <p className="text-xs text-[#c8c8d8] leading-relaxed">{q.keyInsight}</p>
                          </div>
                        </div>
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
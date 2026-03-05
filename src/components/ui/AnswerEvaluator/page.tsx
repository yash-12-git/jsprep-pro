'use client'
import { useState } from 'react'
import { Loader2, Target, X, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

interface EvalResult {
  score: number
  grade: string
  verdict: string
  strengths: string[]
  missing: string[]
  betterAnswer: string
}

interface Props {
  question: string
  idealAnswer: string
  onClose: () => void
}

export default function AnswerEvaluator({ question, idealAnswer, onClose }: Props) {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EvalResult | null>(null)
  const [showBetter, setShowBetter] = useState(false)

  async function evaluate() {
    if (!answer.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'evaluate',
          messages: [{ role: 'user', content: answer }],
          context: {
            question,
            idealAnswer: idealAnswer.replace(/<[^>]*>/g, '')
          }
        })
      })
      const data = await res.json()
      const cleaned = data.text.replace(/```json|```/g, '').trim()
      setResult(JSON.parse(cleaned))
    } catch {
      alert('Evaluation failed — try again')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s: number) => s >= 8 ? 'text-accent3' : s >= 6 ? 'text-accent2' : s >= 4 ? 'text-orange-400' : 'text-danger'
  const gradeColor = (g: string) => ['A', 'B'].includes(g) ? 'text-accent3' : g === 'C' ? 'text-accent2' : 'text-danger'

  return (
    <div className="border-t border-border bg-[#0d0d16]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent2/20 flex items-center justify-center">
            <Target size={12} className="text-accent2" />
          </div>
          <span className="text-xs font-bold text-accent2">Answer Evaluator</span>
          <span className="text-xs text-muted">— Type your answer, get scored</span>
        </div>
        <button onClick={onClose} className="text-muted hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="px-5 py-4">
        {!result ? (
          <>
            <p className="text-xs text-muted mb-3">Answer this question as you would in a real interview:</p>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here... (explain the concept in your own words, include examples if you know them)"
              rows={5}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-xs text-white placeholder:text-muted outline-none focus:border-accent2/50 resize-none transition-colors"
            />
            <button
              onClick={evaluate}
              disabled={!answer.trim() || loading}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-accent2/20 hover:bg-accent2/30 border border-accent2/30 text-accent2 font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-40"
            >
              {loading ? <><Loader2 size={13} className="animate-spin" /> Evaluating...</> : <><Target size={13} /> Evaluate My Answer</>}
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Score header */}
            <div className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4">
              <div className="text-center">
                <div className={clsx('text-4xl font-black', scoreColor(result.score))}>{result.score}<span className="text-lg text-muted">/10</span></div>
                <div className={clsx('text-lg font-black', gradeColor(result.grade))}>{result.grade}</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{result.verdict}</p>
                <div className="h-2 bg-border rounded-full mt-2 overflow-hidden">
                  <div className={clsx('h-full rounded-full transition-all', scoreColor(result.score).replace('text-', 'bg-'))}
                    style={{ width: `${result.score * 10}%`, background: result.score >= 8 ? '#6af7c0' : result.score >= 6 ? '#f7c76a' : result.score >= 4 ? '#f97316' : '#f76a6a' }} />
                </div>
              </div>
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div>
                <p className="text-xs font-bold text-accent3 mb-2">✓ What you got right</p>
                <ul className="flex flex-col gap-1.5">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-[#c8c8d8] flex gap-2">
                      <span className="text-accent3 flex-shrink-0">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing */}
            {result.missing.length > 0 && (
              <div>
                <p className="text-xs font-bold text-danger mb-2">✗ What you missed</p>
                <ul className="flex flex-col gap-1.5">
                  {result.missing.map((m, i) => (
                    <li key={i} className="text-xs text-[#c8c8d8] flex gap-2">
                      <span className="text-danger flex-shrink-0">•</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Better answer toggle */}
            <button
              onClick={() => setShowBetter(!showBetter)}
              className="flex items-center gap-2 text-xs font-bold text-accent border border-accent/30 bg-accent/10 rounded-xl px-3 py-2 hover:bg-accent/20 transition-colors"
            >
              {showBetter ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showBetter ? 'Hide' : 'See'} ideal answer
            </button>
            {showBetter && (
              <p className="text-xs text-[#c8c8d8] bg-surface border border-border rounded-xl p-3 leading-relaxed">
                {result.betterAnswer}
              </p>
            )}

            <button
              onClick={() => { setResult(null); setAnswer('') }}
              className="text-xs text-muted hover:text-white underline transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

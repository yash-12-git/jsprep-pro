'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { saveQuizScore } from '@/lib/userProgress'
import { questions } from '@/data/questions'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { ChevronRight, RotateCcw, Trophy } from 'lucide-react'
import clsx from 'clsx'

type Phase = 'setup' | 'quiz' | 'result'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('setup')
  const [quizQuestions, setQuizQuestions] = useState(questions.slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<boolean[]>([])
  const [count, setCount] = useState(10)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  useEffect(() => {
    if (!timerActive) return
    if (timeLeft <= 0) { handleReveal(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive])

  if (loading || !user || !progress) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (!progress.isPro) {
    return (
      <>
        <Navbar />
        <PaywallBanner reason="Quiz mode is a Pro feature. Upgrade to test yourself with timed flashcards!" />
      </>
    )
  }

  function startQuiz() {
    const qs = shuffle(questions).slice(0, count)
    setQuizQuestions(qs)
    setCurrent(0)
    setScores([])
    setRevealed(false)
    setTimeLeft(30)
    setTimerActive(true)
    setPhase('quiz')
  }

  function handleReveal() {
    setTimerActive(false)
    setRevealed(true)
  }

  function handleAnswer(correct: boolean) {
    const newScores = [...scores, correct]
    setScores(newScores)
    if (current + 1 >= quizQuestions.length) {
      const total = quizQuestions.length
      const score = newScores.filter(Boolean).length
      saveQuizScore(user.uid, score, total)
      setPhase('result')
    } else {
      setCurrent(c => c + 1)
      setRevealed(false)
      setTimeLeft(30)
      setTimerActive(true)
    }
  }

  const finalScore = scores.filter(Boolean).length
  const pct = Math.round((finalScore / quizQuestions.length) * 100)

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Setup */}
        {phase === 'setup' && (
          <div className="text-center">
            <h1 className="text-3xl font-black mb-2">Quiz Mode</h1>
            <p className="text-muted mb-10">Test yourself with timed flashcards. Each question gives you 30 seconds to think before revealing the answer.</p>
            <div className="bg-card border border-border rounded-2xl p-8 mb-8">
              <p className="text-sm text-muted mb-4 font-semibold">How many questions?</p>
              <div className="flex justify-center gap-3">
                {[5, 10, 15, 21].map(n => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={clsx('w-14 h-14 rounded-xl font-black text-lg border-2 transition-all', count === n ? 'bg-accent border-accent text-white' : 'border-border text-muted hover:border-accent/50')}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={startQuiz}
              className="bg-accent hover:bg-accent/90 text-white font-black px-12 py-4 rounded-xl text-lg transition-colors"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* Quiz */}
        {phase === 'quiz' && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-muted text-sm font-semibold">{current + 1} / {quizQuestions.length}</span>
              <div className={clsx('font-mono font-black text-2xl tabular-nums', timeLeft <= 10 ? 'text-danger' : 'text-accent3')}>
                {String(timeLeft).padStart(2, '0')}s
              </div>
            </div>
            <div className="h-1.5 bg-surface rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent to-accent3 rounded-full transition-all" style={{ width: `${((current) / quizQuestions.length) * 100}%` }} />
            </div>

            {/* Card */}
            <div className="bg-card border-2 border-border rounded-2xl p-8 mb-6 min-h-[180px]">
              <div className="flex items-start gap-3 mb-4">
                <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">{quizQuestions[current].cat}</span>
              </div>
              <p className="text-xl font-bold leading-snug">{quizQuestions[current].q}</p>
              {!revealed && quizQuestions[current].hint && (
                <p className="text-muted text-sm mt-4 italic">💡 {quizQuestions[current].hint}</p>
              )}
            </div>

            {!revealed ? (
              <button
                onClick={handleReveal}
                className="w-full bg-surface border border-border hover:border-accent/50 text-white font-bold py-4 rounded-xl transition-all"
              >
                Reveal Answer
              </button>
            ) : (
              <div>
                <div className="bg-card border border-border rounded-2xl p-6 mb-5 answer" dangerouslySetInnerHTML={{ __html: quizQuestions[current].answer }} />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="py-3.5 rounded-xl font-bold border-2 border-danger/40 text-danger hover:bg-danger/10 transition-colors"
                  >
                    ✗ Didn't know
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="py-3.5 rounded-xl font-bold border-2 border-accent3/40 text-accent3 hover:bg-accent3/10 transition-colors"
                  >
                    ✓ Got it!
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {phase === 'result' && (
          <div className="text-center">
            <Trophy size={48} className="text-accent2 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-2">Quiz Complete!</h2>
            <p className="text-muted mb-8">Here's how you did</p>
            <div className="bg-card border border-border rounded-2xl p-8 mb-8">
              <div className="text-6xl font-black text-accent mb-2">{pct}%</div>
              <div className="text-muted mb-6">{finalScore} out of {quizQuestions.length} correct</div>
              <div className="flex justify-center gap-1">
                {scores.map((s, i) => (
                  <div key={i} className={clsx('w-3 h-8 rounded-full', s ? 'bg-accent3' : 'bg-danger/50')} />
                ))}
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setPhase('setup')}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <RotateCcw size={16} />
                Try Again
              </button>
              <button
                onClick={() => router.push('/analytics')}
                className="flex items-center gap-2 border border-border text-white font-bold px-6 py-3 rounded-xl hover:border-accent/50 transition-colors"
              >
                View Analytics
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

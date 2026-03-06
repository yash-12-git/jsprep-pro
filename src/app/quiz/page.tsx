/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions } from '@/hooks/useQuestions'
import { saveQuizScore } from '@/lib/userProgress'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner/page'
import { RotateCcw, Trophy, ChevronRight } from 'lucide-react'
import * as S from './styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import type { Question } from '@/types/question'

type Phase = 'setup' | 'quiz' | 'result'
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function QuizPage() {
  const { user, progress, loading: authLoading } = useAuth()
  const router = useRouter()

  // Load theory questions from Firestore
  const { questions, loading: qLoading } = useQuestions({
    type: 'theory',
    track: 'javascript',
    enabled: !!user,
  })

  const [phase, setPhase]           = useState<Phase>('setup')
  const [quizQuestions, setQuizQs]  = useState<Question[]>([])
  const [current, setCurrent]       = useState(0)
  const [revealed, setRevealed]     = useState(false)
  const [scores, setScores]         = useState<boolean[]>([])
  const [count, setCount]           = useState(10)
  const [timeLeft, setTimeLeft]     = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!timerActive) return
    if (timeLeft <= 0) { handleReveal(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive])

  if (authLoading || qLoading || !user || !progress) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )
  if (!progress.isPro) return (
    <><Navbar /><PaywallBanner reason="Quiz mode is a Pro feature. Upgrade to test yourself with timed flashcards!" /></>
  )

  function startQuiz() {
    const selected = shuffle(questions).slice(0, Math.min(count, questions.length))
    setQuizQs(selected)
    setCurrent(0); setScores([]); setRevealed(false)
    setTimeLeft(30); setTimerActive(true); setPhase('quiz')
  }

  function handleReveal() { setTimerActive(false); setRevealed(true) }

  function handleAnswer(correct: boolean) {
    if (!user) return
    const newScores = [...scores, correct]
    setScores(newScores)
    if (current + 1 >= quizQuestions.length) {
      saveQuizScore(user.uid, newScores.filter(Boolean).length, quizQuestions.length)
      setPhase('result')
    } else {
      setCurrent(c => c + 1); setRevealed(false); setTimeLeft(30); setTimerActive(true)
    }
  }

  const finalScore = scores.filter(Boolean).length
  const pct = quizQuestions.length > 0 ? Math.round((finalScore / quizQuestions.length) * 100) : 0
  const q = quizQuestions[current]

  return (
    <>
      <Navbar />
      <div css={Shared.pageWrapper}>

        {phase === 'setup' && (
          <div css={{ textAlign: 'center' }}>
            <h1 css={{ fontSize:'1.875rem', fontWeight:900, marginBottom:'0.5rem' }}>Quiz Mode</h1>
            <p css={{ color:C.muted, marginBottom:'2.5rem' }}>
              Test yourself with timed flashcards. 30 seconds per question.
            </p>
            <div css={[Shared.card, { padding:'2rem', marginBottom:'2rem' }]}>
              <p css={{ fontSize:'0.875rem', color:C.muted, marginBottom:'1rem', fontWeight:600 }}>
                How many questions?
              </p>
              <div css={{ display:'flex', justifyContent:'center', gap:'0.75rem' }}>
                {[5, 10, 15, Math.min(20, questions.length)].filter((n,i,a) => a.indexOf(n) === i).map(n => (
                  <button key={n} onClick={() => setCount(n)} css={{
                    width:'3.5rem', height:'3.5rem', borderRadius:'0.75rem',
                    fontWeight:900, fontSize:'1.125rem',
                    border:`2px solid ${count === n ? C.accent : C.border}`,
                    background: count === n ? C.accent : 'transparent',
                    color: count === n ? 'white' : C.muted, cursor:'pointer',
                  }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <button css={Shared.primaryBtn(C.accent)} onClick={startQuiz}
              style={{ padding:'1rem', fontSize:'1rem' }}>
              Start Quiz
            </button>
          </div>
        )}

        {phase === 'quiz' && q && (
          <div>
            <div css={S.header}>
              <span css={S.questionCounter}>{current + 1} / {quizQuestions.length}</span>
              <div css={S.timerBox}>
                <span css={S.timerText(timeLeft <= 10)}>{String(timeLeft).padStart(2, '0')}s</span>
              </div>
            </div>
            <div css={[Shared.progressBarTrack, { marginBottom:'2rem' }]}>
              <div css={Shared.progressBarFill((current / quizQuestions.length) * 100)} />
            </div>

            <div css={[Shared.card, { padding:'2rem', marginBottom:'1.5rem', minHeight:'11rem', border:`2px solid ${C.border}` }]}>
              <div css={{ marginBottom:'1rem' }}>
                <span css={Shared.diffBadge('medium')}>{q.category}</span>
              </div>
              <p css={S.questionText}>{q.title}</p>
              {!revealed && q.hint && (
                <p css={{ color:C.muted, fontSize:'0.875rem', marginTop:'1rem', fontStyle:'italic' }}>
                  💡 {q.hint}
                </p>
              )}
            </div>

            {!revealed ? (
              <button css={[Shared.ghostBtn, { width:'100%', padding:'1rem' }]} onClick={handleReveal}>
                Reveal Answer
              </button>
            ) : (
              <div>
                <div css={[Shared.card, { padding:'1.5rem', marginBottom:'1.25rem' }]}
                  dangerouslySetInnerHTML={{ __html: q.answer }} />
                <div css={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <button css={S.option('wrong')} onClick={() => handleAnswer(false)}>✗ Didn't know</button>
                  <button css={S.option('correct')} onClick={() => handleAnswer(true)}>✓ Got it!</button>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 'result' && (
          <div css={S.resultsCard}>
            <Trophy size={48} color={C.accent2} css={{ margin:'0 auto 1rem' }} />
            <h2 css={{ fontSize:'1.875rem', fontWeight:900, marginBottom:'0.5rem' }}>Quiz Complete!</h2>
            <p css={{ color:C.muted, marginBottom:'2rem' }}>Here's how you did</p>
            <div css={S.bigScore}>{pct}%</div>
            <p css={S.resultLabel}>{finalScore} out of {quizQuestions.length} correct</p>
            <div css={{ display:'flex', justifyContent:'center', gap:'0.25rem', marginBottom:'2rem' }}>
              {scores.map((s, i) => (
                <div key={i} css={{ width:'0.75rem', height:'2rem', borderRadius:'9999px',
                  background: s ? C.accent3 : `${C.danger}80` }} />
              ))}
            </div>
            <div css={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
              <button css={Shared.primaryBtn(C.accent)} style={{ width:'auto', padding:'0.75rem 1.5rem' }}
                onClick={() => setPhase('setup')}>
                <RotateCcw size={15} /> Try Again
              </button>
              <button css={Shared.ghostBtn} onClick={() => router.push('/analytics')}>
                View Analytics <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/layout/Navbar'
import PaywallBanner from '@/components/ui/PaywallBanner'
import { Send, Loader2, Mic, RotateCcw, ChevronLeft } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }
type Phase = 'intro' | 'interview' | 'done'

export default function MockInterviewPage() {
  const { user, progress, loading } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!loading && !user) router.push('/auth') }, [user, loading, router])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  if (loading || !user || !progress) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!progress.isPro) return (
    <>
      <Navbar />
      <PaywallBanner reason="AI Mock Interview is a Pro feature. Upgrade to practice with a real AI interviewer!" />
    </>
  )

  async function startInterview() {
    setPhase('interview')
    setAiLoading(true)
    setMessages([])
    setTurnCount(0)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mock',
          messages: [{ role: 'user', content: 'Start the interview.' }],
          context: {}
        })
      })
      const data = await res.json()
      setMessages([{ role: 'assistant', content: data.text }])
    } catch {
      setMessages([{ role: 'assistant', content: 'Sorry, failed to start. Please try again.' }])
    } finally {
      setAiLoading(false)
    }
  }

  async function sendAnswer() {
    if (!input.trim() || aiLoading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setAiLoading(true)
    const newTurn = turnCount + 1
    setTurnCount(newTurn)

    if (newTurn >= 8) {
      setPhase('done')
      setAiLoading(false)
      return
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mock', messages: newMessages, context: {} })
      })
      const data = await res.json()
      const reply: Message = { role: 'assistant', content: data.text }
      setMessages(prev => [...prev, reply])
      if (data.text.toLowerCase().includes('overall feedback') || data.text.toLowerCase().includes('wrap up')) {
        setPhase('done')
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error, please try again.' }])
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1 text-muted text-sm hover:text-white mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to Questions
        </button>

        {phase === 'intro' && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎤</div>
            <h1 className="text-3xl font-black mb-3">AI Mock Interview</h1>
            <p className="text-muted mb-8 max-w-md mx-auto leading-relaxed">
              A senior frontend engineer will interview you with real JavaScript questions, follow-ups, and edge cases — just like the actual thing. 8 exchanges, honest feedback at the end.
            </p>
            <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left">
              <p className="text-sm font-bold text-white mb-4">What to expect:</p>
              <ul className="flex flex-col gap-2">
                {[
                  '🎯 One question at a time — answer naturally in text',
                  '🔍 AI will probe deeper based on your answer',
                  '⚡ ~8 back-and-forth exchanges total',
                  '📊 Honest feedback at the end',
                  '💡 Tip: Answer like you would out loud in a real interview'
                ].map(tip => (
                  <li key={tip} className="text-sm text-muted">{tip}</li>
                ))}
              </ul>
            </div>
            <button onClick={startInterview}
              className="bg-accent hover:bg-accent/90 text-white font-black px-12 py-4 rounded-xl text-lg transition-colors">
              Start Interview
            </button>
          </div>
        )}

        {(phase === 'interview' || phase === 'done') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg">Mock Interview</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted font-mono">{turnCount}/8 turns</span>
                <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(turnCount / 8) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
              <div className="h-[420px] overflow-y-auto p-5 flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={'flex gap-3 ' + (msg.role === 'user' ? 'flex-row-reverse' : '')}>
                    <div className={'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black ' +
                      (msg.role === 'assistant' ? 'bg-accent text-white' : 'bg-surface border border-border text-muted')}>
                      {msg.role === 'assistant' ? 'AI' : 'You'}
                    </div>
                    <div className={'max-w-[80%] text-sm leading-relaxed rounded-2xl px-4 py-3 whitespace-pre-wrap ' +
                      (msg.role === 'assistant'
                        ? 'bg-surface border border-border text-[#c8c8d8] rounded-tl-sm'
                        : 'bg-accent/20 border border-accent/30 text-white rounded-tr-sm')}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-black text-white">AI</div>
                    <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 size={14} className="text-accent animate-spin" />
                      <span className="text-xs text-muted">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {phase === 'interview' && (
                <div className="border-t border-border p-4 flex gap-3">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer() } }}
                    placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                    rows={3}
                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted outline-none focus:border-accent/50 resize-none transition-colors"
                  />
                  <button onClick={sendAnswer} disabled={!input.trim() || aiLoading}
                    className="w-10 h-10 self-end rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-40 flex items-center justify-center transition-colors">
                    <Send size={15} className="text-white" />
                  </button>
                </div>
              )}
            </div>

            {phase === 'done' && (
              <div className="bg-card border border-accent3/30 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-black text-lg mb-2">Interview Complete!</p>
                <p className="text-muted text-sm mb-5">Check the AI feedback above. Ready to go again?</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setPhase('intro'); setMessages([]); setTurnCount(0) }}
                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
                    <RotateCcw size={14} /> Try Again
                  </button>
                  <button onClick={() => router.push('/study-plan')}
                    className="border border-border text-white font-bold px-6 py-2.5 rounded-xl hover:border-accent/50 transition-colors text-sm">
                    View Study Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

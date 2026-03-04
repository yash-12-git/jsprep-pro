'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react'
import clsx from 'clsx'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  question: string
  answer: string
  onClose: () => void
}

export default function AIChat({ question, answer, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI tutor for this question. Ask me anything — a simpler explanation, a real-world example, edge cases, or how this relates to React. What's on your mind?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'qa',
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context: { question, answer: answer.replace(/<[^>]*>/g, '') }
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }])
    } finally {
      setLoading(false)
    }
  }

  const quickPrompts = [
    'Explain it simpler',
    'Show a React example',
    'What are the edge cases?',
    'How is this tested in interviews?'
  ]

  return (
    <div className="border-t border-border bg-[#0d0d16]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
            <Sparkles size={12} className="text-accent" />
          </div>
          <span className="text-xs font-bold text-accent">AI Tutor</span>
          <span className="text-xs text-muted">— Ask anything about this question</span>
        </div>
        <button onClick={onClose} className="text-muted hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={clsx('flex gap-2.5', msg.role === 'user' && 'flex-row-reverse')}>
            <div className={clsx(
              'w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5',
              msg.role === 'assistant' ? 'bg-accent/20' : 'bg-surface border border-border'
            )}>
              {msg.role === 'assistant' ? <Bot size={12} className="text-accent" /> : <User size={12} className="text-muted" />}
            </div>
            <div className={clsx(
              'max-w-[80%] text-xs leading-relaxed rounded-xl px-3 py-2 whitespace-pre-wrap',
              msg.role === 'assistant'
                ? 'bg-surface border border-border text-[#c8c8d8]'
                : 'bg-accent/20 border border-accent/30 text-white'
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot size={12} className="text-accent" />
            </div>
            <div className="bg-surface border border-border rounded-xl px-3 py-2">
              <Loader2 size={12} className="text-accent animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 px-5 pb-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {quickPrompts.map(p => (
          <button
            key={p}
            onClick={() => { setInput(p); }}
            className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-border text-muted hover:border-accent/50 hover:text-white transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 px-5 pb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask a follow-up question..."
          className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs text-white placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-8 h-8 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send size={12} className="text-white" />
        </button>
      </div>
    </div>
  )
}

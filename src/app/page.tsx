'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import {
  Zap, BookOpen, Brain, BarChart2, Flame, Star, ArrowRight, CheckCircle,
  Code2, Bug, Mic, Target, FileText, Sparkles
} from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState(0)

  const stats = [
    { n: '81+', l: 'Questions' },
    { n: '3', l: 'Challenge Modes' },
    { n: '6', l: 'AI Features' },
    { n: '₹99', l: 'Pro / Month' },
  ]

  const modes = [
    {
      icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10 border-accent/20',
      label: '📖 Theory Questions', count: '21 questions',
      desc: 'Deep-dive explanations of closures, async, prototypes, event loop and more. With hints, code examples, and AI follow-up.',
      features: ['Detailed answers with code', 'Category filters', 'Mark as mastered', 'Bookmark for review'],
    },
    {
      icon: Code2, color: 'text-accent2', bg: 'bg-accent2/10 border-accent2/20',
      label: "💻 What's the Output?", count: '40 questions',
      desc: 'Read real JS snippets — predict the exact output. Covers event loop traps, closure bugs, type coercion weirdness.',
      features: ['Event loop & Promises', 'Closure traps', 'Type coercion edge cases', 'Hoisting surprises'],
    },
    {
      icon: Bug, color: 'text-danger', bg: 'bg-danger/10 border-danger/20',
      label: '🐛 Debug Lab', count: '20 challenges',
      desc: 'Find and fix real bugs in broken code. AI checks your solution, scores it 1–10, and explains what you missed.',
      features: ['Async bugs', 'Closure traps', 'React stale closures', 'AI-powered checking'],
    },
  ]

  const aiFeatures = [
    { icon: Sparkles, title: 'AI Tutor', desc: 'Ask follow-ups on any question. Get simpler explanations, real-world examples, edge cases.', color: 'text-accent' },
    { icon: Target, title: 'Answer Evaluator', desc: 'Type your answer, AI scores it 1-10, tells you what you nailed and what you missed.', color: 'text-accent2' },
    { icon: Bug, title: 'AI Code Checker', desc: 'Fix the broken code, AI validates your solution and suggests improvements.', color: 'text-danger' },
    { icon: Mic, title: 'Mock Interviewer', desc: 'Full back-and-forth with an AI senior engineer. Probes, follow-ups, honest feedback at the end.', color: 'text-purple-400' },
    { icon: Brain, title: 'AI Study Plan', desc: 'Analyzes your weak spots and generates a personalized day-by-day prep roadmap.', color: 'text-orange-400' },
    { icon: FileText, title: 'Cheat Sheet', desc: 'Auto-generates a printable PDF of all your mastered concepts for last-minute review.', color: 'text-accent3' },
  ]

  const proFeatures = [
    'Everything in Free',
    'All 40 output questions',
    'All 20 debug challenges',
    'Unlimited mastery tracking',
    'Bookmarks + cloud sync',
    'Timed quiz / flashcard mode',
    'AI Tutor on every question',
    'AI Answer Evaluator',
    'AI Code Checker (Debug Lab)',
    'AI Mock Interviewer',
    'AI Study Plan generator',
    'Cheat Sheet PDF generator',
    'Full progress analytics',
    'Daily streak tracking',
    'All future content',
  ]

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed w-[700px] h-[700px] rounded-full bg-accent/5 blur-3xl top-[-200px] left-[-200px] pointer-events-none" />
      <div className="fixed w-[500px] h-[500px] rounded-full bg-accent3/5 blur-3xl bottom-[-100px] right-[-100px] pointer-events-none" />
      <div className="fixed w-[300px] h-[300px] rounded-full bg-accent2/5 blur-3xl top-[40%] left-[50%] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-20 relative z-10">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
            <Zap size={12} /> For 1-3 Year Frontend Developers
          </div>
          <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6">
            The Only JS Interview<br />
            <span className="text-accent">Prep You Need</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-4">
            81+ curated questions across 3 modes — theory, output prediction, and live debugging. With 6 AI features built in.
          </p>
          <p className="text-muted/60 text-sm mb-10">
            Not just MCQs. Not just flashcards. The closest thing to a real interview that exists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth" className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-black px-10 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-lg shadow-accent/25">
              Start Free — No Card Needed <ArrowRight size={18} />
            </Link>
            <a href="#pricing" className="text-muted text-sm hover:text-white transition-colors underline underline-offset-4">See pricing</a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-24">
          {stats.map(({ n, l }) => (
            <div key={l} className="text-center bg-surface border border-border rounded-2xl p-6">
              <div className="text-3xl font-black text-accent2 mb-1">{n}</div>
              <div className="text-muted text-xs uppercase tracking-widest font-semibold">{l}</div>
            </div>
          ))}
        </div>

        {/* 3 Modes */}
        <div className="mb-24">
          <div className="text-center mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-accent">3 Challenge Modes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">One platform, three ways to test yourself</h2>
          <p className="text-muted text-center text-sm mb-12 max-w-lg mx-auto">Most prep sites only have theory questions. Real interviews test all three.</p>

          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {modes.map((m, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={'px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ' +
                  (activeTab === i ? m.bg + ' ' + m.color + ' border-current' : 'border-border text-muted hover:text-white')}>
                {m.label}
              </button>
            ))}
          </div>

          {modes.map((m, i) => activeTab === i && (
            <div key={i} className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className={'w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ' + m.bg}>
                  <m.icon size={22} className={m.color} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-xl">{m.label}</h3>
                    <span className={'text-xs font-bold px-2 py-0.5 rounded-full border ' + m.bg + ' ' + m.color}>{m.count}</span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {m.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#c8c8d8]">
                    <CheckCircle size={13} className={m.color} />{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Features */}
        <div className="mb-24">
          <div className="text-center mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-accent2">6 AI Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">Your AI interview coach, built in</h2>
          <p className="text-muted text-center text-sm mb-12 max-w-lg mx-auto">Not a chatbot you switch to. AI is woven into every part of your prep.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiFeatures.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={15} className={color} />
                  </div>
                  <h3 className="font-bold text-sm">{title}</h3>
                  <span className="ml-auto text-[9px] bg-accent2/15 text-accent2 px-1.5 py-0.5 rounded font-black">PRO</span>
                </div>
                <p className="text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-24">
          <h2 className="text-2xl font-black text-center mb-8">Why devs switch to JSPrep Pro</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '📖', label: 'Theory', before: 'Read definitions on MDN', after: 'Understand with AI explanations + code' },
              { icon: '💻', label: 'Output Questions', before: 'Get surprised in interviews', after: 'Predict output confidently beforehand' },
              { icon: '🐛', label: 'Debug Challenges', before: 'Never practiced fixing bugs', after: 'AI-scored real bug fixing practice' },
            ].map(({ icon, label, before, after }) => (
              <div key={label}>
                <div className="text-2xl mb-3">{icon}</div>
                <p className="text-xs font-black uppercase tracking-widest text-muted mb-3">{label}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-xs text-muted/70">
                    <span className="text-danger mt-0.5 flex-shrink-0">✗</span>{before}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#c8c8d8]">
                    <span className="text-accent3 mt-0.5 flex-shrink-0">✓</span>{after}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20" id="pricing">
          <div className="text-center mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-accent3">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-12">Simple, transparent pricing</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

            {/* Free */}
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
              <div className="text-xl font-black mb-1">Free</div>
              <div className="text-4xl font-black text-white mb-2">₹0</div>
              <p className="text-muted text-xs mb-6">Forever free, no card needed</p>
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {['All 21 theory questions viewable', 'First 5 output questions', 'First 5 debug challenges', 'Mark up to 5 as mastered', 'Google sign-in'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle size={13} className="text-accent3 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth" className="block text-center border border-border rounded-xl py-3 text-sm font-bold hover:border-accent/50 transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-card border-2 border-accent rounded-2xl p-8 relative overflow-hidden flex flex-col">
              <div className="absolute top-4 right-4 bg-accent text-white text-[10px] font-black px-2.5 py-1 rounded-lg">POPULAR</div>
              <div className="text-xl font-black mb-1 text-accent">Pro</div>
              <div className="text-4xl font-black text-white mb-1">
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 99}
                <span className="text-muted text-base font-normal"> /month</span>
              </div>
              <p className="text-muted text-xs mb-6">Less than a coffee. Cancel anytime.</p>
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white">
                    <CheckCircle size={13} className="text-accent flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth" className="block text-center bg-accent hover:bg-accent/90 text-white rounded-xl py-3 text-sm font-black transition-all hover:scale-[1.02] shadow-lg shadow-accent/20">
                Start with Pro →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-card border border-border rounded-2xl p-12 mb-12">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-black mb-3">Ready to land your next JS role?</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">Join developers who prep smarter, not just harder.</p>
          <Link href="/auth" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-black px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-accent/25">
            Start for Free <ArrowRight size={18} />
          </Link>
        </div>

        <div className="text-center text-muted text-xs">
          © 2026 JSPrep Pro · Built for frontend developers
        </div>
      </div>
    </main>
  )
}
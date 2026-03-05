'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import {
  Zap, BookOpen, Brain, ArrowRight, CheckCircle,
  Code2, Bug, Mic, Target, FileText, Sparkles
} from 'lucide-react'
import { proFeatures } from '@/data/proBenefits'

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
      label: '📖 Theory', count: '21 questions',
      desc: 'Deep-dive explanations of closures, async, prototypes and event loop with hints, code examples, and AI follow-up.',
      features: ['Detailed answers + code', 'Category filters', 'Mark as mastered', 'Bookmark for review'],
    },
    {
      icon: Code2, color: 'text-accent2', bg: 'bg-accent2/10 border-accent2/20',
      label: "💻 Output Quiz", count: '40 questions',
      desc: 'Read real JS snippets — predict the exact output. Event loop traps, closure bugs, type coercion weirdness.',
      features: ['Event loop & Promises', 'Closure traps', 'Type coercion', 'Hoisting surprises'],
    },
    {
      icon: Bug, color: 'text-danger', bg: 'bg-danger/10 border-danger/20',
      label: '🐛 Debug Lab', count: '20 challenges',
      desc: 'Find and fix real bugs in broken code. AI checks your solution, scores it 1–10, explains what you missed.',
      features: ['Async bugs', 'Closure traps', 'React stale closures', 'AI-powered checking'],
    },
  ]

  const aiFeatures = [
    { icon: Sparkles, title: 'AI Tutor', desc: 'Ask follow-ups on any question. Simpler explanations, real examples, edge cases.', color: 'text-accent' },
    { icon: Target, title: 'Answer Evaluator', desc: 'Type your answer, AI scores 1-10 and tells you exactly what you missed.', color: 'text-accent2' },
    { icon: Bug, title: 'Code Checker', desc: 'Fix broken code, AI validates your fix and suggests a cleaner approach.', color: 'text-danger' },
    { icon: Mic, title: 'Mock Interviewer', desc: 'Full back-and-forth with an AI senior engineer. Probes, follow-ups, honest feedback.', color: 'text-purple-400' },
    { icon: Brain, title: 'Study Plan', desc: 'Analyzes your weak spots, generates a personalized day-by-day prep roadmap.', color: 'text-orange-400' },
    { icon: FileText, title: 'Cheat Sheet PDF', desc: 'Printable PDF of all your mastered concepts. Perfect for last-minute review.', color: 'text-accent3' },
  ]


  return (
    <main className="relative min-h-screen">
      {/* Glows — reduced on mobile */}
      <div className="fixed w-64 h-64 sm:w-[600px] sm:h-[600px] rounded-full bg-accent/5 blur-3xl top-[-50px] left-[-50px] sm:top-[-100px] sm:left-[-100px] pointer-events-none" />
      <div className="fixed w-48 h-48 sm:w-[400px] sm:h-[400px] rounded-full bg-accent3/5 blur-3xl bottom-0 right-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">

        {/* ── HERO ───────────────────────────────────────────── */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 tracking-widest uppercase">
            <Zap size={11} /> For 1–3 Year Frontend Devs
          </div>

          <h1 className="text-[2rem] leading-[1.15] sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 px-2">
            The Only JS Interview <span className="text-accent">Prep You Need</span>
          </h1>

          <p className="text-muted text-sm sm:text-lg max-w-xl mx-auto mb-3 px-4">
            81+ questions across 3 modes — theory, output prediction, and debugging. With 6 AI features.
          </p>
          <p className="text-muted/60 text-xs sm:text-sm mb-8 sm:mb-10">
            Not just MCQs. The closest thing to a real interview.
          </p>

          <div className="flex flex-col gap-3 items-center">
            <Link href="/auth"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-black px-8 py-4 rounded-xl text-sm sm:text-base transition-all active:scale-95 shadow-lg shadow-accent/25">
              Start Free — No Card Needed <ArrowRight size={16} />
            </Link>
            <a href="#pricing" className="text-muted text-xs hover:text-white transition-colors underline underline-offset-4">
              See pricing
            </a>
          </div>
        </div>

        {/* ── STATS ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-24">
          {stats.map(({ n, l }) => (
            <div key={l} className="text-center bg-surface border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-black text-accent2 mb-1">{n}</div>
              <div className="text-muted text-[10px] sm:text-xs uppercase tracking-widest font-semibold">{l}</div>
            </div>
          ))}
        </div>

        {/* ── 3 MODES ────────────────────────────────────────── */}
        <div className="mb-16 sm:mb-24">
          <div className="text-center mb-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-accent">3 Challenge Modes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-center mb-3 px-2">Three ways to test yourself</h2>
          <p className="text-muted text-center text-xs sm:text-sm mb-8 max-w-sm mx-auto px-4">
            Most sites only have theory. Real interviews test all three.
          </p>

          {/* Tab buttons — scroll on mobile */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-center mb-6 px-1">
            {modes.map((m, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={'flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ' +
                  (activeTab === i
                    ? m.bg + ' ' + m.color + ' border-current'
                    : 'border-border text-muted hover:text-white active:scale-95')}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {modes.map((m, i) => activeTab === i && (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 sm:p-8">
              <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className={'w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ' + m.bg}>
                  <m.icon size={18} className={m.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-black text-base sm:text-xl">{m.label}</h3>
                    <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full border ' + m.bg + ' ' + m.color}>{m.count}</span>
                  </div>
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {m.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#c8c8d8]">
                    <CheckCircle size={12} className={m.color + ' flex-shrink-0'} />{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── AI FEATURES ────────────────────────────────────── */}
        <div className="mb-16 sm:mb-24">
          <div className="text-center mb-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-accent2">6 AI Features</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-center mb-3 px-2">Your AI interview coach</h2>
          <p className="text-muted text-center text-xs sm:text-sm mb-8 max-w-sm mx-auto">
            Not a chatbot you switch to. AI is woven into every part of your prep.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {aiFeatures.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 flex gap-3 sm:block hover:border-accent/30 transition-all">
                {/* Mobile: icon inline. Desktop: icon above */}
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 sm:mb-3">
                  <Icon size={14} className={color} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-xs sm:text-sm">{title}</h3>
                    <span className="text-[9px] bg-accent2/15 text-accent2 px-1.5 py-0.5 rounded font-black">PRO</span>
                  </div>
                  <p className="text-muted text-[11px] sm:text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEFORE / AFTER ─────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 mb-16 sm:mb-24">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-6 sm:mb-8">Why devs switch to JSPrep Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: '📖', label: 'Theory', before: 'Read definitions on MDN', after: 'Understand with AI + code examples' },
              { icon: '💻', label: 'Output Questions', before: 'Get surprised in interviews', after: 'Predict output confidently' },
              { icon: '🐛', label: 'Debug Challenges', before: 'Never practiced bug fixing', after: 'AI-scored real bug fixing practice' },
            ].map(({ icon, label, before, after }) => (
              <div key={label} className="flex sm:block gap-4 items-start">
                <div className="text-xl sm:text-2xl sm:mb-3 flex-shrink-0">{icon}</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{label}</p>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-2 text-xs text-muted/70">
                      <span className="text-danger flex-shrink-0">✗</span>{before}
                    </div>
                    <div className="flex items-start gap-2 text-xs text-[#c8c8d8]">
                      <span className="text-accent3 flex-shrink-0">✓</span>{after}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRICING ────────────────────────────────────────── */}
        <div className="mb-16 sm:mb-20" id="pricing">
          <div className="text-center mb-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-accent3">Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-center mb-8 sm:mb-12">Simple, transparent pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">

            {/* Free */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col">
              <div className="text-lg sm:text-xl font-black mb-1">Free</div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">₹0</div>
              <p className="text-muted text-xs mb-5">Forever free, no card needed</p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {['All 21 theory questions', 'First 5 output questions', 'First 5 debug challenges', 'Mark up to 5 as mastered', 'Google sign-in'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-muted">
                    <CheckCircle size={12} className="text-accent3 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth" className="block text-center border border-border rounded-xl py-3 text-sm font-bold hover:border-accent/50 transition-colors active:scale-95">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-card border-2 border-accent rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col">
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-accent text-white text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-lg">POPULAR</div>
              <div className="text-lg sm:text-xl font-black mb-1 text-accent">Pro</div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 99}
                <span className="text-muted text-sm font-normal"> /month</span>
              </div>
              <p className="text-muted text-xs mb-5">Less than a coffee. Cancel anytime.</p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-white">
                    <CheckCircle size={12} className="text-accent flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth"
                className="block text-center bg-accent hover:bg-accent/90 text-white rounded-xl py-3 text-sm font-black transition-all active:scale-95 shadow-lg shadow-accent/20">
                Start with Pro →
              </Link>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ─────────────────────────────────────── */}
        <div className="text-center bg-card border border-border rounded-2xl p-8 sm:p-12 mb-10">
          <div className="text-4xl sm:text-5xl mb-4">🚀</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to land your next JS role?</h2>
          <p className="text-muted text-sm mb-6 sm:mb-8 max-w-sm mx-auto">
            Join developers who prep smarter, not just harder.
          </p>
          <Link href="/auth"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-black px-8 py-4 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-accent/25">
            Start for Free <ArrowRight size={16} />
          </Link>
        </div>

        <div className="text-center text-muted text-xs pb-4">
          © 2026 JSPrep Pro · Built for frontend developers
        </div>
      </div>
    </main>
  )
}
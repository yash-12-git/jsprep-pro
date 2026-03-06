/** @jsxImportSource @emotion/react */
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Zap, BookOpen, Brain, ArrowRight, CheckCircle, Code2, Bug, Mic, Target, FileText, Sparkles } from 'lucide-react'
import * as S from './page.styles'
import * as Shared from '@/styles/shared'
import { C } from '@/styles/tokens'
import { proFeatures } from '@/data/proBenefits'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0)

  const stats = [
    { n: '100+', l: 'Questions' },
    { n: '3', l: 'Modes' },
    { n: '6', l: 'AI Tools' },
    { n: `₹${process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY ?? 99}`, l: 'Pro/mo' },
  ]

  const modes = [
    {
      icon: BookOpen, color: C.accent, iconBg: `${C.accent}1a`, iconBorder: `${C.accent}33`,
      label: '📖 Theory', count: '21 questions', countBg: `${C.accent}1a`, countColor: C.accent,
      desc: 'Deep-dive explanations of closures, async, prototypes and event loop with hints, code examples, and AI follow-up.',
      features: ['Detailed answers + code', 'Category filters', 'Mark as mastered', 'Bookmark for review'],
    },
    {
      icon: Code2, color: C.accent2, iconBg: `${C.accent2}1a`, iconBorder: `${C.accent2}33`,
      label: '💻 Output Quiz', count: '40 questions', countBg: `${C.accent2}1a`, countColor: C.accent2,
      desc: 'Read real JS snippets — predict the exact output. Event loop traps, closure bugs, type coercion weirdness.',
      features: ['Event loop & Promises', 'Closure traps', 'Type coercion', 'Hoisting surprises'],
    },
    {
      icon: Bug, color: C.danger, iconBg: `${C.danger}1a`, iconBorder: `${C.danger}33`,
      label: '🐛 Debug Lab', count: '20 challenges', countBg: `${C.danger}1a`, countColor: C.danger,
      desc: 'Find and fix real bugs in broken code. AI checks your solution, scores it 1–10, explains what you missed.',
      features: ['Async bugs', 'Closure traps', 'React stale closures', 'AI-powered checking'],
    },
  ]

  const aiFeatures = [
    { icon: Sparkles, title: 'AI Tutor', desc: 'Ask follow-ups on any question. Simpler explanations, real examples, edge cases.', color: C.accent },
    { icon: Target, title: 'Answer Evaluator', desc: 'Type your answer, AI scores 1-10 and tells you exactly what you missed.', color: C.accent2 },
    { icon: Bug, title: 'Code Checker', desc: 'Fix broken code, AI validates your fix and suggests a cleaner approach.', color: C.danger },
    { icon: Mic, title: 'Mock Interviewer', desc: 'Full back-and-forth with an AI senior engineer. Probes, follow-ups, honest feedback.', color: C.purple },
    { icon: Brain, title: 'Study Plan', desc: 'Analyzes your weak spots, generates a personalized day-by-day prep roadmap.', color: C.orange },
    { icon: FileText, title: 'Cheat Sheet PDF', desc: 'Printable PDF of all your mastered concepts. Perfect for last-minute review.', color: C.accent3 },
  ]

  return (
    <main css={S.page}>
      <div css={S.glow1} />
      <div css={S.glow2} />

      <div css={S.inner}>

        {/* ── HERO ─────────────────────────────────────── */}
        <div css={S.hero}>
          <div css={S.heroPill}>
            <Zap size={11} /> For 1–3 Year Frontend Devs
          </div>
          <h1 css={S.heroTitle}>
            The Only JS Interview <span css={S.heroAccent}>Prep You Need</span>
          </h1>
          <p css={S.heroDesc}>
            100+ questions across 3 modes — theory, output prediction, and debugging. With 6 AI features.
          </p>
          <p css={S.heroSubDesc}>Not just MCQs. The closest thing to a real interview.</p>
          <div css={S.heroCtas}>
            <Link href="/auth" css={S.ctaPrimary}>
              Start Free — No Card Needed <ArrowRight size={16} />
            </Link>
            <a href="#pricing" css={S.ctaSecondary}>See pricing</a>
          </div>
        </div>

        {/* ── STATS ─────────────────────────────────────── */}
        <div css={S.statsGrid}>
          {stats.map(({ n, l }) => (
            <div key={l} css={S.statCard}>
              <div css={S.statNum}>{n}</div>
              <div css={S.statLabel}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── 3 MODES ──────────────────────────────────── */}
        <div css={S.sectionWrapper}>
          <p css={S.sectionEyebrow(C.accent)}>3 Challenge Modes</p>
          <h2 css={S.sectionTitle}>Three ways to test yourself</h2>
          <p css={S.sectionDesc}>Most sites only have theory. Real interviews test all three.</p>

          <div css={S.tabRow}>
            {modes.map((m, i) => (
              <button key={i} css={S.tabBtn(activeTab === i, m.iconBg, m.color)} onClick={() => setActiveTab(i)}>
                {m.label}
              </button>
            ))}
          </div>

          {modes.map((m, i) => activeTab === i && (
            <div key={i} css={S.tabContent}>
              <div css={S.tabContentInner}>
                <div css={S.tabIconBox(m.iconBg)} style={{ borderColor: m.iconBorder }}>
                  <m.icon size={18} color={m.color} />
                </div>
                <div css={S.tabMeta}>
                  <div css={S.tabTitleRow}>
                    <h3 css={S.tabTitle}>{m.label}</h3>
                    <span css={S.tabCount(m.countBg, m.countColor)}>{m.count}</span>
                  </div>
                  <p css={S.tabDesc}>{m.desc}</p>
                </div>
              </div>
              <div css={S.tabFeatures}>
                {m.features.map(f => (
                  <div key={f} css={S.tabFeatureItem}>
                    <CheckCircle size={13} color={m.color} style={{ flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── AI FEATURES ──────────────────────────────── */}
        <div css={S.sectionWrapper}>
          <p css={S.sectionEyebrow(C.accent2)}>6 AI Features</p>
          <h2 css={S.sectionTitle}>Your AI interview coach</h2>
          <p css={S.sectionDesc}>Not a chatbot you switch to. AI is woven into every part of your prep.</p>

          <div css={S.aiFeaturesGrid}>
            {aiFeatures.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} css={S.aiFeatureCard}>
                <div css={S.aiFeatureIcon}>
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 css={S.aiFeatureTitle}>{title}</h3>
                    <span css={Shared.proBadgeSmall}>PRO</span>
                  </div>
                  <p css={S.aiFeatureDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEFORE / AFTER ───────────────────────────── */}
        <div css={[S.sectionWrapper, { marginBottom: 0 }]}>
          <div css={S.beforeAfterCard}>
            <h2 css={S.beforeAfterTitle}>Why devs switch to JSPrep Pro</h2>
            <div css={S.beforeAfterGrid}>
              {[
                { icon: '📖', label: 'Theory', before: 'Read definitions on MDN', after: 'Understand with AI + code examples' },
                { icon: '💻', label: 'Output Questions', before: 'Get surprised in interviews', after: 'Predict output confidently' },
                { icon: '🐛', label: 'Debug Challenges', before: 'Never practiced bug fixing', after: 'AI-scored real bug fixing practice' },
              ].map(({ icon, label, before, after }) => (
                <div key={label} css={S.beforeAfterItem}>
                  <div css={S.beforeAfterEmoji}>{icon}</div>
                  <div>
                    <p css={S.beforeAfterLabel}>{label}</p>
                    <div css={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <div css={S.beforeRow}><span css={{ color: C.danger, flexShrink: 0 }}>✗</span>{before}</div>
                      <div css={S.afterRow}><span css={{ color: C.accent3, flexShrink: 0 }}>✓</span>{after}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRICING ──────────────────────────────────── */}
        <div css={[S.sectionWrapper, { marginTop: '4rem' }]} id="pricing">
          <p css={S.sectionEyebrow(C.accent3)}>Pricing</p>
          <h2 css={S.sectionTitle}>Simple, transparent pricing</h2>

          <div css={S.pricingGrid}>
            {/* Free */}
            <div css={S.pricingCard}>
              <div css={S.planName}>Free</div>
              <div css={S.planPrice}>₹0</div>
              <p css={S.planTagline}>Forever free, no card needed</p>
              <ul css={S.featureList}>
                {['All theory questions', 'Free Blogs', 'Interview Topics', 'First 5 output questions', 'First 5 debug challenges', 'Mark up to 5 as mastered', 'Google sign-in'].map(f => (
                  <li key={f} css={S.featureItem}>
                    <CheckCircle size={13} color={C.accent3} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span css={{ color: C.muted, fontSize: '0.875rem' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth" css={S.planBtnFree}>Get Started Free</Link>
            </div>

            {/* Pro */}
            <div css={S.pricingCardPro}>
              <div css={S.popularBadge}>POPULAR</div>
              <div css={[S.planName, { color: C.accent }]}>Pro</div>
              <div css={S.planPrice}>
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 99}
                <span css={S.planPriceNote}> /month</span>
              </div>
              <p css={S.planTagline}>Less than a coffee. Cancel anytime.</p>
              <ul css={S.featureList}>
                {proFeatures.map(f => (
                  <li key={f} css={S.featureItem}>
                    <CheckCircle size={13} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span css={{ color: 'white', fontSize: '0.875rem' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth" css={S.planBtnPro}>Start with Pro →</Link>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ───────────────────────────────── */}
        <div css={S.bottomCta}>
          <div css={S.bottomCtaEmoji}>🚀</div>
          <h2 css={S.bottomCtaTitle}>Ready to land your next JS role?</h2>
          <p css={S.bottomCtaDesc}>Join developers who prep smarter, not just harder.</p>
          <Link href="/auth" css={S.ctaPrimary} style={{ display: 'inline-flex', width: 'auto' }}>
            Start for Free <ArrowRight size={16} />
          </Link>
        </div>

        <div css={S.footer}>© 2026 JSPrep Pro · Built for frontend developers</div>
      </div>
    </main>
  )
}
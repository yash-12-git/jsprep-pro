/** @jsxImportSource @emotion/react */
"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Zap,
  BookOpen,
  Brain,
  ArrowRight,
  CheckCircle,
  Code2,
  Bug,
  Mic,
  Target,
  FileText,
  Sparkles,
  Trophy,
  Calendar,
  Layers,
  BookMarked,
  TrendingUp,
  Users,
  Flame,
} from "lucide-react";
import * as S from "./page.styles";
import * as Shared from "@/styles/shared";
import { C } from "@/styles/tokens";
import { css } from "@emotion/react";
import { proFeatures } from "@/data/proBenefits";

// ─── Inline styles for new sections ──────────────────────────────────────────
const proofStrip = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.75rem;
  flex-wrap: wrap;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.875rem;
  margin-bottom: 3rem;
`;
const proofItem = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
`;
const qotdTeaser = css`
  background: linear-gradient(
    135deg,
    rgba(124, 106, 247, 0.1) 0%,
    rgba(106, 247, 192, 0.06) 100%
  );
  border: 1px solid rgba(124, 106, 247, 0.2);
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  align-items: center;
  flex-wrap: wrap;
`;
const qotdBadge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #c4b5fd;
  background: rgba(124, 106, 247, 0.15);
  padding: 2px 10px;
  border-radius: 20px;
  margin-bottom: 0.625rem;
`;
const qotdLeft = css`
  flex: 1;
  min-width: 220px;
`;
const qotdTitle = css`
  font-size: 1rem;
  font-weight: 800;
  color: white;
  line-height: 1.45;
  margin-bottom: 0.375rem;
`;
const qotdSub = css`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
`;
const qotdCta = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #7c6af7;
  color: white;
  border-radius: 0.75rem;
  font-weight: 800;
  font-size: 0.875rem;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
  &:hover {
    background: #6b59f0;
  }
`;
const newFeatureRow = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const newFeatCard = (color: string) => css`
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 1.125rem;
  padding: 1.125rem 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: border-color 0.15s;
  &:hover {
    border-color: ${color}40;
  }
`;
const newFeatIcon = (color: string, bg: string) => css`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background: ${bg};
  border: 1px solid ${color}33;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
const newFeatTitle = css`
  font-size: 0.9375rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const newFeatDesc = css`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
`;
const newBadge = css`
  font-size: 0.5625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.12);
  border: 1px solid rgba(106, 247, 192, 0.25);
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
`;
const lbPreview = css`
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 1.25rem;
  overflow: hidden;
`;
const lbHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;
const lbTitle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 800;
  color: white;
`;
const lbRowStyle = (i: number) => css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.25rem;
  background: ${i === 0 ? "rgba(247,199,106,0.04)" : "transparent"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;
const lbRankStyle = (i: number) => css`
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${i < 3 ? "0.875rem" : "0.6875rem"};
  background: ${i === 0
    ? "rgba(247,199,106,0.15)"
    : i === 1
      ? "rgba(192,192,192,0.1)"
      : "rgba(205,127,50,0.1)"};
  color: ${i === 0 ? "#f7c76a" : i === 1 ? "#c0c0c0" : "#cd7f32"};
`;
const lbAvatar = css`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #c4b5fd;
  background: rgba(124, 106, 247, 0.2);
`;
const lbName = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: white;
  flex: 1;
`;
const lbXp = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 800;
  color: #f7c76a;
  flex-shrink: 0;
`;
const lbCtaLink = css`
  display: block;
  text-align: center;
  padding: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #7c6af7;
  text-decoration: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.15s;
  &:hover {
    background: rgba(124, 106, 247, 0.05);
  }
`;
const topicGrid = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.125rem;
`;
const topicPill = css`
  display: inline-flex;
  align-items: center;
  padding: 0.3125rem 0.8125rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  background: rgba(124, 106, 247, 0.07);
  border: 1px solid rgba(124, 106, 247, 0.18);
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.12s;
  &:hover {
    background: rgba(124, 106, 247, 0.15);
    color: white;
    border-color: rgba(124, 106, 247, 0.35);
  }
`;

const FAKE_LEADERS = [
  { name: "Arjun M.", xp: 380 },
  { name: "Priya K.", xp: 290 },
  { name: "Rahul S.", xp: 215 },
];
const TOPIC_PREVIEWS = [
  "Closures",
  "Event Loop",
  "Promises",
  "Hoisting",
  "this Keyword",
  "Prototypes",
  "async/await",
  "Generators",
  "Debounce & Throttle",
  "Array Methods",
];
const RANK_EMOJI = ["🥇", "🥈", "🥉"];

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const ctaHref = user ? "/dashboard" : "/auth";
  const ctaLabel = user ? "Go to Dashboard" : "Start Free — No Card Needed";

  const stats = [
    { n: "195+", l: "Questions" },
    { n: "3", l: "Modes" },
    { n: "36", l: "Topics" },
    { n: "6", l: "AI Tools" },
  ];

  const modes = [
    {
      icon: BookOpen,
      color: C.accent,
      iconBg: `${C.accent}1a`,
      iconBorder: `${C.accent}33`,
      label: "📖 Theory",
      count: "91 questions",
      countBg: `${C.accent}1a`,
      countColor: C.accent,
      desc: "Deep-dive explanations of closures, async, prototypes and event loop with hints, code examples, and AI follow-up.",
      features: [
        "Detailed answers + code",
        "Category filters",
        "Mark as mastered",
        "Paginated — 15/page",
      ],
    },
    {
      icon: Code2,
      color: C.accent2,
      iconBg: `${C.accent2}1a`,
      iconBorder: `${C.accent2}33`,
      label: "💻 Output Quiz",
      count: "66 questions",
      countBg: `${C.accent2}1a`,
      countColor: C.accent2,
      desc: "Read real JS snippets — predict the exact output. Event loop traps, closure bugs, type coercion weirdness.",
      features: [
        "Event loop & Promises",
        "Closure traps",
        "Type coercion",
        "Hoisting surprises",
      ],
    },
    {
      icon: Bug,
      color: C.danger,
      iconBg: `${C.danger}1a`,
      iconBorder: `${C.danger}33`,
      label: "🐛 Debug Lab",
      count: "38 challenges",
      countBg: `${C.danger}1a`,
      countColor: C.danger,
      desc: "Find and fix real bugs in broken code. AI checks your solution, scores it 1–10, explains what you missed.",
      features: [
        "Async bugs",
        "Closure traps",
        "React stale closures",
        "AI-powered checking",
      ],
    },
  ];

  const aiFeatures = [
    {
      icon: Sparkles,
      title: "AI Tutor",
      desc: "Ask follow-ups on any question. Simpler explanations, real examples, edge cases.",
      color: C.accent,
    },
    {
      icon: Target,
      title: "Answer Evaluator",
      desc: "Type your answer, AI scores 1–10 and tells you exactly what you missed.",
      color: C.accent2,
    },
    {
      icon: Bug,
      title: "Code Checker",
      desc: "Fix broken code, AI validates your fix and suggests a cleaner approach.",
      color: C.danger,
    },
    {
      icon: Mic,
      title: "Mock Interviewer",
      desc: "Full back-and-forth with an AI senior engineer. Probes, follow-ups, honest feedback.",
      color: C.purple,
    },
    {
      icon: Brain,
      title: "Study Plan",
      desc: "Analyzes your weak spots, generates a personalized day-by-day prep roadmap.",
      color: C.orange,
    },
    {
      icon: FileText,
      title: "Cheat Sheet",
      desc: "36-topic revision cards with key concepts + interview tips. Print as PDF before your interview.",
      color: C.accent3,
    },
  ];

  const newFeatures = [
    {
      icon: Calendar,
      color: C.accent,
      bg: `${C.accent}1a`,
      title: "Question of the Day",
      desc: "A fresh question every day. Type your answer, get AI-scored feedback instantly. Free for everyone — builds the daily habit.",
    },
    {
      icon: Trophy,
      color: C.accent2,
      bg: `${C.accent2}1a`,
      title: "Weekly Leaderboard",
      desc: "Earn XP for mastering questions, output solves, debug fixes. Weekly reset so everyone can climb. See where you stand.",
    },
    {
      icon: Layers,
      color: C.accent3,
      bg: `${C.accent3}1a`,
      title: "36 Topic Deep-Dives",
      desc: "Every JS interview topic has its own page — cheat sheet bullets, interview tips, and all related questions in one place.",
    },
    {
      icon: BookMarked,
      color: C.purple,
      bg: "rgba(167,139,250,0.1)",
      title: "12 In-Depth Blog Posts",
      desc: "Long-form guides on closures, async/await, the event loop, prototypes — written for interview prep, not beginner tutorials.",
    },
  ];

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
            195+ questions across 3 modes — theory, output prediction, and
            debugging. With 6 AI features, daily habit loop, and a weekly
            leaderboard.
          </p>
          <p css={S.heroSubDesc}>
            Not just MCQs. The closest thing to a real JavaScript interview.
          </p>
          <div css={S.heroCtas}>
            <Link href={ctaHref} css={S.ctaPrimary}>
              {ctaLabel} <ArrowRight size={16} />
            </Link>
            <a href="#pricing" css={S.ctaSecondary}>
              See pricing
            </a>
          </div>
        </div>

        {/* ── SOCIAL PROOF ──────────────────────────────── */}
        <div css={proofStrip}>
          {[
            { icon: Users, text: "Used by frontend devs daily" },
            { icon: TrendingUp, text: "150+ interview questions" },
            { icon: Flame, text: "Daily question habit builder" },
            { icon: Trophy, text: "Weekly XP leaderboard" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} css={proofItem}>
              <Icon size={14} color={C.accent} />
              {text}
            </div>
          ))}
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

        {/* ── QOTD TEASER ──────────────────────────────── */}
        <div css={[S.sectionWrapper, { marginBottom: "2rem" }]}>
          <div css={qotdTeaser}>
            <div css={qotdLeft}>
              <div css={qotdBadge}>
                <Flame size={10} /> Question of the Day — Free
              </div>
              <p css={qotdTitle}>
                One question a day. Answer it. Get AI feedback. Stay ready.
              </p>
              <p css={qotdSub}>
                Builds the daily prep habit without overwhelm. Free for everyone
                — no Pro needed.
              </p>
            </div>
            <Link href={ctaHref} css={qotdCta}>
              <Calendar size={15} /> Try today's question
            </Link>
          </div>
        </div>

        {/* ── 3 MODES ──────────────────────────────────── */}
        <div css={S.sectionWrapper}>
          <p css={S.sectionEyebrow(C.accent)}>3 Challenge Modes</p>
          <h2 css={S.sectionTitle}>Three ways to test yourself</h2>
          <p css={S.sectionDesc}>
            Most sites only have theory. Real interviews test all three.
          </p>
          <div css={S.tabRow}>
            {modes.map((m, i) => (
              <button
                key={i}
                css={S.tabBtn(activeTab === i, m.iconBg, m.color)}
                onClick={() => setActiveTab(i)}
              >
                {m.label}
              </button>
            ))}
          </div>
          {modes.map(
            (m, i) =>
              activeTab === i && (
                <div key={i} css={S.tabContent}>
                  <div css={S.tabContentInner}>
                    <div
                      css={S.tabIconBox(m.iconBg)}
                      style={{ borderColor: m.iconBorder }}
                    >
                      <m.icon size={18} color={m.color} />
                    </div>
                    <div css={S.tabMeta}>
                      <div css={S.tabTitleRow}>
                        <h3 css={S.tabTitle}>{m.label}</h3>
                        <span css={S.tabCount(m.countBg, m.countColor)}>
                          {m.count}
                        </span>
                      </div>
                      <p css={S.tabDesc}>{m.desc}</p>
                    </div>
                  </div>
                  <div css={S.tabFeatures}>
                    {m.features.map((f) => (
                      <div key={f} css={S.tabFeatureItem}>
                        <CheckCircle
                          size={13}
                          color={m.color}
                          style={{ flexShrink: 0 }}
                        />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>

        {/* ── AI FEATURES ──────────────────────────────── */}
        <div css={S.sectionWrapper}>
          <p css={S.sectionEyebrow(C.accent2)}>6 AI Features</p>
          <h2 css={S.sectionTitle}>Your AI interview coach</h2>
          <p css={S.sectionDesc}>
            Not a chatbot you switch to. AI is woven into every part of your
            prep.
          </p>
          <div css={S.aiFeaturesGrid}>
            {aiFeatures.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} css={S.aiFeatureCard}>
                <div css={S.aiFeatureIcon}>
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <h3 css={S.aiFeatureTitle}>{title}</h3>
                    <span css={Shared.proBadgeSmall}>PRO</span>
                  </div>
                  <p css={S.aiFeatureDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT'S NEW ────────────────────────────────── */}
        <div css={S.sectionWrapper}>
          <p css={S.sectionEyebrow(C.accent3)}>What's New</p>
          <h2 css={S.sectionTitle}>Beyond questions</h2>
          <p css={S.sectionDesc}>
            A full interview prep ecosystem — not just a list of Q&As.
          </p>
          <div css={newFeatureRow}>
            {newFeatures.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} css={newFeatCard(color)}>
                <div css={newFeatIcon(color, bg)}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <div css={newFeatTitle}>
                    {title}
                    <span css={newBadge}>New</span>
                  </div>
                  <p css={newFeatDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── LEADERBOARD + TOPICS ─────────────────────── */}
        <div
          css={[
            S.sectionWrapper,
            { display: "grid", gridTemplateColumns: "1fr", gap: "2rem" },
          ]}
        >
          {/* Leaderboard preview */}
          <div>
            <p
              css={S.sectionEyebrow(C.accent2)}
              style={{ marginBottom: "0.875rem" }}
            >
              Weekly Leaderboard
            </p>
            <div css={lbPreview}>
              <div css={lbHeader}>
                <div css={lbTitle}>
                  <Trophy size={14} color="#f7c76a" /> Top Learners This Week
                </div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Resets Monday
                </span>
              </div>
              {FAKE_LEADERS.map((entry, i) => (
                <div key={i} css={lbRowStyle(i)}>
                  <div css={lbRankStyle(i)}>{RANK_EMOJI[i]}</div>
                  <div css={lbAvatar}>{entry.name[0]}</div>
                  <div css={lbName}>{entry.name}</div>
                  <div css={lbXp}>
                    <Zap size={11} /> {entry.xp} XP
                  </div>
                </div>
              ))}
              <Link href={ctaHref} css={lbCtaLink}>
                Join the leaderboard — earn XP →
              </Link>
            </div>
          </div>

          <div
          css={[
            { margin: "1rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" },
          ]}
        ></div>

          {/* Topics */}
          <div>
            <p
              css={S.sectionEyebrow(C.accent3)}
              style={{ marginBottom: "0.5rem" }}
            >
              36 Topic Pages
            </p>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "0.375rem",
              }}
            >
              Every JS interview topic, covered
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.65,
              }}
            >
              Each topic has a cheat sheet, interview tips, and all related
              questions. Perfect for targeted last-minute prep.
            </p>
            <div css={topicGrid}>
              {TOPIC_PREVIEWS.map((t) => (
                <Link key={t} href="/topics" css={topicPill}>
                  {t}
                </Link>
              ))}
              <Link
                href="/topics"
                css={[topicPill, { borderStyle: "dashed", color: C.accent }]}
              >
                +26 more →
              </Link>
            </div>
          </div>
        </div>


        {/* ── BEFORE / AFTER ───────────────────────────── */}
        <div css={[S.sectionWrapper, { marginBottom: 0 }]}>
          <div css={S.beforeAfterCard}>
            <h2 css={S.beforeAfterTitle}>Why devs switch to JSPrep Pro</h2>
            <div css={S.beforeAfterGrid}>
              {[
                {
                  icon: "📖",
                  label: "Theory",
                  before: "Read definitions on MDN",
                  after: "Understand with AI + code examples",
                },
                {
                  icon: "💻",
                  label: "Output Questions",
                  before: "Get surprised in interviews",
                  after: "Predict output confidently",
                },
                {
                  icon: "🐛",
                  label: "Debug Challenges",
                  before: "Never practiced bug fixing",
                  after: "AI-scored real bug fixing practice",
                },
              ].map(({ icon, label, before, after }) => (
                <div key={label} css={S.beforeAfterItem}>
                  <div css={S.beforeAfterEmoji}>{icon}</div>
                  <div>
                    <p css={S.beforeAfterLabel}>{label}</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.375rem",
                      }}
                    >
                      <div css={S.beforeRow}>
                        <span style={{ color: C.danger, flexShrink: 0 }}>
                          ✗
                        </span>
                        {before}
                      </div>
                      <div css={S.afterRow}>
                        <span style={{ color: C.accent3, flexShrink: 0 }}>
                          ✓
                        </span>
                        {after}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRICING ──────────────────────────────────── */}
        <div css={[S.sectionWrapper, { marginTop: "4rem" }]} id="pricing">
          <p css={S.sectionEyebrow(C.accent3)}>Pricing</p>
          <h2 css={S.sectionTitle}>Simple, transparent pricing</h2>
          <div css={S.pricingGrid}>
            <div css={S.pricingCard}>
              <div css={S.planName}>Free</div>
              <div css={S.planPrice}>₹0</div>
              <p css={S.planTagline}>Forever free, no card needed</p>
              <ul css={S.featureList}>
                {[
                  "All 91 theory questions",
                  "Daily Question of the Day + AI eval",
                  "First 5 output questions",
                  "First 5 debug challenges",
                  "Mark up to 5 as mastered",
                  "Weekly leaderboard",
                ].map((f) => (
                  <li key={f} css={S.featureItem}>
                    <CheckCircle
                      size={13}
                      color={C.accent3}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <span style={{ color: C.muted, fontSize: "0.875rem" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} css={S.planBtnFree}>
                {user ? "Go to Dashboard" : "Get Started Free"}
              </Link>
            </div>
            <div css={S.pricingCardPro}>
              <div css={S.popularBadge}>POPULAR</div>
              <div css={[S.planName, { color: C.accent }]}>Pro</div>
              <div css={S.planPrice}>
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 199}
                <span css={S.planPriceNote}> /month</span>
              </div>
              <p css={S.planTagline}>Less than a coffee. Cancel anytime.</p>
              <ul css={S.featureList}>
                {proFeatures.map((f) => (
                  <li key={f} css={S.featureItem}>
                    <CheckCircle
                      size={13}
                      color={C.accent}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <span style={{ color: "white", fontSize: "0.875rem" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} css={S.planBtnPro}>
                {user ? "Upgrade to Pro →" : "Start with Pro →"}
              </Link>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ───────────────────────────────── */}
        <div css={S.bottomCta}>
          <div css={S.bottomCtaEmoji}>🚀</div>
          <h2 css={S.bottomCtaTitle}>Ready to land your next JS role?</h2>
          <p css={S.bottomCtaDesc}>
            Join developers who prep smarter, not just harder.
          </p>
          <Link
            href={ctaHref}
            css={S.ctaPrimary}
            style={{ display: "inline-flex", width: "auto" }}
          >
            {user ? "Back to Dashboard" : "Start for Free"}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div css={S.footer}>
          © 2026 JSPrep Pro · jsprep.pro · Built for frontend developers
        </div>
      </div>
    </main>
  );
}

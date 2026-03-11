/** @jsxImportSource @emotion/react */
"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Trophy,
  Flame,
  Star,
  Calendar,
} from "lucide-react";
import {
  aiBdg,
  aiCard,
  aiDsc,
  aiG,
  aiIco,
  aiLab,
  badge,
  btmCta,
  btmD,
  btmH,
  btnO,
  btnP,
  ctas,
  dd,
  demoAns,
  demoAnsL,
  demoAnsT,
  demoBar,
  demoBarFill,
  demoBarWrap,
  demoDenom,
  demoFb,
  demoInner,
  demoPill,
  demoQ,
  demoQL,
  demoResult,
  demoScore,
  demoScoreRow,
  demoShell,
  demoTitle,
  eye,
  foot,
  freeBanner,
  grad,
  greenGlow,
  h1,
  hero,
  hr,
  lbAv,
  lbCard,
  lbCta,
  lbHead,
  lbHeadT,
  lbName,
  lbReset,
  lbRow,
  lbXp,
  modeC,
  modeCard,
  modeD,
  modeE,
  modeFree,
  modeL,
  modesG,
  modeT,
  modeTagRow,
  page,
  pBtnF,
  pBtnP,
  pFeat,
  pFeats,
  pNote,
  popularTag,
  pPer,
  pPrice,
  priceC,
  priceCPro,
  priceG,
  pTier,
  purpleGlow,
  qotdBadge,
  qotdBtn,
  qotdCard,
  qotdSub,
  qotdTitle,
  sec,
  sh2,
  ssub,
  statCell,
  statL,
  statN,
  statsRow,
  sub,
  tAuthor,
  tAv,
  tCard,
  tGrid,
  tMark,
  tName,
  tpCard,
  tpDiff,
  tpDot,
  tpGrid,
  tpMeta,
  tpName,
  tpQs,
  tQuote,
  tRole,
  tStars,
  twoCol,
  whyAfter,
  whyBefore,
  whyCard,
  whyEmoji,
  whyG,
  whyItem,
  whyLabel,
  wrap,
} from "./page.styles";

import {
  AI_TOOLS,
  FREE_F,
  LEADERS,
  MODES,
  proFeatures,
  TESTIMONIALS,
  TOPICS,
} from "@/data/homepageStaticData";

export default function HomePage() {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/auth";
  const ctaLabel = user ? "Go to Dashboard" : "Start Free — No Card Needed";

  return (
    <main css={page}>
      <div css={purpleGlow} />
      <div css={greenGlow} />
      <div css={wrap}>
        {/* ── HERO ─────────────────────────────────── */}
        <div css={hero} id="features">
          <div css={badge}>
            <Zap size={10} /> For 1–3 Year Frontend Developers
          </div>
          <h1 css={h1}>
            Land your next
            <br />
            <span css={grad}>JavaScript role.</span>
          </h1>
          <p css={sub}>
            195+ questions across theory, output prediction, and debugging —
            with 6 AI tools that score your answers like a real senior engineer
            would.
          </p>
          <div css={ctas}>
            <Link href={ctaHref} css={btnP}>
              {ctaLabel} <ArrowRight size={16} />
            </Link>
            <a href="#pricing" css={btnO}>
              See pricing
            </a>
          </div>
        </div>

        {/* ── FREE CALLOUT ─────────────────────────── */}
        <div css={freeBanner}>
          <CheckCircle size={15} color="#6af7c0" style={{ flexShrink: 0 }} />
          <span
            style={{ fontSize: "0.9375rem", color: "#6af7c0", fontWeight: 700 }}
          >
            91 theory questions — completely free, forever.
          </span>
          <span
            style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.32)" }}
          >
            No card. No trial. No paywall.
          </span>
        </div>

        {/* ── STATS ────────────────────────────────── */}
        <div css={statsRow}>
          {[
            { n: "195+", l: "Questions" },
            { n: "3", l: "Practice modes" },
            { n: "36", l: "Topic guides" },
            { n: "6", l: "AI tools" },
          ].map(({ n, l }) => (
            <div key={l} css={statCell}>
              <div css={statN}>{n}</div>
              <div css={statL}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── AI DEMO ──────────────────────────────── */}
        <div css={sec}>
          <p css={eye("#7c6af7")}>AI Answer Evaluator</p>
          <h2 css={sh2}>Know exactly where you stand</h2>
          <p css={ssub}>
            Type your answer. Get scored 1–10 with specific gaps, not "great
            job".
          </p>

          <div css={demoShell}>
            <div css={demoBar}>
              <div css={dd("#f76a6a")} />
              <div css={dd("#f7c76a")} />
              <div css={dd("#6af7c0")} />
              <span css={demoTitle}>JSPrep Pro · Answer Evaluator</span>
            </div>
            <div css={demoInner}>
              <div css={demoQL}>
                <span css={demoPill}>Closures</span>
                <span css={demoPill}>Core</span>
              </div>
              <div css={demoQ}>
                What is a closure in JavaScript, and why is it useful?
              </div>
              <div css={demoAns}>
                <div css={demoAnsL}>Your answer</div>
                <div css={demoAnsT}>
                  A closure is when a function has access to variables from its
                  outer scope, even after the outer function has returned. It's
                  useful for data privacy and keeping state in counters.
                </div>
              </div>
              <div css={demoResult}>
                <div css={demoScoreRow}>
                  <div css={demoScore}>
                    7<span css={demoDenom}>/10</span>
                  </div>
                  <div css={demoBarWrap}>
                    <div css={demoBarFill} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Good — room to grow
                  </span>
                </div>
                <div css={demoFb}>
                  <span style={{ color: "#6af7c0", fontWeight: 700 }}>
                    ✓ Correct on scope retention and persistence.
                  </span>{" "}
                  But you're missing the key mechanic — closures work because of{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    lexical scoping
                  </span>
                  . The function retains a{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    reference
                  </span>{" "}
                  to variables (not a copy), which is why the var-in-loop bug
                  exists. A senior answer would also mention the{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    module pattern
                  </span>{" "}
                  or{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>
                    React hooks
                  </span>{" "}
                  as real-world usage.
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr css={hr} />

        {/* ── 3 MODES ──────────────────────────────── */}
        <div css={sec} id="practice">
          <p css={eye("#6af7c0")}>Three Practice Modes</p>
          <h2 css={sh2}>How real interviews test you</h2>
          <p css={ssub}>
            Most prep sites are theory-only. Real JS interviews use all three.
          </p>
          <div css={modesG}>
            {MODES.map((m) => (
              <div key={m.label} css={modeCard(m.c)}>
                <span css={modeE}>{m.emoji}</span>
                {m.free && <div css={modeFree}>✓ Free</div>}
                <div css={modeL}>{m.label}</div>
                <div css={modeC(m.c)}>{m.n} questions</div>
                <p css={modeD}>{m.desc}</p>
                <div css={modeTagRow}>
                  {m.tags.map((t) => (
                    <span key={t} css={modeT(m.c)}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEYOND QUESTIONS (QOTD + LB + WHY) ──── */}
        <div css={sec}>
          <p css={eye("#f7c76a")}>Beyond Questions</p>
          <h2 css={sh2}>A full interview prep ecosystem</h2>
          <p css={ssub}>
            Not just a list of Q&As — habits, accountability, and depth.
          </p>

          {/* QOTD + Leaderboard side by side */}
          <div css={[twoCol, { marginBottom: "1.5rem" }]}>
            {/* QOTD */}
            <div css={qotdCard}>
              <div>
                <div css={qotdBadge}>
                  <Flame size={10} /> Question of the Day — Free
                </div>
                <div css={qotdTitle}>
                  One question a day. Answer it. Get AI feedback. Stay ready.
                </div>
                <p css={qotdSub}>
                  Builds the daily prep habit without overwhelm. Free for
                  everyone — no Pro needed. Track your streak.
                </p>
              </div>
              <Link href={ctaHref} css={qotdBtn}>
                <Calendar size={14} /> Try today's question
              </Link>
            </div>

            {/* Leaderboard */}
            <div css={lbCard}>
              <div css={lbHead}>
                <div css={lbHeadT}>
                  <Trophy size={14} color="#f7c76a" /> Top Learners This Week
                </div>
                <span css={lbReset}>Resets Monday</span>
              </div>
              {LEADERS.map((l, i) => (
                <div key={l.name} css={lbRow(l.bg)}>
                  <span
                    style={{
                      fontSize: i < 3 ? "1rem" : "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    {l.medal}
                  </span>
                  <div css={lbAv}>{l.av}</div>
                  <div css={lbName}>{l.name}</div>
                  <div css={lbXp}>
                    <Zap size={11} /> {l.xp} XP
                  </div>
                </div>
              ))}
              <Link href={ctaHref} css={lbCta}>
                Join the leaderboard — earn XP →
              </Link>
            </div>
          </div>

          {/* Why devs switch */}
          <div css={whyCard}>
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "1.375rem",
                textAlign: "center",
              }}
            >
              Why devs switch to JSPrep Pro
            </p>
            <div css={whyG}>
              {[
                {
                  emoji: "📖",
                  label: "Theory",
                  before: "Read definitions on MDN",
                  after: "Understand with AI + code examples",
                },
                {
                  emoji: "💻",
                  label: "Output Questions",
                  before: "Get surprised in interviews",
                  after: "Predict output confidently",
                },
                {
                  emoji: "🐛",
                  label: "Debug Challenges",
                  before: "Never practiced bug fixing",
                  after: "AI-scored real bug fixing practice",
                },
              ].map(({ emoji, label, before, after }) => (
                <div key={label} css={whyItem}>
                  <div css={whyEmoji}>{emoji}</div>
                  <div css={whyLabel}>{label}</div>
                  <div css={whyBefore}>
                    <span style={{ color: "#f76a6a", flexShrink: 0 }}>✗</span>
                    {before}
                  </div>
                  <div css={whyAfter}>
                    <span style={{ color: "#6af7c0", flexShrink: 0 }}>✓</span>
                    {after}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr css={hr} />

        {/* ── TESTIMONIALS ─────────────────────────── */}
        <div css={sec}>
          <p css={eye("#f7c76a")}>Real developers. Real offers.</p>
          <h2 css={sh2}>They prepped here. They got in.</h2>
          <p css={ssub}>
            Not "I liked the UI." — Developers, interviews, outcomes.
          </p>
          <div css={tGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} css={tCard}>
                <div>
                  <div css={tStars}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f7c76a" color="#f7c76a" />
                    ))}
                  </div>
                  <span css={tMark}>"</span>
                  <p css={tQuote}>{t.quote}</p>
                </div>
                <div css={tAuthor}>
                  <div css={tAv(t.c)}>{t.av}</div>
                  <div>
                    <div css={tName}>{t.name}</div>
                    <div css={tRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOPIC CARDS ──────────────────────────── */}
        <div css={sec}>
          <p css={eye("#a78bfa")}>36 Topic Deep-Dives</p>
          <h2 css={sh2}>Every concept, interview-ready</h2>
          <p css={ssub}>
            Each topic has a mental model, full explanation, cheat sheet, and
            practice questions. Not just a Q&A list.
          </p>
          <div css={tpGrid}>
            {TOPICS.map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} css={tpCard(t.c)}>
                <div css={tpDot(t.c)} />
                <div css={tpName}>{t.label}</div>
                <div css={tpMeta}>
                  <span css={tpDiff(t.c)}>{t.diff}</span>
                  <span css={tpQs}>{t.qs} questions</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
            <Link href="/topics" css={btnO}>
              See all 36 topics <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── AI TOOLS ─────────────────────────────── */}
        <div css={sec}>
          <p css={eye("#7c6af7")}>6 AI Features</p>
          <h2 css={sh2}>Your AI interview coach</h2>
          <p css={ssub}>
            Not a chatbot you switch to. AI is inside every question, every
            answer, every debug.
          </p>
          <div css={aiG}>
            {AI_TOOLS.map(({ icon: Icon, label, desc, c }) => (
              <div key={label} css={aiCard}>
                <div css={aiIco(c)}>
                  <Icon size={16} color={c} />
                </div>
                <div>
                  <div css={aiLab}>
                    {label}
                    <span css={aiBdg}>PRO</span>
                  </div>
                  <p css={aiDsc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRICING ──────────────────────────────── */}
        <div css={sec} id="pricing">
          <p css={eye("#6af7c0")}>Pricing</p>
          <h2 css={sh2}>Simple. Transparent.</h2>
          <p css={ssub}>
            Start free with 91 real questions and AI feedback from day one.
          </p>
          <div css={priceG}>
            <div css={priceC}>
              <div css={pTier}>Free</div>
              <div css={pPrice}>₹0</div>
              <div css={pNote}>Forever free — no card needed</div>
              <ul css={pFeats}>
                {FREE_F.map((f) => (
                  <li key={f} css={pFeat}>
                    <CheckCircle
                      size={13}
                      color="#6af7c0"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} css={pBtnF}>
                {user ? "Go to Dashboard" : "Get Started Free"}
              </Link>
            </div>
            <div css={priceCPro}>
              <div css={popularTag}>POPULAR</div>
              <div css={[pTier, { color: "#c4b5fd" }]}>Pro</div>
              <div css={pPrice}>
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 99}
                <span css={pPer}>/month</span>
              </div>
              <div css={pNote}>Less than a coffee. Cancel anytime.</div>
              <ul css={pFeats}>
                {proFeatures.map((f) => (
                  <li key={f} css={pFeat}>
                    <CheckCircle
                      size={13}
                      color="#7c6af7"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} css={pBtnP}>
                {user ? "Upgrade to Pro →" : "Start with Pro →"}
              </Link>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ───────────────────────────── */}
        <div css={btmCta}>
          <h2 css={btmH}>Ready to prep smarter?</h2>
          <p css={btmD}>
            91 questions free. AI feedback from question one. No card needed.
          </p>
          <Link href={ctaHref} css={btnP} style={{ display: "inline-flex" }}>
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>

        <div css={foot}>
          © 2026 JSPrep Pro · jsprep.pro · Built for frontend developers
        </div>
      </div>
    </main>
  );
}

/** @jsxImportSource @emotion/react */
"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Trophy,
  Flame,
  Star,
  Target,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUpgrade } from "@/hooks/useUpgrade";

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
  proActiveBtn,
  proPayBtn,
  pTier,
  purpleGlow,
  qotdBadge,
  qotdBtn,
  qotdCard,
  qotdSub,
  qotdTitle,
  sec,
  sh2,
  sprintCard,
  sprintCardHeader,
  sprintCardQ,
  sprintCat,
  sprintCheckBtn,
  sprintClaim,
  sprintClaimDesc,
  sprintClaimIcon,
  sprintClaims,
  sprintClaimTitle,
  sprintCode,
  sprintCTARow,
  sprintCTASub,
  sprintDemo,
  sprintDemoBody,
  sprintDemoLeft,
  sprintDemoRight,
  sprintDemoSectionLabel,
  sprintDiff,
  sprintEvalAnswer,
  sprintEvalBar,
  sprintEvalCard,
  sprintEvalDenom,
  sprintEvalFeedRow,
  sprintEvalFill,
  sprintEvalHeader,
  sprintEvalNum,
  sprintEvalPoints,
  sprintEvalQ,
  sprintEvalResult,
  sprintEvalScoreRow,
  sprintEvalVerdict,
  sprintFakeInput,
  sprintFakePlaceholder,
  sprintFeedGood,
  sprintFeedMiss,
  sprintHUD,
  sprintHUDFill,
  sprintHUDLeft,
  sprintHUDMeta,
  sprintHUDProgress,
  sprintHUDScoreLabel,
  sprintHUDScoreNum,
  sprintHUDTimer,
  sprintHUDTimerText,
  sprintHUDTrack,
  sprintInputRow,
  sprintInsightRow,
  sprintQueue,
  sprintQueueDot,
  sprintQueueItem,
  sprintQueueLabel,
  sprintQueueText,
  sprintResultAccuracy,
  sprintResultActions,
  sprintResultBadge,
  sprintResultDivider,
  sprintResultMax,
  sprintResultPreview,
  sprintResultRight,
  sprintResultScore,
  sprintResultScoreBlock,
  sprintShareChip,
  sprintSkipRow,
  sprintStartBtn,
  sprintTypeTag,
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

// ── ProCTA — outside component to avoid remount on every render ───────────────
function ProCTA({
  user,
  progress,
  handleUpgrade,
  payLoading,
  payError,
}: {
  user: any;
  progress: any;
  handleUpgrade: () => void;
  payLoading: boolean;
  payError: string | null;
}) {
  if (user && progress?.isPro) {
    return (
      <>
        <Link href="/dashboard" css={proActiveBtn}>
          <CheckCircle size={15} /> You&apos;re Pro — Go to Dashboard
        </Link>
        <p
          style={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            marginTop: "0.625rem",
          }}
        >
          <Sparkles
            size={10}
            style={{ verticalAlign: "middle", marginRight: "3px" }}
          />
          Pro is active on your account
        </p>
      </>
    );
  }
  if (user) {
    return (
      <>
        <button css={proPayBtn} onClick={handleUpgrade} disabled={payLoading}>
          {payLoading ? (
            "Opening payment..."
          ) : (
            <>
              <Zap size={16} /> Upgrade to Pro →
            </>
          )}
        </button>
        {payError && (
          <p
            style={{
              color: "#f76a6a",
              fontSize: "0.75rem",
              textAlign: "center",
              marginTop: "0.5rem",
            }}
          >
            {payError}
          </p>
        )}
      </>
    );
  }
  return (
    <>
      <Link href="/auth" css={pBtnP}>
        Start with Pro →
      </Link>
      <p
        style={{
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.3)",
          textAlign: "center",
          marginTop: "0.625rem",
        }}
      >
        You&apos;ll sign in or create an account during checkout
      </p>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomePageClient() {
  const { user, progress } = useAuth();
  const { handleUpgrade, loading: payLoading, error: payError } = useUpgrade();

  const ctaHref = user ? "/dashboard" : "/auth";
  const ctaLabel = user ? "Go to Dashboard" : "Start Free — No Card Needed";

  return (
    <main css={page}>
      <div css={purpleGlow} />
      <div css={greenGlow} />
      <div css={wrap}>
        {/* ── HERO ─────────────────────────────────────────── */}
        <div css={hero} id="features">
          <div css={badge}>
            <Zap size={10} /> For 1–3 Year Frontend Developers
          </div>
          <h1 css={h1}>
            JavaScript Interview
            <br />
            <span css={grad}>Questions & Practice.</span>
          </h1>
          <p css={sub}>
            Land your next role with 195+ questions across theory, output
            prediction, and debugging — with AI scoring and a timed{" "}
            <strong style={{ color: "#f7c76a" }}>Interview Sprint</strong> that
            tells you exactly if you&apos;re ready.
          </p>
          <div css={ctas}>
            <Link href={ctaHref} css={btnP}>
              {ctaLabel} <ArrowRight size={16} />
            </Link>
            <a href="#sprint" css={btnO}>
              <Zap size={14} /> Try the Sprint
            </a>
          </div>
        </div>

        {/* ── FREE CALLOUT ─────────────────────────────────── */}
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

        {/* ── STATS ────────────────────────────────────────── */}
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

        {/* ── AI DEMO ──────────────────────────────────────── */}
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

        {/* ── INTERVIEW SPRINT ─────────────────────────────── */}
        <div css={sec} id="sprint">
          <p css={eye("#f7c76a")}>⚡ New: Interview Sprint</p>
          <h2 css={sh2}>The fastest way to know if you&apos;re ready</h2>
          <p css={ssub}>
            A timed mixed-question challenge. Theory + output + debugging. AI
            judges your answers. One score tells you exactly where you stand.
          </p>
          <div css={sprintClaims}>
            {[
              {
                icon: "🎯",
                title: "Real interview format",
                desc: "Mixed question types under time pressure — exactly how JS interviews work",
              },
              {
                icon: "🤖",
                title: "AI scores theory answers",
                desc: "No multiple choice. You explain in your own words, AI grades like a senior engineer",
              },
              {
                icon: "📊",
                title: "Strengths & weak areas",
                desc: "After each sprint: know exactly which categories to keep drilling",
              },
              {
                icon: "🏆",
                title: "Shareable score card",
                desc: "Download or tweet your result — challenge your network to beat your score",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} css={sprintClaim}>
                <div css={sprintClaimIcon}>{icon}</div>
                <div css={sprintClaimTitle}>{title}</div>
                <p css={sprintClaimDesc}>{desc}</p>
              </div>
            ))}
          </div>

          <div css={sprintDemo}>
            <div css={sprintHUD}>
              <div css={sprintHUDLeft}>
                <Zap size={12} style={{ color: "#f7c76a" }} />
                <span css={sprintHUDScoreNum}>70</span>
                <span css={sprintHUDScoreLabel}>pts</span>
              </div>
              <div css={sprintHUDProgress}>
                <div css={sprintHUDMeta}>
                  <span style={{ fontWeight: 700, color: "white" }}>
                    Q5 / 10
                  </span>
                  <span>40% complete</span>
                </div>
                <div css={sprintHUDTrack}>
                  <div css={sprintHUDFill} />
                </div>
              </div>
              <div css={sprintHUDTimer}>
                <span css={sprintHUDTimerText}>7:23</span>
              </div>
            </div>

            <div css={sprintDemoBody}>
              <div css={sprintDemoLeft}>
                <div css={sprintDemoSectionLabel}>⚡ Active question</div>
                <div css={sprintCard}>
                  <div css={sprintCardHeader}>
                    <span css={sprintTypeTag("output")}>💻 Output</span>
                    <span css={sprintDiff}>Core</span>
                    <span css={sprintCat}>Type Coercion</span>
                  </div>
                  <p css={sprintCardQ}>What does this print?</p>
                  <pre css={sprintCode}>{`console.log([] + [])
console.log([] + {})
console.log({} + [])`}</pre>
                  <div css={sprintInputRow}>
                    <div css={sprintFakeInput}>
                      <span css={sprintFakePlaceholder}>
                        Type the expected output...
                      </span>
                    </div>
                    <div css={sprintCheckBtn}>Check</div>
                  </div>
                  <div css={sprintSkipRow}>Skip →</div>
                </div>
              </div>

              <div css={sprintDemoRight}>
                <div css={sprintDemoSectionLabel}>🤖 Previous — AI scored</div>
                <div css={sprintEvalCard}>
                  <div css={sprintEvalHeader}>
                    <span css={sprintTypeTag("theory")}>📖 Theory</span>
                    <span css={sprintCat}>Closures</span>
                  </div>
                  <p css={sprintEvalQ}>What is a closure in JavaScript?</p>
                  <div css={sprintEvalAnswer}>
                    &ldquo;A closure is a function that remembers variables from
                    its outer scope even after the outer function
                    returns...&rdquo;
                  </div>
                  <div css={sprintEvalResult}>
                    <div css={sprintEvalScoreRow}>
                      <span css={sprintEvalNum}>8</span>
                      <span css={sprintEvalDenom}>/10 · B+</span>
                      <div css={sprintEvalBar}>
                        <div css={sprintEvalFill(8)} />
                      </div>
                    </div>
                    <div css={sprintEvalVerdict}>
                      Good — missing lexical scoping detail
                    </div>
                    <div css={sprintEvalFeedRow}>
                      <span css={sprintFeedGood}>✓ Scope retention</span>
                      <span css={sprintFeedMiss}>✗ Module pattern</span>
                    </div>
                  </div>
                  <div css={sprintEvalPoints}>+10 pts</div>
                </div>
                <div css={sprintQueue}>
                  <div css={sprintQueueLabel}>Up next</div>
                  <div css={sprintQueueItem}>
                    <span css={sprintQueueDot("#f76a6a")} />
                    <span css={sprintQueueText}>
                      🐛 Find the bug in this async/await chain
                    </span>
                  </div>
                  <div css={sprintQueueItem}>
                    <span css={sprintQueueDot("#c4b5fd")} />
                    <span css={sprintQueueText}>
                      📖 Explain the JavaScript event loop
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div css={sprintResultPreview}>
              <div css={sprintResultBadge}>🏆 Sample result</div>
              <div css={sprintResultScoreBlock}>
                <span css={sprintResultScore}>172</span>
                <span css={sprintResultMax}>/200 pts</span>
                <span css={sprintResultAccuracy}>86% accuracy</span>
              </div>
              <div css={sprintResultDivider} />
              <div css={sprintResultRight}>
                <div css={sprintInsightRow("#6af7c0")}>
                  <CheckCircle size={10} />
                  <span>
                    <strong>Strong:</strong> Closures · Hoisting · Scope
                  </span>
                </div>
                <div css={sprintInsightRow("#f7c76a")}>
                  <Target size={10} />
                  <span>
                    <strong>Review:</strong> Event Loop · Promises
                  </span>
                </div>
              </div>
              <div css={sprintResultActions}>
                <div css={sprintShareChip}>📤 Share score</div>
                <div css={sprintShareChip}>⬇ Download card</div>
              </div>
            </div>
          </div>

          <div css={sprintCTARow}>
            <Link href={user ? "/sprint" : "/auth"} css={sprintStartBtn}>
              <Zap size={16} /> Start Your Sprint <ArrowRight size={14} />
            </Link>
            <span css={sprintCTASub}>
              Free 5-question warmup — no card needed
            </span>
          </div>
        </div>

        <hr css={hr} />

        {/* ── 3 MODES ──────────────────────────────────────── */}
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

        {/* ── BEYOND QUESTIONS ─────────────────────────────── */}
        <div css={sec}>
          <p css={eye("#f7c76a")}>Beyond Questions</p>
          <h2 css={sh2}>A full interview prep ecosystem</h2>
          <p css={ssub}>
            Not just a list of Q&As — habits, accountability, and depth.
          </p>

          <div css={[twoCol, { marginBottom: "1.5rem" }]}>
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

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
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

        {/* ── TOPIC CARDS ──────────────────────────────────── */}
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
                <div css={tpName}>{t.label} Interview Questions</div>
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

        {/* ── AI TOOLS ─────────────────────────────────────── */}
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

        {/* ── PRICING ──────────────────────────────────────── */}
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
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 199}
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
              <ProCTA
                user={user}
                progress={progress}
                handleUpgrade={handleUpgrade}
                payLoading={payLoading}
                payError={payError}
              />
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ───────────────────────────────────── */}
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

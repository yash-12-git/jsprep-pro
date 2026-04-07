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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { C } from "@/styles/tokens";
import { useTrack } from "@/contexts/TrackContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

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
  pFeat,
  pFeats,
  pNote,
  popularTag,
  pPer,
  pPrice,
  priceC,
  priceCPro,
  priceG,
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
  proFeatures,
  TESTIMONIALS,
  TRACK_HERO,
  TRACK_MODES,
  TRACK_WHY,
} from "@/data/homepageStaticData";
import ProCTA from "@/components/home/ProCTA";
import { Track, TRACK_MAP } from "@/lib/tracks";
import { Topic } from "@/types/topic";

// ─── Track-specific content config ────────────────────────────────────────────

interface HomePageClientProps {
  track: Track;
  theory: number;
  debug: number;
  output: number;
  polyfill: number;
  topics: Topic[];
  blogs: unknown[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePageClient({
  theory: theoryCt,
  debug: debugCt,
  output: outputCt,
  polyfill: polyfillCt,
  topics,
}: HomePageClientProps) {
  const { user, progress } = useAuth();
  const { track } = useTrack();
  const router = useRouter();
  const prevTrack = useRef(track);

  // When user switches track client-side, refresh server data
  useEffect(() => {
    if (prevTrack.current !== track) {
      prevTrack.current = track;
      router.refresh();
    }
  }, [track, router]);

  const trackCfg = TRACK_MAP[track];
  const hero_content = TRACK_HERO[track];
  const whyItems = TRACK_WHY[track];
  const modes = TRACK_MODES[track];

  const ctaHref = user ? "/dashboard" : "/auth";
  const ctaLabel = user ? "Go to Dashboard" : "Start Free — No Card Needed";

  // Real counts from server (fall back to 0 so UI doesn't break before data loads)
  const totalQs = theoryCt + outputCt + debugCt + polyfillCt;
  const topicsCt = topics?.length ?? 0;

  // Free count = theory questions (they're all free per your copy)
  const freeCount = theoryCt > 0 ? theoryCt : 90;

  return (
    <main css={page}>
      <div css={purpleGlow} />
      <div css={greenGlow} />
      <div css={wrap}>
        {/* ── HERO ── */}
        <div css={hero} id="features">
          <div css={badge}>
            <Zap size={10} /> {hero_content.badge}
          </div>
          <h1 css={h1}>
            {hero_content.title}
            <br />
            <span css={grad}>{hero_content.accent}</span>
          </h1>
          <p css={sub}>{hero_content.sub}</p>
          <div css={ctas}>
            <Link href="/sprint" css={btnP}>
              ⚡ Try the Sprint <ArrowRight size={16} />
            </Link>
            <a href={ctaHref} css={btnO}>
              <Zap size={14} /> {ctaLabel}
            </a>
          </div>
        </div>

        {/* ── FREE CALLOUT ── */}
        <div css={freeBanner}>
          <CheckCircle size={15} color={C.green} style={{ flexShrink: 0 }} />
          <span
            style={{ fontSize: "0.9375rem", color: C.green, fontWeight: 600 }}
          >
            {freeCount}+ {hero_content.freeLine}
          </span>
          <span style={{ fontSize: "0.875rem", color: C.muted }}>
            No card. No trial. No paywall.
          </span>
        </div>

        {/* ── STATS ── */}
        <div css={statsRow}>
          {[
            { n: totalQs > 0 ? `${totalQs}+` : "250+", l: "Questions" },
            { n: "4", l: "Practice modes" },
            { n: topicsCt > 0 ? `${topicsCt}` : "40", l: "Topic guides" },
            { n: "6", l: "AI tools" },
          ].map(({ n, l }) => (
            <div key={l} css={statCell}>
              <div css={statN}>{n}</div>
              <div css={statL}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── AI DEMO ── */}
        <div css={sec}>
          <p css={eye(C.accent)}>AI Answer Evaluator</p>
          <h2 css={sh2}>Know exactly where you stand</h2>
          <p css={ssub}>
            Type your answer. Get scored 1–10 with specific gaps — not "great
            job".
          </p>
          <div css={demoShell}>
            <div css={demoBar}>
              <div css={dd(C.red)} />
              <div css={dd(C.amber)} />
              <div css={dd(C.green)} />
              <span css={demoTitle}>JSPrep Pro · Answer Evaluator</span>
            </div>
            <div css={demoInner}>
              <div css={demoQL}>
                <span css={demoPill}>{trackCfg.label}</span>
                <span css={demoPill}>Core</span>
              </div>
              <div css={demoQ}>
                {track === "javascript" &&
                  "What is a closure in JavaScript, and why is it useful?"}
                {track === "react" &&
                  "Explain the difference between useMemo and useCallback in React."}
                {track === "typescript" &&
                  "What is the difference between `interface` and `type` in TypeScript?"}
                {track === "system-design" &&
                  "How would you design a scalable frontend for a real-time chat application?"}
              </div>
              <div css={demoAns}>
                <div css={demoAnsL}>Your answer</div>
                <div css={demoAnsT}>
                  {track === "javascript" &&
                    "A closure is when a function has access to variables from its outer scope, even after the outer function has returned. It's useful for data privacy and keeping state in counters."}
                  {track === "react" &&
                    "useMemo caches a computed value, useCallback caches a function. Both take a dependency array and only recompute when those deps change. You'd use useMemo for expensive calculations and useCallback when passing functions to child components."}
                  {track === "typescript" &&
                    "An interface is mainly for object shapes and can be extended or merged. A type alias is more flexible — it can represent primitives, unions, and intersections, but can't be re-opened for declaration merging."}
                  {track === "system-design" &&
                    "I'd use WebSockets for real-time messaging, a message queue for reliability, CDN for static assets, and optimistic UI updates on the client side. I'd also implement read receipts via a separate HTTP endpoint to reduce WebSocket traffic."}
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
                      color: C.muted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Good — room to grow
                  </span>
                </div>
                <div css={demoFb}>
                  {track === "javascript" && (
                    <>
                      <span style={{ color: C.green, fontWeight: 600 }}>
                        ✓ Correct on scope retention and persistence.
                      </span>{" "}
                      Missing the key mechanic — closures work because of{" "}
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        lexical scoping
                      </span>
                      . A senior answer would mention the{" "}
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        module pattern
                      </span>{" "}
                      or{" "}
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        React hooks
                      </span>{" "}
                      as real-world usage.
                    </>
                  )}
                  {track === "react" && (
                    <>
                      <span style={{ color: C.green, fontWeight: 600 }}>
                        ✓ Core definitions are correct.
                      </span>{" "}
                      Missing:{" "}
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        referential equality
                      </span>{" "}
                      — useCallback exists because functions are recreated every
                      render, breaking React.memo. Also missed that useMemo is
                      often overused; profiling should come first.
                    </>
                  )}
                  {track === "typescript" && (
                    <>
                      <span style={{ color: C.green, fontWeight: 600 }}>
                        ✓ Declaration merging distinction is spot-on.
                      </span>{" "}
                      Add:{" "}
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        interfaces can `extend` other interfaces and classes
                      </span>
                      , while types use `&` for intersection. A senior answer
                      mentions when to prefer each in a codebase style guide.
                    </>
                  )}
                  {track === "system-design" && (
                    <>
                      <span style={{ color: C.green, fontWeight: 600 }}>
                        ✓ Good coverage of real-time and CDN.
                      </span>{" "}
                      Missing:{" "}
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        connection management at scale
                      </span>{" "}
                      (WebSocket limit per server),{" "}
                      <span style={{ color: C.text, fontWeight: 600 }}>
                        message ordering guarantees
                      </span>
                      , and how you'd handle offline users reconnecting.
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr css={hr} />

        {/* ── INTERVIEW SPRINT ── */}
        <div css={sec} id="sprint">
          <p css={eye(C.amber)}>⚡ New: Interview Sprint</p>
          <h2 css={sh2}>The fastest way to know if you're ready</h2>
          <p css={ssub}>
            A timed mixed-question challenge. Theory + output + debugging. AI
            judges your answers. One score tells you exactly where you stand.
          </p>
          <div css={sprintClaims}>
            {[
              {
                icon: "🎯",
                title: "Real interview format",
                desc: "Mixed question types under time pressure — exactly how interviews work",
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

          {/* Sprint demo UI — kept as interactive preview */}
          <div css={sprintDemo}>
            <div css={sprintHUD}>
              <div css={sprintHUDLeft}>
                <Zap size={12} style={{ color: C.amber }} />
                <span css={sprintHUDScoreNum}>70</span>
                <span css={sprintHUDScoreLabel}>pts</span>
              </div>
              <div css={sprintHUDProgress}>
                <div css={sprintHUDMeta}>
                  <span style={{ fontWeight: 600, color: C.text }}>
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
                    <span css={sprintCat}>
                      {track === "javascript"
                        ? "Type Coercion"
                        : track === "react"
                          ? "Rendering"
                          : track === "typescript"
                            ? "Type Inference"
                            : "Architecture"}
                    </span>
                  </div>
                  <p css={sprintCardQ}>What does this print?</p>
                  <pre css={sprintCode}>
                    {track === "javascript"
                      ? `console.log([] + [])\nconsole.log([] + {})\nconsole.log({} + [])`
                      : track === "react"
                        ? `const [count, setCount] = useState(0);\nsetCount(count + 1);\nsetCount(count + 1);\nconsole.log(count);`
                        : track === "typescript"
                          ? `type A = string extends any ? 1 : 0;\ntype B = never extends string ? 1 : 0;\ntype C = any extends string ? 1 : 0;`
                          : `// Given: 10k concurrent users\n// Each opens 1 WebSocket connection\n// Your server limit: 1k connections\n// What fails first?`}
                  </pre>
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
                    <span css={sprintCat}>
                      {track === "javascript"
                        ? "Closures"
                        : track === "react"
                          ? "Hooks"
                          : track === "typescript"
                            ? "Generics"
                            : "Caching"}
                    </span>
                  </div>
                  <p css={sprintEvalQ}>
                    {track === "javascript" &&
                      "What is a closure in JavaScript?"}
                    {track === "react" &&
                      "When should you use useCallback vs useMemo?"}
                    {track === "typescript" &&
                      "What are TypeScript generics and when do you use them?"}
                    {track === "system-design" &&
                      "Explain cache invalidation strategies for a SPA."}
                  </p>
                  <div css={sprintEvalAnswer}>
                    &ldquo;
                    {track === "javascript" &&
                      "A closure is a function that remembers variables from its outer scope even after the outer function returns..."}
                    {track === "react" &&
                      "useCallback is for functions, useMemo is for values. Both help avoid unnecessary re-renders..."}
                    {track === "typescript" &&
                      "Generics let you write reusable code that works with multiple types. Like templates in other languages..."}
                    {track === "system-design" &&
                      "You can use TTL-based expiry or event-driven invalidation where the server notifies the client..."}
                    &rdquo;
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
                      Good — missing one key detail
                    </div>
                    <div css={sprintEvalFeedRow}>
                      <span css={sprintFeedGood}>✓ Core concept</span>
                      <span css={sprintFeedMiss}>✗ Edge cases</span>
                    </div>
                  </div>
                  <div css={sprintEvalPoints}>+10 pts</div>
                </div>
                <div css={sprintQueue}>
                  <div css={sprintQueueLabel}>Up next</div>
                  <div css={sprintQueueItem}>
                    <span css={sprintQueueDot(C.red)} />
                    <span css={sprintQueueText}>
                      🐛 Find the bug in this code
                    </span>
                  </div>
                  <div css={sprintQueueItem}>
                    <span css={sprintQueueDot(C.accentText)} />
                    <span css={sprintQueueText}>
                      📖 Explain the concept in depth
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
                <div css={sprintInsightRow(C.green)}>
                  <CheckCircle size={10} />
                  <span>
                    <strong>Strong:</strong>{" "}
                    {track === "javascript"
                      ? "Closures · Hoisting · Scope"
                      : track === "react"
                        ? "Hooks · Context · Effects"
                        : track === "typescript"
                          ? "Types · Interfaces · Generics"
                          : "Architecture · Caching · APIs"}
                  </span>
                </div>
                <div css={sprintInsightRow(C.amber)}>
                  <Target size={10} />
                  <span>
                    <strong>Review:</strong>{" "}
                    {track === "javascript"
                      ? "Event Loop · Promises"
                      : track === "react"
                        ? "Performance · Refs · Portals"
                        : track === "typescript"
                          ? "Conditional types · infer"
                          : "Real-time · Micro-frontends"}
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

        {/* ── 4 MODES ── */}
        <div css={sec} id="practice">
          <p css={eye(C.green)}>Four Practice Modes</p>
          <h2 css={sh2}>How real {trackCfg.label} interviews test you</h2>
          <p css={ssub}>
            Most prep sites are theory-only. Real {trackCfg.label} interviews
            use all four.
          </p>
          <div css={modesG}>
            {modes.map((m, i) => {
              // Real question counts per mode
              const realCount =
                i === 0
                  ? theoryCt
                  : i === 1
                    ? outputCt
                    : i === 2
                      ? debugCt
                      : polyfillCt;
              const displayCount =
                realCount > 0 ? realCount : m.label === "Concepts" ? 90 : 60;
              return (
                <Link key={m.label} href={m.href} css={modeCard(m.c)}>
                  <span css={modeE}>{m.emoji}</span>
                  {m.free && <div css={modeFree}>✓ Free</div>}
                  <div css={modeL}>{m.label}</div>
                  <div css={modeC(m.c)}>{displayCount} questions</div>
                  <p css={modeD}>{m.desc}</p>
                  <div css={modeTagRow}>
                    {m.tags.map((t) => (
                      <span key={t} css={modeT(m.c)}>
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── BEYOND QUESTIONS ── */}
        <div css={sec}>
          <p css={eye(C.amber)}>Beyond Questions</p>
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
                  <Trophy size={14} color={C.amber} /> Top Learners This Week
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
                fontWeight: 600,
                color: C.text,
                marginBottom: "1.375rem",
                textAlign: "center",
              }}
            >
              Why devs switch to JSPrep Pro
            </p>
            <div css={whyG}>
              {whyItems.map(({ emoji, label, before, after }) => (
                <div key={label} css={whyItem}>
                  <div css={whyEmoji}>{emoji}</div>
                  <div css={whyLabel}>{label}</div>
                  <div css={whyBefore}>
                    <span style={{ color: C.red, flexShrink: 0 }}>✗</span>
                    {before}
                  </div>
                  <div css={whyAfter}>
                    <span style={{ color: C.green, flexShrink: 0 }}>✓</span>
                    {after}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr css={hr} />

        {/* ── TESTIMONIALS ── */}
        <div css={sec}>
          <p css={eye(C.amber)}>Real developers. Real offers.</p>
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
                      <Star key={i} size={13} fill={C.amber} color={C.amber} />
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

        {/* ── TOPIC CARDS — from server props ── */}
        {topics && topics.length > 0 && (
          <div css={sec}>
            <p css={eye(C.accentText)}>{topicsCt} Topic Deep-Dives</p>
            <h2 css={sh2}>Every {trackCfg.label} concept, interview-ready</h2>
            <p css={ssub}>
              Each topic has a mental model, full explanation, cheat sheet, and
              practice questions. Not just a Q&A list.
            </p>
            <div css={tpGrid}>
              {topics.slice(0, 6).map((t) => (
                <Link key={t.slug} href={`/${t.slug}`} css={tpCard(C.accent)}>
                  <div css={tpDot(C.amber)} />
                  <div css={tpName}>{t.title}</div>
                  <div css={tpMeta}>
                    <span css={tpDiff(C.accent3)}>{t.difficulty}</span>
                    <span css={tpQs}>{t.questionCount} questions</span>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <Link href={`/topics/${track}`} css={btnO}>
                See all {topicsCt} topics <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* ── AI TOOLS ── */}
        <div css={sec}>
          <p css={eye(C.accent)}>6 AI Features</p>
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

        {/* ── PRICING ── */}
        <div css={sec} id="pricing">
          <p css={eye(C.green)}>Pricing</p>
          <h2 css={sh2}>Simple. Transparent.</h2>
          <p css={ssub}>
            Start free with {freeCount} real questions and AI feedback from day
            one.
          </p>
          <div css={priceG}>
            <div css={priceC}>
              <div
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: C.muted,
                  marginBottom: "0.5rem",
                }}
              >
                Free
              </div>
              <div
                style={{
                  fontSize: "2.75rem",
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                  letterSpacing: "-0.03em",
                }}
              >
                ₹0
              </div>
              <div css={pNote}>Forever free — no card needed</div>
              <ul css={pFeats}>
                {FREE_F.map((f) => (
                  <li key={f} css={pFeat}>
                    <CheckCircle
                      size={13}
                      color={C.green}
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
              <div
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: C.accentText,
                  marginBottom: "0.5rem",
                }}
              >
                Pro
              </div>
              <div
                style={{
                  fontSize: "2.75rem",
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                  letterSpacing: "-0.03em",
                }}
              >
                ₹{process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY || 199}
                <span css={pPer}>/month</span>
              </div>
              <div css={pNote}>Less than a coffee. Cancel anytime.</div>
              <ul css={pFeats}>
                {proFeatures.map((f) => (
                  <li key={f} css={pFeat}>
                    <CheckCircle
                      size={13}
                      color={C.accent}
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <ProCTA />
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div css={btmCta}>
          <h2 css={btmH}>Ready to prep smarter?</h2>
          <p css={btmD}>
            {freeCount} questions free. AI feedback from question one. No card
            needed.
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

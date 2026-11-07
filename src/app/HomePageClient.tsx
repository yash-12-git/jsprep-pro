/** @jsxImportSource @emotion/react */
"use client";

import Link from "next/link";
import { CheckCircle, Flame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTrack } from "@/contexts/TrackContext";
import type { ReactNode } from "react";

import * as S from "./page.styles";

import {
  AI_TOOLS,
  FREE_F,
  proFeatures,
  TRACK_HERO,
  TRACK_MODES,
  TRACK_WHY,
} from "@/data/homepageStaticData";
import ProCTA from "@/components/home/ProCTA";
import { Track, TRACK_MAP } from "@/lib/tracks";
import { Topic } from "@/types/topic";
import { usePricing } from "@/hooks/usePricing";
import { RoadmapBanner } from "@/components/home/RoadmapBanner";

// ─── Track-specific sample content ────────────────────────────────────────────

const EVAL_DEMO: Record<Track, { q: string; a: string; fb: ReactNode }> = {
  javascript: {
    q: "What is a closure in JavaScript, and why is it useful?",
    a: "A closure is when a function has access to variables from its outer scope, even after the outer function has returned. It’s useful for data privacy and keeping state in counters.",
    fb: (
      <>
        <span className="ok">Correct on scope retention and persistence.</span>{" "}
        Missing the key mechanic: closures work because of{" "}
        <strong>lexical scoping</strong>. A senior answer would mention the{" "}
        <strong>module pattern</strong> or <strong>React hooks</strong> as
        real-world usage.
      </>
    ),
  },
  react: {
    q: "Explain the difference between useMemo and useCallback in React.",
    a: "useMemo caches a computed value, useCallback caches a function. Both take a dependency array and only recompute when those deps change. You’d use useMemo for expensive calculations and useCallback when passing functions to child components.",
    fb: (
      <>
        <span className="ok">Core definitions are correct.</span> Missing:{" "}
        <strong>referential equality</strong>. useCallback exists because
        functions are recreated every render, breaking React.memo. Also missed
        that useMemo is often overused; profiling should come first.
      </>
    ),
  },
  typescript: {
    q: "What is the difference between `interface` and `type` in TypeScript?",
    a: "An interface is mainly for object shapes and can be extended or merged. A type alias is more flexible: it can represent primitives, unions, and intersections, but can’t be re-opened for declaration merging.",
    fb: (
      <>
        <span className="ok">Declaration merging distinction is spot-on.</span>{" "}
        Add: <strong>interfaces can `extend` other interfaces and classes</strong>
        , while types use `&` for intersection. A senior answer mentions when to
        prefer each in a codebase style guide.
      </>
    ),
  },
  "system-design": {
    q: "How would you design a scalable frontend for a real-time chat application?",
    a: "I’d use WebSockets for real-time messaging, a message queue for reliability, CDN for static assets, and optimistic UI updates on the client side. I’d also implement read receipts via a separate HTTP endpoint to reduce WebSocket traffic.",
    fb: (
      <>
        <span className="ok">Good coverage of real-time and CDN.</span> Missing:{" "}
        <strong>connection management at scale</strong> (WebSocket limit per
        server), <strong>message ordering guarantees</strong>, and how you’d
        handle offline users reconnecting.
      </>
    ),
  },
};

const SPRINT_DEMO: Record<
  Track,
  {
    cat: string;
    code: string;
    evalCat: string;
    evalQ: string;
    evalA: string;
    strong: string;
    review: string;
  }
> = {
  javascript: {
    cat: "Type Coercion",
    code: `console.log([] + [])\nconsole.log([] + {})\nconsole.log({} + [])`,
    evalCat: "Closures",
    evalQ: "What is a closure in JavaScript?",
    evalA: "A closure is a function that remembers variables from its outer scope even after the outer function returns…",
    strong: "Closures, Hoisting, Scope",
    review: "Event Loop, Promises",
  },
  react: {
    cat: "Rendering",
    code: `const [count, setCount] = useState(0);\nsetCount(count + 1);\nsetCount(count + 1);\nconsole.log(count);`,
    evalCat: "Hooks",
    evalQ: "When should you use useCallback vs useMemo?",
    evalA: "useCallback is for functions, useMemo is for values. Both help avoid unnecessary re-renders…",
    strong: "Hooks, Context, Effects",
    review: "Performance, Refs, Portals",
  },
  typescript: {
    cat: "Type Inference",
    code: `type A = string extends any ? 1 : 0;\ntype B = never extends string ? 1 : 0;\ntype C = any extends string ? 1 : 0;`,
    evalCat: "Generics",
    evalQ: "What are TypeScript generics and when do you use them?",
    evalA: "Generics let you write reusable code that works with multiple types. Like templates in other languages…",
    strong: "Types, Interfaces, Generics",
    review: "Conditional types, infer",
  },
  "system-design": {
    cat: "Architecture",
    code: `// Given: 10k concurrent users\n// Each opens 1 WebSocket connection\n// Your server limit: 1k connections\n// What fails first?`,
    evalCat: "Caching",
    evalQ: "Explain cache invalidation strategies for a SPA.",
    evalA: "You can use TTL-based expiry or event-driven invalidation where the server notifies the client…",
    strong: "Architecture, Caching, APIs",
    review: "Real-time, Micro-frontends",
  },
};

const SPRINT_CLAIMS = [
  {
    title: "Real interview format",
    desc: "Mixed question types under time pressure, exactly how interviews work",
  },
  {
    title: "AI scores theory answers",
    desc: "No multiple choice. You explain in your own words, AI grades like a senior engineer",
  },
  {
    title: "Strengths & weak areas",
    desc: "After each sprint: know exactly which categories to keep drilling",
  },
  {
    title: "Shareable score card",
    desc: "Download or tweet your result, and challenge your network to beat your score",
  },
];

export interface HomeTrackData {
  theory: number;
  debug: number;
  output: number;
  polyfill: number;
  topics: Pick<Topic, "slug" | "title" | "difficulty" | "questionCount">[];
}

interface HomePageClientProps {
  /** Every track's summary, so the page can be cached and still follow the visitor's track. */
  tracks: Partial<Record<Track, HomeTrackData>>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePageClient({ tracks }: HomePageClientProps) {
  const { user } = useAuth();
  const { track: chosen } = useTrack();
  const track: Track = tracks[chosen] ? chosen : "javascript";
  const {
    theory: theoryCt,
    debug: debugCt,
    output: outputCt,
    polyfill: polyfillCt,
    topics,
  } = tracks[track] ?? {
    theory: 0,
    debug: 0,
    output: 0,
    polyfill: 0,
    topics: [],
  };
  const pricing = usePricing();

  const trackCfg = TRACK_MAP[track];
  const evalDemo = EVAL_DEMO[track];
  const sprintDemo = SPRINT_DEMO[track];
  const hero_content = TRACK_HERO[track];
  const whyItems = TRACK_WHY[track];
  const modes = TRACK_MODES[track];

  const ctaHref = user ? "/dashboard" : "/auth";
  const ctaLabel = user ? "Go to Dashboard" : "Start free, no card needed";

  // Real counts from server (fall back to 0 so UI doesn't break before data loads)
  const totalQs = theoryCt + outputCt + debugCt + polyfillCt;
  const topicsCt = topics?.length ?? 0;

  // Every question is free to read and practise.
  const freeCount = totalQs;

  return (
    <main css={S.page} id="main">
      <div css={S.wrap}>
        {/* ── HERO ── */}
        <section css={S.hero} id="features">
          <div css={S.heroText}>
            <h1 css={S.h1}>
              {hero_content.title} {hero_content.accent}
            </h1>
            <p css={S.sub}>{hero_content.sub}</p>
            <div css={S.heroCtas}>
              <Link href="/sprint" css={S.btnP}>
                Try the Sprint
              </Link>
              <a href={ctaHref} css={S.btnO}>
                {ctaLabel}
              </a>
            </div>
            <p css={S.freeLine}>
              <strong>
                {freeCount} {hero_content.freeLine}
              </strong>{" "}
              No card needed.
            </p>
          </div>

          {/* ── AI DEMO ── */}
          <figure css={S.panel} style={{ margin: 0 }}>
            <div css={S.panelHead}>
              <h2 css={S.evalTitle}>Know exactly where you stand</h2>
              <figcaption css={S.evalLine}>AI Answer Evaluator</figcaption>
            </div>
            <div css={S.panelBody}>
              <div css={S.chipRow}>
                <span css={S.chipCool}>{trackCfg.label}</span>
                <span css={S.chip}>Core</span>
              </div>
              <p css={S.demoQ}>{evalDemo.q}</p>
            </div>
            <div css={S.panelBody}>
              <span css={S.demoAnsL}>Your answer</span>
              <p css={S.demoAnsT}>{evalDemo.a}</p>
            </div>
            <div css={S.demoResult}>
              <div css={S.demoScoreRow}>
                <span css={S.reading}>
                  7<span css={S.readingUnit}>/10</span>
                </span>
                <span css={S.demoVerdict}>Good, room to grow</span>
              </div>
              <p css={S.demoFb}>{evalDemo.fb}</p>
              <p css={S.skipLine}>
                Type your answer. Get scored 1 to 10 with specific gaps, not
                “great job”.
              </p>
            </div>
          </figure>
        </section>

        {/* ── STATS ── */}
        <div css={S.statsRow}>
          {[
            { n: totalQs > 0 ? `${totalQs}+` : "250+", l: "Questions" },
            { n: "4", l: "Practice modes" },
            { n: topicsCt > 0 ? `${topicsCt}` : "40", l: "Topic guides" },
            { n: "6", l: "AI tools" },
          ].map(({ n, l }) => (
            <div key={l} css={S.statCell}>
              <div css={S.statN}>{n}</div>
              <div css={S.statL}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── 4 MODES ── */}
        <section css={S.sec} id="practice">
          <div css={S.headBlock}>
            <h2 css={S.sh2}>1. How real {trackCfg.label} interviews test you</h2>
            <p css={S.ssub}>
              Most prep sites are theory-only. Real {trackCfg.label} interviews
              use all four.
            </p>
          </div>
          <ul css={S.modeList}>
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
                <li key={m.label}>
                  <Link href={m.href} css={S.modeRow}>
                    <span css={S.modeName}>
                      {m.label}
                      <span css={S.chipOk}>Free</span>
                    </span>
                    <span css={S.modeCount}>{displayCount} questions</span>
                    <span css={S.modeDesc}>{m.desc}</span>
                    <span css={S.chipRow}>
                      {m.tags.map((t) => (
                        <span key={t} css={S.chip}>
                          {t}
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* ── INTERVIEW SPRINT ── */}
      <section css={[S.sec, S.band]} id="sprint">
        <div css={S.wrap}>
          <div css={S.headBlock}>
            <h2 css={S.sh2}>2. The fastest way to know if you’re ready</h2>
            <p css={S.ssub}>
              A timed mixed-question challenge. Theory + output + debugging. AI
              judges your answers. One score tells you exactly where you stand.
            </p>
          </div>
          <div css={S.sprintGrid}>
            <ul css={S.sprintClaims}>
              {SPRINT_CLAIMS.map(({ title, desc }) => (
                <li key={title} css={S.sprintClaim}>
                  <div css={S.claimTitle}>{title}</div>
                  <p css={S.claimDesc}>{desc}</p>
                </li>
              ))}
            </ul>

            {/* Sprint demo UI, kept as a preview */}
            <figure css={S.panel} style={{ margin: 0 }}>
              <div css={S.sprintHUD}>
                <figcaption>Interview Sprint</figcaption>
                <span css={S.measured}>70 pts</span>
                <span css={S.measured}>Q5 / 10</span>
                <div css={S.hudTrack}>
                  <div css={S.hudFill(40)} />
                </div>
                <span>40% complete</span>
                <span css={S.measured}>7:23</span>
              </div>

              <div css={S.sprintBody}>
                <div css={S.sprintCol}>
                  <span css={S.colLabel}>Active question</span>
                  <div css={S.chipRow}>
                    <span css={S.chipCool}>Output</span>
                    <span css={S.chip}>Core</span>
                    <span css={S.chip}>{sprintDemo.cat}</span>
                  </div>
                  <p css={S.sprintQ}>What does this print?</p>
                  <pre css={S.sprintCode}>{sprintDemo.code}</pre>
                  <div css={S.sprintInputRow}>
                    <div css={S.fakeInput}>Type the expected output…</div>
                    <div css={S.fakeBtn}>Check</div>
                  </div>
                  <p css={S.skipLine}>Skip</p>
                </div>

                <div css={S.sprintCol}>
                  <span css={S.colLabel}>Previous, AI scored</span>
                  <div css={S.chipRow}>
                    <span css={S.chipCool}>Theory</span>
                    <span css={S.chip}>{sprintDemo.evalCat}</span>
                  </div>
                  <p css={S.sprintQ}>{sprintDemo.evalQ}</p>
                  <p css={S.evalQuote}>“{sprintDemo.evalA}”</p>
                  <div css={S.evalScore}>
                    <span css={S.reading}>
                      8<span css={S.readingUnit}>/10</span>
                    </span>
                    <span css={S.chipCool}>B+</span>
                    <span css={S.measured}>+10 pts</span>
                  </div>
                  <p css={S.demoVerdict}>Good, missing one key detail</p>
                  <div css={S.chipRow} style={{ marginTop: "var(--space-xs)" }}>
                    <span css={S.chipOk}>Core concept</span>
                    <span css={S.chip}>Missed: edge cases</span>
                  </div>
                  <ul css={S.queueList}>
                    <li css={S.label}>Up next</li>
                    <li>Find the bug in this code</li>
                    <li>Explain the concept in depth</li>
                  </ul>
                </div>
              </div>

              <div css={S.resultRow}>
                <div>
                  <span css={S.colLabel}>Sample result</span>
                  <span css={S.reading}>
                    172<span css={S.readingUnit}>/200 pts</span>
                  </span>
                  <div css={S.measured}>86% accuracy</div>
                </div>
                <div css={S.resultNote}>
                  <p>
                    <strong>Strong:</strong> {sprintDemo.strong}
                  </p>
                  <p>
                    <strong>Review:</strong> {sprintDemo.review}
                  </p>
                </div>
                <div css={S.chipRow}>
                  <span css={S.chip}>Share score</span>
                  <span css={S.chip}>Download card</span>
                </div>
              </div>
            </figure>
          </div>

          <div css={S.sprintCTARow}>
            <Link href={user ? "/sprint" : "/auth"} css={S.sprintStartBtn}>
              Start Your Sprint
            </Link>
            <span css={S.sprintCTASub}>
              Free 5-question warmup, 10 with a free account
            </span>
          </div>
        </div>
      </section>

      <div css={S.wrap}>
        <section css={S.sec} id="roadmap">
          <RoadmapBanner />
        </section>

        {/* ── BEYOND QUESTIONS ── */}
        <section css={S.sec} style={{ paddingTop: 0 }}>
          <div css={S.headBlock}>
            <h2 css={S.sh2}>4. A full interview prep ecosystem</h2>
            <p css={S.ssub}>
              Not just a list of Q&As: daily habits and depth.
            </p>
          </div>

          <div>
            <div css={S.qotdCard}>
              <div>
                <span css={S.chipPerson}>
                  <Flame size={16} aria-hidden="true" /> Question of the Day, free
                </span>
                <div css={S.qotdTitle}>
                  One question a day. Answer it. Get AI feedback. Stay ready.
                </div>
                <p css={S.qotdSub}>
                  Builds the daily prep habit without overwhelm. Free for
                  everyone, no Pro needed.
                </p>
              </div>
              <Link href={ctaHref} css={S.qotdBtn}>
                Try today’s question
              </Link>
            </div>

          </div>

          <h3 css={S.diffHead}>Why devs switch to JSPrep Pro</h3>
          <div css={S.panel}>
            {whyItems.map(({ label, before, after }) => (
              <div key={label} css={S.diffRow}>
                <div css={S.diffLabel}>{label}</div>
                <div css={S.diffMinus}>
                  <span aria-label="Before">−</span>
                  <span>{before}</span>
                </div>
                <div css={S.diffPlus}>
                  <span aria-label="After">+</span>
                  <span>{after}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOPIC CARDS, from server props ── */}
        {topics && topics.length > 0 && (
          <section css={S.sec} style={{ paddingTop: 0 }}>
            <div css={S.headBlock}>
              <h2 css={S.sh2}>Every {trackCfg.label} concept, interview-ready</h2>
              <p css={S.ssub}>
                Each topic has a mental model, full explanation, cheat sheet, and
                practice questions. Not just a Q&A list.
              </p>
            </div>
            <ul css={S.tpList}>
              {topics.slice(0, 6).map((t) => (
                <li key={t.slug}>
                  <Link href={`/${t.slug}`} css={S.tpRow}>
                    <span css={S.tpName}>{t.title}</span>
                    <span css={S.tpDiff}>{t.difficulty}</span>
                    <span css={S.modeCount}>{t.questionCount} questions</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div css={S.tpMore}>
              <Link href={`/topics/${track}`} css={S.btnO}>
                See all {topicsCt} topics
              </Link>
            </div>
          </section>
        )}

        {/* ── AI TOOLS ── */}
        <section css={S.sec} style={{ paddingTop: 0 }}>
          <div css={S.headBlock}>
            <h2 css={S.sh2}>Your AI interview coach</h2>
            <p css={S.ssub}>
              Not a chatbot you switch to. AI is inside every question, every
              answer, every debug.
            </p>
          </div>
          <div css={S.aiG}>
            {AI_TOOLS.map(({ icon: Icon, label, desc }) => (
              <div key={label} css={S.aiCard}>
                <Icon size={24} aria-hidden="true" />
                <div css={S.aiLab}>
                  {label}
                  <span css={S.chip}>Pro</span>
                </div>
                <p css={S.aiDsc}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── PRICING ── */}
      <section css={[S.sec, S.band]} id="pricing">
        <div css={S.wrap}>
          <div css={S.headBlock}>
            <h2 css={S.sh2}>Pricing</h2>
            <p css={S.ssub}>
              Practise all {freeCount} questions free. Pro adds unlimited AI
              mock interviews and your full study plan.
            </p>
          </div>
          <div css={S.priceG}>
            <div css={S.priceC}>
              <div css={S.priceName}>Free</div>
              <div css={S.pPrice}>
                {pricing.symbol}0<span css={S.pPer}>/month</span>
              </div>
              <div css={S.pNote}>No card needed</div>
              <ul css={S.pFeats}>
                {FREE_F.map((f) => (
                  <li key={f} css={S.pFeat}>
                    <CheckCircle size={16} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} css={S.pBtnF}>
                {user ? "Go to Dashboard" : "Start free"}
              </Link>
            </div>

            <div css={S.priceC}>
              <div css={S.priceName}>
                Pro <span css={S.chipPerson}>Popular</span>
              </div>
              <div css={S.pPrice}>
                {pricing.symbol}
                {pricing.display ||
                  process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY ||
                  199}
                <span css={S.pPer}>/month</span>
              </div>
              <div css={S.pNote}>Less than a coffee. Cancel anytime.</div>
              <ul css={S.pFeats}>
                {proFeatures.map((f) => (
                  <li key={f} css={S.pFeat}>
                    <CheckCircle size={16} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <ProCTA />
            </div>
          </div>
        </div>
      </section>

      <div css={S.wrap}>
        {/* ── BOTTOM CTA ── */}
        <div css={S.btmCta}>
          <h2 css={S.sh2}>Ready to prep smarter?</h2>
          <div>
            <p css={S.btmD}>
              All {freeCount} questions free, with AI scoring. No card needed.
            </p>
            <Link href={ctaHref} css={S.btnP}>
              {ctaLabel}
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

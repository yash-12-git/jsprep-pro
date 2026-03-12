/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState } from "react";
import { Zap, Timer, Shuffle, Brain, Code2, Bug, Lock } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { SprintConfig } from "../types";
import PaywallBanner from "@/components/ui/PaywallBanner/page";

const float = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}`;
const glow = keyframes`0%,100%{opacity:0.4}50%{opacity:0.8}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  position: relative;
  overflow: hidden;
`;

const glowBall1 = css`
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(124, 106, 247, 0.12) 0%,
    transparent 70%
  );
  top: -100px;
  left: -100px;
  pointer-events: none;
  animation: ${glow} 4s ease infinite;
`;

const glowBall2 = css`
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(247, 199, 106, 0.08) 0%,
    transparent 70%
  );
  bottom: -80px;
  right: -80px;
  pointer-events: none;
  animation: ${glow} 5s ease infinite 1.5s;
`;

const inner = css`
  width: 100%;
  max-width: 560px;
  animation: ${fadeUp} 0.5s ease;
  position: relative;
  z-index: 1;
`;

const badge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.accent};
  background: rgba(124, 106, 247, 0.12);
  border: 1px solid rgba(124, 106, 247, 0.25);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 1.25rem;
`;

const headline = css`
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 900;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
`;

const accent = css`
  background: linear-gradient(135deg, ${C.accent}, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const tagline = css`
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.55;
  margin-bottom: 2rem;
`;

const statsRow = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
  margin-bottom: 2rem;
`;

const statCard = css`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.xl};
  padding: 0.875rem;
  text-align: center;
`;

const statIcon = css`
  font-size: 1.25rem;
  margin-bottom: 0.375rem;
`;

const statLabel = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ─── Question count selector ──────────────────────────────────────────────────

const sectionLabel = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.625rem;
`;

const countGrid = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.75rem;
`;

const countOption = (active: boolean, isPro: boolean, locked: boolean) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 0.5rem;
  border-radius: ${RADIUS.xl};
  border: 1px solid
    ${active
      ? C.accent
      : locked
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.09)"};
  background: ${active
    ? "rgba(124,106,247,0.12)"
    : locked
      ? "rgba(0,0,0,0.2)"
      : "rgba(255,255,255,0.03)"};
  cursor: ${locked ? "not-allowed" : "pointer"};
  transition: all 0.15s;
  opacity: ${locked ? 0.5 : 1};
  ${!active &&
  !locked &&
  "&:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }"}
`;

const countNum = (active: boolean) => css`
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1;
  color: ${active ? "#c4b5fd" : "rgba(255,255,255,0.7)"};
`;

const countSub = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 0.25rem;
`;

const lockIcon = css`
  position: absolute;
  top: 4px;
  right: 6px;
  color: rgba(255, 255, 255, 0.25);
`;

const proBadge = css`
  font-size: 0.55rem;
  font-weight: 800;
  color: ${C.accent2};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.125rem;
`;

// ─── Mode info ────────────────────────────────────────────────────────────────

const modeInfo = css`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  margin-bottom: 1.75rem;
`;

const modeRow = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.25rem 0;
`;

const modeDot = (color: string) => css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${color};
  flex-shrink: 0;
`;

// ─── Start button ─────────────────────────────────────────────────────────────

const startBtn = css`
  width: 100%;
  padding: 1rem;
  border-radius: ${RADIUS.xl};
  font-size: 1.0625rem;
  font-weight: 900;
  background: linear-gradient(135deg, ${C.accent}, #9b8bff);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  letter-spacing: -0.01em;
  transition: all 0.2s;
  box-shadow: 0 4px 24px rgba(124, 106, 247, 0.3);
  animation: ${float} 3s ease infinite;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(124, 106, 247, 0.45);
  }
  &:active {
    transform: translateY(0);
  }
`;

const upgradeNote = css`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
  a {
    color: ${C.accent2};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  isPro: boolean;
  onStart: (config: SprintConfig) => void;
  uid: string | null;
}

const OPTIONS: Array<{
  count: SprintConfig["questionCount"];
  label: string;
  requiresPro: boolean;
}> = [
  { count: 5, label: "Warmup", requiresPro: false },
  { count: 10, label: "Sprint", requiresPro: true },
  { count: 15, label: "Challenge", requiresPro: true },
  { count: 20, label: "Marathon", requiresPro: true },
];

export default function SprintLobby({ isPro, onStart, uid }: Props) {
  const [selected, setSelected] = useState<SprintConfig["questionCount"]>(
    isPro ? 10 : 5,
  );
  const [showPaywall, setShowPaywall] = useState(false);

  const selectedOption = OPTIONS.find((o) => o.count === selected)!;
  const durationMins =
    selected <= 5 ? 5 : selected === 10 ? 10 : selected === 15 ? 15 : 20;

  function handleSelect(o: (typeof OPTIONS)[0]) {
    if (o.requiresPro && !isPro) return;
    setSelected(o.count);
  }

  return (
    <div css={page}>
      {showPaywall && (
        <PaywallBanner
          reason={`Free users can attempt 5-question warmup. Upgrade for all!`}
          onClose={() => setShowPaywall(false)}
        />
      )}
      <div css={glowBall1} />
      <div css={glowBall2} />

      <div css={inner}>
        <div css={badge}>
          <Zap size={10} /> JavaScript Interview Sprint
        </div>

        <h1 css={headline}>
          Are you truly
          <br />
          <span css={accent}>interview ready?</span>
        </h1>

        <p css={tagline}>
          A timed challenge mixing theory, output prediction, and debugging. No
          Googling. No hints. Just you and the questions.
        </p>

        {/* Stats */}
        <div css={statsRow}>
          <div css={statCard}>
            <div css={statIcon}>
              <Shuffle
                size={18}
                style={{ color: C.accent, margin: "0 auto" }}
              />
            </div>
            <div
              style={{ fontWeight: 800, color: "white", fontSize: "0.875rem" }}
            >
              Mixed
            </div>
            <div css={statLabel}>question types</div>
          </div>
          <div css={statCard}>
            <div css={statIcon}>
              <Timer size={18} style={{ color: C.accent2, margin: "0 auto" }} />
            </div>
            <div
              style={{ fontWeight: 800, color: "white", fontSize: "0.875rem" }}
            >
              {durationMins} min
            </div>
            <div css={statLabel}>time limit</div>
          </div>
          <div css={statCard}>
            <div css={statIcon}>
              <Brain size={18} style={{ color: C.accent3, margin: "0 auto" }} />
            </div>
            <div
              style={{ fontWeight: 800, color: "white", fontSize: "0.875rem" }}
            >
              AI
            </div>
            <div css={statLabel}>evaluates theory</div>
          </div>
        </div>

        {/* Count selector */}
        <div css={sectionLabel}>Choose your challenge</div>
        <div css={countGrid}>
          {OPTIONS.map((o) => {
            const locked = o.requiresPro && !isPro;
            const active = selected === o.count;
            return (
              <div
                key={o.count}
                css={countOption(active, isPro, locked)}
                onClick={() => handleSelect(o)}
              >
                {locked && <Lock size={9} css={lockIcon} />}
                <div css={countNum(active)}>{o.count}</div>
                <div css={countSub}>Qs</div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: active ? "#c4b5fd" : "rgba(255,255,255,0.3)",
                    marginTop: "0.125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {o.label}
                </div>
                {locked && <div css={proBadge}>Pro</div>}
              </div>
            );
          })}
        </div>

        {/* Mode info */}
        <div css={modeInfo}>
          <div css={modeRow}>
            <div css={modeDot("#c4b5fd")} />
            <Brain size={12} style={{ color: "#c4b5fd" }} />
            Theory: AI evaluates your verbal answer +10 / +3 pts
          </div>
          <div css={modeRow}>
            <div css={modeDot(C.accent3)} />
            <Code2 size={12} style={{ color: C.accent3 }} />
            Output: Predict the console.log exactly +10 / +3 pts
          </div>
          <div css={modeRow}>
            <div css={modeDot(C.danger)} />
            <Bug size={12} style={{ color: C.danger }} />
            Debug: Spot the bug, self-mark your answer +10 / +3 pts
          </div>
        </div>

        {/* Start */}
        <button
          css={startBtn}
          onClick={() => onStart({ questionCount: selected })}
        >
          <Zap size={18} />
          Start {selected}-Question Sprint
        </button>

        {!isPro && (
          <div css={upgradeNote}>
            Free accounts get a 5-question preview.{" "}
            <a
              onClick={() => {
                !uid ? (window.location.href = "/auth") : setShowPaywall(true);
              }}
            >
              Upgrade to Pro
            </a>{" "}
            for full sprints.
          </div>
        )}
      </div>
    </div>
  );
}

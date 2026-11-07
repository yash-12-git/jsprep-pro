/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import { useState } from "react";
import { Zap, Timer, Shuffle, Brain, Code2, Bug, Lock } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import type { SprintConfig } from "../types";
import PaywallBanner from "@/components/ui/PaywallBanner/page";

const fadeUp = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  background: ${C.bg};
`;

const inner = css`
  width: 100%;
  max-width: 520px;
`;

const badge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 1.25rem;
`;

const headline = css`
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 500;
  color: ${C.text};
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
`;

const accentSpan = css`
  color: ${C.accent};
`;

const tagline = css`
  font-size: 1rem;
  color: ${C.muted};
  line-height: 1.65;
  margin-bottom: 2rem;
`;

const statsRow = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
  margin-bottom: 2rem;
`;

const statCard = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem;
  text-align: center;
`;

const statIcon = css`
  font-size: 1.125rem;
  margin-bottom: 0.375rem;
`;

const statLabel = css`
  font-size: 0.75rem;
  color: ${C.muted};
  font-weight: 500;
`;

// ─── Count selector ───────────────────────────────────────────────────────────

const sectionLabel = css`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.muted};
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
  border-radius: ${RADIUS.lg};
  border: 1px solid ${active ? C.accent : locked ? C.border : C.border};
  background: ${active ? C.accentSubtle : locked ? C.bgSubtle : C.bg};
  cursor: ${locked ? "not-allowed" : "pointer"};
  transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease, opacity 0.12s ease, transform 0.12s ease;
  opacity: ${locked ? 0.5 : 1};
  ${!active &&
  !locked &&
  `&:hover { border-color: ${C.accent}; background: ${C.accentSubtle}; }`}
`;

const countNum = (active: boolean) => css`
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;
  color: ${active ? C.accentText : C.text};
  letter-spacing: -0.02em;
`;

const countSub = css`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.muted};
  margin-top: 0.25rem;
`;

const lockIcon = css`
  position: absolute;
  top: 4px;
  right: 6px;
  color: ${C.muted};
`;

const proBadge = css`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${C.amber};
  margin-top: 0.125rem;
`;

// ─── Mode info ────────────────────────────────────────────────────────────────

const modeInfo = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  margin-bottom: 1.75rem;
`;

const modeRow = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.8125rem;
  color: ${C.muted};
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
  padding: 0.875rem;
  border-radius: ${RADIUS.lg};
  font-size: 1rem;
  font-weight: 500;
  background: ${C.accent};
  border: none;
  color: ${C.accentInk};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  letter-spacing: -0.01em;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const upgradeNote = css`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: ${C.muted};
  a {
    color: ${C.accent};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  isPro?: boolean;
  onStart: (config: SprintConfig) => void;
  uid?: string | null;
}

// Who can pick each size: anyone, a free account, or Pro.
const OPTIONS: Array<{
  count: SprintConfig["questionCount"];
  label: string;
  needs: "none" | "account" | "pro";
}> = [
  { count: 5, label: "Warmup", needs: "none" },
  { count: 10, label: "Sprint", needs: "account" },
  { count: 15, label: "Challenge", needs: "pro" },
  { count: 20, label: "Marathon", needs: "pro" },
];

export default function SprintLobby({ isPro, onStart, uid }: Props) {
  const [selected, setSelected] = useState<SprintConfig["questionCount"]>(
    uid ? 10 : 5,
  );
  const [showPaywall, setShowPaywall] = useState(false);

  const durationMins =
    selected <= 5 ? 5 : selected === 10 ? 10 : selected === 15 ? 15 : 20;

  const lockedBy = (o: (typeof OPTIONS)[0]) =>
    o.needs === "account" && !uid
      ? "Sign in"
      : o.needs === "pro" && !isPro
        ? "Pro"
        : null;

  function handleSelect(o: (typeof OPTIONS)[0]) {
    const lock = lockedBy(o);
    if (lock === "Sign in") {
      window.location.href = "/auth?next=/sprint";
      return;
    }
    if (lock === "Pro") {
      setShowPaywall(true);
      return;
    }
    setSelected(o.count);
  }

  return (
    <div css={page}>
      {showPaywall && (
        <PaywallBanner
          reason="15- and 20-question sprints are part of Pro."
          onClose={() => setShowPaywall(false)}
        />
      )}

      <div css={inner}>
        <div css={badge}>
          <Zap size={10} /> JavaScript Interview Sprint
        </div>

        <h1 css={headline}>
          Are you truly
          <br />
          interview ready?
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
                color={C.accent}
                style={{ margin: "0 auto" }}
              />
            </div>
            <div
              style={{ fontWeight: 500, color: C.text, fontSize: "0.875rem" }}
            >
              Mixed
            </div>
            <div css={statLabel}>question types</div>
          </div>
          <div css={statCard}>
            <div css={statIcon}>
              <Timer size={18} color={C.amber} style={{ margin: "0 auto" }} />
            </div>
            <div
              style={{ fontWeight: 500, color: C.text, fontSize: "0.875rem" }}
            >
              {durationMins} min
            </div>
            <div css={statLabel}>time limit</div>
          </div>
          <div css={statCard}>
            <div css={statIcon}>
              <Brain size={18} color={C.green} style={{ margin: "0 auto" }} />
            </div>
            <div
              style={{ fontWeight: 500, color: C.text, fontSize: "0.875rem" }}
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
            const lock = lockedBy(o);
            const locked = lock !== null;
            const active = selected === o.count;
            return (
              <div
                key={o.count}
                css={countOption(active, !!isPro, locked)}
                onClick={() => handleSelect(o)}
              >
                {locked && <Lock size={9} css={lockIcon} />}
                <div css={countNum(active)}>{o.count}</div>
                <div css={countSub}>Qs</div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: active ? C.accentText : C.muted,
                    marginTop: "0.125rem",
                  }}
                >
                  {o.label}
                </div>
                {lock && <div css={proBadge}>{lock}</div>}
              </div>
            );
          })}
        </div>

        {/* Mode info */}
        <div css={modeInfo}>
          <div css={modeRow}>
            <div css={modeDot(C.accentText)} />
            <Brain size={12} color={C.accentText} />
            Theory: AI scores your written answer +10 / +3 pts
          </div>
          <div css={modeRow}>
            <div css={modeDot(C.green)} />
            <Code2 size={12} color={C.green} />
            Output: Predict the console.log exactly +10 / +3 pts
          </div>
          <div css={modeRow}>
            <div css={modeDot(C.red)} />
            <Bug size={12} color={C.red} />
            Debug: Fix the bug, then mark it yourself against the solution +10 / +3 pts
          </div>
        </div>

        <button
          css={startBtn}
          onClick={() => onStart({ questionCount: selected })}
        >
          <Zap size={18} />
          Start {selected}-Question Sprint
        </button>

        {!uid ? (
          <div css={upgradeNote}>
            <a href="/auth?next=/sprint">Sign in free</a> for 10-question
            sprints and to save your results.
          </div>
        ) : (
          !isPro && (
            <div css={upgradeNote}>
              <a onClick={() => setShowPaywall(true)}>Pro</a> adds 15- and
              20-question sprints.
            </div>
          )
        )}
      </div>
    </div>
  );
}

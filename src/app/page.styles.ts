import { BP } from "@/styles/tokens";
import { C, RADIUS } from "@/styles/tokens";
import { css, keyframes } from "@emotion/react";

export const fadeUp = keyframes`
  from { opacity:0; transform:translateY(16px) }
  to   { opacity:1; transform:translateY(0) }
`;

// shimmer kept for API compatibility — no longer applied to any element
export const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ─── Page shell ───────────────────────────────────────────────────────────────

export const page = css`
  position: relative;
  background: ${C.bg};
  min-height: 100vh;
`;

// Kept as named exports — no visual output on light theme
export const purpleGlow = css`
  display: none;
`;
export const greenGlow = css`
  display: none;
`;

export const wrap = css`
  max-width: 68rem;
  margin: 0 auto;
  padding: 0 1.25rem 5rem;
  position: relative;
  z-index: 1;
  @media (min-width: ${BP.sm}) {
    padding: 0 2rem 6rem;
  }
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const hero = css`
  text-align: center;
  padding: 4rem 0 3rem;
  animation: ${fadeUp} 0.5s ease both;
  @media (min-width: ${BP.sm}) {
    padding: 5.5rem 0 4rem;
  }
`;

export const badge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 0.3125rem 0.875rem;
  border-radius: 100px;
  margin-bottom: 1.75rem;
`;

export const h1 = css`
  font-size: clamp(2.5rem, 7vw, 4.75rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: ${C.text};
  margin-bottom: 1.375rem;
`;

// Kept for JSX compatibility — renders as plain accent-colored text on light bg
export const grad = css`
  // color: ${C.accent};
    background: linear-gradient(
    130deg,
    ${C.accent} 0%,
    ${C.accentSubtle} 35%,
    ${C.accentText} 65%,
    ${C.accent} 100%
  );
  background-size: 200% auto;
  animation: ${shimmer} 5s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const sub = css`
  font-size: clamp(1rem, 1.75vw, 1.0625rem);
  color: ${C.muted};
  max-width: 34rem;
  margin: 0 auto 2.25rem;
  line-height: 1.75;
`;

export const ctas = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  @media (min-width: ${BP.sm}) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const btnP = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: ${C.accent};
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: ${RADIUS.lg};
  text-decoration: none;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
`;

export const btnO = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.875rem 1.625rem;
  color: ${C.muted};
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: ${RADIUS.lg};
  text-decoration: none;
  border: 1px solid ${C.border};
  transition: all 0.15s ease;
  &:hover {
    border-color: ${C.borderStrong};
    color: ${C.text};
    background: ${C.bgHover};
  }
`;

// ─── Free banner ──────────────────────────────────────────────────────────────

export const freeBanner = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem 1.75rem;
  margin: 0 auto 4rem;
  max-width: 42rem;
  animation: ${fadeUp} 0.5s 0.1s ease both;
`;

// ─── Stats row ────────────────────────────────────────────────────────────────

export const statsRow = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  overflow: hidden;
  margin-bottom: 4.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const statCell = css`
  text-align: center;
  padding: 1.75rem 1rem;
  background: ${C.bg};
  border-right: 1px solid ${C.border};
  &:last-child {
    border-right: none;
  }
  &:nth-child(2) {
    border-right: none;
  }
  @media (min-width: ${BP.sm}) {
    &:nth-child(2) {
      border-right: 1px solid ${C.border};
    }
  }
`;

export const statN = css`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${C.text};
  line-height: 1;
  margin-bottom: 0.375rem;
  letter-spacing: -0.03em;
`;

export const statL = css`
  font-size: 0.6875rem;
  color: ${C.muted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

// ─── Section chrome ───────────────────────────────────────────────────────────

export const sec = css`
  margin-bottom: 5rem;
`;

export const eye = (c: string) => css`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${c};
  text-align: center;
  margin-bottom: 0.875rem;
`;

export const sh2 = css`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  text-align: center;
  color: ${C.text};
  margin-bottom: 0.75rem;
`;

export const ssub = css`
  text-align: center;
  color: ${C.muted};
  font-size: 0.9375rem;
  max-width: 30rem;
  margin: 0 auto 2.75rem;
  line-height: 1.75;
`;

// ─── AI Demo shell ────────────────────────────────────────────────────────────

export const demoShell = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  overflow: hidden;
  max-width: 52rem;
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(55, 53, 47, 0.07);
`;

export const demoBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.125rem;
  background: ${C.bgSubtle};
  border-bottom: 1px solid ${C.border};
`;

// Traffic-light dots — keep their conventional colours
export const dd = (c: string) => css`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${c};
`;

export const demoTitle = css`
  font-size: 0.75rem;
  color: ${C.placeholder};
  margin-left: 0.5rem;
  flex: 1;
  text-align: center;
`;

export const demoInner = css`
  padding: 1.75rem;
  @media (min-width: ${BP.sm}) {
    padding: 2.25rem;
  }
`;

export const demoQL = css`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
`;

export const demoPill = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.accentText};
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  padding: 2px 9px;
  border-radius: 100px;
`;

export const demoQ = css`
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: ${C.text};
  font-weight: 600;
  line-height: 1.45;
  margin-bottom: 1.5rem;
`;

export const demoAns = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.125rem;
  margin-bottom: 1.25rem;
`;

export const demoAnsL = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.placeholder};
  margin-bottom: 0.5rem;
`;

export const demoAnsT = css`
  font-size: 0.875rem;
  color: ${C.muted};
  line-height: 1.7;
`;

export const demoResult = css`
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  border-radius: ${RADIUS.lg};
  padding: 1.375rem;
`;

export const demoScoreRow = css`
  display: flex;
  align-items: center;
  gap: 1.125rem;
  margin-bottom: 1rem;
`;

export const demoScore = css`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${C.green};
  line-height: 1;
  white-space: nowrap;
  letter-spacing: -0.03em;
`;

export const demoDenom = css`
  font-size: 1rem;
  color: ${C.muted};
`;

export const demoBarWrap = css`
  flex: 1;
  height: 4px;
  background: ${C.border};
  border-radius: 3px;
  overflow: hidden;
`;

export const demoBarFill = css`
  height: 100%;
  width: 70%;
  background: ${C.green};
  border-radius: 3px;
`;

export const demoFb = css`
  font-size: 0.875rem;
  color: ${C.muted};
  line-height: 1.8;
`;

// ─── Modes grid ───────────────────────────────────────────────────────────────

export const modesG = css`
  display: grid;
  gap: 1rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const modeCard = (c: string) => css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1.75rem;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
  &:hover {
    border-color: ${c};
    transform: translateY(-2px);
  }
`;

export const modeE = css`
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
`;

export const modeFree = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${C.green};
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  padding: 2px 8px;
  border-radius: 4px;
`;

export const modeL = css`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.375rem;
`;

export const modeC = (c: string) => css`
  font-size: 0.8125rem;
  color: ${c};
  font-weight: 500;
  margin-bottom: 0.875rem;
`;

export const modeD = css`
  font-size: 0.875rem;
  color: ${C.muted};
  line-height: 1.75;
  margin-bottom: 1.25rem;
`;

export const modeTagRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const modeT = (c: string) => css`
  font-size: 0.6875rem;
  padding: 3px 10px;
  border-radius: 100px;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  color: ${c};
  font-weight: 500;
`;

// ─── 2-col layout ─────────────────────────────────────────────────────────────

export const twoCol = css`
  display: grid;
  gap: 1.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

// ─── QOTD card ────────────────────────────────────────────────────────────────

export const qotdCard = css`
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
`;

export const qotdBadge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.accentText};
  background: ${C.bg};
  border: 1px solid ${C.border};
  padding: 3px 10px;
  border-radius: 100px;
`;

export const qotdTitle = css`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${C.text};
  line-height: 1.45;
  margin-bottom: 0.5rem;
`;

export const qotdSub = css`
  font-size: 0.875rem;
  color: ${C.muted};
  line-height: 1.65;
`;

export const qotdBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5625rem 1.125rem;
  background: ${C.accent};
  color: #ffffff;
  border-radius: ${RADIUS.md};
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  align-self: flex-start;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
`;

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export const lbCard = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  overflow: hidden;
`;

export const lbHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.375rem;
  border-bottom: 1px solid ${C.border};
`;

export const lbHeadT = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
`;

export const lbReset = css`
  font-size: 0.6875rem;
  color: ${C.muted};
`;

export const lbRow = (bg: string) => css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.375rem;
  background: ${bg};
  border-bottom: 1px solid ${C.border};
`;

export const lbAv = css`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.accentText};
`;

export const lbName = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${C.text};
  flex: 1;
`;

export const lbXp = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${C.amber};
`;

export const lbCta = css`
  display: block;
  text-align: center;
  padding: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${C.accent};
  text-decoration: none;
  border-top: 1px solid ${C.border};
  transition: background 0.12s ease;
  &:hover {
    background: ${C.accentSubtle};
  }
`;

// ─── Why-switch (before/after) ────────────────────────────────────────────────

export const whyCard = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1.875rem 2rem;
`;

export const whyG = css`
  display: grid;
  gap: 1.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const whyItem = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const whyEmoji = css`
  font-size: 1.5rem;
  margin-bottom: 0.375rem;
`;

export const whyLabel = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: ${C.placeholder};
  margin-bottom: 0.125rem;
`;

export const whyBefore = css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${C.muted};
  text-decoration: line-through;
  text-decoration-color: ${C.borderStrong};
`;

export const whyAfter = css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${C.text};
`;

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const tGrid = css`
  display: grid;
  gap: 1rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const tCard = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: border-color 0.15s ease;
  &:hover {
    border-color: ${C.borderStrong};
  }
`;

export const tStars = css`
  display: flex;
  gap: 3px;
  margin-bottom: 0.625rem;
`;

export const tQuote = css`
  font-size: 0.9375rem;
  color: ${C.muted};
  line-height: 1.8;
  flex: 1;
`;

export const tMark = css`
  font-size: 3.5rem;
  color: ${C.borderStrong};
  line-height: 0.5;
  display: block;
  margin-bottom: 0.75rem;
`;

export const tAuthor = css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

export const tAv = (c: string) => css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${C.bgSubtle};
  border: 1.5px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${c};
`;

export const tName = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.125rem;
`;

export const tRole = css`
  font-size: 0.75rem;
  color: ${C.muted};
`;

// ─── Topics grid ──────────────────────────────────────────────────────────────

export const tpGrid = css`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const tpCard = (c: string) => css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.25rem;
  text-decoration: none;
  display: block;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;
  &:hover {
    border-color: ${c};
    background: ${C.bgSubtle};
    transform: translateY(-1px);
  }
`;

export const tpDot = (c: string) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${c};
  margin-bottom: 0.875rem;
`;

export const tpName = css`
  font-size: 1rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.5rem;
`;

export const tpMeta = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const tpDiff = (c: string) => css`
  font-size: 0.6875rem;
  color: ${c};
  font-weight: 500;
`;

export const tpQs = css`
  font-size: 0.6875rem;
  color: ${C.muted};
`;

// ─── AI tools grid ────────────────────────────────────────────────────────────

export const aiG = css`
  display: grid;
  gap: 0.75rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const aiCard = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.125rem 1.375rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: border-color 0.15s ease;
  &:hover {
    border-color: ${C.borderStrong};
  }
`;

export const aiIco = (c: string) => css`
  width: 36px;
  height: 36px;
  border-radius: ${RADIUS.md};
  flex-shrink: 0;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${c};
`;

export const aiLab = css`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const aiBdg = css`
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${C.amber};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  padding: 1px 5px;
  border-radius: 4px;
`;

export const aiDsc = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  line-height: 1.65;
`;

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const priceG = css`
  display: grid;
  gap: 1rem;
  max-width: 48rem;
  margin: 0 auto;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const priceC = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

export const priceCPro = css`
  background: ${C.accentSubtle};
  border: 1.5px solid ${C.accent};
  border-radius: ${RADIUS.xl};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const popularTag = css`
  position: absolute;
  top: 1.125rem;
  right: 1.125rem;
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #ffffff;
  background: ${C.accent};
  padding: 3px 9px;
  border-radius: ${RADIUS.sm};
`;

export const pTier = css`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${C.muted};
  margin-bottom: 0.5rem;
`;

export const pPrice = css`
  font-size: 2.75rem;
  font-weight: 700;
  color: ${C.text};
  line-height: 1;
  margin-bottom: 0.25rem;
  letter-spacing: -0.03em;
`;

export const pPer = css`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${C.muted};
`;

export const pNote = css`
  font-size: 0.8125rem;
  color: ${C.muted};
  margin-bottom: 1.75rem;
`;

export const pFeats = css`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  margin-bottom: 1.875rem;
`;

export const pFeat = css`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: ${C.muted};
`;

export const pBtnF = css`
  display: block;
  text-align: center;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem;
  font-weight: 600;
  color: ${C.text};
  text-decoration: none;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${C.borderStrong};
    background: ${C.bgHover};
  }
`;

export const pBtnP = css`
  display: block;
  text-align: center;
  background: ${C.accent};
  border-radius: ${RADIUS.lg};
  padding: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
`;

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

export const btmCta = css`
  text-align: center;
  padding: 4.5rem 2rem;
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  margin-bottom: 3rem;
`;

export const btmH = css`
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: ${C.text};
  margin-bottom: 0.875rem;
`;

export const btmD = css`
  font-size: 1rem;
  color: ${C.muted};
  margin-bottom: 2.25rem;
  line-height: 1.7;
`;

export const foot = css`
  text-align: center;
  color: ${C.muted};
  font-size: 0.8125rem;
  padding-bottom: 2rem;
`;

export const hr = css`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0 0 5rem;
`;

// ─── Sprint claims ────────────────────────────────────────────────────────────

export const sprintClaims = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
  @media (min-width: ${BP.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const sprintClaim = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1.125rem;
  transition: border-color 0.15s ease;
  &:hover {
    border-color: ${C.borderStrong};
  }
`;

export const sprintClaimIcon = css`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const sprintClaimTitle = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.375rem;
`;

export const sprintClaimDesc = css`
  font-size: 0.8rem;
  color: ${C.muted};
  line-height: 1.55;
  margin: 0;
`;

// ─── Sprint demo shell ────────────────────────────────────────────────────────

export const sprintDemo = css`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  overflow: hidden;
  margin-bottom: 2.25rem;
  box-shadow: 0 2px 12px rgba(55, 53, 47, 0.06);
`;

// ─── Sprint HUD ───────────────────────────────────────────────────────────────

export const sprintHUD = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 1.25rem;
  background: ${C.bgSubtle};
  border-bottom: 1px solid ${C.border};
`;

export const sprintHUDLeft = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 70px;
`;

export const sprintHUDScoreNum = css`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${C.amber};
  letter-spacing: -0.02em;
  line-height: 1;
`;

export const sprintHUDScoreLabel = css`
  font-size: 0.625rem;
  font-weight: 600;
  color: ${C.muted};
  text-transform: uppercase;
`;

export const sprintHUDProgress = css`
  flex: 1;
  min-width: 0;
`;

export const sprintHUDMeta = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.625rem;
  color: ${C.muted};
  margin-bottom: 0.3rem;
  font-weight: 500;
`;

export const sprintHUDTrack = css`
  height: 3px;
  background: ${C.border};
  border-radius: 99px;
  overflow: hidden;
`;

export const sprintHUDFill = css`
  height: 100%;
  width: 40%;
  background: ${C.accent};
  border-radius: 99px;
`;

export const sprintHUDTimer = css`
  flex-shrink: 0;
  padding: 0.3rem 0.625rem;
  border-radius: ${RADIUS.sm};
  background: ${C.bg};
  border: 1px solid ${C.border};
`;

export const sprintHUDTimerText = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${C.text};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
`;

// ─── Sprint two-panel body ────────────────────────────────────────────────────

export const sprintDemoBody = css`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: ${BP.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const sprintDemoLeft = css`
  padding: 1.25rem;
  border-right: 0 solid ${C.border};
  @media (min-width: ${BP.md}) {
    border-right-width: 1px;
  }
`;

export const sprintDemoRight = css`
  padding: 1.25rem;
  display: none;
  @media (min-width: ${BP.md}) {
    display: block;
  }
`;

export const sprintDemoSectionLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.muted};
  margin-bottom: 0.875rem;
`;

// ─── Sprint question card ─────────────────────────────────────────────────────

export const sprintCard = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
`;

export const sprintCardHeader = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const sprintTypeTag = (type: string) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 20px;
  ${type === "output"
    ? `color:${C.green};background:${C.greenSubtle};border:1px solid ${C.greenBorder};`
    : type === "debug"
      ? `color:${C.red};background:${C.redSubtle};border:1px solid ${C.redBorder};`
      : `color:${C.accentText};background:${C.accentSubtle};border:1px solid ${C.border};`}
`;

export const sprintDiff = css`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${C.green};
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  padding: 2px 7px;
  border-radius: 10px;
`;

export const sprintCat = css`
  font-size: 0.75rem;
  color: ${C.muted};
  font-weight: 500;
`;

export const sprintCardQ = css`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
  margin: 0 0 0.75rem;
  line-height: 1.45;
`;

export const sprintCode = css`
  background: ${C.codeBg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.75rem 0.875rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.75rem;
  line-height: 1.7;
  color: ${C.codeText};
  margin-bottom: 0.75rem;
  overflow-x: auto;
  white-space: pre;
`;

export const sprintInputRow = css`
  display: flex;
  gap: 0.625rem;
  align-items: center;
`;

export const sprintFakeInput = css`
  flex: 1;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.5rem 0.75rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
`;

export const sprintFakePlaceholder = css`
  color: ${C.placeholder};
  font-style: italic;
`;

export const sprintCheckBtn = css`
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.md};
  flex-shrink: 0;
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  color: ${C.green};
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.8;
  }
`;

export const sprintSkipRow = css`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${C.muted};
  text-align: right;
`;

// ─── Sprint AI eval card ──────────────────────────────────────────────────────

export const sprintEvalCard = css`
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 1rem;
  margin-bottom: 0.75rem;
  position: relative;
`;

export const sprintEvalHeader = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const sprintEvalQ = css`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${C.text};
  margin: 0 0 0.5rem;
  line-height: 1.4;
`;

export const sprintEvalAnswer = css`
  font-size: 0.75rem;
  color: ${C.muted};
  font-style: italic;
  line-height: 1.5;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.md};
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.625rem;
`;

export const sprintEvalResult = css`
  border-top: 1px solid ${C.border};
  padding-top: 0.625rem;
`;

export const sprintEvalScoreRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
`;

export const sprintEvalNum = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${C.green};
  line-height: 1;
  letter-spacing: -0.02em;
`;

export const sprintEvalDenom = css`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.muted};
`;

export const sprintEvalBar = css`
  flex: 1;
  height: 3px;
  background: ${C.border};
  border-radius: 99px;
  overflow: hidden;
`;

export const sprintEvalFill = (n: number) => css`
  height: 100%;
  width: ${n * 10}%;
  background: ${C.green};
  border-radius: 99px;
`;

export const sprintEvalVerdict = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.375rem;
  line-height: 1.4;
`;

export const sprintEvalFeedRow = css`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const sprintFeedGood = css`
  font-size: 0.625rem;
  font-weight: 600;
  color: ${C.green};
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  padding: 1px 7px;
  border-radius: 10px;
`;

export const sprintFeedMiss = css`
  font-size: 0.625rem;
  font-weight: 600;
  color: ${C.amber};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  padding: 1px 7px;
  border-radius: 10px;
`;

export const sprintEvalPoints = css`
  position: absolute;
  top: 0.75rem;
  right: 0.875rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.amber};
  background: ${C.amberSubtle};
  border: 1px solid ${C.amberBorder};
  padding: 2px 8px;
  border-radius: 10px;
`;

// ─── Sprint upcoming queue ────────────────────────────────────────────────────

export const sprintQueue = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.75rem;
`;

export const sprintQueueLabel = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${C.muted};
  margin-bottom: 0.5rem;
`;

export const sprintQueueItem = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0;
  border-bottom: 1px solid ${C.border};
  &:last-child {
    border: 0;
  }
`;

export const sprintQueueDot = (c: string) => css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${c};
  flex-shrink: 0;
`;

export const sprintQueueText = css`
  font-size: 0.75rem;
  color: ${C.muted};
`;

// ─── Sprint results strip ─────────────────────────────────────────────────────

export const sprintResultPreview = css`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0.875rem 1.25rem;
  background: ${C.accentSubtle};
  border-top: 1px solid ${C.border};
`;

export const sprintResultBadge = css`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.muted};
  white-space: nowrap;
`;

export const sprintResultScoreBlock = css`
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
`;

export const sprintResultScore = css`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.03em;
  line-height: 1;
`;

export const sprintResultMax = css`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${C.muted};
`;

export const sprintResultAccuracy = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${C.green};
  margin-left: 0.25rem;
`;

export const sprintResultDivider = css`
  width: 1px;
  height: 28px;
  background: ${C.border};
  flex-shrink: 0;
  display: none;
  @media (min-width: ${BP.sm}) {
    display: block;
  }
`;

export const sprintResultRight = css`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 160px;
`;

export const sprintInsightRow = (c: string) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${c};
  font-weight: 500;
`;

export const sprintResultActions = css`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  flex-wrap: wrap;
`;

export const sprintShareChip = css`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: ${RADIUS.md};
  background: ${C.bg};
  border: 1px solid ${C.border};
  color: ${C.muted};
  white-space: nowrap;
  transition: border-color 0.12s ease;
  &:hover {
    border-color: ${C.borderStrong};
    color: ${C.text};
  }
`;

// ─── Sprint CTA row ───────────────────────────────────────────────────────────

export const sprintCTARow = css`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const sprintStartBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-radius: ${RADIUS.lg};
  font-size: 1rem;
  font-weight: 600;
  background: ${C.accent};
  color: #ffffff;
  text-decoration: none;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-2px);
  }
`;

export const sprintCTASub = css`
  font-size: 0.8125rem;
  color: ${C.muted};
`;

// ─── Pricing button states ────────────────────────────────────────────────────

export const proActiveBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  border-radius: ${RADIUS.lg};
  font-weight: 600;
  font-size: 0.875rem;
  background: ${C.greenSubtle};
  border: 1px solid ${C.greenBorder};
  color: ${C.green};
  text-decoration: none;
`;

export const proPayBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  border-radius: ${RADIUS.lg};
  font-weight: 600;
  font-size: 0.875rem;
  background: ${C.accent};
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
`;

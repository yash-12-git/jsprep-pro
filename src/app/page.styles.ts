import { BP } from "@/styles/tokens";
import { css, keyframes } from "@emotion/react";

export const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
export const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px) }
  to   { opacity:1; transform:translateY(0) }
`;

// ─── Styles ───────────────────────────────────────────────────────────────────

export const page = css`
  position: relative;
  background: #07070e;
  min-height: 100vh;
  /* Dot grid */
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.045) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
`;
export const purpleGlow = css`
  position: fixed;
  inset: -200px -300px auto auto;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(124, 106, 247, 0.12) 0%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 0;
`;
export const greenGlow = css`
  position: fixed;
  bottom: -100px;
  left: -100px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(106, 247, 192, 0.07) 0%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 0;
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

/* ─ Hero */
export const hero = css`
  text-align: center;
  padding: 4rem 0 3rem;
  animation: ${fadeUp} 0.6s ease both;
  @media (min-width: ${BP.sm}) {
    padding: 5.5rem 0 4rem;
  }
`;
export const badge = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a78bfa;
  background: rgba(124, 106, 247, 0.1);
  border: 1px solid rgba(124, 106, 247, 0.2);
  padding: 0.375rem 0.9375rem;
  border-radius: 100px;
  margin-bottom: 1.75rem;
`;
export const h1 = css`
  font-family: "Syne", sans-serif;
  font-size: clamp(2.75rem, 8vw, 5.25rem);
  font-weight: 800;
  line-height: 1.07;
  letter-spacing: -0.04em;
  color: white;
  margin-bottom: 1.375rem;
`;
export const grad = css`
  background: linear-gradient(
    130deg,
    #7c6af7 0%,
    #a78bfa 35%,
    #6af7c0 65%,
    #7c6af7 100%
  );
  background-size: 200% auto;
  animation: ${shimmer} 5s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
export const sub = css`
  font-size: clamp(1rem, 1.75vw, 1.125rem);
  color: rgba(255, 255, 255, 0.48);
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
  padding: 0.9375rem 2.25rem;
  background: #7c6af7;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 8px 36px rgba(124, 106, 247, 0.42);
  transition: all 0.18s;
  &:hover {
    background: #6b59e8;
    transform: translateY(-2px);
    box-shadow: 0 12px 44px rgba(124, 106, 247, 0.52);
  }
`;
export const btnO = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.9375rem 1.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.11);
  transition: all 0.18s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
    color: white;
  }
`;

/* ─ Free banner */
export const freeBanner = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  background: rgba(106, 247, 192, 0.06);
  border: 1px solid rgba(106, 247, 192, 0.15);
  border-radius: 14px;
  padding: 0.9375rem 1.75rem;
  margin: 0 auto 4rem;
  max-width: 42rem;
  animation: ${fadeUp} 0.6s 0.1s ease both;
`;

/* ─ Stats */
export const statsRow = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 4.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
export const statCell = css`
  text-align: center;
  padding: 1.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  &:last-child {
    border-right: none;
  }
  &:nth-child(2) {
    border-right: none;
  }
  @media (min-width: ${BP.sm}) {
    &:nth-child(2) {
      border-right: 1px solid rgba(255, 255, 255, 0.07);
    }
  }
`;
export const statN = css`
  font-family: "Syne", sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 0.375rem;
`;
export const statL = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
`;

/* ─ Section */
export const sec = css`
  margin-bottom: 5rem;
`;
export const eye = (c: string) => css`
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${c};
  text-align: center;
  margin-bottom: 0.875rem;
`;
export const sh2 = css`
  font-family: "Syne", sans-serif;
  font-size: clamp(1.875rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
  color: white;
  margin-bottom: 0.75rem;
`;
export const ssub = css`
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9375rem;
  max-width: 30rem;
  margin: 0 auto 2.75rem;
  line-height: 1.75;
`;

/* ─ AI Demo */
export const demoShell = css`
  background: #0c0c17;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  max-width: 52rem;
  margin: 0 auto;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(124, 106, 247, 0.08);
`;
export const demoBar = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: rgba(255, 255, 255, 0.025);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;
export const dd = (c: string) => css`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${c};
`;
export const demoTitle = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.22);
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
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7c6af7;
  background: rgba(124, 106, 247, 0.1);
  border: 1px solid rgba(124, 106, 247, 0.18);
  padding: 2px 9px;
  border-radius: 100px;
`;
export const demoQ = css`
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: white;
  font-weight: 700;
  line-height: 1.45;
  margin-bottom: 1.5rem;
`;
export const demoAns = css`
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1.125rem;
  margin-bottom: 1.25rem;
`;
export const demoAnsL = css`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255, 255, 255, 0.22);
  margin-bottom: 0.5rem;
`;
export const demoAnsT = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.7;
`;
export const demoResult = css`
  background: rgba(106, 247, 192, 0.05);
  border: 1px solid rgba(106, 247, 192, 0.16);
  border-radius: 14px;
  padding: 1.375rem;
`;
export const demoScoreRow = css`
  display: flex;
  align-items: center;
  gap: 1.125rem;
  margin-bottom: 1rem;
`;
export const demoScore = css`
  font-family: "Syne", sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #6af7c0;
  line-height: 1;
  white-space: nowrap;
`;
export const demoDenom = css`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.2);
`;
export const demoBarWrap = css`
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  overflow: hidden;
`;
export const demoBarFill = css`
  height: 100%;
  width: 70%;
  background: linear-gradient(90deg, #6af7c0, #7c6af7);
  border-radius: 3px;
`;
export const demoFb = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.8;
`;

/* ─ Modes */
export const modesG = css`
  display: grid;
  gap: 1.125rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
export const modeCard = (c: string) => css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 1.875rem;
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    border-color: ${c}35;
    transform: translateY(-3px);
    box-shadow:
      0 16px 48px rgba(0, 0, 0, 0.3),
      0 0 0 1px ${c}12;
  }
`;
export const modeE = css`
  font-size: 2.25rem;
  display: block;
  margin-bottom: 1.125rem;
`;
export const modeFree = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.1);
  border: 1px solid rgba(106, 247, 192, 0.18);
  padding: 2px 8px;
  border-radius: 4px;
`;
export const modeL = css`
  font-family: "Syne", sans-serif;
  font-size: 1.1875rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.375rem;
`;
export const modeC = (c: string) => css`
  font-size: 0.8125rem;
  color: ${c};
  font-weight: 700;
  margin-bottom: 0.875rem;
`;
export const modeD = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
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
  background: ${c}10;
  border: 1px solid ${c}1f;
  color: ${c};
  font-weight: 600;
`;

/* ─ 2-col layout */
export const twoCol = css`
  display: grid;
  gap: 1.5rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* ─ QOTD card */
export const qotdCard = css`
  background: linear-gradient(
    135deg,
    rgba(124, 106, 247, 0.1),
    rgba(106, 247, 192, 0.06)
  );
  border: 1px solid rgba(124, 106, 247, 0.2);
  border-radius: 20px;
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
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #c4b5fd;
  background: rgba(124, 106, 247, 0.15);
  padding: 3px 10px;
  border-radius: 100px;
`;
export const qotdTitle = css`
  font-size: 1.125rem;
  font-weight: 800;
  color: white;
  line-height: 1.45;
  margin-bottom: 0.5rem;
  font-family: "Syne", sans-serif;
`;
export const qotdSub = css`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.42);
  line-height: 1.65;
`;
export const qotdBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.625rem 1.25rem;
  background: #7c6af7;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(124, 106, 247, 0.35);
  transition: all 0.15s;
  align-self: flex-start;
  &:hover {
    background: #6b59e8;
    transform: translateY(-1px);
  }
`;

/* ─ Leaderboard */
export const lbCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  overflow: hidden;
`;
export const lbHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.375rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;
export const lbHeadT = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 800;
  color: white;
`;
export const lbReset = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.28);
`;
export const lbRow = (bg: string) => css`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.375rem;
  background: ${bg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;
export const lbAv = css`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(124, 106, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #c4b5fd;
`;
export const lbName = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  flex: 1;
`;
export const lbXp = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 800;
  color: #f7c76a;
`;
export const lbCta = css`
  display: block;
  text-align: center;
  padding: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #7c6af7;
  text-decoration: none;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
  &:hover {
    background: rgba(124, 106, 247, 0.05);
  }
`;

/* ─ Why switch (before/after) */
export const whyCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
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
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 0.125rem;
`;
export const whyBefore = css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
`;
export const whyAfter = css`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.75);
`;

/* ─ Testimonials */
export const tGrid = css`
  display: grid;
  gap: 1.125rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
export const tCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
`;
export const tStars = css`
  display: flex;
  gap: 3px;
  margin-bottom: 0.625rem;
`;
export const tQuote = css`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.8;
  flex: 1;
`;
export const tMark = css`
  font-family: "Syne", sans-serif;
  font-size: 3.5rem;
  color: rgba(124, 106, 247, 0.22);
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
  background: ${c}18;
  border: 1.5px solid ${c}35;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: ${c};
`;
export const tName = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.125rem;
`;
export const tRole = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
`;

/* ─ Topics */
export const tpGrid = css`
  display: grid;
  gap: 0.875rem;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
export const tpCard = (c: string) => css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem;
  text-decoration: none;
  display: block;
  transition: all 0.2s;
  &:hover {
    border-color: ${c}35;
    background: ${c}07;
    transform: translateY(-2px);
  }
`;
export const tpDot = (c: string) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${c};
  box-shadow: 0 0 8px ${c}80;
  margin-bottom: 0.875rem;
`;
export const tpName = css`
  font-size: 1rem;
  font-weight: 700;
  color: white;
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
  font-weight: 700;
`;
export const tpQs = css`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.25);
`;

/* ─ AI tools */
export const aiG = css`
  display: grid;
  gap: 0.875rem;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
export const aiCard = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem 1.375rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: border-color 0.2s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }
`;
export const aiIco = (c: string) => css`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  background: ${c}14;
  border: 1px solid ${c}22;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const aiLab = css`
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
export const aiBdg = css`
  font-size: 0.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #f7c76a;
  background: rgba(247, 199, 106, 0.1);
  border: 1px solid rgba(247, 199, 106, 0.2);
  padding: 1px 5px;
  border-radius: 4px;
`;
export const aiDsc = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.65;
`;

/* ─ Pricing */
export const priceG = css`
  display: grid;
  gap: 1.125rem;
  max-width: 48rem;
  margin: 0 auto;
  @media (min-width: ${BP.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;
export const priceC = css`
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;
export const priceCPro = css`
  background: rgba(124, 106, 247, 0.07);
  border: 1.5px solid rgba(124, 106, 247, 0.35);
  border-radius: 22px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #7c6af7, #6af7c0, #7c6af7);
  }
`;
export const popularTag = css`
  position: absolute;
  top: 1.125rem;
  right: 1.125rem;
  font-size: 0.5625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
  background: #7c6af7;
  padding: 3px 9px;
  border-radius: 6px;
`;
export const pTier = css`
  font-family: "Syne", sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.42);
  margin-bottom: 0.5rem;
`;
export const pPrice = css`
  font-family: "Syne", sans-serif;
  font-size: 2.75rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 0.25rem;
`;
export const pPer = css`
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
`;
export const pNote = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
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
  color: rgba(255, 255, 255, 0.65);
`;
export const pBtnF = css`
  display: block;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.9375rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: all 0.15s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.04);
  }
`;
export const pBtnP = css`
  display: block;
  text-align: center;
  background: #7c6af7;
  border-radius: 12px;
  padding: 0.9375rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(124, 106, 247, 0.32);
  transition: all 0.18s;
  &:hover {
    background: #6b59e8;
    transform: translateY(-1px);
  }
`;

/* ─ Bottom CTA */
export const btmCta = css`
  text-align: center;
  padding: 4.5rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(124, 106, 247, 0.45),
      transparent
    );
  }
`;
export const btmH = css`
  font-family: "Syne", sans-serif;
  font-size: clamp(1.875rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: white;
  margin-bottom: 0.875rem;
`;
export const btmD = css`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2.25rem;
  line-height: 1.7;
`;
export const foot = css`
  text-align: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.8125rem;
  padding-bottom: 2rem;
`;
export const hr = css`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin: 0 0 5rem;
`;

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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 1rem;
  padding: 1.125rem;
  transition: border-color 0.2s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
  }
`;
export const sprintClaimIcon = css`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;
export const sprintClaimTitle = css`
  font-size: 0.875rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.375rem;
`;
export const sprintClaimDesc = css`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.55;
  margin: 0;
`;

// ── Demo shell ───────────────────────────────────────────────────────────────
export const sprintDemo = css`
  background: #0d0d18;
  border: 1px solid rgba(124, 106, 247, 0.2);
  border-radius: 1.25rem;
  overflow: hidden;
  margin-bottom: 2.25rem;
  box-shadow: 0 0 60px rgba(124, 106, 247, 0.08);
`;

// ── HUD ──────────────────────────────────────────────────────────────────────
export const sprintHUD = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 1.25rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;
export const sprintHUDLeft = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 70px;
`;
export const sprintHUDScoreNum = css`
  font-size: 1.375rem;
  font-weight: 900;
  color: #f7c76a;
  letter-spacing: -0.02em;
  line-height: 1;
`;
export const sprintHUDScoreLabel = css`
  font-size: 0.625rem;
  font-weight: 700;
  color: rgba(247, 199, 106, 0.5);
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
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 0.3rem;
  font-weight: 600;
`;
export const sprintHUDTrack = css`
  height: 3px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 99px;
  overflow: hidden;
`;
export const sprintHUDFill = css`
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, #7c6af7, #a78bfa);
  border-radius: 99px;
`;
export const sprintHUDTimer = css`
  flex-shrink: 0;
  padding: 0.3rem 0.625rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;
export const sprintHUDTimerText = css`
  font-size: 0.875rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.75);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
`;

// ── Two-panel body ────────────────────────────────────────────────────────────
export const sprintDemoBody = css`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: ${BP.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;
export const sprintDemoLeft = css`
  padding: 1.25rem;
  border-right: 0 solid rgba(255, 255, 255, 0.06);
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
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 0.875rem;
`;

// ── Question card ─────────────────────────────────────────────────────────────
export const sprintCard = css`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0.875rem;
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
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 2px 8px;
  border-radius: 20px;
  ${type === "output"
    ? "color:#6af7c0;background:rgba(106,247,192,0.1);"
    : type === "debug"
      ? "color:#f76a6a;background:rgba(247,106,106,0.1);"
      : "color:#c4b5fd;background:rgba(124,106,247,0.1);"}
`;
export const sprintDiff = css`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.08);
  padding: 2px 7px;
  border-radius: 10px;
`;
export const sprintCat = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
`;
export const sprintCardQ = css`
  font-size: 0.9375rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.75rem;
  line-height: 1.4;
`;
export const sprintCode = css`
  background: #07070e;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0.625rem;
  padding: 0.75rem 0.875rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.75rem;
  line-height: 1.7;
  color: #c8d8e8;
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
`;
export const sprintFakePlaceholder = css`
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
`;
export const sprintCheckBtn = css`
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  background: rgba(106, 247, 192, 0.1);
  border: 1px solid rgba(106, 247, 192, 0.2);
  color: #6af7c0;
  font-size: 0.8125rem;
  font-weight: 700;
  white-space: nowrap;
`;
export const sprintSkipRow = css`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.22);
  text-align: right;
`;

// ── AI eval result card ────────────────────────────────────────────────────────
export const sprintEvalCard = css`
  background: rgba(124, 106, 247, 0.06);
  border: 1px solid rgba(124, 106, 247, 0.15);
  border-radius: 0.875rem;
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
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 0.5rem;
  line-height: 1.4;
`;
export const sprintEvalAnswer = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  font-style: italic;
  line-height: 1.5;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.625rem;
`;
export const sprintEvalResult = css`
  border-top: 1px solid rgba(255, 255, 255, 0.07);
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
  font-weight: 900;
  color: #6af7c0;
  line-height: 1;
`;
export const sprintEvalDenom = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
`;
export const sprintEvalBar = css`
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 99px;
  overflow: hidden;
`;
export const sprintEvalFill = (n: number) => css`
  height: 100%;
  width: ${n * 10}%;
  background: #6af7c0;
  border-radius: 99px;
`;
export const sprintEvalVerdict = css`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
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
  font-weight: 700;
  color: #6af7c0;
  background: rgba(106, 247, 192, 0.1);
  padding: 1px 7px;
  border-radius: 10px;
`;
export const sprintFeedMiss = css`
  font-size: 0.625rem;
  font-weight: 700;
  color: #f7c76a;
  background: rgba(247, 199, 106, 0.1);
  padding: 1px 7px;
  border-radius: 10px;
`;
export const sprintEvalPoints = css`
  position: absolute;
  top: 0.75rem;
  right: 0.875rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: #f7c76a;
  background: rgba(247, 199, 106, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
`;

// ── Upcoming queue ─────────────────────────────────────────────────────────────
export const sprintQueue = css`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.875rem;
  padding: 0.75rem;
`;
export const sprintQueueLabel = css`
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.25);
  margin-bottom: 0.5rem;
`;
export const sprintQueueItem = css`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  color: rgba(255, 255, 255, 0.45);
`;

// ── Results strip ─────────────────────────────────────────────────────────────
export const sprintResultPreview = css`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0.875rem 1.25rem;
  background: rgba(124, 106, 247, 0.07);
  border-top: 1px solid rgba(124, 106, 247, 0.18);
`;
export const sprintResultBadge = css`
  font-size: 0.75rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
`;
export const sprintResultScoreBlock = css`
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
`;
export const sprintResultScore = css`
  font-size: 1.75rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1;
`;
export const sprintResultMax = css`
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
`;
export const sprintResultAccuracy = css`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6af7c0;
  margin-left: 0.25rem;
`;
export const sprintResultDivider = css`
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
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
  font-weight: 600;
`;
export const sprintResultActions = css`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  flex-wrap: wrap;
`;
export const sprintShareChip = css`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
`;

// ── CTA row ────────────────────────────────────────────────────────────────────
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
  border-radius: 0.875rem;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, #7c6af7, #9b8bff);
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 24px rgba(124, 106, 247, 0.35);
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 106, 247, 0.5);
  }
`;
export const sprintCTASub = css`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
`;

// ── Pricing button variants ────────────────────────────────────────────────────
// These 3 states are logic-coupled to the component, so they live here rather
// than in page.styles.ts

export const proActiveBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9375rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
  background: rgba(106, 247, 192, 0.1);
  border: 1px solid rgba(106, 247, 192, 0.25);
  color: #6af7c0;
  text-decoration: none;
`;

export const proPayBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9375rem;
  border-radius: 12px;
  font-weight: 900;
  font-size: 0.875rem;
  background: #7c6af7;
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(124, 106, 247, 0.32);
  transition: all 0.18s;
  &:hover {
    background: #6b59e8;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

import { css } from "@emotion/react";
import { C, FONT } from "@/styles/tokens";

// ─── Page furniture ───────────────────────────────────────────────────────────

const SMALL = "60rem";

export const page = css`
  background: ${C.bg};
  color: ${C.text};
  overflow-x: clip;
`;

export const wrap = css`
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--gutter);
`;

export const sec = css`
  padding-block: var(--section-gap-s);
  scroll-margin-top: var(--space-2xl);
`;

export const secTight = css`
  padding-block: var(--space-3xl);
`;

export const band = css`
  background: ${C.bgSubtle};
  border-block: 1px solid ${C.border};
`;

export const headBlock = css`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: var(--space-lg) var(--gap-columns);
  align-items: end;
  margin-bottom: var(--space-2xl);
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const sh2 = css`
  font-family: ${FONT.display};
  font-size: var(--text-section);
  font-weight: 500;
  letter-spacing: var(--tracking-display);
  line-height: 1.05;
  color: ${C.text};
  overflow-wrap: break-word;
  min-width: 0;
  text-wrap: balance;
`;

export const ssub = css`
  font-size: var(--text-lead);
  line-height: 1.45;
  color: ${C.ink2};
  max-width: 48ch;
  text-wrap: pretty;
`;

// ─── Buttons ──────────────────────────────────────────────────────────────────

const btnBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  min-height: 48px;
  padding: 0 var(--space-lg);
  border: 1px solid ${C.accent};
  border-radius: var(--radius-pill);
  font-family: ${FONT.sans};
  font-size: var(--text-md);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color var(--dur-short) var(--ease-out),
    border-color var(--dur-short) var(--ease-out),
    transform var(--dur-micro) var(--ease-out);
  &:active {
    transform: translateY(1px);
  }
  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

export const btnP = css`
  ${btnBase};
  background: ${C.accent};
  color: ${C.accentInk};
  &:hover {
    background: ${C.accentHover};
    border-color: ${C.accentHover};
  }
`;

export const btnO = css`
  ${btnBase};
  background: ${C.bgSubtle};
  border-color: ${C.rule2};
  color: ${C.text};
  &:hover {
    background: ${C.bgHover};
  }
`;

export const ctas = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const hero = css`
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 6fr);
  gap: var(--space-2xl);
  align-items: center;
  min-height: calc(100dvh - 5rem);
  padding-block: var(--space-lg) var(--space-xl);
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    gap: var(--space-xl);
    padding-block: var(--space-xl);
  }
`;

export const heroText = css`
  min-width: 0;
`;

export const h1 = css`
  font-family: ${FONT.display};
  font-size: clamp(2.75rem, 3.6vw + 1rem, 4.5rem);
  font-weight: 500;
  letter-spacing: var(--tracking-display);
  line-height: 1.03;
  color: ${C.text};
  overflow-wrap: break-word;
  min-width: 0;
  text-wrap: balance;
`;

export const sub = css`
  margin-top: var(--space-lg);
  font-size: var(--text-lead);
  line-height: 1.45;
  color: ${C.ink2};
  max-width: 46ch;
  text-wrap: pretty;
`;

export const heroCtas = css`
  ${ctas};
  margin-top: var(--space-xl);
`;

export const freeLine = css`
  margin-top: var(--space-md);
  font-size: var(--text-sm);
  color: ${C.muted};
  max-width: 52ch;
  strong {
    font-weight: 500;
    color: ${C.green};
  }
`;

// ─── One surface, cut by hairlines ────────────────────────────────────────────

export const panel = css`
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  border-radius: var(--radius-card);
  overflow: hidden;
  min-width: 0;
`;

export const panelHead = css`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid ${C.border};
`;

export const panelBody = css`
  padding: var(--space-md) var(--space-lg);
  & + & {
    border-top: 1px solid ${C.border};
  }
`;

export const label = css`
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${C.muted};
`;

export const chipRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
`;

export const chip = css`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-3xs) var(--space-xs);
  border: 1px solid ${C.border};
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: 500;
  color: ${C.muted};
  white-space: nowrap;
`;

export const chipPerson = css`
  ${chip};
  background: ${C.accentSubtle};
  border-color: transparent;
  color: ${C.text};
`;

export const chipCool = css`
  ${chip};
  background: ${C.coolSoft};
  border-color: transparent;
  color: ${C.text};
`;

export const chipOk = css`
  ${chip};
  background: ${C.greenSubtle};
  border-color: transparent;
  color: ${C.green};
`;

// ─── Answer evaluator, the hero's object ──────────────────────────────────────

export const evalTitle = css`
  font-size: var(--text-md);
  font-weight: 500;
  letter-spacing: 0;
  color: ${C.text};
`;

export const evalLine = css`
  font-size: var(--text-sm);
  color: ${C.muted};
  text-align: right;
  max-width: 34ch;
`;

export const demoQ = css`
  margin-top: var(--space-xs);
  font-size: var(--text-lg);
  font-weight: 500;
  line-height: 1.3;
  color: ${C.text};
`;

export const demoAnsL = css`
  ${label};
  color: ${C.accent};
`;

export const demoAnsT = css`
  margin-top: var(--space-2xs);
  font-size: var(--text-sm);
  line-height: 1.55;
  color: ${C.ink2};
`;

export const demoResult = css`
  padding: var(--space-md) var(--space-lg);
  background: ${C.paper3};
  border-top: 1px solid ${C.border};
`;

export const demoScoreRow = css`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-xs) var(--space-md);
`;

export const reading = css`
  font-family: ${FONT.mono};
  font-size: var(--text-3xl);
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums slashed-zero;
  color: ${C.cool};
`;

export const readingUnit = css`
  font-size: var(--text-md);
  letter-spacing: 0;
  color: ${C.muted};
`;

export const demoVerdict = css`
  font-size: var(--text-sm);
  color: ${C.ink2};
`;

export const demoFb = css`
  margin-top: var(--space-sm);
  font-size: var(--text-sm);
  line-height: 1.55;
  color: ${C.ink2};
  strong {
    font-weight: 500;
    color: ${C.text};
  }
  .ok {
    font-weight: 500;
    color: ${C.green};
  }
`;

// ─── Figures ──────────────────────────────────────────────────────────────────

export const statsRow = css`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-block: 1px solid ${C.border};
  @media (max-width: ${SMALL}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const statCell = css`
  padding: var(--space-xl) var(--space-lg);
  border-left: 1px solid ${C.border};
  &:first-of-type {
    padding-left: 0;
    border-left: 0;
  }
  @media (max-width: ${SMALL}) {
    padding: var(--space-lg) var(--space-md);
    &:nth-of-type(odd) {
      padding-left: 0;
      border-left: 0;
    }
  }
`;

export const statN = css`
  font-family: ${FONT.mono};
  font-size: var(--text-display-s);
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums slashed-zero;
  color: ${C.text};
`;

export const statL = css`
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  color: ${C.muted};
`;

// ─── Practice modes, as rows ──────────────────────────────────────────────────

export const modeList = css`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid ${C.rule2};
`;

export const modeRow = css`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 4fr) minmax(0, 3fr);
  gap: var(--space-md) var(--gap-columns);
  align-items: baseline;
  padding: var(--space-lg) 0;
  border-bottom: 1px solid ${C.border};
  color: inherit;
  text-decoration: none;
  transition: background-color var(--dur-short) var(--ease-out);
  &:hover {
    background: ${C.bgSubtle};
  }
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-xs);
  }
`;

export const modeName = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  font-size: var(--text-title);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: ${C.text};
`;

export const modeCount = css`
  font-family: ${FONT.mono};
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums slashed-zero;
  color: ${C.cool};
`;

export const modeDesc = css`
  font-size: var(--text-md);
  line-height: 1.5;
  color: ${C.muted};
`;

// ─── Sprint ───────────────────────────────────────────────────────────────────

export const sprintGrid = css`
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: var(--gap-columns);
  align-items: start;
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const sprintClaims = css`
  position: sticky;
  top: 6rem;
  list-style: none;
  margin: 0;
  padding: 0;
  @media (max-width: ${SMALL}) {
    position: static;
  }
`;

export const sprintClaim = css`
  padding-block: var(--space-md);
  border-top: 1px solid ${C.border};
  &:first-of-type {
    border-top: 1px solid ${C.rule2};
  }
`;

export const claimTitle = css`
  font-size: var(--text-md);
  font-weight: 500;
  color: ${C.text};
`;

export const claimDesc = css`
  margin-top: var(--space-2xs);
  font-size: var(--text-sm);
  line-height: 1.5;
  color: ${C.muted};
`;

export const sprintHUD = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm) var(--space-lg);
  padding: var(--space-sm) var(--space-lg);
  background: ${C.paper3};
  border-bottom: 1px solid ${C.border};
  font-size: var(--text-sm);
  color: ${C.muted};
`;

export const measured = css`
  font-family: ${FONT.mono};
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums slashed-zero;
  color: ${C.cool};
`;

export const hudTrack = css`
  flex: 1;
  min-width: 6rem;
  height: 4px;
  border-radius: 2px;
  background: ${C.border};
  overflow: hidden;
`;

export const hudFill = (pct: number) => css`
  width: ${pct}%;
  height: 100%;
  background: ${C.cool};
`;

export const sprintBody = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const sprintCol = css`
  padding: var(--space-lg);
  min-width: 0;
  & + & {
    border-left: 1px solid ${C.border};
    @media (max-width: ${SMALL}) {
      border-left: 0;
      border-top: 1px solid ${C.border};
    }
  }
`;

export const colLabel = css`
  ${label};
  margin-bottom: var(--space-sm);
`;

export const sprintQ = css`
  margin-top: var(--space-sm);
  font-size: var(--text-md);
  font-weight: 500;
  line-height: 1.4;
  color: ${C.text};
`;

export const sprintCode = css`
  margin: var(--space-sm) 0;
  padding: var(--space-sm) var(--space-md);
  background: ${C.paper3};
  border: 1px solid ${C.border};
  border-radius: var(--radius-pill);
  font-family: ${FONT.mono};
  font-size: var(--text-xs);
  line-height: 1.7;
  color: ${C.text};
  overflow-x: auto;
  white-space: pre;
`;

export const sprintInputRow = css`
  display: flex;
  gap: var(--space-xs);
`;

export const fakeInput = css`
  flex: 1;
  min-width: 0;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-sm);
  background: ${C.paper3};
  border: 1px solid ${C.rule2};
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  color: ${C.muted};
`;

export const fakeBtn = css`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 var(--space-md);
  border: 1px solid ${C.rule2};
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${C.text};
`;

export const skipLine = css`
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  color: ${C.muted};
`;

export const evalQuote = css`
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  line-height: 1.5;
  color: ${C.muted};
`;

export const evalScore = css`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
`;

export const queueList = css`
  list-style: none;
  margin: var(--space-md) 0 0;
  padding: var(--space-sm) 0 0;
  border-top: 1px solid ${C.border};
  li {
    margin-top: var(--space-2xs);
    font-size: var(--text-sm);
    color: ${C.ink2};
  }
`;

export const resultRow = css`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-md) var(--space-xl);
  align-items: center;
  padding: var(--space-lg);
  background: ${C.paper3};
  border-top: 1px solid ${C.border};
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const resultNote = css`
  font-size: var(--text-sm);
  line-height: 1.5;
  color: ${C.ink2};
  strong {
    font-weight: 500;
    color: ${C.text};
  }
  p + p {
    margin-top: var(--space-2xs);
  }
`;

export const sprintCTARow = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-xl);
`;

export const sprintStartBtn = btnP;

export const sprintCTASub = css`
  font-size: var(--text-sm);
  color: ${C.muted};
`;

// ─── Daily habit: question of the day and leaderboard ─────────────────────────

export const twoCol = css`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: var(--gap-columns);
  align-items: stretch;
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const qotdCard = css`
  ${panel};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-xl);
  padding: var(--space-xl);
`;

export const qotdTitle = css`
  margin-top: var(--space-md);
  font-size: var(--text-2xl);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: ${C.text};
`;

export const qotdSub = css`
  margin-top: var(--space-md);
  font-size: var(--text-md);
  line-height: 1.5;
  color: ${C.muted};
`;

export const qotdBtn = css`
  ${btnO};
  align-self: flex-start;
`;

export const lbCard = css`
  ${panel};
  display: flex;
  flex-direction: column;
`;

export const lbHeadT = css`
  font-size: var(--text-md);
  font-weight: 500;
  color: ${C.text};
`;

export const lbReset = css`
  font-size: var(--text-sm);
  color: ${C.muted};
  white-space: nowrap;
`;

export const lbRow = css`
  display: grid;
  grid-template-columns: var(--space-lg) minmax(0, 1fr) auto;
  gap: var(--space-md);
  align-items: baseline;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid ${C.border};
`;

export const lbRank = css`
  font-family: ${FONT.mono};
  font-size: var(--text-sm);
  color: ${C.muted};
`;

export const lbName = css`
  font-size: var(--text-lg);
  font-weight: 500;
  color: ${C.accent};
`;

export const lbCta = css`
  margin-top: auto;
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${C.text};
  text-decoration: underline;
  text-decoration-color: ${C.rule2};
  text-underline-offset: 0.2em;
  transition: color var(--dur-short) var(--ease-out);
  &:hover {
    color: ${C.accent};
  }
`;

// ─── Why devs switch, as a diff ───────────────────────────────────────────────

export const diffHead = css`
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-md);
  font-size: var(--text-title);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: ${C.text};
`;

export const diffRow = css`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 4fr) minmax(0, 5fr);
  border-bottom: 1px solid ${C.border};
  font-size: var(--text-sm);
  line-height: 1.5;
  &:last-of-type {
    border-bottom: 0;
  }
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const diffLabel = css`
  padding: var(--space-md) var(--space-lg);
  font-weight: 500;
  color: ${C.text};
`;

const diffCell = css`
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  color: ${C.text};
`;

export const diffMinus = css`
  ${diffCell};
  background: ${C.redSubtle};
  > span:first-of-type {
    font-family: ${FONT.mono};
    color: ${C.red};
    flex-shrink: 0;
  }
`;

export const diffPlus = css`
  ${diffCell};
  background: ${C.greenSubtle};
  > span:first-of-type {
    font-family: ${FONT.mono};
    color: ${C.green};
    flex-shrink: 0;
  }
`;

// ─── Testimonials ─────────────────────────────────────────────────────────────

// ─── Topics, as an index ──────────────────────────────────────────────────────

export const tpList = css`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid ${C.rule2};
`;

export const tpRow = css`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 3fr) minmax(0, 2fr);
  gap: var(--space-xs) var(--gap-columns);
  align-items: baseline;
  padding: var(--space-md) 0;
  border-bottom: 1px solid ${C.border};
  color: inherit;
  text-decoration: none;
  transition: background-color var(--dur-short) var(--ease-out);
  &:hover {
    background: ${C.bgSubtle};
  }
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr) auto;
  }
`;

export const tpName = css`
  font-size: var(--text-lg);
  font-weight: 500;
  color: ${C.text};
  @media (max-width: ${SMALL}) {
    grid-column: 1 / -1;
  }
`;

export const tpDiff = css`
  font-size: var(--text-sm);
  color: ${C.muted};
`;

export const tpMore = css`
  margin-top: var(--space-xl);
`;

// ─── AI tools, panels from one surface ────────────────────────────────────────

export const aiG = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: ${C.border};
  border: 1px solid ${C.border};
  border-radius: var(--radius-card);
  overflow: hidden;
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const aiCard = css`
  padding: var(--space-xl) var(--space-lg);
  background: ${C.bgSubtle};
  svg {
    color: ${C.cool};
  }
`;

export const aiLab = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  margin-top: var(--space-md);
  font-size: var(--text-lg);
  font-weight: 500;
  color: ${C.text};
`;

export const aiDsc = css`
  margin-top: var(--space-xs);
  font-size: var(--text-md);
  line-height: 1.5;
  color: ${C.muted};
`;

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const priceG = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: ${C.border};
  border: 1px solid ${C.border};
  border-radius: var(--radius-card);
  overflow: hidden;
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const priceC = css`
  display: flex;
  flex-direction: column;
  padding: var(--space-xl);
  background: ${C.bgSubtle};
`;

export const priceName = css`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-lg);
  font-weight: 500;
  color: ${C.text};
`;

export const pPrice = css`
  margin-top: var(--space-md);
  font-family: ${FONT.mono};
  font-size: var(--text-display-s);
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums slashed-zero;
  color: ${C.text};
`;

export const pPer = css`
  margin-left: var(--space-2xs);
  font-size: var(--text-md);
  letter-spacing: 0;
  color: ${C.muted};
`;

export const pNote = css`
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  color: ${C.muted};
`;

export const pFeats = css`
  list-style: none;
  margin: var(--space-lg) 0;
  padding: var(--space-md) 0 0;
  border-top: 1px solid ${C.border};
  flex: 1;
`;

export const pFeat = css`
  display: flex;
  gap: var(--space-xs);
  padding-block: var(--space-2xs);
  font-size: var(--text-md);
  line-height: 1.4;
  color: ${C.ink2};
  svg {
    flex-shrink: 0;
    margin-top: var(--space-3xs);
    color: ${C.green};
  }
`;

export const pBtnF = css`
  ${btnO};
  width: 100%;
`;

export const pBtnP = css`
  ${btnP};
  width: 100%;
`;

export const proPayBtn = pBtnP;

export const proActiveBtn = css`
  ${btnO};
  width: 100%;
  color: ${C.green};
`;

export const pcNote = css`
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  text-align: center;
  color: ${C.muted};
`;

export const pcError = css`
  ${pcNote};
  color: ${C.red};
`;

// ─── Close and footer ─────────────────────────────────────────────────────────

export const btmCta = css`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: var(--space-lg) var(--gap-columns);
  align-items: end;
  padding-block: var(--space-3xl);
  @media (max-width: ${SMALL}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const btmD = css`
  margin-block: var(--space-md) var(--space-lg);
  font-size: var(--text-lead);
  line-height: 1.45;
  color: ${C.ink2};
`;


import { css } from '@emotion/react'
import { C, BP, RADIUS } from '@/styles/tokens'

export const page = css`
  position: relative;
  min-height: 100vh;
`

export const glow1 = css`
  position: fixed;
  width: 16rem;
  height: 16rem;
  border-radius: 9999px;
  background: ${C.accent}0d;
  filter: blur(80px);
  top: -50px;
  left: -50px;
  pointer-events: none;
  @media (min-width: ${BP.sm}) { width: 600px; height: 600px; top: -100px; left: -100px; }
`

export const glow2 = css`
  position: fixed;
  width: 12rem;
  height: 12rem;
  border-radius: 9999px;
  background: ${C.accent3}0d;
  filter: blur(80px);
  bottom: 0;
  right: 0;
  pointer-events: none;
  @media (min-width: ${BP.sm}) { width: 400px; height: 400px; }
`

export const inner = css`
  max-width: 64rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  position: relative;
  z-index: 1;
  @media (min-width: ${BP.sm}) { padding: 5rem 1.5rem; }
`

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const hero = css`
  text-align: center;
  margin-bottom: 3.5rem;
  @media (min-width: ${BP.sm}) { margin-bottom: 5rem; }
`

export const heroPill = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${C.accent}1a;
  border: 1px solid ${C.accent}33;
  color: ${C.accent};
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  @media (min-width: ${BP.sm}) { font-size: 0.75rem; }
`

export const heroTitle = css`
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
  @media (min-width: ${BP.sm}) { font-size: 3.5rem; }
  @media (min-width: ${BP.md}) { font-size: 4.5rem; }
`

export const heroAccent = css`
  color: ${C.accent};
`

export const heroDesc = css`
  color: ${C.muted};
  font-size: 0.875rem;
  max-width: 36rem;
  margin: 0 auto 0.75rem;
  padding: 0 1rem;
  @media (min-width: ${BP.sm}) { font-size: 1.125rem; }
`

export const heroSubDesc = css`
  color: rgba(255,255,255,0.3);
  font-size: 0.75rem;
  margin-bottom: 2rem;
  @media (min-width: ${BP.sm}) { font-size: 0.875rem; }
`

export const heroCtas = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`

export const ctaPrimary = css`
  width: 100%;
  max-width: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${C.accent};
  color: white;
  font-weight: 900;
  font-size: 0.875rem;
  padding: 1rem 2rem;
  border-radius: ${RADIUS.xl};
  text-decoration: none;
  transition: all 0.15s ease;
  box-shadow: 0 8px 24px ${C.accent}40;
  &:hover { background: ${C.accent}e6; transform: translateY(-1px); }
  &:active { transform: scale(0.98); }
  @media (min-width: ${BP.sm}) { width: auto; font-size: 1rem; }
`

export const ctaSecondary = css`
  color: ${C.muted};
  font-size: 0.75rem;
  text-decoration: underline;
  text-underline-offset: 4px;
  &:hover { color: white; }
`

// ─── Stats ────────────────────────────────────────────────────────────────────

export const statsGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 4rem;
  @media (min-width: ${BP.sm}) { grid-template-columns: repeat(4, 1fr); gap: 1rem; }
`

export const statCard = css`
  text-align: center;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  @media (min-width: ${BP.sm}) { padding: 1.5rem; border-radius: ${RADIUS.xxl}; }
`

export const statNum = css`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${C.accent2};
  margin-bottom: 0.25rem;
  @media (min-width: ${BP.sm}) { font-size: 2rem; }
`

export const statLabel = css`
  color: ${C.muted};
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  @media (min-width: ${BP.sm}) { font-size: 0.75rem; }
`

// ─── Section headers ──────────────────────────────────────────────────────────

export const sectionWrapper = css`
  margin-bottom: 4rem;
  @media (min-width: ${BP.sm}) { margin-bottom: 6rem; }
`

export const sectionEyebrow = (color: string) => css`
  text-align: center;
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${color};
  margin-bottom: 0.75rem;
  @media (min-width: ${BP.sm}) { font-size: 0.75rem; }
`

export const sectionTitle = css`
  font-size: 1.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
  @media (min-width: ${BP.sm}) { font-size: 2.25rem; }
`

export const sectionDesc = css`
  color: ${C.muted};
  text-align: center;
  font-size: 0.75rem;
  max-width: 24rem;
  margin: 0 auto 2rem;
  @media (min-width: ${BP.sm}) { font-size: 0.875rem; }
`

// ─── Mode tabs ────────────────────────────────────────────────────────────────

export const tabRow = css`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
  @media (min-width: ${BP.sm}) { justify-content: center; }
`

export const tabBtn = (active: boolean, bg: string, color: string) => css`
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border-radius: ${RADIUS.xl};
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${active ? color + '80' : C.border};
  background: ${active ? bg : 'transparent'};
  color: ${active ? color : C.muted};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { color: ${active ? color : 'white'}; }
  &:active { transform: scale(0.97); }
`

export const tabContent = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.25rem;
  @media (min-width: ${BP.sm}) { padding: 2rem; }
`

export const tabContentInner = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  @media (min-width: ${BP.sm}) { gap: 1rem; }
`

export const tabIconBox = (bg: string) => css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${RADIUS.xl};
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${bg};
  @media (min-width: ${BP.sm}) { width: 3rem; height: 3rem; }
`

export const tabMeta = css`
  flex: 1;
  min-width: 0;
`

export const tabTitleRow = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const tabTitle = css`
  font-weight: 900;
  font-size: 1rem;
  @media (min-width: ${BP.sm}) { font-size: 1.25rem; }
`

export const tabCount = (bg: string, color: string) => css`
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid ${color}33;
  background: ${bg};
  color: ${color};
`

export const tabDesc = css`
  color: ${C.muted};
  font-size: 0.75rem;
  line-height: 1.6;
  @media (min-width: ${BP.sm}) { font-size: 0.875rem; }
`

export const tabFeatures = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  @media (min-width: ${BP.sm}) { grid-template-columns: 1fr 1fr; }
`

export const tabFeatureItem = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${C.text};
  @media (min-width: ${BP.sm}) { font-size: 0.875rem; }
`

// ─── AI Features grid ─────────────────────────────────────────────────────────

export const aiFeaturesGrid = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  @media (min-width: ${BP.sm}) { grid-template-columns: 1fr 1fr; }
  @media (min-width: ${BP.lg}) { grid-template-columns: 1fr 1fr 1fr; }
`

export const aiFeatureCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  transition: border-color 0.15s ease;
  &:hover { border-color: ${C.accent}4d; }
  @media (min-width: ${BP.sm}) { display: block; padding: 1.5rem; border-radius: ${RADIUS.xxl}; }
`

export const aiFeatureIcon = css`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  @media (min-width: ${BP.sm}) { margin-bottom: 0.75rem; }
`

export const aiFeatureTitle = css`
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  @media (min-width: ${BP.sm}) { font-size: 0.875rem; }
`

export const aiFeatureDesc = css`
  color: ${C.muted};
  font-size: 0.6875rem;
  line-height: 1.6;
  @media (min-width: ${BP.sm}) { font-size: 0.75rem; }
`

// ─── Before/After ─────────────────────────────────────────────────────────────

export const beforeAfterCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.25rem;
  @media (min-width: ${BP.sm}) { padding: 2rem; }
`

export const beforeAfterTitle = css`
  font-size: 1.25rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 1.5rem;
  @media (min-width: ${BP.sm}) { font-size: 1.5rem; margin-bottom: 2rem; }
`

export const beforeAfterGrid = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  @media (min-width: ${BP.sm}) { grid-template-columns: repeat(3, 1fr); }
`

export const beforeAfterItem = css`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  @media (min-width: ${BP.sm}) { display: block; }
`

export const beforeAfterEmoji = css`
  font-size: 1.25rem;
  flex-shrink: 0;
  @media (min-width: ${BP.sm}) { font-size: 1.5rem; margin-bottom: 0.75rem; }
`

export const beforeAfterLabel = css`
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.muted};
  margin-bottom: 0.5rem;
`

export const beforeRow = css`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.375rem;
`

export const afterRow = css`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${C.text};
`

// ─── Pricing ─────────────────────────────────────────────────────────────────

export const pricingGrid = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 40rem;
  margin: 0 auto;
  @media (min-width: ${BP.sm}) { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
`

export const pricingCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  @media (min-width: ${BP.sm}) { padding: 2rem; }
`

export const pricingCardPro = css`
  background: ${C.card};
  border: 2px solid ${C.accent};
  border-radius: ${RADIUS.xxl};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  @media (min-width: ${BP.sm}) { padding: 2rem; }
`

export const popularBadge = css`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${C.accent};
  color: white;
  font-size: 0.5625rem;
  font-weight: 900;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  @media (min-width: ${BP.sm}) { top: 1rem; right: 1rem; font-size: 0.625rem; }
`

export const planName = css`
  font-size: 1.125rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
`

export const planPrice = css`
  font-size: 1.875rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.25rem;
  @media (min-width: ${BP.sm}) { font-size: 2.25rem; }
`

export const planPriceNote = css`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${C.muted};
`

export const planTagline = css`
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 1.25rem;
`

export const featureList = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex: 1;
`

export const featureItem = css`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  @media (min-width: ${BP.sm}) { font-size: 0.875rem; }
`

export const planBtnFree = css`
  display: block;
  text-align: center;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: border-color 0.15s ease;
  &:hover { border-color: ${C.accent}80; }
  &:active { transform: scale(0.98); }
`

export const planBtnPro = css`
  display: block;
  text-align: center;
  background: ${C.accent};
  border-radius: ${RADIUS.xl};
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 900;
  color: white;
  text-decoration: none;
  transition: all 0.15s ease;
  box-shadow: 0 4px 16px ${C.accent}33;
  &:hover { background: ${C.accent}e6; transform: translateY(-1px); }
  &:active { transform: scale(0.98); }
`

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

export const bottomCta = css`
  text-align: center;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 2rem 1.25rem;
  margin-bottom: 2.5rem;
  @media (min-width: ${BP.sm}) { padding: 3rem; }
`

export const bottomCtaEmoji = css`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  @media (min-width: ${BP.sm}) { font-size: 3rem; }
`

export const bottomCtaTitle = css`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
  @media (min-width: ${BP.sm}) { font-size: 2rem; }
`

export const bottomCtaDesc = css`
  color: ${C.muted};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  max-width: 24rem;
  margin-left: auto;
  margin-right: auto;
`

export const footer = css`
  text-align: center;
  color: ${C.muted};
  font-size: 0.75rem;
  padding-bottom: 1rem;
`
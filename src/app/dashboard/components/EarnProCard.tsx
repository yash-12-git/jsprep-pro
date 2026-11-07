/** @jsxImportSource @emotion/react */
"use client";

import Link from "next/link";
import { css, keyframes } from "@emotion/react";
import { Gift, MessageSquare, Users } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";

interface Props {
  isPro: boolean;
}

/** The dashboard's way into /earn-pro: what each reward is, one action. */
export default function EarnProCard({ isPro }: Props) {
  return (
    <section css={card} aria-labelledby="earn-pro-title">
      <div css={iconTile} aria-hidden="true">
        <Gift size={22} />
      </div>
      <div css={body}>
        <h2 id="earn-pro-title" css={title}>
          {isPro ? "Earn extra Pro days" : "Get Pro free"}
        </h2>
        <p css={lede}>
          {isPro
            ? "Days you earn are saved and start when your subscription ends."
            : "No card needed. Pick either, or both."}
        </p>
        <ul css={rewards}>
          <li>
            <Users size={15} aria-hidden="true" />
            <span>
              <strong>2 weeks each</strong> for you and every friend you invite
            </span>
          </li>
          <li>
            <MessageSquare size={15} aria-hidden="true" />
            <span>
              <strong>1 week</strong> for telling us what to improve
            </span>
          </li>
        </ul>
      </div>
      <Link href="/earn-pro" className="btn btn--primary" css={cta}>
        Get my invite link
      </Link>
    </section>
  );
}

const sheen = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(250%); }
`;

const nudge = keyframes`
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(-12deg); }
  40% { transform: rotate(10deg); }
  60% { transform: rotate(-6deg); }
  80% { transform: rotate(3deg); }
`;

const card = css`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1.25rem;
  padding: 1.125rem 1.25rem;
  border: 1px solid ${C.accent};
  border-radius: ${RADIUS.xl};
  background: ${C.accentSubtle};

  /* One light sweep across the card when the dashboard opens. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 40%;
    background: linear-gradient(
      100deg,
      transparent,
      color-mix(in oklab, ${C.accent} 18%, transparent),
      transparent
    );
    transform: translateX(-100%);
    animation: ${sheen} 1.6s ease-out 0.6s 1 both;
    pointer-events: none;
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      display: none;
    }
  }
`;

const iconTile = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${RADIUS.lg};
  background: ${C.accent};
  color: ${C.accentInk};
  svg {
    animation: ${nudge} 0.9s ease-in-out 0.4s 2;
  }
  @media (prefers-reduced-motion: reduce) {
    svg {
      animation: none;
    }
  }
`;

const body = css`
  flex: 1;
  min-width: 0;
  @media (max-width: 640px) {
    flex-basis: calc(100% - 4rem);
  }
`;

const title = css`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${C.text};
`;

const lede = css`
  margin: 0.125rem 0 0.5rem;
  font-size: 0.8125rem;
  color: ${C.muted};
`;

const rewards = css`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1.25rem;
  font-size: 0.8125rem;
  color: ${C.muted};
  li {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  svg {
    flex-shrink: 0;
    color: ${C.accent};
  }
  strong {
    color: ${C.text};
    font-weight: 500;
  }
`;

const cta = css`
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

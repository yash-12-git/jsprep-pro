/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import { Gift, X } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";

const DISMISS_KEY = "jsprep-earn-pro-dismissed";

interface Props {
  /** Set when this sprint just paid out a referral. */
  referralRewarded?: boolean;
}

/**
 * Shown after a moment of value (a finished sprint), never on landing, and
 * only until the user closes it. /earn-pro stays reachable from the dashboard.
 */
export default function EarnProOffer({ referralRewarded = false }: Props) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      setHidden(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);

  function dismiss() {
    setHidden(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Without storage it just shows again next time.
    }
  }

  if (referralRewarded) {
    return (
      <div css={card} role="status">
        <Gift size={18} color={C.green} css={{ flexShrink: 0 }} aria-hidden="true" />
        <p css={text}>
          Your invite is complete. You and the friend who invited you each get
          2 weeks of Pro.
        </p>
      </div>
    );
  }

  if (hidden) return null;

  return (
    <div css={card}>
      <Gift size={18} color={C.accent} css={{ flexShrink: 0 }} aria-hidden="true" />
      <div css={{ flex: 1, minWidth: 0 }}>
        <p css={[text, { color: C.text, fontWeight: 500 }]}>Get Pro free</p>
        <p css={text}>
          Tell us what to improve for a free week, or invite a friend and you
          both get 2 weeks.
        </p>
        <Link href="/earn-pro" className="btn btn--primary btn--small" css={{ marginTop: "0.75rem" }}>
          See how
        </Link>
      </div>
      <button css={closeBtn} onClick={dismiss} aria-label="Hide this offer">
        <X size={16} />
      </button>
    </div>
  );
}

const card = css`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem 1.125rem;
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  background: ${C.card};
  margin: 1rem 0;
`;

const text = css`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${C.muted};
`;

const closeBtn = css`
  display: flex;
  padding: 0.25rem;
  border: none;
  background: none;
  color: ${C.muted};
  cursor: pointer;
  border-radius: ${RADIUS.md};
  &:hover {
    color: ${C.text};
  }
  &:focus-visible {
    outline: 2px solid ${C.accent};
  }
`;

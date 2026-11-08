/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { css } from "@emotion/react";
import { Gift, X } from "lucide-react";
import { C, RADIUS } from "@/styles/tokens";
import { useAuth } from "@/hooks/useAuth";
import { hasPendingInvite, rememberInviteCode } from "@/lib/rewardsClient";

const DISMISS_KEY = "jsprep-invite-banner-dismissed";

/**
 * Tells a signed-out visitor who opened a friend's invite link what happens
 * next: Google sign-in creates the account, and a finished sprint pays both.
 */
export default function InviteBanner() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    // Runs before AuthProvider's own effect, so store the code here too.
    rememberInviteCode();
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // No storage: show it.
    }
    setInvited(hasPendingInvite() && !dismissed);
  }, []);

  function dismiss() {
    setInvited(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Shows again on the next page.
    }
  }

  // The sign-in page explains it itself.
  if (!invited || loading || user || pathname === "/auth") return null;

  return (
    <div css={bar} role="region" aria-label="Your invite" data-focus-hide>
      <div css={inner}>
        <Gift size={18} color={C.accent} css={{ flexShrink: 0 }} aria-hidden="true" />
        <p css={text}>
          <strong css={{ color: C.text, fontWeight: 500 }}>A friend invited you.</strong>{" "}
          Continue with Google to create your free account, then finish one
          Interview Sprint. You both get 2 weeks of Pro.
        </p>
        <Link href="/auth?next=/sprint" className="btn btn--primary btn--small" css={cta}>
          Create free account
        </Link>
        <button css={closeBtn} onClick={dismiss} aria-label="Hide this message">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

const bar = css`
  border-bottom: 1px solid ${C.border};
  background: ${C.accentSubtle};
`;

const inner = css`
  max-width: 72rem;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  @media (max-width: 640px) {
    flex-wrap: wrap;
    align-items: flex-start;
  }
`;

const text = css`
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${C.muted};
  @media (max-width: 640px) {
    flex-basis: calc(100% - 5rem);
  }
`;

const cta = css`
  flex-shrink: 0;
  @media (max-width: 640px) {
    order: 3;
    margin-left: 1.875rem;
  }
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
  @media (max-width: 640px) {
    order: 2;
    margin-left: auto;
  }
`;

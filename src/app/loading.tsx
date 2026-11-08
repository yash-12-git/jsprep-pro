/** @jsxImportSource @emotion/react */
"use client";

import { css, keyframes } from "@emotion/react";
import * as Shared from "@/styles/shared";

/**
 * Shown the moment a link is clicked while the next page renders. Without a
 * loading boundary a click did nothing visible until the server answered, and
 * Next couldn't prefetch dynamic pages at all.
 *
 * The spinner fades in after a short delay, so fast navigations don't flash it.
 */
export default function Loading() {
  return (
    <div css={Shared.spinner} role="status" aria-label="Loading">
      <div css={[Shared.spinnerDot, delayed]} />
    </div>
  );
}

const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const delayed = css`
  opacity: 0;
  animation:
    spin 0.7s linear infinite,
    ${appear} 0.2s ease-out 0.25s forwards;
  @media (prefers-reduced-motion: reduce) {
    animation: spin 0.7s linear infinite;
    opacity: 1;
  }
`;

/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

const notice = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  padding: 0.625rem 0.875rem;
  margin: 0.625rem 0;
  border-radius: ${RADIUS.md};
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  color: ${C.red};
  font-size: 0.8125rem;
  line-height: 1.5;
`;

const retryBtn = css`
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  border-radius: ${RADIUS.md};
  background: transparent;
  border: 1px solid ${C.redBorder};
  color: ${C.red};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: ${C.bgHover};
  }
`;

/** Shows why an AI request failed, with a retry button when one is passed. */
export default function AIErrorNotice({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div css={notice} role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" css={retryBtn} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

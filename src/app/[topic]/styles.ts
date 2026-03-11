import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const emptyState = css`
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: ${RADIUS.xl};
  padding: 2rem 1.5rem;
  text-align: center;
`;

export const emptyText = css`
  color: ${C.muted};
  font-size: 0.875rem;
  margin: 0 0 0.5rem;
`;

export const emptyHint = css`
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8125rem;
  margin: 0;
`;

export const emptyCode = css`
  background: rgba(124, 106, 247, 0.15);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #c4b5fd;
  font-family: "JetBrains Mono", monospace;
`;

export const adminLink = css`
  color: ${C.accent};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

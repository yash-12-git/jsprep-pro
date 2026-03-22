import { css } from "@emotion/react";
import { C, RADIUS, BP } from "@/styles/tokens";

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const emptyState = css`
  text-align: center;
  padding: 4rem 1rem;
  color: ${C.muted};
`;

export const emptyTitle = css`
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${C.text};
  margin-bottom: 0.5rem;
`;

export const skeleton = css`
  height: 4.5rem;
  border-radius: ${RADIUS.lg};
  background: ${C.bgSubtle};
  border: 1px solid ${C.border};
  background-image: linear-gradient(
    90deg,
    ${C.bgSubtle} 0px,
    ${C.bgHover} 80px,
    ${C.bgSubtle} 160px
  );
  background-size: 400px 100%;
  animation: shimmer 1.4s linear infinite;
  @keyframes shimmer {
    0% {
      background-position: -400px 0;
    }
    100% {
      background-position: 400px 0;
    }
  }
`;

export const errorBox = css`
  padding: 1.25rem;
  background: ${C.redSubtle};
  border: 1px solid ${C.redBorder};
  border-radius: ${RADIUS.lg};
  color: ${C.red};
  font-size: 0.875rem;
  text-align: center;
`;

export const listHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${C.muted};
  margin-bottom: 0.875rem;
`;

export const listHeaderCount = css`
  font-weight: 600;
  color: ${C.text};
`;

export const pagination = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid ${C.border};
`;

export const pageBtn = (enabled: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${RADIUS.md};
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid ${C.border};
  background: ${C.bg};
  color: ${enabled ? C.text : C.muted};
  cursor: ${enabled ? "pointer" : "default"};
  transition:
    border-color 0.12s ease,
    background 0.12s ease;
  &:hover {
    border-color: ${enabled ? C.borderStrong : C.border};
    background: ${enabled ? C.bgHover : C.bg};
  }
`;

export const pageDots = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const pageNum = (active: boolean) => css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${RADIUS.sm};
  font-size: 0.75rem;
  font-weight: ${active ? "600" : "400"};
  border: 1px solid ${active ? C.accent : C.border};
  background: ${active ? C.accentSubtle : "transparent"};
  color: ${active ? C.accentText : C.muted};
  cursor: pointer;
  transition: all 0.12s ease;
  &:hover {
    background: ${C.accentSubtle};
    border-color: ${C.accent};
    color: ${C.accentText};
  }
`;

export const pageEllipsis = css`
  color: ${C.muted};
  font-size: 0.75rem;
  padding: 0 0.125rem;
  pointer-events: none;
`;
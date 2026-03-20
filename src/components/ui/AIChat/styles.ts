import { css } from "@emotion/react";
import { C, RADIUS } from "@/styles/tokens";

export const wrapper = css`
  border-top: 1px solid ${C.border};
  background: ${C.bgSubtle};
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1.125rem;
  border-bottom: 1px solid ${C.border};
`;

export const headerLeft = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const headerIcon = css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: ${C.accentSubtle};
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const headerTitle = css`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${C.accentText};
`;

export const headerSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
`;

export const closeBtn = css`
  background: none;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  transition: color 0.12s ease;
  padding: 0.125rem;
  &:hover {
    color: ${C.text};
  }
`;

export const messages = css`
  height: 16rem;
  overflow-y: auto;
  padding: 1rem 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: ${C.borderStrong} transparent;
  background: ${C.bg};
`;

export const messageRow = (isUser: boolean) => css`
  display: flex;
  gap: 0.625rem;
  flex-direction: ${isUser ? "row-reverse" : "row"};
`;

export const avatarBubble = (isUser: boolean) => css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.125rem;
  background: ${isUser ? C.bgActive : C.accentSubtle};
  border: 1px solid ${isUser ? C.border : C.border};
`;

export const messageBubble = (isUser: boolean) => css`
  max-width: 80%;
  font-size: 0.75rem;
  line-height: 1.65;
  border-radius: ${RADIUS.lg};
  padding: 0.5rem 0.75rem;
  white-space: pre-wrap;
  background: ${isUser ? C.accentSubtle : C.bgSubtle};
  border: 1px solid ${isUser ? C.border : C.border};
  color: ${C.text};
`;

export const loadingBubble = css`
  display: flex;
  gap: 0.625rem;
`;

export const quickPrompts = css`
  display: flex;
  gap: 0.375rem;
  padding: 0.5rem 1.125rem;
  overflow-x: auto;
  scrollbar-width: none;
  background: ${C.bg};
  border-top: 1px solid ${C.border};
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const promptChip = css`
  flex-shrink: 0;
  font-size: 0.625rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  border: 1px solid ${C.border};
  color: ${C.muted};
  background: none;
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
  &:hover {
    border-color: ${C.accent};
    color: ${C.accentText};
    background: ${C.accentSubtle};
  }
`;

export const inputRow = css`
  display: flex;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem 0.875rem;
  background: ${C.bg};
`;

export const input = css`
  flex: 1;
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.4375rem 0.75rem;
  font-size: 0.75rem;
  color: ${C.text};
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &::placeholder {
    color: ${C.placeholder};
  }
  &:focus {
    border-color: ${C.accent};
    box-shadow: 0 0 0 2px ${C.accentSubtle};
  }
`;

export const sendBtn = css`
  width: 2rem;
  height: 2rem;
  border-radius: ${RADIUS.md};
  background: ${C.accent};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.12s ease;
  &:hover {
    opacity: 0.88;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const wrapper = css`
  border-top: 1px solid ${C.border};
  background: #0d0d16;
`

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid ${C.border};
`

export const headerLeft = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const headerIcon = css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: ${C.accent}1a;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const headerTitle = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.accent};
`

export const headerSub = css`
  font-size: 0.75rem;
  color: ${C.muted};
`

export const closeBtn = css`
  background: none;
  border: none;
  cursor: pointer;
  color: ${C.muted};
  transition: color 0.15s ease;
  padding: 0.125rem;
  &:hover { color: white; }
`

export const messages = css`
  height: 16rem;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: ${C.border} transparent;
`

export const messageRow = (isUser: boolean) => css`
  display: flex;
  gap: 0.625rem;
  flex-direction: ${isUser ? 'row-reverse' : 'row'};
`

export const avatarBubble = (isUser: boolean) => css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.125rem;
  background: ${isUser ? C.surface : C.accent + '1a'};
  border: 1px solid ${isUser ? C.border : C.accent + '33'};
`

export const messageBubble = (isUser: boolean) => css`
  max-width: 80%;
  font-size: 0.75rem;
  line-height: 1.6;
  border-radius: ${RADIUS.xl};
  padding: 0.5rem 0.75rem;
  white-space: pre-wrap;
  background: ${isUser ? C.accent + '1a' : C.surface};
  border: 1px solid ${isUser ? C.accent + '33' : C.border};
  color: ${isUser ? 'white' : C.text};
`

export const loadingBubble = css`
  display: flex;
  gap: 0.625rem;
`

export const quickPrompts = css`
  display: flex;
  gap: 0.5rem;
  padding: 0 1.25rem 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

export const promptChip = css`
  flex-shrink: 0;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  border: 1px solid ${C.border};
  color: ${C.muted};
  background: none;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  &:hover { border-color: ${C.accent}80; color: white; }
`

export const inputRow = css`
  display: flex;
  gap: 0.5rem;
  padding: 0 1.25rem 1rem;
`

export const input = css`
  flex: 1;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xl};
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: white;
  outline: none;
  transition: border-color 0.15s ease;
  &::placeholder { color: ${C.muted}; }
  &:focus { border-color: ${C.accent}80; }
`

export const sendBtn = css`
  width: 2rem;
  height: 2rem;
  border-radius: ${RADIUS.lg};
  background: ${C.accent};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s ease;
  &:hover { background: ${C.accent}e6; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'

export const header = css`
  margin-bottom: 2rem;
  text-align: center;
`

export const iconBox = css`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${RADIUS.xl};
  background: ${C.purple}1a;
  border: 1px solid ${C.purple}33;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`

export const title = css`
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`

export const subtitle = css`
  color: ${C.muted};
  font-size: 0.875rem;
  max-width: 28rem;
  margin: 0 auto;
`

export const chatWindow = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  overflow: hidden;
`

export const messagesArea = css`
  height: 28rem;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scrollbar-width: thin;
  scrollbar-color: ${C.border} transparent;
`

export const messageRow = (isUser: boolean) => css`
  display: flex;
  gap: 0.75rem;
  flex-direction: ${isUser ? 'row-reverse' : 'row'};
`

export const avatar = (isUser: boolean) => css`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: ${isUser ? C.surface : C.purple + '1a'};
  border: 1px solid ${isUser ? C.border : C.purple + '33'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
`

export const bubble = (isUser: boolean) => css`
  max-width: 75%;
  font-size: 0.875rem;
  line-height: 1.6;
  border-radius: ${RADIUS.xl};
  padding: 0.75rem 1rem;
  background: ${isUser ? C.accent + '1a' : C.surface};
  border: 1px solid ${isUser ? C.accent + '33' : C.border};
  color: ${isUser ? 'white' : C.text};
  white-space: pre-wrap;
`

export const inputArea = css`
  border-top: 1px solid ${C.border};
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
`

export const input = css`
  flex: 1;
  background: ${C.surface};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.lg};
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: white;
  outline: none;
  resize: none;
  transition: border-color 0.15s ease;
  &::placeholder { color: ${C.muted}; }
  &:focus { border-color: ${C.purple}80; }
`

export const sendBtn = css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${RADIUS.lg};
  background: ${C.purple}33;
  border: 1px solid ${C.purple}4d;
  color: ${C.purple};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s ease;
  &:hover { background: ${C.purple}4d; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const turnCounter = css`
  text-align: center;
  font-size: 0.6875rem;
  color: ${C.muted};
  padding: 0.75rem;
  border-top: 1px solid ${C.border};
`

export const startCard = css`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: ${RADIUS.xxl};
  padding: 2.5rem;
  text-align: center;
`

export const topicGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin: 1.5rem 0;
  text-align: left;
  @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }
`

export const topicItem = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${C.text};
`
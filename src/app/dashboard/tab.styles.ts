import { css } from '@emotion/react'
import { C } from '@/styles/tokens'

export const nav = css`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 0.875rem;
  padding: 0.25rem;
`

export const btn = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.25rem;
  border-radius: 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover { color: rgba(255,255,255,0.75); }
`

export const btnActive = css`
  background: rgba(124,106,247,0.15);
  color: #c4b5fd;
  box-shadow: 0 1px 8px rgba(124,106,247,0.15);
`

export const statsRow = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
  margin: 1.25rem 0;
`

export const statCard = css`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 0.875rem;
  padding: 0.875rem 1rem;
  text-align: center;
`

export const jumpBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(124,106,247,0.1);
  border: 1px solid rgba(124,106,247,0.2);
  color: #c4b5fd;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 0.5rem;

  &:hover { background: rgba(124,106,247,0.18); }
`

export const listMeta = css`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.875rem;
`

export const pagination = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
`

export const pageBtn = (enabled: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: ${enabled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'};
  cursor: ${enabled ? 'pointer' : 'default'};
  transition: background 0.15s;

  &:hover { background: ${enabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}; }
`

export const pageDots = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const pageNum = (active: boolean) => css`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.4375rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${active ? 'rgba(124,106,247,0.4)' : 'rgba(255,255,255,0.07)'};
  background: ${active ? 'rgba(124,106,247,0.2)' : 'transparent'};
  color: ${active ? '#c4b5fd' : 'rgba(255,255,255,0.4)'};
  cursor: pointer;
  transition: all 0.12s;

  &:hover { background: rgba(124,106,247,0.1); color: rgba(255,255,255,0.75); }
`
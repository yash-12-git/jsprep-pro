/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { Bookmark, CheckCircle, Sparkles, Target, Lock } from 'lucide-react'
import { C, RADIUS } from '@/styles/tokens'

export type ActivePanel = 'chat' | 'eval' | null

interface Props {
  questionId: string
  isMastered: boolean
  isBookmarked: boolean
  isPro: boolean
  activePanel: ActivePanel
  onMastered: () => void
  onBookmark: () => void
  onPanel: (p: 'chat' | 'eval') => void
}

const S = {
  row: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    padding: 0.75rem 1.25rem 1rem;
    border-top: 1px solid rgba(255,255,255,0.05);
  `,

  btn: (color: string, active: boolean) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3125rem 0.75rem;
    border-radius: ${RADIUS.md};
    font-size: 0.6875rem;
    font-weight: 700;
    border: 1px solid ${active ? color + '66' : 'rgba(255,255,255,0.08)'};
    background: ${active ? color + '18' : 'transparent'};
    color: ${active ? color : C.muted};
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover {
      border-color: ${color + '55'};
      color: ${active ? color : 'white'};
      background: ${active ? color + '22' : color + '0d'};
    }
  `,
}

export default function QuestionActions({
  questionId, isMastered, isBookmarked, isPro,
  activePanel, onMastered, onBookmark, onPanel,
}: Props) {
  return (
    <div css={S.row}>
      <button css={S.btn(C.accent3, isMastered)} onClick={onMastered}>
        <CheckCircle size={12} />
        {isMastered ? 'Mastered ✓' : 'Mark mastered'}
      </button>

      <button css={S.btn(C.accent2, isBookmarked)} onClick={onBookmark}>
        {!isPro ? <Lock size={11} /> : <Bookmark size={12} />}
        {isBookmarked ? 'Saved' : 'Bookmark'}
      </button>

      <button css={S.btn(C.accent, activePanel === 'chat')} onClick={() => onPanel('chat')}>
        <Sparkles size={12} />
        {!isPro && <Lock size={10} />}
        AI Tutor
      </button>

      <button css={S.btn(C.purple, activePanel === 'eval')} onClick={() => onPanel('eval')}>
        <Target size={12} />
        {!isPro && <Lock size={10} />}
        Evaluate Me
      </button>
    </div>
  )
}
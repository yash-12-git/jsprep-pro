/** @jsxImportSource @emotion/react */
'use client'

import { useState } from 'react'
import { css } from '@emotion/react'
import { ChevronDown, Eye, Star, Zap } from 'lucide-react'
import { C, RADIUS } from '@/styles/tokens'
import MarkdownRenderer from '@/components/md/MarkdownRenderer'
import AIChat from '@/components/ui/AIChat/page'
import AnswerEvaluator from '@/components/ui/AnswerEvaluator/page'
import QuestionActions, { type ActivePanel } from './QuestionActions'
import type { Question } from '@/types/question'

interface Props {
  question: Question
  index: number
  isMastered: boolean
  isBookmarked: boolean
  isSolved: boolean
  isPro: boolean
  onMastered: () => void
  onBookmark: () => void
  onNeedsPro: (reason: string) => void
}

const DIFF_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  beginner: { bg: `${C.accent3}12`, color: C.accent3, border: `${C.accent3}33` },
  core:     { bg: `${C.accent}12`,  color: C.accent,  border: `${C.accent}33` },
  advanced: { bg: `${C.accent2}12`, color: C.accent2, border: `${C.accent2}33` },
  expert:   { bg: `${C.danger}12`,  color: C.danger,  border: `${C.danger}33` },
}

const S = {
  card: (mastered: boolean, open: boolean) => css`
    background: ${C.card};
    border: 1px solid ${
      mastered ? C.accent3 + '44' :
      open     ? C.accent  + '33' :
                 'rgba(255,255,255,0.07)'
    };
    border-radius: ${RADIUS.xxl};
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      border-color: ${mastered ? C.accent3 + '66' : C.accent + '33'};
      ${mastered ? `box-shadow: 0 0 0 1px ${C.accent3}22;` : ''}
    }
  `,

  summary: css`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    cursor: pointer;
    user-select: none;
  `,

  qNum: css`
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.625rem;
    font-weight: 600;
    color: ${C.accent};
    background: ${C.accent}14;
    border: 1px solid ${C.accent}30;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    flex-shrink: 0;
    margin-top: 0.1875rem;
    letter-spacing: 0.03em;
  `,

  meta: css`flex: 1; min-width: 0;`,

  title: css`
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.45;
    color: white;
    margin-bottom: 0.4375rem;
  `,

  tags: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.3125rem;
  `,

  tag: (bg: string, color: string, border: string) => css`
    font-size: 0.5625rem;
    font-weight: 700;
    padding: 0.125rem 0.4375rem;
    border-radius: 0.3125rem;
    background: ${bg};
    color: ${color};
    border: 1px solid ${border};
    letter-spacing: 0.02em;
  `,

  chevron: (open: boolean) => css`
    flex-shrink: 0;
    color: ${C.muted};
    transition: transform 0.25s ease;
    transform: rotate(${open ? '180deg' : '0deg'});
    margin-top: 0.1875rem;
  `,

  body: css`border-top: 1px solid rgba(255,255,255,0.06);`,

  hintBox: css`
    margin: 0.875rem 1.25rem 0;
    padding: 0.5rem 0.875rem;
    background: ${C.accent3}0f;
    border: 1px solid ${C.accent3}30;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    color: ${C.accent3};
    line-height: 1.5;
  `,

  answerWrap: css`padding: 0.875rem 1.25rem 0.25rem;`,

  proLabel: css`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.75rem 1.25rem;
    font-size: 0.75rem;
    color: ${C.muted};
  `,

  proBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: ${C.accent2}18;
    border: 1px solid ${C.accent2}44;
    color: ${C.accent2};
    font-size: 0.5625rem;
    font-weight: 900;
    padding: 0.125rem 0.4rem;
    border-radius: 0.25rem;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  `,

  masteredBanner: css`
    margin: 0 1.25rem 0.625rem;
    padding: 0.375rem 0.75rem;
    background: ${C.accent3}0f;
    border: 1px solid ${C.accent3}25;
    border-radius: 0.5rem;
    font-size: 0.6875rem;
    color: ${C.accent3};
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  `,
}

export default function QuestionCard({
  question, index,
  isMastered, isBookmarked, isSolved, isPro,
  onMastered, onBookmark, onNeedsPro,
}: Props) {
  const [open, setOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)

  const diffStyle = DIFF_COLORS[question.difficulty] ?? DIFF_COLORS.core

  function handlePanel(p: 'chat' | 'eval') {
    if (!isPro) {
      onNeedsPro('AI features are Pro only. Upgrade for AI tutoring, answer evaluation, and more.')
      return
    }
    setActivePanel(prev => prev === p ? null : p)
  }

  function handleBookmark() {
    if (!isPro) {
      onNeedsPro('Bookmarks are a Pro feature. Upgrade to save questions for quick review.')
      return
    }
    onBookmark()
  }

  return (
    <div css={S.card(isMastered, open)}>
      {/* ── Summary row ── */}
      <div css={S.summary} onClick={() => setOpen(o => !o)}>
        <span css={S.qNum}>#{String(index + 1).padStart(2, '0')}</span>

        <div css={S.meta}>
          <p css={S.title}>{question.title}</p>
          <div css={S.tags}>
            <span css={S.tag(diffStyle.bg, diffStyle.color, diffStyle.border)}>
              {question.difficulty}
            </span>
            <span css={S.tag(`${C.accent}12`, `${C.accent}cc`, `${C.accent}2a`)}>
              {question.category}
            </span>
            {question.isPro && (
              <span css={S.proBadge}><Zap size={8} /> PRO</span>
            )}
            {isMastered && (
              <span css={S.tag(C.accent3 + '12', C.accent3, C.accent3 + '33')}>
                ✓ mastered
              </span>
            )}
            {question.tags.slice(0, 2).map(t => (
              <span key={t} css={S.tag('rgba(255,255,255,0.04)', C.muted, 'rgba(255,255,255,0.08)')}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div css={S.chevron(open)}>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* ── Expanded body ── */}
      {open && (
        <div css={S.body}>
          {isMastered && (
            <div css={S.masteredBanner}>
              <Star size={12} fill={C.accent3} />
              Marked as mastered
            </div>
          )}

          {question.hint && (
            <div css={S.hintBox}>💡 Hint: {question.hint}</div>
          )}

          <div css={S.answerWrap}>
            <MarkdownRenderer content={question.answer} />
          </div>

          <QuestionActions
            questionId={question.id}
            isMastered={isMastered}
            isBookmarked={isBookmarked}
            isPro={isPro}
            activePanel={activePanel}
            onMastered={onMastered}
            onBookmark={handleBookmark}
            onPanel={handlePanel}
          />

          {activePanel === 'chat' && (
            <AIChat
              question={question.question}
              answer={question.answer}
              onClose={() => setActivePanel(null)}
            />
          )}
          {activePanel === 'eval' && (
            <AnswerEvaluator
              question={question.question}
              idealAnswer={question.answer}
              onClose={() => setActivePanel(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}
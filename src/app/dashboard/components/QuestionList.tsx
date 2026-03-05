/** @jsxImportSource @emotion/react */
'use client'

import { css, keyframes } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'
import QuestionCard from './QuestionCard'
import type { Question } from '@/types/question'
import type { UserProgress } from '@/lib/userProgress'

interface Props {
  questions: Question[]
  loading: boolean
  error: string | null
  progress: UserProgress
  progressIds: {
    mastered: Set<string>
    bookmarked: Set<string>
    solved: Set<string>
  }
  onMastered: (id: string) => void
  onBookmark: (id: string) => void
  onNeedsPro: (reason: string) => void
}

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

const S = {
  list: css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `,

  skeleton: css`
    height: 4.5rem;
    background: ${C.card};
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: ${RADIUS.xxl};
    background-image: linear-gradient(
      90deg,
      rgba(255,255,255,0.02) 0px,
      rgba(255,255,255,0.05) 80px,
      rgba(255,255,255,0.02) 160px
    );
    background-size: 400px 100%;
    animation: ${shimmer} 1.4s linear infinite;
  `,

  empty: css`
    text-align: center;
    padding: 4rem 1rem;
    color: ${C.muted};
  `,

  emptyTitle: css`
    font-size: 1.125rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
  `,

  error: css`
    padding: 1.25rem;
    background: ${C.danger}12;
    border: 1px solid ${C.danger}33;
    border-radius: ${RADIUS.xl};
    color: ${C.danger};
    font-size: 0.875rem;
    text-align: center;
  `,
}

export default function QuestionList({
  questions, loading, error,
  progress, progressIds,
  onMastered, onBookmark, onNeedsPro,
}: Props) {
  if (loading) {
    return (
      <div css={S.list}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} css={S.skeleton} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div css={S.error}>
        Failed to load questions: {error}. Check your Firestore connection.
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div css={S.empty}>
        <p css={S.emptyTitle}>No questions match your filters</p>
        <p>Try adjusting the category, difficulty, or search term.</p>
      </div>
    )
  }

  return (
    <div css={S.list}>
      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          isMastered={progressIds.mastered.has(q.id)}
          isBookmarked={progressIds.bookmarked.has(q.id)}
          isSolved={progressIds.solved.has(q.id)}
          isPro={progress.isPro}
          onMastered={() => onMastered(q.id)}
          onBookmark={() => onBookmark(q.id)}
          onNeedsPro={onNeedsPro}
        />
      ))}
    </div>
  )
}
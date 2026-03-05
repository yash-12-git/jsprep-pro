/** @jsxImportSource @emotion/react */
'use client'

import { useRouter } from 'next/navigation'
import { css } from '@emotion/react'
import { Flame } from 'lucide-react'
import { C, RADIUS, BP } from '@/styles/tokens'
import * as Shared from '@/styles/shared'
import type { UserProgress } from '@/lib/userProgress'

interface Props {
  user: { displayName?: string | null }
  progress: UserProgress
  totalQuestions: number
  masteredCount: number
}

const S = {
  wrap: css`margin-bottom: 1.75rem;`,

  topRow: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.875rem;
  `,

  greeting: css`
    font-size: 1.375rem;
    font-weight: 900;
    line-height: 1.2;
  `,

  right: css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  `,

  streak: css`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #fb923c;
    background: rgba(251,146,60,0.1);
    border: 1px solid rgba(251,146,60,0.2);
    border-radius: ${RADIUS.md};
    padding: 0.25rem 0.625rem;
  `,

  masteredBadge: css`
    font-size: 0.75rem;
    font-weight: 700;
    color: ${C.accent3};
  `,

  progressWrap: css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.375rem;
  `,

  progressLabel: css`
    font-size: 0.6875rem;
    color: ${C.muted};
    white-space: nowrap;
  `,

  freeNotice: css`
    font-size: 0.6875rem;
    color: rgba(251,191,36,0.65);
    margin-bottom: 1.25rem;
  `,

  shortcuts: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.625rem;
    margin-bottom: 1.5rem;
    @media (min-width: ${BP.sm}) {
      grid-template-columns: repeat(6, 1fr);
    }
  `,

  shortcut: (border: string) => css`
    background: ${C.card};
    border: 1px solid ${border};
    border-radius: ${RADIUS.xl};
    padding: 0.75rem 0.375rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover { transform: translateY(-1px); background: ${C.surface}; }
    &:active { transform: scale(0.97); }
  `,

  shortcutEmoji: css`font-size: 1.125rem; display: block; margin-bottom: 0.25rem;`,
  shortcutLabel: css`font-size: 0.5625rem; font-weight: 700; color: ${C.text};`,
}

const SHORTCUTS = [
  { href: '/output-quiz', emoji: '💻', label: 'Output Quiz', border: `${C.accent2}4d` },
  { href: '/debug-lab',   emoji: '🐛', label: 'Debug Lab',   border: `${C.danger}4d` },
  { href: '/quiz',        emoji: '⚡', label: 'Quiz Mode',   border: `${C.accent}4d`, pro: true },
  { href: '/mock-interview', emoji: '🎤', label: 'Mock Interview', border: `${C.purple}4d`, pro: true },
  { href: '/study-plan',  emoji: '🧠', label: 'Study Plan',  border: `${C.accent2}4d`, pro: true },
  { href: '/cheatsheet',  emoji: '📄', label: 'Cheat Sheet', border: `${C.accent3}4d`, pro: true },
]

export default function DashboardHeader({ user, progress, totalQuestions, masteredCount }: Props) {
  const router = useRouter()
  const pct = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0
  const FREE_LIMIT = 5
  const remainingFreeMarks = Math.max(0, FREE_LIMIT - masteredCount)

  const visibleShortcuts = progress.isPro
    ? SHORTCUTS
    : SHORTCUTS.filter(s => !s.pro).concat(SHORTCUTS.filter(s => s.pro))

  return (
    <div css={S.wrap}>
      <div css={S.topRow}>
        <h1 css={S.greeting}>
          Hey {user.displayName?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <div css={S.right}>
          {progress.streakDays > 0 && (
            <div css={S.streak}>
              <Flame size={12} />
              {progress.streakDays}d streak
            </div>
          )}
          <span css={S.masteredBadge}>{masteredCount}/{totalQuestions}</span>
        </div>
      </div>

      <div css={S.progressWrap}>
        <div css={[Shared.progressBarTrack, { flex: 1 }]}>
          <div css={Shared.progressBarFill(pct)} />
        </div>
        <span css={S.progressLabel}>{pct}%</span>
      </div>

      {!progress.isPro && masteredCount < FREE_LIMIT && (
        <p css={S.freeNotice}>
          {remainingFreeMarks} free mark{remainingFreeMarks !== 1 ? 's' : ''} remaining — upgrade to track all
        </p>
      )}

      <div css={S.shortcuts}>
        {visibleShortcuts.map(({ href, emoji, label, border, pro }) => (
          <button
            key={href}
            css={S.shortcut(border)}
            onClick={() => router.push(href)}
            title={pro && !progress.isPro ? `${label} (Pro)` : label}
          >
            <span css={S.shortcutEmoji}>
              {pro && !progress.isPro ? '🔒' : emoji}
            </span>
            <span css={S.shortcutLabel}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
/** @jsxImportSource @emotion/react */
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { C } from '@/styles/tokens'
import * as S from './styles'
import type { Question } from '@/types/question'

interface Props {
  q: Question
  index: number
  /** Controlled open state — provide both or neither */
  isOpen?: boolean
  onToggle?: () => void
}

export default function TheoryCard({ q, index, isOpen: controlledOpen, onToggle }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isOpen   = controlledOpen !== undefined ? controlledOpen : internalOpen
  const toggle   = onToggle ?? (() => setInternalOpen(o => !o))

  const ds = S.DIFF_STYLE[q.difficulty] ?? S.DIFF_STYLE.core

  return (
    <div css={S.questionCard('idle', C.accent)}>
      <div css={S.cardHeader} onClick={toggle}>
        <span css={S.qNumber(C.accent)}>#{String(index + 1).padStart(2, '0')}</span>
        <div css={{ flex: 1, minWidth: 0 }}>
          <p css={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.375rem' }}>{q.title}</p>
          <div css={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${ds.border}`, background: ds.bg, color: ds.color }}>
              {S.DIFF_LABEL[q.difficulty] ?? q.difficulty}
            </span>
            <span css={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: `1px solid ${C.accent}33`, background: `${C.accent}1a`, color: `${C.accent}cc` }}>
              {q.category}
            </span>
            {q.hint && (
              <span css={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', color: C.muted }}>
                💡 {q.hint}
              </span>
            )}
          </div>
        </div>
        <div css={S.chevronWrapper(isOpen)}><ChevronDown size={16} color={C.muted} /></div>
      </div>

      {isOpen && (
        <div css={S.cardBody}>
          <div
            css={{
              padding: '1.25rem',
              'p':      { margin: '0 0 12px', lineHeight: 1.75, fontSize: '0.9375rem', color: '#b0aec8' },
              'pre':    { background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.border}`, borderRadius: '0.5rem', padding: '12px 14px', overflowX: 'auto', margin: '8px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem' },
              'code':   { background: `${C.accent}26`, padding: '1px 5px', borderRadius: 4, color: '#c4b5fd', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem' },
              'pre code': { background: 'none', padding: 0, color: '#e2e8f0' },
              'strong': { color: '#e8e6f8' },
              'ul,ol':  { paddingLeft: '1.5rem' },
              'li':     { marginBottom: 4, lineHeight: 1.7, color: '#b0aec8' },
              'h3,h4':  { color: '#e8e6f8', margin: '16px 0 8px' },
              'table':  { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', margin: '14px 0' },
              'th':     { textAlign: 'left', padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: '#a78bfa', fontWeight: 700 },
              'td':     { padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#b0aec8' },
            }}
            dangerouslySetInnerHTML={{ __html: q.answer ?? '' }}
          />
        </div>
      )}
    </div>
  )
}
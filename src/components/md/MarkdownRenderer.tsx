/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { C } from '@/styles/tokens'

// We use a lightweight custom renderer instead of react-markdown to avoid
// heavy dependencies. Supports: headers, bold, italic, code blocks, inline code,
// lists, blockquotes, tables, horizontal rules, links.
//
// To use react-markdown instead, swap this component — the interface is identical.

interface Props {
  content: string
  className?: string
  compact?: boolean   // tighter spacing for card previews
}

const styles = (compact: boolean) => css`
  font-size: ${compact ? '0.8125rem' : '0.875rem'};
  line-height: ${compact ? '1.7' : '1.85'};
  color: ${C.text};

  h1, h2, h3, h4 {
    font-weight: 800;
    color: white;
    margin: ${compact ? '0.75rem 0 0.375rem' : '1.25rem 0 0.5rem'};
    line-height: 1.3;
  }
  h1 { font-size: ${compact ? '1rem' : '1.125rem'}; }
  h2 { font-size: ${compact ? '0.9375rem' : '1rem'}; }
  h3 { font-size: ${compact ? '0.875rem' : '0.9375rem'}; }
  h4 { font-size: 0.875rem; color: ${C.accent2}; }

  p {
    margin: 0 0 ${compact ? '0.5rem' : '0.875rem'};
    &:last-child { margin-bottom: 0; }
  }

  ul, ol {
    padding-left: 1.5rem;
    margin: 0 0 ${compact ? '0.5rem' : '0.875rem'};
  }
  li { margin-bottom: 0.25rem; }
  li::marker { color: ${C.accent}; }

  strong { font-weight: 700; color: white; }
  em { color: ${C.accent2}; font-style: italic; }

  a {
    color: ${C.accent};
    text-decoration: underline;
    text-underline-offset: 2px;
    &:hover { color: ${C.purple}; }
  }

  blockquote {
    border-left: 3px solid ${C.accent};
    padding: 0.375rem 0.875rem;
    margin: ${compact ? '0.5rem 0' : '0.875rem 0'};
    color: ${C.muted};
    background: ${C.surface};
    border-radius: 0 0.5rem 0.5rem 0;
    font-style: italic;
  }

  /* Fenced code blocks */
  pre {
    background: #080810;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 0.75rem;
    padding: ${compact ? '0.625rem 0.875rem' : '0.875rem 1.125rem'};
    overflow-x: auto;
    margin: ${compact ? '0.5rem 0' : '0.875rem 0'};
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: ${compact ? '0.6875rem' : '0.75rem'};
    line-height: 1.75;
    tab-size: 2;
    counter-reset: none;

    /* Subtle left accent line */
    border-left: 2px solid ${C.accent}44;

    code {
      background: none;
      border: none;
      padding: 0;
      color: #e2e8f0;
      font-size: inherit;
    }
  }

  /* Inline code */
  :not(pre) > code {
    background: ${C.surface};
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.125rem 0.4rem;
    border-radius: 0.3rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8em;
    color: ${C.accent3};
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${compact ? '0.5rem 0' : '0.875rem 0'};
    font-size: 0.8125rem;
    overflow-x: auto;
    display: block;
  }
  th, td {
    border: 1px solid rgba(255,255,255,0.1);
    padding: ${compact ? '0.375rem 0.625rem' : '0.5rem 0.75rem'};
    text-align: left;
  }
  th {
    background: ${C.surface};
    font-weight: 700;
    color: white;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  tr:nth-of-type(even) td { background: rgba(255,255,255,0.02); }

  /* Horizontal rule */
  hr {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.08);
    margin: ${compact ? '0.75rem 0' : '1.25rem 0'};
  }

  /* Tip/callout — matches legacy .tip class */
  .tip {
    background: ${C.accent}12;
    border-left: 3px solid ${C.accent};
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.5rem 0.875rem;
    margin: 0.5rem 0;
    color: ${C.text};
    font-size: 0.8125rem;
  }

  /* Key insight callout */
  .insight {
    background: ${C.accent3}12;
    border-left: 3px solid ${C.accent3};
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.5rem 0.875rem;
    margin: 0.5rem 0;
    color: ${C.text};
    font-size: 0.8125rem;
  }

  /* Warning callout */
  .warn {
    background: ${C.danger}12;
    border-left: 3px solid ${C.danger};
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.5rem 0.875rem;
    margin: 0.5rem 0;
    font-size: 0.8125rem;
  }
`

// ─── Minimal markdown parser ──────────────────────────────────────────────────
// Handles the 95% case without a heavy parser dependency.
// Swap for react-markdown + rehype-highlight for full GFM support.

function parseMarkdown(md: string): string {
  let html = md
    // Fenced code blocks (``` lang\n...\n```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()
      return `<pre><code class="language-${lang}">${escaped}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---+$/gm, '<hr />')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list (group consecutive lines)
    .replace(/^[*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)(\n<li>)/g, '$1$2') // join
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Tables (basic)
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim())
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    })
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Paragraphs — wrap isolated lines not already in block elements
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (/^<(h[1-4]|pre|ul|ol|li|blockquote|hr|table|tr|div)/.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>[\s\S]+?<\/li>(?:\n<li>[\s\S]+?<\/li>)*)/g, '<ul>$1</ul>')
  // Wrap <tr> in <table>
  html = html.replace(/(<tr>[\s\S]+?<\/tr>(?:\n<tr>[\s\S]+?<\/tr>)*)/g, '<table>$1</table>')

  return html
}

export default function MarkdownRenderer({ content, className, compact = false }: Props) {
  const html = parseMarkdown(content)
  return (
    <div
      css={styles(compact)}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
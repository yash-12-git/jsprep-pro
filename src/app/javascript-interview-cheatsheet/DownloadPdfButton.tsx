'use client'

/**
 * DownloadPDFButton
 *
 * Triggers the browser's native print dialog — in every modern browser
 * (Chrome, Safari, Firefox, Edge) the print dialog has "Save as PDF"
 * as the default destination. This produces a properly formatted PDF
 * using the @media print CSS defined in the page.
 *
 * We intentionally don't link to a static .pdf file because:
 *   1. We don't have a pre-generated PDF in /public
 *   2. The browser-generated PDF is always up-to-date with content
 *   3. Users can customise margins / paper size before saving
 */

import { useState } from 'react'

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

export default function DownloadPDFButton() {
  const [state, setState] = useState<'idle' | 'tip'>('idle')

  function handleClick() {
    setState('tip')
    setTimeout(() => {
      window.print()
      // After print dialog closes, reset the button
      setTimeout(() => setState('idle'), 500)
    }, 80)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <button
        onClick={handleClick}
        className="no-print"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: '#7c6af7', color: 'white',
          border: 'none',
          borderRadius: '0.875rem', fontWeight: 800,
          fontSize: '0.9375rem', cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        <DownloadIcon /> Download PDF
      </button>
      {state === 'tip' && (
        <p style={{
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)',
          margin: 0, textAlign: 'center',
        }}>
          In the print dialog → set Destination to <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Save as PDF</strong>
        </p>
      )}
    </div>
  )
}
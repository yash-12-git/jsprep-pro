import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'JSPrep Pro — JavaScript Interview Preparation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#07070e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Dot grid via repeating background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Purple glow top-right */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,106,247,0.25) 0%, transparent 65%)',
        }} />

        {/* Green glow bottom-left */}
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106,247,192,0.12) 0%, transparent 65%)',
        }} />

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 200, right: 200, height: 3,
          background: 'linear-gradient(90deg, transparent, #7c6af7, #6af7c0, #7c6af7, transparent)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '64px 80px', flex: 1 }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'linear-gradient(135deg, #7c6af7, #5b4ce8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 900, color: 'white',
              boxShadow: '0 4px 20px rgba(124,106,247,0.5)',
            }}>JS</div>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>
              JSPrep<span style={{ color: '#7c6af7' }}>Pro</span>
            </span>
          </div>

          {/* Two column layout */}
          <div style={{ display: 'flex', gap: 48, flex: 1, alignItems: 'flex-start' }}>

            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: 68, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
                Land your next
              </div>
              <div style={{ fontSize: 64, fontWeight: 800, color: '#7c6af7', lineHeight: 1.1, marginBottom: 32 }}>
                JavaScript role.
              </div>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', marginBottom: 40, lineHeight: 1.5 }}>
                195+ questions · Theory, Output & Debug · 6 AI tools
              </div>

              {/* Stat pills */}
              <div style={{ display: 'flex', gap: 12 }}>
                {[['195+','Questions'],['3','Modes'],['36','Topics'],['6','AI Tools']].map(([n, l]) => (
                  <div key={l} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{n}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — code card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '20px 24px', width: 380,
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Traffic dots */}
              <div style={{ display: 'flex', gap: 7, marginBottom: 18 }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#f76a6a' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#f7c76a' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#6af7c0' }} />
              </div>
              {/* Code */}
              {[
                ['// What is a closure?', '#444466'],
                ['function makeCounter() {', '#c8c8d8'],
                ['  let count = 0', '#6af7c0'],
                ['  return function() {', '#c8c8d8'],
                ['    return ++count', '#f7c76a'],
                ['  }', '#c8c8d8'],
                ['}', '#c8c8d8'],
                ['', ''],
                ['const c = makeCounter()', '#a78bfa'],
                ['c() // → 1', '#6af7c0'],
                ['c() // → 2', '#6af7c0'],
              ].map(([line, color], i) => (
                <div key={i} style={{ fontSize: 14, color, lineHeight: 1.7, fontFamily: 'monospace' }}>
                  {line || '\u00A0'}
                </div>
              ))}
              {/* Score badge */}
              <div style={{
                marginTop: 16, background: 'rgba(106,247,192,0.08)', border: '1px solid rgba(106,247,192,0.2)',
                borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>AI Score</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#6af7c0' }}>8/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
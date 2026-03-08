import { ImageResponse } from 'next/og'
import { getTopicBySlug } from '@/lib/cachedQueries'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { topic: string } }) {
  const topic = await getTopicBySlug(params.topic).catch(() => null)

  const title  = topic?.title  ?? 'JavaScript Interview Questions'
  const desc   = topic?.description ?? 'Practice questions with AI feedback'

  return new ImageResponse(
    (
      <div style={{
        background: '#07070e', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', padding: 0, position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -100, right: -80, width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,106,247,0.2) 0%, transparent 65%)',
        }} />
        {/* Top line */}
        <div style={{
          position: 'absolute', top: 0, left: 160, right: 160, height: 3,
          background: 'linear-gradient(90deg, transparent, #7c6af7, #6af7c0, #7c6af7, transparent)',
        }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '60px 80px', flex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 60 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 11, background: '#7c6af7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: 'white',
            }}>JS</div>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>
              JSPrep<span style={{ color: '#7c6af7' }}>Pro</span>
            </span>
          </div>

          {/* Category pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.25)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 28, width: 'fit-content',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Interview Topic
            </span>
          </div>

          {/* Title */}
          <div style={{ fontSize: 62, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
            {title}
          </div>

          {/* Desc */}
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: 680, marginBottom: 48 }}>
            {desc.slice(0, 120)}{desc.length > 120 ? '…' : ''}
          </div>

          {/* Footer row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 'auto' }}>
            <div style={{
              background: 'rgba(106,247,192,0.08)', border: '1px solid rgba(106,247,192,0.2)',
              borderRadius: 10, padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span style={{ fontSize: 14, color: '#6af7c0', fontWeight: 700 }}>✓ Free to practice</span>
            </div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>jsprep.pro</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
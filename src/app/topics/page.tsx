import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta, breadcrumbSchema } from '@/lib/seo/seo'
import { TOPICS } from '@/data/seo/topics'

export const metadata: Metadata = pageMeta({
  title: 'JavaScript Interview Topics — Practice by Concept | JSPrep Pro',
  description: 'Browse all JavaScript interview topics organised by concept. Closures, event loop, promises, prototypes, and 30+ more — each with cheat sheets, interview tips, and practice questions.',
  path: '/topics',
  keywords: [
    'javascript interview topics',
    'javascript concepts interview',
    'js interview practice by topic',
    'javascript interview preparation guide',
  ],
})

const CATEGORY_META: Record<string, { emoji: string; accent: string; description: string }> = {
  'Core JS':        { emoji: '🧱', accent: '#60a5fa', description: 'Scope, hoisting, execution context, type coercion' },
  'Functions':      { emoji: '⚙️', accent: '#a78bfa', description: 'Closures, arrow functions, currying, HOFs' },
  'Async JS':       { emoji: '⚡', accent: '#6af7c0', description: 'Event loop, promises, async/await, timers' },
  'Objects':        { emoji: '🔷', accent: '#f59e0b', description: 'Prototypes, classes, property descriptors' },
  'Arrays':         { emoji: '📋', accent: '#34d399', description: 'map, filter, reduce, destructuring, immutability' },
  'Modern JS':      { emoji: '✨', accent: '#f472b6', description: 'ES6+, modules, generators, proxy, Map/Set' },
  'Performance':    { emoji: '🚀', accent: '#fb923c', description: 'Debounce, throttle, memory leaks, rendering' },
  'DOM & Events':   { emoji: '🖥️', accent: '#38bdf8', description: 'Event delegation, observers, rendering pipeline' },
  'Error Handling': { emoji: '🛡️', accent: '#f87171', description: 'try/catch, custom errors, async error patterns' },
  'Browser APIs':   { emoji: '🌐', accent: '#c084fc', description: 'Fetch, Web Workers, Service Workers, storage' },
}

const DIFF_COLOR: Record<string, string> = {
  Beginner:     '#4ade80',
  Intermediate: '#fbbf24',
  Advanced:     '#fb923c',
  Senior:       '#f87171',
}

const CATEGORY_ORDER = [
  'Core JS', 'Functions', 'Async JS', 'Objects',
  'Arrays', 'Modern JS', 'Performance', 'DOM & Events',
  'Error Handling', 'Browser APIs',
]

function groupTopics() {
  const groups: Record<string, typeof TOPICS> = {}
  for (const cat of CATEGORY_ORDER) groups[cat] = []
  for (const topic of TOPICS) {
    if (groups[topic.category]) groups[topic.category].push(topic)
    else groups[topic.category] = [topic]
  }
  return groups
}

export default function TopicsPage() {
  const groups = groupTopics()
  const totalTopics = TOPICS.length

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Topics', path: '/topics' },
      ])}} />

      <div style={{ maxWidth: '58rem', margin: '0 auto', padding: '2.5rem 1.25rem 5rem', color: '#c8c8d8' }}>

        <nav style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#7c6af7', textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.375rem' }}>›</span>
          <span>Topics</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.625rem' }}>
            Interview Preparation
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', marginBottom: '0.875rem', letterSpacing: '-0.02em' }}>
            JavaScript Interview Topics
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: '42rem', marginBottom: '1.75rem' }}>
            {totalTopics} topics across every core JavaScript concept — each page includes a cheat sheet,
            interview tips you won't find on MDN, and practice questions.
          </p>
          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            {[{ n: totalTopics, label: 'Topics' }, { n: '90+', label: 'Questions' }, { n: Object.keys(CATEGORY_META).length, label: 'Categories' }].map(({ n, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{n}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{label}</span>
              </div>
            ))}
          </div>
        </header>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem', padding: '0.875rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginRight: 4, letterSpacing: '0.06em' }}>LEVEL:</span>
          {Object.entries(DIFF_COLOR).map(([diff, color]) => (
            <span key={diff} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {diff}
            </span>
          ))}
        </div>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {CATEGORY_ORDER.map(cat => {
            const topics = groups[cat]
            if (!topics?.length) return null
            const meta = CATEGORY_META[cat] ?? { emoji: '📌', accent: '#7c6af7', description: '' }
            return (
              <section key={cat}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: `1px solid ${meta.accent}20` }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: `${meta.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', flexShrink: 0 }}>
                    {meta.emoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ color: 'white', fontSize: '1.0625rem', fontWeight: 800, margin: 0, marginBottom: 2 }}>{cat}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8125rem', margin: 0 }}>{meta.description}</p>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: meta.accent, background: `${meta.accent}15`, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
                    {topics.length} topic{topics.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: '0.75rem' }}>
                  {topics.map(topic => (
                    <Link key={topic.slug} href={`/${topic.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                      <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', padding: '1.125rem 1.25rem', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        <h3 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                          {topic.title.replace('JavaScript ', '').replace(' Interview Questions', '')}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.7875rem', margin: 0, lineHeight: 1.55, flex: 1 }}>
                          {topic.description.split('.')[0]}.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: DIFF_COLOR[topic.difficulty] ?? '#7c6af7', display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: DIFF_COLOR[topic.difficulty] ?? '#7c6af7' }}>{topic.difficulty}</span>
                          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.625rem' }}>·</span>
                          <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.3)' }}>{topic.questionCount} Qs</span>
                          <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: meta.accent, fontWeight: 700 }}>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </main>

        <section style={{ marginTop: '3.5rem', background: 'rgba(124,106,247,0.07)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: '1.25rem', padding: '2.25rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>Reading isn't enough</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem', fontSize: '0.9375rem', lineHeight: 1.7 }}>
            The gap between knowing the answer and saying it under pressure is where interviews are won or lost.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth" style={{ padding: '0.75rem 1.75rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9375rem', display: 'inline-block' }}>
              Start Practicing Free →
            </Link>
            <Link href="/blog" style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem', display: 'inline-block' }}>
              Read the Blog
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
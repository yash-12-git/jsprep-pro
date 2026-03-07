import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta, breadcrumbSchema } from '@/lib/seo/seo'
import { getPublishedBlogPosts } from '@/lib/blogPosts'

export const revalidate = 3600

export const metadata: Metadata = pageMeta({
  title: 'JavaScript Interview Blog — Tips, Guides & Practice',
  description: 'In-depth guides on JavaScript interview topics. Learn closures, event loop, promises, async/await, and more with real code examples and interview tips.',
  path: '/blog',
  keywords: ['javascript interview blog', 'javascript tutorials', 'js interview tips'],
})

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
      ])}} />

      <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '2.5rem 1.25rem', color: '#c8c8d8' }}>

        <nav style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#7c6af7', textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.375rem' }}>›</span>
          <span>Blog</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.625rem' }}>
            JavaScript Interview Blog
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', marginBottom: '0.875rem' }}>
            Guides, Tips & Deep Dives
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>
            In-depth articles on the JavaScript concepts that come up most in frontend interviews.
            Written by developers, for developers.
          </p>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map(post => (
            <article key={post.slug}
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', background: `${post.accentColor}14`, border: `1px solid ${post.accentColor}33`, color: post.accentColor, padding: '0.125rem 0.5rem', borderRadius: '0.25rem' }}>
                  {post.category}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.3)' }}>{post.readTime} · {post.publishedAt}</span>
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                <Link href={`/blog/${post.slug}`} style={{ color: 'white', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {post.excerpt}
              </p>
              <Link href={`/blog/${post.slug}`} style={{ fontSize: '0.8125rem', color: '#7c6af7', fontWeight: 700, textDecoration: 'none' }}>
                Read article →
              </Link>
            </article>
          ))}
        </main>

        <section style={{ marginTop: '3rem', background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>
            Practice What You Learn
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            Every article in this blog has an interactive practice section in JSPrep Pro.
          </p>
          <Link href="/auth" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none' }}>
            Start Practicing Free →
          </Link>
        </section>
      </div>
    </>
  )
}
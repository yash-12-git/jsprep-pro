import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getBlogPostSlugs, getPublishedBlogPosts, getRelatedTopics } from '@/lib/cachedQueries'
import Link from 'next/link'
import { pageMeta, articleSchema, breadcrumbSchema } from '@/lib/seo/seo'

// ─── ISR ─────────────────────────────────────────────────────────────────────
export const revalidate = 3600

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  try {
    const slugs = await getBlogPostSlugs()
    return slugs.map(slug => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) return {}
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: 'article',
    publishedAt: post.publishedAt,
    modifiedAt: post.modifiedAt,
  })
}

// ─── Lightweight Markdown → HTML ─────────────────────────────────────────────
function md(content: string): string {
  return content
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="language-${lang}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,  '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^[*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .split('\n\n')
    .map(b => {
      const t = b.trim()
      if (!t) return ''
      if (/^<(h[1-2]|pre|ul|blockquote)/.test(t)) return t
      return `<p>${t.replace(/\n/g, ' ')}</p>`
    })
    .join('\n')
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) notFound()

  // Fetch related topics and other recent posts in parallel
  const [relatedTopics, allPosts] = await Promise.all([
    post.relatedTopicSlugs?.length
      ? getRelatedTopics(post.relatedTopicSlugs.slice(0, 4))
      : Promise.resolve([]),
    getPublishedBlogPosts(),
  ])

  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema({
        title: post.title, description: post.excerpt,
        path: `/blog/${post.slug}`,
        publishedAt: post.publishedAt, modifiedAt: post.modifiedAt,
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
      ])}} />

      <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '2.5rem 1.25rem', color: '#c8c8d8' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#7c6af7', textDecoration: 'none' }}>JSPrep Pro</Link>
          <span style={{ margin: '0 0.375rem' }}>›</span>
          <Link href="/blog" style={{ color: '#7c6af7', textDecoration: 'none' }}>Blog</Link>
          <span style={{ margin: '0 0.375rem' }}>›</span>
          <span>{post.category}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', background: `${post.accentColor}14`, border: `1px solid ${post.accentColor}33`, color: post.accentColor, padding: '0.125rem 0.5rem', borderRadius: '0.25rem' }}>
              {post.category}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)' }}>
              {post.readTime} · Updated {post.modifiedAt}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.625rem,4vw,2.25rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>{post.excerpt}</p>
        </header>

        {/* Practice CTA */}
        <div style={{ background: `${post.accentColor}0f`, border: `1px solid ${post.accentColor}25`, borderRadius: '0.875rem', padding: '1rem 1.25rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            💡 Practice these concepts interactively with AI feedback
          </p>
          <Link href="/auth" style={{ fontSize: '0.8125rem', color: post.accentColor, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Start Practicing →
          </Link>
        </div>

        {/* Article body */}
        {post.content ? (
          <article className="blog-content" dangerouslySetInnerHTML={{ __html: md(post.content) }} />
        ) : (
          <article className="blog-content">
            <p>Full article coming soon. <Link href="/dashboard" style={{ color: '#7c6af7' }}>Practice in the app</Link>.</p>
          </article>
        )}

        {/* Related Topics — only shown when linked from admin */}
        {relatedTopics.length > 0 && (
          <section style={{ margin: '2.5rem 0', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a78bfa', marginBottom: '0.875rem' }}>
              📚 Practice These Topics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,14rem),1fr))', gap: '0.625rem' }}>
              {relatedTopics.map(t => (
                <Link key={t.slug} href={`/${t.slug}`} style={{ display: 'block', padding: '0.75rem 1rem', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '0.625rem', textDecoration: 'none' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                    {t.keyword.charAt(0).toUpperCase() + t.keyword.slice(1)}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)' }}>{t.questionCount} questions</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section style={{ background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center', margin: '3rem 0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>Put This Into Practice</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            Reading articles is passive. JSPrep Pro makes you actively recall, predict output, and get AI feedback.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth" style={{ padding: '0.75rem 1.5rem', background: '#7c6af7', color: 'white', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none' }}>Start Free →</Link>
            <Link href="/javascript-interview-questions" style={{ padding: '0.75rem 1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '0.875rem', textDecoration: 'none' }}>Browse All Questions</Link>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Related Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,16rem),1fr))', gap: '1rem' }}>
              {relatedPosts.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.625rem', fontWeight: 800, color: p.accentColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.category}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', lineHeight: 1.4, marginBottom: '0.5rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{p.readTime}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h1 { font-size: 1.625rem; font-weight: 900; color: white; margin: 2rem 0 1rem; line-height: 1.3; }
        .blog-content h2 { font-size: 1.25rem; font-weight: 800; color: white; margin: 2rem 0 0.875rem; line-height: 1.3; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .blog-content p { margin: 0 0 1rem; line-height: 1.85; font-size: 0.9375rem; }
        .blog-content pre { background: #0a0a14; border: 1px solid rgba(255,255,255,0.09); border-left: 3px solid #7c6af7; border-radius: 0.75rem; padding: 1rem 1.25rem; overflow-x: auto; margin: 1rem 0; font-family: 'JetBrains Mono',monospace; font-size: 0.8125rem; line-height: 1.75; color: #e2e8f0; }
        .blog-content code { font-family: 'JetBrains Mono',monospace; font-size: 0.8125rem; }
        .blog-content p > code, .blog-content li > code { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); padding: 0.125rem 0.375rem; border-radius: 0.25rem; color: #6af7c0; font-size: 0.8em; }
        .blog-content ul { padding-left: 1.5rem; margin: 0 0 1rem; }
        .blog-content li { margin-bottom: 0.5rem; line-height: 1.75; font-size: 0.9375rem; }
        .blog-content strong { color: white; font-weight: 700; }
        .blog-content em { color: #f7c76a; font-style: italic; }
        .blog-content blockquote { border-left: 3px solid #7c6af7; padding: 0.5rem 1rem; margin: 1rem 0; background: rgba(124,106,247,0.06); border-radius: 0 0.5rem 0.5rem 0; color: rgba(255,255,255,0.7); font-style: italic; }
      `}} />
    </>
  )
}
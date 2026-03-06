import { MetadataRoute } from 'next'
import { CATEGORIES, questions } from '@/data/questions'
import { BLOG_POSTS } from '@/data/seo/blogPosts'
import { catToSlug, SITE } from '@/lib/seo/seo'
import { TOPICS } from '@/data/seo/topics'

// ─── Slug helper (must match /q/[slug]/page.tsx) ──────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/, '')
    .slice(0, 80)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.domain,                                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0  },
    { url: `${SITE.domain}/javascript-interview-questions`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.domain}/javascript-interview-cheatsheet`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9  },
    { url: `${SITE.domain}/topics`,                           lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${SITE.domain}/blog`,                             lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE.domain}/output-quiz`,                      lastModified: now, changeFrequency: 'weekly',  priority: 0.8  },
    { url: `${SITE.domain}/debug-lab`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.8  },
  ]

  // ── Topic pages — strong "interview questions" intent, high priority ───────
  const topicPages: MetadataRoute.Sitemap = TOPICS.map(t => ({
    url: `${SITE.domain}/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // ── Category question hubs ─────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${SITE.domain}/questions/${catToSlug(cat)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // ── Individual question pages — long-tail SEO goldmine ────────────────────
  // Each question gets its own URL: /q/what-is-hoisting-in-javascript
  const questionPages: MetadataRoute.Sitemap = questions.map(q => ({
    url: `${SITE.domain}/q/${toSlug(q.q)}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // ── Blog posts ─────────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${SITE.domain}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedAt).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    ...staticPages,
    ...topicPages,
    ...categoryPages,
    ...questionPages,
    ...blogPages,
  ]
}
import { MetadataRoute } from 'next'
import { getBlogPostSlugs, getPublishedBlogPosts, getPublishedCategories, getPublishedQuestionSlugs, getTopicSlugs } from '@/lib/cachedQueries'

import { catToSlug, SITE } from '@/lib/seo/seo'

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/, '')
    .slice(0, 80)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const [topicSlugs, blogPosts, questionSlugs, categories] = await Promise.all([
    getTopicSlugs().catch(() => [] as string[]),
    getPublishedBlogPosts().catch(() => []),
    getPublishedQuestionSlugs().catch(() => [] as string[]),
    getPublishedCategories().catch(() => [] as string[]),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.domain,                                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0  },
    { url: `${SITE.domain}/javascript-interview-questions`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.domain}/javascript-output-questions`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.domain}/javascript-tricky-questions`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${SITE.domain}/javascript-interview-cheatsheet`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9  },
    { url: `${SITE.domain}/topics`,                           lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${SITE.domain}/blog`,                             lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE.domain}/output-quiz`,                      lastModified: now, changeFrequency: 'weekly',  priority: 0.8  },
    { url: `${SITE.domain}/debug-lab`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.8  },
  ]

  const topicPages: MetadataRoute.Sitemap = topicSlugs.map(slug => ({
    url: `${SITE.domain}/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${SITE.domain}/questions/${catToSlug(cat)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const questionPages: MetadataRoute.Sitemap = questionSlugs.map(slug => ({
    url: `${SITE.domain}/q/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE.domain}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedAt ?? post.publishedAt ?? now).toISOString(),
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
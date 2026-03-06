import { MetadataRoute } from 'next'
import { CATEGORIES } from '@/data/questions'
import { BLOG_POSTS } from '@/data/seo/blogPosts'
import { catToSlug, SITE } from '@/lib/seo/seo'
import { TOPICS } from '@/data/seo/topics'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  // Static pages — highest priority
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.domain,                                      lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE.domain}/javascript-interview-questions`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE.domain}/javascript-interview-cheatsheet`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.domain}/blog`,                            lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE.domain}/topics`,                          lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
  ]

  // Category question pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${SITE.domain}/questions/${catToSlug(cat)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${SITE.domain}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedAt).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // Topic page 
  const topicPages = TOPICS.map(t => ({
  url: `${SITE.domain}/${t.slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.9
}))

  return [...staticPages, ...categoryPages, ...blogPages, ...topicPages]
}
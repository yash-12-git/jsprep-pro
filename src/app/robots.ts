import { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/admin',
          '/analytics',
          '/quiz',
          '/mock-interview',
          '/study-plan',
          '/api/',
        ],
      },
      {
        // Allow Google to index the content pages
        userAgent: 'Googlebot',
        allow: [
          '/javascript-interview-questions',
          '/javascript-interview-cheatsheet',
          '/questions/',
          '/blog/',
        ],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain,
  }
}
/**
 * seo.ts — centralized SEO helpers
 *
 * Every public-facing page imports from here.
 * Change the site name once, updates everywhere.
 */

import { proFeatures } from '@/data/homepageStaticData'
import type { Metadata } from 'next'

export const SITE = {
  name:        'JSPrep Pro',
  domain:      'https://jsprep.pro',
  twitterHandle: '@jspreppro',
  description: 'The most comprehensive JavaScript interview preparation platform. 150+ questions, AI tutor, mock interviews, and output prediction challenges.',
}

export const KEYWORDS = {
  primary: [
    'javascript interview questions',
    'javascript interview preparation',
    'js interview questions with answers',
    'javascript coding interview',
    'javascript practice problems',
  ],
  secondary: [
    'closures interview questions',
    'event loop javascript',
    'javascript promises interview',
    'async await javascript',
    'javascript this keyword',
    'javascript hoisting',
    'frontend developer interview',
    'react interview questions',
    'typescript interview questions',
  ],
  platform: [
    'javascript interview platform',
    'javascript practice platform',
    'js interview prep online',
    'javascript quiz for developers',
    'leetcode for javascript',
  ],
}

// ─── Per-page metadata factory ────────────────────────────────────────────────

interface PageMetaOptions {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: 'website' | 'article'
  publishedAt?: string
  modifiedAt?: string
  image?: string
}

export function pageMeta(opts: PageMetaOptions): Metadata {
  const {
    title, description, path, type = 'website',
    keywords = [], publishedAt, modifiedAt,
  } = opts

  const url = `${SITE.domain}${path}`
  const fullTitle = title.includes('JSPrep') ? title : `${title} | JSPrep Pro`
  const image = opts.image ?? `${SITE.domain}/og-default.png`

  return {
    title: fullTitle,
    description,
    keywords: [...KEYWORDS.primary, ...keywords].join(', '),
    authors: [{ name: 'JSPrep Pro Team' }],
    creator: SITE.name,
    publisher: SITE.name,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(modifiedAt  ? { modifiedTime: modifiedAt }   : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitterHandle,
      title: fullTitle,
      description,
      images: [image],
    },
  }
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer: string
}

export function faqSchema(items: FAQItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  })
}

export function articleSchema(opts: {
  title: string
  description: string
  path: string
  publishedAt: string
  modifiedAt?: string
  image?: string
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: `${SITE.domain}${opts.path}`,
    datePublished: opts.publishedAt,
    dateModified: opts.modifiedAt ?? opts.publishedAt,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.domain}/logo.png` },
    },
    image: opts.image ?? `${SITE.domain}/og-default.png`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.domain}${opts.path}` },
  })
}

export function softwareSchema(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description: SITE.description,
    url: SITE.domain,
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'INR', name: 'Free Plan' },
      { '@type': 'Offer', price: '199', priceCurrency: 'INR', name: 'Pro Plan', billingDuration: 'P1M' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
      bestRating: '5',
    },
    featureList: proFeatures,
  })
}

export function breadcrumbSchema(items: { name: string; path: string }[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.domain}${item.path}`,
    })),
  })
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

export function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function categorySlug(cat: string): string {
  return slugify(cat.replace(/'/g, '').replace(/&/g, 'and'))
}

// Map from URL-safe category slug → display label
export const CATEGORY_SLUGS: Record<string, string> = {
  'core-js':      'Core JS',
  'functions':    'Functions',
  'async-js':     'Async JS',
  'objects':      'Objects',
  'arrays':       'Arrays',
  'this-keyword': "'this' Keyword",
  'error-handling': 'Error Handling',
  'modern-js':    'Modern JS',
  'performance':  'Performance',
  'dom-and-events': 'DOM & Events',
}

export function catToSlug(cat: string): string {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, v]) => v === cat)
  return entry?.[0] ?? slugify(cat)
}
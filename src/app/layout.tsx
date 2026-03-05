import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { SITE, softwareSchema, KEYWORDS } from '@/lib/seo/seo'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })

// ─── Root metadata ─────────────────────────────────────────────────────────────
// Every page can override these via generateMetadata()

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: 'JSPrep Pro — JavaScript Interview Preparation Platform',
    template: '%s | JSPrep Pro',
  },
  description: SITE.description,
  keywords: [...KEYWORDS.primary, ...KEYWORDS.platform].join(', '),
  authors: [{ name: 'JSPrep Pro Team' }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.domain,
    siteName: SITE.name,
    title: 'JSPrep Pro — JavaScript Interview Preparation Platform',
    description: SITE.description,
    images: [{
      url: `${SITE.domain}/og-default.png`,
      width: 1200,
      height: 630,
      alt: 'JSPrep Pro — JavaScript Interview Preparation',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
    title: 'JSPrep Pro — JavaScript Interview Preparation Platform',
    description: SITE.description,
    images: [`${SITE.domain}/og-default.png`],
  },
  verification: {
    // Add these once you verify in Google Search Console + Bing Webmaster Tools
    // google: 'your-google-verification-code',
    // other: { 'msvalidate.01': 'your-bing-code' },
  },
  alternates: {
    canonical: SITE.domain,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* Site-wide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: softwareSchema() }}
        />

        {/* PWA / App meta */}
        <meta name="application-name" content="JSPrep Pro" />
        <meta name="apple-mobile-web-app-title" content="JSPrep Pro" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7c6af7" />

        {/* Geo targeting — update for your primary market */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
      </head>
      <body className={`${syne.variable} font-syne bg-bg text-white antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
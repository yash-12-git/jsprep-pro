import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { QuestionsProvider } from "@/contexts/QuestionsContext";
import { SITE, softwareSchema, websiteSchema, KEYWORDS } from "@/lib/seo/seo";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";


export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "JavaScript Interview Questions & Practice — JSPrep Pro",
    template: "%s — JSPrep Pro",
  },
  description: SITE.description,
  keywords: [...KEYWORDS.primary, ...KEYWORDS.platform].join(", "),
  authors: [{ name: "JSPrep Pro Team" }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.domain,
    siteName: SITE.name,
    title: "JavaScript Interview Questions & Practice — JSPrep Pro",
    description: SITE.description,
    images: [
      {
        url: `${SITE.domain}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "JSPrep Pro — JavaScript Interview Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
    title: "JavaScript Interview Questions — JSPrep Pro",
    description: SITE.description,
    images: [`${SITE.domain}/og-default.png`],
  },
  alternates: {
    canonical: SITE.domain,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          key="software-schema"
          dangerouslySetInnerHTML={{ __html: softwareSchema() }}
        />
        <script
          type="application/ld+json"
          key="website-schema"
          dangerouslySetInnerHTML={{ __html: websiteSchema() }}
        />
        <meta name="application-name" content="JSPrep Pro" />
        <meta name="apple-mobile-web-app-title" content="JSPrep Pro" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <QuestionsProvider>
              <Navbar />
              {children}
            </QuestionsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
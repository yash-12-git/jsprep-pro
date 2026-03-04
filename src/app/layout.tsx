import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from '@/hooks/useAuth'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })

export const metadata: Metadata = {
  title: 'JSPrep Pro — JavaScript Interview Mastery',
  description: 'Ace your frontend JavaScript interviews with curated questions, progress tracking, and flashcard quizzes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={`${syne.variable} font-syne bg-bg text-white antialiased`}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}

import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"

import { questions } from "@/data/questions"
import { TOPICS } from "@/data/seo/topics"

interface Props {
  params: { topic: string }
}

/* ───────── Static generation ───────── */

export function generateStaticParams() {
  return TOPICS.map(t => ({
    topic: t.slug
  }))
}

/* ───────── Metadata ───────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = TOPICS.find(t => t.slug === params.topic)
  if (!topic) return {}

  return {
    title: `${topic.title} | JSPrep Pro`,
    description: `Top JavaScript ${topic.keyword} interview questions with answers, explanations and code examples.`,
  }
}

/* ───────── Page ───────── */

export default function TopicPage({ params }: Props) {
  const topic = TOPICS.find(t => t.slug === params.topic)
  if (!topic) notFound()
  const related = questions.filter(q => {
  const catMatch =
    q.cat.toLowerCase() === topic.category.toLowerCase()

  const keywordMatch =
    q.q.toLowerCase().includes(topic.keyword.toLowerCase()) ||
    q.answer.toLowerCase().includes(topic.keyword.toLowerCase())

  return catMatch || keywordMatch
})

  if (!related.length) notFound()

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: related.map(q => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer.replace(/<[^>]*>?/gm, "")
      }
    }))
  }

  return (
    <>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={{ maxWidth: 900, margin: "auto", padding: "40px", color: "#c8c8d8" }}>

        {/* Header */}

        <h1 style={{ color: "white", marginBottom: 16 }}>
          {topic.title}
        </h1>

        <p style={{ marginBottom: 30 }}>
          Top JavaScript <strong>{topic.keyword}</strong> interview questions with
          detailed explanations and code examples.
        </p>

        {/* Questions */}

        {related.map((q, i) => (

          <article key={q.id} style={{ marginBottom: 40 }}>

            <h2 style={{ color: "white", marginBottom: 12 }}>
              {i + 1}. {q.q}
            </h2>

            <div
              dangerouslySetInnerHTML={{ __html: q.answer }}
            />

          </article>

        ))}

        {/* CTA */}

        <section style={{
          marginTop: 40,
          padding: 30,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          textAlign: "center"
        }}>

          <h3 style={{ color: "white", marginBottom: 10 }}>
            Practice JavaScript Interview Questions
          </h3>

          <p style={{ marginBottom: 20 }}>
            Test your answers with AI and get instant feedback.
          </p>

          <Link
            href="/auth"
            style={{
              padding: "10px 20px",
              background: "#7c6af7",
              color: "white",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700
            }}
          >
            Start Free Practice →
          </Link>

        </section>

      </div>

    </>
  )
}
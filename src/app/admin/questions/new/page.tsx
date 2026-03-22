'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createQuestion } from '@/lib/questions'
import { C } from '@/styles/tokens'
import type { QuestionInput } from '@/types/question'
import QuestionForm from '../../components/QuestionForm'

export default function NewQuestionPage() {
  const { user } = useAuth()
  const router   = useRouter()

  async function handleSubmit(data: QuestionInput) {
    if (!user) return
    await createQuestion(data, user.uid)
    router.push('/admin/questions')
  }

  return (
    <div style={{ maxWidth: '60rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <Link
          href="/admin/questions"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: C.muted, textDecoration: 'none', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={15} /> All Questions
        </Link>
        <span style={{ color: C.border }}>/</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: C.text }}>Add Question</h1>
      </div>

      <QuestionForm mode="create" onSubmit={handleSubmit} />
    </div>
  )
}
/** @jsxImportSource @emotion/react */
'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createQuestion } from '@/lib/questions'
import QuestionForm from '@/app/admin/components/QuestionForm'
import type { QuestionInput } from '@/types/question'

export default function NewQuestionPage() {
  const { user } = useAuth()
  const router = useRouter()

  async function handleSubmit(data: QuestionInput) {
    if (!user) return
    await createQuestion(data, user.uid)
    router.push('/admin/questions')
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.75rem' }}>Add Question</h1>
      <QuestionForm mode="create" onSubmit={handleSubmit} />
    </div>
  )
}
/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuestion, updateQuestion, deleteQuestion } from '@/lib/questions'
import QuestionForm from '@/app/admin/components/QuestionForm'
import type { Question, QuestionInput } from '@/types/question'
import * as Shared from '@/styles/shared'

export default function EditQuestionPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null)
  const router = useRouter()

  useEffect(() => {
    getQuestion(params.id).then(setQuestion)
  }, [params.id])

  if (!question) return <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>

  async function handleSubmit(data: QuestionInput) {
    await updateQuestion(params.id, data)
  }

  async function handleDelete() {
    await deleteQuestion(params.id)
    router.push('/admin/questions')
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.75rem' }}>Edit Question</h1>
      <QuestionForm mode="edit" initial={question} onSubmit={handleSubmit} onDelete={handleDelete} />
    </div>
  )
}
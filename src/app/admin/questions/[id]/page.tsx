/** @jsxImportSource @emotion/react */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuestion, updateQuestion, deleteQuestion } from '@/lib/questions'
import { revalidateQuestions } from '@/lib/adminRevalidate'
import QuestionForm from '@/app/admin/components/QuestionForm'
import type { Question, QuestionInput } from '@/types/question'
import { C } from '@/styles/tokens'
import { ArrowLeft } from 'lucide-react'
import * as Shared from '@/styles/shared'

export default function EditQuestionPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [notFound, setNotFound] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getQuestion(params.id).then(q => {
      if (!q) setNotFound(true)
      else setQuestion(q)
    })
  }, [params.id])

  async function handleSubmit(data: QuestionInput) {
    await updateQuestion(params.id, data)
    await revalidateQuestions()
    // stay on page so user can keep editing
  }

  async function handleDelete() {
    await deleteQuestion(params.id)
    router.push('/admin/questions')
  }

  if (notFound) return (
    <div style={{ padding: '4rem 1rem', textAlign: 'center', color: C.muted }}>
      Question not found. <Link href="/admin/questions" style={{ color: C.accent }}>Back to list</Link>
    </div>
  )

  if (!question) return (
    <div css={Shared.spinner}><div css={Shared.spinnerDot} /></div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <Link href="/admin/questions"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: C.muted, textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={15} /> All Questions
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Edit Question</h1>
        <span style={{ fontSize: '0.6875rem', color: C.muted, fontFamily: 'monospace', marginLeft: 'auto' }}>
          ID: {params.id}
        </span>
      </div>
      <QuestionForm
        mode="edit"
        initial={question}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  )
}
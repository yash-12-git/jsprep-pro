/** @jsxImportSource @emotion/react */
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { deleteQuestion } from '@/lib/questions'
import type { Question } from '@/types/question'
import { css } from '@emotion/react'
import { C, RADIUS } from '@/styles/tokens'
import { PlusCircle, Edit2, Trash2 } from 'lucide-react'

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const snap = await getDocs(query(collection(db, 'questions'), orderBy('order', 'asc')))
    setQuestions(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Question))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const STATUS_COLOR: Record<string, string> = {
    published: C.accent3, draft: C.accent2, archived: C.muted
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>All Questions ({questions.length})</h1>
        <Link href="/admin/questions/new" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: C.accent, color: 'white', borderRadius: RADIUS.xl, fontWeight: 800, textDecoration: 'none', fontSize: '0.875rem' }}>
          <PlusCircle size={15} /> Add Question
        </Link>
      </div>

      {loading ? <p style={{ color: C.muted }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {questions.map(q => (
            <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', background: C.card, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: RADIUS.xl }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, color: STATUS_COLOR[q.status], background: STATUS_COLOR[q.status] + '18', border: `1px solid ${STATUS_COLOR[q.status]}33`, padding: '0.125rem 0.5rem', borderRadius: '0.25rem', flexShrink: 0 }}>
                {q.status}
              </span>
              <span style={{ fontSize: '0.625rem', color: C.muted, background: 'rgba(255,255,255,0.05)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', flexShrink: 0 }}>
                {q.type}
              </span>
              <span style={{ flex: 1, fontSize: '0.875rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {q.title}
              </span>
              <span style={{ fontSize: '0.75rem', color: C.muted, flexShrink: 0 }}>{q.category}</span>
              <Link href={`/admin/questions/${q.id}`} style={{ color: C.accent, display: 'flex', padding: '0.25rem' }}>
                <Edit2 size={14} />
              </Link>
              <button onClick={async () => { await deleteQuestion(q.id); load() }} style={{ color: C.danger, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
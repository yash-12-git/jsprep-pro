'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createTopic } from '@/lib/topics'
import TopicForm from '@/app/admin/components/TopicForm'
import type { TopicInput } from '@/types/topic'
import { C } from '@/styles/tokens'
import { ArrowLeft } from 'lucide-react'
import { revalidateTopics } from '@/lib/adminRevalidate'

export default function NewTopicPage() {
  const { user } = useAuth()
  const router = useRouter()

  async function handleSubmit(data: TopicInput) {
    if (!user) return
    await createTopic(data, user.uid)
    await revalidateTopics()
    router.push('/admin/topics')
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <Link href="/admin/topics" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: C.muted, textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={15} /> All Topics
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>New Topic</h1>
      </div>
      <TopicForm mode="create" onSubmit={handleSubmit} />
    </div>
  )
}
'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createBlogPost } from '@/lib/blogPosts'
import BlogForm from '@/app/admin/components/BlogForm'
import type { BlogPostInput } from '@/types/blogPost'
import { C } from '@/styles/tokens'
import { ArrowLeft } from 'lucide-react'

export default function NewBlogPostPage() {
  const { user } = useAuth()
  const router = useRouter()

  async function handleSubmit(data: BlogPostInput) {
    if (!user) return
    await createBlogPost(data, user.uid)
    router.push('/admin/blog')
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <Link href="/admin/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: C.muted, textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={15} /> All Posts
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>New Blog Post</h1>
      </div>
      <BlogForm mode="create" onSubmit={handleSubmit} />
    </div>
  )
}
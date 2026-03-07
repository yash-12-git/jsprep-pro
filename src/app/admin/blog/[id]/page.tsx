'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blogPosts'
import BlogForm from '@/app/admin/components/BlogForm'
import type { BlogPost, BlogPostInput } from '@/types/blogPost'
import { C } from '@/styles/tokens'
import { ArrowLeft } from 'lucide-react'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogPost(params.id).then(p => { setPost(p); setLoading(false) })
  }, [params.id])

  async function handleSubmit(data: BlogPostInput) {
    await updateBlogPost(params.id, data)
    router.push('/admin/blog')
  }

  async function handleDelete() {
    await deleteBlogPost(params.id)
    router.push('/admin/blog')
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: C.muted }}>Loading…</div>
  if (!post) return <div style={{ color: C.danger }}>Post not found.</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <Link href="/admin/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: C.muted, textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={15} /> All Posts
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Edit Post</h1>
      </div>
      <BlogForm mode="edit" initial={post} onSubmit={handleSubmit} onDelete={handleDelete} />
    </div>
  )
}
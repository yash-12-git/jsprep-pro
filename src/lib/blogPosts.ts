/**
 * lib/blogPosts.ts
 *
 * All Firestore reads/writes for the `blog_posts` collection.
 * Pages never import from @/data/seo/blogPosts directly — always use this lib.
 */

import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, writeBatch,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { BlogPost, BlogPostInput, BlogPostFilters } from '@/types/blogPost'

const COL = 'blog_posts'

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as BlogPost
}

/** Fetch a post by its slug field (used by blog/[slug]/page.tsx) */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, COL), where('slug', '==', slug), where('status', '==', 'published'))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as BlogPost
}

/** All blog posts — optionally filtered */
export async function getBlogPosts(filters: BlogPostFilters = {}): Promise<BlogPost[]> {
  const constraints: QueryConstraint[] = []

  if (filters.status)    constraints.push(where('status',    '==', filters.status))
  if (filters.category)  constraints.push(where('category',  '==', filters.category))
  if (filters.topicSlug) constraints.push(where('topicSlug', '==', filters.topicSlug))

  constraints.push(orderBy('publishedAt', 'desc'))
  const snap = await getDocs(query(collection(db, COL), ...constraints))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as BlogPost)
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return getBlogPosts({ status: 'published' })
}

/** Slugs only — for generateStaticParams */
export async function getBlogPostSlugs(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, COL), where('status', '==', 'published'), orderBy('publishedAt', 'desc'))
  )
  return snap.docs.map(d => (d.data() as BlogPost).slug)
}

/** Posts related to a given topic slug — for topic page sidebars */
export async function getBlogPostsForTopic(topicSlug: string): Promise<BlogPost[]> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where('status',    '==', 'published'),
      where('relatedTopicSlugs', 'array-contains', topicSlug),
      orderBy('publishedAt', 'desc')
    )
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as BlogPost)
}

/** Posts with a specific question category — for question page sidebars */
export async function getBlogPostsForCategory(category: string): Promise<BlogPost[]> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where('status',              '==',               'published'),
      where('questionCategories',  'array-contains',   category),
      orderBy('publishedAt', 'desc')
    )
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as BlogPost)
}

// ─── Write (admin only) ───────────────────────────────────────────────────────

export async function createBlogPost(input: BlogPostInput, adminUid: string): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    createdBy: adminUid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return ref.id
}

export async function updateBlogPost(id: string, updates: Partial<BlogPostInput>): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}

export async function publishBlogPost(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    status: 'published',
    updatedAt: new Date().toISOString(),
  })
}

export async function archiveBlogPost(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    status: 'archived',
    updatedAt: new Date().toISOString(),
  })
}

// ─── Seed helper ──────────────────────────────────────────────────────────────

export async function seedBlogPostsFromArray(
  posts: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>[],
  adminUid: string,
): Promise<{ created: number; errors: string[] }> {
  const errors: string[] = []
  let created = 0
  const BATCH_MAX = 400
  let batch = writeBatch(db)
  const colRef = collection(db, COL)

  for (const p of posts) {
    try {
      const ref = doc(colRef)
      batch.set(ref, {
        ...p,
        createdBy: adminUid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      created++
      if (created % BATCH_MAX === 0) {
        await batch.commit()
        batch = writeBatch(db)
      }
    } catch (e: any) {
      errors.push(`${p.slug}: ${e.message}`)
    }
  }

  await batch.commit()
  return { created, errors }
}
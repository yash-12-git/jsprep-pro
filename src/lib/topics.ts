/**
 * lib/topics.ts
 *
 * All Firestore reads/writes for the `topics` collection.
 * Pages never import from @/data/seo/topics directly — always use this lib.
 *
 * Collection structure:
 *   topics/{topicId}   — Topic document (slug is a field, not the doc ID)
 */

import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, writeBatch,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Topic, TopicInput, TopicFilters } from '@/types/topic'

const COL = 'topics'

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getTopic(id: string): Promise<Topic | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Topic
}

/** Fetch a topic by its slug field (used by [topic]/page.tsx) */
export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const q = query(collection(db, COL), where('slug', '==', slug), where('status', '==', 'published'))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Topic
}

/** All topics — optionally filtered. Used by admin list + generateStaticParams. */
export async function getTopics(filters: TopicFilters = {}): Promise<Topic[]> {
  const constraints: QueryConstraint[] = []

  if (filters.status)     constraints.push(where('status',     '==', filters.status))
  if (filters.difficulty) constraints.push(where('difficulty', '==', filters.difficulty))
  if (filters.category)   constraints.push(where('category',   '==', filters.category))

  constraints.push(orderBy('order', 'asc'))

  const snap = await getDocs(query(collection(db, COL), ...constraints))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Topic)
}

/** Published topics — for generateStaticParams + public listings */
export async function getPublishedTopics(): Promise<Topic[]> {
  return getTopics({ status: 'published' })
}

/** Slugs only — lightweight for generateStaticParams */
export async function getTopicSlugs(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, COL), where('status', '==', 'published'), orderBy('order', 'asc'))
  )
  return snap.docs.map(d => (d.data() as Topic).slug)
}

/** Related topics for a given slug list */
export async function getRelatedTopics(slugs: string[]): Promise<Topic[]> {
  if (!slugs.length) return []
  // Firestore `in` is limited to 10 items
  const batch = slugs.slice(0, 10)
  const snap = await getDocs(
    query(collection(db, COL), where('slug', 'in', batch), where('status', '==', 'published'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Topic)
}

// ─── Write (admin only) ───────────────────────────────────────────────────────

export async function createTopic(input: TopicInput, adminUid: string): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    createdBy: adminUid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return ref.id
}

export async function updateTopic(id: string, updates: Partial<TopicInput>): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteTopic(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}

export async function publishTopic(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { status: 'published', updatedAt: new Date().toISOString() })
}

export async function archiveTopic(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { status: 'archived', updatedAt: new Date().toISOString() })
}

// ─── Seed helper ──────────────────────────────────────────────────────────────

/**
 * Batch-import an array of legacy Topic objects from the static .ts file.
 * Called once from /admin/migrate.
 */
export async function seedTopicsFromArray(
  topics: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>[],
  adminUid: string,
): Promise<{ created: number; errors: string[] }> {
  const errors: string[] = []
  let created = 0
  const BATCH_MAX = 400
  let batch = writeBatch(db)
  const colRef = collection(db, COL)

  for (const t of topics) {
    try {
      const ref = doc(colRef)
      batch.set(ref, {
        ...t,
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
      errors.push(`${t.slug}: ${e.message}`)
    }
  }

  await batch.commit()
  return { created, errors }
}
/**
 * Admin utilities
 *
 * Admin status is stored in Firestore at users/{uid}.isAdmin = true
 * Set this manually in the Firebase console for the first admin.
 * After that, use the admin panel to manage other admins.
 *
 * NEVER trust the client — always re-check in API routes.
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return false
    return snap.data()?.isAdmin === true
  } catch {
    return false
  }
}

export async function grantAdmin(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { isAdmin: true })
}

export async function revokeAdmin(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { isAdmin: false })
}
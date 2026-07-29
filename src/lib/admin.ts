/**
 * Admin utilities
 *
 * Admin status is stored in Firestore at users/{uid}.isAdmin = true
 * Set this manually in the Firebase console for the first admin.
 * After that, use the admin panel to manage other admins.
 *
 * NEVER trust the client — always re-check in API routes.
 */

import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

/**
 * UI-only check — decides whether to render the admin panel. Never rely on
 * this for authorisation: it reads a Firestore field, and a determined user
 * controls what their own browser does with the result.
 *
 * Server-side authorisation uses the `isAdmin` custom claim instead, via
 * verifyAdmin() in lib/firebaseAdmin.ts.
 */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return false
    return snap.data()?.isAdmin === true
  } catch {
    return false
  }
}

// grantAdmin()/revokeAdmin() used to live here and wrote users/{uid}.isAdmin
// straight from the browser — any signed-in user could promote themselves and
// then edit questions, topics and blog posts. They were never called.
// Grant admin with scripts/set-admin-claim.js (Admin SDK) instead, which sets
// the custom claim the server and the Firestore rules actually trust.
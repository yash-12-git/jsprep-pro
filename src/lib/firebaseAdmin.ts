/**
 * firebaseAdmin
 *
 * Server-only Firebase Admin SDK singleton. Used by the payment routes to
 * write privileged fields (isPro) that the client is not allowed to touch.
 *
 * Requires these env vars (see README):
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY
 */

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  // Fail loudly with a useful message instead of the SDK's opaque
  // "Service account object must contain a string 'project_id'".
  if (!projectId || !clientEmail || !privateKey) {
    const missing = [
      !projectId && "FIREBASE_ADMIN_PROJECT_ID",
      !clientEmail && "FIREBASE_ADMIN_CLIENT_EMAIL",
      !privateKey && "FIREBASE_ADMIN_PRIVATE_KEY",
    ].filter(Boolean);
    throw new Error(`Firebase Admin not configured — missing ${missing.join(", ")}`);
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Vercel stores the PEM with literal \n when pasted as a single line.
      // A genuine multi-line value is unaffected by this replace.
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

/**
 * Verifies the `Authorization: Bearer <firebase-id-token>` header.
 * Returns the uid, or null if the token is missing/invalid/expired.
 */
export async function verifyIdToken(
  authHeader: string | null,
): Promise<string | null> {
  return (await decodeIdToken(authHeader))?.uid ?? null;
}

async function decodeIdToken(authHeader: string | null) {
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  if (!token) return null;

  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

/**
 * True only if the caller holds the `isAdmin` custom claim.
 *
 * Deliberately does NOT read users/{uid}.isAdmin — that field lives in
 * Firestore and is only as trustworthy as the security rules. Custom claims
 * can be set exclusively by the Admin SDK (scripts/set-admin-claim.js), so
 * they cannot be self-granted from a browser.
 */
export async function verifyAdmin(authHeader: string | null): Promise<boolean> {
  const decoded = await decodeIdToken(authHeader);
  return decoded?.isAdmin === true;
}

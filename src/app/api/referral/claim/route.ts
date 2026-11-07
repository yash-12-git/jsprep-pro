/**
 * POST /api/referral/claim  { code }
 *
 * Records who referred the caller. Only a brand-new account can be referred,
 * and only once; nothing is granted until the referral is completed.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import {
  NEW_ACCOUNT_WINDOW_MS,
  entitlementsRef,
  withTimeout,
  type Entitlements,
} from "@/lib/rewards";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const uid = await verifyIdToken(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!/^[A-Z0-9]{8}$/.test(code)) {
    return NextResponse.json({ error: "That invite code isn't valid." }, { status: 400 });
  }

  try {
    const created = new Date((await getAdminAuth().getUser(uid)).metadata.creationTime).getTime();
    if (Date.now() - created > NEW_ACCOUNT_WINDOW_MS) {
      return NextResponse.json({ ok: false, reason: "existing_account" });
    }

    const db = getAdminDb();
    const reason = await withTimeout(db.runTransaction(async (tx) => {
      const [codeDoc, ent] = await Promise.all([
        tx.get(db.collection("referralCodes").doc(code)),
        tx.get(entitlementsRef(db, uid)),
      ]);
      const referrer = codeDoc.data()?.uid as string | undefined;
      if (!referrer) return "unknown_code";
      if (referrer === uid) return "own_code";
      if ((ent.data() as Entitlements | undefined)?.referredBy) return "already_referred";

      tx.set(
        entitlementsRef(db, uid),
        { referredBy: referrer, referredAt: new Date().toISOString() },
        { merge: true },
      );
      return null;
    }));

    return NextResponse.json(reason ? { ok: false, reason } : { ok: true });
  } catch (err) {
    console.error("[referral/claim]", err);
    return NextResponse.json({ error: "Could not record the invite." }, { status: 503 });
  }
}

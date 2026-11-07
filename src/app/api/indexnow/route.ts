import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/firebaseAdmin";

// IndexNow's own limit per request.
const MAX_URLS = 10_000;

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req.headers.get("authorization")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { urls } = await req.json();

  if (!Array.isArray(urls) || urls.length === 0 || urls.length > MAX_URLS) {
    return NextResponse.json({ error: "urls required" }, { status: 400 });
  }

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "jsprep.pro",
      key: "67b1fa86f6684ea89e4adc9e8a75645e",
      keyLocation: "https://jsprep.pro/67b1fa86f6684ea89e4adc9e8a75645e.txt",
      urlList: urls,
    }),
  });

  const text = await res.text();
  return NextResponse.json({ status: res.status, body: text }, { status: res.ok ? 200 : 502 });
}

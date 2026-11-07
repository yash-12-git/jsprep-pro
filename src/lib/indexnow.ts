import { auth } from "@/lib/firebase";

export async function submitToIndexNow(urls: string[]) {
  try {
    const token = await auth.currentUser?.getIdToken();
    // Proxy through /api/indexnow — IndexNow API blocks direct browser fetches (CORS)
    const res = await fetch("/api/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ urls }),
    });

    const data = await res.json();

    console.log("IndexNow status:", data.status);
    console.log("IndexNow response:", data.body);

    if (!res.ok) {
      console.error("❌ IndexNow failed", data);
    } else {
      console.log("✅ IndexNow success");
    }
  } catch (err) {
    console.error("IndexNow error:", err);
  }
}
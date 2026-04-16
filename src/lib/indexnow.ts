export async function submitToIndexNow(urls: string[]) {
  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: "jsprep.pro",
        key: "67b1fa86f6684ea89e4adc9e8a75645e",
        keyLocation:
          "https://jsprep.pro/67b1fa86f6684ea89e4adc9e8a75645e.txt",
        urlList: urls,
      }),
    });

    const text = await res.text();

    console.log("IndexNow status:", res.status);
    console.log("IndexNow response:", text);

    if (!res.ok) {
      console.error("❌ IndexNow failed");
    } else {
      console.log("✅ IndexNow success");
    }
  } catch (err) {
    console.error("IndexNow error:", err);
  }
}
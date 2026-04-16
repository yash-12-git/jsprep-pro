export async function submitToIndexNow(urls: string[]) {
  try {
    await fetch("https://api.indexnow.org/IndexNow", {
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
  } catch (err) {
    console.error("IndexNow error:", err);
  }
}
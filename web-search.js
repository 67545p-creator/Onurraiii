async function webSearch(query) {
  const url =
    "https://html.duckduckgo.com/html/?q=" +
    encodeURIComponent(query);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; OnurAI/1.0)"
    }
  });

  if (!response.ok) {
    throw new Error("Web araması başarısız oldu.");
  }

  const html = await response.text();

  const results = [];
  const regex =
    /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  let match;

  while ((match = regex.exec(html)) !== null && results.length < 5) {
    const link = match[1];
    const title = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .trim();

    if (title && link) {
      results.push({
        title,
        url: link
      });
    }
  }

  return results;
}

module.exports = { webSearch };

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "NEWS_API_KEY is not configured" });
  }

  const query = (req.query.query || "").trim();
  const language = (req.query.language || "en").trim();

  try {
    let url;
    if (query) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${encodeURIComponent(language)}&sortBy=popularity&apiKey=${apiKey}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?category=general&language=${encodeURIComponent(language)}&apiKey=${apiKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Failed to fetch news"
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
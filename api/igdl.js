import snapsave from "../snapsave-downloader/src/index.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let url;

    // Support GET /igdl?url=...
    if (req.method === "GET") {
      url = req.query.url;
    }

    // Support POST { "url": "..." }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      url = body?.url;
    }

    if (!url) {
      return res.status(400).json({ error: "URL parameter is missing" });
    }

    const downloadedURL = await snapsave(url);

    res.status(200).json({
      success: true,
      url: downloadedURL
    });
  } catch (err) {
    console.error("Error IGDL:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message
    });
  }
}

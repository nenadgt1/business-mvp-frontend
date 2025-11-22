// frontend/pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Remove any trailing slashes so we never get "//api/generate"
const rawBase = process.env.API_BASE || "";
const API_BASE = rawBase.replace(/\/+$/, ""); // trims one or more "/" at the end

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!API_BASE) {
    return res.status(500).json({ error: "Missing API_BASE env" });
  }
  try {
    const r = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const text = await r.text();
    res.status(r.status).send(text);
  } catch (e: any) {
    res
      .status(502)
      .json({ error: "Proxy error", details: e?.message || String(e) });
  }
}

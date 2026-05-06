export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { topic, level } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.",
    });
  }

  const prompt = `You are an expert English language teacher specializing in technical vocabulary.
Generate exactly 5 advanced English words from the field of "${topic}" at ${level} level.

For each word provide:
1. word (the term itself)
2. pos (part of speech: noun, verb, adjective, adverb, etc.)
3. phonetic (simple pronunciation guide, e.g. /ˈmɪt.ɪ.ɡeɪt/)
4. definition (clear, precise 2-sentence explanation)
5. examples (array of exactly 2 sentences using the word in a technical context; wrap the target word in **double asterisks**)
6. tip (a memory trick or etymology note to help remember the word)

Respond ONLY with valid JSON. No markdown fences, no preamble, no text outside the JSON.
Schema:
{"words":[{"word":"...","pos":"...","phonetic":"...","definition":"...","examples":["...","..."],"tip":"..."}]}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || "Gemini API error";
      return res.status(response.status).json({ error: msg });
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate words: " + err.message });
  }
}

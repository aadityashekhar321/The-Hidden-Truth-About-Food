// /api/generate.js
export default async function handler(req, res) {
  // ✅ Temporary debug: check if API key is loading
  console.log("ENV keys:", process.env);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = (req.body && typeof req.body === 'object') ? req.body : JSON.parse(req.body || '{}');
    const prompt = `Provide a JSON object for the food "${body.foodName}" with these keys:
    "foodName", "summary", "nutritionalData" (including calories, sugar, fat, sodium, protein, fiber, saturatedFat).
     Respond ONLY with valid JSON.`;

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'Server misconfigured: missing API key' });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    };

    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const apiJson = await apiRes.json();

    try {
      const candidate = apiJson?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;
      if (text && typeof text === 'string') {
        try {
          const parsed = JSON.parse(text);
          return res.status(200).json({ ok: true, fromAI: parsed });
        } catch {
          return res.status(200).json({ ok: true, fromAI: text });
        }
      }
    } catch {}

    return res.status(200).json({ ok: true, raw: apiJson });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

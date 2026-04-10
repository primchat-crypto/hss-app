import { NextResponse } from "next/server";

export async function GET() {
  const ak = process.env.GEMINI_API_KEY;
  return NextResponse.json({
    status: ak ? "API key configured" : "NO API KEY!",
    keyPrefix: ak ? ak.slice(0, 12) + "..." : "none"
  });
}

export async function POST(req) {
  try {
    const { prompt, system, maxTokens } = await req.json();
    if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

    const ak = process.env.GEMINI_API_KEY;
    if (!ak) return NextResponse.json({ error: "No API key configured" }, { status: 500 });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const model = "gemini-2.0-flash";
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${ak}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: system || "คุณเป็นผู้ช่วย AI ที่ตอบเป็นภาษาไทย" }],
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens || 800,
            temperature: 0.3,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!r.ok) {
      const errBody = await r.text();
      console.error("Gemini error:", r.status, errBody);
      return NextResponse.json({ error: `Gemini ${r.status}` }, { status: 500 });
    }

    const d = await r.json();
    const text = d.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ text });
  } catch (e) {
    console.error("AI route error:", e.message);
    return NextResponse.json({ error: e.message || "Gemini error" }, { status: 500 });
  }
}

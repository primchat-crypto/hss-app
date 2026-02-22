import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, system } = await req.json();
    if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

    const ak = process.env.OPENAI_API_KEY;
    if (!ak) return NextResponse.json({ error: "No API key configured" }, { status: 500 });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ak}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        temperature: 0.2,
        messages: [
          { role: "system", content: system || "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content || "";
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: e.message || "GPT error" }, { status: 500 });
  }
}

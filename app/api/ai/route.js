import { NextResponse } from "next/server";

export async function GET() {
  const ak = process.env.OPENAI_API_KEY;
  return NextResponse.json({ 
    status: ak ? "API key configured" : "NO API KEY!",
    keyPrefix: ak ? ak.slice(0, 12) + "..." : "none"
  });
}

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
    
    if (!r.ok) {
      const errBody = await r.text();
      console.error("OpenAI error:", r.status, errBody);
      return NextResponse.json({ error: `OpenAI ${r.status}` }, { status: 500 });
    }
    
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content || "";
    return NextResponse.json({ text });
  } catch (e) {
    console.error("AI route error:", e.message);
    return NextResponse.json({ error: e.message || "GPT error" }, { status: 500 });
  }
}

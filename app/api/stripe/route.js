import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { plan, userId, email } = await req.json();
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

    const priceId = plan === "deep" 
      ? process.env.STRIPE_PRICE_DEEP 
      : process.env.STRIPE_PRICE_ALL;

    if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    // Create Stripe Checkout Session via API (no SDK needed)
    const origin = req.headers.get("origin") || "https://localhost:3000";
    
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("payment_method_types[0]", "card");
    params.append("payment_method_types[1]", "promptpay");
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${origin}?payment=success&plan=${plan}`);
    params.append("cancel_url", `${origin}?payment=cancel`);
    if (email) params.append("customer_email", email);
    params.append("metadata[userId]", userId || "");
    params.append("metadata[plan]", plan);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sk}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await res.json();
    if (session.error) return NextResponse.json({ error: session.error.message }, { status: 400 });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

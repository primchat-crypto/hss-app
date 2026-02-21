// app/api/stripe/route.js
// Stripe Checkout — ฝั่ง server เท่านั้น (sk_test ไม่ส่งไป browser)
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { plan, uid, email } = await request.json();

    // เลือก price ID ตาม plan
    const priceId =
      plan === "deep"
        ? process.env.STRIPE_PRICE_DEEP
        : process.env.STRIPE_PRICE_ALL;

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // สร้าง Stripe Checkout Session
    // ใช้ fetch ตรงแทน stripe SDK เพื่อลด dependency
    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "payment_method_types[0]": "card",
          "line_items[0][price]": priceId,
          "line_items[0][quantity]": "1",
          mode: "payment",
          success_url: `${request.headers.get("origin")}/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${request.headers.get("origin")}/?canceled=true`,
          "customer_email": email || "",
          "metadata[uid]": uid || "",
          "metadata[plan]": plan,
        }),
      }
    );

    const session = await stripeResponse.json();

    if (session.error) {
      return NextResponse.json(
        { error: session.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}

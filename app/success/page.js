// app/success/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const plan = params.get("plan");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Save plan to localStorage for the main app to pick up
    if (plan) {
      try { localStorage.setItem("hss_purchased_plan", plan); } catch {}
    }
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { window.location.href = "/"; clearInterval(iv); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [plan]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#ECFDF5,#F0FDF4)", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#059669", marginBottom: 8 }}>ชำระเงินสำเร็จ!</h1>
        <p style={{ fontSize: 15, color: "#374151", marginBottom: 8 }}>
          ปลดล็อก <strong>{plan === "all" ? "All Access" : "Deep Insight Pack"}</strong> แล้ว
        </p>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          กำลังพาไปหน้าผลลัพธ์ใน {countdown} วินาที...
        </p>
        <a href="/" style={{ display: "inline-block", marginTop: 16, padding: "12px 24px", background: "#059669", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
          ไปดูผลลัพธ์ทันที →
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

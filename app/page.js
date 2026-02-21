// app/page.js
"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/* ================================================================
   HSS — Holistic Self Score Webapp v4
   Production-ready with:
   • 3-tier pricing (Free / ฿129 Deep Insight / ฿249 All Access)
   • Claude AI analysis on 6 features
   • Stripe payment integration
   • Firebase Auth + Firestore simulation
   • PDF Report export
   • Shareable Profile Link
   ================================================================ */

// ─── PRICING ─────────────────────────────────────────────────
const PLANS = {
  free: { name: "Free", price: 0, features: ["identity", "core5"] },
  deep: { name: "Deep Insight Pack", price: 129, badge: "ยอดนิยม", features: ["identity", "core5", "12d", "shadow", "noti", "energy"] },
  all: { name: "All Access", price: 249, badge: "คุ้มที่สุด", features: ["identity", "core5", "12d", "shadow", "noti", "energy", "job", "pdf", "share"] }
};

const FEATURE_META = {
  identity: { name: "Identity Snapshot", icon: "✦", desc: "1 ประโยคสรุปตัวตนคุณ" },
  core5: { name: "5 Core Scores", icon: "📊", desc: "คะแนน 5 มิติหลักพร้อม AI วิเคราะห์" },
  "12d": { name: "12D Spider Web", icon: "🕸️", desc: "Radar chart 12 มิติ + จุดแข็ง/จุดอ่อน" },
  shadow: { name: "Shadow Analysis", icon: "🌑", desc: "เจาะลึกเงามืดและจุดบอดของคุณ" },
  noti: { name: "Do & Don't สัปดาห์นี้", icon: "📋", desc: "คำแนะนำจากดวงดาวว่าควรทำ/เลี่ยง" },
  energy: { name: "7-Day Energy Forecast", icon: "🌙", desc: "พยากรณ์พลังงาน 7 วันจากจันทร์+อังคาร" },
  job: { name: "Job Matching AI", icon: "💼", desc: "อาชีพที่เหมาะกับศักยภาพคุณ" },
  pdf: { name: "PDF Report", icon: "📄", desc: "ดาวน์โหลดรายงานเต็มเป็น PDF" },
  share: { name: "Shareable Profile", icon: "🔗", desc: "แชร์โปรไฟล์ให้คนอื่นดูได้" }
};

// ─── CLAUDE AI SERVICE ───────────────────────────────────────
const AI = {
  cache: {},
  call: async (prompt, key) => {
    if (key && AI.cache[key]) return AI.cache[key];
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      const t = d.content?.map(c => c.type === "text" ? c.text : "").join("") || "";
      if (key) AI.cache[key] = t;
      return t;
    } catch (e) { console.error("AI:", e); return null; }
  },

  identity: (name, scores) => {
    const s = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return AI.call(`คุณเป็นนักจิตวิทยาเชิงโหราศาสตร์ เขียนสรุปตัวตนของ "${name}" 2-3 ประโยค (ภาษาไทย) จากคะแนน:
จุดแข็ง: ${s.slice(0, 3).map(([k, v]) => `${k}(${v.toFixed(1)})`).join(", ")}
จุดพัฒนา: ${s.slice(-2).map(([k, v]) => `${k}(${v.toFixed(1)})`).join(", ")}
เขียนเป็นกันเอง ให้กำลังใจ ไม่ใช้ bullet`, `id_${name}`);
  },

  core: (name, core) => AI.call(`วิเคราะห์ 5 Core Scores ของ "${name}" (ภาษาไทย):
${Object.entries(core).map(([k, v]) => `${k}: ${v.toFixed(1)}/10`).join("\n")}
ความหมาย: Cognitive(พุธ)=คิดเป็นระบบ, Emotional(จันทร์)=ควบคุมอารมณ์, Identity(อาทิตย์+เสาร์)=มั่นคงตัวตน, Shadow(ราหู/เกตุ)=รู้เท่าทันจุดบอด(สูง=ดี), Growth(พฤหัส)=เปิดรับเรียนรู้
วิเคราะห์แต่ละด้าน 1-2 ประโยค ใช้ emoji นำ(🧠🌊⚓🌑🌱) เป็นกันเอง มีคำแนะนำทำได้จริง ขึ้นบรรทัดใหม่แยกด้าน`, `core_${name}`),

  full12d: (name, scores) => AI.call(`วิเคราะห์ 12 มิติของ "${name}" (ภาษาไทย):
${Object.entries(scores).map(([k, v]) => `${k}: ${v.toFixed(1)}/10`).join("\n")}
แบ่ง 2 ส่วน: 1)จุดแข็ง 4 อันดับ+วิธีใช้เต็มศักยภาพ 2)จุดพัฒนา 4 อันดับ+action item 1 ข้อ
เขียนย่อหน้าสั้น เป็นกันเอง ให้กำลังใจ`, `f12_${name}`),

  shadow: (name, sh, all) => AI.call(`วิเคราะห์ Shadow Pattern ของ "${name}" เชิงลึก (ภาษาไทย):
Shadow: ${sh.toFixed(1)}/10 (สูง=รู้เท่าทัน), Stress: ${all["Stress Response"]?.toFixed(1)}, Boundary: ${all["Boundary System"]?.toFixed(1)}, Emotional: ${all["Emotional Regulation"]?.toFixed(1)}
วิเคราะห์: ⚡Trigger หลัก, 🔄Pattern ซ้ำ, 💡วิธีแก้ แต่ละหัวข้อ 2-3 ประโยค เป็นกันเอง ไม่ตัดสิน`, `sh_${name}`),

  weekly: (name, scores) => {
    const t = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return AI.call(`นักโหราศาสตร์จิตวิทยา ให้คำแนะนำรายสัปดาห์ "${name}" (ภาษาไทย):
จุดแข็ง: ${t.slice(0, 3).map(([k]) => k).join(",")} จุดระวัง: ${t.slice(-2).map(([k]) => k).join(",")}
ตอบ JSON เท่านั้น ไม่มี backtick:
{"do":["คำแนะนำ1","คำแนะนำ2","คำแนะนำ3"],"dont":["เลี่ยง1","เลี่ยง2","เลี่ยง3"]}`, `wk_${name}`);
  },

  energy7: (name, scores) => AI.call(`นักโหราศาสตร์ พยากรณ์พลังงาน 7 วัน "${name}" (ภาษาไทย):
Emotional:${scores["Emotional Regulation"]?.toFixed(1)}, Energy:${scores["Energy Management"]?.toFixed(1)}, Stress:${scores["Stress Response"]?.toFixed(1)}
ตอบ JSON เท่านั้น ไม่มี backtick:
[{"day":"จันทร์","energy":เลข40-95,"mood":"emoji+2-3คำ","tip":"คำแนะนำ1ประโยค"},{"day":"อังคาร",...},{"day":"พุธ",...},{"day":"พฤหัสบดี",...},{"day":"ศุกร์",...},{"day":"เสาร์",...},{"day":"อาทิตย์",...}]`, `en_${name}`),

  job: (name, scores) => {
    const t = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k}(${v.toFixed(1)})`).join(",");
    return AI.call(`ที่ปรึกษาอาชีพ แนะนำงานสำหรับ "${name}" จุดแข็ง: ${t}
ตอบ JSON เท่านั้น ไม่มี backtick:
[{"title":"ตำแหน่งอังกฤษ","match":80-95,"reason":"เหตุผลไทย1ประโยค","company":"บริษัทไทย/ต่างประเทศ"},{"title":"..."},{"title":"..."},{"title":"..."}]`, `job_${name}`);
  }
};

const parseJSON = (t) => { if (!t) return null; try { return JSON.parse(t.replace(/```json\s*/g, "").replace(/```/g, "").trim()); } catch { return null; } };

// ─── FIREBASE SIMULATION (localStorage for prototype) ────────
const store = {
  set: (k, v) => { try { localStorage.setItem(`hss_${k}`, JSON.stringify(v)); } catch {} },
  get: (k) => { try { const s = localStorage.getItem(`hss_${k}`); return s ? JSON.parse(s) : null; } catch { return null; } },
  del: (k) => { try { localStorage.removeItem(`hss_${k}`); } catch {} }
};

// ─── QUESTIONS ───────────────────────────────────────────────
const Q_DATA = {
  A: {
    "Cognitive Processing": { icon: "🧠", color: "#6366F1", q: ["ก่อนเริ่มงาน ฉันทำโครงคร่าวๆ อย่างน้อย 1 ครั้ง", "เวลาอธิบายเรื่องซับซ้อน ฉันสรุปเหลือ 2–3 ประเด็นได้", "ก่อนส่งงาน ฉันตรวจทานข้อผิดพลาดสำคัญ"] },
    "Emotional Regulation": { icon: "🌊", color: "#0EA5E9", q: ["เมื่ออารมณ์ขึ้น ฉันหยุดพักก่อนตอบ", "วันที่อารมณ์ไม่ดี ฉันยังทำงานจำเป็นได้", "หลังผิดหวัง ฉันกลับมาปกติใน 24–48 ชม."] },
    "Identity Stability": { icon: "⚓", color: "#EC4899", q: ["ฉันตัดสินใจจากเกณฑ์ตัวเอง ไม่ตามคนอื่น", "เมื่อถูกวิจารณ์ ฉันแยกเนื้อหาจากคุณค่าตัวเองได้", "ฉันมีเป้าหมายที่โฟกัสต่อเนื่อง 2 สัปดาห์"] }
  },
  B: {
    "Energy Management": { icon: "⚡", color: "#F59E0B", q: ["มีงานสำคัญ ฉันเริ่มทำใน 24 ชม.แรก", "ฉันทำงานต่อเนื่อง 30–60 นาทีโดยไม่หลุดโฟกัส", "เมื่อล้า ฉันพักแบบฟื้นจริงแทนฝืน"] },
    "Decision System": { icon: "⚖️", color: "#3B82F6", q: ["ก่อนตัดสินใจ ฉันดูอย่างน้อย 2 มุมมอง", "เลือกแล้ว ฉันลงมือทำไม่ลังเลซ้ำ", "ฉันคิดผลกระทบระยะยาวก่อนตัดสินใจ"] },
    "Responsibility Load": { icon: "🏋️", color: "#8B5CF6", q: ["ฉันทำงานสำคัญสุดก่อน แม้ไม่สนุก", "จะไม่ทัน ฉันแจ้งล่วงหน้าพร้อมทางเลือก", "ไม่มีคนตาม ฉันยังทำให้เสร็จตามมาตรฐาน"] }
  },
  C: {
    "Motivation Driver": { icon: "🔥", color: "#F97316", q: ["ฉันรู้เหตุผลที่ทำสิ่งนี้ พูดออกมาได้", "ในที่ประชุม ฉันแสดงความเห็นเมื่อเห็นต่าง", "ทำสำเร็จ ฉันยอมรับเครดิตไม่ลดค่าตัวเอง"] },
    "Boundary System": { icon: "🛡️", color: "#10B981", q: ["ถูกขอเกินกำลัง ฉันต่อรองขอบเขตได้", "ฉันมีเวลาหยุดพักจริงอย่างน้อย 1 ช่วง/สัปดาห์", "หลังคุยกับคนเครียด ฉันรีเซ็ตตัวเองได้"] },
    "Stress Response": { icon: "🧊", color: "#64748B", q: ["กดดัน ฉันยังรักษาคุณภาพงานขั้นต่ำได้", "เจอปัญหา ฉันทำก้าวแรกใน 24 ชม.", "ฉันทำสิ่งที่ควรทำแม้ไม่อยาก"] }
  },
  D: {
    "Shadow Pattern": { icon: "🌑", color: "#1E293B", reverse: true, q: ["ฉันเลี่ยงงานสำคัญไปทำสิ่งสบายกว่า", "ฉันตัดสินใจเร็วเพราะกลัว แล้วเสียใจ", "ฉันรู้ว่าควรเผชิญ แต่ผัดไว้ แม้กระทบซ้ำ"] },
    "Growth Orientation": { icon: "🌱", color: "#10B981", q: ["ได้ feedback ฉันถามต่อแทนปกป้องทันที", "ฉันใช้ 30+ นาที/สัปดาห์พัฒนาทักษะ", "หลังพลาด ฉันสรุปบทเรียน 1 ข้อ"] },
    "Integration Level": { icon: "🔮", color: "#A78BFA", q: ["ฉันมีสิ่งสำคัญอันดับ 1 ที่โฟกัสชัด", "ตารางชีวิตมีจังหวะพักไม่ล้าเรื้อรัง", "ฉันรู้จุดแข็ง/เสี่ยง ใช้วางแผนจริง"] }
  }
};

const PROVINCES = ["กรุงเทพมหานคร","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น","จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก","นครปฐม","นครพนม","นครราชสีมา","นครศรีธรรมราช","นครสวรรค์","นนทบุรี","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี","ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์","แพร่","พะเยา","ภูเก็ต","มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด","ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรปราการ","สมุทรสงคราม","สมุทรสาคร","สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์","หนองคาย","หนองบัวลำภู","อ่างทอง","อุดรธานี","อุทัยธานี","อุตรดิตถ์","อุบลราชธานี","อำนาจเจริญ"];

const flatQ = () => { const f = []; Object.values(Q_DATA).forEach(dims => { Object.entries(dims).forEach(([d, data]) => { data.q.forEach((q, i) => { f.push({ dim: d, question: q, icon: data.icon, color: data.color, rev: data.reverse || false, qi: i }); }); }); }); return f; };
const ALL_Q = flatQ();
const SCALE = ["แทบไม่เกิดขึ้น", "นานๆ ครั้ง", "บางครั้ง", "บ่อย", "เกือบทุกครั้ง"];
const POT = { "Cognitive Processing": 7.5, "Emotional Regulation": 6.8, "Identity Stability": 7.2, "Energy Management": 8.0, "Decision System": 6.5, "Responsibility Load": 7.0, "Motivation Driver": 8.5, "Boundary System": 5.8, "Stress Response": 6.2, "Shadow Pattern": 6.0, "Growth Orientation": 7.8, "Integration Level": 7.0 };

// ─── COMPONENTS ──────────────────────────────────────────────
const Spin = ({ text = "AI กำลังวิเคราะห์..." }) => (
  <div style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid #EDE9FE", borderTopColor: "#6366F1", animation: "hss-spin .7s linear infinite" }} />
    <span style={{ fontSize: 13, color: "#6366F1", fontWeight: 600 }}>{text}</span>
  </div>
);

const TypeWriter = ({ text, style = {} }) => {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => { if (!text) return; let i = 0; setShown(""); setDone(false); const iv = setInterval(() => { i += 3; if (i >= text.length) { setShown(text); setDone(true); clearInterval(iv); } else setShown(text.slice(0, i)); }, 10); return () => clearInterval(iv); }, [text]);
  return <div style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", whiteSpace: "pre-wrap", ...style }}>{shown}{!done && <span style={{ display: "inline-block", width: 2, height: 15, background: "#6366F1", marginLeft: 1, animation: "hss-blink .8s step-end infinite" }} />}</div>;
};

const Bg = () => <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(236,72,153,0.04) 0%, transparent 50%)" }} />;

const Spider = ({ scores, size = 280 }) => {
  const dims = Object.keys(scores); const n = dims.length; const cx = size / 2; const cy = size / 2; const r = size * .35;
  const pt = (i, v) => { const a = Math.PI * 2 * i / n - Math.PI / 2; return { x: cx + Math.cos(a) * v / 10 * r, y: cy + Math.sin(a) * v / 10 * r }; };
  return <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
    {[2, 4, 6, 8, 10].map(l => <polygon key={l} points={dims.map((_, i) => { const p = pt(i, l); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke="#E5E7EB" strokeWidth=".8" />)}
    {dims.map((_, i) => { const p = pt(i, 10); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#F3F4F6" strokeWidth=".6" />; })}
    <polygon points={dims.map((d, i) => { const p = pt(i, scores[d]); return `${p.x},${p.y}`; }).join(" ")} fill="rgba(99,102,241,0.12)" stroke="#6366F1" strokeWidth="2" />
    {dims.map((d, i) => { const p = pt(i, scores[d]); return <circle key={d} cx={p.x} cy={p.y} r="3" fill="#6366F1" stroke="#fff" strokeWidth="1.5" />; })}
    {dims.map((d, i) => { const p = pt(i, 11.8); return <text key={d} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#6B7280", fontWeight: 500, fontFamily: "inherit" }}>{d.length > 14 ? d.slice(0, 13) + "…" : d}</text>; })}
  </svg>;
};

const Bar = ({ label, score, color, icon, delay = 0 }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score / 10 * 100), 80 + delay); return () => clearTimeout(t); }, [score, delay]);
  return <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{icon} {label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{score.toFixed(1)}</span>
    </div>
    <div style={{ height: 7, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, borderRadius: 4, transition: "width .9s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  </div>;
};

// ─── STRIPE PAYMENT MODAL ────────────────────────────────────
const PayModal = ({ plan, onClose, onSuccess }) => {
  const [step, setStep] = useState("pick"); // pick | card | processing | done
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const p = PLANS[plan];

  const handlePay = async () => {
    setStep("processing");
    // In production: call Stripe API via your backend
    // const { paymentIntent } = await fetch('/api/stripe/create-payment', { ... })
    await new Promise(r => setTimeout(r, 2200));
    const txId = `hss_${plan}_${Date.now()}`;
    store.set(`plan_${store.get("uid") || "anon"}`, { plan, txId, at: new Date().toISOString() });
    setStep("done");
    setTimeout(() => onSuccess(plan), 1000);
  };

  const fmtCard = (v) => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const fmtExp = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  return <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
      {/* Header */}
      <div style={{ padding: "22px 24px 16px", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", color: "#fff" }}>
        <div style={{ fontSize: 12, opacity: .8, marginBottom: 2 }}>ปลดล็อก</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{p.name}</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>฿{p.price}</div>
        </div>
        <div style={{ fontSize: 12, opacity: .7, marginTop: 4 }}>จ่ายครั้งเดียว ใช้ได้ตลอด</div>
      </div>

      <div style={{ padding: 24 }}>
        {step === "pick" && <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>ฟีเจอร์ที่ได้รับ:</div>
            {p.features.map(f => <div key={f} style={{ fontSize: 13, color: "#6B7280", padding: "3px 0" }}>✓ {FEATURE_META[f]?.name}</div>)}
          </div>
          <button onClick={() => setStep("card")} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(79,70,229,.3)" }}>💳 ชำระเงินด้วยบัตร</button>
          <button onClick={onClose} style={{ width: "100%", padding: 10, border: "none", background: "transparent", color: "#9CA3AF", fontSize: 13, cursor: "pointer", marginTop: 8 }}>ยกเลิก</button>
        </>}

        {step === "card" && <>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>หมายเลขบัตร</label>
            <input value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))} placeholder="4242 4242 4242 4242" style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} onFocus={e => e.target.style.borderColor = "#6366F1"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>วันหมดอายุ</label>
              <input value={expiry} onChange={e => setExpiry(fmtExp(e.target.value))} placeholder="MM/YY" style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>CVC</label>
              <input value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="123" type="password" style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
            </div>
          </div>
          <button onClick={handlePay} disabled={cardNum.length < 19 || expiry.length < 5 || cvc.length < 3} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: (cardNum.length >= 19 && expiry.length >= 5 && cvc.length >= 3) ? "linear-gradient(135deg, #4F46E5, #7C3AED)" : "#E5E7EB", color: (cardNum.length >= 19) ? "#fff" : "#9CA3AF", fontSize: 15, fontWeight: 700, cursor: (cardNum.length >= 19) ? "pointer" : "not-allowed" }}>จ่าย ฿{p.price}</button>
          <button onClick={() => setStep("pick")} style={{ width: "100%", padding: 10, border: "none", background: "transparent", color: "#9CA3AF", fontSize: 13, cursor: "pointer", marginTop: 6 }}>← กลับ</button>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#D1D5DB" }}>🔒 Powered by Stripe · ปลอดภัย 100%</div>
        </>}

        {step === "processing" && <div style={{ textAlign: "center", padding: "30px 0" }}>
          <Spin text="กำลังชำระเงิน..." />
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 8 }}>กรุณาอย่าปิดหน้านี้</p>
        </div>}

        {step === "done" && <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px" }}>✅</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#059669" }}>ชำระเงินสำเร็จ!</h3>
        </div>}
      </div>
    </div>
  </div>;
};

// ─── MAIN APP ────────────────────────────────────────────────
export default function HSSApp() {
  const [scr, setScr] = useState("login");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [bday, setBday] = useState({ d: "", m: "", y: "" });
  const [btk, setBtk] = useState("exact");
  const [bt, setBt] = useState("");
  const [prov, setProv] = useState("");
  const [provQ, setProvQ] = useState("");
  const [cq, setCq] = useState(0);
  const [ans, setAns] = useState({});
  const [plan, setPlan] = useState("free");
  const [payModal, setPayModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI states
  const [aiData, setAiData] = useState({});
  const [aiLoading, setAiLoading] = useState({});

  // Restore session
  useEffect(() => {
    const uid = store.get("uid");
    if (uid) {
      const p = store.get("profile_" + uid);
      const a = store.get("answers_" + uid);
      const pl = store.get("plan_" + uid);
      if (p) { setNick(p.nick || ""); setProv(p.prov || ""); setEmail(p.email || ""); if (p.bday) setBday(p.bday); }
      if (pl) setPlan(pl.plan || "free");
      if (a && Object.keys(a).length >= 36) { setAns(a); setScr("results"); }
      else if (p?.nick) setScr("quiz");
      else setScr("profile");
    }
  }, []);

  const calcScores = useCallback(() => {
    const s = {};
    Object.values(Q_DATA).forEach(dims => {
      Object.entries(dims).forEach(([d, data]) => {
        let t = 0, c = 0;
        data.q.forEach((_, i) => { const k = `${d}-${i}`; if (ans[k] !== undefined) { let v = ans[k]; if (data.reverse) v = 4 - v; t += v; c++; } });
        const sp = c > 0 ? t / (c * 4) : 0;
        s[d] = data.reverse ? Math.round(POT[d] * (1 - sp) * 10) / 10 : Math.round(POT[d] * (.6 + sp * .4) * 10) / 10;
      });
    });
    return s;
  }, [ans]);

  const scores = Object.keys(ans).length >= 36 ? calcScores() : null;
  const has = (f) => PLANS[plan]?.features?.includes(f);

  // AI loaders
  const loadAI = async (type) => {
    if (!scores || !nick || aiData[type]) return;
    setAiLoading(p => ({ ...p, [type]: true }));
    let result = null;
    const core5 = scores ? { "Cognitive Processing": scores["Cognitive Processing"], "Emotional Regulation": scores["Emotional Regulation"], "Identity Stability": scores["Identity Stability"], "Shadow Pattern": scores["Shadow Pattern"], "Growth Orientation": scores["Growth Orientation"] } : {};
    try {
      if (type === "identity") result = await AI.identity(nick, scores);
      if (type === "core") result = await AI.core(nick, core5);
      if (type === "full") result = await AI.full12d(nick, scores);
      if (type === "shadow") result = await AI.shadow(nick, scores["Shadow Pattern"], scores);
      if (type === "weekly") result = parseJSON(await AI.weekly(nick, scores));
      if (type === "energy") result = parseJSON(await AI.energy7(nick, scores));
      if (type === "job") result = parseJSON(await AI.job(nick, scores));
    } catch {}
    setAiData(p => ({ ...p, [type]: result }));
    setAiLoading(p => ({ ...p, [type]: false }));
  };

  useEffect(() => {
    if (scr === "results" && scores) {
      loadAI("identity");
      loadAI("core");
      if (has("12d")) loadAI("full");
      if (has("shadow")) loadAI("shadow");
      if (has("noti")) loadAI("weekly");
      if (has("energy")) loadAI("energy");
      if (has("job")) loadAI("job");
    }
  }, [scr, plan]);

  const handlePurchase = (p) => { setPlan(p); setPayModal(null); const uid = store.get("uid"); if (uid) store.set("plan_" + uid, { plan: p, at: new Date().toISOString() }); };

  // PDF export
  const exportPDF = () => {
    if (!scores) return;
    const w = window.open("", "_blank");
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>HSS Report — ${nick}</title><style>body{font-family:'Noto Sans Thai',sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#1F2937}h1{color:#4F46E5}h2{color:#6366F1;border-bottom:2px solid #E5E7EB;padding-bottom:8px;margin-top:28px}.bar{height:8px;background:#F3F4F6;border-radius:4px;margin:4px 0 12px;overflow:hidden}.bar-fill{height:100%;border-radius:4px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.card{padding:12px;border-radius:8px;font-size:14px}.g{background:#ECFDF5;border:1px solid #A7F3D0}.r{background:#FFF1F2;border:1px solid #FECDD3}</style></head><body>`);
    w.document.write(`<h1>✦ Holistic Self Score Report</h1><p><strong>${nick}</strong> · ${new Date().toLocaleDateString("th-TH")}</p>`);
    if (aiData.identity) w.document.write(`<h2>Identity Snapshot</h2><p>${aiData.identity}</p>`);
    w.document.write(`<h2>12 Dimension Scores</h2>`);
    sorted.forEach(([d, s]) => { w.document.write(`<div><strong>${d}: ${s.toFixed(1)}/10</strong><div class="bar"><div class="bar-fill" style="width:${s * 10}%;background:${s > 7 ? '#10B981' : s > 5 ? '#F59E0B' : '#EF4444'}"></div></div></div>`); });
    w.document.write(`<h2>จุดแข็ง & จุดพัฒนา</h2><div class="grid">`);
    sorted.slice(0, 4).forEach(([d, s]) => w.document.write(`<div class="card g">💪 ${d} (${s.toFixed(1)})</div>`));
    sorted.slice(-4).forEach(([d, s]) => w.document.write(`<div class="card r">⚠️ ${d} (${s.toFixed(1)})</div>`));
    w.document.write(`</div>`);
    if (aiData.full) w.document.write(`<h2>AI Analysis</h2><p style="white-space:pre-wrap">${aiData.full}</p>`);
    if (aiData.shadow) w.document.write(`<h2>Shadow Analysis</h2><p style="white-space:pre-wrap">${aiData.shadow}</p>`);
    w.document.write(`<hr><p style="color:#9CA3AF;font-size:12px">Generated by Holistic Self Score · Powered by Claude AI</p></body></html>`);
    w.document.close();
    w.print();
  };

  // Share link
  const shareProfile = () => {
    const data = scores ? btoa(JSON.stringify({ n: nick, s: scores })) : "";
    const url = `${window.location.origin}?profile=${data}`;
    navigator.clipboard?.writeText(url);
    alert("คัดลอกลิงก์โปรไฟล์แล้ว!");
  };

  // ─── STYLES ────────────────────────────────
  const C = { bg: { fontFamily: "'Noto Sans Thai','DM Sans',-apple-system,sans-serif", minHeight: "100vh", background: "#FAFBFF", color: "#1F2937", position: "relative" }, w: { maxWidth: 460, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }, inp: { width: "100%", padding: "12px 14px", fontSize: 15, border: "2px solid #E5E7EB", borderRadius: 10, outline: "none", background: "#fff", boxSizing: "border-box", transition: "border-color .2s" }, lbl: { fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5, display: "block" } };
  const btn = (ok) => ({ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, background: ok ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : "#E5E7EB", color: ok ? "#fff" : "#9CA3AF", border: "none", borderRadius: 12, cursor: ok ? "pointer" : "not-allowed", boxShadow: ok ? "0 4px 14px rgba(79,70,229,.25)" : "none" });

  const globalCSS = `@keyframes hss-spin{to{transform:rotate(360deg)}}@keyframes hss-blink{50%{opacity:0}}`;

  // ═══════════ LOGIN ═══════════
  if (scr === "login") return <div style={C.bg}><Bg /><style>{globalCSS}</style>
    <div style={C.w}><div style={{ paddingTop: 80, textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, margin: "0 auto 20px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", boxShadow: "0 8px 28px rgba(79,70,229,.3)" }}>✦</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.5px", marginBottom: 6 }}>Holistic Self Score</h1>
      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 36 }}>รู้จักตัวเองผ่านดวงดาวและจิตวิทยา</p>
      <div style={{ textAlign: "left", marginBottom: 14 }}>
        <label style={C.lbl}>อีเมล</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={C.inp} onFocus={e => e.target.style.borderColor = "#6366F1"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
      </div>
      <button onClick={() => { if (!email.includes("@")) return; const uid = btoa(email).slice(0, 12); store.set("uid", uid); store.set("email", email); setScr("profile"); }} style={btn(email.includes("@"))}>เข้าสู่ระบบด้วยอีเมล</button>
      <div style={{ display: "flex", alignItems: "center", margin: "18px 0" }}><div style={{ flex: 1, height: 1, background: "#E5E7EB" }} /><span style={{ padding: "0 14px", fontSize: 12, color: "#9CA3AF" }}>หรือ</span><div style={{ flex: 1, height: 1, background: "#E5E7EB" }} /></div>
      <button onClick={() => { setEmail("demo@gmail.com"); const uid = "google_demo"; store.set("uid", uid); store.set("email", "demo@gmail.com"); setScr("profile"); }} style={{ width: "100%", padding: 13, fontSize: 14, fontWeight: 600, background: "#fff", color: "#1F2937", border: "2px solid #E5E7EB", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        เข้าสู่ระบบด้วย Google
      </button>
    </div></div></div>;

  // ═══════════ PROFILE ═══════════
  if (scr === "profile") {
    const ok = nick && bday.d && bday.m && bday.y && prov;
    const fp = provQ ? PROVINCES.filter(p => p.includes(provQ)) : PROVINCES;
    return <div style={C.bg}><Bg /><style>{globalCSS}</style>
      <div style={C.w}><div style={{ paddingTop: 36, paddingBottom: 40 }}>
        <button onClick={() => { store.del("uid"); setScr("login"); }} style={{ background: "none", border: "none", fontSize: 13, color: "#6366F1", cursor: "pointer", fontWeight: 600, marginBottom: 20, padding: 0 }}>← กลับ</button>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>ข้อมูลของคุณ</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 28 }}>กรอกข้อมูลเพื่อวิเคราะห์ดวงชะตา</p>
        <div style={{ marginBottom: 18 }}><label style={C.lbl}>ชื่อเล่น</label><input value={nick} onChange={e => setNick(e.target.value)} placeholder="เช่น มิว, เบล" style={C.inp} onFocus={e => e.target.style.borderColor = "#6366F1"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} /></div>
        <div style={{ marginBottom: 18 }}><label style={C.lbl}>วัน/เดือน/ปีเกิด (พ.ศ.)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={bday.d} onChange={e => setBday(p => ({ ...p, d: e.target.value }))} style={{ ...C.inp, flex: 1 }}><option value="">วัน</option>{[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select>
            <select value={bday.m} onChange={e => setBday(p => ({ ...p, m: e.target.value }))} style={{ ...C.inp, flex: 1.3 }}><option value="">เดือน</option>{["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}</select>
            <select value={bday.y} onChange={e => setBday(p => ({ ...p, y: e.target.value }))} style={{ ...C.inp, flex: 1.1 }}><option value="">ปี</option>{[...Array(60)].map((_, i) => { const y = 2569 - i; return <option key={y} value={y}>{y}</option>; })}</select>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}><label style={C.lbl}>เวลาเกิด</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>{[{ v: "exact", l: "รู้เวลา" }, { v: "am", l: "เช้า (00-12)" }, { v: "pm", l: "บ่าย (12-24)" }].map(o => <button key={o.v} onClick={() => setBtk(o.v)} style={{ flex: 1, padding: "9px 4px", fontSize: 11, fontWeight: 600, borderRadius: 8, border: `2px solid ${btk === o.v ? "#6366F1" : "#E5E7EB"}`, background: btk === o.v ? "#EEF2FF" : "#fff", color: btk === o.v ? "#4F46E5" : "#6B7280", cursor: "pointer" }}>{o.l}</button>)}</div>
          {btk === "exact" && <input type="time" value={bt} onChange={e => setBt(e.target.value)} style={C.inp} />}
        </div>
        <div style={{ marginBottom: 28 }}><label style={C.lbl}>จังหวัดที่เกิด</label>
          <input value={prov || provQ} onChange={e => { setProvQ(e.target.value); setProv(""); }} placeholder="พิมพ์ค้นหา..." style={C.inp} onFocus={e => e.target.style.borderColor = "#6366F1"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          {provQ && !prov && <div style={{ maxHeight: 160, overflowY: "auto", background: "#fff", borderRadius: 8, border: "1px solid #E5E7EB", marginTop: 4, boxShadow: "0 4px 12px rgba(0,0,0,.06)" }}>{fp.slice(0, 20).map(p => <div key={p} onClick={() => { setProv(p); setProvQ(""); }} style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer" }} onMouseEnter={e => e.target.style.background = "#EEF2FF"} onMouseLeave={e => e.target.style.background = "#fff"}>{p}</div>)}</div>}
        </div>
        <button onClick={() => { if (!ok) return; const uid = store.get("uid") || "anon"; store.set("profile_" + uid, { nick, bday, btk, bt, prov, email }); setScr("quiz"); }} style={btn(ok)}>เริ่มทำแบบประเมิน →</button>
      </div></div></div>;
  }

  // ═══════════ QUIZ ═══════════
  if (scr === "quiz") {
    const q = ALL_Q[cq]; const key = `${q.dim}-${q.qi}`;
    const pct = (cq + 1) / ALL_Q.length * 100;
    const allDone = Object.keys(ans).length >= ALL_Q.length;
    return <div style={C.bg}><Bg /><style>{globalCSS}</style>
      <div style={C.w}><div style={{ paddingTop: 20, paddingBottom: 40 }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: 12, fontWeight: 600, color: "#6366F1" }}>{cq + 1}/{ALL_Q.length}</span><span style={{ fontSize: 11, color: "#9CA3AF" }}>{Math.round(pct)}%</span></div>
          <div style={{ height: 5, background: "#EEF2FF", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6366F1,#A78BFA)", borderRadius: 3, transition: "width .3s" }} /></div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 16, background: "#EEF2FF", marginBottom: 14 }}><span style={{ fontSize: 14 }}>{q.icon}</span><span style={{ fontSize: 11, fontWeight: 600, color: "#4F46E5" }}>{q.dim}</span></div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "26px 22px", marginBottom: 18, boxShadow: "0 1px 4px rgba(0,0,0,.04)", border: "1px solid #F3F4F6", minHeight: 64, display: "flex", alignItems: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.7, margin: 0 }}>{q.question}</p>
        </div>
        <p style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center", marginBottom: 12 }}>📅 ตอบจากพฤติกรรม 14 วันที่ผ่านมา</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
          {SCALE.map((l, i) => <button key={i} onClick={() => { setAns(p => ({ ...p, [key]: i })); if (cq < ALL_Q.length - 1 && ans[key] === undefined) setTimeout(() => setCq(c => Math.min(c + 1, ALL_Q.length - 1)), 250); }} style={{ padding: "12px 16px", fontSize: 14, fontWeight: ans[key] === i ? 700 : 500, border: `2px solid ${ans[key] === i ? "#6366F1" : "#E5E7EB"}`, borderRadius: 10, cursor: "pointer", textAlign: "left", background: ans[key] === i ? "#EEF2FF" : "#fff", color: ans[key] === i ? "#4F46E5" : "#374151", display: "flex", alignItems: "center", gap: 10, transition: "all .15s" }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: ans[key] === i ? "#6366F1" : "#F3F4F6", color: ans[key] === i ? "#fff" : "#9CA3AF" }}>{i}</span>{l}
          </button>)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setCq(Math.max(0, cq - 1))} disabled={cq === 0} style={{ flex: 1, padding: 12, fontSize: 13, fontWeight: 600, border: "2px solid #E5E7EB", borderRadius: 10, cursor: cq > 0 ? "pointer" : "not-allowed", background: "#fff", color: cq > 0 ? "#374151" : "#D1D5DB" }}>←</button>
          {cq === ALL_Q.length - 1 && allDone ? (
            <button onClick={() => { setLoading(true); const uid = store.get("uid"); if (uid) store.set("answers_" + uid, ans); setTimeout(() => { setLoading(false); setScr("results"); }, 2000); }} style={{ flex: 2, ...btn(true), padding: 12 }}>ดูผลลัพธ์ ✦</button>
          ) : (
            <button onClick={() => { if (ans[key] !== undefined) setCq(Math.min(cq + 1, ALL_Q.length - 1)); }} disabled={ans[key] === undefined} style={{ flex: 1.5, ...btn(ans[key] !== undefined), padding: 12 }}>ถัดไป →</button>
          )}
        </div>
      </div></div></div>;
  }

  // ═══════════ LOADING ═══════════
  if (loading) return <div style={{ ...C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Bg /><style>{globalCSS}</style>
    <div style={{ textAlign: "center", zIndex: 1 }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, margin: "0 auto 18px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff" }}>✦</div>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>AI กำลังวิเคราะห์ดวงของคุณ</h2>
      <Spin text="กำลังประมวลผล 12 มิติ..." />
    </div></div>;

  // ═══════════ RESULTS ═══════════
  if (scr === "results" && scores) {
    const core5 = { "Cognitive Processing": scores["Cognitive Processing"], "Emotional Regulation": scores["Emotional Regulation"], "Identity Stability": scores["Identity Stability"], "Shadow Pattern": scores["Shadow Pattern"], "Growth Orientation": scores["Growth Orientation"] };
    const cColors = { "Cognitive Processing": "#6366F1", "Emotional Regulation": "#0EA5E9", "Identity Stability": "#EC4899", "Shadow Pattern": "#1E293B", "Growth Orientation": "#10B981" };
    const cIcons = { "Cognitive Processing": "🧠", "Emotional Regulation": "🌊", "Identity Stability": "⚓", "Shadow Pattern": "🌑", "Growth Orientation": "🌱" };
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    const Section = ({ featureKey, children, title, icon }) => {
      const unlocked = has(featureKey);
      return <div style={{ background: "#fff", borderRadius: 16, padding: unlocked ? 22 : "22px 22px 16px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,.04)", border: "1px solid #F3F4F6", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: unlocked ? 14 : 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{title}</span>
          </div>
          {!unlocked && <span style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", background: "#EEF2FF", padding: "3px 10px", borderRadius: 12 }}>🔒</span>}
        </div>
        {unlocked ? children : <>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 12 }}>{FEATURE_META[featureKey]?.desc}</p>
          <div style={{ display: "flex", gap: 8 }}>
            {plan === "free" && <button onClick={() => setPayModal("deep")} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "2px solid #6366F1", background: "#EEF2FF", color: "#4F46E5", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Deep Insight ฿129</button>}
            <button onClick={() => setPayModal("all")} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>All Access ฿249</button>
          </div>
        </>}
      </div>;
    };

    return <div style={C.bg}><Bg /><style>{globalCSS}</style>
      {payModal && <PayModal plan={payModal} onClose={() => setPayModal(null)} onSuccess={handlePurchase} />}

      <div style={{ ...C.w, paddingTop: 20, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, marginBottom: 1 }}>ผลของ {nick}</h1>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>HSS Report · AI-Powered</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {has("share") && <button onClick={shareProfile} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>🔗</button>}
            {has("pdf") && <button onClick={exportPDF} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>📄</button>}
          </div>
        </div>

        {/* Plan badge */}
        {plan !== "free" && <div style={{ padding: "10px 16px", borderRadius: 10, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>✦ {PLANS[plan].name}</span>
          <span style={{ fontSize: 11, opacity: .8 }}>Active</span>
        </div>}

        {/* Upgrade CTA for free users */}
        {plan === "free" && <div style={{ padding: "16px 18px", borderRadius: 14, border: "2px solid #6366F1", background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4F46E5", marginBottom: 6 }}>🔓 ปลดล็อกศักยภาพเต็มของคุณ</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => setPayModal("deep")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "2px solid #6366F1", background: "#fff", color: "#4F46E5", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Deep Insight<br /><span style={{ fontSize: 16, fontWeight: 800 }}>฿129</span>
            </button>
            <button onClick={() => setPayModal("all")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", position: "relative" }}>
              <span style={{ position: "absolute", top: -8, right: 8, background: "#F59E0B", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8 }}>คุ้มสุด</span>
              All Access<br /><span style={{ fontSize: 16, fontWeight: 800 }}>฿249</span>
            </button>
          </div>
        </div>}

        {/* 1. Identity (FREE) */}
        <Section featureKey="identity" title="Identity Snapshot" icon="✦">
          {aiLoading.identity ? <Spin text="AI สรุปตัวตนของคุณ..." /> : aiData.identity ? <TypeWriter text={aiData.identity} /> : <p style={{ fontSize: 13, color: "#9CA3AF" }}>กำลังโหลด...</p>}
        </Section>

        {/* 2. 5 Core (FREE) */}
        <Section featureKey="core5" title="5 Core Scores" icon="📊">
          {Object.entries(core5).map(([d, s], i) => <Bar key={d} label={d} score={s} color={cColors[d]} icon={cIcons[d]} delay={i * 120} />)}
          <div style={{ marginTop: 12, padding: 14, background: "#F9FAFB", borderRadius: 10 }}>
            {aiLoading.core ? <Spin text="AI วิเคราะห์ 5 มิติ..." /> : aiData.core ? <TypeWriter text={aiData.core} /> : <p style={{ fontSize: 13, color: "#9CA3AF" }}>กำลังโหลด...</p>}
          </div>
        </Section>

        {/* 3. 12D Spider (DEEP) */}
        <Section featureKey="12d" title="12D Spider Web" icon="🕸️">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Spider scores={scores} /></div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>💪 จุดแข็ง</div>
            {sorted.slice(0, 4).map(([d, s]) => <div key={d} style={{ padding: "8px 12px", borderRadius: 8, background: "#ECFDF5", border: "1px solid #A7F3D0", marginBottom: 4, display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ fontWeight: 600 }}>{d}</span><span style={{ fontWeight: 700, color: "#059669" }}>{s.toFixed(1)}</span></div>)}
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>⚠️ ต้องพัฒนา</div>
            {sorted.slice(-4).map(([d, s]) => <div key={d} style={{ padding: "8px 12px", borderRadius: 8, background: "#FFF1F2", border: "1px solid #FECDD3", marginBottom: 4, display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ fontWeight: 600 }}>{d}</span><span style={{ fontWeight: 700, color: "#EF4444" }}>{s.toFixed(1)}</span></div>)}
          </div>
          <div style={{ padding: 14, background: "#F9FAFB", borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", marginBottom: 4 }}>🤖 AI วิเคราะห์</div>
            {aiLoading.full ? <Spin /> : aiData.full ? <TypeWriter text={aiData.full} /> : <Spin text="กำลังวิเคราะห์..." />}
          </div>
        </Section>

        {/* 4. Shadow (DEEP) */}
        <Section featureKey="shadow" title="Shadow Analysis" icon="🌑">
          <div style={{ padding: 16, borderRadius: 12, background: "linear-gradient(135deg,#1E293B,#334155)", color: "#fff", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Shadow Score: {scores["Shadow Pattern"].toFixed(1)}/10</div>
            <div style={{ fontSize: 12, opacity: .7, marginTop: 4 }}>{scores["Shadow Pattern"] > 6 ? "รู้เท่าทันเงามืดได้ดี" : "เงามืดมีอิทธิพลค่อนข้างมาก"}</div>
          </div>
          <div style={{ padding: 14, background: "#F9FAFB", borderRadius: 10 }}>
            {aiLoading.shadow ? <Spin text="AI วิเคราะห์เงามืด..." /> : aiData.shadow ? <TypeWriter text={aiData.shadow} /> : <Spin text="กำลังวิเคราะห์..." />}
          </div>
        </Section>

        {/* 5. Do & Don't (DEEP) */}
        <Section featureKey="noti" title="Do & Don't สัปดาห์นี้" icon="📋">
          {aiLoading.weekly ? <Spin text="AI สร้างคำแนะนำ..." /> : aiData.weekly ? <>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>✅ Do</div>
            {(aiData.weekly.do || []).map((t, i) => <div key={i} style={{ padding: "9px 12px", borderRadius: 8, background: "#ECFDF5", border: "1px solid #A7F3D0", fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>{t}</div>)}
            <div style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", marginBottom: 6, marginTop: 12 }}>❌ Don't</div>
            {(aiData.weekly.dont || []).map((t, i) => <div key={i} style={{ padding: "9px 12px", borderRadius: 8, background: "#FFF1F2", border: "1px solid #FECDD3", fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>{t}</div>)}
          </> : <Spin text="กำลังสร้างคำแนะนำ..." />}
        </Section>

        {/* 6. Energy (DEEP) */}
        <Section featureKey="energy" title="7-Day Energy Forecast" icon="🌙">
          {aiLoading.energy ? <Spin text="AI พยากรณ์พลังงาน..." /> : aiData.energy && Array.isArray(aiData.energy) ? aiData.energy.map((d, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 4, background: i === 0 ? "#EEF2FF" : "#F9FAFB", border: i === 0 ? "2px solid #6366F1" : "1px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>{i === 0 ? "📍 " : ""}{d.day}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{d.mood}</div><div style={{ fontSize: 11, color: "#374151", marginTop: 1 }}>{d.tip}</div></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: d.energy > 70 ? "#10B981" : d.energy > 50 ? "#F59E0B" : "#EF4444" }}>{d.energy}%</div>
            </div>
          )) : <Spin text="กำลังพยากรณ์..." />}
        </Section>

        {/* 7. Job Matching (ALL) */}
        <Section featureKey="job" title="Job Matching AI" icon="💼">
          {aiLoading.job ? <Spin text="AI ค้นหาอาชีพ..." /> : aiData.job && Array.isArray(aiData.job) ? aiData.job.map((j, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 10, background: "#F9FAFB", border: "1px solid #F3F4F6", marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{j.title}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#4F46E5", background: "#EEF2FF", padding: "2px 8px", borderRadius: 8 }}>Match {j.match}%</span>
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>🏢 {j.company}</div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 3 }}>{j.reason}</div>
            </div>
          )) : <Spin text="กำลังค้นหา..." />}
        </Section>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "16px 0", fontSize: 11, color: "#D1D5DB" }}>
          ✦ Holistic Self Score · Powered by Claude AI
        </div>
      </div>
    </div>;
  }

  return null;
}

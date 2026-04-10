'use client';
import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale, PointElement, LineElement, Filler,
  Tooltip, CategoryScale, LinearScale,
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';
import { calcMBTI, calcDomPlanet } from '../../lib/quiz';
import { gen7Day, genTimeline } from '../../lib/astrology';
import { MBTI_META, MBTI_MATCH, PLANS, DM } from '../../lib/constants';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, CategoryScale, LinearScale);

const DEITY = {
  'พุธ':    { icon: '⚡', name: 'พระวิษณุ',  sub: 'Guardian of Wisdom',       mantra: 'Om Namo Narayanaya' },
  'จันทร์': { icon: '🌙', name: 'พระจันทร์', sub: 'Guardian of Emotions',     mantra: 'Om Somaya Namaha' },
  'อาทิตย์':{ icon: '☀️', name: 'พระสุริยะ', sub: 'Guardian of Vitality',     mantra: 'Om Suryaya Namaha' },
  'อังคาร': { icon: '🔴', name: 'พระอัคนี',  sub: 'Guardian of Strength',     mantra: 'Om Angarakaya Namaha' },
  'พฤหัส':  { icon: '🟡', name: 'พระพิฆเนศ', sub: 'Guardian of Success',      mantra: 'Om Shri Ganeshaya Namaha' },
  'ศุกร์':  { icon: '💚', name: 'พระลักษมี', sub: 'Guardian of Abundance',    mantra: 'Om Shri Lakshmiyai Namaha' },
  'เสาร์':  { icon: '🪐', name: 'พระไภรวะ',  sub: 'Guardian of Discipline',   mantra: 'Om Shani Devaya Namaha' },
  'ราหู':   { icon: '🌑', name: 'พระกาลี',   sub: 'Guardian of Transformation',mantra: 'Om Kali Ma Namaha' },
};

const NAV = [
  { id: 'identity',   icon: '✦',  th: 'ตัวตน',        en: 'Identity'  },
  { id: 'matrix',     icon: '🕸️', th: '12D Matrix',   en: '12D Matrix' },
  { id: 'energy',     icon: '🌙', th: 'พลังงาน 7 วัน',en: '7-Day Energy' },
  { id: 'shadow',     icon: '🌑', th: 'Shadow',        en: 'Shadow'    },
  { id: 'love',       icon: '💕', th: 'ความรัก',       en: 'Love'      },
  { id: 'timeline',   icon: '⏳', th: 'ไทม์ไลน์',     en: 'Timeline'  },
  { id: 'career',     icon: '💼', th: 'Career',        en: 'Career'    },
  { id: 'divine',     icon: '🙏', th: 'Divine',        en: 'Divine'    },
  { id: 'succession', icon: '👑', th: 'Succession',    en: 'Succession' },
];

const radarOpts = {
  responsive: true, maintainAspectRatio: false,
  scales: {
    r: {
      min: 0, max: 10,
      ticks: { display: false },
      grid: { color: 'rgba(255,255,255,0.05)' },
      angleLines: { color: 'rgba(255,255,255,0.05)' },
      pointLabels: { color: '#64748b', font: { size: 9, weight: '600' } },
    },
  },
  plugins: { legend: { display: false } },
};

const lineOpts = {
  responsive: true, maintainAspectRatio: false,
  scales: {
    y: { min: 0, max: 100, ticks: { color: '#475569', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    x: { ticks: { color: '#475569', font: { size: 9 } }, grid: { display: false } },
  },
  plugins: { legend: { display: false } },
};

// ── Sub-components ──────────────────────────────────────────────────────────

const Spin = ({ label = 'กำลังวิเคราะห์...' }) => (
  <div className="flex items-center gap-2 py-3">
    <div className="w-4 h-4 rounded-full border-2 border-slate-700 border-t-yellow-400 animate-spin" />
    <span className="text-xs text-slate-500">{label}</span>
  </div>
);

const LockedOverlay = ({ planNeeded, onUpgrade }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.6rem] z-10"
    style={{ background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(6px)' }}>
    <span className="text-2xl mb-2">🔒</span>
    <span className="text-[10px] text-slate-400 mb-3 font-semibold">ต้องการแผน <span className="text-yellow-400">{planNeeded}</span></span>
    <button onClick={() => onUpgrade(planNeeded)}
      className="px-5 py-1.5 text-xs font-black rounded-full transition-all"
      style={{ background: 'linear-gradient(135deg,#FFD700,#F59E0B)', color: '#0f172a' }}>
      Upgrade
    </button>
  </div>
);

const Panel = ({ id, icon, title, badge, locked, planNeeded, onUpgrade, children }) => (
  <section id={'dash-' + id} className="glass-panel p-5 mb-4 relative" style={{ scrollMarginTop: 20 }}>
    <div className="flex items-center gap-2 mb-4">
      <span>{icon}</span>
      <h2 className="text-sm font-bold text-white flex-1">{title}</h2>
      {badge && <span className={`plan-badge badge-${badge}`}>{badge}</span>}
    </div>
    {locked
      ? <div className="relative min-h-[80px]">
          <div className="blur-sm pointer-events-none select-none opacity-40">{children}</div>
          <LockedOverlay planNeeded={planNeeded} onUpgrade={onUpgrade} />
        </div>
      : children}
  </section>
);

// ── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard({
  nick, bday, scores, vedic, ai, aiL, plan, lang, t,
  has, tryUpgrade, setSc, user, logged, toggleLang, doLogout,
}) {
  const [activeNav, setActiveNav] = useState('identity');
  const en = lang === 'en';

  const mbti       = useMemo(() => scores ? calcMBTI(scores) : 'ENTJ', [scores]);
  const mbtiMeta   = MBTI_META[mbti] || { title: mbti, th: mbti };
  const domPlanet  = useMemo(() => calcDomPlanet(scores || {}), [scores]);
  const deity      = DEITY[domPlanet.planet] || DEITY['พฤหัส'];
  const mbtiMatch  = MBTI_MATCH[mbti] || {};
  const planData   = PLANS[plan] || PLANS['free'];

  const days7 = useMemo(() => {
    if (!bday || bday === '--') return [];
    try { return gen7Day(bday, lang); } catch { return []; }
  }, [bday, lang]);

  const tlMonths = useMemo(() => {
    if (!bday || bday === '--') return [];
    try { return genTimeline(bday, new Date().getFullYear() + 543, lang); } catch { return []; }
  }, [bday, lang]);

  const energyToday = days7[0]?.ce ?? 65;

  const radarData = useMemo(() => {
    if (!scores) return null;
    const keys = Object.keys(scores);
    return {
      labels: keys.map(k => k.replace(' ', '\n')),
      datasets: [{
        data: keys.map(k => scores[k]),
        backgroundColor: 'rgba(129,140,248,0.15)',
        borderColor: '#818cf8',
        borderWidth: 2,
        pointBackgroundColor: keys.map(k =>
          scores[k] >= 7 ? '#10b981' : scores[k] >= 5 ? '#818cf8' : '#f43f5e'
        ),
        pointRadius: 4,
      }],
    };
  }, [scores]);

  const lineData = useMemo(() => {
    if (!tlMonths.length) return null;
    return {
      labels: tlMonths.map(m => m.monthShort || ''),
      datasets: [{
        data: tlMonths.map(m => m.energy),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129,140,248,0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: tlMonths.map(m =>
          m.type === 'golden' ? '#FFD700' : m.type === 'danger' ? '#f43f5e' : '#818cf8'
        ),
        pointRadius: 5,
        pointHoverRadius: 7,
      }],
    };
  }, [tlMonths]);

  const scrollTo = id => {
    setActiveNav(id);
    document.getElementById('dash-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#020617', fontFamily: "'Plus Jakarta Sans','Anuphan',sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="fixed top-0 left-0 h-full w-[210px] z-50 hidden lg:flex flex-col"
        style={{ background: 'rgba(10,14,30,0.97)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Brand */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: 'linear-gradient(135deg,#FFD700,#F59E0B)' }}>✦</div>
            <span className="text-[10px] font-black tracking-widest text-yellow-400">HSS DASHBOARD</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
          {NAV.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={`nav-item w-full text-left ${activeNav === item.id ? 'active' : ''}`}>
              <span className="text-base">{item.icon}</span>
              <span>{en ? item.en : item.th}</span>
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg,#818cf8,#6366f1)' }}>
              {(nick || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{nick || 'Guest'}</div>
              <div className="text-[9px] text-slate-500">{mbti} · {domPlanet.icon}{domPlanet.en}</div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={toggleLang}
              className="flex-1 text-[9px] font-bold py-1 rounded-lg border border-white/10 text-slate-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-colors">
              {lang === 'th' ? 'EN' : 'TH'}
            </button>
            {logged
              ? <button onClick={doLogout}
                  className="flex-1 text-[9px] font-bold py-1 rounded-lg border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-400/30 transition-colors">
                  Logout
                </button>
              : <button onClick={() => setSc('landing')}
                  className="flex-1 text-[9px] font-bold py-1 rounded-lg border border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-400/30 transition-colors">
                  Home
                </button>
            }
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="lg:ml-[210px] px-4 py-5 pb-16 max-w-2xl mx-auto lg:mx-0 lg:max-w-[760px] lg:px-6">

        {/* Mobile top bar */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="text-xs font-black text-yellow-400 tracking-widest">✦ HSS</span>
          <div className="flex gap-2">
            <button onClick={toggleLang} className="text-[10px] px-2 py-1 rounded border border-white/10 text-slate-400">{lang === 'th' ? 'EN' : 'TH'}</button>
            <button onClick={() => setSc('landing')} className="text-[10px] px-2 py-1 rounded border border-white/10 text-slate-400">←</button>
          </div>
        </div>

        {/* ── IDENTITY ─────────────────────────────────────────────────── */}
        <section id="dash-identity" className="glass-panel p-5 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">Holistic Self Score</div>
              <h1 className="text-lg font-black text-white leading-tight mb-2 divine-glow">
                {ai.identity?.powerTitle || (en ? 'Your Cosmic Identity' : 'ตัวตนแห่งจักรวาล')}
              </h1>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(129,140,248,0.15)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.25)' }}>
                  {mbti} · {en ? mbtiMeta.title : mbtiMeta.th}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}>
                  {domPlanet.icon} {en ? domPlanet.en : domPlanet.planet}
                </span>
                <span className={`plan-badge badge-${plan === 'pro' ? 'pro' : plan === 'smart' ? 'smart' : plan === 'quick' ? 'quick' : 'quick'}`}>
                  {planData.name}
                </span>
              </div>
            </div>
            {/* Energy ring */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3.5" strokeLinecap="round"
                    stroke={energyToday >= 70 ? '#10b981' : energyToday >= 50 ? '#818cf8' : '#f43f5e'}
                    strokeDasharray={`${energyToday * 87.96 / 100} 87.96`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black"
                    style={{ color: energyToday >= 70 ? '#10b981' : energyToday >= 50 ? '#818cf8' : '#f43f5e' }}>
                    {energyToday}%
                  </span>
                </div>
              </div>
              <div className="text-[9px] text-slate-600 mt-0.5">{en ? 'Today' : 'วันนี้'}</div>
            </div>
          </div>

          {/* WHO / WHAT / WHEN */}
          {ai.identity?.who && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { key: 'WHO', text: ai.identity.who.mbtiCore, sub: ai.identity.who.vedicSoul, color: '#818cf8', bg: 'rgba(129,140,248,0.08)' },
                { key: 'WHAT', text: ai.identity.what?.skillTitle, sub: ai.identity.what?.marketValue, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                { key: 'WHEN', text: ai.identity.when?.periodLabel, sub: `🪟 ${ai.identity.when?.goldenWindow || ''}`, color: '#FFD700', bg: 'rgba(255,215,0,0.06)' },
              ].map(({ key, text, sub, color, bg }) => (
                <div key={key} className="rounded-2xl p-3" style={{ background: bg, border: `1px solid ${color}22` }}>
                  <div className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color }}>{key}</div>
                  <div className="text-[10px] text-slate-200 leading-snug font-semibold">{text}</div>
                  {sub && <div className="text-[9px] text-slate-500 mt-0.5 leading-snug">{sub}</div>}
                </div>
              ))}
            </div>
          )}
          {aiL.identity && <Spin label={t('spin_identity')} />}
        </section>

        {/* ── 12D MATRIX ───────────────────────────────────────────────── */}
        <Panel id="matrix" icon="🕸️" title={en ? '12D Psycho-Cosmic Matrix' : '12D ไซโค-คอสมิก แมทริกซ์'}>
          {radarData
            ? <div className="flex justify-center"><div style={{ width: '100%', maxWidth: 320, height: 280 }}>
                <Radar data={radarData} options={radarOpts} />
              </div></div>
            : <Spin />}
        </Panel>

        {/* ── 7-DAY ENERGY ─────────────────────────────────────────────── */}
        <Panel id="energy" icon="🌙" title={en ? '7-Day Energy Forecast' : '7 วันพลังงานจักรวาล'}
          locked={!has('energy')} planNeeded="smart" onUpgrade={tryUpgrade}>
          <div className="space-y-1.5">
            {days7.length > 0 ? days7.map((d, i) => {
              const ec = d.ce >= 75 ? '#10b981' : d.ce >= 50 ? '#818cf8' : '#f43f5e';
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                  style={{ background: i === 0 ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.025)', border: `1px solid ${i === 0 ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)'}` }}>
                  {i === 0 && <span className="text-[8px] font-black text-yellow-400 uppercase tracking-wider shrink-0">TODAY</span>}
                  <span className="text-xs text-slate-300 flex-1 font-medium">{d.day}</span>
                  <span className="text-xs font-black w-10 text-right" style={{ color: ec }}>{d.ce}%</span>
                  <div className="w-16 h-1 rounded-full bg-slate-800 shrink-0">
                    <div className="h-full rounded-full" style={{ width: `${d.ce}%`, background: ec }} />
                  </div>
                </div>
              );
            }) : <Spin />}
          </div>
        </Panel>

        {/* ── SHADOW ANALYSIS ──────────────────────────────────────────── */}
        <Panel id="shadow" icon="🌑" title={en ? 'Deep Shadow Analysis' : 'Shadow Analysis เชิงลึก'}
          locked={!has('shadow')} planNeeded="smart" onUpgrade={tryUpgrade}>
          {aiL.shadow
            ? <Spin />
            : ai.shadow
              ? <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{ai.shadow}</p>
              : <Spin label={t('spin_wait')} />}
        </Panel>

        {/* ── LOVE & MATCH ─────────────────────────────────────────────── */}
        <Panel id="love" icon="💕" title={en ? 'Love & Compatibility' : 'ความรักและความเข้ากันได้'}
          locked={!has('love')} planNeeded="smart" onUpgrade={tryUpgrade}>
          {mbtiMatch.best && (
            <div className="mb-3">
              <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-2">
                {en ? 'Best Match' : 'คู่ที่ดีที่สุด'}
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                {(mbtiMatch.best || []).map(type => (
                  <div key={type} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                    <span className="text-xs font-black text-rose-300">{type}</span>
                    <span className="text-[9px] text-slate-500">{MBTI_META[type]?.title || ''}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                {en ? mbtiMatch.why_en : mbtiMatch.why}
              </p>
            </div>
          )}
          {aiL.love
            ? <Spin />
            : ai.love
              ? <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap mt-3">{ai.love}</p>
              : null}
        </Panel>

        {/* ── OPPORTUNITY TIMELINE ─────────────────────────────────────── */}
        <Panel id="timeline" icon="⏳" title={en ? 'Opportunity Timeline' : 'ไทม์ไลน์โอกาสชีวิต'}
          locked={!has('timeline')} planNeeded="pro" badge="pro" onUpgrade={tryUpgrade}>
          {lineData
            ? <>
                <div style={{ height: 190 }}>
                  <Line data={lineData} options={lineOpts} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { label: en ? 'Golden' : 'เดือนทอง', count: tlMonths.filter(m => m.type === 'golden').length, c: '#FFD700' },
                    { label: en ? 'Caution' : 'ระวัง',   count: tlMonths.filter(m => m.type === 'danger').length, c: '#f43f5e' },
                    { label: en ? 'Stable' : 'มั่นคง',   count: tlMonths.filter(m => m.type === 'good').length,   c: '#10b981' },
                  ].map(s => (
                    <div key={s.label} className="text-center py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="text-lg font-black" style={{ color: s.c }}>{s.count}</div>
                      <div className="text-[9px] text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </>
            : <Spin />}
        </Panel>

        {/* ── CAREER PATH ──────────────────────────────────────────────── */}
        <Panel id="career" icon="💼" title="Career Path AI"
          locked={!has('job')} planNeeded="pro" badge="pro" onUpgrade={tryUpgrade}>
          {aiL.job
            ? <Spin />
            : Array.isArray(ai.job) && ai.job.length > 0
              ? <div className="space-y-2">
                  {ai.job.slice(0, 3).map((j, i) => (
                    <div key={i} className="rounded-xl p-4"
                      style={{ background: i === 0 ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i === 0 ? 'rgba(255,215,0,0.18)' : 'rgba(255,255,255,0.06)'}` }}>
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          {i === 0 && <div className="text-[8px] font-black text-yellow-400 uppercase tracking-widest mb-1">TOP MATCH</div>}
                          <div className="text-sm font-bold text-white">{j.titleTH || j.title}</div>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 rounded-lg shrink-0"
                          style={{ color: j.match >= 80 ? '#10b981' : '#818cf8', background: j.match >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(129,140,248,0.1)' }}>
                          {j.match}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{j.reason}</p>
                    </div>
                  ))}
                </div>
              : <Spin label={t('spin_wait')} />}
        </Panel>

        {/* ── DIVINE LAYER ─────────────────────────────────────────────── */}
        <Panel id="divine" icon="🙏" title={en ? 'Divine Layer — Your Guardian' : 'Divine Layer — เทพผู้พิทักษ์'}>
          <div className="flex items-center gap-5 mb-4">
            <div className="text-5xl">{deity.icon}</div>
            <div>
              <div className="text-lg font-black text-yellow-400 divine-glow">{deity.name}</div>
              <div className="text-xs text-slate-500 mb-2">{deity.sub}</div>
              <div className="text-[9px] font-mono px-3 py-1 rounded-lg inline-block"
                style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', color: '#FFD700' }}>
                {deity.mantra}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed p-3 rounded-xl"
            style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.08)' }}>
            {en
              ? `Your dominant planet is ${domPlanet.en} (${domPlanet.planet}). ${domPlanet.power}`
              : `ดาวหลักของคุณคือ ${domPlanet.planet} (${domPlanet.en}) — ${domPlanet.power}`}
          </div>
        </Panel>

        {/* ── SUCCESSION / MBTI MATCH ──────────────────────────────────── */}
        <Panel id="succession" icon="👑" title={en ? 'Strategic Succession' : 'Strategic Succession'}
          locked={!has('mbti')} planNeeded="smart" onUpgrade={tryUpgrade}>
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl mb-2"
              style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)' }}>
              <span className="text-2xl font-black text-indigo-300">{mbti}</span>
            </div>
            <div className="text-xs text-slate-400">{en ? mbtiMeta.title : mbtiMeta.th}</div>
          </div>
          {mbtiMatch.good && (
            <div>
              <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                {en ? 'Strategic Allies' : 'พันธมิตรเชิงกลยุทธ์'}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(mbtiMatch.good || []).map(type => (
                  <span key={type} className="px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#a5b4fc' }}>
                    {type} · {en ? MBTI_META[type]?.title || type : MBTI_META[type]?.th || type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Panel>

        {/* Upgrade banner for free/quick */}
        {(plan === 'free' || plan === 'quick') && (
          <div className="glass-panel p-4 mb-4 pro-glow">
            <div className="text-xs font-black text-yellow-400 mb-2">{t('res_unlock_title') || '🌟 Unlock Full Analysis'}</div>
            <div className="flex gap-2">
              {plan === 'free' && (
                <button onClick={() => tryUpgrade('quick')}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors"
                  style={{ border: '1px solid rgba(245,158,11,0.4)', color: '#F59E0B', background: 'rgba(245,158,11,0.05)' }}>
                  Quick ฿49
                </button>
              )}
              <button onClick={() => tryUpgrade('smart')}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                Smart ฿99
              </button>
              <button onClick={() => tryUpgrade('pro')}
                className="flex-1 py-2 rounded-xl text-xs font-black"
                style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.15),rgba(245,158,11,0.15))', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>
                Pro ฿259 ⭐
              </button>
            </div>
          </div>
        )}

        <div className="text-center py-6">
          <button onClick={() => setSc('landing')}
            className="text-xs text-slate-700 hover:text-slate-500 transition-colors">
            ← {en ? 'Back to Home' : 'กลับหน้าหลัก'}
          </button>
        </div>

      </main>
    </div>
  );
}

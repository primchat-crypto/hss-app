// Astrology calculation functions — extracted from app/page.js
import{NAKSHATRA,DAY_LORD,DAY_LORD_EN_NAME,DAY_LORD_EN_GF,TL_RASHI_EN,DASHA_SEQ,TL_HEADLINE_EN,TL_TAG_EN}from"./constants.js";
import{starsFromEnergy,starLabel,starLabelEN}from"./quiz.js";

export const natalPStr=(bd)=>{const m=parseInt(bd?.split("-")?.[1])||6;const d=parseInt(bd?.split("-")?.[2])||15;const s=(m*31+d)%100;return{su:Math.min(10,(22+((s*7)%18))/4),mo:Math.min(10,(18+((s*3)%22))/4),ma:Math.min(10,(19+((s*11)%21))/4),me:Math.min(10,(20+(s%20))/4),ju:Math.min(10,(21+((s*13)%19))/4),ve:Math.min(10,(20+((s*5)%20))/4),sa:Math.min(10,(17+((s*17)%23))/4)}};
export const dlCompat=(dow,ns)=>{const dl=DAY_LORD[dow];const str=ns[dl.planet]||5;let q,mod;if(str>=8){q=dl.lord+"หนุนเต็มที่";mod=15}else if(str>=6){q=dl.lord+"ส่งพลังดี";mod=8}else if(str>=4){q=dl.lord+"ปกติ";mod=0}else{q=dl.lord+"ท้าทาย";mod=-10}return{...dl,str,q,mod}};
export const moonTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const days=(date-ref)/864e5;const frac=((days/27.3217%1)+1)%1;return Math.floor((frac*12+5)%12)};
export const marsTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const days=(date-ref)/864e5;return Math.floor(((days/686.97%1)*12+7)%12)};
export const satTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");return Math.floor(((date-ref)/864e5/10766*12+10)%12)};
export const venusTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const m=(date-ref)/864e5/30.4375;return Math.floor(((m*1.05+1)%12+12)%12)};
export const jupTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const m=(date-ref)/864e5/30.4375;return Math.floor(((m*0.083+0)%12+12)%12)};
export const natalMoon=(bd)=>{if(!bd||bd==="--")return 0;const d=new Date(bd+"T12:00:00Z");return isNaN(d.getTime())?0:moonTr(d)};
export const getNak=(ri,di)=>NAKSHATRA[(ri*2+(di%3))%27];
export const trAspect=(tr,nr)=>{const d=((tr-nr)%12+12)%12;if(d===0)return{r:"ร่วม",q:"กลาง",m:0};if(d===4||d===8)return{r:"ตรีโกณ",q:"ดีมาก",m:15};if(d===3||d===9)return{r:"จตุโกณ",q:"กดดัน",m:-15};if(d===6)return{r:"ตรงข้าม",q:"ตึง",m:-10};if(d===5)return{r:"ตรีโกณรอง",q:"ดี",m:10};return{r:"ปกติ",q:"กลาง",m:0}};
export const marsD=(r)=>{if(r===0||r===7)return{d:"เกษตร",m:10};if(r===9)return{d:"อุจจ์",m:15};if(r===3)return{d:"นิจ",m:-15};return{d:"ปกติ",m:0}};


export const gen7Day=(bd,lang="th")=>{
  const nm=natalMoon(bd);const ns=natalPStr(bd);const today=new Date();const days=[];
  for(let i=0;i<7;i++){
    const dt=new Date(today);dt.setDate(dt.getDate()+i);
    const mr=moonTr(dt);const mar=marsTr(dt);const sat=satTr(dt);
    const ve=venusTr(dt);const ju=jupTr(dt);
    const ma=trAspect(mr,nm);const md=marsD(mar);const dl=dlCompat(dt.getDay(),ns);
    const moonE=Math.max(30,Math.min(95,65+ma.m));const marsE=Math.max(30,Math.min(95,65+md.m));const dlE=Math.max(30,Math.min(95,65+dl.mod));
    const ce=Math.round(moonE*.4+marsE*.25+dlE*.35);
    // Domain analysis
    const satMarConj=sat===mar; // เสาร์-อังคารร่วมราศี = กาลกินี
    const venDig=planetDignity('ve',ve);const moonDig7=planetDignity('mo',mr);const marsDig7=planetDignity('ma',mar);
    const juAsp7=thaiAspect(ju,nm);const satAsp7=thaiAspect(sat,nm);
    const dow=dt.getDay();
    // Work: เจ้าวัน + พฤหัส
    const en=lang==="en";
    const dlNameEN=DAY_LORD_EN_NAME[dow];const dlGfEN=DAY_LORD_EN_GF[dow];
    const workTxt=en?(
      satMarConj?'⚠️ Saturn-Mars conjunction (Kalaakini) — Avoid workplace conflicts, don\'t make major decisions':
      juAsp7.score>=15?`Jupiter ${juAsp7.q} — Good career opportunity, ideal for pitching & Networking · ${dlGfEN}`:
      dlE<50?`Day Lord ${dl.icon}${dlNameEN} weak — Avoid major decisions, focus on completing tasks`:
      `Day Lord ${dl.icon}${dlNameEN} supports — ${dlGfEN}`
    ):(
      satMarConj?'⚠️ เสาร์-อังคารร่วมราศี (กาลกินี) — ระวังความขัดแย้งในที่ทำงาน อย่าตัดสินใจใหญ่':
      juAsp7.score>=15?`พฤหัส${juAsp7.q} — โอกาสงานดี เหมาะเสนองาน Networking ${dl.gf}`:
      dlE<50?`เจ้าวัน${dl.lord}อ่อน — ระวังการตัดสินใจสำคัญ เน้นทำงานให้เสร็จ`:
      `เจ้าวัน${dl.icon}${dl.lord}หนุน — ${dl.gf}`
    );
    // Money: ศุกร์ + จันทร์
    const moneyTxt=en?(
      venDig.d==='นิจ'?'Venus debilitated — Avoid overspending, avoid large investments or expensive purchases':
      moonDig7.d==='นิจ'?'Moon debilitated — Tight cash flow, watch for unexpected expenses, save money now':
      venDig.d==='อุจจ์'?'Venus exalted — Financial luck, extra income possible, ideal for saving':
      satMarConj?'Saturn-Mars conjunction — Watch for emergency expenses, not suitable for investing':
      'Normal finances — No special luck, but no obstacles either'
    ):(
      venDig.d==='นิจ'?'ศุกร์นิจ — ระวังรายจ่ายเกินตัว หลีกเลี่ยงลงทุนใหญ่ หรือซื้อของราคาสูง':
      moonDig7.d==='นิจ'?'จันทร์นิจ — กระแสเงินสดตึง ระวังรายจ่ายไม่คาดคิด เก็บเงินไว้ก่อน':
      venDig.d==='อุจจ์'?'ศุกร์อุจจ์ — โชคด้านการเงิน รายได้เสริมเข้าได้ เหมาะออมทรัพย์':
      satMarConj?'เสาร์-อังคารร่วม — ระวังค่าใช้จ่ายฉุกเฉิน ไม่เหมาะลงทุน':
      'การเงินปกติ — ไม่มีโชคพิเศษ แต่ก็ไม่มีอุปสรรค'
    );
    // Love: ศุกร์ + จันทร์
    const loveTxt=en?(
      dow===5?'Friday — Venus rules the day, high charm, ideal for meeting someone special':
      satMarConj?'Saturn-Mars conjunction — Watch emotions, avoid arguments with loved ones, stay calm':
      venDig.d==='อุจจ์'?'Venus exalted — Love is bright, good mood, high attractiveness':
      venDig.d==='นิจ'?'Venus debilitated — Watch for misunderstandings in relationships, communicate calmly':
      ma.m>0?'Moon in good aspect — Good mood, mutual understanding, ideal for important talks':
      ma.m<0?'Moon under pressure — Possible misunderstandings, think before speaking':
      'Normal love life — Care for each other with attention'
    ):(
      dow===5?'วันศุกร์ — ดาวศุกร์ครองวัน เสน่ห์แรง เหมาะนัดพบคนสำคัญ':
      satMarConj?'เสาร์-อังคารร่วม — ระวังอารมณ์ ควรหลีกเลี่ยงทะเลาะกับคนรัก ใจเย็นๆ':
      venDig.d==='อุจจ์'?'ศุกร์อุจจ์ — ความรักสดใส อารมณ์ดี เสน่ห์ดึงดูดสูง':
      venDig.d==='นิจ'?'ศุกร์นิจ — ระวังความเข้าใจผิดในความสัมพันธ์ สื่อสารด้วยความใจเย็น':
      ma.m>0?'จันทร์มุมดี — อารมณ์ดี เข้าใจกัน เหมาะคุยเรื่องสำคัญ':
      ma.m<0?'จันทร์กดดัน — อาจมีความเข้าใจผิด ให้เวลาคิดก่อนพูด':
      'ความรักปกติ — ดูแลกันด้วยความใส่ใจ'
    );
    // Health: อังคาร + เสาร์
    const healthTxt=en?(
      satMarConj?'⚠️ Kalaakini — Saturn-Mars conjunction, watch for accidents, drive carefully, avoid risky activities':
      marsDig7.d==='นิจ'?'Mars debilitated — Low physical energy, avoid intense exercise, rest fully':
      marsDig7.d==='อุจจ์'?'Mars exalted — Excellent physical energy, ideal for intense exercise, start new fitness program':
      satAsp7.score<0?'Saturn under pressure — Easily fatigued, take care of health with adequate rest':
      'Good health — Exercise regularly, get enough rest'
    ):(
      satMarConj?'⚠️ กาลกินี — เสาร์-อังคารร่วมราศี ระวังอุบัติเหตุ ขับรถระมัดระวัง งดกิจกรรมเสี่ยง':
      marsDig7.d==='นิจ'?'อังคารนิจ — พลังกายต่ำ งดออกกำลังกายหนัก พักผ่อนให้เต็มที่':
      marsDig7.d==='อุจจ์'?'อังคารอุจจ์ — พลังกายดีเยี่ยม เหมาะออกกำลังกายหนัก เริ่มโปรแกรมใหม่':
      satAsp7.score<0?'เสาร์กดดัน — เหนื่อยง่าย ดูแลสุขภาพด้วยการพักผ่อนให้พอ':
      'สุขภาพดี — ออกกำลังกายสม่ำเสมอ พักผ่อนเพียงพอ'
    );
    // Featured topic (most notable deviation)
    const domScores={work:dlE+(juAsp7.score>0?15:0)+(satMarConj?-20:0),money:65+(venDig.d==='อุจจ์'?15:venDig.d==='นิจ'?-12:0)+(moonDig7.d==='นิจ'?-10:0),love:65+(dow===5?15:0)+(venDig.d==='อุจจ์'?10:venDig.d==='นิจ'?-10:0)+(ma.m>0?5:0),health:65+(marsDig7.d==='อุจจ์'?15:marsDig7.d==='นิจ'?-12:0)+(satMarConj?-20:0)+(satAsp7.score<0?-10:0)};
    const [featuredKey]=Object.entries(domScores).sort((a,b)=>Math.abs(b[1]-65)-Math.abs(a[1]-65))[0];
    const featuredLabel=en?{work:'💼 Work',money:'💰 Money',love:'❤️ Love',health:'🏃 Health'}[featuredKey]:{work:'💼 งาน',money:'💰 เงิน',love:'❤️ ความรัก',health:'🏃 สุขภาพ'}[featuredKey];
    const featuredGood=domScores[featuredKey]>65;
    // Special event
    const specialEvent=en?(
      satMarConj?{type:'danger',text:'⚠️ Kalaakini — Saturn-Mars conjunction. Beware of accidents & conflicts. Avoid major decisions, signing contracts, or long travel'}:
      venDig.d==='อุจจ์'&&dow===5?{type:'good',text:'✨ Venus exalted on Friday — Most auspicious day. Ideal for meetings, negotiations, love, and finances'}:
      juAsp7.score>=15?{type:'good',text:`📚 Jupiter ${juAsp7.q} — Today ideal for long-term planning, consulting experts, or seeking important advice`}:
      null
    ):(
      satMarConj?{type:'danger',text:'⚠️ กาลกินี — เสาร์อังคารร่วมราศี วันนี้ควรระวังอุบัติเหตุ ความขัดแย้ง ไม่ควรตัดสินใจสำคัญ ลงนามสัญญา หรือเดินทางไกล'}:
      venDig.d==='อุจจ์'&&dow===5?{type:'good',text:'✨ ศุกร์อุจจ์ในวันศุกร์ — วันมงคลที่สุด เหมาะนัดพบ เจรจา ความรัก และการเงิน'}:
      juAsp7.score>=15?{type:'good',text:`📚 พฤหัส${juAsp7.q} — วันนี้เหมาะวางแผนระยะยาว ปรึกษาผู้รู้ หรือขอคำแนะนำเรื่องสำคัญ`}:
      null
    );
    const dnLabel=en?DAYNAME_EN[dt.getDay()]:DAYNAME[dt.getDay()];
    days.push({date:`${dt.getDate()}/${dt.getMonth()+1}`,dn:dnLabel,moonR:RASHI[mr],moonREN:TL_RASHI_EN[mr],marsR:RASHI[mar],satR:RASHI[sat],veR:RASHI[ve],juR:RASHI[ju],ma,md,nmR:RASHI[nm],dl,dlNameEN,dlGfEN,ce,work:workTxt,money:moneyTxt,love:loveTxt,health:healthTxt,featuredLabel,featuredGood,specialEvent,satMarConj});
  }
  return days;
};

// Vedic Dasha System — Life Phase Map

export const calcDasha=(bd)=>{if(!bd||bd==="--"||bd==="undefined"||bd.length<8)return[];const bp=bd.split("-");if(!bp||bp.length<3)return[];const by=parseInt(bp[0]);const bm=parseInt(bp[1]);const bdNum=parseInt(bp[2]);if(!by||!bm||!bdNum||isNaN(by)||isNaN(bm)||isNaN(bdNum))return[];const testDate=new Date(`${by}-${String(bm).padStart(2,"0")}-${String(bdNum).padStart(2,"0")}T12:00:00Z`);if(isNaN(testDate.getTime()))return[];const nm=natalMoon(bd);const nakI=((nm*2+(bdNum%3))%27+27)%27;const startI=((Math.floor(nakI/3))%9+9)%9;const phases=[];let age=0;for(let c=0;c<18;c++){const di=(startI+c)%9;const d=DASHA_SEQ[di];const startAge=age;const endAge=age+d.y;const startYear=by+startAge;const endYear=by+endAge;const now=new Date().getFullYear();const isCurrent=now>=startYear&&now<endYear;const isPast=now>=endYear;phases.push({...d,startAge,endAge,startYear,endYear,isCurrent,isPast});age+=d.y;if(age>100)break}return phases};

export const calcAntardasha=(mahadasha,startYear)=>{if(!mahadasha)return[];const mdI=DASHA_SEQ.findIndex(d=>d.p===mahadasha.p);if(mdI<0)return[];const now=new Date();const nowFrac=now.getFullYear()+(now.getMonth())/12;const ads=[];let cur=startYear;for(let i=0;i<9;i++){const adI=(mdI+i)%9;const ad=DASHA_SEQ[adI];const dur=(mahadasha.y*ad.y)/120;const end=cur+dur;const isCurrent=nowFrac>=cur&&nowFrac<end;const isPast=nowFrac>=end;ads.push({...ad,duration:dur,startYear:cur,endYear:end,isCurrent,isPast});cur=end;}return ads;};

// Career Timeline — โหราศาสตร์ไทย (Thai Sidereal Astrology) Monthly Energy
export const TL_MONTHS_TH=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
export const TL_MONTHS_EN_SHORT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const TL_MONTHS_FULL=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
export const TL_MONTHS_EN_FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
// ราศีไทย (Sidereal / สุริยาตร์) — ใช้ระบบ Sidereal ไม่ใช่ Tropical
export const TL_RASHI_TH=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มกร','กุมภ์','มีน'];
export const TL_RASHI_LORDS=['อังคาร','ศุกร์','พุธ','จันทร์','อาทิตย์','พุธ','ศุกร์','อังคาร','พฤหัส','เสาร์','เสาร์','พฤหัส'];
export const TL_RASHI_ICONS=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
// โหราศาสตร์ไทย: ราศีเกิดจาก Sidereal Sun (ลบ ayanamsa ~24°)
export const bdayToRashiThai=(bd)=>{if(!bd||bd==="--"||bd.length<8)return 0;const p=bd.split("-");const m=parseInt(p[1]);const d=parseInt(p[2]);
  // Sidereal Sun sign (Thai system, ~24° offset from Tropical)
  if((m===4&&d>=14)||(m===5&&d<=14))return 0; // เมษ
  if((m===5&&d>=15)||(m===6&&d<=14))return 1; // พฤษภ
  if((m===6&&d>=15)||(m===7&&d<=15))return 2; // มิถุน
  if((m===7&&d>=16)||(m===8&&d<=16))return 3; // กรกฎ
  if((m===8&&d>=17)||(m===9&&d<=16))return 4; // สิงห์
  if((m===9&&d>=17)||(m===10&&d<=16))return 5; // กันย์
  if((m===10&&d>=17)||(m===11&&d<=15))return 6; // ตุลย์
  if((m===11&&d>=16)||(m===12&&d<=15))return 7; // พิจิก
  if((m===12&&d>=16)||(m===1&&d<=13))return 8; // ธนู
  if((m===1&&d>=14)||(m===2&&d<=12))return 9; // มกร
  if((m===2&&d>=13)||(m===3&&d<=13))return 10; // กุมภ์
  return 11; // มีน
};
// ดาวเคราะห์จร: คำนวณตำแหน่งดาวจรรายเดือน (Simplified Thai transit)
export const TL_PLANET_DATA={
  su:{name:'อาทิตย์',emoji:'☀️',speed:1}, // 1 ราศี/เดือน
  mo:{name:'จันทร์',emoji:'🌙',speed:12}, // ~12 ราศี/เดือน (fast)
  ma:{name:'อังคาร',emoji:'🔴',speed:0.53}, // ~0.53 ราศี/เดือน
  me:{name:'พุธ',emoji:'⚡',speed:1.1}, // ~1.1 ราศี/เดือน
  ju:{name:'พฤหัส',emoji:'🟡',speed:0.083}, // ~1 ราศี/ปี
  ve:{name:'ศุกร์',emoji:'💚',speed:1.05}, // ~1.05 ราศี/เดือน
  sa:{name:'เสาร์',emoji:'🪐',speed:0.034}, // ~2.5 ปี/ราศี
  ra:{name:'ราหู',emoji:'🐉',speed:-0.056} // ถอยหลัง ~1.5 ปี/ราศี
};
// มุมดาวไทย: ตรีโกณ(5,9) ดีมาก, จตุโกณ(4,8,12) กดดัน, ร่วม(1) ดี, ตรงข้าม(7) ตึง
export const thaiAspect=(trRashi,natalRashi)=>{const d=((trRashi-natalRashi)%12+12)%12;
  if(d===0)return{q:'ร่วมราศี',score:8,desc:'ดาวมาร่วม ส่งพลังตรง'};
  if(d===4||d===8)return{q:'ตรีโกณ',score:15,desc:'ตรีโกณ ส่งพลังหนุนดีมาก'};
  if(d===3||d===9)return{q:'จตุโกณ',score:-12,desc:'จตุโกณ กดดัน ท้าทาย'};
  if(d===6)return{q:'ตรงข้าม',score:-8,desc:'ตรงข้าม ตึง ระวัง'};
  if(d===5||d===1)return{q:'สนับสนุน',score:10,desc:'มุมสนับสนุน ส่งพลังดี'};
  if(d===11)return{q:'ลาภะ',score:12,desc:'เรือนลาภะ ได้ผลตอบแทน'};
  if(d===10)return{q:'กัมมะ',score:10,desc:'เรือนกัมมะ หนุนการงาน'};
  return{q:'ปกติ',score:0,desc:'มุมกลาง'};
};
// สภาพดาว: อุจจ์/นิจ/เกษตร
export const TL_UCCHA={su:0,mo:1,ma:9,me:5,ju:3,ve:11,sa:6}; // ราศีอุจจ์
export const TL_NEECHA={su:6,mo:7,ma:3,me:11,ju:9,ve:5,sa:0}; // ราศีนิจ
export const planetDignity=(planet,rashi)=>{
  if(rashi===TL_UCCHA[planet])return{d:'อุจจ์',score:15,desc:'ดาวอุจจ์ — กำลังสูงสุด'};
  if(rashi===TL_NEECHA[planet])return{d:'นิจ',score:-12,desc:'ดาวนิจ — กำลังอ่อน'};
  const lord=TL_RASHI_LORDS[rashi];const pName=TL_PLANET_DATA[planet]?.name;
  if(lord===pName)return{d:'เกษตร',score:10,desc:'ดาวเกษตร — อยู่บ้านตัวเอง'};
  return{d:'ปกติ',score:0,desc:'สภาพปกติ'};
};
// Hybrid Engine: Vedic Dasha × Thai Transit — "Realistic Life Score"
// Map Dasha planet names (Thai) to planet keys
export const DASHA_PLANET_KEY={'เกตุ':'ra','ศุกร์':'ve','อาทิตย์':'su','จันทร์':'mo','อังคาร':'ma','ราหู':'ra','พฤหัส':'ju','เสาร์':'sa','พุธ':'me'};
// House from Ascendant: planet rashi relative to natal lagna
export const houseFrom=(planetR,lagna)=>((planetR-lagna)%12+12)%12+1; // 1-12


export const genTimeline=(bd,year,lang="th")=>{
  const natalR=bdayToRashiThai(bd); // Ascendant (ลัคนา) = sidereal sun sign
  const ns=natalPStr(bd);
  const ceYear=(year||new Date().getFullYear()+543)-543;
  const baseDate=new Date(ceYear,0,15);
  const epoch=new Date(2025,0,1);const epochMonths=(baseDate-epoch)/(30.4375*86400000);
  const baseTr={su:9,mo:1,ma:2,me:10,ju:1,ve:11,sa:10,ra:11};

  // Get current Mahadasha from Vedic Dasha system
  const dashas=calcDasha(bd);
  const currentDasha=dashas.find(d=>d.isCurrent)||dashas[0]||{p:'พฤหัส',icon:'📚',theme:'การเติบโต'};
  const dashaPlanetKey=DASHA_PLANET_KEY[currentDasha.p]||'ju';

  return Array.from({length:12},(_,mi)=>{
    const mOff=epochMonths+mi;
    // 1. Calculate transit positions for all planets this month
    const tr={};
    Object.entries(TL_PLANET_DATA).forEach(([p,data])=>{
      tr[p]=((baseTr[p]+Math.round(data.speed*mOff))%12+12)%12;
    });

    // House positions relative to Ascendant (ลัคนา)
    const h={};
    Object.keys(tr).forEach(p=>{h[p]=houseFrom(tr[p],natalR)});

    // ─── ALGORITHM: Hybrid Dasha × Transit Scoring ───

    // Step 1: Baseline = 50
    let energy=50;
    let dashaScore=0;
    let transitScore=0;

    // Step 2: Dasha Impact (long-term potential)
    const dashaDig=planetDignity(dashaPlanetKey,tr[dashaPlanetKey]||0);
    if(dashaDig.d==='อุจจ์'||dashaDig.d==='เกษตร')dashaScore+=20; // มหาอุจจ์/เกษตร: +20
    else if(dashaDig.d==='นิจ')dashaScore-=20; // นิจ/ประ: -20
    // Dasha planet in เรือน 6, 8, 12 (dusthana) = -15
    const dashaHouse=h[dashaPlanetKey]||1;
    if(dashaHouse===6||dashaHouse===8||dashaHouse===12)dashaScore-=15;

    // Step 3: Transit Impact (monthly flow)
    // Jupiter (๕) good aspect to Ascendant: +10
    const juAspH1=thaiAspect(tr.ju,natalR);
    if(juAspH1.score>0)transitScore+=10;

    // Saturn (๗) hitting Ascendant (ทับลัคน์ = house 1): -15
    if(h.sa===1)transitScore-=15;
    // Rahu (๘) hitting Ascendant: -15
    if(h.ra===1)transitScore-=15;
    // Mars (๓) hitting Ascendant: -15
    if(h.ma===1)transitScore-=15;

    // Saturn/Rahu/Mars in dusthana (6,8,12) from Ascendant: additional stress
    [h.sa,h.ra,h.ma].forEach(hp=>{if(hp===8||hp===12)transitScore-=5});

    // Moon debilitated (นิจ) this month: -10 (poor cashflow / emotional)
    const moonDig=planetDignity('mo',tr.mo);
    if(moonDig.d==='นิจ')transitScore-=10;

    // Jupiter in good aspect to เรือนกัมมะ (H10): +8
    const h10=(natalR+9)%12;
    const juAspH10=thaiAspect(tr.ju,h10);
    if(juAspH10.score>0)transitScore+=8;

    // Sun dignity bonus
    const suDig=planetDignity('su',tr.su);
    if(suDig.d==='อุจจ์'||suDig.d==='เกษตร')transitScore+=5;

    // Apply scores
    energy+=dashaScore+transitScore;
    energy=Math.max(5,Math.min(100,Math.round(energy)));

    // Step 4: Balance Content — Dasha vs Transit narrative
    const dashaHigh=dashaScore>=10;
    const dashaLow=dashaScore<=-10;
    const transitHigh=transitScore>=5;
    const transitLow=transitScore<=-10;

    let balanceType='balanced';
    let balanceText='';
    const tlen=lang==="en";
    if(dashaHigh&&transitLow){balanceType='potential_blocked';balanceText=tlen?'High potential but heavy obstacles — Success is certain, but requires extra effort. Watch expenses and health':'ศักยภาพสูงแต่อุปสรรคหนัก — สำเร็จได้แน่นอน แต่ต้องใช้พลังมาก ระวังเรื่องค่าใช้จ่ายและสุขภาพ';}
    else if(dashaLow&&transitHigh){balanceType='temp_peak';balanceText=tlen?'Small luck coming in, but avoid big investments — this is a temporary peak, save money first':'โชคดีเล็กๆ น้อยๆ เข้ามา แต่อย่าลงทุนใหญ่ เพราะเป็นช่วงพีคชั่วคราว เก็บเงินไว้ก่อน';}
    else if(dashaHigh&&transitHigh){balanceType='golden';balanceText=tlen?'Both natal chart and transits align — this is truly a golden opportunity':'ทั้งพื้นดวงและดาวจรหนุนพร้อมกัน — ช่วงนี้คือโอกาสทองจริงๆ';}
    else if(dashaLow&&transitLow){balanceType='rest';balanceText=tlen?'Both natal chart and transits are heavy — your body and mind need rest, don\'t push it':'ช่วงนี้ทั้งพื้นดวงและดาวจรกดดัน — ร่างกายและจิตใจบอกให้พัก อย่าฝืน';}

    // Determine type
    let type,icon,headline;
    const stars=energy>=80?5:energy>=65?4:energy>=50?3:energy>=35?2:1;
    if(stars===5){type='golden';icon='🌟';headline=tlen?'Golden Month of Opportunity':'เดือนทองแห่งโอกาส';}
    else if(stars===4){type='good';icon='😊';headline=tlen?'Good Month — Build Momentum':'พลังงานดี — เดินหน้า';}
    else if(stars<=1){type='danger';icon='⚠️';headline=tlen?'Heavy Pressure — Rest & Recover':'ดาวกดทับหนัก — พักฟื้น';}
    else if(stars===2){type='danger';icon='⚠️';headline=tlen?'Caution — Obstacles Ahead':'ระวัง — อุปสรรคเข้ามา';}
    else if(balanceType==='temp_peak'){type='side';icon='💼';headline=tlen?'Small Luck — Avoid Big Investments':'โชคเล็กๆ เข้ามา — อย่าลงทุนใหญ่';}
    else{type='neutral';icon='😐';headline=tlen?'Planning Month — Steady Pace':'เดือนวางแผน — สะสมพลัง';}

    // Dominant planet
    const allAsp=[
      {p:'ju',asp:juAspH10,dig:planetDignity('ju',tr.ju)},
      {p:'sa',asp:thaiAspect(tr.sa,h10),dig:planetDignity('sa',tr.sa)},
      {p:'su',asp:thaiAspect(tr.su,h10)},
      {p:'ma',asp:thaiAspect(tr.ma,natalR)}
    ];
    const dominant=allAsp.sort((a,b)=>Math.abs(b.asp.score)-Math.abs(a.asp.score))[0];
    const domP=TL_PLANET_DATA[dominant.p];

    // Golden/Black days
    const goldenDays=[];const blackDays=[];
    const daysInMonth=[31,ceYear%4===0?29:28,31,30,31,30,31,31,30,31,30,31][mi];
    const domPName=tlen?(PLANET_EN[dominant.p]||domP.name):domP.name;
    for(let day=1;day<=daysInMonth&&goldenDays.length<4;day++){
      const dt=new Date(ceYear,mi,day);const dow=dt.getDay();
      const dl=DAY_LORD[dow];const dlStr=ns[dl.planet]||5;
      if(dlStr>=6.5&&energy>=40&&(day%7===3||day%8===5||day%9===2)){
        const actions=tlen?['Schedule Interview / Pitch Work','Sign contracts','Present / Important meeting','Start new job','Networking','Portfolio presentation']:['นัดสัมภาษณ์ / เสนองาน','เซ็นสัญญาได้','พรีเซนต์ / ประชุมสำคัญ','เริ่มงานใหม่','Networking','นำเสนอ Portfolio'];
        const dlLord=tlen?DAY_LORD_EN_NAME[dow]:dl.lord;
        goldenDays.push({day,action:actions[goldenDays.length%actions.length],reason:tlen?`Day Lord ${dl.icon}${dlLord} supports (strength ${dlStr.toFixed(1)}) + ${domP.emoji}${domPName}`:`เจ้าวัน${dl.icon}${dl.lord}หนุน (กำลัง${dlStr.toFixed(1)}) + ${domP.emoji}${domP.name}`});
      }
    }
    for(let day=1;day<=daysInMonth&&blackDays.length<3;day++){
      const dt=new Date(ceYear,mi,day);const dow=dt.getDay();
      const dl=DAY_LORD[dow];const dlStr=ns[dl.planet]||5;
      if(dlStr<5&&(day%6===4||day%7===1||day%11===3)){
        const warns=tlen?['Avoid applications / signing contracts','Watch for unexpected expenses','Avoid arguments','Watch for misunderstandings']:['อย่ายื่นใบสมัคร / เซ็นสัญญา','ระวังค่าใช้จ่ายไม่คาดคิด','หลีกเลี่ยงการโต้เถียง','ระวังความเข้าใจผิด'];
        const dlLord=tlen?DAY_LORD_EN_NAME[dow]:dl.lord;
        const stressReason=tlen?(h.sa===1?'🪐Saturn on Ascendant':h.ra===1?'🐉Rahu on Ascendant':'Planetary pressure'):(h.sa===1?'🪐เสาร์ทับลัคน์':h.ra===1?'🐉ราหูทับลัคน์':'ดาวจรกดดัน');
        blackDays.push({day,action:warns[blackDays.length%warns.length],reason:tlen?`Day Lord ${dl.icon}${dlLord} weak + ${stressReason}`:`เจ้าวัน${dl.icon}${dl.lord}อ่อน + ${stressReason}`});
      }
    }
    if(goldenDays.length===0)goldenDays.push({day:Math.min(10,daysInMonth),action:tlen?'Complete pending tasks':'จัดการงานค้างให้เสร็จ',reason:tlen?`Small window where ${domP.emoji}${domPName} sends supporting energy`:`ช่วงเล็กๆ ที่${domP.emoji}${domP.name}ส่งพลังหนุน`});
    if(blackDays.length===0)blackDays.push({day:Math.min(17,daysInMonth),action:tlen?'Avoid overworking':'ระวังทำงานหนักเกินไป',reason:tlen?'Energy lower than usual — rest is recommended':'พลังงานลดต่ำกว่าปกติ ควรพักผ่อน'});

    // Tags
    const tags=[];
    if(type==='golden')tags.push([tlen?'Golden Month':'เดือนทอง','golden'],[tlen?'High Opportunity':'โอกาสสูง','good']);
    else if(type==='good')tags.push([tlen?'Good Energy':'พลังงานดี','good']);
    else if(type==='danger'){tags.push([tlen?'Caution':'ระวัง','danger']);if(h.sa===1||h.ra===1||h.ma===1)tags.push([tlen?'Planet on Ascendant':'ดาวทับลัคน์','danger'])}
    else if(type==='side')tags.push([tlen?'Side Income':'โชคเล็กน้อย','side']);
    else tags.push([tlen?'Moderate':'ปานกลาง','neutral']);
    if(balanceType==='potential_blocked')tags.push([tlen?'High Potential-Heavy Obstacles':'ศักยภาพสูง-อุปสรรคหนัก','neutral']);
    if(moonDig.d==='นิจ')tags.push([tlen?'Watch Cash Flow':'ระวังกระแสเงินสด','danger']);

    // Planets
    const dashaNameEN=currentDasha.p_en||currentDasha.p;
    const planets=tlen?[`${currentDasha.icon} Dasha ${dashaNameEN}`]:[`${currentDasha.icon} ทศา${currentDasha.p}`];
    planets.push(`${domP.emoji} ${tlen?(PLANET_EN[dominant.p]||domP.name):domP.name} (${tlen?TL_RASHI_EN[tr[dominant.p]]:TL_RASHI_TH[tr[dominant.p]]})`);
    if(dominant.p!=='ju')planets.push(`🟡 ${tlen?'Jupiter':'พฤหัส'} (${tlen?TL_RASHI_EN[tr.ju]:TL_RASHI_TH[tr.ju]})`);
    if(dominant.p!=='sa')planets.push(`🪐 ${tlen?'Saturn':'เสาร์'} (${tlen?TL_RASHI_EN[tr.sa]:TL_RASHI_TH[tr.sa]})`);

    // Stress markers for narrative
    const stressors=[];
    if(h.sa===1)stressors.push(tlen?'Saturn on Ascendant — pressure, fatigue, Burnout':'เสาร์ทับลัคน์ — กดดัน เหนื่อย Burnout');
    if(h.ra===1)stressors.push(tlen?'Rahu on Ascendant — unexpected expenses, confusion':'ราหูทับลัคน์ — ค่าใช้จ่ายไม่คาดคิด สับสน');
    if(h.ma===1)stressors.push(tlen?'Mars on Ascendant — conflicts, short temper':'อังคารทับลัคน์ — ขัดแย้ง ใจร้อน');
    if(moonDig.d==='นิจ')stressors.push(tlen?'Moon debilitated — tight cash flow, low mood':'จันทร์นิจ — กระแสเงินสดตึง อารมณ์ตก');

    // Career & Wealth Narrative (psychText)
    const dashaNote=tlen?`Mahadasha ${currentDasha.icon}${dashaNameEN} (${currentDasha.theme_en||currentDasha.theme}) ${dashaDig.d!=='ปกติ'?'— Dasha star '+dashaDig.desc:''}`:
      `มหาทศา${currentDasha.icon}${currentDasha.p} (${currentDasha.theme}) ${dashaDig.d!=='ปกติ'?'— ดาวทศา'+dashaDig.desc:''}`;
    let psychText='';
    if(type==='golden'){
      psychText=tlen?`${dashaNote}\n${balanceText||'Both natal chart and transits open the path'} — Like wind at your back, Cashflow and long-term Assets move well together`:
        `${dashaNote}\n${balanceText||'ทั้งพื้นดวงและดาวจรเปิดทาง'} ช่วงนี้เหมือนมีลมพัดหนุนหลัง ทั้ง Cashflow และ Asset ระยะยาวไปด้วยกันได้ดี`;
    }else if(type==='good'){
      psychText=tlen?`${dashaNote}\n${balanceText||'Overall energy is good'} — Cashflow is steady, suitable for investing in yourself and long-term assets`:
        `${dashaNote}\n${balanceText||'พลังงานโดยรวมดี'} Cashflow มั่นคง เหมาะลงทุนทั้งในตัวเองและทรัพย์สินระยะยาว`;
    }else if(type==='danger'){
      psychText=tlen?`${dashaNote}\n${stressors.length>0?stressors.join(' · '):'Low energy'}\n${balanceText||'Body and mind are signaling rest'} — Watch Cashflow, reduce unnecessary expenses, avoid big investments`:
        `${dashaNote}\n${stressors.length>0?stressors.join(' · '):'พลังงานต่ำ'}\n${balanceText||'ช่วงนี้ร่างกายและจิตใจบอกให้หยุดพัก'} ระวัง Cashflow — ลดรายจ่ายไม่จำเป็น อย่าลงทุนใหญ่`;
    }else if(type==='side'){
      psychText=tlen?`${dashaNote}\n${balanceText||'Some extra income coming in'} — Cashflow improves temporarily, but this is a short peak, save more than you spend`:
        `${dashaNote}\n${balanceText||'มีรายได้เสริมเข้ามาบ้าง'} Cashflow ดีขึ้นชั่วคราว แต่เป็นช่วงพีคสั้นๆ เก็บเงินไว้มากกว่าใช้`;
    }else{
      psychText=tlen?`${dashaNote}\n${balanceText||'Middle-ground energy'} — Use this time to plan long-term Cashflow, rather than making big financial decisions`:
        `${dashaNote}\n${balanceText||'พลังงานกลางๆ'} ใช้ช่วงนี้วางแผน Cashflow ระยะยาว มากกว่าตัดสินใจเรื่องเงินก้อนใหญ่`;
    }

    // Actionable Advice (psychTip)
    const psychTips=tlen?{
      golden:'Invest in yourself — write a new pitch, apply for a more challenging role, or open a new income stream. This energy peaks in the first weeks of the month',
      good:'Update LinkedIn, stay open to new opportunities. Build Assets (skills + connections) rather than spending on short-term pleasures',
      danger:'Cut expenses, build an emergency fund, avoid signing major contracts. Rest fully, light exercise. This phase will pass',
      side:'Take side work, but don\'t quit your main job. Save 70% of extra income. This opportunity is temporary',
      neutral:'Write your 3-month Cashflow goals and plan your finances. The clearer your plan before a high-energy month, the more you\'ll gain'
    }:{
      golden:'ลงทุนในตัวเอง — เขียน pitch ใหม่ สมัครงานที่ท้าทายกว่า หรือเปิดช่องทางรายได้ใหม่ พลังนี้อยู่สัปดาห์แรกๆ ของเดือน',
      good:'อัปเดต LinkedIn เปิดรับโอกาสใหม่ ช่วงนี้เหมาะสร้าง Asset (ทักษะ + connection) มากกว่าใช้เงินซื้อความสุขระยะสั้น',
      danger:'ลดรายจ่าย สำรองเงินฉุกเฉิน อย่าเซ็นสัญญาใหญ่ พักผ่อนให้เต็มที่ ออกกำลังกายเบาๆ ช่วงนี้จะผ่านไป',
      side:'รับงานเสริมได้ แต่อย่าลาออกจากงานหลัก เก็บเงินที่ได้มา 70% ใช้ 30% โอกาสนี้ชั่วคราว',
      neutral:'เขียนเป้าหมาย Cashflow 3 เดือน วางแผนการเงิน ยิ่งชัดก่อนเดือนพลังสูง ยิ่งใช้โอกาสได้คุ้ม'
    };

    // ─── Domain Analysis per Month (งาน เงิน ความรัก สุขภาพ) ───
    const veDig=planetDignity('ve',tr.ve);
    const marsDig2=planetDignity('ma',tr.ma);
    const juInH7=h.ju===7;const saInH7=h.sa===7;const veInH7=h.ve===7;
    const juInH11=h.ju===11;const saInH2=h.sa===2;
    const saInH10=h.sa===10;const maInH10=h.ma===10;
    const saInH6=h.sa===6;
    const juH10asp2=thaiAspect(tr.ju,(natalR+9)%12);
    // Work score
    const wMs=Math.max(20,Math.min(95,Math.round(60+(juH10asp2.score>0?15:0)+(saInH10?-8:0)+(maInH10?-5:0)+(dashaHigh?10:dashaLow?-10:0))));
    // Money score
    const moMs=Math.max(20,Math.min(95,Math.round(60+(veDig.d==='อุจจ์'?15:veDig.d==='นิจ'?-12:0)+(moonDig.d==='นิจ'?-10:0)+(juInH11?12:0)+(saInH2?-12:0))));
    // Love score
    const lvMs=Math.max(20,Math.min(95,Math.round(60+(veDig.d==='อุจจ์'?12:veDig.d==='นิจ'?-10:0)+(juInH7?15:0)+(saInH7?-12:0)+(veInH7?10:0))));
    // Health score
    const hlMs=Math.max(20,Math.min(95,Math.round(60+(marsDig2.d==='อุจจ์'?15:marsDig2.d==='นิจ'?-12:0)+(moonDig.d==='นิจ'?-8:0)+((h.sa===1||saInH6)?-12:0))));
    // Domain texts
    const workFocusTxt=tlen?(
      maInH10?'Mars on Career House (H10) — High work drive, but watch for conflicts with colleagues':
      saInH10?'Saturn on Career House — Heavy workload, high responsibility; results come slow but last':
      juH10asp2.score>0?`Jupiter ${juH10asp2.q} Career House — New opportunities, promotion or important project`:
      type==='danger'?'Planetary pressure — Complete targets, not the time to ask for more':'Normal work — Move forward as planned'
    ):(
      maInH10?'อังคารทับเรือนการงาน — พลังทำงานสูง แต่ระวังขัดแย้งกับเพื่อนร่วมงาน':
      saInH10?'เสาร์ทับเรือนการงาน — งานหนัก ความรับผิดชอบสูง ผลจะเห็นช้าแต่ยั่งยืน':
      juH10asp2.score>0?`พฤหัส${juH10asp2.q}เรือนการงาน — โอกาสใหม่ เลื่อนตำแหน่ง/โปรเจกต์สำคัญ`:
      type==='danger'?'ดาวกดดัน ทำงานให้เสร็จตามเป้า ไม่ใช่เวลาขอเพิ่มงาน':'การงานปกติ เดินหน้าตามแผน'
    );
    const moneyFocusTxt=tlen?(
      veDig.d==='นิจ'?'Venus debilitated — Avoid overspending, avoid large investments, save first':
      moonDig.d==='นิจ'?'Moon debilitated — Tight cash flow, watch for emergency expenses':
      juInH11?'Jupiter in Labha (H11) — Financial luck, possible extra income / bonus / tax refund':
      saInH2?'Saturn on Wealth House — Control expenses, accumulate more than invest':
      veDig.d==='อุจจ์'?'Venus exalted — Finances bright, good for saving and long-term investment':'Balanced finances — Normal income and expenses'
    ):(
      veDig.d==='นิจ'?'ศุกร์นิจ — ระวังรายจ่ายเกินตัว หลีกเลี่ยงลงทุนใหญ่ เก็บเงินไว้ก่อน':
      moonDig.d==='นิจ'?'จันทร์นิจ — กระแสเงินสดตึง ระวังรายจ่ายฉุกเฉิน':
      juInH11?'พฤหัสอยู่เรือนลาภะ (H11) — โชคด้านการเงิน อาจมีรายได้เสริม/โบนัส/คืนภาษี':
      saInH2?'เสาร์ทับเรือนทรัพย์ — ควบคุมรายจ่าย สะสมมากกว่าลงทุน':
      veDig.d==='อุจจ์'?'ศุกร์อุจจ์ — การเงินดี เหมาะสะสมทรัพย์และลงทุนระยะยาว':'การเงินสมดุล รายรับรายจ่ายปกติ'
    );
    const loveFocusTxt=tlen?(
      saInH7?'Saturn on Love House (H7) — Relationship may feel heavy or distant; patience and communication required':
      juInH7?'Jupiter in Love House — Smooth relationship, possible good news about partner':
      veDig.d==='อุจจ์'?'Venus exalted — Love is bright, high charm, ideal for meeting someone special or planning the future':
      veDig.d==='นิจ'?'Venus debilitated — Watch for misunderstandings in relationships, communicate calmly':'Normal love — Care for each other with attention'
    ):(
      saInH7?'เสาร์ทับเรือนความรัก (H7) — ความสัมพันธ์อาจรู้สึกหนักหรือห่างเหิน ต้องอดทนและสื่อสาร':
      juInH7?'พฤหัสอยู่เรือนความรัก — ความสัมพันธ์ราบรื่น อาจมีข่าวดีเรื่องคู่ครอง':
      veDig.d==='อุจจ์'?'ศุกร์อุจจ์ — ความรักสดใส เสน่ห์แรง เหมาะนัดพบคนสำคัญหรือวางแผนอนาคต':
      veDig.d==='นิจ'?'ศุกร์นิจ — ระวังความเข้าใจผิดในความสัมพันธ์ พูดคุยด้วยความใจเย็น':'ความรักปกติ ดูแลกันด้วยความใส่ใจ'
    );
    const healthFocusTxt=tlen?(
      (h.sa===1||h.ra===1)?'Malefic on Ascendant — Take special care of health, sleep enough, get a check-up':
      marsDig2.d==='นิจ'?'Mars debilitated — Low physical energy, avoid intense exercise, rest fully':
      marsDig2.d==='อุจจ์'?'Mars exalted — Excellent physical energy, ideal for starting a workout or detox program':
      saInH6?'Saturn on Health House — Watch health, schedule annual check-up':'Good health — Exercise regularly'
    ):(
      (h.sa===1||h.ra===1)?'ดาวบาปทับลัคน์ — ดูแลสุขภาพเป็นพิเศษ นอนให้เพียงพอ ตรวจร่างกาย':
      marsDig2.d==='นิจ'?'อังคารนิจ — พลังกายต่ำ งดออกกำลังกายหนัก พักผ่อนให้เต็มที่':
      marsDig2.d==='อุจจ์'?'อังคารอุจจ์ — พลังกายดีเยี่ยม เหมาะเริ่มโปรแกรมออกกำลังกายหรือ detox':
      saInH6?'เสาร์ทับเรือนโรค — ระวังสุขภาพ ควรตรวจร่างกายประจำปี':'สุขภาพดี ออกกำลังกายสม่ำเสมอ'
    );
    // Dominant and lowest domain
    const domainMap={work:wMs,money:moMs,love:lvMs,health:hlMs};
    const [domTopic]=Object.entries(domainMap).sort((a,b)=>b[1]-a[1])[0];
    const [lowTopic]=Object.entries(domainMap).sort((a,b)=>a[1]-b[1])[0];
    const domTopicLabel=tlen?{work:'Work',money:'Finance',love:'Love',health:'Health'}[domTopic]:{work:'การงาน',money:'การเงิน',love:'ความรัก',health:'สุขภาพ'}[domTopic];
    const lowTopicLabel=tlen?{work:'Work',money:'Finance',love:'Love',health:'Health'}[lowTopic]:{work:'การงาน',money:'การเงิน',love:'ความรัก',health:'สุขภาพ'}[lowTopic];
    // Decision advice
    const decisionAdvice=tlen?(
      type==='golden'?`✅ Golden Month: Act on ${domTopic==='work'?'career now — pitch, ask for a raise, or apply for a better role':domTopic==='money'?'finances now — invest, open a portfolio, or accumulate long-term assets':domTopic==='love'?'love now — an important date, confess feelings, or plan the future together':'health now — start a program, get a check-up, or improve habits'}`:
      type==='danger'?`⚠️ Caution Month: ${lowTopic==='work'?'Don\'t quit impulsively, not the time for major career decisions — wait':lowTopic==='money'?'Don\'t make big investments, borrow, or sign important contracts — wait for a better month':lowTopic==='love'?'Avoid relationship decisions driven by momentary emotions — stay calm':'Watch your health, don\'t overwork or over-exercise'} ${balanceText?'· '+balanceText:''}`:
      type==='side'?`💼 Side Income Opportunity: Take extra work, but don\'t quit your main job. Save 70% of extra income first — this opportunity is temporary`:
      type==='good'?`😊 Good Month: Move on ${domTopicLabel} — ${domTopic==='work'?'request new projects or responsibilities':domTopic==='money'?'plan long-term or make moderate investments':domTopic==='love'?'care for loved ones, plan the future':'exercise, take care of health'}`:
      `📋 Planning Month: Accumulate energy and plan — no rush on major ${lowTopicLabel} decisions`
    ):(
      type==='golden'?`✅ เดือนทองแห่งโอกาส: ตัดสินใจเรื่อง${domTopicLabel==='การงาน'?'การงานได้เลย — เสนองาน ขอขึ้นเงินเดือน หรือสมัครตำแหน่งที่ดีกว่า':domTopicLabel==='การเงิน'?'การเงินได้เลย — ลงทุน เปิดพอร์ต หรือสะสมทรัพย์ระยะยาว':domTopicLabel==='ความรัก'?'ความรักได้เลย — นัดสำคัญ สารภาพรัก หรือวางแผนอนาคตร่วมกัน':'สุขภาพได้เลย — เริ่มโปรแกรมสุขภาพ ตรวจร่างกาย หรือปรับพฤติกรรมใหม่'}`:
      type==='danger'?`⚠️ เดือนระวัง: ${lowTopicLabel==='การงาน'?'อย่าลาออกจากงานเพราะอารมณ์ ไม่ใช่เวลาตัดสินใจเรื่องอาชีพใหญ่ รอก่อน':lowTopicLabel==='การเงิน'?'อย่าลงทุนใหญ่ กู้เงิน หรือเซ็นสัญญาสำคัญ รอเดือนที่ดีกว่า':lowTopicLabel==='ความรัก'?'ระวังตัดสินใจเรื่องความสัมพันธ์ด้วยอารมณ์ชั่ววูบ ใจเย็นๆ':'ระวังสุขภาพ อย่าหักโหมทำงานหรือออกกำลังกายหนัก'} ${balanceText?'· '+balanceText:''}`:
      type==='side'?`💼 โอกาสรายได้เสริม: รับงานเพิ่มได้ แต่อย่าลาออกจากงานหลัก เก็บรายได้ที่ได้มา 70% ก่อน โอกาสนี้ชั่วคราว`:
      type==='good'?`😊 เดือนดี: ดำเนินการเรื่อง${domTopicLabel}ได้เลย — ${domTopicLabel==='การงาน'?'ขอโปรเจกต์/รับผิดชอบใหม่':domTopicLabel==='การเงิน'?'วางแผนระยะยาวหรือลงทุนปานกลาง':domTopicLabel==='ความรัก'?'ดูแลคนรัก วางแผนอนาคต':'ออกกำลังกาย ดูแลสุขภาพ'}`:
      `📋 เดือนวางแผน: สะสมพลังและวางแผน ยังไม่ต้องรีบตัดสินใจใหญ่เรื่อง${lowTopicLabel}`
    );

    return{
      month:mi,monthFull:TL_MONTHS_FULL[mi],monthShort:TL_MONTHS_TH[mi],
      stars,energy,type,icon,headline,tags,
      planet:tlen?(PLANET_EN[dominant.p]||domP.name):domP.name,planetEmoji:domP.emoji,
      planetEffect:tlen?`Dasha ${dashaNameEN}(${DIGNITY_EN_MAP[dashaDig.d]||dashaDig.d}) · ${ASPECT_EN_MAP[dominant.asp.q]||dominant.asp.q} H10 · ${TL_RASHI_EN[tr[dominant.p]]}`:`ทศา${currentDasha.p}(${dashaDig.d}) · ${dominant.asp.q} H10 · ${TL_RASHI_TH[tr[dominant.p]]}`,
      natalRashi:tlen?TL_RASHI_EN[natalR]:TL_RASHI_TH[natalR],natalRashiIcon:TL_RASHI_ICONS[natalR],
      transitInfo:tlen?`Dasha ${dashaNameEN}(${DIGNITY_EN_MAP[dashaDig.d]||dashaDig.d}) Jupiter in ${TL_RASHI_EN[tr.ju]} Saturn in ${TL_RASHI_EN[tr.sa]}${h.sa===1?' ⚠️on Asc':''}${h.ra===1?' ⚠️Rahu on Asc':''}`:`ทศา${currentDasha.p}(${dashaDig.d}) พฤหัสจร${TL_RASHI_TH[tr.ju]} เสาร์จร${TL_RASHI_TH[tr.sa]}${h.sa===1?' ⚠️ทับลัคน์':''}${h.ra===1?' ⚠️ราหูทับลัคน์':''}`,
      dashaInfo:{planet:tlen?dashaNameEN:currentDasha.p,icon:currentDasha.icon,theme:tlen?(currentDasha.theme_en||currentDasha.theme):currentDasha.theme,dignity:tlen?(DIGNITY_EN_MAP[dashaDig.d]||dashaDig.d):dashaDig.d,house:dashaHouse},
      balanceType,balanceText,stressors,
      goldenDays,blackDays,
      psychText,psychTip:psychTips[type]||psychTips.neutral,
      planets,sideJob:type==='side'||type==='good',
      workFocus:workFocusTxt,moneyFocus:moneyFocusTxt,loveFocus:loveFocusTxt,healthFocus:healthFocusTxt,
      domainScores:{work:wMs,money:moMs,love:lvMs,health:hlMs},
      dominantTopic:domTopic,decisionAdvice
    };
  });
};

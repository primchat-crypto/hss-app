"use client";
import{useState,useEffect,useRef,useCallback}from"react";
import{createClient}from"@supabase/supabase-js";

const SB_URL=process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb=(SB_URL&&SB_KEY)?createClient(SB_URL,SB_KEY,{auth:{persistSession:true,storageKey:"hss-auth",storage:typeof window!=="undefined"?window.localStorage:undefined}}):null;

const BRAND="Human System Studio";
const PLANS={free:{name:"Free",price:0,tag:"🟢",c:"#10B981",f:["identity","core5","share"]},deep:{name:"Deep Insight",price:49,tag:"🟡",c:"#F59E0B",badge:"Early Bird",f:["identity","core5","12d","shadow","love","principle","weekly","energy","share","decide"]},all:{name:"All Access",price:99,tag:"🔵",c:"#3B82F6",badge:"Early Bird คุ้มสุด",f:["identity","core5","12d","shadow","love","principle","weekly","energy","timeline","job","dasha","pdf","share","decide"]}};
const DEC_CATS={work:{icon:"💼",label:"งาน",q:["ลาออกดีไหม","เปลี่ยนงานตอนไหน","งานนี้เหมาะไหม","ธุรกิจนี้จะสำเร็จไหม","ควรรับงานนี้ไหม"]},money:{icon:"💰",label:"เงิน",q:["เงินฝืดเพราะอะไร","เงินจะดีเมื่อไหร่","ลงทุนนี้เหมาะไหม","จะหารายได้เพิ่มยังไง"]},love:{icon:"❤️",label:"ความรัก",q:["คนนี้ใช่ไหม","ควรไปต่อไหม","เลิกดีไหม","รักคืนดีดีไหม"]},timing:{icon:"⏳",label:"Timing",q:["ควรทำตอนนี้ไหม","ช่วงไหนดีที่สุด","รอก่อนดีกว่าไหม","ย้ายบ้านช่วงไหนดี"]}};
const FT=[["Identity Snapshot (AI)","identity",1,1,1],["5 Core Scores + AI วิเคราะห์","core5",1,1,1],["จุดแข็ง / จุดพัฒนา 12 มิติ","12d",0,1,1],["Shadow Analysis เชิงลึก","shadow",0,1,1],["Love & Compatibility ชะตาความรัก","love",0,1,1],["Life Principle หลักการใช้ชีวิต","principle",0,1,1],["Life Phase Map (Dasha)","dasha",0,0,1],["Do & Don't รายสัปดาห์","weekly",0,1,1],["7-Day Energy Forecast","energy",0,1,1],["Dashboard กราฟชีวิตการงาน","timeline",0,0,1],["Job Matching AI","job",0,0,1],["PDF Report ดาวน์โหลด","pdf",0,0,1],["Social Share Card","share",1,1,1]];

const QG={A:{t:"The Foundation",dims:{"Cognitive Processing":{icon:"🧠",c:"#6366F1",pl:"พุธ",q:["ก่อนเริ่มงาน ฉันวางแผนคร่าวๆ อย่างน้อย 1 ครั้ง","เมื่ออธิบายเรื่องยาก ฉันสรุปให้เหลือประเด็นหลักได้","ก่อนส่งงาน ฉันตรวจทานจุดผิดพลาดสำคัญอีกครั้ง"]},"Emotional Regulation":{icon:"🌊",c:"#0EA5E9",pl:"จันทร์",q:["เมื่ออารมณ์แรง ฉันหยุดพักก่อนตอบหรือก่อนตัดสินใจ","ในวันที่อารมณ์ไม่ดี ฉันยังทำงานจำเป็นให้เดินหน้าได้อย่างน้อย 1 อย่าง","หลังเจอเรื่องกระทบใจ ฉันกลับมาใช้ชีวิตปกติได้ภายใน 1–2 วัน"]},"Identity Stability":{icon:"⚓",c:"#EC4899",pl:"อาทิตย์+เสาร์",q:["ฉันตัดสินใจตามหลักของตัวเอง มากกว่าทำตามแรงกดดันจากคนอื่น","เมื่อมีคนติ ฉันโฟกัสที่สิ่งที่ต้องแก้ไข มากกว่าคิดว่าตัวเองไม่มีค่า","ฉันโฟกัสเป้าหมายหลักเรื่องหนึ่งได้ต่อเนื่องอย่างน้อย 2 สัปดาห์"]}}},B:{t:"The Execution",dims:{"Energy Management":{icon:"⚡",c:"#F59E0B",pl:"อังคาร",q:["เมื่อมีงานสำคัญ ฉันเริ่มลงมือภายใน 24 ชั่วโมง","ฉันทำงานต่อเนื่องตามแผนได้ โดยไม่หลุดโฟกัสบ่อย","เมื่อเริ่มล้า ฉันเลือกพักเพื่อฟื้นพลัง แทนฝืนทำต่อ"]},"Decision System":{icon:"⚖️",c:"#3B82F6",pl:"พฤหัส+เสาร์",q:["ก่อนตัดสินใจเรื่องสำคัญ ฉันหาข้อมูลอย่างน้อย 2 มุมมอง","เมื่อตัดสินใจแล้ว ฉันลงมือทำโดยไม่ย้อนลังเลซ้ำ","ฉันคิดถึงผลระยะยาว ก่อนเลือกสิ่งที่มีต้นทุนสูง"]},"Responsibility Load":{icon:"🏋️",c:"#8B5CF6",pl:"เสาร์",q:["ฉันทำงานที่สำคัญที่สุดก่อน แม้ไม่ใช่งานที่อยากทำ","ถ้ารู้ว่าจะไม่ทัน ฉันแจ้งล่วงหน้าและเสนอทางออก","แม้ไม่มีคนตาม ฉันยังทำสิ่งที่รับปากไว้ให้เสร็จ"]}}},C:{t:"The Interaction",dims:{"Motivation Driver":{icon:"🔥",c:"#F97316",pl:"อาทิตย์",q:["ฉันรู้ว่าทำสิ่งนี้ไปเพื่ออะไร และอธิบายเหตุผลได้ชัด","เมื่อเห็นต่าง ฉันกล้าแสดงความเห็นของตัวเอง","เมื่อทำสำเร็จ ฉันยอมรับความสามารถของตัวเอง"]},"Boundary System":{icon:"🛡️",c:"#10B981",pl:"เสาร์+จันทร์",q:["เมื่อถูกขอเกินกำลัง ฉันกล้าปฏิเสธหรือปรับขอบเขต","ฉันมีช่วงเวลาพักจริงอย่างน้อย 1 ครั้งต่อสัปดาห์","หลังเจอคนที่ทำให้เครียด ฉันมีวิธีรีเซ็ตตัวเอง"]},"Stress Response":{icon:"🧊",c:"#64748B",pl:"เสาร์",q:["ภายใต้ความกดดัน ฉันยังรักษาคุณภาพงานขั้นต่ำได้","เมื่อเจอปัญหา ฉันเริ่มแก้ไขภายใน 24 ชั่วโมง","แม้ไม่อยากทำ ฉันยังหาวิธีพาตัวเองลงมือทำ"]}}},D:{t:"The Evolution & Shadow",dims:{"Shadow Pattern":{icon:"🌑",c:"#1E293B",pl:"ราหู/เกตุ",rev:true,q:["ฉันเลี่ยงเรื่องสำคัญ ไปทำสิ่งที่สบายกว่าแทน","ฉันตัดสินใจเพราะกลัวหรืออยากได้ แล้วมานึกเสียใจทีหลัง","ฉันผัดเรื่องที่ควรเผชิญ แม้รู้ว่ามันกระทบซ้ำ"]},"Growth Orientation":{icon:"🌱",c:"#10B981",pl:"พฤหัส",q:["เมื่อได้รับคำแนะนำ ฉันถามต่อเพื่อเข้าใจให้ชัด","ฉันใช้เวลาอย่างน้อยสัปดาห์ละ 30 นาทีพัฒนาตัวเอง","หลังทำพลาด ฉันสรุปบทเรียนเพื่อใช้ครั้งต่อไป"]},"Integration Level":{icon:"🔮",c:"#A78BFA",pl:"ผลรวมทุกดาว",q:["ฉันมีสิ่งสำคัญอันดับ 1 ที่โฟกัสชัดในช่วงนี้","ตารางชีวิตฉันมีจังหวะพักที่ช่วยไม่ให้ล้าเรื้อรัง","ฉันรู้จุดแข็งและจุดเสี่ยงของตัวเอง และใช้วางแผนสัปดาห์นี้จริง"]}}}};

const flatQ=()=>{const f=[];Object.entries(QG).forEach(([,g])=>Object.entries(g.dims).forEach(([d,data])=>data.q.forEach((q,i)=>f.push({dim:d,q,icon:data.icon,c:data.c,rev:data.rev||false,qi:i,pl:data.pl}))));return f};
const ALL_Q=flatQ();
const SCALE=["แทบไม่จริง","นานๆ ครั้ง","บางครั้ง","บ่อย","สม่ำเสมอมาก"];
const DM={};Object.values(QG).forEach(g=>Object.entries(g.dims).forEach(([k,v])=>{DM[k]=v}));
const DIMS=Object.keys(DM);
const C5_META={"Cognitive Processing":{short:"Cognitive",pl:"พุธ",high:{label:"พุธเด่น",desc:"ประมวลผลข้อมูลแม่นยำ สื่อสารฉับไว คิดเป็นระบบ"},mid:{label:"พุธทำงาน",desc:"ความคิดดีในช่วงโฟกัส แต่อาจกระจัดกระจายเมื่อมีหลายเรื่องพร้อมกัน"},low:{label:"พุธต้องฝึก",desc:"⚠️ ระวังการตัดสินใจเร็วเกินไป ลองจดบันทึกช่วยกรองความคิด"}},"Emotional Regulation":{short:"Emotional",pl:"จันทร์",high:{label:"จันทร์นิ่ง",desc:"อารมณ์มั่นคง รับแรงกดดันได้ดี เป็นที่พึ่งของคนรอบข้าง"},mid:{label:"จันทร์นำทาง",desc:"อารมณ์มีความอ่อนไหวตามจังหวะดาว ต้องใช้สติคอยประคอง"},low:{label:"⚠️ จุดเปราะบาง",desc:"อารมณ์ขึ้นลงง่าย ระวังให้อารมณ์ชั่ววูบตัดสินแทนเหตุผล"}},"Identity Stability":{short:"Identity",pl:"อาทิตย์+เสาร์",high:{label:"แกนตัวตนแกร่ง",desc:"เป้าหมายชัดเจน รับผิดชอบสูง ไม่หลงทิศแม้แรงกดดันภายนอก"},mid:{label:"แกนตัวตน",desc:"มีความรับผิดชอบสูง แต่อาจมีความกดดันแฝงอยู่ในเป้าหมาย"},low:{label:"⚠️ ตัวตนยังสั่นคลอน",desc:"ยังหาทิศทางของตัวเองอยู่ ระวังถูกอิทธิพลภายนอกกำหนดเป้าหมายแทน"}},"Shadow Pattern":{short:"Shadow",pl:"ราหู/เกตุ",high:{label:"Shadow ตื่นรู้",desc:"รู้จักตัวเองในมิติที่ลึก รับมือด้านมืดได้ดี ไม่ถูก trigger ง่าย"},mid:{label:"Shadow กำลังเรียนรู้",desc:"มีบางจุดที่ยังเปราะบาง แต่กำลังเข้าใจตัวเองดีขึ้นเรื่อยๆ"},low:{label:"⚠️ จุดเปราะบาง",desc:"ระวังแพทเทิร์นการตัดสินใจในช่วงอารมณ์พีค หรือความลุ่มหลงที่มองข้าม — Shadow Analysis จะช่วยคลี่คลาย 🔓"}},"Growth Orientation":{short:"Growth",pl:"พฤหัส",high:{label:"แรงส่งชีวิต",desc:"มุ่งมั่นพัฒนาตนเองอย่างมีทิศทาง วิสัยทัศน์เปิดกว้าง เรียนรู้ไม่หยุด"},mid:{label:"พฤหัสหนุน",desc:"มีแรงขับพัฒนาตัวเอง แต่ยังต้องหาโมเมนตัมที่สม่ำเสมอ"},low:{label:"⚠️ Growth ยังนิ่ง",desc:"พลังขับเคลื่อนการเติบโตยังต่ำ ลองหา 'เหตุผลใหม่' ที่ทำให้อยากพัฒนาตัวเอง"}}};
const TS=[{id:"dawn",l:"🌅 เช้ามืด (04:00–06:00)",d:"พระอาทิตย์กำลังจะขึ้น"},{id:"morning",l:"☀️ ช่วงสาย (09:00–11:00)",d:"พระอาทิตย์อยู่สูง"},{id:"noon",l:"🌞 เที่ยง/บ่ายต้น (12:00–14:00)",d:"พระอาทิตย์เหนือศีรษะ"},{id:"evening",l:"🌇 เย็น/พลบค่ำ (17:00–19:00)",d:"พระอาทิตย์ตก"},{id:"night",l:"🌙 ดึก (22:00–24:00)",d:"เที่ยงคืน"}];

// 77 จังหวัด
const PV=["กรุงเทพมหานคร","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น","จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก","นครปฐม","นครพนม","นครราชสีมา","นครศรีธรรมราช","นครสวรรค์","นนทบุรี","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี","ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา","พะเยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์","แพร่","ภูเก็ต","มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด","ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรปราการ","สมุทรสงคราม","สมุทรสาคร","สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์","หนองคาย","หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์","อุทัยธานี","อุบลราชธานี"];

// Day Lord
const RASHI=["เมษ","พฤษภ","มิถุน","กรกฎ","สิงห์","กันย์","ตุลย์","พิจิก","ธนู","มกร","กุมภ์","มีน"];
const NAKSHATRA=["อัศวินี","ภรณี","กฤตติกา","โรหิณี","มฤคศิรา","อารทรา","ปุนรวสุ","ปุษยะ","อาศเลษา","มฆะ","ปุรวผลคุนี","อุตตรผลคุนี","หัสตะ","จิตรา","สวาติ","วิศาขะ","อนุราธะ","เชษฐา","มูละ","ปุรวษาฒะ","อุตตรษาฒะ","ศรวณะ","ธนิษฐา","ศตภิษา","ปุรวภัทร","อุตตรภัทร","เรวตี"];
const DAYNAME=["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
const DAY_LORD=[{day:0,lord:"อาทิตย์",icon:"☀️",planet:"su",gf:"ตัดสินใจ เริ่มสิ่งใหม่"},{day:1,lord:"จันทร์",icon:"🌙",planet:"mo",gf:"ดูแลตัวเอง งานสร้างสรรค์"},{day:2,lord:"อังคาร",icon:"🔥",planet:"ma",gf:"ลงมือทำ แก้ปัญหา"},{day:3,lord:"พุธ",icon:"🧠",planet:"me",gf:"ประชุม เขียนงาน เจรจา"},{day:4,lord:"พฤหัส",icon:"📚",planet:"ju",gf:"วางแผนระยะยาว ปรึกษาผู้รู้"},{day:5,lord:"ศุกร์",icon:"💎",planet:"ve",gf:"สร้างสัมพันธ์ ผ่อนคลาย"},{day:6,lord:"เสาร์",icon:"⚙️",planet:"sa",gf:"ทำงานค้าง สร้างวินัย"}];

const natalPStr=(bd)=>{const m=parseInt(bd?.split("-")?.[1])||6;const d=parseInt(bd?.split("-")?.[2])||15;const s=(m*31+d)%100;return{su:Math.min(10,(22+((s*7)%18))/4),mo:Math.min(10,(18+((s*3)%22))/4),ma:Math.min(10,(19+((s*11)%21))/4),me:Math.min(10,(20+(s%20))/4),ju:Math.min(10,(21+((s*13)%19))/4),ve:Math.min(10,(20+((s*5)%20))/4),sa:Math.min(10,(17+((s*17)%23))/4)}};
const dlCompat=(dow,ns)=>{const dl=DAY_LORD[dow];const str=ns[dl.planet]||5;let q,mod;if(str>=8){q=dl.lord+"หนุนเต็มที่";mod=15}else if(str>=6){q=dl.lord+"ส่งพลังดี";mod=8}else if(str>=4){q=dl.lord+"ปกติ";mod=0}else{q=dl.lord+"ท้าทาย";mod=-10}return{...dl,str,q,mod}};
const moonTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const days=(date-ref)/864e5;const frac=((days/27.3217%1)+1)%1;return Math.floor((frac*12+5)%12)};
const marsTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const days=(date-ref)/864e5;return Math.floor(((days/686.97%1)*12+7)%12)};
const satTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");return Math.floor(((date-ref)/864e5/10766*12+10)%12)};
const venusTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const m=(date-ref)/864e5/30.4375;return Math.floor(((m*1.05+1)%12+12)%12)};
const jupTr=(date)=>{const ref=new Date("2024-01-01T00:00:00Z");const m=(date-ref)/864e5/30.4375;return Math.floor(((m*0.083+0)%12+12)%12)};
const natalMoon=(bd)=>{if(!bd||bd==="--")return 0;const d=new Date(bd+"T12:00:00Z");return isNaN(d.getTime())?0:moonTr(d)};
const getNak=(ri,di)=>NAKSHATRA[(ri*2+(di%3))%27];
const trAspect=(tr,nr)=>{const d=((tr-nr)%12+12)%12;if(d===0)return{r:"ร่วม",q:"กลาง",m:0};if(d===4||d===8)return{r:"ตรีโกณ",q:"ดีมาก",m:15};if(d===3||d===9)return{r:"จตุโกณ",q:"กดดัน",m:-15};if(d===6)return{r:"ตรงข้าม",q:"ตึง",m:-10};if(d===5)return{r:"ตรีโกณรอง",q:"ดี",m:10};return{r:"ปกติ",q:"กลาง",m:0}};
const marsD=(r)=>{if(r===0||r===7)return{d:"เกษตร",m:10};if(r===9)return{d:"อุจจ์",m:15};if(r===3)return{d:"นิจ",m:-15};return{d:"ปกติ",m:0}};

const gen7Day=(bd)=>{
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
    const workTxt=satMarConj?'⚠️ เสาร์-อังคารร่วมราศี (กาลกินี) — ระวังความขัดแย้งในที่ทำงาน อย่าตัดสินใจใหญ่':
      juAsp7.score>=15?`พฤหัส${juAsp7.q} — โอกาสงานดี เหมาะเสนองาน Networking ${dl.gf}`:
      dlE<50?`เจ้าวัน${dl.lord}อ่อน — ระวังการตัดสินใจสำคัญ เน้นทำงานให้เสร็จ`:
      `เจ้าวัน${dl.icon}${dl.lord}หนุน — ${dl.gf}`;
    // Money: ศุกร์ + จันทร์
    const moneyTxt=venDig.d==='นิจ'?'ศุกร์นิจ — ระวังรายจ่ายเกินตัว หลีกเลี่ยงลงทุนใหญ่ หรือซื้อของราคาสูง':
      moonDig7.d==='นิจ'?'จันทร์นิจ — กระแสเงินสดตึง ระวังรายจ่ายไม่คาดคิด เก็บเงินไว้ก่อน':
      venDig.d==='อุจจ์'?'ศุกร์อุจจ์ — โชคด้านการเงิน รายได้เสริมเข้าได้ เหมาะออมทรัพย์':
      satMarConj?'เสาร์-อังคารร่วม — ระวังค่าใช้จ่ายฉุกเฉิน ไม่เหมาะลงทุน':
      'การเงินปกติ — ไม่มีโชคพิเศษ แต่ก็ไม่มีอุปสรรค';
    // Love: ศุกร์ + จันทร์
    const loveTxt=dow===5?'วันศุกร์ — ดาวศุกร์ครองวัน เสน่ห์แรง เหมาะนัดพบคนสำคัญ':
      satMarConj?'เสาร์-อังคารร่วม — ระวังอารมณ์ ควรหลีกเลี่ยงทะเลาะกับคนรัก ใจเย็นๆ':
      venDig.d==='อุจจ์'?'ศุกร์อุจจ์ — ความรักสดใส อารมณ์ดี เสน่ห์ดึงดูดสูง':
      venDig.d==='นิจ'?'ศุกร์นิจ — ระวังความเข้าใจผิดในความสัมพันธ์ สื่อสารด้วยความใจเย็น':
      ma.m>0?'จันทร์มุมดี — อารมณ์ดี เข้าใจกัน เหมาะคุยเรื่องสำคัญ':
      ma.m<0?'จันทร์กดดัน — อาจมีความเข้าใจผิด ให้เวลาคิดก่อนพูด':
      'ความรักปกติ — ดูแลกันด้วยความใส่ใจ';
    // Health: อังคาร + เสาร์
    const healthTxt=satMarConj?'⚠️ กาลกินี — เสาร์-อังคารร่วมราศี ระวังอุบัติเหตุ ขับรถระมัดระวัง งดกิจกรรมเสี่ยง':
      marsDig7.d==='นิจ'?'อังคารนิจ — พลังกายต่ำ งดออกกำลังกายหนัก พักผ่อนให้เต็มที่':
      marsDig7.d==='อุจจ์'?'อังคารอุจจ์ — พลังกายดีเยี่ยม เหมาะออกกำลังกายหนัก เริ่มโปรแกรมใหม่':
      satAsp7.score<0?'เสาร์กดดัน — เหนื่อยง่าย ดูแลสุขภาพด้วยการพักผ่อนให้พอ':
      'สุขภาพดี — ออกกำลังกายสม่ำเสมอ พักผ่อนเพียงพอ';
    // Featured topic (most notable deviation)
    const domScores={work:dlE+(juAsp7.score>0?15:0)+(satMarConj?-20:0),money:65+(venDig.d==='อุจจ์'?15:venDig.d==='นิจ'?-12:0)+(moonDig7.d==='นิจ'?-10:0),love:65+(dow===5?15:0)+(venDig.d==='อุจจ์'?10:venDig.d==='นิจ'?-10:0)+(ma.m>0?5:0),health:65+(marsDig7.d==='อุจจ์'?15:marsDig7.d==='นิจ'?-12:0)+(satMarConj?-20:0)+(satAsp7.score<0?-10:0)};
    const [featuredKey]=Object.entries(domScores).sort((a,b)=>Math.abs(b[1]-65)-Math.abs(a[1]-65))[0];
    const featuredLabel={work:'💼 งาน',money:'💰 เงิน',love:'❤️ ความรัก',health:'🏃 สุขภาพ'}[featuredKey];
    const featuredGood=domScores[featuredKey]>65;
    // Special event
    const specialEvent=satMarConj?{type:'danger',text:'⚠️ กาลกินี — เสาร์อังคารร่วมราศี วันนี้ควรระวังอุบัติเหตุ ความขัดแย้ง ไม่ควรตัดสินใจสำคัญ ลงนามสัญญา หรือเดินทางไกล'}:
      venDig.d==='อุจจ์'&&dow===5?{type:'good',text:'✨ ศุกร์อุจจ์ในวันศุกร์ — วันมงคลที่สุด เหมาะนัดพบ เจรจา ความรัก และการเงิน'}:
      juAsp7.score>=15?{type:'good',text:`📚 พฤหัส${juAsp7.q} — วันนี้เหมาะวางแผนระยะยาว ปรึกษาผู้รู้ หรือขอคำแนะนำเรื่องสำคัญ`}:
      null;
    days.push({date:`${dt.getDate()}/${dt.getMonth()+1}`,dn:DAYNAME[dt.getDay()],moonR:RASHI[mr],nak:getNak(mr,i),marsR:RASHI[mar],satR:RASHI[sat],veR:RASHI[ve],juR:RASHI[ju],ma,md,nmR:RASHI[nm],dl,ce,work:workTxt,money:moneyTxt,love:loveTxt,health:healthTxt,featuredLabel,featuredGood,specialEvent,satMarConj});
  }
  return days;
};

// Vedic Dasha System — Life Phase Map
const DASHA_SEQ=[{p:"เกตุ",y:7,icon:"🌀",theme:"การค้นหาตัวเอง",desc:"ช่วงเวลาแห่งการทบทวนภายใน ค้นหาทิศทางชีวิต",focus:"สำรวจตัวตน ปล่อยวางสิ่งเก่า",cheer:"นี่คือช่วงที่จักรวาลให้เวลาคุณ 'รีเซ็ต' — ไม่ต้องรีบ ค่อยๆ หาคำตอบ ทุกการเดินทางเริ่มจากก้าวแรก 🌱",warn:"⚠️ ระวัง: อย่าตัดสินใจใหญ่ด้วยอารมณ์ชั่ววูบ ช่วงนี้สิ่งที่เห็นอาจยังไม่ใช่ภาพเต็ม"},{p:"ศุกร์",y:20,icon:"💎",theme:"ความสัมพันธ์และความสุข",desc:"พลังไปทางความสัมพันธ์ ศิลปะ ความงาม ความรัก",focus:"สร้างสัมพันธ์ ลงทุนความสุข",cheer:"ดาวศุกร์ส่งพลังรัก ความสุข ความอุดมสมบูรณ์ — ถ้ารู้สึกดีกับคนรอบข้าง แสดงว่าคุณใช้พลังนี้ถูกทางแล้ว ✨",warn:"⚠️ ระวัง: อย่าหลงความสุขระยะสั้นจนลืมรากฐาน อย่าพึ่งลาออกจากงานเพราะอยากตามความฝัน โดยไม่มีแผนสำรอง"},{p:"อาทิตย์",y:6,icon:"☀️",theme:"การสร้างตัวตน",desc:"ช่วงสร้างตัวตน อำนาจ ชื่อเสียง ความมั่นใจ",focus:"แสดงตัวตน เป็นผู้นำ",cheer:"นี่คือเวลาที่แสงสว่างส่องมาที่คุณ — กล้าขึ้นเวที กล้าบอกโลกว่าคุณเป็นใคร ความมั่นใจของคุณจะดึงดูดโอกาส 🌟",warn:"⚠️ ระวัง: อย่าให้ความมั่นใจกลายเป็นหยิ่ง ฟังคนรอบข้างด้วย"},{p:"จันทร์",y:10,icon:"🌙",theme:"อารมณ์และจิตใจ",desc:"พลังด้านอารมณ์ ครอบครัว การดูแลเอาใจใส่",focus:"ดูแลจิตใจ สร้างความมั่นคงภายใน",cheer:"จันทร์ให้คุณรู้สึกลึกกว่าเดิม — นั่นคือพลัง ไม่ใช่ความอ่อนแอ คนที่เข้าใจอารมณ์ตัวเองคือคนที่แข็งแกร่งที่สุด 💙",warn:"⚠️ ระวัง: อย่าเก็บทุกอย่างไว้คนเดียว หาคนไว้ใจคุยด้วย อย่าตัดสินใจเรื่องเงินตอนอารมณ์ไม่ดี"},{p:"อังคาร",y:7,icon:"🔥",theme:"พลังงานและการกระทำ",desc:"ช่วงลงมือทำ กล้าเสี่ยง พลังกายสูง",focus:"ลงมือทำ เผชิญหน้าความท้าทาย",cheer:"อังคารจุดไฟให้คุณ — พลังกายและใจพร้อมทำสิ่งใหญ่ ใช้พลังนี้ให้คุ้ม ลงมือเลย ไม่ต้องรอ 🚀",warn:"⚠️ ระวัง: พลังสูง = ใจร้อนง่าย อย่าทะเลาะกับคนสำคัญ คิดก่อนพูด"},{p:"ราหู",y:18,icon:"🌑",theme:"การเปลี่ยนแปลงครั้งใหญ่",desc:"บทเรียนใหม่ที่ไม่คุ้นเคย เปลี่ยนแปลงฉับพลัน",focus:"เปิดรับสิ่งใหม่ อย่ายึดติดของเดิม",cheer:"ราหูพาคุณออกจาก comfort zone — อาจรู้สึกไม่สบายใจ แต่นี่คือช่วงที่คุณจะเติบโตมากที่สุด ทุกอย่างจะคุ้มค่า 🦋",warn:"⚠️ ระวัง: อย่าเชื่อคนง่ายเกินไป ตรวจสอบข้อมูลก่อนลงทุนหรือเซ็นสัญญาใหญ่"},{p:"พฤหัส",y:16,icon:"📚",theme:"การขยายตัวและปัญญา",desc:"ช่วงเรียนรู้ ขยายตัว ปัญญาเปิด โชคดี",focus:"ศึกษา ขยายขอบเขต ลงทุนระยะยาว",cheer:"พฤหัสเปิดประตูแห่งโอกาส — ทุกอย่างที่เรียนรู้ตอนนี้จะเป็นทุนให้คุณไปอีก 10 ปี ช่วงนี้โชคอยู่ข้างคุณ 🍀",warn:"⚠️ ระวัง: อย่ากระจายตัวมากเกินไป โฟกัสสิ่งที่สำคัญจริงๆ"},{p:"เสาร์",y:19,icon:"⚙️",theme:"วินัยและความรับผิดชอบ",desc:"บทเรียนเรื่องวินัย ความอดทน สร้างฐาน",focus:"สร้างวินัย ทำงานหนัก ผลมาช้าแต่ยั่งยืน",cheer:"เสาร์สอนให้คุณอดทน — อาจรู้สึกหนัก แต่คนที่ผ่านช่วงเสาร์ไปได้จะแข็งแกร่งกว่าเดิมหลายเท่า ผลที่ได้จะยั่งยืน 💪",warn:"⚠️ ระวัง: อย่าลัดขั้นตอน ทำทางลัดช่วงนี้จะย้อนมาเสียใจทีหลัง ค่อยๆ สร้าง"},{p:"พุธ",y:17,icon:"🧠",theme:"สื่อสารและเรียนรู้",desc:"พลังด้านสื่อสาร ธุรกิจ การค้า ความคิด",focus:"สื่อสาร เรียนรู้ สร้างเครือข่าย",cheer:"พุธเปิดสมองให้คุณ — คิดเร็ว เรียนเร็ว สื่อสารเก่ง ใช้พลังนี้สร้างเครือข่ายและโอกาสใหม่ๆ 🤝",warn:"⚠️ ระวัง: คิดเยอะ = กังวลง่าย อย่าลืมพักสมอง อย่าเสียเวลากับรายละเอียดเล็กน้อยจนลืมภาพใหญ่"}];
const calcDasha=(bd)=>{if(!bd||bd==="--"||bd==="undefined"||bd.length<8)return[];const bp=bd.split("-");if(!bp||bp.length<3)return[];const by=parseInt(bp[0]);const bm=parseInt(bp[1]);const bdNum=parseInt(bp[2]);if(!by||!bm||!bdNum||isNaN(by)||isNaN(bm)||isNaN(bdNum))return[];const testDate=new Date(`${by}-${String(bm).padStart(2,"0")}-${String(bdNum).padStart(2,"0")}T12:00:00Z`);if(isNaN(testDate.getTime()))return[];const nm=natalMoon(bd);const nakI=((nm*2+(bdNum%3))%27+27)%27;const startI=((Math.floor(nakI/3))%9+9)%9;const phases=[];let age=0;for(let c=0;c<18;c++){const di=(startI+c)%9;const d=DASHA_SEQ[di];const startAge=age;const endAge=age+d.y;const startYear=by+startAge;const endYear=by+endAge;const now=new Date().getFullYear();const isCurrent=now>=startYear&&now<endYear;const isPast=now>=endYear;phases.push({...d,startAge,endAge,startYear,endYear,isCurrent,isPast});age+=d.y;if(age>100)break}return phases};

const calcAntardasha=(mahadasha,startYear)=>{if(!mahadasha)return[];const mdI=DASHA_SEQ.findIndex(d=>d.p===mahadasha.p);if(mdI<0)return[];const now=new Date();const nowFrac=now.getFullYear()+(now.getMonth())/12;const ads=[];let cur=startYear;for(let i=0;i<9;i++){const adI=(mdI+i)%9;const ad=DASHA_SEQ[adI];const dur=(mahadasha.y*ad.y)/120;const end=cur+dur;const isCurrent=nowFrac>=cur&&nowFrac<end;const isPast=nowFrac>=end;ads.push({...ad,duration:dur,startYear:cur,endYear:end,isCurrent,isPast});cur=end;}return ads;};

// Career Timeline — โหราศาสตร์ไทย (Thai Sidereal Astrology) Monthly Energy
const TL_MONTHS_TH=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const TL_MONTHS_FULL=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
// ราศีไทย (Sidereal / สุริยาตร์) — ใช้ระบบ Sidereal ไม่ใช่ Tropical
const TL_RASHI_TH=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มกร','กุมภ์','มีน'];
const TL_RASHI_LORDS=['อังคาร','ศุกร์','พุธ','จันทร์','อาทิตย์','พุธ','ศุกร์','อังคาร','พฤหัส','เสาร์','เสาร์','พฤหัส'];
const TL_RASHI_ICONS=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
// โหราศาสตร์ไทย: ราศีเกิดจาก Sidereal Sun (ลบ ayanamsa ~24°)
const bdayToRashiThai=(bd)=>{if(!bd||bd==="--"||bd.length<8)return 0;const p=bd.split("-");const m=parseInt(p[1]);const d=parseInt(p[2]);
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
const TL_PLANET_DATA={
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
const thaiAspect=(trRashi,natalRashi)=>{const d=((trRashi-natalRashi)%12+12)%12;
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
const TL_UCCHA={su:0,mo:1,ma:9,me:5,ju:3,ve:11,sa:6}; // ราศีอุจจ์
const TL_NEECHA={su:6,mo:7,ma:3,me:11,ju:9,ve:5,sa:0}; // ราศีนิจ
const planetDignity=(planet,rashi)=>{
  if(rashi===TL_UCCHA[planet])return{d:'อุจจ์',score:15,desc:'ดาวอุจจ์ — กำลังสูงสุด'};
  if(rashi===TL_NEECHA[planet])return{d:'นิจ',score:-12,desc:'ดาวนิจ — กำลังอ่อน'};
  const lord=TL_RASHI_LORDS[rashi];const pName=TL_PLANET_DATA[planet]?.name;
  if(lord===pName)return{d:'เกษตร',score:10,desc:'ดาวเกษตร — อยู่บ้านตัวเอง'};
  return{d:'ปกติ',score:0,desc:'สภาพปกติ'};
};
// Hybrid Engine: Vedic Dasha × Thai Transit — "Realistic Life Score"
// Map Dasha planet names (Thai) to planet keys
const DASHA_PLANET_KEY={'เกตุ':'ra','ศุกร์':'ve','อาทิตย์':'su','จันทร์':'mo','อังคาร':'ma','ราหู':'ra','พฤหัส':'ju','เสาร์':'sa','พุธ':'me'};
// House from Ascendant: planet rashi relative to natal lagna
const houseFrom=(planetR,lagna)=>((planetR-lagna)%12+12)%12+1; // 1-12

const genTimeline=(bd,year)=>{
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
    if(dashaHigh&&transitLow){balanceType='potential_blocked';balanceText='ศักยภาพสูงแต่อุปสรรคหนัก — สำเร็จได้แน่นอน แต่ต้องใช้พลังมาก ระวังเรื่องค่าใช้จ่ายและสุขภาพ';}
    else if(dashaLow&&transitHigh){balanceType='temp_peak';balanceText='โชคดีเล็กๆ น้อยๆ เข้ามา แต่อย่าลงทุนใหญ่ เพราะเป็นช่วงพีคชั่วคราว เก็บเงินไว้ก่อน';}
    else if(dashaHigh&&transitHigh){balanceType='golden';balanceText='ทั้งพื้นดวงและดาวจรหนุนพร้อมกัน — ช่วงนี้คือโอกาสทองจริงๆ';}
    else if(dashaLow&&transitLow){balanceType='rest';balanceText='ช่วงนี้ทั้งพื้นดวงและดาวจรกดดัน — ร่างกายและจิตใจบอกให้พัก อย่าฝืน';}

    // Determine type
    let type,icon,headline;
    const stars=energy>=80?5:energy>=65?4:energy>=50?3:energy>=35?2:1;
    if(stars===5){type='golden';icon='🌟';headline='เดือนทองแห่งโอกาส';}
    else if(stars===4){type='good';icon='😊';headline='พลังงานดี — เดินหน้า';}
    else if(stars<=1){type='danger';icon='⚠️';headline='ดาวกดทับหนัก — พักฟื้น';}
    else if(stars===2){type='danger';icon='⚠️';headline='ระวัง — อุปสรรคเข้ามา';}
    else if(balanceType==='temp_peak'){type='side';icon='💼';headline='โชคเล็กๆ เข้ามา — อย่าลงทุนใหญ่';}
    else{type='neutral';icon='😐';headline='เดือนวางแผน — สะสมพลัง';}

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
    for(let day=1;day<=daysInMonth&&goldenDays.length<4;day++){
      const dt=new Date(ceYear,mi,day);const dow=dt.getDay();
      const dl=DAY_LORD[dow];const dlStr=ns[dl.planet]||5;
      if(dlStr>=6.5&&energy>=40&&(day%7===3||day%8===5||day%9===2)){
        const actions=['นัดสัมภาษณ์ / เสนองาน','เซ็นสัญญาได้','พรีเซนต์ / ประชุมสำคัญ','เริ่มงานใหม่','Networking','นำเสนอ Portfolio'];
        goldenDays.push({day,action:actions[goldenDays.length%actions.length],reason:`เจ้าวัน${dl.icon}${dl.lord}หนุน (กำลัง${dlStr.toFixed(1)}) + ${domP.emoji}${domP.name}`});
      }
    }
    for(let day=1;day<=daysInMonth&&blackDays.length<3;day++){
      const dt=new Date(ceYear,mi,day);const dow=dt.getDay();
      const dl=DAY_LORD[dow];const dlStr=ns[dl.planet]||5;
      if(dlStr<5&&(day%6===4||day%7===1||day%11===3)){
        const warns=['อย่ายื่นใบสมัคร / เซ็นสัญญา','ระวังค่าใช้จ่ายไม่คาดคิด','หลีกเลี่ยงการโต้เถียง','ระวังความเข้าใจผิด'];
        blackDays.push({day,action:warns[blackDays.length%warns.length],reason:`เจ้าวัน${dl.icon}${dl.lord}อ่อน + ${h.sa===1?'🪐เสาร์ทับลัคน์':h.ra===1?'🐉ราหูทับลัคน์':'ดาวจรกดดัน'}`});
      }
    }
    if(goldenDays.length===0)goldenDays.push({day:Math.min(10,daysInMonth),action:'จัดการงานค้างให้เสร็จ',reason:`ช่วงเล็กๆ ที่${domP.emoji}${domP.name}ส่งพลังหนุน`});
    if(blackDays.length===0)blackDays.push({day:Math.min(17,daysInMonth),action:'ระวังทำงานหนักเกินไป',reason:'พลังงานลดต่ำกว่าปกติ ควรพักผ่อน'});

    // Tags
    const tags=[];
    if(type==='golden')tags.push(['เดือนทอง','golden'],['โอกาสสูง','good']);
    else if(type==='good')tags.push(['พลังงานดี','good']);
    else if(type==='danger'){tags.push(['ระวัง','danger']);if(h.sa===1||h.ra===1||h.ma===1)tags.push(['ดาวทับลัคน์','danger'])}
    else if(type==='side')tags.push(['โชคเล็กน้อย','side']);
    else tags.push(['ปานกลาง','neutral']);
    if(balanceType==='potential_blocked')tags.push(['ศักยภาพสูง-อุปสรรคหนัก','neutral']);
    if(moonDig.d==='นิจ')tags.push(['ระวังกระแสเงินสด','danger']);

    // Planets
    const planets=[`${currentDasha.icon} ทศา${currentDasha.p}`];
    planets.push(`${domP.emoji} ${domP.name} (${TL_RASHI_TH[tr[dominant.p]]})`);
    if(dominant.p!=='ju')planets.push(`🟡 พฤหัส (${TL_RASHI_TH[tr.ju]})`);
    if(dominant.p!=='sa')planets.push(`🪐 เสาร์ (${TL_RASHI_TH[tr.sa]})`);

    // Stress markers for narrative
    const stressors=[];
    if(h.sa===1)stressors.push('เสาร์ทับลัคน์ — กดดัน เหนื่อย Burnout');
    if(h.ra===1)stressors.push('ราหูทับลัคน์ — ค่าใช้จ่ายไม่คาดคิด สับสน');
    if(h.ma===1)stressors.push('อังคารทับลัคน์ — ขัดแย้ง ใจร้อน');
    if(moonDig.d==='นิจ')stressors.push('จันทร์นิจ — กระแสเงินสดตึง อารมณ์ตก');

    // Career & Wealth Narrative (psychText)
    const dashaNote=`มหาทศา${currentDasha.icon}${currentDasha.p} (${currentDasha.theme}) ${dashaDig.d!=='ปกติ'?'— ดาวทศา'+dashaDig.desc:''}`;
    let psychText='';
    if(type==='golden'){
      psychText=`${dashaNote}\n${balanceText||'ทั้งพื้นดวงและดาวจรเปิดทาง'} ช่วงนี้เหมือนมีลมพัดหนุนหลัง ทั้ง Cashflow และ Asset ระยะยาวไปด้วยกันได้ดี`;
    }else if(type==='good'){
      psychText=`${dashaNote}\n${balanceText||'พลังงานโดยรวมดี'} Cashflow มั่นคง เหมาะลงทุนทั้งในตัวเองและทรัพย์สินระยะยาว`;
    }else if(type==='danger'){
      psychText=`${dashaNote}\n${stressors.length>0?stressors.join(' · '):'พลังงานต่ำ'}\n${balanceText||'ช่วงนี้ร่างกายและจิตใจบอกให้หยุดพัก'} ระวัง Cashflow — ลดรายจ่ายไม่จำเป็น อย่าลงทุนใหญ่`;
    }else if(type==='side'){
      psychText=`${dashaNote}\n${balanceText||'มีรายได้เสริมเข้ามาบ้าง'} Cashflow ดีขึ้นชั่วคราว แต่เป็นช่วงพีคสั้นๆ เก็บเงินไว้มากกว่าใช้`;
    }else{
      psychText=`${dashaNote}\n${balanceText||'พลังงานกลางๆ'} ใช้ช่วงนี้วางแผน Cashflow ระยะยาว มากกว่าตัดสินใจเรื่องเงินก้อนใหญ่`;
    }

    // Actionable Advice (psychTip)
    const psychTips={
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
    const workFocusTxt=maInH10?'อังคารทับเรือนการงาน — พลังทำงานสูง แต่ระวังขัดแย้งกับเพื่อนร่วมงาน':saInH10?'เสาร์ทับเรือนการงาน — งานหนัก ความรับผิดชอบสูง ผลจะเห็นช้าแต่ยั่งยืน':juH10asp2.score>0?`พฤหัส${juH10asp2.q}เรือนการงาน — โอกาสใหม่ เลื่อนตำแหน่ง/โปรเจกต์สำคัญ`:type==='danger'?'ดาวกดดัน ทำงานให้เสร็จตามเป้า ไม่ใช่เวลาขอเพิ่มงาน':'การงานปกติ เดินหน้าตามแผน';
    const moneyFocusTxt=veDig.d==='นิจ'?'ศุกร์นิจ — ระวังรายจ่ายเกินตัว หลีกเลี่ยงลงทุนใหญ่ เก็บเงินไว้ก่อน':moonDig.d==='นิจ'?'จันทร์นิจ — กระแสเงินสดตึง ระวังรายจ่ายฉุกเฉิน':juInH11?'พฤหัสอยู่เรือนลาภะ (H11) — โชคด้านการเงิน อาจมีรายได้เสริม/โบนัส/คืนภาษี':saInH2?'เสาร์ทับเรือนทรัพย์ — ควบคุมรายจ่าย สะสมมากกว่าลงทุน':veDig.d==='อุจจ์'?'ศุกร์อุจจ์ — การเงินดี เหมาะสะสมทรัพย์และลงทุนระยะยาว':'การเงินสมดุล รายรับรายจ่ายปกติ';
    const loveFocusTxt=saInH7?'เสาร์ทับเรือนความรัก (H7) — ความสัมพันธ์อาจรู้สึกหนักหรือห่างเหิน ต้องอดทนและสื่อสาร':juInH7?'พฤหัสอยู่เรือนความรัก — ความสัมพันธ์ราบรื่น อาจมีข่าวดีเรื่องคู่ครอง':veDig.d==='อุจจ์'?'ศุกร์อุจจ์ — ความรักสดใส เสน่ห์แรง เหมาะนัดพบคนสำคัญหรือวางแผนอนาคต':veDig.d==='นิจ'?'ศุกร์นิจ — ระวังความเข้าใจผิดในความสัมพันธ์ พูดคุยด้วยความใจเย็น':'ความรักปกติ ดูแลกันด้วยความใส่ใจ';
    const healthFocusTxt=(h.sa===1||h.ra===1)?'ดาวบาปทับลัคน์ — ดูแลสุขภาพเป็นพิเศษ นอนให้เพียงพอ ตรวจร่างกาย':marsDig2.d==='นิจ'?'อังคารนิจ — พลังกายต่ำ งดออกกำลังกายหนัก พักผ่อนให้เต็มที่':marsDig2.d==='อุจจ์'?'อังคารอุจจ์ — พลังกายดีเยี่ยม เหมาะเริ่มโปรแกรมออกกำลังกายหรือ detox':saInH6?'เสาร์ทับเรือนโรค — ระวังสุขภาพ ควรตรวจร่างกายประจำปี':'สุขภาพดี ออกกำลังกายสม่ำเสมอ';
    // Dominant and lowest domain
    const domainMap={work:wMs,money:moMs,love:lvMs,health:hlMs};
    const [domTopic]=Object.entries(domainMap).sort((a,b)=>b[1]-a[1])[0];
    const [lowTopic]=Object.entries(domainMap).sort((a,b)=>a[1]-b[1])[0];
    const domTopicTH={work:'การงาน',money:'การเงิน',love:'ความรัก',health:'สุขภาพ'}[domTopic];
    const lowTopicTH={work:'การงาน',money:'การเงิน',love:'ความรัก',health:'สุขภาพ'}[lowTopic];
    // Decision advice
    const decisionAdvice=type==='golden'?`✅ เดือนทองแห่งโอกาส: ตัดสินใจเรื่อง${domTopicTH==='การงาน'?'การงานได้เลย — เสนองาน ขอขึ้นเงินเดือน หรือสมัครตำแหน่งที่ดีกว่า':domTopicTH==='การเงิน'?'การเงินได้เลย — ลงทุน เปิดพอร์ต หรือสะสมทรัพย์ระยะยาว':domTopicTH==='ความรัก'?'ความรักได้เลย — นัดสำคัญ สารภาพรัก หรือวางแผนอนาคตร่วมกัน':'สุขภาพได้เลย — เริ่มโปรแกรมสุขภาพ ตรวจร่างกาย หรือปรับพฤติกรรมใหม่'}`:
      type==='danger'?`⚠️ เดือนระวัง: ${lowTopicTH==='การงาน'?'อย่าลาออกจากงานเพราะอารมณ์ ไม่ใช่เวลาตัดสินใจเรื่องอาชีพใหญ่ รอก่อน':lowTopicTH==='การเงิน'?'อย่าลงทุนใหญ่ กู้เงิน หรือเซ็นสัญญาสำคัญ รอเดือนที่ดีกว่า':lowTopicTH==='ความรัก'?'ระวังตัดสินใจเรื่องความสัมพันธ์ด้วยอารมณ์ชั่ววูบ ใจเย็นๆ':'ระวังสุขภาพ อย่าหักโหมทำงานหรือออกกำลังกายหนัก'} ${balanceText?'· '+balanceText:''}`:
      type==='side'?`💼 โอกาสรายได้เสริม: รับงานเพิ่มได้ แต่อย่าลาออกจากงานหลัก เก็บรายได้ที่ได้มา 70% ก่อน โอกาสนี้ชั่วคราว`:
      type==='good'?`😊 เดือนดี: ดำเนินการเรื่อง${domTopicTH}ได้เลย — ${domTopicTH==='การงาน'?'ขอโปรเจกต์/รับผิดชอบใหม่':domTopicTH==='การเงิน'?'วางแผนระยะยาวหรือลงทุนปานกลาง':domTopicTH==='ความรัก'?'ดูแลคนรัก วางแผนอนาคต':'ออกกำลังกาย ดูแลสุขภาพ'}`:
      `📋 เดือนวางแผน: สะสมพลังและวางแผน ยังไม่ต้องรีบตัดสินใจใหญ่เรื่อง${lowTopicTH}`;

    return{
      month:mi,monthFull:TL_MONTHS_FULL[mi],monthShort:TL_MONTHS_TH[mi],
      stars,energy,type,icon,headline,tags,
      planet:domP.name,planetEmoji:domP.emoji,
      planetEffect:`ทศา${currentDasha.p}(${dashaDig.d}) · ${dominant.asp.q} H10 · ${TL_RASHI_TH[tr[dominant.p]]}`,
      natalRashi:TL_RASHI_TH[natalR],natalRashiIcon:TL_RASHI_ICONS[natalR],
      transitInfo:`ทศา${currentDasha.p}(${dashaDig.d}) พฤหัสจร${TL_RASHI_TH[tr.ju]} เสาร์จร${TL_RASHI_TH[tr.sa]}${h.sa===1?' ⚠️ทับลัคน์':''}${h.ra===1?' ⚠️ราหูทับลัคน์':''}`,
      dashaInfo:{planet:currentDasha.p,icon:currentDasha.icon,theme:currentDasha.theme,dignity:dashaDig.d,house:dashaHouse},
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
const starsFromEnergy=(e)=>{if(e>=85)return 5;if(e>=70)return 4;if(e>=52)return 3;if(e>=35)return 2;return 1};
const starStr=(n)=>{let s='';for(let i=0;i<n;i++)s+='⭐';for(let i=n;i<5;i++)s+='☆';return s};
const starLabel=(n)=>['','เดือนยาก','เดือนระวัง','เดือนปกติ','เดือนดี','เดือนทอง'][n]||'';

// ── MBTI + Vedic Identity Helpers ──
const calcMBTI=(s)=>{const ei=((s["Energy Management"]||5)+(s["Motivation Driver"]||5))/2>=5.5?"E":"I";const ns=((s["Cognitive Processing"]||5)+(s["Integration Level"]||5)+(s["Growth Orientation"]||5))/3>=5.5?"N":"S";const tf=(s["Decision System"]||5)>=(s["Emotional Regulation"]||5)?"T":"F";const jp=((s["Identity Stability"]||5)+(s["Responsibility Load"]||5))/2>=5.5?"J":"P";return ei+ns+tf+jp};
const MBTI_META={"ENTJ":{title:"The Visionary Commander",th:"ผู้นำที่มองเห็นภาพใหญ่และเด็ดขาด"},"INTJ":{title:"The Master Strategist",th:"นักวางกลยุทธ์ที่คิดทะลุปรุโปร่ง"},"ENTP":{title:"The Innovative Disruptor",th:"นักพลิกเกมด้วยความคิดสร้างสรรค์"},"INTP":{title:"The Systems Architect",th:"สถาปนิกระบบความคิดชั้นสูง"},"ENFJ":{title:"The Inspirational Leader",th:"ผู้นำที่จุดประกายแรงบันดาลใจ"},"INFJ":{title:"The Visionary Healer",th:"ผู้มองเห็นอนาคตและสร้างการเปลี่ยนแปลง"},"ENFP":{title:"The Creative Catalyst",th:"ตัวเร่งพลังสร้างสรรค์"},"INFP":{title:"The Idealist Creator",th:"นักสร้างสรรค์ผู้ใฝ่ฝัน"},"ESTJ":{title:"The Systematic Executor",th:"ผู้บริหารระบบที่มีวินัย"},"ISTJ":{title:"The Reliable Architect",th:"สถาปนิกผู้น่าเชื่อถือ"},"ESTP":{title:"The Dynamic Problem Solver",th:"นักแก้ปัญหาพลวัต"},"ISTP":{title:"The Tactical Operator",th:"ผู้ปฏิบัติการเชิงกลยุทธ์"},"ESFJ":{title:"The Community Builder",th:"ผู้สร้างชุมชนและความสัมพันธ์"},"ISFJ":{title:"The Loyal Guardian",th:"ผู้พิทักษ์ที่ไว้วางใจได้"},"ESFP":{title:"The Energetic Performer",th:"ผู้แสดงที่เต็มไปด้วยพลังงาน"},"ISFP":{title:"The Artful Innovator",th:"นักสร้างสรรค์ผู้มีศิลปะ"}};
const MBTI_MATCH={"ENTJ":{best:["INTP","INFP"],good:["INTJ","ENTP"],why:"คุณเป็นผู้นำที่เด็ดขาด คู่ที่ดีที่สุดคือคนที่มีความคิดลึกซึ้งและสร้างสรรค์มาช่วยเติมเต็มมุมมองใหม่ๆ ให้คุณ"},"INTJ":{best:["ENTP","ENFP"],good:["ENTJ","INTP"],why:"คุณเป็นนักวางแผนที่คิดทะลุ คู่ที่ดีที่สุดคือคนที่มีพลังสร้างสรรค์และกล้าลองสิ่งใหม่ ช่วยดึงคุณออกจากโลกความคิด"},"ENTP":{best:["INTJ","INFJ"],good:["ENTJ","INTP"],why:"คุณเป็นนักคิดที่กระตือรือร้น คู่ที่ดีที่สุดคือคนที่มีวิสัยทัศน์ลึกซึ้งและช่วยให้ไอเดียของคุณเป็นจริง"},"INTP":{best:["ENTJ","ENFJ"],good:["ENTP","INTJ"],why:"คุณเป็นสถาปนิกทางความคิด คู่ที่ดีที่สุดคือผู้นำที่มีพลังขับเคลื่อนสูง ช่วยแปลงไอเดียของคุณเป็นผลลัพธ์จริง"},"ENFJ":{best:["INFP","INTP"],good:["ENFP","INFJ"],why:"คุณเป็นผู้นำที่เข้าใจคน คู่ที่ดีที่สุดคือคนที่มีโลกภายในอันลึกซึ้ง ให้คุณได้ดูแลและเติบโตไปด้วยกัน"},"INFJ":{best:["ENTP","ENFP"],good:["INFP","INTJ"],why:"คุณเป็นผู้มองเห็นอนาคต คู่ที่ดีที่สุดคือคนที่มีพลังสร้างสรรค์และความกล้า ช่วยจุดประกายให้วิสัยทัศน์ของคุณมีชีวิต"},"ENFP":{best:["INTJ","INFJ"],good:["ENFJ","ENTP"],why:"คุณเป็นตัวเร่งพลังสร้างสรรค์ คู่ที่ดีที่สุดคือคนที่มีความลึกและมั่นคง ช่วยให้คุณโฟกัสและเปล่งศักยภาพเต็มที่"},"INFP":{best:["ENTJ","ENFJ"],good:["INFJ","ENFP"],why:"คุณเป็นนักสร้างสรรค์ผู้ใฝ่ฝัน คู่ที่ดีที่สุดคือผู้นำที่เข้มแข็งแต่อบอุ่น ช่วยพาความฝันของคุณลงมือทำจริง"},"ESTJ":{best:["ISTP","ISFP"],good:["ISTJ","ESTP"],why:"คุณเป็นผู้บริหารที่มีระบบ คู่ที่ดีที่สุดคือคนที่ยืดหยุ่นและมีศิลปะ ช่วยให้ชีวิตมีสีสันมากขึ้น"},"ISTJ":{best:["ESFP","ESTP"],good:["ESTJ","ISFJ"],why:"คุณเป็นคนน่าเชื่อถือและมั่นคง คู่ที่ดีที่สุดคือคนที่มีพลังงานสูงและสนุกสนาน ช่วยเติมความสดใสในชีวิต"},"ESTP":{best:["ISFJ","ISTJ"],good:["ISTP","ESFP"],why:"คุณเป็นนักแก้ปัญหาที่ว่องไว คู่ที่ดีที่สุดคือคนที่อบอุ่นและใส่ใจรายละเอียด ช่วยสร้างความมั่นคงให้ชีวิต"},"ISTP":{best:["ESFJ","ESTJ"],good:["ESTP","ISFP"],why:"คุณเป็นผู้ปฏิบัติการเชิงกลยุทธ์ คู่ที่ดีที่สุดคือคนที่อบอุ่นและดูแลคนรอบข้างเก่ง ช่วยสร้างสมดุลให้ชีวิต"},"ESFJ":{best:["ISTP","ISFP"],good:["ESFP","ISFJ"],why:"คุณเป็นผู้สร้างชุมชน คู่ที่ดีที่สุดคือคนที่เป็นตัวของตัวเองสูงและมีมุมมองที่ต่าง ช่วยให้คุณเปิดกว้างมากขึ้น"},"ISFJ":{best:["ESTP","ESFP"],good:["ISFP","ESFJ"],why:"คุณเป็นผู้พิทักษ์ที่ไว้ใจได้ คู่ที่ดีที่สุดคือคนที่มีพลังงานสูงและกล้าเสี่ยง ช่วยพาคุณออกจาก comfort zone"},"ESFP":{best:["ISFJ","ISTJ"],good:["ESTP","ESFJ"],why:"คุณเป็นคนเต็มไปด้วยพลังงาน คู่ที่ดีที่สุดคือคนที่มั่นคงและใส่ใจ ช่วยให้คุณมีฐานที่แข็งแกร่ง"},"ISFP":{best:["ESFJ","ESTJ"],good:["ENFJ","ISFJ"],why:"คุณเป็นนักสร้างสรรค์ผู้มีศิลปะ คู่ที่ดีที่สุดคือคนที่มีพลังสังคมสูงและจัดระเบียบเก่ง ช่วยเปิดโอกาสใหม่ๆ ให้คุณ"}};
const calcDomPlanet=(v)=>{const pMap={"Cognitive Processing":"พุธ","Emotional Regulation":"จันทร์","Identity Stability":"อาทิตย์","Energy Management":"อังคาร","Decision System":"พฤหัส","Responsibility Load":"เสาร์","Motivation Driver":"อาทิตย์","Boundary System":"เสาร์","Stress Response":"เสาร์","Shadow Pattern":"ราหู","Growth Orientation":"พฤหัส","Integration Level":"พุธ"};const pMeta={"พุธ":{en:"Mercury",icon:"⚡",power:"ปัญญาเฉียบแหลม สื่อสารชั้นยอด"},"จันทร์":{en:"Moon",icon:"🌙",power:"เข้าใจอารมณ์คน สร้างความไว้วางใจ"},"อาทิตย์":{en:"Sun",icon:"☀️",power:"ความเป็นผู้นำและความมั่นใจสูง"},"อังคาร":{en:"Mars",icon:"🔴",power:"พลังนักรบ ลงมือทำไม่รอช้า"},"พฤหัส":{en:"Jupiter",icon:"🟡",power:"ปัญญาเปิดกว้าง ดึงดูดโชคและโอกาส"},"ศุกร์":{en:"Venus",icon:"💚",power:"ดึงดูดคน สร้างความร่วมมือ"},"เสาร์":{en:"Saturn",icon:"🪐",power:"วินัยสูง สร้างสิ่งยั่งยืน"},"ราหู":{en:"Rahu",icon:"🌑",power:"ทลายขีดจำกัด สร้างสิ่งที่ไม่เคยมีมาก่อน"}};const sorted=Object.entries(v||{}).sort((a,b)=>b[1]-a[1]);const topDim=sorted[0]?.[0]||"Cognitive Processing";const pName=pMap[topDim]||"พฤหัส";return{planet:pName,...(pMeta[pName]||pMeta["พฤหัส"])}};

// Vedic scoring
const calcV=(bd,ts)=>{const m=parseInt(bd?.split("-")?.[1])||6;const d=parseInt(bd?.split("-")?.[2])||15;const s=(m*31+d)%100;const tb={dawn:5,morning:3,noon:0,evening:2,night:-2}[ts]||0;const ps={me:Math.min(40,20+(s%20)+tb),mo:Math.min(40,18+((s*3)%22)+tb),su:Math.min(40,22+((s*7)%18)+tb),ma:Math.min(40,19+((s*11)%21)+tb),ju:Math.min(40,21+((s*13)%19)+tb),sa:Math.min(40,17+((s*17)%23)+tb),ra:Math.min(40,15+((s*19)%25)+tb)};const f=(p,i)=>Math.min(100,p+Math.min(25,10+((s+i)%15))+Math.min(20,8+((s*2+i)%12))+Math.min(15,5+((s*3+i)%10)));return{"Cognitive Processing":f(ps.me,1)/10,"Emotional Regulation":f(ps.mo,2)/10,"Identity Stability":f(Math.round((ps.su+ps.sa)/2),3)/10,"Energy Management":f(ps.ma,4)/10,"Decision System":f(Math.round((ps.ju+ps.sa)/2),5)/10,"Responsibility Load":f(ps.sa,6)/10,"Motivation Driver":f(ps.su,7)/10,"Boundary System":f(Math.round((ps.sa+ps.mo)/2),8)/10,"Stress Response":f(ps.sa,9)/10,"Shadow Pattern":f(ps.ra,10)/10,"Growth Orientation":f(ps.ju,11)/10,"Integration Level":f(Math.round(Object.values(ps).reduce((a,b)=>a+b,0)/7),12)/10}};
const calcS=(v,ans)=>{const sc={};DIMS.forEach(dim=>{const vd=v[dim]||5;let raw=0,cnt=0;const dd=DM[dim];if(dd)dd.q.forEach((_,i)=>{const k=`${dim}-${i}`;if(ans[k]!==undefined){let val=ans[k];if(dd.rev)val=4-val;raw+=val;cnt++}});const ap=cnt>0?(raw/(cnt*4))*10:5;let fi=vd*.6+ap*.4;if(vd>7&&ap<4)fi-=1.5;if(vd<4&&ap>7)fi+=.5;sc[dim]=Math.max(0,Math.min(10,Math.round(fi*10)/10))});return sc};

// Vedic System Prompt — Psychologist + Healer Tone
const VEDIC_SYS=`คุณเป็นนักจิตวิทยาการปรึกษา(Counseling Psychologist)ที่ผสมผสานโหราศาสตร์ไทย(Jyotish/สุริยาตร์)เข้ากับจิตวิทยาเชิงบวก(Positive Psychology)
บุคลิกการสื่อสาร:
- พูดอ่อนโยน อบอุ่น เหมือนพี่ที่ปรึกษาที่เข้าใจเรา
- ใช้ภาษาง่ายๆ ไม่ใช้ศัพท์วิชาการยาก อธิบายเหมือนเล่าให้เพื่อนฟัง
- ทุกประโยคต้อง "ฮีลใจ" — ให้กำลังใจ มองเห็นคุณค่าในตัวเขา
- ห้ามขู่ให้กลัว ห้ามพูดเชิงลบ แม้ดวงไม่ดีก็ต้องบอกว่า "ช่วงนี้คือช่วงพักฟื้น" หรือ "เป็นบทเรียนที่จะทำให้แข็งแกร่งขึ้น"
- ใช้คำเปรียบเทียบที่เข้าใจง่าย เช่น "เหมือนต้นไม้ที่กำลังหยั่งราก ก่อนจะเติบโตสูง"
- จบประโยคด้วยการให้พลังบวก เช่น "คุณทำได้ดีกว่าที่คิด" หรือ "ค่อยๆ ก้าวไป ไม่ต้องรีบ"
หลักโหราศาสตร์ไทย: ลัคนา=จุดเริ่มต้น / ดาว9ดวง: อาทิตย์ จันทร์ อังคาร พุธ พฤหัส ศุกร์ เสาร์ ราหู เกตุ
เรือน12: ตนุ กดุมภะ สหัชชะ พันธุ ปุตตะ อริ ปัตนิ มรณะ ศุภะ กัมมะ ลาภะ วินาศ
สภาพดาว: อุจจ์/นิจ/เกษตร / Dasha: มหาทศา→อันตรทศา
Mapping: พุธ→ความคิด จันทร์→อารมณ์ อาทิตย์+เสาร์→ตัวตน อังคาร→พลังงาน พฤหัส+เสาร์→การตัดสินใจ เสาร์→ความรับผิดชอบ อาทิตย์→แรงจูงใจ ราหู/เกตุ→ด้านที่ซ่อนอยู่ พฤหัส→การเติบโต
กฎ: ดาวอุจจ์="คุณมีของขวัญพิเศษในตัว" / ดาวนิจ="ต้องใช้ความพยายามมากกว่าคนอื่นนิดหนึ่ง แต่ผลลัพธ์จะยิ่งใหญ่" / ราหู/เกตุ="บทเรียนที่จะทำให้เติบโตมากที่สุดในชีวิตนี้"
ตอบภาษาไทยเท่านั้น สั้นกระชับ อ่านง่าย ฮีลใจ`;

// GPT
const GPT={cache:{},_q:[],_n:0,_max:6,_run(){while(GPT._n<GPT._max&&GPT._q.length>0){GPT._n++;const{fn,res}=GPT._q.shift();fn().then(r=>{GPT._n--;GPT._run();res(r)}).catch(()=>{GPT._n--;GPT._run();res(GPT.fb())})}},call:(prompt,key,maxTokens)=>{if(key&&GPT.cache[key])return Promise.resolve(GPT.cache[key]);return new Promise(res=>{const safety=setTimeout(()=>res(GPT.fb(key)),30000);GPT._q.push({fn:async()=>{try{const ctrl=new AbortController();const tm=setTimeout(()=>ctrl.abort(),25000);const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt,system:VEDIC_SYS,maxTokens}),signal:ctrl.signal});clearTimeout(tm);clearTimeout(safety);const d=await r.json();if(d.error)return GPT.fb(key);const t=d.text||"";if(key)GPT.cache[key]=t;return t}catch{clearTimeout(safety);return GPT.fb(key)}},res});GPT._run()})},
fb:k=>{if(!k)return"กำลังวิเคราะห์ให้คุณนะคะ...";if(k.startsWith("id_")||k.startsWith("idv2_")||k.startsWith("idv3_")||k.startsWith("idv4_"))return JSON.stringify({powerTitle:"The Strategic Visionary",who:{mbtiLabel:"INTJ + พลังดาวพฤหัส (Jupiter)",mbtiCore:"INTJ – นักวางกลยุทธ์ที่มองเห็นภาพใหญ่และชอบออกแบบระบบ คุณคิดลึกกว่าคนส่วนใหญ่และมักเห็นทางออกที่คนอื่นมองข้าม",vedicSoul:"Jupiter Energy (พฤหัส) – ดาวแห่งปัญญาและการขยายตัว ส่งพลังให้คุณมีวิสัยทัศน์กว้างและดึงดูดโอกาสดีๆ เข้ามาในชีวิต มากกว่าคน INTJ ทั่วไป",hiddenPower:"The Pattern Reader – พลังแฝงของคุณคือการมองเห็นรูปแบบ (Pattern) ที่ซ่อนอยู่ในความซับซ้อน แล้วแปลงมันเป็นแผนที่นำทางสู่ความสำเร็จ",bestMatch:{best:[{type:"ENTP",title:"The Innovative Disruptor",th:"นักพลิกเกมด้วยความคิดสร้างสรรค์"},{type:"ENFP",title:"The Creative Catalyst",th:"ตัวเร่งพลังสร้างสรรค์"}],good:[{type:"ENTJ",title:"The Visionary Commander",th:"ผู้นำที่มองเห็นภาพใหญ่และเด็ดขาด"},{type:"INTP",title:"The Systems Architect",th:"สถาปนิกระบบความคิดชั้นสูง"}],why:"คุณเป็นนักวางแผนที่คิดทะลุ คู่ที่ดีที่สุดคือคนที่มีพลังสร้างสรรค์และกล้าลองสิ่งใหม่ ช่วยดึงคุณออกจากโลกความคิด"}},what:{skillTitle:"Strategic Systems Design",skillHighlight:"การวางระบบและแก้ปัญหาเชิงกลยุทธ์ – ทักษะหายากที่ตลาดต้องการสูง",marketValue:"Top 10%",moneyMaker:"คุณทำเงินได้มากที่สุดจากการ 'มองเห็นโอกาสในความซับซ้อน' แล้วแปลงมันเป็นระบบที่คนอื่นสามารถนำไปใช้สร้างผลลัพธ์จริงได้",gapToClose:"ทักษะการนำเสนอ (Storytelling) ยังมีพื้นที่พัฒนา — การเรียนรู้นำเสนอไอเดียให้คนอื่น 'รู้สึก' ได้ จะทำให้มูลค่าของคุณเพิ่มขึ้นหลายเท่า"},when:{periodLabel:"ช่วงสะสมพลัง",statusLabel:"ช่วงสะสมพลัง",statusColor:"yellow",currentDesc:"ตอนนี้คุณอยู่ในช่วงที่เหมาะกับการสร้างรากฐาน เรียนรู้ และวางแผนระยะยาว ดาวกำลังเตรียมพลังให้คุณก้าวใหญ่ในอีกไม่นาน",goldenWindow:"ปลายปีนี้ – ต้นปีหน้า",goldenDesc:"ช่วงที่ดาวพฤหัส (ดาวแห่งโอกาส) จะมาหนุนชีวิตคุณ ทำให้ทุกการลงทุนด้านตัวเองได้ผลตอบแทนสูงขึ้น",actionPlan:"ใช้เวลานี้ พัฒนาทักษะสำคัญ 1-2 อย่างให้ลึก และขยายเครือข่ายคนที่ใช่ แล้วเตรียมพร้อมสำหรับโอกาสที่กำลังจะมา",warning:"ระวังการตัดสินใจใหญ่โดยไม่มีข้อมูลเพียงพอ ดาวแนะนำให้รอจังหวะที่ชัดเจนก่อนลงมือ"}});if(k.startsWith("core_")||k.startsWith("corev2_"))return"🧠 Cognitive (พุธ): ประมวลผลข้อมูลแม่นยำ คิดเป็นระบบ สื่อสารได้ฉับไว\n\n🌊 Emotional (จันทร์): อารมณ์มีความละเอียดอ่อน ต้องใช้สติคอยประคองในช่วงที่กดดัน\n\n⚓ Identity (อาทิตย์+เสาร์): แกนตัวตนมีความรับผิดชอบสูง เป้าหมายชัดเจน แต่อาจมีแรงกดดันแฝงอยู่\n\n🌑 Shadow (ราหู/เกตุ): ⚠️ มีจุดเปราะบางที่ควรสำรวจ — Shadow Analysis จะช่วยคลี่คลายแพทเทิร์นที่ซ่อนอยู่ได้ 🔓\n\n🌱 Growth (พฤหัส): มีแรงขับพัฒนาตนเองอย่างมีทิศทาง วิสัยทัศน์เปิดกว้าง เรียนรู้ไม่หยุด";if(k.startsWith("sh_")||k.startsWith("shv2_"))return"Shadow Analysis\n🌑 Shadow Score: 6.0/10 (คะแนนผลการทดสอบ) | 5.8/10 (ศักยภาพพื้นดวง)\nราหู/เกตุในดวงคุณไม่ใช่สิ่งน่ากลัว แต่คือบทเรียนที่สำคัญที่สุดในชีวิตนี้ครับ คะแนนผลการทดสอบที่สูงกว่าพื้นดวงแสดงว่าคุณกำลังเรียนรู้และพัฒนาตัวเองได้ดีมาก\n⚡ Trigger\nสิ่งที่กระตุ้น Shadow ของคุณได้ง่ายที่สุดคือความไม่แน่นอนและสถานการณ์ที่ควบคุมไม่ได้ พลังของราหูจะดึงคุณเข้าสู่โหมดกังวลเมื่อแผนไม่เป็นไปตามที่คาดไว้\n🔄 Pattern\nคุณมักจะตกอยู่ในวงจรคิดวนซ้ำเพื่อหาทางออกที่ดีที่สุด จนบางครั้งลืมที่จะลงมือทำจริง ซึ่งเป็นเรื่องที่ค่อยๆ ฝึกแก้ได้ครับ\n💡 วิธีแก้ตามดาว\n   1. ใช้ตรรกะสยบอารมณ์ (ดาวพุธ): เมื่อ Shadow เริ่มทำงาน จดสิ่งที่กังวลออกมาเป็น List เหมือนการเขียน task ช่วยลดพลังดาวจันทร์ที่อ่อนแรงลงได้\n   2. ตั้ง Boundary ด้วยการ Say No (ราหู): ฝึกปฏิเสธสิ่งที่ไม่สอดคล้องกับ Goal หลักเพื่อรักษาพลังงานไว้กับสิ่งสำคัญจริงๆ\n   3. เปลี่ยนความกลัวเป็นงานวิจัย (ดาวเสาร์): หากกังวลเรื่องใด ใช้เวลานั้นศึกษาข้อมูลเชิงลึกแทน พลังเสาร์จะเปลี่ยนความกลัวเป็นนวัตกรรม\n   4. ยอมรับความไม่สมบูรณ์แบบ (ดาวจันทร์): ช่วงที่กราฟชีวิตดิ่งลงคือช่วงที่ระบบกำลัง Recalibrate ตัวเองใหม่ ไม่ใช่ความล้มเหลว";if(k.startsWith("pr_"))return"เมื่อดาวแห่งปัญญาและแสงส่องพลัง ชีวิตจะงดงามที่สุดในช่วงที่คุณได้เปล่งศักยภาพออกมาเต็มที่ แต่เมื่อเข้าสู่ช่วงดำมืดที่รู้สึกหนักและสับสน ทุกครั้งที่ผ่านได้เพราะพลังแห่งการเรียนรู้และความอดทนจากดาวที่หนุนดวงคุณมาตั้งแต่เกิด";if(k.startsWith("f12_")||k.startsWith("f12v2_"))return"บทวิเคราะห์ศักยภาพรายบุคคล: Human System Intelligence\nจากการวิเคราะห์เปรียบเทียบระหว่าง \"ศักยภาพพื้นดวง (Vedic Potential)\" และ \"คะแนนผลการทดสอบ (Actual Assessment)\" ผ่าน 12 มิติชี้วัด นี่คือข้อมูลเชิงลึกของคุณครับ:\n🌟 มิติที่เป็นจุดแข็ง (Core Strengths)\n1. Integration Level (ศักยภาพพื้นดวง 7.8 | คะแนนผลการทดสอบ 7.5)\n   * ดาวเด่น: ดาวพุธ (Mercury) ปกติ\n   * วิเคราะห์: คุณมีความสามารถในการเชื่อมโยงข้อมูลและสร้างระบบที่ดีเยี่ยม คะแนนผลการทดสอบสะท้อนว่าคุณใช้ศักยภาพนี้ได้จริงในชีวิตประจำวัน โดดเด่นในการมองภาพรวมและจัดการความซับซ้อน\n2. Cognitive Processing (ศักยภาพพื้นดวง 7.5 | คะแนนผลการทดสอบ 7.2)\n   * ดาวเด่น: ดาวพุธ (Mercury) ปกติ\n   * วิเคราะห์: การประมวลผลความคิดของคุณมีความคมชัดและเป็นระบบ คุณสามารถวิเคราะห์สถานการณ์ได้รวดเร็วและแม่นยำ ซึ่งเป็นทรัพยากรที่มีค่ามากในทุกสาขาอาชีพ\n3. Motivation Driver (ศักยภาพพื้นดวง 7.2 | คะแนนผลการทดสอบ 7.0)\n   * ดาวเด่น: ดาวอาทิตย์ (Sun) ปกติ\n   * วิเคราะห์: แรงขับเคลื่อนภายในของคุณแข็งแกร่งและมีทิศทางชัดเจน คุณรู้ว่าต้องการอะไรและมุ่งมั่นไปถึงเป้าหมาย ดาวอาทิตย์ให้พลังความมั่นใจในตัวเองที่มั่นคง\n⚠️ มิติที่ควรเฝ้าระวังและพัฒนา (Strategic Areas)\n1. Emotional Regulation (ศักยภาพพื้นดวง 5.5 | คะแนนผลการทดสอบ 6.0)\n   * ดาวที่ส่งผล: ดาวจันทร์ (Moon)\n   * วิเคราะห์: พื้นดวงมีจุดเปราะบางด้านอารมณ์เล็กน้อย แต่คะแนนผลการทดสอบที่สูงกว่าพื้นดวงแสดงว่าคุณมีทักษะ Self-Mastery ที่ดี ควรระวังช่วงที่ร่างกายอ่อนเพลียเป็นพิเศษ\n2. Shadow Pattern (ศักยภาพพื้นดวง 5.8 | คะแนนผลการทดสอบ 6.2)\n   * ดาวที่ส่งผล: ราหู/เกตุ\n   * วิเคราะห์: ทุกคนมีด้านนี้และมันคือบทเรียนที่ทำให้คุณเติบโตมากที่สุด การตระหนักรู้คือก้าวแรกที่ดีที่สุดแล้ว ค่อยๆ สำรวจและยอมรับได้เลยครับ\n3. Boundary System (ศักยภาพพื้นดวง 6.0 | คะแนนผลการทดสอบ 6.3)\n   * ดาวที่ส่งผล: ดาวเสาร์ (Saturn)\n   * วิเคราะห์: การตั้งขอบเขตชัดเจนจะช่วยรักษาพลังงานของคุณไว้กับสิ่งสำคัญ ฝึกปฏิเสธสิ่งที่ไม่สอดคล้องกับเป้าหมาย พลังงานที่ประหยัดได้จะไปเสริมจุดแข็งของคุณ\n💡 บทสรุปกลยุทธ์ (Key Insight)\n\"ใช้พลังความคิดเชิงระบบและแรงขับเคลื่อนเป็นฐาน ดูแลพลังงานอารมณ์ด้วยการตั้ง Boundary ที่ชัดเจน แล้วคุณจะไปถึงเป้าหมายได้อย่างยั่งยืน\"";if(k.startsWith("wk_"))return'{"do":["สัปดาห์นี้ลองใช้จุดเด่นของตัวเองให้เต็มที่นะ ดาวหนุนอยู่","ลองหยุดสังเกตอารมณ์ตัวเองสักนิดก่อนตอบสนอง จะช่วยได้มากเลย","หาเวลาทำสิ่งที่ชอบสัก 30 นาที ให้รางวัลตัวเองบ้าง"],"dont":["ถ้าอารมณ์ขึ้นมา ลองหายใจลึกๆ ก่อนตัดสินใจนะ ไม่ต้องรีบ","เรื่องที่ค้างอยู่ ลองจัดการทีละอย่าง ไม่ต้องกดดันตัวเอง","ถ้ารู้สึกเหนื่อยก็พักได้ การปฏิเสธงานที่เกินกำลังคือการดูแลตัวเอง"]}';if(k.startsWith("en_")){const dn=["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];const moods=["🌟 วันที่สดใส","😊 ใจสงบดี","🔥 พลังเต็ม","🧠 หัวใส","📚 เปิดรับสิ่งใหม่","💎 ผ่อนคลายดี","🌿 ค่อยๆ ไป"];const energies=[72,68,78,65,82,75,58];const tips=["ดาวส่งพลังดี ใช้ช่วงเช้าทำสิ่งสำคัญ","พลังงานนุ่มนวล เหมาะดูแลตัวเอง","ร่างกายและจิตใจพร้อม ลงมือทำได้เลย","สมองคมชัด เหมาะพูดคุยแลกเปลี่ยน","วันดีมาก เหมาะเรียนรู้และตัดสินใจ","ให้รางวัลตัวเอง พักผ่อนกับคนที่รัก","ใจเย็นๆ ไม่ต้องเร่ง ทำทีละอย่างก็พอ"];const t=new Date();return JSON.stringify(Array.from({length:7},(_,i)=>{const d=new Date(t);d.setDate(d.getDate()+i);return{day:`${dn[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`,date:`${d.getDate()}/${d.getMonth()+1}`,energy:energies[i],mood:moods[i],tip:tips[i],transit:`เจ้าวัน${dn[d.getDay()]}`,goodFor:["วางแผน","พักผ่อน","ลงมือทำ","ประชุม","ตัดสินใจ","สังสรรค์","จัดระเบียบ"][i]}}))};if(k.startsWith("dec_"))return JSON.stringify({verdict:"รอก่อน",verdictColor:"yellow",confidence:62,cards:[{system:"Vedic",icon:"🔯",color:"#F59E0B",answer:"ยังไม่ถึงเวลา",reason:"เสาร์กำลังจรผ่านเรือนสำคัญ บีบคั้นและทดสอบ แต่จะปลดปล่อยในอีก 2–3 เดือน",score:5,action:"เตรียมตัวและรอจังหวะดาวย้าย"},{system:"Western",icon:"⭐",color:"#3B82F6",answer:"โอกาสกำลังเปิด",reason:"พฤหัสกำลังเข้าตรีโกณ ส่งแรงบวกด้านการขยายตัว แต่ต้องการความพร้อมก่อน",score:7,action:"ลองเริ่มเล็กๆ แล้วขยายทีหลัง"},{system:"Chinese",icon:"☯️",color:"#EF4444",answer:"ปีนี้ต้องระวัง",reason:"ดวงชะตาปีนี้มีดาวเคราะห์ร้ายเข้าประจำ ควรระมัดระวังการตัดสินใจใหญ่",score:4,action:"รอผ่านช่วงนี้ไปก่อน"},{system:"Thai",icon:"🌸",color:"#8B5CF6",answer:"เดือนหน้าดีกว่า",reason:"พฤหัสเสริมลัคนาชะตา ส่งผลดีเดือนหน้า เหมาะกว่าการรีบลงมือตอนนี้",score:6,action:"นัดหมายหรือเริ่มเดือนหน้า"}],ai_summary:"จากการวิเคราะห์ทุกศาสตร์พบว่า ตอนนี้เป็นช่วงเปลี่ยนผ่าน ทุกสัญญาณชี้ว่า 'รอ' ดีกว่า 'รีบ' แต่ไม่ใช่รอเฉยๆ คือรอพร้อมเตรียมตัว ช่วงที่ดีที่สุดคือ 2–3 เดือนข้างหน้า",action_plan:["ใช้เวลานี้เก็บข้อมูลและเตรียมความพร้อม","กำหนด deadline ให้ตัวเองว่าจะตัดสินใจเดือนไหน","ถ้าต้องทำตอนนี้ให้เริ่มเล็กๆ ก่อนแล้วขยาย"]});if(k.startsWith("job_"))return'[{"title":"Data Analyst","titleTH":"นักวิเคราะห์ข้อมูล","match":85,"dims":"ความคิด + การตัดสินใจ + ความรับผิดชอบ","reason":"คุณมีพรสวรรค์ด้านการคิดวิเคราะห์ที่โดดเด่นมาก ดาวพุธและพฤหัสหนุนให้คุณมองเห็นรายละเอียดที่คนอื่นมองข้าม งานนี้เหมาะกับคุณมากเลย"},{"title":"Project Manager","titleTH":"ผู้จัดการโปรเจกต์","match":80,"dims":"พลังงาน + การตัดสินใจ + รับมือแรงกดดัน","reason":"คุณเป็นคนที่มีพลังขับเคลื่อนสูงและตัดสินใจได้ดี ดาวอังคารกับพฤหัสส่งพลังให้คุณนำทีมได้อย่างมั่นคง เชื่อมั่นในตัวเองได้เลย"},{"title":"UX Researcher","titleTH":"นักวิจัย UX","match":78,"dims":"ความคิด + อารมณ์ + การเติบโต","reason":"จุดเด่นของคุณคือเข้าใจคนอื่นได้ลึกซึ้ง ดาวจันทร์ให้ความเข้าอกเข้าใจ ดาวพฤหัสเปิดทางให้เรียนรู้ไม่หยุด งานนี้จะทำให้คุณเติบโตได้เต็มที่"}]';return null}};
const pJ=t=>{if(!t)return null;try{return JSON.parse(t.replace(/```json\s*/g,"").replace(/```/g,"").trim())}catch{return null}};
const ST={set:(k,v)=>{try{localStorage.setItem(`hss6_${k}`,JSON.stringify(v))}catch{}},get:k=>{try{const s=localStorage.getItem(`hss6_${k}`);return s?JSON.parse(s):null}catch{return null}}};

const css=`@keyframes hs{to{transform:rotate(360deg)}}@keyframes hb{50%{opacity:0}}@keyframes hfl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`;
const Spin=({t="AI กำลังวิเคราะห์..."})=><div style={{padding:"12px 0",display:"flex",alignItems:"center",gap:8}}><div style={{width:16,height:16,borderRadius:"50%",border:"2.5px solid #E0E7FF",borderTopColor:"#6366F1",animation:"hs .7s linear infinite"}}/><span style={{fontSize:12,color:"#6366F1",fontWeight:600}}>{t}</span></div>;
const fmtAI=t=>t?t.replace(/\n+([🌟⚠️💡⚡🔄✨🌑])/g,'\n\n$1').replace(/\n+(---)/g,'\n\n$1'):t;
const Typer=({text})=>{const tx=fmtAI(text);const[s,setS]=useState("");const[d,setD]=useState(false);useEffect(()=>{if(!tx)return;let i=0;setS("");setD(false);const iv=setInterval(()=>{i+=3;if(i>=tx.length){setS(tx);setD(true);clearInterval(iv)}else setS(tx.slice(0,i))},12);return()=>clearInterval(iv)},[tx]);return<div style={{fontSize:13,lineHeight:1.8,color:"#374151",whiteSpace:"pre-wrap"}}>{s}{!d&&<span style={{display:"inline-block",width:2,height:14,background:"#6366F1",marginLeft:1,animation:"hb .8s step-end infinite"}}/>}</div>};
const Spider=({scores,size=260})=>{const keys=Object.keys(scores);const vals=Object.values(scores);const n=keys.length;const cx=size/2,cy=size/2,r=size*.34;const pt=(i,v)=>{const a=Math.PI*2*i/n-Math.PI/2;return{x:cx+Math.cos(a)*v/10*r,y:cy+Math.sin(a)*v/10*r}};return<svg viewBox={`0 0 ${size} ${size}`} style={{width:"100%",maxWidth:300}}><defs><radialGradient id="spBg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.6"/><stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.1"/></radialGradient><linearGradient id="spFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity="0.35"/><stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.25"/><stop offset="100%" stopColor="#A78BFA" stopOpacity="0.18"/></linearGradient><linearGradient id="spStroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4F46E5"/><stop offset="100%" stopColor="#7C3AED"/></linearGradient><filter id="spGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx={cx} cy={cy} r={r*1.05} fill="url(#spBg)"/>{[2,4,6,8,10].map(l=><polygon key={l} points={keys.map((_,i)=>{const p=pt(i,l);return`${p.x},${p.y}`}).join(" ")} fill="none" stroke={l===10?"#CBD5E1":"#E2E8F0"} strokeWidth={l===10?"0.8":"0.5"} strokeDasharray={l===10?"":"2,2"}/>)}{keys.map((_,i)=>{const p=pt(i,10);return<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E2E8F0" strokeWidth=".4"/>})}<polygon points={keys.map((_,i)=>{const p=pt(i,vals[i]);return`${p.x},${p.y}`}).join(" ")} fill="url(#spFill)" stroke="url(#spStroke)" strokeWidth="2.2" filter="url(#spGlow)" strokeLinejoin="round"/>{keys.map((_,i)=>{const p=pt(i,vals[i]);const v=vals[i];const c=v>=7.5?"#10B981":v>=5?"#6366F1":"#EF4444";return<circle key={i} cx={p.x} cy={p.y} r="3.5" fill={c} stroke="#fff" strokeWidth="1.5"/>})}{keys.map((k,i)=>{const p=pt(i,12.8);const sh=k.length>12?k.slice(0,10)+"…":k;return<text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" style={{fontSize:"5.5px",fill:"#475569",fontWeight:600}}>{sh}</text>})}</svg>};
const Card=({children,style={}})=><div style={{background:"#fff",borderRadius:14,padding:"16px 18px",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,.04)",border:"1px solid #F1F5F9",...style}}>{children}</div>;
const Btn=({children,ok=true,onClick,style={}})=><button onClick={ok?onClick:undefined} style={{padding:"12px 20px",fontSize:14,fontWeight:700,background:ok?"linear-gradient(135deg,#4338CA,#6D28D9)":"#E2E8F0",color:ok?"#fff":"#94A3B8",border:"none",borderRadius:10,cursor:ok?"pointer":"not-allowed",width:"100%",boxShadow:ok?"0 4px 14px rgba(79,70,229,.2)":"none",...style}}>{children}</button>;

// ── Identity Snapshot Card (WHO / WHAT / WHEN) ──
const IdentitySnapshotCard=({data,scores})=>{
  if(!data||!data.powerTitle)return null;
  const {powerTitle,who,what,when}=data;
  // Inject bestMatch from local data if missing (e.g. cached from DB)
  if(who&&!who.bestMatch&&scores){const mbti=calcMBTI(scores);const matchData=MBTI_MATCH[mbti];if(matchData){who.bestMatch={best:(matchData.best||[]).map(t=>({type:t,title:MBTI_META[t]?.title||t,th:MBTI_META[t]?.th||t})),good:(matchData.good||[]).map(t=>({type:t,title:MBTI_META[t]?.title||t,th:MBTI_META[t]?.th||t})),why:matchData.why}}}
  const statusBg=when?.statusColor==="green"?"#ECFDF5":when?.statusColor==="red"?"#FFF1F2":"#FFFBEB";
  const statusBorder=when?.statusColor==="green"?"#10B981":when?.statusColor==="red"?"#EF4444":"#F59E0B";
  const statusDot=when?.statusColor==="green"?"🟢":when?.statusColor==="red"?"🔴":"🟡";
  return<div>
    {/* Power Title Banner */}
    <div style={{background:"linear-gradient(135deg,#1E1B4B,#312E81)",borderRadius:12,padding:"14px 16px",marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:10,color:"#A5B4FC",fontWeight:600,letterSpacing:1,marginBottom:4}}>✦ YOUR IDENTITY ARCHETYPE</div>
      <div style={{fontSize:16,fontWeight:800,color:"#fff",lineHeight:1.3}}>{powerTitle}</div>
    </div>

    {/* Section 1: WHO */}
    <div style={{background:"#fff",borderRadius:12,border:"1px solid #E0E7FF",marginBottom:10,overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#4338CA,#6366F1)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:18}}>1️⃣</span>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>WHO – พลังแฝงของคุณ</div>
          <div style={{fontSize:10,color:"#C7D2FE"}}>Identity & Soul</div>
        </div>
        {who?.mbtiLabel&&<span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:"#fff",background:"rgba(255,255,255,.2)",padding:"3px 8px",borderRadius:8,whiteSpace:"nowrap"}}>{who.mbtiLabel}</span>}
      </div>
      <div style={{padding:"12px 14px"}}>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:3}}>MBTI Core</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{who?.mbtiCore}</div>
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:700,color:"#6366F1",marginBottom:3}}>Vedic Soul (พลังดาวประจำตัว)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{who?.vedicSoul}</div>
        </div>
        <div style={{background:"#EEF2FF",borderRadius:8,padding:"8px 10px",borderLeft:"3px solid #6366F1",marginBottom:who?.bestMatch?10:0}}>
          <div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:2}}>Hidden Power (พลังแฝงที่รอปลดล็อก)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#1E293B",fontWeight:500}}>{who?.hiddenPower}</div>
        </div>
        {who?.bestMatch&&<div style={{background:"linear-gradient(135deg,#FDF2F8,#EEF2FF)",borderRadius:8,padding:"10px 12px",border:"1px solid #E0E7FF"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#7C3AED",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:14}}>💞</span> MBTI Matching (คุณเหมาะกับคนแบบไหน)
          </div>
          <div style={{fontSize:11,fontWeight:700,color:"#4338CA",marginBottom:4}}>Best Match — คู่ที่เติมเต็มที่สุด</div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
            {who.bestMatch.best?.map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",borderRadius:6,padding:"6px 8px",border:"1px solid #C4B5FD"}}>
              <span style={{fontSize:11,fontWeight:800,color:"#7C3AED",minWidth:40}}>{m.type}</span>
              <div><div style={{fontSize:11,fontWeight:600,color:"#1E293B"}}>{m.title}</div><div style={{fontSize:10,color:"#6B7280"}}>{m.th}</div></div>
            </div>)}
          </div>
          <div style={{fontSize:11,fontWeight:700,color:"#6366F1",marginBottom:4}}>Good Match — เข้ากันได้ดี</div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
            {who.bestMatch.good?.map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",borderRadius:6,padding:"5px 8px",border:"1px solid #DDD6FE"}}>
              <span style={{fontSize:11,fontWeight:800,color:"#8B5CF6",minWidth:40}}>{m.type}</span>
              <div><div style={{fontSize:11,fontWeight:600,color:"#1E293B"}}>{m.title}</div><div style={{fontSize:10,color:"#6B7280"}}>{m.th}</div></div>
            </div>)}
          </div>
          {who.bestMatch.why&&<div style={{fontSize:11,lineHeight:1.7,color:"#374151",background:"#fff",borderRadius:6,padding:"6px 8px",borderLeft:"3px solid #7C3AED"}}>
            {who.bestMatch.why}
          </div>}
        </div>}
      </div>
    </div>

    {/* Section 2: WHAT */}
    <div style={{background:"#fff",borderRadius:12,border:"1px solid #D1FAE5",marginBottom:10,overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#059669,#10B981)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:18}}>2️⃣</span>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>WHAT – ทักษะทำเงิน</div>
          <div style={{fontSize:10,color:"#A7F3D0"}}>Wealth & Market Value</div>
        </div>
        {what?.marketValue&&<span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:"#fff",background:"rgba(255,255,255,.2)",padding:"3px 8px",borderRadius:8,whiteSpace:"nowrap"}}>{what.marketValue}</span>}
      </div>
      <div style={{padding:"12px 14px"}}>
        {what?.skillTitle&&<div style={{textAlign:"center",marginBottom:10,padding:"6px 10px",background:"#ECFDF5",borderRadius:8}}><div style={{fontSize:13,fontWeight:800,color:"#065F46"}}>{what.skillTitle}</div></div>}
        <div style={{marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"#059669",marginBottom:3}}>Skill Highlight (ทักษะเด่น)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{what?.skillHighlight}</div>
        </div>
        <div style={{marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"#059669",marginBottom:3}}>Market Value (มูลค่าในตลาด)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{what?.marketValue}</div>
        </div>
        <div style={{marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"#059669",marginBottom:3}}>The Money Maker (วิธีทำเงินที่ดีที่สุดของคุณ)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{what?.moneyMaker}</div>
        </div>
        <div style={{background:"#FFF7ED",borderRadius:8,padding:"8px 10px",borderLeft:"3px solid #F59E0B"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#B45309",marginBottom:2}}>⚠️ Gap to Close (จุดที่ต้องพัฒนาเพื่อเพิ่มมูลค่า)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#1E293B"}}>{what?.gapToClose}</div>
        </div>
      </div>
    </div>

    {/* Section 3: WHEN */}
    <div style={{background:"#fff",borderRadius:12,border:"1px solid #FDE68A",overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#B45309,#D97706)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:18}}>3️⃣</span>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>WHEN – เวลาของคุณ</div>
          <div style={{fontSize:10,color:"#FDE68A"}}>The Golden Timing</div>
        </div>
        {when?.periodLabel&&<span style={{marginLeft:"auto",fontSize:9,fontWeight:700,color:"#fff",background:"rgba(255,255,255,.2)",padding:"3px 8px",borderRadius:8,whiteSpace:"nowrap"}}>{when.periodLabel}</span>}
      </div>
      <div style={{padding:"12px 14px"}}>
        {/* Status badge */}
        <div style={{background:statusBg,border:`2px solid ${statusBorder}`,borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>{statusDot}</span>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:statusBorder}}>Current Status: [ {when?.statusLabel} ]</div>
            <div style={{fontSize:11,color:"#374151",marginTop:2,lineHeight:1.6}}>{when?.currentDesc}</div>
          </div>
        </div>
        {when?.goldenWindow&&<div style={{marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"#B45309",marginBottom:3}}>🪙 Golden Window (ช่วงทองที่ดีที่สุด)</div>
          <div style={{fontSize:13,fontWeight:800,color:"#92400E",marginBottom:2}}>{when.goldenWindow}</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{when?.goldenDesc}</div>
        </div>}
        {when?.actionPlan&&<div style={{marginBottom:8,background:"#FFFBEB",borderRadius:8,padding:"8px 10px",borderLeft:"3px solid #D97706"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#B45309",marginBottom:2}}>Action Plan (สิ่งที่ควรทำตอนนี้)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{when.actionPlan}</div>
        </div>}
        {when?.warning&&<div style={{background:"#FFF1F2",borderRadius:8,padding:"8px 10px",borderLeft:"3px solid #EF4444"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#DC2626",marginBottom:2}}>⚠️ Warning (ข้อควรระวัง)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#374151"}}>{when.warning}</div>
        </div>}
      </div>
    </div>
  </div>};

// Locked Preview with blur
const Locked=({planNeeded,title,children,onUpgrade})=><Card style={{position:"relative",overflow:"hidden",minHeight:120}}><div style={{filter:"blur(3px)",pointerEvents:"none",userSelect:"none",opacity:.4,padding:"8px 0"}}>{children}</div><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.75)",backdropFilter:"blur(2px)",padding:16}}><div style={{fontSize:28,marginBottom:6}}>🔒</div><div style={{fontSize:13,fontWeight:700,color:"#4338CA",marginBottom:3,textAlign:"center"}}>{title}</div><div style={{fontSize:11,color:"#64748B",marginBottom:10}}>{planNeeded==="deep"?"Deep Insight ฿49":"All Access ฿99"}</div><button onClick={()=>onUpgrade(planNeeded)} style={{padding:"8px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(79,70,229,.25)"}}>ปลดล็อก →</button></div></Card>;

export default function App(){
  const[sc,setSc]=useState("landing");
  const[nick,setNick]=useState("");const[email,setEmail]=useState("");const[bday,setBday]=useState("--");
  const[knowT,setKnowT]=useState(null);const[btime,setBtime]=useState("");const[tSlot,setTSlot]=useState("");const[prov,setProv]=useState("");
  const[qI,setQI]=useState(0);const[ans,setAns]=useState({});
  const[scores,setScores]=useState(null);const[vedic,setVedic]=useState(null);
  const[plan,setPlan]=useState("free");const[ai,setAi]=useState({});const[aiL,setAiL]=useState({});
  const[decQ,setDecQ]=useState("");const[decCat,setDecCat]=useState("work");const[decRes,setDecRes]=useState(null);const[decL,setDecL]=useState(false);const[decCustom,setDecCustom]=useState(false);
  const[user,setUser]=useState(null);const[loginModal,setLoginModal]=useState(false);const[pendingPlan,setPendingPlan]=useState(null);
  const[authMode,setAuthMode]=useState("login");const[authErr,setAuthErr]=useState("");const[authLoading,setAuthLoading]=useState(false);
  const authEmailRef=useRef(null);const authPwRef=useRef(null);
  const wasAuthedRef=useRef(false);
  const nickRef=useRef(null);const emailRef=useRef(null);
  // Strip date-sensitive fields so they always regenerate fresh (energy=daily, job=may be stale)
  const stripDateAI=r=>{if(!r)return{};const{energy:_e,job:_j,...rest}=r;
    if(rest["12d"]&&!rest["12d"].includes("🌟 มิติที่เป็นจุดแข็ง"))delete rest["12d"];
    if(rest.shadow&&!rest.shadow.includes("🌑 Shadow Score:"))delete rest.shadow;
    if(rest.identity&&(typeof rest.identity==="string"||!rest.identity.powerTitle||rest.identity?.when?.goldenWindow?.startsWith("เดือน")))delete rest.identity;
    if(rest.core&&rest.core.includes("ส่งพลัง"))delete rest.core;
    return rest};

  // Init: check Supabase session + handle payment redirect
  useEffect(()=>{
    const init=async()=>{
      // === STEP 1: Detect Stripe redirect ===
      const params=new URLSearchParams(window.location.search);
      const payOk=params.get("payment")==="success";
      const payPlan=params.get("plan");
      if(payOk&&payPlan){
        localStorage.setItem("hss_paid_plan",payPlan);
        localStorage.setItem("hss_paid_at",Date.now().toString());
        window.history.replaceState({},"",window.location.pathname);
      }
      const paidPlan=localStorage.getItem("hss_paid_plan");
      const paidAt=parseInt(localStorage.getItem("hss_paid_at")||"0");
      const hasPaid=paidPlan&&(Date.now()-paidAt<3600000);

      // === STEP 2: Always restore localStorage data first ===
      const lsScores=ST.get("scores");const lsVedic=ST.get("vedic");
      const lsProfile=ST.get("profile");const lsAnswers=ST.get("answers");const lsPlan=ST.get("plan");
      let hasLocalData=false;
      if(lsProfile){setNick(lsProfile.nick||"");setBday(lsProfile.bday||"--");setBtime(lsProfile.btime||"");setTSlot(lsProfile.tSlot||"");setProv(lsProfile.prov||"")}
      if(lsAnswers)setAns(lsAnswers);
      if(lsScores&&lsVedic){setScores(lsScores);setVedic(lsVedic);hasLocalData=true}

      // === STEP 3: Try Supabase session ===
      if(sb){
        const{data:{session}}=await sb.auth.getSession();
        if(session?.user){
          // LOGGED IN — load from DB
          wasAuthedRef.current=true;setUser(session.user);setEmail(session.user.email||"");
          const{data:prof}=await sb.from("profiles").select("*").eq("id",session.user.id).single();
          if(prof){setNick(prof.nick||"");setBday(prof.bday||"--");setBtime(prof.btime||"");setTSlot(prof.time_slot||"");setProv(prof.province||"")}
          // Sync bday from localStorage to DB if DB is missing it
          if((!prof?.bday||prof.bday==="--")&&lsProfile?.bday&&lsProfile.bday!=="--"&&lsProfile.bday.length>=8){
            setBday(lsProfile.bday);
            await sb.from("profiles").upsert({id:session.user.id,nick:prof?.nick||lsProfile.nick||"",email:session.user.email,bday:lsProfile.bday,btime:lsProfile.btime||prof?.btime||"",time_slot:lsProfile.tSlot||prof?.time_slot||"",province:lsProfile.prov||prof?.province||"",plan:prof?.plan||"free",updated_at:new Date().toISOString()});
          }
          const{data:assess}=await sb.from("assessments").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(1).single();
          if(assess?.scores){
            setAns(assess.answers||{});setScores(assess.scores);setVedic(assess.vedic);
            if(assess.ai_results&&Object.keys(assess.ai_results).length>0)setAi(stripDateAI(assess.ai_results));
            hasLocalData=true;
          }
          // Activate paid plan
          if(hasPaid){
            setPlan(paidPlan);ST.set("plan",paidPlan);
            await sb.from("profiles").update({plan:paidPlan,updated_at:new Date().toISOString()}).eq("id",session.user.id);
            localStorage.removeItem("hss_paid_plan");localStorage.removeItem("hss_paid_at");
          } else {
            setPlan(prof?.plan||lsPlan||"free");
          }
          // Go to results if we have data
          if(hasLocalData||assess?.scores)setSc("results");

        } else if(hasPaid){
          // NOT LOGGED IN but PAID — show login modal + restore local data
          const savedEmail=localStorage.getItem("hss_user_email")||"";
          setEmail(savedEmail);
          if(hasPaid)setPlan(paidPlan);
          if(hasLocalData)setSc("results");
          setLoginModal(true);setAuthMode("login");
          setAuthErr("✅ ชำระเงินสำเร็จแล้ว! กรุณาเข้าสู่ระบบเพื่อปลดล็อก");

        } else {
          // NOT LOGGED IN, NOT PAID — check localStorage for existing results
          if(lsPlan)setPlan(lsPlan);
          if(hasLocalData)setSc("results");
        }

        // Listen for auth changes (Google OAuth, re-login, etc.)
        sb.auth.onAuthStateChange(async(ev,sess)=>{
          if(ev==="SIGNED_IN"&&sess?.user){
            wasAuthedRef.current=true;setUser(sess.user);setEmail(sess.user.email||"");setLoginModal(false);
            // Activate paid plan if pending
            const pp=localStorage.getItem("hss_paid_plan");
            const ppAt=parseInt(localStorage.getItem("hss_paid_at")||"0");
            if(pp&&(Date.now()-ppAt<3600000)){
              setPlan(pp);ST.set("plan",pp);
              await sb.from("profiles").update({plan:pp,updated_at:new Date().toISOString()}).eq("id",sess.user.id);
              localStorage.removeItem("hss_paid_plan");localStorage.removeItem("hss_paid_at");
            }
            // Load user data from DB
            const{data:prof}=await sb.from("profiles").select("*").eq("id",sess.user.id).single();
            if(prof){setNick(prof.nick||"");setBday(prof.bday||"--");setBtime(prof.btime||"");setTSlot(prof.time_slot||"");setProv(prof.province||"");if(!pp)setPlan(prof.plan||"free")}
            const{data:assess}=await sb.from("assessments").select("*").eq("user_id",sess.user.id).order("created_at",{ascending:false}).limit(1).single();
            if(assess?.scores){setAns(assess.answers||{});setScores(assess.scores);setVedic(assess.vedic);setSc("results");if(assess.ai_results)setAi(stripDateAI(assess.ai_results))}
            else{
              // Try localStorage
              const ls=ST.get("scores");const lv=ST.get("vedic");
              if(ls&&lv){setScores(ls);setVedic(lv);setSc("results")}
            }
          }
          if(ev==="TOKEN_REFRESHED"&&sess?.user){wasAuthedRef.current=true;setUser(sess.user)}
          if(ev==="SIGNED_OUT"){setUser(null);if(wasAuthedRef.current){wasAuthedRef.current=false;setLoginModal(true);setAuthMode("login");setAuthErr("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง")}}
        });
      } else {
        // No Supabase — pure localStorage
        if(hasPaid){setPlan(paidPlan);localStorage.removeItem("hss_paid_plan");localStorage.removeItem("hss_paid_at")}
        else if(lsPlan)setPlan(lsPlan);
        if(hasLocalData)setSc("results");
      }
    };init();
  },[]);

  // Auto-trigger AI when scores+nick become available (after login reload)
  const aiTriggered=useRef(false);
  useEffect(()=>{
    if(scores&&nick&&vedic&&!aiTriggered.current){
      aiTriggered.current=true;
      const fs=PLANS[plan].f;
      // Energy & job use instant smart fallback — always refresh (energy is date-sensitive)
      if(fs.includes("energy"))loadAI("energy",scores,vedic,nick,bday);
      if(fs.includes("job"))loadAI("job",scores,vedic,nick,bday);
      if(fs.includes("timeline"))loadAI("timeline",scores,vedic,nick,bday);
      // GPT-blocking calls staggered 200ms apart (queue handles concurrency)
      if(!ai.identity)loadAI("identity",scores,vedic,nick,bday);
      if(!ai.core)setTimeout(()=>loadAI("core",scores,vedic,nick,bday),200);
      if(fs.includes("12d")&&!ai["12d"])setTimeout(()=>loadAI("12d",scores,vedic,nick,bday),400);
      if(fs.includes("shadow")&&!ai.shadow)setTimeout(()=>loadAI("shadow",scores,vedic,nick,bday),600);
      if(fs.includes("love")&&!ai.love)setTimeout(()=>loadAI("love",scores,vedic,nick,bday),650);
      if(fs.includes("principle")&&!ai.principle)setTimeout(()=>loadAI("principle",scores,vedic,nick,bday),700);
      if(fs.includes("weekly")&&!ai.weekly)setTimeout(()=>loadAI("weekly",scores,vedic,nick,bday),800);
    }
  },[scores,nick,vedic,plan,ai]);

  // Save to Supabase DB
  const saveProfile=async()=>{if(!sb||!user)return;await sb.from("profiles").upsert({id:user.id,nick,email:user.email,bday,btime,time_slot:tSlot,province:prov,plan,updated_at:new Date().toISOString()})};
  const saveAssessment=async(s,v,a)=>{if(!sb||!user)return;const{data:ex}=await sb.from("assessments").select("id").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).single();if(ex){await sb.from("assessments").update({answers:a,scores:s,vedic:v,updated_at:new Date().toISOString()}).eq("id",ex.id)}else{await sb.from("assessments").insert({user_id:user.id,answers:a,scores:s,vedic:v})}};
  const saveAI=async(aiData)=>{if(!sb||!user)return;const{data:ex}=await sb.from("assessments").select("id").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).single();if(ex)await sb.from("assessments").update({ai_results:aiData,updated_at:new Date().toISOString()}).eq("id",ex.id)};
  const savePlan=async(p)=>{if(!sb||!user)return;await sb.from("profiles").update({plan:p,updated_at:new Date().toISOString()}).eq("id",user.id)};

  const logged=!!user;
  const has=f=>PLANS[plan].f.includes(f);

  // ── Ask & Decide AI ──
  const decideLimit=()=>{const today=new Date().toDateString();const s=ST.get("dec_day");return s?.date===today?s.count||0:0};
  const incDecide=()=>{const today=new Date().toDateString();ST.set("dec_day",{date:today,count:decideLimit()+1})};
  const askDecide=async()=>{
    const q=decQ.trim();if(!q)return;
    const maxQ=plan==="free"?1:99;if(decideLimit()>=maxQ&&plan==="free"){alert("ใช้โควต้า 1 คำถาม/วันหมดแล้ว อัปเกรดเพื่อถามไม่จำกัด");return}
    setDecL(true);setDecRes(null);
    const catLabel=DEC_CATS[decCat].label;
    const prompt=`คุณคือ AI ผู้เชี่ยวชาญด้านการตัดสินใจ วิเคราะห์จาก 4 ศาสตร์พร้อมกัน
ข้อมูลผู้ถาม: ชื่อ ${nick}, วันเกิด ${bday}, คะแนนจิตวิทยา: Cognitive=${scores?.["Cognitive Processing"]?.toFixed(1)||"N/A"}, Shadow=${scores?.["Shadow Pattern"]?.toFixed(1)||"N/A"}
หมวดหมู่: ${catLabel}
คำถาม: "${q}"

ตอบเป็น JSON เท่านั้น ตาม schema นี้:
{
  "verdict": "ใช่|ไม่ใช่|รอก่อน",
  "verdictColor": "green|red|yellow",
  "confidence": 0-100,
  "cards": [
    {"system":"Vedic","icon":"🔯","color":"#F59E0B","answer":"...สั้น","reason":"อธิบาย 1-2 ประโยคเชิงดาว","score":1-10,"action":"คำแนะนำ 1 ประโยค"},
    {"system":"Western","icon":"⭐","color":"#3B82F6","answer":"...สั้น","reason":"...","score":1-10,"action":"..."},
    {"system":"Chinese","icon":"☯️","color":"#EF4444","answer":"...สั้น","reason":"...","score":1-10,"action":"..."},
    {"system":"Thai","icon":"🌸","color":"#8B5CF6","answer":"...สั้น","reason":"...","score":1-10,"action":"..."}
  ],
  "ai_summary": "สรุปภาพรวมทุกศาสตร์ 2-3 ประโยค",
  "action_plan": ["ขั้นตอน 1","ขั้นตอน 2","ขั้นตอน 3"]
}`;
    const raw=await GPT.call(prompt,`dec_${nick}_${q.slice(0,20)}_${new Date().toDateString()}`,600);
    const parsed=pJ(raw);
    setDecRes(parsed||pJ(GPT.fb(`dec_fallback`)));
    setDecL(false);incDecide();
  };
  const goQuiz=()=>{ST.set("profile",{nick,email,bday,btime,tSlot,prov});saveProfile();setSc("quiz")};
  const answer=val=>{const q=ALL_Q[qI];const key=`${q.dim}-${q.qi}`;const na={...ans,[key]:val};setAns(na);ST.set("answers",na);if(qI<ALL_Q.length-1)setTimeout(()=>setQI(qI+1),200)};
  const finish=()=>{const ts=knowT?btime:tSlot;const v=calcV(bday,ts);const s=calcS(v,ans);setVedic(v);setScores(s);ST.set("vedic",v);ST.set("scores",s);saveAssessment(s,v,ans);setSc("results");loadAI("identity",s,v);loadAI("core",s,v)};

  const loadAI=async(type,s2,v2,nameOverride,bdayOverride)=>{const s=s2||scores;const v=v2||vedic;const nn=nameOverride||nick;const bd=bdayOverride||bday;if(!s||!nn||(ai[type]&&type!=="energy"&&type!=="job"))return;setAiL(p=>({...p,[type]:true}));
    // Safety: force stop spinner after 20s no matter what
    const safetyTm=setTimeout(()=>{setAiL(p=>{if(p[type]){console.log("AI safety timeout:",type);return{...p,[type]:false}}return p})},20000);
    let r=null;try{const so=Object.entries(s).sort((a,b)=>b[1]-a[1]);
    if(type==="identity"){const mbti=calcMBTI(s);const mMeta=MBTI_META[mbti]||{title:"The Strategic Visionary",th:"ผู้มีวิสัยทัศน์เชิงกลยุทธ์"};const domP=calcDomPlanet(v);const phases=calcDasha(bd);const curD=phases.find(d=>d.isCurrent)||phases[0]||{p:"พฤหัส",theme:"การเติบโต",y:16,startYear:2010,endYear:2026};const ads=calcAntardasha(curD,curD.startYear||2010);const curAD=ads.find(a=>a.isCurrent)||ads[0]||{p:"พฤหัส",theme:"ปัญญา"};const statusPlanets=["พฤหัส","ศุกร์","อาทิตย์","จันทร์"];const buildPlanets=["พุธ","อังคาร","เสาร์"];const statusColor=statusPlanets.includes(curD.p)?"green":buildPlanets.includes(curD.p)?"yellow":"red";const nowFrac=new Date().getFullYear()+(new Date().getMonth())/12;const nowTH=new Date().getFullYear()+543;const fracToThaiMY=(frac)=>{const yr=Math.floor(frac);const mo=Math.min(11,Math.max(0,Math.round((frac-yr)*12)));return TL_MONTHS_FULL[mo]+" พ.ศ."+(yr+543)};const gwStr=fracToThaiMY(nowFrac+0.3)+" – "+fracToThaiMY(Math.min(curAD.endYear,nowFrac+2.5));const t=await GPT.call(`วิเคราะห์ Identity Snapshot 3 ด้าน สำหรับ"${nn}"
ข้อมูลสำคัญ:
- MBTI: ${mbti} (${mMeta.th})
- ดาวเด่น: ${domP.icon}${domP.planet}(${domP.en}) — ${domP.power}
- คะแนนเด่นสุด: ${so.slice(0,3).map(([k,v2])=>k+"("+v2.toFixed(1)+")").join(",")}
- จุดต้องพัฒนา: ${so.slice(-2).map(([k,v2])=>k+"("+v2.toFixed(1)+")").join(",")}
- พรสวรรค์พื้นดวง: ${Object.entries(v).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v2])=>k+"("+v2.toFixed(1)+")").join(",")}
- ทศาปัจจุบัน: ${curD.p}-${curAD.p} (${curD.theme}) อันตรทศาสิ้นสุด ${fracToThaiMY(curAD.endYear)}
ตอบ JSON เดียว ไม่มี backtick ไม่มีข้อความอื่น ใช้ภาษาที่คนทั่วไปเข้าใจได้ ไม่ใช้คำยาก อธิบายคำศัพท์ที่ซับซ้อนด้วยวงเล็บ:
{"powerTitle":"[ชื่อ archetype เป็นภาษาอังกฤษ 4-6 คำ สะท้อน ${mbti}+ดาว${domP.planet}]","who":{"mbtiLabel":"${mbti} + พลังดาว${domP.planet} (${domP.en})","mbtiCore":"${mbti} – [อธิบายบุคลิก MBTI นี้ 1 ประโยค ใช้ภาษาง่าย เช่น 'ผู้นำที่มองเห็นภาพใหญ่']","vedicSoul":"${domP.planet} Energy (${domP.en}) – [อธิบายพลังดาวนี้ 1-2 ประโยค ว่าส่งคุณสมบัติอะไรพิเศษให้เหนือกว่า ${mbti} ทั่วไป]","hiddenPower":"[The XYZ ชื่อภาษาอังกฤษ] – [อธิบายพลังแฝงที่จะทำงานได้ดีที่สุดเมื่อไหร่ 1 ประโยค]"},"what":{"skillTitle":"[ชื่อทักษะหลักที่ทำเงินได้ ภาษาอังกฤษ 3-5 คำ]","skillHighlight":"[ทักษะเด่น] – [อธิบาย 1 ประโยค ว่ามีมูลค่าอย่างไรในตลาด]","marketValue":"Top X% (มีคน 1 ใน X คน ที่เก่งเรื่องนี้) – [อธิบาย 1 ประโยค ว่าทักษะนี้หายาก และรายได้สูงกว่าตลาดกี่เท่า เช่น 'มีคน 1 ใน 10 ที่ทำได้ รายได้สูงกว่าคนทั่วไป 2-3 เท่า']","moneyMaker":"[อธิบาย 1-2 ประโยค ว่าคุณทำเงินได้จากอะไร ไม่ใช่จากการลงมือทำเอง แต่จากอะไร]","gapToClose":"[จุดที่ต้องพัฒนาตาม ${so.slice(-2).map(([k])=>k).join("+")}] – [อธิบาย 1-2 ประโยค อบอุ่น ไม่ตำหนิ]"},"when":{"periodLabel":"${curD.p}-${curAD.p} – [theme 2-3 คำ]","statusLabel":"[พร้อมลงมือ/ช่วงสะสมพลัง/ช่วงระวัง ขึ้นกับ ${curD.p}]","statusColor":"${statusColor}","currentDesc":"[อธิบาย 1-2 ประโยค ว่าตอนนี้อยู่ในช่วงอะไร เพราะดาว${curD.p} ส่งพลังอะไร]","goldenWindow":"${gwStr}","goldenDesc":"[อธิบาย 1 ประโยค ว่า golden window คืออะไร ดาวอะไรมาหนุน]","actionPlan":"[1-2 ประโยค บอกว่าควรทำอะไร ในช่วง golden window]","warning":"[1 ประโยค เตือนระวังช่วงไหน ดาวอะไร ผลเป็นอย่างไร]"}}`,`idv4_${nn}`);r=pJ(t);if(r&&r.who){const matchData=MBTI_MATCH[mbti];if(matchData){const bestTypes=matchData.best||[];const goodTypes=matchData.good||[];var bestArr=bestTypes.map(function(bt){return{type:bt,title:(MBTI_META[bt]||{}).title||bt,th:(MBTI_META[bt]||{}).th||bt}});var goodArr=goodTypes.map(function(gt){return{type:gt,title:(MBTI_META[gt]||{}).title||gt,th:(MBTI_META[gt]||{}).th||gt}});r.who.bestMatch={best:bestArr,good:goodArr,why:matchData.why}}}}
    if(type==="core"){const cScores={"Cognitive":s["Cognitive Processing"],"Emotional":s["Emotional Regulation"],"Identity":s["Identity Stability"],"Shadow":s["Shadow Pattern"],"Growth":s["Growth Orientation"]};const shadowLow=s["Shadow Pattern"]<5;r=await GPT.call(`วิเคราะห์ 5 ด้านหลักของ"${nn}" (พื้นดวง→ตอนนี้):\n🧠 Cognitive(พุธ): ${v["Cognitive Processing"]?.toFixed(1)}→${s["Cognitive Processing"]?.toFixed(1)}\n🌊 Emotional(จันทร์): ${v["Emotional Regulation"]?.toFixed(1)}→${s["Emotional Regulation"]?.toFixed(1)}\n⚓ Identity(อาทิตย์+เสาร์): ${v["Identity Stability"]?.toFixed(1)}→${s["Identity Stability"]?.toFixed(1)}\n🌑 Shadow(ราหู/เกตุ): ${v["Shadow Pattern"]?.toFixed(1)}→${s["Shadow Pattern"]?.toFixed(1)}\n🌱 Growth(พฤหัส): ${v["Growth Orientation"]?.toFixed(1)}→${s["Growth Orientation"]?.toFixed(1)}\n\nเขียนแต่ละด้าน 1-2 ประโยค ใช้ภาษาที่ชี้คุณสมบัติชัดเจน (เช่น "ประมวลผลแม่นยำ" "เป้าหมายชัดเจน") ไม่ใช้ "ส่งพลัง"\nถ้าคะแนน<5 ให้เตือนว่าต้องระวังอะไร พร้อมบอกว่า "Shadow/12D Analysis จะช่วยคลี่คลายได้ 🔓"\nถ้าคะแนน≥7 ให้ชมและชี้ว่าใช้ประโยชน์อะไรได้บ้าง\nห้าม **text** ไม่ต้องมีหัวข้อซ้ำ`,`corev2_${nn}`)}
    if(type==="12d")r=await GPT.call(`ข้อมูล12มิติของ"${nn}"(ศักยภาพพื้นดวง|คะแนนผลการทดสอบ):\n${Object.entries(s).map(([k,sv])=>(k)+": "+(v[k]?.toFixed(1))+" | "+(sv.toFixed(1))).join("\n")}\n\nเขียนบทวิเคราะห์ตามรูปแบบนี้เป๊ะๆ (แทนที่วงเล็บด้วยข้อมูลจริง ห้าม **text** ใส่บรรทัดว่างระหว่างแต่ละข้อ):\n---\nบทวิเคราะห์ศักยภาพรายบุคคล: Human System Intelligence\n\nจากการวิเคราะห์เปรียบเทียบระหว่าง "ศักยภาพพื้นดวง (Vedic Potential)" และ "คะแนนผลการทดสอบ (Actual Assessment)" ผ่าน 12 มิติชี้วัด นี่คือข้อมูลเชิงลึกของคุณครับ:\n\n🌟 มิติที่เป็นจุดแข็ง (Core Strengths)\n\n1. [มิติคะแนนรวมสูงสุด] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวเด่น: [ชื่อดาวไทย] ([English]) [อุจจ์/ปกติ/นิจ]\n   * วิเคราะห์: [2-3 ประโยค อ้างคะแนน บอกจุดแข็ง ฮีลใจ]\n\n2. [มิติอันดับ2] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวเด่น: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n3. [มิติอันดับ3] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวเด่น: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n⚠️ มิติที่ควรเฝ้าระวังและพัฒนา (Strategic Areas)\n\n1. [มิติคะแนนต่ำสุด] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวที่ส่งผล: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค ให้กำลังใจ แนะทางพัฒนา]\n\n2. [มิติอันดับ2] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวที่ส่งผล: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n3. [มิติอันดับ3] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวที่ส่งผล: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n💡 บทสรุปกลยุทธ์ (Key Insight)\n"[1-2 ประโยคสรุปการใช้จุดแข็งรับมือจุดพัฒนา]"\n---`,`f12v2_${nn}`);
    if(type==="shadow")r=await GPT.call(`ข้อมูลของ"${nn}": Shadow Pattern: ศักยภาพพื้นดวง ${v["Shadow Pattern"]?.toFixed(1)} | คะแนนผลการทดสอบ ${s["Shadow Pattern"]?.toFixed(1)}, Stress Response: ${s["Stress Response"]?.toFixed(1)}, Boundary System: ${s["Boundary System"]?.toFixed(1)}\n\nเขียนตามรูปแบบนี้เป๊ะๆ (แทนที่วงเล็บด้วยข้อมูลจริง ห้าม **text** ใส่บรรทัดว่างระหว่างหัวข้อ):\n---\nShadow Analysis\n\n🌑 Shadow Score: ${s["Shadow Pattern"]?.toFixed(1)}/10 (คะแนนผลการทดสอบ) | ${v["Shadow Pattern"]?.toFixed(1)}/10 (ศักยภาพพื้นดวง)\n\n[2-3 ประโยคบริบท: ราหู/เกตุ = บทเรียน ไม่ใช่สิ่งเลวร้าย คะแนนสูงกว่า/ต่ำกว่าพื้นดวงแปลว่าอะไร ฮีลใจ]\n\n⚡ Trigger\n\n[1 ย่อหน้า อธิบายสิ่งที่กระตุ้น Shadow อ้างดาวที่เกี่ยวข้อง ใช้ภาษาอบอุ่น]\n\n🔄 Pattern\n\n[1 ย่อหน้า อธิบายรูปแบบที่เกิดซ้ำ บอกเบาๆ ไม่ตำหนิ]\n\n💡 วิธีแก้ตามดาว\n\n   1. [ชื่อวิธี (ดาว)]: [1-2 ประโยค ทำได้จริง]\n   2. [ชื่อวิธี (ดาว)]: [1-2 ประโยค]\n   3. [ชื่อวิธี (ดาว)]: [1-2 ประโยค]\n   4. [ชื่อวิธี (ดาว)]: [1-2 ประโยค]\n---`,`shv2_${nn}`);
    if(type==="love"){const mbti=calcMBTI(s);const domP=calcDomPlanet(v);const emotLow=s["Emotional Regulation"]<5;const boundLow=s["Boundary System"]<5;const shadowSc=s["Shadow Pattern"]?.toFixed(1);const emotSc=s["Emotional Regulation"]?.toFixed(1);const boundSc=s["Boundary System"]?.toFixed(1);const motSc=s["Motivation Driver"]?.toFixed(1);r=await GPT.call(`วิเคราะห์ Love & Compatibility ชะตาความรักของ"${nn}"\nข้อมูล:\n- MBTI: ${mbti}\n- ดาวเด่น: ${domP.icon}${domP.planet}(${domP.en})\n- Shadow Score: ${shadowSc}/10, Emotional Regulation: ${emotSc}/10, Boundary System: ${boundSc}/10, Motivation Driver: ${motSc}/10\n- Emotional ต่ำ: ${emotLow}, Boundary ต่ำ: ${boundLow}\n\nเขียนตามรูปแบบนี้เป๊ะๆ (แทนที่วงเล็บด้วยข้อมูลจริง ห้าม **text** ใส่บรรทัดว่างระหว่างหัวข้อ):\n---\nLove & Compatibility — ชะตาความรักและไทม์ไลน์คู่แท้\n\n💔 Root Cause Diagnostic — ทำไมถึงเจอแต่รักพังๆ?\n\n[สัดส่วนสาเหตุ 3-4 ข้อ อ้างอิงดาว+จิตวิทยา เช่น Attachment Style, Shadow Pattern, ราหู/เกตุ บอกเป็นเปอร์เซ็นต์หรือลำดับ]\n\n🔍 รูปแบบความสัมพันธ์ที่เกิดซ้ำ\n\n[1 ย่อหน้า อธิบาย pattern ความรักที่ซ้ำซาก อ้างดาวและจิตวิทยา Attachment Style ใช้ภาษาอบอุ่น]\n\n⚠️ Warning Insight\n\n[1-2 ประโยค สิ่งที่ควรหยุดทำในความสัมพันธ์]\n\n💑 The Ideal Partner Persona — คู่ครองที่เสริมดวงและจิตวิทยา\n\n[3-4 ข้อ ลักษณะคู่แท้ที่เข้ากันและเสริมดวง: บุคลิก, สาขาอาชีพ, ลักษณะทางจิตใจ, MBTI ที่แนะนำ]\n\n📊 เปรียบเทียบ — สิ่งที่คุณต้องการ VS สเปคเสริมดวง\n\n   สิ่งที่จิตใต้สำนึกโหยหา: [2-3 คุณสมบัติที่ดึงดูดแต่อาจไม่เหมาะ]\n   สเปคเสริมดวงที่แท้จริง: [2-3 คุณสมบัติที่ดาวและจิตวิทยาบอกว่าต้องการจริงๆ]\n\n⏳ Destiny Timeline — จะพบคู่แท้เมื่อไหร่?\n\n   ช่วงที่มีโอกาสสูงสุด: [ระบุปี พ.ศ. หรือไตรมาส อ้างอิงจากดาวศุกร์+พฤหัสจร]\n   สัญญาณที่บ่งบอกว่าพบคนที่ใช่: [2-3 ข้อ]\n   เตรียมตัวอย่างไร: [1-2 ประโยค ทำได้จริง]\n---`,`lv_${nn}`)}
    if(type==="principle"){const domP=calcDomPlanet(v);const mbti=calcMBTI(s);r=await GPT.call(`เขียนหลักการใช้ชีวิต (Life Principle) ของ"${nn}" เป็น 1 ประโยคที่กระชับ ลึก จำได้ทันที ห้ามใช้ * หรือ ** เด็ดขาด ไม่ต้องมี header\nดาวเด่น: ${domP.icon}${domP.planet}(${domP.en}) — ${domP.power}\nMBTI: ${mbti}\nดาวแข็งพื้นดวง (top 2): ${Object.entries(v).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k,val])=>(k)+"("+(val.toFixed(1))+")").join(",")}\nด้านท้าทาย (bottom 2): ${Object.entries(s).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k,val])=>(k)+"("+(val.toFixed(1))+")").join(",")}\n\nประโยคต้องครอบคลุม: ช่วงสวยงามที่สุดในชีวิตเกิดขึ้นเมื่อใด / ช่วงดำมืดที่สุดรู้สึกอย่างไร / ทุกครั้งที่ผ่านได้เพราะอะไร และพลังดาว${domP.planet}ช่วยอย่างไร\nตอบเป็นข้อความธรรมดา 1 ประโยคเดียว ไม่ขึ้นบรรทัดใหม่ ไม่มีหมายเลข`,`pr_${nn}_${domP.planet}`)}
    if(type==="weekly"){const t=await GPT.call(`เขียนเหมือนพี่ที่ปรึกษาที่ห่วงใย อบอุ่น ฮีลใจ\nคำแนะนำสัปดาห์นี้สำหรับ"${nn}":\nเด่น:${so.slice(0,3).map(([k])=>k).join(",")} ต้องดูแลเพิ่ม:${so.slice(-2).map(([k])=>k).join(",")}\nตอบJSONไม่มีbacktick:{"do":["สิ่งดีๆที่ควรทำ1(ให้กำลังใจ)","ควรทำ2(อบอุ่น)","ควรทำ3(เป็นกันเอง)"],"dont":["สิ่งที่ควรระวัง1(พูดเบาๆไม่ตำหนิ)","ควรระวัง2(แนะทางออก)","ควรระวัง3(ห่วงใย)"]}`,`wk_${nn}`);r=pJ(t)}
    // Energy: show smart fallback FIRST then try GPT
    if(type==="energy"){try{const tr=gen7Day(bd);const MOODS=["🌟 สดใส","😊 สงบ","🔥 กระตือรือร้น","🧠 คิดวิเคราะห์","📚 ปัญญาเปิด","💎 ผ่อนคลาย","⚙️ ต้องใช้วินัย"];
      const today=new Date();
      const smartFB=tr.map((d,i)=>{const dt=new Date(today);dt.setDate(dt.getDate()+i);const dateStr=`${dt.getDate()}/${dt.getMonth()+1}`;const dayLabel=`${d.dn} ${dateStr}`;return{day:dayLabel,date:dateStr,energy:d.ce,mood:d.ce>75?MOODS[0]:d.ce>65?MOODS[1]:d.ce>55?MOODS[3]:MOODS[6],tip:`เจ้าวัน${d.dl.icon}${d.dl.lord} ${d.dl.q} จันทร์จรราศี${d.moonR}(${d.ma.r})`,transit:`เจ้าวัน${d.dl.icon}${d.dl.lord} + จันทร์${d.moonR} + อังคาร${d.marsR} + ศุกร์${d.veR} + พฤหัส${d.juR}`,goodFor:d.dl.gf,work:d.work,money:d.money,love:d.love,health:d.health,featured:d.featuredLabel,featuredGood:d.featuredGood,specialEvent:d.specialEvent}});
      setAi(p=>({...p,energy:smartFB}));setAiL(p=>({...p,energy:false}));clearTimeout(safetyTm);
      // Try GPT upgrade in background (non-blocking) — delayed 4s so identity/core get queue priority
      const dateLabels=tr.map((d,i)=>{const dt=new Date(today);dt.setDate(dt.getDate()+i);return`${d.dn} ${dt.getDate()}/${dt.getMonth()+1}`});
      setTimeout(()=>GPT.call(`โหราศาสตร์พระเวท (Vedic Jyotish) อบอุ่นฮีลใจ ตรงไปตรงมา\nพลังงาน7วัน"${nn}"ราศีเกิด${tr[0].nmR} — อ้างดาวเฉพาะวัน\n${tr.map((d,i)=>(dateLabels[i])+":"+(d.dl.icon)+(d.dl.lord)+(d.satMarConj?" ⚠️กาลกินีเสาร์-อังคาร":"")+` จ${d.moonR}(${d.ma.r}) ศุกร์${d.veR} E=${d.ce}%`).join("\n")}\nให้แต่ละวัน: work=เรื่องงานอ้างดาวเฉพาะวัน, money=การเงินอ้างดาว, love=ความรักอ้างดาว, health=สุขภาพอ้างดาว, mood=emoji+2คำ, tip=ประโยคเดียวฮีลใจ\nตอบJSON7obj ใช้วันที่จริง:[{"day":"${dateLabels[0]}","date":"${tr[0].date}","energy":${tr[0].ce},"mood":"emoji+2คำ","tip":"ฮีลใจ","work":"งานอ้างดาว","money":"เงินอ้างดาว","love":"รักอ้างดาว","health":"สุขภาพอ้างดาว"}]`,`en_${nn}_${new Date().toISOString().slice(0,10)}`,600).then(t=>{const p=pJ(t);if(p&&Array.isArray(p)&&p.length===7){setAi(prev=>({...prev,energy:p.map((d,i)=>({...smartFB[i],...d,day:d.day||dateLabels[i],date:d.date||tr[i]?.date,energy:d.energy<15?Math.round(d.energy*10):d.energy,specialEvent:tr[i]?.specialEvent,featured:tr[i]?.featuredLabel,featuredGood:tr[i]?.featuredGood}))}))}}) ,4000);
      }catch(e){console.log("Energy fallback error:",e);const fb=pJ(GPT.fb("en_x"));setAi(p=>({...p,energy:fb||[]}));setAiL(p=>({...p,energy:false}));clearTimeout(safetyTm)}
      return}
    // Timeline: generate monthly career energy, then try GPT upgrade
    if(type==="timeline"){try{
      const baseYear=new Date().getFullYear()+543;
      const tl=genTimeline(bd,baseYear);
      const smartFB={year:baseYear,months:tl};
      setAi(p=>({...p,timeline:smartFB}));setAiL(p=>({...p,timeline:false}));clearTimeout(safetyTm);
      // Try GPT upgrade — Hybrid Dasha × Thai Transit narrative
      const nRashi=bdayToRashiThai(bd);const rashiName=TL_RASHI_TH[nRashi];const top3=so.slice(0,3).map(([k])=>k).join(",");
      const d0=tl[0]?.dashaInfo||{};
      const transitSummary=tl.slice(0,4).map(m=>`${m.monthShort}:E${m.energy}%(${m.type}) ${m.stressors?.join(',')||'ปกติ'}`).join(" ");
      // Delayed 4s so identity/core get queue priority
      setTimeout(()=>GPT.call(`นักจิตวิทยาอบอุ่น ฮีลใจ ตรงไปตรงมา\nHybrid Dasha×Transit กราฟชีวิตการงาน"${nn}" ราศี${rashiName} มหาทศา${d0.planet||'พฤหัส'}(${d0.dignity||'ปกติ'}) พ.ศ.${baseYear}\nจุดเด่น:${top3}\nTransit:${transitSummary}\nแต่ละเดือนให้:psychText(2ประโยค Career&Wealth narrative อ้าง Cashflow vs Asset ระยะยาว ถ้าDashaสูง+Transitต่ำ="ศักยภาพสูงแต่อุปสรรคหนัก" ถ้าDashaต่ำ+Transitสูง="โชคชั่วคราว อย่าลงทุนใหญ่" ฮีลใจแต่ตรงไปตรงมา) psychTip(1ประโยค Actionable advice เรื่องเงินและอาชีพ)\nตอบJSONไม่มีbacktick:[{"month":0,"psychText":"...","psychTip":"..."},...]12เดือน`,`tl_${nn}_${baseYear}`,1600).then(t=>{const p=pJ(t);if(p&&Array.isArray(p)&&p.length>=10){setAi(prev=>{const cur=prev.timeline||smartFB;const enhanced={...cur,months:cur.months.map((m,i)=>{const gpt=p.find(x=>x.month===i);return gpt?{...m,psychText:gpt.psychText||m.psychText,psychTip:gpt.psychTip||m.psychTip}:m})};return{...prev,timeline:enhanced}})}}),4000);
      }catch(e){console.log("Timeline fallback error:",e);const baseYear=new Date().getFullYear()+543;setAi(p=>({...p,timeline:{year:baseYear,months:[]}}));setAiL(p=>({...p,timeline:false}));clearTimeout(safetyTm)}
      return}
    // Job: show smart fallback FIRST then try GPT
    if(type==="job"){try{const top3=so.slice(0,3).map(([k])=>k);const bot2=so.slice(-2).map(([k])=>k);
      const JOB_MAP={"Cognitive Processing":[{t:"Data Analyst",th:"นักวิเคราะห์ข้อมูล"},{t:"Software Engineer",th:"วิศวกรซอฟต์แวร์"}],"Energy Management":[{t:"Project Manager",th:"ผู้จัดการโปรเจกต์"},{t:"Sales Manager",th:"ผู้จัดการฝ่ายขาย"}],"Emotional Regulation":[{t:"UX Researcher",th:"นักวิจัย UX"},{t:"Counselor",th:"ที่ปรึกษา"}],"Decision System":[{t:"Financial Planner",th:"นักวางแผนการเงิน"},{t:"Strategy Consultant",th:"ที่ปรึกษากลยุทธ์"}],"Growth Orientation":[{t:"Product Manager",th:"ผู้จัดการผลิตภัณฑ์"},{t:"Researcher",th:"นักวิจัย"}],"Motivation Driver":[{t:"Entrepreneur",th:"ผู้ประกอบการ"},{t:"Marketing Manager",th:"ผู้จัดการการตลาด"}],"Responsibility Load":[{t:"Operations Manager",th:"ผู้จัดการปฏิบัติการ"},{t:"Quality Assurance",th:"QA Engineer"}]};
      const picks=[];const seen=new Set();top3.forEach(dim=>{(JOB_MAP[dim]||JOB_MAP["Cognitive Processing"]).forEach(j=>{if(!seen.has(j.t)&&picks.length<3){seen.add(j.t);picks.push({title:j.t,titleTH:j.th,match:Math.round(85-picks.length*5+s[dim]),dims:top3.slice(0,3).join(" + "),reason:`${DM[dim]?.icon}${dim}(${s[dim]?.toFixed(1)})ที่แข็งหนุนงานนี้ ดาว${DM[dim]?.pl}ส่งพลัง`})}})});
      while(picks.length<3)picks.push({title:"Business Analyst",titleTH:"นักวิเคราะห์ธุรกิจ",match:75,dims:top3.join(" + "),reason:"ทักษะรอบด้านเหมาะกับการวิเคราะห์"});
      setAi(p=>({...p,job:picks}));setAiL(p=>({...p,job:false}));clearTimeout(safetyTm);
      // Try GPT upgrade in background — delayed 4s so identity/core get queue priority
      const jobTopStr=so.slice(0,4).map(function(e){return e[0]+"="+e[1].toFixed(1)}).join(",");
      const jobBotStr=so.slice(-3).map(function(e){return e[0]+"="+e[1].toFixed(1)}).join(",");
      const jobPrompt="นักจิตวิทยาแนะแนวอาชีพอบอุ่นฮีลใจ\nจับคู่อาชีพ\""+nn+"\"เด่น:"+jobTopStr+" ต้องดูแลเพิ่ม:"+jobBotStr+"\nแนะนำ3อาชีพ match=เปอร์เซ็นต์จับคู่(เต็ม100 อันแรกสูงสุด88-95 อันสอง80-87 อันสาม73-79) ตอบJSON:[{\"title\":\"EN\",\"titleTH\":\"ไทย\",\"match\":88,\"dims\":\"3มิติ\",\"reason\":\"2ประโยค(ฮีลใจ)\"}]";
      setTimeout(function(){GPT.call(jobPrompt,"job_"+nn,500).then(function(t){var p=pJ(t);if(p&&Array.isArray(p)&&p.length>=3){var normalized=p.map(function(j){return Object.assign({},j,{match:j.match<=10?Math.round(j.match*10):j.match<50?Math.round(j.match+40):j.match})});setAi(function(prev){return Object.assign({},prev,{job:normalized})})}})},4000);
      }catch(e){console.log("Job fallback error:",e);const fb=[{title:"Business Analyst",titleTH:"นักวิเคราะห์ธุรกิจ",match:85,dims:"รอบด้าน",reason:"ทักษะรอบด้านเหมาะกับการวิเคราะห์"},{title:"Project Manager",titleTH:"ผู้จัดการโปรเจกต์",match:80,dims:"รอบด้าน",reason:"ความสามารถในการจัดการและประสานงาน"},{title:"Consultant",titleTH:"ที่ปรึกษา",match:75,dims:"รอบด้าน",reason:"ทักษะการสื่อสารและแก้ปัญหา"}];setAi(p=>({...p,job:fb}));setAiL(p=>({...p,job:false}));clearTimeout(safetyTm)}
      return}
  }catch(e){console.log("AI error:",type,e);
    // Provide non-null fallbacks for types that use smart fallback pattern
    if(type==="energy"){r=pJ(GPT.fb("en_x"))||[]}
    if(type==="timeline"){r={year:new Date().getFullYear()+543,months:[]}}
    if(type==="job"){r=[{title:"Business Analyst",titleTH:"นักวิเคราะห์ธุรกิจ",match:85,dims:"รอบด้าน",reason:"ทักษะรอบด้านเหมาะกับการวิเคราะห์"},{title:"Project Manager",titleTH:"ผู้จัดการโปรเจกต์",match:80,dims:"รอบด้าน",reason:"ความสามารถในการจัดการและประสานงาน"},{title:"Consultant",titleTH:"ที่ปรึกษา",match:75,dims:"รอบด้าน",reason:"ทักษะการสื่อสารและแก้ปัญหา"}]}
  }
    clearTimeout(safetyTm);
    // Always set result (use fallback if null)
    if(!r&&type!=="energy"&&type!=="job"&&type!=="timeline"){r=GPT.fb(`${type==="identity"?"id":type==="core"?"core":type==="12d"?"f12":type==="shadow"?"sh":type==="love"?"lv":type==="weekly"?"wk":"x"}_${nn}`);if(type==="weekly"||type==="identity")r=pJ(r)}
    if(!r)r=type==="energy"?[]:type==="timeline"?{year:new Date().getFullYear()+543,months:[]}:type==="job"?[]:"กำลังประมวลผล...";
    setAi(p=>({...p,[type]:r}));setAiL(p=>({...p,[type]:false}));
    // Save AI results to DB
    if(r)setTimeout(()=>{const newAi={...ai,[type]:r};saveAI(newAi)},500)};

  const tryUpgrade=p=>{
    localStorage.setItem("hss_want_plan",p);
    if(!logged){setPendingPlan(p);setLoginModal(true);setAuthErr("");setAuthMode("login")}
    else{goStripe(p)}};

  const goStripe=async(p)=>{
    // Save current user email for post-payment re-login
    if(user?.email)localStorage.setItem("hss_user_email",user.email);
    try{const r=await fetch("/api/stripe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan:p,userId:user?.id||"",email:user?.email||email})});const d=await r.json();if(d.url)window.location.href=d.url;else alert(d.error||"เกิดข้อผิดพลาด")}catch{alert("ไม่สามารถเชื่อมต่อ Stripe ได้")}};

  // Real Supabase Auth
  const doSignup=async()=>{const ae=authEmailRef.current?.value||"";const ap=authPwRef.current?.value||"";if(!ae||!ap){setAuthErr("กรุณากรอกอีเมลและรหัสผ่าน");return}if(ap.length<6){setAuthErr("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");return}setAuthLoading(true);setAuthErr("");
    const{data,error}=await sb.auth.signUp({email:ae,password:ap,options:{data:{},emailRedirectTo:undefined}});
    if(error){
      // If "email rate limit exceeded" or similar, try login instead
      if(error.message?.includes("rate limit")){setAuthErr("ระบบอีเมลเต็ม กรุณาใช้ 'เข้าสู่ระบบ' แทน หรือเข้าด้วย Google");setAuthLoading(false);return}
      setAuthErr(error.message);setAuthLoading(false);return}
    // Check if email confirmation is required (session will be null)
    if(data?.session){
      // No email confirmation needed — proceed normally
      setUser(data.user||data.session.user);setEmail(ae);setLoginModal(false);
      const wp=localStorage.getItem("hss_want_plan");
      if(wp){localStorage.removeItem("hss_want_plan");goStripe(wp)}
    } else if(data?.user){
      // Email confirmation required — auto-login immediately
      const{data:loginData,error:loginErr}=await sb.auth.signInWithPassword({email:ae,password:ap});
      if(loginData?.user){
        setUser(loginData.user);setEmail(ae);setLoginModal(false);
        const wp=localStorage.getItem("hss_want_plan");
        if(wp){localStorage.removeItem("hss_want_plan");goStripe(wp)}
      } else {
        // Cannot auto-login (email confirm truly required) — inform user
        setAuthErr("สมัครสำเร็จ! กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ตั้งไว้");setAuthMode("login");
      }
    }setAuthLoading(false)};

  const doLogin=async()=>{const ae=authEmailRef.current?.value||"";const ap=authPwRef.current?.value||"";if(!ae||!ap){setAuthErr("กรุณากรอกอีเมลและรหัสผ่าน");return}setAuthLoading(true);setAuthErr("");
    const{data,error}=await sb.auth.signInWithPassword({email:ae,password:ap});
    if(error){
      if(error.message==="Invalid login credentials")setAuthErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      else if(error.message?.includes("Email not confirmed"))setAuthErr("กรุณายืนยันอีเมลก่อน หรือลองสมัครใหม่ด้วย Google");
      else setAuthErr(error.message);
      setAuthLoading(false);return}
    if(data?.user){setUser(data.user);setEmail(ae);setLoginModal(false);
      // Check if we need to go to Stripe — use pendingPlan (state) not localStorage, to avoid stale redirect
      const wp=pendingPlan;
      if(wp){
        // Save profile before going to Stripe (so bday gets saved)
        const lp=ST.get("profile");
        if(lp?.bday&&lp.bday!=="--"){
          await sb.from("profiles").upsert({id:data.user.id,nick:lp.nick||nick,email:ae,bday:lp.bday,btime:lp.btime||btime,time_slot:lp.tSlot||tSlot,province:lp.prov||prov,updated_at:new Date().toISOString()});
        }
        localStorage.removeItem("hss_want_plan");goStripe(wp)
      }
      else{
        // Load profile & results FIRST
        const{data:prof}=await sb.from("profiles").select("*").eq("id",data.user.id).single();
        if(prof){setNick(prof.nick||"");setBday(prof.bday||"--");setBtime(prof.btime||"");setTSlot(prof.time_slot||"");setProv(prof.province||"")}
        // If DB has no bday but localStorage does, sync it
        const lp=ST.get("profile");
        if((!prof?.bday||prof.bday==="--")&&lp?.bday&&lp.bday!=="--"&&lp.bday.length>=8){
          setBday(lp.bday);
          await sb.from("profiles").upsert({id:data.user.id,nick:lp.nick||prof?.nick||nick,email:ae,bday:lp.bday,btime:lp.btime||prof?.btime||"",time_slot:lp.tSlot||prof?.time_slot||"",province:lp.prov||prof?.province||"",plan:prof?.plan||"free",updated_at:new Date().toISOString()});
        }
        const{data:assess}=await sb.from("assessments").select("*").eq("user_id",data.user.id).order("created_at",{ascending:false}).limit(1).single();
        if(assess&&assess.scores){setAns(assess.answers||{});setScores(assess.scores);setVedic(assess.vedic);setSc("results");if(assess.ai_results)setAi(stripDateAI(assess.ai_results))}
        // Check if there's a paid plan waiting to activate
        const paidPlan=localStorage.getItem("hss_paid_plan");
        const paidAt=parseInt(localStorage.getItem("hss_paid_at")||"0");
        if(paidPlan&&(Date.now()-paidAt<3600000)){
          setPlan(paidPlan);ST.set("plan",paidPlan);
          await sb.from("profiles").update({plan:paidPlan,updated_at:new Date().toISOString()}).eq("id",data.user.id);
          localStorage.removeItem("hss_paid_plan");localStorage.removeItem("hss_paid_at");
          if(assess?.scores)setSc("results");
        } else {
          setPlan(prof?.plan||"free");
        }
        // If has scores from localStorage but not DB, still show results
        if(!assess?.scores){
          const ls=ST.get("scores");const lv=ST.get("vedic");
          if(ls&&lv){setScores(ls);setVedic(lv);setSc("results")}
        }
      }
    }setAuthLoading(false)};

  const doGoogle=async()=>{if(!sb)return;setAuthLoading(true);
    await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}})};

  const doLogout=()=>{
    // Update UI immediately — don't block on async signOut
    aiTriggered.current=false;
    setUser(null);setSc("landing");setScores(null);setVedic(null);setAns({});setAi({});setQI(0);setPlan("free");
    ["hss6_scores","hss6_vedic","hss6_profile","hss6_plan","hss6_answers","hss_want_plan","hss_user_email"].forEach(k=>localStorage.removeItem(k));
    // Sign out in background (non-blocking)
    if(sb)sb.auth.signOut().catch(()=>{});
  };

  const activatePlan=(p)=>{setPlan(p);ST.set("plan",p);savePlan(p);const fs=PLANS[p].f;if(fs.includes("energy"))loadAI("energy",scores,vedic,nick,bday);if(fs.includes("job"))loadAI("job",scores,vedic,nick,bday);if(fs.includes("timeline"))loadAI("timeline",scores,vedic,nick,bday);if(fs.includes("12d")&&!ai["12d"])loadAI("12d",scores,vedic,nick,bday);if(fs.includes("shadow")&&!ai.shadow)loadAI("shadow",scores,vedic,nick,bday);if(fs.includes("love")&&!ai.love)loadAI("love",scores,vedic,nick,bday);if(fs.includes("weekly")&&!ai.weekly)loadAI("weekly",scores,vedic,nick,bday)};

  const exportPDF=()=>{if(!scores)return;const so=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    // Spider chart SVG for PDF
    const keys=Object.keys(scores);const vals=Object.values(scores);const n=keys.length;const sz=300,cx=150,cy=150,rad=100;
    const pt=(i,v)=>{const a=Math.PI*2*i/n-Math.PI/2;return{x:cx+Math.cos(a)*v/10*rad,y:cy+Math.sin(a)*v/10*rad}};
    const spiderSVG=`<svg viewBox="0 0 ${sz} ${sz}" style="width:300px;margin:10px auto;display:block"><defs><radialGradient id="spBg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#EEF2FF" stop-opacity="0.6"/><stop offset="100%" stop-color="#F8FAFC" stop-opacity="0.1"/></radialGradient><linearGradient id="spFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366F1" stop-opacity="0.35"/><stop offset="50%" stop-color="#8B5CF6" stop-opacity="0.25"/><stop offset="100%" stop-color="#A78BFA" stop-opacity="0.18"/></linearGradient><linearGradient id="spStroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4F46E5"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><circle cx="${cx}" cy="${cy}" r="${rad*1.05}" fill="url(#spBg)"/>${[2,4,6,8,10].map(l=>"<polygon points=\""+(keys.map((_,i)=>{const p=pt(i,l);return(p.x)+","+(p.y)}).join(" "))+"\" fill=\"none\" stroke=\""+(l===10?"#CBD5E1":"#E2E8F0")+"\" stroke-width=\""+(l===10?"0.8":"0.5")+"\""+(l===10?"":" stroke-dasharray=\"2,2\"")+"/>").join("")}<polygon points="${keys.map((_,i)=>{const p=pt(i,vals[i]);return(p.x)+","+(p.y)}).join(" ")}" fill="url(#spFill)" stroke="url(#spStroke)" stroke-width="2.2" stroke-linejoin="round"/>${keys.map((_,i)=>{const p=pt(i,vals[i]);const v=vals[i];const c=v>=7.5?"#10B981":v>=5?"#6366F1":"#EF4444";return"<circle cx=\""+(p.x)+"\" cy=\""+(p.y)+"\" r=\"3.5\" fill=\""+c+"\" stroke=\"#fff\" stroke-width=\"1.5\"/>"}).join("")}${keys.map((k,i)=>{const p=pt(i,13);const sh=k.length>14?k.slice(0,12)+"…":k;return"<text x=\""+(p.x)+"\" y=\""+(p.y)+"\" text-anchor=\"middle\" dominant-baseline=\"middle\" style=\"font-size:5.5px;fill:#475569;font-weight:600\">"+(sh)+"</text>"}).join("")}</svg>`;
    // Weekly
    const wk=ai.weekly&&typeof ai.weekly==="object"?`<h2>📋 Do & Don't รายสัปดาห์</h2><div class="g"><div class="card" style="background:#ECFDF5"><b style="color:#059669">✅ ควรทำ</b>${(ai.weekly.do||[]).map(t=>"<p>• "+(t)+"</p>").join("")}</div><div class="card" style="background:#FFF1F2"><b style="color:#EF4444">❌ เลี่ยง</b>${(ai.weekly.dont||[]).map(t=>"<p>• "+(t)+"</p>").join("")}</div></div>`:"";
    // Energy with full details
    const en=ai.energy&&Array.isArray(ai.energy)?`<h2>🌙 7-Day Energy</h2>${ai.energy.map(d=>"<div class=\"card\" style=\"margin:4px 0\"><div style=\"display:flex;justify-content:space-between;margin-bottom:2px\"><b>"+(d.day)+" "+(d.date||"")+"</b><span>"+(d.mood||"")+"</span></div>"+(d.transit?"<div style=\"font-size:10px;color:#7C3AED\">🪐 "+(d.transit)+"</div>":"")+(d.goodFor?"<div style=\"font-size:10px;color:#059669\">✅ "+(d.goodFor)+"</div>":"")+(d.tip?"<div style=\"font-size:10px;color:#374151\">💡 "+(d.tip)+"</div>":"")+"</div>").join("")}`:"";
    // Job
    const jb=ai.job&&Array.isArray(ai.job)?`<h2>💼 Job Matching</h2>${ai.job.map(j=>"<div class=\"card\"><b>"+(j.titleTH||j.title)+" ("+(j.match)+"%)</b><div style=\"font-size:11px;color:#64748B\">"+(j.dims||"")+"</div><p>"+(j.reason)+"</p></div>").join("")}`:"";
    // Career Timeline
    let timelineHTML="";try{if(ai.timeline&&ai.timeline.months?.length>0){const tlMonths=ai.timeline.months;const tlYear=ai.timeline.year||new Date().getFullYear()+543;const goldenC=tlMonths.filter(m=>m.stars===5).length;const dangerC=tlMonths.filter(m=>m.type==="danger").length;const sideC=tlMonths.filter(m=>m.sideJob).length;const typeColor={golden:"#C88A10",good:"#059669",danger:"#E05C5C",side:"#3A7AC0",neutral:"#7B6FA0"};const typeBg={golden:"#FFF8E1",good:"#E8F5E9",danger:"#FFF1F2",side:"#E4EEFF",neutral:"#F5F3FF"};const pts=tlMonths.map((m,i)=>({x:20+i*(440/11),y:10+(1-m.energy/100)*80}));const pathD=pts.map((p,i)=>i===0?`M ${p.x},${p.y}`:`L ${p.x},${p.y}`).join(" ");const areaD=pathD+` L ${pts[pts.length-1].x},95 L ${pts[0].x},95 Z`;timelineHTML=`<h2>📅 Career Dashboard — กราฟชีวิตการงาน พ.ศ.${tlYear}</h2><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px"><div class="card" style="text-align:center;background:#FFF8E1"><div style="font-size:18px;font-weight:800;color:#C88A10">${goldenC}</div><div style="font-size:11px;color:#92400E">เดือนทอง ⭐</div></div><div class="card" style="text-align:center;background:#FFF1F2"><div style="font-size:18px;font-weight:800;color:#E05C5C">${dangerC}</div><div style="font-size:11px;color:#991B1B">เดือนระวัง ⚠️</div></div><div class="card" style="text-align:center;background:#E4EEFF"><div style="font-size:18px;font-weight:800;color:#3A7AC0">${sideC}</div><div style="font-size:11px;color:#1E40AF">งานเสริม 💼</div></div></div><div class="card" style="padding:12px 8px"><svg viewBox="0 0 480 105" style="width:100%;height:80px;display:block"><line x1="0" y1="25" x2="480" y2="25" stroke="#F0ECF8" stroke-width="0.5"/><line x1="0" y1="50" x2="480" y2="50" stroke="#E5E7EB" stroke-width="0.8"/><line x1="0" y1="75" x2="480" y2="75" stroke="#F0ECF8" stroke-width="0.5"/><defs><linearGradient id="tlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7B6FA0" stop-opacity="0.15"/><stop offset="100%" stop-color="#7B6FA0" stop-opacity="0.01"/></linearGradient></defs><path d="${areaD}" fill="url(#tlg)"/><path d="${pathD}" fill="none" stroke="#7B6FA0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((p,i)=>"<circle cx=\""+(p.x)+"\" cy=\""+(p.y)+"\" r=\""+(tlMonths[i].stars===5?5:3.5)+"\" fill=\""+(typeColor[tlMonths[i].type]||"#7B6FA0")+"\" stroke=\"#fff\" stroke-width=\"1.5\"/>").join("")}${tlMonths.map((m,i)=>"<text x=\""+(pts[i].x)+"\" y=\"100\" text-anchor=\"middle\" style=\"font-size:7px;fill:#94A3B8\">"+(m.monthShort||"")+"</text>").join("")}</svg></div>${tlMonths.map(m=>"<div class=\"card\" style=\"background:"+(typeBg[m.type]||"#F5F3FF")+";border-left:3px solid "+(typeColor[m.type]||"#7B6FA0")+";margin-bottom:4px\"><div style=\"display:flex;justify-content:space-between;margin-bottom:3px\"><b>"+(m.monthShort||"")+" "+(m.type==="golden"?"⭐":m.type==="danger"?"⚠️":m.type==="side"?"💼":"")+(m.sideJob?" 💼":"")+"</b><span style=\"font-size:11px;font-weight:700;color:"+(typeColor[m.type]||"#7B6FA0")+"\">พลัง "+(m.energy)+"%</span></div>"+(m.psychText?"<p style=\"font-size:11px;color:#374151\">"+(m.psychText)+"</p>":"")+(m.psychTip?"<p style=\"font-size:11px;color:#6366F1;font-style:italic\">💡 "+(m.psychTip)+"</p>":"")+"</div>").join("")}`}}catch(e){timelineHTML=""}
    // Dasha/Life Phase
    let dashaHTML="";try{let pdfBday=bday;if(!pdfBday||pdfBday==="--"||pdfBday.length<8){const p=ST.get("profile");if(p?.bday&&p.bday!=="--")pdfBday=p.bday}
    const dashaPhases=calcDasha(pdfBday);const currentDasha=dashaPhases.find(d=>d.isCurrent);
    dashaHTML=dashaPhases.length>0?`<h2>🗺 Life Phase Map (Vedic Dasha)</h2>${currentDasha?"<div class=\"card\" style=\"background:linear-gradient(135deg,#EEF2FF,#F5F3FF);border:2px solid #6366F1\"><b style=\"color:#4338CA;font-size:14px\">"+(currentDasha.icon)+" ตอนนี้คุณอยู่ในช่วง: "+(currentDasha.theme)+"</b><div style=\"font-size:11px;margin-top:4px\">มหาทศา"+(currentDasha.p)+" (อายุ "+(currentDasha.startAge)+"–"+(currentDasha.endAge)+" ปี | "+(currentDasha.startYear)+"–"+(currentDasha.endYear)+")</div><div style=\"font-size:11px;margin-top:2px;color:#374151\">"+(currentDasha.desc)+"</div><div style=\"font-size:11px;color:#059669;margin-top:2px\">🎯 โฟกัส: "+(currentDasha.focus)+"</div><div style=\"font-size:11px;color:#374151;margin-top:4px;background:#FFF7ED;padding:6px 8px;border-radius:6px\">"+(currentDasha.cheer)+"</div><div style=\"font-size:10px;color:#B45309;margin-top:4px;background:#FFFBEB;padding:4px 8px;border-radius:6px\">"+(currentDasha.warn)+"</div></div>":""}${dashaPhases.filter(d=>!d.isPast||d.isCurrent).slice(0,6).map(d=>"<div style=\"display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #F1F5F9;"+(d.isCurrent?"font-weight:700;color:#4338CA":"color:#374151")+"\"><span style=\"font-size:14px\">"+(d.icon)+"</span><span style=\"font-size:11px;flex:1\">"+(d.p)+" — "+(d.theme)+"</span><span style=\"font-size:10px;color:#94A3B8\">"+(d.startAge)+"–"+(d.endAge)+" ปี</span></div>").join("")}`:""}catch(e){dashaHTML=""}
    // Build full PDF
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>HSS Report - ${nick}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Noto Sans Thai',sans-serif;background:#F8FAFC;color:#1E293B;font-size:13px;line-height:1.7}.page{max-width:680px;margin:0 auto;padding:32px 24px 60px}.header{background:linear-gradient(135deg,#4338CA 0%,#6D28D9 100%);color:#fff;border-radius:16px;padding:24px 28px;margin-bottom:24px}.header h1{font-size:22px;font-weight:800;margin-bottom:4px}.header p{font-size:12px;opacity:.8;margin:0}.header-badge{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);border-radius:8px;padding:3px 12px;font-size:11px;font-weight:700;margin-top:10px}h2{font-size:14px;font-weight:700;color:#4338CA;margin:20px 0 8px;padding-bottom:6px;border-bottom:2px solid #EEF2FF}.bar-row{margin:6px 0 10px}.bar-label{display:flex;justify-content:space-between;margin-bottom:3px;font-size:12px}.bar-bg{height:7px;background:#E2E8F0;border-radius:4px;overflow:hidden}.bar-fill{height:100%;border-radius:4px}.card{background:#fff;border-radius:12px;padding:14px 16px;margin:6px 0;border:1px solid #E2E8F0;box-shadow:0 1px 3px rgba(0,0,0,.05)}.g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700}p{margin:3px 0}.footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8}@media print{body{background:#fff}.header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="page"><div class="header"><h1>🔮 ${nick}</h1><p>Human System Studio · Vedic Astrology + Psychology · ${new Date().toLocaleDateString("th-TH")}</p><span class="header-badge">✦ Personal AI Report</span></div>
${ai.identity?.powerTitle?'<h2>✦ Identity Snapshot</h2><div style="background:#F5F3FF;border-radius:10px;padding:14px 16px;margin-bottom:8px;text-align:center"><b style="color:#4338CA;font-size:15px">'+(ai.identity.powerTitle)+'</b></div><div style="margin-bottom:8px"><b style="color:#4338CA">1️⃣ WHO – พลังแฝงของคุณ</b><br/><small style="color:#6366F1">MBTI Core:</small> <span>'+(ai.identity.who?.mbtiCore||"")+'</span><br/><small style="color:#6366F1">Vedic Soul:</small> <span>'+(ai.identity.who?.vedicSoul||"")+'</span><br/><small style="color:#6366F1">Hidden Power:</small> <span>'+(ai.identity.who?.hiddenPower||"")+'</span></div><div style="margin-bottom:8px"><b style="color:#059669">2️⃣ WHAT – ทักษะทำเงิน</b><br/><b>'+(ai.identity.what?.skillTitle||"")+'</b><br/><small style="color:#059669">Skill:</small> '+(ai.identity.what?.skillHighlight||"")+'<br/><small style="color:#059669">Market Value:</small> '+(ai.identity.what?.marketValue||"")+'<br/><small style="color:#059669">Money Maker:</small> '+(ai.identity.what?.moneyMaker||"")+'<br/><small style="color:#B45309">⚠️ Gap:</small> '+(ai.identity.what?.gapToClose||"")+'</div><div><b style="color:#B45309">3️⃣ WHEN – เวลาของคุณ</b><br/><span>'+(ai.identity.when?.statusLabel||"")+'</span> | Golden Window: <b>'+(ai.identity.when?.goldenWindow||"")+'</b><br/>'+(ai.identity.when?.currentDesc||"")+'<br/>'+(ai.identity.when?.actionPlan||"")+'<br/><small style="color:#DC2626">⚠️ '+(ai.identity.when?.warning||"")+'</small></div>':""}
<h2>📊 12 Dimensions</h2>${spiderSVG}
${Object.entries(scores).map(([k,v])=>'<div class="bar-row"><div class="bar-label"><span>'+(DM[k]?.icon)+" "+k+' <span style="font-size:10px;color:#94A3B8">('+(DM[k]?.pl)+')</span></span><b style="color:'+(DM[k]?.c)+'">'+(v.toFixed(1))+'</b></div><div class="bar-bg"><div class="bar-fill" style="width:'+(v*10)+'%;background:'+(DM[k]?.c)+'"></div></div></div>').join("")}
<h2>💪 จุดแข็ง</h2><div class="g">${so.slice(0,4).map(([k,v])=>'<div class="card"><span class="tag" style="background:#ECFDF5;color:#059669">'+(v.toFixed(1))+"</span> "+(DM[k]?.icon)+" "+k+"</div>").join("")}</div>
<h2>⚠️ จุดพัฒนา</h2><div class="g">${so.slice(-4).map(([k,v])=>'<div class="card"><span class="tag" style="background:#FFF1F2;color:#EF4444">'+(v.toFixed(1))+"</span> "+(DM[k]?.icon)+" "+k+"</div>").join("")}</div>
${ai.core?'<h2>🏛 5 Core Analysis</h2><p style="white-space:pre-wrap">'+(ai.core)+'</p>':""}
${ai["12d"]?'<h2>📐 12D Deep Analysis</h2><p style="white-space:pre-wrap">'+(ai["12d"])+'</p>':""}
${ai.shadow?'<h2>🌑 Shadow Analysis</h2><p style="white-space:pre-wrap">'+(ai.shadow)+'</p>':""}
${ai.love?'<h2>💕 Love & Compatibility — ชะตาความรักและไทม์ไลน์คู่แท้</h2><p style="white-space:pre-wrap">'+(ai.love)+'</p>':""}
${ai.principle?'<h2>✨ Life Principle หลักการใช้ชีวิต</h2><p style="font-style:italic;font-size:15px;line-height:1.9;padding:14px 18px;background:linear-gradient(135deg,#1E1B4B,#312E81);color:#E0E7FF;border-radius:10px">'+(ai.principle)+'</p>':""}
${wk} ${en} ${timelineHTML} ${jb} ${dashaHTML}
<div class="footer">Human System Studio · Vedic Astrology + Psychology · ${new Date().toLocaleDateString("th-TH")}</div></div></body></html>`;
    // Download as HTML file — compatible with iOS Safari
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    // Try download link first
    const a=document.createElement("a");a.href=url;a.download=`HSS-${nick}.html`;
    // iOS Safari fallback: open in new tab
    if(/iPhone|iPad|iPod/.test(navigator.userAgent)){
      const w=window.open();if(w){w.document.write(html);w.document.close()}else{window.location.href=url}
    } else {
      document.body.appendChild(a);a.click();document.body.removeChild(a);
    }
    setTimeout(()=>URL.revokeObjectURL(url),1000)};

  // ── MBTI SVG Characters ──
  const MBTI_SVG={
    "INTJ":(sc)=>{const s="#f5c8a0",h="#2c1810",o="#6c63d8",c="#6c63d8",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="43" cy="95" rx="22" ry="8" fill="#3a3a5c" transform="rotate(-6,43,95)"/><ellipse cx="57" cy="94" rx="20" ry="8" fill="#2e2e4a" transform="rotate(5,57,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="45" y="56" width="10" height="30" rx="3" fill="#5a52c4" opacity="0.5"/><polygon points="50,60 47,70 50,74 53,70" fill="#ff6b9d" opacity="0.8"/><rect x="15" y="62" width="21" height="8" rx="4" fill="${o}" transform="rotate(18,25,66)"/><rect x="5" y="74" width="22" height="16" rx="3" fill="#dde8ff" stroke="#aabce8" stroke-width="1"/><line x1="8" y1="78" x2="24" y2="78" stroke="${c}" stroke-width="1" opacity="0.5"/><line x1="8" y1="82" x2="22" y2="82" stroke="${c}" stroke-width="1" opacity="0.5"/><line x1="8" y1="86" x2="20" y2="86" stroke="${c}" stroke-width="1" opacity="0.5"/><rect x="64" y="56" width="21" height="8" rx="4" fill="${o}" transform="rotate(-30,74,60)"/><ellipse cx="75" cy="47" rx="5" ry="7" fill="${s}" transform="rotate(-30,75,47)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="18" ry="19" fill="${s}"/><ellipse cx="50" cy="22" rx="18" ry="10" fill="${h}"/><ellipse cx="34" cy="36" rx="5" ry="8" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="1.8" fill="#2a1a08"/><circle cx="58" cy="39" r="1.8" fill="#2a1a08"/><circle cx="44.5" cy="38.5" r="0.6" fill="#fff"/><circle cx="58.5" cy="38.5" r="0.6" fill="#fff"/><path d="M44 45 Q50 48 56 45" stroke="#c07060" stroke-width="1.5" fill="none" stroke-linecap="round"/><rect x="38" y="35" width="11" height="7" rx="3" fill="none" stroke="${c}" stroke-width="1.2"/><rect x="51" y="35" width="11" height="7" rx="3" fill="none" stroke="${c}" stroke-width="1.2"/><line x1="34" y1="38" x2="38" y2="38" stroke="${c}" stroke-width="1.2"/><line x1="62" y1="38" x2="66" y2="38" stroke="${c}" stroke-width="1.2"/></svg>`},
    "INTP":(sc)=>{const s="#f0c890",h="#2a1808",o="#378add",c="#378add",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="94" rx="22" ry="8" fill="#404060" transform="rotate(-5,42,94)"/><ellipse cx="58" cy="93" rx="20" ry="8" fill="#303050" transform="rotate(4,58,93)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="13" y="60" width="21" height="8" rx="4" fill="${o}" transform="rotate(15,23,64)"/><ellipse cx="12" cy="52" rx="5" ry="7" fill="${s}" transform="rotate(15,12,52)"/><rect x="64" y="62" width="21" height="8" rx="4" fill="${o}" transform="rotate(-10,74,66)"/><circle cx="74" cy="44" r="8" fill="${c}" opacity="0.12"/><text x="74" y="48" text-anchor="middle" font-size="10" fill="${c}" opacity="0.9">?</text><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="18" ry="19" fill="${s}"/><ellipse cx="50" cy="22" rx="19" ry="10" fill="${h}"/><ellipse cx="34" cy="34" rx="5" ry="10" fill="${h}"/><ellipse cx="66" cy="34" rx="5" ry="10" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="2" fill="#1a0f06"/><circle cx="58" cy="39" r="2" fill="#1a0f06"/><circle cx="44.5" cy="38.5" r="0.7" fill="#fff"/><circle cx="58.5" cy="38.5" r="0.7" fill="#fff"/><path d="M45 45 Q50 48 55 45" stroke="#b07060" stroke-width="1.5" fill="none"/></svg>`},
    "ENTJ":(sc)=>{const s="#f2c888",h="#1a0e06",o="#1d9e75",c="#1d9e75",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="94" rx="22" ry="8" fill="#1a2020" transform="rotate(-5,42,94)"/><ellipse cx="58" cy="93" rx="20" ry="8" fill="#141a1a" transform="rotate(4,58,93)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="34" y="52" width="32" height="8" rx="4" fill="${o}" opacity="0.7"/><rect x="13" y="58" width="23" height="8" rx="4" fill="${o}"/><rect x="64" y="58" width="23" height="8" rx="4" fill="${o}"/><ellipse cx="86" cy="46" rx="6" ry="7" fill="${s}" transform="rotate(-20,86,46)"/><polygon points="75,34 84,24 87,33" fill="${c}" opacity="0.7"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="19" ry="11" fill="${h}"/><ellipse cx="34" cy="34" rx="5" ry="10" fill="${h}"/><circle cx="43" cy="37" r="3" fill="#fff"/><circle cx="57" cy="37" r="3" fill="#fff"/><circle cx="44" cy="38" r="2.2" fill="#0a0604"/><circle cx="58" cy="38" r="2.2" fill="#0a0604"/><circle cx="44.5" cy="37.5" r="0.8" fill="#fff"/><circle cx="58.5" cy="37.5" r="0.8" fill="#fff"/><line x1="43" y1="44" x2="57" y2="44" stroke="#c07040" stroke-width="1.8" stroke-linecap="round"/></svg>`},
    "ENTP":(sc)=>{const s="#f5d5a0",h="#2a1505",o="#0f6e56",c="#0f6e56",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="22" ry="8" fill="#c88050" transform="rotate(-8,42,95)"/><ellipse cx="58" cy="94" rx="20" ry="8" fill="#b07040" transform="rotate(6,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="8" y="58" width="28" height="8" rx="4" fill="${o}" transform="rotate(12,22,62)"/><ellipse cx="8" cy="55" rx="6" ry="7" fill="${s}" transform="rotate(12,8,55)"/><rect x="64" y="56" width="28" height="8" rx="4" fill="${o}" transform="rotate(-15,78,60)"/><ellipse cx="92" cy="52" rx="6" ry="7" fill="${s}" transform="rotate(-15,92,52)"/><path d="M62,30 Q72,22 74,34 Q72,40 62,36" fill="${c}" opacity="0.15"/><text x="68" y="36" text-anchor="middle" font-size="9" fill="${c}" opacity="0.9">!</text><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="19" ry="11" fill="${h}"/><ellipse cx="34" cy="34" rx="6" ry="12" fill="${h}"/><circle cx="43" cy="37" r="3" fill="#fff"/><circle cx="57" cy="37" r="3" fill="#fff"/><circle cx="44" cy="38" r="2" fill="#1a0e06"/><circle cx="58" cy="38" r="2" fill="#1a0e06"/><circle cx="44.5" cy="37.5" r="0.7" fill="#fff"/><circle cx="58.5" cy="37.5" r="0.7" fill="#fff"/><path d="M43 44 Q50 48 57 44" stroke="#d06040" stroke-width="2" fill="none"/></svg>`},
    "INFJ":(sc)=>{const s="#f0c890",h="#3a2040",o="#7f77dd",c="#7f77dd",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><circle cx="50" cy="55" r="46" fill="none" stroke="${c}" stroke-width="1" opacity="0.2"/><ellipse cx="42" cy="95" rx="26" ry="10" fill="#9b8ec4" transform="rotate(-5,42,95)"/><ellipse cx="58" cy="94" rx="24" ry="10" fill="#8a7eb8" transform="rotate(4,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="16" y="74" width="22" height="8" rx="4" fill="${o}" transform="rotate(-12,27,78)"/><ellipse cx="14" cy="83" rx="8" ry="5" fill="${s}" transform="rotate(-12,14,83)"/><rect x="62" y="74" width="22" height="8" rx="4" fill="${o}" transform="rotate(12,73,78)"/><ellipse cx="86" cy="83" rx="8" ry="5" fill="${s}" transform="rotate(12,86,83)"/><circle cx="18" cy="52" r="3" fill="${c}" opacity="0.5"/><circle cx="82" cy="48" r="2.5" fill="${c}" opacity="0.4"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="20" ry="11" fill="${h}"/><rect x="30" y="28" width="9" height="24" rx="4" fill="${h}"/><rect x="61" y="28" width="9" height="22" rx="4" fill="${h}"/><path d="M37 60 Q40 57 43 60" stroke="#3a2010" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M57 60 Q60 57 63 60" stroke="#3a2010" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M43 46 Q50 50 57 46" stroke="#b07090" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="50" cy="30" r="2" fill="${c}" opacity="0.7"/></svg>`},
    "INFP":(sc)=>{const s="#f8d5b0",h="#4a2015",o="#d4537e",c="#d4537e",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="24" ry="9" fill="#c8a060" transform="rotate(-7,42,95)"/><ellipse cx="58" cy="94" rx="22" ry="9" fill="#b89050" transform="rotate(5,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="16" y="74" width="22" height="8" rx="4" fill="${o}"/><ellipse cx="14" cy="83" rx="8" ry="5" fill="${s}"/><rect x="62" y="74" width="22" height="8" rx="4" fill="${o}"/><ellipse cx="86" cy="83" rx="8" ry="5" fill="${s}"/><circle cx="50" cy="72" r="5" fill="${c}" opacity="0.2"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="20" ry="11" fill="${h}"/><ellipse cx="34" cy="36" rx="6" ry="12" fill="${h}"/><ellipse cx="66" cy="36" rx="6" ry="12" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="1.8" fill="#2a1010"/><circle cx="58" cy="39" r="1.8" fill="#2a1010"/><path d="M44 46 Q50 51 56 46" stroke="#c04060" stroke-width="2" fill="none"/><ellipse cx="40" cy="44" rx="5" ry="3" fill="#f4a0b0" opacity="0.5"/><ellipse cx="60" cy="44" rx="5" ry="3" fill="#f4a0b0" opacity="0.5"/></svg>`},
    "ENFJ":(sc)=>{const s="#f0c890",h="#2a1508",o="#ba7517",c="#ba7517",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="24" ry="9" fill="#886030" transform="rotate(-7,42,95)"/><ellipse cx="58" cy="94" rx="22" ry="9" fill="#705020" transform="rotate(5,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="8" y="60" width="28" height="8" rx="4" fill="${o}" transform="rotate(10,22,64)"/><ellipse cx="7" cy="57" rx="6" ry="7" fill="${s}" transform="rotate(10,7,57)"/><rect x="64" y="60" width="28" height="8" rx="4" fill="${o}" transform="rotate(-10,78,64)"/><ellipse cx="93" cy="57" rx="6" ry="7" fill="${s}" transform="rotate(-10,93,57)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="19" ry="11" fill="${h}"/><ellipse cx="34" cy="34" rx="5" ry="10" fill="${h}"/><ellipse cx="66" cy="34" rx="5" ry="10" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="2" fill="#1a0e06"/><circle cx="58" cy="39" r="2" fill="#1a0e06"/><path d="M43 46 Q50 51 57 46" stroke="#d08020" stroke-width="2" fill="none"/><ellipse cx="40" cy="44" rx="5" ry="3" fill="#ffc080" opacity="0.5"/><ellipse cx="60" cy="44" rx="5" ry="3" fill="#ffc080" opacity="0.5"/></svg>`},
    "ENFP":(sc)=>{const s="#fcd8b0",h="#8b4513",o="#ff9f43",c="#ff9f43",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="40" cy="96" rx="26" ry="10" fill="#c8a060" transform="rotate(-10,40,96)"/><ellipse cx="60" cy="95" rx="24" ry="10" fill="#b89050" transform="rotate(8,60,95)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="-2" y="54" width="34" height="9" rx="4" fill="${o}" transform="rotate(8,15,58)"/><ellipse cx="-2" cy="52" rx="7" ry="8" fill="${s}" transform="rotate(8,-2,52)"/><rect x="68" y="54" width="34" height="9" rx="4" fill="${o}" transform="rotate(-8,85,58)"/><ellipse cx="102" cy="52" rx="7" ry="8" fill="${s}" transform="rotate(-8,102,52)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="20" ry="21" fill="${s}"/><ellipse cx="50" cy="20" rx="21" ry="12" fill="${h}"/><ellipse cx="32" cy="34" rx="8" ry="15" fill="${h}"/><ellipse cx="68" cy="34" rx="8" ry="15" fill="#a0522d"/><circle cx="43" cy="37" r="3.5" fill="#fff"/><circle cx="57" cy="37" r="3.5" fill="#fff"/><circle cx="44" cy="38" r="2" fill="#3a2010"/><circle cx="58" cy="38" r="2" fill="#3a2010"/><path d="M42 46 Q50 54 58 46" stroke="#e06040" stroke-width="2" fill="#fff" opacity="0.7"/><ellipse cx="38" cy="43" rx="6" ry="4" fill="#ffb0a0" opacity="0.5"/><ellipse cx="62" cy="43" rx="6" ry="4" fill="#ffb0a0" opacity="0.5"/></svg>`},
    "ISTJ":(sc)=>{const s="#eac888",h="#1c1008",o="#444441",c="#444441",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="22" ry="8" fill="#303028" transform="rotate(-5,42,95)"/><ellipse cx="58" cy="94" rx="20" ry="8" fill="#282820" transform="rotate(4,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="46" y="56" width="8" height="30" rx="3" fill="#333330" opacity="0.5"/><rect x="13" y="60" width="23" height="8" rx="4" fill="${o}"/><rect x="64" y="60" width="23" height="8" rx="4" fill="${o}"/><rect x="62" y="50" width="22" height="28" rx="4" fill="${o}" opacity="0.6"/><line x1="65" y1="56" x2="81" y2="56" stroke="#fff" stroke-width="1" opacity="0.5"/><line x1="65" y1="61" x2="81" y2="61" stroke="#fff" stroke-width="1" opacity="0.5"/><line x1="65" y1="66" x2="78" y2="66" stroke="#fff" stroke-width="1" opacity="0.5"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="18" ry="19" fill="${s}"/><ellipse cx="50" cy="22" rx="18" ry="10" fill="${h}"/><ellipse cx="34" cy="34" rx="5" ry="9" fill="${h}"/><ellipse cx="66" cy="34" rx="5" ry="9" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="2" fill="#0e0c08"/><circle cx="58" cy="39" r="2" fill="#0e0c08"/><line x1="44" y1="45" x2="56" y2="45" stroke="#b08060" stroke-width="1.8" stroke-linecap="round"/></svg>`},
    "ISFJ":(sc)=>{const s="#f2d0a0",h="#241408",o="#378add",c="#378add",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="24" ry="9" fill="#88a8cc" transform="rotate(-6,42,95)"/><ellipse cx="58" cy="94" rx="22" ry="9" fill="#7898bc" transform="rotate(5,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><path d="M34,64 Q50,58 66,64 Q66,78 50,84 Q34,78 34,64" fill="${c}" opacity="0.18"/><rect x="14" y="66" width="22" height="8" rx="4" fill="${o}" transform="rotate(-8,25,70)"/><ellipse cx="12" cy="74" rx="7" ry="5" fill="${s}" transform="rotate(-8,12,74)"/><rect x="64" y="66" width="22" height="8" rx="4" fill="${o}" transform="rotate(8,75,70)"/><ellipse cx="88" cy="74" rx="7" ry="5" fill="${s}" transform="rotate(8,88,74)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="19" ry="11" fill="${h}"/><ellipse cx="34" cy="34" rx="6" ry="12" fill="${h}"/><ellipse cx="66" cy="34" rx="6" ry="12" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="1.8" fill="#1a0e08"/><circle cx="58" cy="39" r="1.8" fill="#1a0e08"/><path d="M43 46 Q50 50 57 46" stroke="#b08060" stroke-width="1.8" fill="none"/><ellipse cx="40" cy="44" rx="5" ry="3" fill="#ffc0a0" opacity="0.45"/><ellipse cx="60" cy="44" rx="5" ry="3" fill="#ffc0a0" opacity="0.45"/></svg>`},
    "ESTJ":(sc)=>{const s="#ecc080",h="#1e1208",o="#3b6d11",c="#3b6d11",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="94" rx="22" ry="8" fill="#202820" transform="rotate(-5,42,94)"/><ellipse cx="58" cy="93" rx="20" ry="8" fill="#181e18" transform="rotate(4,58,93)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="34" y="52" width="32" height="8" rx="4" fill="${o}" opacity="0.7"/><rect x="13" y="56" width="23" height="8" rx="4" fill="${o}"/><rect x="64" y="52" width="23" height="8" rx="4" fill="${o}" transform="rotate(-20,75,56)"/><ellipse cx="85" cy="46" rx="6" ry="7" fill="${s}" transform="rotate(-20,85,46)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="18" ry="19" fill="${s}"/><ellipse cx="50" cy="22" rx="18" ry="10" fill="${h}"/><ellipse cx="34" cy="34" rx="5" ry="8" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="2" fill="#0e0c06"/><circle cx="58" cy="39" r="2" fill="#0e0c06"/><line x1="43" y1="45" x2="57" y2="45" stroke="#c08040" stroke-width="1.8" stroke-linecap="round"/></svg>`},
    "ESFJ":(sc)=>{const s="#f8d8b0",h="#3e1810",o="#993556",c="#993556",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="24" ry="9" fill="#b08070" transform="rotate(-7,42,95)"/><ellipse cx="58" cy="94" rx="22" ry="9" fill="#a07060" transform="rotate(5,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="8" y="60" width="26" height="8" rx="4" fill="${o}" transform="rotate(12,21,64)"/><ellipse cx="7" cy="57" rx="6" ry="7" fill="${s}" transform="rotate(12,7,57)"/><rect x="66" y="60" width="26" height="8" rx="4" fill="${o}" transform="rotate(-12,79,64)"/><ellipse cx="93" cy="57" rx="6" ry="7" fill="${s}" transform="rotate(-12,93,57)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="20" ry="11" fill="${h}"/><ellipse cx="34" cy="34" rx="6" ry="12" fill="${h}"/><ellipse cx="66" cy="34" rx="6" ry="12" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="1.8" fill="#2a1010"/><circle cx="58" cy="39" r="1.8" fill="#2a1010"/><path d="M43 46 Q50 51 57 46" stroke="#c04060" stroke-width="2" fill="none"/><ellipse cx="40" cy="44" rx="5" ry="3" fill="#f4a0b0" opacity="0.5"/><ellipse cx="60" cy="44" rx="5" ry="3" fill="#f4a0b0" opacity="0.5"/></svg>`},
    "ISTP":(sc)=>{const s="#f0c878",h="#241408",o="#5f5e5a",c="#5f5e5a",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="22" ry="8" fill="#404038" transform="rotate(-5,42,95)"/><ellipse cx="58" cy="94" rx="20" ry="8" fill="#303028" transform="rotate(4,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="13" y="62" width="23" height="8" rx="4" fill="${o}"/><rect x="64" y="58" width="23" height="8" rx="4" fill="${o}" transform="rotate(-18,75,62)"/><rect x="80" y="48" width="5" height="16" rx="2" fill="#888" transform="rotate(-18,82,56)"/><circle cx="80" cy="46" r="5" fill="${c}" opacity="0.5" transform="rotate(-18,80,46)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="18" ry="19" fill="${s}"/><ellipse cx="50" cy="22" rx="18" ry="10" fill="${h}"/><ellipse cx="34" cy="34" rx="5" ry="9" fill="${h}"/><ellipse cx="66" cy="34" rx="5" ry="9" fill="${h}"/><circle cx="43" cy="38" r="3" fill="#fff"/><circle cx="57" cy="38" r="3" fill="#fff"/><circle cx="44" cy="39" r="2" fill="#1a0e06"/><circle cx="58" cy="39" r="2" fill="#1a0e06"/><path d="M44 45 Q50 48 56 45" stroke="#b08040" stroke-width="1.5" fill="none"/></svg>`},
    "ISFP":(sc)=>{const s="#f7d5b5",h="#5c3d2e",o="#f4748a",c="#d4537e",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="42" cy="95" rx="24" ry="9" fill="#b8bec8" transform="rotate(-8,42,95)"/><ellipse cx="58" cy="94" rx="22" ry="9" fill="#a8afc0" transform="rotate(6,58,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="14" y="62" width="22" height="8" rx="4" fill="${o}"/><ellipse cx="10" cy="72" rx="13" ry="9" fill="#f5e6c8" transform="rotate(-10,10,72)"/><circle cx="5" cy="69" r="3" fill="#f4748a"/><circle cx="12" cy="67" r="3" fill="#7ec8e3"/><circle cx="18" cy="70" r="3" fill="#a8e6cf"/><circle cx="14" cy="76" r="3" fill="#ffd166"/><circle cx="6" cy="76" r="2.5" fill="#c77dff"/><rect x="64" y="58" width="22" height="8" rx="4" fill="${o}" transform="rotate(-28,75,62)"/><rect x="76" y="42" width="4" height="22" rx="2" fill="#c8a882" transform="rotate(-28,78,53)"/><ellipse cx="75" cy="40" rx="4" ry="5" fill="${c}" opacity="0.8" transform="rotate(-28,75,40)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="20" ry="21" fill="${s}"/><ellipse cx="50" cy="20" rx="21" ry="12" fill="${h}"/><ellipse cx="32" cy="36" rx="7" ry="14" fill="${h}"/><ellipse cx="68" cy="34" rx="6" ry="12" fill="${h}"/><circle cx="43" cy="38" r="3.5" fill="#fff"/><circle cx="57" cy="38" r="3.5" fill="#fff"/><circle cx="44" cy="39" r="2" fill="#3a2010"/><circle cx="58" cy="39" r="2" fill="#3a2010"/><path d="M43 46 Q50 51 57 46" stroke="#d4607a" stroke-width="2" fill="none"/><ellipse cx="39" cy="44" rx="5" ry="3" fill="#f4a0b0" opacity="0.5"/><ellipse cx="61" cy="44" rx="5" ry="3" fill="#f4a0b0" opacity="0.5"/></svg>`},
    "ESTP":(sc)=>{const s="#f2c888",h="#1e0e06",o="#993c1d",c="#993c1d",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="38" cy="96" rx="22" ry="8" fill="#c88050" transform="rotate(-12,38,96)"/><ellipse cx="62" cy="94" rx="20" ry="8" fill="#b07040" transform="rotate(10,62,94)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="6" y="56" width="30" height="8" rx="4" fill="${o}" transform="rotate(18,21,60)"/><ellipse cx="5" cy="52" rx="6" ry="7" fill="${s}" transform="rotate(18,5,52)"/><rect x="64" y="58" width="23" height="8" rx="4" fill="${o}" transform="rotate(-15,75,62)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="19" ry="20" fill="${s}"/><ellipse cx="50" cy="21" rx="19" ry="10" fill="${h}"/><ellipse cx="34" cy="34" rx="5" ry="9" fill="${h}"/><ellipse cx="66" cy="34" rx="5" ry="9" fill="${h}"/><circle cx="43" cy="37" r="3" fill="#fff"/><circle cx="57" cy="37" r="3" fill="#fff"/><circle cx="44" cy="38" r="2.2" fill="#0a0604"/><circle cx="58" cy="38" r="2.2" fill="#0a0604"/><path d="M43 44 Q50 49 57 44" stroke="#c06030" stroke-width="2" fill="none"/></svg>`},
    "ESFP":(sc)=>{const s="#fcd5a8",h="#3a1008",o="#e24b4a",c="#e24b4a",W=100*sc,H=110*sc;return`<svg width="${W}" height="${H}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="106" rx="30" ry="5" fill="#d0d8f0" opacity="0.5"/><ellipse cx="38" cy="96" rx="24" ry="9" fill="#e87050" transform="rotate(-10,38,96)"/><ellipse cx="62" cy="95" rx="22" ry="9" fill="#d86040" transform="rotate(8,62,95)"/><rect x="34" y="56" width="32" height="34" rx="12" fill="${o}"/><rect x="2" y="54" width="32" height="9" rx="4" fill="${o}" transform="rotate(16,18,58)"/><ellipse cx="2" cy="51" rx="7" ry="8" fill="${s}" transform="rotate(16,2,51)"/><rect x="66" y="54" width="32" height="9" rx="4" fill="${o}" transform="rotate(-16,82,58)"/><ellipse cx="98" cy="51" rx="7" ry="8" fill="${s}" transform="rotate(-16,98,51)"/><rect x="44" y="50" width="12" height="10" rx="5" fill="${s}"/><ellipse cx="50" cy="38" rx="20" ry="21" fill="${s}"/><ellipse cx="50" cy="20" rx="21" ry="12" fill="${h}"/><ellipse cx="32" cy="34" rx="8" ry="16" fill="${h}"/><ellipse cx="68" cy="34" rx="8" ry="16" fill="#5a1808"/><circle cx="43" cy="37" r="3.5" fill="#fff"/><circle cx="57" cy="37" r="3.5" fill="#fff"/><circle cx="44" cy="38" r="2" fill="#2a0808"/><circle cx="58" cy="38" r="2" fill="#2a0808"/><path d="M41 46 Q50 55 59 46" stroke="#c03030" stroke-width="2.5" fill="#fff" opacity="0.6"/><ellipse cx="38" cy="43" rx="6" ry="4" fill="#ffb0a0" opacity="0.55"/><ellipse cx="62" cy="43" rx="6" ry="4" fill="#ffb0a0" opacity="0.55"/></svg>`}
  };

  const shareProfile=async()=>{if(!scores||!nick)return;
    const W=1080,H=2160;
    const canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext("2d");
    await document.fonts.ready;
    if(!ctx.roundRect)ctx.roundRect=function(x,y,w,h,r){const R=typeof r==="number"?r:r[0]||0;this.beginPath();this.moveTo(x+R,y);this.lineTo(x+w-R,y);this.arcTo(x+w,y,x+w,y+R,R);this.lineTo(x+w,y+h-R);this.arcTo(x+w,y+h,x+w-R,y+h,R);this.lineTo(x+R,y+h);this.arcTo(x,y+h,x,y+h-R,R);this.lineTo(x,y+R);this.arcTo(x,y,x+R,y,R);this.closePath()};
    // ── Data ──
    const mbti=calcMBTI(scores);
    const mMeta=MBTI_META[mbti]||{title:"The Strategic Visionary",th:"\u0E1C\u0E39\u0E49\u0E21\u0E35\u0E27\u0E34\u0E2A\u0E31\u0E22\u0E17\u0E31\u0E28\u0E19\u0E4C\u0E40\u0E0A\u0E34\u0E07\u0E01\u0E25\u0E22\u0E38\u0E17\u0E18\u0E4C"};
    const domP=calcDomPlanet(vedic||scores);
    const so=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const archEN=ai?.identity?.powerTitle||mMeta.title||"The Strategic Visionary";
    const desc=ai?.identity?.who?.mbtiCore||ai?.identity?.who?.vedicSoul||mMeta.th||"";
    const mbtiGrp=mbti[1]==="N"?(mbti[2]==="T"?"NT":"NF"):(mbti[3]==="J"?"SJ":"SP");
    const GRP_CLR={NT:"#6366F1",NF:"#0D9488",SJ:"#D97706",SP:"#E11D48"};
    const arcClr=GRP_CLR[mbtiGrp];
    const isPaid=plan==="deep"||plan==="all";
    // Wealth data from AI identity
    const wSkill=ai?.identity?.what?.skillTitle||"\u0E17\u0E31\u0E01\u0E29\u0E30\u0E2B\u0E25\u0E31\u0E01";
    const wHighlight=ai?.identity?.what?.skillHighlight||ai?.identity?.what?.marketValue||"";
    const wMoney=ai?.identity?.what?.moneyMaker||"";
    const wGap=ai?.identity?.what?.gapToClose||"\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25";
    // Shadow data
    const shadowTxt=ai?.shadow||"";
    // Spectrum dimensions (core 5)
    const SPEC=[
      {dim:"Cognitive Processing",color:"#10B981",left:"Analytical",right:"Creative"},
      {dim:"Emotional Regulation",color:"#FB923C",left:"Stable",right:"Sensitive"},
      {dim:"Identity Stability",color:"#60A5FA",left:"Confident",right:"Adaptable"},
      {dim:"Energy Management",color:"#F472B6",left:"Energetic",right:"Reserved"},
      {dim:"Growth Orientation",color:"#A78BFA",left:"Growth-Driven",right:"Steady"}
    ];
    // ── Helpers ──
    const fr=(x,y,w,h,r,fill)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()};
    const sr=(x,y,w,h,r,stroke,lw=2)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()};
    const tx=(s,x,y,font,color,align="left",mw)=>{ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline="alphabetic";mw?ctx.fillText(s,x,y,mw):ctx.fillText(s,x,y)};
    const wt=(text,x,y,maxW,lh,font,color,maxLines=99)=>{ctx.font=font;ctx.fillStyle=color;ctx.textAlign="left";let line="",cy=y,lc=0;const chars=[...text];for(const ch of chars){const test=line+ch;if(ctx.measureText(test).width>maxW&&line){if(++lc>=maxLines)break;ctx.fillText(line,x,cy);line=ch;cy+=lh;}else line=test;}if(line&&lc<maxLines)ctx.fillText(line,x,cy);return cy+lh};
    const linGrad=(x0,y0,x1,y1,stops)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);stops.forEach(([t,c])=>g.addColorStop(t,c));return g};
    const PAD=50;const IX=PAD+16;const IW=W-PAD*2-32;
    // ── Load SVG character as image ──
    const svgFn=MBTI_SVG[mbti]||MBTI_SVG["INTJ"];
    const svgStr=svgFn(2.8);
    const svgBlob=new Blob([svgStr],{type:"image/svg+xml;charset=utf-8"});
    const svgUrl=URL.createObjectURL(svgBlob);
    const charImg=await new Promise((res)=>{const img=new Image();img.onload=()=>res(img);img.onerror=()=>res(null);img.src=svgUrl;});
    // ══════════════════════════════════════
    // ── WHITE BACKGROUND ──
    ctx.fillStyle="#FFFFFF";ctx.fillRect(0,0,W,H);
    // ── PHONE FRAME ──
    sr(14,14,W-28,H-28,44,"#2D3561",5);
    let y=0;
    // ── TITLE BAR ──
    y=50;
    tx("Human System",IX,y+44,"800 44px 'Noto Sans Thai',sans-serif","#1E293B");
    tx("AI + Vedic + Psychology",W-IX,y+44,"400 20px 'Noto Sans Thai',sans-serif","#94A3B8","right");
    y+=76;
    // ── ARCHETYPE CARD ──
    const cardH=340;
    fr(IX,y,IW,cardH,24,"#F3F4F6");
    // SVG Character on right (draw first so text overlaps if needed)
    if(charImg){const cW=260,cH=286;ctx.drawImage(charImg,IX+IW-cW+4,y+28,cW,cH);}
    // "\u0E04\u0E38\u0E13" + nickname (larger + more spacing below)
    tx("\u0E04\u0E38\u0E13 "+nick,IX+28,y+42,"700 32px 'Noto Sans Thai',sans-serif","#374151");
    // Archetype name (narrower to avoid overlap with character)
    const textMaxW=IW*0.44;
    const arcFsz=archEN.length>24?34:archEN.length>16?42:50;
    ctx.font="800 "+arcFsz+"px 'Noto Sans Thai',sans-serif";
    let arcLines=[];let arcLn="";
    for(const word of archEN.split(" ")){const test=arcLn+(arcLn?" ":"")+word;if(ctx.measureText(test).width>textMaxW&&arcLn){arcLines.push(arcLn);arcLn=word;}else arcLn=test;}
    if(arcLn)arcLines.push(arcLn);
    arcLines.forEach((ln,i)=>{tx(ln,IX+28,y+86+(i)*(arcFsz+6),"800 "+arcFsz+"px 'Noto Sans Thai',sans-serif",arcClr);});
    const arcBot=y+86+(arcLines.length-1)*(arcFsz+6)+12;
    // MBTI badge
    tx(mbti,IX+28,arcBot+30,"700 30px 'Noto Sans Thai',sans-serif",arcClr+"BB");
    // Description + planet
    const descClean=desc.replace(/^[A-Z]+\s*[\u2013\u2014-]\s*/,"").slice(0,120);
    const descEnd=wt(descClean,IX+28,arcBot+68,textMaxW,30,"400 22px 'Noto Sans Thai',sans-serif","#64748B",3);
    // Planet info
    tx(domP.icon+" "+domP.planet+" \u0E40\u0E14\u0E48\u0E19",IX+28,Math.max(descEnd+10,y+cardH-36),"500 22px 'Noto Sans Thai',sans-serif","#94A3B8");
    y+=cardH+20;
    // ── SPECTRUM BARS (5 core dimensions — bigger bars) ──
    const barPadL=110,barPadR=110;
    const barTotalW=IW-barPadL-barPadR;
    const barH=36;
    SPEC.forEach(s=>{
      const sc=scores[s.dim]||5;
      const leftPct=Math.round(sc*10);
      const rightPct=100-leftPct;
      const leftDom=leftPct>=rightPct;
      // Dimension name
      tx(s.dim,IX+IW/2,y+26,"700 24px 'Noto Sans Thai',sans-serif",s.color,"center");
      y+=36;
      // Left %
      tx("%"+leftPct,IX+8,y+28,"700 28px 'Noto Sans Thai',sans-serif",leftDom?s.color:"#64748B");
      // Right %
      tx("%"+rightPct,IX+IW-8,y+28,"700 28px 'Noto Sans Thai',sans-serif",!leftDom?s.color:"#64748B","right");
      // Bar
      const bx=IX+barPadL,bw=barTotalW;
      const leftW=bw*leftPct/100;
      ctx.save();
      ctx.beginPath();ctx.roundRect(bx,y+6,bw,barH,barH/2);ctx.clip();
      ctx.fillStyle=leftDom?s.color:"#E2E8F0";ctx.fillRect(bx,y+6,leftW,barH);
      ctx.fillStyle=leftDom?"#E2E8F0":s.color;ctx.fillRect(bx+leftW,y+6,bw-leftW,barH);
      ctx.restore();
      y+=48;
      // Labels
      tx(s.left,IX+8,y+18,"600 22px 'Noto Sans Thai',sans-serif",leftDom?s.color:"#94A3B8");
      tx(s.right,IX+IW-8,y+18,"600 22px 'Noto Sans Thai',sans-serif",!leftDom?s.color:"#94A3B8","right");
      y+=40;
    });
    y+=20;
    // ── WEALTH & MARKET VALUE (green card) ──
    const wCardH=320;
    fr(IX,y,IW,wCardH,24,"#ECFDF5");
    sr(IX,y,IW,wCardH,24,"#A7F3D0",2);
    tx("\uD83D\uDCB0 Wealth & Market Value",IX+28,y+40,"800 30px 'Noto Sans Thai',sans-serif","#065F46");
    // Skill title
    tx("\u0E17\u0E31\u0E01\u0E29\u0E30\u0E2B\u0E25\u0E31\u0E01: "+wSkill,IX+28,y+76,"700 24px 'Noto Sans Thai',sans-serif","#047857");
    // Highlight
    if(wHighlight)wt(wHighlight,IX+28,y+110,IW-56,28,"400 22px 'Noto Sans Thai',sans-serif","#1E293B",2);
    // Money maker
    if(wMoney){tx("\uD83D\uDCB5 "+wMoney,IX+28,y+170,"600 22px 'Noto Sans Thai',sans-serif","#059669");}
    // Gap card (brown/amber inside green card)
    const gapY=y+200;const gapH=wCardH-220;
    fr(IX+20,gapY,IW-40,gapH,16,"#FFFBEB");
    sr(IX+20,gapY,IW-40,gapH,16,"#FDE68A",2);
    tx("\u26A0\uFE0F \u0E08\u0E38\u0E14\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E12\u0E19\u0E32",IX+40,gapY+32,"700 24px 'Noto Sans Thai',sans-serif","#92400E");
    wt(wGap,IX+40,gapY+64,IW-96,28,"400 22px 'Noto Sans Thai',sans-serif","#78350F",2);
    y+=wCardH+20;
    // ── SHADOW ANALYSIS ──
    if(isPaid&&shadowTxt){
      // Paid plan — combine trigger + solution in one flowing paragraph
      // Extract ⚡ Trigger section from shadow text
      const trigMatch=shadowTxt.match(/⚡\s*Trigger[^\n]*\n([\s\S]*?)(?=\n🔄|$)/);
      const shClean=trigMatch?("⚡ Shadow Trigger: "+trigMatch[1].replace(/\n+/g," ").replace(/\s+/g," ").trim()).slice(0,300):shadowTxt.replace(/\n+/g," ").replace(/\s+/g," ").trim().slice(0,300);
      // Fixed 3-line layout
      const shCardH=160;
      fr(IX,y,IW,shCardH,24,"#1E1B4B");
      tx("🌑 Shadow Analysis",IX+28,y+38,"800 28px 'Noto Sans Thai',sans-serif","#E0E7FF");
      wt(shClean,IX+28,y+70,IW-56,28,"400 22px 'Noto Sans Thai',sans-serif","#C7D2FE",3);
      y+=shCardH+20;
    }else{
      // Free plan — hook to try assessment
      const hookH=180;
      fr(IX,y,IW,hookH,24,"#F3F4F6");
      sr(IX,y,IW,hookH,24,"#E2E8F0",2);
      tx("\uD83D\uDD12",IX+28,y+48,"500 36px sans-serif","#5B21B6");
      tx("Shadow Analysis",IX+78,y+44,"800 28px 'Noto Sans Thai',sans-serif","#5B21B6");
      tx("\u0E1B\u0E25\u0E14\u0E25\u0E47\u0E2D\u0E04\u0E14\u0E49\u0E32\u0E19\u0E21\u0E37\u0E14\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E43\u0E19\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E44\u0E21\u0E48\u0E40\u0E04\u0E22\u0E23\u0E39\u0E49",IX+28,y+86,"400 24px 'Noto Sans Thai',sans-serif","#64748B");
      const btnW2=IW-56;
      fr(IX+28,y+116,btnW2,44,22,linGrad(IX+28,0,IX+28+btnW2,0,[[0,"#6D28D9"],[1,"#5B21B6"]]));
      tx("\u0E25\u0E2D\u0E07\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E1F\u0E23\u0E35  \u2192",IX+28+btnW2/2,y+146,"700 22px 'Noto Sans Thai',sans-serif","#fff","center");
      y+=hookH+20;
    }
    // ── FOOTER ──
    tx("\u2726 humansystemstudio.com",W/2,y+24,"600 22px 'Noto Sans Thai',sans-serif","#C7D2FE","center");
    // Cleanup SVG URL
    URL.revokeObjectURL(svgUrl);
    // ── Trim canvas to content height ──
    const finalH=Math.min(y+80,H);
    const outCanvas=document.createElement("canvas");outCanvas.width=W;outCanvas.height=finalH;
    const octx=outCanvas.getContext("2d");
    octx.drawImage(canvas,0,0);
    // Redraw phone frame on trimmed canvas
    octx.beginPath();octx.roundRect(14,14,W-28,finalH-28,44);octx.strokeStyle="#2D3561";octx.lineWidth=5;octx.stroke();
    // ── DOWNLOAD PNG ──
    outCanvas.toBlob(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`HSS-${nick}-share.png`;
      if(/iPhone|iPad|iPod/.test(navigator.userAgent)){const w=window.open();if(w){w.document.write('<img src="'+url+'" style="width:100%">');w.document.close()}else{document.body.appendChild(a);a.click();document.body.removeChild(a)}}
      else{document.body.appendChild(a);a.click();document.body.removeChild(a)}
      setTimeout(()=>URL.revokeObjectURL(url),1000);},"image/png");};

  // Login/Signup Modal rendered inline with stable input refs
  const loginModalJSX=loginModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}} onClick={()=>{setLoginModal(false);setAuthErr("")}}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:24,maxWidth:360,width:"100%"}}>
  <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{authMode==="login"?"🔐 เข้าสู่ระบบ":"✨ สมัครสมาชิก"}</div>
  <div style={{fontSize:12,color:"#64748B",marginBottom:16}}>{authMode==="login"?"เข้าสู่ระบบเพื่อซื้อแพ็คเกจ":"สร้างบัญชีใหม่ (ไม่ต้องใช้เบอร์โทร)"}</div>
  {authErr&&<div style={{padding:"8px 12px",borderRadius:8,background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",fontSize:12,marginBottom:12}}>{authErr}</div>}
  <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:"#64748B",display:"block",marginBottom:4}}>อีเมล</label><input key="auth-email-input" ref={authEmailRef} defaultValue={email||localStorage.getItem("hss_user_email")||""} placeholder="your@email.com" type="email" autoComplete="email" style={{width:"100%",padding:"10px 14px",fontSize:14,border:"2px solid #E2E8F0",borderRadius:10,outline:"none",boxSizing:"border-box"}}/></div>
  <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,color:"#64748B",display:"block",marginBottom:4}}>รหัสผ่าน</label><input key="auth-pw-input" ref={authPwRef} defaultValue="" type="password" placeholder={authMode==="signup"?"ตั้งรหัสผ่าน (อย่างน้อย 6 ตัว)":"รหัสผ่าน"} autoComplete={authMode==="signup"?"new-password":"current-password"} onKeyDown={e=>{if(e.key==="Enter"){authMode==="login"?doLogin():doSignup()}}} style={{width:"100%",padding:"10px 14px",fontSize:14,border:"2px solid #E2E8F0",borderRadius:10,outline:"none",boxSizing:"border-box"}}/></div>
  <Btn onClick={authMode==="login"?doLogin:doSignup} ok={!authLoading}>{authLoading?"กำลังดำเนินการ...":authMode==="login"?"เข้าสู่ระบบ →":"สมัครสมาชิก →"}</Btn>
  <div style={{textAlign:"center",marginTop:12}}><button onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("")}} style={{background:"none",border:"none",fontSize:12,color:"#6366F1",fontWeight:600,cursor:"pointer"}}>{authMode==="login"?"ยังไม่มีบัญชี? สมัครสมาชิก":"มีบัญชีแล้ว? เข้าสู่ระบบ"}</button></div>
  <div style={{display:"flex",alignItems:"center",gap:8,margin:"12px 0"}}><div style={{flex:1,height:1,background:"#E2E8F0"}}/><span style={{fontSize:11,color:"#94A3B8"}}>หรือ</span><div style={{flex:1,height:1,background:"#E2E8F0"}}/></div>
  <button onClick={doGoogle} disabled={authLoading} style={{width:"100%",padding:10,borderRadius:8,border:"2px solid #E2E8F0",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>เข้าด้วย Google</button>
  </div></div>;

  // ─── LANDING ───
  const FT_DESC={"Identity Snapshot (AI)":{en:"Identity Snapshot (AI)",th:"สแกนตัวตนด้วย AI",desc:"สรุปภาพรวมว่าคุณเป็นคนแบบไหนใน 1 นาที"},"5 Core Scores + AI วิเคราะห์":{en:"5 Core Scores",th:"5 พลังหลักในตัวคุณ",desc:"วัดระดับความเก่งใน 5 ด้านสำคัญ — จุดแข็ง / จุดพัฒนา"},"จุดแข็ง / จุดพัฒนา 12 มิติ":{en:"12 Dimensions",th:"12 ด้านของชีวิต (ดี/ด้อย)",desc:"เจาะลึกว่าจุดไหนคือ 'บ่อเงินบ่อทอง' จุดไหนคือ 'รูรั่ว'"},"Shadow Analysis เชิงลึก":{en:"Shadow Analysis",th:"วิเคราะห์ 'จุดบอด' ขัดลาภ",desc:"เผยนิสัยลึกๆ ที่มักทำให้พังหรือเสียโอกาส"},"Love & Compatibility ชะตาความรัก":{en:"Love & Compatibility",th:"ชะตาความรัก & ไทม์ไลน์คู่แท้",desc:"วิเคราะห์รากเหง้ารักพัง คู่ครองที่เสริมดวง และช่วงเวลาที่จะพบคู่แท้"},"Life Principle หลักการใช้ชีวิต":{en:"Life Principle",th:"คู่มือการใช้ชีวิตเฉพาะคุณ",desc:"กฎเหล็กที่ถ้าทำตามแล้วชีวิตจะรุ่งเรือง"},"Life Phase Map (Dasha)":{en:"Life Phase Map",th:"แผนที่จังหวะชีวิต (ขาขึ้น/ขาลง)",desc:"บอกว่าตอนนี้คุณอยู่ในช่วง 'สะสมบุญ' หรือ 'ตวงตักโชค'"},"Do & Don't รายสัปดาห์":{en:"Weekly Do & Don't",th:"สิ่งควรทำ-ควรเลี่ยง สัปดาห์นี้",desc:"บอกทางหนีทีไล่รายสัปดาห์ ไม่ให้ก้าวพลาด"},"7-Day Energy Forecast":{en:"7-Day Energy Forecast",th:"พยากรณ์พลังงาน 7 วัน",desc:"วันไหน 'พลังล้น' ควรลุย วันไหน 'พลังตก' ควรพัก"},"Dashboard กราฟชีวิตการงาน":{en:"Career Dashboard",th:"กราฟเส้นทางความสำเร็จ",desc:"ดูภาพรวมการงานตลอดปีแบบเข้าใจง่ายในหน้าเดียว"},"Job Matching AI":{en:"Job Matching AI",th:"AI ค้นหางานที่ 'ถูกโฉลก'",desc:"แนะนำอาชีพที่ทำแล้วรวยและมีความสุข ตามดวงและนิสัย"},"PDF Report ดาวน์โหลด":{en:"PDF Report",th:"รายงานฉบับเต็ม",desc:"ดาวน์โหลดผลวิเคราะห์ทุกด้านในไฟล์เดียว"},"Social Share Card":{en:"Share Card",th:"การ์ดแชร์โซเชียล",desc:"แชร์ผลลัพธ์ให้คนรู้จักคุณในแบบที่คุณเลือก"}};
  const Landing=()=><div style={{minHeight:"100vh"}}>
  {/* Nav */}
  <div style={{display:"flex",justifyContent:"flex-end",padding:"12px 20px 0"}}>{logged?<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:"#64748B"}}>{user?.email?.split("@")[0]}</span><button onClick={doLogout} style={{fontSize:11,color:"#64748B",background:"none",border:"1px solid #E2E8F0",borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>ออกจากระบบ</button></div>:<button onClick={()=>{setLoginModal(true);setAuthErr("");setAuthMode("login")}} style={{fontSize:12,fontWeight:600,color:"#4338CA",background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:8,padding:"6px 16px",cursor:"pointer"}}>เข้าสู่ระบบ / สมัคร</button>}</div>

  {/* Hero */}
  <div style={{textAlign:"center",padding:"40px 20px 32px",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 20%,rgba(67,56,202,.08),transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(139,92,246,.06),transparent 50%)",zIndex:0}}/><div style={{position:"relative",zIndex:1}}><div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#4338CA,#6D28D9)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#fff",boxShadow:"0 8px 24px rgba(67,56,202,.3)",animation:"hfl 3s ease-in-out infinite",marginBottom:16}}>✦</div><h1 style={{fontSize:26,fontWeight:800,color:"#1E293B",marginBottom:6}}>{BRAND}</h1><h2 style={{fontSize:22,fontWeight:800,color:"#1E293B",lineHeight:1.4,marginBottom:8,maxWidth:340,margin:"0 auto 8px"}}>ยังไม่รู้ว่าชีวิตควรไปทางไหน?<br/><span style={{color:"#4338CA"}}>รู้คำตอบที่ชัดขึ้นใน 10 นาที</span></h2><p style={{fontSize:13,color:"#64748B",lineHeight:1.7,maxWidth:340,margin:"0 auto 20px"}}>เข้าใจตัวเองให้ชัดขึ้น แล้วตัดสินใจเรื่องงาน เงิน และความรักได้ดีขึ้น</p><div style={{maxWidth:280,margin:"0 auto"}}><Btn onClick={()=>setSc("profile")}>ดูผลลัพธ์ของฉัน →</Btn><div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#94A3B8"}}>ฟรี · ใช้เวลาไม่เกิน 10 นาที · ไม่ต้องใช้บัตรเครดิต</div>{logged&&scores&&<button onClick={()=>setSc("results")} style={{width:"100%",marginTop:8,padding:10,borderRadius:8,border:"2px solid #6366F1",background:"#fff",color:"#4338CA",fontSize:13,fontWeight:700,cursor:"pointer"}}>📊 ดูผลลัพธ์เดิม</button>}</div></div></div>

  <div style={{padding:"0 20px",maxWidth:520,margin:"0 auto"}}>

  {/* PAIN */}
  <Card style={{background:"linear-gradient(135deg,#FEF3C7,#FFF7ED)",border:"1px solid #FDE68A",marginBottom:12}}>
    <div style={{fontSize:14,fontWeight:700,color:"#92400E",marginBottom:8,lineHeight:1.6}}>คุณอาจกำลังพยายามเต็มที่<br/>แต่ชีวิตยังไม่ไปไหน</div>
    <div style={{fontSize:12,color:"#78350F",lineHeight:1.7}}>ไม่ใช่เพราะคุณไม่เก่ง แต่อาจเป็นเพราะคุณยังใช้ตัวเองไม่ถูกทาง</div>
  </Card>

  {/* VALUE */}
  <div style={{marginBottom:16}}>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:10,color:"#1E293B"}}>คุณจะได้คำตอบที่ใช้ได้จริง</h3>
    {[{icon:"💼",text:"รู้ว่าเส้นทางงานแบบไหนเหมาะกับจุดแข็งของคุณจริง ๆ"},{icon:"🔁",text:"เห็นนิสัยหรือรูปแบบที่ทำให้คุณพลาดโอกาสซ้ำ ๆ"},{icon:"⚡",text:"รู้ว่าช่วงนี้ควรลุย เปลี่ยน หรือรอให้จังหวะชัดขึ้น"}].map((x,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",background:"#F8FAFC",borderRadius:10,marginBottom:6,border:"1px solid #E2E8F0"}}><span style={{fontSize:18,flexShrink:0,marginTop:1}}>{x.icon}</span><span style={{fontSize:13,fontWeight:600,color:"#1E293B",lineHeight:1.5}}>{x.text}</span></div>)}
  </div>

  {/* RESULT PREVIEW */}
  <div style={{marginBottom:16}}>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:10,color:"#1E293B"}}>ตัวอย่างผลลัพธ์ที่รอคุณอยู่</h3>
    <Card style={{background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",border:"2px solid #C7D2FE",position:"relative",overflow:"hidden",marginBottom:0}}>
      <div style={{position:"absolute",top:10,right:10,background:"#4338CA",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:6}}>ตัวอย่าง</div>
      <div style={{marginBottom:10}}><div style={{fontSize:11,color:"#94A3B8",marginBottom:4}}>บุคลิกภาพของคุณ</div><div style={{fontSize:16,fontWeight:800,color:"#4338CA",lineHeight:1.3}}>Visionary Leader<div style={{fontSize:11,color:"#6366F1",fontWeight:500,marginTop:2}}>ผู้นำที่มองภาพใหญ่และสื่อสารได้โดดเด่น</div></div></div>
      <div style={{display:"flex",gap:6,marginBottom:10}}>{[{l:"จุดที่ต้องระวัง",v:"Overthinking",c:"#DC2626",bg:"#FEF2F2"},{l:"จุดแข็งเด่น",v:"Creative Vision",c:"#059669",bg:"#ECFDF5"}].map((t,i)=><div key={i} style={{flex:1,background:t.bg,borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:10,color:"#94A3B8",marginBottom:2}}>{t.l}</div><div style={{fontSize:12,fontWeight:700,color:t.c}}>{t.v}</div></div>)}</div>
      <div style={{background:"#fff",borderRadius:8,padding:"8px 12px",border:"1px solid #DDD6FE"}}><div style={{fontSize:10,color:"#94A3B8",marginBottom:3}}>Next Move แนะนำ</div><div style={{fontSize:12,fontWeight:600,color:"#4338CA",lineHeight:1.5}}>ช่วง 6 เดือนข้างหน้า เหมาะกับการเปลี่ยนบทบาท ขยับตำแหน่ง หรือเริ่มต้นสิ่งใหม่อย่างจริงจัง</div></div>
    </Card>
    {/* LOCKED PREVIEW */}
    <div style={{background:"#1E1B4B",borderRadius:"0 0 12px 12px",padding:"12px 14px",marginBottom:0}}>
      <div style={{fontSize:11,fontWeight:700,color:"#A5B4FC",marginBottom:8}}>และนี่คือสิ่งที่คุณจะเห็นต่อหลังปลดล็อก</div>
      {["งานที่เหมาะกับจุดแข็งและรายได้สูงสุดของคุณ","ช่วงเวลาที่ชีวิตคุณมีโอกาสพุ่งแรงที่สุด","จุดบอดที่ทำให้คุณเสียโอกาสซ้ำ ๆ","รูปแบบความรักและคนที่เหมาะกับคุณจริง","คำแนะนำเฉพาะตัวว่าตอนนี้ควรลุย เปลี่ยน หรือรอ"].map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:12,color:"#C7D2FE"}}><span style={{fontSize:13}}>🔒</span><span>{t}</span></div>)}
    </div>
  </div>

  {/* SOCIAL PROOF — Reviews */}
  <div style={{marginBottom:20}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#1E293B"}}>คนที่ใช้แล้วบอกว่า</h3>
      <span style={{fontSize:11,color:"#94A3B8"}}>ปัดดูต่อ →</span>
    </div>
    <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,paddingRight:20,scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",msOverflowStyle:"none"}}>
      {[
        {name:"มิว",age:27,role:"HR Manager",avatar:"👩",stars:5,text:"ตอนแรกคิดว่าจะเหมือนทดสอบทั่วไป แต่ผลที่ได้มันเจาะจงมาก ตรงจุดเลย รู้เลยว่าที่ทำงานอยู่มันไม่ใช่ทาง เดือนเดียวหลังจากนั้นก็ลาออก",tag:"เรื่องงาน"},
        {name:"ปาล์ม",age:34,role:"Freelance Designer",avatar:"👨",stars:5,text:"ส่วน Shadow Analysis แม่นจนขนลุก มันบอกนิสัยที่ทำให้พลาดซ้ำได้เลย ตอนอ่านนั่งยิ้มคนเดียวเพราะมันตรงเกินไป",tag:"เรื่องตัวเอง"},
        {name:"แนน",age:24,role:"จบใหม่",avatar:"👩",stars:5,text:"ยังไม่รู้เลยว่าจะทำงานอะไร แต่หลังจากดูผล มันชัดขึ้นมากว่าจุดแข็งตัวเองอยู่ตรงไหน ตอนนี้เริ่ม apply ตรงสาย",tag:"เรื่องเส้นทาง"},
        {name:"โบ",age:31,role:"เจ้าของร้านออนไลน์",avatar:"👩",stars:5,text:"ส่วน timing ชีวิตตรงมาก ช่วงที่ผลบอกว่าควรพัก ตอนนั้นทำอะไรก็ไม่ผ่านจริงๆ พอรู้แล้วก็ไม่ฝืนอีก",tag:"เรื่องจังหวะชีวิต"},
        {name:"เก้",age:29,role:"Product Manager",avatar:"👨",stars:5,text:"ผลมันเชื่อมกันหมด ดวง + นิสัย + timing ไม่ใช่แค่บอกว่าคุณเป็นคนแบบไหน แต่บอกว่า ตอนนี้ควรทำอะไร อันนี้ใช้ได้จริง",tag:"ภาพรวม"}
      ].map((r,i)=>(
        <div key={i} style={{minWidth:"72%",scrollSnapAlign:"start",background:"#fff",borderRadius:14,padding:"12px 14px",border:"1px solid #E2E8F0",boxShadow:"0 2px 8px rgba(0,0,0,.05)",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{r.avatar}</div>
              <div><div style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>{r.name} <span style={{fontSize:11,color:"#94A3B8",fontWeight:400}}>{r.age}</span></div><div style={{fontSize:10,color:"#94A3B8"}}>{r.role}</div></div>
            </div>
            <span style={{fontSize:9,fontWeight:700,color:"#6366F1",background:"#EEF2FF",padding:"3px 8px",borderRadius:6,flexShrink:0}}>{r.tag}</span>
          </div>
          <div style={{fontSize:11,color:"#F59E0B",marginBottom:6,letterSpacing:1}}>{"★".repeat(r.stars)}</div>
          <p style={{fontSize:12,color:"#374151",lineHeight:1.7,margin:0}}>"{r.text}"</p>
        </div>
      ))}
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:6}}>
      {[0,1,2,3,4].map(i=><div key={i} style={{width:i===0?16:6,height:6,borderRadius:3,background:i===0?"#4338CA":"#E2E8F0",transition:"width .3s"}}/>)}
    </div>
  </div>

  {/* CTA */}
  <div style={{marginBottom:20}}><Btn onClick={()=>setSc("profile")}>ดูผลลัพธ์ของฉันตอนนี้ →</Btn><div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#94A3B8"}}>ฟรี · ใช้เวลา 10 นาที · ไม่ต้องใช้บัตรเครดิต</div></div>

  {/* TRUST */}
  <Card style={{background:"#F0FDF4",border:"1px solid #BBF7D0",marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:6}}>🛡 ข้อมูลของคุณเป็นเรื่องส่วนตัว</div><div style={{fontSize:11,color:"#15803D",lineHeight:1.7}}>คำตอบและผลลัพธ์ของคุณจะไม่ถูกเผยแพร่หรือขายต่อ ทุกอย่างถูกออกแบบให้คุณสำรวจตัวเองได้อย่างปลอดภัยและเป็นส่วนตัว</div></Card>

  {/* METHODOLOGY */}
  <Card style={{background:"#F8FAFC",border:"1px solid #E2E8F0",marginBottom:12}}>
    <div style={{fontSize:12,fontWeight:700,color:"#64748B",marginBottom:2}}>สร้างจากการวิเคราะห์หลายมิติ</div>
    <div style={{fontSize:11,color:"#94A3B8",marginBottom:8}}>เพื่อให้ผลลัพธ์มีทั้งมุมมองเชิงบุคลิก พฤติกรรม และจังหวะชีวิต</div>
    {[{i:"🪐",t:"พลังประจำตัวและจังหวะชีวิต"},{i:"📋",t:"แบบประเมินพฤติกรรมเชิงลึก"},{i:"🤖",t:"AI ที่ช่วยเชื่อมข้อมูลให้เข้าใจง่ายขึ้น"}].map((x,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:i<2?"1px solid #F1F5F9":"none"}}><span style={{fontSize:15}}>{x.i}</span><div style={{fontSize:11,color:"#374151"}}>{x.t}</div></div>)}
  </Card>

  <div style={{padding:"16px 0 40px"}}><Btn onClick={()=>setSc("profile")}>ดูผลลัพธ์ของฉัน →</Btn></div>
  </div></div>;

  // ─── PROFILE (fixed input) ───
  const Profile=()=>{const inp={width:"100%",padding:"10px 14px",fontSize:14,border:"2px solid #E2E8F0",borderRadius:10,outline:"none",background:"#fff",boxSizing:"border-box"};const lbl={fontSize:12,fontWeight:600,color:"#64748B",marginBottom:4,display:"block"};const bp=bday.split("-");const ok=nick&&email&&bp.length===3&&bp[0]&&bp[1]&&bp[2]&&bp[0]!=="undefined"&&(knowT===true?(btime&&btime.includes(":")):(knowT===false?tSlot:false));
  return<div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><button onClick={()=>setSc("landing")} style={{background:"none",border:"none",fontSize:18,cursor:"pointer"}}>←</button><div><div style={{fontSize:16,fontWeight:800}}>ข้อมูลของคุณ</div><div style={{fontSize:11,color:"#94A3B8"}}>สำหรับ Vedic + พฤติกรรม</div></div></div>
  <Card>
  <div style={{marginBottom:12}}><label style={lbl}>ชื่อเล่น *</label><input ref={nickRef} defaultValue={nick} onBlur={e=>setNick(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")e.target.blur()}} placeholder="เช่น มิว" style={inp}/></div>
  <div style={{marginBottom:12}}><label style={lbl}>อีเมล *</label><input ref={emailRef} defaultValue={email} onBlur={e=>setEmail(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")e.target.blur()}} placeholder="your@email.com" type="email" style={inp}/></div>
  <div style={{marginBottom:12}}><label style={lbl}>วันเกิด *</label><div style={{display:"flex",gap:6,marginBottom:6}}><select value={bp[2]||""} onChange={e=>setBday(`${bp[0]||"2000"}-${bp[1]||"01"}-${e.target.value}`)} style={{...inp,flex:1}}><option value="">วัน</option>{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={String(d).padStart(2,"0")}>{d}</option>)}</select><select value={bp[1]||""} onChange={e=>setBday(`${bp[0]||"2000"}-${e.target.value}-${bp[2]||"01"}`)} style={{...inp,flex:1.2}}><option value="">เดือน</option>{["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."].map((m,i)=><option key={i} value={String(i+1).padStart(2,"0")}>{m}</option>)}</select><select value={bp[0]||""} onChange={e=>setBday(`${e.target.value}-${bp[1]||"01"}-${bp[2]||"01"}`)} style={{...inp,flex:1}}><option value="">ปี</option>{Array.from({length:80},(_,i)=>2026-i).map(y=><option key={y} value={String(y)}>{y}({y+543})</option>)}</select></div><button onClick={()=>{const t=new Date();setBday(`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`)}} style={{fontSize:11,color:"#6366F1",background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>📅 ใช้วันนี้</button></div>
  <div style={{marginBottom:12}}><label style={lbl}>เวลาเกิด *</label><div style={{display:"flex",gap:6,marginBottom:8}}><button onClick={()=>{setKnowT(true);setTSlot("")}} style={{flex:1,padding:8,borderRadius:8,border:`2px solid ${knowT===true?"#6366F1":"#E2E8F0"}`,background:knowT===true?"#EEF2FF":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:knowT===true?"#4338CA":"#64748B"}}>รู้เวลาเกิด</button><button onClick={()=>{setKnowT(false);setBtime("")}} style={{flex:1,padding:8,borderRadius:8,border:`2px solid ${knowT===false?"#F59E0B":"#E2E8F0"}`,background:knowT===false?"#FFFBEB":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:knowT===false?"#92400E":"#64748B"}}>ไม่รู้เวลาเกิด</button></div>{knowT===true&&<div style={{display:"flex",gap:6}}><select value={btime.split(":")[0]||""} onChange={e=>setBtime(`${e.target.value}:${btime.split(":")[1]||"00"}`)} style={{...inp,flex:1}}><option value="">ชั่วโมง</option>{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={String(h).padStart(2,"0")}>{String(h).padStart(2,"0")}น.</option>)}</select><select value={btime.split(":")[1]||""} onChange={e=>setBtime(`${btime.split(":")[0]||"00"}:${e.target.value}`)} style={{...inp,flex:1}}><option value="">นาที</option>{[0,5,10,15,20,25,30,35,40,45,50,55].map(m=><option key={m} value={String(m).padStart(2,"0")}>{String(m).padStart(2,"0")}นาที</option>)}</select></div>}{knowT===false&&<div style={{display:"flex",flexDirection:"column",gap:4}}>{TS.map(ts=><button key={ts.id} onClick={()=>setTSlot(ts.id)} style={{padding:"10px 12px",borderRadius:8,border:`2px solid ${tSlot===ts.id?"#F59E0B":"#E2E8F0"}`,background:tSlot===ts.id?"#FFFBEB":"#fff",textAlign:"left",cursor:"pointer"}}><div style={{fontSize:12,fontWeight:tSlot===ts.id?700:500,color:tSlot===ts.id?"#92400E":"#374151"}}>{ts.l}</div><div style={{fontSize:10,color:"#94A3B8"}}>{ts.d}</div></button>)}</div>}</div>
  <div style={{marginBottom:14}}><label style={lbl}>จังหวัด</label><select value={prov} onChange={e=>setProv(e.target.value)} style={{...inp,appearance:"auto"}}><option value="">เลือกจังหวัด</option>{PV.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
  {scores?<><Btn ok={ok} onClick={ok?()=>{ST.set("profile",{nick,email,bday,btime,tSlot,prov});saveProfile();setSc("results")}:undefined}>💾 บันทึกและกลับดูผลลัพธ์</Btn><button onClick={()=>setSc("results")} style={{width:"100%",marginTop:8,padding:10,borderRadius:8,border:"2px solid #E2E8F0",background:"#fff",color:"#64748B",fontSize:12,fontWeight:600,cursor:"pointer"}}>← กลับดูผลลัพธ์</button></>:<Btn ok={ok} onClick={ok?goQuiz:undefined}>เริ่มแบบประเมิน 36 ข้อ →</Btn>}</Card></div>};

  // ─── QUIZ ───
  const Quiz=()=>{const q=ALL_Q[qI];const key=`${q.dim}-${q.qi}`;const pct=((qI+1)/36*100);const allD=Object.keys(ans).length>=36;
  return<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:700,color:"#64748B"}}>{qI+1}/36</span><span style={{fontSize:10,color:"#94A3B8"}}>{q.dim}</span></div><div style={{height:4,background:"#E2E8F0",borderRadius:2,overflow:"hidden",marginBottom:12}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#4338CA,#A78BFA)",borderRadius:2,transition:"width .3s"}}/></div><Card><div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 10px",borderRadius:10,background:`${q.c}15`,marginBottom:8,fontSize:10,fontWeight:600,color:q.c}}>{q.icon} {q.dim} · {q.pl}</div><p style={{fontSize:14,fontWeight:500,lineHeight:1.7,marginBottom:12,color:"#1E293B"}}>{q.q}</p><div style={{display:"flex",flexDirection:"column",gap:4}}>{SCALE.map((l,i)=><button key={i} onClick={()=>answer(i)} style={{padding:"9px 12px",fontSize:12,fontWeight:ans[key]===i?700:500,border:`2px solid ${ans[key]===i?"#4338CA":"#E2E8F0"}`,borderRadius:8,cursor:"pointer",textAlign:"left",background:ans[key]===i?"#EEF2FF":"#fff",color:ans[key]===i?"#4338CA":"#374151",display:"flex",alignItems:"center",gap:8}}><span style={{width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,background:ans[key]===i?"#4338CA":"#F1F5F9",color:ans[key]===i?"#fff":"#94A3B8",flexShrink:0}}>{i}</span>{l}</button>)}</div></Card><div style={{display:"flex",gap:8,marginTop:8}}><button onClick={()=>setQI(Math.max(0,qI-1))} disabled={qI===0} style={{flex:1,padding:10,border:"2px solid #E2E8F0",borderRadius:8,background:"#fff",fontSize:12,fontWeight:600,cursor:qI>0?"pointer":"not-allowed",color:qI>0?"#374151":"#CBD5E1"}}>←</button>{allD?<Btn onClick={finish} style={{flex:2}}>ดูผลลัพธ์ ✦</Btn>:<button onClick={()=>{if(ans[key]!==undefined&&qI<35)setQI(qI+1)}} style={{flex:2,padding:10,borderRadius:8,border:"none",background:ans[key]!==undefined?"linear-gradient(135deg,#4338CA,#6D28D9)":"#E2E8F0",color:ans[key]!==undefined?"#fff":"#94A3B8",fontSize:12,fontWeight:600,cursor:ans[key]!==undefined?"pointer":"not-allowed"}}>ถัดไป →</button>}</div></div>};

  // ─── TIMELINE MONTH COMPONENT ───
  const TimelineMonth=({m,i,typeColors,typeBg,typeBorder,defaultOpen})=>{
    const[open,setOpen]=useState(defaultOpen||false);
    const borderC=typeBorder[m.type]||'#C0B8D0';
    const headlineC={golden:'#C88A10',danger:'#C04040',good:'#2E8A58',side:'#3A7AC0',neutral:'#7060A0'}[m.type]||'#7060A0';
    return<div style={{marginBottom:6}}>
      <div onClick={()=>setOpen(!open)} style={{background:"#fff",borderRadius:10,padding:"10px 12px",cursor:"pointer",border:`1px solid ${open?borderC:"#F1F5F9"}`,borderLeft:`3px solid ${borderC}`,display:"flex",alignItems:"center",gap:10,transition:"all 0.2s",boxShadow:open?"0 2px 8px rgba(0,0,0,0.06)":"none"}}>
        <span style={{fontSize:22,minWidth:28,textAlign:"center"}}>{m.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
            <span style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>{m.monthFull}</span>
            <span style={{fontSize:12,letterSpacing:1}}>{starStr(m.stars)}</span>
          </div>
          <div style={{fontSize:11,fontWeight:600,color:headlineC,marginBottom:2}}>{m.headline}</div>
          <div style={{fontSize:10,color:"#8A8090"}}>🔭 {m.planetEmoji} {m.planet} · {m.planetEffect}</div>
          <div style={{display:"flex",gap:3,marginTop:4,flexWrap:"wrap"}}>
            {m.tags.map(([label,tagType],ti)=>{
              const tagBg={golden:'#FFF3D4',danger:'#FFE8E8',good:'#E4F5EC',side:'#E4EEFF',neutral:'#F0ECF8'}[tagType]||'#F0ECF8';
              const tagFg={golden:'#C88A10',danger:'#C04040',good:'#2E8A58',side:'#3A7AC0',neutral:'#7060A0'}[tagType]||'#7060A0';
              return<span key={ti} style={{fontSize:9,padding:"1px 6px",borderRadius:10,fontWeight:600,background:tagBg,color:tagFg}}>{label}</span>})}
          </div>
        </div>
        <span style={{color:"#C0B8D0",fontSize:14,transition:"transform 0.2s",transform:open?"rotate(90deg)":"none"}}>›</span>
      </div>
      {open&&<div style={{background:"#fff",borderRadius:"0 0 12px 12px",border:`1px solid ${borderC}`,borderTop:"none",overflow:"hidden",animation:"slideDown 0.3s ease"}}>
        {/* Header */}
        <div style={{padding:"12px 14px",borderBottom:"1px solid #F0ECF8",display:"flex",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#1E293B"}}>{m.icon} {m.monthFull}</div>
            <div style={{fontSize:12,fontWeight:600,color:headlineC,margin:"2px 0"}}>{m.headline}</div>
            <div style={{fontSize:10,color:"#8A8090"}}>🔭 {m.planetEmoji} {m.planet} · {m.planetEffect}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:16}}>{starStr(m.stars)}</div>
            <div style={{fontSize:9,color:"#8A8090",fontWeight:600}}>{starLabel(m.stars)}</div>
          </div>
        </div>

        {/* Golden Days */}
        <div style={{padding:"10px 14px",borderBottom:"1px solid #F0ECF8"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#C88A10",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>✦ Golden Days — นัดได้เลย</div>
          {m.goldenDays.map((d,di)=><div key={di} style={{background:"#FFFBF0",borderRadius:8,padding:"7px 10px",marginBottom:4,display:"flex",alignItems:"flex-start",gap:8}}>
            <span style={{fontSize:14,fontWeight:700,color:"#C88A10",minWidth:24}}>{d.day}</span>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#1E293B"}}>{d.action}</div>
              <div style={{fontSize:10,color:"#8A8090"}}>🔭 {d.reason}</div>
              <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontWeight:600,padding:"1px 8px",borderRadius:10,marginTop:3,background:"#E4F5EC",color:"#2E8A58"}}>✅ ทำได้เลย</span>
            </div>
          </div>)}
        </div>

        {/* Black Days */}
        <div style={{padding:"10px 14px",borderBottom:"1px solid #F0ECF8"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#C04040",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>⚑ Black Days — ระวัง</div>
          {m.blackDays.map((d,di)=><div key={di} style={{background:"#FFF5F5",borderRadius:8,padding:"7px 10px",marginBottom:4,display:"flex",alignItems:"flex-start",gap:8}}>
            <span style={{fontSize:14,fontWeight:700,color:"#C04040",minWidth:24}}>{d.day}</span>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#1E293B"}}>{d.action}</div>
              <div style={{fontSize:10,color:"#8A8090"}}>🔭 {d.reason}</div>
              <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontWeight:600,padding:"1px 8px",borderRadius:10,marginTop:3,background:"#FFE8E8",color:"#C04040"}}>⚠️ ระวัง</span>
            </div>
          </div>)}
        </div>

        {/* Domain breakdown: งาน เงิน ความรัก สุขภาพ */}
        {m.domainScores&&<div style={{padding:"10px 14px",borderBottom:"1px solid #F0ECF8"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#1E293B",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>📊 เรื่องเด่นประจำเดือน — Vedic Transit</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {[{key:'work',icon:'💼',label:'การงาน',text:m.workFocus,score:m.domainScores.work,bg:'#EEF2FF',fg:'#4338CA',brd:'#C7D2FE'},{key:'money',icon:'💰',label:'การเงิน',text:m.moneyFocus,score:m.domainScores.money,bg:'#FFFBEB',fg:'#92400E',brd:'#FDE68A'},{key:'love',icon:'❤️',label:'ความรัก',text:m.loveFocus,score:m.domainScores.love,bg:'#FFF1F2',fg:'#BE185D',brd:'#FECDD3'},{key:'health',icon:'🏃',label:'สุขภาพ',text:m.healthFocus,score:m.domainScores.health,bg:'#ECFDF5',fg:'#065F46',brd:'#A7F3D0'}].map(({key,icon,label,text,score,bg,fg,brd})=>{
              const isHighlight=key===m.dominantTopic;
              const scoreColor=score>=75?'#059669':score>=55?fg:'#DC2626';
              return<div key={key} style={{background:bg,borderRadius:10,padding:"8px 10px",border:`1px solid ${brd}`,boxShadow:isHighlight?"0 2px 8px rgba(0,0,0,0.08)":"none",position:"relative"}}>
                {isHighlight&&<span style={{position:"absolute",top:6,right:6,fontSize:8,fontWeight:700,color:"#fff",background:"#6366F1",padding:"1px 5px",borderRadius:6}}>เด่น</span>}
                <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                  <span style={{fontSize:14}}>{icon}</span>
                  <span style={{fontSize:10,fontWeight:700,color:fg}}>{label}</span>
                  <span style={{fontSize:9,fontWeight:700,color:scoreColor,marginLeft:"auto"}}>{score}%</span>
                </div>
                <div style={{height:3,borderRadius:2,background:"rgba(0,0,0,0.08)",marginBottom:6}}>
                  <div style={{height:3,borderRadius:2,background:scoreColor,width:`${score}%`}}/>
                </div>
                <div style={{fontSize:10,color:"#374151",lineHeight:1.5}}>{text}</div>
              </div>;
            })}
          </div>
        </div>}

        {/* Decision advice */}
        {m.decisionAdvice&&<div style={{padding:"10px 14px",borderBottom:"1px solid #F0ECF8"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#1E293B",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>🎯 คำแนะนำการตัดสินใจเดือนนี้</div>
          <div style={{background:m.type==='golden'?"linear-gradient(135deg,#FFFBEB,#FEF3C7)":m.type==='danger'?"linear-gradient(135deg,#FFF1F2,#FFE4E6)":m.type==='good'?"linear-gradient(135deg,#ECFDF5,#D1FAE5)":"#F8F7FC",borderRadius:10,padding:"10px 12px",border:`1px solid ${m.type==='golden'?"#FDE68A":m.type==='danger'?"#FECDD3":m.type==='good'?"#A7F3D0":"#E2E8F0"}`}}>
            <div style={{fontSize:11,lineHeight:1.8,color:"#1E293B",fontWeight:500}}>{m.decisionAdvice}</div>
          </div>
        </div>}

        {/* Psychology × Astrology */}
        <div style={{padding:"10px 14px",borderBottom:"1px solid #F0ECF8"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#7B6FA0",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>🧠 วิเคราะห์ดาว × จิตวิทยา</div>
          <div style={{background:"#F8F7FC",borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:11,lineHeight:1.8,color:"#3A3050",marginBottom:8}}>{m.psychText}</div>
            <div style={{background:"#fff",borderRadius:8,padding:"8px 10px",borderLeft:"3px solid #7B6FA0"}}>
              <div style={{fontSize:11,color:"#5A4A70",lineHeight:1.6}}>💡 {m.psychTip}</div>
            </div>
          </div>
        </div>

        {/* Planets */}
        <div style={{padding:"10px 14px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5A4A70",marginBottom:6}}>🔭 ดาวที่มีอิทธิพล</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {m.planets.map((p,pi)=><span key={pi} style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontWeight:500,padding:"3px 8px",borderRadius:10,background:"#F0ECF8",color:"#5A4A70"}}>{p}</span>)}
          </div>
        </div>
      </div>}
    </div>};

  // ─── ASK & DECIDE AI ───
  const AskDecide=()=>{
    const cats=Object.entries(DEC_CATS);
    const catData=DEC_CATS[decCat];
    const usedToday=decideLimit();
    const canAsk=plan!=="free"||(usedToday<1);
    const freeCard=decRes?decRes.cards?.[0]:null;
    const showAll=has("decide");
    const vc={green:{bg:"#ECFDF5",border:"#10B981",color:"#059669",label:"✅ แนะนำ: ทำเลย"},red:{bg:"#FFF1F2",border:"#EF4444",color:"#DC2626",label:"❌ แนะนำ: หลีกเลี่ยง"},yellow:{bg:"#FFFBEB",border:"#F59E0B",color:"#92400E",label:"⏳ แนะนำ: รอก่อน"}}[decRes?.verdictColor||"yellow"]||{};
    return<Card style={{background:"linear-gradient(135deg,#1E1B4B,#312E81)",border:"2px solid #6366F1",padding:"18px 16px",marginBottom:12}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔮</div>
        <div>
          <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>Ask & Decide AI</div>
          <div style={{fontSize:10,color:"#A5B4FC"}}>วิเคราะห์ 4 ศาสตร์ → ตัดสินใจได้ทันที</div>
        </div>
        {plan==="free"&&<div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:9,color:"#A5B4FC"}}>{usedToday}/1 คำถาม/วัน</div><div style={{width:40,height:3,borderRadius:2,background:"rgba(255,255,255,0.15)",marginTop:2}}><div style={{width:`${Math.min(100,usedToday*100)}%`,height:"100%",borderRadius:2,background:"#F59E0B"}}/></div></div>}
      </div>

      {/* Category tabs */}
      <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
        {cats.map(([k,v])=><button key={k} onClick={()=>{setDecCat(k);setDecQ("");setDecCustom(false)}} style={{padding:"6px 12px",borderRadius:20,border:"none",background:decCat===k?"#6366F1":"rgba(255,255,255,0.1)",color:decCat===k?"#fff":"#A5B4FC",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{v.icon} {v.label}</button>)}
      </div>

      {/* Question selector */}
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
          {catData.q.map((q,i)=><button key={i} onClick={()=>{setDecQ(q);setDecCustom(false)}} style={{padding:"6px 12px",borderRadius:20,fontSize:11,fontWeight:600,border:`1px solid ${decQ===q?"#6366F1":"rgba(255,255,255,0.15)"}`,background:decQ===q?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.07)",color:decQ===q?"#C7D2FE":"#CBD5E1",cursor:"pointer"}}>{q}</button>)}
          <button onClick={()=>{setDecCustom(true);setDecQ("")}} style={{padding:"6px 12px",borderRadius:20,fontSize:11,fontWeight:600,border:`1px solid ${decCustom?"#6366F1":"rgba(255,255,255,0.15)"}`,background:decCustom?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.07)",color:decCustom?"#C7D2FE":"#CBD5E1",cursor:"pointer"}}>✏️ พิมพ์เอง</button>
        </div>
        {decCustom&&<input value={decQ} onChange={e=>setDecQ(e.target.value)} placeholder="พิมพ์คำถามของคุณ..." maxLength={80} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(99,102,241,0.4)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}}/>}
      </div>

      {/* Submit */}
      <button onClick={askDecide} disabled={!decQ.trim()||decL||!canAsk} style={{width:"100%",padding:"11px",borderRadius:10,border:"none",background:decQ.trim()&&canAsk?"linear-gradient(135deg,#4F46E5,#7C3AED)":"rgba(255,255,255,0.1)",color:decQ.trim()&&canAsk?"#fff":"rgba(255,255,255,0.3)",fontSize:13,fontWeight:700,cursor:decQ.trim()&&canAsk?"pointer":"not-allowed",marginBottom:decRes||decL?12:0,boxShadow:decQ.trim()&&canAsk?"0 4px 14px rgba(79,70,229,0.4)":"none",transition:"all .2s"}}>
        {decL?"🔮 กำลังวิเคราะห์...":!canAsk?"⏰ ใช้ครบโควต้าวันนี้แล้ว (Free = 1/วัน)":"🔮 วิเคราะห์เลย"}
      </button>

      {/* Loading */}
      {decL&&<div style={{textAlign:"center",padding:"20px 0"}}><div style={{width:24,height:24,margin:"0 auto 8px",borderRadius:"50%",border:"3px solid rgba(99,102,241,0.2)",borderTopColor:"#6366F1",animation:"hs .7s linear infinite"}}/><div style={{fontSize:12,color:"#A5B4FC"}}>AI กำลังเปรียบเทียบ 4 ศาสตร์...</div></div>}

      {/* Results */}
      {decRes&&!decL&&<>
        {/* Verdict banner */}
        <div style={{borderRadius:12,padding:"12px 14px",marginBottom:12,background:vc.bg,border:`2px solid ${vc.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:vc.color}}>{vc.label}</div>
            <div style={{fontSize:10,color:"#64748B",marginTop:2}}>ความมั่นใจ: {decRes.confidence}% · วิเคราะห์จาก 4 ศาสตร์</div>
          </div>
          <div style={{textAlign:"right"}}><div style={{width:44,height:44,borderRadius:"50%",border:`3px solid ${vc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:vc.color,background:"rgba(255,255,255,0.7)"}}>{decRes.confidence}%</div></div>
        </div>

        {/* Cards */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,color:"#A5B4FC",marginBottom:8,letterSpacing:1}}>📚 วิเคราะห์รายศาสตร์</div>
          {showAll?decRes.cards?.map((c,i)=><DecideCard key={i} c={c}/>):<>
            {freeCard&&<DecideCard c={freeCard}/>}
            {decRes.cards?.slice(1).map((_,i)=><div key={i} style={{borderRadius:10,border:"1px solid #E2E8F0",marginBottom:6,overflow:"hidden",position:"relative",minHeight:72}}>
              <div style={{filter:"blur(4px)",opacity:.4,padding:"10px 12px",pointerEvents:"none"}}>
                <div style={{fontSize:11,fontWeight:700,marginBottom:2}}>⭐ {["Western","Chinese","Thai"][i]}</div>
                <div style={{fontSize:12,color:"#374151"}}>วิเคราะห์เชิงลึก...</div>
              </div>
              <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.85)",backdropFilter:"blur(2px)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{fontSize:18}}>🔒</span>
                <button onClick={()=>tryUpgrade("deep")} style={{padding:"5px 14px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>ดูครบ ฿49</button>
              </div>
            </div>)}
          </>}
        </div>

        {/* AI Summary */}
        {showAll?<div style={{background:"#F8FAFC",borderRadius:10,padding:"12px 14px",marginBottom:10,border:"1px solid #E2E8F0"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#4338CA",marginBottom:6}}>🤖 AI Summary</div>
          <div style={{fontSize:12,color:"#374151",lineHeight:1.8}}>{decRes.ai_summary}</div>
          <div style={{marginTop:10}}><div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:6}}>⚡ Action Plan</div>
          {decRes.action_plan?.map((s,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}><div style={{width:18,height:18,borderRadius:"50%",background:"#4338CA",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>{s}</div></div>)}</div>
        </div>:<div style={{borderRadius:10,border:"1px solid #E2E8F0",overflow:"hidden",position:"relative",minHeight:80}}>
          <div style={{filter:"blur(5px)",opacity:.3,padding:"12px 14px",pointerEvents:"none"}}><div style={{fontSize:11,fontWeight:700,color:"#4338CA",marginBottom:4}}>🤖 AI Summary</div><div style={{fontSize:12,color:"#374151",lineHeight:1.8}}>สรุปภาพรวม Action Plan ...</div></div>
          <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.88)",backdropFilter:"blur(3px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
            <div style={{fontSize:20,marginBottom:6}}>🔒</div>
            <div style={{fontSize:12,fontWeight:700,color:"#4338CA",marginBottom:4,textAlign:"center"}}>AI Summary + Action Plan</div>
            <div style={{fontSize:10,color:"#64748B",marginBottom:10}}>รวมถึงคำแนะนำ 3 ขั้นตอน</div>
            <button onClick={()=>tryUpgrade("deep")} style={{padding:"8px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(79,70,229,.25)"}}>ปลดล็อก Deep ฿49 →</button>
          </div>
        </div>}

        {/* Ask again */}
        <button onClick={()=>{setDecRes(null);setDecQ("");setDecCustom(false)}} style={{width:"100%",padding:8,borderRadius:8,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"#A5B4FC",fontSize:11,cursor:"pointer",marginTop:4}}>🔄 ถามคำถามใหม่</button>
      </>}
    </Card>
  };

  const DecideCard=({c})=><div style={{borderRadius:10,border:`1px solid ${c.color}33`,background:"#fff",padding:"10px 12px",marginBottom:6}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{c.icon}</span><div><div style={{fontSize:11,fontWeight:700,color:"#475569"}}>{c.system}</div><div style={{fontSize:13,fontWeight:800,color:c.color}}>{c.answer}</div></div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#94A3B8",marginBottom:2}}>คะแนน</div><div style={{fontSize:15,fontWeight:800,color:c.color}}>{c.score}/10</div></div>
    </div>
    <div style={{fontSize:11,color:"#374151",lineHeight:1.6,marginBottom:6}}>{c.reason}</div>
    <div style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:700,color:"#fff",background:c.color,padding:"3px 10px",borderRadius:20}}>▶ {c.action}</div>
  </div>;

  // ─── RESULTS ───
  const Sec=({fKey,title,icon,children})=>{const ok=has(fKey);return<Card style={{position:"relative"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:ok?8:4}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:15}}>{icon}</span><span style={{fontSize:13,fontWeight:700}}>{title}</span></div>{!ok&&<span style={{fontSize:10,fontWeight:700,color:"#6366F1",background:"#EEF2FF",padding:"2px 8px",borderRadius:8}}>🔒</span>}</div>{ok?children:<><p style={{fontSize:11,color:"#94A3B8",marginBottom:6}}>ปลดล็อกเพื่อดู</p><div style={{display:"flex",gap:6}}>{plan==="free"&&<button onClick={()=>tryUpgrade("deep")} style={{flex:1,padding:7,borderRadius:8,border:"2px solid #F59E0B",background:"#FFFBEB",color:"#92400E",fontSize:11,fontWeight:700,cursor:"pointer"}}>Deep ฿49</button>}{plan!=="all"&&<button onClick={()=>tryUpgrade("all")} style={{flex:1,padding:7,borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>All ฿99</button>}</div></>}</Card>};

  const Results=()=>{if(!scores)return null;const so=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const c5={"Cognitive Processing":scores["Cognitive Processing"],"Emotional Regulation":scores["Emotional Regulation"],"Identity Stability":scores["Identity Stability"],"Shadow Pattern":scores["Shadow Pattern"],"Growth Orientation":scores["Growth Orientation"]};
  return<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,#4338CA,#6D28D9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>✦</div><span style={{fontSize:14,fontWeight:800}}>{nick}</span></div><span style={{fontSize:10,color:"#94A3B8"}}>{PLANS[plan].name}{logged?` · ${user?.email?.split("@")[0]}`:""}</span></div><div style={{display:"flex",alignItems:"center",gap:4}}>{plan!=="free"&&<span style={{fontSize:10,fontWeight:700,color:"#fff",background:PLANS[plan].c,padding:"3px 10px",borderRadius:8}}>{PLANS[plan].name}</span>}{logged?<button onClick={doLogout} style={{fontSize:12,color:"#64748B",background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:8,padding:"6px 14px",cursor:"pointer",minWidth:60,minHeight:36}}>ออกจากระบบ</button>:<button onClick={()=>{setLoginModal(true);setAuthErr("");setAuthMode("login")}} style={{fontSize:12,color:"#4338CA",background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>เข้าสู่ระบบ</button>}</div></div>

  {plan==="free"&&<Card style={{background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",border:"2px solid #6366F1"}}><div style={{fontSize:12,fontWeight:700,color:"#4338CA",marginBottom:6}}>🔓 ปลดล็อกความเข้าใจตัวเอง</div><div style={{display:"flex",gap:6}}><button onClick={()=>tryUpgrade("deep")} style={{flex:1,padding:7,borderRadius:8,border:"2px solid #F59E0B",background:"#fff",color:"#92400E",fontSize:11,fontWeight:700,cursor:"pointer"}}>Deep ฿49</button><button onClick={()=>tryUpgrade("all")} style={{flex:1,padding:7,borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>All ฿99</button></div></Card>}

  <AskDecide/>

  <Sec fKey="identity" title="Identity Snapshot" icon="✦">{ai.identity&&ai.identity.powerTitle?<IdentitySnapshotCard data={ai.identity} scores={scores}/>:aiL.identity?<Spin t="กำลังถอดรหัสตัวตน..."/>:<Spin t="เชื่อม AI..."/>}</Sec>
  <Sec fKey="core5" title="5 Core Scores" icon="📊">{Object.entries(c5).map(([d,sc])=>{const meta=C5_META[d]||{short:d,pl:"",high:{label:"",desc:""},mid:{label:"",desc:""},low:{label:"",desc:""}};const lv=sc>=7?meta.high:sc>=5?meta.mid:meta.low;const isLow=sc<5;const isMid=sc>=5&&sc<7;const lblColor=isLow?"#DC2626":isMid?"#64748B":"#059669";return<div key={d} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><span style={{fontSize:11,fontWeight:600}}>{DM[d]?.icon} {meta.short} <span style={{fontSize:9,color:"#94A3B8"}}>({meta.pl})</span></span><span style={{fontSize:13,fontWeight:800,color:DM[d]?.c}}>{sc.toFixed(1)}</span></div><div style={{height:5,background:"#F1F5F9",borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:`${sc*10}%`,background:DM[d]?.c,borderRadius:3}}/></div><div style={{fontSize:10,lineHeight:1.6,color:lblColor}}><span style={{fontWeight:700}}>{lv.label}:</span> {lv.desc}</div></div>})}<div style={{marginTop:8,padding:8,background:"#F8FAFC",borderRadius:8}}>{aiL.core?<Spin/>:ai.core?<Typer text={ai.core}/>:<Spin t="รอ AI..."/>}</div></Sec>

  {/* Locked preview: 12D */}
  {!has("12d")?<Locked planNeeded="deep" title="12D Spider Web + จุดแข็ง/จุดพัฒนา" onUpgrade={tryUpgrade}><div style={{textAlign:"center",padding:16}}><Spider scores={scores}/></div><div style={{padding:"8px 0"}}><div style={{fontSize:12,marginBottom:4}}>💪 จุดแข็ง: {so.slice(0,3).map(([k,v])=>`${DM[k]?.icon}${k}(${v.toFixed(1)})`).join(" · ")}</div><div style={{fontSize:12}}>⚠️ จุดพัฒนา: {so.slice(-3).map(([k,v])=>`${DM[k]?.icon}${k}(${v.toFixed(1)})`).join(" · ")}</div></div></Locked>:<Sec fKey="12d" title="12D Spider Web" icon="🕸️"><div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Spider scores={scores}/></div><div style={{marginBottom:6}}><div style={{fontSize:11,fontWeight:700,color:"#10B981",marginBottom:3}}>💪 จุดแข็ง</div>{so.slice(0,4).map(([d,s])=><div key={d} style={{padding:"4px 8px",borderRadius:6,background:"#ECFDF5",border:"1px solid #A7F3D0",marginBottom:2,display:"flex",justifyContent:"space-between",fontSize:11}}><span>{DM[d]?.icon} {d}</span><span style={{fontWeight:700,color:"#059669"}}>{s.toFixed(1)}</span></div>)}</div><div><div style={{fontSize:11,fontWeight:700,color:"#EF4444",marginBottom:3}}>⚠️ จุดพัฒนา</div>{so.slice(-4).map(([d,s])=><div key={d} style={{padding:"4px 8px",borderRadius:6,background:"#FFF1F2",border:"1px solid #FECDD3",marginBottom:2,display:"flex",justifyContent:"space-between",fontSize:11}}><span>{DM[d]?.icon} {d}</span><span style={{fontWeight:700,color:"#EF4444"}}>{s.toFixed(1)}</span></div>)}</div>{aiL["12d"]?<Spin/>:ai["12d"]?<div style={{marginTop:8,padding:8,background:"#F8FAFC",borderRadius:8}}><Typer text={ai["12d"]}/></div>:null}</Sec>}

  {/* Locked preview: Shadow */}
  {!has("shadow")?<Locked planNeeded="deep" title="Shadow Analysis เชิงลึก" onUpgrade={tryUpgrade}><div style={{padding:12,borderRadius:10,background:"#1E293B",color:"#fff",marginBottom:8}}><div style={{fontSize:13,fontWeight:700,marginBottom:4}}>🌑 Shadow Pattern: {scores["Shadow Pattern"]?.toFixed(1)}/10</div><div style={{fontSize:11,color:"#94A3B8"}}>Stress Response: {scores["Stress Response"]?.toFixed(1)} · Boundary: {scores["Boundary System"]?.toFixed(1)}</div></div><div style={{fontSize:12,lineHeight:1.8,color:"#374151"}}>⚡ Trigger หลัก: ราหูชี้ว่าคุณมักถูกกระตุ้นเมื่อ...<br/>🔄 Pattern ซ้ำ: เมื่อเจอ trigger คุณมักเลือก...<br/>💡 วิธีแก้: ฝึกจับสัญญาณร่างกาย...</div></Locked>:<Sec fKey="shadow" title="Shadow Analysis" icon="🌑"><div style={{background:"#0F172A",borderRadius:10,padding:"12px 14px",marginBottom:10}}><div style={{fontSize:12,fontWeight:800,color:"#E2E8F0",marginBottom:6}}>🌑 Shadow Pattern คืออะไร?</div><div style={{fontSize:12,color:"#94A3B8",lineHeight:1.8}}>เงามืดที่ขัดขวางความสำเร็จ — คือพฤติกรรมที่คุณมักจะเผลอทำเวลาเสียศูนย์ (เช่น การผลัดวันประกันพรุ่ง การใช้อารมณ์ หรือการหนีความจริง) แม้คุณจะมีศักยภาพดาวกำเนิดที่สูง แต่ถ้า "เงามืด" นี้ทำงานหนักเกินไป มันจะดึงให้คะแนนการใช้งานจริงของคุณต่ำลง</div><div style={{marginTop:8,padding:"8px 10px",background:"rgba(99,102,241,0.15)",borderRadius:8,borderLeft:"3px solid #6366F1"}}><div style={{fontSize:11,color:"#A5B4FC",lineHeight:1.7}}>💡 การรู้เท่าทันเงาของตัวเอง คือกุญแจสำคัญที่จะทำให้คุณกลับมาควบคุมชีวิตได้อีกครั้ง</div></div></div>{aiL.shadow?<Spin/>:ai.shadow?<Typer text={ai.shadow}/>:<Spin t="วิเคราะห์เงามืด..."/>}</Sec>}

  {/* Love & Compatibility */}
  {(()=>{
    const eS=scores["Emotional Regulation"]||5;const shS=scores["Shadow Pattern"]||5;const bS=scores["Boundary System"]||5;
    const w1=Math.max(1,(10-eS)*3.5),w2=Math.max(1,(10-shS)*2.5),w3=Math.max(1,(10-bS)*2.0),w4=7,wT=w1+w2+w3+w4;
    const rcD=[{w:w1,c:"#F59E0B",l:"Attachment Style",s:"รูปแบบความผูกพัน"},{w:w2,c:"#6366F1",l:"Shadow / ปมวัยเด็ก",s:"Childhood Pattern"},{w:w3,c:"#22D3EE",l:"ดาวบาปเคราะห์",s:"Malefic Aspects"},{w:w4,c:"#8B5CF6",l:"ช่วงดวงตก",s:"Bad Transits"}];
    const dP=(cx,cy,ro,ri,sa,ea)=>{const r=d=>(d-90)*Math.PI/180;const c1=Math.cos(r(sa)),s1=Math.sin(r(sa)),c2=Math.cos(r(ea)),s2=Math.sin(r(ea));const lg=ea-sa>180?1:0;return `M${(cx+ro*c1).toFixed(1)},${(cy+ro*s1).toFixed(1)} A${ro},${ro} 0 ${lg},1 ${(cx+ro*c2).toFixed(1)},${(cy+ro*s2).toFixed(1)} L${(cx+ri*c2).toFixed(1)},${(cy+ri*s2).toFixed(1)} A${ri},${ri} 0 ${lg},0 ${(cx+ri*c1).toFixed(1)},${(cy+ri*s1).toFixed(1)}Z`;};
    let ang=0;const dSegs=rcD.map(s=>{const pct=s.w/wT;const sa=ang;const ea=ang+pct*360-2;ang+=pct*360;return{...s,pct,sa,ea};});
    const sub=[Math.min(100,eS*8+10),Math.min(100,eS*6+15),Math.min(100,bS*7+10),Math.min(100,(10-shS)*9+10),Math.min(100,(10-bS)*9+10)];
    const idl=[Math.min(100,(10-eS)*6+38),85,80,Math.max(20,shS*4+8),78];
    const rlbls=["ความมั่นคง","การสื่อสาร","ความเข้าใจ","ความตื่นเต้น","อิสระ"];
    const rPt=(i,v,r)=>{const a=(i*72-90)*Math.PI/180;return{x:(100+r*(v/100)*Math.cos(a)).toFixed(1),y:(100+r*(v/100)*Math.sin(a)).toFixed(1)};};
    const rAx=(i)=>{const a=(i*72-90)*Math.PI/180;return{x:(100+58*Math.cos(a)).toFixed(1),y:(100+58*Math.sin(a)).toFixed(1)};};
    const rLb=(i)=>{const a=(i*72-90)*Math.PI/180;return{x:(100+76*Math.cos(a)).toFixed(1),y:(100+76*Math.sin(a)).toFixed(1)};};
    const nowY=new Date().getFullYear();const bdY=parseInt((bday||"2000").split("-")[0])||2000;const age=nowY-bdY;
    const tlPts=[{lbl:`อายุ ${Math.max(18,age-8)}`,e:45,t:"past"},{lbl:`อายุ ${Math.max(20,age-5)}\n(คู่กรรม 1)`,e:80,t:"karmic"},{lbl:`อายุ ${Math.max(22,age-2)}\n(คู่กรรม 2)`,e:25,t:"karmic"},{lbl:`ปัจจุบัน\n(อายุ ${age})`,e:52,t:"now"},{lbl:`ปี ${nowY+1}`,e:80,t:"future"},{lbl:`ปี ${nowY+2}\n(คู่แท้)`,e:97,t:"soulmate"}];
    const TW=290,TH=70;const xs=tlPts.map((_,i)=>12+i*((TW-24)/(tlPts.length-1)));const ys=tlPts.map(p=>8+TH*(1-p.e/100)*0.9);
    let tlP=`M${xs[0].toFixed(1)},${ys[0].toFixed(1)}`;for(let i=1;i<tlPts.length;i++){const dx=(xs[i]-xs[i-1])/2.5;tlP+=` C${(xs[i-1]+dx).toFixed(1)},${ys[i-1].toFixed(1)} ${(xs[i]-dx).toFixed(1)},${ys[i].toFixed(1)} ${xs[i].toFixed(1)},${ys[i].toFixed(1)}`;}
    if(!has("love")) return <Locked planNeeded="deep" title="Love & Compatibility ชะตาความรัก & ไทม์ไลน์คู่แท้" onUpgrade={tryUpgrade}><div style={{padding:12,borderRadius:10,background:"linear-gradient(135deg,#1E1035,#3B1054)",color:"#fff",marginBottom:8}}><div style={{fontSize:13,fontWeight:700,marginBottom:4}}>💕 Love & Compatibility</div><div style={{fontSize:11,color:"#C4B5FD"}}>ทำไมถึงเจอแต่รักพังๆ? คู่ครองแบบไหนเสริมดวงจริงๆ?</div></div><div style={{fontSize:12,lineHeight:1.8,color:"#374151"}}>💔 Root Cause: รูปแบบความสัมพันธ์ที่ซ้ำซาก...<br/>💑 Ideal Partner: ลักษณะคู่ครองที่เสริมดวงคุณ...<br/>⏳ Destiny Timeline: ช่วงเวลาที่จะพบคู่แท้...</div></Locked>;
    return <Card style={{background:"#FFFFFF",border:"1px solid #C7D2FE",padding:"14px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:18}}>💕</span><div><div style={{fontSize:14,fontWeight:800,color:"#4338CA"}}>Love & Compatibility</div><div style={{fontSize:10,color:"#7C3AED"}}>ชะตาความรัก & ไทม์ไลน์คู่แท้ · Vedic × Attachment Psychology</div></div></div>
      {aiL.love?<Spin t="วิเคราะห์ชะตาความรัก..."/>:ai.love?<>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:800,color:"#F43F5E",borderLeft:"3px solid #F43F5E",paddingLeft:8,marginBottom:2}}>1. Root Cause Diagnostic</div>
        <div style={{fontSize:10,color:"#BE185D",paddingLeft:11,marginBottom:10,fontStyle:"italic"}}>"ทำไมถึงเจอแต่รักพังๆ?"</div>
        <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
          <div style={{flexShrink:0}}>
            <div style={{fontSize:9,color:"#64748B",textAlign:"center",marginBottom:3}}>สัดส่วนสาเหตุ</div>
            <svg viewBox="0 0 140 140" style={{width:130}}>
              <rect width="140" height="140" fill="#F8FAFC" rx="8"/>
              {dSegs.map((s,i)=><path key={i} d={dP(70,70,54,32,s.sa,s.ea)} fill={s.c}/>)}
              <text x="70" y="67" textAnchor="middle" fontSize="10" fill="#1E293B" fontWeight="bold">สาเหตุ</text>
              <text x="70" y="80" textAnchor="middle" fontSize="8" fill="#94A3B8">หลัก</text>
            </svg>
          </div>
          <div style={{flex:1}}>{dSegs.map((s,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:7}}><div style={{width:8,height:8,borderRadius:2,background:s.c,flexShrink:0,marginTop:3}}/><div><div style={{fontSize:10,fontWeight:600,color:"#1E293B"}}>{s.l}</div><div style={{fontSize:8,color:"#94A3B8",marginBottom:1}}>{s.s}</div><div style={{fontSize:11,fontWeight:700,color:s.c}}>{Math.round(s.pct*100)}%</div></div></div>)}</div>
        </div>
        <div style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #6366F1"}}><Typer text={ai.love}/></div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:800,color:"#0891B2",borderLeft:"3px solid #0891B2",paddingLeft:8,marginBottom:2}}>2. The Ideal Partner & Destiny Timeline</div>
        <div style={{fontSize:10,color:"#0E7490",paddingLeft:11,marginBottom:10,fontStyle:"italic"}}>"คู่ครองลักษณะไหนเสริมดวง และจะเจอเมื่อไหร่?"</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div style={{background:"#F5F3FF",borderRadius:8,padding:"10px 12px",border:"1px solid #DDD6FE"}}><div style={{fontSize:8,fontWeight:700,color:"#7C3AED",marginBottom:1}}>⚠️ วัฏจักรเสาร์</div><div style={{fontSize:11,fontWeight:800,color:"#1E293B"}}>บทเรียนผ่านมาแล้ว</div><div style={{fontSize:8,color:"#64748B",lineHeight:1.5,marginTop:2}}>เสาร์จรผ่านลัคนา ช่วงล้างความสัมพันธ์ที่ไม่เหมาะสม</div></div>
          <div style={{background:"#ECFEFF",borderRadius:8,padding:"10px 12px",border:"2px solid #A5F3FC"}}><div style={{fontSize:8,fontWeight:700,color:"#0891B2",marginBottom:1}}>⏳ Soulmate Window</div><div style={{fontSize:13,fontWeight:800,color:"#0891B2"}}>{`ปี ${nowY+1}–${nowY+2}`}</div><div style={{fontSize:8,color:"#64748B",lineHeight:1.5,marginTop:2}}>พฤหัสบดีจรส่งผลเรือนคู่ครอง</div></div>
        </div>
        <div style={{background:"#F8FAFC",borderRadius:8,padding:"10px 8px",border:"1px solid #E2E8F0"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#1E293B",marginBottom:4,paddingLeft:6}}>📈 กราฟระดับพลังงานความสัมพันธ์ (Destiny Timeline)</div>
          <svg viewBox={`0 0 ${TW} ${TH+20}`} style={{width:"100%"}}>
            <defs><linearGradient id="lvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0891B2" stopOpacity="0.2"/><stop offset="100%" stopColor="#0891B2" stopOpacity="0"/></linearGradient></defs>
            <line x1="12" y1={(TH*0.5+8).toFixed(1)} x2={(TW-12).toFixed(1)} y2={(TH*0.5+8).toFixed(1)} stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="3,3"/>
            <path d={`${tlP} L${xs[tlPts.length-1].toFixed(1)},${(TH+8)} L${xs[0].toFixed(1)},${(TH+8)}Z`} fill="url(#lvGrad)"/>
            <path d={tlP} fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {tlPts.map((p,i)=><circle key={i} cx={xs[i].toFixed(1)} cy={ys[i].toFixed(1)} r={p.t==="soulmate"?5:p.t==="karmic"?4:3} fill={p.t==="soulmate"?"#F59E0B":p.t==="karmic"?"#EC4899":p.t==="now"?"#7C3AED":"#0891B2"} stroke="#fff" strokeWidth="1.5"/>)}
            {tlPts.map((p,i)=><text key={i} x={xs[i].toFixed(1)} y={(TH+18).toFixed(1)} textAnchor="middle" fontSize="6" fill="#64748B">{p.lbl.split("\n")[0]}</text>)}
          </svg>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginTop:4}}>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#64748B"}}><div style={{width:8,height:8,borderRadius:"50%",background:"#EC4899"}}/> คู่กรรม</div>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#64748B"}}><div style={{width:8,height:8,borderRadius:"50%",background:"#7C3AED"}}/> ปัจจุบัน</div>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#64748B"}}><div style={{width:8,height:8,borderRadius:"50%",background:"#F59E0B"}}/> คู่แท้</div>
          </div>
        </div>
      </div>
      <div>
        <div style={{fontSize:12,fontWeight:800,color:"#6D28D9",borderLeft:"3px solid #7C3AED",paddingLeft:8,marginBottom:2}}>เปรียบเทียบ: สิ่งที่จิตใต้สำนึกเรียกร้อง VS สเปคเสริมดวง</div>
        <div style={{fontSize:10,color:"#64748B",paddingLeft:11,marginBottom:10}}>บ่อยครั้งที่โหยหาความตื่นเต้น แต่ดวงบอกว่าต้องการความมั่นคง</div>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style={{flexShrink:0}}>
            <svg viewBox="0 0 200 200" style={{width:165}}>
              <rect width="200" height="200" fill="#F8FAFC" rx="8"/>
              {[0.25,0.5,0.75,1].map((r,i)=><circle key={i} cx="100" cy="100" r={r*58} fill="none" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray={r<1?"3,3":"none"}/>)}
              {[0,1,2,3,4].map(i=><line key={i} x1="100" y1="100" x2={rAx(i).x} y2={rAx(i).y} stroke="#CBD5E1" strokeWidth="0.5"/>)}
              <polygon points={[0,1,2,3,4].map(i=>{const p=rPt(i,sub[i],58);return`${p.x},${p.y}`}).join(" ")} fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="1.5"/>
              <polygon points={[0,1,2,3,4].map(i=>{const p=rPt(i,idl[i],58);return`${p.x},${p.y}`}).join(" ")} fill="#22D3EE" fillOpacity="0.2" stroke="#22D3EE" strokeWidth="1.5"/>
              {[0,1,2,3,4].map(i=>{const p=rPt(i,sub[i],58);return<circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#EC4899"/>;})}{[0,1,2,3,4].map(i=>{const p=rPt(i,idl[i],58);return<circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#22D3EE"/>;})}{rlbls.map((l,i)=><text key={i} x={rLb(i).x} y={rLb(i).y} textAnchor="middle" fontSize="7" fill="#475569" dominantBaseline="central">{l}</text>)}
            </svg>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:"#64748B"}}><div style={{width:14,height:2,background:"#EC4899",borderRadius:1}}/> จิตใต้สำนึก</div>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:"#64748B"}}><div style={{width:14,height:2,background:"#22D3EE",borderRadius:1}}/> สเปคเสริมดวง</div>
            </div>
          </div>
          <div style={{flex:1,paddingTop:4}}>
            <div style={{background:"#FFF1F2",border:"1px solid #FECDD3",borderRadius:8,padding:"8px 10px",marginBottom:8}}><div style={{fontSize:9,fontWeight:700,color:"#BE185D",marginBottom:3}}>Your Subconscious (สีชมพู)</div><div style={{fontSize:9,color:"#374151",lineHeight:1.6}}>ต้องการความตื่นเต้นและอิสระสูง แต่อาจดึงดูดคนที่ไม่เสถียรทางอารมณ์</div></div>
            <div style={{background:"#ECFEFF",border:"1px solid #A5F3FC",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,fontWeight:700,color:"#0891B2",marginBottom:3}}>Ideal Match (สีฟ้า)</div><div style={{fontSize:9,color:"#374151",lineHeight:1.6}}>คู่ที่เสริมดวงจริงคือคนที่มั่นคงทางอารมณ์ สื่อสารดี และเข้าใจอย่างลึกซึ้ง</div></div>
          </div>
        </div>
      </div>
      </>:<Spin t="กำลังโหลด..."/>}
    </Card>;
  })()}

  {/* Life Principle */}
  {!has("principle")?<Locked planNeeded="deep" title="Life Principle หลักการใช้ชีวิต" onUpgrade={tryUpgrade}><div style={{padding:"14px 16px",borderRadius:10,background:"linear-gradient(135deg,#1E1B4B,#312E81)",color:"#C7D2FE",lineHeight:1.8,fontSize:12,fontStyle:"italic"}}>เมื่อดาวส่งแสง ชีวิตจะงดงามที่สุดในแบบของคุณ แต่เมื่อเข้าสู่ช่วงดำมืด ทุกครั้งที่ผ่านได้เพราะพลังจากดาวที่นำทางคุณเสมอ...</div></Locked>:<Sec fKey="principle" title="Life Principle หลักการใช้ชีวิต" icon="✨"><div style={{padding:"16px 18px",borderRadius:10,background:"linear-gradient(135deg,#1E1B4B,#312E81)"}}>{aiL.principle?<Spin/>:ai.principle?<div style={{fontSize:14,lineHeight:1.9,color:"#E0E7FF",fontStyle:"italic",textAlign:"center"}}>{ai.principle}</div>:<Spin t="วิเคราะห์หลักการชีวิต..."/>}</div></Sec>}

  {/* Life Phase Map (Dasha) */}
  {!has("dasha")?<Locked planNeeded="all" title="Life Phase Map (Dasha)" onUpgrade={tryUpgrade}><div style={{fontSize:12,fontWeight:700,marginBottom:6}}>🗺 แผนที่ช่วงชีวิต — Vedic Dasha System</div>{["🌀 เกตุ — การค้นหาตัวเอง","💎 ศุกร์ — ความสัมพันธ์","☀️ อาทิตย์ — การสร้างตัวตน","🌙 จันทร์ — อารมณ์และจิตใจ"].map((d,i)=><div key={i} style={{fontSize:11,padding:"3px 0",color:"#374151"}}>{d}</div>)}<div style={{fontSize:10,color:"#6366F1",marginTop:6}}>🔮 คำนวณจากนักษัตร + มหาทศา Vedic Jyotish</div></Locked>:<Sec fKey="dasha" title="Life Phase Map" icon="🗺">{(()=>{try{
    let bd=bday;
    if(!bd||bd==="--"||bd.length<8){const p=ST.get("profile");if(p?.bday&&p.bday!=="--"&&p.bday.length>=8)bd=p.bday}
    const phases=calcDasha(bd);
    if(!phases||phases.length===0){
      return<div style={{padding:8,textAlign:"center"}}>
        <div style={{fontSize:12,color:"#64748B",marginBottom:10}}>📅 ต้องระบุวันเกิดเพื่อคำนวณ Life Phase Map</div>
        <button onClick={()=>setSc("profile")} style={{padding:"10px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>✏️ ไปกรอกวันเกิด</button>
      </div>
    }
    const current=phases.find(d=>d.isCurrent);return<>{current&&<Card style={{background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",border:"2px solid #6366F1"}}><div style={{fontSize:14,fontWeight:800,color:"#4338CA",marginBottom:4}}>{current.icon} ตอนนี้คุณอยู่ในช่วง: {current.theme}</div><div style={{fontSize:11,color:"#64748B"}}>มหาทศา{current.p} (อายุ {current.startAge}–{current.endAge} ปี | พ.ศ.{current.startYear+543}–{current.endYear+543})</div><div style={{fontSize:12,color:"#374151",marginTop:4}}>{current.desc}</div><div style={{fontSize:11,color:"#059669",marginTop:4,background:"#ECFDF5",padding:"6px 8px",borderRadius:6}}>🎯 โฟกัส: {current.focus}</div><div style={{fontSize:11,color:"#374151",marginTop:6,background:"#FFF7ED",padding:"8px",borderRadius:6,lineHeight:1.7}}>{current.cheer}</div><div style={{fontSize:10,color:"#B45309",marginTop:4,background:"#FFFBEB",padding:"6px 8px",borderRadius:6,lineHeight:1.6}}>{current.warn}</div></Card>}{(()=>{const ns=natalPStr(bd);const pKey={"ศุกร์":"ve","อาทิตย์":"su","จันทร์":"mo","อังคาร":"ma","พฤหัส":"ju","เสาร์":"sa","พุธ":"me"};const getE=(p)=>{const k=pKey[p];return k&&ns[k]?Math.round(ns[k]*10):60};const getDig=(e)=>e>=80?"อุจจ์":e>=55?"ปกติ":"นิจ";const getDC=(e)=>e>=80?"#10B981":e>=55?"#6366F1":"#EF4444";const ads=current?calcAntardasha(current,current.startYear):[];const curAD=ads.find(a=>a.isCurrent);return<div style={{marginTop:8}}><div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:6}}>⚡ ทศาย่อย (Antardasha) — {current?.p}มหาทศา</div>{curAD&&<div style={{padding:"8px 10px",borderRadius:8,background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",border:"2px solid #6366F1",marginBottom:8}}><div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:2}}>⭐ ทศาย่อยปัจจุบัน</div><div style={{fontSize:13,fontWeight:800,color:"#1E293B"}}>{curAD.icon} {curAD.p} — {curAD.theme}</div><div style={{fontSize:9,color:"#64748B",marginBottom:4}}>พ.ศ.{Math.round(curAD.startYear+543)}–{Math.round(curAD.endYear+543)}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}><span style={{fontSize:9,color:getDC(getE(curAD.p)),fontWeight:700,minWidth:28}}>{getDig(getE(curAD.p))}</span><div style={{flex:1,height:4,borderRadius:2,background:"#E2E8F0"}}><div style={{height:4,borderRadius:2,background:getDC(getE(curAD.p)),width:getE(curAD.p)+"%"}}/></div><span style={{fontSize:9,fontWeight:700,color:getDC(getE(curAD.p))}}>{getE(curAD.p)}%</span></div><div style={{fontSize:11,color:"#374151",marginTop:6,lineHeight:1.6}}>{curAD.cheer}</div></div>}{ads.map((a,i)=>{const e=getE(a.p);const dc=getDC(e);return<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,marginBottom:2,background:a.isCurrent?"linear-gradient(135deg,#EEF2FF,#F5F3FF)":a.isPast?"#F8FAFC":"#FAFBFF",border:a.isCurrent?"2px solid #6366F1":a.isPast?"1px solid #F1F5F9":"1px solid #E8EEFF",opacity:a.isPast?0.65:1}}><span style={{fontSize:14}}>{a.icon}</span><div style={{flex:1}}><div style={{fontSize:11,fontWeight:a.isCurrent?700:500,color:a.isCurrent?"#4338CA":a.isPast?"#94A3B8":"#374151"}}>{a.p} — {a.theme}{a.isPast&&<span style={{fontSize:9,color:"#94A3B8",marginLeft:4}}>ผ่านมาแล้ว</span>}</div><div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}><div style={{width:36,height:3,borderRadius:2,background:"#E2E8F0"}}><div style={{height:3,borderRadius:2,background:dc,width:e+"%"}}/></div><span style={{fontSize:8,color:dc,fontWeight:600}}>{getDig(e)}</span></div></div><div style={{textAlign:"right",minWidth:60}}><div style={{fontSize:9,fontWeight:600,color:a.isCurrent?"#4338CA":"#94A3B8"}}>พ.ศ.{Math.round(a.startYear+543)}</div><div style={{fontSize:9,color:"#94A3B8"}}>–{Math.round(a.endYear+543)}</div></div></div>})}</div>})()}<div style={{marginTop:8,padding:8,background:"#F5F3FF",borderRadius:8}}><div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:2}}>🔮 Vedic Dasha System</div><div style={{fontSize:9,color:"#64748B"}}>คำนวณจากนักษัตรเกิด ใช้ระบบวิมโศตตรีทศา 120 ปี ตามโหราศาสตร์พระเวท</div></div></>}catch(e){return<div style={{fontSize:11,color:"#94A3B8"}}>ไม่สามารถคำนวณ Dasha ได้ กรุณาตรวจสอบวันเกิด</div>}})()}</Sec>}

  {/* Locked preview: Weekly */}
  {!has("weekly")?<Locked planNeeded="deep" title="Do & Don't สัปดาห์นี้" onUpgrade={tryUpgrade}><div style={{marginBottom:8}}><div style={{fontSize:12,fontWeight:700,color:"#10B981",marginBottom:4}}>✅ ควรทำ</div><div style={{padding:"6px 10px",borderRadius:6,background:"#ECFDF5",fontSize:11,marginBottom:3}}>ใช้จุดแข็งที่ดาวหนุนให้เต็มที่</div><div style={{padding:"6px 10px",borderRadius:6,background:"#ECFDF5",fontSize:11,marginBottom:3}}>ฝึกสังเกตอารมณ์ตัวเอง</div></div><div><div style={{fontSize:12,fontWeight:700,color:"#EF4444",marginBottom:4}}>❌ ควรเลี่ยง</div><div style={{padding:"6px 10px",borderRadius:6,background:"#FFF1F2",fontSize:11,marginBottom:3}}>หลีกเลี่ยงการตัดสินใจเร็วเกินไป</div><div style={{padding:"6px 10px",borderRadius:6,background:"#FFF1F2",fontSize:11}}>อย่ารับงานเกินกำลัง</div></div></Locked>:<Sec fKey="weekly" title="Do & Don't สัปดาห์นี้" icon="📋">{aiL.weekly?<Spin/>:ai.weekly&&typeof ai.weekly==="object"?<><div style={{fontSize:11,fontWeight:700,color:"#10B981",marginBottom:3}}>✅ ควรทำ</div>{(ai.weekly.do||[]).map((t,i)=><div key={i} style={{padding:"5px 8px",borderRadius:6,background:"#ECFDF5",border:"1px solid #A7F3D0",fontSize:11,marginBottom:2}}>{t}</div>)}<div style={{fontSize:11,fontWeight:700,color:"#EF4444",marginBottom:3,marginTop:6}}>❌ ควรเลี่ยง</div>{(ai.weekly.dont||[]).map((t,i)=><div key={i} style={{padding:"5px 8px",borderRadius:6,background:"#FFF1F2",border:"1px solid #FECDD3",fontSize:11,marginBottom:2}}>{t}</div>)}</>:<Spin/>}</Sec>}

  {/* Locked preview: Energy */}
  {!has("energy")?<Locked planNeeded="deep" title="7-Day Energy Forecast" onUpgrade={tryUpgrade}><div style={{fontSize:12,fontWeight:700,marginBottom:8}}>🌙 พลังงาน 7 วัน — Moon + Mars + Day Lord</div>{["จันทร์ — 🌟 สดใส-เริ่มใหม่","อังคาร — 😊 สงบมั่นคง","พุธ — 🔥 กระตือรือร้น","พฤหัสบดี — 📚 ปัญญาเปิด","ศุกร์ — 💎 ผ่อนคลาย","เสาร์ — ⚙️ ต้องใช้วินัย","อาทิตย์ — ☀️ มีพลัง"].map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",borderRadius:6,background:i%2===0?"#F8FAFC":"#fff",fontSize:11,marginBottom:2}}><span>{d.split("—")[0]}</span><span style={{fontWeight:700}}>{d.split("—")[1]}</span></div>)}<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{['💼 งาน','💰 เงิน','❤️ ความรัก','🏃 สุขภาพ'].map((t,i)=><span key={i} style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:"#EEF2FF",color:"#4338CA",fontWeight:600}}>{t}</span>)}</div><div style={{fontSize:10,color:"#6366F1",marginTop:6}}>🔮 คำนวณจาก Transit จันทร์+อังคาร+ศุกร์+พฤหัส+เจ้าวัน Vedic</div></Locked>:<Sec fKey="energy" title="7-Day Energy: รู้ก่อนรุ่ง พุ่งก่อนใคร" icon="🌙">{aiL.energy||!ai.energy?<Spin/>:Array.isArray(ai.energy)?<>{ai.energy.map((d,i)=>{const eColor=d.energy>=75?"#059669":d.energy>=55?"#6366F1":"#DC2626";const eBg=d.energy>=75?"#ECFDF5":d.energy>=55?"#EEF2FF":"#FFF1F2";return<div key={i} style={{padding:"10px 12px",borderRadius:10,marginBottom:4,background:i===0?"linear-gradient(135deg,#EEF2FF,#F5F3FF)":"#F8FAFC",border:i===0?"2px solid #6366F1":"1px solid #F1F5F9",boxShadow:i===0?"0 2px 8px rgba(99,102,241,0.08)":"none"}}>
  {/* Day header */}
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      {i===0&&<span style={{fontSize:9,fontWeight:700,color:"#fff",background:"#6366F1",padding:"1px 6px",borderRadius:8}}>วันนี้</span>}
      <span style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>{d.day}</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <span style={{fontSize:11,fontWeight:800,color:eColor,background:eBg,padding:"2px 8px",borderRadius:8}}>{d.energy}%</span>
      {d.featured&&<span style={{fontSize:9,fontWeight:700,color:d.featuredGood?"#059669":"#DC2626",background:d.featuredGood?"#ECFDF5":"#FFF1F2",padding:"1px 6px",borderRadius:8}}>{d.featured}</span>}
    </div>
  </div>
  {/* Special event warning */}
  {d.specialEvent&&<div style={{padding:"6px 10px",borderRadius:8,marginBottom:6,background:d.specialEvent.type==='danger'?"#FFF1F2":"#ECFDF5",border:`1px solid ${d.specialEvent.type==='danger'?"#FECDD3":"#A7F3D0"}`,fontSize:10,fontWeight:600,color:d.specialEvent.type==='danger'?"#B91C1C":"#059669",lineHeight:1.5}}>{d.specialEvent.text}</div>}
  {/* Mood */}
  <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>{d.mood}</div>
  {/* Domain breakdown */}
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:6}}>
    {[{icon:'💼',label:'งาน',text:d.work},{icon:'💰',label:'เงิน',text:d.money},{icon:'❤️',label:'ความรัก',text:d.love},{icon:'🏃',label:'สุขภาพ',text:d.health}].map(({icon,label,text},di)=>text?<div key={di} style={{background:"#fff",borderRadius:8,padding:"5px 8px",border:"1px solid #F1F5F9"}}>
      <div style={{fontSize:9,fontWeight:700,color:"#64748B",marginBottom:2}}>{icon} {label}</div>
      <div style={{fontSize:10,color:"#374151",lineHeight:1.4}}>{text}</div>
    </div>:null)}
  </div>
  {/* Transit & tip */}
  {d.goodFor&&<div style={{fontSize:10,color:"#059669",background:"#ECFDF5",borderRadius:6,padding:"3px 8px",marginBottom:3}}>✅ เหมาะสำหรับ: {d.goodFor}</div>}
  {d.tip&&<div style={{fontSize:10,color:"#374151",background:"#fff",borderRadius:6,padding:"3px 8px",border:"1px solid #F1F5F9"}}>💡 {d.tip}</div>}
</div>})}<div style={{marginTop:6,padding:8,background:"#F5F3FF",borderRadius:8}}><div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:2}}>🔮 Vedic Jyotish พระเวท — 5 ชั้น</div><div style={{fontSize:9,color:"#64748B"}}>จันทร์(40%) + อังคาร(25%) + เจ้าวัน(35%) + ศุกร์ + พฤหัส · วิเคราะห์งาน เงิน ความรัก สุขภาพ รายวัน</div></div></>:<Spin/>}</Sec>}

  {/* Career Timeline */}
  {!has("timeline")?<Locked planNeeded="all" title="Dashboard กราฟชีวิตการงาน: รู้ก่อนรุ่ง พุ่งก่อนใคร" onUpgrade={tryUpgrade}><div style={{fontSize:12,fontWeight:700,marginBottom:8}}>📅 กราฟชีวิตการงานรายเดือน — โหราศาสตร์ไทย × จิตวิทยา</div><div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap"}}>{['🌟 เดือนทอง ×3','⚠️ เดือนระวัง ×2','💼 งานเสริม ×4'].map((t,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:i===0?"#FFF8E1":i===1?"#FFF1F2":"#E4EEFF",fontWeight:600,color:i===0?"#C88A10":i===1?"#C04040":"#3A7AC0"}}>{t}</span>)}</div>{['ม.ค. 🌟 เดือนแห่งโอกาส','ก.พ. ⚠️ Saturn กดทับ','มี.ค. 💼 งานเสริมเข้ามา'].map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",borderRadius:6,background:"#F8FAFC",marginBottom:2,fontSize:11}}><span>{d}</span><span style={{fontSize:10}}>⭐⭐⭐{i===0?"⭐⭐":"☆☆"}</span></div>)}<div style={{fontSize:10,color:"#7B6FA0",marginTop:6}}>🔮 Golden Days + Black Days + คำแนะนำจิตวิทยาเฉพาะดวงคุณ</div></Locked>:
  <Sec fKey="timeline" title="กราฟชีวิตการงาน: รู้ก่อนรุ่ง พุ่งก่อนใคร" icon="📅">{(()=>{
    const tl=ai.timeline;
    if(aiL.timeline||!tl)return<Spin t="กำลังคำนวณ Timeline..."/>;
    const months=tl.months||[];
    const year=tl.year||new Date().getFullYear()+543;
    const goldenC=months.filter(m=>m.stars===5).length;
    const dangerC=months.filter(m=>m.type==='danger').length;
    const sideC=months.filter(m=>m.sideJob).length;
    const typeColors={golden:'#F5A623',good:'#4CAF7D',danger:'#E05C5C',side:'#5C9BE0',neutral:'#B0A8C0'};
    const typeBg={golden:'#FFF8E1',good:'#E8F5E9',danger:'#FFF1F2',side:'#E4EEFF',neutral:'#F5F3FF'};
    const typeBorder={golden:'#F5A623',good:'#4CAF7D',danger:'#E05C5C',side:'#5C9BE0',neutral:'#C0B8D0'};
    return<div>
    {/* Year label */}
    <div style={{textAlign:"center",marginBottom:10}}><span style={{fontSize:16,fontWeight:700,color:"#1E293B",letterSpacing:1}}>พ.ศ. {year}</span><div style={{fontSize:11,color:"#8A8090"}}>กราฟชีวิตการงานรายเดือน · โหราศาสตร์ไทย × จิตวิทยา</div></div>

    {/* Summary pills */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
      <div style={{background:"#FFF8E1",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:16}}>⭐</div><div style={{fontSize:18,fontWeight:700,color:"#C88A10"}}>{goldenC}</div><div style={{fontSize:9,color:"#8A8090",fontWeight:500}}>เดือนทอง</div></div>
      <div style={{background:"#FFF1F2",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:16}}>⚠️</div><div style={{fontSize:18,fontWeight:700,color:"#C04040"}}>{dangerC}</div><div style={{fontSize:9,color:"#8A8090",fontWeight:500}}>เดือนระวัง</div></div>
      <div style={{background:"#E4EEFF",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:16}}>💼</div><div style={{fontSize:18,fontWeight:700,color:"#3A7AC0"}}>{sideC}</div><div style={{fontSize:9,color:"#8A8090",fontWeight:500}}>งานเสริม</div></div>
    </div>

    {/* Energy Chart (SVG) */}
    <div style={{background:"#fff",borderRadius:12,padding:"12px 8px",marginBottom:12,border:"1px solid #F1F5F9"}}>
      <div style={{fontSize:12,fontWeight:700,color:"#1E293B",marginBottom:2}}>📈 กราฟพลังงานการงาน</div>
      <div style={{fontSize:10,color:"#8A8090",marginBottom:8}}>แตะที่เดือนเพื่อดูรายละเอียด</div>
      <svg viewBox="0 0 480 100" style={{width:"100%",height:80}} preserveAspectRatio="none">
        <line x1="0" y1="25" x2="480" y2="25" stroke="#F0ECF8" strokeWidth="0.5"/>
        <line x1="0" y1="50" x2="480" y2="50" stroke="#F0ECF8" strokeWidth="0.8"/>
        <line x1="0" y1="75" x2="480" y2="75" stroke="#F0ECF8" strokeWidth="0.5"/>
        {(()=>{
          const pts=months.map((m,i)=>({x:20+i*(440/11),y:10+(1-m.energy/100)*80}));
          const pathD=pts.map((p,i)=>i===0?`M ${p.x},${p.y}`:`L ${p.x},${p.y}`).join(' ');
          const areaD=pathD+` L ${pts[11].x},95 L ${pts[0].x},95 Z`;
          return<>
            <defs><linearGradient id="tlAreaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7B6FA0" stopOpacity="0.15"/><stop offset="100%" stopColor="#7B6FA0" stopOpacity="0.01"/></linearGradient></defs>
            <path d={areaD} fill="url(#tlAreaG)"/>
            <path d={pathD} fill="none" stroke="#7B6FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={months[i].stars===5?5:3.5} fill={typeColors[months[i].type]} stroke="#fff" strokeWidth="1.5" style={{cursor:"pointer"}}/>)}
          </>})()}
      </svg>
      <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",textAlign:"center",marginTop:4}}>
        {months.map((m,i)=><span key={i} style={{fontSize:8,color:"#B0A8C0",fontWeight:500}}>{m.monthShort}</span>)}
      </div>
      <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
        {[['#F5A623','เดือนทอง'],['#4CAF7D','เดือนดี'],['#E05C5C','ระวัง'],['#5C9BE0','งานเสริม']].map(([c,l],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#8A8090"}}><div style={{width:6,height:6,borderRadius:"50%",background:c}}/>{l}</div>)}
      </div>
    </div>

    {/* Month cards */}
    <div style={{marginBottom:10}}>
      <div style={{fontSize:12,fontWeight:700,color:"#1E293B",marginBottom:4}}>🗓️ ทุกเดือนในปีนี้</div>
      <div style={{fontSize:10,color:"#8A8090",background:"#F5F3FF",borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:13}}>👆</span>
        <span>แตะที่การ์ดรายเดือนเพื่อดูรายละเอียด — งาน เงิน ความรัก สุขภาพ + คำแนะนำตัดสินใจ<br/>
        <span style={{color:"#6366F1",fontWeight:600}}>ม.ค. เปิดไว้ให้ดูตัวอย่าง · แตะอีกครั้งเพื่อปิด</span></span>
      </div>
    </div>
    {months.map((m,i)=><TimelineMonth key={i} m={m} i={i} typeColors={typeColors} typeBg={typeBg} typeBorder={typeBorder} defaultOpen={i===0}/>)}

    <div style={{marginTop:8,padding:8,background:"#F5F3FF",borderRadius:8}}>
      <div style={{fontSize:10,fontWeight:700,color:"#7B6FA0",marginBottom:2}}>🔮 Vedic Jyotish พระเวท × โหราศาสตร์ไทย</div>
      <div style={{fontSize:9,color:"#64748B"}}>คำนวณจากราศีเกิด Sidereal + มหาทศา Dasha + ดาวจร 8 ดวง + เรือน 12 + สภาพดาว (อุจจ์/นิจ/เกษตร) · วิเคราะห์งาน เงิน ความรัก สุขภาพ รายเดือน</div>
    </div>
    </div>})()}</Sec>}

  {/* Locked preview: Job */}
  {!has("job")?<Locked planNeeded="all" title="Job Matching AI" onUpgrade={tryUpgrade}><div style={{fontSize:12,fontWeight:700,marginBottom:8}}>💼 AI แนะนำอาชีพจาก 12D Profile + Vedic</div>{[{t:"Data Analyst",m:88},{t:"Project Manager",m:82},{t:"UX Researcher",m:78}].map((j,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",borderRadius:6,background:"#F8FAFC",marginBottom:3,fontSize:12}}><span>{i+1}. {j.t}</span><span style={{fontWeight:700,color:"#4338CA"}}>Match {j.m}%</span></div>)}<div style={{display:"flex",gap:4,marginTop:4}}><div style={{padding:"5px 10px",borderRadius:6,background:"#0A66C2",color:"#fff",fontSize:10,fontWeight:700}}>🔍 ค้นหาใน LinkedIn</div></div></Locked>:<Sec fKey="job" title="Job Matching AI" icon="💼">{aiL.job||!ai.job?<Spin/>:Array.isArray(ai.job)?ai.job.map((j,i)=><div key={i} style={{padding:10,borderRadius:8,background:"#F8FAFC",marginBottom:4}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:13,fontWeight:700}}>{j.titleTH||j.title}</span><span style={{fontSize:10,fontWeight:700,color:"#4338CA",background:"#EEF2FF",padding:"2px 6px",borderRadius:6}}>{j.match}%</span></div>{j.dims&&<div style={{fontSize:10,color:"#6366F1",marginBottom:2}}>📊 {j.dims}</div>}<div style={{fontSize:11,color:"#64748B",lineHeight:1.5}}>{j.reason}</div><a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(j.title)}&location=Thailand`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:6,padding:"5px 12px",borderRadius:6,background:"#0A66C2",color:"#fff",fontSize:11,fontWeight:700,textDecoration:"none"}}>🔍 ค้นหางานในไทย — LinkedIn</a></div>):<Spin/>}</Sec>}

  {!has("pdf")?<Locked planNeeded="all" title="PDF Report ดาวน์โหลด" onUpgrade={tryUpgrade}><div style={{fontSize:12,lineHeight:1.8}}>📄 รายงานฉบับเต็ม ประกอบด้วย:<br/>• 12 Dimension Scores + Spider Chart<br/>• Identity + Shadow + 5 Core Analysis<br/>• Do & Don't + 7-Day Energy + transit<br/>• Job Matching + Life Phase Map</div></Locked>:<Sec fKey="pdf" title="PDF Report" icon="📄"><Btn onClick={exportPDF} style={{fontSize:12,padding:8}}>📄 ดาวน์โหลด PDF</Btn></Sec>}

  <Sec fKey="share" title="Social Share Card" icon="📸"><div style={{fontSize:11,color:"#64748B",marginBottom:6}}>{plan==="all"?"การ์ด Full — Radar Chart 12 ด้าน + จุดแข็ง + Shadow + คำแนะนำ":"การ์ด Free — 5 Core + จุดแข็ง/Shadow + CTA อัปเกรด"}</div><Btn onClick={shareProfile} style={{fontSize:12,padding:8,background:"linear-gradient(135deg,#7C3AED,#5B21B6)"}}>📸 ดาวน์โหลดการ์ดแชร์</Btn></Sec>

  <div style={{textAlign:"center",padding:"14px 0 40px"}}><button onClick={()=>{aiTriggered.current=false;setSc("landing");setScores(null);setVedic(null);setAns({});setAi({});setQI(0)}} style={{fontSize:11,color:"#94A3B8",background:"none",border:"none",cursor:"pointer"}}>🔄 ทำแบบทดสอบใหม่</button></div></div>};

  return<div style={{fontFamily:"'Noto Sans Thai','DM Sans',-apple-system,sans-serif",minHeight:"100vh",background:"#F8FAFC",color:"#1E293B"}}><style>{css}</style>{loginModalJSX}<div style={{maxWidth:520,margin:"0 auto",padding:sc==="landing"?"0":"12px 16px 40px"}}>{sc==="landing"&&<Landing/>}{sc==="profile"&&<Profile/>}{sc==="quiz"&&<Quiz/>}{sc==="results"&&<Results/>}</div></div>;
}

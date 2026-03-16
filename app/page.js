"use client";
import{useState,useEffect,useRef,useCallback}from"react";
import{createClient}from"@supabase/supabase-js";

const SB_URL=process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb=(SB_URL&&SB_KEY)?createClient(SB_URL,SB_KEY,{auth:{persistSession:true,storageKey:"hss-auth",storage:typeof window!=="undefined"?window.localStorage:undefined}}):null;

const BRAND="Human System Studio";
const PLANS={free:{name:"Free",price:0,tag:"🟢",c:"#10B981",f:["identity","core5","share"]},deep:{name:"Deep Insight",price:49,tag:"🟡",c:"#F59E0B",badge:"Early Bird",f:["identity","core5","12d","shadow","principle","weekly","energy","share"]},all:{name:"All Access",price:99,tag:"🔵",c:"#3B82F6",badge:"Early Bird คุ้มสุด",f:["identity","core5","12d","shadow","principle","weekly","energy","timeline","job","dasha","pdf","share"]}};
const FT=[["Identity Snapshot (AI)","identity",1,1,1],["5 Core Scores + AI วิเคราะห์","core5",1,1,1],["จุดแข็ง / จุดพัฒนา 12 มิติ","12d",0,1,1],["Shadow Analysis เชิงลึก","shadow",0,1,1],["Life Principle หลักการใช้ชีวิต","principle",0,1,1],["Life Phase Map (Dasha)","dasha",0,0,1],["Do & Don't รายสัปดาห์","weekly",0,1,1],["7-Day Energy Forecast","energy",0,1,1],["Dashboard กราฟชีวิตการงาน","timeline",0,0,1],["Job Matching AI","job",0,0,1],["PDF Report ดาวน์โหลด","pdf",0,0,1],["Social Share Card","share",1,1,1]];

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
const natalMoon=(bd)=>{if(!bd||bd==="--")return 0;const d=new Date(bd+"T12:00:00Z");return isNaN(d.getTime())?0:moonTr(d)};
const getNak=(ri,di)=>NAKSHATRA[(ri*2+(di%3))%27];
const trAspect=(tr,nr)=>{const d=((tr-nr)%12+12)%12;if(d===0)return{r:"ร่วม",q:"กลาง",m:0};if(d===4||d===8)return{r:"ตรีโกณ",q:"ดีมาก",m:15};if(d===3||d===9)return{r:"จตุโกณ",q:"กดดัน",m:-15};if(d===6)return{r:"ตรงข้าม",q:"ตึง",m:-10};if(d===5)return{r:"ตรีโกณรอง",q:"ดี",m:10};return{r:"ปกติ",q:"กลาง",m:0}};
const marsD=(r)=>{if(r===0||r===7)return{d:"เกษตร",m:10};if(r===9)return{d:"อุจจ์",m:15};if(r===3)return{d:"นิจ",m:-15};return{d:"ปกติ",m:0}};

const gen7Day=(bd)=>{const nm=natalMoon(bd);const ns=natalPStr(bd);const today=new Date();const days=[];for(let i=0;i<7;i++){const dt=new Date(today);dt.setDate(dt.getDate()+i);const mr=moonTr(dt);const mar=marsTr(dt);const sat=satTr(dt);const ma=trAspect(mr,nm);const md=marsD(mar);const dl=dlCompat(dt.getDay(),ns);const moonE=Math.max(30,Math.min(95,65+ma.m));const marsE=Math.max(30,Math.min(95,65+md.m));const dlE=Math.max(30,Math.min(95,65+dl.mod));const ce=Math.round(moonE*.4+marsE*.25+dlE*.35);days.push({date:`${dt.getDate()}/${dt.getMonth()+1}`,dn:DAYNAME[dt.getDay()],moonR:RASHI[mr],nak:getNak(mr,i),marsR:RASHI[mar],satR:RASHI[sat],ma,md,nmR:RASHI[nm],dl,ce})}return days};

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
      planets,sideJob:type==='side'||type==='good'
    };
  });
};
const starsFromEnergy=(e)=>{if(e>=85)return 5;if(e>=70)return 4;if(e>=52)return 3;if(e>=35)return 2;return 1};
const starStr=(n)=>{let s='';for(let i=0;i<n;i++)s+='⭐';for(let i=n;i<5;i++)s+='☆';return s};
const starLabel=(n)=>['','เดือนยาก','เดือนระวัง','เดือนปกติ','เดือนดี','เดือนทอง'][n]||'';

// ── MBTI + Vedic Identity Helpers ──
const calcMBTI=(s)=>{const ei=((s["Energy Management"]||5)+(s["Motivation Driver"]||5))/2>=5.5?"E":"I";const ns=((s["Cognitive Processing"]||5)+(s["Integration Level"]||5)+(s["Growth Orientation"]||5))/3>=5.5?"N":"S";const tf=(s["Decision System"]||5)>=(s["Emotional Regulation"]||5)?"T":"F";const jp=((s["Identity Stability"]||5)+(s["Responsibility Load"]||5))/2>=5.5?"J":"P";return ei+ns+tf+jp};
const MBTI_META={"ENTJ":{title:"The Visionary Commander",th:"ผู้นำที่มองเห็นภาพใหญ่และเด็ดขาด"},"INTJ":{title:"The Master Strategist",th:"นักวางกลยุทธ์ที่คิดทะลุปรุโปร่ง"},"ENTP":{title:"The Innovative Disruptor",th:"นักพลิกเกมด้วยความคิดสร้างสรรค์"},"INTP":{title:"The Systems Architect",th:"สถาปนิกระบบความคิดชั้นสูง"},"ENFJ":{title:"The Inspirational Leader",th:"ผู้นำที่จุดประกายแรงบันดาลใจ"},"INFJ":{title:"The Visionary Healer",th:"ผู้มองเห็นอนาคตและสร้างการเปลี่ยนแปลง"},"ENFP":{title:"The Creative Catalyst",th:"ตัวเร่งพลังสร้างสรรค์"},"INFP":{title:"The Idealist Creator",th:"นักสร้างสรรค์ผู้ใฝ่ฝัน"},"ESTJ":{title:"The Systematic Executor",th:"ผู้บริหารระบบที่มีวินัย"},"ISTJ":{title:"The Reliable Architect",th:"สถาปนิกผู้น่าเชื่อถือ"},"ESTP":{title:"The Dynamic Problem Solver",th:"นักแก้ปัญหาพลวัต"},"ISTP":{title:"The Tactical Operator",th:"ผู้ปฏิบัติการเชิงกลยุทธ์"},"ESFJ":{title:"The Community Builder",th:"ผู้สร้างชุมชนและความสัมพันธ์"},"ISFJ":{title:"The Loyal Guardian",th:"ผู้พิทักษ์ที่ไว้วางใจได้"},"ESFP":{title:"The Energetic Performer",th:"ผู้แสดงที่เต็มไปด้วยพลังงาน"},"ISFP":{title:"The Artful Innovator",th:"นักสร้างสรรค์ผู้มีศิลปะ"}};
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
fb:k=>{if(!k)return"กำลังวิเคราะห์ให้คุณนะคะ...";if(k.startsWith("id_")||k.startsWith("idv2_")||k.startsWith("idv3_")||k.startsWith("idv4_"))return JSON.stringify({powerTitle:"The Strategic Visionary",who:{mbtiLabel:"INTJ + พลังดาวพฤหัส (Jupiter)",mbtiCore:"INTJ – นักวางกลยุทธ์ที่มองเห็นภาพใหญ่และชอบออกแบบระบบ คุณคิดลึกกว่าคนส่วนใหญ่และมักเห็นทางออกที่คนอื่นมองข้าม",vedicSoul:"Jupiter Energy (พฤหัส) – ดาวแห่งปัญญาและการขยายตัว ส่งพลังให้คุณมีวิสัยทัศน์กว้างและดึงดูดโอกาสดีๆ เข้ามาในชีวิต มากกว่าคน INTJ ทั่วไป",hiddenPower:"The Pattern Reader – พลังแฝงของคุณคือการมองเห็นรูปแบบ (Pattern) ที่ซ่อนอยู่ในความซับซ้อน แล้วแปลงมันเป็นแผนที่นำทางสู่ความสำเร็จ"},what:{skillTitle:"Strategic Systems Design",skillHighlight:"การวางระบบและแก้ปัญหาเชิงกลยุทธ์ – ทักษะหายากที่ตลาดต้องการสูง",marketValue:"Top 10%",moneyMaker:"คุณทำเงินได้มากที่สุดจากการ 'มองเห็นโอกาสในความซับซ้อน' แล้วแปลงมันเป็นระบบที่คนอื่นสามารถนำไปใช้สร้างผลลัพธ์จริงได้",gapToClose:"ทักษะการนำเสนอ (Storytelling) ยังมีพื้นที่พัฒนา — การเรียนรู้นำเสนอไอเดียให้คนอื่น 'รู้สึก' ได้ จะทำให้มูลค่าของคุณเพิ่มขึ้นหลายเท่า"},when:{periodLabel:"ช่วงสะสมพลัง",statusLabel:"ช่วงสะสมพลัง",statusColor:"yellow",currentDesc:"ตอนนี้คุณอยู่ในช่วงที่เหมาะกับการสร้างรากฐาน เรียนรู้ และวางแผนระยะยาว ดาวกำลังเตรียมพลังให้คุณก้าวใหญ่ในอีกไม่นาน",goldenWindow:"ปลายปีนี้ – ต้นปีหน้า",goldenDesc:"ช่วงที่ดาวพฤหัส (ดาวแห่งโอกาส) จะมาหนุนชีวิตคุณ ทำให้ทุกการลงทุนด้านตัวเองได้ผลตอบแทนสูงขึ้น",actionPlan:"ใช้เวลานี้ พัฒนาทักษะสำคัญ 1-2 อย่างให้ลึก และขยายเครือข่ายคนที่ใช่ แล้วเตรียมพร้อมสำหรับโอกาสที่กำลังจะมา",warning:"ระวังการตัดสินใจใหญ่โดยไม่มีข้อมูลเพียงพอ ดาวแนะนำให้รอจังหวะที่ชัดเจนก่อนลงมือ"}});if(k.startsWith("core_")||k.startsWith("corev2_"))return"🧠 Cognitive (พุธ): ประมวลผลข้อมูลแม่นยำ คิดเป็นระบบ สื่อสารได้ฉับไว\n\n🌊 Emotional (จันทร์): อารมณ์มีความละเอียดอ่อน ต้องใช้สติคอยประคองในช่วงที่กดดัน\n\n⚓ Identity (อาทิตย์+เสาร์): แกนตัวตนมีความรับผิดชอบสูง เป้าหมายชัดเจน แต่อาจมีแรงกดดันแฝงอยู่\n\n🌑 Shadow (ราหู/เกตุ): ⚠️ มีจุดเปราะบางที่ควรสำรวจ — Shadow Analysis จะช่วยคลี่คลายแพทเทิร์นที่ซ่อนอยู่ได้ 🔓\n\n🌱 Growth (พฤหัส): มีแรงขับพัฒนาตนเองอย่างมีทิศทาง วิสัยทัศน์เปิดกว้าง เรียนรู้ไม่หยุด";if(k.startsWith("sh_")||k.startsWith("shv2_"))return"Shadow Analysis\n🌑 Shadow Score: 6.0/10 (คะแนนผลการทดสอบ) | 5.8/10 (ศักยภาพพื้นดวง)\nราหู/เกตุในดวงคุณไม่ใช่สิ่งน่ากลัว แต่คือบทเรียนที่สำคัญที่สุดในชีวิตนี้ครับ คะแนนผลการทดสอบที่สูงกว่าพื้นดวงแสดงว่าคุณกำลังเรียนรู้และพัฒนาตัวเองได้ดีมาก\n⚡ Trigger\nสิ่งที่กระตุ้น Shadow ของคุณได้ง่ายที่สุดคือความไม่แน่นอนและสถานการณ์ที่ควบคุมไม่ได้ พลังของราหูจะดึงคุณเข้าสู่โหมดกังวลเมื่อแผนไม่เป็นไปตามที่คาดไว้\n🔄 Pattern\nคุณมักจะตกอยู่ในวงจรคิดวนซ้ำเพื่อหาทางออกที่ดีที่สุด จนบางครั้งลืมที่จะลงมือทำจริง ซึ่งเป็นเรื่องที่ค่อยๆ ฝึกแก้ได้ครับ\n💡 วิธีแก้ตามดาว\n   1. ใช้ตรรกะสยบอารมณ์ (ดาวพุธ): เมื่อ Shadow เริ่มทำงาน จดสิ่งที่กังวลออกมาเป็น List เหมือนการเขียน task ช่วยลดพลังดาวจันทร์ที่อ่อนแรงลงได้\n   2. ตั้ง Boundary ด้วยการ Say No (ราหู): ฝึกปฏิเสธสิ่งที่ไม่สอดคล้องกับ Goal หลักเพื่อรักษาพลังงานไว้กับสิ่งสำคัญจริงๆ\n   3. เปลี่ยนความกลัวเป็นงานวิจัย (ดาวเสาร์): หากกังวลเรื่องใด ใช้เวลานั้นศึกษาข้อมูลเชิงลึกแทน พลังเสาร์จะเปลี่ยนความกลัวเป็นนวัตกรรม\n   4. ยอมรับความไม่สมบูรณ์แบบ (ดาวจันทร์): ช่วงที่กราฟชีวิตดิ่งลงคือช่วงที่ระบบกำลัง Recalibrate ตัวเองใหม่ ไม่ใช่ความล้มเหลว";if(k.startsWith("pr_"))return"เมื่อดาวแห่งปัญญาและแสงส่องพลัง ชีวิตจะงดงามที่สุดในช่วงที่คุณได้เปล่งศักยภาพออกมาเต็มที่ แต่เมื่อเข้าสู่ช่วงดำมืดที่รู้สึกหนักและสับสน ทุกครั้งที่ผ่านได้เพราะพลังแห่งการเรียนรู้และความอดทนจากดาวที่หนุนดวงคุณมาตั้งแต่เกิด";if(k.startsWith("f12_")||k.startsWith("f12v2_"))return"บทวิเคราะห์ศักยภาพรายบุคคล: Human System Intelligence\nจากการวิเคราะห์เปรียบเทียบระหว่าง \"ศักยภาพพื้นดวง (Vedic Potential)\" และ \"คะแนนผลการทดสอบ (Actual Assessment)\" ผ่าน 12 มิติชี้วัด นี่คือข้อมูลเชิงลึกของคุณครับ:\n🌟 มิติที่เป็นจุดแข็ง (Core Strengths)\n1. Integration Level (ศักยภาพพื้นดวง 7.8 | คะแนนผลการทดสอบ 7.5)\n   * ดาวเด่น: ดาวพุธ (Mercury) ปกติ\n   * วิเคราะห์: คุณมีความสามารถในการเชื่อมโยงข้อมูลและสร้างระบบที่ดีเยี่ยม คะแนนผลการทดสอบสะท้อนว่าคุณใช้ศักยภาพนี้ได้จริงในชีวิตประจำวัน โดดเด่นในการมองภาพรวมและจัดการความซับซ้อน\n2. Cognitive Processing (ศักยภาพพื้นดวง 7.5 | คะแนนผลการทดสอบ 7.2)\n   * ดาวเด่น: ดาวพุธ (Mercury) ปกติ\n   * วิเคราะห์: การประมวลผลความคิดของคุณมีความคมชัดและเป็นระบบ คุณสามารถวิเคราะห์สถานการณ์ได้รวดเร็วและแม่นยำ ซึ่งเป็นทรัพยากรที่มีค่ามากในทุกสาขาอาชีพ\n3. Motivation Driver (ศักยภาพพื้นดวง 7.2 | คะแนนผลการทดสอบ 7.0)\n   * ดาวเด่น: ดาวอาทิตย์ (Sun) ปกติ\n   * วิเคราะห์: แรงขับเคลื่อนภายในของคุณแข็งแกร่งและมีทิศทางชัดเจน คุณรู้ว่าต้องการอะไรและมุ่งมั่นไปถึงเป้าหมาย ดาวอาทิตย์ให้พลังความมั่นใจในตัวเองที่มั่นคง\n⚠️ มิติที่ควรเฝ้าระวังและพัฒนา (Strategic Areas)\n1. Emotional Regulation (ศักยภาพพื้นดวง 5.5 | คะแนนผลการทดสอบ 6.0)\n   * ดาวที่ส่งผล: ดาวจันทร์ (Moon)\n   * วิเคราะห์: พื้นดวงมีจุดเปราะบางด้านอารมณ์เล็กน้อย แต่คะแนนผลการทดสอบที่สูงกว่าพื้นดวงแสดงว่าคุณมีทักษะ Self-Mastery ที่ดี ควรระวังช่วงที่ร่างกายอ่อนเพลียเป็นพิเศษ\n2. Shadow Pattern (ศักยภาพพื้นดวง 5.8 | คะแนนผลการทดสอบ 6.2)\n   * ดาวที่ส่งผล: ราหู/เกตุ\n   * วิเคราะห์: ทุกคนมีด้านนี้และมันคือบทเรียนที่ทำให้คุณเติบโตมากที่สุด การตระหนักรู้คือก้าวแรกที่ดีที่สุดแล้ว ค่อยๆ สำรวจและยอมรับได้เลยครับ\n3. Boundary System (ศักยภาพพื้นดวง 6.0 | คะแนนผลการทดสอบ 6.3)\n   * ดาวที่ส่งผล: ดาวเสาร์ (Saturn)\n   * วิเคราะห์: การตั้งขอบเขตชัดเจนจะช่วยรักษาพลังงานของคุณไว้กับสิ่งสำคัญ ฝึกปฏิเสธสิ่งที่ไม่สอดคล้องกับเป้าหมาย พลังงานที่ประหยัดได้จะไปเสริมจุดแข็งของคุณ\n💡 บทสรุปกลยุทธ์ (Key Insight)\n\"ใช้พลังความคิดเชิงระบบและแรงขับเคลื่อนเป็นฐาน ดูแลพลังงานอารมณ์ด้วยการตั้ง Boundary ที่ชัดเจน แล้วคุณจะไปถึงเป้าหมายได้อย่างยั่งยืน\"";if(k.startsWith("wk_"))return'{"do":["สัปดาห์นี้ลองใช้จุดเด่นของตัวเองให้เต็มที่นะ ดาวหนุนอยู่","ลองหยุดสังเกตอารมณ์ตัวเองสักนิดก่อนตอบสนอง จะช่วยได้มากเลย","หาเวลาทำสิ่งที่ชอบสัก 30 นาที ให้รางวัลตัวเองบ้าง"],"dont":["ถ้าอารมณ์ขึ้นมา ลองหายใจลึกๆ ก่อนตัดสินใจนะ ไม่ต้องรีบ","เรื่องที่ค้างอยู่ ลองจัดการทีละอย่าง ไม่ต้องกดดันตัวเอง","ถ้ารู้สึกเหนื่อยก็พักได้ การปฏิเสธงานที่เกินกำลังคือการดูแลตัวเอง"]}';if(k.startsWith("en_")){const dn=["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];const moods=["🌟 วันที่สดใส","😊 ใจสงบดี","🔥 พลังเต็ม","🧠 หัวใส","📚 เปิดรับสิ่งใหม่","💎 ผ่อนคลายดี","🌿 ค่อยๆ ไป"];const energies=[72,68,78,65,82,75,58];const tips=["ดาวส่งพลังดี ใช้ช่วงเช้าทำสิ่งสำคัญ","พลังงานนุ่มนวล เหมาะดูแลตัวเอง","ร่างกายและจิตใจพร้อม ลงมือทำได้เลย","สมองคมชัด เหมาะพูดคุยแลกเปลี่ยน","วันดีมาก เหมาะเรียนรู้และตัดสินใจ","ให้รางวัลตัวเอง พักผ่อนกับคนที่รัก","ใจเย็นๆ ไม่ต้องเร่ง ทำทีละอย่างก็พอ"];const t=new Date();return JSON.stringify(Array.from({length:7},(_,i)=>{const d=new Date(t);d.setDate(d.getDate()+i);return{day:`${dn[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`,date:`${d.getDate()}/${d.getMonth()+1}`,energy:energies[i],mood:moods[i],tip:tips[i],transit:`เจ้าวัน${dn[d.getDay()]}`,goodFor:["วางแผน","พักผ่อน","ลงมือทำ","ประชุม","ตัดสินใจ","สังสรรค์","จัดระเบียบ"][i]}}))};if(k.startsWith("job_"))return'[{"title":"Data Analyst","titleTH":"นักวิเคราะห์ข้อมูล","match":85,"dims":"ความคิด + การตัดสินใจ + ความรับผิดชอบ","reason":"คุณมีพรสวรรค์ด้านการคิดวิเคราะห์ที่โดดเด่นมาก ดาวพุธและพฤหัสหนุนให้คุณมองเห็นรายละเอียดที่คนอื่นมองข้าม งานนี้เหมาะกับคุณมากเลย"},{"title":"Project Manager","titleTH":"ผู้จัดการโปรเจกต์","match":80,"dims":"พลังงาน + การตัดสินใจ + รับมือแรงกดดัน","reason":"คุณเป็นคนที่มีพลังขับเคลื่อนสูงและตัดสินใจได้ดี ดาวอังคารกับพฤหัสส่งพลังให้คุณนำทีมได้อย่างมั่นคง เชื่อมั่นในตัวเองได้เลย"},{"title":"UX Researcher","titleTH":"นักวิจัย UX","match":78,"dims":"ความคิด + อารมณ์ + การเติบโต","reason":"จุดเด่นของคุณคือเข้าใจคนอื่นได้ลึกซึ้ง ดาวจันทร์ให้ความเข้าอกเข้าใจ ดาวพฤหัสเปิดทางให้เรียนรู้ไม่หยุด งานนี้จะทำให้คุณเติบโตได้เต็มที่"}]';return null}};
const pJ=t=>{if(!t)return null;try{return JSON.parse(t.replace(/```json\s*/g,"").replace(/```/g,"").trim())}catch{return null}};
const ST={set:(k,v)=>{try{localStorage.setItem(`hss6_${k}`,JSON.stringify(v))}catch{}},get:k=>{try{const s=localStorage.getItem(`hss6_${k}`);return s?JSON.parse(s):null}catch{return null}}};

const css=`@keyframes hs{to{transform:rotate(360deg)}}@keyframes hb{50%{opacity:0}}@keyframes hfl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`;
const Spin=({t="AI กำลังวิเคราะห์..."})=><div style={{padding:"12px 0",display:"flex",alignItems:"center",gap:8}}><div style={{width:16,height:16,borderRadius:"50%",border:"2.5px solid #E0E7FF",borderTopColor:"#6366F1",animation:"hs .7s linear infinite"}}/><span style={{fontSize:12,color:"#6366F1",fontWeight:600}}>{t}</span></div>;
const fmtAI=t=>t?t.replace(/\n+([🌟⚠️💡⚡🔄✨🌑])/g,'\n\n$1').replace(/\n+(---)/g,'\n\n$1'):t;
const Typer=({text})=>{const tx=fmtAI(text);const[s,setS]=useState("");const[d,setD]=useState(false);useEffect(()=>{if(!tx)return;let i=0;setS("");setD(false);const iv=setInterval(()=>{i+=3;if(i>=tx.length){setS(tx);setD(true);clearInterval(iv)}else setS(tx.slice(0,i))},12);return()=>clearInterval(iv)},[tx]);return<div style={{fontSize:13,lineHeight:1.8,color:"#374151",whiteSpace:"pre-wrap"}}>{s}{!d&&<span style={{display:"inline-block",width:2,height:14,background:"#6366F1",marginLeft:1,animation:"hb .8s step-end infinite"}}/>}</div>};
const Spider=({scores,size=260})=>{const keys=Object.keys(scores);const vals=Object.values(scores);const n=keys.length;const cx=size/2,cy=size/2,r=size*.34;const pt=(i,v)=>{const a=Math.PI*2*i/n-Math.PI/2;return{x:cx+Math.cos(a)*v/10*r,y:cy+Math.sin(a)*v/10*r}};return<svg viewBox={`0 0 ${size} ${size}`} style={{width:"100%",maxWidth:280}}>{[2,4,6,8,10].map(l=><polygon key={l} points={keys.map((_,i)=>{const p=pt(i,l);return`${p.x},${p.y}`}).join(" ")} fill="none" stroke="#E5E7EB" strokeWidth=".6"/>)}{keys.map((_,i)=>{const p=pt(i,10);return<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#F3F4F6" strokeWidth=".4"/>})}<polygon points={keys.map((_,i)=>{const p=pt(i,vals[i]);return`${p.x},${p.y}`}).join(" ")} fill="rgba(99,102,241,.12)" stroke="#6366F1" strokeWidth="1.8"/>{keys.map((_,i)=>{const p=pt(i,vals[i]);return<circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#6366F1" stroke="#fff" strokeWidth="1.2"/>})}{keys.map((k,i)=>{const p=pt(i,12.2);const sh=k.length>12?k.slice(0,10)+"…":k;return<text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" style={{fontSize:"5.2px",fill:"#6B7280",fontWeight:500}}>{sh}</text>})}</svg>};
const Card=({children,style={}})=><div style={{background:"#fff",borderRadius:14,padding:"16px 18px",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,.04)",border:"1px solid #F1F5F9",...style}}>{children}</div>;
const Btn=({children,ok=true,onClick,style={}})=><button onClick={ok?onClick:undefined} style={{padding:"12px 20px",fontSize:14,fontWeight:700,background:ok?"linear-gradient(135deg,#4338CA,#6D28D9)":"#E2E8F0",color:ok?"#fff":"#94A3B8",border:"none",borderRadius:10,cursor:ok?"pointer":"not-allowed",width:"100%",boxShadow:ok?"0 4px 14px rgba(79,70,229,.2)":"none",...style}}>{children}</button>;

// ── Identity Snapshot Card (WHO / WHAT / WHEN) ──
const IdentitySnapshotCard=({data})=>{
  if(!data||!data.powerTitle)return null;
  const {powerTitle,who,what,when}=data;
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
        <div style={{background:"#EEF2FF",borderRadius:8,padding:"8px 10px",borderLeft:"3px solid #6366F1"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:2}}>Hidden Power (พลังแฝงที่รอปลดล็อก)</div>
          <div style={{fontSize:12,lineHeight:1.7,color:"#1E293B",fontWeight:500}}>{who?.hiddenPower}</div>
        </div>
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
  const[user,setUser]=useState(null);const[loginModal,setLoginModal]=useState(false);const[pendingPlan,setPendingPlan]=useState(null);
  const[authMode,setAuthMode]=useState("login");const[authErr,setAuthErr]=useState("");const[authLoading,setAuthLoading]=useState(false);
  const authEmailRef=useRef(null);const authPwRef=useRef(null);
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
          setUser(session.user);setEmail(session.user.email||"");
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
            setUser(sess.user);setEmail(sess.user.email||"");setLoginModal(false);
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
          if(ev==="SIGNED_OUT"){setUser(null)}
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
- คะแนนเด่นสุด: ${so.slice(0,3).map(([k,v2])=>`${k}(${v2.toFixed(1)})`).join(",")}
- จุดต้องพัฒนา: ${so.slice(-2).map(([k,v2])=>`${k}(${v2.toFixed(1)})`).join(",")}
- พรสวรรค์พื้นดวง: ${Object.entries(v).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v2])=>`${k}(${v2.toFixed(1)})`).join(",")}
- ทศาปัจจุบัน: ${curD.p}-${curAD.p} (${curD.theme}) อันตรทศาสิ้นสุด ${fracToThaiMY(curAD.endYear)}
ตอบ JSON เดียว ไม่มี backtick ไม่มีข้อความอื่น ใช้ภาษาที่คนทั่วไปเข้าใจได้ ไม่ใช้คำยาก อธิบายคำศัพท์ที่ซับซ้อนด้วยวงเล็บ:
{"powerTitle":"[ชื่อ archetype เป็นภาษาอังกฤษ 4-6 คำ สะท้อน ${mbti}+ดาว${domP.planet}]","who":{"mbtiLabel":"${mbti} + พลังดาว${domP.planet} (${domP.en})","mbtiCore":"${mbti} – [อธิบายบุคลิก MBTI นี้ 1 ประโยค ใช้ภาษาง่าย เช่น 'ผู้นำที่มองเห็นภาพใหญ่']","vedicSoul":"${domP.planet} Energy (${domP.en}) – [อธิบายพลังดาวนี้ 1-2 ประโยค ว่าส่งคุณสมบัติอะไรพิเศษให้เหนือกว่า ${mbti} ทั่วไป]","hiddenPower":"[The XYZ ชื่อภาษาอังกฤษ] – [อธิบายพลังแฝงที่จะทำงานได้ดีที่สุดเมื่อไหร่ 1 ประโยค]"},"what":{"skillTitle":"[ชื่อทักษะหลักที่ทำเงินได้ ภาษาอังกฤษ 3-5 คำ]","skillHighlight":"[ทักษะเด่น] – [อธิบาย 1 ประโยค ว่ามีมูลค่าอย่างไรในตลาด]","marketValue":"Top X% (มีคน 1 ใน X คน ที่เก่งเรื่องนี้) – [อธิบาย 1 ประโยค ว่าทักษะนี้หายาก และรายได้สูงกว่าตลาดกี่เท่า เช่น 'มีคน 1 ใน 10 ที่ทำได้ รายได้สูงกว่าคนทั่วไป 2-3 เท่า']","moneyMaker":"[อธิบาย 1-2 ประโยค ว่าคุณทำเงินได้จากอะไร ไม่ใช่จากการลงมือทำเอง แต่จากอะไร]","gapToClose":"[จุดที่ต้องพัฒนาตาม ${so.slice(-2).map(([k])=>k).join("+")}] – [อธิบาย 1-2 ประโยค อบอุ่น ไม่ตำหนิ]"},"when":{"periodLabel":"${curD.p}-${curAD.p} – [theme 2-3 คำ]","statusLabel":"[พร้อมลงมือ/ช่วงสะสมพลัง/ช่วงระวัง ขึ้นกับ ${curD.p}]","statusColor":"${statusColor}","currentDesc":"[อธิบาย 1-2 ประโยค ว่าตอนนี้อยู่ในช่วงอะไร เพราะดาว${curD.p} ส่งพลังอะไร]","goldenWindow":"${gwStr}","goldenDesc":"[อธิบาย 1 ประโยค ว่า golden window คืออะไร ดาวอะไรมาหนุน]","actionPlan":"[1-2 ประโยค บอกว่าควรทำอะไร ในช่วง golden window]","warning":"[1 ประโยค เตือนระวังช่วงไหน ดาวอะไร ผลเป็นอย่างไร]"}}`,`idv4_${nn}`);r=pJ(t)}
    if(type==="core"){const cScores={"Cognitive":s["Cognitive Processing"],"Emotional":s["Emotional Regulation"],"Identity":s["Identity Stability"],"Shadow":s["Shadow Pattern"],"Growth":s["Growth Orientation"]};const shadowLow=s["Shadow Pattern"]<5;r=await GPT.call(`วิเคราะห์ 5 ด้านหลักของ"${nn}" (พื้นดวง→ตอนนี้):\n🧠 Cognitive(พุธ): ${v["Cognitive Processing"]?.toFixed(1)}→${s["Cognitive Processing"]?.toFixed(1)}\n🌊 Emotional(จันทร์): ${v["Emotional Regulation"]?.toFixed(1)}→${s["Emotional Regulation"]?.toFixed(1)}\n⚓ Identity(อาทิตย์+เสาร์): ${v["Identity Stability"]?.toFixed(1)}→${s["Identity Stability"]?.toFixed(1)}\n🌑 Shadow(ราหู/เกตุ): ${v["Shadow Pattern"]?.toFixed(1)}→${s["Shadow Pattern"]?.toFixed(1)}\n🌱 Growth(พฤหัส): ${v["Growth Orientation"]?.toFixed(1)}→${s["Growth Orientation"]?.toFixed(1)}\n\nเขียนแต่ละด้าน 1-2 ประโยค ใช้ภาษาที่ชี้คุณสมบัติชัดเจน (เช่น "ประมวลผลแม่นยำ" "เป้าหมายชัดเจน") ไม่ใช้ "ส่งพลัง"\nถ้าคะแนน<5 ให้เตือนว่าต้องระวังอะไร พร้อมบอกว่า "Shadow/12D Analysis จะช่วยคลี่คลายได้ 🔓"\nถ้าคะแนน≥7 ให้ชมและชี้ว่าใช้ประโยชน์อะไรได้บ้าง\nห้าม **text** ไม่ต้องมีหัวข้อซ้ำ`,`corev2_${nn}`)}
    if(type==="12d")r=await GPT.call(`ข้อมูล12มิติของ"${nn}"(ศักยภาพพื้นดวง|คะแนนผลการทดสอบ):\n${Object.entries(s).map(([k,sv])=>`${k}: ${v[k]?.toFixed(1)} | ${sv.toFixed(1)}`).join("\n")}\n\nเขียนบทวิเคราะห์ตามรูปแบบนี้เป๊ะๆ (แทนที่วงเล็บด้วยข้อมูลจริง ห้าม **text** ใส่บรรทัดว่างระหว่างแต่ละข้อ):\n---\nบทวิเคราะห์ศักยภาพรายบุคคล: Human System Intelligence\n\nจากการวิเคราะห์เปรียบเทียบระหว่าง "ศักยภาพพื้นดวง (Vedic Potential)" และ "คะแนนผลการทดสอบ (Actual Assessment)" ผ่าน 12 มิติชี้วัด นี่คือข้อมูลเชิงลึกของคุณครับ:\n\n🌟 มิติที่เป็นจุดแข็ง (Core Strengths)\n\n1. [มิติคะแนนรวมสูงสุด] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวเด่น: [ชื่อดาวไทย] ([English]) [อุจจ์/ปกติ/นิจ]\n   * วิเคราะห์: [2-3 ประโยค อ้างคะแนน บอกจุดแข็ง ฮีลใจ]\n\n2. [มิติอันดับ2] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวเด่น: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n3. [มิติอันดับ3] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวเด่น: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n⚠️ มิติที่ควรเฝ้าระวังและพัฒนา (Strategic Areas)\n\n1. [มิติคะแนนต่ำสุด] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวที่ส่งผล: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค ให้กำลังใจ แนะทางพัฒนา]\n\n2. [มิติอันดับ2] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวที่ส่งผล: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n3. [มิติอันดับ3] (ศักยภาพพื้นดวง [X.X] | คะแนนผลการทดสอบ [X.X])\n   * ดาวที่ส่งผล: [ดาว]\n   * วิเคราะห์: [2-3 ประโยค]\n\n💡 บทสรุปกลยุทธ์ (Key Insight)\n"[1-2 ประโยคสรุปการใช้จุดแข็งรับมือจุดพัฒนา]"\n---`,`f12v2_${nn}`);
    if(type==="shadow")r=await GPT.call(`ข้อมูลของ"${nn}": Shadow Pattern: ศักยภาพพื้นดวง ${v["Shadow Pattern"]?.toFixed(1)} | คะแนนผลการทดสอบ ${s["Shadow Pattern"]?.toFixed(1)}, Stress Response: ${s["Stress Response"]?.toFixed(1)}, Boundary System: ${s["Boundary System"]?.toFixed(1)}\n\nเขียนตามรูปแบบนี้เป๊ะๆ (แทนที่วงเล็บด้วยข้อมูลจริง ห้าม **text** ใส่บรรทัดว่างระหว่างหัวข้อ):\n---\nShadow Analysis\n\n🌑 Shadow Score: ${s["Shadow Pattern"]?.toFixed(1)}/10 (คะแนนผลการทดสอบ) | ${v["Shadow Pattern"]?.toFixed(1)}/10 (ศักยภาพพื้นดวง)\n\n[2-3 ประโยคบริบท: ราหู/เกตุ = บทเรียน ไม่ใช่สิ่งเลวร้าย คะแนนสูงกว่า/ต่ำกว่าพื้นดวงแปลว่าอะไร ฮีลใจ]\n\n⚡ Trigger\n\n[1 ย่อหน้า อธิบายสิ่งที่กระตุ้น Shadow อ้างดาวที่เกี่ยวข้อง ใช้ภาษาอบอุ่น]\n\n🔄 Pattern\n\n[1 ย่อหน้า อธิบายรูปแบบที่เกิดซ้ำ บอกเบาๆ ไม่ตำหนิ]\n\n💡 วิธีแก้ตามดาว\n\n   1. [ชื่อวิธี (ดาว)]: [1-2 ประโยค ทำได้จริง]\n   2. [ชื่อวิธี (ดาว)]: [1-2 ประโยค]\n   3. [ชื่อวิธี (ดาว)]: [1-2 ประโยค]\n   4. [ชื่อวิธี (ดาว)]: [1-2 ประโยค]\n---`,`shv2_${nn}`);
    if(type==="principle"){const domP=calcDomPlanet(v);const mbti=calcMBTI(s);r=await GPT.call(`เขียนหลักการใช้ชีวิต (Life Principle) ของ"${nn}" เป็น 1 ประโยคที่กระชับ ลึก จำได้ทันที ห้ามใช้ * หรือ ** เด็ดขาด ไม่ต้องมี header\nดาวเด่น: ${domP.icon}${domP.planet}(${domP.en}) — ${domP.power}\nMBTI: ${mbti}\nดาวแข็งพื้นดวง (top 2): ${Object.entries(v).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k,val])=>`${k}(${val.toFixed(1)})`).join(",")}\nด้านท้าทาย (bottom 2): ${Object.entries(s).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k,val])=>`${k}(${val.toFixed(1)})`).join(",")}\n\nประโยคต้องครอบคลุม: ช่วงสวยงามที่สุดในชีวิตเกิดขึ้นเมื่อใด / ช่วงดำมืดที่สุดรู้สึกอย่างไร / ทุกครั้งที่ผ่านได้เพราะอะไร และพลังดาว${domP.planet}ช่วยอย่างไร\nตอบเป็นข้อความธรรมดา 1 ประโยคเดียว ไม่ขึ้นบรรทัดใหม่ ไม่มีหมายเลข`,`pr_${nn}_${domP.planet}`)}
    if(type==="weekly"){const t=await GPT.call(`เขียนเหมือนพี่ที่ปรึกษาที่ห่วงใย อบอุ่น ฮีลใจ\nคำแนะนำสัปดาห์นี้สำหรับ"${nn}":\nเด่น:${so.slice(0,3).map(([k])=>k).join(",")} ต้องดูแลเพิ่ม:${so.slice(-2).map(([k])=>k).join(",")}\nตอบJSONไม่มีbacktick:{"do":["สิ่งดีๆที่ควรทำ1(ให้กำลังใจ)","ควรทำ2(อบอุ่น)","ควรทำ3(เป็นกันเอง)"],"dont":["สิ่งที่ควรระวัง1(พูดเบาๆไม่ตำหนิ)","ควรระวัง2(แนะทางออก)","ควรระวัง3(ห่วงใย)"]}`,`wk_${nn}`);r=pJ(t)}
    // Energy: show smart fallback FIRST then try GPT
    if(type==="energy"){try{const tr=gen7Day(bd);const MOODS=["🌟 สดใส","😊 สงบ","🔥 กระตือรือร้น","🧠 คิดวิเคราะห์","📚 ปัญญาเปิด","💎 ผ่อนคลาย","⚙️ ต้องใช้วินัย"];
      const today=new Date();
      const smartFB=tr.map((d,i)=>{const dt=new Date(today);dt.setDate(dt.getDate()+i);const dateStr=`${dt.getDate()}/${dt.getMonth()+1}`;const dayLabel=`${d.dn} ${dateStr}`;return{day:dayLabel,date:dateStr,energy:d.ce,mood:d.ce>75?MOODS[0]:d.ce>65?MOODS[1]:d.ce>55?MOODS[3]:MOODS[6],tip:`เจ้าวัน${d.dl.icon}${d.dl.lord} ${d.dl.q} จันทร์จรราศี${d.moonR}(${d.ma.r})`,transit:`เจ้าวัน${d.dl.icon}${d.dl.lord} + จันทร์จรราศี${d.moonR} + อังคารจรราศี${d.marsR}`,goodFor:d.dl.gf}});
      setAi(p=>({...p,energy:smartFB}));setAiL(p=>({...p,energy:false}));clearTimeout(safetyTm);
      // Try GPT upgrade in background (non-blocking) — delayed 4s so identity/core get queue priority
      const dateLabels=tr.map((d,i)=>{const dt=new Date(today);dt.setDate(dt.getDate()+i);return`${d.dn} ${dt.getDate()}/${dt.getMonth()+1}`});
      setTimeout(()=>GPT.call(`นักจิตวิทยาอบอุ่นฮีลใจ\nพลังงาน7วัน"${nn}"ราศี${tr[0].nmR}\n${tr.map((d,i)=>`${dateLabels[i]}:${d.dl.icon}${d.dl.lord} จ${d.moonR}(${d.ma.r}) E=${d.ce}%`).join("\n")}\nตอบJSON7obj ใช้วันที่จริงที่ให้:[{"day":"${dateLabels[0]}","date":"${tr[0].date}","energy":30-95,"mood":"emoji+2คำ","tip":"สั้นอ้างดาว+ให้กำลังใจ","transit":"ดาว","goodFor":"สั้น"}]`,`en_${nn}_${new Date().toISOString().slice(0,10)}`,500).then(t=>{const p=pJ(t);if(p&&Array.isArray(p)&&p.length===7){setAi(prev=>({...prev,energy:p.map((d,i)=>({...d,day:d.day||dateLabels[i],date:d.date||tr[i]?.date,energy:d.energy<15?Math.round(d.energy*10):d.energy}))}))}}) ,4000);
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
      setTimeout(()=>GPT.call(`นักจิตวิทยาแนะแนวอาชีพอบอุ่นฮีลใจ\nจับคู่อาชีพ"${nn}"เด่น:${so.slice(0,4).map(([k,v2])=>`${k}=${v2.toFixed(1)}`).join(",")} ต้องดูแลเพิ่ม:${so.slice(-3).map(([k,v2])=>`${k}=${v2.toFixed(1)}`).join(",")}\nแนะนำ3อาชีพ match=เปอร์เซ็นต์จับคู่(เต็ม100 อันแรกสูงสุด88-95 อันสอง80-87 อันสาม73-79) ตอบJSON:[{"title":"EN","titleTH":"ไทย","match":88,"dims":"3มิติ","reason":"2ประโยค(ฮีลใจ)"}]`,`job_${nn}`,500).then(t=>{const p=pJ(t);if(p&&Array.isArray(p)&&p.length>=3){const normalized=p.map((j,i)=>({...j,match:j.match<=10?Math.round(j.match*10):j.match<50?Math.round(j.match+40):j.match}));setAi(prev=>({...prev,job:normalized}))}}),4000);
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
    if(!r&&type!=="energy"&&type!=="job"&&type!=="timeline"){r=GPT.fb(`${type==="identity"?"id":type==="core"?"core":type==="12d"?"f12":type==="shadow"?"sh":type==="weekly"?"wk":"x"}_${nn}`);if(type==="weekly"||type==="identity")r=pJ(r)}
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
      // Check if we need to go to Stripe
      const wp=localStorage.getItem("hss_want_plan");
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

  const activatePlan=(p)=>{setPlan(p);ST.set("plan",p);savePlan(p);const fs=PLANS[p].f;if(fs.includes("energy"))loadAI("energy",scores,vedic,nick,bday);if(fs.includes("job"))loadAI("job",scores,vedic,nick,bday);if(fs.includes("timeline"))loadAI("timeline",scores,vedic,nick,bday);if(fs.includes("12d")&&!ai["12d"])loadAI("12d",scores,vedic,nick,bday);if(fs.includes("shadow")&&!ai.shadow)loadAI("shadow",scores,vedic,nick,bday);if(fs.includes("weekly")&&!ai.weekly)loadAI("weekly",scores,vedic,nick,bday)};

  const exportPDF=()=>{if(!scores)return;const so=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    // Spider chart SVG for PDF
    const keys=Object.keys(scores);const vals=Object.values(scores);const n=keys.length;const sz=300,cx=150,cy=150,rad=100;
    const pt=(i,v)=>{const a=Math.PI*2*i/n-Math.PI/2;return{x:cx+Math.cos(a)*v/10*rad,y:cy+Math.sin(a)*v/10*rad}};
    const spiderSVG=`<svg viewBox="0 0 ${sz} ${sz}" style="width:280px;margin:10px auto;display:block">${[2,4,6,8,10].map(l=>`<polygon points="${keys.map((_,i)=>{const p=pt(i,l);return`${p.x},${p.y}`}).join(" ")}" fill="none" stroke="#E5E7EB" stroke-width=".6"/>`).join("")}<polygon points="${keys.map((_,i)=>{const p=pt(i,vals[i]);return`${p.x},${p.y}`}).join(" ")}" fill="rgba(99,102,241,.12)" stroke="#6366F1" stroke-width="1.8"/>${keys.map((_,i)=>{const p=pt(i,vals[i]);return`<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="#6366F1" stroke="#fff" stroke-width="1.2"/>`}).join("")}${keys.map((k,i)=>{const p=pt(i,12.5);const sh=k.length>14?k.slice(0,12)+"…":k;return`<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" style="font-size:5.5px;fill:#6B7280;font-weight:500">${sh}</text>`}).join("")}</svg>`;
    // Weekly
    const wk=ai.weekly&&typeof ai.weekly==="object"?`<h2>📋 Do & Don't รายสัปดาห์</h2><div class="g"><div class="card" style="background:#ECFDF5"><b style="color:#059669">✅ ควรทำ</b>${(ai.weekly.do||[]).map(t=>`<p>• ${t}</p>`).join("")}</div><div class="card" style="background:#FFF1F2"><b style="color:#EF4444">❌ เลี่ยง</b>${(ai.weekly.dont||[]).map(t=>`<p>• ${t}</p>`).join("")}</div></div>`:"";
    // Energy with full details
    const en=ai.energy&&Array.isArray(ai.energy)?`<h2>🌙 7-Day Energy</h2>${ai.energy.map(d=>`<div class="card" style="margin:4px 0"><div style="display:flex;justify-content:space-between;margin-bottom:2px"><b>${d.day} ${d.date||""}</b><span>${d.mood||""}</span></div>${d.transit?`<div style="font-size:10px;color:#7C3AED">🪐 ${d.transit}</div>`:""}${d.goodFor?`<div style="font-size:10px;color:#059669">✅ ${d.goodFor}</div>`:""}${d.tip?`<div style="font-size:10px;color:#374151">💡 ${d.tip}</div>`:""}</div>`).join("")}`:"";
    // Job
    const jb=ai.job&&Array.isArray(ai.job)?`<h2>💼 Job Matching</h2>${ai.job.map(j=>`<div class="card"><b>${j.titleTH||j.title} (${j.match}%)</b><div style="font-size:11px;color:#64748B">${j.dims||""}</div><p>${j.reason}</p></div>`).join("")}`:"";
    // Dasha/Life Phase
    let dashaHTML="";try{let pdfBday=bday;if(!pdfBday||pdfBday==="--"||pdfBday.length<8){const p=ST.get("profile");if(p?.bday&&p.bday!=="--")pdfBday=p.bday}
    const dashaPhases=calcDasha(pdfBday);const currentDasha=dashaPhases.find(d=>d.isCurrent);
    dashaHTML=dashaPhases.length>0?`<h2>🗺 Life Phase Map (Vedic Dasha)</h2>${currentDasha?`<div class="card" style="background:linear-gradient(135deg,#EEF2FF,#F5F3FF);border:2px solid #6366F1"><b style="color:#4338CA;font-size:14px">${currentDasha.icon} ตอนนี้คุณอยู่ในช่วง: ${currentDasha.theme}</b><div style="font-size:11px;margin-top:4px">มหาทศา${currentDasha.p} (อายุ ${currentDasha.startAge}–${currentDasha.endAge} ปี | ${currentDasha.startYear}–${currentDasha.endYear})</div><div style="font-size:11px;margin-top:2px;color:#374151">${currentDasha.desc}</div><div style="font-size:11px;color:#059669;margin-top:2px">🎯 โฟกัส: ${currentDasha.focus}</div><div style="font-size:11px;color:#374151;margin-top:4px;background:#FFF7ED;padding:6px 8px;border-radius:6px">${currentDasha.cheer}</div><div style="font-size:10px;color:#B45309;margin-top:4px;background:#FFFBEB;padding:4px 8px;border-radius:6px">${currentDasha.warn}</div></div>`:""}${dashaPhases.filter(d=>!d.isPast||d.isCurrent).slice(0,6).map(d=>`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #F1F5F9;${d.isCurrent?"font-weight:700;color:#4338CA":"color:#374151"}"><span style="font-size:14px">${d.icon}</span><span style="font-size:11px;flex:1">${d.p} — ${d.theme}</span><span style="font-size:10px;color:#94A3B8">${d.startAge}–${d.endAge} ปี</span></div>`).join("")}`:""}catch(e){dashaHTML=""}
    // Build full PDF
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>HSS Report - ${nick}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Noto Sans Thai',sans-serif;background:#F8FAFC;color:#1E293B;font-size:13px;line-height:1.7}.page{max-width:680px;margin:0 auto;padding:32px 24px 60px}.header{background:linear-gradient(135deg,#4338CA 0%,#6D28D9 100%);color:#fff;border-radius:16px;padding:24px 28px;margin-bottom:24px}.header h1{font-size:22px;font-weight:800;margin-bottom:4px}.header p{font-size:12px;opacity:.8;margin:0}.header-badge{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);border-radius:8px;padding:3px 12px;font-size:11px;font-weight:700;margin-top:10px}h2{font-size:14px;font-weight:700;color:#4338CA;margin:20px 0 8px;padding-bottom:6px;border-bottom:2px solid #EEF2FF}.bar-row{margin:6px 0 10px}.bar-label{display:flex;justify-content:space-between;margin-bottom:3px;font-size:12px}.bar-bg{height:7px;background:#E2E8F0;border-radius:4px;overflow:hidden}.bar-fill{height:100%;border-radius:4px}.card{background:#fff;border-radius:12px;padding:14px 16px;margin:6px 0;border:1px solid #E2E8F0;box-shadow:0 1px 3px rgba(0,0,0,.05)}.g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700}p{margin:3px 0}.footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8}@media print{body{background:#fff}.header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="page"><div class="header"><h1>🔮 ${nick}</h1><p>Human System Studio · Vedic Astrology + Psychology · ${new Date().toLocaleDateString("th-TH")}</p><span class="header-badge">✦ Personal AI Report</span></div>
${ai.identity?.powerTitle?`<h2>✦ Identity Snapshot</h2><div style="background:#F5F3FF;border-radius:10px;padding:14px 16px;margin-bottom:8px;text-align:center"><b style="color:#4338CA;font-size:15px">${ai.identity.powerTitle}</b></div><div style="margin-bottom:8px"><b style="color:#4338CA">1️⃣ WHO – พลังแฝงของคุณ</b><br/><small style="color:#6366F1">MBTI Core:</small> <span>${ai.identity.who?.mbtiCore||""}</span><br/><small style="color:#6366F1">Vedic Soul:</small> <span>${ai.identity.who?.vedicSoul||""}</span><br/><small style="color:#6366F1">Hidden Power:</small> <span>${ai.identity.who?.hiddenPower||""}</span></div><div style="margin-bottom:8px"><b style="color:#059669">2️⃣ WHAT – ทักษะทำเงิน</b><br/><b>${ai.identity.what?.skillTitle||""}</b><br/><small style="color:#059669">Skill:</small> ${ai.identity.what?.skillHighlight||""}<br/><small style="color:#059669">Market Value:</small> ${ai.identity.what?.marketValue||""}<br/><small style="color:#059669">Money Maker:</small> ${ai.identity.what?.moneyMaker||""}<br/><small style="color:#B45309">⚠️ Gap:</small> ${ai.identity.what?.gapToClose||""}</div><div><b style="color:#B45309">3️⃣ WHEN – เวลาของคุณ</b><br/><span>${ai.identity.when?.statusLabel||""}</span> | Golden Window: <b>${ai.identity.when?.goldenWindow||""}</b><br/>${ai.identity.when?.currentDesc||""}<br/>${ai.identity.when?.actionPlan||""}<br/><small style="color:#DC2626">⚠️ ${ai.identity.when?.warning||""}</small></div>`:""}
<h2>📊 12 Dimensions</h2>${spiderSVG}
${Object.entries(scores).map(([k,v])=>`<div class="bar-row"><div class="bar-label"><span>${DM[k]?.icon} ${k} <span style="font-size:10px;color:#94A3B8">(${DM[k]?.pl})</span></span><b style="color:${DM[k]?.c}">${v.toFixed(1)}</b></div><div class="bar-bg"><div class="bar-fill" style="width:${v*10}%;background:${DM[k]?.c}"></div></div></div>`).join("")}
<h2>💪 จุดแข็ง</h2><div class="g">${so.slice(0,4).map(([k,v])=>`<div class="card"><span class="tag" style="background:#ECFDF5;color:#059669">${v.toFixed(1)}</span> ${DM[k]?.icon} ${k}</div>`).join("")}</div>
<h2>⚠️ จุดพัฒนา</h2><div class="g">${so.slice(-4).map(([k,v])=>`<div class="card"><span class="tag" style="background:#FFF1F2;color:#EF4444">${v.toFixed(1)}</span> ${DM[k]?.icon} ${k}</div>`).join("")}</div>
${ai.core?`<h2>🏛 5 Core Analysis</h2><p style="white-space:pre-wrap">${ai.core}</p>`:""}
${ai["12d"]?`<h2>📐 12D Deep Analysis</h2><p style="white-space:pre-wrap">${ai["12d"]}</p>`:""}
${ai.shadow?`<h2>🌑 Shadow Analysis</h2><p style="white-space:pre-wrap">${ai.shadow}</p>`:""}
${ai.principle?`<h2>✨ Life Principle หลักการใช้ชีวิต</h2><p style="font-style:italic;font-size:15px;line-height:1.9;padding:14px 18px;background:linear-gradient(135deg,#1E1B4B,#312E81);color:#E0E7FF;border-radius:10px">${ai.principle}</p>`:""}
${wk} ${en} ${jb} ${dashaHTML}
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

  const shareProfile=async()=>{if(!scores||!nick)return;
    const W=1080,H=2100;
    const canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext("2d");
    await document.fonts.ready;
    // roundRect polyfill
    if(!ctx.roundRect)ctx.roundRect=function(x,y,w,h,r){const R=typeof r==="number"?r:r[0]||0;this.beginPath();this.moveTo(x+R,y);this.lineTo(x+w-R,y);this.arcTo(x+w,y,x+w,y+R,R);this.lineTo(x+w,y+h-R);this.arcTo(x+w,y+h,x+w-R,y+h,R);this.lineTo(x+R,y+h);this.arcTo(x,y+h,x,y+h-R,R);this.lineTo(x,y+R);this.arcTo(x,y,x+R,y,R);this.closePath()};
    const isFull=plan==="all"||plan==="deep";
    const so=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const top1=so[0];const bot1=so[so.length-1];
    const top3=so.slice(0,3);const bot3=so.slice(-3).reverse();
    const archetype=(ai?.identity?.powerTitle||ai?.identity?.split?.("\n")?.[0]||"The Strategic Visionary — ผู้มองเห็นภาพใหญ่").slice(0,50);
    const SHADOW_TIPS={"Shadow Pattern":"ลองฝึกสังเกตตัวเองเวลาเลี่ยงเรื่องสำคัญ","Stress Response":"ตั้งกฎ: เจอปัญหาให้เริ่มแก้ภายใน 24 ชม.","Boundary System":"ฝึกพูด 'ขอคิดก่อน' แทน 'ได้เลย'","Responsibility Load":"ทำ 'งานสำคัญที่สุด' เป็นอย่างแรกของวัน","Emotional Regulation":"ฝึก 'กฎ 5 วินาที' — นับ 1-5 ก่อนตอบสนอง","Energy Management":"พักจริงๆ 15 นาทีต่อวัน ไม่ดูมือถือ","Integration Level":"เลือก 1 เป้าหมายสำคัญที่สุด โฟกัสแค่นั้นก่อน"};
    const tip=SHADOW_TIPS[bot1[0]]||"ลองโฟกัสพัฒนาทีละนิด ทุกก้าวเล็กๆ สำคัญ";
    const STR_DESC={"Cognitive Processing":"คิดวิเคราะห์เก่ง สรุปประเด็นได้ชัด","Integration Level":"มองภาพรวมดี เชื่อมโยงสิ่งต่างๆ ได้เป็นระบบ","Growth Orientation":"เรียนรู้และพัฒนาตัวเองอย่างต่อเนื่อง","Energy Management":"บริหารพลังงานได้ดี รู้จักเติมเต็มและใช้ชาญฉลาด","Decision System":"ตัดสินใจอย่างมีหลักการ มองผลระยะยาว","Responsibility Load":"รับผิดชอบสูง เชื่อถือได้ ทำตามสัญญา","Motivation Driver":"มีแรงขับจากภายใน รู้ว่าทำเพื่ออะไร","Emotional Regulation":"ควบคุมอารมณ์ได้ดี ไม่ปล่อยให้อารมณ์นำทาง","Identity Stability":"รู้ตัวตน มั่นคงในหลักการ","Boundary System":"ขีดเส้นชัด รักษาพื้นที่ตัวเองได้ดี","Stress Response":"รับมือความกดดันได้ดี ฟื้นตัวเร็ว","Shadow Pattern":"รู้ทันจุดบอดของตัวเอง เปลี่ยนแปลงได้"};
    const SDW_DESC={"Shadow Pattern":"มีแนวโน้มเลี่ยงเรื่องที่ยาก ต้องฝึกเผชิญตรง","Emotional Regulation":"อาจตอบสนองเร็วเกินไปในบางสถานการณ์","Stress Response":"เมื่อกดดันมาก อาจรับมือได้ยากกว่าที่ควร","Boundary System":"บางครั้งรับงานมากเกินไป ยากที่จะปฏิเสธ","Energy Management":"พลังงานขึ้นลงบ้าง ต้องจัดการจังหวะพัก","Decision System":"บางครั้งลังเลนาน หรือตัดสินใจเร็วเกินไป","Responsibility Load":"บางครั้งแบกมากเกิน ต้องเรียนรู้วางบ้าง","Motivation Driver":"แรงบันดาลใจผันผวน ต้องหาแหล่งพลังที่มั่นคง","Identity Stability":"เป้าหมายยังไม่ชัดพอ ต้องทบทวนตัวตน","Integration Level":"ยังมองภาพรวมไม่ครบ ต้องฝึกเชื่อมโยง","Growth Orientation":"การพัฒนาตัวเองยังไม่สม่ำเสมอ","Cognitive Processing":"การวิเคราะห์บางครั้งซับซ้อนเกิน ต้องฝึกสรุป"};
    // Drawing helpers
    const fr=(x,y,w,h,r,fill)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()};
    const sr=(x,y,w,h,r,stroke,lw=2)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()};
    const tx=(s,x,y,font,color,align="left",mw)=>{ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;mw?ctx.fillText(s,x,y,mw):ctx.fillText(s,x,y)};
    // Word-wrap text, returns final y
    const wt=(text,x,y,maxW,lh,font,color)=>{ctx.font=font;ctx.fillStyle=color;ctx.textAlign="left";let line="",cy=y;const words=text.split(" ");for(const w of words){const test=line+(line?" ":"")+w;if(ctx.measureText(test).width>maxW&&line){ctx.fillText(line,x,cy);line=w;cy+=lh;}else line=test;}if(line)ctx.fillText(line,x,cy);return cy+lh};
    const linGrad=(x0,y0,x1,y1,stops)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);stops.forEach(([t,c])=>g.addColorStop(t,c));return g};
    const PAD=50;
    // ── BACKGROUND ──
    ctx.fillStyle="#EEEEFF";ctx.fillRect(0,0,W,H);
    let y=0;
    // ── HEADER ──
    const HH=isFull?400:440;
    fr(0,0,W,HH,0,linGrad(0,0,W,HH,[[0,"#6D28D9"],[1,"#5B21B6"]]));
    {const rg=ctx.createRadialGradient(W+40,-80,0,W+40,-80,520);rg.addColorStop(0,"rgba(255,255,255,0.08)");rg.addColorStop(1,"transparent");fr(0,0,W,HH,0,rg);}
    // Logo box
    fr(PAD,60,68,68,16,"rgba(255,255,255,0.2)");
    tx("✦",PAD+34,112,"500 36px sans-serif","#fff","center");
    tx("HUMAN SYSTEM STUDIO",PAD+84,100,"800 28px 'Noto Sans Thai',sans-serif","rgba(255,255,255,0.85)");
    if(isFull){ctx.font="800 24px 'Noto Sans Thai',sans-serif";const bw=ctx.measureText("ALL ACCESS").width+44;fr(W-PAD-bw,60,bw,48,24,"rgba(255,255,255,0.2)");tx("ALL ACCESS",W-PAD-bw/2,93,"800 24px 'Noto Sans Thai',sans-serif","#fff","center");}
    // Name
    const nSz=nick.length>8?80:100;tx(nick,PAD,HH-220,"900 "+nSz+"px 'Noto Sans Thai',sans-serif","#fff");
    // Subtitle
    tx("รู้จักตัวเองอย่างแม่นยำด้วย AI + โหราศาสตร์พระเวท + จิตวิทยา 36 ข้อ",PAD,HH-148,"400 28px 'Noto Sans Thai',sans-serif","rgba(255,255,255,0.65)","left",W-PAD*2);
    // Archetype badge
    ctx.font="700 30px 'Noto Sans Thai',sans-serif";const arcStr="🏛 "+archetype;const arcW=Math.min(ctx.measureText(arcStr).width+56,W-PAD*2);
    fr(PAD,HH-120,arcW,66,33,"rgba(255,255,255,0.15)");tx(arcStr,PAD+28,HH-120+44,"700 30px 'Noto Sans Thai',sans-serif","#fff","left",arcW-36);
    y=HH+20;
    if(!isFull){
      // ── FREE CARD ──
      // Bar section (white card)
      const barsH=720;fr(PAD,y,W-PAD*2,barsH,28,"#fff");
      let by=y+40;
      // Section label
      fr(PAD+28,by,14,14,7,"#6D28D9");tx("5 CORE DIMENSIONS",PAD+50,by+12,"800 26px 'Noto Sans Thai',sans-serif","#6D28D9");by+=48;
      // Strength rows
      tx("💪 จุดแข็ง — STRENGTH",PAD+24,by+22,"800 30px 'Noto Sans Thai',sans-serif","#059669");by+=52;
      const bx=PAD+24,bW=W-PAD*2-48,nameX=bx+58,scoreX=bx+bW-8;
      top3.forEach(([k,v])=>{tx(DM[k]?.icon||"✦",bx,by+42,"500 44px sans-serif","#1E293B");tx(k,nameX,by+28,"600 30px 'Noto Sans Thai',sans-serif","#1E293B","left",scoreX-nameX-90);tx(v.toFixed(1),scoreX,by+28,"800 32px 'Noto Sans Thai',sans-serif","#059669","right");fr(nameX,by+46,scoreX-nameX,16,8,"#E5E7EB");const g=linGrad(nameX,0,nameX+(scoreX-nameX)*v/10,0,[[0,"#10B981"],[1,"#34D399"]]);fr(nameX,by+46,(scoreX-nameX)*v/10,16,8,g);by+=104;});
      // Shadow rows
      tx("🌑 Shadow Work",PAD+24,by+22,"800 30px 'Noto Sans Thai',sans-serif","#DC2626");by+=52;
      so.slice(-2).reverse().forEach(([k,v])=>{tx(DM[k]?.icon||"✦",bx,by+42,"500 44px sans-serif","#1E293B");tx(k,nameX,by+28,"600 30px 'Noto Sans Thai',sans-serif","#1E293B","left",scoreX-nameX-90);tx(v.toFixed(1),scoreX,by+28,"800 32px 'Noto Sans Thai',sans-serif","#DC2626","right");fr(nameX,by+46,scoreX-nameX,16,8,"#E5E7EB");const g=linGrad(nameX,0,nameX+(scoreX-nameX)*v/10,0,[[0,"#EF4444"],[1,"#F87171"]]);fr(nameX,by+46,(scoreX-nameX)*v/10,16,8,g);by+=104;});
      y+=barsH+20;
      // Insight cards (2-col)
      const cW=(W-PAD*2-28)/2,cH=310;
      fr(PAD,y,cW,cH,20,"#fff");sr(PAD,y,cW,cH,20,"#D1FAE5",2);
      tx("💪 เด่นด้าน",PAD+22,y+44,"800 26px 'Noto Sans Thai',sans-serif","#059669");
      tx((DM[top1[0]]?.icon||"")+"  "+top1[0],PAD+22,y+88,"800 30px 'Noto Sans Thai',sans-serif","#1E293B","left",cW-44);
      tx("— "+top1[1].toFixed(1),PAD+22,y+128,"800 38px 'Noto Sans Thai',sans-serif","#059669");
      wt(STR_DESC[top1[0]]||"จุดแข็งที่โดดเด่น",PAD+22,y+174,cW-44,40,"400 25px 'Noto Sans Thai',sans-serif","#374151");
      fr(PAD+22,y+cH-54,cW-44,42,10,"#ECFDF5");tx("💡 ยิ่งใช้ยิ่งแกร่ง",PAD+38,y+cH-24,"400 24px 'Noto Sans Thai',sans-serif","#059669");
      const cx2=PAD+cW+28;
      fr(cx2,y,cW,cH,20,"#fff");sr(cx2,y,cW,cH,20,"#FEE2E2",2);
      tx("⚠️ ต้องระวัง",cx2+22,y+44,"800 26px 'Noto Sans Thai',sans-serif","#DC2626");
      tx((DM[bot1[0]]?.icon||"")+"  "+bot1[0],cx2+22,y+88,"800 30px 'Noto Sans Thai',sans-serif","#1E293B","left",cW-44);
      tx("— "+bot1[1].toFixed(1),cx2+22,y+128,"800 38px 'Noto Sans Thai',sans-serif","#DC2626");
      wt(SDW_DESC[bot1[0]]||"ต้องพัฒนาเพิ่มเติม",cx2+22,y+174,cW-44,40,"400 25px 'Noto Sans Thai',sans-serif","#374151");
      fr(cx2+22,y+cH-54,cW-44,42,10,"#FFF1F2");tx("💡 "+tip.slice(0,26),cx2+38,y+cH-24,"400 24px 'Noto Sans Thai',sans-serif","#DC2626","left",cW-60);
      y+=cH+20;
      // Upgrade CTA box
      const upH=190;fr(PAD,y,W-PAD*2,upH,24,"#fff");
      tx("ค้นพบตัวตนที่ลึกซึ้งยิ่งขึ้น เช็คครบ 12 ด้าน",PAD+30,y+52,"700 30px 'Noto Sans Thai',sans-serif","#1E293B","left",W-PAD*2-60);
      tx("AI วิเคราะห์เชิงลึก + Radar Chart + คำแนะนำเฉพาะคุณ",PAD+30,y+96,"400 26px 'Noto Sans Thai',sans-serif","#64748B","left",W-PAD*2-60);
      const btnW=(W-PAD*2-90)/2;
      fr(PAD+30,y+122,btnW,56,12,linGrad(PAD+30,0,PAD+30+btnW,0,[[0,"#F59E0B"],[1,"#D97706"]]));tx("Deep ฿49",PAD+30+btnW/2,y+158,"800 28px 'Noto Sans Thai',sans-serif","#fff","center");
      fr(PAD+30+btnW+30,y+122,btnW,56,12,linGrad(PAD+30+btnW+30,0,PAD+60+btnW*2,0,[[0,"#6D28D9"],[1,"#5B21B6"]]));tx("Full ฿99",PAD+30+btnW+30+btnW/2,y+158,"800 28px 'Noto Sans Thai',sans-serif","#fff","center");
      y+=upH+16;
    }else{
      // ── FULL CARD ──
      // Radar section
      const radH=480;fr(PAD,y,W-PAD*2,radH,28,"#fff");
      const keys=Object.keys(scores),vals=Object.values(scores),n=keys.length;
      const rcx=W/2,rcy=y+radH/2,rrad=170;
      const rpt=(i,v)=>{const a=Math.PI*2*i/n-Math.PI/2;return[rcx+Math.cos(a)*v/10*rrad,rcy+Math.sin(a)*v/10*rrad]};
      // Grid
      [2.5,5,7.5,10].forEach(l=>{ctx.beginPath();for(let i=0;i<n;i++){const[px,py]=rpt(i,l);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)}ctx.closePath();ctx.strokeStyle=l===10?"#D1D5DB":"#E5E7EB";ctx.lineWidth=l===10?2:1;ctx.stroke();});
      for(let i=0;i<n;i++){const[px,py]=rpt(i,10);ctx.beginPath();ctx.moveTo(rcx,rcy);ctx.lineTo(px,py);ctx.strokeStyle="#E5E7EB";ctx.lineWidth=1;ctx.stroke();}
      // Polygon
      ctx.beginPath();keys.forEach((k,i)=>{const[px,py]=rpt(i,vals[i]);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)});ctx.closePath();ctx.fillStyle="rgba(124,58,237,0.12)";ctx.fill();ctx.strokeStyle="#7C3AED";ctx.lineWidth=3;ctx.stroke();
      // Dots
      keys.forEach((k,i)=>{const[px,py]=rpt(i,vals[i]);ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fillStyle="#7C3AED";ctx.fill();});
      // Labels
      keys.forEach((k,i)=>{const[lx,ly]=rpt(i,11.5);const align=lx<rcx-20?"right":lx>rcx+20?"left":"center";const label=(DM[k]?.icon||"")+" "+(k.length>13?k.slice(0,12)+"…":k)+" "+vals[i].toFixed(1);tx(label,lx,ly+4,"700 20px 'Noto Sans Thai',sans-serif","#374151",align);});
      y+=radH+16;
      // Strength/Shadow 2-col
      const cW=(W-PAD*2-28)/2,lblH=56,itemH=174,nItems=3,colTotalH=lblH+itemH*nItems+16;
      fr(PAD,y,W-PAD*2,colTotalH,28,"#EEEEFF");
      fr(PAD,y,cW,lblH,0,"#ECFDF5");tx("💪 STRENGTH — จุดแข็ง",PAD+22,y+38,"800 26px 'Noto Sans Thai',sans-serif","#059669");
      fr(PAD+cW+28,y,cW,lblH,0,"#FFF1F2");tx("🌑 SHADOW — ต้องพัฒนา",PAD+cW+28+22,y+38,"800 26px 'Noto Sans Thai',sans-serif","#DC2626");
      let iy=y+lblH+8;
      top3.forEach(([k,v])=>{fr(PAD,iy,cW,itemH-8,16,"#fff");sr(PAD,iy,cW,itemH-8,16,"#D1FAE5",2);tx(DM[k]?.icon||"✦",PAD+16,iy+44,"500 36px sans-serif","#1E293B");tx(k,PAD+62,iy+36,"700 26px 'Noto Sans Thai',sans-serif","#1E293B","left",cW-90);tx(v.toFixed(1),PAD+cW-14,iy+36,"800 30px 'Noto Sans Thai',sans-serif","#059669","right");wt(STR_DESC[k]||"จุดแข็งที่โดดเด่น",PAD+16,iy+70,cW-32,36,"400 22px 'Noto Sans Thai',sans-serif","#64748B");fr(PAD+16,iy+itemH-34,cW-32,14,7,"#E5E7EB");const g=linGrad(PAD+16,0,PAD+16+(cW-32)*v/10,0,[[0,"#10B981"],[1,"#34D399"]]);fr(PAD+16,iy+itemH-34,(cW-32)*v/10,14,7,g);iy+=itemH;});
      iy=y+lblH+8;
      bot3.forEach(([k,v])=>{const c2=PAD+cW+28;fr(c2,iy,cW,itemH-8,16,"#fff");sr(c2,iy,cW,itemH-8,16,"#FEE2E2",2);tx(DM[k]?.icon||"✦",c2+16,iy+44,"500 36px sans-serif","#1E293B");tx(k,c2+62,iy+36,"700 26px 'Noto Sans Thai',sans-serif","#1E293B","left",cW-90);tx(v.toFixed(1),c2+cW-14,iy+36,"800 30px 'Noto Sans Thai',sans-serif","#DC2626","right");wt(SDW_DESC[k]||"ต้องพัฒนาเพิ่มเติม",c2+16,iy+70,cW-32,36,"400 22px 'Noto Sans Thai',sans-serif","#64748B");fr(c2+16,iy+itemH-34,cW-32,14,7,"#E5E7EB");const g=linGrad(c2+16,0,c2+16+(cW-32)*v/10,0,[[0,"#EF4444"],[1,"#F87171"]]);fr(c2+16,iy+itemH-34,(cW-32)*v/10,14,7,g);iy+=itemH;});
      y+=colTotalH+16;
      // Encouragement card
      const encH=340;const eg=linGrad(0,y,0,y+encH,[[0,"#F5F3FF"],[1,"#EDE9FE"]]);fr(PAD,y,W-PAD*2,encH,24,eg);sr(PAD,y,W-PAD*2,encH,24,"#DDD6FE",2);
      tx("💜 ยินดีด้วย "+nick+"!",PAD+30,y+55,"800 36px 'Noto Sans Thai',sans-serif","#5B21B6");
      const ey1=wt("คุณโดดเด่นด้าน: "+top3.map(([k,v])=>(DM[k]?.icon||"")+k+" ("+v.toFixed(1)+")").join(", "),PAD+30,y+100,W-PAD*2-60,40,"600 26px 'Noto Sans Thai',sans-serif","#374151");
      wt("จุดระวัง: "+bot1[0]+" ("+bot1[1].toFixed(1)+") — "+tip,PAD+30,ey1+8,W-PAD*2-60,38,"400 24px 'Noto Sans Thai',sans-serif","#374151");
      fr(PAD+30,y+encH-60,W-PAD*2-60,48,10,"#fff");sr(PAD+30,y+encH-60,W-PAD*2-60,48,10,"#E5E7EB",1);
      tx("① ใช้ "+top1[0]+" ให้เต็มที่  ② "+tip.slice(0,28)+"  ③ สร้างระบบพักฟื้น ✨",PAD+50,y+encH-28,"400 22px 'Noto Sans Thai',sans-serif","#374151","left",W-PAD*2-100);
      y+=encH+16;
    }
    // ── CTA BANNER ──
    const ctaH=130;fr(PAD,y,W-PAD*2,ctaH,24,linGrad(0,y,W,y+ctaH,[[0,"#6D28D9"],[1,"#5B21B6"]]));
    tx("อยากรู้จักตัวเองแบบนี้บ้างไหม?",W/2,y+50,"800 34px 'Noto Sans Thai',sans-serif","#fff","center");
    tx("ลองทำแบบประเมินฟรี — AI + โหราศาสตร์พระเวท + จิตวิทยา 36 ข้อ",W/2,y+92,"400 24px 'Noto Sans Thai',sans-serif","rgba(255,255,255,0.7)","center",W-PAD*2-60);
    y+=ctaH+10;
    // ── FOOTER ──
    const footerH=H-y-6;fr(PAD,y,W-PAD*2,footerH,20,"#fff");
    tx("humansystemstudio.com",PAD+28,y+footerH/2+14,"800 30px 'Noto Sans Thai',sans-serif","#6D28D9");
    tx(isFull?"AI + Vedic Astrology + Psychology":"ลองทำแบบประเมินฟรี →",W-PAD-28,y+footerH/2+14,"400 24px 'Noto Sans Thai',sans-serif","#94A3B8","right");
    // ── DOWNLOAD PNG ──
    canvas.toBlob(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`HSS-${nick}-share.png`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);},"image/png");};

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
  const FT_DESC={"Identity Snapshot (AI)":{en:"Identity Snapshot (AI)",th:"สแกนตัวตนด้วย AI",desc:"สรุปภาพรวมว่าคุณเป็นคนแบบไหนใน 1 นาที"},"5 Core Scores + AI วิเคราะห์":{en:"5 Core Scores",th:"5 พลังหลักในตัวคุณ",desc:"วัดระดับความเก่งใน 5 ด้านสำคัญ — จุดแข็ง / จุดพัฒนา"},"จุดแข็ง / จุดพัฒนา 12 มิติ":{en:"12 Dimensions",th:"12 ด้านของชีวิต (ดี/ด้อย)",desc:"เจาะลึกว่าจุดไหนคือ 'บ่อเงินบ่อทอง' จุดไหนคือ 'รูรั่ว'"},"Shadow Analysis เชิงลึก":{en:"Shadow Analysis",th:"วิเคราะห์ 'จุดบอด' ขัดลาภ",desc:"เผยนิสัยลึกๆ ที่มักทำให้พังหรือเสียโอกาส"},"Life Principle หลักการใช้ชีวิต":{en:"Life Principle",th:"คู่มือการใช้ชีวิตเฉพาะคุณ",desc:"กฎเหล็กที่ถ้าทำตามแล้วชีวิตจะรุ่งเรือง"},"Life Phase Map (Dasha)":{en:"Life Phase Map",th:"แผนที่จังหวะชีวิต (ขาขึ้น/ขาลง)",desc:"บอกว่าตอนนี้คุณอยู่ในช่วง 'สะสมบุญ' หรือ 'ตวงตักโชค'"},"Do & Don't รายสัปดาห์":{en:"Weekly Do & Don't",th:"สิ่งควรทำ-ควรเลี่ยง สัปดาห์นี้",desc:"บอกทางหนีทีไล่รายสัปดาห์ ไม่ให้ก้าวพลาด"},"7-Day Energy Forecast":{en:"7-Day Energy Forecast",th:"พยากรณ์พลังงาน 7 วัน",desc:"วันไหน 'พลังล้น' ควรลุย วันไหน 'พลังตก' ควรพัก"},"Dashboard กราฟชีวิตการงาน":{en:"Career Dashboard",th:"กราฟเส้นทางความสำเร็จ",desc:"ดูภาพรวมการงานตลอดปีแบบเข้าใจง่ายในหน้าเดียว"},"Job Matching AI":{en:"Job Matching AI",th:"AI ค้นหางานที่ 'ถูกโฉลก'",desc:"แนะนำอาชีพที่ทำแล้วรวยและมีความสุข ตามดวงและนิสัย"},"PDF Report ดาวน์โหลด":{en:"PDF Report",th:"รายงานฉบับเต็ม",desc:"ดาวน์โหลดผลวิเคราะห์ทุกด้านในไฟล์เดียว"},"Social Share Card":{en:"Share Card",th:"การ์ดแชร์โซเชียล",desc:"แชร์ผลลัพธ์ให้คนรู้จักคุณในแบบที่คุณเลือก"}};
  const Landing=()=><div style={{minHeight:"100vh"}}>
  {/* Nav */}
  <div style={{display:"flex",justifyContent:"flex-end",padding:"12px 20px 0"}}>{logged?<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:"#64748B"}}>{user?.email?.split("@")[0]}</span><button onClick={doLogout} style={{fontSize:11,color:"#64748B",background:"none",border:"1px solid #E2E8F0",borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>ออกจากระบบ</button></div>:<button onClick={()=>{setLoginModal(true);setAuthErr("");setAuthMode("login")}} style={{fontSize:12,fontWeight:600,color:"#4338CA",background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:8,padding:"6px 16px",cursor:"pointer"}}>เข้าสู่ระบบ / สมัคร</button>}</div>

  {/* Hero */}
  <div style={{textAlign:"center",padding:"40px 20px 32px",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 20%,rgba(67,56,202,.08),transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(139,92,246,.06),transparent 50%)",zIndex:0}}/><div style={{position:"relative",zIndex:1}}><div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#4338CA,#6D28D9)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#fff",boxShadow:"0 8px 24px rgba(67,56,202,.3)",animation:"hfl 3s ease-in-out infinite",marginBottom:16}}>✦</div><h1 style={{fontSize:26,fontWeight:800,color:"#1E293B",marginBottom:6}}>{BRAND}</h1><p style={{fontSize:15,fontWeight:600,color:"#4338CA",marginBottom:6}}>เข้าใจตัวเองอย่างแม่นยำ</p><p style={{fontSize:13,color:"#64748B",lineHeight:1.7,maxWidth:380,margin:"0 auto 20px"}}>ด้วย AI + Vedic Astrology + แบบประเมิน 36 คำถาม</p><div style={{maxWidth:280,margin:"0 auto"}}><Btn onClick={()=>setSc("profile")}>สแกนศักยภาพของคุณฟรี →</Btn>{logged&&scores&&<button onClick={()=>setSc("results")} style={{width:"100%",marginTop:8,padding:10,borderRadius:8,border:"2px solid #6366F1",background:"#fff",color:"#4338CA",fontSize:13,fontWeight:700,cursor:"pointer"}}>📊 ดูผลลัพธ์เดิม</button>}</div></div></div>

  <div style={{padding:"0 20px",maxWidth:520,margin:"0 auto"}}>

  {/* UVP Card */}
  <Card style={{background:"linear-gradient(135deg,#F5F3FF,#EEF2FF)",border:"1px solid #DDD6FE",marginBottom:12}}>
    <h3 style={{fontSize:14,fontWeight:700,color:"#4338CA",marginBottom:6}}>🔎 ทำไมต้องใช้ "ดวง + พฤติกรรม" พร้อมกัน?</h3>
    <p style={{fontSize:12,color:"#374151",lineHeight:1.7,marginBottom:10}}>เพราะบางคน "ดวงดี" แต่ใช้ไม่เป็น บางคน "ศักยภาพกลาง" แต่บริหารตัวเองเก่ง</p>
    <div style={{padding:"10px 14px",background:"#fff",borderRadius:10,textAlign:"center",marginBottom:10,border:"1px solid #DDD6FE"}}>
      <div style={{fontSize:11,color:"#94A3B8",marginBottom:4,fontStyle:"italic"}}>"ดวงบอกแค่เพดาน แต่พฤติกรรมบอกความจริง"</div>
      <div style={{fontSize:15,fontWeight:800,color:"#6D28D9"}}>ศักยภาพกำเนิด × การใช้งานจริง</div>
    </div>
    <p style={{fontSize:12,color:"#374151",lineHeight:1.7}}>วัดช่องว่าง (Gap) ระหว่างดวงชะตาที่คุณมี กับนิสัยที่คุณเป็น เพื่อหาจุดสมดุลในการพัฒนาตัวเองที่แม่นยำที่สุด</p>
  </Card>

  {/* 3-Step Process Flow */}
  <div style={{marginBottom:16}}>
    <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>3 ขั้นตอนการวิเคราะห์</h3>
    {[{i:"🪐",t:"Vedic Astrology",d:"ศักยภาพกำเนิดจากวันเดือนปีเกิด",sub:"วัดพลังดาวประจำตัว 9 ดวง"},{i:"📋",t:"Psychology 36 ข้อ",d:"วัดพฤติกรรมจริงในชีวิตประจำวัน",sub:"ครอบคลุม 12 มิติของการดำเนินชีวิต"},{i:"🤖",t:"AI Insight Engine",d:"เชื่อมข้อมูลทั้งสองเป็นข้อสรุปใช้ได้จริง",sub:"ไม่ใช่แค่คำทำนาย แต่คือ 'แผนที่ชีวิต' ที่วิเคราะห์จาก Data ของคุณเอง เพื่อให้คุณเป็นตัวเองในเวอร์ชันที่ทำเงินและมีความสุขที่สุด"}].map((x,i,arr)=><div key={i}><Card style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:0}}><div style={{width:38,height:38,borderRadius:10,background:i===2?"linear-gradient(135deg,#4338CA,#6D28D9)":"#F5F3FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,boxShadow:i===2?"0 4px 12px rgba(67,56,202,.25)":"none"}}>{x.i}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:9,fontWeight:700,color:"#fff",background:"#6366F1",width:16,height:16,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span><div style={{fontSize:13,fontWeight:700,color:i===2?"#4338CA":"#1E293B"}}>{x.t}</div></div><div style={{fontSize:11,color:"#64748B",marginBottom:2}}>{x.d}</div>{x.sub&&<div style={{fontSize:10,color:i===2?"#6366F1":"#94A3B8",fontStyle:i===2?"italic":"normal",lineHeight:1.5}}>{x.sub}</div>}</div></Card>{i<arr.length-1&&<div style={{textAlign:"center",padding:"2px 0",color:"#C7D2FE",fontSize:16}}>↓</div>}</div>)}
  </div>

  {/* The Big 3 Answers */}
  <div style={{marginBottom:16}}>
    <div style={{textAlign:"center",marginBottom:10}}>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:2}}>สิ่งที่คุณจะได้รู้</h3>
      <div style={{fontSize:11,color:"#94A3B8"}}>The Big 3 Answers</div>
    </div>
    {[{icon:"1️⃣",label:"WHO",color:"#4338CA",bg:"#EEF2FF",border:"#C7D2FE",title:"พลังแฝงและบุคลิกภาพที่แท้จริง",desc:"MBTI × Vedic — คุณเป็นคนแบบไหน? มีพลังดาวดวงไหนหนุน? และพลังแฝงที่ยังไม่ได้ปลดล็อกคืออะไร"},{icon:"2️⃣",label:"WHAT",color:"#059669",bg:"#ECFDF5",border:"#A7F3D0",title:"ทักษะทำเงินที่ดวงและนิสัยส่งเสริมที่สุด",desc:"ทักษะไหนมีมูลค่าในตลาด Top 5-10%? คุณทำเงินได้จากอะไร? และจุดบอดที่ขัดขวางรายได้คืออะไร"},{icon:"3️⃣",label:"WHEN",color:"#B45309",bg:"#FFFBEB",border:"#FDE68A",title:"ไทม์ไลน์จังหวะชีวิต",desc:"ตอนนี้อยู่ช่วงไหน? Golden Window ของคุณคือเมื่อไหร่? ช่วงไหนควรบุก ช่วงไหนควรเก็บตัว"}].map((x,i)=><div key={i} style={{background:x.bg,border:`1px solid ${x.border}`,borderRadius:12,padding:"12px 14px",marginBottom:6,display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:20,flexShrink:0}}>{x.icon}</span><div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:10,fontWeight:800,color:"#fff",background:x.color,padding:"1px 8px",borderRadius:6}}>{x.label}</span><span style={{fontSize:12,fontWeight:700,color:x.color}}>{x.title}</span></div><div style={{fontSize:11,color:"#374151",lineHeight:1.6}}>{x.desc}</div></div></div>)}
  </div>

  {/* Packages */}
  <h3 style={{fontSize:14,fontWeight:700,marginBottom:8}}>เลือกแพ็คเกจของคุณ</h3>
  {[{p:"free",tag:"🟢",name:"The Explorer",nameTH:"ผู้เริ่มต้น",concept:"รู้จักตัวเองเบื้องต้น",pr:"฿0",desc:"สแกนตัวตนฟรี พร้อมดู 5 พลังหลักเบื้องต้น",it:["Identity Snapshot (AI) — สแกนตัวตนด้วย AI","5 Core Scores — 5 พลังหลักในตัวคุณ","Social Share Card — การ์ดแชร์โซเชียล"]},{p:"deep",tag:"🟡",name:"The Navigator",nameTH:"ผู้นำทาง",concept:"เริ่มคุมทิศทางชีวิตได้",pr:"฿49",oldPr:"฿99",badge:"Early Bird",desc:"เจาะลึกจุดอ่อน-จุดแข็ง พร้อมคำแนะนำรายสัปดาห์",it:["12 Dimensions — 12 ด้านของชีวิต (บ่อทอง & รูรั่ว)","Shadow Analysis — วิเคราะห์จุดบอดขัดลาภ","Weekly Do & Don't — ไม่ให้ก้าวพลาด","7-Day Energy Forecast — รู้วันบุก วันพัก"]},{p:"all",tag:"🔵",name:"The Architect",nameTH:"ผู้ออกแบบชีวิต",concept:"ออกแบบความสำเร็จแบบครบวงจร",pr:"฿99",oldPr:"฿249",badge:"Early Bird คุ้มสุด",desc:"ปลดล็อกแผนที่จังหวะชีวิต (Dasha) และระบบ Job Matching",it:["Life Phase Map — แผนที่ขาขึ้น/ขาลงชีวิต","Career Dashboard — กราฟการงานตลอดปี","Job Matching AI — งานที่ถูกโฉลกตามดวง & นิสัย","PDF Report ฉบับเต็ม"]}].map((x,i)=><Card key={i} style={{position:"relative",border:x.badge?`2px solid ${PLANS[x.p].c}`:"1px solid #F1F5F9",marginBottom:10}}>{x.badge&&<span style={{position:"absolute",top:-10,right:12,background:PLANS[x.p].c,color:"#fff",fontSize:10,fontWeight:800,padding:"2px 10px",borderRadius:8}}>{x.badge}</span>}<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}><div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:13}}>{x.tag}</span><span style={{fontSize:15,fontWeight:800,color:PLANS[x.p].c}}>{x.name}</span><span style={{fontSize:11,color:"#94A3B8",fontWeight:500}}>({x.nameTH})</span></div><div style={{fontSize:10,color:"#6366F1",fontStyle:"italic",marginBottom:2}}>Concept: {x.concept}</div></div><div style={{textAlign:"right",flexShrink:0}}>{x.oldPr&&<div style={{fontSize:11,color:"#94A3B8",textDecoration:"line-through"}}>{x.oldPr}</div>}<span style={{fontSize:18,fontWeight:800,color:PLANS[x.p].c}}>{x.pr}</span></div></div><p style={{fontSize:11,color:"#64748B",marginBottom:6,lineHeight:1.5}}>{x.desc}</p>{x.it.map((it,j)=><div key={j} style={{fontSize:11,color:"#374151",padding:"2px 0",display:"flex",gap:4}}><span style={{color:PLANS[x.p].c,fontWeight:700,flexShrink:0}}>✔</span><span>{it}</span></div>)}{x.p==="free"?<button onClick={()=>setSc("profile")} style={{width:"100%",marginTop:10,padding:"9px 0",borderRadius:8,border:"2px solid #10B981",background:"#ECFDF5",color:"#059669",fontSize:12,fontWeight:700,cursor:"pointer"}}>เริ่มสแกนฟรี →</button>:<button onClick={()=>tryUpgrade(x.p)} style={{width:"100%",marginTop:10,padding:"9px 0",borderRadius:8,border:"none",background:x.p==="deep"?"linear-gradient(135deg,#F59E0B,#D97706)":"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 12px ${x.p==="deep"?"rgba(245,158,11,.3)":"rgba(67,56,202,.3)"}`}}>{x.p==="deep"?"ปลดล็อก The Navigator ฿49 →":"ปลดล็อก The Architect ฿99 →"}</button>}</Card>)}

  {/* Feature Table */}
  <h3 style={{fontSize:14,fontWeight:700,marginBottom:8}}>เปรียบเทียบฟีเจอร์</h3>
  <Card style={{padding:10,overflow:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
      <thead><tr style={{background:"#F8FAFC"}}>
        <th style={{textAlign:"left",padding:"6px 8px",fontWeight:700,color:"#64748B",minWidth:160}}>ฟีเจอร์</th>
        <th style={{textAlign:"center",padding:"6px 4px",fontWeight:700,color:"#10B981",minWidth:48}}>🟢<br/>Explorer</th>
        <th style={{textAlign:"center",padding:"6px 4px",fontWeight:700,color:"#F59E0B",minWidth:48}}>🟡<br/>Navigator</th>
        <th style={{textAlign:"center",padding:"6px 4px",fontWeight:700,color:"#3B82F6",minWidth:48}}>🔵<br/>Architect</th>
      </tr></thead>
      <tbody>{FT.map(([n,,f,d,a],i)=>{const meta=FT_DESC[n]||{en:n,th:"",desc:""};return<tr key={i} style={{borderBottom:"1px solid #F1F5F9"}}><td style={{padding:"7px 8px"}}><div style={{fontSize:11,fontWeight:600,color:"#1E293B"}}>{meta.en}</div><div style={{fontSize:10,fontWeight:700,color:"#6366F1"}}>{meta.th}</div><div style={{fontSize:9,color:"#94A3B8",lineHeight:1.4,marginTop:1}}>{meta.desc}</div></td><td style={{textAlign:"center",verticalAlign:"middle"}}>{f?<span style={{fontSize:14}}>✅</span>:<span style={{color:"#CBD5E1",fontSize:12}}>—</span>}</td><td style={{textAlign:"center",verticalAlign:"middle"}}>{d?<span style={{fontSize:14}}>✅</span>:<span style={{color:"#CBD5E1",fontSize:12}}>—</span>}</td><td style={{textAlign:"center",verticalAlign:"middle"}}>{a?<span style={{fontSize:14}}>✅</span>:<span style={{color:"#CBD5E1",fontSize:12}}>—</span>}</td></tr>})}</tbody>
    </table>
  </Card>

  <Card style={{background:"#F0FDF4",border:"1px solid #BBF7D0",marginTop:10}}><div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:4}}>🛡 ความเป็นส่วนตัว</div><div style={{fontSize:11,color:"#15803D"}}>ไม่ขายข้อมูล · ไม่เผยแพร่ผล · ผลลัพธ์เป็นของคุณ</div></Card>
  <div style={{padding:"16px 0 40px"}}><Btn onClick={()=>setSc("profile")}>สแกนศักยภาพของคุณฟรี →</Btn></div>
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
  const TimelineMonth=({m,i,typeColors,typeBg,typeBorder})=>{
    const[open,setOpen]=useState(false);
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

        {/* Psychology × Astrology */}
        <div style={{padding:"10px 14px",borderBottom:"1px solid #F0ECF8"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#7B6FA0",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>🧠 จิตวิทยา × โหราศาสตร์</div>
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

  // ─── RESULTS ───
  const Sec=({fKey,title,icon,children})=>{const ok=has(fKey);return<Card style={{position:"relative"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:ok?8:4}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:15}}>{icon}</span><span style={{fontSize:13,fontWeight:700}}>{title}</span></div>{!ok&&<span style={{fontSize:10,fontWeight:700,color:"#6366F1",background:"#EEF2FF",padding:"2px 8px",borderRadius:8}}>🔒</span>}</div>{ok?children:<><p style={{fontSize:11,color:"#94A3B8",marginBottom:6}}>ปลดล็อกเพื่อดู</p><div style={{display:"flex",gap:6}}>{plan==="free"&&<button onClick={()=>tryUpgrade("deep")} style={{flex:1,padding:7,borderRadius:8,border:"2px solid #F59E0B",background:"#FFFBEB",color:"#92400E",fontSize:11,fontWeight:700,cursor:"pointer"}}>Deep ฿49</button>}{plan!=="all"&&<button onClick={()=>tryUpgrade("all")} style={{flex:1,padding:7,borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>All ฿99</button>}</div></>}</Card>};

  const Results=()=>{if(!scores)return null;const so=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const c5={"Cognitive Processing":scores["Cognitive Processing"],"Emotional Regulation":scores["Emotional Regulation"],"Identity Stability":scores["Identity Stability"],"Shadow Pattern":scores["Shadow Pattern"],"Growth Orientation":scores["Growth Orientation"]};
  return<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,#4338CA,#6D28D9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>✦</div><span style={{fontSize:14,fontWeight:800}}>{nick}</span></div><span style={{fontSize:10,color:"#94A3B8"}}>{PLANS[plan].name}{logged?` · ${user?.email?.split("@")[0]}`:""}</span></div><div style={{display:"flex",alignItems:"center",gap:4}}>{plan!=="free"&&<span style={{fontSize:10,fontWeight:700,color:"#fff",background:PLANS[plan].c,padding:"3px 10px",borderRadius:8}}>{PLANS[plan].name}</span>}{logged?<button onClick={doLogout} style={{fontSize:12,color:"#64748B",background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:8,padding:"6px 14px",cursor:"pointer",minWidth:60,minHeight:36}}>ออกจากระบบ</button>:<button onClick={()=>{setLoginModal(true);setAuthErr("");setAuthMode("login")}} style={{fontSize:12,color:"#4338CA",background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>เข้าสู่ระบบ</button>}</div></div>

  {plan==="free"&&<Card style={{background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",border:"2px solid #6366F1"}}><div style={{fontSize:12,fontWeight:700,color:"#4338CA",marginBottom:6}}>🔓 ปลดล็อกความเข้าใจตัวเอง</div><div style={{display:"flex",gap:6}}><button onClick={()=>tryUpgrade("deep")} style={{flex:1,padding:7,borderRadius:8,border:"2px solid #F59E0B",background:"#fff",color:"#92400E",fontSize:11,fontWeight:700,cursor:"pointer"}}>Deep ฿49</button><button onClick={()=>tryUpgrade("all")} style={{flex:1,padding:7,borderRadius:8,border:"none",background:"linear-gradient(135deg,#4338CA,#6D28D9)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>All ฿99</button></div></Card>}

  <Sec fKey="identity" title="Identity Snapshot" icon="✦">{ai.identity&&ai.identity.powerTitle?<IdentitySnapshotCard data={ai.identity}/>:aiL.identity?<Spin t="กำลังถอดรหัสตัวตน..."/>:<Spin t="เชื่อม AI..."/>}</Sec>
  <Sec fKey="core5" title="5 Core Scores" icon="📊">{Object.entries(c5).map(([d,sc])=>{const meta=C5_META[d]||{short:d,pl:"",high:{label:"",desc:""},mid:{label:"",desc:""},low:{label:"",desc:""}};const lv=sc>=7?meta.high:sc>=5?meta.mid:meta.low;const isLow=sc<5;const isMid=sc>=5&&sc<7;const lblColor=isLow?"#DC2626":isMid?"#64748B":"#059669";return<div key={d} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><span style={{fontSize:11,fontWeight:600}}>{DM[d]?.icon} {meta.short} <span style={{fontSize:9,color:"#94A3B8"}}>({meta.pl})</span></span><span style={{fontSize:13,fontWeight:800,color:DM[d]?.c}}>{sc.toFixed(1)}</span></div><div style={{height:5,background:"#F1F5F9",borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:`${sc*10}%`,background:DM[d]?.c,borderRadius:3}}/></div><div style={{fontSize:10,lineHeight:1.6,color:lblColor}}><span style={{fontWeight:700}}>{lv.label}:</span> {lv.desc}</div></div>})}<div style={{marginTop:8,padding:8,background:"#F8FAFC",borderRadius:8}}>{aiL.core?<Spin/>:ai.core?<Typer text={ai.core}/>:<Spin t="รอ AI..."/>}</div></Sec>

  {/* Locked preview: 12D */}
  {!has("12d")?<Locked planNeeded="deep" title="12D Spider Web + จุดแข็ง/จุดพัฒนา" onUpgrade={tryUpgrade}><div style={{textAlign:"center",padding:16}}><Spider scores={scores}/></div><div style={{padding:"8px 0"}}><div style={{fontSize:12,marginBottom:4}}>💪 จุดแข็ง: {so.slice(0,3).map(([k,v])=>`${DM[k]?.icon}${k}(${v.toFixed(1)})`).join(" · ")}</div><div style={{fontSize:12}}>⚠️ จุดพัฒนา: {so.slice(-3).map(([k,v])=>`${DM[k]?.icon}${k}(${v.toFixed(1)})`).join(" · ")}</div></div></Locked>:<Sec fKey="12d" title="12D Spider Web" icon="🕸️"><div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Spider scores={scores}/></div><div style={{marginBottom:6}}><div style={{fontSize:11,fontWeight:700,color:"#10B981",marginBottom:3}}>💪 จุดแข็ง</div>{so.slice(0,4).map(([d,s])=><div key={d} style={{padding:"4px 8px",borderRadius:6,background:"#ECFDF5",border:"1px solid #A7F3D0",marginBottom:2,display:"flex",justifyContent:"space-between",fontSize:11}}><span>{DM[d]?.icon} {d}</span><span style={{fontWeight:700,color:"#059669"}}>{s.toFixed(1)}</span></div>)}</div><div><div style={{fontSize:11,fontWeight:700,color:"#EF4444",marginBottom:3}}>⚠️ จุดพัฒนา</div>{so.slice(-4).map(([d,s])=><div key={d} style={{padding:"4px 8px",borderRadius:6,background:"#FFF1F2",border:"1px solid #FECDD3",marginBottom:2,display:"flex",justifyContent:"space-between",fontSize:11}}><span>{DM[d]?.icon} {d}</span><span style={{fontWeight:700,color:"#EF4444"}}>{s.toFixed(1)}</span></div>)}</div>{aiL["12d"]?<Spin/>:ai["12d"]?<div style={{marginTop:8,padding:8,background:"#F8FAFC",borderRadius:8}}><Typer text={ai["12d"]}/></div>:null}</Sec>}

  {/* Locked preview: Shadow */}
  {!has("shadow")?<Locked planNeeded="deep" title="Shadow Analysis เชิงลึก" onUpgrade={tryUpgrade}><div style={{padding:12,borderRadius:10,background:"#1E293B",color:"#fff",marginBottom:8}}><div style={{fontSize:13,fontWeight:700,marginBottom:4}}>🌑 Shadow Pattern: {scores["Shadow Pattern"]?.toFixed(1)}/10</div><div style={{fontSize:11,color:"#94A3B8"}}>Stress Response: {scores["Stress Response"]?.toFixed(1)} · Boundary: {scores["Boundary System"]?.toFixed(1)}</div></div><div style={{fontSize:12,lineHeight:1.8,color:"#374151"}}>⚡ Trigger หลัก: ราหูชี้ว่าคุณมักถูกกระตุ้นเมื่อ...<br/>🔄 Pattern ซ้ำ: เมื่อเจอ trigger คุณมักเลือก...<br/>💡 วิธีแก้: ฝึกจับสัญญาณร่างกาย...</div></Locked>:<Sec fKey="shadow" title="Shadow Analysis" icon="🌑"><div style={{background:"#0F172A",borderRadius:10,padding:"12px 14px",marginBottom:10}}><div style={{fontSize:12,fontWeight:800,color:"#E2E8F0",marginBottom:6}}>🌑 Shadow Pattern คืออะไร?</div><div style={{fontSize:12,color:"#94A3B8",lineHeight:1.8}}>เงามืดที่ขัดขวางความสำเร็จ — คือพฤติกรรมที่คุณมักจะเผลอทำเวลาเสียศูนย์ (เช่น การผลัดวันประกันพรุ่ง การใช้อารมณ์ หรือการหนีความจริง) แม้คุณจะมีศักยภาพดาวกำเนิดที่สูง แต่ถ้า "เงามืด" นี้ทำงานหนักเกินไป มันจะดึงให้คะแนนการใช้งานจริงของคุณต่ำลง</div><div style={{marginTop:8,padding:"8px 10px",background:"rgba(99,102,241,0.15)",borderRadius:8,borderLeft:"3px solid #6366F1"}}><div style={{fontSize:11,color:"#A5B4FC",lineHeight:1.7}}>💡 การรู้เท่าทันเงาของตัวเอง คือกุญแจสำคัญที่จะทำให้คุณกลับมาควบคุมชีวิตได้อีกครั้ง</div></div></div>{aiL.shadow?<Spin/>:ai.shadow?<Typer text={ai.shadow}/>:<Spin t="วิเคราะห์เงามืด..."/>}</Sec>}

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
  {!has("energy")?<Locked planNeeded="deep" title="7-Day Energy Forecast" onUpgrade={tryUpgrade}><div style={{fontSize:12,fontWeight:700,marginBottom:8}}>🌙 พลังงาน 7 วัน — Moon + Mars + Day Lord</div>{["จันทร์ — 🌟 สดใส-เริ่มใหม่","อังคาร — 😊 สงบมั่นคง","พุธ — 🔥 กระตือรือร้น","พฤหัสบดี — 📚 ปัญญาเปิด","ศุกร์ — 💎 ผ่อนคลาย","เสาร์ — ⚙️ ต้องใช้วินัย","อาทิตย์ — ☀️ มีพลัง"].map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",borderRadius:6,background:i%2===0?"#F8FAFC":"#fff",fontSize:11,marginBottom:2}}><span>{d.split("—")[0]}</span><span style={{fontWeight:700}}>{d.split("—")[1]}</span></div>)}<div style={{fontSize:10,color:"#6366F1",marginTop:6}}>🔮 คำนวณจาก Transit จันทร์+อังคาร+เจ้าวัน Vedic</div></Locked>:<Sec fKey="energy" title="7-Day Energy" icon="🌙">{aiL.energy||!ai.energy?<Spin/>:Array.isArray(ai.energy)?<>{ai.energy.map((d,i)=><div key={i} style={{padding:"8px 10px",borderRadius:8,marginBottom:3,background:i===0?"linear-gradient(135deg,#EEF2FF,#F5F3FF)":"#F8FAFC",border:i===0?"2px solid #6366F1":"1px solid #F1F5F9"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:12,fontWeight:700}}>{i===0?"📍 ":""}{d.day}</span><span style={{fontSize:9,color:"#94A3B8",background:"#fff",padding:"1px 4px",borderRadius:4}}>{d.date}</span></div></div><div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:2}}>{d.mood}</div>{d.transit&&<div style={{fontSize:9,color:"#7C3AED"}}>🪐 {d.transit}</div>}{d.goodFor&&<div style={{fontSize:10,color:"#059669",background:"#ECFDF5",borderRadius:4,padding:"2px 6px",marginTop:2}}>✅ {d.goodFor}</div>}{d.tip&&<div style={{fontSize:10,color:"#374151",background:"#fff",borderRadius:4,padding:"2px 6px",marginTop:2,border:"1px solid #F1F5F9"}}>💡 {d.tip}</div>}</div>)}<div style={{marginTop:6,padding:8,background:"#F5F3FF",borderRadius:8}}><div style={{fontSize:10,fontWeight:700,color:"#4338CA",marginBottom:2}}>🔮 Vedic Jyotish 3 ชั้น</div><div style={{fontSize:9,color:"#64748B"}}>จันทร์Transit(40%) + อังคาร(25%) + เจ้าวัน(35%)</div></div></>:<Spin/>}</Sec>}

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
    <div style={{fontSize:12,fontWeight:700,color:"#1E293B",marginBottom:6}}>🗓️ ทุกเดือนในปีนี้</div>
    {months.map((m,i)=><TimelineMonth key={i} m={m} i={i} typeColors={typeColors} typeBg={typeBg} typeBorder={typeBorder}/>)}

    <div style={{marginTop:8,padding:8,background:"#F5F3FF",borderRadius:8}}>
      <div style={{fontSize:10,fontWeight:700,color:"#7B6FA0",marginBottom:2}}>🔮 โหราศาสตร์ไทย (สุริยาตร์/Sidereal) × จิตวิทยา</div>
      <div style={{fontSize:9,color:"#64748B"}}>คำนวณจากราศีเกิดไทย + ดาวจร 8 ดวง + เรือน 12 + สภาพดาว (อุจจ์/นิจ/เกษตร)</div>
    </div>
    </div>})()}</Sec>}

  {/* Locked preview: Job */}
  {!has("job")?<Locked planNeeded="all" title="Job Matching AI" onUpgrade={tryUpgrade}><div style={{fontSize:12,fontWeight:700,marginBottom:8}}>💼 AI แนะนำอาชีพจาก 12D Profile + Vedic</div>{[{t:"Data Analyst",m:88},{t:"Project Manager",m:82},{t:"UX Researcher",m:78}].map((j,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",borderRadius:6,background:"#F8FAFC",marginBottom:3,fontSize:12}}><span>{i+1}. {j.t}</span><span style={{fontWeight:700,color:"#4338CA"}}>Match {j.m}%</span></div>)}<div style={{display:"flex",gap:4,marginTop:4}}><div style={{padding:"5px 10px",borderRadius:6,background:"#0A66C2",color:"#fff",fontSize:10,fontWeight:700}}>🔍 ค้นหาใน LinkedIn</div></div></Locked>:<Sec fKey="job" title="Job Matching AI" icon="💼">{aiL.job||!ai.job?<Spin/>:Array.isArray(ai.job)?ai.job.map((j,i)=><div key={i} style={{padding:10,borderRadius:8,background:"#F8FAFC",marginBottom:4}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:13,fontWeight:700}}>{j.titleTH||j.title}</span><span style={{fontSize:10,fontWeight:700,color:"#4338CA",background:"#EEF2FF",padding:"2px 6px",borderRadius:6}}>{j.match}%</span></div>{j.dims&&<div style={{fontSize:10,color:"#6366F1",marginBottom:2}}>📊 {j.dims}</div>}<div style={{fontSize:11,color:"#64748B",lineHeight:1.5}}>{j.reason}</div><a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(j.title)}&location=Thailand`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:6,padding:"5px 12px",borderRadius:6,background:"#0A66C2",color:"#fff",fontSize:11,fontWeight:700,textDecoration:"none"}}>🔍 ค้นหางานในไทย — LinkedIn</a></div>):<Spin/>}</Sec>}

  {!has("pdf")?<Locked planNeeded="all" title="PDF Report ดาวน์โหลด" onUpgrade={tryUpgrade}><div style={{fontSize:12,lineHeight:1.8}}>📄 รายงานฉบับเต็ม ประกอบด้วย:<br/>• 12 Dimension Scores + Spider Chart<br/>• Identity + Shadow + 5 Core Analysis<br/>• Do & Don't + 7-Day Energy + transit<br/>• Job Matching + Life Phase Map</div></Locked>:<Sec fKey="pdf" title="PDF Report" icon="📄"><Btn onClick={exportPDF} style={{fontSize:12,padding:8}}>📄 ดาวน์โหลด PDF</Btn></Sec>}

  <Sec fKey="share" title="Social Share Card" icon="📸"><div style={{fontSize:11,color:"#64748B",marginBottom:6}}>{plan==="all"?"การ์ด Full — Radar Chart 12 ด้าน + จุดแข็ง + Shadow + คำแนะนำ":"การ์ด Free — 5 Core + จุดแข็ง/Shadow + CTA อัปเกรด"}</div><Btn onClick={shareProfile} style={{fontSize:12,padding:8,background:"linear-gradient(135deg,#7C3AED,#5B21B6)"}}>📸 ดาวน์โหลดการ์ดแชร์</Btn></Sec>

  <div style={{textAlign:"center",padding:"14px 0 40px"}}><button onClick={()=>{aiTriggered.current=false;setSc("landing");setScores(null);setVedic(null);setAns({});setAi({});setQI(0)}} style={{fontSize:11,color:"#94A3B8",background:"none",border:"none",cursor:"pointer"}}>🔄 ทำแบบทดสอบใหม่</button></div></div>};

  return<div style={{fontFamily:"'Noto Sans Thai','DM Sans',-apple-system,sans-serif",minHeight:"100vh",background:"#F8FAFC",color:"#1E293B"}}><style>{css}</style>{loginModalJSX}<div style={{maxWidth:520,margin:"0 auto",padding:sc==="landing"?"0":"12px 16px 40px"}}>{sc==="landing"&&<Landing/>}{sc==="profile"&&<Profile/>}{sc==="quiz"&&<Quiz/>}{sc==="results"&&<Results/>}</div></div>;
}

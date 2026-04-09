"use client";
import{useEffect,useState}from"react";
import{createClient}from"@supabase/supabase-js";

const SB_URL=process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb=(SB_URL&&SB_KEY)?createClient(SB_URL,SB_KEY,{auth:{persistSession:true,storageKey:"hss-auth",storage:typeof window!=="undefined"?window.localStorage:undefined}}):null;

export default function AuthCallback(){
  const[msg,setMsg]=useState("กำลังเข้าสู่ระบบ...");

  useEffect(()=>{
    const handle=async()=>{
      if(!sb){window.location.href="/";return}
      // PKCE: exchange code for session (Supabase auto-detects ?code= in URL)
      const{data,error}=await sb.auth.getSession();
      if(error||!data?.session){
        // Try exchangeCodeForSession if code is present in URL
        const params=new URLSearchParams(window.location.search);
        const code=params.get("code");
        if(code){
          const{error:exchErr}=await sb.auth.exchangeCodeForSession(code);
          if(exchErr){setMsg("เกิดข้อผิดพลาด กรุณาลองใหม่");setTimeout(()=>{window.location.href="/"},2000);return}
        }
      }
      window.location.href="/";
    };
    handle();
  },[]);

  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"sans-serif",fontSize:"1rem",color:"#6B7280"}}>
      {msg}
    </div>
  );
}

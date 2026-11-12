import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type, x-app-password","Access-Control-Allow-Methods":"POST, OPTIONS"};
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
 const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,"Content-Type":"application/json"}});
 try{
  const expected=Deno.env.get("APP_PASSWORD");
  if(!expected || req.headers.get("x-app-password")!==expected) return json({error:"Kode akses salah."},401);
  const url=Deno.env.get("SUPABASE_URL")!, key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {action,table,row,id}=await req.json();
  const allowed=["transactions","living_essentials","savings_goals"];
  if(!allowed.includes(table)) return json({error:"Tabel tidak diizinkan."},400);
  let result;
  if(action==="list") result=await db.from(table).select("*").order("created_at",{ascending:false});
  else if(action==="insert") result=await db.from(table).insert(row).select().single();
  else if(action==="update") result=await db.from(table).update(row).eq("id",id).select().single();
  else if(action==="delete") result=await db.from(table).delete().eq("id",id);
  else return json({error:"Aksi tidak dikenal."},400);
  if(result.error) return json({error:result.error.message},400);
  return json({data:result.data??null});
 }catch(e){return json({error:e instanceof Error?e.message:"Server error"},500)}
});
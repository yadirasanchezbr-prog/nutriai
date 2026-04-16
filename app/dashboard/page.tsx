"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DailyCheckin from "@/components/DailyCheckin";
import NutriScoreCard from "@/components/NutriScoreCard";

type UserState = { id: string; email: string; nombre?: string };
type MenuDia = {
  dia: string;
  comida: { nombre: string; ingredientes: Array<{ nombre: string; cantidad_g: number }> };
  cena: { nombre: string; ingredientes: Array<{ nombre: string; cantidad_g: number }> };
};
type MenuData = { dias: MenuDia[] };

const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const DIAS_SHORT = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
function getDiaHoy() { return DIAS[new Date().getDay()===0?6:new Date().getDay()-1]; }
function getSaludo() {
  const h = new Date().getHours();
  return h<12?"Buenos días":h<20?"Buenas tardes":"Buenas noches";
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserState|null>(null);
  const [menu, setMenu] = useState<MenuData|null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [checkinDone, setCheckinDone] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [diaIdx, setDiaIdx] = useState(new Date().getDay()===0?6:new Date().getDay()-1);
  const [expandido, setExpandido] = useState<string|null>(null);
  const [nutriscore, setNutriscore] = useState<number|null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error||!data.user) { router.replace("/login"); return; }
      const [{ data: profileData },{ data: menuRows },{ data: checkin },{ data: scoreData }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id",data.user.id).single(),
        supabase.from("weekly_menus").select("menu_data").eq("user_id",data.user.id).order("created_at",{ascending:false}).limit(1),
        supabase.from("daily_checkins").select("id").eq("user_id",data.user.id).eq("date",new Date().toISOString().split("T")[0]).single(),
        supabase.from("weekly_scores").select("score").eq("user_id",data.user.id).order("week_start",{ascending:false}).limit(1).single(),
      ]);
      setUser({ id:data.user.id, email:data.user.email??"", nombre:profileData?.form_data?.full_name });
      if (menuRows?.[0]?.menu_data?.dias?.length) setMenu(menuRows[0].menu_data as MenuData);
      if (checkin) setCheckinDone(true);
      if (scoreData?.score) setNutriscore(Math.round(scoreData.score));
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleGeneratePlan() {
    if (!user?.id) return;
    setGenerating(true); setError(null);
    try {
      const res = await fetch("/api/generar-menu",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:user.id}) });
      const data = await res.json();
      if (!res.ok) { setError(data?.error??"Error al generar el menú."); setGenerating(false); return; }
      setMenu(data.menu as MenuData);
    } catch { setError("Error al generar tu plan."); }
    setGenerating(false);
  }

  if (loading) return (
    <main style={{minHeight:"100vh",background:"linear-gradient(160deg,#B2CC9C 0%,#A4BF90 30%,#B8CFA6 60%,#9EBA8A 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"var(--font-instrument, sans-serif)",fontSize:14,color:"rgba(26,46,10,0.5)"}}>Cargando...</p>
    </main>
  );

  const diaMenu = menu?.dias[diaIdx] ?? menu?.dias[0];
  const nombre = user?.nombre ?? user?.email?.split("@")[0] ?? "tú";

  return (
    <main style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse 80% 60% at 70% 10%,rgba(180,220,150,0.5) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 10% 80%,rgba(120,170,90,0.3) 0%,transparent 60%),linear-gradient(160deg,#B2CC9C 0%,#A4BF90 30%,#B8CFA6 60%,#9EBA8A 100%)",
      fontFamily:"var(--font-instrument, sans-serif)",
      position:"relative",
      padding:"32px 24px 60px",
      display:"flex",
      alignItems:"flex-start",
      justifyContent:"center",
    }}>

      {/* Orbs */}
      <div style={{position:"fixed",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,0.22),transparent 65%)",top:-200,right:-150,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(60,100,40,0.15),transparent 65%)",bottom:-100,left:-80,pointerEvents:"none",zIndex:0}}/>

      {/* Shadow under panel */}
      <div style={{position:"fixed",width:"55%",maxWidth:700,height:50,background:"rgba(30,60,15,0.2)",borderRadius:"50%",bottom:20,left:"50%",transform:"translateX(-50%)",filter:"blur(28px)",pointerEvents:"none",zIndex:0}}/>

      {/* PANEL */}
      <div style={{
        width:"100%",maxWidth:980,
        background:"linear-gradient(145deg,rgba(255,255,255,0.52),rgba(248,255,244,0.44) 50%,rgba(242,252,236,0.48))",
        backdropFilter:"blur(72px) saturate(220%) brightness(1.06)",
        WebkitBackdropFilter:"blur(72px) saturate(220%) brightness(1.06)",
        borderRadius:36,
        borderTop:"1px solid rgba(255,255,255,0.98)",
        borderLeft:"1px solid rgba(255,255,255,0.9)",
        borderRight:"1px solid rgba(255,255,255,0.75)",
        borderBottom:"1px solid rgba(255,255,255,0.6)",
        boxShadow:"0 1px 0 rgba(255,255,255,1) inset,0 60px 120px rgba(30,60,15,0.2),0 30px 60px rgba(30,60,15,0.14),0 15px 30px rgba(30,60,15,0.09),0 5px 10px rgba(30,60,15,0.07)",
        position:"relative",
        overflow:"hidden",
        zIndex:1,
        transform:"perspective(1400px) rotateX(0.8deg) translateY(-2px)",
      }}>

        {/* Specular */}
        <div style={{position:"absolute",top:0,left:"5%",right:"5%",height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.6) 15%,white 50%,rgba(255,255,255,0.6) 85%,transparent)",zIndex:20,pointerEvents:"none"}}/>

        {/* TOP NAV */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px 12px",borderBottom:"0.5px solid rgba(80,120,50,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(145deg,#5E8842,#2C4A14)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.18)"}}>
              <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:15,fontWeight:600,fontStyle:"italic"}}>N</span>
            </div>
            <span style={{fontFamily:"var(--font-playfair,serif)",fontSize:18,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.4px"}}>NutriAI</span>
          </div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            {[["Menú","#menu"],["Progreso","/progreso"],["Bienestar","/bienestar"],["Lista compra","/lista-compra"]].map(([l,h],i)=>(
              <Link key={l} href={h} style={{fontSize:13,color:i===0?"#3C6020":"rgba(26,46,10,0.32)",fontWeight:i===0?500:400,textDecoration:"none",letterSpacing:"0.01em"}}>{l}</Link>
            ))}
            <button onClick={async()=>{await supabase.auth.signOut();router.push("/login");}}
              style={{background:"linear-gradient(155deg,#5E8842,#3A5C1E)",border:"none",borderRadius:14,color:"white",fontWeight:500,cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"8px 18px",fontSize:12,letterSpacing:"0.02em",boxShadow:"0 6px 18px rgba(58,92,30,0.38),inset 0 1px 0 rgba(255,255,255,0.15)"}}>
              Salir
            </button>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(145deg,#7AAA52,#4A6B2C)",border:"2.5px solid rgba(255,255,255,0.85)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(74,107,44,0.4)"}}>
              <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:13,fontWeight:600,fontStyle:"italic"}}>{nombre[0]?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* BODY GRID */}
        <div style={{display:"grid",gridTemplateColumns:"160px 1fr 200px"}}>

          {/* SIDEBAR */}
          <div style={{padding:"20px 14px",borderRight:"0.5px solid rgba(80,120,50,0.08)",display:"flex",flexDirection:"column",gap:3,minHeight:580}}>
            <div style={{textAlign:"center",paddingBottom:18,borderBottom:"0.5px solid rgba(80,120,50,0.08)",marginBottom:14}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:"linear-gradient(145deg,#7AAA52,#3C6020)",margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid rgba(255,255,255,0.9)",boxShadow:"0 8px 20px rgba(60,96,32,0.35)"}}>
                <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:22,fontWeight:600,fontStyle:"italic"}}>{nombre[0]?.toUpperCase()}</span>
              </div>
              <p style={{fontSize:11,fontWeight:400,color:"rgba(26,46,10,0.38)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{getSaludo()},</p>
              <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:18,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.4px",fontStyle:"italic"}}>{nombre}</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:7,background:"rgba(94,136,66,0.1)",border:"1px solid rgba(94,136,66,0.22)",borderRadius:20,padding:"3px 10px"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#5E8842",boxShadow:"0 0 6px rgba(94,136,66,0.6)"}}/>
                <span style={{fontSize:9,fontWeight:600,color:"#3C6020",letterSpacing:"0.06em"}}>Plan activo</span>
              </div>
            </div>

            {[["◉","Dashboard","/dashboard",true],["◈","Menú semanal","#menu",false],["◎","Perfil clínico","/onboarding",false],["↗","Mi Progreso","/progreso",false],["✦","Mi Bienestar","/bienestar",false],["💬","Chat Nuria","/chat",false]].map(([ic,lb,hr,a])=>(
              <Link key={lb as string} href={hr as string} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:13,cursor:"pointer",background:a?"rgba(94,136,66,0.1)":"transparent",border:`1px solid ${a?"rgba(94,136,66,0.22)":"transparent"}`,marginBottom:2,textDecoration:"none"}}>
                <span style={{fontSize:13,color:a?"#3C6020":"rgba(26,46,10,0.28)"}}>{ic as string}</span>
                <span style={{fontSize:12,fontWeight:a?500:400,color:a?"#3C6020":"rgba(26,46,10,0.42)",letterSpacing:"0.01em"}}>{lb as string}</span>
              </Link>
            ))}

            <div style={{marginTop:"auto"}}>
              <div style={{background:"linear-gradient(155deg,rgba(38,58,24,0.94),rgba(24,40,12,0.97))",borderTop:"1px solid rgba(255,255,255,0.1)",borderLeft:"1px solid rgba(255,255,255,0.07)",borderRight:"1px solid rgba(0,0,0,0.2)",borderBottom:"1px solid rgba(0,0,0,0.25)",boxShadow:"0 20px 48px rgba(20,40,8,0.5),inset 0 1px 0 rgba(255,255,255,0.12)",borderRadius:16,padding:14,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.07),transparent)",pointerEvents:"none",borderRadius:"inherit"}}/>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(180,240,140,0.38)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,position:"relative",zIndex:1}}>Semana actual</p>
                <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:15,fontWeight:600,color:"rgba(210,248,180,0.82)",position:"relative",zIndex:1,letterSpacing:"-0.3px",fontStyle:"italic"}}>
                  {new Date().toLocaleDateString("es-ES",{day:"numeric",month:"long"})}
                </p>
                <div style={{height:"0.5px",background:"rgba(255,255,255,0.07)",margin:"8px 0",position:"relative",zIndex:1}}/>
                <div style={{display:"flex",justifyContent:"space-between",position:"relative",zIndex:1}}>
                  <span style={{fontSize:10,color:"rgba(180,240,140,0.32)",fontWeight:300}}>NutriScore</span>
                  <span style={{fontSize:10,color:"rgba(180,240,140,0.5)",fontWeight:600}}>{nutriscore?`${nutriscore}/100`:"—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div style={{padding:"22px 22px",display:"flex",flexDirection:"column",gap:14,borderRight:"0.5px solid rgba(80,120,50,0.08)"}}>

            {/* Header */}
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
              <div>
                <p style={{fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(26,46,10,0.32)",marginBottom:6}}>
                  {new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}
                </p>
                <h2 style={{fontFamily:"var(--font-playfair,serif)",fontSize:28,color:"#1A2E0A",letterSpacing:"-0.5px",lineHeight:1.05,fontWeight:600}}>
                  Tu plan de hoy
                </h2>
              </div>
              <div style={{display:"flex",gap:7,paddingBottom:4}}>
                <div style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,1)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:"1px solid rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(255,255,255,0.55)",borderRadius:50,boxShadow:"0 6px 20px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",display:"flex",alignItems:"center",gap:5,padding:"5px 13px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:checkinDone?"#5E8842":"rgba(26,46,10,0.2)",boxShadow:checkinDone?"0 0 6px rgba(94,136,66,0.5)":"none"}}/>
                  <span style={{fontSize:11,fontWeight:500,color:"#1A2E0A"}}>{checkinDone?"Check-in hecho":"Sin check-in"}</span>
                </div>
                <Link href="/lista-compra" style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,1)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:"1px solid rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(255,255,255,0.55)",borderRadius:50,boxShadow:"0 6px 20px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",display:"flex",alignItems:"center",gap:5,padding:"5px 13px",textDecoration:"none"}}>
                  <span style={{fontSize:11,fontWeight:500,color:"#1A2E0A"}}>Lista compra ◎</span>
                </Link>
              </div>
            </div>

            {/* Check-in */}
            {!checkinDone && (
              <div style={{background:"rgba(255,255,255,0.58)",backdropFilter:"blur(40px) saturate(180%)",borderTop:"1px solid rgba(255,255,255,0.98)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:"1px solid rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(255,255,255,0.55)",boxShadow:"0 8px 28px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",borderRadius:20,padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.3px"}}>Check-in de hoy</p>
                    <p style={{fontSize:11,color:"rgba(26,46,10,0.38)",marginTop:3,fontWeight:300}}>Cuéntale a Nuria cómo estás hoy</p>
                  </div>
                  <button onClick={()=>setShowCheckin(!showCheckin)}
                    style={{background:"linear-gradient(155deg,#5E8842,#3A5C1E)",border:"none",borderRadius:14,color:"white",fontWeight:500,cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"8px 18px",fontSize:12,boxShadow:"0 6px 18px rgba(58,92,30,0.38),inset 0 1px 0 rgba(255,255,255,0.15)"}}>
                    {showCheckin?"Cerrar":"Registrar"}
                  </button>
                </div>
                {showCheckin && (
                  <div style={{marginTop:16,paddingTop:16,borderTop:"0.5px solid rgba(80,120,50,0.1)"}}>
                    <DailyCheckin onComplete={()=>{setCheckinDone(true);setShowCheckin(false);}}/>
                  </div>
                )}
              </div>
            )}

            {/* Menú semanal */}
            <div id="menu" style={{background:"rgba(255,255,255,0.58)",backdropFilter:"blur(40px) saturate(180%)",borderTop:"1px solid rgba(255,255,255,0.98)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:"1px solid rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(255,255,255,0.55)",boxShadow:"0 8px 28px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",borderRadius:20,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 20%,white 50%,rgba(255,255,255,0.95) 80%,transparent)",pointerEvents:"none"}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <p style={{fontSize:14,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.3px"}}>Menú semanal</p>
                  {menu && <p style={{fontSize:10,color:"rgba(26,46,10,0.35)",marginTop:3,fontWeight:300}}>Generado por Nuria · actualizado esta semana</p>}
                </div>
                {menu && (
                  <button onClick={handleGeneratePlan} disabled={generating}
                    style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(255,255,255,0.98)",borderBottom:"1px solid rgba(255,255,255,0.6)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:"1px solid rgba(255,255,255,0.6)",borderRadius:13,cursor:"pointer",boxShadow:"0 4px 14px rgba(30,60,15,0.08),inset 0 1px 0 rgba(255,255,255,1)",color:"#2A3E16",fontWeight:500,fontFamily:"var(--font-instrument,sans-serif)",padding:"7px 16px",fontSize:11}}>
                    {generating?"Generando...":"Regenerar"}
                  </button>
                )}
              </div>

              {!menu ? (
                <div style={{textAlign:"center",padding:"40px 20px",background:"rgba(94,136,66,0.05)",borderRadius:16,border:"1.5px dashed rgba(94,136,66,0.2)"}}>
                  <p style={{fontSize:32,marginBottom:12}}>🌿</p>
                  <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:18,color:"#1A2E0A",fontStyle:"italic",marginBottom:8}}>Aún no tienes menú</p>
                  <p style={{fontSize:12,color:"rgba(26,46,10,0.38)",fontWeight:300,marginBottom:20}}>Nuria generará tu plan personalizado en segundos</p>
                  <button onClick={handleGeneratePlan} disabled={generating}
                    style={{background:"linear-gradient(155deg,#5E8842,#3A5C1E)",border:"none",borderRadius:16,color:"white",fontWeight:500,cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"12px 28px",fontSize:13,boxShadow:"0 8px 22px rgba(58,92,30,0.42),inset 0 1px 0 rgba(255,255,255,0.16)"}}>
                    {generating?"Nuria está preparando tu plan...":"Generar mi plan personalizado"}
                  </button>
                </div>
              ) : (
                <>
                  {/* Selector días */}
                  <div style={{display:"flex",gap:6,marginBottom:16}}>
                    {DIAS_SHORT.map((d,i)=>(
                      <button key={d} onClick={()=>setDiaIdx(i)}
                        style={{flex:1,textAlign:"center",padding:"8px 4px",borderRadius:13,cursor:"pointer",background:diaIdx===i?"linear-gradient(145deg,#5E8842,#3A5C1E)":"rgba(255,255,255,0.55)",border:`1px solid ${diaIdx===i?"rgba(180,230,140,0.2)":"rgba(255,255,255,0.9)"}`,boxShadow:diaIdx===i?"0 6px 18px rgba(58,92,30,0.35),inset 0 1px 0 rgba(255,255,255,0.14)":"0 3px 10px rgba(30,60,15,0.06),inset 0 1px 0 rgba(255,255,255,1)"}}>
                        <p style={{fontSize:11,fontWeight:diaIdx===i?600:400,color:diaIdx===i?"white":"rgba(26,46,10,0.42)"}}>{d}</p>
                        <div style={{width:4,height:4,borderRadius:"50%",margin:"4px auto 0",background:i<5?(diaIdx===i?"rgba(255,255,255,0.6)":"rgba(94,136,66,0.4)"):"transparent"}}/>
                      </button>
                    ))}
                  </div>

                  {/* Platos */}
                  {diaMenu && (
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      {[{tipo:"Comida",plato:diaMenu.comida,emoji:"☀️"},{tipo:"Cena",plato:diaMenu.cena,emoji:"🌙"}].map(({tipo,plato,emoji})=>(
                        <div key={tipo} style={{background:expandido===`${diaIdx}-${tipo}`?"rgba(255,255,255,0.72)":"rgba(255,255,255,0.55)",borderTop:"1px solid rgba(255,255,255,0.98)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:expandido===`${diaIdx}-${tipo}`?"1px solid rgba(94,136,66,0.18)":"1px solid rgba(255,255,255,0.7)",borderBottom:expandido===`${diaIdx}-${tipo}`?"1px solid rgba(94,136,66,0.12)":"1px solid rgba(255,255,255,0.55)",borderRadius:18,overflow:"hidden",boxShadow:"0 4px 16px rgba(30,60,15,0.07),inset 0 1px 0 rgba(255,255,255,1)"}}>
                          <button onClick={()=>setExpandido(expandido===`${diaIdx}-${tipo}`?null:`${diaIdx}-${tipo}`)}
                            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                            <div style={{display:"flex",alignItems:"center",gap:13}}>
                              <div style={{width:46,height:46,borderRadius:14,background:"rgba(94,136,66,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:"1px solid rgba(255,255,255,0.9)"}}>
                                {emoji}
                              </div>
                              <div>
                                <p style={{fontSize:9,fontWeight:600,color:"rgba(26,46,10,0.35)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{tipo}</p>
                                <p style={{fontSize:14,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.3px"}}>{plato.nombre}</p>
                                <p style={{fontSize:10,color:"rgba(26,46,10,0.35)",marginTop:3,fontWeight:300}}>{plato.ingredientes.length} ingredientes</p>
                              </div>
                            </div>
                            <span style={{color:"rgba(26,46,10,0.25)",fontSize:18,fontWeight:300}}>{expandido===`${diaIdx}-${tipo}`?"−":"+"}</span>
                          </button>
                          {expandido===`${diaIdx}-${tipo}` && (
                            <div style={{padding:"0 18px 16px",borderTop:"0.5px solid rgba(94,136,66,0.1)"}}>
                              <div style={{paddingTop:12,display:"flex",flexDirection:"column",gap:6}}>
                                {plato.ingredientes.map(ing=>(
                                  <div key={ing.nombre} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(26,46,10,0.65)"}}>
                                    <span style={{fontWeight:400}}>{ing.nombre}</span>
                                    <span style={{color:"rgba(26,46,10,0.35)",fontWeight:300}}>{ing.cantidad_g}g</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {error && <p style={{marginTop:12,fontSize:12,color:"#8B2020"}}>{error}</p>}
            </div>

          </div>

          {/* RIGHT */}
          <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:12}}>

            {/* NutriScore */}
            <div style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(40px) saturate(180%)",borderTop:"1px solid rgba(255,255,255,0.98)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:"1px solid rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(255,255,255,0.55)",boxShadow:"0 8px 28px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",borderRadius:20,padding:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 20%,white 50%,rgba(255,255,255,0.95) 80%,transparent)",pointerEvents:"none"}}/>
              <p style={{fontSize:9,fontWeight:600,color:"rgba(26,46,10,0.3)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:14}}>NutriScore semanal</p>
              <NutriScoreCard />
            </div>

            {/* Accesos */}
            <div style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(40px) saturate(180%)",borderTop:"1px solid rgba(255,255,255,0.98)",borderLeft:"1px solid rgba(255,255,255,0.9)",borderRight:"1px solid rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(255,255,255,0.55)",boxShadow:"0 8px 28px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",borderRadius:20,padding:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 20%,white 50%,rgba(255,255,255,0.95) 80%,transparent)",pointerEvents:"none"}}/>
              <p style={{fontSize:9,fontWeight:600,color:"rgba(26,46,10,0.3)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:13}}>Accesos rápidos</p>
              {[["✦","Mi Bienestar","/bienestar","Cuerpo · Día · Mente · Ciclo","rgba(94,136,66,0.1)","#3C6020"],
                ["↗","Mi Progreso","/progreso","Gráficas y evolución","rgba(74,130,180,0.07)","#4A7A9A"],
                ["◎","Lista compra","/lista-compra","Del menú semanal","rgba(140,170,80,0.07)","#6A8A40"],
                ["◈","Chat Nuria","/chat","Tu nutricionista 24h","rgba(94,136,66,0.1)","#3C6020"],
                ["◉","Perfil clínico","/onboarding","Actualizar mi formulario","rgba(120,100,80,0.07)","#7A6040"],
              ].map(([ic,lb,hr,desc,bg,c])=>(
                <Link key={lb as string} href={hr as string} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 11px",borderRadius:14,background:bg as string,border:"1px solid rgba(255,255,255,0.88)",marginBottom:6,cursor:"pointer",textDecoration:"none",boxShadow:"0 2px 8px rgba(30,60,15,0.05),inset 0 1px 0 rgba(255,255,255,0.95)"}}>
                  <span style={{width:30,height:30,borderRadius:9,background:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:c as string,fontWeight:700,flexShrink:0,border:"0.5px solid rgba(255,255,255,0.95)",boxShadow:"0 2px 6px rgba(60,90,40,0.06)"}}>{ic as string}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:12,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.2px"}}>{lb as string}</p>
                    <p style={{fontSize:10,color:"rgba(26,46,10,0.35)",marginTop:1,fontWeight:300}}>{desc as string}</p>
                  </div>
                  <span style={{color:"rgba(26,46,10,0.2)",fontSize:14}}>›</span>
                </Link>
              ))}
            </div>

            {/* Nuria tip */}
            <div style={{background:"linear-gradient(155deg,#5E8842,#3C6020 50%,#2C4A14)",borderTop:"1px solid rgba(180,240,140,0.2)",borderLeft:"1px solid rgba(180,240,140,0.12)",borderRight:"1px solid rgba(0,0,0,0.15)",borderBottom:"1px solid rgba(0,0,0,0.18)",boxShadow:"0 14px 36px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.14)",borderRadius:20,padding:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"38%",background:"linear-gradient(180deg,rgba(255,255,255,0.1),transparent)",pointerEvents:"none",borderRadius:"inherit"}}/>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11,position:"relative",zIndex:1}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(145deg,#B8D870,#5E8842)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(184,216,112,0.45)"}}>
                  <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:13,fontWeight:600,fontStyle:"italic"}}>N</span>
                </div>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(200,248,160,0.5)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Nuria</p>
              </div>
              <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:13,color:"rgba(215,248,185,0.52)",lineHeight:1.65,position:"relative",zIndex:1,fontStyle:"italic",fontWeight:400}}>
                "Completa tu check-in diario para que pueda ajustar tu plan cada semana."
              </p>
              <Link href="/chat" style={{marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1,textDecoration:"none"}}>
                <span style={{fontSize:11,color:"rgba(185,248,145,0.62)",fontWeight:500,letterSpacing:"0.02em"}}>Hablar con Nuria</span>
                <span style={{color:"rgba(185,248,145,0.62)",fontSize:14}}>→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

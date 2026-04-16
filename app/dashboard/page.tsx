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

const DIAS_SHORT = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
function getDiaIdx() { return new Date().getDay()===0?6:new Date().getDay()-1; }
function getSaludo() {
  const h = new Date().getHours();
  return h<12?"Buenos días":h<20?"Buenas tardes":"Buenas noches";
}

const G = {
  panel: {
    background:"linear-gradient(145deg,rgba(255,255,255,0.52),rgba(248,255,244,0.44) 50%,rgba(242,252,236,0.48))",
    backdropFilter:"blur(72px) saturate(220%) brightness(1.06)",
    WebkitBackdropFilter:"blur(72px) saturate(220%) brightness(1.06)",
    borderTop:"1px solid rgba(255,255,255,0.98)",
    borderLeft:"1px solid rgba(255,255,255,0.9)",
    borderRight:"1px solid rgba(255,255,255,0.75)",
    borderBottom:"1px solid rgba(255,255,255,0.6)",
    boxShadow:"0 1px 0 rgba(255,255,255,1) inset,0 60px 120px rgba(30,60,15,0.2),0 30px 60px rgba(30,60,15,0.14),0 15px 30px rgba(30,60,15,0.09),0 5px 10px rgba(30,60,15,0.07)",
  },
  card: {
    background:"rgba(255,255,255,0.58)",
    backdropFilter:"blur(40px) saturate(180%)",
    WebkitBackdropFilter:"blur(40px) saturate(180%)",
    borderTop:"1px solid rgba(255,255,255,0.98)",
    borderLeft:"1px solid rgba(255,255,255,0.9)",
    borderRight:"1px solid rgba(255,255,255,0.7)",
    borderBottom:"1px solid rgba(255,255,255,0.55)",
    boxShadow:"0 8px 28px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",
  },
  dark: {
    background:"linear-gradient(155deg,rgba(38,58,24,0.94),rgba(24,40,12,0.97))",
    borderTop:"1px solid rgba(255,255,255,0.1)",
    borderLeft:"1px solid rgba(255,255,255,0.07)",
    borderRight:"1px solid rgba(0,0,0,0.2)",
    borderBottom:"1px solid rgba(0,0,0,0.25)",
    boxShadow:"0 20px 48px rgba(20,40,8,0.5),inset 0 1px 0 rgba(255,255,255,0.12)",
  },
  matcha: {
    background:"linear-gradient(155deg,#5E8842,#3C6020 50%,#2C4A14)",
    borderTop:"1px solid rgba(180,240,140,0.2)",
    borderLeft:"1px solid rgba(180,240,140,0.12)",
    borderRight:"1px solid rgba(0,0,0,0.15)",
    borderBottom:"1px solid rgba(0,0,0,0.18)",
    boxShadow:"0 14px 36px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.14)",
  },
  pill: {
    background:"rgba(255,255,255,0.72)",
    backdropFilter:"blur(24px)",
    WebkitBackdropFilter:"blur(24px)",
    borderTop:"1px solid rgba(255,255,255,1)",
    borderLeft:"1px solid rgba(255,255,255,0.9)",
    borderRight:"1px solid rgba(255,255,255,0.7)",
    borderBottom:"1px solid rgba(255,255,255,0.55)",
    borderRadius:50,
    boxShadow:"0 6px 20px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",
  },
  btnM: {
    background:"linear-gradient(155deg,#5E8842,#3A5C1E)",
    border:"none",
    borderRadius:14,
    color:"white",
    fontWeight:500,
    cursor:"pointer",
    fontFamily:"var(--font-instrument,sans-serif)",
    boxShadow:"0 6px 18px rgba(58,92,30,0.38),inset 0 1px 0 rgba(255,255,255,0.15)",
  },
  btnW: {
    background:"rgba(255,255,255,0.7)",
    backdropFilter:"blur(16px)",
    WebkitBackdropFilter:"blur(16px)",
    borderTop:"1px solid rgba(255,255,255,0.98)",
    borderBottom:"1px solid rgba(255,255,255,0.6)",
    borderLeft:"1px solid rgba(255,255,255,0.9)",
    borderRight:"1px solid rgba(255,255,255,0.6)",
    borderRadius:13,
    cursor:"pointer",
    boxShadow:"0 4px 14px rgba(30,60,15,0.08),inset 0 1px 0 rgba(255,255,255,1)",
    color:"#2A3E16",
    fontWeight:500,
    fontFamily:"var(--font-instrument,sans-serif)",
  },
};

const shine = {position:"absolute" as const,top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 20%,white 50%,rgba(255,255,255,0.95) 80%,transparent)",pointerEvents:"none" as const};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserState|null>(null);
  const [menu, setMenu] = useState<MenuData|null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [checkinDone, setCheckinDone] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [diaIdx, setDiaIdx] = useState(getDiaIdx());
  const [expandido, setExpandido] = useState<string|null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error||!data.user) { router.replace("/login"); return; }
      const [{ data: profileData },{ data: menuRows },{ data: checkin }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id",data.user.id).single(),
        supabase.from("weekly_menus").select("menu_data").eq("user_id",data.user.id).order("created_at",{ascending:false}).limit(1),
        supabase.from("daily_checkins").select("id").eq("user_id",data.user.id).eq("date",new Date().toISOString().split("T")[0]).single(),
      ]);
      setUser({ id:data.user.id, email:data.user.email??"", nombre:profileData?.form_data?.full_name });
      if (menuRows?.[0]?.menu_data?.dias?.length) setMenu(menuRows[0].menu_data as MenuData);
      if (checkin) setCheckinDone(true);
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
      <p style={{fontFamily:"var(--font-instrument,sans-serif)",fontSize:14,color:"rgba(26,46,10,0.4)",fontWeight:300}}>Cargando...</p>
    </main>
  );

  const nombre = user?.nombre ?? user?.email?.split("@")[0] ?? "tú";
  const diaMenu = menu?.dias[diaIdx] ?? menu?.dias[0];

  return (
    <main style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse 80% 60% at 70% 10%,rgba(180,220,150,0.5) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 10% 80%,rgba(120,170,90,0.3) 0%,transparent 60%),linear-gradient(160deg,#B2CC9C 0%,#A4BF90 30%,#B8CFA6 60%,#9EBA8A 100%)",
      fontFamily:"var(--font-instrument,sans-serif)",
      position:"relative",
      padding:"24px 20px 52px",
      display:"flex",
      alignItems:"flex-start",
      justifyContent:"center",
    }}>

      {/* Orbs */}
      <div style={{position:"fixed",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,0.22),transparent 65%)",top:-200,right:-150,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(60,100,40,0.15),transparent 65%)",bottom:-100,left:-80,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(180,220,140,0.12),transparent 65%)",top:"35%",left:"35%",pointerEvents:"none",zIndex:0}}/>

      {/* Panel shadow */}
      <div style={{position:"fixed",width:"55%",maxWidth:720,height:55,background:"rgba(30,60,15,0.2)",borderRadius:"50%",bottom:18,left:"50%",transform:"translateX(-50%)",filter:"blur(30px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:"40%",maxWidth:540,height:24,background:"rgba(30,60,15,0.12)",borderRadius:"50%",bottom:26,left:"50%",transform:"translateX(-50%)",filter:"blur(14px)",pointerEvents:"none",zIndex:0}}/>

      {/* MAIN PANEL */}
      <div style={{...G.panel, width:"100%",maxWidth:1020,borderRadius:36,position:"relative",overflow:"hidden",zIndex:1,transform:"perspective(1400px) rotateX(0.8deg) translateY(-2px)"}}>
        <div style={shine}/>

        {/* NAV */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 28px 12px",borderBottom:"0.5px solid rgba(80,120,50,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:10,...G.matcha,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.18)"}}>
              <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:15,fontWeight:600,fontStyle:"italic"}}>N</span>
            </div>
            <span style={{fontFamily:"var(--font-playfair,serif)",fontSize:18,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.4px"}}>NutriAI</span>
          </div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            {([["Menú","#menu"],["Progreso","/progreso"],["Bienestar","/bienestar"],["Lista compra","/lista-compra"]] as [string,string][]).map(([l,h],i)=>(
              <Link key={l} href={h} style={{fontSize:13,color:i===0?"#3C6020":"rgba(26,46,10,0.32)",fontWeight:i===0?500:400,textDecoration:"none",letterSpacing:"0.01em"}}>{l}</Link>
            ))}
            <button onClick={async()=>{await supabase.auth.signOut();router.push("/login");}}
              style={{...G.btnM,padding:"8px 18px",fontSize:12,letterSpacing:"0.02em"}}>
              Salir
            </button>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(145deg,#7AAA52,#4A6B2C)",border:"2.5px solid rgba(255,255,255,0.85)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(74,107,44,0.4)"}}>
              <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:13,fontWeight:600,fontStyle:"italic"}}>{nombre[0]?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{display:"grid",gridTemplateColumns:"148px 1fr 196px"}}>

          {/* SIDEBAR */}
          <div style={{
            padding:"20px 12px",
            borderRight:"0.5px solid rgba(80,120,50,0.08)",
            display:"flex",flexDirection:"column",gap:2,
            minHeight:600,
            background:"rgba(255,255,255,0.15)",
          }}>
            <div style={{textAlign:"center",paddingBottom:18,borderBottom:"0.5px solid rgba(80,120,50,0.08)",marginBottom:14}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(145deg,#7AAA52,#3C6020)",margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid rgba(255,255,255,0.9)",boxShadow:"0 8px 20px rgba(60,96,32,0.35)"}}>
                <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:22,fontWeight:600,fontStyle:"italic"}}>{nombre[0]?.toUpperCase()}</span>
              </div>
              <p style={{fontSize:10,fontWeight:400,color:"rgba(26,46,10,0.35)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>{getSaludo()}</p>
              <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:17,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.4px",fontStyle:"italic"}}>{nombre}</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:6,...G.pill,padding:"3px 10px"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#5E8842",boxShadow:"0 0 6px rgba(94,136,66,0.6)"}}/>
                <span style={{fontSize:9,fontWeight:600,color:"#3C6020",letterSpacing:"0.06em"}}>Plan activo</span>
              </div>
            </div>

            {([["◉","Dashboard","/dashboard",true],["◈","Menú","#menu",false],["◎","Perfil clínico","/onboarding",false],["↗","Progreso","/progreso",false],["✦","Bienestar","/bienestar",false],["💬","Nuria","/chat",false]] as [string,string,string,boolean][]).map(([ic,lb,hr,a])=>(
              <Link key={lb} href={hr} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:12,cursor:"pointer",background:a?"rgba(94,136,66,0.12)":"transparent",border:`1px solid ${a?"rgba(94,136,66,0.22)":"transparent"}`,marginBottom:2,textDecoration:"none"}}>
                <span style={{fontSize:12,color:a?"#3C6020":"rgba(26,46,10,0.28)",flexShrink:0}}>{ic}</span>
                <span style={{fontSize:12,fontWeight:a?500:400,color:a?"#3C6020":"rgba(26,46,10,0.42)",letterSpacing:"0.01em",whiteSpace:"nowrap"}}>{lb}</span>
              </Link>
            ))}

            <div style={{marginTop:"auto",paddingTop:12}}>
              <div style={{...G.dark,borderRadius:16,padding:14,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.07),transparent)",pointerEvents:"none",borderRadius:"inherit"}}/>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(180,240,140,0.38)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,position:"relative",zIndex:1}}>Hoy</p>
                <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:14,fontWeight:600,color:"rgba(210,248,180,0.82)",position:"relative",zIndex:1,letterSpacing:"-0.3px",fontStyle:"italic"}}>
                  {new Date().toLocaleDateString("es-ES",{weekday:"long"})}
                </p>
                <div style={{height:"0.5px",background:"rgba(255,255,255,0.07)",margin:"8px 0",position:"relative",zIndex:1}}/>
                <p style={{fontSize:10,color:"rgba(180,240,140,0.32)",fontWeight:300,position:"relative",zIndex:1}}>
                  {new Date().toLocaleDateString("es-ES",{day:"numeric",month:"long"})}
                </p>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div style={{padding:"22px 22px",display:"flex",flexDirection:"column",gap:14,borderRight:"0.5px solid rgba(80,120,50,0.08)"}}>

            {/* Hero header */}
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
              <div>
                <p style={{fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(26,46,10,0.3)",marginBottom:6}}>
                  {new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}
                </p>
                <h1 style={{fontFamily:"var(--font-playfair,serif)",fontSize:32,color:"#1A2E0A",letterSpacing:"-1px",lineHeight:1,fontWeight:600}}>
                  Tu plan de hoy
                </h1>
              </div>
              <div style={{display:"flex",gap:7,paddingBottom:4}}>
                <div style={{...G.pill,display:"flex",alignItems:"center",gap:5,padding:"5px 13px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:checkinDone?"#5E8842":"rgba(26,46,10,0.2)",boxShadow:checkinDone?"0 0 6px rgba(94,136,66,0.5)":"none"}}/>
                  <span style={{fontSize:11,fontWeight:500,color:"#1A2E0A"}}>{checkinDone?"Check-in ✓":"Sin check-in"}</span>
                </div>
                <Link href="/lista-compra" style={{...G.pill,display:"flex",alignItems:"center",gap:5,padding:"5px 13px",textDecoration:"none"}}>
                  <span style={{fontSize:11,fontWeight:500,color:"#1A2E0A"}}>Lista compra ◎</span>
                </Link>
              </div>
            </div>

            {/* Macros del día */}
            {diaMenu && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
                {[
                  {label:"Calorías est.",value:"~800",sub:"kcal hoy",color:"#5E8842"},
                  {label:"Proteína",value:"~56g",sub:"objetivo",color:"#7AAA52"},
                  {label:"Comidas",value:"2",sub:"planificadas",color:"#9AC872"},
                  {label:"Semana",value:`${diaIdx+1}/7`,sub:"días",color:"#5E8842"},
                ].map(({label,value,sub,color})=>(
                  <div key={label} style={{...G.card,borderRadius:16,padding:"12px 14px",position:"relative",overflow:"hidden"}}>
                    <div style={shine}/>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)`,opacity:0.6}}/>
                    <p style={{fontSize:9,fontWeight:600,color:"rgba(26,46,10,0.32)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{label}</p>
                    <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:22,fontWeight:600,color:"#1A2E0A",letterSpacing:"-1px",lineHeight:1}}>{value}</p>
                    <p style={{fontSize:10,color:"rgba(26,46,10,0.32)",marginTop:4,fontWeight:300}}>{sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Check-in */}
            {!checkinDone && (
              <div style={{...G.card,borderRadius:20,padding:"14px 18px",position:"relative",overflow:"hidden"}}>
                <div style={shine}/>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.3px"}}>Check-in de hoy</p>
                    <p style={{fontSize:11,color:"rgba(26,46,10,0.38)",marginTop:3,fontWeight:300}}>Cuéntale a Nuria cómo estás</p>
                  </div>
                  <button onClick={()=>setShowCheckin(!showCheckin)}
                    style={{...G.btnM,padding:"8px 18px",fontSize:12}}>
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

            {/* Menú */}
            <div id="menu" style={{...G.card,borderRadius:20,padding:"18px 20px",position:"relative",overflow:"hidden",flex:1}}>
              <div style={shine}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <p style={{fontSize:14,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.3px"}}>Menú semanal</p>
                  {menu && <p style={{fontSize:10,color:"rgba(26,46,10,0.32)",marginTop:2,fontWeight:300}}>Generado por Nuria</p>}
                </div>
                {menu && (
                  <button onClick={handleGeneratePlan} disabled={generating} style={{...G.btnW,padding:"7px 16px",fontSize:11}}>
                    {generating?"Generando...":"Regenerar"}
                  </button>
                )}
              </div>

              {!menu ? (
                <div style={{textAlign:"center",padding:"36px 20px",background:"rgba(94,136,66,0.04)",borderRadius:16,border:"1.5px dashed rgba(94,136,66,0.18)"}}>
                  <p style={{fontSize:28,marginBottom:10}}>🌿</p>
                  <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:17,color:"#1A2E0A",fontStyle:"italic",marginBottom:8}}>Aún no tienes menú</p>
                  <p style={{fontSize:12,color:"rgba(26,46,10,0.35)",fontWeight:300,marginBottom:20}}>Nuria generará tu plan en segundos</p>
                  <button onClick={handleGeneratePlan} disabled={generating}
                    style={{...G.btnM,padding:"12px 28px",fontSize:13,borderRadius:16}}>
                    {generating?"Preparando tu plan...":"Generar mi plan personalizado"}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{display:"flex",gap:5,marginBottom:16}}>
                    {DIAS_SHORT.map((d,i)=>(
                      <button key={d} onClick={()=>setDiaIdx(i)}
                        style={{flex:1,textAlign:"center",padding:"8px 4px",borderRadius:12,cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",
                          background:diaIdx===i?"linear-gradient(145deg,#5E8842,#3A5C1E)":"rgba(255,255,255,0.55)",
                          border:`1px solid ${diaIdx===i?"rgba(180,230,140,0.2)":"rgba(255,255,255,0.9)"}`,
                          boxShadow:diaIdx===i?"0 6px 18px rgba(58,92,30,0.35),inset 0 1px 0 rgba(255,255,255,0.14)":"0 3px 10px rgba(30,60,15,0.06),inset 0 1px 0 rgba(255,255,255,1)"}}>
                        <p style={{fontSize:11,fontWeight:diaIdx===i?600:400,color:diaIdx===i?"white":"rgba(26,46,10,0.42)"}}>{d}</p>
                        <div style={{width:4,height:4,borderRadius:"50%",margin:"4px auto 0",background:i<5?(diaIdx===i?"rgba(255,255,255,0.6)":"rgba(94,136,66,0.35)"):"transparent"}}/>
                      </button>
                    ))}
                  </div>

                  {diaMenu && (
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      {[
                        {tipo:"Comida",plato:diaMenu.comida,emoji:"☀️"},
                        {tipo:"Cena",plato:diaMenu.cena,emoji:"🌙"}
                      ].map(({tipo,plato,emoji})=>(
                        <div key={tipo} style={{
                          ...G.card,
                          borderRadius:18,overflow:"hidden",
                          borderRight:expandido===`${diaIdx}-${tipo}`?"1px solid rgba(94,136,66,0.18)":G.card.borderRight,
                          borderBottom:expandido===`${diaIdx}-${tipo}`?"1px solid rgba(94,136,66,0.12)":G.card.borderBottom,
                          position:"relative",
                        }}>
                          {expandido===`${diaIdx}-${tipo}` && <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(94,136,66,0.5) 30%,rgba(94,136,66,0.7) 50%,rgba(94,136,66,0.5) 70%,transparent)"}}/>}
                          <button onClick={()=>setExpandido(expandido===`${diaIdx}-${tipo}`?null:`${diaIdx}-${tipo}`)}
                            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"var(--font-instrument,sans-serif)"}}>
                            <div style={{display:"flex",alignItems:"center",gap:12}}>
                              <div style={{width:46,height:46,borderRadius:14,background:"rgba(94,136,66,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:"1px solid rgba(255,255,255,0.9)"}}>
                                {emoji}
                              </div>
                              <div>
                                <p style={{fontSize:9,fontWeight:600,color:"rgba(26,46,10,0.32)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{tipo}</p>
                                <p style={{fontSize:15,fontWeight:600,color:"#1A2E0A",letterSpacing:"-0.4px"}}>{plato.nombre}</p>
                                <p style={{fontSize:10,color:"rgba(26,46,10,0.32)",marginTop:3,fontWeight:300}}>{plato.ingredientes.length} ingredientes</p>
                              </div>
                            </div>
                            <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.9)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <span style={{color:"rgba(26,46,10,0.3)",fontSize:16,fontWeight:300,lineHeight:1}}>{expandido===`${diaIdx}-${tipo}`?"−":"+"}</span>
                            </div>
                          </button>
                          {expandido===`${diaIdx}-${tipo}` && (
                            <div style={{padding:"0 16px 14px",borderTop:"0.5px solid rgba(94,136,66,0.08)"}}>
                              <div style={{paddingTop:12,display:"flex",flexDirection:"column",gap:7}}>
                                {plato.ingredientes.map(ing=>(
                                  <div key={ing.nombre} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <span style={{fontSize:13,color:"rgba(26,46,10,0.65)",fontWeight:400}}>{ing.nombre}</span>
                                    <span style={{fontSize:12,color:"rgba(26,46,10,0.32)",fontWeight:300,background:"rgba(94,136,66,0.06)",padding:"2px 8px",borderRadius:8}}>{ing.cantidad_g}g</span>
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
              {error && <p style={{marginTop:12,fontSize:12,color:"#8B2020",fontWeight:300}}>{error}</p>}
            </div>

          </div>

          {/* RIGHT */}
          <div style={{padding:"18px 14px",display:"flex",flexDirection:"column",gap:12}}>

            {/* NutriScore */}
            <div style={{...G.card,borderRadius:20,padding:18,position:"relative",overflow:"hidden"}}>
              <div style={shine}/>
              <p style={{fontSize:9,fontWeight:600,color:"rgba(26,46,10,0.28)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:14}}>NutriScore semanal</p>
              <NutriScoreCard />
            </div>

            {/* Accesos */}
            <div style={{...G.card,borderRadius:20,padding:"16px 14px",position:"relative",overflow:"hidden"}}>
              <div style={shine}/>
              <p style={{fontSize:9,fontWeight:600,color:"rgba(26,46,10,0.28)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>Accesos rápidos</p>
              {([
                ["✦","Bienestar","/bienestar","rgba(94,136,66,0.1)","#3C6020"],
                ["↗","Progreso","/progreso","rgba(74,130,180,0.08)","#4A7A9A"],
                ["◎","Lista compra","/lista-compra","rgba(140,170,80,0.08)","#6A8A40"],
                ["◈","Chat Nuria","/chat","rgba(94,136,66,0.1)","#3C6020"],
                ["◉","Perfil","/onboarding","rgba(120,100,80,0.07)","#7A6040"],
              ] as [string,string,string,string,string][]).map(([ic,lb,hr,bg,c])=>(
                <Link key={lb} href={hr} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:13,background:bg,border:"1px solid rgba(255,255,255,0.88)",marginBottom:6,cursor:"pointer",textDecoration:"none",boxShadow:"0 2px 8px rgba(30,60,15,0.05),inset 0 1px 0 rgba(255,255,255,0.95)"}}>
                  <span style={{width:28,height:28,borderRadius:8,background:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:c,fontWeight:700,flexShrink:0,border:"0.5px solid rgba(255,255,255,0.95)",boxShadow:"0 2px 6px rgba(60,90,40,0.06)"}}>{ic}</span>
                  <span style={{fontSize:12,fontWeight:500,color:"#1A2E0A",letterSpacing:"-0.2px"}}>{lb}</span>
                  <span style={{color:"rgba(26,46,10,0.2)",fontSize:13,marginLeft:"auto"}}>›</span>
                </Link>
              ))}
            </div>

            {/* Nuria */}
            <div style={{...G.matcha,borderRadius:20,padding:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"38%",background:"linear-gradient(180deg,rgba(255,255,255,0.1),transparent)",pointerEvents:"none",borderRadius:"inherit"}}/>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,position:"relative",zIndex:1}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(145deg,#B8D870,#5E8842)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(184,216,112,0.45)"}}>
                  <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:13,fontWeight:600,fontStyle:"italic"}}>N</span>
                </div>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(200,248,160,0.5)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Nuria</p>
              </div>
              <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:13,color:"rgba(215,248,185,0.52)",lineHeight:1.65,position:"relative",zIndex:1,fontStyle:"italic",fontWeight:400}}>
                "Completa tu check-in para que pueda ajustar tu plan cada semana."
              </p>
              <Link href="/chat" style={{marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1,textDecoration:"none"}}>
                <span style={{fontSize:11,color:"rgba(185,248,145,0.62)",fontWeight:500}}>Hablar con Nuria</span>
                <span style={{color:"rgba(185,248,145,0.62)",fontSize:14}}>→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

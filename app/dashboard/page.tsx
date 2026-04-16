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
  panel: { background:"linear-gradient(145deg,rgba(18,18,14,0.97),rgba(12,12,8,0.99))", border:"1px solid rgba(198,169,107,0.15)", boxShadow:"0 60px 120px rgba(0,0,0,0.7),0 30px 60px rgba(0,0,0,0.5),0 1px 0 rgba(198,169,107,0.1) inset" },
  card: { background:"linear-gradient(145deg,rgba(22,22,18,0.92),rgba(14,14,10,0.97))", border:"1px solid rgba(198,169,107,0.08)", boxShadow:"0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(198,169,107,0.06)" },
  cardActive: { background:"linear-gradient(145deg,rgba(198,169,107,0.07),rgba(138,114,64,0.04))", border:"1px solid rgba(198,169,107,0.2)", boxShadow:"0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(198,169,107,0.1)" },
  dark: { background:"linear-gradient(155deg,rgba(8,8,4,0.97),rgba(4,4,2,0.99))", border:"1px solid rgba(198,169,107,0.06)", boxShadow:"0 20px 48px rgba(0,0,0,0.6),inset 0 1px 0 rgba(198,169,107,0.05)" },
  gold: { background:"linear-gradient(145deg,#C6A96B,#8A7240)", border:"none", boxShadow:"0 8px 24px rgba(198,169,107,0.28),inset 0 1px 0 rgba(255,255,255,0.15)" },
  sidebar: { background:"rgba(0,0,0,0.2)" },
};

const shine = { position:"absolute" as const, top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.15) 30%,rgba(198,169,107,0.25) 50%,rgba(198,169,107,0.15) 70%,transparent)", pointerEvents:"none" as const };

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
    <main style={{minHeight:"100vh",background:"#0B0B0B",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"var(--font-instrument,sans-serif)",fontSize:13,color:"rgba(198,169,107,0.4)",fontWeight:300}}>Cargando...</p>
    </main>
  );

  const nombre = user?.nombre ?? user?.email?.split("@")[0] ?? "tú";
  const diaMenu = menu?.dias[diaIdx] ?? menu?.dias[0];

  return (
    <main style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse 55% 65% at 68% 30%,rgba(198,169,107,0.04) 0%,transparent 70%),radial-gradient(ellipse 60% 80% at 10% 80%,rgba(198,169,107,0.025) 0%,transparent 60%),#0B0B0B",
      fontFamily:"var(--font-instrument,sans-serif)",
      position:"relative",
      padding:"24px 20px 52px",
      display:"flex",
      alignItems:"flex-start",
      justifyContent:"center",
    }}>

      {/* Orbs */}
      <div style={{position:"fixed",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(198,169,107,0.04),transparent 65%)",top:-150,right:-100,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(198,169,107,0.025),transparent 65%)",bottom:-100,left:-80,pointerEvents:"none",zIndex:0}}/>

      {/* Panel shadow */}
      <div style={{position:"fixed",width:"55%",maxWidth:720,height:50,background:"rgba(198,169,107,0.06)",borderRadius:"50%",bottom:18,left:"50%",transform:"translateX(-50%)",filter:"blur(30px)",pointerEvents:"none",zIndex:0}}/>

      {/* MAIN PANEL */}
      <div style={{...G.panel, width:"100%",maxWidth:1060,borderRadius:32,position:"relative",overflow:"hidden",zIndex:1,transform:"perspective(1400px) rotateX(0.5deg) translateY(-2px)"}}>
        <div style={shine}/>

        {/* NAV */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px 13px",borderBottom:"1px solid rgba(198,169,107,0.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,...G.gold,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:15,fontWeight:700,fontStyle:"italic"}}>N</span>
            </div>
            <span style={{fontFamily:"var(--font-playfair,serif)",fontSize:17,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.4px"}}>NutriAI</span>
          </div>
          <div style={{display:"flex",gap:22,alignItems:"center"}}>
            {([["Protocolo","#menu"],["Progreso","/progreso"],["Bienestar","/bienestar"],["Lista","/lista-compra"]] as [string,string][]).map(([l,h],i)=>(
              <Link key={l} href={h} style={{fontSize:13,color:i===0?"#C6A96B":"rgba(237,237,237,0.3)",fontWeight:i===0?500:400,textDecoration:"none",letterSpacing:"0.01em"}}>{l}</Link>
            ))}
            <button onClick={async()=>{await supabase.auth.signOut();router.push("/login");}}
              style={{background:"transparent",border:"1px solid rgba(198,169,107,0.18)",borderRadius:12,color:"rgba(237,237,237,0.45)",fontWeight:400,cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"7px 16px",fontSize:12,letterSpacing:"0.01em"}}>
              Salir
            </button>
            <div style={{width:32,height:32,borderRadius:"50%",...G.gold,border:"2px solid rgba(198,169,107,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:13,fontWeight:700,fontStyle:"italic"}}>{nombre[0]?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{display:"grid",gridTemplateColumns:"148px 1fr 192px"}}>

          {/* SIDEBAR */}
          <div style={{padding:"20px 12px",borderRight:"1px solid rgba(198,169,107,0.07)",display:"flex",flexDirection:"column",gap:2,minHeight:600,...G.sidebar}}>
            <div style={{textAlign:"center",paddingBottom:18,borderBottom:"1px solid rgba(198,169,107,0.07)",marginBottom:14}}>
              <div style={{width:52,height:52,borderRadius:"50%",...G.gold,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(198,169,107,0.3)"}}>
                <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:22,fontWeight:700,fontStyle:"italic"}}>{nombre[0]?.toUpperCase()}</span>
              </div>
              <p style={{fontSize:9,fontWeight:500,color:"rgba(198,169,107,0.4)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{getSaludo()}</p>
              <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:16,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.4px",fontStyle:"italic"}}>{nombre}</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:7,border:"1px solid rgba(198,169,107,0.2)",borderRadius:20,padding:"3px 10px",background:"rgba(198,169,107,0.06)"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#C6A96B",boxShadow:"0 0 6px rgba(198,169,107,0.6)"}}/>
                <span style={{fontSize:9,fontWeight:600,color:"#C6A96B",letterSpacing:"0.06em"}}>Protocolo activo</span>
              </div>
            </div>

            {([["◉","Dashboard","/dashboard",true],["◈","Protocolo","#menu",false],["◎","Perfil clínico","/onboarding",false],["↗","Progreso","/progreso",false],["✦","Bienestar","/bienestar",false],["💬","Nuria","/chat",false]] as [string,string,string,boolean][]).map(([ic,lb,hr,a])=>(
              <Link key={lb} href={hr} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:11,cursor:"pointer",background:a?"rgba(198,169,107,0.08)":"transparent",border:`1px solid ${a?"rgba(198,169,107,0.18)":"transparent"}`,marginBottom:2,textDecoration:"none"}}>
                <span style={{fontSize:12,color:a?"#C6A96B":"rgba(237,237,237,0.25)",flexShrink:0}}>{ic}</span>
                <span style={{fontSize:12,fontWeight:a?500:300,color:a?"#C6A96B":"rgba(237,237,237,0.4)",letterSpacing:"0.01em",whiteSpace:"nowrap"}}>{lb}</span>
              </Link>
            ))}

            <div style={{marginTop:"auto",paddingTop:12}}>
              <div style={{...G.dark,borderRadius:14,padding:14,position:"relative",overflow:"hidden"}}>
                <div style={shine}/>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.35)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,position:"relative",zIndex:1}}>Hoy</p>
                <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:14,fontWeight:600,color:"rgba(198,169,107,0.7)",position:"relative",zIndex:1,letterSpacing:"-0.3px",fontStyle:"italic"}}>
                  {new Date().toLocaleDateString("es-ES",{weekday:"long"})}
                </p>
                <div style={{height:"0.5px",background:"rgba(198,169,107,0.08)",margin:"8px 0",position:"relative",zIndex:1}}/>
                <p style={{fontSize:10,color:"rgba(198,169,107,0.3)",fontWeight:300,position:"relative",zIndex:1}}>
                  {new Date().toLocaleDateString("es-ES",{day:"numeric",month:"long"})}
                </p>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div style={{padding:"22px 22px",display:"flex",flexDirection:"column",gap:14,borderRight:"1px solid rgba(198,169,107,0.07)"}}>

            {/* Header */}
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
              <div>
                <p style={{fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(198,169,107,0.4)",marginBottom:6}}>
                  {new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}
                </p>
                <h1 style={{fontFamily:"var(--font-playfair,serif)",fontSize:30,color:"#EDEDED",letterSpacing:"-1px",lineHeight:1,fontWeight:600}}>
                  Tu protocolo de hoy
                </h1>
              </div>
              <div style={{display:"flex",gap:8,paddingBottom:4}}>
                <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 13px",border:"1px solid rgba(198,169,107,0.15)",borderRadius:50,background:"rgba(198,169,107,0.04)"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:checkinDone?"#C6A96B":"rgba(237,237,237,0.2)",boxShadow:checkinDone?"0 0 6px rgba(198,169,107,0.5)":"none"}}/>
                  <span style={{fontSize:11,fontWeight:500,color:checkinDone?"#C6A96B":"rgba(237,237,237,0.35)"}}>{checkinDone?"Check-in ✓":"Sin check-in"}</span>
                </div>
                <Link href="/lista-compra" style={{display:"flex",alignItems:"center",gap:5,padding:"5px 13px",border:"1px solid rgba(198,169,107,0.15)",borderRadius:50,background:"rgba(198,169,107,0.04)",textDecoration:"none"}}>
                  <span style={{fontSize:11,fontWeight:500,color:"rgba(237,237,237,0.45)"}}>Lista compra ◎</span>
                </Link>
              </div>
            </div>

            {/* Macros */}
            {diaMenu && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
                {[
                  {label:"Calorías est.",value:"~800",sub:"kcal hoy"},
                  {label:"Proteína",value:"~56g",sub:"objetivo"},
                  {label:"Comidas",value:"2",sub:"planificadas"},
                  {label:"Semana",value:`${diaIdx+1}/7`,sub:"días"},
                ].map(({label,value,sub})=>(
                  <div key={label} style={{...G.card,borderRadius:14,padding:"12px 14px",position:"relative",overflow:"hidden"}}>
                    <div style={shine}/>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:1.5,background:"linear-gradient(90deg,#C6A96B,transparent)",opacity:0.4}}/>
                    <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{label}</p>
                    <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:20,fontWeight:700,color:"#EDEDED",letterSpacing:"-0.5px",lineHeight:1}}>{value}</p>
                    <p style={{fontSize:10,color:"rgba(237,237,237,0.25)",marginTop:4,fontWeight:300}}>{sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Check-in */}
            {!checkinDone && (
              <div style={{...G.card,borderRadius:18,padding:"14px 18px",position:"relative",overflow:"hidden"}}>
                <div style={shine}/>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.3px"}}>Check-in de hoy</p>
                    <p style={{fontSize:11,color:"rgba(237,237,237,0.35)",marginTop:3,fontWeight:300}}>Cuéntale a Nuria cómo estás</p>
                  </div>
                  <button onClick={()=>setShowCheckin(!showCheckin)}
                    style={{...G.gold,padding:"8px 18px",fontSize:12,borderRadius:12,fontFamily:"var(--font-instrument,sans-serif)",fontWeight:500,letterSpacing:"0.02em"}}>
                    {showCheckin?"Cerrar":"Registrar"}
                  </button>
                </div>
                {showCheckin && (
                  <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid rgba(198,169,107,0.08)"}}>
                    <DailyCheckin onComplete={()=>{setCheckinDone(true);setShowCheckin(false);}}/>
                  </div>
                )}
              </div>
            )}

            {/* Menu */}
            <div id="menu" style={{...G.card,borderRadius:18,padding:"18px 20px",position:"relative",overflow:"hidden",flex:1}}>
              <div style={shine}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <p style={{fontSize:14,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.3px"}}>Protocolo semanal</p>
                  {menu && <p style={{fontSize:10,color:"rgba(198,169,107,0.4)",marginTop:2,fontWeight:300}}>Generado por Nuria</p>}
                </div>
                {menu && (
                  <button onClick={handleGeneratePlan} disabled={generating}
                    style={{background:"transparent",border:"1px solid rgba(198,169,107,0.2)",borderRadius:11,color:"#C6A96B",fontWeight:500,cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"6px 14px",fontSize:11}}>
                    {generating?"Generando...":"Regenerar"}
                  </button>
                )}
              </div>

              {!menu ? (
                <div style={{textAlign:"center",padding:"36px 20px",background:"rgba(198,169,107,0.03)",borderRadius:14,border:"1px dashed rgba(198,169,107,0.12)"}}>
                  <p style={{fontSize:11,fontWeight:600,color:"rgba(198,169,107,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Sin protocolo</p>
                  <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:16,color:"rgba(237,237,237,0.6)",fontStyle:"italic",marginBottom:8}}>Aún no tienes protocolo</p>
                  <p style={{fontSize:12,color:"rgba(237,237,237,0.25)",fontWeight:300,marginBottom:20}}>Nuria generará tu plan personalizado en segundos</p>
                  <button onClick={handleGeneratePlan} disabled={generating}
                    style={{...G.gold,padding:"12px 28px",fontSize:13,borderRadius:14,fontFamily:"var(--font-instrument,sans-serif)",fontWeight:500,letterSpacing:"0.02em"}}>
                    {generating?"Preparando tu protocolo...":"Generar mi protocolo"}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{display:"flex",gap:5,marginBottom:16}}>
                    {DIAS_SHORT.map((d,i)=>(
                      <button key={d} onClick={()=>setDiaIdx(i)}
                        style={{flex:1,textAlign:"center",padding:"8px 4px",borderRadius:10,cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",
                          background:diaIdx===i?"linear-gradient(145deg,#C6A96B,#8A7240)":"rgba(255,255,255,0.03)",
                          border:`1px solid ${diaIdx===i?"transparent":"rgba(198,169,107,0.08)"}`,
                          boxShadow:diaIdx===i?"0 4px 14px rgba(198,169,107,0.25)":"none"}}>
                        <p style={{fontSize:11,fontWeight:diaIdx===i?600:400,color:diaIdx===i?"white":"rgba(237,237,237,0.3)"}}>{d}</p>
                        <div style={{width:4,height:4,borderRadius:"50%",margin:"4px auto 0",background:i<5?(diaIdx===i?"rgba(255,255,255,0.6)":"rgba(198,169,107,0.25)"):"transparent"}}/>
                      </button>
                    ))}
                  </div>

                  {diaMenu && (
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      {[{tipo:"Comida",plato:diaMenu.comida,emoji:"☀️"},{tipo:"Cena",plato:diaMenu.cena,emoji:"🌙"}].map(({tipo,plato,emoji})=>(
                        <div key={tipo} style={{...G.card,borderRadius:16,overflow:"hidden",position:"relative",
                          border:expandido===`${diaIdx}-${tipo}`?"1px solid rgba(198,169,107,0.2)":"1px solid rgba(198,169,107,0.08)"}}>
                          {expandido===`${diaIdx}-${tipo}` && <div style={shine}/>}
                          <button onClick={()=>setExpandido(expandido===`${diaIdx}-${tipo}`?null:`${diaIdx}-${tipo}`)}
                            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"var(--font-instrument,sans-serif)"}}>
                            <div style={{display:"flex",alignItems:"center",gap:12}}>
                              <div style={{width:42,height:42,borderRadius:12,background:"rgba(198,169,107,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,border:"1px solid rgba(198,169,107,0.1)"}}>
                                {emoji}
                              </div>
                              <div>
                                <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{tipo}</p>
                                <p style={{fontSize:14,fontWeight:500,color:"#EDEDED",letterSpacing:"-0.3px"}}>{plato.nombre}</p>
                                <p style={{fontSize:10,color:"rgba(237,237,237,0.25)",marginTop:3,fontWeight:300}}>{plato.ingredientes.length} ingredientes</p>
                              </div>
                            </div>
                            <div style={{width:26,height:26,borderRadius:"50%",border:"1px solid rgba(198,169,107,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <span style={{color:"rgba(198,169,107,0.5)",fontSize:14,fontWeight:300,lineHeight:1}}>{expandido===`${diaIdx}-${tipo}`?"−":"+"}</span>
                            </div>
                          </button>
                          {expandido===`${diaIdx}-${tipo}` && (
                            <div style={{padding:"0 16px 14px",borderTop:"1px solid rgba(198,169,107,0.07)"}}>
                              <div style={{paddingTop:12,display:"flex",flexDirection:"column",gap:7}}>
                                {plato.ingredientes.map(ing=>(
                                  <div key={ing.nombre} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <span style={{fontSize:13,color:"rgba(237,237,237,0.55)",fontWeight:300}}>{ing.nombre}</span>
                                    <span style={{fontSize:11,color:"rgba(198,169,107,0.5)",fontWeight:500,background:"rgba(198,169,107,0.06)",padding:"2px 8px",borderRadius:7}}>{ing.cantidad_g}g</span>
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
              {error && <p style={{marginTop:12,fontSize:12,color:"rgba(226,75,74,0.7)",fontWeight:300}}>{error}</p>}
            </div>

          </div>

          {/* RIGHT */}
          <div style={{padding:"18px 14px",display:"flex",flexDirection:"column",gap:12}}>

            {/* NutriScore */}
            <div style={{...G.card,borderRadius:18,padding:18,position:"relative",overflow:"hidden"}}>
              <div style={shine}/>
              <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.35)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:14}}>NutriScore semanal</p>
              <NutriScoreCard />
            </div>

            {/* Accesos */}
            <div style={{...G.card,borderRadius:18,padding:"16px 14px",position:"relative",overflow:"hidden"}}>
              <div style={shine}/>
              <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.35)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>Accesos rápidos</p>
              {([
                ["✦","Bienestar","/bienestar","rgba(198,169,107,0.08)","#C6A96B"],
                ["↗","Progreso","/progreso","rgba(198,169,107,0.05)","rgba(198,169,107,0.7)"],
                ["◎","Lista compra","/lista-compra","rgba(198,169,107,0.05)","rgba(198,169,107,0.7)"],
                ["◈","Chat Nuria","/chat","rgba(198,169,107,0.08)","#C6A96B"],
                ["◉","Perfil","/onboarding","rgba(198,169,107,0.04)","rgba(198,169,107,0.6)"],
              ] as [string,string,string,string,string][]).map(([ic,lb,hr,bg,c])=>(
                <Link key={lb} href={hr} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:12,background:bg,border:"1px solid rgba(198,169,107,0.08)",marginBottom:6,cursor:"pointer",textDecoration:"none"}}>
                  <span style={{width:27,height:27,borderRadius:8,background:"rgba(198,169,107,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:c,fontWeight:700,flexShrink:0,border:"1px solid rgba(198,169,107,0.12)"}}>{ic}</span>
                  <span style={{fontSize:12,fontWeight:400,color:"rgba(237,237,237,0.6)",letterSpacing:"-0.1px"}}>{lb}</span>
                  <span style={{color:"rgba(198,169,107,0.25)",fontSize:13,marginLeft:"auto"}}>›</span>
                </Link>
              ))}
            </div>

            {/* Nuria */}
            <div style={{background:"linear-gradient(155deg,rgba(198,169,107,0.1),rgba(138,114,64,0.06))",border:"1px solid rgba(198,169,107,0.15)",borderRadius:18,padding:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"40%",background:"linear-gradient(180deg,rgba(255,255,255,0.03),transparent)",pointerEvents:"none",borderRadius:"inherit"}}/>
              <div style={shine}/>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,position:"relative",zIndex:1}}>
                <div style={{width:26,height:26,borderRadius:"50%",...G.gold,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(198,169,107,0.3)"}}>
                  <span style={{fontFamily:"var(--font-playfair,serif)",color:"white",fontSize:12,fontWeight:700,fontStyle:"italic"}}>N</span>
                </div>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.5)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Nuria</p>
              </div>
              <p style={{fontFamily:"var(--font-playfair,serif)",fontSize:12,color:"rgba(198,169,107,0.5)",lineHeight:1.7,position:"relative",zIndex:1,fontStyle:"italic",fontWeight:400}}>
                "Completa tu check-in para que pueda ajustar tu protocolo cada semana."
              </p>
              <Link href="/chat" style={{marginTop:12,paddingTop:10,borderTop:"1px solid rgba(198,169,107,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1,textDecoration:"none"}}>
                <span style={{fontSize:11,color:"rgba(198,169,107,0.6)",fontWeight:500}}>Hablar con Nuria</span>
                <span style={{color:"rgba(198,169,107,0.6)",fontSize:14}}>→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

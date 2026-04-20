"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type CheckIn = { date: string; energia_nivel: number; digestion_nivel: number; adherencia: number; notas?: string };
type Score = { week_start: string; score: number; adherencia: number; energia_media: number; digestion_media: number };

export default function ProgresoPage() {
  const router = useRouter();
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.replace("/login"); return; }
      const [{ data: ci }, { data: sc }] = await Promise.all([
        supabase.from("daily_checkins").select("*").eq("user_id", data.user.id).order("date", { ascending: false }).limit(14),
        supabase.from("weekly_scores").select("*").eq("user_id", data.user.id).order("week_start", { ascending: false }).limit(8),
      ]);
      if (ci) setCheckins(ci as CheckIn[]);
      if (sc) setScores(sc as Score[]);
      setLoading(false);
    }
    load();
  }, [router]);

  function avg(arr: number[]) { return arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0; }

  const avgEnergia = avg(checkins.map(c=>c.energia_nivel||0));
  const avgDigestion = avg(checkins.map(c=>c.digestion_nivel||0));
  const avgAdherencia = avg(checkins.map(c=>c.adherencia||0));
  const latestScore = scores[0];
  const prevScore = scores[1];
  const scoreDiff = latestScore && prevScore ? Math.round(latestScore.score - prevScore.score) : null;

  function getBarHeight(val: number, max: number = 10) {
    return `${Math.max(4, (val/max)*100)}%`;
  }

  if (loading) return (
    <main style={{minHeight:"100vh",background:"#0B0B0B",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"var(--font-instrument,sans-serif)",fontSize:13,color:"rgba(237,237,237,0.25)",fontWeight:300}}>Cargando progreso...</p>
    </main>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0B", fontFamily:"var(--font-instrument,-apple-system,sans-serif)", color:"#EDEDED" }}>

      <style>{`
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .wc{background:#FFFFFF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.5),0 1px 4px rgba(0,0,0,0.3);position:relative;overflow:hidden}
        .dc{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.08);border-radius:16px;position:relative;overflow:hidden}
        .dc::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(237,237,237,0.1) 50%,transparent)}
        .nav-link{font-size:12px;color:rgba(237,237,237,0.28);text-decoration:none;transition:color 0.2s ease}
        .nav-link:hover{color:rgba(237,237,237,0.6)}
        .bar{border-radius:4px 4px 0 0;transition:height 0.6s cubic-bezier(0.16,1,0.3,1)}
        @keyframes shimmer{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}
      `}</style>

      {/* Ambient */}
      <div style={{position:"fixed",top:-100,right:-60,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(237,237,237,0.02),transparent 65%)",pointerEvents:"none",zIndex:0}}/>

      {/* NAV */}
      <nav style={{borderBottom:"1px solid rgba(237,237,237,0.06)",padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(11,11,11,0.95)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",position:"fixed",top:0,left:0,right:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(198,169,107,0.35)"}}>
            <span className="sf" style={{color:"white",fontSize:13,fontWeight:700,fontStyle:"italic"}}>N</span>
          </div>
          <span className="sf" style={{fontSize:16,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.3px"}}>NutriAI</span>
        </div>
        <div style={{display:"flex",gap:20,alignItems:"center"}}>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/chat" className="nav-link">Nuria</Link>
          <Link href="/bienestar" className="nav-link">Bienestar</Link>
          <Link href="/lista-compra" className="nav-link">Lista compra</Link>
        </div>
        <button onClick={async()=>{await supabase.auth.signOut();router.push("/login");}} style={{background:"transparent",border:"1px solid rgba(237,237,237,0.1)",borderRadius:9,color:"rgba(237,237,237,0.35)",cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"6px 14px",fontSize:12}}>
          Salir
        </button>
      </nav>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"92px 24px 64px"}}>

        {/* Header */}
        <div style={{marginBottom:40}}>
          <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:12}}>Seguimiento</p>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <h1 className="sf" style={{fontSize:40,fontWeight:700,color:"#EDEDED",letterSpacing:"-1.5px",lineHeight:1}}>
              Tu progreso
            </h1>
            <p style={{fontSize:13,color:"rgba(237,237,237,0.25)",fontWeight:300}}>Últimas 2 semanas</p>
          </div>
        </div>

        {/* STATS TOP - CARDS BLANCAS */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>

          {/* NutriScore */}
          <div className="wc" style={{padding:"22px 20px",gridColumn:"span 1"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>
            <p style={{fontSize:8,fontWeight:700,color:"rgba(0,0,0,0.3)",textTransform:"uppercase",letterSpacing:"0.13em",marginBottom:14}}>NutriScore</p>
            {latestScore ? (
              <>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <defs>
                      <linearGradient id="gs" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#C6A96B"/>
                        <stop offset="100%" stopColor="#E8D090"/>
                      </linearGradient>
                    </defs>
                    <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="4.5"/>
                    <circle cx="30" cy="30" r="22" fill="none" stroke="url(#gs)" strokeWidth="4.5" strokeLinecap="round"
                      strokeDasharray={`${(latestScore.score/100)*138} 138`} transform="rotate(-90 30 30)"/>
                    <text x="30" y="27" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0B0B0B" fontFamily="Georgia,serif">{Math.round(latestScore.score)}</text>
                    <text x="30" y="38" textAnchor="middle" fontSize="7" fill="rgba(0,0,0,0.35)">/100</text>
                  </svg>
                  <div>
                    <p className="sf" style={{fontSize:14,fontWeight:600,color:"#6A5020",fontStyle:"italic"}}>
                      {latestScore.score>=80?"Excelente":latestScore.score>=65?"Muy bien":latestScore.score>=50?"En progreso":"Ajustando"}
                    </p>
                    {scoreDiff!==null && (
                      <p style={{fontSize:11,color:scoreDiff>=0?"#8A6020":"rgba(180,60,60,0.7)",fontWeight:600,marginTop:3}}>
                        {scoreDiff>=0?"↑":"↓"} {Math.abs(scoreDiff)} vs semana ant.
                      </p>
                    )}
                  </div>
                </div>
                {[["Adherencia",latestScore.adherencia],["Energía",latestScore.energia_media],["Digestión",latestScore.digestion_media]].map(([l,v])=>(
                  <div key={l} style={{marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:3}}>
                      <span style={{color:"rgba(0,0,0,0.38)",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</span>
                      <span style={{color:"#0B0B0B",fontWeight:700}}>{Math.round(v as number)}%</span>
                    </div>
                    <div style={{height:3,background:"rgba(0,0,0,0.07)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${v}%`,height:"100%",background:"linear-gradient(90deg,#C6A96B,#E8D090)",borderRadius:3,transition:"width 1s ease"}}/>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p style={{fontSize:12,color:"rgba(0,0,0,0.3)",fontWeight:300,fontStyle:"italic"}}>Completa 3 check-ins para ver tu NutriScore</p>
            )}
          </div>

          {/* Energía media */}
          <div className="wc" style={{padding:"22px 20px"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>
            <p style={{fontSize:8,fontWeight:700,color:"rgba(0,0,0,0.3)",textTransform:"uppercase",letterSpacing:"0.13em",marginBottom:12}}>Energía media</p>
            <p className="sf" style={{fontSize:40,fontWeight:700,color:"#0B0B0B",letterSpacing:"-2px",lineHeight:1,marginBottom:4}}>{avgEnergia}<span style={{fontSize:16,color:"rgba(0,0,0,0.3)",fontWeight:300}}>/10</span></p>
            <p style={{fontSize:11,color:"rgba(0,0,0,0.35)",fontWeight:300,marginBottom:16}}>últimos {checkins.length} días</p>
            <div style={{display:"flex",alignItems:"flex-end",gap:3,height:48}}>
              {checkins.slice(0,7).reverse().map((c,i)=>(
                <div key={i} style={{flex:1,background:"#0B0B0B",borderRadius:"3px 3px 0 0",height:getBarHeight(c.energia_nivel||0),minHeight:4,transition:`height ${0.4+i*0.05}s ease`}}/>
              ))}
            </div>
          </div>

          {/* Digestión media */}
          <div className="wc" style={{padding:"22px 20px"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>
            <p style={{fontSize:8,fontWeight:700,color:"rgba(0,0,0,0.3)",textTransform:"uppercase",letterSpacing:"0.13em",marginBottom:12}}>Digestión media</p>
            <p className="sf" style={{fontSize:40,fontWeight:700,color:"#0B0B0B",letterSpacing:"-2px",lineHeight:1,marginBottom:4}}>{avgDigestion}<span style={{fontSize:16,color:"rgba(0,0,0,0.3)",fontWeight:300}}>/10</span></p>
            <p style={{fontSize:11,color:"rgba(0,0,0,0.35)",fontWeight:300,marginBottom:16}}>últimos {checkins.length} días</p>
            <div style={{display:"flex",alignItems:"flex-end",gap:3,height:48}}>
              {checkins.slice(0,7).reverse().map((c,i)=>(
                <div key={i} style={{flex:1,background:"rgba(0,0,0,0.7)",borderRadius:"3px 3px 0 0",height:getBarHeight(c.digestion_nivel||0),minHeight:4,transition:`height ${0.4+i*0.05}s ease`}}/>
              ))}
            </div>
          </div>

          {/* Adherencia */}
          <div className="wc" style={{padding:"22px 20px"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>
            <p style={{fontSize:8,fontWeight:700,color:"rgba(0,0,0,0.3)",textTransform:"uppercase",letterSpacing:"0.13em",marginBottom:12}}>Adherencia</p>
            <p className="sf" style={{fontSize:40,fontWeight:700,color:"#0B0B0B",letterSpacing:"-2px",lineHeight:1,marginBottom:4}}>{avgAdherencia}<span style={{fontSize:16,color:"rgba(0,0,0,0.3)",fontWeight:300}}>/10</span></p>
            <p style={{fontSize:11,color:"rgba(0,0,0,0.35)",fontWeight:300,marginBottom:16}}>al protocolo</p>
            <div style={{height:4,background:"rgba(0,0,0,0.07)",borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${avgAdherencia*10}%`,height:"100%",background:"linear-gradient(90deg,#C6A96B,#E8D090)",borderRadius:2,transition:"width 1s ease"}}/>
            </div>
            <p style={{fontSize:11,color:avgAdherencia>=7?"#8A6020":"rgba(0,0,0,0.35)",fontWeight:600,marginTop:8}}>
              {avgAdherencia>=8?"Excelente":avgAdherencia>=6?"Bien":avgAdherencia>=4?"Mejorable":"Necesita ajuste"}
            </p>
          </div>
        </div>

        {/* GRÁFICA PRINCIPAL - check-ins */}
        <div className="dc" style={{padding:"28px 28px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:6}}>Evolución diaria</p>
              <p className="sf" style={{fontSize:20,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.5px"}}>Check-ins de las últimas 2 semanas</p>
            </div>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#EDEDED"}}/>
                <span style={{fontSize:11,color:"rgba(237,237,237,0.35)"}}>Energía</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"rgba(237,237,237,0.3)"}}/>
                <span style={{fontSize:11,color:"rgba(237,237,237,0.35)"}}>Digestión</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#C6A96B"}}/>
                <span style={{fontSize:11,color:"rgba(237,237,237,0.35)"}}>Adherencia</span>
              </div>
            </div>
          </div>

          {checkins.length === 0 ? (
            <div style={{textAlign:"center",padding:"48px 20px"}}>
              <p className="sf" style={{fontSize:18,color:"rgba(237,237,237,0.3)",fontStyle:"italic",marginBottom:8}}>Sin datos todavía</p>
              <p style={{fontSize:13,color:"rgba(237,237,237,0.18)",fontWeight:300}}>Completa tu check-in diario para ver tu evolución</p>
              <Link href="/dashboard" style={{display:"inline-block",marginTop:20,padding:"10px 22px",border:"1px solid rgba(237,237,237,0.1)",borderRadius:10,fontSize:13,color:"rgba(237,237,237,0.45)",textDecoration:"none",fontWeight:400}}>
                Ir al dashboard →
              </Link>
            </div>
          ) : (
            <div style={{position:"relative"}}>
              {/* Y axis labels */}
              <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",height:160,position:"absolute",left:0,top:0,bottom:0}}>
                {[10,7,5,2,0].map(v=>(
                  <span key={v} style={{fontSize:9,color:"rgba(237,237,237,0.18)",fontWeight:300,lineHeight:1}}>{v}</span>
                ))}
              </div>

              {/* Chart */}
              <div style={{marginLeft:28,borderLeft:"1px solid rgba(237,237,237,0.06)",borderBottom:"1px solid rgba(237,237,237,0.06)",height:160,display:"flex",alignItems:"flex-end",gap:0,padding:"0 8px",position:"relative"}}>
                {/* Grid lines */}
                {[2,4,6,8].map(v=>(
                  <div key={v} style={{position:"absolute",left:0,right:0,bottom:`${v*10}%`,borderTop:"1px solid rgba(237,237,237,0.04)"}}/>
                ))}

                {[...checkins].reverse().map((c,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",gap:2,height:"100%",position:"relative"}}>
                    <div style={{display:"flex",alignItems:"flex-end",gap:2,height:"100%",width:"100%",justifyContent:"center"}}>
                      <div style={{width:"22%",background:"#EDEDED",borderRadius:"3px 3px 0 0",height:getBarHeight(c.energia_nivel||0),opacity:0.9,minHeight:3}}/>
                      <div style={{width:"22%",background:"rgba(237,237,237,0.3)",borderRadius:"3px 3px 0 0",height:getBarHeight(c.digestion_nivel||0),minHeight:3}}/>
                      <div style={{width:"22%",background:"#C6A96B",borderRadius:"3px 3px 0 0",height:getBarHeight(c.adherencia||0),minHeight:3}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* X labels */}
              <div style={{marginLeft:28,display:"flex",marginTop:8,padding:"0 8px"}}>
                {[...checkins].reverse().map((c,i)=>{
                  const date = new Date(c.date);
                  const day = date.toLocaleDateString("es-ES",{day:"numeric"});
                  return (
                    <div key={i} style={{flex:1,textAlign:"center"}}>
                      <span style={{fontSize:9,color:"rgba(237,237,237,0.2)",fontWeight:300}}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM GRID */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

          {/* Historial check-ins */}
          <div className="dc" style={{padding:"24px 22px"}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:18}}>Historial de check-ins</p>
            {checkins.length === 0 ? (
              <p style={{fontSize:13,color:"rgba(237,237,237,0.2)",fontWeight:300,fontStyle:"italic"}}>Sin check-ins registrados</p>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {checkins.slice(0,7).map((c,i)=>{
                  const date = new Date(c.date);
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"rgba(237,237,237,0.03)",border:"1px solid rgba(237,237,237,0.06)",borderRadius:11}}>
                      <div style={{textAlign:"center",minWidth:40}}>
                        <p style={{fontSize:11,fontWeight:700,color:"rgba(237,237,237,0.5)"}}>{date.getDate()}</p>
                        <p style={{fontSize:9,color:"rgba(237,237,237,0.2)",textTransform:"uppercase"}}>{date.toLocaleDateString("es-ES",{month:"short"})}</p>
                      </div>
                      <div style={{flex:1,display:"flex",gap:12}}>
                        {[["E",c.energia_nivel],["D",c.digestion_nivel],["A",c.adherencia]].map(([l,v])=>(
                          <div key={l} style={{textAlign:"center"}}>
                            <p style={{fontSize:9,color:"rgba(237,237,237,0.2)",marginBottom:2,textTransform:"uppercase"}}>{l}</p>
                            <p className="sf" style={{fontSize:14,fontWeight:700,color:"#EDEDED"}}>{v??"-"}</p>
                          </div>
                        ))}
                      </div>
                      {c.notas && <p style={{fontSize:11,color:"rgba(237,237,237,0.25)",fontWeight:300,maxWidth:120,textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}}>{c.notas}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scores semanales */}
          <div className="dc" style={{padding:"24px 22px"}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:18}}>NutriScore por semana</p>
            {scores.length === 0 ? (
              <p style={{fontSize:13,color:"rgba(237,237,237,0.2)",fontWeight:300,fontStyle:"italic"}}>Sin scores semanales todavía</p>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {scores.map((s,i)=>{
                  const week = new Date(s.week_start);
                  const isLatest = i === 0;
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",background:isLatest?"rgba(237,237,237,0.06)":"rgba(237,237,237,0.02)",border:`1px solid ${isLatest?"rgba(237,237,237,0.12)":"rgba(237,237,237,0.05)"}`,borderRadius:12}}>
                      <div style={{textAlign:"center",minWidth:40}}>
                        <p style={{fontSize:9,color:"rgba(237,237,237,0.3)",textTransform:"uppercase",marginBottom:2}}>{week.toLocaleDateString("es-ES",{month:"short"})}</p>
                        <p style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>{week.getDate()}</p>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                          <span style={{fontSize:11,color:isLatest?"rgba(237,237,237,0.55)":"rgba(237,237,237,0.3)",fontWeight:isLatest?500:400}}>Semana {scores.length-i}</span>
                          <span className="sf" style={{fontSize:18,fontWeight:700,color:isLatest?"#EDEDED":"rgba(237,237,237,0.4)",letterSpacing:"-0.5px"}}>{Math.round(s.score)}</span>
                        </div>
                        <div style={{height:3,background:"rgba(237,237,237,0.06)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${s.score}%`,height:"100%",background:isLatest?"#EDEDED":"rgba(237,237,237,0.25)",borderRadius:3,transition:"width 1s ease"}}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Nuria insight */}
        <div style={{marginTop:16,background:"rgba(237,237,237,0.03)",border:"1px solid rgba(198,169,107,0.15)",borderRadius:18,padding:"22px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.3) 50%,transparent)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 8px rgba(198,169,107,0.3)"}}>
              <span className="sf" style={{color:"white",fontSize:12,fontWeight:700,fontStyle:"italic"}}>N</span>
            </div>
            <p style={{fontSize:10,fontWeight:600,color:"rgba(198,169,107,0.5)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Nuria · Análisis de tu progreso</p>
          </div>
          <p className="sf" style={{fontSize:14,color:"rgba(237,237,237,0.42)",lineHeight:1.8,fontStyle:"italic",marginBottom:14}}>
            {checkins.length === 0
              ? "Aún no tengo datos suficientes para analizar tu progreso. Completa tu check-in diario desde el dashboard."
              : avgEnergia >= 7
                ? "Tu nivel de energía esta semana ha sido notable. El protocolo está funcionando correctamente. Sigue con el ritmo."
                : "Estoy viendo fluctuaciones en tu energía. Esta semana ajustaré el protocolo para optimizar tu respuesta metabólica."
            }
          </p>
          <Link href="/chat" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",border:"1px solid rgba(198,169,107,0.18)",borderRadius:9,textDecoration:"none",background:"rgba(198,169,107,0.05)"}}>
            <span style={{fontSize:12,color:"rgba(198,169,107,0.65)",fontWeight:500}}>Hablar con Nuria sobre mi progreso</span>
            <span style={{color:"rgba(198,169,107,0.45)",fontSize:12}}>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

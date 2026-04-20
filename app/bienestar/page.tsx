"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Tab = "cuerpo" | "dia" | "mente" | "ciclo" | "salud";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "cuerpo", label: "Mi Cuerpo", icon: "◉" },
  { id: "dia", label: "Mi Día", icon: "☀️" },
  { id: "mente", label: "Mi Mente", icon: "✦" },
  { id: "ciclo", label: "Mi Ciclo", icon: "◎" },
  { id: "salud", label: "Mi Salud", icon: "◈" },
];

export default function BienestarPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("cuerpo");
  const [user, setUser] = useState<{ id: string; nombre: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cuerpo
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [cintura, setCintura] = useState("");
  const [cadera, setCadera] = useState("");

  // Día
  const [pasos, setPasos] = useState("");
  const [agua, setAgua] = useState("");
  const [energia, setEnergia] = useState(5);
  const [sueno, setSueno] = useState("");
  const [sintomas, setSintomas] = useState<string[]>([]);

  // Mente
  const [estres, setEstres] = useState(5);
  const [gratitud, setGratitud] = useState("");
  const [emocion, setEmocion] = useState("");

  // Ciclo
  const [faseCiclo, setFaseCiclo] = useState("");
  const [ultimaMenstruacion, setUltimaMenstruacion] = useState("");

  // Salud
  const [alimentos, setAlimentos] = useState("");
  const [suplementos, setSuplementos] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.replace("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("form_data").eq("id", data.user.id).single();
      setUser({ id: data.user.id, nombre: profile?.form_data?.full_name?.split(" ")[0] ?? "tú" });
    }
    load();
  }, [router]);

  function toggleSintoma(s: string) {
    setSintomas(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("bienestar_dia").upsert({
      user_id: user.id, date: today,
      pasos: pasos ? parseInt(pasos) : null,
      agua_ml: agua ? parseInt(agua) : null,
      energia_nivel: energia,
      horas_sueno: sueno ? parseFloat(sueno) : null,
      sintomas,
    }, { onConflict: "user_id,date" });
    if (peso || cintura) {
      await supabase.from("bienestar_cuerpo").upsert({
        user_id: user.id, date: today,
        peso_kg: peso ? parseFloat(peso) : null,
        altura_cm: altura ? parseFloat(altura) : null,
        cintura_cm: cintura ? parseFloat(cintura) : null,
        cadera_cm: cadera ? parseFloat(cadera) : null,
      }, { onConflict: "user_id,date" });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const imc = peso && altura ? (parseFloat(peso) / Math.pow(parseFloat(altura) / 100, 2)).toFixed(1) : null;

  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0B", fontFamily:"var(--font-instrument,-apple-system,sans-serif)", color:"#EDEDED" }}>

      <style>{`
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .wc{background:#FFFFFF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.5),0 1px 4px rgba(0,0,0,0.3);position:relative;overflow:hidden}
        .dc{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.08);border-radius:16px;position:relative;overflow:hidden}
        .dc::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(237,237,237,0.1) 50%,transparent)}
        .inp{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.1);border-radius:11px;padding:11px 14px;font-size:14px;color:#EDEDED;font-family:var(--font-instrument,sans-serif);outline:none;width:100%;transition:border-color 0.2s ease;font-weight:300}
        .inp:focus{border-color:rgba(237,237,237,0.25)}
        .inp::placeholder{color:rgba(237,237,237,0.2)}
        .inp-dark{background:#0B0B0B;border:1px solid rgba(0,0,0,0.12);border-radius:11px;padding:11px 14px;font-size:14px;color:#0B0B0B;font-family:var(--font-instrument,sans-serif);outline:none;width:100%;transition:border-color 0.2s ease;font-weight:400}
        .inp-dark:focus{border-color:rgba(0,0,0,0.25)}
        .inp-dark::placeholder{color:rgba(0,0,0,0.35)}
        .tab-btn{padding:9px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-family:var(--font-instrument,sans-serif);border:none;transition:all 0.2s ease;display:flex;align-items:center;gap:7px;font-weight:400}
        .tab-btn.on{background:#FFFFFF;color:#0B0B0B;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,0.5)}
        .tab-btn.off{background:transparent;color:rgba(237,237,237,0.35);border:1px solid rgba(237,237,237,0.07)}
        .tab-btn.off:hover{background:rgba(237,237,237,0.04);color:rgba(237,237,237,0.6)}
        .slider{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(237,237,237,0.1);outline:none}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#EDEDED;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.5)}
        .sintoma-btn{padding:7px 14px;border-radius:20px;cursor:pointer;font-size:12px;font-family:var(--font-instrument,sans-serif);border:1px solid rgba(237,237,237,0.08);background:transparent;color:rgba(237,237,237,0.38);transition:all 0.2s ease;font-weight:300}
        .sintoma-btn.on{background:#FFFFFF;color:#0B0B0B;border-color:transparent;font-weight:600}
        .btn-save{background:#EDEDED;color:#0B0B0B;border:none;border-radius:12px;padding:13px 28px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font-instrument,sans-serif);letter-spacing:0.01em;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),filter 0.2s ease}
        .btn-save:hover{transform:translateY(-1px) scale(1.01);filter:brightness(1.05)}
        .nav-link{font-size:12px;color:rgba(237,237,237,0.28);text-decoration:none;transition:color 0.2s ease}
        .nav-link:hover{color:rgba(237,237,237,0.6)}
        label{font-size:11px;font-weight:600;color:rgba(237,237,237,0.35);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px}
        .label-dark{font-size:11px;font-weight:600;color:rgba(0,0,0,0.38);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px}
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
          <Link href="/progreso" className="nav-link">Progreso</Link>
          <Link href="/lista-compra" className="nav-link">Lista compra</Link>
        </div>
        <button onClick={async()=>{await supabase.auth.signOut();router.push("/login");}} style={{background:"transparent",border:"1px solid rgba(237,237,237,0.1)",borderRadius:9,color:"rgba(237,237,237,0.35)",cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"6px 14px",fontSize:12}}>
          Salir
        </button>
      </nav>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"80px 24px 64px",paddingTop:92}}>

        {/* Header */}
        <div style={{marginBottom:36}}>
          <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:12}}>Panel de bienestar</p>
          <h1 className="sf" style={{fontSize:40,fontWeight:700,color:"#EDEDED",letterSpacing:"-1.5px",lineHeight:1}}>
            Mi bienestar
          </h1>
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`tab-btn ${tab===t.id?"on":"off"}`}>
              <span style={{fontSize:14}}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* MI CUERPO */}
        {tab==="cuerpo" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="wc" style={{padding:"28px 26px",gridColumn:"1/-1"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(0,0,0,0.3)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:20}}>Medidas corporales</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14}}>
                {[["Peso (kg)","Peso en kg",peso,setPeso],["Altura (cm)","Altura en cm",altura,setAltura],["Cintura (cm)","Cintura en cm",cintura,setCintura],["Cadera (cm)","Cadera en cm",cadera,setCadera]].map(([lb,ph,val,set])=>(
                  <div key={lb as string}>
                    <p className="label-dark">{lb as string}</p>
                    <input type="number" value={val as string} onChange={e=>(set as (v:string)=>void)(e.target.value)} placeholder={ph as string} className="inp-dark" style={{color:"#0B0B0B",background:"rgba(0,0,0,0.04)"}}/>
                  </div>
                ))}
              </div>
              {imc && (
                <div style={{marginTop:20,padding:"16px 20px",background:"#0B0B0B",borderRadius:12,display:"flex",alignItems:"center",gap:16}}>
                  <p className="sf" style={{fontSize:32,fontWeight:700,color:"#EDEDED",letterSpacing:"-1px"}}>{imc}</p>
                  <div>
                    <p style={{fontSize:11,color:"rgba(237,237,237,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2,fontWeight:600}}>IMC</p>
                    <p style={{fontSize:13,color:"rgba(237,237,237,0.6)",fontWeight:300}}>
                      {parseFloat(imc)<18.5?"Bajo peso":parseFloat(imc)<25?"Normopeso":parseFloat(imc)<30?"Sobrepeso":"Obesidad"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="dc" style={{padding:"24px 22px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:16}}>Composición estimada</p>
              {[["Masa muscular estimada","En evaluación"],["Grasa corporal estimada","En evaluación"],["Edad biológica estimada","En evaluación"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid rgba(237,237,237,0.06)"}}>
                  <p style={{fontSize:13,color:"rgba(237,237,237,0.4)",fontWeight:300}}>{l}</p>
                  <p style={{fontSize:12,color:"rgba(237,237,237,0.2)",fontWeight:300,fontStyle:"italic"}}>{v}</p>
                </div>
              ))}
            </div>

            <div className="dc" style={{padding:"24px 22px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:16}}>Objetivo</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {["Pérdida de grasa","Recomposición corporal","Ganancia muscular","Salud digestiva","Equilibrio hormonal","Antiinflamatorio"].map(o=>(
                  <div key={o} style={{padding:"10px 14px",border:"1px solid rgba(237,237,237,0.07)",borderRadius:10,fontSize:13,color:"rgba(237,237,237,0.38)",fontWeight:300,cursor:"pointer"}}>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MI DÍA */}
        {tab==="dia" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* Pasos + Agua */}
            <div className="wc" style={{padding:"26px 24px"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>
              <p className="label-dark">Pasos hoy</p>
              <input type="number" value={pasos} onChange={e=>setPasos(e.target.value)} placeholder="8500" className="inp-dark" style={{color:"#0B0B0B",background:"rgba(0,0,0,0.04)",marginBottom:20}}/>
              <p className="label-dark">Agua (ml)</p>
              <input type="number" value={agua} onChange={e=>setAgua(e.target.value)} placeholder="2000" className="inp-dark" style={{color:"#0B0B0B",background:"rgba(0,0,0,0.04)"}}/>
              {pasos && (
                <div style={{marginTop:16,padding:"12px 16px",background:"#0B0B0B",borderRadius:11,display:"flex",alignItems:"center",gap:12}}>
                  <p className="sf" style={{fontSize:24,fontWeight:700,color:"#EDEDED",letterSpacing:"-1px"}}>{parseInt(pasos).toLocaleString()}</p>
                  <div>
                    <p style={{fontSize:9,color:"rgba(237,237,237,0.25)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:1}}>pasos</p>
                    <p style={{fontSize:11,color:parseInt(pasos)>=8000?"#C6A96B":"rgba(237,237,237,0.35)",fontWeight:300}}>{parseInt(pasos)>=10000?"Objetivo superado ✓":parseInt(pasos)>=8000?"Muy bien":"Sigue avanzando"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Energía y sueño */}
            <div className="dc" style={{padding:"26px 24px"}}>
              <div style={{marginBottom:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <label>Nivel de energía</label>
                  <span className="sf" style={{fontSize:22,fontWeight:700,color:"#EDEDED",letterSpacing:"-0.5px"}}>{energia}<span style={{fontSize:13,color:"rgba(237,237,237,0.3)",fontWeight:300}}>/10</span></span>
                </div>
                <input type="range" min={1} max={10} value={energia} onChange={e=>setEnergia(parseInt(e.target.value))} className="slider"/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Sin energía</span>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Excelente</span>
                </div>
              </div>
              <div>
                <label>Horas de sueño</label>
                <input type="number" step="0.5" min={0} max={12} value={sueno} onChange={e=>setSueno(e.target.value)} placeholder="7.5" className="inp"/>
              </div>
            </div>

            {/* Síntomas */}
            <div className="dc" style={{padding:"26px 24px",gridColumn:"1/-1"}}>
              <label style={{marginBottom:14}}>Síntomas de hoy</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Hinchazón","Gases","Pesadez","Reflujo","Estreñimiento","Diarrea","Fatiga","Dolor de cabeza","Ansiedad","Irritabilidad","Niebla mental","Palpitaciones","Sin síntomas"].map(s=>(
                  <button key={s} onClick={()=>toggleSintoma(s)} className={`sintoma-btn ${sintomas.includes(s)?"on":""}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MI MENTE */}
        {tab==="mente" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="dc" style={{padding:"26px 24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <label>Nivel de estrés</label>
                <span className="sf" style={{fontSize:22,fontWeight:700,color:"#EDEDED",letterSpacing:"-0.5px"}}>{estres}<span style={{fontSize:13,color:"rgba(237,237,237,0.3)",fontWeight:300}}>/10</span></span>
              </div>
              <input type="range" min={1} max={10} value={estres} onChange={e=>setEstres(parseInt(e.target.value))} className="slider"/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Sin estrés</span>
                <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Muy alto</span>
              </div>
            </div>

            <div className="dc" style={{padding:"26px 24px"}}>
              <label>¿Cómo te sientes hoy?</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Tranquila","Motivada","Ansiosa","Cansada","Feliz","Irritable","Triste","Enfocada"].map(e=>(
                  <button key={e} onClick={()=>setEmocion(e)} style={{padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontFamily:"var(--font-instrument,sans-serif)",border:`1px solid ${emocion===e?"transparent":"rgba(237,237,237,0.08)"}`,background:emocion===e?"#FFFFFF":"transparent",color:emocion===e?"#0B0B0B":"rgba(237,237,237,0.35)",fontWeight:emocion===e?600:300,transition:"all 0.2s ease"}}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="dc" style={{padding:"26px 24px",gridColumn:"1/-1"}}>
              <label>Gratitud del día</label>
              <textarea value={gratitud} onChange={e=>setGratitud(e.target.value)} placeholder="Escribe algo por lo que estés agradecida hoy..." rows={4} className="inp" style={{resize:"none",lineHeight:1.7}}/>
            </div>

            {/* Modo crisis */}
            <div style={{background:"rgba(237,237,237,0.03)",border:"1px solid rgba(198,169,107,0.15)",borderRadius:16,padding:"24px 22px",gridColumn:"1/-1",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.3) 50%,transparent)"}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span className="sf" style={{color:"white",fontSize:13,fontWeight:700,fontStyle:"italic"}}>N</span>
                </div>
                <p style={{fontSize:12,fontWeight:600,color:"rgba(198,169,107,0.6)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Modo crisis · Nuria</p>
              </div>
              <p className="sf" style={{fontSize:14,color:"rgba(237,237,237,0.4)",lineHeight:1.75,fontStyle:"italic",marginBottom:16}}>
                &quot;Si hoy es un día difícil, no tienes que enfrentarlo sola. Cuéntame cómo te sientes y ajustaré tu protocolo para que sea más llevadera esta semana.&quot;
              </p>
              <Link href="/chat" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",border:"1px solid rgba(198,169,107,0.2)",borderRadius:10,textDecoration:"none",background:"rgba(198,169,107,0.06)"}}>
                <span style={{fontSize:13,color:"rgba(198,169,107,0.7)",fontWeight:500}}>Hablar con Nuria ahora</span>
                <span style={{color:"rgba(198,169,107,0.5)"}}>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* MI CICLO */}
        {tab==="ciclo" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="wc" style={{padding:"26px 24px"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>
              <p className="label-dark">Última menstruación</p>
              <input type="date" value={ultimaMenstruacion} onChange={e=>setUltimaMenstruacion(e.target.value)} className="inp-dark" style={{color:"#0B0B0B",background:"rgba(0,0,0,0.04)",marginBottom:20}}/>
              <p className="label-dark">Fase actual</p>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {[["Menstrual","Días 1-5 · Reposo y nutrición antiinflamatoria"],["Folicular","Días 6-13 · Energía alta · Proteína y hierro"],["Ovulación","Día 14 · Pico de energía · Antioxidantes"],["Lútea","Días 15-28 · Apoyo hepático · Magnesio"]].map(([f,d])=>(
                  <button key={f} onClick={()=>setFaseCiclo(f)} style={{padding:"12px 16px",border:`1px solid ${faseCiclo===f?"rgba(198,169,107,0.3)":"rgba(0,0,0,0.08)"}`,borderRadius:11,background:faseCiclo===f?"rgba(198,169,107,0.08)":"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.2s ease"}}>
                    <p style={{fontSize:13,fontWeight:600,color:faseCiclo===f?"#8A6020":"rgba(0,0,0,0.6)",marginBottom:2}}>{f}</p>
                    <p style={{fontSize:11,color:"rgba(0,0,0,0.38)",fontWeight:300}}>{d}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="dc" style={{padding:"26px 24px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:16}}>Nutrición por fase</p>
              {faseCiclo ? (
                <div>
                  <p className="sf" style={{fontSize:18,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.5px",marginBottom:12,fontStyle:"italic"}}>Fase {faseCiclo}</p>
                  {faseCiclo==="Menstrual" && ["Antiinflamatorios: omega-3, cúrcuma","Hierro: espinacas, legumbres","Magnesio: chocolate negro, frutos secos","Hidratación extra · Reducir sal"].map(i=><p key={i} style={{fontSize:13,color:"rgba(237,237,237,0.45)",fontWeight:300,marginBottom:8,paddingLeft:12,borderLeft:"2px solid rgba(198,169,107,0.3)"}}>· {i}</p>)}
                  {faseCiclo==="Folicular" && ["Proteína alta: 1.8-2g/kg","Hierro: carnes rojas, lentejas","Zinc: semillas de calabaza","Aumentar carbohidratos complejos"].map(i=><p key={i} style={{fontSize:13,color:"rgba(237,237,237,0.45)",fontWeight:300,marginBottom:8,paddingLeft:12,borderLeft:"2px solid rgba(198,169,107,0.3)"}}>· {i}</p>)}
                  {faseCiclo==="Ovulación" && ["Antioxidantes: frutas de colores","Fibra alta para eliminar exceso estrógeno","Vitamina C y zinc","Reducir lácteos y azúcares"].map(i=><p key={i} style={{fontSize:13,color:"rgba(237,237,237,0.45)",fontWeight:300,marginBottom:8,paddingLeft:12,borderLeft:"2px solid rgba(198,169,107,0.3)"}}>· {i}</p>)}
                  {faseCiclo==="Lútea" && ["Magnesio: reduce síndrome premenstrual","Vitamina B6: aguacate, plátano","Apoyo hepático: brócoli, ajo","Reducir cafeína y alcohol"].map(i=><p key={i} style={{fontSize:13,color:"rgba(237,237,237,0.45)",fontWeight:300,marginBottom:8,paddingLeft:12,borderLeft:"2px solid rgba(198,169,107,0.3)"}}>· {i}</p>)}
                </div>
              ) : (
                <p style={{fontSize:13,color:"rgba(237,237,237,0.25)",fontWeight:300,fontStyle:"italic"}}>Selecciona tu fase para ver las recomendaciones nutricionales personalizadas.</p>
              )}
            </div>
          </div>
        )}

        {/* MI SALUD */}
        {tab==="salud" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="dc" style={{padding:"26px 24px"}}>
              <label>Alimentos consumidos hoy</label>
              <textarea value={alimentos} onChange={e=>setAlimentos(e.target.value)} placeholder="Ej: desayuno con avena, comida con pollo y verduras..." rows={5} className="inp" style={{resize:"none",lineHeight:1.7}}/>
            </div>

            <div className="dc" style={{padding:"26px 24px"}}>
              <label>Suplementación actual</label>
              <textarea value={suplementos} onChange={e=>setSuplementos(e.target.value)} placeholder="Ej: vitamina D, magnesio, omega-3..." rows={5} className="inp" style={{resize:"none",lineHeight:1.7}}/>
            </div>

            <div className="dc" style={{padding:"26px 24px",gridColumn:"1/-1"}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:16}}>Marcadores de sangre</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {["Vitamina D","B12","Ferritina","PCR","TSH","Glucosa","Colesterol","Triglicéridos"].map(m=>(
                  <div key={m}>
                    <label style={{marginBottom:6,fontSize:10}}>{m}</label>
                    <input type="text" placeholder="—" className="inp" style={{padding:"9px 12px",fontSize:13}}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GUARDAR */}
        <div style={{marginTop:28,display:"flex",alignItems:"center",gap:16}}>
          <button onClick={handleSave} disabled={saving} className="btn-save">
            {saving?"Guardando...":saved?"Guardado ✓":"Guardar registro"}
          </button>
          {saved && <p style={{fontSize:13,color:"rgba(198,169,107,0.6)",fontWeight:300,fontStyle:"italic"}}>Nuria ha recibido tu registro.</p>}
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const PLANES = [
  {
    nombre: "Básico",
    precio: "9,99",
    subtitulo: "Nutrición personalizada esencial",
    desc: "Tu primer protocolo nutricional personalizado. Menú semanal adaptado a tu objetivo e intolerancias, generado por Nuria en menos de 2 minutos.",
    items: [
      "Menú semanal personalizado (7 días)",
      "Chat con Nuria — dudas nutricionales",
      "Lista de la compra automática",
      "Check-in diario",
      "Perfil clínico básico",
    ],
    no: [
      "Ajuste semanal automático",
      "NutriScore semanal",
      "Protocolo digestivo",
      "Protocolo hormonal",
      "Gemelo metabólico",
    ],
    cta: "Comenzar",
    destacado: false,
    longevity: false,
    color: "neutral",
  },
  {
    nombre: "Pro",
    precio: "19,99",
    subtitulo: "Protocolo adaptativo continuo",
    desc: "Nuria analiza tus check-ins cada semana y reajusta tu protocolo automáticamente. El plan que mejora solo con el tiempo.",
    items: [
      "Todo lo del plan Básico",
      "Ajuste semanal automático con Nuria",
      "NutriScore semanal (0–100)",
      "Protocolo digestivo personalizado",
      "Modo restaurante — opciones fuera de casa",
      "Panel Mi Bienestar completo",
      "Seguimiento de síntomas y energía",
    ],
    no: [
      "Protocolo hormonal femenino",
      "Gemelo metabólico IA",
    ],
    cta: "Comenzar con Pro",
    destacado: true,
    longevity: false,
    color: "featured",
    badge: "Más popular",
  },
  {
    nombre: "Élite",
    precio: "39,99",
    subtitulo: "Protocolo clínico avanzado",
    desc: "El nivel más alto de personalización sin seguimiento 1:1. Incluye protocolo hormonal femenino, gemelo metabólico y seguimiento de biomarcadores.",
    items: [
      "Todo lo del plan Pro",
      "Protocolo hormonal femenino por fases",
      "Gemelo metabólico IA",
      "Seguimiento de marcadores de sangre",
      "Calendario de ciclo menstrual",
      "Protocolo antiinflamatorio avanzado",
      "Prioridad en soporte",
    ],
    no: [],
    cta: "Comenzar con Élite",
    destacado: false,
    longevity: false,
    color: "elite",
  },
  {
    nombre: "Premium 1:1",
    precio: null,
    subtitulo: "Acompañamiento personalizado directo",
    desc: "Un protocolo construido desde cero para ti con seguimiento semanal directo. Para quienes buscan el máximo nivel de personalización y acompañamiento.",
    items: [
      "Todo lo del plan Élite",
      "Evaluación clínica avanzada completa",
      "Protocolo 100% individual desde cero",
      "Seguimiento semanal personalizado",
      "Ajustes directos al protocolo",
      "Acceso prioritario a soporte directo",
      "Revisión de analíticas y biomarcadores",
    ],
    no: [],
    cta: "Solicitar evaluación",
    destacado: false,
    longevity: false,
    color: "premium",
    badge: "Alto ticket",
  },
  {
    nombre: "Longevity",
    precio: "59,99",
    subtitulo: "Nutrición antiedad y optimización vital",
    desc: "Protocolo diseñado para optimizar la longevidad biológica. Nutrición antiedad basada en ciencia, con análisis de edad biológica y suplementación personalizada.",
    items: [
      "Todo lo del plan Élite",
      "Plan antiedad con IA clínica",
      "Protocolo antioxidante personalizado",
      "Análisis de longevidad biológica",
      "Suplementación antiedad (NMN, resveratrol, CoQ10)",
      "Estimación de edad biológica",
      "Protocolo de ayuno adaptativo",
    ],
    no: [],
    cta: "Activar Longevity",
    destacado: false,
    longevity: true,
    color: "longevity",
    badge: "NUEVO",
  },
];

const FAQS = [
  { q: "¿Puedo cambiar de plan cuando quiera?", a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu perfil. El cambio se aplica en el siguiente ciclo de facturación." },
  { q: "¿Hay permanencia mínima?", a: "No. Todos los planes son mensuales sin permanencia. Cancelas cuando quieras sin penalización." },
  { q: "¿Qué diferencia hay entre Pro y Élite?", a: "Pro incluye ajuste semanal automático y NutriScore. Élite añade protocolo hormonal femenino, gemelo metabólico y seguimiento de biomarcadores." },
  { q: "¿El plan Premium 1:1 tiene precio fijo?", a: "El precio del plan Premium 1:1 se determina tras la evaluación inicial, según el nivel de acompañamiento necesario. No mostramos precio público para mantener la exclusividad." },
  { q: "¿Nuria está disponible en todos los planes?", a: "Sí. Nuria está disponible 24h en todos los planes. La diferencia está en el nivel de personalización y los protocolos que puede aplicar." },
  { q: "¿Qué incluye el plan Longevity exactamente?", a: "Incluye todo el plan Élite más un protocolo específico de nutrición antiedad: antioxidantes, suplementación personalizada (NMN, resveratrol, CoQ10), análisis de edad biológica y protocolo de ayuno adaptativo." },
];

export default function PlanesPage() {
  const [faqOpen, setFaqOpen] = useState<number|null>(null);
  const [periodo, setPeriodo] = useState<"mensual"|"anual">("mensual");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rev").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function getPrice(precio: string|null) {
    if (!precio) return null;
    if (periodo === "anual") {
      const monthly = parseFloat(precio.replace(",","."));
      return (monthly * 0.8).toFixed(2).replace(".",",");
    }
    return precio;
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0B", color:"#EDEDED", fontFamily:"var(--font-instrument,-apple-system,sans-serif)", overflowX:"hidden" }}>

      <style>{`
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .rev{opacity:0;transform:translateY(36px);transition:opacity 0.9s cubic-bezier(0.16,1,0.3,1),transform 0.9s cubic-bezier(0.16,1,0.3,1)}
        .rev.vis{opacity:1;transform:translateY(0)}
        .d1{transition-delay:0.05s}.d2{transition-delay:0.12s}.d3{transition-delay:0.19s}.d4{transition-delay:0.26s}.d5{transition-delay:0.33s}
        .card-h{transition:transform 0.4s cubic-bezier(0.34,1.2,0.64,1),border-color 0.3s ease}
        .card-h:hover{transform:translateY(-6px)}
        .btn-p{transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),filter 0.2s ease;display:block;text-align:center;text-decoration:none}
        .btn-p:hover{transform:translateY(-2px) scale(1.02);filter:brightness(1.08)}
        .btn-p:active{transform:scale(0.98)}
        .nav-lu{position:relative;text-decoration:none;font-size:13px;color:rgba(237,237,237,0.35);transition:color 0.2s ease}
        .nav-lu:hover{color:rgba(237,237,237,0.7)}
        .faq-card{transition:border-color 0.2s ease}
        .faq-card:hover{border-color:rgba(237,237,237,0.1)!important}
        @keyframes pd{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        .gdot{animation:pd 3s ease-in-out infinite}
        hr{border:none;border-top:1px solid rgba(237,237,237,0.06);margin:0}
      `}</style>

      {/* Ambient */}
      <div style={{position:"fixed",top:-100,right:-80,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(237,237,237,0.02),transparent 65%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-80,left:-60,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(198,169,107,0.025),transparent 65%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(237,237,237,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(237,237,237,0.015) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none",zIndex:0}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(11,11,11,0.95)",borderBottom:"1px solid rgba(237,237,237,0.06)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",padding:"0 64px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
          <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(198,169,107,0.35)"}}>
            <span className="sf" style={{color:"white",fontSize:13,fontWeight:700,fontStyle:"italic"}}>N</span>
          </div>
          <span className="sf" style={{fontSize:17,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.3px"}}>NutriAI</span>
        </Link>
        <div style={{display:"flex",gap:32,alignItems:"center"}}>
          <Link href="/#metodo" className="nav-lu">El método</Link>
          <Link href="/#resultados" className="nav-lu">Resultados</Link>
          <Link href="/planes" className="nav-lu" style={{color:"#EDEDED",fontWeight:500}}>Planes</Link>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <Link href="/login" style={{fontSize:13,color:"rgba(237,237,237,0.3)",textDecoration:"none"}}>Acceder</Link>
          <Link href="/registro" style={{background:"#EDEDED",color:"#0B0B0B",borderRadius:11,padding:"9px 22px",fontSize:13,fontWeight:700,textDecoration:"none",display:"inline-block"}}>
            Solicitar evaluación
          </Link>
        </div>
      </nav>

      <div style={{paddingTop:64,position:"relative",zIndex:1}}>

        {/* HERO */}
        <section style={{padding:"100px 64px 80px",textAlign:"center",maxWidth:900,margin:"0 auto"}}>
          <div className="rev" style={{display:"inline-flex",alignItems:"center",gap:8,border:"1px solid rgba(237,237,237,0.1)",borderRadius:50,padding:"5px 16px",marginBottom:40}}>
            <div className="gdot" style={{width:5,height:5,borderRadius:"50%",background:"#C6A96B",boxShadow:"0 0 8px rgba(198,169,107,0.9)"}}/>
            <span style={{fontSize:11,fontWeight:500,color:"rgba(237,237,237,0.4)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Sin permanencia · Cancela cuando quieras</span>
          </div>

          <h1 className="sf rev" style={{fontSize:64,fontWeight:700,color:"#EDEDED",letterSpacing:"-3px",lineHeight:0.96,marginBottom:24}}>
            Elige tu nivel<br/>de <em style={{fontStyle:"italic",color:"rgba(237,237,237,0.38)"}}>transformación</em>
          </h1>

          <p className="rev d1" style={{fontSize:17,color:"rgba(237,237,237,0.32)",lineHeight:1.85,fontWeight:300,maxWidth:560,margin:"0 auto 48px"}}>
            Desde un primer protocolo personalizado hasta el máximo nivel de acompañamiento clínico. Todos con Nuria disponible 24h.
          </p>

          {/* Toggle mensual/anual */}
          <div className="rev d2" style={{display:"inline-flex",background:"rgba(237,237,237,0.04)",border:"1px solid rgba(237,237,237,0.08)",borderRadius:50,padding:4,gap:4,marginBottom:16}}>
            {(["mensual","anual"] as const).map(p=>(
              <button key={p} onClick={()=>setPeriodo(p)} style={{padding:"8px 24px",borderRadius:50,border:"none",cursor:"pointer",fontSize:13,fontWeight:p===periodo?700:400,fontFamily:"var(--font-instrument,sans-serif)",background:p===periodo?"#EDEDED":"transparent",color:p===periodo?"#0B0B0B":"rgba(237,237,237,0.4)",transition:"all 0.2s ease",letterSpacing:"0.01em"}}>
                {p==="mensual"?"Mensual":"Anual · −20%"}
              </button>
            ))}
          </div>
        </section>

        <hr/>

        {/* PLANES GRID */}
        <section style={{padding:"80px 64px",maxWidth:1400,margin:"0 auto"}}>

          {/* Fila top: Básico, Pro, Élite */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
            {PLANES.filter(p=>p.nombre!=="Premium 1:1"&&p.nombre!=="Longevity").map((plan,i)=>(
              <div key={plan.nombre} className={`rev card-h d${i+1}`} style={{
                background:plan.destacado?"#FFFFFF":"rgba(237,237,237,0.03)",
                border:plan.destacado?"none":`1px solid rgba(237,237,237,0.08)`,
                borderRadius:24,
                padding:"36px 32px",
                display:"flex",
                flexDirection:"column",
                position:"relative",
                overflow:"hidden",
                boxShadow:plan.destacado?"0 40px 80px rgba(0,0,0,0.7),0 20px 40px rgba(0,0,0,0.5)":"none",
              }}>
                {plan.destacado && <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,#E8D090,#C6A96B)",borderRadius:"24px 24px 0 0"}}/>}
                {!plan.destacado && <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(237,237,237,0.08) 50%,transparent)"}}/>}

                {plan.badge && (
                  <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",background:plan.destacado?"#0B0B0B":"rgba(237,237,237,0.1)",borderRadius:"0 0 12px 12px",padding:"4px 16px"}}>
                    <span style={{fontSize:9,fontWeight:700,color:plan.destacado?"#EDEDED":"rgba(237,237,237,0.5)",letterSpacing:"0.08em"}}>{plan.badge}</span>
                  </div>
                )}

                <div style={{marginTop:plan.badge?20:0}}>
                  <p style={{fontSize:13,fontWeight:600,color:plan.destacado?"rgba(0,0,0,0.5)":"rgba(237,237,237,0.4)",marginBottom:4,letterSpacing:"-0.1px"}}>{plan.nombre}</p>
                  <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
                    <p className="sf" style={{fontSize:44,fontWeight:700,color:plan.destacado?"#0B0B0B":"#EDEDED",letterSpacing:"-2px",lineHeight:1}}>
                      {getPrice(plan.precio)}€
                    </p>
                    <span style={{fontSize:13,color:plan.destacado?"rgba(0,0,0,0.35)":"rgba(237,237,237,0.25)",fontWeight:300}}>/mes</span>
                  </div>
                  {periodo==="anual" && (
                    <p style={{fontSize:11,color:"#C6A96B",fontWeight:600,marginBottom:8}}>Antes {plan.precio}€/mes</p>
                  )}
                  <p style={{fontSize:13,color:plan.destacado?"rgba(0,0,0,0.45)":"rgba(237,237,237,0.3)",fontWeight:400,marginBottom:6,letterSpacing:"-0.1px"}}>{plan.subtitulo}</p>
                  <p style={{fontSize:13,color:plan.destacado?"rgba(0,0,0,0.4)":"rgba(237,237,237,0.25)",lineHeight:1.75,fontWeight:300,marginBottom:28}}>{plan.desc}</p>
                </div>

                <ul style={{listStyle:"none",flex:1,marginBottom:28}}>
                  {plan.items.map(item=>(
                    <li key={item} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:9}}>
                      <div style={{width:16,height:16,borderRadius:"50%",background:plan.destacado?"#0B0B0B":"rgba(237,237,237,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                        <span style={{color:plan.destacado?"white":"rgba(237,237,237,0.5)",fontSize:8,fontWeight:700}}>✓</span>
                      </div>
                      <span style={{fontSize:13,color:plan.destacado?"rgba(0,0,0,0.6)":"rgba(237,237,237,0.5)",fontWeight:300,lineHeight:1.5}}>{item}</span>
                    </li>
                  ))}
                  {plan.no.map(item=>(
                    <li key={item} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:9,opacity:0.5}}>
                      <div style={{width:16,height:16,borderRadius:"50%",border:`1px solid ${plan.destacado?"rgba(0,0,0,0.12)":"rgba(237,237,237,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                        <span style={{color:plan.destacado?"rgba(0,0,0,0.3)":"rgba(237,237,237,0.2)",fontSize:8}}>—</span>
                      </div>
                      <span style={{fontSize:13,color:plan.destacado?"rgba(0,0,0,0.3)":"rgba(237,237,237,0.2)",fontWeight:300,lineHeight:1.5}}>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/registro" className="btn-p" style={{
                  padding:"14px 20px",
                  borderRadius:14,
                  fontSize:13,
                  fontWeight:700,
                  letterSpacing:"0.01em",
                  background:plan.destacado?"#0B0B0B":"transparent",
                  color:plan.destacado?"white":"rgba(237,237,237,0.5)",
                  border:plan.destacado?"none":"1px solid rgba(237,237,237,0.1)",
                  boxShadow:plan.destacado?"0 8px 24px rgba(0,0,0,0.4)":"none",
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Fila bottom: Premium 1:1 + Longevity */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {PLANES.filter(p=>p.nombre==="Premium 1:1"||p.nombre==="Longevity").map((plan,i)=>(
              <div key={plan.nombre} className={`rev card-h d${i+1}`} style={{
                background:plan.nombre==="Premium 1:1"?"#EDEDED":"rgba(237,237,237,0.03)",
                border:plan.nombre==="Premium 1:1"?"none":"1px solid rgba(198,169,107,0.15)",
                borderRadius:24,
                padding:"40px 40px",
                display:"flex",
                flexDirection:"column",
                position:"relative",
                overflow:"hidden",
                boxShadow:plan.nombre==="Premium 1:1"?"0 40px 80px rgba(0,0,0,0.7)":"none",
              }}>
                {plan.nombre==="Longevity" && <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.4) 50%,transparent)"}}/>}

                {plan.badge && (
                  <div style={{display:"inline-flex",alignItems:"center",gap:6,border:`1px solid ${plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.12)":"rgba(198,169,107,0.25)"}`,borderRadius:50,padding:"3px 12px",marginBottom:20,alignSelf:"flex-start",background:plan.nombre==="Longevity"?"rgba(198,169,107,0.07)":"transparent"}}>
                    <span style={{fontSize:9,fontWeight:700,color:plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.45)":"#C6A96B",letterSpacing:"0.08em",textTransform:"uppercase"}}>{plan.badge}</span>
                  </div>
                )}

                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:32,alignItems:"flex-start",marginBottom:28}}>
                  <div>
                    <p style={{fontSize:15,fontWeight:600,color:plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.5)":"rgba(237,237,237,0.4)",marginBottom:6}}>{plan.nombre}</p>
                    {plan.precio ? (
                      <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
                        <p className="sf" style={{fontSize:44,fontWeight:700,color:plan.nombre==="Premium 1:1"?"#0B0B0B":"#EDEDED",letterSpacing:"-2px",lineHeight:1}}>
                          {getPrice(plan.precio)}€
                        </p>
                        <span style={{fontSize:13,color:plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.35)":"rgba(237,237,237,0.25)",fontWeight:300}}>/mes</span>
                      </div>
                    ) : (
                      <p className="sf" style={{fontSize:28,fontWeight:700,color:"#0B0B0B",letterSpacing:"-1px",lineHeight:1,marginBottom:6}}>
                        A consultar
                      </p>
                    )}
                    <p style={{fontSize:13,color:plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.45)":"#C6A96B",fontWeight:plan.nombre==="Longevity"?600:400,marginBottom:8}}>{plan.subtitulo}</p>
                    <p style={{fontSize:14,color:plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.4)":"rgba(237,237,237,0.28)",lineHeight:1.8,fontWeight:300,maxWidth:460}}>{plan.desc}</p>
                  </div>

                  <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:180}}>
                    {plan.items.slice(0,4).map(item=>(
                      <div key={item} style={{display:"flex",alignItems:"flex-start",gap:9}}>
                        <div style={{width:15,height:15,borderRadius:"50%",background:plan.nombre==="Premium 1:1"?"#0B0B0B":"rgba(198,169,107,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                          <span style={{color:plan.nombre==="Premium 1:1"?"white":"#C6A96B",fontSize:7,fontWeight:700}}>✓</span>
                        </div>
                        <span style={{fontSize:12,color:plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.55)":"rgba(237,237,237,0.45)",fontWeight:300,lineHeight:1.5}}>{item}</span>
                      </div>
                    ))}
                    {plan.items.length>4 && (
                      <p style={{fontSize:11,color:plan.nombre==="Premium 1:1"?"rgba(0,0,0,0.3)":"rgba(237,237,237,0.2)",fontWeight:300,marginTop:2}}>+{plan.items.length-4} más incluidos</p>
                    )}
                  </div>
                </div>

                <div style={{display:"flex",gap:12,alignItems:"center",marginTop:"auto"}}>
                  <Link href={plan.nombre==="Longevity"?"/registro?plan=longevity":plan.nombre==="Premium 1:1"?"/registro?plan=premium":"/registro"} className="btn-p" style={{
                    flex:1,
                    padding:"14px 20px",
                    borderRadius:14,
                    fontSize:13,
                    fontWeight:700,
                    letterSpacing:"0.01em",
                    background:plan.nombre==="Premium 1:1"?"#0B0B0B":plan.nombre==="Longevity"?"linear-gradient(145deg,#C6A96B,#8A7240)":"transparent",
                    color:plan.nombre==="Premium 1:1"?"white":plan.nombre==="Longevity"?"white":"rgba(237,237,237,0.5)",
                    border:plan.nombre==="Premium 1:1"||plan.nombre==="Longevity"?"none":"1px solid rgba(237,237,237,0.1)",
                    boxShadow:plan.nombre==="Longevity"?"0 8px 24px rgba(198,169,107,0.3)":"none",
                  }}>
                    {plan.cta}
                  </Link>
                  {plan.nombre==="Premium 1:1" && (
                    <p style={{fontSize:11,color:"rgba(0,0,0,0.3)",fontWeight:300,letterSpacing:"0.04em",textTransform:"uppercase"}}>Proceso de selección</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr/>

        {/* COMPARATIVA */}
        <section style={{padding:"100px 64px",maxWidth:1000,margin:"0 auto"}}>
          <div className="rev" style={{marginBottom:60}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Comparativa</p>
            <h2 className="sf" style={{fontSize:48,fontWeight:700,color:"#EDEDED",letterSpacing:"-2px",lineHeight:1.05}}>
              ¿Qué incluye<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>cada plan?</em>
            </h2>
          </div>

          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr>
                  <th style={{textAlign:"left",padding:"12px 16px",fontSize:11,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid rgba(237,237,237,0.06)"}}>Funcionalidad</th>
                  {["Básico","Pro","Élite","Premium","Longevity"].map(p=>(
                    <th key={p} style={{textAlign:"center",padding:"12px 16px",fontSize:12,fontWeight:p==="Pro"?700:500,color:p==="Pro"?"#EDEDED":"rgba(237,237,237,0.5)",borderBottom:"1px solid rgba(237,237,237,0.06)",background:p==="Pro"?"rgba(237,237,237,0.04)":"transparent"}}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Menú semanal personalizado","✓","✓","✓","✓","✓"],
                  ["Chat con Nuria 24h","✓","✓","✓","✓","✓"],
                  ["Lista de la compra automática","✓","✓","✓","✓","✓"],
                  ["Check-in diario","✓","✓","✓","✓","✓"],
                  ["Ajuste semanal automático","—","✓","✓","✓","✓"],
                  ["NutriScore semanal","—","✓","✓","✓","✓"],
                  ["Protocolo digestivo","—","✓","✓","✓","✓"],
                  ["Modo restaurante","—","✓","✓","✓","✓"],
                  ["Panel Bienestar completo","—","✓","✓","✓","✓"],
                  ["Protocolo hormonal femenino","—","—","✓","✓","✓"],
                  ["Gemelo metabólico IA","—","—","✓","✓","✓"],
                  ["Seguimiento biomarcadores","—","—","✓","✓","✓"],
                  ["Seguimiento semanal directo","—","—","—","✓","—"],
                  ["Protocolo antiedad","—","—","—","—","✓"],
                  ["Suplementación antiedad","—","—","—","—","✓"],
                  ["Análisis edad biológica","—","—","—","—","✓"],
                ].map(([feature,...vals],i)=>(
                  <tr key={feature} style={{background:i%2===0?"transparent":"rgba(237,237,237,0.015)"}}>
                    <td style={{padding:"13px 16px",fontSize:13,color:"rgba(237,237,237,0.45)",fontWeight:300,borderBottom:"1px solid rgba(237,237,237,0.04)"}}>{feature}</td>
                    {vals.map((v,j)=>(
                      <td key={j} style={{textAlign:"center",padding:"13px 16px",fontSize:14,fontWeight:700,color:v==="✓"?"#EDEDED":"rgba(237,237,237,0.12)",borderBottom:"1px solid rgba(237,237,237,0.04)",background:j===1?"rgba(237,237,237,0.02)":"transparent"}}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr/>

        {/* FAQ */}
        <section style={{padding:"100px 64px",maxWidth:800,margin:"0 auto"}}>
          <div className="rev" style={{textAlign:"center",marginBottom:64}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>FAQ</p>
            <h2 className="sf" style={{fontSize:48,fontWeight:700,color:"#EDEDED",letterSpacing:"-2px",lineHeight:1.05}}>
              Preguntas<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>frecuentes</em>
            </h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {FAQS.map(({q,a},i)=>(
              <div key={q} className="rev faq-card" style={{background:"rgba(237,237,237,0.03)",border:`1px solid ${faqOpen===i?"rgba(237,237,237,0.1)":"rgba(237,237,237,0.06)"}`,borderRadius:18,overflow:"hidden",cursor:"pointer",transition:"border-color 0.2s ease"}}
                onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
                <div style={{padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <p style={{fontSize:15,fontWeight:500,color:"#EDEDED",letterSpacing:"-0.2px"}}>{q}</p>
                  <span style={{color:"rgba(237,237,237,0.3)",fontSize:20,fontWeight:300,flexShrink:0,marginLeft:16,transition:"transform 0.3s ease",transform:faqOpen===i?"rotate(45deg)":"rotate(0)",display:"inline-block"}}>+</span>
                </div>
                {faqOpen===i && (
                  <div style={{padding:"0 24px 20px",borderTop:"1px solid rgba(237,237,237,0.06)"}}>
                    <p style={{fontSize:14,color:"rgba(237,237,237,0.38)",lineHeight:1.85,fontWeight:300,paddingTop:16}}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr/>

        {/* CTA FINAL */}
        <section style={{padding:"100px 64px 120px",textAlign:"center"}}>
          <div className="rev" style={{maxWidth:720,margin:"0 auto"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,border:"1px solid rgba(237,237,237,0.1)",borderRadius:50,padding:"5px 16px",marginBottom:40}}>
              <div className="gdot" style={{width:5,height:5,borderRadius:"50%",background:"#C6A96B",boxShadow:"0 0 8px rgba(198,169,107,0.9)"}}/>
              <span style={{fontSize:11,fontWeight:500,color:"rgba(237,237,237,0.35)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Primer protocolo en 2 minutos</span>
            </div>
            <h2 className="sf" style={{fontSize:56,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:24}}>
              Sin permanencia.<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>Sin compromisos.</em>
            </h2>
            <p style={{fontSize:16,color:"rgba(237,237,237,0.28)",lineHeight:1.85,fontWeight:300,marginBottom:44,maxWidth:480,margin:"0 auto 44px"}}>
              Elige el plan que mejor se adapta a tu momento. Puedes cambiar o cancelar cuando quieras.
            </p>
            <div style={{display:"flex",gap:14,justifyContent:"center",alignItems:"center"}}>
              <Link href="/registro" style={{background:"#EDEDED",color:"#0B0B0B",borderRadius:14,padding:"16px 40px",fontSize:15,fontWeight:700,textDecoration:"none",letterSpacing:"0.01em",display:"inline-block",transition:"transform 0.2s ease"}}>
                Comenzar ahora →
              </Link>
              <Link href="/#servicio" style={{fontSize:13,color:"rgba(237,237,237,0.28)",textDecoration:"none",fontWeight:300}}>
                Ver el programa 1:1
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div style={{borderTop:"1px solid rgba(237,237,237,0.06)",padding:"28px 64px"}}>
          <div style={{maxWidth:1360,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:24,height:24,borderRadius:7,background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span className="sf" style={{color:"white",fontSize:11,fontWeight:700,fontStyle:"italic"}}>N</span>
              </div>
              <span className="sf" style={{fontSize:15,fontWeight:600,color:"#EDEDED"}}>NutriAI</span>
            </div>
            <div style={{display:"flex",gap:24}}>
              {["Privacidad","Términos","Cookies"].map(l=>(
                <a key={l} href="#" style={{fontSize:12,color:"rgba(237,237,237,0.18)",textDecoration:"none",fontWeight:300}}>{l}</a>
              ))}
            </div>
            <p style={{fontSize:11,color:"rgba(237,237,237,0.15)",fontWeight:300}}>© {new Date().getFullYear()} NutriAI · Nutrición de élite</p>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const PROBLEMAS = [
  { num: "01", titulo: "Inflamación persistente", desc: "Tu cuerpo lleva meses en un estado de alarma silencioso. La inflamación crónica no es un síntoma aislado — es una señal sistémica que pocos saben leer." },
  { num: "02", titulo: "Desregulación hormonal", desc: "Ciclos irregulares, fatiga inexplicable, cambios de humor. La alimentación influye directamente en tu biología hormonal, y pocas personas lo trabajan con rigor." },
  { num: "03", titulo: "Estancamiento físico", desc: "Haces lo correcto y el cuerpo no responde. Porque sin un mapa metabólico individualizado, el esfuerzo no tiene dirección." },
  { num: "04", titulo: "Digestión comprometida", desc: "Hinchazón, pesadez, síntomas que van y vienen. No es normal. Es un sistema digestivo que necesita un protocolo real, no restricciones genéricas." },
];

const FASES = [
  { num: "I", titulo: "Análisis profundo", desc: "Evaluación clínica completa: biomarcadores, historial, patrones metabólicos, respuesta hormonal y relación con la alimentación. Tu biología es el punto de partida, no un formulario estándar." },
  { num: "II", titulo: "Estrategia personalizada", desc: "Un protocolo construido desde cero para ti. Cada macro, cada timing, cada elección alimentaria tiene un propósito fisiológico específico. Nada genérico." },
  { num: "III", titulo: "Ajuste continuo", desc: "El protocolo evoluciona cada semana en función de tu respuesta real. Nuria analiza tus datos y recalibra. La adaptación es permanente." },
  { num: "IV", titulo: "Optimización metabólica", desc: "Refinamiento progresivo hasta alcanzar el máximo potencial fisiológico. Marcadores de sangre, ciclo hormonal, marcadores digestivos — todo integrado." },
];

const TESTIMONIOS = [
  { inicial: "C", nombre: "Carmen R.", cargo: "Directora de operaciones · 38 años", resultado: "Inflamación resuelta en 6 semanas", texto: "Después de años buscando respuestas, entendí que el problema no era lo que comía, sino cómo mi biología procesaba lo que comía. El protocolo fue la primera intervención que lo trató como un sistema." },
  { inicial: "M", nombre: "Marta L.", cargo: "Médica especialista · 34 años", resultado: "SOP bajo control metabólico", texto: "La precisión del enfoque me sorprendió como profesional sanitaria. No fue una dieta — fue una estrategia clínica adaptada a mi fisiología concreta. Los resultados hablan por sí solos." },
  { inicial: "S", nombre: "Sofía T.", cargo: "Emprendedora · 41 años", resultado: "Composición corporal transformada", texto: "Había probado todo. Lo que cambió aquí fue la profundidad del análisis inicial y la capacidad de ajuste continuo. Por primera vez sentí que el plan era realmente mío." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.06, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".rev").forEach(el => observer.observe(el));
    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-instrument, -apple-system, sans-serif)", background: "#0B0B0B", color: "#EDEDED", minHeight: "100vh", overflowX: "hidden" }}>

      <style>{`
        * { box-sizing: border-box; }
        .sf { font-family: var(--font-playfair, Georgia, serif); }
        .rev { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1); }
        .rev.vis { opacity: 1; transform: translateY(0); }
        .d1{transition-delay:0.05s}.d2{transition-delay:0.15s}.d3{transition-delay:0.25s}.d4{transition-delay:0.35s}
        .btn-p { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease; display:inline-block; }
        .btn-p:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 14px 36px rgba(0,0,0,0.6); }
        .btn-p:active { transform: scale(0.98); }
        .card-h { transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.34,1.2,0.64,1); }
        .card-h:hover { border-color: rgba(237,237,237,0.12) !important; transform: translateY(-4px); }
        .lu { position:relative; text-decoration:none; }
        .lu::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#C6A96B; transition:width 0.3s cubic-bezier(0.16,1,0.3,1); }
        .lu:hover::after { width:100%; }
        .gdot { width:5px; height:5px; border-radius:50%; background:#C6A96B; box-shadow:0 0 8px rgba(198,169,107,0.9); animation:pd 3s ease-in-out infinite; display:inline-block; }
        @keyframes pd { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes fp { 0%,100%{transform:perspective(1600px) rotateY(-5deg) rotateX(2.5deg) translateY(0)} 50%{transform:perspective(1600px) rotateY(-5deg) rotateX(2.5deg) translateY(-10px)} }
        .pa { animation: fp 8s ease-in-out infinite; }
        .nav-s { background: rgba(11,11,11,0.97) !important; border-bottom-color: rgba(237,237,237,0.07) !important; }
      `}</style>

      {/* NAV */}
      <nav className={scrolled ? "nav-s" : ""} style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"transparent", borderBottom:"1px solid transparent", backdropFilter:"blur(40px)", WebkitBackdropFilter:"blur(40px)", padding:"0 64px", height:66, display:"flex", alignItems:"center", justifyContent:"space-between", transition:"background 0.4s ease, border-color 0.4s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(145deg,#C6A96B,#8A7240)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(198,169,107,0.35),inset 0 1px 0 rgba(255,255,255,0.18)" }}>
            <span className="sf" style={{ color:"white", fontSize:14, fontWeight:700, fontStyle:"italic" }}>N</span>
          </div>
          <span className="sf" style={{ fontSize:18, fontWeight:600, color:"#EDEDED", letterSpacing:"-0.4px" }}>NutriAI</span>
        </div>
        <div style={{ display:"flex", gap:36, alignItems:"center" }}>
          {[["El método","#metodo"],["Servicio","#servicio"],["Resultados","#resultados"]].map(([l,h])=>(
            <a key={l} href={h} className="lu" style={{ fontSize:13, color:"rgba(237,237,237,0.38)", fontWeight:400, letterSpacing:"0.01em" }}>{l}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <Link href="/login" style={{ fontSize:13, color:"rgba(237,237,237,0.3)", textDecoration:"none" }}>Acceder</Link>
          <Link href="/registro" className="btn-p" style={{ background:"#EDEDED", color:"#0B0B0B", borderRadius:11, padding:"9px 22px", fontSize:13, fontWeight:700, textDecoration:"none", letterSpacing:"0.01em" }}>
            Solicitar evaluación
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", paddingTop:66 }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 70% at 72% 45%, rgba(237,237,237,0.025) 0%, transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"5%", right:"0%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(198,169,107,0.04),transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(237,237,237,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(237,237,237,0.02) 1px,transparent 1px)", backgroundSize:"80px 80px", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1360, margin:"0 auto", padding:"0 64px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", width:"100%" }}>

          {/* Left */}
          <div className="rev">
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, border:"1px solid rgba(237,237,237,0.1)", borderRadius:50, padding:"5px 16px", marginBottom:40 }}>
              <span className="gdot"/>
              <span style={{ fontSize:11, fontWeight:500, color:"rgba(237,237,237,0.4)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Protocolo de nutrición clínica</span>
            </div>

            <h1 className="sf" style={{ fontSize:72, fontWeight:700, color:"#EDEDED", letterSpacing:"-3px", lineHeight:0.95, marginBottom:32 }}>
              Nutrición de<br/>
              <em style={{ fontStyle:"italic", color:"#C6A96B" }}>precisión</em><br/>
              para quienes<br/>
              buscan resultados<br/>
              <span style={{ color:"rgba(237,237,237,0.4)" }}>reales</span>
            </h1>

            <p style={{ fontSize:17, color:"rgba(237,237,237,0.38)", lineHeight:1.85, fontWeight:300, marginBottom:48, maxWidth:460 }}>
              Protocolos personalizados basados en biología, no en tendencias. Para quienes entienden que la transformación fisiológica requiere rigor.
            </p>

            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:60 }}>
              <Link href="/registro" className="btn-p" style={{ background:"#EDEDED", color:"#0B0B0B", borderRadius:13, padding:"14px 36px", fontSize:14, fontWeight:700, textDecoration:"none", letterSpacing:"0.01em" }}>
                Solicitar evaluación
              </Link>
              <a href="#metodo" style={{ fontSize:13, color:"rgba(237,237,237,0.28)", fontWeight:300, textDecoration:"none" }}>
                Ver el método ↓
              </a>
            </div>

            <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(237,237,237,0.07)", paddingTop:32 }}>
              {[["500+","Protocolos activos"],["+34","Condiciones clínicas"],["24h","Sistema Nuria"],["98%","Adherencia"]].map(([n,l],i)=>(
                <div key={l} style={{ flex:1, paddingRight:24, borderRight:i<3?"1px solid rgba(237,237,237,0.07)":"none", paddingLeft:i>0?24:0 }}>
                  <p className="sf" style={{ fontSize:28, fontWeight:700, color:"#EDEDED", letterSpacing:"-1px", lineHeight:1 }}>{n}</p>
                  <p style={{ fontSize:10, color:"rgba(237,237,237,0.22)", marginTop:6, fontWeight:300, letterSpacing:"0.06em", lineHeight:1.5 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Panel BLANCO flotante */}
          <div className="rev d2" style={{ position:"relative" }}>
            <div style={{ position:"absolute", inset:-80, background:"radial-gradient(circle,rgba(237,237,237,0.04),transparent 65%)", pointerEvents:"none" }}/>

            <div className="pa" style={{ background:"#FAFAF8", borderRadius:28, overflow:"hidden", boxShadow:"0 80px 180px rgba(0,0,0,0.85),0 40px 90px rgba(0,0,0,0.65),0 20px 40px rgba(0,0,0,0.45),0 8px 16px rgba(0,0,0,0.3)", position:"relative" }}>

              <div style={{ padding:"13px 20px", borderBottom:"1px solid rgba(0,0,0,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#F5F5F2" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:24, height:24, borderRadius:7, background:"linear-gradient(145deg,#C6A96B,#8A7240)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span className="sf" style={{ color:"white", fontSize:11, fontWeight:700, fontStyle:"italic" }}>N</span>
                  </div>
                  <span className="sf" style={{ fontSize:13, fontWeight:600, color:"#0B0B0B" }}>NutriAI</span>
                </div>
                <div style={{ display:"flex", gap:5 }}>
                  {["#FF5F57","#FFBD2E","#28CA41"].map(c=><div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }}/>)}
                </div>
              </div>

              <div style={{ padding:"18px 20px", display:"grid", gridTemplateColumns:"104px 1fr", gap:16 }}>
                <div style={{ borderRight:"1px solid rgba(0,0,0,0.06)", paddingRight:14, display:"flex", flexDirection:"column", gap:3 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(145deg,#C6A96B,#8A7240)", margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span className="sf" style={{ color:"white", fontSize:16, fontWeight:700, fontStyle:"italic" }}>Y</span>
                  </div>
                  <p style={{ fontSize:8, color:"rgba(0,0,0,0.3)", textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Yadira</p>
                  {["Dashboard","Protocolo","Bienestar","Progreso","Nuria"].map((item,i)=>(
                    <div key={item} style={{ padding:"5px 8px", borderRadius:8, background:i===0?"#0B0B0B":"transparent", fontSize:10, color:i===0?"white":"rgba(0,0,0,0.35)", fontWeight:i===0?500:400 }}>{item}</div>
                  ))}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                  <div>
                    <p style={{ fontSize:8, color:"rgba(198,169,107,0.7)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:3, fontWeight:600 }}>Jueves, 16 de abril</p>
                    <p className="sf" style={{ fontSize:17, fontWeight:600, color:"#0B0B0B", letterSpacing:"-0.5px" }}>Tu protocolo de hoy</p>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                    {[["~820","kcal"],["~58g","prot"],["2","tomas"],["4/7","días"]].map(([v,l])=>(
                      <div key={l} style={{ background:"#0B0B0B", borderRadius:10, padding:"8px 9px", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:0, left:0, right:0, height:"1.5px", background:"linear-gradient(90deg,#C6A96B,transparent)", opacity:0.7 }}/>
                        <p className="sf" style={{ fontSize:14, fontWeight:700, color:"#EDEDED", letterSpacing:"-0.5px" }}>{v}</p>
                        <p style={{ fontSize:8, color:"rgba(237,237,237,0.3)", marginTop:2 }}>{l}</p>
                      </div>
                    ))}
                  </div>

                  {[["☀️","Comida","Quinoa con verduras asadas"],["🌙","Cena","Salmón antiinflamatorio"]].map(([e,t,n])=>(
                    <div key={t} style={{ background:"#F0EFEB", border:"1px solid rgba(0,0,0,0.07)", borderRadius:12, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:10, background:"#0B0B0B", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{e}</div>
                      <div>
                        <p style={{ fontSize:8, color:"rgba(198,169,107,0.8)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:2, fontWeight:600 }}>{t}</p>
                        <p style={{ fontSize:12, fontWeight:600, color:"#0B0B0B" }}>{n}</p>
                      </div>
                    </div>
                  ))}

                  <div style={{ background:"#0B0B0B", borderRadius:12, padding:"10px 13px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.4) 50%,transparent)" }}/>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:"linear-gradient(145deg,#C6A96B,#8A7240)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span className="sf" style={{ color:"white", fontSize:9, fontWeight:700, fontStyle:"italic" }}>N</span>
                      </div>
                      <p style={{ fontSize:8, fontWeight:600, color:"#C6A96B", textTransform:"uppercase", letterSpacing:"0.1em" }}>Nuria</p>
                    </div>
                    <p className="sf" style={{ fontSize:10, color:"rgba(237,237,237,0.45)", lineHeight:1.6, fontStyle:"italic" }}>&quot;Protocolo antiinflamatorio funcionando. Mantén el ritmo.&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position:"absolute", width:"85%", height:40, background:"rgba(237,237,237,0.04)", borderRadius:"50%", bottom:-20, left:"7.5%", filter:"blur(28px)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", width:"60%", height:20, background:"rgba(0,0,0,0.5)", borderRadius:"50%", bottom:-10, left:"20%", filter:"blur(16px)", pointerEvents:"none" }}/>
          </div>
        </div>
      </section>

      <hr style={{ border:"none", borderTop:"1px solid rgba(237,237,237,0.06)", margin:0 }}/>

      {/* DESCALIFICACIÓN */}
      <section style={{ padding:"120px 64px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto" }}>
          <div className="rev" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:100, alignItems:"start" }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:"rgba(237,237,237,0.22)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:24 }}>Antes de continuar</p>
              <h2 className="sf" style={{ fontSize:48, fontWeight:700, color:"#EDEDED", letterSpacing:"-2px", lineHeight:1.05 }}>
                Esto no<br/>es para <em style={{ fontStyle:"italic", color:"rgba(237,237,237,0.3)" }}>todo el mundo</em>
              </h2>
            </div>
            <div style={{ paddingTop:16 }}>
              <p style={{ fontSize:15, color:"rgba(237,237,237,0.35)", lineHeight:1.9, fontWeight:300, marginBottom:36 }}>
                Este nivel de acompañamiento requiere compromiso real. Si buscas una solución rápida, una dieta de moda o resultados sin proceso, este no es tu lugar.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {["Buscas soluciones rápidas sin proceso real","No estás dispuesta a comprometerte con el seguimiento","Quieres solo una dieta más, no una transformación","Esperas resultados sin entender tu biología"].map((item,i)=>(
                  <div key={i} className={`rev d${i+1}`} style={{ display:"flex", alignItems:"flex-start", gap:16, padding:"18px 22px", border:"1px solid rgba(237,237,237,0.06)", borderRadius:14, background:"rgba(237,237,237,0.02)" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", border:"1px solid rgba(237,237,237,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <span style={{ color:"rgba(237,237,237,0.2)", fontSize:11 }}>✕</span>
                    </div>
                    <p style={{ fontSize:14, color:"rgba(237,237,237,0.38)", fontWeight:300, lineHeight:1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
              <p className="sf" style={{ fontSize:17, color:"rgba(237,237,237,0.5)", fontStyle:"italic", marginTop:36, lineHeight:1.7 }}>
                &quot;Trabajamos con pocas personas. Las que están listas para tomarse su salud en serio.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ border:"none", borderTop:"1px solid rgba(237,237,237,0.06)", margin:0 }}/>

      {/* AUTORIDAD */}
      <section style={{ padding:"120px 64px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto" }}>
          <div className="rev" style={{ maxWidth:820, marginBottom:80 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"rgba(237,237,237,0.22)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:24 }}>El estándar</p>
            <h2 className="sf" style={{ fontSize:48, fontWeight:700, color:"#EDEDED", letterSpacing:"-2px", lineHeight:1.1, marginBottom:28 }}>
              Cada protocolo se construye desde cero en base a tu fisiología
            </h2>
            <p style={{ fontSize:16, color:"rgba(237,237,237,0.32)", lineHeight:1.9, fontWeight:300 }}>
              No usamos plantillas. No aplicamos protocolos estándar. Cada intervención parte del análisis profundo de tu biología individual — marcadores, historial, respuesta metabólica y ciclo hormonal.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"rgba(237,237,237,0.05)" }}>
            {[["500+","Protocolos activos","Transformaciones documentadas con seguimiento continuo y medición objetiva de resultados."],["34+","Condiciones clínicas","Desde patología digestiva y hormonal hasta autoinmune, metabólica y deportiva de alto rendimiento."],["IA clínica","Nuria · Sistema propio","Inteligencia artificial clínica entrenada para ajuste continuo basado en tu respuesta biológica real."]].map(([n,t,d],i)=>(
              <div key={t} className={`rev d${i+1}`} style={{ background:"#0B0B0B", padding:"52px 48px", borderRight:i<2?"1px solid rgba(237,237,237,0.05)":"none" }}>
                <p className="sf" style={{ fontSize:44, fontWeight:700, color:"#EDEDED", letterSpacing:"-2px", marginBottom:14, lineHeight:1 }}>{n}</p>
                <p style={{ fontSize:14, fontWeight:600, color:"rgba(237,237,237,0.55)", marginBottom:12 }}>{t}</p>
                <p style={{ fontSize:13, color:"rgba(237,237,237,0.25)", lineHeight:1.8, fontWeight:300 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border:"none", borderTop:"1px solid rgba(237,237,237,0.06)", margin:0 }}/>

      {/* PROBLEMAS */}
      <section style={{ padding:"120px 64px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto" }}>
          <div className="rev" style={{ textAlign:"center", marginBottom:80 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"rgba(237,237,237,0.22)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:20 }}>Lo que nadie ha resuelto</p>
            <h2 className="sf" style={{ fontSize:52, fontWeight:700, color:"#EDEDED", letterSpacing:"-2.5px", lineHeight:1.02 }}>
              ¿Reconoces alguna<br/><em style={{ fontStyle:"italic", color:"rgba(237,237,237,0.35)" }}>de estas señales?</em>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"rgba(237,237,237,0.05)" }}>
            {PROBLEMAS.map(({ num, titulo, desc },i)=>(
              <div key={num} className={`rev card-h d${i+1}`} style={{ background:"#0B0B0B", padding:"52px 48px", border:"1px solid transparent", borderRight:i%2===0?"1px solid rgba(237,237,237,0.05)":"none", borderBottom:i<2?"1px solid rgba(237,237,237,0.05)":"none" }}>
                <p className="sf" style={{ fontSize:13, fontWeight:600, color:"rgba(237,237,237,0.18)", letterSpacing:"0.06em", marginBottom:20 }}>{num}</p>
                <h3 className="sf" style={{ fontSize:26, fontWeight:600, color:"#EDEDED", letterSpacing:"-0.8px", marginBottom:16, lineHeight:1.2 }}>{titulo}</h3>
                <p style={{ fontSize:14, color:"rgba(237,237,237,0.32)", lineHeight:1.85, fontWeight:300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border:"none", borderTop:"1px solid rgba(237,237,237,0.06)", margin:0 }}/>

      {/* MÉTODO */}
      <section id="metodo" style={{ padding:"120px 64px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto" }}>
          <div className="rev" style={{ marginBottom:88 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"rgba(237,237,237,0.22)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:20 }}>El sistema</p>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:32 }}>
              <h2 className="sf" style={{ fontSize:52, fontWeight:700, color:"#EDEDED", letterSpacing:"-2.5px", lineHeight:1.02 }}>
                Método<br/><em style={{ fontStyle:"italic", color:"#C6A96B" }}>Horizonte Metabólico</em>
              </h2>
              <p style={{ fontSize:14, color:"rgba(237,237,237,0.25)", maxWidth:360, lineHeight:1.9, fontWeight:300 }}>
                Un proceso de cuatro fases que convierte tu biología en datos accionables y tu alimentación en una herramienta de transformación real.
              </p>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:1, background:"rgba(237,237,237,0.04)" }}>
            {FASES.map(({ num, titulo, desc },i)=>(
              <div key={num} className={`rev card-h d${i+1}`} style={{ background:"#0B0B0B", padding:"44px 56px", display:"flex", alignItems:"flex-start", gap:52, border:"1px solid transparent", borderBottom:i<3?"1px solid rgba(237,237,237,0.04)":"none" }}>
                <p className="sf" style={{ fontSize:52, fontWeight:700, color:"rgba(237,237,237,0.06)", letterSpacing:"-3px", lineHeight:1, flexShrink:0, width:70, fontStyle:"italic" }}>{num}</p>
                <div style={{ flex:1 }}>
                  <h3 className="sf" style={{ fontSize:24, fontWeight:600, color:"#EDEDED", letterSpacing:"-0.5px", marginBottom:12 }}>{titulo}</h3>
                  <p style={{ fontSize:14, color:"rgba(237,237,237,0.3)", lineHeight:1.9, fontWeight:300, maxWidth:680 }}>{desc}</p>
                </div>
                <div style={{ width:36, height:36, borderRadius:"50%", border:"1px solid rgba(237,237,237,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:4 }}>
                  <span style={{ color:"rgba(237,237,237,0.2)", fontSize:15 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border:"none", borderTop:"1px solid rgba(237,237,237,0.06)", margin:0 }}/>

      {/* SERVICIO */}
      <section id="servicio" style={{ padding:"120px 64px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto" }}>
          <div className="rev" style={{ textAlign:"center", marginBottom:80 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"rgba(237,237,237,0.22)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:20 }}>El programa</p>
            <h2 className="sf" style={{ fontSize:52, fontWeight:700, color:"#EDEDED", letterSpacing:"-2.5px", lineHeight:1.02 }}>
              Un nivel de acompañamiento<br/><em style={{ fontStyle:"italic", color:"rgba(237,237,237,0.35)" }}>que no se puede escalar</em>
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {/* High ticket card BLANCA */}
            <div className="rev" style={{ background:"#EDEDED", borderRadius:28, padding:"52px 48px", display:"flex", flexDirection:"column", boxShadow:"0 40px 80px rgba(0,0,0,0.6)" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, border:"1px solid rgba(0,0,0,0.12)", borderRadius:50, padding:"4px 14px", marginBottom:32, alignSelf:"flex-start" }}>
                <span style={{ fontSize:10, fontWeight:600, color:"rgba(0,0,0,0.4)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Recomendado</span>
              </div>
              <h3 className="sf" style={{ fontSize:32, fontWeight:700, color:"#0B0B0B", letterSpacing:"-1px", marginBottom:10 }}>Protocolo Élite 1:1</h3>
              <p style={{ fontSize:14, color:"rgba(0,0,0,0.42)", marginBottom:32, letterSpacing:"0.01em" }}>Transformación guiada · Acceso directo</p>
              <p style={{ fontSize:15, color:"rgba(0,0,0,0.52)", lineHeight:1.9, fontWeight:300, marginBottom:40, flex:1 }}>
                El nivel más alto de personalización disponible. Análisis biológico completo, protocolo construido desde cero, ajuste semanal dinámico con Nuria y acceso directo durante todo el proceso.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
                {["Evaluación clínica avanzada completa","Protocolo nutricional exclusivo e individual","Ajuste semanal dinámico con sistema Nuria","Seguimiento de biomarcadores en tiempo real","Protocolo hormonal y digestivo integrado","Acceso directo durante todo el proceso"].map(item=>(
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:"#0B0B0B", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:"white", fontSize:9 }}>✓</span>
                    </div>
                    <p style={{ fontSize:13, color:"rgba(0,0,0,0.52)", fontWeight:400 }}>{item}</p>
                  </div>
                ))}
              </div>
              <Link href="/registro" className="btn-p" style={{ display:"block", textAlign:"center", padding:"16px 20px", borderRadius:14, fontSize:14, fontWeight:700, textDecoration:"none", background:"#0B0B0B", color:"#EDEDED", letterSpacing:"0.01em" }}>
                Solicitar evaluación
              </Link>
              <p style={{ fontSize:11, color:"rgba(0,0,0,0.28)", textAlign:"center", marginTop:14, fontWeight:300 }}>Proceso de selección · Plazas limitadas</p>
            </div>

            {/* Secondary */}
            <div className="rev d2" style={{ background:"rgba(237,237,237,0.03)", border:"1px solid rgba(237,237,237,0.07)", borderRadius:28, padding:"52px 48px", display:"flex", flexDirection:"column" }}>
              <h3 className="sf" style={{ fontSize:32, fontWeight:700, color:"#EDEDED", letterSpacing:"-1px", marginBottom:10 }}>Plan Estratégico</h3>
              <p style={{ fontSize:14, color:"rgba(237,237,237,0.28)", marginBottom:32 }}>Diseño completo · Ejecución autónoma</p>
              <p style={{ fontSize:15, color:"rgba(237,237,237,0.3)", lineHeight:1.9, fontWeight:300, marginBottom:40, flex:1 }}>
                Tu protocolo nutricional completo, diseñado en base a tu historial clínico y objetivos. Para quienes prefieren ejecutar con autonomía. Sin seguimiento continuo, con toda la precisión del análisis inicial.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
                {["Evaluación clínica detallada","Protocolo nutricional completo","Menú semanal personalizado","Lista de la compra automática","Acceso al sistema Nuria"].map(item=>(
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", border:"1px solid rgba(237,237,237,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:"rgba(237,237,237,0.35)", fontSize:8 }}>✓</span>
                    </div>
                    <p style={{ fontSize:13, color:"rgba(237,237,237,0.35)", fontWeight:300 }}>{item}</p>
                  </div>
                ))}
              </div>
              <Link href="/registro" className="btn-p" style={{ display:"block", textAlign:"center", padding:"16px 20px", borderRadius:14, fontSize:14, fontWeight:500, textDecoration:"none", background:"transparent", color:"rgba(237,237,237,0.45)", border:"1px solid rgba(237,237,237,0.1)", letterSpacing:"0.01em" }}>
                Conocer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ border:"none", borderTop:"1px solid rgba(237,237,237,0.06)", margin:0 }}/>

      {/* TESTIMONIOS */}
      <section id="resultados" style={{ padding:"120px 64px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto" }}>
          <div className="rev" style={{ marginBottom:80 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"rgba(237,237,237,0.22)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:20 }}>Resultados</p>
            <h2 className="sf" style={{ fontSize:52, fontWeight:700, color:"#EDEDED", letterSpacing:"-2.5px", lineHeight:1.02 }}>
              Transformaciones que<br/><em style={{ fontStyle:"italic", color:"rgba(237,237,237,0.35)" }}>hablan por sí solas</em>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {TESTIMONIOS.map(({ inicial, nombre, cargo, resultado, texto },i)=>(
              <div key={nombre} className={`rev card-h d${i+1}`} style={{ background:"rgba(237,237,237,0.03)", border:"1px solid rgba(237,237,237,0.06)", borderRadius:24, padding:"40px 36px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(237,237,237,0.07)", border:"1px solid rgba(237,237,237,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span className="sf" style={{ color:"rgba(237,237,237,0.55)", fontSize:22, fontWeight:600, fontStyle:"italic" }}>{inicial}</span>
                  </div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:600, color:"#EDEDED", letterSpacing:"-0.2px" }}>{nombre}</p>
                    <p style={{ fontSize:11, color:"#C6A96B", fontWeight:500, marginTop:2 }}>{resultado}</p>
                    <p style={{ fontSize:11, color:"rgba(237,237,237,0.2)", fontWeight:300, marginTop:2 }}>{cargo}</p>
                  </div>
                </div>
                <p className="sf" style={{ fontSize:15, color:"rgba(237,237,237,0.42)", lineHeight:1.85, fontStyle:"italic" }}>&quot;{texto}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border:"none", borderTop:"1px solid rgba(237,237,237,0.06)", margin:0 }}/>

      {/* CTA FINAL */}
      <section style={{ padding:"140px 64px 160px" }}>
        <div style={{ maxWidth:860, margin:"0 auto", textAlign:"center" }} className="rev">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, border:"1px solid rgba(237,237,237,0.1)", borderRadius:50, padding:"6px 18px", marginBottom:44 }}>
            <span className="gdot"/>
            <span style={{ fontSize:11, fontWeight:500, color:"rgba(237,237,237,0.3)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Proceso de selección activo</span>
          </div>

          <h2 className="sf" style={{ fontSize:68, fontWeight:700, color:"#EDEDED", letterSpacing:"-3px", lineHeight:0.97, marginBottom:28 }}>
            Si estás lista para<br/>
            <em style={{ fontStyle:"italic", color:"rgba(237,237,237,0.3)" }}>tomarte tu salud</em><br/>
            en serio
          </h2>

          <p style={{ fontSize:17, color:"rgba(237,237,237,0.28)", lineHeight:1.9, fontWeight:300, marginBottom:52, maxWidth:520, margin:"0 auto 52px" }}>
            Sin compromisos inmediatos. Una evaluación inicial para determinar si este nivel de trabajo es el adecuado para ti.
          </p>

          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            <Link href="/registro" className="btn-p" style={{ background:"#EDEDED", color:"#0B0B0B", borderRadius:14, padding:"18px 52px", fontSize:16, fontWeight:700, textDecoration:"none", letterSpacing:"0.01em", display:"inline-block" }}>
              Solicitar acceso
            </Link>
            <p style={{ fontSize:11, color:"rgba(237,237,237,0.18)", fontWeight:300, letterSpacing:"0.08em", textTransform:"uppercase" }}>Proceso de selección · Plazas muy limitadas</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ borderTop:"1px solid rgba(237,237,237,0.06)", padding:"32px 64px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:26, height:26, borderRadius:7, background:"linear-gradient(145deg,#C6A96B,#8A7240)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span className="sf" style={{ color:"white", fontSize:12, fontWeight:700, fontStyle:"italic" }}>N</span>
            </div>
            <span className="sf" style={{ fontSize:15, fontWeight:600, color:"#EDEDED" }}>NutriAI</span>
          </div>
          <div style={{ display:"flex", gap:28 }}>
            {["Privacidad","Términos","Cookies"].map(l=>(
              <a key={l} href="#" style={{ fontSize:12, color:"rgba(237,237,237,0.18)", textDecoration:"none", fontWeight:300 }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize:11, color:"rgba(237,237,237,0.15)", fontWeight:300 }}>© {new Date().getFullYear()} NutriAI · Nutrición de élite</p>
        </div>
      </div>

    </div>
  );
}

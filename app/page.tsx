"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const PROBLEMAS = [
  { icon: "◈", titulo: "Inflamación constante", desc: "Tu cuerpo lleva meses enviando señales que nadie ha sabido leer. La inflamación crónica no es normal, es un mensaje." },
  { icon: "◉", titulo: "Digestión comprometida", desc: "Hinchazón, pesadez, síntomas que van y vienen. No es estrés. Es un sistema digestivo que necesita un protocolo real." },
  { icon: "◎", titulo: "Estancamiento físico", desc: "Haces todo bien y no avanzas. Porque sin un mapa metabólico personalizado, el esfuerzo se desperdicia." },
  { icon: "✦", titulo: "Fatiga y descontrol hormonal", desc: "La energía baja, el humor fluctúa, el cuerpo no responde. La nutrición de precisión puede cambiar todo esto." },
];

const FASES = [
  { num: "01", titulo: "Evaluación biológica profunda", desc: "Análisis de biomarcadores, historial clínico completo, patrones metabólicos y respuesta hormonal. Tu biología como punto de partida." },
  { num: "02", titulo: "Estrategia nutricional personalizada", desc: "Un protocolo diseñado exclusivamente para ti. Ningún plan estándar. Cada macro, cada timing, cada alimento — justificado." },
  { num: "03", titulo: "Ajuste dinámico semanal", desc: "Nuria analiza tu respuesta cada semana y reajusta el protocolo. El plan evoluciona contigo, no al revés." },
  { num: "04", titulo: "Optimización metabólica continua", desc: "Monitorización de marcadores, adaptación a ciclos hormonales y refinamiento progresivo hasta alcanzar tu potencial máximo." },
];

const FEATURES = [
  { emoji: "🥗", titulo: "Menú semanal personalizado", desc: "7 días de platos adaptados a tu objetivo, intolerancias y tipo de dieta. Con ingredientes en gramos en crudo." },
  { emoji: "💬", titulo: "Nuria, tu nutricionista IA 24h", desc: "Resuelve dudas, gestiona síntomas y te apoya emocionalmente. Aprende de ti cada semana." },
  { emoji: "📊", titulo: "NutriScore semanal", desc: "Un número del 0-100 que resume tu semana: adherencia, energía y digestión." },
  { emoji: "🔄", titulo: "Ajuste automático", desc: "Nuria analiza tus check-ins y reajusta el menú cada semana. Tu plan mejora solo." },
  { emoji: "🛒", titulo: "Lista de la compra", desc: "Del menú semanal se genera una lista agrupada por sección del supermercado." },
  { emoji: "🍽️", titulo: "Modo restaurante", desc: "Dile a Nuria dónde vas a cenar y te da las 3 mejores opciones adaptadas a tu plan." },
  { emoji: "💪", titulo: "Panel Mi Bienestar", desc: "Cuerpo, día, mente, ciclo y salud. Todo en un panel que Nuria usa para personalizar tu protocolo." },
  { emoji: "🌿", titulo: "Protocolo hormonal femenino", desc: "Calendario de ciclo menstrual con nutrición adaptada a cada fase. Solo en planes Pro y superior." },
  { emoji: "⚡", titulo: "Gemelo metabólico IA", desc: "Un modelo digital de tu metabolismo que predice tu respuesta a los alimentos y optimiza resultados." },
];

const TESTIMONIOS = [
  { inicial: "C", nombre: "Carmen R.", resultado: "Inflamación reducida en 3 semanas", texto: "Llevo 8 años con problemas digestivos. En 3 semanas de protocolo entendí más sobre mi cuerpo que en toda mi vida anterior.", cargo: "Directiva · 38 años" },
  { inicial: "M", nombre: "Marta L.", resultado: "SOP bajo control", texto: "Nadie me había explicado la conexión entre mi alimentación y mi ciclo hormonal. El método es diferente a todo lo que había probado.", cargo: "Médica · 34 años" },
  { inicial: "S", nombre: "Sofía T.", resultado: "−8 kg en 4 meses", texto: "No fue una dieta. Fue entender cómo funciona mi metabolismo y darle lo que necesita. Los resultados llegaron solos.", cargo: "Arquitecta · 41 años" },
];

const FAQS = [
  { q: "¿Cuánto tarda en generarse mi primer protocolo?", a: "Menos de 2 minutos. Rellenas tu evaluación clínica y Nuria genera tu protocolo personalizado al instante." },
  { q: "¿Funciona para veganos, celíacos o con intolerancias?", a: "Sí. El formulario recoge más de 18 intolerancias y todos los tipos de alimentación incluyendo vegano, keto, paleo y ayuno intermitente." },
  { q: "¿Cada cuánto se actualiza el protocolo?", a: "Cada semana automáticamente. Nuria analiza tus check-ins y reajusta según tu respuesta real." },
  { q: "¿Es seguro para personas con patologías?", a: "NutriAI es una herramienta de apoyo nutricional clínico. El formulario recoge más de 34 condiciones de salud para personalizar el protocolo." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí, sin permanencia ni penalizaciones. Cancelas cuando quieras desde tu perfil." },
  { q: "¿Qué diferencia hay entre los planes?", a: "El plan Básico incluye menú y chat. Pro añade ajuste semanal automático y NutriScore. Élite incluye protocolo hormonal y gemelo metabólico. Longevity añade nutrición antiedad." },
];

const PLANES = [
  { nombre: "Básico", precio: "9,99€", badge: "", items: ["✓ Menú semanal personalizado", "✓ Chat con Nuria", "✓ Lista de la compra", "✓ Check-in diario", "— Ajuste semanal", "— NutriScore", "— Protocolo hormonal"], cta: "Empezar", destacado: false, longevity: false },
  { nombre: "Pro", precio: "19,99€", badge: "Más popular", items: ["✓ Todo Básico", "✓ Ajuste semanal automático", "✓ NutriScore semanal", "✓ Protocolo digestivo", "✓ Modo restaurante", "✓ Bienestar completo", "— Gemelo metabólico"], cta: "Empezar con Pro", destacado: true, longevity: false },
  { nombre: "Élite", precio: "39,99€", badge: "", items: ["✓ Todo Pro", "✓ Protocolo hormonal femenino", "✓ Gemelo metabólico", "✓ Seguimiento avanzado", "✓ Prioridad soporte", "✓ Marcadores de sangre", "✓ Calendario de ciclo"], cta: "Empezar", destacado: false, longevity: false },
  { nombre: "Longevity", precio: "59,99€", badge: "NUEVO", items: ["✓ Todo Élite", "✓ Plan antiedad con IA", "✓ Protocolo antioxidante", "✓ Análisis longevidad", "✓ Suplementación antiedad", "✓ NMN, resveratrol, CoQ10", "✓ Edad biológica estimada"], cta: "Quiero vivir más", destacado: false, longevity: true },
];

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rev").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-instrument, sans-serif)", background: "#0B0B0B", color: "#EDEDED", minHeight: "100vh", overflowX: "hidden" }}>

      <style>{`
        * { box-sizing: border-box; }
        .rev { opacity:0; transform:translateY(32px); transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .rev.vis { opacity:1; transform:translateY(0); }
        .d1{transition-delay:0.05s}.d2{transition-delay:0.12s}.d3{transition-delay:0.19s}.d4{transition-delay:0.26s}.d5{transition-delay:0.33s}.d6{transition-delay:0.40s}.d7{transition-delay:0.47s}.d8{transition-delay:0.54s}.d9{transition-delay:0.61s}
        .card-e { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, box-shadow 0.3s ease; }
        .card-e:hover { transform: translateY(-6px); border-color: rgba(198,169,107,0.35) !important; box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,169,107,0.15) !important; }
        .btn-e { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, filter 0.2s ease; display:inline-block; }
        .btn-e:hover { transform: translateY(-2px) scale(1.02); filter: brightness(1.1); }
        .btn-e:active { transform: scale(0.97); }
        .link-e { transition: color 0.2s ease; position: relative; }
        .link-e:hover { color: #C6A96B !important; }
        .gold-line { position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#C6A96B; transition:width 0.3s cubic-bezier(0.16,1,0.3,1); }
        .link-e:hover .gold-line { width:100%; }
        @keyframes pulse-gold { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        .pulse { animation: pulse-gold 2.5s ease-in-out infinite; }
        @keyframes float-slow { 0%,100%{transform:translateY(0) rotateY(-4deg) rotateX(2deg)} 50%{transform:translateY(-8px) rotateY(-4deg) rotateX(2deg)} }
        .panel-float { animation: float-slow 7s ease-in-out infinite; transform-style: preserve-3d; }
        .nav-link { font-size:13px; color:rgba(237,237,237,0.42); font-weight:400; text-decoration:none; letter-spacing:0.01em; position:relative; }
        .precio-toggle { display:inline-flex; background:rgba(255,255,255,0.04); border:1px solid rgba(198,169,107,0.12); border-radius:50px; padding:4px; gap:4px; margin-bottom:48px; }
        .precio-toggle span { padding:7px 20px; border-radius:50px; font-size:12px; font-weight:500; cursor:pointer; transition:all 0.2s ease; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, borderBottom: "1px solid rgba(198,169,107,0.08)", background: "rgba(11,11,11,0.9)", backdropFilter: "blur(48px) saturate(180%)", WebkitBackdropFilter: "blur(48px) saturate(180%)", padding: "0 56px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(198,169,107,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
            <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 15, fontWeight: 700, fontStyle: "italic" }}>N</span>
          </div>
          <span style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 19, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.5px" }}>NutriAI</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[["El método", "#metodo"], ["Funcionalidades", "#features"], ["Planes", "#planes"], ["Resultados", "#resultados"]].map(([l, h]) => (
            <a key={l} href={h} className="nav-link link-e" style={{ fontSize: 13, color: "rgba(237,237,237,0.42)", textDecoration: "none", position: "relative" }}>
              {l}<span className="gold-line" />
            </a>
          ))}
          <Link href="/login" className="nav-link link-e" style={{ fontSize: 13, color: "rgba(237,237,237,0.42)", textDecoration: "none", position: "relative" }}>
            Acceder<span className="gold-line" />
          </Link>
          <Link href="/registro" className="btn-e" style={{ background: "linear-gradient(145deg,#C6A96B,#8A7240)", border: "none", borderRadius: 13, padding: "10px 24px", fontSize: 13, fontWeight: 600, color: "white", textDecoration: "none", letterSpacing: "0.02em", boxShadow: "0 6px 20px rgba(198,169,107,0.28)" }}>
            Solicitar evaluación
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 62 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 65% at 68% 50%, rgba(198,169,107,0.055) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "8%", right: "2%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,169,107,0.035), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "8%", left: "3%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,169,107,0.025), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 56px", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center", width: "100%" }}>

          {/* Left */}
          <div className="rev">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(198,169,107,0.22)", borderRadius: 50, padding: "6px 16px", marginBottom: 36 }}>
              <div className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#C6A96B" }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(198,169,107,0.75)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nutrición de élite · IA clínica</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 64, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2.5px", lineHeight: 1.0, marginBottom: 28 }}>
              Nutrición de<br />
              <em style={{ fontStyle: "italic", color: "#C6A96B" }}>precisión</em><br />
              para transformar<br />
              tu cuerpo desde dentro
            </h1>
            <p style={{ fontSize: 17, color: "rgba(237,237,237,0.42)", lineHeight: 1.8, fontWeight: 300, marginBottom: 44, maxWidth: 440 }}>
              Planes diseñados con base científica, adaptados a tu biología y estilo de vida. No es una dieta. Es un protocolo.
            </p>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 48 }}>
              <Link href="/registro" className="btn-e" style={{ background: "linear-gradient(145deg,#C6A96B,#8A7240)", border: "none", borderRadius: 15, padding: "15px 36px", fontSize: 15, fontWeight: 600, color: "white", textDecoration: "none", letterSpacing: "0.03em", boxShadow: "0 10px 32px rgba(198,169,107,0.32)" }}>
                Aplicar al programa →
              </Link>
              <a href="#metodo" style={{ fontSize: 14, color: "rgba(198,169,107,0.55)", fontWeight: 400, textDecoration: "none", letterSpacing: "0.02em" }}>
                Ver el método ↓
              </a>
            </div>
            <div style={{ display: "flex", gap: 36, paddingTop: 32, borderTop: "1px solid rgba(198,169,107,0.1)" }}>
              {[["500+", "Protocolos activos"], ["+34", "Condiciones clínicas"], ["24h", "Nuria disponible"], ["98%", "Adherencia"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 26, fontWeight: 700, color: "#C6A96B", letterSpacing: "-1px", lineHeight: 1 }}>{n}</p>
                  <p style={{ fontSize: 10, color: "rgba(237,237,237,0.28)", marginTop: 7, fontWeight: 300, letterSpacing: "0.05em", lineHeight: 1.4 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Panel flotante */}
          <div className="rev d2" style={{ position: "relative", perspective: 1400 }}>
            <div style={{ position: "absolute", inset: -60, background: "radial-gradient(circle, rgba(198,169,107,0.05), transparent 70%)", pointerEvents: "none" }} />
            <div className="panel-float" style={{ background: "linear-gradient(145deg,rgba(22,22,18,0.97),rgba(14,14,10,0.99))", border: "1px solid rgba(198,169,107,0.18)", borderRadius: 32, overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,0.7), 0 30px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(198,169,107,0.12) inset, 0 0 80px rgba(198,169,107,0.03)", position: "relative" }}>
              {/* specular */}
              <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg,transparent,rgba(198,169,107,0.3) 30%,rgba(198,169,107,0.5) 50%,rgba(198,169,107,0.3) 70%,transparent)", pointerEvents: "none", zIndex: 10 }} />
              {/* top bar */}
              <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(198,169,107,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(198,169,107,0.3)" }}>
                    <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 13, fontWeight: 700, fontStyle: "italic" }}>N</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 15, fontWeight: 600, color: "#EDEDED" }}>NutriAI</span>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#E24B4A", "#EF9F27", "#5E8842"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.65 }} />)}
                </div>
              </div>
              {/* body */}
              <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "110px 1fr", gap: 16 }}>
                {/* sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, borderRight: "1px solid rgba(198,169,107,0.07)", paddingRight: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(198,169,107,0.25)", boxShadow: "0 4px 14px rgba(198,169,107,0.2)" }}>
                    <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 18, fontWeight: 700, fontStyle: "italic" }}>Y</span>
                  </div>
                  <p style={{ fontSize: 9, color: "rgba(198,169,107,0.4)", textAlign: "center", marginBottom: 8, fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase" }}>Yadira</p>
                  {["Dashboard", "Protocolo", "Bienestar", "Progreso", "Nuria"].map((item, i) => (
                    <div key={item} style={{ padding: "6px 9px", borderRadius: 9, background: i === 0 ? "rgba(198,169,107,0.1)" : "transparent", border: `1px solid ${i === 0 ? "rgba(198,169,107,0.18)" : "transparent"}`, fontSize: 11, color: i === 0 ? "#C6A96B" : "rgba(237,237,237,0.28)", fontWeight: i === 0 ? 600 : 300 }}>{item}</div>
                  ))}
                </div>
                {/* main */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, color: "rgba(198,169,107,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontWeight: 500 }}>Jueves, 16 de abril</p>
                    <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 20, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.6px" }}>Tu protocolo de hoy</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {[["~820", "kcal"], ["~58g", "prot"], ["2", "tomas"], ["4/7", "días"]].map(([v, l]) => (
                      <div key={l} style={{ background: "rgba(198,169,107,0.05)", border: "1px solid rgba(198,169,107,0.1)", borderRadius: 12, padding: "10px 10px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg,#C6A96B,transparent)", opacity: 0.5 }} />
                        <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 16, fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.5px" }}>{v}</p>
                        <p style={{ fontSize: 9, color: "rgba(198,169,107,0.4)", marginTop: 3, fontWeight: 300 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                  {[["☀️", "Comida", "Quinoa con verduras asadas"], ["🌙", "Cena", "Salmón antiinflamatorio"]].map(([e, t, n]) => (
                    <div key={t} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(198,169,107,0.08)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(198,169,107,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, border: "1px solid rgba(198,169,107,0.1)" }}>{e}</div>
                      <div>
                        <p style={{ fontSize: 9, color: "rgba(198,169,107,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3, fontWeight: 500 }}>{t}</p>
                        <p style={{ fontSize: 12, fontWeight: 500, color: "#EDEDED", letterSpacing: "-0.2px" }}>{n}</p>
                      </div>
                      <div style={{ marginLeft: "auto", width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(198,169,107,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "rgba(198,169,107,0.5)", fontSize: 12 }}>+</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: "linear-gradient(155deg,rgba(198,169,107,0.1),rgba(138,114,64,0.06))", border: "1px solid rgba(198,169,107,0.15)", borderRadius: 14, padding: "12px 14px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg,rgba(255,255,255,0.04),transparent)", pointerEvents: "none" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, position: "relative", zIndex: 1 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(198,169,107,0.3)" }}>
                        <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 10, fontWeight: 700, fontStyle: "italic" }}>N</span>
                      </div>
                      <p style={{ fontSize: 9, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Nuria</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 11, color: "rgba(198,169,107,0.5)", lineHeight: 1.6, fontStyle: "italic", position: "relative", zIndex: 1 }}>"Tu protocolo antiinflamatorio está dando resultados esta semana."</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", width: "75%", height: 40, background: "rgba(198,169,107,0.08)", borderRadius: "50%", bottom: -22, left: "12.5%", filter: "blur(24px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: "50%", height: 20, background: "rgba(198,169,107,0.05)", borderRadius: "50%", bottom: -10, left: "25%", filter: "blur(12px)", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* AUTORIDAD */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid rgba(198,169,107,0.07)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="rev" style={{ maxWidth: 760, marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 20 }}>El estándar</p>
            <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 34, fontWeight: 600, color: "#EDEDED", letterSpacing: "-1px", lineHeight: 1.3 }}>
              No trabajamos con dietas estándar. Cada protocolo se diseña en base a biomarcadores, historial clínico y respuesta metabólica.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(198,169,107,0.06)" }}>
            {[
              ["500+", "Protocolos activos", "Transformaciones fisiológicas documentadas y medidas."],
              ["34+", "Condiciones clínicas", "Desde digestivo y hormonal hasta autoinmune y metabólico."],
              ["IA clínica", "Método propio", "El sistema Nuria: ajuste continuo basado en tu respuesta real."],
            ].map(([n, t, d], i) => (
              <div key={t} className={`rev d${i + 1}`} style={{ background: "#0B0B0B", padding: "44px 40px", borderRight: i < 2 ? "1px solid rgba(198,169,107,0.06)" : "none" }}>
                <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 40, fontWeight: 700, color: "#C6A96B", letterSpacing: "-1.5px", marginBottom: 12 }}>{n}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#EDEDED", marginBottom: 10, letterSpacing: "-0.3px" }}>{t}</p>
                <p style={{ fontSize: 13, color: "rgba(237,237,237,0.32)", lineHeight: 1.75, fontWeight: 300 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMAS */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid rgba(198,169,107,0.07)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Lo que nadie ha resuelto</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 46, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.08 }}>
              Llevas tiempo<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>buscando respuestas</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PROBLEMAS.map(({ icon, titulo, desc }, i) => (
              <div key={titulo} className={`rev card-e d${i + 1}`} style={{ background: "linear-gradient(145deg,rgba(22,22,18,0.9),rgba(14,14,10,0.95))", border: "1px solid rgba(198,169,107,0.07)", borderRadius: 22, padding: "36px 32px" }}>
                <p style={{ fontSize: 22, color: "#C6A96B", marginBottom: 18, opacity: 0.55 }}>{icon}</p>
                <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 22, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.5px", marginBottom: 12 }}>{titulo}</h3>
                <p style={{ fontSize: 14, color: "rgba(237,237,237,0.38)", lineHeight: 1.8, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section id="metodo" style={{ padding: "100px 56px", borderTop: "1px solid rgba(198,169,107,0.07)", background: "linear-gradient(180deg,#0B0B0B 0%,#0D0D09 100%)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="rev" style={{ marginBottom: 80 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>El sistema</p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
              <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 46, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.08 }}>
                Método<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>Horizonte Metabólico</em>
              </h2>
              <p style={{ fontSize: 14, color: "rgba(237,237,237,0.32)", maxWidth: 340, lineHeight: 1.8, fontWeight: 300 }}>
                Un proceso de 4 fases que convierte tu biología en datos accionables y tu alimentación en una herramienta de transformación real.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(198,169,107,0.05)" }}>
            {FASES.map(({ num, titulo, desc }, i) => (
              <div key={num} className={`rev card-e d${i + 1}`} style={{ background: "#0B0B0B", padding: "40px 48px", display: "flex", alignItems: "flex-start", gap: 48, borderBottom: i < 3 ? "1px solid rgba(198,169,107,0.05)" : "none" }}>
                <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 56, fontWeight: 700, color: "rgba(198,169,107,0.12)", letterSpacing: "-3px", lineHeight: 1, flexShrink: 0, width: 90 }}>{num}</p>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 24, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.5px", marginBottom: 12 }}>{titulo}</h3>
                  <p style={{ fontSize: 14, color: "rgba(237,237,237,0.38)", lineHeight: 1.8, fontWeight: 300, maxWidth: 620 }}>{desc}</p>
                </div>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(198,169,107,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
                  <span style={{ color: "#C6A96B", fontSize: 13 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 56px", borderTop: "1px solid rgba(198,169,107,0.07)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Funcionalidades</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 46, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.08 }}>
              Todo lo que necesitas<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>para comer bien de verdad</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {FEATURES.map(({ emoji, titulo, desc }, i) => (
              <div key={titulo} className={`rev card-e d${(i % 3) + 1}`} style={{ background: "linear-gradient(145deg,rgba(22,22,18,0.9),rgba(14,14,10,0.95))", border: "1px solid rgba(198,169,107,0.07)", borderRadius: 22, padding: "28px 26px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg,transparent,rgba(198,169,107,0.2) 40%,rgba(198,169,107,0.35) 50%,rgba(198,169,107,0.2) 60%,transparent)", pointerEvents: "none" }} />
                <p style={{ fontSize: 30, marginBottom: 16 }}>{emoji}</p>
                <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 18, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.4px", marginBottom: 10 }}>{titulo}</h3>
                <p style={{ fontSize: 13, color: "rgba(237,237,237,0.36)", lineHeight: 1.75, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{ padding: "100px 56px", borderTop: "1px solid rgba(198,169,107,0.07)", background: "linear-gradient(180deg,#0B0B0B 0%,#0D0D09 100%)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Planes</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 46, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.08 }}>
              Elige tu nivel<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>de transformación</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            {PLANES.map(({ nombre, precio, badge, items, cta, destacado, longevity }, i) => (
              <div key={nombre} className={`rev card-e d${i + 1}`} style={{ background: destacado ? "linear-gradient(145deg,rgba(198,169,107,0.07),rgba(138,114,64,0.04))" : longevity ? "linear-gradient(145deg,rgba(198,169,107,0.05),rgba(138,114,64,0.03))" : "linear-gradient(145deg,rgba(22,22,18,0.9),rgba(14,14,10,0.95))", border: `1px solid ${destacado ? "rgba(198,169,107,0.28)" : longevity ? "rgba(198,169,107,0.2)" : "rgba(198,169,107,0.07)"}`, borderRadius: 24, padding: "32px 26px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                {badge && (
                  <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", background: destacado ? "linear-gradient(145deg,#C6A96B,#8A7240)" : "linear-gradient(145deg,rgba(198,169,107,0.8),rgba(138,114,64,0.7))", borderRadius: "0 0 12px 12px", padding: "4px 16px" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "white", letterSpacing: "0.08em" }}>{badge}</span>
                  </div>
                )}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,${destacado || longevity ? "rgba(198,169,107,0.5)" : "rgba(198,169,107,0.15)"} 40%,${destacado || longevity ? "rgba(198,169,107,0.7)" : "rgba(198,169,107,0.22)"} 50%,${destacado || longevity ? "rgba(198,169,107,0.5)" : "rgba(198,169,107,0.15)"} 60%,transparent)`, pointerEvents: "none" }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: "#EDEDED", marginTop: badge ? 16 : 0, marginBottom: 8, letterSpacing: "-0.3px" }}>{nombre}</p>
                <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 32, fontWeight: 700, color: destacado || longevity ? "#C6A96B" : "#EDEDED", letterSpacing: "-1.5px", marginBottom: 4, lineHeight: 1 }}>{precio}</p>
                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.25)", fontWeight: 300, marginBottom: 20, letterSpacing: "0.04em" }}>al mes</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1 }}>
                  {items.map(item => (
                    <li key={item} style={{ fontSize: 12, color: item.startsWith("—") ? "rgba(237,237,237,0.2)" : "rgba(237,237,237,0.55)", fontWeight: item.startsWith("—") ? 300 : 400, marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                      {!item.startsWith("—") && <span style={{ color: "#C6A96B", fontSize: 9, marginTop: 3, flexShrink: 0 }}>◆</span>}
                      {item.startsWith("—") && <span style={{ color: "rgba(237,237,237,0.15)", fontSize: 9, marginTop: 3, flexShrink: 0 }}>—</span>}
                      <span>{item.replace("✓ ", "").replace("— ", "")}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/registro" className="btn-e" style={{ display: "block", textAlign: "center", padding: "12px 16px", borderRadius: 14, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em", background: destacado ? "linear-gradient(145deg,#C6A96B,#8A7240)" : longevity ? "linear-gradient(145deg,rgba(198,169,107,0.7),rgba(138,114,64,0.6))" : "transparent", color: destacado || longevity ? "white" : "#C6A96B", border: destacado || longevity ? "none" : "1px solid rgba(198,169,107,0.22)", boxShadow: destacado ? "0 8px 24px rgba(198,169,107,0.28)" : "none" }}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="resultados" style={{ padding: "100px 56px", borderTop: "1px solid rgba(198,169,107,0.07)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Resultados</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 46, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.08 }}>
              Resultados que<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>se sostienen</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {TESTIMONIOS.map(({ inicial, nombre, resultado, texto, cargo }, i) => (
              <div key={nombre} className={`rev card-e d${i + 1}`} style={{ background: "linear-gradient(145deg,rgba(22,22,18,0.9),rgba(14,14,10,0.95))", border: "1px solid rgba(198,169,107,0.07)", borderRadius: 24, padding: "36px 30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(145deg,rgba(198,169,107,0.25),rgba(138,114,64,0.15))", border: "1px solid rgba(198,169,107,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-playfair, serif)", color: "#C6A96B", fontSize: 20, fontWeight: 700, fontStyle: "italic" }}>{inicial}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.2px" }}>{nombre}</p>
                    <p style={{ fontSize: 12, color: "#C6A96B", fontWeight: 500, marginTop: 2 }}>{resultado}</p>
                    <p style={{ fontSize: 10, color: "rgba(237,237,237,0.22)", fontWeight: 300, marginTop: 2 }}>{cargo}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 15, color: "rgba(237,237,237,0.5)", lineHeight: 1.8, fontStyle: "italic" }}>"{texto}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid rgba(198,169,107,0.07)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.55)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>FAQ</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 46, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.08 }}>
              Preguntas<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>frecuentes</em>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map(({ q, a }, i) => (
              <div key={q} className="rev card-e" style={{ background: "linear-gradient(145deg,rgba(22,22,18,0.9),rgba(14,14,10,0.95))", border: `1px solid ${faqOpen === i ? "rgba(198,169,107,0.25)" : "rgba(198,169,107,0.07)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer" }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 15, fontWeight: 500, color: "#EDEDED", letterSpacing: "-0.3px" }}>{q}</p>
                  <span style={{ color: "#C6A96B", fontSize: 18, fontWeight: 300, flexShrink: 0, marginLeft: 16, transition: "transform 0.3s ease", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </div>
                {faqOpen === i && (
                  <div style={{ padding: "0 24px 20px", borderTop: "1px solid rgba(198,169,107,0.08)" }}>
                    <p style={{ fontSize: 14, color: "rgba(237,237,237,0.4)", lineHeight: 1.8, fontWeight: 300, paddingTop: 16 }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "100px 56px 120px", borderTop: "1px solid rgba(198,169,107,0.07)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }} className="rev">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(198,169,107,0.18)", borderRadius: 50, padding: "6px 18px", marginBottom: 36 }}>
            <div className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#C6A96B" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(198,169,107,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Plazas limitadas</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 56, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2.5px", lineHeight: 1.02, marginBottom: 24 }}>
            ¿Lista para empezar<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>tu transformación?</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(237,237,237,0.32)", lineHeight: 1.8, fontWeight: 300, marginBottom: 44, maxWidth: 500, margin: "0 auto 44px" }}>
            Tu protocolo personalizado comienza con una evaluación. Sin compromisos, sin dietas genéricas.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
            <Link href="/registro" className="btn-e" style={{ background: "linear-gradient(145deg,#C6A96B,#8A7240)", border: "none", borderRadius: 16, padding: "18px 40px", fontSize: 16, fontWeight: 600, color: "white", textDecoration: "none", letterSpacing: "0.03em", boxShadow: "0 12px 36px rgba(198,169,107,0.32)" }}>
              Solicitar mi evaluación →
            </Link>
            <Link href="/login" style={{ fontSize: 13, color: "rgba(198,169,107,0.45)", textDecoration: "none", fontWeight: 300 }}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(198,169,107,0.07)", padding: "32px 56px", background: "#0B0B0B" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(198,169,107,0.25)" }}>
              <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 13, fontWeight: 700, fontStyle: "italic" }}>N</span>
            </div>
            <span style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 16, fontWeight: 600, color: "#EDEDED" }}>NutriAI</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Privacidad", "Términos", "Cookies"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "rgba(237,237,237,0.2)", textDecoration: "none", fontWeight: 300 }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(237,237,237,0.18)", fontWeight: 300 }}>© {new Date().getFullYear()} NutriAI · Nutrición de élite</p>
        </div>
      </footer>

    </div>
  );
}

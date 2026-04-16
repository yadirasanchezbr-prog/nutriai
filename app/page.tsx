"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

const TESTIMONIOS = [
  { inicial: "C", nombre: "Carmen R.", resultado: "Inflamación reducida en 3 semanas", texto: "Llevo 8 años con problemas digestivos. En 3 semanas de protocolo entendí más sobre mi cuerpo que en toda mi vida anterior.", cargo: "Directiva · 38 años" },
  { inicial: "M", nombre: "Marta L.", resultado: "SOP bajo control", texto: "Nadie me había explicado la conexión entre mi alimentación y mi ciclo hormonal. El método es diferente a todo lo que había probado.", cargo: "Médica · 34 años" },
  { inicial: "S", nombre: "Sofía T.", resultado: "−8 kg en 4 meses", texto: "No fue una dieta. Fue entender cómo funciona mi metabolismo y darle lo que necesita. Los resultados llegaron solos.", cargo: "Arquitecta · 41 años" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rev").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-instrument, sans-serif)", background: "#0B0B0B", color: "#EDEDED", minHeight: "100vh", overflowX: "hidden" }}>

      <style>{`
        .rev { opacity:0; transform:translateY(32px); transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .rev.vis { opacity:1; transform:translateY(0); }
        .d1{transition-delay:0.1s}.d2{transition-delay:0.2s}.d3{transition-delay:0.3s}.d4{transition-delay:0.4s}
        .card-e { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease; }
        .card-e:hover { transform: translateY(-6px); border-color: rgba(198,169,107,0.4) !important; }
        .btn-e { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, filter 0.2s ease; }
        .btn-e:hover { transform: translateY(-2px) scale(1.02); filter: brightness(1.08); }
        .btn-e:active { transform: scale(0.97); }
        .link-e { transition: color 0.2s ease; position: relative; }
        .link-e:hover { color: #C6A96B !important; }
        .gold-line { position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#C6A96B; transition:width 0.3s cubic-bezier(0.16,1,0.3,1); }
        .link-e:hover .gold-line { width:100%; }
        @keyframes pulse-gold { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        .pulse { animation: pulse-gold 2.5s ease-in-out infinite; }
        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float { animation: float-slow 6s ease-in-out infinite; }
        .noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, borderBottom: "1px solid rgba(198,169,107,0.1)", background: "rgba(11,11,11,0.88)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", padding: "0 48px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(198,169,107,0.3)" }}>
            <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 14, fontWeight: 700, fontStyle: "italic" }}>N</span>
          </div>
          <span style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 18, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.4px" }}>NutriAI</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[["El método", "#metodo"], ["Resultados", "#resultados"], ["Servicios", "#servicios"]].map(([l, h]) => (
            <a key={l} href={h} className="link-e" style={{ fontSize: 13, color: "rgba(237,237,237,0.45)", fontWeight: 400, textDecoration: "none", letterSpacing: "0.01em", position: "relative" }}>
              {l}<span className="gold-line" />
            </a>
          ))}
          <Link href="/login" className="link-e" style={{ fontSize: 13, color: "rgba(237,237,237,0.45)", textDecoration: "none", position: "relative" }}>
            Acceder<span className="gold-line" />
          </Link>
          <Link href="/registro" className="btn-e" style={{ background: "linear-gradient(145deg,#C6A96B,#8A7240)", border: "none", borderRadius: 13, padding: "9px 22px", fontSize: 13, fontWeight: 600, color: "white", textDecoration: "none", letterSpacing: "0.02em", boxShadow: "0 6px 20px rgba(198,169,107,0.3)", display: "inline-block" }}>
            Solicitar evaluación
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 60 }}>
        {/* Background elements */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(198,169,107,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,169,107,0.04), transparent 70%)", pointerEvents: "none" }} className="float" />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,169,107,0.03), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%" }}>

          {/* Left */}
          <div className="rev">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(198,169,107,0.25)", borderRadius: 50, padding: "5px 14px", marginBottom: 32 }}>
              <div className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#C6A96B" }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(198,169,107,0.8)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nutrición de élite · IA clínica</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 58, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.02, marginBottom: 24 }}>
              Nutrición de<br />
              <em style={{ fontStyle: "italic", color: "#C6A96B" }}>precisión</em><br />
              para transformar<br />
              tu cuerpo desde dentro
            </h1>
            <p style={{ fontSize: 16, color: "rgba(237,237,237,0.45)", lineHeight: 1.8, fontWeight: 300, marginBottom: 40, maxWidth: 420 }}>
              Planes diseñados con base científica, adaptados a tu biología y estilo de vida. No es una dieta. Es un protocolo.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Link href="/registro" className="btn-e" style={{ background: "linear-gradient(145deg,#C6A96B,#8A7240)", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 14, fontWeight: 600, color: "white", textDecoration: "none", letterSpacing: "0.03em", boxShadow: "0 8px 28px rgba(198,169,107,0.35)", display: "inline-block" }}>
                Aplicar al programa →
              </Link>
              <a href="#metodo" style={{ fontSize: 13, color: "rgba(198,169,107,0.6)", fontWeight: 400, textDecoration: "none", letterSpacing: "0.02em" }}>
                Ver el método ↓
              </a>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(198,169,107,0.1)" }}>
              {[["500+", "Protocolos activos"], ["34+", "Condiciones clínicas"], ["24h", "Nuria disponible"], ["98%", "Tasa de adherencia"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 24, fontWeight: 700, color: "#C6A96B", letterSpacing: "-0.5px", lineHeight: 1 }}>{n}</p>
                  <p style={{ fontSize: 10, color: "rgba(237,237,237,0.3)", marginTop: 6, fontWeight: 300, letterSpacing: "0.04em", lineHeight: 1.4 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - panel preview */}
          <div className="rev d2" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -40, background: "radial-gradient(circle, rgba(198,169,107,0.06), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ background: "linear-gradient(145deg,rgba(26,26,26,0.95),rgba(18,18,18,0.98))", border: "1px solid rgba(198,169,107,0.15)", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(198,169,107,0.1) inset", transform: "perspective(1200px) rotateY(-4deg) rotateX(2deg)", position: "relative" }}>
              {/* top bar */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(198,169,107,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 12, fontWeight: 700, fontStyle: "italic" }}>N</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 14, fontWeight: 600, color: "#EDEDED" }}>NutriAI</span>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#E24B4A", "#EF9F27", "#5E8842"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
                </div>
              </div>
              {/* content */}
              <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "90px 1fr", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(198,169,107,0.3)" }}>
                    <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 14, fontWeight: 700, fontStyle: "italic" }}>Y</span>
                  </div>
                  {["Dashboard", "Protocolo", "Bienestar", "Progreso", "Nuria"].map((item, i) => (
                    <div key={item} style={{ padding: "5px 8px", borderRadius: 8, background: i === 0 ? "rgba(198,169,107,0.12)" : "transparent", border: `1px solid ${i === 0 ? "rgba(198,169,107,0.2)" : "transparent"}`, fontSize: 10, color: i === 0 ? "#C6A96B" : "rgba(237,237,237,0.3)", fontWeight: i === 0 ? 600 : 400 }}>{item}</div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 16, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.5px" }}>Tu protocolo de hoy</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    {[["~820", "kcal"], ["~58g", "prot"], ["2", "tomas"], ["4/7", "días"]].map(([v, l]) => (
                      <div key={l} style={{ background: "rgba(198,169,107,0.06)", border: "1px solid rgba(198,169,107,0.12)", borderRadius: 11, padding: "9px 11px" }}>
                        <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 15, fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.5px" }}>{v}</p>
                        <p style={{ fontSize: 9, color: "rgba(237,237,237,0.3)", marginTop: 2 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                  {[["☀️", "Comida", "Quinoa con verduras"], ["🌙", "Cena", "Salmón antiinflamatorio"]].map(([e, t, n]) => (
                    <div key={t} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(198,169,107,0.1)", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(198,169,107,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{e}</div>
                      <div>
                        <p style={{ fontSize: 8, color: "rgba(198,169,107,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{t}</p>
                        <p style={{ fontSize: 11, fontWeight: 500, color: "#EDEDED" }}>{n}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: "linear-gradient(155deg,rgba(198,169,107,0.12),rgba(138,114,64,0.08))", border: "1px solid rgba(198,169,107,0.15)", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 9, fontWeight: 700, fontStyle: "italic" }}>N</span>
                      </div>
                      <p style={{ fontSize: 8, fontWeight: 700, color: "rgba(198,169,107,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Nuria</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 10, color: "rgba(198,169,107,0.55)", lineHeight: 1.55, fontStyle: "italic" }}>"Tu protocolo antiinflamatorio está funcionando."</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", width: "80%", height: 30, background: "rgba(198,169,107,0.1)", borderRadius: "50%", bottom: -18, left: "10%", filter: "blur(20px)", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* AUTORIDAD */}
      <section style={{ padding: "100px 48px", borderTop: "1px solid rgba(198,169,107,0.08)", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="rev" style={{ maxWidth: 720, marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.6)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 20 }}>El estándar</p>
            <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 32, fontWeight: 600, color: "#EDEDED", letterSpacing: "-1px", lineHeight: 1.3 }}>
              No trabajamos con dietas estándar. Cada protocolo se diseña en base a biomarcadores, historial clínico y respuesta metabólica.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(198,169,107,0.08)" }}>
            {[
              ["500+", "Protocolos activos", "Transformaciones fisiológicas documentadas y medidas."],
              ["34+", "Condiciones clínicas", "Desde digestivo y hormonal hasta autoinmune y metabólico."],
              ["IA clínica", "Método propio", "El sistema Nuria: ajuste continuo basado en tu respuesta real."],
            ].map(([n, t, d], i) => (
              <div key={t} className={`rev d${i + 1}`} style={{ background: "#0B0B0B", padding: "40px 36px", borderRight: i < 2 ? "1px solid rgba(198,169,107,0.08)" : "none" }}>
                <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 36, fontWeight: 700, color: "#C6A96B", letterSpacing: "-1px", marginBottom: 10 }}>{n}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#EDEDED", marginBottom: 10, letterSpacing: "-0.2px" }}>{t}</p>
                <p style={{ fontSize: 13, color: "rgba(237,237,237,0.35)", lineHeight: 1.7, fontWeight: 300 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ padding: "100px 48px", borderTop: "1px solid rgba(198,169,107,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.6)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Lo que nadie ha resuelto</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 42, fontWeight: 700, color: "#EDEDED", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Llevas tiempo<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>buscando respuestas</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PROBLEMAS.map(({ icon, titulo, desc }, i) => (
              <div key={titulo} className={`rev card-e d${i + 1}`} style={{ background: "linear-gradient(145deg,rgba(26,26,26,0.8),rgba(18,18,18,0.9))", border: "1px solid rgba(198,169,107,0.08)", borderRadius: 20, padding: "32px 28px" }}>
                <p style={{ fontSize: 20, color: "#C6A96B", marginBottom: 16, opacity: 0.6 }}>{icon}</p>
                <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 20, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.5px", marginBottom: 12 }}>{titulo}</h3>
                <p style={{ fontSize: 14, color: "rgba(237,237,237,0.4)", lineHeight: 1.75, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section id="metodo" style={{ padding: "100px 48px", borderTop: "1px solid rgba(198,169,107,0.08)", background: "linear-gradient(180deg,#0B0B0B 0%,#0F0F0A 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="rev" style={{ marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.6)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>El sistema</p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
              <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 42, fontWeight: 700, color: "#EDEDED", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
                Método<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>Horizonte Metabólico</em>
              </h2>
              <p style={{ fontSize: 14, color: "rgba(237,237,237,0.35)", maxWidth: 320, lineHeight: 1.7, fontWeight: 300 }}>
                Un proceso de 4 fases que convierte tu biología en datos accionables y tu alimentación en una herramienta de transformación real.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(198,169,107,0.06)" }}>
            {FASES.map(({ num, titulo, desc }, i) => (
              <div key={num} className={`rev card-e d${i + 1}`} style={{ background: "#0B0B0B", padding: "36px 40px", display: "flex", alignItems: "flex-start", gap: 40, borderBottom: i < 3 ? "1px solid rgba(198,169,107,0.06)" : "none" }}>
                <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 48, fontWeight: 700, color: "rgba(198,169,107,0.15)", letterSpacing: "-2px", lineHeight: 1, flexShrink: 0, width: 80 }}>{num}</p>
                <div>
                  <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 22, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.5px", marginBottom: 10 }}>{titulo}</h3>
                  <p style={{ fontSize: 14, color: "rgba(237,237,237,0.4)", lineHeight: 1.75, fontWeight: 300, maxWidth: 600 }}>{desc}</p>
                </div>
                <div style={{ marginLeft: "auto", flexShrink: 0, width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(198,169,107,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#C6A96B", fontSize: 12 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: "100px 48px", borderTop: "1px solid rgba(198,169,107,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.6)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Programas</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 42, fontWeight: 700, color: "#EDEDED", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Elige tu nivel<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>de transformación</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              {
                nombre: "Protocolo Élite",
                sub: "Transformación guiada 1:1",
                desc: "El nivel más alto de personalización. Nuria analiza tu biología, diseña tu protocolo y lo ajusta cada semana según tu respuesta real.",
                items: ["Evaluación biológica completa", "Protocolo nutricional personalizado", "Ajuste semanal dinámico con Nuria", "Seguimiento de biomarcadores", "Soporte continuo 24h", "Protocolo hormonal y digestivo"],
                cta: "Solicitar evaluación",
                destacado: true,
              },
              {
                nombre: "Plan Estratégico",
                sub: "Diseño completo sin seguimiento",
                desc: "Tu protocolo nutricional completo, diseñado en base a tu historial clínico y objetivos. Para quienes prefieren ejecutar de forma autónoma.",
                items: ["Evaluación clínica detallada", "Protocolo nutricional completo", "Menú semanal personalizado", "Lista de la compra automática", "Guía de implementación"],
                cta: "Conocer más",
                destacado: false,
              },
            ].map(({ nombre, sub, desc, items, cta, destacado }) => (
              <div key={nombre} className={`rev card-e`} style={{ background: destacado ? "linear-gradient(145deg,rgba(198,169,107,0.08),rgba(138,114,64,0.04))" : "linear-gradient(145deg,rgba(26,26,26,0.8),rgba(18,18,18,0.9))", border: `1px solid ${destacado ? "rgba(198,169,107,0.25)" : "rgba(198,169,107,0.08)"}`, borderRadius: 24, padding: "40px 36px", display: "flex", flexDirection: "column" }}>
                {destacado && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(198,169,107,0.3)", borderRadius: 50, padding: "3px 12px", marginBottom: 20, alignSelf: "flex-start" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#C6A96B", letterSpacing: "0.08em", textTransform: "uppercase" }}>Recomendado</span>
                  </div>
                )}
                <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 26, fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.8px", marginBottom: 6 }}>{nombre}</h3>
                <p style={{ fontSize: 12, color: "#C6A96B", fontWeight: 500, marginBottom: 16, letterSpacing: "0.02em" }}>{sub}</p>
                <p style={{ fontSize: 14, color: "rgba(237,237,237,0.4)", lineHeight: 1.7, fontWeight: 300, marginBottom: 28 }}>{desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1 }}>
                  {items.map(item => (
                    <li key={item} style={{ fontSize: 13, color: "rgba(237,237,237,0.55)", fontWeight: 300, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#C6A96B", fontSize: 10 }}>◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/registro" className="btn-e" style={{ display: "block", textAlign: "center", padding: "13px 20px", borderRadius: 14, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.03em", background: destacado ? "linear-gradient(145deg,#C6A96B,#8A7240)" : "transparent", color: destacado ? "white" : "#C6A96B", border: destacado ? "none" : "1px solid rgba(198,169,107,0.3)", boxShadow: destacado ? "0 8px 24px rgba(198,169,107,0.3)" : "none" }}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section id="resultados" style={{ padding: "100px 48px", borderTop: "1px solid rgba(198,169,107,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="rev" style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.6)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Resultados</p>
            <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 42, fontWeight: 700, color: "#EDEDED", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Resultados que<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>se sostienen</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {TESTIMONIOS.map(({ inicial, nombre, resultado, texto, cargo }, i) => (
              <div key={nombre} className={`rev card-e d${i + 1}`} style={{ background: "linear-gradient(145deg,rgba(26,26,26,0.8),rgba(18,18,18,0.9))", border: "1px solid rgba(198,169,107,0.08)", borderRadius: 22, padding: "32px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(145deg,rgba(198,169,107,0.3),rgba(138,114,64,0.2))", border: "1px solid rgba(198,169,107,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-playfair, serif)", color: "#C6A96B", fontSize: 18, fontWeight: 700, fontStyle: "italic" }}>{inicial}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.2px" }}>{nombre}</p>
                    <p style={{ fontSize: 11, color: "#C6A96B", fontWeight: 500, marginTop: 2 }}>{resultado}</p>
                    <p style={{ fontSize: 10, color: "rgba(237,237,237,0.25)", fontWeight: 300, marginTop: 2 }}>{cargo}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 15, color: "rgba(237,237,237,0.55)", lineHeight: 1.75, fontStyle: "italic", fontWeight: 400 }}>"{texto}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "100px 48px 120px", borderTop: "1px solid rgba(198,169,107,0.08)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }} className="rev">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(198,169,107,0.2)", borderRadius: 50, padding: "5px 16px", marginBottom: 32 }}>
            <div className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#C6A96B" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(198,169,107,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Plazas limitadas</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 52, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 20 }}>
            ¿Lista para empezar<br /><em style={{ fontStyle: "italic", color: "#C6A96B" }}>tu transformación?</em>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(237,237,237,0.35)", lineHeight: 1.8, fontWeight: 300, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
            Tu protocolo personalizado comienza con una evaluación. Sin compromisos, sin dietas genéricas.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center" }}>
            <Link href="/registro" className="btn-e" style={{ background: "linear-gradient(145deg,#C6A96B,#8A7240)", border: "none", borderRadius: 14, padding: "16px 36px", fontSize: 15, fontWeight: 600, color: "white", textDecoration: "none", letterSpacing: "0.03em", boxShadow: "0 10px 32px rgba(198,169,107,0.35)", display: "inline-block" }}>
              Solicitar mi evaluación →
            </Link>
            <Link href="/login" style={{ fontSize: 13, color: "rgba(198,169,107,0.5)", textDecoration: "none", fontWeight: 300 }}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(198,169,107,0.08)", padding: "28px 48px", background: "#0B0B0B" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-playfair, serif)", color: "white", fontSize: 12, fontWeight: 700, fontStyle: "italic" }}>N</span>
            </div>
            <span style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 15, fontWeight: 600, color: "#EDEDED" }}>NutriAI</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacidad", "Términos", "Cookies"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "rgba(237,237,237,0.25)", textDecoration: "none", fontWeight: 300 }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(237,237,237,0.2)", fontWeight: 300 }}>© {new Date().getFullYear()} NutriAI · Nutrición de élite</p>
        </div>
      </footer>

    </div>
  );
}

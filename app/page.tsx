"use client";
import Link from "next/link";
import { useTheme, LIGHT, DARK } from "@/lib/theme";

const features = [
  { title: "Menú semanal personalizado", desc: "7 días de platos adaptados a tu objetivo, intolerancias y tipo de dieta. Con ingredientes en gramos en crudo.", emoji: "🥗" },
  { title: "Nuria, tu nutricionista IA 24h", desc: "Resuelve dudas, gestiona síntomas y te apoya emocionalmente. Aprende de ti cada semana.", emoji: "💬" },
  { title: "NutriScore semanal", desc: "Un número del 0-100 que resume tu semana: adherencia, energía y digestión.", emoji: "📊" },
  { title: "Ajuste automático", desc: "Nuria analiza tus check-ins y reajusta el menú cada semana. Tu plan mejora solo.", emoji: "🔄" },
  { title: "Lista de la compra", desc: "Del menú semanal se genera una lista agrupada por sección del supermercado.", emoji: "🛒" },
  { title: "Modo restaurante", desc: "Dile a Nuria dónde vas a cenar y te da las 3 mejores opciones adaptadas a tu plan.", emoji: "🍽️" },
];

const testimonios = [
  { inicial: "L", nombre: "Laura M.", resultado: "−6 kg en 4 meses", texto: "Tengo SOP y ninguna dieta me funcionaba. Nuria adapta el menú a mi ciclo automáticamente.", color: "#5E8842" },
  { inicial: "J", nombre: "Javier R.", resultado: "Digestión mejorada", texto: "Llevo 3 meses con el plan antiinflamatorio. Mi digestión ha mejorado un 80%.", color: "#4A7A9A" },
  { inicial: "A", nombre: "Ana C.", resultado: "Sin hinchazón", texto: "Tenía SIBO y no sabía qué comer. Nuria identificó mis alimentos trigger.", color: "#7A6040" },
];

const faqs = [
  { q: "¿Cuánto tarda en generarse mi primer menú?", a: "Menos de 2 minutos. Rellenas tu perfil clínico y Nuria genera tu menú al instante." },
  { q: "¿Funciona para veganos, celíacos o con intolerancias?", a: "Sí. El formulario recoge más de 18 intolerancias y todos los tipos de alimentación." },
  { q: "¿Cada cuánto se actualiza el menú?", a: "Cada semana automáticamente. Nuria analiza tus check-ins y reajusta según cómo te has sentido." },
  { q: "¿Es seguro para personas con patologías?", a: "NutriAI es una herramienta de apoyo nutricional. El formulario recoge más de 34 condiciones de salud." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí, sin permanencia ni penalizaciones. Cancelas cuando quieras desde tu perfil." },
];

const G = {
  card: {
    background: "rgba(255,255,255,0.58)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    borderTop: "1px solid rgba(255,255,255,0.98)",
    borderLeft: "1px solid rgba(255,255,255,0.9)",
    borderRight: "1px solid rgba(255,255,255,0.7)",
    borderBottom: "1px solid rgba(255,255,255,0.55)",
    boxShadow: "0 8px 28px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)",
  },
  matcha: {
    background: "linear-gradient(155deg,#5E8842,#3C6020 50%,#2C4A14)",
    borderTop: "1px solid rgba(180,240,140,0.2)",
    borderLeft: "1px solid rgba(180,240,140,0.12)",
    borderRight: "1px solid rgba(0,0,0,0.15)",
    borderBottom: "1px solid rgba(0,0,0,0.18)",
    boxShadow: "0 14px 36px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.14)",
  },
  dark: {
    background: "linear-gradient(155deg,rgba(38,58,24,0.94),rgba(24,40,12,0.97))",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    borderLeft: "1px solid rgba(255,255,255,0.07)",
    borderRight: "1px solid rgba(0,0,0,0.2)",
    borderBottom: "1px solid rgba(0,0,0,0.25)",
    boxShadow: "0 20px 48px rgba(20,40,8,0.5),inset 0 1px 0 rgba(255,255,255,0.12)",
  },
};

const shine = { position: "absolute" as const, top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 20%,white 50%,rgba(255,255,255,0.95) 80%,transparent)", pointerEvents: "none" as const };

export default function Home() {
  const { theme, toggle } = useTheme();
  const T = theme === "dark" ? DARK : LIGHT;

  return (
    <div style={{ fontFamily: "var(--font-instrument,sans-serif)", background: T.bg, minHeight: "100vh" }}>

      {/* Orbs */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.22),transparent 65%)", top: -200, right: -150, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(60,100,40,0.15),transparent 65%)", bottom: -100, left: -80, pointerEvents: "none", zIndex: 0 }} />

      {/* NAV */}
      <nav style={{ ...T.card, position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={shine} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, ...T.matcha, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.18)" }}>
            <span style={{ fontFamily: "var(--font-playfair,serif)", color: "white", fontSize: 15, fontWeight: 600, fontStyle: "italic" }}>N</span>
          </div>
          <span style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 18, fontWeight: 600, color: T.text.primary, letterSpacing: "-0.4px" }}>NutriAI</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {[["Funcionalidades", "#features"], ["Precios", "#precios"], ["FAQ", "#faq"]].map(([l, h]) => (
            <a className="link-hover" key={l} href={h} style={{ fontSize: 13, color: T.text.secondary, fontWeight: 400, textDecoration: "none", letterSpacing: "0.01em" }}>{l}</a>
          ))}
          <Link className="link-hover" href="/login" style={{ fontSize: 13, color: T.text.secondary, fontWeight: 400, textDecoration: "none" }}>Entrar</Link>
          <button onClick={toggle}
            style={{...T.btnW, padding:"7px 12px", fontSize:13, borderRadius:12, marginRight:4}}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Link className="btn-hover" href="/registro" style={{ ...T.matcha, padding: "8px 20px", borderRadius: 14, fontSize: 13, fontWeight: 500, color: "white", textDecoration: "none", letterSpacing: "0.02em" }}>
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 40, paddingRight: 40, maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

          {/* Left - texto */}
          <div className="reveal">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 50, padding: "5px 14px", marginBottom: 24, boxShadow: "0 4px 14px rgba(30,60,15,0.08)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5E8842", boxShadow: "0 0 6px rgba(94,136,66,0.6)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#3C6020", letterSpacing: "0.06em" }}>Nutrición clínica con IA</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 52, fontWeight: 700, color: T.text.primary, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 20 }}>
              Tu nutricionista<br />
              <em style={{ fontStyle: "italic", color: "#3C6020" }}>personal</em> siempre<br />
              contigo
            </h1>
            <p style={{ fontSize: 16, color: T.text.secondary, lineHeight: 1.75, fontWeight: 300, marginBottom: 32, maxWidth: 440 }}>
              Nuria aprende de ti cada semana y adapta tu menú según cómo te sientes. Más de 34 patologías, 18 intolerancias y todos los tipos de alimentación.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 32 }}>
              <Link className="btn-hover" href="/registro" style={{ ...T.matcha, padding: "12px 28px", borderRadius: 16, fontSize: 14, fontWeight: 500, color: "white", textDecoration: "none", letterSpacing: "0.02em", boxShadow: "0 8px 22px rgba(58,92,30,0.42)" }}>
                Crear mi plan gratis →
              </Link>
              <a href="#features" style={{ fontSize: 13, color: "#3C6020", fontWeight: 500, textDecoration: "none", letterSpacing: "0.01em" }}>
                Ver cómo funciona ↓
              </a>
            </div>
            <p style={{ fontSize: 11, color: T.text.muted, fontWeight: 300, letterSpacing: "0.02em" }}>
              Sin tarjeta · Cancela cuando quieras · Primer menú en 2 minutos
            </p>
            {/* Stats */}
            <div style={{ display: "flex", gap: 24, marginTop: 32, paddingTop: 28, borderTop: "0.5px solid rgba(94,136,66,0.15)" }}>
              {[["2 min", "Primer menú"], ["+34", "Patologías"], ["24h", "Nuria disponible"], ["7", "Días planificados"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 22, fontWeight: 700, color: T.text.primary, letterSpacing: "-1px", lineHeight: 1 }}>{n}</p>
                  <p style={{ fontSize: 10, color: T.text.muted, marginTop: 4, fontWeight: 400, letterSpacing: "0.04em" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - dashboard preview */}
          <div className="reveal reveal-delay-2" style={{ position: "relative" }}>
            <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.3),transparent 65%)", top: -80, right: -80, pointerEvents: "none" }} />
            {/* Panel flotante simulado */}
            <div style={{ ...T.card, borderRadius: 28, overflow: "hidden", position: "relative", transform: "perspective(1200px) rotateY(-4deg) rotateX(2deg)", boxShadow: "0 40px 80px rgba(30,60,15,0.2),0 20px 40px rgba(30,60,15,0.12),0 1px 0 rgba(255,255,255,1) inset" }}>
              <div style={shine} />
              {/* App nav */}
              <div style={{ padding: "12px 18px", borderBottom: "0.5px solid rgba(80,120,50,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, ...T.matcha, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-playfair,serif)", color: "white", fontSize: 11, fontWeight: 600, fontStyle: "italic" }}>N</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 14, fontWeight: 600, color: T.text.primary }}>NutriAI</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["#E24B4A", "#EF9F27", "#5E8842"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
                </div>
              </div>
              {/* App content preview */}
              <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "100px 1fr", gap: 12 }}>
                {/* sidebar mini */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(145deg,#7AAA52,#3C6020)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-playfair,serif)", color: "white", fontSize: 14, fontWeight: 600, fontStyle: "italic" }}>Y</span>
                  </div>
                  {["Dashboard", "Menú", "Bienestar", "Progreso", "Nuria"].map((item, i) => (
                    <div key={item} style={{ padding: "5px 8px", borderRadius: 8, background: i === 0 ? "rgba(94,136,66,0.12)" : "transparent", fontSize: 10, color: i === 0 ? "#3C6020" : "rgba(26,46,10,0.4)", fontWeight: i === 0 ? 600 : 400 }}>{item}</div>
                  ))}
                </div>
                {/* main content mini */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 16, fontWeight: 600, color: T.text.primary, letterSpacing: "-0.5px" }}>Tu plan de hoy</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[["~800", "kcal"], ["~56g", "prot"], ["2", "comidas"], ["4/7", "días"]].map(([v, l]) => (
                      <div key={l} style={{ ...T.card, borderRadius: 10, padding: "8px 10px", position: "relative", overflow: "hidden" }}>
                        <div style={{ ...shine }} />
                        <p style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 14, fontWeight: 600, color: T.text.primary, letterSpacing: "-0.5px" }}>{v}</p>
                        <p style={{ fontSize: 9, color: T.text.muted, marginTop: 2 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                  {[["☀️", "Comida", "Ensalada de atún"], ["🌙", "Cena", "Tortilla de espinacas"]].map(([e, t, n]) => (
                    <div key={t} style={{ ...T.card, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, position: "relative", overflow: "hidden" }}>
                      <div style={shine} />
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(94,136,66,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{e}</div>
                      <div>
                        <p style={{ fontSize: 8, color: T.text.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{t}</p>
                        <p style={{ fontSize: 11, fontWeight: 600, color: T.text.primary }}>{n}</p>
                      </div>
                    </div>
                  ))}
                  {/* Nuria card mini */}
                  <div style={{ ...T.matcha, borderRadius: 12, padding: "10px 12px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg,rgba(255,255,255,0.1),transparent)", pointerEvents: "none", borderRadius: "inherit" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, position: "relative", zIndex: 1 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(145deg,#B8D870,#5E8842)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--font-playfair,serif)", color: "white", fontSize: 9, fontWeight: 600, fontStyle: "italic" }}>N</span>
                      </div>
                      <p style={{ fontSize: 8, fontWeight: 600, color: "rgba(200,248,160,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Nuria</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 10, color: "rgba(215,248,185,0.55)", lineHeight: 1.55, fontStyle: "italic", position: "relative", zIndex: 1 }}>"Tu digestión mejora esta semana."</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Shadow under card */}
            <div style={{ position: "absolute", width: "80%", height: 30, background: "rgba(30,60,15,0.18)", borderRadius: "50%", bottom: -18, left: "10%", filter: "blur(18px)", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: T.text.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>Cómo funciona</p>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 38, fontWeight: 700, color: T.text.primary, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Tres pasos. Un plan<br /><em style={{ fontStyle: "italic", color: "#3C6020" }}>que funciona.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            ["01", "Cuéntale a Nuria cómo eres", "Formulario clínico avanzado: patologías, intolerancias, síntomas digestivos y tipo de alimentación.", "📋"],
            ["02", "Recibe tu menú personalizado", "GPT-4o genera tu menú de 7 días con recetas, ingredientes en gramos en crudo y macros calculados.", "🌿"],
            ["03", "Nuria se adapta cada semana", "Check-in diario, NutriScore semanal y reajuste automático. Tu plan mejora solo.", "✨"],
          ].map(([num, title, desc, emoji], i) => (
            <div className={`reveal card-hover stagger-${i + 1}`} key={num} style={{ ...T.card, borderRadius: 24, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
              <div style={shine} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#5E8842,transparent)", opacity: 0.5 }} />
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text.label, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Paso {num}</p>
              <p style={{ fontSize: 32, marginBottom: 14 }}>{emoji}</p>
              <h3 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 20, fontWeight: 600, color: T.text.primary, letterSpacing: "-0.5px", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 13, color: T.text.secondary, lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: T.text.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>Funcionalidades</p>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 38, fontWeight: 700, color: T.text.primary, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Todo lo que necesitas<br /><em style={{ fontStyle: "italic", color: "#3C6020" }}>para comer bien de verdad</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {features.map(({ title, desc, emoji }, i) => (
            <div className={`reveal card-hover stagger-${i + 1}`} key={title} style={{ ...T.card, borderRadius: 22, padding: "22px 20px", position: "relative", overflow: "hidden" }}>
              <div style={shine} />
              <p style={{ fontSize: 28, marginBottom: 14 }}>{emoji}</p>
              <h3 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 17, fontWeight: 600, color: T.text.primary, letterSpacing: "-0.4px", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 12, color: T.text.secondary, lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: T.text.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>Testimonios</p>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 38, fontWeight: 700, color: T.text.primary, letterSpacing: "-1.5px" }}>
            Personas reales,<br /><em style={{ fontStyle: "italic", color: "#3C6020" }}>resultados reales</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {testimonios.map(({ inicial, nombre, resultado, texto, color }, i) => (
            <div className={`reveal card-hover stagger-${i + 1}`} key={nombre} style={{ ...T.card, borderRadius: 22, padding: "22px 20px", position: "relative", overflow: "hidden" }}>
              <div style={shine} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(145deg,${color}99,${color})`, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.9)", flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--font-playfair,serif)", color: "white", fontSize: 18, fontWeight: 600, fontStyle: "italic" }}>{inicial}</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text.primary }}>{nombre}</p>
                  <p style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{resultado}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#5E8842", fontSize: 12 }}>★</span>)}
              </div>
              <p style={{ fontSize: 13, color: T.text.secondary, lineHeight: 1.7, fontWeight: 300 }}>{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: T.text.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>Precios</p>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 38, fontWeight: 700, color: T.text.primary, letterSpacing: "-1.5px" }}>
            Elige tu plan.<br /><em style={{ fontStyle: "italic", color: "#3C6020" }}>Sin permanencia.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          {[
            { nombre: "Básico", precio: "9,99€", badge: "", items: ["✓ Menú semanal", "✓ Chat con Nuria", "✓ Lista de la compra", "— Ajuste semanal", "— NutriScore"], cta: "Empezar", destacado: false, longevity: false },
            { nombre: "Pro", precio: "19,99€", badge: "Más popular", items: ["✓ Todo Básico", "✓ Ajuste semanal", "✓ NutriScore", "✓ Protocolo digestivo", "✓ Modo restaurante"], cta: "Empezar con Pro", destacado: true, longevity: false },
            { nombre: "Élite", precio: "39,99€", badge: "", items: ["✓ Todo Pro", "✓ Protocolo hormonal", "✓ Gemelo metabólico", "✓ Seguimiento avanzado", "✓ Prioridad soporte"], cta: "Empezar", destacado: false, longevity: false },
            { nombre: "Longevity", precio: "59,99€", badge: "NUEVO", items: ["✓ Todo Élite", "✓ Plan antiedad", "✓ Protocolo antioxidante", "✓ Análisis longevidad", "✓ Suplementación antiedad"], cta: "Quiero vivir más", destacado: false, longevity: true },
          ].map(({ nombre, precio, badge, items, cta, destacado, longevity }, i) => (
            <div className={`reveal card-hover stagger-${i + 1}`} key={nombre} style={{ ...T.card, borderRadius: 24, padding: "24px 20px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", ...(destacado ? { borderRight: "1px solid rgba(94,136,66,0.3)", borderBottom: "1px solid rgba(94,136,66,0.3)" } : {}), ...(longevity ? { borderRight: "1px solid rgba(186,120,20,0.3)", borderBottom: "1px solid rgba(186,120,20,0.3)" } : {}) }}>
              <div style={shine} />
              {badge && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: destacado ? "linear-gradient(155deg,#5E8842,#3C6020)" : "linear-gradient(155deg,#C8A020,#A07818)", borderRadius: "0 0 12px 12px", padding: "4px 14px" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>{badge}</span>
                </div>
              )}
              <p style={{ fontSize: 15, fontWeight: 600, color: T.text.primary, marginTop: badge ? 12 : 0, marginBottom: 4 }}>{nombre}</p>
              <p style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 28, fontWeight: 700, color: T.text.primary, letterSpacing: "-1px", marginBottom: 4 }}>{precio}</p>
              <p style={{ fontSize: 10, color: T.text.muted, fontWeight: 300, marginBottom: 16 }}>al mes</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, marginBottom: 20 }}>
                {items.map(item => (
                  <li key={item} style={{ fontSize: 12, color: item.startsWith("—") ? T.text.label : T.text.secondary, fontWeight: item.startsWith("—") ? 300 : 400, marginBottom: 7, lineHeight: 1.4 }}>{item}</li>
                ))}
              </ul>
              <Link href="/registro" style={{ display: "block", textAlign: "center", padding: "10px 16px", borderRadius: 14, fontSize: 12, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em", ...(destacado ? { ...T.matcha, color: "white" } : longevity ? { background: "linear-gradient(155deg,#C8A020,#A07818)", color: "white", border: "none", boxShadow: "0 8px 22px rgba(160,120,24,0.35)" } : { background: "rgba(255,255,255,0.7)", color: "#2A3E16", border: "1px solid rgba(94,136,66,0.2)", boxShadow: "0 4px 14px rgba(30,60,15,0.08)" }) }}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "80px 40px", maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: T.text.muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 38, fontWeight: 700, color: T.text.primary, letterSpacing: "-1.5px" }}>
            Preguntas<br /><em style={{ fontStyle: "italic", color: "#3C6020" }}>frecuentes</em>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map(({ q, a }) => (
            <div className="reveal card-hover" key={q} style={{ ...T.card, borderRadius: 20, padding: "18px 22px", position: "relative", overflow: "hidden" }}>
              <div style={shine} />
              <p style={{ fontSize: 14, fontWeight: 600, color: T.text.primary, letterSpacing: "-0.3px", marginBottom: 8 }}>{q}</p>
              <p style={{ fontSize: 13, color: T.text.secondary, lineHeight: 1.7, fontWeight: 300 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1, paddingBottom: 120 }}>
        <div style={{ ...T.dark, borderRadius: 32, padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg,rgba(255,255,255,0.07),transparent)", pointerEvents: "none", borderRadius: "inherit" }} />
          <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,240,160,0.12),transparent 70%)", pointerEvents: "none" }} />
          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(180,240,140,0.38)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16, position: "relative", zIndex: 1 }}>Empieza hoy</p>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 42, fontWeight: 700, color: "rgba(240,255,230,0.9)", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 16, position: "relative", zIndex: 1 }}>
            ¿Lista para empezar?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(210,248,180,0.45)", fontWeight: 300, lineHeight: 1.7, marginBottom: 32, position: "relative", zIndex: 1 }}>
            Tu primer menú personalizado en menos de 2 minutos. Sin tarjeta de crédito.
          </p>
          <Link href="/registro" style={{ ...T.card, display: "inline-block", padding: "14px 32px", borderRadius: 16, fontSize: 14, fontWeight: 600, color: T.text.primary, textDecoration: "none", position: "relative", zIndex: 1, letterSpacing: "0.02em" }}>
            Crear mi cuenta gratis →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(180,240,140,0.25)", marginTop: 16, fontWeight: 300, position: "relative", zIndex: 1 }}>
            Más de 500 personas ya tienen su plan personalizado
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ ...T.card, borderRadius: 0, borderLeft: "none", borderRight: "none", borderBottom: "none", padding: "24px 40px", position: "relative", zIndex: 1 }}>
        <div style={shine} />
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, ...T.matcha, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-playfair,serif)", color: "white", fontSize: 11, fontWeight: 600, fontStyle: "italic" }}>N</span>
            </div>
            <span style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 15, fontWeight: 600, color: T.text.primary }}>NutriAI</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacidad", "Términos", "Cookies"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: T.text.muted, textDecoration: "none", fontWeight: 300 }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: T.text.label, fontWeight: 300 }}>© {new Date().getFullYear()} NutriAI</p>
        </div>
      </footer>

    </div>
  );
}

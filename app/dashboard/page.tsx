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

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
function getDiaIdx() {
  return new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
}
function getSaludo() {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserState | null>(null);
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkinDone, setCheckinDone] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [diaIdx, setDiaIdx] = useState(getDiaIdx());
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/login");
        return;
      }
      const [{ data: profileData }, { data: menuRows }, { data: checkin }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id", data.user.id).single(),
        supabase.from("weekly_menus").select("menu_data").eq("user_id", data.user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("daily_checkins").select("id").eq("user_id", data.user.id).eq("date", new Date().toISOString().split("T")[0]).single(),
      ]);
      setUser({ id: data.user.id, email: data.user.email ?? "", nombre: profileData?.form_data?.full_name });
      if (menuRows?.[0]?.menu_data?.dias?.length) setMenu(menuRows[0].menu_data as MenuData);
      if (checkin) setCheckinDone(true);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleGeneratePlan() {
    if (!user?.id) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generar-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Error al generar el menú.");
        setGenerating(false);
        return;
      }
      setMenu(data.menu as MenuData);
    } catch {
      setError("Error al generar tu plan.");
    }
    setGenerating(false);
  }

  if (loading)
    return (
      <main style={{ minHeight: "100vh", background: "#0B0B0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-instrument,sans-serif)", fontSize: 13, color: "rgba(237,237,237,0.25)", fontWeight: 300, letterSpacing: "0.06em" }}>Cargando...</p>
      </main>
    );

  const nombre = user?.nombre ?? user?.email?.split("@")[0] ?? "tú";
  const diaMenu = menu?.dias[diaIdx] ?? menu?.dias[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B0B0B",
        fontFamily: "var(--font-instrument,sans-serif)",
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "32px 24px 64px",
      }}
    >
      <style>{`
        .sf { font-family: var(--font-playfair, Georgia, serif); }
        .btn-gold { background: linear-gradient(145deg,#C6A96B,#8A7240); border: none; color: white; font-weight: 600; cursor: pointer; font-family: var(--font-instrument,sans-serif); transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s ease; }
        .btn-gold:hover { transform: translateY(-1px) scale(1.02); filter: brightness(1.08); }
        .btn-ghost { background: transparent; border: 1px solid rgba(237,237,237,0.1); color: rgba(237,237,237,0.45); cursor: pointer; font-family: var(--font-instrument,sans-serif); transition: border-color 0.2s ease, color 0.2s ease; }
        .btn-ghost:hover { border-color: rgba(237,237,237,0.2); color: rgba(237,237,237,0.7); }
        .nav-link { font-size:13px; color:rgba(237,237,237,0.28); text-decoration:none; transition:color 0.2s ease; font-weight:400; }
        .nav-link:hover { color:rgba(237,237,237,0.7); }
        .nav-link.active { color:#EDEDED; font-weight:500; }
        .sidebar-item { display:flex; align-items:center; gap:9px; padding:9px 10px; border-radius:10px; cursor:pointer; border:1px solid transparent; text-decoration:none; transition:background 0.2s ease, border-color 0.2s ease; }
        .sidebar-item:hover { background:rgba(237,237,237,0.04); border-color:rgba(237,237,237,0.06); }
        .sidebar-item.active { background:rgba(237,237,237,0.07); border-color:rgba(237,237,237,0.1); }
        .wcard { background:#FFFFFF; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.5),0 1px 4px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.9); position:relative; overflow:hidden; }
        .dcard { background:rgba(237,237,237,0.04); border:1px solid rgba(237,237,237,0.07); border-radius:16px; position:relative; overflow:hidden; }
        .dcard::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(237,237,237,0.1) 50%,transparent); }
        .dia-btn { flex:1; text-align:center; padding:8px 4px; border-radius:10px; cursor:pointer; font-family:var(--font-instrument,sans-serif); border:none; transition:all 0.2s ease; display:flex; flex-direction:column; align-items:center; gap:4px; }
        .dia-btn.on { background:#FFFFFF; box-shadow:0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.9); }
        .dia-btn.off { background:rgba(237,237,237,0.04); border:1px solid rgba(237,237,237,0.07) !important; }
        .plato-row { background:rgba(237,237,237,0.04); border:1px solid rgba(237,237,237,0.07); border-radius:14px; overflow:hidden; transition:border-color 0.2s ease; }
        .plato-row:hover { border-color:rgba(237,237,237,0.14); }
        .acceso-item { display:flex; align-items:center; gap:9px; padding:9px 10px; border-radius:12px; background:rgba(237,237,237,0.03); border:1px solid rgba(237,237,237,0.06); margin-bottom:6px; cursor:pointer; text-decoration:none; transition:background 0.2s ease, border-color 0.2s ease; }
        .acceso-item:hover { background:rgba(237,237,237,0.06); border-color:rgba(237,237,237,0.1); }
        @keyframes fp { 0%,100%{transform:perspective(1800px) rotateX(1deg) translateY(0)} 50%{transform:perspective(1800px) rotateX(1deg) translateY(-4px)} }
        .panel-3d { animation:fp 8s ease-in-out infinite; }
      `}</style>

      {/* Ambient */}
      <div style={{ position: "fixed", top: -100, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(237,237,237,0.02),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -80, left: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(198,169,107,0.025),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Panel sombra */}
      <div style={{ position: "fixed", width: "60%", maxWidth: 800, height: 40, background: "rgba(237,237,237,0.02)", borderRadius: "50%", bottom: 20, left: "50%", transform: "translateX(-50%)", filter: "blur(28px)", pointerEvents: "none", zIndex: 0 }} />

      {/* PANEL PRINCIPAL */}
      <div
        className="panel-3d"
        style={{
          width: "100%",
          maxWidth: 1100,
          background: "linear-gradient(158deg,#131313 0%,#0F0F0F 50%,#131313 100%)",
          borderRadius: 28,
          border: "1px solid rgba(237,237,237,0.08)",
          boxShadow: "0 80px 160px rgba(0,0,0,0.9),0 40px 80px rgba(0,0,0,0.7),0 20px 40px rgba(0,0,0,0.5),inset 0 1px 0 rgba(237,237,237,0.06)",
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Specular top */}
        <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: "linear-gradient(90deg,transparent,rgba(237,237,237,0.06) 20%,rgba(237,237,237,0.12) 50%,rgba(237,237,237,0.06) 80%,transparent)", pointerEvents: "none", zIndex: 10 }} />

        {/* NAV */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px 13px", borderBottom: "1px solid rgba(237,237,237,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(198,169,107,0.35),inset 0 1px 0 rgba(255,255,255,0.2)" }}>
              <span className="sf" style={{ color: "white", fontSize: 14, fontWeight: 700, fontStyle: "italic" }}>
                N
              </span>
            </div>
            <span className="sf" style={{ fontSize: 17, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.3px" }}>
              NutriAI
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {(
              [
                ["Protocolo", "#menu"],
                ["Progreso", "/progreso"],
                ["Bienestar", "/bienestar"],
                ["Lista", "/lista-compra"],
              ] as [string, string][]
            ).map(([l, h], i) => (
              <Link key={l} href={h} className={`nav-link${i === 0 ? " active" : ""}`}>
                {l}
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="btn-ghost"
              style={{ padding: "7px 16px", fontSize: 12, borderRadius: 9, letterSpacing: "0.01em" }}
            >
              Salir
            </button>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(237,237,237,0.1)", boxShadow: "0 3px 10px rgba(198,169,107,0.25)" }}>
              <span className="sf" style={{ color: "white", fontSize: 12, fontWeight: 700, fontStyle: "italic" }}>
                {nombre[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ display: "grid", gridTemplateColumns: "152px 1fr 196px" }}>
          {/* SIDEBAR */}
          <div style={{ padding: "20px 12px", borderRight: "1px solid rgba(237,237,237,0.06)", display: "flex", flexDirection: "column", gap: 2, minHeight: 620, background: "rgba(0,0,0,0.2)" }}>
            {/* Avatar */}
            <div style={{ textAlign: "center", paddingBottom: 18, borderBottom: "1px solid rgba(237,237,237,0.06)", marginBottom: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(237,237,237,0.1)", boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }}>
                <span className="sf" style={{ color: "white", fontSize: 21, fontWeight: 700, fontStyle: "italic" }}>
                  {nombre[0]?.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 9, color: "rgba(237,237,237,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3, fontWeight: 500 }}>{getSaludo()}</p>
              <p className="sf" style={{ fontSize: 15, fontWeight: 600, color: "#EDEDED", fontStyle: "italic", letterSpacing: "-0.3px" }}>
                {nombre}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 7, border: "1px solid rgba(237,237,237,0.1)", borderRadius: 20, padding: "3px 10px", background: "rgba(237,237,237,0.04)" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C6A96B", boxShadow: "0 0 6px rgba(198,169,107,0.9)" }} />
                <span style={{ fontSize: 8, fontWeight: 600, color: "rgba(237,237,237,0.45)", letterSpacing: "0.06em" }}>Protocolo activo</span>
              </div>
            </div>

            {(
              [
                ["◉", "Dashboard", "/dashboard", true],
                ["◈", "Protocolo", "#menu", false],
                ["◎", "Perfil clínico", "/onboarding", false],
                ["↗", "Progreso", "/progreso", false],
                ["✦", "Bienestar", "/bienestar", false],
                ["💬", "Nuria", "/chat", false],
              ] as [string, string, string, boolean][]
            ).map(([ic, lb, hr, a]) => (
              <Link key={lb} href={hr} className={`sidebar-item${a ? " active" : ""}`}>
                <span style={{ fontSize: 12, color: a ? "#EDEDED" : "rgba(237,237,237,0.22)", flexShrink: 0 }}>{ic}</span>
                <span style={{ fontSize: 12, fontWeight: a ? 500 : 300, color: a ? "#EDEDED" : "rgba(237,237,237,0.38)", whiteSpace: "nowrap" }}>{lb}</span>
              </Link>
            ))}

            <div style={{ marginTop: "auto", paddingTop: 14 }}>
              <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(237,237,237,0.06)", borderRadius: 13, padding: "13px 14px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(237,237,237,0.08) 50%,transparent)" }} />
                <p style={{ fontSize: 8, fontWeight: 600, color: "rgba(237,237,237,0.2)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>Hoy</p>
                <p className="sf" style={{ fontSize: 13, fontWeight: 600, color: "rgba(237,237,237,0.6)", fontStyle: "italic" }}>{new Date().toLocaleDateString("es-ES", { weekday: "long" })}</p>
                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.2)", fontWeight: 300, marginTop: 3 }}>{new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long" })}</p>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14, borderRight: "1px solid rgba(237,237,237,0.06)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(237,237,237,0.22)", marginBottom: 6 }}>{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</p>
                <h1 className="sf" style={{ fontSize: 30, color: "#EDEDED", letterSpacing: "-1px", lineHeight: 1, fontWeight: 600 }}>
                  Tu protocolo de hoy
                </h1>
              </div>
              <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 13px", border: "1px solid rgba(237,237,237,0.08)", borderRadius: 50, background: "rgba(237,237,237,0.03)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: checkinDone ? "#C6A96B" : "rgba(237,237,237,0.18)", boxShadow: checkinDone ? "0 0 6px rgba(198,169,107,0.8)" : "none" }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: checkinDone ? "rgba(237,237,237,0.7)" : "rgba(237,237,237,0.28)" }}>{checkinDone ? "Check-in ✓" : "Sin check-in"}</span>
                </div>
                <Link href="/lista-compra" style={{ display: "flex", alignItems: "center", padding: "5px 13px", border: "1px solid rgba(237,237,237,0.08)", borderRadius: 50, background: "rgba(237,237,237,0.03)", textDecoration: "none" }}>
                  <span style={{ fontSize: 11, color: "rgba(237,237,237,0.28)" }}>Lista compra</span>
                </Link>
              </div>
            </div>

            {/* MACROS - CARDS BLANCAS */}
            {diaMenu && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9 }}>
                {[
                  { label: "Calorías", value: "~800", sub: "kcal hoy" },
                  { label: "Proteína", value: "~56g", sub: "objetivo" },
                  { label: "Comidas", value: "2", sub: "planificadas" },
                  { label: "Semana", value: `${diaIdx + 1}/7`, sub: "días" },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="wcard" style={{ padding: "12px 14px" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,#C6A96B,transparent)", borderRadius: "16px 16px 0 0" }} />
                    <p style={{ fontSize: 8, fontWeight: 700, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 7 }}>{label}</p>
                    <p className="sf" style={{ fontSize: 22, fontWeight: 700, color: "#0B0B0B", letterSpacing: "-0.8px", lineHeight: 1 }}>
                      {value}
                    </p>
                    <p style={{ fontSize: 9, color: "rgba(0,0,0,0.35)", marginTop: 4, fontWeight: 400 }}>{sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Check-in */}
            {!checkinDone && (
              <div className="dcard" style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.2px" }}>Check-in de hoy</p>
                    <p style={{ fontSize: 11, color: "rgba(237,237,237,0.3)", marginTop: 3, fontWeight: 300 }}>Cuéntale a Nuria cómo estás</p>
                  </div>
                  <button onClick={() => setShowCheckin(!showCheckin)} className="btn-gold" style={{ padding: "8px 18px", fontSize: 12, borderRadius: 10, letterSpacing: "0.01em" }}>
                    {showCheckin ? "Cerrar" : "Registrar"}
                  </button>
                </div>
                {showCheckin && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(237,237,237,0.06)" }}>
                    <DailyCheckin
                      onComplete={() => {
                        setCheckinDone(true);
                        setShowCheckin(false);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* MENÚ */}
            <div id="menu" className="dcard" style={{ padding: "18px 20px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.2px" }}>Protocolo semanal</p>
                  {menu && <p style={{ fontSize: 10, color: "rgba(237,237,237,0.25)", marginTop: 2, fontWeight: 300 }}>Generado por Nuria</p>}
                </div>
                {menu && (
                  <button onClick={handleGeneratePlan} disabled={generating} className="btn-ghost" style={{ padding: "6px 14px", fontSize: 11, borderRadius: 9 }}>
                    {generating ? "Generando..." : "Regenerar"}
                  </button>
                )}
              </div>

              {!menu ? (
                <div style={{ textAlign: "center", padding: "40px 20px", border: "1px dashed rgba(237,237,237,0.08)", borderRadius: 14 }}>
                  <p style={{ fontSize: 11, color: "rgba(237,237,237,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 600 }}>Sin protocolo</p>
                  <p className="sf" style={{ fontSize: 16, color: "rgba(237,237,237,0.5)", fontStyle: "italic", marginBottom: 8 }}>
                    Aún no tienes protocolo
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(237,237,237,0.2)", fontWeight: 300, marginBottom: 24 }}>Nuria generará tu plan en segundos</p>
                  <button onClick={handleGeneratePlan} disabled={generating} className="btn-gold" style={{ padding: "12px 28px", fontSize: 13, borderRadius: 12, letterSpacing: "0.01em" }}>
                    {generating ? "Preparando..." : "Generar mi protocolo"}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
                    {DIAS.map((d, i) => (
                      <button key={d} type="button" onClick={() => setDiaIdx(i)} className={`dia-btn ${diaIdx === i ? "on" : "off"}`}>
                        <span style={{ fontSize: 11, fontWeight: diaIdx === i ? 700 : 400, color: diaIdx === i ? "#0B0B0B" : "rgba(237,237,237,0.3)" }}>{d}</span>
                        {i < 5 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: diaIdx === i ? "#C6A96B" : "rgba(237,237,237,0.2)" }} />}
                      </button>
                    ))}
                  </div>

                  {diaMenu && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { tipo: "Comida", plato: diaMenu.comida, emoji: "☀️" },
                        { tipo: "Cena", plato: diaMenu.cena, emoji: "🌙" },
                      ].map(({ tipo, plato, emoji }) => (
                        <div key={tipo} className="plato-row">
                          <button
                            type="button"
                            onClick={() => setExpandido(expandido === `${diaIdx}-${tipo}` ? null : `${diaIdx}-${tipo}`)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "13px 16px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily: "var(--font-instrument,sans-serif)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div className="wcard" style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                                {emoji}
                              </div>
                              <div>
                                <p style={{ fontSize: 9, fontWeight: 600, color: "rgba(237,237,237,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tipo}</p>
                                <p style={{ fontSize: 14, fontWeight: 500, color: "#EDEDED", letterSpacing: "-0.3px" }}>{plato.nombre}</p>
                                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.22)", marginTop: 3, fontWeight: 300 }}>{plato.ingredientes.length} ingredientes</p>
                              </div>
                            </div>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(237,237,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ color: "rgba(237,237,237,0.3)", fontSize: 14, fontWeight: 300, lineHeight: 1 }}>{expandido === `${diaIdx}-${tipo}` ? "−" : "+"}</span>
                            </div>
                          </button>
                          {expandido === `${diaIdx}-${tipo}` && (
                            <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(237,237,237,0.06)" }}>
                              <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                                {plato.ingredientes.map((ing) => (
                                  <div key={ing.nombre} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, color: "rgba(237,237,237,0.5)", fontWeight: 300 }}>{ing.nombre}</span>
                                    <span style={{ fontSize: 11, color: "rgba(237,237,237,0.3)", background: "rgba(237,237,237,0.05)", padding: "2px 9px", borderRadius: 7, fontWeight: 500 }}>{ing.cantidad_g}g</span>
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
              {error && <p style={{ marginTop: 12, fontSize: 12, color: "rgba(220,80,80,0.7)", fontWeight: 300 }}>{error}</p>}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column", gap: 11 }}>
            <div className="wcard" style={{ padding: "17px 16px" }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: "0.13em", marginBottom: 14 }}>NutriScore semanal</p>
              <NutriScoreCard />
            </div>

            <div className="dcard" style={{ padding: "15px 13px" }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: "rgba(237,237,237,0.22)", textTransform: "uppercase", letterSpacing: "0.13em", marginBottom: 11 }}>Accesos rápidos</p>
              {(
                [
                  ["✦", "Bienestar", "/bienestar"],
                  ["↗", "Progreso", "/progreso"],
                  ["◎", "Lista compra", "/lista-compra"],
                  ["◈", "Chat Nuria", "/chat"],
                  ["◉", "Perfil", "/onboarding"],
                ] as [string, string, string][]
              ).map(([ic, lb, hr]) => (
                <Link key={lb} href={hr} className="acceso-item">
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(237,237,237,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(237,237,237,0.5)", flexShrink: 0 }}>{ic}</span>
                  <span style={{ fontSize: 12, color: "rgba(237,237,237,0.5)", flex: 1 }}>{lb}</span>
                  <span style={{ color: "rgba(237,237,237,0.18)", fontSize: 13 }}>›</span>
                </Link>
              ))}
            </div>

            <div style={{ background: "rgba(237,237,237,0.03)", border: "1px solid rgba(198,169,107,0.18)", borderRadius: 16, padding: "14px 13px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(198,169,107,0.35) 50%,transparent)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(198,169,107,0.3)" }}>
                  <span className="sf" style={{ color: "white", fontSize: 10, fontWeight: 700, fontStyle: "italic" }}>
                    N
                  </span>
                </div>
                <p style={{ fontSize: 9, fontWeight: 600, color: "rgba(198,169,107,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Nuria</p>
              </div>
              <p className="sf" style={{ fontSize: 12, color: "rgba(237,237,237,0.38)", lineHeight: 1.75, fontStyle: "italic" }}>
                &quot;Completa tu check-in para que pueda ajustar tu protocolo cada semana.&quot;
              </p>
              <Link href="/chat" style={{ marginTop: 11, paddingTop: 10, borderTop: "1px solid rgba(237,237,237,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none" }}>
                <span style={{ fontSize: 11, color: "rgba(198,169,107,0.55)", fontWeight: 500 }}>Hablar con Nuria</span>
                <span style={{ color: "rgba(198,169,107,0.45)", fontSize: 13 }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", width: "75%", maxWidth: 900, height: 36, background: "rgba(237,237,237,0.02)", borderRadius: "50%", bottom: 16, left: "50%", transform: "translateX(-50%)", filter: "blur(24px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: "55%", maxWidth: 700, height: 18, background: "rgba(0,0,0,0.6)", borderRadius: "50%", bottom: 10, left: "50%", transform: "translateX(-50%)", filter: "blur(14px)", pointerEvents: "none", zIndex: 0 }} />
    </main>
  );
}

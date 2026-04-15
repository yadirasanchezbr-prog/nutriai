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

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
function getDiaHoy() { return DIAS_SEMANA[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; }
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
  const [diaSeleccionado, setDiaSeleccionado] = useState(getDiaHoy());
  const [expandido, setExpandido] = useState<string | null>(null);
  const [nutriscore, setNutriscore] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) { router.replace("/login"); return; }

      const [{ data: profileData }, { data: menuRows }, { data: checkin }, { data: scoreData }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id", data.user.id).single(),
        supabase.from("weekly_menus").select("menu_data").eq("user_id", data.user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("daily_checkins").select("id").eq("user_id", data.user.id).eq("date", new Date().toISOString().split("T")[0]).single(),
        supabase.from("weekly_scores").select("score").eq("user_id", data.user.id).order("week_start", { ascending: false }).limit(1).single(),
      ]);

      setUser({ id: data.user.id, email: data.user.email ?? "", nombre: profileData?.form_data?.full_name });
      if (menuRows?.[0]?.menu_data?.dias?.length) setMenu(menuRows[0].menu_data as MenuData);
      if (checkin) setCheckinDone(true);
      if (scoreData?.score) setNutriscore(Math.round(scoreData.score));
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
      if (!res.ok) { setError(data?.error ?? "Error al generar el menú."); setGenerating(false); return; }
      setMenu(data.menu as MenuData);
    } catch { setError("Error al generar tu plan."); }
    setGenerating(false);
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: "#F5F0E8" }}>
      <p className="text-sm" style={{ color: "#888780" }}>Cargando...</p>
    </main>
  );

  const diaMenu = menu?.dias.find(d => d.dia === diaSeleccionado) ?? menu?.dias[0];
  const scoreColor = nutriscore ? (nutriscore >= 70 ? "#1D9E75" : nutriscore >= 45 ? "#EF9F27" : "#E24B4A") : "#D3D1C7";

  return (
    <main style={{ minHeight: "100vh", background: "#F5F0E8", padding: "0" }}>

      {/* Top nav */}
      <nav style={{ background: "rgba(245,240,232,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#0F6E56", letterSpacing: "-0.5px" }}>NutriAI</span>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ label: "Bienestar", href: "/bienestar" }, { label: "Progreso", href: "/progreso" }, { label: "Lista compra", href: "/lista-compra" }].map(item => (
            <Link key={item.label} href={item.href} style={{ fontSize: 13, color: "#5F5E5A", padding: "6px 14px", borderRadius: 20, background: "white", border: "1px solid rgba(0,0,0,0.08)", textDecoration: "none", fontWeight: 500 }}>
              {item.label}
            </Link>
          ))}
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
            style={{ fontSize: 13, color: "#5F5E5A", padding: "6px 14px", borderRadius: 20, background: "transparent", border: "1px solid rgba(0,0,0,0.08)", cursor: "pointer" }}>
            Salir
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* COLUMNA PRINCIPAL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Hero saludo */}
          <div style={{ background: "linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)", borderRadius: 24, padding: "32px 36px", color: "white" }}>
            <p style={{ fontSize: 14, opacity: 0.75, marginBottom: 4 }}>{getSaludo()}</p>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-1px", margin: 0 }}>
              {user?.nombre ?? user?.email?.split("@")[0]}
            </h1>
            <p style={{ fontSize: 14, opacity: 0.65, marginTop: 6 }}>
              {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </p>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24 }}>
              {[
                { label: "NutriScore", value: nutriscore ? `${nutriscore}` : "—", sub: nutriscore ? "/100" : "sin datos", color: "white" },
                { label: "Check-in hoy", value: checkinDone ? "✓" : "—", sub: checkinDone ? "Completado" : "Pendiente", color: "white" },
                { label: "Semana", value: menu ? `${menu.dias.length}` : "—", sub: "días planificados", color: "white" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "16px 20px" }}>
                  <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1 }}>{stat.value}<span style={{ fontSize: 14, opacity: 0.7, fontWeight: 400 }}>{stat.sub}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in */}
          <div style={{ background: "white", borderRadius: 24, padding: "24px 28px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: "#2C2C2A", margin: 0 }}>Check-in de hoy</h2>
                <p style={{ fontSize: 13, color: "#888780", marginTop: 4 }}>
                  {checkinDone ? "Ya registraste tu check-in" : "Cuéntale a Nuria cómo estás hoy"}
                </p>
              </div>
              {checkinDone ? (
                <span style={{ background: "#E1F5EE", color: "#0F6E56", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>✓ Completado</span>
              ) : (
                <button onClick={() => setShowCheckin(!showCheckin)}
                  style={{ background: "#0F6E56", color: "white", border: "none", borderRadius: 20, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {showCheckin ? "Cerrar" : "Registrar"}
                </button>
              )}
            </div>
            {showCheckin && !checkinDone && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #F1EFE8" }}>
                <DailyCheckin onComplete={() => { setCheckinDone(true); setShowCheckin(false); }} />
              </div>
            )}
          </div>

          {/* Menú semanal */}
          <div style={{ background: "white", borderRadius: 24, padding: "24px 28px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: "#2C2C2A", margin: 0 }}>Tu menú semanal</h2>
              {menu && (
                <button onClick={handleGeneratePlan} disabled={generating}
                  style={{ background: "transparent", border: "1px solid #0F6E56", color: "#0F6E56", borderRadius: 20, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {generating ? "Generando..." : "Regenerar"}
                </button>
              )}
            </div>

            {!menu ? (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "#F5F0E8", borderRadius: 16 }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🥗</p>
                <p style={{ fontSize: 15, color: "#5F5E5A", marginBottom: 20 }}>Aún no tienes un menú generado</p>
                <button onClick={handleGeneratePlan} disabled={generating}
                  style={{ background: "#0F6E56", color: "white", border: "none", borderRadius: 20, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  {generating ? "Nuria está preparando tu plan..." : "Generar mi plan personalizado"}
                </button>
              </div>
            ) : (
              <>
                {/* Selector días */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
                  {menu.dias.map(d => (
                    <button key={d.dia} onClick={() => setDiaSeleccionado(d.dia)}
                      style={{
                        flexShrink: 0, padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none",
                        background: diaSeleccionado === d.dia ? "#0F6E56" : "#F1EFE8",
                        color: diaSeleccionado === d.dia ? "white" : "#5F5E5A",
                        transition: "all 0.15s",
                      }}>
                      {d.dia.slice(0, 3)}
                    </button>
                  ))}
                </div>

                {/* Platos */}
                {diaMenu && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[{ tipo: "Comida", plato: diaMenu.comida, emoji: "☀️" }, { tipo: "Cena", plato: diaMenu.cena, emoji: "🌙" }].map(({ tipo, plato, emoji }) => (
                      <div key={tipo} style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #F1EFE8" }}>
                        <button onClick={() => setExpandido(expandido === `${diaSeleccionado}-${tipo}` ? null : `${diaSeleccionado}-${tipo}`)}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#FAFAF8", border: "none", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>{emoji}</span>
                            <div>
                              <p style={{ fontSize: 11, color: "#888780", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{tipo}</p>
                              <p style={{ fontSize: 16, fontWeight: 600, color: "#2C2C2A", margin: "2px 0 0" }}>{plato.nombre}</p>
                            </div>
                          </div>
                          <span style={{ fontSize: 20, color: "#D3D1C7", fontWeight: 300 }}>{expandido === `${diaSeleccionado}-${tipo}` ? "−" : "+"}</span>
                        </button>
                        {expandido === `${diaSeleccionado}-${tipo}` && (
                          <div style={{ padding: "0 20px 16px", borderTop: "1px solid #F1EFE8" }}>
                            <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                              {plato.ingredientes.map(ing => (
                                <div key={ing.nombre} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#5F5E5A" }}>
                                  <span>{ing.nombre}</span>
                                  <span style={{ color: "#B4B2A9", fontWeight: 500 }}>{ing.cantidad_g}g</span>
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
            {error && <p style={{ marginTop: 12, fontSize: 13, color: "#E24B4A" }}>{error}</p>}
          </div>

        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* NutriScore card */}
          <div style={{ background: "white", borderRadius: 24, padding: "24px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>NutriScore semanal</h3>
            <NutriScoreCard />
          </div>

          {/* Accesos rápidos */}
          <div style={{ background: "white", borderRadius: 24, padding: "24px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Accesos rápidos</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "Mi Bienestar", desc: "Cuerpo · Día · Mente · Ciclo", href: "/bienestar", emoji: "✦" },
                { label: "Mi Progreso", desc: "Gráficas y evolución", href: "/progreso", emoji: "↗" },
                { label: "Lista de la compra", desc: "Del menú de esta semana", href: "/lista-compra", emoji: "◎" },
                { label: "Chat con Nuria", desc: "Tu nutricionista IA", href: "/chat", emoji: "◈" },
                { label: "Actualizar perfil", desc: "Formulario clínico", href: "/onboarding", emoji: "◉" },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 14, textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F5F0E8")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 10, background: "#F1EFE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#0F6E56", fontWeight: 700 }}>
                      {item.emoji}
                    </span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2A", margin: 0 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: "#B4B2A9", margin: "2px 0 0" }}>{item.desc}</p>
                    </div>
                  </div>
                  <span style={{ color: "#D3D1C7", fontSize: 16 }}>›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tip del día */}
          <div style={{ background: "linear-gradient(135deg, #E1F5EE, #F5F0E8)", borderRadius: 24, padding: "24px", border: "1px solid rgba(29,158,117,0.15)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#1D9E75", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Tip de Nuria</p>
            <p style={{ fontSize: 14, color: "#2C2C2A", lineHeight: 1.6, margin: 0 }}>
              Completa tu check-in diario para que Nuria pueda ajustar tu plan semana a semana y mejorar tus resultados.
            </p>
            <Link href="/chat" style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600, color: "#0F6E56", textDecoration: "none" }}>
              Hablar con Nuria →
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

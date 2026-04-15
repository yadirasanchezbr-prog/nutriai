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

function getDiaHoy(): string {
  return DIAS_SEMANA[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

function getSaludo(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
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

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) { router.replace("/login"); return; }

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
      if (!res.ok) { setError(data?.error ?? "No se pudo generar el menu."); setGenerating(false); return; }
      setMenu(data.menu as MenuData);
    } catch { setError("Error al generar tu plan."); }
    setGenerating(false);
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );

  const diaMenu = menu?.dias.find(d => d.dia === diaSeleccionado) ?? menu?.dias[0];

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-8">
      <section className="mx-auto w-full max-w-5xl space-y-5">

        {/* Header */}
        <div className="rounded-2xl bg-[#0F6E56] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-sm">{getSaludo()}</p>
              <h1 className="text-2xl font-semibold mt-1">{user?.nombre ?? user?.email?.split("@")[0]}</h1>
              <p className="text-emerald-200 text-sm mt-1">{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/bienestar" className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-medium transition">
                Mi Bienestar
              </Link>
              <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
                className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-medium transition">
                Salir
              </button>
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: "Mi menú", href: "#menu", icon: "📋" },
              { label: "Progreso", href: "/progreso", icon: "📊" },
              { label: "Lista compra", href: "/lista-compra", icon: "🛒" },
              { label: "Chat Nuria", href: "/chat", icon: "💬" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 p-3 text-center transition">
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span className="text-xs font-medium text-white">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Columna izquierda */}
          <div className="space-y-5 lg:col-span-2">

            {/* Check-in */}
            <div className="rounded-2xl bg-white border border-neutral-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-neutral-900">Check-in de hoy</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {checkinDone ? "Ya registraste tu check-in" : "Cuéntale a Nuria cómo estás"}
                  </p>
                </div>
                {checkinDone ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">✓ Completado</span>
                ) : (
                  <button onClick={() => setShowCheckin(!showCheckin)}
                    className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d5f4a] transition">
                    {showCheckin ? "Cerrar" : "Hacer check-in"}
                  </button>
                )}
              </div>
              {showCheckin && !checkinDone && (
                <div className="mt-4">
                  <DailyCheckin onComplete={() => { setCheckinDone(true); setShowCheckin(false); }} />
                </div>
              )}
            </div>

            {/* Menú semanal */}
            <div id="menu" className="rounded-2xl bg-white border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-neutral-900">Tu menú semanal</h2>
                {menu && (
                  <button onClick={handleGeneratePlan} disabled={generating}
                    className="rounded-lg border border-[#0F6E56] px-3 py-1.5 text-xs font-semibold text-[#0F6E56] hover:bg-emerald-50 disabled:opacity-50 transition">
                    {generating ? "Generando..." : "Regenerar"}
                  </button>
                )}
              </div>

              {!menu ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 text-center">
                  <p className="text-2xl mb-3">🥗</p>
                  <p className="text-sm text-neutral-700 mb-4">Aún no tienes un menú generado.</p>
                  <button onClick={handleGeneratePlan} disabled={generating}
                    className="rounded-lg bg-[#0F6E56] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d5f4a] disabled:opacity-60 transition">
                    {generating ? "Nuria está preparando tu plan..." : "Generar mi plan con Nuria"}
                  </button>
                </div>
              ) : (
                <>
                  {/* Selector de días */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
                    {menu.dias.map(d => (
                      <button key={d.dia} onClick={() => setDiaSeleccionado(d.dia)}
                        className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          diaSeleccionado === d.dia
                            ? "bg-[#0F6E56] text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}>
                        {d.dia.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  {/* Platos del día */}
                  {diaMenu && (
                    <div className="space-y-3">
                      {[
                        { tipo: "Comida", plato: diaMenu.comida },
                        { tipo: "Cena", plato: diaMenu.cena },
                      ].map(({ tipo, plato }) => (
                        <div key={tipo} className="rounded-xl border border-neutral-100 bg-neutral-50 overflow-hidden">
                          <button
                            onClick={() => setExpandido(expandido === `${diaSeleccionado}-${tipo}` ? null : `${diaSeleccionado}-${tipo}`)}
                            className="w-full flex items-center justify-between p-4 text-left">
                            <div>
                              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{tipo}</span>
                              <p className="font-medium text-neutral-900 mt-0.5">{plato.nombre}</p>
                            </div>
                            <span className="text-neutral-400 text-lg">{expandido === `${diaSeleccionado}-${tipo}` ? "−" : "+"}</span>
                          </button>
                          {expandido === `${diaSeleccionado}-${tipo}` && (
                            <div className="px-4 pb-4 border-t border-neutral-100">
                              <ul className="mt-3 space-y-1">
                                {plato.ingredientes.map(ing => (
                                  <li key={ing.nombre} className="flex justify-between text-sm text-neutral-600">
                                    <span>{ing.nombre}</span>
                                    <span className="text-neutral-400">{ing.cantidad_g}g</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>

          </div>

          {/* Columna derecha */}
          <div className="space-y-5">

            {/* NutriScore */}
            <div className="rounded-2xl bg-white border border-neutral-200 p-5">
              <h2 className="font-semibold text-neutral-900 mb-3">NutriScore semanal</h2>
              <NutriScoreCard />
            </div>

            {/* Links rápidos */}
            <div className="rounded-2xl bg-white border border-neutral-200 p-5">
              <h2 className="font-semibold text-neutral-900 mb-3">Accesos</h2>
              <div className="space-y-2">
                {[
                  { label: "Mi Bienestar", href: "/bienestar", desc: "Cuerpo, día, mente, ciclo" },
                  { label: "Mi Progreso", href: "/progreso", desc: "Gráficas y evolución" },
                  { label: "Lista de la compra", href: "/lista-compra", desc: "Del menú de esta semana" },
                  { label: "Formulario clínico", href: "/onboarding", desc: "Actualizar mi perfil" },
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center justify-between rounded-xl p-3 hover:bg-neutral-50 transition group">
                    <div>
                      <p className="text-sm font-medium text-neutral-800 group-hover:text-[#0F6E56]">{item.label}</p>
                      <p className="text-xs text-neutral-400">{item.desc}</p>
                    </div>
                    <span className="text-neutral-300 group-hover:text-[#0F6E56]">→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const EMOCIONES = ["Feliz", "Tranquila", "Motivada", "Cansada", "Ansiosa", "Triste", "Irritable", "Nostálgica"];
const RETOS_NURIA = [
  "Bebe 2 litros de agua hoy sin falta",
  "Come 5 colores diferentes de verduras esta semana",
  "Haz 10 minutos de movimiento suave después de comer",
  "Prepara tu desayuno la noche anterior durante 3 días",
  "Escribe 3 cosas por las que estás agradecida hoy",
  "Come sin pantallas una comida al día esta semana",
  "Prueba una receta nueva del menú que no hayas hecho antes",
  "Duerme 30 minutos más de lo habitual esta semana",
];

const LOGROS_DISPONIBLES = [
  { tipo: "racha_7", titulo: "Primera semana", descripcion: "7 días consecutivos de check-in", emoji: "🌱" },
  { tipo: "racha_30", titulo: "Un mes fuerte", descripcion: "30 días consecutivos de check-in", emoji: "🏆" },
  { tipo: "agua_7", titulo: "Hidratada", descripcion: "Objetivo de agua cumplido 7 días", emoji: "💧" },
  { tipo: "nutriscore_80", titulo: "NutriScore élite", descripcion: "NutriScore mayor de 80", emoji: "⭐" },
  { tipo: "primer_menu", titulo: "Primer menú", descripcion: "Generaste tu primer menú personalizado", emoji: "🥗" },
  { tipo: "modo_crisis", titulo: "Resiliente", descripcion: "Superaste un momento de crisis", emoji: "💪" },
  { tipo: "carta_futuro", titulo: "Carta enviada", descripcion: "Escribiste una carta a tu yo futuro", emoji: "✉️" },
  { tipo: "reto_completado", titulo: "Reto cumplido", descripcion: "Completaste un reto semanal de Nuria", emoji: "🎯" },
];

export default function BienestarMentePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hoy, setHoy] = useState<any>(null);
  const [logros, setLogros] = useState<any[]>([]);
  const [modoCrisisActivo, setModoCrisisActivo] = useState(false);
  const [form, setForm] = useState({
    gratitud: "",
    emocion_hoy: "",
    emocion_vs_comida: "",
    mi_porque: "",
    carta_yo_futuro: "",
    carta_fecha_envio: "",
    reto_semana: "",
    reto_completado: false,
  });

  useEffect(() => {
    async function load() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }

      const today = new Date().toISOString().split("T")[0];
      const retoSemana = RETOS_NURIA[new Date().getDay() % RETOS_NURIA.length];

      const [{ data: hoyData }, { data: logrosData }] = await Promise.all([
        supabase.from("bienestar_mente").select("*").eq("user_id", user.id).eq("fecha", today).maybeSingle(),
        supabase.from("logros").select("*").eq("user_id", user.id),
      ]);

      if (hoyData) {
        setHoy(hoyData);
        setForm({
          gratitud: hoyData.gratitud ?? "",
          emocion_hoy: hoyData.emocion_hoy ?? "",
          emocion_vs_comida: hoyData.emocion_vs_comida ?? "",
          mi_porque: hoyData.mi_porque ?? "",
          carta_yo_futuro: hoyData.carta_yo_futuro ?? "",
          carta_fecha_envio: hoyData.carta_fecha_envio ?? "",
          reto_semana: hoyData.reto_semana ?? retoSemana,
          reto_completado: hoyData.reto_completado ?? false,
        });
      } else {
        setForm(prev => ({ ...prev, reto_semana: retoSemana }));
      }
      setLogros(logrosData ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("bienestar_mente").upsert({
      user_id: user.id,
      fecha: new Date().toISOString().split("T")[0],
      ...form,
    }, { onConflict: "user_id,fecha" });

    if (form.reto_completado && !logros.find(l => l.tipo === "reto_completado")) {
      await supabase.from("logros").insert({
        user_id: user.id,
        tipo: "reto_completado",
        titulo: "Reto cumplido",
        descripcion: "Completaste un reto semanal de Nuria",
      });
    }

    if (form.carta_yo_futuro && !logros.find(l => l.tipo === "carta_futuro")) {
      await supabase.from("logros").insert({
        user_id: user.id,
        tipo: "carta_futuro",
        titulo: "Carta enviada",
        descripcion: "Escribiste una carta a tu yo futuro",
      });
    }

    setSaving(false);
  }

  async function activarModoCrisis() {
    setModoCrisisActivo(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("bienestar_mente").upsert({
      user_id: user.id,
      fecha: new Date().toISOString().split("T")[0],
      modo_crisis: true,
    }, { onConflict: "user_id,fecha" });
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensaje: "Estoy en modo crisis, necesito apoyo ahora mismo para no abandonar mi plan",
        user_id: user.id,
      }),
    });
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );

  const logrosDesbloqueados = logros.map(l => l.tipo);

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto w-full max-w-4xl space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">← Dashboard</Link>
          <div className="flex gap-2 flex-wrap">
            {[["Cuerpo", "/bienestar"], ["Día", "/bienestar/dia"], ["Mente", "/bienestar/mente"], ["Ciclo", "/bienestar/ciclo"], ["Salud", "/bienestar/salud"]].map(([tab, href], i) => (
              <Link key={tab} href={href} className={`rounded-full px-3 py-1 text-xs font-medium ${i === 2 ? "bg-[#0F6E56] text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}>
                {tab}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[#0F6E56]">Mi Mente</h1>
          <p className="mt-1 text-neutral-500">Bienestar emocional, gratitud y motivación</p>
        </div>

        {/* Modo crisis */}
        {!modoCrisisActivo ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-red-700">Modo crisis</h2>
                <p className="mt-1 text-sm text-red-600">¿Sientes que vas a abandonar tu plan? Nuria activa un protocolo especial de apoyo.</p>
              </div>
              <button onClick={activarModoCrisis}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition flex-shrink-0 ml-4">
                Necesito ayuda
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#0F6E56] bg-emerald-50 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56]">Nuria está contigo</h2>
            <p className="mt-1 text-sm text-[#0F6E56]">Nuria ha recibido tu señal. Ve al chat para recibir su apoyo personalizado.</p>
            <Link href="/chat" className="mt-3 inline-block rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white">
              Hablar con Nuria →
            </Link>
          </div>
        )}

        {/* Reto semanal */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-amber-700">Reto semanal de Nuria</h2>
              <p className="mt-2 text-sm text-amber-800 font-medium">{form.reto_semana}</p>
            </div>
            <button
              onClick={() => setForm(prev => ({ ...prev, reto_completado: !prev.reto_completado }))}
              className={`ml-4 flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${form.reto_completado ? "bg-[#0F6E56] text-white" : "bg-white border border-amber-300 text-amber-700 hover:bg-amber-100"}`}>
              {form.reto_completado ? "✓ Completado" : "Marcar como hecho"}
            </button>
          </div>
        </div>

        {/* Gratitud */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Diario de gratitud</h2>
          <p className="text-xs text-neutral-400 mb-3">¿Qué cosa positiva relacionada con tu alimentación o salud destacas hoy?</p>
          <textarea
            placeholder="Hoy me alegro de haber..."
            value={form.gratitud}
            onChange={e => setForm(prev => ({ ...prev, gratitud: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2 resize-none"
          />
        </div>

        {/* Emoción de hoy */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">¿Cómo te sientes emocionalmente hoy?</h2>
          <div className="flex gap-2 flex-wrap">
            {EMOCIONES.map(e => (
              <button key={e}
                onClick={() => setForm(prev => ({ ...prev, emocion_hoy: e }))}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${form.emocion_hoy === e ? "border-[#0F6E56] bg-emerald-50 text-[#0F6E56] font-medium" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}>
                {e}
              </button>
            ))}
          </div>
          {form.emocion_hoy && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">¿Afectó tu emoción a lo que comiste?</label>
              <textarea
                placeholder="Ej: Estaba ansiosa y comí más de lo que debía..."
                value={form.emocion_vs_comida}
                onChange={e => setForm(prev => ({ ...prev, emocion_vs_comida: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2 resize-none"
              />
            </div>
          )}
        </div>

        {/* Mi por qué */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Mi por qué</h2>
          <p className="text-xs text-neutral-400 mb-3">Define tu motivación profunda. Nuria la usará cuando detecte que necesitas un empujón.</p>
          <textarea
            placeholder="Quiero mejorar mi alimentación porque..."
            value={form.mi_porque}
            onChange={e => setForm(prev => ({ ...prev, mi_porque: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2 resize-none"
          />
        </div>

        {/* Carta a mi yo futuro */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">Carta a mi yo futuro</h2>
          <p className="text-xs text-purple-500 mb-3">Escríbele algo a la persona que serás en 3 meses. Nuria te la recordará con tu progreso real.</p>
          <textarea
            placeholder="Querida yo del futuro..."
            value={form.carta_yo_futuro}
            onChange={e => setForm(prev => ({ ...prev, carta_yo_futuro: e.target.value }))}
            rows={4}
            className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm outline-none ring-purple-400 focus:ring-2 resize-none"
          />
          {form.carta_yo_futuro && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-purple-600 mb-1">¿Cuándo quieres que Nuria te la recuerde?</label>
              <input type="date"
                value={form.carta_fecha_envio}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm(prev => ({ ...prev, carta_fecha_envio: e.target.value }))}
                className="rounded-lg border border-purple-200 px-3 py-2 text-sm outline-none ring-purple-400 focus:ring-2"
              />
            </div>
          )}
        </div>

        {/* Logros */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Mis logros</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LOGROS_DISPONIBLES.map(logro => {
              const desbloqueado = logrosDesbloqueados.includes(logro.tipo);
              return (
                <div key={logro.tipo}
                  className={`rounded-xl p-3 text-center border transition ${desbloqueado ? "border-amber-300 bg-amber-50" : "border-neutral-100 bg-neutral-50 opacity-50"}`}>
                  <div className="text-2xl mb-1">{logro.emoji}</div>
                  <p className={`text-xs font-medium ${desbloqueado ? "text-amber-700" : "text-neutral-400"}`}>{logro.titulo}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{logro.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full rounded-xl bg-[#0F6E56] py-3 text-sm font-semibold text-white hover:bg-[#0d604b] disabled:opacity-60 transition">
          {saving ? "Guardando..." : "Guardar mi mente"}
        </button>

      </section>
    </main>
  );
}

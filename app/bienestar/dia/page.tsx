"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DiaData = {
  id: string;
  fecha: string;
  pasos: number | null;
  vasos_agua: number | null;
  objetivo_agua: number | null;
  energia_manana: number | null;
  energia_tarde: number | null;
  energia_noche: number | null;
  calidad_sueno: number | null;
  horas_sueno: number | null;
  estado_animo: string | null;
  sintomas_post_comida: string | null;
  alimento_trigger: string | null;
  nota_dia: string | null;
};

const ESTADOS = [
  { v: "muy_bien", label: "Muy bien", color: "#1D9E75" },
  { v: "bien", label: "Bien", color: "#5DCAA5" },
  { v: "regular", label: "Regular", color: "#EF9F27" },
  { v: "mal", label: "Mal", color: "#D85A30" },
  { v: "muy_mal", label: "Muy mal", color: "#E24B4A" },
];

const SINTOMAS = ["Hinchazón", "Gases", "Pesadez", "Acidez", "Náuseas", "Dolor abdominal", "Ninguno"];

export default function BienestarDiaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hoy, setHoy] = useState<DiaData | null>(null);
  const [historial, setHistorial] = useState<DiaData[]>([]);
  const [form, setForm] = useState({
    pasos: "",
    vasos_agua: 0,
    objetivo_agua: 8,
    energia_manana: 5,
    energia_tarde: 5,
    energia_noche: 5,
    calidad_sueno: 5,
    horas_sueno: "",
    estado_animo: "bien",
    sintomas_post_comida: [] as string[],
    alimento_trigger: "",
    nota_dia: "",
  });

  useEffect(() => {
    async function load() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }

      const today = new Date().toISOString().split("T")[0];
      const [{ data: hoyData }, { data: histData }] = await Promise.all([
        supabase.from("bienestar_dia").select("*").eq("user_id", user.id).eq("fecha", today).single(),
        supabase.from("bienestar_dia").select("*").eq("user_id", user.id).order("fecha", { ascending: false }).limit(7),
      ]);

      if (hoyData) {
        setHoy(hoyData as DiaData);
        setForm(prev => ({
          ...prev,
          vasos_agua: hoyData.vasos_agua ?? 0,
          objetivo_agua: hoyData.objetivo_agua ?? 8,
        }));
      }
      setHistorial((histData ?? []) as DiaData[]);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("bienestar_dia")
      .upsert({
        user_id: user.id,
        fecha: new Date().toISOString().split("T")[0],
        pasos: form.pasos ? parseInt(form.pasos) : null,
        vasos_agua: form.vasos_agua,
        objetivo_agua: form.objetivo_agua,
        energia_manana: form.energia_manana,
        energia_tarde: form.energia_tarde,
        energia_noche: form.energia_noche,
        calidad_sueno: form.calidad_sueno,
        horas_sueno: form.horas_sueno ? parseFloat(form.horas_sueno) : null,
        estado_animo: form.estado_animo,
        sintomas_post_comida: form.sintomas_post_comida.join(", ") || null,
        alimento_trigger: form.alimento_trigger || null,
        nota_dia: form.nota_dia || null,
      }, { onConflict: "user_id,fecha" })
      .select().single();

    if (!error && data) setHoy(data as DiaData);
    setSaving(false);
  }

  async function addVaso() {
    const nuevo = Math.min(form.vasos_agua + 1, 20);
    setForm(prev => ({ ...prev, vasos_agua: nuevo }));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("bienestar_dia").upsert({
      user_id: user.id,
      fecha: new Date().toISOString().split("T")[0],
      vasos_agua: nuevo,
      objetivo_agua: form.objetivo_agua,
    }, { onConflict: "user_id,fecha" });
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );

  const pctAgua = Math.min(100, Math.round((form.vasos_agua / form.objetivo_agua) * 100));

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto w-full max-w-4xl space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">← Dashboard</Link>
          <div className="flex gap-2 flex-wrap">
            {[["Cuerpo", "/bienestar"], ["Día", "/bienestar/dia"], ["Mente", "/bienestar/mente"], ["Ciclo", "/bienestar/ciclo"], ["Salud", "/bienestar/salud"]].map(([tab, href], i) => (
              <Link key={tab} href={href} className={`rounded-full px-3 py-1 text-xs font-medium ${i === 1 ? "bg-[#0F6E56] text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}>
                {tab}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[#0F6E56]">Mi Día</h1>
          <p className="mt-1 text-neutral-500">Pasos, hidratación, energía y síntomas de hoy</p>
        </div>

        {/* Hidratación */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0F6E56]">Hidratación</h2>
            <span className="text-sm text-neutral-500">{form.vasos_agua}/{form.objetivo_agua} vasos</span>
          </div>
          <div className="h-4 rounded-full bg-neutral-100 mb-4">
            <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${pctAgua}%` }} />
          </div>
          <div className="flex gap-2 flex-wrap mb-4">
            {Array.from({ length: form.objetivo_agua }).map((_, i) => (
              <button key={i} onClick={addVaso}
                className={`w-10 h-10 rounded-full text-lg transition ${i < form.vasos_agua ? "bg-blue-400 text-white" : "bg-neutral-100 text-neutral-400 hover:bg-blue-100"}`}>
                💧
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-400">Toca cada gota para registrar un vaso de agua</p>
        </div>

        {/* Pasos */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Pasos de hoy</h2>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              placeholder="Ej: 8500"
              value={form.pasos}
              onChange={e => setForm(prev => ({ ...prev, pasos: e.target.value }))}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
            />
            <span className="text-sm text-neutral-500">pasos</span>
          </div>
          {form.pasos && (
            <div className="mt-3 h-3 rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-[#1D9E75] transition-all"
                style={{ width: `${Math.min(100, (parseInt(form.pasos) / 10000) * 100)}%` }} />
            </div>
          )}
          {form.pasos && <p className="mt-1 text-xs text-neutral-400">{Math.round((parseInt(form.pasos) / 10000) * 100)}% del objetivo de 10.000 pasos</p>}
        </div>

        {/* Energía por momentos */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Energía del día</h2>
          <div className="space-y-4">
            {[
              ["energia_manana", "Mañana"],
              ["energia_tarde", "Tarde"],
              ["energia_noche", "Noche"],
            ].map(([field, label]) => (
              <div key={field}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-[#0F6E56] font-medium">{form[field as keyof typeof form]}/10</span>
                </div>
                <input type="range" min={1} max={10} step={1}
                  value={form[field as keyof typeof form] as number}
                  onChange={e => setForm(prev => ({ ...prev, [field]: parseInt(e.target.value) }))}
                  className="w-full accent-[#0F6E56]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sueño */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Sueño de anoche</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Horas dormidas</label>
              <input type="number" step="0.5" min="0" max="12" placeholder="7.5"
                value={form.horas_sueno}
                onChange={e => setForm(prev => ({ ...prev, horas_sueno: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Calidad: {form.calidad_sueno}/10</label>
              <input type="range" min={1} max={10} step={1}
                value={form.calidad_sueno}
                onChange={e => setForm(prev => ({ ...prev, calidad_sueno: parseInt(e.target.value) }))}
                className="w-full accent-[#0F6E56] mt-3"
              />
            </div>
          </div>
        </div>

        {/* Estado de ánimo */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Estado de ánimo</h2>
          <div className="flex gap-3 flex-wrap">
            {ESTADOS.map(e => (
              <button key={e.v} onClick={() => setForm(prev => ({ ...prev, estado_animo: e.v }))}
                style={{ borderColor: form.estado_animo === e.v ? e.color : undefined, color: form.estado_animo === e.v ? e.color : undefined }}
                className={`rounded-full border px-4 py-2 text-sm transition ${form.estado_animo === e.v ? "font-medium" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Síntomas post-comida */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Síntomas después de comer</h2>
          <p className="text-xs text-neutral-400 mb-4">Nuria usa estos datos para detectar tus alimentos trigger</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {SINTOMAS.map(s => (
              <button key={s}
                onClick={() => {
                  const curr = form.sintomas_post_comida;
                  setForm(prev => ({
                    ...prev,
                    sintomas_post_comida: curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s]
                  }));
                }}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${form.sintomas_post_comida.includes(s) ? "border-[#0F6E56] bg-emerald-50 text-[#0F6E56] font-medium" : "border-neutral-200 text-neutral-600"}`}>
                {s}
              </button>
            ))}
          </div>
          {form.sintomas_post_comida.length > 0 && form.sintomas_post_comida[0] !== "Ninguno" && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">¿Qué comiste antes del síntoma?</label>
              <input type="text" placeholder="Ej: lentejas con tomate..."
                value={form.alimento_trigger}
                onChange={e => setForm(prev => ({ ...prev, alimento_trigger: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
              />
            </div>
          )}
        </div>

        {/* Nota del día */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Nota del día</h2>
          <textarea placeholder="¿Algo que quieras recordar o contarle a Nuria?"
            value={form.nota_dia}
            onChange={e => setForm(prev => ({ ...prev, nota_dia: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2 resize-none"
          />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full rounded-xl bg-[#0F6E56] py-3 text-sm font-semibold text-white hover:bg-[#0d604b] disabled:opacity-60 transition">
          {saving ? "Guardando..." : "Guardar mi día"}
        </button>

        {/* Historial */}
        {historial.length > 0 && (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Últimos 7 días</h2>
            <div className="space-y-2">
              {historial.map(d => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">
                    {new Date(d.fecha).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <div className="flex gap-4 text-xs text-neutral-500">
                    {d.pasos && <span>{d.pasos.toLocaleString()} pasos</span>}
                    {d.vasos_agua && <span>{d.vasos_agua} vasos</span>}
                    {d.estado_animo && <span className="capitalize">{d.estado_animo.replace("_", " ")}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Medida = {
  id: string;
  fecha: string;
  peso_kg: number | null;
  cintura_cm: number | null;
  cadera_cm: number | null;
  pecho_cm: number | null;
  imc: number | null;
  edad_biologica: number | null;
  nota: string | null;
};

function calcularIMC(peso: number, altura: number): number {
  return Math.round((peso / ((altura / 100) ** 2)) * 10) / 10;
}

function categoriaIMC(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: "Bajo peso", color: "text-blue-600" };
  if (imc < 25) return { label: "Peso normal", color: "text-[#0F6E56]" };
  if (imc < 30) return { label: "Sobrepeso", color: "text-amber-600" };
  return { label: "Obesidad", color: "text-red-600" };
}

function calcularEdadBiologica(edad: number, datos: any): number {
  let puntos = 0;
  if (datos?.activity_level === "Activo" || datos?.activity_level === "Muy activo") puntos -= 3;
  if (datos?.activity_level === "Sedentario") puntos += 3;
  if (datos?.sleep_hours >= 7 && datos?.sleep_hours <= 9) puntos -= 2;
  if (datos?.sleep_hours < 6) puntos += 3;
  if (datos?.stress_level <= 2) puntos -= 2;
  if (datos?.stress_level >= 4) puntos += 2;
  if (datos?.eating_type === "Vegano" || datos?.eating_type === "Vegetariano") puntos -= 1;
  return Math.max(18, edad + puntos);
}

export default function BienestarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    peso_kg: "",
    cintura_cm: "",
    cadera_cm: "",
    pecho_cm: "",
    nota: "",
  });

  useEffect(() => {
    async function load() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }

      const [{ data: profileData }, { data: medidasData }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id", user.id).single(),
        supabase.from("bienestar_cuerpo").select("*").eq("user_id", user.id).order("fecha", { ascending: false }).limit(12),
      ]);

      setProfile(profileData?.form_data ?? {});
      setMedidas((medidasData ?? []) as Medida[]);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    if (!form.peso_kg) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const peso = parseFloat(form.peso_kg);
    const altura = profile?.height_cm ?? 170;
    const edad = profile?.age ?? 30;
    const imc = calcularIMC(peso, altura);
    const edadBio = calcularEdadBiologica(edad, profile);

    const { data, error } = await supabase
      .from("bienestar_cuerpo")
      .upsert({
        user_id: user.id,
        fecha: new Date().toISOString().split("T")[0],
        peso_kg: peso,
        cintura_cm: form.cintura_cm ? parseFloat(form.cintura_cm) : null,
        cadera_cm: form.cadera_cm ? parseFloat(form.cadera_cm) : null,
        pecho_cm: form.pecho_cm ? parseFloat(form.pecho_cm) : null,
        imc,
        edad_biologica: edadBio,
        nota: form.nota || null,
      }, { onConflict: "user_id,fecha" })
      .select()
      .single();

    if (!error && data) {
      setMedidas(prev => [data as Medida, ...prev.filter(m => m.fecha !== data.fecha)]);
      setShowForm(false);
      setForm({ peso_kg: "", cintura_cm: "", cadera_cm: "", pecho_cm: "", nota: "" });
    }
    setSaving(false);
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );

  const ultima = medidas[0];
  const anterior = medidas[1];
  const diffPeso = ultima?.peso_kg && anterior?.peso_kg
    ? Math.round((ultima.peso_kg - anterior.peso_kg) * 10) / 10
    : null;
  const imcData = ultima?.imc ? categoriaIMC(ultima.imc) : null;

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto w-full max-w-4xl space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">← Dashboard</Link>
          <div className="flex gap-2">
            {["Cuerpo", "Día", "Mente", "Ciclo", "Salud"].map((tab, i) => (
              <span key={tab} className={`rounded-full px-3 py-1 text-xs font-medium ${i === 0 ? "bg-[#0F6E56] text-white" : "bg-neutral-100 text-neutral-500"}`}>
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[#0F6E56]">Mi Cuerpo</h1>
          <p className="mt-1 text-neutral-500">Seguimiento de medidas, IMC y edad biológica</p>
        </div>

        {/* Métricas resumen */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">Peso actual</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {ultima?.peso_kg ? `${ultima.peso_kg} kg` : "—"}
            </p>
            {diffPeso !== null && (
              <p className={`mt-1 text-xs font-medium ${diffPeso <= 0 ? "text-[#0F6E56]" : "text-red-500"}`}>
                {diffPeso <= 0 ? "↓" : "↑"} {Math.abs(diffPeso)} kg
              </p>
            )}
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">IMC</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {ultima?.imc ?? "—"}
            </p>
            {imcData && <p className={`mt-1 text-xs font-medium ${imcData.color}`}>{imcData.label}</p>}
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">Edad biológica</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {ultima?.edad_biologica ? `${ultima.edad_biologica} años` : "—"}
            </p>
            {ultima?.edad_biologica && profile?.age && (
              <p className={`mt-1 text-xs font-medium ${ultima.edad_biologica <= profile.age ? "text-[#0F6E56]" : "text-amber-600"}`}>
                {ultima.edad_biologica <= profile.age ? "Más joven que tu edad" : "Margen de mejora"}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500">Cintura</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {ultima?.cintura_cm ? `${ultima.cintura_cm} cm` : "—"}
            </p>
          </div>
        </div>

        {/* IMC visual */}
        {ultima?.imc && (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Índice de Masa Corporal</h2>
            <div className="relative h-6 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #3B8BD4, #1D9E75, #EF9F27, #E24B4A)" }}>
              <div
                className="absolute top-0 h-full w-1 bg-white shadow"
                style={{ left: `${Math.min(100, Math.max(0, ((ultima.imc - 15) / 25) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-neutral-500">
              <span>Bajo peso</span>
              <span>Normal</span>
              <span>Sobrepeso</span>
              <span>Obesidad</span>
            </div>
            <p className={`mt-3 text-center text-lg font-semibold ${imcData?.color}`}>
              {ultima.imc} — {imcData?.label}
            </p>
          </div>
        )}

        {/* Botón registrar */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0F6E56]">Registrar medidas de hoy</h2>
            <button onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d604b] transition">
              {showForm ? "Cerrar" : "Añadir"}
            </button>
          </div>

          {showForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["peso_kg", "Peso (kg)", "70.5"],
                  ["cintura_cm", "Cintura (cm)", "80"],
                  ["cadera_cm", "Cadera (cm)", "95"],
                  ["pecho_cm", "Pecho (cm)", "90"],
                ].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder={placeholder}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
                    />
                  </div>
                ))}
              </div>
              <textarea
                placeholder="Nota opcional..."
                value={form.nota}
                onChange={e => setForm(prev => ({ ...prev, nota: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2 resize-none"
              />
              <button onClick={handleSave} disabled={saving || !form.peso_kg}
                className="w-full rounded-lg bg-[#0F6E56] py-2.5 text-sm font-semibold text-white hover:bg-[#0d604b] disabled:opacity-60 transition">
                {saving ? "Guardando..." : "Guardar medidas"}
              </button>
            </div>
          )}
        </div>

        {/* Historial */}
        {medidas.length > 0 && (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Historial de medidas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="py-2 pr-4 font-medium">Fecha</th>
                    <th className="py-2 pr-4 font-medium">Peso</th>
                    <th className="py-2 pr-4 font-medium">IMC</th>
                    <th className="py-2 pr-4 font-medium">Cintura</th>
                    <th className="py-2 pr-4 font-medium">Edad bio.</th>
                  </tr>
                </thead>
                <tbody>
                  {medidas.map(m => (
                    <tr key={m.id} className="border-b border-neutral-100">
                      <td className="py-2 pr-4">{new Date(m.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</td>
                      <td className="py-2 pr-4">{m.peso_kg ? `${m.peso_kg} kg` : "—"}</td>
                      <td className="py-2 pr-4">{m.imc ?? "—"}</td>
                      <td className="py-2 pr-4">{m.cintura_cm ? `${m.cintura_cm} cm` : "—"}</td>
                      <td className="py-2 pr-4">{m.edad_biologica ? `${m.edad_biologica} años` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}

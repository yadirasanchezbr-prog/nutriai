"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Recordatorio = { id: string; texto: string; activo: boolean; hora: string };
type AlimentoTolerado = { nombre: string; estado: "bien" | "regular" | "mal" };

const RECORDATORIOS_SUGERIDOS = [
  { texto: "Beber un vaso de agua", hora: "08:00" },
  { texto: "Tomar suplementos", hora: "09:00" },
  { texto: "Check-in con Nuria", hora: "20:00" },
  { texto: "Meditar 5 minutos", hora: "07:30" },
  { texto: "Próxima revisión médica", hora: "10:00" },
  { texto: "Pesar verduras para la cena", hora: "19:00" },
];

const MARCADORES = [
  { key: "colesterol", label: "Colesterol total", unidad: "mg/dL", normal: "< 200" },
  { key: "glucosa", label: "Glucosa en ayunas", unidad: "mg/dL", normal: "70-100" },
  { key: "pcr", label: "PCR ultrasensible", unidad: "mg/L", normal: "< 1" },
  { key: "vitamina_d", label: "Vitamina D", unidad: "ng/mL", normal: "30-60" },
  { key: "b12", label: "Vitamina B12", unidad: "pg/mL", normal: "300-900" },
  { key: "ferritina", label: "Ferritina", unidad: "ng/mL", normal: "15-150" },
  { key: "tsh", label: "TSH (tiroides)", unidad: "mUI/L", normal: "0.4-4.0" },
  { key: "hemoglobina", label: "Hemoglobina", unidad: "g/dL", normal: "12-16" },
];

export default function BienestarSaludPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [marcadores, setMarcadores] = useState<Record<string, string>>({});
  const [alimentosTolerados, setAlimentosTolerados] = useState<AlimentoTolerado[]>([]);
  const [despensa, setDespensa] = useState<string[]>([]);
  const [nuevoAlimento, setNuevoAlimento] = useState("");
  const [nuevoDespensa, setNuevoDespensa] = useState("");
  const [proteinaObjetivo, setProteinaObjetivo] = useState<number>(0);

  useEffect(() => {
    async function load() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }

      const [{ data: profileData }, { data: saludData }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id", user.id).single(),
        supabase.from("bienestar_salud").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      const fd = profileData?.form_data ?? {};
      setProfile(fd);

      // Calcular proteína objetivo
      const peso = fd.weight_kg ?? 70;
      const actividad = fd.activity_level ?? "Moderado";
      const factor = actividad === "Muy activo" ? 2.0 : actividad === "Activo" ? 1.8 : actividad === "Moderado" ? 1.6 : 1.2;
      setProteinaObjetivo(Math.round(peso * factor));

      if (saludData) {
        setRecordatorios(saludData.recordatorios ?? []);
        setMarcadores(saludData.marcadores_sangre ?? {});
        setAlimentosTolerados(saludData.alimentos_tolerados ?? []);
        setDespensa(saludData.despensa ?? []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("bienestar_salud").upsert({
      user_id: user.id,
      recordatorios,
      marcadores_sangre: marcadores,
      alimentos_tolerados: alimentosTolerados,
      despensa,
      proteina_objetivo_g: proteinaObjetivo,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
  }

  function addRecordatorio(sugerido?: { texto: string; hora: string }) {
    const nuevo: Recordatorio = {
      id: crypto.randomUUID(),
      texto: sugerido?.texto ?? "",
      hora: sugerido?.hora ?? "09:00",
      activo: true,
    };
    setRecordatorios(prev => [...prev, nuevo]);
  }

  function updateRecordatorio(id: string, field: string, value: any) {
    setRecordatorios(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  function removeRecordatorio(id: string) {
    setRecordatorios(prev => prev.filter(r => r.id !== id));
  }

  function addAlimentoTolerado() {
    if (!nuevoAlimento.trim()) return;
    setAlimentosTolerados(prev => [...prev, { nombre: nuevoAlimento.trim(), estado: "bien" }]);
    setNuevoAlimento("");
  }

  function updateAlimentoEstado(nombre: string, estado: "bien" | "regular" | "mal") {
    setAlimentosTolerados(prev => prev.map(a => a.nombre === nombre ? { ...a, estado } : a));
  }

  function addDespensa() {
    if (!nuevoDespensa.trim()) return;
    setDespensa(prev => [...prev, nuevoDespensa.trim()]);
    setNuevoDespensa("");
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto w-full max-w-4xl space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">← Dashboard</Link>
          <div className="flex gap-2 flex-wrap">
            {[["Cuerpo", "/bienestar"], ["Día", "/bienestar/dia"], ["Mente", "/bienestar/mente"], ["Ciclo", "/bienestar/ciclo"], ["Salud", "/bienestar/salud"]].map(([tab, href], i) => (
              <Link key={tab} href={href} className={`rounded-full px-3 py-1 text-xs font-medium ${i === 4 ? "bg-[#0F6E56] text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}>
                {tab}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[#0F6E56]">Mi Salud</h1>
          <p className="mt-1 text-neutral-500">Recordatorios, marcadores, despensa y más</p>
        </div>

        {/* Calculadora proteína */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Proteína diaria recomendada</h2>
          <p className="text-xs text-neutral-400 mb-4">Calculada según tu peso ({profile?.weight_kg ?? "—"} kg) y nivel de actividad ({profile?.activity_level ?? "—"})</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-[#0F6E56]" style={{ width: "100%" }} />
            </div>
            <span className="text-2xl font-bold text-[#0F6E56]">{proteinaObjetivo}g</span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">Distribución sugerida: {Math.round(proteinaObjetivo / 3)}g en comida principal, {Math.round(proteinaObjetivo / 4)}g en cena, resto repartido</p>
        </div>

        {/* Recordatorios */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0F6E56]">Mis recordatorios</h2>
            <button onClick={() => addRecordatorio()}
              className="rounded-lg bg-[#0F6E56] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0d604b] transition">
              + Añadir
            </button>
          </div>
          <div className="flex gap-2 flex-wrap mb-4">
            {RECORDATORIOS_SUGERIDOS.map(s => (
              <button key={s.texto} onClick={() => addRecordatorio(s)}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-[#0F6E56] hover:text-[#0F6E56] transition">
                + {s.texto}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {recordatorios.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <input type="checkbox" checked={r.activo}
                  onChange={e => updateRecordatorio(r.id, "activo", e.target.checked)}
                  className="accent-[#0F6E56] w-4 h-4 flex-shrink-0" />
                <input type="text" value={r.texto}
                  onChange={e => updateRecordatorio(r.id, "texto", e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-neutral-700 placeholder:text-neutral-300"
                  placeholder="Nombre del recordatorio..." />
                <input type="time" value={r.hora}
                  onChange={e => updateRecordatorio(r.id, "hora", e.target.value)}
                  className="text-xs text-neutral-500 bg-transparent outline-none border border-neutral-200 rounded px-2 py-1" />
                <button onClick={() => removeRecordatorio(r.id)}
                  className="text-neutral-300 hover:text-red-400 transition text-lg leading-none">×</button>
              </div>
            ))}
            {recordatorios.length === 0 && (
              <p className="text-sm text-neutral-400 text-center py-4">Añade tus primeros recordatorios</p>
            )}
          </div>
        </div>

        {/* Marcadores de sangre */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Mis marcadores de salud</h2>
          <p className="text-xs text-neutral-400 mb-4">Nuria usa estos datos para personalizar tu plan nutricional</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MARCADORES.map(m => (
              <div key={m.key}>
                <label className="block text-xs font-medium text-neutral-600 mb-1">{m.label}</label>
                <input type="number" step="0.1"
                  placeholder={m.normal}
                  value={marcadores[m.key] ?? ""}
                  onChange={e => setMarcadores(prev => ({ ...prev, [m.key]: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
                />
                <p className="text-xs text-neutral-400 mt-0.5">Normal: {m.normal} {m.unidad}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa de alimentos tolerados */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Mapa de alimentos tolerados</h2>
          <p className="text-xs text-neutral-400 mb-4">Registra cómo te sienta cada alimento. Nuria evitará los que te sientan mal.</p>
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Añadir alimento..."
              value={nuevoAlimento}
              onChange={e => setNuevoAlimento(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addAlimentoTolerado()}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
            />
            <button onClick={addAlimentoTolerado}
              className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d604b] transition">
              Añadir
            </button>
          </div>
          <div className="space-y-2">
            {alimentosTolerados.map(a => (
              <div key={a.nombre} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                <span className="flex-1 text-sm text-neutral-700">{a.nombre}</span>
                <div className="flex gap-1">
                  {(["bien", "regular", "mal"] as const).map(estado => (
                    <button key={estado} onClick={() => updateAlimentoEstado(a.nombre, estado)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        a.estado === estado
                          ? estado === "bien" ? "bg-emerald-500 text-white"
                          : estado === "regular" ? "bg-amber-400 text-white"
                          : "bg-red-400 text-white"
                          : "bg-neutral-200 text-neutral-500 hover:bg-neutral-300"
                      }`}>
                      {estado === "bien" ? "Me sienta bien" : estado === "regular" ? "Regular" : "Mal"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {alimentosTolerados.length === 0 && (
              <p className="text-sm text-neutral-400 text-center py-4">Añade alimentos para ver tu mapa</p>
            )}
          </div>
        </div>

        {/* Mi despensa */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-2">Mi despensa</h2>
          <p className="text-xs text-neutral-400 mb-4">Dile a Nuria qué tienes en casa y generará recetas con esos ingredientes</p>
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Añadir ingrediente..."
              value={nuevoDespensa}
              onChange={e => setNuevoDespensa(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addDespensa()}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
            />
            <button onClick={addDespensa}
              className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d604b] transition">
              Añadir
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {despensa.map(item => (
              <span key={item} className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700">
                {item}
                <button onClick={() => setDespensa(prev => prev.filter(d => d !== item))}
                  className="text-neutral-400 hover:text-red-400 transition leading-none">×</button>
              </span>
            ))}
            {despensa.length === 0 && (
              <p className="text-sm text-neutral-400">Añade ingredientes de tu despensa</p>
            )}
          </div>
          {despensa.length > 0 && (
            <button onClick={() => {
              const msg = `Tengo en casa: ${despensa.join(", ")}. ¿Qué receta me sugieres con estos ingredientes que encaje con mi plan?`;
              window.location.href = `/chat?msg=${encodeURIComponent(msg)}`;
            }}
              className="mt-4 rounded-lg border border-[#0F6E56] px-4 py-2 text-sm font-semibold text-[#0F6E56] hover:bg-emerald-50 transition">
              Pedirle una receta a Nuria con mi despensa →
            </button>
          )}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full rounded-xl bg-[#0F6E56] py-3 text-sm font-semibold text-white hover:bg-[#0d604b] disabled:opacity-60 transition">
          {saving ? "Guardando..." : "Guardar mi salud"}
        </button>

      </section>
    </main>
  );
}

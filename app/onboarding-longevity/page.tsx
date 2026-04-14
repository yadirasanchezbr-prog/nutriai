"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type LongevityForm = {
  edad_biologica_estimada: string;
  historial_familiar: string[];
  analisis_sangre: {
    colesterol: string;
    glucosa: string;
    pcr: string;
    vitamina_d: string;
    b12: string;
  };
  exposicion_solar: string;
  tipo_ejercicio: string[];
  frecuencia_ejercicio: string;
  meditacion: string;
  calidad_sueno_profundo: string;
  sauna_banos_frios: string;
  objetivos_antiedad: string[];
  suplementacion_avanzada: string[];
  nota_longevity: string;
};

const initialState: LongevityForm = {
  edad_biologica_estimada: "",
  historial_familiar: [],
  analisis_sangre: {
    colesterol: "",
    glucosa: "",
    pcr: "",
    vitamina_d: "",
    b12: "",
  },
  exposicion_solar: "",
  tipo_ejercicio: [],
  frecuencia_ejercicio: "",
  meditacion: "",
  calidad_sueno_profundo: "",
  sauna_banos_frios: "",
  objetivos_antiedad: [],
  suplementacion_avanzada: [],
  nota_longevity: "",
};

const TOTAL_STEPS = 4;

function SingleSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`rounded-lg border px-3 py-2 text-sm transition ${
            value === o ? "border-[#8B6914] bg-amber-50 text-[#8B6914]" : "border-neutral-300 text-neutral-700 hover:border-amber-400"
          }`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({ options, values, onChange }: { options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  function toggle(o: string) {
    onChange(values.includes(o) ? values.filter(v => v !== o) : [...values, o]);
  }
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} type="button" onClick={() => toggle(o)}
          className={`rounded-lg border px-3 py-2 text-sm transition ${
            values.includes(o) ? "border-[#8B6914] bg-amber-50 text-[#8B6914]" : "border-neutral-300 text-neutral-700 hover:border-amber-400"
          }`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function OnboardingLongevityPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<LongevityForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progressPercentage = Math.round((step / TOTAL_STEPS) * 100);

  function update<K extends keyof LongevityForm>(field: K, value: LongevityForm[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function updateAnalisis(field: keyof LongevityForm["analisis_sangre"], value: string) {
    setForm(prev => ({ ...prev, analisis_sangre: { ...prev.analisis_sangre, [field]: value } }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) { router.replace("/login"); return; }

    const { error: saveError } = await supabase
      .from("clinical_forms")
      .upsert({ user_id: user.id, longevity_data: form }, { onConflict: "user_id" });

    if (saveError) { setError(saveError.message); setLoading(false); return; }
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900">LONGEVITY</div>
          <span className="text-sm text-neutral-500">Formulario especializado antiedad</span>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span>Paso {step} de {TOTAL_STEPS}</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
            <div className="h-2 rounded-full bg-amber-400 transition-all" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-semibold text-amber-700">Datos biologicos</h1>
              <div>
                <p className="text-sm font-medium text-neutral-700">¿Como estimas tu edad biologica vs tu edad real?</p>
                <SingleSelect
                  options={["Me siento mas joven", "Acorde a mi edad", "Me siento mayor", "No lo se"]}
                  value={form.edad_biologica_estimada}
                  onChange={v => update("edad_biologica_estimada", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Historial familiar de enfermedades</p>
                <MultiSelect
                  options={["Ninguno relevante", "Alzheimer / demencia", "Enfermedad cardiovascular", "Cancer", "Diabetes tipo 2", "Osteoporosis", "Artritis", "Hipertension", "Obesidad", "Enfermedad autoinmune"]}
                  values={form.historial_familiar}
                  onChange={v => update("historial_familiar", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-3">Analisis de sangre recientes (opcional)</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    ["colesterol", "Colesterol total (mg/dL)"],
                    ["glucosa", "Glucosa en ayunas (mg/dL)"],
                    ["pcr", "PCR ultrasensible (mg/L)"],
                    ["vitamina_d", "Vitamina D (ng/mL)"],
                    ["b12", "Vitamina B12 (pg/mL)"],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
                      <input
                        type="number"
                        placeholder="Valor"
                        value={form.analisis_sangre[field as keyof LongevityForm["analisis_sangre"]]}
                        onChange={e => updateAnalisis(field as keyof LongevityForm["analisis_sangre"], e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-amber-400 focus:ring-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h1 className="text-2xl font-semibold text-amber-700">Estilo de vida</h1>
              <div>
                <p className="text-sm font-medium text-neutral-700">Exposicion solar diaria</p>
                <SingleSelect
                  options={["Menos de 15 min", "15-30 min", "30-60 min", "Mas de 1 hora", "Casi ninguna"]}
                  value={form.exposicion_solar}
                  onChange={v => update("exposicion_solar", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Tipo de ejercicio que practicas</p>
                <MultiSelect
                  options={["Ninguno", "Fuerza / musculacion", "HIIT", "Cardio suave", "Yoga / pilates", "Natacion", "Caminar", "Ciclismo", "Deportes de equipo", "Artes marciales"]}
                  values={form.tipo_ejercicio}
                  onChange={v => update("tipo_ejercicio", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Frecuencia de ejercicio semanal</p>
                <SingleSelect
                  options={["No hago ejercicio", "1-2 dias", "3-4 dias", "5-6 dias", "Todos los dias"]}
                  value={form.frecuencia_ejercicio}
                  onChange={v => update("frecuencia_ejercicio", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Meditacion o gestion del estres</p>
                <SingleSelect
                  options={["No practico", "Ocasionalmente", "Varias veces por semana", "Diariamente"]}
                  value={form.meditacion}
                  onChange={v => update("meditacion", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Calidad del sueno profundo</p>
                <SingleSelect
                  options={["Muy mala", "Mala", "Regular", "Buena", "Excelente"]}
                  value={form.calidad_sueno_profundo}
                  onChange={v => update("calidad_sueno_profundo", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Sauna o banos frios</p>
                <SingleSelect
                  options={["No uso ninguno", "Solo sauna", "Solo banos frios", "Ambos", "Quiero empezar"]}
                  value={form.sauna_banos_frios}
                  onChange={v => update("sauna_banos_frios", v)}
                />
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h1 className="text-2xl font-semibold text-amber-700">Objetivos antiedad</h1>
              <div>
                <p className="text-sm font-medium text-neutral-700">¿Que quieres mejorar o proteger? (puedes elegir varios)</p>
                <MultiSelect
                  options={[
                    "Salud cognitiva (memoria, concentracion)",
                    "Salud cardiovascular",
                    "Salud osea y muscular",
                    "Piel y aspecto fisico",
                    "Energia y vitalidad",
                    "Longevidad general",
                    "Sistema inmune",
                    "Salud hormonal",
                    "Salud digestiva y microbioma",
                    "Vision y salud ocular",
                    "Prevencion cancer",
                    "Salud articular",
                  ]}
                  values={form.objetivos_antiedad}
                  onChange={v => update("objetivos_antiedad", v)}
                />
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <h1 className="text-2xl font-semibold text-amber-700">Suplementacion avanzada</h1>
              <div>
                <p className="text-sm font-medium text-neutral-700">Suplementos avanzados que tomas actualmente</p>
                <MultiSelect
                  options={[
                    "Ninguno",
                    "NMN (precursor NAD+)",
                    "NR (nicotinamida ribosido)",
                    "Resveratrol",
                    "Berberina",
                    "Metformina (prescrita)",
                    "Coenzima Q10",
                    "Espermidina",
                    "Astaxantina",
                    "Pterostilbeno",
                    "Glicina",
                    "Taurina",
                    "Alfa-cetoglutarato",
                    "Fisetin",
                    "Quercetina",
                  ]}
                  values={form.suplementacion_avanzada}
                  onChange={v => update("suplementacion_avanzada", v)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Algo mas que quieras contarle a Nuria sobre tu plan de longevidad
                </label>
                <textarea
                  value={form.nota_longevity}
                  onChange={e => update("nota_longevity", e.target.value)}
                  rows={4}
                  placeholder="Objetivos especificos, preocupaciones, historial relevante..."
                  className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-amber-400 focus:ring-2"
                />
              </div>
            </>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-between pt-4">
            <button type="button" onClick={() => setStep(s => Math.max(s - 1, 1))}
              disabled={step === 1 || loading}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-amber-400 hover:text-amber-700 disabled:opacity-50">
              Atras
            </button>
            {step < TOTAL_STEPS ? (
              <button type="button" onClick={() => setStep(s => Math.min(s + 1, TOTAL_STEPS))}
                className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-500">
                Siguiente
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-500 disabled:opacity-60">
                {loading ? "Guardando..." : "Activar mi plan Longevity"}
              </button>
            )}
          </div>

        </form>
      </section>
    </main>
  );
}

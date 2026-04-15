"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { detectarFaseCiclo } from "@/lib/ciclo-menstrual";

const FASES_INFO = {
  menstruacion: {
    nombre: "Menstruación",
    dias: "Días 1-5",
    color: "#E24B4A",
    bg: "#FCEBEB",
    descripcion: "Tu cuerpo necesita hierro, magnesio y antiinflamatorios naturales.",
    alimentos: ["Lentejas", "Espinacas", "Salmón", "Chocolate negro 85%", "Jengibre", "Cúrcuma"],
    evitar: ["Cafeína en exceso", "Sal", "Alcohol", "Ultraprocesados"],
    energia: "Baja — respeta tu cuerpo, descansa más",
    ejercicio: "Yoga suave, caminar, estiramientos",
  },
  folicular: {
    nombre: "Fase folicular",
    dias: "Días 6-13",
    color: "#1D9E75",
    bg: "#E1F5EE",
    descripcion: "Tu fase de mayor energía. Aprovecha para ser más activa y variada en tu alimentación.",
    alimentos: ["Huevo", "Pollo", "Brócoli", "Kéfir", "Quinoa", "Chucrut"],
    evitar: ["Azúcar refinado", "Alcohol"],
    energia: "Alta — tu mejor semana del ciclo",
    ejercicio: "Fuerza, HIIT, ejercicio intenso",
  },
  ovulacion: {
    nombre: "Ovulación",
    dias: "Días 14-16",
    color: "#EF9F27",
    bg: "#FAEEDA",
    descripcion: "Pico de energía y vitalidad. Prioriza antioxidantes y zinc.",
    alimentos: ["Semillas de calabaza", "Aguacate", "Almendras", "Pimientos rojos", "Frutos rojos"],
    evitar: ["Ultraprocesados", "Azúcar en exceso"],
    energia: "Muy alta — tu pico del ciclo",
    ejercicio: "Todo tipo de ejercicio, estás en tu mejor momento",
  },
  lutea: {
    nombre: "Fase lútea",
    dias: "Días 17-28",
    color: "#534AB7",
    bg: "#EEEDFE",
    descripcion: "Más carbohidratos complejos, triptófano y magnesio para reducir el síndrome premenstrual.",
    alimentos: ["Avena", "Batata", "Pavo", "Nueces", "Plátano", "Legumbres"],
    evitar: ["Cafeína", "Sal", "Alcohol", "Azúcar refinado"],
    energia: "Media-baja — normal sentir más cansancio",
    ejercicio: "Cardio suave, pilates, natación",
  },
};

export default function BienestarCicloPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clinicalForm, setClinicalForm] = useState<any>(null);
  const [faseActual, setFaseActual] = useState<any>(null);
  const [diasCiclo, setDiasCiclo] = useState<any[]>([]);
  const [esMujer, setEsMujer] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.replace("/login"); return; }

      const [{ data: profileData }, { data: clinicalData }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id", user.id).single(),
        supabase.from("clinical_forms").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      const esMujerFlag = profileData?.form_data?.biological_sex === "Mujer";
      setEsMujer(esMujerFlag);

      if (esMujerFlag && clinicalData?.tiene_ciclo && clinicalData?.ultima_menstruacion) {
        setClinicalForm(clinicalData);
        const ajustes = detectarFaseCiclo(clinicalData.ultima_menstruacion, clinicalData.duracion_ciclo ?? 28);
        setFaseActual(ajustes);

        // Generar calendario del ciclo completo
        const inicio = new Date(clinicalData.ultima_menstruacion);
        const duracion = clinicalData.duracion_ciclo ?? 28;
        const dias = [];
        for (let i = 0; i < duracion; i++) {
          const fecha = new Date(inicio);
          fecha.setDate(inicio.getDate() + i);
          const diaNum = i + 1;
          let fase = "lutea";
          if (diaNum <= 5) fase = "menstruacion";
          else if (diaNum <= 13) fase = "folicular";
          else if (diaNum <= 16) fase = "ovulacion";
          const esHoy = fecha.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
          dias.push({ diaNum, fecha, fase, esHoy });
        }
        setDiasCiclo(dias);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );

  const faseInfo = faseActual ? FASES_INFO[faseActual.fase as keyof typeof FASES_INFO] : null;

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto w-full max-w-4xl space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">← Dashboard</Link>
          <div className="flex gap-2 flex-wrap">
            {[["Cuerpo", "/bienestar"], ["Día", "/bienestar/dia"], ["Mente", "/bienestar/mente"], ["Ciclo", "/bienestar/ciclo"], ["Salud", "/bienestar/salud"]].map(([tab, href], i) => (
              <Link key={tab} href={href} className={`rounded-full px-3 py-1 text-xs font-medium ${i === 3 ? "bg-[#0F6E56] text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}>
                {tab}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[#0F6E56]">Mi Ciclo</h1>
          <p className="mt-1 text-neutral-500">Calendario hormonal y nutrición por fase</p>
        </div>

        {!esMujer ? (
          <div className="rounded-2xl border border-neutral-200 p-8 text-center">
            <p className="text-neutral-500">Esta sección es exclusiva para usuarias con ciclo menstrual.</p>
          </div>
        ) : !clinicalForm?.tiene_ciclo ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-amber-700 font-medium">Activa el seguimiento de ciclo en tu formulario clínico</p>
            <p className="text-sm text-amber-600 mt-2">Indica tu fecha de última menstruación para ver el calendario hormonal</p>
            <Link href="/onboarding" className="mt-4 inline-block rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-900">
              Actualizar formulario
            </Link>
          </div>
        ) : (
          <>
            {/* Fase actual */}
            {faseInfo && faseActual && (
              <div className="rounded-2xl p-6 border-2" style={{ borderColor: faseInfo.color, background: faseInfo.bg }}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: faseInfo.color }}>Fase actual</span>
                    <h2 className="text-2xl font-bold mt-1" style={{ color: faseInfo.color }}>{faseInfo.nombre}</h2>
                    <p className="text-sm mt-1" style={{ color: faseInfo.color }}>{faseInfo.dias} · Día {faseActual.dias_de_fase} de esta fase</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Energía esperada</p>
                    <p className="text-sm font-medium mt-1" style={{ color: faseInfo.color }}>{faseInfo.energia}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-neutral-700">{faseInfo.descripcion}</p>
                <p className="mt-3 text-sm text-neutral-600 italic">{faseActual.mensaje_nuria}</p>
              </div>
            )}

            {/* Calendario visual */}
            {diasCiclo.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Calendario del ciclo</h2>
                <div className="flex gap-1 flex-wrap">
                  {diasCiclo.map(dia => {
                    const info = FASES_INFO[dia.fase as keyof typeof FASES_INFO];
                    return (
                      <div key={dia.diaNum}
                        className="flex flex-col items-center justify-center rounded-lg"
                        style={{
                          width: 36, height: 36,
                          background: dia.esHoy ? info.color : info.bg,
                          border: dia.esHoy ? `2px solid ${info.color}` : "none",
                        }}>
                        <span style={{ fontSize: 10, color: dia.esHoy ? "white" : info.color, fontWeight: dia.esHoy ? 700 : 400 }}>
                          {dia.diaNum}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4 flex-wrap">
                  {Object.entries(FASES_INFO).map(([key, info]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: info.color }} />
                      <span className="text-xs text-neutral-500">{info.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrición por fase */}
            {faseInfo && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 p-5">
                  <h3 className="font-semibold text-[#0F6E56] mb-3">Alimentos a priorizar esta semana</h3>
                  <div className="flex flex-wrap gap-2">
                    {faseInfo.alimentos.map(a => (
                      <span key={a} className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-[#0F6E56] font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-200 p-5">
                  <h3 className="font-semibold text-neutral-700 mb-3">Alimentos a reducir</h3>
                  <div className="flex flex-wrap gap-2">
                    {faseInfo.evitar.map(a => (
                      <span key={a} className="rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs text-red-600 font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-200 p-5 sm:col-span-2">
                  <h3 className="font-semibold text-[#0F6E56] mb-2">Ejercicio recomendado</h3>
                  <p className="text-sm text-neutral-600">{faseInfo.ejercicio}</p>
                </div>
              </div>
            )}

            {/* Próximas fases */}
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Próximas fases</h2>
              <div className="space-y-3">
                {Object.entries(FASES_INFO).filter(([key]) => key !== faseActual?.fase).map(([key, info]) => (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: info.bg }}>
                    <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: info.color }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: info.color }}>{info.nombre}</p>
                      <p className="text-xs text-neutral-500">{info.dias} · {info.energia}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </section>
    </main>
  );
}

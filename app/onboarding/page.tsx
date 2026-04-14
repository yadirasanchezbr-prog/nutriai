"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ClinicalFormState = {
  full_name: string;
  age: number | "";
  weight_kg: number | "";
  height_cm: number | "";
  biological_sex: string;
  tiene_ciclo: boolean;
  duracion_ciclo: number;
  ultima_menstruacion: string;
  activity_level: string;
  main_goal: string;
  eating_type: string;
  eating_subtype: string;
  ayuno_horas: string;
  eating_details: string;
  health_conditions: string[];
  intolerances: string[];
  bloating: string;
  heavy_digestions: string;
  constipation: string;
  bowel_movements_per_day: string;
  diarrea: string;
  gases: string;
  nauseas: string;
  acidez: string;
  digestion_urgencia: string;
  dolor_abdominal: string;
  digestion_empeora_con: string[];
  digestion_mejora_con: string[];
  sleep_hours: number;
  stress_level: number;
  cooks_at_home: string;
  tiempo_cocina: string;
  presupuesto_semanal: string;
  comidas_fuera: string;
  batch_cooking: string;
  supplements: string[];
  food_relationship: string;
  emotional_eating: string;
  disliked_foods: string;
  note_for_nuria: string;
  sintomas_hormonales: string[];
  sintomas_piel_cabello: string[];
  ciclo_irregular: string;
  dolor_menstrual: string;
};

const TOTAL_STEPS = 6;

const initialState: ClinicalFormState = {
  full_name: "",
  age: "",
  weight_kg: "",
  height_cm: "",
  biological_sex: "",
  tiene_ciclo: false,
  duracion_ciclo: 28,
  ultima_menstruacion: "",
  activity_level: "",
  main_goal: "",
  eating_type: "",
  eating_subtype: "",
  ayuno_horas: "",
  eating_details: "",
  health_conditions: [],
  intolerances: [],
  bloating: "",
  heavy_digestions: "",
  constipation: "",
  bowel_movements_per_day: "",
  diarrea: "",
  gases: "",
  nauseas: "",
  acidez: "",
  digestion_urgencia: "",
  dolor_abdominal: "",
  digestion_empeora_con: [],
  digestion_mejora_con: [],
  sleep_hours: 7,
  stress_level: 3,
  cooks_at_home: "",
  tiempo_cocina: "",
  presupuesto_semanal: "",
  comidas_fuera: "",
  batch_cooking: "",
  supplements: [],
  food_relationship: "",
  emotional_eating: "",
  disliked_foods: "",
  note_for_nuria: "",
  sintomas_hormonales: [],
  sintomas_piel_cabello: [],
  ciclo_irregular: "",
  dolor_menstrual: "",
};

function SingleSelectButtons({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              active
                ? "border-[#0F6E56] bg-emerald-50 text-[#0F6E56]"
                : "border-neutral-300 text-neutral-700 hover:border-[#0F6E56]/60"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectButtons({
  options,
  values,
  onChange,
}: {
  options: string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  function toggleOption(option: string) {
    if (values.includes(option)) {
      onChange(values.filter((value) => value !== option));
      return;
    }
    onChange([...values, option]);
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = values.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              active
                ? "border-[#0F6E56] bg-emerald-50 text-[#0F6E56]"
                : "border-neutral-300 text-neutral-700 hover:border-[#0F6E56]/60"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ClinicalFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateSession() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
      }
    }
    validateSession();
  }, [router]);

  const progressPercentage = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

  function updateField<K extends keyof ClinicalFormState>(field: K, value: ClinicalFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }

  function previousStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Error obteniendo usuario autenticado:", { userError, userData });
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userData.user.id,
          form_data: form,
        });

      if (profileError) {
        console.error("Error completo al guardar en profiles:", profileError);
        setError(profileError.message);
        setLoading(false);
        return;
      }

      if (form.tiene_ciclo && form.ultima_menstruacion) {
        await supabase
          .from("clinical_forms")
          .upsert({
            user_id: userData.user.id,
            tiene_ciclo: form.tiene_ciclo,
            duracion_ciclo: form.duracion_ciclo,
            ultima_menstruacion: form.ultima_menstruacion,
          }, { onConflict: "user_id" });
      }

      setLoading(false);
      router.push("/dashboard");
    } catch (unexpectedError) {
      console.error("Error inesperado guardando onboarding:", unexpectedError);
      setError("Ha ocurrido un error inesperado al guardar el formulario.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-neutral-200 p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span>Paso {step} de 6</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
            <div
              className="h-2 rounded-full bg-[#0F6E56] transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-semibold text-[#0F6E56]">Datos fisicos</h1>
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700">
                  Nombre completo
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={(event) => updateField("full_name", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-neutral-700">
                    Edad
                  </label>
                  <input
                    id="age"
                    type="number"
                    min={0}
                    value={form.age}
                    onChange={(event) => updateField("age", event.target.value ? Number(event.target.value) : "")}
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                  />
                </div>
                <div>
                  <label htmlFor="weight_kg" className="block text-sm font-medium text-neutral-700">
                    Peso en kg
                  </label>
                  <input
                    id="weight_kg"
                    type="number"
                    min={0}
                    value={form.weight_kg}
                    onChange={(event) =>
                      updateField("weight_kg", event.target.value ? Number(event.target.value) : "")
                    }
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                  />
                </div>
                <div>
                  <label htmlFor="height_cm" className="block text-sm font-medium text-neutral-700">
                    Altura en cm
                  </label>
                  <input
                    id="height_cm"
                    type="number"
                    min={0}
                    value={form.height_cm}
                    onChange={(event) =>
                      updateField("height_cm", event.target.value ? Number(event.target.value) : "")
                    }
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Sexo biologico</p>
                <SingleSelectButtons
                  options={["Mujer", "Hombre", "Prefiero no decir"]}
                  value={form.biological_sex}
                  onChange={(value) => updateField("biological_sex", value)}
                />
              </div>
              {form.biological_sex === "Mujer" ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">¿Tienes ciclo menstrual activo?</p>
                    <SingleSelectButtons
                      options={["Si", "No"]}
                      value={form.tiene_ciclo ? "Si" : "No"}
                      onChange={(value) => updateField("tiene_ciclo", value === "Si")}
                    />
                  </div>
                  {form.tiene_ciclo ? (
                    <>
                      <div>
                        <label htmlFor="duracion_ciclo" className="block text-sm font-medium text-neutral-700">
                          Duracion habitual del ciclo (dias): <span className="font-semibold text-[#0F6E56]">{form.duracion_ciclo}</span>
                        </label>
                        <input
                          id="duracion_ciclo"
                          type="range"
                          min={21}
                          max={35}
                          step={1}
                          value={form.duracion_ciclo}
                          onChange={(event) => updateField("duracion_ciclo", Number(event.target.value))}
                          className="mt-2 w-full accent-[#0F6E56]"
                        />
                        <div className="flex justify-between text-xs text-neutral-500 mt-1">
                          <span>21 dias</span><span>35 dias</span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="ultima_menstruacion" className="block text-sm font-medium text-neutral-700">
                          Fecha de inicio de tu ultima menstruacion
                        </label>
                        <input
                          id="ultima_menstruacion"
                          type="date"
                          value={form.ultima_menstruacion}
                          onChange={(event) => updateField("ultima_menstruacion", event.target.value)}
                          className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                        />
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}

              <div>
                <p className="text-sm font-medium text-neutral-700">Nivel de actividad</p>
                <SingleSelectButtons
                  options={["Sedentario", "Ligero", "Moderado", "Activo", "Muy activo"]}
                  value={form.activity_level}
                  onChange={(value) => updateField("activity_level", value)}
                />
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h1 className="text-2xl font-semibold text-[#0F6E56]">Objetivo y dieta</h1>
              <div>
                <p className="text-sm font-medium text-neutral-700">Objetivo principal</p>
                <SingleSelectButtons
                  options={[
                    "Perdida de grasa",
                    "Recomposicion corporal",
                    "Salud digestiva",
                    "Antiinflamatorio",
                    "Mejorar energia",
                    "Mantenimiento",
                    "Tratamiento de patologias",
                    "Nutricion para la longevidad",
                  ]}
                  value={form.main_goal}
                  onChange={(value) => updateField("main_goal", value)}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Tipo de alimentacion</p>
                <SingleSelectButtons
                  options={["Omnivoro", "Vegetariano", "Vegano", "Sin gluten", "Sin lactosa", "Keto", "Paleo", "OMAD (1 comida al dia)", "Ayuno intermitente", "Personalizado"]}
                  value={form.eating_type}
                  onChange={(value) => {
                    updateField("eating_type", value)
                    updateField("eating_subtype", "")
                    updateField("ayuno_horas", "")
                  }}
                />
              
                {form.eating_type === "Vegetariano" ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700">Tipo de vegetarianismo</p>
                    <SingleSelectButtons
                      options={["Ovolactovegetariano", "Ovovegetariano", "Lactovegetariano", "Pescetariano"]}
                      value={form.eating_subtype}
                      onChange={(value) => updateField("eating_subtype", value)}
                    />
                    {form.eating_subtype ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        {form.eating_subtype === "Ovolactovegetariano" ? "Sin carne ni pescado. Si come huevos y lacteos." :
                         form.eating_subtype === "Ovovegetariano"      ? "Sin carne, pescado ni lacteos. Si come huevos." :
                         form.eating_subtype === "Lactovegetariano"    ? "Sin carne, pescado ni huevos. Si come lacteos." :
                         form.eating_subtype === "Pescetariano"        ? "Sin carne. Si come pescado, huevos y lacteos." : ""}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {form.eating_type === "Vegano" ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700">Estilo vegano</p>
                    <SingleSelectButtons
                      options={["Vegano estandar", "Vegano raw (crudivegano)", "Vegano HCLF", "Vegano WFPB", "Vegano deportivo"]}
                      value={form.eating_subtype}
                      onChange={(value) => updateField("eating_subtype", value)}
                    />
                    {form.eating_subtype ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        {form.eating_subtype === "Vegano estandar"        ? "Sin ningun producto animal." :
                         form.eating_subtype === "Vegano raw (crudivegano)" ? "Solo alimentos crudos sin cocinar por encima de 42 grados." :
                         form.eating_subtype === "Vegano HCLF"            ? "Alto en carbohidratos, bajo en grasa, sin aceites." :
                         form.eating_subtype === "Vegano WFPB"            ? "Alimentos integrales sin procesados ni refinados." :
                         form.eating_subtype === "Vegano deportivo"       ? "Mayor proteina vegetal orientado al rendimiento fisico." : ""}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {form.eating_type === "Ayuno intermitente" ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700">Ventana de alimentacion</p>
                    <SingleSelectButtons
                      options={["12:12", "14:10", "16:8", "18:6", "20:4"]}
                      value={form.ayuno_horas}
                      onChange={(value) => updateField("ayuno_horas", value)}
                    />
                    {form.ayuno_horas ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        {form.ayuno_horas === "12:12" ? "Ayuno 12h, comes en una ventana de 12h" :
                         form.ayuno_horas === "14:10" ? "Ayuno 14h, comes en una ventana de 10h" :
                         form.ayuno_horas === "16:8"  ? "Ayuno 16h, comes en una ventana de 8h (el mas popular)" :
                         form.ayuno_horas === "18:6"  ? "Ayuno 18h, comes en una ventana de 6h (avanzado)" :
                         form.ayuno_horas === "20:4"  ? "Ayuno 20h, comes en una ventana de 4h (muy avanzado)" : ""}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {form.eating_type === "OMAD (1 comida al dia)" ? (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs text-amber-700">
                      OMAD es una unica comida al dia. Nuria generara un menu con una comida principal muy completa y snacks opcionales si los necesitas.
                    </p>
                  </div>
                ) : null}
                {form.eating_type === "Keto" ? (
                  <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-700">
                      Dieta cetogenica: menos de 20-50g de carbohidratos al dia, alta en grasas saludables y proteinas moderadas.
                    </p>
                  </div>
                ) : null}
                {form.eating_type === "Paleo" ? (
                  <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-700">
                      Dieta paleo: alimentos naturales sin procesados, sin cereales, sin lacteos ni legumbres.
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h1 className="text-2xl font-semibold text-[#0F6E56]">Salud</h1>
              <div>
                <p className="text-sm font-medium text-neutral-700">Condiciones de salud</p>
                <MultiSelectButtons
                  options={[
                    "Ninguna",
                    "Problemas digestivos",
                    "Colon irritable (SII)",
                    "Enfermedad de Crohn",
                    "Colitis ulcerosa",
                    "Reflujo gastroesofagico (ERGE)",
                    "Gastritis",
                    "SIBO",
                    "Candidiasis intestinal",
                    "Alteracion hormonal",
                    "Sindrome ovario poliquistico (SOP)",
                    "Endometriosis",
                    "Menopausia / perimenopausia",
                    "Hipotiroidismo",
                    "Hipertiroidismo",
                    "Hashimoto",
                    "Diabetes tipo 1",
                    "Diabetes tipo 2",
                    "Resistencia a la insulina",
                    "Hipertension",
                    "Colesterol alto",
                    "Trigliceridos altos",
                    "Higado graso (NAFLD)",
                    "Anemia ferropenica",
                    "Anemia por deficit B12",
                    "Osteoporosis",
                    "Artritis",
                    "Fibromialgia",
                    "Lupus",
                    "Psoriasis",
                    "Acne hormonal",
                    "Ansiedad / estres cronico",
                    "Depresion",
                    "Fatiga cronica",
                    "Cancer (en tratamiento o remision)",
                  ]}
                  values={form.health_conditions}
                  onChange={(values) => updateField("health_conditions", values)}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Intolerancias</p>
                <MultiSelectButtons
                  options={["Ninguna", "Gluten", "Lactosa", "Fructosa", "Sorbitol", "Huevo", "Frutos secos", "Cacahuete", "Soja", "Marisco", "Pescado", "Mostaza", "Sesamo", "Sulfitos", "Histamina", "Lectinas", "Oxalatos", "FODMAP"]}
                  values={form.intolerances}
                  onChange={(values) => updateField("intolerances", values)}
                />
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <h1 className="text-2xl font-semibold text-[#0F6E56]">Digestion</h1>
              <div>
                <p className="text-sm font-medium text-neutral-700">Gases</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.gases}
                  onChange={(value) => updateField("gases", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Acidez o reflujo</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.acidez}
                  onChange={(value) => updateField("acidez", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Nauseas</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.nauseas}
                  onChange={(value) => updateField("nauseas", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Diarrea</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.diarrea}
                  onChange={(value) => updateField("diarrea", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Urgencia para ir al bano</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.digestion_urgencia}
                  onChange={(value) => updateField("digestion_urgencia", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Dolor abdominal</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.dolor_abdominal}
                  onChange={(value) => updateField("dolor_abdominal", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Hinchazon</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.bloating}
                  onChange={(value) => updateField("bloating", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Digestiones pesadas</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.heavy_digestions}
                  onChange={(value) => updateField("heavy_digestions", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Estrenimiento</p>
                <SingleSelectButtons
                  options={["Nunca", "A veces", "Frecuente", "Siempre"]}
                  value={form.constipation}
                  onChange={(value) => updateField("constipation", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Deposiciones al dia</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">La digestion empeora con</p>
                <MultiSelectButtons
                  options={["Lacteos", "Gluten", "Legumbres", "Crudos", "Grasas", "Cafe", "Alcohol", "Estres", "Picante", "Azucar", "Frutas", "Verduras crudas", "No identificado"]}
                  values={form.digestion_empeora_con}
                  onChange={(values) => updateField("digestion_empeora_con", values)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">La digestion mejora con</p>
                <MultiSelectButtons
                  options={["Ayuno", "Comidas pequenas", "Alimentos cocidos", "Sin lacteos", "Sin gluten", "Probioticos", "Jengibre", "Infusiones", "Ejercicio suave", "No identificado"]}
                  values={form.digestion_mejora_con}
                  onChange={(values) => updateField("digestion_mejora_con", values)}
                />
                <SingleSelectButtons
                  options={["0", "1", "2", "3+"]}
                  value={form.bowel_movements_per_day}
                  onChange={(value) => updateField("bowel_movements_per_day", value)}
                />
              </div>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <h1 className="text-2xl font-semibold text-[#0F6E56]">Habitos</h1>
              <div>
                <label htmlFor="sleep_hours" className="block text-sm font-medium text-neutral-700">
                  Horas de sueno: <span className="font-semibold text-[#0F6E56]">{form.sleep_hours}</span>
                </label>
                <input
                  id="sleep_hours"
                  type="range"
                  min={4}
                  max={10}
                  step={1}
                  value={form.sleep_hours}
                  onChange={(event) => updateField("sleep_hours", Number(event.target.value))}
                  className="mt-2 w-full accent-[#0F6E56]"
                />
              </div>

              <div>
                <label htmlFor="stress_level" className="block text-sm font-medium text-neutral-700">
                  Nivel de estres: <span className="font-semibold text-[#0F6E56]">{form.stress_level}</span>
                </label>
                <input
                  id="stress_level"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={form.stress_level}
                  onChange={(event) => updateField("stress_level", Number(event.target.value))}
                  className="mt-2 w-full accent-[#0F6E56]"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Cocinas en casa?</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Tiempo disponible para cocinar al dia</p>
                <SingleSelectButtons
                  options={["Menos de 15 min", "15-30 min", "30-45 min", "45-60 min", "Mas de 1 hora"]}
                  value={form.tiempo_cocina}
                  onChange={(value) => updateField("tiempo_cocina", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Presupuesto semanal para alimentacion</p>
                <SingleSelectButtons
                  options={["Menos de 30 EUR", "30-50 EUR", "50-80 EUR", "80-120 EUR", "Mas de 120 EUR"]}
                  value={form.presupuesto_semanal}
                  onChange={(value) => updateField("presupuesto_semanal", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Cuantas veces comes fuera de casa a la semana</p>
                <SingleSelectButtons
                  options={["Nunca", "1-2 veces", "3-4 veces", "5 o mas veces"]}
                  value={form.comidas_fuera}
                  onChange={(value) => updateField("comidas_fuera", value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Haces batch cooking (cocinar para varios dias)?</p>
                <SingleSelectButtons
                  options={["Si, habitualmente", "A veces", "No pero me gustaria", "No me interesa"]}
                  value={form.batch_cooking}
                  onChange={(value) => updateField("batch_cooking", value)}
                />
                <SingleSelectButtons
                  options={["Si", "A veces", "Casi nunca"]}
                  value={form.cooks_at_home}
                  onChange={(value) => updateField("cooks_at_home", value)}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Suplementacion</p>
                <MultiSelectButtons
                  options={["Ninguna", "Magnesio", "Vitamina D", "Vitamina B12", "Omega-3", "Probioticos", "Proteina en polvo", "Hierro", "Zinc", "Colageno", "Curcuma", "Ashwagandha", "Melatonina", "Acido folico", "Yodo", "Creatina"]}
                  values={form.supplements}
                  onChange={(values) => updateField("supplements", values)}
                />
              </div>
            </>
          ) : null}

          {step === 6 ? (
            <>
              <h1 className="text-2xl font-semibold text-[#0F6E56]">Relacion con la comida</h1>

              {form.biological_sex === "Mujer" ? (
                <div className="rounded-xl border border-pink-100 bg-pink-50 p-4 space-y-4">
                  <p className="text-sm font-semibold text-pink-700">Sintomas hormonales (solo para mujeres)</p>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Sintomas hormonales frecuentes</p>
                    <MultiSelectButtons
                      options={["Ninguno", "Fatiga cronica", "Cambios de humor", "Irritabilidad", "Ansiedad premenstrual", "Depresion leve", "Falta de libido", "Sofocos", "Sudoracion nocturna", "Retención de liquidos", "Sensacion de frio constante", "Palpitaciones", "Niebla mental", "Insomnio hormonal"]}
                      values={form.sintomas_hormonales}
                      onChange={(values) => updateField("sintomas_hormonales", values)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Sintomas de piel y cabello</p>
                    <MultiSelectButtons
                      options={["Ninguno", "Acne hormonal", "Piel seca", "Piel grasa", "Caida de cabello", "Cabello fino o fragil", "Exceso de vello", "Unas debiles", "Hiperpigmentacion", "Eccema o psoriasis"]}
                      values={form.sintomas_piel_cabello}
                      onChange={(values) => updateField("sintomas_piel_cabello", values)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Ciclo menstrual regular</p>
                    <SingleSelectButtons
                      options={["Si, muy regular", "Bastante regular", "Irregular", "Muy irregular", "Sin ciclo (menopausia, DIU, etc)"]}
                      value={form.ciclo_irregular}
                      onChange={(value) => updateField("ciclo_irregular", value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Dolor menstrual</p>
                    <SingleSelectButtons
                      options={["Sin dolor", "Leve", "Moderado", "Intenso", "Muy intenso / incapacitante"]}
                      value={form.dolor_menstrual}
                      onChange={(value) => updateField("dolor_menstrual", value)}
                    />
                  </div>
                </div>
              ) : null}
              <div>
                <p className="text-sm font-medium text-neutral-700">Relacion con la comida</p>
                <SingleSelectButtons
                  options={["Tranquila", "Con conflictos", "Mucha ansiedad", "Muy dificil"]}
                  value={form.food_relationship}
                  onChange={(value) => updateField("food_relationship", value)}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Comer emocional</p>
                <SingleSelectButtons
                  options={["Raramente", "A veces", "Con frecuencia"]}
                  value={form.emotional_eating}
                  onChange={(value) => updateField("emotional_eating", value)}
                />
              </div>

              <div>
                <label htmlFor="disliked_foods" className="block text-sm font-medium text-neutral-700">
                  Alimentos que no te gustan
                </label>
                <input
                  id="disliked_foods"
                  type="text"
                  value={form.disliked_foods}
                  onChange={(event) => updateField("disliked_foods", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                />
              </div>

              <div>
                <label htmlFor="note_for_nuria" className="block text-sm font-medium text-neutral-700">
                  Nota para Nuria
                </label>
                <textarea
                  id="note_for_nuria"
                  value={form.note_for_nuria}
                  onChange={(event) => updateField("note_for_nuria", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                />
              </div>
            </>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1 || loading}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-[#0F6E56] hover:text-[#0F6E56] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Atras
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d5f4a] disabled:opacity-60"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d5f4a] disabled:opacity-60"
              >
                {loading ? "Generando plan..." : "Generar mi plan"}
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}

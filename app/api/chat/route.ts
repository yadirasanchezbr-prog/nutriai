import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { detectarFaseCiclo } from "@/lib/ciclo-menstrual";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mensaje = body?.mensaje as string | undefined;
    const userId = body?.user_id as string | undefined;
    if (!mensaje || !userId) {
      return NextResponse.json({ error: "Faltan mensaje o user_id." }, { status: 400 });
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
      return NextResponse.json({ error: "Faltan variables de entorno." }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Cargar perfil, menú, check-ins y perfil clínico en paralelo
    const [
      { data: profile },
      { data: menuRow },
      { data: checkins },
      { data: clinicalForm },
      { data: historyRows, error: historyError },
    ] = await Promise.all([
      supabase.from("profiles").select("form_data").eq("id", userId).maybeSingle(),
      supabase.from("weekly_menus").select("menu_data").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("daily_checkins").select("*").eq("user_id", userId).order("date", { ascending: false }).limit(7),
      supabase.from("clinical_forms").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("chat_history").select("role, content, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    ]);

    if (historyError) {
      return NextResponse.json({ error: historyError.message }, { status: 500 });
    }

    // Construir contexto del ciclo menstrual
    let cicloPart = "";
    if (clinicalForm?.tiene_ciclo && clinicalForm?.ultima_menstruacion) {
      const ajustes = detectarFaseCiclo(clinicalForm.ultima_menstruacion, clinicalForm.duracion_ciclo ?? 28);
      if (ajustes.fase !== "desconocida") {
        cicloPart = `\nCICLO MENSTRUAL: Fase ${ajustes.fase.toUpperCase()} (día ${ajustes.dias_de_fase}). ${ajustes.mensaje_nuria}`;
      }
    }

    // Construir resumen de check-ins recientes
    let checkinPart = "";
    if (checkins && checkins.length > 0) {
      const avg = (field: string) => {
        const vals = checkins.map((c: any) => c[field]).filter(Boolean);
        return vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : "N/A";
      };
      checkinPart = `\nCHECK-INS ÚLTIMA SEMANA (${checkins.length}/7 días):
- Hambre media: ${avg("hambre")}/10
- Energía media: ${avg("energia")}/10
- Digestión media: ${avg("digestion")}/10
- Último estado: ${checkins[0]?.estado?.replace("_", " ") ?? "desconocido"}
${checkins[0]?.nota ? `- Última nota: "${checkins[0].nota}"` : ""}`;
    }

    // Construir resumen del menú actual
    let menuPart = "";
    if (menuRow?.menu_data?.dias) {
      const diasNombres = menuRow.menu_data.dias.map((d: any) => d.dia).join(", ");
      menuPart = `\nMENÚ ACTUAL: Semana con platos para ${diasNombres}. Usa este menú como referencia cuando el usuario pregunte sobre sus comidas.`;
    }

    // Construir gemelo metabólico
    let twinPart = "";
    if (clinicalForm?.metabolic_twin && Object.keys(clinicalForm.metabolic_twin).length > 0) {
      const twin = clinicalForm.metabolic_twin;
      twinPart = `\nGEMELO METABÓLICO:
- Sensibilidad al hambre: ${twin.patrones?.sensibilidad_hambre ?? "media"}
- Tendencia digestión: ${twin.patrones?.tendencia_digestion ?? "estable"}
- Riesgo abandono: ${twin.predicciones?.riesgo_abandono ?? 0}%
${twin.predicciones?.semana_critica ? "- ALERTA: semana crítica detectada, usar tono especialmente motivador" : ""}`;
    }

    // Detectar modo restaurante
    const esRestaurante = /restaurante|cenar fuera|comer fuera|italiano|chino|japones|sushi|pizza|hamburgues|mexicano|indio|thai|tapas|bar|terraza|buffet|kebab|fast food|comida rapida/i.test(mensaje);

    const restaurantePart = esRestaurante ? `
MODO RESTAURANTE ACTIVO:
El usuario va a comer o cenar fuera. Tu respuesta debe:
1. Dar exactamente 3 opciones concretas del tipo de restaurante mencionado
2. Para cada opcion: nombre del plato, por que encaja con su plan, que pedir de acompañamiento y que evitar
3. Dar 1 consejo rapido sobre como pedir (sin salsas, al horno en vez de frito, etc)
4. Ser breve y practica - el usuario necesita decidir rapido
Adapta las opciones a: objetivo=${profile?.form_data?.main_goal ?? "general"}, tipo alimentacion=${profile?.form_data?.eating_type ?? "omnivoro"}, intolerancias=${profile?.form_data?.intolerances?.join(", ") ?? "ninguna"}
` : "";

    const systemPrompt = `Eres Nuria, nutricionista clínica española con 15 años de experiencia.
Tono: cercana, directa, empática, nunca condescendiente.
Máximo 3 párrafos cortos. Una sola pregunta al final si es necesario.
Sin diagnósticos médicos ni fármacos. Pesos siempre en gramos en crudo.
Si detectas señales de abandono o desmotivación, activa modo apoyo emocional.

PERFIL DEL USUARIO:
${JSON.stringify(profile?.form_data ?? {}, null, 2)}
${menuPart}
${checkinPart}
${cicloPart}
${twinPart}
${restaurantePart}`;

    const historialMensajes: Array<{ role: "user" | "assistant"; content: string }> = [
      ...((historyRows ?? []).reverse().map((row) => ({
        role: row.role as "user" | "assistant",
        content: row.content,
      }))),
      { role: "user", content: mensaje },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        ...historialMensajes,
      ],
    });

    const respuesta = response.choices[0]?.message?.content?.trim() ?? "";
    if (!respuesta) {
      return NextResponse.json({ error: "OpenAI no devolvió respuesta." }, { status: 500 });
    }

    await Promise.all([
      supabase.from("chat_history").insert({ user_id: userId, role: "user", content: mensaje }),
      supabase.from("chat_history").insert({ user_id: userId, role: "assistant", content: respuesta }),
    ]);

    return NextResponse.json({ respuesta });
  } catch (error) {
    const details = error instanceof Error
      ? { name: error.name, message: error.message }
      : { message: "Error no tipado", raw: error };
    return NextResponse.json({ error: "No se pudo procesar el chat.", details }, { status: 500 });
  }
}

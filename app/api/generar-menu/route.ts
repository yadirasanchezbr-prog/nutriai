import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type MenuResponse = {
  dias: Array<{
    dia: string;
    comida: {
      nombre: string;
      ingredientes: Array<{ nombre: string; cantidad_g: number }>;
    };
    cena: {
      nombre: string;
      ingredientes: Array<{ nombre: string; cantidad_g: number }>;
    };
  }>;
};

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: "Error no tipado",
    raw: error,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body?.user_id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Falta user_id en el body." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Faltan variables de Supabase en el entorno." }, { status: 500 });
    }

    if (!openaiApiKey) {
      return NextResponse.json({ error: "Falta OPENAI_API_KEY en variables de entorno." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const [
      { data: profile, error: profileError },
      { data: clinicalForm },
      { data: bienestarSalud },
      { data: bienestarDias },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("form_data")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("clinical_forms")
        .select("longevity_data")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase.from("bienestar_salud").select("alimentos_tolerados, marcadores_sangre").eq("user_id", userId).maybeSingle(),
      supabase.from("bienestar_dia").select("*").eq("user_id", userId).order("fecha", { ascending: false }).limit(7),
    ]);

    if (profileError) {
      console.error("Error leyendo perfil para generar menu:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profile?.form_data) {
      return NextResponse.json({ error: "No existe form_data para este usuario." }, { status: 404 });
    }

    const longevityPart = clinicalForm?.longevity_data
      ? `\nConsidera tambien estos datos de longevidad del usuario al planificar el menu:\n${JSON.stringify(clinicalForm.longevity_data, null, 2)}`
      : "";

    let bienestarMenuPart = ""
    if (bienestarSalud) {
      const malTolerados = (bienestarSalud.alimentos_tolerados ?? []).filter((a: any) => a.estado === "mal").map((a: any) => a.nombre)
      const marcadores = bienestarSalud.marcadores_sangre ?? {}
      if (malTolerados.length > 0) bienestarMenuPart += `\nALIMENTOS PROHIBIDOS (el usuario reporta que le sientan MAL - NUNCA incluir): ${malTolerados.join(", ")}`
      if (marcadores.vitamina_d && Number(marcadores.vitamina_d) < 30) bienestarMenuPart += `\nVitamina D baja (${marcadores.vitamina_d} ng/mL): incluir salmon, sardinas o huevo cada dia`
      if (marcadores.pcr && Number(marcadores.pcr) > 1) bienestarMenuPart += `\nPCR elevada (${marcadores.pcr}): maximizar antiinflamatorios naturales en todos los platos`
      if (marcadores.ferritina && Number(marcadores.ferritina) < 15) bienestarMenuPart += `\nFerritina baja: aumentar hierro hemo y no hemo + vitamina C junto al hierro`
      if (marcadores.b12 && Number(marcadores.b12) < 300) bienestarMenuPart += `\nB12 baja: reforzar con huevo, pescado, lacteos o alternativas enriquecidas`
    }

    if (bienestarDias && bienestarDias.length > 0) {
      const avgEnergia = bienestarDias.map((d: any) => d.energia_manana ?? 5).reduce((a: number, b: number) => a + b, 0) / bienestarDias.length
      const avgSueno = bienestarDias.map((d: any) => d.horas_sueno ?? 7).filter(Boolean).reduce((a: number, b: number) => a + b, 0) / bienestarDias.length
      const triggers = bienestarDias.map((d: any) => d.alimento_trigger).filter(Boolean)
      if (avgEnergia < 5) bienestarMenuPart += `\nENERGIA BAJA esta semana (media ${avgEnergia.toFixed(1)}/10): priorizar hierro, B12, carbohidratos complejos en desayuno`
      if (avgSueno < 6) bienestarMenuPart += `\nSUENO INSUFICIENTE (media ${avgSueno.toFixed(1)}h): incluir triptofano, magnesio y melatonina natural (platano, nueces, cereza)`
      if (triggers.length > 0) bienestarMenuPart += `\nALIMENTOS TRIGGER detectados por el usuario: ${[...new Set(triggers)].join(", ")} - evitar o reducir`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            `Eres Nuria, nutricionista clínica experta. Genera un menú semanal personalizado de 7 días. Cada día tiene: comida principal y cena. Incluye el nombre del plato y los ingredientes con sus pesos exactos en gramos en CRUDO antes de cocinar. NUNCA uses pesos cocinados. Responde SOLO en JSON con esta estructura: { dias: [ { dia: 'Lunes', comida: { nombre: string, ingredientes: [{nombre: string, cantidad_g: number}] }, cena: { nombre: string, ingredientes: [{nombre: string, cantidad_g: number}] } } ] }${longevityPart}${bienestarMenuPart}`,
        },
        {
          role: "user",
          content: `Perfil completo del usuario:\n${JSON.stringify(profile.form_data, null, 2)}`,
        },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";
    const normalized = rawContent.replace(/```json|```/g, "").trim();

    let menu: MenuResponse;
    try {
      menu = JSON.parse(normalized) as MenuResponse;
    } catch (parseError) {
      const parseDetails = getErrorDetails(parseError);
      console.error("Error parseando JSON de OpenAI:", {
        parseDetails,
        rawContent,
        normalized,
      });
      return NextResponse.json(
        {
          error: "Respuesta de OpenAI no es JSON valido.",
          details: parseDetails,
          raw_content: rawContent,
          normalized_content: normalized,
        },
        { status: 500 }
      );
    }

    if (!menu?.dias || !Array.isArray(menu.dias)) {
      return NextResponse.json(
        {
          error: "JSON generado no cumple la estructura esperada.",
          details: {
            expected: "{ dias: [...] }",
            received: menu,
          },
          raw_content: rawContent,
        },
        { status: 500 }
      );
    }

    const { error: saveError } = await supabase.from("weekly_menus").insert({
      user_id: userId,
      menu_data: menu,
    });

    if (saveError) {
      console.error("Error guardando weekly_menus:", saveError);
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    return NextResponse.json({ menu });
  } catch (error) {
    const errorDetails = getErrorDetails(error);
    console.error("Error inesperado en /api/generar-menu:", errorDetails);
    return NextResponse.json(
      {
        error: "No se pudo generar el menu semanal.",
        details: errorDetails,
        checks: {
          openai_api_key_configured: Boolean(process.env.OPENAI_API_KEY),
          model: "gpt-4o-mini",
        },
      },
      { status: 500 }
    );
  }
}

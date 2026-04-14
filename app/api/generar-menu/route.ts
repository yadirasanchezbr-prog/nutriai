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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("form_data")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Error leyendo perfil para generar menu:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profile?.form_data) {
      return NextResponse.json({ error: "No existe form_data para este usuario." }, { status: 404 });
    }

    const esLongevity = profile.form_data?.main_goal === "Antiedad y longevidad"

    const longevityPart = esLongevity ? `

PROTOCOLO ANTIEDAD Y LONGEVIDAD ACTIVO:
- Priorizar alimentos ricos en antioxidantes: frutos rojos, curcuma, jengibre, te verde, cacao puro
- Incluir fuentes de polifenoles: aceite de oliva virgen extra, uvas, granadas, brocoli
- Respetar ventana de alimentacion: dejar 12h minimas de ayuno nocturno
- Proteina de calidad en cada comida para evitar sarcopenia: huevo, pescado azul, legumbres
- Omega-3 diariamente: salmon, sardinas, nueces, semillas de lino
- Reducir azucares refinados y ultraprocesados al minimo absoluto
- Alimentos fermentados para microbioma: kefir, yogur natural, chucrut
- Verduras cruciferas en al menos 1 comida al dia: brocoli, coliflor, kale, berros
- Grasas saludables en cada comida: aguacate, aceite oliva virgen extra, frutos secos
- Infusiones de jengibre y curcuma como bebida habitual
- Objetivo: reducir inflamacion cronica, estres oxidativo y proteger telomeros
` : ""

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            `Eres Nuria, nutricionista clínica experta. Genera un menú semanal personalizado de 7 días. Cada día tiene: comida principal y cena. Incluye el nombre del plato y los ingredientes con sus pesos exactos en gramos en CRUDO antes de cocinar. NUNCA uses pesos cocinados. Responde SOLO en JSON con esta estructura: { dias: [ { dia: 'Lunes', comida: { nombre: string, ingredientes: [{nombre: string, cantidad_g: number}] }, cena: { nombre: string, ingredientes: [{nombre: string, cantidad_g: number}] } } ] }${longevityPart}`,
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

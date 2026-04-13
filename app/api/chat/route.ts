import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mensaje = body?.mensaje as string | undefined;
    const userId = body?.user_id as string | undefined;

    if (!mensaje || !userId) {
      return NextResponse.json({ error: "Faltan mensaje o user_id en el body." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
      return NextResponse.json(
        {
          error: "Faltan variables de entorno.",
          checks: {
            has_supabase_url: Boolean(supabaseUrl),
            has_supabase_anon_key: Boolean(supabaseAnonKey),
            has_openai_api_key: Boolean(openaiApiKey),
          },
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("form_data")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    const perfilUsuario = JSON.stringify(profile?.form_data ?? {}, null, 2);

    const { data: historyRows, error: historyError } = await supabase
      .from("chat_history")
      .select("role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (historyError) {
      return NextResponse.json({ error: historyError.message }, { status: 500 });
    }

    const historialMensajes: Array<{ role: "user" | "assistant"; content: string }> = [
      ...(historyRows ?? []).reverse().map((row) => ({
        role: row.role as "user" | "assistant",
        content: row.content,
      })),
      { role: "user", content: mensaje },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Eres Nuria, nutricionista clínica española. \nREGLA ABSOLUTA: Solo puedes usar palabras en español correcto de España.\nVOCABULARIO PROHIBIDO (nunca uses estas traducciones literales del inglés):\n- NO digas 'irritante' → di 'hinchazón' o 'malestar'  \n- NO digas 'aumento' → di 'sensación de plenitud'\n- NO digas 'exagerado' → di 'molestia'\n- NO digas 'viene' → di 'come' o 'comes'\n- NO digas 'refrigeración' → di 'hinchazón'\n\nTono: cercana, directa, empática. Máximo 3 párrafos cortos.\nUna sola pregunta al final. Sin diagnósticos ni fármacos.\nPesos de alimentos siempre en gramos en crudo.",
        },
        {
          role: "system",
          content: `Perfil del usuario: ${perfilUsuario}`,
        },
        ...historialMensajes,
      ],
    });

    const respuesta = response.choices[0]?.message?.content?.trim() ?? "";

    if (!respuesta) {
      return NextResponse.json({ error: "OpenAI no devolvio respuesta." }, { status: 500 });
    }

    const { error: saveUserError } = await supabase.from("chat_history").insert({
      user_id: userId,
      role: "user",
      content: mensaje,
    });

    if (saveUserError) {
      return NextResponse.json({ error: saveUserError.message }, { status: 500 });
    }

    const { error: saveAssistantError } = await supabase.from("chat_history").insert({
      user_id: userId,
      role: "assistant",
      content: respuesta,
    });

    if (saveAssistantError) {
      return NextResponse.json({ error: saveAssistantError.message }, { status: 500 });
    }

    return NextResponse.json({ respuesta });
  } catch (error) {
    const details =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: "Error no tipado", raw: error };
    return NextResponse.json({ error: "No se pudo procesar el chat.", details }, { status: 500 });
  }
}

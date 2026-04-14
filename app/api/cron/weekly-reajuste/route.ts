import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildMetabolicTwin, calcNutriScore } from '@/lib/metabolic-twin'
import { injectCicloEnPrompt } from '@/lib/ciclo-menstrual'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const userId = body?.user_id as string | undefined
  if (!userId) return NextResponse.json({ error: 'Falta user_id en el body.' }, { status: 400 })

  const { data: checkins } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(7)

  if (!checkins || checkins.length < 3) {
    return NextResponse.json({ message: 'Insuficientes check-ins para reajustar' })
  }

  const { data: profile } = await supabase
    .from('clinical_forms')
    .select('*')
    .eq('user_id', userId)
    .single()

  const { data: currentMenu } = await supabase
    .from('weekly_menus')
    .select('menu_json')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const avg = (field: string) => {
    const vals = checkins.map((c: any) => c[field]).filter(Boolean)
    return vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : '5'
  }
  const avgHambre    = avg('hambre')
  const avgEnergia   = avg('energia')
  const avgDigestion = avg('digestion')

  const ajustes: string[] = []
  if (Number(avgHambre) >= 7.5)   ajustes.push('AUMENTAR calorías totales ~200 kcal, añadir snack proteico por la tarde')
  if (Number(avgHambre) <= 3)     ajustes.push('REDUCIR ligeramente porciones, verificar que no se salten comidas')
  if (Number(avgEnergia) <= 4)    ajustes.push('PRIORIZAR carbohidratos complejos en desayuno y comida, añadir hierro y B12')
  if (Number(avgDigestion) <= 4)  ajustes.push('PROTOCOLO DIGESTIVO: eliminar legumbres 3 días, priorizar alimentos cocidos, añadir jengibre y cúrcuma')
  if (Number(avgDigestion) >= 8 && Number(avgEnergia) >= 7) ajustes.push('MANTENER estructura actual, la usuaria responde muy bien')

  const twin = await buildMetabolicTwin(userId, supabase)

  if (twin.predicciones.semana_critica) {
    ajustes.push('SEMANA CRÍTICA: simplificar menú al máximo, recetas menos de 20 minutos, platos reconfortantes')
  }
  if (twin.patrones.sensibilidad_hambre === 'alta') {
    ajustes.push('HAMBRE ALTA: asegurar más de 30g proteína en comida y cena')
  }

  if (ajustes.length === 0) {
    return NextResponse.json({ message: 'Plan óptimo, sin reajuste necesario' })
  }

  let prompt = `Eres un nutricionista clínico experto.

PERFIL DEL USUARIO:
${JSON.stringify(profile, null, 2)}

MENÚ ACTUAL:
${JSON.stringify(currentMenu?.menu_json, null, 2)}

DATOS ÚLTIMA SEMANA:
- Hambre media: ${avgHambre}/10
- Energía media: ${avgEnergia}/10
- Digestión media: ${avgDigestion}/10
- Días con check-in: ${checkins.length}/7

AJUSTES REQUERIDOS:
${ajustes.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Genera un nuevo menú semanal completo en JSON con 7 días.
Cada día debe tener: desayuno, media_mañana, comida, merienda, cena.
Cada comida con: nombre, ingredientes (array), tiempo_prep (minutos), calorias, proteinas_g, carbos_g, grasas_g.
Añade "motivo_reajuste": string explicando qué cambiaste y por qué.
Responde SOLO con el JSON, sin texto adicional.`

  prompt = injectCicloEnPrompt(prompt, profile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 4000,
  })

  const newMenu = JSON.parse(completion.choices[0].message.content ?? '{}')

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)

  await supabase.from('weekly_menus').insert({
    user_id: userId,
    week_start: weekStart.toISOString().split('T')[0],
    menu_json: newMenu,
    reajuste: true,
    ajustes_aplicados: ajustes,
  })

  const { score, breakdown } = calcNutriScore(checkins)
  await supabase.from('weekly_scores').upsert({
    user_id: userId,
    week_start: weekStart.toISOString().split('T')[0],
    score,
    adherencia: breakdown.adherencia,
    energia_media: breakdown.energia,
    digestion_media: breakdown.digestion,
    progreso_pts: breakdown.progreso,
    checkins_count: checkins.length,
  }, { onConflict: 'user_id,week_start' })

  return NextResponse.json({
    message: 'Menú reajustado correctamente',
    ajustes,
    nutriscore: score,
    medias: { avgHambre, avgEnergia, avgDigestion }
  })
}

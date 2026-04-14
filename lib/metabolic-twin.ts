export interface MetabolicTwin {
  patrones: {
    sensibilidad_hambre: 'alta' | 'media' | 'baja'
    tendencia_digestion: 'mejora' | 'estable' | 'empeora'
  }
  predicciones: {
    riesgo_abandono: number
    semana_critica: boolean
  }
  ultima_actualizacion: string
}

export async function buildMetabolicTwin(userId: string, supabase: any): Promise<MetabolicTwin> {
  const hace4Semanas = new Date()
  hace4Semanas.setDate(hace4Semanas.getDate() - 28)

  const { data: checkins } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .gte('date', hace4Semanas.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (!checkins || checkins.length < 7) {
    return {
      patrones: {
        sensibilidad_hambre: 'media',
        tendencia_digestion: 'estable',
      },
      predicciones: { riesgo_abandono: 0, semana_critica: false },
      ultima_actualizacion: new Date().toISOString(),
    }
  }

  const avgDigestion = checkins.map((c: any) => c.digestion ?? 5)
  const mid = Math.floor(checkins.length / 2)
  const avgDig1 = avgDigestion.slice(0, mid).reduce((a: number, b: number) => a + b, 0) / mid
  const avgDig2 = avgDigestion.slice(mid).reduce((a: number, b: number) => a + b, 0) / (checkins.length - mid)
  const tendencia = avgDig2 > avgDig1 + 0.5 ? 'mejora' : avgDig2 < avgDig1 - 0.5 ? 'empeora' : 'estable'

  const avgHambre = checkins.map((c: any) => c.hambre ?? 5)
  const mediaHambre = avgHambre.reduce((a: number, b: number) => a + b, 0) / avgHambre.length
  const sensibilidad = mediaHambre >= 7 ? 'alta' : mediaHambre <= 4 ? 'baja' : 'media'

  const ultimaSemana = checkins.filter((c: any) => {
    const d = new Date(c.date)
    const hoy = new Date()
    return (hoy.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000
  })
  const diasSinCheckin = 7 - ultimaSemana.length
  const ultimoEstadoBajo = ultimaSemana.some((c: any) => c.estado === 'mal' || c.estado === 'muy_mal')
  const riesgoAbandono = Math.min(100, diasSinCheckin * 12 + (ultimoEstadoBajo ? 25 : 0))

  const twin: MetabolicTwin = {
    patrones: {
      sensibilidad_hambre: sensibilidad,
      tendencia_digestion: tendencia,
    },
    predicciones: {
      riesgo_abandono: riesgoAbandono,
      semana_critica: riesgoAbandono >= 50 || ultimoEstadoBajo,
    },
    ultima_actualizacion: new Date().toISOString(),
  }

  await supabase
    .from('clinical_forms')
    .update({ metabolic_twin: twin, twin_updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  return twin
}

export function calcNutriScore(checkins: any[]): { score: number; breakdown: any } {
  const count = checkins.length
  const avg = (field: string) => {
    const vals = checkins.map((c: any) => c[field]).filter(Boolean)
    return vals.length ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 5
  }

  const adherencia = Math.round((count / 7) * 100)
  const energia    = Math.round((avg('energia') / 10) * 100)
  const digestion  = Math.round((avg('digestion') / 10) * 100)
  const progreso   = Math.round(((avg('energia') + avg('digestion')) / 20) * 100)

  const score = Math.round(
    adherencia * 0.30 +
    energia    * 0.25 +
    digestion  * 0.25 +
    progresso   * 0.20
  )

  return { score, breakdown: { adherencia, energia, digestion, progreso } }
}

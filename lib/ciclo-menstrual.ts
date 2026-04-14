export type FaseCiclo = 'menstruacion' | 'folicular' | 'ovulacion' | 'lutea' | 'desconocida'

export interface AjustesCiclo {
  fase: FaseCiclo
  dias_de_fase: number
  instrucciones_menu: string[]
  alimentos_priorizar: string[]
  alimentos_reducir: string[]
  mensaje_nuria: string
}

export function detectarFaseCiclo(
  ultimaMenstruacion: string | null,
  duracionCiclo: number = 28
): AjustesCiclo {
  if (!ultimaMenstruacion) {
    return {
      fase: 'desconocida', dias_de_fase: 0,
      instrucciones_menu: [], alimentos_priorizar: [], alimentos_reducir: [],
      mensaje_nuria: ''
    }
  }

  const inicio = new Date(ultimaMenstruacion)
  const hoy = new Date()
  const diasDesdeInicio = Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
  const diaEnCiclo = ((diasDesdeInicio % duracionCiclo) + duracionCiclo) % duracionCiclo + 1

  let fase: FaseCiclo
  let diasDeFase: number

  if (diaEnCiclo <= 5) {
    fase = 'menstruacion'
    diasDeFase = diaEnCiclo
  } else if (diaEnCiclo <= 13) {
    fase = 'folicular'
    diasDeFase = diaEnCiclo - 5
  } else if (diaEnCiclo <= 16) {
    fase = 'ovulacion'
    diasDeFase = diaEnCiclo - 13
  } else {
    fase = 'lutea'
    diasDeFase = diaEnCiclo - 16
  }

  const AJUSTES: Record<FaseCiclo, Omit<AjustesCiclo, 'fase' | 'dias_de_fase'>> = {
    menstruacion: {
      instrucciones_menu: [
        'Aumentar hierro en todas las comidas principales',
        'Añadir vitamina C junto al hierro para absorción',
        'Incluir magnesio: chocolate negro, plátano, frutos secos',
        'Priorizar alimentos antiinflamatorios: cúrcuma, jengibre, omega-3',
        'Reducir sal para minimizar retención de líquidos',
      ],
      alimentos_priorizar: ['lentejas', 'espinacas', 'sardinas', 'chocolate negro 85%', 'plátano', 'jengibre', 'cúrcuma', 'salmón'],
      alimentos_reducir: ['cafeína excesiva', 'sal', 'alcohol', 'alimentos procesados'],
      mensaje_nuria: 'Esta semana tu cuerpo necesita hierro y antiinflamatorios. He ajustado tu menú para que te sientas mejor durante la menstruación.',
    },
    folicular: {
      instrucciones_menu: [
        'Fase de mayor energía: aprovechar para comidas más variadas',
        'Incluir proteínas de calidad para síntesis hormonal',
        'Añadir alimentos fermentados para el microbioma',
        'Verduras crucíferas para metabolismo estrogénico',
      ],
      alimentos_priorizar: ['huevo', 'pollo', 'brócoli', 'coliflor', 'kéfir', 'yogur', 'chucrut', 'quinoa'],
      alimentos_reducir: ['azúcar refinado', 'alcohol'],
      mensaje_nuria: 'Estás en tu fase de mayor energía. He diseñado un menú rico en proteínas y probióticos para aprovecharla al máximo.',
    },
    ovulacion: {
      instrucciones_menu: [
        'Priorizar zinc y antioxidantes',
        'Incluir alimentos ricos en vitamina E',
        'Mantener hidratación alta',
        'Alimentos antiinflamatorios preventivos',
      ],
      alimentos_priorizar: ['semillas de calabaza', 'aguacate', 'almendras', 'pimientos rojos', 'tomate', 'frutos rojos'],
      alimentos_reducir: ['alimentos muy procesados', 'azúcar en exceso'],
      mensaje_nuria: 'Estás en ovulación: tu pico de energía del ciclo. El menú de esta semana refuerza antioxidantes y zinc.',
    },
    lutea: {
      instrucciones_menu: [
        'Aumentar carbohidratos complejos para reducir ansiedad por dulce',
        'Priorizar triptófano para síntesis de serotonina',
        'Reducir cafeína para mejorar el sueño',
        'Añadir vitamina B6 para el síndrome premenstrual',
        'Magnesio extra para reducir calambres y retención',
      ],
      alimentos_priorizar: ['avena', 'batata', 'pavo', 'nueces', 'plátano', 'legumbres', 'semillas de girasol'],
      alimentos_reducir: ['cafeína', 'sal', 'alcohol', 'azúcar refinado'],
      mensaje_nuria: 'Entramos en la fase lútea. He añadido más carbohidratos complejos y triptófano para mantener tu estado de ánimo estable.',
    },
    desconocida: {
      instrucciones_menu: [],
      alimentos_priorizar: [],
      alimentos_reducir: [],
      mensaje_nuria: '',
    },
  }

  return { fase, dias_de_fase: diasDeFase, ...AJUSTES[fase] }
}

export function injectCicloEnPrompt(promptBase: string, profile: any): string {
  if (!profile.tiene_ciclo || !profile.ultima_menstruacion) return promptBase

  const ajustes = detectarFaseCiclo(profile.ultima_menstruacion, profile.duracion_ciclo ?? 28)
  if (ajustes.fase === 'desconocida') return promptBase

  const cicloPart = `
PROTOCOLO CICLO MENSTRUAL ACTIVO:
- Fase actual: ${ajustes.fase.toUpperCase()} (día ${ajustes.dias_de_fase} de esta fase)
- Instrucciones nutricionales OBLIGATORIAS para esta semana:
${ajustes.instrucciones_menu.map(i => `  • ${i}`).join('\n')}
- Alimentos a PRIORIZAR: ${ajustes.alimentos_priorizar.join(', ')}
- Alimentos a REDUCIR: ${ajustes.alimentos_reducir.join(', ')}
- Importante: el menú DEBE reflejar estos ajustes en al menos el 80% de los días.
`
  return promptBase + '\n' + cicloPart
}

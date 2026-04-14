'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Ingrediente = { nombre: string; cantidad_g: number }
type ItemLista = { nombre: string; cantidad_g: number; checked: boolean }
type Categoria = { nombre: string; items: ItemLista[] }

const CATEGORIAS: Record<string, string[]> = {
  'Carnes y pescados': ['pollo', 'pechuga', 'ternera', 'salmón', 'salmon', 'atún', 'atun', 'merluza', 'sardina', 'bacalao', 'pavo', 'cerdo', 'cordero', 'gambas', 'mejillones', 'sepia'],
  'Huevos y lácteos': ['huevo', 'leche', 'yogur', 'queso', 'kéfir', 'kefir', 'mantequilla', 'nata', 'requesón', 'requesone'],
  'Verduras y hortalizas': ['lechuga', 'tomate', 'cebolla', 'ajo', 'zanahoria', 'pimiento', 'calabacín', 'calabacin', 'berenjena', 'espinaca', 'brócoli', 'brocoli', 'coliflor', 'pepino', 'acelga', 'apio', 'puerro', 'remolacha', 'alcachofa', 'judía', 'guisante', 'champiñon', 'champiñón'],
  'Frutas': ['manzana', 'plátano', 'platano', 'naranja', 'limón', 'limon', 'fresa', 'uva', 'pera', 'melocotón', 'melocoton', 'kiwi', 'mango', 'aguacate', 'arándano', 'arandano', 'frambuesa', 'cereza'],
  'Legumbres': ['lenteja', 'garbanzo', 'alubia', 'judía blanca', 'soja', 'edamame', 'hummus'],
  'Cereales y harinas': ['arroz', 'pasta', 'pan', 'avena', 'quinoa', 'harina', 'maíz', 'maiz', 'cuscús', 'cuscus', 'trigo', 'centeno', 'espelta'],
  'Frutos secos y semillas': ['almendra', 'nuez', 'anacardo', 'pistacho', 'semilla', 'chía', 'chia', 'lino', 'girasol', 'calabaza', 'sésamo', 'sesamo', 'cacahuete'],
  'Aceites y condimentos': ['aceite', 'vinagre', 'sal', 'pimienta', 'cúrcuma', 'curcuma', 'jengibre', 'comino', 'orégano', 'oregano', 'tomillo', 'romero', 'canela', 'pimentón', 'pimenton'],
  'Otros': [],
}

function clasificarIngrediente(nombre: string): string {
  const lower = nombre.toLowerCase()
  for (const [categoria, palabras] of Object.entries(CATEGORIAS)) {
    if (categoria === 'Otros') continue
    if (palabras.some(p => lower.includes(p))) return categoria
  }
  return 'Otros'
}

function agruparIngredientes(ingredientes: Ingrediente[]): Record<string, ItemLista[]> {
  const mapa: Record<string, Record<string, number>> = {}
  for (const ing of ingredientes) {
    const cat = clasificarIngrediente(ing.nombre)
    if (!mapa[cat]) mapa[cat] = {}
    const key = ing.nombre.toLowerCase().trim()
    mapa[cat][key] = (mapa[cat][key] ?? 0) + ing.cantidad_g
  }
  const resultado: Record<string, ItemLista[]> = {}
  for (const [cat, items] of Object.entries(mapa)) {
    resultado[cat] = Object.entries(items).map(([nombre, cantidad_g]) => ({
      nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
      cantidad_g: Math.round(cantidad_g),
      checked: false,
    }))
  }
  return resultado
}

export default function ListaCompra() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('weekly_menus')
        .select('menu_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!data?.menu_data?.dias) { setLoading(false); return }

      const todosIngredientes: Ingrediente[] = []
      for (const dia of data.menu_data.dias) {
        if (dia.comida?.ingredientes) todosIngredientes.push(...dia.comida.ingredientes)
        if (dia.cena?.ingredientes)   todosIngredientes.push(...dia.cena.ingredientes)
      }

      const agrupados = agruparIngredientes(todosIngredientes)
      const orden = Object.keys(CATEGORIAS)
      const lista: Categoria[] = orden
        .filter(cat => agrupados[cat]?.length)
        .map(cat => ({ nombre: cat, items: agrupados[cat] }))
      if (agrupados['Otros']?.length) lista.push({ nombre: 'Otros', items: agrupados['Otros'] })

      setCategorias(lista)
      setLoading(false)
    }
    load()
  }, [])

  function toggleItem(catIdx: number, itemIdx: number) {
    setCategorias(prev => prev.map((cat, ci) =>
      ci !== catIdx ? cat : {
        ...cat,
        items: cat.items.map((item, ii) =>
          ii !== itemIdx ? item : { ...item, checked: !item.checked }
        )
      }
    ))
  }

  function copiarLista() {
    const texto = categorias.map(cat =>
      `${cat.nombre}:\n` + cat.items.map(i => `  • ${i.nombre} — ${i.cantidad_g}g`).join('\n')
    ).join('\n\n')
    navigator.clipboard.writeText(texto)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalItems = categorias.reduce((a, c) => a + c.items.length, 0)
  const checkedItems = categorias.reduce((a, c) => a + c.items.filter(i => i.checked).length, 0)

  if (loading) return <p style={{ fontSize: 13, color: '#888780' }}>Generando lista...</p>

  if (!categorias.length) return (
    <p style={{ fontSize: 13, color: '#888780' }}>
      Genera tu menú semanal primero para obtener la lista de la compra.
    </p>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#5F5E5A' }}>
          {checkedItems}/{totalItems} productos marcados
        </p>
        <button onClick={copiarLista} style={{
          fontSize: 12, padding: '6px 14px', borderRadius: 8,
          border: '1px solid #1D9E75', color: '#1D9E75', background: 'transparent', cursor: 'pointer'
        }}>
          {copied ? '✓ Copiado' : 'Copiar lista'}
        </button>
      </div>

      <div style={{ height: 4, background: '#E8E6E0', borderRadius: 2, marginBottom: 20 }}>
        <div style={{
          height: '100%', borderRadius: 2, background: '#1D9E75',
          width: `${totalItems ? Math.round((checkedItems / totalItems) * 100) : 0}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>

      {categorias.map((cat, ci) => (
        <div key={cat.nombre} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            {cat.nombre}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cat.items.map((item, ii) => (
              <label key={item.nombre} style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8,
                background: item.checked ? '#E1F5EE' : 'var(--color-background-secondary)',
                border: `0.5px solid ${item.checked ? '#9FE1CB' : 'var(--color-border-tertiary)'}`,
                transition: 'all 0.15s'
              }}>
                <input type="checkbox" checked={item.checked}
                  onChange={() => toggleItem(ci, ii)}
                  style={{ accentColor: '#1D9E75', width: 16, height: 16 }} />
                <span style={{
                  fontSize: 14, flex: 1,
                  color: item.checked ? '#0F6E56' : 'var(--color-text-primary)',
                  textDecoration: item.checked ? 'line-through' : 'none',
                }}>
                  {item.nombre}
                </span>
                <span style={{ fontSize: 12, color: '#888780' }}>{item.cantidad_g}g</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

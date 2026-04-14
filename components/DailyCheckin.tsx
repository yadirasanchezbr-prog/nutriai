'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const ESTADOS = [
  { v: 'muy_bien', label: 'Muy bien', color: '#1D9E75' },
  { v: 'bien',     label: 'Bien',     color: '#5DCAA5' },
  { v: 'regular',  label: 'Regular',  color: '#EF9F27' },
  { v: 'mal',      label: 'Mal',      color: '#D85A30' },
  { v: 'muy_mal',  label: 'Muy mal',  color: '#E24B4A' },
]

export default function DailyCheckin({ onComplete }: { onComplete?: () => void }) {
  const [hambre, setHambre]       = useState(5)
  const [energia, setEnergia]     = useState(5)
  const [digestion, setDigestion] = useState(5)
  const [estado, setEstado]       = useState('bien')
  const [nota, setNota]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  async function submit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('daily_checkins')
      .upsert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        hambre, energia, digestion, estado,
        nota: nota || null,
      }, { onConflict: 'user_id,date' })

    if (!error) {
      setDone(true)
      onComplete?.()
      if (new Date().getDay() === 0) {
        await fetch('/api/cron/weekly-reajuste', { method: 'POST' })
      }
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', background: '#E1F5EE', borderRadius: 12 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
        <p style={{ color: '#0F6E56', fontWeight: 500 }}>Check-in registrado</p>
        <p style={{ fontSize: 13, color: '#1D9E75', marginTop: 4 }}>Nuria actualizará tu plan si es necesario</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Slider label="Hambre" value={hambre} onChange={setHambre}
        low="Sin hambre" high="Mucha hambre" colorHigh="#E24B4A" />
      <Slider label="Energía" value={energia} onChange={setEnergia}
        low="Sin energía" high="Con energía" colorHigh="#1D9E75" />
      <Slider label="Digestión" value={digestion} onChange={setDigestion}
        low="Mal" high="Perfecta" colorHigh="#1D9E75" />

      <div>
        <p style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 8 }}>¿Cómo te has sentido?</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ESTADOS.map(e => (
            <button key={e.v} onClick={() => setEstado(e.v)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                border: `1px solid ${estado === e.v ? e.color : '#D3D1C7'}`,
                background: estado === e.v ? e.color + '20' : 'transparent',
                color: estado === e.v ? e.color : '#5F5E5A',
                fontWeight: estado === e.v ? 500 : 400,
              }}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={nota}
        onChange={e => setNota(e.target.value)}
        placeholder="Nota opcional para Nuria (síntomas, dudas...)"
        rows={2}
        style={{ fontSize: 13, padding: 10, borderRadius: 8, border: '1px solid #D3D1C7', resize: 'none' }}
      />

      <button onClick={submit} disabled={loading}
        style={{
          padding: '12px', borderRadius: 8,
          background: loading ? '#9FE1CB' : '#1D9E75',
          color: 'white', fontWeight: 500, fontSize: 14, border: 'none', cursor: 'pointer',
        }}>
        {loading ? 'Guardando...' : 'Registrar check-in'}
      </button>
    </div>
  )
}

function Slider({ label, value, onChange, low, high, colorHigh }:
  { label: string; value: number; onChange: (v: number) => void
    low: string; high: string; colorHigh: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: value > 7 ? colorHigh : '#1D9E75', fontWeight: 500 }}>
          {value}/10
        </span>
      </div>
      <input type="range" min={1} max={10} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ width: '100%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888780', marginTop: 2 }}>
        <span>{low}</span><span>{high}</span>
      </div>
    </div>
  )
}

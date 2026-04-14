'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Score = {
  score: number
  adherencia: number
  energia_media: number
  digestion_media: number
  week_start: string
  checkins_count: number
}

function ScoreRing({ score }: { score: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, score))
  const dash = (pct / 100) * circ
  const color = pct >= 70 ? '#1D9E75' : pct >= 45 ? '#EF9F27' : '#E24B4A'

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#E8E6E0" strokeWidth="8"/>
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="60" y="55" textAnchor="middle" fontSize="24" fontWeight="500" fill={color}>{Math.round(pct)}</text>
      <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#888780">/ 100</text>
    </svg>
  )
}

function MiniBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
        <span style={{ color: '#5F5E5A' }}>{label}</span>
        <span style={{ color, fontWeight: 500 }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 4, background: '#E8E6E0', borderRadius: 2 }}>
        <div style={{
          height: '100%', borderRadius: 2, background: color,
          width: `${Math.min(100, value)}%`,
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}

export default function NutriScoreCard() {
  const [current, setCurrent] = useState<Score | null>(null)
  const [prev, setPrev]       = useState<Score | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('weekly_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(2)
      if (data?.[0]) setCurrent(data[0])
      if (data?.[1]) setPrev(data[1])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ padding: 20, color: '#888780', fontSize: 13 }}>Cargando NutriScore...</div>

  if (!current) {
    return (
      <div style={{ padding: 16, background: '#F5F5F3', borderRadius: 12, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#888780' }}>
          Completa al menos 3 check-ins esta semana para ver tu NutriScore
        </p>
      </div>
    )
  }

  const diff = prev ? Math.round(current.score - prev.score) : null
  const scoreColor = current.score >= 70 ? '#1D9E75' : current.score >= 45 ? '#EF9F27' : '#E24B4A'
  const label = current.score >= 80 ? 'Excelente' : current.score >= 65 ? 'Muy bien' :
    current.score >= 50 ? 'En progreso' : 'Necesita ajustes'

  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <ScoreRing score={current.score} />
        <div>
          <p style={{ fontSize: 12, color: '#888780', marginBottom: 4 }}>NutriScore semanal</p>
          <p style={{ fontSize: 18, fontWeight: 500, color: scoreColor }}>{label}</p>
          {diff !== null && (
            <p style={{ fontSize: 12, marginTop: 4, color: diff >= 0 ? '#1D9E75' : '#E24B4A' }}>
              {diff >= 0 ? '+' : ''}{diff} vs semana anterior
            </p>
          )}
          <p style={{ fontSize: 11, color: '#888780', marginTop: 4 }}>
            {current.checkins_count}/7 check-ins completados
          </p>
        </div>
      </div>

      <MiniBar label="Adherencia al plan" value={current.adherencia} color="#1D9E75" />
      <MiniBar label="Energía media" value={current.energia_media} color="#378ADD" />
      <MiniBar label="Digestión media" value={current.digestion_media} color="#534AB7" />

      <p style={{ fontSize: 11, color: '#B4B2A9', marginTop: 12 }}>
        Semana del {new Date(current.week_start).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
      </p>
    </div>
  )
}

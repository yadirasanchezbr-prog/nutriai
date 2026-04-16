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

export default function NutriScoreCard() {
  const [current, setCurrent] = useState<Score | null>(null)
  const [prev, setPrev] = useState<Score | null>(null)
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

  if (loading) return (
    <p style={{ fontSize: 12, color: 'rgba(26,46,10,0.35)', fontWeight: 300, padding: '8px 0' }}>Cargando...</p>
  )

  if (!current) return (
    <p style={{ fontSize: 12, color: 'rgba(26,46,10,0.35)', fontWeight: 300, lineHeight: 1.6 }}>
      Completa 3 check-ins esta semana para ver tu NutriScore
    </p>
  )

  const diff = prev ? Math.round(current.score - prev.score) : null
  const scoreColor = current.score >= 70 ? '#5E8842' : current.score >= 45 ? '#A07830' : '#8B3020'
  const label = current.score >= 80 ? 'Excelente' : current.score >= 65 ? 'Muy bien' : current.score >= 50 ? 'En progreso' : 'Necesita ajustes'
  const r = 32
  const circ = 2 * Math.PI * r
  const dash = (Math.min(100, current.score) / 100) * circ

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ flexShrink: 0, filter: 'drop-shadow(0 4px 10px rgba(44,74,20,0.2))' }}>
          <defs>
            <linearGradient id="sg3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6B9248" />
              <stop offset="100%" stopColor="#A8CA70" />
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(94,136,66,0.1)" strokeWidth="6" />
          <circle cx="40" cy="40" r={r} fill="none" stroke="url(#sg3)" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
          <text x="40" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1A2E0A" fontFamily="var(--font-playfair, serif)">{Math.round(current.score)}</text>
          <text x="40" y="49" textAnchor="middle" fontSize="8" fill="rgba(26,46,10,0.35)" fontWeight="300">/100</text>
        </svg>
        <div>
          <p style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: 17, fontWeight: 600, color: scoreColor, fontStyle: 'italic', letterSpacing: '-0.3px' }}>{label}</p>
          {diff !== null && (
            <p style={{ fontSize: 10, marginTop: 4, color: diff >= 0 ? '#5E8842' : '#8B3020', fontWeight: 500 }}>
              {diff >= 0 ? '↑' : '↓'} {Math.abs(diff)} vs semana anterior
            </p>
          )}
          <p style={{ fontSize: 10, color: 'rgba(26,46,10,0.35)', marginTop: 4, fontWeight: 300 }}>
            {current.checkins_count}/7 check-ins
          </p>
        </div>
      </div>

      {[
        { label: 'Adherencia', value: current.adherencia, color: '#5E8842' },
        { label: 'Energía', value: current.energia_media, color: '#7AAA52' },
        { label: 'Digestión', value: current.digestion_media, color: '#9AC872' },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 4 }}>
            <span style={{ color: 'rgba(26,46,10,0.38)', fontWeight: 400 }}>{label}</span>
            <span style={{ color, fontWeight: 600 }}>{Math.round(value)}%</span>
          </div>
          <div style={{ height: 3, background: 'rgba(94,136,66,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, background: color, width: `${Math.min(100, value)}%`, transition: 'width 0.8s ease', boxShadow: `0 1px 4px ${color}70` }} />
          </div>
        </div>
      ))}

      <p style={{ fontSize: 9, color: 'rgba(26,46,10,0.28)', marginTop: 10, fontWeight: 300, letterSpacing: '0.04em' }}>
        Semana del {new Date(current.week_start).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
      </p>
    </div>
  )
}

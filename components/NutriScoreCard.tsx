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
  const [current, setCurrent] = useState<Score|null>(null)
  const [prev, setPrev] = useState<Score|null>(null)
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
    <p style={{ fontSize:12, color:'rgba(0,0,0,0.25)', fontWeight:300, padding:'8px 0' }}>Cargando...</p>
  )

  if (!current) return (
    <p style={{ fontSize:12, color:'rgba(0,0,0,0.3)', fontWeight:300, lineHeight:1.6 }}>
      Completa 3 check-ins esta semana para ver tu NutriScore
    </p>
  )

  const diff = prev ? Math.round(current.score - prev.score) : null
  const label = current.score>=80?'Excelente':current.score>=65?'Muy bien':current.score>=50?'En progreso':'Ajustando'
  const r = 30
  const circ = 2 * Math.PI * r
  const dash = (Math.min(100, current.score) / 100) * circ

  return (
    <div>
      {/* Ring + label */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink:0 }}>
          <defs>
            <linearGradient id="nsg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C6A96B"/>
              <stop offset="100%" stopColor="#E8D090"/>
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5"/>
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke="url(#nsg)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 36 36)"
            style={{ transition:'stroke-dasharray 1s ease' }}
          />
          <text x="36" y="33" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0B0B0B" fontFamily="Georgia,serif">
            {Math.round(current.score)}
          </text>
          <text x="36" y="44" textAnchor="middle" fontSize="7.5" fill="rgba(0,0,0,0.35)">
            /100
          </text>
        </svg>

        <div>
          <p style={{ fontFamily:'var(--font-playfair,Georgia,serif)', fontSize:15, fontWeight:600, color:'#5A4010', fontStyle:'italic', letterSpacing:'-0.3px' }}>
            {label}
          </p>
          {diff !== null && (
            <p style={{ fontSize:10, marginTop:4, color:diff>=0?'#7A5820':'rgba(180,60,60,0.7)', fontWeight:600 }}>
              {diff>=0?'↑':'↓'} {Math.abs(diff)} vs semana anterior
            </p>
          )}
          <p style={{ fontSize:10, color:'rgba(0,0,0,0.3)', marginTop:4, fontWeight:300 }}>
            {current.checkins_count}/7 check-ins
          </p>
        </div>
      </div>

      {/* Barras */}
      {[
        { label:'Adherencia', value:current.adherencia },
        { label:'Energía', value:current.energia_media },
        { label:'Digestión', value:current.digestion_media },
      ].map(({ label, value }) => (
        <div key={label} style={{ marginBottom:9 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, marginBottom:4 }}>
            <span style={{ color:'rgba(0,0,0,0.38)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</span>
            <span style={{ color:'#0B0B0B', fontWeight:700 }}>{Math.round(value)}%</span>
          </div>
          <div style={{ height:3, background:'rgba(0,0,0,0.07)', borderRadius:3, overflow:'hidden' }}>
            <div style={{
              height:'100%',
              borderRadius:3,
              background:'linear-gradient(90deg,#C6A96B,#E8D090)',
              width:`${Math.min(100,value)}%`,
              transition:'width 0.8s ease',
            }}/>
          </div>
        </div>
      ))}

      <p style={{ fontSize:9, color:'rgba(0,0,0,0.22)', marginTop:12, fontWeight:300, letterSpacing:'0.04em' }}>
        Semana del {new Date(current.week_start).toLocaleDateString('es-ES',{ day:'numeric', month:'short' })}
      </p>
    </div>
  )
}

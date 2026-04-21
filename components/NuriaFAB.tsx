'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function NuriaFAB() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState(false)

  if (pathname === '/chat') return null
  if (pathname === '/' || pathname === '/login' || pathname === '/registro' || pathname === '/planes') return null

  return (
    <Link
      href="/chat"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: hovered
          ? 'linear-gradient(145deg,#D4B87A,#8A6830)'
          : 'linear-gradient(145deg,#C6A96B,#8A7240)',
        color: 'white',
        padding: '12px 22px 12px 14px',
        borderRadius: 50,
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        boxShadow: hovered
          ? '0 12px 36px rgba(198,169,107,0.5),0 4px 12px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 8px 28px rgba(198,169,107,0.35),0 3px 8px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.18)',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'translateY(-2px) scale(1.04)' : 'translateY(0) scale(1)',
        letterSpacing: '0.01em',
        fontFamily: 'var(--font-instrument,-apple-system,sans-serif)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar Nuria */}
      <div style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '1.5px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}>
        <span style={{
          fontFamily: 'var(--font-playfair,Georgia,serif)',
          color: 'white',
          fontSize: 13,
          fontWeight: 700,
          fontStyle: 'italic',
        }}>N</span>
      </div>

      <span>Hablar con Nuria</span>

      {/* Pulse dot */}
      <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          animation: 'nuria-pulse 2.5s ease-in-out infinite',
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'white',
        }}/>
      </div>

      <style>{`
        @keyframes nuria-pulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </Link>
  )
}

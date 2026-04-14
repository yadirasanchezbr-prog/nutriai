'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NuriaFAB() {
  const pathname = usePathname()
  if (pathname === '/chat') return null

  return (
    <Link href="/chat"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#0F6E56',
        color: 'white',
        padding: '12px 20px',
        borderRadius: 50,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(15,110,86,0.35)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(15,110,86,0.45)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(15,110,86,0.35)'
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600,
      }}>N</div>
      Hablar con Nuria
    </Link>
  )
}

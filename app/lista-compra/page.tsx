'use client'
import Link from 'next/link'
import ListaCompra from '@/components/ListaCompra'

export default function ListaCompraPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto w-full max-w-2xl space-y-6">
        <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">
          ← Volver al dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-[#0F6E56]">Lista de la compra</h1>
          <p className="mt-1 text-neutral-500">Generada automáticamente de tu menú semanal</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-6">
          <ListaCompra />
        </div>
      </section>
    </main>
  )
}

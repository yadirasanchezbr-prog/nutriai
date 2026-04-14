import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'Falta user_id en query.' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  return NextResponse.json({ checkin: data ?? null })
}

export async function POST(request: Request) {
  const body = await request.json()
  const userId = body?.user_id as string | undefined
  if (!userId) return NextResponse.json({ error: 'Falta user_id en el body.' }, { status: 400 })

  const { data, error } = await supabase
    .from('daily_checkins')
    .upsert({
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      ...body,
    }, { onConflict: 'user_id,date' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ checkin: data })
}

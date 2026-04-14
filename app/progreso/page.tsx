"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { supabase } from "@/lib/supabase";
import NutriScoreCard from "@/components/NutriScoreCard";

type CheckInRow = {
  id: string;
  user_id: string;
  peso: number | null;
  energia: number | null;
  adherencia: string | null;
  nota: string | null;
  fecha: string | null;
  created_at: string | null;
};

type DailyCheckin = {
  id: string;
  date: string;
  hambre: number | null;
  energia: number | null;
  digestion: number | null;
  estado: string | null;
};

type WeeklyScore = {
  week_start: string;
  score: number;
  adherencia: number;
  energia_media: number;
  digestion_media: number;
  checkins_count: number;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <article className="rounded-xl border border-neutral-200 p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${color ?? "text-neutral-900"}`}>{value}</p>
      {sub ? <p className="mt-1 text-xs text-neutral-400">{sub}</p> : null}
    </article>
  );
}

export default function ProgresoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState("Tu objetivo personalizado");
  const [checkIns, setCheckIns] = useState<CheckInRow[]>([]);
  const [dailyCheckins, setDailyCheckins] = useState<DailyCheckin[]>([]);
  const [weeklyScores, setWeeklyScores] = useState<WeeklyScore[]>([]);

  useEffect(() => {
    async function load() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) { router.replace("/login"); return; }

      const [
        { data: profileData },
        { data: checkinRows },
        { data: dailyRows },
        { data: scoreRows },
      ] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id", userData.user.id).single(),
        supabase.from("weekly_checkins").select("*").eq("user_id", userData.user.id).order("fecha", { ascending: true }),
        supabase.from("daily_checkins").select("*").eq("user_id", userData.user.id).order("date", { ascending: true }).limit(30),
        supabase.from("weekly_scores").select("*").eq("user_id", userData.user.id).order("week_start", { ascending: true }).limit(12),
      ]);

      const nextGoal = profileData?.form_data?.main_goal;
      if (typeof nextGoal === "string" && nextGoal.trim()) setGoal(nextGoal);
      setCheckIns((checkinRows ?? []) as CheckInRow[]);
      setDailyCheckins((dailyRows ?? []) as DailyCheckin[]);
      setWeeklyScores((scoreRows ?? []) as WeeklyScore[]);
      setLoading(false);
    }
    load();
  }, [router]);

  const checkInsWithWeight = useMemo(() => checkIns.filter(i => typeof i.peso === "number"), [checkIns]);
  const weightInitial = checkInsWithWeight[0]?.peso ?? null;
  const weightCurrent = checkInsWithWeight[checkInsWithWeight.length - 1]?.peso ?? null;
  const weightDelta = typeof weightCurrent === "number" && typeof weightInitial === "number"
    ? Number((weightCurrent - weightInitial).toFixed(1)) : null;

  // Racha de días consecutivos
  const racha = useMemo(() => {
    if (!dailyCheckins.length) return 0;
    const dates = dailyCheckins.map(c => c.date).sort().reverse();
    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);
    for (const d of dates) {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      const diff = Math.round((current.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 1) { streak++; current = date; }
      else break;
    }
    return streak;
  }, [dailyCheckins]);

  const avgEnergia = useMemo(() => {
    const vals = dailyCheckins.map(c => c.energia).filter(Boolean) as number[];
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  }, [dailyCheckins]);

  const avgDigestion = useMemo(() => {
    const vals = dailyCheckins.map(c => c.digestion).filter(Boolean) as number[];
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  }, [dailyCheckins]);

  const weightChartData = useMemo(() =>
    checkInsWithWeight.slice(-10).map(i => ({
      date: formatDate(i.fecha ?? i.created_at),
      peso: i.peso,
    })), [checkInsWithWeight]);

  const scoreChartData = useMemo(() =>
    weeklyScores.map(s => ({
      date: formatDate(s.week_start),
      score: Math.round(s.score),
      energia: Math.round(s.energia_media),
      digestion: Math.round(s.digestion_media),
    })), [weeklyScores]);

  const dailyChartData = useMemo(() =>
    dailyCheckins.slice(-14).map(c => ({
      date: formatDate(c.date),
      energia: c.energia,
      digestion: c.digestion,
      hambre: c.hambre,
    })), [dailyCheckins]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-sm text-neutral-600">Cargando progreso...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto w-full max-w-5xl space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">
            ← Volver al dashboard
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[#0F6E56]">Tu progreso</h1>
          <p className="mt-1 text-neutral-500">Objetivo: {goal}</p>
        </div>

        {/* Métricas resumen */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <StatCard
            label="Peso actual"
            value={typeof weightCurrent === "number" ? `${weightCurrent.toFixed(1)} kg` : "-"}
          />
          <StatCard
            label="Cambio total"
            value={weightDelta === null ? "-" : `${weightDelta <= 0 ? "↓" : "↑"} ${Math.abs(weightDelta).toFixed(1)} kg`}
            color={weightDelta === null ? undefined : weightDelta <= 0 ? "text-[#0F6E56]" : "text-red-500"}
          />
          <StatCard
            label="Racha actual"
            value={racha > 0 ? `${racha} días` : "0 días"}
            sub="check-ins consecutivos"
            color={racha >= 7 ? "text-[#0F6E56]" : undefined}
          />
          <StatCard
            label="Check-ins totales"
            value={String(dailyCheckins.length)}
            sub={`Energía media: ${avgEnergia ?? "-"}/10`}
          />
        </div>

        {/* NutriScore */}
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">NutriScore esta semana</h2>
          <NutriScoreCard />
        </div>

        {/* Gráfica NutriScore histórico */}
        {scoreChartData.length >= 2 ? (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Histórico NutriScore semanal</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="NutriScore" stroke="#0F6E56" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="energia" name="Energía %" stroke="#378ADD" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="digestion" name="Digestión %" stroke="#534AB7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {/* Gráfica check-ins diarios */}
        {dailyChartData.length >= 3 ? (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Energía y digestión diaria (últimas 2 semanas)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="energia" name="Energía" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="digestion" name="Digestión" stroke="#534AB7" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="hambre" name="Hambre" stroke="#EF9F27" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {/* Gráfica peso */}
        {weightChartData.length >= 2 ? (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Evolución de peso</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="kg" domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="peso" name="Peso" stroke="#0F6E56" strokeWidth={3} dot={{ r: 4, fill: "#0F6E56" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {/* Historial check-ins diarios */}
        {dailyCheckins.length > 0 ? (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F6E56] mb-4">Historial de check-ins diarios</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="py-2 pr-4 font-medium">Fecha</th>
                    <th className="py-2 pr-4 font-medium">Hambre</th>
                    <th className="py-2 pr-4 font-medium">Energía</th>
                    <th className="py-2 pr-4 font-medium">Digestión</th>
                    <th className="py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[...dailyCheckins].reverse().map(c => (
                    <tr key={c.id} className="border-b border-neutral-100">
                      <td className="py-2 pr-4">{formatDate(c.date)}</td>
                      <td className="py-2 pr-4">{c.hambre ?? "-"}/10</td>
                      <td className="py-2 pr-4">{c.energia ?? "-"}/10</td>
                      <td className="py-2 pr-4">{c.digestion ?? "-"}/10</td>
                      <td className="py-2 capitalize">{c.estado?.replace("_", " ") ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-500">Completa tu primer check-in diario desde el dashboard para ver tu progreso aquí.</p>
            <Link href="/dashboard" className="mt-3 inline-block rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white">
              Ir al dashboard
            </Link>
          </div>
        )}

      </section>
    </main>
  );
}

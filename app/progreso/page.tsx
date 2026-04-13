"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/lib/supabase";

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

type NewCheckIn = {
  peso: string;
  energia: number;
  adherencia: string;
  nota: string;
};

const ENERGY_EMOJIS: Record<number, string> = {
  1: "😴",
  2: "😕",
  3: "🙂",
  4: "😊",
  5: "🔥",
};

const ADHERENCE_OPTIONS = ["Baja", "Media", "Alta", "Excelente"];

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ProgresoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goal, setGoal] = useState("Tu objetivo personalizado");
  const [checkIns, setCheckIns] = useState<CheckInRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState<NewCheckIn>({
    peso: "",
    energia: 3,
    adherencia: "Media",
    nota: "",
  });

  useEffect(() => {
    async function loadProgressPage() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const [{ data: profileData }, { data: checkinRows, error: checkinError }] = await Promise.all([
        supabase.from("profiles").select("form_data").eq("id", userData.user.id).single(),
        supabase
          .from("weekly_checkins")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("fecha", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true }),
      ]);

      if (checkinError) {
        setError("No se pudo cargar tu historial de check-ins.");
      }

      const nextGoal = profileData?.form_data?.main_goal;
      if (typeof nextGoal === "string" && nextGoal.trim().length > 0) {
        setGoal(nextGoal);
      }

      setCheckIns((checkinRows ?? []) as CheckInRow[]);
      setLoading(false);
    }

    loadProgressPage();
  }, [router]);

  const checkInsWithWeight = useMemo(
    () => checkIns.filter((item) => typeof item.peso === "number"),
    [checkIns],
  );

  const weightInitial = checkInsWithWeight[0]?.peso ?? null;
  const weightCurrent = checkInsWithWeight[checkInsWithWeight.length - 1]?.peso ?? null;
  const weightDelta =
    typeof weightCurrent === "number" && typeof weightInitial === "number"
      ? Number((weightCurrent - weightInitial).toFixed(1))
      : null;

  const totalWeeks = useMemo(() => {
    if (checkIns.length < 2) return checkIns.length === 1 ? 1 : 0;
    const firstDate = new Date(checkIns[0].fecha ?? checkIns[0].created_at ?? "");
    const lastDate = new Date(checkIns[checkIns.length - 1].fecha ?? checkIns[checkIns.length - 1].created_at ?? "");
    if (Number.isNaN(firstDate.getTime()) || Number.isNaN(lastDate.getTime())) return 0;
    const diffDays = Math.max(1, Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.max(1, Math.ceil(diffDays / 7));
  }, [checkIns]);

  const chartData = useMemo(() => {
    return checkInsWithWeight.slice(-8).map((item) => ({
      date: formatDate(item.fecha ?? item.created_at),
      peso: item.peso,
    }));
  }, [checkInsWithWeight]);

  async function handleSaveCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newCheckIn.peso) return;

    setSaving(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData.user;
      console.log("user:", user);

      if (userError || !user) {
        setSaving(false);
        router.replace("/login");
        return;
      }

      const payload = {
        user_id: user.id,
        peso: Number(newCheckIn.peso),
        energia: newCheckIn.energia,
        adherencia: newCheckIn.adherencia,
        nota: newCheckIn.nota.trim() || null,
        fecha: new Date().toISOString().slice(0, 10),
      };

      const { data, error: insertError } = await supabase.from("weekly_checkins").insert(payload).select("*").single();

      setSaving(false);

      if (insertError) {
        throw insertError;
      }

      setCheckIns((prev) => [...prev, data as CheckInRow]);
      setIsModalOpen(false);
      setNewCheckIn({
        peso: "",
        energia: 3,
        adherencia: "Media",
        nota: "",
      });
    } catch (error) {
      console.log("error completo:", JSON.stringify(error));
      setError("No se pudo guardar el check-in. Intentalo de nuevo.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-sm text-neutral-600">Cargando progreso...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:py-10">
      <section className="mx-auto w-full max-w-6xl">
        <Link href="/dashboard" className="text-sm font-medium text-[#0F6E56] hover:underline">
          ← Volver al dashboard
        </Link>

        <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#0F6E56]">Tu progreso</h1>
            <p className="mt-2 text-neutral-600">Objetivo actual: {goal}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-[#0F6E56] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d5f4a]"
          >
            Hacer check-in de hoy
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Peso actual</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900">
              {typeof weightCurrent === "number" ? `${weightCurrent.toFixed(1)} kg` : "-"}
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Peso inicial</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900">
              {typeof weightInitial === "number" ? `${weightInitial.toFixed(1)} kg` : "-"}
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Total perdido/ganado</p>
            <p
              className={`mt-2 text-2xl font-semibold ${
                weightDelta === null ? "text-neutral-900" : weightDelta <= 0 ? "text-[#0F6E56]" : "text-red-600"
              }`}
            >
              {weightDelta === null ? "-" : `${weightDelta <= 0 ? "↓" : "↑"} ${Math.abs(weightDelta).toFixed(1)} kg`}
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Semanas activo</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900">{totalWeeks}</p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-neutral-200 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[#0F6E56]">Evolucion de peso</h2>
          {chartData.length < 2 ? (
            <p className="mt-4 text-sm text-neutral-600">Completa tu primer check-in para ver tu progreso</p>
          ) : (
            <div className="mt-5 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="kg" domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="peso"
                    stroke="#0F6E56"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0F6E56" }}
                    activeDot={{ r: 7, fill: "#0F6E56" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-neutral-200 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[#0F6E56]">Historial de check-ins</h2>
          {checkIns.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-600">Aun no tienes check-ins registrados.</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="py-2 pr-4 font-medium">Fecha</th>
                    <th className="py-2 pr-4 font-medium">Peso</th>
                    <th className="py-2 pr-4 font-medium">Energia</th>
                    <th className="py-2 pr-4 font-medium">Adherencia</th>
                    <th className="py-2 font-medium">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {[...checkIns].reverse().map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100 align-top">
                      <td className="py-3 pr-4">{formatDate(item.fecha ?? item.created_at)}</td>
                      <td className="py-3 pr-4">
                        {typeof item.peso === "number" ? `${item.peso.toFixed(1)} kg` : "-"}
                      </td>
                      <td className="py-3 pr-4">
                        {item.energia ? `${ENERGY_EMOJIS[item.energia] ?? "🙂"} (${item.energia}/5)` : "-"}
                      </td>
                      <td className="py-3 pr-4">{item.adherencia ?? "-"}</td>
                      <td className="py-3 text-neutral-700">{item.nota?.trim() || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-[#0F6E56]">Check-in de hoy</h3>
            <form className="mt-5 space-y-4" onSubmit={handleSaveCheckIn}>
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-neutral-700">
                  Peso (kg)
                </label>
                <input
                  id="peso"
                  type="number"
                  min="0"
                  step="0.1"
                  value={newCheckIn.peso}
                  onChange={(event) => setNewCheckIn((prev) => ({ ...prev, peso: event.target.value }))}
                  required
                  className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Energia (1-5)</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const active = newCheckIn.energia === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setNewCheckIn((prev) => ({ ...prev, energia: level }))}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          active
                            ? "border-[#0F6E56] bg-emerald-50 text-[#0F6E56]"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {ENERGY_EMOJIS[level]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-700">Adherencia al plan</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ADHERENCE_OPTIONS.map((option) => {
                    const active = newCheckIn.adherencia === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setNewCheckIn((prev) => ({ ...prev, adherencia: option }))}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          active
                            ? "border-[#0F6E56] bg-emerald-50 text-[#0F6E56]"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="nota" className="block text-sm font-medium text-neutral-700">
                  Nota breve
                </label>
                <textarea
                  id="nota"
                  rows={3}
                  value={newCheckIn.nota}
                  onChange={(event) => setNewCheckIn((prev) => ({ ...prev, nota: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none ring-[#0F6E56] focus:ring-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d5f4a] disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

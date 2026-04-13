"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserState = {
  id: string;
  email: string;
};

type MenuData = {
  dias: Array<{
    dia: string;
    comida: { nombre: string; ingredientes: Array<{ nombre: string; cantidad_g: number }> };
    cena: { nombre: string; ingredientes: Array<{ nombre: string; cantidad_g: number }> };
  }>;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserState | null>(null);
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateSession() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      const currentUser = { id: data.user.id, email: data.user.email ?? "usuario@nutriai.com" };
      setUser(currentUser);

      const { data: menuRows, error: menuError } = await supabase
        .from("weekly_menus")
        .select("menu_data")
        .eq("user_id", data.user.id);

      if (menuError) {
        console.error("Error leyendo menu semanal:", menuError);
      } else if (menuRows && menuRows.length > 0) {
        const latestMenu = menuRows[menuRows.length - 1]?.menu_data as MenuData | undefined;
        if (latestMenu?.dias?.length) {
          setMenu(latestMenu);
        }
      }

      setLoading(false);
    }

    validateSession();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleGeneratePlan() {
    if (!user?.id) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generar-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "No se pudo generar el menu.");
        setGenerating(false);
        return;
      }

      setMenu(data.menu as MenuData);
      setGenerating(false);
    } catch (generateError) {
      console.error("Error invocando API generar-menu:", generateError);
      setError("Ha ocurrido un error al generar tu plan.");
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-sm text-neutral-600">Cargando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-neutral-200 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-[#0F6E56]">Bienvenido a NutriAI</h1>
        <p className="mt-3 text-neutral-700">Sesion iniciada como: {user?.email}</p>

        {!menu ? (
          <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
            <p className="text-sm text-neutral-700">Todavia no tienes un menu semanal generado.</p>
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={generating}
              className="mt-4 rounded-lg bg-[#0F6E56] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0d5f4a] disabled:opacity-60"
            >
              {generating ? "Generando plan..." : "Generar mi plan con Nuria"}
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-[#0F6E56]">Tu menu semanal</h2>
            <ul className="space-y-4">
              {menu.dias.map((dia) => (
                <li key={dia.dia} className="rounded-xl border border-neutral-200 p-5">
                  <h3 className="text-lg font-semibold text-neutral-900">{dia.dia}</h3>

                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <article className="rounded-lg bg-neutral-50 p-4">
                      <p className="font-medium text-[#0F6E56]">Comida: {dia.comida.nombre}</p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                        {dia.comida.ingredientes.map((ing) => (
                          <li key={`${dia.dia}-comida-${ing.nombre}`}>
                            {ing.nombre} - {ing.cantidad_g} g (crudo)
                          </li>
                        ))}
                      </ul>
                    </article>

                    <article className="rounded-lg bg-neutral-50 p-4">
                      <p className="font-medium text-[#0F6E56]">Cena: {dia.cena.nombre}</p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                        {dia.cena.ingredientes.map((ing) => (
                          <li key={`${dia.dia}-cena-${ing.nombre}`}>
                            {ing.nombre} - {ing.cantidad_g} g (crudo)
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8">
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg bg-[#0F6E56] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0d5f4a]"
          >
            Cerrar sesion
          </button>
        </div>
      </section>
    </main>
  );
}

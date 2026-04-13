"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateSession() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setLoading(false);
    }

    validateSession();
  }, [router]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const value = input.trim();
    if (!value || !userId || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: value,
        role: "user",
      },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje: value,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "No se pudo enviar el mensaje.");
        setIsTyping(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: data.respuesta,
          role: "assistant",
        },
      ]);
      setIsTyping(false);
    } catch (sendError) {
      console.error("Error enviando mensaje a /api/chat:", sendError);
      setError("Ha ocurrido un error enviando el mensaje.");
      setIsTyping(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-sm text-neutral-600">Cargando chat...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <section className="mx-auto flex h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-200 shadow-sm">
        <header className="border-b border-neutral-200 px-5 py-4">
          <h1 className="text-lg font-semibold text-[#0F6E56]">Chat con Nuria</h1>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <p className="text-sm text-neutral-500">Escribe tu primer mensaje para empezar.</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[85%] items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F6E56] text-xs font-semibold text-white">
                      N
                    </span>
                  ) : null}
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-[#0F6E56] text-white"
                        : "border border-neutral-200 bg-neutral-50 text-neutral-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F6E56] text-xs font-semibold text-white">
                  N
                </span>
                Nuria esta escribiendo...
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSend} className="border-t border-neutral-200 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d5f4a] disabled:opacity-60"
            >
              Enviar
            </button>
          </div>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}

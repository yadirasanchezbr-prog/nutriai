"use client";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

const SUGERENCIAS = [
  "¿Qué puedo comer si tengo hinchazón hoy?",
  "¿Puedo sustituir algo del menú de hoy?",
  "Tengo mucha hambre esta semana",
  "Dame ideas para el desayuno",
  "¿Qué hago si salgo a cenar fuera?",
];

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) { router.replace("/login"); return; }
      setUserId(data.user.id);

      // Cargar historial existente
      const { data: history } = await supabase
        .from("chat_history")
        .select("role, content")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: true })
        .limit(30);

      if (history && history.length > 0) {
        setMessages(history.map(h => ({
          id: crypto.randomUUID(),
          role: h.role as "user" | "assistant",
          content: h.content,
        })));
      } else {
        // Mensaje de bienvenida si no hay historial
        setMessages([{
          id: crypto.randomUUID(),
          role: "assistant",
          content: "¡Hola! Soy Nuria, tu nutricionista. Tengo tu perfil y tu menú de esta semana. ¿En qué puedo ayudarte hoy?",
        }]);
      }
      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(texto: string) {
    if (!texto.trim() || !userId || isTyping) return;
    setError(null);
    setMessages(prev => [...prev, { id: crypto.randomUUID(), content: texto, role: "user" }]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: texto, user_id: userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "No se pudo enviar el mensaje.");
        setIsTyping(false);
        return;
      }
      setMessages(prev => [...prev, { id: crypto.randomUUID(), content: data.respuesta, role: "assistant" }]);
    } catch {
      setError("Ha ocurrido un error enviando el mensaje.");
    }
    setIsTyping(false);
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(input);
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
      <section className="mx-auto flex h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-200 shadow-sm">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6E56]">
              <span className="text-sm font-semibold text-white">N</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[#0F6E56]">Nuria</h1>
              <p className="text-xs text-neutral-400">Nutricionista clínica · IA</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-xs font-medium text-neutral-400 hover:text-[#0F6E56]">
            ← Dashboard
          </Link>
        </header>

        {/* Mensajes */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[85%] items-end gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                {message.role === "assistant" ? (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F6E56]">
                    <span className="text-xs font-semibold text-white">N</span>
                  </div>
                ) : null}
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-[#0F6E56] text-white rounded-br-sm"
                    : "border border-neutral-200 bg-neutral-50 text-neutral-800 rounded-bl-sm"
                }`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isTyping ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F6E56]">
                  <span className="text-xs font-semibold text-white">N</span>
                </div>
                <div className="rounded-2xl rounded-bl-sm border border-neutral-200 bg-neutral-50 px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        {/* Sugerencias */}
        {messages.length <= 1 ? (
          <div className="border-t border-neutral-100 px-4 py-2">
            <p className="mb-2 text-xs text-neutral-400">Preguntas frecuentes:</p>
            <div className="flex flex-wrap gap-2">
              {SUGERENCIAS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-[#0F6E56] hover:text-[#0F6E56]">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-neutral-200 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje a Nuria..."
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-[#0F6E56] focus:ring-2"
            />
            <button type="submit" disabled={isTyping || !input.trim()}
              className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d5f4a] disabled:opacity-60">
              Enviar
            </button>
          </div>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </form>

      </section>
    </main>
  );
}

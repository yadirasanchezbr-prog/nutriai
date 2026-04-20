"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Message = { role: "user" | "assistant"; content: string; ts?: string };

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("tú");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUserId(data.user.id);
      const { data: profile } = await supabase.from("profiles").select("form_data").eq("id", data.user.id).single();
      if (profile?.form_data?.full_name) setUserName(profile.form_data.full_name.split(" ")[0]);
      const { data: history } = await supabase
        .from("chat_history")
        .select("role,content,created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: true })
        .limit(40);
      if (history?.length) {
        setMessages(history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content, ts: m.created_at })));
      } else {
        setMessages([{ role: "assistant", content: "Hola, soy Nuria. Estoy aquí para acompañarte en tu protocolo nutricional. ¿En qué puedo ayudarte hoy?", ts: new Date().toISOString() }]);
      }
    }
    init();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading || !userId) return;
    const userText = input.trim();
    const userMsg: Message = { role: "user", content: userText, ts: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: userText }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response ?? "No pude procesar tu mensaje.", ts: new Date().toISOString() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Hubo un error. Inténtalo de nuevo.", ts: new Date().toISOString() }]);
    }
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatTime(ts?: string) {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B0B", display: "flex", flexDirection: "column", fontFamily: "var(--font-instrument,-apple-system,sans-serif)", position: "relative", overflow: "hidden" }}>
      <style>{`
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .inp-chat{background:transparent;border:none;outline:none;resize:none;font-size:14px;color:#EDEDED;font-family:var(--font-instrument,-apple-system,sans-serif);font-weight:300;line-height:1.6;width:100%;max-height:120px;overflow-y:auto;scrollbar-width:none}
        .inp-chat::placeholder{color:rgba(237,237,237,0.2)}
        .inp-chat::-webkit-scrollbar{display:none}
        .msg-user{background:#FFFFFF;border-radius:18px 18px 4px 18px;padding:14px 18px;max-width:75%;align-self:flex-end;box-shadow:0 4px 20px rgba(0,0,0,0.5),0 1px 4px rgba(0,0,0,0.3)}
        .msg-nuria{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.08);border-radius:18px 18px 18px 4px;padding:14px 18px;max-width:80%;align-self:flex-start;position:relative}
        .msg-nuria::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(237,237,237,0.1) 50%,transparent);border-radius:18px 18px 0 0}
        .send-btn{width:40px;height:40px;border-radius:50%;background:#EDEDED;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),filter 0.2s ease}
        .send-btn:hover{transform:scale(1.08);filter:brightness(1.05)}
        .send-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none}
        .nav-link{font-size:12px;color:rgba(237,237,237,0.28);text-decoration:none;transition:color 0.2s ease}
        .nav-link:hover{color:rgba(237,237,237,0.6)}
        @keyframes typing{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}
        .dot{width:5px;height:5px;border-radius:50%;background:rgba(237,237,237,0.3);animation:typing 1.2s ease-in-out infinite}
        .dot:nth-child(2){animation-delay:0.15s}
        .dot:nth-child(3){animation-delay:0.3s}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(237,237,237,0.08);border-radius:2px}
      `}</style>

      <div style={{ position: "fixed", top: -100, right: -60, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(237,237,237,0.02),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -60, left: -40, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(198,169,107,0.025),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <nav style={{ borderBottom: "1px solid rgba(237,237,237,0.06)", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(11,11,11,0.95)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(198,169,107,0.35)" }}>
            <span className="sf" style={{ color: "white", fontSize: 13, fontWeight: 700, fontStyle: "italic" }}>N</span>
          </div>
          <span className="sf" style={{ fontSize: 16, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.3px" }}>NutriAI</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/bienestar" className="nav-link">Bienestar</Link>
          <Link href="/progreso" className="nav-link">Progreso</Link>
          <Link href="/lista-compra" className="nav-link">Lista compra</Link>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} style={{ background: "transparent", border: "1px solid rgba(237,237,237,0.1)", borderRadius: 9, color: "rgba(237,237,237,0.35)", fontWeight: 400, cursor: "pointer", fontFamily: "var(--font-instrument,sans-serif)", padding: "6px 14px", fontSize: 12 }}>
          Salir
        </button>
      </nav>

      <div style={{ display: "flex", flex: 1, paddingTop: 60, height: "100vh" }}>
        <div style={{ width: 280, borderRight: "1px solid rgba(237,237,237,0.06)", display: "flex", flexDirection: "column", padding: "24px 16px", background: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
          <div style={{ textAlign: "center", paddingBottom: 24, borderBottom: "1px solid rgba(237,237,237,0.06)", marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(198,169,107,0.25),0 0 0 4px rgba(198,169,107,0.08)" }}>
              <span className="sf" style={{ color: "white", fontSize: 26, fontWeight: 700, fontStyle: "italic" }}>N</span>
            </div>
            <p className="sf" style={{ fontSize: 18, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.4px", marginBottom: 4 }}>Nuria</p>
            <p style={{ fontSize: 11, color: "rgba(237,237,237,0.3)", fontWeight: 300, marginBottom: 10 }}>Nutricionista IA clínica</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, border: "1px solid rgba(237,237,237,0.08)", borderRadius: 20, padding: "3px 11px", background: "rgba(237,237,237,0.03)" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C6A96B", boxShadow: "0 0 6px rgba(198,169,107,0.9)" }} />
              <span style={{ fontSize: 10, color: "rgba(237,237,237,0.4)", fontWeight: 500 }}>Disponible 24h</span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(237,237,237,0.2)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>Nuria puede</p>
            {[
              ["◈", "Ajustar tu protocolo semanal"],
              ["✦", "Gestionar síntomas y digestión"],
              ["◉", "Modo restaurante · opciones fuera"],
              ["↗", "Apoyo emocional y adherencia"],
              ["◎", "Analizar tus check-ins"],
              ["◈", "Responder dudas nutricionales"],
            ].map(([ic, lb]) => (
              <div key={lb} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 9, marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: "rgba(198,169,107,0.45)", flexShrink: 0 }}>{ic}</span>
                <span style={{ fontSize: 12, color: "rgba(237,237,237,0.32)", fontWeight: 300, lineHeight: 1.4 }}>{lb}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(237,237,237,0.2)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>Accesos rápidos</p>
            {[
              ["◉", "Mi dashboard", "/dashboard"],
              ["✦", "Mi bienestar", "/bienestar"],
              ["↗", "Mi progreso", "/progreso"],
            ].map(([ic, lb, hr]) => (
              <Link key={lb} href={hr} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, background: "rgba(237,237,237,0.03)", border: "1px solid rgba(237,237,237,0.06)", marginBottom: 5, textDecoration: "none" }}>
                <span style={{ fontSize: 11, color: "rgba(237,237,237,0.3)" }}>{ic}</span>
                <span style={{ fontSize: 12, color: "rgba(237,237,237,0.4)", fontWeight: 300 }}>{lb}</span>
                <span style={{ color: "rgba(237,237,237,0.15)", fontSize: 12, marginLeft: "auto" }}>›</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ padding: "16px 28px", borderBottom: "1px solid rgba(237,237,237,0.06)", display: "flex", alignItems: "center", gap: 12, background: "rgba(0,0,0,0.15)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(198,169,107,0.25)" }}>
              <span className="sf" style={{ color: "white", fontSize: 15, fontWeight: 700, fontStyle: "italic" }}>N</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.2px" }}>Nuria</p>
              <p style={{ fontSize: 11, color: "rgba(237,237,237,0.28)", fontWeight: 300 }}>Nutricionista IA · Contexto completo de tu protocolo</p>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", paddingTop: 60 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(198,169,107,0.2)" }}>
                  <span className="sf" style={{ color: "white", fontSize: 22, fontWeight: 700, fontStyle: "italic" }}>N</span>
                </div>
                <p className="sf" style={{ fontSize: 20, fontWeight: 600, color: "rgba(237,237,237,0.6)", letterSpacing: "-0.5px", marginBottom: 8 }}>Hola, soy Nuria</p>
                <p style={{ fontSize: 14, color: "rgba(237,237,237,0.25)", fontWeight: 300 }}>Tu nutricionista IA. Pregúntame lo que necesites.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 4 }}>
                {msg.role === "assistant" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2, marginLeft: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="sf" style={{ color: "white", fontSize: 10, fontWeight: 700, fontStyle: "italic" }}>N</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Nuria</span>
                  </div>
                )}
                <div className={msg.role === "user" ? "msg-user" : "msg-nuria"}>
                  <p style={{ fontSize: 14, color: msg.role === "user" ? "#0B0B0B" : "rgba(237,237,237,0.75)", lineHeight: 1.75, fontWeight: msg.role === "user" ? 400 : 300, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                </div>
                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.15)", fontWeight: 300, marginTop: 1, marginLeft: msg.role === "user" ? 0 : 4, marginRight: msg.role === "user" ? 4 : 0 }}>{formatTime(msg.ts)}</p>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2, marginLeft: 4 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="sf" style={{ color: "white", fontSize: 10, fontWeight: 700, fontStyle: "italic" }}>N</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(198,169,107,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Nuria</span>
                </div>
                <div className="msg-nuria" style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div style={{ padding: "0 32px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["¿Cómo adaptas mi menú esta semana?", "Tengo hinchazón hoy", "¿Qué puedo comer en el restaurante?", "Necesito motivación"].map((s) => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }} style={{ padding: "7px 14px", border: "1px solid rgba(237,237,237,0.08)", borderRadius: 20, background: "rgba(237,237,237,0.03)", fontSize: 12, color: "rgba(237,237,237,0.38)", cursor: "pointer", fontFamily: "var(--font-instrument,sans-serif)", fontWeight: 300, transition: "border-color 0.2s ease,color 0.2s ease" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(237,237,237,0.06)", background: "rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, background: "rgba(237,237,237,0.04)", border: "1px solid rgba(237,237,237,0.1)", borderRadius: 18, padding: "12px 16px", transition: "border-color 0.2s ease" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Pregúntale algo a Nuria, ${userName}...`}
                rows={1}
                className="inp-chat"
                style={{ flex: 1 }}
              />
              <button onClick={handleSend} disabled={loading || !input.trim()} className="send-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8L2 2l2 6-2 6 12-6z" fill="#0B0B0B" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p style={{ fontSize: 10, color: "rgba(237,237,237,0.12)", textAlign: "center", marginTop: 10, fontWeight: 300, letterSpacing: "0.04em" }}>
              Nuria tiene acceso completo a tu protocolo, check-ins y biomarcadores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".rev").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Credenciales incorrectas."); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B0B", display: "flex", fontFamily: "var(--font-instrument,-apple-system,sans-serif)", position: "relative", overflow: "hidden" }}>
      <style>{`
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .rev{opacity:0;transform:translateY(24px);transition:opacity 0.9s cubic-bezier(0.16,1,0.3,1),transform 0.9s cubic-bezier(0.16,1,0.3,1)}
        .rev.vis{opacity:1;transform:translateY(0)}
        .d1{transition-delay:0.1s}.d2{transition-delay:0.2s}.d3{transition-delay:0.3s}
        .inp{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.1);border-radius:12px;padding:14px 18px;font-size:14px;color:#EDEDED;font-family:var(--font-instrument,-apple-system,sans-serif);outline:none;width:100%;transition:border-color 0.2s ease,background 0.2s ease;font-weight:300}
        .inp:focus{border-color:rgba(237,237,237,0.25);background:rgba(237,237,237,0.06)}
        .inp::placeholder{color:rgba(237,237,237,0.2)}
        .btn-main{background:#EDEDED;color:#0B0B0B;border:none;border-radius:13px;padding:15px 20px;font-size:14px;font-weight:700;cursor:pointer;width:100%;font-family:var(--font-instrument,-apple-system,sans-serif);letter-spacing:0.01em;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),filter 0.2s ease}
        .btn-main:hover{transform:translateY(-1px) scale(1.01);filter:brightness(1.05)}
        .btn-main:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        @keyframes pd{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        .gdot{animation:pd 3s ease-in-out infinite}
      `}</style>

      <div style={{ position: "absolute", top: -100, right: -80, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(237,237,237,0.025),transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(237,237,237,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(237,237,237,0.018) 1px,transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      {/* LEFT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 64px", borderRight: "1px solid rgba(237,237,237,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(145deg,#C6A96B,#8A7240)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(198,169,107,0.35)" }}>
            <span className="sf" style={{ color: "white", fontSize: 14, fontWeight: 700, fontStyle: "italic" }}>N</span>
          </div>
          <span className="sf" style={{ fontSize: 18, fontWeight: 600, color: "#EDEDED", letterSpacing: "-0.4px" }}>NutriAI</span>
        </div>

        <div className="rev" style={{ maxWidth: 480 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(237,237,237,0.1)", borderRadius: 50, padding: "5px 16px", marginBottom: 48 }}>
            <div className="gdot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#C6A96B", boxShadow: "0 0 8px rgba(198,169,107,0.9)" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(237,237,237,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Protocolo de nutrición clínica</span>
          </div>
          <h1 className="sf" style={{ fontSize: 60, fontWeight: 700, color: "#EDEDED", letterSpacing: "-2.5px", lineHeight: 0.95, marginBottom: 28 }}>
            Nutrición de<br />
            <em style={{ fontStyle: "italic", color: "#C6A96B" }}>precisión</em><br />
            para quienes<br />
            <span style={{ color: "rgba(237,237,237,0.35)" }}>buscan resultados</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(237,237,237,0.32)", lineHeight: 1.85, fontWeight: 300, maxWidth: 420 }}>
            Protocolos personalizados basados en biología, no en tendencias. Para quienes entienden que la transformación fisiológica requiere rigor.
          </p>
        </div>

        <div className="rev d2" style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(237,237,237,0.07)", paddingTop: 28 }}>
          {[["500+", "Protocolos activos"], ["+34", "Condiciones clínicas"], ["98%", "Adherencia"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, paddingRight: 24, borderRight: i < 2 ? "1px solid rgba(237,237,237,0.07)" : "none", paddingLeft: i > 0 ? 24 : 0 }}>
              <p className="sf" style={{ fontSize: 24, fontWeight: 700, color: "#EDEDED", letterSpacing: "-1px", lineHeight: 1 }}>{n}</p>
              <p style={{ fontSize: 10, color: "rgba(237,237,237,0.22)", marginTop: 5, fontWeight: 300, letterSpacing: "0.05em" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - form */}
      <div style={{ width: 500, display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 56px" }}>
        <div className="rev" style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(237,237,237,0.22)", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 16 }}>Acceso al sistema</p>
          <h2 className="sf" style={{ fontSize: 36, fontWeight: 700, color: "#EDEDED", letterSpacing: "-1.5px", lineHeight: 1.05, marginBottom: 8 }}>Bienvenida de vuelta</h2>
          <p style={{ fontSize: 14, color: "rgba(237,237,237,0.3)", fontWeight: 300 }}>Accede a tu protocolo personalizado.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="rev d1">
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(237,237,237,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required className="inp" />
          </div>

          <div className="rev d2">
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(237,237,237,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="inp" />
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(220,80,80,0.06)", border: "1px solid rgba(220,80,80,0.15)", borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: "rgba(220,80,80,0.7)", fontWeight: 300 }}>{error}</p>
            </div>
          )}

          <div className="rev d3" style={{ marginTop: 4 }}>
            <button type="submit" disabled={loading} className="btn-main">
              {loading ? "Accediendo..." : "Acceder al protocolo"}
            </button>
          </div>
        </form>

        <div className="rev d3" style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid rgba(237,237,237,0.07)" }}>
          <p style={{ fontSize: 13, color: "rgba(237,237,237,0.25)", fontWeight: 300, textAlign: "center" }}>
            ¿Aún no tienes acceso?{" "}
            <Link href="/registro" style={{ color: "rgba(237,237,237,0.55)", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid rgba(237,237,237,0.2)" }}>Solicitar evaluación</Link>
          </p>
          <p style={{ fontSize: 11, color: "rgba(237,237,237,0.15)", fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center", marginTop: 16 }}>Proceso de selección · Plazas limitadas</p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("nutriai-theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nutriai-theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === "light" ? "dark" : "light");
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

export const LIGHT = {
  bg: "radial-gradient(ellipse 80% 60% at 70% 10%,rgba(180,220,150,0.5) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 10% 80%,rgba(120,170,90,0.3) 0%,transparent 60%),linear-gradient(160deg,#B2CC9C 0%,#A4BF90 30%,#B8CFA6 60%,#9EBA8A 100%)",
  panel: { background:"linear-gradient(145deg,rgba(255,255,255,0.52),rgba(248,255,244,0.44) 50%,rgba(242,252,236,0.48))", backdropFilter:"blur(72px) saturate(220%) brightness(1.06)", WebkitBackdropFilter:"blur(72px) saturate(220%) brightness(1.06)", borderTop:"1px solid rgba(255,255,255,0.98)", borderLeft:"1px solid rgba(255,255,255,0.9)", borderRight:"1px solid rgba(255,255,255,0.75)", borderBottom:"1px solid rgba(255,255,255,0.6)", boxShadow:"0 1px 0 rgba(255,255,255,1) inset,0 60px 120px rgba(30,60,15,0.2),0 30px 60px rgba(30,60,15,0.14),0 15px 30px rgba(30,60,15,0.09)" },
  card: { background:"rgba(255,255,255,0.58)", backdropFilter:"blur(40px) saturate(180%)", WebkitBackdropFilter:"blur(40px) saturate(180%)", borderTop:"1px solid rgba(255,255,255,0.98)", borderLeft:"1px solid rgba(255,255,255,0.9)", borderRight:"1px solid rgba(255,255,255,0.7)", borderBottom:"1px solid rgba(255,255,255,0.55)", boxShadow:"0 8px 28px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)" },
  sidebar: { background:"rgba(255,255,255,0.15)" },
  text: { primary:"#1A2E0A", secondary:"rgba(26,46,10,0.55)", muted:"rgba(26,46,10,0.35)", label:"rgba(26,46,10,0.3)" },
  border: "0.5px solid rgba(80,120,50,0.08)",
  pill: { background:"rgba(255,255,255,0.72)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderTop:"1px solid rgba(255,255,255,1)", borderLeft:"1px solid rgba(255,255,255,0.9)", borderRight:"1px solid rgba(255,255,255,0.7)", borderBottom:"1px solid rgba(255,255,255,0.55)", borderRadius:50, boxShadow:"0 6px 20px rgba(30,60,15,0.09),inset 0 1px 0 rgba(255,255,255,1)" },
  btnM: { background:"linear-gradient(155deg,#5E8842,#3A5C1E)", border:"none", borderRadius:14, color:"white", fontWeight:500, cursor:"pointer", boxShadow:"0 6px 18px rgba(58,92,30,0.38),inset 0 1px 0 rgba(255,255,255,0.15)" },
  btnW: { background:"rgba(255,255,255,0.7)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderTop:"1px solid rgba(255,255,255,0.98)", borderBottom:"1px solid rgba(255,255,255,0.6)", borderLeft:"1px solid rgba(255,255,255,0.9)", borderRight:"1px solid rgba(255,255,255,0.6)", borderRadius:13, cursor:"pointer", boxShadow:"0 4px 14px rgba(30,60,15,0.08),inset 0 1px 0 rgba(255,255,255,1)", color:"#2A3E16", fontWeight:500 },
  matcha: { background:"linear-gradient(155deg,#5E8842,#3C6020 50%,#2C4A14)", borderTop:"1px solid rgba(180,240,140,0.2)", borderLeft:"1px solid rgba(180,240,140,0.12)", borderRight:"1px solid rgba(0,0,0,0.15)", borderBottom:"1px solid rgba(0,0,0,0.18)", boxShadow:"0 14px 36px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.14)" },
  dark: { background:"linear-gradient(155deg,rgba(38,58,24,0.94),rgba(24,40,12,0.97))", borderTop:"1px solid rgba(255,255,255,0.1)", borderLeft:"1px solid rgba(255,255,255,0.07)", borderRight:"1px solid rgba(0,0,0,0.2)", borderBottom:"1px solid rgba(0,0,0,0.25)", boxShadow:"0 20px 48px rgba(20,40,8,0.5),inset 0 1px 0 rgba(255,255,255,0.12)" },
  accentColor: "#3C6020",
  accentLight: "#5E8842",
};

export const DARK: typeof LIGHT = {
  bg: "radial-gradient(ellipse 80% 60% at 70% 10%,rgba(40,80,30,0.6) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 10% 80%,rgba(20,40,10,0.5) 0%,transparent 60%),linear-gradient(160deg,#0D1A08 0%,#111E0A 30%,#0F1C09 60%,#0A1506 100%)",
  panel: { background:"linear-gradient(145deg,rgba(20,36,12,0.88),rgba(16,28,8,0.92) 50%,rgba(12,22,6,0.9))", backdropFilter:"blur(72px) saturate(180%) brightness(0.9)", WebkitBackdropFilter:"blur(72px) saturate(180%) brightness(0.9)", borderTop:"1px solid rgba(255,255,255,0.08)", borderLeft:"1px solid rgba(255,255,255,0.06)", borderRight:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.03)", boxShadow:"0 1px 0 rgba(255,255,255,0.08) inset,0 60px 120px rgba(0,0,0,0.5),0 30px 60px rgba(0,0,0,0.4),0 15px 30px rgba(0,0,0,0.3)" },
  card: { background:"rgba(255,255,255,0.05)", backdropFilter:"blur(40px) saturate(160%)", WebkitBackdropFilter:"blur(40px) saturate(160%)", borderTop:"1px solid rgba(255,255,255,0.1)", borderLeft:"1px solid rgba(255,255,255,0.08)", borderRight:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.03)", boxShadow:"0 8px 28px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.08)" },
  sidebar: { background:"rgba(0,0,0,0.15)" },
  text: { primary:"rgba(220,240,210,0.92)", secondary:"rgba(200,230,180,0.55)", muted:"rgba(180,220,160,0.35)", label:"rgba(180,220,160,0.28)" },
  border: "0.5px solid rgba(180,220,140,0.08)",
  pill: { background:"rgba(255,255,255,0.07)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderTop:"1px solid rgba(255,255,255,0.1)", borderLeft:"1px solid rgba(255,255,255,0.08)", borderRight:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.03)", borderRadius:50, boxShadow:"0 6px 20px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.08)" },
  btnM: { background:"linear-gradient(155deg,#5E8842,#3A5C1E)", border:"none", borderRadius:14, color:"white", fontWeight:500, cursor:"pointer", boxShadow:"0 6px 18px rgba(58,92,30,0.5),inset 0 1px 0 rgba(255,255,255,0.15)" },
  btnW: { background:"rgba(255,255,255,0.08)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderTop:"1px solid rgba(255,255,255,0.1)", borderBottom:"1px solid rgba(255,255,255,0.04)", borderLeft:"1px solid rgba(255,255,255,0.08)", borderRight:"1px solid rgba(255,255,255,0.04)", borderRadius:13, cursor:"pointer", boxShadow:"0 4px 14px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.08)", color:"rgba(200,240,180,0.8)", fontWeight:500 },
  matcha: { background:"linear-gradient(155deg,#5E8842,#3C6020 50%,#2C4A14)", borderTop:"1px solid rgba(180,240,140,0.2)", borderLeft:"1px solid rgba(180,240,140,0.12)", borderRight:"1px solid rgba(0,0,0,0.15)", borderBottom:"1px solid rgba(0,0,0,0.18)", boxShadow:"0 14px 36px rgba(44,74,20,0.45),inset 0 1px 0 rgba(255,255,255,0.14)" },
  dark: { background:"linear-gradient(155deg,rgba(8,14,4,0.96),rgba(4,8,2,0.98))", borderTop:"1px solid rgba(255,255,255,0.08)", borderLeft:"1px solid rgba(255,255,255,0.05)", borderRight:"1px solid rgba(0,0,0,0.3)", borderBottom:"1px solid rgba(0,0,0,0.35)", boxShadow:"0 20px 48px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.08)" },
  accentColor: "#8AC870",
  accentLight: "#A8D888",
};

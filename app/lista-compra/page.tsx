"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Item = { id: string; nombre: string; cantidad: string; seccion: string; checked: boolean };

const SECCIONES = ["Proteínas","Verduras y hortalizas","Frutas","Cereales y legumbres","Lácteos y huevos","Grasas y aceites","Condimentos y especias","Otros"];

function generateId() { return Math.random().toString(36).slice(2,10); }

export default function ListaCompraPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [userId, setUserId] = useState<string|null>(null);
  const [nombre, setNombre] = useState("tú");
  const [nuevoItem, setNuevoItem] = useState("");
  const [nuevaSeccion, setNuevaSeccion] = useState("Otros");
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [filtro, setFiltro] = useState<string|null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.replace("/login"); return; }
      setUserId(data.user.id);
      const { data: profile } = await supabase.from("profiles").select("form_data").eq("id", data.user.id).single();
      if (profile?.form_data?.full_name) setNombre(profile.form_data.full_name.split(" ")[0]);
      const { data: lista } = await supabase.from("lista_compra").select("*").eq("user_id", data.user.id).order("seccion");
      if (lista?.length) {
        setItems(lista.map((i: { id: string; nombre: string; cantidad?: string; seccion?: string; checked?: boolean }) => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad ?? "", seccion: i.seccion ?? "Otros", checked: i.checked ?? false })));
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function toggleItem(id: string) {
    setItems(prev => prev.map(i => i.id===id ? {...i, checked:!i.checked} : i));
    const item = items.find(i=>i.id===id);
    if (item && userId) await supabase.from("lista_compra").update({ checked: !item.checked }).eq("id", id).eq("user_id", userId);
  }

  async function deleteItem(id: string) {
    setItems(prev => prev.filter(i=>i.id!==id));
    if (userId) await supabase.from("lista_compra").delete().eq("id", id).eq("user_id", userId);
  }

  async function addItem() {
    if (!nuevoItem.trim()||!userId) return;
    const newItem: Item = { id: generateId(), nombre: nuevoItem.trim(), cantidad: nuevaCantidad.trim(), seccion: nuevaSeccion, checked: false };
    setItems(prev => [...prev, newItem]);
    await supabase.from("lista_compra").insert({ id: newItem.id, user_id: userId, nombre: newItem.nombre, cantidad: newItem.cantidad, seccion: newItem.seccion, checked: false });
    setNuevoItem(""); setNuevaCantidad(""); setShowAdd(false);
  }

  async function clearChecked() {
    const checked = items.filter(i=>i.checked);
    setItems(prev => prev.filter(i=>!i.checked));
    if (userId) await Promise.all(checked.map(i=>supabase.from("lista_compra").delete().eq("id",i.id).eq("user_id",userId)));
  }

  async function generateFromMenu() {
    if (!userId) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/lista-compra", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:userId}) });
      const data = await res.json();
      if (data.items) {
        await supabase.from("lista_compra").delete().eq("user_id", userId);
        const newItems = data.items.map((i: { nombre: string; cantidad?: string; seccion?: string }) => ({ id: generateId(), nombre: i.nombre, cantidad: i.cantidad ?? "", seccion: i.seccion ?? "Otros", checked: false }));
        setItems(newItems);
        await supabase.from("lista_compra").insert(newItems.map((i: Item) => ({ ...i, user_id: userId })));
      }
    } catch { console.error("Error generando lista"); }
    setGenerating(false);
  }

  const seccionesConItems = SECCIONES.filter(s => items.some(i => i.seccion===s && (!filtro||filtro===s)));
  void seccionesConItems;
  void nombre;
  const pending = items.filter(i=>!i.checked).length;
  const total = items.length;

  if (loading) return (
    <main style={{minHeight:"100vh",background:"#0B0B0B",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"var(--font-instrument,sans-serif)",fontSize:13,color:"rgba(237,237,237,0.25)",fontWeight:300}}>Cargando lista...</p>
    </main>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0B", fontFamily:"var(--font-instrument,-apple-system,sans-serif)", color:"#EDEDED" }}>

      <style>{`
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .wc{background:#FFFFFF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.5),0 1px 4px rgba(0,0,0,0.3);position:relative;overflow:hidden}
        .dc{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.08);border-radius:16px;position:relative;overflow:hidden}
        .dc::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(237,237,237,0.1) 50%,transparent)}
        .nav-link{font-size:12px;color:rgba(237,237,237,0.28);text-decoration:none;transition:color 0.2s ease}
        .nav-link:hover{color:rgba(237,237,237,0.6)}
        .inp{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.1);border-radius:11px;padding:11px 14px;font-size:14px;color:#EDEDED;font-family:var(--font-instrument,sans-serif);outline:none;width:100%;transition:border-color 0.2s ease;font-weight:300}
        .inp:focus{border-color:rgba(237,237,237,0.25)}
        .inp::placeholder{color:rgba(237,237,237,0.2)}
        .inp-dark{background:rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.1);border-radius:11px;padding:10px 14px;font-size:13px;color:#0B0B0B;font-family:var(--font-instrument,sans-serif);outline:none;width:100%;transition:border-color 0.2s ease;font-weight:300}
        .inp-dark:focus{border-color:rgba(0,0,0,0.25)}
        .inp-dark::placeholder{color:rgba(0,0,0,0.3)}
        .btn-white{background:#EDEDED;color:#0B0B0B;border:none;border-radius:11px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-instrument,sans-serif);transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),filter 0.2s ease;letter-spacing:0.01em}
        .btn-white:hover{transform:translateY(-1px) scale(1.02);filter:brightness(1.05)}
        .btn-white:disabled{opacity:0.4;cursor:not-allowed;transform:none}
        .btn-ghost{background:transparent;border:1px solid rgba(237,237,237,0.1);border-radius:11px;padding:10px 18px;font-size:13px;color:rgba(237,237,237,0.45);cursor:pointer;font-family:var(--font-instrument,sans-serif);transition:border-color 0.2s ease,color 0.2s ease}
        .btn-ghost:hover{border-color:rgba(237,237,237,0.22);color:rgba(237,237,237,0.7)}
        .item-row{display:flex;align-items:center;gap:12;padding:11px 14px;border-radius:11px;transition:background 0.2s ease;cursor:pointer}
        .item-row:hover{background:rgba(237,237,237,0.03)}
        .checkbox{width:20px;height:20px;border-radius:6px;border:1.5px solid rgba(237,237,237,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s ease;cursor:pointer}
        .checkbox.checked{background:#EDEDED;border-color:#EDEDED}
        .checkbox-dark{width:20px;height:20px;border-radius:6px;border:1.5px solid rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s ease;cursor:pointer;background:rgba(0,0,0,0.04)}
        .checkbox-dark.checked{background:#0B0B0B;border-color:#0B0B0B}
        .delete-btn{opacity:0;transition:opacity 0.2s ease;background:transparent;border:none;cursor:pointer;color:rgba(237,237,237,0.3);font-size:14px;padding:2px 6px;border-radius:5px}
        .item-row:hover .delete-btn{opacity:1}
        .delete-btn-dark{opacity:0;transition:opacity 0.2s ease;background:transparent;border:none;cursor:pointer;color:rgba(0,0,0,0.25);font-size:14px;padding:2px 6px;border-radius:5px}
        .seccion-row:hover .delete-btn-dark{opacity:1}
        .filtro-btn{padding:6px 14px;border-radius:20px;cursor:pointer;font-size:12px;font-family:var(--font-instrument,sans-serif);border:1px solid rgba(237,237,237,0.08);background:transparent;color:rgba(237,237,237,0.35);transition:all 0.2s ease;font-weight:400}
        .filtro-btn.on{background:#FFFFFF;color:#0B0B0B;border-color:transparent;font-weight:600}
        select{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.1);border-radius:11px;padding:11px 14px;font-size:14px;color:#EDEDED;font-family:var(--font-instrument,sans-serif);outline:none;width:100%}
        select option{background:#1A1A1A;color:#EDEDED}
      `}</style>

      <div style={{position:"fixed",top:-100,right:-60,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(237,237,237,0.02),transparent 65%)",pointerEvents:"none",zIndex:0}}/>

      {/* NAV */}
      <nav style={{borderBottom:"1px solid rgba(237,237,237,0.06)",padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(11,11,11,0.95)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",position:"fixed",top:0,left:0,right:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(198,169,107,0.35)"}}>
            <span className="sf" style={{color:"white",fontSize:13,fontWeight:700,fontStyle:"italic"}}>N</span>
          </div>
          <span className="sf" style={{fontSize:16,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.3px"}}>NutriAI</span>
        </div>
        <div style={{display:"flex",gap:20,alignItems:"center"}}>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/chat" className="nav-link">Nuria</Link>
          <Link href="/bienestar" className="nav-link">Bienestar</Link>
          <Link href="/progreso" className="nav-link">Progreso</Link>
        </div>
        <button onClick={async()=>{await supabase.auth.signOut();router.push("/login");}} style={{background:"transparent",border:"1px solid rgba(237,237,237,0.1)",borderRadius:9,color:"rgba(237,237,237,0.35)",cursor:"pointer",fontFamily:"var(--font-instrument,sans-serif)",padding:"6px 14px",fontSize:12}}>
          Salir
        </button>
      </nav>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"92px 24px 64px"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:32}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:12}}>Semana actual</p>
            <h1 className="sf" style={{fontSize:40,fontWeight:700,color:"#EDEDED",letterSpacing:"-1.5px",lineHeight:1}}>
              Lista de la compra
            </h1>
            {total>0 && (
              <p style={{fontSize:14,color:"rgba(237,237,237,0.28)",marginTop:8,fontWeight:300}}>
                <span style={{color:"#EDEDED",fontWeight:500}}>{pending}</span> pendientes · {total-pending} completados
              </p>
            )}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {items.some(i=>i.checked) && (
              <button onClick={clearChecked} className="btn-ghost" style={{fontSize:12}}>
                Limpiar completados
              </button>
            )}
            <button onClick={()=>setShowAdd(!showAdd)} className="btn-ghost">
              {showAdd?"Cancelar":"+ Añadir item"}
            </button>
            <button onClick={generateFromMenu} disabled={generating} className="btn-white">
              {generating?"Generando...":"Generar del menú"}
            </button>
          </div>
        </div>

        {/* Filtros por sección */}
        {total>0 && (
          <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
            <button onClick={()=>setFiltro(null)} className={`filtro-btn ${!filtro?"on":""}`}>Todos</button>
            {SECCIONES.filter(s=>items.some(i=>i.seccion===s)).map(s=>(
              <button key={s} onClick={()=>setFiltro(filtro===s?null:s)} className={`filtro-btn ${filtro===s?"on":""}`}>{s}</button>
            ))}
          </div>
        )}

        {/* Añadir item */}
        {showAdd && (
          <div className="dc" style={{padding:"22px 22px",marginBottom:20}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:16}}>Nuevo item</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 120px 180px",gap:10,marginBottom:12}}>
              <input value={nuevoItem} onChange={e=>setNuevoItem(e.target.value)} placeholder="Nombre del producto" className="inp"
                onKeyDown={e=>e.key==="Enter"&&addItem()}/>
              <input value={nuevaCantidad} onChange={e=>setNuevaCantidad(e.target.value)} placeholder="Cantidad" className="inp"/>
              <select value={nuevaSeccion} onChange={e=>setNuevaSeccion(e.target.value)}>
                {SECCIONES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={addItem} className="btn-white" disabled={!nuevoItem.trim()}>Añadir</button>
          </div>
        )}

        {/* Lista vacía */}
        {total===0 && !generating && (
          <div style={{textAlign:"center",padding:"80px 40px",border:"1px dashed rgba(237,237,237,0.07)",borderRadius:20}}>
            <p className="sf" style={{fontSize:24,fontWeight:600,color:"rgba(237,237,237,0.25)",letterSpacing:"-0.5px",marginBottom:12,fontStyle:"italic"}}>Sin lista todavía</p>
            <p style={{fontSize:14,color:"rgba(237,237,237,0.18)",fontWeight:300,marginBottom:28}}>Genera tu lista desde el menú semanal o añade items manualmente</p>
            <button onClick={generateFromMenu} disabled={generating} className="btn-white" style={{padding:"13px 32px",fontSize:14}}>
              Generar lista del menú
            </button>
          </div>
        )}

        {/* Items agrupados por sección */}
        {total>0 && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {SECCIONES.filter(s=>(!filtro||filtro===s)&&items.some(i=>i.seccion===s)).map(seccion=>{
              const seccionItems = items.filter(i=>i.seccion===seccion);
              const seccionPending = seccionItems.filter(i=>!i.checked).length;
              const allDone = seccionPending===0;

              return (
                <div key={seccion} className={allDone?"dc":"wc"} style={{padding:"22px 20px"}}>
                  {!allDone && <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#C6A96B,transparent)",borderRadius:"16px 16px 0 0"}}/>}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <p style={{fontSize:11,fontWeight:700,color:allDone?"rgba(237,237,237,0.22)":"rgba(0,0,0,0.4)",textTransform:"uppercase",letterSpacing:"0.12em"}}>{seccion}</p>
                    <span style={{fontSize:10,color:allDone?"rgba(237,237,237,0.2)":"rgba(0,0,0,0.3)",fontWeight:300}}>{seccionPending}/{seccionItems.length}</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {seccionItems.map(item=>(
                      <div key={item.id} className={allDone?"item-row":"seccion-row"} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 10px",borderRadius:10,cursor:"pointer",transition:"background 0.2s ease"}}
                        onClick={()=>toggleItem(item.id)}>
                        <div className={`${allDone?"checkbox":"checkbox-dark"} ${item.checked?"checked":""}`}>
                          {item.checked && <span style={{color:allDone?"#0B0B0B":"white",fontSize:11,fontWeight:700}}>✓</span>}
                        </div>
                        <div style={{flex:1}}>
                          <p style={{fontSize:13,fontWeight:item.checked?300:500,color:item.checked?(allDone?"rgba(237,237,237,0.25)":"rgba(0,0,0,0.3)"):(allDone?"rgba(237,237,237,0.65)":"#0B0B0B"),textDecoration:item.checked?"line-through":"none",transition:"all 0.2s ease"}}>{item.nombre}</p>
                          {item.cantidad && <p style={{fontSize:10,color:allDone?"rgba(237,237,237,0.2)":"rgba(0,0,0,0.32)",fontWeight:300,marginTop:1}}>{item.cantidad}</p>}
                        </div>
                        <button className={allDone?"delete-btn":"delete-btn-dark"} onClick={e=>{e.stopPropagation();deleteItem(item.id);}}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progreso total */}
        {total>0 && (
          <div style={{marginTop:20,display:"flex",alignItems:"center",gap:16}}>
            <div style={{flex:1,height:3,background:"rgba(237,237,237,0.07)",borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${((total-pending)/total)*100}%`,height:"100%",background:"#EDEDED",borderRadius:2,transition:"width 0.4s ease"}}/>
            </div>
            <p style={{fontSize:12,color:"rgba(237,237,237,0.25)",fontWeight:300,whiteSpace:"nowrap"}}>
              {total-pending} de {total} completados
            </p>
          </div>
        )}

        {/* Nuria tip */}
        <div style={{marginTop:20,background:"rgba(237,237,237,0.03)",border:"1px solid rgba(198,169,107,0.12)",borderRadius:16,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.25) 50%,transparent)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span className="sf" style={{color:"white",fontSize:10,fontWeight:700,fontStyle:"italic"}}>N</span>
            </div>
            <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.45)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Nuria · Consejo de compra</p>
          </div>
          <p className="sf" style={{fontSize:13,color:"rgba(237,237,237,0.38)",lineHeight:1.75,fontStyle:"italic"}}>
            &quot;Compra primero las proteínas y verduras - son la base de tu protocolo. Los alimentos de temporada tienen mayor densidad nutricional y mejor perfil antiinflamatorio.&quot;
          </p>
        </div>

      </div>
    </div>
  );
}

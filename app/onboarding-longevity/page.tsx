"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PASOS = ["Perfil vital","Biomarcadores","Estilo de vida","Metabolismo","Sueño y estrés","Suplementación","Entorno","Protocolo"];

const OBJETIVOS_LONGEVITY = [
  { id:"edad_biologica", titulo:"Reducir edad biológica", desc:"Revertir el envejecimiento celular medido" },
  { id:"energia_vital", titulo:"Maximizar energía vital", desc:"Optimizar mitocondrias y vitalidad diaria" },
  { id:"prevencion", titulo:"Prevención de enfermedad", desc:"Reducir riesgo de patologías crónicas" },
  { id:"rendimiento", titulo:"Rendimiento cognitivo", desc:"Proteger función cerebral a largo plazo" },
  { id:"composicion", titulo:"Composición corporal óptima", desc:"Mantener músculo y reducir grasa visceral" },
  { id:"inflamacion", titulo:"Control inflamación sistémica", desc:"Reducir marcadores inflamatorios crónicos" },
];

const BIOMARCADORES = ["Glucosa en ayunas","HbA1c (hemoglobina glicosilada)","Insulina en ayunas","PCR ultrasensible","Homocisteína","Vitamina D","Vitamina B12","Ferritina","TSH / T3 / T4","Colesterol HDL / LDL","Triglicéridos","Testosterona total","DHEA-S","IGF-1","Cortisol","Apoliproteína B","Omega-3 índice","Telómeros (longitud)","Ninguno medido"];

const SEÑALES_ENVEJECIMIENTO = ["Fatiga crónica sin causa","Recuperación lenta tras ejercicio","Niebla mental / falta de foco","Pérdida de masa muscular","Aumento de grasa abdominal","Piel menos elástica / arrugas","Cabello con canas prematuras","Articulaciones rígidas o dolorosas","Libido reducida","Sueño poco reparador","Memoria a corto plazo reducida","Digestión más lenta","Ninguna"];

const SUPLEMENTOS_LONGEVITY = ["NMN (nicotinamida mononucleótido)","NR (nicotinamida ribósido)","Resveratrol","Quercetina","Berberina","Metformina (prescrita)","CoQ10 / Ubiquinol","Espermidina","Astaxantina","Magnesio glicinato","Omega-3 EPA/DHA","Vitamina D3 + K2","Zinc","Selenio","Glicina","NAC (N-acetil cisteína)","Rapamicina (prescrita)","Ninguno"];

const HABITOS_POSITIVOS = ["Ayuno intermitente (16:8 o más)","Restricción calórica moderada","Ejercicio de fuerza regular","Ejercicio cardiovascular regular","Sauna regular (3+ veces/semana)","Exposición al frío (crioterapia)","Meditación o mindfulness","Buena higiene del sueño","Dieta mediterránea o similar","Sin tabaco","Alcohol mínimo o nulo","Control activo de estrés"];

const EXPOSICIONES_RIESGO = ["Estrés crónico elevado","Exposición a tóxicos ambientales","Trabajo nocturno o turnos","Sedentarismo prolongado","Dieta ultra procesada habitual","Tabaco activo o pasivo","Alcohol frecuente","Contaminación urbana alta","Uso frecuente de plásticos","Déficit crónico de sueño","Ninguna significativa"];

export default function OnboardingLongevityPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string|null>(null);

  // Paso 0 - Perfil vital
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [objetivoLongevity, setObjetivoLongevity] = useState("");
  const [edadBiologicaEstimada, setEdadBiologicaEstimada] = useState("");
  const [expectativaVida, setExpectativaVida] = useState("");

  // Paso 1 - Biomarcadores
  const [biomarcadoresActuales, setBiomarcadoresActuales] = useState<string[]>([]);
  const [glucosa, setGlucosa] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [pcr, setPcr] = useState("");
  const [vitaminaD, setVitaminaD] = useState("");
  const [homocisteina, setHomocisteina] = useState("");
  const [igf1, setIgf1] = useState("");
  const [otrosBio, setOtrosBio] = useState("");

  // Paso 2 - Estilo de vida
  const [habitosPositivos, setHabitosPositivos] = useState<string[]>([]);
  const [exposicionesRiesgo, setExposicionesRiesgo] = useState<string[]>([]);
  const [señalesEnvejecimiento, setSeñalesEnvejecimiento] = useState<string[]>([]);

  // Paso 3 - Metabolismo
  const [tipoAlimentacion, setTipoAlimentacion] = useState("");
  const [ayunoHoras, setAyunoHoras] = useState("");
  const [restriccionCalorica, setRestriccionCalorica] = useState("");
  const [alimentosBase, setAlimentosBase] = useState("");
  const [alimentosEvitar, setAlimentosEvitar] = useState("");
  const [intolerancias, setIntolerancias] = useState("");

  // Paso 4 - Sueño y estrés
  const [horasSueno, setHorasSueno] = useState("");
  const [calidadSueno, setCalidadSueno] = useState(7);
  const [horaAcostar, setHoraAcostar] = useState("");
  const [nivelEstres, setNivelEstres] = useState(5);
  const [tecnicasEstres, setTecnicasEstres] = useState<string[]>([]);
  const [vrcs, setVrcs] = useState("");

  // Paso 5 - Suplementación
  const [suplementosActuales, setSuplementosActuales] = useState<string[]>([]);
  const [medicacionActual, setMedicacionActual] = useState("");
  const [protocolo_previo, setProtocoloPrevio] = useState("");

  // Paso 6 - Entorno
  const [ciudad, setCiudad] = useState("");
  const [calidadAire, setCalidadAire] = useState("");
  const [aguaConsumo, setAguaConsumo] = useState("");
  const [exposicionSol, setExposicionSol] = useState("");
  const [actividadSocial, setActividadSocial] = useState("");
  const [propositoVida, setPropositoVida] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.replace("/login"); return; }
      setUserId(data.user.id);
      const { data: profile } = await supabase.from("profiles").select("form_data").eq("id", data.user.id).single();
      if (profile?.form_data?.full_name) setNombre(profile.form_data.full_name);
    }
    load();
  }, [router]);

  function toggleArr(arr: string[], set: (v:string[])=>void, val: string) {
    set(arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]);
  }

  async function handleFinish() {
    if (!userId) return;
    setSaving(true);
    const longevityData = {
      full_name:nombre, edad, sexo, peso_kg:peso, altura_cm:altura,
      objetivo_longevity:objetivoLongevity,
      edad_biologica_estimada:edadBiologicaEstimada,
      expectativa_vida:expectativaVida,
      biomarcadores_actuales:biomarcadoresActuales,
      glucosa_ayunas:glucosa, hba1c, pcr_ultrasensible:pcr,
      vitamina_d:vitaminaD, homocisteina, igf1, otros_biomarcadores:otrosBio,
      habitos_positivos:habitosPositivos,
      exposiciones_riesgo:exposicionesRiesgo,
      señales_envejecimiento:señalesEnvejecimiento,
      tipo_alimentacion:tipoAlimentacion, ayuno_horas:ayunoHoras,
      restriccion_calorica:restriccionCalorica,
      alimentos_base:alimentosBase, alimentos_evitar:alimentosEvitar,
      intolerancias,
      horas_sueno:horasSueno, calidad_sueno:calidadSueno,
      hora_acostar:horaAcostar, nivel_estres:nivelEstres,
      tecnicas_estres:tecnicasEstres, variabilidad_cardiaca:vrcs,
      suplementos_actuales:suplementosActuales,
      medicacion_actual:medicacionActual,
      protocolo_longevity_previo:protocolo_previo,
      ciudad, calidad_aire:calidadAire, agua_consumo:aguaConsumo,
      exposicion_sol:exposicionSol, actividad_social:actividadSocial,
      proposito_vida:propositoVida,
      plan:"longevity",
    };
    await supabase.from("profiles").upsert({
      id:userId,
      form_data:{ ...longevityData },
      longevity_data:longevityData,
      updated_at:new Date().toISOString()
    });
    router.push("/dashboard");
  }

  const imc = peso && altura ? (parseFloat(peso)/Math.pow(parseFloat(altura)/100,2)).toFixed(1) : null;
  const progreso = (paso/PASOS.length)*100;

  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0B", color:"#EDEDED", fontFamily:"var(--font-instrument,-apple-system,sans-serif)" }}>
      <style>{`
        *{box-sizing:border-box}
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .inp{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.1);border-radius:12px;padding:13px 16px;font-size:14px;color:#EDEDED;font-family:var(--font-instrument,sans-serif);outline:none;width:100%;transition:border-color 0.2s ease;font-weight:300;line-height:1.5}
        .inp:focus{border-color:rgba(237,237,237,0.28)}
        .inp::placeholder{color:rgba(237,237,237,0.2)}
        textarea.inp{resize:none}
        select.inp{cursor:pointer}
        select.inp option{background:#1A1A1A;color:#EDEDED}
        label{font-size:11px;font-weight:600;color:rgba(237,237,237,0.3);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px}
        .chip{padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px;font-family:var(--font-instrument,sans-serif);border:1px solid rgba(237,237,237,0.08);background:transparent;color:rgba(237,237,237,0.38);transition:all 0.2s ease;font-weight:300}
        .chip.on{background:#EDEDED;color:#0B0B0B;border-color:transparent;font-weight:600}
        .chip.gold.on{background:linear-gradient(145deg,#C6A96B,#8A7240);color:white;border-color:transparent}
        .chip:hover:not(.on){border-color:rgba(237,237,237,0.18);color:rgba(237,237,237,0.65)}
        .obj-card{border:1px solid rgba(237,237,237,0.08);border-radius:16px;padding:20px 18px;cursor:pointer;transition:all 0.25s ease;background:transparent;width:100%;text-align:left}
        .obj-card:hover{border-color:rgba(237,237,237,0.2);background:rgba(237,237,237,0.03)}
        .obj-card.on{background:#EDEDED;border-color:transparent}
        .btn-next{background:#EDEDED;color:#0B0B0B;border:none;border-radius:13px;padding:14px 36px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font-instrument,sans-serif);letter-spacing:0.01em;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),filter 0.2s ease}
        .btn-next:hover{transform:translateY(-1px) scale(1.02);filter:brightness(1.05)}
        .btn-next:disabled{opacity:0.4;cursor:not-allowed;transform:none}
        .btn-back{background:transparent;color:rgba(237,237,237,0.35);border:1px solid rgba(237,237,237,0.1);border-radius:13px;padding:14px 24px;font-size:14px;font-weight:400;cursor:pointer;font-family:var(--font-instrument,sans-serif);transition:all 0.2s ease}
        .btn-back:hover{border-color:rgba(237,237,237,0.22);color:rgba(237,237,237,0.65)}
        .slider{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(237,237,237,0.1);outline:none}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#EDEDED;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.5)}
        .act-btn{border:1px solid rgba(237,237,237,0.08);border-radius:12px;padding:12px 16px;cursor:pointer;text-align:left;transition:all 0.2s ease;background:transparent;width:100%;font-family:var(--font-instrument,sans-serif)}
        .act-btn.on{background:#EDEDED;border-color:transparent}
        .fade-in{animation:fi 0.5s cubic-bezier(0.16,1,0.3,1)}
        @keyframes fi{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .gold-border{border-color:rgba(198,169,107,0.2)!important}
        .gold-accent{color:#C6A96B}
      `}</style>

      {/* Ambient */}
      <div style={{position:"fixed",top:-100,right:-80,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(198,169,107,0.04),transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:-80,left:-60,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(198,169,107,0.025),transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(237,237,237,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(237,237,237,0.015) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none"}}/>

      {/* HEADER */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:50,background:"rgba(11,11,11,0.97)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderBottom:"1px solid rgba(198,169,107,0.1)"}}>
        <div style={{maxWidth:720,margin:"0 auto",padding:"18px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(198,169,107,0.4)"}}>
                <span className="sf" style={{color:"white",fontSize:13,fontWeight:700,fontStyle:"italic"}}>N</span>
              </div>
              <span className="sf" style={{fontSize:16,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.3px"}}>NutriAI</span>
              <div style={{display:"inline-flex",alignItems:"center",gap:5,border:"1px solid rgba(198,169,107,0.2)",borderRadius:20,padding:"2px 10px",marginLeft:8,background:"rgba(198,169,107,0.06)"}}>
                <span style={{fontSize:9,fontWeight:600,color:"#C6A96B",letterSpacing:"0.08em",textTransform:"uppercase"}}>Longevity</span>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:10,fontWeight:600,color:"rgba(198,169,107,0.4)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:2}}>Evaluación Longevity</p>
              <p style={{fontSize:12,color:"rgba(237,237,237,0.45)",fontWeight:300}}>{PASOS[paso]}</p>
            </div>
          </div>
          {/* Barra dorada */}
          <div style={{height:2,background:"rgba(237,237,237,0.06)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#C6A96B,#E8D090)",borderRadius:2,width:`${progreso}%`,transition:"width 0.5s cubic-bezier(0.16,1,0.3,1)"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
            {PASOS.map((_,i)=>(
              <button key={i} onClick={()=>i<paso&&setPaso(i)} style={{background:"none",border:"none",cursor:i<paso?"pointer":"default",padding:4}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:i<paso?"#C6A96B":i===paso?"rgba(198,169,107,0.7)":"rgba(237,237,237,0.1)",transform:i===paso?"scale(1.3)":"scale(1)",transition:"all 0.3s ease",boxShadow:i===paso?"0 0 8px rgba(198,169,107,0.6)":"none"}}/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{maxWidth:720,margin:"0 auto",padding:"130px 24px 80px",position:"relative",zIndex:1}}>

        {/* PASO 0 - Perfil vital */}
        {paso===0 && (
          <div className="fade-in">
            <div style={{display:"inline-flex",alignItems:"center",gap:7,border:"1px solid rgba(198,169,107,0.2)",borderRadius:50,padding:"4px 14px",marginBottom:24,background:"rgba(198,169,107,0.05)"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#C6A96B",boxShadow:"0 0 8px rgba(198,169,107,0.9)"}}/>
              <span style={{fontSize:10,fontWeight:600,color:"rgba(198,169,107,0.7)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Plan Longevity · Evaluación avanzada</span>
            </div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Paso 1 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Tu perfil<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>vital</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,lineHeight:1.75,marginBottom:48,maxWidth:520}}>
              El plan Longevity requiere una evaluación más profunda que un protocolo estándar. Esta información es la base de tu estrategia de optimización biológica.
            </p>

            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <label>Nombre completo</label>
                <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre" className="inp"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                <div>
                  <label>Edad cronológica</label>
                  <input type="number" value={edad} onChange={e=>setEdad(e.target.value)} placeholder="45" className="inp"/>
                </div>
                <div>
                  <label>Sexo biológico</label>
                  <select value={sexo} onChange={e=>setSexo(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
                <div>
                  <label>Edad biológica estimada</label>
                  <input type="number" value={edadBiologicaEstimada} onChange={e=>setEdadBiologicaEstimada(e.target.value)} placeholder="38" className="inp"/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Peso (kg)</label>
                  <input type="number" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="72" className="inp"/>
                </div>
                <div>
                  <label>Altura (cm)</label>
                  <input type="number" value={altura} onChange={e=>setAltura(e.target.value)} placeholder="175" className="inp"/>
                </div>
              </div>

              {imc && (
                <div style={{padding:"18px 22px",background:"rgba(198,169,107,0.05)",border:"1px solid rgba(198,169,107,0.15)",borderRadius:14,display:"flex",gap:24,alignItems:"center",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.3) 50%,transparent)"}}/>
                  <div>
                    <p style={{fontSize:9,color:"rgba(198,169,107,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,fontWeight:600}}>IMC</p>
                    <p className="sf" style={{fontSize:32,fontWeight:700,color:"#EDEDED",letterSpacing:"-1px",lineHeight:1}}>{imc}</p>
                  </div>
                  <div style={{width:1,height:40,background:"rgba(198,169,107,0.15)"}}/>
                  <div>
                    <p style={{fontSize:14,color:"rgba(237,237,237,0.55)",fontWeight:400,marginBottom:4}}>
                      {parseFloat(imc)<18.5?"Bajo peso · riesgo sarcopenia":parseFloat(imc)<25?"Normopeso · óptimo para longevidad":parseFloat(imc)<27?"Normopeso alto · vigilar grasa visceral":"Por encima del óptimo para longevidad"}
                    </p>
                    <p style={{fontSize:11,color:"rgba(237,237,237,0.2)",fontWeight:300}}>El IMC ideal para longevidad es 22-25</p>
                  </div>
                </div>
              )}

              <div>
                <label>Objetivo principal en longevidad</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:8}}>
                  {OBJETIVOS_LONGEVITY.map(obj=>(
                    <button key={obj.id} onClick={()=>setObjetivoLongevity(obj.id)} className={`obj-card ${objetivoLongevity===obj.id?"on":""}`}>
                      <p style={{fontSize:14,fontWeight:600,color:objetivoLongevity===obj.id?"#0B0B0B":"#EDEDED",marginBottom:4}}>{obj.titulo}</p>
                      <p style={{fontSize:12,color:objetivoLongevity===obj.id?"rgba(0,0,0,0.5)":"rgba(237,237,237,0.3)",fontWeight:300,lineHeight:1.5}}>{obj.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 1 - Biomarcadores */}
        {paso===1 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Paso 2 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Tus<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>biomarcadores</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40,maxWidth:520}}>
              Los biomarcadores son la base científica del plan Longevity. Si tienes analíticas recientes, introduce los valores. Si no, Nuria te recomendará cuáles pedir.
            </p>

            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div>
                <label>Biomarcadores que has medido recientemente</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                  {BIOMARCADORES.map(b=>(
                    <button key={b} onClick={()=>toggleArr(biomarcadoresActuales,setBiomarcadoresActuales,b)} className={`chip ${biomarcadoresActuales.includes(b)?"on":""}`}>{b}</button>
                  ))}
                </div>
              </div>

              <div style={{background:"rgba(237,237,237,0.03)",border:"1px solid rgba(237,237,237,0.08)",borderRadius:16,padding:"22px 20px"}}>
                <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:16}}>Introduce tus valores si los tienes</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label>Glucosa en ayunas (mg/dL)</label>
                    <input type="text" value={glucosa} onChange={e=>setGlucosa(e.target.value)} placeholder="85" className="inp"/>
                  </div>
                  <div>
                    <label>HbA1c (%)</label>
                    <input type="text" value={hba1c} onChange={e=>setHba1c(e.target.value)} placeholder="5.2" className="inp"/>
                  </div>
                  <div>
                    <label>PCR ultrasensible (mg/L)</label>
                    <input type="text" value={pcr} onChange={e=>setPcr(e.target.value)} placeholder="0.8" className="inp"/>
                  </div>
                  <div>
                    <label>Vitamina D (ng/mL)</label>
                    <input type="text" value={vitaminaD} onChange={e=>setVitaminaD(e.target.value)} placeholder="45" className="inp"/>
                  </div>
                  <div>
                    <label>Homocisteína (μmol/L)</label>
                    <input type="text" value={homocisteina} onChange={e=>setHomocisteina(e.target.value)} placeholder="8" className="inp"/>
                  </div>
                  <div>
                    <label>IGF-1 (ng/mL)</label>
                    <input type="text" value={igf1} onChange={e=>setIgf1(e.target.value)} placeholder="150" className="inp"/>
                  </div>
                </div>
                <div style={{marginTop:14}}>
                  <label>Otros biomarcadores con valores</label>
                  <textarea value={otrosBio} onChange={e=>setOtrosBio(e.target.value)} placeholder="Ej: testosterona 520 ng/dL, triglicéridos 85 mg/dL, HDL 68 mg/dL..." rows={3} className="inp"/>
                </div>
              </div>

              <div style={{padding:"16px 20px",background:"rgba(198,169,107,0.04)",border:"1px solid rgba(198,169,107,0.12)",borderRadius:14,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.25) 50%,transparent)"}}/>
                <p style={{fontSize:12,color:"rgba(198,169,107,0.55)",fontWeight:400,lineHeight:1.7}}>
                  💡 <strong style={{fontWeight:600}}>Si no tienes analíticas recientes:</strong> Nuria te recomendará un panel de biomarcadores específico para longevidad y te explicará cómo solicitarlo a tu médico.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2 - Estilo de vida */}
        {paso===2 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Paso 3 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Hábitos y<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>señales de envejecimiento</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>El estilo de vida es el mayor determinante del envejecimiento biológico — más que la genética.</p>

            <div style={{display:"flex",flexDirection:"column",gap:28}}>
              <div>
                <label>Hábitos positivos que practicas actualmente</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                  {HABITOS_POSITIVOS.map(h=>(
                    <button key={h} onClick={()=>toggleArr(habitosPositivos,setHabitosPositivos,h)} className={`chip ${habitosPositivos.includes(h)?"on":""}`}>{h}</button>
                  ))}
                </div>
                {habitosPositivos.length>0 && (
                  <div style={{marginTop:12,padding:"12px 16px",background:"rgba(237,237,237,0.03)",border:"1px solid rgba(237,237,237,0.07)",borderRadius:11}}>
                    <p style={{fontSize:12,color:"rgba(237,237,237,0.35)",fontWeight:300}}>{habitosPositivos.length} hábitos positivos identificados — base sólida para el protocolo</p>
                  </div>
                )}
              </div>

              <div>
                <label>Exposiciones de riesgo presentes en tu vida</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                  {EXPOSICIONES_RIESGO.map(e=>(
                    <button key={e} onClick={()=>toggleArr(exposicionesRiesgo,setExposicionesRiesgo,e)} className={`chip ${exposicionesRiesgo.includes(e)?"on":""}`}>{e}</button>
                  ))}
                </div>
              </div>

              <div>
                <label>Señales de envejecimiento que notas en ti</label>
                <p style={{fontSize:12,color:"rgba(237,237,237,0.2)",fontWeight:300,marginBottom:10}}>Estas señales ayudan a identificar qué sistemas biológicos necesitan más atención</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {SEÑALES_ENVEJECIMIENTO.map(s=>(
                    <button key={s} onClick={()=>toggleArr(señalesEnvejecimiento,setSeñalesEnvejecimiento,s)} className={`chip ${señalesEnvejecimiento.includes(s)?"on":""}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3 - Metabolismo */}
        {paso===3 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Paso 4 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Estrategia<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>metabólica</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>La restricción calórica y el ayuno son las intervenciones de longevidad con más evidencia científica.</p>

            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <label>Tipo de alimentación base</label>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:6}}>
                  {["Mediterránea · alta evidencia longevidad","Plant-based / vegetal · alta evidencia","Cetogénica / low-carb · evidencia mixta","Carnívora / proteína alta · evidencia limitada","Ayuno prolongado (OMAD, 36h+)","Sin protocolo definido"].map(t=>(
                    <button key={t} onClick={()=>setTipoAlimentacion(t)} className={`act-btn ${tipoAlimentacion===t?"on":""}`}>
                      <span style={{fontSize:13,fontWeight:tipoAlimentacion===t?600:300,color:tipoAlimentacion===t?"#0B0B0B":"rgba(237,237,237,0.45)"}}>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Ventana de ayuno habitual</label>
                  <select value={ayunoHoras} onChange={e=>setAyunoHoras(e.target.value)} className="inp">
                    <option value="">Sin ayuno estructurado</option>
                    <option value="12:12">12:12 (básico)</option>
                    <option value="16:8">16:8 (intermitente)</option>
                    <option value="18:6">18:6 (avanzado)</option>
                    <option value="20:4">20:4 / OMAD</option>
                    <option value="36h">Ayuno prolongado 36h+</option>
                    <option value="5:2">Protocolo 5:2</option>
                  </select>
                </div>
                <div>
                  <label>Restricción calórica aproximada</label>
                  <select value={restriccionCalorica} onChange={e=>setRestriccionCalorica(e.target.value)} className="inp">
                    <option value="">Sin restricción</option>
                    <option value="10">10% bajo mantenimiento</option>
                    <option value="20">20% bajo mantenimiento</option>
                    <option value="30">30% bajo mantenimiento (CR avanzada)</option>
                    <option value="variable">Variable según día</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Alimentos base de tu dieta actual</label>
                <textarea value={alimentosBase} onChange={e=>setAlimentosBase(e.target.value)} placeholder="Ej: verduras de hoja verde, aceite de oliva, pescado azul, legumbres, frutos rojos, nueces..." rows={3} className="inp"/>
              </div>

              <div>
                <label>Alimentos que evitas o quieres eliminar</label>
                <input value={alimentosEvitar} onChange={e=>setAlimentosEvitar(e.target.value)} placeholder="Ej: azúcar refinado, ultraprocesados, aceites de semillas..." className="inp"/>
              </div>

              <div>
                <label>Intolerancias o restricciones alimentarias</label>
                <input value={intolerancias} onChange={e=>setIntolerancias(e.target.value)} placeholder="Ej: gluten, lactosa, histamina..." className="inp"/>
              </div>
            </div>
          </div>
        )}

        {/* PASO 4 - Sueño y estrés */}
        {paso===4 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Paso 5 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Sueño y<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>manejo del estrés</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>El sueño deficiente acelera el envejecimiento más que cualquier otro factor. El estrés crónico acorta los telómeros.</p>

            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Horas de sueño habituales</label>
                  <select value={horasSueno} onChange={e=>setHorasSueno(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="menos5">Menos de 5h · riesgo alto</option>
                    <option value="5-6">5-6h · subóptimo</option>
                    <option value="6-7">6-7h · límite</option>
                    <option value="7-8">7-8h · óptimo</option>
                    <option value="8-9">8-9h · muy bueno</option>
                    <option value="mas9">Más de 9h · investigar causa</option>
                  </select>
                </div>
                <div>
                  <label>Hora habitual de acostarte</label>
                  <select value={horaAcostar} onChange={e=>setHoraAcostar(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="antes22">Antes de las 22h</option>
                    <option value="22-23">22-23h · óptimo circadiano</option>
                    <option value="23-00">23h-00h</option>
                    <option value="00-01">00-01h</option>
                    <option value="despues01">Después de la 1h</option>
                  </select>
                </div>
              </div>

              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <label style={{margin:0}}>Calidad subjetiva del sueño</label>
                  <span className="sf" style={{fontSize:24,fontWeight:700,color:"#EDEDED",letterSpacing:"-0.5px"}}>{calidadSueno}<span style={{fontSize:13,color:"rgba(237,237,237,0.3)",fontWeight:300}}>/10</span></span>
                </div>
                <input type="range" min={1} max={10} value={calidadSueno} onChange={e=>setCalidadSueno(parseInt(e.target.value))} className="slider"/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Muy mala</span>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Excelente</span>
                </div>
              </div>

              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <label style={{margin:0}}>Nivel de estrés crónico</label>
                  <span className="sf" style={{fontSize:24,fontWeight:700,color:"#EDEDED",letterSpacing:"-0.5px"}}>{nivelEstres}<span style={{fontSize:13,color:"rgba(237,237,237,0.3)",fontWeight:300}}>/10</span></span>
                </div>
                <input type="range" min={1} max={10} value={nivelEstres} onChange={e=>setNivelEstres(parseInt(e.target.value))} className="slider"/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Sin estrés</span>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Estrés extremo</span>
                </div>
              </div>

              <div>
                <label>Técnicas de manejo del estrés que practicas</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                  {["Meditación / Mindfulness","Respiración diafragmática","Yoga","Tiempo en naturaleza","Journaling","Terapia psicológica","Sauna","Baño frío","Ejercicio como válvula","Ninguna","Otras"].map(t=>(
                    <button key={t} onClick={()=>toggleArr(tecnicasEstres,setTecnicasEstres,t)} className={`chip ${tecnicasEstres.includes(t)?"on":""}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <label>Variabilidad de la frecuencia cardíaca (HRV) — si la mides</label>
                <input type="text" value={vrcs} onChange={e=>setVrcs(e.target.value)} placeholder="Ej: HRV media 45ms (Oura / Whoop / Apple Watch)" className="inp"/>
              </div>
            </div>
          </div>
        )}

        {/* PASO 5 - Suplementación */}
        {paso===5 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Paso 6 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Suplementación<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>actual</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>Saber qué tomas permite a Nuria personalizar el protocolo sin duplicar o contraindical.</p>

            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div>
                <label>Suplementos de longevidad que tomas actualmente</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                  {SUPLEMENTOS_LONGEVITY.map(s=>(
                    <button key={s} onClick={()=>toggleArr(suplementosActuales,setSuplementosActuales,s)} className={`chip ${suplementosActuales.includes(s)?"on":""}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label>Medicación prescrita actual</label>
                <textarea value={medicacionActual} onChange={e=>setMedicacionActual(e.target.value)} placeholder="Ej: metformina 500mg/día, levotiroxina 50mcg..." rows={3} className="inp"/>
              </div>

              <div>
                <label>¿Has seguido algún protocolo de longevity antes?</label>
                <textarea value={protocolo_previo} onChange={e=>setProtocoloPrevio(e.target.value)} placeholder="Describe qué has probado y con qué resultados: ej. protocolo Bryan Johnson, dieta CALERIE, ayuno prolongado periódico..." rows={4} className="inp"/>
              </div>
            </div>
          </div>
        )}

        {/* PASO 6 - Entorno */}
        {paso===6 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Paso 7 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Entorno y<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>propósito vital</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>
              Las Zonas Azules demuestran que el entorno social y el propósito de vida son factores críticos de longevidad.
            </p>

            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Ciudad / región</label>
                  <input value={ciudad} onChange={e=>setCiudad(e.target.value)} placeholder="Madrid, Barcelona, zona rural..." className="inp"/>
                </div>
                <div>
                  <label>Calidad del aire donde vives</label>
                  <select value={calidadAire} onChange={e=>setCalidadAire(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="muy_buena">Muy buena · zona rural/montaña</option>
                    <option value="buena">Buena · ciudad pequeña</option>
                    <option value="moderada">Moderada · ciudad media</option>
                    <option value="mala">Mala · gran ciudad contaminada</option>
                  </select>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Agua que consumes</label>
                  <select value={aguaConsumo} onChange={e=>setAguaConsumo(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="grifo">Del grifo</option>
                    <option value="filtrada">Filtrada (osmosis / carbón)</option>
                    <option value="embotellada">Embotellada</option>
                    <option value="mineralizada">Mineralización alta</option>
                  </select>
                </div>
                <div>
                  <label>Exposición solar diaria</label>
                  <select value={exposicionSol} onChange={e=>setExposicionSol(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="muy_poca">Muy poca · interior todo el día</option>
                    <option value="poca">Poca · menos de 15 min</option>
                    <option value="moderada">Moderada · 15-30 min</option>
                    <option value="buena">Buena · 30-60 min</option>
                    <option value="mucha">Mucha · más de 1h al aire libre</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Actividad social y conexiones</label>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:6}}>
                  {["Muy activa · familia, amigos, comunidad cercana","Moderada · relaciones sociales regulares","Limitada · pocas conexiones profundas","Aislamiento relativo · trabajo desde casa","Solitaria · poca interacción social"].map(a=>(
                    <button key={a} onClick={()=>setActividadSocial(a)} className={`act-btn ${actividadSocial===a?"on":""}`}>
                      <span style={{fontSize:13,fontWeight:actividadSocial===a?600:300,color:actividadSocial===a?"#0B0B0B":"rgba(237,237,237,0.45)"}}>{a}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Propósito de vida o Ikigai</label>
                <p style={{fontSize:12,color:"rgba(237,237,237,0.2)",fontWeight:300,marginBottom:10}}>Las personas con propósito claro viven estadísticamente más. Cuéntanos el tuyo.</p>
                <textarea value={propositoVida} onChange={e=>setPropositoVida(e.target.value)} placeholder="Ej: quiero ver crecer a mis nietos, tengo una misión profesional que me apasiona, cuido de mi comunidad..." rows={4} className="inp"/>
              </div>
            </div>
          </div>
        )}

        {/* PASO 7 - Protocolo */}
        {paso===7 && (
          <div className="fade-in">
            <div style={{display:"inline-flex",alignItems:"center",gap:7,border:"1px solid rgba(198,169,107,0.2)",borderRadius:50,padding:"4px 14px",marginBottom:24,background:"rgba(198,169,107,0.05)"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#C6A96B",boxShadow:"0 0 8px rgba(198,169,107,0.9)"}}/>
              <span style={{fontSize:10,fontWeight:600,color:"rgba(198,169,107,0.7)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Evaluación completa</span>
            </div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:14}}>Último paso</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Tu protocolo<br/><em style={{fontStyle:"italic",color:"#C6A96B"}}>Longevity</em> está listo
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:48,maxWidth:520}}>
              Nuria ha procesado toda tu evaluación avanzada. Generará tu protocolo de optimización biológica personalizado.
            </p>

            {/* Resumen */}
            <div style={{background:"rgba(237,237,237,0.03)",border:"1px solid rgba(237,237,237,0.08)",borderRadius:20,padding:"28px",marginBottom:28,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(237,237,237,0.1) 50%,transparent)"}}/>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:20}}>Resumen de evaluación</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  ["Nombre",nombre||"—"],
                  ["Edad cronológica / biológica",edad?`${edad} años / ${edadBiologicaEstimada||"?"}años estimados`:"—"],
                  ["Peso / Altura / IMC",peso&&altura?`${peso}kg · ${altura}cm · IMC ${imc}`:"—"],
                  ["Objetivo",OBJETIVOS_LONGEVITY.find(o=>o.id===objetivoLongevity)?.titulo||"—"],
                  ["Biomarcadores medidos",biomarcadoresActuales.length>0?`${biomarcadoresActuales.length} registrados`:"Sin datos"],
                  ["Tipo alimentación",tipoAlimentacion||"—"],
                  ["Ayuno",ayunoHoras||"Sin protocolo"],
                  ["Hábitos positivos",habitosPositivos.length>0?`${habitosPositivos.length} identificados`:"—"],
                  ["Señales envejecimiento",señalesEnvejecimiento.length>0?`${señalesEnvejecimiento.length} detectadas`:"Ninguna"],
                  ["Suplementación actual",suplementosActuales.length>0?`${suplementosActuales.length} suplementos`:"Ninguna"],
                  ["Calidad sueño",`${calidadSueno}/10`],
                  ["Nivel estrés",`${nivelEstres}/10`],
                ].map(([k,v])=>(
                  <div key={k} style={{padding:"11px 0",borderBottom:"1px solid rgba(237,237,237,0.05)"}}>
                    <p style={{fontSize:9,color:"rgba(237,237,237,0.22)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{k}</p>
                    <p style={{fontSize:13,color:"rgba(237,237,237,0.6)",fontWeight:300}}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nuria Longevity */}
            <div style={{background:"rgba(198,169,107,0.05)",border:"1px solid rgba(198,169,107,0.18)",borderRadius:18,padding:"24px",marginBottom:36,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.4) 50%,transparent)"}}/>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:12}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 8px rgba(198,169,107,0.35)"}}>
                  <span className="sf" style={{color:"white",fontSize:12,fontWeight:700,fontStyle:"italic"}}>N</span>
                </div>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.6)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Nuria · Protocolo Longevity</p>
              </div>
              <p className="sf" style={{fontSize:14,color:"rgba(198,169,107,0.55)",lineHeight:1.85,fontStyle:"italic"}}>
                "He analizado tu perfil de longevidad completo. Voy a generar tu protocolo de optimización biológica con nutrición antiedad, suplementación personalizada y estrategias de extensión de salud basadas en tu biología específica."
              </p>
            </div>

            <button onClick={handleFinish} disabled={saving} className="btn-next" style={{width:"100%",padding:"18px",fontSize:15,background:"linear-gradient(145deg,#C6A96B,#8A7240)",color:"white",boxShadow:"0 10px 32px rgba(198,169,107,0.3)"}}>
              {saving?"Generando tu protocolo Longevity...":"Activar mi protocolo Longevity →"}
            </button>
            <p style={{fontSize:11,color:"rgba(237,237,237,0.15)",textAlign:"center",marginTop:14,fontWeight:300,letterSpacing:"0.04em"}}>
              Tu evaluación queda guardada · Puedes actualizarla cuando lo desees
            </p>
          </div>
        )}

        {/* NAVEGACIÓN */}
        <div style={{display:"flex",gap:12,marginTop:52,alignItems:"center"}}>
          {paso>0 && (
            <button onClick={()=>setPaso(p=>p-1)} className="btn-back">← Anterior</button>
          )}
          {paso<7 && (
            <button onClick={()=>setPaso(p=>p+1)} className="btn-next" style={{marginLeft:"auto"}}>
              Siguiente →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

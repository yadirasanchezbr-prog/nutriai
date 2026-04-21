"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PASOS = ["Datos básicos","Objetivo","Historia clínica","Digestión","Hormonas","Alimentación","Estilo de vida","Revisión"];
const PATOLOGIAS = ["Síndrome de intestino irritable","SIBO","Enfermedad de Crohn","Colitis ulcerosa","Reflujo / ERGE","Hipotiroidismo","Hipertiroidismo","Hashimoto","SOP","Endometriosis","Resistencia a la insulina","Diabetes tipo 2","Prediabetes","Artritis reumatoide","Psoriasis","Lupus","Fibromialgia","Migraña crónica","Ansiedad / Depresión","Osteoporosis","Anemia","Hígado graso","Hipertensión","Colesterol alto","Ninguna"];
const INTOLERANCIAS = ["Gluten / Celíaca","Lactosa","Fructosa","Sorbitol","Histamina","Níquel","Huevo","Soja","Frutos secos","Marisco","Pescado","Maíz","Levadura","Nightshades","Cafeína","Alcohol","Ninguna"];
const SINTOMAS_DIGESTIVOS = ["Hinchazón abdominal","Gases excesivos","Pesadez postprandial","Reflujo o acidez","Náuseas","Estreñimiento","Diarrea frecuente","Alternancia diarrea/estreñimiento","Dolor abdominal","Digestión lenta","Heces con moco","Urgencia defecatoria","Ninguno"];
const TIPOS_ALIMENTACION = ["Omnívora","Vegetariana","Vegana","Pescetariana","Sin gluten","Sin lactosa","Keto / Low carb","Paleo","Ayuno intermitente","Personalizada / Mixta"];
const NIVELES_ACTIVIDAD = ["Sedentaria (sin ejercicio)","Ligera (1-2 días/semana)","Moderada (3-4 días/semana)","Activa (5+ días/semana)","Muy activa (atleta / entreno diario)"];
const OBJETIVOS = [
  { id:"perdida_grasa", titulo:"Pérdida de grasa", desc:"Reducir masa grasa manteniendo músculo" },
  { id:"recomp", titulo:"Recomposición corporal", desc:"Perder grasa y ganar músculo simultáneamente" },
  { id:"ganancia_muscular", titulo:"Ganancia muscular", desc:"Aumentar masa muscular y fuerza" },
  { id:"digestivo", titulo:"Salud digestiva", desc:"Mejorar síntomas digestivos y microbiota" },
  { id:"hormonal", titulo:"Equilibrio hormonal", desc:"Regular ciclo, tiroides o insulina" },
  { id:"antiinflamatorio", titulo:"Protocolo antiinflamatorio", desc:"Reducir inflamación sistémica" },
  { id:"energia", titulo:"Mejorar energía y vitalidad", desc:"Optimizar niveles de energía diaria" },
  { id:"longevity", titulo:"Longevidad y antiedad", desc:"Optimizar biología para vivir más y mejor" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string|null>(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [pesoObjetivo, setPesoObjetivo] = useState("");
  const [plazo, setPlazo] = useState("");
  const [patologias, setPatologias] = useState<string[]>([]);
  const [medicacion, setMedicacion] = useState("");
  const [suplementos, setSuplementos] = useState("");
  const [analiticas, setAnaliticas] = useState("");
  const [sintomasDigestivos, setSintomasDigestivos] = useState<string[]>([]);
  const [intolerancias, setIntolerancias] = useState<string[]>([]);
  const [alergias, setAlergias] = useState("");
  const [evacuaciones, setEvacuaciones] = useState("");
  const [tieneCiclo, setTieneCiclo] = useState("");
  const [duracionCiclo, setDuracionCiclo] = useState("");
  const [ultimaMenstruacion, setUltimaMenstruacion] = useState("");
  const [sintomasHormonales, setSintomasHormonales] = useState<string[]>([]);
  const [tipoAlimentacion, setTipoAlimentacion] = useState<string[]>([]);
  const [alimentosEvitar, setAlimentosEvitar] = useState("");
  const [alimentosFavoritos, setAlimentosFavoritos] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [tiempoCocina, setTiempoCocina] = useState("");
  const [numComidas, setNumComidas] = useState("3");
  const [actividadFisica, setActividadFisica] = useState("");
  const [tipoEjercicio, setTipoEjercicio] = useState("");
  const [horasSueno, setHorasSueno] = useState("");
  const [nivelEstres, setNivelEstres] = useState(5);
  const [trabajoTipo, setTrabajoTipo] = useState("");
  const [relacionComida, setRelacionComida] = useState("");

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
    const formData = {
      full_name:nombre, edad, sexo, peso_kg:peso, altura_cm:altura,
      objetivo, peso_objetivo:pesoObjetivo, plazo,
      patologias, medicacion, suplementos, analiticas,
      sintomas_digestivos:sintomasDigestivos, intolerancias, alergias, evacuaciones_dia:evacuaciones,
      tiene_ciclo:tieneCiclo, duracion_ciclo:duracionCiclo, ultima_menstruacion:ultimaMenstruacion, sintomas_hormonales:sintomasHormonales,
      tipo_alimentacion:tipoAlimentacion, alimentos_evitar:alimentosEvitar, alimentos_favoritos:alimentosFavoritos,
      presupuesto_semana:presupuesto, tiempo_cocina:tiempoCocina, num_comidas:numComidas,
      actividad_fisica:actividadFisica, tipo_ejercicio:tipoEjercicio, horas_sueno:horasSueno,
      nivel_estres:nivelEstres, trabajo_tipo:trabajoTipo, relacion_comida:relacionComida,
    };
    await supabase.from("profiles").upsert({ id:userId, form_data:formData, updated_at:new Date().toISOString() });
    await supabase.from("clinical_forms").upsert({ user_id:userId, ...formData, updated_at:new Date().toISOString() });
    router.push("/dashboard");
  }

  const imc = peso && altura ? (parseFloat(peso)/Math.pow(parseFloat(altura)/100,2)).toFixed(1) : null;
  const progreso = (paso/PASOS.length)*100;

  return (
    <div style={{ minHeight:"100vh", background:"#0B0B0B", color:"#EDEDED", fontFamily:"var(--font-instrument,-apple-system,sans-serif)" }}>
      <style>{`
        .sf{font-family:var(--font-playfair,Georgia,serif)}
        .inp{background:rgba(237,237,237,0.04);border:1px solid rgba(237,237,237,0.1);border-radius:12px;padding:13px 16px;font-size:14px;color:#EDEDED;font-family:var(--font-instrument,sans-serif);outline:none;width:100%;transition:border-color 0.2s ease;font-weight:300;line-height:1.5;box-sizing:border-box}
        .inp:focus{border-color:rgba(237,237,237,0.28)}
        .inp::placeholder{color:rgba(237,237,237,0.2)}
        textarea.inp{resize:none}
        select.inp{cursor:pointer}
        select.inp option{background:#1A1A1A;color:#EDEDED}
        label{font-size:11px;font-weight:600;color:rgba(237,237,237,0.3);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px}
        .chip{padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px;font-family:var(--font-instrument,sans-serif);border:1px solid rgba(237,237,237,0.08);background:transparent;color:rgba(237,237,237,0.38);transition:all 0.2s ease;font-weight:300;line-height:1}
        .chip.on{background:#EDEDED;color:#0B0B0B;border-color:transparent;font-weight:600}
        .chip:hover:not(.on){border-color:rgba(237,237,237,0.18);color:rgba(237,237,237,0.65)}
        .obj-card{border:1px solid rgba(237,237,237,0.08);border-radius:16px;padding:20px 18px;cursor:pointer;transition:all 0.25s ease;background:transparent;width:100%;text-align:left}
        .obj-card:hover{border-color:rgba(237,237,237,0.2);background:rgba(237,237,237,0.03)}
        .obj-card.on{background:#EDEDED;border-color:transparent}
        .btn-next{background:#EDEDED;color:#0B0B0B;border:none;border-radius:13px;padding:14px 36px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font-instrument,sans-serif);letter-spacing:0.01em;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),filter 0.2s ease}
        .btn-next:hover{transform:translateY(-1px) scale(1.02);filter:brightness(1.05)}
        .btn-next:disabled{opacity:0.4;cursor:not-allowed;transform:none}
        .btn-back{background:transparent;color:rgba(237,237,237,0.35);border:1px solid rgba(237,237,237,0.1);border-radius:13px;padding:14px 24px;font-size:14px;font-weight:400;cursor:pointer;font-family:var(--font-instrument,sans-serif);transition:border-color 0.2s ease,color 0.2s ease}
        .btn-back:hover{border-color:rgba(237,237,237,0.22);color:rgba(237,237,237,0.65)}
        .slider{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(237,237,237,0.1);outline:none}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#EDEDED;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.5)}
        .act-btn{border:1px solid rgba(237,237,237,0.08);border-radius:12px;padding:12px 16px;cursor:pointer;text-align:left;transition:all 0.2s ease;background:transparent;width:100%;font-family:var(--font-instrument,sans-serif)}
        .act-btn:hover{border-color:rgba(237,237,237,0.2);background:rgba(237,237,237,0.03)}
        .act-btn.on{background:#EDEDED;border-color:transparent}
        .fade-in{animation:fi 0.5s cubic-bezier(0.16,1,0.3,1)}
        @keyframes fi{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
      `}</style>

      <div style={{position:"fixed",top:-100,right:-80,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(237,237,237,0.02),transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(237,237,237,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(237,237,237,0.015) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none"}}/>

      {/* HEADER FIJO */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:50,background:"rgba(11,11,11,0.97)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderBottom:"1px solid rgba(237,237,237,0.06)"}}>
        <div style={{maxWidth:720,margin:"0 auto",padding:"18px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(198,169,107,0.35)"}}>
                <span className="sf" style={{color:"white",fontSize:13,fontWeight:700,fontStyle:"italic"}}>N</span>
              </div>
              <span className="sf" style={{fontSize:16,fontWeight:600,color:"#EDEDED",letterSpacing:"-0.3px"}}>NutriAI</span>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:10,fontWeight:600,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:2}}>Evaluación clínica</p>
              <p style={{fontSize:12,color:"rgba(237,237,237,0.45)",fontWeight:300}}>{PASOS[paso]}</p>
            </div>
          </div>
          <div style={{height:2,background:"rgba(237,237,237,0.06)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",background:"#EDEDED",borderRadius:2,width:`${progreso}%`,transition:"width 0.5s cubic-bezier(0.16,1,0.3,1)"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
            {PASOS.map((_,i)=>(
              <button key={i} onClick={()=>i<paso&&setPaso(i)} style={{background:"none",border:"none",cursor:i<paso?"pointer":"default",padding:4}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:i<paso?"#EDEDED":i===paso?"rgba(237,237,237,0.6)":"rgba(237,237,237,0.12)",transform:i===paso?"scale(1.3)":"scale(1)",transition:"all 0.3s ease"}}/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{maxWidth:720,margin:"0 auto",padding:"130px 24px 80px",position:"relative",zIndex:1}}>

        {/* PASO 0 */}
        {paso===0 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Paso 1 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Cuéntanos<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>quién eres</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,lineHeight:1.75,marginBottom:48,maxWidth:500}}>
              Nuria necesita estos datos para construir tu protocolo. Toda la información es confidencial.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <label>Nombre completo</label>
                <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre" className="inp"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Edad</label>
                  <input type="number" value={edad} onChange={e=>setEdad(e.target.value)} placeholder="32" className="inp"/>
                </div>
                <div>
                  <label>Sexo biológico</label>
                  <select value={sexo} onChange={e=>setSexo(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Peso actual (kg)</label>
                  <input type="number" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="65" className="inp"/>
                </div>
                <div>
                  <label>Altura (cm)</label>
                  <input type="number" value={altura} onChange={e=>setAltura(e.target.value)} placeholder="168" className="inp"/>
                </div>
              </div>
              {imc && (
                <div style={{padding:"18px 22px",background:"rgba(237,237,237,0.04)",border:"1px solid rgba(237,237,237,0.08)",borderRadius:14,display:"flex",gap:24,alignItems:"center"}}>
                  <div>
                    <p style={{fontSize:9,color:"rgba(237,237,237,0.25)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,fontWeight:600}}>IMC calculado</p>
                    <p className="sf" style={{fontSize:32,fontWeight:700,color:"#EDEDED",letterSpacing:"-1px",lineHeight:1}}>{imc}</p>
                  </div>
                  <div style={{width:1,height:40,background:"rgba(237,237,237,0.08)"}}/>
                  <div>
                    <p style={{fontSize:14,color:"rgba(237,237,237,0.55)",fontWeight:400,marginBottom:4}}>
                      {parseFloat(imc)<18.5?"Bajo peso":parseFloat(imc)<25?"Normopeso":parseFloat(imc)<30?"Sobrepeso":"Obesidad"}
                    </p>
                    <p style={{fontSize:11,color:"rgba(237,237,237,0.2)",fontWeight:300}}>Nuria adaptará tu protocolo a este dato</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASO 1 */}
        {paso===1 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Paso 2 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              ¿Cuál es tu<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>objetivo principal?</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>Elige uno. El protocolo se construirá en torno a él.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
              {OBJETIVOS.map(obj=>(
                <button key={obj.id} onClick={()=>setObjetivo(obj.id)} className={`obj-card ${objetivo===obj.id?"on":""}`}>
                  <p style={{fontSize:14,fontWeight:600,color:objetivo===obj.id?"#0B0B0B":"#EDEDED",marginBottom:4}}>{obj.titulo}</p>
                  <p style={{fontSize:12,color:objetivo===obj.id?"rgba(0,0,0,0.5)":"rgba(237,237,237,0.3)",fontWeight:300,lineHeight:1.5}}>{obj.desc}</p>
                </button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label>Peso objetivo (kg) — opcional</label>
                <input type="number" value={pesoObjetivo} onChange={e=>setPesoObjetivo(e.target.value)} placeholder="58" className="inp"/>
              </div>
              <div>
                <label>Plazo aproximado</label>
                <select value={plazo} onChange={e=>setPlazo(e.target.value)} className="inp">
                  <option value="">Sin fecha límite</option>
                  <option value="1mes">1 mes</option>
                  <option value="3meses">3 meses</option>
                  <option value="6meses">6 meses</option>
                  <option value="1año">1 año o más</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {paso===2 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Paso 3 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Historia<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>clínica</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>Esta información permite a Nuria crear un protocolo seguro y adaptado a tu condición.</p>
            <div style={{display:"flex",flexDirection:"column",gap:28}}>
              <div>
                <label>Patologías diagnosticadas</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                  {PATOLOGIAS.map(p=>(
                    <button key={p} onClick={()=>toggleArr(patologias,setPatologias,p)} className={`chip ${patologias.includes(p)?"on":""}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Medicación actual</label>
                <textarea value={medicacion} onChange={e=>setMedicacion(e.target.value)} placeholder="Ej: levotiroxina 50mcg, metformina 500mg..." rows={3} className="inp"/>
              </div>
              <div>
                <label>Suplementación actual</label>
                <input value={suplementos} onChange={e=>setSuplementos(e.target.value)} placeholder="Ej: vitamina D, magnesio, omega-3..." className="inp"/>
              </div>
              <div>
                <label>Analíticas recientes relevantes</label>
                <textarea value={analiticas} onChange={e=>setAnaliticas(e.target.value)} placeholder="Ej: vitamina D 18 ng/ml, ferritina 12, TSH 3.2..." rows={3} className="inp"/>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {paso===3 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Paso 4 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Tu sistema<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>digestivo</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>El 70% de los problemas de salud tienen origen digestivo.</p>
            <div style={{display:"flex",flexDirection:"column",gap:28}}>
              <div>
                <label>Síntomas digestivos habituales</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                  {SINTOMAS_DIGESTIVOS.map(s=>(
                    <button key={s} onClick={()=>toggleArr(sintomasDigestivos,setSintomasDigestivos,s)} className={`chip ${sintomasDigestivos.includes(s)?"on":""}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Intolerancias y sensibilidades</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                  {INTOLERANCIAS.map(i=>(
                    <button key={i} onClick={()=>toggleArr(intolerancias,setIntolerancias,i)} className={`chip ${intolerancias.includes(i)?"on":""}`}>{i}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Alergias alimentarias confirmadas</label>
                <input value={alergias} onChange={e=>setAlergias(e.target.value)} placeholder="Ej: frutos secos (anafilaxia), marisco..." className="inp"/>
              </div>
              <div>
                <label>Frecuencia de evacuaciones</label>
                <select value={evacuaciones} onChange={e=>setEvacuaciones(e.target.value)} className="inp">
                  <option value="">Seleccionar</option>
                  <option value="menos1">Menos de 1 vez al día</option>
                  <option value="1dia">1 vez al día</option>
                  <option value="2-3dia">2-3 veces al día</option>
                  <option value="mas3">Más de 3 veces al día</option>
                  <option value="variable">Variable / irregular</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PASO 4 */}
        {paso===4 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Paso 5 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Perfil<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>hormonal</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>La alimentación y las hormonas están profundamente conectadas.</p>
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div>
                <label>¿Tienes ciclo menstrual activo?</label>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {["Sí","No","Menopausia","Post-menopausia"].map(v=>(
                    <button key={v} onClick={()=>setTieneCiclo(v)} className={`chip ${tieneCiclo===v?"on":""}`}>{v}</button>
                  ))}
                </div>
              </div>
              {tieneCiclo==="Sí" && (
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div>
                      <label>Duración del ciclo (días)</label>
                      <input type="number" value={duracionCiclo} onChange={e=>setDuracionCiclo(e.target.value)} placeholder="28" className="inp"/>
                    </div>
                    <div>
                      <label>Fecha última menstruación</label>
                      <input type="date" value={ultimaMenstruacion} onChange={e=>setUltimaMenstruacion(e.target.value)} className="inp"/>
                    </div>
                  </div>
                  <div>
                    <label>Síntomas hormonales</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                      {["Ciclo irregular","Reglas dolorosas","SPM intenso","Retención de líquidos","Cambios de humor","Acné hormonal","Pérdida de cabello","Fatiga premenstrual","Antojos intensos","Insomnio premenstrual","Libido baja","Ninguno"].map(s=>(
                        <button key={s} onClick={()=>toggleArr(sintomasHormonales,setSintomasHormonales,s)} className={`chip ${sintomasHormonales.includes(s)?"on":""}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* PASO 5 */}
        {paso===5 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Paso 6 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Tus preferencias<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>alimentarias</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>El protocolo se adapta a ti, no al revés.</p>
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div>
                <label>Tipo de alimentación</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                  {TIPOS_ALIMENTACION.map(t=>(
                    <button key={t} onClick={()=>toggleArr(tipoAlimentacion,setTipoAlimentacion,t)} className={`chip ${tipoAlimentacion.includes(t)?"on":""}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Alimentos que NO quieres en tu menú</label>
                <textarea value={alimentosEvitar} onChange={e=>setAlimentosEvitar(e.target.value)} placeholder="Ej: no me gusta el pescado azul, evito el cerdo..." rows={3} className="inp"/>
              </div>
              <div>
                <label>Alimentos favoritos que quieres incluir</label>
                <textarea value={alimentosFavoritos} onChange={e=>setAlimentosFavoritos(e.target.value)} placeholder="Ej: me encanta el aguacate, el pollo, las legumbres..." rows={3} className="inp"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                <div>
                  <label>Presupuesto semanal</label>
                  <select value={presupuesto} onChange={e=>setPresupuesto(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="menos30">Menos de 30€</option>
                    <option value="30-60">30-60€</option>
                    <option value="60-100">60-100€</option>
                    <option value="mas100">Más de 100€</option>
                  </select>
                </div>
                <div>
                  <label>Tiempo para cocinar</label>
                  <select value={tiempoCocina} onChange={e=>setTiempoCocina(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="menos15">Menos de 15 min</option>
                    <option value="15-30">15-30 min</option>
                    <option value="30-60">30-60 min</option>
                    <option value="mas60">Más de 1 hora</option>
                  </select>
                </div>
                <div>
                  <label>Comidas al día</label>
                  <select value={numComidas} onChange={e=>setNumComidas(e.target.value)} className="inp">
                    <option value="2">2 comidas</option>
                    <option value="3">3 comidas</option>
                    <option value="4">4 comidas</option>
                    <option value="5">5 comidas</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 6 */}
        {paso===6 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Paso 7 de {PASOS.length}</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Tu estilo<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>de vida</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:40}}>El contexto de tu vida influye directamente en tu metabolismo.</p>
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div>
                <label>Nivel de actividad física</label>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
                  {NIVELES_ACTIVIDAD.map(n=>(
                    <button key={n} onClick={()=>setActividadFisica(n)} className={`act-btn ${actividadFisica===n?"on":""}`}>
                      <span style={{fontSize:13,fontWeight:actividadFisica===n?600:300,color:actividadFisica===n?"#0B0B0B":"rgba(237,237,237,0.45)"}}>{n}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label>Tipo de ejercicio que practicas</label>
                <input value={tipoEjercicio} onChange={e=>setTipoEjercicio(e.target.value)} placeholder="Ej: musculación 4 días, running 2 días..." className="inp"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label>Horas de sueño habituales</label>
                  <select value={horasSueno} onChange={e=>setHorasSueno(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="menos5">Menos de 5h</option>
                    <option value="5-6">5-6 horas</option>
                    <option value="6-7">6-7 horas</option>
                    <option value="7-8">7-8 horas</option>
                    <option value="mas8">Más de 8h</option>
                  </select>
                </div>
                <div>
                  <label>Tipo de trabajo</label>
                  <select value={trabajoTipo} onChange={e=>setTrabajoTipo(e.target.value)} className="inp">
                    <option value="">Seleccionar</option>
                    <option value="sedentario">Sedentario (oficina)</option>
                    <option value="mixto">Mixto</option>
                    <option value="activo">Activo (de pie)</option>
                    <option value="turnos">Trabajo por turnos</option>
                    <option value="nocturno">Turno nocturno</option>
                  </select>
                </div>
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <label style={{margin:0}}>Nivel de estrés habitual</label>
                  <span className="sf" style={{fontSize:24,fontWeight:700,color:"#EDEDED",letterSpacing:"-0.5px"}}>{nivelEstres}<span style={{fontSize:13,color:"rgba(237,237,237,0.3)",fontWeight:300}}>/10</span></span>
                </div>
                <input type="range" min={1} max={10} value={nivelEstres} onChange={e=>setNivelEstres(parseInt(e.target.value))} className="slider"/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Sin estrés</span>
                  <span style={{fontSize:10,color:"rgba(237,237,237,0.2)"}}>Estrés extremo</span>
                </div>
              </div>
              <div>
                <label>Relación con la comida</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                  {["Muy buena — como con placer","Neutral — la comida es funcional","Complicada — ansiedad o restricción","Como por emociones / aburrimiento","Historial de TCA","Prefiero no responder"].map(r=>(
                    <button key={r} onClick={()=>setRelacionComida(r)} className={`chip ${relacionComida===r?"on":""}`}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 7 - REVISIÓN */}
        {paso===7 && (
          <div className="fade-in">
            <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:16}}>Último paso</p>
            <h1 className="sf" style={{fontSize:52,fontWeight:700,color:"#EDEDED",letterSpacing:"-2.5px",lineHeight:0.97,marginBottom:16}}>
              Todo listo para<br/><em style={{fontStyle:"italic",color:"rgba(237,237,237,0.35)"}}>tu protocolo</em>
            </h1>
            <p style={{fontSize:15,color:"rgba(237,237,237,0.3)",fontWeight:300,marginBottom:48,maxWidth:500}}>
              Nuria tiene toda la información necesaria. En menos de 2 minutos tendrás tu primer menú.
            </p>
            <div style={{background:"rgba(237,237,237,0.03)",border:"1px solid rgba(237,237,237,0.08)",borderRadius:20,padding:"28px",marginBottom:32,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(237,237,237,0.1) 50%,transparent)"}}/>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(237,237,237,0.22)",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:20}}>Resumen de tu evaluación</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  ["Nombre",nombre||"—"],
                  ["Edad / Sexo",edad&&sexo?`${edad} años · ${sexo}`:"—"],
                  ["Peso / Altura",peso&&altura?`${peso}kg · ${altura}cm`:"—"],
                  ["IMC",imc??"—"],
                  ["Objetivo",OBJETIVOS.find(o=>o.id===objetivo)?.titulo||"—"],
                  ["Alimentación",tipoAlimentacion.length>0?tipoAlimentacion.slice(0,2).join(", "):"—"],
                  ["Patologías",patologias.length>0?`${patologias.length} registradas`:"Ninguna"],
                  ["Intolerancias",intolerancias.length>0?intolerancias.slice(0,2).join(", "):"Ninguna"],
                  ["Actividad",actividadFisica||"—"],
                  ["Estrés",`${nivelEstres}/10`],
                ].map(([k,v])=>(
                  <div key={k} style={{padding:"12px 0",borderBottom:"1px solid rgba(237,237,237,0.05)"}}>
                    <p style={{fontSize:9,color:"rgba(237,237,237,0.22)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{k}</p>
                    <p style={{fontSize:13,color:"rgba(237,237,237,0.6)",fontWeight:300}}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"rgba(237,237,237,0.03)",border:"1px solid rgba(198,169,107,0.15)",borderRadius:18,padding:"22px 24px",marginBottom:36,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(198,169,107,0.3) 50%,transparent)"}}/>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(145deg,#C6A96B,#8A7240)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span className="sf" style={{color:"white",fontSize:11,fontWeight:700,fontStyle:"italic"}}>N</span>
                </div>
                <p style={{fontSize:9,fontWeight:600,color:"rgba(198,169,107,0.5)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Nuria</p>
              </div>
              <p className="sf" style={{fontSize:14,color:"rgba(237,237,237,0.42)",lineHeight:1.8,fontStyle:"italic"}}>
                "He analizado toda tu información. Voy a generar un protocolo nutricional adaptado a tu biología, objetivos y estilo de vida."
              </p>
            </div>
            <button onClick={handleFinish} disabled={saving} className="btn-next" style={{width:"100%",padding:"18px",fontSize:15}}>
              {saving?"Generando tu protocolo...":"Generar mi protocolo →"}
            </button>
            <p style={{fontSize:11,color:"rgba(237,237,237,0.15)",textAlign:"center",marginTop:14,fontWeight:300,letterSpacing:"0.04em"}}>
              Puedes actualizar tu evaluación en cualquier momento desde tu perfil
            </p>
          </div>
        )}

        {/* NAVEGACIÓN */}
        <div style={{display:"flex",gap:12,marginTop:52,alignItems:"center"}}>
          {paso>0 && (
            <button onClick={()=>setPaso(p=>p-1)} className="btn-back">← Anterior</button>
          )}
          {paso<7 && (
            <button onClick={()=>setPaso(p=>p+1)} className="btn-next" style={{marginLeft:"auto"}}>Siguiente →</button>
          )}
        </div>

      </div>
    </div>
  );
}

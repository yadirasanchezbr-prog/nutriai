"use client";
import Link from "next/link";

const features = [
  {
    title: "Menú semanal personalizado",
    description: "7 días de platos adaptados a tu objetivo, intolerancias y tipo de dieta. Con ingredientes en gramos en crudo, como hacen los nutricionistas de verdad.",
    icon: <path d="M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm3 6h6m-6 4h4" strokeLinecap="round" strokeLinejoin="round"/>,
  },
  {
    title: "Nuria, tu nutricionista IA 24h",
    description: "Resuelve dudas, gestiona síntomas, te ayuda en restaurantes y te apoya emocionalmente. Nuria recuerda cada conversación y aprende de ti.",
    icon: <path d="M8 10h8m-8 4h5M21 12a8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 8 19l-5 2 2-5A8.5 8.5 0 1 1 21 12Z" strokeLinecap="round" strokeLinejoin="round"/>,
  },
  {
    title: "NutriScore semanal",
    description: "Un único número del 0-100 que resume tu semana: adherencia, energía, digestión y progreso. Cada semana mejor que la anterior.",
    icon: <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>,
  },
  {
    title: "Ajuste automático semanal",
    description: "Nuria analiza tus check-ins diarios y reajusta el menú automáticamente. Si tienes hambre, añade calorías. Si hay hinchazón, activa el protocolo digestivo.",
    icon: <path d="M20 6v5h-5M4 18v-5h5M6.5 10A6 6 0 0 1 17 7l3 4M17.5 14A6 6 0 0 1 7 17l-3-4" strokeLinecap="round" strokeLinejoin="round"/>,
  },
  {
    title: "Lista de la compra automática",
    description: "Del menú semanal se genera automáticamente una lista de la compra agrupada por sección del supermercado. Con checkboxes para ir tachando.",
    icon: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>,
  },
  {
    title: "Modo restaurante",
    description: "Dile a Nuria dónde vas a cenar y te da las 3 mejores opciones del menú adaptadas a tu plan. Adherencia real, también fuera de casa.",
    icon: <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" strokeLinecap="round" strokeLinejoin="round"/>,
  },
];

const faqs = [
  {
    q: "¿Cuánto tarda en generarse mi primer menú?",
    a: "Menos de 2 minutos. Rellenas tu perfil clínico, eliges tu objetivo y Nuria genera tu menú personalizado al instante.",
  },
  {
    q: "¿Qué pasa si no me gusta un plato del menú?",
    a: "Puedes pedirle a Nuria directamente en el chat que lo sustituya por otro que se adapte a tus preferencias. El menú es tuyo y se puede ajustar.",
  },
  {
    q: "¿Funciona para veganos, celíacos o con intolerancias?",
    a: "Sí. El formulario clínico recoge más de 18 intolerancias y alergias, y todos los tipos de alimentación incluyendo vegano, keto, paleo, ayuno intermitente y más.",
  },
  {
    q: "¿Cada cuánto se actualiza el menú?",
    a: "Cada semana automáticamente. Nuria analiza tus check-ins diarios y reajusta el menú según cómo te has sentido: hambre, energía, digestión y estado emocional.",
  },
  {
    q: "¿Es seguro para personas con patologías?",
    a: "NutriAI es una herramienta de apoyo nutricional, no reemplaza a un médico. El formulario recoge más de 34 condiciones de salud para personalizar el plan, pero siempre recomendamos consultar con tu médico ante patologías graves.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, sin permanencia ni penalizaciones. Cancelas cuando quieras desde tu perfil.",
  },
];

export default function Home() {
  return (
    <div className="scroll-smooth bg-white text-neutral-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2 text-xl font-bold text-[#0F6E56]">
            NutriAI
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
            <a href="#como-funciona" className="transition hover:text-[#0F6E56]">Cómo funciona</a>
            <a href="#funcionalidades" className="transition hover:text-[#0F6E56]">Funcionalidades</a>
            <a href="#precios" className="transition hover:text-[#0F6E56]">Precios</a>
            <a href="#faq" className="transition hover:text-[#0F6E56]">FAQ</a>
            <Link href="/login" className="transition hover:text-[#0F6E56]">Entrar</Link>
          </div>
          <Link href="/registro" className="rounded-full bg-[#0F6E56] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d604b]">
            Empezar gratis
          </Link>
        </nav>
      </header>

      <main className="pt-24">

        {/* HERO */}
        <section className="reveal px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mx-auto inline-flex rounded-full bg-[#E8F5F0] px-4 py-1.5 text-sm font-medium text-[#0F6E56]">
              ✦ Nutrición clínica personalizada con IA
            </p>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Tu nutricionista personal.<br className="hidden sm:block" /> Disponible 24 horas al día.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-neutral-600">
              Nuria aprende de ti cada semana y adapta tu menú según cómo te sientes. Más de 34 patologías, 18 intolerancias y todos los tipos de alimentación.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/registro" className="rounded-full bg-[#0F6E56] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0d604b]">
                Crear mi plan gratis →
              </Link>
              <a href="#como-funciona" className="rounded-full border border-[#0F6E56]/30 px-7 py-3 text-sm font-semibold text-[#0F6E56] transition hover:border-[#0F6E56]">
                Ver cómo funciona
              </a>
            </div>
            <p className="mt-5 text-sm text-neutral-500">Sin tarjeta · Cancela cuando quieras · Primer menú en 2 minutos</p>
            <div className="mt-12 grid gap-4 sm:grid-cols-4">
              {[
                "Menú listo en 2 min",
                "+34 patologías",
                "Ajuste automático",
                "NutriScore semanal",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-[#F8F9FA] px-5 py-4 text-sm font-semibold text-[#0F6E56]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="reveal bg-[#F8F9FA] px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Tres pasos. Un plan que funciona.</h2>
            <p className="mt-4 text-center text-neutral-600">Sin complicaciones, sin contar calorías manualmente, sin dietas genéricas.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                ["01", "Cuéntale a Nuria cómo eres", "Formulario clínico avanzado: patologías, intolerancias, síntomas digestivos, tipo de alimentación y mucho más."],
                ["02", "Recibe tu menú personalizado", "GPT-4o genera tu menú de 7 días con recetas, ingredientes en gramos en crudo y macros calculados."],
                ["03", "Nuria se adapta cada semana", "Check-in diario, NutriScore semanal y reajuste automático. Tu plan mejora solo."],
              ].map(([number, title, desc]) => (
                <article key={number} className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-4xl font-bold text-[#0F6E56]">{number}</p>
                  <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-neutral-600">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section id="funcionalidades" className="reveal px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Todo lo que necesitas para comer bien de verdad</h2>
            <p className="mt-4 text-center text-neutral-600">No es una app de conteo de calorías. Es una nutricionista clínica en tu bolsillo.</p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-2xl bg-[#E8F5F0] p-6">
                  <svg className="h-8 w-8 text-[#0F6E56]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {feature.icon}
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-[#0F6E56]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-neutral-700">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="reveal bg-[#E8F5F0] px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Personas reales, resultados reales</h2>
            <p className="mt-4 text-center text-neutral-600">Sin dietas milagro. Sin pasar hambre. Con resultados que se mantienen.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                ["LM", "Laura M.", "−6 kg en 4 meses", "Tengo SOP y ninguna dieta me funcionaba. Nuria adapta el menú a mi ciclo automáticamente. Por fin algo que de verdad encaja conmigo."],
                ["JR", "Javier R.", "Más energía y mejor digestión", "Llevo 3 meses con el plan antiinflamatorio. Mi digestión ha mejorado un 80% y mantengo la constancia porque Nuria me recuerda y me motiva."],
                ["AC", "Ana C.", "Sin hinchazón por primera vez", "Tenía SIBO y no sabía qué comer. Nuria identificó los alimentos que me sentaban mal y los eliminó del menú. Llevo semanas sin episodios."],
              ].map(([initials, name, result, text]) => (
                <article key={name} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F6E56] text-sm font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm font-semibold text-[#0F6E56]">{result}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-neutral-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRECIOS */}
        <section id="precios" className="reveal px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Elige tu plan</h2>
            <p className="mt-4 text-center text-neutral-600">Sin permanencia. Cancela cuando quieras.</p>
            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {[
                ["Básico", "9,99€", "", ["✓ Menú semanal", "✓ Chat con Nuria", "✓ Lista de la compra", "— Ajuste semanal", "— NutriScore"]],
                ["Pro", "19,99€", "", ["✓ Todo Básico", "✓ Ajuste semanal automático", "✓ NutriScore semanal", "✓ Protocolo digestivo", "✓ Modo restaurante"]],
                ["Élite", "39,99€", "", ["✓ Todo Pro", "✓ Protocolo pre-menstrual", "✓ Gemelo metabólico", "✓ Seguimiento avanzado", "✓ Prioridad soporte"]],
                ["Longevity", "59,99€", "NUEVO", ["✓ Todo Élite", "✓ Plan antiedad con IA", "✓ Protocolo antioxidante", "✓ Análisis longevidad", "✓ Suplementación antiedad"]],
              ].map(([name, price, badge, items]) => (
                <article
                  key={Array.isArray(name) ? name.join('-') : name}
                  className={`rounded-2xl bg-white p-7 shadow-sm relative flex flex-col ${
                    name === "Longevity" ? "border-2 border-amber-400" :
                    name === "Pro" ? "border-2 border-[#0F6E56]" : "border border-neutral-200"
                  }`}
                >
                  {badge ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900">
                      {badge}
                    </span>
                  ) : null}
                  {name === "Pro" ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0F6E56] px-3 py-1 text-xs font-semibold text-white">
                      Más popular
                    </span>
                  ) : null}
                  <h3 className="text-xl font-semibold">{name}</h3>
                  {name === "Longevity" ? (
                    <p className="mt-1 text-xs font-medium text-amber-600">Nutricion antiedad y longevidad</p>
                  ) : null}
                  <p className="mt-4 text-4xl font-bold text-[#0F6E56]">{price}</p>
                  <p className="text-xs text-neutral-400">al mes</p>
                  <ul className="mt-6 space-y-2 text-sm flex-1">
                    {(items as string[]).map((item) => (
                      <li key={item} className={item.startsWith("—") ? "text-neutral-400" : "text-neutral-700"}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/registro"
                    className={`mt-6 block rounded-full px-4 py-2.5 text-center text-sm font-semibold transition ${
                      name === "Longevity" ? "bg-amber-400 text-amber-900 hover:bg-amber-500" :
                      name === "Pro" ? "bg-[#0F6E56] text-white hover:bg-[#0d604b]" :
                      "border border-[#0F6E56] text-[#0F6E56] hover:bg-emerald-50"
                    }`}
                  >
                    {name === "Longevity" ? "Quiero vivir más" : name === "Pro" ? "Empezar con Pro" : "Empezar"}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="reveal bg-[#F8F9FA] px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h2>
            <div className="mt-12 space-y-4">
              {faqs.map((faq) => (
                <article key={faq.q} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-neutral-900">{faq.q}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{faq.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="reveal bg-[#0F6E56] px-4 py-16 text-center text-white sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold sm:text-5xl">¿Lista para empezar?</h2>
            <p className="mt-4 text-white/85">Tu primer menú personalizado en menos de 2 minutos. Sin tarjeta de crédito.</p>
            <Link href="/registro" className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0F6E56] transition hover:bg-neutral-100">
              Crear mi cuenta gratis →
            </Link>
            <p className="mt-4 text-sm text-white/60">Más de 500 personas ya tienen su plan personalizado</p>
          </div>
        </section>

      </main>

      <footer className="bg-[#0F6E56] px-4 py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-bold">NutriAI</p>
          <div className="flex gap-5 text-sm text-white/85">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-sm text-white/70">© {new Date().getFullYear()} NutriAI. Todos los derechos reservados.</p>
      </footer>

      <style jsx global>{`
        .reveal {
          animation: fadeInUp linear both;
          animation-timeline: view();
          animation-range: entry 10% cover 30%;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

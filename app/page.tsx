import type { SVGProps } from "react";

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-xl font-semibold tracking-tight text-[#0F6E56] ${className}`}>NutriAI</span>
  );
}

function IconMenuSemanal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDiario(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

function IconNevera(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M4 10h16M9 6v4M12 14v6" strokeLinecap="round" />
    </svg>
  );
}

function IconProgreso(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M3 3v18h18" strokeLinecap="round" />
      <path d="M7 16l4-4 4 4 5-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAjuste(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path
        d="M4 4v5h.01M4 9a5 5 0 0 0 5 5M20 20v-5h-.01M20 15a5 5 0 0 0-5-5M9 20h5M15 4h-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InitialAvatar({ initials, tone }: { initials: string; tone: "a" | "b" | "c" }) {
  const tones = {
    a: "bg-emerald-100 text-[#0F6E56]",
    b: "bg-teal-100 text-[#0F6E56]",
    c: "bg-green-100 text-[#0F6E56]",
  } as const;
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${tones[tone]}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56]">
            <Logo />
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#"
              className="rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-[#0F6E56] sm:px-4"
            >
              Entrar
            </a>
            <a
              href="#precios"
              className="rounded-full border border-neutral-200 px-3 py-2 text-sm font-medium text-[#0F6E56] transition hover:border-[#0F6E56]/40 hover:bg-emerald-50/60 sm:px-4"
            >
              Empezar gratis
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              Tu nutricionista con IA que se adapta cada semana a cómo te sientes
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
              Plan nutricional personalizado, menús semanales con recetas, y una IA disponible 24h para resolver tus
              dudas.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <a
                href="#precios"
                className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#0F6E56] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#0d5f4a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56] sm:w-auto"
              >
                Quiero mi plan gratis
              </a>
              <p className="text-sm text-neutral-500">Sin tarjeta de crédito · Cancela cuando quieras</p>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="border-y border-neutral-100 bg-neutral-50/80 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[#0F6E56]">
              Historias reales
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Personas como tú ya notan el cambio
            </p>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <li className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <InitialAvatar initials="LM" tone="a" />
                  <div>
                    <p className="font-semibold text-neutral-900">Laura Méndez</p>
                    <p className="text-sm font-medium text-[#0F6E56]">−6 kg en 4 meses</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  “Por fin entiendo qué comer sin obsesionarme. Los menús encajan con mi trabajo y Nuria me calma cuando
                  me pongo nerviosa con la báscula.”
                </p>
              </li>
              <li className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <InitialAvatar initials="JR" tone="b" />
                  <div>
                    <p className="font-semibold text-neutral-900">Javier Ruiz</p>
                    <p className="text-sm font-medium text-[#0F6E56]">Colesterol en rango</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  “Mi médico notó la mejora antes que yo. El diario clínico me ayudó a ser constante y la IA responde
                  dudas tontas a las 2 de la mañana.”
                </p>
              </li>
              <li className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <InitialAvatar initials="AC" tone="c" />
                  <div>
                    <p className="font-semibold text-neutral-900">Ana Costa</p>
                    <p className="text-sm font-medium text-[#0F6E56]">Más energía, menos hinchazón</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  “Soy vegetariana y siempre me faltaba proteína. El plan semanal y la calculadora de nevera me salvaron
                  el fin de semana.”
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Funcionalidades */}
        <section id="funcionalidades" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[#0F6E56]">Funcionalidades</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Todo lo que necesitas en un solo lugar
          </p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Menú semanal personalizado",
                desc: "Recetas equilibradas según tus objetivos, alergias y ritmo de vida.",
                Icon: IconMenuSemanal,
              },
              {
                title: "Chat con Nuria (IA)",
                desc: "Pregunta lo que quieras sobre porciones, sustitutos o motivación.",
                Icon: IconChat,
              },
              {
                title: "Diario clínico diario",
                desc: "Registra síntomas, sueño y digestión para afinar tu plan con datos.",
                Icon: IconDiario,
              },
              {
                title: "Calculadora de nevera",
                desc: "Introduce lo que tienes y obtén ideas de comidas sin desperdiciar.",
                Icon: IconNevera,
              },
              {
                title: "Seguimiento de progreso",
                desc: "Visualiza peso, medidas y hábitos con gráficas claras y sin ruido.",
                Icon: IconProgreso,
              },
              {
                title: "Ajuste automático semanal",
                desc: "Tu plan evoluciona según cómo te sientes y lo que va funcionando.",
                Icon: IconAjuste,
              },
            ].map(({ title, desc, Icon }) => (
              <li
                key={title}
                className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition hover:border-[#0F6E56]/20"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#0F6E56]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Precios */}
        <section id="precios" className="scroll-mt-24 border-t border-neutral-100 bg-neutral-50/80 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[#0F6E56]">Precios</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Elige el plan que encaje contigo
            </p>
            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
              {/* Básico */}
              <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-900">Básico</h3>
                <p className="mt-2 text-sm text-neutral-600">Para empezar con buen pie.</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-neutral-900">9,99€</span>
                  <span className="text-sm text-neutral-500">/mes</span>
                </p>
                <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm text-neutral-600">
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Menú semanal con 12 recetas
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Chat con Nuria (límite mensual)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Seguimiento de peso básico
                  </li>
                </ul>
                <a
                  href="#"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-[#0F6E56] hover:text-[#0F6E56]"
                >
                  Elegir Básico
                </a>
              </article>

              {/* Pro — destacado */}
              <article className="relative flex flex-col rounded-2xl border-2 border-[#0F6E56] bg-white p-8 shadow-lg ring-1 ring-[#0F6E56]/10 lg:scale-[1.02] lg:shadow-xl">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0F6E56] px-3 py-1 text-xs font-semibold text-white">
                  Más popular
                </span>
                <h3 className="text-lg font-semibold text-neutral-900">Pro</h3>
                <p className="mt-2 text-sm text-neutral-600">Equilibrio entre guía y autonomía.</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-neutral-900">19,99€</span>
                  <span className="text-sm text-neutral-500">/mes</span>
                </p>
                <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm text-neutral-600">
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Todo lo del plan Básico
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Chat con Nuria ilimitado
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Diario clínico y calculadora de nevera
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Ajuste automático semanal del menú
                  </li>
                </ul>
                <a
                  href="#"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#0F6E56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d5f4a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56]"
                >
                  Empezar con Pro
                </a>
              </article>

              {/* Élite */}
              <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-900">Élite</h3>
                <p className="mt-2 text-sm text-neutral-600">Máximo acompañamiento y datos.</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-neutral-900">39,99€</span>
                  <span className="text-sm text-neutral-500">/mes</span>
                </p>
                <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm text-neutral-600">
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Todo lo del plan Pro
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Informes mensuales exportables
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-[#0F6E56]" aria-hidden>
                      ✓
                    </span>
                    Prioridad en nuevas funciones y soporte
                  </li>
                </ul>
                <a
                  href="#"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-[#0F6E56] hover:text-[#0F6E56]"
                >
                  Elegir Élite
                </a>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
                Nutrición personalizada con IA, pensada para encajar en tu vida real.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Producto</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a href="#precios" className="text-neutral-600 transition hover:text-[#0F6E56]">
                      Precios
                    </a>
                  </li>
                  <li>
                    <a href="#funcionalidades" className="text-neutral-600 transition hover:text-[#0F6E56]">
                      Funcionalidades
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Empresa</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-neutral-600 transition hover:text-[#0F6E56]">
                      Sobre nosotros
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-neutral-600 transition hover:text-[#0F6E56]">
                      Contacto
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Legal</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-neutral-600 transition hover:text-[#0F6E56]">
                      Privacidad
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-neutral-600 transition hover:text-[#0F6E56]">
                      Términos
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-neutral-100 pt-8 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} NutriAI. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

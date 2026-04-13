"use client";

import Link from "next/link";

const features = [
  {
    title: "Menú semanal personalizado",
    description:
      "7 días de platos adaptados a tu objetivo, intolerancias y tipo de dieta. Con ingredientes en gramos en crudo.",
    icon: (
      <path
        d="M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm3 6h6m-6 4h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Chat con Nuria 24h",
    description:
      "Resuelve dudas, gestiona síntomas y recibe apoyo emocional cuando lo necesitas. Nuria nunca te juzga.",
    icon: (
      <path
        d="M8 10h8m-8 4h5M21 12a8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 8 19l-5 2 2-5A8.5 8.5 0 1 1 21 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Ingredientes en gramos en crudo",
    description:
      "Todos los pesos antes de cocinar, como hacen los nutricionistas de verdad. Sin confusiones ni errores.",
    icon: (
      <path
        d="M4 14h16M6 14V8a6 6 0 1 1 12 0v6m-7 0v5m-2-2h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Calculadora de nevera",
    description:
      "Dile a Nuria qué tienes en casa y te genera un plato que cuadra tus macros con lo que tienes disponible.",
    icon: (
      <path
        d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 8h10M10 7h1m0 8h1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Diario clínico diario",
    description:
      "Registra cómo te sientes cada día. Nuria usa esos datos para mejorar tu plan semana a semana.",
    icon: (
      <path
        d="M7 3h10a2 2 0 0 1 2 2v15l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Zm3 6h4m-4 4h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Ajuste automático semanal",
    description:
      "Cada domingo Nuria analiza tu progreso y adapta el menú. El plan mejora solo, sin que hagas nada.",
    icon: (
      <path
        d="M20 6v5h-5M4 18v-5h5M6.5 10A6 6 0 0 1 17 7l3 4M17.5 14A6 6 0 0 1 7 17l-3-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
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
            <a href="#como-funciona" className="transition hover:text-[#0F6E56]">
              Cómo funciona
            </a>
            <a href="#precios" className="transition hover:text-[#0F6E56]">
              Precios
            </a>
            <Link href="/login" className="transition hover:text-[#0F6E56]">
              Entrar
            </Link>
          </div>
          <Link
            href="/registro"
            className="rounded-full bg-[#0F6E56] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d604b]"
          >
            Empezar gratis
          </Link>
        </nav>
      </header>

      <main className="pt-24">
        <section className="reveal px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mx-auto inline-flex rounded-full bg-[#E8F5F0] px-4 py-1.5 text-sm font-medium text-[#0F6E56]">
              ✦ Nutrición personalizada con IA
            </p>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Tu plan nutricional que cambia cada semana
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-neutral-600">
              Nuria, tu nutricionista IA, aprende de ti cada semana y adapta tu menú según cómo te sientes.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/registro"
                className="rounded-full bg-[#0F6E56] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0d604b]"
              >
                Empezar gratis →
              </Link>
              <a
                href="#como-funciona"
                className="rounded-full border border-[#0F6E56]/30 px-7 py-3 text-sm font-semibold text-[#0F6E56] transition hover:border-[#0F6E56]"
              >
                Ver cómo funciona
              </a>
            </div>
            <p className="mt-5 text-sm text-neutral-500">Sin tarjeta · Cancela cuando quieras · Primer menú en 60 segundos</p>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                "2 min para tu primer menú",
                "+500 recetas personalizadas",
                "Ajuste semanal automático",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-[#F8F9FA] px-5 py-4 text-sm font-semibold text-[#0F6E56]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="reveal bg-[#F8F9FA] px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Tres pasos. Un plan que funciona.</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                ["01", "Cuéntale a Nuria cómo eres", "Rellena tu perfil clínico en 3 minutos"],
                ["02", "Recibe tu menú personalizado", "Con ingredientes en gramos en crudo y recetas incluidas"],
                ["03", "Nuria se adapta cada semana", "Según tu feedback, síntomas y progreso real"],
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

        <section id="funcionalidades" className="reveal px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              Todo lo que necesitas para comer bien de verdad
            </h2>
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

        <section className="reveal bg-[#E8F5F0] px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Personas reales, resultados reales</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                ["LM", "Laura Méndez", "−6 kg en 4 meses", "Sigo el plan sin sentir ansiedad. Es práctico y fácil."],
                ["JR", "Javier Ruiz", "Más energía diaria", "Mi digestión ha mejorado y mantengo constancia semanal."],
                ["AC", "Ana Costa", "Menos hinchazón", "Nuria se adapta a mis síntomas y me da seguridad al comer."],
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
                  <p className="mt-4 text-sm text-neutral-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="precios" className="reveal px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Elige tu plan</h2>
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F9FA] p-1 text-sm">
                <span className="rounded-full bg-white px-4 py-1.5 font-semibold text-[#0F6E56]">Mensual</span>
                <span className="rounded-full px-4 py-1.5 text-neutral-600">Anual</span>
                <span className="rounded-full bg-[#0F6E56] px-2.5 py-1 text-xs font-semibold text-white">Ahorra 30%</span>
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                ["Básico", "9,99€", ["✓ Menú semanal", "✓ Chat limitado", "— Ajuste semanal"]],
                ["Pro", "19,99€", ["✓ Menú + recetas", "✓ Chat ilimitado", "✓ Ajuste semanal"]],
                ["Élite", "39,99€", ["✓ Todo Pro", "✓ Seguimiento avanzado", "✓ Prioridad soporte"]],
              ].map(([name, price, items]) => (
                <article
                  key={name}
                  className={`rounded-2xl bg-white p-7 shadow-sm ${
                    name === "Pro" ? "border-2 border-[#0F6E56]" : "border border-neutral-200"
                  }`}
                >
                  <h3 className="text-xl font-semibold">{name}</h3>
                  <p className="mt-4 text-4xl font-bold text-[#0F6E56]">{price}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {(items as string[]).map((item) => (
                      <li key={item} className={item.startsWith("—") ? "text-neutral-400" : "text-neutral-700"}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal bg-[#0F6E56] px-4 py-16 text-center text-white sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold sm:text-5xl">¿Lista para empezar?</h2>
            <p className="mt-4 text-white/85">Tu primer menú personalizado en menos de 2 minutos</p>
            <Link
              href="/registro"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0F6E56]"
            >
              Crear mi cuenta gratis
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F6E56] px-4 py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-bold">NutriAI</p>
          <div className="flex gap-5 text-sm text-white/85">
            <a href="#" className="hover:text-white">
              Privacidad
            </a>
            <a href="#" className="hover:text-white">
              Términos
            </a>
            <a href="#" className="hover:text-white">
              Cookies
            </a>
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
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

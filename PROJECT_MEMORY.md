# NutriAI — memoria del proyecto

Documento vivo: actualízalo al cerrar hitos o cambiar prioridades.

## Qué es NutriAI

Plataforma web de **nutrición personalizada con IA**: planes adaptados, menús semanales con recetas, chat con la asistente **Nuria**, diario clínico, calculadora de nevera, seguimiento y ajuste semanal automático.

## Stack técnico (estado actual)

| Área        | Elección                          |
|------------|------------------------------------|
| Framework  | Next.js **16.x** (App Router)      |
| UI         | React **19**, TypeScript **5**     |
| Estilos    | Tailwind CSS **4** (`@import "tailwindcss"`) |
| Fuentes    | Geist (Google Fonts via `next/font`) |

**Importante:** Next 16 puede diferir de tutoriales de Next 14. Antes de APIs nuevas, revisar `node_modules/next/dist/docs/` o la documentación oficial de tu versión.

## Qué está hecho ya

- **Landing principal** en `app/page.tsx`: navbar, hero, testimonios, 6 funcionalidades con SVG, pricing (Básico / Pro / Élite), footer.
- **Identidad visual base:** verde marca `#0F6E56`, fondo blanco, layout responsive.
- **Layout raíz:** `app/layout.tsx` + `app/globals.css` (tema Tailwind v4 inline).

## Estructura sugerida (próximas carpetas)

Cuando aparezcan rutas reales, orientación típica:

```
app/
  (marketing)/     → landing, legal (opcional)
  (app)/           → dashboard autenticado
  api/             → route handlers
components/        → UI reutilizable
lib/               → utilidades, clientes API, validación
```

No es obligatorio crear carpetas vacías hasta que haga falta.

## Roadmap por fases

### Fase 1 — Producto mínimo usable (MVP web)

1. **Rutas y navegación:** `/login`, `/registro` (o modal), enlaces del navbar/footer reales.
2. **Autenticación:** proveedor (Auth.js, Clerk, Supabase Auth, etc.) y protección de rutas.
3. **Esqueleto app tras login:** layout con sidebar o bottom nav móvil; página “Inicio” o “Mi plan”.
4. **Persistencia:** base de datos + modelo de usuario / suscripción alineado con planes de precios.

### Fase 2 — Valor nutricional

5. **Menú semanal:** modelo de datos (día, comidas, recetas) y vista de lectura.
6. **Chat Nuria:** integración con API de IA + límites por plan (Básico vs Pro).
7. **Diario clínico:** formulario diario simple y listado histórico.

### Fase 3 — Diferenciación

8. **Calculadora de nevera** y **seguimiento de progreso** (gráficas).
9. **Ajuste semanal:** job o acción manual que regenere propuestas según datos + feedback del usuario.
10. **Pagos:** Stripe (o similar) acoplado a planes Básico / Pro / Élite.

### Fase 4 — Calidad y escala

11. Tests (Playwright en flujos críticos, Vitest/Jest en lógica).
12. SEO y metadatos por página; `metadata` en layout/páginas marketing.
13. Observabilidad (logs, errores) y políticas de privacidad/RGPD en contenido legal.

## Sistema de trabajo recomendado

### Git (inicializar cuando quieras versionar)

```bash
git init
git add .
git commit -m "chore: landing NutriAI y memoria del proyecto"
```

**Ramas:** `main` estable; features en `feature/nombre-corto`. **Commits:** mensajes claros en presente (`feat:`, `fix:`, `chore:`).

### Flujo diario

1. Arrancar entorno: `npm install` (primera vez) → `npm run dev`.
2. Elegir **un** ítem del roadmap o un bug pequeño.
3. Implementar con cambios acotados; ejecutar `npm run lint` antes de commit.
4. Actualizar este archivo si cambia el alcance o una decisión importante (auth elegida, proveedor IA, etc.).

### Definición de “hecho” para una tarea

- Comportamiento verificado en navegador (móvil y escritorio si aplica).
- Sin errores de lint en archivos tocados.
- Enlaces nuevos no apuntan a `#` salvo placeholder documentado.

### Comunicación con el asistente (Cursor)

- Regla global: `.cursor/rules/nutriai.mdc` (`alwaysApply`).
- Contexto extendido: este archivo (`PROJECT_MEMORY.md`).
- Instrucciones técnicas Next: `AGENTS.md`.

---

*Última actualización al documentar la landing y la memoria del proyecto.*

# 11 — Architecture, Redesigned

> Doc 10 was a sound skeleton. This document audits it without mercy and redesigns it to the
> tier of a true digital flagship. **This supersedes doc 10 where they conflict.**

The test for "world-class luxury" is not "does it look expensive." It is: *does every interaction
feel inevitable, weightless, and unbroken — on a three-year-old phone, on a slow train, for a
person using a screen reader — while the brand never once drops character.* Measured against that
bar, doc 10 has twelve real weaknesses. Each is named, rated, and fixed.

---

## PART A — The weakness audit

Severity: **▲ Critical** (caps the ceiling at "nice") · **■ Major** (visible compromise) ·
**• Minor** (polish/debt).

### A1 · Route transitions were hand-waved ▲
Doc 10 said "`AnimatePresence` + `template.tsx`" for the signature deepen/submerge. **This does
not work in the App Router** — the outgoing page unmounts immediately on navigation; there is no
exit animation. The single most important luxury interaction (one continuous mind between scenes)
was unsolved. → **Fix: B3, the Transition System.**

### A2 · Scroll feel was never addressed ▲
The brand says *"the scroll is a breath"* ([UX](./02-ux-guidelines.md)) yet doc 10 specifies
nothing about scroll. Native scroll is mechanical and abrupt — the opposite of the house. A
weighted, inertial scroll is core to the feeling. → **Fix: B5, Scroll as Breath (Lenis).**

### A3 · Many competing rAF loops, no device reality ▲
Void rAF + cursor rAF + Framer scroll listeners + grain animation run independently. On a phone
this means thermal throttle, fan spin, battery drain — *the antithesis of luxury*. "Premium
performance" was treated as Lighthouse score only, not **battery, heat, and sustained FPS**.
→ **Fix: B4, the Motion Conductor (one ticker, adaptive quality).**

### A4 · Framer Motion everywhere = bundle bloat ■
Using full Framer Motion for every reveal inflates client JS. Doc 10 never mentioned `LazyMotion`,
the `m` component, or using CSS for trivial reveals. → **Fix: B1 + B4.**

### A5 · Type & media — the actual luxury surface — were under-specified ▲
Luxury is *carried* by imagery and typography. Doc 10 had `public/media` and "EB Garamond
(placeholder)". Missing: art-directed responsive images, a shared color grade (the photography
LUT), LQIP/blurhash placeholders, aspect-locking (CLS), film/video strategy, a licensed display
serif, and **metric-matched font fallbacks** to kill the FOUT layout shift. → **Fix: B6.**

### A6 · Immersive audio was a stub ■
`lib/sound` + a toggle is not an audio *experience*. No Web Audio graph, per-collection beds,
crossfade-on-navigation, gesture-gated autoplay, or persisted preference. → **Fix: B7.**

### A7 · No internationalization or global commerce readiness ■
A luxury house is global; retrofitting i18n/locale-routing/multi-currency later is painful and
changes routing. Doc 10 precluded nothing on purpose but *anticipated* nothing either.
→ **Fix: B8.**

### A8 · Accessibility was claimed, not engineered ▲
"AA + reduced-motion" is table stakes. Missing: **route-change focus management + live-region
announcement** (the App Router does not do this; SPA navigations are silent to screen readers),
persisted motion/sound prefs for correct first paint, skip links, a *designed* reduced-motion
experience (not just disabled animation), and the missing `loading/error/global-error` states.
→ **Fix: B9.**

### A9 · No quality gates — the "modular/maintainable" claim was hollow ▲
Zero testing, CI, visual regression, a11y automation, or field observability. A world-class system
is *provably* world-class, continuously. → **Fix: B11.**

### A10 · Token duplication & weak modularity ■
The design system lived as vanilla CSS/JS *and* would be re-expressed in the app — two sources of
truth drifting apart. "Modular architecture" with everything in one `src/` is shallow.
→ **Fix: B2, workspace packages; B1, Tailwind v4 `@theme`.**

### A11 · Content model too thin; no caching/data strategy ■
A `Fragrance` with a few fields can't drive variants/inventory, breakpoint media sets, the
unfolding *arc timing*, per-item SEO, or ordered collection arcs. No cache-tag/revalidation
strategy. → **Fix: B6 + B10.**

### A12 · State hydration, consent, and security unspecified •→■
"Zustand or context" ignores the classic **SSR hydration mismatch** for a persisted cart; the
cookie banner didn't actually *gate* anything; no CSP/security headers for a brand whose currency
is trust. → **Fix: B9 + B11.**

> **Meta-weakness:** doc 10 optimized for *structure* and forgot that luxury is **felt in the
> seams** — the transition, the scroll, the first 200ms of a font, the moment audio fades between
> rooms. The redesign moves those seams to the center.

---

## PART B — The redesign

### B1 · Stack, upgraded

| Concern | v1 (doc 10) | v2 (this doc) | Why |
|---|---|---|---|
| Tailwind | v3 JS config, `theme.extend` | **Tailwind v4, CSS-first `@theme`** consuming token vars | One source of truth; no JS/CSS duplication. |
| Transitions | AnimatePresence (broken) | **View Transitions API** (`next-view-transitions`) + a deepen overlay | Real cross-route morphs + the brand submerge. |
| Scroll | (none) | **Lenis**, reduced-motion-aware, conductor-driven | "The scroll is a breath." |
| Motion runtime | Framer everywhere | **`LazyMotion` + `m`**; CSS for trivial reveals; Framer for orchestration | Smaller bundle, same expressiveness. |
| Frame budget | many rAF | **one Conductor ticker**, adaptive quality | Battery, heat, sustained 60fps. |
| Rendering | RSC + ISR | **+ PPR (Partial Prerendering)** | Static shell + dynamic islands (cart, locale). |
| Audio | `<audio>` + toggle | **Web Audio graph** | Crossfading, layered, gesture-gated. |
| i18n | (none) | **next-intl + `[locale]` segment + middleware** | Global house, hreflang, currency. |
| State | "Zustand or context" | **Zustand + persist, SSR-safe hydration**; prefs in cookies | No hydration flash; correct first paint. |
| Monorepo | single `src/` | **pnpm workspaces + Turborepo**, design system as packages | True modularity; versioned, testable, reusable. |
| Quality | (none) | **Vitest · Testing Library · Storybook · Playwright + visual-regression · axe · Lighthouse-CI · Sentry · Web-Vitals RUM** | Provably world-class, continuously. |

### B2 · Repository structure (workspaces)

The design system becomes **real, versioned packages** — killing the duplication (A10) and making
atmosphere reusable across future surfaces (campaign microsites, native, in-store).

```
dk/
├── docs/                         # the constitution (incl. this redesign)
├── design-system/ · prototypes/  # kept as canonical spec + reference demos
│
├── apps/
│   └── web/                      # the Next.js flagship
│       ├── src/app/              # routes (doc-09 journey) — now under [locale]/
│       │   ├── [locale]/
│       │   │   ├── (experience)/ (house)/ (commerce)/ (account)/ (legal)/
│       │   │   ├── layout.tsx · page.tsx
│       │   │   ├── loading.tsx · error.tsx · not-found.tsx     # designed, in-character
│       │   │   └── template.tsx                                # per-route surface-in
│       │   ├── global-error.tsx · sitemap.ts · robots.ts · manifest.ts
│       │   └── api/ (newsletter · checkout · og · revalidate)
│       ├── src/features/         # route composition (fragrance, library, discover, …)
│       ├── src/lib/              # content adapter · seo · commerce · analytics · consent
│       ├── src/server/           # data access, cache tags, env (server-only)
│       ├── content/              # typed fragrances/collections + MDX journal
│       ├── messages/             # i18n locale catalogs
│       └── tests/                # e2e + visual regression (Playwright)
│
├── packages/
│   ├── tokens/                   # ▲ single source of truth: CSS vars + typed TS exports
│   ├── ui/                       # primitives (Button, Fragment, Field…) + Storybook
│   ├── atmosphere/               # Void · Surfacing · SceneTransition · CursorPresence · Sound
│   ├── motion/                   # the Conductor, variants, easings, reduced-motion, Lenis glue
│   └── config/                   # shared eslint / ts / tailwind-preset / prettier
│
├── turbo.json · pnpm-workspace.yaml · package.json · .github/workflows/
```

`packages/tokens` is consumed by `packages/ui`, `packages/atmosphere`, and the Tailwind v4 preset
— so a token change propagates everywhere, once. `data-collection` retint still cascades via CSS.

### B3 · The Transition System (the crown jewel) — fixes A1

The signature: navigation feels like *closing your eyes between two memories*, never a page load.
A three-part mechanism, each independently degradable:

1. **Persistent shell.** Void, Grain, Vignette, Nav, the audio engine, the Conductor, and the
   `<SceneTransition>` overlay live in the **root layout** and never unmount across navigation
   (App Router keeps layouts mounted). The Void canvas therefore *continues* — the world is
   unbroken by definition.
2. **The deepen overlay (universal).** On navigation start (router lifecycle), `<SceneTransition>`
   swells a darkness toward `--ink` and the Void runs `deepen()`; the new route mounts behind it
   and **surfaces** as the overlay clears. This works in every browser and is the baseline.
3. **Shared-element morph (progressive).** Where supported, the **View Transitions API**
   (`next-view-transitions`) morphs shared elements between routes — a Library `Fragment` image
   carries a `view-transition-name` that the Fragrance hero re-claims, so the state you tapped
   *expands* into the room. Unsupported → gracefully falls back to (2).
4. **Reduced motion / no-JS:** instant, dignified cut. No deepen, no morph. Content is already
   server-rendered, so navigation is always correct without any of this.

`deepen()` becomes **event-driven** (a context/emitter the router lifecycle fires), not a brittle
global imperative call.

### B4 · The Motion Conductor — fixes A3, A4

One module (`packages/motion`) owns **a single `requestAnimationFrame` loop**. Everything that
needs per-frame time subscribes: the Void renderer, Lenis, cursor presence, scroll-driven values.

- **Adaptive quality.** The Conductor measures rolling FPS and emits a `quality` signal
  (`high | medium | low`). Initial level is seeded from `Save-Data`, the Battery API (low battery →
  lower), `deviceMemory`/`hardwareConcurrency`, and `prefers-reduced-motion`. The Void reads it to
  scale mote count / disable haze; effects downgrade *before* the user feels jank.
- **Pause on hidden / offscreen**, resume on focus (already in `void.js`; centralized here).
- **Bundle:** `LazyMotion` loads Framer features on demand; the `m` component ships minimal;
  trivial reveals use CSS `@starting-style`/transitions, not JS.

### B5 · Scroll as Breath — fixes A2

**Lenis** provides weighted, inertial smooth scroll, ticked by the Conductor (not its own rAF) and
fed into Framer's `useScroll`. Hard rules so it never harms usability:
- **Disabled entirely under `prefers-reduced-motion`** → native scroll.
- Anchor links, `scrollIntoView`, focus-on-tab, and browser scroll-restoration all still work
  (Lenis `scrollTo` integration); modals/menus get `data-lenis-prevent`.
- Never hijacks scroll *direction* or distance — it only adds easing/weight.

### B6 · Media & Type as art direction — fixes A5, A11 (media)

**Imagery (the luxury surface):**
- `next/image` with **art-directed sources** per breakpoint (not just resized — *recomposed*, per
  [UI §7](./03-ui-guidelines.md)); AVIF→WebP→JPEG.
- **LQIP/Blurhash** placeholders so images *develop* in (on-brand: things surface) — never pop or
  CLS. Every image **aspect-locked**.
- **One color grade** (the photography LUT, [Photography §4](./07-photography-guidelines.md))
  applied at the asset-build step so the whole site is one remembered world, not a stock library.
- **Film/video** via a `<FilmBackdrop>`: poster-first, lazy, muted, `playsinline`, paused offscreen
  and under Save-Data/reduced-data; never blocks LCP.
- DAM/CMS-ready: media is a typed set on content, resolved through the content adapter.

**Type (the memory voice):**
- A **licensed variable display serif** is the art direction (Canela / GT Sectra register);
  EB Garamond remains the open fallback in dev. Self-hosted via `next/font/local`.
- **Metric-matched fallback** (`size-adjust`, `ascent/descent-override`) so the swap is
  *imperceptible* — zero layout shift, the FOUT seam closed. Variable axes for fluid optical sizing.

**Content model (depth):** `Fragrance` carries `state`, `arc` *with timing* (drives the unfolding
animation), `composition`, `collection` (ordered arc position), **`variants`** (size/inventory),
**`media`** (breakpoint sets + grade + placeholder), `price` as **`Money`**, and `seo`. Collections
are *ordered emotional sequences*, not lists.

### B7 · The Audio Engine — fixes A6

`packages/atmosphere` ships a **Web Audio** graph in `lib/sound`:
- A low **ambient bed per collection**, **crossfaded on navigation** (rooms change, the air
  changes) — coordinated with the Transition System.
- Subtle **interaction swells** (entering a fragrance) on the same timing as the visual reveal.
- **Gesture-gated** (browser autoplay policy), **opt-in only**, preference **persisted** (cookie →
  correct on next visit), complete in silence. Master gain ramps; no clicks/dings ever.

### B8 · Internationalization & global commerce — fixes A7

- **`[locale]` route segment + `next-intl` + middleware** for locale detection/routing; message
  catalogs in `messages/`; **hreflang** + localized metadata/OG.
- **`Money` type + currency formatting** from day one; commerce adapter is currency/locale-aware.
- Even if launch ships one locale, the structure *anticipates* many — no painful retrofit.

### B9 · Accessibility as a system — fixes A8, A12 (state)

- **Route-change focus + announcement:** on navigation, move focus to the new `<main>` heading and
  announce the new page title via an `aria-live` region (a `RouteAnnouncer`) — SPA nav becomes
  legible to screen readers.
- **Skip-to-content**; designed, visible `:focus-visible`; AA contrast enforced in CI (axe).
- **Preferences persisted in cookies** (motion, sound, consent) → read on the server so the **first
  paint is already correct** (no flash, no hydration mismatch).
- **A designed reduced-motion experience**, not a disabled one: the emotion survives in type,
  light, image, and word (already the doctrine — now a tested deliverable).
- **Every route has `loading.tsx` (atmosphere, never a spinner), `error.tsx` and `global-error.tsx`
  (in character), and `not-found.tsx`** ("This memory hasn't formed yet").
- **Kept cart:** Zustand + `persist` with the **`skipHydration` + rehydrate-on-mount** pattern, so
  the server renders an empty-but-stable cart and the client hydrates without mismatch.

### B10 · Rendering, data & caching — fixes A11 (caching)

- **PPR**: a static prerendered shell (the room) with **dynamic islands** (cart count, locale,
  personalization) streamed in — premium TTFB without sacrificing dynamism.
- **RSC-first; the LCP element is always server-rendered** text or image. Atmosphere is strictly
  enhancement, dynamically imported (`ssr:false` where it's purely visual).
- **`data-collection` is set on the server** for fragrance/collection routes → the accent light is
  correct on first paint, no flash.
- **Content adapter + `unstable_cache` with tags**; `revalidateTag` via an `api/revalidate`
  webhook → instant, surgical updates when content/inventory changes.

### B11 · Quality, observability & trust — fixes A9, A12 (security)

- **Testing pyramid:** Vitest (units, content-model invariants) · Testing Library + **Storybook**
  (every primitive, including reduced-motion and per-collection states) · **Playwright** e2e +
  **visual regression** (the atmosphere is snapshot-guarded) · **axe-core** a11y in CI.
- **CI gates:** typecheck, lint, test, **Lighthouse-CI with enforced budgets** (build fails if
  perf/a11y regress), visual-diff review, preview deploy per PR.
- **Observability:** **Web-Vitals RUM** (field LCP/CLS/INP → analytics) and **Sentry** — premium
  performance is *measured in the wild*, not assumed in the lab.
- **Trust:** strict **CSP + security headers** (`next.config` / middleware), privacy-first
  analytics, and **consent that actually gates** analytics and any non-essential audio/storage.

### B12 · Performance budgets (tightened)

| Metric | Target |
|---|---|
| LCP (server-rendered) | **< 1.8s** (4G, mid Android) |
| CLS | **< 0.02** (metric-matched fonts + aspect-locked media) |
| INP | **< 150ms** |
| First meaningful breath | **< 1.5s** |
| Sustained atmosphere FPS | **60**, adaptive-degrading before drops |
| Initial client JS (route) | **< 110KB gz** (LazyMotion, RSC, dynamic atmosphere) |
| Lighthouse (all categories) | **≥ 98**, enforced in CI |

### B13 · Restraint — what we deliberately *do not* do

World-class is also knowing where to stop; more tools is not more luxury.
- **No global state manager beyond Kept + preferences.** Server data stays on the server.
- **No 3D/WebGL engine** unless a specific scene earns it — the Void is Canvas 2D for a reason
  (battery, reach, taste). No physics libraries, no particle frameworks.
- **No design-system reinvention** — tokens are the law; components compose them.
- **No CMS at launch** unless editing cadence demands it (the adapter makes it a later, no-rewrite
  decision).
- **No animation for its own sake** — every motion is breath or meaning, or it is cut.

### B14 · Revised build sequence

1. **Monorepo scaffold** — pnpm workspaces + Turborepo; `packages/tokens` (port the design system);
   `packages/config`; `apps/web` (Next + TS + Tailwind v4 `@theme` + next-intl + CI gates).
2. **Motion foundation** — the **Conductor**, Lenis, `LazyMotion`, reduced-motion, `RouteAnnouncer`.
3. **Atmosphere package** — port Void → adaptive quality; Grain/Vignette; **Transition System**
   (deepen overlay + View Transitions); the **Audio Engine** (skeleton).
4. **`packages/ui`** — primitives + Storybook (every state, a11y-checked).
5. **The Threshold** — `<Surfacing/>` over the persistent Void; server-rendered LCP core.
6. **Vertical slice** — one full `/fragrance/[slug]` (Undertow): server content, art-directed
   media pipeline, the unfolding arc, shared-element morph in, Kept panel.
7. **Drift** — Library + Collection (ordered arcs, morph hand-off).
8. **Commerce spine** — per-release purchase/pre-order → focused Checkout → Confirmed (Stripe +
   thin datastore behind the adapter, SSR-safe, consent-gated). Full model:
   [doc 12 — Commerce & Drops](./12-commerce-architecture.md).
9. **House + Journal (MDX)**, then **the Necessary** (legal/utility, designed route-states).
10. **Hardening** — SEO/JSON-LD/sitemap/OG, security headers, Lighthouse-CI + visual-regression
    green, RUM live.

> Spine first, seams obsessed over. The descent must feel inevitable before the periphery is
> filled — and the seams (transition, scroll, type swap, audio crossfade) are where the verdict
> "world-class" is actually won.

---

## The test (for the architecture itself)

> *On a mid-range phone, on a slow connection, for someone who has turned motion off — does moving
> through Sensorium still feel like one unbroken, weightless act of remembering, with the brand
> never once dropping character?* If any seam answers "no," it is not finished.

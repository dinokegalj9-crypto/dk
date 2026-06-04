# 10 — Project Architecture

> The codebase is the constitution made executable. Every structural decision serves the same
> end: an unbroken emotional descent that is also fast, accessible, and maintainable.

This document defines the **project structure** for the Sensorium build — the stack, the folder
layout, the rendering and data strategy, and the conventions — **before any implementation code
is written.** It is a proposal to approve, not a finished app.

---

## 1. Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js (App Router, latest)** | RSC for SEO + performance; file-based routing maps 1:1 to [doc 09](./09-website-architecture.md); streaming, Metadata API, image/font optimization. |
| Language | **TypeScript (strict)** | Typed content models (Fragrance, Collection, State) are the backbone of the modular architecture. |
| Styling | **Tailwind CSS** | Utility layout speed, but **mapped to our design tokens** so nothing diverges from the design system. |
| Animation | **Framer Motion** | Declarative orchestration, `AnimatePresence` for scene transitions, scroll-linked motion, first-class `prefers-reduced-motion`. |
| Atmosphere | **Canvas 2D + CSS** (the Void) | The Void stays canvas for performance; not every effect belongs in React. |
| Hosting | **Vercel (recommended)** | Native Next.js: edge, ISR, image CDN, analytics, preview deploys. |

**Non-negotiable cross-cutting requirements** (from the brief): premium performance, responsive,
SEO-optimized, smooth animations, modular architecture. Each has a dedicated section below
(§5–§11) describing how the structure delivers it.

---

## 2. How the existing work ports in

Nothing we've built is thrown away — it becomes the source of truth the app consumes:

| Already built | Becomes |
|---------------|---------|
| `design-system/css/tokens.css` | `src/styles/tokens.css` → imported in `globals.css`; **Tailwind theme maps to these CSS variables** (single source of truth). |
| `design-system/css/base.css` | `globals.css` base layer (eigengrau ground, grain, vignette, focus). |
| `design-system/css/components.css` | Rebuilt as React **primitives** (`Button`, `Fragment`, `Field`…) using a thin `@layer components` for the complex bits (masks, grain) + Tailwind for layout. |
| `design-system/js/void.js` | `<Void/>` client component (canvas kept; dynamic-imported, `ssr:false`). |
| `prototypes/hero/*` | `<Surfacing/>` client component — Framer Motion drives the letter-assembly and submerge; the cursor-lamp stays a CSS-var mask driven by a `MotionValue`. |
| `design-system/js/sensorium.js` (surface system) | `<Surface/>` wrapper using Framer Motion `whileInView` + global `MotionConfig`. |
| `docs/01–09` | Authoritative spec the components implement and reference in code comments. |

> **Principle preserved:** *no raw values in components.* Tokens flow CSS variables → Tailwind
> theme → utilities/components. The whole world can still shift at once.

---

## 3. Directory structure

```
dk/
├── docs/                          # the constitution (reference; not shipped)
├── design-system/                 # canonical spec + standalone demos (kept)
├── prototypes/                    # hero & void prototypes (kept as reference)
│
├── public/
│   ├── fonts/                     # self-hosted EB Garamond + Inter (next/font/local)
│   ├── og/                        # generated social images
│   ├── favicon, icons, manifest assets
│   └── media/                     # optimized atmosphere imagery
│
├── src/
│   ├── app/                       # ROUTES (App Router) — mirrors doc 09
│   │   ├── layout.tsx             # root shell: <html>, fonts, Void, Grain, Nav, Footer, providers
│   │   ├── page.tsx               # /            Threshold (home)
│   │   ├── globals.css            # tokens + base + tailwind layers
│   │   ├── not-found.tsx          # 404 "This memory hasn't formed yet."
│   │   ├── sitemap.ts             # dynamic sitemap
│   │   ├── robots.ts
│   │   ├── manifest.ts
│   │   │
│   │   ├── (experience)/          # the descent — route group (no URL segment)
│   │   │   ├── the-library/page.tsx
│   │   │   ├── collections/[slug]/page.tsx
│   │   │   ├── fragrance/[slug]/page.tsx        # the emotional core
│   │   │   └── discover/page.tsx
│   │   │
│   │   ├── (house)/
│   │   │   ├── the-house/page.tsx
│   │   │   ├── the-method/page.tsx
│   │   │   └── journal/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/page.tsx
│   │   │
│   │   ├── (commerce)/
│   │   │   ├── kept/page.tsx                    # cart
│   │   │   ├── checkout/page.tsx                # the one place efficiency leads
│   │   │   └── confirmed/page.tsx               # "It's yours now."
│   │   │
│   │   ├── (account)/account/
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── saved/page.tsx
│   │   │
│   │   ├── (legal)/
│   │   │   ├── care/ · questions/ · shipping-returns/
│   │   │   ├── sustainability/ · stockists/ · contact/
│   │   │   └── privacy/ · terms/ · accessibility/
│   │   │
│   │   ├── search/page.tsx
│   │   ├── stay-close/page.tsx
│   │   └── api/                    # route handlers
│   │       ├── newsletter/route.ts
│   │       ├── checkout/route.ts
│   │       └── og/route.tsx        # dynamic OG image generation
│   │
│   ├── components/
│   │   ├── atmosphere/            # the world (mostly client)
│   │   │   ├── Void/              # canvas environment (ported from void.js)
│   │   │   ├── Surfacing/         # the hero "The Surfacing"
│   │   │   ├── Surface.tsx        # reveal-on-view wrapper
│   │   │   ├── Grain.tsx · Vignette.tsx
│   │   │   ├── CursorPresence.tsx
│   │   │   └── SceneTransition.tsx  # the deepen/submerge between routes
│   │   │
│   │   ├── primitives/            # the design system, as components
│   │   │   ├── Button.tsx · KeepButton.tsx
│   │   │   ├── Fragment.tsx · Keepsake.tsx
│   │   │   ├── Field.tsx · Tag.tsx · Divider.tsx
│   │   │   ├── PullQuote.tsx · Threshold.tsx · GlowWord.tsx
│   │   │   └── Text.tsx           # typographic scale primitives
│   │   │
│   │   ├── layout/
│   │   │   ├── VeilNav.tsx · Menu.tsx · Footer.tsx
│   │   │   ├── SoundToggle.tsx
│   │   │   └── CookieVeil.tsx
│   │   │
│   │   └── features/             # route-specific composition
│   │       ├── fragrance/        # FragranceEntry, Unfolding, Composition, KeepPanel, RelatedState
│   │       ├── library/          # LibraryDrift, StateCard, CollectionFilter
│   │       ├── discover/         # SamplingRitual, GuidedPrompt
│   │       ├── journal/          # JournalIndex, ArticleBody (MDX)
│   │       └── commerce/         # KeptList, CheckoutForm, OrderSummary
│   │
│   ├── lib/
│   │   ├── content/              # typed content API — CMS-swappable adapter
│   │   │   ├── fragrances.ts · collections.ts · journal.ts
│   │   │   └── source/           # local provider now; Sanity/Shopify later
│   │   ├── seo/                  # buildMetadata(), JSON-LD schema builders
│   │   ├── motion/              # tokens-as-variants, easings, durations, reducedMotion
│   │   ├── commerce/            # cart "Kept" store + checkout adapter
│   │   ├── sound/               # ambient bed controller
│   │   └── utils/               # cn(), format, env
│   │
│   ├── content/                  # the actual launch content
│   │   ├── fragrances/*.ts        # typed: state, arc, composition, price, media
│   │   ├── collections/*.ts
│   │   └── journal/*.mdx
│   │
│   ├── hooks/                     # useReducedMotion, useScrollProgress, useSummon, useSound, useKept
│   ├── types/                     # Fragrance, Collection, State, Article, Order, Money
│   ├── config/                    # site.ts (nav, metadata defaults), env.ts
│   └── styles/
│       ├── tokens.css             # ← ported design-system tokens (source of truth)
│       └── components.css         # @layer components: masks, grain, complex bits
│
├── tailwind.config.ts             # theme.extend mapped to CSS variables (tokens)
├── next.config.ts · postcss.config.js · tsconfig.json
├── eslint.config.mjs · .prettierrc · .env.example
└── package.json
```

---

## 4. Rendering & data strategy

The default is **React Server Components**; the client boundary is drawn tightly around
atmosphere so SEO and performance stay premium.

| Route type | Strategy |
|------------|----------|
| Fragrance, collection, library, house, journal | **SSG** via `generateStaticParams`; copy fully server-rendered for crawlers. |
| Commerce-affected (inventory, price) | **ISR** (revalidate) or dynamic where carts/sessions require. |
| Account, checkout | Dynamic, auth-gated, never cached. |
| Atmosphere (Void, Surfacing, Surface, Cursor) | **Client components**, dynamically imported, often `ssr:false`. |

**The rule:** all *content and meaning* renders on the server (legible without JS, crawlable,
accessible); the *atmosphere* is progressive enhancement layered on top. This is how an
immersive site stays SEO-strong — the emotion is enhancement, the substance is server-rendered.

---

## 5. Design tokens → Tailwind (single source of truth)

- `tokens.css` defines CSS custom properties (`--ink-800`, `--accent`, `--breath-slow`…).
- `tailwind.config.ts` maps `theme.extend` to those variables
  (`colors.ink.800 = "var(--ink-800)"`, `transitionTimingFunction.surface = "var(--ease-surface)"`,
  spacing/fontSize/etc.).
- Components use Tailwind utilities **or** semantic component classes — both resolve to the same
  variables. Per-collection `data-collection` retint still flows everywhere automatically.

---

## 6. Motion architecture

- **`lib/motion`** centralizes durations, easings, and reusable `Variants` that mirror the
  motion tokens (`breath`, `breath-slow`, `ease-surface`) — no ad-hoc values in components.
- Global **`<MotionConfig reducedMotion="user">`** in the root layout: every animation honors
  `prefers-reduced-motion` by default. *A still Sensorium is still Sensorium.*
- **Scene transitions** (the deepen/submerge) via `AnimatePresence` + a `template.tsx` per route
  group, coordinated with `SensoriumVoid.deepen()`.
- **Scroll-linked** reveals/parallax via `useScroll` + `useTransform`; the heavy ambient stays
  canvas (Void) for frame budget. Framer Motion orchestrates; it does not render particles.

---

## 7. Atmosphere as composable layers

The root layout stacks the world once; pages never re-mount it:

```
<Void/>            z:0   persistent environment (canvas)
<page content/>    z:1   server-rendered, the substance
<Vignette/>        z:500 edge darkening
<Grain/>           z:1000 film texture
<VeilNav/> <Menu/> <SoundToggle/> <CursorPresence/>   summoned chrome
```

Each is independent and individually removable — true modular atmosphere.

---

## 8. Content architecture (modular & swappable)

- Content is **typed** (`types/`) and accessed only through **`lib/content`** — never imported
  raw by pages. Today the provider reads local `content/*.ts` + `*.mdx`; tomorrow it can read a
  CMS (Sanity) or commerce backend (Shopify) **without touching a single page or component.**
- A `Fragrance` carries: `state`, `arc` (opens/becomes/stays), `composition`, `collection`,
  `price`, `media`, `seo`. This typed model is what makes the descent consistent everywhere.

---

## 9. SEO architecture

- **Metadata API**: `generateMetadata` per route; defaults in `config/site.ts`; canonical URLs.
- **Structured data** (`lib/seo`): `Product` (fragrances), `Organization`, `BreadcrumbList`,
  `Article` (journal) as JSON-LD.
- **`sitemap.ts` + `robots.ts`** generated from the content API.
- **Dynamic OG images** via `app/api/og` (the memory voice on the eigengrau ground).
- Semantic landmarks, real headings, descriptive alt text written as copy
  ([Content §7](./06-content-guidelines.md)). Server-rendered text is the SEO backbone.

---

## 10. Performance budget

Premium performance is a feature, not an afterthought (jank breaks the spell worse than any
wrong color — [Motion §7](./04-motion-guidelines.md)).

- RSC-first; minimal client JS; route-level code splitting; `dynamic()` for heavy atmosphere.
- `next/font/local` self-hosting (no layout shift, no third-party blocking).
- `next/image` everywhere; AVIF/WebP; sized; lazy by default; LCP image prioritized.
- The Void: capped DPR, pauses when hidden, fewer motes on small/save-data, near-still under
  reduced motion (already engineered in `void.js`).
- **Targets:** Lighthouse ≥ 95 across the board; LCP < 2.0s, CLS < 0.05, INP < 200ms; first
  meaningful breath < 1.5s.

---

## 11. Responsive strategy

- **Mobile-first**, Tailwind breakpoints mapped to token intentions.
- **Re-choreographed, not reflowed** ([UI §7](./03-ui-guidelines.md)): the threshold, drift, and
  immersion are composed per breakpoint; intimacy *increases* on small screens.
- Container queries for components that live in varied contexts.

---

## 12. State, commerce & accessibility

- **State is minimal.** The "Kept" cart and Sound are the only global stores (lightweight —
  Zustand or context). Everything else is server data or local component state.
- **Commerce is an adapter** (`lib/commerce`) so the launch can start front-end-complete and plug
  a backend (Shopify/Stripe) behind a stable interface — the structure doesn't change either way.
- **Accessibility is structural**: semantic HTML, designed focus, AA contrast, keyboard paths,
  opt-in sound, reduced-motion stills — enforced by lint rules and reviewed per component.

---

## 13. Conventions

- Components `PascalCase` in their own folder when they own styles/sub-parts; one default export.
- Server by default; `"use client"` only where interaction/atmosphere requires, pushed to leaves.
- Co-locate: a feature's component, its variants, and its types live together.
- Absolute imports via `@/` alias. `cn()` for class composition.
- Every component header cites the doc section it implements.

---

## 14. Build sequence (when approved)

A spine-first order so the descent is felt before the periphery is filled:

1. **Scaffold** — Next + TS + Tailwind + Framer; tokens → Tailwind mapping; lint/format; CI.
2. **Atmosphere core** — port Void, Grain, Vignette, Surface, MotionConfig into the root layout.
3. **Primitives** — the design-system components as React.
4. **The home Threshold** — `<Surfacing/>` over the Void; the first complete breath.
5. **The vertical slice** — one full `/fragrance/[slug]` (Undertow), end to end.
6. **Drift** — `/the-library` + `/collections/[slug]`.
7. **Commerce spine** — Kept → Checkout → Confirmed (adapter-backed).
8. **The House + Journal**, then **the Necessary** (legal/utility), then **404 + search**.
9. **SEO + perf pass** — metadata, JSON-LD, sitemap, OG, Lighthouse hardening.

---

## 15. Open decisions (to confirm before scaffolding)

1. **Commerce for launch** — front-end-complete now with a stubbed adapter (fastest to a felt
   site), or wire a real backend (Shopify/Stripe) from the start?
2. **Content source** — local typed files + MDX for launch (recommended; CMS-swappable later),
   or stand up a CMS (Sanity) now?
3. **Repo location** — scaffold the Next app at the repo root (recommended; design-system/docs
   become reference), or in a `web/` subfolder?

> Once these are confirmed, step 1 of the build sequence begins. Until then: **no code.**

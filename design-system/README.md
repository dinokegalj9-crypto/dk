# Sensorium — Design System

> Scent is the trigger. Memory is the product.
> The interface should feel like remembering, not browsing.

This is the **buildable** layer beneath the [constitution in `/docs`](../docs/README.md). The
documents define the soul; this system makes it real, viewable, and consumable by any page —
with **zero dependencies and no build step**.

```html
<!-- The two voices (self-host in production) -->
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">

<!-- The whole world in one import -->
<link rel="stylesheet" href="/design-system/css/sensorium.css">

<!-- Behavior (optional; everything degrades gracefully without it) -->
<script src="/design-system/js/sensorium.js"></script>
```

Open `design-system/index.html` in a browser to see the **living styleguide** — every token and
component, demonstrated as one coherent world.

## What's here

```
design-system/
├── index.html            ← living styleguide / showcase
├── css/
│   ├── sensorium.css      ← single entry point (imports the rest)
│   ├── tokens.css         ← colour, type, spacing, light, motion, layout
│   ├── base.css           ← reset, the atmospheric ground, the grain
│   ├── animations.css     ← keyframes + reduced-motion contract
│   ├── utilities.css      ← frames, type classes, the surface system, fragments
│   └── components.css     ← buttons, fragments, forms, nav, keepsake, sound…
└── js/
    └── sensorium.js       ← surfacing, summoned menu, sound toggle, cursor glow
```

## The nine pillars (and where each lives)

| You asked for | Where it lives | The Sensorium interpretation |
|---|---|---|
| **Colours** | `tokens.css` §1 | Low-light, tonal. Ink / Bone / Ash + one Ember accent as *light*. |
| **Typography** | `tokens.css` §2, `utilities.css` | Two voices: the *memory* serif, the *quiet* sans. Fluid modular scale. |
| **Buttons** | `components.css` | Nearly invisible. `.btn`, `.btn--keep`, `.btn--ghost`, `.btn--onward`. |
| **Cards** | `components.css` | Reimagined as **`.fragment`** — partial memory, edges dissolved. (Boxed cards are rejected; the one commerce tile is `.keepsake`.) |
| **Layout rules** | `tokens.css` §8, `utilities.css` | `.frame`, `.field`, asymmetric offsets, reading measures. |
| **Animations** | `animations.css`, `js` | Breathing not animation. The `[data-surface]` reveal system. |
| **Shadows** | `tokens.css` §4 | Reimagined as **Light & Depth** — glow, halo, vignette. No drop shadows. |
| **Spacing** | `tokens.css` §3 | A modular scale of *breaths*; generous by default. |
| **Component library** | `components.css` | Buttons, fragments, keepsake, forms, nav/menu, sound toggle, tags, composition, threshold, pull-quote. |

> Two reinterpretations are deliberate, not omissions. The constitution forbids **drop shadows**
> and **boxy cards**, so "Shadows" became **Light & Depth** and "Cards" became **Fragments**.
> Every category you listed is covered — in the form the brand demands.

## Core patterns

**The surface system** — things surface, they don't load:

```html
<div data-surface-group>
  <h2 data-surface>The room after everyone has left.</h2>
  <p  data-surface>Residue · No. 3</p>   <!-- staggers automatically -->
</div>
```

**Per-collection accent** — retune the whole world with one attribute:

```html
<section data-collection="submerged">…</section>  <!-- amber → cold dusk -->
```
Collections: `after-you-left` (rose), `submerged` (dusk), `long-afternoon` (gold).

**A fragment** (the card replacement):

```html
<article class="fragment">
  <div class="fragment__image"><img src="…" alt="Late sun through a thin curtain."></div>
  <h3 class="fragment__state">The last warm day before the cold decides to stay.</h3>
  <p class="fragment__note">Waking · No. 1</p>
</article>
```

## Principles baked into the code

- **Restraint is the luxury** — few tokens, enormous care; components justify themselves against silence.
- **A still Sensorium is still Sensorium** — `prefers-reduced-motion` is honored globally; the emotion survives without movement.
- **Accessible by default** — designed `:focus-visible`, WCAG-minded contrast, sound always opt-in, semantic HTML, graceful no-JS degradation.
- **No raw values in components** — everything references a token, so the world can shift at once.

## Production notes

- **Self-host the fonts** (the CDN link is for the styleguide's convenience). Preload the two
  primary cuts; match fallbacks so layout doesn't lurch.
- The grain and vignette are pure CSS/SVG — no image assets required.
- `sensorium.js` is ~4kb, vanilla, and optional.

## The test

> *Does this make a person feel like they are remembering something — or like they are using a website?*

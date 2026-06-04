# The Void

The persistent background environment behind the entire Sensorium site — **eigengrau**, the
warm dark behind closed eyes, that everything else surfaces out of. Open
`prototypes/void/index.html`.

> Psychologically familiar. Impossible to identify.

## How it's identity-proof

The Void removes every cue the brain uses to classify an image:
- **No identifiable particle shape** — soft "motes", never stars / snow / lens-bokeh.
- **No scale reference** — motes vary wildly in size & softness across depth strata.
- **No horizon, no floor** — you're inside a volume, not looking at a scene.
- **No fixed light source** — warmth blooms from nowhere and recedes.
- **Motion below conscious tracking** — 10–60s cycles; a shared, slow tide.

The mind says *"I know this"* and can never finish the sentence.

## Behaviour

| | |
|---|---|
| **Particles** | Sparse motes drift (Brownian + shared tide), fade up out of the dark and dissolve back. |
| **Lighting** | Sourceless accent blooms on long offset cycles; attention gathers faint light at the pointer. |
| **Depth** | Parallax strata + fake depth-of-field (far = tiny/crisp, near = large/soft) + vignette. |
| **Interaction** | The pointer parts the medium; **stillness deepens the dark**; scroll parallaxes the field; `deepen()` rides page transitions. |
| **Collection** | One accent at a time — retint via `data-collection` or `SensoriumVoid.setCollection()`. |

## Drop it into any page

```html
<link rel="stylesheet" href="/design-system/css/void.css">
<div class="void" data-void aria-hidden="true"></div>
<div class="void-above"> …all page content… </div>
<script src="/design-system/js/void.js"></script>
```

`SensoriumVoid` API: `setCollection(name)`, `deepen()`, `pause()`, `resume()`.

## Performance & care

- Canvas 2D, pre-rendered mote sprite, capped DPR, additive light.
- **Pauses when the tab is hidden**; fewer motes on coarse/small/save-data screens.
- `prefers-reduced-motion` → one resolved still frame. *A still Void is still the Void.*
- `pointer-events: none`, `aria-hidden` — purely decorative; always recedes; text stays AA-legible.
- Source & full design rationale: [`design-system/css/void.css`](../../design-system/css/void.css),
  [`design-system/js/void.js`](../../design-system/js/void.js).

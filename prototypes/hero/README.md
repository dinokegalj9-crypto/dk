# Hero — "The Surfacing"

The Sensorium threshold as **a memory developing in real time**, with the visitor as the one
remembering. Open `prototypes/hero/index.html` in a browser.

> You have been here before. — *Before the word for it. Before you could keep it.*

## What it does

- **The Develop** — the screen begins black and *develops like film*: grain blooms then thins, a
  warm off-center light forms, and the line assembles letter-by-letter out of the grain.
- **The lamp** — a pocket of clarity follows your pointer through the fog *with a lag*. Where you
  look, the memory comes into focus. (On touch, the lamp wanders on its own.)
- **The slip** — go still for ~3.5s and the memory recedes. Move, and it returns.
- **The submerge** — scrolling doesn't scroll the hero away; it *sinks* (darken + drift + blur)
  as the next state surfaces.
- **No product.** No bottle, no "shop now". The threshold shows only the *state* — the boldest
  refusal of generic luxury-perfume patterns.

## Design intent

Full rationale across Layout / Motion / Copywriting / Interactions / Visual effects lives with
this delivery. The piece is built entirely on the [design system](../../design-system/) tokens
and honors the constitution in [`/docs`](../../docs/) — including a fully realized, dignified
**reduced-motion** still (no development, no lamp, no submerge; the emotion survives in type,
light, and word).

## Files

| File | Role |
|------|------|
| `index.html` | The threshold + the state it submerges into + the SVG heat-haze filter |
| `hero.css` | The four layers (memory, clarity, grain, shroud), the develop/slip states |
| `hero.js` | Word assembly, one rAF loop: cursor lag, light drift, idle-slip, submerge |

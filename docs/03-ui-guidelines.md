# 03 — UI Guidelines

> Silence is a material. Space, darkness, and light are the primary components — everything
> else is restraint on top of them.

## 1. Principles

- **Space is the loudest element.** Negative space is not emptiness; it is held breath. Default
  to more space than feels comfortable, then add a little more.
- **Light, not decoration.** We build atmosphere with light, shadow, depth, and grain — not
  with borders, badges, gradients-as-ornament, or UI chrome.
- **One focal point per view.** The eye should always know where to rest. Competing elements
  are a failure of editing.
- **The UI recedes; the content breathes.** Interface elements are quiet to the point of near-
  invisibility until summoned. Chrome serves the feeling, never announces itself.

## 2. Color

The palette is **low-light and tonal**, drawn from memory and dusk — not from product
marketing. Memory is not brightly lit.

**Foundations**

- `--ink` — near-black, warm, never pure `#000`. e.g. `#0B0A09`. The void we surface from.
- `--bone` — warm off-white, never pure `#FFF`. e.g. `#EDE7DD`. Primary text on dark.
- `--ash` — muted mid-grey-taupe for secondary text. e.g. `#8C857B`.
- `--veil` — translucent layers for depth (e.g. `rgba(237,231,221,0.06)`).

**Accent (used sparingly — restraint is the luxury)**

- A single **warm ember** tone per collection, evoking that collection's state — e.g. a dim
  amber, a faded rose, a cold blue-grey. The accent appears in *light*, not fills: a glow, a
  highlight, a thread — rarely a block of color.
- **One accent at a time.** Never two competing hues in a single view.

**Rules**

- Default ground is dark. Light grounds are reserved, intentional, and rare — used to signal a
  shift in state, like stepping into daylight.
- No pure black, no pure white, no saturated "web" colors, no functional traffic-light colors
  except where accessibility/clarity strictly require (e.g. form errors — and even then, muted).
- Color must pass **WCAG AA** for text (see [UX §7](./02-ux-guidelines.md)).

## 3. Light & depth

- Use **layered translucency, subtle grain, and soft vignetting** to create the sense of
  looking *into* a space rather than *at* a screen.
- Light has direction and source. Glows emanate from meaning (a fragrance name, a single word),
  guiding the eye like a candle in a dark room.
- **Grain/noise** at low opacity over flat fills prevents the digital "deadness" of pure color
  and evokes film, memory, analog. Use it almost everywhere, almost imperceptibly.

## 4. Layout

- **Asymmetry over the centered grid.** Memory is off-balance. Compose with tension and rest,
  not symmetrical safety. Single-column, generously offset, is often right.
- **Editorial, not e-commerce.** Layouts reference art books, gallery wall texts, and cinema
  title cards — not product listing pages.
- **Baseline rhythm.** Vertical spacing follows a consistent modular scale (see
  [Typography](./05-typography-guidelines.md)) so the page breathes evenly.
- **Generous margins.** Content rarely touches the edges. The frame is part of the image.

## 5. Components (kept minimal by design)

Every component must justify its existence against silence. The fewer, the better.

- **Buttons** are nearly invisible: text + a quiet underline or a thin hairline that *responds*
  to presence (see [Motion](./04-motion-guidelines.md)). No loud fills, no rounded "app"
  buttons, no drop shadows. The primary action may glow faintly rather than fill.
- **Links** reveal themselves on approach (underline drawing in, faint glow) rather than being
  permanently styled-loud.
- **Forms** are quiet and spacious: a single field in focus, a hairline baseline, label as
  whispered placeholder that rises on focus. Errors are muted and kind in tone.
- **Cards** — avoid the "card" pattern wherever possible; it's the grammar of the grid we
  reject. When grouping is needed, use space and rhythm, not boxes with borders and shadows.
- **Imagery** is full-bleed or generously framed, never thumbnailed into a gallery wall of
  equals (see [Photography](./07-photography-guidelines.md)).

## 6. Iconography

- Almost none. Icons are utility shorthand; we prefer words and space.
- When required (cart, close, menu, sound), icons are **thin, minimal, custom**, and quiet —
  hairline weight, consistent with the type. Never a generic icon-font look.

## 7. Responsive & device

- The experience is **designed for each context**, not merely reflowed. The threshold breath,
  the descent, the immersion — each is re-choreographed for small screens, not crammed.
- On mobile, the intimacy *increases* (the device is held close, in the hand, often at night) —
  lean into that. Touch is gentle; tap targets are generous despite the minimalism.
- Respect device dark mode as the home state; light contexts remain intentional choices.

## 8. The test

> *Could you remove one more thing? Then remove it.*

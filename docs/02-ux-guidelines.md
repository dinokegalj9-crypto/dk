# 02 — UX Guidelines

> The interface should feel like remembering, not browsing.

## 1. The governing metaphor

A traditional store is a **search**: you arrive knowing what you want, you filter, you compare,
you check out. Sensorium is a **descent**: you arrive open, you sink, things *surface* to you,
you leave changed. We design for the second experience.

Memory does not arrive in a grid. It arrives slowly, partially, triggered by something small,
and then it floods. Our UX choreographs that: **quiet → trigger → flood → settle.**

## 2. The journey (the arc, not the sitemap)

1. **Threshold** — the first breath. Almost nothing. Atmosphere, a single line, an invitation
   to go further. No navigation shouting. The person chooses to descend.
2. **Drift** — the collection is encountered as *states*, not products. The person moves
   through them slowly; one surfaces at a time. No grid of equals competing for clicks.
3. **Immersion** — a single fragrance, entered fully. Its state, its arc, its unfolding in
   time. This is the emotional core; everything before it earns this moment.
4. **Recognition** — the quiet decision. Acquiring a fragrance feels like *keeping* a memory,
   not buying a product. Commerce is present but never breaks the spell.
5. **Residue** — what remains after leaving: the email, the unboxing, the object. The
   experience continues offline (see [Packaging](./08-packaging-guidelines.md)).

## 3. Interaction principles

- **Surface, don't load.** Content *appears* — it fades, rises, breathes into being. Nothing
  "pops" or slams in. (See [Motion](./04-motion-guidelines.md).)
- **One thing at a time.** Reject the grid as a default. Attention is the medium; we protect it
  by never asking it to split.
- **Reward stillness.** If a person pauses, the experience deepens (subtle ambient shift, a
  detail revealing) rather than nags them to act.
- **Progressive intimacy.** The deeper a person goes, the more the experience opens. We
  withhold early and give late.
- **No dead ends, no dread.** Every state of the journey has a gentle way forward. Never trap.
- **The scroll is a breath, not a conveyor belt.** Pace content so scrolling feels like
  inhaling slowly. Generous space between moments.

## 4. Navigation philosophy

- Navigation is **hidden until needed, instantly available when summoned.** No persistent
  shouting menu bar competing with the atmosphere.
- Wayfinding is **felt, not labeled** where possible — light, depth, and sound signal where you
  are more than breadcrumbs do. Labels exist for accessibility and clarity, but they recede.
- The menu, when opened, is itself an experience — quiet, spacious, typographic — not a utility
  dropdown.

## 5. Commerce, handled with reverence

- The cart is **"Kept"** or similar — language that frames acquisition as keeping, not buying.
- Price is present, honest, and unhurried. Never hidden (that's a different kind of
  manipulation), never emphasized.
- No upsell carousels, no "customers also bought," no urgency mechanics, no popups.
- Checkout is calm, minimal, and fast — the *one* place we allow efficiency to dominate, because
  friction here breaks the spell rather than deepening it. Respect the person's decision; don't
  re-sell during checkout.

## 6. Performance is emotional design

Slowness as *atmosphere* is intentional and choreographed. Slowness as *lag* is a betrayal.

- Perceived performance must be flawless. Things may *reveal* slowly by design, but never
  *stutter*, *jank*, or wait on a spinner. A spinner is an admission of failure; design
  loading as atmosphere instead (a slow breath, a deepening) or eliminate it.
- Target: first meaningful breath under 1.5s on a good connection. Motion at a locked 60fps.
- Preload the next moment while the person rests in the current one. The descent should never
  hitch.

## 7. Accessibility (non-negotiable)

Immersion that excludes is not luxury — it's failure. Restraint and accessibility are allies.

- **Respect `prefers-reduced-motion`.** Provide a fully realized, still version of every
  experience. The emotion must survive without movement — through type, image, space, and word.
- **Contrast:** meet WCAG AA for all text. Atmospheric dark palettes must still pass. Test it.
- **Keyboard:** every path fully navigable; focus states are designed, beautiful, and visible —
  not an afterthought.
- **Screen readers:** the *meaning* and *emotion* must come through in the reading order and
  alt text. Write alt text as evocatively as body copy (see [Photography](./07-photography-guidelines.md)).
- **Sound is always opt-in**, never autoplay-with-audio. A clear, calm control. The experience
  must be complete in silence.
- **Motion sensitivity, photosensitivity:** no rapid flashing, no aggressive parallax that can
  cause discomfort.

## 8. The test

> *Did the person feel like they descended into something — or clicked through a funnel?*

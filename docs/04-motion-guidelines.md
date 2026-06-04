# 04 — Motion Guidelines

> Things should *surface*, not load. Motion is breathing, not animation.

## 1. Principles

- **Motion is atmosphere, not feedback flair.** Every movement exists to deepen immersion or
  guide attention — never to decorate or to show off.
- **Slow is the default.** Memory surfaces slowly. When in doubt, halve the speed.
- **Reveal, never pop.** Elements fade and rise into being. Nothing slams, bounces, or snaps in.
- **Continuity over cuts.** Transitions are dissolves and drifts, not hard swaps. The person
  should never feel "the page changed" — they feel they moved *through* something.
- **Stillness is a state, not the absence of one.** A resting screen still breathes subtly
  (ambient grain shift, faint light drift). The world is alive even at rest.

## 2. Timing

A small, disciplined timing scale. Use it everywhere; resist one-off values.

| Token | Duration | Use |
|-------|----------|-----|
| `breath-quick` | 320ms | Micro-feedback: a link waking, a focus state arriving. |
| `breath` | 600ms | Standard reveal: text rising, image fading in. |
| `breath-slow` | 1200ms | Major transitions: entering a fragrance, scene change. |
| `breath-deep` | 2400ms+ | Atmospheric: ambient drifts, the threshold breath, light shifts. |

- Nothing meaningful is faster than ~300ms — below that it reads as a "snap," which is the
  opposite of remembering.
- Ambient/looping motion is **long and imperceptible** (10s+ cycles), never a noticeable loop.

## 3. Easing

- **Default ease:** `cubic-bezier(0.22, 1, 0.36, 1)` — a soft, decelerating arrival. Things
  ease *out* into place like a held breath releasing.
- **Entrances** decelerate (ease-out): they arrive and settle.
- **Exits** accelerate gently (ease-in): they recede and dissolve.
- **Never** use linear for meaningful motion (mechanical), and never use bouncy/elastic/
  overshoot easings (playful, wrong register). Sensorium does not bounce.

## 4. Choreography

- **Stagger reveals.** When multiple elements appear, offset them by 60–120ms so they surface
  like a memory assembling itself, not a block dropping in.
- **Lead with light or the focal word**, then let supporting elements follow. The eye is guided,
  not flooded.
- **Scroll-linked motion is gentle.** Subtle parallax and reveals tied to scroll are welcome,
  but kept slow and shallow — aggressive parallax causes discomfort and breaks immersion
  (and accessibility). Depth should feel like fog, not a funhouse.
- **Page/state transitions** dissolve through a brief deepening (a fade toward `--ink`) before
  the next scene surfaces — like closing your eyes between memories.

## 5. Microinteractions

- **Hover/approach:** elements *wake* — a link's underline draws in over `breath-quick`, a
  faint glow warms. Reversible, soft, never jumpy.
- **Press:** a gentle, brief dim or settle — not a hard depress. Acknowledges touch quietly.
- **Cursor (desktop):** consider a soft, custom presence (a faint light, a slight drag/lag) that
  makes the pointer feel like attention moving through space. Optional, subtle, never gimmicky.

## 6. Sound (motion's twin)

Sound is part of motion and lives here as much as anywhere.

- **Always opt-in. Never autoplay with audio.** A calm, ever-present, unobtrusive control.
- When on: a **low ambient bed** tuned per collection's state (a room tone, a drone, distant
  rain) — felt more than heard. Plus optional, extremely subtle interaction tones (a soft
  swell on entering a fragrance). Never UI "clicks" or "dings."
- Sound and motion are **composed together** — a reveal and its swell share the same timing.
- The experience must be **complete and moving in silence.** Sound deepens; it is never required.

## 7. Performance

- All motion runs at a locked **60fps**. Animate only `transform` and `opacity`; avoid layout-
  triggering properties. Jank breaks the spell more than any wrong color could.
- Honor **`prefers-reduced-motion`**: replace movement with instant, dignified states and
  cross-fades at most. The emotion must fully survive without motion (see
  [UX §7](./02-ux-guidelines.md)). A still Sensorium is still Sensorium.

## 8. The test

> *Does it feel like breathing — or like a transition effect?*

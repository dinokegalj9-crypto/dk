# 09 — Website Architecture

> The interface should feel like remembering, not browsing.
> A traditional store is a *search*. Sensorium is a *descent*.

This document defines **every page required for launch**, organized by the emotional journey
([UX §2](./02-ux-guidelines.md)): **Threshold → Drift → Immersion → Recognition → Residue**.
Each page is specified by four questions:

- **Purpose** — what job it does for the business and the person.
- **Emotional objective** — what the person should *feel*. This governs everything else.
- **Content structure** — what's on it, in order.
- **UX goals** — how it must behave.

> **Principle that overrides the sitemap:** we are not building a catalog with a story bolted on.
> We are building an emotional descent that happens to sell fragrance. When utility and feeling
> conflict, feeling wins everywhere except checkout (see §4.2).

---

## 0. The map

```
THRESHOLD
└─ /                        Home — the first breath

DRIFT (encountering states)
├─ /the-library             All fragrances, as states (the "shop", renamed)
├─ /collections/:slug       A single collection (a threshold of consciousness)
└─ /discover                The Sampling Ritual — how to find your state (discovery set)

IMMERSION (entering a state fully)
└─ /fragrance/:slug         A single fragrance — the emotional core of the site

THE HOUSE (the world behind the scent)
├─ /the-house               Manifesto / about — why Sensorium exists
├─ /the-method              How a memory becomes a scent (craft & perfumer)
└─ /journal                 Editorial — essays on memory & scent
    └─ /journal/:slug        A single piece

RECOGNITION (the quiet decision — commerce)
├─ /kept                    Cart ("Kept", not "Cart")
├─ /checkout                Checkout — the one place efficiency leads
└─ /kept/confirmed          Order confirmation ("It's yours now")

RESIDUE (what remains after leaving)
├─ /account                 "What you've kept" — account home
│  ├─ /account/orders        Past keepings
│  └─ /account/saved         States held for later
└─ /stay-close              Newsletter moment (also a global component)

THE NECESSARY (utility & legal — in character, never cold)
├─ /search                  Search
├─ /care                    Care, longevity & how to wear
├─ /questions               FAQ / help
├─ /shipping-returns        Shipping & returns
├─ /sustainability          Materials, refills, sourcing — honest, specific
├─ /stockists               Where to find us in person (if applicable)
├─ /contact                 Contact
├─ /privacy                 Privacy policy
├─ /terms                   Terms
├─ /accessibility           Accessibility statement
└─ /404                     "This memory hasn't formed yet."
```

**Global frame (every page):** the summoned `veil-nav` (hidden until called), the summoned
menu, the opt-in `sound-toggle`, and the footer. None of these ever shout
([UI](./03-ui-guidelines.md), [Components](../design-system/css/components.css)).

---

## 1. THRESHOLD

### 1.1 `/` — Home (the first breath)

- **Purpose.** The doorway. Establish in seconds that this is not a perfume store but a place
  to re-enter lost states, and invite the person to *descend* rather than browse.
- **Emotional objective.** *Stillness, then a pull.* A held breath. The feeling of standing at
  the edge of something — quiet, a little uncanny, impossible not to step into.
- **Content structure.**
  1. **Threshold moment** — near-empty. One monumental line (the `threshold` component), a
     single invitation to descend. No grid, no nav shouting, no products.
  2. **A first surfacing** — one fragrance/state emerges as you scroll, full-bleed, as a
     *feeling* not a product. (`fragment--immersive`.)
  3. **The premise, stated once** — 2–3 lines of the house's reason to exist, in the memory voice.
  4. **Drift entry** — a quiet doorway into the Library / collections.
  5. **Stay-close moment** — one line, one field. Never a popup.
  6. Footer.
- **UX goals.** First meaningful breath < 1.5s. Nothing loads — everything surfaces. No
  carousels, no hero CTA stack. The *only* obvious action early is "go deeper." Reward stillness
  (ambient shift on pause). Complete and moving in silence; sound strictly opt-in.

---

## 2. DRIFT — encountering states

### 2.1 `/the-library` — All fragrances, as states (the renamed "shop")

- **Purpose.** The browse surface, reframed. Where the full range lives — but encountered as
  *states of being*, not a product listing. This is the commercial index without feeling like one.
- **Emotional objective.** *Recognition and wandering.* The sense of moving slowly through a
  dim gallery where, one at a time, a feeling you'd forgotten turns to face you.
- **Content structure.**
  1. Quiet title + one orienting line ("Each is a state. Find the one you've been missing.").
  2. **Fragrances as fragments**, surfaced one (or two, asymmetric) at a time on scroll —
     never an even grid of equals competing for clicks. Each shows the **state name** + a single
     evocative line, not notes or price-forward chips.
  3. Optional gentle **filter by collection / consciousness-threshold** — felt, not a loud
     faceted sidebar. Hidden until summoned.
  4. A path to `/discover` for the undecided.
- **UX goals.** Reject the grid as default. One focal point per viewport; generous space.
  Filtering is optional and quiet. Every fragrance is one tap from full immersion. No
  "sort by price/popularity" merchandising language.

### 2.2 `/collections/:slug` — A single collection

- **Purpose.** Present a curated group of states bound by a *threshold of consciousness*
  (*Waking*, *Submerged*, *Residue*, *The Edge of Sleep*).
- **Emotional objective.** *Atmospheric immersion in one register* — the collection's single
  accent light and mood envelop the whole page (`data-collection` retunes the world).
- **Content structure.**
  1. Collection threshold — name + the binding idea, one image/atmosphere defining its light.
  2. The member fragrances as fragments, in a deliberate emotional sequence (not alphabetical).
  3. A closing line that returns the person to the wider Library or onward to a fragrance.
- **UX goals.** The collection's accent recolors glow/halo/focus for coherence. Sequence matters
  — order the states as an arc. Mobile re-choreographs, never just reflows.

### 2.3 `/discover` — The Sampling Ritual (discovery set)

- **Purpose.** Solve fragrance e-commerce's hardest problem — *you cannot smell online* — without
  breaking the spell. Sell the discovery/sample set and/or guide the unsure toward a state.
- **Emotional objective.** *Permission and curiosity.* Removing the fear of choosing wrong;
  framing sampling as the beginning of a search through your own memory, not a trial.
- **Content structure.**
  1. The premise: "You can't remember a scent from a screen. Begin in your own hands."
  2. The **discovery set** as a keepsake object (small vials), priced honestly, credit toward a
     full keeping.
  3. Optional quiet **guided prompt** — a few felt questions ("Which would you rather return
     to…") that surface 2–3 states. A mood-led aid, never a hard quiz funnel.
  4. Reassurance on how it works, longevity, what arrives.
- **UX goals.** Make the low-commitment entry obvious and dignified. The guide is skippable and
  calm. Clear, honest practicalities (price, contents, credit, shipping).

---

## 3. IMMERSION — the emotional core

### 3.1 `/fragrance/:slug` — A single fragrance

- **Purpose.** The reason the whole site exists. Take the person fully into one state, let them
  feel it unfold in time, and let acquisition feel like *keeping a memory*.
- **Emotional objective.** *Total immersion, then quiet recognition.* They should feel they have
  briefly *been somewhere* — and that they don't want to leave it behind.
- **Content structure (a descent, top to bottom).**
  1. **Entering the state** — full-bleed atmosphere, the fragrance name in the memory voice,
     the state stated as if they already know it. Almost nothing else.
  2. **The unfolding** — 2–4 short passages that move the memory through time, *mirroring the
     scent's arc* (opens → becomes → stays). Present tense, second person, sensory
     ([Content §3](./06-content-guidelines.md)).
  3. **The quiet facts** — a separate, calm zone: **Composition** (notes, honest but small),
     size/concentration, longevity, IFRA/allergens, price. The one place a reverent packshot
     may appear ([Photography §6](./07-photography-guidelines.md)).
  4. **The keeping** — the acquisition moment, framed as keeping: "Keep it" / "Take it with
     you", quantity, the discovery-set alternative for the hesitant.
  5. **A way onward** — one related state (not a "you may also like" carousel of six).
- **UX goals.** Emotion first, facts second — never lead with a packshot or a notes table. The
  "keep" action is present without breaking the spell (sticky-but-quiet). Price honest, never
  emphasized. Add-to-keep gives gentle confirmation, no aggressive cart-drawer interruption.
  Fully readable and moving with sound off and motion reduced.

---

## 4. RECOGNITION — commerce, handled with reverence

### 4.1 `/kept` — Cart ("Kept")

- **Purpose.** Hold what the person has chosen to keep before they commit.
- **Emotional objective.** *Calm certainty.* The opposite of a transactional cart — a small,
  considered collection of memories about to come home.
- **Content structure.** The kept items as quiet still-lifes (state name + keepsake), honest
  subtotal, the discovery-set nudge only if relevant, one clear way onward to checkout.
- **UX goals.** No upsell carousel, no "customers also bought," no urgency, no scarcity timers.
  Editable without friction. Empty state stays in character ("Nothing kept yet — only quiet").

### 4.2 `/checkout` — Checkout

- **Purpose.** Complete the purchase. **The one place efficiency is allowed to lead** — friction
  here breaks the spell rather than deepening it.
- **Emotional objective.** *Trust and ease.* Quiet competence. The person should feel safe and
  unhurried, never re-sold to.
- **Content structure.** Minimal steps: contact → delivery → payment → review. Guest checkout
  first-class. Clear order summary. Honest totals (shipping, tax, returns link).
- **UX goals.** Fast, accessible, standards-compliant forms (`field-input`, kind errors).
  No surprise costs, no re-selling, no account wall. Calm visual register, fewer atmospherics —
  clarity is the kindness here. WCAG AA, full keyboard, autofill-friendly.

### 4.3 `/kept/confirmed` — Order confirmation

- **Purpose.** Confirm the order and *continue the spell* past the transaction.
- **Emotional objective.** *Quiet anticipation.* Not a receipt — the beginning of waiting for
  something meaningful to arrive.
- **Content structure.** A warm line in voice ("It's yours now. It will find you in about three
  days."), the practical confirmation (number, items, delivery window), a gentle door back into
  the Library or Journal.
- **UX goals.** Practical facts present and clear, wrapped in voice — never break into pure
  receipt-speak. Set expectations for the physical *Residue* (the unboxing — see
  [Packaging](./08-packaging-guidelines.md)).

---

## 5. THE HOUSE — the world behind the scent

### 5.1 `/the-house` — Manifesto / about

- **Purpose.** Explain why Sensorium exists and earn belief in the premise.
- **Emotional objective.** *Resonance and trust.* The feeling of reading something true that
  names something you'd felt but never articulated.
- **Content structure.** The premise (scent as trigger, memory as product), the philosophy of
  states, the stance (restraint, refusal of the category), who is behind it — written as essay,
  not corporate "about us."
- **UX goals.** Editorial, book-like reading. Long-form but paced in pools of quiet. No team
  grid of headshots, no stock office imagery.

### 5.2 `/the-method` — How a memory becomes a scent

- **Purpose.** Make the craft credible — perfumery, materials, the perfumer(s), the process of
  translating a state into a composition.
- **Emotional objective.** *Reverence for the craft.* Quiet authority; the sense of real, slow,
  serious making behind the feeling.
- **Content structure.** The translation process (state → arc → accords), materials and sourcing
  ethics, the perfumer's voice, honesty about ingredients and IFRA.
- **UX goals.** Substantiated, specific, never greenwashed ([Content §6](./06-content-guidelines.md)).
  Atmospheric but informative; bridges feeling and fact.

### 5.3 `/journal` + `/journal/:slug` — Editorial

- **Purpose.** Extend the world beyond product; build a slow, returning audience; carry SEO and
  email substance without ever feeling like content-marketing.
- **Emotional objective.** *Lingering.* The pleasure of staying a while in the brand's mind —
  essays on memory, perception, the senses, forgotten states.
- **Content structure.** *Index:* pieces as fragments, newest/curated, by theme. *Article:*
  book-set long-form (memory voice for display, quiet voice for body), generous imagery used
  sparingly, a quiet related-piece and stay-close at the end.
- **UX goals.** Genuinely readable typography ([Typography](./05-typography-guidelines.md)).
  Shareable, accessible, fast. No listicles, no clickbait, no ad density.

---

## 6. RESIDUE — what remains after leaving

### 6.1 `/account` (+ `/orders`, `/saved`) — "What you've kept"

- **Purpose.** Let returning people manage orders, re-keep, and hold states for later.
- **Emotional objective.** *Continuity and belonging.* A personal, dimly-lit shelf of what
  you've kept and what you're still reaching for — not a "dashboard."
- **Content structure.** Account home (a warm greeting in voice), **orders** (past keepings,
  reorder, track), **saved** (states held for later), details/addresses/preferences.
- **UX goals.** Reframe utilitarian language ("My Account" → "What you've kept"; "Wishlist" →
  "Held for later"). Secure, clear, accessible. Atmospheric but never obstructing the task.

### 6.2 `/stay-close` — Newsletter

- **Purpose.** Permission-based connection; the primary owned channel.
- **Emotional objective.** *Intimacy, not subscription.* "Let us write to you," not "subscribe
  for deals."
- **Content structure.** One line of why, one field, honest expectation (rare, considered
  letters), consent. Lives mostly as a *component* on other pages, with this as a fallback page.
- **UX goals.** Never a popup, never urgency, no exclamation. Clear consent and privacy link.
  GDPR/CAN-SPAM compliant.

---

## 7. THE NECESSARY — utility & legal, in character

These are launch-required. They must be *findable, honest, and accessible* — and they must stay
in voice. Most brands drop the mask here; we don't ([Content §4](./06-content-guidelines.md)).
The deeper emotional objective for all of them is the same: **calm competence that never
breaks the spell or withholds a fact the person deserves.**

| Page | Purpose | Content / notes |
|------|---------|-----------------|
| `/search` | Find a state directly | Quiet, summoned search; results as fragments; in-character empty state. |
| `/care` | How to wear, store, and get the most longevity | Sensory, practical, honest about sillage/longevity per fragrance. |
| `/questions` | FAQ / help | Grouped by feeling-then-fact (choosing, wearing, keeping, shipping, returns). Calm tone. |
| `/shipping-returns` | Delivery & returns policy | Clear timelines, costs, returns process. Plain and trustworthy. |
| `/sustainability` | Materials, refills, sourcing | Specific and substantiated — refillable-by-design, real claims only, no greenwash ([Packaging §5](./08-packaging-guidelines.md)). |
| `/stockists` | Where to experience it in person | Locator/list — vital because scent is physical (only if retail/stockists exist). |
| `/contact` | Reach a human | Warm, minimal form (`field-group`), honest response times, no ticket-speak. |
| `/privacy` | Privacy policy | Legally complete, readably set. Honesty is a brand value, not just compliance. |
| `/terms` | Terms & conditions | Legally complete; typeset with the same care, not a wall of grey. |
| `/accessibility` | Accessibility statement | Our commitment + how to report barriers. We mean it ([UX §7](./02-ux-guidelines.md)). |
| `/404` | The lost page | "This memory hasn't formed yet." A designed, in-character moment with a gentle way back — never a dead end. |

> **Cookie/consent** is a global component (not a page): minimal, accessible, honest, no dark
> patterns — a quiet banner, not a manipulative wall.

---

## 8. Global components (present on every page)

- **`veil-nav`** — hidden until summoned; mark + summon control. Never a persistent shouting bar.
- **Summoned `menu`** — itself an experience: spacious, typographic, quiet.
- **`sound-toggle`** — always opt-in, ever-present, calm.
- **Footer** — quiet wayfinding: the Library, the House, the Necessary, stay-close, legal,
  social (restrained). The footer is where labeled navigation lives for clarity/accessibility.
- **Stay-close moment** — the newsletter as a recurring quiet invitation, never a popup.
- **Cookie/consent** — minimal, honest.

---

## 9. Launch priority

Build the spine first; the descent must be complete before the periphery.

- **Must-have for launch (the descent + commerce + legal):**
  `/`, `/the-library`, `/collections/:slug`, `/fragrance/:slug`, `/discover`, `/kept`,
  `/checkout`, `/kept/confirmed`, `/the-house`, `/account` (+ orders), `/care`, `/questions`,
  `/shipping-returns`, `/sustainability`, `/contact`, `/privacy`, `/terms`, `/accessibility`,
  `/404`, and all global components.
- **Strongly recommended at launch:** `/the-method`, `/journal` (+ first 3 pieces),
  `/search`, `/stockists` (if any), `/account/saved`.
- **Can follow shortly after:** deeper Journal cadence, richer guided discovery, gift flows,
  refill subscriptions.

> Do not launch the periphery before the core *feels* finished. One fully immersive
> `/fragrance/:slug` is worth more than ten half-felt utility pages.

---

## 10. The test (for the architecture itself)

> *Could a person move from the first breath to keeping a memory without the spell ever breaking —
> and find every fact they needed without ever feeling sold to?*

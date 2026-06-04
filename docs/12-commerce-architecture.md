# 12 — Commerce & Drops Architecture

> Sensorium does not run a shop. It releases **memories, in limited number.** Each fragrance is a
> standalone release with its own page and its own checkout. Scarcity is a fact of how few we
> make — never a weapon pointed at the visitor.

This document specifies the **direct-to-consumer commerce model**: limited premium drops,
per-release purchase or pre-order, and how it all stays in character. It refines the commerce
sections of [doc 10](./10-project-architecture.md) / [doc 11](./11-architecture-redesign.md) and
the routes in [doc 09](./09-website-architecture.md).

---

## 1. The model in one breath

- **DTC, single-product.** Each perfume is its own product, its own page, its own focused
  checkout. There is no sprawling catalog — a handful of releases at a time.
- **Drops, not stock.** Releases are *limited and intentional*. Some are open to buy; some are
  pre-order; some are sold out and resting; some are archived into the house's memory forever.
- **Pre-order is first-class.** If production isn't finalized for a release, it opens for
  **pre-order**; if it is, the **full purchase flow** is enabled. This is a per-release setting,
  not a site-wide mode — both can be live at once.
- **Focus over volume.** The whole system is built for *few things, made well*, not throughput.

---

## 2. The brand tension — scarcity without manipulation (non-negotiable)

Limited drops create natural scarcity. The constitution **forbids urgency mechanics**
([Brand §7](./01-brand-guidelines.md), [Content §4](./06-content-guidelines.md)). We resolve this
precisely:

**Scarcity is stated once, quietly, as a truth — and never engineered into pressure.**

| We do | We never do |
|-------|-------------|
| State the edition honestly: *"This release is limited. When it's gone, it rests."* | Countdown timers, ticking clocks |
| Show status as a *state of being*: Available / Resting / Archived | "Only 3 left!", live-decrementing counters, flashing stock |
| Offer to **write to you** when something returns or a new drop opens | "Hurry", "Selling fast", "X people viewing now" |
| Let a sold-out release rest with dignity | Fake restock anxiety, artificial drops, manufactured FOMO |
| Edition size shown calmly *if* shown (e.g. "An edition of 300") | Scarcity as the headline or the reason to buy |

> The luxury is restraint. A person should buy because they recognized something in themselves —
> never because a clock was running. **If a scarcity cue would raise the heart rate, it's out.**

---

## 3. The release lifecycle

Every fragrance release moves through honest states. The **fragrance page and its commerce module
adapt to the current state** (server-resolved, correct on first paint):

| State | Meaning | Primary action |
|-------|---------|----------------|
| `whispered` | Teased; no date. The idea exists. | *"Stay close"* — be told when it forms |
| `announced` | Dated; not yet open. | Join the **notify list** for this release |
| `preorder` | Open for pre-order (production not finalized). | **Reserve it** — pay or deposit now, ships when ready |
| `available` | In stock, immediate purchase. | **Keep it** — full purchase, dispatched now |
| `resting` | Sold out; may return. | **Notify me** if it returns |
| `archived` | Past; will not return. Part of the house memory. | (none) — it remains, as a memory, on `/the-library` |

The model carries `mode: "preorder" | "purchase"` plus dispatch expectations, so a single release
can be honestly presented whether or not production is finalized.

---

## 4. Per-release page + standalone checkout

### 4.1 The fragrance page is the storefront
`/fragrance/[slug]` ([doc 09 §3.1](./09-website-architecture.md)) **is** the product page — the
immersion *is* the merchandising. The commerce module lives in its quiet, factual zone (never
leading), and renders per the lifecycle state above.

### 4.2 Focused, single-product checkout
Because releases are standalone, the default path is **one fragrance, one calm checkout** — not a
cart-heavy funnel:

```
/fragrance/[slug]   →  Keep it / Reserve it      (single-line intent)
        →  /checkout (or /fragrance/[slug]/keep)  focused: contact → delivery → payment → review
        →  /confirmed                             "It's yours now."  /  "It's reserved."
```

- **`Kept` still exists** ([doc 09 §4.1](./09-website-architecture.md)) for the rare visitor taking
  more than one release, but the system is *optimized for the single-release decision*. No upsell,
  no cross-sell, no "complete the set".
- **Pre-order and purchase share the same checkout**, differing only in copy and capture timing
  (§6) — one code path, two honest framings.

---

## 5. Inventory, allocation & the waitlist

Limited editions demand correctness — *overselling a 300-piece edition is a brand wound.*

- **A source of truth for allocation** (a small datastore — §7), not guesswork. Editions have a
  finite `allocation`; pre-orders have a `cap`.
- **Reserve-on-intent with a hold.** Starting checkout places a **short hold** (e.g. ~10 min) on a
  unit so two people can't buy the last one; the hold **expires quietly** and returns the unit if
  the checkout is abandoned. No countdown is shown to the visitor — the hold protects them, it
  doesn't pressure them.
- **Atomic decrement on payment success** (via webhook, §6) — the single authority for "sold".
- **Waitlist / notify** for `announced` and `resting` releases: an email captured against *that
  release*, integrated with `stay-close`. Framed as *"we'll write to you,"* never "sign up now."

---

## 6. Payments & the backend

**Recommended: Stripe**, behind the `lib/commerce` adapter ([doc 11 §B2](./11-architecture-redesign.md)).
Stripe fits DTC limited drops cleanly and keeps us **PCI-light — no card data ever touches our
servers** (Payment Element / hosted Checkout).

- **Purchase (`available`):** capture immediately; dispatch now.
- **Pre-order (`preorder`):** per release, either
  - **pay-in-full now, ship-when-ready** (simplest, with an honest dispatch window stated up
    front), or
  - **authorize/deposit now, capture on fulfillment** (deferred capture / partial) where law and
    timelines favor it.
- **Webhooks** (`api/checkout` + Stripe events) are the **fulfillment + allocation authority**:
  on `payment_succeeded` → finalize the order, decrement the edition, `revalidateTag` the release
  so the page state updates, trigger confirmation + fulfillment.
- **Adapter, not lock-in.** `CommerceProvider` interface (releases, holds, orders, payment
  intents). `StripeProvider` for launch; a `ShopifyProvider` remains a no-rewrite option if the
  house later wants built-in fulfillment/ops/tax tooling.

> **Alternative considered:** Shopify headless — stronger out-of-the-box ops/fulfillment/tax, but
> heavier and less control over the *feel* of checkout. Given limited drops and a premium, bespoke
> checkout, **Stripe + a thin datastore wins on control**; the adapter keeps the door open.

---

## 7. Data & domain model

Typed, server-owned, accessed through adapters ([doc 11 §B6, §B10](./11-architecture-redesign.md)):

- **`Release`** (the drop): `fragranceSlug`, `state` (§3), `mode` (preorder|purchase), `edition`
  (size, optional/quietly shown), `allocation`/`sold`, `window` (open/close, dispatch estimate),
  `price: Money`, `variants` (size SKUs), `media`, `seo`.
- **`Fragrance`**: the immersive content (state, arc, composition) — joined to its current
  `Release`.
- **`Reservation`**: a unit hold (`releaseId`, `expiresAt`).
- **`Order`**: line(s), `Money` totals, fulfillment status, pre-order flag, dispatch estimate.
- **`NotifySignup`**: email ↔ release, consent.

A **small datastore** (serverless Postgres — e.g. Neon/Supabase) owns allocation, holds, orders,
and notify lists; Stripe owns payment. Both sit behind `lib/commerce` so pages/components never
touch either directly.

---

## 8. Compliance & fulfillment (fragrance is regulated)

Premium trust includes getting the unglamorous parts right:

- **Shipping restrictions.** Alcohol-based fragrance is a **limited-quantity dangerous good** for
  air transport; carriers and destinations restrict it. Checkout must validate **shippable
  destinations** and surface honest limits — calmly, in voice, before payment.
- **Regulatory labeling.** IFRA/allergen/volume/batch present and compliant
  ([Packaging §7](./08-packaging-guidelines.md)); ingredient honesty
  ([Content §6](./06-content-guidelines.md)).
- **Consumer law.** Clear pre-order terms (what you've paid for, when it ships, cancellation/refund
  rights), VAT/duties handling, and returns ([doc 09 §7](./09-website-architecture.md)).
- **Taxes** computed correctly per destination (Stripe Tax or equivalent).

---

## 9. UX & emotional rules for commerce

- **Commerce never leads the page.** Immersion first; the keeping is the quiet decision
  ([UX §5](./02-ux-guidelines.md)).
- **Language of keeping:** *Keep it / Reserve it / It's yours now / It's reserved* — never
  *Add to cart / Buy now*.
- **Checkout is the one place efficiency leads** ([doc 09 §4.2](./09-website-architecture.md)):
  calm, fast, accessible, no re-selling.
- **Pre-order honesty:** the dispatch window and pre-order nature are stated *before* payment,
  plainly. Anticipation, never ambiguity.
- **Sold-out dignity:** `resting`/`archived` releases keep their full immersive page — a memory
  doesn't get deleted because it's unavailable. Only the action changes (to *notify* or nothing).
- **Consent-gated** analytics/marketing; PCI-light; honest receipts in voice.

---

## 10. Launch posture

- Ship with **whatever mix of states is true**: a `whispered` next release, one or two `preorder`
  or `available` drops, archived history if any. The system supports all simultaneously.
- **If production is finalized → full purchase.** **If not → pre-order**, with honest timelines.
- Built **Stripe + thin datastore**, behind the commerce adapter, so the felt experience can be
  complete and real without committing to heavy commerce infrastructure.

---

## The test (for commerce)

> *Could a person reserve a limited release feeling only that they recognized something worth
> keeping — never that a clock, a counter, or a salesperson pushed them — and trust completely
> that what they paid for will arrive as promised?*

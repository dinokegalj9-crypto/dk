# 05 — Typography Guidelines

> Type is the voice made visible. In a near-empty space, the words carry almost everything —
> so they must be set with the care of poetry on a page.

## 1. Principles

- **Type is the primary medium.** With imagery used sparingly and color held back, typography
  does most of the emotional work. Treat every line like it's printed in a book that matters.
- **Editorial, not interface.** We set type like a literary art book or a gallery wall text —
  generous, considered, unhurried — not like a SaaS dashboard.
- **Restraint here too.** Few sizes, few weights, enormous care. The drama comes from scale and
  space, not from many styles.

## 2. The type system

Two voices, in deliberate tension:

- **Display / Serif — the memory voice.** A high-contrast or humanist serif with soul and a
  literary feel. Used for fragrance names, the states, headlines, and pull-quotes — the
  emotional, poetic register. *Recommended directions:* a refined serif such as a Canela / GT
  Sectra / Freight Display register, or a quiet classic (e.g. EB Garamond) for a more timeless,
  letter-from-the-past feel. Choose one and commit.
- **Text / Grotesque — the quiet voice.** A neutral, low-key sans for body, navigation, and
  utility. Calm, legible, nearly invisible so the serif and the meaning lead. *Recommended
  directions:* a soft grotesque such as Suisse Int'l / GT America / Söhne, or the open-source
  Inter as a dependable default.

> Pick **one serif** and **one sans**. A third typeface is almost always a mistake. If the
> brand ever needs a flourish, it earns it through *one* expressive cut of the serif — not a new
> family.

## 3. Scale

A modular scale (ratio ~1.333, "perfect fourth") gives cinematic jumps between the intimate and
the monumental. Sizes are fluid (`clamp`) across viewports.

| Token | Role | Indicative size (desktop) |
|-------|------|---------------------------|
| `display-xl` | The threshold word; a single monumental state name | 96–140px |
| `display` | Fragrance names, scene titles | 56–80px |
| `headline` | Section openings | 36–48px |
| `subhead` | Supporting emphasis | 24–28px |
| `body-lg` | Lead paragraphs, the emotional copy | 19–22px |
| `body` | Standard reading | 17–18px |
| `caption` | Notes, credits, utility | 13–14px |

- **Big should be genuinely big.** When the serif goes large, let it dominate the view with
  space around it — a single line as the entire screen is encouraged at thresholds.
- **Small should be calm**, never cramped. Captions still breathe.

## 4. Rhythm & setting

- **Line length:** body measures **60–75 characters**. Never full-width text on wide screens.
- **Line height:** generous — body around **1.6–1.7**; large display tighter, **1.0–1.15**, so
  big serif lines hold together as shapes.
- **Letter-spacing:** display serif set tight to neutral; small all-caps utility labels get
  **+0.08–0.12em** tracking and are used *very* sparingly (they read as "interface" — minimize).
- **Paragraph spacing** over indents. Space between paragraphs is part of the breath; let
  copy sit in pools of quiet.
- **Alignment:** left-aligned by default (ragged right). Centered type is reserved for singular,
  ceremonial moments (a threshold line, a dedication) — never for body.
- **Widows & orphans:** dedicate care to line breaks in display copy. Use non-breaking spaces to
  shape poetic lines deliberately; a fragrance name or key line should never break awkwardly.

## 5. Color & contrast of type

- Primary text: `--bone` on `--ink` (see [UI](./03-ui-guidelines.md)). Secondary: `--ash`.
- The accent glow may touch a single word — a state name, a verb — like candlelight. One word,
  rarely.
- **All text meets WCAG AA.** Atmospheric low-contrast is tempting and forbidden where it
  harms legibility. Test every pairing.

## 6. Numerals & detail

- Use proper typography: real em-dashes (—), true quotation marks (" "), ellipses (…),
  hanging punctuation where the engine allows. These details are the difference between a book
  and a webpage.
- Tabular/old-style figures chosen intentionally — old-style figures for flowing copy, lining
  for any data. Prices set quietly, never bolded for emphasis.

## 7. Performance & accessibility

- Self-host fonts; preload the two primary cuts. Use `font-display: swap` with a carefully
  matched fallback so the layout doesn't lurch (the swap should be imperceptible — a jarring
  FOUT breaks the spell as badly as jank).
- Never ship text as images (except truly decorative lockups, which still need alt text).
- Respect user font-size and zoom: use `rem`, allow scaling, never disable it.

## 8. The test

> *Does this page read like a passage from a book you'd keep — or like an interface?*

import type { Fragrance } from "@/types/content";

/* =====================================================================
   The launch states. Few things, made well (doc 12). The state leads;
   the facts — the nose, the accords, the concentration, the price —
   are present and honest, never withheld. (Perfumer names and pricing
   are placeholders pending the real house; the SHAPE is production.)
   ===================================================================== */
export const fragrances: Fragrance[] = [
  {
    slug: "threshold",
    name: "Threshold",
    state: "The last warm day before the cold decides to stay.",
    collection: "waking",
    note: "Waking · No. I",
    tone: "#c1875c",
    unfolding: [
      "You feel it before you understand it — the light has gone thin and gold, and something is ending that you didn't agree to.",
      "It stays on the skin the way a season does: warm, then less warm, then only the memory of warm.",
    ],
    perfumer: "Camille Aubert",
    concentration: "Extrait de Parfum · 24%",
    composition: {
      opens: ["bergamot", "fig leaf", "warm hay"],
      becomes: ["immortelle", "dried tobacco", "beeswax"],
      stays: ["sandalwood", "amber", "suede"],
    },
    longevity: "8–10 hours",
    sillage: "moderate",
    madeIn: "Composed in Grasse",
    sizes: [
      { ml: 50, price: 185 },
      { ml: 100, price: 280 },
    ],
    currency: "GBP",
    keep: { mode: "preorder", note: "Pre-order — dispatches within six weeks." },
    edition: "An edition of 500",
  },
  {
    slug: "undertow",
    name: "Undertow",
    state: "The pull of water you can't see, deciding to let it take you.",
    collection: "submerged",
    note: "Submerged · No. II",
    tone: "#6a7f8d",
    unfolding: [
      "Cold first, and clean — the breath you take at the edge before you stop fighting it.",
      "Then the surface closes over, and it is quiet, and you are not afraid.",
    ],
    perfumer: "Camille Aubert",
    concentration: "Extrait de Parfum · 28%",
    composition: {
      opens: ["cold sea air", "ozone", "bergamot"],
      becomes: ["iris", "wet stone", "ambergris"],
      stays: ["vetiver", "musk", "driftwood"],
    },
    longevity: "10–12 hours",
    sillage: "intimate",
    madeIn: "Composed in Grasse",
    sizes: [
      { ml: 50, price: 195 },
      { ml: 100, price: 295 },
    ],
    currency: "GBP",
    keep: { mode: "available", note: "An edition of 300. When they're gone, they rest." },
    edition: "An edition of 300",
  },
  {
    slug: "after-you-left",
    name: "After You Left",
    state: "The room still holding the shape of someone who has gone.",
    collection: "residue",
    note: "Residue · No. III",
    tone: "#ad7e7a",
    unfolding: [
      "The air hasn't caught up yet. It keeps the warmth of a body that isn't here.",
      "You don't move, because moving would be the first time they were really gone.",
    ],
    perfumer: "Inés Varga",
    concentration: "Extrait de Parfum · 26%",
    composition: {
      opens: ["cool rose", "aldehydes", "pink pepper"],
      becomes: ["orris", "violet", "incense"],
      stays: ["cashmeran", "white musk", "faded amber"],
    },
    longevity: "7–9 hours",
    sillage: "intimate",
    madeIn: "Composed in Grasse",
    sizes: [{ ml: 50, price: 210 }],
    currency: "GBP",
    keep: { mode: "resting", note: "Resting. We'll write to you if it returns." },
    edition: "An edition of 200",
  },
  {
    slug: "the-long-afternoon",
    name: "The Long Afternoon",
    state: "Gold light that lasted a thousand years, when time forgot you.",
    collection: "long-afternoon",
    note: "The Long Afternoon · No. IV",
    tone: "#b6995f",
    unfolding: [
      "Dust turning slowly in a bar of sun. Nowhere to be. No one looking for you.",
      "The particular boredom that, years later, you would give anything to feel once more.",
    ],
    perfumer: "Inés Varga",
    concentration: "Extrait de Parfum · 25%",
    composition: {
      opens: ["sun-warmed skin", "mandarin", "hay"],
      becomes: ["orange blossom", "honey", "mimosa"],
      stays: ["tonka", "sandalwood", "soft amber"],
    },
    longevity: "8–10 hours",
    sillage: "fills a room",
    madeIn: "Composed in Grasse",
    sizes: [
      { ml: 50, price: 185 },
      { ml: 100, price: 280 },
    ],
    currency: "GBP",
    keep: { mode: "preorder", note: "Pre-order — dispatches within six weeks." },
    edition: "An edition of 500",
  },
];

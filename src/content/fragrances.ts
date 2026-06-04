import type { Fragrance } from "@/types/content";

/* =====================================================================
   The launch states. Few things, made well (doc 12). Each is a state of
   being, never a list of notes. Imagery is tonal for now; the grade and
   art direction land with the media pipeline (doc 11 §B6).
   ===================================================================== */
export const fragrances: Fragrance[] = [
  {
    slug: "threshold",
    name: "Threshold",
    state: "The last warm day before the cold decides to stay.",
    collection: "waking",
    note: "Waking · No. I",
    tone: "#c9824e",
    unfolding: [
      "You feel it before you understand it — the light has gone thin and gold, and something is ending that you didn't agree to.",
      "It stays on the skin the way a season does: warm, then less warm, then only the memory of warm.",
    ],
    keep: { mode: "preorder", note: "Pre-order — dispatches when it's ready." },
  },
  {
    slug: "undertow",
    name: "Undertow",
    state: "The pull of water you can't see, deciding to let it take you.",
    collection: "submerged",
    note: "Submerged · No. II",
    tone: "#5e7588",
    unfolding: [
      "Cold first, and clean — the breath you take at the edge before you stop fighting it.",
      "Then the surface closes over, and it is quiet, and you are not afraid.",
    ],
    keep: { mode: "available", note: "An edition of 300. When they're gone, they rest." },
  },
  {
    slug: "after-you-left",
    name: "After You Left",
    state: "The room still holding the shape of someone who has gone.",
    collection: "residue",
    note: "Residue · No. III",
    tone: "#b66e6c",
    unfolding: [
      "The air hasn't caught up yet. It keeps the warmth of a body that isn't here.",
      "You don't move, because moving would be the first time they were really gone.",
    ],
    keep: { mode: "resting", note: "Resting. We'll write to you if it returns." },
  },
  {
    slug: "the-long-afternoon",
    name: "The Long Afternoon",
    state: "Gold light that lasted a thousand years, when time forgot you.",
    collection: "long-afternoon",
    note: "The Long Afternoon · No. IV",
    tone: "#c7a352",
    unfolding: [
      "Dust turning slowly in a bar of sun. Nowhere to be. No one looking for you.",
      "The particular boredom that, years later, you would give anything to feel once more.",
    ],
    keep: { mode: "preorder", note: "Pre-order — dispatches when it's ready." },
  },
];

import type { Fragrance } from "@/types/content";

/* =====================================================================
   CHAPTER I — Origins. Four fragments: Memory, Consciousness, Emotion,
   Identity — the pieces from which a self is first assembled. For
   launch only Fragment I (Memorium) is released; the rest are forming.
   You are not buying a perfume; you are collecting a fragment of a life.
   ===================================================================== */
export const fragrances: Fragrance[] = [
  {
    status: "available",
    slug: "memorium",
    name: "Memorium",
    chapterSlug: "i",
    chapterNumeral: "I",
    fragmentNumeral: "I",
    facet: "Memory",
    collection: "waking",
    tone: "#c1875c",
    image: "/media/memorium.png",
    state: "The first memory — the one that made you, that you can no longer tell from a dream.",
    unfolding: [
      "It arrives the way memory does: out of order, half-lit, certain. A warmth you can't place. A safety you've been trying to return to ever since.",
      "It settles into the skin and stays close, the way the oldest memories do — not loud, never gone.",
    ],
    perfumer: "Camille Aubert",
    concentration: "Extrait de Parfum · 28%",
    composition: {
      opens: ["bergamot", "cold morning air", "warm paper"],
      becomes: ["orris", "violet", "heirloom rose"],
      stays: ["amber", "sandalwood", "soft musk"],
    },
    longevity: "8–10 hours",
    sillage: "moderate, intimate",
    madeIn: "Composed in Grasse",
    sizes: [
      { ml: 50, price: 195 },
      { ml: 100, price: 295 },
    ],
    currency: "GBP",
    keep: {
      mode: "available",
      note: "The first fragment of Chapter I, in Extrait de Parfum.",
    },
  },
  {
    status: "forthcoming",
    slug: "fragment-ii",
    chapterSlug: "i",
    chapterNumeral: "I",
    fragmentNumeral: "II",
    facet: "Consciousness",
    collection: "submerged",
    tone: "#6a7f8d",
    state: "The moment you first knew that you were.",
  },
  {
    status: "forthcoming",
    slug: "fragment-iii",
    chapterSlug: "i",
    chapterNumeral: "I",
    fragmentNumeral: "III",
    facet: "Emotion",
    collection: "residue",
    tone: "#ad7e7a",
    state: "The first feeling that arrived before you had a word for it.",
  },
  {
    status: "forthcoming",
    slug: "fragment-iv",
    chapterSlug: "i",
    chapterNumeral: "I",
    fragmentNumeral: "IV",
    facet: "Identity",
    collection: "long-afternoon",
    tone: "#b6995f",
    state: "The face in the glass you slowly learned to call your own.",
  },
];

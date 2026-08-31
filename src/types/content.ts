/* =====================================================================
   SENSORIUM — CONTENT MODEL
   Sensorium is a journey through consciousness and memory, not a
   catalogue of perfumes.

     Chapter  = a life stage / psychological era
     Fragment = a single perfume — a piece of memory, consciousness,
                emotion, or identity — collected within a chapter.

   A Fragment is never a standalone product; it belongs to a chapter and
   to a larger story the customer is assembling.
   ===================================================================== */

export type Collection = "memory" | "dream" | "light" | "night";
export type Facet = "Memory" | "Consciousness" | "Emotion" | "Identity";
export type FragmentStatus = "available" | "forthcoming";

export interface Chapter {
  slug: string; // "i"
  numeral: string; // "I"
  title: string; // a psychological era
  era: string; // one line
  premise: string;
  total: number; // how many fragments the chapter will hold
}

/** Notes, honestly — as the scent moves through time. */
export interface Composition {
  opens: string[];
  becomes: string[];
  stays: string[];
}

export interface Size {
  ml: number;
  price: number;
}

interface FragmentBase {
  slug: string;
  chapterSlug: string;
  chapterNumeral: string; // "I"
  fragmentNumeral: string; // "I", "II", …
  facet: Facet;
  /** The collection light this fragment casts on the Void. */
  collection: Collection;
  tone: string;
  /** The state, stated as if you already know it. */
  state: string;
  image?: string;
  /** Transparent cutout — the vessel floating free of any background. */
  float?: string;
  /** A cinematic "film-still" of the vessel — used large on its page. */
  scene?: string;
}

/** A released fragment — fully realised, navigable, purchasable. */
export interface AvailableFragment extends FragmentBase {
  status: "available";
  name: string;
  unfolding: string[];
  perfumer: string;
  concentration: string;
  composition: Composition;
  longevity: string;
  sillage: string;
  madeIn: string;
  sizes: Size[];
  currency: string;
  keep: { mode: "preorder" | "available" | "resting"; note: string };
  edition?: string;
}

/** A fragment still to come — named only by its number and its facet. */
export interface ForthcomingFragment extends FragmentBase {
  status: "forthcoming";
  name?: string;
}

export type Fragrance = AvailableFragment | ForthcomingFragment;

/* =====================================================================
   SENSORIUM — CONTENT TYPES
   The typed model the experience is built on (doc 11 §B6 / doc 12).
   Now carries what a connoisseur needs to trust and to buy: the nose,
   the concentration, the accords, longevity, edition, and price — the
   facts live in a quiet zone, but they are never withheld.
   ===================================================================== */

export type Collection = "waking" | "submerged" | "residue" | "long-afternoon";

/** Notes, honestly — as the scent moves through time. */
export interface Composition {
  opens: string[];
  becomes: string[];
  stays: string[];
}

export interface Size {
  ml: number;
  /** Price in major currency units (e.g. pounds). */
  price: number;
}

export interface Fragrance {
  slug: string;
  name: string;
  state: string;
  collection: Collection;
  note: string;
  tone: string;
  /** The memory unfolding in time — second person, present tense. */
  unfolding: string[];

  /* ---- the facts a buyer needs (the quiet zone) ---- */
  /** "The nose" — the author. Credibility, named. */
  perfumer: string;
  concentration: string; // e.g. "Extrait de Parfum · 28%"
  composition: Composition;
  longevity: string; // e.g. "8–10 hours"
  sillage: string; // e.g. "intimate" | "moderate" | "fills a room"
  madeIn: string; // e.g. "Composed in Grasse"
  sizes: Size[];
  currency: string; // ISO 4217, e.g. "GBP"

  /* ---- drops model (doc 12) ---- */
  keep: { mode: "preorder" | "available" | "resting"; note: string };
  edition?: string;
}

/* =====================================================================
   SENSORIUM — CONTENT TYPES
   The typed model the experience is built on (doc 11 §B6 / doc 12).
   Kept focused for the showcase; extends cleanly to releases/variants.
   ===================================================================== */

/** A collection is a threshold of consciousness; it carries one light. */
export type Collection = "waking" | "submerged" | "residue" | "long-afternoon";

export interface Fragrance {
  slug: string;
  /** The name — evokes the state without explaining it. */
  name: string;
  /** The state, stated as if you already know it. */
  state: string;
  collection: Collection;
  /** The quiet metadata line, e.g. "Submerged · No. II". */
  note: string;
  /** The collection's ember tone (hex) — tints the fragment's light
   *  independent of the Void's current accent. */
  tone: string;
  /** The memory unfolding in time — short, second person, present tense. */
  unfolding: string[];
  /** Drops model (doc 12): how this release may be kept, stated honestly. */
  keep: { mode: "preorder" | "available" | "resting"; note: string };
}

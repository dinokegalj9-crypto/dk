/* =====================================================================
   SENSORIUM — CONTENT ADAPTER (doc 11 §B8 / §B10)
   Pages never import content directly — only through here. Today it
   reads local typed data; tomorrow a CMS/commerce backend slots in
   behind the same functions, with no page or component change.
   ===================================================================== */
import { fragrances } from "@/content/fragrances";
import type { Fragrance } from "@/types/content";

export function getFragrances(): Fragrance[] {
  return fragrances;
}

export function getFragrance(slug: string): Fragrance | undefined {
  return fragrances.find((f) => f.slug === slug);
}

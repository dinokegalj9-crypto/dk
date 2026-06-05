/* =====================================================================
   SENSORIUM — CONTENT ADAPTER (doc 11 §B8 / §B10)
   Pages never import content directly — only through here. Local typed
   data now; a CMS slots in behind the same functions later.
   ===================================================================== */
import { activeChapter, chapters } from "@/content/chapters";
import { fragrances } from "@/content/fragrances";
import type { AvailableFragment, Chapter, Fragrance } from "@/types/content";

export function getChapters(): Chapter[] {
  return chapters;
}

export function getActiveChapter(): Chapter {
  return activeChapter;
}

/** All fragments of a chapter, in collection order (default: the active one). */
export function getFragments(chapterSlug: string = activeChapter.slug): Fragrance[] {
  return fragrances.filter((f) => f.chapterSlug === chapterSlug);
}

/** Only released fragments — these have pages and can be kept. */
export function getAvailableFragments(): AvailableFragment[] {
  return fragrances.filter((f): f is AvailableFragment => f.status === "available");
}

export function getFragment(slug: string): Fragrance | undefined {
  return fragrances.find((f) => f.slug === slug);
}

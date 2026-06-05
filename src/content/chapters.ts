import type { Chapter } from "@/types/content";

/* =====================================================================
   The chapters of a life. For launch, Chapter I is the active era; its
   first fragment, Memorium, is released. The rest are still forming.
   ===================================================================== */
export const chapterOne: Chapter = {
  slug: "i",
  numeral: "I",
  title: "Origins",
  era: "the formation of a self",
  premise:
    "Before you were a person, you were impressions — light, warmth, a face that meant safety, a fear with no name. Chapter I gathers the fragments from which a self is first assembled. Collect them, and the story of a beginning takes shape.",
  total: 4,
};

export const chapters: Chapter[] = [chapterOne];

export const activeChapter = chapterOne;

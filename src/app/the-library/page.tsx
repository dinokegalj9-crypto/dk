import type { Metadata } from "next";
import ChapterShowcase from "@/components/chapter/ChapterShowcase";
import { getActiveChapter, getFragments } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Library",
  description:
    "Chapter I — Origins. Collect the fragments from which a self is first assembled. You are not buying a perfume; you are collecting the fragments of a life.",
};

export default function TheLibraryPage() {
  const chapter = getActiveChapter();
  const fragments = getFragments(chapter.slug);
  return (
    <main style={{ paddingTop: "5rem" }}>
      <ChapterShowcase chapter={chapter} fragments={fragments} as="h1" />
    </main>
  );
}

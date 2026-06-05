import Surfacing from "@/components/atmosphere/Surfacing";
import ChapterShowcase from "@/components/chapter/ChapterShowcase";
import Philosophy from "@/components/sections/Philosophy";
import { getActiveChapter, getFragments } from "@/lib/content";

export default function Home() {
  const chapter = getActiveChapter();
  const fragments = getFragments(chapter.slug);
  return (
    <main>
      {/* The hero: The Surfacing. The Void lives in the root layout. */}
      <Surfacing />

      {/* Chapter I — the active era, collected fragment by fragment. */}
      <ChapterShowcase chapter={chapter} fragments={fragments} />

      {/* The House: why Sensorium exists. */}
      <Philosophy />
    </main>
  );
}

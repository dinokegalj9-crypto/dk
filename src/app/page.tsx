import Surfacing from "@/components/atmosphere/Surfacing";
import FragmentShowcase from "@/components/fragments/FragmentShowcase";
import Philosophy from "@/components/sections/Philosophy";
import { getFragrances } from "@/lib/content";

export default function Home() {
  const fragrances = getFragrances();
  return (
    <main>
      {/* The hero: The Surfacing. The Void lives in the root layout. */}
      <Surfacing />

      {/* The Drift: states as fragments, retinting the Void as they pass. */}
      <FragmentShowcase fragrances={fragrances} />

      {/* The House: why Sensorium exists. */}
      <Philosophy />
    </main>
  );
}

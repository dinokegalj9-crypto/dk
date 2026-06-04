import Surfacing from "@/components/atmosphere/Surfacing";
import FragmentShowcase from "@/components/fragments/FragmentShowcase";
import { getFragrances } from "@/lib/content";

export default function Home() {
  const fragrances = getFragrances();
  return (
    <main>
      {/* The hero: The Surfacing. The Void lives in the root layout. */}
      <Surfacing />

      {/* The Drift: states as fragments, retinting the Void as they pass. */}
      <FragmentShowcase fragrances={fragrances} />
    </main>
  );
}

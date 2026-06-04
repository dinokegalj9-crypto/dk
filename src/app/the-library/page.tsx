import type { Metadata } from "next";
import FragmentShowcase from "@/components/fragments/FragmentShowcase";
import { getFragrances } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Library",
  description: "Each is a state. Find the one you've been missing.",
};

export default function TheLibraryPage() {
  const fragrances = getFragrances();
  return (
    <main style={{ paddingTop: "6rem" }}>
      <FragmentShowcase
        fragrances={fragrances}
        as="h1"
        eyebrow="The Library"
        heading="Every state we hold. Find the one you've been missing."
        coda="When a state is gone, it rests. Some return; some remain only as memory."
      />
    </main>
  );
}

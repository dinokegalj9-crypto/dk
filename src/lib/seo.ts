/* =====================================================================
   SEO — structured data (doc 11 §B9). Niche fragrance is discovered by
   note and by name, on Google and in rich results. The poetic copy
   leads for humans; this Product schema (with the real accords and
   price) makes the page legible to machines so it can be found at all.
   ===================================================================== */
import type { AvailableFragment } from "@/types/content";

const SITE_URL = "https://sensorium.example";

const availabilityFor = (mode: AvailableFragment["keep"]["mode"]): string => {
  switch (mode) {
    case "available":
      return "https://schema.org/InStock";
    case "preorder":
      return "https://schema.org/PreOrder";
    case "resting":
      return "https://schema.org/OutOfStock";
  }
};

export function productJsonLd(f: AvailableFragment) {
  const notes = [...f.composition.opens, ...f.composition.becomes, ...f.composition.stays];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${f.name} — Chapter ${f.chapterNumeral}, Fragment ${f.fragmentNumeral}`,
    category: "Fragrance",
    brand: { "@type": "Brand", name: "Sensorium" },
    description: `${f.state} Fragment ${f.fragmentNumeral} of Sensorium Chapter ${f.chapterNumeral}. A ${f.concentration} by ${f.perfumer}. Notes of ${notes.join(", ")}.`,
    url: `${SITE_URL}/fragrance/${f.slug}`,
    offers: f.sizes.map((s) => ({
      "@type": "Offer",
      name: `${s.ml}ml`,
      price: s.price,
      priceCurrency: f.currency,
      availability: availabilityFor(f.keep.mode),
      url: `${SITE_URL}/fragrance/${f.slug}`,
    })),
  };
}

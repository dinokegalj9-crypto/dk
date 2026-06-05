import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SetCollection from "@/components/atmosphere/SetCollection";
import Surface from "@/components/atmosphere/Surface";
import Composition from "@/components/fragrance/Composition";
import KeepPanel from "@/components/fragrance/KeepPanel";
import { getFragrance, getFragrances } from "@/lib/content";
import { productJsonLd } from "@/lib/seo";
import styles from "./fragrance.module.css";

export function generateStaticParams() {
  return getFragrances().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = getFragrance(slug);
  if (!f) return {};
  const notes = [...f.composition.opens, ...f.composition.becomes, ...f.composition.stays];
  return {
    title: f.name,
    description: `${f.state} A ${f.concentration} by ${f.perfumer}. Notes of ${notes.join(", ")}.`,
    openGraph: { title: `${f.name} · Sensorium`, description: f.state },
  };
}

export default async function FragrancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = getFragrance(slug);
  if (!f) notFound();

  return (
    <main>
      <SetCollection name={f.collection} />
      {/* discoverable by note and name — the substance for machines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(f)) }}
      />

      {/* the immersion still leads */}
      <article className={styles.entry}>
        <Surface>
          <p className="t-label">{f.note}</p>
        </Surface>
        <Surface index={1}>
          <h1 className={`t-memory glow-word ${styles.name}`}>{f.name}</h1>
        </Surface>
        <Surface index={2}>
          <p className={styles.state}>{f.state}</p>
        </Surface>

        <div className={styles.unfolding}>
          {f.unfolding.map((line, i) => (
            <Surface key={i} index={3 + i}>
              <p className={styles.line}>{line}</p>
            </Surface>
          ))}
        </div>
      </article>

      {/* then the quiet facts, and the way to keep it */}
      <div className={styles.facts}>
        <Composition fragrance={f} />
        <KeepPanel fragrance={f} />

        <Link href="/the-library" className={styles.back}>
          ← every state
        </Link>
      </div>
    </main>
  );
}

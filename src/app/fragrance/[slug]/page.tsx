import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SetCollection from "@/components/atmosphere/SetCollection";
import Surface from "@/components/atmosphere/Surface";
import Composition from "@/components/fragrance/Composition";
import KeepPanel from "@/components/fragrance/KeepPanel";
import { getAvailableFragments, getFragment } from "@/lib/content";
import { productJsonLd } from "@/lib/seo";
import styles from "./fragrance.module.css";

export function generateStaticParams() {
  return getAvailableFragments().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = getFragment(slug);
  if (!f || f.status !== "available") return {};
  const notes = [...f.composition.opens, ...f.composition.becomes, ...f.composition.stays];
  return {
    title: `${f.name} — Chapter ${f.chapterNumeral}, Fragment ${f.fragmentNumeral}`,
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
  const f = getFragment(slug);
  if (!f || f.status !== "available") notFound();

  return (
    <main>
      <SetCollection name={f.collection} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(f)) }}
      />

      {/* the vessel + the hierarchy — Chapter → Fragment → Name */}
      <section className={styles.hero}>
        <div className={styles.vessel}>
          <span className={styles.glow} aria-hidden />
          <div className={styles.shot}>
            {f.image ? (
              <Image
                src={f.image}
                alt={`${f.name}, Fragment ${f.fragmentNumeral} — a faceted crystal vessel lit amber on dark stone.`}
                fill
                sizes="(max-width: 60rem) 86vw, 44vw"
                className={styles.shotImg}
                priority
              />
            ) : null}
          </div>
        </div>

        <div className={styles.intro}>
          <Surface>
            <div className={styles.hier}>
              <p className="t-label">Chapter {f.chapterNumeral}</p>
              <span className={styles.tick} aria-hidden />
              <p className={styles.fragmentLine}>
                Fragment {f.fragmentNumeral} · {f.facet}
              </p>
            </div>
          </Surface>
          <Surface index={1}>
            <h1 className={`glow-word ${styles.name}`}>{f.name}</h1>
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
        </div>
      </section>

      {/* the quiet facts, and the way to keep this fragment */}
      <div className={styles.facts}>
        <Composition fragrance={f} />
        <KeepPanel fragrance={f} />
        <Link href="/the-library" className={styles.back}>
          ← Chapter {f.chapterNumeral}, in full
        </Link>
      </div>
    </main>
  );
}

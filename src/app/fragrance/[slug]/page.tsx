import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SetCollection from "@/components/atmosphere/SetCollection";
import Surface from "@/components/atmosphere/Surface";
import { getFragrance, getFragrances } from "@/lib/content";
import styles from "./fragrance.module.css";

/* Limited catalogue → fully static (doc 11 §B10). */
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
  return {
    title: f.name,
    description: f.state,
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
      {/* the whole room takes this state's light */}
      <SetCollection name={f.collection} />

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

        <Surface index={5}>
          <div className={styles.keep}>
            <span className={styles.keepNote}>{f.keep.note}</span>
            <Link href="/" className={styles.back}>
              ← back to the surface
            </Link>
          </div>
        </Surface>
      </article>
    </main>
  );
}

"use client";

/* =====================================================================
   FRAGMENT — a piece of a chapter, not a standalone product. Shows the
   Chapter → Fragment → Name hierarchy. Released fragments carry their
   vessel and link to their page (with a soft deepen on the way in);
   forthcoming fragments appear as a faceted shard, "not yet formed".
   On view, the fragment casts its light across the Void, and its parts
   surface in a gentle stagger.
   ===================================================================== */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import Surface from "@/components/atmosphere/Surface";
import { useVoid } from "@/lib/void";
import type { Fragrance } from "@/types/content";
import styles from "./Fragment.module.css";

export default function Fragment({
  fragrance: f,
  index = 0,
}: {
  fragrance: Fragrance;
  index?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { setCollection, deepen } = useVoid();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCollection(f.collection);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [f.collection, setCollection]);

  const toneStyle = { ["--tone" as string]: f.tone } as CSSProperties;

  const hierarchy = (
    <div className={styles.hier}>
      <p className="t-label">Chapter {f.chapterNumeral}</p>
      <span className={styles.tick} aria-hidden />
      <p className={styles.fragmentLine}>
        Fragment {f.fragmentNumeral} · {f.facet}
      </p>
    </div>
  );

  if (f.status === "available") {
    return (
      <article ref={ref} className={styles.featured} style={toneStyle}>
        <Link
          className={`${styles.featuredLink} ${index % 2 === 1 ? styles.flip : ""}`}
          href={`/fragrance/${f.slug}`}
          onClick={() => deepen(0.6)} // the world dims as you go in
          aria-label={`Chapter ${f.chapterNumeral}, Fragment ${f.fragmentNumeral} — ${f.name}`}
        >
          <Surface className={styles.vessel}>
            <span className={styles.glow} aria-hidden />
            <div className={styles.shot}>
              {f.image ? (
                <Image
                  src={f.image}
                  alt={`${f.name}, Fragment ${f.fragmentNumeral} — a faceted crystal vessel lit on dark stone, like a shard of memory held to the light.`}
                  fill
                  sizes="(max-width: 52rem) 84vw, 40vw"
                  className={styles.shotImg}
                  priority
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
          </Surface>
          <div className={styles.meta}>
            <Surface index={0}>{hierarchy}</Surface>
            <Surface index={1}>
              <h3 className={styles.name}>{f.name}</h3>
            </Surface>
            <Surface index={2}>
              <p className={styles.state}>{f.state}</p>
            </Surface>
            <Surface index={3}>
              <span className={styles.enter}>
                Hold this fragment <span className={styles.arrow} aria-hidden>→</span>
              </span>
            </Surface>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article ref={ref} className={styles.forthcoming} style={toneStyle}>
      <div className={styles.shard} aria-hidden />
      <div className={styles.meta}>
        {hierarchy}
        <p className={styles.facetTitle}>{f.facet}</p>
        <p className={styles.stateMuted}>{f.state}</p>
        <p className={styles.locked}>Not yet formed</p>
      </div>
    </article>
  );
}

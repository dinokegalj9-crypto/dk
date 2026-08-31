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

/* Pieces of glass drifting around the vessel — a fragment is a shard of
   something larger. Positions are % of the vessel box, so they scale. */
interface Shard {
  x: number; y: number; w: number; r: number; dur: number; delay: number; op: number; blur: number;
}
const SHARDS_BACK: Shard[] = [
  { x: 6, y: 20, w: 3.6, r: -18, dur: 15, delay: 0, op: 0.61, blur: 1.6 },
  { x: 82, y: 13, w: 4.4, r: 24, dur: 18, delay: -4, op: 0.52, blur: 2.2 },
  { x: 14, y: 66, w: 3.0, r: 8, dur: 13, delay: -7, op: 0.58, blur: 1.2 },
  { x: 88, y: 58, w: 3.8, r: -32, dur: 20, delay: -2, op: 0.46, blur: 2.4 },
  { x: 46, y: 5, w: 2.6, r: 14, dur: 16, delay: -9, op: 0.49, blur: 1.8 },
];
const SHARDS_FRONT: Shard[] = [
  { x: 11, y: 42, w: 2.4, r: 30, dur: 12, delay: -3, op: 0.8, blur: 0 },
  { x: 79, y: 36, w: 3.2, r: -12, dur: 17, delay: -6, op: 0.72, blur: 0.4 },
  { x: 64, y: 82, w: 2.2, r: 42, dur: 14, delay: -1, op: 0.72, blur: 0 },
  { x: 27, y: 87, w: 2.8, r: -24, dur: 19, delay: -8, op: 0.64, blur: 0.8 },
];

function shardStyle(s: Shard): CSSProperties {
  return {
    left: `${s.x}%`,
    top: `${s.y}%`,
    width: `${s.w}%`,
    opacity: s.op,
    filter: s.blur ? `blur(${s.blur}px)` : undefined,
    animationDuration: `${s.dur}s`,
    animationDelay: `${s.delay}s`,
    ["--r" as string]: `${s.r}deg`,
  } as CSSProperties;
}

export default function Fragment({
  fragrance: f,
  index = 0,
}: {
  fragrance: Fragrance;
  index?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { setCollection, bloom } = useVoid();

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
          onClick={() => bloom(0.6)} // the world blooms with light as you go in
          aria-label={`Chapter ${f.chapterNumeral}, Fragment ${f.fragmentNumeral} — ${f.name}`}
        >
          <Surface className={styles.vessel}>
            <span className={styles.glow} aria-hidden />
            <span className={`${styles.shards} ${styles.shardsBack}`} aria-hidden>
              {SHARDS_BACK.map((s, i) => (
                <i key={i} className={styles.shard} style={shardStyle(s)} />
              ))}
            </span>
            <div className={`${styles.shot} ${f.float ? styles.shotFloat : ""}`}>
              {f.float || f.image ? (
                <Image
                  src={f.float ?? f.image!}
                  alt={`${f.name}, Fragment ${f.fragmentNumeral} — a faceted crystal vessel floating in the dark, like a shard of memory held to the light.`}
                  fill
                  sizes="(max-width: 52rem) 84vw, 40vw"
                  className={f.float ? styles.shotImgFloat : styles.shotImg}
                  priority
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
            <span className={`${styles.shards} ${styles.shardsFront}`} aria-hidden>
              {SHARDS_FRONT.map((s, i) => (
                <i key={i} className={styles.shard} style={shardStyle(s)} />
              ))}
            </span>
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

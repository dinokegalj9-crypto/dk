"use client";

/* =====================================================================
   FRAGMENT — a single state, encountered as a fragment of memory.
   Surfaces on view (via <Surface/>), and — when `retint` is set —
   turns the whole Void to its collection's light as it centers, so
   scrolling the showcase changes the room you're standing in.
   ===================================================================== */
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import Surface from "@/components/atmosphere/Surface";
import { useVoid } from "@/lib/void";
import type { Fragrance } from "@/types/content";
import styles from "./Fragment.module.css";

interface Props {
  fragrance: Fragrance;
  index: number;
  /** Retint the Void to this fragrance's collection while it's centered. */
  retint?: boolean;
}

export default function Fragment({ fragrance, index, retint = false }: Props) {
  const { name, slug, state, note, tone, collection } = fragrance;
  const ref = useRef<HTMLElement>(null);
  const { setCollection } = useVoid();

  useEffect(() => {
    if (!retint) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Hand-off, not reset: when this fragment centers, the world
        // becomes its light. The next fragment takes over from there.
        if (entry.isIntersecting) setCollection(collection);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [retint, collection, setCollection]);

  const align = index % 2 === 0 ? styles.alignLeft : styles.alignRight;

  return (
    <Surface amount={0.25}>
      <article
        ref={ref}
        className={`${styles.fragment} ${align}`}
        style={{ ["--tone" as keyof CSSProperties]: tone } as CSSProperties}
      >
        <Link className={styles.link} href={`/fragrance/${slug}`} aria-label={`${name} — ${state}`}>
          <div className={styles.imageWrap}>
            <div className={styles.image}>
              <div
                className={styles.imageInner}
                style={{
                  background: `radial-gradient(120% 95% at 35% 22%, ${tone}, var(--color-ink-900) 72%)`,
                }}
              />
            </div>
          </div>
          <div className={styles.meta}>
            <p className="t-label">{note}</p>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.state}>{state}</p>
            <span className={styles.enter}>
              Enter this state <span className={styles.arrow} aria-hidden>→</span>
            </span>
          </div>
        </Link>
      </article>
    </Surface>
  );
}

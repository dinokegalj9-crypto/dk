/* =====================================================================
   FRAGMENT SHOWCASE — the Drift section. A server component: the copy
   and structure render on the server (SEO, legible without JS); the
   fragments and reveals are the client enhancement. (doc 11 §B4)
   ===================================================================== */
import Surface from "@/components/atmosphere/Surface";
import Fragment from "./Fragment";
import type { Fragrance } from "@/types/content";
import styles from "./FragmentShowcase.module.css";

interface Props {
  fragrances: Fragrance[];
  eyebrow?: string;
  heading?: string;
  coda?: string;
  /** Heading element — h2 within a page, h1 when this is the page's lead. */
  as?: "h1" | "h2";
}

export default function FragmentShowcase({
  fragrances,
  eyebrow = "The Library",
  heading = "Each is a state. Find the one you've been missing.",
  coda = "Some things you didn't lose. You just stopped visiting them.",
  as: Heading = "h2",
}: Props) {
  return (
    <section id="drift" className={styles.showcase} aria-label="The Library">
      <div className={styles.inner}>
        <Surface>
          <p className="t-label">{eyebrow}</p>
          <Heading className={styles.heading}>{heading}</Heading>
        </Surface>
      </div>

      <div className={styles.inner}>
        <div className={styles.stream}>
          {fragrances.map((fragrance, i) => (
            <Fragment key={fragrance.slug} fragrance={fragrance} index={i} retint />
          ))}
        </div>

        <Surface>
          <div className={styles.coda}>
            <p className={styles.codaLine}>{coda}</p>
          </div>
        </Surface>
      </div>
    </section>
  );
}

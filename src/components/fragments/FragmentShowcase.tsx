/* =====================================================================
   FRAGMENT SHOWCASE — the Drift section. A server component: the copy
   and structure render on the server (SEO, legible without JS); the
   fragments and reveals are the client enhancement. (doc 11 §B4)
   ===================================================================== */
import Surface from "@/components/atmosphere/Surface";
import Fragment from "./Fragment";
import type { Fragrance } from "@/types/content";
import styles from "./FragmentShowcase.module.css";

export default function FragmentShowcase({ fragrances }: { fragrances: Fragrance[] }) {
  return (
    <section id="drift" className={styles.showcase} aria-label="The Library">
      <div className={styles.inner}>
        <Surface>
          <p className="t-label">The Library</p>
          <h2 className={styles.heading}>
            Each is a state. Find the one you&rsquo;ve been missing.
          </h2>
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
            <p className={styles.codaLine}>
              Some things you didn&rsquo;t lose. You just stopped visiting them.
            </p>
          </div>
        </Surface>
      </div>
    </section>
  );
}

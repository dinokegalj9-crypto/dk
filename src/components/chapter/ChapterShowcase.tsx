/* =====================================================================
   CHAPTER SHOWCASE — the active chapter as a story being collected. The
   released fragment leads; the forthcoming ones wait as shards. The
   progress pips make the larger narrative legible: you are assembling a
   life, one fragment at a time. (Server component; reveals are client.)
   ===================================================================== */
import Surface from "@/components/atmosphere/Surface";
import Fragment from "@/components/fragments/Fragment";
import type { Chapter, Fragrance } from "@/types/content";
import styles from "./ChapterShowcase.module.css";

interface Props {
  chapter: Chapter;
  fragments: Fragrance[];
  as?: "h1" | "h2";
}

export default function ChapterShowcase({ chapter, fragments, as: Heading = "h2" }: Props) {
  const released = fragments.filter((f) => f.status === "available");
  const forthcoming = fragments.filter((f) => f.status === "forthcoming");

  return (
    <section id="chapter" className={styles.section} aria-label={`Chapter ${chapter.numeral}`}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <Surface index={0}>
            <p className="t-label">The active chapter</p>
          </Surface>
          <Surface index={1}>
            <Heading className={styles.chapter}>Chapter {chapter.numeral}</Heading>
          </Surface>
          <Surface index={2}>
            <p className={styles.title}>{chapter.title}</p>
          </Surface>
          <Surface index={3}>
            <p className={styles.premise}>{chapter.premise}</p>
          </Surface>
          <Surface index={4}>
            <div className={styles.progress}>
              <span className={styles.pips} aria-hidden>
                {Array.from({ length: chapter.total }).map((_, i) => (
                  <span key={i} className={styles.pip} data-on={i < released.length} />
                ))}
              </span>
              <span className={styles.progressLabel}>
                {released.length} of {chapter.total} fragments released
              </span>
            </div>
          </Surface>
        </div>
      </div>

      <div className={styles.inner}>
        {released.map((f, i) => (
          <div key={f.slug} className={styles.featured}>
            <Fragment fragrance={f} index={i} />
          </div>
        ))}

        {forthcoming.length > 0 && (
          <>
            <div className={styles.forthcomingHead}>
              <Surface>
                <p className="t-label">Still forming</p>
              </Surface>
            </div>
            <div className={styles.forthcomingGrid}>
              {forthcoming.map((f, i) => (
                <Surface key={f.slug} index={i}>
                  <Fragment fragrance={f} />
                </Surface>
              ))}
            </div>
          </>
        )}

        <Surface>
          <div className={styles.coda}>
            <p className={styles.codaLine}>
              You are not buying a perfume. You are collecting the fragments of a life.
            </p>
          </div>
        </Surface>
      </div>
    </section>
  );
}

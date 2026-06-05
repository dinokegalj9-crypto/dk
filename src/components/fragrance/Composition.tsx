/* =====================================================================
   COMPOSITION — server component. The honest facts, set quietly. This
   is the answer to "all concept, no substance": the nose, the accords,
   the concentration, longevity, sillage, provenance, and the IFRA line.
   ===================================================================== */
import Surface from "@/components/atmosphere/Surface";
import type { Fragrance } from "@/types/content";
import styles from "./Composition.module.css";

export default function Composition({ fragrance: f }: { fragrance: Fragrance }) {
  return (
    <section className={styles.section} aria-label="Composition">
      <Surface>
        <p className={styles.author}>
          A composition by <strong>{f.perfumer}</strong>.
        </p>
      </Surface>

      <Surface>
        <div className={styles.arc}>
          <div className={styles.phase}>
            <p className="t-label">Opens</p>
            <p className={styles.notes}>{f.composition.opens.join(", ")}</p>
          </div>
          <div className={styles.phase}>
            <p className="t-label">Becomes</p>
            <p className={styles.notes}>{f.composition.becomes.join(", ")}</p>
          </div>
          <div className={styles.phase}>
            <p className="t-label">Stays</p>
            <p className={styles.notes}>{f.composition.stays.join(", ")}</p>
          </div>
        </div>
      </Surface>

      <Surface>
        <div className={styles.specs}>
          <div className={styles.spec}>
            <p className="t-label">Concentration</p>
            <p className={styles.specValue}>{f.concentration}</p>
          </div>
          <div className={styles.spec}>
            <p className="t-label">On the skin</p>
            <p className={styles.specValue}>
              {f.longevity} · {f.sillage}
            </p>
          </div>
          <div className={styles.spec}>
            <p className="t-label">Made</p>
            <p className={styles.specValue}>{f.madeIn}</p>
          </div>
          {f.edition ? (
            <div className={styles.spec}>
              <p className="t-label">Edition</p>
              <p className={styles.specValue}>{f.edition}</p>
            </div>
          ) : null}
        </div>
      </Surface>

      <Surface>
        <p className={styles.honesty}>
          Natural and responsibly-sourced synthetic materials, compliant with current IFRA
          standards. Full ingredient list, including allergens, accompanies every order. Cruelty-
          free; never tested on animals.
        </p>
      </Surface>
    </section>
  );
}

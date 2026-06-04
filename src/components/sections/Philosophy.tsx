/* =====================================================================
   PHILOSOPHY — the House manifesto, surfacing in pools of quiet. Server
   component (copy is the SEO substance); reveals are client enhancement.
   ===================================================================== */
import Surface from "@/components/atmosphere/Surface";
import { house } from "@/content/house";
import styles from "./Philosophy.module.css";

export default function Philosophy() {
  return (
    <section id="the-house" className={styles.section} aria-label="The House">
      <div className={styles.inner}>
        <Surface>
          <p className="t-label">{house.eyebrow}</p>
        </Surface>
        <Surface index={1}>
          <h2 className={styles.title}>{house.title}</h2>
        </Surface>
        <Surface index={2}>
          <p className={styles.lead}>{house.lead}</p>
        </Surface>

        {house.body.map((para, i) => (
          <Surface key={i} index={3 + i}>
            <p className={styles.body}>{para}</p>
          </Surface>
        ))}

        <Surface>
          <blockquote className={styles.quote}>{house.quote}</blockquote>
        </Surface>

        <Surface>
          <ol className={styles.principles}>
            {house.principles.map((p) => (
              <li key={p} className={styles.principle}>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </Surface>

        <Surface>
          <p className={styles.close}>{house.close}</p>
        </Surface>
      </div>
    </section>
  );
}

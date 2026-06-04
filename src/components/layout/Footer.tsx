/* =====================================================================
   FOOTER — quiet wayfinding, the stay-close moment, and the test line.
   Server component; on every page via the root layout.
   ===================================================================== */
import Link from "next/link";
import { primaryNav, SITE } from "@/config/site";
import { getFragrances } from "@/lib/content";
import StayClose from "./StayClose";
import styles from "./footer.module.css";

export default function Footer() {
  const fragrances = getFragrances();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <p className={styles.mark}>{SITE.name}</p>
            <p className={styles.markLine}>{SITE.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <p className={styles.colTitle}>Wander</p>
            <div className={styles.links}>
              {primaryNav.map((l) => (
                <Link key={l.href} href={l.href} className={styles.link}>
                  {l.label}
                </Link>
              ))}
              {fragrances.map((f) => (
                <Link key={f.slug} href={`/fragrance/${f.slug}`} className={styles.link}>
                  {f.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className={styles.stay}>
            <StayClose />
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Sensorium</span>
          <span>The interface should feel like remembering, not browsing.</span>
        </div>
      </div>
    </footer>
  );
}

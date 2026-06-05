/* =====================================================================
   FOOTER — quiet wayfinding, the stay-close moment, and the test line.
   Server component; on every page via the root layout.
   ===================================================================== */
import Link from "next/link";
import { primaryNav, SITE } from "@/config/site";
import { getFragments } from "@/lib/content";
import StayClose from "./StayClose";
import styles from "./footer.module.css";

export default function Footer() {
  const fragments = getFragments();
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
            </div>
            <p className={styles.colTitle} style={{ marginTop: "2rem" }}>
              Chapter I
            </p>
            <div className={styles.links}>
              {fragments.map((f) =>
                f.status === "available" ? (
                  <Link key={f.slug} href={`/fragrance/${f.slug}`} className={styles.link}>
                    Fragment {f.fragmentNumeral} · {f.name}
                  </Link>
                ) : (
                  <span key={f.slug} className={styles.linkMuted}>
                    Fragment {f.fragmentNumeral} · {f.facet} — forming
                  </span>
                ),
              )}
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

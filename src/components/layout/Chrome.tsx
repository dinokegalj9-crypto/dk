"use client";

/* =====================================================================
   CHROME — the persistent global frame: the veil nav, the summoned
   menu, and the sound toggle. Mounted once in the root layout. The
   menu rides a Void deepen on navigation (doc 11 §B3).
   ===================================================================== */
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { primaryNav, SITE } from "@/config/site";
import { useVoid } from "@/lib/void";
import { dur, ease } from "@/lib/motion";
import SoundToggle from "./SoundToggle";
import styles from "./chrome.module.css";

export default function Chrome() {
  const [open, setOpen] = useState(false);
  const { deepen } = useVoid();

  // hold the body still while the menu is summoned
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navigate = useCallback(() => {
    setOpen(false);
    deepen(0.7); // close your eyes between rooms
  }, [deepen]);

  return (
    <>
      <nav className={styles.nav} aria-label="Primary">
        <Link className={styles.mark} href="/" onClick={navigate}>
          {SITE.name}
        </Link>
        <button
          type="button"
          className={styles.summon}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="site-menu"
            className={styles.menu}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.slow, ease: [...ease.surface] }}
          >
            {primaryNav.map((link) => (
              <Link key={link.href} href={link.href} className={styles.menuLink} onClick={navigate}>
                {link.label}
              </Link>
            ))}
            <p className={styles.menuTest}>{SITE.tagline}</p>
          </m.div>
        )}
      </AnimatePresence>

      <SoundToggle />
    </>
  );
}

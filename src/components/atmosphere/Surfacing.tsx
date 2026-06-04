"use client";

/* =====================================================================
   THE SURFACING — Sensorium hero (doc: prototypes/hero + doc 11)
   The page is a memory developing in real time; the visitor is the one
   remembering. No bottle, no product, no "shop now" — only the state.

   Split of responsibility (doc 11 §B4):
   - Framer Motion drives the discrete entrance reveal (the word
     assembling, the line and cue surfacing).
   - A single contained rAF drives the continuous atmosphere (the
     cursor "lamp", ambient light drift, the idle "slip", the submerge).
   ===================================================================== */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { letter, surface, wordContainer } from "@/lib/motion";
import styles from "./Surfacing.module.css";

const WORD = "You have been here before";
const LINE = "Before the word for it. Before you could keep it.";

export default function Surfacing() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [developed, setDeveloped] = useState(false);

  // The Develop — let the shroud/memory/clarity transition after mount.
  useEffect(() => {
    if (reduce) {
      setDeveloped(true);
      return;
    }
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setDeveloped(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [reduce]);

  // The continuous atmosphere — one rAF loop.
  useEffect(() => {
    if (reduce) return;
    const hero = heroRef.current;
    const inner = innerRef.current;
    if (!hero) return;

    let raf = 0;
    let mx = 50;
    let my = 45;
    let tx = 50;
    let ty = 45;
    let lastMove = performance.now();
    let slipping = false;
    let running = true;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const frame = (now: number) => {
      if (!running) return;
      const t = now * 0.001;

      // cursor lag — attention drifting after the eye
      mx += (tx - mx) * 0.07;
      my += (ty - my) * 0.07;
      hero.style.setProperty("--mx", `${mx.toFixed(2)}%`);
      hero.style.setProperty("--my", `${my.toFixed(2)}%`);

      // ambient light drift — the room breathes
      hero.style.setProperty("--light-x", `${(70 + Math.sin(t * 0.34) * 6).toFixed(2)}%`);
      hero.style.setProperty("--light-y", `${(36 + Math.cos(t * 0.28) * 5).toFixed(2)}%`);

      // the slip — go still and the memory recedes
      const idle = now - lastMove > 3500;
      if (idle !== slipping) {
        slipping = idle;
        hero.dataset.slipping = String(idle);
      }

      // the submerge — sinking as you scroll past
      const y = window.scrollY || 0;
      const h = hero.offsetHeight || 1;
      if (y < h && inner) {
        const p = y / h;
        inner.style.transform = `translateY(${y * 0.25}px)`;
        inner.style.opacity = `${Math.max(0, 1 - p * 1.4).toFixed(3)}`;
        hero.style.filter = `blur(${(p * 7).toFixed(2)}px) brightness(${(1 - p * 0.5).toFixed(2)})`;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  const descend = () => {
    const next = document.getElementById("drift");
    next?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      data-developed={developed}
      aria-label="Sensorium"
    >
      <div className={styles.memory} aria-hidden />
      <div className={styles.clarity} aria-hidden />
      <div className={styles.grain} aria-hidden />

      <div ref={innerRef} className={styles.inner}>
        <p className="t-label">Sensorium</p>

        <motion.h1
          className={styles.word}
          variants={wordContainer}
          initial="hidden"
          animate={developed ? "develop" : "hidden"}
          aria-label={WORD}
        >
          {WORD.split("").map((ch, i) => (
            <motion.span key={`${ch}-${i}`} variants={letter} aria-hidden>
              {ch}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className={styles.line}
          variants={surface}
          custom={0.9}
          initial="hidden"
          animate={developed ? "develop" : "hidden"}
        >
          {LINE}
        </motion.p>
      </div>

      <motion.button
        type="button"
        className={styles.descend}
        onClick={descend}
        variants={surface}
        custom={1.5}
        initial="hidden"
        animate={developed ? "develop" : "hidden"}
        aria-label="Descend"
      >
        <span className="t-label">go under</span>
        <span className={styles.rail} aria-hidden />
      </motion.button>

      <div className={styles.shroud} aria-hidden />
    </section>
  );
}

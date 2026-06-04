"use client";

/* =====================================================================
   THE DEEPEN VEIL — the universal transition substrate (doc 11 §B3).
   A darkness that swells and clears, bound to the shared `deepen`
   MotionValue. "Closing your eyes between memories." Works in every
   browser; View Transitions (shared-element morph) layer on top later.
   ===================================================================== */
import { m, type MotionValue } from "framer-motion";

export default function DeepenVeil({ deepen }: { deepen: MotionValue<number> }) {
  return (
    <m.div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        background: "var(--color-ink-900)",
        pointerEvents: "none",
        opacity: deepen,
      }}
    />
  );
}

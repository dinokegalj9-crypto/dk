"use client";

/* =====================================================================
   THE VOID SYSTEM — mounted ONCE in the root layout, persistent across
   navigation so the world is never broken between scenes. Owns the
   canvas and the shared `pulse` MotionValue, and exposes the control
   surface (bloom / setCollection / quality / setSound) via context.

   Transitions are LIGHT, not dark: the accent colour morphs smoothly in
   the canvas and a soft bloom of light swells and settles. (doc 11 §B3)
   ===================================================================== */
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { animate, useMotionValue } from "framer-motion";
import { VoidContext, type VoidControls, type VoidQuality } from "@/lib/void";
import VoidCanvas from "./VoidCanvas";

function prefersReduced(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function VoidSystem({ children }: { children: ReactNode }) {
  const pulse = useMotionValue(0); // 0 → peak → 0 : a swell of light
  const [collection, setCollectionState] = useState("default");
  const [quality, setQuality] = useState<VoidQuality>("high");
  const [sound, setSoundState] = useState(false);

  const bloom = useCallback(
    (intensity = 1) => {
      if (prefersReduced()) return; // a still Sensorium is still Sensorium
      const peak = Math.max(0, Math.min(1, intensity));
      // a slow, symmetric swell of light — never a darkening
      animate(pulse, [pulse.get(), peak, 0], {
        duration: 2.4,
        times: [0, 0.45, 1],
        ease: "easeInOut",
      });
    },
    [pulse],
  );

  const setCollection = useCallback(
    (name: string | null) => {
      const next = name && name !== "default" ? name : "default";
      document.documentElement.setAttribute("data-collection", next);
      setCollectionState(next); // canvas morphs its colour smoothly to match
      bloom(0.45); // a soft light blooms as the new fragment arrives
    },
    [bloom],
  );

  const setSound = useCallback((on: boolean) => setSoundState(on), []);

  const controls = useMemo<VoidControls>(
    () => ({ bloom, setCollection, quality, setSound }),
    [bloom, setCollection, quality, setSound],
  );

  return (
    <VoidContext.Provider value={controls}>
      <VoidCanvas pulse={pulse} collection={collection} sound={sound} onQuality={setQuality} />
      <div className="void-content">{children}</div>
    </VoidContext.Provider>
  );
}

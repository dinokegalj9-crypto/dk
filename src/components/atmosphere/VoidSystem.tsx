"use client";

/* =====================================================================
   THE VOID SYSTEM — mounted ONCE in the root layout, persistent across
   navigation so the world is never broken between scenes. Owns the
   canvas, the deepen veil, and the shared `deepen` MotionValue, and
   exposes the control surface (deepen / setCollection / quality) to the
   whole tree via context. (doc 11 §B3, §B7)
   ===================================================================== */
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { animate, useMotionValue } from "framer-motion";
import { VoidContext, type VoidControls, type VoidQuality } from "@/lib/void";
import { dur, ease } from "@/lib/motion";
import VoidCanvas from "./VoidCanvas";
import DeepenVeil from "./DeepenVeil";

const bezier = [...ease.surface] as [number, number, number, number];

function prefersReduced(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function VoidSystem({ children }: { children: ReactNode }) {
  const deepen = useMotionValue(0);
  const [collection, setCollectionState] = useState("default");
  const [quality, setQuality] = useState<VoidQuality>("high");
  const [sound, setSoundState] = useState(false);

  const triggerDeepen = useCallback(
    (intensity = 1) => {
      if (prefersReduced()) return; // a still Sensorium is still Sensorium
      const peak = Math.max(0, Math.min(1, intensity));
      animate(deepen, [deepen.get(), peak, 0], {
        duration: dur.deep * 0.6,
        times: [0, 0.42, 1],
        ease: bezier,
      });
    },
    [deepen],
  );

  const setCollection = useCallback(
    (name: string | null) => {
      const next = name && name !== "default" ? name : "default";
      document.documentElement.setAttribute("data-collection", next);
      setCollectionState(next);
      triggerDeepen(0.6); // the light changes between rooms, never jumps
    },
    [triggerDeepen],
  );

  const setSound = useCallback((on: boolean) => setSoundState(on), []);

  const controls = useMemo<VoidControls>(
    () => ({ deepen: triggerDeepen, setCollection, quality, setSound }),
    [triggerDeepen, setCollection, quality, setSound],
  );

  return (
    <VoidContext.Provider value={controls}>
      <VoidCanvas deepen={deepen} collection={collection} sound={sound} onQuality={setQuality} />
      <div className="void-content">{children}</div>
      <DeepenVeil deepen={deepen} />
    </VoidContext.Provider>
  );
}

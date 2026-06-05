"use client";

/* =====================================================================
   SENSORIUM — VOID SYSTEM (control surface)
   The Void is mounted once, persistently, in the root layout. Any
   component reaches it through this context — never by touching the
   canvas. (doc 11 §B3 transition system, §B7)
   ===================================================================== */
import { createContext, useContext } from "react";

export type VoidQuality = "high" | "medium" | "low";

export interface VoidControls {
  /** A transition swell of LIGHT — the world brightens and blooms, then
   *  settles. intensity 0..1 (default 1). Not a darkening. */
  bloom: (intensity?: number) => void;
  /** Retint the world for a collection (or `null`/"default" to reset);
   *  the colour morphs smoothly and a soft light blooms between rooms. */
  setCollection: (name: string | null) => void;
  /** Current adaptive render quality (auto-degrades under load). */
  quality: VoidQuality;
  /** Tell the Void the ambient sound is on/off — it wakes a starfield. */
  setSound: (on: boolean) => void;
}

const noop: VoidControls = {
  bloom: () => {},
  setCollection: () => {},
  quality: "high",
  setSound: () => {},
};

export const VoidContext = createContext<VoidControls | null>(null);

/** Access the Void system. Safe no-op outside the provider. */
export function useVoid(): VoidControls {
  return useContext(VoidContext) ?? noop;
}

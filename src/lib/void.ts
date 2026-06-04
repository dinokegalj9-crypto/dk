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
  /** A transition swell — darkness, then light. "Closing your eyes
   *  between memories." intensity 0..1 (default 1). */
  deepen: (intensity?: number) => void;
  /** Retint the world for a collection (or `null`/"default" to reset),
   *  riding a gentle deepen so the light changes between rooms. */
  setCollection: (name: string | null) => void;
  /** Current adaptive render quality (auto-degrades under load). */
  quality: VoidQuality;
}

const noop: VoidControls = {
  deepen: () => {},
  setCollection: () => {},
  quality: "high",
};

export const VoidContext = createContext<VoidControls | null>(null);

/** Access the Void system. Safe no-op outside the provider. */
export function useVoid(): VoidControls {
  return useContext(VoidContext) ?? noop;
}

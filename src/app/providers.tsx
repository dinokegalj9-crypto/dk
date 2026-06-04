"use client";

/* Global motion policy — every animation honors the user's OS setting.
   A still Sensorium is still Sensorium. (doc 11 §B6 / §B9) */
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [...ease.surface] }}>
      {children}
    </MotionConfig>
  );
}

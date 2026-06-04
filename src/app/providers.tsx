"use client";

/* Global motion policy + lazy feature loading.
   - LazyMotion(domAnimation) ships the small feature pack and lets us
     use the lightweight <m.*> components instead of <motion.*>, cutting
     the client bundle (doc 11 §B4).
   - MotionConfig reducedMotion="user": every animation honors the OS
     setting. A still Sensorium is still Sensorium. (doc 11 §B9) */
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user" transition={{ ease: [...ease.surface] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

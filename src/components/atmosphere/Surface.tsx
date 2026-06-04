"use client";

/* =====================================================================
   SURFACE — things surface, they do not load. A reveal-on-view wrapper
   built on Framer Motion's whileInView (replaces the IntersectionObserver
   in the vanilla design system). Honors reduced motion via the global
   MotionConfig. (doc 02 / doc 11 §B6)
   ===================================================================== */
import { m, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { dur, ease } from "@/lib/motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: dur.slow, ease: [...ease.out], delay: i * 0.09 },
  }),
};

interface Props {
  children: ReactNode;
  /** Stagger index — a memory assembling itself. */
  index?: number;
  className?: string;
  /** How much must be in view before it surfaces (0–1). */
  amount?: number;
}

export default function Surface({ children, index = 0, className, amount = 0.3 }: Props) {
  return (
    <m.div
      className={className}
      variants={variants}
      custom={index}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </m.div>
  );
}

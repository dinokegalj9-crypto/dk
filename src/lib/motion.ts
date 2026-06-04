/* =====================================================================
   SENSORIUM — MOTION
   Durations, easings, and reusable variants that mirror the motion
   tokens. No ad-hoc values in components. (doc 04 / doc 11 §B4)
   Framer needs JS values, so these are the canonical source the CSS
   tokens echo.
   ===================================================================== */
import type { Variants } from "framer-motion";

export const ease = {
  surface: [0.22, 1, 0.36, 1],
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
} as const;

export const dur = {
  quick: 0.32,
  breath: 0.6,
  slow: 1.2,
  deep: 2.4,
} as const;

/** A line that assembles letter-by-letter out of the grain. */
export const wordContainer: Variants = {
  hidden: {},
  develop: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

export const letter: Variants = {
  hidden: { opacity: 0, y: -22, filter: "blur(12px)" },
  develop: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: dur.slow, ease: ease.surface },
  },
};

/** The sub-line and descend cue — surfacing after the word. */
export const surface: Variants = {
  hidden: { opacity: 0, y: 14 },
  develop: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: dur.slow, ease: ease.out, delay },
  }),
};

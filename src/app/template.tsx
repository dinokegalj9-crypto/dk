"use client";

/* Page transition — every route fades and rises in cleanly on
   navigation. The Void lives in the layout (outside this), so the world
   stays continuous while the content transitions. Reduced-motion keeps a
   plain fade. (doc 11 §B3) */
import { m } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [...ease.out] }}
    >
      {children}
    </m.div>
  );
}

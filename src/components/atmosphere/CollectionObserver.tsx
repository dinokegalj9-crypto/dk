"use client";

/* =====================================================================
   COLLECTION OBSERVER — retints the Void for the room currently in view.
   When its region enters the viewport it asks the Void system to become
   that collection's light; on exit it returns to default. A small,
   declarative way to drive the world's accent from content. (doc 11 §B7)
   ===================================================================== */
import { useEffect, useRef, type ReactNode } from "react";
import { useVoid } from "@/lib/void";

interface Props {
  name: string;
  children: ReactNode;
}

export default function CollectionObserver({ name, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { setCollection } = useVoid();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (inView === active) return; // only act on change
        active = inView;
        setCollection(inView ? name : "default");
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [name, setCollection]);

  return <div ref={ref}>{children}</div>;
}

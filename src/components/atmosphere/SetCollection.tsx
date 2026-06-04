"use client";

/* =====================================================================
   SET COLLECTION — a route declares its collection; the Void becomes
   that light on mount (riding a deepen) and returns to default on
   leave. The server-correct retint for a whole page. (doc 11 §B7)
   ===================================================================== */
import { useEffect } from "react";
import { useVoid } from "@/lib/void";

export default function SetCollection({ name }: { name: string }) {
  const { setCollection } = useVoid();
  useEffect(() => {
    setCollection(name);
    return () => setCollection("default");
  }, [name, setCollection]);
  return null;
}

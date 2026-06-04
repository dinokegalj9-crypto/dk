import type { Metadata } from "next";
import Philosophy from "@/components/sections/Philosophy";

export const metadata: Metadata = {
  title: "The House",
  description:
    "Sensorium is not a perfume house. It is a memory house — we make scent only because scent is the fastest way back.",
};

export default function TheHousePage() {
  return (
    <main>
      <Philosophy />
    </main>
  );
}

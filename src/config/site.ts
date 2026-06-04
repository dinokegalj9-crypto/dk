/* =====================================================================
   SITE CONFIG — wayfinding. The footer is where labeled navigation
   lives for clarity and accessibility (doc 02 §4 / §8).
   ===================================================================== */
export const SITE = {
  name: "Sensorium",
  tagline: "Some things you didn't lose. You just stopped visiting them.",
} as const;

export interface NavLink {
  href: string;
  label: string;
}

export const primaryNav: NavLink[] = [
  { href: "/the-library", label: "The Library" },
  { href: "/the-house", label: "The House" },
];

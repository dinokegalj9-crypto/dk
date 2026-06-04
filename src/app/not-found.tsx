import Link from "next/link";

/* The lost page — a designed, in-character moment with a gentle way
   back, never a dead end. (doc 06 §4, doc 09 §7) */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeContent: "center",
        textAlign: "center",
        gap: "1.5rem",
        padding: "8rem var(--gutter)",
      }}
    >
      <p className="t-label">404</p>
      <h1
        className="t-memory glow-word"
        style={{ fontSize: "var(--text-display)", lineHeight: 1.05, maxWidth: "18ch", marginInline: "auto" }}
      >
        This memory hasn&rsquo;t formed yet.
      </h1>
      <Link
        href="/"
        style={{
          fontSize: "0.8125rem",
          letterSpacing: "0.04em",
          color: "var(--text-faint)",
          marginTop: "1rem",
        }}
      >
        ← back to the surface
      </Link>
    </main>
  );
}

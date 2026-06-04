import Surfacing from "@/components/atmosphere/Surfacing";
import Void from "@/components/atmosphere/Void";

export default function Home() {
  return (
    <main>
      {/* The persistent environment the memory surfaces out of */}
      <Void />

      {/* The hero: The Surfacing */}
      <Surfacing />

      {/* The state it submerges into (placeholder until /the-library lands) */}
      <section
        id="drift"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "grid",
          placeContent: "center",
          textAlign: "center",
          gap: "1.5rem",
          padding: "8rem var(--gutter)",
        }}
      >
        <p className="t-label">Waking · No. 1</p>
        <h2
          className="t-memory glow-word"
          style={{ fontSize: "var(--text-display)", lineHeight: 1.05 }}
        >
          Undertow
        </h2>
        <p
          className="t-memory"
          style={{
            fontStyle: "italic",
            fontSize: "var(--text-subhead)",
            color: "var(--text-quiet)",
            maxWidth: "30ch",
            marginInline: "auto",
          }}
        >
          The pull of water you can&rsquo;t see, deciding to let it take you.
        </p>
      </section>
    </main>
  );
}

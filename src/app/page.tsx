import Surfacing from "@/components/atmosphere/Surfacing";
import CollectionObserver from "@/components/atmosphere/CollectionObserver";

export default function Home() {
  return (
    <main>
      {/* The hero: The Surfacing. The Void is now mounted persistently in
          the root layout and lives behind every page. */}
      <Surfacing />

      {/* The state it submerges into. As it enters view, it retints the
          whole Void to the "submerged" collection's cold light. */}
      <CollectionObserver name="submerged">
        <section
          id="drift"
          style={{
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
      </CollectionObserver>
    </main>
  );
}

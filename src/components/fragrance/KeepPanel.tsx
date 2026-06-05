"use client";

/* =====================================================================
   KEEP PANEL — the path to actually owning it. Price up front, size
   chosen, and sampling offered first-class. The keeping/reserve/notify
   action adapts to the release lifecycle (doc 12). Until the Stripe
   adapter is wired (doc 12 §6), the action captures real intent — never
   a fake checkout, never a dead button.
   ===================================================================== */
import { useState } from "react";
import { formatMoney } from "@/lib/format";
import type { AvailableFragment } from "@/types/content";
import styles from "./KeepPanel.module.css";

const SAMPLE_PRICE = 6;

export default function KeepPanel({ fragrance: f }: { fragrance: AvailableFragment }) {
  const [size, setSize] = useState(f.sizes[0]);
  const [intent, setIntent] = useState<null | "keep" | "sample">(null);
  const [said, setSaid] = useState(false);

  const action =
    f.keep.mode === "available" ? "Keep it" : f.keep.mode === "preorder" ? "Reserve it" : "Notify me";

  const sampleLine =
    f.keep.mode === "resting"
      ? "Sampling returns when it does."
      : `Begin with a 2ml sample — ${formatMoney(SAMPLE_PRICE, f.currency)}, credited when you keep the full size.`;

  if (said) {
    return (
      <section className={styles.panel} aria-label="Keep">
        <p className={styles.said}>
          {intent === "sample"
            ? "Your sample is on its way. The state will find you in a few days."
            : f.keep.mode === "resting"
              ? "We'll write to you the moment it returns."
              : "It's held in your name. We'll be in touch to complete the keeping."}
        </p>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-label="Keep">
      <p className={styles.price}>{formatMoney(size.price, f.currency)}</p>

      {f.sizes.length > 1 ? (
        <div className={styles.sizes} role="group" aria-label="Size">
          {f.sizes.map((s) => (
            <button
              key={s.ml}
              type="button"
              className={styles.size}
              aria-pressed={s.ml === size.ml}
              onClick={() => setSize(s)}
            >
              {s.ml}ml · {formatMoney(s.price, f.currency)}
            </button>
          ))}
        </div>
      ) : (
        <p className="t-label">{f.sizes[0].ml}ml · {f.concentration}</p>
      )}

      <p className={styles.lifecycle}>{f.keep.note}</p>

      {intent ? (
        <form
          className={styles.intent}
          onSubmit={(e) => {
            e.preventDefault();
            setSaid(true);
            // TODO: hand to the commerce adapter — Stripe for purchase/
            // pre-order, the notify list for resting (doc 12 §6).
          }}
        >
          <div className={styles.intentRow}>
            <label className={styles.field}>
              <span className="t-label">Your address</span>
              <input
                className={styles.input}
                type="email"
                required
                autoFocus
                placeholder="where we should reach you"
                aria-label="Email address"
              />
            </label>
            <button type="submit" className={styles.submit}>
              {intent === "sample" ? "Send the sample →" : "Confirm →"}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.keep}
            onClick={() => setIntent("keep")}
          >
            {action}
          </button>
          {f.keep.mode !== "resting" ? (
            <button type="button" className={styles.sample} onClick={() => setIntent("sample")}>
              <u>Begin with a sample</u>
            </button>
          ) : null}
        </div>
      )}

      <p className="t-label" style={{ color: "var(--text-faint)" }}>
        {sampleLine}
      </p>
    </section>
  );
}

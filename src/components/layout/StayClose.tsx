"use client";

/* Stay close — "let us write to you", never "subscribe for deals".
   No backend yet; captures intent and answers in voice. (doc 06 §4) */
import { useState } from "react";
import styles from "./footer.module.css";

export default function StayClose() {
  const [said, setSaid] = useState(false);

  if (said) {
    return <p className={styles.said}>We&rsquo;ll write to you. Rarely, and only when it matters.</p>;
  }

  return (
    <form
      className={styles.stayForm}
      onSubmit={(e) => {
        e.preventDefault();
        setSaid(true);
        // TODO: POST to /api/newsletter behind the content adapter (doc 11 §B8)
      }}
    >
      <label className={styles.field}>
        <span className="t-label">Stay close</span>
        <input
          className={styles.input}
          type="email"
          required
          placeholder="your address"
          aria-label="Email address"
        />
      </label>
      <button type="submit" className={styles.submit}>
        Let us write to you →
      </button>
    </form>
  );
}

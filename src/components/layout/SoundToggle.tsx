"use client";

/* =====================================================================
   SOUND TOGGLE — the piece is ON by default. Browsers forbid audio
   before a gesture, so we arm the first interaction (touch / scroll /
   key / click) to start it — effectively "on when you enter". Touch the
   control to turn it off; the choice is remembered. The engine is a
   singleton, so it plays continuously and never restarts on navigation.
   ===================================================================== */
import { useEffect, useRef, useState } from "react";
import { disableAmbient, enableAmbient } from "@/lib/sound/ambient";
import { useVoid } from "@/lib/void";
import styles from "./chrome.module.css";

const KEY = "sensorium:sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const startedRef = useRef(false);
  const { setSound } = useVoid();

  useEffect(() => {
    // default ON unless the visitor previously turned it off
    if (localStorage.getItem(KEY) === "off") return;
    setOn(true);
    setSound(true); // the starfield wakes with it

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      void enableAmbient();
      remove();
    };
    const events = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"];
    const remove = () =>
      events.forEach((e) => window.removeEventListener(e, start));
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    return remove;
  }, [setSound]);

  const toggle = async () => {
    startedRef.current = true; // we are now driven by the button
    if (on) {
      disableAmbient();
      setOn(false);
      setSound(false);
      localStorage.setItem(KEY, "off");
    } else {
      await enableAmbient();
      setOn(true);
      setSound(true);
      localStorage.setItem(KEY, "on");
    }
  };

  return (
    <button
      type="button"
      className={styles.sound}
      aria-pressed={on}
      aria-label={on ? "Turn ambient sound off" : "Turn ambient sound on"}
      onClick={toggle}
    >
      <span className={styles.wave} aria-hidden>
        <i />
        <i />
        <i />
      </span>
      Sound
    </button>
  );
}

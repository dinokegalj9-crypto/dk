"use client";

/* =====================================================================
   SOUND TOGGLE — always opt-in, calm, ever-present (doc 04 §6). Drives
   the synthesised ambient bed. Remembers the choice; because browsers
   block autoplay, a previously-on bed resumes on the first gesture.
   ===================================================================== */
import { useEffect, useState } from "react";
import { disableAmbient, enableAmbient } from "@/lib/sound/ambient";
import { useVoid } from "@/lib/void";
import styles from "./chrome.module.css";

const KEY = "sensorium:sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const { setSound } = useVoid();

  // restore the preference — resume on the first gesture (autoplay policy)
  useEffect(() => {
    if (localStorage.getItem(KEY) !== "on") return;
    const resume = () => {
      void enableAmbient().then(() => {
        setOn(true);
        setSound(true); // wake the starfield
      });
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [setSound]);

  const toggle = async () => {
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

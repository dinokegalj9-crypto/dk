"use client";

/* =====================================================================
   THE VOID — canvas renderer. Sourceless light blooms and ambiguous
   motes drifting below conscious tracking. Built to run forever:
   - capped DPR, pauses when hidden, fewer motes on coarse / save-data
   - ADAPTIVE QUALITY: samples FPS and sheds motes before the user
     feels a dropped frame (the Conductor-lite, doc 11 §B4)
   - reads the shared `deepen` MotionValue each frame (transitions)
   - re-resolves the accent when the collection changes (retint)
   - near-still under prefers-reduced-motion
   ===================================================================== */
import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import type { VoidQuality } from "@/lib/void";
import styles from "./VoidCanvas.module.css";

interface Mote {
  x: number; y: number; z: number; size: number; a: number;
  vx: number; vy: number; ph: number; fs: number; par: number;
  sharp: boolean; // crisp far pinpoint vs soft near orb (depth of field)
}
interface Bloom {
  ox: number; oy: number; ax: number; ay: number; sp: number; ph: number; r: number; a: number;
}

type RGB = [number, number, number];

/** Resolve the current --accent (handles var() indirection) without a
 *  persistent probe — only called on mount and on collection change. */
function resolveAccent(): RGB {
  const el = document.createElement("span");
  el.style.cssText = "position:absolute;left:-9999px;width:0;height:0;color:var(--accent)";
  document.documentElement.appendChild(el);
  const m = getComputedStyle(el).color.match(/(\d+),\s*(\d+),\s*(\d+)/);
  el.remove();
  return m ? [+m[1], +m[2], +m[3]] : [201, 130, 78];
}

const QUALITY_SCALE: Record<VoidQuality, number> = { high: 1, medium: 0.66, low: 0.4 };

interface Props {
  /** A transition swell of light (0→peak→0): brightens, never darkens. */
  pulse: MotionValue<number>;
  collection: string;
  /** When true, the Void brightens, multiplies its dots and twinkles —
   *  a live starfield that comes alive with the sound. */
  sound: boolean;
  onQuality: (q: VoidQuality) => void;
}

export default function VoidCanvas({ pulse, collection, sound, onQuality }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef<RGB>([201, 130, 78]); // target colour
  const curAccentRef = useRef<RGB>([201, 130, 78]); // smoothly-morphing colour
  const renderStillRef = useRef<(() => void) | null>(null);
  const soundRef = useRef(false);

  // ---- sound on/off → drives the starfield (read live in the loop) ---
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  // ---- collection change → set the target accent; the loop morphs the
  //      current colour toward it smoothly (no flash, no darkening) ------
  useEffect(() => {
    accentRef.current = resolveAccent();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      curAccentRef.current = [...accentRef.current]; // snap when still
      renderStillRef.current?.();
    }
  }, [collection]);

  // ---- the renderer (set up once) ------------------------------------
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;

    accentRef.current = resolveAccent();
    curAccentRef.current = [...accentRef.current];

    // Two sprites for depth-of-field: a SOFT blurred orb (near, out of
    // focus) and a CRISP pinpoint (far, in focus) — together they read
    // as 3D specks at different depths.
    const makeSprite = (stops: Array<[number, string]>) => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const cc = c.getContext("2d")!;
      const g = cc.createRadialGradient(32, 32, 0, 32, 32, 32);
      for (const [o, col] of stops) g.addColorStop(o, col);
      cc.fillStyle = g;
      cc.fillRect(0, 0, 64, 64);
      return c;
    };
    const spriteSoft = makeSprite([
      [0, "rgba(237,231,221,0.85)"],
      [0.35, "rgba(237,231,221,0.4)"],
      [1, "rgba(237,231,221,0)"],
    ]);
    const spriteSharp = makeSprite([
      [0, "rgba(244,239,230,1)"],
      [0.28, "rgba(240,234,224,0.92)"],
      [0.5, "rgba(237,231,221,0.18)"],
      [1, "rgba(237,231,221,0)"],
    ]);

    let W = 0;
    let H = 0;
    let motes: Mote[] = [];
    let blooms: Bloom[] = [];
    let maxCount = 0;

    // adaptive quality state
    let quality: VoidQuality = reduce ? "low" : coarse || saveData ? "medium" : "high";
    let activeCount = 0;
    let fpsFrames = 0;
    let fpsElapsed = 0;
    let goodWindows = 0;

    const setActiveFromQuality = () => {
      activeCount = Math.max(8, Math.round(maxCount * QUALITY_SCALE[quality]));
    };

    const makeMote = (): Mote => {
      const z = Math.random();
      // far half are crisp pinpoints; near half are big soft orbs
      const sharp = z < 0.58;
      return {
        x: Math.random() * W, y: Math.random() * H, z,
        sharp,
        size: sharp ? 0.5 + z * 1.5 : 2.6 + z * 7.5,
        a: sharp ? 0.22 + Math.random() * 0.34 : 0.07 + Math.random() * 0.16,
        vx: (Math.random() - 0.5) * 0.12 * (0.4 + z),
        vy: (Math.random() - 0.5) * 0.1 * (0.4 + z),
        ph: Math.random() * Math.PI * 2,
        fs: 0.15 + Math.random() * 0.25,
        par: 0.02 + z * 0.18, // nearer orbs parallax more → depth
      };
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // the high-water mote count; quality scales how many we actually draw.
      // we allocate extra so the sound-on starfield has more dots to reveal.
      maxCount = Math.max(22, Math.min(120, Math.round((W * H) / 17000)));
      const starMax = Math.max(maxCount, Math.min(240, Math.round(maxCount * 1.9)));
      motes = Array.from({ length: starMax }, makeMote);
      setActiveFromQuality();

      blooms = [
        { ox: 0.7, oy: 0.3, ax: 0.1, ay: 0.07, sp: 0.34, ph: 0, r: 0.62, a: 0.1 },
        { ox: 0.24, oy: 0.78, ax: 0.08, ay: 0.06, sp: 0.21, ph: 2.1, r: 0.7, a: 0.07 },
        { ox: 0.52, oy: 0.12, ax: 0.06, ay: 0.05, sp: 0.15, ph: 4.3, r: 0.48, a: 0.05 },
      ];
    };

    // interaction state
    let px = -9999, py = -9999, smx = -9999, smy = -9999;
    let lastMove = -9999;
    let agitation = 0;
    let soundBoost = 0; // eases 0→1 when sound is on (the starfield wakes)
    let lastScroll = window.scrollY || 0;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      lastMove = performance.now();
    };
    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });

    const wrap = (v: number, max: number) => {
      const m = 60;
      if (v < -m) return v + max + m * 2;
      if (v > max + m) return v - max - m * 2;
      return v;
    };

    const paintBloomsAndMotes = (
      t: number,
      dim: number,
      dScroll: number,
      lowQuality: boolean,
      soundBoost: number,
    ) => {
      ctx.globalCompositeOperation = "lighter";
      const [ar, ag, ab] = curAccentRef.current; // the smoothly-morphing colour

      for (const bl of blooms) {
        const bx = (bl.ox + Math.sin(t * bl.sp + bl.ph) * bl.ax) * W;
        const by = (bl.oy + Math.cos(t * bl.sp * 0.8 + bl.ph) * bl.ay) * H;
        const br = bl.r * Math.max(W, H);
        const pulse = 0.6 + 0.4 * Math.sin(t * (0.08 + bl.sp * 0.1) + bl.ph);
        const ba = bl.a * pulse * dim * (1 + soundBoost * 0.5);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `rgba(${ar},${ag},${ab},${ba})`);
        g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // attention light near the pointer (dropped on low quality)
      if (!lowQuality && smx > -9000 && agitation > 0.01) {
        const pr = 0.26 * Math.max(W, H);
        const pa = 0.06 * agitation;
        const pg = ctx.createRadialGradient(smx, smy, 0, smx, smy, pr);
        pg.addColorStop(0, `rgba(${ar},${ag},${ab},${pa})`);
        pg.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
        ctx.fillStyle = pg;
        ctx.fillRect(0, 0, W, H);
      }

      const tide = Math.sin(t * 0.06) * 0.18;
      // sound on → reveal more dots (up to the allocated starfield)
      const drawCount = Math.min(motes.length, Math.round(activeCount * (1 + soundBoost * 0.95)));
      for (let i = 0; i < drawCount; i++) {
        const p = motes[i];
        p.x += (p.vx + tide * (0.4 + p.z)) * 1;
        p.y += (p.vy + tide * 0.3) * 1;
        p.y -= dScroll * p.par;

        if (smx > -9000 && agitation > 0.05) {
          const dx = p.x - smx;
          const dy = p.y - smy;
          const d2 = dx * dx + dy * dy;
          const R = 150;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (1 - d / R) * 0.9 * agitation;
            p.x += (dx / d) * push;
            p.y += (dy / d) * push;
          }
        }

        p.x = wrap(p.x, W);
        p.y = wrap(p.y, H);

        // base drift-flicker, plus a faster twinkle when the sound is on
        const twinkle = soundBoost > 0.01 ? soundBoost * 0.45 * Math.sin(t * p.fs * 7 + p.ph * 3) : 0;
        const fl = Math.max(0, 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * p.fs + p.ph)) + twinkle);
        const alpha = p.a * fl * dim * (1 + soundBoost * 0.6);
        if (alpha <= 0.004) continue;
        const s = p.size;
        ctx.globalAlpha = alpha;
        ctx.drawImage(p.sharp ? spriteSharp : spriteSoft, p.x - s, p.y - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
    };

    const renderStill = () => {
      ctx.clearRect(0, 0, W, H);
      paintBloomsAndMotes(0, 0.8, 0, true, 0);
    };
    renderStillRef.current = renderStill;

    let raf = 0;
    let prev = 0;
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      const dt = prev ? Math.min((now - prev) / 16.667, 3) : 1;

      // ---- adaptive quality: sample FPS, shed motes before jank ----
      if (prev) {
        fpsFrames++;
        fpsElapsed += now - prev;
        if (fpsElapsed >= 1000) {
          const fps = (fpsFrames * 1000) / fpsElapsed;
          fpsFrames = 0;
          fpsElapsed = 0;
          if (fps < 45 && quality !== "low") {
            quality = quality === "high" ? "medium" : "low";
            goodWindows = 0;
            setActiveFromQuality();
            onQuality(quality);
          } else if (fps > 57 && quality !== "high") {
            if (++goodWindows >= 4) {
              quality = quality === "low" ? "medium" : "high";
              goodWindows = 0;
              setActiveFromQuality();
              onQuality(quality);
            }
          } else {
            goodWindows = 0;
          }
        }
      }
      prev = now;

      const t = now * 0.001;
      const active = now - lastMove < 2600 ? 1 : 0;
      agitation += (active - agitation) * 0.02 * dt;
      soundBoost += ((soundRef.current ? 1 : 0) - soundBoost) * 0.025 * dt;

      // morph the drawn colour toward the target — a smooth hue crossfade
      const tgt = accentRef.current;
      const cur = curAccentRef.current;
      cur[0] += (tgt[0] - cur[0]) * 0.045 * dt;
      cur[1] += (tgt[1] - cur[1]) * 0.045 * dt;
      cur[2] += (tgt[2] - cur[2]) * 0.045 * dt;

      if (px > -9999) {
        if (smx < -9000) { smx = px; smy = py; }
        smx += (px - smx) * 0.06 * dt;
        smy += (py - smy) * 0.06 * dt;
      }

      const sc = window.scrollY || 0;
      const dScroll = sc - lastScroll;
      lastScroll = sc;

      // the shared pulse BRIGHTENS the world during transitions (a swell
      // of light, never a darkening)
      const pz = pulse.get();
      const dim = (0.72 + 0.28 * agitation) * (1 + pz * 0.55);

      ctx.clearRect(0, 0, W, H);
      paintBloomsAndMotes(t, dim, dScroll, quality === "low", soundBoost);

      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        prev = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeT: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        build();
        if (reduce) renderStill();
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    build();
    onQuality(quality);
    if (reduce) renderStill();
    else raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeT);
      renderStillRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pulse, onQuality]);

  return (
    <div ref={hostRef} className={styles.void} aria-hidden>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

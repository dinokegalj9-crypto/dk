"use client";

/* =====================================================================
   THE VOID — canvas environment of sourceless light blooms and
   ambiguous motes drifting below conscious tracking. Cheap enough to
   run forever: capped DPR, pauses when hidden, fewer motes on coarse /
   save-data, near-still under prefers-reduced-motion. (doc: void.js)
   ===================================================================== */
import { useEffect, useRef } from "react";
import styles from "./Void.module.css";

interface Mote {
  x: number;
  y: number;
  z: number;
  size: number;
  a: number;
  vx: number;
  vy: number;
  ph: number;
  fs: number;
  par: number;
}

interface Bloom {
  ox: number;
  oy: number;
  ax: number;
  ay: number;
  sp: number;
  ph: number;
  r: number;
  a: number;
}

export default function Void() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // accent (resolve var() indirection via a probe)
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;width:0;height:0";
    host.appendChild(probe);
    const accent = (): [number, number, number] => {
      probe.style.color = "var(--accent)";
      const m = getComputedStyle(probe).color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      return m ? [+m[1], +m[2], +m[3]] : [201, 130, 78];
    };
    const [ar, ag, ab] = accent();

    // soft mote sprite
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0, "rgba(237,231,221,1)");
    sg.addColorStop(0.35, "rgba(237,231,221,0.5)");
    sg.addColorStop(1, "rgba(237,231,221,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 64, 64);

    let W = 0;
    let H = 0;
    let motes: Mote[] = [];
    let blooms: Bloom[] = [];

    const makeMote = (): Mote => {
      const z = Math.random();
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z,
        size: 0.6 + z * z * 7,
        a: 0.1 + (1 - z) * 0.3,
        vx: (Math.random() - 0.5) * 0.12 * (0.4 + z),
        vy: (Math.random() - 0.5) * 0.1 * (0.4 + z),
        ph: Math.random() * Math.PI * 2,
        fs: 0.15 + Math.random() * 0.25,
        par: 0.02 + z * 0.14,
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

      let count = Math.round((W * H) / 26000);
      if (coarse || saveData) count = Math.round(count * 0.5);
      count = Math.max(14, Math.min(72, count));
      motes = Array.from({ length: count }, makeMote);

      blooms = [
        { ox: 0.7, oy: 0.3, ax: 0.1, ay: 0.07, sp: 0.34, ph: 0, r: 0.62, a: 0.1 },
        { ox: 0.24, oy: 0.78, ax: 0.08, ay: 0.06, sp: 0.21, ph: 2.1, r: 0.7, a: 0.07 },
        { ox: 0.52, oy: 0.12, ax: 0.06, ay: 0.05, sp: 0.15, ph: 4.3, r: 0.48, a: 0.05 },
      ];
    };

    let px = -9999;
    let py = -9999;
    let smx = -9999;
    let smy = -9999;
    let lastMove = -9999;
    let agitation = 0;
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

    let raf = 0;
    let prev = 0;
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      const dt = prev ? Math.min((now - prev) / 16.667, 3) : 1;
      prev = now;
      const t = now * 0.001;

      const active = now - lastMove < 2600 ? 1 : 0;
      agitation += (active - agitation) * 0.02 * dt;

      if (px > -9999) {
        if (smx < -9000) {
          smx = px;
          smy = py;
        }
        smx += (px - smx) * 0.06 * dt;
        smy += (py - smy) * 0.06 * dt;
      }

      const sc = window.scrollY || 0;
      const dScroll = sc - lastScroll;
      lastScroll = sc;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const dim = 0.72 + 0.28 * agitation;

      for (const bl of blooms) {
        const bx = (bl.ox + Math.sin(t * bl.sp + bl.ph) * bl.ax) * W;
        const by = (bl.oy + Math.cos(t * bl.sp * 0.8 + bl.ph) * bl.ay) * H;
        const br = bl.r * Math.max(W, H);
        const pulse = 0.6 + 0.4 * Math.sin(t * (0.08 + bl.sp * 0.1) + bl.ph);
        const ba = bl.a * pulse * dim;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `rgba(${ar},${ag},${ab},${ba})`);
        g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      if (smx > -9000 && agitation > 0.01) {
        const pr = 0.26 * Math.max(W, H);
        const pa = 0.06 * agitation;
        const pg = ctx.createRadialGradient(smx, smy, 0, smx, smy, pr);
        pg.addColorStop(0, `rgba(${ar},${ag},${ab},${pa})`);
        pg.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
        ctx.fillStyle = pg;
        ctx.fillRect(0, 0, W, H);
      }

      const tide = Math.sin(t * 0.06) * 0.18;
      for (const p of motes) {
        p.x += (p.vx + tide * (0.4 + p.z)) * dt;
        p.y += (p.vy + tide * 0.3) * dt;
        p.y -= dScroll * p.par;

        if (smx > -9000 && agitation > 0.05) {
          const dx = p.x - smx;
          const dy = p.y - smy;
          const d2 = dx * dx + dy * dy;
          const R = 150;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (1 - d / R) * 0.9 * agitation;
            p.x += (dx / d) * push * dt;
            p.y += (dy / d) * push * dt;
          }
        }

        p.x = wrap(p.x, W);
        p.y = wrap(p.y, H);

        const fl = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * p.fs + p.ph));
        const alpha = p.a * fl * dim;
        if (alpha <= 0.004) continue;
        const s = p.size;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, p.x - s, p.y - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    const renderStill = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const bx = 0.7 * W;
      const by = 0.3 * H;
      const br = 0.6 * Math.max(W, H);
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, `rgba(${ar},${ag},${ab},0.08)`);
      g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      for (const p of motes) {
        const s = p.size;
        ctx.globalAlpha = p.a * 0.7;
        ctx.drawImage(sprite, p.x - s, p.y - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
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
    if (reduce) renderStill();
    else raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeT);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      probe.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.void} aria-hidden>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

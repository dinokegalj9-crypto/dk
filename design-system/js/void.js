/* =====================================================================
   SENSORIUM — THE VOID (behavior)
   A canvas environment of sourceless light blooms and ambiguous motes,
   drifting below conscious tracking. Cheap enough to run on every page
   forever: capped DPR, pauses when hidden, degrades on mobile, and
   collapses to a near-still under prefers-reduced-motion.

   API (window.SensoriumVoid):
     .setCollection(name)  retune the accent light (or set data-collection)
     .deepen(ms)           a transition swell — darkness, then light
     .pause() / .resume()

   No identifiable forms. No horizon. No scale cue. Always recedes.
   ===================================================================== */
(function (global) {
  "use strict";

  function init() {
    var host = document.querySelector("[data-void], .void");
    if (!host) return;

    var reduce = global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var coarse = global.matchMedia("(pointer: coarse)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;

    var canvas = document.createElement("canvas");
    canvas.className = "void__canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    var ctx = canvas.getContext("2d", { alpha: true });

    /* ---- accent resolution (handles var() indirection) ------------- */
    var probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;width:0;height:0";
    host.appendChild(probe);
    function resolveAccent(name) {
      probe.style.color = "var(--accent)";
      if (name) host.setAttribute("data-collection", name);
      var c = getComputedStyle(probe).color; // "rgb(r, g, b)"
      var m = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
      return m ? [+m[1], +m[2], +m[3]] : [201, 130, 78];
    }
    var accent = resolveAccent();

    /* ---- soft mote sprite (pre-rendered once) ---------------------- */
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    var sctx = sprite.getContext("2d");
    var grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(237,231,221,1)");
    grad.addColorStop(0.35, "rgba(237,231,221,0.5)");
    grad.addColorStop(1, "rgba(237,231,221,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);

    /* ---- sizing ---------------------------------------------------- */
    var W = 0, H = 0, DPR = 1;
    var motes = [];
    var blooms = [];

    function build() {
      var rect = host.getBoundingClientRect();
      W = rect.width; H = rect.height;
      DPR = Math.min(global.devicePixelRatio || 1, coarse ? 1 : 1.5);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // sparse by design; fewer on small / coarse / save-data
      var area = W * H;
      var count = Math.round(area / 26000);
      if (coarse || saveData) count = Math.round(count * 0.5);
      count = Math.max(14, Math.min(72, count));

      motes = [];
      for (var i = 0; i < count; i++) motes.push(makeMote());

      // 3 sourceless blooms — light from nowhere, on long offset cycles
      blooms = [
        { ox: 0.70, oy: 0.30, ax: 0.10, ay: 0.07, sp: 0.34, ph: 0.0, r: 0.62, a: 0.10 },
        { ox: 0.24, oy: 0.78, ax: 0.08, ay: 0.06, sp: 0.21, ph: 2.1, r: 0.70, a: 0.07 },
        { ox: 0.52, oy: 0.12, ax: 0.06, ay: 0.05, sp: 0.15, ph: 4.3, r: 0.48, a: 0.05 }
      ];
    }

    function makeMote() {
      var z = Math.random();              // depth 0(far) .. 1(near)
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z: z,
        size: 0.6 + z * z * 7,            // near motes much larger & softer
        a: 0.10 + (1 - z) * 0.30,         // far pinpoints a touch brighter
        vx: (Math.random() - 0.5) * 0.12 * (0.4 + z),
        vy: (Math.random() - 0.5) * 0.10 * (0.4 + z),
        ph: Math.random() * Math.PI * 2,  // flicker phase (born/return)
        fs: 0.15 + Math.random() * 0.25,  // flicker speed
        par: 0.02 + z * 0.14              // scroll parallax factor
      };
    }

    /* ---- interaction state ---------------------------------------- */
    var px = -9999, py = -9999, smx = -9999, smy = -9999;
    var lastMove = -9999;
    var agitation = 0;                     // 0 still(deepen) .. 1 active
    var lastScroll = global.scrollY || 0;

    if (!coarse) {
      global.addEventListener("pointermove", function (e) {
        var r = host.getBoundingClientRect();
        px = e.clientX - r.left; py = e.clientY - r.top;
        lastMove = performance.now();
      }, { passive: true });
    }

    var transitionDeepen = 0;              // 0..1, driven by deepen()

    /* ---- the loop -------------------------------------------------- */
    var raf = 0, prev = 0, running = false;

    function wrap(v, max) {
      var m = 60;
      if (v < -m) return v + max + m * 2;
      if (v > max + m) return v - max - m * 2;
      return v;
    }

    function frame(now) {
      var dt = prev ? Math.min((now - prev) / 16.667, 3) : 1;
      prev = now;
      var t = now * 0.001;

      // agitation eases toward 1 on recent movement, decays to 0 (deepen)
      var active = now - lastMove < 2600 ? 1 : 0;
      agitation += (active - agitation) * 0.02 * dt;

      // smoothed pointer (attention drifts after the eye)
      if (px > -9999) {
        if (smx < -9000) { smx = px; smy = py; }
        smx += (px - smx) * 0.06 * dt;
        smy += (py - smy) * 0.06 * dt;
      }

      // scroll → gentle collective parallax of the field
      var sc = global.scrollY || 0;
      var dScroll = sc - lastScroll;
      lastScroll = sc;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // overall dim: stillness deepens the dark; transitions deepen harder
      var dim = (0.72 + 0.28 * agitation) * (1 - transitionDeepen * 0.9);

      // --- sourceless light blooms ---
      for (var b = 0; b < blooms.length; b++) {
        var bl = blooms[b];
        var bx = (bl.ox + Math.sin(t * bl.sp + bl.ph) * bl.ax) * W;
        var by = (bl.oy + Math.cos(t * bl.sp * 0.8 + bl.ph) * bl.ay) * H;
        var br = bl.r * Math.max(W, H);
        var pulse = 0.6 + 0.4 * Math.sin(t * (0.08 + bl.sp * 0.1) + bl.ph);
        var ba = bl.a * pulse * dim;
        var g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, "rgba(" + accent[0] + "," + accent[1] + "," + accent[2] + "," + ba + ")");
        g.addColorStop(1, "rgba(" + accent[0] + "," + accent[1] + "," + accent[2] + ",0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // --- attention light near the pointer ---
      if (smx > -9000 && agitation > 0.01) {
        var pr = 0.26 * Math.max(W, H);
        var pa = 0.06 * agitation;
        var pg = ctx.createRadialGradient(smx, smy, 0, smx, smy, pr);
        pg.addColorStop(0, "rgba(" + accent[0] + "," + accent[1] + "," + accent[2] + "," + pa + ")");
        pg.addColorStop(1, "rgba(" + accent[0] + "," + accent[1] + "," + accent[2] + ",0)");
        ctx.fillStyle = pg;
        ctx.fillRect(0, 0, W, H);
      }

      // --- the motes ---
      var tide = Math.sin(t * 0.06) * 0.18; // the shared, slow current
      for (var i = 0; i < motes.length; i++) {
        var p = motes[i];

        // drift + tide
        p.x += (p.vx + tide * (0.4 + p.z)) * dt;
        p.y += (p.vy + tide * 0.3) * dt;
        // scroll parallax (field drifts slower than content)
        p.y -= dScroll * p.par;

        // attention parts the medium — motes drift away, then settle
        if (smx > -9000 && agitation > 0.05) {
          var dx = p.x - smx, dy = p.y - smy;
          var d2 = dx * dx + dy * dy;
          var R = 150;
          if (d2 < R * R && d2 > 0.01) {
            var d = Math.sqrt(d2);
            var push = (1 - d / R) * 0.9 * agitation;
            p.x += (dx / d) * push * dt;
            p.y += (dy / d) * push * dt;
          }
        }

        p.x = wrap(p.x, W);
        p.y = wrap(p.y, H);

        // flicker — born from the dark, returning to it
        var fl = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * p.fs + p.ph));
        var alpha = p.a * fl * dim;
        if (alpha <= 0.004) continue;

        var s = p.size;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, p.x - s, p.y - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;

      // transition deepen relaxes back
      if (transitionDeepen > 0) transitionDeepen = Math.max(0, transitionDeepen - 0.01 * dt);

      raf = requestAnimationFrame(frame);
    }

    function renderStill() {
      // reduced motion — one resolved, dignified frame
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      var bx = 0.7 * W, by = 0.3 * H, br = 0.6 * Math.max(W, H);
      var g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, "rgba(" + accent[0] + "," + accent[1] + "," + accent[2] + ",0.08)");
      g.addColorStop(1, "rgba(" + accent[0] + "," + accent[1] + "," + accent[2] + ",0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < motes.length; i++) {
        var p = motes[i], s = p.size;
        ctx.globalAlpha = p.a * 0.7;
        ctx.drawImage(sprite, p.x - s, p.y - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
    }

    /* ---- lifecycle ------------------------------------------------- */
    function start() {
      if (running) return;
      running = true; prev = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (!reduce) start();
    });

    var resizeT;
    global.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        build();
        if (reduce) renderStill();
      }, 200);
    }, { passive: true });

    /* ---- public api ------------------------------------------------ */
    global.SensoriumVoid = {
      setCollection: function (name) { accent = resolveAccent(name); },
      deepen: function () { transitionDeepen = 1; },   // close your eyes between memories
      pause: stop,
      resume: function () { if (!reduce) start(); }
    };

    build();
    if (reduce) renderStill();
    else start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})(window);

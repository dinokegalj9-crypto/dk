/* =====================================================================
   SENSORIUM — BEHAVIOR
   The minimum script the system needs. Everything degrades gracefully:
   without JS, content is simply present. With JS, it surfaces.

   Principles honored here:
   - Things surface, they do not load.
   - Reward stillness.
   - A still Sensorium is still Sensorium (reduced-motion respected).
   - Sound is always opt-in.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Signal to CSS that JS is present (enables the surface system).
  root.classList.add("js");

  /* ------------------------------------------------------------------
     1. THE SURFACE SYSTEM
     Elements marked [data-surface] reveal as they enter view, with a
     gentle stagger when grouped under [data-surface-group].
     ------------------------------------------------------------------ */
  function initSurfacing() {
    var targets = document.querySelectorAll("[data-surface]");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-surfaced"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Honor an explicit stagger index, else stagger by sibling order.
        if (!el.style.getPropertyValue("--surface-delay") && el.dataset.stagger == null) {
          var group = el.closest("[data-surface-group]");
          if (group) {
            var sibs = Array.prototype.slice.call(group.querySelectorAll("[data-surface]"));
            var i = sibs.indexOf(el);
            if (i > 0) el.style.setProperty("--surface-delay", (i * 90) + "ms");
          }
        }
        el.classList.add("is-surfaced");
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     2. THE SUMMONED MENU
     Hidden until summoned, instantly available. Escape closes; focus
     is trapped while open; body scroll is held.
     ------------------------------------------------------------------ */
  function initMenu() {
    var summon = document.querySelector("[data-summon]");
    var menu = document.querySelector(".menu");
    if (!summon || !menu) return;

    function open() {
      menu.dataset.open = "true";
      summon.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    }
    function close() {
      menu.dataset.open = "false";
      summon.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      summon.focus();
    }
    summon.addEventListener("click", function () {
      menu.dataset.open === "true" ? close() : open();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.dataset.open === "true") close();
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") close();
    });
  }

  /* ------------------------------------------------------------------
     3. SOUND — always opt-in. We only manage state and an event here;
     the ambient bed itself is supplied per page/collection.
     ------------------------------------------------------------------ */
  function initSound() {
    var toggle = document.querySelector("[data-sound-toggle]");
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", "false");
    toggle.addEventListener("click", function () {
      var on = toggle.getAttribute("aria-pressed") === "true";
      toggle.setAttribute("aria-pressed", on ? "false" : "true");
      // Pages listen for this to fade their ambient bed in/out.
      document.dispatchEvent(new CustomEvent("sensorium:sound", { detail: { on: !on } }));
    });
  }

  /* ------------------------------------------------------------------
     4. CURSOR PRESENCE (desktop, fine pointer, motion allowed)
     A faint light that lags behind the pointer — attention moving
     through a dark room. Purely atmospheric; never required.
     ------------------------------------------------------------------ */
  function initCursorGlow() {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    var glow = document.createElement("div");
    glow.setAttribute("aria-hidden", "true");
    glow.style.cssText = [
      "position:fixed", "top:0", "left:0", "width:38vmax", "height:38vmax",
      "border-radius:50%", "pointer-events:none", "z-index:480",
      "transform:translate(-50%,-50%)", "opacity:0",
      "transition:opacity 1200ms cubic-bezier(.22,1,.36,1)",
      "background:radial-gradient(closest-side, var(--accent), transparent 70%)",
      "mix-blend-mode:soft-light", "filter:blur(20px)"
    ].join(";");
    glow.style.setProperty("opacity", "0");
    document.body.appendChild(glow);

    var x = window.innerWidth / 2, y = window.innerHeight / 2;
    var tx = x, ty = y, shown = false;

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { glow.style.opacity = "0.10"; shown = true; }
    }, { passive: true });

    (function loop() {
      x += (tx - x) * 0.06;  // the lag — attention drifts after the eye
      y += (ty - y) * 0.06;
      glow.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
    initSurfacing();
    initMenu();
    initSound();
    initCursorGlow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

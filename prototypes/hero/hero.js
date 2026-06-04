/* =====================================================================
   SENSORIUM — HERO: "THE SURFACING" (behavior)
   The memory develops, responds to the body (the lamp), slips when
   the visitor goes still, and submerges on scroll. One rAF loop drives
   cursor lag, ambient light drift, idle-slip, and submerge.
   Everything is gated behind prefers-reduced-motion.
   ===================================================================== */
(function () {
  "use strict";

  var hero = document.querySelector(".threshold-hero");
  if (!hero) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var wordEl = hero.querySelector(".hero__word");

  /* ---- 1. Assemble the word out of grain ------------------------- */
  function buildWord() {
    if (!wordEl) return;
    var text = wordEl.getAttribute("data-text") || wordEl.textContent;
    wordEl.setAttribute("aria-label", text);
    wordEl.textContent = "";
    var letters = text.split("");
    letters.forEach(function (ch, i) {
      var span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;
      if (!reduce) {
        // each glyph drifts in from a random place in the grain
        var ang = Math.random() * Math.PI * 2;
        var dist = 30 + Math.random() * 70;
        span.style.setProperty("--lx", (Math.cos(ang) * dist).toFixed(1) + "px");
        span.style.setProperty("--ly", (Math.sin(ang) * dist - 20).toFixed(1) + "px");
        span.style.setProperty("--lr", (Math.random() * 10 - 5).toFixed(1) + "deg");
        span.style.setProperty("--ld", (300 + i * 70 + Math.random() * 120).toFixed(0) + "ms");
      }
      wordEl.appendChild(span);
    });
  }
  buildWord();

  /* ---- 2. The Develop -------------------------------------------- */
  function develop() {
    // grain thins, light blooms, letters assemble, shroud dissolves
    hero.style.setProperty("--develop", "1");
    hero.classList.add("is-developed");
    var grain = hero.querySelector(".hero__grain");
    if (grain) grain.style.opacity = reduce ? "0.4" : "0.16";
    var mem = hero.querySelector(".hero__memory");
    if (mem) mem.style.opacity = "0.85";
    var clarity = hero.querySelector(".hero__clarity");
    if (clarity) clarity.style.opacity = "1";
    var shroud = hero.querySelector(".hero__shroud");
    if (shroud) shroud.style.opacity = "0";
  }

  if (reduce) {
    develop();
    return; // no lamp, no slip, no submerge — a resolved still
  }

  // Enable the heat-haze shimmer only where it's cheap & welcome
  if (fine) hero.classList.add("has-haze");

  // Trigger development on the next frames so transitions actually run
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { setTimeout(develop, 120); });
  });

  /* ---- 3. The lamp, the drift, the slip, the submerge ------------ */
  var mx = 50, my = 45, tx = 50, ty = 45;      // pointer (%)
  var lastMove = performance.now();
  var slipping = false;
  var heroH = hero.offsetHeight;

  if (fine) {
    window.addEventListener("pointermove", function (e) {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
      lastMove = performance.now();
    }, { passive: true });
    // touch on a fine-pointer hybrid still counts
    window.addEventListener("touchmove", function () { lastMove = performance.now(); }, { passive: true });
  }
  window.addEventListener("resize", function () { heroH = hero.offsetHeight; }, { passive: true });

  function frame(now) {
    var t = now * 0.001;

    // Coarse pointer (touch): the lamp wanders on its own — alive without input
    if (!fine) {
      tx = 50 + Math.sin(t * 0.32) * 24;
      ty = 44 + Math.cos(t * 0.21) * 16;
    }

    // cursor lag — attention drifting after the eye
    mx += (tx - mx) * 0.07;
    my += (ty - my) * 0.07;
    hero.style.setProperty("--mx", mx.toFixed(2) + "%");
    hero.style.setProperty("--my", my.toFixed(2) + "%");

    // ambient light drift — the room breathes (18s-ish cycles)
    var lx = 70 + Math.sin(t * 0.34) * 6;
    var ly = 36 + Math.cos(t * 0.28) * 5;
    hero.style.setProperty("--light-x", lx.toFixed(2) + "%");
    hero.style.setProperty("--light-y", ly.toFixed(2) + "%");

    // the slip — go still and the memory recedes
    var idle = now - lastMove > 3500;
    if (idle && !slipping) { slipping = true; hero.classList.add("is-slipping"); }
    else if (!idle && slipping) { slipping = false; hero.classList.remove("is-slipping"); }

    // the submerge — sinking as you scroll past
    var y = window.scrollY || window.pageYOffset;
    if (y < heroH) {
      var p = y / heroH;                       // 0 → 1 through the hero
      var inner = hero.querySelector(".hero__inner");
      if (inner) {
        inner.style.transform = "translateY(" + (y * 0.25) + "px)";
        inner.style.opacity = (1 - p * 1.4).toFixed(3);
      }
      hero.style.filter = "blur(" + (p * 7).toFixed(2) + "px) brightness(" + (1 - p * 0.5).toFixed(2) + ")";
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- 4. Descend → go under ------------------------------------- */
  var descend = hero.querySelector(".hero__descend");
  if (descend) {
    descend.addEventListener("click", function () {
      var next = document.querySelector(".drift-next") || hero.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();

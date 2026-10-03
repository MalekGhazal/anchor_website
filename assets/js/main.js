/* Anchor website — small, dependency-free interactions. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: scrolled state + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Count-up numbers (hero orb, phone orb) ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    var duration = 1800;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(countUp);
  }

  /* ---------- Journey timeline: fill as you scroll ---------- */
  var timeline = document.querySelector(".timeline");
  var fill = document.querySelector(".timeline__fill");
  var stages = document.querySelectorAll(".stage");
  var ticking = false;

  function updateTimeline() {
    ticking = false;
    if (!timeline || !fill) return;
    var rect = timeline.getBoundingClientRect();
    var anchor = window.innerHeight * 0.6;
    var progress = (anchor - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    fill.style.height = (progress * (rect.height - 16)) + "px";
    stages.forEach(function (stage) {
      var sRect = stage.getBoundingClientRect();
      stage.classList.toggle("is-reached", sRect.top < anchor);
    });
  }
  if (timeline) {
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateTimeline); }
    }, { passive: true });
    window.addEventListener("resize", updateTimeline);
    updateTimeline();
  }

  /* ---------- Box breathing exercise ---------- */
  var orb = document.querySelector(".breathe-orb");
  var startBtn = document.querySelector("[data-breathe-toggle]");
  var phaseEl = document.querySelector(".breathe__phase");
  var countEl = document.querySelector(".breathe__count");
  var metaEl = document.querySelector(".breathe__meta");
  var stepEls = document.querySelectorAll(".breathe__steps li");

  if (orb && startBtn) {
    var PHASES = [
      { name: "Breathe in", cls: "is-inhale" },
      { name: "Hold", cls: "is-hold-full" },
      { name: "Breathe out", cls: "is-exhale" },
      { name: "Hold", cls: "is-hold-empty" }
    ];
    var SECONDS = 4;
    var ROUNDS = 4; // 4 rounds x 16s = about a minute
    var running = false;
    var timer = null;
    var phaseIndex = 0;
    var secondsLeft = SECONDS;
    var round = 1;

    function setPhase(i) {
      PHASES.forEach(function (p) { orb.classList.remove(p.cls); });
      orb.classList.add(PHASES[i].cls);
      phaseEl.textContent = PHASES[i].name;
      stepEls.forEach(function (el, idx) { el.classList.toggle("is-active", idx === i); });
    }

    function render() {
      countEl.textContent = secondsLeft + "s · ROUND " + round + "/" + ROUNDS;
    }

    function tick() {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        phaseIndex += 1;
        if (phaseIndex >= PHASES.length) {
          phaseIndex = 0;
          round += 1;
          if (round > ROUNDS) { finish(); return; }
        }
        secondsLeft = SECONDS;
        setPhase(phaseIndex);
      }
      render();
    }

    function start() {
      running = true;
      phaseIndex = 0;
      secondsLeft = SECONDS;
      round = 1;
      startBtn.textContent = "Stop";
      startBtn.setAttribute("aria-pressed", "true");
      metaEl.textContent = "Follow the orb. Let your shoulders drop.";
      setPhase(0);
      render();
      timer = setInterval(tick, 1000);
    }

    function stop(message) {
      running = false;
      clearInterval(timer);
      PHASES.forEach(function (p) { orb.classList.remove(p.cls); });
      stepEls.forEach(function (el) { el.classList.remove("is-active"); });
      startBtn.textContent = "Start again";
      startBtn.setAttribute("aria-pressed", "false");
      phaseEl.textContent = "Ready";
      countEl.textContent = "4 · 4 · 4 · 4";
      metaEl.textContent = message || "Stopped. You can start again any time.";
    }

    function finish() {
      stop("That's one minute. Notice how the urge feels now — usually a little quieter.");
    }

    startBtn.addEventListener("click", function () {
      if (running) stop(); else start();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden && running) stop("Paused while you were away.");
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* Guide page: table-of-contents highlight and copy buttons */
(function () {
  "use strict";

  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var targets = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var link = map[entry.target.id];
          if (link) link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    targets.forEach(function (t) { tocObserver.observe(t); });
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  });
})();

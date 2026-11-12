(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Background video: make sure autoplay kicks in ---------- */
  const video = document.querySelector(".bg-video");
  if (video) {
    video.muted = true;
    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tryPlay();
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  const overlay = document.querySelector(".menu-overlay");

  const setMenu = (open) => {
    if (!burger || !menu || !overlay) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    overlay.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  if (burger && menu && overlay) {
    burger.addEventListener("click", () => {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    overlay.addEventListener("click", () => setMenu(false));
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setMenu(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        burger.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) setMenu(false);
    });
  }

  /* ---------- Stat count-up ---------- */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const format = (value, decimals, suffix) => value.toFixed(decimals) + suffix;

  const runCount = (el, i) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";

    if (reduceMotion) {
      el.textContent = format(target, decimals, suffix);
      return;
    }

    const duration = 1500 + i * 80;
    const delay = 480 + i * 90;

    setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = format(target * easeOutCubic(t), decimals, suffix);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = format(target, decimals, suffix);
      };
      requestAnimationFrame(tick);
    }, delay);
  };

  const values = Array.from(document.querySelectorAll(".stat-value"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCount(entry.target, values.indexOf(entry.target));
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );
    values.forEach((el) => io.observe(el));
  } else {
    values.forEach(runCount);
  }
})();

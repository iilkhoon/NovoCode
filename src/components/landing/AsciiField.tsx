"use client";
import { useEffect, useRef } from "react";

const RAMP = " ..::-=+*#";

/**
 * A quiet field of characters that drifts like warm air. Brightens around the pointer,
 * speeds up while the user is typing (`active`). Kept deliberately faint — texture, not show.
 * Pauses off-screen / in hidden tabs; draws one static frame under reduced motion.
 */
export function AsciiField({ active = false, className }: { active?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 640;
    const CELL = weak ? 18 : 14;
    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let ink = "#8d8173", flame = "#e0602f";
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let t = Math.random() * 100, speed = 1, raf = 0, last = 0, visible = true;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = cs.getPropertyValue("--color-ink-500").trim() || ink;
      flame = cs.getPropertyValue("--color-nar").trim() || flame;
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 ${CELL * 0.72}px "Martian Mono Variable", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * CELL + CELL / 2, py = y * CELL + CELL / 2;
          // two slow interfering waves + a soft diagonal swell
          let v = Math.sin(x * 0.16 + t * 0.7) * Math.cos(y * 0.21 - t * 0.5) + Math.sin((x + y) * 0.07 + t * 0.35) * 0.8;
          v = (v + 1.8) / 3.6;
          const dx = px - pointer.x, dy = py - pointer.y;
          const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 170);
          v = Math.min(1, v * 0.85 + near * 0.55);
          const i = Math.floor(v * (RAMP.length - 1));
          if (i <= 2) continue;
          ctx.globalAlpha = 0.1 + v * 0.3;
          ctx.fillStyle = near > 0.35 && i > 6 ? flame : ink;
          ctx.fillText(RAMP[i], px, py);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < (weak ? 50 : 33)) return; // ~20–30fps is plenty for drift
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      speed += ((activeRef.current ? 3.2 : 1) - speed) * 0.05;
      t += dt * 0.6 * speed;
      draw();
    };

    readColors();
    resize();
    draw();
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    const mo = new MutationObserver(() => { readColors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.fonts?.ready.then(() => { resize(); draw(); });

    if (reduced) return () => { ro.disconnect(); mo.disconnect(); };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      if (pointer.x < -999) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    };
    const onLeave = () => { pointer.tx = pointer.ty = -9999; };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting && !document.hidden));
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

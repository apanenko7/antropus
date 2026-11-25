"use client";

import { useEffect, useRef } from "react";

/*
 * Decorative page background: a cross-section of a water surface near the
 * bottom of the viewport. A few layered waves (sums of sines) drift slowly;
 * the surface line glows in the accent colour. Static frame under
 * prefers-reduced-motion, paused while the tab is hidden.
 */

interface Wave {
  /** Surface level as a share of the viewport height. */
  level: number;
  amp: number;
  len: number;
  speed: number;
  fill: string;
  line?: string;
}

const WAVES: Wave[] = [
  { level: 0.7, amp: 14, len: 520, speed: 0.18, fill: "rgb(70 120 170 / 0.05)" },
  { level: 0.76, amp: 11, len: 380, speed: -0.26, fill: "rgb(60 110 160 / 0.06)", line: "rgb(140 190 230 / 0.12)" },
  { level: 0.82, amp: 9, len: 300, speed: 0.34, fill: "rgb(40 80 120 / 0.1)", line: "rgb(163 230 53 / 0.25)" },
];

const FRAME_MS = 1000 / 30;

export function WaterBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const y = (wave: Wave, x: number, t: number) => {
      const k = (2 * Math.PI) / wave.len;
      const p = t * wave.speed;
      return (
        h * wave.level +
        wave.amp * Math.sin(x * k + p * 2) +
        wave.amp * 0.45 * Math.sin(x * k * 2.3 - p * 3.1 + 1.7) +
        wave.amp * 0.2 * Math.sin(x * k * 5.1 + p * 4.3)
      );
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const step = w < 640 ? 6 : 8;
      for (const wave of WAVES) {
        ctx.beginPath();
        ctx.moveTo(0, y(wave, 0, t));
        for (let x = step; x <= w + step; x += step) ctx.lineTo(x, y(wave, x, t));
        if (wave.line) {
          ctx.strokeStyle = wave.line;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, h * wave.level - wave.amp, 0, h);
        grad.addColorStop(0, wave.fill);
        grad.addColorStop(1, "rgb(20 40 60 / 0.12)");
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now / 1000);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (motion.matches || document.hidden) {
        draw(0);
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      resize();
      if (motion.matches) draw(0);
    };

    resize();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", start);
    motion.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}

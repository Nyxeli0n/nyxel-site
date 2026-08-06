"use client";

import { useEffect, useRef } from "react";

const FONT_VARS = [
  "--font-pixel-square",
  "--font-pixel-circle",
  "--font-pixel-grid",
  "--font-pixel-triangle",
  "--font-pixel-line",
] as const;

const GLYPHS = ["◆", "◇", "●", "○", "▲", "△", "■", "□", "+", "*", "x", "·", "N", "y", "X", "0", "1"] as const;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  glyph: string;
  font: string;
  spin: number;
  rotation: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]!;
}

function readCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function resolveFonts() {
  return FONT_VARS.map((name) => {
    const value = readCssVar(name);
    return value ? `${value}, monospace` : "monospace";
  });
}

function themeColor() {
  return readCssVar("--foreground") || "#fff";
}

export default function PixelCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !finePointer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    let fonts = resolveFonts();
    let color = themeColor();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let hasLast = false;
    let spawnBudget = 0;
    let running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function syncTheme() {
      fonts = resolveFonts();
      color = themeColor();
    }

    function spawn(
      x: number,
      y: number,
      opts: {
        count: number;
        speed: [number, number];
        size: [number, number];
        life: [number, number];
        spread?: number;
        radial?: boolean;
      },
    ) {
      const maxParticles = 220;
      for (let i = 0; i < opts.count; i += 1) {
        if (particles.length >= maxParticles) particles.shift();

        const angle = opts.radial
          ? (Math.PI * 2 * i) / opts.count + rand(-0.2, 0.2)
          : rand(0, Math.PI * 2);
        const speed = rand(opts.speed[0], opts.speed[1]);
        const spread = opts.spread ?? 10;

        particles.push({
          x: x + rand(-spread, spread),
          y: y + rand(-spread, spread),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: rand(opts.life[0], opts.life[1]),
          size: rand(opts.size[0], opts.size[1]),
          glyph: pick(GLYPHS),
          font: pick(fonts),
          spin: rand(-0.25, 0.25),
          rotation: rand(0, Math.PI * 2),
        });
      }
    }

    function onMove(event: PointerEvent) {
      const x = event.clientX;
      const y = event.clientY;

      if (!hasLast) {
        lastX = x;
        lastY = y;
        hasLast = true;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < 6) return;

      spawnBudget += dist;
      lastX = x;
      lastY = y;

      while (spawnBudget >= 10) {
        spawnBudget -= 10;
        spawn(x, y, {
          count: Math.random() > 0.45 ? 3 : 2,
          speed: [0.4, 2.8],
          size: [10, 22],
          life: [280, 620],
          spread: 14,
        });
      }
    }

    function onClick(event: MouseEvent) {
      const x = event.clientX;
      const y = event.clientY;

      spawn(x, y, {
        count: 36,
        speed: [2.5, 7.5],
        size: [12, 28],
        life: [450, 900],
        spread: 4,
        radial: true,
      });

      spawn(x, y, {
        count: 18,
        speed: [1.2, 4.2],
        size: [8, 18],
        life: [350, 700],
        spread: 18,
      });
    }

    let lastTs = performance.now();

    function tick(ts: number) {
      if (!running) return;
      const dt = Math.min(32, ts - lastTs);
      lastTs = ts;

      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = color;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]!;
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const t = p.life / p.maxLife;
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const drag = 0.96;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);
        p.rotation += p.spin * (dt / 16.67);

        ctx!.save();
        ctx!.globalAlpha = Math.max(0, Math.min(1, fade));
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.font = `${p.size}px ${p.font}`;
        ctx!.fillText(p.glyph, 0, 0);
        ctx!.restore();
      }

      raf = window.requestAnimationFrame(tick);
    }

    resize();
    syncTheme();

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    raf = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pixel-cursor"
      aria-hidden="true"
    />
  );
}

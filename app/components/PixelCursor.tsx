"use client";

import { useEffect, useRef } from "react";

const FONT_VARS = [
  "--font-pixel-square",
  "--font-pixel-circle",
  "--font-pixel-grid",
  "--font-pixel-triangle",
  "--font-pixel-line",
] as const;

const TRAIL_GLYPHS = ["·", "+", "x", "o", "n"] as const;
const RIPPLE_GLYPHS = ["·", "+", "o", "x", "i", "n", "a"] as const;

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
  drag: number;
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
    const maxParticles = 520;

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

    function pushParticle(p: Particle) {
      if (particles.length >= maxParticles) particles.shift();
      particles.push(p);
    }

    function spawnTrail(x: number, y: number) {
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < count; i += 1) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(0.2, 1.1);
        pushParticle({
          x: x + rand(-4, 4),
          y: y + rand(-4, 4),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: rand(220, 420),
          size: pick([6, 7, 8] as const),
          glyph: pick(TRAIL_GLYPHS),
          font: pick(fonts),
          drag: 0.94,
          spin: rand(-0.08, 0.08),
          rotation: 0,
        });
      }
    }

    function spawnRing(
      x: number,
      y: number,
      opts: {
        count: number;
        speed: number;
        size: number;
        life: number;
        jitter?: number;
        phase?: number;
      },
    ) {
      const jitter = opts.jitter ?? 0.02;
      const phase = opts.phase ?? 0;
      for (let i = 0; i < opts.count; i += 1) {
        const angle = phase + (Math.PI * 2 * i) / opts.count + rand(-jitter, jitter);
        const speed = opts.speed * rand(0.97, 1.03);
        pushParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: opts.life * rand(0.92, 1.08),
          size: opts.size,
          glyph: pick(RIPPLE_GLYPHS),
          font: pick(fonts),
          drag: 1,
          spin: 0,
          rotation: angle,
        });
      }
    }

    function spawnRipple(x: number, y: number) {
      spawnRing(x, y, {
        count: 48,
        speed: 1.35,
        size: 6,
        life: 420,
        jitter: 0.015,
      });
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

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist < 7) return;

      spawnBudget += dist;
      lastX = x;
      lastY = y;

      while (spawnBudget >= 14) {
        spawnBudget -= 14;
        spawnTrail(x, y);
      }
    }

    function onClick(event: MouseEvent) {
      spawnRipple(event.clientX, event.clientY);
    }

    let lastTs = performance.now();

    function tick(ts: number) {
      if (!running) return;
      const dt = Math.min(32, ts - lastTs);
      lastTs = ts;
      const step = dt / 16.67;

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
        const fade = t < 0.08 ? t / 0.08 : 1 - (t - 0.08) / 0.92;

        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.rotation += p.spin * step;

        ctx!.save();
        ctx!.globalAlpha = Math.max(0, Math.min(1, fade)) * (p.drag === 1 ? 0.9 : 0.75);
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

  return <canvas ref={canvasRef} className="pixel-cursor" aria-hidden="true" />;
}

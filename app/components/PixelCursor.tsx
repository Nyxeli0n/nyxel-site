"use client";

import { useEffect, useRef } from "react";

const FONT_VARS = [
  "--font-pixel-square",
  "--font-pixel-circle",
  "--font-pixel-grid",
  "--font-pixel-triangle",
  "--font-pixel-line",
] as const;

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+#*=%@" as const;

type Cell = {
  key: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  glyph: string;
  font: string;
  peak: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
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

function snap(value: number, grid: number) {
  return Math.round(value / grid) * grid;
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

    const cells = new Map<string, Cell>();
    const timers: number[] = [];
    let fonts = resolveFonts();
    let color = themeColor();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let hasLast = false;
    let running = true;
    let paused = false;
    const grid = 8;

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

    function lightCell(
      x: number,
      y: number,
      opts?: { force?: boolean; maxLife?: number; peak?: number },
    ) {
      const gx = snap(x, grid);
      const gy = snap(y, grid);
      const key = `${gx}:${gy}`;
      const existing = cells.get(key);
      const force = opts?.force ?? false;

      if (existing && !force) {
        existing.life = Math.min(existing.life, existing.maxLife * 0.15);
        existing.peak = Math.min(1, existing.peak + 0.25);
        if (Math.random() > 0.55) {
          existing.glyph = pickChar();
          existing.font = pick(fonts);
        }
        return;
      }

      cells.set(key, {
        key,
        x: gx,
        y: gy,
        life: 0,
        maxLife: opts?.maxLife ?? rand(420, 780),
        size: 7,
        glyph: pickChar(),
        font: pick(fonts),
        peak: opts?.peak ?? rand(0.75, 1),
      });
    }

    function expandClick(x: number, y: number) {
      const maxRadius = 8;
      const ringDelay = 26;
      const life = 280;

      for (let row = -maxRadius; row <= maxRadius; row += 1) {
        for (let col = -maxRadius; col <= maxRadius; col += 1) {
          const dist = Math.hypot(col, row);
          if (dist > maxRadius + 0.2) continue;

          const delay = Math.round(dist * ringDelay);
          const id = window.setTimeout(() => {
            if (!running) return;
            lightCell(x + col * grid, y + row * grid, {
              force: true,
              maxLife: life,
              peak: Math.max(0.55, 1 - dist * 0.04),
            });
          }, delay);
          timers.push(id);
        }
      }
    }

    function onMove(event: PointerEvent) {
      if (paused) {
        hasLast = false;
        return;
      }

      const x = event.clientX;
      const y = event.clientY;

      if (!hasLast) {
        lastX = x;
        lastY = y;
        hasLast = true;
        lightCell(x, y);
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) return;

      const steps = Math.max(1, Math.ceil(dist / (grid * 0.55)));
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        const px = lastX + dx * t;
        const py = lastY + dy * t;
        lightCell(px, py);
        if (Math.random() > 0.7) {
          lightCell(px + pick([-grid, 0, grid] as const), py + pick([-grid, 0, grid] as const));
        }
      }

      lastX = x;
      lastY = y;
    }

    function onClick(event: MouseEvent) {
      if (paused) return;
      expandClick(event.clientX, event.clientY);
    }

    function onCursorFx(event: Event) {
      const detail = (event as CustomEvent<{ paused?: boolean }>).detail;
      paused = Boolean(detail?.paused);
      if (paused) {
        cells.clear();
        hasLast = false;
      }
    }

    let lastTs = performance.now();

    function tick(ts: number) {
      if (!running) return;
      const dt = Math.min(32, ts - lastTs);
      lastTs = ts;
      const step = dt / 16.67;

      ctx!.clearRect(0, 0, width, height);
      if (paused) {
        cells.clear();
        raf = window.requestAnimationFrame(tick);
        return;
      }

      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (const [key, c] of cells) {
        c.life += dt;
        if (c.life >= c.maxLife) {
          cells.delete(key);
          continue;
        }

        if (Math.random() < 0.045 * step) {
          c.glyph = pickChar();
          c.font = pick(fonts);
        }

        const t = c.life / c.maxLife;
        const envelope =
          t < 0.1 ? t / 0.1 : t > 0.55 ? 1 - (t - 0.55) / 0.45 : 1;
        const alpha = Math.max(0, Math.min(1, envelope * c.peak));

        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = color;
        ctx!.font = `${c.size}px ${c.font}`;
        ctx!.fillText(c.glyph, c.x, c.y);
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
    window.addEventListener("nyxel-cursor-fx", onCursorFx);
    raf = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("nyxel-cursor-fx", onCursorFx);
      themeObserver.disconnect();
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="pixel-cursor" aria-hidden="true" />;
}

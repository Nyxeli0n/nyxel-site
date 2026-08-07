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

type Speck = {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  glyph: string;
  font: string;
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

function setCursorFxPaused(paused: boolean) {
  window.dispatchEvent(
    new CustomEvent("nyxel-cursor-fx", { detail: { paused } }),
  );
}

export default function ScrambleTitle() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const specks: Speck[] = [];
    let fonts = resolveFonts();
    let fg = readCssVar("--foreground") || "#fff";
    let bg = readCssVar("--background") || "#000";
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let hovering = false;
    let pointerX = 0;
    let pointerY = 0;
    const grid = 5;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function syncTheme() {
      fonts = resolveFonts();
      fg = readCssVar("--foreground") || "#fff";
      bg = readCssVar("--background") || "#000";
    }

    function spawnAround(x: number, y: number) {
      const radius = 16;
      const count = 10;
      for (let i = 0; i < count; i += 1) {
        const angle = rand(0, Math.PI * 2);
        const dist = rand(0, radius);
        const sx = Math.round((x + Math.cos(angle) * dist) / grid) * grid;
        const sy = Math.round((y + Math.sin(angle) * dist) / grid) * grid;
        if (sx < -4 || sy < -4 || sx > width + 4 || sy > height + 4) continue;

        specks.push({
          x: sx,
          y: sy,
          life: 0,
          maxLife: rand(90, 180),
          size: pick([4, 5, 6] as const),
          glyph: pickChar(),
          font: pick(fonts),
        });
      }

      if (specks.length > 260) {
        specks.splice(0, specks.length - 260);
      }
    }

    function onEnter() {
      hovering = true;
      setCursorFxPaused(true);
      resize();
    }

    function onLeave() {
      hovering = false;
      setCursorFxPaused(false);
      specks.length = 0;
      ctx!.clearRect(0, 0, width, height);
    }

    function onMove(event: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (!hovering) onEnter();
      spawnAround(pointerX, pointerY);
    }

    let lastTs = performance.now();
    let spawnAcc = 0;

    function tick(ts: number) {
      if (!running) return;
      const dt = Math.min(32, ts - lastTs);
      lastTs = ts;
      const step = dt / 16.67;

      ctx!.clearRect(0, 0, width, height);

      if (hovering) {
        spawnAcc += dt;
        while (spawnAcc >= 16) {
          spawnAcc -= 16;
          spawnAround(pointerX, pointerY);
        }
      }

      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (let i = specks.length - 1; i >= 0; i -= 1) {
        const s = specks[i]!;
        s.life += dt;
        if (s.life >= s.maxLife) {
          specks.splice(i, 1);
          continue;
        }

        if (Math.random() < 0.2 * step) {
          s.glyph = pickChar();
          s.font = pick(fonts);
        }

        const t = s.life / s.maxLife;
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const alpha = Math.max(0, Math.min(1, fade));

        // Punch out the original Sans glyph only under each speck.
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = bg;
        ctx!.fillRect(s.x - grid * 0.55, s.y - grid * 0.55, grid * 1.1, grid * 1.1);

        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = fg;
        ctx!.font = `${s.size}px ${s.font}`;
        ctx!.fillText(s.glyph, s.x, s.y);
      }

      ctx!.globalAlpha = 1;

      raf = window.requestAnimationFrame(tick);
    }

    resize();
    syncTheme();

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      setCursorFxPaused(false);
      window.cancelAnimationFrame(raf);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="scramble-title">
      <h1>Nyxel</h1>
      <canvas ref={canvasRef} className="scramble-title__fx" aria-hidden="true" />
    </div>
  );
}

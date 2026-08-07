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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const title = titleRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !title || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mask = document.createElement("canvas");
    const maskCtx = mask.getContext("2d", { willReadFrequently: true });
    if (!maskCtx) return;

    const inkCells: Array<{ x: number; y: number }> = [];
    const cellIndex = new Map<string, number>();
    const active = new Map<string, Speck>();

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
    const grid = 4;

    function keyOf(x: number, y: number) {
      return `${x}:${y}`;
    }

    function rebuildMask() {
      const rect = wrap!.getBoundingClientRect();
      const styles = getComputedStyle(title!);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      mask.width = Math.floor(width * dpr);
      mask.height = Math.floor(height * dpr);
      maskCtx!.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx!.clearRect(0, 0, mask.width, mask.height);
      maskCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const text = title!.textContent || "Nyxel";
      maskCtx!.fillStyle = "#fff";
      maskCtx!.font = styles.font;
      maskCtx!.letterSpacing = styles.letterSpacing;
      maskCtx!.textAlign = "left";
      maskCtx!.textBaseline = "alphabetic";

      // Align canvas glyphs to the real DOM text box via Range metrics.
      const range = document.createRange();
      range.selectNodeContents(title!);
      const textRect = range.getBoundingClientRect();
      const localX = textRect.left - rect.left;
      const localY = textRect.top - rect.top;
      const metrics = maskCtx!.measureText(text);
      const ascent =
        metrics.actualBoundingBoxAscent || parseFloat(styles.fontSize) * 0.8;
      maskCtx!.fillText(text, localX, localY + ascent);

      const sample = maskCtx!.getImageData(0, 0, mask.width, mask.height).data;
      inkCells.length = 0;
      cellIndex.clear();

      for (let y = 0; y < height; y += grid) {
        for (let x = 0; x < width; x += grid) {
          let hit = false;
          let ink = 0;
          let samples = 0;
          const x0 = Math.floor(x * dpr);
          const y0 = Math.floor(y * dpr);
          const x1 = Math.min(mask.width, Math.floor((x + grid) * dpr));
          const y1 = Math.min(mask.height, Math.floor((y + grid) * dpr));

          for (let py = y0; py < y1; py += 1) {
            for (let px = x0; px < x1; px += 1) {
              const alpha = sample[(py * mask.width + px) * 4 + 3] ?? 0;
              samples += 1;
              if (alpha > 20) {
                ink += 1;
                hit = true;
              }
            }
          }

          // Ignore near-empty fringe so glitches stay inside strokes.
          if (!hit || ink / Math.max(1, samples) < 0.12) continue;
          const cx = x + grid / 2;
          const cy = y + grid / 2;
          cellIndex.set(keyOf(x, y), inkCells.length);
          inkCells.push({ x: cx, y: cy });
        }
      }
    }

    function syncTheme() {
      fonts = resolveFonts();
      fg = readCssVar("--foreground") || "#fff";
      bg = readCssVar("--background") || "#000";
      rebuildMask();
    }

    function glitchNear(x: number, y: number) {
      const radius = 14;
      const radius2 = radius * radius;

      for (const cell of inkCells) {
        const dx = cell.x - x;
        const dy = cell.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 > radius2) continue;

        // Stronger chance near the pointer.
        const falloff = 1 - Math.sqrt(d2) / radius;
        if (Math.random() > 0.35 + falloff * 0.55) continue;

        const gx = Math.round((cell.x - grid / 2) / grid) * grid;
        const gy = Math.round((cell.y - grid / 2) / grid) * grid;
        const key = keyOf(gx, gy);
        const existing = active.get(key);

        if (existing) {
          existing.life = Math.min(existing.life, existing.maxLife * 0.2);
          existing.glyph = pickChar();
          existing.font = pick(fonts);
          continue;
        }

        active.set(key, {
          x: cell.x,
          y: cell.y,
          life: 0,
          maxLife: rand(70, 140),
          size: pick([4, 5] as const),
          glyph: pickChar(),
          font: pick(fonts),
        });
      }
    }

    function onEnter() {
      hovering = true;
      setCursorFxPaused(true);
      rebuildMask();
    }

    function onLeave() {
      hovering = false;
      setCursorFxPaused(false);
      active.clear();
      ctx!.clearRect(0, 0, width, height);
    }

    function onMove(event: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (!hovering) onEnter();
      glitchNear(pointerX, pointerY);
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
        while (spawnAcc >= 18) {
          spawnAcc -= 18;
          glitchNear(pointerX, pointerY);
        }
      }

      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (const [key, s] of active) {
        s.life += dt;
        if (s.life >= s.maxLife) {
          active.delete(key);
          continue;
        }

        if (Math.random() < 0.28 * step) {
          s.glyph = pickChar();
          s.font = pick(fonts);
        }

        const t = s.life / s.maxLife;
        const fade = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;
        const alpha = Math.max(0, Math.min(1, fade));

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

    // Wait a frame so font metrics are ready.
    const boot = window.requestAnimationFrame(() => {
      rebuildMask();
      syncTheme();
    });

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    const ro = new ResizeObserver(() => rebuildMask());
    ro.observe(wrap);

    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", rebuildMask);
    raf = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      setCursorFxPaused(false);
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(boot);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", rebuildMask);
      themeObserver.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="scramble-title">
      <h1 ref={titleRef}>Nyxel</h1>
      <canvas ref={canvasRef} className="scramble-title__fx" aria-hidden="true" />
    </div>
  );
}

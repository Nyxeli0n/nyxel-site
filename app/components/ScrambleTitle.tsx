"use client";

import { useEffect, useRef, useState } from "react";

const TITLE = "Nyxel";
const PIXEL_VARS = [
  "--font-pixel-square",
  "--font-pixel-circle",
  "--font-pixel-grid",
  "--font-pixel-triangle",
  "--font-pixel-line",
] as const;
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+#*=%@" as const;

type LetterState = {
  text: string;
  scrambled: boolean;
  font: string;
};

function pickChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
}

function readFont(varName: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || "monospace";
}

function initialState(): LetterState[] {
  return TITLE.split("").map((text) => ({
    text,
    scrambled: false,
    font: "",
  }));
}

export default function ScrambleTitle() {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [letters, setLetters] = useState<LetterState[]>(initialState);
  const active = useRef<Set<number>>(new Set());
  const timers = useRef<Map<number, number>>(new Map());
  const tickRef = useRef<number | null>(null);
  const enabled = useRef(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    enabled.current = !reduced && fine;

    return () => {
      for (const id of timers.current.values()) window.clearTimeout(id);
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  function setLetter(index: number, next: Partial<LetterState>) {
    setLetters((prev) =>
      prev.map((letter, i) => (i === index ? { ...letter, ...next } : letter)),
    );
  }

  function scramble(index: number) {
    if (!enabled.current) return;
    const existing = timers.current.get(index);
    if (existing) {
      window.clearTimeout(existing);
      timers.current.delete(index);
    }

    active.current.add(index);
    setLetter(index, {
      scrambled: true,
      text: pickChar(),
      font: readFont(PIXEL_VARS[index % PIXEL_VARS.length]!),
    });

    if (!tickRef.current) {
      tickRef.current = window.setInterval(() => {
        if (active.current.size === 0) {
          if (tickRef.current) window.clearInterval(tickRef.current);
          tickRef.current = null;
          return;
        }
        setLetters((prev) =>
          prev.map((letter, i) =>
            active.current.has(i)
              ? {
                  ...letter,
                  scrambled: true,
                  text: pickChar(),
                  font: readFont(PIXEL_VARS[Math.floor(Math.random() * PIXEL_VARS.length)]!),
                }
              : letter,
          ),
        );
      }, 55);
    }
  }

  function restore(index: number) {
    active.current.delete(index);
    const id = window.setTimeout(() => {
      if (active.current.has(index)) return;
      setLetter(index, {
        text: TITLE[index]!,
        scrambled: false,
        font: "",
      });
      timers.current.delete(index);
    }, 90);
    timers.current.set(index, id);
  }

  function onMove(event: React.MouseEvent<HTMLHeadingElement>) {
    if (!enabled.current) return;
    const x = event.clientX;
    const y = event.clientY;

    letterRefs.current.forEach((node, index) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const padX = rect.width * 0.15;
      const padY = rect.height * 0.2;
      const inside =
        x >= rect.left - padX &&
        x <= rect.right + padX &&
        y >= rect.top - padY &&
        y <= rect.bottom + padY;

      if (inside) scramble(index);
      else if (active.current.has(index)) restore(index);
    });
  }

  function onLeave() {
    for (const index of [...active.current]) restore(index);
  }

  return (
    <h1
      ref={rootRef}
      className="scramble-title"
      aria-label="Nyxel"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {letters.map((letter, index) => (
        <span
          key={`${TITLE[index]}-${index}`}
          ref={(node) => {
            letterRefs.current[index] = node;
          }}
          className={letter.scrambled ? "scramble-title__char is-scrambled" : "scramble-title__char"}
          style={letter.scrambled ? { fontFamily: letter.font } : undefined}
          aria-hidden="true"
        >
          {letter.text}
        </span>
      ))}
    </h1>
  );
}

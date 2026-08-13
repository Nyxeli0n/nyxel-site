"use client";

import { useSyncExternalStore } from "react";

const THEME_CHANGE_EVENT = "nyxel-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

function getIsDark() {
  return document.documentElement.dataset.theme !== "light";
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => true);

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{isDark ? "○" : "●"}</span>
      {isDark ? "Light" : "Dark"}
    </button>
  );
}

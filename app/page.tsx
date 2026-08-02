"use client";

import { useSyncExternalStore } from "react";

const contacts = [
  { label: "X", href: "https://x.com/nyxeli0n" },
  { label: "GitHub", href: "https://github.com/Nyxeli0n" },
  { label: "Mail", href: "mailto:nyxelion@icloud.com" },
];

const projects = [
  {
    number: "01",
    name: "Infinite Life",
    description: "macOS cellular automaton wallpaper",
    href: "https://github.com/Nyxeli0n/InfiniteLife",
  },
  {
    number: "02",
    name: "nyxelion.dev",
    description: "Personal website",
    href: "https://github.com/Nyxeli0n/nyxel-site",
  },
];

export default function Home() {
  const isDark = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("nyxel-theme-change", onStoreChange);
      return () => window.removeEventListener("nyxel-theme-change", onStoreChange);
    },
    () => document.documentElement.dataset.theme !== "light",
    () => true,
  );

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("nyxel-theme-change"));
  }

  return (
    <main>
      <div className="site-head">
        <h1>Nyxel</h1>
        <button
          className="theme-toggle"
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
        >
          <span aria-hidden="true">{isDark ? "○" : "●"}</span>
          {isDark ? "Light" : "Dark"}
        </button>
      </div>

      <nav className="contacts" aria-label="Contact">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("http") ? "_blank" : undefined}
            rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
          >
            {contact.label}
          </a>
        ))}
      </nav>

      <section aria-labelledby="projects-title">
        <h2 id="projects-title">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.name}>
              <a href={project.href} target="_blank" rel="noreferrer">
                <small className="project-number">{project.number}</small>
                <span>{project.name}</span>
                <small>{project.description}</small>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

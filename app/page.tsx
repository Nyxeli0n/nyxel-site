"use client";

import { useSyncExternalStore } from "react";

const contacts = [
  { label: "X", href: "https://x.com/nyxeli0n" },
  { label: "GitHub", href: "https://github.com/Nyxeli0n" },
];

const projects = [
  {
    number: "03",
    name: "NEXT",
    description: "Apple Reminders, one task at a time",
    href: "https://github.com/Nyxeli0n/NEXT",
    sourceHref: null,
    newTab: true,
  },
  {
    number: "02",
    name: "Infinite Life",
    description: "macOS cellular automaton wallpaper",
    href: "https://github.com/Nyxeli0n/InfiniteLife",
    sourceHref: null,
    newTab: true,
  },
  {
    number: "01",
    name: "nyxelion.dev",
    description: "Personal website",
    href: "/",
    sourceHref: "https://github.com/Nyxeli0n/nyxel-site",
    newTab: false,
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
            <li className="project-card" key={project.name}>
              <a
                className="project-link"
                href={project.href}
                target={project.newTab ? "_blank" : undefined}
                rel={project.newTab ? "noreferrer" : undefined}
              >
                <small className="project-number">{project.number}</small>
                <span>{project.name}</span>
                <small className="project-description">{project.description}</small>
              </a>
              {project.sourceHref && (
                <a
                  className="project-source"
                  href={project.sourceHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.name} source on GitHub`}
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

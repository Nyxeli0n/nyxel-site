import ThemeToggle from "./components/ThemeToggle";

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
  },
  {
    number: "02",
    name: "Infinite Life",
    description: "macOS cellular automaton wallpaper",
    href: "https://github.com/Nyxeli0n/InfiniteLife",
  },
  {
    number: "01",
    name: "nyxelion.dev",
    description: "Personal website",
    href: "/",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-head fade-in">
        <h1>Nyxel</h1>
        <ThemeToggle />
      </header>

      <nav className="contacts fade-in delay-1" aria-label="Contact">
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

      <section className="projects fade-in delay-2" aria-labelledby="projects-title">
        <h2 id="projects-title">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li className="project-card" key={project.name}>
              <a
                className="project-link"
                href={project.href}
                target={project.href.startsWith("http") ? "_blank" : undefined}
                rel={project.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <div className="project-main">
                  <div className="project-title-row">
                    <small className="project-number">{project.number}</small>
                    <span className="project-name">{project.name}</span>
                  </div>
                  <p className="project-description">{project.description}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

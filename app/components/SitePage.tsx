import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
export default function SitePage({ title = "Nyxel", home = false, children }: {
  title?: string; home?: boolean; children?: React.ReactNode;
}) {
  return <main>
    <header className="site-head fade-in"><h1>{title}</h1><ThemeToggle /></header>
    <nav className="contacts fade-in delay-1" aria-label="Navigation">
      {!home && <Link href="/">Home</Link>}
      <a href="https://x.com/nyxeli0n" target="_blank" rel="noreferrer">X</a>
      <a href="https://github.com/Nyxeli0n" target="_blank" rel="noreferrer">GitHub</a>
    </nav>
    <div className="fade-in delay-2">{children}</div>
  </main>;
}

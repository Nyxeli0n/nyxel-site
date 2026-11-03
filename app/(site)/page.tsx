import Link from "next/link";
import SitePage from "./components/SitePage";

export default function Home() {
  return <SitePage>
    <nav className="contacts" aria-label="Pages">
      <Link href="/about">About</Link>
      <Link href="/projects">Projects</Link>
      <Link href="/books">Books</Link>
      <Link href="/movies">Movies</Link>
      <Link href="/diary">Diary</Link>
    </nav>
  </SitePage>;
}

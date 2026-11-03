import SitePage from "./components/SitePage";
import EntryList from "./components/EntryList";
import { bio } from "./content";
export default function Home() {
  return <SitePage home>
    {bio.length > 0 && <div className="prose intro">{bio.map((text, i) => <p key={i}>{text}</p>)}</div>}
    <EntryList label="Pages" entries={[
      { number: "01", name: "About", href: "/about" },
      { number: "02", name: "Projects", href: "/projects" },
      { number: "03", name: "Books", href: "/books" },
      { number: "04", name: "Movies", href: "/movies" },
      { number: "05", name: "Diary", href: "/diary" },
    ]} />
  </SitePage>;
}

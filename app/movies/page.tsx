import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import EntryList from "../components/EntryList";
import { movies } from "../content";
export const metadata: Metadata = { title: "Movies | Nyxel" };
export default function Page() { return <SitePage title="Movies"><EntryList label="Movies" entries={movies.map((item) => ({ name: item.name, href: item.href, description: [item.creator, item.note].filter(Boolean).join(" / ") }))} /></SitePage>; }

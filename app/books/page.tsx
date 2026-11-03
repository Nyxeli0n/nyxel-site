import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import EntryList from "../components/EntryList";
import { books } from "../content";
export const metadata: Metadata = { title: "Books | Nyxel" };
export default function Page() { return <SitePage title="Books"><EntryList label="Books" entries={books.map((item) => ({ name: item.name, href: item.href, description: [item.creator, item.note].filter(Boolean).join(" / ") }))} /></SitePage>; }

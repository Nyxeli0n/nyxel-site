import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import EntryList from "../components/EntryList";
import { diary } from "../content";
export const metadata: Metadata = { title: "Diary | Nyxel" };
export default function Page() { return <SitePage title="Diary"><EntryList label="Diary" entries={[...diary].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => ({ name: entry.title, description: entry.date, href: `/diary/${entry.slug}` }))} /></SitePage>; }

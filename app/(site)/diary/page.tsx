import type { Metadata } from "next";
import EntryList from "../components/EntryList";
import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Diary | Nyxel" };
export default async function Page() { const { diary } = await readContent(); return <EntryList label="Diary" entries={[...diary].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => ({ name: entry.title, description: entry.date, href: `/diary/${entry.slug}` }))} />; }

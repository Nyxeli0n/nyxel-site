import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import EntryList from "../components/EntryList";
import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects | Nyxel" };
export default async function Page() { const { projects } = await readContent(); return <SitePage title="Projects"><EntryList label="Projects" entries={projects.map((project, index) => ({ ...project, number: String(index + 1).padStart(2, "0") }))} /></SitePage>; }

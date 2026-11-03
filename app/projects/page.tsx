import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import EntryList from "../components/EntryList";
import { projects } from "../content";
export const metadata: Metadata = { title: "Projects | Nyxel" };
export default function Page() { return <SitePage title="Projects"><EntryList label="Projects" entries={projects.map((project, index) => ({ ...project, number: String(index + 1).padStart(2, "0") }))} /></SitePage>; }

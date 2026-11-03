import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import EntryList from "../components/EntryList";
import { readProjects } from "../lib/github-projects";
export const revalidate = 300;
export const metadata: Metadata = { title: "Projects | Nyxel" };
export default async function Page() {
  const projects = await readProjects();
  return <SitePage title="Projects"><EntryList label="Projects" entries={projects} /></SitePage>;
}

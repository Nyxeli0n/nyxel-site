import type { Metadata } from "next";
import EntryList from "../components/EntryList";
import { readProjects } from "../lib/github-projects";
export const revalidate = 300;
export const metadata: Metadata = { title: "Projects | Nyxel" };
export default async function Page() {
  const projects = await readProjects();
  return <EntryList label="Projects" entries={projects} />;
}

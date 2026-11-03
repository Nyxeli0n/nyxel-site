import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import BookShelf from "../components/BookShelf";
import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Books | Nyxel" };
export default async function Page() {
  const { books } = await readContent();
  return <SitePage title="Books"><BookShelf books={books} /></SitePage>;
}

import type { Metadata } from "next";
import BookShelf from "../components/BookShelf";
import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Books | Nyxel" };
export default async function Page() {
  const { books } = await readContent();
  return <BookShelf books={books} />;
}

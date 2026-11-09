import type { Metadata } from "next";
import MediaGrid from "../components/MediaGrid";
import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Book reviews | Nyxel" };
export default async function Page() {
  const { books } = await readContent();
  return <MediaGrid items={books} label="Book reviews" />;
}

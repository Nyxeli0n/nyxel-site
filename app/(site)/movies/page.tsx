import type { Metadata } from "next";
import MediaGrid from "../components/MediaGrid";
import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Movie reviews | Nyxel" };
export default async function Page() {
  const { movies } = await readContent();
  return <MediaGrid items={movies} label="Movie reviews" />;
}

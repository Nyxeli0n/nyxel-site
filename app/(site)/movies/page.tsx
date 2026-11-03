import type { Metadata } from "next";
import PosterGrid from "../components/PosterGrid";
import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Movies | Nyxel" };
export default async function Page() {
  const { movies } = await readContent();
  return <PosterGrid movies={movies} />;
}

import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import PosterGrid from "../components/PosterGrid";
import { movies } from "../content";

export const metadata: Metadata = { title: "Movies | Nyxel" };
export default function Page() {
  return <SitePage title="Movies"><PosterGrid movies={movies} /></SitePage>;
}

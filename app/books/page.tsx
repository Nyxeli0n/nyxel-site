import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import BookShelf from "../components/BookShelf";
import { books } from "../content";

export const metadata: Metadata = { title: "Books | Nyxel" };
export default function Page() {
  return <SitePage title="Books"><BookShelf books={books} /></SitePage>;
}

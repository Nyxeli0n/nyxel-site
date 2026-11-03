import type { Metadata } from "next";
import SitePage from "../../components/SitePage";
import BookShelf from "../../components/BookShelf";

export const metadata: Metadata = { title: "Book preview | Nyxel", robots: { index: false, follow: false } };
// Demonstration objects only; not the owner's reading list.
export default function Page() {
  return <SitePage title="Books"><BookShelf books={[
    { name: "Book 01", color: "#d99b16" },
    { name: "Book 02", color: "#2b5e89" },
    { name: "Book 03", color: "#636457" },
  ]} /></SitePage>;
}

import type { Metadata } from "next";
import SitePage from "../components/SitePage";
import ContentEditor from "../components/ContentEditor";
import EditorLogin from "../components/EditorLogin";
import { isAdmin } from "../lib/admin-auth";
import { localEditor, readSnapshot } from "../lib/content-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit | Nyxel", robots: { index:false, follow:false } };
export default async function Page() {
  if (!await isAdmin()) return <SitePage title="Edit"><EditorLogin /></SitePage>;
  const snapshot = await readSnapshot();
  return <SitePage title="Edit"><ContentEditor initial={snapshot.data} revision={snapshot.revision} local={localEditor()} /></SitePage>;
}

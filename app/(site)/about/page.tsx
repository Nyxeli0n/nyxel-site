import type { Metadata } from "next";
import SitePage from "../components/SitePage";

import { readContent } from "../lib/content-store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "About | Nyxel" };
export default async function Page() { const { bio } = await readContent(); return <SitePage title="About"><div className="prose">{bio.map((text, i) => <p key={i}>{text}</p>)}</div></SitePage>; }

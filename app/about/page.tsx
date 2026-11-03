import type { Metadata } from "next";
import SitePage from "../components/SitePage";

import { bio } from "../content";
export const metadata: Metadata = { title: "About | Nyxel" };
export default function Page() { return <SitePage title="About"><div className="prose">{bio.map((text, i) => <p key={i}>{text}</p>)}</div></SitePage>; }

import SitePage from "./components/SitePage";
import { readContent } from "./lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { bio } = await readContent();
  return <SitePage title="About"><div className="prose">
    {bio.map((text, index) => <p key={index}>{text}</p>)}
  </div></SitePage>;
}

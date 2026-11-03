import { readContent } from "./lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { bio } = await readContent();
  return (
    <div className="prose">
      {bio.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </div>
  );
}

import { readContent } from "./lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { bio } = await readContent();
  const paragraphs = bio
    .flatMap((text) => text.split(/\r?\n\s*\r?\n/))
    .map((text) => text.trim())
    .filter(Boolean);
  return (
    <div className="prose">
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </div>
  );
}

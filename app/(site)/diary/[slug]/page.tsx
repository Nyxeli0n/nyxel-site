import type { Metadata } from "next";
import Link from "next/link";
import RichText from "../../components/RichText";
import { notFound } from "next/navigation";
import { readContent } from "../../lib/content-store";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { diary } = await readContent();
  const entry = diary.find((item) => item.slug === slug);
  return { title: entry ? `${entry.title} | Nyxel` : "Nyxel" };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { diary } = await readContent();
  const entry = diary.find((item) => item.slug === slug);
  if (!entry) notFound();
  return (
    <>
      <article>
        <header className="article-header">
          <h2 className="article-title">{entry.title}</h2>
          <time dateTime={entry.date}>{entry.date}</time>
        </header>
        <div className="prose">
          {entry.body?.length ? (
            <RichText value={entry.body} />
          ) : (
            entry.paragraphs.map((text, i) => <p key={i}>{text}</p>)
          )}
        </div>
      </article>
      <ul className="back-link">
        <li className="project-card">
          <Link className="project-link" href="/diary">
            Blog
          </Link>
        </li>
      </ul>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SitePage from "../../components/SitePage";
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
  return <SitePage title="Diary">
    <article className="prose"><h2>{entry.title}</h2><time dateTime={entry.date}>{entry.date}</time>
      {entry.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
    </article>
    <ul className="back-link"><li className="project-card"><Link className="project-link" href="/diary">Diary</Link></li></ul>
  </SitePage>;
}

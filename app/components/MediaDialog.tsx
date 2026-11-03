"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import type { Favorite } from "../content";

export default function MediaDialog({ item, triggerClass, children, showLinks = true }: {
  item: Favorite; triggerClass: string; children: React.ReactNode; showLinks?: boolean;
}) {
  const links = item.links ?? (item.href ? [{ label: "公式サイト", href: item.href }] : []);
  return <Dialog.Root>
    <Dialog.Trigger className={`media-trigger ${triggerClass}`} aria-label={`${item.name}を開く`}>{children}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="media-overlay" />
      <Dialog.Content className="media-dialog" aria-describedby={undefined}>
        <Dialog.Close className="dialog-close" aria-label="閉じる">×</Dialog.Close>
        <div className="media-layout">
          <aside className="media-information">
            {item.cover && <Image className="detail-cover" src={item.cover} width={600} height={900} alt={item.name} unoptimized />}
            <Dialog.Title className="detail-title">{item.name}</Dialog.Title>
            {item.creator && <p className="detail-creator">{item.creator}</p>}
            {item.facts && <dl className="detail-facts">{item.facts.map((fact, i) => <div key={i}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
            {showLinks && links.length > 0 && <nav className="detail-links" aria-label="作品のリンク">{links.map((link, i) => <a href={link.href} target="_blank" rel="noreferrer" key={i}>{link.label} ↗</a>)}</nav>}
          </aside>
          <article className="media-review" aria-label="感想" lang="ja">
            {item.review ? item.review.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>) : <p className="review-empty">感想はまだありません。</p>}
          </article>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

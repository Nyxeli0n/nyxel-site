import Image from "next/image";
import MediaDialog from "./MediaDialog";
import type { Favorite } from "../content";

export default function MediaGrid({
  items,
  label,
}: {
  items: Favorite[];
  label: string;
}) {
  if (!items.length)
    return <p className="empty-state">まだレビューはありません。</p>;
  return (
    <ul className="media-grid" aria-label={label}>
      {items.map((item) => (
        <li className="media-card" key={item.name}>
          <MediaDialog item={item}>
            <span className="media-frame" aria-hidden="true">
              {item.cover ? (
                <Image
                  src={item.cover}
                  alt=""
                  width={600}
                  height={900}
                  unoptimized
                  sizes="(max-width: 560px) 45vw, 212px"
                />
              ) : (
                <span className="media-placeholder">画像なし</span>
              )}
            </span>
            <span className="media-title">{item.name}</span>
          </MediaDialog>
          {item.note && <p className="media-note">{item.note}</p>}
        </li>
      ))}
    </ul>
  );
}

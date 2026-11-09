import Link from "next/link";
export type Entry = {
  name: string;
  number?: string;
  description?: string;
  href?: string;
};
export default function EntryList({
  entries,
  label,
  variant = "content",
}: {
  entries: Entry[];
  label: string;
  variant?: "content" | "projects";
}) {
  if (!entries.length)
    return (
      <p className="empty-state">
        まだ公開されている{variant === "projects" ? "プロジェクト" : "記事"}
        はありません。
      </p>
    );
  return (
    <ul
      className={`entry-list ${variant === "projects" ? "project-list" : ""}`}
      aria-label={label}
    >
      {entries.map((entry) => {
        const content = (
          <div className={`project-main ${entry.number ? "numbered" : ""}`}>
            <div className="project-title-row">
              {entry.number && (
                <small className="project-number">{entry.number}</small>
              )}
              <span className="project-name">{entry.name}</span>
            </div>
            {entry.description && (
              <p
                className={
                  entry.number ? "project-description" : "entry-description"
                }
              >
                {entry.description}
              </p>
            )}
          </div>
        );
        return (
          <li className="project-card" key={entry.href ?? entry.name}>
            {entry.href ? (
              <Link
                className="project-link"
                href={entry.href}
                target={
                  entry.href.startsWith("https://") ? "_blank" : undefined
                }
                rel={
                  entry.href.startsWith("https://") ? "noreferrer" : undefined
                }
              >
                {content}
              </Link>
            ) : (
              <div className="project-link">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

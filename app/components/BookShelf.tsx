import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Favorite } from "../content";

// Original implementation, visually informed by vercel.com/geist/book.
// No Vercel component source or branding is included.
export default function BookShelf({ books }: { books: Favorite[] }) {
  return <ul className="book-shelf" aria-label="Books">{books.map((book) => {
    const cover = <span className="book-object" aria-hidden="true">
      <span className="book-pages" />
      <span className="book-cover" style={{ "--book-color": book.color ?? "#292929" } as CSSProperties}>
        {book.cover ? <Image className="book-art" src={book.cover} alt="" width={480} height={640} unoptimized /> : <>
          <span className="book-color" />
          <span className="book-lettering"><span>{book.name}</span>{book.creator && <small>{book.creator}</small>}</span>
        </>}
        <span className="book-binding" />
      </span>
    </span>;
    return <li className="book-item" key={book.name}>
      {book.href ? <Link className="book-hit" href={book.href} aria-label={book.name}
        target={book.href.startsWith("https://") ? "_blank" : undefined}
        rel={book.href.startsWith("https://") ? "noreferrer" : undefined}>{cover}</Link>
        : <div className="book-hit" role="img" aria-label={book.creator ? `${book.name}, ${book.creator}` : book.name}>{cover}</div>}
      {book.note && <p className="media-note">{book.note}</p>}
    </li>;
  })}</ul>;
}

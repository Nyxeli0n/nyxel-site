import Image from "next/image";
import MediaDialog from "./MediaDialog";
import type { CSSProperties } from "react";
import type { Favorite } from "../content";

export default function BookShelf({ books }: { books: Favorite[] }) {
  return <ul className="book-shelf" aria-label="Books">{books.map((book) => {
    const cover = <span className="book-object" style={{ aspectRatio: book.aspectRatio }} aria-hidden="true">
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
      <MediaDialog item={book} triggerClass="book-hit">{cover}<span className="book-title" lang="ja">{book.name}</span></MediaDialog>
      {book.note && <p className="media-note">{book.note}</p>}
    </li>;
  })}</ul>;
}

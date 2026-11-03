import Image from "next/image";
import MediaDialog from "./MediaDialog";
import type { Favorite } from "../content";

export default function PosterGrid({ movies }: { movies: Favorite[] }) {
  return <ul className="poster-grid" aria-label="Movies">{movies.map((movie) => {
    const poster = <>
      <span className="poster-frame">{movie.cover
        ? <Image src={movie.cover} alt="" width={600} height={900} unoptimized sizes="(max-width: 560px) 45vw, 210px" />
        : <span className="poster-placeholder">{movie.name}</span>}</span>
      <span className="poster-title">{movie.name}</span>
    </>;
    return <li key={movie.name}>
      <MediaDialog item={movie} triggerClass="poster" showLinks={false}>{poster}</MediaDialog>
      {movie.note && <p className="media-note">{movie.note}</p>}
    </li>;
  })}</ul>;
}

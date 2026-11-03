import "server-only";
import { createClient } from "@sanity/client";
import type { Favorite, DiaryEntry } from "../content";
import { cache } from "react";
import { safeHttpsUrl, safeLink } from "./urls";

export type SiteContent = { bio: string[]; books: Favorite[]; movies: Favorite[]; diary: DiaryEntry[] };
const client = createClient({
  projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset:process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token:process.env.SANITY_API_READ_TOKEN, apiVersion:"2025-02-19", useCdn:false, perspective:"published",
});
const work = `name,creator,"cover":coalesce(cover.asset->url,coverUrl),"aspectRatio":select(defined(cover.asset)=>string(cover.asset->metadata.dimensions.width)+" / "+string(cover.asset->metadata.dimensions.height),aspectRatio),facts,links,"reviewBlocks":review`;
export const readContent = cache(async (): Promise<SiteContent> => {
  const content = await client.fetch<SiteContent>(`{
    "bio":coalesce(*[_id=="site-settings"][0].bio,[]),
    "books":*[_type=="book"]|order(order asc,_createdAt asc){${work}},
    "movies":*[_type=="movie"]|order(order asc,_createdAt asc){${work}},
    "diary":*[_type=="diary"]|order(date desc){title,date,"slug":slug.current,body,"paragraphs":[]}
  }`, {}, {cache:"no-store"});
  const cleanWork = (item: Favorite): Favorite => ({...item, cover:safeHttpsUrl(item.cover), href:safeLink(item.href), links:item.links?.flatMap(link => {
    const href = safeHttpsUrl(link.href);
    return href ? [{...link,href}] : [];
  })});
  return {...content,books:content.books.map(cleanWork),movies:content.movies.map(cleanWork)};
});

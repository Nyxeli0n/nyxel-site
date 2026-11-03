import "server-only";
import { createClient } from "@sanity/client";
import type { Favorite, DiaryEntry } from "../content";

export type SiteContent = { bio: string[]; books: Favorite[]; movies: Favorite[]; diary: DiaryEntry[]; projects: {name:string;description:string;href:string}[] };
const client = createClient({
  projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset:process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token:process.env.SANITY_API_READ_TOKEN, apiVersion:"2025-02-19", useCdn:false, perspective:"published",
});
const work = `name,creator,"cover":coalesce(cover.asset->url,coverUrl),"aspectRatio":select(defined(cover.asset)=>string(cover.asset->metadata.dimensions.width)+" / "+string(cover.asset->metadata.dimensions.height),aspectRatio),facts,links,"reviewBlocks":review`;
export async function readContent(): Promise<SiteContent> {
  return client.fetch(`{
    "bio":coalesce(*[_id=="site-settings"][0].bio,[]),
    "books":*[_type=="book"]|order(order asc,_createdAt asc){${work}},
    "movies":*[_type=="movie"]|order(order asc,_createdAt asc){${work}},
    "diary":*[_type=="diary"]|order(date desc){title,date,"slug":slug.current,body,"paragraphs":[]},
    "projects":*[_type=="project"]|order(order asc,_createdAt asc){name,"description":coalesce(description,""),href}
  }`, {}, {cache:"no-store"});
}

import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
loadEnvConfig(process.cwd());
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "z9idlfz2" || process.env.NEXT_PUBLIC_SANITY_DATASET !== "production") throw new Error("Unexpected migration target");
if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error("Write token missing");
const data = JSON.parse(await readFile(".data/content.json", "utf8"));
const client = createClient({projectId,dataset:"production",token:process.env.SANITY_API_WRITE_TOKEN,apiVersion:"2025-02-19",useCdn:false});
const id = (kind,name) => `nyxel-${kind}-${createHash("sha256").update(name).digest("hex").slice(0,20)}`;
const blocks = text => text ? text.split(/\n\s*\n/).map((text,i)=>({_type:"block",_key:`p${i}`,style:"normal",markDefs:[],children:[{_type:"span",_key:`s${i}`,text,marks:[]}]})) : [];
const objects = values => (values ?? []).map((value,i)=>({...value,_key:`item${i}`}));
const docs = [];
for (const [kind,items] of [["book",data.books],["movie",data.movies]]) items.forEach((item,order)=>docs.push({
  _id:id(kind,item.name),_type:kind,name:item.name,creator:item.creator ?? "",coverUrl:item.cover,
  aspectRatio:item.aspectRatio,order,facts:objects(item.facts),...(kind === "book" ? {links:objects(item.links)} : {}),review:blocks(item.review),
}));
data.diary.forEach(entry=>docs.push({_id:id("diary",entry.slug),_type:"diary",title:entry.title,slug:{_type:"slug",current:entry.slug},date:entry.date,body:blocks(entry.paragraphs.join("\n\n"))}));
data.projects.forEach((item,order)=>docs.push({_id:id("project",item.name),_type:"project",...item,order}));
docs.push({_id:"site-settings",_type:"siteSettings",bio:data.bio});
let transaction = client.transaction();
for (const doc of docs) transaction = transaction.createIfNotExists(JSON.parse(JSON.stringify(doc)));
await transaction.commit();
const imported = await client.fetch('*[_id in $ids]{_id,_type,name}',{ids:docs.map(d=>d._id)});
if (imported.length !== docs.length) throw new Error("Import count mismatch");
console.log(JSON.stringify({projectId,documents:imported.length,books:data.books.length,movies:data.movies.length,diary:data.diary.length,projects:data.projects.length}));

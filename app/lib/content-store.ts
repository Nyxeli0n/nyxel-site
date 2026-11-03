import "server-only";
import { get, put } from "@vercel/blob";
import { createHash, randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { bio, books, movies, diary, projects } from "../content";
import { contentSchema, type SiteContent } from "./content-schema";

const seed = { bio, books, movies, diary, projects };
const filename = path.join(process.cwd(), ".data", "content.json");
const blobPath = "nyxel/content.json";
export const localEditor = () => process.env.LOCAL_EDITOR === "1" && !process.env.VERCEL;
export function revision(data: SiteContent) { return createHash("sha256").update(JSON.stringify(data)).digest("hex"); }

export async function readSnapshot(): Promise<{ data: SiteContent; revision: string; etag?: string }> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await get(blobPath, { access: "private", useCache: false });
    if (!blob) return { data: seed, revision: revision(seed) };
    if (!blob.stream) throw new Error("Storage returned no content");
    const data = contentSchema.parse(await new Response(blob.stream).json());
    return { data, revision: revision(data), etag: blob.blob.etag };
  }
  if (process.env.VERCEL) return { data: seed, revision: revision(seed) };
  try {
    const data = contentSchema.parse(JSON.parse(await readFile(filename, "utf8")));
    return { data, revision: revision(data) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return { data: seed, revision: revision(seed) };
  }
}
export async function readContent() { return (await readSnapshot()).data; }
let queue = Promise.resolve();
export async function saveContent(data: SiteContent, expected: string) {
  const operation = queue.then(async () => {
    const current = await readSnapshot();
    if (current.revision !== expected) throw new Error("CONFLICT");
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put(blobPath, JSON.stringify(data), {
        access: "private", addRandomSuffix: false, contentType: "application/json",
        ...(current.etag ? { allowOverwrite: true, ifMatch: current.etag } : { allowOverwrite: false }),
      });
    } else {
      if (process.env.VERCEL) throw new Error("STORAGE_NOT_CONFIGURED");
      await mkdir(path.dirname(filename), { recursive: true });
      const temp = `${filename}.${randomUUID()}.tmp`;
      await writeFile(temp, JSON.stringify(data, null, 2), "utf8");
      await rename(temp, filename);
    }
    return revision(data);
  });
  queue = operation.then(() => {}, () => {});
  return operation;
}

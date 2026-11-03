import { z } from "zod";

const text = z.string().max(200000);
const url = z.string().url().refine(value => value.startsWith("https://"), "HTTPSのURLを入力してください");
const favorite = z.object({
  name: z.string().min(1).max(300), creator: text.optional(), href: url.optional(),
  note: text.optional(), cover: url.optional(), color: z.string().regex(/^#[a-fA-F0-9]{3,8}$/).optional(),
  aspectRatio: z.string().regex(/^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/).optional(),
  summary: text.optional(), review: text.optional(),
  facts: z.array(z.object({ label: text, value: text })).max(50).optional(),
  links: z.array(z.object({ label: z.string().min(1), href: url })).max(20).optional(),
});
export const contentSchema = z.object({
  bio: z.array(text).max(100), books: z.array(favorite).max(500), movies: z.array(favorite).max(500),
  diary: z.array(z.object({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), title: z.string().min(1).max(300), paragraphs: z.array(text).max(500) })).max(2000),
  projects: z.array(z.object({ name: z.string().min(1), description: text, href: z.string().refine(v => v === "/" || v.startsWith("https://")) })).max(500),
}).superRefine((data, ctx) => {
  const slugs = data.diary.map(entry => entry.slug);
  if (new Set(slugs).size !== slugs.length) ctx.addIssue({ code: "custom", message: "日記のURLが重複しています" });
});
export type SiteContent = z.infer<typeof contentSchema>;

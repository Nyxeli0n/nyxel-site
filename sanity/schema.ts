import { defineField, defineType, type SchemaTypeDefinition } from "sanity";

const richText = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [{ type: "block" }] });
const fact = defineType({
  name: "fact",
  title: "作品データ",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "項目",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "value",
      title: "内容",
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});
const link = defineType({
  name: "workLink",
  title: "リンク",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "表示名",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "href",
      title: "商品ページのURL",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["https"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

function work(name: "book" | "movie", title: string) {
  return defineType({
    name,
    title,
    type: "document",
    groups: [
      { name: "information", title: "作品情報" },
      { name: "review", title: "自分の感想", default: true },
    ],
    fields: [
      defineField({
        name: "name",
        title: "題名",
        type: "string",
        group: "information",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "creator",
        title: name === "book" ? "著者" : "監督",
        type: "string",
        group: "information",
      }),
      defineField({
        name: "cover",
        title: name === "book" ? "表紙" : "ポスター",
        type: "image",
        options: { hotspot: true },
        group: "information",
      }),
      defineField({
        name: "coverUrl",
        title: "既存の画像URL",
        description:
          "画像をアップロードすると、アップロード画像が優先されます。",
        type: "url",
        group: "information",
        validation: (r) => r.uri({ scheme: ["https"] }),
      }),
      defineField({
        name: "aspectRatio",
        title: "表紙の縦横比",
        type: "string",
        hidden: true,
      }),
      defineField({
        name: "facts",
        title: "作品データ",
        type: "array",
        of: [{ type: "fact" }],
        group: "information",
      }),
      ...(name === "book"
        ? [
            defineField({
              name: "links",
              title: "書店などのリンク",
              type: "array",
              of: [{ type: "workLink" }],
              group: "information",
            }),
          ]
        : []),
      defineField({
        name: "rating",
        title: "星評価",
        type: "number",
        group: "review",
        initialValue: 5,
        description: "5段階の評価。未設定の既存作品は星5で表示されます。",
        options: {
          list: [1, 2, 3, 4, 5].map((value) => ({
            title: "★".repeat(value) + "☆".repeat(5 - value),
            value,
          })),
          layout: "radio",
        },
        validation: (r) => r.integer().min(1).max(5),
      }),
      { ...richText("review", "自分の感想"), group: "review" },
      defineField({
        name: "order",
        title: "表示順",
        type: "number",
        initialValue: 0,
        group: "information",
      }),
    ],
    preview: { select: { title: "name", subtitle: "creator", media: "cover" } },
    orderings: [
      {
        title: "表示順",
        name: "order",
        by: [{ field: "order", direction: "asc" }],
      },
    ],
  });
}

export const schemaTypes: SchemaTypeDefinition[] = [
  fact,
  link,
  work("book", "本"),
  work("movie", "映画"),
  defineType({
    name: "diary",
    title: "日記",
    type: "document",
    fields: [
      defineField({
        name: "title",
        title: "タイトル",
        type: "string",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "slug",
        title: "URLの末尾",
        type: "slug",
        options: { source: "title" },
        validation: (r) => r.required(),
      }),
      defineField({
        name: "date",
        title: "日付",
        type: "date",
        validation: (r) => r.required(),
      }),
      richText("body", "本文"),
    ],
    preview: { select: { title: "title", subtitle: "date" } },
  }),
  defineType({
    name: "siteSettings",
    title: "About",
    type: "document",
    fields: [
      defineField({
        name: "bio",
        title: "自己紹介",
        type: "array",
        of: [{ type: "text", rows: 5 }],
      }),
    ],
    preview: { prepare: () => ({ title: "About" }) },
  }),
];

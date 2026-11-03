"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { jaJPLocale } from "@sanity/locale-ja-jp";
import { schemaTypes } from "./sanity/schema";

export default defineConfig({
  name: "nyxel",
  title: "Nyxel",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    jaJPLocale(),
    structureTool({
      structure: (S) =>
        S.list()
          .id("content")
          .title("コンテンツ")
          .items([
            S.documentTypeListItem("book").title("本"),
            S.documentTypeListItem("movie").title("映画"),
            S.documentTypeListItem("diary").title("日記"),
            S.listItem()
              .title("About")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("site-settings"),
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});

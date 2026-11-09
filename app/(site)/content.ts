import type { PortableTextBlock } from "@portabletext/react";
export type Favorite = {
  name: string;
  creator?: string;
  href?: string;
  note?: string;
  cover?: string;
  color?: string;
  aspectRatio?: string;
  review?: string;
  rating?: number;
  reviewBlocks?: PortableTextBlock[];
  facts?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
};
export type DiaryEntry = {
  slug: string;
  date: string;
  title: string;
  paragraphs: string[];
  body?: PortableTextBlock[];
};

export const bio: string[] = [];
export type Favorite = { name: string; creator?: string; href?: string; note?: string };
export const books: Favorite[] = [];
export const movies: Favorite[] = [
  { name: "2001: A Space Odyssey" },
];
export type DiaryEntry = { slug: string; date: string; title: string; paragraphs: string[] };
export const diary: DiaryEntry[] = [];
export const projects = [
  { name: "NEXT", description: "Apple Reminders, one task at a time", href: "https://github.com/Nyxeli0n/NEXT" },
  { name: "Infinite Life", description: "macOS cellular automaton wallpaper", href: "https://github.com/Nyxeli0n/InfiniteLife" },
  { name: "nyxelion.dev", description: "Personal website", href: "/" },
];

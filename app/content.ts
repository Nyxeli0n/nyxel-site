export const bio: string[] = [];
export type Favorite = { name: string; creator?: string; href?: string; note?: string; cover?: string; color?: string };
export const books: Favorite[] = [];
export const movies: Favorite[] = [
  { name: "2001: A Space Odyssey", cover: "https://irs.www.warnerbros.com/keyart-jpeg/movies/media/browser/2001_a_space_odyssey_2000x3000.jpg", href: "https://www.warnerbros.com/movies/2001-space-odyssey" },
];
export type DiaryEntry = { slug: string; date: string; title: string; paragraphs: string[] };
export const diary: DiaryEntry[] = [];
export const projects = [
  { name: "NEXT", description: "Apple Reminders, one task at a time", href: "https://github.com/Nyxeli0n/NEXT" },
  { name: "Infinite Life", description: "macOS cellular automaton wallpaper", href: "https://github.com/Nyxeli0n/InfiniteLife" },
  { name: "nyxelion.dev", description: "Personal website", href: "/" },
];

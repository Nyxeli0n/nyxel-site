export const bio: string[] = [];
export type Favorite = { name: string; creator?: string; href?: string; note?: string; cover?: string; color?: string; aspectRatio?: string };
export const books: Favorite[] = [
  {
    name: "ハッカーと画家",
    aspectRatio: "600 / 854",
    creator: "ポール・グレアム",
    cover: "https://www.ohmsha.co.jp/Portals/0/book/large/978-4-274-06597-2.jpg",
    href: "https://www.ohmsha.co.jp/book/9784274065972.html",
  },
  {
    name: "デューン 砂の惑星〔新訳版〕 上",
    aspectRatio: "1727 / 2560",
    creator: "フランク・ハーバート",
    cover: "https://www.hayakawa-online.co.jp/img/goods/L/613862.jpg",
    href: "https://www.hayakawa-online.co.jp/shop/g/g0000012049/",
  },
  {
    name: "シミュラークルとシミュレーション",
    aspectRatio: "378 / 561",
    creator: "ジャン・ボードリヤール",
    cover: "https://img.hanmoto.com/bd/img/9784588099113_600.jpg",
    href: "https://www.hanmoto.com/bd/isbn/9784588099113",
  },
];
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

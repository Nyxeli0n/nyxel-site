export const bio: string[] = [];
export type Favorite = { name: string; creator?: string; href?: string; note?: string; cover?: string; color?: string; aspectRatio?: string; review?: string; facts?: { label: string; value: string }[]; links?: { label: string; href: string }[] };
export const books: Favorite[] = [
  {
    name: "ハッカーと画家",
    facts: [{ label: "出版社", value: "オーム社" }, { label: "ISBN", value: "9784274065972" }],
    links: [{ label: "出版社", href: "https://www.ohmsha.co.jp/book/9784274065972.html" }, { label: "Amazon", href: "https://www.amazon.co.jp/s?k=9784274065972" }],
    aspectRatio: "600 / 854",
    creator: "ポール・グレアム",
    cover: "https://www.ohmsha.co.jp/Portals/0/book/large/978-4-274-06597-2.jpg",
    href: "https://www.ohmsha.co.jp/book/9784274065972.html",
  },
  {
    name: "デューン 砂の惑星",
    facts: [{ label: "出版社", value: "早川書房" }, { label: "シリーズ", value: "ハヤカワ文庫SF" }],
    links: [{ label: "出版社", href: "https://www.hayakawa-online.co.jp/shop/g/g0000012049/" }, { label: "Amazon", href: "https://www.amazon.co.jp/s?k=DUNE+%E3%83%95%E3%83%A9%E3%83%B3%E3%82%AF%E3%83%BB%E3%83%8F%E3%83%BC%E3%83%90%E3%83%BC%E3%83%88" }],
    aspectRatio: "1727 / 2560",
    creator: "フランク・ハーバート",
    cover: "https://www.hayakawa-online.co.jp/img/goods/L/613862.jpg",
    href: "https://www.hayakawa-online.co.jp/shop/g/g0000012049/",
  },
  {
    name: "シミュラークルとシミュレーション",
    facts: [{ label: "出版社", value: "法政大学出版局" }, { label: "訳者", value: "竹原あき子" }, { label: "ISBN", value: "9784588099113" }],
    links: [{ label: "書誌情報", href: "https://www.hanmoto.com/bd/isbn/9784588099113" }, { label: "Amazon", href: "https://www.amazon.co.jp/s?k=9784588099113" }],
    aspectRatio: "378 / 561",
    creator: "ジャン・ボードリヤール",
    cover: "https://img.hanmoto.com/bd/img/9784588099113_600.jpg",
    href: "https://www.hanmoto.com/bd/isbn/9784588099113",
  },
];
export const movies: Favorite[] = [
  { name: "2001: A Space Odyssey", creator: "スタンリー・キューブリック", facts: [{ label: "公開年", value: "1968" }], cover: "https://irs.www.warnerbros.com/keyart-jpeg/movies/media/browser/2001_a_space_odyssey_2000x3000.jpg" },
];
export type DiaryEntry = { slug: string; date: string; title: string; paragraphs: string[] };
export const diary: DiaryEntry[] = [];
export const projects = [
  { name: "NEXT", description: "Apple Reminders, one task at a time", href: "https://github.com/Nyxeli0n/NEXT" },
  { name: "Infinite Life", description: "macOS cellular automaton wallpaper", href: "https://github.com/Nyxeli0n/InfiniteLife" },
  { name: "nyxelion.dev", description: "Personal website", href: "/" },
];

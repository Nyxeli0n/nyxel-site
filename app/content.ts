export const bio: string[] = [];
export type Favorite = { name: string; creator?: string; href?: string; note?: string; cover?: string; color?: string; aspectRatio?: string; summary?: string; review?: string; facts?: { label: string; value: string }[]; links?: { label: string; href: string }[] };
export const books: Favorite[] = [
  {
    name: "ハッカーと画家",
    summary: "プログラミング、創造、起業をめぐるポール・グレアムのエッセイ集。",
    facts: [{ label: "出版社", value: "オーム社" }, { label: "ISBN", value: "9784274065972" }],
    links: [{ label: "出版社", href: "https://www.ohmsha.co.jp/book/9784274065972.html" }, { label: "Amazon", href: "https://www.amazon.co.jp/s?k=9784274065972" }],
    aspectRatio: "600 / 854",
    creator: "ポール・グレアム",
    cover: "https://www.ohmsha.co.jp/Portals/0/book/large/978-4-274-06597-2.jpg",
    href: "https://www.ohmsha.co.jp/book/9784274065972.html",
  },
  {
    name: "デューン 砂の惑星〔新訳版〕 上",
    summary: "砂漠の惑星アラキスを舞台に、ポール・アトレイデスの運命を描くSF小説。新訳版の上巻。",
    facts: [{ label: "出版社", value: "早川書房" }, { label: "シリーズ", value: "ハヤカワ文庫SF" }, { label: "ISBN", value: "9784150120498" }],
    links: [{ label: "出版社", href: "https://www.hayakawa-online.co.jp/shop/g/g0000012049/" }, { label: "Amazon", href: "https://www.amazon.co.jp/s?k=9784150120498" }],
    aspectRatio: "1727 / 2560",
    creator: "フランク・ハーバート",
    cover: "https://www.hayakawa-online.co.jp/img/goods/L/613862.jpg",
    href: "https://www.hayakawa-online.co.jp/shop/g/g0000012049/",
  },
  {
    name: "シミュラークルとシミュレーション",
    summary: "記号、イメージ、メディアと現実の関係を論じるジャン・ボードリヤールの著作。",
    facts: [{ label: "出版社", value: "法政大学出版局" }, { label: "訳者", value: "竹原あき子" }, { label: "ISBN", value: "9784588099113" }],
    links: [{ label: "書誌情報", href: "https://www.hanmoto.com/bd/isbn/9784588099113" }, { label: "Amazon", href: "https://www.amazon.co.jp/s?k=9784588099113" }],
    aspectRatio: "378 / 561",
    creator: "ジャン・ボードリヤール",
    cover: "https://img.hanmoto.com/bd/img/9784588099113_600.jpg",
    href: "https://www.hanmoto.com/bd/isbn/9784588099113",
  },
];
export const movies: Favorite[] = [
  { name: "2001: A Space Odyssey", creator: "スタンリー・キューブリック", summary: "人類の起源から宇宙探査へ。謎の物体モノリスをめぐる、人類と宇宙の物語。", facts: [{ label: "公開年", value: "1968" }], links: [{ label: "公式サイト", href: "https://www.warnerbros.com/movies/2001-space-odyssey" }, { label: "Amazon", href: "https://www.amazon.co.jp/s?k=2001%E5%B9%B4%E5%AE%87%E5%AE%99%E3%81%AE%E6%97%85" }], cover: "https://irs.www.warnerbros.com/keyart-jpeg/movies/media/browser/2001_a_space_odyssey_2000x3000.jpg", href: "https://www.warnerbros.com/movies/2001-space-odyssey" },
];
export type DiaryEntry = { slug: string; date: string; title: string; paragraphs: string[] };
export const diary: DiaryEntry[] = [];
export const projects = [
  { name: "NEXT", description: "Apple Reminders, one task at a time", href: "https://github.com/Nyxeli0n/NEXT" },
  { name: "Infinite Life", description: "macOS cellular automaton wallpaper", href: "https://github.com/Nyxeli0n/InfiniteLife" },
  { name: "nyxelion.dev", description: "Personal website", href: "/" },
];

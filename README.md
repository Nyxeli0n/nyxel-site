# nyxelion.dev

Nyxelの個人サイトです。

## 内容の更新

文章・作品・日記は `app/content.ts` にまとめています。空欄の項目には何も表示しません。

- `bio`: ホームとAboutに表示する文章。配列の要素ごとに段落になります。
- `projects`: 制作物。名前・説明・リンクを記載します。表示順に01から自動で番号を振ります。
- `books` / `movies`: `name`（作品名）、任意で `creator`（著者・監督）、`note`（感想）、`href`（リンク）。
- `diary`: `slug`（URL用の半角英数字とハイフン）、`date`（YYYY-MM-DD）、`title`、`paragraphs`（本文の段落）。新しい日付順に表示します。slugは重複させないでください。

例（実際のサイトには登録していません）:

```ts
export const bio: string[] = ["自己紹介の一文"];
export const books: Favorite[] = [
  { name: "作品名", creator: "著者名", note: "短い感想" },
];
export const diary: DiaryEntry[] = [
  { slug: "first-entry", date: "2026-11-03", title: "タイトル", paragraphs: ["本文"] },
];
```

GitHubでこのファイルを開き、鉛筆ボタンから編集できます。変更用のブランチで保存し、プレビューを確認してからmainに反映してください。VercelのGit連携が有効なら、設定された公開ブランチへの変更が自動公開されます。

## 手元で確認

```sh
npm ci
npm run dev
```

表示されたlocalhostのURLを開きます。公開前の確認は `npm run build` です。

## 見た目とフォント

既存の色・幅・余白・Geist Sans（見出し）/ Geist Mono（本文）・テーマ切り替え・一覧の線のアニメーションを維持しています。フォントは同梱し、ライセンスは `app/fonts/OFL.txt` に含めています。

Geistに含まれない文字（日本語など）はブラウザの代替フォントで表示されます。Geistだけで描画するには、掲載文をGeistの対応文字で記述してください。

外部のテンプレートやshadcn/uiのコードはこの変更では追加していません。新たに取り込む場合は、各配布元のライセンスを確認し、必要な著作権・許諾表示を同梱してください。

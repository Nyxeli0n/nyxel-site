# nyxelion.dev

Next.js / TypeScript / Geistで表示し、Sanityでコンテンツを管理する個人サイトです。公開先は既存のVercelプロジェクト `nyxelion/nyxel-site` です。

## 普段の更新

`/studio` を開き、Sanityに登録したGitHubアカウントでログインします。以前の `/admin` からも自動的に移動します。

- 本・映画：作品を選び、「自分の感想」に文章を書きます。「作品情報」で題名、著者・監督、表紙画像、データを変更できます。本のみ商品ページへのリンクを登録できます。
- 日記：タイトル、URLの末尾、日付、本文を入力します。
- Projects：名前、説明、URL、表示順を変更します。番号は表示順に01から自動採番します。
- About：自己紹介を編集します。ホームには紹介文を表示しません。

編集中の内容はSanityの下書きとして保存されます。「公開」を押したものだけがサイトに出ます。既に開いているサイトは再読み込みすると更新されます。本文は見出し・太字・箇条書きなどを使えます。画像はアップロード画像を優先し、未設定なら既存の画像URLを表示します。

映画には外部リンクを表示しません。AIが作成した紹介文もありません。DUNEは全体をひとつの作品として扱い、上巻の表紙を代表にしています。本棚・ポスターのアニメーションとモーダルの左右配置は維持しています。

## 構成

- `app/(site)`：公開サイト。元のURLは変えていません。
- `app/(studio)`：Sanity Studio。公開サイトとレイアウトやCSSを分けています。
- `sanity/schema.ts`：管理画面の項目定義。
- `sanity.config.ts`：Studioの構成。日本語表示を使います。
- `app/(site)/lib/content-store.ts`：Sanityから公開済みデータだけを取得します。書き込み機能はありません。

以前の独自ログイン、署名Cookie、編集フォーム、書き込みAPI、Vercel Blob保存処理は削除しました。認証・編集権限・下書き・公開・画像管理はSanityが担当します。書き込みトークンは初回移行スクリプトでのみ使用し、ブラウザには渡しません。

## 初回設定

Vercel MarketplaceのSanity無料プランを既存プロジェクトに接続済みです。SanityのプロジェクトIDは `z9idlfz2`、データセットは `production` です。

Studioにログインするには、SanityアカウントにGitHubなどのログイン方法を関連付けます。管理画面を開くOriginをSanityのAPI設定で許可する必要があります。手元では `http://localhost:3000`、本番では実際に公開するサイトのOriginを、それぞれAllow credentials付きで登録します。ワイルドカードは使いません。プロジェクトのログイン・権限管理はSanity標準機能を使います。

環境変数はVercelから取得します。

```sh
vercel env pull .env.local --yes
npm ci
npm run dev
```

Node.jsはVercelと同じ24系を使用します。環境変数は `.env.example` を参照してください。秘密のトークンをGitへ保存したり、`NEXT_PUBLIC_` で始まる変数へ入れたりしないでください。

## 移行とバックアップ

既存の本3冊、映画1本、Projects3件、AboutをSanityへ移行しました。日記は未登録です。旧ローカル保存ファイル `.data/content.json` はバックアップとして残しています。現在のサイトはこのファイルを読み書きしません。

移行スクリプトは `npm run content:import` です。接続先を確認し、同じIDがある場合は上書きしません。通常の執筆には使いません。以後の原本はSanity側です。

## 確認

```sh
npm run build
npm run lint
```

Sanityの実データが表示されること、旧書き込みAPIが404になること、`/admin` が `/studio` へ移動すること、下書きが公開ページに出ないことを確認しています。Studioで本人がログインして編集・公開する操作は、接続Originの許可後に確認します。

## アセットとライセンス

GeistのSIL Open Font Licenseは `app/(site)/fonts/OFL.txt` に同梱しています。欧文はGeist、日本語はOSのゴシック体で表示します。本の立体表現はGeist Bookの外観を参考にした独立実装で、Vercelのコンポーネント実装やブランドマークはコピーしていません。モーダルはRadix UI Dialogです。Sanityと依存ライブラリは各npmパッケージのライセンスに従います。

本の書影はオーム社、早川書房、版元ドットコムの掲載画像を参照し、映画ポスターはWarner Bros.の公式掲載画像を参照しています。権利は各権利者に帰属します。外部画像の配信は各配信元に依存します。

# ミューレコ（Muureco）

好きなアーティストから音楽性を診断し、おすすめアーティストを表示する音楽レコメンドサービス。

## 概要

ユーザーが入力したアーティストをもとに、Last.fm API からタグ情報を集計して音楽性を診断し、類似アーティストをおすすめとして表示します。おすすめアーティストの試聴音源は iTunes Search API から取得します。

**公開URL**: [https://muureco.yyoshidaweb.workers.dev](https://muureco.yyoshidaweb.workers.dev)

## 技術スタック

| レイヤ | 選定 |
|--------|------|
| フロント | Next.js（App Router）+ TypeScript + Tailwind CSS |
| バックエンド | Next.js Route Handler（BFF） |
| 外部 API | [Last.fm API](https://www.last.fm/api)（BFF 経由）、[iTunes Search API](https://performance-partners.apple.com/search-api)（試聴音源。ブラウザから直接） |
| デプロイ | Cloudflare Workers（[@opennextjs/cloudflare](https://opennext.js.org/cloudflare)） |

## 開発環境のセットアップ

### 必要条件

- Node.js 20 以上
- npm

### インストール

```bash
git clone https://github.com/yyoshidaweb/muureco.git
cd muureco
npm install
```

### 環境変数

`.env.local` をプロジェクトルートに作成します。

```bash
LASTFM_API_KEY=your_api_key
```

API キーは [Last.fm API アカウント作成](https://www.last.fm/api/account/create) から取得できます。BFF 経由でのみ使用し、クライアントには露出しません。

iTunes Search API は認証不要のため設定は要りません。ただし呼び出し回数の上限（およそ 20 回/分）が IP 単位で効きます。Cloudflare Workers の外向き通信は他の Worker と IP を共有していて常に上限を超えているため、この API はブラウザから直接呼び出します。上限に達している間は試聴ボタンが表示されません。

Workers ランタイムでのローカルプレビュー用には、`.dev.vars.example` を `.dev.vars` にコピーして同じ値を設定します。

```bash
cp .dev.vars.example .dev.vars
# .dev.vars の各値を編集
```

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3001](http://localhost:3001) を開いて確認します（他プロジェクトとのポート競合を避けるため、本プロジェクトは3001番を使用します）。

## Cloudflareへのデプロイ

前提: Cloudflareアカウントがあり、ローカルで `npx wrangler login` 済みであること。

### 本番シークレット

```bash
npx wrangler secret put LASTFM_API_KEY
```

値はプロンプト入力で設定し、Issue・PR・コミットには書かないでください。

### ビルド・プレビュー・デプロイ

```bash
# Workers ランタイムでのローカルプレビュー（本番相当）
npm run preview

# 本番デプロイ
npm run deploy
```

`workers.dev` のURLは `{Worker名}.{アカウントのサブドメイン}.workers.dev` 形式です（本番は `muureco.yyoshidaweb.workers.dev`）。

### Workers Buildsでの自動デプロイ

[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) でリポジトリと Cloudflare を直接連携しているため、`main` ブランチへのマージで自動的にビルド・デプロイされます。GitHub 側にデプロイ用のAPIトークンを保存する必要はありません。

Cloudflare ダッシュボードの Worker → **Settings** → **Builds** で次を設定します。

| 項目 | 値 |
|------|-----|
| Production branch | `main` |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Non-production branch deploy command | `npx opennextjs-cloudflare upload` |
| Builds for non-production branches | 有効 |

Next.js のビルド成果物を Workers 向けに変換する必要があるため、ビルドは `next build` ではなく `opennextjs-cloudflare build` を実行します。デプロイ側の `deploy` / `upload` は再ビルドせず、キャッシュの配置と `wrangler deploy` / `wrangler versions upload` の実行のみを行います。

非本番ブランチビルドを有効にしているため、PR にはブランチごとの[プレビューURL](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)がコメントされます（`wrangler.jsonc` の `preview_urls: true` が必要）。

Node.js のバージョンは [`.node-version`](.node-version) で固定しています。

テストは Workers Builds では実行されません。PR時の `npm run test:ci` は [`.github/workflows/ci.yml`](.github/workflows/ci.yml) が担当します。

### 本番での注意

- `LASTFM_API_KEY` は Cloudflare のシークレットとしてのみ保持し、クライアントバンドルには含めません

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動（ポート3001） |
| `npm run build` | Next.js 本番ビルド |
| `npm run preview` | OpenNext ビルド後、Workers ランタイムでローカルプレビュー |
| `npm run deploy` | OpenNext ビルド後、Cloudflare Workers へデプロイ |
| `npm run start` | Next.js 本番サーバーを起動 |
| `npm run lint` | ESLint を実行 |
| `npm run test` / `npm run test:ci` | Vitest を実行 |

## 開発フロー

[GitHub Flow](https://docs.github.com/ja/get-started/using-github/github-flow) を採用しています。

- `main` ブランチへの直接プッシュは禁止
- 作業は `main` から作業用ブランチを切って PR 経由でマージ
- コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) に従う

## ライセンス

本リポジトリのコードの著作権は作者に帰属します。
許可なく複製・改変・再配布・商用利用することを禁止します。

## クレジット

開発：[@yyoshidaweb](https://piku.page/@yyoshidaweb)

データ提供元：[Last.fm](https://www.last.fm/)（非公式・非提携。API を利用しています）

試聴音源：Provided courtesy of iTunes（非公式・非提携。iTunes Search API を利用しています）

Apple and Apple Music are trademarks of Apple Inc., registered in the U.S. and other countries.

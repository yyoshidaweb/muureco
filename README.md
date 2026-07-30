# ミューレコ（Muureco）

好きなアーティストから音楽性を診断し、おすすめアーティストを表示する音楽レコメンドサービス。

## 概要

ユーザーが入力したアーティストをもとに、Last.fm API からタグ情報を集計して音楽性を診断し、類似アーティストをおすすめとして表示します。

**公開URL**: [https://muureco.yyoshidaweb.workers.dev](https://muureco.yyoshidaweb.workers.dev)

## 技術スタック

| レイヤ | 選定 |
|--------|------|
| フロント | Next.js（App Router）+ TypeScript + Tailwind CSS |
| バックエンド | Next.js Route Handler（BFF） |
| 外部 API | [Last.fm API](https://www.last.fm/api) |
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

API キーは [Last.fm API アカウント作成](https://www.last.fm/api/account/create) から取得できます。`api_key` は BFF 経由でのみ使用し、クライアントには露出しません。

Workers ランタイムでのローカルプレビュー用には、`.dev.vars.example` を `.dev.vars` にコピーして同じキーを設定します。

```bash
cp .dev.vars.example .dev.vars
# .dev.vars の LASTFM_API_KEY を編集
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

### GitHub Actionsでの自動デプロイ

`main` ブランチへのマージ時に [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) が `npm run deploy` を実行します。

リポジトリの **Settings** → **Secrets and variables** → **Actions** に次を登録してください。

| Secret | 説明 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Workers デプロイ用APIトークン（[作成手順](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)） |
| `CLOUDFLARE_ACCOUNT_ID` | CloudflareアカウントID（`npx wrangler whoami` で確認） |
| `LASTFM_API_KEY` | デプロイ時の `wrangler` 検証用（本番ランタイムは Cloudflare 側のシークレットを使用） |

APIトークンには最低限 **Account** の **Workers Scripts: Edit** 権限が必要です。デプロイ workflow は **Node.js 22** で実行します（Wrangler 4.x の要件）。

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

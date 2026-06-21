# ミューレコ（Muureco）

好きなアーティストから音楽性を診断し、おすすめアーティストを表示する音楽レコメンドサービス。

## 概要

ユーザーが入力したアーティストをもとに、Last.fm API からタグ情報を集計して音楽性を診断し、類似アーティストをおすすめとして表示します。

## 技術スタック

| レイヤ | 選定 |
|--------|------|
| フロント | Next.js（App Router）+ TypeScript + Tailwind CSS |
| バックエンド | Next.js Route Handler（BFF） |
| 外部 API | [Last.fm API](https://www.last.fm/api) |
| デプロイ | Cloudflare（Workers / Pages + OpenNext）想定 |

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

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いて確認します。

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバーを起動 |
| `npm run lint` | ESLint を実行 |

## 開発フロー

[GitHub Flow](https://docs.github.com/ja/get-started/using-github/github-flow) を採用しています。

- `main` ブランチへの直接プッシュは禁止
- 作業は `main` から作業用ブランチを切って PR 経由でマージ
- コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) に従う

## ライセンス

本リポジトリのコードの著作権は作者に帰属します。
許可なく複製・改変・再配布・商用利用することを禁止します。

## クレジット

Powered by [Last.fm](https://www.last.fm/)

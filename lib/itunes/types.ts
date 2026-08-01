export type ItunesArtist = {
  id: number;
  name: string;
};

export type ItunesTrack = {
  name: string;
  /** 30秒のプレビュー音源。 */
  previewUrl: string;
  /** ストアで曲を購入できるページ。試聴を出す条件として併記が必要。 */
  viewUrl: string;
};

/** 画面が試聴に使う情報。取得できなかったアーティストには付かない。 */
export type ArtistPreview = {
  /** 30秒のプレビュー音源。 */
  url: string;
  /** プレビュー音源の曲名。 */
  trackName: string;
  /** ストアで曲を購入できるページ。試聴の近くに導線として置く。 */
  storeUrl: string;
};

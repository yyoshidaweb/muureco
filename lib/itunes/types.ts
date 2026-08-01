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

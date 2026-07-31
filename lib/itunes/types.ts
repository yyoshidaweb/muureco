export type ItunesArtist = {
  id: number;
  name: string;
};

export type ItunesTrack = {
  name: string;
  /** 30秒のプレビュー音源。 */
  previewUrl: string;
};

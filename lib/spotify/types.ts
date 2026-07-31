export type SpotifyArtist = {
  id: string;
  name: string;
  imageUrl?: string;
  /**
   * 試聴に使う代表曲。Spotify は再生数などの人気度を返さなくなったため、
   * 検索結果のうちこのアーティストの曲として最上位に来たものを採用する。
   */
  topTrackId?: string;
};

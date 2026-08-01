export type DiagnosisTag = {
  name: string;
  score: number;
};

export type RecommendationPreview = {
  /** 30秒のプレビュー音源。 */
  url: string;
  /** プレビュー音源の曲名。再生中の表示に使う。 */
  trackName: string;
  /** ストアで曲を購入できるページ。試聴の近くに導線として置く。 */
  storeUrl: string;
};

export type Recommendation = {
  name: string;
  score: number;
  mbid?: string;
  /** 取得できなかったときは試聴させない。 */
  preview?: RecommendationPreview;
};

export type DiagnoseResult = {
  diagnosis: DiagnosisTag[];
  recommendations: Recommendation[];
};

export type DiagnoseRequest = {
  artists: string[];
};

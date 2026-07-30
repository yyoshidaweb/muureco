export type DiagnosisTag = {
  name: string;
  score: number;
  url: string;
};

export type Recommendation = {
  name: string;
  score: number;
  url: string;
  mbid?: string;
  imageUrl?: string;
};

export type DiagnoseResult = {
  diagnosis: DiagnosisTag[];
  recommendations: Recommendation[];
};

export type DiagnoseRequest = {
  artists: string[];
};

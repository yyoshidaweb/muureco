export type DiagnosisTag = {
  name: string;
  score: number;
};

export type Recommendation = {
  name: string;
  score: number;
  url: string;
  mbid?: string;
};

export type DiagnoseResult = {
  diagnosis: DiagnosisTag[];
  recommendations: Recommendation[];
};

export type DiagnoseRequest = {
  artists: string[];
};

export type LastfmArtist = {
  name: string;
  mbid: string;
  url: string;
  listeners?: number;
};

export type LastfmTag = {
  name: string;
  url: string;
  count: number;
};

export type LastfmSimilarArtist = {
  name: string;
  mbid?: string;
  match: number;
  url: string;
};

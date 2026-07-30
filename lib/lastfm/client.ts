import { LastfmApiError, LastfmConfigError } from "./errors";
import type { LastfmArtist, LastfmSimilarArtist, LastfmTag } from "./types";

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

type RawArtist = {
  name: string;
  mbid?: string;
  url: string;
  listeners?: string;
};

type RawTag = {
  name: string;
  url: string;
  count?: string;
};

type RawImage = {
  size: string;
  "#text": string;
};

type RawSimilarArtist = {
  name: string;
  mbid?: string;
  match: string;
  url: string;
  image?: RawImage[];
};

type LastfmErrorResponse = {
  error: number;
  message: string;
};

type SearchResponse = {
  results: {
    artistmatches: {
      artist?: RawArtist | RawArtist[];
    };
  };
};

type TopTagsResponse = {
  toptags: {
    tag?: RawTag | RawTag[];
  };
};

type SimilarResponse = {
  similarartists: {
    artist?: RawSimilarArtist | RawSimilarArtist[];
  };
};

function getApiKey(): string {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    throw new LastfmConfigError("LASTFM_API_KEY is not set");
  }
  return apiKey;
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function mapArtist(raw: RawArtist): LastfmArtist {
  return {
    name: raw.name,
    mbid: raw.mbid ?? "",
    url: raw.url,
    listeners: raw.listeners ? Number(raw.listeners) : undefined,
  };
}

function mapTag(raw: RawTag): LastfmTag {
  return {
    name: raw.name,
    url: raw.url,
    count: raw.count ? Number(raw.count) : 0,
  };
}

const IMAGE_SIZE_PRIORITY = [
  "large",
  "medium",
  "extralarge",
  "mega",
  "small",
] as const;

/** Last.fm API returns this star placeholder for all artist images (ToS; real art not provided). */
const LASTFM_PLACEHOLDER_IMAGE_HASH = "2a96cbd8b46e442fc41c2b86b821562f";

function isUsableImageUrl(url: string): boolean {
  return Boolean(url) && !url.includes(LASTFM_PLACEHOLDER_IMAGE_HASH);
}

function pickImageUrl(images: RawImage[] | undefined): string | undefined {
  if (!images?.length) {
    return undefined;
  }

  for (const size of IMAGE_SIZE_PRIORITY) {
    const found = images.find(
      (img) => img.size === size && isUsableImageUrl(img["#text"]),
    );
    if (found) {
      return found["#text"];
    }
  }

  const fallback = images.find((img) => isUsableImageUrl(img["#text"]));
  return fallback?.["#text"];
}

function mapSimilarArtist(raw: RawSimilarArtist): LastfmSimilarArtist {
  return {
    name: raw.name,
    mbid: raw.mbid || undefined,
    match: Number(raw.match),
    url: raw.url,
    imageUrl: pickImageUrl(raw.image),
  };
}

async function callApi<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("format", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new LastfmApiError(
      response.status,
      `Last.fm API request failed with HTTP ${response.status}`,
    );
  }

  const data: T | LastfmErrorResponse = await response.json();

  if (typeof data === "object" && data !== null && "error" in data) {
    const error = data as LastfmErrorResponse;
    throw new LastfmApiError(error.error, error.message);
  }

  return data;
}

export type SearchArtistOptions = {
  limit?: number;
  page?: number;
};

export async function searchArtist(
  name: string,
  options: SearchArtistOptions = {},
): Promise<LastfmArtist[]> {
  const params: Record<string, string> = {
    method: "artist.search",
    artist: name,
  };

  if (options.limit !== undefined) {
    params.limit = String(options.limit);
  }
  if (options.page !== undefined) {
    params.page = String(options.page);
  }

  const data = await callApi<SearchResponse>(params);
  return asArray(data.results?.artistmatches?.artist).map(mapArtist);
}

export type GetArtistTopTagsOptions = {
  mbid?: string;
  autocorrect?: boolean;
};

export async function getArtistTopTags(
  artist: string,
  options: GetArtistTopTagsOptions = {},
): Promise<LastfmTag[]> {
  const params: Record<string, string> = {
    method: "artist.gettoptags",
    artist,
  };

  if (options.mbid) {
    params.mbid = options.mbid;
  }
  if (options.autocorrect !== undefined) {
    params.autocorrect = options.autocorrect ? "1" : "0";
  }

  const data = await callApi<TopTagsResponse>(params);
  return asArray(data.toptags?.tag).map(mapTag);
}

export type GetSimilarArtistsOptions = {
  limit?: number;
  mbid?: string;
  autocorrect?: boolean;
};

export async function getSimilarArtists(
  artist: string,
  options: GetSimilarArtistsOptions = {},
): Promise<LastfmSimilarArtist[]> {
  const params: Record<string, string> = {
    method: "artist.getsimilar",
    artist,
  };

  if (options.limit !== undefined) {
    params.limit = String(options.limit);
  }
  if (options.mbid) {
    params.mbid = options.mbid;
  }
  if (options.autocorrect !== undefined) {
    params.autocorrect = options.autocorrect ? "1" : "0";
  }

  const data = await callApi<SimilarResponse>(params);
  return asArray(data.similarartists?.artist).map(mapSimilarArtist);
}

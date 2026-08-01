import { ItunesApiError } from "./errors";
import type { ItunesArtist, ItunesTrack } from "./types";

const BASE_URL = "https://itunes.apple.com/";
// 日本のストアを見る。アーティスト名は国に関わらず正規表記で返る一方、曲名は
// 日本語表記で返るため、再生中の表示に使う曲名の質が上がる。
const COUNTRY = "JP";
// 表記の揺れで先頭に別のアーティストが来ることがあるため、候補を数件取る。
const ARTIST_SEARCH_LIMIT = "5";
// lookup の limit はアーティストごとに効く。試聴に使うのは1曲だけだが、割り当て
// られた曲が共演者名義で返ることがあるため、数曲取って自分名義のものを選ぶ。
const TRACK_LOOKUP_LIMIT = "3";
// 上限超過は 403 と 429 のどちらでも返る。残量を知るヘッダーはない。
const RATE_LIMIT_STATUSES = new Set([403, 429]);
// 上限に当たったことを表す、こちらから投げるエラーの status。
const RATE_LIMIT_STATUS = 429;
// 上限は約20回/分。当たったあとはこの時間だけ呼び出しを止める。
const RATE_LIMIT_COOLDOWN_MS = 60_000;
/**
 * Apple は Origin 付きのリクエストにだけ CORS ヘッダーを返すが、CDN が
 * Vary: Origin を守らないため、Origin なしのリクエストが作ったキャッシュが
 * ブラウザにも返り、そのURLは最大24時間 fetch 自体が失敗する。キャッシュキーを
 * 変えると取り直せるため、失敗したときだけ付ける。
 */
const CACHE_BUSTER_PARAM = "cb";

let rateLimitedUntil = 0;

type RawResult = {
  wrapperType?: string;
  artistId?: number;
  artistName?: string;
  trackName?: string;
  previewUrl?: string;
  trackViewUrl?: string;
};

type ApiResponse = {
  results?: RawResult[];
};

async function callApi<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  if (Date.now() < rateLimitedUntil) {
    throw new ItunesApiError(
      RATE_LIMIT_STATUS,
      "Skipped iTunes Search API request while rate limited",
    );
  }

  const url = new URL(path, BASE_URL);
  url.searchParams.set("country", COUNTRY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    const retryUrl = new URL(url);
    retryUrl.searchParams.set(
      CACHE_BUSTER_PARAM,
      Math.random().toString(36).slice(2),
    );
    response = await fetch(retryUrl);
  }

  if (RATE_LIMIT_STATUSES.has(response.status)) {
    rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
  }

  if (!response.ok) {
    throw new ItunesApiError(
      response.status,
      `iTunes Search API request failed with HTTP ${response.status}`,
    );
  }

  // Content-Type が text/javascript で返ることがあるため、テキストとして受ける。
  return JSON.parse(await response.text()) as T;
}

/** 名前に一致しうるアーティストの候補を、関連度の高い順に返す。 */
export async function searchArtists(name: string): Promise<ItunesArtist[]> {
  const data = await callApi<ApiResponse>("search", {
    term: name,
    entity: "musicArtist",
    limit: ARTIST_SEARCH_LIMIT,
  });

  return (data.results ?? []).flatMap((raw) =>
    raw.artistId !== undefined && raw.artistName !== undefined
      ? [{ id: raw.artistId, name: raw.artistName }]
      : [],
  );
}

/**
 * 複数アーティストの試聴用の曲をまとめて取得する。lookup は ID をカンマ区切りで
 * 受け付けるため、アーティストが何組でもリクエストは1回で済む。
 */
export async function lookupTracks(
  artistIds: number[],
): Promise<Map<number, ItunesTrack>> {
  const tracks = new Map<number, ItunesTrack>();

  if (artistIds.length === 0) {
    return tracks;
  }

  const data = await callApi<ApiResponse>("lookup", {
    id: artistIds.join(","),
    entity: "song",
    limit: TRACK_LOOKUP_LIMIT,
  });

  for (const raw of data.results ?? []) {
    if (raw.wrapperType !== "track") {
      continue;
    }
    // ストアのページを併記できない曲は試聴に使えないため、揃っていなければ捨てる。
    if (
      raw.artistId === undefined ||
      raw.trackName === undefined ||
      raw.previewUrl === undefined ||
      raw.trackViewUrl === undefined
    ) {
      continue;
    }
    if (tracks.has(raw.artistId)) {
      continue;
    }

    tracks.set(raw.artistId, {
      name: raw.trackName,
      previewUrl: raw.previewUrl,
      viewUrl: raw.trackViewUrl,
    });
  }

  return tracks;
}

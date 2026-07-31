import { SpotifyApiError, SpotifyConfigError } from "./errors";
import type { SpotifyArtist } from "./types";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE_URL = "https://api.spotify.com/v1/";
// 期限ぎりぎりのトークンを使わないための猶予。
const TOKEN_EXPIRY_MARGIN_MS = 60_000;

type RawImage = {
  url: string;
  width: number | null;
  height: number | null;
};

type RawArtist = {
  id: string;
  name: string;
  images?: RawImage[];
};

type SearchResponse = {
  artists?: {
    items?: RawArtist[];
  };
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string> | null = null;

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new SpotifyConfigError(
      "SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET is not set",
    );
  }

  return { clientId, clientSecret };
}

async function requestAccessToken(): Promise<string> {
  const { clientId, clientSecret } = getCredentials();

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    throw new SpotifyApiError(
      response.status,
      `Spotify token request failed with HTTP ${response.status}`,
    );
  }

  const data: TokenResponse = await response.json();

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS,
  };

  return data.access_token;
}

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  // 並列に呼ばれてもトークン取得は1回で済ませる。
  pendingToken ??= requestAccessToken().finally(() => {
    pendingToken = null;
  });

  return pendingToken;
}

function pickImageUrl(images: RawImage[] | undefined): string | undefined {
  // Spotify は大きい順に返す。サムネイル用途なので最小のものを使う。
  return images?.[images.length - 1]?.url;
}

function mapArtist(raw: RawArtist): SpotifyArtist {
  return {
    id: raw.id,
    name: raw.name,
    imageUrl: pickImageUrl(raw.images),
  };
}

async function callApi<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const token = await getAccessToken();
  const url = new URL(path, API_BASE_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new SpotifyApiError(
      response.status,
      `Spotify API request failed with HTTP ${response.status}`,
    );
  }

  return response.json();
}

export async function searchArtist(
  name: string,
): Promise<SpotifyArtist | null> {
  const data = await callApi<SearchResponse>("search", {
    q: name,
    type: "artist",
    limit: "1",
  });

  const top = data.artists?.items?.[0];
  return top ? mapArtist(top) : null;
}

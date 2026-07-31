import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();

// トークンキャッシュはモジュールスコープに持つため、テストごとに読み込み直す。
async function loadClient() {
  return import("./client");
}

function tokenResponse(expiresIn = 3600) {
  return {
    ok: true,
    json: async () => ({ access_token: "test-token", expires_in: expiresIn }),
  };
}

function searchResponse(
  images: { url: string }[] = [],
  tracks: { id: string; artists?: { id: string }[] }[] = [],
) {
  return {
    ok: true,
    json: async () => ({
      artists: {
        items: [{ id: "artist-id", name: "Muse", images }],
      },
      tracks: { items: tracks },
    }),
  };
}

beforeEach(() => {
  vi.resetModules();
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
  process.env.SPOTIFY_CLIENT_ID = "test-client-id";
  process.env.SPOTIFY_CLIENT_SECRET = "test-client-secret";
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SPOTIFY_CLIENT_ID;
  delete process.env.SPOTIFY_CLIENT_SECRET;
});

describe("searchArtist", () => {
  it("requests a token and returns the matched artist", async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(
        searchResponse(
          [
            { url: "https://i.scdn.co/image/large" },
            { url: "https://i.scdn.co/image/small" },
          ],
          [{ id: "track-id", artists: [{ id: "artist-id" }] }],
        ),
      );

    const { searchArtist } = await loadClient();
    const artist = await searchArtist("Muse");

    expect(artist).toEqual({
      id: "artist-id",
      name: "Muse",
      // サムネイル用途なので最小の画像を選ぶ。
      imageUrl: "https://i.scdn.co/image/small",
      topTrackId: "track-id",
    });

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "https://accounts.spotify.com/api/token",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Basic ${btoa("test-client-id:test-client-secret")}`,
        }),
      }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        href: "https://api.spotify.com/v1/search?q=Muse&type=artist%2Ctrack&limit=5",
      }),
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      }),
    );
  });

  it("returns null when no artist matches", async () => {
    mockFetch.mockResolvedValueOnce(tokenResponse()).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ artists: { items: [] } }),
    });

    const { searchArtist } = await loadClient();

    expect(await searchArtist("Unknown Artist")).toBeNull();
  });

  it("omits imageUrl when the artist has no images", async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(searchResponse());

    const { searchArtist } = await loadClient();
    const artist = await searchArtist("Muse");

    expect(artist?.imageUrl).toBeUndefined();
  });

  it("skips tracks by other artists when picking the top track", async () => {
    mockFetch.mockResolvedValueOnce(tokenResponse()).mockResolvedValueOnce(
      searchResponse(
        [],
        [
          // 曲名がアーティスト名と同じ、別アーティストの曲。
          { id: "other-track-id", artists: [{ id: "other-artist-id" }] },
          { id: "track-id", artists: [{ id: "artist-id" }] },
        ],
      ),
    );

    const { searchArtist } = await loadClient();
    const artist = await searchArtist("Muse");

    expect(artist?.topTrackId).toBe("track-id");
  });

  it("omits topTrackId when no track belongs to the artist", async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(
        searchResponse(
          [],
          [{ id: "other-track-id", artists: [{ id: "other" }] }],
        ),
      );

    const { searchArtist } = await loadClient();
    const artist = await searchArtist("Muse");

    expect(artist?.topTrackId).toBeUndefined();
  });
});

describe("access token caching", () => {
  it("reuses the cached token for later requests", async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValue(searchResponse());

    const { searchArtist } = await loadClient();
    await searchArtist("Muse");
    await searchArtist("Portishead");

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("requests the token only once for concurrent requests", async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValue(searchResponse());

    const { searchArtist } = await loadClient();
    await Promise.all([searchArtist("Muse"), searchArtist("Portishead")]);

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("requests a new token when the cached one is about to expire", async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse(30))
      .mockResolvedValueOnce(searchResponse())
      .mockResolvedValueOnce(tokenResponse(30))
      .mockResolvedValueOnce(searchResponse());

    const { searchArtist } = await loadClient();
    await searchArtist("Muse");
    await searchArtist("Portishead");

    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
});

describe("error handling", () => {
  it("throws SpotifyConfigError when credentials are not set", async () => {
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;

    const { searchArtist } = await loadClient();

    await expect(searchArtist("Muse")).rejects.toEqual(
      expect.objectContaining({ name: "SpotifyConfigError" }),
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throws SpotifyApiError when the token request fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

    const { searchArtist } = await loadClient();

    await expect(searchArtist("Muse")).rejects.toEqual(
      expect.objectContaining({ name: "SpotifyApiError", status: 401 }),
    );
  });

  it("throws SpotifyApiError on HTTP errors from the search endpoint", async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce({ ok: false, status: 429 });

    const { searchArtist } = await loadClient();

    await expect(searchArtist("Muse")).rejects.toEqual(
      expect.objectContaining({ name: "SpotifyApiError", status: 429 }),
    );
  });
});

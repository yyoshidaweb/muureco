import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();

// 上限超過の状態はモジュールスコープに持つため、テストごとに読み込み直す。
async function loadClient() {
  return import("./client");
}

function jsonResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify(body),
  };
}

beforeEach(() => {
  vi.resetModules();
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchArtists", () => {
  it("returns the artist candidates in the order the API gives them", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        results: [
          { wrapperType: "artist", artistId: 1, artistName: "Muse" },
          { wrapperType: "artist", artistId: 2, artistName: "Muse Tribute" },
        ],
      }),
    );

    const { searchArtists } = await loadClient();

    expect(await searchArtists("Muse")).toEqual([
      { id: 1, name: "Muse" },
      { id: 2, name: "Muse Tribute" },
    ]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: "https://itunes.apple.com/search?country=JP&term=Muse&entity=musicArtist&limit=5",
      }),
    );
  });

  it("returns an empty list when nothing matches", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ results: [] }));

    const { searchArtists } = await loadClient();

    expect(await searchArtists("Unknown Artist")).toEqual([]);
  });
});

describe("lookupTracks", () => {
  it("requests every artist at once and keeps one track each", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        results: [
          { wrapperType: "artist", artistId: 1, artistName: "Muse" },
          {
            wrapperType: "track",
            artistId: 1,
            trackName: "Madness",
            previewUrl: "https://audio.example/madness.m4a",
            trackViewUrl: "https://music.example/madness",
          },
          {
            wrapperType: "track",
            artistId: 1,
            trackName: "Uprising",
            previewUrl: "https://audio.example/uprising.m4a",
            trackViewUrl: "https://music.example/uprising",
          },
          {
            wrapperType: "track",
            artistId: 2,
            trackName: "Glory Box",
            previewUrl: "https://audio.example/glory-box.m4a",
            trackViewUrl: "https://music.example/glory-box",
          },
        ],
      }),
    );

    const { lookupTracks } = await loadClient();
    const tracks = await lookupTracks([1, 2]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: "https://itunes.apple.com/lookup?country=JP&id=1%2C2&entity=song&limit=3",
      }),
    );
    expect([...tracks]).toEqual([
      [
        1,
        {
          name: "Madness",
          previewUrl: "https://audio.example/madness.m4a",
          viewUrl: "https://music.example/madness",
        },
      ],
      [
        2,
        {
          name: "Glory Box",
          previewUrl: "https://audio.example/glory-box.m4a",
          viewUrl: "https://music.example/glory-box",
        },
      ],
    ]);
  });

  it("skips tracks without a preview", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        results: [
          {
            wrapperType: "track",
            artistId: 1,
            trackName: "Madness",
            trackViewUrl: "https://music.example/madness",
          },
        ],
      }),
    );

    const { lookupTracks } = await loadClient();

    expect(await lookupTracks([1])).toEqual(new Map());
  });

  it("skips tracks without a store page", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        results: [
          {
            wrapperType: "track",
            artistId: 1,
            trackName: "Madness",
            previewUrl: "https://audio.example/madness.m4a",
          },
        ],
      }),
    );

    const { lookupTracks } = await loadClient();

    expect(await lookupTracks([1])).toEqual(new Map());
  });

  it("does not call the API without artist IDs", async () => {
    const { lookupTracks } = await loadClient();

    expect(await lookupTracks([])).toEqual(new Map());
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe("error handling", () => {
  it("throws ItunesApiError on HTTP errors", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { searchArtists } = await loadClient();

    await expect(searchArtists("Muse")).rejects.toEqual(
      expect.objectContaining({ name: "ItunesApiError", status: 500 }),
    );
  });

  it.each([403, 429])("stops calling the API after HTTP %i", async (status) => {
    mockFetch.mockResolvedValueOnce({ ok: false, status });

    const { lookupTracks, searchArtists } = await loadClient();

    await expect(searchArtists("Muse")).rejects.toEqual(
      expect.objectContaining({ name: "ItunesApiError", status }),
    );
    await expect(searchArtists("Portishead")).rejects.toEqual(
      expect.objectContaining({ name: "ItunesApiError", status: 429 }),
    );
    await expect(lookupTracks([1])).rejects.toEqual(
      expect.objectContaining({ name: "ItunesApiError", status: 429 }),
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("calls the API again once the cooldown has passed", async () => {
    vi.useFakeTimers();

    try {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 403 })
        .mockResolvedValueOnce(jsonResponse({ results: [] }));

      const { searchArtists } = await loadClient();

      await expect(searchArtists("Muse")).rejects.toEqual(
        expect.objectContaining({ status: 403 }),
      );

      vi.advanceTimersByTime(60_000);

      expect(await searchArtists("Muse")).toEqual([]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});

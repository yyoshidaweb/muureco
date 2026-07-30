import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getArtistTopTags,
  getSimilarArtists,
  searchArtist,
} from "./client";
import { LastfmConfigError } from "./errors";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  process.env.LASTFM_API_KEY = "test-api-key";
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.LASTFM_API_KEY;
});

describe("searchArtist", () => {
  it("returns parsed artists from a search response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: {
          artistmatches: {
            artist: [
              {
                name: "Radiohead",
                mbid: "a74b1b7f-71a5-3951-9631-4b915a4d59d6",
                url: "https://www.last.fm/music/Radiohead",
                listeners: "5000000",
              },
            ],
          },
        },
      }),
    });

    const artists = await searchArtist("Radiohead");

    expect(artists).toEqual([
      {
        name: "Radiohead",
        mbid: "a74b1b7f-71a5-3951-9631-4b915a4d59d6",
        url: "https://www.last.fm/music/Radiohead",
        listeners: 5000000,
      },
    ]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining("method=artist.search"),
      }),
    );
  });

  it("normalizes a single artist object into an array", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: {
          artistmatches: {
            artist: {
              name: "Bjork",
              mbid: "",
              url: "https://www.last.fm/music/Bjork",
            },
          },
        },
      }),
    });

    const artists = await searchArtist("Bjork");

    expect(artists).toHaveLength(1);
    expect(artists[0]?.name).toBe("Bjork");
  });
});

describe("getArtistTopTags", () => {
  it("returns parsed tags", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        toptags: {
          tag: [
            {
              name: "rock",
              url: "https://www.last.fm/tag/rock",
              count: "100",
            },
          ],
        },
      }),
    });

    const tags = await getArtistTopTags("Radiohead");

    expect(tags).toEqual([
      {
        name: "rock",
        url: "https://www.last.fm/tag/rock",
        count: 100,
      },
    ]);
  });
});

describe("getSimilarArtists", () => {
  it("returns parsed similar artists with numeric match scores", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        similarartists: {
          artist: [
            {
              name: "Muse",
              mbid: "123",
              match: "0.85",
              url: "https://www.last.fm/music/Muse",
            },
          ],
        },
      }),
    });

    const artists = await getSimilarArtists("Radiohead", { limit: 10 });

    expect(artists).toEqual([
      {
        name: "Muse",
        mbid: "123",
        match: 0.85,
        url: "https://www.last.fm/music/Muse",
      },
    ]);
  });
});

describe("error handling", () => {
  it("throws when LASTFM_API_KEY is not set", async () => {
    delete process.env.LASTFM_API_KEY;

    await expect(searchArtist("Radiohead")).rejects.toThrow(LastfmConfigError);
  });

  it("throws LastfmApiError when Last.fm returns an error payload", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        error: 6,
        message: "Invalid parameters",
      }),
    });

    await expect(searchArtist("Radiohead")).rejects.toEqual(
      expect.objectContaining({
        name: "LastfmApiError",
        code: 6,
        message: "Invalid parameters",
      }),
    );
  });

  it("throws LastfmApiError on HTTP errors", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(getArtistTopTags("Radiohead")).rejects.toEqual(
      expect.objectContaining({
        name: "LastfmApiError",
        code: 500,
      }),
    );
  });
});

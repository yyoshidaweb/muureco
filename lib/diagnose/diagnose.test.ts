import { beforeEach, describe, expect, it, vi } from "vitest";
import { diagnose } from "./diagnose";
import { ArtistNotFoundError } from "./errors";

const mockSearchArtist = vi.fn();
const mockGetArtistTopTags = vi.fn();
const mockGetSimilarArtists = vi.fn();
const mockSearchItunesArtists = vi.fn();
const mockLookupTracks = vi.fn();

vi.mock("@/lib/lastfm", () => ({
  searchArtist: (...args: unknown[]) => mockSearchArtist(...args),
  getArtistTopTags: (...args: unknown[]) => mockGetArtistTopTags(...args),
  getSimilarArtists: (...args: unknown[]) => mockGetSimilarArtists(...args),
}));

vi.mock("@/lib/itunes", () => ({
  searchArtists: (...args: unknown[]) => mockSearchItunesArtists(...args),
  lookupTracks: (...args: unknown[]) => mockLookupTracks(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockSearchItunesArtists.mockResolvedValue([]);
  mockLookupTracks.mockResolvedValue(new Map());
});

describe("diagnose", () => {
  it("aggregates tags and merges similar artists with multi-seed bonus", async () => {
    mockSearchArtist
      .mockResolvedValueOnce([
        {
          name: "Radiohead",
          mbid: "radiohead-mbid",
          url: "https://www.last.fm/music/Radiohead",
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "Bjork",
          mbid: "bjork-mbid",
          url: "https://www.last.fm/music/Bjork",
        },
      ]);

    mockGetArtistTopTags
      .mockResolvedValueOnce([
        { name: "rock", url: "https://www.last.fm/tag/rock", count: 100 },
        {
          name: "alternative",
          url: "https://www.last.fm/tag/alternative",
          count: 80,
        },
      ])
      .mockResolvedValueOnce([
        { name: "rock", url: "https://www.last.fm/tag/rock", count: 60 },
        {
          name: "electronic",
          url: "https://www.last.fm/tag/electronic",
          count: 40,
        },
      ]);

    mockGetSimilarArtists
      .mockResolvedValueOnce([
        {
          name: "Muse",
          match: 0.8,
          url: "https://www.last.fm/music/Muse",
          mbid: "muse-mbid",
        },
        {
          name: "Radiohead",
          match: 0.5,
          url: "https://www.last.fm/music/Radiohead",
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "Muse",
          match: 0.6,
          url: "https://www.last.fm/music/Muse",
          mbid: "muse-mbid",
        },
        {
          name: "Portishead",
          match: 0.7,
          url: "https://www.last.fm/music/Portishead",
        },
      ]);

    const result = await diagnose(["Radiohead", "Bjork"]);

    expect(result.diagnosis).toEqual([
      {
        name: "rock",
        score: 160,
        url: "https://www.last.fm/tag/rock",
      },
      {
        name: "alternative",
        score: 80,
        url: "https://www.last.fm/tag/alternative",
      },
      {
        name: "electronic",
        score: 40,
        url: "https://www.last.fm/tag/electronic",
      },
    ]);

    expect(result.recommendations).toEqual([
      { name: "Muse", score: 2.8, mbid: "muse-mbid" },
      { name: "Portishead", score: 0.7 },
    ]);

    expect(mockSearchArtist).toHaveBeenCalledWith("Radiohead", { limit: 1 });
    expect(mockSearchArtist).toHaveBeenCalledWith("Bjork", { limit: 1 });
    expect(mockGetArtistTopTags).toHaveBeenCalledWith("Radiohead", {
      mbid: "radiohead-mbid",
    });
    expect(mockGetArtistTopTags).toHaveBeenCalledWith("Bjork", {
      mbid: "bjork-mbid",
    });
    expect(mockGetSimilarArtists).toHaveBeenCalledWith("Radiohead", {
      limit: 10,
      mbid: "radiohead-mbid",
    });
    expect(mockGetSimilarArtists).toHaveBeenCalledWith("Bjork", {
      limit: 10,
      mbid: "bjork-mbid",
    });
  });

  it("excludes input artists from recommendations by resolved name", async () => {
    mockSearchArtist.mockResolvedValueOnce([
      {
        name: "Radiohead",
        mbid: "",
        url: "https://www.last.fm/music/Radiohead",
      },
    ]);
    mockGetArtistTopTags.mockResolvedValueOnce([]);
    mockGetSimilarArtists.mockResolvedValueOnce([
      {
        name: "Muse",
        match: 0.9,
        url: "https://www.last.fm/music/Muse",
      },
      {
        name: "radiohead",
        match: 0.8,
        url: "https://www.last.fm/music/Radiohead",
      },
    ]);

    const result = await diagnose(["radiohead"]);

    expect(mockGetSimilarArtists).toHaveBeenCalledWith("Radiohead", {
      limit: 10,
      mbid: undefined,
    });

    expect(result.recommendations).toEqual([{ name: "Muse", score: 0.9 }]);
  });

  it("throws ArtistNotFoundError when search returns no results", async () => {
    mockSearchArtist.mockResolvedValueOnce([]);

    await expect(diagnose(["Unknown Artist"])).rejects.toThrow(
      ArtistNotFoundError,
    );
  });
});

describe("diagnose recommendation previews", () => {
  function mockSingleRecommendation() {
    mockSearchArtist.mockResolvedValueOnce([
      {
        name: "Radiohead",
        mbid: "",
        url: "https://www.last.fm/music/Radiohead",
      },
    ]);
    mockGetArtistTopTags.mockResolvedValueOnce([]);
    mockGetSimilarArtists.mockResolvedValueOnce([
      {
        name: "Muse",
        match: 0.9,
        url: "https://www.last.fm/music/Muse",
      },
    ]);
  }

  it("attaches the preview URL and track name to a recommendation", async () => {
    mockSingleRecommendation();
    mockSearchItunesArtists.mockResolvedValueOnce([{ id: 1, name: "Muse" }]);
    mockLookupTracks.mockResolvedValueOnce(
      new Map([
        [
          1,
          { name: "Madness", previewUrl: "https://audio.example/madness.m4a" },
        ],
      ]),
    );

    const result = await diagnose(["Radiohead"]);

    expect(mockSearchItunesArtists).toHaveBeenCalledWith("Muse");
    expect(mockLookupTracks).toHaveBeenCalledWith([1]);
    expect(result.recommendations).toEqual([
      {
        name: "Muse",
        score: 0.9,
        preview: {
          url: "https://audio.example/madness.m4a",
          trackName: "Madness",
        },
      },
    ]);
  });

  it("looks up every artist in a single request", async () => {
    mockSearchArtist.mockResolvedValueOnce([
      {
        name: "Radiohead",
        mbid: "",
        url: "https://www.last.fm/music/Radiohead",
      },
    ]);
    mockGetArtistTopTags.mockResolvedValueOnce([]);
    mockGetSimilarArtists.mockResolvedValueOnce([
      { name: "Muse", match: 0.9, url: "https://www.last.fm/music/Muse" },
      {
        name: "Portishead",
        match: 0.8,
        url: "https://www.last.fm/music/Portishead",
      },
    ]);
    mockSearchItunesArtists
      .mockResolvedValueOnce([{ id: 1, name: "Muse" }])
      .mockResolvedValueOnce([{ id: 2, name: "Portishead" }]);

    await diagnose(["Radiohead"]);

    expect(mockLookupTracks).toHaveBeenCalledTimes(1);
    expect(mockLookupTracks).toHaveBeenCalledWith([1, 2]);
  });

  it("accepts a romanized name for a Japanese artist", async () => {
    mockSearchArtist.mockResolvedValueOnce([
      {
        name: "サカナクション",
        mbid: "",
        url: "https://www.last.fm/music/%E3%82%B5%E3%82%AB%E3%83%8A%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3",
      },
    ]);
    mockGetArtistTopTags.mockResolvedValueOnce([]);
    mockGetSimilarArtists.mockResolvedValueOnce([
      {
        name: "米津玄師",
        match: 0.9,
        url: "https://www.last.fm/music/%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB",
      },
    ]);
    mockSearchItunesArtists.mockResolvedValueOnce([
      { id: 1, name: "Kenshi Yonezu" },
    ]);
    mockLookupTracks.mockResolvedValueOnce(
      new Map([
        [1, { name: "Lemon", previewUrl: "https://audio.example/lemon.m4a" }],
      ]),
    );

    const result = await diagnose(["サカナクション"]);

    expect(result.recommendations[0]?.preview).toEqual({
      url: "https://audio.example/lemon.m4a",
      trackName: "Lemon",
    });
  });

  it("omits the preview when the artist name does not match", async () => {
    mockSingleRecommendation();
    mockSearchItunesArtists.mockResolvedValueOnce([
      { id: 1, name: "Muse Tribute Band" },
    ]);

    const result = await diagnose(["Radiohead"]);

    expect(mockLookupTracks).toHaveBeenCalledWith([]);
    expect(result.recommendations[0]?.preview).toBeUndefined();
  });

  it("omits the preview when the artist has no playable track", async () => {
    mockSingleRecommendation();
    mockSearchItunesArtists.mockResolvedValueOnce([{ id: 1, name: "Muse" }]);

    const result = await diagnose(["Radiohead"]);

    expect(result.recommendations[0]?.preview).toBeUndefined();
  });

  it("keeps the diagnosis successful and logs when iTunes fails", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      mockSingleRecommendation();
      mockSearchItunesArtists.mockRejectedValueOnce(
        new Error("iTunes Search API request failed with HTTP 403"),
      );

      const result = await diagnose(["Radiohead"]);

      expect(result.recommendations).toEqual([{ name: "Muse", score: 0.9 }]);
      expect(logged).toHaveBeenCalledWith("Failed to fetch iTunes previews", {
        failed: 1,
        reasons: ["iTunes Search API request failed with HTTP 403"],
      });
    } finally {
      logged.mockRestore();
    }
  });
});

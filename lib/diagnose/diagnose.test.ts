import { beforeEach, describe, expect, it, vi } from "vitest";
import { diagnose } from "./diagnose";
import { ArtistNotFoundError } from "./errors";

const mockSearchArtist = vi.fn();
const mockGetArtistTopTags = vi.fn();
const mockGetSimilarArtists = vi.fn();

vi.mock("@/lib/lastfm", () => ({
  searchArtist: (...args: unknown[]) => mockSearchArtist(...args),
  getArtistTopTags: (...args: unknown[]) => mockGetArtistTopTags(...args),
  getSimilarArtists: (...args: unknown[]) => mockGetSimilarArtists(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
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
      { name: "rock", score: 160 },
      { name: "alternative", score: 80 },
      { name: "electronic", score: 40 },
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

  it("merges same-mbid aliases and prefers the Japanese display name", async () => {
    mockSearchArtist.mockResolvedValueOnce([
      {
        name: "Radwimps",
        mbid: "radwimps-mbid",
        url: "https://www.last.fm/music/Radwimps",
      },
    ]);
    mockGetArtistTopTags.mockResolvedValueOnce([]);
    mockGetSimilarArtists.mockResolvedValueOnce([
      {
        name: "Kenshi Yonezu",
        match: 0.8,
        url: "https://www.last.fm/music/Kenshi+Yonezu",
        mbid: "yonezu-mbid",
      },
      {
        name: "米津玄師",
        match: 0.7,
        url: "https://www.last.fm/music/%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB",
        mbid: "yonezu-mbid",
      },
      {
        name: "Yoasobi",
        match: 0.6,
        url: "https://www.last.fm/music/Yoasobi",
        mbid: "yoasobi-mbid",
      },
    ]);

    const result = await diagnose(["Radwimps"]);

    expect(result.recommendations).toEqual([
      { name: "米津玄師", score: 0.8, mbid: "yonezu-mbid" },
      { name: "Yoasobi", score: 0.6, mbid: "yoasobi-mbid" },
    ]);
  });

  it("excludes input artists from recommendations by mbid", async () => {
    mockSearchArtist.mockResolvedValueOnce([
      {
        name: "Kenshi Yonezu",
        mbid: "yonezu-mbid",
        url: "https://www.last.fm/music/Kenshi+Yonezu",
      },
    ]);
    mockGetArtistTopTags.mockResolvedValueOnce([]);
    mockGetSimilarArtists.mockResolvedValueOnce([
      {
        name: "米津玄師",
        match: 0.95,
        url: "https://www.last.fm/music/%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB",
        mbid: "yonezu-mbid",
      },
      {
        name: "Vaundy",
        match: 0.7,
        url: "https://www.last.fm/music/Vaundy",
        mbid: "vaundy-mbid",
      },
    ]);

    const result = await diagnose(["Kenshi Yonezu"]);

    expect(result.recommendations).toEqual([
      { name: "Vaundy", score: 0.7, mbid: "vaundy-mbid" },
    ]);
  });
});

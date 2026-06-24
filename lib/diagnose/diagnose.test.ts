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
        { name: "alternative", url: "https://www.last.fm/tag/alternative", count: 80 },
      ])
      .mockResolvedValueOnce([
        { name: "rock", url: "https://www.last.fm/tag/rock", count: 60 },
        { name: "electronic", url: "https://www.last.fm/tag/electronic", count: 40 },
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
      {
        name: "Muse",
        score: 2.8,
        url: "https://www.last.fm/music/Muse",
        mbid: "muse-mbid",
      },
      {
        name: "Portishead",
        score: 0.7,
        url: "https://www.last.fm/music/Portishead",
      },
    ]);

    expect(mockSearchArtist).toHaveBeenCalledWith("Radiohead", { limit: 1 });
    expect(mockSearchArtist).toHaveBeenCalledWith("Bjork", { limit: 1 });
    expect(mockGetArtistTopTags).toHaveBeenCalledWith("Radiohead", {
      mbid: "radiohead-mbid",
    });
    expect(mockGetArtistTopTags).toHaveBeenCalledWith("Bjork", {
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

    expect(result.recommendations).toEqual([
      {
        name: "Muse",
        score: 0.9,
        url: "https://www.last.fm/music/Muse",
      },
    ]);
  });

  it("throws ArtistNotFoundError when search returns no results", async () => {
    mockSearchArtist.mockResolvedValueOnce([]);

    await expect(diagnose(["Unknown Artist"])).rejects.toThrow(
      ArtistNotFoundError,
    );
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { diagnose } from "./diagnose";
import { ArtistNotFoundError } from "./errors";

const mockSearchArtist = vi.fn();
const mockGetArtistTopTags = vi.fn();
const mockGetSimilarArtists = vi.fn();
const mockSearchSpotifyArtist = vi.fn();

vi.mock("@/lib/lastfm", () => ({
  searchArtist: (...args: unknown[]) => mockSearchArtist(...args),
  getArtistTopTags: (...args: unknown[]) => mockGetArtistTopTags(...args),
  getSimilarArtists: (...args: unknown[]) => mockGetSimilarArtists(...args),
}));

vi.mock("@/lib/spotify", () => ({
  searchArtist: (...args: unknown[]) => mockSearchSpotifyArtist(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockSearchSpotifyArtist.mockResolvedValue(null);
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

describe("diagnose recommendation images", () => {
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

  it("attaches the Spotify image URL to a recommendation", async () => {
    mockSingleRecommendation();
    mockSearchSpotifyArtist.mockResolvedValueOnce({
      id: "muse-id",
      name: "Muse",
      imageUrl: "https://i.scdn.co/image/muse",
    });

    const result = await diagnose(["Radiohead"]);

    expect(mockSearchSpotifyArtist).toHaveBeenCalledWith("Muse");
    expect(result.recommendations).toEqual([
      {
        name: "Muse",
        score: 0.9,
        url: "https://www.last.fm/music/Muse",
        imageUrl: "https://i.scdn.co/image/muse",
      },
    ]);
  });

  it("omits the image URL when the Spotify artist name does not match", async () => {
    mockSingleRecommendation();
    mockSearchSpotifyArtist.mockResolvedValueOnce({
      id: "tribute-id",
      name: "Muse Tribute Band",
      imageUrl: "https://i.scdn.co/image/tribute",
    });

    const result = await diagnose(["Radiohead"]);

    expect(result.recommendations[0]?.imageUrl).toBeUndefined();
  });

  it("keeps the diagnosis successful when Spotify fails", async () => {
    mockSingleRecommendation();
    mockSearchSpotifyArtist.mockRejectedValueOnce(new Error("Spotify is down"));

    const result = await diagnose(["Radiohead"]);

    expect(result.recommendations).toEqual([
      {
        name: "Muse",
        score: 0.9,
        url: "https://www.last.fm/music/Muse",
      },
    ]);
  });
});

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
      { name: "rock", score: 160 },
      { name: "alternative", score: 80 },
      { name: "electronic", score: 40 },
    ]);

    expect(result.recommendations).toEqual([
      {
        name: "Muse",
        score: 2.8,
        mbid: "muse-mbid",
      },
      {
        name: "Portishead",
        score: 0.7,
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

    expect(result.recommendations).toEqual([{ name: "Muse", score: 0.9 }]);
  });

  it("throws ArtistNotFoundError when search returns no results", async () => {
    mockSearchArtist.mockResolvedValueOnce([]);

    await expect(diagnose(["Unknown Artist"])).rejects.toThrow(
      ArtistNotFoundError,
    );
  });
});

describe("diagnose recommendation Spotify data", () => {
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

  it("attaches the Spotify image URL, artist ID and track ID to a recommendation", async () => {
    mockSingleRecommendation();
    mockSearchSpotifyArtist.mockResolvedValueOnce({
      id: "muse-id",
      name: "Muse",
      imageUrl: "https://i.scdn.co/image/muse",
      topTrackId: "hysteria-id",
    });

    const result = await diagnose(["Radiohead"]);

    expect(mockSearchSpotifyArtist).toHaveBeenCalledWith("Muse");
    expect(result.recommendations).toEqual([
      {
        name: "Muse",
        score: 0.9,
        imageUrl: "https://i.scdn.co/image/muse",
        spotifyId: "muse-id",
        spotifyTrackId: "hysteria-id",
      },
    ]);
  });

  it("attaches the artist ID even when the Spotify artist has no image or track", async () => {
    mockSingleRecommendation();
    mockSearchSpotifyArtist.mockResolvedValueOnce({
      id: "muse-id",
      name: "Muse",
    });

    const result = await diagnose(["Radiohead"]);

    expect(result.recommendations).toEqual([
      {
        name: "Muse",
        score: 0.9,
        spotifyId: "muse-id",
      },
    ]);
  });

  it("accepts a romanized Spotify name for a Japanese artist", async () => {
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
    mockSearchSpotifyArtist.mockResolvedValueOnce({
      id: "yonezu-id",
      name: "Kenshi Yonezu",
      imageUrl: "https://i.scdn.co/image/yonezu",
    });

    const result = await diagnose(["サカナクション"]);

    expect(result.recommendations[0]?.imageUrl).toBe(
      "https://i.scdn.co/image/yonezu",
    );
    expect(result.recommendations[0]?.spotifyId).toBe("yonezu-id");
  });

  it("omits the Spotify data when the artist name does not match", async () => {
    mockSingleRecommendation();
    mockSearchSpotifyArtist.mockResolvedValueOnce({
      id: "tribute-id",
      name: "Muse Tribute Band",
      imageUrl: "https://i.scdn.co/image/tribute",
    });

    const result = await diagnose(["Radiohead"]);

    expect(result.recommendations[0]?.imageUrl).toBeUndefined();
    expect(result.recommendations[0]?.spotifyId).toBeUndefined();
  });

  it("keeps the diagnosis successful when Spotify fails", async () => {
    mockSingleRecommendation();
    mockSearchSpotifyArtist.mockRejectedValueOnce(new Error("Spotify is down"));

    const result = await diagnose(["Radiohead"]);

    expect(result.recommendations).toEqual([{ name: "Muse", score: 0.9 }]);
  });
});

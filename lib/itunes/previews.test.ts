import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPreviews } from "./previews";

const mockSearchArtists = vi.fn();
const mockLookupTracks = vi.fn();

vi.mock("./client", () => ({
  searchArtists: (...args: unknown[]) => mockSearchArtists(...args),
  lookupTracks: (...args: unknown[]) => mockLookupTracks(...args),
}));

function trackMap(id: number, name: string, slug: string) {
  return new Map([
    [
      id,
      {
        name,
        previewUrl: `https://audio.example/${slug}.m4a`,
        viewUrl: `https://music.example/${slug}`,
      },
    ],
  ]);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockSearchArtists.mockResolvedValue([]);
  mockLookupTracks.mockResolvedValue(new Map());
});

describe("fetchPreviews", () => {
  it("returns the preview URL and track name for an artist", async () => {
    mockSearchArtists.mockResolvedValueOnce([{ id: 1, name: "Muse" }]);
    mockLookupTracks.mockResolvedValueOnce(trackMap(1, "Madness", "madness"));

    const previews = await fetchPreviews(["Muse"]);

    expect(mockSearchArtists).toHaveBeenCalledWith("Muse");
    expect(mockLookupTracks).toHaveBeenCalledWith([1]);
    expect(previews.get("Muse")).toEqual({
      url: "https://audio.example/madness.m4a",
      trackName: "Madness",
      storeUrl: "https://music.example/madness",
    });
  });

  it("looks up every artist in a single request", async () => {
    mockSearchArtists
      .mockResolvedValueOnce([{ id: 1, name: "Muse" }])
      .mockResolvedValueOnce([{ id: 2, name: "Portishead" }]);

    await fetchPreviews(["Muse", "Portishead"]);

    expect(mockLookupTracks).toHaveBeenCalledTimes(1);
    expect(mockLookupTracks).toHaveBeenCalledWith([1, 2]);
  });

  it("accepts a romanized name for a Japanese artist", async () => {
    mockSearchArtists.mockResolvedValueOnce([{ id: 1, name: "Kenshi Yonezu" }]);
    mockLookupTracks.mockResolvedValueOnce(trackMap(1, "Lemon", "lemon"));

    const previews = await fetchPreviews(["米津玄師"]);

    expect(previews.get("米津玄師")).toEqual({
      url: "https://audio.example/lemon.m4a",
      trackName: "Lemon",
      storeUrl: "https://music.example/lemon",
    });
  });

  it("omits the artist when the name does not match", async () => {
    mockSearchArtists.mockResolvedValueOnce([
      { id: 1, name: "Muse Tribute Band" },
    ]);

    const previews = await fetchPreviews(["Muse"]);

    expect(mockLookupTracks).toHaveBeenCalledWith([]);
    expect(previews.has("Muse")).toBe(false);
  });

  it("omits the artist when there is no playable track", async () => {
    mockSearchArtists.mockResolvedValueOnce([{ id: 1, name: "Muse" }]);

    const previews = await fetchPreviews(["Muse"]);

    expect(previews.has("Muse")).toBe(false);
  });

  it("sends no request for an empty list", async () => {
    const previews = await fetchPreviews([]);

    expect(previews.size).toBe(0);
    expect(mockSearchArtists).not.toHaveBeenCalled();
    expect(mockLookupTracks).not.toHaveBeenCalled();
  });

  it("returns the artists it could resolve and logs the failures", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      mockSearchArtists
        .mockRejectedValueOnce(
          new Error("iTunes Search API request failed with HTTP 429"),
        )
        .mockResolvedValueOnce([{ id: 2, name: "Portishead" }]);
      mockLookupTracks.mockResolvedValueOnce(
        trackMap(2, "Glory Box", "glory-box"),
      );

      const previews = await fetchPreviews(["Muse", "Portishead"]);

      expect(previews.has("Muse")).toBe(false);
      expect(previews.get("Portishead")?.trackName).toBe("Glory Box");
      expect(logged).toHaveBeenCalledWith("Failed to fetch iTunes previews", {
        failed: 1,
        reasons: ["iTunes Search API request failed with HTTP 429"],
      });
    } finally {
      logged.mockRestore();
    }
  });
});

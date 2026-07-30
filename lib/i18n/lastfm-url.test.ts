import { describe, expect, it } from "vitest";
import { isLocale, parseLocale } from "./locale";
import { localizeLastfmUrl } from "./lastfm-url";
import { translate } from "./translate";

describe("localizeLastfmUrl", () => {
  it("adds /ja prefix for Japanese artist pages", () => {
    expect(
      localizeLastfmUrl("https://www.last.fm/music/Radiohead", "ja"),
    ).toBe("https://www.last.fm/ja/music/Radiohead");
  });

  it("adds /ja prefix for Japanese tag pages", () => {
    expect(localizeLastfmUrl("https://www.last.fm/tag/rock", "ja")).toBe(
      "https://www.last.fm/ja/tag/rock",
    );
  });

  it("keeps English URLs without a language prefix", () => {
    expect(
      localizeLastfmUrl("https://www.last.fm/music/Radiohead", "en"),
    ).toBe("https://www.last.fm/music/Radiohead");
  });

  it("strips an existing language prefix when switching to English", () => {
    expect(
      localizeLastfmUrl("https://www.last.fm/ja/music/Radiohead", "en"),
    ).toBe("https://www.last.fm/music/Radiohead");
  });

  it("replaces an existing language prefix when switching to Japanese", () => {
    expect(
      localizeLastfmUrl("https://www.last.fm/fr/music/Radiohead", "ja"),
    ).toBe("https://www.last.fm/ja/music/Radiohead");
  });

  it("localizes the Last.fm homepage", () => {
    expect(localizeLastfmUrl("https://www.last.fm/", "ja")).toBe(
      "https://www.last.fm/ja/",
    );
    expect(localizeLastfmUrl("https://www.last.fm/", "en")).toBe(
      "https://www.last.fm/",
    );
  });

  it("returns non-Last.fm URLs unchanged", () => {
    expect(localizeLastfmUrl("https://example.com/music", "ja")).toBe(
      "https://example.com/music",
    );
  });
});

describe("translate", () => {
  it("interpolates parameters", () => {
    expect(
      translate("ja", "error.artistNotFoundNamed", { artist: "Muse" }),
    ).toBe("「Muse」が見つかりません");
    expect(
      translate("en", "error.artistNotFoundNamed", { artist: "Muse" }),
    ).toBe("“Muse” was not found");
  });

  it("returns dictionary entries for both locales", () => {
    const key = "section.favoriteArtists" as const;
    expect(translate("ja", key)).toBe("好きなアーティスト");
    expect(translate("en", key)).toBe("Favorite artists");
  });
});

describe("locale helpers", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("ja")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(parseLocale("en")).toBe("en");
    expect(parseLocale("nope")).toBeNull();
  });
});

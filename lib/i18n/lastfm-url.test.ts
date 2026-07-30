import { describe, expect, it } from "vitest";
import {
  detectLocaleFromHeaders,
  isLocale,
  localePath,
  parseLocale,
  resolveLocaleFromPathname,
} from "./locale";
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

  it("builds locale paths (en unprefixed, ja prefixed)", () => {
    expect(localePath("ja")).toBe("/ja");
    expect(localePath("en")).toBe("/");
    expect(localePath("en", "/ja")).toBe("/");
    expect(localePath("ja", "/")).toBe("/ja");
    expect(localePath("ja", "/en")).toBe("/ja");
    expect(localePath("en", "/terms")).toBe("/terms");
    expect(localePath("ja", "/terms")).toBe("/ja/terms");
    expect(localePath("en", "/privacy")).toBe("/privacy");
    expect(localePath("ja", "/privacy")).toBe("/ja/privacy");
    expect(localePath("en", "/ja/terms")).toBe("/terms");
    expect(localePath("ja", "/en/privacy")).toBe("/ja/privacy");
  });

  it("resolves locale from pathname", () => {
    expect(resolveLocaleFromPathname("/ja")).toBe("ja");
    expect(resolveLocaleFromPathname("/")).toBe("en");
    expect(resolveLocaleFromPathname("/en")).toBe("en");
  });

  it("detects locale from country headers", () => {
    expect(
      detectLocaleFromHeaders(new Headers({ "cf-ipcountry": "JP" })),
    ).toBe("ja");
    expect(
      detectLocaleFromHeaders(new Headers({ "cf-ipcountry": "US" })),
    ).toBe("en");
    expect(
      detectLocaleFromHeaders(new Headers({ "x-vercel-ip-country": "JP" })),
    ).toBe("ja");
  });

  it("falls back to Accept-Language when country is unknown", () => {
    expect(
      detectLocaleFromHeaders(
        new Headers({
          "cf-ipcountry": "XX",
          "accept-language": "ja-JP,ja;q=0.9,en;q=0.8",
        }),
      ),
    ).toBe("ja");
    expect(
      detectLocaleFromHeaders(
        new Headers({
          "accept-language": "en-US,en;q=0.9",
        }),
      ),
    ).toBe("en");
  });
});

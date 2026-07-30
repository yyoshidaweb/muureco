export const LOCALES = ["ja", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Fallback when locale cannot be inferred (e.g. missing headers). */
export const DEFAULT_LOCALE: Locale = "en";

export type TranslationKey =
  | "brand.tagline"
  | "section.favoriteArtists"
  | "section.recommendedArtists"
  | "section.recommendedGenres"
  | "form.artistPlaceholder"
  | "form.artistLabel"
  | "form.addArtist"
  | "form.removeArtist"
  | "form.duplicateArtist"
  | "suggest.searching"
  | "suggest.noResults"
  | "result.thinking"
  | "result.noRecommendations"
  | "result.noTags"
  | "error.badRequest"
  | "error.artistNotFound"
  | "error.artistNotFoundNamed"
  | "error.diagnoseFailed"
  | "footer.developedBy"
  | "footer.dataProvider"
  | "footer.unofficial"
  | "language.label"
  | "language.ja"
  | "language.en"
  | "link.lastfm";

export type Dictionary = Record<TranslationKey, string>;

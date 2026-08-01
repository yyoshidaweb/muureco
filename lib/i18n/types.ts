export const LOCALES = ["ja", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Fallback when locale cannot be inferred (e.g. missing headers). */
export const DEFAULT_LOCALE: Locale = "en";

export type TranslationKey =
  | "brand.name"
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
  | "preview.play"
  | "preview.stop"
  | "preview.playLabel"
  | "preview.stopLabel"
  | "preview.playing"
  | "preview.failed"
  | "preview.storeLabel"
  | "result.thinking"
  | "result.noRecommendations"
  | "result.noTags"
  | "error.badRequest"
  | "error.artistNotFound"
  | "error.artistNotFoundNamed"
  | "error.diagnoseFailed"
  | "footer.developedBy"
  | "footer.dataProvider"
  | "footer.previewCredit"
  | "footer.appleTrademark"
  | "footer.unofficial"
  | "language.label"
  | "language.ja"
  | "language.en"
  | "link.terms"
  | "link.privacy"
  | "link.algorithm"
  | "modal.close";

export type Dictionary = Record<TranslationKey, string>;

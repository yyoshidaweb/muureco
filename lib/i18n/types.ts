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
  | "form.editArtist"
  | "form.removeArtist"
  | "form.duplicateArtist"
  | "suggest.searching"
  | "suggest.noResults"
  | "preview.label"
  | "preview.playLabel"
  | "preview.stopLabel"
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
  | "footer.otherServices"
  | "footer.minnanotimetable"
  | "language.label"
  | "language.ja"
  | "language.en"
  | "link.terms"
  | "link.privacy"
  | "link.algorithm"
  | "link.credits"
  | "link.contact"
  | "modal.close";

export type Dictionary = Record<TranslationKey, string>;

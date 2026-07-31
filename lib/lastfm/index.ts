export {
  getArtistTopTags,
  getSimilarArtists,
  searchArtist,
} from "./client";
export type {
  GetArtistTopTagsOptions,
  GetSimilarArtistsOptions,
  SearchArtistOptions,
} from "./client";
export { LastfmApiError, LastfmConfigError } from "./errors";
export type { LastfmArtist, LastfmSimilarArtist, LastfmTag } from "./types";

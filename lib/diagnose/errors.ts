export class DiagnoseValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiagnoseValidationError";
  }
}

export class ArtistNotFoundError extends Error {
  readonly artist: string;

  constructor(artist: string) {
    super(`アーティストが見つかりません: ${artist}`);
    this.name = "ArtistNotFoundError";
    this.artist = artist;
  }
}

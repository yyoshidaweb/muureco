export class LastfmConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LastfmConfigError";
  }
}

export class LastfmApiError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "LastfmApiError";
    this.code = code;
  }
}

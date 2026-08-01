export class ItunesApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ItunesApiError";
    this.status = status;
  }
}

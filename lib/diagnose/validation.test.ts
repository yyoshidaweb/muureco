import { describe, expect, it } from "vitest";
import { DiagnoseValidationError } from "./errors";
import { parseDiagnoseRequest } from "./validation";

describe("parseDiagnoseRequest", () => {
  it("returns trimmed artist names from a valid request", () => {
    expect(parseDiagnoseRequest({ artists: [" Radiohead ", "Bjork"] })).toEqual([
      "Radiohead",
      "Bjork",
    ]);
  });

  it("rejects non-object bodies", () => {
    expect(() => parseDiagnoseRequest(null)).toThrow(DiagnoseValidationError);
    expect(() => parseDiagnoseRequest("invalid")).toThrow(DiagnoseValidationError);
  });

  it("rejects when artists is not an array", () => {
    expect(() => parseDiagnoseRequest({ artists: "Radiohead" })).toThrow(
      DiagnoseValidationError,
    );
  });

  it("rejects an empty artists array", () => {
    expect(() => parseDiagnoseRequest({ artists: [] })).toThrow(
      DiagnoseValidationError,
    );
  });

  it("rejects when artists exceeds the maximum limit", () => {
    const artists = Array.from({ length: 11 }, (_, i) => `Artist ${i + 1}`);
    expect(() => parseDiagnoseRequest({ artists })).toThrow(
      DiagnoseValidationError,
    );
  });

  it("accepts artists at the maximum limit", () => {
    const artists = Array.from({ length: 10 }, (_, i) => `Artist ${i + 1}`);
    expect(parseDiagnoseRequest({ artists })).toEqual(artists);
  });

  it("rejects non-string elements", () => {
    expect(() => parseDiagnoseRequest({ artists: ["Radiohead", 1] })).toThrow(
      DiagnoseValidationError,
    );
  });

  it("rejects blank artist names", () => {
    expect(() => parseDiagnoseRequest({ artists: [" "] })).toThrow(
      DiagnoseValidationError,
    );
  });

  it("rejects duplicate artist names", () => {
    expect(() =>
      parseDiagnoseRequest({ artists: ["Radiohead", "Radiohead"] }),
    ).toThrow(DiagnoseValidationError);
  });

  it("rejects duplicate artist names case-insensitively", () => {
    expect(() =>
      parseDiagnoseRequest({ artists: ["Radiohead", "radiohead"] }),
    ).toThrow(DiagnoseValidationError);
  });
});

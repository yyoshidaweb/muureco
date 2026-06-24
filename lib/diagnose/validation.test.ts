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
});

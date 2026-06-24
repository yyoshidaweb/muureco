import { DiagnoseValidationError } from "./errors";
import type { DiagnoseRequest } from "./types";

export const MAX_ARTISTS = 10;

export function parseDiagnoseRequest(body: unknown): string[] {
  if (typeof body !== "object" || body === null) {
    throw new DiagnoseValidationError(
      "リクエストボディは JSON オブジェクトである必要があります",
    );
  }

  const { artists } = body as Partial<DiagnoseRequest>;

  if (!Array.isArray(artists)) {
    throw new DiagnoseValidationError(
      "artists は文字列の配列である必要があります",
    );
  }

  if (artists.length === 0) {
    throw new DiagnoseValidationError(
      "artists には 1 件以上のアーティスト名を指定してください",
    );
  }

  if (artists.length > MAX_ARTISTS) {
    throw new DiagnoseValidationError(
      `artists は ${MAX_ARTISTS} 件以下で指定してください`,
    );
  }

  const parsed: string[] = [];
  const seen = new Set<string>();

  for (const item of artists) {
    if (typeof item !== "string") {
      throw new DiagnoseValidationError(
        "artists の各要素は文字列である必要があります",
      );
    }

    const trimmed = item.trim();
    if (!trimmed) {
      throw new DiagnoseValidationError(
        "空のアーティスト名は指定できません",
      );
    }

    const normalized = trimmed.toLowerCase();
    if (seen.has(normalized)) {
      throw new DiagnoseValidationError(
        "同じアーティスト名を重複して指定できません",
      );
    }
    seen.add(normalized);

    parsed.push(trimmed);
  }

  return parsed;
}

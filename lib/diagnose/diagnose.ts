import {
  getArtistTopTags,
  getSimilarArtists,
  searchArtist,
} from "@/lib/lastfm";
import type { LastfmArtist } from "@/lib/lastfm";
import { ArtistNotFoundError } from "./errors";
import type { DiagnoseResult, DiagnosisTag, Recommendation } from "./types";

const DIAGNOSIS_LIMIT = 10;
const RECOMMENDATION_LIMIT = 10;
const SIMILAR_ARTISTS_LIMIT = 10;

/** ひらがな・カタカナ・漢字（半角カナを含む）。 */
const JAPANESE_PATTERN =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff66-\uff9f]/;

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function hasJapanese(name: string): boolean {
  return JAPANESE_PATTERN.test(name);
}

/** 日英別名が混在する場合は日本語表記を残す。 */
function preferDisplayName(current: string, candidate: string): string {
  if (hasJapanese(candidate) && !hasJapanese(current)) {
    return candidate;
  }
  return current;
}

async function resolveArtist(name: string): Promise<LastfmArtist> {
  const results = await searchArtist(name, { limit: 1 });
  const top = results[0];
  if (!top) {
    throw new ArtistNotFoundError(name);
  }
  return top;
}

function buildDiagnosis(
  tagLists: { name: string; count: number }[][],
): DiagnosisTag[] {
  const scores = new Map<string, number>();

  for (const tags of tagLists) {
    for (const tag of tags) {
      scores.set(tag.name, (scores.get(tag.name) ?? 0) + tag.count);
    }
  }

  return [...scores.entries()]
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, DIAGNOSIS_LIMIT);
}

function buildRecommendations(
  similarLists: {
    name: string;
    match: number;
    mbid?: string;
  }[][],
  excludedNames: Set<string>,
  excludedMbids: Set<string>,
): Recommendation[] {
  type Entry = {
    name: string;
    score: number;
    mbid?: string;
    seedCount: number;
  };

  const entries = new Map<string, Entry>();
  const nameIndex = new Map<string, string>();
  const mbidIndex = new Map<string, string>();
  let nextId = 0;

  function findId(artist: { name: string; mbid?: string }): string | undefined {
    if (artist.mbid) {
      const byMbid = mbidIndex.get(artist.mbid);
      if (byMbid !== undefined) {
        return byMbid;
      }
    }
    return nameIndex.get(normalizeName(artist.name));
  }

  for (const similar of similarLists) {
    // 同一seed内で日英別名が両方挙がっても、seedボーナスを二重に付けない
    const matchFromSeed = new Map<string, number>();

    for (const artist of similar) {
      if (artist.mbid && excludedMbids.has(artist.mbid)) {
        continue;
      }
      if (excludedNames.has(normalizeName(artist.name))) {
        continue;
      }

      const existingId = findId(artist);
      if (existingId !== undefined) {
        const existing = entries.get(existingId);
        if (!existing) {
          continue;
        }

        existing.name = preferDisplayName(existing.name, artist.name);
        if (artist.mbid && !existing.mbid) {
          existing.mbid = artist.mbid;
          mbidIndex.set(artist.mbid, existingId);
        }
        nameIndex.set(normalizeName(artist.name), existingId);

        const prevMatch = matchFromSeed.get(existingId);
        if (prevMatch !== undefined) {
          if (artist.match > prevMatch) {
            existing.score += artist.match - prevMatch;
            matchFromSeed.set(existingId, artist.match);
          }
          continue;
        }

        existing.score += artist.match;
        existing.seedCount += 1;
        matchFromSeed.set(existingId, artist.match);
        continue;
      }

      const id = String(nextId++);
      entries.set(id, {
        name: artist.name,
        score: artist.match,
        mbid: artist.mbid,
        seedCount: 1,
      });
      nameIndex.set(normalizeName(artist.name), id);
      if (artist.mbid) {
        mbidIndex.set(artist.mbid, id);
      }
      matchFromSeed.set(id, artist.match);
    }
  }

  return [...entries.values()]
    .map(({ name, score, mbid, seedCount }) => ({
      name,
      score: score * seedCount,
      mbid,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, RECOMMENDATION_LIMIT);
}

export async function diagnose(artistNames: string[]): Promise<DiagnoseResult> {
  const resolved = await Promise.all(artistNames.map(resolveArtist));

  const excludedNames = new Set([
    ...artistNames.map(normalizeName),
    ...resolved.map((a) => normalizeName(a.name)),
  ]);
  const excludedMbids = new Set(
    resolved.map((a) => a.mbid).filter((mbid): mbid is string => Boolean(mbid)),
  );

  const artistData = await Promise.all(
    resolved.map(async (artist) => {
      const [tags, similar] = await Promise.all([
        getArtistTopTags(artist.name, { mbid: artist.mbid || undefined }),
        getSimilarArtists(artist.name, {
          limit: SIMILAR_ARTISTS_LIMIT,
          mbid: artist.mbid || undefined,
        }),
      ]);
      return { tags, similar };
    }),
  );

  return {
    diagnosis: buildDiagnosis(artistData.map((d) => d.tags)),
    // 試聴音源はブラウザから直接取得する。上限がIP単位で効くため、共有IPになる
    // ここで取ると本番では常に上限に当たる。
    recommendations: buildRecommendations(
      artistData.map((d) => d.similar),
      excludedNames,
      excludedMbids,
    ),
  };
}

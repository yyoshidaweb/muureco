import {
  getArtistTopTags,
  getSimilarArtists,
  searchArtist,
} from "@/lib/lastfm";
import type { LastfmArtist } from "@/lib/lastfm";
import { ArtistNotFoundError } from "./errors";
import type { DiagnoseResult, DiagnosisTag, Recommendation } from "./types";

const DIAGNOSIS_LIMIT = 10;
const RECOMMENDATION_LIMIT = 20;

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
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
    url: string;
    mbid?: string;
  }[][],
  excludedNames: Set<string>,
): Recommendation[] {
  const entries = new Map<
    string,
    {
      name: string;
      score: number;
      url: string;
      mbid?: string;
      seedCount: number;
    }
  >();

  for (const similar of similarLists) {
    for (const artist of similar) {
      if (excludedNames.has(normalizeName(artist.name))) {
        continue;
      }

      const key = normalizeName(artist.name);
      const existing = entries.get(key);
      if (existing) {
        existing.score += artist.match;
        existing.seedCount += 1;
      } else {
        entries.set(key, {
          name: artist.name,
          score: artist.match,
          url: artist.url,
          mbid: artist.mbid,
          seedCount: 1,
        });
      }
    }
  }

  return [...entries.values()]
    .map(({ name, score, url, mbid, seedCount }) => ({
      name,
      score: score * seedCount,
      url,
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

  const artistData = await Promise.all(
    resolved.map(async (artist) => {
      const [tags, similar] = await Promise.all([
        getArtistTopTags(artist.name, { mbid: artist.mbid || undefined }),
        getSimilarArtists(artist.name, {
          mbid: artist.mbid || undefined,
        }),
      ]);
      return { tags, similar };
    }),
  );

  return {
    diagnosis: buildDiagnosis(artistData.map((d) => d.tags)),
    recommendations: buildRecommendations(
      artistData.map((d) => d.similar),
      excludedNames,
    ),
  };
}

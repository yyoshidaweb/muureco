import {
  getArtistTopTags,
  getSimilarArtists,
  searchArtist,
} from "@/lib/lastfm";
import type { LastfmArtist } from "@/lib/lastfm";
import { searchArtist as searchSpotifyArtist } from "@/lib/spotify";
import { ArtistNotFoundError } from "./errors";
import type { DiagnoseResult, DiagnosisTag, Recommendation } from "./types";

const DIAGNOSIS_LIMIT = 10;
const RECOMMENDATION_LIMIT = 10;
const SIMILAR_ARTISTS_LIMIT = 10;

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
    mbid?: string;
  }[][],
  excludedNames: Set<string>,
): Recommendation[] {
  const entries = new Map<
    string,
    {
      name: string;
      score: number;
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
          mbid: artist.mbid,
          seedCount: 1,
        });
      }
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

/** ひらがな・カタカナ・漢字（半角カナを含む）。 */
const JAPANESE_PATTERN =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff66-\uff9f]/;

async function withSpotifyArtist(
  recommendation: Recommendation,
): Promise<Recommendation> {
  try {
    const artist = await searchSpotifyArtist(recommendation.name);

    if (!artist) {
      return recommendation;
    }

    // Last.fm が日本語表記、Spotify がローマ字表記を返すことが多く、日本語名では
    // 文字列が一致しない。表記体系が揃うラテン文字名のときだけ、別アーティストを
    // 拾わないよう名前の一致を求める。
    if (
      !JAPANESE_PATTERN.test(recommendation.name) &&
      normalizeName(artist.name) !== normalizeName(recommendation.name)
    ) {
      return recommendation;
    }

    return {
      ...recommendation,
      spotifyId: artist.id,
      ...(artist.imageUrl ? { imageUrl: artist.imageUrl } : {}),
    };
  } catch {
    // Spotify 側の失敗で診断全体を止めず、Spotify 由来の情報なしで返す。
    return recommendation;
  }
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
          limit: SIMILAR_ARTISTS_LIMIT,
          mbid: artist.mbid || undefined,
        }),
      ]);
      return { tags, similar };
    }),
  );

  const recommendations = buildRecommendations(
    artistData.map((d) => d.similar),
    excludedNames,
  );

  return {
    diagnosis: buildDiagnosis(artistData.map((d) => d.tags)),
    recommendations: await Promise.all(recommendations.map(withSpotifyArtist)),
  };
}

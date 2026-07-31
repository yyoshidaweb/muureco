import { NextResponse } from "next/server";
import { LastfmApiError, LastfmConfigError, searchArtist } from "@/lib/lastfm";

const SUGGEST_LIMIT = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ artists: [] });
  }

  try {
    const artists = await searchArtist(q, { limit: SUGGEST_LIMIT });
    return NextResponse.json({
      artists: artists.map((artist) => ({
        name: artist.name,
        mbid: artist.mbid || undefined,
      })),
    });
  } catch (error) {
    if (error instanceof LastfmConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (error instanceof LastfmApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 502 },
      );
    }
    throw error;
  }
}

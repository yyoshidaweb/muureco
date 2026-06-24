import { NextResponse } from "next/server";
import {
  getArtistTopTags,
  getSimilarArtists,
  LastfmApiError,
  LastfmConfigError,
  searchArtist,
} from "@/lib/lastfm";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist") ?? "Radiohead";

  try {
    const [search, topTags, similar] = await Promise.all([
      searchArtist(artist, { limit: 3 }),
      getArtistTopTags(artist),
      getSimilarArtists(artist, { limit: 3 }),
    ]);

    return NextResponse.json({
      artist,
      search,
      topTags: topTags.slice(0, 5),
      similar,
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

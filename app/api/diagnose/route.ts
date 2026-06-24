import { NextResponse } from "next/server";
import {
  ArtistNotFoundError,
  DiagnoseValidationError,
  diagnose,
  parseDiagnoseRequest,
} from "@/lib/diagnose";
import { LastfmApiError, LastfmConfigError } from "@/lib/lastfm";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディは有効な JSON である必要があります" },
      { status: 400 },
    );
  }

  try {
    const artists = parseDiagnoseRequest(body);
    const result = await diagnose(artists);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DiagnoseValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof ArtistNotFoundError) {
      return NextResponse.json(
        { error: error.message, artist: error.artist },
        { status: 404 },
      );
    }
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

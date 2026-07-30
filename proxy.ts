import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectLocaleFromHeaders, isLocale } from "@/lib/i18n/locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const locale = detectLocaleFromHeaders(request.headers);
  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

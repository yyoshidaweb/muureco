import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  detectLocaleFromHeaders,
  parseLocale,
} from "@/lib/i18n/locale";

function stripLocalePrefix(pathname: string, locale: "en" | "ja"): string {
  if (pathname === `/${locale}`) return "/";
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(locale.length + 1) || "/";
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Japanese uses a public `/ja` prefix.
  if (pathname === "/ja" || pathname.startsWith("/ja/")) {
    return NextResponse.next();
  }

  // Legacy `/en` URLs redirect to the unprefixed English path.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = stripLocalePrefix(pathname, "en");
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const cookieLocale = parseLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const locale = cookieLocale ?? detectLocaleFromHeaders(request.headers);

  if (locale === "ja") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/ja" : `/ja${pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, "ja", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // English: keep the public URL unprefixed; rewrite internally to `/en`.
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  const response = NextResponse.rewrite(url);
  if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

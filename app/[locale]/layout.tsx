import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  LocaleProvider,
  LOCALES,
  isLocale,
  translate,
  type Locale,
} from "@/lib/i18n";
import { LOCALE_PATHS, SITE_URL } from "@/lib/site";
import "../globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const descriptions: Record<Locale, string> = {
  ja: "好きなアーティストから、あなたの音楽性を診断し、おすすめアーティストを表示します。",
  en: "Diagnose your musical taste from artists you love and discover recommendations.",
};

const ogImageAlts: Record<Locale, string> = {
  ja: "ミューレコ — 音楽探索サービス",
  en: "Muureco — Music discovery service",
};

const ogImagePaths: Record<Locale, string> = {
  ja: "/og/ja.jpg",
  en: "/og/en.jpg",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "ja";
  const title = `${translate(locale, "brand.name")} | ${translate(locale, "brand.tagline")}`;
  const description = descriptions[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: LOCALE_PATHS[locale],
      languages: {
        en: LOCALE_PATHS.en,
        ja: LOCALE_PATHS.ja,
        "x-default": LOCALE_PATHS.en,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      siteName: translate(locale, "brand.name"),
      images: [
        {
          url: ogImagePaths[locale],
          width: 1024,
          height: 537,
          alt: ogImageAlts[locale],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImagePaths[locale]],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale: Locale = localeParam;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} className={`${notoSansJp.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}

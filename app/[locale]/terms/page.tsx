import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/LegalDocument";
import { SiteFooter } from "@/components/SiteFooter";
import { isLocale, translate, type Locale } from "@/lib/i18n";
import { termsContent } from "@/lib/legal/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "ja";
  const doc = termsContent[locale];
  return {
    title: `${doc.title} | ${translate(locale, "brand.name")}`,
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale: Locale = localeParam;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <LegalDocument document={termsContent[locale]} />
      <SiteFooter />
    </div>
  );
}

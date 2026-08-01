"use client";

import type { DiagnosisTag } from "@/lib/diagnose";
import { useLocale } from "@/lib/i18n";

type DiagnosisResultProps = {
  tags: DiagnosisTag[];
};

export function DiagnosisResult({ tags }: DiagnosisResultProps) {
  const { t } = useLocale();

  if (tags.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium text-black">
          {t("section.recommendedGenres")}
        </h2>
        <p className="text-sm text-neutral-500">{t("result.noTags")}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium text-black">
        {t("section.recommendedGenres")}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag.name}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-black"
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

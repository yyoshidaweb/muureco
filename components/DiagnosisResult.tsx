import type { DiagnosisTag } from "@/lib/diagnose";

type DiagnosisResultProps = {
  tags: DiagnosisTag[];
};

export function DiagnosisResult({ tags }: DiagnosisResultProps) {
  if (tags.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium text-black">おすすめジャンル</h2>
        <p className="text-sm text-neutral-500">診断タグがありません</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium text-black">おすすめジャンル</h2>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag.name}>
            <a
              href={tag.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-black transition-colors hover:bg-neutral-50"
            >
              <span>{tag.name}</span>
              <span className="text-neutral-500">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

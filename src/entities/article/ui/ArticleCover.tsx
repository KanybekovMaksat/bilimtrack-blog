import type { ArticleCategory } from "@/entities/category";

import type { CoverScene } from "../model/types";
import { coverHtml } from "../lib/cover";

interface ArticleCoverProps {
  cat: ArticleCategory;
  cover: CoverScene;
  className?: string;
}

export function ArticleCover({ cat, cover, className }: ArticleCoverProps) {
  // Дефолтная обложка, если она почему-то не задана
  const safeCover = cover || "journal";

  const presets = ["journal", "schedule", "rating", "chat", "stats", "news", "brand"];
  const isPreset = presets.includes(safeCover);

  // Поддерживаем все реальные URL (включая относительные пути и blob-ссылки)
  if (!isPreset) {
    return (
      <div className={className} style={{ display: "contents" }}>
        <div className={`cover cover--${cat}`} style={{ overflow: 'hidden' }}>
          <img src={safeCover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: coverHtml({ cat, cover: safeCover as CoverScene }) }}
    />
  );
}

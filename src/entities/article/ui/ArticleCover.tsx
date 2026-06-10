import type { ArticleCategory } from "@/entities/category";

import type { CoverScene } from "../model/types";
import { coverHtml } from "../lib/cover";

interface ArticleCoverProps {
  cat: ArticleCategory;
  cover: CoverScene;
  className?: string;
}

/** Renders a styled placeholder cover scene for the given category. */
export function ArticleCover({ cat, cover, className }: ArticleCoverProps) {
  if (cover && cover.startsWith("http")) {
    return (
      <div className={className} style={{ display: "contents" }}>
        <div className={`cover cover--${cat}`} style={{ overflow: 'hidden' }}>
          <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: coverHtml({ cat, cover }) }}
    />
  );
}

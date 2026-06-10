import NextLink from "next/link";

import type { Article } from "../model/types";
import { articleHref } from "../model/data";

interface PopularListProps {
  articles: Article[];
}

/** Numbered list of popular articles (sidebar block). */
export function PopularList({ articles }: PopularListProps) {
  return (
    <div className="popular-list">
      {articles.map((a, i) => (
        <NextLink key={a.slug} className="popular-item" href={articleHref(a)}>
          <span className="popular-item__num">{i + 1}</span>
          <span>
            <span className="popular-item__title">{a.title}</span>
            <span className="popular-item__meta">{a.read} мин чтения</span>
          </span>
        </NextLink>
      ))}
    </div>
  );
}

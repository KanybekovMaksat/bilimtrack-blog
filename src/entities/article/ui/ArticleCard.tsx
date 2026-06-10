import NextLink from "next/link";

import { CategoryTag } from "@/entities/category";

import type { Article } from "../model/types";
import { articleHref } from "../model/data";
import { ArticleCover } from "./ArticleCover";

interface ArticleCardProps {
  article: Article;
}

/** Compact article card used in feed grids and "Читать также". */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <NextLink className="card" data-cat={article.cat} href={articleHref(article)}>
      <div className="card__cover">
        <ArticleCover cat={article.cat} cover={article.cover} />
      </div>
      <div className="card__body">
        <CategoryTag category={article.cat} />
        <h3 className="card__title">{article.title}</h3>
        <div className="card__meta">
          <span>{article.date}</span>
          <span className="dot" />
          <span>{article.read} мин чтения</span>
        </div>
      </div>
    </NextLink>
  );
}

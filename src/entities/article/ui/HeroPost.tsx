import NextLink from "next/link";

import { CategoryTag } from "@/entities/category";
import { Icon } from "@/shared/ui";

import type { Article } from "../model/types";
import { articleHref } from "../model/data";
import { ArticleCover } from "./ArticleCover";

interface HeroPostProps {
  article: Article;
}

/** Full-width featured post shown atop the default blog feed. */
export function HeroPost({ article }: HeroPostProps) {
  return (
    <NextLink className="hero-post" href={articleHref(article)}>
      <div className="hero-post__cover">
        <ArticleCover cat={article.cat} cover={article.cover} />
      </div>
      <div className="hero-post__body">
        <span className="hero-post__featured">
          <Icon name="bolt" />
          Главная статья
        </span>
        <CategoryTag category={article.cat} />
        <h2 className="hero-post__title">{article.title}</h2>
        <div className="card__meta">
          <span>{article.date}</span>
          <span className="dot" />
          <span>{article.read} мин чтения</span>
        </div>
        <p className="hero-post__excerpt">{article.excerpt}</p>
        <span className="hero-post__read">
          Читать
          <Icon name="chevron-right" />
        </span>
      </div>
    </NextLink>
  );
}

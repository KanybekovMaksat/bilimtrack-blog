import { ArticleCard } from "./ArticleCard";
import type { Article } from "../model/types";

interface ArticleGridProps {
  articles: Article[];
}

/** Responsive grid for rendering a list of article cards. */
export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="card-grid">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}

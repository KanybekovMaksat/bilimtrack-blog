import type { ArticleCategory } from "@/entities/category";

/** Styled placeholder cover scenes (abstract product mocks). */
export type CoverScene =
  | "journal"
  | "schedule"
  | "rating"
  | "chat"
  | "stats"
  | "news"
  | "brand";

export interface Article {
  id?: string;
  slug: string;
  cat: ArticleCategory;
  cover: CoverScene;
  title: string;
  date: string;
  iso: string;
  /** Reading time in minutes. */
  read: number;
  featured?: boolean;
  popular?: boolean;
  excerpt: string;
  content?: string;
  relatedArticles?: Article[];
  /** Author object from API — { name, avatarUrl } */
  author?: { id?: string; name: string; avatarUrl?: string } | null;
}


import { useCallback, useState, useEffect, useRef } from "react";

import {
  blogApi,
  type ArticleApiItem,
} from "@/shared/api/blog-api";
import {
  CAT_LABEL,
  type CategoryKey,
} from "@/entities/category";

const PAGE_SIZE = 6;

/** Normalised article shape consumed by UI components */
export interface MappedArticle {
  slug: string;
  cat: string;
  cover: string;
  title: string;
  date: string;
  iso: string;
  read: number;
  excerpt: string;
  featured: boolean;
  author?: { id?: string; name: string; avatarUrl?: string } | null;
  relatedArticles?: MappedArticle[];
}

function mapApiItem(item: ArticleApiItem): MappedArticle {
  return {
    slug: item.slug,
    cat: item.category?.slug || "cases",
    cover: item.coverImageUrl || "journal",
    title: item.title,
    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    iso: item.publishedAt,
    read: item.readingTime,
    excerpt: item.excerpt,
    featured: item.featured,
    author: item.author,
    relatedArticles: item.relatedArticles?.map(mapApiItem),
  };
}

export interface ArticleFeed {
  activeCat: CategoryKey;
  inputValue: string;
  isSearching: boolean;
  /** Total count from server meta (used for UI counters). */
  totalCount: number;

  /** Featured hero post — only shown on "all" + no search. */
  hero: MappedArticle | null;
  /** Cards currently visible. */
  visible: MappedArticle[];
  /** Total matching cards (excluding hero). */
  restCount: number;
  heading: string;
  isEmpty: boolean;
  emptyText: string;
  hasMore: boolean;
  isLoading: boolean;

  selectCategory: (key: CategoryKey) => void;
  search: (value: string) => void;
  applyTopic: (label: string, term: string) => void;
  loadMore: () => void;
}

/**
 * Orchestrates the blog feed via server-side API.
 * All filtering (category, search), pagination and featured-hero selection
 * are delegated to GET /blog/articles/ — no client-side .filter() or .slice().
 */
export function useArticleFeed(
  initialCategory: CategoryKey = "all"
): ArticleFeed {
  const [activeCat, setActiveCat] = useState<CategoryKey>(initialCategory);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");

  const [articles, setArticles] = useState<MappedArticle[]>([]);
  const [hero, setHero] = useState<MappedArticle | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to current page so loadMore can increment it without stale closures
  const pageRef = useRef(1);

  const isSearching = query.length > 0;
  const showHero = activeCat === "all" && !isSearching;

  // ─── Fetch hero once on mount (featured=true) ────────────────────────────
  useEffect(() => {
    blogApi
      .getArticles({ featured: true, pageSize: 1 })
      .then((res) => {
        if (res?.data?.length) {
          setHero(mapApiItem(res.data[0]));
        }
      })
      .catch((err) => console.error("Failed to fetch featured hero", err));
  }, []);

  // ─── Fetch feed whenever category or search term changes ─────────────────
  useEffect(() => {
    pageRef.current = 1;
    setIsLoading(true);
    setArticles([]);

    const params: Parameters<typeof blogApi.getArticles>[0] = {
      page: 1,
      pageSize: PAGE_SIZE,
    };
    if (activeCat !== "all") params.category = activeCat;
    if (query) params.search = query;

    blogApi
      .getArticles(params)
      .then((res) => {
        if (!res) return;
        const mapped = (res.data ?? []).map(mapApiItem);
        setArticles(mapped);
        setTotalCount(res.meta?.count ?? mapped.length);
        setNextUrl(res.meta?.next ?? null);
      })
      .catch((err) => console.error("Failed to fetch articles", err))
      .finally(() => setIsLoading(false));
  }, [activeCat, query]);

  // ─── Load next page ───────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (!nextUrl || isLoading) return;
    setIsLoading(true);

    fetch(nextUrl)
      .then((r) => r.json())
      .then((res) => {
        const mapped = (res.data ?? []).map(mapApiItem);
        setArticles((prev) => [...prev, ...mapped]);
        setNextUrl(res.meta?.next ?? null);
      })
      .catch((err) => console.error("Failed to load more articles", err))
      .finally(() => setIsLoading(false));
  }, [nextUrl, isLoading]);

  // ─── When hero is shown we exclude it from the card grid ─────────────────
  const visible = showHero && hero
    ? articles.filter((a) => a.slug !== hero.slug)
    : articles;

  const heading = showHero
    ? "Свежие статьи"
    : isSearching
      ? `Результаты: «${query}»`
      : CAT_LABEL[activeCat];

  // ─── Event handlers ───────────────────────────────────────────────────────
  const selectCategory = useCallback((key: CategoryKey) => {
    setActiveCat(key);
    setQuery("");
    setInputValue("");
  }, []);

  const search = useCallback((value: string) => {
    setInputValue(value);
    setQuery(value.trim());
  }, []);

  const applyTopic = useCallback((label: string, term: string) => {
    setActiveCat("all");
    setInputValue(label);
    setQuery(term);
  }, []);

  return {
    activeCat,
    inputValue,
    isSearching,
    totalCount,
    hero: showHero ? hero : null,
    visible,
    restCount: visible.length,
    heading,
    isEmpty: !isLoading && visible.length === 0,
    emptyText: isSearching
      ? "По запросу ничего не найдено. Попробуйте другой запрос."
      : "В этой категории пока нет статей.",
    hasMore: nextUrl !== null,
    isLoading,
    selectCategory,
    search,
    applyTopic,
    loadMore,
  };
}

import type { GetStaticProps } from "next";

import { BlogPage } from "@/pages/blog-home";
import { blogApi } from "@/shared/api/blog-api";
import { ARTICLES, type Article } from "@/entities/article";

/**
 * SSG: fetch articles at build time for SEO.
 * Falls back to mock data if the API is unreachable.
 */
export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await blogApi.getArticles({ limit: 50 });
    const apiArticles: any[] = res?.data ?? [];

    if (apiArticles.length === 0) {
      throw new Error("API returned empty article list");
    }

    const initialArticles: Article[] = apiArticles.map((item: any) => ({
      slug: item.slug,
      cat: item.category?.slug || "cases",
      // coverImageUrl from API — fall back to a css-scene key
      cover: item.coverImageUrl || "journal",
      title: item.title,
      date: item.publishedAt
        ? new Date(item.publishedAt).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
      iso: item.publishedAt ?? "",
      read: item.readingTime || 5,
      excerpt: item.excerpt ?? "",
      featured: !!item.featured,
      author: item.author ?? null,
    }));

    return {
      props: { initialArticles },
      revalidate: 60, // ISR: revalidate every 60 s
    };
  } catch (error) {
    console.error(
      "[blog/index] API unavailable, falling back to mock data:",
      error
    );
    return {
      props: { initialArticles: ARTICLES },
      revalidate: 60,
    };
  }
};

export default BlogPage;

import type { GetStaticPaths, GetStaticProps } from "next";

import { ArticlePage } from "@/pages/article";
import { blogApi } from "@/shared/api/blog-api";
import { type Article } from "@/entities/article";

// ---------------------------------------------------------------------------
// getStaticPaths — build paths from API; fallback: "blocking" handles new slugs
// ---------------------------------------------------------------------------
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await blogApi.getArticles({ pageSize: 100 });
    const apiArticles: any[] = res?.data ?? [];

    const paths = apiArticles.map((a: any) => ({ params: { slug: a.slug } }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("[getStaticPaths] API unavailable:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

// ---------------------------------------------------------------------------
// getStaticProps — fetch full article from API, fall back to mock data
// ---------------------------------------------------------------------------
export const getStaticProps: GetStaticProps<
  { article: Article; popular: Article[] },
  { slug: string }
> = async (context) => {
  const slug = context.params?.slug;
  const lang = context.locale || "ru";
  if (!slug) return { notFound: true };

  try {
    const [res, popularRes] = await Promise.all([
      blogApi.getArticle(slug, lang),
      blogApi.getPopular(lang),
    ]);

    // Unwrap { data: {...} }
    const item: any = res?.data ?? null;

    if (!item || !item.slug) {
      throw new Error(`API returned no article data for slug: ${slug}`);
    }

    // Map related articles — readingTime comes from API, no fallback needed
    const relatedArticles: Article[] = (item.relatedArticles ?? []).map(
      (r: any) => ({
        id: r.id,
        slug: r.slug,
        cat: r.category?.slug || "cases",
        cover: r.coverImageUrl || "journal",
        title: r.title,
        date: r.publishedAt
          ? new Date(r.publishedAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
        iso: r.publishedAt ?? "",
        read: r.readingTime,
        excerpt: r.excerpt ?? "",
        author: r.author ?? null,
      })
    );

    const article: Article = {
      id: item.id,
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
      iso: item.publishedAt ?? "",
      // readingTime is now stable from the API — no fallback needed
      read: item.readingTime,
      excerpt: item.excerpt ?? "",
      content: item.content ?? "",
      featured: !!item.featured,
      relatedArticles,
      author: item.author ?? null,
    };

    const popular: Article[] = (popularRes?.data ?? []).map(
      (r: any) => ({
        id: r.id,
        slug: r.slug,
        cat: r.category?.slug || "cases",
        cover: r.coverImageUrl || "journal",
        title: r.title,
        date: r.publishedAt
          ? new Date(r.publishedAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
        iso: r.publishedAt ?? "",
        read: r.readingTime,
        excerpt: r.excerpt ?? "",
        author: r.author ?? null,
      })
    );

    return {
      props: { article, popular },
      revalidate: 60,
    };
  } catch (error) {
    console.error(
      `[getStaticProps] API failed for slug "${slug}":`,
      error
    );
    return { notFound: true };
  }
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function ArticleRoute({ article, popular }: { article: Article; popular: Article[] }) {
  return <ArticlePage article={article} popular={popular} />;
}

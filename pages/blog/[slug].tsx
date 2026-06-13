import type { GetStaticPaths, GetStaticProps } from "next";

import { ArticlePage } from "@/pages/article";
import { blogApi } from "@/shared/api/blog-api";
import { ARTICLES, type Article } from "@/entities/article";

// ---------------------------------------------------------------------------
// getStaticPaths — build paths from API, fall back to mock slugs
// ---------------------------------------------------------------------------
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await blogApi.getArticles({ limit: 50 });
    const apiArticles: any[] = res?.data ?? [];

    // Use API paths if available, otherwise fall back to mock slugs so the
    // site stays navigable even when the API is unreachable at build time.
    const paths =
      apiArticles.length > 0
        ? apiArticles.map((a: any) => ({ params: { slug: a.slug } }))
        : ARTICLES.map((a) => ({ params: { slug: a.slug } }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("[getStaticPaths] API unavailable, falling back to mock slugs:", error);
    return {
      paths: ARTICLES.map((a) => ({ params: { slug: a.slug } })),
      fallback: "blocking",
    };
  }
};

// ---------------------------------------------------------------------------
// getStaticProps — fetch full article from API, fall back to mock data
// ---------------------------------------------------------------------------
export const getStaticProps: GetStaticProps<
  { article: Article },
  { slug: string }
> = async ({ params }) => {
  const slug = params?.slug;
  if (!slug) return { notFound: true };

  try {
    const res = await blogApi.getArticle(slug);

    // Unwrap { data: {...} }
    const item: any = res?.data ?? null;

    if (!item || !item.slug) {
      throw new Error(`API returned no article data for slug: ${slug}`);
    }

    // Map related articles
    const relatedArticles: Article[] = (item.relatedArticles ?? []).map(
      (r: any) => ({
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
        read: r.readingTime || 5,
        excerpt: r.excerpt ?? "",
        author: r.author ?? null,
      })
    );

    const article: Article = {
      slug: item.slug,
      cat: item.category?.slug || "cases",
      // coverImageUrl from API takes priority; fall back to css-scene key
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
      // content is the HTML body returned by the API
      content: item.content ?? "",
      relatedArticles,
      // Preserve author object for ArticlePage to display
      author: item.author ?? null,
    };

    return {
      props: { article },
      revalidate: 60,
    };
  } catch (error) {
    console.error(
      `[getStaticProps] API failed for slug "${slug}", using mock fallback:`,
      error
    );

    // Safe fallback — find mock article or return 404
    const mockArticle = ARTICLES.find((a) => a.slug === slug);
    if (!mockArticle) return { notFound: true };

    return {
      props: { article: mockArticle },
      revalidate: 60,
    };
  }
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function ArticleRoute({ article }: { article: Article }) {
  return <ArticlePage article={article} />;
}

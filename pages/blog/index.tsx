import type { GetStaticProps } from "next";

import { BlogHomePage } from "@/pages/blog-home";
import { blogApi } from "@/shared/api/blog-api";
import { mapApiItem } from "@/features/filter-articles";

/**
 * SSG entry point for /blog.
 * Fetches initial articles and hero data on the server for better SEO.
 */
export const getStaticProps: GetStaticProps = async (context) => {
  const lang = context.locale || "ru";
  try {
    const [heroRes, feedRes] = await Promise.all([
      blogApi.getArticles({ featured: true, pageSize: 1, lang }),
      blogApi.getArticles({ page: 1, pageSize: 6, lang }),
    ]);

    const initialHero = heroRes?.data?.[0] ? mapApiItem(heroRes.data[0]) : null;
    const initialArticles = (feedRes?.data ?? []).map(mapApiItem);
    const initialTotalCount = feedRes?.meta?.count ?? initialArticles.length;
    const initialNextUrl = feedRes?.meta?.next ?? null;

    return {
      props: {
        initialHero,
        initialArticles,
        initialTotalCount,
        initialNextUrl,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("[getStaticProps] Failed to fetch articles for blog index:", error);
    return {
      props: {
        initialHero: null,
        initialArticles: [],
        initialTotalCount: 0,
        initialNextUrl: null,
      },
      revalidate: 60,
    };
  }
};

export default BlogHomePage;

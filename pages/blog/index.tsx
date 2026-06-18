import type { GetStaticProps } from "next";

import { BlogHomePage } from "@/pages/blog-home";

/**
 * SSG entry point for /blog.
 * All data fetching is now handled client-side by useArticleFeed via the
 * updated GET /blog/articles/ API (supports search, featured, pageSize, page).
 * No props need to be passed — the hook manages its own loading state.
 */
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60,
  };
};

export default BlogHomePage;

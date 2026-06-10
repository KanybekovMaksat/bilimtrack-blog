import type { AppProps } from "next/app";

import { AppProviders } from "@/shared/providers";

// Global styles — order matters:
//   1. Tailwind + HeroUI base   2. design tokens   3. component CSS
//   4. app glue (brand theming on top of HeroUI).
import "@/shared/styles/globals.css";
import "@/shared/styles/colors_and_type.css";
import "@/shared/styles/blog.css";
import "@/shared/styles/article.css";
import "@/shared/styles/admin.css";
import "@/shared/styles/app.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}

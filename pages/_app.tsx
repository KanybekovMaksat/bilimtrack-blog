import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AppProviders } from "@/shared/providers";
import { RequireAuth } from "@/features/auth/RequireAuth";

// Global styles — order matters:
//   1. Mantine styles (for CMS) 2. Tailwind + HeroUI base 3. design tokens
//   4. component CSS            5. app glue (brand theming on top of HeroUI).
import "@mantine/core/styles.css";
import "@/shared/styles/globals.css";
import "@/shared/styles/colors_and_type.css";
import "@/shared/styles/blog.css";
import "@/shared/styles/article.css";
import "@/shared/styles/admin.css";
import "@/shared/styles/app.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isWriterRoute = router.pathname.startsWith("/writer");
  const isLoginRoute = router.pathname === "/writer/login";

  const renderContent = () => {
    if (isWriterRoute && !isLoginRoute) {
      return (
        <RequireAuth>
          <Component {...pageProps} />
        </RequireAuth>
      );
    }
    return <Component {...pageProps} />;
  };

  return (
    <AppProviders>
      {renderContent()}
    </AppProviders>
  );
}

import type { ReactNode } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App-wide providers. HeroUI v3 components are styleable without a context
 * provider (styles come from `@heroui/styles`), so we only wrap with the
 * theme provider here; brand theming lives in `app/styles/app.css`.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      {children}
    </NextThemesProvider>
  );
}

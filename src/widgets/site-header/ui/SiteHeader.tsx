import NextLink from "next/link";
import { useRouter } from "next/router";

import { Button, Icon } from "@/shared/ui";
import { siteConfig } from "@/shared/config";
import { cn } from "@/shared/lib";

interface SiteHeaderProps {
  /** Marks the matching nav link active (defaults to the blog). */
  activeHref?: string;
}

/** Sticky site chrome: brand + minimal nav + demo CTA. */
export function SiteHeader({ activeHref = "/blog" }: SiteHeaderProps) {
  const router = useRouter();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NextLink aria-label="Bilimtrack" className="brand" href="/blog">
          <img alt="" src="/logo-mark.png" />
          <span className="brand__name">Bilimtrack</span>
        </NextLink>
        <nav className="header-nav">
          {siteConfig.nav.map((item) => (
            <NextLink
              key={item.label}
              className={cn(item.href === activeHref && "is-active")}
              href={item.href}
            >
              {item.label}
            </NextLink>
          ))}
        </nav>
        <span className="header-spacer" />
        <div className="lang-selector">
          {(["ru", "ky", "en"] as const).map((l) => (
            <NextLink
              key={l}
              href={router.asPath}
              locale={l}
              className={cn("lang-btn", router.locale === l && "is-active")}
            >
              {l.toUpperCase()}
            </NextLink>
          ))}
        </div>
        <Button href={siteConfig.demoHref} size="sm">
          Получить демо
          <Icon name="chevron-right" />
        </Button>
      </div>
    </header>
  );
}

import NextLink from "next/link";

import { siteConfig } from "@/shared/config";

/** Site footer: brand, secondary nav, OurEra Soft attribution. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <NextLink className="brand" href="/blog">
          <img
            alt=""
            src="/logo-mark.png"
            style={{ width: 28, height: 28 }}
          />
          <span className="brand__name">Bilimtrack</span>
        </NextLink>
        <nav className="site-footer__links">
          {siteConfig.footerNav.map((item) => (
            <NextLink key={item.label} href={item.href}>
              {item.label}
            </NextLink>
          ))}
        </nav>
        <span className="site-footer__legal">{siteConfig.legal}</span>
      </div>
    </footer>
  );
}

/** Global site metadata + primary nav for the Bilimtrack blog. */
export const siteConfig = {
  name: "Bilimtrack",
  tagline: "Образовательная экосистема",
  legal: "Разработано OurEra Soft",
  description:
    "Практические материалы для руководителей учебных организаций — кейсы, советы и разборы инструментов.",
  /** Canonical origin — used to build absolute URLs for Open Graph / canonical. */
  url: "https://about.bilimtrack.com",
  /** Default social-share image (absolute path under /public). */
  ogImage: "/dashboard.png",
  locale: "ru_RU",
  nav: [
    { label: "Возможности", href: "/#product" },
    { label: "Блог", href: "/blog" },
  ],
  footerNav: [
    { label: "Возможности", href: "/#product" },
    { label: "Блог", href: "/blog" },
    { label: "Демо", href: "#demo" },
  ],
  demoHref: "#demo",
} as const;

export type SiteConfig = typeof siteConfig;

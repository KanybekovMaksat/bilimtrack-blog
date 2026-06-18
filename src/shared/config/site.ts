/** Global site metadata + primary nav for the Bilimtrack blog. */
export const siteConfig = {
  name: "Bilimtrack",
  tagline: "Образовательная экосистема",
  legal: "Разработано OurEra Soft",
  description:
    "Практические материалы для руководителей учебных организаций — кейсы, советы и разборы инструментов.",
  nav: [
    { label: "Возможности", href: "/features" },
    { label: "Цены", href: "/pricing" },
    { label: "Блог", href: "/blog" },
  ],
  footerNav: [
    { label: "Возможности", href: "/features" },
    { label: "Цены", href: "/pricing" },
    { label: "Блог", href: "/blog" },
    { label: "Демо", href: "#demo" },
  ],
  demoHref: "#demo",
} as const;

export type SiteConfig = typeof siteConfig;
